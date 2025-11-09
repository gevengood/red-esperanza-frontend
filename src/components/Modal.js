/**
 * @file Modal.js
 * @description Componente de modal reutilizable con overlay y cierre por clic fuera.
 * Útil para mostrar contenido emergente como formularios, confirmaciones y detalles.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React from 'react';
import './Modal.css';

/**
 * Componente de modal
 * @component
 * @description Renderiza un modal centrado con overlay oscuro, título y botón de cierre.
 * Se puede cerrar haciendo clic en el overlay o en el botón X.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback al cerrar el modal
 * @param {string} props.title - Título del modal
 * @param {React.ReactNode} props.children - Contenido del modal
 * 
 * @example
 * // Modal con formulario
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Agregar Pista">
 *   <form>...</form>
 * </Modal>
 * 
 * @returns {JSX.Element|null} Modal con overlay y contenido, o null si no está abierto
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // No renderiza nada si el modal no está abierto
  if (!isOpen) return null;

  /**
   * Maneja el clic en el overlay para cerrar el modal
   * @function handleOverlayClick
   * @description Cierra el modal solo si se hace clic en el overlay, no en el contenido
   * @param {Event} e - Evento del clic
   */
  const handleOverlayClick = (e) => {
    // Solo cierra si se hizo clic en el overlay, no en el contenido
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Renderiza modal con overlay, header con título/cierre, y contenido
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
