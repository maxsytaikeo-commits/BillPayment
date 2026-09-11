package BillPayment.service;

import java.time.LocalDateTime;
import java.util.List;

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
        String normalizedConsumerNo = consumerNo == null ? "" : consumerNo.trim();
        String normalizedProviderCode = providerCode == null ? "" : providerCode.trim();
        String normalizedServiceCode = serviceCode == null ? "" : serviceCode.trim();

        Provider provider = providerRepo.findById(normalizedProviderCode)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        ServiceMaster service = serviceRepo.findById(normalizedServiceCode)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        BillInvoice invoice = invoiceRepo
            .findByConsumerNoAndProvider(
                normalizedConsumerNo,
                    provider
            )
            .orElseThrow(() -> {
            if (invoiceRepo.existsByConsumerNo(normalizedConsumerNo)) {
                return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Bill exists, but it belongs to a different provider");
            }
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                "No bill found for this consumer number");
            });

        TransactionLog txn = new TransactionLog();
        txn.setXref(generateXref());
        txn.setService(service);
        txn.setProvider(provider);
        txn.setConsumerNo(normalizedConsumerNo);
        txn.setAction("INQ");
        txn.setTxnDate(LocalDateTime.now());

        txn.setStatus("SUCCESS");
        txn.setBillInvoice(invoice);
        txnRepo.save(txn);

        List<TransactionLog> logs = txnRepo.findByBillInvoice_StatementBillNo(invoice.getStatementBillNo());
        TransactionLog paidTxn = logs.stream()
                .filter(t -> "PAY".equals(t.getAction()) && "SUCCESS".equals(t.getStatus()))
                .findFirst()
                .orElse(null);

        invoice.setPaid(paidTxn != null);
        // ໃຊ້ resDate (ເວລາທີ່ໄດ້ຮັບການຢືນຢັນຈາກ provider) ຖ້າມີ, ບໍ່ດັ່ງນັ້ນໃຫ້ fallback ເປັນ txnDate
        if (paidTxn != null) {
            invoice.setPaymentDate(paidTxn.getResDate() != null ? paidTxn.getResDate() : paidTxn.getTxnDate());
        }

        return invoice;
    }

    private String generateXref() {
        return "XR" + System.currentTimeMillis();
    }

    private String generateStatementBillNo() {
        return "ST" + System.currentTimeMillis();
    }
}

