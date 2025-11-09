// Configuración de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Función auxiliar para obtener el token del localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función auxiliar para hacer peticiones con manejo de errores
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
 * Obtiene todos los casos activos (estado ACTIVO)
 * @returns {Promise<Array>} Lista de casos activos
 */
export const getAllActiveCases = async () => {
  return await apiRequest('/cases?estado=ACTIVO');
};

/**
 * Obtiene todos los casos sin filtrar (para admin)
 * @returns {Promise<Array>} Lista de todos los casos
 */
export const getAllCases = async () => {
  return await apiRequest('/cases');
};

/**
 * Obtiene un caso por su ID
 * @param {string} id - ID del caso (UUID)
 * @returns {Promise<Object|null>} Caso encontrado o null
 */
export const getCaseById = async (id) => {
  try {
    return await apiRequest(`/cases/${id}`);
  } catch (error) {
    return null;
  }
};

/**
 * Obtiene los casos reportados por un usuario específico
 * @param {string} userId - ID del usuario (UUID)
 * @returns {Promise<Array>} Lista de casos del usuario
 */
export const getCasesByUserId = async (userId) => {
  return await apiRequest(`/cases/user/${userId}`);
};

/**
 * Crea un nuevo caso
 * @param {Object} newCaseData - Datos del nuevo caso
 * @returns {Promise<Object>} Caso creado con su ID
 */
export const createCase = async (newCaseData) => {
  return await apiRequest('/cases', {
    method: 'POST',
    body: JSON.stringify(newCaseData)
  });
};

/**
 * Actualiza el estado de un caso
 * @param {string} id - ID del caso (UUID)
 * @param {string} newStatus - Nuevo estado ('PENDIENTE_REVISION', 'ACTIVO', 'RESUELTO', 'RECHAZADO')
 * @returns {Promise<Object|null>} Caso actualizado o null
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
 * Actualiza los datos completos de un caso
 * @param {string} id - ID del caso (UUID)
 * @param {Object} updatedData - Datos actualizados
 * @returns {Promise<Object|null>} Caso actualizado o null
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
 * Elimina un caso (solo admin)
 * @param {string} id - ID del caso a eliminar (UUID)
 * @returns {Promise<boolean>} true si se eliminó, false si no se encontró
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
 * Obtiene todas las pistas de un caso específico
 * @param {string} caseId - ID del caso (UUID)
 * @returns {Promise<Array>} Lista de pistas del caso
 */
export const getCluesByCaseId = async (caseId) => {
  return await apiRequest(`/clues/case/${caseId}`);
};

/**
 * Crea una nueva pista
 * @param {Object} newClueData - Datos de la nueva pista
 * @returns {Promise<Object>} Pista creada con su ID
 */
export const createClue = async (newClueData) => {
  return await apiRequest('/clues', {
    method: 'POST',
    body: JSON.stringify(newClueData)
  });
};

/**
 * Actualiza el estado de una pista
 * @param {string} id - ID de la pista (UUID)
 * @param {string} newStatus - Nuevo estado ('PENDIENTE_REVISION', 'VERIFICADA', 'RECHAZADA')
 * @returns {Promise<Object|null>} Pista actualizada o null
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
 * Obtiene todas las pistas pendientes (para admin)
 * @returns {Promise<Array>} Lista de todas las pistas pendientes
 */
export const getAllClues = async () => {
  return await apiRequest('/clues/pending');
};

// ==================== USUARIOS ====================

/**
 * Obtiene un usuario por su ID
 * @param {string} id - ID del usuario (UUID)
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const getUserById = async (id) => {
  try {
    return await apiRequest(`/users/${id}`);
  } catch (error) {
    return null;
  }
};

/**
 * Obtiene todos los usuarios (solo admin)
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getAllUsers = async () => {
  return await apiRequest('/users');
};

/**
 * Obtiene estadísticas de un usuario
 * @param {string} userId - ID del usuario (UUID)
 * @returns {Promise<Object>} Estadísticas del usuario
 */
export const getUserStats = async (userId) => {
  return await apiRequest(`/users/${userId}/stats`);
};

// ==================== AUTENTICACIÓN ====================

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario (nombre, correo, password, telefono)
 * @returns {Promise<Object>} Usuario registrado con token
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
 * Inicia sesión
 * @param {string} correo - Correo del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Usuario autenticado con token
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
 * Cierra sesión
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Obtiene el usuario actual desde localStorage
 * @returns {Object|null} Usuario actual o null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// ==================== ESTADÍSTICAS ====================

/**
 * Obtiene estadísticas generales de la plataforma
 * @returns {Promise<Object>} Objeto con estadísticas
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
