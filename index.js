import View from "./view.js";
import Store from "./store.js";
function init() {
  const players = [
    { id: 2, icon: "fa-o", color: "yellow" },
    { id: 1, icon: "fa-x", color: "turquoise" },
  ];
  const view = new View();
  const store = new Store("t3-storage");
  const state = store.getState();
  const nextPlayerNumber = store.getCurrentPlayer();
  for (const p of [0, 1, -1]) {
    const historyUpdate = store.getPlayerWins(p);
    if (p == -1) {
      view.handleScoreBoard(null, historyUpdate);
    } else {
      view.handleScoreBoard(players[p], historyUpdate);
    }
  }
  view.handlePlayedTurns(state.board, players);
  view.nextTurnIndicator(players[nextPlayerNumber]);

  view.bindResetGame((event) => {
    view.closeModal();
    view.closeMenu();
    store.resetBoardState();
    view.clearBoard();
    view.nextTurnIndicator(players[store.getCurrentPlayer()]);
  });
  view.bindNewRound((event) => {
    view.closeMenu();
    store.resetBoardState();
    store.resetHistory();
    view.clearBoard();
    view.nextTurnIndicator(players[store.getCurrentPlayer()]);
    view.clearScoreBoard();
  });
  view.bindPlayerMoveEvent((square) => {
    const currentPlayerNumber = store.getCurrentPlayer();
    const nextPlayerNumber = store.getNextPlayer();

    const currentPlayer = players[currentPlayerNumber];
    if (store.playTurn(+square.id)) {
      view.nextTurnIndicator(players[nextPlayerNumber]);
      view.handlePlayerMove(square, currentPlayer);
    }

    const gameResult = store.checkGameProgress();
    if (gameResult == 1 || gameResult == 0) {
      store.saveGameResult(gameResult);
      const historyUpdate = store.getPlayerWins(gameResult);
      view.handleScoreBoard(players[gameResult], historyUpdate);
      view.showModal(players[gameResult]);
    } else if (store.turn == 10) {
      store.saveGameResult(gameResult);
      const historyUpdate = store.getPlayerWins(gameResult);
      view.handleScoreBoard(null, historyUpdate);
      view.showModal(players[gameResult]);
    }
  });
}
window.addEventListener("load", init);
