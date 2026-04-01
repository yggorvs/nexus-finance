const pool = require('../config/database');

class Transaction {
    static async create(userId, { description, amount, type, category, date }) {
        const result = await pool.query(
            `INSERT INTO transactions (user_id, description, amount, type, category, date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
            [userId, description, amount, type, category, date]
        );
        return result.rows[0];
    }

    static async findByUserId(userId, filters = {}) {
        let query = 'SELECT * FROM transactions WHERE user_id = $1';
        const values = [userId];
        let paramIndex = 2;

        if (filters.type) {
            query += ` AND type = $${paramIndex}`;
            values.push(filters.type);
            paramIndex++;
        }

        if (filters.category) {
            query += ` AND category = $${paramIndex}`;
            values.push(filters.category);
            paramIndex++;
        }

        if (filters.startDate && filters.endDate) {
            query += ` AND date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
            values.push(filters.startDate, filters.endDate);
            paramIndex += 2;
        }

        query += ' ORDER BY date DESC, created_at DESC';

        const result = await pool.query(query, values);
        return result.rows;
    }

    static async findById(id, userId) {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        return result.rows[0];
    }

    static async update(id, userId, data) {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (data.description) {
            fields.push(`description = $${paramIndex}`);
            values.push(data.description);
            paramIndex++;
        }

        if (data.amount) {
            fields.push(`amount = $${paramIndex}`);
            values.push(data.amount);
            paramIndex++;
        }

        if (data.type) {
            fields.push(`type = $${paramIndex}`);
            values.push(data.type);
            paramIndex++;
        }

        if (data.category) {
            fields.push(`category = $${paramIndex}`);
            values.push(data.category);
            paramIndex++;
        }

        if (data.date) {
            fields.push(`date = $${paramIndex}`);
            values.push(data.date);
            paramIndex++;
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id, userId);

        const query = `
      UPDATE transactions 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id, userId) {
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        return result.rows[0];
    }

    static async getStats(userId) {
        const result = await pool.query(
            `SELECT 
        type,
        COUNT(*) as count,
        SUM(amount) as total,
        AVG(amount) as average
       FROM transactions 
       WHERE user_id = $1 
       GROUP BY type`,
            [userId]
        );
        return result.rows;
    }

    static async getByCategory(userId, type = 'expense') {
        const result = await pool.query(
            `SELECT 
        category,
        COUNT(*) as count,
        SUM(amount) as total
       FROM transactions 
       WHERE user_id = $1 AND type = $2
       GROUP BY category
       ORDER BY total DESC`,
            [userId, type]
        );
        return result.rows;
    }
}

module.exports = Transaction;