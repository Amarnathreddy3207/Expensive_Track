import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="loading-spinner" style={{ height: '100vh' }}>
                <div className="spinner" />
            </div>
        );
    }
    return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <AppLayout><Dashboard /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/expenses" element={
                        <ProtectedRoute>
                            <AppLayout><Expenses /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/add-expense" element={
                        <ProtectedRoute>
                            <AppLayout><AddExpense /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/budget" element={
                        <ProtectedRoute>
                            <AppLayout><Budget /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                        <ProtectedRoute>
                            <AppLayout><Analytics /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
