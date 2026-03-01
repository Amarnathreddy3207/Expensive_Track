import { useEffect, useState } from 'react';
import { getBudget, saveBudget } from '../api';
import { CATEGORIES, CATEGORY_EMOJIS, formatCurrency } from '../utils/constants';

const DEFAULT_CATEGORY_BUDGETS = CATEGORIES.slice(0, 6).map(name => ({ name, limit: 0 }));

const Budget = () => {
    const now = new Date();
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [totalBudget, setTotalBudget] = useState('');
    const [categories, setCategories] = useState(DEFAULT_CATEGORY_BUDGETS);

    useEffect(() => {
        getBudget({ month: now.getMonth() + 1, year: now.getFullYear() })
            .then(res => {
                setBudget(res.data);
                setTotalBudget(res.data.totalBudget);
                setCategories(res.data.categories?.length ? res.data.categories : DEFAULT_CATEGORY_BUDGETS);
            })
            .catch(() => {
                setCategories(DEFAULT_CATEGORY_BUDGETS);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleCategoryLimit = (name, limit) => {
        setCategories(prev =>
            prev.map(c => c.name === name ? { ...c, limit: parseFloat(limit) || 0 } : c)
        );
    };

    const addCategory = (name) => {
        if (categories.find(c => c.name === name)) return;
        setCategories(prev => [...prev, { name, limit: 0 }]);
    };

    const removeCategory = (name) => {
        setCategories(prev => prev.filter(c => c.name !== name));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const res = await saveBudget({
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                totalBudget: parseFloat(totalBudget) || 0,
                categories: categories.filter(c => c.limit > 0)
            });
            setBudget(res.data);
            setSuccess('Budget saved successfully! 🎯');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save budget');
        } finally {
            setSaving(false);
        }
    };

    const categorySum = categories.reduce((sum, c) => sum + (c.limit || 0), 0);
    const remaining = parseFloat(totalBudget || 0) - categorySum;

    const availableToAdd = CATEGORIES.filter(c => !categories.find(cat => cat.name === c));

    if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1 className="page-title">Budget 🎯</h1>
                <p className="page-subtitle">
                    {now.toLocaleString('en-IN', { month: 'long', year: 'numeric' })} — Set your spending limits
                </p>
            </div>

            <div style={{ maxWidth: 700 }}>
                {success && <div className="success-msg">{success}</div>}
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSave}>
                    {/* Total Budget */}
                    <div className="card" style={{ marginBottom: 'var(--gap-lg)' }}>
                        <div className="card-title" style={{ marginBottom: 'var(--gap-md)' }}>💰 Total Monthly Budget</div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                                id="total-budget"
                                type="number"
                                className="form-input"
                                placeholder="e.g. 30000"
                                value={totalBudget}
                                min="0"
                                step="100"
                                onChange={e => setTotalBudget(e.target.value)}
                                style={{ fontSize: '1.25rem', fontWeight: 700 }}
                            />
                            {totalBudget && (
                                <div style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    = {formatCurrency(parseFloat(totalBudget))} per month
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category Budgets */}
                    <div className="card" style={{ marginBottom: 'var(--gap-lg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--gap-md)' }}>
                            <div className="card-title">🗂️ Category Budgets</div>
                            {remaining !== 0 && totalBudget && (
                                <span style={{ fontSize: '0.8rem', color: remaining < 0 ? 'var(--danger)' : 'var(--success)' }}>
                                    {remaining < 0 ? '⚠️ Over by ' : '✅ Unallocated: '}
                                    {formatCurrency(Math.abs(remaining))}
                                </span>
                            )}
                        </div>

                        {categories.map(cat => (
                            <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-glass)', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
                                    border: '1px solid var(--border-color)'
                                }}>
                                    {CATEGORY_EMOJIS[cat.name]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>
                                        {cat.name}
                                    </div>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="0"
                                        value={cat.limit || ''}
                                        min="0"
                                        step="100"
                                        onChange={e => handleCategoryLimit(cat.name, e.target.value)}
                                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                    />
                                    {/* Progress if budget exists */}
                                    {budget && cat.limit > 0 && (() => {
                                        const spent = budget.categories?.find(c => c.name === cat.name)?.spent || 0;
                                        const pct = (spent / cat.limit) * 100;
                                        return (
                                            <div style={{ marginTop: '4px' }}>
                                                <div className="progress-bar-wrap" style={{ height: 4 }}>
                                                    <div className="progress-bar-fill" style={{
                                                        width: `${Math.min(100, pct)}%`,
                                                        background: pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#0ea5e9'
                                                    }} />
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    Spent: {formatCurrency(spent)} / {formatCurrency(cat.limit)} ({Math.round(pct)}%)
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => removeCategory(cat.name)}
                                    style={{ color: 'var(--danger)', flexShrink: 0 }}
                                >✕</button>
                            </div>
                        ))}

                        {/* Add More Categories */}
                        {availableToAdd.length > 0 && (
                            <div style={{ marginTop: 'var(--gap-md)', paddingTop: 'var(--gap-md)', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>+ Add more categories:</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {availableToAdd.map(c => (
                                        <button key={c} type="button" className="btn btn-secondary btn-sm" onClick={() => addCategory(c)}>
                                            {CATEGORY_EMOJIS[c]} {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        id="save-budget"
                        type="submit"
                        className="btn btn-primary btn-lg btn-full"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : '💾 Save Budget'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Budget;
