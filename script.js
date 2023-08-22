/* 


Gameboard contains:
Matrix:
  [][][]  
  [][][]
  [][][]

  Add value to matrix: X or O


Display controller: 
  render elements


*/

// Gameboard

const gameBoard = (() => {
  const matrix = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const getMatrix = () => matrix;

  return { getMatrix };
})();

const displayController = (() => {
  const SQUARES_TO_RENDER = 9;

  const selectors = {
    board: '[data-js-board]',
    square: '[data-js-square]',
  };

  const boardElement = document.querySelector(selectors.board);

  const createSquareElement = (dataNumber) => {
    //Create square
    const squareElement = document.createElement('button');
    squareElement.classList.add('square');
    //Add span element for X or O
    const spanElement = document.createElement('span');

    squareElement.setAttribute(`data-js-square`, dataNumber);
    squareElement.setAttribute(`type`, 'button');

    squareElement.appendChild(spanElement);

    return squareElement;
  };

  const renderSquareElements = () => {
    for (let i = 1; i <= SQUARES_TO_RENDER; i++) {
      boardElement.appendChild(createSquareElement(i));
    }
  };

  const getBoardElement = () => boardElement;
  const getSquareElements = () => document.querySelectorAll(selectors.square);

  return { renderSquareElements, getSquareElements, getBoardElement };
})();

displayController.renderSquareElements();

const boardElement = displayController.getBoardElement();
boardElement.addEventListener('click', ({ target }) => {
  if (!target.matches(`.square`)) return;
});
