const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true, enum: ["Homme", "Femme"] },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    goal: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // ✅ Pour la vérification email
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    // 🔒 Pour le blocage du compte après 3 tentatives échouées
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);