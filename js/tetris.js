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
    clockSpeed: 800,
    pieceSize: 4,
  };
  const gameGrid = [];

  const piecesMoving = () => Array.from(document.querySelectorAll(".moving"));

  const handlePlayerInput = (e) => {
    if (e.key === "ArrowLeft") {
      movePieceHorizonal(-1);
    } else if (e.key === "ArrowRight") {
      movePieceHorizonal(1);
    }
  };

  const movePieceHorizonal = (dir) => {
    const locations = [];
    if (dir === -1) {
      if (piecesMoving().some((item) => Number(item.id.charAt(5)) === 0)) {
        return;
      }
      let shouldReturn = false;
      piecesMoving().forEach((item) => {
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
      if (piecesMoving().some((item) => Number(item.id.charAt(5)) === 9)) {
        return;
      }
      let shouldReturn = false;
      piecesMoving().forEach((item) => {
        const [col, row] = getRowAndCol(item.id);
        if (gameGrid[col + 1][row] === 2) {
          shouldReturn = true;
        }
      });
      if (shouldReturn) {
        return;
      }
    }
    piecesMoving().forEach((item) => {
      const [col, row] = getRowAndCol(item.id);
      document
        .getElementById("cell-" + col + "-" + row)
        .classList.remove("moving");
      gameGrid[col][row] = 0;
      locations.push([col, row]);
    });

    locations.forEach((loc) => {
      document
        .getElementById("cell-" + (loc[0] + dir) + "-" + loc[1])
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

  const drawPiece = () => {
    const col = 1;
    for (let i = 0; i < dimensions.pieceSize; i++) {
      document
        .getElementById("cell-" + (col + i) + "-" + 0)
        .classList.add("moving");
      gameGrid[col + i][0] = 1;
    }
    drawingMode = false;
    fallingMode = true;
  };

  const movePiece = () => {
    if (checkCanNotMove()) {
      fallingMode = false;
      placingMode = true;
      return;
    }
    const locations = [];
    piecesMoving().forEach((item) => {
      const [col, row] = getRowAndCol(item.id);
      document
        .getElementById("cell-" + col + "-" + row)
        .classList.remove("moving");
      gameGrid[col][row] = 0;
      locations.push([col, row]);
    });
    locations.forEach((loc) => {
      document
        .getElementById("cell-" + loc[0] + "-" + (loc[1] + 1))
        .classList.add("moving");
      gameGrid[loc[0]][loc[1] + 1] = 1;
    });
  };

  const checkCanNotMove = () => {
    let rv = false;
    piecesMoving().forEach((mover) => {
      const [col, row] = getRowAndCol(mover.id);
      if (row === 19 || gameGrid[col][row + 1] === 2) {
        rv = true;
      }
    });
    return rv;
  };

  const placePiece = () => {
    piecesMoving().forEach((item) => {
      item.classList.remove("moving");
      item.classList.add("placed");
      const [col, row] = getRowAndCol(item.id);
      gameGrid[col][row] = 2;
    });
    placingMode = false;
    drawingMode = true;
  };

  const getRowAndCol = (id) => {
    const splitId = id.split("-");
    const col = Number(splitId[1]);
    const row = Number(splitId[2]);
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
        cell.id = "cell-" + i + "-" + j;
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
