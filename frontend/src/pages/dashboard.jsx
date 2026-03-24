import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/animation.css";
import "../styles/components.css";

function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newActivity, setNewActivity] = useState({
    type: 'sport',
    title: '',
    description: '',
    duration: ''
  });
  
  // ✅ État pour le jour sélectionné
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  // Récupérer les infos utilisateur
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userFullName = user.name || user.firstName || user.username || 'Utilisateur';

  // ✅ Utilisation de useMemo pour éviter les recréations
  const weekDays = useMemo(() => 
    ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'], 
    []
  );
  
  const today = useMemo(() => new Date(), []);
  const currentDayIndex = useMemo(() => today.getDay() === 0 ? 6 : today.getDay() - 1, [today]);

  // Charger les activités depuis l'API
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('📊 Données reçues du backend:', data);
      
      if (data.success) {
        let formattedData;
        
        if (data.data.activities) {
          // Calculer les stats par jour
          const activitiesByDay = weekDays.map((_, index) => {
            const dayDate = new Date(today);
            const dayOffset = index - currentDayIndex;
            dayDate.setDate(today.getDate() + dayOffset);
            dayDate.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dayActivities = data.data.activities.filter(activity => {
              const activityDate = new Date(activity.date);
              return activityDate >= dayDate && activityDate <= dayEnd;
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
          
          // Stats globales de la semaine
          const weekTotal = activitiesByDay.reduce((sum, day) => sum + day.total, 0);
          const weekCompleted = activitiesByDay.reduce((sum, day) => sum + day.completed, 0);
          const weekCompletionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
          
          formattedData = {
            weekStats: {
              total: weekTotal,
              completed: weekCompleted,
              completionRate: weekCompletionRate
            },
            daysData: activitiesByDay,
            selectedDayData: activitiesByDay[selectedDayIndex !== null ? selectedDayIndex : currentDayIndex],
            selectedDayIndex: selectedDayIndex !== null ? selectedDayIndex : currentDayIndex
          };
        } else {
          // Structure par défaut
          const defaultDaysData = weekDays.map((jour, index) => ({
            jour,
            date: new Date(),
            total: 0,
            completed: 0,
            completionRate: 0,
            isToday: index === currentDayIndex,
            activities: []
          }));
          
          formattedData = {
            weekStats: { total: 0, completed: 0, completionRate: 0 },
            daysData: defaultDaysData,
            selectedDayData: defaultDaysData[selectedDayIndex !== null ? selectedDayIndex : currentDayIndex],
            selectedDayIndex: selectedDayIndex !== null ? selectedDayIndex : currentDayIndex
          };
        }
        
        setDashboardData(formattedData);
      } else {
        setErrorMessage(data.message || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setErrorMessage('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }, [navigate, selectedDayIndex, currentDayIndex, weekDays, today]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    fetchDashboardData();
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ✅ Navigation entre les jours
  const handleDaySelect = (index) => {
    setSelectedDayIndex(index === selectedDayIndex ? null : index);
  };

  // ✅ Ajouter une activité localement
  const handleAddActivity = (e) => {
    e.preventDefault();
    
    if (!newActivity.title) {
      return;
    }
    
    const targetDayIndex = selectedDayIndex !== null ? selectedDayIndex : currentDayIndex;
    const targetDate = new Date(today);
    const dayOffset = targetDayIndex - currentDayIndex;
    targetDate.setDate(today.getDate() + dayOffset);
    targetDate.setHours(0, 0, 0, 0);
    
    const newActivityObj = {
      _id: Date.now().toString(),
      type: newActivity.type,
      title: newActivity.title,
      description: newActivity.description || '',
      duration: parseInt(newActivity.duration) || 0,
      completed: false,
      completedAt: null,
      date: targetDate.toISOString()
    };
    
    setDashboardData(prevData => {
      if (!prevData) return prevData;
      
      const updatedDaysData = [...prevData.daysData];
      const dayToUpdate = updatedDaysData[targetDayIndex];
      const updatedActivities = [newActivityObj, ...dayToUpdate.activities];
      const total = updatedActivities.length;
      const completed = updatedActivities.filter(a => a.completed).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      updatedDaysData[targetDayIndex] = {
        ...dayToUpdate,
        activities: updatedActivities,
        total,
        completed,
        completionRate
      };
      
      const weekTotal = updatedDaysData.reduce((sum, day) => sum + day.total, 0);
      const weekCompleted = updatedDaysData.reduce((sum, day) => sum + day.completed, 0);
      const weekCompletionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
      
      return {
        ...prevData,
        daysData: updatedDaysData,
        weekStats: { total: weekTotal, completed: weekCompleted, completionRate: weekCompletionRate },
        selectedDayData: updatedDaysData[prevData.selectedDayIndex],
        selectedDayIndex: prevData.selectedDayIndex
      };
    });
    
    setNewActivity({ type: 'sport', title: '', description: '', duration: '' });
    setShowAddActivity(false);
  };

  // ✅ Marquer une activité comme complétée
  const handleCompleteActivity = (activityId, currentStatus, dayIndex) => {
    setDashboardData(prevData => {
      if (!prevData) return prevData;
      
      const updatedDaysData = [...prevData.daysData];
      const dayToUpdate = updatedDaysData[dayIndex];
      const updatedActivities = dayToUpdate.activities.map(activity => {
        if (activity._id === activityId) {
          return {
            ...activity,
            completed: !currentStatus,
            completedAt: !currentStatus ? new Date().toISOString() : null
          };
        }
        return activity;
      });
      
      const total = updatedActivities.length;
      const completed = updatedActivities.filter(a => a.completed).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      updatedDaysData[dayIndex] = {
        ...dayToUpdate,
        activities: updatedActivities,
        total,
        completed,
        completionRate
      };
      
      const weekTotal = updatedDaysData.reduce((sum, day) => sum + day.total, 0);
      const weekCompleted = updatedDaysData.reduce((sum, day) => sum + day.completed, 0);
      const weekCompletionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
      
      return {
        ...prevData,
        daysData: updatedDaysData,
        weekStats: { total: weekTotal, completed: weekCompleted, completionRate: weekCompletionRate },
        selectedDayData: updatedDaysData[prevData.selectedDayIndex],
        selectedDayIndex: prevData.selectedDayIndex
      };
    });
  };

  // ✅ Replanifier une activité
  const handleRescheduleActivity = () => {
    if (!selectedActivity || !newDate) return;
    
    const newActivityDate = new Date(newDate);
    const targetDayIndex = newActivityDate.getDay() === 0 ? 6 : newActivityDate.getDay() - 1;
    
    setDashboardData(prevData => {
      if (!prevData) return prevData;
      
      const updatedDaysData = [...prevData.daysData];
      
      const currentDayData = updatedDaysData[selectedActivity.dayIndex];
      const filteredActivities = currentDayData.activities.filter(a => a._id !== selectedActivity._id);
      const currentTotal = filteredActivities.length;
      const currentCompleted = filteredActivities.filter(a => a.completed).length;
      const currentRate = currentTotal > 0 ? Math.round((currentCompleted / currentTotal) * 100) : 0;
      
      updatedDaysData[selectedActivity.dayIndex] = {
        ...currentDayData,
        activities: filteredActivities,
        total: currentTotal,
        completed: currentCompleted,
        completionRate: currentRate
      };
      
      const updatedActivity = {
        ...selectedActivity,
        date: newActivityDate.toISOString(),
        completed: false,
        completedAt: null
      };
      
      const targetDayData = updatedDaysData[targetDayIndex];
      const newActivities = [updatedActivity, ...targetDayData.activities];
      const newTotal = newActivities.length;
      const newCompleted = newActivities.filter(a => a.completed).length;
      const newRate = newTotal > 0 ? Math.round((newCompleted / newTotal) * 100) : 0;
      
      updatedDaysData[targetDayIndex] = {
        ...targetDayData,
        activities: newActivities,
        total: newTotal,
        completed: newCompleted,
        completionRate: newRate
      };
      
      const weekTotal = updatedDaysData.reduce((sum, day) => sum + day.total, 0);
      const weekCompleted = updatedDaysData.reduce((sum, day) => sum + day.completed, 0);
      const weekCompletionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
      
      return {
        ...prevData,
        daysData: updatedDaysData,
        weekStats: { total: weekTotal, completed: weekCompleted, completionRate: weekCompletionRate },
        selectedDayData: updatedDaysData[prevData.selectedDayIndex],
        selectedDayIndex: prevData.selectedDayIndex
      };
    });
    
    setShowRescheduleModal(false);
    setSelectedActivity(null);
    setNewDate('');
  };

  // ✅ Supprimer une activité
  const handleDeleteActivity = (activityId, dayIndex) => {
    setDashboardData(prevData => {
      if (!prevData) return prevData;
      
      const updatedDaysData = [...prevData.daysData];
      const dayToUpdate = updatedDaysData[dayIndex];
      const updatedActivities = dayToUpdate.activities.filter(activity => activity._id !== activityId);
      const total = updatedActivities.length;
      const completed = updatedActivities.filter(a => a.completed).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      updatedDaysData[dayIndex] = {
        ...dayToUpdate,
        activities: updatedActivities,
        total,
        completed,
        completionRate
      };
      
      const weekTotal = updatedDaysData.reduce((sum, day) => sum + day.total, 0);
      const weekCompleted = updatedDaysData.reduce((sum, day) => sum + day.completed, 0);
      const weekCompletionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
      
      return {
        ...prevData,
        daysData: updatedDaysData,
        weekStats: { total: weekTotal, completed: weekCompleted, completionRate: weekCompletionRate },
        selectedDayData: updatedDaysData[prevData.selectedDayIndex],
        selectedDayIndex: prevData.selectedDayIndex
      };
    });
  };

  const openRescheduleModal = (activity, dayIndex) => {
    setSelectedActivity({ ...activity, dayIndex });
    const date = new Date(activity.date);
    setNewDate(date.toISOString().split('T')[0]);
    setShowRescheduleModal(true);
  };

  // Déterminer le statut de la semaine
  const getWeekStatus = () => {
    if (currentDayIndex === 0) return "Début de semaine";
    if (currentDayIndex === 6) return "Semaine terminée";
    return "Semaine en cours";
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="grain"></div>
        <div className="blob blob-a"></div>
        <div className="blob blob-b"></div>
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p style={{ color: '#000000' }}>Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="dashboard-wrapper">
        <div className="grain"></div>
        <div className="blob blob-a"></div>
        <div className="blob blob-b"></div>
        <div className="dashboard-error">
          <p style={{ color: '#000000' }}>❌ {errorMessage}</p>
          <button onClick={fetchDashboardData} style={{ borderColor: '#E8648A', color: '#000000' }}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const currentDisplayData = selectedDayIndex !== null 
    ? dashboardData.daysData[selectedDayIndex]
    : dashboardData.daysData[currentDayIndex];

  return (
    <div className="dashboard-wrapper">
      <div className="grain"></div>
      <div className="blob blob-a"></div>
      <div className="blob blob-b"></div>

      <nav className="dashboard-navbar">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #E8648A, #C44B72)' }}>
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
            </svg>
          </div>
          <Link to="/" className="auth-logo-name" style={{ color: '#000000', textDecoration: 'none' }}>HealthMate</Link>
        </div>
        <div className="nav-user">
          <span style={{ color: '#000000' }}>👋 Bonjour, <strong>{userFullName}</strong> !</span>
          <button onClick={handleLogout} className="btn-logout" style={{ borderColor: '#E8648A', color: '#000000' }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div 
          className="dashboard-box"
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`
          }}
        >
          <div className="dashboard-header">
            <h1 style={{ color: '#000000' }}>
              Tableau de bord <span style={{ color: '#E8648A' }}>🏠</span>
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card" style={{ borderColor: '#E8648A' }}>
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3 style={{ color: '#000000' }}>Activités cette semaine</h3>
                <p className="stat-number" style={{ color: '#000000' }}>
                  {dashboardData.weekStats.total}
                </p>
                <p style={{ color: '#000000', fontSize: '0.8rem' }}>
                  sur {dashboardData.weekStats.total} planifiées
                </p>
              </div>
            </div>

            <div className="stat-card" style={{ borderColor: '#E8648A' }}>
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3 style={{ color: '#000000' }}>Complétées</h3>
                <p className="stat-number" style={{ color: '#000000' }}>
                  {dashboardData.weekStats.completed}
                </p>
                <p style={{ color: '#000000', fontSize: '0.8rem' }}>
                  activités terminées
                </p>
              </div>
            </div>

            <div className="stat-card" style={{ borderColor: '#E8648A' }}>
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <h3 style={{ color: '#000000' }}>Taux de réussite</h3>
                <p className="stat-number" style={{ color: '#000000' }}>
                  {dashboardData.weekStats.completionRate}%
                </p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${dashboardData.weekStats.completionRate}%`, background: '#E8648A' }}
                  ></div>
                </div>
                <p style={{ color: '#000000', fontSize: '0.7rem', marginTop: '0.3rem' }}>
                  {getWeekStatus()}
                </p>
              </div>
            </div>
          </div>

          {/* Progression de la semaine avec navigation */}
          <div className="weekly-progress" style={{ borderColor: '#E8648A' }}>
            <h2 style={{ color: '#000000' }}>Progression de la semaine</h2>
            <div className="days-container">
              {dashboardData.daysData.map((day, index) => (
                <div 
                  key={index} 
                  className={`day-card ${day.isToday ? 'today' : ''} ${selectedDayIndex === index ? 'selected' : ''}`} 
                  style={{ borderColor: '#E8648A', cursor: 'pointer' }}
                  onClick={() => handleDaySelect(index)}
                >
                  <div className="day-name" style={{ color: '#000000' }}>{day.jour}</div>
                  {day.isToday && <div className="today-indicator">aujourd'hui</div>}
                  <div className="day-percentage" style={{ color: '#E8648A', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {day.completionRate}%
                  </div>
                  <div className="day-stats-mini">
                    {day.completed}/{day.total}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activités du jour sélectionné */}
          <div className="activities-list" style={{ borderColor: '#E8648A' }}>
            <h2 style={{ color: '#000000' }}>
              {selectedDayIndex !== null 
                ? `Activités du ${dashboardData.daysData[selectedDayIndex].jour}`
                : 'Activités du jour'}
            </h2>
            
            <div className="activities-container">
              {currentDisplayData && currentDisplayData.activities.length === 0 ? (
                <div className="no-activities">
                  <p style={{ color: '#999' }}>Aucune activité pour ce jour</p>
                </div>
              ) : currentDisplayData ? (
                currentDisplayData.activities.map((activity) => (
                  <div key={activity._id} className={`activity-item ${activity.completed ? 'completed' : ''}`}>
                    <div className="activity-checkbox">
                      <input
                        type="checkbox"
                        checked={activity.completed}
                        onChange={() => handleCompleteActivity(
                          activity._id, 
                          activity.completed, 
                          selectedDayIndex !== null ? selectedDayIndex : currentDayIndex
                        )}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E8648A' }}
                      />
                    </div>
                    <div className="activity-info">
                      <div className="activity-title-row">
                        <h4 style={{ color: '#000000', textDecoration: activity.completed ? 'line-through' : 'none' }}>
                          {activity.title}
                        </h4>
                        <span className="activity-badge" style={{ background: '#FFE4EC', color: '#E8648A' }}>
                          {activity.type}
                        </span>
                      </div>
                      <div className="activity-details">
                        {activity.duration > 0 && (
                          <span>{activity.duration} min</span>
                        )}
                        {activity.description && (
                          <span className="activity-desc">{activity.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="activity-status-badge">
                      {activity.completed ? (
                        <span style={{ color: '#4CAF50' }}>Complété ✓</span>
                      ) : (
                        <span style={{ color: '#E8648A' }}>En cours</span>
                      )}
                    </div>
                    <div className="activity-actions">
                      <button 
                        onClick={() => openRescheduleModal(activity, selectedDayIndex !== null ? selectedDayIndex : currentDayIndex)}
                        className="action-icon"
                        title="Replanifier"
                      >
                        📅
                      </button>
                      <button 
                        onClick={() => handleDeleteActivity(activity._id, selectedDayIndex !== null ? selectedDayIndex : currentDayIndex)}
                        className="action-icon"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activities">
                  <p style={{ color: '#999' }}>Sélectionnez un jour pour voir les activités</p>
                </div>
              )}
            </div>

            {/* Bouton + Ajouter une activité en bas */}
            <div className="add-activity-footer">
              <button 
                onClick={() => setShowAddActivity(true)} 
                className="add-activity-btn-bottom"
                style={{ color: '#E8648A' }}
              >
                + Ajouter une activité
              </button>
            </div>
            {selectedDayIndex !== null && (
              <div className="view-week-btn">
                <button 
                  onClick={() => setSelectedDayIndex(null)} 
                  className="view-week-button"
                  style={{ color: '#E8648A', fontSize: '0.75rem', marginTop: '0.5rem' }}
                >
                  ← Voir la semaine complète
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Ajout Activité */}
      {showAddActivity && (
        <div className="modal-overlay" onClick={() => setShowAddActivity(false)}>
          <div className="modal-content" style={{ borderColor: '#E8648A' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#000000' }}>Ajouter une activité</h3>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
              Pour le : {selectedDayIndex !== null 
                ? dashboardData?.daysData[selectedDayIndex]?.jour 
                : "aujourd'hui"}
            </p>
            <form onSubmit={handleAddActivity}>
              <select 
                value={newActivity.type} 
                onChange={e => setNewActivity({...newActivity, type: e.target.value})}
                style={{ borderColor: '#E8648A', color: '#000000' }}
                required
              >
                <option value="sport">🏃‍♂️ Sport</option>
                <option value="nutrition">🍎 Nutrition</option>
                <option value="mental">🧘‍♀️ Mental</option>
                <option value="todo">📝 Todo</option>
                <option value="general">📌 Général</option>
              </select>
              <input
                type="text"
                placeholder="Titre de l'activité"
                value={newActivity.title}
                onChange={e => setNewActivity({...newActivity, title: e.target.value})}
                required
                style={{ borderColor: '#E8648A', color: '#000000' }}
              />
              <textarea
                placeholder="Description (optionnel)"
                value={newActivity.description}
                onChange={e => setNewActivity({...newActivity, description: e.target.value})}
                style={{ borderColor: '#E8648A', color: '#000000' }}
              />
              <input
                type="number"
                placeholder="Durée en minutes (optionnel)"
                value={newActivity.duration}
                onChange={e => setNewActivity({...newActivity, duration: e.target.value})}
                style={{ borderColor: '#E8648A', color: '#000000' }}
              />
              <div className="modal-buttons">
                <button type="submit" style={{ background: '#E8648A', color: 'white' }}>Ajouter</button>
                <button type="button" onClick={() => setShowAddActivity(false)} style={{ borderColor: '#E8648A', color: '#000000' }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Replanification */}
      {showRescheduleModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
          <div className="modal-content" style={{ borderColor: '#E8648A' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#000000' }}>Replanifier l'activité</h3>
            <p style={{ color: '#000000', marginBottom: '1rem' }}>
              <strong>{selectedActivity.title}</strong> pour quelle date ?
            </p>
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              style={{ borderColor: '#E8648A', color: '#000000', padding: '0.7rem', borderRadius: '12px', width: '100%', marginBottom: '1rem' }}
            />
            <div className="modal-buttons">
              <button onClick={handleRescheduleActivity} style={{ background: '#E8648A', color: 'white' }}>Replanifier</button>
              <button onClick={() => setShowRescheduleModal(false)} style={{ borderColor: '#E8648A', color: '#000000' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;