import Quiz from '../models/Quiz.js';

export const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        // Important : On récupère la difficulté passée dans l'URL (?difficulty=...)
        const { difficulty } = req.query; 
        
        const quiz = await Quiz.findById(id, difficulty);
        
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
        const quizzes = await Quiz.findAll(req.query);
        res.json({ success: true, quizzes });
    } catch (e) { res.status(500).json({ error: 'Erreur.' }); }
};

export const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers, timeSpent } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé.' });

        let correct = 0;
        const detailed = {};
        quiz.questions.forEach(q => {
            const isCorrect = String(answers[q.id]) === String(q.correct_answer);
            if (isCorrect) correct++;
            detailed[q.id] = { userAnswer: answers[q.id], correctAnswer: q.correct_answer, isCorrect };
        });

        const score = Math.round((correct / quiz.questions.length) * 100);
        await Quiz.submitResult(req.user.id, quizId, detailed, score, 100, timeSpent);

        res.json({ success: true, result: { score, totalQuestions: quiz.questions.length, correctAnswers: correct, answers: detailed } });
    } catch (e) { res.status(500).json({ error: 'Erreur.' }); }
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