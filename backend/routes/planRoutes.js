// backend/routes/planRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPlan,
  regeneratePlan,
  toggleActivity,
  deleteActivity,
  addActivity,
  rescheduleActivity
} = require('../controllers/planController');

router.use(protect);

router.get('/', getPlan);
router.post('/regenerate', regeneratePlan);
router.post('/activity', addActivity);
router.patch('/activity/:id/toggle', toggleActivity);
router.patch('/activity/:id/reschedule', rescheduleActivity);
router.delete('/activity/:id', deleteActivity);

module.exports = router;