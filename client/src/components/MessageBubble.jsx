import ReactMarkdown from 'react-markdown';

/**
 * MessageBubble — Renders a single chat message
 * @param {{ message: object }} props
 */
function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={`message-row ${isUser ? 'user' : 'maya'}`}>
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? 'user-avatar' : 'maya-avatar'}`}>
        {isUser ? '👤' : 'M'}
      </div>

      {/* Content */}
      <div className="message-content">
        <span className="message-sender">
          {isUser ? 'You' : 'MAYA'}
        </span>

        <div className={`message-bubble ${isUser ? 'user-bubble' : 'maya-bubble'}`}>
          {isUser ? (
            // User messages: plain text
            <span>{message.content}</span>
          ) : (
            // MAYA messages: render markdown
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>

        <span className="message-time">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
