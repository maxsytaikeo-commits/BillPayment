package BillPayment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import BillPayment.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByName(String name);
}