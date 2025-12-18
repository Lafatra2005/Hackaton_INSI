import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Twitter, Facebook, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheck className="h-8 w-8 text-primary-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Education AI</h3>
                <p className="text-sm text-gray-500">Youth, AI and Digital Innovation for a Smarter Education</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              Plateforme éducative utilisant l'intelligence artificielle pour lutter contre la désinformation 
              et renforcer la littératie médiatique des jeunes en Afrique.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/analysis" className="text-sm text-gray-600 hover:text-primary-600">
                  Analyse IA
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-sm text-gray-600 hover:text-primary-600">
                  Quiz éducatifs
                </Link>
              </li>
              <li>
                <Link to="/trusted-sources" className="text-sm text-gray-600 hover:text-primary-600">
                  Sources fiables
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary-600">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Ressources
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Guide de littératie médiatique
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Signaler un problème
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Documentation API
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 Education AI Platform. Conçu pour le Hackathon INSI.
            </p>
            <div className="flex items-center space-x-1 mt-4 md:mt-0">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-500">
                Fait avec passion pour l'éducation en Afrique
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner ODD */}
      <div className="bg-primary-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              <strong>Objectifs de Développement Durable :</strong>
              <span className="mx-2">ODD 4 - Éducation de qualité</span>
              <span className="mx-2">•</span>
              <span>ODD 16 - Sociétés pacifiques et inclusives</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;