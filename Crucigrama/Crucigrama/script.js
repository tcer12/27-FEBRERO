/** @format */
const GRID = [
  ['D', 'U', 'A', 'R', 'T', 'E', '*', '*', '*', '*'],
  ['*', '*', '*', 'E', '*', '*', '*', '*', '*', '*'],
  ['*', '*', '*', 'S', '*', '*', '*', '*', '*', '*'],
  ['*', '*', '*', 'T', '*', '*', '*', '*', '*', 'M'],
  ['B', 'A', 'N', 'D', 'E', 'R', 'A', '*', '*', 'E'],
  ['*', '*', '*', 'U', '*', '*', '*', '*', '*', 'L'],
  ['*', '*', '*', 'R', '*', 'C', 'O', 'N', 'D', 'E'],
  ['*', '*', '*', 'A', '*', '*', '*', '*', '*', 'A'],
  ['*', '*', '*', 'C', 'A', 'C', 'A', 'O', '*', '*'],
  ['*', '*', '*', 'I', '*', '*', '*', '*', '*', '*'],
  ['*', '*', '*', 'O', '*', '*', '*', '*', '*', '*'],
  ['P', 'A', 'T', 'R', 'I', 'A', '*', '*', '*', '*'],
];

const CLUES = {
  across: [
    { num: 1, clue: 'Padre de la Patria', answer: 'DUARTE' },
    { num: 5, clue: 'Símbolo nacional tricolor', answer: 'BANDERA' },
    {
      num: 6,
      clue: 'Héroe nacional, Francisco del Rosario ___',
      answer: 'CONDE',
    },
    {
      num: 7,
      clue: 'Principal producto de exportación colonial',
      answer: 'CACAO',
    },
    { num: 8, clue: 'Tierra que amamos', answer: 'PATRIA' },
  ],
  down: [
    { num: 1, clue: 'Gesta de la independencia', answer: 'RESTAURACION' },
    { num: 2, clue: 'Dulce canto nacional', answer: 'MELEA' },
  ],
};

class Crossword {
  constructor() {
    this.grid = GRID;
    this.selectedCell = null;
    this.direction = 'across';
    this.init();
  }

  init() {
    this.createGrid();
    this.createClues();
    this.setupEventListeners();
  }

  createGrid() {
    const crossword = document.getElementById('crossword');
    crossword.style.gridTemplateColumns = `repeat(${this.grid[0].length}, 1fr)`;

    let cellNumber = 1;
    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === '*') {
          this.createBlockedCell(crossword);
        } else {
          const isNumbered = this.shouldNumberCell(i, j);
          this.createCell(crossword, i, j, isNumbered ? cellNumber : null);
          if (isNumbered) cellNumber++;
        }
      });
    });
  }

  createBlockedCell(parent) {
    const cell = document.createElement('div');
    cell.className = 'cell blocked';
    parent.appendChild(cell);
  }

  createCell(parent, row, col, number) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = row;
    cell.dataset.col = col;

    if (number) {
      const numberSpan = document.createElement('span');
      numberSpan.className = 'cell-number';
      numberSpan.textContent = number;
      cell.appendChild(numberSpan);
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    cell.appendChild(input);

    parent.appendChild(cell);
  }

  shouldNumberCell(row, col) {
    if (this.grid[row][col] === '*') return false;

    const isStartAcross = col === 0 || this.grid[row][col - 1] === '*';
    const isStartDown = row === 0 || this.grid[row - 1][col] === '*';

    return isStartAcross || isStartDown;
  }

  createClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');

    CLUES.across.forEach((clue) => {
      const li = document.createElement('li');
      li.textContent = `${clue.num}. ${clue.clue}`;
      li.dataset.number = clue.num;
      li.dataset.direction = 'across';
      acrossClues.appendChild(li);
    });

    CLUES.down.forEach((clue) => {
      const li = document.createElement('li');
      li.textContent = `${clue.num}. ${clue.clue}`;
      li.dataset.number = clue.num;
      li.dataset.direction = 'down';
      downClues.appendChild(li);
    });
  }

  setupEventListeners() {
    document.querySelectorAll('.cell:not(.blocked)').forEach((cell) => {
      cell.addEventListener('click', (e) => this.handleCellClick(e));
      const input = cell.querySelector('input');
      input.addEventListener('keydown', (e) => this.handleKeyPress(e));
      input.addEventListener('input', (e) => this.handleInput(e));
    });

    document.querySelectorAll('.clues-section li').forEach((clue) => {
      clue.addEventListener('click', () => this.handleClueClick(clue));
    });

    document
      .getElementById('resetBtn')
      .addEventListener('click', () => this.resetPuzzle());
    document
      .getElementById('hintBtn')
      .addEventListener('click', () => this.showHint());
    document
      .getElementById('checkBtn')
      .addEventListener('click', () => this.checkAnswers());
  }

  handleCellClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;

    if (this.selectedCell === cell) {
      this.direction = this.direction === 'across' ? 'down' : 'across';
    }

    this.selectCell(cell);
  }

  selectCell(cell) {
    document
      .querySelectorAll('.cell')
      .forEach((c) => c.classList.remove('selected'));
    cell.classList.add('selected');
    this.selectedCell = cell;
    cell.querySelector('input').focus();
  }

  handleKeyPress(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    switch (e.key) {
      case 'ArrowRight':
        this.direction = 'across';
        this.moveSelection(row, col + 1);
        break;
      case 'ArrowLeft':
        this.direction = 'across';
        this.moveSelection(row, col - 1);
        break;
      case 'ArrowDown':
        this.direction = 'down';
        this.moveSelection(row + 1, col);
        break;
      case 'ArrowUp':
        this.direction = 'down';
        this.moveSelection(row - 1, col);
        break;
      case 'Backspace':
        if (!e.target.value) {
          if (this.direction === 'across') this.moveSelection(row, col - 1);
          else this.moveSelection(row - 1, col);
        }
        break;
    }
  }

  handleInput(e) {
    const input = e.target;
    const cell = input.closest('.cell');
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    input.value = input.value.toUpperCase();

    if (input.value) {
      if (this.direction === 'across') this.moveSelection(row, col + 1);
      else this.moveSelection(row + 1, col);
    }
  }

  moveSelection(row, col) {
    const nextCell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );
    if (nextCell && !nextCell.classList.contains('blocked')) {
      this.selectCell(nextCell);
    }
  }

  handleClueClick(clue) {
    const number = parseInt(clue.dataset.number);
    const direction = clue.dataset.direction;
    this.direction = direction;

    document
      .querySelectorAll('.clues-section li')
      .forEach((c) => c.classList.remove('active'));
    clue.classList.add('active');

    const startCell = this.findStartCell(number, direction);
    if (startCell) {
      this.selectCell(startCell);
    }
  }

  findStartCell(number, direction) {
    let cellNumber = 1;
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] !== '*' && this.shouldNumberCell(i, j)) {
          if (cellNumber === number) {
            return document.querySelector(
              `.cell[data-row="${i}"][data-col="${j}"]`
            );
          }
          cellNumber++;
        }
      }
    }
    return null;
  }

  resetPuzzle() {
    document.querySelectorAll('.cell input').forEach((input) => {
      input.value = '';
    });
    document.querySelectorAll('.cell').forEach((cell) => {
      cell.classList.remove('correct');
    });
  }

  showHint() {
    if (!this.selectedCell) return;

    const row = parseInt(this.selectedCell.dataset.row);
    const col = parseInt(this.selectedCell.dataset.col);
    const input = this.selectedCell.querySelector('input');

    input.value = this.grid[row][col];
    input.classList.add('correct');
  }

  checkAnswers() {
    document.querySelectorAll('.cell:not(.blocked)').forEach((cell) => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const input = cell.querySelector('input');

      if (input.value === this.grid[row][col]) {
        cell.classList.add('correct');
      } else {
        cell.classList.remove('correct');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Crossword();
});