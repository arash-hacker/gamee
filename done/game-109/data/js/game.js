// =============================================================================
// ***** GAME: PINIT *****
// =============================================================================

// == Sync ==

Sync = function() {
  this.buffer = [];

  this.reset = function() {
    this.buffer = [];
  }

  this.active = function() {
    return this.buffer.length > 0;
  }

  this.register = function() {
    return this.buffer.push(1) == 1;
  }

  this.pop = function() {
    this.buffer.pop();
  }
};

// == GameTimer ==

GameTimer = function(animationTick) {
  var animationTick = animationTick;
  var realTime;
  var waitForTicks;
  var stopCall;

  this.reset = function() {
    realTime = new Date().getTime();
    waitForTicks = false;
  }

  this.interpolation = function() {
    if (!realTime) {
      realTime = new Date().getTime();
      return 0;
    }
    var diff = new Date().getTime() - realTime;
    realTime = new Date().getTime();
    if (waitForTicks) {
      if (diff > animationTick) {
        return animationTick;
      } else {
        return diff;
      }
    } else {
      return diff;
    }
  }

  this.call = function(argFunction, safety) {
    waitForTicks = safety;
    setTimeout(argFunction, 0);
  }
};

// == Game ==

var enabled = false;
var points = 0;
var score = 0;
var totalInterpolation = 0;
var life = lifeForOneGame;
var canvas;
var ctx;
var imgMiddleCircle;
var ballSpeedPxPerSecond$;
var syncPrepare = new Sync();
var syncAction = new Sync();
var syncResize = new Sync();
var animationWinCoeff;
var imageNo = [];
var imageSize = [];
var imageLoad;
var colorIdx;
var bgSize = 640;
var numberSpace = 5;
var bgSize$;
var radius1 = 90;
var radius1$;
var radius2 = 21;
var radius2$;
var lineLength = 138;
var lineLength$;
var lineWidth = 2;
var lineWidth$;
var position1x = 320;
var position1x$;
var position1y = 289;
var position1y$;
var position2x = 320;
var position2x$;
var position2y = 637;
var position2y$;
var resizeCoeff = 1;
var moveTrack = position2y - radius2 - (position1y + radius1 + lineLength);
var moveTrack$;
var timer = new GameTimer(animationTick);
var ticketValid = 0;
var animationTick = 25;
var pins0;
var pinsToAdd = 0;
var dir0;
var dir1;
var speed;
var ballMovePosY;
var ballAction
var ballMove;
var ballMovePx;
var ballOnStart;
var collision;
var animationStarted;

function prepare(isStart) {
  if (!syncPrepare.register()) {
    syncPrepare.pop();
    setTimeout(prepare, animationTick);
    return;
  }

  if (isStart) {
    points = 0;
    totalInterpolation = 0;
    pins0 = null;
    pinsToAdd = 0;
    dir0 = null;
    dir1 = null;
    speed = null;
    ballMovePosY = null;
    ballAction = null;
    ballMove = null;
    ballMovePx = null;
    ballOnStart = null;
    collision = null;
    animationStarted = null;
    var idx = (level - 1) % lv.length;
    pins0 = [];
    pins1 = [];
    pinsToAdd = lv[idx][1];
    dir0 = lv[idx][2];
    if (dir0 == "LR") {
      dir1 = "L";
    } else if (dir0 == "RL") {
      dir1 = "R";
    } else {
      dir1 = dir0;
    }
    speed = getSpeed(level);
    for (var i=0; i<lv[idx][0]; i++) {
      pins0.push(2 * i/lv[idx][0]);
    }
  }

  colorIdx = (level - 1) % colors.length;
  bgSize$ = bgSize * resizeCoeff;
  canvas.width = bgSize$;
  canvas.height = bgSize$;
  ctx.clearRect(0, 0, bgSize$, bgSize$);
  radius1$ = radius1 * resizeCoeff;
  radius2$ = radius2 * resizeCoeff;
  lineLength$ = lineLength * resizeCoeff;
  position1x$ = position1x * resizeCoeff;
  position1y$ = position1y * resizeCoeff;
  position2x$ = position2x * resizeCoeff;
  position2y$ = position2y * resizeCoeff;
  lineWidth$ = lineWidth * resizeCoeff;
  moveTrack$ = moveTrack * resizeCoeff;
  ballSpeedPxPerSecond$ = ballSpeedPxPerSecond * resizeCoeff;
  ballMovePosY$ = position2y$;
  createImageMiddleCircle();
  syncPrepare.pop();
}

function synchronizedAction() {
  if (!enabled || syncResize.active() || syncAction.active() || pinsToAdd == 0 || !animationStarted) {
    return;
  }
  ballMovePosY$ = position2y$;
  var track2 = moveTrack$ - 2 * radius2$;
  var interpolationFor1px = 1000 / ballSpeedPxPerSecond$;
  var testInterpolation = track2 * interpolationFor1px;
  for (var move=0; move <= 2 * radius2$; move++) {
    var px = testInterpolation + move * interpolationFor1px;
    if (calcCollision(px)) {
      break;
    }
  }
  ballMove = true;
  ballMovePx = px;
}

function calcCollision(interpolation) {
  var s2x = position2x$;
  var s2y = position2y$ - (interpolation * ballSpeedPxPerSecond$ / 1000);
  var a = getWheelParamDiff(level, totalInterpolation + interpolation, interpolation) % 2;
  var qa;
  for (var i=0; i<pins0.length; i++) {
    qa = (pins0[i] + a) % 2;
    if (qa < 0) {
      qa += 2;
    }
    var s1y = Math.floor(position1y$ + (radius1$ + radius2$ + lineLength$) * Math.sin(qa * Math.PI) + 0.5) + 0.5;
    if (s1y < s2y - 2 * radius2$) {
      continue;
    }
    var s1x = Math.floor(position1x$ + (radius1$ + radius2$ + lineLength$) * Math.cos(qa * Math.PI) + 0.5) + 0.5;
    if (s1x < s2x - 2 * radius2$ || s1x > s2x + 2 * radius2$) {
      continue;
    }
    if (s1x < s2x - 2 * radius2$ || s1x > s2x + 2 * radius2$) {
      continue;
    }
    if (Math.sqrt((s2x-s1x) * (s2x-s1x) + (s2y-s1y) * (s2y-s1y)) <= 2 * radius2$) {
      collision = true;
      return true;
    }
  }
  collision = false;
  return false;
}


function getWheelParamDiff(level, interpolationSum, interpolation) {
  var interpolationSum0 = interpolationSum - interpolation;
  if (interpolation == 0 || interpolationSum0 < 0) {
    return 0;
  }
  var idx = (level - 1) % lv.length;
  var isTS = (lv[idx][5] > 0);
  var isTO = lv[idx][3];
  if (isTS == 0 && !isTO) {
    var x = (dir1 == "L") ? -1 : 1;
    var a = (x * 0.002 * interpolation * nominalSpeed * speed) % 2;
    return a;
  }
  var tsChange = speedChangeSeconds * 1000;
  var toChange = orientationChangeSeconds * 1000;
  var a = 0;
  var interpolation1 = interpolation;
  var interpolationCalculated = 0;
  var ts = tsChange - interpolationSum0 % tsChange;
  var to = toChange - interpolationSum0 % toChange;
  while (true) {
    var restInterpolation = (interpolation - interpolationCalculated);
    if ((isTS && ts <= restInterpolation) || (isTO && to <= restInterpolation)) {
      if (isTS && ts > 0 && ts == to) {
        interpolation1 = ts;
      } else if (isTO && to > 0 && to < ts) {
        interpolation1 = to;
      } else if (isTS && ts > 0) {
        interpolation1 = ts;
      } else {
        interpolation1 = restInterpolation;
      }
    } else {
      interpolation1 = restInterpolation;
    }
    interpolationSum0 += interpolation1;
    ts = tsChange - interpolationSum0 % tsChange;
    to = toChange - interpolationSum0 % toChange;
    interpolationCalculated += interpolation1;
    var sx = Math.floor((interpolationSum0 - 1) / tsChange) % 2;
    var ox = Math.floor((interpolationSum0 - 1) / toChange) % 2;
    var speed1 = speed;
    if (isTS) {
      speed1 = (sx == 0) ? speed : speed * lv[idx][5];
    }
    var orientation1 = (dir0 == "LR" || dir0 == "L") ? -1 : 1;
    if (isTO) {
      orientation1 = (ox == 0) ? orientation1 : -1 * orientation1;
    }
    a += orientation1 * 0.002 * interpolation1 * nominalSpeed * speed1;
    if (interpolationCalculated >= interpolation) {
      return a;
    }
  }
}

function drawMiddleCircle() {
  ctx.drawImage(imgMiddleCircle, 0, 0);
  if (pinsToAdd > 0 && pinsToAdd < 10) {
    var no = pinsToAdd;
    var x = imageSize[no][0] * resizeCoeff;
    var y = imageSize[no][1] * resizeCoeff;
    ctx.drawImage(imageNo[no], position1x$ - x/2, position1y$ - y/2, x, y);
  } else if (pinsToAdd >= 10 && pinsToAdd < 100) {
    var no1 = Math.floor(pinsToAdd / 10); 
    var no2 = Math.floor(pinsToAdd % 10);
    var x1 = imageSize[no1][0] * resizeCoeff;
    var y1 = imageSize[no1][1] * resizeCoeff;
    var x2 = imageSize[no2][0] * resizeCoeff;
    var y2 = imageSize[no2][1] * resizeCoeff;
    var s = numberSpace * resizeCoeff;
    var xx = x1 + x2 + s;
    ctx.drawImage(imageNo[no1], position1x$ - xx/2, position1y$ - y1/2, x1, y1);
    ctx.drawImage(imageNo[no2], position1x$ - xx/2 + x1 + s, position1y$ - y2/2, x2, y2);
  }
}

function createImageMiddleCircle() {
  var cc = document.createElement('canvas');
  cc.height = bgSize$;
  cc.width = bgSize$;
  var cctx = cc.getContext("2d");
  cctx.fillStyle = bgColor;
  cctx.beginPath();
  cctx.fillRect(0, 0, bgSize$, bgSize$);
  cctx.fillStyle = colors[colorIdx];
  cctx.beginPath();
  cctx.arc(position1x$ + 0.5, position1y$ + 0.5, radius1$, 0, 2 * Math.PI);
  cctx.fill();
  imgMiddleCircle = new Image();
  imgMiddleCircle.src = cc.toDataURL("image/png");
}

function drawLife() {
  var fs = Math.floor(lifeFontSizePx * resizeCoeff + 0.5);
  ctx.fillStyle = lifeFontColor;
  ctx.beginPath();
  ctx.arc(2 * fs, canvas.width - 1.5 * fs * 0.925, fs /   2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.font = "Bold " + fs + "px Verdana, Sans-Serif";
  var msg = "" + ((life < 10) ? "0" + life : life);
  ctx.fillStyle = lifeFontColor;
  ctx.fillText(msg, 2.75 * fs, canvas.width - fs);
}

function drawBall(interpolation) {
  var x = position2x$;
  var y = position2y$;
  ballMovePosY$ -= (interpolation * ballSpeedPxPerSecond$ / 1000);
  ballMovePx -= interpolation;
  y = Math.floor(ballMovePosY$ - 0.5) + 0.5;
  ctx.fillStyle = colors[colorIdx];
  ctx.beginPath();
  ctx.arc(position2x$, ballMovePosY$, radius2$, 0, 2 * Math.PI);
  ctx.fill();
}

function drawPinOnPosition(a, radius, cc) {
  var r1 = radius1$;
  if (radius) {
    r1 = radius;
  }
  var c1 = colorIdx;
  if (cc) {
    c1 = cc;
  }
  var x1 = Math.floor(position1x$ + r1 * Math.cos(a * Math.PI) + 0.5) + 0.5;
  var y1 = Math.floor(position1y$ + r1 * Math.sin(a * Math.PI) + 0.5) + 0.5;
  var x2 = Math.floor(position1x$ + (r1 + lineLength$) * Math.cos(a * Math.PI) + 0.5) + 0.5;
  var y2 = Math.floor(position1y$ + (r1 + lineLength$) * Math.sin(a * Math.PI) + 0.5) + 0.5;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth$;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  var x3 = Math.floor(position1x$ + (r1 + radius2$ + lineLength$) * Math.cos(a * Math.PI) + 0.5) + 0.5;
  var y3 = Math.floor(position1y$ + (r1 + radius2$ + lineLength$) * Math.sin(a * Math.PI) + 0.5) + 0.5;
  ctx.fillStyle = colors[c1];
  ctx.beginPath();
  ctx.arc(x3, y3, radius2$, 0, 2 * Math.PI);
  ctx.fill();
}

function drawScreen(ticket) {
  if (ticketValid != ticket) {
    return;
  }
  var interpolation = timer.interpolation();
  var pinEnd = false;
  if (ballMove && interpolation > ballMovePx) {
    ballOnStart = false;
    interpolation = ballMovePx;
    pinEnd = true;
    ballMove = false;
    if (!collision && pinsToAdd > 0) {
      ballMovePosY$ = position2y$;
      if (pinsToAdd > 1) {
        ballOnStart = true;
      }
      pins0.push(0.5);
    }
  }
  if (pinEnd && !collision) {
    pinsToAdd--;
  }
  drawMiddleCircle();
  if (pinEnd && collision) {
    life--;
  }
  drawLife();
  totalInterpolation += interpolation;
  var a = getWheelParamDiff(level, totalInterpolation, interpolation);
  for (var i=0; i<pins0.length; i++) {
    pins0[i] += a;
    pins0[i] = pins0[i] % 2;
    if (pins0[i] < 0) {
      pins0[i] += 2;
    }
    drawPinOnPosition(pins0[i]);
  }
  if (ballMove) {
    drawBall(interpolation);
  } else if (ballOnStart) {
    drawBall(0);
  }
  if (pinEnd) {
    if (collision) {
      drawBall(interpolation);
      playSound(soundCollisionSrc);
      if (life > 0) {
        setTimeout(function() { startNextLevel(); }, pauseMillis);
      } else {
        if (standalone) {
          alert("Score is " + (score + points));
          key = null;
          restart();
        } else {
          setTimeout(function() { gameeGameOver(); }, pauseMillis);
        }
      }
      return;
    }
    playSound(soundPinSrc);
    points++;
    if (!standalone) {
      setTimeout(function() { gameeUpdateScore(score + points); }, 10);
    }
    if (pinsToAdd == 0) {
      score += points;
      if (standalone) {
        alert("Level " + level + " finished! Score is " + score);
        key = null;
      }
      level++;
      playSound(soundNextLevelSrc);
      setTimeout(function() { startNextLevel(); }, pauseMillis);
      return;
    } else {
      if (dir0 == "LR" || dir0 == "RL") {
        dir1 = (dir1 == "L") ? "R" : "L";
      }
      syncAction.pop();
    }
  }
  if (ticketValid != ticket) {
    return;
  }
  timer.call(function() { drawScreen(ticket); });
}

function startNextLevel() {
  if (syncResize.active()) {
    setTimeout(function() { startNextLevel(); }, animationTick);
    return;
  }
  if (!standalone) {
    var idx = (level - 1) % lv.length;
    pinsToAdd = lv[idx][1]; 
    setTimeout(function() { gameeUpdateScore(score + pinsToAdd); console.log("====>>",score + pinsToAdd)}, 10);
  }
  animationWinCoeff = 1;
  timer.reset();
  timer.call(function() { startAnimationLevelEnd(); });
}

function drawEndOrNext(pp, cc) {
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.fillRect(0, 0, bgSize$, bgSize$);
  ctx.fillStyle = colors[cc];
  ctx.beginPath();
  ctx.arc(position1x$ + 0.5, position1y$ + 0.5, radius1$ * animationWinCoeff, 0, 2 * Math.PI);
  ctx.fill();
  for (var i=0; i<pp.length; i++) {
    drawPinOnPosition(pp[i], radius1$ * animationWinCoeff, cc);
  }
}

function startAnimationLevelEnd() {
  var interpolation = timer.interpolation();
  animationWinCoeff += interpolation / levelChangeAnimSpeed * 5;
  drawEndOrNext(pins0, colorIdx);
  if (animationWinCoeff < 5) {
    timer.call(function() { startAnimationLevelEnd(); });
  } else {
    prepare(true);
    timer.reset();
    timer.call(function() { startAnimationLevelNext(); });
  }
}

function startAnimationLevelNext() {
  var interpolation = timer.interpolation();
  animationWinCoeff -= interpolation / levelChangeAnimSpeed * 5;
  if (animationWinCoeff < 1) {
    animationWinCoeff = 1;
  }
  if (animationWinCoeff > 1) {
    drawEndOrNext(pins0, (level - 1) % colors.length);
    timer.call(function() { startAnimationLevelNext(); });
  } else {
    if (!standalone) {
      var idx = (level - 1) % lv.length;
      pinsToAdd = lv[idx][1];
      setTimeout(function() { gameeUpdateScore(score); }, 10);
    }
    startAnimation();
  }
}

function startAnimation() {
  timer.reset();
  ballOnStart = true;
  timer.call(function() { drawScreen(++ticketValid); });
  animationStarted = true;
}

function resize(isStart) {
  if (syncAction.active()) {
    setTimeout(function() { resize(); }, animationTick);
    return;
  }
  syncResize.register();
  if (syncAction.active()) {
    syncResize.pop();
    setTimeout(function() { resize(); }, animationTick);
    return;
  }
  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var size = width > height ? height : width;
  resizeCoeff = size / bgSize;
  prepare(isStart);
  syncResize.pop();
}

// == Enable game ==

var key;

function init() {
  createImageObjects();
  checkImgLoad();
}

function checkImgLoad() {
  for (var i=0; i<10; i++) {
    if (!imageLoad) {
      setTimeout(function() { checkImgLoad(); }, 10);
      return;
    }
  }
  init2();
}

function init2() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  if (!standalone) {
    gameeInitGamee();
  }
  restart();
}

function createImageObjects() {
  readImage(0);
}

function readImage(i) {
  imageNo[i] = new Image();
  imageNo[i].onload = function() {
    imageSize[i] = [];
    imageSize[i][0] = this.width;
    imageSize[i][1] = this.height;
    i++;
    if (i < 10) {
      readImage(i);
    } else {
      imageLoad = true;
    }
  }
  imageNo[i].src = eval("imgNo" + i);
}

function restart() {
  enabled = false;
  points = 0;
  score = 0;
  life = 10;
  level = 1;
  start(true);
}


function start(isStart) {
  enabled = false;
  syncAction.reset();
  if (isStart) {
    resize(isStart);
  }
  startAnimation();
  if (standalone) {
    key = null;
    enableKeyboard();
  } else {
    gameeGameStart();
    setTimeout(function() { gameeUpdateScore(score + points); }, 10);
  }
  enabled = true;
}

function enableKeyboard() {
  document.onkeyup = function(evt) {
    key = null;
  }
  document.onkeydown = function(evt) {
    if (key != null) {
      return;
    }
    evt = evt || window.event;
    if (evt.keyCode == 13 || evt.keyCode == 83) {
      key = true;
      synchronizedAction();
    }
  };
}

(function create() {
  window.addEventListener ? window.addEventListener("load", init, false) : window.attachEvent("onload", init);
  window.onresize = function() {
    resize();
  }
})();

// == GAMEE ==

function gameeUpdateScore() {
  gamee.score = score + points;
}

function gameeResume() {
  drawScreen(++ticketValid);
}

function gameePause() {
  ticketValid++;
}

function gameeUnpause() {
  drawScreen(++ticketValid);
}

function gameeStop() {
  ticketValid++;
}

function gameeRestart() {
  restart();
}

function gameeGameStart() {
  gamee.gameStart();
}

function gameeGameOver() {
  gamee.gameOver();
}

function gameeInitGamee() {
  gamee.onResume = gameeResume;
  gamee.onPause = gameePause;
  gamee.onUnpause = gameeUnpause;
  gamee.onStop = gameeStop;
  gamee.onRestart = gameeRestart;
  controller = gamee.controller.requestController('OneButton');
  controller.buttons.button.on('keydown', function() { synchronizedAction(); });
  // controller.enableKeyboard();
}

// == end of file ==
