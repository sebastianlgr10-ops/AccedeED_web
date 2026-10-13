/**
 * AccedeED Web - Interactive Application Engine
 * Compatible con todos los navegadores modernos en computadoras
 */

// ============================================================================
// 1. STATE & STORAGE MANAGEMENT
// ============================================================================

const AppState = {
  theme: localStorage.getItem("accedeed_theme") || "dark",
  user: JSON.parse(localStorage.getItem("accedeed_user")) || {
    name: "Sebastián Gómez",
    preferredName: "Sebas",
    age: "18",
    academicLevel: "Preparatoria",
    email: "estudiante@accedeed.edu",
    dailyTimeLimitMinutes: 30,
    isOnboardingDone: true
  },
  stats: JSON.parse(localStorage.getItem("accedeed_stats")) || {
    streak: 3,
    lastCompletedDate: "",
    totalPoints: 240,
    timeSpentTodayMinutes: 0
  },
  subjects: JSON.parse(localStorage.getItem("accedeed_subjects")) || INITIAL_SUBJECTS,
  dailyGoals: JSON.parse(localStorage.getItem("accedeed_goals")) || INITIAL_GOALS,
  flashcards: JSON.parse(localStorage.getItem("accedeed_flashcards")) || INITIAL_FLASHCARDS,
  formulas: JSON.parse(localStorage.getItem("accedeed_formulas")) || INITIAL_FORMULAS,
  calendarEvents: JSON.parse(localStorage.getItem("accedeed_events")) || INITIAL_CALENDAR_EVENTS,
  courses: JSON.parse(localStorage.getItem("accedeed_courses")) || INITIAL_COURSES,
  notifications: JSON.parse(localStorage.getItem("accedeed_notifs")) || INITIAL_NOTIFICATIONS,
  customApiKey: localStorage.getItem("accedeed_openrouter_key") || "",
  
  // Runtime State
  currentView: "inicio",
  chatSessions: [
    {
      id: "s1",
      title: "Dudas de Cálculo Diferencial",
      messages: [
        { role: "assistant", content: "¡Hola! Soy AccedeBot, tu tutor de Inteligencia Artificial para el ODS 4. ¿En qué tema podemos trabajar hoy?" },
        { role: "user", content: "¿Cómo aplico la regla de la cadena en derivadas?" },
        { role: "assistant", content: "¡Excelente pregunta! La regla de la cadena se usa cuando tienes funciones compuestas f(g(x)). Su fórmula es: (f ∘ g)'(x) = f'(g(x)) · g'(x). Es decir, derivas la función exterior evaluada en la interior, y multiplicas por la derivada de la interior." }
      ]
    }
  ],
  activeChatSessionId: "s1",
  selectedCourseId: null,
  activeQuiz: {
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    selectedOption: -1
  },
  activeSubjectLevel: "Matemáticas",
  pomodoro: {
    timeLeftSeconds: 25 * 60,
    isRunning: false,
    timerId: null
  },
  calendarMonthOffset: 0
};

function saveState() {
  localStorage.setItem("accedeed_theme", AppState.theme);
  localStorage.setItem("accedeed_user", JSON.stringify(AppState.user));
  localStorage.setItem("accedeed_stats", JSON.stringify(AppState.stats));
  localStorage.setItem("accedeed_subjects", JSON.stringify(AppState.subjects));
  localStorage.setItem("accedeed_goals", JSON.stringify(AppState.dailyGoals));
  localStorage.setItem("accedeed_flashcards", JSON.stringify(AppState.flashcards));
  localStorage.setItem("accedeed_formulas", JSON.stringify(AppState.formulas));
  localStorage.setItem("accedeed_events", JSON.stringify(AppState.calendarEvents));
  localStorage.setItem("accedeed_courses", JSON.stringify(AppState.courses));
  localStorage.setItem("accedeed_notifs", JSON.stringify(AppState.notifications));
}

// ============================================================================
// 2. ROUTER & NAVIGATION
// ============================================================================

function navigateTo(viewId) {
  AppState.currentView = viewId;

  // Update Sidebar
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-view") === viewId);
  });

  // Update View Sections
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });
  const targetSection = document.getElementById(`view-${viewId}`);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Trigger view renderers
  switch (viewId) {
    case "inicio": renderDashboard(); break;
    case "chat": renderChat(); break;
    case "clases": renderClassroom(); break;
    case "evaluacion": resetQuizToConfig(); break;
    case "flashcards": renderFlashcards(); break;
    case "progreso": renderProgreso(); break;
    case "formularios": renderFormularios(); break;
    case "recursos": renderRecursos(); break;
    case "calendario": renderCalendario(); break;
    case "busca": executeSearch(""); break;
    case "notificaciones": renderNotificaciones(); break;
    case "perfil": renderPerfil(); break;
    case "ajustes": renderAjustes(); break;
    case "acercade": break;
  }

  refreshIcons();
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ============================================================================
// 3. THEME TOGGLING (DARK / LIGHT / HIGH CONTRAST)
// ============================================================================

function applyTheme(theme) {
  AppState.theme = theme;
  document.body.className = `${theme}-theme`;
  if (theme === "high-contrast") {
    document.body.className = "high-contrast";
  }

  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.setAttribute("data-lucide", theme === "light" ? "sun" : (theme === "high-contrast" ? "contrast" : "moon"));
  }

  saveState();
  refreshIcons();
}

function cycleTheme() {
  const themes = ["dark", "light", "high-contrast"];
  const nextIdx = (themes.indexOf(AppState.theme) + 1) % themes.length;
  applyTheme(themes[nextIdx]);
}

function setTheme(theme) {
  applyTheme(theme);
}

// ============================================================================
// 4. VIEW: INICIO (DASHBOARD)
// ============================================================================

function renderDashboard() {
  const user = AppState.user;
  const name = user.preferredName || user.name || "Estudiante";

  // Greeting based on hour
  const hour = new Date().getHours();
  let greet = "¡Buenos días";
  if (hour >= 12 && hour < 19) greet = "¡Buenas tardes";
  else if (hour >= 19 || hour < 5) greet = "¡Buenas noches";

  const greetEl = document.getElementById("dash-greeting");
  if (greetEl) greetEl.textContent = `${greet}, ${name}! 👋`;

  const headerName = document.getElementById("header-user-name");
  if (headerName) headerName.textContent = name;

  const headerAvatar = document.getElementById("header-avatar-initial");
  if (headerAvatar) headerAvatar.textContent = name.charAt(0).toUpperCase();

  // Average Calculation
  const totalSubj = AppState.subjects.length;
  const sumProgress = AppState.subjects.reduce((sum, s) => sum + s.progress, 0);
  const avg = totalSubj > 0 ? Math.round(sumProgress / totalSubj) : 0;
  const avgEl = document.getElementById("dash-average-val");
  if (avgEl) avgEl.textContent = `${avg}%`;

  // Draw sparkline trend chart
  drawTrendChart();

  // Streak Display
  const streakDaysEl = document.getElementById("dash-streak-days");
  if (streakDaysEl) streakDaysEl.textContent = `${AppState.stats.streak} ${AppState.stats.streak === 1 ? "día" : "días"}`;

  // Subjects List
  renderSubjectsList();

  // Goals List
  renderGoalsList();

  // Recent Activities
  renderRecentActivities();
}

function drawTrendChart() {
  const canvas = document.getElementById("trend-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.strokeStyle = "#0066ff";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  const points = [
    { x: 0, y: h * 0.8 },
    { x: w * 0.2, y: h * 0.6 },
    { x: w * 0.4, y: h * 0.7 },
    { x: w * 0.6, y: h * 0.35 },
    { x: w * 0.8, y: h * 0.45 },
    { x: w, y: h * 0.2 }
  ];

  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function renderSubjectsList() {
  const container = document.getElementById("dash-subjects-list");
  if (!container) return;

  container.innerHTML = AppState.subjects.map(s => `
    <div class="subject-item-row">
      <div class="subject-item-header">
        <div class="subject-name-group">
          <i data-lucide="${s.icon || 'book'}" style="color: ${s.color || '#0066ff'}; width: 18px; height: 18px;"></i>
          <span>${s.name}</span>
        </div>
        <span class="subject-pct-label">${s.progress}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar" style="width: ${s.progress}%; background-color: ${s.color || '#0066ff'};"></div>
      </div>
    </div>
  `).join("");

  refreshIcons();
}

function renderGoalsList() {
  const container = document.getElementById("dash-goals-list");
  if (!container) return;

  const total = AppState.dailyGoals.length;
  const completed = AppState.dailyGoals.filter(g => g.isCompleted).length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  const progressBar = document.getElementById("goals-progress-bar");
  if (progressBar) progressBar.style.width = `${pct}%`;

  const label = document.getElementById("goals-count-label");
  if (label) label.textContent = `${completed} de ${total} completados`;

  container.innerHTML = AppState.dailyGoals.map(g => `
    <div class="goal-item ${g.isCompleted ? 'completed' : ''}">
      <button class="goal-checkbox" onclick="toggleGoal(${g.id})">
        ${g.isCompleted ? '<i data-lucide="check" style="width: 14px; height: 14px;"></i>' : ''}
      </button>
      <span class="goal-title">${g.title}</span>
      <button class="btn-delete-goal" onclick="deleteGoal(${g.id})"><i data-lucide="trash-2" style="width: 16px; height: 16px;"></i></button>
    </div>
  `).join("");

  refreshIcons();
}

function toggleGoal(id) {
  const goal = AppState.dailyGoals.find(g => g.id === id);
  if (goal) {
    goal.isCompleted = !goal.isCompleted;
    saveState();
    renderGoalsList();
  }
}

function deleteGoal(id) {
  AppState.dailyGoals = AppState.dailyGoals.filter(g => g.id !== id);
  saveState();
  renderGoalsList();
}

function renderRecentActivities() {
  const container = document.getElementById("dash-activities-list");
  if (!container) return;

  container.innerHTML = INITIAL_RECENT_ACTIVITIES.map(a => `
    <div class="activity-row">
      <div class="activity-icon-badge" style="background-color: ${a.color}22; color: ${a.color};">
        <i data-lucide="${a.type === 'Quiz' ? 'help-circle' : (a.type === 'Flashcard' ? 'layers' : (a.type === 'Nivel' ? 'award' : 'school'))}"></i>
      </div>
      <div class="activity-meta">
        <div class="activity-title">${a.title}</div>
        <div class="activity-time">${a.time} • ${a.score}</div>
      </div>
    </div>
  `).join("");

  refreshIcons();
}

// ============================================================================
// 5. VIEW: CHAT IA (ACCEDEBOT TUTOR)
// ============================================================================

function renderChat() {
  const sessionsContainer = document.getElementById("chat-sessions-list");
  if (sessionsContainer) {
    sessionsContainer.innerHTML = AppState.chatSessions.map(s => `
      <div class="session-item ${s.id === AppState.activeChatSessionId ? 'active' : ''}" onclick="switchChatSession('${s.id}')">
        <i data-lucide="message-square" style="width: 16px; height: 16px;"></i>
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.title}</span>
      </div>
    `).join("");
  }

  const stream = document.getElementById("chat-messages-stream");
  if (!stream) return;

  const currentSession = AppState.chatSessions.find(s => s.id === AppState.activeChatSessionId) || AppState.chatSessions[0];
  if (!currentSession) return;

  stream.innerHTML = currentSession.messages.map(m => `
    <div class="message-row ${m.role === 'user' ? 'user' : 'bot'}">
      ${m.role !== 'user' ? `
        <div class="mascot-avatar" style="width: 28px; height: 28px;">
          <svg class="mascot-svg" viewBox="0 0 100 100">
            <rect x="20" y="20" width="60" height="60" rx="15" fill="none" stroke="#0066ff" stroke-width="6"/>
            <ellipse cx="38" cy="45" rx="6" ry="6" fill="#0066ff"/>
            <ellipse cx="62" cy="45" rx="6" ry="6" fill="#0066ff"/>
            <path d="M40,65 Q50,75 60,65" fill="none" stroke="#0066ff" stroke-width="5" stroke-linecap="round"/>
          </svg>
        </div>
      ` : ''}
      <div class="message-bubble">${m.content}</div>
    </div>
  `).join("");

  stream.scrollTop = stream.scrollHeight;
  refreshIcons();
}

function createNewChatSession() {
  const newId = `s_${Date.now()}`;
  AppState.chatSessions.unshift({
    id: newId,
    title: "Nueva conversación",
    messages: [
      { role: "assistant", content: "¡Hola! Soy AccedeBot. ¿En qué materia o tema te gustaría que te oriente hoy?" }
    ]
  });
  AppState.activeChatSessionId = newId;
  renderChat();
}

function switchChatSession(sessionId) {
  AppState.activeChatSessionId = sessionId;
  renderChat();
}

async function sendChatMessage() {
  const input = document.getElementById("chat-user-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  const currentSession = AppState.chatSessions.find(s => s.id === AppState.activeChatSessionId);
  if (!currentSession) return;

  currentSession.messages.push({ role: "user", content: text });
  if (currentSession.title === "Nueva conversación") {
    currentSession.title = text.length > 25 ? text.substring(0, 25) + "..." : text;
  }
  renderChat();

  // Thinking animation
  const statusEl = document.getElementById("chat-status-text");
  const indicator = document.getElementById("chat-mascot-indicator");
  if (statusEl) statusEl.textContent = "AccedeBot está pensando...";
  if (indicator) indicator.classList.add("mascot-thinking");

  try {
    const reply = await queryOpenRouterAI(text, currentSession.messages);
    currentSession.messages.push({ role: "assistant", content: reply });
  } catch (err) {
    const offlineReply = generateOfflineTutorReply(text);
    currentSession.messages.push({ role: "assistant", content: offlineReply });
  } finally {
    if (statusEl) statusEl.textContent = "En línea • Motor AccedeBot";
    if (indicator) indicator.classList.remove("mascot-thinking");
    renderChat();
  }
}

async function queryOpenRouterAI(userPrompt, conversationHistory) {
  const apiKey = AppState.customApiKey;
  if (!apiKey || apiKey.startsWith("sk-fake")) {
    throw new Error("No online API key");
  }

  const systemMessage = {
    role: "system",
    content: "Eres AccedeBot, un tutor educativo cálido, pedagógico y alentador para la plataforma AccedeED (alineada con el ODS 4: Educación de Calidad). Responde en español de forma concisa, clara, con ejemplos didácticos paso a paso."
  };

  const messagesPayload = [systemMessage, ...conversationHistory.slice(-6)];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://accedeed.edu",
      "X-Title": "AccedeED Web"
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: messagesPayload,
      temperature: 0.7,
      max_tokens: 600
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateOfflineTutorReply(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("derivada") || p.includes("calculo") || p.includes("integral")) {
    return "💡 **Explicación de Cálculo:** Para derivar una función como f(x) = xⁿ, bajas el exponente a multiplicar y le restas 1: n·xⁿ⁻¹. Si estás integrando, haces lo opuesto: xⁿ⁺¹ / (n+1) + C.";
  } else if (p.includes("newton") || p.includes("fuerza") || p.includes("fisica")) {
    return "💡 **Principio de Física:** Recuerda la Segunda Ley de Newton: F = m · a. La fuerza resultante es igual a la masa del cuerpo multiplicada por su aceleración adquirida.";
  } else if (p.includes("kahoot") || p.includes("examen") || p.includes("evaluacion")) {
    return "💡 ¡Puedes ir a la pestaña **Evaluación & Kahoot** en el menú lateral para poner a prueba tus conocimientos en un simulador de 3 a 5 preguntas estilo Kahoot con puntajes en tiempo real!";
  } else if (p.includes("ods") || p.includes("proposito")) {
    return "🌍 **Compromiso ODS 4:** AccedeED promueve una educación inclusiva, equitativa y de calidad para todos. ¡Cada ejercicio que resuelves contribuye a tu crecimiento académico sostenible!";
  } else {
    return `¡Entendido! Sobre "${prompt}": Como recomendación de estudio, divide este concepto en partes clave, toma notas breves en las Flashcards 3D y practica con un temporizador Pomodoro de 25 minutos para máxima retención. ¿Quieres profundizar en un ejemplo específico?`;
  }
}

// ============================================================================
// 6. VIEW: GOOGLE CLASSROOM HUB
// ============================================================================

function renderClassroom() {
  const grid = document.getElementById("courses-grid-cards");
  const detailView = document.getElementById("course-detail-view");
  const listContainer = document.getElementById("classroom-courses-container");

  if (detailView) detailView.style.display = "none";
  if (listContainer) listContainer.style.display = "block";
  if (!grid) return;

  grid.innerHTML = AppState.courses.map(c => `
    <div class="course-card" onclick="openCourseDetail('${c.id}')">
      <div class="course-card-banner" style="background: linear-gradient(135deg, ${c.colorGradient[0]} 0%, ${c.colorGradient[1]} 100%);">
        <div>
          <div class="course-banner-title">${c.name}</div>
          <div class="course-banner-section">${c.section}</div>
        </div>
      </div>
      <div class="course-card-body">
        <div>
          <div class="course-teacher-name">Docente: ${c.teacher}</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4;">${c.descriptionHeading}</p>
        </div>
        <div class="course-card-footer">
          <span>Ver aula virtual</span>
          <i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i>
        </div>
      </div>
    </div>
  `).join("");

  refreshIcons();
}

function openCourseDetail(courseId) {
  AppState.selectedCourseId = courseId;
  const course = AppState.courses.find(c => c.id === courseId);
  if (!course) return;

  const listContainer = document.getElementById("classroom-courses-container");
  const detailView = document.getElementById("course-detail-view");
  const inner = document.getElementById("course-detail-card-inner");

  if (listContainer) listContainer.style.display = "none";
  if (detailView) detailView.style.display = "block";

  inner.innerHTML = `
    <div class="course-detail-tabs">
      <button class="course-tab-btn active" onclick="switchCourseTab(this, 'novedades')">Novedades</button>
      <button class="course-tab-btn" onclick="switchCourseTab(this, 'trabajos')">Trabajos de Clase</button>
      <button class="course-tab-btn" onclick="switchCourseTab(this, 'info')">Información</button>
    </div>

    <!-- Tab Novedades -->
    <div id="course-tab-novedades" style="padding: 1.5rem;">
      <div style="background: linear-gradient(135deg, ${course.colorGradient[0]}, ${course.colorGradient[1]}); padding: 1.75rem; border-radius: var(--radius-lg); color: #fff; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.8rem; font-weight: 800;">${course.name}</h2>
        <p style="opacity: 0.9;">${course.section} • Docente: ${course.teacher}</p>
      </div>

      <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 1rem;">Avisos Recientes del Docente</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${course.announcements.map(a => `
          <div style="padding: 1.25rem; background: var(--bg-surface-variant); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">${a.title}</span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">${a.date}</span>
            </div>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5;">${a.description}</p>
            ${a.attachment ? `
              <div style="margin-top: 10px;">
                <button class="btn-pill-action" style="background: rgba(0,102,255,0.1); border: 1px solid rgba(0,102,255,0.25);" onclick="openMaterialViewer('${a.attachment.name}', '${a.attachment.type}', '${a.description}', '${a.attachment.url}')">
                  <i data-lucide="file-text"></i>
                  <span>${a.attachment.name} (${a.attachment.type})</span>
                </button>
              </div>
            ` : ''}
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Tab Trabajos -->
    <div id="course-tab-trabajos" style="display: none; padding: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="font-weight: 800; font-size: 1.1rem;">Asignaciones y Entregas</h3>
      </div>
      <div>
        ${course.classwork.map(cw => `
          <div class="classwork-item-card">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: var(--radius-sm); background: ${cw.isSubmitted ? 'rgba(34,197,94,0.15)' : 'rgba(235,59,46,0.15)'}; color: ${cw.isSubmitted ? 'var(--color-success)' : 'var(--color-secondary)'};">
                  ${cw.isSubmitted ? 'ENTREGADA' : 'PENDIENTE'}
                </span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Vence: ${cw.dueDate}</span>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; margin: 4px 0;">${cw.title}</h4>
              <p style="font-size: 0.88rem; color: var(--text-secondary);">${cw.description}</p>
            </div>
            <div>
              <button class="btn-${cw.isSubmitted ? 'outline' : 'primary'}" onclick="toggleAssignmentSubmit('${course.id}', '${cw.id}')">
                ${cw.isSubmitted ? 'Anular Entrega' : 'Entregar Tarea'}
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Tab Info -->
    <div id="course-tab-info" style="display: none; padding: 1.5rem;">
      <div style="padding: 1.5rem; background: var(--bg-surface-variant); border-radius: var(--radius-md);">
        <h3 style="font-weight: 800; margin-bottom: 1rem;">Detalles de la Materia</h3>
        <p><strong>Profesor Titular:</strong> ${course.teacher}</p>
        <p style="margin-top: 6px;"><strong>Sección:</strong> ${course.section}</p>
        <p style="margin-top: 6px;"><strong>Código de Clase:</strong> <code style="background: var(--bg-surface); padding: 2px 6px; border-radius: 4px;">acd-2026-xyz</code></p>
      </div>
    </div>
  `;

  refreshIcons();
}

function switchCourseTab(btn, tabName) {
  document.querySelectorAll(".course-detail-tabs .course-tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  document.getElementById("course-tab-novedades").style.display = tabName === "novedades" ? "block" : "none";
  document.getElementById("course-tab-trabajos").style.display = tabName === "trabajos" ? "block" : "none";
  document.getElementById("course-tab-info").style.display = tabName === "info" ? "block" : "none";
}

function closeCourseDetail() {
  document.getElementById("course-detail-view").style.display = "none";
  document.getElementById("classroom-courses-container").style.display = "block";
}

function toggleAssignmentSubmit(courseId, cwId) {
  const course = AppState.courses.find(c => c.id === courseId);
  if (!course) return;
  const item = course.classwork.find(w => w.id === cwId);
  if (!item) return;

  item.isSubmitted = !item.isSubmitted;
  saveState();
  openCourseDetail(courseId);
}

function syncClassroomSimulator() {
  alert("Sincronizando materias y materiales con Google Classroom...");
  renderClassroom();
}

// ============================================================================
// 7. VIEW: EVALUACIÓN (KAHOOT STYLE)
// ============================================================================

function resetQuizToConfig() {
  document.getElementById("quiz-config-view").style.display = "block";
  document.getElementById("quiz-playing-view").style.display = "none";
  document.getElementById("quiz-results-view").style.display = "none";
}

function startQuizEngine() {
  const subj = document.getElementById("quiz-subject-select").value;
  const count = parseInt(document.querySelector("input[name='quiz-count']:checked").value);

  const presetList = PRESET_QUIZ_QUESTIONS[subj] || PRESET_QUIZ_QUESTIONS["Matemáticas"];
  AppState.activeQuiz.questions = presetList.slice(0, count);
  AppState.activeQuiz.currentIndex = 0;
  AppState.activeQuiz.score = 0;
  AppState.activeQuiz.answers = [];

  document.getElementById("quiz-config-view").style.display = "none";
  document.getElementById("quiz-playing-view").style.display = "block";
  document.getElementById("quiz-results-view").style.display = "none";

  renderCurrentQuizQuestion();
}

function renderCurrentQuizQuestion() {
  const quiz = AppState.activeQuiz;
  const q = quiz.questions[quiz.currentIndex];
  if (!q) {
    finishQuiz();
    return;
  }

  document.getElementById("quiz-progress-text").textContent = `Pregunta ${quiz.currentIndex + 1} de ${quiz.questions.length}`;
  document.getElementById("quiz-points-text").textContent = `⭐ ${quiz.score * 40} Pts`;

  document.getElementById("kahoot-question-prompt").textContent = q.prompt;

  for (let i = 0; i < 4; i++) {
    const optEl = document.getElementById(`quiz-opt-${i}`);
    if (optEl) optEl.textContent = q.options[i] || "";
  }

  // Hide instant feedback box
  const feedbackBox = document.getElementById("quiz-instant-feedback");
  if (feedbackBox) feedbackBox.style.display = "none";

  quiz.selectedOption = -1;
}

function selectQuizOption(optIdx) {
  const quiz = AppState.activeQuiz;
  if (quiz.selectedOption !== -1) return; // already chosen

  quiz.selectedOption = optIdx;
  const q = quiz.questions[quiz.currentIndex];
  const isCorrect = (optIdx === q.correctIndex);

  if (isCorrect) quiz.score++;

  const feedbackBox = document.getElementById("quiz-instant-feedback");
  const titleEl = document.getElementById("feedback-title");
  const detailEl = document.getElementById("feedback-detail");

  if (feedbackBox && titleEl && detailEl) {
    feedbackBox.style.display = "block";
    if (isCorrect) {
      feedbackBox.style.backgroundColor = "rgba(34, 197, 94, 0.2)";
      feedbackBox.style.border = "1px solid var(--color-success)";
      titleEl.textContent = "🎉 ¡Respuesta Correcta!";
      titleEl.style.color = "var(--color-success)";
      detailEl.textContent = q.hint || "¡Excelente deducción lógica!";
    } else {
      feedbackBox.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
      feedbackBox.style.border = "1px solid var(--color-error)";
      titleEl.textContent = "❌ Respuesta Incorrecta";
      titleEl.style.color = "var(--color-error)";
      detailEl.textContent = `La respuesta correcta era: "${q.options[q.correctIndex]}". ${q.hint || ''}`;
    }
  }
}

function nextQuizQuestion() {
  AppState.activeQuiz.currentIndex++;
  if (AppState.activeQuiz.currentIndex < AppState.activeQuiz.questions.length) {
    renderCurrentQuizQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  document.getElementById("quiz-playing-view").style.display = "none";
  document.getElementById("quiz-results-view").style.display = "block";

  const total = AppState.activeQuiz.questions.length;
  const score = AppState.activeQuiz.score;
  const points = score * 40;

  AppState.stats.totalPoints += points;
  saveState();

  document.getElementById("quiz-score-banner").textContent = `Puntaje: ${score}/${total} Aciertos (+${points} Puntos acumulados)`;
  document.getElementById("quiz-feedback-pedagogical").textContent = 
    score === total 
      ? "¡Dominio impecable! Has respondido todas las preguntas correctamente demostrando gran comprensión del tema."
      : "Buen trabajo. Repasa las preguntas con error en tus Flashcards 3D para afianzar el conocimiento antes de tu próximo examen.";
}

// ============================================================================
// 8. VIEW: FLASHCARDS 3D
// ============================================================================

let activeFlashcardCategory = "Todos";

function renderFlashcards() {
  const pills = document.getElementById("flashcard-category-pills");
  const grid = document.getElementById("flashcards-grid-list");

  // Get categories
  const categories = ["Todos", ...new Set(AppState.flashcards.map(f => f.category))];

  if (pills) {
    pills.innerHTML = categories.map(cat => `
      <button class="btn-pill-action" style="${activeFlashcardCategory === cat ? 'background: var(--color-primary); color: #fff;' : 'background: var(--bg-surface-variant);'}" onclick="filterFlashcardsByCategory('${cat}')">
        ${cat}
      </button>
    `).join("");
  }

  if (grid) {
    const list = activeFlashcardCategory === "Todos" 
      ? AppState.flashcards 
      : AppState.flashcards.filter(f => f.category === activeFlashcardCategory);

    grid.innerHTML = list.map(f => `
      <div class="flip-card-wrapper" onclick="this.classList.toggle('flipped')">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--color-primary);">${f.category}</span>
              <button class="btn-delete-goal" onclick="event.stopPropagation(); deleteFlashcard(${f.id})"><i data-lucide="trash-2" style="width: 16px; height: 16px;"></i></button>
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: auto 0;">
              ${f.question}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Toca para girar la tarjeta</div>
          </div>
          <div class="flip-card-back">
            <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; opacity: 0.8;">RESPUESTA</span>
            <div style="font-size: 1.15rem; font-weight: 800; margin: auto 0; line-height: 1.4;">
              ${f.answer}
            </div>
            <div style="font-size: 0.78rem; opacity: 0.8;">Toca para volver a la pregunta</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  refreshIcons();
}

function filterFlashcardsByCategory(cat) {
  activeFlashcardCategory = cat;
  renderFlashcards();
}

function deleteFlashcard(id) {
  AppState.flashcards = AppState.flashcards.filter(f => f.id !== id);
  saveState();
  renderFlashcards();
}

function openAddFlashcardModal() {
  openModal("modal-add-flashcard");
}

function saveNewFlashcard() {
  const q = document.getElementById("fc-input-question").value.trim();
  const a = document.getElementById("fc-input-answer").value.trim();
  const c = document.getElementById("fc-input-category").value.trim() || "General";

  if (!q || !a) {
    alert("Por favor escribe la pregunta y la respuesta.");
    return;
  }

  AppState.flashcards.unshift({
    id: Date.now(),
    question: q,
    answer: a,
    category: c
  });

  saveState();
  closeModal("modal-add-flashcard");
  renderFlashcards();
}

// ============================================================================
// 9. VIEW: PROGRESO (CAMINO DE NIVELES ODS 4)
// ============================================================================

function renderProgreso() {
  const chips = document.getElementById("progreso-subject-chips");
  const nodesContainer = document.getElementById("levels-path-nodes");

  const subjs = ["Matemáticas", "Física", "Programación", "Química", "Historia"];

  if (chips) {
    chips.innerHTML = subjs.map(s => `
      <button class="btn-pill-action" style="${AppState.activeSubjectLevel === s ? 'background: var(--color-primary); color: #fff;' : 'background: var(--bg-surface-variant);'}" onclick="selectProgresoSubject('${s}')">
        ${s}
      </button>
    `).join("");
  }

  if (nodesContainer) {
    const totalLevels = 10;
    const currentCompleted = 3; // level 1..3 completed, 4 active

    let html = "";
    for (let l = 1; l <= totalLevels; l++) {
      const isCompleted = l <= currentCompleted;
      const isActive = l === currentCompleted + 1;
      const isLocked = l > currentCompleted + 1;

      // Zigzag offset for Duolingo style
      const offsets = ["-40px", "0px", "40px", "0px"];
      const xOffset = offsets[(l - 1) % 4];

      html += `
        <div class="level-node-item" style="transform: translateX(${xOffset});" onclick="handleLevelClick(${l}, ${isCompleted}, ${isActive})">
          <div class="level-circle-btn ${isCompleted ? 'completed' : (isActive ? 'active' : 'locked')}">
            ${isCompleted ? '<i data-lucide="check" style="width: 32px; height: 32px;"></i>' : (isActive ? '<i data-lucide="play" style="width: 32px; height: 32px;"></i>' : '<i data-lucide="lock" style="width: 24px; height: 24px;"></i>')}
          </div>
          <div class="level-pill-label">Nivel ${l} ${isCompleted ? '✓' : (isActive ? '(¡Hoy!)' : '🔒')}</div>
        </div>
      `;
    }

    nodesContainer.innerHTML = html;
  }

  refreshIcons();
}

function selectProgresoSubject(s) {
  AppState.activeSubjectLevel = s;
  renderProgreso();
}

function handleLevelClick(levelNum, isCompleted, isActive) {
  if (isCompleted) {
    alert(`Nivel ${levelNum} de ${AppState.activeSubjectLevel} ya completado.`);
  } else if (isActive) {
    if (confirm(`¿Deseas iniciar la actividad del Nivel ${levelNum} de ${AppState.activeSubjectLevel} para mantener tu racha activa?`)) {
      AppState.stats.streak++;
      AppState.stats.totalPoints += 50;
      saveState();
      alert(`🎉 ¡Nivel ${levelNum} superado! Tu racha aumentó a ${AppState.stats.streak} días consecutivos (+50 Pts).`);
      renderProgreso();
      renderDashboard();
    }
  } else {
    alert(`Nivel ${levelNum} bloqueado. Completa primero el nivel previo.`);
  }
}

// ============================================================================
// 10. VIEW: FORMULARIOS & POMODORO
// ============================================================================

function renderFormularios() {
  filterFormulasList("");
  renderStudyWebsites();
}

function switchFormulariosSubtab(tabIdx) {
  document.querySelectorAll(".course-detail-tabs button").forEach((b, idx) => {
    b.classList.toggle("active", idx === tabIdx);
  });

  document.getElementById("subtab-formulas").style.display = tabIdx === 0 ? "block" : "none";
  document.getElementById("subtab-websites").style.display = tabIdx === 1 ? "block" : "none";
  document.getElementById("subtab-pomodoro").style.display = tabIdx === 2 ? "block" : "none";
}

function filterFormulasList(query) {
  const container = document.getElementById("formulas-grid-list");
  if (!container) return;

  const q = query.toLowerCase();
  const list = q ? AppState.formulas.filter(f => f.title.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q) || f.subject.toLowerCase().includes(q)) : AppState.formulas;

  container.innerHTML = list.map(f => `
    <div class="content-box-card" style="cursor: pointer;" onclick="openFormulaModal('${f.title}', '${f.subject}', '${f.formula}', '${f.explanation}')">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 800; font-size: 1.05rem; color: var(--color-primary);">${f.title}</span>
        <span style="font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-sm); background: var(--color-primary-container); color: var(--color-primary);">${f.subject}</span>
      </div>
      <div style="padding: 10px; background: var(--bg-surface); border-radius: var(--radius-sm); font-weight: 800; font-size: 1.1rem; color: var(--text-primary); margin-bottom: 8px;">
        ${f.formula}
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary);">${f.note}</p>
    </div>
  `).join("");
}

function renderStudyWebsites() {
  const container = document.getElementById("websites-grid-list");
  if (!container) return;

  container.innerHTML = STUDY_WEBSITES.map(w => `
    <div class="content-box-card" style="cursor: pointer;" onclick="window.open('${w.url}', '_blank')">
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 10px;">
        <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: ${w.color}22; color: ${w.color}; display: flex; align-items: center; justify-content: center;">
          <i data-lucide="${w.icon}"></i>
        </div>
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 800;">${w.name}</h4>
          <span style="font-size: 0.78rem; font-weight: 700; color: ${w.color};">${w.category}</span>
        </div>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4;">${w.desc}</p>
      <div style="margin-top: 10px; font-size: 0.82rem; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 4px;">
        <span>Abrir plataforma</span>
        <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
      </div>
    </div>
  `).join("");

  refreshIcons();
}

function openAddFormulaModal() {
  openModal("modal-add-formula");
}

function saveNewFormula() {
  const title = document.getElementById("form-input-title").value.trim();
  const subj = document.getElementById("form-input-subject").value;
  const expr = document.getElementById("form-input-expression").value.trim();
  const exp = document.getElementById("form-input-explanation").value.trim();

  if (!title || !expr) {
    alert("Por favor completa los campos principales.");
    return;
  }

  AppState.formulas.unshift({
    id: Date.now(),
    title,
    subject: subj,
    formula: expr,
    note: "Fórmula personalizada agregada",
    explanation: exp || "Fórmula ingresada por el estudiante."
  });

  saveState();
  closeModal("modal-add-formula");
  renderFormularios();
}

// Pomodoro Timer Engine
function togglePomodoro() {
  const p = AppState.pomodoro;
  p.isRunning = !p.isRunning;

  const btnText = document.getElementById("pomodoro-btn-text");
  const playIcon = document.getElementById("pomodoro-play-icon");

  if (p.isRunning) {
    if (btnText) btnText.textContent = "Pausar Pomodoro";
    if (playIcon) playIcon.setAttribute("data-lucide", "pause");
    p.timerId = setInterval(() => {
      if (p.timeLeftSeconds > 0) {
        p.timeLeftSeconds--;
        updatePomodoroDisplay();
      } else {
        clearInterval(p.timerId);
        p.isRunning = false;
        alert("🎉 ¡Sesión Pomodoro completada! Tómate 5 minutos de descanso.");
        resetPomodoro();
      }
    }, 1000);
  } else {
    clearInterval(p.timerId);
    if (btnText) btnText.textContent = "Continuar";
    if (playIcon) playIcon.setAttribute("data-lucide", "play");
  }

  refreshIcons();
}

function resetPomodoro() {
  clearInterval(AppState.pomodoro.timerId);
  AppState.pomodoro.isRunning = false;
  AppState.pomodoro.timeLeftSeconds = 25 * 60;
  updatePomodoroDisplay();

  const btnText = document.getElementById("pomodoro-btn-text");
  if (btnText) btnText.textContent = "Iniciar Pomodoro";
  refreshIcons();
}

function updatePomodoroDisplay() {
  const total = AppState.pomodoro.timeLeftSeconds;
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const el = document.getElementById("pomodoro-digits");
  if (el) el.textContent = formatted;
}

// ============================================================================
// 11. VIEW: RECURSOS EDUCATIVOS
// ============================================================================

let activeRecursoFilter = "Todos";

function renderRecursos() {
  const pills = document.getElementById("recursos-filter-pills");
  const grid = document.getElementById("recursos-grid-list");

  const categories = ["Todos", "PDFs", "Presentaciones", "Imágenes", "Matemáticas", "Ciencias", "Historia"];

  if (pills) {
    pills.innerHTML = categories.map(c => `
      <button class="btn-pill-action" style="${activeRecursoFilter === c ? 'background: var(--color-primary); color: #fff;' : 'background: var(--bg-surface-variant);'}" onclick="filterRecursosCategory('${c}')">
        ${c}
      </button>
    `).join("");
  }

  if (grid) {
    const list = activeRecursoFilter === "Todos"
      ? EDUCATIONAL_RESOURCES
      : EDUCATIONAL_RESOURCES.filter(r => r.fileType === activeRecursoFilter || r.category === activeRecursoFilter || (activeRecursoFilter === "PDFs" && r.fileType === "PDF") || (activeRecursoFilter === "Presentaciones" && r.fileType === "PRESENTATION") || (activeRecursoFilter === "Imágenes" && r.fileType === "IMAGE"));

    grid.innerHTML = list.map(r => `
      <div class="content-box-card" style="cursor: pointer;" onclick="openMaterialViewer('${r.title}', '${r.fileType}', '${r.description}', '${r.url}')">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 0.75rem; font-weight: 800; color: ${r.color};">${r.fileType}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${r.category}</span>
        </div>
        <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 6px;">${r.title}</h4>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4;">${r.description}</p>
        <div style="margin-top: 12px; font-size: 0.82rem; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 4px;">
          <span>Abrir material en visor</span>
          <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
        </div>
      </div>
    `).join("");
  }

  refreshIcons();
}

function filterRecursosCategory(cat) {
  activeRecursoFilter = cat;
  renderRecursos();
}

function openMaterialViewer(title, type, desc, url) {
  document.getElementById("viewer-material-title").textContent = title;
  document.getElementById("viewer-material-type").textContent = `FORMATO: ${type}`;
  document.getElementById("viewer-material-desc").textContent = desc;
  document.getElementById("viewer-open-external-btn").href = url;
  openModal("modal-material-viewer");
}

// ============================================================================
// 12. VIEW: CALENDARIO ESCOLAR
// ============================================================================

function renderCalendario() {
  const grid = document.getElementById("calendar-days-grid");
  const eventsList = document.getElementById("calendar-events-list");

  // Simple current month grid
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  let html = days.map(d => `<div style="font-weight: 800; font-size: 0.8rem; color: var(--text-muted); padding: 6px;">${d}</div>`).join("");

  // Days 1..31 for October
  for (let d = 1; d <= 31; d++) {
    const hasEvent = AppState.calendarEvents.some(e => e.date.endsWith(String(d).padStart(2, '0')));
    html += `
      <div style="padding: 10px; border-radius: var(--radius-sm); background: ${d === 16 ? 'var(--color-primary-container)' : 'var(--bg-surface)'}; border: 1px solid ${d === 16 ? 'var(--color-primary)' : 'var(--border-subtle)'}; cursor: pointer;">
        <div style="font-weight: 700; font-size: 0.9rem;">${d}</div>
        ${hasEvent ? '<div style="width: 6px; height: 6px; border-radius: 50%; background: #ff9800; margin: 4px auto 0 auto;"></div>' : ''}
      </div>
    `;
  }

  if (grid) grid.innerHTML = html;

  if (eventsList) {
    eventsList.innerHTML = AppState.calendarEvents.map(e => `
      <div style="padding: 12px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="font-weight: 800; font-size: 0.95rem;">${e.title}</h4>
          <span style="font-size: 0.78rem; font-weight: 700; color: #ff9800;">${e.date}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">${e.desc}</p>
      </div>
    `).join("");
  }
}

function changeMonth(delta) {
  AppState.calendarMonthOffset += delta;
  renderCalendario();
}

function openAddEventModal() {
  openModal("modal-add-event");
}

function saveCalendarEvent() {
  const title = document.getElementById("cal-input-title").value.trim();
  const desc = document.getElementById("cal-input-desc").value.trim();
  const date = document.getElementById("cal-input-date").value;

  if (!title || !date) {
    alert("Por favor ingresa título y fecha.");
    return;
  }

  AppState.calendarEvents.push({ id: Date.now(), title, desc, date });
  saveState();
  closeModal("modal-add-event");
  renderCalendario();
}

// ============================================================================
// 13. VIEW: BUSCA (GLOBAL UNIFIED SEARCH)
// ============================================================================

function handleGlobalHeaderSearch(query) {
  if (AppState.currentView !== "busca") {
    navigateTo("busca");
  }
  const mainInput = document.getElementById("busca-main-input");
  if (mainInput) mainInput.value = query;
  executeSearch(query);
}

function executeSearch(query) {
  const output = document.getElementById("search-results-output");
  if (!output) return;

  const q = query.trim().toLowerCase();
  if (!q) {
    output.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem;">Escribe una palabra clave arriba para buscar en fórmulas, materias, calendario y flashcards.</div>`;
    return;
  }

  const matchedFormulas = AppState.formulas.filter(f => f.title.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q));
  const matchedFlashcards = AppState.flashcards.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  const matchedEvents = AppState.calendarEvents.filter(e => e.title.toLowerCase().includes(q));
  const matchedCourses = AppState.courses.filter(c => c.name.toLowerCase().includes(q));

  let html = "";

  if (matchedFormulas.length > 0) {
    html += `<h3 style="font-weight: 800; margin: 1.5rem 0 0.75rem 0; color: var(--color-primary);">📐 Fórmulas Encontradas (${matchedFormulas.length})</h3>`;
    matchedFormulas.forEach(f => {
      html += `
        <div class="content-box-card" style="margin-bottom: 8px;">
          <div style="font-weight: 800; font-size: 1rem;">${f.title} <span style="font-size: 0.78rem; opacity: 0.7;">(${f.subject})</span></div>
          <div style="font-family: monospace; font-size: 1.05rem; color: var(--color-primary); margin: 4px 0;">${f.formula}</div>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">${f.explanation}</p>
        </div>
      `;
    });
  }

  if (matchedFlashcards.length > 0) {
    html += `<h3 style="font-weight: 800; margin: 1.5rem 0 0.75rem 0; color: var(--color-primary);">🗂️ Flashcards Encontradas (${matchedFlashcards.length})</h3>`;
    matchedFlashcards.forEach(f => {
      html += `
        <div class="content-box-card" style="margin-bottom: 8px;">
          <div style="font-weight: 800; font-size: 0.95rem;">${f.question}</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;"><strong>R:</strong> ${f.answer}</p>
        </div>
      `;
    });
  }

  if (matchedEvents.length > 0) {
    html += `<h3 style="font-weight: 800; margin: 1.5rem 0 0.75rem 0; color: #ff9800;">📅 Eventos y Exámenes (${matchedEvents.length})</h3>`;
    matchedEvents.forEach(e => {
      html += `
        <div class="content-box-card" style="margin-bottom: 8px;">
          <div style="font-weight: 800;">${e.title} • <span style="color: #ff9800;">${e.date}</span></div>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">${e.desc}</p>
        </div>
      `;
    });
  }

  if (!html) {
    html = `<div style="text-align: center; color: var(--text-muted); padding: 3rem;">No se encontraron resultados para "${query}". Intenta con otro término.</div>`;
  }

  output.innerHTML = html;
}

// ============================================================================
// 14. VIEW: NOTIFICACIONES
// ============================================================================

function renderNotificaciones() {
  const container = document.getElementById("notifications-list-container");
  if (!container) return;

  container.innerHTML = AppState.notifications.map(n => `
    <div class="content-box-card" style="cursor: pointer;" onclick="navigateTo('${n.targetView}')">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 800; font-size: 1.05rem;">${n.title}</span>
        <span style="font-size: 0.78rem; color: var(--text-muted);">${n.time}</span>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${n.desc}</p>
    </div>
  `).join("");
}

function triggerStreakProtection() {
  alert("🔥 Notificación enviada: ¡Tu racha de estudio se encuentra protegida para el día de hoy!");
}

function triggerPendingReminders() {
  alert("📝 Notificación enviada: Recordatorio de tareas pendientes de Google Classroom generado.");
}

// ============================================================================
// 15. VIEW: PERFIL
// ============================================================================

function renderPerfil() {
  const user = AppState.user;
  document.getElementById("profile-name-text").textContent = user.name || "Estudiante AccedeED";
  document.getElementById("profile-email-text").textContent = user.email || "estudiante@accedeed.edu";
  document.getElementById("profile-level-badge").textContent = user.academicLevel || "Preparatoria";
  document.getElementById("profile-limit-badge").textContent = `${user.dailyTimeLimitMinutes || 30} minutos`;
}

function simulateGoogleSignIn() {
  const btn = document.getElementById("google-btn-text");
  if (btn) btn.textContent = "Sincronizado con Google Classroom (Activo)";
  alert("Cuenta escolar de Google conectada exitosamente.");
}

// ============================================================================
// 16. VIEW: AJUSTES
// ============================================================================

function renderAjustes() {
  const input = document.getElementById("settings-api-key-input");
  if (input) input.value = AppState.customApiKey || "";

  const sel = document.getElementById("settings-daily-limit-select");
  if (sel) sel.value = String(AppState.user.dailyTimeLimitMinutes || 30);
}

function saveCustomApiKey(key) {
  AppState.customApiKey = key.trim();
  localStorage.setItem("accedeed_openrouter_key", AppState.customApiKey);
  alert("Clave API de OpenRouter guardada.");
}

function saveDailyLimit(val) {
  AppState.user.dailyTimeLimitMinutes = parseInt(val);
  saveState();
  renderPerfil();
}

function resetAllAppData() {
  if (confirm("¿Estás seguro de que deseas restablecer todos los datos? Esto reiniciará tu progreso y configuración.")) {
    localStorage.clear();
    location.reload();
  }
}

// ============================================================================
// 17. MODAL UTILITIES
// ============================================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function toggleQuickBotModal() {
  openModal("modal-quick-bot");
}

function closeQuickBotModal() {
  closeModal("modal-quick-bot");
}

async function sendQuickBotQuery() {
  const textarea = document.getElementById("quick-bot-prompt");
  const responseBox = document.getElementById("quick-bot-response");
  if (!textarea || !responseBox) return;

  const q = textarea.value.trim();
  if (!q) return;

  responseBox.style.display = "block";
  responseBox.textContent = "AccedeBot está pensando...";

  try {
    const reply = await queryOpenRouterAI(q, [{ role: "user", content: q }]);
    responseBox.textContent = reply;
  } catch (e) {
    responseBox.textContent = generateOfflineTutorReply(q);
  }
}

function openAddGoalModal() {
  openModal("modal-add-goal");
}

function saveNewGoal() {
  const title = document.getElementById("goal-input-title").value.trim();
  if (!title) return;

  AppState.dailyGoals.unshift({ id: Date.now(), title, isCompleted: false });
  saveState();
  closeModal("modal-add-goal");
  renderGoalsList();
}

function openEditSubjectsModal() {
  renderEditableSubjects();
  openModal("modal-edit-subjects");
}

function renderEditableSubjects() {
  const container = document.getElementById("editable-subjects-list");
  if (!container) return;

  container.innerHTML = AppState.subjects.map((s, idx) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-surface-variant); border-radius: var(--radius-sm);">
      <span style="font-weight: 700;">${s.name}</span>
      <button class="btn-delete-goal" onclick="removeSubjectByIndex(${idx})"><i data-lucide="x" style="width: 16px; height: 16px;"></i></button>
    </div>
  `).join("");

  refreshIcons();
}

function addCustomSubjectItem() {
  const input = document.getElementById("new-subj-input");
  const val = input.value.trim();
  if (!val) return;

  AppState.subjects.push({ name: val, progress: 50, color: "#0066ff", icon: "book" });
  input.value = "";
  saveState();
  renderEditableSubjects();
  renderSubjectsList();
}

function removeSubjectByIndex(idx) {
  AppState.subjects.splice(idx, 1);
  saveState();
  renderEditableSubjects();
  renderSubjectsList();
}

// ============================================================================
// 18. ONBOARDING & SCREEN TIME MONITOR (ODS 4)
// ============================================================================

let onboardingStep = 1;

function openOnboardingWizard() {
  onboardingStep = 1;
  renderOnboardingStep();
  openModal("modal-onboarding");
}

function renderOnboardingStep() {
  const content = document.getElementById("onboarding-step-content");
  const bar = document.getElementById("onboarding-progress-bar");
  const prevBtn = document.getElementById("onboarding-prev-btn");
  const nextBtn = document.getElementById("onboarding-next-btn");

  if (bar) bar.style.width = `${onboardingStep * 20}%`;
  if (prevBtn) prevBtn.style.display = onboardingStep > 1 ? "inline-flex" : "none";
  if (nextBtn) nextBtn.textContent = onboardingStep === 5 ? "¡Finalizar y Empezar!" : "Siguiente";

  if (!content) return;

  switch (onboardingStep) {
    case 1:
      content.innerHTML = `
        <h3 style="font-weight: 800; font-size: 1.25rem; margin-bottom: 0.5rem;">Paso 1: ¿Cómo te llamas?</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Para que AccedeBot se dirija a ti de manera personalizada:</p>
        <div class="form-group">
          <label class="form-label">Nombre Completo</label>
          <input type="text" class="form-input" id="ob-input-name" value="${AppState.user.name}">
        </div>
        <div class="form-group">
          <label class="form-label">¿Cómo te gusta que te llamen? (Apodo)</label>
          <input type="text" class="form-input" id="ob-input-pref" value="${AppState.user.preferredName}">
        </div>
      `;
      break;
    case 2:
      content.innerHTML = `
        <h3 style="font-weight: 800; font-size: 1.25rem; margin-bottom: 0.5rem;">Paso 2: Nivel Académico</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Selecciona tu grado para calibrar la dificultad de los temas:</p>
        <select class="form-select" id="ob-input-level">
          <option value="Primaria" ${AppState.user.academicLevel === 'Primaria' ? 'selected' : ''}>Primaria</option>
          <option value="Secundaria" ${AppState.user.academicLevel === 'Secundaria' ? 'selected' : ''}>Secundaria</option>
          <option value="Preparatoria" ${AppState.user.academicLevel === 'Preparatoria' ? 'selected' : ''}>Preparatoria / Bachillerato</option>
          <option value="Universidad" ${AppState.user.academicLevel === 'Universidad' ? 'selected' : ''}>Universidad</option>
        </select>
      `;
      break;
    case 3:
      content.innerHTML = `
        <h3 style="font-weight: 800; font-size: 1.25rem; margin-bottom: 0.5rem;">Paso 3: Tus Materias</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Tienes registradas actualmente ${AppState.subjects.length} materias activas para tu seguimiento diario.</p>
        <div style="padding: 1rem; background: var(--bg-surface-variant); border-radius: var(--radius-md);">
          ${AppState.subjects.map(s => `<span style="display: inline-block; margin: 4px; padding: 4px 10px; background: var(--bg-surface); border-radius: var(--radius-sm); font-weight: 700; font-size: 0.85rem;">${s.name}</span>`).join("")}
        </div>
      `;
      break;
    case 4:
      content.innerHTML = `
        <h3 style="font-weight: 800; font-size: 1.25rem; margin-bottom: 0.5rem;">Paso 4: Tu Propósito</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">¿Qué esperas lograr con AccedeED?</p>
        <select class="form-select" id="ob-input-purpose">
          <option>🚀 Tener un mejor rendimiento académico</option>
          <option>🧠 Fortalecer mis conocimientos y hábitos</option>
          <option>📝 Estudiar y repasar para exámenes</option>
        </select>
      `;
      break;
    case 5:
      content.innerHTML = `
        <h3 style="font-weight: 800; font-size: 1.25rem; margin-bottom: 0.5rem;">Paso 5: Límite de Uso ODS 4</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Define tu tiempo objetivo para cuidar tu salud visual y balance diario:</p>
        <select class="form-select" id="ob-input-limit">
          <option value="15">15 minutos al día</option>
          <option value="25">25 minutos (1 Pomodoro)</option>
          <option value="30" selected>30 minutos (Recomendado)</option>
          <option value="60">60 minutos (1 hora máximo)</option>
        </select>
      `;
      break;
  }
}

function onboardingStepNext() {
  if (onboardingStep === 1) {
    const n = document.getElementById("ob-input-name");
    const p = document.getElementById("ob-input-pref");
    if (n && n.value.trim()) AppState.user.name = n.value.trim();
    if (p && p.value.trim()) AppState.user.preferredName = p.value.trim();
  } else if (onboardingStep === 2) {
    const l = document.getElementById("ob-input-level");
    if (l) AppState.user.academicLevel = l.value;
  } else if (onboardingStep === 5) {
    const lim = document.getElementById("ob-input-limit");
    if (lim) AppState.user.dailyTimeLimitMinutes = parseInt(lim.value);

    AppState.user.isOnboardingDone = true;
    saveState();
    closeModal("modal-onboarding");
    renderDashboard();
    renderPerfil();
    return;
  }

  onboardingStep++;
  renderOnboardingStep();
}

function onboardingStepPrev() {
  if (onboardingStep > 1) {
    onboardingStep--;
    renderOnboardingStep();
  }
}

// Start daily screen time monitor (ODS 4 Alert)
function initScreenTimeMonitor() {
  setInterval(() => {
    AppState.stats.timeSpentTodayMinutes += 1;
    saveState();

    const limit = AppState.user.dailyTimeLimitMinutes || 30;
    if (AppState.stats.timeSpentTodayMinutes >= limit && AppState.stats.timeSpentTodayMinutes % limit === 0) {
      openModal("modal-time-limit");
    }
  }, 60000); // Check each minute
}

// ============================================================================
// 19. INITIALIZATION
// ============================================================================

window.addEventListener("DOMContentLoaded", () => {
  applyTheme(AppState.theme);
  navigateTo("inicio");
  initScreenTimeMonitor();
});
