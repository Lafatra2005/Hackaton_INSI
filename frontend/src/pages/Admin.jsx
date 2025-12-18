import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Brain, 
  BookOpen, 
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Settings,
  UserCheck
} from 'lucide-react';
import { analysisAPI } from '../services/api';
import toast from 'react-hot-toast';

const Admin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnalyses: 0,
    totalQuizzes: 0,
    dailyAnalyses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [analysesRes] = await Promise.allSettled([
        analysisAPI.getStats()
      ]);

      if (analysesRes.status === 'fulfilled') {
        setStats(prev => ({
          ...prev,
          totalAnalyses: analysesRes.value.data.stats.totalAnalyses || 0,
          dailyAnalyses: analysesRes.value.data.stats.daily || []
        }));
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des données admin');
    } finally {
      setLoading(false);
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
          Administration
        </h1>
        <p className="text-gray-600">
          Tableau de bord administrateur de la plateforme Education AI
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Analyses IA</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
              </div>
              <div className="bg-success-100 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quiz</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
              </div>
              <div className="bg-warning-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sources</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Activité récente
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <Brain className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nouvelle analyse effectuée
                  </p>
                  <p className="text-xs text-gray-500">
                    Il y a 5 minutes
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-success-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nouvel utilisateur inscrit
                  </p>
                  <p className="text-xs text-gray-500">
                    Il y a 12 minutes
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center mr-3">
                  <BookOpen className="h-5 w-5 text-warning-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Quiz complété
                  </p>
                  <p className="text-xs text-gray-500">
                    Il y a 1 heure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <Settings className="h-5 w-5 text-secondary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Actions rapides
              </h3>
            </div>
            
            <div className="space-y-3">
              <button className="w-full btn btn-primary flex items-center justify-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Gérer les utilisateurs</span>
              </button>
              
              <button className="w-full btn btn-success flex items-center justify-center space-x-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Ajouter une source</span>
              </button>
              
              <button className="w-full btn btn-warning flex items-center justify-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Créer un quiz</span>
              </button>
              
              <button className="w-full btn btn-outline flex items-center justify-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Voir les statistiques</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            État du système
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-success-600 mb-2">
                <ShieldCheck className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Base de données</h4>
              <p className="text-sm text-success-600">Connectée</p>
            </div>
            
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-success-600 mb-2">
                <Brain className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Service IA</h4>
              <p className="text-sm text-success-600">Opérationnel</p>
            </div>
            
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-success-600 mb-2">
                <UserCheck className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">API</h4>
              <p className="text-sm text-success-600">Accessible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;