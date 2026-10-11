import React from 'react';

function VoiceOrb({ isSpeaking, isListening, textContent, onSend }) {
  
  // This is the main centerpiece.
  // It features a glowing orb and sine-wave particles using CSS.
  
  return (
    <div className="scifi-center">
      <div className="orb-wrapper">
        <div className={`scifi-orb ${isSpeaking ? 'speaking' : ''} ${isListening ? 'listening' : ''}`}>
          {/* Inner rings and glowing trails */}
          <div className="orb-core"></div>
          <div className="orb-ring ring-1"></div>
          <div className="orb-ring ring-2"></div>
          
          {/* Simulated Waveform / Particles */}
          <div className="waveform-container">
             {/* We'll use CSS to draw some sine wave lines here */}
             <div className="wave-line"></div>
             <div className="wave-line offset"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceOrb;
