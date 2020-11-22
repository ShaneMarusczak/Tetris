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
    for (let i = 0; i < dimensions.pieceSize; i++) {
      document.getElementById("cell-1-" + i).classList.add("moving");
      gameGrid[1][i] = 1;
    }
    drawingMode = false;
    fallingMode = true;
  };

  const movePiece = () => {
    const peicesMoving = Array.from(document.querySelectorAll(".moving"));
    const test = checkCanNotMove(peicesMoving);
    if (test) {
      fallingMode = false;
      placingMode = true;
      return;
    }
    const locations = [];
    peicesMoving.forEach((item) => {
      const splitId = item.id.split("-");
      const col = Number(splitId[1]);
      const row = Number(splitId[2]);
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

  const checkCanNotMove = (arrOfMovers) => {
    let rv = false;
    arrOfMovers.forEach((mover) => {
      const splitId = mover.id.split("-");
      const col = Number(splitId[1]);
      const row = Number(splitId[2]);
      if (
        row === 19 ||
        (gameGrid[col][row + 1] === 1 &&
          document
            .getElementById("cell-" + col + "-" + (row + 1))
            .classList.contains("placed"))
      ) {
        rv = true;
      }
    });
    return rv;
  };

  const placePiece = () => {
    document.querySelectorAll(".moving").forEach((item) => {
      item.classList.remove("moving");
      item.classList.add("placed");
    });
    placingMode = false;
    drawingMode = true;
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
  })();
})();
