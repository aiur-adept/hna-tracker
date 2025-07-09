import React, { useState } from 'react';
import CharacterGrid from './CharacterGrid';
import CustomParticipantForm from './CustomParticipantForm';
import SelectedParticipantsList from './SelectedParticipantsList';

const ParticipantSelection = ({ characters, selectedParticipants, onParticipantsChange, onRollInitiative }) => {
  const [customName, setCustomName] = useState('');
  const [customCount, setCustomCount] = useState(1);
  const [customNotes, setCustomNotes] = useState('');
  const [customHealth, setCustomHealth] = useState('');
  const [customStats, setCustomStats] = useState({});
  const [showCustomModal, setShowCustomModal] = useState(false);

  const addCharacter = (character) => {
    if (!selectedParticipants.find(p => String(p.id) === String(character.id) && p.type === 'character')) {
      onParticipantsChange(prev => [...prev, {
        id: character.id,
        name: character.name,
        type: 'character',
        health: character.health || 9,
        stats: character.stats || {}
      }]);
    }
  };

  const addCustomParticipant = () => {
    if (customName.trim() && customCount > 0) {
      const newParticipants = Array.from({ length: customCount }, (_, index) => ({
        id: `custom-${Date.now()}-${index}`,
        name: customCount === 1 ? customName : `${customName} ${index + 1}`,
        type: 'custom',
        notes: customNotes.trim(),
        health: customHealth || 9,
        stats: customStats
      }));
      onParticipantsChange(prev => [...prev, ...newParticipants]);
      setCustomName('');
      setCustomCount(1);
      setCustomNotes('');
      setCustomHealth('');
      setCustomStats({});
      setShowCustomModal(false);
    }
  };

  const removeParticipant = (id) => {
    onParticipantsChange(prev => prev.filter(p => p.id !== id));
  };

  const openCustomModal = () => {
    setShowCustomModal(true);
  };

  const closeCustomModal = () => {
    setCustomName('');
    setCustomCount(1);
    setCustomNotes('');
    setCustomHealth('');
    setCustomStats({});
    setShowCustomModal(false);
  };

  return (
    <div className="initiative-tracker">
      <h2>Initiative Tracker</h2>
      
      <div className="roll-initiative-section">
        <div
          onClick={selectedParticipants.length > 0 ? onRollInitiative : undefined}
          className={`roll-initiative-btn ${selectedParticipants.length === 0 ? 'disabled' : ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && selectedParticipants.length > 0) {
              onRollInitiative();
            }
          }}
        >
          Roll Initiative ({selectedParticipants.length} participants)
        </div>
      </div>
      
      <div className="selection-section">
        <h3>Select Participants</h3>
        
        <CharacterGrid
          characters={characters}
          selectedParticipants={selectedParticipants}
          onCharacterSelect={addCharacter}
        />

        <div className="custom-participant-section">
          <div 
            onClick={openCustomModal}
            className="add-custom-participant-btn"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openCustomModal();
              }
            }}
          >
            Add Custom Participant
          </div>
        </div>

        <SelectedParticipantsList
          selectedParticipants={selectedParticipants}
          onRemoveParticipant={removeParticipant}
        />
      </div>

      {showCustomModal && (
        <div className="custom-participant-modal">
          <div className="modal-content">
            <h3>Add Custom Participant</h3>
            
            <CustomParticipantForm
              customName={customName}
              customCount={customCount}
              customNotes={customNotes}
              customHealth={customHealth}
              customStats={customStats}
              onCustomNameChange={setCustomName}
              onCustomCountChange={setCustomCount}
              onCustomNotesChange={setCustomNotes}
              onCustomHealthChange={setCustomHealth}
              onCustomStatsChange={setCustomStats}
              onAddCustomParticipant={addCustomParticipant}
            />

            <div className="modal-actions">
              <div 
                onClick={closeCustomModal}
                className="cancel-btn"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    closeCustomModal();
                  }
                }}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantSelection; 