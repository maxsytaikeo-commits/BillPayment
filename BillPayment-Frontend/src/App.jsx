import { useState, useEffect } from 'react';
import { translations } from './translations';
import Login from './components/Login';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionFilter from './components/TransactionFilter';
import TransactionTable from './components/TransactionTable';
import MismatchLog from './components/MismatchLog';
import PaySimulator from './components/PaySimulator';
import { getTransactions, getMismatches, retryTransaction, inquiryBill, confirmPayment } from './api';

export default function App() {
  const [lang, setLang] = useState('lo');
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

  // ==================== Pay Simulator loading/error ====================
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

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

  // ==================== Bill Inquiry (API ຈິງ) ====================
  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!consumerNo) return alert(lang === 'lo' ? 'ກະລຸນາປ້ອນເລກໝາຍບັນຊີ' : 'Please enter consumer number');

    setInquiryLoading(true);
    setInquiryError(null);
    try {
      const bill = await inquiryBill({ serviceCode, providerCode, consumerNo });
      setBillData(bill);
      setPaymentStep(2);
    } catch (err) {
      setInquiryError(err.message);
    } finally {
      setInquiryLoading(false);
    }
  };

  // ==================== Confirm Payment (API ຈິງ) ====================
  const handleConfirmPayment = async () => {
    setConfirmLoading(true);
    setConfirmError(null);
    try {
      const txn = await confirmPayment(billData.statementBillNo);
      setReceiptInfo({ ...billData, ...txn });
      setPaymentStep(3);
      loadTransactions(); // ອັບເດດລາຍການ Monitoring ນຳ
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRetry = (xref) => {
    return retryTransaction(xref)
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

  // ດຶງຄ່າ role ຂອງ user ທີ່ login ເຂົ້າມາ
  const userRole = user?.role?.toLowerCase() || 'customer';

  // ຖ້າຍັງບໍ່ Login ໃຫ້ສະແດງໜ້າ Login ກ່ອນ
  if (!user) {
    return (
      <Login 
        lang={lang} 
        setLang={setLang} 
        onLogin={(userData) => {
          setUser(userData);
          // ຕັ້ງຄ່າ activeTab ເລີ່ມຕົ້ນຕາມ Role ຫຼັງຈາກ Login
          const role = userData?.role?.toLowerCase();
          if (role === 'staff') {
            setActiveTab('monitoring');
          } else {
            setActiveTab('payment');
          }
        }} 
      />
    );
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
        {/* ໜ້າ Monitoring: ເປີດໃຫ້ສະເພາະ staff ເບິ່ງໄດ້ */}
        {activeTab === 'monitoring' && userRole === 'staff' && (
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

        {/* ໜ້າ Mismatch Log: ເປີດໃຫ້ສະເພາະ staff ເບິ່ງໄດ້ */}
        {activeTab === 'mismatch' && userRole === 'staff' && (
          <>
            {loadingMismatch && <p className="text-center py-10 text-slate-400 text-sm">Loading mismatches...</p>}
            {mismatchError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-4">
                Failed to load mismatches: {mismatchError}
              </div>
            )}
            {!loadingMismatch && !mismatchError && (
              <MismatchLog 
                t={t} 
                mismatches={mismatches} 
                handleRetry={handleRetry} 
                fetchMismatchLogs={loadMismatches} 
              />
            )}
          </>
        )}

        {/* ໜ້າ Pay Simulator: ເປີດໃຫ້ທັງ customer ແລະ staff ເຂົ້າໄດ້ */}
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
            inquiryLoading={inquiryLoading}
            inquiryError={inquiryError}
            confirmLoading={confirmLoading}
            confirmError={confirmError}
          />
        )}
      </main>
    </div>
  );
}