import React from 'react';

const StatusControls = ({ participant, onToggleInactive, onSetDead }) => {
  if (participant.status === 'dead') {
    return (
      <div
        onClick={() => onSetDead(participant.id)}
        className="resurrect-btn"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSetDead(participant.id);
          }
        }}
      >
        Resurrect
      </div>
    );
  }
  if (participant.status === 'inactive') {
    return (
      <div
        onClick={() => onToggleInactive(participant.id)}
        className="activate-btn"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleInactive(participant.id);
          }
        }}
      >
        Activate
      </div>
    );
  }
  return (
    <>
      <div
        onClick={() => onToggleInactive(participant.id)}
        className="deactivate-btn"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleInactive(participant.id);
          }
        }}
      >
        Deactivate
      </div>
      <div
        onClick={() => onSetDead(participant.id)}
        className="died-btn"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSetDead(participant.id);
          }
        }}
      >
        Die
      </div>
    </>
  );
};

export default StatusControls; 