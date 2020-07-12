// Menu Manager
var MenuManager = (function()
{
	function MenuManager()
	{
		this._map = {};
	}

	// add menu to list
	// onEnable - callback called after menu is enabled
	// onDisable - callback called after menu is disabled
	MenuManager.prototype.addMenu = function (name, menu, onEnable, onDisable)
	{
		menu.visible = false;

		var item =
		{
			"menu": menu,
			"onEnable": onEnable,
			"onDisable": onDisable
		};

		this._map[name] = item;
	}

	// show menu, hide other
	MenuManager.prototype.showMenu = function (name, forceCallbacks)
	{
		if (typeof forceCallbacks === "undefined")
			forceCallbacks = false;

		for (var key in this._map)
		{
			var item = this._map[key];

			if (key === name)
			{
				if (!item.menu.visible)
				{
					item.menu.visible = true;

					if (typeof item.onEnable !== "undefined")
						item.onEnable();
				}
				else if (forceCallbacks)
				{
					if (typeof item.onEnable !== "undefined")
						item.onEnable();
				}
			}
			else
			{
				if (item.menu.visible)
				{
					item.menu.visible = false;

					if (typeof item.onDisable !== "undefined")
						item.onDisable();
				}
				else if (forceCallbacks)
				{
					if (typeof item.onDisable !== "undefined")
						item.onDisable();
				}
			}
		}
	}

	// show/hide menu
	MenuManager.prototype.setVisibility = function (name, value)
	{
		var menu = this._map[name];

		if (menu.menu.visible === value)
			return;
		
		menu.menu.visible = value;

		if (value)
			menu.onEnable();
		else
			menu.onDisable();
	}
	
	return MenuManager;
})();


var Implementation =
{
	Basic: 0, // cisto HTML5 (web)
	Gamee: 1,  // Gamee (+ Gamee web)
	GameeV2: 2  // Gamee API 2.0 (+ Gamee web)
};


// Alda Engine
var AldaEngine = (function()
{
	function AldaEngine(gameInstance, implementationMethod, gameName)
	{
		// inner variables
		var instance = this;
		this.noop = function () { };
		this.phaserInstance = gameInstance;
		this.implementationMethod = (typeof implementationMethod !== "undefined") ? implementationMethod : Implementation.Basic;
		this.localStorageName = (typeof gameName !== "undefined") ? gameName : "game";
		this.localStorageAvailable = AldaEngine.checkForLocalStorageAvailable();

		// menu manager
		this.menuManager = new MenuManager();
	
		// games count
		this.gamesCount = 0;

		// max score
		this.maxScore = 0;
		if (this.implementationMethod === Implementation.Basic)
		{
			if (this.localStorageAvailable)
			{
				var max_s = localStorage.getItem(this.localStorageName + "_max_score");

				if (max_s !== null)
					this.maxScore = max_s;
			}
		}

		// score
		this._score;
		Object.defineProperty(this, "score",
		{
			get: function()
			{
				var score = (this.implementationMethod === Implementation.Gamee) ? gamee.score : this._score;
				if (typeof score === "undefined")
					score = 0;
				return score;
			},

			set: function (value)
			{
				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						this._score = value;
						
						if (this.maxScore < value) // maxScore logic
						{
							this.maxScore = value;

							if (this.localStorageAvailable)
							{
								localStorage.setItem(this.localStorageName + "_max_score", value);
							}
						}
						break;
					case Implementation.Gamee:
						gamee.score = value;
						break;
					case Implementation.GameeV2:
						this._score = value;
						gamee.updateScore(value);
						break;
				}
			}
		});
		
		// score
		this._ghostScore;
		Object.defineProperty(this, "ghostScore",
		{
			get: function()
			{
				if (typeof this._score === "undefined")
					this._score = 0;
				return this._score;
			}
		});

		// onPause event
		this._onPause = this.noop;
		Object.defineProperty(this, "onPause",
		{
			set: function(value) {
				this._onPause = value;

				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						break;
					case Implementation.Gamee:
						gamee.onPause = value;
						break;
					case Implementation.GameeV2:
						gamee.emitter.addEventListener("pause", function(event) {
							value(event);
							event.detail.callback();
						}); 
						break;
				}
			}
		});

		// onStop event
		this._onStop = this.noop;
		Object.defineProperty(this, "onStop",
		{
			set: function(value) {
				this._onStop = value;

				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						break;
					case Implementation.Gamee:
						gamee.onStop = value;
						break;
					case Implementation.GameeV2:
						console.error("Wrong call");
						break;
				}
			}
		});

		// onStart event
		this._onStart = this.noop;
		Object.defineProperty(this, "onStart",
		{
			set: function (value)
			{
				this._onStart = value;

				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						break;
					case Implementation.Gamee:
						gamee.onRestart = value;
						break;
					case Implementation.GameeV2:
						gamee.emitter.addEventListener("start", function (event)
						{
							value(event);
							event.detail.callback();
						});
						break;
				}
			}
		});

		// onRestart event
		this._onRestart = this.noop;
		Object.defineProperty(this, "onRestart",
		{
			set: function(value) {
				this._onRestart = value;

				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						break;
					case Implementation.Gamee:
						gamee.onRestart = value;
						break;
					case Implementation.GameeV2:
						console.error("Wrong call");
						break;
				}
			}
		});

		// onMute event
		this._onMute = this.noop;
		Object.defineProperty(this, "onMute",
		{
			set: function(value) {
				this._onMute = value;

				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						break;
					case Implementation.Gamee:
						gamee.onMute = value;
						break;
					case Implementation.GameeV2:
						gamee.emitter.addEventListener("mute", function (event)
						{
							value(event);
							event.detail.callback();
						});
						break;
				}
			}
		});

		// onUnmute event
		this._onUnmute = this.noop;
		Object.defineProperty(this, "onUnmute",
		{
			set: function(value) {
				this._onUnmute = value;

				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						break;
					case Implementation.Gamee:
						gamee.onUnmute = value;
						break;
					case Implementation.GameeV2:
						gamee.emitter.addEventListener("unmute", function (event)
						{
							value(event);
							event.detail.callback();
						});
						break;
				}
			}
		});

		// onResume event
		this._onResume = this.noop;
		Object.defineProperty(this, "onResume",
		{
			set: function(value) {
				this._onResume = value;

				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						break;
					case Implementation.Gamee:
						gamee.onResume = value;
						break;
					case Implementation.GameeV2:
						gamee.emitter.addEventListener("resume", function (event)
						{
							value(event);
							event.detail.callback();
						});
						break;
				}
			}
		});
	
		// onUnpause event
		this._onUnpause = this.noop;
		Object.defineProperty(this, "onUnpause",
		{
			set: function (value)
			{
				this._onUnpause = value;

				switch (this.implementationMethod)
				{
					case Implementation.Basic:
						break;
					case Implementation.Gamee:
						gamee.onUnpause = value;
						break;
					case Implementation.GameeV2:
						console.error("Wrong call");
						break;
				}
			}
		});

		// audio state on iOS or newest Chrome
		this.audioUnlocked = false;

		// unlock audio on iOS or newest Chrome
		this.unlockAudio = function ()
		{
			if (instance.audioUnlocked)
				return;

			// create empty buffer and play it		
			var audioCtx = instance.phaserInstance.sound.context;
			
			if (audioCtx === null)
				return;

			var source = audioCtx.createBufferSource();
			source.buffer = audioCtx.createBuffer(1, 1, 22050);
			source.connect(audioCtx.destination);

			var newVersion = typeof source.playbackState === "undefined";

			if (newVersion)
			{
				source.onended = function()
				{
					instance.audioUnlocked = true;
					console.log("audio unlocked");
				};
			}
			
			if (source.start === undefined)
			{
                source.noteOn(0);
            }
			else
			{
                source.start(0);
            }

            // Hello Chrome 55!
			if (source.context.state === 'suspended')
				source.context.resume();
				
			if (!newVersion)
			{
				setTimeout(function()
				{
					if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE))
					{
						instance.audioUnlocked = true;
						console.log("audio unlocked");
					}
				}, 0);
			}
				
		}

		// pause
		this.pause = function ()
		{
			instance._onPause();
		}
		
		// unpause
		this.unpause = function ()
		{
			instance._onUnpause();
		}

		// resume
		this.resume = function ()
		{
			instance._onResume();
		}

		// restart
		this.restart = function ()
		{
			instance._onRestart();
		}

		// mute
		this.mute = function ()
		{
			instance._onMute();
		}

		// unmute
		this.unmute = function ()
		{
			instance._onUnmute();
		}
	}

	return AldaEngine;
})();

// check if we have access to storage
AldaEngine.checkForLocalStorageAvailable = function ()
{
	try
	{
		localStorage.setItem('feature_test', 'yes');
		if (localStorage.getItem('feature_test') === 'yes')
		{
			localStorage.removeItem('feature_test');
			return true;
		}
	} catch (err) { }

	return false;
}

// get window size
Object.defineProperty(AldaEngine, "windowSize",
{
	get: function ()
	{
		return {
			"width": window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			"height": window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
		};
	}
});

// add event handler to target element
AldaEngine.addEvent = function(event, target, callback)
{
   if (target.addEventListener)
      target.addEventListener(event, callback, false);
   else if (target.attachEvent)
      target.attachEvent("on" + event, callback);
}

// shuffles array in-place
AldaEngine.shuffleArray = function (array)
{
	for (var i = array.length - 1; i > 0; i--)
	{
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
};

// get random index from array
AldaEngine.getRandomIndex = function(array)
{
	return Math.floor(Math.random() * array.length);
}

// get random item from array
AldaEngine.getRandomItem = function(array)
{
	return array[AldaEngine.getRandomIndex(array)];
}

// remove item from array
AldaEngine.removeFromArray = function (array, item)
{
	var index = array.indexOf(item);

	if (index > -1)
	{
		AldaEngine.splice(array, index);
		return true;
	}

	return false;
}

// fast remove one item from array
AldaEngine.splice = function(array, index)
{
	var length = array.length;

	if (length)
	{
		while (index < length)
		{
			array[index++] = array[index];
		}
		array.length--;
	}
}

// updateScore
AldaEngine.prototype.updateScore = function (score, ghostSign, callback)
{
	switch (this.implementationMethod)
	{
		case Implementation.Basic:
		case Implementation.Gamee:
			this.score = score;
			break;

		case Implementation.GameeV2:
			if (typeof ghostSign !== "undefined")
			{
				this._ghostScore = score;
				gamee.updateScore(score, ghostSign, callback);
			}
			else
			{
				this._score = score;
				gamee.updateScore(score);
			}
			break;
	}
}

// gameStart
AldaEngine.prototype.gameStart = function ()
{
	this.gamesCount++;

	switch (this.implementationMethod)
	{
		case Implementation.Basic:
		case Implementation.GameeV2:
			break;

		case Implementation.Gamee:
			gamee.gameStart();
			break;
	}
}

// gameLoaded
AldaEngine.prototype.gameReady = function ()
{
	switch (this.implementationMethod)
	{
		case Implementation.Basic:
			break;
		case Implementation.Gamee:
			gamee.gameLoaded();
			break;
		case Implementation.GameeV2:
			gamee.gameReady();
			break;
	}
}

// gameOver
AldaEngine.prototype.gameOver = function (storeData, errorCallback)
{
	switch (this.implementationMethod)
	{
		case Implementation.Basic:
			break;

		case Implementation.Gamee:
			gamee.gameOver();
			break;

		case Implementation.GameeV2:
			if (storeData || errorCallback)
			{
				gamee.gameOver(storeData, errorCallback);
			}
			else
			{
				gamee.gameOver();
			}
			break;
	}
}

// show popup window
AldaEngine.prototype.showPopUpWindow = function (image, x, y, clickCallback, menu)
{
	var content = this.phaserInstance.add.tileSprite(x, y, 336, 280, image);
	content.anchor.setTo(0.5, 0.5);

	if (typeof clickCallback !== "undefined")
	{
		content.inputEnabled = true;
		content.input.priorityID = 1;
		content.input.useHandCursor = true;
		content.events.onInputDown.add(clickCallback, this);
	}

	content.animations.add("gif").play(1, true);

	var xButton = this.phaserInstance.add.sprite(content.width / 2, -content.height / 2, "cross");
	xButton.anchor.setTo(1, 0);

	xButton.inputEnabled = true;
	xButton.input.priorityID = 2;
	xButton.input.useHandCursor = true;
	xButton.events.onInputDown.add(function () {
		content.destroy();
	}, this);

	content.addChild(xButton);

	content.scale.setTo(0, 0);
	this.phaserInstance.add.tween(content.scale).to({ x: 1, y: 1 }, 150, Phaser.Easing.Linear.None, true);

	if (typeof menu !== "undefined")
		menu.add(content);

	return content;
}

// one key input
AldaEngine.prototype.setOneKeyInputMethod = function (inputCallback, key, tap)
{
	console.warn("Using obsolete method");

	switch (this.implementationMethod)
	{
		case Implementation.Basic:
			if (typeof key !== "undefined")
			{
				var _key = this.phaserInstance.input.keyboard.addKey(key);
				_key.onDown.add(inputCallback, this);
			}
			if (typeof tap !== "undefined" && tap)
				this.phaserInstance.input.onTap.add(inputCallback);
			break;

		case Implementation.Gamee:
			if (typeof key === "undefined")
				key = false;

			var controller = gamee.controller.requestController("OneButton", { enableKeyboard: key });
			controller.buttons.button.on("keydown", inputCallback);
		
			if (typeof tap !== "undefined" && tap)
				this.phaserInstance.input.onTap.add(inputCallback);
			break;
	}
}
