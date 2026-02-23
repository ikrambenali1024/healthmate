import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-box">
        <h1>Bienvenue sur HealthMate </h1>
        <p>Votre assistant santé pour le sport, la nutrition et le bien-être !</p>

        <div className="home-buttons">
          {/* Utiliser Link stylé comme bouton pour éviter le problème */}
          <Link to="/login" className="btn-login">Se connecter</Link>
          <Link to="/register" className="btn-register">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;