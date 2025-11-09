import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logoutUser as logoutService } from '../services/caseService';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay usuario guardado en localStorage al cargar la app
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

  // Función para login (ahora recibe el objeto usuario completo desde LoginPage)
  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    return { success: true, user: userData };
  };

  // Función para cerrar sesión
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    logoutService();
  };

  // Función para actualizar datos del usuario
  const updateUser = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return currentUser?.es_administrador === true;
  };

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
