package BillPayment.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import BillPayment.entity.MismatchLog;
import BillPayment.entity.RetryLog;
import BillPayment.entity.TransactionLog;
import BillPayment.repository.MismatchLogRepository;
import BillPayment.repository.RetryLogRepository;
import BillPayment.repository.TransactionLogRepository;

@Service
public class RetryService {
    @Autowired private TransactionLogRepository txnRepo;
    @Autowired private RetryLogRepository retryRepo;
    @Autowired private MismatchLogRepository mismatchRepo;

    public TransactionLog retry(String xref) {
        TransactionLog txn = txnRepo.findByXref(xref)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        String previousStatus = txn.getStatus();
        String newStatus = callPartnerRetry(txn);

        RetryLog retryLog = new RetryLog();
        retryLog.setTransactionLog(txn);
        retryLog.setPreviousStatus(previousStatus);
        retryLog.setNewStatus(newStatus);
        retryLog.setRetryDate(LocalDateTime.now());
        retryRepo.save(retryLog);

        // "PENDING" ໝາຍເຖິງ ຍັງບໍ່ໄດ້ຄຳຕອບຊັດເຈນຈາກ provider ອີກ (retry ອີກຄັ້ງ ຫຼືລໍຖ້າ)
        // -> ບໍ່ mark ວ່າ resolve, ບໍ່ປ່ຽນ status ຂອງ transaction
        if ("PENDING".equals(newStatus)) {
            return txn;
        }

        txn.setStatus(newStatus);
        txn.setResDate(LocalDateTime.now());
        TransactionLog savedTxn = txnRepo.save(txn);

        MismatchLog mismatch = mismatchRepo.findByTransactionLog_Xref(xref);
        if (mismatch != null && "OPEN".equals(mismatch.getResolutionStatus())) {
            mismatch.setProviderStatus(newStatus);
            mismatch.setResolutionStatus("RESOLVED");
            mismatch.setResolvedDate(LocalDateTime.now());
            mismatchRepo.save(mismatch);
        }

        return savedTxn;
    }

    // mock ການເອີ້ນ provider ຄືນເພື່ອກວດສະຖານະຫຼ້າສຸດ (status inquiry).
    // ຄວາມຈິງແລ້ວຄວນເອີ້ນ provider status-inquiry API ຈິງ; ບ່ອນນີ້ຈຳລອງໂດຍໃຫ້ຜົນ
    // ອອກມາໄດ້ຫຼາຍແບບ ຄື ໃນລະບົບຈິງ (ບໍ່ແມ່ນ SUCCESS ສະເໝີ):
    //   ~70% -> SUCCESS, ~20% -> FAILED (ຢືນຢັນວ່າ provider ບໍ່ຮັບເງິນແທ້), ~10% -> ຍັງ PENDING
    private String callPartnerRetry(TransactionLog txn) {
        int bucket = Math.floorMod(txn.getXref().hashCode(), 10);
        if (bucket < 7) return "SUCCESS";
        if (bucket < 9) return "FAILED";
        return "PENDING";
    }
}