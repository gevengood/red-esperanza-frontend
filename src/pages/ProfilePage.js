import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CaseCard from '../components/CaseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCasesByUserId } from '../services/caseService';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const [myCases, setMyCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCases();
  }, []);

  const loadMyCases = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const cases = await getCasesByUserId(currentUser.id_usuario);
      setMyCases(cases);
    } catch (error) {
      console.error('Error al cargar mis casos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="profile-page">
      <Header 
        title="Mi Perfil" 
        subtitle={isAdmin() ? 'Cuenta de Administrador' : 'Cuenta de Usuario'}
      />

      <div className="profile-content">
        {/* Card de información del usuario */}
        <div className="profile-card">
          <div className="profile-avatar">
            <span className="avatar-icon">
              {isAdmin() ? '👨‍💼' : '👤'}
            </span>
          </div>

          <h2 className="profile-name">{currentUser.nombre}</h2>
          
          {isAdmin() && (
            <div className="admin-badge">
              <span>⚙️ Administrador</span>
            </div>
          )}

          <div className="profile-info">
            <div className="info-item">
              <span className="info-icon">📧</span>
              <span className="info-text">{currentUser.correo}</span>
            </div>
            
            <div className="info-item">
              <span className="info-icon">📱</span>
              <span className="info-text">{currentUser.telefono}</span>
            </div>

            <div className="info-item">
              <span className="info-icon">📅</span>
              <span className="info-text">
                Miembro desde {currentUser.fecha_registro 
                  ? new Date(currentUser.fecha_registro).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'Fecha no disponible'}
              </span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Mis reportes */}
        <div className="my-cases-section">
          <h3 className="section-title">
            Mis Reportes Enviados
            <span className="count-badge">{myCases.length}</span>
          </h3>

          {loading ? (
            <LoadingSpinner message="Cargando tus reportes..." />
          ) : myCases.length === 0 ? (
            <div className="empty-cases">
              <div className="empty-icon">📋</div>
              <h4>No has enviado reportes</h4>
              <p>Cuando reportes un caso de desaparición, aparecerá aquí.</p>
              <button 
                className="report-btn"
                onClick={() => navigate('/reportar')}
              >
                📢 Reportar un caso
              </button>
            </div>
          ) : (
            <div className="cases-grid">
              {myCases.map(caso => (
                <CaseCard key={caso.id_caso} caso={caso} showStatus={true} />
              ))}
            </div>
          )}
        </div>

        {/* Estadísticas personales */}
        <div className="stats-card">
          <h3 className="section-title">Estadísticas</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{myCases.length}</div>
              <div className="stat-label">Reportes Totales</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {myCases.filter(c => c.estado_caso === 'ACTIVO').length}
              </div>
              <div className="stat-label">Casos Activos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {myCases.filter(c => c.estado_caso === 'RESUELTO').length}
              </div>
              <div className="stat-label">Casos Resueltos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
