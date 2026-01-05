/**
 * Piece management - drawing, rotating, moving
 */

import { BOARD, CELL_STATE, getPiece, PIECE_IDS } from './config.js';
import {
  getState,
  setState,
  getCellState,
  setCellState,
  incrementRotation,
} from './state.js';
import {
  getCell,
  getMovingCells,
  addColorAndMovingClass,
  removeColors,
  copyAndRemoveColor,
  clearMiniBoard,
  drawMiniPiece,
  clearDropHighlight,
  highlightDropLocations,
  getMovingCellsData,
} from './renderer.js';
import { getCellId, parseId, randomIntFromInterval } from './utils.js';
import {
  checkCellsInvalid,
  canMove,
  calculateLandingPositions,
  positionsOverlap,
} from './board.js';

/**
 * Draw a piece on the main board
 * @param {string} pieceId - Piece ID to draw
 */
export function drawPieceOnBoard(pieceId) {
  const piece = getPiece(pieceId);
  if (!piece) return;

  const cells = piece.cells(BOARD.spawnColumn);
  cells.forEach(([col, row]) => {
    addColorAndMovingClass(col, row, piece.color);
    setCellState(col, row, CELL_STATE.falling);
  });

  setState('fallingPiece', piece.id);
}

/**
 * Get the next piece to draw
 * @returns {number} Index of next piece
 */
export function getNextPiece() {
  const currentNext = getState('nextPieceIndex');
  let newNext;

  do {
    newNext = randomIntFromInterval(0, 6);
  } while (newNext === currentNext);

  setState('nextPieceIndex', newNext);
  showNextPiece();

  return currentNext;
}

/**
 * Show the next piece preview
 */
export function showNextPiece() {
  clearMiniBoard('nextPiece');
  const nextIndex = getState('nextPieceIndex');
  const pieceId = PIECE_IDS[nextIndex];
  drawMiniPiece(pieceId, '-n');
}

/**
 * Show the held piece preview
 */
export function showHeldPiece() {
  clearMiniBoard('heldPiece');
  const heldId = getState('heldPiece');
  if (heldId) {
    drawMiniPiece(heldId, '-h');
  }
}

/**
 * Clear the currently moving piece from the board
 */
export function clearMovingPiece() {
  const movingCells = getMovingCells();
  movingCells.forEach((cell) => {
    const [col, row] = parseId(cell.id);
    removeColors(cell);
    cell.classList.remove('moving');
    setCellState(col, row, CELL_STATE.empty);
  });
}

/**
 * Rotate the current falling piece
 * @returns {boolean} True if rotation succeeded
 */
export function rotate() {
  const fallingPiece = getState('fallingPiece');

  // Square doesn't rotate
  if (fallingPiece === 'sq') {
    return false;
  }

  const piece = getPiece(fallingPiece);
  if (!piece || !piece.rotations) {
    return false;
  }

  const movingCells = getMovingCells();
  const locations = [];

  // Collect current positions and clear them
  movingCells.forEach((cell) => {
    const [col, row] = parseId(cell.id);
    cell.classList.remove('moving');
    setCellState(col, row, CELL_STATE.empty);
    locations.push([col, row]);
    removeColors(cell);
  });

  // Calculate new positions using rotation data
  const rotationState = getState('rotationState');
  const rotationDeltas = piece.rotations[rotationState];
  const newCells = locations.map(([col, row], index) => {
    const [deltaCol, deltaRow] = rotationDeltas[index];
    return [col + deltaCol, row + deltaRow];
  });

  // Check if rotation is valid
  if (checkCellsInvalid(newCells)) {
    // Revert to original positions
    locations.forEach(([col, row]) => {
      addColorAndMovingClass(col, row, piece.color);
      setCellState(col, row, CELL_STATE.falling);
    });
    return false;
  }

  // Apply rotation
  incrementRotation();
  newCells.forEach(([col, row]) => {
    addColorAndMovingClass(col, row, piece.color);
    setCellState(col, row, CELL_STATE.falling);
  });

  highlightStopCells();
  return true;
}

/**
 * Move piece horizontally
 * @param {number} direction - -1 for left, 1 for right
 * @returns {boolean} True if move succeeded
 */
export function movePieceHorizontal(direction) {
  const movingCells = getMovingCells();
  const locations = [];

  // Check for board edge
  for (const cell of movingCells) {
    const col = Number(cell.id.charAt(0));
    if (direction === -1 && col === 0) return false;
    if (direction === 1 && col === BOARD.columns - 1) return false;
  }

  // Check for collision with placed pieces
  for (const cell of movingCells) {
    const [col, row] = parseId(cell.id);
    if (getCellState(col + direction, row) === CELL_STATE.placed) {
      return false;
    }
  }

  // Collect positions and clear
  movingCells.forEach((cell) => {
    const [col, row] = parseId(cell.id);
    cell.classList.remove('moving');
    setCellState(col, row, CELL_STATE.empty);
    locations.push([col, row]);
  });

  // Move to new positions
  locations.forEach(([col, row]) => {
    const newCell = getCell(col + direction, row);
    if (newCell) {
      newCell.classList.add('moving');
      copyAndRemoveColor(getCell(col, row), newCell, 'moving');
      setCellState(col + direction, row, CELL_STATE.falling);
    }
  });

  highlightStopCells();
  return true;
}

/**
 * Move piece down one row
 * @returns {boolean} True if piece moved, false if it should be placed
 */
export function movePieceDown() {
  const movingCells = getMovingCells();

  // Check if piece should stop
  for (const cell of movingCells) {
    const [col, row] = parseId(cell.id);
    if (row === BOARD.rows - 1 || getCellState(col, row + 1) === CELL_STATE.placed) {
      return false;
    }
  }

  const locations = [];

  // Collect positions and clear
  movingCells.forEach((cell) => {
    const [col, row] = parseId(cell.id);
    cell.classList.remove('moving');
    setCellState(col, row, CELL_STATE.empty);
    locations.push([col, row]);
  });

  // Move down
  locations.forEach(([col, row]) => {
    const newCell = getCell(col, row + 1);
    if (newCell) {
      newCell.classList.add('moving');
      setCellState(col, row + 1, CELL_STATE.falling);
      copyAndRemoveColor(getCell(col, row), newCell, 'moving');
    }
  });

  highlightStopCells();
  return true;
}

/**
 * Quick drop - instantly move piece to bottom
 */
export function quickDrop() {
  clearDropHighlight();

  const movingCells = getMovingCells();
  const locations = movingCells.map((cell) => {
    const [col, row] = parseId(cell.id);
    return [col, row];
  });

  // Calculate landing position
  while (canMove(locations)) {
    locations.forEach((loc) => {
      loc[1] = loc[1] + 1;
    });
  }

  // Get current piece color
  const fallingPiece = getState('fallingPiece');
  const piece = getPiece(fallingPiece);

  // Clear current position
  clearMovingPiece();

  // Draw at new position
  locations.forEach(([col, row]) => {
    const cell = getCell(col, row);
    if (cell) {
      cell.classList.add('moving');
      setCellState(col, row, CELL_STATE.falling);
      if (piece) {
        cell.classList.add(piece.color);
      }
    }
  });

  setState('canMoveHorizontal', false);
}

/**
 * Place the current piece (convert from falling to placed)
 */
export function placePiece() {
  const movingCells = getMovingCells();
  movingCells.forEach((cell) => {
    cell.classList.remove('moving');
    cell.classList.add('placed');
    const [col, row] = parseId(cell.id);
    setCellState(col, row, CELL_STATE.placed);
  });
}

/**
 * Highlight where the piece will land (ghost piece)
 */
export function highlightStopCells() {
  if (!getState('fallingMode')) return;

  const movingCells = getMovingCells();
  const currentPositions = movingCells.map((cell) => {
    const [col, row] = parseId(cell.id);
    return [col, row];
  });

  const landingPositions = calculateLandingPositions(currentPositions);

  // Don't show ghost if it overlaps with current piece
  if (positionsOverlap(currentPositions, landingPositions)) {
    clearDropHighlight();
    return;
  }

  highlightDropLocations(landingPositions);
}

/**
 * Draw the next piece from the queue (used when holding with no held piece)
 */
function drawNextFromQueue() {
  const pieceIndex = getNextPiece();
  const pieceId = PIECE_IDS[pieceIndex];
  drawPieceOnBoard(pieceId);
  highlightStopCells();
}

/**
 * Hold the current piece
 * Draws a new piece immediately (either from queue or swapped from hold)
 */
export function holdPiece() {
  if (!getState('canHoldPiece')) {
    return;
  }

  setState('canHoldPiece', false);
  clearMovingPiece();
  clearDropHighlight();

  const currentPiece = getState('fallingPiece');
  const heldPiece = getState('heldPiece');

  if (!heldPiece) {
    // No held piece - store current and draw next from queue
    setState('heldPiece', currentPiece);
    showHeldPiece();
    drawNextFromQueue();
  } else {
    // Swap with held piece
    setState('heldPiece', currentPiece);
    drawPieceOnBoard(heldPiece);
    showHeldPiece();
    highlightStopCells();
  }
}
