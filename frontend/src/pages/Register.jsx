import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div style={{ fontSize: '2rem' }}>💰</div>
                </div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Start tracking your expenses today</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-name">Full Name</label>
                        <input
                            id="reg-name"
                            type="text"
                            className="form-input"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-email">Email Address</label>
                        <input
                            id="reg-email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="reg-password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="reg-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Min 6 characters"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="reg-confirm"
                                    type={showConfirm ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Repeat password"
                                    value={form.confirm}
                                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    title={showConfirm ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirm ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        id="register-submit"
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                        style={{ marginTop: '8px' }}
                    >
                        {loading ? 'Creating account...' : '🚀 Get Started'}
                    </button>
                </form>

                <div className="divider" style={{ margin: '24px 0' }} />
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
