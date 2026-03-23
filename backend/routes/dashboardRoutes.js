const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getActivities,
  createActivity,
  getDashboard
} = require('../controllers/dashboardController');

// Toutes les routes nécessitent d'être connecté
router.use(protect);

// GET  /api/dashboard        → vue globale
router.get('/', getDashboard);

// GET  /api/dashboard/activities  → liste des activités
// POST /api/dashboard/activities  → créer une activité
router.route('/activities')
  .get(getActivities)
  .post(createActivity);

module.exports = router;