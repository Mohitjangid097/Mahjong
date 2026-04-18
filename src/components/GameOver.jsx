import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitScore } from '../services/api';
import './GameOver.css';

export default function GameOver({ score, reason, roundNumber, onPlayAgain, onHome }) {
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rank, setRank] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      const result = await submitScore(playerName.trim(), score);
      setRank(result.rank);
      setSubmitted(true);
    } catch {
      alert('Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="game-over-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="game-over"
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      >
        <div className="game-over__header">
          <h2 className="game-over__title">Game Over</h2>
          <p className="game-over__reason">{reason}</p>
        </div>

        <div className="game-over__stats">
          <div className="game-over__stat">
            <span className="game-over__stat-value">{score}</span>
            <span className="game-over__stat-label">Final Score</span>
          </div>
          <div className="game-over__stat">
            <span className="game-over__stat-value">{roundNumber}</span>
            <span className="game-over__stat-label">Rounds Played</span>
          </div>
        </div>

        {!submitted ? (
          <form className="game-over__form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="game-over__input"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <button
              type="submit"
              className="game-over__submit-btn"
              disabled={!playerName.trim() || submitting}
            >
              {submitting ? 'Saving...' : 'Submit Score'}
            </button>
          </form>
        ) : (
          <motion.div
            className="game-over__submitted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {rank
              ? <p className="game-over__rank">You ranked <strong>#{rank}</strong> on the leaderboard!</p>
              : <p className="game-over__rank">Score submitted!</p>
            }
          </motion.div>
        )}

        <div className="game-over__actions">
          <button className="btn btn--primary" onClick={onPlayAgain}>Play Again</button>
          <button className="btn btn--ghost" onClick={onHome}>Home</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
