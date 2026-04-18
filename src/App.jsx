import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import LandingPage from './components/LandingPage';
import GameBoard from './components/GameBoard';
import './App.css';

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game" element={<GameBoard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}
