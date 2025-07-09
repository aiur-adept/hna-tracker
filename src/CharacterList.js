import React, { useState, useRef, useEffect } from 'react';
import './CharacterList.css';

import DBService from './DBService';

const CharacterList = () => {
  const [characters, setCharacters] = useState(DBService.getCharacterList());

  const [newCharacter, setNewCharacter] = useState({ name: '', health: 9 });
  const [showForm, setShowForm] = useState(false);
  const firstInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter(prev => ({
      ...prev,
      [name]: name === 'health' ? parseInt(value) || 9 : value
    }));
  };

  const addCharacter = () => {
    if (newCharacter.name) {
      const updatedCharacters = [...characters, {
        id: Date.now(),
        name: newCharacter.name,
        health: newCharacter.health
      }];
      setCharacters(updatedCharacters);
      DBService.saveCharacterList(updatedCharacters);
      setNewCharacter({ name: '', health: 9 });
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

  const adjustCharacterHealth = (id, amount) => {
    const updatedCharacters = characters.map(character => {
      if (character.id === id) {
        const newHealth = Math.max(0, Math.min(20, character.health + amount));
        return { ...character, health: newHealth };
      }
      return character;
    });
    setCharacters(updatedCharacters);
    DBService.saveCharacterList(updatedCharacters);
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
            <input
              type="number"
              name="health"
              placeholder="Health (default: 9)"
              min="1"
              max="20"
              value={newCharacter.health}
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
                  setNewCharacter({ name: '', health: 9 });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowForm(false);
                    setNewCharacter({ name: '', health: 9 });
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
              <div className="character-health">
                Health: {character.health}
              </div>
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
            <div className="character-health-controls">
              <div
                onClick={() => adjustCharacterHealth(character.id, -1)}
                className="health-btn minus-btn"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    adjustCharacterHealth(character.id, -1);
                  }
                }}
              >
                −
              </div>
              <div className="health-display">
                {character.health}
              </div>
              <div
                onClick={() => adjustCharacterHealth(character.id, 1)}
                className="health-btn plus-btn"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    adjustCharacterHealth(character.id, 1);
                  }
                }}
              >
                +
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList; 