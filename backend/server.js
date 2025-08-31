import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ENV
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripePk = process.env.STRIPE_PUBLISHABLE_KEY;
const priceAmount = Number(process.env.PRICE_AMOUNT || 36000); // 360.00 EUR
const priceCurrency = process.env.PRICE_CURRENCY || "eur";

if (!stripeSecret || !stripePk) {
  console.warn("⚠️  Configurez STRIPE_SECRET_KEY et STRIPE_PUBLISHABLE_KEY dans backend/.env");
}

const stripe = new Stripe(stripeSecret || "", {
  apiVersion: "2024-06-20",
});

// Health
app.get("/", (_, res) => res.json({ ok: true }));

// Expose publishable key
app.get("/config", (_, res) => {
  res.json({
    publishableKey: stripePk,
    amount: priceAmount,
    currency: priceCurrency,
  });
});

// Create PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { metadata } = req.body || {};
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceAmount,
      currency: priceCurrency,
      // Active automatiquement les méthodes pertinentes (wallets, 3DS...)
      automatic_payment_methods: { enabled: true },
      metadata: {
        product: "Formation Trading — Accès complet",
        ...metadata,
      },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: { message: err.message } });
  }
});

const port = process.env.PORT || 4242;
app.listen(port, () => {
  console.log(`✅ API Stripe dispo sur http://localhost:${port}`);
});
