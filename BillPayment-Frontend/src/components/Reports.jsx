import { IconDownload, IconFileText } from './icons';

export default function Reports({ 
  t = {}, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate,
  handleQuickFilter,
  reportData = [],
  loadingReport,
  reportError,
  handleGenerateReport,
  handleExportReportExcel,
  handleExportReportPdf
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{t.reportsTitle || 'Transaction Reports'}</h2>
        <p className="text-[13px] text-slate-500 mt-1">{t.reportsSub || 'Generate and export transaction reports by date range'}</p>
      </div>

      {/* Report Filter Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">{t.dateRange || 'Date Range'}</label>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Quick Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-medium text-slate-500 mr-1">{t.quickFilter || 'Quick Filter:'}</span>
                {[['today', t.today || 'Today'], ['last7', t.last7Days || 'Last 7 Days'], ['month', t.thisMonth || 'This Month']].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleQuickFilter(key)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[13px] font-medium transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Date Inputs */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <span className="text-xs text-slate-400 font-medium">{t.startDate || 'From'}</span>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="bg-transparent text-[13px] text-slate-700 focus:outline-none font-medium" 
                  />
                </div>
                
                <span className="text-slate-300 font-bold">→</span>
                
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <span className="text-xs text-slate-400 font-medium">{t.endDate || 'To'}</span>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="bg-transparent text-[13px] text-slate-700 focus:outline-none font-medium" 
                  />
                </div>

                {(startDate || endDate) && (
                  <button 
                    onClick={() => { setStartDate(''); setEndDate(''); }} 
                    className="px-3 py-2 text-slate-500 hover:text-slate-800 text-[13px] font-medium underline underline-offset-2"
                  >
                    {t.clearFilter || 'Clear'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleGenerateReport}
              disabled={!startDate || !endDate || loadingReport}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-[13px] transition-colors ${
                !startDate || !endDate || loadingReport
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-[#0f2942] hover:bg-[#16304d] text-white cursor-pointer'
              }`}
            >
              {loadingReport ? 'Generating...' : (t.generateReport || 'Generate Report')}
            </button>

            {reportData.length > 0 && (
              <>
                <button
                  onClick={handleExportReportExcel}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[13px] font-medium text-slate-700 transition-colors"
                >
                  <IconDownload size={15} /> Excel
                </button>
                <button
                  onClick={handleExportReportPdf}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[13px] font-medium text-slate-700 transition-colors"
                >
                  <IconFileText size={15} /> PDF
                </button>
              </>
            )}
          </div>

          {/* Error Message */}
          {reportError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-[13px] font-medium">
              ⚠️ {reportError}
            </div>
          )}
        </div>
      </div>

      {/* Report Results */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loadingReport ? (
          <div className="p-12 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
              <p className="text-[13px] font-medium text-slate-500">{t.loading || 'Loading report...'}</p>
            </div>
          </div>
        ) : reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[960px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide bg-slate-50">
                  <th className="py-3.5 px-5 font-medium">{t.colXref || 'XREF'}</th>
                  <th className="py-3.5 px-5 font-medium">{t.colService || 'Service'}</th>
                  <th className="py-3.5 px-5 font-medium">{t.colProvider || 'Provider'}</th>
                  <th className="py-3.5 px-5 font-medium">{t.colConsumer || 'Consumer No'}</th>
                  <th className="py-3.5 px-5 font-medium">{t.colAction || 'Action'}</th>
                  <th className="py-3.5 px-5 font-medium">{t.colStatus || 'Status'}</th>
                  <th className="py-3.5 px-5 font-medium">{t.colRespCode || 'Response Code'}</th>
                  <th className="py-3.5 px-5 font-medium">{t.colTimestamp || 'Transaction Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {reportData.map((txn, index) => (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5 font-mono text-slate-800 font-medium text-[13px]">{txn.xref}</td>
                    <td className="py-4 px-5 text-slate-600 text-[13px]">
                      {typeof txn.service === 'object' ? (txn.service.serviceName || txn.service.serviceCode) : txn.service}
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 text-[13px] font-medium">
                        {typeof txn.provider === 'object' ? (txn.provider.providerName || txn.provider.providerCode) : txn.provider}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-600 text-[13px]">{txn.consumerNo}</td>
                    <td className="py-4 px-5 text-slate-600 text-[13px]">{txn.action}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${txn.status === 'SUCCESS' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-500 text-[13px]">{txn.respCode || '-'}</td>
                    <td className="py-4 px-5 text-slate-400 font-mono text-[13px]">{new Date(txn.txnDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 text-[13px] text-slate-600 font-medium">
              {t.totalRecords || 'Total Records'}: {reportData.length}
            </div>
          </div>
        ) : startDate && endDate ? (
          <div className="p-12 text-center text-slate-500 text-[13px]">
            {t.noData || 'No transactions found for the selected date range'}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-[13px]">
            {t.selectDateRange || 'Select a date range to generate report'}
          </div>
        )}
      </div>
    </div>
  );
}
