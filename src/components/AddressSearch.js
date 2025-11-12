/**
 * @file AddressSearch.js
 * @description Componente de búsqueda de direcciones con geocodificación.
 * Utiliza la API de Nominatim (OpenStreetMap) para búsqueda y geocodificación inversa.
 * 
 * Funcionalidades:
 * - Búsqueda de direcciones con autocompletado
 * - Geolocalización GPS del navegador
 * - Geocodificación inversa (coordenadas → dirección)
 * - Botones rápidos para ciudades principales de Colombia
 * - Debounce para optimizar peticiones
 * - Cierre automático de sugerencias al hacer click fuera
 * 
 * @component
 * @requires react
 * @requires ./AddressSearch.css
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React, { useState, useEffect, useRef } from 'react';
import './AddressSearch.css';

/**
 * Componente de búsqueda de direcciones con geocodificación.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSelectAddress - Callback al seleccionar una dirección
 *   Recibe (lat, lng, address) donde address es el texto de la dirección
 * @param {string} [props.initialAddress=''] - Dirección inicial para el input
 * @returns {React.ReactElement} Componente de búsqueda de direcciones
 * 
 * @example
 * <AddressSearch 
 *   onSelectAddress={(lat, lng, address) => {
 *     console.log('Ubicación:', lat, lng);
 *     console.log('Dirección:', address);
 *   }}
 *   initialAddress="Bogotá, Colombia"
 * />
 */
const AddressSearch = ({ onSelectAddress, initialAddress = '' }) => {
  const [query, setQuery] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);

  /**
   * Effect para cerrar las sugerencias cuando se hace click fuera del componente.
   * Maneja el evento de mousedown globalmente.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Busca direcciones usando la API de Nominatim (OpenStreetMap).
   * Filtra resultados solo para Colombia (countrycodes=co).
   * 
   * @async
   * @param {string} searchQuery - Texto de búsqueda (mínimo 3 caracteres)
   * @returns {Promise<void>}
   */
  const searchAddress = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      // Agregar "Colombia" si no está incluido
      let enhancedQuery = searchQuery;
      if (!searchQuery.toLowerCase().includes('colombia')) {
        enhancedQuery = `${searchQuery}, Colombia`;
      }

      // Nominatim API - OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(enhancedQuery)}&` +
        `countrycodes=co&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=10&` +
        `accept-language=es`
      );

      if (!response.ok) {
        throw new Error('Error al buscar direcciones');
      }

      const data = await response.json();
      
      // Formatear resultados
      const formattedSuggestions = data.map(item => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: item.address,
        type: item.type,
        importance: item.importance
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error buscando direcciones:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene la ubicación actual del usuario usando la API de Geolocalización del navegador.
   * Solicita permisos al usuario para acceder a su ubicación GPS.
   * Una vez obtenidas las coordenadas, usa geocodificación inversa para obtener la dirección.
   * 
   * @returns {void}
   */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        console.log('📍 Geolocalización obtenida del navegador:');
        console.log('Latitud:', latitude);
        console.log('Longitud:', longitude);
        console.log('Precisión:', position.coords.accuracy, 'metros');
        
        // Advertir si la precisión es baja (más de 100 metros)
        if (position.coords.accuracy > 100) {
          alert(
            `⚠️ Precisión de GPS baja (${Math.round(position.coords.accuracy)} metros).\n\n` +
            `Por favor, ajusta el marcador en el mapa para mayor exactitud.`
          );
        }
        
        try {
          // Geocodificación inversa: convertir coordenadas a dirección
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
            `lat=${latitude}&` +
            `lon=${longitude}&` +
            `format=json&` +
            `addressdetails=1&` +
            `accept-language=es`
          );

          if (!response.ok) {
            throw new Error('Error al obtener dirección');
          }

          const data = await response.json();
          
          // Formatear la dirección obtenida
          let addressText = data.display_name;
          
          // Usar la dirección formateada
          setQuery(addressText);
          
          // Callback con la ubicación
          console.log('📤 Enviando datos al formulario:');
          console.log('Dirección:', addressText);
          console.log('Latitud:', latitude);
          console.log('Longitud:', longitude);
          
          onSelectAddress({
            address: addressText,
            latitude: latitude,
            longitude: longitude,
            details: data.address
          });
          
        } catch (error) {
          console.error('Error obteniendo dirección:', error);
          // Aunque falle el reverse geocoding, enviamos las coordenadas
          onSelectAddress({
            address: `Ubicación GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            latitude: latitude,
            longitude: longitude,
            details: {}
          });
          setQuery(`Ubicación GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        let errorMessage = 'Error al obtener ubicación';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Por favor, activa los permisos de ubicación.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible en este momento.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado al obtener ubicación.';
            break;
          default:
            errorMessage = 'Error desconocido al obtener ubicación.';
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce para no hacer muchas peticiones
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchAddress(value);
    }, 500); // Esperar 500ms después de que el usuario deje de escribir
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);

    // Callback con la ubicación seleccionada
    onSelectAddress({
      address: suggestion.display_name,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
      details: suggestion.address
    });
  };

  const handleClearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="address-search-container" ref={wrapperRef}>
      <div className="search-input-wrapper">
        <div className="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        <input
          type="text"
          className="address-search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Busca ciudad, barrio o lugar en Colombia..."
        />

        {query && !loading && !gettingLocation && (
          <button 
            className="clear-search-btn"
            onClick={handleClearSearch}
            type="button"
            title="Limpiar búsqueda"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        <button
          className="gps-btn"
          onClick={getCurrentLocation}
          type="button"
          disabled={gettingLocation}
          title="Usar mi ubicación actual"
        >
          {gettingLocation ? (
            <div className="spinner-small"></div>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              <line x1="12" y1="2" x2="12" y2="6" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="18" x2="12" y2="22" strokeWidth="2" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="6" y2="12" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18" y1="12" x2="22" y2="12" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        {loading && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <div className="suggestion-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" strokeWidth="2"/>
                </svg>
              </div>
              <div className="suggestion-content">
                <div className="suggestion-name">{suggestion.display_name}</div>
                <div className="suggestion-type">
                  {suggestion.type} • {suggestion.address?.city || suggestion.address?.town || 'Colombia'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && query.length >= 3 && !loading && (
        <div className="suggestions-dropdown">
          <div className="no-results">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>No se encontraron direcciones</p>
            <small>Intenta con otra búsqueda</small>
          </div>
        </div>
      )}

      <div className="search-hint">
        💡 <strong>Tip:</strong> Busca por ciudad/barrio o usa el botón GPS 📍 para tu ubicación actual
      </div>

      {!query && (
        <div className="quick-suggestions">
          <small style={{ color: '#718096', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Búsquedas rápidas:
          </small>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Cúcuta', 'Pereira'].map(city => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setQuery(city);
                  searchAddress(city);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#fef5f3',
                  border: '1px solid #fdd4cd',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#E85948',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#fdd4cd';
                  e.target.style.borderColor = '#FF6B5A';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#fef5f3';
                  e.target.style.borderColor = '#fdd4cd';
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
