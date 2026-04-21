import { useState } from "react";
import "./App.scss";
import MapView from "./components/MapView";
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
  const [buscando, setBuscando] = useState(false);

  const buscarTecnico = (tipo: string, destino: string) => {
    setBuscando(true);
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
        setBuscando(false);
      }
    }, 800);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Notfar</h1>
        <p className="subtitle">
          {buscando ? "ANALYZING_NETWORK_GRAPH..." : "SYSTEM_READY"}
        </p>
      </header>

      <main className="dashboard-grid">
        <section className="card">
          <h3>Fast Rescue</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              className="btn btn-red"
              onClick={() => buscarTecnico("plomero", "D")}
              disabled={buscando}
            >
              Request Plomero
            </button>
            <button
              className="btn btn-red"
              onClick={() => buscarTecnico("electricista", "D")}
              disabled={buscando}
            >
              Request Electricista
            </button>
          </div>
        </section>

        <section className="card">
          <h3>General Services</h3>
          <button
            className="btn btn-outline"
            onClick={() => buscarTecnico("gomero", "D")}
            disabled={buscando}
          >
            Find Gomero
          </button>
        </section>

        {resultado && (
          <section className="card" style={{ borderLeft: "4px solid #107c10" }}>
            <h3>Assignment Details</h3>
            <div className="subtitle" style={{ marginBottom: "10px" }}>
              TECH_ID: {resultado.mejor}
            </div>
            <p>
              <strong>Distance:</strong> {resultado.mejorDist} units
            </p>
            <p>
              <strong>Optimal Path:</strong> {resultado.ruta.join(" → ")}
            </p>
          </section>
        )}

        <section className="card">
          <h3>Live Simulation</h3>
          <div
            className="simulation-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              background: "#f3f2f1",
              padding: "20px",
              borderRadius: "4px",
            }}
          >
            {["A", "B", "C", "D"].map((nodo) => (
              <div
                key={nodo}
                className="node-circle"
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  background:
                    posicionActual === nodo
                      ? "#0078d4"
                      : recorrido.includes(nodo)
                        ? "#d1e9ff"
                        : "#ffffff",
                  color: posicionActual === nodo ? "white" : "#201f1e",
                  border: `2px solid ${
                    posicionActual === nodo ? "#0078d4" : "#edebe9"
                  }`,
                  boxShadow:
                    posicionActual === nodo
                      ? "0 0 15px rgba(0,120,212,0.4)"
                      : "none",
                }}
              >
                {nodo}
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Live Map</h3>
          <MapView posicion={posicionActual} />
        </section>
      </main>
    </div>
  );
}

export default App;
