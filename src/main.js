import './styles.css';
import img from './assets/header.gif';
import logoImg from './assets/logo3.png';
import $ from 'jquery';

let myMusic = require('./audio/tetris.mp3');
let dropSound = require('./audio/drop-hit.wav');
let clearLine = require('./audio/clear-line.wav');
let rotateSound = require('./audio/rotate.wav');
let meow = require('./audio/meow.mp3');
let airHorn = require('./audio/airhorn.mp3');
let rotatePlayer = new Audio(rotateSound);
let musicPlayer = new Audio(myMusic);
let dropPlayer = new Audio(dropSound);
let clearPlayer = new Audio(clearLine);
let meowPlayer = new Audio(meow);
let hornPlayer = new Audio(airHorn);

musicPlayer.volume = 0.2;
meowPlayer.volume = 0.5;
hornPlayer.volume = 0.5;
musicPlayer.play();

var logoPic = document.getElementById('logo-pic');
logoPic.src = logoImg;

var canvasBackgroundImg = new Image();
canvasBackgroundImg.src = 'https://i.imgur.com/khgh6tF.gif'

$(function () {
  $('.gameSection').hide();
  $('.nav-button').click(function () {
    $('#header').hide('slow');
    $('.gameSection').show('slow');
  });
});

// Tetris logic //
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextPiece');
const nextCanvasContext = nextCanvas.getContext('2d');
nextCanvasContext.fillStyle = '#000';
nextCanvasContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
nextCanvasContext.scale(45, 45);
let pieces = 'TJLOSZI';
let nextPiece = [createPiece(pieces[pieces.length * Math.random() | 0])];

const player = {
  pos: {
    x: 0,
    y: 0
  },
  matrix: null,
  score: 0,
};


context.scale(40, 40);

// Clears completed lines
function arenaSweep() {
  if (!gameOver) {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
      for (let x = 0; x < arena[y].length; ++x) {
        if (arena[y][x] === 0) {
          continue outer;
        }
      }
      const row = arena.splice(y, 1)[0].fill(0);
      arena.unshift(row);
      ++y;
      player.score += rowCount;
      dropInterval = 500 - (player.score * 10);
      clearPlayer.play();
    }
  }
}

function collide(arena, player) {
  const mat = player.matrix;
  const pos = player.pos;
  for (let y = 0; y < mat.length; ++y) {
    for (let x = 0; x < mat[y].length; ++x) {
      if (mat[y][x] !== 0 &&
        (arena[y + pos.y] &&
          arena[y + pos.y][x + pos.x]) !== 0) {

        return true;
      }
    }
  }
  return false;
}

// Creates game board
function createMatrix(width, height) {
  const matrix = [];
  // While height !0 we decrease height by 1
  while (height--) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  if (type === 'I') {
    return [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ];
  } else if (type === 'L') {
    return [
      [0, 2, 0],
      [0, 2, 0],
      [0, 2, 2],
    ];
  } else if (type === 'J') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [3, 3, 0],
    ];
  } else if (type === 'O') {
    return [
      [4, 4],
      [4, 4],
    ];
  } else if (type === 'Z') {
    return [
      [5, 5, 0],
      [0, 5, 5],
      [0, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === 'T') {
    return [
      [0, 7, 0],
      [7, 7, 7],
      [0, 0, 0],
    ];
  } else if (type === 'W') {
    return [
      [0, 8, 0],
      [8, 0, 8],
      [0, 8, 0],
    ];
  } else if (type === 'X') {
    return [
      [9, 0, 9],
      [0, 0, 0],
      [9, 0, 9],
    ];
  } else if (type === 'Y') {
    return [
      [10, 0, 10],
      [0, 10, 0],
      [0, 10, 0],
    ];
  } else if (type === 'Q') {
    return [
      [11, 11, 0],
      [0, 0, 0],
      [0, 11, 11],
    ];
  } else if (type === 'E') {
    return [
      [0, 12, 12],
      [0, 0, 0],
      [0, 12, 12],
    ];
  } else if (type === 'F') {
    return [
      [0, 13, 13],
      [0, 0, 0],
      [13, 13, 0],
    ];
  } else if (type === 'K') {
    return [
      [0, 0, 14],
      [0, 14, 0],
      [14, 0, 14],
    ];
  }
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        if (brookeMode === false) { // Piece colors
          context.fillStyle = colors[value];
          context.fillRect(x + offset.x,
            y + offset.y,
            1, 1);
        } else { // Brooke Mode
          context.fillStyle = randomColor();
          context.fillRect(x + offset.x,
            y + offset.y,
            1, 1);
        }
      }
    });
  });
}

// Next piece view update
function drawNextPiece(piece) {
  if (!brookeMode && !artMode) {
    nextCanvasContext.fillStyle = '#000'; // without this is picks random colors?
    nextCanvasContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (gameOver) {
      return;
    }
  } else if (!artMode) {
    nextCanvasContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  }
  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        if (!brookeMode) {
          nextCanvasContext.fillStyle = colors[value];
        } else {
          nextCanvasContext.fillStyle = randomColor();
        }
        nextCanvasContext.fillRect(x + 1, y + 1, 1, 1);
      }
    });
  });
}

// Canvas background colors
function draw() {
  if (artMode) {
    context.fillStyle = 'transparent';
  } else if (brookeMode || insaneMode) {
    context.fillStyle = randomColor();
  } else {
    if (player.score < 10) {
      context.fillStyle = '#000';
    } else if (player.score < 20) {
      context.fillStyle = '#3299CC';
    } else if (player.score < 30) {
      context.fillStyle = '#FF2E2E';
    } else if (player.score < 40) {
      context.fillStyle = '#00FFFF';
    } else if (player.score < 50) {
      context.fillStyle = '#FF00FF';
    } else if (player.score < 60) {
      context.fillStyle = '#FFFF00';
    } else if (player.score < 70) {
      context.fillStyle = '#FF8400';
    } else if (player.score < 80) {
      context.fillStyle = '#0084FF';
    } else if (player.score < 90) {
      context.fillStyle = '#9CCF12';
    } else {
      context.fillStyle = '#ff69b4';
    }
  }

  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {
    x: 0,
    y: 0
  });
  drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerDrop() {
  if (insaneMode) {
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  }
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    dropPlayer.play();
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerMove(offset) {
  player.pos.x += offset;
  if (collide(arena, player)) {
    player.pos.x -= offset;
  }
}

// Creates New Piece - checks game over
function playerReset() {
  if ((player.score !== 0 && player.score % 5 === 0) || insaneMode === true || hardMode === true) {
    pieces = 'TJLOSZIWXYQEFK';
  } else {
    pieces = 'TJLOSZI';
  }
  player.matrix = nextPiece[0];
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  nextPiece.shift();
  nextPiece.push(createPiece(pieces[pieces.length * Math.random() | 0]));
  drawNextPiece(nextPiece[0]);
  // Checks for Game Over
  if (collide(arena, player)) { // Why no work?
    arena.forEach(row => gameOverScreen(row));
    // update();
    gameOver = true;
    pause = true;
  }
}

function gameOverScreen(row) {
  row.fill(Math.floor(Math.random() * Math.floor(14)));
  update();
}

function newGame() {
  newLoadMessage = false;
  pause = false;
  gameOver = false;
  arena.forEach(row => row.fill(0));
  player.score = 0;
  playerReset();
  updateScore();
  update();
  drawNextPiece(nextPiece[0]);
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function randomColor() {
  var h = Math.round(Math.random() * 360);
  var color = "hsl(" + h + ", 50%, 80%)";
  // hsl(360, 100%, 100%);
  return color;
}

let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;

function update(time = 0) {
  if (gameOver) {
    return;
  }
  if (!pause) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      playerDrop();
    }
    lastTime = time;
    draw();
    requestAnimationFrame(update);
  }
}

function musicController() {
  hornPlayer.pause();
  musicPlayer.pause();
  meowPlayer.pause();
  if (insaneMode) {
    hornPlayer.play();
  } else if (brookeMode) {
    meowPlayer.play();
  } else {
    musicPlayer.play();
  }
}

// Updates Score Display
function updateScore() {
  if (newLoadMessage) {
    document.getElementById('score').innerText = "Press Space Bar to Play";
  } else if (gameOver) {
    document.getElementById('score').innerText = "GAME OVER\n Final score: " + (player.score) + "\n \n Press Space Bar to play again";
  } else if (insaneMode) {
    document.getElementById('score').innerText = "GOOD LUCK! Lines: " + (((((player.score + 1) / (player.score + 1)) + (22 * 10)) * 3) + 3); //LOL
    dropInterval = 200;
    musicController();
    return;
  } else if (brookeMode && artMode) {
    document.getElementById('score').innerText = "The AciD iSn't WorkiNG! " + (player.score * Math.random());
  } else if (brookeMode) {
    document.getElementById('score').innerText = "BrOoKe MoDe EnGaGeD! " + player.score;
  } else if (artMode) {
    document.getElementById('score').innerText = "Dada Mode! Score = " + player.score;
  } else {
    document.getElementById('score').innerText = "Lines: " + player.score;
  }
  musicController();
}

function refreshUpNext() {
  nextPiece.shift();
  nextPiece.push(createPiece(pieces[pieces.length * Math.random() | 0]));
  drawNextPiece(nextPiece[0]);
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) { // left arrow
    playerMove(-1);
  } else if (event.keyCode === 39) { // right arrow
    playerMove(1);
  } else if (event.keyCode === 40) { // Down arrow
    playerDrop();
  } else if (event.keyCode === 38) { // Up arrow
    playerRotate(1);
    rotatePlayer.play();
  } else if (event.keyCode === 80) { // P button
    pause = !pause;
    update();
  } else if (event.keyCode === 66) { // B button
    brookeMode = !brookeMode;
    updateScore();
  } else if (event.keyCode === 192) { // ~ button
    artMode = !artMode;
    updateScore();
  } else if (event.keyCode === 54) { // 6 Key
    insaneMode = !insaneMode;
    if (insaneMode) {
      refreshUpNext();
    }
    updateScore();
  } else if (event.keyCode === 32) { // space bar
    if (gameOver) {
      newGame();
    }
  } else if (event.keyCode === 72) { // H key
    hardMode = !hardMode;
    if (hardMode) {
      refreshUpNext();
    }
  }
});

// Piece colors
const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
  'gold',
  'grey',
  'white',
  'pink',
  'brown',
  'skyblue',
  'salmon',
];

let hardMode = false;
let gameOver = true;
let pause = true;
let brookeMode = false;
let artMode = false;
let insaneMode = false;
let newLoadMessage = true;
const arena = createMatrix(12, 20);

update();
updateScore();
drawNextPiece(nextPiece[0]);
draw();
