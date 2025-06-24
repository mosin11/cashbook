import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Daily');
  const [dateInput, setDateInput] = useState(getLocalDateTimeString());
  const [transactions, setTransactions] = useState([]);


  const [description, setDescription] = useState('');
  const [cashIn, setCashIn] = useState('');
  const [cashOut, setCashOut] = useState('');

  function getLocalDateTimeString() {
    const now = new Date();

    return now.toISOString().slice(0, 16); // local time
  }

  const addTransaction = () => {
    const cashInValue = parseFloat(cashIn);
    const cashOutValue = parseFloat(cashOut);

    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (
      (isNaN(cashInValue) || cashInValue < 0) &&
      (isNaN(cashOutValue) || cashOutValue < 0)
    ) {
      alert('Please enter a valid positive amount for Cash In or Cash Out');
      return;
    }

    if (cashInValue > 0 && cashOutValue > 0) {
      alert('You cannot enter both Cash In and Cash Out at the same time');
      return;
    }

    if (cashInValue <= 0 && cashOutValue <= 0) {
      alert('Please enter a non-zero value for either Cash In or Cash Out');
      return;
    }

    const now = new Date();

    const newTransaction = {
      id: transactions.length + 1,
      date: now,
      description: description.trim(),
      cashIn: cashInValue > 0 ? cashInValue : 0,
      cashOut: cashOutValue > 0 ? cashOutValue : 0,
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setCashIn('');
    setCashOut('');
  };




  // Filter logic based on tab
  const now = new Date();
  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);

    switch (activeTab) {
      case 'Daily':
        return date.toDateString() === now.toDateString();

      case 'Weekly': {
        // Get start (Sunday) and end (Saturday) of this calendar week
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return date >= startOfWeek && date <= endOfWeek;
      }

      case 'Monthly': {
        // Get start and end of the current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return date >= startOfMonth && date <= endOfMonth;
      }

      case 'All':
      default:
        return true;
    }
  });


  const totalCashIn = filteredTransactions.reduce((sum, t) => sum + t.cashIn, 0);
  const totalCashOut = filteredTransactions.reduce((sum, t) => sum + t.cashOut, 0);
  const balance = totalCashIn - totalCashOut;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);


  return (
    <div className="app dark-mode">
      <header>
        <h1>Cash Book</h1>

      </header>

      <main>
        <section className="cash-book">
          <div className="tabs">
            {['Daily', 'Weekly', 'Monthly', 'All'].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="add-transaction-form">

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cash In"
              value={cashIn}
              onChange={(e) => setCashIn(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cash Out"
              value={cashOut}
              onChange={(e) => setCashOut(e.target.value)}
            />
            <button onClick={addTransaction}>Add Transaction</button>
          </div>


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
                      <div className="date">
                        {new Date(transaction.date).toLocaleString()}
                      </div>

                      <div className="description">{transaction.description}</div>
                    </td>
                    <td className="cash-in">

                      {transaction.cashIn > 0 ? formatCurrency(transaction.cashIn) : ''}
                    </td>
                    <td className="cash-out">
                      {transaction.cashOut > 0 ? formatCurrency(transaction.cashOut) : ''}
                      { }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totals">
            <div>Total Cash In: {formatCurrency(totalCashIn)}</div>

            <div>Total Cash Out: {formatCurrency(totalCashOut)}</div>

            <div className={`balance ${balance < 0 ? 'negative' : ''}`}>
              Balance: {formatCurrency(Math.abs(balance))}
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
