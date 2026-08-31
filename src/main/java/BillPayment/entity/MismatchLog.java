package BillPayment.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_MISMATCH_LOG")
public class MismatchLog {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MISMATCH_ID")
    private Long mismatchId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "XREF" , referencedColumnName = "XREF" , nullable = false)
    private TransactionLog transactionLog;

    @Column(name = "BANK_STATUS" ,length = 20 , nullable = false)
    private String bankStatus;

    @Column(name = "PROVIDER_STATUS" ,length = 20 , nullable = false)
    private String providerStatus;

    @Column(name = "MISMATCH_REASON" , length = 255) //
    private String mismatchReason;

    @Column(name = "RESOLUTION_STATUS" ,length = 20 , nullable = false)
    private String resolutionStatus;

    @Column(name = "RESOLVED_DATE")
    private LocalDateTime resolvedDate;

    public MismatchLog(){

    }
    public Long getMismatchId(){
        return mismatchId;
    }
    public void setMismatchId(Long mismatchId){
        this.mismatchId = mismatchId;
    }

    public TransactionLog getTransactionLog(){
        return transactionLog;
    }
    public void setTransactionLog(TransactionLog transactionLog){
        this.transactionLog = transactionLog;
    }

    public String getBankStatus(){
        return bankStatus;
    }
    public void setBankStatus(String bankStatus){
        this.bankStatus = bankStatus;
    }

    public String getProviderStatus(){
        return providerStatus;
    }
    public void setProviderStatus(String providerStatus){
        this.providerStatus = providerStatus;
    }

    public String getMismatchReason(){
        return mismatchReason;
    }
    public void setMismatchReason(String mismatchReason){
        this.mismatchReason = mismatchReason;
    }

    public String getResolutionStatus(){
        return resolutionStatus;
    }
    public void setResolutionStatus(String resolutionStatus){
        this.resolutionStatus = resolutionStatus;
    }

    public LocalDateTime getResolvedDate(){
        return resolvedDate;
    }
    public void setResolvedDate(LocalDateTime resolvedDate){
        this.resolvedDate = resolvedDate;
    }
}
