import { useState } from "react";
import "./App.scss";
import { grafo } from "./data/grafo";
import { tecnicos } from "./data/tecnico";
import { dijkstraConRuta, obtenerRuta } from "./utils/dijkstra";

type Resultado = {
  mejor: string | null;
  mejorDist: number;
  ruta: string[];
};

function App() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [posicionActual, setPosicionActual] = useState<string | null>(null);
  const [recorrido, setRecorrido] = useState<string[]>([]);

  const buscarTecnico = (tipo: string, destino: string) => {
    let mejor: string | null = null;
    let mejorDist = Infinity;
    let mejorRuta: string[] = [];

    tecnicos.forEach((t) => {
      if (t.disponible && t.tipo === tipo) {
        const { dist, prev } = dijkstraConRuta(grafo, t.ubicacion);

        if (dist[destino] < mejorDist) {
          mejorDist = dist[destino];
          mejor = t.id;
          mejorRuta = obtenerRuta(prev, destino);
        }
      }
    });

    setResultado({ mejor, mejorDist, ruta: mejorRuta });
    simularMovimiento(mejorRuta);
  };

  const simularMovimiento = (ruta: string[]) => {
    let i = 0;
    setRecorrido([]);

    const intervalo = setInterval(() => {
      setPosicionActual(ruta[i]);
      setRecorrido((prev) => [...prev, ruta[i]]);
      i++;

      if (i >= ruta.length) {
        clearInterval(intervalo);
      }
    }, 1000);
  };

  return (
    <div className="app">
      <h1 className="title">Not Far</h1>

      <div className="card">
        <h2>Fast Rescue</h2>

        <button
          className="btn btn-red"
          onClick={() => buscarTecnico("plomero", "D")}
        >
          Plomero
        </button>

        <button
          className="btn btn-red"
          onClick={() => buscarTecnico("electricista", "D")}
        >
          Electricista
        </button>
      </div>

      <div className="card">
        <h2>Servicios</h2>

        <button
          className="btn btn-gold"
          onClick={() => buscarTecnico("gomero", "D")}
        >
          Gomero
        </button>
      </div>

      {resultado && (
        <div className="card">
          <h3>Técnico: {resultado.mejor}</h3>
          <p>Distancia: {resultado.mejorDist}</p>
          <p>Ruta: {resultado.ruta.join(" → ")}</p>
        </div>
      )}

      <div className="card">
        <h3>Simulación</h3>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {["A", "B", "C", "D"].map((nodo) => (
            <div
              key={nodo}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  posicionActual === nodo
                    ? "#22c55e"
                    : recorrido.includes(nodo)
                      ? "#38bdf8"
                      : "#ccc",
                color: "black",
              }}
            >
              {nodo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
