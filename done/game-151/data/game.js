var BlockManager = function (gameInstance)
{
	this.phaserInstance = gameInstance;

	this.blocksCounter = 0;
	this.lastPlatform = { x: 0, y: 0 };
	this.lastItem =
	{
		name: "",
		left: 0,
		right: 0
	}
	this.firstPlatform = INTRO_PLATFORM;
	this.lastSkyJump = null;
	this.itemDistances = { min: itemsDistanceConfig.startDistances.min, max: itemsDistanceConfig.startDistances.max };

    this.signQueue = [];
    this.signIndex = -1;

	this.pools = new Array(platforms.length + barriers.length + 9);

	for (var i = platforms.length - 1; i >= 0; --i)
	{
		var platform = platforms[i];
		this.pools[platform.start] = [];
		this.pools[platform.end] = [];
	}

	for (var i = decorations.length - 1; i >= 0; --i)
	{
		var decoration = decorations[i];
		this.pools[decoration.name] = [];
	}

	for (var i = barriers.length - 1; i >= 0; --i)
	{
		var barrier = barriers[i];
		this.pools[barrier.name] = [];

		var nextItem = barrier.nextItem;
		while (typeof nextItem !== "undefined")
		{
			this.pools[nextItem.name] = [];
			nextItem = nextItem.nextItem;
		}
	}

	this.pools[mostik.name] = [];
	this.pools[skyJump.name] = [];
	this.pools[jumper.name] = [];
	this.pools[bridgeHole.name] = [];

	this.pools["sauna_doors_open"] = [];
	this.pools["bridge_start"] = [];
	this.pools["bridge_end"] = [];
	this.pools["column"] = [];
	this.pools["lake_start"] = [];
	this.pools["lake_end"] = [];
};

BlockManager.prototype.clearGroup = function (group)
{
    for (var i = group.children.length - 1; i >= 0; --i)
    {
        this.addToPool(group.children[i]);
    }
    group.removeAll();
}

BlockManager.prototype.createNewGame = function ()
{
    // Remove
    this.clearGroup(decorBgGroup);
    this.clearGroup(lakeGroup);
    this.clearGroup(bridgeGroup);
    this.clearGroup(islandsGroup);
    this.clearGroup(treesGroup);
    this.clearGroup(barriersGroup);

    if (this.signIndex !== -1)
    {
        this.addToPool(this.signQueue[this.signIndex].sign);
        this.signIndex = -1;
    }
    this.signQueue = [];

    this.itemDistances = { min: itemsDistanceConfig.startDistances.min, max: itemsDistanceConfig.startDistances.max };
	this.lastPlatform = { x: 0, y: 0 };
	this.lastItem =
	{
		name: "",
		left: 0,
		right: 0
	}
	this.blocksCounter = 0;
	this.lastSkyJump = null;

	// Spawn
	this.getPlatformFromPool(AldaEngine.getRandomItem(platforms), this.firstPlatform.x, this.firstPlatform.y, this.firstPlatform.length);

	this.firstPlatform = RESTART_PLATFORM;
	this.manageBlocks();
}

BlockManager.prototype.addToPool = function (block, removeFromGroup)
{
	if (removeFromGroup)
	{
		if (block.parent)
		    block.parent.remove(block);
	}

	if (block.emitter)
	{
		block.emitter.kill();
		block.emitter.visible = false;
	}

	switch (block.key)
	{
		case "snow":
		case "lake":
	    case "bridge":
	    case "igloo_man":
	    case "jumper":
			block.destroy();
			block = null;
			break;

		default:
		    block.kill();
		    this.pools[block.key].push(block);
			break;
	}
}

BlockManager.prototype.getTreeFromPool = function (config, posX, posY, saveLastItem)
{
	var name = config.name;
	if (this.lastItem.name === name && name !== tree.name)
	    return null;

	var pool = this.pools[name];
	var decor;

	if (pool.length > 0)
	{
		decor = pool.pop();
		decor.reset(posX, posY);

		if (name === skyJump.name)
		{
		    decor.hasJumper = false;
		}
	}
	else
	{
	    decor = this.createDecoration(config, posX, posY);
	}

	if (typeof config.group !== "undefined")
	    groups[config.group].add(decor);

	if (typeof saveLastItem === "undefined" || saveLastItem)
    {
        var right = posX + decor.width;
        if (right > this.lastItem.right)
        {
            this.lastItem =
            {
                name: name,
                left: posX,
                right: right
            }
        }
    }

    return decor;
}

BlockManager.prototype.getSignFromPool = function (config)
{
    var pool = this.pools[config.name];

    if (pool.length > 0)
    {
        signImage = pool.pop();
        signImage.reset(SIGNS.x, SIGNS.y);
    }
    else
    {
        signImage = this.phaserInstance.add.sprite(SIGNS.x, SIGNS.y, config.name);
        signImage.fixedToCamera = true;
    }

    return signImage;
}

BlockManager.prototype.getBarrierFromPool = function (config, posX, posY)
{
	var pool = this.pools[config.name];
	var barrier;

	if (pool.length > 0)
	{
		barrier = pool.pop();
		barrier.reset(posX, posY);
		barriersGroup.add(barrier);

		switch (config.name)
		{
			case "snowman_head":
			    barrier.angle = 0;
			    barrier.onUpdate = null;
			    barrier.minY = null;

			    var body = barrier.body;
			    body.velocity.x = 0;
			    body.velocity.y = 0;
			    body.angularVelocity = 0;
				body.static = true;
				body.fixedRotation = true;
				break;

			case "yeti":
				barrier.state = 0;
				barrier.baseY = posY;
				break;
		}

		if (barrier.emitter)
		{
			barrier.emitter.revive();
			barrier.emitter.visible = true;
		}
	}
	else
	{
		barrier = this.createBarrier(config, posX, posY);
	}

	if (barrier.emitter)
	{
		barrier.emitter.start(false, 1000, 500, 0, false);
	}

	if (barrier.body)
	{
		barrier.body.setCollisionGroup(barrierCollisionGroup);
		barrier.body.collides([]);
	}

	var right = posX + barrier.width;
	if (right > this.lastItem.right)
	{
		this.lastItem =
		{
		    name: config.name,
			left: posX,
			right: right
		}
	}

	var b = barrier;
	var nextItem = config.nextItem;
	while (typeof nextItem !== "undefined")
	{
		b.nextItem = this.getBarrierFromPool(nextItem, posX + nextItem.x, posY + nextItem.y);
		b = b.nextItem;
		nextItem = nextItem.nextItem;
	}

	return barrier;
}

BlockManager.prototype.getPlatformFromPool = function (platform, posX, posY, length)
{
	var pool = this.pools[platform.start];
	if (pool.length > 0)
	{
		var block = pool.pop();
		block.reset(posX, posY);
		islandsGroup.add(block);
	}
	else
	{
		var block = this.createPlatform(platform.start, posX, posY, islandsGroup);
		block.body.setCollisionGroup(platformCollisionGroup);
	}

	posX += 150;

	this.createPlatformWithLength(snowSprite, posX - 41, posY, length + 82, islandsGroup, true);

	posX += length;

	pool = this.pools[platform.end];
	if (pool.length > 0)
	{
		var block = pool.pop();
		block.reset(posX, posY);
		islandsGroup.add(block);
	}
	else
	{
	    var block = this.createPlatform(platform.end, posX, posY, islandsGroup);
		block.body.setCollisionGroup(platformCollisionGroup);
	}
    
	this.lastPlatform =
	{
		x: posX + 150,
		y: posY
	};
}

BlockManager.prototype.getBridgeFromPool = function (posX, posY, length)
{
	var pool = this.pools["bridge_start"];
	if (pool.length > 0)
	{
		var block = pool.pop();
		block.reset(posX, posY);
		bridgeGroup.add(block);
	}
	else
	{
	    var block = this.createPlatform("bridge_start", posX, posY, bridgeGroup);
		block.body.setCollisionGroup(platformCollisionGroup);
	}

	posX += 86;

	var bridge = this.createPlatformWithLength(bridgeSprite, posX - 41, posY, length + 82, bridgeGroup, true);
	bridge.isOk = true;
	bridge.columns = [];
	bridge.onCollision = function (block)
	{
	    onBridge = block;
	};
	bridge.onCollisionExit = function()
	{
	    onBridge = null;
	};

	if (length > BRIDGE.minLengthFor2Pillars)
	{
		var third = length / 3;
		var x = posX - 43;
		var y = posY + bridgeSprite.height;

		pool = this.pools["column"];
		if (pool.length > 0)
		{
			var block = pool.pop();
			block.reset(x + third, y);
			bridgeGroup.add(block);
			bridge.columns.push(block);
		}
		else
		{
			var block = this.createObject("column", x + third, y, bridgeGroup);
			bridge.columns.push(block);
		}

		pool = this.pools["column"];
		if (pool.length > 0)
		{
			var block = pool.pop();
			block.reset(x + 2 * third, y);
			bridgeGroup.add(block);
			bridge.columns.push(block);
		}
		else
		{
			var block = this.createObject("column", x + 2 * third, y, bridgeGroup);
			bridge.columns.push(block);
		}
	}
	else if (length > BRIDGE.minLengthFor1Pillar)
	{
		var x = posX - 43 + length / 2;
		var y = posY + bridgeSprite.height;

		pool = this.pools["column"];
		if (pool.length > 0)
		{
			var block = pool.pop();
			block.reset(x, y);
			bridgeGroup.add(block);
			bridge.columns.push(block);
		}
		else
		{
			var block = this.createObject("column", x, y, bridgeGroup);
			bridge.columns.push(block);
		}
	}

	posX += length;

	pool = this.pools["bridge_end"];
	if (pool.length > 0)
	{
		var block = pool.pop();
		block.reset(posX, posY);
		bridgeGroup.add(block);
	}
	else
	{
	    var block = this.createPlatform("bridge_end", posX, posY, bridgeGroup);
		block.body.setCollisionGroup(platformCollisionGroup);
	}
}

BlockManager.prototype.getLakeFromPool = function (posX, posY, length)
{
	var pool = this.pools["lake_start"];
	if (pool.length > 0)
	{
		var block = pool.pop();
		block.reset(posX, posY);
		lakeGroup.add(block);
	}
	else
	{
		this.createObject("lake_start", posX, posY, lakeGroup);
	}

	posX += 155;

	this.createPlatformWithLength(lakeSprite, posX - 1, posY, length + 2, lakeGroup, false);

	posX += length;

	pool = this.pools["lake_end"];
	if (pool.length > 0)
	{
		var block = pool.pop();
		block.reset(posX, posY);
		lakeGroup.add(block);
	}
	else
	{
		this.createObject("lake_end", posX, posY, lakeGroup);
	}
}

BlockManager.prototype.checkForRemoveGroup = function (group, minX)
{
    group = group.children;

	for (var i = group.length - 1; i >= 0; --i)
	{
	    var block = group[i];
		if (block.x + block.width < minX)
		{
			this.addToPool(block, true);
		}
		else
		{
			if (block.onUpdate)
				block.onUpdate(block);
		}
	}
}

// Spawn and remove blocks
BlockManager.prototype.manageBlocks = function ()
{
	var minBlockX = player.x - this.phaserInstance.width;

    // Remove objects and move them to pool
	this.checkForRemoveGroup(decorBgGroup, minBlockX);
	this.checkForRemoveGroup(islandsGroup, minBlockX);
	this.checkForRemoveGroup(bridgeGroup, minBlockX);
	this.checkForRemoveGroup(lakeGroup, minBlockX);
	this.checkForRemoveGroup(treesGroup, minBlockX);
	this.checkForRemoveGroup(barriersGroup, minBlockX);

	if (player.x + this.phaserInstance.width / 2 > this.lastPlatform.x)
	{
		// platform + random item
	    this.buildRandomPlatform(this.lastPlatform.x + this.phaserInstance.rnd.realInRange(MIN_DISTANCE_BETWEEN_PLATFORMS, MAX_DISTANCE_BETWEEN_PLATFORMS),           
            Phaser.Math.clamp(this.lastPlatform.y + this.phaserInstance.rnd.realInRange(PLATFORM.maxHeightDifferenceUp, PLATFORM.maxHeightDifferenceDown),
                this.phaserInstance.height - PLATFORM.maxHeight,
                this.phaserInstance.height - PLATFORM.minHeight
            )
        );
	}

    // vzdialenosti objektov
    var speedDelta = player.speed / 100;
    this.itemDistances.min -= itemsDistanceConfig.decreaseSpeed * speedDelta;
    this.itemDistances.max -= itemsDistanceConfig.decreaseSpeed * speedDelta;

    if (this.itemDistances.min < itemsDistanceConfig.endDistances.min)
    {
        this.itemDistances.min = itemsDistanceConfig.endDistances.min;
    }
    if (this.itemDistances.max < itemsDistanceConfig.endDistances.max)
    {
        this.itemDistances.max = itemsDistanceConfig.endDistances.max;
    }

    // znacky
	for (var i = 0; i < this.signQueue.length; ++i)
	{
	    var item = this.signQueue[i];

	    if (item.visible)
	    {
	        if (player.x >= item.end + SIGNS.distanceAfterObject)
	        {
	            this.signQueue.splice(i--, 1);
	            this.addToPool(item.sign);
	            this.signIndex = -1;
	        }
	    }
        else
	    {
	        if (player.x >= item.start)
	        {
	            if (this.signIndex !== -1)
	            {
	                if (this.signIndex === i)
                        continue;

	                this.addToPool(this.signQueue[this.signIndex].sign);
	                this.signQueue.splice(this.signIndex, 1);
	                this.signIndex = -1;
	                i--;
	            }

	            var sign = this.getSignFromPool(item.sign);
	            sign.queueIndex = i;
	            this.signIndex = i;

	            this.signQueue[i].sign = sign;
	            this.signQueue[i].visible = true;
	        }
	    }
	}
}

BlockManager.prototype.buildRandomPlatform = function (posX, posY)
{
	var length = this.phaserInstance.rnd.realInRange(PLATFORM.minWidth, PLATFORM.maxWidth);

	// Spawn platform
	this.getPlatformFromPool(AldaEngine.getRandomItem(platforms), posX, posY, length);

    if (Math.random() < mostik.probability)
    {
        // Spawn random item
        this.generateRandomItem(posX, posY, length - mostik.width);

        // Spawn mostik
		posX += length + 290 - mostik.width;
		this.getBarrierFromPool(mostik, posX, posY + mostik.y);
	}
	else
	{
		// Spawn random item
        this.generateRandomItem(posX, posY, length + 300);

        // Bridge ?
        if (Math.random() < BRIDGE.probability)
        {
            var startX = this.lastPlatform.x - 20;

            // bridge
            var bridgeLength = this.phaserInstance.rnd.realInRange(BRIDGE.minLength, BRIDGE.maxLength);
            this.getBridgeFromPool(startX, posY, bridgeLength);

            // znacka 80
            this.signQueue.push({ sign: sign80, start: startX - SIGNS.distanceBeforeObject, end: startX + bridgeLength + 172, visible: false });

            // lake
            this.getLakeFromPool(startX - 65, posY + bridgeSprite.height - 1, bridgeLength - 8); // 138 + 65 * 2

            // platform + random item
            this.buildRandomPlatform(this.lastPlatform.x + bridgeLength + 172 - 40, posY);
        }
    }
}

BlockManager.prototype.generateSkyJump = function(x)
{
    if (Math.random() <= skyJump.probability)
    {
        if (this.lastSkyJump === null || this.lastSkyJump.x + skyJump.width < x)
        {
            var skyJumpingBridge = this.getTreeFromPool(skyJump, x, skyJump.y, false);

            if (skyJumpingBridge !== null)
            {
                this.lastSkyJump = skyJumpingBridge;
            }
        }
    }
}

BlockManager.prototype.generateRandomItem = function (platformX, platformY, totalLength)
{
	var platformMaxX = platformX + totalLength;
    var x = platformX + MIN_DISTANCE_FROM_BORDER;

	// Spawn trees + barriers
	while (x > 0 && x < platformMaxX)
	{
		if (Math.random() <= tree.probability)
		{
			if (x + tree.width + MIN_DISTANCE_FROM_BORDER < platformMaxX)
			{
				this.getTreeFromPool(tree, x, this.phaserInstance.rnd.realInRange(platformY + tree.y, this.phaserInstance.height + tree.height - 50));
				x = this.lastItem.right;
			}
		}
		else
		{
		    var barrier = AldaEngine.getRandomItem(barriers);

			if (player.x * POINTS_PER_DISTANCE > barrier.minX)
			{
				if (x + barrier.width + MIN_DISTANCE_FROM_BORDER < platformMaxX)
				{
				    this.getBarrierFromPool(barrier, x, platformY + barrier.y);

				    var sign = barrier.sign;
				    if (sign !== null && Math.random() <= sign.probability)
				    {
				        this.signQueue.push({ sign: sign, start: x - SIGNS.distanceBeforeObject, end: this.lastItem.right, visible: false });
				    }

				    x = this.lastItem.right;
				}
			}
		}

		x += this.phaserInstance.rnd.integerInRange(this.itemDistances.min, this.itemDistances.max);
	}
}

BlockManager.prototype.breakBridge = function (bridge)
{
	if (!bridge.isOk)
		return false;

	var xHole = player.x + player.width;

	if (xHole + bridgeHole.width > bridge.x + bridge.width)
	    return false;

	for (var i = 0; i < bridge.columns.length; ++i)
	{
		var column = bridge.columns[i];

		if (xHole > column.x - bridgeHole.width && xHole < column.x + column.width)
		    return false;
	}

	var x1 = bridge.x;
	var endX = x1 + bridge.width;
	var y = bridge.y;

	bridge.isOk = false;
	this.addToPool(bridge, true);

	var l1 = xHole - x1 + 1;
	var newBridge1 = this.createPlatformWithLength(bridgeSprite, x1, y, l1, bridgeGroup, true);
	newBridge1.isOk = false;

	var hole = this.getTreeFromPool(bridgeHole, xHole, y + bridgeHole.height);

	var x2 = hole.x + hole.width - 1;
	var l2 = endX - x2 + 2;
	if (l2 > 0)
	{
	    this.createPlatformWithLength(bridgeSprite, x2, y, l2, bridgeGroup, true).isOk = false;
	}

    if (audioEnabled)
    {
        audioBridge.play();
    }

    player.speed = PLAYER_SETTINGS.minSpeed;
    player.body.collidesWith = [];

    fall(false);
    return true;
}
