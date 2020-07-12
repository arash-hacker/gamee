var GameMain = (function()
{
	function GameMain() {};
	return GameMain;
})();

function init()
{
	game.antialias = false;
	game.clearBeforeRender = false;
	game.preserveDrawingBuffer = true;
	game.time.desiredFps = 40;

	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;

	game.camera.setSize(640, 640);

	initCallbacks();

	if (BUILD_TYPE === Implementation.GameeV2)
	{
		var capabilities = GHOST_MODE_ENABLED ? ["ghostMode", "socialData"] : ["socialData"];
		var controller = "OneButton";
		gamee.gameInit(controller, {}, capabilities, onGameInited);

		if (TEST)
		{
			getSocialAvatars();
		}
	}
}

function preload()
{
	if (BUILD_TYPE === Implementation.Basic)
	{
		game.load.image("loading_01", "gfx/LoadingBar/loading_01.png");
		game.load.image("loading_02", "gfx/LoadingBar/loading_02.png");
		game.load.image("loading_logo", "gfx/LoadingBar/loading_logo.png");
	}
	
	if (TEST || BUILD_TYPE === Implementation.Basic)
	{
		game.state.add("game", GameMain);
		game.state.start("game");
	}
}

function onGameInited(error, data)
{
	if (error)
		throw error;

	data.controller.buttons.button.on("keydown", buttonDown);

	ghostData = data.replayData;
	if (ghostData && ghostData.data)
	{
		ghostData.jsonData = ghostData.data;
	}
	
	game.state.add("game", GameMain);
	game.state.start("game");
	
	getSocialAvatars();
}

function getSocialAvatars()
{
	if (BUILD_TYPE === Implementation.GameeV2 && !TEST)
	{
		// gamee social
		gamee.requestSocial(onGetSocialData);
	}
	else
	{
		var data =  {
			socialData:  {
				friends: []
			}
		};
		for (var i = 1; i <= 8; ++i)
		{
			data.socialData.friends.push({ name: i.toString(), highScore: 2*i });
		}
		onGetSocialData(null, data);
	}
}

GameMain.prototype.preload = function()
{
	if (BUILD_TYPE === Implementation.Basic)
	{
		game.stage.backgroundColor = "#fff";

		var logo = this.add.image(game.width/2, 240, "loading_logo");
		logo.anchor.setTo(0, 0.5);
		logo.x -= logo.width / 2;

		var bar = this.add.image(game.width/2, 480, "loading_01");
		bar.anchor.setTo(0, 0.5);
		bar.x -= bar.width / 2;

		var loadingBarContent = this.add.sprite(game.width/2, 480, "loading_02");
		loadingBarContent.anchor.setTo(0, 0.5);
		loadingBarContent.x -= loadingBarContent.width / 2;

		this.load.setPreloadSprite(loadingBarContent, 0);

		game.load.image("CrazyCat_menu_bg", "gfx/Menu/CrazyCat_menu_bg.png");
		game.load.image("CrazyCat_Logo", "gfx/Menu/CrazyCat_Logo.png");
		game.load.image("GameOver", "gfx/Menu/GameOver.png");
		game.load.image("BtnPlay", "gfx/Menu/BtnPlay.png");
		game.load.image("BtnReplay", "gfx/Menu/BtnReplay.png");
		game.load.image("BtnMoreGame", "gfx/Menu/BtnMoreGame.png");

		game.load.image("highscore", "gfx/Menu/highscore.png");
		game.load.image("MyScore", "gfx/Menu/MyScore.png");
		game.load.image("Score", "gfx/Menu/Score.png");
		game.load.image("ScoreBg", "gfx/Menu/ScoreBg.png");
		game.load.image("ScoreTxt_01", "gfx/Menu/ScoreTxt_01.png");

		game.load.image("jojo-net", "gfx/Bannery/jojo-net.png");
		game.load.spritesheet("splash", "gfx/Bannery/splash.png", 336, 280);
		game.load.image("cross", "gfx/Bannery/x-cross.png");
	}

	game.load.spritesheet("water", "gfx/Backgrounds/water.png", 32, 256);

	game.load.image("pozadi6", "gfx/Backgrounds/pozadi6_mini.png");
	game.load.image("horskymasiv6", "gfx/Backgrounds/horskymasiv6.png");
	game.load.image("mraky6", "gfx/Backgrounds/mraky6.png");
	game.load.image("hory", "gfx/Backgrounds/hory.png");
	game.load.image("zelenyles6", "gfx/Backgrounds/zelenyles6.png");
	game.load.image("zeme6", "gfx/Backgrounds/zeme6.png");

	game.load.image("smrk_1", "gfx/Backgrounds/smrk_1.png");
	game.load.image("smrk_2", "gfx/Backgrounds/smrk_2.png");
	game.load.image("smrk_3", "gfx/Backgrounds/smrk_3.png");
	game.load.image("smrk_4", "gfx/Backgrounds/smrk_4.png");
	game.load.image("smrk_5", "gfx/Backgrounds/smrk_5.png");

	game.load.image("cloud", "gfx/Particles/cloud_16.png");
	game.load.image("kapka", "gfx/Particles/kapka.png");

	game.load.image("rope", "gfx/Platforms/lano.png");
	game.load.image("ropeEnd", "gfx/Platforms/lano01.png");

	if (PINATA)
	{
		// Pinata
		game.load.spritesheet("cat_jump", "gfx/Cat/PinataJump.png", 116, 100);
		game.load.spritesheet("cat_up", "gfx/Cat/PinataFly.png", 136, 86);
		game.load.spritesheet("prd", "gfx/Particles/prd.png", 290, 205);

		game.load.audio("drown", "sounds/cervenka_fun.mp3");
	}
	else
	{
		// Cat
		game.load.spritesheet("cat_jump", "gfx/Cat/cc_skok.png", 120, 78);
		game.load.spritesheet("cat_up", "gfx/Cat/cc_Up.png", 120, 78);
		game.load.image("cat_down", "gfx/Cat/cc_Down.png");

		game.load.audio("drown", ["sounds/CatsDeadMnow.mp3", "sounds/CatsDeadMnow.ogg"]);
	}

	var islandsCount = islands.length;
	for (var i = 0; i < islandsCount; ++i)
	{
		var island = islands[i];
		game.load.spritesheet(island.name, "gfx/Platforms/".concat(island.name).concat(".png"), island.x, island.y);
	}

	game.load.audio("hit1",  ["sounds/Hit1.mp3", "sounds/Hit1.ogg"]);
	game.load.audio("hit2",  ["sounds/Hit2.mp3", "sounds/Hit2.ogg"]);
}

GameMain.prototype.create = function()
{
	var textureSize = game.width * 1.5;

	// Physic
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = BASE_GRAVITY;

	// Audio
	jumpSounds[0] = game.add.audio("hit1");
	jumpSounds[1] = game.add.audio("hit2");
	drownSound = game.add.audio("drown");

	blockManager = new BlockManager(islands, trees);

	// Backgrounds
	backgrounds[0] = game.add.image(0, 0, "pozadi6");
	backgrounds[1] = game.add.tileSprite(0, 40, textureSize, 88, "mraky6");
	backgrounds[2] = game.add.tileSprite(0, 190, textureSize, 264, "horskymasiv6");
	backgrounds[3] = game.add.tileSprite(0, game.height - HEIGHT_GROUND - 400, textureSize, 420, "hory");
	backgrounds[4] = game.add.tileSprite(0, game.height - HEIGHT_GROUND - 130, textureSize, 186, "zelenyles6");

	treesGroup = game.add.group();
	treesGroup.fixedToCamera = true;

	backgrounds[5] = game.add.tileSprite(0, game.height - HEIGHT_GROUND, textureSize, 100, "zeme6");

	var backgroundsCount = backgrounds.length;
	for (var i = 0; i < backgroundsCount; ++i)
	{
		backgrounds[i].fixedToCamera = true;
	}

	// Menus
	if (BUILD_TYPE === Implementation.Basic)
		createMainMenu();

	createGameMenu();

	if (BUILD_TYPE === Implementation.Basic)
		createEndedMenu();

	// Camera
	game.camera.follow(player);
	game.camera.deadzone = new Phaser.Rectangle(240, 0, 40, game.height);

	// Start
	if (BUILD_TYPE === Implementation.Basic)
	{
		aldaEngine.menuManager.showMenu("mainMenu");
	}
	else
	{
		resetGame();
		aldaEngine.menuManager.showMenu("gameMenu");
	}

	if (PINATA)
	{
		prdGroup = game.add.group();
		prdPool = [];

		for (var i = 0; i < 4; ++i)
		{
			var prd = game.add.image(0, 0, "prd", 0, prdGroup);
			prd.anim = prd.animations.add("prd").play(10, false, false);
			removePrd(prd);
		}
	}
	else
	{
		dustEmitter = game.add.emitter(0, 0, 8);
		dustEmitter.makeParticles("cloud");
		dustEmitter.setAlpha(1, 0, 500);
		dustEmitter.width = 30;
	}

	waterEmitter = game.add.emitter(0, 0, 30);
	waterEmitter.makeParticles("kapka");
	waterEmitter.setScale(0.75, 0, 0.75, 0, 1400);
	waterEmitter.setAlpha(0.7, 0.25, 1200);
	waterEmitter.width = 30;
	waterEmitter.setYSpeed(-100, -350);

	if (TEST)
	{
		log("creating custom controller");
		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(buttonDown, this);
		game.input.onTap.add(buttonDown);
	}
	
	aldaEngine.gameReady();
}

function onGetSocialData(error, data)
{
	if (error)
		console.error(error);

	if (data && data.socialData)
	{
		game.load.image("avatar_bg", "gfx/Social/hex-70.png");
		game.load.image("avatar_mask", "gfx/Social/hex-60.png");
		game.load.image("avatar_line", "gfx/Social/line-white.png");

		friendAvatars = data.socialData.friends;
		friendAvatars.forEach(function(friend)
		{
			if (friend.avatar)
			{
				// nacitam image do cache
				game.load.image(friend.avatar, friend.avatar);
			}
			else
			{
				console.warn("Missing avatar for " + friend.name);
			}
		});

		// zoradim friendov podla skore
		friendAvatars.sort(function(a, b)
		{
			return a.highScore - b.highScore;
		});

		game.load.start();
	}
}

function createButton(name, x, y, callback, menu)
{
	var button = game.add.button(x, y, name, callback, this);
	button.anchor.setTo(0.5, 0.5);
	menu.add(button);
	return button;
}


function createMainMenu()
{
	var mainMenu = game.add.group();
	mainMenu.fixedToCamera = true;

	game.add.image(0, 0, "CrazyCat_menu_bg", 0, mainMenu);
	game.add.image(0, 0, "CrazyCat_Logo", 0, mainMenu);

	// Start
	createButton("BtnPlay", game.world.centerX, game.world.centerY - 20, function()
	{
		aldaEngine.menuManager.showMenu("gameMenu");
	}, mainMenu);

	//More Games
	createButton("BtnMoreGame", game.world.centerX, game.world.centerY + 80, function()
	{
		window.open(AD_URL);
	}, mainMenu);

	// Score
	var scoreBg1 = game.add.image(game.world.centerX, game.world.centerY + 180, "ScoreBg", 0, mainMenu);
	scoreBg1.anchor.setTo(0.5, 0.5);

	var myScore = game.add.image(game.world.centerX - 170, game.world.centerY + 180, "Score", 0, mainMenu);
	myScore.anchor.setTo(0, 0.5);

	var score = game.add.text(game.world.centerX, game.world.centerY + 184, aldaEngine.maxScore, { "font": "fizzonormal", "fill" : "white", "fontSize" : "26px"});
	score.anchor.setTo(0, 0.5);
	mainMenu.add(score);

	aldaEngine.menuManager.addMenu("mainMenu", mainMenu, resetGame);
}

function createGameMenu()
{
	var gameMenu = game.add.group();

	// Blocks
	islandsGroup = game.add.group();
	gameMenu.add(islandsGroup);

	// Player
	player = gameMenu.create(PLAYER_X, PLAYER_Y, "cat_jump", 0);
	player.anchor.setTo(0.5, 1);
	player.jumpingDown = false;

	if (ghostMode === GhostMode.On && !ghost)
	{
		ghost = gameMenu.create(GHOST_X, GHOST_Y, "cat_jump", 0);
		ghost.alpha = GHOST_ALPHA;
		ghost.anchor.setTo(0.5, 1);
		ghost.jumpingDown = false;

		game.physics.arcade.enable(ghost);
		ghost.body.checkCollision.up = false;
		ghost.body.checkCollision.down = true;
		ghost.body.checkCollision.left = false;
		ghost.body.checkCollision.right = true;
		ghost.body.allowRotation = false;
	}

	if (PINATA)
	{
		var prd = game.add.image(0, 0, "prd", 0);
		prd.anchor.setTo(0.5, 1);
		prd.kill();
		player.prd = prd;
	}

	game.physics.arcade.enable(player);
	player.body.checkCollision.up = false;
	player.body.checkCollision.down = true;
	player.body.checkCollision.left = false;
	player.body.checkCollision.right = true;
	player.body.allowRotation = false;

	gameMenu.add(player);

	// Water
	var water = game.add.tileSprite(0, game.height - HEIGHT_WATER, game.width, HEIGHT_WATER, "water");
	water.fixedToCamera = true;
	water.animations.add("waves", [0, 1, 2, 3, 2, 1]).play(4, true);
	gameMenu.add(water);

	// Avatars
	avatarGroup = game.add.group();
	gameMenu.add(avatarGroup);

	plusText = game.add.text(0, 0, "", { "fill" : "yellow", "fontSize" : "26px"});
	plusText.anchor.setTo(0.5, 0.5);
	gameMenu.add(plusText);

	if (BUILD_TYPE === Implementation.Basic)
	{
		var myScore = game.add.text(game.world.centerX - 15, game.height - 25, "Score", { "font": "fizzonormal", "fill" : "white", "fontSize" : "30px"});
		myScore.anchor.setTo(1, 0.5);
		myScore.fixedToCamera = true;
		gameMenu.add(myScore);

		scoreText = game.add.text(game.world.centerX + 20, game.height - 25, "0", { "font": "fizzonormal", "fill" : "white", "fontSize" : "30px"});
		scoreText.anchor.setTo(0, 0.5);
		scoreText.fixedToCamera = true;
		gameMenu.add(scoreText);
	}

	aldaEngine.menuManager.addMenu("gameMenu", gameMenu, startGame);
}


function createEndedMenu()
{
	var gameEndedMenu = game.add.group();
	gameEndedMenu.fixedToCamera = true;

	game.add.image(0, 0, "CrazyCat_menu_bg", 0, gameEndedMenu);
	game.add.image(0, 0, "GameOver", 0, gameEndedMenu);

	// Restart
	createButton("BtnReplay", game.world.centerX, game.world.centerY, function()
	{
		resetGame();
		aldaEngine.menuManager.showMenu("gameMenu");
	}, gameEndedMenu);

	// Score 1
	game.add.image(game.world.centerX, game.world.centerY + 100, "ScoreBg", 0, gameEndedMenu)
		.anchor.setTo(0.5, 0.5);

	game.add.image(game.world.centerX - 170, game.world.centerY + 100, "MyScore", 0, gameEndedMenu)
		.anchor.setTo(0, 0.5);

	var score = game.add.text(game.world.centerX + 50, game.world.centerY + 104, "", {"font": "fizzonormal", "fill" : "white", "fontSize" : "26px"});
	score.anchor.setTo(0, 0.5);
	gameEndedMenu.add(score);

	// Score 2
	game.add.image(game.world.centerX, game.world.centerY + 180, "ScoreBg", 0, gameEndedMenu)
		.anchor.setTo(0.5, 0.5);

	game.add.image(game.world.centerX - 170, game.world.centerY + 180, "highscore", 0, gameEndedMenu)
		.anchor.setTo(0, 0.5);

	var bestScore = game.add.text(game.world.centerX + 50, game.world.centerY + 184, "", {"font": "fizzonormal", "fill" : "white", "fontSize" : "26px"});
	bestScore.anchor.setTo(0, 0.5);
	gameEndedMenu.add(bestScore);

	aldaEngine.menuManager.addMenu("gameEndedMenu", gameEndedMenu, function()
	{
		aldaEngine.gameOver();

		score.text = aldaEngine.score;
		bestScore.text = aldaEngine.maxScore;

		if (DISPLAY_AD && aldaEngine.gamesCount % 2 === 0)
		{
			var popup = aldaEngine.showPopUpWindow("splash", 320, 320, function()
			{
				window.open(AD_URL);
			});
			gameEndedMenu.add(popup);
		}
	});
}

function unpause()
{
	if (BUILD_TYPE === Implementation.Basic)
	{
		updatePaused = false;
		game.physics.arcade.isPaused = false;
		game.tweens.resumeAll();
	}
	else
	{
		game.paused = false;
	}
}

function initCallbacks()
{
	game.scale.setResizeCallback(function(scale, parentBounds)
	{
		parentBounds = AldaEngine.windowSize;
		var scaleRatio = Math.min(parentBounds.width, parentBounds.height) / 640;
		scale.setUserScale(scaleRatio, scaleRatio, 0, 0);
	}, this);

	// Start
	aldaEngine.onStart = function (event)
	{
		log("Starting game, ghost mode: " + event.detail.opt_ghostMode);

		aldaEngine.unlockAudio();
		unpause();

		if (event.detail.opt_ghostMode)
		{
			ghostMode = GhostMode.On;

			if (!ghost)
			{
				ghost = player.parent.create(GHOST_X, GHOST_Y, "cat_jump", 0);
				ghost.alpha = GHOST_ALPHA;
				ghost.anchor.setTo(0.5, 1);
				ghost.jumpingDown = false

				game.physics.arcade.enable(ghost);
				ghost.body.checkCollision.up = false;
				ghost.body.checkCollision.down = true;
				ghost.body.checkCollision.left = false;
				ghost.body.checkCollision.right = true;
				ghost.body.allowRotation = false;
			}
		}
		else
		{
			if (GHOST_MODE_ENABLED)
				ghostMode = GhostMode.Off;
		}

		game.stage.disableVisibilityChange = true;
		
		// OnRestart
		if (aldaEngine.gamesCount > 0)
		{
			// gamee social
			removeAvatarImages();
			getSocialAvatars();
		}
		
		// OnRestart || ghot mode
		if (aldaEngine.gamesCount > 0 || ghostMode === GhostMode.On)
		{
			resetGame();
			aldaEngine.menuManager.showMenu("gameMenu", true);
		}
	};

	// Pause
	aldaEngine.onPause = function (event)
	{
		log("onPause");
		if (BUILD_TYPE === Implementation.Basic)
		{
			updatePaused = true;
			game.physics.arcade.isPaused = true;
			game.tweens.pauseAll();
		}
		else
		{
			game.paused = true;
		}
	}

	// OnResume
	aldaEngine.onResume = function (event)
	{
		log("onResume");
		unpause();
	}

	// Mute
	aldaEngine.onMute = function (event)
	{
		log("onMute");
		audioEnabled = false;
	}

	// Unmute
	aldaEngine.onUnmute = function (event)
	{
		log("onUnmute");
		audioEnabled = true;
	}

	// Ghost mode
	gamee.emitter.addEventListener("ghostHide", function (event)
	{
		log("ghostHide");
		if (ghost)
		{
			ghost.kill();
			// TODO: more logic?
		}
		event.detail.callback();
	});

	// Ghost mode
	gamee.emitter.addEventListener("ghostShow", function (event)
	{
		log("ghostShow");
		// TODO: some logic?
		event.detail.callback();
	});
}
