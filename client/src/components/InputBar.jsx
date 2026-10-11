import { useState, useRef, useEffect } from 'react';

function InputBar({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const [isWakeWordMode, setIsWakeWordMode] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const textRef = useRef(text);
  const isLoadingRef = useRef(isLoading);
  const isWakeWordModeRef = useRef(isWakeWordMode);
  const onSendRef = useRef(onSend);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Keep refs in sync for the WebSocket callbacks
  useEffect(() => { textRef.current = text; }, [text]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { isWakeWordModeRef.current = isWakeWordMode; }, [isWakeWordMode]);
  useEffect(() => { onSendRef.current = onSend; }, [onSend]);

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (socketRef.current) {
      if (typeof socketRef.current.close === 'function') {
        socketRef.current.close();
      } else if (typeof socketRef.current.stop === 'function') {
        socketRef.current.stop();
      }
      socketRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startListening = async () => {
    try {
      if (socketRef.current) return; // Prevent double sockets!
      
      const apiKey = window.__deepgramFailed ? null : import.meta.env.VITE_DEEPGRAM_API_KEY;
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      // ---------------------------------------------------------
      // 1. Try Deepgram WebSocket FIRST (Much more reliable)
      // ---------------------------------------------------------
      if (apiKey) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: { 
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            } 
          });

          if (isLoadingRef.current || !isWakeWordModeRef.current) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }

          streamRef.current = stream;

          const socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true', ['token', apiKey]);

          socket.onopen = () => {
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorder.addEventListener('dataavailable', event => {
              if (event.data.size > 0 && socket.readyState === 1) {
                socket.send(event.data);
              }
            });
            mediaRecorder.start(250); 
            mediaRecorderRef.current = mediaRecorder;
          };

          socket.onmessage = (message) => {
            const received = JSON.parse(message.data);
            const transcript = received.channel?.alternatives[0]?.transcript;
            
            if (transcript && received.is_final) {
              setText(prev => (prev + ' ' + transcript).trim());
              
              if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = setTimeout(() => {
                const finalTextToSend = textRef.current.trim();
                if (finalTextToSend && !isLoadingRef.current) {
                  const wordCount = finalTextToSend.split(/\s+/).length;
                  const hasWakeWord = finalTextToSend.toLowerCase().includes('maya');

                  if (hasWakeWord || wordCount >= 4) {
                    onSendRef.current(finalTextToSend);
                    setText('');
                    if (textareaRef.current) textareaRef.current.style.height = 'auto';
                  }
                }
              }, 5000); // 5 sec silence for Deepgram
            }
          };

          socket.onerror = (error) => {
            console.error("Deepgram Error:", error);
            window.__deepgramFailed = true; // Mark as failed globally for this session
          };

          socket.onclose = () => {
            socketRef.current = null;
            if (isWakeWordModeRef.current && !isLoadingRef.current) {
              startListening();
            }
          };

          socketRef.current = socket;
          return; // Successfully started Deepgram
        } catch (dgErr) {
          console.error("Deepgram initialization failed, falling back to Native", dgErr);
        }
      }

      // ---------------------------------------------------------
      // 2. Native Speech Recognition (Fallback)
      // ---------------------------------------------------------
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          
          if (currentTranscript) {
            setText(prev => (prev + ' ' + currentTranscript).trim());
            
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              const finalTextToSend = textRef.current.trim();
              if (finalTextToSend && !isLoadingRef.current) {
                const wordCount = finalTextToSend.split(/\s+/).length;
                const hasWakeWord = finalTextToSend.toLowerCase().includes('maya');

                if (hasWakeWord || wordCount >= 4) {
                  onSendRef.current(finalTextToSend);
                  setText('');
                  if (textareaRef.current) textareaRef.current.style.height = 'auto';
                }
              }
            }, 3000); 
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
          if (event.error === 'network' || event.error === 'not-allowed') {
            setIsWakeWordMode(false);
            isWakeWordModeRef.current = false; // Stop the infinite loop!
            
            if (event.error === 'network') {
               alert("Microphone Error: Both Deepgram (API Key issue) and Chrome Native (Network/HTTPS issue) failed to connect. Please check your Deepgram API Key or use text input.");
            } else {
               alert("Microphone permission was denied.");
            }
          }
        };

        recognition.onend = () => {
          socketRef.current = null;
          if (isWakeWordModeRef.current && !isLoadingRef.current) {
            setTimeout(startListening, 300);
          }
        };

        recognition.start();
        socketRef.current = recognition;
        return;
      }
    } catch (err) {
      console.error("Microphone access denied:", err);
      setIsWakeWordMode(false);
      isWakeWordModeRef.current = false;
      alert("Microphone access blocked. Please allow microphone permissions in your browser address bar.");
    }
  };

  // Toggle Deepgram on/off when the button is clicked
  useEffect(() => {
    if (isWakeWordMode) {
      startListening();
    } else {
      stopListening();
    }
    
    return () => {
      stopListening();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [isWakeWordMode]);

  const toggleListen = () => {
    setIsWakeWordMode(prev => {
      const next = !prev;
      isWakeWordModeRef.current = next; // Synchronous update to prevent race conditions!
      return next;
    });
  };

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      onSend(text.trim());
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Temporarily pause listening while Maya is thinking/replying so she doesn't hear her own echo
  useEffect(() => {
    let timer;
    if (isLoading) {
      stopListening();
    } else if (isWakeWordMode && !isLoading) {
      // Delay restarting the mic by 750ms after she finishes speaking!
      // This guarantees Chrome has fully released the TTS audio context and won't throw an 'audio-capture' error.
      timer = setTimeout(() => {
        startListening();
      }, 750);
    }
    return () => clearTimeout(timer);
  }, [isLoading, isWakeWordMode]);

  const handleInput = (e) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="input-area">
      <p className="input-hint">
        {isWakeWordMode ? "Hands-Free: Auto-sends if you say 'Maya' OR speak 4+ words." : "Press Enter to send · Shift + Enter for new line"}
      </p>
      <div className="input-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* Wake Word Microphone Button */}
        <button 
          onClick={toggleListen}
          title={isWakeWordMode ? "Stop hands-free mode" : "Turn on Hands-Free Auto-Send"}
          style={{
            background: isWakeWordMode ? 'rgba(16, 185, 129, 1)' : 'var(--bg-tertiary)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
            boxShadow: isWakeWordMode ? '0 0 15px rgba(16, 185, 129, 0.6)' : 'none',
            animation: isWakeWordMode ? 'pulse 2s infinite' : 'none'
          }}
        >
          {isWakeWordMode ? '👂' : '🎙️'}
        </button>

        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <textarea
            ref={textareaRef}
            id="maya-input"
            className="input-textarea"
            placeholder={isWakeWordMode ? "Listening... (Will auto-send full sentences)" : "Message MAYA..."}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <button
            id="maya-send-btn"
            className="send-button"
            onClick={handleSend}
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputBar;
