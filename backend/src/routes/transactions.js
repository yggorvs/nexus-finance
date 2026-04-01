const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const authenticateToken = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

router.post('/', TransactionController.create);
router.get('/', TransactionController.getAll);
router.get('/stats', TransactionController.getStats);
router.get('/:id', TransactionController.getById);
router.put('/:id', TransactionController.update);
router.delete('/:id', TransactionController.delete);

module.exports = router;