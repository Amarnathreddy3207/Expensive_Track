import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency, CATEGORY_COLORS, CATEGORY_EMOJIS, PAYMENT_EMOJIS, MONTH_NAMES, formatDate } from '../utils/constants';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then(res => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="loading-spinner"><div className="spinner" /></div>
    );

    const {
        thisMonthTotal = 0,
        thisMonthCount = 0,
        categoryBreakdown = [],
        monthlyTrend = [],
        recentExpenses = [],
        budget,
        alerts = []
    } = stats || {};

    const budgetUsed = budget ? (thisMonthTotal / budget.totalBudget) * 100 : 0;
    const budgetLeft = budget ? Math.max(0, budget.totalBudget - thisMonthTotal) : null;

    const trendData = monthlyTrend.map(m => ({
        name: MONTH_NAMES[m._id.month - 1],
        amount: m.total
    }));

    const pieData = categoryBreakdown.slice(0, 6).map(item => ({
        name: item._id,
        value: item.total,
        color: CATEGORY_COLORS[item._id] || '#6b7280'
    }));

    const now = new Date();
    const monthName = MONTH_NAMES[now.getMonth()];

    return (
        <div className="animate-in">
            {/* Alerts */}
            {alerts.length > 0 && (
                <div className="alerts-container">
                    {alerts.map((alert, i) => (
                        <div key={i} className={`alert alert-${alert.level}`}>
                            <span style={{ fontSize: '1.2rem' }}>
                                {alert.level === 'danger' ? '🚨' : '⚠️'}
                            </span>
                            <div className="alert-text">
                                <strong>{alert.category}</strong>: Spent{' '}
                                {formatCurrency(alert.spent)} of {formatCurrency(alert.limit)}{' '}
                                ({alert.percentage}%)
                            </div>
                            <Link to="/budget" className="btn btn-sm btn-secondary">View Budget</Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="page-title">Dashboard 📊</h1>
                    <p className="page-subtitle">{monthName} {now.getFullYear()} — Your financial overview</p>
                </div>
                <Link to="/add-expense" className="btn btn-primary">
                    ➕ Add Expense
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>💸</div>
                    <div className="stat-value">{formatCurrency(thisMonthTotal)}</div>
                    <div className="stat-label">Spent This Month</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(14,165,233,0.15)', color: '#0ea5e9' }}>🧾</div>
                    <div className="stat-value">{thisMonthCount}</div>
                    <div className="stat-label">Transactions</div>
                </div>
                {budget && (
                    <>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>🎯</div>
                            <div className="stat-value">{formatCurrency(budget.totalBudget)}</div>
                            <div className="stat-label">Monthly Budget</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{
                                background: budgetLeft <= 0 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                color: budgetLeft <= 0 ? '#ef4444' : '#f59e0b'
                            }}>💰</div>
                            <div className="stat-value" style={{ color: budgetLeft <= 0 ? 'var(--danger)' : undefined }}>
                                {formatCurrency(budgetLeft)}
                            </div>
                            <div className="stat-label">Budget Remaining</div>
                        </div>
                    </>
                )}
                {!budget && (
                    <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '8px 0' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎯</div>
                            <p style={{ fontSize: '0.875rem', marginBottom: '12px' }}>No budget set for this month</p>
                            <Link to="/budget" className="btn btn-secondary btn-sm">Set Budget</Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Budget Progress */}
            {budget && (
                <div className="card" style={{ marginBottom: 'var(--gap-xl)' }}>
                    <div className="card-header">
                        <div className="card-title">🎯 Budget Progress</div>
                        <span style={{ fontSize: '0.85rem', color: Math.round(budgetUsed) >= 100 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                            {Math.round(budgetUsed)}% used
                        </span>
                    </div>
                    <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{
                            width: `${Math.min(100, budgetUsed)}%`,
                            background: budgetUsed >= 100 ? '#ef4444' : budgetUsed >= 80 ? '#f59e0b' : 'linear-gradient(90deg, #0ea5e9, #14b8a6)'
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Spent: {formatCurrency(thisMonthTotal)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Budget: {formatCurrency(budget.totalBudget)}
                        </span>
                    </div>
                </div>
            )}

            {/* Charts Row */}
            <div className="grid-2" style={{ marginBottom: 'var(--gap-xl)' }}>
                {/* Spending by Category */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">🥧 Spending by Category</div>
                    </div>
                    {pieData.length > 0 ? (
                        <>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => formatCurrency(value)}
                                            contentStyle={{ background: '#0f1525', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                {pieData.map((d, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">🥧</div>
                            <h3>No expenses yet</h3>
                            <p>Add your first expense to see the breakdown</p>
                        </div>
                    )}
                </div>

                {/* Monthly Trend */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">📈 Monthly Trend</div>
                    </div>
                    {trendData.length > 0 ? (
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#475569" tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(value), 'Spent']}
                                        contentStyle={{ background: '#0f1525', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1f5f9' }}
                                    />
                                    <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📈</div>
                            <h3>Not enough data</h3>
                            <p>Track expenses for multiple months to see trends</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">⏱️ Recent Transactions</div>
                    <Link to="/expenses" className="btn btn-ghost btn-sm">View All →</Link>
                </div>
                {recentExpenses.length > 0 ? (
                    <div>
                        {recentExpenses.map(exp => (
                            <div className="expense-item" key={exp._id}>
                                <div className="expense-icon" style={{
                                    background: `${CATEGORY_COLORS[exp.category]}22`,
                                    color: CATEGORY_COLORS[exp.category]
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
                                    </div>
                                </div>
                                <div className="expense-amount">-{formatCurrency(exp.amount)}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">💳</div>
                        <h3>No transactions yet</h3>
                        <p>Start by adding your first expense</p>
                        <Link to="/add-expense" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Add Expense</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
