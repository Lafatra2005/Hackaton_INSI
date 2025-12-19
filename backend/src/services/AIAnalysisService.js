import nlp from 'compromise';
import Sentiment from 'sentiment';
import stringSimilarity from 'string-similarity';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { HfInference } from '@huggingface/inference';
import TrustedSource from '../models/TrustedSource.js';

const sentiment = new Sentiment();
let hf;

class AIAnalysisService {
    /**
     * @param {string} text 
     */
    static async analyzeWithHF(text) {
        try {
            if (!process.env.HF_TOKEN) {
                console.warn('HF_TOKEN not found, skipping ML analysis');
                return null;
            }

            if (!hf) {
                hf = new HfInference(process.env.HF_TOKEN);
            }

            const cleanText = text.substring(0, 512);

            const zeroShotResult = await hf.zeroShotClassification({
                model: 'facebook/bart-large-mnli',
                inputs: cleanText,
                parameters: { candidate_labels: ['reliable fact-based news', 'fake news formulation', 'emotional opinion', 'satire'] }
            });

            let sentimentResult = null;
            try {
                sentimentResult = await hf.textClassification({
                    model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
                    inputs: cleanText
                });
            } catch (err) {
                console.warn('Sentiment model failed, continuing with just zero-shot', err.message);
            }

            const getScore = (label) => {
                const index = zeroShotResult.labels.indexOf(label);
                return index !== -1 ? zeroShotResult.scores[index] : 0;
            };

            const reliableScore = getScore('reliable fact-based news');
            const fakeScore = getScore('fake news formulation');
            let mlScore = reliableScore;

            if (fakeScore > reliableScore) {
                mlScore = 1 - fakeScore;
            }

            let sentimentLabel = 'neutral';
            if (sentimentResult) {
                const topSentiment = sentimentResult.reduce((prev, current) =>
                    (prev.score > current.score) ? prev : current
                );
                sentimentLabel = topSentiment.label;
            }

            return {
                mlScore: mlScore, 
                mlConfidence: Math.max(reliableScore, fakeScore), 
                sentiment: sentimentLabel,
                classification: zeroShotResult.labels[0], 
                rawResults: {
                    zeroShot: zeroShotResult,
                    sentiment: sentimentResult
                }
            };

        } catch (error) {
            console.error('Hugging Face Inference Error:', error.message);
            return null;
        }
    }

    static async analyzeText(text) {
        const startTime = Date.now();
        
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

        
        const sentimentResult = sentiment.analyze(text);
        factors.emotionalLanguage = Math.min(Math.abs(sentimentResult.score) / 10, 1);

        const sensationalWords = [
            'choquant', 'incroyable', 'époustouflant', 'révolutionnaire', 'scandale',
            'urgent', 'exclusif', 'briseur', 'sensationnel', 'dramatique',
            'catastrophe', 'désastreux', 'honteux', 'terrifiant', 'effrayant',
            'complot', 'mensonge', 'secret qu\'on vous cache'
        ];

        const foundSensationalWords = sensationalWords.filter(word =>
            text.toLowerCase().includes(word.toLowerCase())
        );
        biasIndicators.sensationalWords = foundSensationalWords;
        factors.sensationalism = Math.min(foundSensationalWords.length / 3, 1);

        const excessiveCaps = (text.match(/[A-Z]{4,}/g) || []).length;
        factors.clickbaitIndicators = Math.min(excessiveCaps / 5, 1);

        const sourceKeywords = ['selon', 'source:', 'd\'après', 'rapporte', 'étude', 'recherche', 'afp', 'reuters'];
        factors.sourceMention = sourceKeywords.some(keyword =>
            text.toLowerCase().includes(keyword.toLowerCase())
        ) ? 0.8 : 0;

        let heuristicScore = 50;
        heuristicScore -= factors.sensationalism * 25;
        heuristicScore -= factors.emotionalLanguage * 15;
        heuristicScore -= factors.clickbaitIndicators * 20;
        heuristicScore += factors.sourceMention * 20;
        heuristicScore = Math.max(0, Math.min(100, heuristicScore));

        const mlResult = await this.analyzeWithHF(text);

        let finalScore = heuristicScore;
        let usedML = false;

        if (mlResult) {
            usedML = true;
            const mlScore100 = mlResult.mlScore * 100;
            finalScore = (heuristicScore + mlScore100) / 2;

            if (mlResult.sentiment === 'negative' && factors.emotionalLanguage < 0.5) {
                factors.emotionalLanguage = 0.6; 
            }
        }

        let verdict = 'douteux';
        if (finalScore >= 75) verdict = 'fiable';
        else if (finalScore <= 35) verdict = 'faux';

        const warnings = [];
        if (factors.sensationalism > 0.5) warnings.push("langage sensationnaliste");
        if (factors.emotionalLanguage > 0.6) warnings.push("ton émotionnel excessif");
        if (factors.sourceMention < 0.1) warnings.push("absence de sources citées");
        if (factors.clickbaitIndicators > 0.3) warnings.push("titre 'clickbait'");

        const explanation = this.generateExplanation(finalScore, factors, biasIndicators, usedML, mlResult, warnings);

        return {
            score: Math.round(finalScore * 100) / 100,
            verdict,
            explanation,
            factors,
            biasIndicators,
            confidence_score: mlResult ? mlResult.mlConfidence : (finalScore / 100),
            analysis_time_ms: Date.now() - startTime,
            details: {
                source_reliability: null,
                issues_detected: warnings.length > 0 ? warnings : ['Aucun problème majeur détecté'],
                recommendations: finalScore < 50 ? "Nous recommandons de vérifier cette information avec d'autres sources fiables." : "Cette analyse semble fiable, mais restez vigilant."
            }
        };
    }

    /**
     
     * @param {string} url 
     */
    static validateURL(url) {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname.toLowerCase();
            const path = urlObj.pathname.toLowerCase();

            const blocklist = [
                'github.com', 'gitlab.com', 'bitbucket.org', 'sourceforge.net',
                'stackoverflow.com', 'npmjs.com', 'pypi.org',
                'linkedin.com', 'facebook.com', 'twitter.com', 'instagram.com',
                'youtube.com', 'tiktok.com', 
                'localhost', '127.0.0.1'
            ];

            if (blocklist.some(d => domain.includes(d))) {
                return {
                    isValid: false,
                    reason: "Ce type de lien (réseaux sociaux, code, plateforme technique) n'est pas pris en charge pour l'analyse de fake news."
                };
            }

            const ignoredExtensions = [
                '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
                '.zip', '.rar', '.tar', '.gz', '.7z',
                '.exe', '.apk', '.dmg', '.iso',
                '.jpg', '.jpeg', '.png', '.gif', '.svg', 
                '.mp3', '.mp4', '.avi', '.mov',
                '.css', '.js', '.json', '.xml', '.sql', '.git'
            ];

            if (ignoredExtensions.some(ext => path.endsWith(ext))) {
                return {
                    isValid: false,
                    reason: "Le format de fichier n'est pas supporté (seuls les articles web HTML sont analysés)."
                };
            }

            return { isValid: true };
        } catch (e) {
            return { isValid: false, reason: "URL invalide." };
        }
    }

    /**
     
     * @param {string} content 
     */
    static validateContent(content) {
        if (!content || content.length < 200) {
            return {
                isValid: false,
                reason: "Le contenu récupéré est trop court pour une analyse fiable (moins de 200 caractères)."
            };
        }

        const lines = content.split('\n');
        const codeLines = lines.filter(line =>
            line.trim().endsWith(';') ||
            line.trim().endsWith('{') ||
            line.trim().endsWith('}') ||
            line.includes('function') ||
            line.includes('const ') ||
            line.includes('import ')
        ).length;

        if (lines.length > 5 && (codeLines / lines.length) > 0.3) {
            return {
                isValid: false,
                reason: "Le contenu ressemble à du code informatique ou une documentation technique, non pertinent pour la détection de fake news."
            };
        }

        return { isValid: true };
    }

    static async analyzeURL(url) {
        const startTime = Date.now();
        try {
            const validation = this.validateURL(url);
            if (!validation.isValid) {
                return {
                    score: 0,
                    verdict: 'non pertinent',
                    explanation: validation.reason,
                    factors: { irrelevant: 1 },
                    biasIndicators: { irrelevant: true },
                    isIrrelevant: true,
                    confidence_score: 0,
                    analysis_time_ms: Date.now() - startTime,
                    details: {
                        source_reliability: null,
                        issues_detected: ['URL non pertinente'],
                        recommendations: "Veuillez fournir une URL d'article de presse valide."
                    }
                };
            }

            const sourceCheck = await TrustedSource.verifySource(url);

            if (sourceCheck && sourceCheck.isTrusted) {
                return {
                    score: 95 + (Math.random() * 5),
                    verdict: 'fiable',
                    explanation: `Cette source est identifiée comme fiable dans notre base de données vérifiée.`,
                    factors: { sourceFromTrustedList: 1 },
                    biasIndicators: {},
                    confidence_score: sourceCheck.source.trust_score / 100,
                    analysis_time_ms: Date.now() - startTime,
                    details: {
                        source_reliability: sourceCheck.source.trust_score / 100,
                        issues_detected: [],
                        recommendations: "Cette source est reconnue comme fiable. Vous pouvez consulter l'article en toute confiance."
                    }
                };
            }

            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; EducationAI-Bot/1.0)'
                }
            });

            const $ = cheerio.load(response.data);

            const title = $('title').text() || $('h1').first().text() || '';
            const description = $('meta[name="description"]').attr('content') || '';

            $('script, style, nav, footer, header, aside, code, pre').remove(); // Added code, pre removal
            const content = $('article').text() || $('main').text() || $('body').text();

            const fullText = `${title}. ${description}. ${content}`.replace(/\s+/g, ' ').trim();

            const contentValidation = this.validateContent(content); // Check body content mainly
            if (!contentValidation.isValid) {
                return {
                    score: 0,
                    verdict: 'non pertinent',
                    explanation: contentValidation.reason,
                    factors: { insufficientContent: 1 },
                    biasIndicators: {},
                    isIrrelevant: true
                };
            }

            const textAnalysis = await this.analyzeText(fullText.substring(0, 3000));

            const domain = new URL(url).hostname;
            const suspiciousDomains = ['.wordpress.com', '.blogspot.com', 'foireux.com']; // Add real ones
            const isSuspiciousDomain = suspiciousDomains.some(d => domain.includes(d));

            if (isSuspiciousDomain) {
                textAnalysis.score -= 20;
                textAnalysis.factors.suspiciousDomain = 1;
                textAnalysis.explanation += " Attention : Le domaine est hébergé sur une plateforme de blog gratuite souvent utilisée pour la désinformation.";
            }

            return {
                ...textAnalysis,
                url,
                title,
                domain,
                scrapedContent: content.substring(0, 500) + '...'
            };

        } catch (error) {
            console.error("Error analyzing URL:", error);
            console.error("Error analyzing URL:", error);
            return {
                score: 30,
                verdict: 'douteux',
                explanation: `Impossible d'analyser le contenu de l'URL directement. Erreur: ${error.message}`,
                factors: { inaccessible: 1 },
                biasIndicators: { inaccessible: true },
                error: error.message,
                confidence_score: 0,
                analysis_time_ms: Date.now() - startTime,
                details: {
                    source_reliability: null,
                    issues_detected: ['Erreur technique lors de l\'analyse'],
                    recommendations: "Essayez de copier-coller le texte de l'article."
                }
            };
        }
    }

    static async crossCheckWithTrustedSources(claim) {
        try {
            const trustedSources = await TrustedSource.findAll({ isVerified: true });
            const matches = [];


            for (const source of trustedSources.slice(0, 5)) {
                try {
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(claim + ' site:' + new URL(source.url).hostname)}`;
                    matches.push({
                        source: source.name,
                        url: source.url,
                        searchLink: searchUrl,
                        relevance: 0.5 
                    });
                } catch (e) {
                    
                }
            }

            return matches;
        } catch (error) {
            return [];
        }
    }

    static generateExplanation(score, factors, biasIndicators, usedML, mlResult, warnings = []) {
        let text = "";

      
        if (score >= 75) {
            text = "✅ Cette information semble FIABLE. ";
        } else if (score >= 40) {
            text = "⚠️ Cette information est DOUTEUSE. ";
        } else {
            text = "❌ Cette information est probablement FAUSSE. ";
        }

        if (usedML && mlResult) {
            text += `Notre intelligence artificielle a analysé le texte avec une confiance de ${Math.round(mlResult.mlConfidence * 100)}%. `;
            if (mlResult.mlScore > 0.8) text += "Le modèle identifie ce contenu comme factuel et informatif. ";
            else if (mlResult.mlScore < 0.2) text += "Le modèle a détecté de forts signaux de désinformation. ";
        }
        if (warnings.length > 0) {
            text += `Nous avons détecté : ${warnings.join(', ')}. `;
        } else if (score >= 75) {
            text += "Le ton est neutre et factuel. ";
        }
        if (score < 50) {
            text += "Nous recommandons fortement de vérifier cette information avec d'autres sources.";
        }

        return text;
    }

    static async analyzeImage(imageUrl) {
        
        return {
            score: 50, 
            verdict: 'douteux',
            explanation: "L'analyse d'images n'est pas encore connectée à nos modèles de Deep Learning.",
            factors: { imageAnalysis: 0 },
            biasIndicators: {},
            confidence_score: 0.5,
            analysis_time_ms: 100,
            details: {
                source_reliability: null,
                issues_detected: ["Analyse d'image non supportée (prototype)"],
                recommendations: "L'analyse d'image sera disponible dans la version finale."
            }
        };
    }
}

export default AIAnalysisService;