// src/pages/About.jsx
import React from 'react';
import { ShieldCheck, Target, Users, Globe, Award, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  const objectives = [
    {
      icon: Target,
      title: t('about.objectives.disinformation.title'),
      description: t('about.objectives.disinformation.description')
    },
    {
      icon: ShieldCheck,
      title: t('about.objectives.sources.title'),
      description: t('about.objectives.sources.description')
    },
    {
      icon: Users,
      title: t('about.objectives.criticalThinking.title'),
      description: t('about.objectives.criticalThinking.description')
    },
    {
      icon: Globe,
      title: t('about.objectives.inclusion.title'),
      description: t('about.objectives.inclusion.description')
    }
  ];

  const values = [
    {
      title: t('about.values.qualityEducation.title'),
      description: t('about.values.qualityEducation.description')
    },
    {
      title: t('about.values.reliableInfo.title'),
      description: t('about.values.reliableInfo.description')
    },
    {
      title: t('about.values.ethicalAI.title'),
      description: t('about.values.ethicalAI.description')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('about.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.mission.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {objectives.map((obj, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="card-body text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <obj.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {obj.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {obj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('about.vision.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('about.vision.paragraph1')}
              </p>
              <p className="text-gray-600 mb-6">
                {t('about.vision.paragraph2')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('about.slogan.title')}
              </h3>
              <blockquote className="text-2xl font-medium text-primary-600 italic">
                {t('about.slogan.quote')}
              </blockquote>
              <div className="mt-6 flex items-center">
                <Award className="h-6 w-6 text-primary-600 mr-2" />
                <span className="text-gray-700">
                  {t('about.slogan.event')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Heart className="h-6 w-6" />
            <span className="text-lg">
              {t('about.cta.footer')}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;