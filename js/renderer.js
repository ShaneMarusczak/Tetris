/**
 * DOM rendering and manipulation
 */

import { BOARD, COLORS, getPiece } from './config.js';
import { getCellId, parseId } from './utils.js';

// Cached DOM elements
let gameBoardContainer = null;
let nextPieceContainer = null;
let heldPieceContainer = null;
let pointsDisplay = null;
let highPointsDisplay = null;

/**
 * Initialize renderer with DOM references
 */
export function initRenderer() {
  gameBoardContainer = document.getElementById('gameBoard');
  nextPieceContainer = document.getElementById('nextPiece');
  heldPieceContainer = document.getElementById('heldPiece');
  pointsDisplay = document.getElementById('points');
  highPointsDisplay = document.getElementById('highPoints');
}

/**
 * Get a cell element by position
 * @param {number} col - Column
 * @param {number} row - Row
 * @returns {HTMLElement|null} The cell element
 */
export function getCell(col, row) {
  return document.getElementById(getCellId(col, row));
}

/**
 * Get all cells with the 'moving' class
 * @returns {HTMLElement[]} Array of moving cells
 */
export function getMovingCells() {
  return Array.from(document.querySelectorAll('.moving'));
}

/**
 * Add color and moving class to a cell
 * @param {number} col - Column
 * @param {number} row - Row
 * @param {string} color - Color class to add
 */
export function addColorAndMovingClass(col, row, color) {
  const cell = getCell(col, row);
  if (cell) {
    cell.classList.add('moving', color);
  }
}

/**
 * Remove all color classes from an element
 * @param {HTMLElement} elem - Element to clear colors from
 * @returns {string|null} The color that was removed, if any
 */
export function removeColors(elem) {
  if (!elem) return null;

  for (const color of COLORS) {
    if (elem.classList.contains(color)) {
      elem.classList.remove(color);
      return color;
    }
  }
  return null;
}

/**
 * Get the color class from an element
 * @param {HTMLElement} elem - Element to check
 * @returns {string|null} The color class or null
 */
export function getColor(elem) {
  if (!elem) return null;

  for (const color of COLORS) {
    if (elem.classList.contains(color)) {
      return color;
    }
  }
  return null;
}

/**
 * Copy color from one element to another and optionally remove from source
 * @param {HTMLElement} fromElem - Source element
 * @param {HTMLElement} toElem - Target element
 * @param {string} classToCheck - If source has this class, don't remove color
 */
export function copyAndRemoveColor(fromElem, toElem, classToCheck) {
  if (!fromElem || !toElem) return;

  const color = getColor(fromElem);
  if (color) {
    toElem.classList.add(color);
    if (!fromElem.classList.contains(classToCheck)) {
      fromElem.classList.remove(color);
    }
  }
}

/**
 * Remove color from current cell and return color of cell above
 * @param {number} col - Column
 * @param {number} row - Row
 * @returns {string|null} Color of cell above
 */
export function removeAndGetColorAbove(col, row) {
  const cell = getCell(col, row);
  const cellAbove = getCell(col, row - 1);

  removeColors(cell);
  return getColor(cellAbove);
}

/**
 * Build the main game board DOM structure
 * @returns {number[][]} Initial empty game grid
 */
export function buildGameBoard() {
  if (!gameBoardContainer) {
    console.error('Game board container not found');
    return [];
  }

  const gameGrid = [];

  for (let col = 0; col < BOARD.columns; col++) {
    const colDiv = document.createElement('div');
    colDiv.id = 'col-' + col;
    colDiv.classList.add('col');
    gameBoardContainer.appendChild(colDiv);
    gameGrid.push([]);

    for (let row = 0; row < BOARD.rows; row++) {
      const cell = document.createElement('div');
      cell.id = getCellId(col, row);
      cell.classList.add('cell');
      colDiv.appendChild(cell);
      gameGrid[col].push(0);

      const flash = document.createElement('div');
      flash.id = 'f' + getCellId(col, row);
      flash.classList.add('flash');
      cell.appendChild(flash);
    }
  }

  return gameGrid;
}

/**
 * Build a mini board (for next/held piece display)
 * @param {HTMLElement} container - Container element
 * @param {string} suffix - ID suffix ('-n' for next, '-h' for held)
 */
export function buildMiniBoard(container, suffix) {
  if (!container) {
    console.error('Mini board container not found');
    return;
  }

  for (let col = 0; col < 4; col++) {
    const colDiv = document.createElement('div');
    colDiv.id = 'col-' + col + suffix;
    colDiv.classList.add('col');
    container.appendChild(colDiv);

    for (let row = 0; row < 4; row++) {
      const cell = document.createElement('div');
      cell.id = getCellId(col, row) + suffix;
      cell.classList.add('cell');
      colDiv.appendChild(cell);
    }
  }
}

/**
 * Clear all colors from a mini board
 * @param {string} containerId - Container element ID
 */
export function clearMiniBoard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  Array.from(container.children).forEach((col) => {
    Array.from(col.children).forEach((cell) => removeColors(cell));
  });
}

/**
 * Draw a piece on the mini board
 * @param {string} pieceId - Piece ID ('st', 'sq', etc.)
 * @param {string} suffix - ID suffix ('-n' for next, '-h' for held)
 */
export function drawMiniPiece(pieceId, suffix) {
  const piece = getPiece(pieceId);
  if (!piece) return;

  const cells = piece.miniCells(piece.miniOffset);
  cells.forEach(([col, row]) => {
    const cell = document.getElementById(getCellId(col, row) + suffix);
    if (cell) {
      cell.classList.add(piece.color);
    }
  });
}

/**
 * Update the points display
 * @param {number} points - Current points
 */
export function updatePointsDisplay(points) {
  if (pointsDisplay) {
    pointsDisplay.textContent = points;
  }
}

/**
 * Update the high score display
 * @param {number|string} highScore - High score value
 */
export function updateHighScoreDisplay(highScore) {
  if (highPointsDisplay) {
    highPointsDisplay.textContent = highScore > 0 ? highScore : ' No High Score';
  }
}

/**
 * Clear the ghost piece highlight
 */
export function clearDropHighlight() {
  document.querySelectorAll('.flashOn').forEach((elem) => {
    elem.classList.remove('flashOn');
  });
}

/**
 * Highlight where the piece will land
 * @param {number[][]} locations - Array of [col, row] positions
 */
export function highlightDropLocations(locations) {
  clearDropHighlight();
  locations.forEach(([col, row]) => {
    const cell = getCell(col, row);
    if (cell && cell.firstChild) {
      cell.firstChild.classList.add('flashOn');
    }
  });
}

/**
 * Toggle the controls list visibility
 */
export function toggleControlList() {
  const list = document.getElementById('ctrlList');
  const btn = document.getElementById('hideBtn');

  if (!list || !btn) return;

  if (list.classList.contains('hidden')) {
    list.classList.remove('hidden');
    btn.textContent = 'Hide';
  } else {
    list.classList.add('hidden');
    btn.textContent = 'Show';
  }
}

/**
 * Get position data from moving cells
 * @returns {Array<{col: number, row: number, element: HTMLElement}>}
 */
export function getMovingCellsData() {
  return getMovingCells().map((elem) => {
    const [col, row] = parseId(elem.id);
    return { col, row, element: elem };
  });
}
