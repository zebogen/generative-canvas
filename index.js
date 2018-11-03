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
    const newBranches = [];
    state.agents.forEach((agent) => {
      agent.tick();
      if (Math.random() < .01) {
        newBranches.push(new Agent({ x: agent.x, y: agent.y, color: agent.color }));
      }
    });

    state.agents.push(...newBranches);
  }

  requestAnimationFrame(() => tick());
}
//
// Button actions
//
function start() {
  state.running = true;
}

function stop() {
  state.running = false;
}

function reset() {
  state = getInitialState();
  document.getElementById('image-preview').classList.add('hidden');
  canvas.getContext('2d').clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function saveImage() {
  document.getElementById('canvas-image-download').src = canvas.toDataURL();
  document.getElementById('image-preview').classList.remove('hidden');
}

function getInitialState() {
  return {
    running: false,
    agents: Array.from({ length: 10 }, () => new Agent()),
  };
}

const LINE_TICK_SIZE = 2;

function Agent(options = {}) {
  this.x = options.x || Math.random() * CANVAS_WIDTH;
  this.y = options.y || Math.random() * CANVAS_HEIGHT;
  this.angle = options.angle || Math.random() * 2 * Math.PI;
  this.angleChangeProbability = options.angleChangeProbability || Math.random() / 5;
  this.color = options.color || `rgb(
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

Agent.prototype.branch = function() {

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
