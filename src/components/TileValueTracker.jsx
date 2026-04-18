import { motion } from 'framer-motion';
import './TileValueTracker.css';

const TILE_DISPLAY = {
  dragon_red: { label: 'Red Dragon', type: 'dragon', face: 'red', color: '#c41e3a' },
  dragon_green: { label: 'Green Dragon', type: 'dragon', face: 'green', color: '#2d8a4e' },
  dragon_white: { label: 'White Dragon', type: 'dragon', face: 'white', color: '#6b7280' },
  wind_east: { label: 'East Wind', type: 'wind', face: 'east', color: '#7c3aed' },
  wind_south: { label: 'South Wind', type: 'wind', face: 'south', color: '#7c3aed' },
  wind_west: { label: 'West Wind', type: 'wind', face: 'west', color: '#7c3aed' },
  wind_north: { label: 'North Wind', type: 'wind', face: 'north', color: '#7c3aed' },
};

function MiniDragonIcon({ face, size = 22 }) {
  if (face === 'red') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 3c0 0-8 6-8 13a8 8 0 0016 0c0-7-8-13-8-13z" fill="#c41e3a" />
      <path d="M12 9c0 0-4 3-4 7a4 4 0 008 0c0-4-4-7-4-7z" fill="#ef4444" />
    </svg>
  );
  if (face === 'green') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 3L21 12L12 21L3 12Z" fill="#2d8a4e" />
      <path d="M12 7L17 12L12 17L7 12Z" fill="#4ade80" opacity="0.5" />
    </svg>
  );
  if (face === 'white') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#9ca3af" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" fill="#e5e7eb" opacity="0.2" />
    </svg>
  );
  return null;
}

function MiniWindIcon({ face, size = 22 }) {
  const arrows = {
    east: 'M5 12h14M16 8l4 4-4 4',
    south: 'M12 5v14M8 16l4 4 4-4',
    west: 'M19 12H5M8 8l-4 4 4 4',
    north: 'M12 19V5M8 8l4-4 4 4',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.3" />
      <path d={arrows[face]} stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function TileValueTracker({ tileValues }) {
  if (!tileValues) return null;

  return (
    <div className="tile-tracker">
      <h4 className="tile-tracker__title">Special Tile Values</h4>
      <div className="tile-tracker__grid">
        {Object.entries(tileValues).map(([key, value]) => {
          const info = TILE_DISPLAY[key];
          if (!info) return null;
          const danger = value <= 1 || value >= 9;
          return (
            <motion.div
              key={key}
              className={`tile-tracker__item ${danger ? 'tile-tracker__item--danger' : ''}`}
              animate={danger ? { scale: [1, 1.05, 1] } : {}}
              transition={danger ? { repeat: Infinity, duration: 1.5 } : {}}
            >
              <span className="tile-tracker__icon">
                {info.type === 'dragon'
                  ? <MiniDragonIcon face={info.face} />
                  : <MiniWindIcon face={info.face} />
                }
              </span>
              <div className="tile-tracker__info">
                <span className="tile-tracker__label">{info.label}</span>
                <div className="tile-tracker__bar-track">
                  <motion.div
                    className="tile-tracker__bar-fill"
                    style={{ backgroundColor: info.color }}
                    animate={{ width: `${(value / 10) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <span className="tile-tracker__value">{value}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
