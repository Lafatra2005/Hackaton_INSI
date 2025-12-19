import ContentAnalysis from '../models/ContentAnalysis.js';
import pool from '../../config/database.js';

export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Count analyses
        const [analysesCount] = await pool.query(
            'SELECT COUNT(*) as count FROM content_analysis WHERE user_id = ?',
            [userId]
        );

        // Count quiz results (from quiz_results table if it exists, or set to 0)
        let quizzesCount = [{ count: 0 }];
        try {
            const [quizResults] = await pool.query(
                'SELECT COUNT(*) as count FROM quiz_results WHERE user_id = ?',
                [userId]
            );
            quizzesCount = quizResults;
        } catch (e) {
            // Quiz results table might not exist or be empty
            console.log('Quiz results not available:', e.message);
        }

        // Calculate average analysis score
        const [avgScore] = await pool.query(
            'SELECT AVG(ai_score) as avg FROM content_analysis WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            stats: {
                analysesCount: analysesCount[0].count || 0,
                quizzesCount: quizzesCount[0].count || 0,
                averageScore: avgScore[0].avg ? Math.round(avgScore[0].avg) : 0
            }
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};
