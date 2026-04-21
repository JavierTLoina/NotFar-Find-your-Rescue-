import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBhODZkYmZhMDAyMjRmNWI4ZGNjMmQzMTU3YzU4MjI5IiwiaCI6Im11cm11cjY0In0=";

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("startRoute", async ({ start, end }) => {
    try {
      console.log("Iniciando ruta de:", start, "a:", end);

      const res = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [start, end],
          }),
        },
      );

      const data = await res.json();

      if (!data.features) {
        console.log("ERROR API:", data);
        return;
      }

      const coords = data.features[0].geometry.coordinates;
      const duration = data.features[0].properties.summary.duration;

      socket.emit(
        "route",
        coords.map((c) => [c[1], c[0]]),
      );

      let i = 0;
      const startTime = Date.now();
      const realDuration = duration;

      const intervalTime = 500;

      const interval = setInterval(() => {
        if (i >= coords.length) {
          clearInterval(interval);
          return;
        }

        const progress = (i / coords.length) * 100;
        const elapsedReal = (Date.now() - startTime) / 1000;
        const eta = Math.max(realDuration - elapsedReal, 0);

        socket.emit("position", {
          coords: [coords[i][1], coords[i][0]],
          progress,
          eta: Math.round(eta),
        });

        i++;
      }, intervalTime);

      socket.on("disconnect", () => clearInterval(interval));
    } catch (err) {
      console.log("ERROR SERVER:", err);
    }
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor fullstack corriendo en puerto ${PORT}`);
});
