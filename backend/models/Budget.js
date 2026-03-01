const mongoose = require('mongoose');

const CategoryBudgetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    limit: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0 }
}, { _id: false });

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1, max: 12
    },
    year: {
        type: Number,
        required: true
    },
    totalBudget: {
        type: Number,
        required: [true, 'Total budget is required'],
        min: 0
    },
    categories: [CategoryBudgetSchema]
}, { timestamps: true });

// Unique budget per user per month/year
BudgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
