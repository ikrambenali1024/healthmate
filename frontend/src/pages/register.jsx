
import { useState } from "react";
import "../styles/auth.css";
import "../styles/animation.css";
import "../styles/components.css";
<<<<<<< Updated upstream
import { Link } from "react-router-dom";

function Register() {
=======

import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";

function Register() {
  const navigate = useNavigate(); 
  
>>>>>>> Stashed changes
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",
    height: "",
    weight: "",
    goal: ""
  });
  
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
<<<<<<< Updated upstream
=======
  const [success, setSuccess] = useState(""); 
>>>>>>> Stashed changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) setPasswordStrength('weak');
    else if (password.length < 10) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  

  const createParticles = () => {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animation = `particleFall ${1 + Math.random() * 2}s linear forwards`;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

<<<<<<< Updated upstream
    // Simulation d'inscription
    setTimeout(() => {
      console.log("Inscription réussie", formData);
=======
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      birthDate: formData.birthDate,
      gender: formData.gender,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      goal: formData.goal
    };

    try {
  
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      console.log("Réponse du serveur:", response.data);
      
  
      setSuccess("Inscription réussie ! Redirection vers la connexion...");
      createParticles();
      
     
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      
      if (err.response) {
      
        setError(err.response.data.message || "Une erreur est survenue");
      } else if (err.request) {
       
        setError("Impossible de contacter le serveur. Vérifie ta connexion.");
      } else {
       
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
>>>>>>> Stashed changes
      setLoading(false);
      createParticles(); // Effet de célébration
    }, 2000);
  };

  
  const carouselItems = [
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme',
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme',
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme'
  ];

  return (
    <div className="auth-container">
      {}
      <div className="photo-collage">
        <div className="collage-item" style={{ left: '8%', top: '12%', transform: 'rotate(-5deg)' }}>
          <img src="/assets/images/register-bg-1.jpg" alt="" />
        </div>
        <div className="collage-item" style={{ left: '82%', top: '65%', transform: 'rotate(10deg)' }}>
          <img src="/assets/images/register-bg-2.jpg" alt="" />
        </div>
        <div className="collage-item" style={{ left: '70%', top: '25%', transform: 'rotate(-8deg)' }}>
          <img src="/assets/images/register-bg-3.jpg" alt="" />
        </div>
      </div>

      {}
      <div className="grain"></div>

      {}
      <div className="blob blob-a"></div>
      <div className="blob blob-b"></div>
      <div className="blob blob-c"></div>
      <div className="blob blob-d"></div>

<<<<<<< Updated upstream
      {/* Main Auth Box (plus large pour register) */}
      <div className="auth-box register-box">
        {/* NOUVEAU LOGO - COEUR */}
       {/* Logo Coeur - Version Rose */}
<div className="auth-logo">
  <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #E8648A, #C44B72)' }}>
    <svg viewBox="0 0 24 24" width="28" height="28">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
    </svg>
  </div>
  <span className="auth-logo-name">HealthMate</span>
</div>
=======
      {}
      <div className="auth-box register-box">
        {}
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #E8648A, #C44B72)' }}>
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
            </svg>
          </div>
          <span className="auth-logo-name">HealthMate</span>
        </div>
>>>>>>> Stashed changes

        <h2>Créer ton <em>compte</em></h2>
        <p className="auth-subtitle">Rejoins la communauté HealthMate 🌿</p>

<<<<<<< Updated upstream
=======
        {}
        {success && <div className="success-message">{success}</div>}
>>>>>>> Stashed changes

        {}
        <form onSubmit={handleSubmit}>
          <div className="register-grid">
            <div className="form-group">
              <label>Prénom</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nom"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nom</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Prénom"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                placeholder="nom@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <div className="input-wrapper">
              <span className="input-icon">📱</span>
              <input
                type="tel"
                name="phone"
                placeholder="+216"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-grid">
            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="password-strength">
                <div className={`strength-bar ${passwordStrength}`}></div>
              </div>
            </div>

            <div className="form-group">
              <label>Confirmer</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="register-grid">
            <div className="form-group">
              <label>Date de naissance</label>
              <div className="input-wrapper">
                <span className="input-icon">🎂</span>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Sexe</label>
              <div className="input-wrapper">
                <span className="input-icon">⚥</span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionne</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>
            </div>
          </div>

          <div className="register-grid">
            <div className="form-group">
              <label>Taille (cm)</label>
              <div className="input-wrapper">
                <span className="input-icon">📏</span>
                <input
                  type="number"
                  name="height"
                  placeholder="175"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Poids (kg)</label>
              <div className="input-wrapper">
                <span className="input-icon">⚖️</span>
                <input
                  type="number"
                  name="weight"
                  placeholder="70"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Objectif</label>
            <div className="input-wrapper">
              <span className="input-icon">🎯</span>
              <input
                type="text"
                name="goal"
                placeholder="ex : Perte de poids, musculation, bien-être..."
                value={formData.goal}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "S'inscrire"}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <p>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>

        <div className="terms">
          En créant un compte, tu acceptes nos{' '}
          <Link to="/terms">Conditions d'utilisation</Link> et notre{' '}
          <Link to="/privacy">Politique de confidentialité</Link>
        </div>
      </div>

<<<<<<< Updated upstream
      

      {/* Bottom Carousel - INFINI (seule modification) */}
=======
      {}
>>>>>>> Stashed changes
      <div className="inspiration-carousel">
        <div className="carousel-track">
          {carouselItems.map((item, i) => (
            <div key={i} className="carousel-item">
              <img src={`/assets/images/carousel-${(i % 6) + 1}.jpg`} alt={item} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Register;