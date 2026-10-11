const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.use(protect); // All task routes require auth

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

module.exports = router;
