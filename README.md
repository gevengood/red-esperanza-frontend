# Red Esperanza 🤝

Plataforma comunitaria para la búsqueda de menores desaparecidos.

## 📋 Descripción

Red Esperanza es una aplicación web desarrollada en React que permite a usuarios reportar, ver y gestionar casos de desaparición de menores. La aplicación cuenta con dos tipos de usuarios:

- **Usuario Normal**: Puede ver casos activos, reportar desapariciones y aportar pistas.
- **Administrador**: Tiene todos los permisos de un usuario normal, además de poder moderar casos, aprobar/rechazar reportes y gestionar pistas.

## 🚀 Características

### Para Usuarios Normales:
- ✅ Ver casos activos en formato lista y mapa
- ✅ Ver detalles completos de cada caso
- ✅ Reportar desapariciones mediante formulario de 4 pasos
- ✅ Aportar pistas sobre casos activos
- ✅ Ver historial de reportes propios
- ✅ Perfil de usuario personalizado

### Para Administradores:
- ✅ Panel de administración con estadísticas
- ✅ Ver todos los casos (activos, pendientes, resueltos, rechazados)
- ✅ Aprobar o rechazar reportes pendientes
- ✅ Marcar casos como resueltos
- ✅ Eliminar casos
- ✅ Ver y gestionar pistas recibidas
- ✅ Verificar o descartar pistas

## 🏗️ Arquitectura

El proyecto está estructurado de la siguiente manera:

```
src/
├── components/          # Componentes reutilizables
│   ├── CaseCard.js
│   ├── Header.js
│   ├── Navbar.js
│   ├── LoadingSpinner.js
│   └── Modal.js
├── pages/              # Páginas principales
│   ├── HomePage.js
│   ├── CaseDetailPage.js
│   ├── ReportCasePage.js
│   ├── ProfilePage.js
│   ├── AdminDashboard.js
│   └── LoginPage.js
├── context/            # Manejo de estado global
│   └── AuthContext.js
├── services/           # Lógica de datos (IMPORTANTE)
│   └── caseService.js
├── data/               # Datos simulados
│   └── data-dummy.json
├── App.js             # Configuración de rutas
└── index.js           # Punto de entrada
```

## 🔑 Arquitectura de Datos (La Clave del Proyecto)

### ¿Por qué es importante `caseService.js`?

El archivo `src/services/caseService.js` es el corazón de la arquitectura de datos. **Toda la lógica de acceso a datos está abstraída en este servicio**.

**Actualmente:**
- Lee datos del archivo `data-dummy.json`
- Simula latencia de red con `setTimeout`
- Funciona 100% en memoria

**En el futuro (Migración a Supabase):**
- Solo necesitas modificar las funciones de `caseService.js`
- Reemplazar las lecturas de JSON por llamadas a la API de Supabase
- Los componentes NO necesitan cambios

**Ejemplo de migración:**

```javascript
// ANTES (Mock)
export const getAllActiveCases = async () => {
  await delay(500);
  return casosData.filter(caso => caso.estado_caso === 'ACTIVO');
};

// DESPUÉS (Supabase)
export const getAllActiveCases = async () => {
  const { data, error } = await supabase
    .from('casos')
    .select('*')
    .eq('estado_caso', 'ACTIVO');
  
  if (error) throw error;
  return data;
};
```

## 📦 Instalación

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

4. **Abrir en el navegador:**
   La aplicación se abrirá automáticamente en `http://localhost:3000`

## 👥 Usuarios de Prueba

La aplicación incluye usuarios de prueba en `data-dummy.json`:

### Usuarios Normales:
- **María González**
  - Email: maria.gonzalez@email.com
  - Tiene 2 reportes registrados

- **Carlos Ramírez**
  - Email: carlos.ramirez@email.com
  - Tiene 1 reporte registrado

- **Ana Martínez**
  - Email: ana.martinez@email.com
  - Tiene 1 reporte pendiente

- **Pedro Sánchez**
  - Email: pedro.sanchez@email.com
  - Tiene 1 caso resuelto

### Administrador:
- **Admin Red Esperanza**
  - Email: admin@redesperanza.org
  - Tiene acceso al panel de administración

## 🎯 Flujo de Uso

### Como Usuario Normal:

1. **Login**: Selecciona un usuario normal en la pantalla de login
2. **Ver Casos**: En la página de inicio verás casos activos
3. **Ver Detalle**: Haz clic en cualquier caso para ver detalles completos
4. **Reportar**: Usa el botón central de la navbar para reportar una desaparición
5. **Aportar Pista**: En el detalle de un caso activo, haz clic en "Tengo información"
6. **Perfil**: Ve tu perfil y tus reportes enviados

### Como Administrador:

1. **Login**: Selecciona el usuario administrador
2. **Panel Admin**: Verás una pestaña adicional "Admin" en la navbar
3. **Gestionar Casos**: Aprueba, rechaza o resuelve casos
4. **Gestionar Pistas**: Verifica o descarta pistas recibidas
5. **Ver Estadísticas**: Consulta el resumen general de la plataforma

## 🔧 Estructura de Datos

### Casos (data-dummy.json)
```json
{
  "id_caso": 1,
  "nombre_desaparecido": "Sofía Hernández",
  "edad_desaparecido": 8,
  "estado_caso": "ACTIVO",
  "descripcion_fisica": "...",
  "direccion_texto": "...",
  ...
}
```

### Estados de Caso:
- `PENDIENTE_REVISION`: Nuevo reporte esperando aprobación
- `ACTIVO`: Caso aprobado y visible públicamente
- `RESUELTO`: Menor encontrado
- `RECHAZADO`: Reporte rechazado por admin

## 🚀 Próximos Pasos (Migración a Producción)

### 1. Configurar Supabase

```bash
npm install @supabase/supabase-js
```

### 2. Crear cliente de Supabase

```javascript
// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 3. Actualizar caseService.js

Reemplazar las funciones mock por llamadas reales a Supabase.

### 4. Implementar Autenticación Real

Integrar Supabase Auth en `AuthContext.js`.

### 5. Subir Imágenes

Implementar upload de fotos usando Supabase Storage.

### 6. Agregar Mapas

Integrar Google Maps o Mapbox para geolocalización.

## 📝 Notas Importantes

- **Datos en Memoria**: Los datos actuales se resetean al recargar la página
- **Fotos**: Las URLs de fotos en data-dummy.json son placeholders
- **Mapas**: La vista de mapa es un placeholder visual
- **Autenticación**: El login actual es un simulador sin validación de contraseña

## 🎨 Tecnologías Utilizadas

- **React 18**: Framework principal
- **React Router 6**: Navegación
- **React Context**: Manejo de estado global
- **CSS Modules**: Estilos componentizados
- **Arquitectura funcional**: 100% Hooks y componentes funcionales

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 Móviles (320px - 768px)
- 💻 Tablets (769px - 1024px)
- 🖥️ Desktop (1025px+)

## 🤝 Contribución

Para contribuir al proyecto:

1. Familiarízate con la arquitectura
2. Asegúrate de entender `caseService.js`
3. Mantén los componentes desacoplados de la lógica de datos
4. Usa los Hooks existentes (useAuth)
5. Sigue la estructura de carpetas establecida

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comunitario.

## 📞 Contacto

Red Esperanza - Juntos encontramos el camino a casa 🤝

---

**Desarrollado con ❤️ para ayudar a las familias**
