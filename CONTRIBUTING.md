# Guide de Contribution

## 🌳 Structure des Branches

```
main
├── develop
│   ├── feature/*
│   ├── bugfix/*
│   └── docs/*
└── hotfix/*
```

- `main` : Code en production
- `develop` : Branche principale de développement
- `feature/*` : Nouvelles fonctionnalités (ex: `feature/add-auth`)
- `bugfix/*` : Corrections de bugs (ex: `bugfix/fix-login-error`)
- `hotfix/*` : Correctifs urgents pour la production
- `docs/*` : Modifications de la documentation

## 📝 Convention de Nommage des Commits

Format : `type(scope): description courte`

Types :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage, point-virgules manquants, etc.
- `refactor` : Refactoring du code
- `test` : Ajout ou modification de tests
- `chore` : Maintenance, dépendances, etc.

Exemple :
```
feat(auth): ajouter l'authentification Google

- Intégration de l'API Google OAuth
- Ajout du bouton de connexion
- Gestion des tokens et de la session
```

## 🔄 Workflow de Développement

1. **Création de branche**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/ma-fonctionnalite
   ```

2. **Développement**
   - Commits réguliers
   - Tests unitaires
   - Documentation à jour

3. **Préparation de la PR**
   ```bash
   git fetch origin develop
   git rebase origin/develop
   git push origin feature/ma-fonctionnalite
   ```

4. **Pull Request**
   - Description détaillée
   - Screenshots si UI/UX
   - Liste des tests effectués
   - Références aux issues

## 👀 Revue de Code

### Critères de Validation
- ✅ Tests passent
- ✅ Code lisible et documenté
- ✅ Pas de conflits
- ✅ Respect des standards
- ✅ Performance acceptable

### Process
1. Au moins 1 approbation requise
2. Tous les commentaires résolus
3. CI/CD pipeline réussi
4. Merge possible

## 🛡️ Protection des Branches

### Main
- ❌ Push direct interdit
- ✅ PR requise
- ✅ 1 revue minimum
- ✅ CI/CD réussi
- ✅ Branches à jour

### Develop
- ❌ Push direct interdit
- ✅ PR requise
- ✅ 1 revue minimum

## 🧪 Tests

- Tests unitaires pour chaque fonctionnalité
- Tests d'intégration pour les flux critiques
- Tests e2e pour les parcours utilisateur

```bash
# Lancer les tests
npm run test

# Lancer les tests avec couverture
npm run test:coverage
```

## 📚 Documentation

- README.md à jour
- JSDoc pour les fonctions importantes
- Commentaires pour le code complexe
- Documentation API si applicable

## 🚀 Déploiement

1. Merge dans `develop`
2. Tests de staging
3. PR vers `main`
4. Déploiement automatique

## 🐛 Gestion des Bugs

1. Créer une issue
2. Branche `bugfix/*`
3. Fix + tests
4. PR vers `develop`

Pour les bugs critiques en production :
1. Branche `hotfix/*` depuis `main`
2. Fix + tests
3. PR vers `main` ET `develop`

## 💻 Setup Développement

```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 📋 Checklist PR

- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Changelog mis à jour si nécessaire
- [ ] Version bumped si nécessaire
- [ ] Code reviewé
- [ ] Conflicts résolus
- [ ] Build réussi
