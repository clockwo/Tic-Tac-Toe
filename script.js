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
    ['X', 'O', 'O'],
    ['O', 'X', 'O'],
    ['O', 'O', 'X'],
  ];

  const getMatrix = () => matrix;

  return { getMatrix };
})();

const displayController = (() => {})();
