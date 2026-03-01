const Expense = require('../models/Expense');

// @desc    Get all expenses for logged-in user
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
    try {
        const { category, paymentMethod, startDate, endDate, search, limit = 50, page = 1 } = req.query;

        let query = { user: req.user._id };

        if (category) query.category = category;
        if (paymentMethod) query.paymentMethod = paymentMethod;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Expense.countDocuments(query);
        const expenses = await Expense.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            expenses,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new expense
// @route   POST /api/expenses
const addExpense = async (req, res) => {
    try {
        const { title, amount, category, paymentMethod, date, description, isRecurring, tags } = req.body;

        if (!title || !amount) {
            return res.status(400).json({ message: 'Title and amount are required' });
        }

        const expense = await Expense.create({
            user: req.user._id,
            title, amount, category, paymentMethod,
            date: date || new Date(),
            description, isRecurring, tags
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await Expense.deleteOne({ _id: req.params.id });
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get expense summary by category
// @route   GET /api/expenses/summary
const getExpenseSummary = async (req, res) => {
    try {
        const { month, year } = req.query;
        const now = new Date();
        const targetMonth = parseInt(month) || now.getMonth() + 1;
        const targetYear = parseInt(year) || now.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const summary = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        const totalSpent = summary.reduce((sum, cat) => sum + cat.total, 0);

        res.json({
            summary,
            totalSpent,
            month: targetMonth,
            year: targetYear
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense, getExpenseSummary };
