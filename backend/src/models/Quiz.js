import pool from '../../config/database.js';

class Quiz {
    static async findAll(filters = {}) {
        const { category, difficulty, language, isActive = true } = filters;
        let query = `SELECT id, title, description, category, difficulty, language, questions_count, time_limit_minutes 
                     FROM quizzes WHERE is_active = ?`;
        let params = [isActive];

        if (category) {
            query += ` AND category = ?`;
            params.push(category);
        }

        if (difficulty) {
            query += ` AND difficulty = ?`;
            params.push(difficulty);
        }

        if (language) {
            query += ` AND language = ?`;
            params.push(language);
        }

        query += ` ORDER BY created_at DESC`;

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [quizRows] = await pool.execute(
            `SELECT id, title, description, category, difficulty, language, questions_count, time_limit_minutes 
             FROM quizzes WHERE id = ? AND is_active = TRUE`,
            [id]
        );

        if (!quizRows[0]) return null;

        const [questionRows] = await pool.execute(
            `SELECT id, question_text, question_type, options, correct_answer, explanation, media_url, order_index 
             FROM questions WHERE quiz_id = ? ORDER BY order_index`,
            [id]
        );

        const questions = questionRows.map(q => ({
            ...q,
            options: q.options ? JSON.parse(q.options) : []
        }));

        return { ...quizRows[0], questions };
    }

    static async submitResult(userId, quizId, answers, score, maxScore, timeSpent) {
        const [result] = await pool.execute(
            `INSERT INTO quiz_results 
             (user_id, quiz_id, score, max_score, answers, time_spent_seconds) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, quizId, score, maxScore, JSON.stringify(answers), timeSpent]
        );

        return this.getResultById(result.insertId);
    }

    static async getResultById(resultId) {
        const [rows] = await pool.execute(
            `SELECT qr.*, q.title as quiz_title, q.category 
             FROM quiz_results qr 
             LEFT JOIN quizzes q ON qr.quiz_id = q.id 
             WHERE qr.id = ?`,
            [resultId]
        );

        if (rows[0]) {
            rows[0].answers = rows[0].answers ? JSON.parse(rows[0].answers) : {};
        }

        return rows[0] || null;
    }

    static async getUserResults(userId, limit = 20) {
        const [rows] = await pool.execute(
            `SELECT qr.*, q.title as quiz_title, q.category, q.difficulty 
             FROM quiz_results qr 
             LEFT JOIN quizzes q ON qr.quiz_id = q.id 
             WHERE qr.user_id = ? 
             ORDER BY qr.completed_at DESC 
             LIMIT ?`,
            [userId, limit]
        );

        rows.forEach(row => {
            row.answers = row.answers ? JSON.parse(row.answers) : {};
        });

        return rows;
    }

    static async getUserProgress(userId) {
        const [categoryProgress] = await pool.execute(
            `SELECT q.category, 
                    COUNT(*) as quizzes_completed,
                    AVG(qr.score) as average_score
             FROM quiz_results qr
             LEFT JOIN quizzes q ON qr.quiz_id = q.id
             WHERE qr.user_id = ?
             GROUP BY q.category`,
            [userId]
        );

        const [totalQuizzes] = await pool.execute(
            `SELECT COUNT(*) as total FROM quizzes WHERE is_active = TRUE`
        );

        const [completedQuizzes] = await pool.execute(
            `SELECT COUNT(DISTINCT quiz_id) as completed FROM quiz_results WHERE user_id = ?`,
            [userId]
        );

        return {
            categoryProgress,
            totalQuizzes: totalQuizzes[0].total,
            completedQuizzes: completedQuizzes[0].completed,
            progressPercentage: Math.round((completedQuizzes[0].completed / totalQuizzes[0].total) * 100)
        };
    }

    static async create(userData) {
        const { title, description, category, difficulty, language, questions, timeLimitMinutes, createdBy } = userData;
        
        const [quizResult] = await pool.execute(
            `INSERT INTO quizzes 
             (title, description, category, difficulty, language, questions_count, time_limit_minutes, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, category, difficulty, language, questions.length, timeLimitMinutes, createdBy]
        );

        const quizId = quizResult.insertId;

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            await pool.execute(
                `INSERT INTO questions 
                 (quiz_id, question_text, question_type, options, correct_answer, explanation, order_index) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    quizId, 
                    q.questionText, 
                    q.questionType, 
                    JSON.stringify(q.options || []),
                    q.correctAnswer, 
                    q.explanation, 
                    i + 1
                ]
            );
        }

        return this.findById(quizId);
    }
}

export default Quiz;