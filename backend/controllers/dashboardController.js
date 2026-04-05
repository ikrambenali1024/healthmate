const Activity = require('../models/activity');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const { type, title, description, date, duration, mood, feedback, source } = req.body;

    if (!type || !title) {
      return res.status(400).json({ success: false, message: 'type et title sont obligatoires' });
    }

    const activity = new Activity({
      user: req.user.id,
      type,
      title,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      duration: duration || 0,
      mood: mood || null,
      feedback: feedback || '',
      source: source || 'manual',  // IMPORTANT: ajouter source
      completed: false
    });

    await activity.save();
    res.status(201).json({ success: true, data: activity });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
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
    
    // Récupérer TOUTES les activités de la semaine (sans filtre source)
    const weekActivities = await Activity.find({
      user: userId,
      date: { $gte: weekStart, $lte: weekEnd }
    });
    
    const total = weekActivities.length;
    const completed = weekActivities.filter(a => a.completed).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const daysData = [];  // Renommé de dailyBreakdown à daysData pour correspondre au frontend

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(weekStart);
      dayStart.setDate(weekStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayActivities = weekActivities.filter(a => {
        const d = new Date(a.date);
        return d >= dayStart && d <= dayEnd;
      });

      const dayTotal = dayActivities.length;
      const dayCompleted = dayActivities.filter(a => a.completed).length;
      const dayCompletionRate = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;

      daysData.push({
        jour: jours[i],
        date: dayStart,
        total: dayTotal,
        completed: dayCompleted,
        completionRate: dayCompletionRate,
        isToday: dayStart.toDateString() === today.toDateString(),
        activities: dayActivities  // Ajouter les activités pour le jour
      });
    }

    res.json({
      success: true,
      data: {
        weekStats: { total, completed, completionRate },
        daysData: daysData,  // Renommé pour correspondre au frontend
        activities: weekActivities
      }
    });

  } catch (error) {
    console.error('Erreur getDashboard:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

exports.completeActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { completed } = req.body;

    const activity = await Activity.findOne({ _id: id, user: userId });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activité non trouvée' });
    }

    activity.completed = completed;
    activity.completedAt = completed ? new Date() : null;

    await activity.save();
    res.json({ success: true, data: activity });

  } catch (error) {
    console.error('Erreur completeActivity:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const activity = await Activity.findOne({ _id: id, user: userId });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activité non trouvée' });
    }

    const allowedFields = ['title', 'description', 'type', 'duration', 'date', 'completed', 'completedAt', 'mood', 'feedback'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) activity[field] = req.body[field];
    });

    await activity.save();
    res.json({ success: true, data: activity });

  } catch (error) {
    console.error('Erreur updateActivity:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const activity = await Activity.findOneAndDelete({ _id: id, user: userId });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activité non trouvée' });
    }

    res.json({ success: true, message: 'Activité supprimée avec succès' });

  } catch (error) {
    console.error('Erreur deleteActivity:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};