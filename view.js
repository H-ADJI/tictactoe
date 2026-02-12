export default class View {
  constructor() {
    this.$ = {};
    this.$$ = {};

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

    this.$.menuBtn.addEventListener("click", (event) => {
      this.$.menuItems.classList.toggle("hidden");
      this.$.menu.classList.toggle("border");
      const chevronIcon = this.$.menu.querySelector("i");
      chevronIcon.classList.toggle("fa-chevron-down");
      chevronIcon.classList.toggle("fa-chevron-up");
    });
  }
  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => {
        handler(square);
      });
    });
  }
  bindNewRound(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }
  bindResetGame(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.playAgainBtn.addEventListener("click", handler);
  }

  handleGameEnd(player, updatedHistory) {
    let msg;
    if (player == null) {
      msg = "Tie";
      this.$.ties.innerText = updatedHistory;
    } else {
      msg = `Player ${player.id} won !`;
      if (player.id == 1) {
        this.$.p1Wins.innerText = updatedHistory;
      } else {
        this.$.p2Wins.innerText = updatedHistory;
      }
    }
    this.$.modalText.textContent = msg;
    this.$.modal.classList.toggle("hidden");
  }
  closeModal() {
    this.$.modal.classList.add("hidden");
  }
  closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menu.classList.remove("border");
    const chevronIcon = this.$.menu.querySelector("i");
    chevronIcon.classList.add("fa-chevron-down");
  }

  clearScoreBoard() {
    this.$.ties.innerText = 0;
    this.$.p1Wins.innerText = 0;
    this.$.p2Wins.innerText = 0;
  }
  clearBoard() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }
  setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");
    const iconClass = player.icon;
    const colorClass = player.color;
    icon.classList.add("fa-solid", colorClass, iconClass);
    label.classList.add(colorClass);
    label.innerText = `Player ${player.id}, you're up!`;
    this.$.turnIndicator.replaceChildren(icon, label);
  }
  handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    const iconClass = player.icon;
    const colorClass = player.color;
    icon.classList.add("fa-solid", iconClass, colorClass);
    squareEl.replaceChildren(icon);
  }

  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("Could not find elements");

    return elList;
  }
  #qs(selector, parent) {
    const base = parent ? parent : document;
    const el = base.querySelector(selector);
    if (!el) throw new Error("Could not find element");
    return el;
  }
}
