/**
 * @file Navbar.js
 * @description Barra de navegación inferior con enlaces principales y detección de ruta activa.
 * Incluye íconos SVG personalizados y solo se muestra para usuarios autenticados.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Componente de ícono de inicio
 * @component
 * @description Renderiza ícono SVG de casa para la navegación de inicio
 * @returns {JSX.Element} Ícono SVG de inicio
 */
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

/**
 * Componente de ícono de reporte
 * @component
 * @description Renderiza ícono SVG de capas para reportar casos
 * @returns {JSX.Element} Ícono SVG de reporte
 */
const ReportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

/**
 * Componente de ícono de administrador
 * @component
 * @description Renderiza ícono SVG de engranaje para panel de administración
 * @returns {JSX.Element} Ícono SVG de configuración/admin
 */
const AdminIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

/**
 * Componente de ícono de usuario
 * @component
 * @description Renderiza ícono SVG de usuario para perfil
 * @returns {JSX.Element} Ícono SVG de perfil
 */
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

/**
 * Componente de barra de navegación
 * @component
 * @description Renderiza barra de navegación inferior con enlaces a Inicio, Reportar, Admin (si es admin) y Perfil.
 * Resalta visualmente el enlace activo según la ruta actual.
 * 
 * @example
 * // Uso en Layout
 * <Layout>
 *   <Navbar />
 * </Layout>
 * 
 * @returns {JSX.Element|null} Barra de navegación con íconos y labels, o null si no está autenticado
 */
const Navbar = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  /**
   * Determina si una ruta está activa
   * @function isActive
   * @description Compara la ruta actual con la ruta proporcionada y retorna la clase CSS apropiada
   * @param {string} path - Ruta a comparar
   * @returns {string} Clase CSS 'nav-item active' o 'nav-item'
   */
  const isActive = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  // Protección: no muestra navbar si el usuario no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  // Renderiza barra de navegación con enlaces condicionales (Admin solo para admins)
  return (
    <nav className="navbar">
      <Link to="/" className={isActive('/')}>
        <div className="nav-icon">
          <HomeIcon />
        </div>
        <span className="nav-label">Inicio</span>
      </Link>

      <Link to="/reportar" className={isActive('/reportar')}>
        <div className="nav-icon report-icon">
          <ReportIcon />
        </div>
        <span className="nav-label">Reportar</span>
      </Link>

      {isAdmin() && (
        <Link to="/admin" className={isActive('/admin')}>
          <div className="nav-icon">
            <AdminIcon />
          </div>
          <span className="nav-label">Admin</span>
        </Link>
      )}

      <Link to="/perfil" className={isActive('/perfil')}>
        <div className="nav-icon">
          <UserIcon />
        </div>
        <span className="nav-label">Perfil</span>
      </Link>
    </nav>
  );
};

export default Navbar;
