import { describe, it, expect, beforeEach } from 'vitest';
import { createGame, getGame, placeBet } from './gameEngine';

describe('createGame', () => {
  let game;
  beforeEach(() => { game = createGame(); });

  it('returns a game state with a valid id', () => {
    expect(game.id).toBeDefined();
    expect(typeof game.id).toBe('string');
    expect(game.id.length).toBeGreaterThan(0);
  });

  it('deals a hand of 5 tiles', () => {
    expect(game.currentHand).toHaveLength(5);
  });

  it('each tile has required properties', () => {
    game.currentHand.forEach(tile => {
      expect(tile).toHaveProperty('id');
      expect(tile).toHaveProperty('type');
      expect(tile).toHaveProperty('suit');
      expect(tile).toHaveProperty('name');
      expect(tile).toHaveProperty('face');
      expect(tile).toHaveProperty('value');
    });
  });

  it('starts at round 1 with score 0 and streak 0', () => {
    expect(game.roundNumber).toBe(1);
    expect(game.score).toBe(0);
    expect(game.streak).toBe(0);
  });

  it('has no previous hand initially', () => {
    expect(game.previousHand).toBeNull();
    expect(game.previousHandValue).toBeNull();
  });

  it('is not game over at start', () => {
    expect(game.isGameOver).toBe(false);
    expect(game.gameOverReason).toBeNull();
  });

  it('initializes all special tile values to 5', () => {
    Object.values(game.tileValues).forEach(val => {
      expect(val).toBe(5);
    });
  });

  it('has 7 special tile value entries (3 dragons + 4 winds)', () => {
    expect(Object.keys(game.tileValues)).toHaveLength(7);
  });

  it('calculates currentHandValue as a positive number', () => {
    expect(game.currentHandValue).toBeGreaterThan(0);
    expect(typeof game.currentHandValue).toBe('number');
  });

  it('has draw pile count less than 136 (5 tiles drawn)', () => {
    expect(game.drawPileCount).toBe(136 - 5);
  });

  it('starts with empty discard pile', () => {
    expect(game.discardPileCount).toBe(0);
  });
});

describe('getGame', () => {
  it('retrieves a created game by id', () => {
    const game = createGame();
    const retrieved = getGame(game.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved.id).toBe(game.id);
  });

  it('returns null for unknown id', () => {
    expect(getGame('non-existent-id')).toBeNull();
  });
});

describe('placeBet', () => {
  let game;
  beforeEach(() => { game = createGame(); });

  it('returns updated game state after a bet', () => {
    const result = placeBet(game.id, 'higher');
    expect(result.roundNumber).toBe(2);
    expect(result.previousHand).not.toBeNull();
    expect(result.previousHandValue).toBe(game.currentHandValue);
  });

  it('deals a new hand of 5 tiles', () => {
    const result = placeBet(game.id, 'higher');
    expect(result.currentHand).toHaveLength(5);
  });

  it('moves old hand to previous', () => {
    const oldHandValue = game.currentHandValue;
    const result = placeBet(game.id, 'lower');
    expect(result.previousHandValue).toBe(oldHandValue);
  });

  it('sets lastBetResult with bet direction', () => {
    const result = placeBet(game.id, 'higher');
    expect(result.lastBetResult).toBeDefined();
    expect(result.lastBetResult.bet).toBe('higher');
    expect(typeof result.lastBetResult.won).toBe('boolean');
  });

  it('increments streak on a win', () => {
    const result = placeBet(game.id, 'higher');
    if (result.lastBetResult.won) {
      expect(result.streak).toBe(1);
      expect(result.score).toBeGreaterThan(0);
    } else {
      expect(result.streak).toBe(0);
    }
  });

  it('resets streak to 0 on a loss', () => {
    const result = placeBet(game.id, 'higher');
    if (!result.lastBetResult.won) {
      expect(result.streak).toBe(0);
      expect(result.lastBetResult.pointsEarned).toBe(0);
    }
  });

  it('caps multiplier at 5', () => {
    let state = game;
    for (let i = 0; i < 10; i++) {
      state = placeBet(state.id, 'higher');
      if (state.isGameOver) break;
    }
    if (state.lastBetResult && state.lastBetResult.won) {
      expect(state.lastBetResult.multiplier).toBeLessThanOrEqual(5);
    }
  });

  it('increases discard pile count after bet', () => {
    const result = placeBet(game.id, 'higher');
    expect(result.discardPileCount).toBeGreaterThan(0);
  });

  it('throws on invalid bet value', () => {
    expect(() => placeBet(game.id, 'sideways')).toThrow('Bet must be "higher" or "lower"');
  });

  it('throws on non-existent game', () => {
    expect(() => placeBet('fake-id', 'higher')).toThrow('Game not found');
  });

  it('throws when betting on a finished game', () => {
    let state = game;
    while (!state.isGameOver) {
      state = placeBet(state.id, 'higher');
    }
    expect(() => placeBet(state.id, 'higher')).toThrow('Game is already over');
  });
});

describe('scoring mechanics', () => {
  it('score only increases on wins', () => {
    const game = createGame();
    let state = game;
    let previousScore = 0;

    for (let i = 0; i < 5; i++) {
      state = placeBet(state.id, 'higher');
      if (state.isGameOver) break;

      if (state.lastBetResult.won) {
        expect(state.score).toBeGreaterThan(previousScore);
      } else {
        expect(state.score).toBe(previousScore);
      }
      previousScore = state.score;
    }
  });

  it('points equal handValue × multiplier on a win', () => {
    const game = createGame();
    const result = placeBet(game.id, 'higher');
    if (result.lastBetResult.won) {
      const expected = result.currentHandValue * result.lastBetResult.multiplier;
      expect(result.lastBetResult.pointsEarned).toBe(expected);
    }
  });
});

describe('game over conditions', () => {
  it('game eventually ends after many rounds', () => {
    const game = createGame();
    let state = game;
    let rounds = 0;

    while (!state.isGameOver && rounds < 500) {
      state = placeBet(state.id, 'higher');
      rounds++;
    }

    expect(state.isGameOver).toBe(true);
    expect(state.gameOverReason).toBeDefined();
    expect(typeof state.gameOverReason).toBe('string');
  });
});
