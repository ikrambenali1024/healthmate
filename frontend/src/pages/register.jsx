// pages/register.jsx
import { useState } from "react";
import "../styles/auth.css";
import "../styles/animation.css";
import "../styles/components.css";
import { Link } from "react-router-dom";

function Register() {
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

    // Simulation d'inscription
    setTimeout(() => {
      console.log("Inscription réussie", formData);
      setLoading(false);
      createParticles(); // Effet de célébration
    }, 2000);
  };

  // Créer un tableau dupliqué pour l'effet infini
  const carouselItems = [
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme',
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme',
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme'
  ];

  return (
    <div className="auth-container">
      {/* Background Photo Collage */}
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

      {/* Grain Overlay */}
      <div className="grain"></div>

      {/* Floating Blobs */}
      <div className="blob blob-a"></div>
      <div className="blob blob-b"></div>
      <div className="blob blob-c"></div>
      <div className="blob blob-d"></div>

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

        <h2>Créer ton <em>compte</em></h2>
        <p className="auth-subtitle">Rejoins la communauté HealthMate 🌿</p>


        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          <div className="register-grid">
            <div className="form-group">
              <label>Prénom</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Jean"
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
                  placeholder="Dupont"
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
                placeholder="jean@email.com"
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
                placeholder="06 12 34 56 78"
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

      

      {/* Bottom Carousel - INFINI (seule modification) */}
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