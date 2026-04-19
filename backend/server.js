const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const planRoutes = require("./routes/planRoutes");
const emailRoutes = require('./routes/emailRoutes');
          
const chatRoutes = require('./routes/chatRoutes');

const { startWeeklyPlanCron } = require("./cron/weeklyPlan");
const { startEmailCron } = require('./cron/emailCron');       
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

// Cron — un seul setTimeout suffit
setTimeout(() => {
  startWeeklyPlanCron();
  startEmailCron();
}, 3000);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/email", emailRoutes);       

// Route test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connecté avec succès ✅" });
});
app.use('/api/chat', chatRoutes);
// Route principale
app.get("/", (req, res) => res.send("HealthMate backend is running 💚"));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));