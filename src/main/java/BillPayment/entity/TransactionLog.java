package BillPayment.entity;

import java.time.LocalDateTime;

import lombok.*;
import jakarta.persistence.*;


@Entity
@Table(name = "TB_TRANSACTION_LOG")
@Getter
@Setter
public class TransactionLog {
    
    @Id
    @Column(name = "XREF" , length = 50)
    private String xref;

    @ManyToOne
    @JoinColumn(name = "SERVICE_CODE" ,referencedColumnName = "SERVICE_CODE")
    private ServiceMaster service;

    @ManyToOne
    @JoinColumn(name = "PROVIDER_CODE" , referencedColumnName = "PROVIDER_CODE")
    private Provider provider;

    @Column(name = "CONSUMER_NO" , length = 20)
    private String consumerNo;

    @Column(name = "ACTION" , length = 20)
    private String action;

    @Column(name = "STATUS" , length  = 20)
    private String status;

    @Column(name = "RESP_CODE" , length = 20)
    private String respCode;

    @Column(name = "RESP_DESC" ,length = 200)
    private String respDesc;

    @ManyToOne
    @JoinColumn(name = "EX_SOURCE" , referencedColumnName = "EX_SOURCE")
    private ExSource exSource;

    @Column(name = "TXN_DATE")
    private LocalDateTime txnDate;

    @Column(name = "RES_DATE")
    private LocalDateTime resDate;

    @Lob
    @Column(name = "RES_DATA" , length = Integer.MAX_VALUE)
    private String resData;

    @ManyToOne
    @JoinColumn(name = "STATEMENT_BILL_NO" , referencedColumnName = "STATEMENT_BILL_NO")
    private BillInvoice billInvoice;

    public TransactionLog(){
    }
 
}
