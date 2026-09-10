package BillPayment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BillPaymentApplication {

	public static void main(String[] args) {
		SpringApplication.run(BillPaymentApplication.class, args);
	}

}
