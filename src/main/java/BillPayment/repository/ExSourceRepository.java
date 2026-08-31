package BillPayment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.ExSource;

public interface ExSourceRepository extends JpaRepository<ExSource , String> {
    
}
