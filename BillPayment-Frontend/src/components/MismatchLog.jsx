import { IconAlertTriangle, IconRefresh, IconCheckCircle } from './icons';

export default function MismatchLog({ t, mismatches, handleRetry, fetchMismatchLogs }) {
  // ປ່ຽນການເຊັກສະຖານະຈາກ 'PENDING' ເປັນ 'OPEN'
  const openCount = mismatches.filter(m => m.resolutionStatus === 'OPEN').length;

  const handleRetryClick = async (xref) => {
    await handleRetry(xref);
    if (fetchMismatchLogs) {
      fetchMismatchLogs();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t.mismatchMgmt}</h2>
          <p className="text-[13px] text-slate-500 mt-1">{t.mismatchSub}</p>
        </div>
        {openCount > 0 && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[13px] font-medium self-start sm:self-auto">
            <IconAlertTriangle size={15} /> {openCount} pending
          </span>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                <th className="py-3.5 px-5 font-medium">{t.colId}</th>
                <th className="py-3.5 px-5 font-medium">{t.colXref}</th>
                <th className="py-3.5 px-5 font-medium">{t.colBankStatus}</th>
                <th className="py-3.5 px-5 font-medium">{t.colProviderStatus}</th>
                <th className="py-3.5 px-5 font-medium">{t.colReason}</th>
                <th className="py-3.5 px-5 font-medium">{t.colResolution}</th>
                <th className="py-3.5 px-5 font-medium text-center">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {mismatches.map((item) => (
                <tr key={item.mismatchId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 text-slate-400 font-mono text-[13px]">#{item.mismatchId}</td>
                  <td className="py-4 px-5 font-mono text-slate-800 font-medium">
                    {item.transactionLog?.xref || item.xref}
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 text-[13px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{item.bankStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 text-rose-700 text-[13px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{item.providerStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-600">
                    {item.mismatchReason || item.reason}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${item.resolutionStatus === 'OPEN' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {item.resolutionStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    {item.resolutionStatus === 'OPEN' ? (
                      <button 
                        onClick={() => handleRetryClick(item.transactionLog?.xref || item.xref)} 
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-[#16304d] text-white font-medium px-3.5 py-2 rounded-lg text-[13px] transition-colors cursor-pointer"
                      >
                        <IconRefresh size={14} /> {t.retryApi.replace(/^\S+\s/, '')}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium text-[13px]">
                        <IconCheckCircle size={15} /> {t.resolved.replace(/^\S+\s/, '')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}