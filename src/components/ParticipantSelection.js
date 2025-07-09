import React, { useState } from 'react';
import CharacterGrid from './CharacterGrid';
import AddParticipantModal from './AddParticipantModal';
import SelectedParticipantsList from './SelectedParticipantsList';

const ParticipantSelection = ({ characters, selectedParticipants, onParticipantsChange, onRollInitiative }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const addCharacter = (character) => {
    if (!selectedParticipants.find(p => String(p.id) === String(character.id) && p.type === 'character')) {
      onParticipantsChange(prev => [...prev, {
        id: character.id,
        name: character.name,
        type: 'character',
        health: character.health || 9,
        stats: character.stats || { grit: 10, fight: 10, flight: 10, brains: 10, brawn: 10, charm: 10 }
      }]);
    }
  };

  const addParticipants = (newParticipants) => {
    onParticipantsChange(prev => [...prev, ...newParticipants]);
  };

  const removeParticipant = (id) => {
    onParticipantsChange(prev => prev.filter(p => p.id !== id));
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
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
            onClick={openAddModal}
            className="add-custom-participant-btn"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openAddModal();
              }
            }}
          >
            Add Participants
          </div>
        </div>

        <SelectedParticipantsList
          selectedParticipants={selectedParticipants}
          onRemoveParticipant={removeParticipant}
        />
      </div>

      <AddParticipantModal
        isOpen={showAddModal}
        onClose={closeAddModal}
        onAddParticipants={addParticipants}
      />
    </div>
  );
};

export default ParticipantSelection; 