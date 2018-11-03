const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

let state, canvas;

document.addEventListener('DOMContentLoaded', () => init());

function init() {
  canvas = document.getElementById('root');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  state = getInitialState()

  tick();
}

function tick() {
  if (state.running) {
    state.agents.forEach(agent => agent.tick());
  }

  requestAnimationFrame(() => tick());
}

function start() {
  state.running = true;
}

function stop() {
  state.running = false;
}

function getInitialState() {
  return {
    running: false,
    agents: Array.from({ length: 10 }, () => new Agent()),
  };
}

const LINE_TICK_SIZE = 2;

function Agent() {
  this.x = Math.random() * CANVAS_WIDTH;
  this.y = Math.random() * CANVAS_HEIGHT;
  this.angle = Math.random() * 2 * Math.PI;
  this.angleChangeProbability = Math.random() / 5;
  this.color = `rgb(
    ${Math.floor(Math.random() * 255)},
    ${Math.floor(Math.random() * 255)},
    ${Math.floor(Math.random() * 255)}
  )`;
}

Agent.prototype.tick = function() {
  const newX = this.x + Math.sin(this.angle) * LINE_TICK_SIZE;
  const newY = this.y + Math.cos(this.angle) * LINE_TICK_SIZE;

  const loopX = newX > CANVAS_WIDTH;
  const loopY = newY > CANVAS_HEIGHT;

  drawLine(
    this.x,
    this.y,
    loopX ? CANVAS_WIDTH : newX,
    loopY ? CANVAS_HEIGHT : newY,
    this.color
  );

  this.x = loopX ? 0 : newX;
  this.y = loopY ? 0 : newY;

  if (Math.random() < this.angleChangeProbability) this.updateAngle();
}

Agent.prototype.updateAngle = function() {
  const angleDelta = Math.random() * Math.PI / 4;
  this.angle = Math.random() < .5
    ? this.angle + angleDelta
    : this.angle - angleDelta;
}

//
// Helpers
//
function drawLine(startX, startY, endX, endY, color) {
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.stroke();
}
