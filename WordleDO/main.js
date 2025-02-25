/** @format */

// Game state
let state = {
  currentWordObj: null,
  currentGuess: "",
  currentRow: 0,
  gameOver: false,
  darkMode: localStorage.getItem("darkMode") === "true",
  wordLength: parseInt(localStorage.getItem("wordLength")) || 5,
  failedAttempts: 0,
  isProcessingGuess: false,
  isRestarting: false,
  stats: JSON.parse(
    localStorage.getItem("stats") ||
      JSON.stringify({
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0],
      })
  ),
};

const WORDS = [
  // Padres de la Patria y Familia
  {
    word: "DUARTE",
    hint: "Padre de la Patria, fundador de una sociedad secreta",
  },
  { word: "MELLA", hint: "Héroe que dio el trabucazo por la libertad" },
  { word: "SANCHEZ", hint: "Héroe que izó nuestra primera bandera" },
  { word: "DIEZ", hint: "Apellido materno de un gran patriota" },

  // Símbolos Nacionales
  { word: "HIMNO", hint: "Canción oficial de nuestra nación" },
  { word: "CIGUA", hint: "Ave nacional de plumas grises" },
  { word: "CAOBA", hint: "Árbol nacional de madera preciosa" },
  { word: "ROSAS", hint: "Flor nacional que crece en Bayahibe" },
  { word: "ESCUDO", hint: "Símbolo nacional con cuatro libros" },
  { word: "BIBLIA", hint: "Libro sagrado en nuestro escudo" },

  // Heroínas
  { word: "MARIA", hint: "Heroína____Trinidad Sánchez" },
  { word: "BONA", hint: "Concepción ____ costurera de la bandera" },
  { word: "JUANA", hint: "Heroína conocida como ____ Santitopa" },
  { word: "ISABEL", hint: "___Heroína de las Damas de Febrero" },
  { word: "MANUELA", hint: "____Madre del fundador de La Trinitaria" },

  // Batallas
  { word: "AZUA", hint: "Batalla del 19 de marzo" },
  { word: "BELLER", hint: "Batalla en la frontera norte" },
  { word: "MEMISO", hint: "Batalla en las montañas de Azua" },
  { word: "ESTRELLETA", hint: "Batalla en la frontera oeste" },
  { word: "SANTOME", hint: "Batalla cerca del río Yaque" },
  { word: "SABANA", hint: "Batalla en los campos del norte" },

  // Héroes
  { word: "PUELLO", hint: "General defensor de Santo Domingo" },
  { word: "IMBERT", hint: "General del norte del país" },
  { word: "DUVERG", hint: "General del este del país" },
  { word: "SANTANA", hint: "Primer presidente dominicano" },
  { word: "CABRAL", hint: "Héroe de la Restauración" },
  { word: "LUPERON", hint: "Héroe restaurador del norte" },

  // Cultura y Tradiciones
  { word: "PLENA", hint: "Música tradicional de fiesta" },
  { word: "PALOS", hint: "Tambores tradicionales" },
  { word: "MANGU", hint: "Plato tipico elaborado con platano verde" },
  { word: "MORIR", hint: 'Bebida que termina en "Soñando"' },
  { word: "PICO", hint: "La montaña más alta del Caribe" },
  { word: "MERENGUE", hint: "Baile nacional dominicano" },
  { word: "BACHATA", hint: "Música romántica dominicana" },
  { word: "SANCOCHO", hint: "Sopa tradicional dominicana" },
  { word: "BANDERA", hint: "Almuerzo típico dominicano" },
  { word: "CASABE", hint: "Pan tradicional de yuca" },
];

function showToast(message, duration = 3000) {
  const existingToast = document.querySelector(".toast-message");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}

function wordExists(word) {
  return WORDS.some((w) => w.word === word);
}

function initGame() {
  state.currentRow = 0;
  state.currentGuess = "";
  state.gameOver = false;
  state.failedAttempts = 0;

  const filteredWords = WORDS.filter(
    (word) => word.word.length === state.wordLength
  );

  if (filteredWords.length === 0) {
    state.wordLength = 5;
    localStorage.setItem("wordLength", state.wordLength);
    const fiveLetterWords = WORDS.filter((word) => word.word.length === 5);
    state.currentWordObj =
      fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
  } else {
    state.currentWordObj =
      filteredWords[Math.floor(Math.random() * filteredWords.length)];
  }

  updateRevealButton();
  createGrid();
  initKeyboard();
  updateTheme();
  updateWordLengthSelector();

  if (!localStorage.getItem("helpShown")) {
    showHelpModal();
    localStorage.setItem("helpShown", "true");
  }
}

function createGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${state.wordLength}, 1fr)`;

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < state.wordLength; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.col = j;
      grid.appendChild(cell);
    }
  }
}

function updateRevealButton() {
  const revealBtn = document.getElementById("reveal-btn");
  if (revealBtn) {
    revealBtn.disabled = state.failedAttempts < 3;
    revealBtn.style.opacity = state.failedAttempts < 3 ? "0.5" : "1";
    revealBtn.style.cursor =
      state.failedAttempts < 3 ? "not-allowed" : "pointer";
    revealBtn.title =
      state.failedAttempts < 3
        ? `Necesitas ${3 - state.failedAttempts} intentos más para ver la pista`
        : "Ver la pista";
  }
}

function updateWordLengthSelector() {
  const lengthSelector = document.getElementById("length-selector");
  if (lengthSelector) {
    lengthSelector.value = state.wordLength.toString();
  }
}

function initKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  rows.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    row.forEach((key) => {
      const button = document.createElement("button");
      button.className = "key";
      if (key === "ENTER" || key === "⌫") {
        button.className += " key-wide";
      }
      button.textContent = key;
      button.dataset.key = key;
      button.addEventListener("click", () => handleKeyPress(key));
      rowDiv.appendChild(button);
    });

    keyboard.appendChild(rowDiv);
  });
}

function handleKeyPress(key) {
  if (state.gameOver || state.isProcessingGuess) return;

  if (key === "⌫" || key === "BACKSPACE") {
    if (state.currentGuess.length > 0) {
      state.currentGuess = state.currentGuess.slice(0, -1);
      updateGrid();
    }
  } else if (key === "ENTER") {
    if (state.currentGuess.length === state.wordLength) {
      state.isProcessingGuess = true;
      checkGuess();
    } else {
      showToast("¡Completa la palabra!");
      const grid = document.getElementById("grid");
      grid.classList.add("shake");
      setTimeout(() => grid.classList.remove("shake"), 500);
    }
  } else if (state.currentGuess.length < state.wordLength) {
    state.currentGuess += key;
    const cell = document.querySelector(
      `.cell[data-row="${state.currentRow}"][data-col="${
        state.currentGuess.length - 1
      }"]`
    );
    cell.classList.add("pop");
    setTimeout(() => cell.classList.remove("pop"), 100);
    updateGrid();
  }
}

function updateGrid() {
  const cells = document.querySelectorAll(".cell");
  const rowStart = state.currentRow * state.wordLength;

  for (let i = 0; i < state.wordLength; i++) {
    cells[rowStart + i].textContent = state.currentGuess[i] || "";
  }
}

function checkGuess() {
  const word = state.currentWordObj.word;
  const guess = state.currentGuess;
  const cells = document.querySelectorAll(".cell");
  const rowStart = state.currentRow * state.wordLength;
  const letterStates = new Map();

  // Agregar clase flip a todas las celdas de la fila actual
  for (let i = 0; i < state.wordLength; i++) {
    const cell = cells[rowStart + i];
    cell.classList.add("flip");
    cell.dataset.index = i;
  }

  const revealPromises = [];
  for (let i = 0; i < state.wordLength; i++) {
    const cell = cells[rowStart + i];
    const key = document.querySelector(
      `.key[data-key="${guess[i]}"]:not(.key-wide)`
    );

    const promise = new Promise((resolve) => {
      setTimeout(() => {
        if (guess[i] === word[i]) {
          cell.classList.add("cell-correct");
          key?.classList.add("key-correct");
          letterStates.set(guess[i], "correct");
        } else if (word.includes(guess[i])) {
          cell.classList.add("cell-wrong-position");
          if (!letterStates.has(guess[i])) {
            key?.classList.add("key-wrong-position");
            letterStates.set(guess[i], "wrong-position");
          }
        } else {
          cell.classList.add("cell-incorrect");
          if (!letterStates.has(guess[i])) {
            key?.classList.add("key-incorrect");
            letterStates.set(guess[i], "incorrect");
          }
        }
        setTimeout(resolve, 100);
      }, 300 + i * 200);
    });

    revealPromises.push(promise);
  }

  Promise.all(revealPromises).then(() => {
    if (guess === word) {
      state.gameOver = true;
      updateStats(true);
      showToast("¡Felicidades! ¡Has ganado! 🎉");
      triggerWinConfetti();
      setTimeout(() => showStats(true), 1500);
    } else {
      state.failedAttempts++;
      updateRevealButton();

      if (state.failedAttempts === 3) {
        showToast(
          "¡Parece que necesitas ayuda! La pista está disponible 💡",
          5000
        );
      }

      if (state.currentRow === 5) {
        state.gameOver = true;
        updateStats(false);
        showToast(`¡Game Over! La palabra era: ${word} 😢`);
        setTimeout(() => showStats(false), 500);
      } else {
        state.currentRow++;
        state.currentGuess = "";
      }
    }
    state.isProcessingGuess = false;
  });
}

function updateStats(won) {
  state.stats.gamesPlayed++;
  if (won) {
    state.stats.gamesWon++;
    state.stats.currentStreak++;
    state.stats.maxStreak = Math.max(
      state.stats.maxStreak,
      state.stats.currentStreak
    );
    state.stats.guessDistribution[state.currentRow]++;
  } else {
    state.stats.currentStreak = 0;
  }
  localStorage.setItem("stats", JSON.stringify(state.stats));
}

function showHintModal() {
  if (state.failedAttempts < 3) return;

  const modal = document.createElement("div");
  modal.className = "hint-modal";
  modal.style.pointerEvents = "all";

  modal.innerHTML = `
    <div class="hint-content">
      <h2 class="hint-title">¿Necesitas ayuda? 💡</h2>
      <p class="hint-text">${
        state.currentWordObj.hint ||
        "No hay pista disponible para esta palabra."
      }</p>
      <button class="hint-button">ENTENDIDO</button>
    </div>
  `;

  document.body.appendChild(modal);

  const content = modal.querySelector(".hint-content");
  content.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  const button = modal.querySelector(".hint-button");
  button.addEventListener("click", () => {
    modal.remove();
  });
}

function showHelpModal() {
  const modal = document.createElement("div");
  modal.className = "help-modal";

  modal.innerHTML = `
    <div class="help-content">
      <h2 class="help-title">¿Cómo jugar Wordle Dominicano?</h2>
      
      <div class="help-section">
        <h3>Reglas básicas</h3>
        <p>Adivina la palabra relacionada con la cultura dominicana en 6 intentos.</p>
        <p>Después de cada intento, el color de las letras cambiará para mostrar qué tan cerca estás.</p>
      </div>
      
      <div class="help-section">
        <h3>Ejemplos</h3>
        <div class="help-examples">
          <div class="example-cell cell-correct">M</div>
          <div class="example-cell">A</div>
          <div class="example-cell">N</div>
          <div class="example-cell">G</div>
          <div class="example-cell">U</div>
        </div>
        <p>La letra M está en la palabra y en la posición correcta.</p>
        
        <div class="help-examples">
          <div class="example-cell">P</div>
          <div class="example-cell cell-wrong-position">L</div>
          <div class="example-cell">A</div>
          <div class="example-cell">Y</div>
          <div class="example-cell">A</div>
        </div>
        <p>La letra L está en la palabra pero en la posición incorrecta.</p>
        
        <div class="help-examples">
          <div class="example-cell">S</div>
          <div class="example-cell">A</div>
          <div class="example-cell cell-incorrect">X</div>
          <div class="example-cell">O</div>
          <div class="example-cell">N</div>
        </div>
        <p>La letra X no está en la palabra.</p>
      </div>
      
      <div class="help-section">
        <h3>Pistas</h3>
        <p>Después de 3 intentos fallidos, podrás solicitar una pista usando el botón 💡</p>
      </div>
      
      <div class="help-footer">
        <button class="help-button">¡EMPEZAR A JUGAR!</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const button = modal.querySelector(".help-button");
  button.addEventListener("click", () => {
    modal.remove();
  });
}

function showStats(won = false) {
  const modal = document.createElement("div");
  modal.className = "stats-modal";
  modal.style.pointerEvents = "all";

  const content = document.createElement("div");
  content.className = "stats-content";

  content.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${
        won ? "¡Victoria! 🏆" : "¡Inténtalo de nuevo! 🎮"
      }</h2>
      <p class="modal-subtitle">${
        won
          ? "¡Excelente trabajo! Has demostrado tu conocimiento de la cultura dominicana."
          : `La palabra era: ${state.currentWordObj.word}`
      }</p>
    </div>
    <div class="modal-actions">
      <button class="modal-button primary" id="restart-button">
        ${won ? "JUGAR OTRA PALABRA" : "INTENTAR NUEVA PALABRA"}
      </button>
      <button class="modal-button secondary" id="share-result">
        COMPARTIR RESULTADO
      </button>
    </div>
    <div class="modal-tip">
      <p>Presiona Enter para jugar de nuevo</p>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      e.stopPropagation();
    }
  });

  content.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  const restartButton = document.getElementById("restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", () => location.reload(), {
      once: true,
    });
  }

  document.getElementById("share-result").addEventListener("click", () => {
    const text = `¡Jugué Wordle Dominicano!\nPalabra: ${state.currentWordObj.word}\nPista: ${state.currentWordObj.hint}\n\n¡Juega tú también en ${window.location.origin}! 🎮`;
    navigator.clipboard.writeText(text).then(() => {
      showToast("¡Resultado copiado al portapapeles! 📋");
    });
  });

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      location.reload();
      document.removeEventListener("keydown", handleEnterKey);
    }
  };

  document.addEventListener("keydown", handleEnterKey);
}

function triggerWinConfetti() {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    shapes: ["square", "circle"],
    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"],
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      gravity: 1.2,
      scalar: 1.2,
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      gravity: 1.2,
      scalar: 1.2,
    });
    confetti({
      ...defaults,
      particleCount: particleCount / 2,
      origin: { x: randomInRange(0.4, 0.6), y: 0.7 },
      gravity: 0.8,
      scalar: 1.5,
    });
  }, 250);

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.6 },
    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"],
    shapes: ["square", "circle"],
    scalar: 1.5,
    gravity: 0.8,
    drift: 0,
    ticks: 200,
  });
}

function updateTheme() {
  document.body.classList.toggle("dark-mode", state.darkMode);
  document.getElementById("theme-toggle").textContent = state.darkMode
    ? "☀️"
    : "🌙";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initGame();

  document.getElementById("theme-toggle").addEventListener("click", () => {
    state.darkMode = !state.darkMode;
    localStorage.setItem("darkMode", state.darkMode);
    updateTheme();
  });

  document
    .getElementById("restart")
    .addEventListener("click", () => location.reload());

  document.getElementById("share").addEventListener("click", () => {
    const text = `¡Jugué Wordle Dominicano!\nPalabra: ${state.currentWordObj.word}\nPista: ${state.currentWordObj.hint}\n\n¡Juega tú también en ${window.location.origin}! 🎮`;
    navigator.clipboard.writeText(text).then(() => {
      showToast("¡Resultado copiado al portapapeles! 📋");
    });
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    if (key === "BACKSPACE") {
      handleKeyPress("BACKSPACE");
    } else if (key === "ENTER") {
      handleKeyPress("ENTER");
    } else if (/^[A-ZÑ]$/.test(key)) {
      handleKeyPress(key);
    }
  });

  document.getElementById("length-selector").addEventListener("change", (e) => {
    state.wordLength = parseInt(e.target.value);
    localStorage.setItem("wordLength", state.wordLength);
    location.reload();
  });

  document.getElementById("reveal-btn").addEventListener("click", () => {
    if (state.failedAttempts >= 3) {
      showHintModal();
    }
  });
});
