import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../services/api';
import './Leaderboard.css';

const MEDAL_COLORS = ['#d4af37', '#c0c0c0', '#cd7f32'];

export default function Leaderboard({ compact = false }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="leaderboard__loading">Loading...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="leaderboard__empty">
        No scores yet. Be the first!
      </div>
    );
  }

  return (
    <div className={`leaderboard ${compact ? 'leaderboard--compact' : ''}`}>
      {!compact && <h2 className="leaderboard__title">Leaderboard</h2>}
      <div className="leaderboard__list">
        {entries.map((entry, i) => (
          <motion.div
            key={`${entry.playerName}-${entry.score}-${i}`}
            className="leaderboard__entry"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span
              className="leaderboard__rank"
              style={i < 3 ? { color: MEDAL_COLORS[i] } : {}}
            >
              {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
            </span>
            <span className="leaderboard__name">{entry.playerName}</span>
            <span className="leaderboard__score">{entry.score}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
