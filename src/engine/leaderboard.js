const STORAGE_KEY = 'mahjong_leaderboard';
const MAX_ENTRIES = 5;

function readEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getLeaderboard() {
  return readEntries();
}

export function submitScore(playerName, score) {
  const entries = readEntries();
  entries.push({ playerName, score });
  entries.sort((a, b) => b.score - a.score);
  const trimmed = entries.slice(0, MAX_ENTRIES);
  writeEntries(trimmed);

  const rank = trimmed.findIndex(
    e => e.playerName === playerName && e.score === score
  );
  return { rank: rank !== -1 ? rank + 1 : null };
}
