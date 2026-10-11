const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMemories, createMemory, deleteMemory } = require('../controllers/memoryController');

router.use(protect);

router.get('/', getMemories);
router.post('/', createMemory);
router.delete('/:id', deleteMemory);

module.exports = router;
