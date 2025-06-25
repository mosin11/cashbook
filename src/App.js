import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Daily');
  const [formType, setFormType] = useState(null); // 'cashIn' or 'cashOut'
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [cashIn, setCashIn] = useState('');
  const [cashOut, setCashOut] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    const now = new Date();
    const cashInValue = parseFloat(cashIn);
    const cashOutValue = parseFloat(cashOut);

    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (
      (formType === 'cashIn' && (isNaN(cashInValue) || cashInValue <= 0)) ||
      (formType === 'cashOut' && (isNaN(cashOutValue) || cashOutValue <= 0))
    ) {
      alert(`Please enter a valid amount for ${formType === 'cashIn' ? 'Cash In' : 'Cash Out'}`);
      return;
    }

    const newTransaction = {
      id: transactions.length + 1,
      date: now,
      description: description.trim(),
      cashIn: formType === 'cashIn' ? cashInValue : 0,
      cashOut: formType === 'cashOut' ? cashOutValue : 0,
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setCashIn('');
    setCashOut('');
    setFormType(null);
  };

  const now = new Date();
  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentWeek = getWeekNumber(now);
    const txWeek = getWeekNumber(date);

    switch (activeTab) {
      case 'Daily':
        return date.toDateString() === now.toDateString();
      case 'Weekly':
        return date.getFullYear() === currentYear && txWeek === currentWeek;
      case 'Monthly':
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      default:
        return true;
    }
  });

  const totalCashIn = filteredTransactions.reduce((sum, t) => sum + t.cashIn, 0);
  const totalCashOut = filteredTransactions.reduce((sum, t) => sum + t.cashOut, 0);
  const balance = totalCashIn - totalCashOut;

  function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  }

  return (
    <div className="app dark-mode">
      <header>
        <h1>Cash Book</h1>
      </header>

      <main>
        <section className="cash-book">
          <div className="tabs-container">
            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              ☰ Menu
            </div>
            <div className={`tabs ${menuOpen ? 'show' : 'hide'}`}>
              {['Daily', 'Weekly', 'Monthly', 'All'].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? 'active' : ''}
                  onClick={() => {
                    setActiveTab(tab);
                    setMenuOpen(false); // close menu after selection
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>


          {/* Cash In / Cash Out toggle */}
          <div className="transaction-type-buttons">
            <button
              className={formType === 'cashIn' ? 'active' : ''}
              onClick={() => setFormType('cashIn')}
            >
              💰 Cash In
            </button>
            <button
              className={formType === 'cashOut' ? 'active' : ''}
              onClick={() => setFormType('cashOut')}
            >
              💸 Cash Out
            </button>
          </div>


          {/* Transaction Form */}
          {formType && (
            <div className="add-transaction-form">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {formType === 'cashIn' && (
                <input
                  type="number"
                  placeholder="Cash In"
                  value={cashIn}
                  onChange={(e) => setCashIn(e.target.value)}
                />
              )}
              {formType === 'cashOut' && (
                <input
                  type="number"
                  placeholder="Cash Out"
                  value={cashOut}
                  onChange={(e) => setCashOut(e.target.value)}
                />
              )}
              <button onClick={addTransaction}>Add {formType === 'cashIn' ? 'Cash In' : 'Cash Out'}</button>
            </div>
          )}

          {/* Transactions table */}
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Cash In</th>
                  <th>Cash Out</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="date">{new Date(transaction.date).toLocaleString()}</div>
                      <div className="description">{transaction.description}</div>
                    </td>
                    <td className="cash-in">
                      {transaction.cashIn > 0 ? `₹${transaction.cashIn.toLocaleString()}` : ''}
                    </td>
                    <td className="cash-out">
                      {transaction.cashOut > 0 ? `₹${transaction.cashOut.toLocaleString()}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals section */}
          <div className="totals">
            <div>Total Cash In: ₹{totalCashIn.toLocaleString()}</div>
            <div>Total Cash Out: ₹{totalCashOut.toLocaleString()}</div>
            <div className={`balance ${balance < 0 ? 'negative' : ''}`}>
              Balance: ₹{Math.abs(balance).toLocaleString()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
