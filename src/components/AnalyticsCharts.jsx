import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { PieChart, BarChart3, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import { CATEGORIES } from '../constants/initialData';

export const AnalyticsCharts = ({ transactions, currencySymbol }) => {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'cashflow' | 'modes'

  // Calculate Category breakdown for debits
  const debitTransactions = transactions.filter(t => t.type === 'debit');
  const creditTransactions = transactions.filter(t => t.type === 'credit');

  const totalDebit = debitTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalCredit = creditTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);

  // Group debits by category
  const categoryDebitTotals = debitTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  // Find category metadata
  const categoryList = Object.entries(categoryDebitTotals)
    .map(([catName, amount]) => {
      const meta = CATEGORIES.debit.find(c => c.id === catName || c.name === catName) || {
        name: catName,
        color: '#64748b'
      };
      const percentage = totalDebit > 0 ? (amount / totalDebit) * 100 : 0;
      return {
        id: catName,
        name: meta.name || catName,
        amount,
        percentage,
        color: meta.color || '#6366f1'
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Payment mode breakdown
  const paymentModeTotals = transactions.reduce((acc, t) => {
    const mode = t.paymentMode || 'Other';
    acc[mode] = (acc[mode] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  const totalVol = transactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const modeList = Object.entries(paymentModeTotals)
    .map(([mode, amount]) => ({
      mode,
      amount,
      percentage: totalVol > 0 ? (amount / totalVol) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // Group by last 7 days for cashflow bar chart
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

    const dayCredits = creditTransactions
      .filter(t => t.timestamp && t.timestamp.startsWith(dateStr))
      .reduce((s, t) => s + Number(t.amount || 0), 0);

    const dayDebits = debitTransactions
      .filter(t => t.timestamp && t.timestamp.startsWith(dateStr))
      .reduce((s, t) => s + Number(t.amount || 0), 0);

    last7Days.push({
      dateStr,
      label: dayLabel,
      credit: dayCredits,
      debit: dayDebits
    });
  }

  const maxDailyValue = Math.max(
    ...last7Days.map(d => Math.max(d.credit, d.debit)),
    100
  );

  return (
    <div className="analytics-card glass-panel">
      <div className="analytics-header">
        <div className="analytics-title-group">
          <div className="section-badge">
            <BarChart3 size={16} />
            <span>Visual Analytics</span>
          </div>
          <h3>Financial Insights & Distribution</h3>
        </div>

        <div className="tab-pill-group">
          <button
            className={`tab-pill-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <PieChart size={14} />
            <span>Category Spend</span>
          </button>
          <button
            className={`tab-pill-btn ${activeTab === 'cashflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('cashflow')}
          >
            <TrendingUp size={14} />
            <span>7-Day Cashflow</span>
          </button>
          <button
            className={`tab-pill-btn ${activeTab === 'modes' ? 'active' : ''}`}
            onClick={() => setActiveTab('modes')}
          >
            <Layers size={14} />
            <span>Payment Modes</span>
          </button>
        </div>
      </div>

      <div className="analytics-body">
        {activeTab === 'categories' && (
          <div className="category-insights">
            {categoryList.length === 0 ? (
              <div className="empty-chart">
                <p>No expense data recorded in this period yet.</p>
              </div>
            ) : (
              <div className="category-chart-grid">
                {/* Visual Donut representation */}
                <div className="donut-wrapper">
                  <svg viewBox="0 0 100 100" className="donut-svg">
                    {categoryList.map((cat, idx) => {
                      // Calculate stroke dasharray and dashoffset
                      let accumulated = categoryList
                        .slice(0, idx)
                        .reduce((sum, item) => sum + item.percentage, 0);
                      const circumference = 2 * Math.PI * 38;
                      const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -((accumulated / 100) * circumference);

                      return (
                        <circle
                          key={cat.id}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke={cat.color}
                          strokeWidth="14"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="donut-segment"
                        />
                      );
                    })}
                  </svg>
                  <div className="donut-center-info">
                    <span className="donut-center-label">Total Outflow</span>
                    <strong className="donut-center-value">{formatCurrency(totalDebit, currencySymbol)}</strong>
                    <span className="donut-center-sub">{categoryList.length} Categories</span>
                  </div>
                </div>

                {/* Category percentage bars */}
                <div className="category-bars-list">
                  {categoryList.map(cat => (
                    <div key={cat.id} className="category-bar-row">
                      <div className="cat-bar-header">
                        <span className="cat-dot-name">
                          <span className="cat-color-dot" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                        <div className="cat-bar-amounts">
                          <span className="cat-amount">{formatCurrency(cat.amount, currencySymbol)}</span>
                          <span className="cat-pct">{cat.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="cat-progress-track">
                        <div
                          className="cat-progress-fill"
                          style={{
                            width: `${Math.min(cat.percentage, 100)}%`,
                            backgroundColor: cat.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cashflow' && (
          <div className="cashflow-insights">
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-indicator credit-indicator" />
                Credit Inflow (+{formatCurrency(totalCredit, currencySymbol)})
              </span>
              <span className="legend-item">
                <span className="legend-indicator debit-indicator" />
                Debit Outflow (-{formatCurrency(totalDebit, currencySymbol)})
              </span>
            </div>

            <div className="bar-chart-container">
              {last7Days.map(day => {
                const creditHeight = maxDailyValue > 0 ? (day.credit / maxDailyValue) * 100 : 0;
                const debitHeight = maxDailyValue > 0 ? (day.debit / maxDailyValue) * 100 : 0;

                return (
                  <div key={day.dateStr} className="daily-bar-column">
                    <div className="bar-group">
                      <div
                        className="bar credit-bar"
                        style={{ height: `${Math.max(creditHeight, 3)}%` }}
                        title={`Credit: ${formatCurrency(day.credit, currencySymbol)}`}
                      >
                        {day.credit > 0 && <span className="bar-tooltip-val">+{formatCurrency(day.credit, currencySymbol)}</span>}
                      </div>
                      <div
                        className="bar debit-bar"
                        style={{ height: `${Math.max(debitHeight, 3)}%` }}
                        title={`Debit: ${formatCurrency(day.debit, currencySymbol)}`}
                      >
                        {day.debit > 0 && <span className="bar-tooltip-val">-{formatCurrency(day.debit, currencySymbol)}</span>}
                      </div>
                    </div>
                    <span className="bar-label">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'modes' && (
          <div className="payment-modes-grid">
            {modeList.map(item => (
              <div key={item.mode} className="mode-card glass-subcard">
                <div className="mode-card-top">
                  <span className="mode-badge">{item.mode}</span>
                  <span className="mode-percentage">{item.percentage.toFixed(1)}% of volume</span>
                </div>
                <h4 className="mode-amount">{formatCurrency(item.amount, currencySymbol)}</h4>
                <div className="mode-track">
                  <div
                    className="mode-fill"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;
