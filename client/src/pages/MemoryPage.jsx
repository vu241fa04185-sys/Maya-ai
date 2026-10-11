import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function MemoryPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await axios.get('/api/memories');
      setMemories(res.data.memories);
    } catch (err) {
      console.error('Failed to fetch memories', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    try {
      await axios.delete(`/api/memories/${id}`);
      setMemories(memories.filter(m => m._id !== id));
    } catch (err) {
      console.error('Failed to delete memory', err);
    }
  };

  return (
    <div className="os-page-container">
      <div className="workspace-page">
        <header className="workspace-header">
          <div>
            <h1 className="workspace-title">Files & Knowledge</h1>
            <p className="workspace-subtitle">Your personal files, notes, and knowledge base.</p>
          </div>
        </header>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading memories...</div>
        ) : memories.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>MAYA hasn't saved any memories about you yet. Try telling her something about yourself in the chat!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {memories.map(memory => (
              <div key={memory._id} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ 
                    fontSize: '11px', 
                    background: 'rgba(124,58,237,0.2)', 
                    color: '#a78bfa',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: '8px',
                    display: 'inline-block'
                  }}>
                    {memory.type || 'Fact'}
                  </span>
                  <div style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
                    {memory.content}
                  </div>
                </div>
                <button 
                  className="conversation-delete" 
                  style={{ opacity: 1, padding: '8px' }} 
                  onClick={() => handleDelete(memory._id)}
                  title="Forget this"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryPage;




