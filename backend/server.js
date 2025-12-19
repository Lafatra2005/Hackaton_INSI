import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importer les routes
import authRoutes from './src/routes/auth.js';
import analysisRoutes from './src/routes/analysis.js';
import quizRoutes from './src/routes/quizzes.js';
import trustedSourceRoutes from './src/routes/trustedSources.js';

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par windowMs
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware de sécurité
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/trusted-sources', trustedSourceRoutes);

// Route de test
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Education Platform API is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Route de test DB
app.get('/api/test-db', async (req, res) => {
    try {
        const User = await import('./src/models/User.js');
        const stats = await User.default.getDashboardStats();
        res.json({
            success: true,
            message: 'Database connection successful!',
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Gestion des erreurs 404
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'Route API non trouvée.' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).json({ 
        error: 'Erreur serveur interne.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`🔍 Test de l API: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Test DB: http://localhost:${PORT}/api/test-db`);
});

export default app;