import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  Image,
  Video,
  Upload,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analysisAPI } from '../services/api';

const Analysis = () => {
  const { t } = useTranslation();
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
      if (file.size > 50 * 1024 * 1024) {
        toast.error(t('analysis.error.fileTooLarge'));
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (contentType === 'text' && !contentText.trim()) return toast.error(t('analysis.error.noText'));
    if (contentType === 'url' && !contentUrl.trim()) return toast.error(t('analysis.error.noUrl'));
    if ((contentType === 'image' || contentType === 'video') && !selectedFile && !contentUrl.trim()) {
      return toast.error(t('analysis.error.noFileOrUrl'));
    }

    setIsLoading(true);
    try {
      let response;
      
      if (selectedFile && (contentType === 'image' || contentType === 'video')) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', contentType);
        response = await analysisAPI.analyzeMediaFile(formData);
      } else {
        response = await analysisAPI.analyzeContent({
          contentType,
          contentText: contentType === 'text' ? contentText : undefined,
          contentUrl: (contentType === 'url' || contentType === 'image' || contentType === 'video') ? contentUrl : undefined,
        });
      }

      setAnalysisResult(response.data.analysis);
      toast.success(t('analysis.success'));
    } catch (error) {
      toast.error(error.response?.data?.error || t('analysis.error.generic'));
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('analysis.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('analysis.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('analysis.inputTitle')}</h2>

            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'text', icon: FileText, label: t('analysis.types.text') },
                  { id: 'url', icon: Link2, label: t('analysis.types.url') },
                  { id: 'image', icon: Image, label: t('analysis.types.image') },
                  { id: 'video', icon: Video, label: t('analysis.types.video') }
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
                  <label className="label">{t('analysis.textLabel')}</label>
                  <textarea
                    rows={8}
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    className="textarea"
                    placeholder={t('analysis.textPlaceholder')}
                  />
                </div>
              )}

              {(contentType === 'url' || contentType === 'image' || contentType === 'video') && (
                <div>
                  <label className="label">{t('analysis.urlLabel')} {contentType !== 'url' && `(${t('analysis.types.' + contentType)})`}</label>
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              )}

              {(contentType === 'image' || contentType === 'video') && (
                <div className="relative">
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-xs text-gray-400 uppercase">{t('analysis.orImport')}</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  
                  {!selectedFile ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer bg-gray-50"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {t('analysis.fileSelect')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{t('analysis.fileFormats')}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-center">
                        {contentType === 'image' ? <Image className="h-5 w-5 text-primary-600 mr-2" /> : <Video className="h-5 w-5 text-primary-600 mr-2" />}
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
                    accept={contentType === 'image' ? "image/*" : "video/*"}
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
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('analysis.loading')}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>{t('analysis.analyzeButton')}</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('analysis.resultsTitle')}</h2>
            {!analysisResult ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t('analysis.emptyResults')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border-2 ${getVerdictColor(analysisResult.verdict)}`}>
                  <div className="flex items-center space-x-3 mb-2">
                    {getVerdictIcon(analysisResult.verdict)}
                    <h3 className="text-xl font-bold capitalize">{t(`analysis.verdict.${analysisResult.verdict}`)}</h3>
                  </div>
                  <p className="text-sm">{analysisResult.explanation}</p>
                </div>
                
                {analysisResult.details && (
                  <div className="space-y-4">
                    {/* Detection */}
                    {analysisResult.details.issues_detected && analysisResult.details.issues_detected.length > 0 && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                          <strong className="text-orange-900">{t('analysis.detectedIssues')}</strong>
                        </div>
                        <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                          {analysisResult.details.issues_detected.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysisResult.details.recommendations && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                          <strong className="text-blue-900">{t('analysis.recommendations')}</strong>
                        </div>
                        <p className="text-sm text-blue-800">{analysisResult.details.recommendations}</p>
                      </div>
                    )}

                    {analysisResult.details.source_reliability && analysisResult.details.source_reliability > 0.7 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center mb-2">
                          <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                          <strong className="text-green-900">{t('analysis.sourceReliability')}</strong>
                        </div>
                        <p className="text-sm text-green-800">
                          Cette information provient d'une source fiable.
                        </p>
                      </div>
                    )}

                    {/* Advanced Details Toggle */}
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span>{showDetails ? 'Masquer les détails techniques' : 'Afficher les détails techniques'}</span>
                    </button>
                    
                    {showDetails && (
                      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
                        <p><strong>Analyse technique :</strong></p>
                        {analysisResult.details.source_reliability && (
                          <p>• Score de source : {Math.round(analysisResult.details.source_reliability * 100)}%</p>
                        )}
                        {analysisResult.factors && (
                          <div>
                            <p><strong>Facteurs analysés :</strong></p>
                            <ul className="list-disc list-inside ml-4 mt-1">
                              {Object.entries(analysisResult.factors).map(([key, value]) => (
                                <li key={key}>{key}: {typeof value === 'number' ? Math.round(value * 100) + '%' : value}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;