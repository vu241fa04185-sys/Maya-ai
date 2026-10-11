import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import StatusIndicator from './StatusIndicator';

const WELCOME_CHIPS = [
  '👋 Hello MAYA, introduce yourself',
  '📋 What can you help me with?',
  '🗂️ Help me plan my day',
  '💻 I want to start a new project',
  '📚 Create a study plan for me',
  '⏰ What should I focus on right now?',
];

/**
 * ChatWindow — Scrollable message list with welcome screen
 */
function ChatWindow({ messages, isLoading, onChipClick }) {
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0;

  return (
    <div className="chat-window">
      {showWelcome ? (
        /* ── Welcome Screen ── */
        <div className="chat-welcome">
          <div className="chat-welcome-logo">MAYA</div>
          <p className="chat-welcome-subtitle">
            Your Personal AI Life, Learning & Project Assistant.
            <br />
            Ask me anything — I'm here to help you stay organized,
            focused, and productive.
          </p>
          <div className="chat-welcome-chips">
            {WELCOME_CHIPS.map((chip) => (
              <button
                key={chip}
                className="chat-welcome-chip"
                onClick={() => onChipClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Messages ── */
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <StatusIndicator />}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}

export default ChatWindow;
