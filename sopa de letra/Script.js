// Palabras a buscar
const allWords = ["DUARTE", "SANCHEZ", "MELLA", "PATRIA", "BANDERA", "LIBERTAD", "DIOS", "BIBLIA", "LIBRE", "INDEPENDIENTE"];
const gridSize = 15; // Tamaño de la grilla (15x15)

// Elementos del DOM
const grid = document.querySelector('.grid');
const wordList = document.querySelector('.word-list ul');
const resetButton = document.querySelector('.btn.reset');
const hintButton = document.querySelector('.btn.hint');

// Variables de estado
let selectedCells = [];
let foundWords = [];
let activeWords = [];
let remainingWords = [...allWords];

// Inicializar el juego
function initGame() {
  activeWords = getRandomWords(3); // Iniciar con 3 palabras aleatorias
  remainingWords = allWords.filter(word => !activeWords.includes(word)); // Resto de palabras
  createGrid();
  renderWordList();
}

// Obtener palabras aleatorias
function getRandomWords(count) {
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Crear la grilla
function createGrid() {
  grid.innerHTML = ''; // Limpiar la grilla
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
  grid.style.gridTemplateRows = `repeat(${gridSize}, 40px)`;

  // Inicializar la grilla con letras aleatorias
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Letras aleatorias
    grid.appendChild(cell);
  }

  // Colocar las palabras activas en la grilla
  activeWords.forEach(word => {
    placeWord(word);
  });
}

// Colocar una palabra en la grilla
function placeWord(word) {
  const directions = [
    { x: 1, y: 0 }, // Horizontal
    { x: 0, y: 1 }, // Vertical
    { x: 1, y: 1 }, // Diagonal
  ];

  let direction = directions[Math.floor(Math.random() * directions.length)];
  let x = Math.floor(Math.random() * gridSize);
  let y = Math.floor(Math.random() * gridSize);

  // Verificar si la palabra cabe en la dirección seleccionada
  if (
    x + word.length * direction.x > gridSize ||
    y + word.length * direction.y > gridSize
  ) {
    return placeWord(word); // Intentar de nuevo
  }

  // Colocar la palabra
  for (let i = 0; i < word.length; i++) {
    const cell = grid.children[(y + i * direction.y) * gridSize + (x + i * direction.x)];
    cell.textContent = word[i];
  }
}

// Mostrar la lista de palabras
function renderWordList() {
  wordList.innerHTML = ''; // Limpiar la lista
  activeWords.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    if (foundWords.includes(word)) {
      li.classList.add('found');
    }
    wordList.appendChild(li);
  });
}

// Seleccionar celdas
grid.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('cell')) {
    selectedCells = [e.target];
    e.target.classList.add('selected');
  }
});

grid.addEventListener('mouseover', (e) => {
  if (e.target.classList.contains('cell') && selectedCells.length > 0) {
    selectedCells.push(e.target);
    e.target.classList.add('selected');
  }
});

grid.addEventListener('mouseup', () => {
  checkSelectedWord();
  selectedCells.forEach(cell => cell.classList.remove('selected'));
  selectedCells = [];
});

// Verificar si la palabra seleccionada es correcta
function checkSelectedWord() {
  const selectedWord = selectedCells.map(cell => cell.textContent).join('');
  if (activeWords.includes(selectedWord) && !foundWords.includes(selectedWord)) {
    selectedCells.forEach(cell => {
      cell.style.backgroundColor = '#10B981';
    });
    foundWords.push(selectedWord);
    markWordAsFound(selectedWord);

    // Verificar si se encontraron todas las palabras activas
    if (foundWords.length === activeWords.length) {
      if (remainingWords.length > 0) {
        // Agregar 2 palabras más
        const newWords = remainingWords.splice(0, 2);
        activeWords.push(...newWords);
        createGrid();
        renderWordList();
      } else {
        // Fin del juego
        setTimeout(() => {
          alert('¡Felicidades! Has encontrado todas las palabras.');
        }, 500);
      }
    }
  }
}

// Marcar palabra como encontrada
function markWordAsFound(word) {
  const wordItems = document.querySelectorAll('.word-list li');
  wordItems.forEach(item => {
    if (item.textContent === word) {
      item.classList.add('found');
    }
  });
}

// Reiniciar el juego
resetButton.addEventListener('click', () => {
  foundWords = [];
  remainingWords = [...allWords];
  initGame();
});

// Mostrar pista
hintButton.addEventListener('click', () => {
  alert(`Pista: Las palabras pueden estar en horizontal, vertical o diagonal.`);
});

// Inicializar el juego al cargar la página
initGame();