import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../services/api';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roundHistory, setRoundHistory] = useState([]);

  const startNewGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRoundHistory([]);
    try {
      const state = await api.createGame();
      setGameState(state);
      return state;
    } catch (err) {
      setError(err.message || 'Failed to create game');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const placeBet = useCallback(async (bet) => {
    if (!gameState) return;
    setLoading(true);
    setError(null);
    try {
      const state = await api.placeBet(gameState.id, bet);

      if (state.lastBetResult) {
        setRoundHistory(prev => [...prev, {
          id: prev.length + 1,
          round: prev.length + 1,
          hand: state.currentHand,
          handValue: state.currentHandValue,
          previousValue: state.previousHandValue,
          bet: state.lastBetResult.bet,
          won: state.lastBetResult.won,
          points: state.lastBetResult.pointsEarned,
          multiplier: state.lastBetResult.multiplier,
        }]);
      }

      setGameState(state);
      return state;
    } catch (err) {
      setError(err.message || 'Failed to place bet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  const clearGame = useCallback(() => {
    setGameState(null);
    setError(null);
    setRoundHistory([]);
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      loading,
      error,
      roundHistory,
      startNewGame,
      placeBet,
      clearGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
