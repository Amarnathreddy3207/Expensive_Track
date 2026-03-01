const Budget = require('../models/Budget');

// @desc    Get budget for current month
// @route   GET /api/budget
const getBudget = async (req, res) => {
    try {
        const now = new Date();
        const month = parseInt(req.query.month) || now.getMonth() + 1;
        const year = parseInt(req.query.year) || now.getFullYear();

        const budget = await Budget.findOne({ user: req.user._id, month, year });
        if (!budget) {
            return res.status(404).json({ message: 'No budget set for this month' });
        }

        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or update budget
// @route   POST /api/budget
const createOrUpdateBudget = async (req, res) => {
    try {
        const now = new Date();
        const { month = now.getMonth() + 1, year = now.getFullYear(), totalBudget, categories } = req.body;

        if (!totalBudget && totalBudget !== 0) {
            return res.status(400).json({ message: 'Total budget is required' });
        }

        const budget = await Budget.findOneAndUpdate(
            { user: req.user._id, month: parseInt(month), year: parseInt(year) },
            { totalBudget: parseFloat(totalBudget), categories: categories || [] },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(201).json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete budget
// @route   DELETE /api/budget/:id
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        await Budget.deleteOne({ _id: req.params.id });
        res.json({ message: 'Budget deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBudget, createOrUpdateBudget, deleteBudget };
