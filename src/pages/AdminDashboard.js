import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  getAllCases, 
  getAllClues, 
  getStatistics,
  updateClueStatus 
} from '../services/caseService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [cases, setCases] = useState([]);
  const [clues, setClues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, cases, clues

  useEffect(() => {
    if (!isAdmin()) return;
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [casesData, cluesData, statsData] = await Promise.all([
        getAllCases(),
        getAllClues(),
        getStatistics()
      ]);
      
      setCases(casesData);
      setClues(cluesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClueStatusChange = async (clueId, newStatus) => {
    try {
      await updateClueStatus(clueId, newStatus);
      await loadAdminData();
      alert('Estado de la pista actualizado');
    } catch (error) {
      console.error('Error al actualizar pista:', error);
      alert('Error al actualizar la pista');
    }
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      'ACTIVO': { label: 'Activo', className: 'badge-active' },
      'PENDIENTE_REVISION': { label: 'Pendiente', className: 'badge-pending' },
      'RESUELTO': { label: 'Resuelto', className: 'badge-resolved' },
      'RECHAZADO': { label: 'Rechazado', className: 'badge-rejected' }
    };

    const config = statusConfig[estado] || { label: estado, className: 'badge-default' };

    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const getClueStatusBadge = (estado) => {
    const statusConfig = {
      'PENDIENTE_REVISION': { label: 'Pendiente', className: 'badge-pending' },
      'VERIFICADA': { label: 'Verificada', className: 'badge-verified' },
      'DESCARTADA': { label: 'Descartada', className: 'badge-discarded' }
    };

    const config = statusConfig[estado] || { label: estado, className: 'badge-default' };

    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdmin()) {
    return (
      <div className="admin-dashboard">
        <Header title="Acceso Denegado" />
        <div className="access-denied">
          <div className="denied-icon">🚫</div>
          <h3>Acceso Denegado</h3>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Header title="Panel de Administración" />
        <LoadingSpinner message="Cargando datos del panel..." />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Header 
        title="Panel de Administración" 
        subtitle="Gestión de casos y pistas"
      />

      <div className="admin-content">
        {/* Pestañas */}
        <div className="admin-tabs">
          <button 
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            📊 Resumen
          </button>
          <button 
            className={activeTab === 'cases' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('cases')}
          >
            📋 Casos ({cases.length})
          </button>
          <button 
            className={activeTab === 'clues' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('clues')}
          >
            🔍 Pistas ({clues.filter(c => c.estado_pista === 'PENDIENTE_REVISION').length})
          </button>
        </div>

        {/* Tab: Resumen */}
        {activeTab === 'overview' && stats && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.total_casos}</div>
                  <div className="stat-label">Total de Casos</div>
                </div>
              </div>

              <div className="stat-card highlight">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.casos_pendientes}</div>
                  <div className="stat-label">Pendientes Revisión</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔴</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.casos_activos}</div>
                  <div className="stat-label">Casos Activos</div>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.casos_resueltos}</div>
                  <div className="stat-label">Casos Resueltos</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💡</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.total_pistas}</div>
                  <div className="stat-label">Total de Pistas</div>
                </div>
              </div>

              <div className="stat-card highlight">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.pistas_pendientes}</div>
                  <div className="stat-label">Pistas Pendientes</div>
                </div>
              </div>
            </div>

            {/* Casos que requieren atención */}
            <div className="attention-section">
              <h3 className="section-title">⚠️ Requieren Atención Inmediata</h3>
              
              {cases.filter(c => c.estado_caso === 'PENDIENTE_REVISION').length === 0 ? (
                <div className="empty-message">
                  <p>✅ No hay casos pendientes de revisión</p>
                </div>
              ) : (
                <div className="cases-list">
                  {cases
                    .filter(c => c.estado_caso === 'PENDIENTE_REVISION')
                    .map(caso => (
                      <Link key={caso.id_caso} to={`/caso/${caso.id_caso}`} className="case-item">
                        <div className="case-item-header">
                          <h4>{caso.nombre_desaparecido}</h4>
                          {getStatusBadge(caso.estado_caso)}
                        </div>
                        <p className="case-item-detail">
                          📅 Reportado: {formatDate(caso.fecha_creacion)}
                        </p>
                        <p className="case-item-detail">
                          📍 {caso.direccion_texto}
                        </p>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Casos */}
        {activeTab === 'cases' && (
          <div className="cases-tab">
            <div className="filter-section">
              <h3 className="section-title">Todos los Casos</h3>
            </div>

            {cases.length === 0 ? (
              <div className="empty-message">
                <p>No hay casos registrados</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Edad</th>
                      <th>Ubicación</th>
                      <th>Estado</th>
                      <th>Fecha Reporte</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map(caso => (
                      <tr key={caso.id_caso}>
                        <td>#{caso.id_caso}</td>
                        <td><strong>{caso.nombre_desaparecido}</strong></td>
                        <td>{caso.edad_desaparecido} años</td>
                        <td>{caso.direccion_texto.substring(0, 40)}...</td>
                        <td>{getStatusBadge(caso.estado_caso)}</td>
                        <td>{formatDate(caso.fecha_creacion)}</td>
                        <td>
                          <Link to={`/caso/${caso.id_caso}`} className="action-btn">
                            Ver Detalle →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Pistas */}
        {activeTab === 'clues' && (
          <div className="clues-tab">
            <div className="filter-section">
              <h3 className="section-title">Pistas Recibidas</h3>
            </div>

            {clues.length === 0 ? (
              <div className="empty-message">
                <p>No hay pistas registradas</p>
              </div>
            ) : (
              <div className="clues-list">
                {clues.map(pista => {
                  const relatedCase = cases.find(c => c.id_caso === pista.id_caso);
                  
                  return (
                    <div key={pista.id_pista} className="clue-card">
                      <div className="clue-header">
                        <div>
                          <h4>Pista #{pista.id_pista}</h4>
                          <p className="clue-case-info">
                            Para caso: <Link to={`/caso/${pista.id_caso}`}>
                              {relatedCase?.nombre_desaparecido || `Caso #${pista.id_caso}`}
                            </Link>
                          </p>
                        </div>
                        {getClueStatusBadge(pista.estado_pista)}
                      </div>

                      <div className="clue-body">
                        <p className="clue-message">{pista.mensaje}</p>
                        <p className="clue-date">📅 {formatDate(pista.fecha_creacion)}</p>
                      </div>

                      {pista.estado_pista === 'PENDIENTE_REVISION' && (
                        <div className="clue-actions">
                          <button 
                            className="clue-action-btn verify"
                            onClick={() => handleClueStatusChange(pista.id_pista, 'VERIFICADA')}
                          >
                            ✓ Verificar
                          </button>
                          <button 
                            className="clue-action-btn discard"
                            onClick={() => handleClueStatusChange(pista.id_pista, 'DESCARTADA')}
                          >
                            ✕ Descartar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
