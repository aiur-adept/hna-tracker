import React from 'react';

const CustomParticipantForm = ({ 
  customName, 
  customCount,
  customNotes,
  customHealth,
  customStats,
  onCustomNameChange, 
  onCustomCountChange,
  onCustomNotesChange,
  onCustomHealthChange,
  onCustomStatsChange,
  onAddCustomParticipant 
}) => {
  const stats = ['grit', 'fight', 'flight', 'brains', 'brawn', 'charm'];

  return (
    <div className="custom-participant">
      <div className="custom-inputs">
        <input
          type="text"
          placeholder="Name (e.g., 'goblin')"
          value={customName}
          onChange={(e) => onCustomNameChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddCustomParticipant()}
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={customNotes}
          onChange={(e) => onCustomNotesChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddCustomParticipant()}
        />
        <input
          type="number"
          placeholder="Health"
          value={customHealth}
          onChange={(e) => onCustomHealthChange(e.target.value === '' ? '' : parseInt(e.target.value) || 9)}
          onKeyPress={(e) => e.key === 'Enter' && onAddCustomParticipant()}
          className="health-input"
        />
        Count:
        <div className="count-controls">
          <div
            onClick={() => onCustomCountChange(prev => Math.max(1, prev - 1))}
            className="count-btn minus-btn"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCustomCountChange(prev => Math.max(1, prev - 1));
              }
            }}
          >
            −
          </div>
          <input
            type="number"
            value={customCount}
            onChange={(e) => onCustomCountChange(parseInt(e.target.value) || 1)}
          />
          <div
            onClick={() => onCustomCountChange(prev => prev + 1)}
            className="count-btn plus-btn"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCustomCountChange(prev => prev + 1);
              }
            }}
          >
            +
          </div>
        </div>
      </div>
      <div className="stats-section">
        <h5>Stats</h5>
        <div className="stats-grid">
          {stats.map(stat => (
            <div key={stat} className="stat-control">
              <label>{stat}</label>
              <input
                type="number"
                value={customStats[stat] || ''}
                onChange={(e) => onCustomStatsChange({
                  ...customStats,
                  [stat]: e.target.value === '' ? '' : parseInt(e.target.value) || 9
                })}
                className="stat-input"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="modal-add-section">
        <div 
          onClick={onAddCustomParticipant} 
          className="add-custom-btn"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onAddCustomParticipant();
            }
          }}
        >
          Add Participant
        </div>
      </div>
    </div>
  );
};

export default CustomParticipantForm; 