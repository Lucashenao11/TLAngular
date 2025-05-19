const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authService = require("../services/authService");

router.get('/expenses', authService, expenseController.getExpenses);
router.post('/expenses', authService, expenseController.createExpense);

module.exports = router;
