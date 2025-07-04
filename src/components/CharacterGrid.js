import React from 'react';

const CharacterGrid = ({ characters, selectedParticipants, onCharacterSelect, initiativeOrder }) => {
  return (
    <div className="character-selection">
      <h4>Existing Characters</h4>
      <div className="character-grid">
        {characters.map(character => {
          const isAlreadyInEncounter = initiativeOrder?.find(p => 
            String(p.id) === String(character.id) && p.type === 'character'
          );
          const isSelected = selectedParticipants.find(p => 
            String(p.id) === String(character.id) && p.type === 'character'
          );
          
          return (
            <div
              key={character.id}
              onClick={() => !isAlreadyInEncounter && onCharacterSelect(character)}
              className={`character-btn ${
                isSelected ? 'selected' : ''
              } ${isAlreadyInEncounter ? 'disabled' : ''}`}
              role="button"
              tabIndex={isAlreadyInEncounter ? -1 : 0}
              onKeyDown={(e) => {
                if (!isAlreadyInEncounter && (e.key === 'Enter' || e.key === ' ')) {
                  onCharacterSelect(character);
                }
              }}
            >
              {character.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterGrid; 