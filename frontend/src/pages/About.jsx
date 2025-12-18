import React from 'react';
import { ShieldCheck, Target, Users, Globe, Award, Heart } from 'lucide-react';

const About = () => {
  const objectives = [
    {
      icon: Target,
      title: 'Lutter contre la désinformation',
      description: 'Développer des outils pour identifier et signaler les fake news dans les environnements éducatifs.'
    },
    {
      icon: ShieldCheck,
      title: 'Vérifier les sources',
      description: 'Permettre aux jeunes de vérifier la fiabilité des sources d\'information.'
    },
    {
      icon: Users,
      title: 'Renforcer l\'esprit critique',
      description: 'Former l\'analyse critique des contenus numériques et des réseaux sociaux.'
    },
    {
      icon: Globe,
      title: 'Promouvoir l\'inclusion',
      description: 'Solutions multilingues adaptées aux contextes africains et accessibles.'
    }
  ];

  const values = [
    {
      title: 'Éducation de qualité',
      description: 'Aligné avec l\'ODD 4 pour une éducation inclusive et équitable de qualité.'
    },
    {
      title: 'Information fiable',
      description: 'Contribution à l\'ODD 16 pour des sociétés pacifiques et inclusives.'
    },
    {
      title: 'IA éthique',
      description: 'Intelligence artificielle responsable et éthique au service de l\'éducation.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            À propos d'Education AI
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto">
            Jeunesse, Intelligence Artificielle et Numérique pour une éducation critique, 
            inclusive et responsable en Afrique
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Concevoir et développer des solutions numériques innovantes intégrant 
              l'Intelligence Artificielle pour améliorer la vie éducative à Madagascar et en Afrique.
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
                Notre Vision
              </h2>
              <p className="text-gray-600 mb-6">
                Former des talents numériques engagés capables de naviguer dans 
                l'environnement médiatique complexe actuel, de distinguer les 
                informations fiables des fake news, et de devenir des acteurs 
                responsables de la diffusion de l'information.
              </p>
              <p className="text-gray-600 mb-6">
                Nous croyons en un Internet plus sûr, plus éclairé et plus 
                responsable, où les jeunes africains sont équipés des outils 
                nécessaires pour comprendre, analyser et contribuer positivement 
                au débat public.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Slogan officiel INSI
              </h3>
              <blockquote className="text-2xl font-medium text-primary-600 italic">
                "Youth, AI and Digital Innovation for a Smarter Education"
              </blockquote>
              <div className="mt-6 flex items-center">
                <Award className="h-6 w-6 text-primary-600 mr-2" />
                <span className="text-gray-700">
                  Hackathon INSI - Madagascar
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
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600">
            Engagés pour un impact durable et positif
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
            Rejoignez le mouvement
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Ensemble, construisons un avenir numérique plus éclairé et responsable pour l'Afrique.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Heart className="h-6 w-6" />
            <span className="text-lg">
              Fait avec passion pour l'éducation en Afrique
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;