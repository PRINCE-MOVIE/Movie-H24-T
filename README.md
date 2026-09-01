# PRINCE X KAIRO MOVIE

Site "où regarder" : recherche de films via l'API [TMDB](https://www.themoviedb.org/) et affichage des plateformes de streaming légales disponibles (Netflix, Canal+, Apple TV, etc.).

## Installation

1. Copie `config.example.js` en `config.js`
2. Récupère une clé API (Read Access Token) sur https://www.themoviedb.org/settings/api
3. Colle-la dans `config.js` :
   ```js
   const TMDB_API_KEY = "TA_CLE_ICI";
   ```
4. Ouvre `index.html` dans un navigateur (ou sers le dossier avec un serveur statique).

## ⚠️ Sécurité de la clé API

`config.js` est chargé côté navigateur : n'importe qui peut l'ouvrir avec les outils de développement et voir la clé. `.gitignore` empêche de la recommitter, mais **si le dépôt a déjà été poussé sur GitHub avec la clé en clair, régénère-la immédiatement** sur TMDB (Settings → API → Reset). Pour un vrai site en production, la clé devrait rester sur un serveur backend qui relaie les appels à TMDB, pas dans le code du navigateur.

## Comptes utilisateurs

L'inscription/connexion (`inscription.html` / `connexion.html`) est une démo **100 % côté navigateur** : les comptes sont stockés dans le `localStorage` de chaque visiteur, sans mot de passe chiffré ni serveur. Ça permet de montrer le flux (navbar, "Mon compte", déconnexion...) mais ce n'est pas une authentification sécurisée. Pour de vrais comptes, il faut un backend (ex: Node/Express + base de données) avec hachage des mots de passe (bcrypt) et sessions ou JWT.

## Fonctionnalités

- Recherche de films par titre (TMDB `search/movie`)
- Films populaires affichés par défaut
- Filtrage par genre (TMDB `discover/movie`)
- Fiche détaillée par film (synopsis, note, bande-annonce, plateformes)
- Ma Liste (favoris) sauvegardée en local
- Inscription / connexion / déconnexion (démo locale)
- Offre "Premium" (démo, aucun paiement réel n'est traité — voir `script.js`)

## Structure

- `index.html` — page principale
- `inscription.html` / `connexion.html` — comptes (démo locale)
- `info.html` — pages footer (à propos, aide, CGU, confidentialité, contact, cookies)
- `script.js` — logique JS
- `style.css` — styles
- `config.js` — clé API TMDB (à créer depuis `config.example.js`, non commité)
