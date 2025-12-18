import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

export const register = async (req, res) => {
    try {
        const { username, email, password, fullName, country, language } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
        }

        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ error: 'Ce nom d utilisateur est déjà pris.' });
        }

        // Créer l'utilisateur
        const user = await User.create({
            username,
            email,
            password,
            fullName,
            country,
            language
        });

        const token = generateToken(user.id);

        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                country: user.country,
                language: user.language
            },
            token
        });
    } catch (error) {
        console.error('Erreur lors de l inscription:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l inscription.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await User.verifyPassword(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const token = generateToken(user.id);

        res.json({
            message: 'Connexion réussie.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                country: user.country,
                language: user.language
            },
            token
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            country: user.country,
            language: user.language,
            createdAt: user.created_at
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, country, language, avatarUrl } = req.body;

        const updated = await User.updateProfile(req.user.id, {
            fullName,
            bio,
            country,
            language,
            avatarUrl
        });

        if (!updated) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        const user = await User.findById(req.user.id);
        res.json({
            message: 'Profil mis à jour avec succès.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                avatarUrl: user.avatar_url,
                bio: user.bio,
                country: user.country,
                language: user.language
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const logout = (req, res) => {
    // Côté serveur, on ne fait rien de particulier
    // Le client doit supprimer le token
    res.json({ message: 'Déconnexion réussie.' });
};