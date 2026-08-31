package BillPayment.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import BillPayment.entity.TransactionLog;
import BillPayment.repository.TransactionLogRepository;

@Service
public class ReportService {
     @Autowired private TransactionLogRepository txnRepo;

    public List<TransactionLog> generateReport(LocalDateTime from, LocalDateTime to) {
        return txnRepo.findByTxnDateBetween(from, to);
    }
}
