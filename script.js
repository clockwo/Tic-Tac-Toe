const BOARD_SIZE = 3;

const displayController = (() => {
  const selectors = {
    board: "[data-js-game-board]",
    turn: "[data-js-current-turn]",
    square: "[data-js-square]",
    restart: "[data-js-game-restart-button]",
    quit: "[data-js-game-quit-button]",
    start: "[data-js-game-dialog-start]",
    end: "[data-js-game-dialog-end]",
    submit: "[data-js-game-start-button]",
    winner: "[data-js-game-winner]",
    firstPlayer: "[data-js-player-one-input]",
    secondPlayer: "[data-js-player-two-input]",
    turnAI: "[data-js-turn-ai]",
  };
  const boardElement = document.querySelector(selectors.board);
  const submit = document.querySelector(selectors.submit);
  const firstPlayerElement = document.querySelector(selectors.firstPlayer);
  const secondPlayerElement = document.querySelector(selectors.secondPlayer);
  const startElement = document.querySelector(selectors.start);
  const quitButtonElement = document.querySelector(selectors.quit);
  const currentTurnElement = document.querySelector(selectors.turn);
  const turnAIElement = document.querySelector(selectors.turnAI);
  const restartElement = document.querySelector(selectors.restart);

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
    for (let i = 0; i < BOARD_SIZE; i++) {
      // eslint-disable-next-line no-plusplus
      for (let k = 0; k < BOARD_SIZE; k++) {
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

  const isAI = () => turnAIElement.checked;

  const getSubmitElement = () => submit;
  const getQuitButtonElement = () => quitButtonElement;

  const getSquareElements = () => document.querySelectorAll(selectors.square);

  const getCurrentElement = () => currentTurnElement;

  const getRestartElement = () => restartElement;

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

  const setCurrentTurn = (name) => {
    currentTurnElement.textContent = name;
  };

  return {
    setCurrentTurn,
    renderSquareElements,
    getSquareElements,
    getBoardElement,
    getSubmitElement,
    getQuitButtonElement,
    getCurrentElement,
    getRestartElement,
    updateSquareElement,
    showWinner,
    openOptions,
    closeOptions,
    getPlayersName,
    clearSquareElements,
    isAI,
  };
})();

const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;

  return {
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
    for (let i = 0; i < BOARD_SIZE; i++) {
      tempMatrix[0].push(mat[i][i]);
    }

    let temp = 2;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < BOARD_SIZE; i++) {
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

  const checkPotentialWin = (row, column, activePlayerMark) => {
    matrix[row][column] = activePlayerMark;
    invertedMatrix[column][row] = activePlayerMark;

    if (checkWinner(activePlayerMark)) {
      matrix[row][column] = "";
      invertedMatrix[column][row] = "";
      return true;
    }
    matrix[row][column] = "";
    invertedMatrix[column][row] = "";
    return false;
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
    checkPotentialWin,
    checkWinner,
    getLastUpdatedValue,
    getCurrentPlayer,
    getWinner,
    switchPlayer,
    reset,
  };
})();

const computer = (() => {
  const isComputerTurn = false;
  const mark = "O";

  const getRandomCoordinate = () => Math.floor(Math.random() * 3);

  const makeTurn = (matrix) => {
    // Check if the AI is one move away from winning
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!matrix[i][j]) {
          if (gameBoard.checkPotentialWin(i, j, "O")) {
            return [i, j];
          }
        }
      }
    }

    // Check if the player is one move away from winning and block them if they are
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!matrix[i][j]) {
          if (gameBoard.checkPotentialWin(i, j, "X")) {
            return [i, j];
          }
        }
      }
    }

    // If the player is not one move away from winning, make a random move
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

const resetGame = () => {
  gameBoard.reset();
  displayController.clearSquareElements();
  displayController.renderSquareElements();
};

const updateCurrentPlayer = () => {
  const currentTurn = displayController.getCurrentElement();
  const currentPlayer = gameBoard.getCurrentPlayer();
  currentTurn.innerHTML = currentPlayer.getName();
};

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

    updateCurrentPlayer();
    displayController.closeOptions();
  });

  const restartButtonElement = displayController.getRestartElement();
  restartButtonElement.addEventListener("click", () => {
    resetGame();
    updateCurrentPlayer();
  });

  const quitButton = displayController.getQuitButtonElement();
  quitButton.addEventListener("click", () => {
    displayController.openOptions();
    resetGame();
    updateCurrentPlayer();
  });
};

const playAI = () => {
  if (gameBoard.getWinner()) {
    displayController.showWinner(gameBoard.getWinner());
    resetGame();
  } else {
    gameBoard.setGameBoardValue(
      ...computer.makeTurn(gameBoard.getMatrix()),
      computer.getMark(),
    );
    displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());
  }
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
  displayController.updateSquareElement(...gameBoard.getLastUpdatedValue());

  if (displayController.isAI()) {
    playAI();
  } else {
    gameBoard.switchPlayer();
    updateCurrentPlayer();
  }

  if (gameBoard.getWinner()) {
    displayController.showWinner(gameBoard.getWinner());
    resetGame();
  }
});

initGame();

/*
 * TODO:
 * 1) Add element what shows which turn
 * 2) Add element what shows score and name of player / AI
 * 3) When player click button to restart (Update score and clear area)
 */
