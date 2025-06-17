
const board = document.getElementById("board");
const log = document.getElementById("log");
let positions = [1, 1];
let turn = 0; // 0 = player1, 1 = player2

const snakes = {
  99: 5, 92: 15, 84: 28, 73: 10, 61: 18
};
const ladders = {
  3: 22, 6: 25, 11: 40, 15: 44, 28: 78
};

function createBoard() {
  board.innerHTML = "";
  for (let i = 100; i >= 1; i--) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = `cell-${i}`;
    cell.textContent = i;
    board.appendChild(cell);
  }
}

function updatePlayers() {
  document.querySelectorAll(".player1, .player2").forEach(e => e.remove());
  [0, 1].forEach(p => {
    const pos = positions[p];
    if (pos <= 100) {
      let player = document.createElement("div");
      player.classList.add(`player${p+1}`);
      document.getElementById(`cell-${pos}`).appendChild(player);
    }
  });
}

function rollDice() {
  const dice = Math.floor(Math.random() * 6) + 1;
  const player = turn + 1;
  logMessage(`Player ${player} rolls ${dice}`);
  positions[turn] += dice;

  if (positions[turn] > 100) positions[turn] = 100;

  if (positions[turn] in ladders) {
    logMessage(`Player ${player} climbed a ladder!`);
    positions[turn] = ladders[positions[turn]];
  }

  if (positions[turn] in snakes) {
    logMessage(`Player ${player} got bitten by a snake!`);
    positions[turn] = snakes[positions[turn]];
  }

  const other = 1 - turn;
  if (positions[turn] === positions[other]) {
    logMessage(`Magnetic pull! Player ${player} sent back to start!`);
    positions[turn] = 1;
  }

  updatePlayers();

  if (positions[turn] === 100) {
    alert(`Player ${player} wins!`);
    resetGame();
    return;
  }

  const swapSquares = [13, 37, 59];
  if (swapSquares.includes(positions[turn])) {
    logMessage(`Player ${player} triggered a swap!`);
    const temp = positions[0];
    positions[0] = positions[1];
    positions[1] = temp;
    updatePlayers();
  }

  turn = 1 - turn;
}

function resetGame() {
  positions = [1, 1];
  turn = 0;
  updatePlayers();
  log.innerHTML = "";
}

function logMessage(msg) {
  log.innerHTML += `<div>${msg}</div>`;
  log.scrollTop = log.scrollHeight;
}

createBoard();
updatePlayers();
