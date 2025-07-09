import React from 'react';

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
    <div className="health-display">
      {participant.health} HP
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