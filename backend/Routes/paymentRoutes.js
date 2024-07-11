const express = require('express');
const router = express.Router();
const {createPayment} = require('../Controllers/paymentController');

router.post('/create',createPayment);

module.exports = router;
