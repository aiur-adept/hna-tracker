import React, { useState, useEffect } from 'react';
import DBService from '../DBService';

const AddParticipantModal = ({ isOpen, onClose, onAddParticipants }) => {
  const [activeTab, setActiveTab] = useState('monster');
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [monsterCount, setMonsterCount] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customCount, setCustomCount] = useState(1);
  const [customNotes, setCustomNotes] = useState('');
  const [customHealth, setCustomHealth] = useState('');
  const [customStats, setCustomStats] = useState({});

  useEffect(() => {
    if (isOpen) {
      setMonsters(DBService.getMonsterList());
    }
  }, [isOpen]);

  const handleMonsterSelect = (monster) => {
    setSelectedMonster(monster);
    setCustomName(monster.name);
    setCustomHealth(monster.health.toString());
    setCustomStats(monster.stats || {});
  };

  const handleAddMonsterParticipants = () => {
    if (selectedMonster && monsterCount > 0) {
      const newParticipants = Array.from({ length: monsterCount }, (_, index) => ({
        id: `monster-${selectedMonster.id}-${Date.now()}-${index}`,
        name: monsterCount === 1 ? selectedMonster.name : `${selectedMonster.name} ${index + 1}`,
        type: 'monster',
        health: selectedMonster.health,
        stats: selectedMonster.stats || {},
        notes: `Based on ${selectedMonster.name} template`
      }));
      onAddParticipants(newParticipants);
      handleClose();
    }
  };

  const handleAddCustomParticipants = () => {
    if (customName.trim() && customCount > 0) {
      const newParticipants = Array.from({ length: customCount }, (_, index) => ({
        id: `custom-${Date.now()}-${index}`,
        name: customCount === 1 ? customName : `${customName} ${index + 1}`,
        type: 'custom',
        notes: customNotes.trim(),
        health: customHealth || 9,
        stats: customStats
      }));
      onAddParticipants(newParticipants);
      handleClose();
    }
  };

  const handleClose = () => {
    setActiveTab('monster');
    setSelectedMonster(null);
    setMonsterCount(1);
    setCustomName('');
    setCustomCount(1);
    setCustomNotes('');
    setCustomHealth('');
    setCustomStats({});
    onClose();
  };

  const stats = ['grit', 'fight', 'flight', 'brains', 'brawn', 'charm'];

  if (!isOpen) return null;

  return (
    <div className="add-participant-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Participants</h3>
          <div className="tab-buttons">
            <div
              className={`tab-btn ${activeTab === 'monster' ? 'active' : ''}`}
              onClick={() => setActiveTab('monster')}
            >
              From Monster Templates
            </div>
            <div
              className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              Custom Participant
            </div>
          </div>
        </div>

        {activeTab === 'monster' && (
          <div className="monster-tab">
            <div className="monster-selection">
              <h4>Select Monster Template</h4>
              <div className="monster-grid">
                {monsters.map(monster => (
                  <div
                    key={monster.id}
                    className={`monster-card ${selectedMonster?.id === monster.id ? 'selected' : ''}`}
                    onClick={() => handleMonsterSelect(monster)}
                  >
                    <h5>{monster.name}</h5>
                  </div>
                ))}
              </div>
            </div>

            {selectedMonster && (
              <div className="monster-customization">
                <h4>Customize Template</h4>
                <div className="customization-inputs">
                  <input
                    type="text"
                    placeholder="Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Health"
                    value={customHealth}
                    onChange={(e) => setCustomHealth(e.target.value)}
                  />
                  <div className="count-controls">
                    <span>Count:</span>
                    <div className="count-buttons">
                      <div
                        onClick={() => setMonsterCount(prev => Math.max(1, prev - 1))}
                        className="count-btn"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setMonsterCount(prev => Math.max(1, prev - 1));
                          }
                        }}
                      >
                        −
                      </div>
                      <input
                        type="number"
                        value={monsterCount}
                        onChange={(e) => setMonsterCount(parseInt(e.target.value) || 1)}
                        min="1"
                      />
                      <div
                        onClick={() => setMonsterCount(prev => prev + 1)}
                        className="count-btn"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setMonsterCount(prev => prev + 1);
                          }
                        }}
                      >
                        +
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stats-section">
                  <h5>Stats</h5>
                  <div className="stats-grid">
                    {stats.map(stat => (
                      <div key={stat} className="stat-control">
                        <label>{stat}</label>
                        <input
                          type="number"
                          value={customStats[stat] || ''}
                          onChange={(e) => setCustomStats({
                            ...customStats,
                            [stat]: e.target.value === '' ? '' : parseInt(e.target.value) || 10
                          })}
                          className="stat-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="custom-tab">
            <div className="custom-inputs">
              <input
                type="text"
                placeholder="Name (e.g., 'goblin')"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
              />
              <input
                type="number"
                placeholder="Health"
                value={customHealth}
                onChange={(e) => setCustomHealth(e.target.value === '' ? '' : parseInt(e.target.value) || 9)}
                className="health-input"
              />
              <div className="count-controls">
                <span>Count:</span>
                <div className="count-buttons">
                  <div
                    onClick={() => setCustomCount(prev => Math.max(1, prev - 1))}
                    className="count-btn"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setCustomCount(prev => Math.max(1, prev - 1));
                      }
                    }}
                  >
                    −
                  </div>
                  <input
                    type="number"
                    value={customCount}
                    onChange={(e) => setCustomCount(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <div
                    onClick={() => setCustomCount(prev => prev + 1)}
                    className="count-btn"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setCustomCount(prev => prev + 1);
                      }
                    }}
                  >
                    +
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h5>Stats</h5>
              <div className="stats-grid">
                {stats.map(stat => (
                  <div key={stat} className="stat-control">
                    <label>{stat}</label>
                    <input
                      type="number"
                      value={customStats[stat] || ''}
                      onChange={(e) => setCustomStats({
                        ...customStats,
                                                    [stat]: e.target.value === '' ? '' : parseInt(e.target.value) || 10
                      })}
                      className="stat-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <div 
            onClick={handleClose}
            className="cancel-btn"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClose();
              }
            }}
          >
            Cancel
          </div>
          <div
            onClick={
              (activeTab === 'monster' && selectedMonster && monsterCount > 0) ||
              (activeTab === 'custom' && customName.trim() && customCount > 0)
                ? (activeTab === 'monster' ? handleAddMonsterParticipants : handleAddCustomParticipants)
                : undefined
            }
            className={`add-btn ${
              (activeTab === 'monster' && (!selectedMonster || monsterCount <= 0)) ||
              (activeTab === 'custom' && (!customName.trim() || customCount <= 0))
                ? 'disabled'
                : ''
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && 
                  ((activeTab === 'monster' && selectedMonster && monsterCount > 0) ||
                   (activeTab === 'custom' && customName.trim() && customCount > 0))) {
                activeTab === 'monster' ? handleAddMonsterParticipants() : handleAddCustomParticipants();
              }
            }}
          >
            Add {activeTab === 'monster' ? 'Monster' : 'Custom'} Participants
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddParticipantModal; 