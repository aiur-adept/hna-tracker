import React, { useState } from 'react';
import CharacterGrid from './CharacterGrid';
import CustomParticipantForm from './CustomParticipantForm';
import SelectedParticipantsList from './SelectedParticipantsList';

const AddParticipantModal = ({ characters, initiativeOrder, onAddParticipants, onClose }) => {
  const [tempSelectedParticipants, setTempSelectedParticipants] = useState([]);
  const [tempCustomName, setTempCustomName] = useState('');
  const [tempCustomCount, setTempCustomCount] = useState(1);
  const [tempCustomNotes, setTempCustomNotes] = useState('');
  const [tempCustomHealth, setTempCustomHealth] = useState('');
  const [tempCustomStats, setTempCustomStats] = useState({});
  const [showCustomModal, setShowCustomModal] = useState(false);

  const addCharacterToEncounter = (character) => {
    if (!tempSelectedParticipants.find(p => String(p.id) === String(character.id) && p.type === 'character') &&
        !initiativeOrder.find(p => String(p.id) === String(character.id) && p.type === 'character')) {
      setTempSelectedParticipants(prev => [...prev, {
        id: character.id,
        name: character.name,
        type: 'character',
        health: character.health || 9,
        stats: character.stats || {}
      }]);
    }
  };

  const addCustomParticipantToEncounter = () => {
    if (tempCustomName.trim() && tempCustomCount > 0) {
      const newParticipants = Array.from({ length: tempCustomCount }, (_, index) => ({
        id: `custom-${Date.now()}-${index}`,
        name: tempCustomCount === 1 ? tempCustomName : `${tempCustomName} ${index + 1}`,
        type: 'custom',
        notes: tempCustomNotes.trim(),
        health: tempCustomHealth || 9,
        stats: tempCustomStats
      }));
      setTempSelectedParticipants(prev => [...prev, ...newParticipants]);
      setTempCustomName('');
      setTempCustomCount(1);
      setTempCustomNotes('');
      setTempCustomHealth('');
      setTempCustomStats({});
      setShowCustomModal(false);
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
    setTempCustomNotes('');
    setTempCustomHealth('');
    setTempCustomStats({});
    onClose();
  };

  const openCustomModal = () => {
    setShowCustomModal(true);
  };

  const closeCustomModal = () => {
    setTempCustomName('');
    setTempCustomCount(1);
    setTempCustomNotes('');
    setTempCustomHealth('');
    setTempCustomStats({});
    setShowCustomModal(false);
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

      {showCustomModal && (
        <div className="custom-participant-modal">
          <div className="modal-content">
            <h3>Add Custom Participant</h3>
            
            <CustomParticipantForm
              customName={tempCustomName}
              customCount={tempCustomCount}
              customNotes={tempCustomNotes}
              customHealth={tempCustomHealth}
              customStats={tempCustomStats}
              onCustomNameChange={setTempCustomName}
              onCustomCountChange={setTempCustomCount}
              onCustomNotesChange={setTempCustomNotes}
              onCustomHealthChange={setTempCustomHealth}
              onCustomStatsChange={setTempCustomStats}
              onAddCustomParticipant={addCustomParticipantToEncounter}
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

export default AddParticipantModal; 