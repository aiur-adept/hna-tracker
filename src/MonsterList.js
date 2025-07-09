import React, { useState, useRef, useEffect } from 'react';
import './CharacterList.css';

import DBService from './DBService';

const MonsterList = () => {
  const [monsters, setMonsters] = useState(DBService.getMonsterList());
  const stats = ['grit', 'fight', 'flight', 'brains', 'brawn', 'charm'];

  const [newMonster, setNewMonster] = useState({ 
    name: '', 
    health: '',
    stats: { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const firstInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMonster(prev => ({
      ...prev,
      [name]: name === 'health' ? parseInt(value) || 9 : value
    }));
  };

  const handleStatChange = (stat, value) => {
    setNewMonster(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: value === '' ? '' : parseInt(value) || 10
      }
    }));
  };

  const addMonster = () => {
    if (newMonster.name) {
      const updatedMonsters = [...monsters, {
        id: Date.now(),
        name: newMonster.name,
        health: newMonster.health,
        stats: newMonster.stats
      }];
      setMonsters(updatedMonsters);
      DBService.saveMonsterList(updatedMonsters);
      setNewMonster({ 
        name: '', 
        health: '',
        stats: { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
      });
      setShowForm(false);
    }
  };

  const startEditing = (monster) => {
    setEditingId(monster.id);
    setNewMonster({
      name: monster.name,
      health: monster.health,
      stats: monster.stats || { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
    });
    setShowForm(true);
  };

  const saveEdit = () => {
    if (newMonster.name && editingId) {
      const updatedMonsters = monsters.map(monster => 
        monster.id === editingId 
          ? { ...monster, name: newMonster.name, health: newMonster.health, stats: newMonster.stats }
          : monster
      );
      setMonsters(updatedMonsters);
      DBService.saveMonsterList(updatedMonsters);
      setNewMonster({ 
        name: '', 
        health: '',
        stats: { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
      });
      setShowForm(false);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setNewMonster({ 
      name: '', 
      health: '',
      stats: { grit: '', fight: '', flight: '', brains: '', brawn: '', charm: '' }
    });
    setShowForm(false);
    setEditingId(null);
  };

  const removeMonster = (id) => {
    if (window.confirm('Are you sure you want to remove this monster?')) {
      const updatedMonsters = monsters.filter(monster => monster.id !== id);
      setMonsters(updatedMonsters);
      DBService.saveMonsterList(updatedMonsters);
    }
  };

  const adjustMonsterHealth = (id, amount) => {
    const updatedMonsters = monsters.map(monster => {
      if (monster.id === id) {
        const newHealth = monster.health + amount;
        return { ...monster, health: newHealth };
      }
      return monster;
    });
    setMonsters(updatedMonsters);
    DBService.saveMonsterList(updatedMonsters);
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
          Add New Monster
        </div>
        <div className={`add-character-form ${!showForm ? 'hidden' : ''}`}>
          <div className="form-field">
            {editingId && <label>Name</label>}
            <input
              ref={firstInputRef}
              type="text"
              name="name"
              placeholder="Monster name"
              value={newMonster.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            {editingId && <label>Health</label>}
            <input
              type="number"
              name="health"
              placeholder="Health"
              value={newMonster.health}
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
                    value={newMonster.stats[stat] || ''}
                    onChange={(e) => handleStatChange(stat, e.target.value)}
                    className="stat-input"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="form-buttons">
            <div 
              onClick={editingId ? saveEdit : addMonster}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  editingId ? saveEdit() : addMonster();
                }
              }}
            >
              {editingId ? 'Save Changes' : 'Add Monster'}
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
        {monsters.map(monster => (
          <div key={monster.id} className="character-item">
            <div className="character-header">
              <h3>{monster.name}</h3>
              <div className="character-health">
                Health: {monster.health}
                <div className="inline-health-controls">
                  <div
                    onClick={() => adjustMonsterHealth(monster.id, -1)}
                    className="health-btn minus-btn"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        adjustMonsterHealth(monster.id, -1);
                      }
                    }}
                  >
                    −
                  </div>
                  <div
                    onClick={() => adjustMonsterHealth(monster.id, 1)}
                    className="health-btn plus-btn"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        adjustMonsterHealth(monster.id, 1);
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
                  onClick={() => startEditing(monster)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      startEditing(monster);
                    }
                  }}
                >
                  Edit
                </div>
                <div 
                  className="remove-btn"
                  onClick={() => removeMonster(monster.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      removeMonster(monster.id);
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
                    <span className="stat-value">{monster.stats?.[stat]}</span>
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

export default MonsterList; 