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
    </div>
  );
}

export default App;
