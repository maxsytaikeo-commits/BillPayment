package BillPayment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.MismatchLog;

public interface MismatchLogRepository extends JpaRepository <MismatchLog , Long>{
    List<MismatchLog> findByResolutionStatus(String resolutionStatus);
    Optional<MismatchLog> findByTransactionLog_XrefAndResolutionStatus(String xref , String resolutionStatus);
    MismatchLog findByTransactionLog_Xref(String xref);
}