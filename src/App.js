/**
 * @file App.js
 * @description Componente principal de la aplicación Red Esperanza.
 * Configura el enrutamiento de la aplicación con rutas públicas, protegidas y de administrador.
 * 
 * @requires react
 * @requires react-router-dom
 * @requires ./context/AuthContext
 * 
 * @component
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import InstallPWA from './components/InstallPWA';
import HomePage from './pages/HomePage';
import CaseDetailPage from './pages/CaseDetailPage';
import ReportCasePage from './pages/ReportCasePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import './App.css';

/**
 * Componente de orden superior para proteger rutas que requieren autenticación.
 * Redirige a /login si el usuario no está autenticado.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si está autenticado
 * @returns {React.ReactElement} Componente protegido o redirección a login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large"></div>
        <p>Cargando Red Esperanza...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Componente de orden superior para proteger rutas exclusivas de administradores.
 * Redirige a /login si no está autenticado, o a / si no es administrador.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si es admin
 * @returns {React.ReactElement} Componente protegido o redirección
 */
const AdminRoute = ({ children }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Componente de layout que envuelve las páginas con la barra de navegación inferior.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la página
 * @returns {React.ReactElement} Página con navbar
 */
const Layout = ({ children }) => {
  return (
    <>
      {children}
      <Navbar />
      <InstallPWA />
    </>
  );
};

/**
 * Componente que define todas las rutas de la aplicación.
 * 
 * Rutas disponibles:
 * - /login: Página de inicio de sesión (pública)
 * - /: Página principal con lista y mapa de casos (protegida)
 * - /caso/:id: Detalle de un caso específico (protegida)
 * - /reportar: Formulario para reportar nuevos casos (protegida)
 * - /perfil: Perfil del usuario (protegida)
 * - /admin: Panel de administración (solo admin)
 * 
 * @component
 * @returns {React.ReactElement} Configuración de rutas
 */
function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con navbar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/caso/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CaseDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportar"
          element={
            <ProtectedRoute>
              <Layout>
                <ReportCasePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          }
        />

        {/* Ruta por defecto: redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

/**
 * Componente raíz de la aplicación.
 * Envuelve toda la aplicación con el AuthProvider para gestión de autenticación global.
 * 
 * @component
 * @returns {React.ReactElement} Aplicación completa con contexto de autenticación
 */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
