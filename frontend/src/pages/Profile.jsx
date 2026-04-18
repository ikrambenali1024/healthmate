// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const GOALS = [
  { value: "perte de poids", label: "Perte de poids", desc: "Brûler des calories et mincir" },
  { value: "gain de poids",  label: "Gain de poids",  desc: "Prendre de la masse et du volume" },
  { value: "bien-etre",      label: "Bien-être",      desc: "Équilibre corps et esprit" },
];

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("infos");
  const [loading, setLoading]     = useState(true);
  const [saving,  setSaving]      = useState(false);
  const [message, setMessage]     = useState(null);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "",
    birthDate: "", gender: "", height: "", weight: "", goal: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd,     setShowNewPwd]     = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res  = await fetch("http://localhost:5000/api/dashboard/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const u = data.data;
          setFormData({
            firstName: u.firstName || "",
            lastName:  u.lastName  || "",
            phone:     u.phone     || "",
            birthDate: u.birthDate ? u.birthDate.split("T")[0] : "",
            gender:    u.gender    || "",
            height:    u.height    || "",
            weight:    u.weight    || "",
            goal:      u.goal      || ""
          });
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...stored, ...u }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res  = await fetch("http://localhost:5000/api/dashboard/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Profil mis à jour avec succès" });
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...data.data }));
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Minimum 8 caractères requis" });
      return;
    }
    setSaving(true);
    try {
      const res  = await fetch("http://localhost:5000/api/dashboard/profile/password", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword:     passwordData.newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Mot de passe modifié avec succès" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const pwdStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6)  return { label: "Faible", color: "#E57373", width: "30%" };
    if (pwd.length < 10) return { label: "Moyen",  color: "#FFB74D", width: "65%" };
    return                      { label: "Fort",   color: "#66BB6A", width: "100%" };
  };
  const strength  = pwdStrength(passwordData.newPassword);
  const initials  = formData.firstName
    ? (formData.firstName[0] + (formData.lastName?.[0] || "")).toUpperCase()
    : "?";
  const currentGoal = GOALS.find(g => g.value === formData.goal);

  // ── Styles ─────────────────────────────────────────────────────────────
  const S = {
    input: {
      width: "100%", padding: "11px 14px", borderRadius: "10px",
      border: "1.5px solid #EEEEEE", fontSize: "14px", color: "#1a1a1a",
      outline: "none", background: "#FAFAFA", boxSizing: "border-box",
      fontFamily: "inherit", transition: "border-color 0.2s"
    },
    label: {
      fontSize: "11px", fontWeight: "700", color: "#C0C0C0",
      marginBottom: "6px", display: "block",
      letterSpacing: "0.08em", textTransform: "uppercase"
    },
    field: { marginBottom: "16px" },
    card: {
      background: "#fff", borderRadius: "20px",
      border: "1px solid #F2F2F2", padding: "28px 28px 24px",
      boxShadow: "0 2px 24px rgba(0,0,0,0.05)"
    },
    btn: {
      width: "100%", padding: "13px",
      background: "linear-gradient(135deg, #E8648A, #C44B72)",
      color: "white", border: "none", borderRadius: "12px",
      fontSize: "14px", fontWeight: "700", cursor: "pointer",
      boxShadow: "0 4px 16px rgba(232,100,138,0.3)",
      fontFamily: "inherit", letterSpacing: "0.02em",
      transition: "opacity 0.2s, transform 0.1s"
    }
  };

  if (loading) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#F6F7FB",
      flexDirection: "column", gap: "14px"
    }}>
      <div style={{
        width: "36px", height: "36px",
        border: "3px solid #F0F0F0",
        borderTop: "3px solid #E8648A",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }}/>
      <p style={{ color: "#aaa", fontSize: "14px" }}>Chargement...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F6F7FB", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .p-input:focus  { border-color: #E8648A !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(232,100,138,0.08) !important; }
        .p-btn:hover    { opacity: 0.88 !important; transform: translateY(-1px) !important; }
        .p-btn:active   { transform: translateY(0) !important; }
        .goal-c:hover   { border-color: #E8648A !important; box-shadow: 0 4px 18px rgba(232,100,138,0.12) !important; transform: translateY(-2px) !important; }
        .nav-a:hover    { background: #FFF0F4 !important; }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #F0F0F0",
        height: "58px", padding: "0 32px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 10px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "9px",
            background: "linear-gradient(135deg, #E8648A, #C44B72)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22
                       8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <Link to="/" style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a1a", textDecoration: "none" }}>
            HealthMate
          </Link>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link to="/dashboard" className="nav-a" style={{
            padding: "7px 16px", border: "1.5px solid #E8648A",
            borderRadius: "9px", color: "#E8648A", textDecoration: "none",
            fontSize: "13px", fontWeight: "600", transition: "background 0.15s"
          }}>
            ← Dashboard
          </Link>
          <button onClick={handleLogout} className="nav-a" style={{
            padding: "7px 16px", border: "1.5px solid #EBEBEB",
            borderRadius: "9px", background: "none", color: "#888",
            fontSize: "13px", cursor: "pointer", fontWeight: "600",
            fontFamily: "inherit", transition: "background 0.15s"
          }}>
            Déconnexion
          </button>
        </div>
      </nav>

      {/* ══ HERO BANNER ══ */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #E8648A 0%, #C44B72 55%, #9B3060 100%)",
        padding: "40px 32px 52px",
        overflow: "hidden"
      }}>
        {/* Cercles déco */}
        <div style={{ position:"absolute", top:"-50px", right:"-50px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"absolute", bottom:"-30px", left:"35%", width:"140px", height:"140px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ position:"absolute", top:"20px", left:"-30px", width:"100px", height:"100px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>

        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:"22px" }}>
          {/* Avatar */}
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
            border: "2.5px solid rgba(255,255,255,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: "700", color: "#fff",
            flexShrink: 0, letterSpacing: "-1px"
          }}>
            {initials}
          </div>

          {/* Texte */}
          <div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", fontWeight: "600", marginBottom: "4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Mon profil
            </p>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", margin: "0 0 10px", letterSpacing: "-0.3px" }}>
              {formData.firstName} {formData.lastName}
            </h1>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {currentGoal && (
                <span style={{
                  padding: "5px 14px", borderRadius: "999px",
                  fontSize: "12px", fontWeight: "600",
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff", border: "1px solid rgba(255,255,255,0.28)"
                }}>
                  {currentGoal.label}
                </span>
              )}
              {formData.height && (
                <span style={{
                  padding: "5px 14px", borderRadius: "999px",
                  fontSize: "12px", fontWeight: "600",
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff", border: "1px solid rgba(255,255,255,0.28)"
                }}>
                  {formData.height} cm
                </span>
              )}
              {formData.weight && (
                <span style={{
                  padding: "5px 14px", borderRadius: "999px",
                  fontSize: "12px", fontWeight: "600",
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff", border: "1px solid rgba(255,255,255,0.28)"
                }}>
                  {formData.weight} kg
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "660px", margin: "0 auto", padding: "28px 16px 48px" }}>

        {/* ══ TABS ══ */}
        <div style={{
          display: "flex", gap: "5px", marginBottom: "20px",
          background: "#fff", padding: "5px", borderRadius: "14px",
          border: "1px solid #F0F0F0",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)"
        }}>
          {[
            { key: "infos",    label: "Informations" },
            { key: "objectif", label: "Objectif"     },
            { key: "password", label: "Sécurité"     },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => { setActiveTab(tab.key); setMessage(null); }}
              style={{
                flex: 1, padding: "10px 6px", borderRadius: "10px",
                border: "none", fontSize: "13px", fontWeight: "600",
                cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                background: activeTab === tab.key
                  ? "linear-gradient(135deg, #E8648A, #C44B72)" : "transparent",
                color: activeTab === tab.key ? "#fff" : "#BBBBBB",
                boxShadow: activeTab === tab.key
                  ? "0 3px 12px rgba(232,100,138,0.3)" : "none"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══ MESSAGE ══ */}
        {message && (
          <div style={{
            padding: "13px 16px", borderRadius: "12px", marginBottom: "16px",
            fontSize: "13px", fontWeight: "600", display: "flex",
            alignItems: "center", gap: "10px", animation: "fadeUp 0.3s ease",
            background: message.type === "success" ? "#EDFAF1" : "#FFEFEF",
            color:      message.type === "success" ? "#1E7C45" : "#C62828",
            border: `1.5px solid ${message.type === "success" ? "#B2DFCA" : "#FFCDD2"}`
          }}>
            <span style={{
              width: "20px", height: "20px", borderRadius: "50%",
              background: message.type === "success" ? "#1E7C45" : "#C62828",
              color: "#fff", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "11px", flexShrink: 0
            }}>
              {message.type === "success" ? "✓" : "!"}
            </span>
            {message.text}
          </div>
        )}

        {/* ════════════════════════
            TAB : INFORMATIONS
        ════════════════════════ */}
        {activeTab === "infos" && (
          <div style={{ ...S.card, animation: "fadeUp 0.3s ease" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 4px" }}>
              Informations personnelles
            </h2>
            <p style={{ fontSize: "13px", color: "#C0C0C0", marginBottom: "24px" }}>
              Mets à jour tes données de profil
            </p>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.field}>
                  <label style={S.label}>Prénom</label>
                  <input className="p-input" style={S.input} type="text"
                    value={formData.firstName} required placeholder="Jean"
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Nom</label>
                  <input className="p-input" style={S.input} type="text"
                    value={formData.lastName} required placeholder="Dupont"
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Téléphone</label>
                <input className="p-input" style={S.input} type="tel"
                  value={formData.phone} placeholder="+216 XX XXX XXX"
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.field}>
                  <label style={S.label}>Date de naissance</label>
                  <input className="p-input" style={S.input} type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Genre</label>
                  <select className="p-input" style={S.input}
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.field}>
                  <label style={S.label}>Taille (cm)</label>
                  <input className="p-input" style={S.input} type="number"
                    value={formData.height} min="100" max="250" placeholder="175"
                    onChange={e => setFormData({...formData, height: e.target.value})}
                  />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Poids (kg)</label>
                  <input className="p-input" style={S.input} type="number"
                    value={formData.weight} min="30" max="300" placeholder="70"
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ marginTop: "8px" }}>
                <button type="submit" className="p-btn"
                  style={{ ...S.btn, opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
                  disabled={saving}
                >
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════════════════════
            TAB : OBJECTIF
        ════════════════════════ */}
        {activeTab === "objectif" && (
          <div style={{ ...S.card, animation: "fadeUp 0.3s ease" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 4px" }}>
              Mon objectif
            </h2>
            <p style={{ fontSize: "13px", color: "#C0C0C0", marginBottom: "24px" }}>
              Changer ton objectif régénèrera ton plan hebdomadaire automatiquement
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
              {GOALS.map(goal => {
                const isActive = formData.goal === goal.value;
                return (
                  <div key={goal.value} className="goal-c"
                    onClick={() => setFormData({...formData, goal: goal.value})}
                    style={{
                      border: isActive ? "2px solid #E8648A" : "1.5px solid #EEEEEE",
                      borderRadius: "14px", padding: "16px 18px",
                      cursor: "pointer", transition: "all 0.2s",
                      background: isActive ? "linear-gradient(135deg, #FFF4F7, #FFE8EF)" : "#FAFAFA",
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 3px", color: isActive ? "#E8648A" : "#1a1a1a" }}>
                        {goal.label}
                      </p>
                      <p style={{ fontSize: "12px", color: isActive ? "#C44B72" : "#BBBBBB", margin: 0 }}>
                        {goal.desc}
                      </p>
                    </div>
                    {/* Radio visuel */}
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      border: isActive ? "none" : "2px solid #E0E0E0",
                      background: isActive ? "#E8648A" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {isActive && (
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }}/>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              background: "#FFFBF0", border: "1.5px solid #FFE7A0",
              borderRadius: "12px", padding: "13px 16px", marginBottom: "20px",
              fontSize: "13px", color: "#9A6700", display: "flex",
              alignItems: "flex-start", gap: "10px", lineHeight: 1.55
            }}>
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%",
                background: "#FFB800", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0, marginTop: "1px"
              }}>
                <span style={{ color: "#fff", fontSize: "11px", fontWeight: "700" }}>i</span>
              </div>
              <span>
                Après avoir sauvegardé, clique sur{" "}
                <strong style={{ color: "#7A5000" }}>"Regénérer le plan"</strong>{" "}
                dans l'onglet Mon Plan pour appliquer ton nouvel objectif.
              </span>
            </div>

            <button className="p-btn"
              onClick={handleSaveProfile}
              disabled={saving || !formData.goal}
              style={{
                ...S.btn,
                opacity: saving || !formData.goal ? 0.5 : 1,
                cursor: saving || !formData.goal ? "not-allowed" : "pointer"
              }}
            >
              {saving ? "Enregistrement..." : "Sauvegarder l'objectif"}
            </button>
          </div>
        )}

        {/* ════════════════════════
            TAB : SÉCURITÉ
        ════════════════════════ */}
        {activeTab === "password" && (
          <div style={{ ...S.card, animation: "fadeUp 0.3s ease" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 4px" }}>
              Changer le mot de passe
            </h2>
            <p style={{ fontSize: "13px", color: "#C0C0C0", marginBottom: "24px" }}>
              Minimum 8 caractères requis
            </p>

            <form onSubmit={handleChangePassword}>
              {/* Mot de passe actuel */}
              <div style={S.field}>
                <label style={S.label}>Mot de passe actuel</label>
                <div style={{ position: "relative" }}>
                  <input className="p-input"
                    style={{ ...S.input, paddingRight: "46px" }}
                    type={showCurrentPwd ? "text" : "password"}
                    value={passwordData.currentPassword} required
                    placeholder="••••••••"
                    onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                  <button type="button"
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    style={{
                      position: "absolute", right: "13px", top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", padding: 0,
                      color: "#C0C0C0", fontSize: "13px", fontWeight: "600",
                      fontFamily: "inherit"
                    }}
                  >
                    {showCurrentPwd ? "Cacher" : "Voir"}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div style={S.field}>
                <label style={S.label}>Nouveau mot de passe</label>
                <div style={{ position: "relative" }}>
                  <input className="p-input"
                    style={{ ...S.input, paddingRight: "46px" }}
                    type={showNewPwd ? "text" : "password"}
                    value={passwordData.newPassword} required
                    placeholder="••••••••"
                    onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                  <button type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    style={{
                      position: "absolute", right: "13px", top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", padding: 0,
                      color: "#C0C0C0", fontSize: "13px", fontWeight: "600",
                      fontFamily: "inherit"
                    }}
                  >
                    {showNewPwd ? "Cacher" : "Voir"}
                  </button>
                </div>

                {/* Barre de force */}
                {strength && (
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ height: "5px", borderRadius: "999px", background: "#F0F0F0", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: "999px",
                        width: strength.width, background: strength.color,
                        transition: "width 0.4s, background 0.4s"
                      }}/>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                      <span style={{ fontSize: "11px", color: strength.color, fontWeight: "700" }}>
                        {strength.label}
                      </span>
                      <span style={{ fontSize: "11px", color: "#C0C0C0" }}>
                        {passwordData.newPassword.length} caractères
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmer */}
              <div style={S.field}>
                <label style={S.label}>Confirmer le mot de passe</label>
                <div style={{ position: "relative" }}>
                  <input className="p-input"
                    style={{
                      ...S.input, paddingRight: "46px",
                      borderColor: passwordData.confirmPassword &&
                        passwordData.newPassword !== passwordData.confirmPassword
                        ? "#E57373" : "#EEEEEE"
                    }}
                    type={showConfirmPwd ? "text" : "password"}
                    value={passwordData.confirmPassword} required
                    placeholder="••••••••"
                    onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                  <button type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    style={{
                      position: "absolute", right: "13px", top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", padding: 0,
                      color: "#C0C0C0", fontSize: "13px", fontWeight: "600",
                      fontFamily: "inherit"
                    }}
                  >
                    {showConfirmPwd ? "Cacher" : "Voir"}
                  </button>
                </div>

                {/* Feedback correspondance */}
                {passwordData.confirmPassword && (
                  <p style={{
                    fontSize: "12px", margin: "6px 0 0", fontWeight: "600",
                    color: passwordData.newPassword === passwordData.confirmPassword
                      ? "#1E7C45" : "#E57373"
                  }}>
                    {passwordData.newPassword === passwordData.confirmPassword
                      ? "Les mots de passe correspondent"
                      : "Les mots de passe ne correspondent pas"}
                  </p>
                )}
              </div>

              <div style={{ marginTop: "8px" }}>
                <button type="submit" className="p-btn"
                  disabled={saving}
                  style={{
                    ...S.btn, opacity: saving ? 0.7 : 1,
                    cursor: saving ? "not-allowed" : "pointer"
                  }}
                >
                  {saving ? "Modification..." : "Changer le mot de passe"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;