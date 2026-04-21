import type { Grafo } from "../types";

export const grafo: Grafo = {
  A: { B: 2, C: 5 },
  B: { A: 2, D: 4 },
  C: { A: 5, D: 1 },
  D: { B: 4, C: 1 },
};
