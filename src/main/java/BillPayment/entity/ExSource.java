package BillPayment.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_EX_SOURCE")
public class ExSource {

    @Id
    @Column(name = "EX_SOURCE" , length = 20)
    private String exSource;

    @Column(name = "SOURCE_NAME" , length = 100 , nullable =  false)
    private String sourceName;

    @Column(name = "STATUS" , length = 20 , nullable = false)
    private String status;

    public ExSource(){

    }

    public String getExSource(){
        return exSource;
    }
    public void setExSource(String exSource){
        this.exSource = exSource;
    }

    public String getSourceName(){
        return sourceName;
    }
    public void setSourceName(String sourceName){
        this.sourceName = sourceName;
    }

    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status = status;
    }
}
