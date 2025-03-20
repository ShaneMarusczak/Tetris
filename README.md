# Tetris

Tetris is a classic implementation of the popular falling block game using plain HTML, CSS, and JavaScript. The project offers two versions of the JavaScript logic (minified and full) and includes a responsive, retro-inspired design utilizing the "Roboto Mono" font. Players can control falling pieces, rotate, hold, and drop them, while their score is shown along with hiscore persistence via browser cookies.

---

## Table of Contents

1. [Installation](#installation)
2. [Usage Guide](#usage-guide)
3. [File and Structure Overview](#file-and-structure-overview)
4. [Configuration Details](#configuration-details)
5. [Contribution Guidelines](#contribution-guidelines)
6. [License](#license)

---

## Installation

1. Clone the repository or download the source code.
2. Ensure that you have a modern web browser installed.
3. (Optional) Run a local server for better performance:
   • Using Python 3:  
     • In the project folder, run:  
       `python -m http.server 8000`
4. Navigate to the `/web_games/Tetris/` folder and open `index.html` in your browser.

_No additional dependencies are required._

---

## Usage Guide

- **Start the Game:**  
  Click the "Start" button on the page to begin a new game.

- **Controls:**  
  A control list is available and can be toggled via the "Show/Hide" button. The primary controls include:
  • **Left/Right Arrows:** Move the piece sideways.  
  • **Up Arrow or R:** Rotate the falling piece (except for the square ones).  
  • **H:** Hold the current piece, allowing you to swap it with a previously held piece.  
  • **Space Bar:** Temporarily speed up the piece drop.  
  • **Down Arrow:** Instantly drop the piece to the bottom.

- **Scoring:**  
  Your current score and high score (stored via cookies) are displayed in the header. Clearing rows awards increasing points according to classic Tetris rules.

- **Game Over:**  
  When no valid moves remain, a modal window displays "Game Over!" and the high score is updated if needed.

---

## File and Structure Overview

- **index.html:**  
  Entry point for the game. Contains the game layout with the main board, next and held piece previews, header, and footer. It links to the CSS styles and JavaScript files.

- **css folder:**  
  • `style.css` – Main stylesheet written in an unminified format for clarity.  
  • `style.min.css` – Minified version of the main stylesheet for performance.

- **js folder:**  
  • `tetris.js` – Full (readable) JavaScript code containing the game mechanics such as piece drawing, rotation, movement, and collision detection.  
  • `tetris.min.js` – Minified JavaScript file offering the same functionality in a compact form.

- **Images and Icons:**  
  Located under the `images` folder (if provided) for the home icon, GitHub icon, and favicon.

---

## Configuration Details

- **CSS Variables:**  
  The CSS files define variables such as cell dimensions, button size, and colors. For example:  
  • `--cell-height` and `--cell-width` set the dimensions for the game cells.  
  • `--my-grey` is used as the background for inactive or empty cells.

- **Game Settings (tetris.js):**  
  A `dimensions` object in the JavaScript holds key settings:
  • `rows` (20) and `columns` (10) define the board grid.
  • `clockSpeed` governs the initial speed of falling pieces; it dynamically decreases as more pieces fall.
  • `pieceSize` is used to determine sizes for each tetrimino block.
  
- **High Score Persistence:**  
  The game saves a high score using browser cookies (e.g., `tetrisHighScore`) which are updated after a successful session.

---

## Contribution Guidelines

Contributions are welcome! If you’d like to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your improvements or bug fixes.
4. Submit a pull request detailing your changes.

_For more detailed information, please refer to a [CONTRIBUTING.md](CONTRIBUTING.md) file if available._

---

## License

This project is released under the terms stated in the [LICENSE](LICENSE) file. Please review the file for detailed licensing information.

---

Enjoy playing Tetris and happy coding!
