package BillPayment.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_PROVIDER")
public class Provider {
    @Id
    @Column(name = "PROVIDER_CODE" , length = 20)
    private String providerCode;

    @ManyToOne(optional = false)
    @JoinColumn(name = "SERVICE_CODE" , referencedColumnName = "SERVICE_CODE" , nullable =  false)
    private ServiceMaster service;

    @Column(name = "PROVIDER_NAME" , length = 100 , nullable = false)
    private String providerName;

    @Column(name = "STATUS" , length = 20 , nullable = false)
    private String status;

    public Provider(){

    }

    public String getProviderCode(){
        return providerCode;
    }
    public void setProviderCode(String providerCode){
        this.providerCode = providerCode;
    }

    public ServiceMaster getService(){
        return service;
    }
    public void setServiceCode(ServiceMaster service){
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
