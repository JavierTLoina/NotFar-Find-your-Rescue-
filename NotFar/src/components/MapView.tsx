import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({
  posicion,
  ruta,
}: {
  posicion: [number, number] | null;
  ruta: [number, number][];
}) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setUserLocation([18.4861, -69.9312]);
      },
    );
  }, []);

  return (
    <MapContainer
      center={userLocation || [18.4861, -69.9312]}
      zoom={15}
      style={{ height: "400px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Tu ubicación</Popup>
        </Marker>
      )}

      {posicion && (
        <Marker position={posicion}>
          <Popup>Técnico</Popup>
        </Marker>
      )}

      {ruta.length > 0 && <Polyline positions={ruta} color="#0078d4" />}
    </MapContainer>
  );
}
