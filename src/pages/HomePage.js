import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CaseCard from '../components/CaseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MapView from '../components/MapView';
import { getAllActiveCases } from '../services/caseService';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'map'

  useEffect(() => {
    loadCases();
  }, []);

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

  const handleMarkerClick = (caso) => {
    navigate(`/caso/${caso.id_caso}`);
  };

  if (!isAuthenticated) {
    return null;
  }

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
