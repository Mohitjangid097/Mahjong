import { motion, AnimatePresence } from 'framer-motion';
import './BetResult.css';

export default function BetResult({ result }) {
  if (!result) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${result.won}-${result.pointsEarned}`}
        className={`bet-result ${result.won ? 'bet-result--won' : 'bet-result--lost'}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span className="bet-result__icon">{result.won ? '✓' : '✗'}</span>
        <span className="bet-result__text">
          {result.won
            ? `+${result.pointsEarned} pts (×${result.multiplier})`
            : 'Wrong bet! Streak reset'
          }
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
