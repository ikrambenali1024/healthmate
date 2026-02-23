import { useState } from "react";
import "../styles/auth.css";
import { Link } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
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
    };
    console.log(userData);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Créer un compte 🌿</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Numéro de téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="date"
            placeholder="Date de naissance"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Sélectionnez le sexe</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
          </select>
          <input
            type="number"
            placeholder="Taille (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="Poids (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <input
            type="text"
            placeholder="Objectif (ex : Perte de poids)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />

          <button type="submit">S'inscrire</button>
        </form>

        <p>
          Déjà un compte ? <Link to="/">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;