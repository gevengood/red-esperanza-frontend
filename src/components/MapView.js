/**
 * @file MapView.js
 * @description Componente de mapa interactivo que muestra múltiples casos con marcadores.
 * Utiliza Leaflet y react-leaflet para renderizar mapas con OpenStreetMap y popups informativos.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix para los iconos de Leaflet en React (problema conocido con webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Componente de vista de mapa con marcadores
 * @component
 * @description Renderiza un mapa interactivo de Leaflet con marcadores para cada caso.
 * Incluye popups con información del caso y callback opcional al hacer clic en marcadores.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.cases - Array de casos a mostrar en el mapa
 * @param {number} props.cases[].id_caso - ID del caso
 * @param {number} props.cases[].ubicacion_latitud - Latitud del caso
 * @param {number} props.cases[].ubicacion_longitud - Longitud del caso
 * @param {string} props.cases[].nombre_desaparecido - Nombre del desaparecido
 * @param {number} props.cases[].edad_desaparecido - Edad en años
 * @param {string} props.cases[].direccion_texto - Dirección textual
 * @param {string} props.cases[].estado_caso - Estado del caso
 * @param {Array<number>} [props.center=[4.6097, -74.0817]] - Coordenadas del centro del mapa (Bogotá por defecto)
 * @param {number} [props.zoom=12] - Nivel de zoom inicial
 * @param {string} [props.height='400px'] - Altura del contenedor del mapa
 * @param {Function} [props.onMarkerClick] - Callback al hacer clic en un marcador
 * 
 * @example
 * // Uso en HomePage con callback
 * <MapView 
 *   cases={cases} 
 *   height="400px" 
 *   onMarkerClick={(caso) => navigate(`/caso/${caso.id_caso}`)} 
 * />
 * 
 * @returns {JSX.Element} Mapa con marcadores y popups, o mensaje vacío si no hay casos
 */
const MapView = ({ cases, center = [4.6097, -74.0817], zoom = 12, height = '400px', onMarkerClick }) => {
  // Maneja estado vacío cuando no hay casos
  if (!cases || cases.length === 0) {
    return (
      <div className="map-empty" style={{ height }}>
        <p>No hay casos para mostrar en el mapa</p>
      </div>
    );
  }

  // Renderiza mapa con tiles de OpenStreetMap y marcadores clickeables con popups
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
