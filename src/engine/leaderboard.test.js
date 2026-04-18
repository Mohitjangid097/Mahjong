import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLeaderboard, submitScore } from './leaderboard';

const STORAGE_KEY = 'mahjong_leaderboard';

const store = {};
const localStorageMock = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = value; }),
  clear: vi.fn(() => { for (const k in store) delete store[k]; }),
  removeItem: vi.fn((key) => { delete store[key]; }),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('getLeaderboard', () => {
  it('returns empty array when no scores exist', () => {
    expect(getLeaderboard()).toEqual([]);
  });

  it('returns stored entries', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      { playerName: 'Alice', score: 100 },
    ]));
    const entries = getLeaderboard();
    expect(entries).toHaveLength(1);
    expect(entries[0].playerName).toBe('Alice');
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json');
    expect(getLeaderboard()).toEqual([]);
  });
});

describe('submitScore', () => {
  it('adds a score and returns rank', () => {
    const result = submitScore('Alice', 200);
    expect(result.rank).toBe(1);
    expect(getLeaderboard()).toHaveLength(1);
  });

  it('sorts scores in descending order', () => {
    submitScore('Alice', 100);
    submitScore('Bob', 300);
    submitScore('Carol', 200);

    const entries = getLeaderboard();
    expect(entries[0].playerName).toBe('Bob');
    expect(entries[1].playerName).toBe('Carol');
    expect(entries[2].playerName).toBe('Alice');
  });

  it('limits to top 5 entries', () => {
    for (let i = 1; i <= 7; i++) {
      submitScore(`Player${i}`, i * 100);
    }
    const entries = getLeaderboard();
    expect(entries).toHaveLength(5);
    expect(entries[0].score).toBe(700);
    expect(entries[4].score).toBe(300);
  });

  it('returns correct rank for a new high score', () => {
    submitScore('A', 100);
    submitScore('B', 200);
    submitScore('C', 300);
    const result = submitScore('D', 500);
    expect(result.rank).toBe(1);
  });

  it('returns correct rank for a low score', () => {
    submitScore('A', 300);
    submitScore('B', 200);
    const result = submitScore('C', 100);
    expect(result.rank).toBe(3);
  });

  it('persists across calls', () => {
    submitScore('Alice', 100);
    submitScore('Bob', 200);
    const entries = getLeaderboard();
    expect(entries).toHaveLength(2);
  });
});
