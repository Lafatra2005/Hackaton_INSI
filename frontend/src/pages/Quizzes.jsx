import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Filter, 
  TrendingUp,
  CheckCircle,
  Clock3,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';
import { quizAPI } from '../services/api';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    language: 'fr'
  });
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'media_literacy', label: 'Littératie médiatique' },
    { value: 'critical_thinking', label: 'Esprit critique' },
    { value: 'fact_checking', label: 'Vérification des faits' }
  ];

  const difficulties = [
    { value: '', label: 'Tous niveaux' },
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' }
  ];

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAllQuizzes(filters);
      setQuizzes(response.data.quizzes);
    } catch (error) {
      toast.error('Erreur lors du chargement des quiz');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'debutant':
        return 'badge-success';
      case 'intermediaire':
        return 'badge-warning';
      case 'avance':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'media_literacy':
        return BookOpen;
      case 'critical_thinking':
        return Brain;
      case 'fact_checking':
        return CheckCircle;
      default:
        return Award;
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
        <div className="flex items-center mb-4">
          <BookOpen className="h-8 w-8 text-success-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Quiz Éducatifs
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Testez vos connaissances et développez vos compétences en littératie médiatique 
          et esprit critique avec nos quiz interactifs.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Catégorie</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="select"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">Niveau</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="select"
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">Langue</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="select"
                disabled
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="mg">Malagasy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const CategoryIcon = getCategoryIcon(quiz.category);
          
          return (
            <div key={quiz.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <CategoryIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className={`badge ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock3 className="h-4 w-4 mr-1" />
                      {quiz.time_limit_minutes || 15} min
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {quiz.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {quiz.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    {quiz.questions_count} questions
                  </div>
                  <div className="flex items-center capitalize">
                    {quiz.category.replace('_', ' ')}
                  </div>
                </div>

                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="w-full btn btn-primary"
                >
                  Commencer le quiz
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun quiz disponible
          </h3>
          <p className="text-gray-500 mb-4">
            Aucun quiz ne correspond à vos critères de recherche.
          </p>
          <button
            onClick={() => setFilters({ category: '', difficulty: '', language: 'fr' })}
            className="btn btn-outline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Progress Section */}
      <div className="mt-12 card">
        <div className="card-body">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Votre progression
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                0
              </div>
              <p className="text-sm text-gray-600">Quiz complétés</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600 mb-1">
                0%
              </div>
              <p className="text-sm text-gray-600">Score moyen</p>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600 mb-1">
                0h
              </div>
              <p className="text-sm text-gray-600">Temps d'apprentissage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;