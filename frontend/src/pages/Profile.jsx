import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Globe, Award, Calendar, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      country: user?.country || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await updateProfile(data);
    
    if (result.success) {
      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mon Profil
        </h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.fullName || user?.username}
                </h2>
                <p className="text-gray-600">{user?.role}</p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
                {user?.country && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    {user.country}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Inscrit le {new Date(user?.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  {user?.role === 'admin' ? 'Administrateur' : 
                   user?.role === 'enseignant' ? 'Enseignant' : 'Étudiant'}
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 btn btn-outline flex items-center justify-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Modifier le profil</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="card mt-6">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Analyses réalisées</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quiz complétés</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Score moyen</span>
                  <span className="text-sm font-medium text-gray-900">0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jours de suite</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations personnelles
                </h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-ghost flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Annuler</span>
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nom complet</label>
                    <p className="mt-1 text-gray-900">{user?.fullName || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pays</label>
                    <p className="mt-1 text-gray-900">{user?.country || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Biographie</label>
                    <p className="mt-1 text-gray-900">{user?.bio || 'Non renseignée'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="label">
                      Nom complet
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
                    <label htmlFor="bio" className="label">
                      Biographie
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      {...register('bio', {
                        maxLength: {
                          value: 500,
                          message: 'La biographie ne doit pas dépasser 500 caractères',
                        },
                      })}
                      className="textarea"
                      placeholder="Parlez-nous de vous..."
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-ghost"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="card mt-6">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Paramètres du compte
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Langue</h4>
                    <p className="text-sm text-gray-600">Français</p>
                  </div>
                  <button className="btn btn-ghost text-sm">
                    Modifier
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Notifications</h4>
                    <p className="text-sm text-gray-600">Activées</p>
                  </div>
                  <button className="btn btn-ghost text-sm">
                    Modifier
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Confidentialité</h4>
                    <p className="text-sm text-gray-600">Paramètres de confidentialité</p>
                  </div>
                  <button className="btn btn-ghost text-sm">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;