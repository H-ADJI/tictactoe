import View from "./view.js";
import Store from "./store.js";
const App = {
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
function init() {
  const players = [
    { id: 2, icon: "fa-o", color: "yellow" },
    { id: 1, icon: "fa-x", color: "turquoise" },
  ];
  const view = new View();
  const store = new Store();

  view.bindResetGame((event) => {
    // TODO: close modal / menu
    // clear state
    // clear board
    // clear turn indicator
  });
  view.bindPlayerMoveEvent((square) => {
    const currentPlayerNumber = store.getCurrentPlayer();
    const nextPlayerNumber = store.getNextPlayer();

    const currentPlayer = players[currentPlayerNumber];
    if (store.nextTurn(+square.id)) {
      view.setTurnIndicator(players[nextPlayerNumber]);
      view.handlePlayerMove(square, currentPlayer);
    }

    const gameResult = store.checkGameProgress();
    if (gameResult == 1 || gameResult == 0) {
      view.handleGameEnd(players[gameResult]);
    } else if (store.turn == 10) {
      view.handleGameEnd();
    }
  });
}
window.addEventListener("load", init);
