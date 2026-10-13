# 🎓 AccedeED - Web Edition (Versión para Computadoras)

Versión Web oficial de la aplicación móvil **AccedeED**, diseñada y optimizada para computadoras y navegadores de escritorio, manteniendo el 100% de la identidad gráfica, funciones pedagógicas y el compromiso con el **ODS 4 (Educación de Calidad)**.

---

## 🚀 ¿Cómo abrir la aplicación en tu computadora?

Tienes 3 formas muy sencillas de abrirla:

### Opción 1: Con 1 Clic (Recomendada)
Haz doble clic en el archivo:
```text
C:\Users\elseb\AndroidStudioProjects\AccedeED\web\run_web.bat
```
Esto iniciará un servidor web local y abrirá automáticamente tu navegador preferido en:
👉 `http://localhost:8080`

### Opción 2: Abrir directamente sin servidor
Haz doble clic directamente sobre el archivo:
```text
C:\Users\elseb\AndroidStudioProjects\AccedeED\web\index.html
```
Se abrirá de inmediato en Microsoft Edge, Google Chrome, Mozilla Firefox o Brave sin necesidad de instalar nada adicional.

### Opción 3: Desde la terminal de comandos (PowerShell / CMD)
```powershell
cd C:\Users\elseb\AndroidStudioProjects\AccedeED\web
python server.py
```

---

## 🌐 ¿Dónde y cómo publicarla gratis en la Web para que otros la abran?

Si quieres que tus compañeros o profesores puedan abrirla desde cualquier computadora a través de internet con un enlace web público:

### 1. En GitHub Pages (100% Gratuito):
1. Sube los archivos de la carpeta `web/` a un repositorio de GitHub.
2. Ve a **Settings** -> **Pages** en tu repositorio.
3. En **Source**, selecciona `main` (o `master`) y la carpeta `/ (root)`.
4. ¡Listo! Tu app estará disponible en una URL como:
   `https://tu-usuario.github.io/accedeed-web/`

### 2. En Vercel o Netlify (Arrastrar y Soltar):
1. Entra a [vercel.com](https://vercel.com) o [netlify.com](https://netlify.com).
2. Simplemente arrastra la carpeta `web` a la pantalla de despliegue.
3. Te generará un dominio público gratuito al instante (ejemplo: `https://accedeed.vercel.app`).

---

## 🌟 Características y Módulos Incluidos

1. **Dashboard Principal (Inicio)**:
   - Saludo dinámico según la hora del día.
   - Tarjeta motivacional de **AccedeBot**.
   - Tarjetas métricas: **Promedio General** (con gráfica de tendencias en tiempo real) y **Racha de Estudio** (con fuego animado).
   - Lista de **Progreso por Materia** con barra de porcentaje y modal para agregar o editar asignaturas.
   - Lista interactiva de **Objetivos Diarios y Semanales** con tachado de metas completadas.
   - Historial de **Actividad Reciente**.

2. **Chat IA (AccedeBot Tutor)**:
   - Mascota animada con parpadeo de ojos brillantes y modo de pensamiento.
   - Conexión con **OpenRouter API** (Google Gemini) con clave por defecto preconfigurada o personalizada.
   - Modo de respuesta inteligente offline para responder dudas educativas aunque no haya internet.
   - Historial de sesiones y botón para crear nuevos chats.

3. **Google Classroom Hub**:
   - Tarjetas de materias con gradientes personalizados.
   - Vista detallada de curso con 3 pestañas: **Novedades**, **Trabajos de Clase** e **Información**.
   - Modal de entrega de tareas (marcar como entregada / anular entrega).
   - Visor integrado de documentos y guías en PDF.

4. **Evaluación Interactiva (Estilo Kahoot con IA)**:
   - Configuración de materia, temas específicos, autoevaluación de nivel (Principiante / Intermedio / Experto) y número de preguntas.
   - 4 opciones coloridas interactivas (▲ Rojo, ◆ Azul, ● Amarillo, ■ Verde).
   - Retroalimentación instantánea (correcta / incorrecta), pistas y acumulación de estrellas/puntos ⭐.
   - Reporte pedagógico final con calificación realista.

5. **Flashcards 3D**:
   - Tarjetas con efecto de volteo tridimensional (3D flip) al hacer clic.
   - Filtro por categoría (Matemáticas, Física, Ciencias, Historia, etc.).
   - Modal para crear y eliminar tarjetas.

6. **Camino Académico de Niveles (ODS 4)**:
   - Mapa de niveles interactivo en zigzag (Estilo Duolingo) del nivel 1 al 10.
   - Sistema de desbloqueo diario: 1 nivel por día mantiene viva tu racha de fuego 🔥.

7. **Formularios, Páginas de Estudio y Pomodoro**:
   - Formulario de fórmulas clave (Matemáticas, Física, Química, Programación) con explicaciones emergentes paso a paso y opción de añadir fórmulas propias.
   - Directorio de plataformas recomendadas (Khan Academy, GeoGebra, WolframAlpha, Coursera, PhET, etc.).
   - **Cronómetro Pomodoro** (25 minutos) con inicio, pausa y reinicio.

8. **Recursos Educativos**:
   - Biblioteca de guías PDF, diapositivas, infografías y simulaciones con visor in-app.

9. **Calendario Escolar**:
   - Selector de fechas con cuadrícula mensual y listado de entregas y exámenes agendados.

10. **Buscador Académico Unificado**:
    - Búsqueda en tiempo real que localiza al instante fórmulas, tareas de classroom, fechas del calendario y flashcards.

11. **Centro de Notificaciones**:
    - Avisos sobre riesgo de racha, pendientes escolares y recordatorios de estudio.

12. **Perfil y Ajustes**:
    - Cambio instantáneo entre **Modo Oscuro**, **Modo Claro** y **Modo Alto Contraste**.
    - Monitoreo del **Límite Diario de Tiempo en Pantalla (Compromiso ODS 4)** con alerta automática para cuidar tu salud visual y hábitos de descanso.
