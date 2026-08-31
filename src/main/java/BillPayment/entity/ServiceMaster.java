package BillPayment.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_SERVICE")
public class ServiceMaster {
    
    @Id
    @Column(name = "SERVICE_CODE" , length = 20)
    private String serviceCode;

    @Column(name = "SERVICE_NAME" , length = 100 , nullable = false)
    private String serviceName;

    @Column(name = "STATUS" , length = 20)
    private String status;

    public ServiceMaster(){
    }
    
    public String getServiceCOde(){
        return serviceCode;
    }
    public void setServiceCode(String serviceCode){
        this.serviceCode = serviceCode;
    }

    public String getServiceName(){
        return serviceName;
    }
    public void serServiceName(String serviceName){
        this.serviceName = serviceName;
    }

    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status = status;
    }
}
