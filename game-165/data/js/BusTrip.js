var Gamee;
(function (Gamee_1) {
    var Gamee = (function () {
        function Gamee(game) {
            this._ready = false;
            this._gameRunning = false;
            this._score = 0;
            if (window.gamee !== undefined) {
                window.gamee.controller.requestController('OneButton');
                window.gamee.gameLoaded();
                this.eventHandlers();
                this._ready = true;
            }
            this._game = game;
            Gamee._instance = this;
        }
        Object.defineProperty(Gamee, "instance", {
            get: function () {
                if (Gamee._instance == undefined) {
                    console.error("Instance of Gamee was not created yet!");
                }
                return Gamee._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "ready", {
            get: function () { return this._ready; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "gameRunning", {
            get: function () {
                return this._gameRunning;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "score", {
            get: function () {
                return this._score;
            },
            set: function (score) {
                this._score = score;
                if (this.ready) {
                    window.gamee.score = score;
                }
            },
            enumerable: true,
            configurable: true
        });
        Gamee.prototype.eventHandlers = function () {
            var self = this;
            window.gamee.onPause = function () {
                console.log("PAUSE CALLBACK");
                self.onPause();
            };
            window.gamee.onUnpause = function () {
                console.log("UNPAUSE CALLBACK");
                self.onUnpause();
            };
            window.gamee.onRestart = function () {
                console.log("RESTART");
                self.onRestart();
            };
            window.gamee.onMute = function () {
                console.log("MUTE");
                self._game["onMute"]();
            };
            window.gamee.onUnmute = function () {
                console.log("UNMUTE");
                self._game["onUnmute"]();
            };
        };
        Gamee.prototype.onPause = function () {
            var state = this._game.state.getCurrentState();
            if (typeof state.onGameePause == "function") {
                state.onGameePause();
            }
            else {
                console.warn("No method onGameePause in state " + this._game.state.current);
            }
        };
        Gamee.prototype.onUnpause = function () {
            var state = this._game.state.getCurrentState();
            if (typeof state.onGameeUnpause == "function") {
                state.onGameeUnpause();
            }
            else {
                console.warn("No method onGameeUnpause in state " + this._game.state.current);
            }
        };
        Gamee.prototype.onRestart = function () {
            var state = this._game.state.getCurrentState();
            if (typeof state.onGameeRestart === "function") {
                state.onGameeRestart();
            }
            else {
                console.warn("No method onRestart in state " + this._game.state.current);
            }
        };
        Gamee.prototype.gameStart = function () {
            this._gameRunning = true;
            this._score = 0;
            if (this.ready) {
                window.gamee.gameStart();
            }
        };
        Gamee.prototype.gameOver = function () {
            this._gameRunning = false;
            if (this.ready) {
                window.gamee.gameOver();
            }
        };
        return Gamee;
    }());
    Gamee_1.Gamee = Gamee;
})(Gamee || (Gamee = {}));
var BusTrip;
(function (BusTrip) {
    var Global = (function () {
        function Global() {
        }
        Global.GAME_MAX_WIDTH = 640;
        Global.GAME_MAX_HEIGHT = 1138;
        Global.GAME_MIN_WIDTH = 640;
        Global.GAME_MIN_HEIGHT = 900;
        Global.FPS = 60;
        Global.GAMEE = true;
        Global.DEBUG = false;
        Global.elapsedTime = 0;
        Global.deltaRatio = 1;
        Global.ATLAS_KEY_0 = "atlas0";
        return Global;
    }());
    BusTrip.Global = Global;
    window.onload = function () {
        Global.game = new BusTrip.Game();
        if (Global.GAMEE) {
            new Gamee.Gamee(Global.game);
        }
    };
})(BusTrip || (BusTrip = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BusTrip;
(function (BusTrip) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, {
                width: 128,
                height: 128,
                renderer: Phaser.AUTO,
                parent: "content",
                transparent: false,
                antialias: true,
                physicsConfig: null,
                forceSetTimeOut: false,
                preserveDrawingBuffer: true
            });
            this.state.add("Boot", BusTrip.Boot);
            this.state.add("Preload", BusTrip.Preload);
            this.state.add("Play", BusTrip.Play);
            this.state.start("Boot");
        }
        Game.prototype.onMute = function () {
            Utils.AudioUtils.sfxOn = false;
            Utils.AudioUtils.musicOn = false;
        };
        Game.prototype.onUnmute = function () {
            Utils.AudioUtils.sfxOn = true;
            Utils.AudioUtils.musicOn = true;
        };
        return Game;
    }(Phaser.Game));
    BusTrip.Game = Game;
})(BusTrip || (BusTrip = {}));
var BusTrip;
(function (BusTrip) {
    var Sounds = (function () {
        function Sounds() {
        }
        Sounds.AUDIO_JSON = {
            "resources": [
                "sfx.ogg",
                "sfx.mp3"
            ],
            "spritemap": {
                "flipDir": {
                    "start": 0,
                    "end": 0.6243764172335601,
                    "loop": false
                },
                "groundHit": {
                    "start": 2,
                    "end": 2.501655328798186,
                    "loop": false
                },
                "pickup1": {
                    "start": 4,
                    "end": 4.561224489795919,
                    "loop": false
                },
                "pickup2": {
                    "start": 6,
                    "end": 6.530204081632653,
                    "loop": false
                }
            }
        };
        return Sounds;
    }());
    BusTrip.Sounds = Sounds;
})(BusTrip || (BusTrip = {}));
var Utils;
(function (Utils) {
    var AudioUtils = (function () {
        function AudioUtils() {
        }
        Object.defineProperty(AudioUtils, "sfxOn", {
            get: function () { return AudioUtils._sfxOn; },
            set: function (on) {
                AudioUtils._sfxOn = on;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AudioUtils, "musicOn", {
            get: function () { return AudioUtils._musicOn; },
            set: function (on) {
                if (on) {
                    AudioUtils.resumeMusic();
                }
                else {
                    AudioUtils.pauseMusic();
                }
            },
            enumerable: true,
            configurable: true
        });
        AudioUtils.setSfxAudioSprite = function (sprite) {
            AudioUtils._sfxAudioSprite = sprite;
        };
        AudioUtils.addSfxSound = function (key, sound) {
            AudioUtils._sfxSounds[key] = sound;
        };
        AudioUtils.playSound = function (key, volume) {
            if (volume === void 0) { volume = 1.0; }
            if (!AudioUtils._sfxOn)
                return;
            if (AudioUtils._sfxAudioSprite != null) {
                AudioUtils._sfxAudioSprite.play(key, volume);
            }
            else {
                var sound = AudioUtils._sfxSounds[key];
                if (sound != undefined)
                    sound.play("", 0, volume);
            }
        };
        AudioUtils.stopSound = function (key) {
            if (AudioUtils._sfxAudioSprite != null) {
                AudioUtils._sfxAudioSprite.stop(key);
            }
            else {
                var sound = AudioUtils._sfxSounds[key];
                if (sound != undefined)
                    sound.stop();
            }
        };
        Object.defineProperty(AudioUtils, "currentMusic", {
            get: function () {
                return AudioUtils._currentMusic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AudioUtils, "isMusicPlaying", {
            get: function () {
                if (AudioUtils._currentMusic == null || AudioUtils._currentMusic.length == 0) {
                    return false;
                }
                var music = AudioUtils._music[AudioUtils._currentMusic];
                if (music == undefined)
                    return false;
                return music.isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        AudioUtils.addMusic = function (key, music) {
            AudioUtils._music[key] = music;
        };
        AudioUtils.playMusic = function (key, loop) {
            if (loop === void 0) { loop = true; }
            if (!AudioUtils._musicOn || AudioUtils._currentMusic == key)
                return;
            if (AudioUtils.isMusicPlaying)
                AudioUtils.stopMusic();
            if (!(key in AudioUtils._music))
                return;
            AudioUtils._currentMusic = key;
            var music = AudioUtils._music[key];
            music.loop = loop;
            music.play();
            if (!loop) {
                music.onStop.addOnce(function () {
                    AudioUtils.onMusicFinished.dispatch(key);
                }, this);
            }
        };
        AudioUtils.stopMusic = function () {
            if (AudioUtils.isMusicPlaying) {
                AudioUtils._music[AudioUtils._currentMusic].stop();
                AudioUtils._currentMusic = null;
            }
        };
        AudioUtils.pauseMusic = function () {
            if (AudioUtils.isMusicPlaying) {
                AudioUtils._music[AudioUtils._currentMusic].pause();
            }
        };
        AudioUtils.resumeMusic = function () {
            if (AudioUtils._currentMusic != null && AudioUtils._currentMusic.length > 0) {
                var music = AudioUtils._music[AudioUtils._currentMusic];
                if (music.paused) {
                    music.resume();
                }
            }
        };
        AudioUtils._sfxOn = true;
        AudioUtils._musicOn = true;
        AudioUtils._sfxAudioSprite = null;
        AudioUtils._sfxSounds = [];
        AudioUtils._music = [];
        AudioUtils._currentMusic = null;
        AudioUtils.onMusicFinished = new Phaser.Signal();
        return AudioUtils;
    }());
    Utils.AudioUtils = AudioUtils;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Pool = (function () {
        function Pool(itemType, defSize, canGrow, itemCreateFnc) {
            if (defSize === void 0) { defSize = 0; }
            if (canGrow === void 0) { canGrow = true; }
            if (itemCreateFnc === void 0) { itemCreateFnc = null; }
            this._itemType = itemType;
            this._itemCreateFnc = itemCreateFnc;
            this._canGrow = canGrow;
            this._pool = [];
            while (defSize-- != 0) {
                this._pool.push(this.newItem());
            }
            this._count = this._pool.length;
        }
        Object.defineProperty(Pool.prototype, "canGrow", {
            get: function () {
                return this._canGrow;
            },
            enumerable: true,
            configurable: true
        });
        Pool.prototype.getItem = function () {
            if (this._count == 0) {
                return (this._canGrow ? this.newItem() : null);
            }
            else {
                var item = this._pool[--this._count];
                this._pool[this._count] = null;
                return item;
            }
        };
        Pool.prototype.returnItem = function (item) {
            this._pool[this._count++] = item;
        };
        Pool.prototype.newItem = function () {
            if (this._itemCreateFnc != null) {
                return this._itemCreateFnc();
            }
            else {
                return new this._itemType();
            }
        };
        return Pool;
    }());
    Utils.Pool = Pool;
})(Utils || (Utils = {}));
var BusTrip;
(function (BusTrip) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
            this._gameMinDims = new Phaser.Point(BusTrip.Global.GAME_MIN_WIDTH, BusTrip.Global.GAME_MIN_HEIGHT);
            this._gameMaxDims = new Phaser.Point(BusTrip.Global.GAME_MAX_WIDTH, BusTrip.Global.GAME_MAX_HEIGHT);
            this._gameDims = new Phaser.Point();
            this._userScale = new Phaser.Point(0, 0);
        }
        Boot.prototype.init = function () {
            this.input.maxPointers = 1;
            this.game.renderer.renderSession.roundPixels = false;
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setResizeCallback(this.gameResized, this);
            this.gameResized(this.scale, null);
        };
        Boot.prototype.create = function () {
            this.game.state.start("Preload");
        };
        Boot.prototype.calcGameDims = function () {
            var scale = this.scale;
            var i;
            var minAspectRatio = this._gameMinDims.x / this._gameMinDims.y;
            var maxAspectRatio = this._gameMaxDims.x / this._gameMaxDims.y;
            if (minAspectRatio > maxAspectRatio) {
                i = minAspectRatio;
                minAspectRatio = maxAspectRatio;
                maxAspectRatio = i;
            }
            var extResW = window.innerWidth;
            var extResH = window.innerHeight;
            i = extResW / extResH;
            if (i < minAspectRatio) {
                extResH = Math.floor(extResW / minAspectRatio);
            }
            else if (i > maxAspectRatio) {
                extResW = Math.floor(extResH * maxAspectRatio);
            }
            var intResW = extResW;
            var intResH = extResH;
            if (intResW < this._gameMinDims.x) {
                intResH = Math.round(intResH * (this._gameMinDims.x / intResW));
                intResW = this._gameMinDims.x;
            }
            else if (intResW > this._gameMaxDims.x) {
                intResH = Math.round(intResH * (this._gameMaxDims.x / intResW));
                intResW = this._gameMaxDims.x;
            }
            if (intResH < this._gameMinDims.y) {
                intResW = Math.round(intResW * (this._gameMinDims.y / intResH));
                intResH = this._gameMinDims.y;
            }
            else if (intResH > this._gameMaxDims.y) {
                intResW = Math.round(intResW * (this._gameMaxDims.y / intResH));
                intResH = this._gameMaxDims.y;
            }
            this._gameDims.set(intResW, intResH);
            this._userScale.set(extResW / intResW, extResH / intResH);
        };
        Boot.prototype.gameResized = function (scaleManager, bounds) {
            if (!scaleManager.incorrectOrientation) {
                var oldScaleX = this._userScale.x;
                var oldScaleY = this._userScale.y;
                this.calcGameDims();
                var dims = this._gameDims;
                var scale = this._userScale;
                var newDims = (dims.x != this.game.width || dims.y != this.game.height);
                if (newDims || Math.abs(scale.x - oldScaleX) > 0.001 || Math.abs(scale.y - oldScaleY) > 0.001) {
                    if (newDims)
                        this.scale.setGameSize(dims.x, dims.y);
                    this.scale.setUserScale(scale.x, scale.y);
                    if (newDims) {
                        var currentState = this.game.state.getCurrentState();
                        if (typeof currentState.onResize == "function") {
                            currentState.onResize(dims.x, dims.y);
                        }
                    }
                }
            }
        };
        return Boot;
    }(Phaser.State));
    BusTrip.Boot = Boot;
})(BusTrip || (BusTrip = {}));
var BusTrip;
(function (BusTrip) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            _super.apply(this, arguments);
            this._background = null;
            this._startGameeGame = false;
        }
        Object.defineProperty(Play.prototype, "debugText", {
            get: function () {
                return this._debugText;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "debugLayer", {
            get: function () {
                return this._debugLayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play, "instance", {
            get: function () {
                return Play._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "popupScore", {
            get: function () {
                return this._popupScore;
            },
            enumerable: true,
            configurable: true
        });
        Play.prototype.create = function () {
            var game = this.game;
            Play._instance = this;
            if (BusTrip.Global.GAMEE && Gamee.Gamee.instance.ready)
                this._startGameeGame = true;
            if (BusTrip.Global.DEBUG != false) {
                this._debugText = this.game.add.text(10, 10, "", { font: "Courier", fontSize: 14, fill: "#FFFFFF" });
                this._debugText.lineSpacing = 2;
                this._debugText.fixedToCamera = true;
            }
            this._background = game.add.image(0, 0, BusTrip.Global.ATLAS_KEY_0, "background");
            this._player = new BusTrip.Player();
            this._collectibles = new BusTrip.CollectiblesManager();
            this._popupScore = new BusTrip.PopupScore();
            this._debugLayer = this.game.add.graphics(0, 0);
            if (this._debugText != undefined)
                this._debugText.bringToTop();
            this.input.onDown.add(this.flipPlayerDir, this);
            this.reset();
            this.onResize(this.game.width, this.game.height);
        };
        Play.prototype.flipPlayerDir = function () {
            if (this._startGameeGame) {
                this._startGameeGame = false;
                this.game.paused = false;
                Gamee.Gamee.instance.gameStart();
                return;
            }
            this._player.flipMoveDir();
        };
        Play.prototype.update = function () {
            BusTrip.Global.elapsedTime = this.time.elapsedSince(this._timeBase);
            BusTrip.Global.deltaRatio = this.time.physicsElapsed / (1 / this.time.desiredFps);
            this._debugLayer.clear();
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                if (!this._keyDown) {
                    this._keyDown = true;
                    this.flipPlayerDir();
                }
            }
            else {
                this._keyDown = false;
            }
            if (!this._startGameeGame) {
                this._player.update();
                this._collectibles.update();
            }
        };
        Play.prototype.resumed = function () {
            this._timeBase += this.time.pauseDuration;
        };
        Play.prototype.reset = function () {
            this.game.tweens.removeAll();
            this.game.time.removeAll();
            this.game.paused = false;
            this._timeBase = this.time.elapsedSince(0);
            BusTrip.Global.elapsedTime = 0;
            this._player.reset();
            this._collectibles.reset();
            this._popupScore.reset();
        };
        Play.prototype.gameOver = function () {
            if (BusTrip.Global.GAMEE == false || Gamee.Gamee.instance.ready == false) {
                this.reset();
            }
            else {
                Gamee.Gamee.instance.gameOver();
                this.game.paused = true;
            }
        };
        Play.prototype.onResize = function (newGameW, newGameH) {
            var camera = this.camera;
            this.world.setBounds(0, 0, BusTrip.Global.GAME_MAX_WIDTH, BusTrip.Global.GAME_MAX_HEIGHT);
            camera.setPosition(0, BusTrip.Global.GAME_MAX_HEIGHT - newGameH);
        };
        Play.prototype.onGameeRestart = function () {
            this.reset();
            Gamee.Gamee.instance.gameStart();
        };
        Play.prototype.onGameePause = function () {
            this.game.paused = true;
        };
        Play.prototype.onGameeUnpause = function () {
            this.game.paused = false;
        };
        Play.GROUND_Y = 1000;
        return Play;
    }(Phaser.State));
    BusTrip.Play = Play;
})(BusTrip || (BusTrip = {}));
var BusTrip;
(function (BusTrip) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            _super.apply(this, arguments);
            this._ready = false;
        }
        Preload.prototype.preload = function () {
            this.load.baseURL = "assets/";
            this.load.atlasJSONArray(BusTrip.Global.ATLAS_KEY_0);
            if (this.game.device.ie || Phaser.Device.isAndroidStockBrowser()) {
                for (var property in BusTrip.Sounds.AUDIO_JSON.spritemap) {
                    this.load.audio(property, property + ".mp3");
                }
            }
            else {
                var soundshift = 0;
                if (this.game.device.iOS)
                    soundshift = 0.1;
                var sfxId = 0;
                for (var property in BusTrip.Sounds.AUDIO_JSON.spritemap) {
                    var audioSprite = BusTrip.Sounds.AUDIO_JSON.spritemap[property];
                    if (sfxId++ != 0)
                        audioSprite.start -= soundshift;
                }
                this.load.audiosprite("sfx", BusTrip.Sounds.AUDIO_JSON.resources, null, BusTrip.Sounds.AUDIO_JSON);
            }
        };
        Preload.prototype.create = function () {
            if (this.game.device.ie || Phaser.Device.isAndroidStockBrowser()) {
                for (var property in BusTrip.Sounds.AUDIO_JSON.spritemap) {
                    var snd = this.add.audio(property);
                    snd.allowMultiple = true;
                    Utils.AudioUtils.addSfxSound(property, snd);
                }
            }
            else {
                var audioSprite = this.add.audioSprite("sfx");
                for (var property in BusTrip.Sounds.AUDIO_JSON.spritemap) {
                    audioSprite.sounds[property].allowMultiple = true;
                }
                Utils.AudioUtils.setSfxAudioSprite(audioSprite);
            }
        };
        Preload.prototype.update = function () {
            if (this._ready == false) {
                if (this.game.device.ie || Phaser.Device.isAndroidStockBrowser()) {
                    for (var property in BusTrip.Sounds.AUDIO_JSON.spritemap) {
                        if (!this.cache.isSoundDecoded(property))
                            return;
                    }
                }
                else {
                    if (!this.cache.isSoundDecoded("sfx"))
                        return;
                }
                this._ready = true;
                this.startGame();
            }
        };
        Preload.prototype.startGame = function () {
            this.game.state.start("Play");
        };
        return Preload;
    }(Phaser.State));
    BusTrip.Preload = Preload;
})(BusTrip || (BusTrip = {}));
var Utils;
(function (Utils) {
    (function (eRandomPickerMode) {
        eRandomPickerMode[eRandomPickerMode["incProbOfNonSelItems"] = 0] = "incProbOfNonSelItems";
        eRandomPickerMode[eRandomPickerMode["higherIdHasHigherPriority"] = 1] = "higherIdHasHigherPriority";
        eRandomPickerMode[eRandomPickerMode["higherIdHasLowerPriority"] = 2] = "higherIdHasLowerPriority";
        eRandomPickerMode[eRandomPickerMode["customPriorities"] = 3] = "customPriorities";
    })(Utils.eRandomPickerMode || (Utils.eRandomPickerMode = {}));
    var eRandomPickerMode = Utils.eRandomPickerMode;
    var RandomPicker = (function () {
        function RandomPicker(rnd, itemCnt, mode, parameter) {
            this._rnd = rnd;
            this._itemCnt = itemCnt;
            this._mode = mode;
            switch (mode) {
                case eRandomPickerMode.incProbOfNonSelItems: {
                    this._itemsProb = [];
                    this._selItemProb = parameter;
                    break;
                }
                case eRandomPickerMode.higherIdHasHigherPriority:
                case eRandomPickerMode.higherIdHasLowerPriority: {
                    var prob = (mode == eRandomPickerMode.higherIdHasHigherPriority ? 1 : itemCnt);
                    var totalProb = 0;
                    this._itemsProb = [];
                    for (var i = 0; i < itemCnt; i++) {
                        this._itemsProb[i] = prob;
                        totalProb += prob;
                        if (mode == eRandomPickerMode.higherIdHasHigherPriority) {
                            prob++;
                        }
                        else {
                            prob--;
                        }
                    }
                    this._itemsTotalProb = totalProb;
                    break;
                }
                case eRandomPickerMode.customPriorities: {
                    this._itemsProb = parameter;
                    var i = itemCnt;
                    var totalProb = 0;
                    while (i-- != 0)
                        totalProb += this._itemsProb[i];
                    this._itemsTotalProb = totalProb;
                    break;
                }
            }
            this.reset();
        }
        RandomPicker.prototype.reset = function () {
            if (this._mode == eRandomPickerMode.incProbOfNonSelItems) {
                var prob = (this._selItemProb == 0 ? 1 : this._selItemProb);
                for (var i = 0; i < this._itemCnt; i++)
                    this._itemsProb[i] = prob;
                this._itemsTotalProb = prob * this._itemCnt;
            }
        };
        RandomPicker.prototype.selectItem = function () {
            var i = this._rnd.integerInRange(0, this._itemsTotalProb - 1);
            var itemsProb = this._itemsProb;
            var itemId = this._itemCnt;
            while (itemId-- != 0) {
                if (itemsProb[itemId] > i)
                    break;
                i -= itemsProb[itemId];
            }
            if (this._mode == eRandomPickerMode.incProbOfNonSelItems) {
                this._itemsTotalProb -= (itemsProb[itemId] - this._selItemProb);
                itemsProb[itemId] = this._selItemProb;
                i = this._itemCnt;
                while (i-- != 0) {
                    if (i != itemId)
                        itemsProb[i]++;
                }
                this._itemsTotalProb += (this._itemCnt - 1);
            }
            return itemId;
        };
        return RandomPicker;
    }());
    Utils.RandomPicker = RandomPicker;
})(Utils || (Utils = {}));
var BusTrip;
(function (BusTrip) {
    var CollectibleSprite = (function (_super) {
        __extends(CollectibleSprite, _super);
        function CollectibleSprite(collectible, frameName) {
            _super.call(this, BusTrip.Global.game, 0, 0, BusTrip.Global.ATLAS_KEY_0, frameName);
            this._collectible = collectible;
        }
        Object.defineProperty(CollectibleSprite.prototype, "collectible", {
            get: function () {
                return this._collectible;
            },
            enumerable: true,
            configurable: true
        });
        CollectibleSprite.prototype.update = function () {
            _super.prototype.update.call(this);
            this._collectible.update();
        };
        return CollectibleSprite;
    }(Phaser.Image));
    BusTrip.CollectibleSprite = CollectibleSprite;
    var eCollectibleState;
    (function (eCollectibleState) {
        eCollectibleState[eCollectibleState["fall"] = 0] = "fall";
        eCollectibleState[eCollectibleState["blink"] = 1] = "blink";
        eCollectibleState[eCollectibleState["collect"] = 2] = "collect";
        eCollectibleState[eCollectibleState["deathMark"] = 3] = "deathMark";
    })(eCollectibleState || (eCollectibleState = {}));
    var Collectible = (function () {
        function Collectible() {
            this._processFnc = [];
            this._processFnc[eCollectibleState.fall] = this.processFall;
            this._processFnc[eCollectibleState.blink] = this.processBlink;
            this._processFnc[eCollectibleState.collect] = null;
            this._processFnc[eCollectibleState.deathMark] = this.processBlink;
        }
        Object.defineProperty(Collectible.prototype, "type", {
            get: function () {
                return this._type.type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Collectible.prototype, "x", {
            get: function () {
                return this._sprite.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Collectible.prototype, "y", {
            get: function () {
                return this._sprite.y;
            },
            enumerable: true,
            configurable: true
        });
        Collectible.prototype.setup = function (type, x, y, speedX, speedY) {
            this._type = type;
            if (this._sprite == undefined) {
                this._sprite = new CollectibleSprite(this, type.frameName);
            }
            else {
                this._sprite.frameName = type.frameName;
            }
            BusTrip.CollectiblesManager.instance.collectiblesLayer.add(this._sprite);
            this._sprite.position.set(x, y);
            this._sprite.anchor.set(type.anchorX, type.anchorY);
            this._sprite.visible = true;
            this._sprite.alpha = 1;
            this._speedX = speedX;
            this._speedY = speedY;
            var speedRatio = (Math.max(speedX, speedY) - BusTrip.CollectiblesManager.THROW_MIN_V_SPEED) / (BusTrip.CollectiblesManager.THROW_MAX_V_SPEED - BusTrip.CollectiblesManager.THROW_MIN_V_SPEED);
            this._rotationSpeed = 1 + speedRatio * 2;
            if (BusTrip.Global.game.rnd.realInRange(0, 1) < 0.5)
                this._rotationSpeed *= -1;
            this._trajPartInterval = 100;
            this._nextTrajPartTime = BusTrip.Global.elapsedTime + this._trajPartInterval;
            this._state = eCollectibleState.fall;
        };
        Collectible.prototype.deactivate = function () {
            this._sprite.parent.removeChild(this._sprite);
            BusTrip.CollectiblesManager.instance.collectiblesPool.returnItem(this);
        };
        Collectible.prototype.update = function () {
            if (BusTrip.Player.instance.death && this._state != eCollectibleState.deathMark)
                return;
            var fnc = this._processFnc[this._state];
            if (fnc != null)
                fnc.call(this);
        };
        Collectible.prototype.processFall = function () {
            var colRadius = this._type.collisionRadius;
            this._sprite.y += (this._speedY * BusTrip.Global.deltaRatio);
            this._sprite.angle += this._rotationSpeed;
            var y = this._sprite.y;
            if (y >= BusTrip.Play.GROUND_Y) {
                this._state = eCollectibleState.blink;
                this._blinkRemCnt = 8;
                this._blinkTimer = 0;
                this.processBlink();
                Utils.AudioUtils.playSound("groundHit");
                return;
            }
            var x = this._sprite.x;
            if (this._speedX != 0) {
                x += this._speedX * BusTrip.Global.deltaRatio;
                if (x - colRadius < 0) {
                    x -= (x - colRadius);
                    this._speedX *= -1;
                }
                else if (x + colRadius >= BusTrip.Global.GAME_MAX_WIDTH) {
                    x -= (x + colRadius) - BusTrip.Global.GAME_MAX_WIDTH;
                    this._speedX *= -1;
                }
                this._sprite.x = x;
            }
            var busColRc = BusTrip.Player.instance.collisionRect1;
            var attemptCnt = 0;
            if (y + colRadius >= busColRc.y) {
                while (true) {
                    if (x - colRadius < busColRc.right && x + colRadius >= busColRc.left) {
                        Collectible._tmpCircle.setTo(x, y, colRadius);
                        if (Phaser.Circle.intersectsRectangle(Collectible._tmpCircle, busColRc)) {
                            this.collect();
                        }
                        break;
                    }
                    if (attemptCnt != 0 || (busColRc = BusTrip.Player.instance.collisionRect2) == null)
                        break;
                    attemptCnt++;
                }
            }
            if (this._nextTrajPartTime <= BusTrip.Global.elapsedTime) {
                this._nextTrajPartTime += this._trajPartInterval;
                var collectibles = BusTrip.CollectiblesManager.instance;
                var part = collectibles.trajParticlesPool.getItem();
                part.showParticle(x, y, this._type.trajParticleFrameName);
                collectibles.trajParticlesLayer.addChild(part);
            }
        };
        Collectible.prototype.processBlink = function () {
            if ((this._blinkTimer -= BusTrip.Global.deltaRatio) <= 0) {
                if (this._blinkRemCnt-- == 0) {
                    this.deactivate();
                    return;
                }
                this._blinkTimer = 4;
                this._sprite.visible = !this._sprite.visible;
            }
        };
        Collectible.prototype.collect = function () {
            if (this._type.type == BusTrip.eCollectibleType.cactus) {
                this._blinkRemCnt = 20;
                this._blinkTimer = 0;
                this._state = eCollectibleState.deathMark;
                this.processBlink();
                BusTrip.Player.instance.kill();
                Utils.AudioUtils.playSound("pickup2");
                return;
            }
            BusTrip.Player.instance.pickupCollectible(this);
            BusTrip.Global.game.add.tween(this._sprite).to({
                angle: this._sprite.angle + (360 * (this._rotationSpeed > 0 ? 1 : -1)), alpha: 0
            }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(this.deactivate, this);
            Utils.AudioUtils.playSound("pickup1");
            this._state = eCollectibleState.collect;
        };
        Collectible._tmpCircle = new Phaser.Circle();
        return Collectible;
    }());
    BusTrip.Collectible = Collectible;
})(BusTrip || (BusTrip = {}));
var BusTrip;
(function (BusTrip) {
    (function (eCollectibleType) {
        eCollectibleType[eCollectibleType["bonus1"] = 0] = "bonus1";
        eCollectibleType[eCollectibleType["bonus2"] = 1] = "bonus2";
        eCollectibleType[eCollectibleType["bonus3"] = 2] = "bonus3";
        eCollectibleType[eCollectibleType["cactus"] = 3] = "cactus";
        eCollectibleType[eCollectibleType["speedUp"] = 4] = "speedUp";
        eCollectibleType[eCollectibleType["extraBonuses"] = 5] = "extraBonuses";
    })(BusTrip.eCollectibleType || (BusTrip.eCollectibleType = {}));
    var eCollectibleType = BusTrip.eCollectibleType;
    var eCollectiblesMngState;
    (function (eCollectiblesMngState) {
        eCollectiblesMngState[eCollectiblesMngState["rndThrow"] = 0] = "rndThrow";
        eCollectiblesMngState[eCollectiblesMngState["waveThrow"] = 1] = "waveThrow";
        eCollectiblesMngState[eCollectiblesMngState["nextWaveDelay"] = 2] = "nextWaveDelay";
    })(eCollectiblesMngState || (eCollectiblesMngState = {}));
    var CollectiblesManager = (function () {
        function CollectiblesManager() {
            this._collectibleTypes = [];
            CollectiblesManager._instance = this;
            this._trajParticlesLayer = BusTrip.Global.game.add.group();
            this._trajParticlesPool = new Utils.Pool(BusTrip.TrajectoryParticle, 40, true);
            this._collectiblesLayer = BusTrip.Global.game.add.group();
            this._collectiblesPool = new Utils.Pool(BusTrip.Collectible, 20, true);
            this._zoneRndPicker = new Utils.RandomPicker(BusTrip.Global.game.rnd, CollectiblesManager.THROW_ZONE_CNT, Utils.eRandomPickerMode.incProbOfNonSelItems, 0);
            this._bonusRndPicker = new Utils.RandomPicker(BusTrip.Global.game.rnd, CollectiblesManager.BONUS_CNT, Utils.eRandomPickerMode.higherIdHasLowerPriority);
            this._powerUpRndPicker = new Utils.RandomPicker(BusTrip.Global.game.rnd, CollectiblesManager.POWER_UP_CNT, Utils.eRandomPickerMode.incProbOfNonSelItems, 1);
            this._collectibleTypes[eCollectibleType.bonus1] = new BusTrip.CollectibleType(eCollectibleType.bonus1, "itemPineapple", 0.5, 0.6, 18, "trajWhite");
            this._collectibleTypes[eCollectibleType.bonus2] = new BusTrip.CollectibleType(eCollectibleType.bonus2, "itemCoconut", 0.5, 0.5, 18, "trajWhite");
            this._collectibleTypes[eCollectibleType.bonus3] = new BusTrip.CollectibleType(eCollectibleType.bonus3, "itemSunshade", 0.5, 0.5, 18, "trajWhite");
            this._collectibleTypes[eCollectibleType.cactus] = new BusTrip.CollectibleType(eCollectibleType.cactus, "itemCactus", 0.5, 0.5, 20, "trajRed");
            this._collectibleTypes[eCollectibleType.speedUp] = new BusTrip.CollectibleType(eCollectibleType.speedUp, "itemSunglasses", 0.5, 0.5, 16, "trajYellow");
            this._collectibleTypes[eCollectibleType.extraBonuses] = new BusTrip.CollectibleType(eCollectibleType.extraBonuses, "itemCamera", 0.5, 0.5, 18, "trajYellow");
        }
        Object.defineProperty(CollectiblesManager, "instance", {
            get: function () {
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectiblesManager.prototype, "collectiblesPool", {
            get: function () {
                return this._collectiblesPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectiblesManager.prototype, "collectiblesLayer", {
            get: function () {
                return this._collectiblesLayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectiblesManager.prototype, "trajParticlesPool", {
            get: function () {
                return this._trajParticlesPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectiblesManager.prototype, "trajParticlesLayer", {
            get: function () {
                return this._trajParticlesLayer;
            },
            enumerable: true,
            configurable: true
        });
        CollectiblesManager.prototype.reset = function () {
            this.releaseAllItems();
            this._zoneRndPicker.reset();
            this._bonusRndPicker.reset();
            this._powerUpRndPicker.reset();
            this._nextPowerUpDelay = BusTrip.Global.game.rnd.integerInRange(CollectiblesManager.POWER_UP_MIN_INTERVAL, CollectiblesManager.POWER_UP_MAX_INTERVAL);
            this._nextCactusDelay = CollectiblesManager.CACTUS_INTERVAL_MIN_DIF;
            this._thrownItemCnt = 0;
            this._throwInterval = CollectiblesManager.THROW_INTERVAL_MIN_DIF;
            this._nextThrowTime = BusTrip.Global.elapsedTime + this._throwInterval;
            this._state = eCollectiblesMngState.rndThrow;
        };
        CollectiblesManager.prototype.update = function () {
            if (BusTrip.Player.instance.death)
                return;
            if (this._nextThrowTime <= BusTrip.Global.elapsedTime) {
                switch (this._state) {
                    case eCollectiblesMngState.rndThrow: {
                        this.rndThrow();
                        break;
                    }
                    case eCollectiblesMngState.waveThrow: {
                        this.waveThrow();
                        break;
                    }
                    case eCollectiblesMngState.nextWaveDelay: {
                        this.newWave();
                        break;
                    }
                }
            }
        };
        CollectiblesManager.prototype.throwWaves = function (waveCnt) {
            this._remWaveCnt = waveCnt;
            BusTrip.Global.game.camera.fade(0xFFFFFF, 100);
            BusTrip.Global.game.camera.onFadeComplete.addOnce(function () {
                this.newWave();
                BusTrip.Global.game.camera.flash(0xFFFFFF, 100);
            }, this);
        };
        CollectiblesManager.prototype.releaseAllItems = function () {
            var i = this._collectiblesLayer.total;
            while (i-- != 0) {
                var item = this._collectiblesLayer.getChildAt(i);
                if (item.exists)
                    item.collectible.deactivate();
            }
            i = this._trajParticlesLayer.total;
            while (i-- != 0) {
                var item = this._trajParticlesLayer.getChildAt(i);
                if (item.exists)
                    item.deactivate();
            }
        };
        CollectiblesManager.prototype.rndThrow = function () {
            var x = this.selThrowPos();
            var speedY = BusTrip.Global.game.rnd.realInRange(CollectiblesManager.THROW_MIN_V_SPEED, CollectiblesManager.THROW_MAX_V_SPEED);
            var speedX = 0;
            if (BusTrip.Global.game.rnd.realInRange(0, 1) < 0.35) {
                speedX = BusTrip.Global.game.rnd.realInRange(1, speedY);
                if (BusTrip.Global.game.rnd.realInRange(0, 1) < 0.5) {
                    speedX *= -1;
                }
            }
            var colType;
            if (this._nextCactusDelay-- == 0) {
                this._nextCactusDelay = Math.round(CollectiblesManager.CACTUS_INTERVAL_MIN_DIF + (CollectiblesManager.CACTUS_INTERVAL_MAX_DIF - CollectiblesManager.CACTUS_INTERVAL_MIN_DIF) * Math.min(1, (this._thrownItemCnt + 1) / CollectiblesManager.MAX_DIF_THROWN_ITEM_CNT));
                colType = eCollectibleType.cactus;
            }
            else if (this._nextPowerUpDelay-- == 0) {
                this._nextPowerUpDelay = BusTrip.Global.game.rnd.integerInRange(CollectiblesManager.POWER_UP_MIN_INTERVAL, CollectiblesManager.POWER_UP_MAX_INTERVAL);
                colType = eCollectibleType.speedUp + this._powerUpRndPicker.selectItem();
            }
            else {
                colType = this._bonusRndPicker.selectItem();
            }
            this.throwItem(colType, x, speedX, speedY);
            var difficulty = Math.min(1, this._thrownItemCnt / CollectiblesManager.MAX_DIF_THROWN_ITEM_CNT);
            this._nextThrowTime = BusTrip.Global.elapsedTime + CollectiblesManager.THROW_INTERVAL_MIN_DIF + (CollectiblesManager.THROW_INTERVAL_MAX_DIF - CollectiblesManager.THROW_INTERVAL_MIN_DIF) * difficulty;
        };
        CollectiblesManager.prototype.waveThrow = function () {
            var waveX = this._waveX;
            var itemType;
            if (this._waveRemSize == this._waveRemCactuses) {
                this._waveRemCactuses--;
                itemType = eCollectibleType.cactus;
            }
            else {
                itemType = this._bonusRndPicker.selectItem();
            }
            this.throwItem(itemType, waveX, 0, 3);
            if (--this._waveRemSize == 0) {
                if (this._remWaveCnt != 0) {
                    this._nextThrowTime = BusTrip.Global.elapsedTime + 1000;
                    this._state = eCollectiblesMngState.nextWaveDelay;
                }
                else {
                    this._nextThrowTime = BusTrip.Global.elapsedTime + 2000;
                    this._state = eCollectiblesMngState.rndThrow;
                }
                return;
            }
            waveX += (60 * this._waveDir);
            if (this._waveDir > 0) {
                if (waveX > BusTrip.Global.GAME_MAX_WIDTH - CollectiblesManager.THROW_H_MARGIN) {
                    waveX = CollectiblesManager.THROW_H_MARGIN;
                }
            }
            else if (waveX < CollectiblesManager.THROW_H_MARGIN) {
                waveX = BusTrip.Global.GAME_MAX_WIDTH - CollectiblesManager.THROW_H_MARGIN;
            }
            this._waveX = waveX;
            this._nextThrowTime = BusTrip.Global.elapsedTime + 110;
        };
        CollectiblesManager.prototype.newWave = function () {
            this._waveX = this.selThrowPos();
            this._waveDir = BusTrip.Global.game.rnd.realInRange(0, 1) < 0.5 ? -1 : 1;
            this._waveRemSize = 8;
            this._waveRemCactuses = BusTrip.Global.game.rnd.integerInRange(1, 4);
            this._remWaveCnt--;
            this._state = eCollectiblesMngState.waveThrow;
            this.waveThrow();
        };
        CollectiblesManager.prototype.selThrowPos = function () {
            var zoneId = this._zoneRndPicker.selectItem();
            var x = zoneId * CollectiblesManager.THROW_ZONE_WIDTH;
            x = CollectiblesManager.THROW_H_MARGIN + BusTrip.Global.game.rnd.integerInRange(x, x + CollectiblesManager.THROW_ZONE_WIDTH);
            return x;
        };
        CollectiblesManager.prototype.throwItem = function (type, x, speedX, speedY) {
            this._collectiblesPool.getItem().setup(this._collectibleTypes[type], x, BusTrip.Global.game.camera.y + CollectiblesManager.THROW_Y, speedX, speedY);
            this._thrownItemCnt++;
        };
        CollectiblesManager.THROW_Y = -50;
        CollectiblesManager.THROW_H_MARGIN = 30;
        CollectiblesManager.THROW_ZONE_CNT = 5;
        CollectiblesManager.THROW_ZONE_WIDTH = (BusTrip.Global.GAME_MAX_WIDTH - CollectiblesManager.THROW_H_MARGIN * 2) / CollectiblesManager.THROW_ZONE_CNT;
        CollectiblesManager.THROW_MIN_V_SPEED = 2;
        CollectiblesManager.THROW_MAX_V_SPEED = 4;
        CollectiblesManager.THROW_INTERVAL_MIN_DIF = 600;
        CollectiblesManager.THROW_INTERVAL_MAX_DIF = 300;
        CollectiblesManager.BONUS_CNT = 3;
        CollectiblesManager.POWER_UP_CNT = 2;
        CollectiblesManager.POWER_UP_MAX_INTERVAL = 24;
        CollectiblesManager.POWER_UP_MIN_INTERVAL = 14;
        CollectiblesManager.CACTUS_INTERVAL_MIN_DIF = 6;
        CollectiblesManager.CACTUS_INTERVAL_MAX_DIF = 1;
        CollectiblesManager.MAX_DIF_THROWN_ITEM_CNT = 150;
        return CollectiblesManager;
    }());
    BusTrip.CollectiblesManager = CollectiblesManager;
})(BusTrip || (BusTrip = {}));
var BusTrip;
(function (BusTrip) {
    var CollectibleType = (function () {
        function CollectibleType(type, frameName, anchorX, anchorY, collisionRadius, trajParticleFrameName) {
            this._type = type;
            this._frameName = frameName;
            this._anchorX = anchorX;
            this._anchorY = anchorY;
            this._colRadius = collisionRadius;
            this._trajParticleFrameName = trajParticleFrameName;
        }
        Object.defineProperty(CollectibleType.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectibleType.prototype, "collisionRadius", {
            get: function () {
                return this._colRadius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectibleType.prototype, "frameName", {
            get: function () {
                return this._frameName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectibleType.prototype, "anchorX", {
            get: function () {
                return this._anchorX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectibleType.prototype, "anchorY", {
            get: function () {
                return this._anchorY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectibleType.prototype, "trajParticleFrameName", {
            get: function () {
                return this._trajParticleFrameName;
            },
            enumerable: true,
            configurable: true
        });
        return CollectibleType;
    }());
    BusTrip.CollectibleType = CollectibleType;
})(BusTrip || (BusTrip = {}));
var BusTrip;
(function (BusTrip) {
    var TrajectoryParticle = (function (_super) {
        __extends(TrajectoryParticle, _super);
        function TrajectoryParticle() {
            _super.call(this, BusTrip.Global.game, 0, 0, BusTrip.Global.ATLAS_KEY_0);
            this.anchor.set(0.5);
        }
        TrajectoryParticle.prototype.showParticle = function (x, y, frameName) {
            this.position.set(x, y);
            this.scale.set(TrajectoryParticle.START_SCALE);
            this.alpha = 1;
            this.frameName = frameName;
            this._actTime = BusTrip.Global.elapsedTime;
        };
        TrajectoryParticle.prototype.update = function () {
            _super.prototype.update.call(this);
            var lifePos = (BusTrip.Global.elapsedTime - this._actTime) / TrajectoryParticle.LIFE_LEN;
            if (lifePos >= 1) {
                this.deactivate();
                return;
            }
            this.scale.set(TrajectoryParticle.START_SCALE + (TrajectoryParticle.END_SCALE - TrajectoryParticle.START_SCALE) * lifePos);
            this.alpha = 1 - lifePos;
        };
        TrajectoryParticle.prototype.deactivate = function () {
            this.parent.removeChild(this);
            BusTrip.CollectiblesManager.instance.trajParticlesPool.returnItem(this);
        };
        TrajectoryParticle.LIFE_LEN = 500;
        TrajectoryParticle.START_SCALE = 0.5;
        TrajectoryParticle.END_SCALE = 0.1;
        return TrajectoryParticle;
    }(Phaser.Image));
    BusTrip.TrajectoryParticle = TrajectoryParticle;
})(BusTrip || (BusTrip = {}));
var BusTrip;
(function (BusTrip) {
    var Player = (function () {
        function Player() {
            Player._instance = this;
            this._shadow1 = BusTrip.Global.game.add.image(0, 0, BusTrip.Global.ATLAS_KEY_0, "busShadow");
            this._shadow1.pivot.set(Math.round(this._shadow1.width * 0.5), Math.round(this._shadow1.height * 0.5));
            this._shadow2 = BusTrip.Global.game.add.image(0, 0, BusTrip.Global.ATLAS_KEY_0, "busShadow");
            this._shadow2.pivot.set(this._shadow1.pivot.x, this._shadow1.pivot.y);
            this._sprite1 = BusTrip.Global.game.add.image(0, 0, BusTrip.Global.ATLAS_KEY_0, "bus");
            this._sprite1.pivot.set(Math.round(this._sprite1.width * 0.5), this._sprite1.height - 1);
            this._sprite2 = BusTrip.Global.game.add.image(0, 0, BusTrip.Global.ATLAS_KEY_0, "bus");
            this._sprite2.pivot.set(this._sprite1.pivot.x, this._sprite1.pivot.y);
            this._colRc1 = new Phaser.Rectangle(0, 0, 93, 108);
            this._colRc2 = new Phaser.Rectangle(0, 0, 93, 108);
        }
        Object.defineProperty(Player.prototype, "collisionRect1", {
            get: function () {
                return this._colRc1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "collisionRect2", {
            get: function () {
                return (this._sprite2.exists ? this._colRc2 : null);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player, "instance", {
            get: function () {
                return Player._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "death", {
            get: function () {
                return this._death;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.reset = function () {
            this._sprite1.position.set(BusTrip.Global.GAME_MAX_WIDTH / 2, BusTrip.Play.GROUND_Y);
            this._sprite1.angle = 0;
            this._sprite2.position.copyFrom(this._sprite1.position);
            this._shadow1.position.copyFrom(this._sprite1.position);
            this._shadow2.position.copyFrom(this._sprite1.position);
            this._sprite2.exists = false;
            this._shadow2.exists = false;
            this._moveDir = BusTrip.Global.game.rnd.realInRange(0, 1) < 0.5 ? -1 : 1;
            this._colRc1.y = this._colRc2.y = this._sprite1.y - this._sprite1.pivot.y + 5;
            this._death = false;
            this._speedUpBnsTimer = undefined;
        };
        Player.prototype.update = function () {
            if (this._death)
                return;
            var moveStep = Player.MOVE_SPEED;
            if (this._speedUpBnsTimer != undefined) {
                moveStep += Player.MOVE_SPEED / 2;
                if (this._speedUpBnsTimer < BusTrip.Global.elapsedTime)
                    this._speedUpBnsTimer = undefined;
            }
            moveStep *= (this._moveDir * BusTrip.Global.deltaRatio);
            this.moveImage(this._sprite1, this._sprite2, moveStep);
            this.moveImage(this._shadow1, this._shadow2, moveStep);
            this._colRc1.x = this._sprite1.x - this._sprite1.pivot.x + Player.COL_RC_X;
            if (this._sprite2.exists)
                this._colRc2.x = this._sprite2.x - this._sprite2.pivot.x + Player.COL_RC_X;
        };
        Player.prototype.flipMoveDir = function () {
            if (this._death)
                return;
            this._moveDir *= -1;
            if (this._tiltTween != undefined) {
                this._tiltTween.stop(false);
            }
            this._tiltTween = BusTrip.Global.game.add.tween(this._sprite1).to({
                angle: (this._moveDir < 0 ? 10 : -10)
            }, 200, Phaser.Easing.Linear.None, true);
            this._tiltTween.onComplete.add(function () {
                this._tiltTween = BusTrip.Global.game.add.tween(this._sprite1).to({ angle: 0 }, 300, Phaser.Easing.Cubic.In, true);
            }, this);
            Utils.AudioUtils.playSound("flipDir");
        };
        Player.prototype.pickupCollectible = function (collectible) {
            switch (collectible.type) {
                case BusTrip.eCollectibleType.extraBonuses: {
                    BusTrip.CollectiblesManager.instance.throwWaves(3);
                    break;
                }
                case BusTrip.eCollectibleType.speedUp: {
                    this._speedUpBnsTimer = BusTrip.Global.elapsedTime + 3000;
                    break;
                }
                default: {
                    var type = collectible.type;
                    BusTrip.Play.instance.popupScore.showScore(type, collectible.x, collectible.y);
                    if (BusTrip.Global.GAMEE)
                        Gamee.Gamee.instance.score += ((type + 1) * 5);
                }
            }
        };
        Player.prototype.kill = function () {
            this._death = true;
            BusTrip.Global.game.time.events.add(2000, BusTrip.Play.instance.gameOver, BusTrip.Play.instance);
            BusTrip.Global.game.tweens.removeFrom(this._sprite1);
        };
        Player.prototype.moveImage = function (image1, image2, moveStep) {
            var x = image1.x + moveStep;
            var pivot = image1.pivot;
            var overlaping = false;
            var overlap = x - pivot.x;
            image1.x += moveStep;
            if (image2.exists) {
                image2.x += moveStep;
                image2.angle = image1.angle;
            }
            if (overlap < 0) {
                var overlap_1 = x - pivot.x;
                if (-overlap_1 < image1.width) {
                    image2.x = BusTrip.Global.GAME_MAX_WIDTH + overlap_1 + pivot.x;
                    overlaping = true;
                }
                else {
                    image1.x = BusTrip.Global.GAME_MAX_WIDTH + overlap_1 + pivot.x;
                }
            }
            else {
                overlap = x - pivot.x + image1.width - BusTrip.Global.GAME_MAX_WIDTH;
                if (overlap > 0) {
                    if (overlap < image1.width) {
                        image2.x = overlap - image1.width + pivot.x;
                        overlaping = true;
                    }
                    else {
                        image1.x = overlap - image1.width + pivot.x;
                    }
                }
            }
            image2.exists = overlaping;
        };
        Player.MOVE_SPEED = 4;
        Player.COL_RC_X = 9;
        return Player;
    }());
    BusTrip.Player = Player;
})(BusTrip || (BusTrip = {}));
var BusTrip;
(function (BusTrip) {
    var PopupScore = (function () {
        function PopupScore() {
            this._frameNames = [];
            this._layer = BusTrip.Global.game.add.group();
            this._frameNames.push("points5");
            this._frameNames.push("points10");
            this._frameNames.push("points15");
            this._frameNames.push("points20");
        }
        PopupScore.prototype.reset = function () {
            this._layer.setAllChildren("exists", false);
        };
        PopupScore.prototype.showScore = function (id, x, y) {
            var img = this._layer.getFirstExists(false, false);
            if (img == null) {
                img = BusTrip.Global.game.add.image(x, y, BusTrip.Global.ATLAS_KEY_0, this._frameNames[id], this._layer);
                img.anchor.set(0.5);
            }
            else {
                img.frameName = this._frameNames[id];
                img.alpha = 1;
                img.exists = true;
                img.position.set(x, y);
            }
            BusTrip.Global.game.add.tween(img).to({ y: y - 100 }, 500, Phaser.Easing.Cubic.Out, true);
            BusTrip.Global.game.add.tween(img).to({ alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 500).onComplete.add(function (target) {
                target.exists = false;
            }, this);
        };
        return PopupScore;
    }());
    BusTrip.PopupScore = PopupScore;
    ;
})(BusTrip || (BusTrip = {}));

