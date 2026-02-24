const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Nodemailer : configuration Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------------------- REGISTER USER --------------------
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      birthDate,
      gender,
      height,
      weight,
      goal,
    } = req.body;

    // Vérification champs obligatoires
    if (!firstName || !lastName || !email || !phone || !password || !birthDate || !gender || !height || !weight || !goal) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires ❌" });
    }

    // ✅ Validation mot de passe sécurisé
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial ❌" 
      });
    }

    // Vérifier si utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Utilisateur déjà existant ❌" });

    // Hasher mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer token de vérification
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Créer utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      birthDate,
      gender,
      height,
      weight,
      goal,
      verificationToken,
      isVerified: false,
      loginAttempts: 0, // ajout compteur
      lockUntil: null,  // ajout blocage
    });

    // Lien de vérification
    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;
    const notMeLink = `${process.env.BACKEND_URL}/api/auth/report-activity/${verificationToken}`;

    // Email HTML avec deux boutons style Gmail
    const mailOptions = {
      from: `"HealthMate 💚" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reconnaissez-vous cette activité ?",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
          <h2 style="color:#333;">Reconnaissez-vous cette activité ?</h2>
          <p>Nous avons reçu une demande d'inscription sur <b>HealthMate</b> pour ce compte.</p>
          <div style="margin-top:30px;">
            <a href="${verificationLink}" 
               style="display:inline-block; padding:12px 25px; margin-right:10px; background-color:#1a73e8; color:white; text-decoration:none; border-radius:4px; font-weight:bold;">
              Oui, c'était moi ✅
            </a>
            <a href="${notMeLink}" 
               style="display:inline-block; padding:12px 25px; background-color:#d93025; color:white; text-decoration:none; border-radius:4px; font-weight:bold;">
              Non, sécuriser mon compte ❌
            </a>
          </div>
          <p style="margin-top:20px; color:#555;">Si vous n'avez pas initié cette demande, cliquez sur "Non, sécuriser mon compte" pour protéger votre compte.</p>
          <p style="margin-top:20px; color:#999; font-size:12px;">— L’équipe HealthMate 💚</p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email de vérification envoyé ✅ :", info.response);
    } catch (error) {
      console.error("Erreur envoi email de vérification ❌ :", error);
      return res.status(500).json({ message: "Impossible d'envoyer l'email de vérification ❌" });
    }

    res.status(201).json({ message: "Inscription réussie ✅ Vérifiez votre email pour activer le compte." });
  } catch (error) {
    console.error("REGISTER ERROR ❌", error.message);
    res.status(500).json({ message: "Erreur serveur ❌" });
  }
};

// -------------------- VERIFY EMAIL --------------------
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Token invalide ❌");

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Email de bienvenue HTML
    const mailOptions = {
      from: `"HealthMate 💚" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Bienvenue sur HealthMate 💚",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
          <h2>Bonjour ${user.firstName} ${user.lastName},</h2>
          <p>Votre inscription est confirmée ✅</p>
          <p>Bienvenue sur <b>HealthMate</b> ! Commencez à suivre vos objectifs dès maintenant !</p>
          <p style="margin-top:20px; color:#999; font-size:12px;">— L’équipe HealthMate 💚</p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email de bienvenue envoyé ✅ :", info.response);
    } catch (error) {
      console.error("Erreur envoi email de bienvenue ❌ :", error);
    }

    res.send("Email vérifié ✅ Votre compte est activé, vous pouvez maintenant vous connecter !");
  } catch (error) {
    console.error("VERIFY EMAIL ERROR ❌", error.message);
    res.status(500).send("Erreur serveur ❌");
  }
};

// -------------------- LOGIN USER --------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Tous les champs sont obligatoires ❌" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur introuvable ❌" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Veuillez vérifier votre email avant de vous connecter ❌" });

    // Vérifier si le compte est bloqué
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const secondes = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(403).json({ message: `Compte bloqué ❌. Réessayez dans ${secondes} seconde(s).` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 1 * 60 * 1000; // Bloqué 1 minute
        await user.save();
        return res.status(403).json({ message: "Compte bloqué après 3 tentatives ❌. Réessayez dans 1 minute." });
      }

      await user.save();
      return res.status(400).json({ message: `Mot de passe incorrect ❌. Tentative ${user.loginAttempts}/3.` });
    }

    // Mot de passe correct → réinitialiser tentatives
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Connexion réussie ✅",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR ❌", error.message);
    res.status(500).json({ message: "Erreur serveur ❌" });
  }
};

// -------------------- REPORT ACTIVITY --------------------
const reportActivity = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Token invalide ❌");

    // Supprime l’utilisateur si ce n'est pas lui
    await User.deleteOne({ _id: user._id });

    res.send("Action détectée ✅ Votre compte n'a pas été activé et a été supprimé.");
  } catch (error) {
    console.error("REPORT ACTIVITY ERROR ❌", error.message);
    res.status(500).send("Erreur serveur ❌");
  }
};

// -------------------- FORGOT PASSWORD --------------------
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Veuillez entrer votre email ❌" });

    const user = await User.findOne({ email });

    // ⚠️ Pour sécurité : ne pas dire si email existe ou non
    if (!user)
      return res.status(200).json({ message: "Si cet email existe, un lien a été envoyé ✅" });

    // Générer token sécurisé
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.BACKEND_URL}/api/auth/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"HealthMate 💚" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <a href="${resetLink}"
             style="display:inline-block;padding:12px 25px;background-color:#1a73e8;color:white;text-decoration:none;border-radius:4px;">
             Réinitialiser mon mot de passe
          </a>
          <p style="margin-top:15px;">Ce lien expire dans 15 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Si cet email existe, un lien a été envoyé ✅" });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR ❌", error.message);
    res.status(500).json({ message: "Erreur serveur ❌" });
  }
};


// -------------------- RESET PASSWORD --------------------
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token invalide ou expiré ❌" });

    // Validation mot de passe sécurisé
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial ❌",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    // Supprimer token après utilisation
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // 🔐 Réinitialiser aussi les tentatives
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès ✅",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR ❌", error.message);
    res.status(500).json({ message: "Erreur serveur ❌" });
  }
};
// -------------------- GET PROFILE (PROTECTED) --------------------
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Profil utilisateur récupéré ✅",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur ❌" });
  }
};

module.exports = { 
  registerUser, 
  verifyEmail, 
  loginUser, 
  reportActivity,
  forgotPassword,
  resetPassword,
  getProfile
};