// Estado global
let currentScreen = 'start';
let currentModeIndex = 0;
let currentQuestionIndex = 0;
let showingQuiz = false;
let startTime = null;
let characterIndex = 0;
let selectedPatriot = null;
let selectedHymn = null;
let typingStats = {
  wpm: 0,
  accuracy: 0,
  mistakes: 0,
  totalCharacters: 0
};



// Elementos DOM
const screens = {
  start: document.getElementById('start-screen'),
  modes: document.getElementById('modes-screen'),
  trivia: document.getElementById('trivia-screen'),
  characters: document.getElementById('characters-screen'),
  characterTyping: document.getElementById('character-typing-screen'),
  hymns: document.getElementById('hymns-screen'),
  hymnTyping: document.getElementById('hymn-typing-screen')
};

const backBtn = document.getElementById('back-btn');
const carouselContainer = document.querySelector('.carousel-container');
const patriotsCarousel = document.querySelector('.patriots-carousel');
const hymnsContainer = document.querySelector('.hymns-list');

// Funciones de navegación
function showScreen(screenId) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenId].classList.add('active');
  currentScreen = screenId;
  backBtn.classList.toggle('hidden', screenId === 'start');
}

function startGame() {
  showScreen('modes');
  renderCarousel();
}

function goBack() {
  if (currentScreen === 'characterTyping') {
    showScreen('characters');
    renderPatriotsCarousel();
  } else if (currentScreen === 'hymnTyping') {
    showScreen('hymns');
    renderHymnsList();
  } else if (currentScreen === 'hymns' || currentScreen === 'trivia' || currentScreen === 'characters') {
    // Go back to modes screen
    showScreen('modes');
    currentQuestionIndex = 0;
    showingQuiz = false;
  } else if (currentScreen === 'modes') {
    // Redirect to the specific link when going back from modes screen
    window.location.href = 'http://27.roanexus.com';
  } else {
    // Default fallback
    showScreen('start');
  }
}

// Funciones del carrusel principal
function renderCarousel() {
  carouselContainer.innerHTML = '';
  
  gameModes.forEach((mode, index) => {
    const item = document.createElement('div');
    item.className = `carousel-item ${getItemClass(index)}`;
    
    item.innerHTML = `
      <div class="carousel-card">
        <img src="${mode.image}" alt="${mode.title}">
        <div class="carousel-content">
          <h2 class="carousel-title">${mode.title}</h2>
          <p class="carousel-description">${mode.description}</p>
          ${index === currentModeIndex ? `
            <button class="btn-play" onclick="selectMode('${mode.id}')">
              Seleccionar
            </button>
          ` : ''}
        </div>
      </div>
    `;
    
    carouselContainer.appendChild(item);
  });
}

function getItemClass(index) {
  if (index === currentModeIndex) return 'active';
  if (index === (currentModeIndex + 1) % gameModes.length) return 'next';
  if (index === (currentModeIndex - 1 + gameModes.length) % gameModes.length) return 'prev';
  return 'hidden';
}

function nextMode() {
  currentModeIndex = (currentModeIndex + 1) % gameModes.length;
  renderCarousel();
}

function prevMode() {
  currentModeIndex = (currentModeIndex - 1 + gameModes.length) % gameModes.length;
  renderCarousel();
}

// Funciones del juego
function selectMode(modeId) {
  switch(modeId) {
    case 'trivia':
      showScreen('trivia');
      setupTrivia();
      break;
    case 'characters':
      showScreen('characters');
      renderPatriotsCarousel();
      break;
    case 'hymns':
      showScreen('hymns');
      renderHymnsList();
      break;
  }
}
// funcion mecanografia

function setupTypingGame(text, onComplete) {
  const activeScreen = document.querySelector('.screen.active');
  
  // Find the typing-text and typing-input elements within the active screen
  const container = activeScreen.querySelector('.typing-text');
  const input = activeScreen.querySelector('.typing-input');
  
  if (!container || !input) {
    console.error('Error: No se encontraron los elementos necesarios para el juego de mecanografía');
    return;
  }
  
  // Limpiar contenido anterior
  container.innerHTML = '';
  
  // Verificar que tenemos texto
  if (!text) {
    console.error('Error: No hay texto para tipear');
    return;
  }
  
  // Primero reemplazar los <br> por saltos de línea reales para procesamiento
  const processedText = text.replace(/<br>/g, '\n');
  
  // Crear spans para cada carácter (preservando espacios y saltos de línea)
  processedText.split('').forEach(char => {
    const span = document.createElement('span');
    
    if (char === '\n') {
      // Para saltos de línea, usar un <br> real en el DOM
      span.innerHTML = '<br>';
      container.appendChild(span);
      return;
    }
    
    span.innerHTML = char === ' ' ? '&nbsp;' : char;
    span.className = 'typing-char';
    
    // Preservar espacios visualmente
    if (char === ' ') {
      span.style.marginRight = '0.25em';
    }
    
    span.style.display = 'inline-block';
    span.style.fontSize = '18px';
    span.style.lineHeight = '1.5';
    container.appendChild(span);
  });
  
  // Asegurar que el contenedor es visible
  container.style.display = 'block';
  container.style.minHeight = '100px';
  container.style.padding = '20px';
  container.style.borderRadius = '8px';
  container.style.marginBottom = '20px';
  container.style.lineHeight = '1.5';
  
  // Para el juego de tipeo, necesitamos crear una versión plana del texto (sin saltos de línea HTML)
  const flatText = processedText;
  
  const spans = container.querySelectorAll('span');
  const typingStats = {
    wpm: 0,
    accuracy: 0,
    mistakes: 0,
    totalCharacters: flatText.length
  };
  
  input.value = '';
  input.focus();
  let startTime = null;
  
  // Eliminar eventListeners anteriores
  if (input.typingListener) {
    input.removeEventListener('input', input.typingListener);
  }
  
  input.typingListener = function() {
    if (!startTime && input.value.length > 0) {
      startTime = new Date();
    }
    
    const value = input.value;
    
    spans.forEach((span, index) => {
      if (index >= value.length) {
        span.classList.remove('correct', 'incorrect');
        return;
      }
      
      const expectedChar = span.textContent || ' ';
      const typedChar = value[index];
      
      if (typedChar === expectedChar || (expectedChar === '\xa0' && typedChar === ' ')) {
        span.classList.add('correct');
        span.classList.remove('incorrect');
      } else {
        span.classList.add('incorrect');
        span.classList.remove('correct');
        typingStats.mistakes++;
      }
    });
    
    if (value.length === flatText.length) {
      const endTime = new Date();
      const timeDiff = (endTime - startTime) / 1000 / 60; // en minutos
      typingStats.wpm = Math.round((flatText.length / 5) / timeDiff);
      typingStats.accuracy = Math.round((flatText.length - typingStats.mistakes) / flatText.length * 100);
      onComplete(typingStats);
    }
  };
  
  input.addEventListener('input', input.typingListener);
}


// Trivia
function setupTrivia() {
  const question = triviaQuestions[currentQuestionIndex];
  const quizContainer = document.querySelector('.quiz-container');
  const typingContainer = document.querySelector('.typing-container');
  const resultContainer = document.querySelector('.typing-result');
  
  quizContainer.classList.add('hidden');
  typingContainer.classList.remove('hidden');
  resultContainer.classList.add('hidden');
  
  setupTypingGame(question.quote, (stats) => {
    showTypingResult(stats, () => {
      showQuiz();
    });
  });
}

function showTypingResult(stats, onContinue) {
  const resultContainer = document.querySelector('.typing-result');
  const typingContainer = document.querySelector('.typing-container');
  
  typingContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  
  resultContainer.innerHTML = `
    <h3>Resultados de mecanografía</h3>
    <p>Velocidad: ${stats.wpm} PPM</p>
    <p>Precisión: ${stats.accuracy}%</p>
    <button class="btn-play" onclick="continueTrivia()">Continuar</button>
  `;
}

function continueTrivia() {
  const resultContainer = document.querySelector('.typing-result');
  resultContainer.classList.add('hidden');
  showQuiz();
}

function showQuiz() {
  const question = triviaQuestions[currentQuestionIndex];
  const quizContainer = document.querySelector('.quiz-container');
  const optionsContainer = document.querySelector('.options-container');
  const feedbackContainer = document.querySelector('.quiz-feedback');
  
  quizContainer.classList.remove('hidden');
  feedbackContainer.innerHTML = '';
  
  optionsContainer.innerHTML = question.options.map((option, index) => `
    <button class="option-btn" onclick="checkAnswer(${index})">
      ${option}
    </button>
  `).join('');
}

function checkAnswer(index) {
  const question = triviaQuestions[currentQuestionIndex];
  const feedbackContainer = document.querySelector('.quiz-feedback');
  
  if (index === question.correct) {
    feedbackContainer.innerHTML = `
      <div class="feedback correct">
        ¡Correcto! Esta frase es de ${question.options[question.correct]}.
      </div>
    `;
    setTimeout(() => {
      if (currentQuestionIndex < triviaQuestions.length - 1) {
        currentQuestionIndex++;
        setupTrivia();
      } else {
        showFinalScore();
      }
    }, 2000);
  } else {
    feedbackContainer.innerHTML = `
      <div class="feedback incorrect">
        Incorrecto. Intenta de nuevo.
      </div>
    `;
  }
}

// Personajes
function renderPatriotsCarousel() {
  patriotsCarousel.innerHTML = '';
  characterIndex = 0;
  
  patriots.forEach((patriot, index) => {
    const item = document.createElement('div');
    item.className = `carousel-item ${index === 0 ? 'active' : (index === 1 ? 'next' : 'prev')}`;
    
    item.innerHTML = `
      <div class="carousel-card">
        <img src="${patriot.image}" alt="${patriot.name}">
        <div class="carousel-content">
          <h2 class="carousel-title">${patriot.name}</h2>
          <button class="btn-play" onclick="selectPatriot(${patriot.id})">
            Practicar frases
          </button>
        </div>
      </div>
    `;
    
    patriotsCarousel.appendChild(item);
  });
}

function selectPatriot(id) {
  selectedPatriot = patriots.find(p => p.id === id);
  showScreen('characterTyping');
  setupPatriotQuotes();
}

function setupPatriotQuotes() {
  const screen = document.getElementById('character-typing-screen');
  const typingContainer = screen.querySelector('.character-typing-container');
  const resultContainer = screen.querySelector('.typing-result');

  // Ocultar resultado anterior y mostrar la sección de mecanografía
  typingContainer.classList.remove('hidden');
  if (resultContainer) resultContainer.classList.add('hidden');
  
  // Preparar el contenedor
  typingContainer.innerHTML = `
    <h2>${selectedPatriot.name}</h2>
    <div class="typing-text"></div>
    <input type="text" class="typing-input" placeholder="Comienza a escribir...">
  `;
  
  // Asegúrate de obtener una cita (string) del arreglo de citas
  const quote = selectedPatriot.quotes[characterIndex];
  
  // Verificar que quote es un string válido
  if (typeof quote !== 'string' || !quote) {
    console.error('Error: La cita no es válida', quote);
    return;
  }
  
  // Ahora deja que setupTypingGame divida el texto en caracteres
  setupTypingGame(quote, (stats) => {
    showCharacterTypingResult(stats, () => {
      nextPatriotQuote();
    });
  });
}


function showCharacterTypingResult(stats, onContinue) {
  const screen = document.getElementById('character-typing-screen');
  const typingContainer = screen.querySelector('.character-typing-container');
  let resultContainer = screen.querySelector('.typing-result');

  // Si no existe el contenedor de resultados, lo creamos
  if (!resultContainer) {
    resultContainer = document.createElement('div');
    resultContainer.className = 'typing-result';
    screen.appendChild(resultContainer);
  }

  // Ocultar el input y mostrar los resultados
  typingContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');

  // Limpiar el contenido anterior
  resultContainer.innerHTML = '';

  const title = document.createElement('h3');
  title.textContent = '¡Excelente trabajo!';

  const speed = document.createElement('p');
  speed.textContent = `Velocidad: ${stats.wpm} PPM`;

  const accuracy = document.createElement('p');
  accuracy.textContent = `Precisión: ${stats.accuracy}%`;

  const patriotismMessage = document.createElement('p');
  patriotismMessage.classList.add('patriotism-message');
  patriotismMessage.textContent = getPatriotismMessage(
    Math.round((stats.wpm * stats.accuracy) / 100)
  );

  const continueButton = document.createElement('button');
  continueButton.classList.add('btn-play');
  continueButton.textContent = 'Continuar';
  continueButton.onclick = onContinue;

  // Agregar elementos al contenedor
  resultContainer.appendChild(title);
  resultContainer.appendChild(speed);
  resultContainer.appendChild(accuracy);
  resultContainer.appendChild(patriotismMessage);
  resultContainer.appendChild(continueButton);
}

function getPatriotismMessage(level) {
  if (level >= 90) return "¡Eres 100% dominicano! ¡Un verdadero patriota!";
  if (level >= 70) return "¡Eres 75% dominicano! ¡Casi un patriota!";
  if (level >= 50) return "Eres 50% dominicano. ¡Sigue practicando!";
  return "Eres 25% dominicano. ¡No te rindas!";
}

function nextPatriotQuote() {
  characterIndex = (characterIndex + 1) % selectedPatriot.quotes.length;
  setupPatriotQuotes();
}

// Navegación de personajes
function nextPatriot() {
  const items = document.querySelectorAll('.patriots-carousel .carousel-item');
  if (items.length > 0) {
    // Get current active item
    const activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    const nextIndex = (activeIndex + 1) % items.length;
    
    // Update classes
    items.forEach((item, index) => {
      if (index === nextIndex) {
        item.className = 'carousel-item active';
      } else if (index === (nextIndex + 1) % items.length) {
        item.className = 'carousel-item next';
      } else if (index === (nextIndex - 1 + items.length) % items.length) {
        item.className = 'carousel-item prev';
      } else {
        item.className = 'carousel-item hidden';
      }
    });
  }
}

function prevPatriot() {
  const items = document.querySelectorAll('.patriots-carousel .carousel-item');
  if (items.length > 0) {
    // Get current active item
    const activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    
    // Update classes
    items.forEach((item, index) => {
      if (index === prevIndex) {
        item.className = 'carousel-item active';
      } else if (index === (prevIndex + 1) % items.length) {
        item.className = 'carousel-item next';
      } else if (index === (prevIndex - 1 + items.length) % items.length) {
        item.className = 'carousel-item prev';
      } else {
        item.className = 'carousel-item hidden';
      }
    });
  }
}

  // Himnos
  function renderHymnsList() {
    hymnsContainer.innerHTML = hymns.map(hymn => `
      <div class="hymn-card" onclick="selectHymn(${hymn.id})">
        <h3>${hymn.title}</h3>
        <button class="btn-play">Practicar</button>
      </div>
    `).join('');
  }

  function selectHymn(id) {
    selectedHymn = hymns.find(h => h.id === id);
    showScreen('hymnTyping');
    setupHymnTyping();
  }

function setupHymnTyping() {
  const screen = document.getElementById('hymn-typing-screen');
  const container = screen.querySelector('.hymn-typing-container');
  
  container.innerHTML = `
    <h2>${selectedHymn.title}</h2>
    <div class="typing-text"></div>
    <input type="text" class="typing-input" placeholder="Comienza a escribir...">
  `;
  
  // Verificar que la letra del himno existe
  if (typeof selectedHymn.lyrics !== 'string' || !selectedHymn.lyrics) {
    console.error('Error: La letra del himno no es válida', selectedHymn.lyrics);
    return;
  }
  
  // Deja que setupTypingGame divida el texto en caracteres
  setupTypingGame(selectedHymn.lyrics, (stats) => {
    showHymnTypingResult(stats);
  });
}
function showHymnTypingResult(stats) {
  const screen = document.getElementById('hymn-typing-screen');
  const typingContainer = screen.querySelector('.hymn-typing-container');
  let resultContainer = screen.querySelector('.typing-result');

  if (!resultContainer) {
    resultContainer = document.createElement('div');
    resultContainer.className = 'typing-result';
    screen.appendChild(resultContainer);
  }

  // Ocultar el input y mostrar los resultados
  typingContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');

  // Limpiar el contenido anterior
  resultContainer.innerHTML = '';

  const title = document.createElement('h3');
  title.textContent = '¡Himno completado!';

  const speed = document.createElement('p');
  speed.textContent = `Velocidad: ${stats.wpm} PPM`;

  const accuracy = document.createElement('p');
  accuracy.textContent = `Precisión: ${stats.accuracy}%`;

  const patriotismMessage = document.createElement('p');
  patriotismMessage.classList.add('patriotism-message');
  patriotismMessage.textContent = getPatriotismMessage(
    Math.round((stats.wpm * stats.accuracy) / 100)
  );

  const backButton = document.createElement('button');
  backButton.classList.add('btn-play');
  backButton.textContent = 'Volver a Himnos';
  backButton.onclick = () => {
    showScreen('hymns');
    renderHymnsList();
  };

  // Agregar elementos al contenedor
  resultContainer.appendChild(title);
  resultContainer.appendChild(speed);
  resultContainer.appendChild(accuracy);
  resultContainer.appendChild(patriotismMessage);
  resultContainer.appendChild(backButton);
}

  

  function startCharacterTyping(frase) {
    const typingText = document.querySelector(".typing-text");
    typingText.innerHTML = frase.split("").map(letra => `<span class="typing-char">${letra}</span>`).join("");
}

function startHymnTyping(frase) {
    const typingText = document.querySelector(".typing-text");
    typingText.innerHTML = frase.split("").map(letra => `<span class="typing-char">${letra}</span>`).join("");
}
