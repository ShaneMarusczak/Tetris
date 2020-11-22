(() => {
  const gameBoardContainer = document.getElementById("gameBoard");
  const dimensions = {
    rows: 20,
    columns: 10,
  };
  (() => {
    for (let i = 0; i < dimensions.columns; i++) {
      const col = document.createElement("div");
      col.id = "col-" + (i + 1);
      col.classList.add("col");
      gameBoardContainer.appendChild(col);
      for (let j = 0; j < dimensions.rows; j++) {
        const cell = document.createElement("div");
        cell.id = "cell-" + (i + 1) + "-" + (j + 1);
        cell.classList.add("cell");
        col.appendChild(cell);
      }
    }
  })();
})();
