import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/animation.css";
import "../styles/components.css";
import DailyGift from '../components/DailyGift';
import ChatBot from '../components/ChatBot';

const API = 'http://localhost:5000/api';

const TYPE_ICONS = {
  sport: "🏃‍♂️", nutrition: "🍎", mental: "🧘‍♀️", todo: "📝", general: "📌"
};
const TYPE_LABELS = {
  sport: "Sport", nutrition: "Nutrition", mental: "Mental", todo: "Todo", general: "Général"
};
const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userFullName = user.name || user.firstName || user.username || 'Utilisateur';
  const token = localStorage.getItem('token');

  const today = new Date();
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const [planByDay, setPlanByDay] = useState(Array(7).fill({ activities: [] }));
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [feedback, setFeedback] = useState(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newActivity, setNewActivity] = useState({
    type: 'sport', title: '', description: '', duration: ''
  });
  const [emailStatus, setEmailStatus] = useState({ loading: '', message: '', error: false });
  const [showGift, setShowGift] = useState(true);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/plan`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPlanByDay(data.data);
    } catch (err) {
      console.error('Erreur chargement plan:', err);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  useEffect(() => {
    const onMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const dashboardStats = useMemo(() => {
    const daysData = planByDay.map((day, index) => {
      const acts = day.activities || [];
      const total = acts.length;
      const completed = acts.filter(a => a.completed).length;
      return {
        jour: weekDays[index], total, completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        isToday: index === currentDayIndex,
        activities: acts
      };
    });
    const weekTotal = daysData.reduce((s, d) => s + d.total, 0);
    const weekCompleted = daysData.reduce((s, d) => s + d.completed, 0);
    return {
      weekStats: {
        total: weekTotal, completed: weekCompleted,
        completionRate: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
      },
      daysData
    };
  }, [planByDay, currentDayIndex]);

  const displayedDayIndex = selectedDayIndex !== null ? selectedDayIndex : currentDayIndex;
  const planDayActivities = planByDay[displayedDayIndex]?.activities || [];

  const handleToggle = async (activityId, currentStatus) => {
    setPlanByDay(prev => prev.map(day => ({
      ...day,
      activities: day.activities.map(a =>
        a._id === activityId ? { ...a, completed: !currentStatus } : a
      )
    })));
    await fetch(`${API}/plan/activity/${activityId}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
  };

  const handleDelete = async (activityId) => {
    setPlanByDay(prev => prev.map(day => ({
      ...day,
      activities: day.activities.filter(a => a._id !== activityId)
    })));
    await fetch(`${API}/plan/activity/${activityId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.title) return;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (displayedDayIndex - currentDayIndex));
    targetDate.setHours(12, 0, 0, 0);
    const res = await fetch(`${API}/plan/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...newActivity, date: targetDate.toISOString() })
    });
    const data = await res.json();
    if (data.success) {
      await fetchPlan();
      setNewActivity({ type: 'sport', title: '', description: '', duration: '' });
      setShowAddActivity(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedActivity || !newDate) return;
    await fetch(`${API}/plan/activity/${selectedActivity._id}/reschedule`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ date: newDate })
    });
    await fetchPlan();
    setShowRescheduleModal(false);
    setSelectedActivity(null);
  };

  const handleRegenerate = async () => {
    if (!window.confirm('Régénérer le plan ? Les activités actuelles seront supprimées.')) return;
    await fetch(`${API}/plan/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    await fetchPlan();
  };

  const testEmail = async (type) => {
    setEmailStatus({ loading: type, message: '', error: false });
    try {
      const body = type === 'summary' ? JSON.stringify({
        total: dashboardStats.weekStats.total,
        completed: dashboardStats.weekStats.completed,
        completionRate: dashboardStats.weekStats.completionRate
      }) : JSON.stringify({});
      const res = await fetch(`${API}/email/test-${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body
      });
      const data = await res.json();
      setEmailStatus({ loading: '', message: data.message, error: !data.success });
    } catch {
      setEmailStatus({ loading: '', message: 'Erreur de connexion', error: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p style={{ color: '#E8648A', fontSize: '1.2rem' }}>⏳ Chargement du plan...</p>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="grain" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      {showGift && (
        <DailyGift onClose={() => setShowGift(false)} />
      )}

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
        <Link to="/profile" style={{ padding: "7px 16px", border: "0.5px solid #E8648A", borderRadius: "8px", color: "#E8648A", textDecoration: "none", fontSize: "13px" }}>
          👤 Mon profil
        </Link>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-box" style={{ '--mouse-x': `${mousePosition.x}px`, '--mouse-y': `${mousePosition.y}px` }}>

          <div className="dashboard-header">
            <h1 style={{ color: '#000' }}>
              Tableau de bord{' '}
              <span style={{
                fontSize: '1.8rem',
                display: 'inline-block',
                animation: 'smileFloat 2s ease-in-out infinite',
                transition: 'all 0.5s'
              }}>
                {dashboardStats.weekStats.completionRate === 0 && '😢'}
                {dashboardStats.weekStats.completionRate > 0 && dashboardStats.weekStats.completionRate < 50 && '🙂'}
                {dashboardStats.weekStats.completionRate >= 50 && dashboardStats.weekStats.completionRate < 80 && '😊'}
                {dashboardStats.weekStats.completionRate >= 80 && '🥳'}
              </span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[{ key: 'dashboard', label: '📊 Dashboard' }, { key: 'plan', label: '📅 Mon Plan' }].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding: '0.55rem 1.4rem', borderRadius: '999px', border: '2px solid #E8648A',
                background: activeTab === key ? '#E8648A' : 'transparent',
                color: activeTab === key ? '#fff' : '#E8648A',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
              }}>{label}</button>
            ))}
          </div>

          {activeTab === 'dashboard' && (
            <>
              <div className="stats-cards">
                <div className="stat-card" style={{ borderColor: '#E8648A' }}>
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3 style={{ color: '#000' }}>Activités cette semaine</h3>
                    <p className="stat-number" style={{ color: '#000' }}>{dashboardStats.weekStats.total}</p>
                    <p style={{ color: '#000', fontSize: '0.8rem' }}>{dashboardStats.weekStats.completed} complétées sur {dashboardStats.weekStats.total}</p>
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
                      onClick={() => setSelectedDayIndex(index === selectedDayIndex ? null : index)}>
                      <div className="day-name" style={{ color: '#000' }}>{day.jour}</div>
                      {day.isToday && <div className="today-indicator">aujourd'hui</div>}
                      <div className="day-percentage" style={{ color: '#E8648A', fontWeight: 'bold', fontSize: '1.2rem' }}>{day.completionRate}%</div>
                      <div className="day-stats-mini">{day.completed}/{day.total}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1.25rem 1.5rem', border: '1.5px solid #eee', borderRadius: '16px', background: '#fff' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#999', margin: '0 0 1rem' }}>Comment s'est passée ta semaine ?</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem' }}>
                  {[
                    { key: 'great', emoji: '😊', label: 'Réussi', activeColor: '#4ade80', activeBg: '#f0fdf4' },
                    { key: 'ok', emoji: '😐', label: 'Partiellement réussi', activeColor: '#facc15', activeBg: '#fefce8' },
                    { key: 'bad', emoji: '😕', label: 'À améliorer', activeColor: '#f87171', activeBg: '#fef2f2' }
                  ].map(({ key, emoji, label, activeColor, activeBg }) => (
                    <button key={key} onClick={() => setFeedback(key)} style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: '8px', padding: '14px 8px', borderRadius: '12px', cursor: 'pointer',
                      border: feedback === key ? `2px solid ${activeColor}` : '1.5px solid #eee',
                      background: feedback === key ? activeBg : '#fafafa', transition: 'all 0.18s'
                    }}>
                      <span style={{ fontSize: '32px' }}>{emoji}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: feedback === key ? activeColor : '#999' }}>{label}</span>
                    </button>
                  ))}
                </div>
                {feedback && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                    background: feedback === 'great' ? '#f0fdf4' : feedback === 'ok' ? '#fefce8' : '#fef2f2',
                    color: feedback === 'great' ? '#16a34a' : feedback === 'ok' ? '#ca8a04' : '#dc2626'
                  }}>
                    {feedback === 'great' && '🌟 Super semaine ! Continue sur cette lancée !'}
                    {feedback === 'ok' && '💪 Pas mal ! La régularité se construit progressivement.'}
                    {feedback === 'bad' && '❤️ Chaque semaine est une nouvelle chance. Tu peux faire mieux !'}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1.2rem 1.5rem', border: '1.5px solid #E8648A', borderRadius: '16px', background: '#FFF9FB' }}>
                <h3 style={{ color: '#000', margin: '0 0 0.3rem' }}>📧 Tester les emails</h3>
                <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '1rem' }}>Emails envoyés avec tes vraies données MongoDB</p>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {[
                    { type: 'encouragement', label: '💪 Encouragement' },
                    { type: 'reminder', label: '📋 Rappel activités' },
                    { type: 'summary', label: '📊 Bilan semaine' }
                  ].map(({ type, label }) => (
                    <button key={type} onClick={() => testEmail(type)} disabled={!!emailStatus.loading} style={{
                      padding: '0.55rem 1.2rem', borderRadius: '999px', border: '2px solid #E8648A',
                      background: emailStatus.loading === type ? '#E8648A' : 'transparent',
                      color: emailStatus.loading === type ? '#fff' : '#E8648A',
                      fontWeight: 600, cursor: emailStatus.loading ? 'not-allowed' : 'pointer', fontSize: '0.85rem'
                    }}>
                      {emailStatus.loading === type ? '⏳ Envoi...' : label}
                    </button>
                  ))}
                </div>
                {emailStatus.message && (
                  <p style={{ marginTop: '0.8rem', color: emailStatus.error ? '#e53935' : '#4CAF50', fontWeight: 600, fontSize: '0.9rem' }}>
                    {emailStatus.error ? '❌' : '✅'} {emailStatus.message}
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === 'plan' && (
            <div className="plan-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div>
                  <h2 style={{ color: '#000', margin: 0 }}>📅 Mon plan de la semaine</h2>
                  <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                    Objectif : <strong style={{ color: '#E8648A' }}>{user.goal || 'Bien être'}</strong> — plan généré automatiquement chaque lundi
                  </p>
                </div>
                <button onClick={handleRegenerate} style={{
                  padding: '0.5rem 1rem', borderRadius: '999px', border: '2px solid #E8648A',
                  background: 'transparent', color: '#E8648A', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem'
                }}>🔄 Régénérer</button>
              </div>

              <div className="weekly-progress" style={{ borderColor: '#E8648A', marginBottom: '1.2rem' }}>
                <div className="days-container">
                  {weekDays.map((jour, index) => {
                    const acts = planByDay[index]?.activities || [];
                    return (
                      <div key={index}
                        className={`day-card ${index === currentDayIndex ? 'today' : ''} ${displayedDayIndex === index ? 'selected' : ''}`}
                        style={{ borderColor: '#E8648A', cursor: 'pointer' }}
                        onClick={() => setSelectedDayIndex(index === selectedDayIndex ? null : index)}>
                        <div className="day-name" style={{ color: '#000' }}>{jour}</div>
                        {index === currentDayIndex && <div className="today-indicator">aujourd'hui</div>}
                        <div className="day-percentage" style={{ color: '#E8648A', fontWeight: 'bold', fontSize: '1.1rem' }}>{acts.length}</div>
                        <div className="day-stats-mini">activité{acts.length !== 1 ? 's' : ''}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="activities-list" style={{ borderColor: '#E8648A' }}>
                <h2 style={{ color: '#000' }}>Plan du <span style={{ color: '#E8648A' }}>{weekDays[displayedDayIndex]}</span></h2>
                {planDayActivities.length === 0 ? (
                  <p style={{ color: '#999' }}>Aucune activité prévue ce jour</p>
                ) : (
                  <div className="activities-container">
                    {planDayActivities.map(activity => (
                      <div key={activity._id} className={`activity-item ${activity.completed ? 'completed' : ''}`} style={{ borderLeft: '4px solid #E8648A' }}>
                        <div className="activity-checkbox">
                          <input type="checkbox" checked={activity.completed}
                            onChange={() => handleToggle(activity._id, activity.completed)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E8648A' }} />
                        </div>
                        <div style={{ fontSize: '1.5rem', minWidth: '2.2rem', textAlign: 'center' }}>{TYPE_ICONS[activity.type] || '📌'}</div>
                        <div className="activity-info" style={{ flex: 1 }}>
                          <div className="activity-title-row">
                            <h4 style={{ color: '#000', margin: 0, textDecoration: activity.completed ? 'line-through' : 'none' }}>{activity.title}</h4>
                            <span className="activity-badge" style={{ background: '#FFE4EC', color: '#E8648A' }}>{TYPE_LABELS[activity.type]}</span>
                          </div>
                          {activity.duration > 0 && <div className="activity-details" style={{ marginTop: '0.3rem' }}><span>⏱ {activity.duration} min</span></div>}
                        </div>
                        <div className="activity-status-badge">
                          {activity.completed ? <span style={{ color: '#4CAF50', fontWeight: 600 }}>✓ Fait</span> : <span style={{ color: '#E8648A', fontWeight: 600 }}>À faire</span>}
                        </div>
                        <div className="activity-actions">
                          <button onClick={() => { setSelectedActivity(activity); setNewDate(new Date(activity.date).toISOString().split('T')[0]); setShowRescheduleModal(true); }} className="action-icon" title="Replanifier">📅</button>
                          <button onClick={() => handleDelete(activity._id)} className="action-icon" title="Supprimer">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="add-activity-footer" style={{ marginTop: '1rem' }}>
                  <button onClick={() => setShowAddActivity(true)} className="add-activity-btn-bottom" style={{ color: '#E8648A' }}>+ Ajouter une activité</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddActivity && (
        <div className="modal-overlay" onClick={() => setShowAddActivity(false)}>
          <div className="modal-content" style={{ borderColor: '#E8648A' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#000' }}>➕ Ajouter une activité</h3>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>Pour le : {weekDays[displayedDayIndex]}</p>
            <form onSubmit={handleAddActivity}>
              <select value={newActivity.type} onChange={e => setNewActivity({ ...newActivity, type: e.target.value })} style={{ borderColor: '#E8648A' }}>
                <option value="sport">🏃‍♂️ Sport</option>
                <option value="nutrition">🍎 Nutrition</option>
                <option value="mental">🧘‍♀️ Mental</option>
                <option value="todo">📝 Todo</option>
                <option value="general">📌 Général</option>
              </select>
              <input type="text" placeholder="Titre" value={newActivity.title} onChange={e => setNewActivity({ ...newActivity, title: e.target.value })} required style={{ borderColor: '#E8648A' }} />
              <textarea placeholder="Description (optionnel)" value={newActivity.description} onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} style={{ borderColor: '#E8648A' }} />
              <input type="number" placeholder="Durée en minutes" value={newActivity.duration} onChange={e => setNewActivity({ ...newActivity, duration: e.target.value })} style={{ borderColor: '#E8648A' }} />
              <div className="modal-buttons">
                <button type="submit" style={{ background: '#E8648A', color: 'white' }}>Ajouter</button>
                <button type="button" onClick={() => setShowAddActivity(false)} style={{ borderColor: '#E8648A', color: '#000' }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRescheduleModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
          <div className="modal-content" style={{ borderColor: '#E8648A' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#000' }}>Replanifier</h3>
            <p style={{ color: '#000' }}><strong>{selectedActivity.title}</strong></p>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ borderColor: '#E8648A' }} />
            <div className="modal-buttons">
              <button onClick={handleReschedule} style={{ background: '#E8648A', color: 'white' }}>Replanifier</button>
              <button onClick={() => setShowRescheduleModal(false)} style={{ borderColor: '#E8648A', color: '#000' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      <ChatBot />

    </div>
  );
}

export default Dashboard;