package BillPayment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.BillInvoice;

public interface BillInvoiceRepository extends JpaRepository<BillInvoice , String>{
    
}
