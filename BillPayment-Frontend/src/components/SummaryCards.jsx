import { IconActivity, IconCheckCircle, IconAlertTriangle } from './icons';

export default function SummaryCards({ t = {}, transactions = [], mismatches = [] }) {
  const pendingCount = mismatches.filter(m => m.resolutionStatus === 'OPEN').length;

  // ຄຳນວນ %, Success Rate ແບບ Dynamic (ຖ້າຕ້ອງການ)
  const totalCount = transactions.length;
  const successCount = transactions.filter(t => t.status === 'SUCCESS').length;
  const dynamicSuccessRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) + '%' : '100%';

  const cards = [
    { label: t?.totalTxn || '', value: transactions.length, sub: t?.realtimeSynced ? t.realtimeSynced.replace('● ', '') : '', icon: IconActivity, tone: 'slate' },
    { label: t?.successRate || '', value: dynamicSuccessRate, sub: t?.stableGateway || '', icon: IconCheckCircle, tone: 'emerald' },
    { label: t?.failedMismatch || '', value: pendingCount, sub: t?.requiresAction || '', icon: IconAlertTriangle, tone: 'rose' },
  ];

  const toneMap = {
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{c.label}</p>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${toneMap[c.tone]}`}>
              <c.icon size={18} />
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-900 tabular-nums">{c.value}</p>
          <p className={`text-[13px] mt-1.5 ${c.tone === 'rose' ? 'text-rose-600' : c.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>{c.sub}</p>
        </div>
      ))}
      <div className="bg-white p-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{t?.systemStatus || ''}</p>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <p className="text-3xl font-semibold text-slate-900">{t?.online || ''}</p>
        <p className="text-[13px] mt-1.5 text-slate-500">{t?.connectedPartners || ''}</p>
      </div>
    </div>
  );
}