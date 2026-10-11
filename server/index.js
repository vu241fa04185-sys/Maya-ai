/**
 * MAYA Backend V2 — Express Entry Point
 * Now with MongoDB, Authentication, Conversations, and Memory
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const chatRoutes         = require('./routes/chat');
const authRoutes         = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const memoryRoutes       = require('./routes/memories');
const projectRoutes      = require('./routes/projects');
const taskRoutes         = require('./routes/tasks');
const goalRoutes         = require('./routes/goals');
const scheduleRoutes     = require('./routes/schedule');
const topicRoutes        = require('./routes/topics');
const { errorHandler }   = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'MAYA Backend V7 is running.', status: 'ok' }));
app.use('/api/auth',          authRoutes);
app.use('/api/chat',          chatRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/memories',      memoryRoutes);
app.use('/api/projects',      projectRoutes);
app.use('/api/tasks',         taskRoutes);
app.use('/api/goals',         goalRoutes);
app.use('/api/schedule',      scheduleRoutes);
app.use('/api/topics',        topicRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ███╗   ███╗ █████╗ ██╗   ██╗ █████╗ ');
  console.log('  ████╗ ████║██╔══██╗╚██╗ ██╔╝██╔══██╗');
  console.log('  ██╔████╔██║███████║ ╚████╔╝ ███████║');
  console.log('  ██║╚██╔╝██║██╔══██║  ╚██╔╝  ██╔══██║');
  console.log('  ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║');
  console.log('  ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝');
  console.log('');
  console.log('  Personal AI Life & Project Assistant');
  console.log(`  Version: V2 | Port: ${PORT}`);
  console.log('  Features: MongoDB + Auth + Memory');
  console.log('  Status:   Running ✓');
  console.log('');
});

process.on('unhandledRejection', (reason) => {
  console.error('[MAYA] Unhandled Promise Rejection:', reason);
});
