import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  ShieldCheck, 
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

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Accueil', href: '/', current: false },
    { name: 'À propos', href: '/about', current: false },
    { name: 'Sources Fiables', href: '/trusted-sources', current: false },
  ];

  const protectedNavigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyse IA', href: '/analysis', icon: Brain },
    { name: 'Quiz', href: '/quizzes', icon: BookOpen },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <ShieldCheck className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Education AI</h1>
                <p className="text-xs text-gray-500">Lutter contre la désinformation</p>
              </div>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
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

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <span>{user?.fullName || user?.username}</span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profil</span>
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
                          <span>Administration</span>
                        </div>
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
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
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  S inscrire
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
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

        {/* Mobile Menu */}
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
                    <span>Profil</span>
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-base font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Award className="h-5 w-5" />
                      <span>Administration</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="text-base font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-2 text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
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