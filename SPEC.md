Crea un sitio web de marketing y presentación para mi Trabajo de Fin de Grado (TFG) titulado: "VR Code City: Immersive Code Analysis Environment".

El sitio debe actuar como landing page promocional y portal académico del proyecto. Debe ser altamente profesional, dinámico y estructurado para presentar la plataforma a tribunales académicos, desarrolladores e inversores.

---

### 1. DATOS Y CONTEXTO DEL PROYECTO

- **Nombre del Proyecto:** VR Code City: Immersive Code Analysis Environment (TFG).
- **Descripción General:** Plataforma multijugador en Realidad Virtual Web (WebVR/WebXR) que transforma la análisis de código en una experiencia espacial, convirtiendo repositorios de GitHub en ciudades 3D interactivas.
- **Tecnologías Clave:** A-Frame, Three.js, WebXR, Node.js, Express, Networked-Aframe, Socket.io, EasyRTC (P2P), OpenRouter API (LLMs para IA).

---

### 2. ESTRUCTURA Y SECCIONES OBLIGATORIAS DE LA WEB

1. **HERO SECTION (Portada Impactante):**
   - Título principal: *VR Code City*
   - Subtítulo: *Visualización espacial de repositorios y análisis de código multijugador en Realidad Virtual asistido por IA.*
   - CTAs (Botones de acción principal):
     - `[ Probar Demo En Vivo ]` (Enlace directo a la app)
     - `[ Leer Memoria TFG (PDF) ]` (Acceso directo a la memoria)
     - `[ Ver Repositorio en GitHub ]` (Enlace al código fuente)

2. **SECCIÓN DE VÍDEOS EXPLICATIVOS & DEMOS (Video Deck Grid):**
   - Espacio tipo rejilla o carrusel interactivo para albergar reproducciones de vídeo (con soporte para YouTube/Vimeo o vídeos locales HTML5):
     - **Vídeo 1:** *Navegación espacial por la Ciudad de Código (Líneas de código = Altura de edificios, Modo Rayos X / Heatmap temporal y Máquina del Tiempo Git).*
     - **Vídeo 2:** *Interacción con 'The Oracle' (Agente de IA espacial basado en mirada/RAG para refactorización y explicación de bugs en VR).*
     - **Vídeo 3:** *Sesión Multijugador y Colaboración en Tiempo Real (Presencia WebRTC, avatares 3D y chat de voz).*

3. **VISOR Y DOCUMENTACIÓN ACADÉMICA (Memoria del TFG):**
   - Contenedor interactivo con visor de PDF integrado (`<iframe/embed>` o React-PDF) para previsualizar y leer la Memoria Oficial del TFG directamente en la web sin salir de la página.
   - Botón destacado de descarga: `[ Descargar Memoria Oficial (PDF) ]`.
   - Tarjetas de resumen ejecutivo que destaquen:
     - Objetivos del TFG.
     - Metodología y arquitectura de software.
     - Conclusiones y trabajo futuro.

4. **CARACTERÍSTICAS TÉCNICAS (Feature Breakdown):**
   - Tarjetas interactivas que expliquen las 3 columnas del proyecto:
     - **Spatial Repository Mapping:** Conversión de directorios a distritos y archivos a edificios 3D según métricas de LOC. Modo Rayos X y time-travel por commits.
     - **The Oracle (Context-Aware AI):** Asistente IA integrado en VR con RAG guiado por la mirada del usuario mediante OpenRouter API.
     - **Multiplayer Collaboration:** Presencia compartida, seguimiento de cabeza/manos (WebRTC) y chat de voz P2P.

5. **ARQUITECTURA Y TECH STACK (Grilla Visual de Tecnologías):**
   - Iconos/Badges interactivos con las tecnologías empleadas divididas en:
     - *Frontend 3D/VR:* A-Frame, Three.js, WebXR API.
     - *Backend & Git:* Node.js, Express, simple-git.
     - *Red & Tiempo Real:* Networked-Aframe, Socket.io, EasyRTC.
     - *Inteligencia Artificial:* OpenRouter API (Gemma / LLMs).

6. **INSTRUCCIONES DE INSTALACIÓN Y GUÍA DE CONTROLES:**
   - Acordeón interactivo o bloque estilo terminal de comandos con los pasos para clonar el repositorio y ejecutar localmente (`npm install`, `npm start`, configuración `.env` con OPENROUTER_API_KEY).
   - Guía de controles diferenciada para **Modo Escritorio** (Teclado/Ratón: WASD, Tecla O) y **Modo VR (HMD/Meta Quest)** (Joysticks, Gatillos y Botones X/Y).

7. **FOOTER & AUTORÍA:**
   - Créditos del Trabajo de Fin de Grado (Nombre del Alumno, Tutor/es, Universidad).
   - Enlaces finales al repositorio de GitHub, perfil de LinkedIn y licencia del proyecto.
