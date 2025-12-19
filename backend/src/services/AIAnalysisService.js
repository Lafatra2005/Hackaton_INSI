import nlp from 'compromise';
import Sentiment from 'sentiment';
import stringSimilarity from 'string-similarity';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { HfInference } from '@huggingface/inference';
import TrustedSource from '../models/TrustedSource.js';

const sentiment = new Sentiment();

// Lazy initialization for HfInference to ensure dotenv is loaded
let hf;

class AIAnalysisService {
    /**
     * Helper to classify text using Hugging Face models
     * @param {string} text - The text to analyze
     */
    static async analyzeWithHF(text) {
        try {
            if (!process.env.HF_TOKEN) {
                console.warn('HF_TOKEN not found, skipping ML analysis');
                return null;
            }

            // Initialize client if not exists
            if (!hf) {
                hf = new HfInference(process.env.HF_TOKEN);
            }

            // Clean text for better inference
            const cleanText = text.substring(0, 512);

            // 1. Zero-Shot Classification (More robust/available than specific fine-tunes)
            // We use standard BART-large-mnli which is almost always available
            const zeroShotResult = await hf.zeroShotClassification({
                model: 'facebook/bart-large-mnli',
                inputs: cleanText,
                parameters: { candidate_labels: ['reliable fact-based news', 'fake news formulation', 'emotional opinion', 'satire'] }
            });

            // 2. Sentiment/Bias Model (keeping this as it's standard)
            // If this fails, we catch the error below, so it's safer
            let sentimentResult = null;
            try {
                sentimentResult = await hf.textClassification({
                    model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
                    inputs: cleanText
                });
            } catch (err) {
                console.warn('Sentiment model failed, continuing with just zero-shot', err.message);
            }

            // Process Scores
            // zeroShotResult.labels and zeroShotResult.scores are aligned arrays
            const getScore = (label) => {
                const index = zeroShotResult.labels.indexOf(label);
                return index !== -1 ? zeroShotResult.scores[index] : 0;
            };

            const reliableScore = getScore('reliable fact-based news');
            const fakeScore = getScore('fake news formulation');

            // Calculate final ML reliability score (0-1)
            // We prioritize reliable score but penalize for fake signals
            let mlScore = reliableScore;

            // If fake score is significantly higher, pull it down
            if (fakeScore > reliableScore) {
                mlScore = 1 - fakeScore;
            }

            // Process Sentiment if available
            let sentimentLabel = 'neutral';
            if (sentimentResult) {
                const topSentiment = sentimentResult.reduce((prev, current) =>
                    (prev.score > current.score) ? prev : current
                );
                sentimentLabel = topSentiment.label;
            }

            return {
                mlScore: mlScore, // 0-1
                mlConfidence: Math.max(reliableScore, fakeScore), // How sure the model is of its main decision
                sentiment: sentimentLabel,
                classification: zeroShotResult.labels[0], // Top category
                rawResults: {
                    zeroShot: zeroShotResult,
                    sentiment: sentimentResult
                }
            };

        } catch (error) {
            console.error('Hugging Face Inference Error:', error.message);
            return null; // Fallback to heuristics
        }
    }

    static async analyzeText(text) {
        const startTime = Date.now();
        // --- Heuristics Analysis (Legacy) ---
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

        // Sentiment Analysis (Heuristic)
        const sentimentResult = sentiment.analyze(text);
        factors.emotionalLanguage = Math.min(Math.abs(sentimentResult.score) / 10, 1);

        // Sensational Words
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

        // Grammar/Caps Check
        const excessiveCaps = (text.match(/[A-Z]{4,}/g) || []).length;
        factors.clickbaitIndicators = Math.min(excessiveCaps / 5, 1);

        // Source Mentions
        const sourceKeywords = ['selon', 'source:', 'd\'après', 'rapporte', 'étude', 'recherche', 'afp', 'reuters'];
        factors.sourceMention = sourceKeywords.some(keyword =>
            text.toLowerCase().includes(keyword.toLowerCase())
        ) ? 0.8 : 0;

        // Calculate Heuristic Score (0-100)
        let heuristicScore = 50;
        heuristicScore -= factors.sensationalism * 25;
        heuristicScore -= factors.emotionalLanguage * 15;
        heuristicScore -= factors.clickbaitIndicators * 20;
        heuristicScore += factors.sourceMention * 20;
        heuristicScore = Math.max(0, Math.min(100, heuristicScore));

        // --- ML Analysis (Hugging Face) ---
        const mlResult = await this.analyzeWithHF(text);

        let finalScore = heuristicScore;
        let usedML = false;

        if (mlResult) {
            usedML = true;
            // Normalize ML score (0-1) to (0-100)
            const mlScore100 = mlResult.mlScore * 100;

            // Combine: Heuristics 40% + ML 60% (giving more weight to ML if available)
            // Or as requested: average match
            finalScore = (heuristicScore + mlScore100) / 2;

            // Adjust bias indicators based on ML sentiment
            if (mlResult.sentiment === 'negative' && factors.emotionalLanguage < 0.5) {
                factors.emotionalLanguage = 0.6; // Bump up if ML detects negativity
            }
        }

        // Final Verdict
        let verdict = 'douteux';
        if (finalScore >= 75) verdict = 'fiable';
        else if (finalScore <= 35) verdict = 'faux';

        // Specific Heuristic Warnings (moved here to be available for details)
        const warnings = [];
        if (factors.sensationalism > 0.5) warnings.push("langage sensationnaliste");
        if (factors.emotionalLanguage > 0.6) warnings.push("ton émotionnel excessif");
        if (factors.sourceMention < 0.1) warnings.push("absence de sources citées");
        if (factors.clickbaitIndicators > 0.3) warnings.push("titre 'clickbait'");

        // Generate Explanation
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
                source_reliability: null, // This field is more relevant for analyzeURL
                issues_detected: warnings.length > 0 ? warnings : ['Aucun problème majeur détecté'],
                recommendations: finalScore < 50 ? "Nous recommandons de vérifier cette information avec d'autres sources fiables." : "Cette analyse semble fiable, mais restez vigilant."
            }
        };
    }

    /**
     * Helper to validate URL before processing
     * @param {string} url 
     */
    static validateURL(url) {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname.toLowerCase();
            const path = urlObj.pathname.toLowerCase();

            // 1. Blocklist of non-news/irrelevant domains
            const blocklist = [
                'github.com', 'gitlab.com', 'bitbucket.org', 'sourceforge.net',
                'stackoverflow.com', 'npmjs.com', 'pypi.org',
                'linkedin.com', 'facebook.com', 'twitter.com', 'instagram.com',
                'youtube.com', 'tiktok.com', // Video platforms require different handling
                'localhost', '127.0.0.1'
            ];

            if (blocklist.some(d => domain.includes(d))) {
                return {
                    isValid: false,
                    reason: "Ce type de lien (réseaux sociaux, code, plateforme technique) n'est pas pris en charge pour l'analyse de fake news."
                };
            }

            // 2. Extension Check
            const ignoredExtensions = [
                '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
                '.zip', '.rar', '.tar', '.gz', '.7z',
                '.exe', '.apk', '.dmg', '.iso',
                '.jpg', '.jpeg', '.png', '.gif', '.svg', // Images should use analyzeImage
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
     * Helper to validate scraped content
     * @param {string} content 
     */
    static validateContent(content) {
        if (!content || content.length < 200) {
            return {
                isValid: false,
                reason: "Le contenu récupéré est trop court pour une analyse fiable (moins de 200 caractères)."
            };
        }

        // Check for code density (if > 30% of lines end with ; { } or look like code)
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
            // 0. Pre-validation
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

            // 1. Trusted Source Check
            const sourceCheck = await TrustedSource.verifySource(url);

            // Si la source est dans la liste de confiance
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

            // 2. Scrape Content
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; EducationAI-Bot/1.0)'
                }
            });

            const $ = cheerio.load(response.data);

            const title = $('title').text() || $('h1').first().text() || '';
            const description = $('meta[name="description"]').attr('content') || '';

            // Improve content extraction
            // Remove scripts, styles, navs to get clean text
            $('script, style, nav, footer, header, aside, code, pre').remove(); // Added code, pre removal
            const content = $('article').text() || $('main').text() || $('body').text();

            const fullText = `${title}. ${description}. ${content}`.replace(/\s+/g, ' ').trim();

            // 3. Post-validation (Content)
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

            // 4. Analyze Content (Heuristic + ML)
            const textAnalysis = await this.analyzeText(fullText.substring(0, 3000));

            // 5. Domain Reputation Check
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

            // In a real scenario, integrate with Google Custom Search API or similar
            // Here we verify if we can find similar keywords in our trusted sources' RSS feeds or stored headers
            // For now, keeping the simulation but making it clear

            for (const source of trustedSources.slice(0, 5)) {
                try {
                    // Simulating a search query structure
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(claim + ' site:' + new URL(source.url).hostname)}`;
                    matches.push({
                        source: source.name,
                        url: source.url,
                        searchLink: searchUrl,
                        relevance: 0.5 // Default relevance as we can't really check without an API key
                    });
                } catch (e) {
                    // Ignore
                }
            }

            return matches;
        } catch (error) {
            return [];
        }
    }

    static generateExplanation(score, factors, biasIndicators, usedML, mlResult, warnings = []) {
        let text = "";

        // Introduction based on verdict
        if (score >= 75) {
            text = "✅ Cette information semble FIABLE. ";
        } else if (score >= 40) {
            text = "⚠️ Cette information est DOUTEUSE. ";
        } else {
            text = "❌ Cette information est probablement FAUSSE. ";
        }

        // ML Insight
        if (usedML && mlResult) {
            text += `Notre intelligence artificielle a analysé le texte avec une confiance de ${Math.round(mlResult.mlConfidence * 100)}%. `;
            if (mlResult.mlScore > 0.8) text += "Le modèle identifie ce contenu comme factuel et informatif. ";
            else if (mlResult.mlScore < 0.2) text += "Le modèle a détecté de forts signaux de désinformation. ";
        }

        // Specific Heuristic Warnings
        if (warnings.length > 0) {
            text += `Nous avons détecté : ${warnings.join(', ')}. `;
        } else if (score >= 75) {
            text += "Le ton est neutre et factuel. ";
        }

        // Recommendation
        if (score < 50) {
            text += "Nous recommandons fortement de vérifier cette information avec d'autres sources.";
        }

        return text;
    }

    static async analyzeImage(imageUrl) {
        // Future integration: Google Vision API or similar
        return {
            score: 50, // Neutral
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