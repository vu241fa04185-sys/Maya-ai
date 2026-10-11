const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { chat } = require('../controllers/chatController');

router.post('/', protect, chat);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', agent: 'MAYA', version: 'v2', timestamp: new Date().toISOString() });
});

module.exports = router;
