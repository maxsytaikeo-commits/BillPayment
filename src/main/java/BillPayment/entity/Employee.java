package BillPayment.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String password;
    private String position;
    private String status;

    // Default Constructor
    public Employee() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}