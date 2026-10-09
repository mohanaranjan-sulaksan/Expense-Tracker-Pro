import React, { useState } from 'react';
import { X, Printer, Download, Calendar, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatFullDate, exportToCSV } from '../utils/formatters';

export const DailyReportModal = ({
  isOpen,
  onClose,
  transactions,
  currencySymbol = '₹'
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  if (!isOpen) return null;

  const dayTransactions = transactions.filter(
    t => t.timestamp && t.timestamp.startsWith(selectedDate)
  );

  const credits = dayTransactions.filter(t => t.type === 'credit');
  const debits = dayTransactions.filter(t => t.type === 'debit');

  const totalCredit = credits.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalDebit = debits.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const netFlow = totalCredit - totalDebit;

  const handlePrint = () => {
    window.print();
  };

  const handleExportDay = () => {
    exportToCSV(dayTransactions, `statement_${selectedDate}.csv`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window glass-panel printable-statement-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header no-print">
          <div>
            <h2 className="modal-title">Daily Financial Statement</h2>
            <p className="modal-subtitle">Comprehensive day-end ledger audit & print report</p>
          </div>
          <button className="icon-btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Date Selector Row */}
        <div className="statement-date-bar no-print">
          <label className="statement-date-label">
            <Calendar size={16} />
            <span>Select Ledger Date:</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="statement-date-input"
          />
          <div className="statement-action-btns">
            <button className="btn-secondary" onClick={handleExportDay}>
              <Download size={15} /> Export CSV
            </button>
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={15} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* Printable Statement Sheet */}
        <div className="statement-sheet printable-content">
          <div className="statement-header-brand">
            <div>
              <h1 className="statement-brand-title">EXPENSE TRACKER PRO</h1>
              <p className="statement-brand-sub">Daily Credit & Debit Ledger Statement</p>
            </div>
            <div className="statement-date-badge">
              <strong>{formatFullDate(selectedDate)}</strong>
              <span>Audit Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="statement-summary-banner">
            <div className="banner-col">
              <span className="banner-label">Total Credits (Money In)</span>
              <strong className="text-emerald">+{formatCurrency(totalCredit, currencySymbol)}</strong>
              <small>{credits.length} transactions</small>
            </div>
            <div className="banner-divider" />
            <div className="banner-col">
              <span className="banner-label">Total Debits (Money Out)</span>
              <strong className="text-rose">-{formatCurrency(totalDebit, currencySymbol)}</strong>
              <small>{debits.length} transactions</small>
            </div>
            <div className="banner-divider" />
            <div className="banner-col">
              <span className="banner-label">Day Net Cash Flow</span>
              <strong className={netFlow >= 0 ? 'text-emerald' : 'text-rose'}>
                {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow, currencySymbol)}
              </strong>
              <small>{netFlow >= 0 ? 'Cash Surplus' : 'Net Outflow'}</small>
            </div>
          </div>

          {/* Itemized Tables */}
          <div className="statement-sections">
            {/* Credit Table */}
            <div className="statement-section">
              <h3 className="section-title credit-title">
                <ArrowUpRight size={18} /> Inflow Entries (Credits)
              </h3>
              {credits.length === 0 ? (
                <p className="empty-subtext">No credit entries recorded for this date.</p>
              ) : (
                <table className="statement-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Mode</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credits.map(t => (
                      <tr key={t.id}>
                        <td>{t.timestamp.slice(11, 16)}</td>
                        <td>{t.category}</td>
                        <td>{t.description}</td>
                        <td>{t.paymentMode}</td>
                        <td className="text-right font-mono text-emerald">
                          +{formatCurrency(t.amount, currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Debit Table */}
            <div className="statement-section">
              <h3 className="section-title debit-title">
                <ArrowDownRight size={18} /> Outflow Entries (Debits)
              </h3>
              {debits.length === 0 ? (
                <p className="empty-subtext">No debit entries recorded for this date.</p>
              ) : (
                <table className="statement-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Mode</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debits.map(t => (
                      <tr key={t.id}>
                        <td>{t.timestamp.slice(11, 16)}</td>
                        <td>{t.category}</td>
                        <td>{t.description}</td>
                        <td>{t.paymentMode}</td>
                        <td className="text-right font-mono text-rose">
                          -{formatCurrency(t.amount, currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="statement-footer">
            <span>Generated securely by Expense Tracker Pro • All calculations verified locally</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReportModal;
