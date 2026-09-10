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

    // ໃຊ້ໂດຍ TimeoutMonitorService: ຫາລາຍການທີ່ຄ້າງຢູ່ status ດັ່ງກ່າວ ແລະ ເກົ່າກວ່າ threshold
    List<TransactionLog> findByActionAndStatusAndTxnDateBefore(String action, String status, LocalDateTime cutoff);

    // ໃຊ້ໂດຍ PaymentService: ຫາປະຫວັດການພະຍາຍາມຈ່າຍ (PAY) ທັງໝົດຂອງບິນດຽວກັນ ເພື່ອກວດ duplicate payment
    List<TransactionLog> findByBillInvoice_StatementBillNoAndAction(String statementBillNo, String action);
}