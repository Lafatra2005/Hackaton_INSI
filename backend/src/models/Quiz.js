import pool from '../../config/database.js';

const decodeHTML = (html) => {
    if (!html) return "";
    const map = { '&quot;': '"', '&#039;': "'", '&amp;': '&', '&lt;': '<', '&gt;': '>', '&rsquo;': "'", '&ldquo;': '"', '&rdquo;': '"' };
    return html.replace(/&quot;|&#039;|&amp;|&lt;|&gt;|&rsquo;|&ldquo;|&rdquo;/g, m => map[m]);
};

// Translation function using LibreTranslate API
const translateText = async (text, targetLang) => {
    if (!text || targetLang === 'en') return text;

    try {
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: targetLang === 'mg' ? 'mg' : 'fr',
                format: 'text'
            })
        });
        const data = await response.json();
        return data.translatedText || text;
    } catch (e) {
        console.warn(`Translation failed for "${text.substring(0, 30)}...", using original`);
        return text;
    }
};

// Translate entire quiz
const translateQuiz = async (quiz, lang) => {
    if (!quiz || !lang || lang === 'en') return quiz;

    console.log(`[Quiz] Translating quiz to ${lang}...`);
    const translatedQuestions = [];

    for (const q of quiz.questions) {
        const translatedQuestion = {
            ...q,
            question_text: await translateText(q.question_text, lang),
            options: await Promise.all(q.options.map(opt => translateText(opt, lang)))
        };
        // Keep correct_answer untranslated for comparison if it exists
        if (q.correct_answer) {
            translatedQuestion.correct_answer = await translateText(q.correct_answer, lang);
        }
        translatedQuestions.push(translatedQuestion);
    }

    return {
        ...quiz,
        title: await translateText(quiz.title, lang),
        questions: translatedQuestions
    };
};

// In-memory session cache: Map<userId, { quizId, questions }>
const activeSessions = new Map();

class Quiz {
    static async findAll(filters = {}) {
        const difficulty = filters.difficulty || 'intermediaire';
        const lang = filters.lang || 'fr';

        // Quiz titles based on language
        const titles = {
            fr: [
                { id: 18, title: "Informatique & Tech", description: "Testez vos connaissances en informatique." },
                { id: 17, title: "Sciences & Nature", description: "Découvertes et monde naturel." },
                { id: 23, title: "Histoire", description: "Les grands événements du passé." },
                { id: 22, title: "Géographie", description: "Voyagez à travers le monde." },
                { id: 19, title: "Mathématiques", description: "Logique et calculs." },
                { id: 9, title: "Culture Générale", description: "Un peu de tout !" }
            ],
            mg: [
                { id: 18, title: "Informatika & Teknolojia", description: "Andao hizaha ny fahalalanao momba ny informatika." },
                { id: 17, title: "Siansa & Natiora", description: "Fahitana sy tontolo voajanahary." },
                { id: 23, title: "Tantara", description: "Ny zava-nitranga lehibe taloha." },
                { id: 22, title: "Jeografia", description: "Mivezivezy manerana izao tontolo izao." },
                { id: 19, title: "Matematika", description: "Fikirana sy kajy." },
                { id: 9, title: "Fahalalana Ankapobeny", description: "Zavatra samy hafa !" }
            ],
            en: [
                { id: 18, title: "IT & Tech", description: "Test your IT knowledge." },
                { id: 17, title: "Science & Nature", description: "Discoveries and nature." },
                { id: 23, title: "History", description: "Great past events." },
                { id: 22, title: "Geography", description: "Travel the world." },
                { id: 19, title: "Mathematics", description: "Logic and computation." },
                { id: 9, title: "General Knowledge", description: "A bit of everything!" }
            ]
        };

        const langTitles = titles[lang] || titles['fr'];
        return langTitles.map(item => ({ ...item, questions_count: 10, difficulty }));
    }

    static async findById(id, difficulty = 'hard', userId = null, lang = 'fr') { // Default to hard for 16+
        try {
            console.log(`[Quiz] Fetching quiz ${id} with difficulty ${difficulty} for user ${userId}, lang: ${lang}`);

            // ANTI-RATE-LIMIT: Check if we already have a session for this user with this quiz
            if (userId) {
                const existingSession = activeSessions.get(String(userId));
                if (existingSession && existingSession.quizId === id) {
                    console.log(`[Quiz] Returning CACHED session for user ${userId} (Quiz ${id})`);

                    // Return cached version (already has correct_answer for verification)
                    const userQuestions = existingSession.questions.map(q => ({
                        id: q.id,
                        question_text: q.question_text,
                        options: q.options,
                    }));
                    return {
                        id,
                        title: existingSession.title || 'Quiz',
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
                    explanation: `Category: ${decodeHTML(q.category)}`
                }));
            } else {
                console.warn(`[Quiz] API returned no results for category ${id}. Response code: ${data.response_code}`);
                return this.getFallbackQuiz(id, lang);
            }

            let quiz = {
                id,
                title: data.results[0].category,
                questions: questions
            };

            // Translate if needed
            if (lang && lang !== 'en') {
                quiz = await translateQuiz(quiz, lang);
            }

            // Store TRANSLATED version in Session Cache
            if (userId) {
                console.log(`[Quiz] Storing NEW session for user ${userId} (Quiz ${id}, lang: ${lang})`);
                activeSessions.set(String(userId), {
                    quizId: id,
                    timestamp: Date.now(),
                    title: quiz.title,
                    questions: quiz.questions // Store with correct_answer for verification
                });
            }

            // Return without correct_answer to frontend
            const userQuestions = quiz.questions.map(q => ({
                id: q.id,
                question_text: q.question_text,
                options: q.options,
            }));

            return {
                id,
                title: quiz.title,
                questions: userQuestions
            };
        } catch (e) {
            console.error("Quiz Fetch Error", e);
            return this.getFallbackQuiz(id, lang);
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

    static getFallbackQuiz(id, lang = 'fr') {
        const quizzes = {
            fr: {
                title: "Quiz Éducatif (Mode Hors-Ligne)",
                questions: [
                    { id: 1, question_text: "Qu'est-ce qu'une source fiable ?", options: ["Une source partagée sur les réseaux sociaux", "Une source vérifiable avec auteur et date", "Une source anonyme", "Une source populaire"], correct_answer: "Une source vérifiable avec auteur et date", explanation: "La fiabilité repose sur la vérifiabilité." },
                    { id: 2, question_text: "Que signifie 'esprit critique' ?", options: ["Critiquer tout ce qu'on lit", "Accepter toutes les informations", "Analyser et vérifier avant de croire", "Ignorer les médias"], correct_answer: "Analyser et vérifier avant de croire", explanation: "L'esprit critique aide à distinguer le vrai du faux." },
                    { id: 3, question_text: "Qu'est-ce qu'un biais de confirmation ?", options: ["Chercher des infos qui confirment nos croyances", "Vérifier plusieurs sources", "Accepter toutes les opinions", "Rejeter toute information"], correct_answer: "Chercher des infos qui confirment nos croyances", explanation: "C'est un piège cognitif courant." }
                ]
            },
            mg: {
                title: "Fanadinana Fampianarana (Tsy misy Internet)",
                questions: [
                    { id: 1, question_text: "Inona no loharano azo itokisana?", options: ["Loharano nozaraina amin'ny media sosialy", "Loharano azo hamarinina misy mpanoratra sy daty", "Loharano tsy fantatra", "Loharano malaza"], correct_answer: "Loharano azo hamarinina misy mpanoratra sy daty", explanation: "Ny fahatokisana dia mifototra amin'ny fahaizana manamarina." },
                    { id: 2, question_text: "Inona no dikan'ny 'saina mijery'?", options: ["Mitsikera izay rehetra vakiana", "Manaiky vaovao rehetra", "Mamakafaka sy manamarina alohan'ny mino", "Tsy miraharaha ny media"], correct_answer: "Mamakafaka sy manamarina alohan'ny mino", explanation: "Ny saina mijery dia manampy hanavahana ny marina sy ny diso." },
                    { id: 3, question_text: "Inona no bias fanekena?", options: ["Mitady vaovao manamafy ny finoantsika", "Manamarina loharano maro", "Manaiky hevitra rehetra", "Mandà vaovao rehetra"], correct_answer: "Mitady vaovao manamafy ny finoantsika", explanation: "Fandrika ara-tsaina mahazatra izany." }
                ]
            },
            en: {
                title: "Educational Quiz (Offline Mode)",
                questions: [
                    { id: 1, question_text: "What is a reliable source?", options: ["A source shared on social media", "A verifiable source with author and date", "An anonymous source", "A popular source"], correct_answer: "A verifiable source with author and date", explanation: "Reliability is based on verifiability." },
                    { id: 2, question_text: "What does 'critical thinking' mean?", options: ["Criticizing everything you read", "Accepting all information", "Analyzing and verifying before believing", "Ignoring the media"], correct_answer: "Analyzing and verifying before believing", explanation: "Critical thinking helps distinguish truth from falsehood." },
                    { id: 3, question_text: "What is confirmation bias?", options: ["Seeking info that confirms our beliefs", "Checking multiple sources", "Accepting all opinions", "Rejecting all information"], correct_answer: "Seeking info that confirms our beliefs", explanation: "It's a common cognitive trap." }
                ]
            }
        };

        const quiz = quizzes[lang] || quizzes['fr'];
        return { id, ...quiz };
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