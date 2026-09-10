package BillPayment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import BillPayment.entity.MismatchLog;
import BillPayment.entity.TransactionLog;
import BillPayment.repository.MismatchLogRepository;
import BillPayment.repository.TransactionLogRepository;

/**
 * ຈຳລອງ reconciliation / timeout-detection job ຂອງລະບົບ bill payment ຈິງ.
 *
 * ໃນລະບົບຈິງ ຂັ້ນຕອນນີ້ຈະ:
 *   1. ແລ່ນເປັນ scheduled batch (ຫຼືຫຼັງຮັບ EOD statement file ຈາກ provider)
 *   2. ຫາລາຍການທີ່ຄ້າງຢູ່ status ບໍ່ final (PENDING) ດົນເກີນ threshold ທີ່ກຳນົດ
 *   3. Escalate ໃຫ້ເປັນ mismatch ເພື່ອໃຫ້ operation ທີມເຫັນໃນ dashboard ແລະ retry/resolve ຕໍ່
 *
 * ໃນ mock ນີ້, transaction ທີ່ໂດນ PartnerTimeoutException ຈະຖືກ log ເປັນ mismatch
 * ທັນທີຢູ່ PaymentService ແລ້ວ — job ນີ້ຄອຍກວດຄືນອີກຊັ້ນໜຶ່ງ (safety net) ສຳລັບລາຍການທີ່
 * ຄ້າງຢູ່ PENDING ດ້ວຍສາເຫດອື່ນ ຫຼືກໍລະນີໃນອະນາຄົດທີ່ເອີ້ນ provider ແບບ async.
 */
@Service
public class TimeoutMonitorService {

    @Autowired private TransactionLogRepository txnRepo;
    @Autowired private MismatchLogRepository mismatchRepo;

    // ຄ່າ default 2 ນາທີ (ປັບໄດ້ຜ່ານ application.properties: billpayment.timeout.threshold-minutes)
    @Value("${billpayment.timeout.threshold-minutes:2}")
    private long thresholdMinutes;

    // ແລ່ນທຸກ 60 ວິນາທີ (ປັບໄດ້ຜ່ານ application.properties: billpayment.timeout.scan-interval-ms)
    @Scheduled(fixedRateString = "${billpayment.timeout.scan-interval-ms:60000}")
    public void scanForTimeouts() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(thresholdMinutes);

        List<TransactionLog> stuckTxns =
                txnRepo.findByActionAndStatusAndTxnDateBefore("PAY", "PENDING", cutoff);

        for (TransactionLog txn : stuckTxns) {
            // ຢ້ານ log mismatch ຊ້ຳ ຖ້າ PaymentService ໄດ້ສ້າງໄວ້ແລ້ວ
            if (mismatchRepo.existsByTransactionLog_Xref(txn.getXref())) {
                continue;
            }

            MismatchLog mismatch = new MismatchLog();
            mismatch.setTransactionLog(txn);
            mismatch.setBankStatus(txn.getStatus());
            mismatch.setProviderStatus("UNKNOWN");
            mismatch.setMismatchReason(
                    "Transaction ຄ້າງຢູ່ PENDING ດົນເກີນ " + thresholdMinutes +
                    " ນາທີ ໂດຍບໍ່ໄດ້ຮັບການຢືນຢັນຈາກ provider (auto-detected timeout)");
            mismatch.setResolutionStatus("OPEN");
            mismatchRepo.save(mismatch);

            txn.setRespCode("99");
            txn.setRespDesc("Auto-flagged as timeout by reconciliation job");
            txnRepo.save(txn);
        }
    }
}
