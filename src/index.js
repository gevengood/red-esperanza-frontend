/**
 * @file index.js
 * @description Punto de entrada principal de la aplicación React.
 * Renderiza el componente App dentro del elemento root del DOM.
 * 
 * @requires react
 * @requires react-dom/client
 * @requires ./App
 * 
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Crear el root de React y renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
