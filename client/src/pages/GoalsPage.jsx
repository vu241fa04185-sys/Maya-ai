import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', progress: 0 });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await axios.get('/api/goals');
      setGoals(res.data.goals);
    } catch (err) {
      console.error('Failed to fetch goals', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/goals', newGoal);
      setGoals([res.data.goal, ...goals]);
      setShowModal(false);
      setNewGoal({ title: '', description: '', progress: 0 });
    } catch (err) {
      console.error('Failed to create goal', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this goal?')) return;
    try {
      await axios.delete(`/api/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
    } catch (err) {
      console.error('Failed to delete goal', err);
    }
  };

  return (
    <div className="os-page-container">
      <div className="workspace-page">
        <header className="workspace-header">
          <div>
            <h1 className="workspace-title">Goals</h1>
            <p className="workspace-subtitle">Set your long-term objectives and track progress</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Goal</button>
        </header>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading goals...</div>
        ) : goals.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>No goals set. What do you want to achieve?</div>
        ) : (
          <div className="projects-grid">
            {goals.map(goal => (
              <div key={goal._id} className="project-card">
                <div className="project-card-header">
                  <h3 className="project-card-title">{goal.title}</h3>
                  <span className={`project-status status-${goal.status}`}>
                    {goal.status}
                  </span>
                </div>
                <p className="project-card-desc">
                  {goal.description || 'No description provided.'}
                </p>
                
                {/* Progress Bar */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${goal.progress}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #3b82f6)' }}></div>
                  </div>
                </div>

                <div className="project-card-footer" style={{ marginTop: '16px' }}>
                  <span className="project-tech">
                    {new Date(goal.createdAt).toLocaleDateString()}
                  </span>
                  <button className="conversation-delete" style={{ opacity: 1 }} onClick={(e) => handleDelete(e, goal._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Goal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Create New Goal</h2>
            <form onSubmit={handleCreate} className="auth-form">
              <div className="auth-field">
                <label>Goal Title</label>
                <input 
                  type="text" 
                  required 
                  autoFocus
                  placeholder="e.g. Learn Python"
                  value={newGoal.title} 
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})} 
                />
              </div>
              <div className="auth-field">
                <label>Description</label>
                <input 
                  type="text" 
                  value={newGoal.description} 
                  onChange={e => setNewGoal({...newGoal, description: e.target.value})} 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalsPage;


