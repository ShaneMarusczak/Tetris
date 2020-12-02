(() => {
  let gameStarted = false;
  let gameOver = false;
  let drawingMode = false;
  let fallingMode = false;
  let placingMode = false;
  let canRotate = true;
  let fallingPiece = "";
  let fallingPieceRotationalState = 1;
  const gameBoardContainer = document.getElementById("gameBoard");
  const dimensions = {
    rows: 20,
    columns: 10,
    clockSpeed: 1000,
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
      case " ":
        speedUpDrop();
        break;
      case "r":
      case "R":
        if (!fallingMode) {
          break;
        }
        rotate();
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

  const resetSpeed = () => {
    dimensions.clockSpeed = 1000;
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
      copyAndRemoveColorClasses(
        document.getElementById(getCellId(loc[0], loc[1])),
        document.getElementById(getCellId(loc[0] + dir, loc[1])),
        "moving"
      );
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
    window.closableModal("Game Over!");
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

  const drawPiece = () => {
    const col = 2;
    const tetriminoToDraw = window.randomIntFromInterval(0, 6);
    if (checkGameOver(tetriminoToDraw)) {
      gameOverHandler();
      return;
    }
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
        drawTTetrimno(col);
        break;
      case 4:
        drawMirroredLTetrimno(col);
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
    document.addEventListener("keyup", resetSpeed);
    window.onkeydown = (e) => !(e.key === " " && e.target == document.body);
  })();
})();
