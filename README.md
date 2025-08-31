# Starter — Formation Trading (Stripe + Apple Pay / Google Pay)

Projet minimal pour accepter les paiements (Apple Pay / Google Pay via Payment Request) avec fallback par carte (Stripe Elements).

## Structure
- `backend/` — API Node.js (Express) : création de PaymentIntent, config Stripe.
- `frontend/` — Page de paiement HTML/CSS/JS minimaliste.

## Prérequis
- Node.js 18+
- Compte Stripe (mode test)
- Clés Stripe : **publishable key** et **secret key** (test)

## Lancer en local
1) Copier vos clés dans `backend/.env` :
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PRICE_AMOUNT=36000
PRICE_CURRENCY=eur
```
2) Installer les dépendances et démarrer l'API :  
```
cd backend
npm install
npm run dev
```
- API par défaut : `http://localhost:4242`

3) Ouvrir la page front :  
- Méthode A : servir `frontend/` via un serveur statique local **ou**
- Méthode B (simple) : changer `API_BASE_URL` dans `frontend/index.html` pour `http://localhost:4242` puis ouvrir `index.html` dans le navigateur.

## Déploiement gratuit (proposition simple)
- **Backend** → Render.com / Railway.app (Node/Express)
- **Frontend** → Netlify / Vercel (statique)
- Dans `frontend/index.html`, mettre `API_BASE_URL` = URL de votre backend en ligne.

## Apple Pay / Google Pay
- **Apple Pay (Web)** : ajouter votre domaine dans le Dashboard Stripe > Apple Pay puis suivre la **vérification de domaine** (fichier `.well-known`).
- **Google Pay (Web)** : activer dans Dashboard Stripe (pas de fichier à héberger).
- Le bouton Wallet s'affiche **automatiquement** selon l'appareil/navigateur ; sinon, fallback carte.

## Sécurité & conformité
- Servir en **HTTPS** en production.
- Conserver la mention risques trading, CGV, rétractation/remboursement si applicable.
- Stripe gère SCA/3‑D Secure lorsque nécessaire.

## Test
- Utiliser les cartes de test Stripe (ex: 4242 4242 4242 4242).
- Tester les trois cas : succès, 3DS requis, échec/refus.
