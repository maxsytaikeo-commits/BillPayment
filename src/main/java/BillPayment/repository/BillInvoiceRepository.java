package BillPayment.repository;

import BillPayment.entity.Provider;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.BillInvoice;

public interface BillInvoiceRepository extends JpaRepository<BillInvoice , String>{
    Optional<BillInvoice> findByConsumerNoAndProvider(String consumerNo, Provider provider);
}
