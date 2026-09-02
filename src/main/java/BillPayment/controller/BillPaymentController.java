package BillPayment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import BillPayment.entity.BillInvoice;
import BillPayment.entity.TransactionLog;
import BillPayment.service.BillInquiryService;
import BillPayment.service.PaymentService;
import BillPayment.service.RetryService;

@RestController
@RequestMapping("/api/billpayment")
public class BillPaymentController {
    @Autowired private BillInquiryService inquiryService;
    @Autowired private PaymentService paymentService;
    @Autowired private RetryService retryService;

    @PostMapping("/api/billpayment/retry/{xref}")
    public ResponseEntity<?> retryPayment(@PathVariable String xref) {
        try {
            TransactionLog result = retryService.retry(xref);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/inquiry")
    public BillInvoice inquiry(@RequestParam String service,
                                @RequestParam String provider,
                                @RequestParam String consumerNo) {
        return inquiryService.inquireBill(service, provider, consumerNo);
    }

    @PostMapping("/confirm")
    public TransactionLog confirm(@RequestParam String statementBillNo) {
        return paymentService.confirmPayment(statementBillNo);
    }
}
