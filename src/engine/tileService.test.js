import { describe, it, expect } from 'vitest';
import {
  createTileDefinitions, shuffle,
  getTileValue, calculateHandValue,
} from './tileService';
import { COPIES_PER_TILE } from './constants';

describe('createTileDefinitions', () => {
  const tiles = createTileDefinitions();

  it('creates 136 tiles total', () => {
    expect(tiles.length).toBe(136);
  });

  it('creates 108 number tiles (3 suits × 9 ranks × 4 copies)', () => {
    const numberTiles = tiles.filter(t => t.type === 'number');
    expect(numberTiles.length).toBe(108);
  });

  it('creates 12 dragon tiles (3 dragons × 4 copies)', () => {
    const dragonTiles = tiles.filter(t => t.type === 'dragon');
    expect(dragonTiles.length).toBe(12);
  });

  it('creates 16 wind tiles (4 winds × 4 copies)', () => {
    const windTiles = tiles.filter(t => t.type === 'wind');
    expect(windTiles.length).toBe(16);
  });

  it('gives each tile a unique id', () => {
    const ids = tiles.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(tiles.length);
  });

  it('assigns correct suits to number tiles', () => {
    const suits = new Set(tiles.filter(t => t.type === 'number').map(t => t.suit));
    expect(suits).toEqual(new Set(['bamboo', 'characters', 'dots']));
  });

  it('assigns face values 1-9 to number tiles', () => {
    const faces = new Set(tiles.filter(t => t.type === 'number').map(t => t.face));
    expect(faces).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
  });

  it('assigns valueKey to dragon tiles', () => {
    const dragonTiles = tiles.filter(t => t.type === 'dragon');
    dragonTiles.forEach(t => {
      expect(t.valueKey).toBe(`dragon_${t.face}`);
    });
  });

  it('assigns valueKey to wind tiles', () => {
    const windTiles = tiles.filter(t => t.type === 'wind');
    windTiles.forEach(t => {
      expect(t.valueKey).toBe(`wind_${t.face}`);
    });
  });

  it('sets valueKey to null for number tiles', () => {
    const numberTiles = tiles.filter(t => t.type === 'number');
    numberTiles.forEach(t => {
      expect(t.valueKey).toBeNull();
    });
  });

  it('creates exactly COPIES_PER_TILE copies of each number tile', () => {
    const bamboo5 = tiles.filter(t => t.suit === 'bamboo' && t.face === 5);
    expect(bamboo5.length).toBe(COPIES_PER_TILE);
  });
});

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.length).toBe(arr.length);
  });

  it('contains the same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });

  it('produces a different order (statistical, may rarely fail)', () => {
    const arr = Array.from({ length: 50 }, (_, i) => i);
    const shuffled = shuffle(arr);
    const samePosition = arr.filter((v, i) => v === shuffled[i]).length;
    expect(samePosition).toBeLessThan(arr.length);
  });
});

describe('getTileValue', () => {
  const tileValues = { dragon_red: 7, wind_east: 3 };

  it('returns face value for number tiles', () => {
    const tile = { type: 'number', face: 6, valueKey: null };
    expect(getTileValue(tile, tileValues)).toBe(6);
  });

  it('returns dynamic value for dragon tiles', () => {
    const tile = { type: 'dragon', face: 'red', valueKey: 'dragon_red' };
    expect(getTileValue(tile, tileValues)).toBe(7);
  });

  it('returns dynamic value for wind tiles', () => {
    const tile = { type: 'wind', face: 'east', valueKey: 'wind_east' };
    expect(getTileValue(tile, tileValues)).toBe(3);
  });
});

describe('calculateHandValue', () => {
  const tileValues = { dragon_red: 8, wind_south: 4 };

  it('sums number tile face values', () => {
    const hand = [
      { type: 'number', face: 3, valueKey: null },
      { type: 'number', face: 7, valueKey: null },
      { type: 'number', face: 1, valueKey: null },
    ];
    expect(calculateHandValue(hand, tileValues)).toBe(11);
  });

  it('includes dynamic values for special tiles', () => {
    const hand = [
      { type: 'number', face: 5, valueKey: null },
      { type: 'dragon', face: 'red', valueKey: 'dragon_red' },
      { type: 'wind', face: 'south', valueKey: 'wind_south' },
    ];
    expect(calculateHandValue(hand, tileValues)).toBe(5 + 8 + 4);
  });

  it('returns 0 for an empty hand', () => {
    expect(calculateHandValue([], tileValues)).toBe(0);
  });
});
