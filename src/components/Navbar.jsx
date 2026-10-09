import React, { useState } from 'react';
import {
  PlusCircle,
  Download,
  Upload,
  Moon,
  Sun,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { CURRENCIES, INITIAL_TRANSACTIONS } from '../constants/initialData';
import { exportToCSV, exportToJSON } from '../utils/formatters';

export const Navbar = ({
  currency,
  onCurrencyChange,
  theme,
  onToggleTheme,
  dateRange,
  onDateRangeChange,
  onOpenNewTransaction,
  onOpenDailyReport,
  transactions,
  onResetData
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(transactions, `ExpenseTrackerPro_${Date.now()}.csv`);
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    exportToJSON(transactions, `ExpenseTrackerPro_Backup_${Date.now()}.json`);
    setShowExportMenu(false);
  };

  return (
    <header className="app-header glass-panel">
      <div className="header-top-row">
        {/* Brand */}
        <div className="brand-group">
          <div className="brand-logo-glow">
            <span className="brand-icon">💳</span>
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">ExpenseTracker<span className="brand-pro-pill">PRO</span></h1>
            </div>
            <p className="brand-subtitle">Daily Credit & Debit Transaction Intelligence</p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="header-actions">
          {/* Daily Statement Button */}
          <button
            className="action-pill-btn statement-btn"
            onClick={onOpenDailyReport}
            title="View & Print Daily Balance Statement"
          >
            <FileText size={16} />
            <span className="btn-hide-mobile">Daily Statement</span>
          </button>

          {/* Export Menu */}
          <div className="dropdown-container">
            <button
              className="action-pill-btn export-menu-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="Export Transactions"
            >
              <Download size={16} />
              <span className="btn-hide-mobile">Export</span>
              <ChevronDown size={14} />
            </button>

            {showExportMenu && (
              <div className="glass-dropdown-menu">
                <button onClick={handleExportCSV} className="dropdown-item">
                  <FileSpreadsheet size={15} /> Export as CSV Sheet
                </button>
                <button onClick={handleExportJSON} className="dropdown-item">
                  <Download size={15} /> Export Backup (JSON)
                </button>
                <div className="dropdown-divider" />
                <button
                  onClick={() => {
                    if (window.confirm('Reset data to initial sample transactions?')) {
                      onResetData();
                      setShowExportMenu(false);
                    }
                  }}
                  className="dropdown-item text-danger"
                >
                  <RotateCcw size={15} /> Reset Sample Data
                </button>
              </div>
            )}
          </div>

          {/* Currency Switcher */}
          <div className="currency-selector-wrap">
            <select
              value={currency.code}
              onChange={(e) => {
                const found = CURRENCIES.find(c => c.code === e.target.value);
                if (found) onCurrencyChange(found);
              }}
              className="currency-dropdown"
              title="Select Base Currency"
            >
              {CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Primary CTA */}
          <button
            className="btn-primary-glow"
            onClick={onOpenNewTransaction}
          >
            <PlusCircle size={18} />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Quick Date Range Filter Bar */}
      <div className="header-filters-row">
        <span className="filter-label">Filter View:</span>
        <div className="filter-pill-nav">
          {[
            { id: 'today', label: "Today" },
            { id: '7days', label: 'Last 7 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Transactions' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`filter-range-tab ${dateRange === tab.id ? 'active' : ''}`}
              onClick={() => onDateRangeChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
