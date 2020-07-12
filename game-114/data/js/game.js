// =============================================================================
// ***** GAME: PINIT *****
// =============================================================================

// == math  ==

function rsin(a) {
  return Math.sin(a * Math.PI);
}

function rcos(a) {
  return Math.cos(a * Math.PI);
}

// == log debug  ==

function logFps(text) {
  document.getElementById("fps").innerHTML = text;
}

function logPin(add, text) {
  if (debugPin) {
    if (!add) {
      document.getElementById("debug").innerHTML = text;
    } else {
      document.getElementById("debug").innerHTML += text;
    }
  }
}

// == FPS ==

FpsMeter = function() {
  this.fpsPeriod = 200;
  this.frames = 0;
  this.period = 0;

  this.checkPeriod = function() {
    var p = Math.floor(new Date().getTime() / this.fpsPeriod);
    if (p == this.period) {
      return;
    } else if (p == this.period + 1) {
      var f0 = Math.floor(this.frames / (this.fpsPeriod / 1000) + 0.5);
      var f1 = (f0 > 0) ? f0 : 0;
      this.period = p;
      this.frames = 0;
      logFps("FPS: " + f1);
    } else {
      this.period = p;
      this.frames = 0;
      logFps("FPS: 0");
    }
  }

  this.frame = function() {
    this.checkPeriod();
    this.frames++;
  }

  this.reset = function() {
    this.checkPeriod();
  }
};

// == Convertor of hex color (as string) to rgba

function convertColorToRGBA(hex, opacity) {
  hex = hex.replace("#", "");
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);
  var result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
  return result;
}

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

// == Animation polyfil ==
var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

// == GameTimer ==

GameTimer = function(animationTick, alwaysSafety) {
  if (!animationTick || animationTick < 0) {
      throw "GameTimer error - animationTick is " + animationTick;
  }
  var animationTick = animationTick;
  var alwaysSafety = alwaysSafety;
  var realTime;
  var waitForTicks;
  var stopCall;
  var callTime;

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
    if (waitForTicks || alwaysSafety) {
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
    if (!requestAnimationFrame) {
      var lastCall = this.callTime;
      var now = new Date().getTime();
      this.callTime = now;
      var delay = animationTick / 2;
      if (now - lastCall < delay) {
        setTimeout(argFunction, delay / 4);
      } else {
        setTimeout(argFunction, 0);
      }
    } else {
       requestAnimationFrame(argFunction);
    }
  }
};

// == Game ==

var gameWait;
var enabled = false;
var points = 0;
var score = 0;
var totalInterpolation = 0;
var life = lifeForOneGame;
var canvas;
var ctx;
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
var animationTick = 25;
var timer = new GameTimer(animationTick, false);
var ticketValid = 0;
var pins0;
var pinsToAdd = 0;
var dir0;
var dir1;
var speed;
var ballAction
var ballOnStart;
var ballCalc;
var ballTotalInterpolation;
var ballTestInterpolation;
var ballFired;
var ballEndInterpolation;
var collision;
var collisionInfo;
var collisionId;
var animationStarted;
var fps = new FpsMeter();
var idx;
var isTS;
var isTO;
var imgMiddleCircleDx$;
var imgMiddleCircleDy$;
var rgbaLifeFontColor;
var ccMiddleCircle;
var ccCircle;
var interpolationFor1px$;

function prepare(isStart) {
  if (!syncPrepare.register()) {
    syncPrepare.pop();
    setTimeout(prepare, animationTick);
    return;
  }
  if (isStart) {
    rgbaLifeFontColor = convertColorToRGBA(lifeFontColor, 0.15);
    ccMiddleCircle = document.createElement('canvas');
    ccCircle = document.createElement('canvas');
    points = 0;
    totalInterpolation = 0;
    dir0 = null;
    dir1 = null;
    speed = null;
    ballMovePosY = null;
    ballOnStart = null;
    ballCalc = null;
    ballFired = null;
    collision = null;
    collisionInfo = null;
    collisionId = null;
    animationStarted = null;
    idx = (level - 1) % lv.length;
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
  radius1$ = Math.floor(radius1 * resizeCoeff + 0.5);
  radius2$ = Math.floor(radius2 * resizeCoeff + 0.5);
  lineLength$ = Math.floor(lineLength * resizeCoeff + 0.5);
  position1x$ = Math.floor(position1x * resizeCoeff + 0.5);
  position1y$ = Math.floor(position1y * resizeCoeff + 0.5);
  position2x$ = Math.floor(position2x * resizeCoeff + 0.5);
  position2y$ = Math.floor(position2y * resizeCoeff + 0.5);
  lineWidth$ = lineWidth * resizeCoeff;
  moveTrack$ = Math.floor(moveTrack * resizeCoeff + 0.5);
  ballSpeedPxPerSecond$ = ballSpeedPxPerSecond * resizeCoeff;
  createImageMiddleCircle();
  ctx.clearRect(0, 0, bgSize$, bgSize$);
  createImageCircle();
  idx = (level - 1) % lv.length;
  isTS = (lv[idx][5] > 0);
  isTO = lv[idx][3];
  collisionS1Radius$ = radius1$ + radius2$ + lineLength$;
  collision2Radius2$ = 2 * radius2$;
  interpolationFor1px$ = 1000 / ballSpeedPxPerSecond$;
  syncPrepare.pop();
}

function synchronizedAction() {
  if (!enabled || syncResize.active() || syncAction.active() || pinsToAdd == 0 || !animationStarted) {
    return;
  }
  syncAction.register();
  if (gameWait) {
    loadSounds();
    gameWait = false;
    timer.reset();
    drawScreen(ticketValid);
    syncAction.pop();
    return;
  }
  var pins = pins0.slice(0);
  ballTestInterpolation = (moveTrack$ - collision2Radius2$) * interpolationFor1px$;
  ballTotalInterpolation = totalInterpolation;
  ballFired = true;
  calcCollision(pins);
}

function calcCollision(pins) {
  var lastPx = -1;
  for (var move=0; move <= collision2Radius2$; move++) {
    var px = Math.floor(ballTestInterpolation + move * interpolationFor1px$ + 0.5);
    if (lastPx == px) {
      continue;
    }
    lastPx = px;
    if (debugPin) {
      collisionInfo = "";
    }
    if (calcCollision1(pins, px)) {
      break;
    }
  }
  ballEndInterpolation = px;
  if (debugPin) {
    logPin(0,"#Calc pin end I=" + (ballTotalInterpolation + ballEndInterpolation));
    logPin(1, collisionInfo);
  }
  ballCalc = true;
}

function calcCollision1(pins, interpolation) {
  var s2x = position2x$;
  var s2y = position2y$ - (interpolation * ballSpeedPxPerSecond$ / 1000);
  var a = getWheelParamDiff(level, ballTotalInterpolation + interpolation, interpolation);
  for (var i=0; i<pins.length; i++) {
    var qa = (pins[i] + a) % 2;
    if (qa < 0) {
      qa += 2;
    }
    var s1y = collisionS1Radius$ * rsin(qa) + position1y$;
    if (s1y < s2y - collision2Radius2$) {
      if (debugPin) {
        collisionInfo += "<br>#Y pos far from pin " + i + " at " + qa + "*PI rad";
      }
      continue;
    }
    var s1x = collisionS1Radius$ * rcos(qa) + position1x$;
    if (s1x < s2x - collision2Radius2$ || s1x > s2x + collision2Radius2$) {
      if (debugPin) {
        collisionInfo += "<br>#X pos far from pin " + i + " at " + qa + "*PI rad";
      }
      continue;
    }
    if (s1x < s2x - collision2Radius2$ || s1x > s2x + collision2Radius2$) {
      if (debugPin) {
        collisionInfo += "<br>#X pos far from pin " + i + " at " + qa + "*PI rad";
      }
      continue;
    }
    if (Math.sqrt((s2x-s1x) * (s2x-s1x) + (s2y-s1y) * (s2y-s1y)) <= collision2Radius2$) {
      collision = true;
      if (debugPin) {
        collisionId = i;
        collisionInfo += "<br>#Collision by pin " + i + " at " + qa + "*PI rad";
      }
      return true;
    } else {
      if (debugPin) {
        collisionInfo += "<br>#Not far from pin " + i + " at " + qa + "*PI rad";
      }
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
  if (!isTS && !isTO) {
    var x = (dir1 == "L") ? -1 : 1;
    var a = x * 0.002 * interpolation * nominalSpeed * speed;
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
    var orientation1;
    if (isTO) {
      orientation1 = (dir0 == "LR" || dir0 == "L") ? -1 : 1;
      orientation1 = (ox == 0) ? orientation1 : -1 * orientation1;
    } else {
      orientation1 = (dir1 == "L") ? -1 : 1;
    }
    a += orientation1 * 0.002 * interpolation1 * nominalSpeed * speed1;
    if (interpolationCalculated >= interpolation) {
      return a;
    }
  }
}

function drawMiddleCircle() {
  ctx.drawImage(ccMiddleCircle, imgMiddleCircleDx$, imgMiddleCircleDy$);
}

function createImageMiddleCircle() {
  var dx = 2 * radius2$ + radius1$ + lineLength$ + 3;
  imgMiddleCircleDx$ = Math.floor(position1x$ - dx + 0.5);
  imgMiddleCircleDy$ = Math.floor(position1y$ - dx + 0.5);
  var dx2 = dx * 2;
  ccMiddleCircle.height = dx2;
  ccMiddleCircle.width = dx2;
  var cctx = ccMiddleCircle.getContext("2d");
  cctx.fillStyle = bgColor;
  cctx.fillRect(0, 0, dx2, dx2);
  cctx.beginPath();
  cctx.arc(position1x$ - imgMiddleCircleDx$, position1y$ - imgMiddleCircleDy$, radius1$, 0, 2 * Math.PI);
  cctx.fillStyle = colors[colorIdx];
  cctx.fill();
  cctx.lineWidth = 1;
  cctx.strokeStyle = convertColorToRGBA(colors[colorIdx], 0.2);
  cctx.stroke();
  if (pinsToAdd > 0 && pinsToAdd < 10) {
    var no = pinsToAdd;
    var x = imageSize[no][0] * resizeCoeff;
    var y = imageSize[no][1] * resizeCoeff;
    cctx.drawImage(imageNo[no], position1x$ - imgMiddleCircleDx$ - x/2, position1y$ - imgMiddleCircleDy$ - y/2, x, y);
  } else if (pinsToAdd >= 10 && pinsToAdd < 100) {
    var no1 = Math.floor(pinsToAdd / 10);
    var no2 = Math.floor(pinsToAdd % 10);
    var x1 = imageSize[no1][0] * resizeCoeff;
    var y1 = imageSize[no1][1] * resizeCoeff;
    var x2 = imageSize[no2][0] * resizeCoeff;
    var y2 = imageSize[no2][1] * resizeCoeff;
    var s = numberSpace * resizeCoeff;
    var xx = x1 + x2 + s;
    cctx.drawImage(imageNo[no1], position1x$ - imgMiddleCircleDx$ - xx/2, position1y$ - imgMiddleCircleDy$ - y1/2, x1, y1);
    cctx.drawImage(imageNo[no2], position1x$ - imgMiddleCircleDx$ - xx/2 + x1 + s, position1y$ - imgMiddleCircleDy$ - y2/2, x2, y2);
  }
}

function drawLife() {
  var fs = Math.floor(lifeFontSizePx * resizeCoeff + 0.5);
  var cc = document.createElement('canvas');
  cc.height = fs + 6;
  cc.width = bgSize$ / 2;
  var cctx = cc.getContext("2d");
  var msg = "" + ((life < 10) ? "0" + life : life);
  cctx.font = "Bold " + fs + "px Verdana, Sans-Serif";
  cc.width = 2.75 * fs + cctx.measureText(msg).width + 3;
  cctx.fillStyle = bgColor;
  cctx.fillRect(0, 0, cc.width, cc.height);
  cctx.beginPath();
  cctx.arc(2 * fs, cc.height / 2, fs / 2, 0, 2 * Math.PI);
  cctx.fillStyle = lifeFontColor;
  cctx.fill();
  cctx.lineWidth = 1;
  cctx.strokeStyle = rgbaLifeFontColor;
  cctx.stroke();
  cctx.font = "Bold " + fs + "px Verdana, Sans-Serif";
  cctx.fillStyle = lifeFontColor;
  cctx.fillText(msg, 2.75 * fs, cc.height - 3 - fs * 0.125);
  var imgLifeY = Math.floor(canvas.width - 1.5 * fs * 0.925 - cc.height/2 + 0.5);
  ctx.drawImage(cc, 0, imgLifeY);
}

function drawBall(interpolationDiff) {
  var y = position2y$;
  if (!ballOnStart) {
    y -= interpolationDiff * ballSpeedPxPerSecond$ / 1000;
  }
  var d = ccCircle.width;
  ctx.drawImage(ccCircle, Math.floor(position2x$ - d/2 + 0.5), Math.floor(y - d/2 + 0.5));
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
  var x1 = r1 * rcos(a) + position1x$;
  var y1 = r1 * rsin(a) + position1y$;
  var x2 = (r1 + lineLength$) * rcos(a) + position1x$ + 1.5;
  var y2 = (r1 + lineLength$) * rsin(a) + position1y$ + 1.5;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth$;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  var x3 = (r1 + lineLength$ + radius2$) * rcos(a) + position1x$ + 0.5;
  var y3 = (r1 + lineLength$ + radius2$) * rsin(a) + position1y$ + 0.5;
  var d = ccCircle.width;
  ctx.drawImage(ccCircle, Math.floor(x3 - d/2 + 0.5), Math.floor(y3 - d/2 + 0.5));
}

function createImageCircle(color) {
  var c1 = colorIdx;
  if (color) {
    c1 = color;
  }
  ccCircle.height = radius2$ * 2;
  ccCircle.width = radius2$ * 2;
  var cctx = ccCircle.getContext("2d");
  cctx.beginPath();
  cctx.arc(radius2$, radius2$, radius2$, 0, 2 * Math.PI);
  cctx.fillStyle = colors[c1];
  cctx.fill();
  cctx.lineWidth = 1;
  cctx.strokeStyle = convertColorToRGBA(colors[c1], 0.2);
  cctx.stroke();
}

function drawScreen(ticket) {
  var previousTotalInterpolation = totalInterpolation;
  var interpolation = timer.interpolation();
  var pinEnd = false;
  var drawBallFired = false;
  var addPin = false;
  if (ballFired) {
    drawBallFired = true;
    ballOnStart = false;
    var now = previousTotalInterpolation + interpolation;
    var maxTest = ballTotalInterpolation + ballTestInterpolation;
    if (!ballCalc) {
      if (now >= maxTest) {
        if (previousTotalInterpolation >= maxTest) {
          // ignore pin (flag ballFired handled too late)
          drawBallFired = false;
        }
        totalInterpolation = maxTest;
      } else {
        totalInterpolation += interpolation;
      }
    } else {
      var max = ballTotalInterpolation + ballEndInterpolation;
      if (now >= max) {
        totalInterpolation = max;
        if (ballCalc) {
          ballFired = false;
          ballCalc = false;
          pinEnd = true;
          if (!collision) {
            addPin = true;
            if (pinsToAdd > 0) {
               if (pinsToAdd > 1) {
                ballOnStart = true;
              }
            }
          }
        }
        if (debugPin) {
          logPin(1, "<br>#Draw pin end I=" +  totalInterpolation);
        }
      } else {
        totalInterpolation += interpolation;
      }
    }
  } else {
      totalInterpolation += interpolation;
  }
  clearBallPath();
  if (pinEnd && !collision) {
    pinsToAdd--;
    createImageMiddleCircle();
  }
  drawMiddleCircle();
  if (pinEnd && collision) {
    life--;
    drawLife();
  }
  var a = getWheelParamDiff(level, totalInterpolation, totalInterpolation - previousTotalInterpolation);
  for (var i=0; i<pins0.length; i++) {
    pins0[i] += a;
    pins0[i] = pins0[i] % 2;
    if (pins0[i] < 0) {
      pins0[i] += 2;
    }
    drawPinOnPosition(pins0[i]);
  }
  if (debugPin && pinEnd && collision) {
    logPin(1, "<br>#Draw collision by pin " + collisionId + " at " + pins0[collisionId] + "*PI rad");
  }
  if (addPin) {
    pins0.push(0.5);
    drawPinOnPosition(0.5);
  }
  if (drawBallFired) {
    var diff = totalInterpolation - ballTotalInterpolation;
    drawBall(diff);
  } else if (ballOnStart) {
    drawBall();
  }
  if (pinEnd) {
    if (collision) {
      playSound("collision");
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
    playSound("pin");
    points++;
    if (!standalone) {
      var totalPoints = score + points;    
      setTimeout(function() { gameeUpdateScore(totalPoints); }, 10);
    }
    if (pinsToAdd == 0) {
      score += points;
      if (standalone) {
        alert("Level " + level + " finished! Score is " + score);
        key = null;
      }
      level++;
      playSound("level");
      setTimeout(function() { startNextLevel(); }, pauseMillis);
      return;
    } else {
      if (dir0 == "LR" || dir0 == "RL") {
        dir1 = (dir1 == "L") ? "R" : "L";
      }
      syncAction.pop();
    }
  }
  if (debugFps) {
    fps.frame();
  }
  if (ticketValid != ticket) {
    return;
  }
  if (!gameWait) {
    timer.call(function() { drawScreen(ticket); });
  }
}

function clearBallPath() {
  var d = ccCircle.width;
  ctx.fillStyle = bgColor;
  ctx.fillRect(position2x$ - d/2 - 2, bgSize$ - moveTrack$, d + 4, moveTrack$);
}

function startNextLevel() {
  if (syncResize.active()) {
    setTimeout(function() { startNextLevel(); }, animationTick);
    return;
  }
  if (!standalone) {
    setTimeout(function() { gameeUpdateScore(score); }, 10);    
  }
  animationWinCoeff = 1;
  timer.reset();
  timer.call(function() { startAnimationLevelEnd(); });
}

function drawEndOrNext(pp, color, next) {
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.fillRect(0, 0, bgSize$, bgSize$);
  ctx.fillStyle = colors[color];
  ctx.beginPath();
  ctx.arc(position1x$ + 0.5, position1y$ + 0.5, radius1$ * animationWinCoeff, 0, 2 * Math.PI);
  ctx.fill();
  if (next) {
    createImageCircle(color);
  }
  for (var i=0; i<pp.length; i++) {
    drawPinOnPosition(pp[i], radius1$ * animationWinCoeff);
  }
  if (debugFps) {
    fps.frame();
  }
}

function startAnimationLevelEnd() {
  var interpolation = timer.interpolation();
  animationWinCoeff += interpolation / levelChangeAnimSpeed * 5;
  drawEndOrNext(pins0, colorIdx, false);
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
    drawEndOrNext(pins0, (level - 1) % colors.length, true);
    timer.call(function() { startAnimationLevelNext(); });
  } else {
    if (!standalone) {
      var idx = (level - 1) % lv.length;
      pinsToAdd = lv[idx][1];
    }
    syncAction.pop();
    startAnimation();
  }
}

function startAnimation() {
  timer.reset();
  drawStatic();
  ballOnStart = true;
  timer.call(function() { drawScreen(++ticketValid); });
  animationStarted = true;
}

function drawStatic() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, bgSize$, bgSize$);
  drawLife();
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
  if (gameWait || isStart) {
     startAnimation();
  } else {
    drawStatic();
  }
  syncResize.pop();
}

// == Enable game ==

var key;

function init() {
  createImageObjects();
  gameWait = true;
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
      init2();
    }
  }
  imageNo[i].src = eval("imgNo" + i);
}

function init2() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  if (!standalone) {
    gameeInitGamee();
  }
  restart();
}

function restart() {
  enabled = false;
  points = 0;
  score = 0;
  life = lifeForOneGame;
  level = levelFrom;
  start();
}

function start() {
  enabled = false;
  syncAction.reset();
  resize(true);
  if (standalone) {
    key = null;
    enableKeyboard();
  } else {
    gameeGameStart();
    var totalPoints = score + points;    
    setTimeout(function() { gameeUpdateScore(totalPoints); }, 10);
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

function gameeUpdateScore(totalScore) {
  gamee.score = totalScore;
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
  controller.enableKeyboard();
}

// == end of file ==
