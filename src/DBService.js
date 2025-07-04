const initial = {
  spells: [
  { id: 1, name: 'protego', check: 9, stat: 'fight', description: 'disarming protecting' },
  { id: 2, name: 'mosqwito', check: 10, stat: 'brains', description: 'transfigure to mosquito' },
  { id: 3, name: 'episki', check: 10, stat: 'charm', description: 'healing' },
  { id: 4, name: 'feugito', check: 9, stat: 'fight', description: 'fireball' },
  { id: 5, name: 'leivosa', check: 11, stat: 'brawn', description: 'levitation' }
  ],
  characters: [
    { id: 1, name: 'Harry Potter' },
    { id: 2, name: 'Hermione Granger' },
    { id: 3, name: 'Ron Weasley' }
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
      return JSON.parse(storedCharacters);
    }
    return initial.characters;
  },

  saveCharacterList: (characters) => {
    localStorage.setItem('characters', JSON.stringify(characters));
  },

};

export default DBService; 