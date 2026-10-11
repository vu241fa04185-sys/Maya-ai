const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
} = require('../controllers/conversationController');

router.use(protect); // All conversation routes require login

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversation);
router.patch('/:id', updateConversation);
router.delete('/:id', deleteConversation);

module.exports = router;
