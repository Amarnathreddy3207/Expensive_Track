import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api';
import { formatCurrency, CATEGORY_COLORS, CATEGORY_EMOJIS, PAYMENT_EMOJIS, CATEGORIES, PAYMENT_METHODS, formatDate } from '../utils/constants';
import { Link } from 'react-router-dom';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', category: '', paymentMethod: '' });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [deleting, setDeleting] = useState(null);

    const fetchExpenses = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: 20, ...filters };
            Object.keys(params).forEach(k => !params[k] && delete params[k]);
            const res = await getExpenses(params);
            setExpenses(res.data.expenses);
            setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses(1);
    }, [filters]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        setDeleting(id);
        try {
            await deleteExpense(id);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch (err) {
            alert('Failed to delete expense');
        } finally {
            setDeleting(null);
        }
    };

    const totalShowing = expenses.reduce((acc, e) => acc + e.amount, 0);

    return (
        <div className="animate-in">
            <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="page-title">Expenses 💳</h1>
                    <p className="page-subtitle">{pagination.total} total transactions</p>
                </div>
                <Link to="/add-expense" className="btn btn-primary">➕ Add Expense</Link>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--gap-lg)' }}>
                <div className="filter-bar" style={{ margin: 0 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search expenses..."
                            value={filters.search}
                            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                        />
                    </div>
                    <div style={{ minWidth: 160 }}>
                        <select
                            className="form-select"
                            value={filters.category}
                            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
                        </select>
                    </div>
                    <div style={{ minWidth: 150 }}>
                        <select
                            className="form-select"
                            value={filters.paymentMethod}
                            onChange={e => setFilters(f => ({ ...f, paymentMethod: e.target.value }))}
                        >
                            <option value="">All Methods</option>
                            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{PAYMENT_EMOJIS[m]} {m}</option>)}
                        </select>
                    </div>
                    {(filters.search || filters.category || filters.paymentMethod) && (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setFilters({ search: '', category: '', paymentMethod: '' })}
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Summary bar */}
            {expenses.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Showing {expenses.length} of {pagination.total} • Total:{' '}
                        <strong style={{ color: 'var(--danger)' }}>{formatCurrency(totalShowing)}</strong>
                    </span>
                </div>
            )}

            {/* Expenses List */}
            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : expenses.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">💳</div>
                    <h3>No expenses found</h3>
                    <p>{filters.search || filters.category ? 'Try adjusting your filters' : 'Add your first expense to get started'}</p>
                    <Link to="/add-expense" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Add Expense</Link>
                </div>
            ) : (
                <div>
                    {expenses.map(exp => (
                        <div className="expense-item" key={exp._id}>
                            <div className="expense-icon" style={{
                                background: `${CATEGORY_COLORS[exp.category]}22`,
                                color: CATEGORY_COLORS[exp.category] || '#6b7280'
                            }}>
                                {CATEGORY_EMOJIS[exp.category] || '📌'}
                            </div>
                            <div className="expense-info">
                                <div className="expense-title">{exp.title}</div>
                                <div className="expense-meta">
                                    <span className="expense-category">{exp.category}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>•</span>
                                    <span className="expense-date">{formatDate(exp.date)}</span>
                                    <span className="payment-badge">{PAYMENT_EMOJIS[exp.paymentMethod]} {exp.paymentMethod}</span>
                                    {exp.isRecurring && <span className="badge" style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontSize: '0.65rem' }}>🔄 Recurring</span>}
                                </div>
                            </div>
                            <div className="expense-amount">-{formatCurrency(exp.amount)}</div>
                            <div className="expense-actions">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    title="Delete"
                                    onClick={() => handleDelete(exp._id)}
                                    disabled={deleting === exp._id}
                                    style={{ color: 'var(--danger)' }}
                                >
                                    {deleting === exp._id ? '...' : '🗑️'}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                            <button
                                className="btn btn-secondary btn-sm"
                                disabled={pagination.page <= 1}
                                onClick={() => fetchExpenses(pagination.page - 1)}
                            >← Prev</button>
                            <span style={{ padding: '6px 12px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {pagination.page} / {pagination.pages}
                            </span>
                            <button
                                className="btn btn-secondary btn-sm"
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => fetchExpenses(pagination.page + 1)}
                            >Next →</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Expenses;
