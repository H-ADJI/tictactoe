import View from "./view.js";
import Store from "./store.js";
import type { Player } from "./types.ts";
function init() {
  const players: Player[] = [
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
      view.handleScoreBoard(null, historyUpdate.toString());
    } else {
      view.handleScoreBoard(players[p], historyUpdate.toString());
    }
  }
  view.handlePlayedTurns(state.board, players);
  view.nextTurnIndicator(players[nextPlayerNumber]);

  view.bindResetGame((_: Event) => {
    view.closeModal();
    view.closeMenu();
    store.resetBoardState();
    view.clearBoard();
    view.nextTurnIndicator(players[store.getCurrentPlayer()]);
  });
  view.bindNewRound((_: Event) => {
    view.closeMenu();
    store.resetBoardState();
    store.resetHistory();
    view.clearBoard();
    view.nextTurnIndicator(players[store.getCurrentPlayer()]);
    view.clearScoreBoard();
  });
  view.bindPlayerMoveEvent((square: Element) => {
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
      view.handleScoreBoard(players[gameResult], historyUpdate.toString());
      view.showModal(players[gameResult]);
    } else if (store.turn == 10) {
      store.saveGameResult(gameResult);
      const historyUpdate = store.getPlayerWins(gameResult);
      view.handleScoreBoard(null, historyUpdate.toString());
      view.showModal(players[gameResult]);
    }
  });
}
window.addEventListener("load", init);
