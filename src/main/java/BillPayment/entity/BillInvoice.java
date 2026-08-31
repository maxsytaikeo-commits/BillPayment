package BillPayment.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_BILL_INVOICE")
public class BillInvoice {
    @Id 
    @Column(name = "STATEMENT_BILL_NO" , length = 50)
    private String statementBillNo;

    @Column(name = "CONSUMER_NO" , length = 20 , nullable = false)
    private String consumerNo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "PROVIDER_CODE" , referencedColumnName = "PROVIDER_CODE" ,  nullable =  false)
    private Provider provider;    
    
    @Column(name = "CUSTOMER_NAME" ,length = 150)
    private String customerName;

    @Column(name = "BILL_AMOUNT"  , nullable = false)
    private BigDecimal billAmount;

    @Column(name = "FEE_AMOUNT")
    private BigDecimal feeAmount;

    @Column(name = "TOTAL_AMOUNT", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "DUE_DATE")
    private LocalDate dueDate;

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    public BillInvoice(){

    }

    public String getStatementBillNo(){
        return statementBillNo;
    }
    public void setStatementBillNo(String statementBillNo){
        this.statementBillNo = statementBillNo;
    }

    public String getConsumerNo(){
        return consumerNo;
    }
    public void setConsumerNo(String consumerNo){
        this.consumerNo = consumerNo;
    }

    public Provider getProvider(){
        return provider;
    }
    public void setProvider(Provider provider){
        this.provider = provider;
    }

    public String getCustomerName(){
        return customerName;
    }
    public void setCustomerName(String customerName){
        this.customerName = customerName;
    }

    public BigDecimal getBillAmount(){
        return billAmount;
    }
    public void setBillAmount(BigDecimal billAmount){
        this.billAmount = billAmount;
    }

    public BigDecimal getFeeAmount(){
        return feeAmount;
    }
    public void setFeeAmount(BigDecimal feeAmount){
        this.feeAmount = feeAmount;
    }

    public BigDecimal getTotalAmount(){
        return totalAmount;
    }
    public void setTotalAmount(BigDecimal totalAmount){
        this.totalAmount = totalAmount;
    }

    public LocalDate getDueDate(){
        return dueDate;
    }
    public void setDueDate(LocalDate dueDate){
        this.dueDate = dueDate;
    }
    
    public LocalDateTime getCreatedDate(){
        return createdDate;
    }
    public void setCreatedDate(LocalDateTime createdDate){
        this.createdDate = createdDate;
    }
}
