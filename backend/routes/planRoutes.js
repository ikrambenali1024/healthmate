const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPlan, regeneratePlan } = require('../controllers/planController');

router.use(protect);

router.get('/', getPlan);
router.post('/regenerate', regeneratePlan);

module.exports = router;