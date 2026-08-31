package BillPayment.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import BillPayment.service.TransactionMonitorService;
import BillPayment.entity.TransactionLog;
import BillPayment.service.RetryService;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {
    @Autowired private TransactionMonitorService monitorService;
    @Autowired private RetryService retryService;

    @GetMapping
    public List<TransactionLog> monitor() {
        return monitorService.monitorAll();
    }

    @GetMapping("/search")
    public List<TransactionLog> search(
            @RequestParam(required = false) String serviceCode,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String consumerNo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return monitorService.search(serviceCode, status, from, to, consumerNo);
    }

    @PostMapping("/{xref}/retry")
    public TransactionLog retry(@PathVariable String xref) {
        return retryService.retry(xref);
    }
}
