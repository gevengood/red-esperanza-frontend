/**
 * @file caseService.js
 * @description Servicio principal para comunicación con la API backend.
 * Contiene todas las funciones para gestionar casos, pistas, usuarios y autenticación.
 * 
 * Funcionalidades:
 * - CRUD de casos de menores desaparecidos
 * - CRUD de pistas sobre casos
 * - Gestión de usuarios y estadísticas
 * - Autenticación (login, register, logout)
 * - Manejo centralizado de tokens JWT
 * 
 * @requires ninguno (fetch nativo del navegador)
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

/**
 * URL base de la API backend.
 * Se obtiene de las variables de entorno o usa localhost por defecto.
 * @constant {string}
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

/**
 * Obtiene el token JWT del localStorage.
 * @private
 * @returns {string|null} Token JWT o null si no existe
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Función auxiliar para hacer peticiones HTTP a la API con manejo de errores.
 * Agrega automáticamente el token JWT si está disponible.
 * 
 * @private
 * @async
 * @param {string} endpoint - Ruta del endpoint (ej: '/cases', '/auth/login')
 * @param {Object} options - Opciones de fetch (method, body, headers, etc)
 * @returns {Promise<any>} Datos de la respuesta (propiedad .data)
 * @throws {Error} Si la petición falla o el servidor retorna error
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      console.error('Error del servidor:', data);
      throw new Error(data.error || 'Error en la petición');
    }

    return data.data; // La API retorna { success, data }
  } catch (error) {
    console.error('Error en API:', error);
    throw error;
  }
};

// ==================== CASOS ====================

/**
 * Obtiene todos los casos con estado ACTIVO.
 * Solo retorna casos que han sido aprobados por un administrador.
 * 
 * @async
 * @function getAllActiveCases
 * @returns {Promise<Array<Object>>} Lista de casos activos
 * @throws {Error} Si hay error en la petición
 * 
 * @example
 * const cases = await getAllActiveCases();
 * // cases = [{ id_caso, nombre_desaparecido, edad_desaparecido, ... }]
 */
export const getAllActiveCases = async () => {
  return await apiRequest('/cases?estado=ACTIVO');
};

/**
 * Obtiene todos los casos sin filtrar por estado.
 * Solo accesible para administradores.
 * 
 * @async
 * @function getAllCases
 * @returns {Promise<Array<Object>>} Lista de todos los casos (activos, pendientes, resueltos, rechazados)
 * @throws {Error} Si hay error en la petición o no tiene permisos
 */
export const getAllCases = async () => {
  return await apiRequest('/cases');
};

/**
 * Obtiene un caso específico por su ID.
 * 
 * @async
 * @function getCaseById
 * @param {string} id - ID del caso (UUID)
 * @returns {Promise<Object|null>} Caso encontrado o null si no existe
 * 
 * @example
 * const caso = await getCaseById('123e4567-e89b-12d3-a456-426614174000');
 * // caso = { id_caso, nombre_desaparecido, edad_desaparecido, ubicacion_latitud, ... }
 */
export const getCaseById = async (id) => {
  try {
    return await apiRequest(`/cases/${id}`);
  } catch (error) {
    return null;
  }
};

/**
 * Obtiene todos los casos reportados por un usuario específico.
 * Requiere autenticación con token JWT.
 * 
 * @async
 * @function getCasesByUserId
 * @param {string} userId - ID del usuario (UUID)
 * @returns {Promise<Array<Object>>} Lista de casos del usuario
 * @throws {Error} Si hay error en la petición
 */
export const getCasesByUserId = async (userId) => {
  return await apiRequest(`/cases/user/${userId}`);
};

/**
 * Crea un nuevo caso de menor desaparecido.
 * Requiere autenticación. El caso se crea con estado PENDIENTE_REVISION.
 * 
 * @async
 * @function createCase
 * @param {Object} newCaseData - Datos del nuevo caso
 * @param {string} newCaseData.nombre_desaparecido - Nombre completo del menor
 * @param {number} newCaseData.edad_desaparecido - Edad del menor (0-18)
 * @param {string} newCaseData.sexo_desaparecido - Sexo (MASCULINO, FEMENINO, OTRO)
 * @param {string} newCaseData.descripcion_fisica - Descripción física del menor
 * @param {string} newCaseData.descripcion_ropa - Descripción de la ropa
 * @param {string} newCaseData.descripcion_hechos - Descripción de los hechos
 * @param {string} newCaseData.fecha_desaparicion - Fecha/hora de desaparición (ISO 8601)
 * @param {number} newCaseData.ubicacion_latitud - Latitud del lugar
 * @param {number} newCaseData.ubicacion_longitud - Longitud del lugar
 * @param {string} newCaseData.direccion_texto - Dirección en texto
 * @param {string} newCaseData.nombre_contacto - Nombre del contacto
 * @param {string} newCaseData.telefono_contacto - Teléfono del contacto
 * @param {string} newCaseData.correo_contacto - Correo del contacto
 * @param {string} newCaseData.parentesco - Relación con el menor
 * @param {string} [newCaseData.url_foto_1] - URL de la primera foto (Supabase Storage)
 * @param {string} [newCaseData.url_foto_2] - URL de la segunda foto (Supabase Storage)
 * @param {string} [newCaseData.url_foto_3] - URL de la tercera foto (Supabase Storage)
 * @returns {Promise<Object>} Caso creado con su ID
 * @throws {Error} Si hay error en la petición o datos inválidos
 * 
 * @example
 * const caso = await createCase({
 *   nombre_desaparecido: 'Juan Pérez',
 *   edad_desaparecido: 8,
 *   sexo_desaparecido: 'MASCULINO',
 *   descripcion_fisica: 'Cabello castaño, ojos cafés',
 *   // ... demás campos
 * });
 */
export const createCase = async (newCaseData) => {
  return await apiRequest('/cases', {
    method: 'POST',
    body: JSON.stringify(newCaseData)
  });
};

/**
 * Actualiza el estado de un caso.
 * Solo accesible para administradores.
 * 
 * @async
 * @function updateCaseStatus
 * @param {string} id - ID del caso (UUID)
 * @param {string} newStatus - Nuevo estado del caso
 *   - 'PENDIENTE_REVISION': Caso pendiente de aprobación
 *   - 'ACTIVO': Caso aprobado y visible públicamente
 *   - 'RESUELTO': Menor encontrado
 *   - 'RECHAZADO': Caso rechazado por el administrador
 * @returns {Promise<Object|null>} Caso actualizado o null si hay error
 * @throws {Error} Si no tiene permisos o hay error en la petición
 */
export const updateCaseStatus = async (id, newStatus) => {
  try {
    return await apiRequest(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ estado_caso: newStatus })
    });
  } catch (error) {
    return null;
  }
};

/**
 * Actualiza los datos completos de un caso.
 * Solo el dueño del caso o un administrador puede actualizarlo.
 * 
 * @async
 * @function updateCase
 * @param {string} id - ID del caso (UUID)
 * @param {Object} updatedData - Datos a actualizar (puede ser parcial)
 * @returns {Promise<Object|null>} Caso actualizado o null si hay error
 * @throws {Error} Si no tiene permisos o hay error en la petición
 * 
 * @example
 * await updateCase('uuid-del-caso', {
 *   descripcion_hechos: 'Actualización: se vio al niño...',
 *   telefono_contacto: '+57 300 999 8888'
 * });
 */
export const updateCase = async (id, updatedData) => {
  try {
    return await apiRequest(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData)
    });
  } catch (error) {
    return null;
  }
};

/**
 * Elimina un caso de forma permanente.
 * Solo accesible para administradores.
 * 
 * @async
 * @function deleteCase
 * @param {string} id - ID del caso a eliminar (UUID)
 * @returns {Promise<boolean>} true si se eliminó correctamente, false si hubo error
 * @throws {Error} Si no tiene permisos de administrador
 */
export const deleteCase = async (id) => {
  try {
    await apiRequest(`/cases/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    return false;
  }
};

// ==================== PISTAS ====================

/**
 * Obtiene todas las pistas de un caso específico.
 * Público, no requiere autenticación.
 * 
 * @async
 * @function getCluesByCaseId
 * @param {string} caseId - ID del caso (UUID)
 * @returns {Promise<Array<Object>>} Lista de pistas del caso
 * @throws {Error} Si hay error en la petición
 * 
 * @example
 * const pistas = await getCluesByCaseId('uuid-del-caso');
 * // pistas = [{ id_pista, mensaje, url_foto_pista, estado_pista, fecha_pista, ... }]
 */
export const getCluesByCaseId = async (caseId) => {
  return await apiRequest(`/clues/case/${caseId}`);
};

/**
 * Crea una nueva pista sobre un caso.
 * Requiere autenticación. La pista se crea con estado PENDIENTE_REVISION.
 * 
 * @async
 * @function createClue
 * @param {Object} newClueData - Datos de la nueva pista
 * @param {string} newClueData.id_caso - ID del caso al que pertenece (UUID)
 * @param {string} newClueData.mensaje - Mensaje de la pista (descripción)
 * @param {string} [newClueData.url_foto_pista] - URL de foto de la pista (Supabase Storage)
 * @returns {Promise<Object>} Pista creada con su ID
 * @throws {Error} Si hay error en la petición o datos inválidos
 * 
 * @example
 * const pista = await createClue({
 *   id_caso: 'uuid-del-caso',
 *   mensaje: 'Vi a un niño con esas características en el parque',
 *   url_foto_pista: 'https://supabase.co/storage/pista.jpg'
 * });
 */
export const createClue = async (newClueData) => {
  return await apiRequest('/clues', {
    method: 'POST',
    body: JSON.stringify(newClueData)
  });
};

/**
 * Actualiza el estado de una pista.
 * Solo accesible para administradores.
 * 
 * @async
 * @function updateClueStatus
 * @param {string} id - ID de la pista (UUID)
 * @param {string} newStatus - Nuevo estado de la pista
 *   - 'PENDIENTE_REVISION': Pista pendiente de verificación
 *   - 'VERIFICADA': Pista verificada por el administrador
 *   - 'RECHAZADA': Pista descartada (spam, irrelevante, etc.)
 * @returns {Promise<Object|null>} Pista actualizada o null si hay error
 * @throws {Error} Si no tiene permisos o hay error en la petición
 */
export const updateClueStatus = async (id, newStatus) => {
  try {
    return await apiRequest(`/clues/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ estado_pista: newStatus })
    });
  } catch (error) {
    return null;
  }
};

/**
 * Obtiene todas las pistas pendientes de verificación.
 * Solo accesible para administradores.
 * 
 * @async
 * @function getAllClues
 * @returns {Promise<Array<Object>>} Lista de pistas pendientes
 * @throws {Error} Si no tiene permisos o hay error en la petición
 */
export const getAllClues = async () => {
  return await apiRequest('/clues/pending');
};

// ==================== USUARIOS ====================

/**
 * Obtiene un usuario por su ID.
 * Requiere autenticación.
 * 
 * @async
 * @function getUserById
 * @param {string} id - ID del usuario (UUID)
 * @returns {Promise<Object|null>} Usuario encontrado o null si no existe
 * 
 * @example
 * const usuario = await getUserById('uuid-del-usuario');
 * // usuario = { id_usuario, nombre, correo, es_administrador, fecha_registro, ... }
 */
export const getUserById = async (id) => {
  try {
    return await apiRequest(`/users/${id}`);
  } catch (error) {
    return null;
  }
};

/**
 * Obtiene la lista completa de usuarios registrados.
 * Solo accesible para administradores.
 * 
 * @async
 * @function getAllUsers
 * @returns {Promise<Array<Object>>} Lista de todos los usuarios
 * @throws {Error} Si no tiene permisos o hay error en la petición
 */
export const getAllUsers = async () => {
  return await apiRequest('/users');
};

/**
 * Obtiene las estadísticas de un usuario específico.
 * Incluye cantidad de casos reportados y pistas contribuidas.
 * 
 * @async
 * @function getUserStats
 * @param {string} userId - ID del usuario (UUID)
 * @returns {Promise<Object>} Estadísticas del usuario
 * @returns {Object} result.casos - Estadísticas de casos (total, pendientes, activos, resueltos, rechazados)
 * @returns {Object} result.pistas - Estadísticas de pistas (total, pendientes, verificadas, rechazadas)
 * @throws {Error} Si hay error en la petición
 * 
 * @example
 * const stats = await getUserStats('uuid-del-usuario');
 * // stats = {
 * //   casos: { total: 5, pendientes: 1, activos: 3, resueltos: 1, rechazados: 0 },
 * //   pistas: { total: 12, pendientes: 2, verificadas: 9, rechazadas: 1 }
 * // }
 */
export const getUserStats = async (userId) => {
  return await apiRequest(`/users/${userId}/stats`);
};

// ==================== AUTENTICACIÓN ====================

/**
 * Registra un nuevo usuario en la plataforma.
 * Hace petición directa al backend (POST /auth/register).
 * Si es exitoso, guarda el token JWT y los datos del usuario en localStorage.
 * 
 * @async
 * @function registerUser
 * @param {Object} userData - Datos del nuevo usuario
 * @param {string} userData.nombre - Nombre completo del usuario
 * @param {string} userData.correo - Correo electrónico (debe ser único)
 * @param {string} userData.password - Contraseña (será hasheada en el backend)
 * @param {string} [userData.telefono] - Teléfono de contacto
 * @returns {Promise<Object>} Objeto con usuario y token
 * @returns {string} result.token - Token JWT para autenticación
 * @returns {Object} result.usuario - Datos del usuario creado
 * @throws {Error} Si el correo ya existe o hay error en la petición
 * 
 * @example
 * const { token, usuario } = await registerUser({
 *   nombre: 'María García',
 *   correo: 'maria@gmail.com',
 *   password: 'password123',
 *   telefono: '+57 300 123 4567'
 * });
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error al registrar usuario');
  }
  
  // Guardar token
  if (data.data.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.usuario));
  }
  
  return data.data;
};

/**
 * Autentica a un usuario existente (login).
 * Hace petición directa al backend (POST /auth/login).
 * Valida las credenciales con bcrypt y retorna un token JWT si son correctas.
 * Si es exitoso, guarda el token y los datos del usuario en localStorage.
 * 
 * @async
 * @function authenticateUser
 * @param {string} correo - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario autenticado
 * @throws {Error} Si las credenciales son incorrectas o hay error en la petición
 * 
 * @example
 * const usuario = await authenticateUser('maria@gmail.com', 'password123');
 * // usuario = { id_usuario, nombre, correo, es_administrador, fecha_registro }
 * // El token JWT se guarda automáticamente en localStorage
 */
export const authenticateUser = async (correo, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error al iniciar sesión');
  }
  
  // Guardar token
  if (data.data.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.usuario));
  }
  
  return data.data.usuario;
};

/**
 * Cierra la sesión del usuario actual.
 * Elimina el token JWT y los datos del usuario del localStorage.
 * Después de llamar esta función, el usuario deberá hacer login nuevamente.
 * 
 * @function logoutUser
 * @returns {void}
 * 
 * @example
 * logoutUser();
 * // Token y usuario eliminados de localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Obtiene los datos del usuario actualmente autenticado desde localStorage.
 * Útil para recuperar la sesión al recargar la página.
 * 
 * @function getCurrentUser
 * @returns {Object|null} Usuario actual o null si no hay sesión
 * 
 * @example
 * const user = getCurrentUser();
 * if (user) {
 *   console.log('Usuario:', user.nombre);
 * } else {
 *   console.log('No hay sesión activa');
 * }
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// ==================== ESTADÍSTICAS ====================

/**
 * Obtiene estadísticas generales de toda la plataforma.
 * Calcula totales de casos y pistas con sus respectivos estados.
 * Útil para el panel de administración.
 * 
 * @async
 * @function getStatistics
 * @returns {Promise<Object>} Estadísticas generales
 * @returns {number} result.total_casos - Total de casos registrados
 * @returns {number} result.casos_activos - Casos con estado ACTIVO
 * @returns {number} result.casos_resueltos - Casos con estado RESUELTO
 * @returns {number} result.casos_pendientes - Casos con estado PENDIENTE_REVISION
 * @returns {number} result.total_pistas - Total de pistas registradas
 * @returns {number} result.pistas_pendientes - Pistas con estado PENDIENTE_REVISION
 * @throws {Error} Si hay error al obtener los datos
 * 
 * @example
 * const stats = await getStatistics();
 * // stats = {
 * //   total_casos: 150,
 * //   casos_activos: 120,
 * //   casos_resueltos: 25,
 * //   casos_pendientes: 5,
 * //   total_pistas: 340,
 * //   pistas_pendientes: 12
 * // }
 */
export const getStatistics = async () => {
  const [casos, clues] = await Promise.all([
    getAllCases(),
    getAllClues()
  ]);
  
  return {
    total_casos: casos.length,
    casos_activos: casos.filter(c => c.estado_caso === 'ACTIVO').length,
    casos_resueltos: casos.filter(c => c.estado_caso === 'RESUELTO').length,
    casos_pendientes: casos.filter(c => c.estado_caso === 'PENDIENTE_REVISION').length,
    total_pistas: clues.length,
    pistas_pendientes: clues.filter(p => p.estado_pista === 'PENDIENTE_REVISION').length
  };
};

// Exportar todo como objeto por defecto también
export default {
  // Casos
  getAllActiveCases,
  getAllCases,
  getCaseById,
  getCasesByUserId,
  createCase,
  updateCaseStatus,
  updateCase,
  deleteCase,
  
  // Pistas
  getCluesByCaseId,
  createClue,
  updateClueStatus,
  getAllClues,
  
  // Usuarios
  getUserById,
  getAllUsers,
  getUserStats,
  
  // Autenticación
  registerUser,
  authenticateUser,
  logoutUser,
  getCurrentUser,
  
  // Estadísticas
  getStatistics
};
