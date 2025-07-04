import React, { useState } from 'react';
import CharacterGrid from './CharacterGrid';
import CustomParticipantForm from './CustomParticipantForm';
import SelectedParticipantsList from './SelectedParticipantsList';

const ParticipantSelection = ({ characters, selectedParticipants, onParticipantsChange, onRollInitiative }) => {
  const [customName, setCustomName] = useState('');
  const [customCount, setCustomCount] = useState(1);

  const addCharacter = (character) => {
    if (!selectedParticipants.find(p => String(p.id) === String(character.id) && p.type === 'character')) {
      onParticipantsChange(prev => [...prev, {
        id: character.id,
        name: character.name,
        type: 'character'
      }]);
    }
  };

  const addCustomParticipant = () => {
    if (customName.trim() && customCount > 0) {
      const newParticipants = Array.from({ length: customCount }, (_, index) => ({
        id: `custom-${Date.now()}-${index}`,
        name: customCount === 1 ? customName : `${customName} ${index + 1}`,
        type: 'custom'
      }));
      onParticipantsChange(prev => [...prev, ...newParticipants]);
      setCustomName('');
      setCustomCount(1);
    }
  };

  const removeParticipant = (id) => {
    onParticipantsChange(prev => prev.filter(p => p.id !== id));
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

        <CustomParticipantForm
          customName={customName}
          customCount={customCount}
          onCustomNameChange={setCustomName}
          onCustomCountChange={setCustomCount}
          onAddCustomParticipant={addCustomParticipant}
        />

        <SelectedParticipantsList
          selectedParticipants={selectedParticipants}
          onRemoveParticipant={removeParticipant}
        />
      </div>
    </div>
  );
};

export default ParticipantSelection; 