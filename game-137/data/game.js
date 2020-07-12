var BlockManager = function (islands, trees)
{
	this.blocksCounter = 0;

	this.loadFromHistory;
	this.platformHistory;
	this.platformHistoryIndex = 0;

	this.lastPlatformX = 0;
	this.lastTreeX = 0;

	this.pools = [islands.length + trees.length + 2];

	for (var i = islands.length - 1; i >= 0; --i)
	{
		var name = islands[i].name;

		this.pools[name] = [];
		this.pools[name][0] = [];
		this.pools[name][1] = [];
		this.pools[name][2] = [];
		this.pools[name][3] = [];
	}

	for (var i = trees.length - 1; i >= 0; --i)
	{
		var name = trees[i];

		this.pools[name] = [];
		this.pools[name][0] = [];
	}

	this.pools["rope"] = [];
	this.pools["rope"][0] = [];

	this.pools["ropeEnd"] = [];
	this.pools["ropeEnd"][0] = [];
};


BlockManager.prototype.addToPool = function (block)
{
	block.kill();

	game.tweens.removeFrom(block);

	this.pools[block.key][block.frame].push(block);
}


BlockManager.prototype.clear = function ()
{
	islandsGroup.forEach(this.addToPool, this);
	islandsGroup.removeAll();

	treesGroup.forEach(this.addToPool, this);
	treesGroup.removeAll();

	//avatarGroup.removeAll();
}

BlockManager.prototype.setUpTweens = function (id)
{
	if (ghostMode === GhostMode.On)
	{
		switch (gameState)
		{
			case GameState.InMenu:
			case GameState.Ready:
				return;

			default:
				if (queueIndex < launchTaskQueue.length)
					return;
				break;
		}
	}

	var score = (typeof aldaEngine.score === "undefined") ? 0 : aldaEngine.score;
	var speed = Math.min(125 + score * 0.5, 200) + game.rnd.integerInRange(-10, 10);
	var frame = game.rnd.integerInRange(0, 3);
	var variant = Math.random() < 0.5;

	launchTaskQueue.push({
		m: Tasks.SetUpTweensFromData,
		h: id,
		s: speed,
		f: frame,
		v: variant
	});
}

BlockManager.prototype.setUpTweensFromData = function (block, speed, frame, variant)
{
	if (variant)
	{
		this.setUpTween1(block, speed, frame);
	}
	else
	{
		this.setUpTween2(block, speed, frame);
	}
}

BlockManager.prototype.setUpTween1 = function (block, speed, frame)
{
    var instance = this;
    var enabled;

    if (frame > 0)
    {
        block.y -= 60;
        frame--;
        enabled = false;
    }
    else
        enabled = true;

    setUpTween(block, { y: "-60" } , 6 * speed, function()
    {
        if (frame > 0)
        {
            block.x -= 100;
            frame--;
            enabled = false;
        }
        else
            enabled = true;

        setUpTween(block, { x: "-100" } , 10 * speed, function()
        {
            if (frame > 0)
            {
                block.y += 60;
                frame--;
                enabled = false;
            }
            else
                enabled = true;

            setUpTween(block, { y: "+60" } , 6 * speed, function()
            {
                if (frame > 0)
                {
                    block.x += 100;
                    frame--;
                    enabled = false;
                }
                else
                    enabled = true;

                setUpTween(block, { x: "+100" } , 10 * speed, function() { instance.setUpTween1(block, speed, 0); }, enabled);
            }, enabled);
        }, enabled);
    }, enabled);
}

BlockManager.prototype.setUpTween2 = function (block, speed, frame)
{
    var instance = this;
    var enabled;

    if (frame > 0)
    {
        block.y -= 60;
        frame--;
        enabled = false;
    }
    else
        enabled = true;

    setUpTween(block, { y: "-60" } , 6 * speed, function()
    {
        if (frame > 0)
        {
            block.x += 100;
            frame--;
            enabled = false;
        }
        else
            enabled = true;

        setUpTween(block, { x: "+100" } , 10 * speed, function()
        {
            if (frame > 0)
            {
                block.y += 60;
                frame--;
                enabled = false;
            }
            else
                enabled = true;

            setUpTween(block, { y: "+60" } , 6 * speed, function()
            {
                if (frame > 0)
                {
                    block.x -= 100;
                    frame--;
                    enabled = false;
                }
                else
                    enabled = true;

                setUpTween(block, { x: "-100" } , 10 * speed, function() { instance.setUpTween1(block, speed, 0); }, enabled);
            }, enabled);
        }, enabled);
    }, enabled);
}

function setUpTween(block, position, speed, onComplete, enabled)
{
    if (enabled)
    {
        game.add.tween(block)
        	.to(position, speed, Phaser.Easing.Linear.None, true, 0, 0)
        	.onComplete.addOnce(onComplete, this);
    }
    else
    {
        onComplete();
    }
}

BlockManager.prototype.getTreeFromPool = function (name, posX, posY)
{
	var pool = this.pools[name][0];

	if (pool.length > 0)
	{
		var tree = pool.pop();
		tree.reset(posX, posY);
		treesGroup.add(tree);
	}
	else
	{
		game.add.image(posX, posY, name, 0, treesGroup)
			.anchor.setTo(0.5, 1);
	}
}

BlockManager.prototype.getRopeFromPool = function (posX, posY)
{
	if (this.pools["rope"][0].length > 0)
	{
		var rope = this.pools["rope"][0].pop();
		rope.reset(posX, posY + HEIGHT_ROPE);
		islandsGroup.add(rope);
	}
	else
	{
		game.add.image(posX, posY + HEIGHT_ROPE, "rope", 0, islandsGroup)
			.anchor.setTo(0, 0.5);
	}

	if (this.pools["ropeEnd"][0].length > 0)
	{
		var end1 = this.pools["ropeEnd"][0].pop();
		end1.reset(posX, posY + HEIGHT_ROPE);
		islandsGroup.add(end1);
	}
	else
	{
		game.add.image(posX, posY + HEIGHT_ROPE, "ropeEnd", 0, islandsGroup)
			.anchor.setTo(0.5, 0.5);
	}

	if (this.pools["ropeEnd"][0].length > 0)
	{
		var end2 = this.pools["ropeEnd"][0].pop();
		end2.reset(posX + 130, posY + HEIGHT_ROPE);
		islandsGroup.add(end2);
	}
	else
	{
		game.add.image(posX + 130, posY + HEIGHT_ROPE, "ropeEnd", 0, islandsGroup)
			.anchor.setTo(0.5, 0.5);
	}
}

BlockManager.prototype.getIslandFromPool_createFrame0 = function (island, block, posX, posY, id, create)
{
	this.getRopeFromPool(posX, posY);

	var score = (typeof aldaEngine.score === "undefined") ? 0 : aldaEngine.score;
	var speed = Math.min(1250 + 5 * score, 2000) + game.rnd.integerInRange(-100, 100);
	var tweenDelta;

	if (Math.random() < 0.5)
	{
		if (create)
			block = this.createTileSprite(island, posX + 130 - island.x / 2, posY, 0);
		else
			block.reset(posX + 130 - island.x / 2, posY);
		tweenDelta = { x: "-130" };
	}
	else
	{
		if (create)
			block = this.createTileSprite(island, posX - island.x / 2, posY, 0);
		else
			block.reset(posX - island.x / 2, posY);
		tweenDelta = { x: "+130" };
	}

	this.setUpTween0FromData(block, speed, tweenDelta, id);

	return block;
}

BlockManager.prototype.setUpTween0FromData = function (block, speed, tweenDelta, id)
{
	switch (gameState)
	{
		case GameState.InMenu:
		case GameState.Ready:
			launchTaskQueue.push({
				m: Tasks.SetUpTween0FromData,
				h: id,
				s: speed,
				t: tweenDelta
			});
		break;

		default:
			game.add.tween(block).to(tweenDelta, speed, Phaser.Easing.Linear.None, true, 0, -1, true);
		break;
	}
}

BlockManager.prototype.getIslandFromPool = function (island, frame, posX, posY)
{
	var pool = this.pools[island.name][frame];
	var block;
	var hp = ++this.blocksCounter;
	
	if (!this.loadFromHistory)
	{
		var historyItem =
		{
			i: island.index,
			f: frame,
			x: posX,
		};
		if (posY !== game.height - HEIGHT_ISLANDS)
		{
			historyItem.y = posY;
		}
		this.platformHistory.push(historyItem);
	}

	if (pool.length > 0)
	{
		block = pool.pop();

		switch (frame)
		{
			// moving block
			case 0:
				block = this.getIslandFromPool_createFrame0(island, block, posX, posY, hp, false);
				break;

			// static block
			case 1:
				block.reset(posX, posY);
				break;

            // cycling block
			case 2:
				block.reset(posX, posY + 10);
				this.setUpTweens(hp);
			break;

            // fake block
			case 3:
				block.reset(posX, posY + 10);
			break;
		}

		this.lastPlatformX = block.x;
		islandsGroup.add(block);
	}
	else
	{
		switch (frame)
		{
			// moving block
			case 0:
				block = this.getIslandFromPool_createFrame0(island, block, posX, posY, hp, true);
				break;

			// static block
			case 1:
				block = this.createTileSprite(island, posX, posY, frame);
                break;

            // cycling block
			case 2:
				block = this.createTileSprite(island, posX, posY + 10, frame);
				this.setUpTweens(hp);
				break;

			// fake block
			case 3:
				block = this.createTileSprite(island, posX, posY, frame);
                break;
		}
	}

	block.health = hp;

	this.drawAvatars(block);
}

BlockManager.prototype.processLaunchTaskQueue = function ()
{
	var launchTaskQueueLength = launchTaskQueue.length;
	for (i = queueIndex; i < launchTaskQueueLength; ++i)
	{
		var taskData = launchTaskQueue[i];
		var block;
		var found = false;

		for (var j = islandsGroup.children.length - 1; j >= 0; --j)
		{
			block = islandsGroup.children[j];
			if (block.health === taskData.h)
			{
				found = true;
				break;
			}
		}
		
		if (!found)
		{
			console.warn(taskData.h, launchTaskQueue);
			return;
		}

		switch (taskData.m)
		{
			case Tasks.SetUpTweensFromData:
				this.setUpTweensFromData(block, taskData.s, taskData.f, taskData.v);
			break;

			case Tasks.SetUpTween0FromData:
				this.setUpTween0FromData(block, taskData.s, taskData.t);
			break;
		}
		queueIndex++;
	}
}

BlockManager.prototype.drawAvatars = function (block)
{
	var friendAvatarsLen = friendAvatars.length;
	if (friendAvatarsLen === 0)
		return;

	var count = 0;
	while (count < friendAvatarsLen && friendAvatars[count].highScore < block.health + 1)
	{
		count++;
	}

	for (var i = 0; i < count; ++i)
	{
		var friend = friendAvatars.shift();
		var x;
		var y = game.height - HEIGHT_WATER;

		var islandsGroupLen = islandsGroup.children.length;
		if (islandsGroupLen > 1)
		{
			var prevBlock = islandsGroup.children[islandsGroupLen - 2];
			if (prevBlock.body)
			{
				var delta = block.x - prevBlock.body.right;
				x = prevBlock.body.right + delta * (i + 1) / (count + 1);
			}
			else
			{
				var right = prevBlock.x + prevBlock.width;
				var delta = block.x - right;
				x = right + delta * (i + 1) / (count + 1);
			}
		}
		else
		{
			console.warn("no platforms in game, friend highScore: " + friend.highScore);
			x = block.x - 20;
		}

		var hexagon = game.add.image(x, y, "avatar_bg", 0, avatarGroup);
		hexagon.anchor.setTo(0.5, 0.5);

		var line = game.add.image(x, y + hexagon.height / 2, "avatar_line", 0, avatarGroup);
		line.anchor.setTo(0.5, 0.5);

		var avatar = game.add.image(x, y, friend.avatar, 0, avatarGroup);
		avatar.anchor.setTo(0.5, 0.5);
		
		if (avatar.width > AVATAR_MAX_WIDTH)
			avatar.width = AVATAR_MAX_WIDTH;
		if (avatar.height > AVATAR_MAX_HEIGHT)
			avatar.height = AVATAR_MAX_HEIGHT;

		var t = 0.3;
		var poly = new Phaser.Polygon();
		poly.setTo([		
			new Phaser.Point(0, -100*t),
			new Phaser.Point(-86.6 *t, -50 *t),
			new Phaser.Point(-86.6 *t, +50 *t),
			new Phaser.Point(0, +100*t),
			new Phaser.Point(+86.6 *t, +50 *t),
			new Phaser.Point(+86.6 *t, -50 *t),
		]);

		var mask = game.add.graphics(x, y);
		mask.beginFill(0xffffff);
    	mask.drawPolygon(poly.points);
		avatar.mask = mask;

		avatarImages.push(hexagon);
		avatarImages.push(line);
		avatarImages.push(avatar);
		avatarImages.push(mask);
	}
}

BlockManager.prototype.getIsland = function ()
{
	var difficulty = Math.min(aldaEngine.score, 200);
	var array;

	if (difficulty < 20)
		array = difficulties[0];
	if (difficulty < 40)
		array = difficulties[1];
	else if (difficulty < 60)
		array = difficulties[2];
	else if (difficulty < 80)
		array = difficulties[3];
	else if (difficulty < 100)
		array = difficulties[4];
	else
		array = difficulties[5];

	return game.rnd.weightedPick(array);
}

// Spawn and remove blocks
BlockManager.prototype.manageBlocks = function (first)
{
	first = first || false;
	var cat = (ghost && ghost.alive) ? ghost : player;

	// Remove islands
	var minBlockX = cat.x - 2 * game.width;
	var visibleIslands = islandsGroup.children;

	for (var i = visibleIslands.length - 1; i >= 0; --i)
	{
		var block = visibleIslands[i];
		if (block.x < minBlockX)
		{
			islandsGroup.remove(block);
			this.addToPool(block);
		}
		else if (block.frame === 3 && block.x - cat.x < 20)
		{
			game.add.tween(block).to({y: game.height}, 250, Phaser.Easing.Linear.None, true);
		}
	}

	// Remove trees
	var visibleObjects = treesGroup.children;
	for (var i = visibleObjects.length - 1; i >= 0; --i)
	{
		var tree = visibleObjects[i];
		if (tree.x < -tree.width)
		{
			treesGroup.remove(tree);
			this.addToPool(tree);
		}
	}

	// Spawn island
	if (cat.x + game.width / 2 > this.lastPlatformX)
	{
		if (this.loadFromHistory && this.platformHistoryIndex >= this.platformHistory.length)
		{
			this.loadFromHistory = false;
		}

		if (this.loadFromHistory)
		{
			var first = this.platformHistory[this.platformHistoryIndex++];
			var y = (typeof first.y === "undefined") ? game.height - HEIGHT_ISLANDS : first.y;
			this.getIslandFromPool(islands[first.i], first.f, first.x, y);
		}
		else
		{
			var score = (typeof aldaEngine.score === "undefined") ? 0 : aldaEngine.score;
			var randomN = 100 * Math.random();
			var specBlocksP = Math.min(score / 4 + 5, 25);
			var posX, frame;

			// fake blok
			var lastBlock = this.getLastBlock();
			var lastBlockWasFake = (lastBlock !== null && lastBlock.frame === 3);
			var multiplier = lastBlockWasFake ? 0.65 : 1;

			if (randomN < specBlocksP)
			{
				frame = 0;
				posX = this.lastPlatformX + Math.min(350 + score, 480) * multiplier;
			}
			else if (randomN < 2 * specBlocksP)
			{
				frame = 2;
				posX = this.lastPlatformX + Math.min(350 + score, 480) * multiplier;
			}
			else if (randomN < 3 * specBlocksP && !lastBlockWasFake && score > 20)
			{
				frame = 3;
				posX = this.lastPlatformX + Math.min(350 + score, 480) * 0.65;
			}
			else
			{
				frame = 1;
				posX = this.lastPlatformX + Math.min(350 + score, 480) * multiplier + game.rnd.integerInRange(-50, 50);
			}

			this.getIslandFromPool(this.getIsland(), frame, posX, game.height - HEIGHT_ISLANDS);
		}

		if (!first)
		{			
			this.processLaunchTaskQueue();
		}
	}

	// Spawn trees
	while (this.lastTreeX < cat.x + 640)
	{
		this.lastTreeX += game.rnd.integerInRange(30, 920);
		var name = AldaEngine.getRandomItem(trees);
		this.getTreeFromPool(name, this.lastTreeX - treesGroup.x , game.height - HEIGHT_GROUND + 30);
	}
}

BlockManager.prototype.getLastBlock = function ()
{
	var len = islandsGroup.children.length;
	return (len === 0) ? null : islandsGroup.children[len - 1];
}

BlockManager.prototype.createNewGame = function (storeData)
{
	// Remove
	this.clear();

	this.blocksCounter = 0;
	this.lastTreeX = 0;
	this.platformHistoryIndex = 0;

	// Spawn 1st island
	if (storeData)
	{
		this.loadFromHistory = true;
		this.platformHistory = storeData.data.platforms;
	}
	else
	{
		this.loadFromHistory = false;
		this.platformHistory = [];
	}

	var island = islands[0];
	var posX = PLAYER_X - island.x / 2;
	var posY = game.height - HEIGHT_ISLANDS;
	var frame = game.rnd.integerInRange(0, 2);
	this.createTileSprite(island, posX, posY, frame);

	this.manageBlocks(true);
}


BlockManager.prototype.createTileSprite  = function (island, posX, posY, frame)
{
	var gameObject = game.add.tileSprite(posX, posY, island.x, island.y, island.name, frame);
	gameObject.autoCull = true;

	if (frame !== 3)
	{
		game.physics.arcade.enable(gameObject);

		var body = gameObject.body;

		body.allowGravity = false;
		body.allowRotation = false;
		body.immovable = true;
		body.moves = false;

		body.checkCollision.up = true;
		body.checkCollision.down = false;
		body.checkCollision.left = true;
		body.checkCollision.right = false;
	}

	this.lastPlatformX = gameObject.x;

	islandsGroup.add(gameObject);

	return gameObject;
}
