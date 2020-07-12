var Effects = (function ()
{
	function Effects()
	{
		this.poolSize = 8;

		this.effectsList = [];
		this.effectsIndex = [];

		for (var i = 0; i < GrassTypes.length; ++i)
		{
			var sprite = GrassTypes[i].sprite;

			this.effectsList[sprite] = [];
			this.effectsIndex[sprite] = 0;

			for (var j = 0; j < this.poolSize; ++j)
				this.effectsList[sprite][j] = this.createEmitter(sprite);
		}

		for (var i = 0; i < Animals.length; ++i)
		{
			var animal = Animals[i];

			this.effectsList[animal.sprite] = [];
			this.effectsIndex[animal.sprite] = 0;

			this.effectsList[animal.shavedSprite] = [];
			this.effectsIndex[animal.shavedSprite] = 0;

			for (var j = 0; j < this.poolSize; ++j)
			{
				this.effectsList[animal.sprite][j] = this.createEmitter(animal.sprite);
				this.effectsList[animal.shavedSprite][j] = this.createEmitter(animal.shavedSprite);
			}
		}
	}

	Effects.prototype.createEmitter = function (key)
	{
		switch (key)
		{
			case "trava":
				var grassEmitter = game.add.emitter(0, 0, 6);
				grassEmitter.makeParticles("part_trava");
				grassEmitter.setScale(1, 0, 1, 0, 1000);
				grassEmitter.setAlpha(1, 0.5, 1000);
				grassEmitter.width = 128;
				grassEmitter.height = 64;
				grassEmitter.setYSpeed(-100, 100);
				grassEmitter.setYSpeed(-100, 100);
				return grassEmitter;

			case "bodliak":
				var thistleEmitter = game.add.emitter(0, 0, 6);
				thistleEmitter.makeParticles("part_bodliak");
				thistleEmitter.setScale(1, 0, 1, 0, 1000);
				thistleEmitter.setAlpha(1, 0.5, 1000);
				thistleEmitter.width = 128;
				thistleEmitter.height = 64;
				thistleEmitter.setYSpeed(-100, 100);
				thistleEmitter.setYSpeed(-100, 100);
				return thistleEmitter;

			case "masozrava":
				var carnivorousEmitter = game.add.emitter(0, 0, 6);
				carnivorousEmitter.makeParticles("part_masozravka");
				carnivorousEmitter.setScale(1, 0, 1, 0, 1000);
				carnivorousEmitter.setAlpha(1, 0.5, 1000);
				carnivorousEmitter.width = 128;
				carnivorousEmitter.height = 64;
				carnivorousEmitter.setYSpeed(-100, 100);
				carnivorousEmitter.setYSpeed(-100, 100);
				return carnivorousEmitter;

			case "podkan01":
			case "podkan02":
				var ratEmitter = game.add.emitter(0, 0, 6);
				ratEmitter.makeParticles("part_potkan");
				ratEmitter.setScale(1, 0, 1, 0, 1000);
				ratEmitter.setAlpha(1, 0.5, 1000);
				ratEmitter.width = 94;
				ratEmitter.height = 60;
				ratEmitter.setYSpeed(-100, 100);
				ratEmitter.setYSpeed(-100, 100);
				return ratEmitter;

			case "macka01":
			case "macka02":
				var catEmitter = game.add.emitter(0, 0, 6);
				catEmitter.makeParticles("part_macka");
				catEmitter.setScale(1, 0, 1, 0, 1000);
				catEmitter.setAlpha(1, 0.5, 1000);
				catEmitter.width = 94;
				catEmitter.height = 60;
				catEmitter.setYSpeed(-100, 100);
				catEmitter.setYSpeed(-100, 100);
				return catEmitter;
		}
	}

	Effects.prototype.getEmitter = function (sprite)
	{
		var key = sprite.key;
		var index = this.effectsIndex[key];

		var emitter = this.effectsList[key][index];

		this.effectsIndex[key] = (index + 1) % this.poolSize;

		switch (key)
		{
			case "trava":
			case "bodliak":
			case "masozrava":
				emitter.position.setTo(sprite.worldPosition.x, sprite.worldPosition.y + sprite.height / 2);
				break;

			case "podkan01":
			case "podkan02":
			case "macka01":
			case "macka02":
				emitter.position.setTo(sprite.worldPosition.x, sprite.worldPosition.y);
				break;
		}

		return emitter;
	}

	Effects.prototype.emitParticles = function(sprite)
	{
		if (sprite.worldPosition.x < 128)
			return;

		var emitter = this.getEmitter(sprite);
		emitter.start(true, 800, 20, 6, false);
	}

	return Effects;
})();