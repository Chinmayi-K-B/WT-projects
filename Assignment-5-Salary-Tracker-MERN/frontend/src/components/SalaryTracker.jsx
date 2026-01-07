import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Hash, Calendar, IndianRupee, TrendingUp, 
  Activity, Layers, CheckCircle, Clock, Trash2, XCircle, Search, AlertCircle, 
  Zap, Save, ArrowRight
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:5000/api/salary"; 

function SalaryTracker() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  const [formData, setFormData] = useState({
    employee: '',
    id: '',
    month: '',
    total: '',
    advance: '',
    paymentDate: '' 
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [stats, setStats] = useState({
    totalPaid: 0,
    pending: 0,
    transactionsCount: 0,
  });

  // --- Fetch Data ---
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get`); 
      setTransactions(response.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
      displayToast("Failed to fetch data", "error");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- Calculate Statistics ---
  useEffect(() => {
    const newStats = transactions.reduce((acc, curr) => {
      const total = parseFloat(curr.total) || parseFloat(curr.totalSalary) || 0; 
      const remaining = parseFloat(curr.remainingSalary) || 0;
      
      acc.totalPaid += total;
      acc.pending += remaining;
      return acc;
    }, { totalPaid: 0, pending: 0 });

    setStats({
      totalPaid: newStats.totalPaid,
      pending: newStats.pending,
      transactionsCount: transactions.length,
    });
  }, [transactions]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee || !formData.id || !formData.month || !formData.total || !formData.paymentDate) {
      displayToast('MISSING FIELDS DETECTED', 'error');
      return;
    }
    const numTotal = parseFloat(formData.total);
    const numAdvance = parseFloat(formData.advance) || 0;
    if (numAdvance > numTotal) {
      displayToast('INVALID ADVANCE AMOUNT', 'error');
      return;
    }

    const newTransaction = { 
      employee: formData.employee,
      id: formData.id,
      month: formData.month,
      total: numTotal,
      advance: numAdvance,
      paymentDate: formData.paymentDate
    };

    try {
      await axios.post(`${API_BASE_URL}/add`, newTransaction);
      displayToast('DATA COMMITTED TO LEDGER', 'success');
      setFormData({ employee: '', id: '', month: '', total: '', advance: '', paymentDate: '' });
      fetchTransactions(); 
    } catch (error) {
      displayToast('CONNECTION FAILURE', 'error');
    }
  };

  const handleClearForm = () => {
    setFormData({ employee: '', id: '', month: '', total: '', advance: '', paymentDate: '' });
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("PERMANENT DELETION: Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      displayToast('RECORD SCRUBBED', 'success');
      fetchTransactions();
    } catch (error) {
      displayToast('DELETION FAILED', 'error');
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const name = tx.employee || tx.employeeName || "";
    const empId = tx.id || tx.employeeID || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalSalary = formData.total ? parseFloat(formData.total) : 0;
  const advanceSalary = formData.advance ? parseFloat(formData.advance) : 0;
  const remainingSalary = totalSalary - advanceSalary;
  const utilization = totalSalary > 0 ? (advanceSalary / totalSalary) * 100 : 0;

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString) => !dateString ? "N/A" : new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="neo-container">
      <div className="dot-grid"></div>

      {/* --- TOAST --- */}
      <div className={`neo-toast ${showToast ? 'visible' : ''} ${toastType}`}>
        <div className="toast-icon">
          {toastType === 'success' ? <CheckCircle /> : <AlertCircle />}
        </div>
        <span>{toastMessage}</span>
      </div>

      <div className="layout-wrapper">
        
        {/* --- HEADER --- */}
        <header className="neo-header">
          <div className="header-block">
            <h1 className="main-title">PAYROLL_MANAGER</h1>
            <div className="badge-row">
  
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-brick green">
              <span className="label">PAID OUT</span>
              <span className="value">{formatCurrency(stats.totalPaid)}</span>
            </div>
            <div className="stat-brick purple">
              <span className="label">PENDING</span>
              <span className="value">{formatCurrency(stats.pending)}</span>
            </div>
            <div className="stat-brick white">
              <span className="label">ENTRIES</span>
              <span className="value">{stats.transactionsCount}</span>
            </div>
          </div>
        </header>

        <div className="main-grid">
          
          {/* --- SECTION 1: THE INPUT DECK --- */}
          <aside className="input-deck">
            <div className="neo-card input-card">
              <div className="card-top-bar">
                <Layers size={18} />
                <span>NEW_RECORD</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="field-group">
                  <label>EMPLOYEE_NAME</label>
                  <div className="input-wrap">
                    <User size={18} />
                    <input 
                      type="text" name="employee" placeholder="FULL NAME" 
                      value={formData.employee} onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="double-field">
                  <div className="field-group">
                    <label>ID</label>
                    <input type="text" name="id" placeholder="#" value={formData.id} onChange={handleInputChange} className="short-input" />
                  </div>
                  <div className="field-group">
                    <label>MONTH</label>
                    <input type="month" name="month" value={formData.month} onChange={handleInputChange} className="short-input" />
                  </div>
                </div>

                <div className="field-group">
                  <label>FINANCIALS (Total / Adv)</label>
                  <div className="combined-input">
                    <input type="number" name="total" placeholder="TOTAL" value={formData.total} onChange={handleInputChange} />
                    <div className="divider">/</div>
                    <input type="number" name="advance" placeholder="ADV" value={formData.advance} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="field-group">
                  <label>PAYMENT_DATE</label>
                  <div className="input-wrap">
                    <Calendar size={18} />
                    <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Brutalist Progress Bar - UPDATED */}
                <div className="brutalist-progress">
                  <div className="p-bar-label">
                    <span>CAPACITY: {utilization.toFixed(0)}%</span>
                    <span>REM: {formatCurrency(remainingSalary)}</span>
                  </div>
                  <div className="p-bar-track">
                    <div className="p-bar-fill" style={{ width: `${Math.min(utilization, 100)}%` }}></div>
                    {/* Stripes pattern overlay */}
                    <div className="stripes"></div>
                  </div>
                </div>

                <div className="btn-row">
                  <button type="button" onClick={handleClearForm} className="neo-btn small">
                    <XCircle size={18} />
                  </button>
                  <button type="submit" className="neo-btn primary">
                    <span>SAVE RECORD</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </aside>

          {/* --- SECTION 2: THE LEDGER --- */}
          <main className="ledger-deck">
            <div className="neo-card ledger-card">
              <div className="card-top-bar inverse">
                <Activity size={18} />
                <span>TRANSACTIONS</span>
                
                <div className="search-widget">
                  <Search size={16} />
                  <input 
                    type="text" placeholder="QUERY DATABASE..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-wrapper">
                <table className="neo-table">
                  <thead>
                    <tr>
                      <th>EMPLOYEE</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>BALANCE</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-cell">
                           -- NO RECORDS FOUND IN QUERY --
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx, idx) => (
                        <tr key={tx._id || idx}>
                          <td>
                            <strong>{tx.employee}</strong>
                            <div className="tiny-id">{tx.id}</div>
                          </td>
                          <td className="mono-font">{formatDate(tx.paymentDate)}</td>
                          <td className="mono-font bold">{formatCurrency(tx.total)}</td>
                          <td className="mono-font">{formatCurrency(tx.remainingSalary !== undefined ? tx.remainingSalary : ((tx.total||0) - (tx.advance||0)))}</td>
                          <td>
                            <div className={`status-tag ${tx.status === 'Fully Paid' ? 'tag-green' : 'tag-yellow'}`}>
                              {tx.status || 'PENDING'}
                            </div>
                          </td>
                          <td>
                            <button className="del-btn" onClick={() => handleDeleteTransaction(tx._id || idx)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --bg: #e0e7ff;
          --surface: #ffffff;
          --black: #101010;
          --border: 3px solid var(--black);
          --shadow: 5px 5px 0px var(--black);
          
          --c-purple: #a855f7;
          --c-yellow: #facc15;
          --c-green: #4ade80;
          --c-pink: #fb7185;
          --c-blue: #60a5fa;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'Archivo', sans-serif;
          background-color: var(--bg);
          color: var(--black);
          overflow-x: hidden;
        }

        /* --- BACKGROUND --- */
        .dot-grid {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
          background-image: radial-gradient(var(--black) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.15;
        }

        .neo-container { min-height: 100vh; padding: 2rem; display: flex; justify-content: center; }
        .layout-wrapper { width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: 2rem; }

        /* --- HEADER --- */
        .neo-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; margin-bottom: 1rem; }
        .main-title { font-weight: 900; font-size: 3rem; margin: 0; line-height: 0.9; text-transform: uppercase; letter-spacing: -2px; -webkit-text-stroke: 1px var(--black); }
        
        .badge-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .neo-badge { padding: 0.2rem 0.5rem; font-family: 'Space Mono'; font-size: 0.7rem; font-weight: bold; border: 2px solid var(--black); }
        .yellow { background: var(--c-yellow); } .pink { background: var(--c-pink); }

        .header-stats { display: flex; gap: 1rem; }
        .stat-brick { 
          background: var(--surface); border: var(--border); box-shadow: var(--shadow); 
          padding: 0.75rem 1rem; min-width: 140px;
          transition: transform 0.1s;
        }
        .stat-brick:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0px var(--black); }
        .stat-brick.green { background: var(--c-green); }
        .stat-brick.purple { background: var(--c-purple); color: white; }
        .stat-brick.white { background: var(--surface); }

        .stat-brick .label { display: block; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem; }
        .stat-brick .value { display: block; font-family: 'Space Mono'; font-weight: 700; font-size: 1.25rem; }

        /* --- GRID --- */
        .main-grid { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; align-items: start; }
        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }

        /* --- CARDS --- */
        .neo-card { background: var(--surface); border: var(--border); box-shadow: var(--shadow); overflow: hidden; }
        .card-top-bar { 
          background: var(--c-yellow); border-bottom: var(--border); padding: 0.75rem; 
          font-weight: 900; display: flex; align-items: center; gap: 0.5rem; letter-spacing: -0.5px; 
        }
        .card-top-bar.inverse { background: var(--black); color: white; }

        /* --- FORM --- */
        form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
        .field-group label { display: block; font-weight: 900; font-size: 0.8rem; margin-bottom: 0.4rem; text-transform: uppercase; }
        
        .input-wrap, .combined-input, .short-input { 
          display: flex; align-items: center; background: white; 
          border: 2px solid var(--black); padding: 0.5rem; gap: 0.5rem; 
          transition: box-shadow 0.2s;
        }
        .input-wrap:focus-within, .short-input:focus, .combined-input:focus-within { box-shadow: 4px 4px 0px rgba(0,0,0,0.2); background: #fffbeb; }
        
        input { border: none; background: transparent; width: 100%; font-family: 'Space Mono'; font-weight: bold; font-size: 0.9rem; outline: none; }
        
        .double-field { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .combined-input { padding: 0.5rem; }
        .divider { font-weight: 900; padding: 0 0.5rem; color: #ccc; }

        /* Progress - UPDATED CSS */
        .brutalist-progress { margin-top: 0.5rem; border: 2px solid var(--black); padding: 4px; background: white; }
        
        /* Changed to flex for spacing */
        .p-bar-label { 
            display: flex; 
            justify-content: space-between; 
            font-size: 0.7rem; 
            font-weight: 900; 
            margin-bottom: 4px; 
        }
        
        .p-bar-track { height: 16px; border: 2px solid var(--black); position: relative; background: #eee; }
        .p-bar-fill { height: 100%; background: var(--c-green); position: relative; z-index: 1; border-right: 2px solid var(--black); transition: width 0.3s; }
        .stripes { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px); z-index: 2; }

        /* Buttons */
        .btn-row { display: flex; gap: 1rem; margin-top: 1rem; }
        .neo-btn { 
          border: var(--border); box-shadow: 4px 4px 0px var(--black); 
          font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; 
          gap: 0.5rem; transition: all 0.1s;
        }
        .neo-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--black); }
        .neo-btn.small { padding: 0.75rem; background: var(--c-pink); }
        .neo-btn.primary { flex: 1; padding: 0.75rem; background: var(--c-blue); font-size: 1rem; }

        /* --- TABLE --- */
        .ledger-card { height: 100%; display: flex; flex-direction: column; }
        .search-widget { 
          margin-left: auto; display: flex; align-items: center; gap: 0.5rem; 
          background: white; padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid #333;
        }
        .search-widget input { font-size: 0.75rem; width: 120px; color: black; }

        .table-wrapper { overflow-x: auto; flex: 1; }
        .neo-table { width: 100%; border-collapse: collapse; font-family: 'Space Mono'; font-size: 0.85rem; }
        .neo-table th { background: #f3f4f6; border-bottom: 2px solid var(--black); padding: 1rem; text-align: left; font-weight: 700; }
        .neo-table td { padding: 1rem; border-bottom: 1px solid var(--black); vertical-align: middle; }
        .neo-table tr:last-child td { border-bottom: none; }
        .neo-table tr:hover { background: #fff7ed; }

        .tiny-id { font-size: 0.65rem; color: #666; margin-top: 2px; }
        .mono-font { font-family: 'Space Mono'; }
        .bold { font-weight: 700; }

        .status-tag { display: inline-block; padding: 2px 8px; border: 2px solid var(--black); font-size: 0.7rem; font-weight: bold; }
        .tag-green { background: var(--c-green); box-shadow: 2px 2px 0px var(--black); }
        .tag-yellow { background: var(--c-yellow); box-shadow: 2px 2px 0px var(--black); }

        .del-btn { background: var(--c-pink); border: 2px solid var(--black); cursor: pointer; padding: 4px; box-shadow: 2px 2px 0px var(--black); transition: all 0.1s; }
        .del-btn:active { transform: translate(1px, 1px); box-shadow: 1px 1px 0px var(--black); }

        .empty-cell { text-align: center; padding: 3rem; color: #888; font-style: italic; }

        /* --- TOAST --- */
        .neo-toast { 
          position: fixed; bottom: 20px; right: 20px; 
          background: var(--surface); border: var(--border); box-shadow: var(--shadow);
          padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem;
          font-weight: 900; z-index: 999; transform: translateX(200%); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .neo-toast.visible { transform: translateX(0); }
        .neo-toast.success { border-left: 10px solid var(--c-green); }
        .neo-toast.error { border-left: 10px solid var(--c-pink); }
      `}</style>
    </div>
  );
}

export default SalaryTracker;