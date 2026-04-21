import { useState } from "react";
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
  const [idioma, setIdioma] = useState<"es" | "en">("es");

  const textos = {
    es: {
      titulo: "Not Far",
      urgente: "Emergencias",
      normal: "Servicios",
      tecnico: "Técnico",
      distancia: "Distancia",
      ruta: "Ruta",
    },
    en: {
      titulo: "Not Far",
      urgente: "Fast Rescue",
      normal: "Services",
      tecnico: "Technician",
      distancia: "Distance",
      ruta: "Route",
    },
  };

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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>{textos[idioma].titulo}</h1>

      <button
        onClick={() => setIdioma(idioma === "es" ? "en" : "es")}
        style={{ marginBottom: "20px" }}
      >
        {idioma === "es" ? "EN" : "ES"}
      </button>

      <h2>{textos[idioma].urgente}</h2>
      <button onClick={() => buscarTecnico("plomero", "D")}>Plomero</button>
      <button onClick={() => buscarTecnico("electricista", "D")}>
        Electricista
      </button>

      <h2 style={{ marginTop: "20px" }}>{textos[idioma].normal}</h2>
      <button onClick={() => buscarTecnico("gomero", "D")}>Gomero</button>

      {resultado && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            {textos[idioma].tecnico}: {resultado.mejor}
          </h3>
          <p>
            {textos[idioma].distancia}: {resultado.mejorDist}
          </p>
          <p>
            {textos[idioma].ruta}: {resultado.ruta.join(" → ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
