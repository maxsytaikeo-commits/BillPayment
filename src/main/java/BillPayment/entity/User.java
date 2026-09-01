package BillPayment.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "tb_users")
@Getter
@Setter

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username" , length = 50 , nullable = false)
    private String username;

    @Column(name = "fullname" , length = 70)
    private String fullname;

    @Column(name = "user_status" , length = 10)
    private String userStatus;

    @Column(name = "password" , length = 255 , nullable = false)
    private String password;

    @Column(name = "created_at" , nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at" , nullable = false)
    private LocalDateTime updatedAt;
     
    @Column(name = "CONSUMER_NO" , length = 20)
    private String consumerNo;

    public User(){

    }

}