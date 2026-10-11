/**
 * StatusIndicator — Animated "MAYA is thinking..." indicator
 */
function StatusIndicator() {
  return (
    <div className="message-row maya">
      <div className="message-avatar maya-avatar">M</div>
      <div className="status-indicator">
        <div className="status-dots">
          <div className="status-dot" />
          <div className="status-dot" />
          <div className="status-dot" />
        </div>
        <span>MAYA is thinking...</span>
      </div>
    </div>
  );
}

export default StatusIndicator;
