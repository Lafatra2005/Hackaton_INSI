import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      country: data.country,
      language: data.language || 'fr',
    });
    
    if (result.success) {
      toast.success('Inscription réussie ! Bienvenue sur Education AI !');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const countries = [
    'Madagascar', 'France', 'Belgique', 'Canada', 'Suisse',
    'Côte d\'Ivoire', 'Sénégal', 'Burkina Faso', 'Mali', 'Niger',
    'Tchad', 'Cameroun', 'Gabon', 'Congo', 'RDC',
    'Burundi', 'Rwanda', 'Togo', 'Bénin', 'Guinée'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Rejoindre Education
          </h2>
          <p className="text-gray-600">
            Créez votre compte et commencez votre apprentissage
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="username" className="label">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  {...register('username', {
                    required: 'Le nom d utilisateur est requis',
                    minLength: {
                      value: 3,
                      message: 'Le nom d utilisateur doit avoir au moins 3 caractères',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Le nom d utilisateur ne doit pas dépasser 30 caractères',
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: 'Le nom d utilisateur ne doit contenir que des lettres et des chiffres',
                    },
                  })}
                  className="input"
                  placeholder="votre_nom"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="label">
                  Nom complet (optionnel)
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName', {
                    maxLength: {
                      value: 100,
                      message: 'Le nom ne doit pas dépasser 100 caractères',
                    },
                  })}
                  className="input"
                  placeholder="Votre nom complet"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'L email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  className="input"
                  placeholder="vous@exemple.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="label">
                  Pays
                </label>
                <select
                  id="country"
                  {...register('country')}
                  className="select"
                >
                  <option value="">Sélectionnez votre pays</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Le mot de passe est requis',
                      minLength: {
                        value: 6,
                        message: 'Le mot de passe doit avoir au moins 6 caractères',
                      },
                    })}
                    className="input pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Veuillez confirmer votre mot de passe',
                      validate: (value) =>
                        value === password || 'Les mots de passe ne correspondent pas',
                    })}
                    className="input pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    {...register('terms', {
                      required: 'Vous devez accepter les conditions d utilisation',
                    })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    J accepte les{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      conditions d utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      politique de confidentialité
                    </a>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Inscription...
                  </div>
                ) : (
                  'S inscrire'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Vous avez déjà un compte ?
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="btn btn-outline w-full"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;