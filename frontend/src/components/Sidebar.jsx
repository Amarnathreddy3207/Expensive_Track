import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', emoji: '📊' },
    { path: '/expenses', label: 'Expenses', emoji: '💳' },
    { path: '/add-expense', label: 'Add Expense', emoji: '➕' },
    { path: '/budget', label: 'Budget', emoji: '🎯' },
    { path: '/analytics', label: 'Analytics', emoji: '📈' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <span style={{ fontSize: '1.2rem' }}>💰</span>
                </div>
                <div className="sidebar-logo-text">
                    Spend<span>Smart</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-title">Menu</div>
                {NAV_ITEMS.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    >
                        <span style={{ fontSize: '1rem' }}>{item.emoji}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-user">
                <div className="user-avatar">{initials}</div>
                <div className="user-info">
                    <div className="user-name">{user?.name}</div>
                    <div className="user-email">{user?.email}</div>
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Logout">
                    <span>🚪</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
