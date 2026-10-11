import { useCallback, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import GoalsPage from './pages/GoalsPage';
import MemoryPage from './pages/MemoryPage';
import SchedulePage from './pages/SchedulePage';
import LearningPage from './pages/LearningPage';
import { useChat } from './hooks/useChat';
import './index.css';
import './scifi.css';

import DashboardLeft from './components/DashboardLeft';
import DashboardRight from './components/DashboardRight';
import VoiceOrb from './components/VoiceOrb';
import ProfileModal from './components/ProfileModal';

import { useLocation, useNavigate } from 'react-router-dom';

// ─── Main Chat UI (requires login) ───────────────────────────────────────────
function ChatApp() {
  const { user, logout } = useAuth();
  const { messages, isLoading, conversationId, sendMessage, loadConversation, clearChat } = useChat();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.initialMessage) {
      const msg = location.state.initialMessage;
      // Clear the state so it doesn't trigger again on reload
      navigate('/', { replace: true, state: {} });
      // Small timeout ensures the UI has mounted before sending
      setTimeout(() => sendMessage(msg), 100);
    }
  }, [location.state, navigate, sendMessage]);

  const [voiceMode, setVoiceMode] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Ensure voices are loaded (browsers load them asynchronously)
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        
        // Pick a default female voice to start with
        if (!selectedVoiceURI) {
          const defaultVoice = voices.find(v => 
            v.name.includes('Zira') || 
            v.name.includes('Google US English') ||
            v.name.includes('Samantha') ||
            v.name.toLowerCase().includes('female')
          );
          if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoiceURI]);

  // State to track the last spoken message to prevent infinite loops or double-speaking
  const [lastSpokenMsgId, setLastSpokenMsgId] = useState(null);

  // Text-to-Speech logic
  useEffect(() => {
    if (voiceMode && messages.length > 0 && !isLoading) {
      const lastMsg = messages[messages.length - 1];
      
      // Ensure it's the assistant, and we haven't spoken this exact message yet
      const msgIdentifier = lastMsg.id || lastMsg.content;
      
      if (lastMsg.role === 'assistant' && lastSpokenMsgId !== msgIdentifier) {
        setLastSpokenMsgId(msgIdentifier); // Mark as spoken
        
        const cleanText = lastMsg.content.replace(/[#*`_]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Find the specific voice the user selected in the dropdown
        if (selectedVoiceURI) {
          const voice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
          if (voice) utterance.voice = voice;
        }

        // Mute the microphone IMMEDIATELY before starting the speech
        setIsSpeaking(true);
        
        // When she finishes speaking, wait 500ms for the room to go quiet before unmuting
        utterance.onend = () => setTimeout(() => setIsSpeaking(false), 500);
        utterance.onerror = () => setIsSpeaking(false);
        
        // Give React a 300ms head-start to physically shut down the microphone 
        // before we actually allow the speakers to start playing the voice
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 300);
      }
    }
  }, [messages, isLoading, voiceMode, availableVoices, selectedVoiceURI, lastSpokenMsgId]);

  const handleChipClick = useCallback((chipText) => {
    const cleanText = chipText.replace(/^[\p{Emoji}\s]+/u, '').trim();
    sendMessage(cleanText);
  }, [sendMessage]);

  return (
    <div className="os-page-container">
      {/* Chat Specific Topbar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid var(--scifi-border)' }}>
        <div style={{ fontSize: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
          AI Chat
          <span style={{ fontSize: '12px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            ● Online
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Voice Mode Toggle */}
          <button 
            onClick={() => {
              if (voiceMode) window.speechSynthesis.cancel();
              setVoiceMode(!voiceMode);
            }}
            style={{
              background: voiceMode ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
              color: voiceMode ? 'var(--scifi-cyan)' : 'var(--scifi-text-muted)',
              border: `1px solid ${voiceMode ? 'var(--scifi-cyan)' : 'var(--scifi-border)'}`,
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Toggle Voice Output"
          >
            {voiceMode ? '🔊 Voice ON' : '🔇 Voice OFF'}
          </button>

          {/* Voice Selector Dropdown (Only show if voice is ON and voices are loaded) */}
          {voiceMode && availableVoices.length > 0 && (
            <select 
              value={selectedVoiceURI} 
              onChange={(e) => setSelectedVoiceURI(e.target.value)}
              style={{
                background: 'var(--scifi-panel)',
                color: 'var(--scifi-text-main)',
                border: '1px solid var(--scifi-border)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                maxWidth: '200px',
                outline: 'none'
              }}
            >
              {availableVoices.map(voice => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <main className="scifi-main">
        {/* Left Column (History) */}
        <DashboardLeft 
          onLoadConversation={loadConversation} 
        />

        {/* Center Column (Orb + Chat) */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
          
          <div style={{ flexShrink: 0 }}>
            <VoiceOrb 
              isSpeaking={isSpeaking} 
              isListening={isLoading} 
            />
          </div>
          
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: '10px', borderRadius: '16px', background: 'var(--scifi-panel)', border: '1px solid var(--scifi-border)' }}>
            <ChatWindow messages={messages} isLoading={isLoading} onChipClick={handleChipClick} />
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <DashboardRight />
      </main>

      {/* Global Bottom Dock for Input */}
      <div style={{ padding: '0 40px 20px 40px', flexShrink: 0 }}>
        <InputBar onSend={sendMessage} isLoading={isLoading || isSpeaking} />
      </div>
    </div>
  );
}

// ─── Protected Route ──────────────────────────────────────────────────────────
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-logo">MAYA</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading your assistant...</p>
      </div>
    );
  }

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

import DashboardHome from './pages/DashboardHome';

// ─── Root App with Router ─────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<ProtectedRoute><ChatApp /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
          <Route path="/memory" element={<ProtectedRoute><MemoryPage /></ProtectedRoute>} />
          <Route path="/learning" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
