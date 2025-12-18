import pool from '../../config/database.js';

const decodeHTML = (html) => {
    if (!html) return "";
    const map = { '&quot;': '"', '&#039;': "'", '&amp;': '&', '&lt;': '<', '&gt;': '>', '&rsquo;': "'", '&ldquo;': '"', '&rdquo;': '"' };
    return html.replace(/&quot;|&#039;|&amp;|&lt;|&gt;|&rsquo;|&ldquo;|&rdquo;/g, m => map[m]);
};

// In-memory session cache: Map<userId, { quizId, questions }>
const activeSessions = new Map();

class Quiz {
    static async findAll(filters = {}) {
        // Return a fixed list of OpenTDB categories as "Quizzes"
        // This gives the user perceived variety
        const difficulty = filters.difficulty || 'intermediaire';

        return [
            { id: 18, title: "Informatique & Tech", category: "Science: Computers", description: "Testez vos connaissances en informatique.", questions_count: 10, difficulty },
            { id: 17, title: "Sciences & Nature", category: "Science & Nature", description: "Découvertes et monde naturel.", questions_count: 10, difficulty },
            { id: 23, title: "Histoire", category: "History", description: "Les grands événements du passé.", questions_count: 10, difficulty },
            { id: 22, title: "Géographie", category: "Geography", description: "Voyagez à travers le monde.", questions_count: 10, difficulty },
            { id: 19, title: "Mathématiques", category: "Science: Mathematics", description: "Logique et calculs.", questions_count: 10, difficulty },
            { id: 9, title: "Culture Générale", category: "General Knowledge", description: "Un peu de tout !", questions_count: 10, difficulty }
        ];
    }

    static async findById(id, difficulty = 'hard', userId = null) { // Default to hard for 16+
        try {
            console.log(`[Quiz] Fetching quiz ${id} with difficulty ${difficulty} for user ${userId}`);

            // ANTI-RATE-LIMIT: Check if we already have a session for this user with this quiz
            if (userId) {
                const existingSession = activeSessions.get(String(userId));
                if (existingSession && existingSession.quizId === id) {
                    console.log(`[Quiz] Returning CACHED session for user ${userId} (Quiz ${id})`);
                    const userQuestions = existingSession.questions.map(q => ({
                        id: q.id,
                        question_text: q.question_text,
                        options: q.options,
                    }));
                    return {
                        id,
                        title: existingSession.questions[0]?.explanation || 'Quiz',
                        questions: userQuestions
                    };
                }
            }

            // Map difficulty to API format
            const diffMap = { 'debutant': 'easy', 'intermediaire': 'medium', 'avance': 'hard' };
            const apiDiff = diffMap[difficulty] || difficulty || 'hard';

            // Fetch from OpenTDB
            const apiUrl = `https://opentdb.com/api.php?amount=10&category=${id}&difficulty=${apiDiff}&type=multiple`;
            console.log(`[Quiz] API URL: ${apiUrl}`);
            const response = await fetch(apiUrl);
            const data = await response.json();

            let questions = [];

            if (data.results && data.results.length > 0) {
                console.log(`[Quiz] Got ${data.results.length} questions for category ${data.results[0].category}`);
                questions = data.results.map((q, i) => ({
                    id: i + 1,
                    question_text: decodeHTML(q.question),
                    options: [...q.incorrect_answers, q.correct_answer]
                        .map(o => decodeHTML(o))
                        .sort(() => Math.random() - 0.5),
                    correct_answer: decodeHTML(q.correct_answer),
                    explanation: `Catégorie: ${decodeHTML(q.category)}`
                }));
            } else {
                console.warn(`[Quiz] API returned no results for category ${id}. Response code: ${data.response_code}`);
                return this.getFallbackQuiz(id);
            }

            // Store in Session Cache
            if (userId) {
                console.log(`[Quiz] Storing NEW session for user ${userId} (Quiz ${id})`);
                activeSessions.set(String(userId), {
                    quizId: id,
                    timestamp: Date.now(),
                    questions: questions
                });
            }

            const userQuestions = questions.map(q => ({
                id: q.id,
                question_text: q.question_text,
                options: q.options,
            }));

            return {
                id,
                title: data.results[0].category,
                questions: userQuestions
            };
        } catch (e) {
            console.error("Quiz Fetch Error", e);
            return this.getFallbackQuiz(id);
        }
    }

    static verifyAnswers(userId, submittedAnswers) {
        const session = activeSessions.get(String(userId));

        if (!session || !session.questions) {
            console.warn(`[Quiz] Session not found for user ${userId}. Available sessions: ${activeSessions.size}`);
            return { error: "Session expirée (le serveur a peut-être redémarré). Veuillez rafraîchir la page et recommencer le quiz." };
        }

        let correct = 0;
        const detailed = {};
        const total = session.questions.length;

        session.questions.forEach(q => {
            const userAns = submittedAnswers[q.id];
            const isCorrect = userAns === q.correct_answer;
            if (isCorrect) correct++;

            detailed[q.id] = {
                userAnswer: userAns,
                correctAnswer: q.correct_answer,
                isCorrect
            };
        });

        const score = Math.round((correct / total) * 100);

        // Optional: Clear session or keep it? 
        // activeSessions.delete(String(userId)); 

        return { score, totalQuestions: total, correctAnswers: correct, answers: detailed };
    }

    static getFallbackQuiz(id) {
        // Better fallback quiz with educational questions
        return {
            id,
            title: "Quiz Éducatif (Mode Hors-Ligne)",
            questions: [
                { id: 1, question_text: "Qu'est-ce qu'une source fiable ?", options: ["Une source partagée sur les réseaux sociaux", "Une source vérifiable avec auteur et date", "Une source anonyme", "Une source populaire"], correct_answer: "Une source vérifiable avec auteur et date", explanation: "La fiabilité repose sur la vérifiabilité." },
                { id: 2, question_text: "Que signifie 'esprit critique' ?", options: ["Critiquer tout ce qu'on lit", "Accepter toutes les informations", "Analyser et vérifier avant de croire", "Ignorer les médias"], correct_answer: "Analyser et vérifier avant de croire", explanation: "L'esprit critique aide à distinguer le vrai du faux." },
                { id: 3, question_text: "Qu'est-ce qu'un biais de confirmation ?", options: ["Chercher des infos qui confirment nos croyances", "Vérifier plusieurs sources", "Accepter toutes les opinions", "Rejeter toute information"], correct_answer: "Chercher des infos qui confirment nos croyances", explanation: "C'est un piège cognitif courant." }
            ]
        };
    }

    // Fonctions résultats BDD
    static async submitResult(userId, quizId, answers, score, maxScore, timeSpent) {
        // Don't save to database - dynamic quiz IDs don't exist in quizzes table
        // This would require creating quiz records first or using a different approach
        console.log(`[Quiz] Result: User ${userId} scored ${score}% on quiz ${quizId}`);
        return { score };
    }

    static async getUserResults(userId) {
        try {
            const [rows] = await pool.query(`SELECT * FROM quiz_results WHERE user_id = ? ORDER BY completed_at DESC`, [userId]);
            return rows;
        } catch (e) { return []; }
    }

    static async getUserProgress(userId) {
        try {
            const [rows] = await pool.query(`SELECT score FROM quiz_results WHERE user_id = ?`, [userId]);
            return { categoryProgress: [], totalQuizzes: 10, completedQuizzes: rows.length, progressPercentage: Math.min(100, rows.length * 10) };
        } catch (e) { return { progressPercentage: 0 }; }
    }
}

export default Quiz;