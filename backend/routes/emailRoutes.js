// backend/routes/emailRoutes.js
const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User     = require('../models/user');
const Activity = require('../models/activity');
const {
  sendActivityReminder,
  sendDailyEncouragement,
  sendWeeklySummary
} = require('../services/emailService');

router.use(protect);

// POST /api/email/test-reminder → teste le rappel avec vraies activités du jour
router.post('/test-reminder', async (req, res) => {
  try {
    const user     = await User.findById(req.user.id);
    const today    = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      user:      req.user.id,
      source:    'plan',
      completed: false,
      date:      { $gte: today, $lte: todayEnd }
    });

    if (activities.length === 0) {
      return res.json({ success: false, message: 'Aucune activité non complétée aujourd\'hui' });
    }

    await sendActivityReminder(user, activities);
    res.json({ success: true, message: `Email de rappel envoyé à ${user.email} (${activities.length} activité(s))` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/email/test-encouragement → teste l'encouragement
router.post('/test-encouragement', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await sendDailyEncouragement(user);
    res.json({ success: true, message: `Email d'encouragement envoyé à ${user.email}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/email/test-summary → bilan avec vraies données MongoDB
router.post('/test-summary', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Calcul de la semaine courante (lundi → dimanche)
    const today      = new Date();
    const weekStart  = new Date(today);
    const dayOfWeek  = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Vraies activités depuis MongoDB
    const activities = await Activity.find({
      user:   req.user.id,
      source: 'plan',
      date:   { $gte: weekStart, $lte: weekEnd }
    });

    const total          = activities.length;
    const completed      = activities.filter(a => a.completed).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    await sendWeeklySummary(user, { total, completed, completionRate });
    res.json({
      success: true,
      message: `Email de bilan envoyé à ${user.email} (${completed}/${total} — ${completionRate}%)`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;