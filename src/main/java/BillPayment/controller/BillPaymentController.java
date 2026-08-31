package BillPayment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import BillPayment.entity.BillInvoice;
import BillPayment.entity.TransactionLog;
import BillPayment.service.BillInquiryService;
import BillPayment.service.PaymentService;

@RestController
@RequestMapping("/api/billpayment")
public class BillPaymentController {
     @Autowired private BillInquiryService inquiryService;
    @Autowired private PaymentService paymentService;

    @GetMapping("/inquiry")
    public BillInvoice inquiry(@RequestParam String serviceCode,
                                @RequestParam String providerCode,
                                @RequestParam String consumerNo) {
        return inquiryService.inquireBill(serviceCode, providerCode, consumerNo);
    }

    @PostMapping("/confirm")
    public TransactionLog confirm(@RequestParam String statementBillNo) {
        return paymentService.confirmPayment(statementBillNo);
    }
}
