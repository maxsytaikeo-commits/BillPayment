package BillPayment.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import BillPayment.entity.MismatchLog;
import BillPayment.repository.MismatchLogRepository;

@Service
public class MismatchService {
     @Autowired private MismatchLogRepository mismatchRepo;

    public List<MismatchLog> dashboard(String resolutionStatus) {
        if (resolutionStatus != null && !resolutionStatus.isBlank()) {
            return mismatchRepo.findByResolutionStatus(resolutionStatus);
        }
        return mismatchRepo.findAll();
    }

    public MismatchLog resolve(Long mismatchId) {
        MismatchLog mismatch = mismatchRepo.findById(mismatchId)
                .orElseThrow(() -> new RuntimeException("Mismatch not found"));
        mismatch.setResolutionStatus("RESOLVED");
        mismatch.setResolvedDate(LocalDateTime.now());
        return mismatchRepo.save(mismatch);
    }
}
