const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.get('/logs', logController.getRecentLogs);

module.exports = router;
