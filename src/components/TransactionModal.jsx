import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Calendar, Tag, CreditCard, FileText, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, PAYMENT_MODES } from '../constants/initialData';
import confetti from 'canvas-confetti';

export const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  currencySymbol = '₹'
}) => {
  const [type, setType] = useState('debit');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [timestamp, setTimestamp] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'debit');
      setAmount(String(initialData.amount || ''));
      setCategory(initialData.category || '');
      setDescription(initialData.description || '');
      setPaymentMode(initialData.paymentMode || 'UPI');
      setTimestamp(initialData.timestamp ? initialData.timestamp.slice(0, 16) : '');
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setNotes(initialData.notes || '');
    } else {
      // Default to current local date/time string for input type="datetime-local"
      const now = new Date();
      const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setType('debit');
      setAmount('');
      setCategory(CATEGORIES.debit[0].id);
      setDescription('');
      setPaymentMode('UPI');
      setTimestamp(localISO);
      setTagsInput('');
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen]);

  // Adjust default category when type switches
  const handleTypeChange = (newType) => {
    setType(newType);
    if (!initialData) {
      setCategory(CATEGORIES[newType][0].id);
    }
  };

  const handleQuickAddAmount = (addValue) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + addValue));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description or title');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const transaction = {
      id: initialData?.id || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      amount: parsedAmount,
      category: category || (CATEGORIES[type][0].id),
      description: description.trim(),
      paymentMode,
      timestamp: timestamp || new Date().toISOString(),
      tags: tagsArray,
      notes: notes.trim()
    };

    if (type === 'credit') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }

    onSave(transaction);
    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = CATEGORIES[type] || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {initialData ? 'Edit Transaction' : 'Record New Transaction'}
            </h2>
            <p className="modal-subtitle">
              Keep your ledger balanced with daily credit & debit logs
            </p>
          </div>
          <button className="icon-btn-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Credit / Debit Tab Switcher */}
        <div className="type-toggle-container">
          <button
            type="button"
            className={`type-toggle-btn credit-btn ${type === 'credit' ? 'selected' : ''}`}
            onClick={() => handleTypeChange('credit')}
          >
            <ArrowUpRight size={18} />
            <span>Credit (+ Money In)</span>
          </button>

          <button
            type="button"
            className={`type-toggle-btn debit-btn ${type === 'debit' ? 'selected' : ''}`}
            onClick={() => handleTypeChange('debit')}
          >
            <ArrowDownRight size={18} />
            <span>Debit (- Money Out)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-alert">{error}</div>}

          {/* Amount input with large display */}
          <div className="amount-input-container">
            <label className="field-label">Transaction Amount</label>
            <div className="amount-input-box">
              <span className="currency-prefix">{currencySymbol}</span>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="amount-input"
                autoFocus
                required
              />
            </div>
            {/* Quick Add Chips */}
            <div className="quick-amount-chips">
              <span>Quick Add:</span>
              {[500, 1000, 2500, 5000, 10000, 25000].map((val) => (
                <button
                  key={val}
                  type="button"
                  className="quick-chip"
                  onClick={() => handleQuickAddAmount(val)}
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="field-label">
              <FileText size={14} /> Description / Title
            </label>
            <input
              type="text"
              placeholder={type === 'credit' ? 'e.g., Monthly Salary, Freelance milestone, Bank interest' : 'e.g., Keells Groceries, Lunch at Cafe, Ceypetco Fuel, Rent'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-input"
              required
            />
          </div>

          {/* Category Select */}
          <div className="form-group">
            <label className="field-label">Category</label>
            <div className="category-select-grid">
              {currentCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-select-card ${isSelected ? 'selected' : ''}`}
                    style={{
                      borderColor: isSelected ? cat.color : 'transparent',
                      background: isSelected ? `${cat.color}25` : undefined
                    }}
                    onClick={() => setCategory(cat.id)}
                  >
                    <span
                      className="category-circle"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="category-select-name">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time and Payment Mode row */}
          <div className="form-row">
            <div className="form-group half-width">
              <label className="field-label">
                <Calendar size={14} /> Date & Time
              </label>
              <input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="text-input"
                required
              />
            </div>

            <div className="form-group half-width">
              <label className="field-label">
                <CreditCard size={14} /> Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="select-input"
              >
                {PAYMENT_MODES.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="field-label">
              <Tag size={14} /> Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. personal, business, urgent, office"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="text-input"
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="field-label">Additional Notes & Reference (Optional)</label>
            <textarea
              rows="2"
              placeholder="Receipt details, split notes, transaction ID..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea-input"
            />
          </div>

          {/* Submit Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-primary ${type === 'credit' ? 'btn-credit-glow' : 'btn-debit-glow'}`}
            >
              <CheckCircle2 size={18} />
              <span>{initialData ? 'Update Entry' : `Save ${type === 'credit' ? 'Credit' : 'Debit'}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
