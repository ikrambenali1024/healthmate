// frontend/src/pages/dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/animation.css";
import "../styles/components.css";

const TYPE_ICONS = {
  sport: "🏃‍♂️",
  nutrition: "🍎",
  mental: "🧘‍♀️",
  todo: "📝",
  general: "📌"
};

const TYPE_LABELS = {
  sport: "Sport",
  nutrition: "Nutrition",
  mental: "Mental",
  todo: "Todo",
  general: "Général"
};

const PLANS_DATA = {
  "gain de poids": [
    { dayOffset: 0, type: "sport",     title: "Musculation haut du corps",     duration: 45 },
    { dayOffset: 0, type: "nutrition", title: "Repas riche en calories",        duration: 0  },
    { dayOffset: 1, type: "sport",     title: "Cardio léger 15 min",           duration: 15 },
    { dayOffset: 1, type: "nutrition", title: "Collation protéinée",           duration: 0  },
    { dayOffset: 2, type: "sport",     title: "Musculation bas du corps",      duration: 45 },
    { dayOffset: 2, type: "nutrition", title: "Repas riche en glucides",        duration: 0  },
    { dayOffset: 3, type: "mental",    title: "Repos actif — étirements",      duration: 20 },
    { dayOffset: 3, type: "nutrition", title: "3 repas + 2 collations",        duration: 0  },
    { dayOffset: 4, type: "sport",     title: "Musculation full body",         duration: 50 },
    { dayOffset: 4, type: "nutrition", title: "Protéines post-séance",         duration: 0  },
    { dayOffset: 5, type: "sport",     title: "Sport libre ou natation",       duration: 40 },
    { dayOffset: 5, type: "nutrition", title: "Repas plaisir calorique",       duration: 0  },
    { dayOffset: 6, type: "mental",    title: "Repos complet",                 duration: 0  },
    { dayOffset: 6, type: "general",   title: "Bilan poids ",                  duration: 0  },
  ],
  "perte de poids": [
    { dayOffset: 0, type: "sport",     title: "Cardio 30 min",                duration: 30 },
    { dayOffset: 0, type: "nutrition", title: "Repas faible en calories",     duration: 0  },
    { dayOffset: 1, type: "sport",     title: "Marche rapide 20 min",         duration: 20 },
    { dayOffset: 1, type: "nutrition", title: "Boire 2L d'eau",               duration: 0  },
    { dayOffset: 2, type: "sport",     title: "HIIT 20 min",                  duration: 20 },
    { dayOffset: 2, type: "nutrition", title: "Protéines et légumes",         duration: 0  },
    { dayOffset: 3, type: "mental",    title: "Repos actif — étirements",     duration: 15 },
    { dayOffset: 3, type: "nutrition", title: "Repas équilibré sans sucre",   duration: 0  },
    { dayOffset: 4, type: "sport",     title: "Cardio 30 min",                duration: 30 },
    { dayOffset: 4, type: "nutrition", title: "Éviter le sucre et les graisses", duration: 0 },
    { dayOffset: 5, type: "sport",     title: "Sport libre 45 min",           duration: 45 },
    { dayOffset: 5, type: "nutrition", title: "Repas plaisir équilibré",      duration: 0  },
    { dayOffset: 6, type: "mental",    title: "Méditation 10 min",            duration: 10 },
    { dayOffset: 6, type: "general",   title: "Bilan de la semaine",          duration: 0  },
  ],
  "bien-etre": [
    { dayOffset: 0, type: "mental",    title: "Yoga 20 min",                  duration: 20 },
    { dayOffset: 0, type: "nutrition", title: "Petit-déjeuner sain et varié", duration: 0  },
    { dayOffset: 1, type: "mental",    title: "Méditation 15 min",            duration: 15 },
    { dayOffset: 1, type: "sport",     title: "Marche 30 min en nature",      duration: 30 },
    { dayOffset: 2, type: "mental",    title: "Journaling — écrire ses pensées", duration: 15 },
    { dayOffset: 2, type: "nutrition", title: "Repas anti-stress",            duration: 0  },
    { dayOffset: 3, type: "sport",     title: "Natation ou vélo 30 min",      duration: 30 },
    { dayOffset: 3, type: "mental",    title: "Lecture 20 min",               duration: 20 },
    { dayOffset: 4, type: "mental",    title: "Yoga 20 min",                  duration: 20 },
    { dayOffset: 4, type: "nutrition", title: "Tisane et repas léger",        duration: 0  },
    { dayOffset: 5, type: "sport",     title: "Activité plaisir libre",       duration: 45 },
    { dayOffset: 5, type: "mental",    title: "Temps pour soi — déconnexion", duration: 0  },
    { dayOffset: 6, type: "mental",    title: "Méditation longue 30 min",     duration: 30 },
    { dayOffset: 6, type: "general",   title: "Bilan bien-être semaine",      duration: 0  },
  ]
};

// Génère le plan de la semaine selon l'objectif
function generateWeekPlan(goalKey, today, currentDayIndex) {
  const planTemplate = PLANS_DATA[goalKey] || PLANS_DATA['bien-etre'];

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - currentDayIndex);
  weekStart.setHours(0, 0, 0, 0);

  return planTemplate.map((item, i) => {
    const actDate = new Date(weekStart);
    actDate.setDate(weekStart.getDate() + item.dayOffset);
    actDate.setHours(
      item.type === 'nutrition' ? 12 : item.type === 'mental' ? 9 : 17,
      0, 0, 0
    );
    return {
      _id: `plan-${item.dayOffset}-${i}`,
      title: item.title,
      type: item.type,
      duration: item.duration,
      description: '',
      completed: false,
      date: actDate.toISOString(),
      source: 'plan'
    };
  });
}

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userFullName = user.name || user.firstName || user.username || 'Utilisateur';
  const userGoal = (user.goal || user.objectif || 'bien-etre').toLowerCase().trim();

  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const today = new Date();
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  // Calcul du lundi de la semaine courante (clé unique par semaine)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - currentDayIndex);
  weekStart.setHours(0, 0, 0, 0);
  const weekKey = `plan-${userGoal}-${weekStart.toISOString().split('T')[0]}`;

  // ✅ Initialisation : charge depuis localStorage ou génère automatiquement
  const [allActivities, setAllActivities] = useState(() => {
    const saved = localStorage.getItem(weekKey);
    if (saved) {
      return JSON.parse(saved);
    }
    // Nouvelle semaine ou première connexion → générer automatiquement
    return generateWeekPlan(userGoal, today, currentDayIndex);
  });

  // ✅ Sauvegarde dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(weekKey, JSON.stringify(allActivities));
  }, [allActivities, weekKey]);

  // ✅ Nettoyage des anciens plans (semaines passées)
  useEffect(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('plan-') && key !== weekKey) {
        localStorage.removeItem(key);
      }
    });
  }, [weekKey]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newActivity, setNewActivity] = useState({
    type: 'sport', title: '', description: '', duration: ''
  });

  const displayedDayIndex = selectedDayIndex !== null ? selectedDayIndex : currentDayIndex;

  const dashboardStats = useMemo(() => {
    const activitiesByDay = weekDays.map((_, index) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + (index - currentDayIndex));
      dayDate.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayActivities = allActivities.filter(a => {
        const d = new Date(a.date);
        return d >= dayDate && d <= dayEnd && a.source === 'plan';
      });

      const total = dayActivities.length;
      const completed = dayActivities.filter(a => a.completed).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        jour: weekDays[index],
        date: dayDate,
        total,
        completed,
        completionRate,
        isToday: index === currentDayIndex,
        activities: dayActivities
      };
    });

    const weekTotal = activitiesByDay.reduce((s, d) => s + d.total, 0);
    const weekCompleted = activitiesByDay.reduce((s, d) => s + d.completed, 0);
    const weekCompletionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

    return {
      weekStats: { total: weekTotal, completed: weekCompleted, completionRate: weekCompletionRate },
      daysData: activitiesByDay
    };
  }, [allActivities, currentDayIndex, today, weekDays]);

  const planDayActivities = useMemo(() => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + (displayedDayIndex - currentDayIndex));
    dayDate.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayDate);
    dayEnd.setHours(23, 59, 59, 999);

    return allActivities.filter(a => {
      const d = new Date(a.date);
      return d >= dayDate && d <= dayEnd && a.source === 'plan';
    });
  }, [allActivities, displayedDayIndex, currentDayIndex, today]);

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.title) return;

    const idx = selectedDayIndex !== null ? selectedDayIndex : currentDayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (idx - currentDayIndex));
    targetDate.setHours(12, 0, 0, 0);

    const newAct = {
      _id: Date.now().toString(),
      title: newActivity.title,
      type: newActivity.type,
      duration: parseInt(newActivity.duration) || 0,
      description: newActivity.description || '',
      completed: false,
      date: targetDate.toISOString(),
      source: 'plan'
    };

    setAllActivities([...allActivities, newAct]);
    setNewActivity({ type: 'sport', title: '', description: '', duration: '' });
    setShowAddActivity(false);
  };

  const handleCompleteActivity = (activityId, currentStatus) => {
    setAllActivities(allActivities.map(act =>
      act._id === activityId ? { ...act, completed: !currentStatus } : act
    ));
  };

  const handleDeleteActivity = (activityId) => {
    setAllActivities(allActivities.filter(act => act._id !== activityId));
  };

  const handleRescheduleActivity = () => {
    if (!selectedActivity || !newDate) return;
    setAllActivities(allActivities.map(act =>
      act._id === selectedActivity._id
        ? { ...act, date: new Date(newDate).toISOString(), completed: false }
        : act
    ));
    setShowRescheduleModal(false);
    setSelectedActivity(null);
    setNewDate('');
  };

  const openRescheduleModal = (activity) => {
    setSelectedActivity(activity);
    setNewDate(new Date(activity.date).toISOString().split('T')[0]);
    setShowRescheduleModal(true);
  };

  const handleDaySelect = (index) => {
    setSelectedDayIndex(index === selectedDayIndex ? null : index);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getWeekStatus = () => {
    if (currentDayIndex === 0) return "Début de semaine";
    if (currentDayIndex === 6) return "Semaine terminée";
    return "Semaine en cours";
  };

  useEffect(() => {
    const onMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="grain" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #E8648A, #C44B72)' }}>
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white" />
            </svg>
          </div>
          <Link to="/" className="auth-logo-name" style={{ color: '#000', textDecoration: 'none' }}>HealthMate</Link>
        </div>
        <div className="nav-user">
          <span style={{ color: '#000' }}>👋 Bonjour, <strong>{userFullName}</strong> !</span>
          <button onClick={handleLogout} className="btn-logout" style={{ borderColor: '#E8648A', color: '#000' }}>Déconnexion</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-box" style={{ '--mouse-x': `${mousePosition.x}px`, '--mouse-y': `${mousePosition.y}px` }}>

          <div className="dashboard-header">
            <h1 style={{ color: '#000' }}>Tableau de bord <span style={{ color: '#E8648A' }}>🏠</span></h1>
          </div>

          {/* Onglets */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[
              { key: 'dashboard', label: '📊 Dashboard' },
              { key: 'plan', label: '📅 Mon Plan' }
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding: '0.55rem 1.4rem', borderRadius: '999px',
                border: '2px solid #E8648A',
                background: activeTab === key ? '#E8648A' : 'transparent',
                color: activeTab === key ? '#fff' : '#E8648A',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* ========== ONGLET DASHBOARD ========== */}
          {activeTab === 'dashboard' && (
            <>
              <div className="stats-cards">
                <div className="stat-card" style={{ borderColor: '#E8648A' }}>
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3 style={{ color: '#000' }}>Activités cette semaine</h3>
                    <p className="stat-number" style={{ color: '#000' }}>{dashboardStats.weekStats.total}</p>
                    <p style={{ color: '#000', fontSize: '0.8rem' }}>
                      {dashboardStats.weekStats.completed} complétées sur {dashboardStats.weekStats.total}
                    </p>
                  </div>
                </div>

                <div className="stat-card" style={{ borderColor: '#E8648A' }}>
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3 style={{ color: '#000' }}>Complétées</h3>
                    <p className="stat-number" style={{ color: '#000' }}>{dashboardStats.weekStats.completed}</p>
                    <p style={{ color: '#000', fontSize: '0.8rem' }}>activités terminées</p>
                  </div>
                </div>

                <div className="stat-card" style={{ borderColor: '#E8648A' }}>
                  <div className="stat-icon">📈</div>
                  <div className="stat-info">
                    <h3 style={{ color: '#000' }}>Taux de réussite</h3>
                    <p className="stat-number" style={{ color: '#000' }}>{dashboardStats.weekStats.completionRate}%</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${dashboardStats.weekStats.completionRate}%`, background: '#E8648A' }} />
                    </div>
                    <p style={{ color: '#000', fontSize: '0.7rem', marginTop: '0.3rem' }}>{getWeekStatus()}</p>
                  </div>
                </div>
              </div>

              <div className="weekly-progress" style={{ borderColor: '#E8648A' }}>
                <h2 style={{ color: '#000' }}>Progression de la semaine</h2>
                <div className="days-container">
                  {dashboardStats.daysData.map((day, index) => (
                    <div key={index}
                      className={`day-card ${day.isToday ? 'today' : ''} ${selectedDayIndex === index ? 'selected' : ''}`}
                      style={{ borderColor: '#E8648A', cursor: 'pointer' }}
                      onClick={() => handleDaySelect(index)}>
                      <div className="day-name" style={{ color: '#000' }}>{day.jour}</div>
                      {day.isToday && <div className="today-indicator">aujourd'hui</div>}
                      <div className="day-percentage" style={{ color: '#E8648A', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {day.completionRate}%
                      </div>
                      <div className="day-stats-mini">{day.completed}/{day.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========== ONGLET MON PLAN ========== */}
          {activeTab === 'plan' && (
            <div className="plan-section">
              <div style={{ marginBottom: '1.2rem' }}>
                <h2 style={{ color: '#000', margin: 0 }}>📅 Mon plan de la semaine</h2>
                <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  Objectif : <strong style={{ color: '#E8648A' }}>{userGoal}</strong> — plan généré automatiquement chaque lundi
                </p>
              </div>

              {/* Sélecteur jours */}
              <div className="weekly-progress" style={{ borderColor: '#E8648A', marginBottom: '1.2rem' }}>
                <div className="days-container">
                  {weekDays.map((jour, index) => {
                    const isToday = index === currentDayIndex;
                    const isSelected = displayedDayIndex === index;
                    const dayActivities = allActivities.filter(a => {
                      const d = new Date(a.date);
                      const dayDate = new Date(today);
                      dayDate.setDate(today.getDate() + (index - currentDayIndex));
                      dayDate.setHours(0, 0, 0, 0);
                      const dayEnd = new Date(dayDate);
                      dayEnd.setHours(23, 59, 59, 999);
                      return d >= dayDate && d <= dayEnd && a.source === 'plan';
                    });
                    return (
                      <div key={index}
                        className={`day-card ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                        style={{ borderColor: '#E8648A', cursor: 'pointer' }}
                        onClick={() => handleDaySelect(index)}>
                        <div className="day-name" style={{ color: '#000' }}>{jour}</div>
                        {isToday && <div className="today-indicator">aujourd'hui</div>}
                        <div className="day-percentage" style={{ color: '#E8648A', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {dayActivities.length}
                        </div>
                        <div className="day-stats-mini">activité{dayActivities.length !== 1 ? 's' : ''}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activités du jour */}
              <div className="activities-list" style={{ borderColor: '#E8648A' }}>
                <h2 style={{ color: '#000' }}>
                  Plan du <span style={{ color: '#E8648A' }}>{weekDays[displayedDayIndex]}</span>
                </h2>

                {planDayActivities.length === 0 ? (
                  <div className="no-activities">
                    <p style={{ color: '#999' }}>Aucune activité prévue ce jour</p>
                  </div>
                ) : (
                  <div className="activities-container">
                    {planDayActivities.map((activity) => (
                      <div key={activity._id}
                        className={`activity-item ${activity.completed ? 'completed' : ''}`}
                        style={{ borderLeft: '4px solid #E8648A' }}>
                        <div className="activity-checkbox">
                          <input type="checkbox"
                            checked={activity.completed}
                            onChange={() => handleCompleteActivity(activity._id, activity.completed)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E8648A' }}
                          />
                        </div>
                        <div style={{ fontSize: '1.5rem', minWidth: '2.2rem', textAlign: 'center' }}>
                          {TYPE_ICONS[activity.type] || '📌'}
                        </div>
                        <div className="activity-info" style={{ flex: 1 }}>
                          <div className="activity-title-row">
                            <h4 style={{ color: '#000', margin: 0, textDecoration: activity.completed ? 'line-through' : 'none' }}>
                              {activity.title}
                            </h4>
                            <span className="activity-badge" style={{ background: '#FFE4EC', color: '#E8648A' }}>
                              {TYPE_LABELS[activity.type] || activity.type}
                            </span>
                          </div>
                          <div className="activity-details" style={{ marginTop: '0.3rem' }}>
                            {activity.duration > 0 && <span>⏱ {activity.duration} min</span>}
                          </div>
                        </div>
                        <div className="activity-status-badge">
                          {activity.completed
                            ? <span style={{ color: '#4CAF50', fontWeight: 600 }}>✓ Fait</span>
                            : <span style={{ color: '#E8648A', fontWeight: 600 }}>À faire</span>}
                        </div>
                        <div className="activity-actions">
                          <button onClick={() => openRescheduleModal(activity)} className="action-icon" title="Replanifier">📅</button>
                          <button onClick={() => handleDeleteActivity(activity._id)} className="action-icon" title="Supprimer">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="add-activity-footer" style={{ marginTop: '1rem' }}>
                  <button onClick={() => setShowAddActivity(true)}
                    className="add-activity-btn-bottom" style={{ color: '#E8648A' }}>
                    + Ajouter une activité
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL AJOUT */}
      {showAddActivity && (
        <div className="modal-overlay" onClick={() => setShowAddActivity(false)}>
          <div className="modal-content" style={{ borderColor: '#E8648A' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#000' }}>➕ Ajouter une activité</h3>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
              Pour le : {weekDays[displayedDayIndex]}
            </p>
            <form onSubmit={handleAddActivity}>
              <select value={newActivity.type} onChange={e => setNewActivity({ ...newActivity, type: e.target.value })} style={{ borderColor: '#E8648A' }} required>
                <option value="sport">🏃‍♂️ Sport</option>
                <option value="nutrition">🍎 Nutrition</option>
                <option value="mental">🧘‍♀️ Mental</option>
                <option value="todo">📝 Todo</option>
                <option value="general">📌 Général</option>
              </select>
              <input type="text" placeholder="Titre de l'activité" value={newActivity.title} onChange={e => setNewActivity({ ...newActivity, title: e.target.value })} required style={{ borderColor: '#E8648A' }} />
              <textarea placeholder="Description (optionnel)" value={newActivity.description} onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} style={{ borderColor: '#E8648A' }} />
              <input type="number" placeholder="Durée en minutes (optionnel)" value={newActivity.duration} onChange={e => setNewActivity({ ...newActivity, duration: e.target.value })} style={{ borderColor: '#E8648A' }} />
              <div className="modal-buttons">
                <button type="submit" style={{ background: '#E8648A', color: 'white' }}>Ajouter</button>
                <button type="button" onClick={() => setShowAddActivity(false)} style={{ borderColor: '#E8648A', color: '#000' }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REPLANIFIER */}
      {showRescheduleModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
          <div className="modal-content" style={{ borderColor: '#E8648A' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#000' }}>Replanifier l'activité</h3>
            <p style={{ color: '#000' }}><strong>{selectedActivity.title}</strong> — choisir une nouvelle date :</p>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ borderColor: '#E8648A' }} />
            <div className="modal-buttons">
              <button onClick={handleRescheduleActivity} style={{ background: '#E8648A', color: 'white' }}>Replanifier</button>
              <button onClick={() => setShowRescheduleModal(false)} style={{ borderColor: '#E8648A', color: '#000' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;