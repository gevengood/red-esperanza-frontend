import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { 
  getCaseById, 
  updateCaseStatus, 
  deleteCase,
  getCluesByCaseId,
  createClue 
} from '../services/caseService';
import './CaseDetailPage.css';

const CaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  
  const [caso, setCaso] = useState(null);
  const [clues, setClues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClueModal, setShowClueModal] = useState(false);
  const [clueMessage, setClueMessage] = useState('');
  const [submittingClue, setSubmittingClue] = useState(false);

  useEffect(() => {
    loadCaseData();
  }, [id]);

  const loadCaseData = async () => {
    setLoading(true);
    try {
      const caseData = await getCaseById(id);
      setCaso(caseData);
      
      // Cargar pistas (el backend filtra según el rol del usuario)
      const cluesData = await getCluesByCaseId(id);
      setClues(cluesData);
    } catch (error) {
      console.error('Error al cargar caso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) {
      return;
    }

    try {
      await updateCaseStatus(id, newStatus);
      await loadCaseData();
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este caso? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await deleteCase(id);
      alert('Caso eliminado correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar caso:', error);
      alert('Error al eliminar el caso');
    }
  };

  const handleSubmitClue = async (e) => {
    e.preventDefault();
    
    if (!clueMessage.trim()) {
      alert('Por favor escribe tu información');
      return;
    }

    setSubmittingClue(true);
    try {
      await createClue({
        id_caso: id,
        mensaje: clueMessage,
        url_foto_pista: null
      });
      
      alert('¡Gracias! Tu información ha sido enviada al equipo de Red Esperanza.');
      setClueMessage('');
      setShowClueModal(false);
      
      // Recargar pistas para ver las verificadas
      const cluesData = await getCluesByCaseId(id);
      setClues(cluesData);
    } catch (error) {
      console.error('Error al enviar pista:', error);
      alert('Error al enviar la información');
    } finally {
      setSubmittingClue(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      'ACTIVO': { label: 'Activo', className: 'status-active' },
      'PENDIENTE_REVISION': { label: 'Pendiente Revisión', className: 'status-pending' },
      'RESUELTO': { label: 'Resuelto', className: 'status-resolved' },
      'RECHAZADO': { label: 'Rechazado', className: 'status-rejected' }
    };

    const config = statusConfig[estado] || { label: estado, className: 'status-default' };

    return (
      <span className={`status-badge-large ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="case-detail-page">
        <Header title="Cargando..." showBack onBack={() => navigate(-1)} />
        <LoadingSpinner message="Cargando información del caso..." />
      </div>
    );
  }

  if (!caso) {
    return (
      <div className="case-detail-page">
        <Header title="Caso no encontrado" showBack onBack={() => navigate(-1)} />
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Caso no encontrado</h3>
          <p>El caso que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="case-detail-page">
      <Header 
        title={caso.nombre_desaparecido} 
        showBack 
        onBack={() => navigate(-1)} 
      />

      <div className="case-detail-content">
        <div className="case-status-header">
          {getStatusBadge(caso.estado_caso)}
        </div>

        {/* Galería de fotos */}
        <div className="photo-gallery">
          {caso.url_foto_1 && (
            <img 
              src={caso.url_foto_1} 
              alt={`${caso.nombre_desaparecido} 1`}
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Foto+No+Disponible'}
            />
          )}
          {caso.url_foto_2 && (
            <img 
              src={caso.url_foto_2} 
              alt={`${caso.nombre_desaparecido} 2`}
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Foto+No+Disponible'}
            />
          )}
          {caso.url_foto_3 && (
            <img 
              src={caso.url_foto_3} 
              alt={`${caso.nombre_desaparecido} 3`}
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Foto+No+Disponible'}
            />
          )}
        </div>

        {/* Información básica */}
        <div className="info-card">
          <h3 className="card-title">Información Básica</h3>
          <div className="info-row">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{caso.nombre_desaparecido}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Edad:</span>
            <span className="info-value">{caso.edad_desaparecido} años</span>
          </div>
          <div className="info-row">
            <span className="info-label">Sexo:</span>
            <span className="info-value">{caso.sexo_desaparecido === 'MASCULINO' ? 'Masculino' : 'Femenino'}</span>
          </div>
        </div>

        {/* Descripción física */}
        <div className="info-card">
          <h3 className="card-title">Descripción Física</h3>
          <p className="description-text">{caso.descripcion_fisica}</p>
        </div>

        {/* Ropa */}
        <div className="info-card">
          <h3 className="card-title">Vestimenta</h3>
          <p className="description-text">{caso.descripcion_ropa}</p>
        </div>

        {/* Lugar y fecha */}
        <div className="info-card">
          <h3 className="card-title">Lugar y Fecha de Desaparición</h3>
          <div className="info-row">
            <span className="info-label">📍 Ubicación:</span>
            <span className="info-value">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${caso.ubicacion_latitud},${caso.ubicacion_longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
                title="Ver en Google Maps"
              >
                {caso.direccion_texto}
              </a>
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">🕐 Fecha y Hora:</span>
            <span className="info-value">{formatDate(caso.fecha_desaparicion)}</span>
          </div>
        </div>

        {/* Hechos */}
        <div className="info-card">
          <h3 className="card-title">Descripción de Hechos</h3>
          <p className="description-text">{caso.descripcion_hechos}</p>
        </div>

        {/* Información de contacto - Solo para admin */}
        {isAdmin() && (
          <div className="info-card admin-only">
            <h3 className="card-title">🔒 Información de Contacto (Solo Admin)</h3>
            <div className="info-row">
              <span className="info-label">Reportado por:</span>
              <span className="info-value">{caso.nombre_contacto} ({caso.parentesco})</span>
            </div>
            <div className="info-row">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{caso.telefono_contacto}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Correo:</span>
              <span className="info-value">{caso.correo_contacto}</span>
            </div>
          </div>
        )}

        {/* Pistas verificadas (todos las ven) / Todas las pistas (solo admin) */}
        {clues.length > 0 && (
          <div className={`info-card ${isAdmin() ? 'admin-only' : ''}`}>
            <h3 className="card-title">
              🔍 {isAdmin() ? 'Todas las Pistas' : 'Información Verificada'} ({clues.length})
            </h3>
            {clues.map(clue => (
              <div key={clue.id_pista} className="clue-item">
                <div className="clue-header">
                  {isAdmin() && (
                    <span className={`clue-status ${clue.estado_pista.toLowerCase()}`}>
                      {clue.estado_pista}
                    </span>
                  )}
                  <span className="clue-date">{formatDate(clue.fecha_creacion)}</span>
                </div>
                <p className="clue-message">{clue.mensaje}</p>
              </div>
            ))}
          </div>
        )}

        {/* Botón para aportar pista - Solo usuarios normales en casos activos */}
        {!isAdmin() && caso.estado_caso === 'ACTIVO' && (
          <button className="clue-button" onClick={() => setShowClueModal(true)}>
            💡 Tengo información de este caso
          </button>
        )}

        {/* Botones de administración */}
        {isAdmin() && (
          <div className="admin-actions">
            <h3 className="card-title">Acciones de Administración</h3>
            <div className="admin-buttons">
              {caso.estado_caso === 'PENDIENTE_REVISION' && (
                <>
                  <button 
                    className="admin-btn approve"
                    onClick={() => handleStatusChange('ACTIVO')}
                  >
                    ✓ Aprobar Caso
                  </button>
                  <button 
                    className="admin-btn reject"
                    onClick={() => handleStatusChange('RECHAZADO')}
                  >
                    ✕ Rechazar Caso
                  </button>
                </>
              )}
              
              {caso.estado_caso === 'ACTIVO' && (
                <button 
                  className="admin-btn resolve"
                  onClick={() => handleStatusChange('RESUELTO')}
                >
                  🎉 Marcar como Resuelto
                </button>
              )}

              <button 
                className="admin-btn delete"
                onClick={handleDelete}
              >
                🗑️ Eliminar Caso
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para aportar pista */}
      <Modal
        isOpen={showClueModal}
        onClose={() => setShowClueModal(false)}
        title="Aportar Información"
      >
        <form onSubmit={handleSubmitClue} className="clue-form">
          <p className="clue-form-description">
            Tu información será revisada por el equipo de Red Esperanza antes de compartirla con la familia.
          </p>
          
          <textarea
            value={clueMessage}
            onChange={(e) => setClueMessage(e.target.value)}
            placeholder="Describe lo que viste o sabes sobre este caso..."
            rows="6"
            required
            disabled={submittingClue}
            className="clue-textarea"
          />

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => setShowClueModal(false)}
              disabled={submittingClue}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={submittingClue}
              className="btn-primary"
            >
              {submittingClue ? 'Enviando...' : 'Enviar Información'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CaseDetailPage;
