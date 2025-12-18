import pool from '../../config/database.js';
import bcrypt from 'bcryptjs';

class User {
    static async create(userData) {
        const { username, email, password, fullName, role = 'etudiant', country, language = 'fr' } = userData;
        const passwordHash = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            `INSERT INTO users (username, email, password_hash, full_name, role, country, language) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, email, passwordHash, fullName, role, country, language]
        );
        
        return this.findById(result.insertId);
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT id, username, email, full_name, role, avatar_url, bio, country, language, created_at 
             FROM users WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            `SELECT id, username, email, password_hash, full_name, role, avatar_url, bio, country, language, created_at 
             FROM users WHERE email = ?`,
            [email]
        );
        return rows[0] || null;
    }

    static async findByUsername(username) {
        const [rows] = await pool.execute(
            `SELECT id, username, email, password_hash, full_name, role, avatar_url, bio, country, language, created_at 
             FROM users WHERE username = ?`,
            [username]
        );
        return rows[0] || null;
    }

    static async updateProfile(id, updates) {
        const { fullName, bio, country, language, avatarUrl } = updates;

        // ✅ Empêche l’erreur MySQL2 : undefined → null
        const safe = value => value === undefined ? null : value;
        
        const [result] = await pool.execute(
            `UPDATE users 
             SET full_name = ?, bio = ?, country = ?, language = ?, avatar_url = ? 
             WHERE id = ?`,
            [
                safe(fullName),
                safe(bio),
                safe(country),
                safe(language),
                safe(avatarUrl),
                id
            ]
        );
        
        return result.affectedRows > 0;
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    static async getAllUsers(limit = 50, offset = 0) {
        const [rows] = await pool.execute(
            `SELECT id, username, email, full_name, role, country, language, created_at 
             FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        return rows;
    }

    static async getDashboardStats() {
        const [usersResult] = await pool.execute(`SELECT COUNT(*) as total FROM users WHERE role = 'etudiant'`);
        const [analysesResult] = await pool.execute(`SELECT COUNT(*) as total FROM content_analysis`);
        const [quizzesResult] = await pool.execute(`SELECT COUNT(*) as total FROM quiz_results`);
        
        return {
            totalUsers: usersResult[0].total,
            totalAnalyses: analysesResult[0].total,
            totalQuizzesCompleted: quizzesResult[0].total
        };
    }
}

export default User;
