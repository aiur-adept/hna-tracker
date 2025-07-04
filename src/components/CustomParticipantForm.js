import React from 'react';

const CustomParticipantForm = ({ 
  customName, 
  customCount, 
  onCustomNameChange, 
  onCustomCountChange, 
  onAddCustomParticipant 
}) => {
  return (
    <div className="custom-participant">
      <h4>Add Custom Participants</h4>
      <div className="custom-inputs">
        <input
          type="text"
          placeholder="Name (e.g., 'goblin')"
          value={customName}
          onChange={(e) => onCustomNameChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddCustomParticipant()}
        />
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
            min="1"
            max="20"
            value={customCount}
            onChange={(e) => onCustomCountChange(parseInt(e.target.value) || 1)}
          />
          <div
            onClick={() => onCustomCountChange(prev => Math.min(20, prev + 1))}
            className="count-btn plus-btn"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCustomCountChange(prev => Math.min(20, prev + 1));
              }
            }}
          >
            +
          </div>
        </div>
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
          Add
        </div>
      </div>
    </div>
  );
};

export default CustomParticipantForm; 