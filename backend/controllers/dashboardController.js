const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);

        // This month aggregation
        const categoryBreakdown = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
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

        const thisMonthTotal = categoryBreakdown.reduce((sum, cat) => sum + cat.total, 0);
        const thisMonthCount = categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0);

        // Monthly trend (last 6 months)
        const sixMonthsAgo = new Date(year, month - 7, 1);
        const monthlyTrend = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: sixMonthsAgo, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        year: { $year: '$date' }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Recent 5 transactions
        const recentExpenses = await Expense.find({ user: req.user._id })
            .sort({ date: -1 })
            .limit(5);

        // Budget data
        const budget = await Budget.findOne({ user: req.user._id, month, year });

        // Overspending alerts
        const alerts = [];
        if (budget) {
            for (const cat of (budget.categories || [])) {
                const catSpent = categoryBreakdown.find(c => c._id === cat.name)?.total || 0;
                const percentage = cat.limit > 0 ? (catSpent / cat.limit) * 100 : 0;
                if (percentage >= 80) {
                    alerts.push({
                        category: cat.name,
                        spent: catSpent,
                        limit: cat.limit,
                        percentage: Math.round(percentage),
                        level: percentage >= 100 ? 'danger' : 'warning'
                    });
                }
            }
            // Total budget alert
            const totalBudgetPercentage = budget.totalBudget > 0 ? (thisMonthTotal / budget.totalBudget) * 100 : 0;
            if (totalBudgetPercentage >= 80) {
                alerts.unshift({
                    category: 'Total Budget',
                    spent: thisMonthTotal,
                    limit: budget.totalBudget,
                    percentage: Math.round(totalBudgetPercentage),
                    level: totalBudgetPercentage >= 100 ? 'danger' : 'warning'
                });
            }
        }

        res.json({
            thisMonthTotal,
            thisMonthCount,
            categoryBreakdown,
            monthlyTrend,
            recentExpenses,
            budget,
            alerts,
            month,
            year
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
