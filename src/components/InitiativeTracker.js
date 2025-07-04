import React, { useState, useEffect } from 'react';
import ParticipantSelection from './ParticipantSelection';
import EncounterView from './EncounterView';
import DBService from '../DBService';

const InitiativeTracker = () => {
  const [mode, setMode] = useState('selection');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
  const characters = DBService.getCharacterList();

  useEffect(() => {
    const savedEncounter = localStorage.getItem('hna-initiative-encounter');
    if (savedEncounter) {
      try {
        const encounterData = JSON.parse(savedEncounter);
        setInitiativeOrder(encounterData.initiativeOrder || []);
        setCurrentTurnIndex(encounterData.currentTurnIndex || 0);
        setMode('encounter');
      } catch (error) {
        console.error('Failed to parse saved encounter data:', error);
        localStorage.removeItem('hna-initiative-encounter');
      }
    }
  }, []);

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
      health: 9,
      status: 'active',
      notes: ''
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