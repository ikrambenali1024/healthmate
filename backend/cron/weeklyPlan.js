// backend/cron/weeklyPlan.js
const cron = require('node-cron');
const { generatePlansForAllUsers } = require('../services/planService');

// Chaque lundi à 00:05 (évite les conflits minuit pile)
// Format cron : seconde minute heure jour mois jourSemaine
// node-cron : minute heure jourDuMois mois jourDeLaSemaine
// '1' = lundi dans node-cron (0=dimanche, 1=lundi ...)
function startWeeklyPlanCron() {
  cron.schedule('5 0 * * 1', async () => {
    console.log('🕐 [CRON] Lancement génération hebdomadaire des plans...');
    try {
      await generatePlansForAllUsers();
    } catch (err) {
      console.error('🔴 [CRON] Erreur critique :', err.message);
    }
  }, {
    timezone: 'Africa/Tunis' // adapte selon ton fuseau horaire
  });

  console.log('⏰ Cron plan hebdomadaire activé (chaque lundi à 00h05)');
}

module.exports = { startWeeklyPlanCron };