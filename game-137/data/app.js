var game = new Phaser.Game(640, 640, Phaser.CANVAS, "Crazy Cat", { init: init, preload: preload });
var aldaEngine = new AldaEngine(game, BUILD_TYPE, "crazy_cat");

var drownSound;
var jumpSounds = [];
var backgrounds = [];
var islandsGroup, treesGroup, prdGroup, avatarGroup;
var player, ghost;
var scoreText, plusText;
var dustEmitter, waterEmitter;
var blockManager;

var lastPlayerX;
var gameState;
var firstJump;
var updatePaused = false;
var audioEnabled = true;

var prdPool;

var ghostMode = GHOST_MODE_ENABLED ? GhostMode.Off : GhostMode.None;
var ghostData;
var playerJumpHistory;
var startTimePlayer, startTimeGhost;
var friendAvatars = [];
var avatarImages = [];
var launchTaskQueue = [];
var queueIndex;

// Start / Restart game
function resetGame()
{
	launchTaskQueue = [];
	queueIndex = 0;

	// Vars
	gameState = GameState.InMenu;
	firstJump = false;
	playerJumpHistory = [];

	// Game
	game.world.setBounds(0, 0, game.width * 2, game.height);

	// Reset cats
	player.loadTexture("cat_jump");
	player.body.setSize(60, 78, 40, 0);
	player.jumpingDown = false;

	if (ghost)
	{
		ghost.loadTexture("cat_jump");
		ghost.body.setSize(60, 78, 40, 0);
		ghost.jumpingDown = false;
	}

	if (BUILD_TYPE === Implementation.Basic)
		scoreText.text = aldaEngine.score;
}

function startGame()
{
	// Reset cats position
	player.reset(PLAYER_X, PLAYER_Y);

	if (ghost)
	{
		ghost.reset(GHOST_X, GHOST_Y);
	}

	lastPlayerX = player.x;

	if (ghostMode === GhostMode.On)
	{
		if (ghostData && ghostData.jsonData)
		{
			ghostData.data = JSON.parse(ghostData.jsonData);
		}
		blockManager.createNewGame(ghostData);
	}
	else
	{
		blockManager.createNewGame();
	}

	if (prdGroup)
	{
		prdGroup.forEach(removePrd, this);
		prdGroup.removeAll();
	}

	gameState = GameState.Ready;
}

function removePrd(item)
{
	item.kill();
	game.tweens.removeFrom(item);
	item.anim.stop();
	prdPool.push(item);
}

// cat starts to move
function doFirstJump()
{
	aldaEngine.gameStart();
	firstJump = true;

	if (ghostMode === GhostMode.On)
	{
		startTimeGhost = game.time.now;
		gameState = GameState.GhostOnly;

		jump(ghost); // 1st jump of ghost

		var timer = game.time.create();
		timer.add(500, function()
		{
			startTimePlayer = game.time.now;
			gameState = GameState.InGame;
		}, this);
		timer.start();
	}
	else
	{
		startTimePlayer = game.time.now;
		gameState = GameState.InGame;
	}
	
	blockManager.processLaunchTaskQueue();
}

function jumpDown(cat)
{
	if (cat === player)
	{
		playerJumpHistory.push(
		{
			x: Math.round(cat.x * 100) / 100,
			y: Math.round(cat.y * 100) / 100,
			t: game.time.now - startTimePlayer
		});
	}

	if (cat === ghost || !PINATA)
	{
		cat.loadTexture("cat_down");
	}

	if (cat === player)
	{
		cat.body.setSize(42, 90, 20, 0);
	}
	else
	{
		cat.body.setSize(62, 90, 10, 0);
	}

	cat.body.velocity.x = 0;
	cat.body.velocity.y = DOWN_SPEED;
	cat.jumpingDown = true;
}

// Button Click
function buttonDown()
{
	aldaEngine.unlockAudio();

	switch (gameState)
	{
		case GameState.Ready:
			doFirstJump();
			break;

		case GameState.InGame:
			if (firstJump)
				return;

			jumpDown(player);
			break;
	}
}

// Clear avatars
function removeAvatarImages()
{
	for (var i = avatarImages.length - 1; i >= 0; --i)
	{
		avatarImages[i].destroy();
	}
	avatarImages.length = 0
}

// Collision
function collisionHandler(catSprite, blockSprite)
{
	if (firstJump || gameState != GameState.InGame)
		return;

	catSprite.jumpingDown = false;

	if (blockSprite.x < catSprite.x + 5)
	{
		var isPlayer = catSprite === player;

		if (isPlayer)
		{
			if (audioEnabled)
			{
				var index = Math.floor(Math.random() * jumpSounds.length);
				jumpSounds[index].play();
			}
			dustEmit(catSprite.x, blockSprite.y);
		}

        jump(catSprite);

        var hp = blockSprite.health;

		if (hp !== 0 && islandsGroup.length > 1)
		{
			if (blockSprite.frame !== 2)
			{
				game.add.tween(blockSprite).to({ y: "+15" }, 300, Phaser.Easing.Exponential.Out)
					.to({ y: "-10" }, 500, Phaser.Easing.Linear.None)
					.start();
			}

			if (isPlayer)
			{
				var inc = hp - aldaEngine.score;
				if (inc > 0)
				{
					plusText.x = blockSprite.x + blockSprite.width / 2;
					plusText.y = blockSprite.y - 10;
					plusText.text = "+" + inc;
					plusText.alpha = 1;

					game.add.tween(plusText).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
					game.add.tween(plusText).to({ y: "-25" }, 400, Phaser.Easing.Linear.None, true);
				}
				aldaEngine.updateScore(hp);
			}
			else
			{
				aldaEngine.updateScore(hp, true, OnErrorCallback);
			}

			if (BUILD_TYPE === Implementation.Basic)
				scoreText.text = aldaEngine.score;

			blockSprite.health = 0;
		}
	}
}

// Emit dust
function dustEmit(x, y)
{
	if (PINATA)
	{
		if (firstJump)
			return;

		var halfX = player.body.halfHeight;
		var x = player.x + halfX;
		var y = player.y + 15;
		var offsetY = 30;
		halfX = 0;

		getPrd(x - halfX, y, false);
		getPrd(x - halfX - offsetY, y + offsetY, false);
		getPrd(x - halfX, y + offsetY * 2, false);

		getPrd(x + halfX, y, true);
		getPrd(x + halfX + offsetY, y + offsetY, true);
		getPrd(x + halfX, y + offsetY * 2, true);
	}
	else
	{
		dustEmitter.x = x;
		dustEmitter.y = y;
		dustEmitter.start(true, 500, null, 4);
	}
}

// Emit water
function waterEmit(x, y)
{
	waterEmitter.x = x;
	waterEmitter.y = y;
	waterEmitter.start(true, 1500, null, 30);
}

// Ziska prd
function getPrd(x, y, isOnLeft)
{
	if (isOnLeft)
		y += 35;

	var prd;

	if (prdPool.length > 0)
	{
		prd = prdPool.pop();
		prd.reset(x, y);
		prd.alpha = 1;
		prdGroup.add(prd);
		prd.anim.restart();
	}
	else
	{
		prd = game.add.image(x, y, "prd", 0, prdGroup);
		prd.anim = prd.animations.add("prd").play(10, false, false);
	}

	prd.angle = isOnLeft ? 180 : 0;
	prd.anchor.setTo(0.5, isOnLeft ? 0 : 1);

	var tween1 = game.add.tween(prd).to({ x: (isOnLeft ? "+250" : "-50") }, 420, Phaser.Easing.Linear.None);
	var tween2 = game.add.tween(prd).to({ alpha: 0 }, 420, Phaser.Easing.Quartic.In);
	tween1.onComplete.addOnce(function()
	{
		prdGroup.remove(prd, false, true);
		removePrd(prd);
	}, this);
	tween1.start();
	tween2.start();
}


// Jump
function jump(cat)
{
	cat.loadTexture("cat_jump", 0);
	cat.body.setSize(60, 78, 40, 0);
	cat.jumpingDown = false;

	var anim = cat.animations.add("jump");

	anim.onComplete.add(function()
	{
		cat.loadTexture("cat_up", 0);
		cat.body.setSize(64, 78, 40, 0);
		cat.animations.add("up").play(PINATA ? 7 : 10, true);
	}, this);

	anim.play(PINATA ? 30 : 20);

	cat.body.velocity.y = JUMP_SPEED;
}

// 3D effect
function parallaxEffect(delta)
{
	if (delta < 0)
		return;

	backgrounds[1].tilePosition.x -= delta * 0.05;
	backgrounds[2].tilePosition.x -= delta * 0.1;
	backgrounds[3].tilePosition.x -= delta * 0.15;
	backgrounds[4].tilePosition.x -= delta * 0.2;
	backgrounds[5].tilePosition.x -= delta * 0.5;

	var visibleTrees = treesGroup.children;
	for (var i = visibleTrees.length - 1; i >= 0; --i)
	{
		visibleTrees[i].x -= delta * 0.35;
	}
}

// Error callback
function OnErrorCallback(error)
{
	if (error)
	{
		console.error(error);
	}
}

// Update
GameMain.prototype.update = function()
{
	if (updatePaused)
		return;

	var ghostInGame = ghost && ghost.alive;

	switch (gameState)
	{
		case GameState.Ready:
			// Physics
			game.physics.arcade.collide(player, islandsGroup, collisionHandler, null, this);
			if (ghostInGame)
				game.physics.arcade.collide(ghost, islandsGroup, collisionHandler, null, this);
			break;

		case GameState.GhostOnly:
			// Physics
			game.physics.arcade.collide(player, islandsGroup, collisionHandler, null, this);
			game.physics.arcade.collide(ghost, islandsGroup, collisionHandler, null, this);

			if (!ghost.jumpingDown)
				ghost.body.velocity.x = MOVE_SPEED + Math.min(4 * aldaEngine.score, 360);

			// Spawn and remove blocks
			blockManager.manageBlocks();
			break;

		case GameState.InGame:
			// Ghost jumping
			if (ghostInGame && ghostData && ghostData.data.jumps.length > 0)
			{
				if (game.time.now - startTimeGhost >= ghostData.data.jumps[0].t)
				{
					var first = ghostData.data.jumps.shift();
					ghost.x = first.x;
					ghost.y = first.y;
					jumpDown(ghost);
				}
			}

			// Physics
			game.physics.arcade.collide(player, islandsGroup, collisionHandler, null, this);
			if (ghostInGame)
				game.physics.arcade.collide(ghost, islandsGroup, collisionHandler, null, this);

			// Move cats
			if (!player.jumpingDown)
				player.body.velocity.x = MOVE_SPEED + Math.min(4 * aldaEngine.score, SCORE_MOVE_SPEED_MAX);
			if (ghostInGame && !ghost.jumpingDown)
				ghost.body.velocity.x = MOVE_SPEED + Math.min(4 * aldaEngine.ghostScore, SCORE_MOVE_SPEED_MAX);

			// First jump
			if (firstJump)
			{
				var firstBlock = islandsGroup.getChildAt(0);
				if (firstBlock.x + firstBlock.width < player.x + player.body.width / 2)
				{
					jump(player);
					firstJump = false;
				}
			}

			// Enlarge world
			if (player.x > game.world.width - game.width)
				game.world.setBounds(0, 0, game.world.width + game.width, game.height);

			// Environment
			parallaxEffect(player.x - lastPlayerX);

			// Spawn and remove blocks
			blockManager.manageBlocks();

			// In water
			if (player.y - player.body.halfHeight >= game.height - HEIGHT_WATER)
				fallInWater(player);

			// In water
			if (ghostInGame && ghost.y - ghost.body.halfHeight >= game.height - HEIGHT_WATER && ghost.body.velocity.y > 0)
				fallInWater(ghost);

			lastPlayerX = player.x;
			break;
	}
}

function fallInWater(cat)
{
	if (cat === ghost)
	{
		ghost.kill();
		return;
	}

	gameState = GameState.Dead;

	if (audioEnabled)
	{
		drownSound.play();
	}

	waterEmit(player.x, player.y - player.height / 2);

	player.body.velocity.x = 0;

	var timer = game.time.create();
	timer.add(500, die, this);
	timer.start();
}

function die()
{
	if (gameState !== GameState.Dead)
	{
		console.warn("die() called from invalid gameState: " + gameState);
		return;
	}

	player.kill();

	if (ghostMode === GhostMode.Off || (ghostMode === GhostMode.On && ghostData && player.x > ghostData.data.x))
	{
		var storeData =
		{
			variant: "0",
			data: JSON.stringify(
			{
				"x": Math.round(player.x * 100) / 100, // round to 2 decimal digits
				"startTime": startTimePlayer,
				"jumps": playerJumpHistory,
				"platforms": blockManager.platformHistory,
				"tasks": launchTaskQueue
			})
		};
		aldaEngine.gameOver(storeData, OnErrorCallback);
	}
	else
	{
		aldaEngine.gameOver();
	}
	
	game.stage.disableVisibilityChange = false;

	if (BUILD_TYPE === Implementation.Basic)
	{
		aldaEngine.menuManager.showMenu("gameEndedMenu");
	}
}

function log(message)
{
	if (CONSOLE_OUTPUT || TEST)
	{
		console.log(message);
	}
}

// Debug
/*GameMain.prototype.render = function()
{
}*/