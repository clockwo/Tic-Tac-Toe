const displayController = (() => {
  const selectors = {
    board: "[data-js-board]",
    square: "[data-js-square]",
    reset: "[data-js-reset]",
    start: "[data-js-start]",
    submit: "[data-js-submit]",
    end: "[data-js-end]",
    winner: "[data-js-winner]",
    firstPlayer: "[data-js-firstPlayer]",
    secondPlayer: "[data-js-secondPlayer]",
  };
  const boardElement = document.querySelector(selectors.board);
  const submit = document.querySelector(selectors.submit);
  const firstPlayerElement = document.querySelector(selectors.firstPlayer);
  const secondPlayerElement = document.querySelector(selectors.secondPlayer);

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

  const openOptions = () => {
    const startElement = document.querySelector(selectors.start);
    startElement.showModal();
  };

  const getBoardElement = () => boardElement;

  const getSubmitElement = () => submit;

  const getSquareElements = () => document.querySelectorAll(selectors.square);

  const clearSquareElements = () => {
    boardElement.replaceChildren();
  };

  const showWinner = (result) => {
    if (!result) return;

    const endDialogElement = document.querySelector(selectors.end);
    const winnerElement = document.querySelector(selectors.winner);

    winnerElement.innerText =
      result === "draw" ? "Is draw!" : `Winner is ${result}`;

    endDialogElement.showModal();
  };

  const getPlayersName = () => [firstPlayerElement, secondPlayerElement];

  return {
    renderSquareElements,
    getSquareElements,
    getBoardElement,
    getSubmitElement,
    updateSquareElement,
    showWinner,
    openOptions,
    getPlayersName,
    clearSquareElements,
  };
})();

// Player

const Player = (name) => {
  const getName = () => name;

  return {
    getName,
  };
};

// Game board

const gameBoard = (() => {
  let matrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  let invertedMatrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  let winner = "";

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
    winner = checkWinner(activePlayerMark);
  };

  const reset = () => {
    matrix = matrix.map((row) => row.map(() => ""));
    invertedMatrix = invertedMatrix.map((row) => row.map(() => ""));
  };

  const getLastUpdatedValue = () => lastUpdatedValue;
  const getMatrix = () => matrix;

  const getWinner = () => winner;

  return {
    getMatrix,
    setGameBoardValue,
    getLastUpdatedValue,
    getWinner,
    reset,
  };
})();

const resetGame = () => {
  gameBoard.reset();
  displayController.clearSquareElements();
  displayController.renderSquareElements();
};

displayController.openOptions();

displayController.getSubmitElement().addEventListener("click", () => {});

displayController.renderSquareElements();

let tempMark = "X";
let lastMark = "O";
let temp = "";
displayController.getBoardElement().addEventListener("click", ({ target }) => {
  if (!target.matches(".square") || target.innerText) return;

  const targetRow = +target.dataset.row;
  const targetColumn = +target.dataset.column;
  gameBoard.setGameBoardValue(targetRow, targetColumn, tempMark);
  displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());
  if (gameBoard.getWinner()) {
    displayController.showWinner(gameBoard.getWinner());
    resetGame();
  }

  console.debug(...gameBoard.getLastUpdatedValue());
  temp = tempMark;
  tempMark = lastMark;
  lastMark = temp;
});

// TODO: Create player factory function
