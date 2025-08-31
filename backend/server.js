// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();

/* =======================
   CORS
   - Dev : ouvert (pratique en local)
   - Prod : voir variante "whitelist" plus bas
======================= */
app.use(cors()); // <-- en prod tu peux remplacer par la variante whitelist ci-dessous

app.use(express.json());

/* =======================
   ENV
======================= */
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripePk = process.env.STRIPE_PUBLISHABLE_KEY;
const priceAmount = Number(process.env.PRICE_AMOUNT || 36000); // ex. 360.00 €
const priceCurrency = process.env.PRICE_CURRENCY || "eur";

if (!stripeSecret || !stripePk) {
  console.warn("⚠️  Configurez STRIPE_SECRET_KEY et STRIPE_PUBLISHABLE_KEY dans les variables d'environnement.");
}

/* =======================
   Stripe
======================= */
const stripe = new Stripe(stripeSecret || "", {
  apiVersion: "2024-06-20",
});

/* =======================
   Routes
======================= */

// Healthcheck simple
app.get("/", (_, res) => res.json({ ok: true }));

// Exposer la clé publishable + prix au frontend
app.get("/config", (_, res) => {
  res.json({
    publishableKey: stripePk,
    amount: priceAmount,
    currency: priceCurrency,
  });
});

// Créer un PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { metadata } = req.body || {};
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceAmount,
      currency: priceCurrency,
      // Active automatiquement CB + Apple Pay/Google Pay + 3DS si requis
      automatic_payment_methods: { enabled: true },
      metadata: {
        product: "Formation Trading — Accès complet",
        ...metadata,
      },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("create-payment-intent error:", err);
    res.status(400).json({ error: { message: err.message } });
  }
});

/* =======================
   Lancement serveur
======================= */
const port = process.env.PORT || 4242;
app.listen(port, () => {
  console.log(`✅ API Stripe démarrée (port ${port})`);
});

/* =======================
   Variante CORS "whitelist" (à utiliser en PROD)
   1) commente app.use(cors()) plus haut
   2) décommente le bloc suivant, et remplace l'URL par ton front
======================= */
// const allowed = [
//   "https://trading-sitea.vercel.app",    // ton front Vercel
//   process.env.FRONTEND_ORIGIN            // optionnel : domaine custom
// ].filter(Boolean);
// app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)) }));
