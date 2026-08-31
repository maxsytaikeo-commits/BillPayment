package BillPayment.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import BillPayment.entity.BillInvoice;
import BillPayment.entity.MismatchLog;
import BillPayment.entity.TransactionLog;
import BillPayment.repository.BillInvoiceRepository;
import BillPayment.repository.MismatchLogRepository;
import BillPayment.repository.TransactionLogRepository;

@Service
public class PaymentService {
     @Autowired private TransactionLogRepository txnRepo;
    @Autowired private BillInvoiceRepository invoiceRepo;
    @Autowired private MismatchLogRepository mismatchRepo;

    public TransactionLog confirmPayment(String statementBillNo) {
        BillInvoice invoice = invoiceRepo.findById(statementBillNo)
                .orElseThrow(() -> new RuntimeException("Bill invoice not found"));

        TransactionLog payTxn = new TransactionLog();
        payTxn.setXref("XR" + System.currentTimeMillis());
        payTxn.setConsumerNo(invoice.getConsumerNo());
        payTxn.setProvider(invoice.getProvider());
        payTxn.setAction("PAY");
        payTxn.setBillInvoice(invoice);
        payTxn.setTxnDate(LocalDateTime.now());


        String bankResult = "SUCCESS";
        String partnerResult = callPartnerPay(invoice); 

        if (bankResult.equals(partnerResult)) {
            payTxn.setStatus(bankResult);
            return txnRepo.save(payTxn);
        }

        payTxn.setStatus("PENDING");
        txnRepo.save(payTxn);

        MismatchLog mismatch = new MismatchLog();
        mismatch.setTransactionLog(payTxn);
        mismatch.setBankStatus(bankResult);
        mismatch.setProviderStatus(partnerResult);
        mismatch.setMismatchReason("Partner timeout/response ບໍ່ຕົງກັບຝັ່ງ bank");
        mismatch.setResolutionStatus("OPEN");
        mismatchRepo.save(mismatch);

        return payTxn;
    }

    private String callPartnerPay(BillInvoice invoice) {
        return "SUCCESS";
    }
}
