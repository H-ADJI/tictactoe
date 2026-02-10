const App = {
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id='modal']"),
    modalText: document.querySelector("[data-id='modal-text']"),
    playAgainBtn: document.querySelector("[data-id='modal-btn']"),
    turnIndicator: document.querySelector("[data-id='turn']"),
  },
  state: {
    board: [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    turn: 1,
  },
  init: function () {
    App.registerEventListeners();
  },

  checkGameStatus() {
    const checkSequence = function (sequence) {
      if (sequence[0] == -1) {
        return false;
      }
      return sequence.every((val) => val == sequence[0]);
    };
    const board = App.state.board;
    let columns = [
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
    ];
    let diagonal = [
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];
    const checkWinPattern = function (pattern) {
      for (const p of pattern) {
        if (checkSequence(p)) {
          return p[0];
        }
      }
      return -1;
    };
    return (
      checkWinPattern(board) *
      checkWinPattern(diagonal) *
      checkWinPattern(columns)
    );
  },
  reset() {
    App.state = {
      board: [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1],
      ],
      turn: 1,
    };
    const turnIcon = document.createElement("i");
    const turnText = document.createElement("p");
    turnIcon.classList.add("fa-solid", "fa-x", "turquoise");
    turnText.classList.add("turquoise");
    turnText.textContent = "Player 1, you're up!";
    App.$.turnIndicator.replaceChildren(turnIcon, turnText);
    App.$.squares.forEach((square) => {
      square.replaceChildren();
    });
  },
  registerEventListeners() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });
    App.$.newRoundBtn.addEventListener("click", () => {
      App.reset();
    });
    App.$.resetBtn.addEventListener("click", () => {
      App.reset();
    });
    App.$.playAgainBtn.addEventListener("click", () => {
      App.reset();
      App.$.modal.classList.toggle("hidden");
    });
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        const row = Math.floor((+square.id - 1) / 3);
        const col = (+square.id - 1) % 3;
        if (App.state.board[row][col] != -1) {
          return;
        }
        const modal = App.$.modal;
        const boardIcon = document.createElement("i");
        const turnIndicator = App.$.turnIndicator;
        const turnIcon = document.createElement("i");
        const turnText = document.createElement("p");
        const currentPlayer = App.state.turn % 2;

        if (currentPlayer === 1) {
          boardIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnText.classList.add("yellow");
          turnText.textContent = "Player 2, you're up!";
        } else {
          boardIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnText.classList.add("turquoise");
          turnText.textContent = "Player 1, you're up!";
        }
        square.replaceChildren(boardIcon);
        turnIndicator.replaceChildren(turnIcon, turnText);
        App.state.board[row][col] = currentPlayer;

        const progress = App.checkGameStatus();
        if (progress == 1) {
          const msg = "player 1 won";
          App.$.modalText.textContent = msg;
          modal.classList.toggle("hidden");
        } else if (progress == 0) {
          const msg = "player 2 won";
          App.$.modalText.textContent = msg;
          modal.classList.toggle("hidden");
        } else if (App.state.turn == 9) {
          const msg = "Tie";
          App.$.modalText.textContent = msg;
          modal.classList.toggle("hidden");
        }
        App.state.turn++;
      });
    });
  },
};
window.addEventListener("load", App.init);
