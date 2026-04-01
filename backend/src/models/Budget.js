const pool = require('../config/database');

class Budget {
    static async create(userId, { category, amountLimit, month, year }) {
        const result = await pool.query(
            `INSERT INTO budgets (user_id, category, amount_limit, month, year) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, category, month, year) 
       DO UPDATE SET amount_limit = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
            [userId, category, amountLimit, month, year]
        );
        return result.rows[0];
    }

    static async findByUserId(userId, month, year) {
        const result = await pool.query(
            'SELECT * FROM budgets WHERE user_id = $1 AND month = $2 AND year = $3',
            [userId, month, year]
        );
        return result.rows;
    }

    static async update(id, userId, amountLimit) {
        const result = await pool.query(
            `UPDATE budgets 
       SET amount_limit = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
            [amountLimit, id, userId]
        );
        return result.rows[0];
    }

    static async delete(id, userId) {
        const result = await pool.query(
            'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        return result.rows[0];
    }
}

module.exports = Budget;