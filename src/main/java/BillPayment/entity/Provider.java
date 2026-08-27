package BillPayment.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_PROVIDER")
public class Provider {
    @Id
    @Column(name = "PROVIDER_CODE" , length = 20)
    private String providerCode;

    @ManyToOne
    @JoinColumn(name = "SERVICE_CODE" , referencedColumnName = "SERVICE_CODE")
    private String service;

    @Column(name = "PROVIDER_NAME" , length = 100)
    private String providerName;

    @Column(name = "STATUS" , length = 20)
    private String status;

    public Provider(){

    }

    public String getProviderCode(){
        return providerCode;
    }
    public void setProviderCode(String providerCode){
        this.providerCode = providerCode;
    }

    public String getService(){
        return service;
    }
    public void setServiceCode(String service){
        this.service = service;
    }

    public String getProviderName(){
        return providerName;
    }
    public void setProviderName(String providerName){
        this.providerName = providerName;
    }

    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status = status;
    }
}
