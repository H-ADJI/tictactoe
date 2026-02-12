export default class Store {
  constructor() {
    this.state = this.#initialState();
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
    this.state.history = [];
  }
  resetBoardState() {
    this.state = { ...this.#initialState(), history: this.state.history };
  }
  get turn() {
    return this.state.turn;
  }
  getNextPlayer() {
    return (this.state.turn + 1) % 2;
  }
  getCurrentPlayer() {
    return this.state.turn % 2;
  }
  getPlayerWins(playerNumber) {
    return this.state.history.filter((x) => x == playerNumber).length;
  }
  saveGameResult(playerNumber) {
    this.state.history.push(playerNumber);
  }
  nextTurn(squareId) {
    const row = Math.floor((squareId - 1) / 3);
    const col = (squareId - 1) % 3;
    if (this.state.board[row][col] != -1) {
      return false;
    }
    this.state.board[row][col] = this.getCurrentPlayer();
    this.state.turn++;
    return true;
  }
  checkGameProgress() {
    const rows = this.state.board;
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
