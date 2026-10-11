import React from 'react';

function DashboardRight() {
  return (
    <div className="scifi-panel scifi-right">
      
      {/* Top Widget */}
      <div className="scifi-widget">
        <h2 className="scifi-header">Searched By Command</h2>
        <div className="scifi-meta">
          <div className="meta-label">Title:</div>
          <div className="meta-value">MAYA Core Engine</div>
          
          <div className="meta-label">Category:</div>
          <div className="meta-value">Personal Assistant</div>
          
          <div className="meta-row">
            <div>
              <div className="meta-label">Search Results:</div>
              <div className="meta-link">View All</div>
            </div>
            <div>
              <div className="meta-value" style={{ color: 'var(--scifi-cyan)' }}>92,976</div>
              <div className="meta-link">View Top Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Widget (Videos) */}
      <div className="scifi-widget">
        <h2 className="scifi-header">Videos</h2>
        <div className="scifi-video-card">
          <div className="video-thumb">▶</div>
          <div className="video-info">
            <div className="video-title">MAYA Integration Review</div>
            <div className="video-platform">YOUTUBE</div>
          </div>
          <div className="video-play">🔊</div>
        </div>
        <div className="scifi-video-card">
          <div className="video-thumb">▶</div>
          <div className="video-info">
            <div className="video-title">System Unboxing</div>
            <div className="video-platform">YOUTUBE</div>
          </div>
          <div className="video-play">🔊</div>
        </div>
        <div className="meta-link" style={{ textAlign: 'center', marginTop: '8px' }}>View All</div>
      </div>

      {/* Bottom Widget */}
      <div className="scifi-widget">
        <h2 className="scifi-header">Active Node Map</h2>
        <div className="scifi-map-placeholder">
          <div className="map-overlay-text">MAYA SYSTEM ONLINE</div>
        </div>
      </div>

    </div>
  );
}

export default DashboardRight;
