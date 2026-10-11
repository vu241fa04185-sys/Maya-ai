import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DashboardLeft({ onLoadConversation }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('/api/conversations');
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };
    fetchConversations();
  }, []);

  // Taking the most recent 8 conversations for the grid
  const recentChats = conversations.slice(0, 8);

  return (
    <div className="scifi-panel scifi-left">
      <h2 className="scifi-header">Previous Search History</h2>
      
      <div className="scifi-grid">
        {recentChats.map((conv, index) => {
          // Generate a pseudo-random progress percentage based on ID for cool visual
          const percent = Math.floor(Math.random() * 40) + 40; 
          return (
            <div 
              key={conv._id} 
              className="scifi-card"
              onClick={() => onLoadConversation(conv._id)}
            >
              <div className="scifi-card-title">{conv.title.length > 20 ? conv.title.substring(0,20)+'...' : conv.title}</div>
              <div className="scifi-progress-container">
                <span className="scifi-progress-text">{percent}%</span>
                <div className="scifi-progress-track">
                  <div className="scifi-progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="scifi-scroll-indicator">
        ↓
      </div>
    </div>
  );
}

export default DashboardLeft;
