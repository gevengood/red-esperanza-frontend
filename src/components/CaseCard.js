/**
 * @file CaseCard.js
 * @description Tarjeta de caso con información resumida del desaparecido.
 * Componente reutilizable para mostrar casos en listas, grids y perfiles.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './CaseCard.css';

/**
 * Componente de tarjeta de caso
 * @component
 * @description Renderiza una tarjeta con foto, nombre, edad, sexo, ubicación y fecha del caso.
 * Incluye badge de estado opcional y link al detalle completo.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.caso - Objeto del caso a mostrar
 * @param {number} props.caso.id_caso - ID único del caso
 * @param {string} props.caso.nombre_desaparecido - Nombre del desaparecido
 * @param {number} props.caso.edad_desaparecido - Edad en años
 * @param {string} props.caso.sexo_desaparecido - "MASCULINO" o "FEMENINO"
 * @param {string} props.caso.direccion_texto - Dirección de desaparición
 * @param {string} props.caso.fecha_desaparicion - Fecha ISO de desaparición
 * @param {string} [props.caso.url_foto_1] - URL de la foto principal
 * @param {string} [props.caso.estado_caso] - Estado del caso (ACTIVO, RESUELTO, etc.)
 * @param {boolean} [props.showStatus=false] - Mostrar badge de estado sobre la foto
 * 
 * @example
 * // Uso en HomePage
 * <CaseCard caso={caseData} />
 * 
 * @example
 * // Uso en ProfilePage con estado
 * <CaseCard caso={caseData} showStatus={true} />
 * 
 * @returns {JSX.Element} Tarjeta clickeable que navega al detalle del caso
 */
const CaseCard = ({ caso, showStatus = false }) => {
  /**
   * Formatea fecha a formato legible español
   * @function formatDate
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada (ej: "15 de noviembre de 2024, 14:30")
   */
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

  /**
   * Genera el badge de estado del caso
   * @function getStatusBadge
   * @param {string} estado - Estado del caso (ACTIVO, PENDIENTE_REVISION, RESUELTO, RECHAZADO)
   * @returns {JSX.Element} Badge con estilo específico según el estado
   */
  const getStatusBadge = (estado) => {
    // Configuración de estilos para cada estado del caso
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

  /**
   * Formatea el texto de edad con plural correcto
   * @function getAgeText
   * @param {number} edad - Edad en años
   * @returns {string} Texto formateado ("1 año" o "X años")
   */
  const getAgeText = (edad) => {
    return edad === 1 ? '1 año' : `${edad} años`;
  };

  // Renderiza tarjeta clickeable con foto, info resumida y link al detalle
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
              <span 
                className="map-link-inline"
                title="Click para ver en Google Maps"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${caso.ubicacion_latitud},${caso.ubicacion_longitud}`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
                style={{ cursor: 'pointer' }}
              >
                {caso.direccion_texto}
              </span>
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
