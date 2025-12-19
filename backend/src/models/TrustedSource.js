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
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            const domain = hostname.replace('www.', ''); 

            const [rows] = await pool.execute(
                `SELECT * FROM trusted_sources 
                 WHERE url LIKE ? OR url LIKE ?`,
                [`%${domain}%`, `%${hostname}%`]
            );

            const match = rows.find(row => {
                try {
                    const rowHost = new URL(row.url).hostname.replace('www.', '');
                    return domain.includes(rowHost) || rowHost.includes(domain);
                } catch (e) {
                    return false;
                }
            });

            if (match) {
                return {
                    isTrusted: true,
                    source: match,
                    reliabilityScore: match.reliability_score
                };
            }

            const authoritativeDomains = [
                'unesco.org', 'un.org', 'who.int', 'gov', 'edu', 'europa.eu',
                'nasa.gov', 'cnrs.fr', 'nature.com', 'science.org',
                'bbc.com', 'reuters.com', 'afp.com', 'apnews.com',
                'france24.com', 'lemonde.fr', 'lefigaro.fr'
            ];

            if (authoritativeDomains.some(d => domain.endsWith(d))) {
                return {
                    isTrusted: true,
                    source: { name: hostname, trust_score: 95 },
                    reliabilityScore: 0.95
                };
            }

            return {
                isTrusted: false,
                reliabilityScore: 0.5 
            };
        } catch (e) {
            console.error("Error verification source:", e);
            return {
                isTrusted: false,
                reliabilityScore: 0.5
            };
        }
    }
}

export default TrustedSource;