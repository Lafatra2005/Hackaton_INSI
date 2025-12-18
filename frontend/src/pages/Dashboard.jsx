import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  BookOpen, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { analysisAPI, quizAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    analysesCount: 0,
    quizzesCompleted: 0,
    averageScore: 0,
    progressPercentage: 0
  });
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analysesRes, quizzesRes, progressRes] = await Promise.allSettled([
        analysisAPI.getUserAnalyses({ limit: 5 }),
        quizAPI.getUserResults(5),
        quizAPI.getUserProgress()
      ]);

      if (analysesRes.status === 'fulfilled') {
        setRecentAnalyses(analysesRes.value.data.analyses);
        setStats(prev => ({ ...prev, analysesCount: analysesRes.value.data.analyses.length }));
      }

      if (quizzesRes.status === 'fulfilled') {
        setRecentQuizzes(quizzesRes.value.data.results);
        setStats(prev => ({ ...prev, quizzesCompleted: quizzesRes.value.data.results.length }));
      }

      if (progressRes.status === 'fulfilled') {
        setStats(prev => ({
          ...prev,
          progressPercentage: progressRes.value.data.progress.progressPercentage,
          averageScore: Math.round(progressRes.value.data.progress.categoryProgress.reduce((acc, cat) => acc + cat.average_score, 0) / progressRes.value.data.progress.categoryProgress.length) || 0
        }));
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'fiable':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'douteux':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />;
      case 'faux':
        return <XCircle className="h-5 w-5 text-danger-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'fiable':
        return 'badge-success';
      case 'douteux':
        return 'badge-warning';
      case 'faux':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bonjour, {user?.fullName || user?.username} ! 👋
        </h1>
        <p className="text-gray-600">
          Bienvenue sur votre tableau de bord Education AI
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Analyses réalisées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.analysesCount}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quiz complétés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.quizzesCompleted}</p>
              </div>
              <div className="bg-success-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score moyen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
              <div className="bg-warning-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progression</p>
                <p className="text-2xl font-bold text-gray-900">{stats.progressPercentage}%</p>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Analyses */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary-600" />
                Analyses récentes
              </h3>
              <Link to="/analysis" className="text-sm text-primary-600 hover:text-primary-500">
                Voir tout
              </Link>
            </div>
            
            {recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getVerdictIcon(analysis.ai_verdict)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {analysis.content_text?.substring(0, 50)}...
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(analysis.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <span className={`badge ${getVerdictColor(analysis.ai_verdict)}`}>
                      {analysis.ai_verdict}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">Aucune analyse réalisée</p>
                <Link to="/analysis" className="btn btn-primary">
                  Commencer une analyse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Quizzes */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-success-600" />
                Quiz récents
              </h3>
              <Link to="/quizzes" className="text-sm text-success-600 hover:text-success-500">
                Voir tout
              </Link>
            </div>
            
            {recentQuizzes.length > 0 ? (
              <div className="space-y-3">
                {recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {quiz.quiz_title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`badge ${quiz.score >= 80 ? 'badge-success' : quiz.score >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                          {quiz.score}%
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.floor(quiz.time_spent_seconds / 60)}min
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(quiz.completed_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">Aucun quiz complété</p>
                <Link to="/quizzes" className="btn btn-success">
                  Commencer un quiz
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/analysis" className="btn btn-primary flex items-center justify-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Analyser un contenu</span>
            </Link>
            <Link to="/quizzes" className="btn btn-success flex items-center justify-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Passer un quiz</span>
            </Link>
            <Link to="/trusted-sources" className="btn btn-warning flex items-center justify-center space-x-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Vérifier une source</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;