import React, { useState, useEffect } from 'react';
import ParticipantSelection from './ParticipantSelection';
import EncounterView from './EncounterView';
import DBService from '../DBService';

const InitiativeTracker = () => {
  const [mode, setMode] = useState('selection');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [characters, setCharacters] = useState(DBService.getCharacterList());
  const [lastCharacterTimestamp, setLastCharacterTimestamp] = useState(
    localStorage.getItem('characters-timestamp') || '0'
  );
  
  const refreshCharacters = () => {
    const updatedCharacters = DBService.getCharacterList();
    setCharacters(updatedCharacters);
    setLastCharacterTimestamp(localStorage.getItem('characters-timestamp') || '0');
    
    // Update initiative order with fresh character data
    if (initiativeOrder.length > 0) {
      const updatedInitiativeOrder = initiativeOrder.map(participant => {
        const character = updatedCharacters.find(c => c.id === participant.id);
        if (character) {
          return { ...participant, health: character.health };
        }
        return participant;
      });
      setInitiativeOrder(updatedInitiativeOrder);
      saveEncounterToStorage(updatedInitiativeOrder, currentTurnIndex);
    }
  };

  useEffect(() => {
    const savedEncounter = localStorage.getItem('hna-initiative-encounter');
    if (savedEncounter) {
      try {
        const encounterData = JSON.parse(savedEncounter);
        const savedInitiativeOrder = encounterData.initiativeOrder || [];
        const savedCurrentTurnIndex = encounterData.currentTurnIndex || 0;
        
        // Get fresh character data and update initiative order
        const freshCharacters = DBService.getCharacterList();
        const updatedInitiativeOrder = savedInitiativeOrder.map(participant => {
          const character = freshCharacters.find(c => c.id === participant.id);
          if (character) {
            return { ...participant, health: character.health };
          }
          return participant;
        });
        
        setInitiativeOrder(updatedInitiativeOrder);
        setCurrentTurnIndex(savedCurrentTurnIndex);
        setMode('encounter');
        
        // Save the updated encounter data
        saveEncounterToStorage(updatedInitiativeOrder, savedCurrentTurnIndex);
      } catch (error) {
        console.error('Failed to parse saved encounter data:', error);
        localStorage.removeItem('hna-initiative-encounter');
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'characters' || e.key === 'characters-timestamp') {
        refreshCharacters();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Check for character updates periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTimestamp = localStorage.getItem('characters-timestamp') || '0';
      if (currentTimestamp !== lastCharacterTimestamp) {
        refreshCharacters();
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [lastCharacterTimestamp]);

  const saveEncounterToStorage = (initiativeOrder, currentTurnIndex) => {
    const encounterData = {
      initiativeOrder,
      currentTurnIndex,
      timestamp: Date.now()
    };
    localStorage.setItem('hna-initiative-encounter', JSON.stringify(encounterData));
  };

  const clearEncounterFromStorage = () => {
    localStorage.removeItem('hna-initiative-encounter');
  };

  const rollInitiative = () => {
    const participantsWithRolls = selectedParticipants.map(participant => ({
      ...participant,
      initiative: Math.floor(Math.random() * 20) + 1,
      health: participant.health || 9,
      status: 'active',
      notes: participant.notes || ''
    }));
    
    const sortedParticipants = participantsWithRolls.sort((a, b) => b.initiative - a.initiative);
    setInitiativeOrder(sortedParticipants);
    setCurrentTurnIndex(0);
    setMode('encounter');
    saveEncounterToStorage(sortedParticipants, 0);
  };

  const resetToSelection = () => {
    setSelectedParticipants([]);
    setInitiativeOrder([]);
    setCurrentTurnIndex(0);
    setMode('selection');
    clearEncounterFromStorage();
  };

  const updateInitiativeOrder = (newOrder, newCurrentIndex) => {
    setInitiativeOrder(newOrder);
    setCurrentTurnIndex(newCurrentIndex);
    saveEncounterToStorage(newOrder, newCurrentIndex);
  };

  if (mode === 'encounter') {
    return (
      <EncounterView
        initiativeOrder={initiativeOrder}
        currentTurnIndex={currentTurnIndex}
        onUpdateInitiativeOrder={updateInitiativeOrder}
        onReset={resetToSelection}
        characters={characters}
      />
    );
  }

  return (
    <ParticipantSelection
      characters={characters}
      selectedParticipants={selectedParticipants}
      onParticipantsChange={setSelectedParticipants}
      onRollInitiative={rollInitiative}
    />
  );
};

export default InitiativeTracker; 