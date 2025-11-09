import React from 'react';
import { Link } from 'react-router-dom';
import './CaseCard.css';

const CaseCard = ({ caso, showStatus = false }) => {
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
      'PENDIENTE_REVISION': { label: 'Pendiente', className: 'status-pending' },
      'RESUELTO': { label: 'Resuelto', className: 'status-resolved' },
      'RECHAZADO': { label: 'Rechazado', className: 'status-rejected' }
    };

    const config = statusConfig[estado] || { label: estado, className: 'status-default' };

    return (
      <span className={`status-badge ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getAgeText = (edad) => {
    return edad === 1 ? '1 año' : `${edad} años`;
  };

  return (
    <Link to={`/caso/${caso.id_caso}`} className="case-card-link">
      <div className="case-card">
        <div className="case-card-image">
          {caso.url_foto_1 ? (
            <img 
              src={caso.url_foto_1} 
              alt={caso.nombre_desaparecido}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Foto+No+Disponible';
              }}
            />
          ) : (
            <div className="case-card-placeholder">
              <span>📷</span>
              <p>Sin foto</p>
            </div>
          )}
          {showStatus && (
            <div className="case-card-status">
              {getStatusBadge(caso.estado_caso)}
            </div>
          )}
        </div>
        
        <div className="case-card-content">
          <h3 className="case-card-title">{caso.nombre_desaparecido}</h3>
          
          <div className="case-card-info">
            <p className="case-card-detail">
              <span className="detail-icon">👤</span>
              {getAgeText(caso.edad_desaparecido)} • {caso.sexo_desaparecido === 'MASCULINO' ? 'Niño' : 'Niña'}
            </p>
            
            <p className="case-card-detail">
              <span className="detail-icon">📍</span>
              {caso.direccion_texto}
            </p>
            
            <p className="case-card-detail">
              <span className="detail-icon">🕐</span>
              {formatDate(caso.fecha_desaparicion)}
            </p>
          </div>

          <div className="case-card-description">
            <p>{caso.descripcion_fisica.substring(0, 100)}...</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CaseCard;
