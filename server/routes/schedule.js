const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSchedule } = require('../controllers/scheduleController');

router.use(protect); // All schedule routes require auth

router.route('/')
  .get(getSchedule);

module.exports = router;
