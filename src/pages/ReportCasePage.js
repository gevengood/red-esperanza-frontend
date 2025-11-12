import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import MapPicker from '../components/MapPicker';
import AddressSearch from '../components/AddressSearch';
import ImageUploader from '../components/ImageUploader';
import { createCase } from '../services/caseService';
import './ReportCasePage.css';

const ReportCasePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Datos del desaparecido y contacto
    nombre_desaparecido: '',
    edad_desaparecido: '',
    sexo_desaparecido: 'MASCULINO',
    parentesco: '',
    nombre_contacto: '',
    telefono_contacto: '',
    correo_contacto: '',
    
    // Paso 2: Lugar y fecha
    fecha_desaparicion: '',
    hora_desaparicion: '',
    direccion_texto: '',
    ubicacion_latitud: 4.6097,
    ubicacion_longitud: -74.0817,
    
    // Paso 3: Descripción
    descripcion_fisica: '',
    descripcion_ropa: '',
    descripcion_hechos: '',
    url_foto_1: '',
    url_foto_2: '',
    url_foto_3: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para edad
    if (name === 'edad_desaparecido') {
      const edad = parseInt(value);
      if (value !== '' && (edad < 0 || edad > 18)) {
        return; // No actualizar si está fuera de rango
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    // Validar campos requeridos del paso actual
    if (currentStep === 1) {
      if (!formData.nombre_desaparecido || !formData.edad_desaparecido || 
          !formData.parentesco || !formData.nombre_contacto || 
          !formData.telefono_contacto || !formData.correo_contacto) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.fecha_desaparicion || !formData.hora_desaparicion || 
          !formData.direccion_texto) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.descripcion_fisica || !formData.descripcion_ropa || 
          !formData.descripcion_hechos) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleLocationChange = (newPosition) => {
    setFormData(prev => ({
      ...prev,
      ubicacion_latitud: newPosition[0],
      ubicacion_longitud: newPosition[1]
    }));
  };

  const handleAddressSelect = (addressData) => {
    console.log('📥 Datos recibidos en ReportCasePage:');
    console.log('addressData completo:', addressData);
    console.log('Latitud recibida:', addressData.latitude);
    console.log('Longitud recibida:', addressData.longitude);
    
    // Actualizar dirección y coordenadas desde el geocoding
    setFormData(prev => ({
      ...prev,
      direccion_texto: addressData.address,
      ubicacion_latitud: addressData.latitude,
      ubicacion_longitud: addressData.longitude
    }));
    
    console.log('✅ FormData actualizado con coordenadas:', {
      lat: addressData.latitude,
      lng: addressData.longitude
    });
    
    // Scroll suave al input de dirección para que el usuario lo vea y pueda editarlo
    setTimeout(() => {
      const direccionInput = document.querySelector('input[name="direccion_texto"]');
      if (direccionInput) {
        direccionInput.focus();
        direccionInput.select();
      }
    }, 300);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // Combinar fecha y hora
      const fechaHora = `${formData.fecha_desaparicion}T${formData.hora_desaparicion}:00Z`;
      
      const caseData = {
        id_usuario_reportero: currentUser.id_usuario,
        nombre_desaparecido: formData.nombre_desaparecido,
        edad_desaparecido: parseInt(formData.edad_desaparecido),
        sexo_desaparecido: formData.sexo_desaparecido,
        descripcion_fisica: formData.descripcion_fisica,
        descripcion_ropa: formData.descripcion_ropa,
        descripcion_hechos: formData.descripcion_hechos,
        fecha_desaparicion: fechaHora,
        ubicacion_latitud: formData.ubicacion_latitud,
        ubicacion_longitud: formData.ubicacion_longitud,
        direccion_texto: formData.direccion_texto,
        nombre_contacto: formData.nombre_contacto,
        telefono_contacto: formData.telefono_contacto,
        correo_contacto: formData.correo_contacto,
        parentesco: formData.parentesco,
        url_foto_1: formData.url_foto_1 || null,
        url_foto_2: formData.url_foto_2 || null,
        url_foto_3: formData.url_foto_3 || null
      };

      await createCase(caseData);
      
      alert('✓ Reporte enviado con éxito. Tu reporte ha sido recibido por nuestro equipo para verificación.');
      navigate('/perfil');
    } catch (error) {
      console.error('Error al crear caso:', error);
      alert('Error al enviar el reporte. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4].map(step => (
        <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Datos'}
            {step === 2 && 'Ubicación'}
            {step === 3 && 'Descripción'}
            {step === 4 && 'Confirmar'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="form-step">
      <h2 className="step-title">Paso 1: Datos del Desaparecido y Contacto</h2>
      
      <div className="form-group">
        <label>Nombre completo del menor *</label>
        <input
          type="text"
          name="nombre_desaparecido"
          value={formData.nombre_desaparecido}
          onChange={handleInputChange}
          placeholder="Ej: María García López"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Edad * (0-18 años)</label>
          <input
            type="number"
            name="edad_desaparecido"
            value={formData.edad_desaparecido}
            onChange={handleInputChange}
            placeholder="Ej: 8"
            min="0"
            max="18"
            required
          />
          <small style={{ fontSize: '12px', color: '#718096', marginTop: '4px', display: 'block' }}>
            Solo menores de edad (0-18 años)
          </small>
        </div>

        <div className="form-group">
          <label>Sexo *</label>
          <select
            name="sexo_desaparecido"
            value={formData.sexo_desaparecido}
            onChange={handleInputChange}
            required
          >
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Tu parentesco con el menor *</label>
        <input
          type="text"
          name="parentesco"
          value={formData.parentesco}
          onChange={handleInputChange}
          placeholder="Ej: Madre, Padre, Tío, etc."
          required
        />
      </div>

      <div className="section-divider">
        <span>Información de Contacto</span>
      </div>

      <div className="form-group">
        <label>Nombre del contacto *</label>
        <input
          type="text"
          name="nombre_contacto"
          value={formData.nombre_contacto}
          onChange={handleInputChange}
          placeholder="¿A quién llamar si hay pistas?"
          required
        />
      </div>

      <div className="form-group">
        <label>Teléfono de contacto *</label>
        <input
          type="tel"
          name="telefono_contacto"
          value={formData.telefono_contacto}
          onChange={handleInputChange}
          placeholder="+52 55 1234 5678"
          required
        />
      </div>

      <div className="form-group">
        <label>Correo electrónico *</label>
        <input
          type="email"
          name="correo_contacto"
          value={formData.correo_contacto}
          onChange={handleInputChange}
          placeholder="correo@ejemplo.com"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h2 className="step-title">Paso 2: Lugar y Fecha de Desaparición</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label>Fecha de desaparición *</label>
          <input
            type="date"
            name="fecha_desaparicion"
            value={formData.fecha_desaparicion}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Hora aproximada *</label>
          <input
            type="time"
            name="hora_desaparicion"
            value={formData.hora_desaparicion}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          Ubicación (último lugar visto) *
          <span style={{ fontSize: '13px', fontWeight: '400', color: '#718096', marginLeft: '8px' }}>
            🔍 Busca lugar o 📍 usa GPS
          </span>
        </label>
        <AddressSearch 
          onSelectAddress={handleAddressSelect}
          initialAddress={formData.direccion_texto}
        />
        <div style={{ 
          position: 'relative',
          marginTop: '16px'
        }}>
          <label style={{ 
            fontSize: '13px', 
            fontWeight: '500',
            color: '#4a5568',
            marginBottom: '8px',
            display: 'block'
          }}>
            ✏️ Dirección exacta (ajusta si es necesario):
          </label>
          <input
            type="text"
            name="direccion_texto"
            value={formData.direccion_texto}
            onChange={handleInputChange}
            placeholder="Ej: Carrera 80a #52-18, Kennedy, Bogotá, Colombia"
            required
            style={{
              backgroundColor: '#f7fafc',
              borderStyle: 'solid',
              borderWidth: '2px'
            }}
          />
          <small style={{ 
            fontSize: '12px', 
            color: '#718096',
            marginTop: '6px',
            display: 'block'
          }}>
            💡 Puedes editar manualmente para agregar detalles exactos (número de casa, apartamento, etc.)
          </small>
        </div>
      </div>

      <MapPicker
        initialPosition={[formData.ubicacion_latitud, formData.ubicacion_longitud]}
        onLocationChange={handleLocationChange}
        externalPosition={[formData.ubicacion_latitud, formData.ubicacion_longitud]}
        height="350px"
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h2 className="step-title">Paso 3: Descripción y Fotografías</h2>
      
      <div className="form-group">
        <label>Descripción de los hechos *</label>
        <textarea
          name="descripcion_hechos"
          value={formData.descripcion_hechos}
          onChange={handleInputChange}
          placeholder="¿Qué pasó? Describe las circunstancias de la desaparición..."
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label>Características físicas *</label>
        <textarea
          name="descripcion_fisica"
          value={formData.descripcion_fisica}
          onChange={handleInputChange}
          placeholder="Color de piel, ojos, cabello, estatura, señas particulares..."
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label>Descripción de la ropa *</label>
        <textarea
          name="descripcion_ropa"
          value={formData.descripcion_ropa}
          onChange={handleInputChange}
          placeholder="¿Qué ropa llevaba puesta?"
          rows="3"
          required
        />
      </div>

      <div className="section-divider">
        <span>Fotografías del Menor</span>
      </div>

      <div className="photo-upload-note">
        <p>📷 <strong>Sube hasta 3 fotografías claras del menor desaparecido</strong></p>
        <p>Las fotos ayudarán a la comunidad a identificarlo más fácilmente.</p>
      </div>

      <div className="form-group">
        <label>Fotografía Principal *</label>
        <ImageUploader
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, url_foto_1: url }))}
          existingImageUrl={formData.url_foto_1}
          maxSizeMB={5}
        />
      </div>

      <div className="form-group">
        <label>Fotografía 2 (opcional)</label>
        <ImageUploader
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, url_foto_2: url }))}
          existingImageUrl={formData.url_foto_2}
          maxSizeMB={5}
        />
      </div>

      <div className="form-group">
        <label>Fotografía 3 (opcional)</label>
        <ImageUploader
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, url_foto_3: url }))}
          existingImageUrl={formData.url_foto_3}
          maxSizeMB={5}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h2 className="step-title">Paso 4: Confirmación</h2>
      
      <div className="confirmation-card">
        <h3>Resumen de tu Reporte</h3>
        
        <div className="confirmation-section">
          <h4>Información del Menor</h4>
          <p><strong>Nombre:</strong> {formData.nombre_desaparecido}</p>
          <p><strong>Edad:</strong> {formData.edad_desaparecido} años</p>
          <p><strong>Sexo:</strong> {formData.sexo_desaparecido}</p>
        </div>

        <div className="confirmation-section">
          <h4>Contacto</h4>
          <p><strong>Reportado por:</strong> {formData.nombre_contacto} ({formData.parentesco})</p>
          <p><strong>Teléfono:</strong> {formData.telefono_contacto}</p>
          <p><strong>Correo:</strong> {formData.correo_contacto}</p>
        </div>

        <div className="confirmation-section">
          <h4>Lugar y Fecha</h4>
          <p><strong>Fecha:</strong> {formData.fecha_desaparicion}</p>
          <p><strong>Hora:</strong> {formData.hora_desaparicion}</p>
          <p><strong>Ubicación:</strong> {formData.direccion_texto}</p>
        </div>

        <div className="confirmation-section">
          <h4>Descripción</h4>
          <p><strong>Hechos:</strong> {formData.descripcion_hechos.substring(0, 100)}...</p>
          <p><strong>Características:</strong> {formData.descripcion_fisica.substring(0, 100)}...</p>
          <p><strong>Ropa:</strong> {formData.descripcion_ropa.substring(0, 100)}...</p>
        </div>

        <div className="important-note">
          <p>⚠️ <strong>Importante:</strong> Al enviar este reporte, será revisado por nuestro equipo antes de publicarse en la plataforma.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="report-case-page">
      <Header 
        title="Reportar Desaparición" 
        subtitle={`Paso ${currentStep} de 4`}
        showBack 
        onBack={() => navigate(-1)} 
      />

      <div className="report-content">
        {renderStepIndicator()}

        <div className="form-container">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button 
                className="nav-btn secondary"
                onClick={prevStep}
                disabled={submitting}
              >
                ← Anterior
              </button>
            )}

            {currentStep < 4 ? (
              <button 
                className="nav-btn primary"
                onClick={nextStep}
              >
                Siguiente →
              </button>
            ) : (
              <button 
                className="nav-btn submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : '✓ Finalizar y Enviar Reporte'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCasePage;
