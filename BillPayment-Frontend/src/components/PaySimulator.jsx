import { IconZap, IconSmartphone, IconDroplet, IconArrowLeft, IconCheckCircle, IconRefresh, IconSearch, IconCreditCard } from './icons';

const serviceIcons = { ELECTRICITY: IconZap, TELECOM: IconSmartphone, WATER: IconDroplet };

export default function PaySimulator({
  t, lang, paymentStep, setPaymentStep, serviceCode, setServiceCode,
  providerCode, setProviderCode, consumerNo, setConsumerNo,
  billData, receiptInfo, handleInquiry, handleConfirmPayment, setReceiptInfo
}) {
  const steps = [
    { n: 1, label: lang === 'lo' ? 'ກວດສອບ' : 'Inquiry' },
    { n: 2, label: lang === 'lo' ? 'ຢືນຢັນ' : 'Confirm' },
    { n: 3, label: lang === 'lo' ? 'ໃບຮັບເງິນ' : 'Receipt' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{t.portalTitle}</h2>
        <p className="text-[13px] text-slate-500 mt-1">{t.portalSub}</p>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {/* LEFT: Form / Confirm / Receipt */}
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    paymentStep === s.n ? 'bg-slate-900 text-white' :
                    paymentStep > s.n ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {paymentStep > s.n ? '✓' : s.n}
                  </div>
                  <span className={`text-[13px] font-medium hidden sm:inline ${paymentStep === s.n ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-px ${paymentStep > s.n ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {paymentStep === 1 && (
            <form onSubmit={handleInquiry} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2.5">{t.serviceType}</label>
                <div className="grid grid-cols-3 gap-3">
                  {['ELECTRICITY', 'TELECOM', 'WATER'].map((sv) => {
                    const Icon = serviceIcons[sv];
                    const active = serviceCode === sv;
                    return (
                      <button
                        type="button"
                        key={sv}
                        onClick={() => {
                          setServiceCode(sv);
                          if (sv === 'ELECTRICITY') setProviderCode('EDL');
                          else if (sv === 'WATER') setProviderCode('SNP');
                          else setProviderCode('LAOTEL');
                        }}
                        className={`flex flex-col items-center gap-2 py-4 rounded-lg border text-[13px] font-medium transition-colors ${
                          active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon size={20} />
                        {sv}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2.5">{t.providerPartner}</label>
                <select
                  value={providerCode}
                  onChange={(e) => setProviderCode(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
                >
                  {serviceCode === 'ELECTRICITY' ? (
                    <option value="EDL">EDL — ໄຟຟ້າລາວ</option>
                  ) : serviceCode === 'WATER' ? (
                    <option value="SNP">SNP — ນ້ຳປະປາ</option>
                  ) : (
                    <>
                      <option value="LAOTEL">LAOTEL</option>
                      <option value="UNITEL">UNITEL</option>
                    </>
                  )}
                </select>
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

              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors text-sm">
                <IconSearch size={16} /> {t.inquiryBtn.replace(/^\S+\s/, '')}
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
                  <span className="text-slate-700">{billData.billAmount.toLocaleString()} LAK</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500 text-[13px]">{t.feeAmount}</span>
                  <span className="text-slate-700">{billData.feeAmount.toLocaleString()} LAK</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-slate-900">{t.totalAmount}</span>
                  <span className="font-semibold text-slate-900 text-lg">{billData.totalAmount.toLocaleString()} LAK</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setPaymentStep(1)} className="flex items-center justify-center gap-2 w-1/3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg text-sm transition-colors">
                  <IconArrowLeft size={16} /> {t.backBtn}
                </button>
                <button onClick={handleConfirmPayment} className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg text-sm transition-colors">
                  {t.confirmPayBtn.replace(/^\S+\s/, '')}
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
                <p><span className="text-slate-500">Provider</span> · {receiptInfo.providerCode}</p>
                <p><span className="text-slate-500">Total</span> · {receiptInfo.totalAmount.toLocaleString()} LAK</p>
                <p><span className="text-slate-500">Time</span> · {receiptInfo.payDate}</p>
              </div>

              <button onClick={() => { setPaymentStep(1); setReceiptInfo(null); }} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg text-sm transition-colors">
                <IconRefresh size={16} /> {t.newTxnBtn.replace(/^\S+\s/, '')}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Summary / Info panel — fills space, always visible */}
        <div className="bg-slate-900 text-white rounded-xl p-8 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <IconCreditCard size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">
                {serviceCode === 'ELECTRICITY' ? 'EDL — ໄຟຟ້າລາວ' : serviceCode === 'WATER' ? 'SNP — ນ້ຳປະປາ' : providerCode}
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
                {lang === 'lo' ? 'ເລືອກປະເພດບໍລິການ ແລະ ໃສ່ເລກບັນຊີ' : 'Select service and enter account number'}
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