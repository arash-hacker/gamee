function init()
{
	game.antialias = false;
	game.clearBeforeRender = false;
	game.preserveDrawingBuffer = true;
	game.time.desiredFps = 50;
	game.forceSingleUpdate = false;

	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;

	if (DEBUG_SHOW_FPS)
	{
	    game.time.advancedTiming = true;
	}

	game.camera.setSize(720, 640);

	initCallbacks();

	onResizeCallback(game.scale);
	game.scale.updateLayout();
	game.scale.signalSizeChange();

	initController();
}

function preload()
{
    game.load.image("LoadingBg", "gfx/loading/Bg.png");
    game.load.image("LoadingWheel", "gfx/loading/wheelNew.png");
    game.load.image("Loading01", "gfx/loading/loadingBar01.png");
    game.load.image("Loading02", "gfx/loading/loadingBar02.png");
}

function create()
{
    game.state.add("LoadingState", LoadingState);
    game.state.start("LoadingState");
}

var LoadingState = (function ()
{
    function LoadingState() { };
    return LoadingState;
})();

var loading = null;

function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles)
{
    loading.cropRect.width = 3.7 * progress;
    loading.barFr.updateCrop();

    loading.wheel.x = 136 - 80 + progress * 3.7;
}

LoadingState.prototype.preload = function ()
{
    var bg = game.add.image(-80, 0, "LoadingBg");
    var barBg = game.add.image(136 - 80, 400, "Loading01");

    var cropRect = new Phaser.Rectangle(0, 0, 0, 18);
    var barFr = game.add.image(136 - 80, 400, "Loading02");
    barFr.crop(cropRect);

    var wheel = game.add.image(136 - 80, 400, "LoadingWheel");
    wheel.anchor.setTo(0.5, 0.5);

    loading =
    {
        bg: bg,
        wheel: wheel,
        barBg: barBg,
        barFr: barFr,
        cropRect: cropRect
    };

    game.load.onFileComplete.add(fileComplete, this);

    game.load.image("wheel", "gfx/nokian_tyre.png");
    game.load.image("wheel_small", "gfx/wheel.png");

    game.load.image("logo", "gfx/logo.png");
    game.load.image("anim_bg", "gfx/anim_bg.png");
    game.load.spritesheet("anim_koleso", "gfx/anim_koleso.png", 640, 471);

    game.load.image('km', 'gfx/tachometer/km.png');
    game.load.image('number', 'gfx/tachometer/number.png');
    game.load.image('TachoBg', 'gfx/tachometer/TachoBg.png');
    game.load.image('TachoColor', 'gfx/tachometer/TachoColor.png');

    game.load.spritesheet('los', 'gfx/barrier/los.png', 80, 100);
    game.load.image('stone', 'gfx/barrier/stone.png');
    game.load.image('yeti', 'gfx/barrier/Yeti.png');
    game.load.image('snowman', 'gfx/barrier/Snowman.png');
    game.load.image('snowman_head', 'gfx/barrier/SnowManHead.png');
    game.load.image('igloo', 'gfx/barrier/igloo.png');
    game.load.spritesheet('igloo_man', 'gfx/barrier/iglooMan.png', 32, 48);

    game.load.image('sauna', 'gfx/barrier/sauna.png');
    game.load.image('sauna_doors_close', 'gfx/barrier/SaunaDoorsClose.png');
    game.load.image('sauna_doors_open', 'gfx/barrier/SaunaDoorsOpen.png');

    game.load.image('1_layer_beach', 'gfx/bg/1_layer_beach.png');
    game.load.image('1_layer_hill', 'gfx/bg/1_layer_hill.png');
    game.load.image('2_layer_island', 'gfx/bg/2_layer_island.png');
    game.load.image('3_layer_water', 'gfx/bg/3_layer_water.png');
    game.load.image('4_layer_sky', 'gfx/bg/4_layer_sky.png');

    game.load.image('tree_01', 'gfx/decoration/tree_01.png');
    game.load.image('road sign_01', 'gfx/decoration/road sign_01.png');
    game.load.image('road sign_02', 'gfx/decoration/road sign_02.png');
    game.load.image('road sign_03', 'gfx/decoration/road sign_03.png');
    game.load.image('road sign_04', 'gfx/decoration/road sign_04.png');
    game.load.image('road sign_05', 'gfx/decoration/road sign_05.png');

    game.load.image("snow", "gfx/platform/snow.png");
    game.load.image('platform_01', 'gfx/platform/platform_01.png');
    game.load.image('platform_01_end', 'gfx/platform/platform_01_end.png');
    game.load.image('platform_02', 'gfx/platform/platform_02.png');
    game.load.image('platform_02_end', 'gfx/platform/platform_02_end.png');

    game.load.image('bridge', 'gfx/platform/bridge.png');
    game.load.image('bridge_hole', 'gfx/platform/BridgeHole.png');
    game.load.image('bridge_start', 'gfx/platform/bridge_01.png');
    game.load.image('bridge_end', 'gfx/platform/bridge_01_end.png');
    game.load.image('column', 'gfx/platform/column.png');

    game.load.image('lake', 'gfx/platform/lake.png');
    game.load.image('lake_start', 'gfx/platform/lake_01.png');
    game.load.image('lake_end', 'gfx/platform/lake_01_end.png');

    game.load.image('jumper', 'gfx/platform/Jumper.png');
    game.load.image('sky_jump', 'gfx/platform/SkyJump.png');
    game.load.image('mostik', 'gfx/platform/Mostik.png');
    game.load.image('platform_trees', 'gfx/platform/platform_trees.png');

    game.load.image("cloud", "gfx/pacticles/wool_16.png");

    game.load.image('finish', 'gfx/nokian_finish.png');

    game.load.audio("hudba", ["sfx/hudba.mp3", "sfx/hudba.ogg"]);
    game.load.audio("dopad", ["sfx/dopad.mp3", "sfx/dopad.ogg"]);
    game.load.audio("most", ["sfx/most.mp3", "sfx/most.ogg"]);
    game.load.audio("naraz", ["sfx/naraz.mp3", "sfx/naraz.ogg"]);
    game.load.audio("sauna", ["sfx/sauna.mp3", "sfx/sauna.ogg"]);
    game.load.audio("yetti", ["sfx/yetti.mp3", "sfx/yetti.ogg"]);
    game.load.audio("game-over", ["sfx/game-over.mp3", "sfx/game-over.ogg"]);
}

LoadingState.prototype.create = function()
{
	// Physic
	game.physics.startSystem(Phaser.Physics.P2JS);

	playerCollisionGroup = game.physics.p2.createCollisionGroup();
	platformCollisionGroup = game.physics.p2.createCollisionGroup();
	barrierCollisionGroup = game.physics.p2.createCollisionGroup();
	decorCollisionGroup = game.physics.p2.createCollisionGroup();

	game.physics.p2.setImpactEvents(true);
	game.physics.p2.updateBoundsCollisionGroup();
	game.physics.p2.gravity.y = BASE_GRAVITY;
    game.physics.p2.applyDamping = false;
    game.physics.p2.applySpringForces = false;

    material1 = game.physics.p2.createMaterial();
    material2 = game.physics.p2.createMaterial();

    game.physics.p2.createContactMaterial(material1, material2, { friction: 0, restitution: 0, relaxation: 20, stiffness: 10000 });

	blockManager = new BlockManager(game);

	// Backgrounds
	backgrounds[0] = game.add.tileSprite(0, 0, 2560, 222, "4_layer_sky");
	backgrounds[1] = game.add.tileSprite(0, 222, game.width, 223, "3_layer_water");
	backgrounds[2] = game.add.tileSprite(0, 220, 1260, 154, "2_layer_island");
	backgrounds[3] = game.add.tileSprite(0, 374, game.width * 1.5, 154, "1_layer_beach");
	backgrounds[4] = game.add.tileSprite(0, game.height - 387, 1416, 383, "1_layer_hill");

    // Groups
	decorBgGroup = game.add.group();

	// Player
	createPlayer();

    // Backgrounds
	backgrounds[5] = game.add.tileSprite(0, game.height - 127, game.width, 127, "platform_trees");

    // Groups
	islandsGroup = game.add.group();
	lakeGroup = game.add.group();
	bridgeGroup = game.add.group();
	barriersGroup = game.add.group();
	treesGroup = game.add.group();

	groups = [decorBgGroup, islandsGroup, lakeGroup, bridgeGroup, barriersGroup, treesGroup];

	for (var i = 0; i < 6; ++i)
	    backgrounds[i].fixedToCamera = true;

	var deltaX = (game.device.desktop && GAME_TYPE === "gamee-web") ? 40 : 0;

    var tachoBgImage = game.add.image(10 + deltaX, 540, "TachoBg");
	tachoBgImage.anchor.setTo(0, 0);
	tachoBgImage.fixedToCamera = true;

	tachoImage = game.add.image(10 + deltaX, 540, "TachoColor");
	tachoImage.anchor.setTo(0, 0);
	tachoImage.fixedToCamera = true;

	cropRect = new Phaser.Rectangle(0, 0, 0, 94);
	tachoImage.crop(cropRect);

	font = game.add.retroFont('number', 36, 47, "1234567890", 10, 0, 0);

	numImage = game.add.image(165 + deltaX, 610, font);
	numImage.anchor.setTo(1, 0.5);
	numImage.fixedToCamera = true;

	var kmImage = game.add.image(170 + deltaX, 610, "km");
	kmImage.anchor.setTo(0, 0.5);
	kmImage.fixedToCamera = true;

	// Camera
	game.camera.follow(player);

	// Physics callbacks
	player.body.onBeginContact.add(onBeginContact, this);
	player.body.onEndContact.add(onEndContact, this);

    // Audio
	audioMusic = game.add.audio("hudba");
    audioMusic.loop = true;
    audioMusic.volume = MUSIC_VOLUME * 0.01;

    audioBridge = game.add.audio("most");
    audioImpact = game.add.audio("dopad");
	audioCrash  = game.add.audio("naraz");
	audioSauna  = game.add.audio("sauna");
	audioYeti = game.add.audio("yetti");
	audioEnd = game.add.audio("game-over");

	resetGame();

    setPlayerBody(100);

	// Intro screen
	player.reset(PLAYER_SETTINGS.intro_x, PLAYER_SETTINGS.intro_y);
	game.camera.deadzone = new Phaser.Rectangle(20, 0, 320, game.height);

	player.scale.set(PLAYER_SETTINGS.intro_scale * INTRO_ZOOM_RATIO);
	islandsGroup.children[0].scale.set(INTRO_ZOOM_RATIO);

	var introBg = game.add.image(0, 0, "anim_bg");
	var introAnim = game.add.tileSprite(0, 169, 640, 471, "anim_koleso");
	var logo = game.add.image(580, 0, "logo");
	logo.anchor.setTo(1, 0);
    logo.scale.setTo(0.75, 0.75);

	anim = introAnim.animations.add('animation');
	anim.onComplete.add(function ()
	{
	    console.log("anim.onComplete");

	    gameState = GameState.Intro;

	    player.speed = maxSpeed;
	    introProgress = 0;
	    game.add.tween(game.camera.deadzone).to({ width: 120 }, INTRO_CAMERA_UNZOOMING_DURATION, Phaser.Easing.Linear.None).start();

	    introBg.destroy();
	    introAnim.destroy();
	    logo.destroy();
	    anim = null;
	}, this);

	gameState = GameState.Ready;
	aldaEngine.gameLoaded();
}

function startIntro()
{
    console.log("startIntro");

    gameState = GameState.Gif;
    anim.play(10, false, false);
}

function createPlayer()
{
	player = game.add.sprite(0, 0, "wheel");
	player.anchor.setTo(0.5, 0.5);
	player.speed = 0;

	game.physics.p2.enable(player);
	player.body.fixedRotation = true;
	player.body.debug = DEBUG_PHYSICS;
	player.body.allowSleep = false;
    setPlayerBody(100);
}

function setPlayerBody(size)
{
    player.actualCircleSize = size;
    player.body.setCircle(size);
    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collidesWith = [];
    player.body.collides([platformCollisionGroup, barrierCollisionGroup]);
    player.body.setMaterial(material1);
}

function onIntroFinished()
{
    console.log("onIntroFinished");

	islandsGroup.children[0].scale.set(1);

	player.body.velocity.y = 0;
	player.loadTexture("wheel_small");
	player.scale.setTo(PLAYER_SETTINGS.scale);
	setPlayerBody(PLAYER_SETTINGS.bodySize);

	blockManager.computeArcadeBody(player, 48, 48, 1, 1);

	startGame();
}

function getMinSquareParentSize()
{
    var parentBounds = AldaEngine.windowSize;
    return Math.min(parentBounds.width, parentBounds.height);
}

function initController()
{
    console.log("initController");

    var controller = gamee.controller.requestController("TwoButtons", { enableKeyboard: true });

    controller.buttons.left.on("keydown", leftButtonDown);
    controller.buttons.left.on("keyup", leftButtonUp);

    controller.buttons.right.on("keydown", rightButtonDown);
    controller.buttons.right.on("keyup", rightButtonUp);
}

function onResizeCallback(scale, parentBounds)
{
    var scaleRatio = getMinSquareParentSize() / 640;
    scale.setUserScale(scaleRatio, scaleRatio, 0, 0);
}

function initCallbacks()
{
    game.scale.setResizeCallback(onResizeCallback, this);

	this.onfocus = function()
	{
	    console.log("onfocus");

		firstFocus = false;
	};
	this.onblur = this.onfocus;

	// Mute
    aldaEngine.onMute = function()
    {
	    console.log("onMute");

        audioEnabled = false;
        audioMusic.stop();
    };

	//Unmute
    aldaEngine.onUnmute = function()
    {
	    console.log("onUnmute");

        audioEnabled = true;
        audioMusic.play();
    };

	// Pause
    aldaEngine.onPause = function()
    {
	    console.log("onPause");

        game.paused = true;
    };

	// Unpause
	aldaEngine.onUnpause = function()
	{
		console.log("onUnpause");

	    game.paused = false;
	    AldaEngine.gainFocus();
	};

	// OnResume
    aldaEngine.onResume = function()
    {
		console.log("onResume");

		game.paused = false;
        aldaEngine.unlockAudio();
        AldaEngine.gainFocus();
    };

	// Restart
	aldaEngine.onRestart = function ()
	{
		console.log("onRestart");

		aldaEngine.unlockAudio();

		if (gameState === GameState.InGame || gameState === GameState.Falling || gameState === GameState.Dead || gameState === GameState.End)
		{
			console.log("restarting");

			game.paused = false;
		    gameState = GameState.Restarting;

			//resetGame();
			//startGame();

		    setTimeout(function()
			{
				resetGame();
			    setTimeout(startGame, 200);
			}, 800);
		}
	};

	// Stop
    aldaEngine.onStop = function() {};
}
