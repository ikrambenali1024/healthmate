// pages/login.jsx
import { useState, useEffect } from "react";
import "../styles/auth.css";
import "../styles/animation.css";
import "../styles/components.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Simulation de connexion
    setTimeout(() => {
      if (email && password) {
        console.log("Connexion réussie");
        // Redirection ici
      } else {
        setError("Email ou mot de passe incorrect");
      }
      setLoading(false);
    }, 1500);
  };

  // Créer un tableau dupliqué pour l'effet infini
  const carouselItems = [
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme',
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme',
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme'
  ];

  return (
    <div className="auth-container">
      {/* Background Photo Collage (gardé pour l'ambiance) */}
      <div className="photo-collage">
        <div className="collage-item" style={{ left: '5%', top: '10%', transform: 'rotate(-8deg)' }}>
          <img src="/assets/images/login-bg-1.jpg" alt="" />
        </div>
        <div className="collage-item" style={{ left: '85%', top: '70%', transform: 'rotate(12deg)' }}>
          <img src="/assets/images/login-bg-2.jpg" alt="" />
        </div>
        <div className="collage-item" style={{ left: '75%', top: '20%', transform: 'rotate(-5deg)' }}>
          <img src="/assets/images/login-bg-3.jpg" alt="" />
        </div>
      </div>

      {/* Grain Overlay */}
      <div className="grain"></div>

      {/* Floating Blobs */}
      <div className="blob blob-a"></div>
      <div className="blob blob-b"></div>
      
      {/* Flip Card Interactive (gardé à gauche) */}
      <div className="flip-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
        <div className="flip-inner">
          <div className="flip-front">
            <img src="/assets/images/flip-login.png" alt="Wellness" />
          </div>
          <div className="flip-back">
            <h3>Bienvenue !</h3>
            <p>Content de te revoir </p>
          </div>
        </div>
      </div>

      {/* Main Auth Box - Centré */}
      <div 
        className="auth-box auth-box-centered"
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`
        }}
      >
       {/* Logo Coeur - Version Rose */}
<div className="auth-logo">
  <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #E8648A, #C44B72)' }}>
    <svg viewBox="0 0 24 24" width="28" height="28">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
    </svg>
  </div>
  <span className="auth-logo-name">HealthMate</span>
</div>

        <h2>Votre voyage vers <em> une meilleure santé </em> commence ici.</h2>
        <p className="auth-subtitle">Connecte-toi pour continuer ton parcours santé</p>

        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">avec email</span>
          <span className="divider-line"></span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="forgot-link">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : 'Se connecter'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <p>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>

        <div className="terms">
          En te connectant, tu acceptes nos conditions d'utilisation
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

export default Login;