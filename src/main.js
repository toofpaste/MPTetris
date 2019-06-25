import './styles.css';
import img from './assets/header.gif'
import logoImg from './assets/logo3.png'
import $ from 'jquery';

let myMusic = require('./audio/tetris.mp3');
let dropSound = require('./audio/drop-hit.wav');
let clearLine = require('./audio/clear-line.wav');
let rotateSound = require('./audio/rotate.wav');
let meow = require('./audio/meow.mp3');
let rotatePlayer = new Audio(rotateSound);
let musicPlayer = new Audio(myMusic);
let dropPlayer = new Audio(dropSound);
let clearPlayer = new Audio(clearLine);
let meowPlayer = new Audio(meow);

musicPlayer.volume = 0.2;
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

//tetris logic//
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextPiece');
const nextCanvasContext = nextCanvas.getContext('2d');
nextCanvasContext.fillStyle = '#000';
nextCanvasContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
nextCanvasContext.scale(40, 40);

const pieces = 'TJLOSZI';
let nextPiece = [createPiece(pieces[pieces.length * Math.random() | 0])];
console.log(nextPiece);

const player = {
  pos: {
    x: 0,
    y: 0
  },
  matrix: null,
  score: 0,
};


context.scale(40, 40);

function arenaSweep() {
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

function createMatrix(width, height) {
  const matrix = [];
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

function drawNextPiece(piece) {
  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !==0) {
        nextCanvasContext.fillStyle = 'red';
        nextCanvasContext.fillRect(x, y, 1, 1)
      }
    });
  });
}

// Canvas background colors
function draw() {
  if (artMode) {
    context.fillStyle = 'transparent';
  } else if (brookeMode) {
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
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
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

// Creates New Piece
function playerReset() {
  player.matrix = nextPiece[0];
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  nextPiece.shift();
  nextPiece.push(createPiece(pieces[pieces.length * Math.random() | 0]));
  drawNextPiece(nextPiece[0]);
  if (collide(arena, player)) {
    newGame();
  }
}

function newGame() {
  pause = true;
  if (confirm("Final score: " + player.score + "\n Play again?")) {
    pause = false;
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
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
let dropInterval = 400; // make 500 for real play

let lastTime = 0;

function update(time = 0) {
  if (pause === false) {
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

function updateScore() {
  if (brookeMode && artMode) {
    meowPlayer.play();
    musicPlayer.pause();
    document.getElementById('score').innerText = "The Acid? it WorkiNG! " + (player.score * Math.random());
  } else if (brookeMode) {
    meowPlayer.play();
    musicPlayer.pause();
    document.getElementById('score').innerText = "BrOoKe MoDe EnGaGeD! " + player.score;
  } else if (artMode) {
    meowPlayer.pause();
    musicPlayer.play();
    document.getElementById('score').innerText = "Dada Mode! Score = " + player.score;
  } else {
    meowPlayer.pause();
    musicPlayer.play();
    document.getElementById('score').innerText = "Lines: " + player.score;
  }
  dropInterval = 500 - (player.score * 10);
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
    // musicPlayer.pause();
    update();
  } else if (event.keyCode === 66) { // B button
    brookeMode = !brookeMode;
    updateScore();
  } else if (event.keyCode === 192) { // ~ button
    artMode = !artMode;
    updateScore();
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
];

let pause = false;
let brookeMode = false;
let artMode = false;
const arena = createMatrix(12, 20);
// const arena = createMatrix(32, 50);  // large arena

playerReset();
updateScore();
update();
drawNextPiece(nextPiece[0]);