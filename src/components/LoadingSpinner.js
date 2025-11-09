/**
 * @file LoadingSpinner.js
 * @description Componente de spinner de carga con mensaje personalizable.
 * Proporciona feedback visual durante operaciones asíncronas.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React from 'react';
import './LoadingSpinner.css';

/**
 * Componente de spinner de carga
 * @component
 * @description Renderiza un spinner animado con mensaje de carga personalizable.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.message='Cargando...'] - Mensaje a mostrar bajo el spinner
 * 
 * @example
 * // Spinner con mensaje por defecto
 * <LoadingSpinner />
 * 
 * @example
 * // Spinner con mensaje personalizado
 * <LoadingSpinner message="Cargando casos activos..." />
 * 
 * @returns {JSX.Element} Contenedor con spinner animado y mensaje
 */
const LoadingSpinner = ({ message = 'Cargando...' }) => {
  // Renderiza spinner animado con mensaje personalizable
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
