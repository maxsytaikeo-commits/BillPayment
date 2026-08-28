import { IconSearch, IconDownload, IconFileText } from './icons';

export default function TransactionFilter({
  t, search, setSearch, startDate, setStartDate, endDate, setEndDate,
  handleQuickFilter, handleExportExcel, handleExportPdf
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t.txnLogs}</h2>
          <p className="text-[13px] text-slate-500 mt-1">{t.txnLogsSub}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-[13px] font-medium text-slate-700 transition-colors"
          >
            <IconDownload size={15} /> Excel
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-[13px] font-medium text-slate-700 transition-colors"
          >
            <IconFileText size={15} /> PDF
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="relative max-w-md">
          <IconSearch size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-slate-500 mr-1">{t.quickFilter}</span>
            {[['today', t.today], ['last7', t.last7Days], ['month', t.thisMonth]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleQuickFilter(key)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[13px] font-medium transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-400 font-medium">{t.startDate}</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[13px] text-slate-700 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-400 font-medium">{t.endDate}</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[13px] text-slate-700 focus:outline-none" />
            </div>
            {(startDate || endDate) && (
              <button onClick={() => { setStartDate(''); setEndDate(''); }} className="px-3 py-2 text-slate-500 hover:text-slate-800 text-[13px] font-medium underline underline-offset-2">
                {t.resetFilter}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}