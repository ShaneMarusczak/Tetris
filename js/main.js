/**
 * Main entry point - initializes the game
 */

import { BOARD } from './config.js';
import { initGrid, setState } from './state.js';
import {
  initRenderer,
  buildGameBoard,
  buildMiniBoard,
  updatePointsDisplay,
  updateHighScoreDisplay,
} from './renderer.js';
import { setupEventListeners } from './input.js';
import { startGame, initializeGame } from './game.js';
import { getCookie, randomIntFromInterval } from './utils.js';

/**
 * Initialize the application
 */
function init() {
  // Initialize renderer with DOM references
  initRenderer();

  // Build the game board
  buildGameBoard();

  // Build mini boards for next/held piece
  const nextPieceContainer = document.getElementById('nextPiece');
  const heldPieceContainer = document.getElementById('heldPiece');

  if (nextPieceContainer) {
    buildMiniBoard(nextPieceContainer, '-n');
  }

  if (heldPieceContainer) {
    buildMiniBoard(heldPieceContainer, '-h');
  }

  // Load high score from cookie
  const highScoreOnLoad = Number(getCookie('tetrisHighScore')) || 0;

  // Initialize game state
  initializeGame(highScoreOnLoad);

  // Setup event listeners
  setupEventListeners(startGame);

  // Update displays
  updatePointsDisplay(0);
  updateHighScoreDisplay(highScoreOnLoad);
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
