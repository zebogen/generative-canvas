const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

let state, canvas, userOptionNodes;

document.addEventListener('DOMContentLoaded', () => init());



function init() {
  canvas = document.getElementById('root');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  userOptionNodes = {
    numberOfAgents: document.getElementById('number-of-agents'),
    angleChangeProbability: document.getElementById('angle-change-probability'),
    branchProbability: document.getElementById('branch-probability'),
  };

  state = getInitialState();

  tick();
}

function tick() {
  if (state.running) {
    const newBranches = [];
    const branchProbability = parseFloat(userOptionNodes.branchProbability.value);
    state.agents.forEach((agent) => {
      agent.tick();
      if (Math.random() < branchProbability) {
        newBranches.push(
          new Agent({
            x: agent.x,
            y: agent.y,
            color: chanceEvent(.2, () => randomColor(), () => agent.color),
          })
        );
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
  canvas.getContext('2d').clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function getInitialState() {
  const { angleChangeProbability, numberOfAgents } = userOptionNodes;

  return {
    running: false,
    agents: Array.from(
      { length: parseInt(numberOfAgents.value) || 10 },
      () => new Agent({
        angleChangeProbability: angleChangeProbability.value,
      })
    )
  };
}

const LINE_TICK_SIZE = 2;

function Agent(options = {}) {
  this.x = options.x || Math.random() * CANVAS_WIDTH;
  this.y = options.y || Math.random() * CANVAS_HEIGHT;
  this.angle = options.angle || Math.random() * 2 * Math.PI;
  this.angleChangeProbability = options.angleChangeProbability || Math.random() / 5;
  this.color = options.color || randomColor();
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

  chanceEvent(this.angleChangeProbability, () => this.updateAngle());
}

Agent.prototype.updateAngle = function() {
  const angleDelta = Math.random() * Math.PI / 4;
  const sign = chanceEvent(.5, () => 1, () => -1);
  this.angle = this.angle + (angleDelta * sign);
}

Agent.prototype.updateColor = function() {
  for (let key in this.color) {
    const factor = .9 + (Math.random() / 5);
    this.color[key] = Math.round(this.color[key] * factor);
  }
}

//
// Helpers
//
function drawLine(startX, startY, endX, endY, color) {
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  const { r, g, b } = color;
  ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.stroke();
}

function chanceEvent(value, hitFn, missFn = () => {}) {
  return Math.random() < value ? hitFn() : missFn();
}

function randomColor(upperBound = 255) {
  return {
    r: Math.round(Math.random() * upperBound),
    g: Math.round(Math.random() * upperBound),
    b: Math.round(Math.random() * upperBound)
  };
}
