/**
 * @file MapPicker.js
 * @description Componente de mapa interactivo para seleccionar ubicaciones.
 * Utiliza React-Leaflet y OpenStreetMap para mostrar y seleccionar ubicaciones en Colombia.
 * 
 * Funcionalidades:
 * - Selección de ubicación mediante click en el mapa
 * - Marcador arrastrable
 * - Sincronización con coordenadas externas (desde AddressSearch)
 * - Centrado automático al cambiar posición
 * - Zoom y navegación del mapa
 * - Visualización de coordenadas en tiempo real
 * 
 * @component
 * @requires react
 * @requires react-leaflet
 * @requires leaflet
 * @requires ./MapPicker.css
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapPicker.css';

/**
 * Fix para los iconos de Leaflet en Webpack.
 * Leaflet requiere configuración manual de los iconos en entornos de bundling.
 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Componente interno que maneja los clics en el mapa.
 * Coloca un marcador en la posición donde el usuario hace click.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<number>} props.position - Posición actual [lat, lng]
 * @param {Function} props.setPosition - Función para actualizar la posición
 * @returns {React.ReactElement|null} Marcador en la posición seleccionada
 */
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

/**
 * Componente interno que actualiza el centro del mapa cuando cambia la posición externa.
 * Utilizado cuando se selecciona una dirección desde AddressSearch.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<number>} props.center - Coordenadas del centro [lat, lng]
 * @param {number} [props.zoom] - Nivel de zoom (default: 15)
 * @returns {null} No renderiza nada, solo actualiza el mapa
 */
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

/**
 * Componente principal de selector de ubicación en mapa.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<number>} [props.initialPosition=[4.6097, -74.0817]] - Posición inicial del mapa (Bogotá por defecto)
 * @param {Function} props.onLocationChange - Callback al cambiar la ubicación
 *   Recibe la nueva posición como [lat, lng]
 * @param {string} [props.height='300px'] - Altura del contenedor del mapa
 * @param {Array<number>|null} [props.externalPosition=null] - Posición externa (desde AddressSearch)
 *   Cuando cambia, el mapa se centra automáticamente en esta posición
 * @returns {React.ReactElement} Mapa interactivo con selector de ubicación
 * 
 * @example
 * <MapPicker 
 *   initialPosition={[4.7110, -74.0721]}
 *   onLocationChange={(position) => {
 *     console.log('Nueva posición:', position);
 *   }}
 *   externalPosition={[4.6534, -74.0836]}
 *   height="400px"
 * />
 */
const MapPicker = ({ initialPosition = [4.6097, -74.0817], onLocationChange, height = '300px', externalPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [mapCenter, setMapCenter] = useState(initialPosition);

  /**
   * Effect que se ejecuta cuando cambia externalPosition.
   * Actualiza la posición y el centro del mapa cuando se selecciona
   * una dirección desde el componente AddressSearch.
   */
  useEffect(() => {
    if (externalPosition) {
      setPosition(externalPosition);
      setMapCenter(externalPosition);
    }
  }, [externalPosition]);

  /**
   * Maneja el cambio de posición y notifica al componente padre.
   * 
   * @param {Array<number>} newPosition - Nueva posición [lat, lng]
   */
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
