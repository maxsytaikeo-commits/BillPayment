package BillPayment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TB_RESPONSE_CODE")
@Getter
@Setter
@IdClass (ResponseCodeId.class)
public class ResponseCode{
    
    @Id
    @Column(name = "PROVIDER_CODE" ,length = 20)
    private String providerCode;

    @Id
    @Column(name = "ORIGINAL_CODE" , length = 20)
    private String originalCode;

    @ManyToOne
    @JoinColumn(name = "PROVIDER_CODE" , referencedColumnName = "PROVIDER_CODE" ,insertable =  false , updatable = false)
    private Provider provider;

    @Column(name = "INTERNAL_CODE" ,length = 20 , nullable = false)
    private String internalCode;

    @Column(name = "DESCRIPTION" , length = 150)
    private String description;
}