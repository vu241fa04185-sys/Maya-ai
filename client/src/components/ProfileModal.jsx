import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* Sidebar / Tabs */}
        <div className="profile-modal-sidebar">
          <div className="profile-modal-header">
            <div className="profile-modal-avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
            <div className="profile-modal-name">{user?.name}</div>
          </div>
          
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              👤 Account Details
            </button>
            <button 
              className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 My Stats
            </button>
            <button 
              className={`profile-tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              ⚙️ Preferences
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="profile-modal-body">
          <button className="profile-modal-close" onClick={onClose}>✕</button>
          
          {activeTab === 'account' && (
            <div className="profile-tab-content fade-in">
              <h3>Account Details</h3>
              <p className="profile-subtitle">Manage your personal information</p>
              
              <div className="profile-field">
                <label>Full Name</label>
                <input type="text" defaultValue={user?.name} className="profile-input" />
              </div>
              
              <div className="profile-field">
                <label>Email Address</label>
                <input type="email" defaultValue={user?.email} className="profile-input" disabled />
                <span className="profile-help-text">Email address cannot be changed.</span>
              </div>
              
              <button className="btn-primary" style={{ marginTop: '16px' }}>Save Changes</button>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="profile-tab-content fade-in">
              <h3>My Stats</h3>
              <p className="profile-subtitle">Your productivity and AI interaction overview</p>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Total Chats</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">4</div>
                  <div className="stat-label">Active Projects</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">28</div>
                  <div className="stat-label">Tasks Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">156</div>
                  <div className="stat-label">Memory Nodes</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="profile-tab-content fade-in">
              <h3>Preferences</h3>
              <p className="profile-subtitle">Customize your Maya experience</p>
              
              <div className="preference-item">
                <div>
                  <h4>Voice Output Auto-Play</h4>
                  <p>Automatically speak Maya's responses aloud.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked={false} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <h4>Dark Theme Focus Mode</h4>
                  <p>Dim the background heavily when typing.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked={true} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
