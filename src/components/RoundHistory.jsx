import { motion, AnimatePresence } from 'framer-motion';
import './RoundHistory.css';

const SUIT_COLORS = {
  bamboo: '#2d8a4e',
  characters: '#c41e3a',
  dots: '#2563eb',
  dragon: '#d4af37',
  wind: '#7c3aed',
};

function MiniTile({ tile }) {
  const color = SUIT_COLORS[tile.suit] || '#666';
  const label = tile.type === 'number'
    ? tile.face
    : tile.name.split(' ').map(w => w[0]).join('');

  return (
    <span
      className="round-history__mini-tile"
      style={{ borderColor: color }}
      title={`${tile.name} (value: ${tile.value})`}
    >
      <span style={{ color }}>{label}</span>
    </span>
  );
}

export default function RoundHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="round-history">
        <h4 className="round-history__title">Round History</h4>
        <p className="round-history__empty">Play a round to see your results here</p>
      </div>
    );
  }

  return (
    <div className="round-history">
      <h4 className="round-history__title">Round History</h4>
      <div className="round-history__list">
        <AnimatePresence initial={false}>
          {[...history].reverse().map((entry, idx) => (
            <motion.div
              key={entry.id}
              className={`round-history__entry ${entry.won ? 'round-history__entry--won' : 'round-history__entry--lost'}`}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              transition={{ duration: 0.35, delay: idx === 0 ? 0.2 : 0 }}
            >
              <div className="round-history__entry-header">
                <span className="round-history__round">Round {entry.round}</span>
                <span className={`round-history__badge ${entry.won ? 'round-history__badge--won' : 'round-history__badge--lost'}`}>
                  {entry.won ? '✓ Won' : '✗ Lost'}
                </span>
              </div>

              <div className="round-history__tiles">
                {entry.hand.map((tile) => (
                  <MiniTile key={tile.id} tile={tile} />
                ))}
              </div>

              <div className="round-history__comparison">
                <span className="round-history__hand-value">{entry.handValue}</span>
                <span className="round-history__vs">vs</span>
                <span className="round-history__prev-value">{entry.previousValue}</span>
                <span className={`round-history__arrow ${entry.bet === 'higher' ? 'round-history__arrow--up' : 'round-history__arrow--down'}`}>
                  {entry.bet === 'higher' ? '▲' : '▼'}
                </span>
              </div>

              {entry.won && entry.points > 0 && (
                <div className="round-history__points">
                  +{entry.points} pts
                  {entry.multiplier > 1 && <span className="round-history__multiplier">×{entry.multiplier}</span>}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
