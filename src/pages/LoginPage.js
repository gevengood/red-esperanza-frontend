import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authenticateUser, registerUser } from '../services/caseService';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    nombre: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authenticateUser(formData.correo, formData.password);
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await registerUser({
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password,
        telefono: formData.telefono
      });
      login(response.usuario);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

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
