import { motion } from 'framer-motion';
import Tile from './Tile';
import './HandDisplay.css';

export default function HandDisplay({ tiles, value, label, small = false }) {
  if (!tiles) return null;

  return (
    <motion.div
      className={`hand-display ${small ? 'hand-display--small' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {label && <h3 className="hand-display__label">{label}</h3>}
      <div className="hand-display__tiles">
        {tiles.map((tile, i) => (
          <Tile key={tile.id} tile={tile} index={i} small={small} />
        ))}
      </div>
      <div className={`hand-display__value ${small ? 'hand-display__value--small' : ''}`}>
        Total: <span className="hand-display__value-num">{value}</span>
      </div>
    </motion.div>
  );
}
