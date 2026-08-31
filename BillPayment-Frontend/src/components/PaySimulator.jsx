import { IconZap, IconSmartphone, IconDroplet, IconArrowLeft, IconCheckCircle, IconRefresh, IconSearch, IconCreditCard, IconChevronDown, IconAlertTriangle } from './icons';

const serviceIcons = { ELECTRICITY: IconZap, TELECOM: IconSmartphone, WATER: IconDroplet };

// codes ຄົງທີ່ — ຊື່ສະແດງຜົນມາຈາກ t.providerNames ຕາມພາສາ
const allProviderCodes = [
  { code: 'EDL', service: 'ELECTRICITY' },
  { code: 'SNP', service: 'WATER' },
  { code: 'LAOTEL', service: 'TELECOM' },
  { code: 'UNITEL', service: 'TELECOM' },
];

export default function PaySimulator({
  t, lang, paymentStep, setPaymentStep, serviceCode, setServiceCode,
  providerCode, setProviderCode, consumerNo, setConsumerNo,
  billData, receiptInfo, handleInquiry, handleConfirmPayment, setReceiptInfo,
  inquiryLoading, inquiryError, confirmLoading, confirmError
}) {
  const steps = [
    { n: 1, label: lang === 'lo' ? 'ກວດສອບ' : 'Inquiry' },
    { n: 2, label: lang === 'lo' ? 'ຢືນຢັນ' : 'Confirm' },
    { n: 3, label: lang === 'lo' ? 'ໃບຮັບເງິນ' : 'Receipt' },
  ];

  const providerName = (code) => t.providerNames?.[code] || code;

  const groupedProviders = allProviderCodes.reduce((groups, p) => {
    (groups[p.service] = groups[p.service] || []).push(p);
    return groups;
  }, {});

  const CurrentServiceIcon = serviceIcons[serviceCode] || IconCreditCard;
  const currentProvider = allProviderCodes.find(p => p.code === providerCode);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{t.portalTitle}</h2>
        <p className="text-[13px] text-slate-500 mt-1">{t.portalSub}</p>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {/* LEFT: Form / Confirm / Receipt */}
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          {/* modern step indicator */}
          <div className="flex items-center mb-9">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div className={`relative w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all duration-300 ${
                    paymentStep === s.n
                      ? 'bg-[#0f2942] text-white ring-4 ring-[#0f2942]/10'
                      : paymentStep > s.n
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {paymentStep > s.n ? (
                      <IconCheckCircle size={16} />
                    ) : s.n}
                  </div>
                  <span className={`text-[11px] font-medium whitespace-nowrap ${
                    paymentStep === s.n ? 'text-slate-900' : paymentStep > s.n ? 'text-emerald-600' : 'text-slate-400'
                  }`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-3 -mt-5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: paymentStep > s.n ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {paymentStep === 1 && (
            <form onSubmit={handleInquiry} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2.5">{t.providerPartner}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <CurrentServiceIcon size={18} />
                  </span>
                  <select
                    value={providerCode}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setProviderCode(selected);
                      const found = allProviderCodes.find(p => p.code === selected);
                      if (found) setServiceCode(found.service);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-11 pr-10 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
                  >
                    {Object.entries(groupedProviders).map(([service, providers]) => (
                      <optgroup key={service} label={service}>
                        {providers.map(p => (
                          <option key={p.code} value={p.code}>{p.code} — {providerName(p.code)}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <IconChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2.5">{t.consumerNoLabel}</label>
                <input
                  type="text"
                  value={consumerNo}
                  onChange={(e) => setConsumerNo(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
                />
              </div>

              {inquiryError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] rounded-lg px-3.5 py-2.5">
                  <IconAlertTriangle size={15} />
                  {inquiryError}
                </div>
              )}

              <button
                type="submit"
                disabled={inquiryLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#0f2942] hover:bg-[#16304d] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm"
              >
                {inquiryLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {lang === 'lo' ? 'ກຳລັງກວດສອບ...' : 'Checking...'}
                  </>
                ) : (
                  <>
                    <IconSearch size={16} /> {t.inquiryBtn.replace(/^\S+\s/, '')}
                  </>
                )}
              </button>
            </form>
          )}

          {paymentStep === 2 && billData && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500 text-[13px]">{t.customerName}</span>
                  <span className="font-medium text-slate-900">{billData.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500 text-[13px]">{t.statementNo}</span>
                  <span className="font-mono text-slate-700 text-[13px]">{billData.statementBillNo}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500 text-[13px]">{t.billAmount}</span>
                  <span className="text-slate-700">{billData.billAmount?.toLocaleString()} LAK</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500 text-[13px]">{t.feeAmount}</span>
                  <span className="text-slate-700">{billData.feeAmount?.toLocaleString()} LAK</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-slate-900">{t.totalAmount}</span>
                  <span className="font-semibold text-slate-900 text-lg">{billData.totalAmount?.toLocaleString()} LAK</span>
                </div>
              </div>

              {confirmError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] rounded-lg px-3.5 py-2.5">
                  <IconAlertTriangle size={15} />
                  {confirmError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentStep(1)}
                  disabled={confirmLoading}
                  className="flex items-center justify-center gap-2 w-1/3 border border-slate-200 hover:bg-slate-50 disabled:opacity-60 text-slate-700 font-medium py-3 rounded-lg text-sm transition-colors"
                >
                  <IconArrowLeft size={16} /> {t.backBtn}
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={confirmLoading}
                  className="w-2/3 flex items-center justify-center gap-2 bg-[#0f2942] hover:bg-[#16304d] disabled:opacity-60 text-white font-medium py-3 rounded-lg text-sm transition-colors"
                >
                  {confirmLoading && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {confirmLoading
                    ? (lang === 'lo' ? 'ກຳລັງດຳເນີນການ...' : 'Processing...')
                    : t.confirmPayBtn.replace(/^\S+\s/, '')}
                </button>
              </div>
            </div>
          )}

          {paymentStep === 3 && receiptInfo && (
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <IconCheckCircle size={28} />
                </div>
                <p className="text-slate-900 font-medium text-sm">{t.successPayMsg.replace(/^\S+\s/, '')}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-left space-y-2 text-[13px] font-mono">
                <p className="text-slate-500 pb-3 border-b border-slate-200 text-center font-sans font-semibold text-[13px] uppercase tracking-wide">{t.officialReceipt}</p>
                <p><span className="text-slate-500">XREF</span> · {receiptInfo.xref}</p>
                <p><span className="text-slate-500">Customer</span> · {receiptInfo.customerName}</p>
                <p><span className="text-slate-500">Provider</span> · {providerName(receiptInfo.providerCode)}</p>
                <p><span className="text-slate-500">Total</span> · {receiptInfo.totalAmount?.toLocaleString()} LAK</p>
                <p><span className="text-slate-500">Time</span> · {receiptInfo.payDate}</p>
              </div>

              <button onClick={() => { setPaymentStep(1); setReceiptInfo(null); }} className="w-full flex items-center justify-center gap-2 bg-[#0f2942] hover:bg-[#16304d] text-white font-medium py-3 rounded-lg text-sm transition-colors">
                <IconRefresh size={16} /> {t.newTxnBtn.replace(/^\S+\s/, '')}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Summary / Info panel */}
        <div className="bg-[#0f2942] text-white rounded-xl p-8 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <CurrentServiceIcon size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">
                {currentProvider ? `${currentProvider.code} — ${providerName(currentProvider.code)}` : providerCode}
              </p>
              <p className="text-[13px] text-slate-400">{serviceCode}</p>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="space-y-4 text-[13px]">
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'lo' ? 'ເລກບັນຊີ' : 'Account'}</span>
              <span className="font-mono">{consumerNo || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'lo' ? 'ຂັ້ນຕອນປັດຈຸບັນ' : 'Current step'}</span>
              <span className="font-medium">{paymentStep} / 3</span>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">
              {lang === 'lo' ? 'ຂັ້ນຕອນການເຮັດວຽກ' : 'How it works'}
            </p>
            <ol className="space-y-3 text-[13px] text-slate-300">
              <li className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">1</span>
                {lang === 'lo' ? 'ເລືອກຜູ້ໃຫ້ບໍລິການ ແລະ ໃສ່ເລກບັນຊີ' : 'Select provider and enter account number'}
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">2</span>
                {lang === 'lo' ? 'ລະບົບກວດສອບຍອດໜີ້ຈາກ Provider' : 'System fetches bill from provider'}
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[11px]">3</span>
                {lang === 'lo' ? 'ຢືນຢັນ ແລະ ຮັບໃບຮັບເງິນ' : 'Confirm and receive receipt'}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}