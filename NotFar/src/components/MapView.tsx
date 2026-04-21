import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const coords: Record<string, [number, number]> = {
  A: [18.4861, -69.9312],
  B: [18.487, -69.932],
  C: [18.488, -69.933],
  D: [18.489, -69.934],
};

export default function MapView({ posicion }: { posicion: string | null }) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        console.log("No se pudo obtener ubicación");
      },
    );
  }, []);

  const center = userLocation || [18.4861, -69.9312];

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Tu ubicación</Popup>
        </Marker>
      )}

      {posicion && (
        <Marker position={coords[posicion]}>
          <Popup>Técnico en camino</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
