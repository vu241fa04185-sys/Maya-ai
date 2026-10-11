import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function LearningPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', description: '', mastery: 0 });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get('/api/topics');
      setTopics(res.data.topics);
    } catch (err) {
      console.error('Failed to fetch topics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/topics', newTopic);
      setTopics([res.data.topic, ...topics]);
      setShowModal(false);
      setNewTopic({ title: '', description: '', mastery: 0 });
    } catch (err) {
      console.error('Failed to create topic', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this topic?')) return;
    try {
      await axios.delete(`/api/topics/${id}`);
      setTopics(topics.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete topic', err);
    }
  };

  return (
    <div className="os-page-container">
      <div className="workspace-page">
        <header className="workspace-header">
          <div>
            <h1 className="workspace-title">Apps / Integrations</h1>
            <p className="workspace-subtitle">Your favorite tools, all in one place.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Topic</button>
        </header>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading topics...</div>
        ) : topics.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>You aren't learning anything yet! Tell MAYA what you want to study.</div>
        ) : (
          <div className="projects-grid">
            {topics.map(topic => (
              <div key={topic._id} className="project-card">
                <div className="project-card-header">
                  <h3 className="project-card-title">{topic.title}</h3>
                </div>
                <p className="project-card-desc">
                  {topic.description || 'No description provided.'}
                </p>
                
                {/* Mastery Progress Bar */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>Mastery Level</span>
                    <span>{topic.mastery}%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${topic.mastery}%`, 
                      height: '100%', 
                      background: topic.mastery > 80 ? '#34d399' : (topic.mastery > 40 ? '#fbbf24' : '#f87171') 
                    }}></div>
                  </div>
                </div>

                <div className="project-card-footer" style={{ marginTop: '16px' }}>
                  <span className="project-tech">
                    Last updated: {new Date(topic.updatedAt).toLocaleDateString()}
                  </span>
                  <button className="conversation-delete" style={{ opacity: 1 }} onClick={(e) => handleDelete(e, topic._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Topic Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Add Learning Topic</h2>
            <form onSubmit={handleCreate} className="auth-form">
              <div className="auth-field">
                <label>Topic Title</label>
                <input 
                  type="text" 
                  required 
                  autoFocus
                  placeholder="e.g. Spanish Verbs, React Hooks"
                  value={newTopic.title} 
                  onChange={e => setNewTopic({...newTopic, title: e.target.value})} 
                />
              </div>
              <div className="auth-field">
                <label>Description</label>
                <input 
                  type="text" 
                  value={newTopic.description} 
                  onChange={e => setNewTopic({...newTopic, description: e.target.value})} 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningPage;




