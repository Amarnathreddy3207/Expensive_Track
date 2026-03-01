import axios from 'axios';

const API = axios.create({
    baseURL: '/api'
});

// Attach token to all requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Expenses
export const getExpenses = (params) => API.get('/expenses', { params });
export const addExpense = (data) => API.post('/expenses', data);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getExpenseSummary = (params) => API.get('/expenses/summary', { params });

// Budget
export const getBudget = (params) => API.get('/budget', { params });
export const saveBudget = (data) => API.post('/budget', data);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');

export default API;
