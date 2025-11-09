/**
 * @file Header.js
 * @description Componente reutilizable de header con título, subtítulo y botón de retroceso opcional.
 * Se usa en todas las páginas principales para mantener consistencia visual.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React from 'react';
import './Header.css';

/**
 * Componente de header
 * @component
 * @description Renderiza un header con título, subtítulo opcional y botón de retroceso opcional.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título principal del header
 * @param {string} [props.subtitle] - Subtítulo opcional
 * @param {boolean} [props.showBack=false] - Mostrar botón de retroceso
 * @param {Function} [props.onBack] - Callback al hacer clic en el botón de retroceso
 * 
 * @example
 * // Header simple con título y subtítulo
 * <Header title="Red Esperanza" subtitle="Casos activos" />
 * 
 * @example
 * // Header con botón de retroceso
 * <Header 
 *   title="Detalle del Caso" 
 *   showBack={true} 
 *   onBack={() => navigate(-1)} 
 * />
 * 
 * @returns {JSX.Element} Header con título, subtítulo y navegación
 */
const Header = ({ title, subtitle, showBack = false, onBack }) => {
  // Renderiza header con título, subtítulo opcional y botón de retroceso condicional
  return (
    <header className="header">
      <div className="header-content">
        {showBack && (
          <button className="back-button" onClick={onBack}>
            ← 
          </button>
        )}
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;
