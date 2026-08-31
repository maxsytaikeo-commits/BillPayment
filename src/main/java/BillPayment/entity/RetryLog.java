package BillPayment.entity;

import java.math.BigInteger;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "TB_RETRY_LOG")
public class RetryLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RETRY_ID")
    private Long retryId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "XREF" ,referencedColumnName = "XREF" , nullable = false)
    private TransactionLog transactionLog;

    @Column(name = "PREVIOUS_STATUS" , length = 20 , nullable = false)
    private String previousStatus;

    @Column(name = "NEW_STATUS" , length = 20 , nullable = false)
    private String newStatus; 

    @Column(name = "RETRY_DATE")
    private LocalDateTime retryDate;

    public RetryLog(){

    }

    public Long getRetryId(){
        return retryId;
    }
    public void setXref(Long retryId){
        this.retryId = retryId;
    }

    public TransactionLog getTransactionLog(){
        return transactionLog;
    }
    public void setTransactionLog(TransactionLog transactionLog){
        this.transactionLog = transactionLog;
    }

    public String getPreviousStatus(){
        return previousStatus;
    }
    public void setPreviousStatus(String previousStatus){
        this.previousStatus = previousStatus;
    }

    public String getNewStatus(){
        return newStatus;
    }
    public void setNewStatus(String newStatus){
        this.newStatus = newStatus;
    }

    public LocalDateTime getRetryDate(){
        return retryDate;
    }
    public void setRetryDate(LocalDateTime retryDate){
        this.retryDate = retryDate;
    }
}
