-- Base de données pour la plateforme éducative IA
-- Jeunesse, Intelligence Artificielle et Numérique pour une éducation critique

CREATE DATABASE IF NOT EXISTS education_ai_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE education_ai_platform;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('etudiant', 'enseignant', 'admin') DEFAULT 'etudiant',
    avatar_url VARCHAR(500),
    bio TEXT,
    country VARCHAR(100),
    language VARCHAR(50) DEFAULT 'fr',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des articles/analyses de fake news
CREATE TABLE IF NOT EXISTS content_analysis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content_url VARCHAR(1000),
    content_text TEXT,
    content_type ENUM('text', 'image', 'video', 'url') DEFAULT 'text',
    ai_score DECIMAL(5,2), -- Score de 0 à 100
    ai_verdict ENUM('fiable', 'douteux', 'faux', 'non pertinent') DEFAULT 'douteux',
    ai_explanation TEXT,
    reliability_factors JSON,
    bias_indicators JSON,
    fact_check_sources JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des sources fiables
CREATE TABLE IF NOT EXISTS trusted_sources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    description TEXT,
    category ENUM('news', 'education', 'government', 'research', 'international') DEFAULT 'news',
    country VARCHAR(100),
    language VARCHAR(50),
    reliability_score DECIMAL(3,2) DEFAULT 0.95,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des quiz et parcours éducatifs
CREATE TABLE IF NOT EXISTS quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- media_literacy, critical_thinking, fact_checking
    difficulty ENUM('debutant', 'intermediaire', 'avance') DEFAULT 'debutant',
    language VARCHAR(50) DEFAULT 'fr',
    questions_count INT DEFAULT 0,
    time_limit_minutes INT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des questions
CREATE TABLE IF NOT EXISTS questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'open_ended') DEFAULT 'multiple_choice',
    options JSON,
    correct_answer TEXT,
    explanation TEXT,
    media_url VARCHAR(500),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des résultats des quiz
CREATE TABLE IF NOT EXISTS quiz_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    answers JSON,
    time_spent_seconds INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_id (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des fact-checks communautaires
CREATE TABLE IF NOT EXISTS community_fact_checks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_analysis_id INT NOT NULL,
    user_id INT NOT NULL,
    verdict ENUM('fiable', 'douteux', 'faux') NOT NULL,
    explanation TEXT,
    sources JSON,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_analysis_id) REFERENCES content_analysis(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_content_id (content_analysis_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des rapports d'apprentissage
CREATE TABLE IF NOT EXISTS learning_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    completed_lessons INT DEFAULT 0,
    total_lessons INT DEFAULT 0,
    achievements JSON,
    streak_days INT DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_module (user_id, module_name),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type ENUM('info', 'warning', 'success', 'achievement') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    related_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des données initiales

-- Sources fiables par défaut
INSERT INTO trusted_sources (name, url, description, category, country, language, reliability_score, is_verified) VALUES
('UNICEF', 'https://www.unicef.org', 'Fonds des Nations Unies pour l enfance', 'international', 'International', 'fr', 0.98, TRUE),
('UNESCO', 'https://www.unesco.org', 'Organisation des Nations Unies pour l éducation, la science et la culture', 'international', 'International', 'fr', 0.98, TRUE),
('France 24', 'https://www.france24.com', 'Chaîne d information internationale', 'news', 'France', 'fr', 0.92, TRUE),
('RFI', 'https://www.rfi.fr', 'Radio France Internationale', 'news', 'France', 'fr', 0.91, TRUE),
('Madagascar Tribune', 'https://www.madagascar-tribune.com', 'Journal malgache d information', 'news', 'Madagascar', 'fr', 0.88, TRUE),
('OECD', 'https://www.oecd.org', 'Organisation de coopération et de développement économiques', 'research', 'International', 'fr', 0.96, TRUE),
('Ministère de l Education Madagascar', 'https://www.education.gov.mg', 'Site officiel du ministère de l éducation nationale', 'government', 'Madagascar', 'fr', 0.95, TRUE);

-- Quiz de littératie médiatique
INSERT INTO quizzes (title, description, category, difficulty, language, questions_count, time_limit_minutes) VALUES
('Introduction à la littératie médiatique', 'Apprenez les bases de l analyse critique des médias', 'media_literacy', 'debutant', 'fr', 10, 15),
('Identifier les fake news', 'Entraînez-vous à reconnaître les informations trompeuses', 'fact_checking', 'intermediaire', 'fr', 12, 20),
('L esprit critique et les réseaux sociaux', 'Développez votre esprit critique sur les réseaux sociaux', 'critical_thinking', 'intermediaire', 'fr', 8, 15);

-- Questions pour le quiz d introduction
INSERT INTO questions (quiz_id, question_text, question_type, options, correct_answer, explanation, order_index) VALUES
(1, 'Qu est-ce que la littératie médiatique ?', 'multiple_choice', '["La capacité à lire des livres", "La capacité à accéder, analyser, évaluer et créer des médias", "La capacité à utiliser un ordinateur", "La capacité à écrire des articles"]', 'La capacité à accéder, analyser, évaluer et créer des médias', 'La littératie médiatique comprend l ensemble des compétences nécessaires pour naviguer dans l environnement médiatique.', 1),
(1, 'Les réseaux sociaux sont toujours une source d information fiable.', 'true_false', '["Vrai", "Faux"]', 'Faux', 'Les réseaux sociaux contiennent des informations variées, mais pas toujours vérifiées. Il faut toujours vérifier les sources.', 2),
(1, 'Quels sont les signaux d alerte d une information douteuse ?', 'multiple_choice', '["Des fautes d orthographe, des sources manquantes, un manque de datation", "Un titre accrocheur", "Des images colorées", "Des commentaires négatifs"]', 'Des fautes d orthographe, des sources manquantes, un manque de datation', 'Plusieurs éléments peuvent mettre la puce à l oreille : la qualité rédactionnelle, la présence de sources, la datation.', 3);

-- Utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES
('admin', 'admin@education-ai.com', '$2b$10$rOvFTJg6/8SH5jlZemH3JOcVPR5HM9C/KZKncnL7TB7o5DmI6zAA6m', 'Administrateur', 'admin', TRUE);

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.created_at,
    COUNT(DISTINCT ca.id) as analyses_count,
    COUNT(DISTINCT qr.id) as quizzes_completed,
    AVG(qr.score) as average_score,
    MAX(qr.completed_at) as last_activity
FROM users u
LEFT JOIN content_analysis ca ON u.id = ca.user_id
LEFT JOIN quiz_results qr ON u.id = qr.user_id
WHERE u.role = 'etudiant'
GROUP BY u.id;

CREATE VIEW daily_analysis_stats AS
SELECT 
    DATE(created_at) as analysis_date,
    COUNT(*) as total_analyses,
    AVG(ai_score) as average_score,
    COUNT(CASE WHEN ai_verdict = 'fiable' THEN 1 END) as reliable_count,
    COUNT(CASE WHEN ai_verdict = 'douteux' THEN 1 END) as doubtful_count,
    COUNT(CASE WHEN ai_verdict = 'faux' THEN 1 END) as fake_count
FROM content_analysis
GROUP BY DATE(created_at)
ORDER BY analysis_date DESC;