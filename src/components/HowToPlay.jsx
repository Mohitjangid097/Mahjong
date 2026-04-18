import { motion, AnimatePresence } from 'framer-motion';
import './HowToPlay.css';

export default function HowToPlay({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="how-to-play__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="how-to-play__modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="how-to-play__header">
              <h2>How to Play</h2>
              <button className="how-to-play__close" onClick={onClose}>✕</button>
            </div>

            <div className="how-to-play__content">
              <section className="how-to-play__section">
                <h3>Objective</h3>
                <p>Score as many points as possible by correctly guessing whether the next hand of tiles will have a <strong>higher</strong> or <strong>lower</strong> total value.</p>
              </section>

              <section className="how-to-play__section">
                <h3>Gameplay</h3>
                <ol>
                  <li>You are dealt <strong>5 tiles</strong>. Each tile has a point value.</li>
                  <li>Your hand total is the <strong>sum of all tile values</strong>.</li>
                  <li>Guess if the next hand will be <span className="how-to-play__higher">Higher ▲</span> or <span className="how-to-play__lower">Lower ▼</span>.</li>
                  <li>A new hand is drawn and compared to your previous total.</li>
                  <li>Ties count as a <strong>win</strong> for either bet!</li>
                </ol>
              </section>

              <section className="how-to-play__section">
                <h3>Scoring</h3>
                <ul>
                  <li><strong>Points</strong> = Hand Value x Streak Multiplier</li>
                  <li>Each correct guess increases your <strong>streak</strong> (max 5x)</li>
                  <li>A wrong guess <strong>resets your streak</strong> to 0</li>
                </ul>
              </section>

              <section className="how-to-play__section">
                <h3>Tile Types</h3>
                <div className="how-to-play__tiles-grid">
                  <div className="how-to-play__tile-type">
                    <span className="how-to-play__tile-dot" style={{ background: '#2d8a4e' }} />
                    <div>
                      <strong>Bamboo</strong>
                      <p>Number tiles (1-9), green suit</p>
                    </div>
                  </div>
                  <div className="how-to-play__tile-type">
                    <span className="how-to-play__tile-dot" style={{ background: '#2563eb' }} />
                    <div>
                      <strong>Dots</strong>
                      <p>Number tiles (1-9), blue suit</p>
                    </div>
                  </div>
                  <div className="how-to-play__tile-type">
                    <span className="how-to-play__tile-dot" style={{ background: '#c41e3a' }} />
                    <div>
                      <strong>Characters</strong>
                      <p>Number tiles (1-9), red suit</p>
                    </div>
                  </div>
                  <div className="how-to-play__tile-type">
                    <span className="how-to-play__tile-dot" style={{ background: '#d4af37' }} />
                    <div>
                      <strong>Dragons</strong>
                      <p>Red, Green, White - dynamic values</p>
                    </div>
                  </div>
                  <div className="how-to-play__tile-type">
                    <span className="how-to-play__tile-dot" style={{ background: '#7c3aed' }} />
                    <div>
                      <strong>Winds</strong>
                      <p>East, South, West, North - dynamic values</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="how-to-play__section">
                <h3>Special Tiles</h3>
                <p>Dragon and Wind tiles have <strong>dynamic values</strong> that shift each round:</p>
                <ul>
                  <li>When you <span className="how-to-play__higher">win</span>, special tile values in your hand go <strong>up</strong></li>
                  <li>When you <span className="how-to-play__lower">lose</span>, special tile values in your hand go <strong>down</strong></li>
                </ul>
                <p>Track these in the right sidebar during gameplay.</p>
              </section>

              <section className="how-to-play__section">
                <h3>Game Over</h3>
                <p>The game ends when:</p>
                <ul>
                  <li>Any special tile value drops to <strong>0</strong> or reaches <strong>10</strong></li>
                  <li>The draw pile runs out <strong>3 times</strong></li>
                </ul>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
