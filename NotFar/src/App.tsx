import { useEffect, useState } from "react";
import "./App.scss";
import MapView from "./components/MapView";
import { tecnicos } from "./data/tecnico";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3001");

function App() {
  const [posicionActual, setPosicionActual] = useState<[number, number] | null>(
    null,
  );
  const [ruta, setRuta] = useState<[number, number][]>([]);
  const [eta, setEta] = useState<number | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    socket.on("position", (data) => {
      setPosicionActual(data.coords);
      setProgreso(data.progress);
      setEta(data.eta);
    });

    socket.on("route", (data) => {
      setRuta(data);
    });
  }, []);

  const buscarTecnico = (tipo: string) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const user: [number, number] = [
        pos.coords.longitude,
        pos.coords.latitude,
      ];

      const tecnico = tecnicos.find((t) => t.tipo === tipo && t.disponible);

      if (!tecnico) return;

      setBuscando(true);

      socket.emit("startRoute", {
        start: tecnico.coords,
        end: user,
      });
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Notfar</h1>
        <p className="subtitle">{buscando ? "TRACKING..." : "READY"}</p>
      </header>

      <main className="dashboard-grid">
        <section className="card">
          <h3>Fast Rescue</h3>
          <button className="btn" onClick={() => buscarTecnico("plomero")}>
            Plomero
          </button>
          <button className="btn" onClick={() => buscarTecnico("electricista")}>
            Electricista
          </button>
          <button
            className="btn btn-outline"
            onClick={() => buscarTecnico("gomero")}
          >
            Gomero
          </button>
        </section>

        <section className="card">
          <h3>Tracking</h3>
          <p>ETA: {eta}s</p>

          <div style={{ background: "#edebe9", height: "6px" }}>
            <div
              style={{
                width: `${progreso}%`,
                height: "100%",
                background: "#0078d4",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </section>

        <section className="card">
          <h3>Live Map</h3>
          <MapView posicion={posicionActual} ruta={ruta} />
        </section>
      </main>
    </div>
  );
}

export default App;
