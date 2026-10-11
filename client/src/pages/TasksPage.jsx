import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function TasksPage() {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask]     = useState({ title: '', priority: 'medium' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tasks', { ...newTask, status: 'pending' });
      setTasks([res.data.task, ...tasks]);
      setShowModal(false);
      setNewTask({ title: '', priority: 'medium' });
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const toggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await axios.patch(`/api/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map(t => (t._id === task._id ? res.data.task : t)));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  // Sort: pending first, completed last
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="os-page-container">
      <div className="workspace-page">
        <header className="workspace-header">
          <div>
            <h1 className="workspace-title">Tasks</h1>
            <p className="workspace-subtitle">Track what you need to get done</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
        </header>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>You have no tasks! Start by adding one.</div>
        ) : (
          <div className="tasks-board">
            {sortedTasks.map(task => (
              <div key={task._id} className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
                <div className="task-checkbox" onClick={() => toggleTask(task)}></div>
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`task-priority ${task.priority}`}>
                      {task.priority.toUpperCase()} PRIORITY
                    </span>
                    {task.estimatedMinutes > 0 && <span>⏱ {task.estimatedMinutes} min</span>}
                  </div>
                </div>
                <button className="conversation-delete" style={{ opacity: 1, padding: '8px' }} onClick={(e) => handleDelete(e, task._id)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Create New Task</h2>
            <form onSubmit={handleCreate} className="auth-form">
              <div className="auth-field">
                <label>What needs to be done?</label>
                <input 
                  type="text" 
                  required 
                  autoFocus
                  placeholder="e.g. Finish math assignment"
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                />
              </div>
              <div className="auth-field">
                <label>Priority</label>
                <select 
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;

