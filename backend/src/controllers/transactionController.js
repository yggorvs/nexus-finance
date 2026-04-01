const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

class TransactionController {
    static async create(req, res) {
        try {
            const userId = req.user.id;
            const { description, amount, type, category, date } = req.body;

            // Validate input
            if (!description || !amount || !type || !category || !date) {
                return res.status(400).json({
                    error: 'All fields are required'
                });
            }

            if (!['income', 'expense'].includes(type)) {
                return res.status(400).json({
                    error: 'Type must be income or expense'
                });
            }

            const transaction = await Transaction.create(userId, {
                description,
                amount: parseFloat(amount),
                type,
                category,
                date
            });

            res.status(201).json({
                message: 'Transaction created successfully',
                transaction
            });

        } catch (error) {
            console.error('[TRANSACTION] Create error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async getAll(req, res) {
        try {
            const userId = req.user.id;
            const { type, category, startDate, endDate } = req.query;

            const filters = {};
            if (type) filters.type = type;
            if (category) filters.category = category;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const transactions = await Transaction.findByUserId(userId, filters);

            res.json({
                count: transactions.length,
                transactions
            });

        } catch (error) {
            console.error('[TRANSACTION] Get all error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const transaction = await Transaction.findById(id, userId);

            if (!transaction) {
                return res.status(404).json({
                    error: 'Transaction not found'
                });
            }

            res.json({ transaction });

        } catch (error) {
            console.error('[TRANSACTION] Get by ID error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const updateData = req.body;

            const transaction = await Transaction.update(id, userId, updateData);

            if (!transaction) {
                return res.status(404).json({
                    error: 'Transaction not found'
                });
            }

            res.json({
                message: 'Transaction updated successfully',
                transaction
            });

        } catch (error) {
            console.error('[TRANSACTION] Update error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const transaction = await Transaction.delete(id, userId);

            if (!transaction) {
                return res.status(404).json({
                    error: 'Transaction not found'
                });
            }

            res.json({
                message: 'Transaction deleted successfully'
            });

        } catch (error) {
            console.error('[TRANSACTION] Delete error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async getStats(req, res) {
        try {
            const userId = req.user.id;

            const stats = await Transaction.getStats(userId);
            const byCategory = await Transaction.getByCategory(userId);

            res.json({
                stats,
                byCategory
            });

        } catch (error) {
            console.error('[TRANSACTION] Get stats error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}

module.exports = TransactionController;