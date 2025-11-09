/**
 * @file AuthContext.js
 * @description Contexto de React para gestionar la autenticación global de la aplicación.
 * Provee el estado del usuario actual, funciones de login/logout y verificación de roles.
 * 
 * Funcionalidades:
 * - Persistencia de sesión con localStorage
 * - Verificación de autenticación al cargar la app
 * - Gestión de roles (usuario normal vs administrador)
 * - Funciones globales de login, logout y actualización de usuario
 * 
 * @requires react
 * @requires ../services/caseService
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logoutUser as logoutService } from '../services/caseService';

/**
 * Contexto de autenticación.
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Debe ser usado dentro de un AuthProvider.
 * 
 * @hook
 * @returns {Object} Objeto con estado y funciones de autenticación
 * @throws {Error} Si se usa fuera de AuthProvider
 * 
 * @example
 * const { currentUser, isAuthenticated, login, logout, isAdmin } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación.
 * Envuelve la aplicación para proporcionar acceso global al estado de autenticación.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Provider con contexto de autenticación
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Effect que se ejecuta al montar el componente.
   * Verifica si hay un usuario guardado en localStorage para restaurar la sesión.
   */
  useEffect(() => {
    const loadUser = () => {
      try {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Función para iniciar sesión.
   * Recibe los datos del usuario desde LoginPage (después de autenticación exitosa con backend).
   * 
   * @param {Object} userData - Datos del usuario autenticado
   * @param {string} userData.id_usuario - ID del usuario (UUID)
   * @param {string} userData.nombre - Nombre completo
   * @param {string} userData.correo - Correo electrónico
   * @param {boolean} userData.es_administrador - Si es administrador
   * @returns {Object} Objeto con success y user
   */
  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    return { success: true, user: userData };
  };

  /**
   * Función para cerrar sesión.
   * Limpia el estado local y el localStorage (token y usuario).
   */
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    logoutService();
  };

  /**
   * Función para actualizar los datos del usuario actual.
   * Fusiona los datos actuales con los nuevos.
   * 
   * @param {Object} updatedData - Datos a actualizar del usuario
   */
  const updateUser = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
  };

  /**
   * Verifica si el usuario actual es administrador.
   * 
   * @returns {boolean} true si es administrador, false en caso contrario
   */
  const isAdmin = () => {
    return currentUser?.es_administrador === true;
  };

  /**
   * Valor del contexto que se provee a todos los componentes hijos.
   * @type {Object}
   * @property {Object|null} currentUser - Usuario actualmente autenticado
   * @property {boolean} isAuthenticated - Si hay un usuario autenticado
   * @property {boolean} loading - Si está cargando la información del usuario
   * @property {Function} login - Función para iniciar sesión
   * @property {Function} logout - Función para cerrar sesión
   * @property {Function} updateUser - Función para actualizar datos del usuario
   * @property {Function} isAdmin - Función para verificar si es administrador
   */
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
