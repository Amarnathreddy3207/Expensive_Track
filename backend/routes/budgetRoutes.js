const express = require('express');
const router = express.Router();
const { getBudget, createOrUpdateBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getBudget).post(createOrUpdateBudget);
router.route('/:id').delete(deleteBudget);

module.exports = router;
