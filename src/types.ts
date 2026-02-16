export type GameState = {
  board: number[][];
  history: number[];
  turn: number;
};

export type Player = {
  id: number;
  icon: "fa-x" | "fa-o";
  color: "yellow" | "turquoise";
};
