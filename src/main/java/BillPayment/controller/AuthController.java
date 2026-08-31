package BillPayment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import BillPayment.entity.User;
import BillPayment.repository.UserRepository;
import BillPayment.dto.LoginRequest;
import BillPayment.dto.UserResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername());

        if (user == null || !user.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        if (!"ACTIVE".equals(user.getUserStatus())) {
            return ResponseEntity.status(403).body("Account is inactive");
        }

        UserResponse response = new UserResponse(
            user.getId(), user.getUsername(), user.getFullname(), user.getUserStatus()
        );
        return ResponseEntity.ok(response);
    }
}