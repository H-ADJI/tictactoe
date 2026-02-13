export default class Store {
  constructor(localStorageKey) {
    this.state = this.#initialState();
    this.stateKey = localStorageKey;
  }
  #initialState() {
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
  getState() {
    const state = window.localStorage.getItem(this.stateKey);
    return state ? JSON.parse(state) : this.#initialState();
  }
  saveState(state) {
    window.localStorage.setItem(this.stateKey, JSON.stringify(state));
  }
  get turn() {
    return this.getState().turn;
  }
  getNextPlayer() {
    return (this.getState().turn + 1) % 2;
  }
  getCurrentPlayer() {
    return this.getState().turn % 2;
  }
  getPlayerWins(playerNumber) {
    return this.getState().history.filter((x) => x == playerNumber).length;
  }
  saveGameResult(playerNumber) {
    const state = this.getState();
    state.history.push(playerNumber);
    this.saveState(state);
  }
  playTurn(squareId) {
    const row = Math.floor((squareId - 1) / 3);
    const col = (squareId - 1) % 3;
    const state = this.getState();
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

    return this.#checkWinPattern(sequence);
  }

  #checkWinPattern(pattern) {
    for (const p of pattern) {
      if (this.#checkSequence(p)) {
        return p[0];
      }
    }
    return -1;
  }

  #checkSequence(sequence) {
    if (sequence[0] == -1) {
      return false;
    }
    return sequence.every((val) => val == sequence[0]);
  }
}
