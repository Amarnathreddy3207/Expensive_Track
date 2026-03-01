import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExpense } from '../api';
import { CATEGORIES, PAYMENT_METHODS, CATEGORY_EMOJIS, PAYMENT_EMOJIS, autoDetectCategory } from '../utils/constants';

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

const AddExpense = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        title: '',
        amount: '',
        category: '',
        paymentMethod: 'UPI',
        date: today,
        description: '',
        isRecurring: false,
    });
    const [suggestedCategory, setSuggestedCategory] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setForm(f => ({ ...f, title }));
        if (title.length >= 3) {
            const detected = autoDetectCategory(title);
            setSuggestedCategory(detected);
            if (!form.category) {
                setForm(f => ({ ...f, title, category: detected }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.amount || parseFloat(form.amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (!form.category) {
            setError('Please select a category');
            return;
        }
        setLoading(true);
        try {
            await addExpense({ ...form, amount: parseFloat(form.amount) });
            setSuccess('Expense added successfully! 🎉');
            setTimeout(() => navigate('/expenses'), 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1 className="page-title">Add Expense ➕</h1>
                <p className="page-subtitle">Record a new transaction</p>
            </div>

            <div style={{ maxWidth: 640 }}>
                <div className="card">
                    {error && <div className="error-msg">{error}</div>}
                    {success && <div className="success-msg">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="exp-title">Expense Title *</label>
                            <input
                                id="exp-title"
                                type="text"
                                className="form-input"
                                placeholder="e.g. Zomato order, Uber ride, Netflix..."
                                value={form.title}
                                onChange={handleTitleChange}
                                required
                            />
                            {suggestedCategory && (
                                <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                                    🤖 Auto-detected: <strong>{CATEGORY_EMOJIS[suggestedCategory]} {suggestedCategory}</strong>
                                </div>
                            )}
                        </div>

                        {/* Amount */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="exp-amount">Amount (₹) *</label>
                            <input
                                id="exp-amount"
                                type="number"
                                className="form-input"
                                placeholder="0"
                                min="0.01"
                                step="0.01"
                                value={form.amount}
                                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                required
                            />
                            {/* Quick amount buttons */}
                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                                {QUICK_AMOUNTS.map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setForm(f => ({ ...f, amount: amt }))}
                                    >
                                        ₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category & Payment */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="exp-category">Category *</label>
                                <select
                                    id="exp-category"
                                    className="form-select"
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="exp-payment">Payment Method</label>
                                <select
                                    id="exp-payment"
                                    className="form-select"
                                    value={form.paymentMethod}
                                    onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                                >
                                    {PAYMENT_METHODS.map(m => (
                                        <option key={m} value={m}>{PAYMENT_EMOJIS[m]} {m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date & Recurring */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="exp-date">Date *</label>
                                <input
                                    id="exp-date"
                                    type="date"
                                    className="form-input"
                                    value={form.date}
                                    max={today}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Recurring Expense?</label>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 16px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    transition: 'var(--transition)',
                                    marginTop: '2px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={form.isRecurring}
                                        onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked }))}
                                        style={{ accentColor: 'var(--accent-primary)', width: 16, height: 16 }}
                                    />
                                    🔄 Monthly recurring
                                </label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="exp-desc">Note (optional)</label>
                            <textarea
                                id="exp-desc"
                                className="form-textarea"
                                placeholder="Add any note or description..."
                                rows={2}
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: 'var(--gap-md)', marginTop: 'var(--gap-md)' }}>
                            <button
                                id="submit-expense"
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Saving...' : '✅ Save Expense'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/expenses')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;
