# 🌟 Red Esperanza - Frontend# Red Esperanza 🤝



<div align="center">Plataforma comunitaria para la búsqueda de menores desaparecidos.



![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)## 📋 Descripción

![Leaflet](https://img.shields.io/badge/Leaflet-4.2.1-199900?style=for-the-badge&logo=leaflet)

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)Red Esperanza es una aplicación web desarrollada en React que permite a usuarios reportar, ver y gestionar casos de desaparición de menores. La aplicación cuenta con dos tipos de usuarios:



**Plataforma comunitaria para reportar y buscar menores desaparecidos en Colombia**- **Usuario Normal**: Puede ver casos activos, reportar desapariciones y aportar pistas.

- **Administrador**: Tiene todos los permisos de un usuario normal, además de poder moderar casos, aprobar/rechazar reportes y gestionar pistas.

[🚀 Instalación](#instalación) • [📖 Documentación](#estructura-del-proyecto) • [🎨 Características](#características-principales)

## 🚀 Características

</div>

### Para Usuarios Normales:

---- ✅ Ver casos activos en formato lista y mapa

- ✅ Ver detalles completos de cada caso

## 📋 Índice- ✅ Reportar desapariciones mediante formulario de 4 pasos

- ✅ Aportar pistas sobre casos activos

- [Acerca del Proyecto](#acerca-del-proyecto)- ✅ Ver historial de reportes propios

- [Stack Tecnológico](#stack-tecnológico)- ✅ Perfil de usuario personalizado

- [Características Principales](#características-principales)

- [Instalación](#instalación)### Para Administradores:

- [Configuración](#configuración)- ✅ Panel de administración con estadísticas

- [Uso](#uso)- ✅ Ver todos los casos (activos, pendientes, resueltos, rechazados)

- [Estructura del Proyecto](#estructura-del-proyecto)- ✅ Aprobar o rechazar reportes pendientes

- [Componentes Clave](#componentes-clave)- ✅ Marcar casos como resueltos

- [Sistema de Diseño](#sistema-de-diseño)- ✅ Eliminar casos

- [Integración con Backend](#integración-con-backend)- ✅ Ver y gestionar pistas recibidas

- [Credenciales de Prueba](#credenciales-de-prueba)- ✅ Verificar o descartar pistas



---## 🏗️ Arquitectura



## 🎯 Acerca del ProyectoEl proyecto está estructurado de la siguiente manera:



**Red Esperanza** es una plataforma web desarrollada para facilitar la búsqueda de menores desaparecidos en Colombia. El frontend proporciona una interfaz intuitiva y accesible para que cualquier persona pueda reportar casos, visualizar información en mapas interactivos y contribuir con pistas.```

src/

### Objetivos:├── components/          # Componentes reutilizables

- ✅ Facilitar el reporte rápido de casos de desaparición│   ├── CaseCard.js

- ✅ Visualizar casos en mapas interactivos en tiempo real│   ├── Header.js

- ✅ Permitir colaboración comunitaria mediante pistas│   ├── Navbar.js

- ✅ Proporcionar herramientas de administración para moderación│   ├── LoadingSpinner.js

│   └── Modal.js

---├── pages/              # Páginas principales

│   ├── HomePage.js

## 🚀 Stack Tecnológico│   ├── CaseDetailPage.js

│   ├── ReportCasePage.js

### Core│   ├── ProfilePage.js

- **React 18.2.0** - Biblioteca principal para UI│   ├── AdminDashboard.js

- **React Router DOM 6.20.0** - Enrutamiento y navegación│   └── LoginPage.js

- **React Scripts 5.0.1** - Configuración y build├── context/            # Manejo de estado global

│   └── AuthContext.js

### Mapas y Geolocalización├── services/           # Lógica de datos (IMPORTANTE)

- **Leaflet 1.9.4** - Librería de mapas interactivos│   └── caseService.js

- **React Leaflet 4.2.1** - Integración de Leaflet con React├── data/               # Datos simulados

- **Nominatim API** - Geocodificación y búsqueda de direcciones│   └── data-dummy.json

- **OpenStreetMap** - Proveedor de tiles para mapas├── App.js             # Configuración de rutas

└── index.js           # Punto de entrada

### Backend y Storage```

- **Supabase Client** - Cliente de Supabase para base de datos y storage

- **REST API** - Comunicación con backend Express## 🔑 Arquitectura de Datos (La Clave del Proyecto)



### Herramientas### ¿Por qué es importante `caseService.js`?

- **ESLint** - Linter para calidad de código

- **CSS3** - Estilos con variables CSS personalizadasEl archivo `src/services/caseService.js` es el corazón de la arquitectura de datos. **Toda la lógica de acceso a datos está abstraída en este servicio**.



---**Actualmente:**

- Lee datos del archivo `data-dummy.json`

## 🎨 Características Principales- Simula latencia de red con `setTimeout`

- Funciona 100% en memoria

### ✨ Sistema de Diseño Coral

- Paleta de colores personalizada en coral naranja (#FF6B5A)**En el futuro (Migración a Supabase):**

- Variables CSS globales para consistencia- Solo necesitas modificar las funciones de `caseService.js`

- Diseño responsive y accesible- Reemplazar las lecturas de JSON por llamadas a la API de Supabase

- Animaciones y transiciones suaves- Los componentes NO necesitan cambios



### 🗺️ Geocodificación Avanzada**Ejemplo de migración:**

- **Búsqueda de direcciones** con autocompletado

- **Geolocalización GPS** para ubicación automática```javascript

- **Reverse geocoding** para obtener dirección desde coordenadas// ANTES (Mock)

- **Botones rápidos** para ciudades principales de Colombia (Bogotá, Medellín, Cali, Barranquilla, Cartagena)export const getAllActiveCases = async () => {

- Integración con Nominatim API (OpenStreetMap)  await delay(500);

- Manejo de permisos de geolocalización  return casosData.filter(caso => caso.estado_caso === 'ACTIVO');

};

### 📸 Sistema de Imágenes

- Subida de hasta **3 imágenes por caso**// DESPUÉS (Supabase)

- Integración con **Supabase Storage**export const getAllActiveCases = async () => {

- Vista previa de imágenes antes de subir  const { data, error } = await supabase

- Validación de tamaño (máximo 5MB por imagen)    .from('casos')

- Drag & drop para facilidad de uso    .select('*')

- Barra de progreso durante la subida    .eq('estado_caso', 'ACTIVO');

- Formato de imágenes: JPG, PNG, WebP  

  if (error) throw error;

### 🗺️ Mapas Interactivos  return data;

- Visualización de casos en mapa con Leaflet};

- Marcadores personalizados con popups informativos```

- Selector de ubicación para reportes

- Zoom y navegación fluida## 📦 Instalación

- Integración con OpenStreetMap

### Requisitos Previos

### 🔐 Autenticación y Seguridad- Node.js (versión 16 o superior)

- Sistema de login y registro- npm o yarn

- Autenticación con JWT (tokens de 7 días)

- Protección de rutas privadas### Pasos de Instalación

- Roles de usuario (Usuario regular y Administrador)

- Sesión persistente con Context API1. **Clonar o descargar el proyecto**

- Hash de contraseñas con bcrypt

2. **Instalar dependencias:**

### 👤 Gestión de Usuarios   ```bash

- Perfil de usuario con estadísticas   npm install

- Visualización de casos reportados por el usuario   ```

- Visualización de pistas contribuidas

- Edición de información personal3. **Iniciar la aplicación:**

- Fecha de registro visible   ```bash

   npm start

### 📝 Reporte de Casos   ```

- Formulario de 4 pasos intuitivo:

  1. Información del menor4. **Abrir en el navegador:**

  2. Circunstancias de la desaparición   La aplicación se abrirá automáticamente en `http://localhost:3000`

  3. Ubicación (con mapa interactivo)

  4. Información de contacto## 👥 Usuarios de Prueba

- Validación de edad (0-18 años obligatorio)

- Campos obligatorios y opcionales claramente marcadosLa aplicación incluye usuarios de prueba en `data-dummy.json`:

- Subida de hasta 3 fotos del menor

- Selección de ubicación en mapa con búsqueda de direcciones### Usuarios Normales:

- Información de contacto del reportante- **María González**

  - Email: maria.gonzalez@email.com

### 🔍 Exploración de Casos  - Tiene 2 reportes registrados

- Lista de casos activos con tarjetas informativas

- Filtros por estado (Activo, Resuelto, Pendiente)- **Carlos Ramírez**

- Vista detallada de cada caso con toda la información  - Email: carlos.ramirez@email.com

- Galería de imágenes del menor  - Tiene 1 reporte registrado

- Mapa de ubicación del caso

- Información de contacto visible- **Ana Martínez**

  - Email: ana.martinez@email.com

### 💡 Sistema de Pistas  - Tiene 1 reporte pendiente

- Cualquier usuario puede contribuir pistas sobre casos

- Subida de foto de pista opcional- **Pedro Sánchez**

- Moderación por administradores  - Email: pedro.sanchez@email.com

- Visualización de pistas por caso  - Tiene 1 caso resuelto

- Estados: Pendiente, Verificada, Rechazada

### Administrador:

### 👨‍💼 Panel de Administrador- **Admin Red Esperanza**

- Vista de todos los casos (incluidos pendientes y rechazados)  - Email: admin@redesperanza.org

- Cambio de estado de casos (aprobar/rechazar/resolver)  - Tiene acceso al panel de administración

- Moderación de pistas (verificar/rechazar)

- Estadísticas del sistema## 🎯 Flujo de Uso

- Eliminación de casos y pistas

### Como Usuario Normal:

---

1. **Login**: Selecciona un usuario normal en la pantalla de login

## 📦 Instalación2. **Ver Casos**: En la página de inicio verás casos activos

3. **Ver Detalle**: Haz clic en cualquier caso para ver detalles completos

### Prerrequisitos4. **Reportar**: Usa el botón central de la navbar para reportar una desaparición

- Node.js >= 14.0.05. **Aportar Pista**: En el detalle de un caso activo, haz clic en "Tengo información"

- npm >= 6.14.06. **Perfil**: Ve tu perfil y tus reportes enviados

- Backend de Red Esperanza ejecutándose en `http://localhost:5000`

### Como Administrador:

### Pasos

1. **Login**: Selecciona el usuario administrador

1. **Clonar el repositorio**2. **Panel Admin**: Verás una pestaña adicional "Admin" en la navbar

```bash3. **Gestionar Casos**: Aprueba, rechaza o resuelve casos

git clone https://github.com/gevengood/red-esperanza-frontend.git4. **Gestionar Pistas**: Verifica o descarta pistas recibidas

cd red-esperanza-frontend5. **Ver Estadísticas**: Consulta el resumen general de la plataforma

```

## 🔧 Estructura de Datos

2. **Instalar dependencias**

```bash### Casos (data-dummy.json)

npm install```json

```{

  "id_caso": 1,

3. **Configurar variables de entorno** (ver sección [Configuración](#configuración))  "nombre_desaparecido": "Sofía Hernández",

  "edad_desaparecido": 8,

4. **Iniciar en modo desarrollo**  "estado_caso": "ACTIVO",

```bash  "descripcion_fisica": "...",

npm start  "direccion_texto": "...",

```  ...

}

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)```



---### Estados de Caso:

- `PENDIENTE_REVISION`: Nuevo reporte esperando aprobación

## ⚙️ Configuración- `ACTIVO`: Caso aprobado y visible públicamente

- `RESUELTO`: Menor encontrado

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:- `RECHAZADO`: Reporte rechazado por admin



```env## 🚀 Próximos Pasos (Migración a Producción)

# URL del Backend API

REACT_APP_API_URL=http://localhost:5000/api/v1### 1. Configurar Supabase



# Configuración de Supabase```bash

REACT_APP_SUPABASE_URL=https://ynnymhcixlaylycrenba.supabase.conpm install @supabase/supabase-js

REACT_APP_SUPABASE_ANON_KEY=tu_clave_anon_aqui```

```

### 2. Crear cliente de Supabase

### Obtener credenciales de Supabase:

1. Crea un proyecto en [supabase.com](https://supabase.com)```javascript

2. Ve a **Settings** → **API**// src/services/supabaseClient.js

3. Copia la **Project URL** y la **anon/public key**import { createClient } from '@supabase/supabase-js';

4. Asegúrate de tener configurado el bucket `case-images` con políticas públicas

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

---const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;



## 🏃‍♂️ Usoexport const supabase = createClient(supabaseUrl, supabaseKey);

```

### Comandos disponibles

### 3. Actualizar caseService.js

```bash

# DesarrolloReemplazar las funciones mock por llamadas reales a Supabase.

npm start          # Inicia servidor de desarrollo en puerto 3000

### 4. Implementar Autenticación Real

# Producción

npm run build      # Genera build optimizado en carpeta /buildIntegrar Supabase Auth en `AuthContext.js`.



# Testing### 5. Subir Imágenes

npm test           # Ejecuta tests en modo watch

Implementar upload de fotos usando Supabase Storage.

# Eject (no recomendado)

npm run eject      # Expone configuración de webpack### 6. Agregar Mapas

```

Integrar Google Maps o Mapbox para geolocalización.

### Flujo de Usuario

## 📝 Notas Importantes

1. **Registro/Login** → Accede con tu cuenta o crea una nueva

2. **Explorar Casos** → Navega por casos activos en el mapa y lista- **Datos en Memoria**: Los datos actuales se resetean al recargar la página

3. **Reportar Caso** → Completa el formulario de 4 pasos con fotos y ubicación- **Fotos**: Las URLs de fotos en data-dummy.json son placeholders

4. **Contribuir Pistas** → Ayuda con información sobre casos existentes- **Mapas**: La vista de mapa es un placeholder visual

5. **Ver Perfil** → Revisa tus reportes y contribuciones- **Autenticación**: El login actual es un simulador sin validación de contraseña



### Flujo de Administrador## 🎨 Tecnologías Utilizadas



1. **Login como Admin** → Usa credenciales de administrador- **React 18**: Framework principal

2. **Panel de Admin** → Accede al dashboard de moderación- **React Router 6**: Navegación

3. **Revisar Casos Pendientes** → Aprobar o rechazar nuevos reportes- **React Context**: Manejo de estado global

4. **Gestionar Pistas** → Verificar o descartar pistas enviadas- **CSS Modules**: Estilos componentizados

5. **Marcar Resueltos** → Cambiar estado de casos encontrados- **Arquitectura funcional**: 100% Hooks y componentes funcionales



---## 📱 Responsive Design



## 📂 Estructura del ProyectoLa aplicación está completamente optimizada para:

- 📱 Móviles (320px - 768px)

```- 💻 Tablets (769px - 1024px)

src/- 🖥️ Desktop (1025px+)

├── components/              # Componentes reutilizables

│   ├── AddressSearch.js     # Búsqueda de direcciones + GPS## 🤝 Contribución

│   ├── AddressSearch.css    

│   ├── CaseCard.js          # Tarjeta de caso individualPara contribuir al proyecto:

│   ├── CaseCard.css

│   ├── Header.js            # Header de la aplicación1. Familiarízate con la arquitectura

│   ├── Header.css2. Asegúrate de entender `caseService.js`

│   ├── ImageUploader.js     # Componente de subida de imágenes a Supabase3. Mantén los componentes desacoplados de la lógica de datos

│   ├── ImageUploader.css4. Usa los Hooks existentes (useAuth)

│   ├── LoadingSpinner.js    # Indicador de carga5. Sigue la estructura de carpetas establecida

│   ├── LoadingSpinner.css

│   ├── MapPicker.js         # Selector de ubicación en mapa## 📄 Licencia

│   ├── MapPicker.css

│   ├── MapView.js           # Visualización de mapa de casosEste proyecto es de código abierto y está disponible para uso educativo y comunitario.

│   ├── MapView.css

│   ├── Modal.js             # Modal reutilizable## 📞 Contacto

│   ├── Modal.css

│   ├── Navbar.js            # Barra de navegaciónRed Esperanza - Juntos encontramos el camino a casa 🤝

│   └── Navbar.css

│---

├── pages/                   # Páginas principales

│   ├── HomePage.js          # Página de inicio con mapa y lista**Desarrollado con ❤️ para ayudar a las familias**

│   ├── HomePage.css
│   ├── LoginPage.js         # Login y registro
│   ├── LoginPage.css
│   ├── ReportCasePage.js    # Formulario de reporte (4 pasos)
│   ├── ReportCasePage.css
│   ├── CaseDetailPage.js    # Detalle de caso individual
│   ├── CaseDetailPage.css
│   ├── ProfilePage.js       # Perfil de usuario
│   ├── ProfilePage.css
│   ├── AdminDashboard.js    # Panel de administrador
│   └── AdminDashboard.css
│
├── services/                # Servicios de API
│   └── caseService.js       # Casos, pistas y autenticación (integrado con backend)
│
├── context/                 # Context API
│   └── AuthContext.js       # Estado global de autenticación
│
├── config/                  # Configuración
│   └── supabase.js          # Cliente de Supabase
│
├── styles/                  # Estilos globales
│   └── variables.css        # Variables CSS (colores, fuentes)
│
├── data/                    # Datos de prueba
│   └── data-dummy.json      # Datos dummy para desarrollo (no usado actualmente)
│
├── App.js                   # Componente raíz con rutas
├── App.css                  # Estilos del App
├── index.js                 # Punto de entrada
└── index.css                # Estilos base
```

---

## 🧩 Componentes Clave

### `AddressSearch.js`
Componente de búsqueda de direcciones con las siguientes capacidades:
- Búsqueda con Nominatim API (OpenStreetMap)
- Geolocalización GPS del navegador
- Reverse geocoding (coordenadas → dirección)
- Botones rápidos para ciudades principales de Colombia
- Manejo de permisos de geolocalización
- Estados de carga y error
- Muestra hasta 8 resultados

**Props:**
- `onLocationSelect(lat, lng, address)` - Callback al seleccionar ubicación

**Ejemplo de uso:**
```jsx
<AddressSearch 
  onLocationSelect={(lat, lng, address) => {
    setPosition([lat, lng]);
    setAddress(address);
  }}
/>
```

### `ImageUploader.js`
Sistema completo de subida de imágenes a Supabase Storage:
- Drag & drop de archivos
- Preview antes de subir
- Upload a Supabase Storage bucket `case-images`
- Validación de tamaño (5MB máx.)
- Validación de formato (image/*)
- Barra de progreso
- Manejo de errores detallado

**Props:**
- `onImageUpload(url)` - Callback con URL de imagen subida
- `label` - Texto descriptivo
- `required` - Si es obligatorio

**Ejemplo de uso:**
```jsx
<ImageUploader 
  label="Foto del menor"
  onImageUpload={(url) => setFoto1(url)}
  required={true}
/>
```

### `MapPicker.js`
Selector interactivo de ubicación en mapa:
- Click en mapa para seleccionar punto
- Marcador arrastrable
- Sincronización con coordenadas externas
- Zoom y navegación con Leaflet
- Integración con OpenStreetMap tiles

**Props:**
- `onLocationSelect(lat, lng)` - Callback al seleccionar
- `externalPosition` - Coordenadas desde fuera del componente

**Ejemplo de uso:**
```jsx
<MapPicker 
  externalPosition={position}
  onLocationSelect={(lat, lng) => {
    setPosition([lat, lng]);
  }}
/>
```

### `CaseCard.js`
Tarjeta de caso con información resumida:
- Foto principal del caso
- Nombre y edad del menor
- Fecha de desaparición
- Ubicación (dirección)
- Estado del caso con colores
- Link a detalle del caso

**Props:**
- `caso` - Objeto con datos del caso

---

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Coral Naranja - Color Principal */
--primary-color: #FF6B5A;
--primary-hover: #FF8573;
--primary-dark: #E85948;

/* Grises */
--text-primary: #2C3E50;
--text-secondary: #7F8C8D;
--background: #F8F9FA;
--card-background: #FFFFFF;

/* Estados */
--success-color: #27AE60;
--warning-color: #F39C12;
--error-color: #E74C3C;
--info-color: #3498DB;
```

### Tipografía
- Fuente principal: **Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif**
- Tamaños: 14px (base), 16px (cuerpo), 24px (títulos), 32px (headers)
- Pesos: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Espaciado
Sistema de espaciado basado en múltiplos de 8px:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Componentes de UI
- Botones con hover y active states
- Inputs con focus states
- Cards con sombras sutiles
- Modales con overlay
- Loading spinners animados

---

## 🔗 Integración con Backend

### API Base URL
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
```

### Servicios Implementados

#### ✅ `caseService.js` (COMPLETAMENTE IMPLEMENTADO)
Servicio completamente funcional integrado con el backend. **Incluye autenticación, casos y pistas**.

**Funciones de Autenticación:**
- `registerUser(userData)` - Registrar nuevo usuario (POST /auth/register)
- `authenticateUser(correo, password)` - Iniciar sesión (POST /auth/login)
- `logoutUser()` - Cerrar sesión (limpia localStorage)
- `getCurrentUser()` - Obtener usuario actual desde localStorage

**Funciones de Casos:**
- `getCases()` - Listar casos activos (GET /cases)
- `getCaseById(id)` - Obtener caso específico (GET /cases/:id)
- `createCase(data)` - Crear nuevo caso (POST /cases)
- `updateCase(id, data)` - Actualizar caso (PUT /cases/:id)
- `deleteCase(id)` - Eliminar caso (DELETE /cases/:id)
- `getMyCases()` - Casos del usuario actual (GET /cases/user/me)

**Funciones de Pistas:**
- `getClues(caseId)` - Pistas de un caso (GET /clues/case/:caseId)
- `createClue(data)` - Crear pista (POST /clues)
- `updateClue(id, data)` - Actualizar pista (PUT /clues/:id)
- `deleteClue(id)` - Eliminar pista (DELETE /clues/:id)

**Características:**
- Manejo automático de tokens JWT
- Logging detallado de errores
- Retry logic para errores de red
- Validación de respuestas

### Autenticación
Todos los servicios manejan automáticamente el token JWT:
```javascript
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Estados HTTP manejados
- `200-299`: Éxito
- `400`: Bad Request (datos inválidos)
- `401`: No autorizado (login requerido)
- `403`: Prohibido (sin permisos)
- `404`: No encontrado
- `500`: Error del servidor

---

## 👥 Credenciales de Prueba

### Administrador
```
Email: admin@redesperanza.org
Password: admin123
```

**Permisos:**
- Ver todos los casos (incluidos pendientes y rechazados)
- Aprobar/rechazar casos
- Marcar casos como resueltos
- Verificar/rechazar pistas
- Eliminar casos y pistas

### Usuario Regular
Crea tu propia cuenta desde la página de registro.

**Permisos:**
- Ver casos activos
- Reportar casos
- Contribuir pistas
- Editar sus propios casos
- Ver su perfil y estadísticas

---

## 🔗 Repositorio Backend

El backend de este proyecto está disponible en:
**[https://github.com/gevengood/red-esperanza-backend](https://github.com/gevengood/red-esperanza-backend)**

**Requisito:** El backend debe estar corriendo en `http://localhost:5000` para que el frontend funcione correctamente.

---

## ⚠️ Limitaciones Conocidas

### Implementado ✅
- Sistema de casos completo con CRUD
- Sistema de pistas con CRUD
- Geocodificación con Nominatim API
- Subida de imágenes a Supabase Storage
- Mapas interactivos con Leaflet
- Panel de administrador funcional
- Sistema de diseño coral implementado

### Pendiente ❌
- **Tests unitarios**: 0% de cobertura
- **Tests de integración**: No implementados
- **Tests E2E**: No implementados
- **CI/CD**: No configurado
- **Docker**: No dockerizado
- **Documentación técnica completa**: Pendiente C4 y 4+1

---

## 📄 Licencia

Proyecto académico desarrollado para la asignatura de **Diseño y Arquitectura de Software**  
**Universidad de la Sabana** - 2025

---

## 👨‍💻 Autor

**Jorge Steven Doncel Bejarano**  
Ingeniería de Sistemas  
Universidad de la Sabana  
Email: jorjuchod@gmail.com  
GitHub: [gevengood](https://github.com/gevengood)

---

## 🙏 Agradecimientos

- **OpenStreetMap** por los tiles de mapas gratuitos
- **Nominatim** por el servicio de geocodificación
- **Supabase** por la infraestructura de backend y storage
- **React** por la excelente librería de UI
- **Leaflet** por la librería de mapas
- **Universidad de la Sabana** por el apoyo académico

---

<div align="center">

**[⬆ Volver arriba](#-red-esperanza---frontend)**

Hecho con ❤️ para ayudar a encontrar menores desaparecidos en Colombia

</div>
