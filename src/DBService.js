const initial = {
  spells: [
  { id: 1, name: 'protego', check: 9, stat: 'fight', description: 'disarming protecting' },
  { id: 2, name: 'mosqwito', check: 10, stat: 'brains', description: 'transfigure to mosquito' },
  { id: 3, name: 'episki', check: 10, stat: 'charm', description: 'healing' },
  { id: 4, name: 'feugito', check: 9, stat: 'fight', description: 'fireball' },
  { id: 5, name: 'leivosa', check: 11, stat: 'brawn', description: 'levitation' }
  ],
  characters: [
    { id: 1, name: 'Boots', health: 9, stats: { grit: 9, fight: 9, flight: 9, brains: 9, brawn: 9, charm: 9 } },
    { id: 2, name: 'Juniper', health: 9, stats: { grit: 9, fight: 9, flight: 9, brains: 9, brawn: 9, charm: 9 } },
    { id: 3, name: 'Maeve', health: 9, stats: { grit: 9, fight: 9, flight: 9, brains: 9, brawn: 9, charm: 9 } },
    { id: 4, name: 'Naya', health: 9, stats: { grit: 9, fight: 9, flight: 9, brains: 9, brawn: 9, charm: 9 } }
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
        stats: character.stats || { grit: 9, fight: 9, flight: 9, brains: 9, brawn: 9, charm: 9 }
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

};

export default DBService; 