const displayController = (() => {
  const selectors = {
    board: "[data-js-game-board]",
    square: "[data-js-square]",
    restart: "[data-js-game-restart-button]",
    start: "[data-js-game-dialog-start]",
    end: "[data-js-game-dialog-end]",
    submit: "[data-js-game-start-button]",
    winner: "[data-js-game-winner]",
    firstPlayer: "[data-js-player-one-input]",
    secondPlayer: "[data-js-player-two-input]",
  };
  const boardElement = document.querySelector(selectors.board);
  const submit = document.querySelector(selectors.submit);
  const firstPlayerElement = document.querySelector(selectors.firstPlayer);
  const secondPlayerElement = document.querySelector(selectors.secondPlayer);
  const startElement = document.querySelector(selectors.start);

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
    startElement.showModal();
  };

  const closeOptions = () => {
    startElement.close();
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

  const getPlayersName = () => [
    firstPlayerElement.value,
    secondPlayerElement.value,
  ];

  return {
    renderSquareElements,
    getSquareElements,
    getBoardElement,
    getSubmitElement,
    updateSquareElement,
    showWinner,
    openOptions,
    closeOptions,
    getPlayersName,
    clearSquareElements,
  };
})();

const Player = (name, mark) => {
  let score = 0;

  const getName = () => name;
  const getMark = () => mark;

  const incrementScore = () => {
    score += 1;
  };
  const getScore = () => score;

  return {
    incrementScore,
    getScore,
    getMark,
    getName,
  };
};

const gameBoard = (() => {
  const gameState = {
    currentPlayer: "",
    players: [],
  };

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

  const setGameState = (firstPlayer, secondPlayer) => {
    gameState.currentPlayer = firstPlayer;
    gameState.players = [firstPlayer, secondPlayer];
  };

  const getCurrentPlayer = () => gameState.currentPlayer;

  const switchPlayer = () => {
    const [firstPlayer, secondPlayer] = gameState.players;
    gameState.currentPlayer =
      gameState.currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
  };

  const reset = () => {
    matrix = matrix.map((row) => row.map(() => ""));
    invertedMatrix = invertedMatrix.map((row) => row.map(() => ""));
    [gameState.currentPlayer] = gameState.players;
  };

  const getLastUpdatedValue = () => lastUpdatedValue;
  const getMatrix = () => matrix;

  const getWinner = () => winner;

  return {
    getMatrix,
    setGameBoardValue,
    setGameState,
    getLastUpdatedValue,
    getCurrentPlayer,
    getWinner,
    switchPlayer,
    reset,
  };
})();

// Select game against AI
// Player turn
// AI turn
// 1) AI get current matrix
// 2) Make random turn if section is empty
// 3) send turn

const computer = (() => {
  let isComputerTurn = false;
  const mark = "O";

  const getRandomCoordinate = () => Math.floor(Math.random() * 3);

  const setComputerMove = (boolen) => {
    isComputerTurn = boolen;
  };

  const makeTurn = (matrix) => {
    let isNotFound = true;
    let coordinates = [];
    while (isNotFound) {
      coordinates = [getRandomCoordinate(), getRandomCoordinate()];
      const [x, y] = coordinates;
      if (!matrix[x][y]) {
        isNotFound = false;
      }
    }
    return [...coordinates];
  };
  const getMove = () => isComputerTurn;
  const getMark = () => mark;

  return {
    makeTurn,
    getMove,
    getMark,
  };
})();

const initGame = () => {
  displayController.openOptions();
  displayController.renderSquareElements();

  const submitButton = displayController.getSubmitElement();
  submitButton.addEventListener("click", () => {
    const [firstPlayerName, secondPlayerName] =
      displayController.getPlayersName();

    const firstPlayer = Player(firstPlayerName, "X");
    const secondPlayer = Player(secondPlayerName, "O");
    gameBoard.setGameState(firstPlayer, secondPlayer);

    displayController.closeOptions();
  });
};

const resetGame = () => {
  gameBoard.reset();
  displayController.clearSquareElements();
  displayController.renderSquareElements();
};

displayController.getBoardElement().addEventListener("click", ({ target }) => {
  if (!target.matches(".square") || target.innerText) return;

  const targetRow = +target.dataset.row;
  const targetColumn = +target.dataset.column;
  gameBoard.setGameBoardValue(
    targetRow,
    targetColumn,
    gameBoard.getCurrentPlayer().getMark(),
  );

  // gameBoard.switchPlayer();
  displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());

  gameBoard.setGameBoardValue(
    ...computer.makeTurn(gameBoard.getMatrix()),
    computer.getMark(),
  );
  displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());

  if (gameBoard.getWinner()) {
    displayController.showWinner(gameBoard.getWinner());
    resetGame();
  }
});

initGame();
