import type { Player } from "./types.js";

export default class View {
  // $$: Element[];
  // $: Element;

  $: Record<string, Element> = {};
  $$: Record<string, NodeListOf<Element>> = {};
  constructor() {
    this.$.menu = this.#qs("[data-id='menu']");
    this.$.menuBtn = this.#qs("[data-id='menu-btn']");
    this.$.menuItems = this.#qs("[data-id='menu-items']");
    this.$.resetBtn = this.#qs("[data-id='reset-btn']");
    this.$.newRoundBtn = this.#qs("[data-id='new-round-btn']");
    this.$.modal = this.#qs("[data-id='modal']");
    this.$.modalText = this.#qs("[data-id='modal-text']");
    this.$.playAgainBtn = this.#qs("[data-id='modal-btn']");
    this.$.turnIndicator = this.#qs("[data-id='turn']");
    this.$.p1Wins = this.#qs("[data-id='p1-wins']");
    this.$.p2Wins = this.#qs("[data-id='p2-wins']");
    this.$.ties = this.#qs("[data-id='ties']");

    this.$$.squares = this.#qsAll("[data-id='square']");

    this.$.menuBtn.addEventListener("click", (_: Event) => {
      this.$.menuItems.classList.toggle("hidden");
      this.$.menu.classList.toggle("border");
      const chevronIcon = this.$.menu.querySelector("i");
      chevronIcon?.classList.toggle("fa-chevron-down");
      chevronIcon?.classList.toggle("fa-chevron-up");
    });
  }
  bindPlayerMoveEvent(handler: (el: Element) => void) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => {
        handler(square);
      });
    });
  }
  bindNewRound(handler: EventListener) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }
  bindResetGame(handler: EventListener) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.playAgainBtn.addEventListener("click", handler);
  }
  handleScoreBoard(player: Player | null, updatedHistory: string) {
    if (player == null) {
      this.$.ties.textContent = updatedHistory;
    } else {
      if (player.id == 1) {
        this.$.p1Wins.textContent = updatedHistory;
      } else {
        this.$.p2Wins.textContent = updatedHistory;
      }
    }
  }
  showModal(player: Player) {
    let msg;
    this.$.modal.classList.remove("hidden");
    if (player == null) {
      msg = "Tie";
    } else {
      msg = `Player ${player.id} won !`;
    }
    this.$.modalText.textContent = msg;
  }
  closeModal() {
    this.$.modal.classList.add("hidden");
  }
  closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menu.classList.remove("border");
    const chevronIcon = this.$.menu.querySelector("i");
    chevronIcon?.classList.add("fa-chevron-down");
  }
  clearScoreBoard() {
    this.$.ties.textContent = "0";
    this.$.p1Wins.textContent = "0";
    this.$.p2Wins.textContent = "0";
  }
  clearBoard() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }
  nextTurnIndicator(player: Player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");
    const iconClass = player.icon;
    const colorClass = player.color;
    icon.classList.add("fa-solid", colorClass, iconClass);
    label.classList.add(colorClass);
    label.textContent = `Player ${player.id}, you're up!`;
    this.$.turnIndicator.replaceChildren(icon, label);
  }
  handlePlayedTurns(board: number[][], players: Player[]) {
    this.$$.squares.forEach((square) => {
      const squareId = +square.id;
      const row = Math.floor((squareId - 1) / 3);
      const col = (squareId - 1) % 3;
      if (board[row][col] != -1) {
        this.handlePlayerMove(square, players[board[row][col]]);
      }
    });
  }
  handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement("i");
    const iconClass = player.icon;
    const colorClass = player.color;
    icon.classList.add("fa-solid", iconClass, colorClass);
    squareEl.replaceChildren(icon);
  }
  #qsAll(selector: string) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("Could not find elements");

    return elList;
  }
  #qs(selector: string, parent?: Element) {
    const base = parent ? parent : document;
    const el = base.querySelector(selector);
    if (!el) throw new Error("Could not find element");
    return el;
  }
}
