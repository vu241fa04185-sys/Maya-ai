const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTopics, createTopic, updateTopic, deleteTopic } = require('../controllers/topicController');

router.use(protect);

router.route('/')
  .get(getTopics)
  .post(createTopic);

router.route('/:id')
  .patch(updateTopic)
  .delete(deleteTopic);

module.exports = router;
