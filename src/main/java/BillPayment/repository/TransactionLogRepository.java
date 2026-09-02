package BillPayment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.TransactionLog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionLogRepository extends JpaRepository<TransactionLog , String>{
    
    Optional<TransactionLog> findByXref(String xref);

    List<TransactionLog> findByService_ServiceCodeAndStatusAndTxnDateBetween(
        String serviceCode , String status , LocalDateTime from , LocalDateTime to);

    List<TransactionLog> findByConsumerNoContaining(String consumerNo);
    List<TransactionLog> findByBillInvoice_StatementBillNo(String statementBillNo);
    List<TransactionLog> findByActionAndStatus(String action , String status);
    List<TransactionLog> findByTxnDateBetween(LocalDateTime from , LocalDateTime to); 
}