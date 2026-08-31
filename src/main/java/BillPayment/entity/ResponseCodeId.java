package BillPayment.entity;


import lombok.*;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
public class ResponseCodeId implements Serializable {
    private String providerCode;
    private String originalCode;

    public ResponseCodeId(){

    }
    public ResponseCodeId(String providerCode , String originalCode){
        this.providerCode = providerCode;
        this.originalCode = originalCode;
    }

    @Override
    public boolean equals(Object o){
        if(this == o) return true;
        if(!(o instanceof ResponseCodeId)) return false;
        ResponseCodeId that = (ResponseCodeId) o;
        return Objects.equals(providerCode, that.providerCode)
            && Objects.equals(originalCode, that.originalCode);
    }

    @Override
    public int hashCode(){
        return Objects.hash(providerCode , originalCode);
    }
    
}
