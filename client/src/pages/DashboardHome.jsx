import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes, convRes] = await Promise.all([
          axios.get('/api/tasks').catch(() => ({ data: { tasks: [] } })),
          axios.get('/api/projects').catch(() => ({ data: { projects: [] } })),
          axios.get('/api/conversations').catch(() => ({ data: { conversations: [] } }))
        ]);
        setTasks(tasksRes.data.tasks || []);
        setProjects(projectsRes.data.projects || []);
        setConversations(convRes.data.conversations || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeProjects = projects.filter(p => p.status !== 'completed').length;

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }
    
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      if (currentTranscript) {
        setInputValue(prev => (prev + ' ' + currentTranscript).trim());
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech error", event.error);
      if (event.error === 'network') {
        alert("Microphone error: Chrome requires HTTPS for speech recognition, or your connection to Google's speech servers failed. Please use the text input instead.");
      } else if (event.error === 'not-allowed') {
        alert("Microphone permission was denied. Please allow access in your browser settings.");
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleAsk = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (recognitionRef.current && isListening) recognitionRef.current.stop();
    // Redirect to chat
    navigate('/', { state: { initialMessage: inputValue } });
  };

  return (
    <div className="os-page-container" style={{ padding: '40px', overflowY: 'auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>
          Good evening, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--scifi-text-muted)', fontSize: '16px' }}>
          Your AI assistant is here to help you get things done.
        </p>
      </header>

      {/* Main AI Input */}
      <div style={{ marginBottom: '40px', maxWidth: '800px' }}>
        <form onSubmit={handleAsk} style={{ position: 'relative' }}>
          <span 
            onClick={startListening}
            style={{ 
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', 
              fontSize: '20px', cursor: 'pointer', zIndex: 10,
              background: isListening ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              padding: '8px', borderRadius: '50%',
              animation: isListening ? 'pulse 2s infinite' : 'none'
            }}
            title="Dictate message"
          >
            {isListening ? '👂' : '🎙️'}
          </span>
          <input 
            type="text" 
            placeholder={isListening ? "Listening..." : "Ask me anything... (Type / for shortcuts)"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              width: '100%',
              padding: '20px 20px 20px 60px',
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              boxShadow: '0 8px 32px rgba(124, 58, 237, 0.1)',
              transition: 'all 0.3s'
            }}
          />
          <button 
            type="submit"
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              border: 'none', borderRadius: '50%', width: '40px', height: '40px',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            ➤
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left Column */}
        <div style={{ flex: 2, minWidth: '400px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: 'var(--scifi-text-muted)' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            <div className="quick-action-card" onClick={() => navigate('/tasks')} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid var(--scifi-border)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>✅</div>
              <div style={{ fontWeight: '500' }}>Create Task</div>
              <div style={{ fontSize: '12px', color: 'var(--scifi-text-muted)' }}>Add a new task</div>
            </div>
            <div className="quick-action-card" onClick={() => navigate('/projects')} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid var(--scifi-border)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📁</div>
              <div style={{ fontWeight: '500' }}>New Project</div>
              <div style={{ fontSize: '12px', color: 'var(--scifi-text-muted)' }}>Start planning</div>
            </div>
            <div className="quick-action-card" onClick={() => navigate('/')} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid var(--scifi-border)' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontWeight: '500' }}>Chat AI</div>
              <div style={{ fontSize: '12px', color: 'var(--scifi-text-muted)' }}>Ask a question</div>
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: 'var(--scifi-text-muted)' }}>Today's Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--scifi-border)' }}>
              <div style={{ fontSize: '14px', color: 'var(--scifi-text-muted)', marginBottom: '8px' }}>Tasks Completed</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{completedTasks} <span style={{fontSize: '14px', color: 'var(--scifi-text-muted)'}}>/ {tasks.length}</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--scifi-border)' }}>
              <div style={{ fontSize: '14px', color: 'var(--scifi-text-muted)', marginBottom: '8px' }}>Active Projects</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{activeProjects}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--scifi-border)' }}>
              <div style={{ fontSize: '14px', color: 'var(--scifi-text-muted)', marginBottom: '8px' }}>AI Conversations</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{conversations.length}</div>
            </div>
          </div>
        </div>

        {/* Right Column (Agent Status) */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: 'var(--scifi-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            AI Agent Status
            <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="os-status-dot"></span> Online</span>
          </h2>
          <div style={{ background: 'linear-gradient(180deg, rgba(27,30,50,0.8) 0%, rgba(13,15,26,0.8) 100%)', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '24px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 0 40px rgba(0,240,255,0.05)' }}>
            
            {/* Glowing Orb Animation */}
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #00f0ff, #7c3aed)',
              boxShadow: '0 0 60px rgba(124,58,237,0.5), inset 0 0 20px rgba(255,255,255,0.5)',
              marginBottom: '30px', position: 'relative',
              animation: 'pulse 3s infinite alternate'
            }}>
              {/* Inner core */}
              <div style={{
                position: 'absolute', top: '20%', left: '20%', right: '20%', bottom: '20%',
                background: '#fff', borderRadius: '50%', filter: 'blur(8px)', opacity: 0.8
              }}></div>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Ready</h3>
            <p style={{ color: 'var(--scifi-text-muted)', fontSize: '14px', textAlign: 'center' }}>
              Monitoring workspace.<br/>Standing by for your commands.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardHome;
