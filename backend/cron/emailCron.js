// backend/cron/emailCron.js
const cron     = require('node-cron');
const User     = require('../models/user');
const Activity = require('../models/activity');
const {
  sendActivityReminder,
  sendDailyEncouragement,
  sendWeeklySummary
} = require('../services/emailService');

function getMonday(date = new Date()) {
  const d    = new Date(date);
  const day  = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startEmailCron() {

  // ── 1. Rappel activités → chaque jour à 08h00 ──────────────────────────
  cron.schedule('0 8 * * *', async () => {
    console.log('📧 [CRON] Envoi rappels activités...');
    try {
      const users = await User.find({ email: { $exists: true, $ne: '' } });

      for (const user of users) {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayEnd = new Date(today);
          todayEnd.setHours(23, 59, 59, 999);

          const activities = await Activity.find({
            user:      user._id,
            source:    'plan',
            completed: false,
            date:      { $gte: today, $lte: todayEnd }
          });

          if (activities.length > 0) {
            await sendActivityReminder(user, activities);
            console.log(`  ✅ Rappel envoyé à ${user.email} (${activities.length} activités)`);
          }
        } catch (err) {
          console.error(`  ❌ Erreur pour ${user.email}:`, err.message);
        }
      }
    } catch (err) {
      console.error('🔴 [CRON] Erreur rappels:', err.message);
    }
  }, { timezone: 'Africa/Tunis' });

  // ── 2. Encouragement quotidien → chaque jour à 12h00 ───────────────────
  cron.schedule('0 12 * * *', async () => {
    console.log('💪 [CRON] Envoi encouragements...');
    try {
      const users = await User.find({ email: { $exists: true, $ne: '' } });

      for (const user of users) {
        try {
          await sendDailyEncouragement(user);
          console.log(`  ✅ Encouragement envoyé à ${user.email}`);
        } catch (err) {
          console.error(`  ❌ Erreur pour ${user.email}:`, err.message);
        }
      }
    } catch (err) {
      console.error('🔴 [CRON] Erreur encouragements:', err.message);
    }
  }, { timezone: 'Africa/Tunis' });

  // ── 3. Bilan semaine → dimanche à 20h00 ────────────────────────────────
  cron.schedule('0 20 * * 0', async () => {
    console.log('📊 [CRON] Envoi bilans hebdomadaires...');
    try {
      const users = await User.find({ email: { $exists: true, $ne: '' } });

      for (const user of users) {
        try {
          const monday  = getMonday();
          const weekEnd = new Date(monday);
          weekEnd.setDate(monday.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          const activities = await Activity.find({
            user: user._id,
            date: { $gte: monday, $lte: weekEnd }
          });

          const total          = activities.length;
          const completed      = activities.filter(a => a.completed).length;
          const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

          await sendWeeklySummary(user, { total, completed, completionRate });
          console.log(`  ✅ Bilan envoyé à ${user.email}`);
        } catch (err) {
          console.error(`  ❌ Erreur pour ${user.email}:`, err.message);
        }
      }
    } catch (err) {
      console.error('🔴 [CRON] Erreur bilans:', err.message);
    }
  }, { timezone: 'Africa/Tunis' });

  console.log('📧 Crons email activés (08h rappels | 12h encouragements | dim 20h bilan)');
}

module.exports = { startEmailCron };