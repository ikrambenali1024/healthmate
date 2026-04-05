// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getDashboard,
  getActivities,
  createActivity,
  completeActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/dashboardController');

router.use(protect);

// Dashboard principal
router.get('/', getDashboard);

// Liste + création
router.route('/activities')
  .get(getActivities)
  .post(createActivity);

// Cocher / décocher
router.put('/activities/:id/complete', completeActivity);

// Modifier + Supprimer
router.route('/activities/:id')
  .put(updateActivity)
  .delete(deleteActivity);

module.exports = router;