import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token invalide.' });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Non authentifié.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Accès refusé. Rôle requis : ${roles.join(', ')}` 
            });
        }

        next();
    };
};

export const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            req.user = user;
        } catch (error) {
            // Ignorer les erreurs de token optionnel
        }
    }
    
    next();
};