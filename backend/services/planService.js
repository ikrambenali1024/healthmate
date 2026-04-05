// backend/services/planService.js
const Activity = require('../models/activity');
const User     = require('../models/user');
const plans    = require('../data/plans');

// Retourne le lundi de la semaine courante à minuit
function getMonday(date = new Date()) {
  const d    = new Date(date);
  const day  = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Génère le plan pour UN utilisateur donné
async function generatePlanForUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur introuvable');

  const goal    = (user.goal || '').toLowerCase().trim();
  const planKey = Object.keys(plans).find(k => k === goal);
  if (!planKey) throw new Error(`Aucun plan pour l'objectif : "${goal}"`);

  const monday = getMonday();
  const weekEnd = new Date(monday);
  weekEnd.setDate(monday.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // Supprime l'ancien plan auto de cette semaine
  await Activity.deleteMany({
    user:   userId,
    source: 'plan',
    date:   { $gte: monday, $lte: weekEnd }
  });

  // Crée les nouvelles activités
  const template  = plans[planKey];
  const created   = [];

  for (const item of template) {
    const activityDate = new Date(monday);
    activityDate.setDate(monday.getDate() + item.dayOffset);
    activityDate.setHours(9, 0, 0, 0);

    const activity = await Activity.create({
      user:      userId,
      type:      item.type,
      title:     item.title,
      duration:  item.duration,
      date:      activityDate,
      completed: false,
      source:    'plan'
    });

    created.push(activity);
  }

  return created;
}

// Génère le plan pour TOUS les utilisateurs (appelé par le cron)
async function generatePlansForAllUsers() {
  const users   = await User.find({ goal: { $exists: true, $ne: '' } });
  const results = { success: 0, errors: 0 };

  for (const user of users) {
    try {
      await generatePlanForUser(user._id);
      results.success++;
      console.log(`✅ Plan généré pour ${user.email}`);
    } catch (err) {
      results.errors++;
      console.error(`❌ Erreur pour ${user.email} : ${err.message}`);
    }
  }

  console.log(`🏁 Génération terminée : ${results.success} succès, ${results.errors} erreurs`);
  return results;
}

// Retourne le plan de la semaine pour un utilisateur
async function getPlanForUser(userId) {
  const monday = getMonday();
  const weekEnd = new Date(monday);
  weekEnd.setDate(monday.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const activities = await Activity.find({
    user:   userId,
    source: 'plan',
    date:   { $gte: monday, $lte: weekEnd }
  }).sort({ date: 1 });

  // Groupe par dayOffset (0=lundi … 6=dimanche)
  const days = Array.from({ length: 7 }, (_, i) => ({
    dayOffset:  i,
    activities: []
  }));

  for (const act of activities) {
    const actDate = new Date(act.date);
    actDate.setHours(0, 0, 0, 0);
    const diff = Math.round((actDate - monday) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff <= 6) days[diff].activities.push(act);
  }

  return days;
}

module.exports = { generatePlanForUser, generatePlansForAllUsers, getPlanForUser, getMonday };