// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Menu,
  X,
  TreeDeciduous,
  User,
  LogOut,
  LayoutDashboard,
  Brain,
  BookOpen,
  Award
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.trustedSources'), href: '/trusted-sources' },
  ];

  const protectedNavigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.aiAnalysis'), href: '/analysis', icon: Brain },
    { name: t('nav.quizzes'), href: '/quizzes', icon: BookOpen },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* LIGNE PRINCIPALE : tout aligné verticalement */}
        <div className="flex items-center justify-between h-16">
          {/* GAUCHE : logo + titre */}
          <Link to="/" className="flex items-center space-x-3">
            <TreeDeciduous className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('header.title')}</h1>
              <p className="text-xs text-gray-500">{t('header.subtitle')}</p>
            </div>
          </Link>

          {/* CENTRE : navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <div className="h-4 w-px bg-gray-300" />
                {protectedNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* DROITE : langue + profil/menu */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="hidden sm:inline">{user?.fullName || user?.username}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{t('nav.profile')}</span>
                      </div>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4" />
                          <span>{t('nav.administration')}</span>
                        </div>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>{t('nav.logout')}</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MENU MOBILE (facultatif mais propre) */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-base font-medium text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="h-px bg-gray-300 my-2" />
                  {protectedNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-base font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  <div className="h-px bg-gray-300 my-2" />
                  <Link
                    to="/profile"
                    className="text-base font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>{t('nav.profile')}</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-base font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Award className="h-5 w-5" />
                      <span>{t('nav.administration')}</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-base font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-2 text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;