import pool from '../../config/database.js';

class ContentAnalysis {
    static async create(analysisData) {
        const { 
            userId, 
            contentUrl, 
            contentText, 
            contentType = 'text', 
            aiScore, 
            aiVerdict, 
            aiExplanation, 
            reliabilityFactors,
            biasIndicators,
            factCheckSources
        } = analysisData;

        const [result] = await pool.execute(
            `INSERT INTO content_analysis 
             (user_id, content_url, content_text, content_type, ai_score, ai_verdict, 
              ai_explanation, reliability_factors, bias_indicators, fact_check_sources) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, 
                contentUrl, 
                contentText, 
                contentType, 
                aiScore, 
                aiVerdict, 
                aiExplanation,
                JSON.stringify(reliabilityFactors),
                JSON.stringify(biasIndicators),
                JSON.stringify(factCheckSources)
            ]
        );
        
        return this.findById(result.insertId);
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT ca.*, u.username, u.full_name 
             FROM content_analysis ca 
             LEFT JOIN users u ON ca.user_id = u.id 
             WHERE ca.id = ?`,
            [id]
        );
        
        if (rows[0]) {
            rows[0].reliability_factors = rows[0].reliability_factors ? JSON.parse(rows[0].reliability_factors) : {};
            rows[0].bias_indicators = rows[0].bias_indicators ? JSON.parse(rows[0].bias_indicators) : {};
            rows[0].fact_check_sources = rows[0].fact_check_sources ? JSON.parse(rows[0].fact_check_sources) : [];
        }
        
        return rows[0] || null;
    }

    static async findByUserId(userId, limit = 20, offset = 0) {
        const [rows] = await pool.execute(
            `SELECT ca.*, u.username 
             FROM content_analysis ca 
             LEFT JOIN users u ON ca.user_id = u.id 
             WHERE ca.user_id = ? 
             ORDER BY ca.created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );
        
        rows.forEach(row => {
            row.reliability_factors = row.reliability_factors ? JSON.parse(row.reliability_factors) : {};
            row.bias_indicators = row.bias_indicators ? JSON.parse(row.bias_indicators) : {};
            row.fact_check_sources = row.fact_check_sources ? JSON.parse(row.fact_check_sources) : [];
        });
        
        return rows;
    }

    static async getAll(limit = 50, offset = 0) {
        const [rows] = await pool.execute(
            `SELECT ca.*, u.username, u.full_name 
             FROM content_analysis ca 
             LEFT JOIN users u ON ca.user_id = u.id 
             ORDER BY ca.created_at DESC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        rows.forEach(row => {
            row.reliability_factors = row.reliability_factors ? JSON.parse(row.reliability_factors) : {};
            row.bias_indicators = row.bias_indicators ? JSON.parse(row.bias_indicators) : {};
            row.fact_check_sources = row.fact_check_sources ? JSON.parse(row.fact_check_sources) : [];
        });
        
        return rows;
    }

    static async getStatsByVerdict() {
        const [rows] = await pool.execute(
            `SELECT ai_verdict, COUNT(*) as count 
             FROM content_analysis 
             GROUP BY ai_verdict`
        );
        return rows;
    }

    static async getDailyStats(days = 7) {
        const [rows] = await pool.execute(
            `SELECT DATE(created_at) as date, 
                    COUNT(*) as total_analyses,
                    AVG(ai_score) as avg_score,
                    COUNT(CASE WHEN ai_verdict = 'fiable' THEN 1 END) as reliable_count,
                    COUNT(CASE WHEN ai_verdict = 'douteux' THEN 1 END) as doubtful_count,
                    COUNT(CASE WHEN ai_verdict = 'faux' THEN 1 END) as fake_count
             FROM content_analysis 
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY DATE(created_at)
             ORDER BY date DESC`,
            [days]
        );
        return rows;
    }
}

export default ContentAnalysis;