const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function getTransactions() {
  const res = await fetch(`${BASE_URL}/api/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function getMismatches() {
  const res = await fetch(`${BASE_URL}/api/mismatches`);
  if (!res.ok) throw new Error('Failed to fetch mismatches');
  return res.json();
}

export async function retryTransaction(xref) {
  const res = await fetch(`${BASE_URL}/api/retry/${xref}`, { method: 'POST' });
  if (!res.ok) throw new Error('Retry failed');
  return res.json();
}

export async function inquiryBill(payload) {
  const res = await fetch(`${BASE_URL}/api/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Inquiry failed');
  return res.json();
}

export async function confirmPayment(payload) {
  const res = await fetch(`${BASE_URL}/api/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Payment failed');
  return res.json();
}