package BillPayment.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import BillPayment.dto.MismatchDashboardDTO;
import BillPayment.entity.MismatchLog;
import BillPayment.repository.MismatchLogRepository;

@Service
public class MismatchService {
     @Autowired private MismatchLogRepository mismatchRepo;

    /**
     * ໜ້າ dashboard ຂອງ mismatch, ຮອງຮັບ filter ໄດ້ 2 ຕົວ ພ້ອມກັນ ຫຼືແຍກກັນກໍໄດ້:
     *  - resolutionStatus: OPEN / RESOLVED
     *  - providerStatus  : SUCCESS / FAILED / TIMEOUT / UNKNOWN ...  (ໃຊ້ເບິ່ງສະເພາະ timeout ໄດ້ດ້ວຍ
     *                       providerStatus=TIMEOUT)
     */
    public List<MismatchDashboardDTO> dashboard(String resolutionStatus, String providerStatus) {
        boolean hasResolutionFilter = resolutionStatus != null && !resolutionStatus.isBlank();
        boolean hasProviderFilter = providerStatus != null && !providerStatus.isBlank();

        List<MismatchLog> logs;
        if (hasResolutionFilter && hasProviderFilter) {
            logs = mismatchRepo.findByResolutionStatusAndProviderStatus(resolutionStatus, providerStatus);
        } else if (hasResolutionFilter) {
            logs = mismatchRepo.findByResolutionStatus(resolutionStatus);
        } else if (hasProviderFilter) {
            logs = mismatchRepo.findByProviderStatus(providerStatus);
        } else {
            logs = mismatchRepo.findAll();
        }

        return logs.stream()
                .map(MismatchDashboardDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public MismatchLog resolve(Long mismatchId) {
        MismatchLog mismatch = mismatchRepo.findById(mismatchId)
                .orElseThrow(() -> new RuntimeException("Mismatch not found"));
        mismatch.setResolutionStatus("RESOLVED");
        mismatch.setResolvedDate(LocalDateTime.now());
        return mismatchRepo.save(mismatch);
    }
}

