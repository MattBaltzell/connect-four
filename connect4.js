/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let gameOver = false;
let currPlayer = 1; // active player: 1 or 2

const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure: */
function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    const arr = new Array();
    arr.length = WIDTH;
    board.push(arr.fill());
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');
  // create clickable 'top' element of columns. when clicked, it drops game piece into the column.
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // loop that creates rows based on 'HEIGHT'variable with the number of columns based on 'WIDTH' variable
  // each row is then added to htmlBoard
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // loop checks last element of a column array, then decrements index until it finds an empty space, when it returns that index
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const cell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement('div');
  piece.classList.add(`piece`, `p${currPlayer}`);
  cell.append(piece);
  // animate the piece
  setTimeout(function () {
    piece.style.opacity = 1;
    piece.style.top = 0;
  }, 0);
}

/** endGame: announce game end */
function endGame(msg) {
  // prevent additional clicks, and alert that the game has ended
  gameOver = true;
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  if (gameOver) return;
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) return;

  // place piece in board and add to HTML table
  // - prevent adding if the top element is already present
  if (board[0][x]) return;
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} wins!`);
  }

  // check for tie
  if (board.every((row) => row.every((col) => col))) {
    return endGame(`It's a tie!`);
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Checks every cell in the htmlBoard
  // - Creates an array of horizontal coordinates based on first cell
  // - Creates an array of vertical coordinates based on first cell
  // - Creates an array of diagonal down & right coordinates based on first cell
  // - Creates an array of diagonal down & left coordinates based on first cell
  // - Uses _win function to check if any of those arrays contain elemtens with all the same values (same player pieces).
  // - If so, it returns true.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
