import React, { useState } from 'react';
import HealthControls from './HealthControls';
import StatusControls from './StatusControls';

const InitiativeItem = ({ 
  participant, 
  isCurrentTurn, 
  onToggleInactive, 
  onSetDead, 
  onAdjustHealth, 
  onUpdateNotes 
}) => {
  const [showStats, setShowStats] = useState(false);

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const stats = ['grit', 'fight', 'flight', 'brains', 'brawn', 'charm'];

  return (
    <div 
      data-participant-id={participant.id} 
      className={`initiative-item ${isCurrentTurn ? 'current-turn' : ''} ${participant.status}`}
    >
      <div className="participant-header">
        <div className="participant-name-section">
          <span className="participant-name">{participant.name}</span>
          <div className="status-controls-wrapper">
            <div
              onClick={toggleStats}
              className={`stats-btn ${showStats ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleStats();
                }
              }}
            >
              Stats
            </div>
            <StatusControls
              participant={participant}
              onToggleInactive={onToggleInactive}
              onSetDead={onSetDead}
            />
          </div>
        </div>
        <HealthControls
          participant={participant}
          onAdjustHealth={onAdjustHealth}
        />
      </div>
      {showStats && participant.stats && (
        <div className="participant-stats">
          <div className="stats-grid">
            {stats.map(stat => (
              <div key={stat} className="stat-display">
                <span className="stat-label">{stat}</span>
                <span className="stat-value">{participant.stats[stat] || 10}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="participant-notes">
        <input
          type="text"
          placeholder="add note"
          value={participant.notes || ''}
          onChange={(e) => onUpdateNotes(participant.id, e.target.value)}
          className="notes-input"
        />
      </div>
    </div>
  );
};

export default InitiativeItem; 