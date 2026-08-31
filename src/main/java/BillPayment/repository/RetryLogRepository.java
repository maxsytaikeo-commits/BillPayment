package BillPayment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.RetryLog;


public interface RetryLogRepository extends JpaRepository<RetryLog , Long>{
    List<RetryLog> findByTransactionLog_Xref(String xref);
}