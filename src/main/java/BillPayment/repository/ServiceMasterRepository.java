package BillPayment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.ServiceMaster;

public interface ServiceMasterRepository extends JpaRepository<ServiceMaster , String>{

    
}