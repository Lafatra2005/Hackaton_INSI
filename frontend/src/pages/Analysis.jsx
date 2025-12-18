import React, { useState } from 'react';
import { 
  Brain, 
  Link2, 
  FileText, 
  Image,
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analysisAPI } from '../services/api';

const Analysis = () => {
  const [contentType, setContentType] = useState('text');
  const [contentText, setContentText] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = async () => {
    if (!contentText.trim() && !contentUrl.trim()) {
      toast.error('Veuillez entrer du contenu à analyser');
      return;
    }

    setIsLoading(true);
    try {
      const response = await analysisAPI.analyzeContent({
        contentType,
        contentText: contentType === 'text' ? contentText : undefined,
        contentUrl: contentType === 'url' ? contentUrl : undefined,
      });

      setAnalysisResult(response.data.analysis);
      toast.success('Analyse terminée avec succès !');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'fiable':
        return <CheckCircle className="h-8 w-8 text-success-600" />;
      case 'douteux':
        return <AlertTriangle className="h-8 w-8 text-warning-600" />;
      case 'faux':
        return <XCircle className="h-8 w-8 text-danger-600" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-gray-400" />;
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'fiable':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'douteux':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'faux':
        return 'text-danger-600 bg-danger-50 border-danger-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'bg-success-500';
    if (score >= 50) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Brain className="h-12 w-12 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analyseur IA de Contenu
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Notre intelligence artificielle analyse le contenu pour détecter les fake news, 
          évaluer la fiabilité des sources et vous fournir des explications détaillées.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contenu à analyser
            </h2>

            {/* Content Type Selector */}
            <div className="mb-6">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setContentType('text')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    contentType === 'text'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-1" />
                  Texte
                </button>
                <button
                  onClick={() => setContentType('url')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    contentType === 'url'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Link2 className="h-4 w-4 inline mr-1" />
                  URL
                </button>
              </div>
            </div>

            {/* Content Input */}
            {contentType === 'text' ? (
              <div className="mb-6">
                <label htmlFor="contentText" className="label">
                  Texte à analyser
                </label>
                <textarea
                  id="contentText"
                  rows={8}
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  className="textarea"
                  placeholder="Collez ou tapez le texte que vous souhaitez analyser..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {contentText.length}/5000 caractères
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <label htmlFor="contentUrl" className="label">
                  URL à analyser
                </label>
                <input
                  id="contentUrl"
                  type="url"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  className="input"
                  placeholder="https://exemple.com/article"
                />
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading || (!contentText.trim() && !contentUrl.trim())}
              className="w-full btn btn-primary"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyse en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Analyser le contenu</span>
                </div>
              )}
            </button>

            {/* Examples */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Exemples :</p>
              <div className="space-y-2">
                <button
                  onClick={() => setContentText(`Les vaccins COVID-19 contiennent des micro-puces pour contrôler la population. C'est une véritable révélation choquante qui a été cachée au public !`)}
                  className="block w-full text-left text-xs text-gray-500 hover:text-gray-700 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  Exemple de théorie du complot
                </button>
                <button
                  onClick={() => setContentText(`Selon une étude publiée dans le journal Nature, les changements climatiques ont un impact mesurable sur la biodiversité marine. Les chercheurs ont analysé 50 ans de données.`)}
                  className="block w-full text-left text-xs text-gray-500 hover:text-gray-700 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  Exemple d'information fiable
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Résultat de l'analyse
            </h2>

            {!analysisResult ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Analysez un contenu pour voir les résultats ici
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Verdict */}
                <div className={`p-4 rounded-lg border-2 ${getVerdictColor(analysisResult.verdict)}`}>
                  <div className="flex items-center space-x-3 mb-2">
                    {getVerdictIcon(analysisResult.verdict)}
                    <h3 className="text-xl font-bold capitalize">
                      {analysisResult.verdict}
                    </h3>
                  </div>
                  <p className="text-sm">
                    {analysisResult.explanation}
                  </p>
                </div>

                {/* Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Score de fiabilité</span>
                    <span className="text-sm font-bold text-gray-900">
                      {analysisResult.score}/100
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getScoreColor(analysisResult.score)}`}
                      style={{ width: `${analysisResult.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Analysis Details */}
                <div>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
                  >
                    <span>Détails de l'analyse</span>
                    {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  
                  {showDetails && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      {analysisResult.factors && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Facteurs analysés :</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {Object.entries(analysisResult.factors).map(([key, value]) => (
                              <li key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>{(value * 100).toFixed(0)}%</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysisResult.analysisDetails && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Métriques :</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span>Mots :</span>
                              <span>{analysisResult.analysisDetails.wordCount || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phrases :</span>
                              <span>{analysisResult.analysisDetails.sentenceCount || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sentiment :</span>
                              <span>{analysisResult.analysisDetails.sentimentScore || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <button className="flex-1 btn btn-outline">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Vérifier les sources
                  </button>
                  <button className="flex-1 btn btn-primary">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Analyser un autre
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-primary-600" />
            Conseils pour identifier les fake news
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Vérifiez la source</h4>
              <p className="text-sm text-gray-600">
                Privilégiez les sources reconnues et vérifiez l'URL du site.
              </p>
            </div>
            <div className="p-4 bg-warning-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Méfiez-vous des titres</h4>
              <p className="text-sm text-gray-600">
                Les titres sensationnalistes cherchent souvent à provoquer une réaction émotionnelle.
              </p>
            </div>
            <div className="p-4 bg-success-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Comparez les sources</h4>
              <p className="text-sm text-gray-600">
                Une information vraie est généralement relayée par plusieurs sources fiables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;