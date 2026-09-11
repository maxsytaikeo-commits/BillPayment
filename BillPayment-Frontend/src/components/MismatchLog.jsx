import { useState, useMemo } from 'react';
import { IconAlertTriangle, IconRefresh, IconCheckCircle } from './icons';

export default function MismatchLog({ t, mismatches, handleRetry, fetchMismatchLogs }) {
  // ປ່ຽນການເຊັກສະຖານະຈາກ 'PENDING' ເປັນ 'OPEN'
  const openCount = mismatches.filter(m => m.resolutionStatus === 'OPEN').length;

  // ===== filter ຕາມ providerStatus (ເຊັ່ນ TIMEOUT) =====
  // filter ຝັ່ງ frontend ຈາກ list ທີ່ໂຫລດມາແລ້ວ (backend ກໍຮອງຮັບ GET /api/mismatch?providerStatus=
  // ຢູ່ແລ້ວ ຖ້າຕໍ່ໄປຢາກປ່ຽນເປັນ server-side filter ສຳລັບ dataset ໃຫຍ່)
  const [providerStatusFilter, setProviderStatusFilter] = useState('ALL');

  const providerStatusOptions = useMemo(() => {
    const distinct = Array.from(new Set(mismatches.map(m => m.providerStatus).filter(Boolean)));
    return ['ALL', ...distinct];
  }, [mismatches]);

  const filteredMismatches = providerStatusFilter === 'ALL'
    ? mismatches
    : mismatches.filter(m => m.providerStatus === providerStatusFilter);

  const statusStyle = (status) => {
    if (status === 'SUCCESS') return { text: 'text-emerald-700', dot: 'bg-emerald-500' };
    if (status === 'TIMEOUT') return { text: 'text-amber-700', dot: 'bg-amber-500' };
    return { text: 'text-rose-700', dot: 'bg-rose-500' };
  };

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
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <select
            value={providerStatusFilter}
            onChange={(e) => setProviderStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
          >
            {providerStatusOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'ALL' ? 'All provider status' : opt}
              </option>
            ))}
          </select>
          {openCount > 0 && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[13px] font-medium">
              <IconAlertTriangle size={15} /> {openCount} pending
            </span>
          )}
        </div>
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
              {filteredMismatches.map((item) => {
                const bankStyle = statusStyle(item.bankStatus);
                const providerStyle = statusStyle(item.providerStatus);
                return (
                <tr key={item.mismatchId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 text-slate-400 font-mono text-[13px]">#{item.mismatchId}</td>
                  <td className="py-4 px-5 font-mono text-slate-800 font-medium">
                    {item.transactionLog?.xref || item.xref}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${bankStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${bankStyle.dot}`} />{item.bankStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${providerStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${providerStyle.dot}`} />{item.providerStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-600">
                    {item.mismatchReason || item.reason}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${item.resolutionStatus === 'OPEN' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
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
                );
              })}
              {filteredMismatches.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    No mismatch records for this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}