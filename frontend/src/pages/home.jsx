// pages/home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import "../styles/auth.css";
import "../styles/animation.css";
import "../styles/components.css";

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Dupliquer les items pour créer un effet infini
  const carouselItems = [
    'Fitness', 'Yoga', 'Nutrition', 'Méditation', 'Course', 'Bien-être',
    'Fitness', 'Yoga', 'Nutrition', 'Méditation', 'Course', 'Bien-être',
    'Fitness', 'Yoga', 'Nutrition', 'Méditation', 'Course', 'Bien-être'
  ];

  return (
    <div className="home-wrapper">
      {/* Background Photo Collage */}
      <div className="photo-collage">
        <div className="collage-item" style={{ left: '2%', top: '10%', transform: 'rotate(-8deg)' }}>
          <img src="/assets/images/home-bg-1.jpg" alt="" />
        </div>
        <div className="collage-item" style={{ left: '85%', top: '70%', transform: 'rotate(12deg)' }}>
          <img src="/assets/images/home-bg-2.jpg" alt="" />
        </div>
        <div className="collage-item" style={{ left: '75%', top: '20%', transform: 'rotate(-5deg)' }}>
          <img src="/assets/images/home-bg-3.jpg" alt="" />
        </div>
      </div>

      {/* Grain Overlay */}
      <div className="grain"></div>

      {/* Floating Blobs */}
      <div className="blob blob-a"></div>
      <div className="blob blob-b"></div>

      {/* Main Content */}
      <div className="home-container">
        {/* Logo Rose */}
        <div className="auth-logo home-logo">
          <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #E8648A, #C44B72)' }}>
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
            </svg>
          </div>
          <span className="auth-logo-name" style={{ color: '#000000' }}>HealthMate</span>
        </div>

        {/* Hero Box - Centré */}
        <div 
          className="home-box home-box-centered"
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`
          }}
        >
          <h1 style={{ color: '#000000' }}>
            Bienvenue sur <em style={{ color: '#E8648A', fontStyle: 'italic' }}>HealthMate</em>
          </h1>
          
          <div className="hero-decoration">
            <span className="decoration-leaf">🌿</span>
            <span className="decoration-leaf">🌸</span>
            <span className="decoration-leaf">🌱</span>
          </div>

          <p className="home-subtitle" style={{ color: '#000000' }}>
            Votre assistant santé pour le sport, la nutrition et le bien-être !
          </p>

          {/* Feature Cards */}
          <div className="feature-cards">
            <div className="feature-card" style={{ borderColor: '#E8648A' }}>
              <span className="feature-icon">💪</span>
              <h3 style={{ color: '#000000' }}>Sport</h3>
              <p style={{ color: '#000000' }}>Programmes personnalisés</p>
            </div>
            <div className="feature-card" style={{ borderColor: '#E8648A' }}>
              <span className="feature-icon">🥗</span>
              <h3 style={{ color: '#000000' }}>Nutrition</h3>
              <p style={{ color: '#000000' }}>Plans adaptés</p>
            </div>
            <div className="feature-card" style={{ borderColor: '#E8648A' }}>
              <span className="feature-icon">🧘</span>
              <h3 style={{ color: '#000000' }}>Bien-être</h3>
              <p style={{ color: '#000000' }}>Suivi quotidien</p>
            </div>
          </div>

          {/* Boutons uniformes */}
          <div className="home-buttons-uniform">
            <Link to="/login" className="btn-uniform" style={{ color: '#000000', borderColor: '#E8648A' }}>
              <span>Se connecter</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8648A">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
            
            <Link to="/register" className="btn-uniform" style={{ color: '#000000', borderColor: '#E8648A' }}>
              <span>Créer un compte</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8648A">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="home-stats">
            <div className="stat-item">
              <span className="stat-number" style={{ color: '#000000' }}>10k+</span>
              <span className="stat-label" style={{ color: '#000000' }}>UTILISATEURS</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{ color: '#000000' }}>500+</span>
              <span className="stat-label" style={{ color: '#000000' }}>PROGRAMMES</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{ color: '#000000' }}>4.8</span>
              <span className="stat-label" style={{ color: '#000000' }}>NOTE ★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Carousel - DÉFILEMENT INFINI */}
      <div className="inspiration-carousel">
        <div className="carousel-track">
          {carouselItems.map((item, i) => (
            <div key={i} className="carousel-item">
              <img src={`/assets/images/carousel-${(i % 6) + 1}.jpg`} alt={item} />
              <span style={{ color: '#000000' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;