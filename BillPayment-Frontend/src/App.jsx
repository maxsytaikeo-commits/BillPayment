import { useState, useEffect } from 'react';
import { translations } from './translations';
import Login from './components/Login';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionFilter from './components/TransactionFilter';
import TransactionTable from './components/TransactionTable';
import MismatchLog from './components/MismatchLog';
import PaySimulator from './components/PaySimulator';
import Reports from './components/Reports';
import { getTransactions, getMismatches, retryTransaction, inquiryBill, confirmPayment, getReport } from './api';

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

  // ==================== Reports ====================
  const [reportData, setReportData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');

  const handleGenerateReport = async () => {
    if (!reportStartDate || !reportEndDate) {
      setReportError(lang === 'lo' ? 'ກະລຸນາເລືອກວັນທີ່ຕົ້ນຕໍ່ ແລະ ສິ້ນສຸດ' : 'Please select start and end dates');
      return;
    }

    setLoadingReport(true);
    setReportError(null);
    try {
      const fromISO = `${reportStartDate}T00:00:00`;
      const toISO = `${reportEndDate}T23:59:59`;
      const data = await getReport(fromISO, toISO);
      setReportData(data);
    } catch (err) {
      const errorMsg = err.status === 400 
        ? (lang === 'lo' ? 'ວັນທີ່ບໍ່ຖືກຕ້ອງ. ກະລຸນາໃຊ້ຮູບແບບ YYYY-MM-DD' : 'Invalid date format. Please use YYYY-MM-DD')
        : err.message;
      setReportError(errorMsg);
      console.error('Report generation error:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleExportReportExcel = () => {
    if (reportData.length === 0) {
      alert(lang === 'lo' ? 'ບໍ່ມີຂໍ້ມູນສຳລັບ Export' : 'No data available to export');
      return;
    }
    const headers = ['XREF', 'Service', 'Provider', 'Consumer No', 'Action', 'Status', 'Response Code', 'Date'];
    const rows = reportData.map(tx => [
      tx.xref,
      typeof tx.service === 'object' ? (tx.service.serviceName || tx.service.serviceCode) : tx.service,
      typeof tx.provider === 'object' ? (tx.provider.providerName || tx.provider.providerCode) : tx.provider,
      tx.consumerNo,
      tx.action,
      tx.status,
      tx.respCode || '-',
      tx.txnDate
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transaction_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportReportPdf = () => {
    window.print();
  };

  const handleQuickFilter = (type, isReport = false) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];
    const setters = isReport ? [setReportStartDate, setReportEndDate] : [setStartDate, setEndDate];
    const [setStart, setEnd] = setters;

    if (type === 'today') {
      const formatted = formatDate(today);
      setStart(formatted);
      setEnd(formatted);
    } else if (type === 'last7') {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setStart(formatDate(past));
      setEnd(formatDate(today));
    } else if (type === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStart(formatDate(firstDay));
      setEnd(formatDate(today));
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
      const message = err.status === 404 && err.message.includes('different provider')
        ? (lang === 'lo' ? 'ພົບບິນແລ້ວ ແຕ່ບິນຢູ່ກັບຜູ້ໃຫ້ບໍລິການອື່ນ' : 'This bill belongs to a different provider')
        : err.status === 404
        ? (lang === 'lo' ? 'ບໍ່ພົບບິນສຳລັບເລກໝາຍນີ້' : 'No bill found for this consumer number')
        : (lang === 'lo' ? 'ບໍ່ສາມາດກວດສອບບິນໄດ້' : `Unable to check bill: ${err.message}`);
      setInquiryError(message);
      alert(message);
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
      loadMismatches(); // ອັບເດດລາຍການ Mismatch ຖ້າມີເກີດຂື້ນ
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
          if (userData?.consumerNo) setConsumerNo(userData.consumerNo);
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

        {/* ໜ້າ Reports: ເປີດໃຫ້ສະເພາະ staff ເບິ່ງໄດ້ */}
        {activeTab === 'reports' && userRole === 'staff' && (
          <Reports
            t={t}
            startDate={reportStartDate}
            setStartDate={setReportStartDate}
            endDate={reportEndDate}
            setEndDate={setReportEndDate}
            handleQuickFilter={(type) => handleQuickFilter(type, true)}
            reportData={reportData}
            loadingReport={loadingReport}
            reportError={reportError}
            handleGenerateReport={handleGenerateReport}
            handleExportReportExcel={handleExportReportExcel}
            handleExportReportPdf={handleExportReportPdf}
          />
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