import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="h-16 w-16 text-warning-600 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-3xl font-medium text-gray-900 mb-2">
            Page non trouvée
          </h2>
          <p className="text-gray-600">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full btn btn-outline"
          >
            Retour en arrière
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;