const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
     let message = errText;
    try {
      const errorBody = JSON.parse(errText);
      message = errorBody.message || errorBody.error || message;
    } catch { }
    const error = new Error(message || `Request failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

// ==================== TRANSACTION (Monitoring) ====================
export async function getTransactions() {
  return request('/api/transaction');
}

export async function searchTransactions({ serviceCode, status, consumerNo, from, to }) {
  const params = new URLSearchParams();
  if (serviceCode) params.append('serviceCode', serviceCode);
  if (status) params.append('status', status);
  if (consumerNo) params.append('consumerNo', consumerNo);
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  return request(`/api/transaction/search?${params.toString()}`);
}

export async function retryTransaction(xref) {
  return request(`/api/transaction/${xref}/retry`, { method: 'POST' });
}

// ==================== MISMATCH ====================
export async function getMismatches(resolutionStatus) {
  const query = resolutionStatus ? `?resolutionStatus=${resolutionStatus}` : '';
  return request(`/api/mismatch${query}`);
}

export async function resolveMismatch(mismatchId) {
  return request(`/api/mismatch/${mismatchId}/resolve`, { method: 'POST' });
}

// ==================== BILL PAYMENT (Pay Simulator) ====================
export async function inquiryBill({ serviceCode, providerCode, consumerNo }) {
  const params = new URLSearchParams({service:serviceCode, provider:providerCode, consumerNo });
  return request(`/api/billpayment/inquiry?${params.toString()}`);
}

export async function confirmPayment(statementBillNo) {
  const params = new URLSearchParams({ statementBillNo });
  return request(`/api/billpayment/confirm?${params.toString()}`, { method: 'POST' });
}

// ==================== REPORT ====================
export async function getReport(from, to) {
  const params = new URLSearchParams({ from, to });
  return request(`/api/report?${params.toString()}`);
}

// ==================== AUTH ====================
export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || 'Login failed');
  }
  return res.json();
}

export async function signupUser({ username, fullname, consumerNo, password }) {
  return request('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, fullname, consumerNo, password }),
  });
}