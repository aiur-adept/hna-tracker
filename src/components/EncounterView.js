import React, { useState } from 'react';
import InitiativeList from './InitiativeList';
import AddParticipantModal from './AddParticipantModal';
import EncounterControls from './EncounterControls';
import DBService from '../DBService';

const EncounterView = ({ 
  initiativeOrder, 
  currentTurnIndex, 
  onUpdateInitiativeOrder, 
  onReset, 
  characters 
}) => {
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  const scrollToParticipant = (participantId) => {
    setTimeout(() => {
      const currentParticipantElement = document.querySelector(`[data-participant-id="${participantId}"]`);
      if (currentParticipantElement) {
        const elementRect = currentParticipantElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const scrollTop = window.pageYOffset + elementRect.top - (windowHeight / 2) + (elementRect.height / 2);
        
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo(0, scrollTop);
        }
      }
    }, 100);
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

  const passTurn = () => {
    const nextIndex = getNextActiveIndex();
    const nextParticipantId = initiativeOrder[nextIndex].id;
    onUpdateInitiativeOrder(initiativeOrder, nextIndex);
    scrollToParticipant(nextParticipantId);
  };

  const toggleInactive = (participantId) => {
    const updatedOrder = initiativeOrder.map(participant => 
      participant.id === participantId 
        ? { ...participant, status: participant.status === 'inactive' ? 'active' : 'inactive' }
        : participant
    );
    
    if (currentTurnIndex === updatedOrder.findIndex(p => p.id === participantId)) {
      const nextIndex = getNextActiveIndex();
      const nextParticipantId = updatedOrder[nextIndex].id;
      onUpdateInitiativeOrder(updatedOrder, nextIndex);
      scrollToParticipant(nextParticipantId);
    } else {
      onUpdateInitiativeOrder(updatedOrder, currentTurnIndex);
    }
  };

  const setDead = (participantId) => {
    const updatedOrder = initiativeOrder.map(participant => 
      participant.id === participantId 
        ? { 
            ...participant, 
            status: participant.status === 'dead' ? 'active' : 'dead',
            health: participant.status === 'dead' ? participant.health : 0
          }
        : participant
    );
    
    const updatedParticipant = updatedOrder.find(p => p.id === participantId);
    
    // Update persistent character health if this is a character (not a temporary participant)
    if (updatedParticipant && characters.find(c => c.id === participantId)) {
      DBService.updateCharacterHealth(participantId, updatedParticipant.health);
    }
    
    if (currentTurnIndex === updatedOrder.findIndex(p => p.id === participantId)) {
      const nextIndex = getNextActiveIndex();
      const nextParticipantId = updatedOrder[nextIndex].id;
      onUpdateInitiativeOrder(updatedOrder, nextIndex);
      scrollToParticipant(nextParticipantId);
    } else {
      onUpdateInitiativeOrder(updatedOrder, currentTurnIndex);
    }
  };

  const updateNotes = (participantId, notes) => {
    const updatedOrder = initiativeOrder.map(participant => 
      participant.id === participantId 
        ? { ...participant, notes }
        : participant
    );
    onUpdateInitiativeOrder(updatedOrder, currentTurnIndex);
  };

  const adjustHealth = (participantId, amount) => {
    const updatedOrder = initiativeOrder.map(participant => {
      if (participant.id === participantId) {
        const newHealth = Math.max(0, Math.min(20, participant.health + amount));
        const newStatus = newHealth === 0 ? 'dead' : participant.status;
        return { ...participant, health: newHealth, status: newStatus };
      }
      return participant;
    });
    
    const updatedParticipant = updatedOrder.find(p => p.id === participantId);
    
    // Update persistent character health if this is a character (not a temporary participant)
    if (updatedParticipant && characters.find(c => c.id === participantId)) {
      DBService.updateCharacterHealth(participantId, updatedParticipant.health);
    }
    
    if (updatedParticipant && updatedParticipant.health === 0 && updatedParticipant.status === 'dead') {
      const currentIndex = updatedOrder.findIndex(p => p.id === participantId);
      if (currentIndex === currentTurnIndex) {
        setTimeout(() => {
          const nextIndex = getNextActiveIndex();
          const nextParticipantId = updatedOrder[nextIndex].id;
          onUpdateInitiativeOrder(updatedOrder, nextIndex);
          scrollToParticipant(nextParticipantId);
        }, 0);
      }
    }
    
    onUpdateInitiativeOrder(updatedOrder, currentTurnIndex);
  };

  const addParticipantsToEncounter = (newParticipants) => {
    const participantsWithRolls = newParticipants.map(participant => ({
      ...participant,
      initiative: Math.floor(Math.random() * 20) + 1,
      health: participant.health || 9,
      status: 'active',
      notes: participant.notes || ''
    }));
    
    const updatedInitiativeOrder = [...initiativeOrder, ...participantsWithRolls]
      .sort((a, b) => b.initiative - a.initiative);
    
    const newCurrentIndex = updatedInitiativeOrder.findIndex(p => p.id === initiativeOrder[currentTurnIndex]?.id);
    const finalCurrentIndex = newCurrentIndex >= 0 ? newCurrentIndex : currentTurnIndex;
    
    onUpdateInitiativeOrder(updatedInitiativeOrder, finalCurrentIndex);
  };

  return (
    <div className="initiative-tracker">
      <div className="encounter-header">
        <h2>Initiative Order</h2>
      </div>
      
      <InitiativeList
        initiativeOrder={initiativeOrder}
        currentTurnIndex={currentTurnIndex}
        onToggleInactive={toggleInactive}
        onSetDead={setDead}
        onAdjustHealth={adjustHealth}
        onUpdateNotes={updateNotes}
      />

      <EncounterControls
        onAddParticipant={() => setShowAddParticipant(true)}
        onReset={onReset}
      />

      {showAddParticipant && (
        <AddParticipantModal
          characters={characters}
          initiativeOrder={initiativeOrder}
          onAddParticipants={addParticipantsToEncounter}
          onClose={() => setShowAddParticipant(false)}
        />
      )}

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
        NEXT
      </div>
    </div>
  );
};

export default EncounterView;