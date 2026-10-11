import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

function Sidebar({ user, onOpenProfile }) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { icon: '🏠', label: 'Home',     path: '/home' }, // We'll map this to the dashboard view
    { icon: '💬', label: 'Chat',     path: '/' },
    { icon: '✅', label: 'Tasks',    path: '/tasks' },
    { icon: '📁', label: 'Projects', path: '/projects' },
    { icon: '📄', label: 'Files',    path: '/memory' }, // existing memory page repurposed
    { icon: '🔗', label: 'Apps',     path: '/learning' }, // existing learning page repurposed
    { icon: '⚡', label: 'Activity', path: '/schedule' }, // existing schedule page repurposed
  ];

  return (
    <aside className="os-sidebar">
      {/* Brand / Logo */}
      <div className="os-sidebar-brand" onClick={() => navigate('/')}>
        <div className="os-logo-icon">M</div>
        <div className="os-logo-text">
          <span className="os-logo-title">MyAI</span>
          <span className="os-logo-subtitle">Personal Assistant</span>
        </div>
        <div className="os-sidebar-collapse">◂</div>
      </div>

      {/* Navigation */}
      <nav className="os-nav">
        {NAV_ITEMS.map((item) => {
          // Highlight if current path matches or if it's the root chat path
          const isActive = location.pathname === item.path || (item.path === '/home' && location.pathname === '/home');
          return (
            <div 
              key={item.label} 
              className={`os-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="os-nav-icon">{item.icon}</span>
              <span className="os-nav-label">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Bottom Profile Area */}
      <div className="os-sidebar-bottom">
        <div className="os-nav-item" onClick={onOpenProfile} style={{ marginBottom: '8px' }}>
          <span className="os-nav-icon">⚙️</span>
          <span className="os-nav-label">Settings</span>
        </div>
        
        <div className="os-user-card">
          <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=7c3aed&color=fff`} alt="user" className="os-user-avatar" />
          <div className="os-user-info">
            <span className="os-user-name">{user?.name || 'Prayash Singh'}</span>
            <span className="os-user-status"><span className="os-status-dot"></span> Online</span>
          </div>
          <button className="os-logout-btn" onClick={logout} title="Sign Out">🚪</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
