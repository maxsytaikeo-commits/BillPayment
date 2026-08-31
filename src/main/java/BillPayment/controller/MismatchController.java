package BillPayment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import BillPayment.entity.MismatchLog;
import BillPayment.service.MismatchService;

@RestController
@RequestMapping("/api/mismatch")
public class MismatchController {
        @Autowired private MismatchService mismatchService;

    @GetMapping
    public List<MismatchLog> dashboard(@RequestParam(required = false) String resolutionStatus) {
        return mismatchService.dashboard(resolutionStatus);
    }

    @PostMapping("/{mismatchId}/resolve")
    public MismatchLog resolve(@PathVariable Long mismatchId) {
        return mismatchService.resolve(mismatchId);
    }

}
