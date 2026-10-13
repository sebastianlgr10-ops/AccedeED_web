/**
 * AccedeED - Web Edition Data Store
 * Basado fielmente en el modelo de datos de la aplicación Android
 */

const DEFAULT_CONFIG = {
    VERSION: "1.0.0",
    ODS_GOAL: "ODS 4: Educación de Calidad"
};

const INITIAL_FORMULAS = [
    {
        id: 1,
        title: "Fórmula Cuadrática",
        subject: "Matemáticas",
        formula: "x = (-b ± √(b² - 4ac)) / (2a)",
        note: "Aplica para ax² + bx + c = 0",
        explanation: "Resuelve ecuaciones de segundo grado. 'a' es el coeficiente cuadrático, 'b' el lineal y 'c' el término independiente. El discriminante (b² - 4ac) determina el número de soluciones reales."
    },
    {
        id: 2,
        title: "Derivada de xⁿ",
        subject: "Matemáticas",
        formula: "d/dx(xⁿ) = n · xⁿ⁻¹",
        note: "Regla de la potencia para derivación",
        explanation: "Regla fundamental del cálculo diferencial. Multiplica por el exponente actual y resta 1 al exponente de la variable."
    },
    {
        id: 3,
        title: "Teorema de Pitágoras",
        subject: "Matemáticas",
        formula: "a² + b² = c²",
        note: "Triángulos rectángulos",
        explanation: "En todo triángulo rectángulo, la suma de los cuadrados de los catetos (a y b) es igual al cuadrado de la hipotenusa (c)."
    },
    {
        id: 4,
        title: "Identidad Trigonométrica Fundamental",
        subject: "Matemáticas",
        formula: "sin²(x) + cos²(x) = 1",
        note: "Suma de cuadrados de seno y coseno",
        explanation: "Basada en el círculo unitario. Permite simplificar expresiones trigonométricas complejas."
    },
    {
        id: 5,
        title: "Integral de Exponencial",
        subject: "Matemáticas",
        formula: "∫ eˣ dx = eˣ + C",
        note: "Integral indefinida básica",
        explanation: "La función exponencial eˣ es su propia derivada e integral, sumando la constante arbitraria C de integración."
    },
    {
        id: 6,
        title: "Segunda Ley de Newton",
        subject: "Física",
        formula: "F = m · a",
        note: "Fuerza = Masa × Aceleración",
        explanation: "Establece que la aceleración de un objeto es directamente proporcional a la fuerza neta que actúa sobre él e inversamente proporcional a su masa."
    },
    {
        id: 7,
        title: "Energía Cinética",
        subject: "Física",
        formula: "Ec = ½ · m · v²",
        note: "Energía debido al movimiento",
        explanation: "Cuantifica la energía de un cuerpo de masa 'm' que se desplaza a velocidad 'v'. Crece de forma cuadrática con la velocidad."
    },
    {
        id: 8,
        title: "Ley de Ohm",
        subject: "Física",
        formula: "V = I · R",
        note: "Voltaje = Corriente × Resistencia",
        explanation: "Relaciona la diferencia de potencial (V), la intensidad de corriente eléctrica (I) y la resistencia (R) en un circuito lineal."
    },
    {
        id: 9,
        title: "Velocidad Media",
        subject: "Física",
        formula: "v = Δx / Δt",
        note: "Desplazamiento sobre tiempo",
        explanation: "Proporción entre la distancia neta recorrida y el tiempo transcurrido en el trayecto."
    },
    {
        id: 10,
        title: "Energía de Einstein",
        subject: "Física",
        formula: "E = m · c²",
        note: "Equivalencia masa-energía",
        explanation: "Principio de la relatividad especial que demuestra que la masa puede convertirse en energía pura, multiplicada por la velocidad de la luz al cuadrado."
    },
    {
        id: 11,
        title: "Ecuación de Gases Ideales",
        subject: "Química",
        formula: "P · V = n · R · T",
        note: "Presión, Volumen, Moles y Temperatura",
        explanation: "Modela el comportamiento de gases ideales. P es presión en atm, V volumen en litros, n moles, R constante universal (0.0821) y T temperatura en Kelvin."
    },
    {
        id: 12,
        title: "Cálculo de Molaridad",
        subject: "Química",
        formula: "M = n / V",
        note: "Concentración molar",
        explanation: "Indica el número de moles de soluto disueltos por cada litro de solución total."
    },
    {
        id: 13,
        title: "pH de una Solución",
        subject: "Química",
        formula: "pH = -log₁₀[H⁺]",
        note: "Medida de acidez o alcalinidad",
        explanation: "Escala logarítmica que mide la concentración de iones de hidrógeno. Valores menores a 7 son ácidos y mayores a 7 son alcalinos."
    },
    {
        id: 14,
        title: "Densidad",
        subject: "Química",
        formula: "ρ = m / V",
        note: "Masa dividida entre volumen",
        explanation: "Propiedad intensiva de la materia que indica cuánta masa está contenida en una unidad de volumen determinado."
    },
    {
        id: 15,
        title: "Estructura StateFlow (Kotlin)",
        subject: "Programación",
        formula: "val state = _state.asStateFlow()",
        note: "Flujo de estado reactivo en Android",
        explanation: "Expone un estado de lectura segura en arquitectura MVVM/MVI impidiendo modificaciones directas desde la vista de UI."
    },
    {
        id: 16,
        title: "Complejidad Búsqueda Binaria",
        subject: "Programación",
        formula: "O(log n)",
        note: "Algoritmo de búsqueda ordenada",
        explanation: "Divide el espacio de búsqueda a la mitad en cada iteración. Requiere que la lista o arreglo esté previamente ordenado."
    },
    {
        id: 17,
        title: "Sintaxis Compose Modifier",
        subject: "Programación",
        formula: "Modifier.fillMaxWidth().padding(16.dp)",
        note: "Layouts declarativos en Compose",
        explanation: "Encadena modificadores para definir tamaño, padding, clics y estilos visuales en componentes de Jetpack Compose."
    },
    {
        id: 18,
        title: "Consulta SQL Select",
        subject: "Programación",
        formula: "SELECT * FROM tabla WHERE condicion = 1",
        note: "Consulta filtrada en Room o SQL",
        explanation: "Recupera registros de la base de datos que cumplan con la condición especificada."
    }
];

const INITIAL_FLASHCARDS = [
    {
        id: 1,
        question: "¿Cuál es la derivada de sin(x)?",
        answer: "cos(x)",
        category: "Matemáticas"
    },
    {
        id: 2,
        question: "¿Qué postula la primera ley de Newton?",
        answer: "La Ley de la Inercia: todo cuerpo permanece en reposo o movimiento rectilíneo uniforme a menos que actúe sobre él una fuerza neta.",
        category: "Física"
    },
    {
        id: 3,
        question: "¿Cuál es el orgánulo celular encargado de producir ATP?",
        answer: "La Mitocondria (respiración celular).",
        category: "Ciencias"
    },
    {
        id: 4,
        question: "¿En qué año inició la Revolución Mexicana?",
        answer: "El 20 de noviembre de 1910.",
        category: "Historia"
    },
    {
        id: 5,
        question: "¿Cuál es el significado del condicional 'if-else' en programación?",
        answer: "Estructura de control de flujo que evalúa una condición booleana para ejecutar un bloque de código si es verdadero, u otro si es falso.",
        category: "Programación"
    },
    {
        id: 6,
        question: "¿Qué es el Present Perfect en inglés?",
        answer: "Tiempo verbal que conecta una acción del pasado con el presente, formado por 'have/has + participio pasado'.",
        category: "Idiomas"
    }
];

const INITIAL_SUBJECTS = [
    { name: "Matemáticas", progress: 85, color: "#1E88E5", icon: "calculator" },
    { name: "Ciencias", progress: 70, color: "#039BE5", icon: "flask" },
    { name: "Física", progress: 65, color: "#FB8C00", icon: "zap" },
    { name: "Historia", progress: 90, color: "#8E24AA", icon: "landmark" },
    { name: "Programación", progress: 80, color: "#00ACC1", icon: "code" },
    { name: "Español", progress: 75, color: "#00897B", icon: "book-open" },
    { name: "Inglés", progress: 60, color: "#43A047", icon: "languages" }
];

const INITIAL_GOALS = [
    { id: 1, title: "Resolver 15 flashcards de Biología y Matemáticas", isCompleted: true },
    { id: 2, title: "Completar Nivel 4 de Física en el Camino Académico", isCompleted: false },
    { id: 3, title: "Entregar tarea de Cálculo en Google Classroom", isCompleted: true },
    { id: 4, title: "Sesión Pomodoro de 25 minutos con fórmulas clave", isCompleted: false },
    { id: 5, title: "Realizar evaluación simulador Kahoot con AccedeBot", isCompleted: false }
];

const INITIAL_RECENT_ACTIVITIES = [
    { id: 1, type: "Quiz", title: "Evaluación de Cálculo y Álgebra", time: "Hace 2 horas", score: "9/10 Puntos", color: "#1E88E5" },
    { id: 2, type: "Flashcard", title: "Repaso de Historia Universal", time: "Hace 5 horas", score: "12 tarjetas", color: "#8E24AA" },
    { id: 3, type: "Nivel", title: "Nivel 3 de Programación Completado", time: "Ayer", score: "Racha +1", color: "#00ACC1" },
    { id: 4, type: "Classroom", title: "Entrega de Tarea: Proyecto ODS 4", time: "Hace 2 días", score: "Entregado a tiempo", color: "#43A047" }
];

const EDUCATIONAL_RESOURCES = [
    {
        title: "Guía Completa de Álgebra y Cálculo",
        category: "Matemáticas",
        fileType: "PDF",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        description: "Compendio de ejercicios resueltos, identidades notables y límites fundamentales.",
        color: "#E53935"
    },
    {
        title: "Manual de Biología Celular y Genética",
        category: "Ciencias",
        fileType: "PDF",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        description: "Estructura celular, ciclo mitótico, leyes de Mendel y transcripción de ADN.",
        color: "#1E88E5"
    },
    {
        title: "Fórmulas y Leyes de Newton",
        category: "Ciencias",
        fileType: "PDF",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        description: "Mecánica clásica, cinemática unidimensional, trabajo y conservación de la energía.",
        color: "#039BE5"
    },
    {
        title: "Gramática Inglesa B2/C1",
        category: "Idiomas",
        fileType: "PDF",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        description: "Tiempos compuestos, condicionales mixtos, modales de deducción y phrasal verbs.",
        color: "#00ACC1"
    },
    {
        title: "Presentación: Ecuaciones Cuadráticas",
        category: "Matemáticas",
        fileType: "PRESENTATION",
        url: "https://docs.google.com/presentation",
        description: "Diapositivas visuales paso a paso para despejar por factorización y fórmula general.",
        color: "#E53935"
    },
    {
        title: "Presentación: Segunda Guerra Mundial",
        category: "Historia",
        fileType: "PRESENTATION",
        url: "https://docs.google.com/presentation",
        description: "Cronología de eventos clave (1939-1945), alianzas y consecuencias geopolíticas.",
        color: "#8E24AA"
    },
    {
        title: "Diapositivas: Programación Orientada a Objetos",
        category: "Programación",
        fileType: "PRESENTATION",
        url: "https://docs.google.com/presentation",
        description: "Clases, herencia, polimorfismo, encapsulamiento y patrones de diseño limpios.",
        color: "#43A047"
    },
    {
        title: "Infografía: Tabla Periódica de los Elementos",
        category: "Ciencias",
        fileType: "IMAGE",
        url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Tabla_de_derivadas.png",
        description: "Clasificación de metales, no metales, gases nobles y números atómicos.",
        color: "#43A047"
    },
    {
        title: "Esquema Ilustrado: La Célula Eucariota",
        category: "Ciencias",
        fileType: "IMAGE",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Diagram_of_a_human_cell.svg/1024px-Diagram_of_a_human_cell.svg.png",
        description: "Diagrama con organelos señalados: núcleo, ribosomas, retículo endoplásmico y aparato de Golgi.",
        color: "#1E88E5"
    },
    {
        title: "Mapa Geopolítico: Independencia de México",
        category: "Historia",
        fileType: "IMAGE",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Mexico_1821.png/800px-Mexico_1821.png",
        description: "Rutas de campañas insurgentes y demarcación territorial de 1821.",
        color: "#4DB6AC"
    },
    {
        title: "Laboratorio Virtual de Física PhET",
        category: "Ciencias",
        fileType: "LINK",
        url: "https://phet.colorado.edu/es/",
        description: "Simulador interactivo de ondas, circuitos eléctricos, óptica y gravedad.",
        color: "#039BE5"
    },
    {
        title: "Visualizador de Geometría GeoGebra",
        category: "Matemáticas",
        fileType: "LINK",
        url: "https://www.geogebra.org/",
        description: "Herramienta online para trazar funciones, cónicas, planos 3D y estadística.",
        color: "#E53935"
    }
];

const STUDY_WEBSITES = [
    { name: "Khan Academy", desc: "Cursos interactivos gratuitos de matemáticas, ciencias y programación.", category: "General", url: "https://es.khanacademy.org", color: "#14BF96", icon: "school" },
    { name: "Quizlet", desc: "Tarjetas de estudio, juegos interactivos y cuestionarios creados por estudiantes.", category: "Flashcards", url: "https://quizlet.com/es", color: "#4255FF", icon: "layers" },
    { name: "GeoGebra", desc: "Calculadora gráfica interactiva para geometría, álgebra y cálculo.", category: "Matemáticas", url: "https://www.geogebra.org", color: "#6666FF", icon: "calculator" },
    { name: "WolframAlpha", desc: "Motor de conocimiento computacional para resolver ecuaciones paso a paso.", category: "Cálculo & Ciencias", url: "https://www.wolframalpha.com", color: "#DD1100", icon: "cpu" },
    { name: "Google Scholar", desc: "Buscador de artículos científicos, tesis, libros y literatura académica.", category: "Investigación", url: "https://scholar.google.es", color: "#4285F4", icon: "book-open" },
    { name: "Coursera", desc: "Cursos universitarios en línea de las mejores instituciones del mundo.", category: "Cursos", url: "https://www.coursera.org", color: "#0056D2", icon: "monitor" },
    { name: "Duolingo", desc: "Aprende idiomas de forma interactiva y gamificada todos los días.", category: "Idiomas", url: "https://es.duolingo.com", color: "#58CC02", icon: "languages" },
    { name: "PhET Simulations", desc: "Simulaciones interactivas de física, química y biología de la Universidad de Colorado.", category: "Simulación", url: "https://phet.colorado.edu/es/", color: "#FF9800", icon: "flask" }
];

const INITIAL_COURSES = [
    {
        id: "c1",
        name: "Matemáticas V: Cálculo Diferencial",
        section: "Grupo 502 • Semestre 2026-B",
        descriptionHeading: "Estudio de funciones, límites, derivadas y sus aplicaciones prácticas en optimización.",
        teacher: "Prof. Alejandro Morales",
        colorGradient: ["#1E88E5", "#1565C0"],
        announcements: [
            {
                id: "a1",
                title: "Recordatorio: Examen Parcial el próximo Viernes",
                description: "Favor de repasar la guía en PDF adjunta sobre derivadas de funciones trigonométricas y regla de la cadena.",
                date: "Ayer 10:30 AM",
                attachment: { type: "PDF", name: "Guia_Derivadas_Parcial1.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            },
            {
                id: "a2",
                title: "Diapositivas de la clase: Criterio de la Primera Derivada",
                description: "Se han subido las diapositivas para identificar máximos, mínimos y puntos de inflexión.",
                date: "Hace 3 días",
                attachment: { type: "PRESENTATION", name: "Maximos_y_Minimos.pptx", url: "https://docs.google.com/presentation" }
            }
        ],
        classwork: [
            {
                id: "cw1",
                type: "CourseWork",
                title: "Serie de Ejercicios: Regla de la Cadena y Derivación Implícita",
                description: "Resolver los 10 ejercicios pares de la página 142 del libro de texto. Subir en formato PDF escaneado con procedimiento legible.",
                dueDate: "Este Viernes 23:59",
                points: 100,
                isSubmitted: false,
                submissionFile: null
            },
            {
                id: "cw2",
                type: "CourseWork",
                title: "Laboratorio Virtual GeoGebra: Límites al Infinito",
                description: "Generar la gráfica de asíntotas horizontales y verticales y adjuntar la captura con su conclusión.",
                dueDate: "Completada",
                points: 100,
                isSubmitted: true,
                submissionFile: "Entrega_Lab_Limites.pdf"
            },
            {
                id: "cw3",
                type: "Material",
                title: "Formulario Oficial de Derivadas e Integrales",
                description: "Documento oficial permitido durante las sesiones de evaluación y talleres.",
                fileType: "PDF",
                url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            }
        ]
    },
    {
        id: "c2",
        name: "Física II: Mecánica y Electricidad",
        section: "Grupo 502 • Sala de Laboratorio",
        descriptionHeading: "Cinemática, dinámica rotacional, leyes de conservación y principios de electrostática.",
        teacher: "Dra. Carmen Rodríguez",
        colorGradient: ["#FB8C00", "#EF6C00"],
        announcements: [
            {
                id: "a3",
                title: "Práctica de Laboratorio 3: Ley de Ohm",
                description: "Recuerden traer bata blanca y multímetro digital para el armado de circuitos serie y paralelo.",
                date: "Hace 4 días",
                attachment: { type: "IMAGE", name: "Esquema_Circuito_Ohm.png", url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Tabla_de_derivadas.png" }
            }
        ],
        classwork: [
            {
                id: "cw4",
                type: "CourseWork",
                title: "Reporte de Práctica: Ley de Ohm y Circuitos Eléctricos",
                description: "Incluir tabla de mediciones de voltaje, corriente, cálculo de resistencia experimental y porcentaje de error.",
                dueDate: "Próximo Lunes 18:00",
                points: 100,
                isSubmitted: false,
                submissionFile: null
            }
        ]
    },
    {
        id: "c3",
        name: "Desarrollo de Software y Algoritmos",
        section: "Aula de Cómputo 3 • Especialidad",
        descriptionHeading: "Programación orientada a objetos, estructuras de datos y desarrollo web y móvil.",
        teacher: "Ing. Roberto Peña",
        colorGradient: ["#00ACC1", "#00838F"],
        announcements: [
            {
                id: "a4",
                title: "Bienvenida al Módulo de StateFlow y Jetpack Compose",
                description: "Revisen la documentación oficial y descarguen el repositorio base en GitHub.",
                date: "Hace 1 semana",
                attachment: { type: "LINK", name: "Documentación Android Developers", url: "https://developer.android.com" }
            }
        ],
        classwork: [
            {
                id: "cw5",
                type: "CourseWork",
                title: "Proyecto Final: Aplicación Educativa ODS 4",
                description: "Desarrollar una aplicación funcional orientada al Objetivo de Desarrollo Sostenible 4 (Educación de Calidad) con persistencia local.",
                dueDate: "En 2 semanas",
                points: 100,
                isSubmitted: false,
                submissionFile: null
            }
        ]
    }
];

const INITIAL_CALENDAR_EVENTS = [
    { id: 1, title: "Examen Parcial de Cálculo Diferencial", desc: "Temas: Derivadas trigonométricas y regla de la cadena", date: "2026-10-16" },
    { id: 2, title: "Entrega de Tarea: Reporte de Física Ley de Ohm", desc: "Subir a Classroom antes de las 18:00", date: "2026-10-19" },
    { id: 3, title: "Entrega del Proyecto ODS 4 en Programación", desc: "Presentación en vivo del prototipo web y móvil", date: "2026-10-23" },
    { id: 4, title: "Simulador de Examen de Opción Múltiple", desc: "Sesión de 30 minutos con AccedeBot Tutor", date: "2026-10-14" }
];

const INITIAL_NOTIFICATIONS = [
    {
        id: "n1",
        title: "🔥 ¡Tu Racha de Estudio está en riesgo!",
        desc: "Aún no has completado tu nivel diario de hoy. Realiza una actividad para mantener tu racha activa.",
        time: "Hace 15 min",
        type: "streak",
        targetView: "progreso"
    },
    {
        id: "n2",
        title: "📝 Tarea de Cálculo Diferencial pendiente",
        desc: "La entrega de la Serie de Ejercicios vence este Viernes en Google Classroom.",
        time: "Hace 1 hora",
        type: "classroom",
        targetView: "clases"
    },
    {
        id: "n3",
        title: "📅 Examen Parcial agendado en el Calendario",
        desc: "Examen de Cálculo Diferencial programado para este Viernes 16 de Octubre.",
        time: "Hace 3 horas",
        type: "calendar",
        targetView: "calendario"
    },
    {
        id: "n4",
        title: "🤖 Consejo de AccedeBot Tutor",
        desc: "Repasa 5 flashcards de Biología antes de dormir para fortalecer la memoria a largo plazo.",
        time: "Ayer",
        type: "bot",
        targetView: "flashcards"
    }
];

// Generador de preguntas interactivas estilo Kahoot para Evaluación
const PRESET_QUIZ_QUESTIONS = {
    "Matemáticas": [
        {
            id: 1,
            prompt: "¿Cuál es la derivada de f(x) = 3x² + 5x - 7?",
            options: ["6x + 5", "3x + 5", "6x² + 5", "6x - 7"],
            correctIndex: 0,
            hint: "Aplica la regla de la potencia: d/dx(xⁿ) = n·xⁿ⁻¹ para cada término por separado."
        },
        {
            id: 2,
            prompt: "¿Cuál es el valor de x en la ecuación cuadrática x² - 9 = 0?",
            options: ["x = 3 únicamente", "x = ±3", "x = 9", "x = ±9"],
            correctIndex: 1,
            hint: "Recuerda que la raíz cuadrada de un número positivo tiene dos soluciones: positiva y negativa."
        },
        {
            id: 3,
            prompt: "¿A qué es igual la identidad sin²(θ) + cos²(θ)?",
            options: ["0", "tan(θ)", "1", "2sin(θ)"],
            correctIndex: 2,
            hint: "Es la identidad trigonométrica fundamental deducida directamente del círculo unitario."
        },
        {
            id: 4,
            prompt: "¿Cuál es la integral indefinida ∫ 2x dx?",
            options: ["x² + C", "2x² + C", "2 + C", "x + C"],
            correctIndex: 0,
            hint: "Suma 1 al exponente y divide entre el nuevo exponente: 2·(x²/2) = x²."
        },
        {
            id: 5,
            prompt: "¿Cuál es el valor del discriminante (b² - 4ac) si una ecuación tiene una sola raíz real repetida?",
            options: ["Mayor a 0", "Menor a 0", "Igual a 0", "Igual a 1"],
            correctIndex: 2,
            hint: "Cuando b² - 4ac = 0, la raíz es cero y ambas soluciones coinciden en -b / (2a)."
        }
    ],
    "Física": [
        {
            id: 1,
            prompt: "¿Qué unidad del Sistema Internacional mide la Fuerza?",
            options: ["Joule (J)", "Pascal (Pa)", "Newton (N)", "Watt (W)"],
            correctIndex: 2,
            hint: "Un Newton equivale a 1 kg·m/s², en honor a Sir Isaac Newton."
        },
        {
            id: 2,
            prompt: "Si un automóvil de 1000 kg viaja a 20 m/s, ¿cuál es su energía cinética?",
            options: ["200,000 Joules", "10,000 Joules", "400,000 Joules", "20,000 Joules"],
            correctIndex: 0,
            hint: "Usa la fórmula Ec = ½ · m · v² = 0.5 × 1000 × (20)² = 500 × 400."
        },
        {
            id: 3,
            prompt: "Según la Ley de Ohm, si aumentamos la resistencia manteniendo el voltaje constante, ¿qué ocurre con la corriente?",
            options: ["Aumenta proporcionalmente", "Disminuye", "Se mantiene igual", "Se duplica"],
            correctIndex: 1,
            hint: "I = V / R; al aumentar el divisor R, el cociente I se reduce."
        }
    ],
    "Programación": [
        {
            id: 1,
            prompt: "¿Cuál es la complejidad temporal de una búsqueda binaria en un arreglo ordenado?",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            correctIndex: 1,
            hint: "En cada iteración se descarta la mitad del arreglo."
        },
        {
            id: 2,
            prompt: "¿Cuál es el propósito del modificador StateFlow en Kotlin / Android Compose?",
            options: ["Ejecutar consultas SQL de red", "Manejar animaciones 3D", "Emitir estados inmutables y observables en UI", "Compilar código Java"],
            correctIndex: 2,
            hint: "StateFlow representa un estado reactivo que actualiza la UI automáticamente al cambiar."
        },
        {
            id: 3,
            prompt: "¿Qué principio de POO oculta los detalles internos de un objeto protegiendo su estado?",
            options: ["Polimorfismo", "Herencia", "Encapsulamiento", "Abstracción abierta"],
            correctIndex: 2,
            hint: "Se logra usando modificadores privados y métodos getter/setter o propiedades."
        }
    ],
    "Química": [
        {
            id: 1,
            prompt: "¿Cuál es el valor del pH de una solución neutra a 25 °C?",
            options: ["0", "7", "14", "1"],
            correctIndex: 1,
            hint: "El agua pura tiene una concentración de [H⁺] = 10⁻⁷ M."
        },
        {
            id: 2,
            prompt: "¿Cuál es el elemento químico más abundante en el universo?",
            options: ["Oxígeno", "Helio", "Hidrógeno", "Carbono"],
            correctIndex: 2,
            hint: "Es el elemento más simple, con símbolo H y número atómico 1."
        }
    ],
    "Historia": [
        {
            id: 1,
            prompt: "¿En qué año concluyó la Segunda Guerra Mundial?",
            options: ["1918", "1939", "1945", "1953"],
            correctIndex: 2,
            hint: "Finalizó en 1945 con la rendición formal del Eje."
        }
    ]
};
