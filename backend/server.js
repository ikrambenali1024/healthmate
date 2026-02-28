const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
<<<<<<< HEAD
const cors = require("cors");
=======
require("dotenv").config();
const cors = require("cors");

>>>>>>> frontend-auth

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

// Routes d'authentification
app.use("/api/auth", authRoutes);

// ✅ Route test pour vérifier la connexion frontend/backend
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connecté avec succès ✅" });
});

<<<<<<< HEAD
// Route principale
app.get("/", (req, res) => res.send("HealthMate backend is running 💚"));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> frontend-auth
