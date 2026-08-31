package BillPayment.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import BillPayment.entity.TransactionLog;
import BillPayment.repository.TransactionLogRepository;

@Service
public class TransactionMonitorService {
    @Autowired private TransactionLogRepository txnRepo;

    public List<TransactionLog> monitorAll() {
        return txnRepo.findAll();
    }

    public List<TransactionLog> search(String serviceCode, String status,
                                        LocalDateTime from, LocalDateTime to, String consumerNo) {
        if (consumerNo != null && !consumerNo.isBlank()) {
            return txnRepo.findByConsumerNoContaining(consumerNo);
        }
        if (from != null && to != null) {
            return txnRepo.findByService_ServiceCodeAndStatusAndTxnDateBetween(serviceCode, status, from, to);
        }
        return txnRepo.findAll();
    }
}
