import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../styles/EventMap.module.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const EventMap = ({ events }) => {
  const defaultPosition = [41.0082, 28.9784];

  if (!Array.isArray(events)) {
    console.error("events prop is not an array:", events);
    return <div>Harita yüklenemedi. Geçersiz etkinlik verisi.</div>;
  }

  return (
    <div className={styles.mapContainer}>
      <MapContainer center={defaultPosition} zoom={10} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.map((event) => {
          if (event.latitude !== undefined && event.longitude !== undefined) {
            return (
              <Marker
                key={event.id}
                position={[event.latitude, event.longitude]}
              >
                <Popup>
                  <h3>{event.name}</h3>
                  <p>{event.category}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                </Popup>
              </Marker>
            );
          } else {
            console.warn(`Eksik konum: ${event.name}`);
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
};

export default EventMap;
