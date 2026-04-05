// backend/controllers/planController.js
const Activity = require('../models/activity');

// @desc    Get weekly plan (only source: 'plan')
// @route   GET /api/plan
// @access  Private
exports.getPlan = async (req, res) => {
  try {
    const today = new Date();
    
    // Début de la semaine (Lundi)
    const weekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    // Récupérer UNIQUEMENT les activités avec source 'plan'
    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: weekStart, $lte: weekEnd },
      source: 'plan'
    }).sort({ date: 1 });
    
    // Organiser par jour
    const planByDay = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(weekStart);
      dayStart.setDate(weekStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayActivities = activities.filter(a => {
        const d = new Date(a.date);
        return d >= dayStart && d <= dayEnd;
      });
      
      planByDay.push({
        dayOffset: i,
        date: dayStart,
        activities: dayActivities
      });
    }
    
    res.json({ 
      success: true, 
      data: planByDay 
    });
  } catch (error) {
    console.error('Erreur getPlan:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// @desc    Regenerate plan
// @route   POST /api/plan/regenerate
// @access  Private
exports.regeneratePlan = async (req, res) => {
  try {
    const today = new Date();
    
    // Début de la semaine (Lundi)
    const weekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    // Supprimer les anciennes activités du plan
    await Activity.deleteMany({
      user: req.user.id,
      source: 'plan',
      date: { $gte: weekStart, $lte: weekEnd }
    });
    
    // Générer un nouveau plan (2 activités par jour)
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const newActivities = [];
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      
      // Matin - Méditation
      const morningDate = new Date(dayDate);
      morningDate.setHours(9, 0, 0, 0);
      newActivities.push({
        user: req.user.id,
        type: 'mental',
        title: 'Méditation',
        description: '10 minutes de méditation pour commencer la journée',
        duration: 10,
        date: morningDate,
        source: 'plan',
        completed: false
      });
      
      // Après-midi - Sport
      const afternoonDate = new Date(dayDate);
      afternoonDate.setHours(17, 0, 0, 0);
      newActivities.push({
        user: req.user.id,
        type: 'sport',
        title: 'Activité physique',
        description: '30 minutes d\'exercice',
        duration: 30,
        date: afternoonDate,
        source: 'plan',
        completed: false
      });
    }
    
    await Activity.insertMany(newActivities);
    
    res.json({ 
      success: true, 
      message: 'Plan régénéré avec succès' 
    });
  } catch (error) {
    console.error('Erreur regeneratePlan:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};