import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapPicker.css';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componente para manejar clics en el mapa
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

// Componente para actualizar el centro del mapa cuando cambia la posición
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 15, {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);

  return null;
}

const MapPicker = ({ initialPosition = [4.6097, -74.0817], onLocationChange, height = '300px', externalPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [mapCenter, setMapCenter] = useState(initialPosition);

  // Actualizar posición cuando viene desde el componente padre (geocoding)
  useEffect(() => {
    if (externalPosition) {
      setPosition(externalPosition);
      setMapCenter(externalPosition);
    }
  }, [externalPosition]);

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    if (onLocationChange) {
      onLocationChange(newPosition);
    }
  };

  return (
    <div className="map-picker-wrapper" style={{ height }}>
      <div className="map-picker-info">
        <p>📍 <strong>Busca una dirección arriba o haz clic en el mapa</strong> para colocar un marcador</p>
        <p className="coordinates">
          Coordenadas: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      </div>
      
      <MapContainer 
        center={initialPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={handlePositionChange} />
        <MapUpdater center={mapCenter} zoom={15} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
