(() => {
  let gameStarted = false;
  let gameOver = false;
  let drawingMode = false;
  let fallingMode = false;
  let placingMode = false;
  const gameBoardContainer = document.getElementById("gameBoard");
  const dimensions = {
    rows: 20,
    columns: 10,
    clockSpeed: 600,
    pieceSize: 4,
  };
  const gameGrid = [];

  const cellsMoving = () => Array.from(document.querySelectorAll(".moving"));

  const getCellId = (col, row) => col + "-" + row;

  const handlePlayerInput = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        movePieceHorizonal(-1);
        break;
      case "ArrowRight":
        movePieceHorizonal(1);
        break;
    }
  };

  const movePieceHorizonal = (dir) => {
    const locations = [];
    const movingCells = cellsMoving();
    if (dir === -1) {
      if (movingCells.some((item) => Number(item.id.charAt(0)) === 0)) {
        return;
      }
      let shouldReturn = false;
      movingCells.forEach((item) => {
        const [col, row] = getRowAndCol(item.id);
        if (gameGrid[col - 1][row] === 2) {
          shouldReturn = true;
        }
      });
      if (shouldReturn) {
        return;
      }
    }
    if (dir === 1) {
      if (
        movingCells.some(
          (item) => Number(item.id.charAt(0)) === dimensions.columns - 1
        )
      ) {
        return;
      }
      let shouldReturn = false;
      movingCells.forEach((item) => {
        const [col, row] = getRowAndCol(item.id);
        if (gameGrid[col + 1][row] === 2) {
          shouldReturn = true;
        }
      });
      if (shouldReturn) {
        return;
      }
    }
    movingCells.forEach((item) => {
      const [col, row] = getRowAndCol(item.id);
      document.getElementById(getCellId(col, row)).classList.remove("moving");
      gameGrid[col][row] = 0;
      locations.push([col, row]);
    });

    locations.forEach((loc) => {
      document
        .getElementById(getCellId(loc[0] + dir, loc[1]))
        .classList.add("moving");
      gameGrid[loc[0] + dir][loc[1]] = 1;
    });
  };

  const gameStartHandler = () => {
    gameStarted = true;
    drawingMode = true;
    gameClock();
  };

  const gameOverHandler = () => {
    gameOver = true;
  };

  const checkRows = () => {
    for (let row = dimensions.rows - 1; row >= 0; row--) {
      let rowCounter = 0;
      for (let col = 0; col < dimensions.columns; col++) {
        if (gameGrid[col][row] === 2) {
          rowCounter++;
        }
      }
      if (rowCounter === dimensions.columns) {
        clearRow(row);
        shiftBoardDown(row);
        row++;
      }
    }
  };

  const shiftBoardDown = (clearedRow) => {
    for (let row = dimensions.rows - 1; row >= 0; row--) {
      for (let col = 0; col < dimensions.columns; col++) {
        if (row > clearedRow) {
          continue;
        } else if (row <= clearedRow && row !== 0) {
          document
            .getElementById(getCellId(col, row))
            .classList.remove("placed");
          gameGrid[col][row] = gameGrid[col][row - 1];
          if (gameGrid[col][row] === 2) {
            document
              .getElementById(getCellId(col, row))
              .classList.add("placed");
          }
        } else {
          document
            .getElementById(getCellId(col, row))
            .classList.remove("placed");
          gameGrid[col][row] = 0;
        }
      }
    }
  };

  const clearRow = (row) => {
    for (let col = 0; col < dimensions.columns; col++) {
      gameGrid[col][row] = 0;
      document.getElementById(getCellId(col, row)).classList.remove("placed");
    }
  };

  const gameClock = () => {
    if (drawingMode) {
      drawPiece();
    } else if (fallingMode) {
      movePiece();
    }
    if (placingMode) {
      placePiece();
    }
    window.sleep(dimensions.clockSpeed).then(() => {
      if (gameStarted && !gameOver) {
        gameClock();
      }
    });
  };

  const drawStraightTetrimino = (col) => {
    for (let i = 0; i < dimensions.pieceSize; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      gameGrid[col][i] = 1;
    }
  };

  const drawSquareTetrimno = (col) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      gameGrid[col][i] = 1;
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document.getElementById(getCellId(col + 1, i)).classList.add("moving");
      gameGrid[col + 1][i] = 1;
    }
  };

  const drawLTetrimno = (col) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      gameGrid[col][i] = 1;
    }
    document.getElementById(getCellId(col + 1, 2)).classList.add("moving");
    gameGrid[col + 1][2] = 1;
  };

  const drawMirroredLTetrimno = (col) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      gameGrid[col][i] = 1;
    }
    document.getElementById(getCellId(col - 1, 2)).classList.add("moving");
    gameGrid[col - 1][2] = 1;
  };

  const drawTTetrimno = (col) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      gameGrid[col][i] = 1;
    }
    document.getElementById(getCellId(col - 1, 1)).classList.add("moving");
    gameGrid[col - 1][1] = 1;
  };

  const drawZTetrimino = (col) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      gameGrid[col][i] = 1;
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col + 1, i + 1))
        .classList.add("moving");
      gameGrid[col + 1][i + 1] = 1;
    }
  };

  const drawMirroredZTetrimino = (col) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      gameGrid[col][i] = 1;
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col - 1, i + 1))
        .classList.add("moving");
      gameGrid[col - 1][i + 1] = 1;
    }
  };

  const drawPiece = () => {
    const col = 2;
    const tetriminoToDraw = window.randomIntFromInterval(0, 6);
    switch (tetriminoToDraw) {
      case 0:
        drawStraightTetrimino(col);
        break;
      case 1:
        drawSquareTetrimno(col);
        break;
      case 2:
        drawLTetrimno(col);
        break;
      case 3:
        drawMirroredLTetrimno(col);
        break;
      case 4:
        drawTTetrimno(col);
        break;
      case 5:
        drawZTetrimino(col);
        break;
      case 6:
        drawMirroredZTetrimino(col);
        break;
    }

    drawingMode = false;
    fallingMode = true;
  };

  const movePiece = () => {
    const movingCells = cellsMoving();
    if (checkCanNotMove(movingCells)) {
      fallingMode = false;
      placingMode = true;
      return;
    }
    const locations = [];
    movingCells.forEach((item) => {
      const [col, row] = getRowAndCol(item.id);
      document.getElementById(getCellId(col, row)).classList.remove("moving");
      gameGrid[col][row] = 0;
      locations.push([col, row]);
    });
    locations.forEach((loc) => {
      document
        .getElementById(getCellId(loc[0], loc[1] + 1))
        .classList.add("moving");
      gameGrid[loc[0]][loc[1] + 1] = 1;
    });
  };

  const checkCanNotMove = (movingCells) => {
    let rv = false;
    movingCells.forEach((mover) => {
      const [col, row] = getRowAndCol(mover.id);
      if (row === dimensions.rows - 1 || gameGrid[col][row + 1] === 2) {
        rv = true;
      }
    });
    return rv;
  };

  const placePiece = () => {
    cellsMoving().forEach((item) => {
      item.classList.remove("moving");
      item.classList.add("placed");
      const [col, row] = getRowAndCol(item.id);
      gameGrid[col][row] = 2;
    });
    checkRows();
    placingMode = false;
    drawingMode = true;
  };

  const getRowAndCol = (id) => {
    const splitId = id.split("-");
    const col = Number(splitId[0]);
    const row = Number(splitId[1]);
    return [col, row];
  };

  (() => {
    for (let i = 0; i < dimensions.columns; i++) {
      const col = document.createElement("div");
      col.id = "col-" + i;
      col.classList.add("col");
      gameBoardContainer.appendChild(col);
      gameGrid.push([]);
      for (let j = 0; j < dimensions.rows; j++) {
        const cell = document.createElement("div");
        cell.id = i + "-" + j;
        cell.classList.add("cell");
        col.appendChild(cell);
        gameGrid[i].push(0);
      }
    }
    document
      .getElementById("startBtn")
      .addEventListener("click", gameStartHandler);
    document.addEventListener("keydown", handlePlayerInput);
  })();
})();
