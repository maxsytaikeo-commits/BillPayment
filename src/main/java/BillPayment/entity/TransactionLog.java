package BillPayment.entity;

import java.time.LocalDateTime;

import org.springframework.cglib.core.Local;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_TRANSACTION_LOG")
public class TransactionLog {
    
    @Id
    @Column(name = "XREF" , length = 50 , nullable = false)
    private String xref;

    @Column(name = "SERVICE_CODE" , length = 20)
    private String serviceCode;

    @Column(name = "PROVIDER_CODE" , length = 20)
    private String providerCode;

    @Column(name = "CONSUMER_NO" , length = 20)
    private String consumerNo;

    @Column(name = "ACTION" , length = 20)
    private String action;

    @Column(name = "STATUS" , length  = 20)
    private String status;

    @Column(name = "RESP_CODE" , length = 20)
    private String respCode;

    @Column(name = "RESP_DESC" ,length = 100)
    private String respDesc;

    @Column(name = "EX_SOURCE" , length = 20)
    private String exSource;

    @Column(name = "TXN_DATE")
    private LocalDateTime txnDate;

    @Column(name = "RES_DATE")
    private LocalDateTime resDate;

    @Lob
    @Column(name = "RES_DATA")
    private String resData;

    @Column(name = "STATEMENT_BILL_NO" ,length = 50)
    private String statementBillNo;

    public TransactionLog(){

    }

    public String getXref(){
        return xref;
    }
    public void setXref(String xref){
        this.xref = xref;
    }

    public String getServiceCode(){
        return serviceCode;
    }
    public void setServiceCode(String serviceCode){
        this.serviceCode = serviceCode;
    }

    public String getProviderCode(){
        return providerCode;
    }
    public void setProviderCode(String providerCode){
        this.providerCode = providerCode;
    }

    public String getConsumerNo(){
        return consumerNo;
    }
    public void setConsumerNo(String consumerNo){
        this.consumerNo = consumerNo;
    }

    public String getAction(){
        return action;
    }
    public void setAction(String action){
        this.action = action;
    }

    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status = status;
    }

    public String getRespCode(){
        return respCode;
    }
    public void setRespCode(String respCode){
        this.respCode = respCode;
    }

    public String getRespDesc(){
        return respDesc;
    }
    public void setRespDesc(String respDesc){
        this.respDesc = respDesc;
    }

    public String getExSource(){
        return exSource;
    }
    public void setExSoure(String exSource){
        this.exSource = exSource;
    }

    public LocalDateTime getTxnDate(){
        return txnDate;
    }
    public void setTxnDate(LocalDateTime txnDate){
        this.txnDate = txnDate;
    }

    public LocalDateTime getResDate(){
        return resDate;
    }
    public void setResDate(LocalDateTime resDate){
        this.resDate = resDate;
    }

    public String getResData(){
        return resData;
    }
    public void setResData(String resData){
        this.resData = resData;
    }

    public String getStatementBillNo(){
        return statementBillNo;
    }
    public void getStatementBillNo(String statementBillNo){
        this.statementBillNo = statementBillNo;
    }
}
