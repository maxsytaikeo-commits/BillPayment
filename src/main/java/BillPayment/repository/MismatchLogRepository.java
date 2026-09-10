package BillPayment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.MismatchLog;

public interface MismatchLogRepository extends JpaRepository <MismatchLog , Long>{
    List<MismatchLog> findByResolutionStatus(String resolutionStatus);
    Optional<MismatchLog> findByTransactionLog_XrefAndResolutionStatus(String xref , String resolutionStatus);
    MismatchLog findByTransactionLog_Xref(String xref);
    boolean existsByTransactionLog_Xref(String xref);

    // ໃຊ້ໂດຍ MismatchService.dashboard(): ຮອງຮັບ filter ຕາມ providerStatus (ເຊັ່ນ "TIMEOUT")
    // ໂດຍບໍ່ຂຶ້ນກັບ resolutionStatus
    List<MismatchLog> findByProviderStatus(String providerStatus);

    // ຮອງຮັບ filter ພ້ອມກັນທັງ resolutionStatus ແລະ providerStatus
    // (ເຊັ່ນ resolutionStatus=OPEN, providerStatus=TIMEOUT -> "timeout ທີ່ຍັງບໍ່ resolve")
    List<MismatchLog> findByResolutionStatusAndProviderStatus(String resolutionStatus, String providerStatus);
}