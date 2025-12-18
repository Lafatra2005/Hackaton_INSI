import React, { useState, useRef } from 'react';
import { 
  Brain, 
  Link2, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Eye,
  EyeOff,
  Mic, // Icône Audio
  Video, // Icône Vidéo
  Upload, // Icône Upload
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analysisAPI } from '../services/api';

const Analysis = () => {
  const [contentType, setContentType] = useState('text');
  const [contentText, setContentText] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // Limite de 50MB par exemple
        toast.error('Le fichier est trop volumineux (max 50Mo)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    // Validation selon le type
    if (contentType === 'text' && !contentText.trim()) return toast.error('Veuillez entrer du texte');
    if (contentType === 'url' && !contentUrl.trim()) return toast.error('Veuillez entrer une URL');
    if ((contentType === 'audio' || contentType === 'video') && !selectedFile && !contentUrl.trim()) {
      return toast.error('Veuillez sélectionner un fichier ou entrer une URL');
    }

    setIsLoading(true);
    try {
      let response;
      
      // Si on a un fichier, on utilise FormData
      if (selectedFile && (contentType === 'audio' || contentType === 'video')) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', contentType);
        response = await analysisAPI.analyzeMediaFile(formData); // Note: Nouvelle méthode API à créer
      } else {
        // Analyse classique (texte ou URL)
        response = await analysisAPI.analyzeContent({
          contentType,
          contentText: contentType === 'text' ? contentText : undefined,
          contentUrl: (contentType === 'url' || contentType === 'audio' || contentType === 'video') ? contentUrl : undefined,
        });
      }

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
      case 'fiable': return <CheckCircle className="h-8 w-8 text-success-600" />;
      case 'douteux': return <AlertTriangle className="h-8 w-8 text-warning-600" />;
      case 'faux': return <XCircle className="h-8 w-8 text-danger-600" />;
      default: return <AlertTriangle className="h-8 w-8 text-gray-400" />;
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'fiable': return 'text-success-600 bg-success-50 border-success-200';
      case 'douteux': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'faux': return 'text-danger-600 bg-danger-50 border-danger-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Brain className="h-12 w-12 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyseur IA Multi-Format</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Détectez les deepfakes, les fake news et les manipulations dans les textes, images, audios et vidéos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenu à analyser</h2>

            {/* Content Type Selector */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'text', icon: FileText, label: 'Texte' },
                  { id: 'url', icon: Link2, label: 'Lien' },
                  { id: 'audio', icon: Mic, label: 'Audio' },
                  { id: 'video', icon: Video, label: 'Vidéo' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setContentType(type.id);
                      setSelectedFile(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center ${
                      contentType === type.id
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <type.icon className="h-4 w-4 mr-1.5" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Input based on selection */}
            <div className="space-y-4">
              {contentType === 'text' && (
                <div>
                  <label className="label">Texte à analyser</label>
                  <textarea
                    rows={8}
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    className="textarea"
                    placeholder="Collez le texte..."
                  />
                </div>
              )}

              {(contentType === 'url' || contentType === 'audio' || contentType === 'video') && (
                <div>
                  <label className="label">URL du contenu {contentType !== 'url' && `(${contentType})`}</label>
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              )}

              {(contentType === 'audio' || contentType === 'video') && (
                <div className="relative">
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-xs text-gray-400 uppercase">Ou importer un fichier</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  
                  {!selectedFile ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer bg-gray-50"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Cliquez pour sélectionner un fichier {contentType}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">MP3, WAV, MP4, MOV (max. 50Mo)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-center">
                        {contentType === 'audio' ? <Mic className="h-5 w-5 text-primary-600 mr-2" /> : <Video className="h-5 w-5 text-primary-600 mr-2" />}
                        <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-primary-100 rounded">
                        <X className="h-4 w-4 text-primary-600" />
                      </button>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept={contentType === 'audio' ? "audio/*" : "video/*"}
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full btn btn-primary mt-6"
            >
              {isLoading ? (
                <div className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Analyse en cours...</div>
              ) : (
                <div className="flex items-center space-x-2"><Brain className="h-5 w-5" /> <span>Lancer l'analyse intelligente</span></div>
              )}
            </button>
          </div>
        </div>

        {/* Results Section (Identique à votre code original) */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Résultat de l'analyse</h2>
            {!analysisResult ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Sélectionnez un média et lancez l'analyse pour voir les résultats</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border-2 ${getVerdictColor(analysisResult.verdict)}`}>
                  <div className="flex items-center space-x-3 mb-2">
                    {getVerdictIcon(analysisResult.verdict)}
                    <h3 className="text-xl font-bold capitalize">{analysisResult.verdict}</h3>
                  </div>
                  <p className="text-sm">{analysisResult.explanation}</p>
                </div>
                
                {/* Score et Détails... (le reste de votre logique de résultat) */}
                {/* ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;