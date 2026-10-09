import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  Edit3,
  Copy,
  ChevronDown,
  Calendar,
  Layers,
  Inbox
} from 'lucide-react';
import { formatCurrency, formatDate, formatFullDate, formatTime } from '../utils/formatters';
import { CATEGORIES, PAYMENT_MODES } from '../constants/initialData';
import CategoryIcon from './CategoryIcon';

export const TransactionList = ({
  transactions,
  currencySymbol = '₹',
  onEdit,
  onDelete,
  onDuplicate,
  onAddNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'credit' | 'debit'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  // Filter & sort logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Type match
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;

      // Category match
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

      // Payment mode match
      if (paymentModeFilter !== 'all' && t.paymentMode !== paymentModeFilter) return false;

      // Search term match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const descMatch = (t.description || '').toLowerCase().includes(query);
        const notesMatch = (t.notes || '').toLowerCase().includes(query);
        const catMatch = (t.category || '').toLowerCase().includes(query);
        const tagMatch = (t.tags || []).some(tag => tag.toLowerCase().includes(query));
        const amountMatch = String(t.amount || '').includes(query);
        if (!descMatch && !notesMatch && !catMatch && !tagMatch && !amountMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      if (sortBy === 'amount-desc') {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === 'amount-asc') {
        return Number(a.amount) - Number(b.amount);
      }
      return 0;
    });
  }, [transactions, typeFilter, categoryFilter, paymentModeFilter, searchTerm, sortBy]);

  // Group transactions by date string (YYYY-MM-DD)
  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(t => {
      const dateKey = (t.timestamp || '').split('T')[0] || 'Unknown';
      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateKey,
          items: [],
          totalCredit: 0,
          totalDebit: 0
        };
      }
      groups[dateKey].items.push(t);
      if (t.type === 'credit') {
        groups[dateKey].totalCredit += Number(t.amount || 0);
      } else {
        groups[dateKey].totalDebit += Number(t.amount || 0);
      }
    });
    return Object.values(groups);
  }, [filteredTransactions]);

  // Helper to find category metadata
  const getCatMeta = (catId, type) => {
    const pool = type === 'credit' ? CATEGORIES.credit : CATEGORIES.debit;
    return pool.find(c => c.id === catId || c.name === catId) || {
      id: catId,
      name: catId,
      icon: type === 'credit' ? 'ArrowUpRight' : 'ArrowDownRight',
      color: type === 'credit' ? '#10b981' : '#ef4444',
      bg: type === 'credit' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
    };
  };

  return (
    <div className="transactions-container glass-panel">
      {/* Top Filter and Search Bar */}
      <div className="transactions-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by description, tag, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>

        {/* Filter Badges & Selects */}
        <div className="toolbar-controls">
          <div className="type-filter-pills">
            <button
              className={`pill-btn ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              All
            </button>
            <button
              className={`pill-btn credit-pill ${typeFilter === 'credit' ? 'active' : ''}`}
              onClick={() => setTypeFilter('credit')}
            >
              <ArrowUpRight size={14} /> Credits
            </button>
            <button
              className={`pill-btn debit-pill ${typeFilter === 'debit' ? 'active' : ''}`}
              onClick={() => setTypeFilter('debit')}
            >
              <ArrowDownRight size={14} /> Debits
            </button>
          </div>

          <div className="dropdown-filters">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="toolbar-select"
            >
              <option value="all">All Categories</option>
              <optgroup label="Credit Categories">
                {CATEGORIES.credit.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </optgroup>
              <optgroup label="Debit Categories">
                {CATEGORIES.debit.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </optgroup>
            </select>

            <select
              value={paymentModeFilter}
              onChange={(e) => setPaymentModeFilter(e.target.value)}
              className="toolbar-select"
            >
              <option value="all">All Payment Modes</option>
              {PAYMENT_MODES.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.id}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="toolbar-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List Body */}
      <div className="transactions-body">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Inbox size={48} />
            </div>
            <h3>No Transactions Found</h3>
            <p>Try adjusting your search query, type filters, or record a new transaction.</p>
            <button className="btn-primary" onClick={onAddNew}>
              + Record Transaction
            </button>
          </div>
        ) : (
          <div className="grouped-list">
            {groupedTransactions.map(group => {
              const dayNet = group.totalCredit - group.totalDebit;
              return (
                <div key={group.dateKey} className="date-group-card">
                  {/* Date Header Header with summary */}
                  <div className="date-group-header">
                    <div className="date-group-title">
                      <Calendar size={15} />
                      <span className="date-primary">{formatDate(group.dateKey)}</span>
                      <span className="date-secondary">({formatFullDate(group.dateKey)})</span>
                    </div>

                    <div className="date-group-summary">
                      {group.totalCredit > 0 && (
                        <span className="group-chip credit-chip">
                          +{formatCurrency(group.totalCredit, currencySymbol)}
                        </span>
                      )}
                      {group.totalDebit > 0 && (
                        <span className="group-chip debit-chip">
                          -{formatCurrency(group.totalDebit, currencySymbol)}
                        </span>
                      )}
                      <span className={`group-chip net-chip ${dayNet >= 0 ? 'net-pos' : 'net-neg'}`}>
                        Net: {dayNet >= 0 ? '+' : ''}{formatCurrency(dayNet, currencySymbol)}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Rows */}
                  <div className="transaction-rows">
                    {group.items.map(tx => {
                      const meta = getCatMeta(tx.category, tx.type);
                      const isCredit = tx.type === 'credit';

                      return (
                        <div key={tx.id} className="transaction-row">
                          {/* Category Icon */}
                          <CategoryIcon
                            iconName={meta.icon}
                            color={meta.color}
                            bg={meta.bg}
                            size={18}
                          />

                          {/* Middle details */}
                          <div className="tx-details">
                            <div className="tx-header-line">
                              <span className="tx-description">{tx.description}</span>
                              <span className="tx-category-badge" style={{ color: meta.color, borderColor: `${meta.color}40` }}>
                                {meta.name}
                              </span>
                            </div>

                            <div className="tx-meta-line">
                              <span className="tx-time">{formatTime(tx.timestamp)}</span>
                              <span className="meta-separator">•</span>
                              <span className="tx-payment-mode">{tx.paymentMode}</span>
                              {tx.tags && tx.tags.length > 0 && (
                                <>
                                  <span className="meta-separator">•</span>
                                  <div className="tx-tags-list">
                                    {tx.tags.map(tag => (
                                      <span key={tag} className="tx-tag">#{tag}</span>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>

                            {tx.notes && (
                              <p className="tx-notes-preview">
                                {tx.notes}
                              </p>
                            )}
                          </div>

                          {/* Right Amount & Actions */}
                          <div className="tx-right-col">
                            <div className={`tx-amount ${isCredit ? 'amount-credit' : 'amount-debit'}`}>
                              {isCredit ? '+' : '-'}{formatCurrency(tx.amount, currencySymbol)}
                            </div>

                            <div className="tx-row-actions">
                              <button
                                className="action-btn edit-btn"
                                title="Edit Transaction"
                                onClick={() => onEdit(tx)}
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                className="action-btn dup-btn"
                                title="Duplicate Transaction"
                                onClick={() => onDuplicate(tx)}
                              >
                                <Copy size={15} />
                              </button>
                              <button
                                className="action-btn delete-btn"
                                title="Delete Transaction"
                                onClick={() => onDelete(tx.id)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
