import Quiz from '../models/Quiz.js';

export const getAllQuizzes = async (req, res) => {
    try {
        const { category, difficulty, language } = req.query;
        const filters = {};

        if (category) filters.category = category;
        if (difficulty) filters.difficulty = difficulty;
        if (language) filters.language = language;

        const quizzes = await Quiz.findAll(filters);

        res.json({
            success: true,
            quizzes
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des quiz:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz non trouvé.' });
        }

        res.json({
            success: true,
            quiz
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du quiz:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers, timeSpent = 0 } = req.body;
        const userId = req.user.id;

        // Récupérer le quiz avec les questions
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz non trouvé.' });
        }

        // Calculer le score
        let correctAnswers = 0;
        const detailedAnswers = {};

        quiz.questions.forEach(question => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correct_answer;
            
            if (isCorrect) {
                correctAnswers++;
            }

            detailedAnswers[question.id] = {
                userAnswer,
                correctAnswer: question.correct_answer,
                isCorrect,
                explanation: question.explanation
            };
        });

        const score = (correctAnswers / quiz.questions.length) * 100;
        const maxScore = 100;

        // Sauvegarder le résultat
        const result = await Quiz.submitResult(
            userId, 
            quizId, 
            detailedAnswers, 
            score, 
            maxScore, 
            timeSpent
        );

        res.json({
            success: true,
            result: {
                id: result.id,
                score: result.score,
                maxScore: result.max_score,
                correctAnswers,
                totalQuestions: quiz.questions.length,
                timeSpent: result.time_spent_seconds,
                completedAt: result.completed_at,
                answers: detailedAnswers
            }
        });
    } catch (error) {
        console.error('Erreur lors de la soumission du quiz:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const getUserResults = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20 } = req.query;

        const results = await Quiz.getUserResults(userId, parseInt(limit));

        res.json({
            success: true,
            results
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const progress = await Quiz.getUserProgress(userId);

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du progrès:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const createQuiz = async (req, res) => {
    try {
        // Seulement pour les admins et enseignants
        if (!['admin', 'enseignant'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Accès refusé.' });
        }

        const quiz = await Quiz.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            quiz
        });
    } catch (error) {
        console.error('Erreur lors de la création du quiz:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};