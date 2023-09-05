const displayController = (() => {
  const selectors = {
    board: "[data-js-board]",
    square: "[data-js-square]",
    reset: "[data-js-reset]",
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

// Player

const Player = (name, setter) => {
  const getSetter = () => setter;
  const getName = () => name;

  return {
    getSetter,
    getName,
  };
};

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

  const getDiagonals = (mat) => {
    const tempMatrix = [[], []];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 3; i++) {
      tempMatrix[0].push(mat[i][i]);
    }

    let temp = 2;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 3; i++) {
      tempMatrix[1].push(mat[i][temp]);
      // eslint-disable-next-line no-plusplus
      temp--;
    }
    return tempMatrix;
  };

  let lastUpdatedValue = ["", "", ""];

  // eslint-disable-next-line consistent-return
  const checkWinner = (activePlayerMark) => {
    // Helper function to check if all values in a row are equal
    const isWinningRow = (row) =>
      row.every((cell) => cell === activePlayerMark);

    const diagonals = getDiagonals(matrix);

    // Check row
    if (matrix.some(isWinningRow)) return activePlayerMark;

    // Check columns
    if (invertedMatrix.some(isWinningRow)) return activePlayerMark;

    // Check diagonals
    if (diagonals.some(isWinningRow)) return activePlayerMark;

    // Check for draw
    if (matrix.every((row) => row.every((cell) => cell))) return "draw";
  };

  const setGameBoardValue = (row, column, activePlayerMark) => {
    matrix[row][column] = activePlayerMark;
    invertedMatrix[column][row] = activePlayerMark;
    lastUpdatedValue = [row, column, activePlayerMark];
    console.log(checkWinner(activePlayerMark));
  };

  const getLastUpdatedValue = () => lastUpdatedValue;
  const getMatrix = () => matrix;

  return { getMatrix, setGameBoardValue, getLastUpdatedValue };
})();

displayController.renderSquareElements();

const boardElement = displayController.getBoardElement();
boardElement.addEventListener("click", ({ target }) => {
  if (!target.matches(".square") || target.innerText) return;

  const targetRow = +target.dataset.row;
  const targetColumn = +target.dataset.column;
  gameBoard.setGameBoardValue(targetRow, targetColumn, "TEST");
  console.debug(...gameBoard.getLastUpdatedValue());
  displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());
});

// TODO: Create player factory function
