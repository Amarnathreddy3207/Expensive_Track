const mongoose = require('mongoose');

const CATEGORIES = [
    'Food & Dining',
    'Transport',
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Health & Medical',
    'Education',
    'Groceries',
    'Subscriptions',
    'Rent & Housing',
    'Other'
];

const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Net Banking', 'Wallet'];

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Expense title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be positive']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: CATEGORIES,
        default: 'Other'
    },
    paymentMethod: {
        type: String,
        enum: PAYMENT_METHODS,
        default: 'UPI'
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    tags: [String]
}, { timestamps: true });

// Index for fast querying by user and date
ExpenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
