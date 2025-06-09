const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionC');

router.post('/', TransactionController.createTransaction)
router.get('/:id', TransactionController.getTransactionById);
router.get('/user/:id', TransactionController.getUserTransactions)


module.exports = router;
