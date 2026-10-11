import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', status: 'planning', priority: 'medium' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data.projects);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/projects', newProject);
      setProjects([res.data.project, ...projects]);
      setShowModal(false);
      setNewProject({ name: '', description: '', status: 'planning', priority: 'medium' });
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  return (
    <div className="os-page-container">
      <div className="workspace-page">
        <header className="workspace-header">
          <div>
            <h1 className="workspace-title">Projects</h1>
            <p className="workspace-subtitle">Manage your personal and coding projects</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
        </header>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>No projects found. Create your first one!</div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project._id} className="project-card">
                <div className="project-card-header">
                  <h3 className="project-card-title">{project.name}</h3>
                  <span className={`project-status status-${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-card-desc">
                  {project.description || 'No description provided.'}
                </p>
                <div className="project-card-footer">
                  <span className="project-tech">
                    {project.technologies?.length > 0 ? project.technologies.join(', ') : 'No stack'}
                  </span>
                  <button className="conversation-delete" style={{ opacity: 1 }} onClick={(e) => handleDelete(e, project._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Create New Project</h2>
            <form onSubmit={handleCreate} className="auth-form">
              <div className="auth-field">
                <label>Project Name</label>
                <input 
                  type="text" 
                  required 
                  autoFocus
                  value={newProject.name} 
                  onChange={e => setNewProject({...newProject, name: e.target.value})} 
                />
              </div>
              <div className="auth-field">
                <label>Description</label>
                <input 
                  type="text" 
                  value={newProject.description} 
                  onChange={e => setNewProject({...newProject, description: e.target.value})} 
                />
              </div>
              <div className="auth-field">
                <label>Status</label>
                <select 
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                  value={newProject.status}
                  onChange={e => setNewProject({...newProject, status: e.target.value})}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;

