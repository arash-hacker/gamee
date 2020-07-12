var GAME_TYPE = (typeof $gameeNative !== "undefined") ? $gameeNative.type : "gamee-unknown";
var BUILD_TYPE = Implementation.Gamee;

var game = new Phaser.Game(640, 640, Phaser.CANVAS, "Nokian", { init: init, preload: preload, create: create });
var aldaEngine = new AldaEngine(game, Implementation.Gamee, "Nokian");

// Enums
var GameState =
{
    Loading: 0,
    Ready: 1,
    Gif: 2,
    Intro: 3,
    Restarting: 4,
	InGame: 5,
	Falling: 6,
	Dead: 7,
    End: 8
};

// Variables
var backgrounds = [];
var decorBgGroup, islandsGroup, lakeGroup, bridgeGroup, barriersGroup, treesGroup;
var playerCollisionGroup, platformCollisionGroup, barrierCollisionGroup, decorCollisionGroup;
var audioMusic, audioImpact, audioBridge, audioCrash, audioSauna, audioYeti;
var material1, material2;
var groups;
var player;
var blockManager;
var canJump;
var jumping;
var onIce;
var braking;
var secondJump;
var maxSpeed;
var lastCamX;
var lastJumpY;
var contacts = 0;
var lastContact;
var onBridge;
var introProgress;
var gameState = GameState.Loading;
var audioEnabled = true;
var firstFocus = true;
var font;
var tachoImage = null;
var endImage = null;
var anim;

// Start / Restart game
function resetGame()
{
    console.log("resetGame");

    // Vars
    canJump = true;
	jumping = false;
	onIce = false;
	braking = false;
    secondJump = false;
	lastJumpY = 0;
	maxSpeed = PLAYER_SETTINGS.initialMaxSpeed;
	lastCamX = game.camera.x;
	lastContact = null;
	onBridge = null;

	if (endImage !== null)
	{
	    endImage.destroy();
	    endImage = null;
	}

    resetParallaxEffect();

	// Player
	player.reset(PLAYER_SETTINGS.starting_x, PLAYER_SETTINGS.starting_y);
	setPlayerBody(PLAYER_SETTINGS.bodySize);
	player.speed = PLAYER_SETTINGS.initialSpeed;

	// World
	game.world.setBounds(0, 0, game.width * 2, game.height);
	blockManager.createNewGame();

	// Gamee
	aldaEngine.score = 0;
}

function startGame()
{
    console.log("startGame");

    if (audioEnabled && !audioMusic.isPlaying)
        audioMusic.play();

    gameState = GameState.InGame;

    aldaEngine.gameStart();
}

// Buttony
function rightButtonDown()
{
    console.log("rightButtonDown");

	if (firstFocus && !game.device.android && !game.device.iOS && (GAME_TYPE === "gamee-web") && (BUILD_TYPE === Implementation.Gamee))
		return;

	switch (gameState)
	{
	    case GameState.Ready:
	        if (BUILD_TYPE === Implementation.Gamee) // gamee mobile
	            startIntro();
			break;

		case GameState.InGame:
		    if (canJump && !onIce)
		    {
		        jump();
		        canJump = false;
		    }
			break;
	}
}

function rightButtonUp()
{
    canJump = true;
}

function leftButtonDown()
{
    console.log("leftButtonDown");

    if (firstFocus && !game.device.android && !game.device.iOS && (GAME_TYPE === "gamee-web") && (BUILD_TYPE === Implementation.Gamee))
		return;

	switch (gameState)
	{
	    case GameState.Ready:
	        if (BUILD_TYPE === Implementation.Gamee) // gamee mobile
	            startIntro();
			break;

		case GameState.InGame:
			braking = true;
			break;
	}
}

function leftButtonUp()
{
	braking = false;
}

// Collisions
function onBeginContact(body1, body2, shape1, shape2, equation)
{
    contacts++;

    if (gameState !== GameState.InGame || body1 === null)
        return;

    var block = body1.sprite;

    //console.log("onBeginContact " + block.key + ", c: " + contacts);

    if (block.onCollision)
        block.onCollision(block);

    switch (block.key)
    {
        case "ice":
        case "snowman_head":
        case "lake":
            break;

        case "bridge_01":
        case "bridge_01_end":
        case "platform_01_end":
        case "platform_02_end":
        case "snow":
        case "mostik":
            if (player.body.velocity.y > 0 && audioEnabled)
                audioImpact.play();

            blockManager.precomputeArcadeBody(player);
            blockManager.precomputeArcadeBody(block);

            if (player.arcadeBody.bottom > block.arcadeBody.top)
            {
                player.y -= player.arcadeBody.bottom - block.arcadeBody.top;
                //console.log("player.y -- | " + block.key);
            }
            break;

        case "bridge":
            if (jumping && Math.random() <= BRIDGE.breakFromJumpProbability)
            {
                if (!blockManager.breakBridge(block))
                {
                    blockManager.precomputeArcadeBody(player);
                    blockManager.precomputeArcadeBody(block);

                    if (player.arcadeBody.bottom > block.arcadeBody.top)
                    {
                        player.y -= player.arcadeBody.bottom - block.arcadeBody.top;
                        //console.log("player.y -- | " + block.key);
                    }
                }
            }
            else if (player.body.velocity.y > 0)
            {
                if (audioEnabled)
                    audioImpact.play();

                blockManager.precomputeArcadeBody(player);
                blockManager.precomputeArcadeBody(block);

                if (player.arcadeBody.bottom > block.arcadeBody.top)
                {
                    player.y -= player.arcadeBody.bottom - block.arcadeBody.top;
                    //console.log("player.y -- | " + block.key);
                }
            }
            break;

        case "platform_01":
        case "platform_02":
            blockManager.precomputeArcadeBody(player);
            blockManager.precomputeArcadeBody(block);

            if (player.arcadeBody.right < block.arcadeBody.left + 10)
            {
                fall(true);
            }
            else if (player.body.velocity.y > 0)
            {
                if (audioEnabled)
                    audioImpact.play();
            }
            break;

        default:
            blockManager.precomputeArcadeBody(player);
            blockManager.precomputeArcadeBody(block);

            if (player.arcadeBody.right < block.arcadeBody.left + 10)
            {
                if (block.key !== "yeti" && audioEnabled)
                    audioCrash.play();

                fall(true);
            }
            else
            {
                if (player.arcadeBody.bottom > block.arcadeBody.top)
                {
                    player.y -= player.arcadeBody.bottom - block.arcadeBody.top;
                    //console.log("player.y -- | " + block.key);
                }
            }
            break;
    }

    if (!jumping)
    {
        player.body.velocity.y = 0;
    }

    if (player.body.velocity.y > 0)
    {
        jumping = false;
    }

    if (secondJump)
    {
        secondJump = false;

        if (gameState === GameState.InGame)
        {
            jump();
        }
    }
}

function onEndContact(body1, body2, shape1, shape2)
{
    contacts--;

    if (player.body.velocity.y < PLAYER_SETTINGS.maxJumpJpeed)
    {
        player.body.velocity.y = PLAYER_SETTINGS.maxJumpJpeed;
    }

    if (body1 === null)
        return;

    if (body1.sprite !== null)
    {
        lastContact = body1.sprite;

        if (lastContact.onCollisionExit)
            lastContact.onCollisionExit();

        //console.log("onEndContact " + lastContact.key + ", c: " + contacts);

        switch (lastContact.key)
        {
            case "snow":
            case "platform_01":
            case "platform_01_end":
            case "platform_02":
            case "platform_02_end":
            case "bridge":
            case "bridge_01":
            case "bridge_01_end":
                if (!jumping && player.arcadeBody)
                {
                    blockManager.precomputeArcadeBody(player);
                    blockManager.precomputeArcadeBody(lastContact);

                    if (player.body.velocity.y < -0.1)
                    {
                        player.y -= player.arcadeBody.bottom - lastContact.arcadeBody.top;
                        player.body.velocity.y = 0;

                        //console.log("velocity.y = 0 | onEndContact: " + lastContact.key);
                    }
                }
                break;

            case "ice":
                onIce = false;
                break;
        }

        if (body1.sprite.key === "ice")
        {
            onIce = false;
        }
    }
}

// Jump
function jump()
{
    if (jumping ||
        (contacts === 0 && lastContact !== null && lastContact.key !== "platform_01" && lastContact.key !== "platform_02" && lastContact.key !== "snow" &&
        lastContact.key !== "bridge_01" && lastContact.key !== "bridge_01_end" && lastContact.key !== "bridge"))
    {
        //console.log("no jump | jumping: " + jumping + ", contacts: " + contacts + ", lastContact: ", lastContact);

	    jumping = true;
        secondJump = true;

        var timer = game.time.create(true);
        timer.add(PLAYER_SETTINGS.jumpingTimer, cancelJump, this);
        timer.start();

		return;
	}

    //console.log("jump");

	player.body.velocity.y = -PLAYER_SETTINGS.jumpSpeed;
    lastJumpY = player.y;
    jumping = true;
}

function cancelJump()
{
    secondJump = false;
}

function resetParallaxEffect()
{
    backgrounds[0].tilePosition.x = 0;
    backgrounds[2].tilePosition.x = 0;
    backgrounds[3].tilePosition.x = 0;
    backgrounds[4].tilePosition.x = 0;
    backgrounds[5].tilePosition.x = 0;
}

// 3D effect
function parallaxEffect(delta)
{
	backgrounds[0].tilePosition.x -= delta * 0.04;
	backgrounds[2].tilePosition.x -= delta * 0.08;
	backgrounds[3].tilePosition.x -= delta * 0.12;
	backgrounds[4].tilePosition.x -= delta * 0.15;
	backgrounds[5].tilePosition.x -= delta;

	for (var i = decorBgGroup.children.length - 1; i >= 0; --i)
	{
	    var item = decorBgGroup.children[i];
	    item.body.x += delta * 0.85;
	    item.x += delta * 0.85;
	}
}

// Update
LoadingState.prototype.update = function()
{
	switch (gameState)
	{
	    case GameState.Ready:
	        AldaEngine.gainFocus();
            break;

	    case GameState.Intro:
			if (introProgress >= INTRO_CAMERA_UNZOOMING_DURATION)
			{
				onIntroFinished();
			}
			else if (introProgress >= 0)
			{
				introProgress += 1000 * game.time.physicsElapsed;
				var progress = 1 - introProgress / INTRO_CAMERA_UNZOOMING_DURATION;

				player.body.setCircle(progress * 75 + 25);
				player.scale.setTo(progress * 0.375 + PLAYER_SETTINGS.intro_scale);
				player.body.velocity.y = 78;
			}
			player.body.velocity.x = PLAYER_SPEED_RATIO * player.speed;

	    case GameState.InGame:
	        var score = Math.round(player.x * POINTS_PER_DISTANCE);
	        if (score !== aldaEngine.score)
	        {
	            aldaEngine.score = score;
	        }

	        maxSpeed = Math.min(PLAYER_SETTINGS.initialMaxSpeed + Math.round(PLAYER_SETTINGS.maxSpeedIncrease * player.x / 1000), PLAYER_SETTINGS.totalMaxSpeed);

			// Moving
			if (braking)
			{
				if (!jumping && !onIce)
				{
					player.speed = Math.max(player.speed - PLAYER_SETTINGS.deceleration, PLAYER_SETTINGS.minSpeed);
					player.angle += WHEEL_ROTATION_SPEED * player.speed;
				}
			}
			else
			{
				if (!onIce)
					player.speed = Math.min(player.speed + PLAYER_SETTINGS.acceleration, maxSpeed);

				player.angle += WHEEL_ROTATION_SPEED * player.speed;
			}

            font.text = player.speed.toFixed(0);
            player.body.velocity.x = PLAYER_SPEED_RATIO * player.speed;

            cropRect.width = (player.speed - 50) * 1.04375;
            tachoImage.updateCrop();

            if (onBridge && player.speed > BRIDGE.maxSpeed)
            {
                blockManager.breakBridge(onBridge);
            }

			// Enlarge world
			if (player.x + 160 > game.world.width - game.width)
			{
				game.world.setBounds(0, 0, game.world.width + game.width, game.height);
			}

			// Paralax
			parallaxEffect(game.camera.x - lastCamX);

            // SkyJump
			var val = -backgrounds[4].tilePosition.x % backgrounds[4].width;
			if (val > skyJump.x - 1 && val < skyJump.x + 1)
			{
			    blockManager.generateSkyJump(game.camera.x + backgrounds[4].width);
			}

			// Spawn and remove blocks
			blockManager.manageBlocks();

			// Die
			if (player.y > PLAYER_SETTINGS.deadHeight)
			{
			    die();
			}

			lastCamX = game.camera.x;
			break;

		case GameState.Falling:
			// Spawn and remove blocks
			blockManager.manageBlocks();

			// Die
			if (player.y > PLAYER_SETTINGS.deadHeight)
				die();
			break;

		case GameState.Dead:
			blockManager.manageBlocks();
			break;
	}
}

function fall(stopWheel)
{
    if (DEBUG_IMMORTALITY)
        return;

    gameState = GameState.Falling;

    player.body.clearShapes();

	if (stopWheel)
	{
	    player.speed = 0;
	    player.body.velocity.x = 0;
    }
    else
	{
	    player.speed = PLAYER_SETTINGS.minSpeed;
	    player.body.velocity.y = 0;
	}
}

function die()
{
    console.log("die");

	gameState = GameState.Dead;

	player.speed = 0;
	player.kill();

	endImage = game.add.image(0, 0, "finish");
	endImage.fixedToCamera = true;

    setTimeout(gameOverScreen, FINISH_IMAGE_DURATION);
}

function gameOverScreen()
{
    if (gameState !== GameState.Dead)
        return;

    gameState = GameState.End;

    audioMusic.stop();

    aldaEngine.gameOver();
}

// Debug
LoadingState.prototype.renderX = function ()
{
    game.debug.text(player.y, 20, 60);

    if (DEBUG_SHOW_FPS)
    {
        game.debug.text("FPS: " + game.time.fps + "  min: " + game.time.fpsMin + "  max: " + game.time.fpsMax, 20, 60);
        game.debug.text("MS min: " + game.time.msMin + "  max: " + game.time.msMax, 20, 90);
        game.debug.text("  suggested FPS: " + game.time.suggestedFps, 420, 60);
        game.debug.text("last sec frames: " + game.time.frames, 420, 90);
    }

	if (DEBUG_POOL_INFO)
	{
		var i = 0;
		var y = 96;
		for (var pool in blockManager.pools)
		{
			var x = (i % 2 === 0) ? 12 : 360;
			game.debug.text("Pool " + pool + ", 0: " + blockManager.pools[pool].length, x, y);

			if (i % 2 === 1)
				y += 24;

			i++
		}
	}

	if (DEBUG_PHYSICS)
	{
		game.debug.body(player);

		islandsGroup.forEach(function (block)
		{
			game.debug.body(block);
		},this);

		bridgeGroup.forEach(function (block)
		{
			game.debug.body(block);
		},this);

		barriersGroup.forEach(function (block)
		{
			game.debug.body(block);
		},this);
	}
}
