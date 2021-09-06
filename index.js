// <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js" integrity="sha512-WIklPM6qPCIp6d3fSSr90j+1unQHUOoWDS4sdTiR8gxUTnyZ8S2Mr8e10sKKJ/bhJgpAa/qG068RDkg6fIlNFA==" crossorigin="anonymous"></script>

let stepMin = 5;
let stepMax = 40;
let step = stepMin;
let isStepGrow = true;

let strW = 1;

const sceneWidth = document.body.clientWidth || 400;
const sceneHeight = document.body.clientHeight || 400;

const fr = 60;
let x1 = 200;
let y1 = 200;
let x2 = x1 + step;
let y2 = y1;

let directions = [0, 1, 2, 3];
let previousDirection = 0;
let newDirection = null;


let clrH = 240;
let clrS = 100;
let clrL = 50;
let clrO = 1;


function setup() {
  frameRate(fr);
  createCanvas(sceneWidth, sceneHeight);
}
const rndCoinBool = _ => (~~Math.floor(random() * 2) === 0);

const fxNoise = _ => {
  let isMinus = rndCoinBool();
  let rnd = random(10);
  return isMinus ? -rnd : rnd;
};

const stepRun = ({direction: dir = null, localStep}) => {

  let newDir = null;

  const minStepY = 0 + localStep;
  const maxStepY = sceneHeight - localStep;
  const minStepX = 0 + localStep;
  const maxStepX = sceneWidth - localStep;

  let [_x1, _y1, _x2, _y2] = [x1, y1, x2, y2];

  const apply = _ => {
    [x1, y1, x2, y2] = [_x1, _y1, _x2, _y2];
    return null;
  };

  const skip = _ => {
    if (checkTop()) return random([1, 3]);
    if (checkBottom()) return random([1, 3]);
    if (checkLeft()) return random([0, 2]);
    if (checkRight()) return random([0, 2]);
  };

  const stepTop = _ => {
    _y1 = _y2;
    _x1 = _x2;
    _y2 -= localStep;
  };

  const stepRight = _ => {
    _x1 = _x2;
    _y1 = _y2;
    _x2 += localStep;
  };

  const stepBottom = _ => {
    _y1 = _y2;
    _x1 = _x2;
    _y2 += localStep;
  };

  const stepLeft = _ => {
    _x1 = _x2;
    _y1 = _y2;
    _x2 -= localStep;
  };

  const checkTop = _ => _y1 < minStepY || _y2 < minStepY;
  const checkBottom = _ => _y1 > maxStepY|| _y2 > maxStepY;
  const checkLeft = _ => _x1 < minStepX || _x2 < minStepX;
  const checkRight = _ => _x1 > maxStepX || _x2 > maxStepX;
  const check = _ => checkTop() || checkBottom() || checkLeft() || checkRight();

  if(dir === 0) stepTop();
  else if(dir === 1) stepRight();
  else if(dir === 2) stepBottom();
  else if(dir === 3) stepLeft();

  if(check()) return skip();
  else return apply();

};

const isWrongDirection = (a, b) => {
  if(a === 0 && b === 2) return true;
  if(a === 1 && b === 3) return true;
  if(a === 2 && b === 0) return true;
  if(a === 3 && b === 1) return true;
  return false;
};

const getDirection = _ => {
  let direction = random(directions);
  if(isWrongDirection(direction, previousDirection)) return getDirection();
  return direction;
};

const lineProcess = _ => {
  const localStep = step + fxNoise();
  const direction = getDirection();

  newDirection = stepRun({
    direction: newDirection !== null ? newDirection : direction,
    localStep
  });

  if(isStepGrow) step++;
  else step--;

  if(step > stepMax ) isStepGrow = false;
  if(step < stepMin ) isStepGrow = true;

  previousDirection = newDirection !== null ? newDirection : direction;
};

const getPersent = (pers, max) => (max / 100) * pers;
const getProportion = (aMax, bMax, aMin) => bMax * aMin / aMax;

function draw() {
  background('rgba(240,240,240, 0.01)');

  clrH = clrH > 360 ? 0 : clrH + 1;
  let clr = color(`hsla(${clrH}, ${getPersent(50, step)}%, ${100 - getPersent(95, step)}%, ${clrO})`);
  stroke(clr);

  lineProcess();

  strokeWeight(getPersent(15, step));
  line(x1, y1, x2, y2);

}
