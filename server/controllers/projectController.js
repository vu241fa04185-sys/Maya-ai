const Project = require('../models/Project');

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ projects });
  } catch (err) { next(err); }
};

// GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ project });
  } catch (err) { next(err); }
};

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { name, description, status, priority, technologies, deadline } = req.body;
    if (!name) return res.status(400).json({ error: 'Project name is required' });

    const project = await Project.create({
      userId: req.user._id,
      name,
      description,
      status,
      priority,
      technologies,
      deadline
    });
    res.status(201).json({ project });
  } catch (err) { next(err); }
};

// PATCH /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ project });
  } catch (err) { next(err); }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    // Note: We might want to cascade delete or orphan tasks later
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) { next(err); }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
