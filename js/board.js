/**
 * Game board logic
 */

import { BOARD, CELL_STATE, SCORING, getPiece, PIECE_IDS } from './config.js';
import { getCellState, setCellState, getGrid, getState, setState } from './state.js';
import {
  getCell,
  getMovingCells,
  removeColors,
  removeAndGetColorAbove,
  updatePointsDisplay,
  getMovingCellsData,
} from './renderer.js';
import { getCellId, parseId } from './utils.js';

/**
 * Check if any cells in the array are invalid positions
 * @param {number[][]} cells - Array of [col, row] positions
 * @returns {boolean} True if any position is invalid
 */
export function checkCellsInvalid(cells) {
  return cells.some(([col, row]) => {
    // Out of bounds
    if (col < 0 || col > BOARD.columns - 1 || row < 0 || row > BOARD.rows - 1) {
      return true;
    }
    // Already occupied by placed piece
    return getCellState(col, row) !== CELL_STATE.empty;
  });
}

/**
 * Check if a piece can move to new positions
 * @param {number[][]} locations - Array of [col, row] positions
 * @returns {boolean} True if the piece can move there
 */
export function canMove(locations) {
  for (const [col, row] of locations) {
    if (row >= BOARD.rows - 1 || getCellState(col, row + 1) === CELL_STATE.placed) {
      return false;
    }
  }
  return true;
}

/**
 * Check if the current falling piece cannot move down
 * @param {HTMLElement[]} movingCells - Array of moving cell elements
 * @returns {boolean} True if piece cannot move down
 */
export function checkCannotMoveDown(movingCells) {
  for (const cell of movingCells) {
    const [col, row] = parseId(cell.id);
    if (row === BOARD.rows - 1 || getCellState(col, row + 1) === CELL_STATE.placed) {
      return true;
    }
  }
  return false;
}

/**
 * Check for game over condition
 * @param {number|string} pieceToCheck - Piece index or ID
 * @returns {boolean} True if game is over
 */
export function checkGameOver(pieceToCheck) {
  const piece = getPiece(pieceToCheck);
  if (!piece) return true;

  const cells = piece.gameOverCells(BOARD.spawnColumn);
  return cells.some(([col, row]) => getCellState(col, row) !== CELL_STATE.empty);
}

/**
 * Check and clear completed rows
 * @returns {number} Number of rows cleared
 */
export function checkRows() {
  let rowsCleared = 0;

  for (let row = BOARD.rows - 1; row >= 0; row--) {
    let rowCounter = 0;

    for (let col = 0; col < BOARD.columns; col++) {
      if (getCellState(col, row) === CELL_STATE.placed) {
        rowCounter++;
      }
    }

    if (rowCounter === BOARD.columns) {
      clearRow(row);
      shiftBoardDown(row);
      row++; // Check this row again after shift
      rowsCleared++;
    }
  }

  if (rowsCleared > 0) {
    givePoints(rowsCleared);
  }

  return rowsCleared;
}

/**
 * Clear a single row
 * @param {number} row - Row to clear
 */
function clearRow(row) {
  for (let col = 0; col < BOARD.columns; col++) {
    setCellState(col, row, CELL_STATE.empty);
    const cell = getCell(col, row);
    if (cell) {
      cell.classList.remove('placed');
      removeColors(cell);
    }
  }
}

/**
 * Shift all rows above the cleared row down
 * @param {number} clearedRow - The row that was cleared
 */
function shiftBoardDown(clearedRow) {
  for (let row = BOARD.rows - 1; row >= 0; row--) {
    for (let col = 0; col < BOARD.columns; col++) {
      if (row > clearedRow) {
        // Below cleared row - do nothing
        continue;
      } else if (row <= clearedRow && row !== 0) {
        // At or above cleared row - shift down
        const cell = getCell(col, row);
        if (cell) {
          cell.classList.remove('placed');
        }

        const newState = getCellState(col, row - 1);
        setCellState(col, row, newState);
        const color = removeAndGetColorAbove(col, row);

        if (newState === CELL_STATE.placed) {
          if (cell) {
            cell.classList.add('placed');
            if (color) {
              cell.classList.add(color);
            }
          }
        }
      } else {
        // Top row - clear
        const cell = getCell(col, row);
        if (cell) {
          cell.classList.remove('placed');
          removeColors(cell);
        }
        setCellState(col, row, CELL_STATE.empty);
      }
    }
  }
}

/**
 * Award points based on rows cleared
 * @param {number} rowsCleared - Number of rows cleared
 */
function givePoints(rowsCleared) {
  const pointsToAdd = SCORING[rowsCleared] || 0;
  const currentPoints = getState('points');
  const newPoints = currentPoints + pointsToAdd;
  setState('points', newPoints);
  updatePointsDisplay(newPoints);
}

/**
 * Calculate where the piece will land (for ghost piece)
 * @param {number[][]} locations - Current piece positions
 * @returns {number[][]} Landing positions
 */
export function calculateLandingPositions(locations) {
  const landingPositions = locations.map(([col, row]) => [col, row]);

  while (canMove(landingPositions)) {
    landingPositions.forEach((loc) => {
      loc[1] = loc[1] + 1;
    });
  }

  return landingPositions;
}

/**
 * Check if ghost positions overlap with current positions
 * @param {number[][]} current - Current piece positions
 * @param {number[][]} ghost - Ghost piece positions
 * @returns {boolean} True if they overlap
 */
export function positionsOverlap(current, ghost) {
  for (const [col1, row1] of current) {
    for (const [col2, row2] of ghost) {
      if (col1 === col2 && row1 === row2) {
        return true;
      }
    }
  }
  return false;
}
