import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = ({ cases, center = [4.6097, -74.0817], zoom = 12, height = '400px', onMarkerClick }) => {
  if (!cases || cases.length === 0) {
    return (
      <div className="map-empty" style={{ height }}>
        <p>No hay casos para mostrar en el mapa</p>
      </div>
    );
  }

  return (
    <div className="map-container-wrapper" style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {cases.map((caso) => (
          <Marker 
            key={caso.id_caso}
            position={[caso.ubicacion_latitud, caso.ubicacion_longitud]}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(caso);
                }
              }
            }}
          >
            <Popup>
              <div className="map-popup">
                <h4>{caso.nombre_desaparecido}</h4>
                <p><strong>Edad:</strong> {caso.edad_desaparecido} años</p>
                <p><strong>Ubicación:</strong> {caso.direccion_texto}</p>
                <p><strong>Estado:</strong> {caso.estado_caso}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
