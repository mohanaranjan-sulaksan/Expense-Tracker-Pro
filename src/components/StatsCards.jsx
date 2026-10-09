import React from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Calendar, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const StatsCards = ({ transactions, currencySymbol, dateRangeLabel }) => {
  // Compute totals
  const totalCredit = transactions
    .filter(t => t.type === 'credit')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalDebit = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const netBalance = totalCredit - totalDebit;

  // Compute Today's numbers
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.timestamp && t.timestamp.startsWith(todayStr));
  const todayCredit = todayTransactions
    .filter(t => t.type === 'credit')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const todayDebit = todayTransactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const todayNet = todayCredit - todayDebit;

  const totalVolume = totalCredit + totalDebit;
  const creditRatio = totalVolume > 0 ? (totalCredit / totalVolume) * 100 : 50;

  return (
    <div className="stats-grid">
      {/* Total Balance Card */}
      <div className="stat-card glass-panel balance-card">
        <div className="stat-card-header">
          <div className="stat-icon-wrapper balance-icon">
            <Wallet size={22} />
          </div>
          <span className="stat-period-tag">{dateRangeLabel}</span>
        </div>
        <div className="stat-card-content">
          <span className="stat-label">Net Balance (Credit - Debit)</span>
          <h2 className={`stat-value ${netBalance >= 0 ? 'positive-balance' : 'negative-balance'}`}>
            {netBalance < 0 ? '-' : ''}
            {formatCurrency(Math.abs(netBalance), currencySymbol)}
          </h2>
          <div className="balance-bar-wrapper">
            <div className="balance-bar-track">
              <div
                className="balance-bar-fill"
                style={{ width: `${Math.min(creditRatio, 100)}%` }}
                title={`${creditRatio.toFixed(1)}% Inflow Ratio`}
              />
            </div>
            <div className="balance-bar-legend">
              <span>{creditRatio.toFixed(0)}% Inflow</span>
              <span>{(100 - creditRatio).toFixed(0)}% Outflow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Credit (Inflow) Card */}
      <div className="stat-card glass-panel credit-card">
        <div className="stat-card-header">
          <div className="stat-icon-wrapper credit-icon">
            <ArrowUpCircle size={22} />
          </div>
          <span className="flow-badge credit-badge">
            +{transactions.filter(t => t.type === 'credit').length} Entries
          </span>
        </div>
        <div className="stat-card-content">
          <span className="stat-label">Total Credits (Money In)</span>
          <h2 className="stat-value text-emerald">
            +{formatCurrency(totalCredit, currencySymbol)}
          </h2>
          <p className="stat-subtext">
            <span>Incoming revenue, salary & transfers</span>
          </p>
        </div>
      </div>

      {/* Total Debit (Outflow) Card */}
      <div className="stat-card glass-panel debit-card">
        <div className="stat-card-header">
          <div className="stat-icon-wrapper debit-icon">
            <ArrowDownCircle size={22} />
          </div>
          <span className="flow-badge debit-badge">
            -{transactions.filter(t => t.type === 'debit').length} Entries
          </span>
        </div>
        <div className="stat-card-content">
          <span className="stat-label">Total Debits (Money Out)</span>
          <h2 className="stat-value text-rose">
            -{formatCurrency(totalDebit, currencySymbol)}
          </h2>
          <p className="stat-subtext">
            <span>Expenses, bills, purchases & payouts</span>
          </p>
        </div>
      </div>

      {/* Today's Pulse Card */}
      <div className="stat-card glass-panel today-card">
        <div className="stat-card-header">
          <div className="stat-icon-wrapper today-icon">
            <Calendar size={22} />
          </div>
          <span className="live-indicator">
            <span className="live-dot" /> Today's Pulse
          </span>
        </div>
        <div className="stat-card-content">
          <span className="stat-label">Today's Net Cash Flow</span>
          <h2 className={`stat-value ${todayNet >= 0 ? 'text-emerald' : 'text-rose'}`}>
            {todayNet >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(todayNet), currencySymbol)}
          </h2>
          <div className="today-mini-breakdown">
            <span className="mini-chip mini-credit">+{formatCurrency(todayCredit, currencySymbol)}</span>
            <span className="mini-chip mini-debit">-{formatCurrency(todayDebit, currencySymbol)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
