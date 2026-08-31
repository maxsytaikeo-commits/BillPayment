import { useState, useEffect } from 'react';
import { translations } from './translations';
import Login from './components/Login';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionFilter from './components/TransactionFilter';
import TransactionTable from './components/TransactionTable';
import MismatchLog from './components/MismatchLog';
import PaySimulator from './components/PaySimulator';
import { getTransactions, getMismatches, retryTransaction } from './api';

export default function App() {
  const [lang, setLang] = useState('lo');
  // ປ່ຽນຈາກ hardcode user ເປັນ State ເພື່ອຮອງຮັບການ Login
  const [user, setUser] = useState(null);
  const t = translations[lang] || translations['lo'];

  const [activeTab, setActiveTab] = useState('monitoring');

  // ==================== ຂໍ້ມູນຈິງຈາກ Backend ====================
  const [transactions, setTransactions] = useState([]);
  const [loadingTxn, setLoadingTxn] = useState(true);
  const [txnError, setTxnError] = useState(null);

  const [mismatches, setMismatches] = useState([]);
  const [loadingMismatch, setLoadingMismatch] = useState(true);
  const [mismatchError, setMismatchError] = useState(null);

  const loadTransactions = () => {
    setLoadingTxn(true);
    setTxnError(null);
    getTransactions()
      .then(data => setTransactions(data))
      .catch(err => setTxnError(err.message))
      .finally(() => setLoadingTxn(false));
  };

  const loadMismatches = () => {
    setLoadingMismatch(true);
    setMismatchError(null);
    getMismatches()
      .then(data => setMismatches(data))
      .catch(err => setMismatchError(err.message))
      .finally(() => setLoadingMismatch(false));
  };

  useEffect(() => {
    loadTransactions();
    loadMismatches();
  }, []);

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [paymentStep, setPaymentStep] = useState(1);
  const [serviceCode, setServiceCode] = useState('ELECTRICITY');
  const [providerCode, setProviderCode] = useState('EDL');
  const [consumerNo, setConsumerNo] = useState('012345678');
  const [billData, setBillData] = useState(null);
  const [receiptInfo, setReceiptInfo] = useState(null);

  const handleQuickFilter = (type) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];

    if (type === 'today') {
      const formatted = formatDate(today);
      setStartDate(formatted);
      setEndDate(formatted);
    } else if (type === 'last7') {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setStartDate(formatDate(past));
      setEndDate(formatDate(today));
    } else if (type === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDate(firstDay));
      setEndDate(formatDate(today));
    }
  };

  const handleExportExcel = () => {
    if (filteredTransactions.length === 0) {
      alert(lang === 'lo' ? 'ບໍ່ມີຂໍ້ມູນສຳລັບ Export' : 'No data available to export');
      return;
    }
    const headers = ['XREF', 'Service', 'Provider', 'Consumer No', 'Action', 'Status', 'Date'];
    const rows = filteredTransactions.map(tx => [
      tx.xref, tx.serviceCode, tx.providerCode, tx.consumerNo, tx.action, tx.status, tx.txnDate
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `compliance_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleInquiry = (e) => {
    e.preventDefault();
    if (!consumerNo) return alert(lang === 'lo' ? 'ກະລຸນາປ້ອນເລກໝາຍບັນຊີ' : 'Please enter consumer number');

    setBillData({
      statementBillNo: 'BILL-2026-998877',
      customerName: lang === 'lo' ? 'ທ່ານ ສົມຊາຍ ໃຈດີ' : 'Mr. Somchai Jaidee',
      providerCode,
      serviceCode,
      consumerNo,
      billAmount: 150000,
      feeAmount: 2000,
      totalAmount: 152000,
      dueDate: '2026-06-10'
    });
    setPaymentStep(2);
  };

  const handleConfirmPayment = () => {
    const newXref = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const receipt = { xref: newXref, ...billData, payDate: currentDate };
    setReceiptInfo(receipt);
    setPaymentStep(3);
  };

  const handleRetry = (xref) => {
    retryTransaction(xref)
      .then(() => {
        alert(lang === 'lo' ? `Retry ສຳເລັດສຳລັບ XREF: ${xref}` : `Retry successful for XREF: ${xref}`);
        loadTransactions();
        loadMismatches();
      })
      .catch(err => alert('Retry failed: ' + err.message));
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch =
      (txn.xref || '').toLowerCase().includes(search.toLowerCase()) ||
      (txn.consumerNo || '').includes(search) ||
      (txn.providerCode || '').toLowerCase().includes(search.toLowerCase());

    const txnDateOnly = (txn.txnDate || '').substring(0, 10);
    const matchesStartDate = startDate ? txnDateOnly >= startDate : true;
    const matchesEndDate = endDate ? txnDateOnly <= endDate : true;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // ຖ້າຍັງບໍ່ Login ໃຫ້ສະແດງໜ້າ Login ກ່ອນ
  if (!user) {
    return <Login lang={lang} setLang={setLang} onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex flex-col">
      <Header 
        t={t} 
        lang={lang} 
        setLang={setLang} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={() => setUser(null)} 
      />

      <main className="w-full flex-1 max-w-7xl mx-auto px-6 py-8 space-y-6">
        {activeTab === 'monitoring' && (
          <div className="space-y-5">
            {loadingTxn && <p className="text-center py-10 text-slate-400 text-sm">Loading transactions...</p>}
            {txnError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-4">
                Failed to load transactions: {txnError}
                <br />
                <span className="text-xs text-rose-500">ກວດວ່າ Backend ຮັນຢູ່ (localhost:8080) ແລະ CORS ຖືກຕັ້ງແລ້ວ</span>
              </div>
            )}
            {!loadingTxn && !txnError && (
              <>
                <SummaryCards t={t} transactions={transactions} mismatches={mismatches} />
                <TransactionFilter
                  t={t}
                  search={search}
                  setSearch={setSearch}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  handleQuickFilter={handleQuickFilter}
                  handleExportExcel={handleExportExcel}
                  handleExportPdf={handleExportPdf}
                />
                <TransactionTable t={t} filteredTransactions={filteredTransactions} lang={lang} />
              </>
            )}
          </div>
        )}

        {activeTab === 'mismatch' && (
          <>
            {loadingMismatch && <p className="text-center py-10 text-slate-400 text-sm">Loading mismatches...</p>}
            {mismatchError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-4">
                Failed to load mismatches: {mismatchError}
              </div>
            )}
            {!loadingMismatch && !mismatchError && (
              <MismatchLog t={t} mismatches={mismatches} handleRetry={handleRetry} />
            )}
          </>
        )}

        {activeTab === 'payment' && (
          <PaySimulator
            t={t}
            lang={lang}
            paymentStep={paymentStep}
            setPaymentStep={setPaymentStep}
            serviceCode={serviceCode}
            setServiceCode={setServiceCode}
            providerCode={providerCode}
            setProviderCode={setProviderCode}
            consumerNo={consumerNo}
            setConsumerNo={setConsumerNo}
            billData={billData}
            receiptInfo={receiptInfo}
            handleInquiry={handleInquiry}
            handleConfirmPayment={handleConfirmPayment}
            setReceiptInfo={setReceiptInfo}
          />
        )}
      </main>
    </div>
  );
}