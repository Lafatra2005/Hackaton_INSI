// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  User,
  Mail,
  Globe,
  Award,
  Calendar,
  Edit3,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    analysesCount: 0,
    quizzesCount: 0,
    averageScore: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/auth/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

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
      toast.success(t('profile.success.update'));
      setIsEditing(false);
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const countries = [
    'Madagascar', 'Belgique','Côte d\'Ivoire', 'Sénégal', 'Burkina Faso', 'Mali', 'Niger',
    'Tchad', 'Cameroun', 'Gabon', 'Congo', 'RDC',
    'Burundi', 'Rwanda', 'Togo', 'Bénin', 'Guinée'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('profile.title')}
        </h1>
        <p className="text-gray-600">
          {t('profile.subtitle')}
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
                  {t('profile.registeredOn')} {new Date(user?.createdAt).toLocaleDateString()}
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 btn btn-outline flex items-center justify-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{t('profile.editButton')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="card mt-6">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('profile.stats.title')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('profile.stats.analyses')}</span>
                  <span className="text-sm font-medium text-gray-900">{stats.analysesCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('profile.stats.quizzes')}</span>
                  <span className="text-sm font-medium text-gray-900">{stats.quizzesCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('profile.stats.averageScore')}</span>
                  <span className="text-sm font-medium text-gray-900">{stats.averageScore}%</span>
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
                  {t('profile.personalInfo.title')}
                </h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-ghost flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>{t('profile.cancel')}</span>
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t('profile.personalInfo.fullName')}
                    </label>
                    <p className="mt-1 text-gray-900">
                      {user?.fullName || t('profile.personalInfo.notProvided')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t('profile.personalInfo.country')}
                    </label>
                    <p className="mt-1 text-gray-900">
                      {user?.country || t('profile.personalInfo.notProvided')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {t('profile.personalInfo.bio')}
                    </label>
                    <p className="mt-1 text-gray-900">
                      {user?.bio || t('profile.personalInfo.notProvided')}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="label">
                      {t('profile.personalInfo.fullName')}
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      {...register('fullName', {
                        maxLength: {
                          value: 100,
                          message: t('profile.errors.fullNameTooLong'),
                        },
                      })}
                      className="input"
                      placeholder={t('profile.personalInfo.fullNamePlaceholder')}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="label">
                      {t('profile.personalInfo.country')}
                    </label>
                    <select
                      id="country"
                      {...register('country')}
                      className="select"
                    >
                      <option value="">{t('profile.personalInfo.selectCountry')}</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bio" className="label">
                      {t('profile.personalInfo.bio')}
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      {...register('bio', {
                        maxLength: {
                          value: 500,
                          message: t('profile.errors.bioTooLong'),
                        },
                      })}
                      className="textarea"
                      placeholder={t('profile.personalInfo.bioPlaceholder')}
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
                      {t('profile.cancel')}
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
                      <span>{isLoading ? t('profile.saving') : t('profile.save')}</span>
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
                {t('profile.accountSettings.title')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{t('profile.accountSettings.language')}</h4>
                    <p className="text-sm text-gray-600">{t('profile.accountSettings.languageValue')}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{t('profile.accountSettings.notifications')}</h4>
                    <p className="text-sm text-gray-600">{t('profile.accountSettings.notificationsValue')}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{t('profile.accountSettings.privacy')}</h4>
                    <p className="text-sm text-gray-600">{t('profile.accountSettings.privacyValue')}</p>
                  </div>
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