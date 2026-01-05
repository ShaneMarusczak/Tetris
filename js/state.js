/**
 * Game state management
 */

import { SPEED, BOARD, CELL_STATE } from './config.js';

// Game state object
const state = {
  // Speed
  clockSpeed: SPEED.initial,
  storedClockSpeed: SPEED.initial,

  // Game status
  gameStarted: false,
  gameOver: false,

  // Game modes (state machine)
  drawingMode: false,
  fallingMode: false,
  placingMode: false,

  // Current piece
  fallingPiece: null,
  rotationState: 1,

  // Hold feature
  heldPiece: null,
  canHoldPiece: true,

  // Movement
  canMoveHorizontal: true,

  // Score and progression
  points: 0,
  piecesDrawn: 0,
  nextPieceIndex: null,

  // High score (loaded from cookie)
  highScoreOnLoad: 0,
};

// Game grid (2D array)
let gameGrid = [];

/**
 * Initialize the game grid
 */
export function initGrid() {
  gameGrid = [];
  for (let col = 0; col < BOARD.columns; col++) {
    gameGrid.push([]);
    for (let row = 0; row < BOARD.rows; row++) {
      gameGrid[col].push(CELL_STATE.empty);
    }
  }
}

/**
 * Get the game grid
 * @returns {number[][]} The game grid
 */
export function getGrid() {
  return gameGrid;
}

/**
 * Get cell state at position
 * @param {number} col - Column
 * @param {number} row - Row
 * @returns {number} Cell state
 */
export function getCellState(col, row) {
  if (col < 0 || col >= BOARD.columns || row < 0 || row >= BOARD.rows) {
    return -1; // Out of bounds
  }
  return gameGrid[col][row];
}

/**
 * Set cell state at position
 * @param {number} col - Column
 * @param {number} row - Row
 * @param {number} value - New state value
 */
export function setCellState(col, row, value) {
  if (col >= 0 && col < BOARD.columns && row >= 0 && row < BOARD.rows) {
    gameGrid[col][row] = value;
  }
}

/**
 * Get a state value
 * @param {string} key - State key
 * @returns {*} State value
 */
export function getState(key) {
  return state[key];
}

/**
 * Set a state value
 * @param {string} key - State key
 * @param {*} value - New value
 */
export function setState(key, value) {
  if (key in state) {
    state[key] = value;
  }
}

/**
 * Reset game state for a new game
 */
export function resetState() {
  state.clockSpeed = SPEED.initial;
  state.storedClockSpeed = SPEED.initial;
  state.gameStarted = false;
  state.gameOver = false;
  state.drawingMode = false;
  state.fallingMode = false;
  state.placingMode = false;
  state.fallingPiece = null;
  state.rotationState = 1;
  state.heldPiece = null;
  state.canHoldPiece = true;
  state.canMoveHorizontal = true;
  state.points = 0;
  state.piecesDrawn = 0;
  initGrid();
}

/**
 * Update clock speed based on pieces drawn
 */
export function updateSpeed() {
  for (const threshold of SPEED.thresholds) {
    if (state.piecesDrawn === threshold.pieces) {
      state.storedClockSpeed = threshold.speed;
      state.clockSpeed = threshold.speed;
      break;
    }
  }
}

/**
 * Speed up the drop temporarily
 */
export function speedUpDrop() {
  state.clockSpeed = SPEED.drop;
}

/**
 * Reset to normal speed
 */
export function resetSpeed() {
  state.clockSpeed = state.storedClockSpeed;
}

/**
 * Increment rotation state (1-4, wraps around)
 */
export function incrementRotation() {
  state.rotationState++;
  if (state.rotationState === 5) {
    state.rotationState = 1;
  }
}

/**
 * Reset rotation state
 */
export function resetRotation() {
  state.rotationState = 1;
}

// Export the full state for debugging
export function getFullState() {
  return { ...state };
}
