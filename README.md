# Proyecto de Diseño de Software – Corte Uno: Red Esperanza (Frontend)

## 🧠 Presentación del Problema
La desaparición de menores exige reacción temprana y coordinación comunitaria. El frontend de Red Esperanza ofrece una interfaz para: reportar un caso (flujo guiado), visualizar casos en mapa y lista, y aportar pistas verificables que ayuden a localizar al menor. Reduce dispersión de información y acelera difusión estructurada.

Beneficiarios principales:
- Familias: registro y seguimiento transparente del estado del caso.
- Ciudadanos: canal confiable para aportar pistas con contexto geográfico y fotográfico.
- Administradores: herramientas para moderar, aprobar, resolver o rechazar casos y pistas.

## 🎨 Creatividad en la Presentación
Formato dual (lista + mapa) para exploración espacial y textual; formulario multi‑paso claro que reduce errores; subida validada de imágenes; uso de componentes limpios y diseño coral mobile‑first.

Enlace creativo (pendiente de subir): _[Video / Storytelling del flujo de reporte y aporte de pista]_

## 🧱 Fundamentos de Ingeniería de Software
Atributos priorizados:
1. Mantenibilidad: Capas separadas (contexto, servicios, componentes, páginas) y documentación JSDoc en piezas críticas.
2. Escalabilidad: Nuevas vistas se incorporan añadiendo rutas y componentes sin tocar lógica existente.
3. Usabilidad: Flujo de reporte por pasos, estados de carga claros, alternancia lista/mapa intuitiva.
4. Rendimiento: Carga diferida del mapa, fetch centralizado, imágenes servidas desde Supabase Storage/CDN.
5. Seguridad básica: Token JWT almacenado y enviado sólo en endpoints protegidos (servicio central). Pendientes: refresco de token y endurecer almacenamiento.
6. Accesibilidad inicial: Textos descriptivos y feedback visual (faltan roles ARIA y navegación por teclado integral).

## 🧩 Diseño de Software
### Principios SOLID Aplicados
1. SRP: `CaseCard` muestra resumen, `ImageUploader` gestiona validación/subida, `MapPicker` selección geográfica, `AuthContext` autenticación; cada uno un foco.
2. OCP: Extensión por composición (nuevos pasos en formulario de reporte, nuevas vistas) sin modificar componentes existentes.
3. DIP: Componentes dependen de abstracciones del servicio (`caseService.js`) en lugar de endpoints directos; reemplazar backend sólo exige cambiar la capa de servicio.

### Patrones de Diseño
- Context Pattern: `AuthContext.js` provee sesión y rol sin prop drilling.
- Service Layer / Fachada: `caseService.js` centraliza lógica HTTP, tokens y transforma respuestas.
- Presentational vs Container (implícito): Páginas orquestan estado y navegación; componentes presentan datos y disparan callbacks.

### Justificación
Reduce acoplamiento horizontal (UI ↔ datos), facilita pruebas aisladas de componentes, permite evolución de API sin romper vistas y mantiene responsabilidades limitadas.

### Diagramas UML (Reservados)
- Diagrama de clases básico: Usuario, Caso, Pista, ServicioAuth, ServicioCasos.
- Diagrama de componentes: App → Pages → Components → Services → Backend.

### Casos de Uso / Secuencia (Reservados)
1. Reportar Caso (Actor: Usuario) – pasos: ingresar datos, ubicación, fotos, confirmación → estado PENDIENTE_REVISION.
2. Aportar Pista (Actor: Usuario) – seleccionar caso, mensaje/foto → estado PENDIENTE_REVISION → verificación admin.
3. Moderar Caso (Actor: Admin) – aprobar/rechazar/resolver.

## 💻 Implementación
Estructura principal:
```
src/
  index.js              # Render raíz
  App.js                # Rutas y guardas (ProtectedRoute/AdminRoute)
  context/AuthContext.js# Estado global auth + roles
  services/caseService.js# Fachada HTTP (casos, pistas, usuarios, auth, stats)
  config/supabase.js    # Cliente Supabase
  components/           # UI atómica (CaseCard, MapPicker, ImageUploader, ...)
  pages/                # Páginas orquestadoras (Home, ReportCase, Profile, Admin...)
  data/                 # Datos de prueba locales (data-dummy.json)
  styles/               # Variables y estilos globales
```

Referencias clave (enlace rápido a archivos):
- `src/context/AuthContext.js`
- `src/services/caseService.js`
- `src/components/MapPicker.js`, `src/components/MapView.js`, `src/components/AddressSearch.js`
- `src/components/ImageUploader.js`
- `src/pages/HomePage.js`, `src/pages/ReportCasePage.js`, `src/pages/AdminDashboard.js`

Patrones reflejados en código:
- Inversión de dependencias: UI nunca hace fetch directo; usa funciones del servicio.
- Encapsulación: Token leído internamente y adjuntado a headers.

## 🔍 Análisis Técnico
### Cohesión
Cada módulo tiene una sola razón de cambio: `caseService.js` (lógica HTTP), `AuthContext.js` (estado auth), `MapPicker.js` (selección de ubicación), `ImageUploader.js` (subida y validación). Evita mezclar UI con networking o almacenamiento.

### Bajo Acoplamiento
El resto de la UI no conoce formato de respuesta bruto del backend; recibe estructuras ya normalizadas de la capa servicio. Cambios de endpoints o parámetros afectan sólo `caseService.js`.

### Atributos de Calidad
- Mantenibilidad: Comentarios JSDoc, separación por carpetas, funciones pequeñas.
- Rendimiento: Carga condicional del mapa, debounce en búsqueda de direcciones, fetch agrupado en estadísticas (`Promise.all`).
- Escalabilidad: Añadir nueva entidad (ej. “Alertas”) implicaría crear nuevo servicio o ampliar `caseService.js` sin tocar componentes existentes.
- Usabilidad: Estados de carga y vacíos (`LoadingSpinner`, mensajes claros), alternancia lista/mapa.
- Seguridad básica: Uso de JWT (guardado en localStorage). Pendiente: refresh tokens, sanitización profunda de inputs y restricción de tamaño de imágenes desde el lado servidor.

### Riesgos / Pendientes
- Tests ausentes (unitarios y integración).
- Falta de control de errores centralizado con códigos específicos.
- Accesibilidad parcial (no ARIA completo ni navegación con teclado en todos los componentes).

## 👥 Créditos y Roles
Autores: Jorge Steven Doncel Bejarano – Arquitectura frontend, implementación inicial, integración con backend, documentación académica.
         David Santiago Buendia Londoño – Arquitectura frontend, implementación inicial, integración con backend, documentación académica.
         Santiago Pulido Herrera – Arquitectura frontend, implementación inicial, integración con backend, documentación académica.
Contacto: jorjuchod@gmail.com | GitHub: @gevengood

© 2025 Red Esperanza – Uso académico.
