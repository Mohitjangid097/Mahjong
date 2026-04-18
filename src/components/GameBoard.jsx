import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import HandDisplay from './HandDisplay';
import BetResult from './BetResult';
import TileValueTracker from './TileValueTracker';
import RoundHistory from './RoundHistory';
import HowToPlay from './HowToPlay';
import GameOver from './GameOver';
import './GameBoard.css';

export default function GameBoard() {
  const navigate = useNavigate();
  const { gameState, loading, roundHistory, placeBet, startNewGame, clearGame } = useGame();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  if (!gameState) {
    navigate('/');
    return null;
  }

  const handleBet = async (bet) => {
    if (loading) return;
    await placeBet(bet);
  };

  const handleExit = () => {
    clearGame();
    navigate('/');
  };

  const handlePlayAgain = async () => {
    await startNewGame();
  };

  return (
    <div className="game-board">
      <header className="game-board__header">
        <div className="game-board__header-left">
          <button className="btn btn--ghost btn--small" onClick={handleExit}>
            ← Home
          </button>
          <button
            className="btn btn--ghost btn--small game-board__help-btn"
            onClick={() => setShowHowToPlay(true)}
            title="How to Play"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            How to Play
          </button>
        </div>

        <div className="game-board__stats">
          <div className="game-board__stat">
            <span className="game-board__stat-label">Score</span>
            <motion.span
              className="game-board__stat-value game-board__stat-value--score"
              key={gameState.score}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {gameState.score}
            </motion.span>
          </div>
          <div className="game-board__stat">
            <span className="game-board__stat-label">Streak</span>
            <span className="game-board__stat-value">{gameState.streak}×</span>
          </div>
          <div className="game-board__stat">
            <span className="game-board__stat-label">Round</span>
            <span className="game-board__stat-value">{gameState.roundNumber}</span>
          </div>
        </div>

        <div className="game-board__pile-info">
          <div className="game-board__pile">
            <span className="game-board__pile-count">{gameState.drawPileCount}</span>
            <span className="game-board__pile-label">Draw</span>
          </div>
          <div className="game-board__pile">
            <span className="game-board__pile-count">{gameState.discardPileCount}</span>
            <span className="game-board__pile-label">Discard</span>
          </div>
          {gameState.reshuffleCount > 0 && (
            <div className="game-board__pile game-board__pile--warning">
              <span className="game-board__pile-count">{gameState.reshuffleCount}/3</span>
              <span className="game-board__pile-label">Reshuffles</span>
            </div>
          )}
        </div>
      </header>

      <aside className="game-board__history">
        <RoundHistory history={roundHistory} />
      </aside>

      <main className="game-board__main">
        <BetResult result={gameState.lastBetResult} />

        {gameState.previousHand && (
          <div className="game-board__prev-hand">
            <HandDisplay
              tiles={gameState.previousHand}
              value={gameState.previousHandValue}
              label="Previous Hand"
              small
            />
          </div>
        )}

        <div className="game-board__current">
          <HandDisplay
            tiles={gameState.currentHand}
            value={gameState.currentHandValue}
            label="Current Hand"
          />
        </div>

        {!gameState.isGameOver && (
          <motion.div
            className="game-board__betting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="game-board__bet-prompt">
              Will the next hand be higher or lower than <strong>{gameState.currentHandValue}</strong>?
            </p>
            <div className="game-board__bet-buttons">
              <motion.button
                className="btn btn--bet btn--higher"
                onClick={() => handleBet('higher')}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn__bet-arrow">▲</span>
                Higher
              </motion.button>
              <motion.button
                className="btn btn--bet btn--lower"
                onClick={() => handleBet('lower')}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn__bet-arrow">▼</span>
                Lower
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>

      <aside className="game-board__sidebar">
        <TileValueTracker tileValues={gameState.tileValues} />
      </aside>

      {gameState.isGameOver && (
        <GameOver
          score={gameState.score}
          reason={gameState.gameOverReason}
          roundNumber={gameState.roundNumber}
          onPlayAgain={handlePlayAgain}
          onHome={handleExit}
        />
      )}

      <HowToPlay isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
    </div>
  );
}
