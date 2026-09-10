package BillPayment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import BillPayment.entity.BillInvoice;
import BillPayment.entity.MismatchLog;
import BillPayment.entity.TransactionLog;
import BillPayment.exception.PartnerTimeoutException;
import BillPayment.repository.BillInvoiceRepository;
import BillPayment.repository.MismatchLogRepository;
import BillPayment.repository.TransactionLogRepository;

@Service
public class PaymentService {
    @Autowired private TransactionLogRepository txnRepo;
    @Autowired private BillInvoiceRepository invoiceRepo;
    @Autowired private MismatchLogRepository mismatchRepo;

    public TransactionLog confirmPayment(String statementBillNo) {
        BillInvoice invoice = invoiceRepo.findById(statementBillNo)
                .orElseThrow(() -> new RuntimeException("Bill invoice not found"));

        // ===== ກວດ Duplicate payment ກ່ອນ ເອີ້ນ provider ທຸກຄັ້ງ =====
        // ຫ້າມ debit ຊ້ຳຖ້າບິນນີ້ຈ່າຍສຳເລັດແລ້ວ ຫຼື ຍັງມີລາຍການຄ້າງລໍຖ້າ resolve ຢູ່
        List<TransactionLog> priorAttempts =
                txnRepo.findByBillInvoice_StatementBillNoAndAction(statementBillNo, "PAY");

        boolean alreadyPaid = priorAttempts.stream()
                .anyMatch(t -> "SUCCESS".equals(t.getStatus()));
        if (alreadyPaid) {
            return rejectDuplicate(invoice, statementBillNo,
                    "06", "Duplicate payment blocked: bill ນີ້ຈ່າຍສຳເລັດໄປແລ້ວ (STATEMENT_BILL_NO=" + statementBillNo + ")");
        }

        boolean hasUnresolvedAttempt = priorAttempts.stream()
                .anyMatch(t -> "PENDING".equals(t.getStatus()));
        if (hasUnresolvedAttempt) {
            return rejectDuplicate(invoice, statementBillNo,
                    "07", "ມີລາຍການຈ່າຍບິນນີ້ຄ້າງລໍຖ້າກວດສອບຢູ່ (mismatch/timeout ຍັງບໍ່ resolve) - ກະລຸນາລໍຖ້າ ຫຼື ຕິດຕໍ່ support ກ່ອນຈ່າຍຊ້ຳ");
        }
        // ==============================================================

        TransactionLog payTxn = new TransactionLog();
        payTxn.setXref("XR" + System.currentTimeMillis());
        payTxn.setConsumerNo(invoice.getConsumerNo());
        payTxn.setProvider(invoice.getProvider());

        // 🔴 ແກ້ໄຂ: ດຶງ Service ຜ່ານ Provider ຢ່າງຖືກຕ້ອງ
        if (invoice.getProvider() != null) {
            payTxn.setService(invoice.getProvider().getService());
        }

        payTxn.setAction("PAY");
        payTxn.setBillInvoice(invoice);
        payTxn.setTxnDate(LocalDateTime.now());

        String bankResult = mockBankResult(invoice);
        String partnerResult;

        try {
            partnerResult = callPartnerPay(invoice);
        } catch (PartnerTimeoutException ex) {
            // Provider ບໍ່ຕອບກັບເລີຍພາຍໃນເວລາທີ່ກຳນົດ (network/timeout).
            // ບໍ່ຮູ້ວ່າ provider ດຳເນີນການໄປແລ້ວ ຫຼື ບໍ່ -> ຫ້າມ mark ວ່າ FAILED ທັນທີ
            // (ຈະ retry / reconcile ພາຍຫຼັງແທນ, ເພື່ອປ້ອງກັນການເກັບເງິນຊ້ຳ ຫຼື ປະຕິເສດລູກຄ້າຜິດ)
            payTxn.setStatus("PENDING");
            payTxn.setRespCode("99");
            payTxn.setRespDesc(ex.getMessage());
            // RES_DATA ຕັ້ງໃຈປະໄວ້ null - ຄືຄວາມໝາຍຈິງຂອງ timeout: ບໍ່ມີ raw response ໃຫ້ເກັບ
            txnRepo.save(payTxn);

            MismatchLog mismatch = new MismatchLog();
            mismatch.setTransactionLog(payTxn);
            mismatch.setBankStatus("PENDING");
            mismatch.setProviderStatus("TIMEOUT");
            mismatch.setMismatchReason("Provider ບໍ່ຕອບກັບພາຍໃນເວລາທີ່ກຳນົດ (timeout) - ຕ້ອງ reconcile/retry ພາຍຫຼັງ");
            mismatch.setResolutionStatus("OPEN");
            mismatchRepo.save(mismatch);

            return payTxn;
        }

        // ກໍລະນີ Bank ແລະ Partner ສະຖານະ ຕົງກັນ
        if (bankResult.equals(partnerResult)) {
            payTxn.setStatus(bankResult);
            payTxn.setRespCode("00");
            payTxn.setRespDesc("Success");
            payTxn.setResDate(LocalDateTime.now());
            payTxn.setResData(buildProviderRawResponse(partnerResult, invoice, payTxn.getXref()));
            return txnRepo.save(payTxn);
        }

        // ===== ກໍລະນີ ເກີດ Mismatch (bankResult != partnerResult) =====
        payTxn.setStatus("PENDING");
        payTxn.setRespCode("02");
        payTxn.setRespDesc("Bank/Partner status mismatch");
        payTxn.setResDate(LocalDateTime.now());
        // 🔽 ນີ້ຄື "ສິ່ງທີ່ provider ຕອບກັບມາຈິງ" - ບໍ່ຕ້ອງມີລະບົບ/ໜ້າຈໍແຍກຕ່າງຫາກ
        // ສຳລັບຝັ່ງ provider, ຂໍ້ມູນນີ້ຢູ່ໃນແຖວດຽວກັນກັບ status ຝັ່ງ bank ແລ້ວ,
        // ໃຫ້ operation ທີມເບິ່ງທັງ 2 ຝັ່ງພ້ອມກັນຢູ່ transaction monitoring ໜ້າດຽວ
        payTxn.setResData(buildProviderRawResponse(partnerResult, invoice, payTxn.getXref()));
        txnRepo.save(payTxn);

        MismatchLog mismatch = new MismatchLog();
        mismatch.setTransactionLog(payTxn);
        mismatch.setBankStatus(bankResult);
        mismatch.setProviderStatus(partnerResult);

        // ⚠️ Case ອັນຕະລາຍທີ່ສຸດ: "Payment status mismatch" - ລູກຄ້າຈ່າຍສຳເລັດຝັ່ງ provider
        // ແລ້ວ (ເງິນອອກຈາກບັນຊີ/provider ຮັບເງິນແລ້ວ) ແຕ່ bank ບັນທຶກ/ແຈ້ງລູກຄ້າວ່າ "ບໍ່ສຳເລັດ".
        // ຖ້າບໍ່ຈັບ case ນີ້ໄວ້, ລູກຄ້າຈະຄິດວ່າຍັງບໍ່ໄດ້ຈ່າຍ ແລ້ວກົດຈ່າຍຊ້ຳ -> ກາຍເປັນ "Duplicate payment"
        // (ນີ້ຄືເຫດຜົນທີ່ຕ້ອງມີ duplicate-payment guard ຢູ່ດ້ານເທິງ, ເພື່ອກັນຄາຖ້າລູກຄ້າພະຍາຍາມຈ່າຍຊ້ຳ
        // ໃນລະຫວ່າງທີ່ mismatch ນີ້ຍັງບໍ່ resolve)
        if ("SUCCESS".equals(partnerResult) && !"SUCCESS".equals(bankResult)) {
            mismatch.setMismatchReason(
                    bankResult);
        } else {
            mismatch.setMismatchReason(
                    "Bank status (" + bankResult + ") ບໍ່ຕົງກັບ Partner status (" + partnerResult + ")");
        }
        mismatch.setResolutionStatus("OPEN");
        mismatchRepo.save(mismatch);

        return payTxn;
    }

    // ສ້າງ transaction log ແບບ "REJECTED" ສຳລັບການພະຍາຍາມຈ່າຍຊ້ຳ (ບໍ່ເອີ້ນ provider, ບໍ່ເກັບເງິນ)
    private TransactionLog rejectDuplicate(BillInvoice invoice, String statementBillNo, String respCode, String respDesc) {
        TransactionLog dupTxn = new TransactionLog();
        dupTxn.setXref("XR" + System.currentTimeMillis());
        dupTxn.setConsumerNo(invoice.getConsumerNo());
        dupTxn.setProvider(invoice.getProvider());
        if (invoice.getProvider() != null) {
            dupTxn.setService(invoice.getProvider().getService());
        }
        dupTxn.setAction("PAY");
        dupTxn.setBillInvoice(invoice);
        dupTxn.setTxnDate(LocalDateTime.now());
        dupTxn.setResDate(LocalDateTime.now());
        dupTxn.setStatus("REJECTED");
        dupTxn.setRespCode(respCode);
        dupTxn.setRespDesc(respDesc);
        return txnRepo.save(dupTxn);
    }

    // mock ຝັ່ງ bank: ປົກກະຕິ bank ບັນທຶກ SUCCESS ຕາມທີ່ດຳເນີນການ
    // ຂຶ້ນຕົ້ນດ້ວຍ 7 -> ຈຳລອງ internal error ຝັ່ງ bank (e.g. ບັນທຶກ/ອັບເດດ status ຜິດພາດ)
    //                    ເຮັດໃຫ້ bank ຄິດ/ແຈ້ງວ່າ FAILED ທັງທີ່ຄຳຮ້ອງໄດ້ຖືກສົ່ງອອກໄປແລ້ວ
    private String mockBankResult(BillInvoice invoice) {
        String consumerNo = invoice.getConsumerNo();
        if (consumerNo != null && consumerNo.startsWith("7")) {
            return "FAILED";
        }
        return "SUCCESS";
    }

    // mock ການເອີ້ນ provider ຈິງ: ອີງໃສ່ consumerNo ເພື່ອຈຳລອງຜົນລັບທີ່ເປັນໄປໄດ້ຈິງ
    //   - ຂຶ້ນຕົ້ນດ້ວຍ 9 -> provider ຕອບກັບຊັດເຈນວ່າ FAILED
    //   - ຂຶ້ນຕົ້ນດ້ວຍ 8 -> provider ບໍ່ຕອບກັບເລີຍ -> TIMEOUT
    //   - ຂຶ້ນຕົ້ນດ້ວຍ 7 -> provider ຮັບເງິນ/ດຳເນີນການ SUCCESS ຈິງ (ແຕ່ bank ຈະລາຍງານ FAILED, ເບິ່ງ mockBankResult)
    //   - ນອກນັ້ນ         -> SUCCESS
    private String callPartnerPay(BillInvoice invoice) {
        String consumerNo = invoice.getConsumerNo();
        if (consumerNo != null && consumerNo.startsWith("9")) {
            return "FAILED";
        }
        if (consumerNo != null && consumerNo.startsWith("8")) {
            throw new PartnerTimeoutException("No response from provider within timeout window");
        }
        return "SUCCESS";
    }

    // ຈຳລອງ "raw response" ທີ່ provider ຕອບກັບມາຈິງ (ໃນລະບົບຈິງຄືຂໍ້ຄວາມ JSON/XML ທີ່ໄດ້ຈາກ
    // HTTP response body ຂອງ provider ໂດຍກົງ). ເກັບໄວ້ໃນ RES_DATA ຂອງແຖວດຽວກັນ ເພື່ອໃຫ້
    // transaction monitoring ເບິ່ງໄດ້ວ່າ "provider ຕອບຫຍັງມາແທ້ໆ" ໂດຍບໍ່ຕ້ອງເປີດລະບົບອື່ນ.
    private String buildProviderRawResponse(String providerStatus, BillInvoice invoice, String xref) {
        return "{"
                + "\"xref\":\"" + xref + "\","
                + "\"consumerNo\":\"" + invoice.getConsumerNo() + "\","
                + "\"providerCode\":\"" + (invoice.getProvider() != null ? invoice.getProvider().getProviderCode() : "") + "\","
                + "\"amount\":" + invoice.getTotalAmount() + ","
                + "\"providerStatus\":\"" + providerStatus + "\","
                + "\"providerRefNo\":\"PRV" + System.currentTimeMillis() + "\""
                + "}";
    }
}