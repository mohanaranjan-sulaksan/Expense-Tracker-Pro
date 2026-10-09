import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle, Edit2, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const BudgetBar = ({
  monthlyDebitTotal,
  budgetLimit,
  onUpdateBudget,
  currencySymbol = '₹'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(String(budgetLimit));

  const spentRatio = budgetLimit > 0 ? (monthlyDebitTotal / budgetLimit) * 100 : 0;
  const remaining = budgetLimit - monthlyDebitTotal;

  // Days left in current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();

  const handleSave = (e) => {
    e.preventDefault();
    const val = parseFloat(newBudget);
    if (!isNaN(val) && val > 0) {
      onUpdateBudget(val);
    }
    setIsEditing(false);
  };

  const getStatusColor = () => {
    if (spentRatio >= 100) return '#ef4444'; // Red
    if (spentRatio >= 80) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  return (
    <div className="budget-container glass-panel">
      <div className="budget-header">
        <div className="budget-title-area">
          <div className="budget-icon-badge" style={{ backgroundColor: `${getStatusColor()}20`, color: getStatusColor() }}>
            {spentRatio >= 100 ? <AlertTriangle size={18} /> : <Target size={18} />}
          </div>
          <div>
            <div className="budget-title-row">
              <span className="budget-tagline">Monthly Debit Target</span>
              {spentRatio >= 100 && (
                <span className="budget-alert-pill">Budget Exceeded!</span>
              )}
            </div>
            <div className="budget-amount-row">
              <strong>{formatCurrency(monthlyDebitTotal, currencySymbol)}</strong>
              <span className="text-muted"> of </span>
              {isEditing ? (
                <form onSubmit={handleSave} className="inline-budget-form">
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="inline-budget-input"
                    autoFocus
                  />
                  <button type="submit" className="inline-budget-btn">
                    <Check size={14} />
                  </button>
                </form>
              ) : (
                <span className="budget-limit-clickable" onClick={() => setIsEditing(true)}>
                  {formatCurrency(budgetLimit, currencySymbol)}
                  <Edit2 size={12} className="edit-icon-hover" />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="budget-meta-info">
          <div className="budget-status-chip">
            <span className="budget-ratio-num" style={{ color: getStatusColor() }}>
              {spentRatio.toFixed(1)}% Used
            </span>
          </div>
          <span className="budget-days-sub">
            {remaining >= 0 ? `${formatCurrency(remaining, currencySymbol)} remaining` : `Over by ${formatCurrency(Math.abs(remaining), currencySymbol)}`} • {daysLeft} days left
          </span>
        </div>
      </div>

      <div className="budget-progress-track">
        <div
          className="budget-progress-fill"
          style={{
            width: `${Math.min(spentRatio, 100)}%`,
            background: spentRatio >= 100
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : spentRatio >= 80
              ? 'linear-gradient(90deg, #10b981, #f59e0b)'
              : 'linear-gradient(90deg, #06b6d4, #10b981)'
          }}
        />
      </div>
    </div>
  );
};

export default BudgetBar;
