BlockManager.prototype.computeArcadeBody = function(object, w, h, x, y)
{
	object.arcadeBody =
	{
		offset: { x: x, y: y },
		width: w,
		height: h
	};
}

BlockManager.prototype.precomputeArcadeBody = function (object)
{
	var body = object.arcadeBody;

	var width = body.width;
	var height = body.height;

	if (object.anchor.x === 0)
	{
		body.left = object.x + body.offset.x - object.offsetX;
		body.right = body.left + width - object.offsetX;
	}
	else //if (object.anchor.x === 0.5)
	{
		body.left = object.x - width / 2;
		body.right = body.left + width;
	}

	if (object.anchor.y === 0)
	{
		body.top = object.y + body.offset.y - object.offsetY;
		body.bottom = body.top + height - object.offsetY;
	}
	else //if (object.anchor.y === 0.5)
	{
		body.top = object.y - height / 2;
		body.bottom = body.top + height;
	}

}

BlockManager.prototype.createDecoration = function(config, posX, posY)
{
    var decor = game.add.sprite(posX, posY, config.name);

    switch (config.name)
    {
        case skyJump.name:
            this.phaserInstance.physics.p2.enable(decor);
            decor.anchor.setTo(0, 1);
            decor.hasJumper = false;

            decor.onUpdate = function (block)
            {
                if (!block.hasJumper && block.x - player.x < 500)
                {
                    // lyziar
                    blockManager.getTreeFromPool(jumper, block.x + 90, jumper.y, false);
                    block.hasJumper = true;
                }
            }

            var body = decor.body;
            body.clearShapes();
            body.addPolygon({ skipSimpleCheck: true }, 30,-394, 380,-154, 460,-126, 550,-130, 650,-165, 650,-100, 30,-100);
            body.fixedRotation = true;
            body.kinematic = true;
            body.debug = DEBUG_PHYSICS;
            body.collideWorldBounds = false;
            body.setCollisionGroup(decorCollisionGroup);
            body.collides([decorCollisionGroup]);
            body.setMaterial(material2);
            break;

        case jumper.name:
            this.phaserInstance.physics.p2.enable(decor);
            decor.anchor.setTo(0, 1);
            decor.accelerated = false;
            decor.onUpdate = function (block)
            {
                if (block.body.static && block.x - player.x > 200)
                    return;

                block.body.static = false;

                if (block.y > 388)
                {
                    block.accelerated = true;
                    block.body.velocity.x = Math.min(block.body.velocity.x, jumper.maxSpeed);
                }
                else if (block.accelerated)
                {
                    block.body.velocity.x = jumper.maxSpeed;
                }
                else
                {
                    block.body.velocity.x = Math.min(block.body.velocity.x, jumper.maxSpeed);
                }
            }

            var body = decor.body;
            body.clearShapes();
            body.addPolygon({ skipSimpleCheck: true }, 0,-24, 32,0, 32,-24);
            body.fixedRotation = false;
            body.static = true;
            body.debug = DEBUG_PHYSICS;
            body.collideWorldBounds = false;
            body.setCollisionGroup(decorCollisionGroup);
            body.collides(decorCollisionGroup);
            body.setMaterial(material2);
            break;

        default:
            decor.anchor.setTo(0, 1);
            break;
    }

    return decor;
}

BlockManager.prototype.createBarrier = function (config, posX, posY)
{
    var barrier = this.createPlatform(config.name, posX, posY, barriersGroup, config.hasBody);
	barrier.anchor.setTo(0, 1);

	switch (config.name)
	{
		case "ice":
		    barrier.body.setRectangle(barrier.width, barrier.height, barrier.width / 2, -barrier.height / 2);
		    barrier.onCollision = function(block)
		    {
		        onIce = true;
		    }    
			break;

		case "igloo":
		    barrier.body.clearShapes();
		    barrier.body.addPolygon({ skipSimpleCheck: true }, 0,-30, 0,-60, 60,-120, 100,-120, 140,-30);
			this.computeArcadeBody(barrier, 100, 120, 40, -40);

			barrier.onCollision = function (object)
			{
			    var man = game.add.sprite(object.x + 1, object.y - 66, "igloo_man");
			    treesGroup.add(man);

			    man.animations.add('go_out_and_in').play(8, false, true)
			};
			break;

	    case "mostik":
	        this.phaserInstance.physics.p2.enable(barrier);
	        barrier.anchor.setTo(0, 0);

	        var body = barrier.body;
	        body.clearShapes();
	        body.addPolygon({ skipSimpleCheck: true }, 0,70, 0,75, 180,75, 185,0);
	        body.fixedRotation = true;
	        body.static = true;
	        body.debug = DEBUG_PHYSICS;
	        body.collideWorldBounds = false;
	        body.setCollisionGroup(platformCollisionGroup);
	        body.collides(playerCollisionGroup);
			break;

		case "sauna":
			barrier.body.setRectangle(95, 95, barrier.width / 2 - 9, -barrier.height / 2 + 12);
			this.computeArcadeBody(barrier, 95, 95, 2, 32);

			var emitter = game.add.emitter(94, -100, 3);
			emitter.makeParticles("cloud");
		    emitter.gravity = 0;
			emitter.setAlpha(0.75, 0, 1000);
			emitter.setScale(0.75, 2.5, 0.75, 2.5, 1000);
			emitter.setXSpeed(-20, 20);
			emitter.setYSpeed(-30, -60);
			emitter.setRotation(-45, 45);
			emitter.width = 5;
			barrier.emitter = emitter;
			barrier.addChild(emitter);

			barrier.onCollision = function (object)
			{
				var doors = object.nextItem;
				if (doors.key === "sauna_doors_close")
				{
					doors.visible = false;

					object.nextItem = game.add.sprite(object.x - 14, object.y - 66, "sauna_doors_open");
					barriersGroup.add(object.nextItem);
                    
                    if (audioEnabled)
                        audioSauna.play();
				}
			};
			break;

		case "los":
		    barrier.body.setRectangle(barrier.width, barrier.height, barrier.width / 2, -barrier.height / 2);
		    barrier.animations.add('noseLight').play(2, true);
		    break;

		case "stone":
		    barrier.body.clearShapes();
		    barrier.body.addPolygon({ skipSimpleCheck: true }, 3,-30, 35,-70, 120,-30);

			this.computeArcadeBody(barrier, 40, 60, 20, 2);
			break;

		case "snowman":
			barrier.body.setRectangle(barrier.width, barrier.height, barrier.width / 2, -barrier.height / 2 + 12);
			this.computeArcadeBody(barrier, 50, 50, 0, 12);
			break;

		case "snowman_head":
			barrier.body.setRectangle(barrier.width + 15, barrier.height + 10, barrier.width / 2, -barrier.height / 2);
			barrier.body.collides([platformCollisionGroup, barrierCollisionGroup]);

			barrier.onCollision = function (block)
			{
			    block.minY = block.y;

				var body = block.body;
				body.velocity.x = 60 + (1.5 * player.speed);
				body.velocity.y = -10;
				body.angularVelocity = 0.5;
				body.fixedRotation = false;
				body.static = false;

				block.onUpdate = function (block)
				{
				    if (block.y >= block.minY + 60)
				    {
				        var body = block.body;
				        body.static = true;
				        body.angularVelocity = 0;
				        body.velocity.x = 0;
				        body.velocity.y = 0;
				        body.fixedRotation = true;

				        block.onUpdate = null;
				    }
				}
			};
		    break;

	    case "yeti":
			barrier.body.setRectangle(barrier.width, barrier.height, barrier.width / 2, -barrier.height / 2);
			barrier.baseY = barrier.y;
			barrier.state = 0;
			barrier.onCollision = function (block)
			{
				if (audioEnabled)
					audioYeti.play();
			};

			barrier.onUpdate = function(block)
			{
				blockManager.computeArcadeBody(block, block.width, block.height, block.width / 2, -block.height / 2);

				if (player.alive && block.x - player.x < 180 && block.state === 0)
				{
					block.body.velocity.y = -yeti.speed;
					block.state = 1;
				}
				else if (block.y < block.baseY - config.heightIncrease && block.state === 1)
				{
					block.body.velocity.y = yeti.speed;
					block.state = 2;
				}
				else if (block.y > block.baseY && block.state === 2)
				{
					block.body.velocity.y = 0;
					block.state = 3;
                    
                    if (audioEnabled)
                        audioYeti.play();
				}
			};
			break;
	}

	return barrier;
}

BlockManager.prototype.createObject = function (name, posX, posY, group)
{
    var gameObject = this.phaserInstance.add.sprite(posX, posY, name);
    gameObject.autoCull = true;

    if (typeof group !== "undefined")
        group.add(gameObject);

    return gameObject;
}

BlockManager.prototype.createPlatform = function (name, posX, posY, group, physics)
{
    if (typeof physics === "undefined")
        physics = true;

    var gameObject = this.phaserInstance.add.sprite(posX, posY, name);
    gameObject.autoCull = true;
    gameObject.smoothed = false;

    if (physics)
    {
        this.phaserInstance.physics.p2.enable(gameObject);

        gameObject.anchor.setTo(0, 0);

        var body = gameObject.body;
        body.setRectangle(gameObject.width, gameObject.height, gameObject.width / 2, gameObject.height / 2);
        body.fixedRotation = true;
        body.static = true;
        body.debug = DEBUG_PHYSICS;
        body.collideWorldBounds = false;
        body.collides(playerCollisionGroup);
        body.setMaterial(material2);

        this.computeArcadeBody(gameObject, gameObject.width, gameObject.height, 0, 0);
    }

    if (typeof group !== "undefined")
        group.add(gameObject);

    return gameObject;
}

BlockManager.prototype.createPlatformWithLength = function (spriteConfig, posX, posY, length, group, physics)
{
    if (typeof physics === "undefined")
        physics = true;

    var gameObject = this.phaserInstance.add.tileSprite(posX, posY, length, spriteConfig.height, spriteConfig.name);
    gameObject.autoCull = true;
    gameObject.smoothed = false;

    if (physics)
    {
        this.phaserInstance.physics.p2.enable(gameObject);
        gameObject.anchor.setTo(0, 0);

        var body = gameObject.body;
        body.setRectangle(gameObject.width, gameObject.height, gameObject.width / 2, gameObject.height / 2);
        body.fixedRotation = true;
        body.static = true;
        body.debug = DEBUG_PHYSICS;
        body.collideWorldBounds = false;
        body.setCollisionGroup(platformCollisionGroup);
        body.collides(playerCollisionGroup);
        body.setMaterial(material2);

        this.computeArcadeBody(gameObject, gameObject.width, gameObject.height, 0, 0);
    }

    if (typeof group !== "undefined")
        group.add(gameObject);

    return gameObject;
}