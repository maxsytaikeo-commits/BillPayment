package BillPayment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import BillPayment.entity.User;
import BillPayment.entity.Employee;
import BillPayment.repository.UserRepository;
import BillPayment.repository.EmployeeRepository;
import BillPayment.dto.LoginRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        
        // 1. ກວດສອບຈາກ tb_users (Customer / Admin)
        User user = userRepository.findByUsername(req.getUsername());
        if (user != null && user.getPassword().equals(req.getPassword())) {
            if (!"ACTIVE".equalsIgnoreCase(user.getUserStatus())) {
                return ResponseEntity.status(403).body("Account is inactive");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("fullname", user.getFullname());
            response.put("role", "customer"); // ຖ້າເປັນ tb_users ໃຫ້ສົ່ງ role ເປັນ customer
            response.put("status", user.getUserStatus());
            return ResponseEntity.ok(response);
        }

        // 2. ຖ້າບໍ່ມີໃນ tb_users ໃຫ້ມາກວດສອບໃນ tb_employee (Staff)
        Employee emp = employeeRepository.findByName(req.getUsername());
        if (emp != null && emp.getPassword().equals(req.getPassword())) {
            if (!"ACTIVE".equalsIgnoreCase(emp.getStatus())) {
                return ResponseEntity.status(403).body("Account is inactive");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", emp.getId());
            response.put("username", emp.getName());
            response.put("role", emp.getPosition()); // ເອົາ position ('staff') ມາເປັນ role
            response.put("status", emp.getStatus());
            return ResponseEntity.ok(response);
        }

        // 3. ຖ້າບໍ່ພົບໃນທັງສອງຕາຕະລາງ
        return ResponseEntity.status(401).body("Invalid username or password");
    }
}