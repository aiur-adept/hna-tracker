const initial = {
  spells: [
  { id: 1, name: 'protego', check: 9, stat: 'fight', description: 'disarming protecting' },
  { id: 2, name: 'mosqwito', check: 10, stat: 'brains', description: 'transfigure to mosquito' },
  { id: 3, name: 'episki', check: 10, stat: 'charm', description: 'healing' },
  { id: 4, name: 'feugito', check: 9, stat: 'fight', description: 'fireball' },
  { id: 5, name: 'leivosa', check: 11, stat: 'brawn', description: 'levitation' }
  ],
  characters: [
    { id: 1, name: 'Boots', health: 9, stats: { grit: 10, fight: 10, flight: 10, brains: 10, brawn: 10, charm: 10 } },
    { id: 2, name: 'Juniper', health: 9, stats: { grit: 10, fight: 10, flight: 10, brains: 10, brawn: 10, charm: 10 } },
    { id: 3, name: 'Maeve', health: 9, stats: { grit: 10, fight: 10, flight: 10, brains: 10, brawn: 10, charm: 10 } },
    { id: 4, name: 'Naya', health: 9, stats: { grit: 10, fight: 10, flight: 10, brains: 10, brawn: 10, charm: 10 } }
  ],
  monsters: [
    { id: 1, name: 'Goblin', health: 6, stats: { grit: 4, fight: 6, flight: 8, brains: 4, brawn: 12, charm: 20 } },
    { id: 3, name: 'Goblin Captain', health: 20, stats: { grit: 4, fight: 6, flight: 8, brains: 4, brawn: 12, charm: 20 } }
  ]
};

const DBService = {

  getSpellList: () => {
    const storedSpells = localStorage.getItem('spells');
    if (storedSpells) {
      return JSON.parse(storedSpells);
    }
    return initial.spells;
  },

  saveSpellList: (spells) => {
    localStorage.setItem('spells', JSON.stringify(spells));
  },

  getCharacterList: () => {
    const storedCharacters = localStorage.getItem('characters');
    if (storedCharacters) {
      const characters = JSON.parse(storedCharacters);
      // Ensure all characters have stats
      const charactersWithStats = characters.map(character => ({
        ...character,
        stats: character.stats || { grit: 10, fight: 10, flight: 10, brains: 10, brawn: 10, charm: 10 }
      }));
      return charactersWithStats;
    }
    return initial.characters;
  },

  saveCharacterList: (characters) => {
    localStorage.setItem('characters', JSON.stringify(characters));
    localStorage.setItem('characters-timestamp', Date.now().toString());
  },

  updateCharacterHealth: (characterId, health) => {
    const characters = DBService.getCharacterList();
    const updatedCharacters = characters.map(character => 
      character.id === characterId 
        ? { ...character, health: Math.max(0, Math.min(20, health)) }
        : character
    );
    DBService.saveCharacterList(updatedCharacters);
  },

  getMonsterList: () => {
    const storedMonsters = localStorage.getItem('monsters');
    if (storedMonsters) {
      const monsters = JSON.parse(storedMonsters);
      const monstersWithStats = monsters.map(monster => ({
        ...monster,
        stats: monster.stats || { grit: 10, fight: 10, flight: 10, brains: 10, brawn: 10, charm: 10 }
      }));
      return monstersWithStats;
    }
    return initial.monsters;
  },

  saveMonsterList: (monsters) => {
    localStorage.setItem('monsters', JSON.stringify(monsters));
    localStorage.setItem('monsters-timestamp', Date.now().toString());
  },

};

export default DBService; 