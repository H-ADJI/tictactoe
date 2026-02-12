import View from "./view.js";
import Store from "./store.js";
function init() {
  const players = [
    { id: 2, icon: "fa-o", color: "yellow" },
    { id: 1, icon: "fa-x", color: "turquoise" },
  ];
  const view = new View();
  const store = new Store();

  view.bindResetGame((event) => {
    view.closeModal();
    view.closeMenu();
    store.resetBoardState();
    view.clearBoard();
    view.setTurnIndicator(players[store.getCurrentPlayer()]);
  });

  view.bindNewRound((event) => {
    view.closeModal();
    view.closeMenu();
    store.resetBoardState();
    view.clearBoard();
    view.setTurnIndicator(players[store.getCurrentPlayer()]);
    view.clearScoreBoard();
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
      store.saveGameResult(gameResult);
      const historyUpdate = store.getPlayerWins(gameResult);
      view.handleGameEnd(players[gameResult], historyUpdate);
    } else if (store.turn == 10) {
      store.saveGameResult(gameResult);
      const historyUpdate = store.getPlayerWins(gameResult);
      view.handleGameEnd(null, historyUpdate);
    }
  });
}
window.addEventListener("load", init);
