import express from 'express';
import pool from '../../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        
        const [analysesCount] = await pool.query('SELECT COUNT(*) as count FROM content_analysis');

        const [usersCount] = await pool.query('SELECT COUNT(*) as count FROM users');

        const [sourcesCount] = await pool.query('SELECT COUNT(*) as count FROM trusted_sources');

        res.json({
            success: true,
            stats: {
                analyses: analysesCount[0].count || 0,
                users: usersCount[0].count || 0,
                sources: sourcesCount[0].count || 0
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
});

export default router;
