/**
 * Main game loop and orchestration
 */

import { PIECE_IDS } from './config.js';
import {
  getState,
  setState,
  initGrid,
  updateSpeed,
  resetRotation,
} from './state.js';
import {
  drawPieceOnBoard,
  getNextPiece,
  movePieceDown,
  placePiece,
  highlightStopCells,
} from './pieces.js';
import { checkRows, checkGameOver } from './board.js';
import { updatePointsDisplay, updateHighScoreDisplay } from './renderer.js';
import { sleep, setCookie, closableModal } from './utils.js';

/**
 * Start the game
 */
export function startGame() {
  if (getState('gameOver')) return;

  setState('gameStarted', true);
  setState('drawingMode', true);
  gameClock();
}

/**
 * Handle game over
 */
function handleGameOver() {
  setState('gameOver', true);
  closableModal('Game Over!');

  const points = getState('points');
  const highScoreOnLoad = getState('highScoreOnLoad');

  if (points > highScoreOnLoad) {
    setCookie('tetrisHighScore', points, 30);
    updateHighScoreDisplay(points);
  }
}

/**
 * Draw a new piece on the board
 * @param {string|null} specificPiece - Specific piece ID to draw, or null for next random
 */
function drawPiece(specificPiece = null) {
  let pieceToDraw;

  if (specificPiece) {
    pieceToDraw = specificPiece;
  } else {
    const pieceIndex = getNextPiece();
    pieceToDraw = PIECE_IDS[pieceIndex];
  }

  // Check game over
  if (checkGameOver(pieceToDraw)) {
    handleGameOver();
    return;
  }

  drawPieceOnBoard(pieceToDraw);

  setState('drawingMode', false);
  setState('fallingMode', true);

  highlightStopCells();
}

/**
 * Main game clock - runs the game loop
 */
async function gameClock() {
  // Drawing mode - spawn new piece
  if (getState('drawingMode')) {
    drawPiece();
    setState('canHoldPiece', true);
    setState('canMoveHorizontal', true);

    // Increment pieces drawn and check for speed increase
    const piecesDrawn = getState('piecesDrawn') + 1;
    setState('piecesDrawn', piecesDrawn);
    updateSpeed();
  }
  // Falling mode - move piece down
  else if (getState('fallingMode')) {
    const moved = movePieceDown();
    if (!moved) {
      setState('fallingMode', false);
      setState('placingMode', true);
    }
    setState('canHoldPiece', false);
  }

  // Placing mode - lock piece in place
  if (getState('placingMode')) {
    placePiece();
    checkRows();
    setState('placingMode', false);
    setState('drawingMode', true);
    resetRotation();
  }

  // Wait and continue loop
  await sleep(getState('clockSpeed'));

  if (getState('gameStarted') && !getState('gameOver')) {
    gameClock();
  }
}

/**
 * Initialize game state
 * @param {number} highScore - High score loaded from cookie
 */
export function initializeGame(highScore) {
  setState('highScoreOnLoad', highScore);
  setState('nextPieceIndex', Math.floor(Math.random() * 7));
  initGrid();
}
