import React from 'react';

const renderHealthDots = (health) => {
  const dots = [];
  for (let i = 0; i < 9; i++) {
    dots.push(
      <div 
        key={i} 
        className={`health-dot ${i < health ? 'filled' : 'empty'}`}
      />
    );
  }
  return dots;
};

const HealthControls = ({ participant, onAdjustHealth }) => (
  <div className="health-controls">
    <div
      onClick={() => onAdjustHealth(participant.id, -1)}
      className="health-btn minus-btn"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onAdjustHealth(participant.id, -1);
        }
      }}
    >
      −
    </div>
    <div className="health-dots">
      {renderHealthDots(participant.health)}
    </div>
    <div
      onClick={() => onAdjustHealth(participant.id, 1)}
      className="health-btn plus-btn"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onAdjustHealth(participant.id, 1);
        }
      }}
    >
      +
    </div>
  </div>
);

export default HealthControls; 