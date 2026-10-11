import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get('/api/schedule');
      setSchedule(res.data.schedule);
    } catch (err) {
      console.error('Failed to fetch schedule', err);
    } finally {
      setLoading(false);
    }
  };

  // Group by "Overdue", "Today", "Upcoming"
  const groupSchedule = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const overdue = [];
    const dueToday = [];
    const upcoming = [];

    schedule.forEach(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate < today) overdue.push(item);
      else if (itemDate.getTime() === today.getTime()) dueToday.push(item);
      else upcoming.push(item);
    });

    return { overdue, dueToday, upcoming };
  };

  const { overdue, dueToday, upcoming } = groupSchedule();

  const renderSection = (title, items, color) => {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', color: color, marginBottom: '16px', borderBottom: `1px solid ${color}33`, paddingBottom: '8px' }}>
          {title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: `4px solid ${color}`
            }}>
              <div>
                <span style={{ 
                  fontSize: '11px', 
                  background: item.type === 'goal' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.15)', 
                  color: item.type === 'goal' ? '#a78bfa' : '#60a5fa',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'inline-block'
                }}>
                  {item.type}
                </span>
                <div style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }}>
                  {item.title}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(item.date).toLocaleDateString()}
                </div>
                {item.type === 'task' && (
                  <div style={{ fontSize: '11px', marginTop: '4px', color: item.priority === 'high' ? '#f87171' : 'var(--text-secondary)' }}>
                    {item.priority.toUpperCase()} PRIORITY
                  </div>
                )}
                {item.type === 'goal' && (
                  <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                    {item.progress}% DONE
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="os-page-container">
      <div className="workspace-page">
        <header className="workspace-header">
          <div>
            <h1 className="workspace-title">Activity & Agent Logs</h1>
            <p className="workspace-subtitle">Your upcoming deadlines for tasks and goals</p>
          </div>
        </header>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading schedule...</div>
        ) : schedule.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>
            Your schedule is totally clear! Set some deadlines on your tasks and goals to see them here.
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
            {renderSection('Overdue', overdue, '#f87171')}
            {renderSection('Today', dueToday, '#34d399')}
            {renderSection('Upcoming', upcoming, '#60a5fa')}
          </div>
        )}
      </div>
    </div>
  );
}

export default SchedulePage;




