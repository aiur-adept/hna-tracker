import React, { useState } from 'react';
import './Initiative.css';
import DBService from './DBService';

const Initiative = () => {
  const [mode, setMode] = useState('selection');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [customName, setCustomName] = useState('');
  const [customCount, setCustomCount] = useState(1);
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
  const characters = DBService.getCharacterList();

  const addCharacter = (character) => {
    if (!selectedParticipants.find(p => p.id === character.id && p.type === 'character')) {
      setSelectedParticipants(prev => [...prev, {
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
      setSelectedParticipants(prev => [...prev, ...newParticipants]);
      setCustomName('');
      setCustomCount(1);
    }
  };

  const removeParticipant = (id) => {
    setSelectedParticipants(prev => prev.filter(p => p.id !== id));
  };

  const rollInitiative = () => {
    const participantsWithRolls = selectedParticipants.map(participant => ({
      ...participant,
      initiative: Math.floor(Math.random() * 20) + 1,
      health: 9,
      status: 'active',
      notes: ''
    }));
    
    const sortedParticipants = participantsWithRolls.sort((a, b) => b.initiative - a.initiative);
    setInitiativeOrder(sortedParticipants);
    setCurrentTurnIndex(0);
    setMode('encounter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToSelection = () => {
    setSelectedParticipants([]);
    setInitiativeOrder([]);
    setCurrentTurnIndex(0);
    setMode('selection');
  };

  const scrollToParticipant = (participantId) => {
    setTimeout(() => {
      const currentParticipantElement = document.querySelector(`[data-participant-id="${participantId}"]`);
      if (currentParticipantElement) {
        const elementRect = currentParticipantElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const scrollTop = window.pageYOffset + elementRect.top - (windowHeight / 2) + (elementRect.height / 2);
        
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const passTurn = () => {
    let nextIndex = (currentTurnIndex + 1) % initiativeOrder.length;
    let attempts = 0;
    
    while (attempts < initiativeOrder.length && 
           (initiativeOrder[nextIndex].status === 'inactive' || initiativeOrder[nextIndex].status === 'dead')) {
      nextIndex = (nextIndex + 1) % initiativeOrder.length;
      attempts++;
    }
    
    const nextParticipantId = initiativeOrder[nextIndex].id;
    setCurrentTurnIndex(nextIndex);
    scrollToParticipant(nextParticipantId);
  };

  const toggleInactive = (participantId) => {
    setInitiativeOrder(prev => prev.map(participant => 
      participant.id === participantId 
        ? { ...participant, status: participant.status === 'inactive' ? 'active' : 'inactive' }
        : participant
    ));
    
    if (currentTurnIndex === initiativeOrder.findIndex(p => p.id === participantId)) {
      const nextIndex = getNextActiveIndex();
      const nextParticipantId = initiativeOrder[nextIndex].id;
      setCurrentTurnIndex(nextIndex);
      scrollToParticipant(nextParticipantId);
    }
  };

  const setDead = (participantId) => {
    setInitiativeOrder(prev => prev.map(participant => 
      participant.id === participantId 
        ? { 
            ...participant, 
            status: participant.status === 'dead' ? 'active' : 'dead',
            health: participant.status === 'dead' ? participant.health : 0
          }
        : participant
    ));
    
    if (currentTurnIndex === initiativeOrder.findIndex(p => p.id === participantId)) {
      const nextIndex = getNextActiveIndex();
      const nextParticipantId = initiativeOrder[nextIndex].id;
      setCurrentTurnIndex(nextIndex);
      scrollToParticipant(nextParticipantId);
    }
  };

  const updateNotes = (participantId, notes) => {
    setInitiativeOrder(prev => prev.map(participant => 
      participant.id === participantId 
        ? { ...participant, notes }
        : participant
    ));
  };

  const adjustHealth = (participantId, amount) => {
    setInitiativeOrder(prev => {
      const updatedOrder = prev.map(participant => {
        if (participant.id === participantId) {
          const newHealth = Math.max(0, Math.min(9, participant.health + amount));
          const newStatus = newHealth === 0 ? 'dead' : participant.status;
          return { ...participant, health: newHealth, status: newStatus };
        }
        return participant;
      });
      
      const updatedParticipant = updatedOrder.find(p => p.id === participantId);
      if (updatedParticipant && updatedParticipant.health === 0 && updatedParticipant.status === 'dead') {
        const currentIndex = updatedOrder.findIndex(p => p.id === participantId);
        if (currentIndex === currentTurnIndex) {
          setTimeout(() => {
            const nextIndex = getNextActiveIndex();
            const nextParticipantId = updatedOrder[nextIndex].id;
            setCurrentTurnIndex(nextIndex);
            scrollToParticipant(nextParticipantId);
          }, 0);
        }
      }
      
      return updatedOrder;
    });
  };

  const getNextActiveIndex = () => {
    let nextIndex = (currentTurnIndex + 1) % initiativeOrder.length;
    let attempts = 0;
    
    while (attempts < initiativeOrder.length && 
           (initiativeOrder[nextIndex].status === 'inactive' || initiativeOrder[nextIndex].status === 'dead')) {
      nextIndex = (nextIndex + 1) % initiativeOrder.length;
      attempts++;
    }
    
    return nextIndex;
  };

  const renderHealthDots = (health) => {
    const dots = [];
    for (let i = 0; i < 9; i++) {
      dots.push(
        <div 
          key={i} 
          className={`health-dot ${i < health ? 'filled' : 'empty'}`}
        />
      );
    }
    return dots;
  };

  if (mode === 'encounter') {
    return (
      <div className="initiative-tracker">
        <div className="encounter-header">
          <h2>Initiative Order</h2>
          <div 
            onClick={() => {
              if (window.confirm('Are you sure you want to start a new encounter? This will reset all current participants and initiative order.')) {
                resetToSelection();
              }
            }} 
            className="reset-btn"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (window.confirm('Are you sure you want to start a new encounter? This will reset all current participants and initiative order.')) {
                  resetToSelection();
                }
              }
            }}
          >
            New Encounter
          </div>
        </div>
        

        
        <div className="initiative-list">
          {initiativeOrder.map((participant, index) => (
            <div key={participant.id} data-participant-id={participant.id} className={`initiative-item ${index === currentTurnIndex ? 'current-turn' : ''} ${participant.status}`}>
              <div className="participant-header">
                <div className="participant-name-section">
                  <span className="participant-name">{participant.name}</span>
                  {participant.status === 'dead' && (
                    <div
                      onClick={() => setDead(participant.id)}
                      className="resurrect-btn"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setDead(participant.id);
                        }
                      }}
                    >
                      Resurrect
                    </div>
                  )}
                  {participant.status === 'inactive' && (
                    <div
                      onClick={() => toggleInactive(participant.id)}
                      className="activate-btn"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          toggleInactive(participant.id);
                        }
                      }}
                    >
                      Activate
                    </div>
                  )}
                  {index === currentTurnIndex && participant.status === 'active' && (
                    <>
                      <div
                        onClick={() => toggleInactive(participant.id)}
                        className="deactivate-btn"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            toggleInactive(participant.id);
                          }
                        }}
                      >
                        Deactivate
                      </div>
                      <div
                        onClick={() => setDead(participant.id)}
                        className="died-btn"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setDead(participant.id);
                          }
                        }}
                      >
                        Died
                      </div>
                    </>
                  )}
                </div>
                <div className="health-controls">
                  <div
                    onClick={() => adjustHealth(participant.id, -1)}
                    className="health-btn minus-btn"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        adjustHealth(participant.id, -1);
                      }
                    }}
                  >
                    −
                  </div>
                  <div className="health-dots">
                    {renderHealthDots(participant.health)}
                  </div>
                  <div
                    onClick={() => adjustHealth(participant.id, 1)}
                    className="health-btn plus-btn"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        adjustHealth(participant.id, 1);
                      }
                    }}
                  >
                    +
                  </div>
                </div>
                <div className="participant-controls">
                  <span className="initiative-roll">{participant.initiative}</span>
                </div>
              </div>
              <div className="participant-notes">
                <input
                  type="text"
                  placeholder="add note"
                  value={participant.notes || ''}
                  onChange={(e) => updateNotes(participant.id, e.target.value)}
                  className="notes-input"
                />
              </div>
            </div>
          ))}
        </div>
        <div 
          onClick={passTurn}
          className="pass-turn-btn-fixed"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              passTurn();
            }
          }}
        >
          PASS
        </div>
      </div>
    );
  }

  return (
    <div className="initiative-tracker">
      <h2>Initiative Tracker</h2>
      
      <div className="selection-section">
        <h3>Select Participants</h3>
        
        <div className="character-selection">
          <h4>Existing Characters</h4>
          <div className="character-grid">
            {characters.map(character => (
              <div
                key={character.id}
                onClick={() => addCharacter(character)}
                className={`character-btn ${
                  selectedParticipants.find(p => p.id === character.id && p.type === 'character')
                    ? 'selected'
                    : ''
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    addCharacter(character);
                  }
                }}
              >
                {character.name}
              </div>
            ))}
          </div>
        </div>

        <div className="custom-participant">
          <h4>Add Custom Participants</h4>
          <div className="custom-inputs">
            <input
              type="text"
              placeholder="Name (e.g., 'goblin')"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomParticipant()}
            />
            <div className="count-controls">
              <div
                onClick={() => setCustomCount(prev => Math.max(1, prev - 1))}
                className="count-btn minus-btn"
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
                min="1"
                max="20"
                value={customCount}
                onChange={(e) => setCustomCount(parseInt(e.target.value) || 1)}
              />
              <div
                onClick={() => setCustomCount(prev => Math.min(20, prev + 1))}
                className="count-btn plus-btn"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setCustomCount(prev => Math.min(20, prev + 1));
                  }
                }}
              >
                +
              </div>
            </div>
            <div 
              onClick={addCustomParticipant} 
              className="add-custom-btn"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  addCustomParticipant();
                }
              }}
            >
              Add
            </div>
          </div>
        </div>

        <div className="selected-participants">
          <h4>Selected Participants ({selectedParticipants.length})</h4>
          {selectedParticipants.length === 0 ? (
            <p className="no-participants">No participants selected</p>
          ) : (
            <div className="participants-list">
              {selectedParticipants.map(participant => (
                <div key={participant.id} className="participant-item">
                  <span>{participant.name}</span>
                  <div
                    onClick={() => removeParticipant(participant.id)}
                    className="remove-participant-btn"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        removeParticipant(participant.id);
                      }
                    }}
                  >
                    ×
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="action-buttons">
          <div
            onClick={selectedParticipants.length > 0 ? rollInitiative : undefined}
            className={`roll-initiative-btn ${selectedParticipants.length === 0 ? 'disabled' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && selectedParticipants.length > 0) {
                rollInitiative();
              }
            }}
          >
            Roll Initiative ({selectedParticipants.length} participants)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Initiative;
