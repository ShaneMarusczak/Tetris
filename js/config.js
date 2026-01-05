/**
 * Game configuration and piece definitions
 */

// Board dimensions and game settings
export const BOARD = {
  rows: 20,
  columns: 10,
  pieceSize: 4,
  spawnColumn: 2,
};

// Speed settings
export const SPEED = {
  initial: 950,
  drop: 100,
  thresholds: [
    { pieces: 20, speed: 850 },
    { pieces: 35, speed: 750 },
    { pieces: 55, speed: 600 },
    { pieces: 110, speed: 400 },
  ],
};

// Scoring values
export const SCORING = {
  1: 40,
  2: 100,
  3: 300,
  4: 1200,
};

// All available colors for pieces
export const COLORS = ['blue', 'red', 'yellow', 'green', 'cyan', 'purple', 'orange'];

// Grid cell states
export const CELL_STATE = {
  empty: 0,
  falling: 1,
  placed: 2,
};

/**
 * Piece definitions with all metadata
 * Each piece has:
 * - id: Short identifier
 * - name: Human-readable name
 * - color: CSS class for the piece color
 * - cells: Function to generate initial cell positions relative to spawn column
 * - rotations: Transformation deltas for each rotation state (1-4)
 * - gameOverCells: Cells to check for game over condition
 * - miniOffset: Column offset for mini board display
 */
export const PIECES = {
  st: {
    id: 'st',
    index: 0,
    name: 'Straight',
    color: 'cyan',
    cells: (col) => [
      [col, 0],
      [col, 1],
      [col, 2],
      [col, 3],
    ],
    rotations: {
      1: [[-1, 1], [0, 0], [1, -1], [2, -2]],
      2: [[1, -1], [0, 0], [-1, 1], [-2, 2]],
      3: [[-1, 1], [0, 0], [1, -1], [2, -2]],
      4: [[1, -1], [0, 0], [-1, 1], [-2, 2]],
    },
    gameOverCells: (col) => [[col, 0], [col, 1], [col, 2], [col, 3]],
    miniOffset: 1,
    miniCells: (col) => [[col, 0], [col, 1], [col, 2], [col, 3]],
  },
  sq: {
    id: 'sq',
    index: 1,
    name: 'Square',
    color: 'yellow',
    cells: (col) => [
      [col, 0],
      [col, 1],
      [col + 1, 0],
      [col + 1, 1],
    ],
    rotations: null, // Square doesn't rotate
    gameOverCells: (col) => [[col, 0], [col, 1], [col + 1, 0], [col + 1, 1]],
    miniOffset: 1,
    miniCells: (col) => [[col, 1], [col, 2], [col + 1, 1], [col + 1, 2]],
  },
  rl: {
    id: 'rl',
    index: 2,
    name: 'L-Piece',
    color: 'orange',
    cells: (col) => [
      [col, 0],
      [col, 1],
      [col, 2],
      [col + 1, 2],
    ],
    rotations: {
      1: [[2, 2], [1, 1], [0, 0], [-1, 1]],
      2: [[0, 0], [-1, -1], [-1, 1], [-2, 2]],
      3: [[1, -1], [0, 0], [-1, -1], [-2, -2]],
      4: [[2, -2], [1, -1], [1, 1], [0, 0]],
    },
    gameOverCells: (col) => [[col, 0], [col, 1], [col, 2], [col + 1, 2]],
    miniOffset: 1,
    miniCells: (col) => [[col, 1], [col, 2], [col, 3], [col + 1, 3]],
  },
  tt: {
    id: 'tt',
    index: 3,
    name: 'T-Piece',
    color: 'blue',
    cells: (col) => [
      [col, 0],
      [col, 1],
      [col, 2],
      [col - 1, 1],
    ],
    rotations: {
      1: [[0, 0], [0, 0], [0, 0], [1, -1]],
      2: [[1, 1], [0, 0], [0, 0], [0, 0]],
      3: [[-1, 1], [0, 0], [0, 0], [0, 0]],
      4: [[0, 0], [0, 0], [0, 0], [-1, -1]],
    },
    gameOverCells: (col) => [[col, 0], [col, 1], [col, 2], [col - 1, 1]],
    miniOffset: 2,
    miniCells: (col) => [[col, 1], [col, 2], [col, 3], [col - 1, 2]],
  },
  ml: {
    id: 'ml',
    index: 4,
    name: 'Mirrored L',
    color: 'green',
    cells: (col) => [
      [col, 0],
      [col, 1],
      [col, 2],
      [col - 1, 2],
    ],
    rotations: {
      1: [[1, -1], [2, 2], [1, 1], [0, 0]],
      2: [[1, 1], [0, 0], [-1, 1], [-2, 2]],
      3: [[0, 0], [-1, -1], [-2, -2], [-1, 1]],
      4: [[2, -2], [1, -1], [0, 0], [-1, -1]],
    },
    gameOverCells: (col) => [[col, 0], [col, 1], [col, 2], [col - 1, 2]],
    miniOffset: 2,
    miniCells: (col) => [[col, 1], [col, 2], [col, 3], [col - 1, 3]],
  },
  rz: {
    id: 'rz',
    index: 5,
    name: 'Z-Piece',
    color: 'purple',
    cells: (col) => [
      [col, 0],
      [col, 1],
      [col + 1, 1],
      [col + 1, 2],
    ],
    rotations: {
      1: [[1, 1], [0, 0], [-1, 1], [-2, 0]],
      2: [[0, -2], [0, 0], [-1, -1], [-1, 1]],
      3: [[2, 0], [1, -1], [0, 0], [-1, -1]],
      4: [[1, -1], [1, 1], [0, 0], [0, 2]],
    },
    gameOverCells: (col) => [[col, 0], [col, 1], [col + 1, 1], [col + 1, 2]],
    miniOffset: 1,
    miniCells: (col) => [[col, 1], [col, 2], [col + 1, 2], [col + 1, 3]],
  },
  mz: {
    id: 'mz',
    index: 6,
    name: 'Mirrored Z',
    color: 'red',
    cells: (col) => [
      [col, 0],
      [col, 1],
      [col - 1, 1],
      [col - 1, 2],
    ],
    rotations: {
      1: [[1, -1], [0, -2], [1, 1], [0, 0]],
      2: [[2, 0], [1, 1], [0, 0], [-1, 1]],
      3: [[0, 0], [-1, -1], [0, 2], [-1, 1]],
      4: [[1, -1], [0, 0], [-1, -1], [-2, 0]],
    },
    gameOverCells: (col) => [[col, 0], [col, 1], [col - 1, 1], [col - 1, 2]],
    miniOffset: 2,
    miniCells: (col) => [[col, 1], [col, 2], [col - 1, 2], [col - 1, 3]],
  },
};

// Array of piece IDs for random selection
export const PIECE_IDS = ['st', 'sq', 'rl', 'tt', 'ml', 'rz', 'mz'];

/**
 * Get piece by index (0-6) or ID string
 * @param {number|string} indexOrId - Piece index or ID
 * @returns {Object} Piece definition
 */
export function getPiece(indexOrId) {
  if (typeof indexOrId === 'number') {
    return PIECES[PIECE_IDS[indexOrId]];
  }
  return PIECES[indexOrId];
}
