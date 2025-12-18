import express from 'express';
import TrustedSource from '../models/TrustedSource.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateTrustedSource } from '../middleware/validation.js';

const router = express.Router();

// Routes publiques
router.get('/', async (req, res) => {
    try {
        const { category, country, language } = req.query;
        const filters = {};

        if (category) filters.category = category;
        if (country) filters.country = country;
        if (language) filters.language = language;
        filters.isVerified = true;

        const sources = await TrustedSource.findAll(filters);
        res.json({ success: true, sources });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await TrustedSource.getCategories();
        res.json({ success: true, categories });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.get('/countries', async (req, res) => {
    try {
        const countries = await TrustedSource.getCountries();
        res.json({ success: true, countries });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// Routes protégées (admin)
router.post('/', authenticateToken, authorizeRoles('admin'), validateTrustedSource, async (req, res) => {
    try {
        const source = await TrustedSource.create(req.body);
        res.status(201).json({ success: true, source });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), validateTrustedSource, async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await TrustedSource.update(id, req.body);

        if (!updated) {
            return res.status(404).json({ error: 'Source non trouvée.' });
        }

        const source = await TrustedSource.findById(id);
        res.json({ success: true, source });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TrustedSource.delete(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Source non trouvée.' });
        }

        res.json({ success: true, message: 'Source supprimée.' });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

export default router;