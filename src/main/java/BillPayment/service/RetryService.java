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

        txn.setStatus(newStatus);
        TransactionLog savedTxn = txnRepo.save(txn);

        MismatchLog mismatch = mismatchRepo.findByTransactionLog_Xref(xref);
        if (mismatch != null) {
            mismatch.setResolutionStatus("RESOLVED");
            mismatch.setResolvedDate(LocalDateTime.now());
            mismatchRepo.save(mismatch);
        }

        return savedTxn;
    }

    private String callPartnerRetry(TransactionLog txn) {
        return "SUCCESS";
    }
}