const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, updateExpense, deleteExpense, getExpenseSummary } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getExpenses).post(addExpense);
router.route('/summary').get(getExpenseSummary);
router.route('/:id').put(updateExpense).delete(deleteExpense);

module.exports = router;
