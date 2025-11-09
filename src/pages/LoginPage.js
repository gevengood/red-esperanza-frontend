/**
 * @file LoginPage.js
 * @description Página de autenticación que maneja el inicio de sesión y registro de usuarios.
 * Proporciona formularios para login y registro con validación, manejo de errores y estados de carga.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authenticateUser, registerUser } from '../services/caseService';
import './LoginPage.css';

/**
 * Componente de página de login y registro
 * @component
 * @description Renderiza una página con formularios alternantes para iniciar sesión o registrarse.
 * Incluye validación de campos, manejo de errores y redirección post-autenticación.
 * 
 * @example
 * // Uso en el router
 * <Route path="/login" element={<LoginPage />} />
 * 
 * @returns {JSX.Element} Página completa de login/registro con formularios y validación
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Estado para alternar entre formularios de login y registro
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Estado del formulario con todos los campos necesarios
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    nombre: '',
    telefono: ''
  });
  
  // Estados para manejo de errores y carga
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Maneja los cambios en los inputs del formulario
   * @function handleInputChange
   * @description Actualiza el estado del formulario y limpia errores al escribir
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  /**
   * Maneja el proceso de inicio de sesión
   * @function handleLogin
   * @description Autentica al usuario con correo y contraseña, actualiza el contexto y redirige al home
   * @param {Event} e - Evento del formulario
   * @async
   * @throws {Error} Si las credenciales son inválidas o hay error de conexión
   * 
   * @example
   * // Se llama automáticamente al enviar el formulario de login
   * <form onSubmit={handleLogin}>...</form>
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Autentica con el backend
      const userData = await authenticateUser(formData.correo, formData.password);
      // Actualiza el contexto global de autenticación
      login(userData);
      // Redirige al home
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el proceso de registro de nuevo usuario
   * @function handleRegister
   * @description Registra un nuevo usuario, lo autentica automáticamente y redirige al home
   * @param {Event} e - Evento del formulario
   * @async
   * @throws {Error} Si el correo ya existe, datos inválidos o error de conexión
   * 
   * @example
   * // Se llama automáticamente al enviar el formulario de registro
   * <form onSubmit={handleRegister}>...</form>
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Registra el nuevo usuario en el backend
      const response = await registerUser({
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password,
        telefono: formData.telefono
      });
      // Login automático después del registro
      login(response.usuario);
      // Redirige al home
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Renderiza la página con formularios alternantes
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🤝</span>
            <h1 className="logo-text">Red Esperanza</h1>
          </div>
          <p className="tagline">Juntos encontramos el camino a casa</p>
        </div>

        <div className="login-card">
          <h2 className="login-title">
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>

            {isRegistering && (
              <div className="form-group">
                <label htmlFor="telefono">Teléfono (opcional)</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+57 300 123 4567"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
            </button>
          </form>

          <div className="toggle-form">
            <p>
              {isRegistering 
                ? '¿Ya tienes cuenta? ' 
                : '¿No tienes cuenta? '}
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setFormData({ correo: '', password: '', nombre: '', telefono: '' });
                }}
                type="button"
              >
                {isRegistering ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>

        <div className="login-footer">
          <p>© 2024 Red Esperanza. Plataforma comunitaria de búsqueda de menores.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
