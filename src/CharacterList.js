import React, { useState, useRef, useEffect } from 'react';
import './CharacterList.css';

import DBService from './DBService';

const CharacterList = () => {
  const [characters, setCharacters] = useState(DBService.getCharacterList());
  const stats = ['grit', 'fight', 'flight', 'brains', 'brawn', 'charm'];

  const [newCharacter, setNewCharacter] = useState({ 
    name: '', 
    health: '',
    stats: { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const firstInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter(prev => ({
      ...prev,
      [name]: name === 'health' ? parseInt(value) || 9 : value
    }));
  };

  const handleStatChange = (stat, value) => {
    setNewCharacter(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: value === '' ? '' : parseInt(value) || 9
      }
    }));
  };

  const addCharacter = () => {
    if (newCharacter.name) {
      const updatedCharacters = [...characters, {
        id: Date.now(),
        name: newCharacter.name,
        health: newCharacter.health,
        stats: newCharacter.stats
      }];
      setCharacters(updatedCharacters);
      DBService.saveCharacterList(updatedCharacters);
      setNewCharacter({ 
        name: '', 
        health: '',
        stats: { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
      });
      setShowForm(false);
    }
  };

  const startEditing = (character) => {
    setEditingId(character.id);
    setNewCharacter({
      name: character.name,
      health: character.health,
      stats: character.stats || { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
    });
    setShowForm(true);
  };

  const saveEdit = () => {
    if (newCharacter.name && editingId) {
      const updatedCharacters = characters.map(character => 
        character.id === editingId 
          ? { ...character, name: newCharacter.name, health: newCharacter.health, stats: newCharacter.stats }
          : character
      );
      setCharacters(updatedCharacters);
      DBService.saveCharacterList(updatedCharacters);
      setNewCharacter({ 
        name: '', 
        health: '',
        stats: { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
      });
      setShowForm(false);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setNewCharacter({ 
      name: '', 
      health: '',
      stats: { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
    });
    setShowForm(false);
    setEditingId(null);
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
        const newHealth = character.health + amount;
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
        <div 
          className={`show-form-btn ${showForm ? 'hidden' : ''}`}
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
        <div className={`add-character-form ${!showForm ? 'hidden' : ''}`}>
          <div className="form-field">
            {editingId && <label>Name</label>}
            <input
              ref={firstInputRef}
              type="text"
              name="name"
              placeholder="Character name"
              value={newCharacter.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            {editingId && <label>Health</label>}
            <input
              type="number"
              name="health"
              placeholder="Health"
              value={newCharacter.health}
              onChange={handleInputChange}
            />
          </div>
          <div className="stats-section">
            <h5>Stats</h5>
            <div className="stats-grid">
              {stats.map(stat => (
                <div key={stat} className="stat-control">
                  <label>{stat}</label>
                  <input
                    type="number"
                    value={newCharacter.stats[stat] || ''}
                    onChange={(e) => handleStatChange(stat, e.target.value)}
                    className="stat-input"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="form-buttons">
            <div 
              onClick={editingId ? saveEdit : addCharacter}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  editingId ? saveEdit() : addCharacter();
                }
              }}
            >
              {editingId ? 'Save Changes' : 'Add Character'}
            </div>
            <div 
              className="cancel-btn"
              onClick={cancelEdit}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  cancelEdit();
                }
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>

      <div className="characters-container">
        {characters.map(character => (
          <div key={character.id} className="character-item">
            <div className="character-header">
              <h3>{character.name}</h3>
              <div className="character-health">
                Health: {character.health}
                <div className="inline-health-controls">
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
              <div className="character-actions">
                <div 
                  className="edit-btn"
                  onClick={() => startEditing(character)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      startEditing(character);
                    }
                  }}
                >
                  Edit
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
            </div>
            <div className="character-stats">
              <div className="stats-grid">
                {stats.map(stat => (
                  <div key={stat} className="stat-display">
                    <span className="stat-label">{stat}:</span>
                    <span className="stat-value">{character.stats?.[stat]}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList; 