import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar.js';
import Home from './pages/home.js';
import Play from './pages/play_page.js';
import Practice from './pages/practice.js';
import PlayVsStockfish from './bots/playComputer.js';
// import SaveVsStockfish from './bots/playComputerSave.js';

function App() {
  return (
    <Router>
      <Sidebar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/play" element={<Play/>}/>
        <Route path="/bots" element={<PlayVsStockfish/>}/>
        <Route path="/practice" element={<Practice/>} />
        {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
        {/* <Route path="/learn" element={<Learn/>} /> */}
        {/* <Route path="/social" element={<Social />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
