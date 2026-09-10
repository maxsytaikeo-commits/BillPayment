package BillPayment.dto;

import java.time.LocalDateTime;

import BillPayment.entity.MismatchLog;

/**
 * ຂໍ້ມູນທີ່ mismatch dashboard ຕ້ອງການໂດຍສະເພາະ (ບໍ່ສົ່ງ entity ຕົງໆ ອອກ API
 * ເພື່ອກັນບັນຫາ lazy-loading ຂອງ association ແລະ ຄວບຄຸມ field ທີ່ frontend ໃຊ້ຈິງ).
 */
public class MismatchDashboardDTO {

    private Long mismatchId;
    private String xref;
    private String consumerNo;
    private String serviceCode;
    private String providerCode;
    private String action;          // PAY / INQ / ...
    private LocalDateTime txnDate;
    private String bankStatus;
    private String providerStatus;  // SUCCESS / FAILED / TIMEOUT / UNKNOWN ...
    private String mismatchReason;
    private String resolutionStatus; // OPEN / RESOLVED
    private LocalDateTime resolvedDate;

    public MismatchDashboardDTO() {
    }

    public static MismatchDashboardDTO fromEntity(MismatchLog m) {
        MismatchDashboardDTO dto = new MismatchDashboardDTO();
        dto.setMismatchId(m.getMismatchId());
        dto.setBankStatus(m.getBankStatus());
        dto.setProviderStatus(m.getProviderStatus());
        dto.setMismatchReason(m.getMismatchReason());
        dto.setResolutionStatus(m.getResolutionStatus());
        dto.setResolvedDate(m.getResolvedDate());

        if (m.getTransactionLog() != null) {
            dto.setXref(m.getTransactionLog().getXref());
            dto.setConsumerNo(m.getTransactionLog().getConsumerNo());
            dto.setAction(m.getTransactionLog().getAction());
            dto.setTxnDate(m.getTransactionLog().getTxnDate());
            if (m.getTransactionLog().getService() != null) {
                dto.setServiceCode(m.getTransactionLog().getService().getServiceCode());
            }
            if (m.getTransactionLog().getProvider() != null) {
                dto.setProviderCode(m.getTransactionLog().getProvider().getProviderCode());
            }
        }
        return dto;
    }

    public Long getMismatchId() { return mismatchId; }
    public void setMismatchId(Long mismatchId) { this.mismatchId = mismatchId; }

    public String getXref() { return xref; }
    public void setXref(String xref) { this.xref = xref; }

    public String getConsumerNo() { return consumerNo; }
    public void setConsumerNo(String consumerNo) { this.consumerNo = consumerNo; }

    public String getServiceCode() { return serviceCode; }
    public void setServiceCode(String serviceCode) { this.serviceCode = serviceCode; }

    public String getProviderCode() { return providerCode; }
    public void setProviderCode(String providerCode) { this.providerCode = providerCode; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public LocalDateTime getTxnDate() { return txnDate; }
    public void setTxnDate(LocalDateTime txnDate) { this.txnDate = txnDate; }

    public String getBankStatus() { return bankStatus; }
    public void setBankStatus(String bankStatus) { this.bankStatus = bankStatus; }

    public String getProviderStatus() { return providerStatus; }
    public void setProviderStatus(String providerStatus) { this.providerStatus = providerStatus; }

    public String getMismatchReason() { return mismatchReason; }
    public void setMismatchReason(String mismatchReason) { this.mismatchReason = mismatchReason; }

    public String getResolutionStatus() { return resolutionStatus; }
    public void setResolutionStatus(String resolutionStatus) { this.resolutionStatus = resolutionStatus; }

    public LocalDateTime getResolvedDate() { return resolvedDate; }
    public void setResolvedDate(LocalDateTime resolvedDate) { this.resolvedDate = resolvedDate; }
}
