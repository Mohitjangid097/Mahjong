import {
  createTileDefinitions, shuffle,
  getTileValue, calculateHandValue,
} from './tileService';
import {
  HAND_SIZE, BASE_SPECIAL_VALUE,
  DRAGONS, WINDS,
  MIN_TILE_VALUE, MAX_TILE_VALUE, MAX_RESHUFFLES,
} from './constants';

const games = new Map();

function initTileValues() {
  const values = {};
  for (const d of DRAGONS) values[`dragon_${d}`] = BASE_SPECIAL_VALUE;
  for (const w of WINDS) values[`wind_${w}`] = BASE_SPECIAL_VALUE;
  return values;
}

function formatTileKey(key) {
  return key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function sanitizeState(game) {
  return {
    id: game.id,
    currentHand: game.currentHand.map(t => ({
      id: t.id,
      type: t.type,
      suit: t.suit,
      name: t.name,
      face: t.face,
      symbol: t.symbol,
      valueKey: t.valueKey,
      value: getTileValue(t, game.tileValues),
    })),
    currentHandValue: game.currentHandValue,
    previousHand: game.previousHand
      ? game.previousHand.map(t => ({
        id: t.id,
        type: t.type,
        suit: t.suit,
        name: t.name,
        face: t.face,
        symbol: t.symbol,
        valueKey: t.valueKey,
        value: getTileValue(t, game.tileValues),
      }))
      : null,
    previousHandValue: game.previousHandValue,
    score: game.score,
    streak: game.streak,
    drawPileCount: game.drawPile.length,
    discardPileCount: game.discardPile.length,
    reshuffleCount: game.reshuffleCount,
    isGameOver: game.isGameOver,
    gameOverReason: game.gameOverReason,
    lastBetResult: game.lastBetResult,
    tileValues: { ...game.tileValues },
    roundNumber: game.roundNumber,
  };
}

function ensureDrawPile(game) {
  if (game.drawPile.length >= HAND_SIZE) return { gameOver: false };

  game.reshuffleCount++;
  if (game.reshuffleCount >= MAX_RESHUFFLES) {
    game.isGameOver = true;
    game.gameOverReason = `Draw pile exhausted ${MAX_RESHUFFLES} times`;
    return { gameOver: true };
  }

  const freshTiles = createTileDefinitions();
  const combined = [...game.drawPile, ...game.discardPile, ...freshTiles];
  game.drawPile = shuffle(combined);
  game.discardPile = [];
  return { gameOver: false };
}

function updateDynamicValues(game, won) {
  const specialTiles = game.currentHand.filter(t => t.type !== 'number');
  for (const tile of specialTiles) {
    if (won) {
      game.tileValues[tile.valueKey]++;
    } else {
      game.tileValues[tile.valueKey]--;
    }
  }
}

function checkGameOver(game) {
  if (game.isGameOver) return;

  for (const [key, value] of Object.entries(game.tileValues)) {
    if (value <= MIN_TILE_VALUE) {
      game.isGameOver = true;
      game.gameOverReason = `${formatTileKey(key)} value dropped to ${value}`;
      return;
    }
    if (value >= MAX_TILE_VALUE) {
      game.isGameOver = true;
      game.gameOverReason = `${formatTileKey(key)} value reached ${value}`;
      return;
    }
  }
}

export function createGame() {
  const id = crypto.randomUUID();
  const tileValues = initTileValues();
  const drawPile = shuffle(createTileDefinitions());
  const discardPile = [];
  const hand = drawPile.splice(0, HAND_SIZE);

  const game = {
    id,
    drawPile,
    discardPile,
    currentHand: hand,
    previousHand: null,
    previousHandValue: null,
    currentHandValue: calculateHandValue(hand, tileValues),
    score: 0,
    streak: 0,
    tileValues,
    reshuffleCount: 0,
    isGameOver: false,
    gameOverReason: null,
    lastBetResult: null,
    roundNumber: 1,
  };

  games.set(id, game);
  return sanitizeState(game);
}

export function getGame(id) {
  const game = games.get(id);
  if (!game) return null;
  return sanitizeState(game);
}

export function placeBet(id, bet) {
  const game = games.get(id);
  if (!game) throw new Error('Game not found');
  if (game.isGameOver) throw new Error('Game is already over');
  if (bet !== 'higher' && bet !== 'lower') {
    throw new Error('Bet must be "higher" or "lower"');
  }

  const oldHandValue = game.currentHandValue;

  game.previousHand = game.currentHand;
  game.previousHandValue = oldHandValue;

  game.discardPile.push(...game.currentHand);

  const refillResult = ensureDrawPile(game);
  if (refillResult.gameOver) {
    return sanitizeState(game);
  }

  game.currentHand = game.drawPile.splice(0, HAND_SIZE);
  game.currentHandValue = calculateHandValue(game.currentHand, game.tileValues);
  game.roundNumber++;

  const newHandValue = game.currentHandValue;
  const isHigher = newHandValue > oldHandValue;
  const isEqual = newHandValue === oldHandValue;
  const won = isEqual || (bet === 'higher' ? isHigher : !isHigher && !isEqual);

  if (won) {
    game.streak++;
    const multiplier = Math.min(game.streak, 5);
    const points = newHandValue * multiplier;
    game.score += points;
    game.lastBetResult = { bet, won: true, pointsEarned: points, multiplier };
  } else {
    game.streak = 0;
    game.lastBetResult = { bet, won: false, pointsEarned: 0, multiplier: 0 };
  }

  updateDynamicValues(game, won);
  checkGameOver(game);

  return sanitizeState(game);
}
