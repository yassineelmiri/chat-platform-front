# Chat Platform Front

![image](https://github.com/user-attachments/assets/39d800e6-6cbe-4afb-98d1-274ee4e786cc)


Le **Chat Platform Front** est le client web développé avec React.js et TypeScript pour interagir avec la plateforme de messagerie en temps réel.

---

## 🌟 Fonctionnalités principales

- **Gestion des canaux** :
  - Affichage des canaux publics et privés.
  - Accès aux canaux temporaires.
- **Chat en temps réel** : Mise à jour en direct via WebSocket.
- **Notifications** : Pour les demandes d'amis, invitations et messages directs.
- **Système d'amis** : Gestion des relations et suivi du statut (en ligne/hors ligne).
- **Interface utilisateur intuitive** :
  - Séparation claire des responsabilités avec des composants réutilisables.
  - Utilisation de TypeScript pour une base de code robuste et maintenable.

---

## 🚀 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- Une instance en cours d'exécution de l'API Chat Platform

### Étapes d'installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/yassineelmiri/chat-platform-front.git
   cd chat-platform-front
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement dans `.env` :
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```

4. Lancez l'application en mode développement :
   ```bash
   npm start
   ```

5. Accédez à l'application sur [http://localhost:3000](http://localhost:3000).

---

## 🧪 Tests

- Exécutez les tests unitaires :
  ```bash
  npm run test
  ```

---

## 🛠️ Technologies utilisées

- **Framework** : React.js avec TypeScript
- **UI** : Tailwind CSS
- **Gestion d'état** : Redux
- **Tests** : Jest
- **CI/CD** : GitHub Actions

---

## 🤝 Contribution

Les contributions sont les bienvenues. Suivez ces étapes :
1. Forkez le dépôt.
2. Créez une branche :
   ```bash
   git checkout -b feature/nom-fonctionnalite
   ```
3. Soumettez une Pull Request.
