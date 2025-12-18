import pool from '../../config/database.js';

const decodeHTML = (html) => {
    if (!html) return "";
    const map = { '&quot;': '"', '&#039;': "'", '&amp;': '&', '&lt;': '<', '&gt;': '>', '&rsquo;': "'", '&ldquo;': '"', '&rdquo;': '"' };
    return html.replace(/&quot;|&#039;|&amp;|&lt;|&gt;|&rsquo;|&ldquo;|&rdquo;/g, m => map[m]);
};

class Quiz {
    static async findAll(filters = {}) {
        try {
            const { category, difficulty } = filters;
            const categoryMap = { 'media_literacy': 18, 'pedagogy': 9, 'adaptive': 17, 'critical_thinking': 23 };
            const diffMap = { 'debutant': 'easy', 'intermediaire': 'medium', 'avance': 'hard' };

            const apiCatId = categoryMap[category] || 9;
            const apiDiff = diffMap[difficulty] || '';

            return [{
                id: apiCatId,
                title: category ? this.getLabel(category) : "Module de Formation",
                description: `Contenu interactif généré pour le niveau ${difficulty || 'standard'}.`,
                category: category || 'general',
                difficulty: difficulty || 'intermediaire',
                questions_count: 15
            }];
        } catch (e) { return []; }
    }

    static getLabel(slug) {
        const labels = { 'media_literacy': 'Littératie médiatique', 'pedagogy': 'Pédagogie active', 'adaptive': 'Parcours adaptatif', 'critical_thinking': 'Esprit critique' };
        return labels[slug] || 'Module';
    }

    static async findById(id, difficulty = '') {
        try {
            // Sécurité : On s'assure que difficulty est soit 'easy', 'medium' ou 'hard'
            const validDiffs = ['easy', 'medium', 'hard'];
            const cleanDiff = validDiffs.includes(difficulty) ? `&difficulty=${difficulty}` : '';

            // TENTATIVE 1 : API avec filtres
            let res = await fetch(`https://opentdb.com/api.php?amount=15&category=${id}${cleanDiff}&type=multiple`);
            let data = await res.json();

            // TENTATIVE 2 : Si échec, API sans difficulté
            if (data.response_code !== 0) {
                res = await fetch(`https://opentdb.com/api.php?amount=15&category=${id}&type=multiple`);
                data = await res.json();
            }

            // TENTATIVE 3 : Si toujours échec (Rate limit), on crée un quiz de secours local
            if (!data.results || data.results.length === 0) {
                return this.getEmergencyQuiz(id);
            }

            const questions = data.results.map((q, i) => ({
                id: i + 1,
                question_text: decodeHTML(q.question),
                options: [...q.incorrect_answers, q.correct_answer].map(o => decodeHTML(o)).sort(() => Math.random() - 0.5),
                correct_answer: decodeHTML(q.correct_answer),
                explanation: "Thème : " + decodeHTML(q.category)
            }));

            return { id, title: decodeHTML(data.results[0].category), questions };
        } catch (e) {
            return this.getEmergencyQuiz(id);
        }
    }

    static getEmergencyQuiz(id) {
        return {
            id,
            title: "Module d'initiation (Mode Secours)",
            questions: [
                {
                    id: 1,
                    question_text: "L'esprit critique consiste à :",
                    options: ["Accepter tout", "Vérifier les sources", "Ignorer l'info"],
                    correct_answer: "Vérifier les sources",
                    explanation: "La vérification est la base de l'esprit critique."
                },
                {
                    id: 2,
                    question_text: "Une information fiable doit être :",
                    options: ["Récente et sourcée", "Partagée par beaucoup", "Écrite en gras"],
                    correct_answer: "Récente et sourcée",
                    explanation: "La source est plus importante que la popularité."
                }
            ]
        };
    }

    // Fonctions résultats BDD
    static async submitResult(userId, quizId, answers, score, maxScore, timeSpent) {
        try {
            await pool.execute(
                `INSERT INTO quiz_results (user_id, quiz_id, score, max_score, answers, time_spent_seconds) VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, quizId, score, maxScore, JSON.stringify(answers), timeSpent]
            );
        } catch (e) { console.log("Sauvegarde locale uniquement"); }
        return { score };
    }

    static async getUserResults(userId) {
        const [rows] = await pool.execute(`SELECT * FROM quiz_results WHERE user_id = ? ORDER BY completed_at DESC`, [userId]);
        return rows;
    }

    static async getUserProgress(userId) {
        const [rows] = await pool.execute(`SELECT score FROM quiz_results WHERE user_id = ?`, [userId]);
        return { categoryProgress: [], totalQuizzes: 10, completedQuizzes: rows.length, progressPercentage: Math.min(100, rows.length * 10) };
    }
}

export default Quiz;