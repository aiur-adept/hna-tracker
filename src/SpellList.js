import React, { useState, useRef, useEffect } from 'react';
import './SpellList.css';

import DBService from './DBService';

const SpellList = () => {
  const [spells, setSpells] = useState(DBService.getSpellList());

  const [newSpell, setNewSpell] = useState({ name: '', check: '', stat: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const firstInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSpell(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSpell = () => {
    if (newSpell.name && newSpell.check && newSpell.stat && newSpell.description) {
      const updatedSpells = [...spells, {
        id: Date.now(),
        name: newSpell.name,
        check: parseInt(newSpell.check),
        stat: newSpell.stat,
        description: newSpell.description
      }];
      setSpells(updatedSpells);
      DBService.saveSpellList(updatedSpells);
      setNewSpell({ name: '', check: '', stat: '', description: '' });
      setShowForm(false);
    }
  };

  const removeSpell = (id) => {
    if (window.confirm('Are you sure you want to remove this spell?')) {
      const updatedSpells = spells.filter(spell => spell.id !== id);
      setSpells(updatedSpells);
      DBService.saveSpellList(updatedSpells);
    }
  };

  useEffect(() => {
    if (showForm && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showForm]);

  return (
    <div className="spell-list">      
      <div className="add-spell-section">
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
            Add New Spell
          </div>
        ) : (
          <div className="add-spell-form">
            <input
              ref={firstInputRef}
              type="text"
              name="name"
              placeholder="Spell name"
              value={newSpell.name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="check"
              placeholder="Check"
              value={newSpell.check}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="stat"
              placeholder="Stat"
              value={newSpell.stat}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newSpell.description}
              onChange={handleInputChange}
            />
            <div className="form-buttons">
              <div 
                onClick={addSpell}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    addSpell();
                  }
                }}
              >
                Add Spell
              </div>
              <div 
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setNewSpell({ name: '', check: '', stat: '', description: '' });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowForm(false);
                    setNewSpell({ name: '', check: '', stat: '', description: '' });
                  }
                }}
              >
                Cancel
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="spells-container">
        {spells.map(spell => (
          <div key={spell.id} className="spell-item">
            <div className="spell-header">
              <h3>{spell.name}</h3>
              <div 
                className="remove-btn"
                onClick={() => removeSpell(spell.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    removeSpell(spell.id);
                  }
                }}
              >
                ×
              </div>
            </div>
            <p>Check: {spell.check}</p>
            <p>Stat: {spell.stat}</p>
            <p className="spell-description">{spell.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellList;
