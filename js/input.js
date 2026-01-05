/**
 * Input handling
 */

import { getState, speedUpDrop, resetSpeed } from './state.js';
import { movePieceHorizontal, rotate, quickDrop, holdPiece } from './pieces.js';
import { toggleControlList } from './renderer.js';

/**
 * Handle player keyboard input
 * @param {KeyboardEvent} event - Keyboard event
 */
export function handlePlayerInput(event) {
  const key = event.key;

  switch (key) {
    case 'ArrowLeft':
      if (getState('canMoveHorizontal') && getState('fallingMode')) {
        movePieceHorizontal(-1);
      }
      break;

    case 'ArrowRight':
      if (getState('canMoveHorizontal') && getState('fallingMode')) {
        movePieceHorizontal(1);
      }
      break;

    case ' ':
      if (getState('fallingMode')) {
        speedUpDrop();
      }
      break;

    case 'r':
    case 'R':
    case 'ArrowUp':
      if (getState('fallingMode') && getState('fallingPiece') !== 'sq') {
        rotate();
      }
      break;

    case 'h':
    case 'H':
      if (getState('fallingMode')) {
        holdPiece();
      }
      break;

    case 'ArrowDown':
      if (getState('fallingMode')) {
        quickDrop();
      }
      break;
  }
}

/**
 * Handle key up events (reset speed after space release)
 * @param {KeyboardEvent} event - Keyboard event
 */
export function handleKeyUp(event) {
  if (event.key === ' ') {
    resetSpeed();
  }
}

/**
 * Prevent default behavior for game keys
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {boolean} False to prevent default
 */
export function preventScrollOnGameKeys(event) {
  const gameKeys = [' ', 'ArrowUp', 'ArrowDown'];
  if (gameKeys.includes(event.key) && event.target === document.body) {
    return false;
  }
  return true;
}

/**
 * Setup all event listeners
 * @param {Function} gameStartHandler - Function to call when start button is clicked
 */
export function setupEventListeners(gameStartHandler) {
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', gameStartHandler);
  }

  const hideBtn = document.getElementById('hideBtn');
  if (hideBtn) {
    hideBtn.addEventListener('click', toggleControlList);
  }

  document.addEventListener('keydown', handlePlayerInput);
  document.addEventListener('keyup', handleKeyUp);
  window.onkeydown = preventScrollOnGameKeys;
}
