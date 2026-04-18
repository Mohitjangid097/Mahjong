import {
  SUITS, NUMBERS, DRAGONS, WINDS,
  COPIES_PER_TILE, TILE_SYMBOLS, TILE_LABELS,
} from './constants';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function createTileDefinitions() {
  const tiles = [];

  for (const suit of SUITS) {
    for (const num of NUMBERS) {
      for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
        tiles.push({
          id: `${suit}-${num}-${copy}`,
          type: 'number',
          suit,
          name: `${TILE_LABELS[suit]} ${num}`,
          face: num,
          symbol: TILE_SYMBOLS[suit][num],
          valueKey: null,
        });
      }
    }
  }

  for (const dragon of DRAGONS) {
    for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
      tiles.push({
        id: `dragon-${dragon}-${copy}`,
        type: 'dragon',
        suit: 'dragon',
        name: `${capitalize(dragon)} Dragon`,
        face: dragon,
        symbol: TILE_SYMBOLS.dragon[dragon],
        valueKey: `dragon_${dragon}`,
      });
    }
  }

  for (const wind of WINDS) {
    for (let copy = 0; copy < COPIES_PER_TILE; copy++) {
      tiles.push({
        id: `wind-${wind}-${copy}`,
        type: 'wind',
        suit: 'wind',
        name: `${capitalize(wind)} Wind`,
        face: wind,
        symbol: TILE_SYMBOLS.wind[wind],
        valueKey: `wind_${wind}`,
      });
    }
  }

  return tiles;
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getTileValue(tile, tileValues) {
  if (tile.type === 'number') return tile.face;
  return tileValues[tile.valueKey];
}

export function calculateHandValue(hand, tileValues) {
  return hand.reduce((sum, tile) => sum + getTileValue(tile, tileValues), 0);
}
