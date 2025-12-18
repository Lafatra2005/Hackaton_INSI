// src/pages/Quizzes.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Filter, Search, BookOpen } from 'lucide-react';
import { quizAPI } from '../services/api';

const Quizzes = () => {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizAPI.getAllQuizzes(filters);
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error(t('quizzes.error.load'), error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <GraduationCap className="mr-3 text-indigo-600" size={36} />
          {t('quizzes.title')}
        </h1>
      </div>

      {/* Filters Block – bien aligné */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
            {t('quizzes.filters.category')}
          </label>
          <select
            className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">{t('quizzes.filters.allCategories')}</option>
            <option value="media_literacy">{t('quizzes.categories.mediaLiteracy')}</option>
            <option value="pedagogy">{t('quizzes.categories.pedagogy')}</option>
            <option value="adaptive">{t('quizzes.categories.adaptive')}</option>
            <option value="critical_thinking">{t('quizzes.categories.criticalThinking')}</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
            {t('quizzes.filters.difficulty')}
          </label>
          <select
            className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="">{t('quizzes.filters.allLevels')}</option>
            <option value="debutant">{t('quizzes.levels.beginner')}</option>
            <option value="intermediaire">{t('quizzes.levels.intermediate')}</option>
            <option value="avance">{t('quizzes.levels.advanced')}</option>
          </select>
        </div>

        <button
          onClick={() => setFilters({ category: '', difficulty: '' })}
          className="p-3 text-gray-500 hover:text-indigo-600 font-medium"
        >
          {t('quizzes.filters.reset')}
        </button>
      </div>

      {/* Quiz List – grille bien alignée */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length > 0 ? (
            quizzes.map((quiz, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">
                    {t(`quizzes.levels.${quiz.difficulty}`)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-500 text-sm mb-6">{quiz.description}</p>
                <Link
                  to={`/quizzes/${quiz.id}?difficulty=${
                    filters.difficulty === 'debutant' ? 'easy' :
                    filters.difficulty === 'avance' ? 'hard' :
                    filters.difficulty === 'intermediaire' ? 'medium' : 'medium'
                  }`}
                  className="block w-full text-center bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
                >
                  {t('quizzes.startModule')}
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">{t('quizzes.noResults.title')}</p>
              <p className="text-sm text-gray-400">{t('quizzes.noResults.description')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quizzes;