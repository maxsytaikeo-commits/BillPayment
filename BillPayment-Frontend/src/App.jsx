import { useState } from 'react';
import { translations } from './translations';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionFilter from './components/TransactionFilter';
import TransactionTable from './components/TransactionTable';
import MismatchLog from './components/MismatchLog';
import PaySimulator from './components/PaySimulator';

export default function App() {
  const [lang, setLang] = useState('lo');
  const t = translations[lang] || translations['lo'];

  const [activeTab, setActiveTab] = useState('monitoring');

  const [transactions, setTransactions] = useState([
    { xref: 'TXN-001', service: 'ELECTRICITY', provider: 'EDL', consumerNo: '012345678', action: 'PAY', status: 'SUCCESS', date: '2026-06-01 10:30:00', amount: '150,000 LAK' },
    { xref: 'TXN-002', service: 'TELECOM', provider: 'LAOTEL', consumerNo: '2055667788', action: 'PAY', status: 'FAILED', date: '2026-06-01 11:00:00', amount: '50,000 LAK' },
    { xref: 'TXN-003', service: 'WATER', provider: 'SNP', consumerNo: '99887766', action: 'PAY', status: 'SUCCESS', date: '2026-06-02 11:15:00', amount: '85,000 LAK' },
  ]);

  const [mismatches, setMismatches] = useState([
    { mismatchId: 1, xref: 'TXN-002', bankStatus: 'SUCCESS', providerStatus: 'FAILED', reason: 'Timeout from Provider API', resolutionStatus: 'PENDING' },
  ]);

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
    const headers = ['XREF', 'Service', 'Provider', 'Consumer No', 'Action', 'Status', 'Date', 'Amount'];
    const rows = filteredTransactions.map(tx => [tx.xref, tx.service, tx.provider, tx.consumerNo, tx.action, tx.status, tx.date, tx.amount]);

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
    setTransactions(prev => [{
      xref: newXref,
      service: billData.serviceCode,
      provider: billData.providerCode,
      consumerNo: billData.consumerNo,
      action: 'PAY',
      status: 'SUCCESS',
      date: currentDate,
      amount: billData.totalAmount.toLocaleString() + ' LAK'
    }, ...prev]);
    setReceiptInfo(receipt);
    setPaymentStep(3);
  };

  const handleRetry = (xref) => {
    alert(lang === 'lo' ? `Retry ສຳເລັດສຳລັບ XREF: ${xref}` : `Retry successful for XREF: ${xref}`);
    setMismatches(prev => prev.map(item => item.xref === xref ? { ...item, resolutionStatus: 'RESOLVED' } : item));
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch =
      txn.xref.toLowerCase().includes(search.toLowerCase()) ||
      txn.consumerNo.includes(search) ||
      txn.provider.toLowerCase().includes(search.toLowerCase());

    const txnDateOnly = txn.date.substring(0, 10);
    const matchesStartDate = startDate ? txnDateOnly >= startDate : true;
    const matchesEndDate = endDate ? txnDateOnly <= endDate : true;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex flex-col">
      <Header t={t} lang={lang} setLang={setLang} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="w-full flex-1 px-6 py-6 space-y-5">
        {activeTab === 'monitoring' && (
          <div className="space-y-5">
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
          </div>
        )}

        {activeTab === 'mismatch' && (
          <MismatchLog t={t} mismatches={mismatches} handleRetry={handleRetry} />
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