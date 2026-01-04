import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Hash, Calendar, IndianRupee, TrendingUp, 
  Activity, Layers, CheckCircle, Clock, Trash2, XCircle, ShieldCheck, Search, AlertCircle 
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:5000/api/salary"; 

// Aesthetic background image
const backgroundImage = "https://plus.unsplash.com/premium_photo-1678567671952-4028b2ec6c71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- Calculate Statistics ---
  useEffect(() => {
    const newStats = transactions.reduce((acc, curr) => {
      const total = parseFloat(curr.total) || parseFloat(curr.totalSalary) || 0; // Handle both key names
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

  // --- Submit to Server ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee || !formData.id || !formData.month || !formData.total || !formData.paymentDate) {
      displayToast('Please fill in all required fields.', 'error');
      return;
    }
    
    const numTotal = parseFloat(formData.total);
    const numAdvance = parseFloat(formData.advance) || 0;

    if (numAdvance > numTotal) {
      displayToast('Advance cannot be greater than total salary.', 'error');
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
      displayToast('Record saved successfully!', 'success');
      setFormData({ employee: '', id: '', month: '', total: '', advance: '', paymentDate: '' });
      fetchTransactions(); 
    } catch (error) {
      console.error("Backend Error:", error);
      displayToast('Failed to save. Is backend running?', 'error');
    }
  };

  const handleClearForm = () => {
    setFormData({ employee: '', id: '', month: '', total: '', advance: '', paymentDate: '' });
    displayToast('Form cleared.', 'success');
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      displayToast('Transaction deleted.', 'success');
      fetchTransactions();
    } catch (error) {
      displayToast('Failed to delete record.', 'error');
    }
  };

  // --- SAFE FILTER LOGIC (Fixes the White Screen) ---
  const filteredTransactions = transactions.filter((tx) => {
    // We check for both new keys (employee) and old keys (employeeName) to prevent crashes
    const name = tx.employee || tx.employeeName || "";
    const empId = tx.id || tx.employeeID || "";
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Visual Calculations
  const totalSalary = formData.total ? parseFloat(formData.total) : 0;
  const advanceSalary = formData.advance ? parseFloat(formData.advance) : 0;
  const remainingSalary = totalSalary - advanceSalary;
  const utilization = totalSalary > 0 ? (advanceSalary / totalSalary) * 100 : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if(!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay"></div>
      
      <div className={`toast-notification ${showToast ? 'show' : ''} ${toastType}`}>
        {toastType === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span>{toastMessage}</span>
      </div>

      <div className="heading-container">
        <ShieldCheck size={40} className="logo-icon" />
        <h1 className="main-heading">Salary Tracker Management System</h1>
      </div>

      {/* Statistics Section */}
      <div className="stats-container">
        <div className="stat-card bounce-in">
          <div className="stat-icon stat-paid"><CheckCircle size={24} /></div>
          <div className="stat-info">
            <h3>Total Paid</h3>
            <p className="counter">{formatCurrency(stats.totalPaid)}</p>
          </div>
        </div>
        <div className="stat-card bounce-in delay-1">
          <div className="stat-icon stat-pending"><Clock size={24} /></div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="counter">{formatCurrency(stats.pending)}</p>
          </div>
        </div>
        <div className="stat-card bounce-in delay-2">
          <div className="stat-icon stat-transactions"><Activity size={24} /></div>
          <div className="stat-info">
            <h3>Total Transactions</h3>
            <p className="counter">{stats.transactionsCount}</p>
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* Left Column: Form */}
        <div className="card form-card slide-in-left">
          <form onSubmit={handleSubmit} style={{ paddingTop: '10px' }}>
            <div className="form-group">
              <label htmlFor="employee"><User size={16} /> Employee <span className="required">*</span></label>
              <input type="text" id="employee" name="employee" value={formData.employee} onChange={handleInputChange} placeholder="Employee Name" />
            </div>
            
            <div className="input-row">
              <div className="form-group">
                <label htmlFor="id"><Hash size={16} /> ID <span className="required">*</span></label>
                <input type="text" id="id" name="id" value={formData.id} onChange={handleInputChange} placeholder="Employee ID" />
              </div>
              <div className="form-group">
                <label htmlFor="month"><Calendar size={16} /> Month <span className="required">*</span></label>
                <input type="month" id="month" name="month" value={formData.month} onChange={handleInputChange} />
              </div>
            </div>

            <div className="input-row">
              <div className="form-group">
                <label htmlFor="total"><IndianRupee size={16} /> Total <span className="required">*</span></label>
                <input type="number" id="total" name="total" value={formData.total} onChange={handleInputChange} placeholder="Total Salary" min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="advance"><TrendingUp size={16} /> Advance</label>
                <input type="number" id="advance" name="advance" value={formData.advance} onChange={handleInputChange} placeholder="Advance Amount" min="0" />
              </div>
            </div>

            <div className="form-group">
                <label htmlFor="paymentDate"><Calendar size={16} /> Payment Date <span className="required">*</span></label>
                <input type="date" id="paymentDate" name="paymentDate" value={formData.paymentDate} onChange={handleInputChange} />
            </div>

            <div className="utilization-section">
              <div className="utilization-header">
                <span>Utilization</span>
                <span>{utilization.toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(utilization, 100)}%` }}></div>
              </div>
              <div className="utilization-stats">
                <span>Adv {formatCurrency(advanceSalary)}</span>
                <span>Rem {formatCurrency(remainingSalary)}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="clear-btn" onClick={handleClearForm}>
                <XCircle size={18} /> Clear
              </button>
              <button type="submit" className="save-btn">
                <Layers size={18} /> Save Record
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Transactions */}
        <div className="card transactions-card slide-in-right">
          
          <div className="card-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="header-icon"><Activity size={20} /></div>
              <h2>Transactions</h2>
            </div>
            
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search employee..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-records">
                      {searchTerm ? "No matching records found" : "No records yet"}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, index) => (
                    <tr key={tx._id || index} className="table-row fade-in">
                      <td>
                        {/* Safe Access to prevent crash */}
                        <div style={{fontWeight: 'bold'}}>{tx.employee || tx.employeeName}</div>
                        <div style={{fontSize: '0.75rem', opacity: 0.7}}>{tx.id || tx.employeeID}</div>
                      </td>
                      <td>{tx.month || tx.monthYear}</td>
                      <td>{formatDate(tx.paymentDate)}</td>
                      
                      {/* Handle both key names for total */}
                      <td>{formatCurrency(tx.total || tx.totalSalary)}</td>
                      
                      <td>{formatCurrency(tx.remainingSalary !== undefined ? tx.remainingSalary : ((tx.total||0) - (tx.advance||0)))}</td>
                      <td>
                        <span className={`status-badge ${tx.status ? tx.status.toLowerCase().replace(/\s+/g, '-') : 'pending'}`}>
                          {tx.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteTransaction(tx._id || index)}>
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
      </div>

      {/* --- STYLES --- */}
      <style>{`
        :root {
          --bg-color: #0f172a;
          --card-bg: rgba(30, 41, 59, 0.7);
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --accent-color: #6366f1;
          --border-color: rgba(255, 255, 255, 0.1);
          --success-color: #22c55e;
          --warning-color: #eab308;
          --error-color: #ef4444;
          --info-color: #3b82f6;
        }

        body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-primary); overflow-x: hidden; }

        .app-container { min-height: 100vh; padding: 2rem; background-size: cover; background-position: center; background-attachment: fixed; position: relative; z-index: 0; }
        .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.9); z-index: -1; }

        .heading-container { 
          display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 2.5rem; 
          width: 100%; animation: fadeInDown 0.8s ease-out; 
        }
        .logo-icon { color: var(--accent-color); filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5)); }
        .main-heading { text-align: center; font-size: 2.5rem; color: var(--text-primary); text-shadow: 0 2px 4px rgba(0,0,0,0.5); margin: 0; }

        .toast-notification { position: fixed; top: 20px; right: 20px; background: #1e293b; color: var(--text-primary); padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 0.75rem; transform: translateX(120%); transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); z-index: 100; border-left: 4px solid; }
        .toast-notification.show { transform: translateX(0); }
        .toast-notification.success { border-color: var(--success-color); }
        .toast-notification.success svg { color: var(--success-color); }
        .toast-notification.error { border-color: var(--error-color); }
        .toast-notification.error svg { color: var(--error-color); }

        .stats-container { display: flex; justify-content: space-between; gap: 1.5rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
        .stat-card { flex: 1; min-width: 250px; background: var(--card-bg); backdrop-filter: blur(12px); padding: 1.5rem; border-radius: 1rem; display: flex; align-items: center; gap: 1rem; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.3); }
        .stat-icon { padding: 1rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
        .stat-paid { background: rgba(34, 197, 94, 0.2); color: var(--success-color); }
        .stat-pending { background: rgba(234, 179, 8, 0.2); color: var(--warning-color); }
        .stat-transactions { background: rgba(99, 102, 241, 0.2); color: var(--accent-color); }
        .stat-info h3 { margin: 0; font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; }
        .stat-info p { margin: 0.25rem 0 0; font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }

        .content-container { display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap; }
        .card { background: var(--card-bg); backdrop-filter: blur(12px); border-radius: 1rem; padding: 2rem; border: 1px solid var(--border-color); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); }
        .form-card { flex: 0 0 400px; }
        .transactions-card { flex: 1; min-width: 300px; }
        @media (max-width: 900px) { .content-container { flex-direction: column; } .form-card { flex: 1; width: 100%; } }

        .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .header-icon { background: var(--accent-color); padding: 0.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4); }
        .card-header h2 { margin: 0; font-size: 1.25rem; font-weight: 600; }

        /* Search Box Styles */
        .search-box {
          position: relative;
          width: 200px;
        }
        .search-box input {
          width: 100%;
          padding: 0.5rem 0.5rem 0.5rem 2rem; /* space for icon */
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          color: white;
          font-size: 0.875rem;
        }
        .search-box input:focus {
          border-color: var(--accent-color);
          outline: none;
        }
        .search-icon {
          position: absolute;
          left: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .form-group { margin-bottom: 1.25rem; }
        .input-row { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .input-row .form-group { flex: 1; min-width: 140px; }

        label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 500; }
        .required { color: var(--error-color); }

        input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color); background: rgba(15, 23, 42, 0.6); color: var(--text-primary); font-size: 1rem; outline: none; transition: all 0.2s; box-sizing: border-box; }
        input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); background: rgba(15, 23, 42, 0.9); }

        .utilization-section { background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem; border: 1px solid var(--border-color); }
        .utilization-header, .utilization-stats { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.75rem; }
        .utilization-stats { margin-bottom: 0; }
        .progress-bar { height: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 1rem; overflow: hidden; margin-bottom: 0.75rem; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-color), #a855f7); border-radius: 1rem; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

        .form-actions { display: flex; gap: 1rem; }
        .save-btn, .clear-btn { flex: 1; padding: 0.875rem; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
        .save-btn { background: var(--accent-color); color: white; }
        .save-btn:hover { background-color: #4f46e5; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); }
        .clear-btn { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); }
        .clear-btn:hover { background-color: rgba(255,255,255,0.05); color: var(--text-primary); }

        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; padding: 1rem; border-bottom: 1px solid var(--border-color); }
        td { padding: 1rem; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
        .table-row:hover { background-color: rgba(255,255,255,0.02); }
        .no-records { text-align: center; color: var(--text-secondary); padding: 3rem; font-style: italic; }
        
        /* Status Badges */
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
        .status-badge.pending { background: rgba(234, 179, 8, 0.1); color: var(--warning-color); }
        .status-badge.fully-paid { background: rgba(34, 197, 94, 0.2); color: var(--success-color); }
        .status-badge.partially-paid { background: rgba(59, 130, 246, 0.2); color: var(--info-color); }
        
        .delete-btn { background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.5rem; border-radius: 0.5rem; transition: all 0.2s; }
        .delete-btn:hover { background-color: rgba(239, 68, 68, 0.1); color: var(--error-color); }

        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .slide-in-right { animation: slideInRight 0.8s ease-out; }
        .bounce-in { animation: bounceIn 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000); }
        .fade-in { animation: fadeIn 0.5s ease-in; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}

export default SalaryTracker;