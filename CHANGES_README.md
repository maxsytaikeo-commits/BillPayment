# สรุปการแก้ไข: Mismatch / Timeout Detection

ไฟล์ในนี้เป็นเฉพาะไฟล์ที่ **แก้ไข/เพิ่มใหม่** เท่านั้น (โครงสร้าง path ตรงกับโปรเจกต์เดิม
สามารถ copy ทับ/วางลง `src/main/...` ของโปรเจกต์เดิมได้เลย)

## ไฟล์ใหม่
- `exception/PartnerTimeoutException.java` — exception แทนกรณี provider ไม่ตอบกลับภายในเวลาที่กำหนด
- `service/TimeoutMonitorService.java` — scheduled job (safety net) สแกนรายการ PENDING ที่ค้างเกิน threshold แล้ว escalate เป็น mismatch อัตโนมัติ

## ไฟล์ที่แก้ไข
- `service/PaymentService.java`
  - `callPartnerPay()` mock ครบ 3 เคสแล้ว: SUCCESS / FAILED (consumerNo ขึ้นต้น "9") / **TIMEOUT** (ขึ้นต้น "8" → throw `PartnerTimeoutException`)
  - `confirmPayment()` แยก handling ของ timeout ออกจาก mismatch ปกติ: status ตั้งเป็น PENDING, providerStatus = "TIMEOUT", ไม่ mark FAILED ทันที (ป้องกันการปฏิเสธลูกค้าที่จริง provider อาจเก็บเงินไปแล้ว)
- `service/RetryService.java`
  - `callPartnerRetry()` เปลี่ยนจาก hardcode "SUCCESS" เป็น mock แบบสมจริง (~70% SUCCESS, ~20% FAILED, ~10% ยังคง PENDING) แทนการ status-inquiry จริงกับ provider
  - `retry()` จะ resolve mismatch เฉพาะตอนที่ผลลัพธ์ชัดเจนแล้วเท่านั้น (ไม่ resolve ถ้ายัง PENDING)
- `repository/MismatchLogRepository.java` — เพิ่ม `existsByTransactionLog_Xref` กันสร้าง mismatch ซ้ำ
- `repository/TransactionLogRepository.java` — เพิ่ม `findByActionAndStatusAndTxnDateBefore` ให้ `TimeoutMonitorService` ใช้
- `BillPaymentApplication.java` — เพิ่ม `@EnableScheduling` (จำเป็นสำหรับ `TimeoutMonitorService`)
- `application.properties` — เพิ่ม 2 property ใหม่ต่อท้ายไฟล์เดิม:
  ```
  billpayment.timeout.threshold-minutes=2
  billpayment.timeout.scan-interval-ms=60000
  ```

## วิธีทดสอบ mock
1. `POST /api/billpayment/confirm?statementBillNo=xxx` โดยที่ invoice นั้น consumerNo ขึ้นต้นด้วย:
   - `9...` → เข้า flow mismatch ปกติ (bank SUCCESS / partner FAILED)
   - `8...` → เข้า flow **timeout** (status PENDING, mismatch providerStatus=TIMEOUT)
   - อื่นๆ → SUCCESS ปกติ
2. เช็ค `GET /api/mismatch` จะเห็นรายการที่เพิ่งสร้าง (resolutionStatus=OPEN)
3. `POST /api/billpayment/retry/{xref}` หรือ `POST /api/transaction/{xref}/retry` เพื่อ retry — ผลจะสุ่มได้ทั้ง SUCCESS/FAILED/PENDING ตาม xref
4. ถ้าไม่ retry เลย และปล่อยรายการ PENDING ค้างไว้เกิน 2 นาที (ตาม threshold ที่ตั้ง) → `TimeoutMonitorService` จะ auto-flag เป็น mismatch ให้เอง (ทดสอบเร็วขึ้นได้โดยลด `billpayment.timeout.threshold-minutes` และ `scan-interval-ms` ใน properties)

## เพิ่ม 2 challenge case (รอบล่าสุด)

### Payment status mismatch (ลูกค้าจ่ายแล้ว แต่ระบบแจ้งไม่สำเร็จ)
- `PaymentService.mockBankResult()` (ใหม่) — mock ฝั่ง bank แยกจาก partner แล้ว: consumerNo ขึ้นต้น `7` → bank บันทึกว่า FAILED ทั้งที่ partner (`callPartnerPay`) จะ return SUCCESS จริง
- ผลคือ mismatch ที่มี `bankStatus=FAILED, providerStatus=SUCCESS` — logic เดิม (`if bankResult.equals(partnerResult)`) จับ case นี้ได้อัตโนมัติอยู่แล้ว เพียงแค่แยก mock ให้ bank กับ partner ไม่ผูกกันตายตัว
- เพิ่ม branch พิเศษใน mismatchReason: ถ้า `partnerResult=SUCCESS` แต่ `bankResult!=SUCCESS` → ติด label `[HIGH PRIORITY]` เพราะเป็นเคสอันตรายที่สุด (ลูกค้าจ่ายจริงแล้วแต่ระบบไม่รู้)

### Duplicate payment (ลูกค้าจ่ายซ้ำ)
- เพิ่ม `TransactionLogRepository.findByBillInvoice_StatementBillNoAndAction()` — ดึงประวัติการจ่าย (ACTION=PAY) ทั้งหมดของบิลเดียวกัน
- `PaymentService.confirmPayment()` เช็คก่อนเรียก provider ทุกครั้ง:
  - ถ้ามีรายการ `SUCCESS` อยู่แล้ว → block ทันที (`REJECTED`, RESP_CODE=06) ไม่เรียก provider ซ้ำ
  - ถ้ามีรายการ `PENDING` (mismatch/timeout ที่ยังไม่ resolve) → block เช่นกัน (`REJECTED`, RESP_CODE=07) กันไม่ให้จ่ายซ้ำระหว่างรอ reconcile
- `rejectDuplicate()` (ใหม่) — helper สร้าง TransactionLog สถานะ REJECTED โดยไม่แตะ provider เลย (ไม่มีความเสี่ยงเก็บเงินซ้ำ)
- 2 case นี้เชื่อมกัน: ถ้า "payment status mismatch" (case `7`) ไม่ถูกจับไว้เป็น mismatch, ลูกค้าจะเข้าใจผิดว่ายังไม่จ่ายแล้วกดจ่ายซ้ำ → duplicate-payment guard คือด่านที่กันไม่ให้กลายเป็นการจ่ายซ้ำจริงกับ provider

### ตาราง mock consumerNo prefix ทั้งหมด (สรุปรวม)
| consumerNo ขึ้นต้นด้วย | bankResult | partnerResult (หรือ exception) | ผลลัพธ์ |
|---|---|---|---|
| `9...` | SUCCESS | FAILED | mismatch ปกติ |
| `8...` | (throw timeout ก่อนถึง bankResult) | timeout | mismatch: providerStatus=TIMEOUT |
| `7...` | FAILED | SUCCESS | mismatch: **[HIGH PRIORITY]** payment status mismatch |
| อื่นๆ | SUCCESS | SUCCESS | จ่ายสำเร็จปกติ |
| (จ่ายซ้ำบิลเดิมที่ SUCCESS/PENDING แล้ว) | — | — | REJECTED (duplicate payment blocked) |

## เรื่อง "ต้องมีหน้าจอฝั่ง provider แยกไหม?"

**ไม่ต้อง.** Transaction monitoring ใช้ `TB_TRANSACTION_LOG` (ฝั่งเรา) เป็น source of truth เดียว
โดยคอลัมน์ `RES_DATA` (ที่ schema มีอยู่แล้วแต่ยังไม่เคยถูกใช้) ตอนนี้ถูกเติมด้วย `buildProviderRawResponse()`
เพื่อเก็บ "สิ่งที่ provider ตอบกลับมาจริง" ไว้ในแถวเดียวกับสถานะฝั่งเรา — ทำให้ operation team เห็นทั้งสองฝั่ง
(bank status + provider raw response) ในหน้าจอเดียว ไม่ต้องสร้างระบบ/หน้าจอแยกสำหรับฝั่ง provider
- case timeout: `RES_DATA` ตั้งใจปล่อย null (สอดคล้องกับความหมายจริงของ timeout คือไม่มี response ให้เก็บ)
- case duplicate-reject: ไม่มีการเรียก provider เลย จึงไม่มี `RES_DATA` เช่นกัน

## Mismatch dashboard: filter ตาม providerStatus (เช่น TIMEOUT)

### ไฟล์ใหม่
- `dto/MismatchDashboardDTO.java` — DTO ที่ dashboard ใช้จริง (ไม่ส่ง entity `MismatchLog` ตรงๆ ออก API เพื่อกัน lazy-loading ของ association และคุม field ที่ frontend เห็น) รวม field จาก `TransactionLog` ที่เกี่ยวข้อง (xref, consumerNo, serviceCode, providerCode, action, txnDate) เข้ามาให้ในแถวเดียว

### ไฟล์ที่แก้ไข
- `repository/MismatchLogRepository.java` — เพิ่ม
  - `findByProviderStatus(String)` — filter เฉพาะ providerStatus (เช่น `TIMEOUT`)
  - `findByResolutionStatusAndProviderStatus(String, String)` — filter 2 ตัวพร้อมกัน (เช่น `OPEN` + `TIMEOUT` = "timeout ที่ยังไม่ resolve")
- `service/MismatchService.java` — `dashboard()` เปลี่ยน signature เป็น `dashboard(String resolutionStatus, String providerStatus)`, เลือก query ตามว่า filter ไหนถูกส่งมาบ้าง (ทั้งคู่/อันใดอันหนึ่ง/ไม่มีเลย) แล้ว map เป็น `List<MismatchDashboardDTO>`
- `controller/MismatchController.java` — endpoint เดิม `GET /api/mismatch` รับ query param เพิ่ม `providerStatus` (optional) ควบคู่กับ `resolutionStatus` เดิม

### ตัวอย่างการเรียกใช้
```
GET /api/mismatch                                    -> ทั้งหมด
GET /api/mismatch?resolutionStatus=OPEN               -> เฉพาะที่ยังไม่ resolve (เหมือนเดิม)
GET /api/mismatch?providerStatus=TIMEOUT               -> เฉพาะ timeout ทั้งหมด (resolve แล้วหรือยังก็ตาม)
GET /api/mismatch?resolutionStatus=OPEN&providerStatus=TIMEOUT   -> timeout ที่ยังค้างอยู่เท่านั้น
```

ค่า `providerStatus` ที่มีในระบบตอนนี้: `SUCCESS`, `FAILED`, `TIMEOUT`, `UNKNOWN` (มาจาก `TimeoutMonitorService` เมื่อไม่รู้ผลจริง)

## ข้อสังเกตเพิ่มเติม (ไม่ได้แก้ในรอบนี้)
- `application.properties` มี DB credential จริงฝังอยู่ในไฟล์ (host, username, password) — สำหรับ production/ส่งงานจริงควรย้ายไป environment variable หรือ `.env` ที่ไม่ commit เข้า git

## Sync กับโปรเจกต์ล่าสุด (มี Reports feature + UI ใหม่เพิ่มเข้ามาเอง)

โปรเจกต์ที่อัปโหลดรอบนี้มีการพัฒนาต่อเอง (ฟีเจอร์ Reports, ปรับ UI receipt, แก้ typo `getServiceCode`)
แต่ตอน merge กลับมีบางจุดของ mismatch/timeout ที่ทำไว้ก่อนหน้าขาดหายหรือถูกตัดทอน เลยแก้/sync ให้ครบดังนี้:

### แก้ให้ตรงกับของเดิม
- `service/PaymentService.java` — ข้อความ `[HIGH PRIORITY]` ใน mismatchReason (case payment status mismatch) ถูกตัดสั้นเหลือแค่ `bankResult` เฉยๆ ระหว่าง merge — คืนข้อความเต็มแล้ว
- `dto/MismatchDashboardDTO.java` — ไม่ต้องแก้ เพราะ `getServiceCode()` (ไม่มี typo) ถูกใช้ถูกต้องอยู่แล้วในเวอร์ชันนี้ (typo `getServiceCOde` ถูกแก้ต้นทางที่ `ServiceMaster.java` เรียบร้อยแล้ว)

### เพิ่มกลับเข้าไปใหม่ (หายไปตอน merge)
- `entity/BillInvoice.java` — เพิ่ม `@Transient LocalDateTime paymentDate` (เดิมตั้งชื่อ `paidDate` แต่เปลี่ยนมาใช้ `paymentDate` ให้ตรงกับที่ frontend เวอร์ชันใหม่เรียกใช้ `billData.paymentDate`)
- `service/BillInquiryService.java` — หา transaction ที่ PAY+SUCCESS แล้ว set `invoice.setPaymentDate(resDate ?: txnDate)` (ก่อนหน้านี้ใน zip ที่อัปมาเหลือแค่เช็ค boolean `alreadyPaid` เฉยๆ ไม่มีการคำนวณวันที่)

### Frontend
- `components/PaySimulator.jsx` — เพิ่ม `formatDateTime()` กลับเข้ามา แล้วใช้ format วันที่ให้อ่านง่ายทั้งจุดที่โชว์ `billData.paymentDate` (step 2) และ `receiptTime` (step 3 receipt ที่เพิ่งปรับ UI ใหม่) — คง layout/ดีไซน์ใหม่ที่ทำเองไว้ทั้งหมด แก้แค่การ format วันที่
- `components/MismatchLog.jsx` — เพิ่ม dropdown filter ตาม `providerStatus` (All / SUCCESS / FAILED / TIMEOUT / UNKNOWN ตามที่มีข้อมูลจริง) filter ฝั่ง frontend จาก list ที่โหลดมาแล้ว พร้อมสีแยกชัดเจน: SUCCESS=เขียว, TIMEOUT=เหลือง/ส้ม, อื่นๆ=แดง (เดิมมีแค่เขียว/แดง 2 สี)
  - หมายเหตุ: backend endpoint `GET /api/mismatch?providerStatus=` รองรับ filter แบบ server-side อยู่แล้ว ถ้า dataset ใหญ่ขึ้นในอนาคตแนะนำเปลี่ยนมาเรียก API ใหม่ทุกครั้งที่เปลี่ยน filter แทนการ filter ฝั่ง client

### ไฟล์ที่ตรวจสอบแล้วว่าไม่มีอะไรขาด (identical กับที่เคยส่งไปก่อนหน้า)
`repository/MismatchLogRepository.java`, `repository/TransactionLogRepository.java`, `service/MismatchService.java`,
`controller/MismatchController.java`, `service/TimeoutMonitorService.java`, `service/RetryService.java`,
`exception/PartnerTimeoutException.java`, `BillPaymentApplication.java`, `application.properties`
