import type { Grafo, Nodo } from "../types";

export function dijkstraConRuta(grafo: Grafo, inicio: Nodo) {
  const dist: Record<Nodo, number> = {};
  const prev: Record<Nodo, Nodo | null> = {};
  const visitados = new Set<Nodo>();

  Object.keys(grafo).forEach((nodo) => {
    dist[nodo] = Infinity;
    prev[nodo] = null;
  });

  dist[inicio] = 0;

  while (true) {
    let nodoActual: Nodo | null = null;

    for (const nodo in dist) {
      if (
        !visitados.has(nodo) &&
        (nodoActual === null || dist[nodo] < dist[nodoActual])
      ) {
        nodoActual = nodo;
      }
    }

    if (nodoActual === null) break;

    for (const vecino in grafo[nodoActual]) {
      const nuevaDist = dist[nodoActual] + grafo[nodoActual][vecino];

      if (nuevaDist < dist[vecino]) {
        dist[vecino] = nuevaDist;
        prev[vecino] = nodoActual;
      }
    }

    visitados.add(nodoActual);
  }

  return { dist, prev };
}

export function obtenerRuta(prev: Record<Nodo, Nodo | null>, destino: Nodo) {
  const ruta: Nodo[] = [];
  let actual: Nodo | null = destino;

  while (actual) {
    ruta.unshift(actual);
    actual = prev[actual];
  }

  return ruta;
}
