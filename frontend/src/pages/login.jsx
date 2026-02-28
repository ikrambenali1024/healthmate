// pages/login.jsx
import { useState, useEffect } from "react";
import "../styles/auth.css";
import "../styles/animation.css";
import "../styles/components.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // 👁️ État pour afficher/masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      if (!email || !password) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      console.log("✅ Réponse du serveur:", response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      setSuccess("Connexion réussie ! Redirection...");
      
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error("❌ Erreur de connexion:", err);
      
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data.message;
        
        switch (status) {
          case 400:
            setError(message || "Email ou mot de passe incorrect");
            break;
          case 401:
            setError("❌ " + message);
            break;
          case 403:
            if (message.includes("bloqué")) {
              setError("⏰ " + message);
            } else {
              setError("❌ " + message);
            }
            break;
          case 404:
            setError("Utilisateur non trouvé");
            break;
          default:
            setError(message || "Erreur de connexion");
        }

        if (message.includes("Tentative")) {
          const match = message.match(/(\d+)\/3/);
          if (match) {
            setAttempts(parseInt(match[1]));
          }
        }
      } else if (err.request) {
        setError("Impossible de contacter le serveur. Vérifie ta connexion.");
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  const carouselItems = [
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme',
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme',
    'Bien-être', 'Méditation', 'Santé', 'sport', 'Nutrition', 'Forme'
  ];

  return (
    <div className="auth-container">
      {/* Background Photo Collage */}
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
      
      {/* Flip Card Interactive */}
      <div className="flip-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
        <div className="flip-inner">
          <div className="flip-front">
            <img src="/assets/images/flip-login.png" alt="Wellness" />
          </div>
          <div className="flip-back">
            <h3>Bienvenue !</h3>
            <p>Content de te revoir</p>
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
        {/* Logo Rose */}
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

        {/* Message de succès */}
        {success && (
          <div className="success-message" style={{ 
            background: 'rgba(76, 175, 80, 0.1)', 
            border: '1px solid #4CAF50',
            color: '#4CAF50',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="error-message" style={{ 
            background: 'rgba(244, 67, 54, 0.1)', 
            border: '1px solid #f44336',
            color: '#f44336',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Indicateur de tentatives */}
        {attempts > 0 && attempts < 3 && (
          <div style={{
            fontSize: '12px',
            color: '#ff9800',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            Tentative {attempts}/3
          </div>
        )}

        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">avec email</span>
          <span className="divider-line"></span>
        </div>

        {/* Login Form avec ŒIL */}
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
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ 
                  opacity: loading ? 0.7 : 1,
                  paddingRight: '40px'
                }}
              />
              {/* 👁️ Icône œil */}
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '20px',
                  userSelect: 'none',
                  opacity: 0.6,
                  transition: 'opacity 0.2s',
                  zIndex: 2
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.6}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
          </div>

          <div className="forgot-link">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? '#ccc' : 'linear-gradient(135deg, #E8648A, #C44B72)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <p>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>

        <div className="terms">
          En te connectant, tu acceptes nos conditions d'utilisation
        </div>
      </div>

      {/* Bottom Carousel */}
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