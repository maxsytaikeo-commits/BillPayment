package BillPayment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import BillPayment.entity.Provider;

public interface ProviderRepository extends JpaRepository<Provider , String>{

}
