import {
    memory
} from "game-of-life/game_of_life_bg";

import {
    Universe,
    Cell
} from "game-of-life";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#00F";
const DEAD_COLOR = "#300";
const ALIVE_COLOR = "#FFF";

const canvas = document.getElementById("game-of-life-canvas");
const playPauseButton = document.getElementById("play-pause");
const resetButton = document.getElementById("reset");
const exploreButton = document.getElementById("explore");

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

let animationId = null;
let stageBefore0 = 'one';
let stageBefore1 = 'none';
let cellsPtr = null;
let cells = null;
let playUntilPeriodic = false
let tickNumber = 87

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

// lListeners
playPauseButton.addEventListener("click", event => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
});

resetButton.addEventListener("click", event => {
    playUntilPeriodic = false
    tickNumber = 87
    universe.reset()
    play()
})

exploreButton.addEventListener("click", event => {
    playUntilPeriodic = true
    tickNumber = 173
    universe.reset()
    play()
})


// Game controls
const isPaused = () => {
    return animationId === null;
};

const renderLoop = () => {
    drawGrid();
    drawCells();
    universe.tickMultiple(tickNumber);
    cellsPtr = universe.cells();
    cells = JSON.stringify(new Uint8Array(memory.buffer, cellsPtr, width * height))
    if (cells == stageBefore0 || cells == stageBefore1) {
        if (playUntilPeriodic) {
            universe.reset()
            play()
        } else {
            drawGrid();
            drawCells();
            pause()
        }
        return
    }
    stageBefore1 = stageBefore0
    stageBefore0 = cells

    animationId = requestAnimationFrame(renderLoop);
};

const play = () => {
    playPauseButton.textContent = "stop";
    renderLoop();
};

const pause = () => {
    playPauseButton.textContent = "start";
    cancelAnimationFrame(animationId);
    animationId = null;
};

const getIndex = (row, column) => {
    return row * width + column;
};

// Drawing
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
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
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

// MAIN
play()