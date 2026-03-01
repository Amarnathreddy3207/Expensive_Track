// ==============================================
// IN-MEMORY DATA STORE (No MongoDB required)
// ==============================================
// This replaces MongoDB for demo/development mode.
// Data is stored in memory and resets on server restart.

const crypto = require('crypto');

const generateId = () => crypto.randomBytes(12).toString('hex');

// ---- In-memory collections ----
const store = {
    users: [],
    expenses: [],
    budgets: [],
};

// ---- User Methods ----
const UserStore = {
    findOne(query) {
        return store.users.find(u => {
            if (query.email) return u.email === query.email;
            if (query._id) return u._id === query._id;
            return false;
        }) || null;
    },

    findById(id) {
        const user = store.users.find(u => u._id === id);
        if (!user) return null;
        // Return without password by default
        const { password, ...safe } = user;
        return safe;
    },

    findByIdWithPassword(id) {
        return store.users.find(u => u._id === id) || null;
    },

    create({ name, email, password }) {
        const user = {
            _id: generateId(),
            name,
            email: email.toLowerCase(),
            password,
            currency: 'INR',
            avatar: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        store.users.push(user);
        const { password: _, ...safe } = user;
        return safe;
    },
};

// ---- Expense Methods ----
const ExpenseStore = {
    find(query = {}, options = {}) {
        let results = store.expenses.filter(e => {
            if (query.user && e.user !== query.user) return false;
            if (query.category && e.category !== query.category) return false;
            if (query.paymentMethod && e.paymentMethod !== query.paymentMethod) return false;
            if (query.title && query.title.$regex) {
                const re = new RegExp(query.title.$regex, query.title.$options || '');
                if (!re.test(e.title)) return false;
            }
            if (query.date) {
                if (query.date.$gte && new Date(e.date) < new Date(query.date.$gte)) return false;
                if (query.date.$lte && new Date(e.date) > new Date(query.date.$lte)) return false;
            }
            return true;
        });

        // Sort by date descending by default
        results.sort((a, b) => new Date(b.date) - new Date(a.date));

        const total = results.length;

        // Pagination
        if (options.skip) results = results.slice(options.skip);
        if (options.limit) results = results.slice(0, options.limit);

        return { data: results, total };
    },

    findOne(query) {
        return store.expenses.find(e => {
            if (query._id && query.user) return e._id === query._id && e.user === query.user;
            if (query._id) return e._id === query._id;
            return false;
        }) || null;
    },

    create(data) {
        const expense = {
            _id: generateId(),
            user: data.user,
            title: data.title,
            amount: parseFloat(data.amount),
            category: data.category || 'Other',
            paymentMethod: data.paymentMethod || 'UPI',
            date: data.date ? new Date(data.date) : new Date(),
            description: data.description || '',
            isRecurring: data.isRecurring || false,
            tags: data.tags || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        store.expenses.push(expense);
        return expense;
    },

    findByIdAndUpdate(id, data) {
        const idx = store.expenses.findIndex(e => e._id === id);
        if (idx === -1) return null;
        const allowed = ['title', 'amount', 'category', 'paymentMethod', 'date', 'description', 'isRecurring', 'tags'];
        for (const key of allowed) {
            if (data[key] !== undefined) {
                store.expenses[idx][key] = key === 'amount' ? parseFloat(data[key]) : data[key];
            }
        }
        store.expenses[idx].updatedAt = new Date();
        return store.expenses[idx];
    },

    deleteOne(id) {
        const idx = store.expenses.findIndex(e => e._id === id);
        if (idx === -1) return false;
        store.expenses.splice(idx, 1);
        return true;
    },

    aggregate(userId, startDate, endDate) {
        const filtered = store.expenses.filter(e => {
            if (e.user !== userId) return false;
            const d = new Date(e.date);
            if (startDate && d < new Date(startDate)) return false;
            if (endDate && d > new Date(endDate)) return false;
            return true;
        });

        const categoryMap = {};
        let total = 0;
        for (const e of filtered) {
            if (!categoryMap[e.category]) categoryMap[e.category] = { total: 0, count: 0 };
            categoryMap[e.category].total += e.amount;
            categoryMap[e.category].count += 1;
            total += e.amount;
        }

        const summary = Object.entries(categoryMap)
            .map(([name, data]) => ({ _id: name, total: data.total, count: data.count }))
            .sort((a, b) => b.total - a.total);

        return { summary, totalSpent: total, count: filtered.length };
    },

    monthlyTrend(userId, months = 6) {
        const now = new Date();
        const result = [];
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
            const monthTotal = store.expenses
                .filter(e => e.user === userId && new Date(e.date) >= d && new Date(e.date) <= endD)
                .reduce((sum, e) => sum + e.amount, 0);
            result.push({
                _id: { month: d.getMonth() + 1, year: d.getFullYear() },
                total: monthTotal
            });
        }
        return result.filter(m => m.total > 0);
    },

    recent(userId, limit = 5) {
        return store.expenses
            .filter(e => e.user === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    },
};

// ---- Budget Methods ----
const BudgetStore = {
    findOne(query) {
        return store.budgets.find(b => {
            if (query.user && b.user !== query.user) return false;
            if (query.month && b.month !== query.month) return false;
            if (query.year && b.year !== query.year) return false;
            if (query._id && b._id !== query._id) return false;
            return true;
        }) || null;
    },

    upsert(query, data) {
        let budget = this.findOne(query);
        if (budget) {
            budget.totalBudget = data.totalBudget;
            budget.categories = data.categories || [];
            budget.updatedAt = new Date();
            return budget;
        }
        budget = {
            _id: generateId(),
            user: query.user,
            month: query.month,
            year: query.year,
            totalBudget: data.totalBudget,
            categories: data.categories || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        store.budgets.push(budget);
        return budget;
    },

    deleteOne(id) {
        const idx = store.budgets.findIndex(b => b._id === id);
        if (idx === -1) return false;
        store.budgets.splice(idx, 1);
        return true;
    },
};

module.exports = { UserStore, ExpenseStore, BudgetStore, store };
