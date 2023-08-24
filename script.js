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
    updatedElement.innerHTML = value;
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

  let lastUpdatedValue = ["", "", ""];

  const setValue = (row, column) => {
    matrix[row][column] = "X";
    lastUpdatedValue = [row, column, "X"];
  };

  const getLastUpdatedValue = () => lastUpdatedValue;
  const getMatrix = () => matrix;

  return { getMatrix, setValue, getLastUpdatedValue };
})();

displayController.renderSquareElements();

const boardElement = displayController.getBoardElement();
boardElement.addEventListener("click", ({ target }) => {
  if (!target.matches(".square")) return;

  const targetRow = +target.dataset.row;
  const targetColumn = +target.dataset.column;
  gameBoard.setValue(targetRow, targetColumn);
  displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());
});
