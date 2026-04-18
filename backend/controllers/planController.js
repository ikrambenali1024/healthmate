// backend/controllers/planController.js
const Activity = require('../models/activity');
const User = require('../models/user');
const plans = require('../data/plans');

// Normalise l'objectif pour matcher les clés de plans.js
function normalizeGoal(goal) {
  const g = (goal || '').toLowerCase().trim();
  if (g.includes('perte')) return 'perte de poids';
  if (g.includes('gain'))  return 'gain de poids';
  return 'bien-etre';
}

exports.getPlan = async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Vérifier si un plan existe déjà cette semaine
    const existing = await Activity.find({
      user: req.user.id,
      source: 'plan',
      date: { $gte: weekStart, $lte: weekEnd }
    });

    // Si aucun plan → générer automatiquement selon l'objectif
    if (existing.length === 0) {
      const user = await User.findById(req.user.id);
      const goalKey = normalizeGoal(user.goal || user.objectif);
      const template = plans[goalKey] || plans['bien-etre'];

      const newActivities = template.map(item => {
        const actDate = new Date(weekStart);
        actDate.setDate(weekStart.getDate() + item.dayOffset);
        actDate.setHours(
          item.type === 'nutrition' ? 12 : item.type === 'mental' ? 9 : 17,
          0, 0, 0
        );
        return {
          user: req.user.id,
          type: item.type,
          title: item.title,
          duration: item.duration,
          date: actDate,
          source: 'plan',
          completed: false
        };
      });

      await Activity.insertMany(newActivities);
    }

    // Récupérer toutes les activités de la semaine
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

      planByDay.push({
        dayOffset: i,
        date: dayStart,
        activities: activities.filter(a => {
          const d = new Date(a.date);
          return d >= dayStart && d <= dayEnd;
        })
      });
    }

    res.json({ success: true, data: planByDay });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.regeneratePlan = async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    await Activity.deleteMany({
      user: req.user.id,
      source: 'plan',
      date: { $gte: weekStart, $lte: weekEnd }
    });

    const user = await User.findById(req.user.id);
    const goalKey = normalizeGoal(user.goal || user.objectif);
    const template = plans[goalKey] || plans['bien-etre'];

    const newActivities = template.map(item => {
      const actDate = new Date(weekStart);
      actDate.setDate(weekStart.getDate() + item.dayOffset);
      actDate.setHours(
        item.type === 'nutrition' ? 12 : item.type === 'mental' ? 9 : 17,
        0, 0, 0
      );
      return {
        user: req.user.id,
        type: item.type,
        title: item.title,
        duration: item.duration,
        date: actDate,
        source: 'plan',
        completed: false
      };
    });

    await Activity.insertMany(newActivities);
    res.json({ success: true, message: 'Plan régénéré avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cocher / décocher une activité
exports.toggleActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!activity) return res.status(404).json({ success: false, message: 'Activité introuvable' });

    activity.completed = !activity.completed;
    activity.completedAt = activity.completed ? new Date() : null;
    await activity.save();

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer une activité
exports.deleteActivity = async (req, res) => {
  try {
    await Activity.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true, message: 'Activité supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ajouter une activité manuelle
exports.addActivity = async (req, res) => {
  try {
    const { type, title, description, duration, date } = req.body;
    const activity = await Activity.create({
      user: req.user.id,
      type, title, description,
      duration: duration || 0,
      date: new Date(date),
      source: 'plan',
      completed: false
    });
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Replanifier une activité
exports.rescheduleActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { date: new Date(req.body.date), completed: false, completedAt: null },
      { new: true }
    );
    if (!activity) return res.status(404).json({ success: false, message: 'Activité introuvable' });
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};