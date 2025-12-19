import ContentAnalysis from '../models/ContentAnalysis.js';
import AIAnalysisService from '../services/AIAnalysisService.js';

export const analyzeContent = async (req, res) => {
    try {
        const { contentText, contentUrl, contentType } = req.body;
        const userId = req.user ? req.user.id : null;

        let analysisResult;

        if (contentType === 'url' && contentUrl) {
            analysisResult = await AIAnalysisService.analyzeURL(contentUrl);
        } else if (contentType === 'video' && contentUrl) {
            analysisResult = await AIAnalysisService.analyzeURL(contentUrl);
        } else if (contentType === 'text' && contentText) {
            analysisResult = await AIAnalysisService.analyzeText(contentText);
        } else if (contentType === 'image' && contentUrl) {
            analysisResult = await AIAnalysisService.analyzeImage(contentUrl);
        } else {
            return res.status(400).json({ error: 'Type de contenu ou données invalides.' });
        }

        let savedAnalysis = null;
        if (userId && !analysisResult.isIrrelevant) { 
            try {
                const factCheckSources = await AIAnalysisService.crossCheckWithTrustedSources(
                    contentText || contentUrl || ''
                );

                savedAnalysis = await ContentAnalysis.create({
                    userId,
                    contentUrl: contentUrl || null,
                    contentText: contentText || null,
                    contentType,
                    aiScore: analysisResult.score,
                    aiVerdict: analysisResult.verdict,
                    aiExplanation: analysisResult.explanation,
                    reliabilityFactors: analysisResult.factors,
                    biasIndicators: analysisResult.biasIndicators,
                    factCheckSources
                });
            } catch (saveError) {
                console.error('Erreur lors de la sauvegarde de l analyse:', saveError);
            }
        }

        res.json({
            success: true,
            analysis: {
                score: analysisResult.score,
                verdict: analysisResult.verdict,
                explanation: analysisResult.explanation,
                factors: analysisResult.factors,
                biasIndicators: analysisResult.biasIndicators,
                analysisDetails: analysisResult.analysisDetails || null,
                savedAnalysisId: savedAnalysis ? savedAnalysis.id : null
            }
        });
    } catch (error) {
        console.error('Erreur lors de l analyse:', error);
        res.status(500).json({
            error: 'Erreur serveur lors de l analyse du contenu.',
            details: error.message
        });
    }
};

export const getUserAnalyses = async (req, res) => {
    try {
        let { limit = 20, offset = 0 } = req.query;
        const userId = req.user.id;

        limit = parseInt(limit);
        offset = parseInt(offset);

        if (isNaN(limit) || limit < 1) limit = 20;
        if (isNaN(offset) || offset < 0) offset = 0;

        const analyses = await ContentAnalysis.findByUserId(userId, limit, offset);

        res.json({
            success: true,
            analyses,
            pagination: {
                limit,
                offset,
                count: analyses.length
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des analyses:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const getAnalysisById = async (req, res) => {
    try {
        const { id } = req.params;
        const analysis = await ContentAnalysis.findById(id);

        if (!analysis) {
            return res.status(404).json({ error: 'Analyse non trouvée.' });
        }

        if (req.user.role !== 'admin' && analysis.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Accès refusé.' });
        }

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l analyse:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const getAllAnalyses = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès refusé.' });
        }

        let { limit = 50, offset = 0 } = req.query;

        limit = parseInt(limit);
        offset = parseInt(offset);

        if (isNaN(limit) || limit < 1) limit = 50;
        if (isNaN(offset) || offset < 0) offset = 0;

        const analyses = await ContentAnalysis.getAll(limit, offset);

        res.json({
            success: true,
            analyses,
            pagination: {
                limit,
                offset,
                count: analyses.length
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des analyses:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

export const getAnalysisStats = async (req, res) => {
    try {
        const verdictStats = await ContentAnalysis.getStatsByVerdict();
        const dailyStats = await ContentAnalysis.getDailyStats(7);

        res.json({
            success: true,
            stats: {
                verdicts: verdictStats,
                daily: dailyStats
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};