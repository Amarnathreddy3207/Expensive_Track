import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';

const Landing = () => {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState({});
    const observerRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.15 }
        );

        observerRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const addRef = (el) => {
        if (el && !observerRefs.current.includes(el)) {
            observerRefs.current.push(el);
        }
    };

    const features = [
        {
            icon: '📊',
            title: 'Smart Dashboard',
            desc: 'Get a real-time overview of your spending with beautiful charts and insights that help you understand your money flow.',
            color: '#0ea5e9'
        },
        {
            icon: '🏷️',
            title: 'Auto Categorization',
            desc: 'Expenses are automatically categorized using smart detection — just type the title and we handle the rest.',
            color: '#8b5cf6'
        },
        {
            icon: '💰',
            title: 'Budget Tracking',
            desc: 'Set monthly budgets by category and get real-time alerts when you\'re approaching your spending limits.',
            color: '#10b981'
        },
        {
            icon: '📈',
            title: 'Analytics & Trends',
            desc: 'Discover spending patterns with trend analysis, category breakdowns, and month-over-month comparisons.',
            color: '#f59e0b'
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            desc: 'Your financial data is encrypted and protected with JWT authentication. Your money info stays yours.',
            color: '#ef4444'
        },
        {
            icon: '📱',
            title: 'Fully Responsive',
            desc: 'Track expenses anywhere — works beautifully on desktop, tablet, and mobile devices.',
            color: '#ec4899'
        }
    ];

    const stats = [
        { value: '10+', label: 'Expense Categories' },
        { value: '5+', label: 'Payment Methods' },
        { value: '∞', label: 'Transactions' },
        { value: '100%', label: 'Free Forever' }
    ];

    return (
        <div className="landing-page">
            {/* Floating particles background */}
            <div className="landing-particles">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${6 + Math.random() * 8}s`,
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <Link to="/" className="landing-brand">
                        <div className="landing-brand-icon">💰</div>
                        <span className="landing-brand-text">
                            Spend<span>Smart</span>
                        </span>
                    </Link>
                    <div className="landing-nav-links">
                        <a href="#features" className="landing-nav-link">Features</a>
                        <a href="#how-it-works" className="landing-nav-link">How it Works</a>
                        <Link to="/login" className="landing-nav-link">Sign In</Link>
                        <Link to="/login" className="btn btn-primary landing-cta-btn">
                            Login / Sign In →
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="landing-hero">
                <div className="landing-hero-glow" />
                <div className="landing-hero-content">
                    <div className="landing-hero-badge">
                        <span className="landing-badge-dot" />
                        Smart Personal Finance Tracker
                    </div>
                    <h1 className="landing-hero-title">
                        Take Control of Your
                        <span className="landing-gradient-text"> Money </span>
                        with Ease
                    </h1>
                    <p className="landing-hero-desc">
                        Track every rupee, set budgets, and visualize your spending habits
                        with beautiful dashboards. SpendSmart makes personal finance simple,
                        smart, and free.
                    </p>
                    <div className="landing-hero-actions">
                        <Link to="/register" className="btn btn-primary btn-lg landing-hero-btn">
                            <span>🚀</span> Start Tracking Free
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg landing-hero-btn-secondary">
                            <span>✨</span> Explore Features
                        </a>
                    </div>
                    <div className="landing-hero-trust">
                        <div className="landing-trust-avatars">
                            {['🧑‍💼', '👩‍💻', '🧑‍🎓', '👨‍🔬'].map((emoji, i) => (
                                <div key={i} className="landing-trust-avatar" style={{ zIndex: 4 - i }}>
                                    {emoji}
                                </div>
                            ))}
                        </div>
                        <span className="landing-trust-text">
                            Trusted by smart spenders everywhere
                        </span>
                    </div>
                </div>

                {/* Hero Visual / Preview Card */}
                <div className="landing-hero-visual">
                    <div className="landing-preview-card">
                        <div className="landing-preview-header">
                            <div className="landing-preview-dots">
                                <span style={{ background: '#ef4444' }} />
                                <span style={{ background: '#f59e0b' }} />
                                <span style={{ background: '#10b981' }} />
                            </div>
                            <span className="landing-preview-title">SpendSmart Dashboard</span>
                        </div>
                        <div className="landing-preview-body">
                            <div className="landing-preview-stats">
                                <div className="landing-mini-stat">
                                    <div className="landing-mini-stat-label">This Month</div>
                                    <div className="landing-mini-stat-value" style={{ color: '#ef4444' }}>₹24,500</div>
                                </div>
                                <div className="landing-mini-stat">
                                    <div className="landing-mini-stat-label">Budget Left</div>
                                    <div className="landing-mini-stat-value" style={{ color: '#10b981' }}>₹15,500</div>
                                </div>
                                <div className="landing-mini-stat">
                                    <div className="landing-mini-stat-label">Saved</div>
                                    <div className="landing-mini-stat-value" style={{ color: '#0ea5e9' }}>₹8,200</div>
                                </div>
                            </div>
                            <div className="landing-preview-chart">
                                <div className="landing-chart-bars">
                                    {[65, 40, 85, 55, 70, 45, 90].map((h, i) => (
                                        <div key={i} className="landing-chart-bar-wrap">
                                            <div
                                                className="landing-chart-bar"
                                                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                                            />
                                            <span className="landing-chart-day">
                                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="landing-preview-transactions">
                                {[
                                    { emoji: '🍽️', name: 'Zomato Order', amt: '₹450', cat: 'Food' },
                                    { emoji: '🚗', name: 'Uber Ride', amt: '₹230', cat: 'Transport' },
                                    { emoji: '📱', name: 'Netflix', amt: '₹649', cat: 'Subscription' }
                                ].map((tx, i) => (
                                    <div key={i} className="landing-preview-tx">
                                        <div className="landing-tx-icon">{tx.emoji}</div>
                                        <div className="landing-tx-info">
                                            <div className="landing-tx-name">{tx.name}</div>
                                            <div className="landing-tx-cat">{tx.cat}</div>
                                        </div>
                                        <div className="landing-tx-amt">{tx.amt}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="landing-stats-strip">
                {stats.map((stat, i) => (
                    <div key={i} className="landing-stat-item">
                        <div className="landing-stat-value">{stat.value}</div>
                        <div className="landing-stat-label">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* Features Section */}
            <section className="landing-section" id="features">
                <div
                    id="features-header"
                    ref={addRef}
                    className={`landing-section-header ${isVisible['features-header'] ? 'visible' : ''}`}
                >
                    <div className="landing-section-badge">✨ Features</div>
                    <h2 className="landing-section-title">
                        Everything You Need to
                        <span className="landing-gradient-text"> Master </span>
                        Your Finances
                    </h2>
                    <p className="landing-section-desc">
                        Powerful tools designed to make expense tracking effortless and insightful.
                    </p>
                </div>
                <div className="landing-features-grid">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            id={`feature-${i}`}
                            ref={addRef}
                            className={`landing-feature-card ${isVisible[`feature-${i}`] ? 'visible' : ''}`}
                            style={{ transitionDelay: `${i * 0.1}s` }}
                        >
                            <div
                                className="landing-feature-icon"
                                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                            >
                                {f.icon}
                            </div>
                            <h3 className="landing-feature-title">{f.title}</h3>
                            <p className="landing-feature-desc">{f.desc}</p>
                            <div className="landing-feature-glow" style={{ background: f.color }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section className="landing-section" id="how-it-works">
                <div
                    id="how-header"
                    ref={addRef}
                    className={`landing-section-header ${isVisible['how-header'] ? 'visible' : ''}`}
                >
                    <div className="landing-section-badge">🚀 How it Works</div>
                    <h2 className="landing-section-title">
                        Get Started in
                        <span className="landing-gradient-text"> 3 Simple </span>
                        Steps
                    </h2>
                </div>
                <div className="landing-steps">
                    {[
                        {
                            step: '01',
                            icon: '📝',
                            title: 'Create Your Account',
                            desc: 'Sign up for free in under 30 seconds. No credit card required, no hidden charges.'
                        },
                        {
                            step: '02',
                            icon: '💸',
                            title: 'Add Your Expenses',
                            desc: 'Log your daily spending with our easy form. Auto-categorization does the heavy lifting.'
                        },
                        {
                            step: '03',
                            icon: '📊',
                            title: 'Track & Optimize',
                            desc: 'View beautiful dashboards, set budgets, and discover where your money really goes.'
                        }
                    ].map((s, i) => (
                        <div
                            key={i}
                            id={`step-${i}`}
                            ref={addRef}
                            className={`landing-step-card ${isVisible[`step-${i}`] ? 'visible' : ''}`}
                            style={{ transitionDelay: `${i * 0.15}s` }}
                        >
                            <div className="landing-step-number">{s.step}</div>
                            <div className="landing-step-icon">{s.icon}</div>
                            <h3 className="landing-step-title">{s.title}</h3>
                            <p className="landing-step-desc">{s.desc}</p>
                            {i < 2 && <div className="landing-step-connector" />}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section
                className="landing-cta-section"
                id="cta-section"
                ref={addRef}
            >
                <div className={`landing-cta-content ${isVisible['cta-section'] ? 'visible' : ''}`}>
                    <div className="landing-cta-glow" />
                    <h2 className="landing-cta-title">
                        Ready to Take Control of Your Finances?
                    </h2>
                    <p className="landing-cta-desc">
                        Join SpendSmart today and start your journey to smarter spending.
                        It's completely free — no credit card, no trials, no limits.
                    </p>
                    <Link to="/register" className="btn btn-primary btn-lg landing-cta-main-btn">
                        🚀 Create Free Account
                    </Link>
                    <p className="landing-cta-note">
                        Free forever • No credit card required • Setup in 30 seconds
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-brand">
                        <div className="landing-brand">
                            <div className="landing-brand-icon">💰</div>
                            <span className="landing-brand-text">
                                Spend<span>Smart</span>
                            </span>
                        </div>
                        <p className="landing-footer-tagline">
                            Smart personal expense tracking for everyone.
                        </p>
                    </div>
                    <div className="landing-footer-links">
                        <div className="landing-footer-col">
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <a href="#how-it-works">How it Works</a>
                        </div>
                        <div className="landing-footer-col">
                            <h4>Account</h4>
                            <Link to="/login">Sign In</Link>
                            <Link to="/register">Create Account</Link>
                        </div>
                    </div>
                </div>
                <div className="landing-footer-bottom">
                    <p>&copy; {new Date().getFullYear()} SpendSmart. Built with ❤️ for smart spenders.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
