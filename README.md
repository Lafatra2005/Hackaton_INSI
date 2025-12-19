# Hackaton_INSI

Application Web pour le Hackathon INSI Décembre 2025.

## 🚀 Déploiement
Le déploiement est **automatique** via Jenkins.
Il suffit de pousser votre code sur le dépôt Git.

1. **Committez vos changements :**
   ```bash
   git add .
   git commit -m "Mise à jour pour déploiement"
   ```
2. **Poussez vers le dépôt :**
   ```bash
   git push origin main
   ```
3. **Accès :**
   Votre application sera accessible après quelques minutes sur : `https://[NOM-DU-REPO].insi.local`

## 🛠 Structure du Projet
- **`web` (frontend/)** : Application React (Vite). Écoute sur le port 3000.
- **`api` (backend/)** : API Express/Node.js. Écoute sur le port 5000.
- **`db` (database/)** : Base de données MySQL.

## 💻 Installation Locale (Dev)
Pour tester sur votre machine avant de pousser :

1. **Lancer avec Docker Compose :**
   ```bash
   docker-compose up --build
   ```
2. **Accéder à l'application :**
   Le `docker-compose.yml` est configuré pour la **production** (pas de ports exposés).
   *Pour tester en local, vous devez modifier temporairement `docker-compose.yml` pour ajouter `ports: - "3000:3000"` au service `web`.*
