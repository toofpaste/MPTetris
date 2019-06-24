const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
var myMusic;


function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

myMusic = new sound('src/audio/tetris.mp3');

var audio = new Audio("src/audio/tetris.mp3");
audio.play();


const player = {
    pos: {
        x: 0,
        y: 0
    },
    matrix: null,
    score: 0,
};

context.scale(20, 20);

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length -1; y > 0; --y) {
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

function createPiece(type)
{
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
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x,
          y + offset.y,
          1, 1);
      }
    });
  });
}

function draw() {
    if (player.score < 10) {
        context.fillStyle = '#000';
    } else if (player.score < 20) {
        context.fillStyle = '#3CE25A';
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

  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x: 0, y: 0});
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

function playerReset() {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) -
        (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)) {
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


let dropCounter = 0;
let dropInterval = 500;

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
  document.getElementById('score').innerText = player.score;
  dropInterval = 500 - (player.score * 10)
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) { // left arrow
    playerMove(-1);
  } else if (event.keyCode === 39) {  // right arrow
    playerMove(1);
  } else if (event.keyCode === 40) {  // Down arrow
    playerDrop();
    myMusic.play();
  } else if (event.keyCode === 38) { // Up arrow
    playerRotate(1);
  } else if (event.keyCode === 80) {  // P button
    pause = !pause;
    update();
  }
});

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
const arena = createMatrix(12, 20);

playerReset();
updateScore();
update();

//
// var vid = "63hoSNvS6Z4",
//     audio_streams = {},
//     audio_tag = document.getElementById('youtube');
//
// fetch("https://"+vid+"-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D" + vid).then(response => {
//     if (response.ok) {
//         response.text().then(data => {
//
//             var data = parse_str(data),
//                 streams = (data.url_encoded_fmt_stream_map + ',' + data.adaptive_fmts).split(',');
//
//             streams.forEach(function(s, n) {
//                 var stream = parse_str(s),
//                     itag = stream.itag * 1,
//                     quality = false;
//                 console.log(stream);
//                 switch (itag) {
//                     case 139:
//                         quality = "48kbps";
//                         break;
//                     case 140:
//                         quality = "128kbps";
//                         break;
//                     case 141:
//                         quality = "256kbps";
//                         break;
//                 }
//                 if (quality) audio_streams[quality] = stream.url;
//             });
//
//             console.log(audio_streams);
//
//             audio_tag.src = audio_streams['128kbps'];
//             audio_tag.play();
//         })
//     }
// });
//
// function parse_str(str) {
//     return str.split('&').reduce(function(params, param) {
//         var paramSplit = param.split('=').map(function(value) {
//             return decodeURIComponent(value.replace('+', ' '));
//         });
//         params[paramSplit[0]] = paramSplit[1];
//         return params;
//     }, {});
// }
