package BillPayment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.ResponseCode;
import BillPayment.entity.ResponseCodeId;

public interface ResponseCodeRepository extends JpaRepository<ResponseCode , ResponseCodeId> {
    Optional<ResponseCode> findByProviderCodeAndOriginalCode (String providerCode , String originalCode); 
}
