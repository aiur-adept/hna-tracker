import React from 'react';

const EncounterControls = ({ onAddParticipant, onReset }) => (
  <div className="encounter-footer">
    <div 
      onClick={onAddParticipant}
      className="add-participant-btn"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onAddParticipant();
        }
      }}
    >
      Add Participant
    </div>
    <div 
      onClick={() => {
        if (window.confirm('Are you sure you want to start a new encounter? This will reset all current participants and initiative order.')) {
          onReset();
        }
      }} 
      className="reset-btn"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (window.confirm('Are you sure you want to start a new encounter? This will reset all current participants and initiative order.')) {
            onReset();
          }
        }
      }}
    >
      New Encounter
    </div>
  </div>
);

export default EncounterControls; 