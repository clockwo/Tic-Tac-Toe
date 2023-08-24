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

  const getDiagonals = (mat) => {
    const tempMatrix = [[], []];

    for (let i = 0; i < 3; i++) {
      tempMatrix[0].push(mat[i][i]);
    }

    let temp = 2;
    for (let i = 0; i < 3; i++) {
      tempMatrix[1].push(mat[i][temp]);
      temp--;
    }
    return tempMatrix;
  };

  let lastUpdatedValue = ["", "", ""];

  const checkWinner = () => {
    const linesMatrix = getDiagonals(matrix);
    if (matrix.some((row) => row.every((value) => value === "X"))) return "X";
    if (invertedMatrix.some((row) => row.every((value) => value === "X")))
      return "X";
    if (linesMatrix.some((row) => row.every((value) => value === "X")))
      return "X";
  };

  const setGameBoardValue = (row, column) => {
    matrix[row][column] = "X";
    invertedMatrix[column][row] = "X";
    lastUpdatedValue = [row, column, "X"];
    console.log(checkWinner());
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
  gameBoard.setGameBoardValue(targetRow, targetColumn);
  console.debug(...gameBoard.getLastUpdatedValue());
  displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());
});
