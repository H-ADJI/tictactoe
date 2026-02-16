import type { GameState } from "./types.ts";
export default class Store {
  constructor(private readonly localStorageKey: string) {}
  #initialState(): GameState {
    return {
      board: [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1],
      ],
      history: [],
      turn: 1,
    };
  }
  resetHistory() {
    const state = this.getState();
    state.history = [];
    this.saveState(state);
  }
  resetBoardState() {
    const state = { ...this.#initialState(), history: this.getState().history };
    this.saveState(state);
  }
  getState(): GameState {
    const state = window.localStorage.getItem(this.localStorageKey);
    return state ? (JSON.parse(state) as GameState) : this.#initialState();
  }
  saveState(state: GameState) {
    window.localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }
  get turn(): number {
    return this.getState().turn;
  }
  getNextPlayer(): number {
    return (this.getState().turn + 1) % 2;
  }
  getCurrentPlayer(): number {
    return this.getState().turn % 2;
  }
  getPlayerWins(playerNumber: number): number {
    return this.getState().history.filter((x) => x == playerNumber).length;
  }
  saveGameResult(playerNumber: number) {
    const state = this.getState();
    state.history.push(playerNumber);
    this.saveState(state);
  }
  playTurn(squareId: number) {
    const state = this.getState();
    const row = Math.floor((squareId - 1) / state.board.length);
    const col = (squareId - 1) % state.board.length;
    if (state.board[row][col] != -1) {
      return false;
    }
    state.board[row][col] = this.getCurrentPlayer();
    state.turn++;
    this.saveState(state);
    return true;
  }
  checkGameProgress() {
    const rows = this.getState().board;
    let sequence = rows.concat([
      [rows[0][0], rows[1][0], rows[2][0]],
      [rows[0][1], rows[1][1], rows[2][1]],
      [rows[0][2], rows[1][2], rows[2][2]],
      [rows[0][0], rows[1][1], rows[2][2]],
      [rows[0][2], rows[1][1], rows[2][0]],
    ]);

    for (const s of sequence) {
      if (this.#checkSequence(s)) {
        return s[0];
      }
    }
    return -1;
  }

  #checkSequence(sequence: number[]) {
    if (sequence[0] == -1) {
      return false;
    }
    return sequence.every((val) => val == sequence[0]);
  }
}
