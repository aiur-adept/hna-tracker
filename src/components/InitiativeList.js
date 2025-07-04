import React from 'react';
import InitiativeItem from './InitiativeItem';

const InitiativeList = ({ 
  initiativeOrder, 
  currentTurnIndex, 
  onToggleInactive, 
  onSetDead, 
  onAdjustHealth, 
  onUpdateNotes 
}) => {
  return (
    <div className="initiative-list">
      {initiativeOrder.map((participant, index) => (
        <InitiativeItem
          key={participant.id}
          participant={participant}
          isCurrentTurn={index === currentTurnIndex}
          onToggleInactive={onToggleInactive}
          onSetDead={onSetDead}
          onAdjustHealth={onAdjustHealth}
          onUpdateNotes={onUpdateNotes}
        />
      ))}
    </div>
  );
};

export default InitiativeList; 