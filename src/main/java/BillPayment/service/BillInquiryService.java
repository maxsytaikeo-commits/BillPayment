package BillPayment.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import BillPayment.entity.BillInvoice;
import BillPayment.entity.ServiceMaster;
import BillPayment.entity.Provider;
import BillPayment.entity.TransactionLog;
import BillPayment.repository.BillInvoiceRepository;
import BillPayment.repository.ProviderRepository;
import BillPayment.repository.ServiceMasterRepository;
import BillPayment.repository.TransactionLogRepository;

@Service
public class BillInquiryService {
    @Autowired private TransactionLogRepository txnRepo;
    @Autowired private BillInvoiceRepository invoiceRepo;
    @Autowired private ProviderRepository providerRepo;
    @Autowired private ServiceMasterRepository serviceRepo;

    public BillInvoice inquireBill(String serviceCode, String providerCode, String consumerNo) {
        Provider provider = providerRepo.findById(providerCode)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        ServiceMaster service = serviceRepo.findById(serviceCode)
                .orElseThrow(() -> new RuntimeException("Service not found"));
                
                
            BillInvoice invoice = invoiceRepo
            .findByConsumerNoAndProvider(
                    consumerNo,
                    provider
            )
            .orElseThrow(() ->
                    new  ResponseStatusException(HttpStatus.NOT_FOUND, "Bill not found"));

        TransactionLog txn = new TransactionLog();
        txn.setXref(generateXref());
        txn.setService(service);
        txn.setProvider(provider);
        txn.setConsumerNo(consumerNo);
        txn.setAction("INQ");
        txn.setTxnDate(LocalDateTime.now());

        txn.setStatus("SUCCESS");
        txn.setBillInvoice(invoice);
        txnRepo.save(txn);

        return invoice;
    }

    private String generateXref() {
        return "XR" + System.currentTimeMillis();
    }

    private String generateStatementBillNo() {
        return "ST" + System.currentTimeMillis();
    }
}
