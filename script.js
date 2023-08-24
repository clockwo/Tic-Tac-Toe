const displayController = (() => {
  const selectors = {
    board: "[data-js-board]",
    square: "[data-js-square]",
  };
  const boardElement = document.querySelector(selectors.board);

  const createSquareElement = (row, column) => {
    const squareElement = document.createElement("button");
    squareElement.classList.add("square");
    squareElement.setAttribute("data-row", row);
    squareElement.setAttribute("data-column", column);
    squareElement.setAttribute("type", "button");
    return squareElement;
  };

  const renderSquareElements = () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line no-plusplus
      for (let k = 0; k < 3; k++) {
        boardElement.appendChild(createSquareElement(i, k));
      }
    }
  };

  const updateSquareElement = (row, column, value) => {
    const updatedElement = document.querySelector(
      `[data-row="${row}"][data-column="${column}"]`,
    );
    updatedElement.innerText = value;
  };

  const getBoardElement = () => boardElement;

  const getSquareElements = () => document.querySelectorAll(selectors.square);

  return {
    renderSquareElements,
    getSquareElements,
    getBoardElement,
    updateSquareElement,
  };
})();

// Game board

const gameBoard = (() => {
  const matrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const invertedMatrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  let lastUpdatedValue = ["", "", ""];

  const checkWinner = () => {
    for (const row of matrix) {
      if (row.every((value) => value === "X")) return "X";
    }
    for (const row of invertedMatrix) {
      if (row.every((value) => value === "X")) return "X";
    }
  };

  const setValue = (row, column) => {
    matrix[row][column] = "X";
    invertedMatrix[column][row] = "X";
    lastUpdatedValue = [row, column, "X"];
    console.log(checkWinner());
  };

  const getLastUpdatedValue = () => lastUpdatedValue;
  const getMatrix = () => matrix;

  return { getMatrix, setValue, getLastUpdatedValue };
})();

displayController.renderSquareElements();

const boardElement = displayController.getBoardElement();
boardElement.addEventListener("click", ({ target }) => {
  if (!target.matches(".square") || target.innerText) return;

  const targetRow = +target.dataset.row;
  const targetColumn = +target.dataset.column;
  gameBoard.setValue(targetRow, targetColumn);
  console.debug(...gameBoard.getLastUpdatedValue());
  displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());
});
