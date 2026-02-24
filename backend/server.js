const express = require("express");
require("dotenv").config();       // ← Ajouté pour charger .env
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connexion à la base de données
connectDB();

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("HealthMate backend is running 💚");
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});