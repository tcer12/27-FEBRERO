/** @format */

const personajes = {
  duarte: {
    nombre: "Juan Pablo Duarte",
    imagen: new URL("./src/assets/images/duarte.jpg", import.meta.url).href,
  },
  mella: {
    nombre: "Matías Ramón Mella",
    imagen: new URL("./src/assets/images/mella.jpg", import.meta.url).href,
  },
  sanchez: {
    nombre: "Francisco del Rosario Sánchez",
    imagen: new URL("./src/assets/images/sanchez.jpg", import.meta.url).href,
  },
  luperon: {
    nombre: "Gregorio Luperón",
    imagen: new URL("./src/assets/images/luperon.jpg", import.meta.url).href,
  },
  santana: {
    nombre: "Pedro Santana",
    imagen: new URL("./src/assets/images/santana.webp", import.meta.url).href,
  },
};

const questions = [
  {
    question: "¿Qué harías en una situación de peligro?",
    options: [
      { text: "Enfrentar el problema con valentía", value: "duarte" },
      { text: "Buscar apoyo en mis compañeros", value: "mella" },
      { text: "Mantener la calma y buscar soluciones", value: "sanchez" },
      { text: "Actuar de manera estratégica y calculada", value: "luperon" },
      { text: "Responder con rapidez y decisión", value: "santana" },
    ],
  },
  {
    question: "¿Qué estrategia prefieres en una batalla?",
    options: [
      { text: "Ataque directo", value: "duarte" },
      { text: "Emboscada", value: "mella" },
      { text: "Defensa organizada", value: "sanchez" },
      { text: "Guerra de guerrillas", value: "luperon" },
      { text: "Táctica de sorpresa", value: "santana" },
    ],
  },
  {
    question: "¿Qué símbolo representa mejor tu lucha?",
    options: [
      { text: "Una bandera", value: "duarte" },
      { text: "Un fusil", value: "mella" },
      { text: "Un escudo", value: "sanchez" },
      { text: "Un libro", value: "luperon" },
      { text: "Una espada", value: "santana" },
    ],
  },
  {
    question: "¿Cuál es tu rol en un equipo?",
    options: [
      { text: "Líder", value: "duarte" },
      { text: "Compañero fiel", value: "mella" },
      { text: "Estratega", value: "sanchez" },
      { text: "Visionario", value: "luperon" },
      { text: "Ejecutor", value: "santana" },
    ],
  },
  {
    question: "¿Qué lema te representa?",
    options: [
      { text: "Dios, Patria y Libertad", value: "duarte" },
      { text: "Luchar hoy, ser libres mañana", value: "mella" },
      { text: "Honor y coraje", value: "sanchez" },
      { text: "El saber es poder", value: "luperon" },
      { text: "Nada nos detendrá", value: "santana" },
    ],
  },
  {
    question: "¿Cómo enfrentas la traición?",
    options: [
      { text: "Expulsión inmediata", value: "duarte" },
      { text: "Investigar antes", value: "mella" },
      { text: "Proteger al grupo", value: "sanchez" },
      { text: "Usarla a mi favor", value: "luperon" },
      { text: "Confrontar al traidor", value: "santana" },
    ],
  },
  {
    question: "¿Qué superpoder elegirías?",
    options: [
      { text: "Inspiración", value: "duarte" },
      { text: "Resistencia", value: "mella" },
      { text: "Fuerza", value: "sanchez" },
      { text: "Estrategia", value: "luperon" },
      { text: "Velocidad", value: "santana" },
    ],
  },
  {
    question: "¿Qué misión aceptarías?",
    options: [
      { text: "Rebelión secreta", value: "duarte" },
      { text: "Mensaje urgente", value: "mella" },
      { text: "Defender posición", value: "sanchez" },
      { text: "Planear ataque", value: "luperon" },
      { text: "Asalto sorpresa", value: "santana" },
    ],
  },
  {
    question: "¿Qué valor te define?",
    options: [
      { text: "Justicia", value: "duarte" },
      { text: "Lealtad", value: "mella" },
      { text: "Coraje", value: "sanchez" },
      { text: "Astucia", value: "luperon" },
      { text: "Fuerza", value: "santana" },
    ],
  },
];

let currentSlide = 0;
const scores = {
  duarte: 0,
  mella: 0,
  sanchez: 0,
  luperon: 0,
  santana: 0,
};

// Elementos del DOM
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const progressElement = document.getElementById("progress");
const prevButton = document.getElementById("prevButton");
const resultTitle = document.getElementById("result-title");
const resultImage = document.getElementById("result-image");

function updateQuestion() {
  const currentQuestion = questions[currentSlide];
  questionElement.textContent = currentQuestion.question;
  progressElement.textContent = `${currentSlide + 1} / ${questions.length}`;

  optionsElement.innerHTML = "";
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className =
      "text-left px-6 py-4 rounded-xl bg-white/5 hover:bg-white/20 transition-colors border border-white/10 hover:border-white/30 quiz-option";
    button.textContent = option.text;
    button.onclick = () => selectAnswer(option.value);
    optionsElement.appendChild(button);
  });

  prevButton.style.display = currentSlide > 0 ? "flex" : "none";
}

function selectAnswer(character) {
  scores[character]++;

  if (currentSlide < questions.length - 1) {
    currentSlide++;
    updateQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const winner = Object.entries(scores).reduce((a, b) =>
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];

  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  resultTitle.textContent = `¡Te pareces a ${personajes[winner].nombre}!`;
  resultImage.src = personajes[winner].imagen;
  resultImage.alt = personajes[winner].nombre;
}

function resetQuiz() {
  currentSlide = 0;
  Object.keys(scores).forEach((key) => (scores[key] = 0));

  resultContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");

  updateQuestion();
}

prevButton.addEventListener("click", () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateQuestion();
  }
});

// Iniciar el quiz
updateQuestion();
window.resetQuiz = resetQuiz;