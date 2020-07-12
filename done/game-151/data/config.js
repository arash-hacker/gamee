// Game config

// Intro
var INTRO_CAMERA_UNZOOMING_DURATION = 1000;     // oddalovanie kamery intra (1 sek)
var INTRO_ZOOM_RATIO = 4;                       // 4x priblizenie gumy

// Finish
var FINISH_IMAGE_DURATION = 1000;               // 1 sekunda

// Player
var PLAYER_SETTINGS =
{
    intro_x: 320, intro_y: 380,
    intro_scale: 0.125,
    starting_x: 240, starting_y: 455,
    bodySize: 26,
    jumpingBodySize: 26,
    deadHeight: 720,
    scale: 1,										// velkost textury (100%)
    jumpSpeed: 450,									// skok (Y)
    maxJumpSpeed: -540,                             // max rychlost vyskocenia
    jumpingTimer: 150,                              // po akom max. case koleso vyskoci (100 ms)
    acceleration: 1,								// zrychlovanie
    deceleration: 1.1,								// brzdenie
    minSpeed: 50,									// min. rychlost pri brzdenie
    initialSpeed: 60,                               // pociatocna rychlost pri restarte
    initialMaxSpeed: 80,							// max. rychlost na zaciatku hry
    totalMaxSpeed: 210,								// uplna max. rychlost
    maxSpeedIncrease: 0.75,							// zrychlovanie max. rychlosti
};

var MUSIC_VOLUME = 25;                              // hlasitost hudby (0 - 100)
var BASE_GRAVITY = 950;							    // gravitacia (Y)
var WHEEL_ROTATION_SPEED = 0.2;				    	// otacanie kolesa
var POINTS_PER_DISTANCE = 0.003;					// skore / vzialenost
var PLAYER_SPEED_RATIO = 8;

// Platforms + bridges
var PLATFORM =
{
    minWidth: 1800,		            // min. dlzka platformy
    maxWidth: 2400,		            // max. dlzka platformy
    minHeight: 160,		            // min. vyska platformy
    maxHeight: 320,		            // max. vyska platformy
    maxHeightDifferenceDown: 100,   // max. vyskovy rozdiel medzi platformami
    maxHeightDifferenceUp: -80      // max. vyskovy rozdiel medzi platformami
};

var INTRO_PLATFORM =			// zaciatocna platforma (intro)
{
    x: 5, y: 480,
    length: 1600
};

var RESTART_PLATFORM =			// zaciatocna platforma (restart hry)
{
    x: 5, y: 480,
    length: 600
};

var platforms =
[
	{ start: "platform_01", end: "platform_01_end" },
	{ start: "platform_02", end: "platform_02_end" }
];

// Bridge
var BRIDGE =
{
    minLength: 150,		            // min. dlzka
    maxLength: 600,		            // max. dlzka
    probability: 0.25,              // pravdepodobnost mostov (0-1)
    maxSpeed: 80,                   // max. rychlost po moste bez toho aby sa prepadol
    breakFromJumpProbability: 1,    // pravdepodobnost prepadnutia mosta pri skoceni (0-1)
    minLengthFor1Pillar: 400,       // pri dlzke 400+ bude mat most 1 pilier
    minLengthFor2Pillars: 550       // pri dlzke 550+ bude mat most 2 piliere
};

// Distances
var itemsDistanceConfig =
{
    startDistances: { min: 480, max: 530 },
    endDistances: { min: 350, max: 400 },
    decreaseSpeed: 0.02
}

var MIN_DISTANCE_BETWEEN_SIGN_AND_BARRIER = 460;		// min. vzdialenost medzi znackou a barierou
var MAX_DISTANCE_BETWEEN_SIGN_AND_BARRIER = 470;		// max. vzdialenost medzi znackou a barierou
var MIN_DISTANCE_FROM_BORDER = 480;					    // min. vzdialenost objektu od okraju platformy
var MIN_DISTANCE_BETWEEN_PLATFORMS = 300;
var MAX_DISTANCE_BETWEEN_PLATFORMS = 340;

// Decorations
var tree = { name: "tree_01", width: 134, height: 230, y: 230, group: 5, probability: 0.55 };
var skyJump = { name: "sky_jump", width: 652, height: 410, x: 55, y: 500, group: 0, probability: 0.2, }; // skokansky mostik
var jumper = { name: "jumper", width: 40, height: 42, y: 167, group: 0, maxSpeed: 300 }; // lyziar
var bridgeHole = { name: "bridge_hole", width: 96, height: 52, y: 0, group: 5 };

// Signs
var SIGNS =
{
    x: 515,
    y: 510,
    distanceBeforeObject: 800,
    distanceAfterObject: 100
};

var signAnimal = { name: "road sign_01", probability: 1.0 };
var signIce =    { name: "road sign_02", probability: 1.0 };
var signStone =  { name: "road sign_03", probability: 1.0 };
var sign80 = { name: "road sign_04", probability: 1.0 };
var sign50 = { name: "road sign_05", probability: 1.0 };

var decorations =
[
	tree,
	signAnimal,
	signIce,
	signStone,
	sign80,
	sign50
]

// Barriers
var mostik = { name: "mostik", width: 188, height: 98, y: -60, sign: null, probability: 0.15 }; // skakaci most

var igloo = { name: "igloo", width: 176, height: 106, y: 35, minX: 0, sign: null };
var sauna = { name: "sauna", width: 114, height: 26, y: 15, minX: 0, sign: null, nextItem: { name: "sauna_doors_close", width: 40, height: 60, x: 19, y: -7, minX: 0, sign: null, hasBody: false } };
var los = { name: "los", width: 80, height: 100, y: 10, minX: 0, sign: signAnimal, tileSprite: true };
var stone = { name: "stone", width: 120, height: 67, y: 35, minX: 0, sign: signStone }
var snowman = { name: "snowman", width: 65, height: 50, y: 18, minX: 0, sign: null, nextItem: { name: "snowman_head", width: 54, height: 48, x: -4, y: -38, minX: 0, sign: null } }
var yeti = { name: "yeti", width: 311, height: 633, y: 70, minX: 10, sign: sign50, heightIncrease: 300, speed: 380 };

var barriers_standard =
[
	igloo,
	sauna,
	los,
	stone,
	snowman,
	yeti
];

var barriers = barriers_standard;                       // ktore prekazky sa budu generovat: [] = nic, [igloo, snowman] = generuje len iglu a snehuliakov

// TileSprites
var snowSprite = { name: "snow", width: 1, height: 395 };
var bridgeSprite = { name: "bridge", width: 2, height: 52 };
var lakeSprite = { name: "lake", width: 2, height: 309 };

var tileSprites =
[
	snowSprite,
	bridgeSprite,
	lakeSprite
];

// Debug
var DEBUG_PHYSICS = false;                              // fyzika
var DEBUG_POOL_INFO = false;                            // stav poolov
var DEBUG_IMMORTALITY = false;                          // nesmrtelnost
var DEBUG_SHOW_FPS = false;