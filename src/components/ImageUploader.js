import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import './ImageUploader.css';

const ImageUploader = ({ onImageUploaded, existingImageUrl = null, maxSizeMB = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImageUrl);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateImage = (file) => {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Solo se permiten archivos JPG, PNG o WebP';
    }

    // Validar tamaño
    const maxSize = maxSizeMB * 1024 * 1024; // Convertir MB a bytes
    if (file.size > maxSize) {
      return `El archivo debe ser menor a ${maxSizeMB}MB`;
    }

    return null;
  };

  const uploadImage = async (file) => {
    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Validar imagen
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        setUploading(false);
        return;
      }

      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cases/${fileName}`;

      // Simular progreso
      setUploadProgress(30);

      // Subir a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('case-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error al subir imagen:', uploadError);
        setError('Error al subir la imagen. Intenta de nuevo.');
        setUploading(false);
        return;
      }

      setUploadProgress(70);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('case-images')
        .getPublicUrl(filePath);

      setUploadProgress(100);

      const publicUrl = urlData.publicUrl;

      // Callback con la URL
      if (onImageUploaded) {
        onImageUploaded(publicUrl);
      }

      setPreview(publicUrl);
      setUploading(false);
      setUploadProgress(0);

    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al subir la imagen');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mostrar preview local inmediatamente
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Subir archivo
      uploadImage(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
    if (onImageUploaded) {
      onImageUploaded(null);
    }
  };

  return (
    <div className="image-uploader">
      {!preview ? (
        <div className="upload-area">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-label">
            {uploading ? (
              <div className="uploading-state">
                <div className="spinner-upload"></div>
                <p>Subiendo imagen...</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress}%</span>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="upload-text">
                  <strong>Click para subir</strong> o arrastra una imagen
                </p>
                <p className="upload-hint">
                  JPG, PNG o WebP (máx. {maxSizeMB}MB)
                </p>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="remove-btn"
              title="Eliminar imagen"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          {uploading && (
            <div className="uploading-overlay">
              <div className="spinner-upload"></div>
              <p>{uploadProgress}%</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message-upload">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
