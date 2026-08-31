package BillPayment.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import BillPayment.entity.RetryLog;
import BillPayment.entity.TransactionLog;
import BillPayment.repository.RetryLogRepository;
import BillPayment.repository.TransactionLogRepository;

@Service
public class RetryService {
    @Autowired private TransactionLogRepository txnRepo;
    @Autowired private RetryLogRepository retryRepo;

    public TransactionLog retry(String xref) {
        TransactionLog txn = txnRepo.findById(xref)
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
        return txnRepo.save(txn);
    }

    private String callPartnerRetry(TransactionLog txn) {
        return "SUCCESS";
    }
}
