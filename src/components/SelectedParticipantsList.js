import React from 'react';

const SelectedParticipantsList = ({ selectedParticipants, onRemoveParticipant }) => {
  return (
    <div className="selected-participants">
      <h4>Selected Participants ({selectedParticipants.length})</h4>
      {selectedParticipants.length === 0 ? (
        <p className="no-participants">No participants selected</p>
      ) : (
        <div className="participants-list">
          {selectedParticipants.map(participant => (
            <div key={participant.id} className="participant-item">
              <span>{participant.name}</span>
              <div
                onClick={() => onRemoveParticipant(participant.id)}
                className="remove-participant-btn"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onRemoveParticipant(participant.id);
                  }
                }}
              >
                ×
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedParticipantsList; 