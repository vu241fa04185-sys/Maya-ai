const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');

router.use(protect); // All project routes require auth

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject);

module.exports = router;
