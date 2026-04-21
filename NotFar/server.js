import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.static(path.join(__dirname, "dist")));

const API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBhODZkYmZhMDAyMjRmNWI4ZGNjMmQzMTU3YzU4MjI5IiwiaCI6Im11cm11cjY0In0=";

io.on("connection", (socket) => {
  socket.on("startRoute", async ({ start, end }) => {
    try {
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
      if (!data.features) return;

      const coords = data.features[0].geometry.coordinates;
      const duration = data.features[0].properties.summary.duration;

      socket.emit(
        "route",
        coords.map((c) => [c[1], c[0]]),
      );

      let i = 0;
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (i >= coords.length) {
          clearInterval(interval);
          return;
        }

        const progress = (i / coords.length) * 100;
        const elapsedReal = (Date.now() - startTime) / 1000;
        const eta = Math.max(duration - elapsedReal, 0);

        socket.emit("position", {
          coords: [coords[i][1], coords[i][0]],
          progress,
          eta: Math.round(eta),
        });

        i++;
      }, 500);

      socket.on("disconnect", () => clearInterval(interval));
    } catch (err) {
      console.log(err);
    }
  });
});

app.get("(.*)", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor fullstack corriendo en puerto ${PORT}`);
});
