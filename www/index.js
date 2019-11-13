import { Universe, Cell } from "game-of-life";
// Import the WebAssembly memory at the top of the file.
import { memory } from "game-of-life/game_of_life_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#00F";
const DEAD_COLOR = "#300";
const ALIVE_COLOR = "#FFF";

let animationId = null;
let stageBefore0 = 'one';
let stageBefore1 = '1one';

// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();


const fps = new class {
  constructor() {
    this.fps = document.getElementById("fps");
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    // Convert the delta time since the last frame render into a measure
    // of frames per second.
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = 1 / delta * 1000;

    // Save only the latest 100 timings.
    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    // Render the statistics.
    this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
  }
};

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const isPaused = () => {
  return animationId === null;
};

var cellsPtr = null;
var cells = null;
var playUntilPeriodic = false

const renderLoop = () => {
  drawGrid();
  drawCells();
  for (var i=0; i<83; i++) {
  	universe.tick();
  }
        cellsPtr = universe.cells();
  	cells = JSON.stringify(new Uint8Array(memory.buffer, cellsPtr, width * height))
	if (cells == stageBefore0 || cells == stageBefore1) {
	  if (playUntilPeriodic) {
  universe.reset()
  play()
	}
		else {
			pause()
		}
	  return
  	}
	stageBefore1 = stageBefore0
	stageBefore0 = cells

  animationId = requestAnimationFrame(renderLoop);
};

const playPauseButton = document.getElementById("play-pause");
const resetButton = document.getElementById("reset");
const exploreButton = document.getElementById("explore");

const play = () => {
	  playPauseButton.textContent = "stop";
	  renderLoop();
};

const pause = () => {
	  playPauseButton.textContent = "start";
	  cancelAnimationFrame(animationId);
	  animationId = null;
};

playPauseButton.addEventListener("click", event => {
	  if (isPaused()) {
		      play();
		    } else {
			        pause();
			      }
});
resetButton.addEventListener("click", event => {
  playUntilPeriodic = false
  universe.reset()
  play()
})

exploreButton.addEventListener("click", event => {
  playUntilPeriodic = true
  universe.reset()
  play()
})


const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr1 = universe.cells();
  const cells1 = new Uint8Array(memory.buffer, cellsPtr1, width * height);
  ctx.beginPath();

// Alive cells.
ctx.fillStyle = ALIVE_COLOR;
for (let row = 0; row < height; row++) {
  for (let col = 0; col < width; col++) {
    const idx = getIndex(row, col);
    if (cells1[idx] !== Cell.Alive) {
      continue;
    }

    ctx.fillRect(
      col * (CELL_SIZE + 1) + 1,
      row * (CELL_SIZE + 1) + 1,
      CELL_SIZE,
      CELL_SIZE
    );
  }
}

// Dead cells.
ctx.fillStyle = DEAD_COLOR;
for (let row = 0; row < height; row++) {
  for (let col = 0; col < width; col++) {
    const idx = getIndex(row, col);
    if (cells1[idx] !== Cell.Dead) {
      continue;
    }

    ctx.fillRect(
      col * (CELL_SIZE + 1) + 1,
      row * (CELL_SIZE + 1) + 1,
      CELL_SIZE,
      CELL_SIZE
    );
  }
}

  ctx.stroke();
return false
};

play()

