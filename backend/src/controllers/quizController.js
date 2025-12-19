import Quiz from '../models/Quiz.js';

export const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const { difficulty } = req.query;
        // Detect language from query or header (frontend sends via i18next)
        const lang = req.query.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'fr';

        // Pass userId to enable session caching and lang for translation
        const quiz = await Quiz.findById(id, difficulty, req.user ? req.user.id : null, lang);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz introuvable' });
        }

        res.json({ success: true, quiz });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const getAllQuizzes = async (req, res) => {
    try {
        // Detect language for quiz titles
        const lang = req.query.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'fr';
        const quizzes = await Quiz.findAll({ ...req.query, lang });
        res.json({ success: true, quizzes });
    } catch (e) { res.status(500).json({ error: 'Erreur.' }); }
};

export const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers, timeSpent } = req.body;

        // Use the new verification method that checks against session cache
        const result = Quiz.verifyAnswers(req.user.id, answers);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        // Save result to database
        await Quiz.submitResult(
            req.user.id,
            quizId,
            result.answers,
            result.score,
            100,
            timeSpent
        );

        res.json({ success: true, result });
    } catch (e) {
        console.error("Submit Error", e);
        res.status(500).json({ error: 'Erreur lors de la soumission.' });
    }
};

export const getUserResults = async (req, res) => {
    try {
        const results = await Quiz.getUserResults(req.user.id);
        res.json({ success: true, results });
    } catch (e) { res.status(500).json({ error: 'Erreur.' }); }
};

export const getUserProgress = async (req, res) => {
    try {
        const progress = await Quiz.getUserProgress(req.user.id);
        res.json({ success: true, progress });
    } catch (e) { res.status(500).json({ error: 'Erreur.' }); }
};