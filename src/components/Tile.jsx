import { motion } from 'framer-motion';
import './Tile.css';

const SUIT_COLORS = {
  bamboo: '#2d8a4e',
  characters: '#c41e3a',
  dots: '#2563eb',
  dragon: '#d4af37',
  wind: '#7c3aed',
};

const SUIT_BG = {
  bamboo: 'rgba(45, 138, 78, 0.05)',
  characters: 'rgba(196, 30, 58, 0.05)',
  dots: 'rgba(37, 99, 235, 0.05)',
  dragon: 'rgba(212, 175, 55, 0.05)',
  wind: 'rgba(124, 58, 237, 0.05)',
};

const ICON_POSITIONS = {
  1: [[30, 40]],
  2: [[30, 20], [30, 60]],
  3: [[30, 16], [30, 40], [30, 64]],
  4: [[20, 22], [40, 22], [20, 58], [40, 58]],
  5: [[20, 18], [40, 18], [30, 40], [20, 62], [40, 62]],
  6: [[20, 16], [40, 16], [20, 40], [40, 40], [20, 64], [40, 64]],
  7: [[20, 14], [40, 14], [30, 28], [20, 44], [40, 44], [20, 66], [40, 66]],
  8: [[20, 12], [40, 12], [20, 30], [40, 30], [20, 50], [40, 50], [20, 68], [40, 68]],
  9: [[16, 14], [30, 14], [44, 14], [16, 40], [30, 40], [44, 40], [16, 66], [30, 66], [44, 66]],
};

function BambooMini({ x, y, color }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-2" y="-7" width="4" height="14" rx="2" fill={color} />
      <ellipse cx="0" cy="-3" rx="4" ry="1.2" fill={color} opacity="0.45" />
      <ellipse cx="0" cy="3" rx="4" ry="1.2" fill={color} opacity="0.45" />
    </g>
  );
}

function DotsMini({ x, y, color }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r="6" fill={color} opacity="0.12" />
      <circle r="4.2" fill={color} />
      <circle r="1.5" fill="#fff" opacity="0.35" />
    </g>
  );
}

function CharMini({ x, y, color }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-5" y="-6" width="10" height="12" rx="2" fill={color} opacity="0.1" />
      <rect x="-4.5" y="-5.5" width="9" height="11" rx="1.5" stroke={color} strokeWidth="0.8" fill="none" />
      <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="0" y1="-3" x2="0" y2="3" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

const SUIT_RENDERERS = { bamboo: BambooMini, dots: DotsMini, characters: CharMini };

function DragonFace({ face }) {
  if (face === 'red') {
    return (
      <svg className="tile__special-svg" viewBox="0 0 60 60">
        <path d="M30 6c0 0-18 14-18 30a18 18 0 0036 0c0-16-18-30-18-30z" fill="#c41e3a" opacity="0.85" />
        <path d="M30 18c0 0-9 8-9 16a9 9 0 0018 0c0-8-9-16-9-16z" fill="#ef4444" />
        <path d="M30 28c0 0-4 4-4 7a4 4 0 008 0c0-3-4-7-4-7z" fill="#fca5a5" opacity="0.7" />
      </svg>
    );
  }
  if (face === 'green') {
    return (
      <svg className="tile__special-svg" viewBox="0 0 60 60">
        <path d="M30 8L52 30L30 52L8 30Z" fill="#2d8a4e" opacity="0.85" />
        <path d="M30 16L44 30L30 44L16 30Z" fill="#4ade80" opacity="0.45" />
        <path d="M30 24L36 30L30 36L24 30Z" fill="#86efac" opacity="0.55" />
      </svg>
    );
  }
  if (face === 'white') {
    return (
      <svg className="tile__special-svg" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="22" fill="none" stroke="#9ca3af" strokeWidth="2.5" />
        <circle cx="30" cy="30" r="16" fill="#e5e7eb" opacity="0.12" />
        <circle cx="30" cy="30" r="10" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
        <circle cx="25" cy="25" r="4" fill="#fff" opacity="0.25" />
      </svg>
    );
  }
  return null;
}

function WindFace({ face }) {
  const arrows = {
    east: 'M12 30h36M42 22l8 8-8 8',
    south: 'M30 12v36M22 42l8 8 8-8',
    west: 'M48 30H12M18 22l-8 8 8 8',
    north: 'M30 48V12M22 18l8-8 8 8',
  };
  const labels = { east: 'E', south: 'S', west: 'W', north: 'N' };

  return (
    <svg className="tile__special-svg" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="25" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.2" />
      <path d={arrows[face]} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="30" y="30" textAnchor="middle" dominantBaseline="central" fill="#7c3aed" fontSize="8" fontWeight="800" opacity="0.4">
        {labels[face]}
      </text>
    </svg>
  );
}

export default function Tile({ tile, index = 0, small = false }) {
  const color = SUIT_COLORS[tile.suit] || '#666';

  const renderFace = () => {
    if (tile.type === 'number') {
      const positions = ICON_POSITIONS[tile.face] || [];
      const MiniIcon = SUIT_RENDERERS[tile.suit];
      if (!MiniIcon) return null;
      return (
        <svg className="tile__card-svg" viewBox="0 0 60 80">
          {positions.map(([x, y], i) => (
            <MiniIcon key={i} x={x} y={y} color={color} />
          ))}
        </svg>
      );
    }
    if (tile.type === 'dragon') return <DragonFace face={tile.face} />;
    if (tile.type === 'wind') return <WindFace face={tile.face} />;
    return null;
  };

  return (
    <motion.div
      className={`tile ${small ? 'tile--small' : ''}`}
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={small ? {} : { y: -8, boxShadow: '0 12px 28px rgba(0,0,0,0.4)' }}
    >
      <div className="tile__inner" style={{ background: `linear-gradient(145deg, #faf6eb, #e8e0cc)` }}>
        <div className="tile__inner-tint" style={{ backgroundColor: SUIT_BG[tile.suit] }} />
        {tile.type === 'number' && (
          <span className="tile__corner-num" style={{ color }}>{tile.face}</span>
        )}
        <div className="tile__face">
          {renderFace()}
        </div>
        <div className="tile__value-badge" style={{ backgroundColor: color }}>
          {tile.value}
        </div>
        <div className="tile__label">{tile.name}</div>
      </div>
    </motion.div>
  );
}
