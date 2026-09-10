package BillPayment.exception;

/**
 * Thrown when a call to the partner/provider does not return a definitive
 * result within the allowed time window (mocked here, but represents the
 * real-world case where a synchronous HTTP call to the provider times out,
 * or the async callback never arrives).
 *
 * On this exception the bank does NOT know whether the provider actually
 * processed the request or not - so the transaction must be kept in a
 * non-final state (PENDING) rather than marked FAILED, to avoid the risk
 * of double-charging or wrongly denying a customer who was actually charged.
 */
public class PartnerTimeoutException extends RuntimeException {
    public PartnerTimeoutException(String message) {
        super(message);
    }
}
