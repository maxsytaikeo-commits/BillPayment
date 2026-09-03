package BillPayment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import BillPayment.entity.User;
import BillPayment.entity.Employee;
import BillPayment.repository.UserRepository;
import BillPayment.repository.EmployeeRepository;
import BillPayment.dto.LoginRequest;
import BillPayment.dto.SignupRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        
        // 1. ກວດສອບຈາກ tb_users (Customer / Admin)
        User user = userRepository.findByUsername(req.getUsername());
        if (user != null && passwordMatches(req.getPassword(), user.getPassword())) {
            if (!"ACTIVE".equalsIgnoreCase(user.getUserStatus())) {
                return ResponseEntity.status(403).body("Account is inactive");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("fullname", user.getFullname());
            response.put("consumerNo", user.getConsumerNo());
            response.put("role", "customer"); // ຖ້າເປັນ tb_users ໃຫ້ສົ່ງ role ເປັນ customer
            response.put("status", user.getUserStatus());
            return ResponseEntity.ok(response);
        }

        // 2. ຖ້າບໍ່ມີໃນ tb_users ໃຫ້ມາກວດສອບໃນ tb_employee (Staff)
        Employee emp = employeeRepository.findByName(req.getUsername());
        if (emp != null && passwordMatches(req.getPassword(), emp.getPassword())) {
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

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        if (req.getUsername() == null || req.getUsername().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()
                || req.getConsumerNo() == null || req.getConsumerNo().isBlank()) {
            return ResponseEntity.badRequest().body("Username, phone number, and password are required");
        }

        if (userRepository.findByUsername(req.getUsername().trim()) != null
                || employeeRepository.findByName(req.getUsername().trim()) != null) {
            return ResponseEntity.status(409).body("Username already exists");
        }

        LocalDateTime now = LocalDateTime.now();
        User user = new User();
        user.setUsername(req.getUsername().trim());
        user.setFullname(req.getFullname() == null ? null : req.getFullname().trim());
        user.setConsumerNo(req.getConsumerNo().trim());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setUserStatus("ACTIVE");
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        User saved = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("username", saved.getUsername());
        response.put("fullname", saved.getFullname());
        response.put("consumerNo", saved.getConsumerNo());
        response.put("role", "customer");
        response.put("status", saved.getUserStatus());
        return ResponseEntity.status(201).body(response);
    }

    private boolean passwordMatches(String rawPassword, String storedPassword) {
        return storedPassword != null && (storedPassword.startsWith("$2")
                ? passwordEncoder.matches(rawPassword, storedPassword)
                : storedPassword.equals(rawPassword));
    }
}