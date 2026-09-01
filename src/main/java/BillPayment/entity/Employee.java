package BillPayment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_employee")
@Getter
@Setter
public class Employee {

    @Id
    @Column(name = "id")
    private long id;

    @Column(name = "name" , length = 20 , nullable = false)
    private String name; 

    @Column(name = "password" , length = 255 , nullable = false)
    private String password;
    
    @Column(name = "position" , length = 20 , nullable = false)
    private String position;

    @Column(name = "status" , length = 20 , nullable = false)
    private String status;

    public Employee(){

    }
}