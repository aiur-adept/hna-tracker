import React from 'react';
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
  return (
    <div 
      data-participant-id={participant.id} 
      className={`initiative-item ${isCurrentTurn ? 'current-turn' : ''} ${participant.status}`}
    >
      <div className="participant-header">
        <div className="participant-name-section">
          <span className="participant-name">{participant.name}</span>
          <StatusControls
            participant={participant}
            onToggleInactive={onToggleInactive}
            onSetDead={onSetDead}
          />
        </div>
        <HealthControls
          participant={participant}
          onAdjustHealth={onAdjustHealth}
        />
      </div>
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