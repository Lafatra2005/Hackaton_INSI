// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        about: 'À propos',
        trustedSources: 'Sources Fiables',
        dashboard: 'Tableau de bord',
        aiAnalysis: 'Analyse IA',
        quizzes: 'Quiz',
        profile: 'Profil',
        administration: 'Administration',
        logout: 'Déconnexion',
        login: 'Connexion',
        register: "S'inscrire"
      },
      header: {
        title: 'AfricaLearn',
        subtitle: 'Lutter contre la désinformation'
      },
      home: {
        hero: {
          title1: 'Jeunesse, Intelligence Artificielle',
          title2: 'et Éducation Critique en Afrique',
          subtitle: 'Concevoir et développer des solutions numériques innovantes intégrant l’IA pour améliorer la vie éducative et renforcer la littératie médiatique des jeunes.',
          ctaPrimary: 'Rejoindre la plateforme',
          ctaSecondary: 'Se connecter',
          ctaDashboard: 'Continuer mon apprentissage'
        },
        mission: {
          title: 'Notre Mission',
          subtitle: 'Lutter contre la désinformation, vérifier la fiabilité des sources, et renforcer l\'esprit critique des jeunes à Madagascar et en Afrique.'
        },
        features: {
          ai: {
            title: 'Analyse IA Avancée',
            description: 'Notre intelligence artificielle analyse le contenu pour détecter les fake news et évaluer la fiabilité des sources.'
          },
          education: {
            title: 'Parcours Éducatifs',
            description: 'Quiz interactifs et modules de formation pour développer l\'esprit critique et la littératie médiatique.'
          },
          sources: {
            title: 'Vérification de Sources',
            description: 'Base de données de sources fiables et outils de vérification croisée pour valider l\'information.'
          },
          community: {
            title: 'Communauté Engagée',
            description: 'Rejoignez une communauté de jeunes engagés pour une information fiable et responsable.'
          }
        },
        stats: {
          analyses: 'Analyses réalisées',
          users: 'Utilisateurs actifs',
          sources: 'Sources vérifiées',
          countries: 'Pays africains'
        },
        challenges: {
          title: 'Des défis conçus pour stimuler l\'innovation et l\'engagement des jeunes',
          subtitle: 'Découvrez les trois axes thématiques au cœur de notre projet',
          fakeNews: {
            title: 'Détection de Fake News',
            description: 'Identifier et signaler les contenus trompeurs avec l\'aide de l\'IA',
            category: 'IA & Lutte contre la désinformation'
          },
          mediaLiteracy: {
            title: 'Littératie Médiatique',
            description: 'Former l\'esprit critique à travers des parcours adaptatifs',
            category: 'Éducation critique'
          },
          factChecking: {
            title: 'Vérification Croisée',
            description: 'Comparer les informations avec des sources fiables',
            category: 'Fact-checking intelligent'
          }
        },
        cta: {
          title: 'Prêt à rejoindre le mouvement ?',
          subtitle: 'Rejoignez des milliers de jeunes engagés pour une information fiable et responsable.',
          primary: 'Créer un compte gratuit',
          secondary: 'En savoir plus',
          dashboard: 'Continuer mon apprentissage'
        }
      },
      about: {
        hero: {
          title: 'À propos d\'AfricaLearn',
          subtitle: 'Jeunesse, Intelligence Artificielle et Numérique pour une éducation critique, inclusive et responsable en Afrique'
        },
        mission: {
          title: 'Notre Mission',
          subtitle: 'Concevoir et développer des solutions numériques innovantes intégrant l\'Intelligence Artificielle pour améliorer la vie éducative à Madagascar et en Afrique.'
        },
        objectives: {
          disinformation: {
            title: 'Lutter contre la désinformation',
            description: 'Développer des outils pour identifier et signaler les fake news dans les environnements éducatifs.'
          },
          sources: {
            title: 'Vérifier les sources',
            description: 'Permettre aux jeunes de vérifier la fiabilité des sources d\'information.'
          },
          criticalThinking: {
            title: 'Renforcer l\'esprit critique',
            description: 'Former l\'analyse critique des contenus numériques et des réseaux sociaux.'
          },
          inclusion: {
            title: 'Promouvoir l\'inclusion',
            description: 'Solutions multilingues adaptées aux contextes africains et accessibles.'
          }
        },
        vision: {
          title: 'Notre Vision',
          paragraph1: 'Former des talents numériques engagés capables de naviguer dans l\'environnement médiatique complexe actuel, de distinguer les informations fiables des fake news, et de devenir des acteurs responsables de la diffusion de l\'information.',
          paragraph2: 'Nous croyons en un Internet plus sûr, plus éclairé et plus responsable, où les jeunes africains sont équipés des outils nécessaires pour comprendre, analyser et contribuer positivement au débat public.'
        },
        slogan: {
          title: 'Slogan officiel INSI',
          quote: '"Youth, AI and Digital Innovation for a Smarter Education"',
          event: 'Hackathon INSI - Madagascar'
        },
        values: {
          title: 'Nos Valeurs',
          subtitle: 'Engagés pour un impact durable et positif',
          qualityEducation: {
            title: 'Éducation de qualité',
            description: 'Aligné avec l\'ODD 4 pour une éducation inclusive et équitable de qualité.'
          },
          reliableInfo: {
            title: 'Information fiable',
            description: 'Contribution à l\'ODD 16 pour des sociétés pacifiques et inclusives.'
          },
          ethicalAI: {
            title: 'IA éthique',
            description: 'Intelligence artificielle responsable et éthique au service de l\'éducation.'
          }
        },
        cta: {
          title: 'Rejoignez le mouvement',
          subtitle: 'Ensemble, construisons un avenir numérique plus éclairé et responsable pour l\'Afrique.',
          footer: 'Fait avec passion pour l\'éducation en Afrique'
        }
      },
      trustedSources: {
        title: 'Sources Fiables',
        description: 'Découvrez notre base de données de sources d\'information vérifiées et fiables pour vous aider à naviguer dans l\'environnement médiatique.',
        searchPlaceholder: 'Rechercher une source...',
        filters: {
          category: 'Catégorie',
          country: 'Pays',
          allCategories: 'Toutes les catégories',
          allCountries: 'Tous les pays',
          news: 'Actualités',
          education: 'Éducation',
          government: 'Gouvernement',
          research: 'Recherche',
          international: 'International',
          reset: 'Réinitialiser'
        },
        visit: 'Visiter',
        verified: 'Vérifié',
        score: 'Score',
        noResults: {
          title: 'Aucune source trouvée',
          description: 'Aucune source ne correspond à vos critères de recherche.',
          reset: 'Réinitialiser les filtres'
        },
        stats: {
          title: 'Statistiques des sources',
          total: 'Sources totales',
          verified: 'Sources vérifiées',
          highScore: 'Score élevé',
          countries: 'Pays couverts'
        },
        error: {
          load: 'Erreur lors du chargement des sources'
        }
      },
      dashboard: {
        welcome: 'Bonjour',
        subtitle: 'Bienvenue sur votre tableau de bord Education AI',
        stats: {
          analyses: 'Analyses réalisées',
          quizzes: 'Quiz complétés',
          averageScore: 'Score moyen',
          progress: 'Progression'
        },
        recentAnalyses: {
          title: 'Analyses récentes',
          seeAll: 'Voir tout',
          empty: 'Aucune analyse réalisée',
          start: 'Commencer une analyse',
          verdict: {
            fiable: 'Fiable',
            douteux: 'Douteux',
            faux: 'Faux'
          }
        },
        recentQuizzes: {
          title: 'Quiz récents',
          seeAll: 'Voir tout',
          empty: 'Aucun quiz complété',
          start: 'Commencer un quiz',
          minutes: 'min'
        },
        quickActions: {
          title: 'Actions rapides',
          analyze: 'Analyser un contenu',
          quiz: 'Passer un quiz',
          verify: 'Vérifier une source'
        },
        error: {
          load: 'Erreur lors du chargement du tableau de bord'
        }
      },
      analysis: {
        title: 'Analyseur IA Multi-Format',
        subtitle: 'Détectez les deepfakes, les fake news et les manipulations dans les textes, images, audios et vidéos.',
        inputTitle: 'Contenu à analyser',
        types: {
          text: 'Texte',
          url: 'Lien',
          image: 'Image',
          video: 'Vidéo'
        },
        textLabel: 'Texte à analyser',
        textPlaceholder: 'Collez le texte...',
        urlLabel: 'URL du contenu',
        orImport: 'Ou importer un fichier',
        fileSelect: 'Cliquez pour sélectionner un fichier',
        fileFormats: 'MP3, WAV, MP4, MOV (max. 50Mo)',
        analyzeButton: 'Lancer l\'analyse intelligente',
        loading: 'Analyse en cours...',
        resultsTitle: 'Résultat de l\'analyse',
        emptyResults: 'Sélectionnez un média et lancez l\'analyse pour voir les résultats',
        verdict: {
          fiable: 'Fiable',
          douteux: 'Douteux',
          faux: 'Faux'
        },
        confidenceScore: 'Score de confiance',
        analysisTime: 'Temps d\'analyse',
        showDetails: 'Voir les détails',
        hideDetails: 'Masquer les détails',
        detectedIssues: 'Problèmes détectés',
        recommendations: 'Recommandations',
        sourceReliability: 'Fiabilité de la source',
        safetyWarning: 'Attention sécurité',
        fakeContentWarning: 'Ce contenu a été identifié comme potentiellement faux ou manipulé. Partagez avec précaution.',
        error: {
          fileTooLarge: 'Le fichier est trop volumineux (max 50Mo)',
          noText: 'Veuillez entrer du texte',
          noUrl: 'Veuillez entrer une URL',
          noFileOrUrl: 'Veuillez sélectionner un fichier ou entrer une URL',
          generic: 'Erreur lors de l\'analyse'
        },
        success: 'Analyse terminée avec succès !'
      },
      quizzes: {
        title: 'Espace de Formation',
        filters: {
          category: 'Thématique',
          difficulty: 'Niveau',
          allCategories: 'Tous les thèmes',
          allLevels: 'Tous les niveaux',
          reset: 'Réinitialiser'
        },
        categories: {
          mediaLiteracy: 'Littératie médiatique & info',
          pedagogy: 'Applications pédagogiques',
          adaptive: 'Parcours adaptatif',
          criticalThinking: 'Esprit critique'
        },
        levels: {
          beginner: 'Débutant (Easy)',
          intermediate: 'Intermédiaire (Medium)',
          advanced: 'Avancé (Hard)'
        },
        startModule: 'Lancer le module',
        noResults: {
          title: 'Aucun module disponible pour cette combinaison.',
          description: 'Essayez de changer la difficulté ou le thème.'
        },
        error: {
          load: 'Erreur de filtrage'
        }
      },
      profile: {
        title: 'Mon Profil',
        subtitle: 'Gérez vos informations personnelles et préférences',
        editButton: 'Modifier le profil',
        cancel: 'Annuler',
        save: 'Enregistrer',
        saving: 'Enregistrement...',
        success: {
          update: 'Profil mis à jour avec succès !'
        },
        personalInfo: {
          title: 'Informations personnelles',
          fullName: 'Nom complet',
          fullNamePlaceholder: 'Votre nom complet',
          country: 'Pays',
          selectCountry: 'Sélectionnez votre pays',
          bio: 'Biographie',
          bioPlaceholder: 'Parlez-nous de vous...',
          notProvided: 'Non renseigné'
        },
        stats: {
          title: 'Statistiques',
          analyses: 'Analyses réalisées',
          quizzes: 'Quiz complétés',
          averageScore: 'Score moyen',
          streak: 'Jours de suite'
        },
        accountSettings: {
          title: 'Paramètres du compte',
          language: 'Langue',
          languageValue: 'Français',
          notifications: 'Notifications',
          notificationsValue: 'Activées',
          privacy: 'Confidentialité',
          privacyValue: 'Paramètres de confidentialité',
        },
        roles: {
          admin: 'Administrateur',
          teacher: 'Enseignant',
          student: 'Étudiant'
        },
        registeredOn: 'Inscrit le',
        errors: {
          fullNameTooLong: 'Le nom ne doit pas dépasser 100 caractères',
          bioTooLong: 'La biographie ne doit pas dépasser 500 caractères'
        }
      },
      footer: {
        slogan: 'Youth, AI and Digital Innovation for a Smarter Education',
        description: 'Plateforme éducative utilisant l\'intelligence artificielle pour lutter contre la désinformation et renforcer la littératie médiatique des jeunes en Afrique.',
        platform: {
          title: 'Plateforme',
          aiAnalysis: 'Analyse IA',
          quizzes: 'Quiz éducatifs',
          trustedSources: 'Sources fiables',
          about: 'À propos'
        },
        resources: {
          title: 'Ressources',
          guide: 'Guide de littératie médiatique',
          report: 'Signaler un problème',
          api: 'Documentation API',
          blog: 'Blog'
        },
        madeWithLove: 'Fait avec passion pour l\'éducation en Afrique',
        sdg: {
          title: 'Objectifs de Développement Durable :',
          goal4: 'ODD 4 - Éducation de qualité',
          goal16: 'ODD 16 - Sociétés pacifiques et inclusives'
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        trustedSources: 'Trusted Sources',
        dashboard: 'Dashboard',
        aiAnalysis: 'AI Analysis',
        quizzes: 'Quizzes',
        profile: 'Profile',
        administration: 'Administration',
        logout: 'Logout',
        login: 'Login',
        register: 'Register'
      },
      header: {
        title: 'AfricaLearn',
        subtitle: 'Fight against disinformation'
      },
      home: {
        hero: {
          title1: 'Youth, Artificial Intelligence',
          title2: 'and Critical Education in Africa',
          subtitle: 'Design and develop innovative digital solutions integrating AI to improve educational life and strengthen media literacy among young people.',
          ctaPrimary: 'Join the platform',
          ctaSecondary: 'Log in',
          ctaDashboard: 'Continue learning'
        },
        mission: {
          title: 'Our Mission',
          subtitle: 'To combat disinformation, verify the reliability of sources, and strengthen the critical thinking of young people in Madagascar and Africa.'
        },
        features: {
          ai: {
            title: 'Advanced AI Analysis',
            description: 'Our artificial intelligence analyzes content to detect fake news and assess the reliability of sources.'
          },
          education: {
            title: 'Educational Paths',
            description: 'Interactive quizzes and training modules to develop critical thinking and media literacy.'
          },
          sources: {
            title: 'Source Verification',
            description: 'Database of reliable sources and cross-checking tools to validate information.'
          },
          community: {
            title: 'Engaged Community',
            description: 'Join a community of young people committed to reliable and responsible information.'
          }
        },
        stats: {
          analyses: 'Analyses completed',
          users: 'Active users',
          sources: 'Verified sources',
          countries: 'African countries'
        },
        challenges: {
          title: 'INSI Hackathon Axes',
          subtitle: 'Challenges designed to stimulate innovation and youth engagement',
          fakeNews: {
            title: 'Fake News Detection',
            description: 'Identify and report misleading content with the help of AI',
            category: 'AI & Fight against disinformation'
          },
          mediaLiteracy: {
            title: 'Media Literacy',
            description: 'Build critical thinking through adaptive learning paths',
            category: 'Critical education'
          },
          factChecking: {
            title: 'Cross-Checking',
            description: 'Compare information with reliable sources',
            category: 'Smart fact-checking'
          }
        },
        cta: {
          title: 'Ready to join the movement?',
          subtitle: 'Join thousands of young people committed to reliable and responsible information.',
          primary: 'Create a free account',
          secondary: 'Learn more',
          dashboard: 'Continue learning'
        }
      },
      about: {
        hero: {
          title: 'About AfricaLearn',
          subtitle: 'Youth, Artificial Intelligence and Digital for Critical, Inclusive and Responsible Education in Africa'
        },
        mission: {
          title: 'Our Mission',
          subtitle: 'Design and develop innovative digital solutions integrating Artificial Intelligence to improve educational life in Madagascar and Africa.'
        },
        objectives: {
          disinformation: {
            title: 'Fight disinformation',
            description: 'Develop tools to identify and report fake news in educational environments.'
          },
          sources: {
            title: 'Verify sources',
            description: 'Enable young people to verify the reliability of information sources.'
          },
          criticalThinking: {
            title: 'Strengthen critical thinking',
            description: 'Train critical analysis of digital content and social networks.'
          },
          inclusion: {
            title: 'Promote inclusion',
            description: 'Multilingual solutions adapted to African contexts and accessible.'
          }
        },
        vision: {
          title: 'Our Vision',
          paragraph1: 'Train engaged digital talents capable of navigating the complex current media environment, distinguishing reliable information from fake news, and becoming responsible actors in the dissemination of information.',
          paragraph2: 'We believe in a safer, more enlightened and responsible Internet, where young Africans are equipped with the tools necessary to understand, analyze and contribute positively to public debate.'
        },
        slogan: {
          title: 'Official INSI Slogan',
          quote: '"Youth, AI and Digital Innovation for a Smarter Education"',
          event: 'INSI Hackathon - Madagascar'
        },
        values: {
          title: 'Our Values',
          subtitle: 'Committed to sustainable and positive impact',
          qualityEducation: {
            title: 'Quality education',
            description: 'Aligned with SDG 4 for inclusive and equitable quality education.'
          },
          reliableInfo: {
            title: 'Reliable information',
            description: 'Contribution to SDG 16 for peaceful and inclusive societies.'
          },
          ethicalAI: {
            title: 'Ethical AI',
            description: 'Responsible and ethical artificial intelligence at the service of education.'
          }
        },
        cta: {
          title: 'Join the movement',
          subtitle: 'Together, let\'s build a brighter and more responsible digital future for Africa.',
          footer: 'Made with passion for education in Africa'
        }
      },
      trustedSources: {
        title: 'Trusted Sources',
        description: 'Discover our database of verified and reliable sources of information to help you navigate the media environment.',
        searchPlaceholder: 'Search for a source...',
        filters: {
          category: 'Category',
          country: 'Country',
          allCategories: 'All categories',
          allCountries: 'All countries',
          news: 'News',
          education: 'Education',
          government: 'Government',
          research: 'Research',
          international: 'International',
          reset: 'Reset'
        },
        visit: 'Visit',
        verified: 'Verified',
        score: 'Score',
        noResults: {
          title: 'No source found',
          description: 'No source matches your search criteria.',
          reset: 'Reset filters'
        },
        stats: {
          title: 'Source statistics',
          total: 'Total sources',
          verified: 'Verified sources',
          highScore: 'High score',
          countries: 'Countries covered'
        },
        error: {
          load: 'Error loading sources'
        }
      },
      dashboard: {
        welcome: 'Hello',
        subtitle: 'Welcome to your Education AI dashboard',
        stats: {
          analyses: 'Analyses completed',
          quizzes: 'Quizzes completed',
          averageScore: 'Average score',
          progress: 'Progress'
        },
        recentAnalyses: {
          title: 'Recent analyses',
          seeAll: 'See all',
          empty: 'No analysis completed',
          start: 'Start an analysis',
          verdict: {
            fiable: 'Reliable',
            douteux: 'Doubtful',
            faux: 'Fake'
          }
        },
        recentQuizzes: {
          title: 'Recent quizzes',
          seeAll: 'See all',
          empty: 'No quiz completed',
          start: 'Start a quiz',
          minutes: 'min'
        },
        quickActions: {
          title: 'Quick actions',
          analyze: 'Analyze content',
          quiz: 'Take a quiz',
          verify: 'Verify source'
        },
        error: {
          load: 'Error loading dashboard'
        }
      },
      analysis: {
        title: 'Multi-Format AI Analyzer',
        subtitle: 'Detect deepfakes, fake news and manipulations in texts, images, audio and videos.',
        inputTitle: 'Content to analyze',
        types: {
          text: 'Text',
          url: 'Link',
          image: 'Image',
          video: 'Video'
        },
        textLabel: 'Text to analyze',
        textPlaceholder: 'Paste the text...',
        urlLabel: 'Content URL',
        orImport: 'Or import a file',
        fileSelect: 'Click to select a file',
        fileFormats: 'MP3, WAV, MP4, MOV (max. 50MB)',
        analyzeButton: 'Launch intelligent analysis',
        loading: 'Analysis in progress...',
        resultsTitle: 'Analysis result',
        emptyResults: 'Select a media and launch analysis to see results',
        verdict: {
          fiable: 'Reliable',
          douteux: 'Doubtful',
          faux: 'Fake'
        },
        confidenceScore: 'Confidence score',
        analysisTime: 'Analysis time',
        showDetails: 'Show details',
        hideDetails: 'Hide details',
        detectedIssues: 'Detected issues',
        recommendations: 'Recommendations',
        sourceReliability: 'Source reliability',
        safetyWarning: 'Safety warning',
        fakeContentWarning: 'This content has been identified as potentially fake or manipulated. Share with caution.',
        error: {
          fileTooLarge: 'File is too large (max 50MB)',
          noText: 'Please enter text',
          noUrl: 'Please enter a URL',
          noFileOrUrl: 'Please select a file or enter a URL',
          generic: 'Error during analysis'
        },
        success: 'Analysis completed successfully!'
      },
      quizzes: {
        title: 'Training Space',
        filters: {
          category: 'Theme',
          difficulty: 'Level',
          allCategories: 'All themes',
          allLevels: 'All levels',
          reset: 'Reset'
        },
        categories: {
          mediaLiteracy: 'Media literacy & info',
          pedagogy: 'Pedagogical applications',
          adaptive: 'Adaptive paths',
          criticalThinking: 'Critical thinking'
        },
        levels: {
          beginner: 'Beginner (Easy)',
          intermediate: 'Intermediate (Medium)',
          advanced: 'Advanced (Hard)'
        },
        startModule: 'Start module',
        noResults: {
          title: 'No module available for this combination.',
          description: 'Try changing the difficulty or theme.'
        },
        error: {
          load: 'Filtering error'
        }
      },
      profile: {
        title: 'My Profile',
        subtitle: 'Manage your personal information and preferences',
        editButton: 'Edit profile',
        cancel: 'Cancel',
        save: 'Save',
        saving: 'Saving...',
        success: {
          update: 'Profile updated successfully!'
        },
        personalInfo: {
          title: 'Personal information',
          fullName: 'Full name',
          fullNamePlaceholder: 'Your full name',
          country: 'Country',
          selectCountry: 'Select your country',
          bio: 'Biography',
          bioPlaceholder: 'Tell us about yourself...',
          notProvided: 'Not provided'
        },
        stats: {
          title: 'Statistics',
          analyses: 'Analyses completed',
          quizzes: 'Quizzes completed',
          averageScore: 'Average score',
          streak: 'Streak days'
        },
        accountSettings: {
          title: 'Account settings',
          language: 'Language',
          languageValue: 'English',
          notifications: 'Notifications',
          notificationsValue: 'Enabled',
          privacy: 'Privacy',
          privacyValue: 'Privacy settings',
          modify: 'Modify'
        },
        roles: {
          admin: 'Administrator',
          teacher: 'Teacher',
          student: 'Student'
        },
        registeredOn: 'Registered on',
        errors: {
          fullNameTooLong: 'Name must not exceed 100 characters',
          bioTooLong: 'Biography must not exceed 500 characters'
        }
      },
      footer: {
        slogan: 'Youth, AI and Digital Innovation for a Smarter Education',
        description: 'Educational platform using artificial intelligence to combat disinformation and strengthen media literacy among young people in Africa.',
        platform: {
          title: 'Platform',
          aiAnalysis: 'AI Analysis',
          quizzes: 'Educational Quizzes',
          trustedSources: 'Trusted Sources',
          about: 'About'
        },
        resources: {
          title: 'Resources',
          guide: 'Media literacy guide',
          report: 'Report a problem',
          api: 'API Documentation',
          blog: 'Blog'
        },
        madeWithLove: 'Made with passion for education in Africa',
        sdg: {
          title: 'Sustainable Development Goals:',
          goal4: 'SDG 4 - Quality Education',
          goal16: 'SDG 16 - Peaceful and Inclusive Societies'
        }
      }
    }
  },
  mg: {
    translation: {
      nav: {
        home: 'Fandraisana',
        about: 'Momba',
        trustedSources: 'Loharano azo itokisana',
        dashboard: 'Tabilao',
        aiAnalysis: 'Fanadihadianan AI',
        quizzes: 'Fanadinana',
        profile: 'Momba ahy',
        administration: 'Fitantanana',
        logout: 'Hiala',
        login: 'Hiditra',
        register: 'Hisoratra'
      },
      header: {
        title: 'AfricaLearn',
        subtitle: 'Miady amin ny disinformation'
      },
      home: {
        hero: {
          title1: 'Tanora, AI sady',
          title2: 'Fampianarana manan-danja any Afrika',
          subtitle: 'Mamorosa sy mamoraka vahaolana nomerika vaovao mampiasa AI hanatsarana ny fiainam-pianarana sy hanamafisana ny fahaiza-mamaky vaovao amin’ny tanora.',
          ctaPrimary: 'Idirina ny sehatra',
          ctaSecondary: 'Hiditra',
          ctaDashboard: 'Tohizano ny fianarana'
        },
        mission: {
          title: 'Andraikitra',
          subtitle: 'Miady amin’ny disinformation, hamarina ny loharano azo itokisana, sy hanamafisana ny fahaiza-mamaky ny tanora eto Madagasikara sy Afrika.'
        },
        features: {
          ai: {
            title: 'Fanadihadianan AI mandroso',
            description: 'Ny AI dia manadihady ny votoatiny mba hahitana fake news sy hanombanana ny fahamarinan-toeran’ny loharano.'
          },
          education: {
            title: 'Lalana fianarana',
            description: 'Fanadinana ifandraisana sy fandaharam-pianarana hananganana fahaiza-mamaky sy fahaiza-mamaky vaovao.'
          },
          sources: {
            title: 'Fanamarinana loharano',
            description: 'Tahiry loharano azo itokisana sy fitaovana fanamarinana mba hanamarinana vaovao.'
          },
          community: {
            title: 'Fiaraha-mientana',
            description: 'Midira amin’ny fiaraha-monina tanora mikatsaka vaovao azo itokisana sy tompon’andraikitra.'
          }
        },
        stats: {
          analyses: 'Fanadihadiana vita',
          users: 'Mpampiasa miasa',
          sources: 'Loharano voamarina',
          countries: 'Firenena afrikanina'
        },
        challenges: {
          title: 'Lalan’ny Hackathon INSI',
          subtitle: 'Sarotra noforonina hamporisika ny fahaiza-mamorona sy ny fandraisana andraikitra amin’ny tanora',
          fakeNews: {
            title: 'Fahitana Fake News',
            description: 'Fantaro sy ampitandremo ny votoaty diso amin’ny alalan’ny AI',
            category: 'AI & Ady amin’ny disinformation'
          },
          mediaLiteracy: {
            title: 'Fahaiza-mamaky vaovao',
            description: 'Ampio ny fahaiza-mamaky amin’ny alalan’ny lalana mifanaraka',
            category: 'Fampianarana manan-danja'
          },
          factChecking: {
            title: 'Fanamarinana mifanila',
            description: 'Ampitahao ny vaovao amin’ny loharano azo itokisana',
            category: 'Fanamarinana fahendrena'
          }
        },
        cta: {
          title: 'Mbola miandry ve ianao?',
          subtitle: 'Midira amin’ny tanora an-arivony mikatsaka vaovao azo itokisana sy tompon’andraikitra.',
          primary: 'Hamorona kaonty maimaim-poana',
          secondary: 'Hianaroa bebe kokoa',
          dashboard: 'Tohizano ny fianarana'
        }
      },
      about: {
        hero: {
          title: 'Momba an\'i Education',
          subtitle: 'Tanora, AI nomerika sy Fampianarana manan-danja, anisan’ny, ary tompon’andraikitra any Afrika'
        },
        mission: {
          title: 'Andraikitra',
          subtitle: 'Mamorosa sy mamoraka vahaolana nomerika vaovao mampiasa AI hanatsarana ny fiainam-pianarana eto Madagasikara sy Afrika.'
        },
        objectives: {
          disinformation: {
            title: 'Miady amin’ny disinformation',
            description: 'Mamoraka fitaovana hanomezana ny famantarana sy ny famoahana fake news amin’ny tontolo fianarana.'
          },
          sources: {
            title: 'Fanamarinana loharano',
            description: 'Afaho ny tanora hanamarina ny fahamarinan-toeran’ny loharano vaovao.'
          },
          criticalThinking: {
            title: 'Hanamafisana ny fahaiza-mamaky',
            description: 'Mampio ny fahaiza-mamaky ny votoaty nomerika sy ny tambajotra sosialy.'
          },
          inclusion: {
            title: 'Manome anjara',
            description: 'Vahaolana amin’ny fiteny maro mifanaraka amin’ny toe-javatra afrikana sy azo idirana.'
          }
        },
        vision: {
          title: 'Fijery',
          paragraph1: 'Mampio talenta nomerika mandray andraikitra afaka mihetsika amin’ny tontolo vaovao sarotra, afaka manavaka ny vaovao azo itokisana sy ny fake news, ary ho lasa mpandray anjara tompon’andraikitra amin’ny fanaparitahana vaovao.',
          paragraph2: 'Mino izahay amin’ny Internet azo antoka kokoa, mazava kokoa, ary tompon’andraikitra kokoa, izay ahitana tanora afrikana manana fitaovana ilaina hahatakarana, hanadihadiana, ary hanome anjara amin’ny adihevitra ara-bahoaka.'
        },
        slogan: {
          title: 'Famaritana anaran’i INSI',
          quote: '"Youth, AI and Digital Innovation for a Smarter Education"',
          event: 'Hackathon INSI - Madagasikara'
        },
        values: {
          title: 'Soatoavina',
          subtitle: 'Mikatsaka vokatra maharitra sy tsara',
          qualityEducation: {
            title: 'Fampianarana kalitao',
            description: 'Mifanaraka amin’ny ODD 4 ho an’ny fampianarana anisan’ny sy mitovy ara-drariny kalitao.'
          },
          reliableInfo: {
            title: 'Vaovao azo itokisana',
            description: 'Fandraisana anjara amin’ny ODD 16 ho an’ny fiaraha-monina milamina sy anisan’ny.'
          },
          ethicalAI: {
            title: 'AI manan-kaja',
            description: 'AI manan-kaja sy manaja ny fitsipika amin’ny fanompoam-pianarana.'
          }
        },
        cta: {
          title: 'Midira amin’ny hetsika',
          subtitle: 'Miaraka, andeha hamboatra ho avy nomerika mazava sy tompon’andraikitra kokoa ho an’i Afrika.',
          footer: 'Natao amin’ny fitiavana ny fanabeazana any Afrika'
        }
      },
      trustedSources: {
        title: 'Loharano azo itokisana',
        description: 'Hijery ny tahirin-tsika loharano azo itokisana sy azo antoka hanampy anao handehandeha amin’ny tontolo vaovao.',
        searchPlaceholder: 'Mitadiava loharano...',
        filters: {
          category: 'Sokajy',
          country: 'Firenena',
          allCategories: 'Sokajy rehetra',
          allCountries: 'Firenena rehetra',
          news: 'Vaovao',
          education: 'Fampianarana',
          government: 'Fitondrana',
          research: 'Fikarohana',
          international: 'Iraisam-pirenena',
          reset: 'Averina'
        },
        visit: 'Tsidiho',
        verified: 'Voamarina',
        score: 'Isa',
        noResults: {
          title: 'Tsy misy loharano hita',
          description: 'Tsy misy loharano mifanaraka amin’ny fikarohana.',
          reset: 'Averina ny sivana'
        },
        stats: {
          title: 'Antontanisan’ny loharano',
          total: 'Loharano rehetra',
          verified: 'Loharano voamarina',
          highScore: 'Isa ambony',
          countries: 'Firenena voaray'
        },
        error: {
          load: 'Nisy lesy tamin’ny fampitondrana ny loharano'
        }
      },
      dashboard: {
        welcome: 'Salama',
        subtitle: 'Tonga soa amin’ny tabilao Education AI',
        stats: {
          analyses: 'Fanadihadiana vita',
          quizzes: 'Fanadinana vita',
          averageScore: 'Isa salanisa',
          progress: 'Fandrosoana'
        },
        recentAnalyses: {
          title: 'Fanadihadiana farany',
          seeAll: 'Hijery rehetra',
          empty: 'Tsy mbola nisy fanadihadiana',
          start: 'Manomboka fanadihadiana',
          verdict: {
            fiable: 'Azo itokisana',
            douteux: 'Mampiahiahy',
            faux: 'Diso'
          }
        },
        recentQuizzes: {
          title: 'Fanadinana farany',
          seeAll: 'Hijery rehetra',
          empty: 'Tsy mbola nisy fanadinana',
          start: 'Manomboka fanadinana',
          minutes: 'min'
        },
        quickActions: {
          title: 'Asa haingana',
          analyze: 'Hanadihady votoaty',
          quiz: 'Hanandrana fanadinana',
          verify: 'Hanamarina loharano'
        },
        error: {
          load: 'Nisy lesy tamin’ny fampitondrana ny tabilao'
        }
      },
      analysis: {
        title: 'Fanadihadiana AI Multi-endrika',
        subtitle: 'Fantaro ny deepfake, fake news sy ny fanovana amin’ny lahatsoratra, sary, feo ary horonan-tsary.',
        inputTitle: 'Votoaty hamarinina',
        types: {
          text: 'Soratra',
          url: 'Lien',
          image: 'Sary',
          video: 'Horonantsary'
        },
        textLabel: 'Lahatsoratra hodinihina',
        textPlaceholder: 'Apetraho eto ny lahatsoratra...',
        urlLabel: 'Rohin’ny votoaty',
        orImport: 'Na afindra avy any ivelany',
        fileSelect: 'Tsindrio raha misafidianana rakitra',
        fileFormats: 'MP3, WAV, MP4, MOV (max. 50Mo)',
        analyzeButton: 'Manomboka fanadihadiana mahay',
        loading: 'Fanadihadiana am-pandehanana...',
        resultsTitle: 'Vokatra amin’ny fanadihadiana',
        emptyResults: 'Misafidiana haino aman-jery sady manomboka fanadihadiana vao mahita vokatra',
        verdict: {
          fiable: 'Azo itokisana',
          douteux: 'Mampiahiahy',
          faux: 'Diso'
        },
        confidenceScore: 'Isa fahatokisana',
        analysisTime: 'Fotoana nanaovana',
        showDetails: 'Hijery antsipiriany',
        hideDetails: 'Afenina ny antsipiriany',
        detectedIssues: 'Olona hita',
        recommendations: 'Torohevitra',
        sourceReliability: 'Fahatokisan’ny loharano',
        safetyWarning: 'Tandremo fiarovana',
        fakeContentWarning: 'Ity votoaty ity dia voasokajy ho diso na nohavaozina. Aza mizara tsy am-piheverana.',
        error: {
          fileTooLarge: 'Be loatra ny rakitra (max 50Mo)',
          noText: 'Ampidiro lahatsoratra azafady',
          noUrl: 'Ampidiro rohy azafady',
          noFileOrUrl: 'Misafidiana rakitra na ampidiro rohy azafady',
          generic: 'Nisy lesy tamin’ny fanadihadiana'
        },
        success: 'Vita soa aman-tsara ny fanadihadiana!'
      },
      quizzes: {
        title: 'Toerana fiofanana',
        filters: {
          category: 'Lohahevitra',
          difficulty: 'Haavon’ny zava-misy',
          allCategories: 'Lohahevitra rehetra',
          allLevels: 'Haavon’ny zava-misy rehetra',
          reset: 'Averina'
        },
        categories: {
          mediaLiteracy: 'Fahaiza-mamaky vaovao & info',
          pedagogy: 'Fampiharana ara-pampianarana',
          adaptive: 'Lalana mifanaraka',
          criticalThinking: 'Fahaiza-mamaky'
        },
        levels: {
          beginner: 'Sokajy voalohany (Easy)',
          intermediate: 'Antonony (Medium)',
          advanced: 'Ambony (Hard)'
        },
        startModule: 'Manomboka ny modely',
        noResults: {
          title: 'Tsy misy modely amin’ity fitambarana ity.',
          description: 'Andramo ovaina ny haavon’ny zava-misy na ny lohahevitra.'
        },
        error: {
          load: 'Lesy amin’ny fanasahana'
        }
      },
      profile: {
        title: 'Momba ahy',
        subtitle: 'Tantano ny mombamomba anao manokana sy safidinao',
        editButton: 'Ovao ny mombamomba',
        cancel: 'Aoka',
        save: 'Tehirizina',
        saving: 'Tehirizina...',
        success: {
          update: 'Vita soa aman-tsara ny fanavaozana ny mombamomba!'
        },
        personalInfo: {
          title: 'Mombamomba manokana',
          fullName: 'Anarana feno',
          fullNamePlaceholder: 'Anaranao feno',
          country: 'Firenena',
          selectCountry: 'Misafidiana firenena',
          bio: 'Momba ahy',
          bioPlaceholder: 'Inoava momba anao...',
          notProvided: 'Tsy nomena'
        },
        stats: {
          title: 'Antontanisa',
          analyses: 'Fanadihadiana vita',
          quizzes: 'Fanadinana vita',
          averageScore: 'Isa salanisa',
          streak: 'Andro mitohy'
        },
        accountSettings: {
          title: 'Safidin’ny kaonty',
          language: 'Fiteny',
          languageValue: 'Malagasy',
          notifications: 'Fampandrenesana',
          notificationsValue: 'Alefa',
          privacy: 'Fiarovana',
          privacyValue: 'Safidy fiarovana',
          modify: 'Ovao'
        },
        roles: {
          admin: 'Mpitantana',
          teacher: 'Mpampianatra',
          student: 'Mpianatra'
        },
        registeredOn: 'Nisoratana tamin’ny',
        errors: {
          fullNameTooLong: 'Tsy tokony hihoatra ny 100 ny litera ao amin’ny anarana',
          bioTooLong: 'Tsy tokony hihoatra ny 500 ny litera ao amin’ny mombamomba'
        }
      },
      footer: {
        slogan: 'Youth, AI and Digital Innovation for a Smarter Education',
        description: 'Educational platform using artificial intelligence to combat disinformation and strengthen media literacy among young people in Africa.',
        platform: {
          title: 'Platform',
          aiAnalysis: 'AI Analysis',
          quizzes: 'Educational Quizzes',
          trustedSources: 'Trusted Sources',
          about: 'About'
        },
        resources: {
          title: 'Resources',
          guide: 'Media literacy guide',
          report: 'Report a problem',
          api: 'API Documentation',
          blog: 'Blog'
        },
        madeWithLove: 'Made with passion for education in Africa',
        sdg: {
          title: 'Sustainable Development Goals:',
          goal4: 'SDG 4 - Quality Education',
          goal16: 'SDG 16 - Peaceful and Inclusive Societies'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;