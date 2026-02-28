// pages/forgot-password.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import "../styles/animation.css";
import "../styles/components.css";

function ForgotPassword() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      if (!email) {
        setError("Veuillez entrer votre email");
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email
      });

      console.log("✅ Réponse:", response.data);
      setSuccess("Si cet email existe, un lien de réinitialisation a été envoyé ✅");
      setEmail("");

    } catch (err) {
      console.error("❌ Erreur:", err);
      
      if (err.response) {
        setError(err.response.data.message || "Une erreur est survenue");
      } else if (err.request) {
        setError("Impossible de contacter le serveur. Vérifie ta connexion.");
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setLoading(false);
    }
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
            <h3>Mot de passe oublié ?</h3>
            <p>Pas de panique !</p>
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

        <h2>Mot de passe <em>oublié</em> ?</h2>
        <p className="auth-subtitle">Entre ton email pour réinitialiser ton mot de passe</p>

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

        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">avec email</span>
          <span className="divider-line"></span>
        </div>

        {/* Formulaire */}
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

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? '#ccc' : 'linear-gradient(135deg, #E8648A, #C44B72)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '20px'
            }}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Envoyer le lien'
            )}
          </button>
        </form>

        <p>
          <Link to="/login">← Retour à la connexion</Link>
        </p>

        <div className="terms">
          Tu recevras un email avec un lien pour réinitialiser ton mot de passe
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

export default ForgotPassword;