import { useEffect, useState } from 'react';
import { getExpenseSummary } from '../api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency, CATEGORY_COLORS, CATEGORY_EMOJIS, MONTH_NAMES } from '../utils/constants';

const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: MONTH_NAMES[i] }));
const now = new Date();

const Analytics = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    useEffect(() => {
        setLoading(true);
        getExpenseSummary({ month: selectedMonth, year: selectedYear })
            .then(res => setSummary(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedMonth, selectedYear]);

    const pieData = (summary?.summary || []).map(item => ({
        name: item._id,
        value: item.total,
        count: item.count,
        color: CATEGORY_COLORS[item._id] || '#6b7280'
    }));

    const barData = [...pieData].sort((a, b) => b.value - a.value);

    const years = [now.getFullYear() - 1, now.getFullYear()];

    return (
        <div className="animate-in">
            <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="page-title">Analytics 📈</h1>
                    <p className="page-subtitle">Deep dive into your spending patterns</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(parseInt(e.target.value))}
                        style={{ width: 'auto' }}
                    >
                        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <select
                        className="form-select"
                        value={selectedYear}
                        onChange={e => setSelectedYear(parseInt(e.target.value))}
                        style={{ width: 'auto' }}
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* Total Summary Card */}
            {summary && (
                <div className="stat-card" style={{ marginBottom: 'var(--gap-xl)', background: 'linear-gradient(135deg, #1e3a5f, #2a4a6b)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                                Total Spent — {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
                                {formatCurrency(summary.totalSpent)}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                                across {pieData.reduce((s, d) => s + d.count, 0)} transactions
                            </div>
                        </div>
                        <div style={{ fontSize: '3rem', opacity: 0.4 }}>📊</div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : pieData.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📊</div>
                    <h3>No data for this period</h3>
                    <p>Select a different month or add expenses to see analytics</p>
                </div>
            ) : (
                <>
                    {/* Bar Chart */}
                    <div className="card" style={{ marginBottom: 'var(--gap-lg)' }}>
                        <div className="card-title" style={{ marginBottom: 'var(--gap-md)' }}>📊 Spending by Category</div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(value), 'Amount']}
                                        contentStyle={{ background: '#1a2332', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.85rem' }}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {barData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Breakdown Table */}
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 'var(--gap-md)' }}>🗂️ Category Breakdown</div>
                        {pieData.map((item, i) => {
                            const pct = summary?.totalSpent > 0 ? (item.value / summary.totalSpent) * 100 : 0;
                            return (
                                <div key={i} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1rem' }}>{CATEGORY_EMOJIS[item.name]}</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.count} txns</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: item.color }}>
                                                {formatCurrency(item.value)}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                                                {pct.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="progress-bar-wrap">
                                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: item.color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;
