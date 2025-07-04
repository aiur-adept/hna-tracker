import React, { useState, useRef, useEffect } from 'react';
import './CharacterList.css';

import DBService from './DBService';

const CharacterList = () => {
  const [characters, setCharacters] = useState(DBService.getCharacterList());

  const [newCharacter, setNewCharacter] = useState({ name: '' });
  const [showForm, setShowForm] = useState(false);
  const firstInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCharacter = () => {
    if (newCharacter.name) {
      const updatedCharacters = [...characters, {
        id: Date.now(),
        name: newCharacter.name
      }];
      setCharacters(updatedCharacters);
      DBService.saveCharacterList(updatedCharacters);
      setNewCharacter({ name: '' });
      setShowForm(false);
    }
  };

  const removeCharacter = (id) => {
    if (window.confirm('Are you sure you want to remove this character?')) {
      const updatedCharacters = characters.filter(character => character.id !== id);
      setCharacters(updatedCharacters);
      DBService.saveCharacterList(updatedCharacters);
    }
  };

  useEffect(() => {
    if (showForm && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showForm]);

  return (
    <div className="character-list">      
      <div className="add-character-section">
        {!showForm ? (
          <div 
            className="show-form-btn"
            onClick={() => setShowForm(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowForm(true);
              }
            }}
          >
            Add New Character
          </div>
        ) : (
          <div className="add-character-form">
            <input
              ref={firstInputRef}
              type="text"
              name="name"
              placeholder="Character name"
              value={newCharacter.name}
              onChange={handleInputChange}
            />
            <div className="form-buttons">
              <div 
                onClick={addCharacter}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    addCharacter();
                  }
                }}
              >
                Add Character
              </div>
              <div 
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setNewCharacter({ name: '' });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowForm(false);
                    setNewCharacter({ name: '' });
                  }
                }}
              >
                Cancel
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="characters-container">
        {characters.map(character => (
          <div key={character.id} className="character-item">
            <div className="character-header">
              <h3>{character.name}</h3>
              <div 
                className="remove-btn"
                onClick={() => removeCharacter(character.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    removeCharacter(character.id);
                  }
                }}
              >
                ×
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList; 