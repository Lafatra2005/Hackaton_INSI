import pool from '../../config/database.js';

class TrustedSource {
    static async findAll(filters = {}) {
        const { category, country, language, isVerified } = filters;
        let query = `SELECT id, name, url, description, category, country, language, reliability_score, is_verified 
                     FROM trusted_sources WHERE 1=1`;
        let params = [];

        if (category) {
            query += ` AND category = ?`;
            params.push(category);
        }

        if (country) {
            query += ` AND country = ?`;
            params.push(country);
        }

        if (language) {
            query += ` AND language = ?`;
            params.push(language);
        }

        if (isVerified !== undefined) {
            query += ` AND is_verified = ?`;
            params.push(isVerified);
        }

        query += ` ORDER BY reliability_score DESC`;

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT id, name, url, description, category, country, language, reliability_score, is_verified, created_at 
             FROM trusted_sources WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async searchByName(name) {
        const [rows] = await pool.execute(
            `SELECT id, name, url, description, category, country, language, reliability_score 
             FROM trusted_sources 
             WHERE name LIKE ? OR description LIKE ?
             ORDER BY reliability_score DESC`,
            [`%${name}%`, `%${name}%`]
        );
        return rows;
    }

    static async create(sourceData) {
        const { name, url, description, category, country, language, reliabilityScore, isVerified } = sourceData;
        
        const [result] = await pool.execute(
            `INSERT INTO trusted_sources 
             (name, url, description, category, country, language, reliability_score, is_verified) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, url, description, category, country, language, reliabilityScore || 0.85, isVerified || false]
        );
        
        return this.findById(result.insertId);
    }

    static async update(id, updates) {
        const { name, url, description, category, country, language, reliabilityScore, isVerified } = updates;
        
        const [result] = await pool.execute(
            `UPDATE trusted_sources 
             SET name = ?, url = ?, description = ?, category = ?, country = ?, 
                 language = ?, reliability_score = ?, is_verified = ? 
             WHERE id = ?`,
            [name, url, description, category, country, language, reliabilityScore, isVerified, id]
        );
        
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute(
            `DELETE FROM trusted_sources WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    static async getCategories() {
        const [rows] = await pool.execute(
            `SELECT DISTINCT category FROM trusted_sources ORDER BY category`
        );
        return rows.map(row => row.category);
    }

    static async getCountries() {
        const [rows] = await pool.execute(
            `SELECT DISTINCT country FROM trusted_sources ORDER BY country`
        );
        return rows.map(row => row.country);
    }

    static async verifySource(url) {
        const [rows] = await pool.execute(
            `SELECT * FROM trusted_sources WHERE url LIKE ?`,
            [`%${url}%`]
        );
        
        if (rows.length > 0) {
            return {
                isTrusted: true,
                source: rows[0],
                reliabilityScore: rows[0].reliability_score
            };
        }
        
        return {
            isTrusted: false,
            reliabilityScore: 0.3
        };
    }
}

export default TrustedSource;