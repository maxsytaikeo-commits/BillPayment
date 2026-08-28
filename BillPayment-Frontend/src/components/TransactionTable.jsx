import { IconInbox } from './icons';

export default function TransactionTable({ t, filteredTransactions, lang }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
              <th className="py-3.5 px-5 font-medium">{t.colXref}</th>
              <th className="py-3.5 px-5 font-medium">{t.colService}</th>
              <th className="py-3.5 px-5 font-medium">{t.colProvider}</th>
              <th className="py-3.5 px-5 font-medium">{t.colConsumer}</th>
              <th className="py-3.5 px-5 font-medium">{t.colAction}</th>
              <th className="py-3.5 px-5 font-medium">{t.colStatus}</th>
              <th className="py-3.5 px-5 font-medium">{t.colTimestamp}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn, index) => (
                <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono text-slate-800 font-medium">{txn.xref}</td>
                  <td className="py-4 px-5 text-slate-600">{txn.service}</td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 text-[13px] font-medium">{txn.provider}</span>
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-600 text-[13px]">{txn.consumerNo}</td>
                  <td className="py-4 px-5 text-slate-600">{txn.action}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${txn.status === 'SUCCESS' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-mono text-[13px]">{txn.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <IconInbox size={26} />
                    <span className="text-sm">
                      {lang === 'lo' ? 'ບໍ່ພົບຂໍ້ມູນທຸລະກຳໃນຊ່ວງວັນທີດັ່ງກ່າວ' : 'No transactions found for the selected date range'}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}