import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  Star,
  Filter,
  Globe,
  Book
} from 'lucide-react';
import toast from 'react-hot-toast';
import { trustedSourceAPI } from '../services/api';

const TrustedSources = () => {
  const [sources, setSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'news', label: 'Actualités' },
    { value: 'education', label: 'Éducation' },
    { value: 'government', label: 'Gouvernement' },
    { value: 'research', label: 'Recherche' },
    { value: 'international', label: 'International' }
  ];

  const countries = [
    { value: '', label: 'Tous les pays' },
    { value: 'Madagascar', label: 'Madagascar' },
    { value: 'France', label: 'France' },
    { value: 'International', label: 'International' }
  ];

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    filterSources();
  }, [sources, searchTerm, filters]);

  const fetchSources = async () => {
    try {
      const response = await trustedSourceAPI.getAllSources();
      setSources(response.data.sources);
    } catch (error) {
      toast.error('Erreur lors du chargement des sources');
    } finally {
      setLoading(false);
    }
  };

  const filterSources = () => {
    let filtered = sources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(source => source.category === filters.category);
    }

    // Filter by country
    if (filters.country) {
      filtered = filtered.filter(source => source.country === filters.country);
    }

    setFilteredSources(filtered);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'news':
        return <Book className="h-5 w-5" />;
      case 'education':
        return <Book className="h-5 w-5" />;
      case 'government':
        return <ShieldCheck className="h-5 w-5" />;
      case 'research':
        return <Globe className="h-5 w-5" />;
      case 'international':
        return <Globe className="h-5 w-5" />;
      default:
        return <ShieldCheck className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'news':
        return 'bg-blue-100 text-blue-800';
      case 'education':
        return 'bg-green-100 text-green-800';
      case 'government':
        return 'bg-purple-100 text-purple-800';
      case 'research':
        return 'bg-yellow-100 text-yellow-800';
      case 'international':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReliabilityStars = (score) => {
    const stars = Math.round(score * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <ShieldCheck className="h-8 w-8 text-warning-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Sources Fiables
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Découvrez notre base de données de sources d'information vérifiées et fiables 
          pour vous aider à naviguer dans l'environnement médiatique.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="card-body">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Filters */}
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
              <label className="label">Pays</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="select"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ category: '', country: '' });
                }}
                className="btn btn-outline w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSources.map((source) => (
          <div key={source.id} className="card hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getCategoryColor(source.category)}`}>
                    {getCategoryIcon(source.category)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      {getReliabilityStars(source.reliability_score)}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(source.category)}`}>
                      {source.category}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  {source.country}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {source.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {source.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {source.language}
                </div>
                <div className="flex items-center">
                  Score: {(source.reliability_score * 100).toFixed(0)}%
                </div>
              </div>

              <div className="flex space-x-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-outline flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Visiter</span>
                </a>
                {source.is_verified && (
                  <div className="flex items-center px-3 py-2 bg-success-100 text-success-800 rounded-md text-xs font-medium">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Vérifié
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSources.length === 0 && (
        <div className="text-center py-12">
          <ShieldCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune source trouvée
          </h3>
          <p className="text-gray-500 mb-4">
            Aucune source ne correspond à vos critères de recherche.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ category: '', country: '' });
            }}
            className="btn btn-outline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-12 card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-warning-600" />
            Statistiques des sources
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {sources.length}
              </div>
              <p className="text-sm text-gray-600">Sources totales</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600 mb-1">
                {sources.filter(s => s.is_verified).length}
              </div>
              <p className="text-sm text-gray-600">Sources vérifiées</p>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600 mb-1">
                {sources.filter(s => s.reliability_score >= 0.9).length}
              </div>
              <p className="text-sm text-gray-600">Score élevé</p>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <div className="text-2xl font-bold text-secondary-600 mb-1">
                {new Set(sources.map(s => s.country)).size}
              </div>
              <p className="text-sm text-gray-600">Pays couverts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedSources;