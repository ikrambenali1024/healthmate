const User = require("../models/user");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérification
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérifier si l'utilisateur existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
  console.error("REGISTER ERROR ❌", error);
  res.status(500).json({
    message: "Erreur serveur ❌",
    error: error.message,
  });
}

};

module.exports = { registerUser };
