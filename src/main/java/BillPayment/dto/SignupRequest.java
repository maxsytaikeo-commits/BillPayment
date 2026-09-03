package BillPayment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
	private String username;
	private String fullname;
	private String consumerNo;
	private String password;
}
