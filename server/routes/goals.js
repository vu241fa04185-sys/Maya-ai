const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

router.use(protect); // All goal routes require auth

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .patch(updateGoal)
  .delete(deleteGoal);

module.exports = router;
