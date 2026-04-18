import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import Leaderboard from './Leaderboard';
import './LandingPage.css';

const FLOATING_TILES = ['🎴', '♠', '♦', '♣', '♥', '🃏', '★', '◆'];

export default function LandingPage() {
  const navigate = useNavigate();
  const { startNewGame, loading } = useGame();

  const handleNewGame = async () => {
    try {
      await startNewGame();
      navigate('/game');
    } catch {
      // error handled by context
    }
  };

  return (
    <div className="landing">
      <div className="landing__bg-tiles">
        {FLOATING_TILES.map((tile, i) => (
          <motion.span
            key={i}
            className="landing__bg-tile"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.03, 0.08, 0.03],
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
            }}
            style={{
              left: `${10 + (i % 4) * 22}%`,
              top: `${15 + Math.floor(i / 4) * 40}%`,
              fontSize: `${4 + (i % 3) * 2}rem`,
            }}
          >
            {tile}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="landing__content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="landing__hero">
          <motion.div
            className="landing__logo"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <span className="landing__logo-tile">🎴</span>
          </motion.div>
          <h1 className="landing__title">Mahjong</h1>
          <p className="landing__subtitle">Bet Higher or Lower</p>

          <motion.button
            className="btn btn--primary btn--large landing__play-btn"
            onClick={handleNewGame}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <span className="landing__spinner" />
            ) : (
              'New Game'
            )}
          </motion.button>
        </div>

        <motion.div
          className="landing__leaderboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Leaderboard />
        </motion.div>
      </motion.div>
    </div>
  );
}
