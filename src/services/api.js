import * as engine from '../engine/gameEngine';
import * as lb from '../engine/leaderboard';

export async function createGame() {
  return engine.createGame();
}

export async function getGame(id) {
  return engine.getGame(id);
}

export async function placeBet(id, bet) {
  return engine.placeBet(id, bet);
}

export async function getLeaderboard() {
  return lb.getLeaderboard();
}

export async function submitScore(playerName, score) {
  return lb.submitScore(playerName, score);
}
