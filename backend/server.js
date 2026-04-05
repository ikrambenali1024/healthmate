const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const planRoutes = require("./routes/planRoutes");                    // ← NOUVEAU
const { startWeeklyPlanCron } = require("./cron/weeklyPlan");         // ← NOUVEAU
const cors = require("cors");

const app = express();

// CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// JSON parser
app.use(express.json());

// Connexion à la base de données
connectDB();

// Démarrage du cron après 3 secondes (laisse le temps à MongoDB de se connecter)
setTimeout(() => {
  startWeeklyPlanCron();                                                // ← NOUVEAU
}, 3000);

// Routes d'authentification
app.use("/api/auth", authRoutes);

// Routes du tableau de bord
app.use("/api/dashboard", dashboardRoutes);

// Routes du plan hebdomadaire
app.use("/api/plan", planRoutes);                                      // ← NOUVEAU

// Route test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connecté avec succès ✅" });
});

// Route principale
app.get("/", (req, res) => res.send("HealthMate backend is running 💚"));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));