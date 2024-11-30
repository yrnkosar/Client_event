import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Polyline, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';

const MapComponent = ({ geoJsonData, routeData, latitude, longitude }) => {
  const [geojsonData, setGeojsonData] = useState(null);

  // GeoJSON verisini işleyip state'e aktar
  useEffect(() => {
    if (routeData) {
      const geoData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: routeData.geometry.coordinates,
            },
            properties: {
              summary: routeData.legs[0]?.summary || "No summary",
            },
          },
        ],
      };
      setGeojsonData(geoData);
    }
  }, [routeData]);

  // GeoJSON rotalarını stilize eden fonksiyon
  const getStyle = (feature) => {
    switch (feature.properties.weight_name) {
      case 'auto':
        return { color: 'red', weight: 3 };
      case 'pedestrian':
        return { color: 'green', weight: 3 };
      case 'cyclability':
        return { color: 'blue', weight: 3 };
      default:
        return { color: 'blue', weight: 3 };
    }
  };

  return (
    <MapContainer
      center={latitude && longitude ? [latitude, longitude] : [40.984365, 29.043857]} // Varsayılan merkez veya kullanıcının konumu
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      {geoJsonData && (
        // GeoJSON verisi varsa rotaları çiz
        <GeoJSON data={geoJsonData} style={getStyle} />
      )}

      {routeData && (
        // Route verisi varsa Polyline ile çiz
        <Polyline
          positions={routeData.geometry.coordinates.map(([lng, lat]) => [lat, lng])} // Longitude ve Latitude dönüşümü
          color="blue"
        />
      )}

      {!geoJsonData && !routeData && latitude && longitude && (
        // Eğer GeoJSON veya route yoksa Marker ile konumu göster
        <Marker position={[latitude, longitude]}>
          <Popup>Bu konumda yer alıyorsunuz</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
