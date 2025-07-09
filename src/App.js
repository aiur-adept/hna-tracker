import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Nav from './Nav';


import './App.css';
import SpellList from './SpellList';
import CharacterList from './CharacterList';
import MonsterList from './MonsterList';
import Initiative from './Initiative';

function App() {

  return (
    <Router>
      <Nav />
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Navigate to="/spell-list" replace />} />
            <Route path="/spell-list" element={<SpellList />} />
            <Route path="/character-list" element={<CharacterList />} />
            <Route path="/monster-list" element={<MonsterList />} />
            <Route path="/initiative" element={<Initiative />} />
          </Routes>
        </header>
    </Router>
  );
}

export default App;
