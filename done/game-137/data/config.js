var HEIGHT_GROUND = 120;
var HEIGHT_ISLANDS = 130;
var HEIGHT_WATER = 90;
var HEIGHT_ROPE = +35;

var PLAYER_X = 240;
var PLAYER_Y = 640 - HEIGHT_ISLANDS;
var GHOST_X = PLAYER_X;
var GHOST_Y = PLAYER_Y;
var GHOST_ALPHA = 0.5;

var AVATAR_MAX_WIDTH = 60;
var AVATAR_MAX_HEIGHT = 60;
var AVATAR_BG_MAX_WIDTH = 70;
var AVATAR_BG_MAX_HEIGHT = 70;

var PINATA = false;
var BASE_GRAVITY = 525;
var JUMP_SPEED = -470;
var DOWN_SPEED = 1500;
var MOVE_SPEED = 420;
var SCORE_MOVE_SPEED_MAX = 350;

var BUILD_TYPE = Implementation.GameeV2;
var TEST = false;
var CONSOLE_OUTPUT = true;
var GHOST_MODE_ENABLED = false;

var GameState =
{
	InMenu: 0,
	Ready: 1,
	InGame: 2,
	Dead: 3,
	GhostOnly: 4
};

var GhostMode =
{
	None: 0, // not implemented
	Off: 1,  // normal game
	On: 2    // ghost mode
};

var Tasks =
{
	SetUpTweensFromData: 0,
	SetUpTween0FromData: 1,
	JumpDown: 2,
	JumpUp: 3,
};

var islands =
[
	{ name: "ostrov01", x: 186, y: 108, index: 0 },
	{ name: "ostrov02", x: 154, y: 108, index: 1 },
	{ name: "ostrov03", x: 126, y: 108, index: 2 },
	{ name: "ostrov04", x: 106, y: 108, index: 3 },
	{ name: "ostrov05", x:  86, y: 108, index: 4 },
	{ name: "ostrov06", x:  62, y: 108, index: 5 }
];

var trees =
[
	"smrk_1",
	"smrk_2",
	"smrk_3",
	"smrk_4",
	"smrk_5",
];

var difficulties =
[
	[islands[1], islands[2], islands[3], islands[4]],
	[islands[2], islands[3], islands[4], islands[5], islands[1]],
	[islands[2], islands[3], islands[4], islands[5]],
	[islands[3], islands[4], islands[5], islands[2]],
	[islands[3], islands[4], islands[5]],
	[islands[4], islands[5], islands[3]]
];
