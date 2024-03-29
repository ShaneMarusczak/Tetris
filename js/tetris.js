(() => {
  let storedClockSpeed = 950;
  let gameStarted = false;
  let gameOver = false;
  let drawingMode = false;
  let fallingMode = false;
  let placingMode = false;
  let fallingPiece = "";
  let fallingPieceRotationalState = 1;
  let points = 0;
  let nextTetrimino = randomIntFromInterval(0, 6);
  let heldTetrimino = "";
  let canHoldTetrimino = true;
  let canMoveHor = true;
  let peicesDrawn = 0;
  const gameBoardContainer = document.getElementById("gameBoard");
  const highScoreOnLoad = Number(getCookie("tetrisHighScore"));
  const dimensions = {
    rows: 20,
    columns: 10,
    clockSpeed: storedClockSpeed,
    pieceSize: 4,
  };
  const gameGrid = [];

  const cellsMoving = () => Array.from(document.querySelectorAll(".moving"));

  const getCellId = (col, row) => col + "-" + row;

  const handlePlayerInput = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        if (canMoveHor) {
          movePieceHorizonal(-1);
        }
        break;
      case "ArrowRight":
        if (canMoveHor) {
          movePieceHorizonal(1);
        }
        break;
      case " ":
        speedUpDrop();
        break;
      case "r":
      case "R":
      case "ArrowUp":
        if (!fallingMode || fallingPiece === "sq") {
          break;
        }
        rotate();
        break;
      case "h":
      case "H":
        holdTetrimino();
        break;
      case "ArrowDown":
        if (fallingMode) {
          quickDrop();
        }
        break;
    }
  };

  const addColorandMovingClass = (col, row, color) => {
    document.getElementById(getCellId(col, row)).classList.add("moving");
    document.getElementById(getCellId(col, row)).classList.add(color);
    gameGrid[col][row] = 1;
  };

  const checkCellsTo = (cellsTo) => {
    return cellsTo.some(
      (cell) =>
        cell[0] < 0 ||
        cell[0] > dimensions.columns - 1 ||
        cell[1] < 0 ||
        cell[1] > dimensions.rows - 1 ||
        gameGrid[cell[0]][cell[1]] !== 0
    );
  };

  const revertCells = (cells, color) => {
    cells.forEach((cell) => {
      addColorandMovingClass(cell[0], cell[1], color);
    });
  };

  const rotate = () => {
    const locations = [];
    const movingCells = cellsMoving();
    movingCells.forEach((item) => {
      const [col, row] = getRowAndCol(item.id);
      document.getElementById(getCellId(col, row)).classList.remove("moving");
      gameGrid[col][row] = 0;
      locations.push([col, row]);
      removeColors(item);
    });
    if (fallingPiece === "st") {
      const cellsTo = getStraightCells(locations);
      if (checkCellsTo(cellsTo)) {
        revertCells(locations, "cyan");
        return;
      }
      rotateCells(cellsTo, "cyan");
    } else if (fallingPiece === "tt") {
      const cellsTo = getTTCells(locations);
      if (checkCellsTo(cellsTo)) {
        revertCells(locations, "blue");
        return;
      }
      rotateCells(cellsTo, "blue");
    } else if (fallingPiece === "rl") {
      const cellsTo = getRLCells(locations);
      if (checkCellsTo(cellsTo)) {
        revertCells(locations, "orange");
        return;
      }
      rotateCells(cellsTo, "orange");
    } else if (fallingPiece === "ml") {
      const cellsTo = getMLCells(locations);
      if (checkCellsTo(cellsTo)) {
        revertCells(locations, "green");
        return;
      }
      rotateCells(cellsTo, "green");
    } else if (fallingPiece === "rz") {
      const cellsTo = getRZCells(locations);
      if (checkCellsTo(cellsTo)) {
        revertCells(locations, "purple");
        return;
      }
      rotateCells(cellsTo, "purple");
    } else if (fallingPiece === "mz") {
      const cellsTo = getMZCells(locations);
      if (checkCellsTo(cellsTo)) {
        revertCells(locations, "red");
        return;
      }
      rotateCells(cellsTo, "red");
    }
    highlightStopCells();
  };

  const rotateCells = (cellsTo, color) => {
    fallingPieceRotationalState++;
    cellsTo.forEach((item) => {
      addColorandMovingClass(item[0], item[1], color);
    });
    if (fallingPieceRotationalState === 5) {
      fallingPieceRotationalState = 1;
    }
  };

  //TODO: Unify these functions into one that takes the dirs as argument
  const getMZCells = (locs) => {
    const cells = [];
    if (fallingPieceRotationalState === 1) {
      cells.push([locs[0][0] + 1, locs[0][1] - 1]);
      cells.push([locs[1][0], locs[1][1] - 2]);
      cells.push([locs[2][0] + 1, locs[2][1] + 1]);
      cells.push([locs[3][0], locs[3][1]]);
    } else if (fallingPieceRotationalState === 2) {
      cells.push([locs[0][0] + 2, locs[0][1]]);
      cells.push([locs[1][0] + 1, locs[1][1] + 1]);
      cells.push([locs[2][0], locs[2][1]]);
      cells.push([locs[3][0] - 1, locs[3][1] + 1]);
    } else if (fallingPieceRotationalState === 3) {
      cells.push([locs[0][0], locs[0][1]]);
      cells.push([locs[1][0] - 1, locs[1][1] - 1]);
      cells.push([locs[2][0], locs[2][1] + 2]);
      cells.push([locs[3][0] - 1, locs[3][1] + 1]);
    } else if (fallingPieceRotationalState === 4) {
      cells.push([locs[0][0] + 1, locs[0][1] - 1]);
      cells.push([locs[1][0], locs[1][1]]);
      cells.push([locs[2][0] - 1, locs[2][1] - 1]);
      cells.push([locs[3][0] - 2, locs[3][1]]);
    }
    return cells;
  };

  const getRZCells = (locs) => {
    const cells = [];
    if (fallingPieceRotationalState === 1) {
      cells.push([locs[0][0] + 1, locs[0][1] + 1]);
      cells.push([locs[1][0], locs[1][1]]);
      cells.push([locs[2][0] - 1, locs[2][1] + 1]);
      cells.push([locs[3][0] - 2, locs[3][1]]);
    } else if (fallingPieceRotationalState === 2) {
      cells.push([locs[0][0], locs[0][1] - 2]);
      cells.push([locs[1][0], locs[1][1]]);
      cells.push([locs[2][0] - 1, locs[2][1] - 1]);
      cells.push([locs[3][0] - 1, locs[3][1] + 1]);
    } else if (fallingPieceRotationalState === 3) {
      cells.push([locs[0][0] + 2, locs[0][1]]);
      cells.push([locs[1][0] + 1, locs[1][1] - 1]);
      cells.push([locs[2][0], locs[2][1]]);
      cells.push([locs[3][0] - 1, locs[3][1] - 1]);
    } else if (fallingPieceRotationalState === 4) {
      cells.push([locs[0][0] + 1, locs[0][1] - 1]);
      cells.push([locs[1][0] + 1, locs[1][1] + 1]);
      cells.push([locs[2][0], locs[2][1]]);
      cells.push([locs[3][0], locs[3][1] + 2]);
    }
    return cells;
  };

  const getMLCells = (locs) => {
    const cells = [];
    if (fallingPieceRotationalState === 1) {
      cells.push([locs[0][0] + 1, locs[0][1] - 1]);
      cells.push([locs[1][0] + 2, locs[1][1] + 2]);
      cells.push([locs[2][0] + 1, locs[2][1] + 1]);
      cells.push([locs[3][0], locs[3][1]]);
    } else if (fallingPieceRotationalState === 2) {
      cells.push([locs[0][0] + 1, locs[0][1] + 1]);
      cells.push([locs[1][0], locs[1][1]]);
      cells.push([locs[2][0] - 1, locs[2][1] + 1]);
      cells.push([locs[3][0] - 2, locs[3][1] + 2]);
    } else if (fallingPieceRotationalState === 3) {
      cells.push([locs[0][0], locs[0][1]]);
      cells.push([locs[1][0] - 1, locs[1][1] - 1]);
      cells.push([locs[2][0] - 2, locs[2][1] - 2]);
      cells.push([locs[3][0] - 1, locs[3][1] + 1]);
    } else if (fallingPieceRotationalState === 4) {
      cells.push([locs[0][0] + 2, locs[0][1] - 2]);
      cells.push([locs[1][0] + 1, locs[1][1] - 1]);
      cells.push([locs[2][0], locs[2][1]]);
      cells.push([locs[3][0] - 1, locs[3][1] - 1]);
    }
    return cells;
  };

  const getRLCells = (locs) => {
    const cells = [];
    if (fallingPieceRotationalState === 1) {
      cells.push([locs[0][0] + 2, locs[0][1] + 2]);
      cells.push([locs[1][0] + 1, locs[1][1] + 1]);
      cells.push([locs[2][0], locs[2][1]]);
      cells.push([locs[3][0] - 1, locs[3][1] + 1]);
    } else if (fallingPieceRotationalState === 2) {
      cells.push([locs[0][0], locs[0][1]]);
      cells.push([locs[1][0] - 1, locs[1][1] - 1]);
      cells.push([locs[2][0] - 1, locs[2][1] + 1]);
      cells.push([locs[3][0] - 2, locs[3][1] + 2]);
    } else if (fallingPieceRotationalState === 3) {
      cells.push([locs[0][0] + 1, locs[0][1] - 1]);
      cells.push([locs[1][0], locs[1][1]]);
      cells.push([locs[2][0] - 1, locs[2][1] - 1]);
      cells.push([locs[3][0] - 2, locs[3][1] - 2]);
    } else if (fallingPieceRotationalState === 4) {
      cells.push([locs[0][0] + 2, locs[0][1] - 2]);
      cells.push([locs[1][0] + 1, locs[1][1] - 1]);
      cells.push([locs[2][0] + 1, locs[2][1] + 1]);
      cells.push([locs[3][0], locs[3][1]]);
    }
    return cells;
  };

  const getTTCells = (locations) => {
    const cells = [];
    if (fallingPieceRotationalState === 1) {
      cells.push([locations[0][0], locations[0][1]]);
      cells.push([locations[1][0], locations[1][1]]);
      cells.push([locations[2][0], locations[2][1]]);
      cells.push([locations[3][0] + 1, locations[3][1] - 1]);
    } else if (fallingPieceRotationalState === 2) {
      cells.push([locations[0][0] + 1, locations[0][1] + 1]);
      cells.push([locations[1][0], locations[1][1]]);
      cells.push([locations[2][0], locations[2][1]]);
      cells.push([locations[3][0], locations[3][1]]);
    } else if (fallingPieceRotationalState === 3) {
      cells.push([locations[0][0] - 1, locations[0][1] + 1]);
      cells.push([locations[1][0], locations[1][1]]);
      cells.push([locations[2][0], locations[2][1]]);
      cells.push([locations[3][0], locations[3][1]]);
    } else if (fallingPieceRotationalState === 4) {
      cells.push([locations[0][0], locations[0][1]]);
      cells.push([locations[1][0], locations[1][1]]);
      cells.push([locations[2][0], locations[2][1]]);
      cells.push([locations[3][0] - 1, locations[3][1] - 1]);
    }
    return cells;
  };

  const getStraightCells = (locations) => {
    const cells = [];

    if (
      fallingPieceRotationalState === 1 ||
      fallingPieceRotationalState === 3
    ) {
      cells.push([locations[0][0] - 1, locations[0][1] + 1]);
      cells.push([locations[1][0], locations[1][1]]);
      cells.push([locations[2][0] + 1, locations[2][1] - 1]);
      cells.push([locations[3][0] + 2, locations[3][1] - 2]);
    } else {
      cells.push([locations[0][0] + 1, locations[0][1] - 1]);
      cells.push([locations[1][0], locations[1][1]]);
      cells.push([locations[2][0] - 1, locations[2][1] + 1]);
      cells.push([locations[3][0] - 2, locations[3][1] + 2]);
    }
    return cells;
  };

  const speedUpDrop = () => {
    dimensions.clockSpeed = 100;
  };

  const resetSpeed = (e) => {
    if (e.key === " ") {
      dimensions.clockSpeed = storedClockSpeed;
    }
  };

  const movePieceHorizonal = (dir) => {
    const locations = [];
    const movingCells = cellsMoving();
    //checking for gameboard edge
    if (
      dir === -1 &&
      movingCells.some((item) => Number(item.id.charAt(0)) === 0)
    ) {
      return;
    }
    if (
      dir === 1 &&
      movingCells.some(
        (item) => Number(item.id.charAt(0)) === dimensions.columns - 1
      )
    ) {
      return;
    }

    //checking for collision with already placed tetrimino
    for (let cell of movingCells) {
      const [col, row] = getRowAndCol(cell.id);
      if (gameGrid[col + dir][row] === 2) {
        return;
      }
    }

    //collecting the locations of the current falling tetrimino
    //clearing the color and values
    movingCells.forEach((item) => {
      const [col, row] = getRowAndCol(item.id);
      document.getElementById(getCellId(col, row)).classList.remove("moving");
      gameGrid[col][row] = 0;
      locations.push([col, row]);
    });

    //drawing the tetrimino in the new horizontally moved location
    locations.forEach((loc) => {
      document
        .getElementById(getCellId(loc[0] + dir, loc[1]))
        .classList.add("moving");
      copyAndRemoveColorClasses(
        document.getElementById(getCellId(loc[0], loc[1])),
        document.getElementById(getCellId(loc[0] + dir, loc[1])),
        "moving"
      );
      gameGrid[loc[0] + dir][loc[1]] = 1;
    });
    highlightStopCells();
  };

  const gameStartHandler = () => {
    if (!gameOver) {
      gameStarted = true;
      drawingMode = true;
      gameClock();
    }
  };

  const gameOverHandler = () => {
    gameOver = true;
    closableModal("Game Over!");
    if (points > highScoreOnLoad) {
      setCookie("tetrisHighScore", points, 30);
      document.getElementById("highPoints").textContent = points;
    }
  };

  const checkRows = () => {
    let rowsCleared = 0;
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
        rowsCleared++;
      }
    }
    givePoints(rowsCleared);
  };

  const givePoints = (rowsCleared) => {
    switch (rowsCleared) {
      case 1:
        points += 40;
        break;
      case 2:
        points += 100;
        break;
      case 3:
        points += 300;
        break;
      case 4:
        points += 1200;
        break;
    }
    document.getElementById("points").textContent = points;
  };

  const shiftBoardDown = (clearedRow) => {
    for (let row = dimensions.rows - 1; row >= 0; row--) {
      for (let col = 0; col < dimensions.columns; col++) {
        if (row > clearedRow) {
        } else if (row <= clearedRow && row !== 0) {
          document
            .getElementById(getCellId(col, row))
            .classList.remove("placed");
          gameGrid[col][row] = gameGrid[col][row - 1];
          const color = removeAndReturnColorClasses(col, row);
          if (gameGrid[col][row] === 2) {
            document
              .getElementById(getCellId(col, row))
              .classList.add("placed");
            document.getElementById(getCellId(col, row)).classList.add(color);
          }
        } else {
          document
            .getElementById(getCellId(col, row))
            .classList.remove("placed");
          gameGrid[col][row] = 0;
          removeColors(document.getElementById(getCellId(col, row)));
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

  const speedUpGame = () => {
    if (peicesDrawn === 20) {
      storedClockSpeed = 850;
      dimensions.clockSpeed = storedClockSpeed;
    } else if (peicesDrawn === 35) {
      storedClockSpeed = 750;
      dimensions.clockSpeed = storedClockSpeed;
    } else if (peicesDrawn === 55) {
      storedClockSpeed = 600;
      dimensions.clockSpeed = storedClockSpeed;
    } else if (peicesDrawn === 110) {
      storedClockSpeed = 400;
      dimensions.clockSpeed = storedClockSpeed;
    }
  };

  const gameClock = () => {
    if (drawingMode) {
      drawPiece(false, null);
      canHoldTetrimino = true;
      canMoveHor = true;
      peicesDrawn++;
      speedUpGame();
    } else if (fallingMode) {
      movePiece();
      canHoldTetrimino = false;
    }
    if (placingMode) {
      placePiece();
    }
    sleep(dimensions.clockSpeed).then(() => {
      if (gameStarted && !gameOver) {
        gameClock();
      }
    });
  };

  const drawStraightTetrimino = (col) => {
    for (let i = 0; i < dimensions.pieceSize; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      document.getElementById(getCellId(col, i)).classList.add("cyan");
      gameGrid[col][i] = 1;
    }
    fallingPiece = "st";
  };

  const drawSquareTetrimno = (col) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      document.getElementById(getCellId(col, i)).classList.add("yellow");
      gameGrid[col][i] = 1;
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document.getElementById(getCellId(col + 1, i)).classList.add("moving");
      document.getElementById(getCellId(col + 1, i)).classList.add("yellow");
      gameGrid[col + 1][i] = 1;
    }
    fallingPiece = "sq";
  };

  const drawLTetrimno = (col) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      document.getElementById(getCellId(col, i)).classList.add("orange");
      gameGrid[col][i] = 1;
    }
    document.getElementById(getCellId(col + 1, 2)).classList.add("moving");
    document.getElementById(getCellId(col + 1, 2)).classList.add("orange");

    gameGrid[col + 1][2] = 1;
    fallingPiece = "rl";
  };

  const drawMirroredLTetrimno = (col) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      document.getElementById(getCellId(col, i)).classList.add("green");
      gameGrid[col][i] = 1;
    }
    document.getElementById(getCellId(col - 1, 2)).classList.add("moving");
    document.getElementById(getCellId(col - 1, 2)).classList.add("green");
    gameGrid[col - 1][2] = 1;
    fallingPiece = "ml";
  };

  const drawTTetrimno = (col) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      document.getElementById(getCellId(col, i)).classList.add("blue");
      gameGrid[col][i] = 1;
    }
    document.getElementById(getCellId(col - 1, 1)).classList.add("moving");
    document.getElementById(getCellId(col - 1, 1)).classList.add("blue");
    gameGrid[col - 1][1] = 1;
    fallingPiece = "tt";
  };

  const drawZTetrimino = (col) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      document.getElementById(getCellId(col, i)).classList.add("purple");
      gameGrid[col][i] = 1;
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col + 1, i + 1))
        .classList.add("moving");
      document
        .getElementById(getCellId(col + 1, i + 1))
        .classList.add("purple");
      gameGrid[col + 1][i + 1] = 1;
    }
    fallingPiece = "rz";
  };

  const drawMirroredZTetrimino = (col) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document.getElementById(getCellId(col, i)).classList.add("moving");
      document.getElementById(getCellId(col, i)).classList.add("red");
      gameGrid[col][i] = 1;
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col - 1, i + 1))
        .classList.add("moving");
      document.getElementById(getCellId(col - 1, i + 1)).classList.add("red");
      gameGrid[col - 1][i + 1] = 1;
    }
    fallingPiece = "mz";
  };

  const drawStraightTetriminoMini = (col, which) => {
    for (let i = 0; i < dimensions.pieceSize; i++) {
      document.getElementById(getCellId(col, i) + which).classList.add("cyan");
    }
  };

  const drawSquareTetrimnoMini = (col, which) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col, i + 1) + which)
        .classList.add("yellow");
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col + 1, i + 1) + which)
        .classList.add("yellow");
    }
  };

  const drawLTetrimnoMini = (col, which) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document
        .getElementById(getCellId(col, i + 1) + which)
        .classList.add("orange");
    }
    document
      .getElementById(getCellId(col + 1, 3) + which)
      .classList.add("orange");
  };

  const drawMirroredLTetrimnoMini = (col, which) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document
        .getElementById(getCellId(col, i + 1) + which)
        .classList.add("green");
    }
    document
      .getElementById(getCellId(col - 1, 3) + which)
      .classList.add("green");
  };

  const drawTTetrimnoMini = (col, which) => {
    for (let i = 0; i < dimensions.pieceSize - 1; i++) {
      document
        .getElementById(getCellId(col, i + 1) + which)
        .classList.add("blue");
    }
    document
      .getElementById(getCellId(col - 1, 2) + which)
      .classList.add("blue");
  };

  const drawZTetriminoMini = (col, which) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col, i + 1) + which)
        .classList.add("purple");
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col + 1, i + 2) + which)
        .classList.add("purple");
    }
  };

  const drawMirroredZTetriminoMini = (col, which) => {
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col, i + 1) + which)
        .classList.add("red");
    }
    for (let i = 0; i < dimensions.pieceSize / 2; i++) {
      document
        .getElementById(getCellId(col - 1, i + 2) + which)
        .classList.add("red");
    }
  };

  const clearMovingTetrimino = () => {
    const movingCells = cellsMoving();
    movingCells.forEach((item) => {
      const [col, row] = getRowAndCol(item.id);
      removeColors(item);
      item.classList.remove("moving");
      gameGrid[col][row] = 0;
    });
  };

  const holdTetrimino = () => {
    if (canHoldTetrimino) {
      canHoldTetrimino = false;
      clearMovingTetrimino();
      if (heldTetrimino === "") {
        heldTetrimino = fallingPiece;
        showHeldImage();
        drawPiece(false, heldTetrimino);
      } else {
        const tempHeld = heldTetrimino;
        heldTetrimino = fallingPiece;
        drawPiece(true, tempHeld);
        showHeldImage();
      }
    }
  };

  const showHeldImage = () => {
    clearMiniBoard("heldPeice");

    switch (heldTetrimino) {
      case "st":
        drawStraightTetriminoMini(1, "-h");
        break;
      case "sq":
        drawSquareTetrimnoMini(1, "-h");
        break;
      case "rl":
        drawLTetrimnoMini(1, "-h");
        break;
      case "tt":
        drawTTetrimnoMini(2, "-h");
        break;
      case "ml":
        drawMirroredLTetrimnoMini(2, "-h");
        break;
      case "rz":
        drawZTetriminoMini(1, "-h");
        break;
      case "mz":
        drawMirroredZTetriminoMini(2, "-h");
        break;
    }
  };

  const getTetriminoToDraw = () => {
    let rv = nextTetrimino;
    do {
      nextTetrimino = randomIntFromInterval(0, 6);
    } while (nextTetrimino === rv);
    showNextTetrimino();
    return rv;
  };

  const showNextTetrimino = () => {
    clearMiniBoard("nextPeice");
    switch (nextTetrimino) {
      case 0:
        drawStraightTetriminoMini(1, "-n");
        break;
      case 1:
        drawSquareTetrimnoMini(1, "-n");
        break;
      case 2:
        drawLTetrimnoMini(1, "-n");
        break;
      case 3:
        drawTTetrimnoMini(2, "-n");
        break;
      case 4:
        drawMirroredLTetrimnoMini(2, "-n");
        break;
      case 5:
        drawZTetriminoMini(1, "-n");
        break;
      case 6:
        drawMirroredZTetriminoMini(2, "-n");
        break;
    }
  };

  const clearMiniBoard = (id) => {
    Array.from(document.getElementById(id).children).forEach((col) => {
      Array.from(col.children).forEach((elem) => removeColors(elem));
    });
  };

  const drawPiece = (override, held) => {
    const col = 2;
    let tetriminoToDraw;
    if (override) {
      tetriminoToDraw = held;
    } else {
      tetriminoToDraw = getTetriminoToDraw();
    }
    if (checkGameOver(tetriminoToDraw)) {
      gameOverHandler();
      return;
    }
    switch (tetriminoToDraw) {
      case 0:
      case "st":
        drawStraightTetrimino(col);
        break;
      case 1:
      case "sq":
        drawSquareTetrimno(col);
        break;
      case 2:
      case "rl":
        drawLTetrimno(col);
        break;
      case 3:
      case "tt":
        drawTTetrimno(col);
        break;
      case 4:
      case "ml":
        drawMirroredLTetrimno(col);
        break;
      case 5:
      case "rz":
        drawZTetrimino(col);
        break;
      case 6:
      case "mz":
        drawMirroredZTetrimino(col);
        break;
    }
    drawingMode = false;
    fallingMode = true;
    highlightStopCells();
  };

  const checkGameOver = (tetriminoToDraw) => {
    if (tetriminoToDraw === 0) {
      return (
        gameGrid[2][0] !== 0 ||
        gameGrid[2][1] !== 0 ||
        gameGrid[2][2] !== 0 ||
        gameGrid[2][3] !== 0
      );
    } else if (tetriminoToDraw === 1) {
      return (
        gameGrid[2][0] !== 0 ||
        gameGrid[2][1] !== 0 ||
        gameGrid[3][0] !== 0 ||
        gameGrid[3][1] !== 0
      );
    } else if (tetriminoToDraw === 2) {
      return (
        gameGrid[2][0] !== 0 ||
        gameGrid[2][1] !== 0 ||
        gameGrid[2][2] !== 0 ||
        gameGrid[3][2] !== 0
      );
    } else if (tetriminoToDraw === 3) {
      return (
        gameGrid[2][0] !== 0 ||
        gameGrid[2][1] !== 0 ||
        gameGrid[2][2] !== 0 ||
        gameGrid[1][1] !== 0
      );
    } else if (tetriminoToDraw === 4) {
      return (
        gameGrid[2][0] !== 0 ||
        gameGrid[2][1] !== 0 ||
        gameGrid[2][2] !== 0 ||
        gameGrid[1][2] !== 0
      );
    } else if (tetriminoToDraw === 5) {
      return (
        gameGrid[2][0] !== 0 ||
        gameGrid[2][1] !== 0 ||
        gameGrid[3][1] !== 0 ||
        gameGrid[3][2] !== 0
      );
    } else if (tetriminoToDraw === 6) {
      return (
        gameGrid[2][0] !== 0 ||
        gameGrid[2][1] !== 0 ||
        gameGrid[1][1] !== 0 ||
        gameGrid[1][2] !== 0
      );
    }
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
      copyAndRemoveColorClasses(
        document.getElementById(getCellId(loc[0], loc[1])),
        document.getElementById(getCellId(loc[0], loc[1] + 1)),
        "moving"
      );
    });
    highlightStopCells();
  };

  const quickDrop = () => {
    clearDropHighlight();
    const movingCells = cellsMoving();
    const locations = [];
    movingCells.forEach((item) => {
      const [col, row] = getRowAndCol(item.id);
      locations.push([col, row]);
    });
    while (canMove(locations)) {
      locations.forEach((loc) => {
        loc[1] = loc[1] + 1;
      });
    }
    moveSquares(locations);
    canMoveHor = false;
  };

  const moveSquares = (locations) => {
    clearMovingTetrimino();
    locations.forEach((loc) => {
      const elem = document.getElementById(getCellId(loc[0], loc[1]));

      elem.classList.add("moving");
      gameGrid[loc[0]][loc[1]] = 1;
      switch (fallingPiece) {
        case "st":
          elem.classList.add("cyan");
          break;
        case "sq":
          elem.classList.add("yellow");
          break;
        case "rl":
          elem.classList.add("orange");
          break;
        case "tt":
          elem.classList.add("blue");
          break;
        case "ml":
          elem.classList.add("green");
          break;
        case "rz":
          elem.classList.add("purple");
          break;
        case "mz":
          elem.classList.add("red");
          break;
      }
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
    fallingPieceRotationalState = 1;
  };

  const getRowAndCol = (id) => {
    const splitId = id.split("-");
    const col = Number(splitId[0]);
    const row = Number(splitId[1]);
    return [col, row];
  };

  const removeColors = (elem) => {
    if (elem.classList.contains("blue")) {
      elem.classList.remove("blue");
    } else if (elem.classList.contains("red")) {
      elem.classList.remove("red");
    } else if (elem.classList.contains("yellow")) {
      elem.classList.remove("yellow");
    } else if (elem.classList.contains("green")) {
      elem.classList.remove("green");
    } else if (elem.classList.contains("cyan")) {
      elem.classList.remove("cyan");
    } else if (elem.classList.contains("purple")) {
      elem.classList.remove("purple");
    } else if (elem.classList.contains("orange")) {
      elem.classList.remove("orange");
    }
  };

  const removeAndReturnColorClasses = (col, row) => {
    const elem = document.getElementById(getCellId(col, row));
    const elemAbove = document.getElementById(getCellId(col, row - 1));

    removeColors(elem);

    if (elemAbove.classList.contains("blue")) {
      return "blue";
    } else if (elemAbove.classList.contains("red")) {
      return "red";
    } else if (elemAbove.classList.contains("yellow")) {
      return "yellow";
    } else if (elemAbove.classList.contains("green")) {
      return "green";
    } else if (elemAbove.classList.contains("cyan")) {
      return "cyan";
    } else if (elemAbove.classList.contains("purple")) {
      return "purple";
    } else if (elemAbove.classList.contains("orange")) {
      return "orange";
    }
  };

  const copyAndRemoveColorClasses = (elemFrom, elemTo, classToCheckFor) => {
    if (elemFrom.classList.contains("blue")) {
      elemTo.classList.add("blue");
      if (!elemFrom.classList.contains(classToCheckFor)) {
        elemFrom.classList.remove("blue");
      }
    } else if (elemFrom.classList.contains("red")) {
      elemTo.classList.add("red");
      if (!elemFrom.classList.contains(classToCheckFor)) {
        elemFrom.classList.remove("red");
      }
    } else if (elemFrom.classList.contains("yellow")) {
      elemTo.classList.add("yellow");
      if (!elemFrom.classList.contains(classToCheckFor)) {
        elemFrom.classList.remove("yellow");
      }
    } else if (elemFrom.classList.contains("green")) {
      elemTo.classList.add("green");
      if (!elemFrom.classList.contains(classToCheckFor)) {
        elemFrom.classList.remove("green");
      }
    } else if (elemFrom.classList.contains("cyan")) {
      elemTo.classList.add("cyan");
      if (!elemFrom.classList.contains(classToCheckFor)) {
        elemFrom.classList.remove("cyan");
      }
    } else if (elemFrom.classList.contains("purple")) {
      elemTo.classList.add("purple");
      if (!elemFrom.classList.contains(classToCheckFor)) {
        elemFrom.classList.remove("purple");
      }
    } else if (elemFrom.classList.contains("orange")) {
      elemTo.classList.add("orange");
      if (!elemFrom.classList.contains(classToCheckFor)) {
        elemFrom.classList.remove("orange");
      }
    }
  };

  const toggleControlList = () => {
    const list = document.getElementById("ctrlList");
    const btn = document.getElementById("hideBtn");
    if (list.classList.contains("hidden")) {
      list.classList.remove("hidden");
      btn.textContent = "Hide";
    } else {
      list.classList.add("hidden");
      btn.textContent = "Show";
    }
  };

  const clearDropHighlight = () => {
    Array.from(document.querySelectorAll(".flashOn")).forEach((elem) => {
      elem.classList.remove("flashOn");
    });
  };

  const canMove = (locs) => {
    for (const loc of locs) {
      if (
        loc[1] === dimensions.rows - 1 ||
        gameGrid[loc[0]][loc[1] + 1] === 2
      ) {
        return false;
      }
    }
    return true;
  };

  const highlightStopCells = () => {
    if (fallingMode) {
      const movingCells = cellsMoving();
      const locations = [];
      const origLocs = [];
      movingCells.forEach((item) => {
        const [col, row] = getRowAndCol(item.id);
        locations.push([col, row]);
        origLocs.push([col, row]);
      });
      let maxRow = 0;
      for (const loc of locations) {
        if (loc[1] > maxRow) {
          maxRow = loc[1];
        }
      }
      while (canMove(locations)) {
        locations.forEach((loc) => {
          loc[1] = loc[1] + 1;
        });
      }
      if (stopHighlighting(origLocs, locations)) {
        clearDropHighlight();
        return;
      }
      clearDropHighlight();
      locations.forEach((loc) => {
        const elem = document.getElementById(getCellId(loc[0], loc[1]));
        elem.firstChild.classList.add("flashOn");
      });
    }
  };

  const stopHighlighting = (locations, ghostLocations) => {
    for (const loc of locations) {
      for (const gloc of ghostLocations) {
        if (loc[0] === gloc[0] && loc[1] === gloc[1]) {
          return true;
        }
      }
    }
    return false;
  };

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie =
        cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Lax";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function closableModal(message) {
    const modalBox = document.createElement("div");
    modalBox.id = "modal-box";
    const innerModalBox = document.createElement("div");
    innerModalBox.id = "inner-modal-box";
    const modalMessage = document.createElement("span");
    modalMessage.id = "modal-message";
    const closeButton = document.createElement("span");
    closeButton.id = "close-button";
    closeButton.innerHTML = "&times;";
    innerModalBox.appendChild(modalMessage);
    innerModalBox.appendChild(closeButton);
    modalBox.appendChild(innerModalBox);
    modalMessage.innerText = message;
    document.getElementsByTagName("html")[0].appendChild(modalBox);
    closeButton.addEventListener("click", () => {
      modalBox.remove();
    });
  }

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
        const flash = document.createElement("div");
        flash.id = "f" + i + "-" + j;
        flash.classList.add("flash");
        cell.appendChild(flash);
      }
    }
    const nextPeice = document.getElementById("nextPeice");
    const heldPeice = document.getElementById("heldPeice");

    for (let i = 0; i < 4; i++) {
      const col = document.createElement("div");
      col.id = "col-" + i + "-n";
      col.classList.add("col");
      nextPeice.appendChild(col);
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement("div");
        cell.id = i + "-" + j + "-n";
        cell.classList.add("cell");
        col.appendChild(cell);
      }
    }

    for (let i = 0; i < 4; i++) {
      const col = document.createElement("div");
      col.id = "col-" + i + "-h";
      col.classList.add("col");
      heldPeice.appendChild(col);
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement("div");
        cell.id = i + "-" + j + "-h";
        cell.classList.add("cell");
        col.appendChild(cell);
      }
    }

    document
      .getElementById("startBtn")
      .addEventListener("click", gameStartHandler);
    document.addEventListener("keydown", handlePlayerInput);
    document.addEventListener("keyup", resetSpeed);
    document
      .getElementById("hideBtn")
      .addEventListener("click", toggleControlList);
    document.getElementById("points").textContent = points;
    document.getElementById("highPoints").textContent =
      highScoreOnLoad > 0 ? highScoreOnLoad : " No High Score";
    window.onkeydown = (e) =>
      !(
        (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") &&
        e.target === document.body
      );
  })();
})();
