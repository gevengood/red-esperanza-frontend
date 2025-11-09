/**
 * @file HomePage.js
 * @description Página principal que muestra todos los casos activos en formato lista o mapa.
 * Permite alternar entre vista de lista (grid de tarjetas) y vista de mapa interactivo.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CaseCard from '../components/CaseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MapView from '../components/MapView';
import { getAllActiveCases } from '../services/caseService';
import './HomePage.css';

/**
 * Componente de página principal
 * @component
 * @description Renderiza la página de inicio con lista/mapa de casos activos.
 * Incluye toggle para alternar vistas, estados de carga y vacío, y navegación a detalles.
 * 
 * @example
 * // Uso en el router
 * <Route path="/" element={<HomePage />} />
 * 
 * @returns {JSX.Element} Página principal con header, toggle de vistas y casos activos
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Estado de casos y carga
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado de modo de vista: 'list' para grid de tarjetas, 'map' para mapa
  const [viewMode, setViewMode] = useState('list');

  // Carga inicial de casos al montar el componente
  useEffect(() => {
    loadCases();
  }, []);

  /**
   * Carga todos los casos activos desde el backend
   * @function loadCases
   * @description Obtiene los casos con estado 'desaparecido' y actualiza el estado
   * @async
   */
  const loadCases = async () => {
    setLoading(true);
    try {
      const activeCases = await getAllActiveCases();
      setCases(activeCases);
    } catch (error) {
      console.error('Error al cargar casos:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el clic en un marcador del mapa
   * @function handleMarkerClick
   * @description Navega a la página de detalle del caso seleccionado
   * @param {Object} caso - Objeto del caso clickeado
   * @param {number} caso.id_caso - ID del caso
   */
  const handleMarkerClick = (caso) => {
    navigate(`/caso/${caso.id_caso}`);
  };

  // Protección: no renderiza si el usuario no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  // Renderiza la página con header, toggle de vistas y lista/mapa de casos
  return (
    <div className="home-page">
      <Header 
        title="Red Esperanza" 
        subtitle="Casos activos en tu comunidad"
      />

      <div className="home-content">
        <div className="view-toggle">
          <button 
            className={viewMode === 'list' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setViewMode('list')}
          >
            📋 Lista
          </button>
          <button 
            className={viewMode === 'map' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setViewMode('map')}
          >
            🗺️ Mapa
          </button>
        </div>

        {viewMode === 'map' && (
          <div className="map-container">
            {loading ? (
              <LoadingSpinner message="Cargando mapa..." />
            ) : (
              <MapView 
                cases={cases}
                height="400px"
                onMarkerClick={handleMarkerClick}
              />
            )}
          </div>
        )}

        <div className="cases-section">
          <h2 className="section-title">
            {viewMode === 'map' ? 'Casos en el mapa' : 'Casos Recientes'}
          </h2>

          {loading ? (
            <LoadingSpinner message="Cargando casos activos..." />
          ) : cases.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h3>No hay casos activos</h3>
              <p>¡Excelente noticia! No hay reportes de desapariciones en este momento.</p>
            </div>
          ) : (
            <div className="cases-grid">
              {cases.map(caso => (
                <CaseCard key={caso.id_caso} caso={caso} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
