// =============================================================================
// ***** GAME: PINIT *****
// =============================================================================

// == for Gamee standalone = false ==
var standalone = false;

// == Levels ==

// -- level definition --
var lv = [];
// arg 1: pins on middle circle
// arg 2: pins to add
// arg 3: movement (R, L, RL, LR), R - right, L - left, RL - right, left, right, left etc.
// arg 4: true - oritention changed after time or false after pin
// arg 5: speed coeff, 1 = nominalSpeed, eg. 1.5 = nominalSpeed + 50%
// arg 6: speed change coeff, 0 = no change, eg. 1.5 = speed +50% or 0.7 = speed -30%
lv[0] = [ 1, 7, "L", false, 1, 0];
lv[1] = [ 7, 6, "R", false, 1.1, 0];
lv[2] = [ 8, 6, "L", false, 1.3, 0];
lv[3] = [ 8, 6, "RL", true, 1.4, 0];
lv[4] = [ 10, 6, "R", false, 1.2, 1.3];
lv[5] = [ 1, 17, "L", false, 1.5, 0];
lv[6] = [ 9, 10, "R", false, 1.4, 0];
lv[7] = [ 5, 13, "RL", true, 1.5, 0];
lv[8] = [ 10, 10, "L", false, 1.6, 0.7];
lv[9] = [ 3, 17, "LR", true, 1.5, 0];
lv[10] = [ 12, 12, "R", false, 1, 0];
lv[11] = [ 2, 14, "L", false, 2.1, 0];
lv[12] = [ 8, 11, "RL", true, 1.8, 0];
lv[13] = [ 6, 13, "LR", true, 1.7, 0.8];
lv[14] = [ 1, 20, "L", false, 1, 1.9];
lv[15] = [ 8, 12, "RL", false, 1.6, 0.9];
lv[16] = [ 9, 11, "L", false, 2.1, 0.8];
lv[17] = [ 4, 21, "RL", true, 1, 1.4];
lv[18] = [ 12, 12, "R", false, 1.4, 1.2];
lv[19] = [ 1, 24, "LR", true, 1.2, 1.9];
lv[20] = [ 3, 12, "L", false, 2.5, 0];
lv[21] = [ 8, 12, "R", false, 3.2, 0.3];
lv[22] = [ 10, 10, "RL", true, 1.8, 1.5];
lv[23] = [ 1, 25, "L", false, 1.3, 1.3];
lv[24] = [ 5, 21, "LR", true, 2.5, 0.7];
lv[25] = [ 4, 12, "L", false, 2.5, 0];
lv[26] = [ 9, 12, "R", false, 3.2, 0.3];
lv[27] = [ 11, 10, "RL", true, 1.8, 1.5];
lv[28] = [ 2, 25, "L", false, 1.3, 1.3];
lv[29] = [ 6, 21, "LR", true, 2.5, 0.7];
lv[30] = [ 4, 13, "R", true, 2.5, 0];
lv[31] = [ 9, 12, "R", false, 3.3, 0.3];
lv[32] = [ 11, 10, "RL", true, 1.8, 1.5];
lv[33] = [ 2, 25, "L", false, 1.3, 1.3];
lv[34] = [ 6, 21, "LR", true, 2.6, 0.7];
lv[35] = [ 5, 12, "R", false, 2.5, 0];
lv[36] = [ 9, 12, "L", false, 3.3, 0.4];
lv[37] = [ 11, 10, "RL", true, 1.8, 1.5];
lv[38] = [ 2, 25, "R", false, 1.4, 1.5];
lv[39] = [ 6, 21, "RL", true, 2.5, 0.3];

// -- wheel rotation change - speed depended on time --
var speedChangeSeconds = 2;

// -- wheel rotation change - orientation depended on time --
var orientationChangeSeconds = 3;

// -- start from level --
var levelFrom = 1;

// -- level colors (only hex format as string e.g. "FF5555" ) --
var colors = [ "#FF5555", "#A655FF", "#3CE068", "#55B7FF", "#FFC055", "#FF55B7" ];

// -- other colors --
var bgColor = "#F9F9F9";
var lineColor = "#C5C5C5";

// -- rotation speed of pins --
// formula: 0.002 * interpolation * nominalSpeed * speed * PI
// e.g for testing use 1/10
// (original 1/4)
var nominalSpeed = 1/4;

// -- speed formula is based on level --
// one repeat of levels => + 50%
function getSpeed(level) {
  var idx = (level - 1) % lv.length;
  var ss = 1 + Math.floor((level - 1) / lv.length) * 0.5;
  return ss * lv[idx][4];
}

// -- nominal speed of ball (pin for addition) on screen size 640px --
var ballSpeedPxPerSecond = 2000;

// -- animation length in millis of one part (from two) of level change --
var levelChangeAnimSpeed = 400;

// -- pause in millis when collision -- 
var pauseMillis = 500;

// -- life in game --
var lifeForOneGame = 10;

// -- font size for life (in px on screen size 640px) --
var lifeFontSizePx = 20;

// -- font color for life --
var lifeFontColor = "#B5B5B5";

// -- sounds --
var soundSrc = {
  pin: { src: "sound/pin.mp3" },
  collision: { src: "sound/collision.mp3" },
  level: { src: "sound/level.mp3" }
};

// -- can be true only for development version --
var debugFps = false;
var debugPin = false;

// == end of file ==

