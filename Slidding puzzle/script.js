/** @format */

class SlidingPuzzle {
  constructor() {
    this.GRID_SIZE = 3;
    this.TILE_COUNT = this.GRID_SIZE * this.GRID_SIZE;
    this.currentImage = 0;
    this.images = [
      'img/duarte.jpg',
      'img/mella.jpg',
      'img/sanchez.jpg',
      'img/flag.png',
      'img/shield.jpg',
    ];
    this.tiles = [];
    this.isWon = false;
    this.isSuffling = false;

    this.puzzleElement = document.getElementById('puzzle');
    if (!this.puzzleElement) {
      throw new Error('No se encontro el puzzle :(');
    }
    this.setupGame();
    this.setupControls();
  }

  setupGame() {
    this.createTiles();
    this.renderTiles();
    this.shuffleTiles();
  }

  createTiles() {
    this.isWon = false;
    this.tiles = Array.from({ length: this.TILE_COUNT }, (_, i) => ({
      value: i,
      currentPosition: i,
    }));
  }

  renderTiles() {
    if (!this.puzzleElement) return;

    this.puzzleElement.innerHTML = '';
    const positions = new Array(this.TILE_COUNT).fill(null);

    this.tiles.forEach((tile) => {
      if (tile && typeof tile.currentPosition === 'number') {
        positions[tile.currentPosition] = tile;
      }
    });

    positions.forEach((tile, index) => {
      if (!tile) return;

      const tileElement = document.createElement('button');
      tileElement.className = 'tile';

      if (tile.value === this.TILE_COUNT - 1 && !this.isWon) {
        tileElement.classList.add('empty');
      } else {
        const content = document.createElement('div');
        content.className = 'tile-content';
        content.style.backgroundImage = `url(${
          this.images[this.currentImage]
        })`;
        content.style.backgroundPosition = `${
          (tile.value % this.GRID_SIZE) * 50
        }% ${Math.floor(tile.value / this.GRID_SIZE) * 50}%`;
        tileElement.appendChild(content);

        if (tile.value !== this.TILE_COUNT - 1) {
          tileElement.addEventListener('click', () => {
            if (!this.isSuffling) {
              const tileIndex = this.tiles.findIndex(
                (t) => t.value === tile.value
              );
              if (tileIndex !== -1) {
                this.moveTile(tileIndex);
              }
            }
          });
        }
      }

      this.puzzleElement.appendChild(tileElement);
    });
  }

  canMoveTile(tileIndex) {
    if (tileIndex < 0 || tileIndex >= this.tiles.length) return false;

    const emptyTile = this.tiles.find((t) => t.value === this.TILE_COUNT - 1);
    if (!emptyTile) return false;

    const tilePosition = this.tiles[tileIndex].currentPosition;
    const emptyPosition = emptyTile.currentPosition;

    const row = Math.floor(tilePosition / this.GRID_SIZE);
    const emptyRow = Math.floor(emptyPosition / this.GRID_SIZE);
    const col = tilePosition % this.GRID_SIZE;
    const emptyCol = emptyPosition % this.GRID_SIZE;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  }

  moveTile(tileIndex) {
    if (!this.canMoveTile(tileIndex)) return;

    const emptyTileIndex = this.tiles.findIndex(
      (t) => t.value === this.TILE_COUNT - 1
    );
    if (emptyTileIndex === -1) return;

    const emptyPosition = this.tiles[emptyTileIndex].currentPosition;
    const currentPosition = this.tiles[tileIndex].currentPosition;

    this.tiles[tileIndex].currentPosition = emptyPosition;
    this.tiles[emptyTileIndex].currentPosition = currentPosition;

    this.renderTiles();
    if (!this.isSuffling) {
      this.checkWin();
    }
  }

  isSolved() {
    return this.tiles.every((tile, index) => {
      if (tile.value === this.TILE_COUNT - 1) return true;
      return tile.currentPosition === tile.value;
    });
  }

  async shuffleTiles() {
    this.isSuffling = true;
    this.isWon = false;

    for (let i = 0; i < 100; i++) {
      const movableTiles = this.tiles
        .map((_, index) => index)
        .filter((index) => this.canMoveTile(index));

      if (movableTiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * movableTiles.length);
        this.moveTile(movableTiles[randomIndex]);
      }
      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    if (this.isSolved()) {
      const movableTiles = this.tiles
        .map((_, index) => index)
        .filter((index) => this.canMoveTile(index));

      if (movableTiles.length > 0) {
        this.moveTile(movableTiles[0]);
      }
    }

    this.isSuffling = false;
  }

  createConfetti() {
    const colors = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#ff00ff',
      '#00ffff',
    ];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 3 + Math.random() * 2;
      const rotation = Math.random() * 360;
      let posX = parseInt(confetti.style.left);
      let posY = 0;

      const animate = () => {
        posX += Math.cos(angle) * velocity;
        posY += Math.sin(angle) * velocity + 0.5;
        confetti.style.left = posX + 'px';
        confetti.style.top = posY + 'px';
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.opacity = '1';

        if (posY < window.innerHeight) {
          requestAnimationFrame(animate);
        } else {
          confetti.remove();
        }
      };

      animate();
    }
  }

  checkWin() {
    if (this.isSuffling) return;

    const hasWon = this.isSolved();
    if (hasWon && !this.isWon) {
      this.isWon = true;
      this.renderTiles();
      this.createConfetti();
      setTimeout(() => {
        alert('¡Felicidades! ¡Has ganado!');
      }, 100);
    }
  }

  async changeImage() {
    this.currentImage = (this.currentImage + 1) % this.images.length;
    this.createTiles();
    this.renderTiles();
    await this.shuffleTiles(); // Mezclar el puzzle después de cambiar la imagen
  }

  setupControls() {
    const shuffleButton = document.getElementById('shuffle');
    const resetButton = document.getElementById('reset');
    const changeImageButton = document.getElementById('change-image');

    if (shuffleButton) {
      shuffleButton.addEventListener('click', () => this.shuffleTiles());
    }
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        this.createTiles();
        this.renderTiles();
      });
    }
    if (changeImageButton) {
      changeImageButton.addEventListener('click', () => this.changeImage());
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SlidingPuzzle();
});
