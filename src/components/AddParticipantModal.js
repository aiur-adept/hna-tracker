import React, { useState } from 'react';
import CharacterGrid from './CharacterGrid';
import CustomParticipantForm from './CustomParticipantForm';
import SelectedParticipantsList from './SelectedParticipantsList';

const AddParticipantModal = ({ characters, initiativeOrder, onAddParticipants, onClose }) => {
  const [tempSelectedParticipants, setTempSelectedParticipants] = useState([]);
  const [tempCustomName, setTempCustomName] = useState('');
  const [tempCustomCount, setTempCustomCount] = useState(1);

  const addCharacterToEncounter = (character) => {
    if (!tempSelectedParticipants.find(p => String(p.id) === String(character.id) && p.type === 'character') &&
        !initiativeOrder.find(p => String(p.id) === String(character.id) && p.type === 'character')) {
      setTempSelectedParticipants(prev => [...prev, {
        id: character.id,
        name: character.name,
        type: 'character'
      }]);
    }
  };

  const addCustomParticipantToEncounter = () => {
    if (tempCustomName.trim() && tempCustomCount > 0) {
      const newParticipants = Array.from({ length: tempCustomCount }, (_, index) => ({
        id: `custom-${Date.now()}-${index}`,
        name: tempCustomCount === 1 ? tempCustomName : `${tempCustomName} ${index + 1}`,
        type: 'custom'
      }));
      setTempSelectedParticipants(prev => [...prev, ...newParticipants]);
      setTempCustomName('');
      setTempCustomCount(1);
    }
  };

  const removeTempParticipant = (id) => {
    setTempSelectedParticipants(prev => prev.filter(p => p.id !== id));
  };

  const finalizeAddParticipants = () => {
    if (tempSelectedParticipants.length > 0) {
      onAddParticipants(tempSelectedParticipants);
    }
    onClose();
  };

  const cancelAddParticipants = () => {
    setTempSelectedParticipants([]);
    setTempCustomName('');
    setTempCustomCount(1);
    onClose();
  };

  return (
    <div className="add-participant-modal">
      <div className="modal-content">
        <h3>Add Participants</h3>
        
        <div className="selection-section">
          <CharacterGrid
            characters={characters}
            selectedParticipants={tempSelectedParticipants}
            onCharacterSelect={addCharacterToEncounter}
            initiativeOrder={initiativeOrder}
          />

          <CustomParticipantForm
            customName={tempCustomName}
            customCount={tempCustomCount}
            onCustomNameChange={setTempCustomName}
            onCustomCountChange={setTempCustomCount}
            onAddCustomParticipant={addCustomParticipantToEncounter}
          />

          <SelectedParticipantsList
            selectedParticipants={tempSelectedParticipants}
            onRemoveParticipant={removeTempParticipant}
          />
        </div>
        
        <div className="modal-actions">
          <div 
            onClick={cancelAddParticipants}
            className="cancel-btn"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                cancelAddParticipants();
              }
            }}
          >
            Cancel
          </div>
          <div 
            onClick={tempSelectedParticipants.length > 0 ? finalizeAddParticipants : undefined}
            className={`add-to-encounter-btn ${tempSelectedParticipants.length === 0 ? 'disabled' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && tempSelectedParticipants.length > 0) {
                finalizeAddParticipants();
              }
            }}
          >
            Add to Encounter ({tempSelectedParticipants.length})
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddParticipantModal; 