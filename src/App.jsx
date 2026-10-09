import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import BudgetBar from './components/BudgetBar';
import AnalyticsCharts from './components/AnalyticsCharts';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import DailyReportModal from './components/DailyReportModal';
import { INITIAL_TRANSACTIONS, CURRENCIES } from './constants/initialData';

export function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('et_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('et_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Currency state: Default to Sri Lankan Rupee (LKR - Rs.)
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('et_currency_lkr_primary');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return CURRENCIES[0]; // Default LKR (Rs.)
  });

  const handleCurrencyChange = (curr) => {
    setCurrency(curr);
    localStorage.setItem('et_currency_lkr_primary', JSON.stringify(curr));
  };

  // Transactions state
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('et_transactions_lkr_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { }
    }
    return INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('et_transactions_lkr_v1', JSON.stringify(transactions));
  }, [transactions]);

  // Monthly Budget limit state (Default Rs. 150,000)
  const [budgetLimit, setBudgetLimit] = useState(() => {
    const saved = localStorage.getItem('et_budget_lkr');
    return saved ? Number(saved) : 150000;
  });

  const handleUpdateBudget = (newLimit) => {
    setBudgetLimit(newLimit);
    localStorage.setItem('et_budget_lkr', String(newLimit));
  };

  // Date Range filter: 'today' | '7days' | 'month' | 'all'
  const [dateRange, setDateRange] = useState('all');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);

  // Compute filtered transactions according to date range tab
  const rangeFilteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return transactions.filter(t => {
      if (!t.timestamp) return true;
      const txDateStr = t.timestamp.split('T')[0];

      if (dateRange === 'today') {
        return txDateStr === todayStr;
      }
      if (dateRange === '7days') {
        const diffDays = (now - new Date(t.timestamp)) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (dateRange === 'month') {
        const txDate = new Date(t.timestamp);
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }
      return true; // 'all'
    });
  }, [transactions, dateRange]);

  // Monthly Debit Total for budget bar
  const monthlyDebitTotal = useMemo(() => {
    const now = new Date();
    return transactions
      .filter(t => {
        if (t.type !== 'debit' || !t.timestamp) return false;
        const txDate = new Date(t.timestamp);
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const dateRangeLabels = {
    today: "Today's View",
    '7days': 'Last 7 Days',
    month: 'This Month',
    all: 'All Time'
  };

  // Handlers
  const handleSaveTransaction = (transaction) => {
    setTransactions(prev => {
      const existsIndex = prev.findIndex(t => t.id === transaction.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = transaction;
        return copy;
      } else {
        return [transaction, ...prev];
      }
    });
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction entry?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleDuplicateTransaction = (tx) => {
    const duplicated = {
      ...tx,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      description: `${tx.description} (Copy)`,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [duplicated, ...prev]);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrency(CURRENCIES[0]);
    localStorage.setItem('et_currency_lkr_primary', JSON.stringify(CURRENCIES[0]));
    setBudgetLimit(150000);
    localStorage.setItem('et_budget_lkr', '150000');
  };

  return (
    <div className="app-container">
      {/* Navigation / Header */}
      <Navbar
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        theme={theme}
        onToggleTheme={toggleTheme}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onOpenNewTransaction={handleOpenNew}
        onOpenDailyReport={() => setIsDailyReportOpen(true)}
        transactions={transactions}
        onResetData={handleResetData}
      />

      {/* Primary KPI Stats Cards */}
      <StatsCards
        transactions={rangeFilteredTransactions}
        currencySymbol={currency.symbol}
        dateRangeLabel={dateRangeLabels[dateRange]}
      />

      {/* Monthly Budget Progress Bar */}
      <BudgetBar
        monthlyDebitTotal={monthlyDebitTotal}
        budgetLimit={budgetLimit}
        onUpdateBudget={handleUpdateBudget}
        currencySymbol={currency.symbol}
      />

      {/* Visual Analytics & Breakdown */}
      <AnalyticsCharts
        transactions={rangeFilteredTransactions}
        currencySymbol={currency.symbol}
      />

      {/* Transaction Ledger List */}
      <TransactionList
        transactions={rangeFilteredTransactions}
        currencySymbol={currency.symbol}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteTransaction}
        onDuplicate={handleDuplicateTransaction}
        onAddNew={handleOpenNew}
      />

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
        currencySymbol={currency.symbol}
      />

      {/* Daily Ledger Statement / Print Report Modal */}
      <DailyReportModal
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
        transactions={transactions}
        currencySymbol={currency.symbol}
      />
    </div>
  );
}

export default App;
