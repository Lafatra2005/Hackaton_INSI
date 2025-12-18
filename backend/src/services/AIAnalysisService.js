import nlp from 'compromise';
import Sentiment from 'sentiment';
import stringSimilarity from 'string-similarity';
import axios from 'axios';
import * as cheerio from 'cheerio';
import TrustedSource from '../models/TrustedSource.js';

const sentiment = new Sentiment();

class AIAnalysisService {
    static async analyzeText(text) {
        const factors = {
            sensationalism: 0,
            emotionalLanguage: 0,
            factualClaims: 0,
            sourceMention: 0,
            grammarQuality: 0,
            clickbaitIndicators: 0
        };

        const biasIndicators = {
            politicalBias: 'neutral',
            sensationalWords: [],
            emotionalWords: [],
            unsupportedClaims: []
        };

        // Analyse du sentiment
        const sentimentResult = sentiment.analyze(text);
        factors.emotionalLanguage = Math.min(Math.abs(sentimentResult.score) / 10, 1);

        // Recherche de mots sensationnalistes
        const sensationalWords = [
            'choquant', 'incroyable', 'époustouflant', 'révolutionnaire', 'scandale',
            'urgent', 'exclusif', 'briseur', 'sensationnel', 'dramatique',
            'catastrophe', 'désastreux', 'honteux', 'terrifiant', 'effrayant'
        ];

        const foundSensationalWords = sensationalWords.filter(word => 
            text.toLowerCase().includes(word.toLowerCase())
        );
        biasIndicators.sensationalWords = foundSensationalWords;
        factors.sensationalism = Math.min(foundSensationalWords.length / 3, 1);

        // Analyse grammaticale basique
        const doc = nlp(text);
        const sentences = doc.sentences().out('array');
        
        // Comptons les phrases avec des majuscules excessives (signe de clickbait)
        const excessiveCaps = (text.match(/[A-Z]{4,}/g) || []).length;
        factors.clickbaitIndicators = Math.min(excessiveCaps / 5, 1);

        // Recherche de mentions de sources
        const sourceKeywords = ['selon', 'source:', 'd après', 'rapporte', 'étude', 'recherche'];
        factors.sourceMention = sourceKeywords.some(keyword => 
            text.toLowerCase().includes(keyword.toLowerCase())
        ) ? 0.8 : 0;

        // Calcul du score de fiabilité (0-100)
        let reliabilityScore = 50; // Score de base

        // Pénalités
        reliabilityScore -= factors.sensationalism * 25;
        reliabilityScore -= factors.emotionalLanguage * 15;
        reliabilityScore -= factors.clickbaitIndicators * 20;

        // Bonus
        reliabilityScore += factors.sourceMention * 20;

        // Limite entre 0 et 100
        reliabilityScore = Math.max(0, Math.min(100, reliabilityScore));

        // Classification
        let verdict = 'douteux';
        if (reliabilityScore >= 75) verdict = 'fiable';
        else if (reliabilityScore <= 35) verdict = 'faux';

        const explanation = this.generateExplanation(reliabilityScore, factors, biasIndicators);

        return {
            score: Math.round(reliabilityScore * 100) / 100,
            verdict,
            explanation,
            factors,
            biasIndicators,
            analysisDetails: {
                sentimentScore: sentimentResult.score,
                wordCount: text.split(' ').length,
                sentenceCount: sentences.length
            }
        };
    }

    static async analyzeURL(url) {
        try {
            // Vérifier d'abord si c'est une source fiable
            const sourceCheck = await TrustedSource.verifySource(url);
            
            if (sourceCheck.isTrusted) {
                return {
                    score: sourceCheck.reliabilityScore * 100,
                    verdict: 'fiable',
                    explanation: `Cette source est répertoriée comme fiable dans notre base de données : ${sourceCheck.source.name}`,
                    factors: { knownSource: 1 },
                    biasIndicators: { knownSource: true },
                    sourceInfo: sourceCheck.source
                };
            }

            // Récupérer le contenu de la page
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; EducationAI/1.0)'
                }
            });

            const $ = cheerio.load(response.data);
            
            // Extraire le titre et le contenu principal
            const title = $('title').text() || $('h1').first().text() || '';
            const description = $('meta[name="description"]').attr('content') || '';
            const content = $('article').text() || $('main').text() || $('body').text();
            
            // Analyser le contenu
            const textAnalysis = await this.analyzeText(`${title} ${description} ${content}`.substring(0, 2000));

            // Vérifier le domaine
            const domain = new URL(url).hostname;
            const suspiciousDomains = ['.wordpress.com', '.blogspot.com', 'facebook.com', 'twitter.com'];
            const isSuspiciousDomain = suspiciousDomains.some(d => domain.includes(d));

            if (isSuspiciousDomain) {
                textAnalysis.score -= 15;
                textAnalysis.factors.suspiciousDomain = 1;
            }

            return {
                ...textAnalysis,
                url,
                title,
                domain,
                scrapedContent: content.substring(0, 500)
            };

        } catch (error) {
            return {
                score: 30,
                verdict: 'douteux',
                explanation: `Impossible d analyser le contenu de l URL : ${error.message}`,
                factors: { inaccessible: 1 },
                biasIndicators: { inaccessible: true },
                error: error.message
            };
        }
    }

    static async crossCheckWithTrustedSources(claim) {
        try {
            const trustedSources = await TrustedSource.findAll({ isVerified: true });
            const matches = [];

            for (const source of trustedSources.slice(0, 5)) { // Limiter à 5 sources
                try {
                    // Recherche simplifiée - en production, utiliser une API de recherche
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(claim + ' site:' + new URL(source.url).hostname)}`;
                    matches.push({
                        source: source.name,
                        url: source.url,
                        relevance: 0.6 + (Math.random() * 0.3) // Simulation
                    });
                } catch (e) {
                    // Ignorer les erreurs de recherche
                }
            }

            return matches.sort((a, b) => b.relevance - a.relevance);
        } catch (error) {
            return [];
        }
    }

    static generateExplanation(score, factors, biasIndicators) {
        if (score >= 75) {
            return "Cette information semble fiable. Elle présente des caractéristiques d'un contenu de qualité : ton mesuré, sources mentionnées, et formulation équilibrée.";
        } else if (score >= 50) {
            return "Cette information est douteuse. Elle présente certains signaux d'alerte comme un langage émotionnel ou des formulations sensationnalistes. Nous recommandons une vérification croisée.";
        } else {
            let reasons = [];
            if (factors.sensationalism > 0.5) reasons.push("langage sensationnaliste");
            if (factors.emotionalLanguage > 0.5) reasons.push("ton émotionnel excessif");
            if (factors.clickbaitIndicators > 0.3) reasons.push("techniques de clickbait");
            if (factors.sourceMention < 0.5) reasons.push("absence de sources");

            return `Cette information semble peu fiable pour les raisons suivantes : ${reasons.join(', ')}. Nous recommandons de ne pas la partager sans vérification approfondie.`;
        }
    }

    static async analyzeImage(imageUrl) {
        // En production, intégrer avec une API de reverse image search
        // ou un service de vérification d'images
        return {
            score: 50,
            verdict: 'douteux',
            explanation: "L'analyse d'images nécessite une intégration avec des services spécialisés. Cette fonctionnalité est en cours de développement.",
            factors: { imageAnalysis: 0 },
            biasIndicators: { imageAnalysis: false }
        };
    }
}

export default AIAnalysisService;