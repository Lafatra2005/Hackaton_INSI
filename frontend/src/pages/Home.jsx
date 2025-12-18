// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Brain,
  BookOpen,
  Users,
  TrendingUp,
  Globe,
  Zap,
  CheckCircle,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: t('home.features.ai.title'),
      description: t('home.features.ai.description'),
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      icon: BookOpen,
      title: t('home.features.education.title'),
      description: t('home.features.education.description'),
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      icon: ShieldCheck,
      title: t('home.features.sources.title'),
      description: t('home.features.sources.description'),
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      icon: Users,
      title: t('home.features.community.title'),
      description: t('home.features.community.description'),
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    }
  ];

  const stats = [
    { number: '10K+', label: t('home.stats.analyses'), icon: TrendingUp },
    { number: '5K+', label: t('home.stats.users'), icon: Users },
    { number: '50+', label: t('home.stats.sources'), icon: ShieldCheck },
    { number: '15+', label: t('home.stats.countries'), icon: Globe }
  ];

  const challenges = [
    {
      title: t('home.challenges.fakeNews.title'),
      description: t('home.challenges.fakeNews.description'),
      icon: Zap,
      category: t('home.challenges.fakeNews.category')
    },
    {
      title: t('home.challenges.mediaLiteracy.title'),
      description: t('home.challenges.mediaLiteracy.description'),
      icon: Award,
      category: t('home.challenges.mediaLiteracy.category')
    },
    {
      title: t('home.challenges.factChecking.title'),
      description: t('home.challenges.factChecking.description'),
      icon: CheckCircle,
      category: t('home.challenges.factChecking.category')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="block">{t('home.hero.title1')}</span>
              <span className="block text-primary-200">{t('home.hero.title2')}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto text-balance">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                  >
                    {t('home.hero.ctaPrimary')}
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    {t('home.hero.ctaSecondary')}
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                >
                  {t('home.hero.ctaDashboard')}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-white">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.mission.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.mission.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="card-body text-center">
                  <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-primary-600 mr-2" />
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    {stat.number}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.challenges.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.challenges.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => (
              <div key={index} className="card border-l-4 border-primary-500">
                <div className="card-body">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <challenge.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <span className="badge badge-primary mb-2">
                        {challenge.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                >
                  {t('home.cta.primary')}
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  {t('home.cta.secondary')}
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
              >
                {t('home.cta.dashboard')}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;