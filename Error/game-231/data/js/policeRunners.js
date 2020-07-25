var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PoliceRunners;
(function (PoliceRunners) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = this;
            // default renderer
            var renderer = Phaser.CANVAS;
            // init game
            _this = _super.call(this, {
                width: 1,
                height: 1,
                renderer: renderer,
                transparent: false,
                antialias: true,
                physicsConfig: null,
                preserveDrawingBuffer: true
            }) || this;
            Game.game = _this;
            _this.state.add(PoliceRunners.StringConstants.STATE_BOOT, PoliceRunners.State_boot);
            _this.state.add(PoliceRunners.StringConstants.STATE_PRELOAD, PoliceRunners.State_preload);
            _this.state.add(PoliceRunners.StringConstants.STATE_GAME, PoliceRunners.State_game);
            _this.state.start(PoliceRunners.StringConstants.STATE_BOOT);
            return _this;
        }
        return Game;
    }(Phaser.Game));
    PoliceRunners.Game = Game;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var GameSettingsHandler = /** @class */ (function () {
        function GameSettingsHandler(game) {
            var gameSettingsJSON = game.cache.getJSON(PoliceRunners.StringConstants.JSON_GAMESETTINGS);
            this._levels = gameSettingsJSON.LEVELS;
            this._maxCarHP = gameSettingsJSON.MAX_CAR_HP;
            this._policeCarInfos = gameSettingsJSON.POLICE_CARS;
            this._generatorSettings = gameSettingsJSON.GENERATOR;
            this._levelReward = gameSettingsJSON.LEVEL_REWARD;
            this._playerCarInfos = gameSettingsJSON.CARS;
            this._coinRewards = gameSettingsJSON.COIN_REWARD;
            this._nearMissMultiplier = gameSettingsJSON.NEAR_MISS_COMBO_MULT;
            this._dailyRaceValues = gameSettingsJSON.DAILY_RACES_VALS;
        }
        Object.defineProperty(GameSettingsHandler.prototype, "Levels", {
            get: function () {
                return this._levels;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameSettingsHandler.prototype, "CoinRewards", {
            get: function () {
                return this._coinRewards;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameSettingsHandler.prototype, "NearMissMultiplier", {
            get: function () {
                return this._nearMissMultiplier;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameSettingsHandler.prototype, "MaxCarHP", {
            get: function () {
                return this._maxCarHP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameSettingsHandler.prototype, "LevelReward", {
            get: function () {
                return this._levelReward;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameSettingsHandler.prototype, "PlayerCarInfos", {
            get: function () {
                return this._playerCarInfos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameSettingsHandler.prototype, "DailyRaceValues", {
            get: function () {
                return this._dailyRaceValues;
            },
            enumerable: true,
            configurable: true
        });
        GameSettingsHandler.prototype.GetPoliceCarInfo = function (toFind) {
            for (var i = 0; i < this._policeCarInfos.length; i++) {
                if (this._policeCarInfos[i].id === toFind)
                    return this._policeCarInfos[i];
            }
            return null;
        };
        GameSettingsHandler.prototype.GetCurrentGeneratorSettings = function (playerArea) {
            return this._generatorSettings.thresholds[Math.min(playerArea, this._generatorSettings.thresholds.length - 1)];
        };
        GameSettingsHandler.prototype.GetCoinReward = function (wantedLevel) {
            return this._coinRewards[wantedLevel];
        };
        GameSettingsHandler.prototype.GetNextLevelValue = function (currentLevelIndex) {
            var returnVal = currentLevelIndex >= this._levels.length ?
                this._levels[this._levels.length - 1] + ((currentLevelIndex - (this._levels.length - 1)) * 400)
                : this._levels[currentLevelIndex];
            //console.log("returning: " + returnVal);
            return returnVal;
        };
        GameSettingsHandler.prototype.GetDailyRaceValue = function (numOfUnlockedCars) {
            for (var i = 0; i < this._dailyRaceValues.length; i++) {
                if (numOfUnlockedCars >= this._dailyRaceValues[i].unlockedCarsMin
                    && numOfUnlockedCars <= this._dailyRaceValues[i].unlockedCarsMax)
                    return this._dailyRaceValues[i].val;
            }
        };
        GameSettingsHandler.prototype.IsNewCarUnlocked = function (unlockedLevel) {
            for (var i = 0; i < this._playerCarInfos.length; i++) {
                if (this._playerCarInfos[i].unlockLevel === unlockedLevel)
                    return true;
            }
            return false;
        };
        //this method counts with premise that cars are ordered by unlock level in game settings
        GameSettingsHandler.prototype.GetFirstLockedCar = function (unlockedLevel) {
            for (var i = 0; i < this._playerCarInfos.length; i++) {
                if (this._playerCarInfos[i].unlockLevel > unlockedLevel)
                    return this._playerCarInfos[i];
            }
            return null;
        };
        GameSettingsHandler.prototype.GetNumOfUnlockedCars = function (currentLevel) {
            var numOfUnlockedCars = 0;
            for (var i = 0; i < this._playerCarInfos.length; i++) {
                if (this._playerCarInfos[i].unlockLevel <= currentLevel)
                    numOfUnlockedCars++;
            }
            return numOfUnlockedCars;
        };
        GameSettingsHandler.prototype.GetGivenCarInfo = function (carID) {
            for (var i = 0; i < this._playerCarInfos.length; i++) {
                if (this._playerCarInfos[i].id == carID)
                    return this._playerCarInfos[i];
            }
            return null;
        };
        return GameSettingsHandler;
    }());
    PoliceRunners.GameSettingsHandler = GameSettingsHandler;
})(PoliceRunners || (PoliceRunners = {}));
var App;
(function (App) {
    var Global = /** @class */ (function () {
        function Global() {
        }
        Global.FBINSTANT = false;
        Global.GAMEE = true;
        Global.LOG_EVENTS = true;
        Global.CALL_DESKTOP_UNSUPPORTED_METHODS = true;
        // game derived from Phaser.Game
        Global.game = null;
        Global.GAME_WIDTH = 640;
        Global.GAME_HEIGHT = 1136;
        Global.MIN_WIDTH = 320;
        Global.MIN_HEIGHT = 568;
        //sound
        Global.soundOn = true;
        return Global;
    }());
    App.Global = Global;
})(App || (App = {}));
//This is the game access point
window.onload = function () {
    if (App.Global.GAMEE) {
        // Gamee
        //["saveState", "playerData", "logEvents"]
        var gamee_1 = new Gamee.Gamee("FullScreen", {}, ["saveState", "logEvents", "socialData", "share", "coins", "gems"], function () {
            var game = startGame();
            gamee_1.setGame(game);
        });
    }
    else if (App.Global.FBINSTANT) {
        // // check if FB Instant is present
        // if (FBInstant == null) {
        //     App.Global.FBINSTANT = false;
        //     startGame();
        //     return;
        // }
        // // FB Instant
        // console.log("FB initializeAsync called");
        // FBInstant.initializeAsync().then(function () {
        //     console.log("FB initializeAsync completed");
        //     startGame();
        // }).catch(function (e) {
        //     // FBInstant failed to initialize - switch off FBINSTANT setting and start standard game
        //     console.log("FB initializeAsync failed - fallback to standard game. Error: " + e.code + ": " + e.message);
        //     App.Global.FBINSTANT = false;
        //     startGame();
        // });
    }
    else {
        // Standard game
        startGame();
    }
};
function startGame() {
    //console.log("kokokd")
    var game = new PoliceRunners.Game();
    App.Global.game = game;
    return game;
}
var Base;
(function (Base) {
    var eObjectType;
    (function (eObjectType) {
        eObjectType[eObjectType["POLICE"] = 0] = "POLICE";
        eObjectType[eObjectType["ANIM"] = 1] = "ANIM";
        eObjectType[eObjectType["COIN"] = 2] = "COIN";
        eObjectType[eObjectType["UI_ICON"] = 3] = "UI_ICON";
        eObjectType[eObjectType["SKID_MARK"] = 4] = "SKID_MARK";
        eObjectType[eObjectType["POWER_UP"] = 5] = "POWER_UP";
        eObjectType[eObjectType["POWER_UP_ACTIVATED"] = 6] = "POWER_UP_ACTIVATED";
        eObjectType[eObjectType["RACE_CHECKPOINT"] = 7] = "RACE_CHECKPOINT";
        eObjectType[eObjectType["BG_LIGHT"] = 8] = "BG_LIGHT";
        eObjectType[eObjectType["POWER_UP_TEXT"] = 9] = "POWER_UP_TEXT";
    })(eObjectType = Base.eObjectType || (Base.eObjectType = {}));
    /** This is base parent class used by all important pool objects in the scene */
    var SceneObject = /** @class */ (function (_super) {
        __extends(SceneObject, _super);
        function SceneObject(game, posX, posY, objectType, key, frame) {
            var _this = _super.call(this, game, posX, posY, key, frame) || this;
            _this.ObjectType = objectType;
            return _this;
        }
        Object.defineProperty(SceneObject.prototype, "AssignedLayer", {
            set: function (value) {
                this._assignedLayer = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneObject.prototype, "ParentPool", {
            set: function (value) {
                this._parentPool = value;
            },
            enumerable: true,
            configurable: true
        });
        /** Kills object, returns it to the parent pool and removes from the layer*/
        SceneObject.prototype.KillObjectAndRemoveFromScene = function () {
            // if (this.ObjectType == eObjectType.POLICE)
            //     console.log("KILLING POLICE WITH ID " + this.ObjectID);
            this.kill();
            if (this._parentPool) {
                // if (this.ObjectType == eObjectType.POLICE)
                //     console.log("RETURNING TO POOL POLICE WITH ID " + this.ObjectID);
                this._parentPool.AddToPool(this);
            }
            else {
                // if (this.ObjectType == eObjectType.POLICE)
                //     console.log("CANNOT RETURN TO POOL POLICE WITH ID " + this.ObjectID);
                console.log("Calling kill " + this.key + " and trying to return to parent, but it doesnt exist!");
            }
            //console.log("removed fuckin " + this.key +"!.Je tady parent pool? a jak je velky?" + (this._parentPool != undefined ? this._parentPool.Pool.length : "UNDEFINED"));
            if (this._assignedLayer) {
                // if (this.ObjectType == eObjectType.POLICE)
                //     console.log("REMOVING FROM LAYER POLICE WITH ID " + this.ObjectID);
                this._assignedLayer.remove(this);
            }
            // else {
            //     if (this.ObjectType == eObjectType.POLICE)
            //         console.log("NO ASSIGNED LAYER, POLICE WITH ID " + this.ObjectID);
            // }
            //console.log("removed fuckin " + this.key +" from layer!.Je tady assigned layer a kolik je v ni prvku?" + this._assignedLayer.length);
        };
        SceneObject.prototype.SpawnObject = function (posX, posY) {
            if (this._assignedLayer)
                this._assignedLayer.add(this);
            this.reset(posX, posY);
            // console.log("spawned fuckin  " + this.key +" je tady parent pool? a jak je velky?" + (this._parentPool != undefined ? this._parentPool.Pool.length : "UNDEFINED"));
            // console.log("spawned fuckin " + this.key +" to layer!.Je tady assigned layer a kolik je v ni prvku?" + this._assignedLayer.length);
        };
        return SceneObject;
    }(Phaser.Sprite));
    Base.SceneObject = SceneObject;
})(Base || (Base = {}));
/// <reference path="SceneObject.ts"/>
var Base;
(function (Base) {
    var Animation = /** @class */ (function (_super) {
        __extends(Animation, _super);
        function Animation(game, posX, posY, spritesheetKey, animKey, objectType, framerate, scale) {
            var _this = _super.call(this, game, posX, posY, objectType, spritesheetKey) || this;
            if (scale)
                _this.scale.set(scale);
            if (framerate)
                _this._framerate = framerate;
            _this._animName = animKey;
            _this.anchor.set(0.5);
            _this.animations.add(animKey);
            _this.animations.currentAnim.onComplete.add(_this.onAnimComplete, _this);
            _this.kill();
            return _this;
        }
        Animation.prototype.onAnimComplete = function () {
            _super.prototype.KillObjectAndRemoveFromScene.call(this);
        };
        Animation.prototype.Spawn = function (posX, posY) {
            _super.prototype.SpawnObject.call(this, posX, posY);
        };
        Animation.prototype.Play = function () {
            this.animations.play(this._animName, this._framerate);
        };
        return Animation;
    }(Base.SceneObject));
    Base.Animation = Animation;
})(Base || (Base = {}));
var Base;
(function (Base) {
    /** Audio player using singleton pattern */
    var AudioPlayer = /** @class */ (function () {
        function AudioPlayer() {
            this._currentMusic = "";
            //About the sounds array:
            // If we need multiple instance of the same sound running and looping
            // then this does not work (or it works unexpectedly) - it always returns the same instace
            // which was added to the game only once
            // SOLUTION LATER? - create pool of sounds here and attach to object when needed
            this._sounds = {};
            this._music = {};
        }
        Object.defineProperty(AudioPlayer, "Instance", {
            //public OnFinished: Phaser.Signal = new Phaser.Signal();
            get: function () {
                return this._instance || (this._instance = new this());
            },
            enumerable: true,
            configurable: true
        });
        //****************** SOUNDS *************************/
        AudioPlayer.prototype.AddSound = function (name, sound) {
            this._sounds[name] = sound;
        };
        //** Return sound instance, which i useful when we need to save reference to playing sound */
        AudioPlayer.prototype.PlaySound = function (soundName, loopSound) {
            if (!App.Global.soundOn)
                return;
            if (this._sounds[soundName] !== undefined) {
                return this._sounds[soundName].play(undefined, undefined, undefined, loopSound);
            }
            else
                console.log("Trying to play sound " + soundName + ", but it doesnt exist");
            return null;
        };
        AudioPlayer.prototype.StopSound = function (soundName) {
            if (this._sounds[soundName] !== undefined)
                this._sounds[soundName].stop();
        };
        AudioPlayer.prototype.SetSoundVolume = function (soundName, val) {
            if (this._sounds[soundName] !== undefined)
                this._sounds[soundName].volume = val;
            else
                console.log("Trying to set volume of sound " + soundName + ", but it doesnt exist");
        };
        AudioPlayer.prototype.IsSoundPlaying = function (soundName) {
            if (this._sounds[soundName] !== undefined) {
                return this._sounds[soundName].isPlaying;
            }
            else {
                //console.log("Trying to get the sound " + soundName + ", but it doesnt exist");
                return false;
            }
        };
        //****************** MUSIC *************************/
        AudioPlayer.prototype.AddMusic = function (name, music) {
            this._music[name] = music;
        };
        AudioPlayer.prototype.PlayMusic = function (musicName, loop) {
            if (loop === void 0) { loop = true; }
            if (!App.Global.soundOn)
                return;
            // requested music already playing
            if (this._currentMusic === musicName)
                return;
            // something else playing - stop it first
            if (this._currentMusic !== null && this._currentMusic.length > 0) {
                this.StopMusic();
            }
            if (this._music[musicName] !== undefined) {
                this._currentMusic = musicName;
                this._music[musicName].loop = loop;
                this._music[musicName].play();
                // dispatch end of music
                if (!loop) {
                    this._music[musicName].onStop.addOnce(function () {
                        this.OnFinished.dispatch(musicName);
                    }, this);
                }
            }
            else
                console.log("Trying to play music " + musicName + ", but it doesnt exist");
        };
        AudioPlayer.prototype.StopMusic = function () {
            if (this._currentMusic !== null && this._currentMusic.length > 0) {
                var actualMusic = this._music[this._currentMusic];
                if (actualMusic.isPlaying)
                    actualMusic.stop();
                this._currentMusic = "";
            }
        };
        AudioPlayer.prototype.SetMusicVolume = function (musicName, val) {
            if (this._music[musicName] !== undefined)
                this._music[musicName].volume = val;
            else
                console.log("Trying to set volume of music " + musicName + ", but it doesnt exist");
        };
        AudioPlayer.prototype.PauseMusic = function () {
            if (this._currentMusic !== null && this._currentMusic.length > 0) {
                var actualMusic = this._music[this._currentMusic];
                if (actualMusic.isPlaying)
                    actualMusic.pause();
            }
        };
        AudioPlayer.prototype.ResumeMusic = function () {
            if (this._currentMusic !== null && this._currentMusic.length > 0) {
                var actualMusic = this._music[this._currentMusic];
                if (actualMusic.paused)
                    actualMusic.resume();
            }
        };
        return AudioPlayer;
    }());
    Base.AudioPlayer = AudioPlayer;
})(Base || (Base = {}));
var Base;
(function (Base) {
    var OneShotAnimInstantiator = /** @class */ (function () {
        function OneShotAnimInstantiator(game, assignedLayer) {
            this.NUM_OF_ANIMS_EXPLOSION = 7;
            this._explosionsPool = new Base.Pool(Base.Animation, this.NUM_OF_ANIMS_EXPLOSION, function () {
                return new Base.Animation(game, 0, 0, PoliceRunners.StringConstants.SPRITESHEET_EXPLOSION, 'explosion', Base.eObjectType.ANIM, 15);
            });
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._explosionsPool, assignedLayer);
        }
        OneShotAnimInstantiator.prototype.SpawnExplosion = function (posX, posY) {
            //console.log("Spawning explosion on the coords " + posX + " and " + posY);
            var anim = this._explosionsPool.GetFirstAvailable();
            if (anim != null) {
                anim.Spawn(posX, posY);
                anim.Play();
            }
            else
                console.log("TRYING TO SPAWN EXPLOSION, BUT THERE IS NOTHING IN POOL");
        };
        return OneShotAnimInstantiator;
    }());
    Base.OneShotAnimInstantiator = OneShotAnimInstantiator;
})(Base || (Base = {}));
var Base;
(function (Base) {
    var ParticleEmmiter = /** @class */ (function () {
        //private _textsParticleEmmiter: Phaser.Particles.Arcade.Emitter;
        function ParticleEmmiter(game) {
            //private _renderTexture: Phaser.RenderTexture;
            //private _visibleTexture: Phaser.Sprite;
            this._emmitingSmoke = false;
            this._inUI = false;
            this._game = game;
            //FORMER SETTINGS
            this._smokeParticleEmmiter = new Phaser.Particles.Arcade.Emitter(this._game, 0, 0, PoliceRunners.GameOptions.MAX_PARTICLES);
            this._smokeParticleEmmiter.makeParticles(PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_SMOKE_PARTICLE);
            this._smokeParticleEmmiter.gravity = new Phaser.Point(0, 0);
            // this._smokeParticleEmmiter.setScale(2, 0, 2, 0, 2000);
            // this._smokeParticleEmmiter.setAlpha(0.6, 0, 2000);
            //this._smokeParticleEmmiter = new Phaser.Particles.Arcade.Emitter(this._game, 0, 0, PoliceRunners.GameOptions.MAX_PARTICLES);
            //this._smokeParticleEmmiter.makeParticles(PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_SMOKE_PARTICLE);
            //this._smokeParticleEmmiter.gravity = new Phaser.Point(0,0);
        }
        Object.defineProperty(ParticleEmmiter.prototype, "EmmitingSmoke", {
            get: function () {
                return this._emmitingSmoke;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParticleEmmiter.prototype, "SmokeParticleEmmiter", {
            get: function () {
                return this._smokeParticleEmmiter;
            },
            enumerable: true,
            configurable: true
        });
        ParticleEmmiter.prototype.SetSmokeToUISetting = function () {
            this._smokeParticleEmmiter.setScale(0, 2.5, 0, 2.5, 500);
            this._smokeParticleEmmiter.setAlpha(0.2, 0, 500);
            this._smokeParticleEmmiter.setXSpeed(-90, 90);
            this._smokeParticleEmmiter.setYSpeed(-10, 15);
            this._inUI = true;
        };
        ParticleEmmiter.prototype.SetSmokeToInGameSetting = function () {
            this._smokeParticleEmmiter.setScale(2, 0, 2, 0, 2000);
            this._smokeParticleEmmiter.setAlpha(0.6, 0, 2000);
            this._inUI = false;
        };
        ParticleEmmiter.prototype.StartSmokeEmit = function () {
            //FORMER SETTINGS
            this._smokeParticleEmmiter.on = true;
            //this._smokeParticleEmmiter.flow(1000, 600, 3);
            if (this._inUI)
                this._smokeParticleEmmiter.flow(1000, 250, 3);
            else
                this._smokeParticleEmmiter.flow(1000, 600, 3);
            this._emmitingSmoke = true;
        };
        ParticleEmmiter.prototype.StopSmoke = function () {
            this._smokeParticleEmmiter.on = false;
            this._emmitingSmoke = false;
        };
        ParticleEmmiter.prototype.UpdateSmokeParticles = function (x, y) {
            this._smokeParticleEmmiter.x = x;
            this._smokeParticleEmmiter.y = y;
        };
        return ParticleEmmiter;
    }());
    Base.ParticleEmmiter = ParticleEmmiter;
})(Base || (Base = {}));
var Base;
(function (Base) {
    var Pool = /** @class */ (function () {
        //** When using paramList parameter, paramList must be the same length of values as our pool */
        function Pool(classType, size, newFunction, paramList) {
            if (newFunction === void 0) { newFunction = null; }
            this._pool = [];
            this._canGrow = false;
            //method used for initialization of items
            this._newFunction = null;
            this._classType = classType;
            this._newFunction = newFunction;
            this._size = size;
            if (paramList) {
                for (var i = 0; i < size; i++) {
                    this._pool.push(this.newItemWithParam(paramList[i]));
                }
            }
            else {
                for (var i = 0; i < size; i++) {
                    this._pool.push(this.newItem());
                }
            }
        }
        Object.defineProperty(Pool.prototype, "Pool", {
            get: function () {
                return this._pool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "Size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "CanGrow", {
            set: function (value) {
                this._canGrow = value;
            },
            enumerable: true,
            configurable: true
        });
        /** Get item from the start of the pool, if available - FIFO approach*/
        Pool.prototype.GetFirstAvailable = function () {
            // if (this._pool.length > 0)
            //     return this._pool.shift();
            //console.log("pool len: " + this._pool.length);
            if (this._pool.length > 0) {
                var item = this._pool[0];
                Utils.ArrayUtils.OneItemSplice(this._pool, 0);
                return item;
            }
            else if (this._canGrow) {
                console.log("Trying to get new item from the pool, but pool is empty. Pool is growing.");
                return this.newItem();
            }
            console.log(this._classType.name + ": Trying to get new item from the pool, but pool is empty. Returning null");
            //console.trace();
            return null;
        };
        Pool.prototype.GetRandom = function () {
            if (this._pool.length > 0)
                return this._pool.splice(Math.floor(Math.random() * this._pool.length), 1)[0];
            else if (this._canGrow) {
                console.log("Trying to get new item from the pool, but pool is empty. Pool is growing.");
                return this.newItem();
            }
            console.log("Trying to get new item from the pool, but pool is empty. Returning null");
            return null;
        };
        /** Adds item to the end of the pool */
        Pool.prototype.AddToPool = function (itemToAdd) {
            this._pool.push(itemToAdd); //TODO pool se muze zvetsovat donekonecna, mozna by stalo za to nejak tu velikost omezit
        };
        Pool.prototype.newItem = function () {
            if (this._newFunction !== null)
                return this._newFunction();
            else
                return new this._classType;
        };
        Pool.prototype.newItemWithParam = function (itemParam) {
            //console.log("creating new item with param " + itemParam);
            if (this._newFunction !== null)
                return this._newFunction(itemParam);
            else
                return new this._classType;
        };
        return Pool;
    }());
    Base.Pool = Pool;
})(Base || (Base = {}));
var Base;
(function (Base) {
    /** Helper class for range data type - both numbers are included in range */
    var Range = /** @class */ (function () {
        function Range(from, to) {
            this.From = from;
            this.To = to;
        }
        Range.prototype.IsInRange = function (numberToCheck) {
            return (numberToCheck >= this.From && numberToCheck <= this.To) ? true : false;
        };
        return Range;
    }());
    Base.Range = Range;
})(Base || (Base = {}));
var Gamee;
(function (Gamee_1) {
    var eLoginState;
    (function (eLoginState) {
        eLoginState[eLoginState["WAITING_FOR_CALLBACK"] = 0] = "WAITING_FOR_CALLBACK";
        eLoginState[eLoginState["LOGGED_IN"] = 1] = "LOGGED_IN";
        eLoginState[eLoginState["NOT_LOGGED_IN"] = 2] = "NOT_LOGGED_IN";
    })(eLoginState = Gamee_1.eLoginState || (Gamee_1.eLoginState = {}));
    ;
    var eCallbackState;
    (function (eCallbackState) {
        eCallbackState[eCallbackState["NOT_WAITING"] = 0] = "NOT_WAITING";
        eCallbackState[eCallbackState["WAITING"] = 1] = "WAITING";
        eCallbackState[eCallbackState["SUCCESS"] = 2] = "SUCCESS";
        eCallbackState[eCallbackState["FAILURE"] = 3] = "FAILURE";
    })(eCallbackState = Gamee_1.eCallbackState || (Gamee_1.eCallbackState = {}));
    ;
    var eGameContext;
    (function (eGameContext) {
        eGameContext[eGameContext["NORMAL"] = 0] = "NORMAL";
        eGameContext[eGameContext["BATTLE"] = 1] = "BATTLE";
        eGameContext[eGameContext["NOT_SET"] = 2] = "NOT_SET";
    })(eGameContext = Gamee_1.eGameContext || (Gamee_1.eGameContext = {}));
    ;
    var eGamePlatform;
    (function (eGamePlatform) {
        eGamePlatform["IOS"] = "ios";
        eGamePlatform["ANDROID"] = "android";
        eGamePlatform["WEB"] = "web";
        eGamePlatform["MOBILE_WEB"] = "mobile_web";
        eGamePlatform["UNDEFINED"] = "";
    })(eGamePlatform = Gamee_1.eGamePlatform || (Gamee_1.eGamePlatform = {}));
    var eMembershipType;
    (function (eMembershipType) {
        eMembershipType["BASIC"] = "basic";
        eMembershipType["VIP"] = "vip";
    })(eMembershipType = Gamee_1.eMembershipType || (Gamee_1.eMembershipType = {}));
    var ePaymentType;
    (function (ePaymentType) {
        ePaymentType[ePaymentType["GEMS"] = 0] = "GEMS";
        ePaymentType[ePaymentType["COINS"] = 1] = "COINS";
    })(ePaymentType = Gamee_1.ePaymentType || (Gamee_1.ePaymentType = {}));
    var Gamee = /** @class */ (function () {
        // -------------------------------------------------------------------------
        function Gamee(controllerType, controllerOpts, capabilities, callback) {
            this._game = null;
            this._controller = null;
            this._saveState = null;
            this._replayData = null;
            this._gameContext = eGameContext.NOT_SET;
            //List of friends
            this._socialData = [];
            this._playerData = null;
            this._battleData = null;
            this._battleCallbackState = eCallbackState.NOT_WAITING;
            this._initData = null; //TODO udelat nejaky interface pro lepsi komunikaci
            this._indices = {
                right: 0x01,
                up: 0x02,
                left: 0x04,
                down: 0x08,
                A: 0x10,
                B: 0x20,
                button: 0x40
            };
            this._pressesCache = 0;
            this._isDown = 0;
            this._justDown = 0;
            this._justUp = 0;
            this._gameRunning = false;
            this._score = 0;
            this._ghostScore = 0;
            this._gameReady = false;
            this._videoLoaded = false;
            this._playerDataRequested = false;
            this._socialDataRequested = false;
            this._battleDataRequested = false;
            this._loginState = null;
            this._gameReady = false;
            this._usedCapabilities = capabilities;
            if (window.gamee !== undefined) {
                this.setEventHandlers();
                window.gamee.gameInit(controllerType, controllerOpts, capabilities, function (error, responseData) {
                    this.initResponse(error, responseData);
                    callback();
                }.bind(this));
            }
            Gamee._instance = this;
        }
        Object.defineProperty(Gamee.prototype, "GameContext", {
            get: function () {
                return this._gameContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "IsBattle", {
            get: function () {
                return this._gameContext === eGameContext.BATTLE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "Platform", {
            get: function () {
                return this._platform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "MembershipType", {
            get: function () {
                //console.log("GAMEE!!!! Getting membership type: " + this._membershipType);
                return this._membershipType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "SocialData", {
            get: function () {
                return this._socialData;
            },
            set: function (value) {
                this._socialData = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "PlayerData", {
            get: function () {
                return this._playerData;
            },
            set: function (value) {
                this._playerData = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "BattleData", {
            get: function () {
                return this._battleData;
            },
            //just for debug purposes
            set: function (value) {
                this._battleData = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "BattleCallbackState", {
            get: function () {
                return this._battleCallbackState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "InitData", {
            get: function () {
                return this._initData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "VideoLoaded", {
            get: function () {
                return this._videoLoaded;
            },
            //TODO comment in production
            set: function (value) {
                this._videoLoaded = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "PlayerDataRequested", {
            get: function () {
                return this._playerDataRequested;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "SocialDataRequested", {
            get: function () {
                return this._socialDataRequested;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "BattleDataRequested", {
            get: function () {
                return this._battleDataRequested;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "LoginState", {
            get: function () {
                return this._loginState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "instance", {
            // -------------------------------------------------------------------------
            get: function () {
                if (Gamee._instance === null) {
                    console.error("Instance of Gamee was not created yet!");
                }
                return Gamee._instance;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        Gamee.prototype.initResponse = function (error, data) {
            if (data.platform === null)
                this._platform = eGamePlatform.UNDEFINED;
            else
                this._platform = data.platform;
            //data.membershipType = "vip";
            // if (data.playerMembershipType != null)
            //     console.log("GAMEE!!!! membershipType: " + data.playerMembershipType);
            // else console.log("GAMEE!!!! membershipType not found!");
            if (data.playerMembershipType === null)
                this._membershipType = eMembershipType.BASIC;
            else
                this._membershipType = data.playerMembershipType;
            //TODO debug!!!!
            //this._membershipType = eMembershipType.VIP;
            //console.log("GAMEE!!!! after - membershipType: " + this._membershipType);
            var soundOn = data.sound;
            if (soundOn == null) {
                soundOn = true;
            }
            this._controller = data.controller;
            this._sound = App.Global.soundOn = App.Global.soundOn = soundOn;
            if (data.saveState != null && data.saveState.length !== 0) {
                this._saveState = JSON.parse(data.saveState);
            }
            if (data.replayData != null && data.replayData.data != null && data.replayData.data.length !== 0) {
                this._replayData = JSON.parse(data.replayData.data);
            }
            if (data.gameContext === "normal")
                this._gameContext = eGameContext.NORMAL;
            else if (data.gameContext === "battle") {
                this._gameContext = eGameContext.BATTLE;
                this.OnBattleDataObtained = new Phaser.Signal();
                this.RequestBattleData();
            }
            //console.log("GAMEEtest: gamee init!!!! jaky je kontext? " + this._gameContext);
            if (data.initData != null && data.initData.length !== 0) {
                this._initData = JSON.parse(data.initData);
                Gamee_1.PlayerDataStorage.Instance.BattleSettings = this._initData;
                // console.log("GAMEEtest: gamee init!!!! raw init data? ");
                // console.log(data.initData);
                // console.log("GAMEEtest: gamee init!!!! parsed init data? ");
                // console.log(PlayerDataStorage.Instance.BattleSettings);
            }
            //TODO TESTING delete, right now it is just for testing
            // this._gameContext = eGameContext.BATTLE;
            // this._initData = {
            //     visibility: 1,
            //     oilSpills: 0,
            //     carSpeed: 0.5,
            //     copsLevel: 0
            // }
            // PlayerDataStorage.Instance.BattleSettings = this._initData;
            //TODO end of shit
            //HINT FOR FUTURE by Jakub:
            // - there is no data.playerData or data.player in this response method in current gamee.js version (2.2.0)
            // So i saved list of capabilities to the private property and check it separately:
            if (this._usedCapabilities.indexOf("socialData") > -1 && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS) {
                this.OnSocialDataObtained = new Phaser.Signal();
                this._socialDataRequested = true;
                this.RequestSocialData();
            }
            else if (this._usedCapabilities.indexOf("playerData") > -1 && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS) {
                this.OnPlayerDataObtained = new Phaser.Signal();
                this._playerDataRequested = true;
                this.RequestPlayerData();
            }
            //console.log("GAMEE_bughunt: INIT RESPONSE CALLBACK, LOAD REWARDED VIDEO SHOULD OCCUR NEXT");
            if (this._usedCapabilities.indexOf("rewardedAds") > -1 && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS) {
                //console.log("GAMEE_bughunt: CALLING LOAD REWARDED VIDEO!");
                this.LoadRewardedVideo();
            }
            //if (controllerType !== "Touch") {
            //TODO tohle zatim neni potreba delat pri Fullscreen controlleru
            //this.setKeyHandlers();
            //} else {
            //    this._controller = window.gamee.controller.requestController("Touch" /*, { enableKeyboard: true }*/);
            //    this.touchHandlers();
            //}
        };
        // -------------------------------------------------------------------------
        Gamee.prototype.setGame = function (game) {
            this._game = game;
        };
        Object.defineProperty(Gamee.prototype, "gameRunning", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._gameRunning;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "sound", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._sound;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "replayData", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._replayData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "saveState", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._saveState;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        Gamee.prototype.gameReady = function (callback) {
            window.gamee.gameReady();
            this._gameReady = true;
            if (callback)
                callback();
        };
        // -------------------------------------------------------------------------
        Gamee.prototype.setEventHandlers = function () {
            var self = this;
            window.gamee.emitter.addEventListener("pause", function () {
                //console.log("PAUSE CALLBACK");
                self.onPause();
            });
            window.gamee.emitter.addEventListener("resume", function () {
                //console.log("UNPAUSE CALLBACK");
                self.onUnpause();
            });
            window.gamee.emitter.addEventListener("mute", function () {
                //console.log("MUTE");
                self.onSoundChange(false);
            });
            window.gamee.emitter.addEventListener("unmute", function () {
                //console.log("UNMUTE");
                self.onSoundChange(true);
            });
            window.gamee.emitter.addEventListener("start", function (event) {
                //console.log("RESTART");
                self.onStart(event);
            });
        };
        // -------------------------------------------------------------------------
        Gamee.prototype.onSoundChange = function (on) {
            var state = this._game.state.getCurrentState();
            if (typeof state.onGameePause === "function") {
                state.onGameeSoundChange(on);
            }
            else {
                console.warn("No method onGameeSoundChange in state " + this._game.state.current);
            }
        };
        // -------------------------------------------------------------------------
        Gamee.prototype.onPause = function () {
            var state = this._game.state.getCurrentState();
            if (typeof state.onGameePause === "function") {
                state.onGameePause();
            }
            else {
                console.warn("No method onGameePause in state " + this._game.state.current);
            }
        };
        // -------------------------------------------------------------------------
        Gamee.prototype.onUnpause = function () {
            var state = this._game.state.getCurrentState();
            if (typeof state.onGameeUnpause === "function") {
                state.onGameeUnpause();
            }
            else {
                console.warn("No method onGameeUnpause in state " + this._game.state.current);
            }
        };
        // -------------------------------------------------------------------------
        Gamee.prototype.onStart = function (event) {
            if (!this._gameReady) {
                throw new Error("Game received 'start' event before gameReady() was called!");
            }
            this.gameStart();
            //Log.Log.msg("Gamee - onRestart", Log.Log.RED);
            var state = this._game.state.getCurrentState();
            if (typeof state.onGameeRestart === "function") {
                //console.log("event = " + event);
                var resetState = (typeof event.detail.opt_resetState === "undefined") ? false : event.detail.opt_resetState;
                var replay = (typeof event.detail.opt_replay === "undefined") ? false : event.detail.opt_replay;
                var ghostMode = (typeof event.detail.opt_ghostMode === "undefined") ? false : event.detail.opt_ghostMode;
                state.onGameeRestart(resetState, replay, ghostMode);
            }
            else {
                console.warn("No method onRestart in state " + this._game.state.current);
            }
            event.detail.callback();
        };
        Gamee.prototype.Share = function (data, callback) {
            //console.log("GameeTest: CALLING SHARE SOON! initData? " + data.initData);
            window.gamee.share(data, function (error, data) {
                if (data && data.shareStatus) {
                    console.log("GAMEEtest: shared post successfully!");
                }
                else {
                    console.log("GAMEEtest: shared post failed");
                }
                if (callback) {
                    //console.log("GAMEEtest: there is callback, calling one!");
                    callback();
                }
            });
        };
        /** get or refresh player data
         * userCallback - if defined, should obtain playerData:IplayerData
        */
        Gamee.prototype.RequestPlayerData = function (userCallback) {
            this._loginState = eLoginState.WAITING_FOR_CALLBACK;
            window.gamee.requestPlayerData(function (error, data) {
                if (data && data.player) {
                    this._playerData = data.player;
                    if (userCallback)
                        userCallback(this._playerData);
                    this._loginState = eLoginState.LOGGED_IN;
                }
                else
                    this._loginState = eLoginState.NOT_LOGGED_IN;
                this.OnPlayerDataObtained.dispatch(this._playerData);
            }.bind(this));
        };
        /** get or refresh player data
         * userCallback - if defined, should obtain playerData:IplayerData and IplayerData array of friends
        */
        Gamee.prototype.RequestSocialData = function () {
            //console.log("GameeTest: REQUESTING SOCIAL DATA!");
            this._loginState = eLoginState.WAITING_FOR_CALLBACK;
            window.gamee.requestSocial(function (error, data) {
                if (data && data.socialData && data.socialData.player) {
                    //console.log("GameeTest: CALLBACK SOCIAL DATA! PLAYER READY: " + JSON.stringify(data.socialData.player));
                    this._playerData = data.socialData.player;
                    this._loginState = eLoginState.LOGGED_IN;
                }
                else {
                    //console.log("GameeTest: CALLBACK SOCIAL DATA! PLAYER IS NOT LOGGED IN, RETURNING");
                    this._loginState = eLoginState.NOT_LOGGED_IN;
                    return;
                }
                if (data && data.socialData && data.socialData.friends) {
                    //console.log("GameeTest: CALLBACK SOCIAL DATA! FRIENDS DATA READY: " + JSON.stringify(data.socialData.friends));
                    this._socialData.length = 0;
                    data.socialData.friends.forEach(function (friend) {
                        this._socialData.push(friend);
                    }, this);
                }
                this.OnSocialDataObtained.dispatch(this._playerData, this._socialData);
            }.bind(this));
        };
        Gamee.prototype.RequestBattleData = function () {
            this._battleDataRequested = true;
            this._battleCallbackState = eCallbackState.WAITING;
            window.gamee.requestBattleData(function (error, data) {
                if (!error && data) {
                    this._battleCallbackState = eCallbackState.SUCCESS;
                    this._battleData = data.battle;
                }
                else
                    this._battleCallbackState = eCallbackState.FAILURE;
                this.OnBattleDataObtained.dispatch(this._battleData);
            }.bind(this));
        };
        Gamee.prototype.LoadRewardedVideo = function () {
            window.gamee.loadRewardedVideo(function (error, data) {
                if (data && data.videoLoaded) {
                    // video loaded and is ready to be shown using gamee.showRewardedVideo
                    this._videoLoaded = true;
                }
                else {
                    // video not available
                    this._videoLoaded = false;
                }
            }.bind(this));
        };
        Gamee.prototype.ShowRewardedVideo = function (afterVideoCallback) {
            //console.log("GAMEEtest: showing video!");
            window.gamee.showRewardedVideo(function (error, data) {
                //console.log("GAMEEtest: after video play! Played? " + data.videoPlayed);
                if (data && data.videoPlayed) {
                    //video played => user should get reward
                    afterVideoCallback(true);
                }
                else {
                    //video not played / skipped => user should not get reward
                    afterVideoCallback(false);
                }
                this._videoLoaded = false;
            }.bind(this));
        };
        Gamee.prototype.PurchaseItemWithCoins = function (params, callback) {
            window.gamee.purchaseItemWithCoins(params, function (error, data) {
                if (data && data.purchaseStatus) { // data.purchaseStatus indicates if the player bought the item or not
                    //console.log('GAMEE: coin item bought');
                    callback(true);
                }
                else {
                    //console.log('GAMEE: coin item not bought');
                    callback(false);
                }
                if (data.coinsLeft) { // data.coinsLeft indicates remaining amount of coins of player
                    //console.log("GAMEE: setting coins left: " + data.coinsLeft);
                    this._playerData.coins = data.coinsLeft;
                }
            }.bind(this));
        };
        Gamee.prototype.PurchaseItemWithGems = function (params, callback) {
            window.gamee.purchaseItemWithGems(params, function (error, data) {
                if (data && data.purchaseStatus) { // data.purchaseStatus indicates if the player bought the item or not
                    //console.log('GAMEE: gem item bought');
                    callback(true);
                }
                else {
                    //console.log('GAMEE: gem item not bought');
                    callback(false);
                }
                if (data.gemsLeft) { // data.gemsLeft indicates remaining amount of gems of player
                    //console.log("GAMEE: setting gems left: " + data.gemsLeft);
                    this._playerData.gems = data.gemsLeft;
                }
            }.bind(this));
        };
        Gamee.prototype.ShowSubscribeDialog = function (callback) {
            window.gamee.showSubscribeDialog(function (error, data) {
                if (!error && data && data.vipPurchased) {
                    this._membershipType = eMembershipType.VIP;
                    callback(true);
                    return;
                }
                if (error)
                    console.warn("VIP subscribe purchase error!");
                callback(false);
            }.bind(this));
        };
        Object.defineProperty(Gamee.prototype, "score", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._score;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        Gamee.prototype.setScore = function (score, ghost) {
            if (ghost === void 0) { ghost = false; }
            if (!ghost) {
                this._score = score;
                window.gamee.updateScore(score);
            }
            else {
                this._ghostScore = score;
                window.gamee.updateScore(score, true);
            }
        };
        //// -------------------------------------------------------------------------
        //public addScore(score: number): void {
        //    this.score += score;
        //    //console.log("gamee score = " + this.score);
        //}
        // -------------------------------------------------------------------------
        Gamee.prototype.gameStart = function () {
            //Log.Log.msg("Gamee - game start");
            if (this._gameRunning) {
                console.warn("Gamee game is already running");
                //Log.Log.msg("Gamee - game start - Gamee game is already running", Log.Log.RED);
                //throw new Error("Game got another 'start' event before currently running game was finished with gameOver()!");
                //return;
            }
            this._gameRunning = true;
        };
        // -------------------------------------------------------------------------
        Gamee.prototype.gameOver = function (replayData, callback, saveState) {
            //Log.Log.msg("Gamee - game over");
            if (!this._gameRunning) {
                console.warn("Gamee game is not running");
                //Log.Log.msg("Gamee - game start - Gamee game is not running");
                //throw new Error("Called gameOver(), but no game is running!");
                //return;
            }
            this._gameRunning = false;
            if (replayData != null) {
                replayData = {
                    data: JSON.stringify(replayData)
                };
            }
            //if (replayData == null) {
            //    console.log("*** saving replay data = " + replayData);
            //} else {
            //    console.log("*** saving replay data = " + replayData.data);
            //}
            window.gamee.gameOver(replayData, callback, saveState);
        };
        // -------------------------------------------------------------------------
        Gamee.prototype.gameSave = function (dataString, opt_share, callback) {
            //console.log("gamee.gameSave() - saving data:");
            //console.log(dataString);
            window.gamee.gameSave(dataString, opt_share, callback);
        };
        Gamee.prototype.logGameEvent = function (eventName, eventValue) {
            //console.log("Logging event " + eventName + " with value " + eventValue);
            window.gamee.logEvent(eventName, eventValue);
        };
        Gamee._instance = null;
        return Gamee;
    }());
    Gamee_1.Gamee = Gamee;
})(Gamee || (Gamee = {}));
var Gamee;
(function (Gamee) {
    //class used for handling player interaction with his friends in Gamee
    var GameeSocialDataManager = /** @class */ (function () {
        function GameeSocialDataManager() {
            this.OnPlayerAvatarsLoaded = new Phaser.Signal();
            this._defeatedFriends = [];
            this._loadedAvatarsArr = [];
        }
        Object.defineProperty(GameeSocialDataManager, "Instance", {
            get: function () {
                return this._instance || (this._instance = new this());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameeSocialDataManager.prototype, "NextFriend", {
            get: function () {
                return this._nextFriend;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameeSocialDataManager.prototype, "DefeatedFriends", {
            get: function () {
                return this._defeatedFriends;
            },
            enumerable: true,
            configurable: true
        });
        //this needs to be called first!
        GameeSocialDataManager.prototype.Initialize = function (game) {
            this._game = game;
        };
        /**
         * Phaser avatars loading
         */
        //TODO change this to private
        GameeSocialDataManager.prototype.parseSocialData = function (playerData, socialData) {
            //this._testSocialData = socialData;//todo pak mozno odstranit
            //sort
            socialData.sort(function (a, b) { return (a.highScore > b.highScore) ? -1 : ((b.highScore > a.highScore) ? 1 : 0); });
            //console.log("GameeTest: GAMEE FRIENDS MANAGER, parsing social data");
            if (playerData.avatar != null && this._loadedAvatarsArr.indexOf(playerData.name) == -1)
                this._game.load.image(playerData.name, playerData.avatar);
            this._reloadAgain = false;
            var numOfAvatarsToLoad = 0;
            for (var i = 0; i < socialData.length; i++) {
                if (socialData[i].avatar != null && this._loadedAvatarsArr.indexOf(socialData[i].name) == -1) {
                    this._game.load.image(socialData[i].name, socialData[i].avatar);
                    numOfAvatarsToLoad++;
                    if (numOfAvatarsToLoad >= 5)
                        break;
                }
            }
            //console.log("GAMEEtest we are going to load " + numOfAvatarsToLoad + "avatars");
            if (numOfAvatarsToLoad > 0) {
                this._game.load.onFileComplete.add(this.fileLoadComplete, this);
                this._game.load.onLoadComplete.add(this.loadQueueComplete, this);
                this._game.load.start();
            }
            else
                this.OnPlayerAvatarsLoaded.dispatch();
        };
        GameeSocialDataManager.prototype.fileLoadComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            if (success)
                this._loadedAvatarsArr.push(cacheKey);
            else
                this._reloadAgain = true;
            //console.log("GameeTest: GAMEE FRIENDS MANAGER, avatar louded: " + cacheKey + ", is it succes? " + success);
            //console.log("fukin avatar louded: " + cacheKey);
        };
        GameeSocialDataManager.prototype.loadQueueComplete = function () {
            //console.log("GameeTest: GAMEE FRIENDS MANAGER, load queue completed ");
            this._game.load.onFileComplete.remove(this.fileLoadComplete, this);
            this._game.load.onLoadComplete.remove(this.loadQueueComplete, this);
            if (this._reloadAgain) {
                //console.log("GameeTest: GAMEE FRIENDS MANAGER, there was null on data, reloading after 5s");
                this._game.time.events.add(5000, Gamee.Gamee.instance.RequestSocialData, this);
            }
            else {
                //console.log("GameeTest: GAMEE FRIENDS MANAGER, tutto fresco, callback!");
                this.OnPlayerAvatarsLoaded.dispatch();
            }
        };
        GameeSocialDataManager.prototype.Reset = function () {
            this._defeatedFriends = [];
        };
        GameeSocialDataManager.prototype.AddCurrentFriendToDefeated = function () {
            if (this._nextFriend != null) {
                //console.log("GameeTest: GAMEE FRIENDS MANAGER, friend defeated: " + this._nextFriend.name);
                this._defeatedFriends.push(this._nextFriend.name);
                if (this._defeatedFriends.length > 5)
                    this._defeatedFriends.shift();
            }
        };
        GameeSocialDataManager.prototype.GetNextFriend = function (currentPlayerScore) {
            this._nextFriend = null;
            //FOR testing on PC - pak smazat testSocialData
            // for (let i = 0; i < this._testSocialData.length; i++) {
            //     if (this._testSocialData[i].highScore > currentPlayerScore) {
            //         this._nextFriend = this._testSocialData[i];
            //         //console.log("getting fucking score of " + this._testSocialData[i].name);
            //         break;
            //     }
            // }
            //FOR testing on mobile with GAMEE
            //console.log("GameeTest: GAMEE FRIENDS MANAGER, getting next friend");
            for (var i = 0; i < Gamee.Gamee.instance.SocialData.length; i++) {
                if (Gamee.Gamee.instance.SocialData[i].highScore > currentPlayerScore) {
                    this._nextFriend = Gamee.Gamee.instance.SocialData[i];
                    //console.log("getting fucking score of " + Gamee.Gamee.instance.SocialData[i].name);
                    break;
                }
            }
            return this._nextFriend;
        };
        return GameeSocialDataManager;
    }());
    Gamee.GameeSocialDataManager = GameeSocialDataManager;
})(Gamee || (Gamee = {}));
var Gamee;
(function (Gamee) {
    var PlayerDataStorage = /** @class */ (function () {
        function PlayerDataStorage() {
            this.OnCurrencyChanged = new Phaser.Signal();
            this._ownedCars = [];
        }
        Object.defineProperty(PlayerDataStorage, "Instance", {
            get: function () {
                return this._instance || (this._instance = new this());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "BattleSettings", {
            get: function () {
                return this._battleSettings;
            },
            set: function (value) {
                this._battleSettings = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "Level", {
            get: function () {
                return this._level;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "CurrencyAmount", {
            get: function () {
                return this._currencyAmount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "UsedCar", {
            get: function () {
                return this._usedCar;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "LastVideoUnlockedCarLvl", {
            get: function () {
                return this._lastVideoUnlockedCarLvl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "OwnedCars", {
            get: function () {
                return this._ownedCars;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "NewCarsUnlocked", {
            get: function () {
                return this._newCarsUnlocked;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "TutorialPlayed", {
            get: function () {
                return this._tutorialPlayed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "Boosters", {
            get: function () {
                return this._boosters;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "VipScreenShown", {
            get: function () {
                return this._vipScreenShown;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "BattleScreenPurchased", {
            get: function () {
                return this._battleCreatorPurchased;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerDataStorage.prototype, "LastDailyRace", {
            get: function () {
                return this._lastDailyRace;
            },
            enumerable: true,
            configurable: true
        });
        //assign basic car to the player on first run
        PlayerDataStorage.prototype.InitDataFirstTime = function () {
            //console.log("GAMEEtest: INIT DATA FIRST TIME. THIS IS NOT WHAT WE WANT.");
            this._level = 0;
            this._currencyAmount = 0;
            this.AddToOwnedCars(0, false);
            this._usedCar = 0;
            this._newCarsUnlocked = false;
            this._tutorialPlayed = false;
            this._lastVideoUnlockedCarLvl = 0;
            this._vipScreenShown = false;
            this._battleCreatorPurchased = false;
            this._boosters = [];
            //put there 0 as init value
            this._lastDailyRace = 0;
        };
        PlayerDataStorage.prototype.GetGivenCar = function (carID) {
            for (var i = 0, l = this._ownedCars.length; i < l; i++) {
                if (this._ownedCars[i].id === carID)
                    return this._ownedCars[i];
            }
            return null;
        };
        PlayerDataStorage.prototype.LevelUp = function (save) {
            this._level++;
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.AddToOwnedCars = function (carID, save) {
            if (this.GetGivenCar(carID) != null) {
                return;
            }
            this._ownedCars.push({ id: carID, level: 0 });
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.RemoveFromOwnedCars = function (carID, save) {
            if (carID == this._usedCar)
                this._usedCar = 0;
            this._ownedCars = this._ownedCars.filter(function (item) {
                return item.id !== carID;
            });
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.SetLastDailyRaceTime = function (timeStamp, save) {
            this._lastDailyRace = timeStamp;
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.SetUsedCar = function (newCarID, save) {
            this._usedCar = newCarID;
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.SetNewCarsUnlocked = function (val, save) {
            this._newCarsUnlocked = val;
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.SetTutorialPlayed = function (val, save) {
            this._tutorialPlayed = val;
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.SetLastVideoUnlockedCarLvl = function (val, save) {
            this._lastVideoUnlockedCarLvl = val;
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.SetVipScreenShown = function (val, save) {
            this._vipScreenShown = val;
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.SetBattleCreationPurchased = function (val, save) {
            this._battleCreatorPurchased = val;
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.SetCurrencyAmount = function (newVal, save) {
            this._currencyAmount = newVal;
            this.OnCurrencyChanged.dispatch(this._currencyAmount);
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.UpgradeCarLevel = function (carID, save) {
            var upgraded = false;
            for (var i = 0, l = this._ownedCars.length; i < l; i++) {
                if (this._ownedCars[i].id === carID) {
                    this._ownedCars[i].level++;
                    upgraded = true;
                    break;
                }
            }
            if (!upgraded)
                console.error("Cannot find car to upgrade in player storage!!!!");
            if (save)
                this.SavePlayerData();
        };
        /** Save data to GAMEE */
        PlayerDataStorage.prototype.SavePlayerData = function () {
            if (App.Global.GAMEE)
                Gamee.Gamee.instance.gameSave(this.GetDataInString());
        };
        PlayerDataStorage.prototype.GetDataInString = function () {
            var dataToSave = {
                level: this._level,
                currency: this._currencyAmount,
                usedCar: this._usedCar,
                ownedCars: this._ownedCars,
                newCarsUnlocked: this._newCarsUnlocked,
                tutorialPlayed: this._tutorialPlayed,
                vipScreenShown: this._vipScreenShown,
                battleCreatorPurchased: this._battleCreatorPurchased,
                lastVideoUnlockedCarLvl: this._lastVideoUnlockedCarLvl,
                lastDailyRace: this._lastDailyRace,
                //boosters: JSON.stringify(this._boosters)
                boosters: this._boosters
            };
            return JSON.stringify(dataToSave);
        };
        PlayerDataStorage.prototype.LoadData = function (saveState) {
            //console.log("GAMEEtest: LOADING SAVED DATA! SEE IT BELOW: ");
            //console.log(saveState);
            this._level = saveState.level == undefined ? 0 : saveState.level;
            this._currencyAmount = saveState.currency == undefined ? 0 : saveState.currency;
            this._usedCar = saveState.usedCar == undefined ? 0 : saveState.usedCar;
            this._newCarsUnlocked = saveState.newCarsUnlocked == undefined ? false : saveState.newCarsUnlocked;
            this._ownedCars = saveState.ownedCars == undefined ? [{ id: 0, level: 0 }] : saveState.ownedCars;
            this._tutorialPlayed = saveState.tutorialPlayed == undefined ? false : saveState.tutorialPlayed;
            this._vipScreenShown = saveState.vipScreenShown == undefined ? false : saveState.vipScreenShown;
            this._battleCreatorPurchased = saveState.battleCreatorPurchased == undefined ? false : saveState.battleCreatorPurchased;
            this._lastVideoUnlockedCarLvl = saveState.lastVideoUnlockedCarLvl == undefined ? 0 : saveState.lastVideoUnlockedCarLvl;
            this._lastDailyRace = saveState.lastDailyRace == undefined ? 0 : saveState.lastDailyRace;
            //this._boosters = saveState.boosters == undefined ? [] : JSON.parse(saveState.boosters);
            this._boosters = saveState.boosters == undefined ? [] : saveState.boosters;
        };
        PlayerDataStorage.prototype.BuyBooster = function (type, time, save) {
            this._boosters.push({
                boosterType: type,
                timeOfPurchase: time
            });
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.RemoveBooster = function (type, save) {
            for (var i = this._boosters.length - 1; i >= 0; i--) {
                if (type == this._boosters[i].boosterType)
                    this._boosters.splice(i, 1);
            }
            if (save)
                this.SavePlayerData();
        };
        PlayerDataStorage.prototype.IsBoosterActive = function (boosterType) {
            if (this._boosters == null)
                return false;
            for (var i = 0; i < this._boosters.length; i++) {
                if (boosterType == this._boosters[i].boosterType)
                    return true;
            }
            return false;
        };
        PlayerDataStorage.prototype.GetBoosterTimestamp = function (boosterType) {
            for (var i = 0; i < this._boosters.length; i++) {
                if (boosterType == this._boosters[i].boosterType)
                    return this._boosters[i].timeOfPurchase;
            }
        };
        //TEST METHOD
        PlayerDataStorage.prototype.GetDummyTestData = function () {
            return JSON.stringify({
                level: this._level,
                currency: this._currencyAmount,
                usedCar: this._usedCar,
                ownedCars: this._ownedCars
            });
        };
        return PlayerDataStorage;
    }());
    Gamee.PlayerDataStorage = PlayerDataStorage;
})(Gamee || (Gamee = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var BehindTheCarObjGenerator = /** @class */ (function () {
        function BehindTheCarObjGenerator(game, assignedLayer) {
            this._game = game;
            this._skidMarksPool = new Base.Pool(Phaser.Sprite, 600, function () {
                // add empty sprite with body
                var skidMark = new Base.SceneObject(game, 0, 0, Base.eObjectType.SKID_MARK, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_TIRE_MARKS);
                skidMark.anchor.setTo(0.5);
                skidMark.kill();
                return skidMark;
            });
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._skidMarksPool, assignedLayer);
            this._oilSpillsPool = new Base.Pool(Phaser.Sprite, 70, function () {
                // add empty sprite with body
                var oilSpill = new Base.SceneObject(game, 0, 0, Base.eObjectType.POWER_UP_ACTIVATED, PoliceRunners.StringConstants.ATLAS_POWER_UPS, PoliceRunners.StringConstants.AK_PU_OIL_FRAMES + this._game.rnd.integerInRange(1, 3));
                this._game.physics.enable(oilSpill, Phaser.Physics.P2JS);
                oilSpill.body.data.shapes[0].sensor = true;
                oilSpill.anchor.setTo(0.5);
                //oilSpill.body.debug = true;
                oilSpill.kill();
                return oilSpill;
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._oilSpillsPool, assignedLayer);
            this._spikesPool = new Base.Pool(Phaser.Sprite, 70, function () {
                // add empty sprite with body
                var spike = new Base.SceneObject(game, 0, 0, Base.eObjectType.POWER_UP_ACTIVATED, PoliceRunners.StringConstants.ATLAS_POWER_UPS, PoliceRunners.StringConstants.AK_PU_SPIKES);
                this._game.physics.enable(spike, Phaser.Physics.P2JS);
                spike.body.data.shapes[0].sensor = true;
                spike.anchor.setTo(0.5);
                //spike.body.debug = true;
                spike.kill();
                return spike;
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._spikesPool, assignedLayer);
        }
        Object.defineProperty(BehindTheCarObjGenerator.prototype, "SkidMarksPool", {
            get: function () {
                return this._skidMarksPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BehindTheCarObjGenerator.prototype, "OilSpillsPool", {
            get: function () {
                return this._oilSpillsPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BehindTheCarObjGenerator.prototype, "SpikesPool", {
            get: function () {
                return this._spikesPool;
            },
            enumerable: true,
            configurable: true
        });
        BehindTheCarObjGenerator.prototype.CreateSkidmark = function (posX, posY, angle) {
            var skidmark = this._skidMarksPool.GetFirstAvailable();
            if (skidmark != null) {
                skidmark.SpawnObject(posX, posY);
                skidmark.angle = angle;
                skidmark.alpha = 1;
                var tween1 = this._game.add.tween(skidmark).to({ alpha: 0 }, 500, "Linear", true, 1000);
                tween1.onComplete.add(function () { this.borra_clear(skidmark); }, this);
            }
        };
        BehindTheCarObjGenerator.prototype.CreateOilSpill = function (posX, posY, rotation, distBehindCar) {
            var oilSpill = this._oilSpillsPool.GetFirstAvailable();
            if (oilSpill != null) {
                var placementRotation = rotation + 1.57079633;
                posX = posX + distBehindCar * Math.cos(placementRotation);
                posY = posY + distBehindCar * Math.sin(placementRotation);
                //oilSpill.anchor.set(0,0.5);
                oilSpill.SpawnObject(posX, posY);
                oilSpill.body.rotation = rotation;
                oilSpill.alpha = 1;
                var duration = PoliceRunners.GameOptions.OIL_SPILL_DURATION / 5;
                var delay = PoliceRunners.GameOptions.OIL_SPILL_DURATION - duration;
                var tween1 = this._game.add.tween(oilSpill).to({ alpha: 0 }, duration, "Linear", true, delay);
                tween1.onComplete.add(function () { this.borra_clear(oilSpill); }, this);
            }
        };
        BehindTheCarObjGenerator.prototype.CreateSpike = function (posX, posY, rotation, distBehindCar) {
            var spike = this._spikesPool.GetFirstAvailable();
            if (spike != null) {
                //rotation += 1.57079633;
                var placementRotation = rotation + 1.57079633;
                posX = posX + distBehindCar * Math.cos(placementRotation);
                posY = posY + distBehindCar * Math.sin(placementRotation);
                //oilSpill.anchor.set(0,0.5);
                spike.SpawnObject(posX, posY);
                spike.body.rotation = rotation;
                spike.alpha = 1;
                var duration = PoliceRunners.GameOptions.SPIKE_STRIP_DURATION / 5;
                var delay = PoliceRunners.GameOptions.SPIKE_STRIP_DURATION - duration;
                var tween1 = this._game.add.tween(spike).to({ alpha: 0 }, duration, "Linear", true, delay);
                tween1.onComplete.add(function () { this.spike_clear(spike); }, this);
            }
        };
        BehindTheCarObjGenerator.prototype.borra_clear = function (a) {
            a.KillObjectAndRemoveFromScene();
        };
        BehindTheCarObjGenerator.prototype.spike_clear = function (a) {
            //console.log("clearing spike!");
            a.KillObjectAndRemoveFromScene();
        };
        return BehindTheCarObjGenerator;
    }());
    PoliceRunners.BehindTheCarObjGenerator = BehindTheCarObjGenerator;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var DailyRaceType;
    (function (DailyRaceType) {
        DailyRaceType[DailyRaceType["NONE"] = 0] = "NONE";
        DailyRaceType[DailyRaceType["COMBO_RUN"] = 1] = "COMBO_RUN";
        DailyRaceType[DailyRaceType["COP_HUNT"] = 2] = "COP_HUNT";
        //TIME_CHALLENGE,
        DailyRaceType[DailyRaceType["RACE"] = 3] = "RACE";
        //BOSS
    })(DailyRaceType = PoliceRunners.DailyRaceType || (PoliceRunners.DailyRaceType = {}));
    /**
     * This class will hold data needed for mission completion (it will return needed values for given mission type and player level)
     */
    var DailyRaceManager = /** @class */ (function () {
        function DailyRaceManager(game, uiHandler, layer) {
            this._currentRaceType = DailyRaceType.NONE;
            this._UIhandler = uiHandler;
            this._game = game;
            this._checkpointLayer = layer;
            this._checkpointSprite = null;
        }
        Object.defineProperty(DailyRaceManager.prototype, "NumOfComboToAchieve", {
            get: function () {
                return this._numOfComboToAchieve;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DailyRaceManager.prototype, "NumOfCopsToAchieve", {
            get: function () {
                return this._numOfCopsToAchieve;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DailyRaceManager.prototype, "TimeLimit", {
            get: function () {
                return this._timeLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DailyRaceManager.prototype, "CurrentRaceType", {
            get: function () {
                return this._currentRaceType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DailyRaceManager.prototype, "CheckpointsTotal", {
            get: function () {
                return this._checkpointsTotal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DailyRaceManager.prototype, "CurrentCheckpoint", {
            get: function () {
                return this._currentCheckpoint;
            },
            set: function (value) {
                this._currentCheckpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DailyRaceManager.prototype, "CheckpointSprite", {
            get: function () {
                return this._checkpointSprite;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DailyRaceManager.prototype, "MissionCompleted", {
            get: function () {
                return this._missionCompleted;
            },
            enumerable: true,
            configurable: true
        });
        //TODO give me valueNum!
        DailyRaceManager.prototype.SetMission = function (missionType, valueNum) {
            this._currentRaceType = missionType;
            switch (this._currentRaceType) {
                case DailyRaceType.COMBO_RUN:
                    this._numOfComboToAchieve = valueNum;
                    //this._UIhandler.ShowComboMissionText(this._numOfComboToAchieve);
                    break;
                case DailyRaceType.COP_HUNT:
                    this._numOfCopsToAchieve = valueNum;
                    //this._UIhandler.ShowCopHuntMissionText(this._numOfCopsToAchieve, 0);
                    break;
                // case MissionType.TIME_CHALLENGE:
                //     this._timeLimit = 10000;
                //     this._UIhandler.ShowTimeLimitMissionText(this._timeLimit);
                //     break;
                case DailyRaceType.RACE:
                    //this._checkpointsTotal = Math.max(Math.ceil(Math.random() * Math.ceil(valueNum)),1); // 1 - 16
                    this._checkpointsTotal = valueNum;
                    this._currentCheckpoint = 0;
                    //this._UIhandler.ShowRaceMissionText(this._checkpointsTotal);
                    //this.GenerateCheckpoint();
                    break;
                // case MissionType.BOSS:
                //     break;
            }
            this.generateCurrentRaceHeadline(missionType, valueNum);
        };
        DailyRaceManager.prototype.CompleteMission = function (success) {
            if (this._missionObjectiveDisplay) {
                this._missionObjectiveDisplay.destroy();
                this._missionObjectiveDisplay = null;
            }
            // if (success)
            //     this._UIhandler.ShowMissionPassedText(true);
            this._missionCompleted = success;
        };
        //called only when reset occurs during daily race
        DailyRaceManager.prototype.OnResetInterruption = function () {
            if (this._missionObjectiveDisplay) {
                this._missionObjectiveDisplay.destroy();
                this._missionObjectiveDisplay = null;
            }
            if (this._missionHeadline) {
                this._missionHeadline.DestroyTweens();
                this._missionHeadline = null;
            }
            this.DestroyCheckpointSprite();
        };
        DailyRaceManager.prototype.Reset = function () {
            this._currentRaceType = DailyRaceType.NONE;
            this._missionCompleted = false;
        };
        //Called when the checkpoint is generated or when checkpoint was hitted
        DailyRaceManager.prototype.GenerateCheckpoint = function (playerCar) {
            //console.log("GENERATING NEW FUCKIN CHECKPOIINT!!!!");
            var nextPos = this.generateNextCpPosition(playerCar);
            if (this._checkpointSprite == null)
                this.createCheckpointSprite();
            //console.log(nextPos);
            if (!this._checkpointSprite.alive) {
                //console.log("A");
                this._checkpointSprite.SpawnObject(nextPos.x, nextPos.y);
            }
            else {
                //console.log("B");
                this._checkpointSprite.body.x = nextPos.x;
                this._checkpointSprite.body.y = nextPos.y;
            }
        };
        DailyRaceManager.prototype.DestroyCheckpointSprite = function () {
            if (this._checkpointSprite != null) {
                this._checkpointSprite.destroy();
                this._checkpointSprite = null;
            }
        };
        DailyRaceManager.prototype.UpdateDailyRaceCounter = function (newNum, saveOnlyMaxVal) {
            if (this._missionObjectiveDisplay != null)
                this._missionObjectiveDisplay.UpdateCounter(newNum, saveOnlyMaxVal);
        };
        DailyRaceManager.prototype.createCheckpointSprite = function () {
            this._checkpointSprite = new Base.SceneObject(this._game, 0, 0, Base.eObjectType.RACE_CHECKPOINT, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, PoliceRunners.StringConstants.AK_DR_CHECKPOINT);
            this._game.physics.enable(this._checkpointSprite, Phaser.Physics.P2JS);
            this._checkpointSprite.body.setCircle(this._checkpointSprite.width * .3);
            this._checkpointSprite.body.data.shapes[0].sensor = true;
            this._checkpointSprite.anchor.set(0.5);
            this._checkpointSprite.AssignedLayer = this._checkpointLayer;
            //this._checkpointSprite.body.debug = true;
            var cpText = this._game.add.bitmapText(0, 0, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "CHECKPOINT", 18);
            cpText.anchor.set(0.5);
            this._checkpointSprite.addChild(cpText);
            this._checkpointSprite.kill();
        };
        DailyRaceManager.prototype.generateCurrentRaceHeadline = function (missionType, goalNum) {
            //console.log("generating fakin headline!");
            this._missionHeadline = new PoliceRunners.UI.DailyRaceHeadline(this._game, missionType, goalNum);
            this._missionHeadline.OnHeadlineHidden.add(function () {
                this._missionObjectiveDisplay = new PoliceRunners.UI.DailyRaceCounter(this._game, missionType, goalNum);
            }, this);
        };
        DailyRaceManager.prototype.generateNextCpPosition = function (playerCar) {
            var radians = this._game.rnd.realInRange(0, 2 * Math.PI);
            //console.log("generating CP ");
            //return new Phaser.Point(200, 400);
            return new Phaser.Point(playerCar.x + PoliceRunners.GameOptions.RACE_CHECKPOINTS_DISTANCE * Math.cos(radians), playerCar.y + PoliceRunners.GameOptions.RACE_CHECKPOINTS_DISTANCE * Math.sin(radians));
        };
        return DailyRaceManager;
    }());
    PoliceRunners.DailyRaceManager = DailyRaceManager;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var ObjectGenerator = /** @class */ (function () {
        //private _availablePowerUps: ePowerUpType[] = [ePowerUpType.MYSTERY_BOX, ePowerUpType.MYSTERY_BOX, ePowerUpType.MYSTERY_BOX, ePowerUpType.MYSTERY_BOX];
        function ObjectGenerator(game, gameSettingsHandler, assignedLayer, bgLayer, frontLayer) {
            this.POLICE_INSTANCES = 10;
            this.POWERUP_GEN_COEFF = 4;
            this.OIL_SPILL_GEN_COEFF = 1;
            //private readonly POWERUP_GEN_COEFF: number = 0;
            this.REGULAR_DIST_FROM_BORDER = 150;
            this.OPPOSITE_DIR_DIST_FROM_BORDER_UD = 700;
            this.OPPOSITE_DIR_DIST_FROM_BORDER_LR = 1000;
            this._addedSpace = 0;
            this._availablePoliceCars = [];
            //private _currentStageThresholds: number[];
            this._currentThresholdIndex = 0;
            //time
            this._lastTimeCheck = 0;
            this._timeInOneDir = 0;
            this._lastDir = null;
            //array used with weighted pick - earlier elements are picked up with bigger probability
            // private _availablePowerUps: eActivatedPowerUpType[] = [eActivatedPowerUpType.DOUBLE_SCORE, eActivatedPowerUpType.NITRO, eActivatedPowerUpType.SHIELD, eActivatedPowerUpType.EXTRA_LIFE,
            //   eActivatedPowerUpType.OIL_SPILL, eActivatedPowerUpType.SPIKE_STRIP, eActivatedPowerUpType.CARMAGEDDON];
            this._availablePowerUpsCampaign = [PoliceRunners.ePowerUpType.MONEY, PoliceRunners.ePowerUpType.MONEY, PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX];
            this._availablePowerUpsBooster = [PoliceRunners.ePowerUpType.MONEY, PoliceRunners.ePowerUpType.MONEY, PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX];
            this._availablePowerUpsBattle = [PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX, PoliceRunners.ePowerUpType.MYSTERY_BOX];
            this._game = game;
            this._gameSettingsHandler = gameSettingsHandler;
            this._assignedLayer = assignedLayer;
            this._bgLayer = bgLayer;
            this._frontLayer = frontLayer;
            //TODO uncomment when we need some constants
            //this.precomputeConstants();
            //init pools
            this.initPoliceCarPool(1, PoliceRunners.StringConstants.KEY_POLICE1);
            this.initPoliceCarPool(2, PoliceRunners.StringConstants.KEY_POLICE2);
            this.initPoliceCarPool(3, PoliceRunners.StringConstants.KEY_POLICE3);
            this.initPoliceCarPool(4, PoliceRunners.StringConstants.KEY_POLICE4);
            this.initPoliceCarPool(5, PoliceRunners.StringConstants.KEY_POLICE5);
            this.initPowerUpPool(PoliceRunners.StringConstants.AK_PU_MONEY, PoliceRunners.ePowerUpType.MONEY);
            this.initPowerUpPool(PoliceRunners.StringConstants.AK_PU_MYSTERY_BOX_IMG, PoliceRunners.ePowerUpType.MYSTERY_BOX);
            //It is not really needed now, but it is good for debug purposes
            // this.initItemsID(this._police1CarsPool.Pool, 1);
            // this.initItemsID(this._police2CarsPool.Pool, this._police1CarsPool.Pool.length);
            // this.initItemsID(this._police3CarsPool.Pool, this._police2CarsPool.Pool.length);
            // this.initItemsID(this._police4CarsPool.Pool, this._police3CarsPool.Pool.length);
            // this.initItemsID(this._police5CarsPool.Pool, this._police4CarsPool.Pool.length);
            //this._availablePowerUps = Gamee.Gamee.instance.IsBattle ? this._availablePowerUpsBattle : this._availablePowerUpsCampaign;
            if (App.Global.GAMEE) {
                this._availablePowerUps = Gamee.Gamee.instance.IsBattle ? this._availablePowerUpsBattle : this._availablePowerUpsCampaign;
            }
            else
                this._availablePowerUps = this._availablePowerUpsCampaign;
            //TODO delete!
            //this._availablePowerUps = this._availablePowerUpsCampaign;
            this._mysteryBoxTextPool = new Base.Pool(PoliceRunners.PowerUpText, 5, function () {
                return new PoliceRunners.PowerUpText(this._game);
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._mysteryBoxTextPool, frontLayer);
        }
        Object.defineProperty(ObjectGenerator.prototype, "Police1CarsPool", {
            get: function () {
                return this._police1CarsPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectGenerator.prototype, "Police2CarsPool", {
            get: function () {
                return this._police2CarsPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectGenerator.prototype, "Police3CarsPool", {
            get: function () {
                return this._police3CarsPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectGenerator.prototype, "Police4CarsPool", {
            get: function () {
                return this._police4CarsPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectGenerator.prototype, "Police5CarsPool", {
            get: function () {
                return this._police5CarsPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectGenerator.prototype, "MoneyPickupPool", {
            get: function () {
                return this._moneyPickupPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectGenerator.prototype, "MysteryBoxPool", {
            get: function () {
                return this._mysteryBoxPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectGenerator.prototype, "BattleOilSpillsPool", {
            get: function () {
                return this._battleOilSpillsPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectGenerator.prototype, "CurrentPoliceThresholds", {
            get: function () {
                return this._currentPoliceThresholds;
            },
            enumerable: true,
            configurable: true
        });
        ObjectGenerator.prototype.initPoliceCarPool = function (policeId, jsonKey) {
            //console.log("init voe!");
            var carInfo = this._gameSettingsHandler.GetPoliceCarInfo(jsonKey);
            var poolToInit = new Base.Pool(PoliceRunners.PoliceCar, this.POLICE_INSTANCES, function () {
                return new PoliceRunners.PoliceCar(this._game, 0, 0, policeId, carInfo.damage, carInfo.speed, carInfo.score, carInfo.angleMult);
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(poolToInit, this._assignedLayer); //TODO tahle metoda by mela byt na samotnem poolu
            switch (jsonKey) {
                case PoliceRunners.StringConstants.KEY_POLICE1:
                    this._police1CarsPool = poolToInit;
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE2:
                    this._police2CarsPool = poolToInit;
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE3:
                    this._police3CarsPool = poolToInit;
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE4:
                    this._police4CarsPool = poolToInit;
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE5:
                    this._police5CarsPool = poolToInit;
                    break;
                default:
                    break;
            }
        };
        ObjectGenerator.prototype.initPowerUpPool = function (spriteKey, type) {
            var poolToInit = new Base.Pool(PoliceRunners.PowerUp, type == PoliceRunners.ePowerUpType.MONEY ? 22 : 6, function () {
                return new PoliceRunners.PowerUp(this._game, type, spriteKey);
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(poolToInit, this._assignedLayer); //TODO tahle metoda by mela byt na samotnem poolu
            switch (type) {
                case PoliceRunners.ePowerUpType.MYSTERY_BOX:
                    this._mysteryBoxPool = poolToInit;
                    break;
                case PoliceRunners.ePowerUpType.MONEY:
                    this._moneyPickupPool = poolToInit;
                    break;
                default:
                    break;
            }
        };
        ObjectGenerator.prototype.InitBattleOilSpillPool = function () {
            this._battleOilSpillsPool = new Base.Pool(Base.SceneObject, 40, function () {
                // add empty sprite with body
                var oilSpill = new Base.SceneObject(this._game, 0, 0, Base.eObjectType.POWER_UP_ACTIVATED, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_OIL + this._game.rnd.integerInRange(1, 3));
                this._game.physics.enable(oilSpill, Phaser.Physics.P2JS);
                oilSpill.body.setCircle(oilSpill.width / 2);
                oilSpill.body.data.shapes[0].sensor = true;
                oilSpill.anchor.setTo(0.5);
                //oilSpill.body.debug = true;
                oilSpill.kill();
                return oilSpill;
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._battleOilSpillsPool, this._bgLayer);
        };
        ObjectGenerator.prototype.SetCurrentThresholds = function (currentArea) {
            this._currentPoliceThresholds = this._gameSettingsHandler.GetCurrentGeneratorSettings(currentArea);
            //console.log("MORE: " + this._currentPoliceThresholds.police1);
        };
        //determine whether the booster is applied
        ObjectGenerator.prototype.SetInGamePowerUps = function () {
            if (Gamee.PlayerDataStorage.Instance.IsBoosterActive(PoliceRunners.eBoosterType.MYSTERY_BOXES))
                this._availablePowerUps = this._availablePowerUpsBooster;
            else
                this._availablePowerUps = this._availablePowerUpsCampaign;
        };
        ObjectGenerator.prototype.GeneratePowerUp = function (givenType) {
            var dirToGenerate = this._game.rnd.integerInRange(0, 3);
            //genCoeff - use 2 when generating money on the end of the race
            var coords = this.getPowerUpCoords(dirToGenerate, givenType == null ? this.POWERUP_GEN_COEFF : 1);
            var powerUp = null;
            if (givenType == null && this._availablePowerUps.length == 0)
                return null;
            var chosenType;
            if (givenType == null)
                chosenType = this._availablePowerUps.splice(this._game.rnd.integerInRange(0, this._availablePowerUps.length - 1), 1)[0];
            else
                chosenType = givenType;
            switch (chosenType) {
                case PoliceRunners.ePowerUpType.MYSTERY_BOX:
                    powerUp = this._mysteryBoxPool.GetFirstAvailable();
                    break;
                case PoliceRunners.ePowerUpType.MONEY:
                    powerUp = this._moneyPickupPool.GetFirstAvailable();
                    break;
                default:
                    break;
            }
            if (powerUp != null) {
                powerUp.SpawnObject(coords.x, coords.y);
                if (powerUp.PowerUpType == PoliceRunners.ePowerUpType.MYSTERY_BOX) {
                    var mbText = this._mysteryBoxTextPool.GetFirstAvailable();
                    if (mbText != null) {
                        mbText.anchor.set(0.5);
                        mbText.SpawnObject(coords.x + powerUp.width * .30, coords.y - powerUp.height * .3);
                        powerUp.AssignedImgText = mbText;
                    }
                    else
                        powerUp.AssignedImgText = null;
                }
            }
            return powerUp;
        };
        ObjectGenerator.prototype.UpdateAvailablePowerUpList = function (powerUpType) {
            this._availablePowerUps.push(powerUpType);
        };
        ObjectGenerator.prototype.GenerateBattleOilSpill = function (playerCoords, playerDir) {
            var currentDir = this.getCurrentPlayerDir(playerDir);
            var coords = this.getGeneratedCoords(true, currentDir, this.REGULAR_DIST_FROM_BORDER, this.getOppositeDirectionCoords(currentDir, playerCoords, true));
            var oilSpill = this._battleOilSpillsPool.GetFirstAvailable();
            if (oilSpill != null) {
                oilSpill.SpawnObject(coords.x, coords.y);
            }
            return oilSpill;
        };
        /** playerDir: angle of player's car */
        ObjectGenerator.prototype.GeneratePolice = function (playerCoords, playerDir) {
            var currentDir = this.getCurrentPlayerDir(playerDir);
            var coords = null;
            if (currentDir === this._lastDir) {
                this._timeInOneDir += (this._game.time.now - this._lastTimeCheck);
                if (this._timeInOneDir >= PoliceRunners.GameOptions.MAX_TIME_IN_ONE_DIR) {
                    this._timeInOneDir = 0;
                    coords = this.getGeneratedCoords(true, currentDir, (currentDir == PoliceRunners.eScreenSide.LEFT || currentDir == PoliceRunners.eScreenSide.RIGHT) ? this.OPPOSITE_DIR_DIST_FROM_BORDER_LR : this.OPPOSITE_DIR_DIST_FROM_BORDER_UD, this.getOppositeDirectionCoords(currentDir, playerCoords, false));
                }
                else {
                    coords = this.getGeneratedCoords(false, this.getRegularCoords(currentDir), this.REGULAR_DIST_FROM_BORDER);
                }
            }
            else {
                this._timeInOneDir = 0;
                coords = this.getGeneratedCoords(false, this.getRegularCoords(currentDir), this.REGULAR_DIST_FROM_BORDER);
            }
            this._lastTimeCheck = this._game.time.now;
            this._lastDir = currentDir;
            var policeCarKey = this._game.rnd.pick(this._availablePoliceCars);
            var policeCar;
            switch (policeCarKey) {
                case PoliceRunners.StringConstants.KEY_POLICE1:
                    policeCar = this._police1CarsPool.GetFirstAvailable();
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE2:
                    policeCar = this._police2CarsPool.GetFirstAvailable();
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE3:
                    policeCar = this._police3CarsPool.GetFirstAvailable();
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE4:
                    policeCar = this._police4CarsPool.GetFirstAvailable();
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE5:
                    policeCar = this._police5CarsPool.GetFirstAvailable();
                    break;
                default:
                    break;
            }
            if (policeCar != null) {
                policeCar.SpawnObject(coords.x, coords.y);
            }
            return policeCar;
        };
        /** Returns true if wanted level has raised or false when not */
        ObjectGenerator.prototype.CheckForWantedLevelChange = function (numOfDestroyedCars) {
            var wantedLevelRise = false;
            if (this.isNotInArray(this._currentPoliceThresholds.police1, PoliceRunners.StringConstants.KEY_POLICE1)
                && this._currentPoliceThresholds.police1 <= numOfDestroyedCars) {
                this.addToArray(PoliceRunners.StringConstants.KEY_POLICE1);
                wantedLevelRise = true;
            }
            if (this.isNotInArray(this._currentPoliceThresholds.police2, PoliceRunners.StringConstants.KEY_POLICE2)
                && this._currentPoliceThresholds.police2 <= numOfDestroyedCars) {
                this.addToArray(PoliceRunners.StringConstants.KEY_POLICE2);
                wantedLevelRise = true;
            }
            if (this.isNotInArray(this._currentPoliceThresholds.police3, PoliceRunners.StringConstants.KEY_POLICE3)
                && this._currentPoliceThresholds.police3 <= numOfDestroyedCars) {
                this.addToArray(PoliceRunners.StringConstants.KEY_POLICE3);
                wantedLevelRise = true;
            }
            if (this.isNotInArray(this._currentPoliceThresholds.police4, PoliceRunners.StringConstants.KEY_POLICE4)
                && this._currentPoliceThresholds.police4 <= numOfDestroyedCars) {
                this.addToArray(PoliceRunners.StringConstants.KEY_POLICE4);
                wantedLevelRise = true;
            }
            if (this.isNotInArray(this._currentPoliceThresholds.police5, PoliceRunners.StringConstants.KEY_POLICE5)
                && this._currentPoliceThresholds.police5 <= numOfDestroyedCars) {
                this.addToArray(PoliceRunners.StringConstants.KEY_POLICE5);
                wantedLevelRise = true;
            }
            return wantedLevelRise;
        };
        /** Aux functions */
        ObjectGenerator.prototype.isNotInArray = function (propertyToCheck, propertyInArrayCheck) {
            return propertyToCheck != null && this._availablePoliceCars.indexOf(propertyInArrayCheck) == -1;
        };
        ObjectGenerator.prototype.addToArray = function (policeKey) {
            this._availablePoliceCars.push(policeKey);
        };
        ObjectGenerator.prototype.getCurrentPlayerDir = function (playerAngle) {
            if (playerAngle >= -25 && playerAngle <= 25) { //up
                return PoliceRunners.eScreenSide.UP;
            }
            else if (playerAngle <= -155 || playerAngle >= 155) { //down
                return PoliceRunners.eScreenSide.DOWN;
            }
            else if (playerAngle < -25 && playerAngle > -155) { //left
                return PoliceRunners.eScreenSide.LEFT;
            }
            else {
                return PoliceRunners.eScreenSide.RIGHT;
            }
        };
        ObjectGenerator.prototype.getRegularCoords = function (playerSide) {
            //car heading up or down - generate left or right
            if (playerSide === PoliceRunners.eScreenSide.UP) { //up
                this._addedSpace = -this.getRandomScreenHeightNum();
                return this._game.rnd.integerInRange(0, 1);
            }
            else if (playerSide === PoliceRunners.eScreenSide.DOWN) { //down
                this._addedSpace = this.getRandomScreenHeightNum();
                return this._game.rnd.integerInRange(0, 1);
            }
            else if (playerSide === PoliceRunners.eScreenSide.RIGHT) { //left
                this._addedSpace = -this.getRandomScreenWidthNum();
                return this._game.rnd.integerInRange(2, 3);
            }
            else {
                this._addedSpace = this.getRandomScreenWidthNum();
                return this._game.rnd.integerInRange(2, 3);
            }
        };
        ObjectGenerator.prototype.getOppositeDirectionCoords = function (playerSide, playerCoords, oilGen) {
            //car heading up or down - generate left or right
            if (playerSide === PoliceRunners.eScreenSide.UP) { //up
                return oilGen ? this._game.camera.x + this.getRandomScreenWidthNum() : playerCoords.x;
            }
            else if (playerSide === PoliceRunners.eScreenSide.DOWN) { //down
                return oilGen ? this._game.camera.x + this.getRandomScreenWidthNum() : playerCoords.x;
            }
            else if (playerSide === PoliceRunners.eScreenSide.RIGHT) { //left
                return oilGen ? this._game.camera.y + this.getRandomScreenHeightNum() : playerCoords.y;
            }
            else {
                return oilGen ? this._game.camera.y + this.getRandomScreenHeightNum() : playerCoords.y;
            }
        };
        //** Used for police generator  */
        ObjectGenerator.prototype.getGeneratedCoords = function (oppositeDir, sideToGenerate, distance, givenCoord) {
            var x;
            var y;
            switch (sideToGenerate) {
                case PoliceRunners.eScreenSide.DOWN:
                    x = !oppositeDir ? this._game.camera.x + PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH + this._addedSpace : givenCoord;
                    y = this._game.camera.y + this._game.height + distance;
                    break;
                case PoliceRunners.eScreenSide.UP:
                    x = !oppositeDir ? this._game.camera.x + PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH + this._addedSpace : givenCoord;
                    y = this._game.camera.y - distance;
                    break;
                case PoliceRunners.eScreenSide.LEFT:
                    x = this._game.camera.x - distance;
                    y = !oppositeDir ? this._game.camera.y + PoliceRunners.GameGlobalVariables.GAME_HALF_HEIGHT + this._addedSpace : givenCoord;
                    break;
                case PoliceRunners.eScreenSide.RIGHT:
                    x = this._game.camera.x + this._game.width + distance;
                    y = !oppositeDir ? this._game.camera.y + PoliceRunners.GameGlobalVariables.GAME_HALF_HEIGHT + this._addedSpace : givenCoord;
                    break;
            }
            return new Phaser.Point(x, y);
        };
        /** Used for powerUps */
        ObjectGenerator.prototype.getPowerUpCoords = function (sideToGenerate, genCoeff) {
            var x;
            var y;
            switch (sideToGenerate) {
                case PoliceRunners.eScreenSide.DOWN:
                    x = this._game.rnd.realInRange(this._game.camera.x - (this._game.width * (genCoeff - 1)), this._game.camera.x + this._game.width * genCoeff);
                    y = this._game.camera.y + this._game.height + this._game.rnd.realInRange(100, this._game.height * genCoeff);
                    break;
                case PoliceRunners.eScreenSide.UP:
                    x = this._game.rnd.realInRange(this._game.camera.x - (this._game.width * (genCoeff - 1)), this._game.camera.x + this._game.width * genCoeff);
                    y = this._game.camera.y - this._game.rnd.realInRange(100, this._game.height * genCoeff);
                    break;
                case PoliceRunners.eScreenSide.LEFT:
                    x = this._game.camera.x - this._game.rnd.realInRange(100, this._game.width * genCoeff);
                    y = this._game.rnd.realInRange(this._game.camera.y - (this._game.height * (genCoeff - 1)), this._game.camera.y + this._game.height * genCoeff);
                    break;
                case PoliceRunners.eScreenSide.RIGHT:
                    x = this._game.camera.x + this._game.width + this._game.rnd.realInRange(100, this._game.width * genCoeff);
                    y = this._game.rnd.realInRange(this._game.camera.y - (this._game.height * (genCoeff - 1)), this._game.camera.y + this._game.height * genCoeff);
                    break;
            }
            return new Phaser.Point(x, y);
        };
        ObjectGenerator.prototype.getRandomScreenWidthNum = function () {
            return this._game.rnd.realInRange(0, this._game.width);
        };
        ObjectGenerator.prototype.getRandomScreenHeightNum = function () {
            return this._game.rnd.realInRange(0, this._game.height);
        };
        ObjectGenerator.prototype.initItemsID = function (pool, startIndex) {
            for (var i = 0; i < pool.length; i++) {
                pool[i].ObjectID = i + startIndex;
            }
        };
        ObjectGenerator.prototype.ResetGenerator = function () {
            this._availablePoliceCars = [];
            this._timeInOneDir = 0;
            this._lastDir = null;
        };
        return ObjectGenerator;
    }());
    PoliceRunners.ObjectGenerator = ObjectGenerator;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var PlayerCar = /** @class */ (function (_super) {
        __extends(PlayerCar, _super);
        function PlayerCar(game, posX, posY, carID, maxHP, maxCombo) {
            var _this = 
            //1) create invisible sprite as a base and assign basic sprites
            _super.call(this, game, posX, posY) || this;
            _this._oilSpillActiveEvent = null;
            _this._afterSpikesEvent = null;
            _this._nitroOn = false;
            _this._shieldOn = false;
            _this._oilSpilling = false;
            _this._spikeSpilling = false;
            _this._affectedByOilSpill = false;
            _this._slowDownCoeff = 0.002;
            _this._affectedBySpikes = false;
            //this is here to avoid immediate collision with spikes or oil after mystery box take
            _this._afterPowerUpTake = false;
            _this._health = maxHP;
            _this._maxHealth = maxHP;
            //this._maxHealth = 1;
            _this._lastXPos = posX;
            _this._lastYPos = posY;
            _this._carID = carID;
            _this._maxCombo = maxCombo;
            _this.data = 0; //for collision check
            //2)create car body sprite and get size based on sprite properties
            _this._carBody = game.add.sprite(0, 0, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_TYPE + (carID + 1).toString());
            _this._carBody.anchor.set(0.5);
            //this.scale.set(0.67);
            //this.scale.set(0.57);
            _this.scale.set(PlayerCar.STANDARD_SCALE);
            _this.anchor.set(0.5);
            _this.game.physics.enable(_this, Phaser.Physics.P2JS);
            _this.body.setRectangle(_this._carBody.width * 0.6, _this._carBody.height * 0.55, 0, 0);
            _this.body.angularDamping = PoliceRunners.GameOptions.ANGULAR_DRAG;
            _this.body.damping = PoliceRunners.GameOptions.BODY_DRAG;
            _this.body.mass = PoliceRunners.GameOptions.BODY_MASS;
            _this.body.collideWorldBounds = false;
            //this.body.debug = true;
            _this.NearMissBody = _this.game.add.sprite(posX, posY);
            _this.NearMissBody.anchor.set(-0.5, 3);
            _this.NearMissBody.width = _this._carBody.width * 1.6;
            _this.NearMissBody.height = _this._carBody.height * 1.2;
            _this.game.physics.enable(_this.NearMissBody, Phaser.Physics.P2JS);
            _this.NearMissBody.body.collideWorldBounds = false;
            _this.NearMissBody.body.data.shapes[0].sensor = true;
            //this.NearMissBody.body.debug = true;
            //to keep body in the center
            _this._nearMissDistFromCenter = _this._carBody.height * .05;
            //add lights and shadow
            _this._lights = game.add.sprite(0, -_this._carBody.height * .4, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_LIGHTS);
            _this._lights.anchor.set(0.5);
            //TODO bylo by fajn, kdyby se shadow hybal na zaklade uhlu auta
            _this._shadow = game.add.image(-_this._carBody.height * .08, _this._carBody.height * .1, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_TYPE + (carID + 1).toString() + "sh");
            _this._shadow.anchor.set(0.5);
            _this.STANDARD_ARROW_DIST_FROM_CAR = _this.game.width * .25;
            //hit anim
            _this._hitAnim = game.add.sprite(0, 0, PoliceRunners.StringConstants.SPRITESHEET_HIT_EFFECT);
            _this._hitAnim.anchor.setTo(0.5);
            _this._hitAnim.animations.add("hit");
            _this._hitAnim.animations.currentAnim.onComplete.add(_this.onHitAnimCompleted, _this);
            _this._hitAnim.visible = false;
            _this._carBody.addChild(_this._hitAnim);
            //powerup effects - all taken from one atlas
            _this._healthEffect = game.add.sprite(0, 0, PoliceRunners.StringConstants.ATLAS_POWER_UPS, PoliceRunners.StringConstants.AK_PU_HEART);
            _this._healthEffect.anchor.set(0.5);
            _this._healthEffect.scale.set(0);
            _this._healthEffect.visible = false;
            _this._shieldEffect = game.add.sprite(0, 0, PoliceRunners.StringConstants.ATLAS_POWER_UPS, PoliceRunners.StringConstants.AK_PU_SHIELD);
            _this._shieldEffect.anchor.set(0.5);
            _this._shieldEffect.scale.set(2);
            _this._shieldEffect.visible = false;
            _this._shieldEffect.animations.add(PoliceRunners.StringConstants.ANIM_CAR_SHIELD, Phaser.Animation.generateFrameNames(PoliceRunners.StringConstants.AK_PU_SHIELD, 1, 10, undefined, 4), 30, true);
            _this._nitroEffect = game.add.sprite(0, -_this._carBody.height / 2.3, PoliceRunners.StringConstants.ATLAS_POWER_UPS, PoliceRunners.StringConstants.AK_PU_NITRO_FRAMES + 1);
            _this._nitroEffect.anchor.set(0.5, 0);
            _this._nitroEffect.scale.set(2.2);
            _this._nitroEffect.animations.add(PoliceRunners.StringConstants.ANIM_CAR_NITRO_PART1, Phaser.Animation.generateFrameNames(PoliceRunners.StringConstants.AK_PU_NITRO_FRAMES, 1, 4, undefined, 0), 30, false);
            _this._nitroEffect.animations.add(PoliceRunners.StringConstants.ANIM_CAR_NITRO_PART2, Phaser.Animation.generateFrameNames(PoliceRunners.StringConstants.AK_PU_NITRO_FRAMES, 5, 8, undefined, 0), 30, true);
            _this._nitroEffect.animations.getAnimation(PoliceRunners.StringConstants.ANIM_CAR_NITRO_PART1).onComplete.add(_this._playNitroAnimPart2, _this);
            _this._nitroEffect.visible = false;
            _this.addChild(_this._shadow);
            _this.addChild(_this._lights);
            _this.addChild(_this._nitroEffect);
            _this.addChild(_this._carBody);
            _this.addChild(_this._shieldEffect);
            return _this;
        }
        Object.defineProperty(PlayerCar.prototype, "CarID", {
            get: function () {
                return this._carID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "Health", {
            get: function () {
                return this._health;
            },
            set: function (value) {
                this._health = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "MaxHealth", {
            get: function () {
                return this._maxHealth;
            },
            set: function (value) {
                this._maxHealth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "MaxCombo", {
            get: function () {
                return this._maxCombo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "NitroOn", {
            get: function () {
                return this._nitroOn;
            },
            set: function (value) {
                this._nitroOn = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "ShieldOn", {
            get: function () {
                return this._shieldOn;
            },
            set: function (value) {
                this._shieldOn = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "OilSpilling", {
            get: function () {
                return this._oilSpilling;
            },
            set: function (value) {
                this._oilSpilling = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "SpikeSpilling", {
            get: function () {
                return this._spikeSpilling;
            },
            set: function (value) {
                this._spikeSpilling = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "Alive", {
            get: function () {
                return this._alive;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "CarmageddonOn", {
            get: function () {
                return this._carmageddonOn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "AffectedByOilSpill", {
            get: function () {
                return this._affectedByOilSpill;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "AffectedBySpikes", {
            get: function () {
                return this._affectedBySpikes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "AfterPowerUpTake", {
            get: function () {
                return this._afterPowerUpTake;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerCar.prototype, "CarBody", {
            get: function () {
                return this._carBody;
            },
            enumerable: true,
            configurable: true
        });
        PlayerCar.prototype.Accelerate = function (accValue) {
            this.body.thrust(accValue * this.game.time.physicsElapsed);
        };
        PlayerCar.prototype.OnPoliceHit = function () {
            this._hitAnim.visible = true;
            this._hitAnim.animations.play("hit", 22);
        };
        PlayerCar.prototype.ThrustLeft = function () {
            this.body.thrustLeft((PoliceRunners.GameOptions.SIDE_THRUST_VAL) * this.game.time.physicsElapsed);
            this.body.thrust(PoliceRunners.GameOptions.SIDE_THRUST_ACC_VAL * this.game.time.physicsElapsed); //to prevent slowing down while steering
        };
        PlayerCar.prototype.ThrustRight = function () {
            this.body.thrustRight((PoliceRunners.GameOptions.SIDE_THRUST_VAL) * this.game.time.physicsElapsed);
            this.body.thrust(PoliceRunners.GameOptions.SIDE_THRUST_ACC_VAL * this.game.time.physicsElapsed); //to prevent slowing down while steering
        };
        PlayerCar.prototype.GetLastFrameDiffX = function () {
            var diff = this.x - this._lastXPos;
            this._lastXPos = this.x;
            return diff;
        };
        PlayerCar.prototype.GetLastFrameDiffY = function () {
            var diff = this.y - this._lastYPos;
            this._lastYPos = this.y;
            return diff;
        };
        PlayerCar.prototype.UpdateNearMissBodyPosition = function () {
            this.NearMissBody.body.x = Math.cos(this.body.rotation - 1.57079633) * this._nearMissDistFromCenter + this.body.x;
            this.NearMissBody.body.y = Math.sin(this.body.rotation - 1.57079633) * this._nearMissDistFromCenter + this.body.y;
            this.NearMissBody.body.rotation = this.body.rotation;
            this._healthEffect.x = this.body.x;
            this._healthEffect.y = this.body.y;
        };
        PlayerCar.prototype.ConstrainVelocity = function (maxVelocity) {
            var vx = this.body.data.velocity[0];
            var vy = this.body.data.velocity[1];
            var currVelocitySqr = vx * vx + vy * vy;
            if (currVelocitySqr > maxVelocity * maxVelocity) {
                var angle = Math.atan2(vy, vx);
                vx = Math.cos(angle) * maxVelocity;
                vy = Math.sin(angle) * maxVelocity;
                this.body.data.velocity[0] = vx;
                this.body.data.velocity[1] = vy;
            }
        };
        PlayerCar.prototype.ShowHealthAnim = function () {
            this._healthEffect.scale.set(0);
            this._healthEffect.visible = true;
            this._healthEffect.alpha = 1;
            this.game.add.tween(this._healthEffect.scale).to({ x: 6, y: 6 }, 1000, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._healthEffect).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
                .onComplete.add(function () {
                this._healthEffect.visible = false;
            }, this);
        };
        PlayerCar.prototype.ShowShieldAnim = function () {
            this._shieldEffect.visible = true;
            this._shieldEffect.animations.play(PoliceRunners.StringConstants.ANIM_CAR_SHIELD);
        };
        PlayerCar.prototype.ShowNitroAnim = function () {
            this._nitroEffect.visible = true;
            this._nitroEffect.animations.play(PoliceRunners.StringConstants.ANIM_CAR_NITRO_PART1);
        };
        PlayerCar.prototype._playNitroAnimPart2 = function () {
            this._nitroEffect.animations.play(PoliceRunners.StringConstants.ANIM_CAR_NITRO_PART2);
        };
        PlayerCar.prototype.StopNitroAnim = function () {
            this._nitroEffect.visible = false;
            this._nitroEffect.animations.stop(PoliceRunners.StringConstants.ANIM_CAR_NITRO_PART2);
        };
        PlayerCar.prototype.StopShieldAnim = function () {
            if (this._shieldTween != null)
                this._shieldTween.stop();
            this._shieldEffect.animations.stop(PoliceRunners.StringConstants.ANIM_CAR_SHIELD);
            this._shieldEffect.visible = false;
        };
        PlayerCar.prototype.DestroyCar = function () {
            this.NearMissBody.destroy();
            this.destroy();
        };
        PlayerCar.prototype.KillCar = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this._alive = false;
            this._lights.visible = false;
            this._carBody.frameName = PoliceRunners.StringConstants.AK_CAR_DESTROYED;
        };
        //This is called after video revive
        PlayerCar.prototype.ReviveCar = function () {
            this._alive = true;
            this._carBody.frameName = PoliceRunners.StringConstants.AK_CAR_TYPE + (this._carID + 1).toString();
            this._lights.visible = true;
            this._health = this._maxHealth;
        };
        PlayerCar.prototype.ResetCar = function () {
            //this._framesFromStartAlive = 0;
            this._alive = true;
            this._carBody.frameName = PoliceRunners.StringConstants.AK_CAR_TYPE + (this._carID + 1).toString();
            this._lights.visible = true;
            this.body.reset(PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH, PoliceRunners.GameGlobalVariables.GAME_HALF_HEIGHT);
            this._health = this._maxHealth;
            this.body.angle = 0;
            this._afterPowerUpTake = false;
        };
        //must be called later than ResetCar() method, because of Phaser bug
        PlayerCar.prototype.ResetLastPosDiff = function () {
            this._lastXPos = this.x;
            this._lastYPos = this.y;
        };
        PlayerCar.prototype.SetAfterPowerUpTake = function () {
            this._afterPowerUpTake = true;
            this.game.time.events.add(500, function () {
                this._afterPowerUpTake = false;
            }, this);
        };
        PlayerCar.prototype.onHitAnimCompleted = function () {
            this._hitAnim.visible = false;
        };
        PlayerCar.prototype.GetSpeedSquared = function () {
            return this.body.velocity.x * this.body.velocity.x + this.body.velocity.y * this.body.velocity.y;
        };
        PlayerCar.prototype.ApplyOilSpillBehaviour = function () {
            if (this._affectedByOilSpill)
                this.game.time.events.remove(this._oilSpillActiveEvent);
            this._affectedByOilSpill = true;
            if (this.game.rnd.realInRange(0, 1) > 0.5)
                this.body.rotateLeft(50);
            else
                this.body.rotateRight(50);
            this._oilSpillActiveEvent = this.game.time.events.add(PoliceRunners.GameOptions.OIL_SPILL_AFFECT_DURATION, function () {
                this._affectedByOilSpill = false;
            }, this);
        };
        PlayerCar.prototype.ApplyAfterSpikesBehaviour = function () {
            if (this._affectedBySpikes)
                this.game.time.events.remove(this._afterSpikesEvent);
            this._affectedBySpikes = true;
            if (this.game.rnd.realInRange(0, 1) > 0.5)
                this.body.rotateLeft(50);
            else
                this.body.rotateRight(50);
            this._afterSpikesEvent = this.game.time.events.add(PoliceRunners.GameOptions.SPIKE_STRIP_AFFECT_DURATION, function () {
                this._affectedBySpikes = false;
            }, this);
        };
        PlayerCar.prototype.StopTheCarImmediatelly = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        };
        PlayerCar.prototype.StopTheCarContinuously = function (stopCoeff) {
            this.body.velocity.x += (-this.body.velocity.x * stopCoeff);
            this.body.velocity.y += (-this.body.velocity.y * stopCoeff);
        };
        PlayerCar.prototype.ApplyCarmageddon = function (changeScale) {
            this._carmageddonOn = true;
            if (changeScale)
                this.scale.set(PlayerCar.RAGE_SCALE);
        };
        PlayerCar.prototype.StopCarmageddon = function () {
            this._carmageddonOn = false;
            this.scale.set(PlayerCar.STANDARD_SCALE);
        };
        PlayerCar.prototype.StopCarByDrift = function () {
            if (this.game.rnd.realInRange(0, 1) > 0.5)
                this.body.rotateLeft(70);
            else
                this.body.rotateRight(70);
        };
        PlayerCar.prototype.CreateRaceArrow = function (cpSprite, checkpointPos) {
            this._raceFollowArrow = this.game.add.image(0, 0, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, PoliceRunners.StringConstants.AK_DR_FOLLOW_ARROW);
            this._raceFollowArrow.anchor.set(0.5, 1);
            this._arrowDistance = this.game.add.bitmapText(this._raceFollowArrow.width * .7, -this._raceFollowArrow.height * .35, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "666M", 18);
            this._arrowDistance.anchor.set(0, 0.5);
            this._raceFollowArrow.addChild(this._arrowDistance);
            this._cpRadius = cpSprite.width / 2 + this._carBody.width / 2;
            this._currentCarArrDist = this.STANDARD_ARROW_DIST_FROM_CAR;
            this.UpdateRaceArrow(checkpointPos);
        };
        PlayerCar.prototype.UpdateRaceArrow = function (checkpointPos) {
            var carArrowDistance;
            var distBetween = Phaser.Math.distance(this.body.x, this.body.y, checkpointPos.x, checkpointPos.y) - this._cpRadius;
            if (distBetween > this.STANDARD_ARROW_DIST_FROM_CAR)
                carArrowDistance = this.STANDARD_ARROW_DIST_FROM_CAR;
            else
                carArrowDistance = Math.max(distBetween, 0);
            var angle = Math.atan2(checkpointPos.y - this.body.y, checkpointPos.x - this.body.x);
            this._raceFollowArrow.rotation = angle + 1.57079633;
            this._raceFollowArrow.x = this.body.x + carArrowDistance * Math.cos(angle);
            this._raceFollowArrow.y = this.body.y + carArrowDistance * Math.sin(angle);
            this._arrowDistance.text = Math.round(distBetween / PoliceRunners.GameOptions.PIXELS_TO_METERS_COEFF) + "M";
            this._arrowDistance.angle = 0;
        };
        PlayerCar.prototype.DestroyRaceArrow = function () {
            if (this._raceFollowArrow != null) {
                this._raceFollowArrow.destroy();
                this._raceFollowArrow = null;
            }
        };
        PlayerCar.STANDARD_SCALE = 0.53;
        PlayerCar.RAGE_SCALE = 0.85;
        return PlayerCar;
    }(Phaser.Sprite));
    PoliceRunners.PlayerCar = PlayerCar;
})(PoliceRunners || (PoliceRunners = {}));
/// <reference path="../Base/SceneObject.ts"/>
var PoliceRunners;
(function (PoliceRunners) {
    var PoliceCar = /** @class */ (function (_super) {
        __extends(PoliceCar, _super);
        //TODO mohli bychom zkusit nezapinat fyziku v poolu, ale az pri spawnu
        function PoliceCar(game, posX, posY, id, damage, speed, baseScore, angleMult) {
            var _this = _super.call(this, game, posX, posY, Base.eObjectType.POLICE) || this;
            // private _framesFromStartAlive: number = 0;
            // public FrameToSkipGen: number = 1;
            _this._assignedIcon = null;
            _this._gameeFriendIcon = null;
            _this._affectedByOilSpill = false;
            _this._affectedBySpikes = false;
            _this._spikesRecovery = false;
            _this._spikesRecoveryTime = 0;
            _this._justSpawned = false;
            _this._slowDownCoeff = 0.02;
            _this._speed = 0;
            _this._angleMultiplier = 0;
            _this._policeLights = null;
            _this._lastAngle = 0;
            _this._lastAngleBeforeSpike = 0;
            //About the sound - it is not using AudioPlayer because AudioPlayer always returns the same instance of the sound
            //and it doesnt work well in our use case
            _this._attachedSound = null;
            _this._sirenSounds = [PoliceRunners.StringConstants.SOUND_POLICE_SIREN1, PoliceRunners.StringConstants.SOUND_POLICE_SIREN2];
            //this.scale.set(0.85);
            //this.scale.set(0.75);
            _this.scale.set(0.72);
            _this.data = 1; //for collision check
            _this._damage = damage;
            //this._angleMultiplier = angleMult;
            _this._angleMultiplier = 0.25;
            _this._baseScore = baseScore;
            _this._speed = speed;
            _this._attachedSound = game.add.sound(game.rnd.pick(_this._sirenSounds));
            _this._attachedSound.volume = 0.3;
            var carBody = game.add.sprite(0, 0, PoliceRunners.StringConstants.ATLAS_POLICE_CARS, PoliceRunners.StringConstants.AK_POLICECAR_TYPE + id);
            carBody.anchor.set(0.5);
            _this.game.physics.enable(_this, Phaser.Physics.P2JS);
            _this.body.setRectangle(carBody.width * 0.6, carBody.height * 0.65, 0, 0);
            _this.anchor.set(0.5);
            _this.body.collideWorldBounds = false;
            _this.body.angularDamping = PoliceRunners.GameOptions.POLICE_ANGULAR_DRAG;
            _this.body.damping = PoliceRunners.GameOptions.POLICE_BODY_DRAG;
            _this.body.mass = PoliceRunners.GameOptions.POLICE_BODY_MASS;
            //this.body.debug = true;
            var lights = game.add.sprite(0, -carBody.height * .4, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_LIGHTS);
            lights.anchor.set(0.5);
            //TODO bylo by fajn, kdyby se shadow hybal na zaklade uhlu auta
            var shadow = game.add.sprite(-carBody.height * .08, carBody.height * .1, PoliceRunners.StringConstants.ATLAS_POLICE_CARS, PoliceRunners.StringConstants.AK_POLICECAR_TYPE + id + "_sh");
            shadow.anchor.set(0.5);
            _this.body.rotation += 1.57079633;
            _this.addChild(shadow);
            _this.addChild(lights);
            _this.addChild(carBody);
            _this._policeLights = new PoliceRunners.PoliceLights(game, carBody.x, carBody.y);
            _this.addChild(_this._policeLights);
            _this.kill();
            return _this;
        }
        Object.defineProperty(PoliceCar.prototype, "AssignedIcon", {
            get: function () {
                return this._assignedIcon;
            },
            set: function (value) {
                this._assignedIcon = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PoliceCar.prototype, "GameeFriendIcon", {
            get: function () {
                return this._gameeFriendIcon;
            },
            set: function (value) {
                this._gameeFriendIcon = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PoliceCar.prototype, "Damage", {
            get: function () {
                return this._damage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PoliceCar.prototype, "BaseScore", {
            get: function () {
                return this._baseScore;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PoliceCar.prototype, "AffectedByOilSpill", {
            get: function () {
                return this._affectedByOilSpill;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PoliceCar.prototype, "AffectedBySpikes", {
            get: function () {
                return this._affectedBySpikes;
            },
            enumerable: true,
            configurable: true
        });
        PoliceCar.prototype.SpawnObject = function (posX, posY) {
            _super.prototype.SpawnObject.call(this, posX, posY);
            this._justSpawned = true;
            this._affectedByOilSpill = false;
            this._affectedBySpikes = false;
            this._spikesRecovery = false;
            this._policeLights.Flash();
            if (App.Global.soundOn)
                this._attachedSound.play(undefined, undefined, undefined, true);
        };
        //TODO pouzit pak i remove collision group???? a pouzivat to pri spawnu anebo rovnou na vsechny?
        PoliceCar.prototype.InitCollisionGroups = function (policeGroup) {
            this.body.setCollisionGroup(policeGroup);
            this.body.enable = false;
        };
        PoliceCar.prototype.DestroyCar = function () {
            this._policeLights.StopFlashing();
            this._lastAngle = 0;
            if (this._attachedSound != null)
                this._attachedSound.stop();
            this.KillObjectAndRemoveFromScene();
        };
        PoliceCar.prototype.StopSirenSound = function () {
            if (this._attachedSound != null)
                this._attachedSound.stop();
        };
        PoliceCar.prototype.FollowPlayer = function (player) {
            var angle = Math.atan2(player.y - this.y, player.x - this.x);
            if (angle <= 0)
                angle += (2 * Math.PI);
            if (this._lastAngle != 0) {
                if (angle > this._lastAngle + Math.PI) {
                    angle -= 2 * Math.PI;
                }
                else if (angle < this._lastAngle - Math.PI) {
                    angle += 2 * Math.PI;
                }
                //TODO tady prece ma byt ten angle multiplier
                //angle = this.computeTheAngle(angle);
                angle = this.game.math.linear(this._lastAngle, angle, this._angleMultiplier);
            }
            this._lastAngle = this.game.math.normalizeAngle(angle);
            this.body.rotation = angle + 1.57079633;
            if (!this._affectedByOilSpill) {
                //this.body.rotation = angle + 1.57079633;
                //TODO kdyz tohle prepisu z force na velocity, tak se auta budou rozjizdet konstantni rychlosti
                this.body.force.x = Math.cos(angle) * this._speed;
                this.body.force.y = Math.sin(angle) * this._speed;
            }
        };
        PoliceCar.prototype.StopTheCarContinuously = function () {
            this.body.velocity.x += (-this.body.velocity.x * this._slowDownCoeff);
            this.body.velocity.y += (-this.body.velocity.y * this._slowDownCoeff);
        };
        //Returns magnitude of current speed - but the speed is squared for speed purposes... i fe want to compare with some value, we need to compare by squared value .]
        PoliceCar.prototype.GetSpeedSquared = function () {
            return this.body.velocity.x * this.body.velocity.x + this.body.velocity.y * this.body.velocity.y;
        };
        PoliceCar.prototype.ApplyOilSpillBehaviour = function () {
            this._affectedByOilSpill = true;
            this.game.time.events.add(PoliceRunners.GameOptions.OIL_SPILL_AFFECT_DURATION, function () {
                this._affectedByOilSpill = false;
            }, this);
        };
        PoliceCar.prototype.ApplyAfterSpikesBehaviour = function () {
            this._lastAngleBeforeSpike = this._lastAngle;
            this._affectedBySpikes = true;
            if (this.game.rnd.realInRange(0, 1) > 0.5)
                this.body.rotateLeft(50);
            else
                this.body.rotateRight(50);
            //console.log("APPLYING SPIKES: " + this._lastAngle);
            this.game.time.events.add(PoliceRunners.GameOptions.SPIKE_STRIP_AFFECT_DURATION, function () {
                this._affectedBySpikes = false;
                this._spikesRecoveryTime = 0;
                this._spikesRecovery = true;
            }, this);
        };
        return PoliceCar;
    }(Base.SceneObject));
    PoliceRunners.PoliceCar = PoliceCar;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var PoliceLights = /** @class */ (function (_super) {
        __extends(PoliceLights, _super);
        function PoliceLights(game, posX, posY) {
            var _this = _super.call(this, game, posX, posY) || this;
            _this._lightBlue = game.add.sprite(0, 0, PoliceRunners.StringConstants.ATLAS_POLICE_CARS, PoliceRunners.StringConstants.AK_POLICECAR_LIGHT_BLUE);
            _this._lightBlue.anchor.setTo(0.7, 0.5);
            _this._lightRed = game.add.sprite(0, 0, PoliceRunners.StringConstants.ATLAS_POLICE_CARS, PoliceRunners.StringConstants.AK_POLICECAR_LIGHT_RED);
            _this._lightRed.anchor.setTo(0.3, 0.5);
            _this.addChild(_this._lightBlue);
            _this.addChild(_this._lightRed);
            return _this;
        }
        PoliceLights.prototype.Flash = function () {
            this._lightBlue.alpha = 1;
            this._lightRed.alpha = 1;
            this._blueTween = this.game.add.tween(this._lightBlue).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
            this._redTween = this.game.add.tween(this._lightRed).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 300, -1, true);
        };
        PoliceLights.prototype.StopFlashing = function () {
            if (this._blueTween != null) {
                this._blueTween.stop();
                this._blueTween = null;
            }
            if (this._redTween != null) {
                this._redTween.stop();
                this._redTween = null;
            }
        };
        return PoliceLights;
    }(Phaser.Sprite));
    PoliceRunners.PoliceLights = PoliceLights;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var PoliceRadioManager = /** @class */ (function () {
        function PoliceRadioManager(game) {
            this._policeDeadSounds = [];
            this._playerDeadSounds = [];
            this._policeRandomSounds = [];
            this._lastDeadPoliceSound = "";
            this._lastRandomPoliceSound = "";
            this._game = game;
            this._policeDeadSounds = [PoliceRunners.StringConstants.SOUND_POLICE_RADIO1, PoliceRunners.StringConstants.SOUND_POLICE_RADIO2,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO7];
            this._playerDeadSounds = [PoliceRunners.StringConstants.SOUND_POLICE_RADIO6, PoliceRunners.StringConstants.SOUND_POLICE_RADIO8];
            this._policeRandomSounds = [PoliceRunners.StringConstants.SOUND_POLICE_RADIO3, PoliceRunners.StringConstants.SOUND_POLICE_RADIO4, PoliceRunners.StringConstants.SOUND_POLICE_RADIO5,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO9, PoliceRunners.StringConstants.SOUND_POLICE_RADIO10];
        }
        PoliceRadioManager.prototype.PlayDeadPoliceSound = function () {
            if (!Base.AudioPlayer.Instance.IsSoundPlaying(this._lastDeadPoliceSound)
                && !Base.AudioPlayer.Instance.IsSoundPlaying(this._lastRandomPoliceSound)) {
                var soundToPlay = this._lastDeadPoliceSound;
                while (soundToPlay === this._lastDeadPoliceSound) {
                    soundToPlay = this._game.rnd.pick(this._policeDeadSounds);
                }
                this._lastDeadPoliceSound = soundToPlay;
                Base.AudioPlayer.Instance.PlaySound(soundToPlay);
            }
        };
        PoliceRadioManager.prototype.PlayDeadPlayerSound = function () {
            Base.AudioPlayer.Instance.PlaySound(this._game.rnd.pick(this._playerDeadSounds));
        };
        PoliceRadioManager.prototype.PlayRandomRadioSound = function () {
            if (!Base.AudioPlayer.Instance.IsSoundPlaying(this._lastRandomPoliceSound)
                && !Base.AudioPlayer.Instance.IsSoundPlaying(this._lastDeadPoliceSound)) {
                var soundToPlay = this._lastRandomPoliceSound;
                while (soundToPlay === this._lastRandomPoliceSound) {
                    soundToPlay = this._game.rnd.pick(this._policeRandomSounds);
                }
                this._lastRandomPoliceSound = soundToPlay;
                Base.AudioPlayer.Instance.PlaySound(soundToPlay);
            }
        };
        return PoliceRadioManager;
    }());
    PoliceRunners.PoliceRadioManager = PoliceRadioManager;
})(PoliceRunners || (PoliceRunners = {}));
/// <reference path="../Base/SceneObject.ts"/>
var PoliceRunners;
(function (PoliceRunners) {
    var eActivatedPowerUpType;
    (function (eActivatedPowerUpType) {
        eActivatedPowerUpType[eActivatedPowerUpType["SHIELD"] = 0] = "SHIELD";
        eActivatedPowerUpType[eActivatedPowerUpType["EXTRA_LIFE"] = 1] = "EXTRA_LIFE";
        eActivatedPowerUpType[eActivatedPowerUpType["NITRO"] = 2] = "NITRO";
        eActivatedPowerUpType[eActivatedPowerUpType["DOUBLE_SCORE"] = 3] = "DOUBLE_SCORE";
        eActivatedPowerUpType[eActivatedPowerUpType["CARMAGEDDON"] = 4] = "CARMAGEDDON";
        eActivatedPowerUpType[eActivatedPowerUpType["OIL_SPILL"] = 5] = "OIL_SPILL";
        eActivatedPowerUpType[eActivatedPowerUpType["SPIKE_STRIP"] = 6] = "SPIKE_STRIP";
        eActivatedPowerUpType[eActivatedPowerUpType["MAGNET"] = 7] = "MAGNET";
    })(eActivatedPowerUpType = PoliceRunners.eActivatedPowerUpType || (PoliceRunners.eActivatedPowerUpType = {}));
    ;
    var ePowerUpType;
    (function (ePowerUpType) {
        ePowerUpType[ePowerUpType["MONEY"] = 0] = "MONEY";
        ePowerUpType[ePowerUpType["MYSTERY_BOX"] = 1] = "MYSTERY_BOX";
    })(ePowerUpType = PoliceRunners.ePowerUpType || (PoliceRunners.ePowerUpType = {}));
    ;
    var PowerUp = /** @class */ (function (_super) {
        __extends(PowerUp, _super);
        //Magnetized props
        // private _magnetized: boolean;
        // public get Magnetized(): boolean {
        //   return this._magnetized;
        // }
        // private _startPos: Phaser.Point;
        // private _flyTime: number;
        function PowerUp(game, type, spriteKey) {
            var _this = _super.call(this, game, 0, 0, Base.eObjectType.POWER_UP, PoliceRunners.StringConstants.ATLAS_POWER_UPS, spriteKey) || this;
            _this._assignedIcon = null;
            _this.AssignedImgText = null;
            _this._powerUpType = type;
            _this.game.physics.enable(_this, Phaser.Physics.P2JS);
            _this.body.setRectangle(_this.width * 0.6, _this.height * 0.6, 0, 0);
            _this.body.data.shapes[0].sensor = true;
            //this.body.debug = true;
            _this.anchor.set(0.5);
            //for the object pool
            _this.kill();
            return _this;
        }
        Object.defineProperty(PowerUp.prototype, "AssignedIcon", {
            get: function () {
                return this._assignedIcon;
            },
            set: function (value) {
                this._assignedIcon = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerUp.prototype, "PowerUpType", {
            get: function () {
                return this._powerUpType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerUp.prototype, "ItemID", {
            get: function () {
                return this._itemID;
            },
            set: function (value) {
                this._itemID = value;
            },
            enumerable: true,
            configurable: true
        });
        PowerUp.prototype.InitCollisionGroups = function (powerupGroup) {
            this.body.setCollisionGroup(powerupGroup);
        };
        PowerUp.prototype.SpawnObject = function (posX, posY) {
            _super.prototype.SpawnObject.call(this, posX, posY);
            this.visible = true;
            this.exists = true;
        };
        return PowerUp;
    }(Base.SceneObject));
    PoliceRunners.PowerUp = PowerUp;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var PowerUpText = /** @class */ (function (_super) {
        __extends(PowerUpText, _super);
        function PowerUpText(game) {
            var _this = _super.call(this, game, 0, 0, Base.eObjectType.POWER_UP_TEXT, PoliceRunners.StringConstants.ATLAS_POWER_UPS, PoliceRunners.StringConstants.AK_PU_MYSTERY_BOX_TEXT) || this;
            _this.TINT_NITRO = 0x57fcff;
            _this.TINT_RAGE = 0xffef28;
            _this.TINT_EXTRAHP = 0xfb0063;
            _this.TINT_MAGNET = 0x00cc8a;
            _this.TINT_SPIKES = 0xce49ff;
            _this.TINT_OIL = 0xffffff;
            _this.anchor.set(0.5);
            //TODO this name is not in any layer - can it be real problem?
            _this._powerUpName = _this.game.add.bitmapText(0, 0, PoliceRunners.StringConstants.FONT_POWER_UP, "TEST", 42);
            _this._powerUpName.anchor.set(0.5, 0.8);
            _this._powerUpName.scale.y = 0;
            _this._powerUpName.kill();
            _this.kill();
            return _this;
        }
        PowerUpText.prototype.SetPowerUpText = function (powerUpType) {
            switch (powerUpType) {
                case PoliceRunners.eActivatedPowerUpType.CARMAGEDDON:
                    this.setPowerUptext("RAGE!", this.TINT_RAGE);
                    break;
                case PoliceRunners.eActivatedPowerUpType.NITRO:
                    this.setPowerUptext("NITRO!", this.TINT_NITRO);
                    break;
                case PoliceRunners.eActivatedPowerUpType.OIL_SPILL:
                    this.setPowerUptext("OIL!", this.TINT_OIL);
                    break;
                case PoliceRunners.eActivatedPowerUpType.EXTRA_LIFE:
                    this.setPowerUptext("EXTRA HP!", this.TINT_EXTRAHP);
                    break;
                case PoliceRunners.eActivatedPowerUpType.SPIKE_STRIP:
                    this.setPowerUptext("SPIKES!", this.TINT_SPIKES);
                    break;
                case PoliceRunners.eActivatedPowerUpType.MAGNET:
                    this.setPowerUptext("MAGNET!", this.TINT_MAGNET);
                    break;
                case PoliceRunners.eActivatedPowerUpType.DOUBLE_SCORE:
                    this.setPowerUptext("DOUBLE SCORE!", this.TINT_MAGNET);
                    break;
                default:
                    this.setPowerUptext("SHIELD!", this.TINT_OIL);
                    break;
            }
        };
        PowerUpText.prototype.SpawnObject = function (posX, posY) {
            this.scale.y = 1;
            this._powerUpName.x = posX;
            this._powerUpName.y = posY;
            this._powerUpName.scale.y = 0;
            this.alpha = 1;
            _super.prototype.SpawnObject.call(this, posX, posY);
            this._scaleTween = this.game.add.tween(this.scale).to({ x: 1.1, y: 1.1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
        };
        PowerUpText.prototype.SetPowerUpTaken = function () {
            this._scaleTween.stop();
            var tween3 = this.game.add.tween(this).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween3.onComplete.addOnce(function () {
                this.KillObjectAndRemoveFromScene();
            }, this);
        };
        PowerUpText.prototype.KillObjectAndRemoveFromScene = function () {
            this._powerUpName.kill();
            _super.prototype.KillObjectAndRemoveFromScene.call(this);
        };
        PowerUpText.prototype.setPowerUptext = function (name, tint) {
            this._powerUpName.text = name;
            this._powerUpName.tint = tint;
        };
        return PowerUpText;
    }(Base.SceneObject));
    PoliceRunners.PowerUpText = PowerUpText;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var eTutorialPart;
    (function (eTutorialPart) {
        eTutorialPart[eTutorialPart["INIT"] = 0] = "INIT";
        eTutorialPart[eTutorialPart["ONE"] = 1] = "ONE";
        eTutorialPart[eTutorialPart["TWO"] = 2] = "TWO";
        eTutorialPart[eTutorialPart["THREE"] = 3] = "THREE";
        eTutorialPart[eTutorialPart["BETWEEN_PARTS"] = 4] = "BETWEEN_PARTS";
    })(eTutorialPart = PoliceRunners.eTutorialPart || (PoliceRunners.eTutorialPart = {}));
    var TutorialController = /** @class */ (function () {
        function TutorialController(game, uiHandler) {
            this.FADE_DURATION = 2000;
            this.PROGRESS_BAR_ADD = 0.01;
            this._game = game;
            this._UIHandler = uiHandler;
            this.OnTutorialComplete = new Phaser.Signal();
            this._currentPart = eTutorialPart.INIT;
            this._activeTweens = [];
            this._currentBarVal = 0;
        }
        TutorialController.prototype.InitTutorial = function () {
            this._game.camera.x = 0;
            this._game.camera.y = 0;
            this._currentPart = eTutorialPart.BETWEEN_PARTS;
            this._copsImg = this._game.add.image(this._game.width / 2, this._game.height, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_COP_CARS);
            this._copsImg.anchor.set(0.5, 1);
            this._fakeMBIcon = this._game.add.image(0, this._game.height * .45, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_MYSTERY_BOX_POINTER);
            this._fakeMBIcon.anchor.set(-0.2, 0.5);
            this._fakeMoneyIcon = this._game.add.image(this._game.width, this._game.height * .27, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_MONEY_POINTER);
            this._fakeMoneyIcon.anchor.set(1.2, 0.5);
            this._fakePoliceIcon = this._game.add.image(this._game.width, this._game.height * .66, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_COP_POINTER);
            this._fakePoliceIcon.anchor.set(1.2, 0.5);
            this._carSkidmarks = this._game.add.image(this._game.width / 2, this._game.height * .68, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_CAR_SKIDMARKS);
            this._carSkidmarks.anchor.set(0.5, 0);
            this._carImg = this._game.add.image(this._game.width / 2, this._game.height * .68, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_CAR);
            this._carImg.anchor.set(0.5);
            this._carImg.scale.set(0.9);
            //this._carImg.visible = false;
            this._whiteLayer = this._game.add.image(this._game.width / 2, this._game.height / 2, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_WHITE_LAYER);
            this._whiteLayer.width = this._game.width;
            this._whiteLayer.height = this._game.height;
            this._whiteLayer.anchor.set(0.5);
            var tutBox = this._game.add.group();
            var blackBox = this._game.add.image(this._game.width / 2, this._game.height * .7, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_BOX_2);
            blackBox.anchor.set(0.5);
            var text = this.getText("TAP LEFT OR RIGHT\nTO CONTROL YOUR CAR", blackBox.x, blackBox.top + blackBox.height * .16);
            var carImg = this._game.add.image(this._carImg.x, this._carImg.y, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_CAR);
            carImg.anchor.set(0.5);
            carImg.scale.set(0.9);
            var touchSpotLeft = this._game.add.image(blackBox.left + blackBox.width * .2, blackBox.bottom - blackBox.height * .22, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_TOUCH);
            touchSpotLeft.anchor.set(0.5);
            var touchSpotRight = this._game.add.image(blackBox.right - blackBox.width * .2, blackBox.bottom - blackBox.height * .22, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_TOUCH);
            touchSpotRight.anchor.set(0.5);
            //let handRight = this._game.add.image(touchSpotRight.x + touchSpotRight.width * .13, touchSpotRight.y + touchSpotRight.height * .17, StringConstants.ATLAS_TUTORIAL, StringConstants.AK_TUT_HAND);
            var handLeft = this._game.add.image(touchSpotLeft.x - touchSpotLeft.width * .5, touchSpotLeft.y + touchSpotLeft.height * .57, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_HAND);
            handLeft.anchor.set(0.5);
            //let handRight = this._game.add.image(touchSpotRight.x + touchSpotRight.width * .13, touchSpotRight.y + touchSpotRight.height * .17, StringConstants.ATLAS_TUTORIAL, StringConstants.AK_TUT_HAND);
            var handRight = this._game.add.image(touchSpotRight.x + touchSpotRight.width * .5, touchSpotRight.y + touchSpotRight.height * .57, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_HAND);
            handRight.anchor.set(0.5);
            handRight.scale.x = -1;
            var arrowLeft = this._game.add.image(touchSpotLeft.x - touchSpotLeft.width * .14, touchSpotLeft.top - touchSpotLeft.height * .18, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_ARROW);
            arrowLeft.anchor.set(0.5, 1);
            var arrowRight = this._game.add.image(touchSpotRight.x + touchSpotRight.width * .14, touchSpotRight.top - touchSpotRight.height * .18, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_ARROW);
            arrowRight.anchor.set(0.5, 1);
            arrowRight.scale.x = -1;
            //do the tweeens
            var rHandTweenDown = this._game.add.tween(handRight).to({ x: touchSpotRight.x + touchSpotRight.width * .13, y: touchSpotRight.y + touchSpotRight.height * .17 }, 800, Phaser.Easing.Linear.None, true);
            var lHandTweenDown = this._game.add.tween(handLeft).to({ x: touchSpotLeft.x - touchSpotLeft.width * .13, y: touchSpotLeft.y + touchSpotLeft.height * .17 }, 800, Phaser.Easing.Linear.None, false);
            var rHandTweenUp = this._game.add.tween(handRight).to({ x: touchSpotRight.x + touchSpotRight.width * .5, y: touchSpotRight.y + touchSpotRight.height * .57 }, 800, Phaser.Easing.Linear.None, false);
            var lHandTweenUp = this._game.add.tween(handLeft).to({ x: touchSpotLeft.x - touchSpotLeft.width * .5, y: touchSpotLeft.y + touchSpotRight.height * .57 }, 800, Phaser.Easing.Linear.None, false);
            var carRRotationTween = this._game.add.tween(carImg).to({ angle: 32 }, 800, Phaser.Easing.Linear.None, false);
            carRRotationTween.onComplete.addOnce(function () {
                carRRotationTween.updateTweenData("duration", 1600);
            }, this);
            carRRotationTween.onUpdateCallback(function (tween, value, tweenData) {
                this._carImg.angle = carImg.angle;
            }, this);
            //let carCenterRotationTween: Phaser.Tween = this._game.add.tween(carImg).to({angle: 0}, 800, Phaser.Easing.Linear.None, false);
            var carLRotationTween = this._game.add.tween(carImg).to({ angle: -32 }, 1600, Phaser.Easing.Linear.None, false);
            carLRotationTween.onUpdateCallback(function (tween, value, tweenData) {
                this._carImg.angle = carImg.angle;
            }, this);
            rHandTweenDown.chain(carRRotationTween);
            carRRotationTween.chain(rHandTweenUp);
            rHandTweenUp.chain(lHandTweenDown);
            lHandTweenDown.chain(carLRotationTween);
            carLRotationTween.chain(lHandTweenUp);
            lHandTweenUp.chain(rHandTweenDown);
            this._activeTweens.push(rHandTweenDown);
            this._activeTweens.push(lHandTweenDown);
            this._activeTweens.push(rHandTweenUp);
            this._activeTweens.push(lHandTweenUp);
            this._activeTweens.push(carRRotationTween);
            this._activeTweens.push(carLRotationTween);
            this._activeTutBoxes = this._game.add.group();
            tutBox.add(blackBox);
            tutBox.add(text);
            tutBox.add(touchSpotLeft);
            tutBox.add(touchSpotRight);
            tutBox.add(carImg);
            tutBox.add(handLeft);
            tutBox.add(handRight);
            tutBox.add(arrowLeft);
            tutBox.add(arrowRight);
            this._activeTutBoxes.add(tutBox);
            this._game.camera.flash(0xffffff, this.FADE_DURATION);
            this._game.camera.onFlashComplete.add(function () {
                this._currentPart = eTutorialPart.ONE;
            }, this);
            //init touchfield
            this._touchField = this._game.add.sprite(0, 0);
            this._touchField.fixedToCamera = true;
            this._touchField.scale.setTo(this._game.width, this._game.height);
            this._touchField.inputEnabled = true;
            this._touchField.events.onInputDown.add(this.handleTouch, this);
            if (App.Global.GAMEE && App.Global.LOG_EVENTS)
                Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_TUTORIAL_START, "tutStart");
        };
        //needs to be called from update... it only fills the progress bar in second tutorial part
        TutorialController.prototype.HandleTutorial = function () {
            //this is here because of weird camera movement during tutorial on some devices
            this._game.camera.y = 0;
            if (this._currentPart == eTutorialPart.TWO) {
                this._currentBarVal += this.PROGRESS_BAR_ADD;
                this._tutLevelProgressBar.UpdateBarProgress(this._currentBarVal);
                if (this._currentBarVal >= 1) {
                    this._currentBarVal = 0;
                }
            }
        };
        TutorialController.prototype.initTutPart2 = function () {
            this._activeTutBoxes = this._game.add.group();
            var tutBox = this._game.add.group();
            var blackBox = this._game.add.image(this._game.width / 2, this._game.height * .2, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_BOX_1);
            blackBox.anchor.set(0.5);
            var text = this.getText("YOUR GOAL IS TO FILL THE XP BAR\nBY AVOIDING COP CARS\nAND DESTROYING THEM", blackBox.x, blackBox.bottom - blackBox.height * .22);
            this._tutLevelProgressBar = this._UIHandler.GetLevelBarForTut();
            this._tutLevelProgressBar.UpdateBarProgress(0);
            tutBox.add(blackBox);
            tutBox.add(this._tutLevelProgressBar);
            tutBox.add(text);
            this._activeTutBoxes.add(tutBox);
            this._activeTutBoxes.alpha = 0;
            this.showCurrentTut(eTutorialPart.TWO);
        };
        TutorialController.prototype.initTutPart3 = function () {
            this._activeTutBoxes = this._game.add.group();
            var mbBox = this._game.add.image(this._fakeMBIcon.x, this._fakeMBIcon.y, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_BOX_3);
            mbBox.anchor.set(0, 0.5);
            var topMBIcon = this._game.add.image(this._fakeMBIcon.x, this._fakeMBIcon.y, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_MYSTERY_BOX_POINTER);
            topMBIcon.anchor.set(-0.2, 0.5);
            var text1 = this.getText("MYSTERY BOX\nINDICATOR", mbBox.left + mbBox.width * .62, mbBox.y + mbBox.height * .05);
            var fakeMoneyBox = this._game.add.image(this._fakeMoneyIcon.x, this._fakeMoneyIcon.y, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_BOX_3);
            fakeMoneyBox.anchor.set(1, 0.5);
            var fakeMoneyIcon = this._game.add.image(this._fakeMoneyIcon.x, this._fakeMoneyIcon.y, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_MONEY_POINTER);
            fakeMoneyIcon.anchor.set(1.2, 0.5);
            var text2 = this.getText("MONEY\nINDICATOR", fakeMoneyBox.right - fakeMoneyBox.width * .62, fakeMoneyBox.y + fakeMoneyBox.height * .05);
            var fakePoliceBox = this._game.add.image(this._fakePoliceIcon.x, this._fakePoliceIcon.y, PoliceRunners.StringConstants.ATLAS_TUTORIAL, PoliceRunners.StringConstants.AK_TUT_BOX_3);
            fakePoliceBox.anchor.set(1, 0.5);
            var fakePoliceIcon = this._game.add.image(this._fakePoliceIcon.x, this._fakePoliceIcon.y, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_COP_POINTER);
            fakePoliceIcon.anchor.set(1.2, 0.5);
            var text3 = this.getText("POLICE\nINDICATOR", fakePoliceBox.right - fakePoliceBox.width * .62, fakePoliceBox.y + fakePoliceBox.height * .05);
            this._activeTutBoxes.add(mbBox);
            this._activeTutBoxes.add(topMBIcon);
            this._activeTutBoxes.add(text1);
            this._activeTutBoxes.add(fakeMoneyBox);
            this._activeTutBoxes.add(fakeMoneyIcon);
            this._activeTutBoxes.add(text2);
            this._activeTutBoxes.add(fakePoliceBox);
            this._activeTutBoxes.add(fakePoliceIcon);
            this._activeTutBoxes.add(text3);
            var mbBoxTween = this._game.add.tween(topMBIcon.scale).to({ x: 1.1, y: 1.1 }, 800, Phaser.Easing.Linear.None, true, 0, -1, true);
            var fakeMoneyIconTween = this._game.add.tween(fakeMoneyIcon.scale).to({ x: 1.1, y: 1.1 }, 800, Phaser.Easing.Linear.None, true, 400, -1, true);
            var fakePoliceIconTween = this._game.add.tween(fakePoliceIcon.scale).to({ x: 1.1, y: 1.1 }, 800, Phaser.Easing.Linear.None, true, 800, -1, true);
            this._activeTweens.push(mbBoxTween);
            this._activeTweens.push(fakeMoneyIconTween);
            this._activeTweens.push(fakePoliceIconTween);
            this._activeTutBoxes.alpha = 0;
            this.showCurrentTut(eTutorialPart.THREE);
        };
        TutorialController.prototype.handleTouch = function () {
            if (this._currentPart === eTutorialPart.BETWEEN_PARTS)
                return;
            Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_POP);
            //check for output
            switch (this._currentPart) {
                case eTutorialPart.ONE:
                    this.destroyCurrentTut(this.initTutPart2);
                    break;
                case eTutorialPart.TWO:
                    this.destroyCurrentTut(this.initTutPart3);
                    break;
                case eTutorialPart.THREE:
                    this.destroyCurrentTut(null);
                    break;
                default:
                    break;
            }
        };
        TutorialController.prototype.destroyElement = function (elementToDestroy) {
            elementToDestroy.destroy();
            this._activeTutBoxes = null;
            this._activeTweens = [];
            if (this._afterDestroyFunction != null) {
                this._afterDestroyFunction();
                this._afterDestroyFunction = null;
            }
        };
        TutorialController.prototype.DestroyTutorial = function () {
            this._activeTutBoxes.destroy();
            this._carImg.destroy();
            this._copsImg.destroy();
            this._fakeMBIcon.destroy();
            this._fakeMoneyIcon.destroy();
            this._fakePoliceIcon.destroy();
            this._whiteLayer.destroy();
            this._touchField.destroy();
            this._carSkidmarks.destroy();
        };
        TutorialController.prototype.killTutorial = function () {
            //destroy tut
            this.DestroyTutorial();
            this._game.camera.flash(0xffffff, this.FADE_DURATION / 2);
            if (App.Global.GAMEE && App.Global.LOG_EVENTS)
                Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_TUTORIAL_FINISHED, "tutEnd");
            this.OnTutorialComplete.dispatch();
        };
        TutorialController.prototype.getText = function (textToShow, xPos, yPos) {
            var tutorialText = this._game.add.bitmapText(xPos, yPos, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, textToShow, 28);
            tutorialText.anchor.set(0.5);
            tutorialText.align = 'center';
            return tutorialText;
        };
        TutorialController.prototype.destroyCurrentTut = function (afterFadeCallback) {
            for (var i = 0; i < this._activeTweens.length; i++) {
                this._activeTweens[i].stop();
            }
            if (this._currentPart != eTutorialPart.THREE) {
                this._game.add.tween(this._activeTutBoxes).to({ alpha: 0 }, this.FADE_DURATION / 2, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                    this.destroyElement(this._activeTutBoxes);
                }, this);
                this._afterDestroyFunction = afterFadeCallback;
            }
            else {
                this._game.camera.fade(0xffffff, this.FADE_DURATION / 2);
                this._game.camera.onFadeComplete.add(function () {
                    this.killTutorial();
                }, this);
            }
            this._currentPart = eTutorialPart.BETWEEN_PARTS;
        };
        TutorialController.prototype.showCurrentTut = function (partAfterShow) {
            this._game.add.tween(this._activeTutBoxes).to({ alpha: 1 }, this.FADE_DURATION / 2, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                this._currentPart = partAfterShow;
            }, this);
        };
        return TutorialController;
    }());
    PoliceRunners.TutorialController = TutorialController;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    //first state entered - init some settings and preload files needed on load screen
    var State_boot = /** @class */ (function (_super) {
        __extends(State_boot, _super);
        function State_boot() {
            var _this = _super.call(this) || this;
            _this._userScale = new Phaser.Point(1, 1);
            _this._gameDims = new Phaser.Point();
            return _this;
        }
        State_boot.prototype.init = function () {
            if (App.Global.GAMEE) {
                //https://photonstorm.github.io/phaser-ce/Phaser.Stage.html#disableVisibilityChange
                this.stage.disableVisibilityChange = true;
            }
            //TODO uncomment
            this.calcGameDims();
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.scale.setGameSize(this._gameDims.x, this._gameDims.y);
            this.scale.setUserScale(this._userScale.x, this._userScale.y);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            if (!this.game.device.desktop) {
                this.scale.forceOrientation(false, true);
                //TODO budeme delat nejake dodatecne veci pri zmene orientace?
                // game.scale.enterIncorrectOrientation.add(function() {
                //   game.paused = true;
                //   document.querySelector("canvas").style.display = "none";
                //   document.getElementById("wrongorientation").style.display = "block";
                // })
                // game.scale.leaveIncorrectOrientation.add(function() {
                //   game.paused = false;
                //   document.querySelector("canvas").style.display = "block";
                //   document.getElementById("wrongorientation").style.display = "none";
                // })
            }
        };
        State_boot.prototype.create = function () {
            // if (App.Global.GAMEE) {
            //   this.game["onSound"](Gamee.Gamee.instance.sound);
            // }
            //small hack which enables custom font usage
            // this.game.add.text(0, 0, "hack", { font: "1px avengeance_mightiest_avenger", fill: "#FFFFFF" });
            this.game.state.start(PoliceRunners.StringConstants.STATE_PRELOAD);
        };
        State_boot.prototype.calcGameDims = function () {
            var winWidth = window.innerWidth == 0 ? App.Global.MIN_WIDTH : window.innerWidth;
            var winHeight = window.innerHeight == 0 ? App.Global.MIN_HEIGHT : window.innerHeight;
            // let w = Math.min(Math.max(App.Global.MIN_WIDTH, window.innerWidth), App.Global.GAME_WIDTH);
            // let h = Math.min(Math.max(App.Global.MIN_HEIGHT, window.innerHeight), App.Global.GAME_HEIGHT);
            // FOR X
            // limit width on desktop
            if (winWidth > winHeight || this.game.device.desktop) {
                winWidth = winHeight * (App.Global.GAME_WIDTH / App.Global.GAME_HEIGHT);
            }
            // calculate scale x. Size after scale is truncated (scaleX * game width).
            // Add small amount to width so scale is bigger for very small amount and we do not loose
            // 1px line because of number precision
            var scaleX = (winWidth + 0.01) / App.Global.GAME_WIDTH;
            // get game height with dividing window height with scale x (we want scale x
            // to be equal to scale y to aviod stretching). Then adjust scale y in the same way as scale x
            var gameHeight = Math.round(winHeight / (winWidth / App.Global.GAME_WIDTH));
            // limit game height to 1073
            //gameHeight = Math.min(gameHeight, 1073);
            var scaleY = (winHeight + 0.01) / gameHeight;
            // limit user scale
            //scaleX = Math.min(scaleX, 1);
            //scaleY = Math.min(scaleY, 1);
            // save new values
            this._userScale.set(scaleX, scaleY);
            this._gameDims.set(App.Global.GAME_WIDTH, gameHeight);
        };
        return State_boot;
    }(Phaser.State));
    PoliceRunners.State_boot = State_boot;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var GameOptions = /** @class */ (function () {
        function GameOptions() {
        }
        GameOptions.MAX_VELOCITY = 32;
        GameOptions.TURN_FORCE = 100;
        GameOptions.ANGULAR_DRAG = 0.95; //od 0 az do 1
        GameOptions.BODY_DRAG = 0.6;
        GameOptions.ANGLE_CHANGE = 215;
        GameOptions.MAX_TIME_IN_ONE_DIR = 2000;
        GameOptions.ACCELERATION_VALUE = 40000;
        GameOptions.SIDE_THRUST_VAL = 64000;
        GameOptions.SIDE_THRUST_ACC_VAL = 20000;
        GameOptions.BRAKE_VALUE = 10000;
        GameOptions.BODY_MASS = 1; //
        GameOptions.POLICE_SPEED = 900;
        GameOptions.POLICE_ANGULAR_DRAG = 0.9;
        GameOptions.POLICE_BODY_DRAG = 0.6;
        GameOptions.POLICE_BODY_MASS = 1;
        GameOptions.POLICE_DAMAGE = 35;
        GameOptions.POLICE_ANGLE_MULT = 0.5;
        GameOptions.PIXELS_TO_METERS_COEFF = 10;
        GameOptions.XP_OBTAIN_INTERVAL = 10000;
        GameOptions.XP_OBTAIN_ON_INTERVAL_BASE = 10;
        GameOptions.XP_OBTAIN_ON_NEAR_MISS_BASE = 10;
        GameOptions.DAILY_REWARD_NUM_OF_MONEY_GENERATED = 20;
        GameOptions.AFTER_DAILY_RACE_COUNTDOWN = 10;
        GameOptions.GENERATEINTERVAL_POLICE = 1500;
        GameOptions.GENERATEINTERVAL_POWERUP = 3000;
        GameOptions.GENERATECLOUDSINTERVAL = 300;
        GameOptions.GENERATEMAGNETPROB = 0.1;
        GameOptions.GENERATESPEEDBOOSTPROB = 0.3;
        GameOptions.GENERATEAMMOPROB = 0.5;
        GameOptions.MAX_PARTICLES = 50;
        GameOptions.MAX_PARTICLE_LIFE = 2000;
        GameOptions.AFTER_CRASH_TIME = 1000;
        GameOptions.REG_TIME_POWERUP_SHOW = 2000;
        GameOptions.OIL_SPILL_DURATION = 6000;
        GameOptions.OIL_SPILL_INTERVAL = 133;
        GameOptions.OIL_SPILL_AFFECT_DURATION = 1000;
        GameOptions.SPIKE_STRIP_DURATION = 6000;
        GameOptions.SPIKE_STRIP_AFFECT_DURATION = 2000;
        GameOptions.SPIKE_STRIP_INTERVAL = 150;
        GameOptions.SPIKE_STRIP_RECOVERY_DURATION = 2000;
        GameOptions.CARMAGEDDON_DURATION = 10000;
        GameOptions.SCORE_DOUBLE_DURATION = 10000;
        GameOptions.RACE_CHECKPOINTS_DISTANCE = 2000;
        GameOptions.INGAME_FRIEND_ICON_POLICE_DIST = 50;
        GameOptions.FRIENDS_GEN_MIN_CARS_TO_NEXT = 2;
        GameOptions.FRIENDS_GEN_MAX_CARS_TO_NEXT = 5;
        GameOptions.NITRO_DURATION = 3000;
        GameOptions.NITRO_MAX_VELOCITY = 60;
        GameOptions.NITRO_ACCELERATION_VALUE = 90000;
        GameOptions.SHIELD_DURATION = 8000;
        GameOptions.COMBO_DURATION = 4000;
        GameOptions.STOP_TIME_DURATION = 3000;
        GameOptions.DEFAULT_BATTLE_CAR_ID = 4;
        GameOptions.BATTLE_VISIBILITY_MAX_SCALE = 1.2;
        GameOptions.BATTLE_VISIBILITY_MIN_SCALE = 4;
        GameOptions.BATTLE_ACC_VAL_MIN = 30000;
        GameOptions.BATTLE_ACC_VAL_MAX = 70000;
        GameOptions.BATTLE_POLICE_LEVEL_MIN = 0;
        GameOptions.BATTLE_POLICE_LEVEL_MAX = 60;
        GameOptions.BATTLE_POLICE_LEVEL = 0; //to be set
        GameOptions.BATTLE_SPILL_GEN_MIN = 500;
        GameOptions.BATTLE_SPILL_GEN_MAX = 4200;
        GameOptions.BATTLE_SPILL_INTERVAL = 0; //to be set
        GameOptions.BATTLE_SPILL_OIL_KILL_DIST = 2000;
        GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED = false;
        GameOptions.BG_SCALE_STANDARD = 1.2;
        GameOptions.BG_SCALE_ZOOMED = 1.6;
        //durations given in seconds
        GameOptions.BOOSTER_DURATION = 600;
        GameOptions.DAILY_RACE_TIMEOUT = 86400;
        return GameOptions;
    }());
    PoliceRunners.GameOptions = GameOptions;
    ;
    var GameGlobalVariables = /** @class */ (function () {
        function GameGlobalVariables() {
        }
        return GameGlobalVariables;
    }());
    PoliceRunners.GameGlobalVariables = GameGlobalVariables;
    var ePlayState;
    (function (ePlayState) {
        ePlayState[ePlayState["GAMEE_LAYER"] = 0] = "GAMEE_LAYER";
        ePlayState[ePlayState["IDLE"] = 1] = "IDLE";
        ePlayState[ePlayState["MENU"] = 2] = "MENU";
        ePlayState[ePlayState["FORCE_RESET"] = 3] = "FORCE_RESET";
        ePlayState[ePlayState["TUTORIAL"] = 4] = "TUTORIAL";
        ePlayState[ePlayState["PLAY"] = 5] = "PLAY";
    })(ePlayState || (ePlayState = {}));
    ;
    var eScreenSide;
    (function (eScreenSide) {
        eScreenSide[eScreenSide["LEFT"] = 0] = "LEFT";
        eScreenSide[eScreenSide["RIGHT"] = 1] = "RIGHT";
        eScreenSide[eScreenSide["UP"] = 2] = "UP";
        eScreenSide[eScreenSide["DOWN"] = 3] = "DOWN";
    })(eScreenSide = PoliceRunners.eScreenSide || (PoliceRunners.eScreenSide = {}));
    ;
    var eBoosterType;
    (function (eBoosterType) {
        eBoosterType[eBoosterType["RAGE"] = 0] = "RAGE";
        eBoosterType[eBoosterType["DOUBLE_MONEY"] = 1] = "DOUBLE_MONEY";
        eBoosterType[eBoosterType["MYSTERY_BOXES"] = 2] = "MYSTERY_BOXES";
        eBoosterType[eBoosterType["COMBO_TIME"] = 3] = "COMBO_TIME";
    })(eBoosterType = PoliceRunners.eBoosterType || (PoliceRunners.eBoosterType = {}));
    ;
    var eGameType;
    (function (eGameType) {
        eGameType[eGameType["NOT_SET"] = 0] = "NOT_SET";
        eGameType[eGameType["REGULAR"] = 1] = "REGULAR";
        eGameType[eGameType["DAILY_RACE"] = 2] = "DAILY_RACE";
    })(eGameType = PoliceRunners.eGameType || (PoliceRunners.eGameType = {}));
    ;
    var State_game = /** @class */ (function (_super) {
        __extends(State_game, _super);
        function State_game() {
            var _this = _super.call(this) || this;
            _this._currentArea = 0;
            _this._score = 0;
            _this._playState = ePlayState.GAMEE_LAYER;
            _this._currentRaceType = eGameType.NOT_SET;
            _this._gameOver = false;
            _this._levelPrepared = false;
            _this._currentPoliceMax = 0;
            _this._currentWantedLevel = 0;
            _this._numOfPoliceCars = 0;
            _this._numOfDestroyedCars = 0;
            _this._afterCrash = false;
            _this._afterCrashTime = 0;
            _this._currentComboCounter = 0;
            _this._comboRunning = false;
            _this._comboTime = 0;
            _this._nitroTime = 0;
            _this._shieldTime = 0;
            _this._oilSpillingTime = 0;
            _this._timeSinceLastOilSpill = 0;
            _this._spikeSpillingTime = 0;
            _this._timeSinceLastSpikeSpill = 0;
            _this._carmageddonTime = 0;
            _this._scoreDoubleOn = false;
            _this._scoreDoubleTime = 0;
            _this._timeLimitTime = 0;
            _this._totalMoneyPicked = 0;
            _this._raceTime = 0;
            //private _currentLevel: number = 0;
            _this._nextLevelVal = 0;
            _this._currentXP = 0;
            _this._nextLevelReached = false;
            _this._playTime = 0;
            _this._XPObtainTime = 0;
            _this._stopTimeDuration = 0;
            _this._battleOilSpillsEnabled = false;
            _this._battleOilSpillInterval = 0;
            _this._firstGameStart = false;
            _this._policeCarsSinceLastFriendShow = 0;
            _this._nextFriendGenAt = 0;
            _this._genTimePolice = 0;
            _this._genTimePowerUp = 0;
            _this._policeCars = [];
            _this._powerUps = [];
            _this._battleOilSpills = [];
            _this._generateStuff = true;
            _this._firstTouch = true;
            _this._videoRewardShown = false;
            _this._afterVideoWatchWait = false;
            _this._doubleMoneyOnEnd = false;
            _this._doubleMoneyClicked = false;
            _this._battleScreenCreated = false;
            _this._waitingForBattleData = false;
            _this._policeCrashSounds = [PoliceRunners.StringConstants.SOUND_CRASH_POLICE_POLICE1, PoliceRunners.StringConstants.SOUND_CRASH_POLICE_POLICE2];
            _this._playerCrashSounds = [PoliceRunners.StringConstants.SOUND_CRASH_POLICE_PLAYER1, PoliceRunners.StringConstants.SOUND_CRASH_POLICE_PLAYER2];
            return _this;
        }
        State_game.prototype.create = function () {
            this.precomputeConstants();
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.setImpactEvents(true);
            this.game.physics.p2.gravity.x = 0;
            this.game.physics.p2.gravity.y = 0;
            this._playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this._powerUpCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this._activatedPowerUpCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this._policeCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this._checkpointRaceCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this._nearMissCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.setPostBroadphaseCallback(this.postBroadPhaseCallback, this); //TODO CARMAGEDDON STUFF
            //SHOW FPS TODO delete later
            //this.game.plugins.add(Phaser.Plugin.AdvancedTiming);
            //game settings //TODO uncomment later
            this._gameSettingsHandler = new PoliceRunners.GameSettingsHandler(this.game);
            //click event handling
            this._touchFieldLeft = this.game.add.sprite(0, 0);
            this._touchFieldLeft.fixedToCamera = true;
            this._touchFieldLeft.width = GameGlobalVariables.GAME_HALF_WIDTH;
            this._touchFieldLeft.height = this.game.height;
            this._touchFieldLeft.inputEnabled = true;
            this._touchFieldRight = this.game.add.sprite(GameGlobalVariables.GAME_HALF_WIDTH, 0);
            this._touchFieldRight.fixedToCamera = true;
            this._touchFieldRight.width = GameGlobalVariables.GAME_HALF_WIDTH;
            this._touchFieldRight.height = this.game.height;
            this._touchFieldRight.inputEnabled = true;
            //handle layers
            this._bgLayer = this.game.add.group();
            this._playerCarLayer = this.game.add.group();
            this._sceneObjectsLayer = this.game.add.group();
            this._aboveTheCars = this.game.add.group();
            this._frontLayer = this.game.add.group();
            this._UILayer = this.game.add.group();
            //TODO uncomment when we need item generators
            this._sceneObjectGenerator = new PoliceRunners.ObjectGenerator(this.game, this._gameSettingsHandler, this._sceneObjectsLayer, this._bgLayer, this._frontLayer);
            this._sceneObjectGenerator.SetCurrentThresholds(this._currentArea);
            this._animInstantiator = new Base.OneShotAnimInstantiator(this.game, this._sceneObjectsLayer);
            this._policeRadioManager = new PoliceRunners.PoliceRadioManager(this.game);
            this._particleEmmiter = new Base.ParticleEmmiter(this.game);
            this._aboveTheCars.add(this._particleEmmiter.SmokeParticleEmmiter);
            //UI and signals handling
            this._UI = new PoliceRunners.UI.UIHandler(this.game, this._gameSettingsHandler, this._UILayer, this._aboveTheCars);
            this._UI.OnStartClick.add(this.startZoomOut, this);
            this._UI.OnCarChange.add(this.setupCar, this);
            //uncomment without gamee emu
            //this._UI.ShowMainMenu();
            //TODO mission manager???
            this._dailyRaceManager = new PoliceRunners.DailyRaceManager(this.game, this._UI, this._bgLayer);
            //create some objects on the start
            this._bgLayer.add(this.createGameBg());
            this._bgLayer.add(this.createGameBgOverlay());
            if (App.Global.GAMEE && Gamee.Gamee.instance.IsBattle)
                this._aboveTheCars.add(this.createBattleRainAnim());
            this._behindTheCarObjsGenerator = new PoliceRunners.BehindTheCarObjGenerator(this.game, this._bgLayer);
            //prepareCollisions
            this.initPoliceCarsPools(PoliceRunners.StringConstants.KEY_POLICE1);
            this.initPoliceCarsPools(PoliceRunners.StringConstants.KEY_POLICE2);
            this.initPoliceCarsPools(PoliceRunners.StringConstants.KEY_POLICE3);
            this.initPoliceCarsPools(PoliceRunners.StringConstants.KEY_POLICE4);
            this.initPoliceCarsPools(PoliceRunners.StringConstants.KEY_POLICE5);
            this.initPowerUpPools(PoliceRunners.ePowerUpType.MONEY);
            this.initPowerUpPools(PoliceRunners.ePowerUpType.MYSTERY_BOX);
            this.initActivatedPowerUpPool(PoliceRunners.eActivatedPowerUpType.OIL_SPILL);
            this.initActivatedPowerUpPool(PoliceRunners.eActivatedPowerUpType.SPIKE_STRIP);
            //this.initRaceCheckpoint();//TODO uncomment later when needed
            //create desktop controls if needed
            if (this.game.device.desktop) {
                //console.log("CREATING CURSOR KEYS!!!");
                this._cursors = this.input.keyboard.createCursorKeys();
            }
            if (App.Global.GAMEE) {
                this._playState = ePlayState.GAMEE_LAYER;
                Gamee.Gamee.instance.gameReady(this.prepareGameData.bind(this));
            }
            // to start play if not Gamee
            else {
                //TODO smazat potom?
                Gamee.PlayerDataStorage.Instance.InitDataFirstTime();
                this._playState = ePlayState.FORCE_RESET;
            }
            Gamee.GameeSocialDataManager.Instance.Initialize(this.game);
            Utils.PhaserUtils.ShowGameVersion(this.game, "0.797");
            Utils.DateUtils.GetTimestampInSeconds();
        };
        State_game.prototype.initPoliceCarsPools = function (policeCarType) {
            var PoliceCarsPool;
            switch (policeCarType) {
                case PoliceRunners.StringConstants.KEY_POLICE1:
                    PoliceCarsPool = this._sceneObjectGenerator.Police1CarsPool;
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE2:
                    PoliceCarsPool = this._sceneObjectGenerator.Police2CarsPool;
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE3:
                    PoliceCarsPool = this._sceneObjectGenerator.Police3CarsPool;
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE4:
                    PoliceCarsPool = this._sceneObjectGenerator.Police4CarsPool;
                    break;
                case PoliceRunners.StringConstants.KEY_POLICE5:
                    PoliceCarsPool = this._sceneObjectGenerator.Police5CarsPool;
                    break;
                default:
                    break;
            }
            for (var i = 0; i < PoliceCarsPool.Pool.length; i++) {
                PoliceCarsPool.Pool[i].InitCollisionGroups(this._policeCollisionGroup);
                PoliceCarsPool.Pool[i].body.collides([this._policeCollisionGroup, this._playerCollisionGroup, this._activatedPowerUpCollisionGroup, this._nearMissCollisionGroup], this.onCarsCollisionHandler, this);
                PoliceCarsPool.Pool[i].body.collides(this._playerCollisionGroup, this.onPlayerPoliceCollision, this);
            }
        };
        State_game.prototype.initActivatedPowerUpPool = function (powerUpType) {
            var activatedPowerUpPool;
            var onHitCallback;
            switch (powerUpType) {
                case PoliceRunners.eActivatedPowerUpType.OIL_SPILL:
                    activatedPowerUpPool = this._behindTheCarObjsGenerator.OilSpillsPool;
                    onHitCallback = this.onOilSpillHit;
                    break;
                case PoliceRunners.eActivatedPowerUpType.SPIKE_STRIP:
                    activatedPowerUpPool = this._behindTheCarObjsGenerator.SpikesPool;
                    onHitCallback = this.onSpikeStripHit;
                    break;
            }
            for (var i = 0; i < activatedPowerUpPool.Pool.length; i++) {
                activatedPowerUpPool.Pool[i].body.setCollisionGroup(this._activatedPowerUpCollisionGroup);
                activatedPowerUpPool.Pool[i].body.collides([this._policeCollisionGroup, this._playerCollisionGroup]);
                activatedPowerUpPool.Pool[i].body.onBeginContact.add(onHitCallback, this);
            }
        };
        State_game.prototype.initBattleOilSpillsPool = function () {
            for (var i = 0; i < this._sceneObjectGenerator.BattleOilSpillsPool.Pool.length; i++) {
                this._sceneObjectGenerator.BattleOilSpillsPool.Pool[i].body.setCollisionGroup(this._activatedPowerUpCollisionGroup);
                this._sceneObjectGenerator.BattleOilSpillsPool.Pool[i].body.collides([this._policeCollisionGroup, this._playerCollisionGroup]);
                this._sceneObjectGenerator.BattleOilSpillsPool.Pool[i].body.onBeginContact.add(this.onOilSpillHit, this);
            }
        };
        State_game.prototype.initRaceCheckpoint = function () {
            this._dailyRaceManager.CheckpointSprite.body.setCollisionGroup(this._checkpointRaceCollisionGroup);
            this._dailyRaceManager.CheckpointSprite.body.collides(this._playerCollisionGroup);
            this._dailyRaceManager.CheckpointSprite.body.onBeginContact.add(this.onRaceCheckpointHit, this);
        };
        State_game.prototype.InitPlayerCar = function (carID, maxHP, maxCombo) {
            this._playerCar = new PoliceRunners.PlayerCar(this.game, GameGlobalVariables.GAME_HALF_WIDTH, GameGlobalVariables.GAME_HALF_HEIGHT, carID, maxHP, maxCombo); //TODO maybe add better camera behaviour
            this._playerCarLayer.add(this._playerCar);
            this._playerCar.body.setCollisionGroup(this._playerCollisionGroup);
            this._playerCar.body.collides([this._policeCollisionGroup, this._powerUpCollisionGroup,
                this._activatedPowerUpCollisionGroup, this._checkpointRaceCollisionGroup], this.onPlayerCollision, this);
            this._playerCar.body.onBeginContact.add(this.onPowerUpHit, this);
            this._playerCar.NearMissBody.body.setCollisionGroup(this._policeCollisionGroup);
            this._playerCar.NearMissBody.body.collides(this._policeCollisionGroup);
            this._playerCar.NearMissBody.body.onEndContact.add(this.onNearMissHit, this);
            //TODO PHYSICS TEST - bounciness
            // let material1 = this.game.physics.p2.createMaterial();
            // let material2 = this.game.physics.p2.createMaterial();
            // this.game.physics.p2.createContactMaterial(material1, material2, { friction: 10 , restitution: 7.0 });
            // this._playerCar.body.setMaterial(material1);
            // for (let i = 0; i< this._sceneObjectGenerator.Police1CarsPool.Pool.length; i++) {
            //   this._sceneObjectGenerator.Police1CarsPool.Pool[i].body.setMaterial(material2);
            // }
        };
        State_game.prototype.initPowerUpPools = function (powerupType) {
            var powerUpPool;
            switch (powerupType) {
                case PoliceRunners.ePowerUpType.MONEY:
                    powerUpPool = this._sceneObjectGenerator.MoneyPickupPool;
                    break;
                case PoliceRunners.ePowerUpType.MYSTERY_BOX:
                    powerUpPool = this._sceneObjectGenerator.MysteryBoxPool;
                    break;
                default:
                    break;
            }
            for (var i = 0; i < powerUpPool.Pool.length; i++) {
                powerUpPool.Pool[i].InitCollisionGroups(this._powerUpCollisionGroup);
                powerUpPool.Pool[i].body.collides(this._playerCollisionGroup, this.onPlayerCollision, this);
            }
        };
        State_game.prototype.precomputeConstants = function () {
            GameGlobalVariables.GAME_HALF_WIDTH = this.game.width / 2;
            GameGlobalVariables.GAME_HALF_HEIGHT = this.game.height / 2;
        };
        //called only once on start
        State_game.prototype.prepareBattleScreen = function (battleData) {
            if (battleData != null && battleData.author != null) {
                this._UI.ShowBattleInitScreen(Gamee.PlayerDataStorage.Instance.BattleSettings == null ? true : false);
                Utils.PhaserImageDownloader.AddFilesToQueue(this.game, [
                    {
                        fileName: PoliceRunners.StringConstants.SPRITE_BATTLE_CREATOR_AVATAR,
                        //filePath: "https://users-devel.cdn.gamee.io/a85141cf7797f4477a8bce329ab94d0c.png"
                        filePath: battleData.author.photo
                    }
                ]);
                Utils.PhaserImageDownloader.OnFilesLoaded.addOnce(this._UI.BattleInitScreen.SetCreatorPhoto, this._UI.BattleInitScreen);
                this._battleScreenCreated = true;
                this.prepareBattleSettings();
                //If the screen has been created later than on play button click, start the game immediately
                if (this._waitingForBattleData) {
                    this._waitingForBattleData = false;
                    this.waitForBattleTap();
                }
            }
        };
        State_game.prototype.waitForBattleTap = function () {
            this._UI.BattleInitScreen.OnBattleScreenTap.addOnce(function () {
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE, true);
                this._firstGameStart = false;
                //this._playState = ePlayState.PLAY;
                this._UI.HideBattleInitScreen();
                this.startZoomOut();
            }, this);
            // let startEvent: Phaser.TimerEvent = this.game.time.events.repeat(Phaser.Timer.SECOND, 3, this._UI.BattleInitScreen.LowerCountdown, this._UI.BattleInitScreen);
            // startEvent.timer.onComplete.add(function() {
            //   Base.AudioPlayer.Instance.PlaySound(StringConstants.SOUND_CAR_ENGINE, true);
            //   this._firstGameStart = false;
            //   this._playState = ePlayState.PLAY;
            //   this._UI.HideBattleInitScreen();
            // }, this);
        };
        State_game.prototype.update = function () {
            switch (this._playState) {
                case ePlayState.GAMEE_LAYER:
                case ePlayState.MENU:
                    this._UI.HandleMenuItemsVisibility();
                    return;
                case ePlayState.FORCE_RESET:
                    this.resetGame();
                    return;
                case ePlayState.PLAY:
                    if (App.Global.GAMEE && !Gamee.Gamee.instance.gameRunning) {
                        return;
                    }
                    this.playLoop();
                    break;
                case ePlayState.TUTORIAL:
                    this._tutorialManager.HandleTutorial();
                    break;
            }
        };
        State_game.prototype.postUpdate = function () {
            if (this._playState == ePlayState.PLAY) {
                this._playerCar.UpdateNearMissBodyPosition();
                for (var i = 0, n = this._powerUps.length; i < n; i++) {
                    var powerUp = this._powerUps[i];
                    if (!powerUp.inCamera) {
                        if (powerUp.AssignedIcon != null) {
                            var dist = Math.round(this.game.math.distance(powerUp.x, powerUp.y, this._playerCar.x, this._playerCar.y) / GameOptions.PIXELS_TO_METERS_COEFF);
                            powerUp.AssignedIcon.UpdateIconPosition(powerUp, dist);
                            powerUp.AssignedIcon.visible = true;
                        }
                    }
                    else if (powerUp.AssignedIcon != null) {
                        powerUp.AssignedIcon.visible = false;
                    }
                }
                //police offscreen icons
                for (var i = 0, n = this._policeCars.length; i < n; i++) {
                    var policeCar = this._policeCars[i];
                    if (!policeCar.inCamera) {
                        if (policeCar.AssignedIcon == null) {
                            var fizlIcon = this._UI.GetPoliceOffscreenIcon();
                            if (fizlIcon != null) {
                                fizlIcon.SpawnObject(this.game.camera.x - 50, this.game.camera.y - 50);
                                policeCar.AssignedIcon = fizlIcon;
                            }
                        }
                        //update offscreen icon position
                        else {
                            var dist = Math.round(this.game.math.distance(policeCar.x, policeCar.y, this._playerCar.x, this._playerCar.y) / GameOptions.PIXELS_TO_METERS_COEFF);
                            policeCar.AssignedIcon.UpdateIconPosition(policeCar, dist);
                        }
                    }
                    else {
                        this.killOffScreenIcon(policeCar);
                    }
                    if (policeCar.GameeFriendIcon != null) {
                        policeCar.GameeFriendIcon.UpdateIconPosition(policeCar.x, policeCar.y - GameOptions.INGAME_FRIEND_ICON_POLICE_DIST);
                    }
                }
                if (this._objectToFollow != null) {
                    this._playerCar.UpdateRaceArrow(this._objectToFollow);
                }
            }
        };
        //Called every frame when in the PLAY state
        State_game.prototype.playLoop = function () {
            //showing after video0 text - either when we revived car or when we doubled money
            if (this._afterVideoWatchWait) {
                var turningLeft = this._touchFieldLeft.input.checkPointerDown(this.game.input.activePointer);
                var turningRight = this._touchFieldRight.input.checkPointerDown(this.game.input.activePointer);
                if (turningLeft || turningRight) {
                    this._afterVideoWatchWait = false;
                    this._UI.HideAfterVideoWatchText();
                    //videos are turned off now
                    // if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS)
                    //   Gamee.Gamee.instance.LoadRewardedVideo();
                    if (!this._playerCar.Alive)
                        this.commitEnd();
                    // else if (GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED && this._nextLevelReached)
                    //   this.commitEnd(true);
                }
                return;
            }
            //handle other things
            if (!this._playerCar.Alive || this._gameOver)
                return;
            if (!this._nextLevelReached) {
                this._playTime += this.game.time.physicsElapsedMS;
                this._UI.UpdateTimer(this._playTime);
            }
            if ((!App.Global.GAMEE || !Gamee.Gamee.instance.IsBattle) && this._dailyRaceManager.CurrentRaceType == PoliceRunners.DailyRaceType.NONE) {
                this._XPObtainTime += this.game.time.physicsElapsedMS;
                if (!this._nextLevelReached && this._XPObtainTime >= GameOptions.XP_OBTAIN_INTERVAL) {
                    this._XPObtainTime = 0;
                    var addedXP = GameOptions.XP_OBTAIN_ON_INTERVAL_BASE + Gamee.PlayerDataStorage.Instance.Level;
                    this._UI.ShowXPAddNotification(PoliceRunners.UI.eXPNotifyType.TIME_ADD, addedXP);
                    this.addXP(addedXP);
                }
            }
            if (this._comboRunning) {
                this._comboTime += this.game.time.physicsElapsedMS;
                if (this._comboTime >= this._comboDuration) {
                    this.stopComboCounter();
                }
                else
                    this._UI.UpdateComboBar(1 - (this._comboTime / this._comboDuration));
            }
            //timed stuff
            if (this._afterCrash) {
                this._afterCrashTime += this.game.time.physicsElapsedMS;
                if (this._afterCrashTime >= GameOptions.AFTER_CRASH_TIME) {
                    this._afterCrash = false;
                }
            }
            if (this._playerCar.NitroOn) {
                this._nitroTime += this.game.time.physicsElapsedMS;
                if (this._nitroTime >= GameOptions.NITRO_DURATION) {
                    this._playerCar.NitroOn = false;
                    this._playerCar.StopNitroAnim();
                }
            }
            if (this._playerCar.CarmageddonOn) {
                this._carmageddonTime += this.game.time.physicsElapsedMS;
                if (this._lastTakenPowerup == PoliceRunners.eActivatedPowerUpType.CARMAGEDDON)
                    this._UI.UpdatePowerUpFillBar(Math.max(1 - (this._carmageddonTime / this._carmageddonDuration)));
                if (this._carmageddonTime >= this._carmageddonDuration) {
                    this._playerCar.StopCarmageddon();
                }
            }
            if (this._playerCar.ShieldOn) {
                this._shieldTime += this.game.time.physicsElapsedMS;
                if (this._shieldTime >= GameOptions.SHIELD_DURATION) {
                    this._playerCar.ShieldOn = false;
                    this._playerCar.StopShieldAnim();
                }
            }
            if (this._scoreDoubleOn) {
                this._scoreDoubleTime += this.game.time.physicsElapsedMS;
                if (this._lastTakenPowerup == PoliceRunners.eActivatedPowerUpType.DOUBLE_SCORE)
                    this._UI.UpdatePowerUpFillBar(Math.max(1 - (this._scoreDoubleTime / GameOptions.SCORE_DOUBLE_DURATION)));
                if (this._scoreDoubleTime >= GameOptions.SCORE_DOUBLE_DURATION) {
                    this._scoreDoubleOn = false;
                }
            }
            if (this._playerCar.OilSpilling) {
                this._timeSinceLastOilSpill += this.game.time.physicsElapsedMS;
                if (this._timeSinceLastOilSpill >= GameOptions.OIL_SPILL_INTERVAL) {
                    this._behindTheCarObjsGenerator.CreateOilSpill(this._playerCar.x, this._playerCar.y, this._playerCar.rotation, this._playerCar.width * 5);
                    this._oilSpillingTime += this._timeSinceLastOilSpill;
                    this._timeSinceLastOilSpill = 0;
                    if (this._oilSpillingTime >= GameOptions.OIL_SPILL_DURATION) {
                        this._playerCar.OilSpilling = false;
                    }
                }
            }
            if (this._playerCar.SpikeSpilling) {
                this._timeSinceLastSpikeSpill += this.game.time.physicsElapsedMS;
                if (this._timeSinceLastSpikeSpill >= GameOptions.SPIKE_STRIP_INTERVAL) {
                    this._behindTheCarObjsGenerator.CreateSpike(this._playerCar.x, this._playerCar.y, this._playerCar.rotation, this._playerCar.width * 5);
                    this._spikeSpillingTime += this._timeSinceLastSpikeSpill;
                    this._timeSinceLastSpikeSpill = 0;
                    if (this._spikeSpillingTime >= GameOptions.SPIKE_STRIP_DURATION) {
                        this._playerCar.SpikeSpilling = false;
                    }
                }
            }
            // if (this._dailyRaceManager.CurrentRaceType === DailyRaceType.TIME_CHALLENGE) {
            //   this._timeLimitTime += this.game.time.physicsElapsedMS;
            //   let remaining: number = this._dailyRaceManager.TimeLimit - this._timeLimitTime;
            //   if (remaining <= 0) {
            //     this._timeLimitTime = 0;
            //     this._dailyRaceManager.EndMission(true);
            //   }
            //   else {
            //     this._UI.UpdateTimeLimitMissionText(remaining);
            //   }
            // }
            // else 
            // if (this._dailyRaceManager.CurrentRaceType === DailyRaceType.RACE) {
            //   this._raceTime += this.game.time.physicsElapsedMS;
            //   this._UI.UpdateRaceMissionText(this._raceTime, this._dailyRaceManager.CurrentCheckpoint, this._dailyRaceManager.CheckpointsTotal);
            // }
            //generators
            this._genTimePolice += this.game.time.physicsElapsedMS;
            if (this._generateStuff && this._genTimePolice >= GameOptions.GENERATEINTERVAL_POLICE) {
                if (this._numOfPoliceCars < this._currentPoliceMax) {
                    //if (this._numOfPoliceCars < 0) {
                    var policeCar = this._sceneObjectGenerator.GeneratePolice(this._playerCar.position, this._playerCar.angle);
                    if (policeCar != null) {
                        this._policeRadioManager.PlayRandomRadioSound();
                        this._numOfPoliceCars++;
                        this._policeCarsSinceLastFriendShow++;
                        //TODO dat tady podminku
                        if (this._inGameFriendsManager != null && this._inGameFriendsManager.FriendsAvatarsReady() && this._policeCarsSinceLastFriendShow >= this._nextFriendGenAt) {
                            var ingameFriendIcon = this._UI.GetGameeFriendIcon();
                            if (ingameFriendIcon != null) {
                                ingameFriendIcon.SpawnObject(policeCar.x, policeCar.y - GameOptions.INGAME_FRIEND_ICON_POLICE_DIST);
                                ingameFriendIcon.SetAvatarIcon(this._inGameFriendsManager.GetRandomFriendAvatar());
                                policeCar.GameeFriendIcon = ingameFriendIcon;
                                this._policeCarsSinceLastFriendShow = 0;
                                this._nextFriendGenAt = this.game.rnd.integerInRange(GameOptions.FRIENDS_GEN_MIN_CARS_TO_NEXT, GameOptions.FRIENDS_GEN_MAX_CARS_TO_NEXT);
                            }
                        }
                        this._policeCars.push(policeCar);
                    }
                }
                this._genTimePolice = 0;
            }
            //generate powerUp and take a look if we can destroy old one
            this._genTimePowerUp += this.game.time.physicsElapsedMS;
            if (this._generateStuff && this._genTimePowerUp >= GameOptions.GENERATEINTERVAL_POWERUP) {
                var powerUp = this._sceneObjectGenerator.GeneratePowerUp();
                if (powerUp != null) {
                    var powerUpIcon = this._UI.GetPowerUpOffscreenIcon();
                    if (powerUpIcon != null) {
                        powerUpIcon.SpawnObject(this.game.camera.x - 50, this.game.camera.y - 50, powerUp.PowerUpType);
                        powerUp.AssignedIcon = powerUpIcon;
                    }
                    this._powerUps.push(powerUp);
                }
                this._genTimePowerUp = 0;
            }
            if (this._battleOilSpillsEnabled) {
                this._battleOilSpillInterval += this.game.time.physicsElapsedMS;
                if (this._battleOilSpillInterval >= GameOptions.BATTLE_SPILL_INTERVAL) {
                    this.killOilSpillIfTooDistant();
                    var battleOilSpill = this._sceneObjectGenerator.GenerateBattleOilSpill(this._playerCar.position, this._playerCar.angle);
                    if (battleOilSpill != null) {
                        this._battleOilSpills.push(battleOilSpill);
                    }
                    this._battleOilSpillInterval = 0;
                }
            }
            //police cars
            for (var i = 0, n = this._policeCars.length; i < n; i++) {
                var policeCar = this._policeCars[i];
                if (GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED) {
                    if (!policeCar.AffectedBySpikes && !this._nextLevelReached)
                        policeCar.FollowPlayer(this._playerCar);
                    else
                        policeCar.StopTheCarContinuously();
                }
                else {
                    if (!policeCar.AffectedBySpikes)
                        policeCar.FollowPlayer(this._playerCar);
                    else
                        policeCar.StopTheCarContinuously();
                }
                this._behindTheCarObjsGenerator.CreateSkidmark(policeCar.x, policeCar.y, policeCar.body.angle);
            }
            //car movement
            if (!this._playerCar.AffectedByOilSpill && !this._playerCar.AffectedBySpikes) {
                //console.log("X: " + this.game.input.activePointer.x + ", Y: " + this.game.input.activePointer.y);
                var turningLeft = this._touchFieldLeft.input.checkPointerDown(this.game.input.activePointer) || (this._cursors != null && this._cursors.left.isDown);
                var turningRight = this._touchFieldRight.input.checkPointerDown(this.game.input.activePointer) || (this._cursors != null && this._cursors.right.isDown);
                if (turningLeft) {
                    this._playerCar.body.angle -= (((this._afterCrash || (GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED && this._nextLevelReached)) ? GameOptions.ANGLE_CHANGE * 0.75 : GameOptions.ANGLE_CHANGE) * this.time.physicsElapsed);
                    var turn = GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED ? !this._nextLevelReached : true;
                    if (!this._afterCrash && turn) {
                        this._playerCar.ThrustLeft();
                        if (!Base.AudioPlayer.Instance.IsSoundPlaying(PoliceRunners.StringConstants.SOUND_CAR_DRIFT))
                            Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_DRIFT);
                    }
                }
                else if (turningRight) {
                    this._playerCar.body.angle += (((this._afterCrash || (GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED && this._nextLevelReached)) ? GameOptions.ANGLE_CHANGE * 0.75 : GameOptions.ANGLE_CHANGE) * this.time.physicsElapsed);
                    var turn = GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED ? !this._nextLevelReached : true;
                    if (!this._afterCrash && turn) {
                        this._playerCar.ThrustRight();
                        if (!Base.AudioPlayer.Instance.IsSoundPlaying(PoliceRunners.StringConstants.SOUND_CAR_DRIFT))
                            Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_DRIFT);
                    }
                }
                else {
                    Base.AudioPlayer.Instance.StopSound(PoliceRunners.StringConstants.SOUND_CAR_DRIFT);
                }
                if (GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED) {
                    if (!this._nextLevelReached)
                        this._playerCar.Accelerate(this._playerCar.NitroOn ? GameOptions.NITRO_ACCELERATION_VALUE : GameOptions.ACCELERATION_VALUE);
                }
                else
                    this._playerCar.Accelerate(this._playerCar.NitroOn ? GameOptions.NITRO_ACCELERATION_VALUE : GameOptions.ACCELERATION_VALUE);
            }
            else if (this._playerCar.AffectedBySpikes) {
                this._playerCar.StopTheCarContinuously(0.02);
            }
            //slow down the game when level is reached
            if (GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED && this._nextLevelReached) {
                this._stopTimeDuration += this.time.physicsElapsedMS;
                this._playerCar.StopTheCarContinuously(0.002);
                if (this._stopTimeDuration >= GameOptions.STOP_TIME_DURATION) {
                    this.endGame(10);
                }
            }
            this._behindTheCarObjsGenerator.CreateSkidmark(this._playerCar.x, this._playerCar.y, this._playerCar.angle);
            this._playerCar.ConstrainVelocity(this._playerCar.NitroOn ? GameOptions.NITRO_MAX_VELOCITY : GameOptions.MAX_VELOCITY);
            //bg movement
            //console.log("X diff: " + -this._playerCar.GetLastFrameDiffX() / this._bgTilesprite.scale.x);
            //console.log("Y diff: " + -this._playerCar.GetLastFrameDiffY() / this._bgTilesprite.scale.y);
            this._bgTilesprite.tilePosition.x += -this._playerCar.GetLastFrameDiffX() / this._bgTilesprite.scale.x;
            this._bgTilesprite.tilePosition.y += -this._playerCar.GetLastFrameDiffY() / this._bgTilesprite.scale.y;
            //smoke
            if (this._particleEmmiter.EmmitingSmoke)
                this._particleEmmiter.UpdateSmokeParticles(this._playerCar.x, this._playerCar.y);
            // //Magnetized items movement
            // if (this._magnetizedItems.length > 0) {
            //   for (let i = this._magnetizedItems.length - 1; i >= 0; i--) {
            //     let mItem: GeneratedItem = this._magnetizedItems[i];
            //     if (mItem.MoveTowardsThePlayer(this._cat.Torso.position)) {
            //       if (mItem.ItemType === GeneratedItemEnum.STAR) {
            //         Base.AudioPlayer.Instance.PlaySound(StringConstants.SOUND_STAR_TAKE);
            //         this._particleEmmiter.EmitParticles(mItem.x, mItem.y, 3);
            //         this._currentStars++;
            //         this._UI.SetStars(this._currentStars);
            //       }
            //       else {//ammo
            //         this.addAmmo(mItem.x, mItem.y);
            //       }
            //       this._itemGenerator.RemoveItemFromScreen(mItem);
            //       this._magnetizedItems.splice(i, 1);
            //       this._sceneObjectsLayer.remove(mItem);
            //     }
            //   }
            // }
            //this.game.physics.arcade.overlap(this._cat, this._sceneObjectsLayer, this.onObjectCollision, null, this);
        };
        State_game.prototype.killOffScreenIcon = function (policeCar) {
            if (policeCar.AssignedIcon != null) {
                policeCar.AssignedIcon.KillObjectAndRemoveFromScene();
                policeCar.AssignedIcon = null;
            }
        };
        State_game.prototype.killGameeFriendIcon = function (policeCar) {
            if (policeCar.GameeFriendIcon != null) {
                if (this._inGameFriendsManager)
                    this._inGameFriendsManager.ReturnAvatarToArray(policeCar.GameeFriendIcon.AssignedAvatarName);
                policeCar.GameeFriendIcon.KillObjectAndRemoveFromScene();
                policeCar.GameeFriendIcon = null;
            }
        };
        State_game.prototype.completeDailyRaceEvent = function () {
            this.disableAllPowerups();
            this.clearActivatedPowerUps(this._bgLayer);
            this.clearPolice();
            this.game.camera.flash(0xFFFFFF, 400);
            this._dailyRaceManager.CompleteMission(true);
            this.generateDailyRewardSuccessMoney();
            this._generateStuff = false;
            //this._nextLevelReached = true;
            this._UI.DailyRaceCountdownDone.addOnce(this.endGame, this, 0, 10);
            this._UI.StartAfterDailyRaceCountdown();
        };
        State_game.prototype.generateDailyRewardSuccessMoney = function () {
            this._genTimePowerUp += this.game.time.physicsElapsedMS;
            for (var i = 0; i < GameOptions.DAILY_REWARD_NUM_OF_MONEY_GENERATED; i++) {
                var powerUp = this._sceneObjectGenerator.GeneratePowerUp(PoliceRunners.ePowerUpType.MONEY);
                if (powerUp != null) {
                    //console.log("generating more!");
                    var powerUpIcon = this._UI.GetPowerUpOffscreenIcon();
                    if (powerUpIcon != null) {
                        //console.log("assigning icon!");
                        powerUpIcon.SpawnObject(this.game.camera.x - 50, this.game.camera.y - 50, powerUp.PowerUpType);
                        powerUp.AssignedIcon = powerUpIcon;
                    }
                    this._powerUps.push(powerUp);
                }
                this._genTimePowerUp = 0;
            }
        };
        State_game.prototype.prepareLevel = function () {
            //1] clear old items from the stage
            this.clearPolice();
            this.killPowerUps();
            this.killOilSpills();
            this.clearSceneObjects(this._sceneObjectsLayer);
            this.clearSceneObjects(this._frontLayer);
            //2] init properties and stuff and start game
            this._gameOver = false;
            //this._particleEmmiter.StopSmoke();
            this._videoRewardShown = false;
            this._score = 0;
            this._currentXP = 0;
            this._numOfPoliceCars = 0;
            this._numOfDestroyedCars = App.Global.GAMEE ? (Gamee.Gamee.instance.IsBattle ? GameOptions.BATTLE_POLICE_LEVEL : 0) : 0;
            this._genTimePolice = 0;
            this._genTimePowerUp = 0;
            this._currentWantedLevel = 0;
            this._currentRaceType = eGameType.NOT_SET;
            this._nextLevelReached = false;
            this._timeLimitTime = 0;
            this._raceTime = 0;
            this._playTime = 0;
            this._XPObtainTime = 0;
            this._scoreDoubleOn = false;
            this._sceneObjectGenerator.ResetGenerator();
            this._sceneObjectGenerator.SetCurrentThresholds(this._currentArea);
            this._sceneObjectGenerator.CheckForWantedLevelChange(this._numOfDestroyedCars);
            this._currentPoliceMax = this._sceneObjectGenerator.CurrentPoliceThresholds.minPolice;
            this._totalMoneyPicked = 0;
            this.game.camera.position = new Phaser.Point(0, 0);
            this._lastTakenPowerup = null;
            this._stopTimeDuration = 0;
            this._doubleMoneyOnEnd = false;
            this._doubleMoneyClicked = false;
            this._afterVideoWatchWait = false;
            this._battleOilSpillInterval = 0;
            this._policeCarsSinceLastFriendShow = 0;
            this._generateStuff = true;
            this._nextFriendGenAt = this.game.rnd.integerInRange(GameOptions.FRIENDS_GEN_MIN_CARS_TO_NEXT, GameOptions.FRIENDS_GEN_MAX_CARS_TO_NEXT);
            this._nextLevelVal = this._gameSettingsHandler.GetNextLevelValue(Gamee.PlayerDataStorage.Instance.Level);
            this._carmageddonDuration = GameOptions.CARMAGEDDON_DURATION;
            this._comboDuration = GameOptions.COMBO_DURATION;
            //this._nextLevelVal = 20;
            this.setupCar();
            this._levelPrepared = true;
        };
        State_game.prototype.clearPolice = function () {
            for (var i = this._policeCars.length - 1; i >= 0; i--) {
                var policeCar = this._policeCars.splice(i, 1)[0];
                this.killOffScreenIcon(policeCar);
                this.killGameeFriendIcon(policeCar);
                policeCar.DestroyCar();
            }
        };
        State_game.prototype.killPowerUps = function () {
            for (var i = this._powerUps.length - 1; i >= 0; i--) {
                var powerUp = this._powerUps[i];
                if (powerUp.AssignedIcon != null) {
                    powerUp.AssignedIcon.KillObjectAndRemoveFromScene();
                    powerUp.AssignedIcon = null;
                    this._sceneObjectGenerator.UpdateAvailablePowerUpList(powerUp.PowerUpType);
                }
                if (powerUp.AssignedImgText != null) {
                    powerUp.AssignedImgText.KillObjectAndRemoveFromScene();
                    powerUp.AssignedImgText = null;
                }
                powerUp.KillObjectAndRemoveFromScene();
                this._powerUps.splice(i, 1);
            }
            this._powerUps = [];
        };
        State_game.prototype.killOilSpills = function () {
            for (var i = this._battleOilSpills.length - 1; i >= 0; i--) {
                this._battleOilSpills[i].KillObjectAndRemoveFromScene();
                this._battleOilSpills.splice(i, 1);
            }
            this._battleOilSpills = [];
        };
        State_game.prototype.killOilSpillIfTooDistant = function () {
            for (var i = this._battleOilSpills.length - 1; i >= 0; i--) {
                if (Phaser.Math.distance(this._playerCar.x, this._playerCar.y, this._battleOilSpills[i].x, this._battleOilSpills[i].y) >= GameOptions.BATTLE_SPILL_OIL_KILL_DIST) {
                    this._battleOilSpills[i].KillObjectAndRemoveFromScene();
                    Utils.ArrayUtils.OneItemSplice(this._battleOilSpills, i);
                }
            }
        };
        State_game.prototype.clearSceneObjects = function (groupToclear) {
            if (groupToclear.length > 0) {
                for (var i = groupToclear.length - 1; i >= 0; i--) {
                    var item = groupToclear.children[i];
                    if (item.ObjectType == Base.eObjectType.POLICE)
                        item.DestroyCar();
                    else
                        item.KillObjectAndRemoveFromScene();
                }
            }
        };
        State_game.prototype.clearActivatedPowerUps = function (groupToclear) {
            if (groupToclear.length > 0) {
                for (var i = groupToclear.length - 1; i >= 0; i--) {
                    var item = groupToclear.children[i];
                    if (item.ObjectType == Base.eObjectType.POWER_UP_ACTIVATED)
                        item.KillObjectAndRemoveFromScene();
                }
            }
        };
        State_game.prototype.resetGame = function () {
            if (!this._levelPrepared)
                this.prepareLevel();
            if (this._carZoomTween != null && this._carZoomTween.isRunning) {
                this._carZoomTween.stop();
            }
            if (this._worldZoomTween != null && this._worldZoomTween.isRunning) {
                this._worldZoomTween.stop();
            }
            if (this._dailyRaceManager.CurrentRaceType != PoliceRunners.DailyRaceType.NONE
                && !this._dailyRaceManager.MissionCompleted) {
                this._dailyRaceManager.OnResetInterruption();
                if (this._dailyRaceManager.CurrentRaceType == PoliceRunners.DailyRaceType.RACE) {
                    this._playerCar.DestroyRaceArrow();
                    this._objectToFollow = null;
                }
            }
            //videos are turned off now
            // if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS && !Gamee.Gamee.instance.VideoLoaded) {
            //   Gamee.Gamee.instance.LoadRewardedVideo();
            // }
            Base.AudioPlayer.Instance.PlayMusic(PoliceRunners.StringConstants.MUSIC_MAIN, true);
            this._playState = ePlayState.MENU;
            this.initCamera();
            this._bgTilesprite.tilePosition.x = 0;
            this._bgTilesprite.tilePosition.y = 0;
            this._bgTilesprite.scale.set(GameOptions.BG_SCALE_ZOOMED);
            this._playerCar.ResetCar();
            this._UI.HideUI();
            this._UI.HideMissionPassedText();
            //play tutorial straight on the first start
            if (this._firstGameStart && !Gamee.PlayerDataStorage.Instance.TutorialPlayed && !Gamee.Gamee.instance.IsBattle) {
                this.startZoomOut(eGameType.REGULAR);
            }
            else if (!App.Global.GAMEE || (App.Global.GAMEE && !Gamee.Gamee.instance.IsBattle)) {
                this._UI.ShowMainMenu();
                //if (true && !Gamee.PlayerDataStorage.Instance.VipScreenShown) {
                // if (App.Global.GAMEE && Gamee.Gamee.instance.MembershipType == Gamee.eMembershipType.VIP && !Gamee.PlayerDataStorage.Instance.VipScreenShown) {
                //   this._UI.ShowVIPThankWindow();
                // }
            }
            else if (App.Global.GAMEE && Gamee.Gamee.instance.IsBattle) {
                //console.log("C");
                this._playState = ePlayState.IDLE;
                if (!this._firstGameStart) {
                    //console.log("C1");
                    this._UI.ShowBattleInitScreen(Gamee.PlayerDataStorage.Instance.BattleSettings == null ? true : false);
                    this._UI.BattleInitScreen.SetCreatorPhoto();
                }
                if (this._battleScreenCreated) {
                    // console.log("C2");
                    this.waitForBattleTap();
                }
                else
                    this._waitingForBattleData = true;
            }
            else
                this.startZoomOut(eGameType.REGULAR);
        };
        State_game.prototype.startZoomOut = function (gameType) {
            //console.log("ZOOMING OUT!");
            this._UI.HideMainMenu();
            if (!App.Global.GAMEE || Gamee.Gamee.instance.IsBattle || !Gamee.PlayerDataStorage.Instance.IsBoosterActive(eBoosterType.RAGE)) {
                this._carZoomTween = this.game.add.tween(this._playerCar.scale).to({ x: PoliceRunners.PlayerCar.STANDARD_SCALE, y: PoliceRunners.PlayerCar.STANDARD_SCALE }, 1000, Phaser.Easing.Quadratic.In, true);
            }
            this._worldZoomTween = this.game.add.tween(this._bgTilesprite.scale).to({ x: GameOptions.BG_SCALE_STANDARD, y: GameOptions.BG_SCALE_STANDARD }, 1000, Phaser.Easing.Quadratic.In, true);
            this._worldZoomTween.onComplete.addOnce(this.startTheGame, this, 0, gameType);
        };
        //called after button click in game menu UI or after PLAY button when in battle
        State_game.prototype.startTheGame = function (par1, par2, gameType) {
            this._currentRaceType = gameType;
            this._playerCar.ResetLastPosDiff();
            this._dailyRaceManager.Reset();
            this._UI.ShowUI(Gamee.PlayerDataStorage.Instance.Level, gameType == eGameType.REGULAR);
            this._UI.UpdateHealthProgressBar(1, false);
            if (gameType == eGameType.REGULAR && (!App.Global.GAMEE || !Gamee.Gamee.instance.IsBattle))
                this._UI.UpdateLevelBar(0);
            this.stopComboCounter();
            this._UI.UpdateComboBar(0);
            //console.log("STOPPING TWEEN!");
            this._idleCarTween.pause();
            this._particleEmmiter.StopSmoke();
            this._particleEmmiter.SetSmokeToInGameSetting();
            if (App.Global.GAMEE) {
                if (this._inGameFriendsManager == null)
                    this._inGameFriendsManager = new PoliceRunners.UI.InGameFriendsManager(this.game);
                else
                    this._inGameFriendsManager.ResetFriendsManager();
            }
            //TODO uncomment when missions are done
            if (gameType === eGameType.DAILY_RACE) {
                // let chosenMission = DailyRaceType.RACE;
                // this._dailyRaceManager.SetMission(chosenMission, 1);
                var chosenMission = this.game.rnd.integerInRange(1, 3);
                this._dailyRaceManager.SetMission(chosenMission, chosenMission == PoliceRunners.DailyRaceType.COMBO_RUN ? Math.ceil(this._gameSettingsHandler.GetGivenCarInfo(Gamee.PlayerDataStorage.Instance.UsedCar).comboMax * 0.7)
                    : this._gameSettingsHandler.GetDailyRaceValue(this._gameSettingsHandler.GetNumOfUnlockedCars(Gamee.PlayerDataStorage.Instance.Level)));
                this._playState = ePlayState.PLAY;
                this._firstGameStart = false;
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE, true);
                if (this._dailyRaceManager.CurrentRaceType == PoliceRunners.DailyRaceType.RACE) {
                    this._dailyRaceManager.GenerateCheckpoint(this._playerCar);
                    this._objectToFollow = this._dailyRaceManager.CheckpointSprite.position;
                    this._playerCar.CreateRaceArrow(this._dailyRaceManager.CheckpointSprite, this._objectToFollow);
                    this.initRaceCheckpoint();
                }
            }
            else if ((!App.Global.GAMEE || !Gamee.Gamee.instance.IsBattle) && Gamee.PlayerDataStorage.Instance.TutorialPlayed) {
                //console.log("B");
                this._playState = ePlayState.PLAY;
                this._firstGameStart = false;
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE, true);
            }
            else if (App.Global.GAMEE && Gamee.Gamee.instance.IsBattle) {
                //console.log("C");
                this._playState = ePlayState.PLAY;
            }
            else {
                //console.log("D");
                this._tutorialManager = new PoliceRunners.TutorialController(this.game, this._UI);
                this._playState = ePlayState.TUTORIAL;
                this._playerCar.visible = false;
                this._tutorialManager.InitTutorial();
                this._tutorialManager.OnTutorialComplete.add(function () {
                    this._playerCar.visible = true;
                    Gamee.PlayerDataStorage.Instance.SetTutorialPlayed(true, false);
                    this.game.time.events.add(1000, function () {
                        this._playState = ePlayState.PLAY;
                        this._firstGameStart = false;
                        Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE, true);
                    }, this);
                }, this);
            }
            //booster activation
            if (App.Global.GAMEE && Gamee.Gamee.instance.IsBattle)
                return;
            this._sceneObjectGenerator.SetInGamePowerUps();
            if (Gamee.PlayerDataStorage.Instance.IsBoosterActive(eBoosterType.RAGE)) {
                this._carmageddonTime = 0;
                this._lastTakenPowerup = PoliceRunners.eActivatedPowerUpType.CARMAGEDDON;
                this._playerCar.ApplyCarmageddon(false);
                this._UI.ShowPowerUpTakenText(false, PoliceRunners.eActivatedPowerUpType.CARMAGEDDON, GameOptions.CARMAGEDDON_DURATION * 2);
                this._carmageddonDuration = GameOptions.CARMAGEDDON_DURATION * 2;
            }
            if (Gamee.PlayerDataStorage.Instance.IsBoosterActive(eBoosterType.COMBO_TIME)) {
                this._comboDuration = GameOptions.COMBO_DURATION * 2;
            }
        };
        State_game.prototype.prepareBattleSettings = function () {
            if (Gamee.PlayerDataStorage.Instance.BattleSettings == null)
                return;
            //visibility
            if (Gamee.PlayerDataStorage.Instance.BattleSettings.visibility < 1) {
                var visibilityLayer = this.game.add.image(GameGlobalVariables.GAME_HALF_WIDTH, GameGlobalVariables.GAME_HALF_HEIGHT, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_VISIBILITY_LAYER);
                visibilityLayer.anchor.set(0.5);
                visibilityLayer.width = this.game.width;
                visibilityLayer.height = this.game.height;
                visibilityLayer.fixedToCamera = true;
                visibilityLayer.scale.set(GameOptions.BATTLE_VISIBILITY_MAX_SCALE + ((Gamee.PlayerDataStorage.Instance.BattleSettings.visibility / 0.9) * (GameOptions.BATTLE_VISIBILITY_MIN_SCALE - GameOptions.BATTLE_VISIBILITY_MAX_SCALE)));
                this._aboveTheCars.add(visibilityLayer);
            }
            //speed
            GameOptions.ACCELERATION_VALUE = GameOptions.BATTLE_ACC_VAL_MIN + (Gamee.PlayerDataStorage.Instance.BattleSettings.carSpeed * (GameOptions.BATTLE_ACC_VAL_MAX - GameOptions.BATTLE_ACC_VAL_MIN));
            //cop level
            GameOptions.BATTLE_POLICE_LEVEL = GameOptions.BATTLE_POLICE_LEVEL_MIN + (Gamee.PlayerDataStorage.Instance.BattleSettings.copsLevel * (GameOptions.BATTLE_POLICE_LEVEL_MAX - GameOptions.BATTLE_POLICE_LEVEL_MIN));
            this._numOfDestroyedCars = GameOptions.BATTLE_POLICE_LEVEL;
            this._sceneObjectGenerator.CheckForWantedLevelChange(this._numOfDestroyedCars);
            //oil spills
            if (Gamee.PlayerDataStorage.Instance.BattleSettings.oilSpills > 0) {
                //TODO
                this._sceneObjectGenerator.InitBattleOilSpillPool();
                this.initBattleOilSpillsPool();
                this._battleOilSpillsEnabled = true;
                GameOptions.BATTLE_SPILL_INTERVAL = GameOptions.BATTLE_SPILL_GEN_MAX - (Gamee.PlayerDataStorage.Instance.BattleSettings.oilSpills * (GameOptions.BATTLE_SPILL_GEN_MAX - GameOptions.BATTLE_SPILL_GEN_MIN));
            }
        };
        //prepare player car... maybe merge this later with prepareLevel (merge it together with this)
        State_game.prototype.setupCar = function () {
            //console.log("SETUP CAR IN PROGRESS!!!!");
            if (!App.Global.GAMEE || !Gamee.Gamee.instance.IsBattle) {
                this._nextLevelVal = this._gameSettingsHandler.GetNextLevelValue(Gamee.PlayerDataStorage.Instance.Level);
                //this._nextLevelVal = 10;
                var carGameSettings = this._gameSettingsHandler.PlayerCarInfos.find(function (item) { return item.id === Gamee.PlayerDataStorage.Instance.UsedCar; });
                var playerOwnedCar = Gamee.PlayerDataStorage.Instance.GetGivenCar(carGameSettings.id);
                if (playerOwnedCar == null) {
                    console.error("Cannot find car in ownedCars!");
                    return;
                }
                if (this._playerCar == null || this._playerCar.CarID != Gamee.PlayerDataStorage.Instance.UsedCar) {
                    if (this._playerCar != null) {
                        this._playerCar.DestroyCar();
                        this._idleCarTween.stop();
                        this._idleCarTween = null;
                    }
                    this.InitPlayerCar(carGameSettings.id, playerOwnedCar.level == 0 ? carGameSettings.hpBase : carGameSettings.upgrades[playerOwnedCar.level - 1].hp, carGameSettings.comboMax);
                }
                //make sure we are using updated version of the car
                else {
                    this._playerCar.MaxHealth = playerOwnedCar.level == 0 ? carGameSettings.hpBase : carGameSettings.upgrades[playerOwnedCar.level - 1].hp;
                }
            }
            else if (this._playerCar == null) {
                var carGameSettings = this._gameSettingsHandler.PlayerCarInfos.find(function (item) { return item.id === GameOptions.DEFAULT_BATTLE_CAR_ID; });
                this.InitPlayerCar(carGameSettings.id, carGameSettings.hpBase, carGameSettings.comboMax);
            }
            //zoom on the start:
            this._playerCar.scale.set(PoliceRunners.PlayerCar.RAGE_SCALE);
            this._playerCar.ResetCar();
            this.initCamera();
            this._particleEmmiter.SetSmokeToUISetting();
            //update particles position - we dont use actual car values, because there is a bug in reset position method
            this._particleEmmiter.UpdateSmokeParticles(GameGlobalVariables.GAME_HALF_WIDTH, GameGlobalVariables.GAME_HALF_HEIGHT + this._playerCar.CarBody.height * .55);
            this._particleEmmiter.StartSmokeEmit();
            if (this._idleCarTween != null)
                this._idleCarTween.resume();
            else {
                this._idleCarTween = this.game.add.tween(this._playerCar.CarBody).to({ x: 0.4, y: 0.9 }, 100, Phaser.Easing.Linear.None, true, 0, -1, true);
            }
        };
        State_game.prototype.createGameBg = function () {
            var bgSprite = App.Global.GAMEE ? (Gamee.Gamee.instance.IsBattle ? PoliceRunners.StringConstants.SPRITE_MAP_BG_BATTLE : PoliceRunners.StringConstants.SPRITE_MAP_BG1) : PoliceRunners.StringConstants.SPRITE_MAP_BG1;
            this._bgTilesprite = this.game.add.tileSprite(GameGlobalVariables.GAME_HALF_WIDTH, GameGlobalVariables.GAME_HALF_HEIGHT, this.game.width * 1.5, this.game.height * 1.2, bgSprite);
            this._bgTilesprite.anchor.set(0.5);
            //this._bgTilesprite.angle = -13;
            this._bgTilesprite.scale.set(GameOptions.BG_SCALE_ZOOMED);
            this._bgTilesprite.fixedToCamera = true;
            return this._bgTilesprite;
        };
        State_game.prototype.createGameBgOverlay = function () {
            var darkEdgesOverlay = this.game.add.sprite(GameGlobalVariables.GAME_HALF_WIDTH, GameGlobalVariables.GAME_HALF_HEIGHT, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_DARK_OVAL);
            darkEdgesOverlay.anchor.set(0.5);
            //darkEdgesOverlay.alpha = 0.2;
            darkEdgesOverlay.width = this.game.width;
            darkEdgesOverlay.height = this.game.height;
            darkEdgesOverlay.fixedToCamera = true;
            return darkEdgesOverlay;
        };
        State_game.prototype.createBattleRainAnim = function () {
            var rainAnim = this.game.add.sprite(GameGlobalVariables.GAME_HALF_WIDTH, GameGlobalVariables.GAME_HALF_HEIGHT, PoliceRunners.StringConstants.SPRITESHEET_BATTLE_RAIN, 0);
            rainAnim.anchor.set(0.5);
            rainAnim.width = this.game.width;
            rainAnim.height = this.game.height;
            rainAnim.fixedToCamera = true;
            rainAnim.animations.add("raining");
            rainAnim.animations.play("raining", 30, true);
            return rainAnim;
        };
        State_game.prototype.initCamera = function () {
            //set camera follow - set camera bounds to null to allow move outside of world bounds
            this.game.camera.bounds = null;
            this.game.camera.follow(this._playerCar, 0.5, 0.5);
        };
        State_game.prototype.endGame = function (finalScreenDelay) {
            this._gameOver = true;
            this._playerCar.StopTheCarImmediatelly();
            // if (!Gamee.Gamee.instance.IsBattle)
            //   Gamee.PlayerDataStorage.Instance.SavePlayerData();//TODO maybe put somewhere else
            this.disableAllPowerups();
            this._policeRadioManager.PlayDeadPlayerSound();
            if (App.Global.GAMEE) {
                this.time.events.add(finalScreenDelay, function () {
                    this._policeCars.forEach(function (element) {
                        element.StopSirenSound();
                    });
                    //console.log("ENDING!!!");
                    var doItOrNotPico = GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED ? !this._nextLevelReached : true;
                    if ((doItOrNotPico && !this._videoRewardShown) || (this._currentRaceType == eGameType.DAILY_RACE && (!this._videoRewardShown || this._dailyRaceManager.MissionCompleted))) { //make sure we do not show video offer for the second time
                        //console.log("A");
                        Base.AudioPlayer.Instance.StopSound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE);
                        this._UI.ShowFinalScreen(this._currentRaceType == eGameType.REGULAR, this._nextLevelReached, this._dailyRaceManager.MissionCompleted, Gamee.PlayerDataStorage.Instance.Level - 1, this._currentXP / this._nextLevelVal, this._totalMoneyPicked, this.createDailyRaceStats(), this.onVideoOfferClosed.bind(this));
                    }
                    else if (!this._nextLevelReached && this._videoRewardShown) {
                        //console.log("B");
                        this.commitEnd();
                    }
                    //this is probably not the best code, but it is here for te case when user used continue for coin and finished level later
                    else if (this._nextLevelReached) {
                        //console.log("C");
                        this._UI.ShowFinalScreen(this._currentRaceType == eGameType.REGULAR, this._nextLevelReached, this._dailyRaceManager.MissionCompleted, Gamee.PlayerDataStorage.Instance.Level - 1, this._currentXP / this._nextLevelVal, this._totalMoneyPicked, this.createDailyRaceStats(), this.onVideoOfferClosed.bind(this));
                    }
                }, this);
            }
            else {
                this._playState = ePlayState.FORCE_RESET;
            }
        };
        State_game.prototype.createDailyRaceStats = function () {
            if (this._currentRaceType != eGameType.DAILY_RACE)
                return null;
            return {
                raceType: this._dailyRaceManager.CurrentRaceType,
                goal: this._dailyRaceManager.CurrentRaceType == PoliceRunners.DailyRaceType.COP_HUNT ? this._dailyRaceManager.NumOfCopsToAchieve :
                    (this._dailyRaceManager.CurrentRaceType == PoliceRunners.DailyRaceType.RACE ? this._dailyRaceManager.CheckpointsTotal : this._dailyRaceManager.NumOfComboToAchieve),
                copsDestroyed: this._numOfDestroyedCars,
                timeSpent: this._UI.GetScreenTimerTime()
            };
        };
        State_game.prototype.disableAllPowerups = function () {
            if (this._playerCar.NitroOn) {
                this._playerCar.NitroOn = false;
                this._playerCar.StopNitroAnim();
            }
            if (this._playerCar.ShieldOn) {
                this._playerCar.ShieldOn = false;
                this._playerCar.StopShieldAnim();
            }
            if (this._playerCar.OilSpilling) {
                this._playerCar.OilSpilling = false;
            }
            if (this._playerCar.SpikeSpilling)
                this._playerCar.SpikeSpilling = false;
            if (this._playerCar.CarmageddonOn)
                this._playerCar.StopCarmageddon();
            this._UI.HidePowerUpTextIfRunning();
        };
        State_game.prototype.commitEnd = function () {
            this._particleEmmiter.StopSmoke();
            if (this._dailyRaceManager.CurrentRaceType != PoliceRunners.DailyRaceType.NONE && !this._dailyRaceManager.MissionCompleted) {
                if (this._dailyRaceManager.CurrentRaceType == PoliceRunners.DailyRaceType.RACE) {
                    this._dailyRaceManager.DestroyCheckpointSprite();
                    this._objectToFollow = null;
                    this._playerCar.DestroyRaceArrow();
                }
                this._dailyRaceManager.CompleteMission(false);
            }
            //INFO - money doubling moved to VideoOfferWindow
            //console.log("COMMITING FUCKING END!!!!! DOUBLE REWARD??? " + doubleReward);
            //give reward to player
            // let totalReward = this._totalMoneyPicked;
            // //console.log("TOTAL MONEY PICKED: " + totalReward);
            // if (this._nextLevelReached) {
            //   // console.log("YES PICO, LEVEL REACHED!!!");
            //   // console.log("LEVEL: " + Gamee.PlayerDataStorage.Instance.Level);
            //   // console.log("LEVEL REWARD: " + this._gameSettingsHandler.LevelReward);
            //   totalReward += (Gamee.PlayerDataStorage.Instance.Level * this._gameSettingsHandler.LevelReward);
            //   if (doubleReward)
            //     totalReward *= 2;
            // }
            //console.log("END!!!!! ADDING MONEY: " + totalReward);
            //Gamee.PlayerDataStorage.Instance.SetCurrencyAmount(Gamee.PlayerDataStorage.Instance.CurrencyAmount + totalReward, true);
            this._levelPrepared = false;
            this.game.camera.follow(null);
            this._playState = ePlayState.GAMEE_LAYER;
            Gamee.Gamee.instance.gameOver(null, null, Gamee.PlayerDataStorage.Instance.GetDataInString());
        };
        //TODO maybe use later
        // private generateCoin() {
        //   this._nextCoin = this._sceneObjectGenerator.GenerateCoin();
        //   this._objectToFollow = this._nextCoin.position;
        //   this._nextCoin.body.setCollisionGroup(this._playerCollisionGroup);
        //   this._nextCoin.body.collides(this._playerCollisionGroup);
        // }
        State_game.prototype.onOilSpillHit = function (body, bodyB, shapeA, shapeB, equation) {
            if (this._playState != ePlayState.PLAY)
                return;
            if (body.sprite instanceof PoliceRunners.PoliceCar) {
                var policeCar = body.sprite;
                if (!policeCar.AffectedByOilSpill) {
                    policeCar.ApplyOilSpillBehaviour();
                }
            }
            else if (!this._playerCar.AfterPowerUpTake) {
                this._playerCar.ApplyOilSpillBehaviour();
                //todo IMPLEMENT
            }
        };
        State_game.prototype.onSpikeStripHit = function (body, bodyB, shapeA, shapeB, equation) {
            if (this._playState != ePlayState.PLAY)
                return;
            if (body.sprite instanceof PoliceRunners.PoliceCar) {
                var policeCar = body.sprite;
                if (policeCar.alive) {
                    //policeCar.ApplyAfterSpikesBehaviour();
                    this.killPolice(policeCar, true);
                    if (policeCar.inCamera)
                        this.game.camera.shake(0.01, 200);
                }
            }
            else if (!this._playerCar.AfterPowerUpTake) {
                this._playerCar.Health = this.game.math.max(this._playerCar.Health - (this._playerCar.MaxHealth / 3), 0);
                this._UI.UpdateHealthProgressBar(this._playerCar.Health / this._playerCar.MaxHealth, true);
                this._animInstantiator.SpawnExplosion(this._playerCar.x, this._playerCar.y);
                this.game.camera.shake(0.02, 300);
                if (this._playerCar.Health <= 0)
                    this.killPlayer();
                else
                    this._playerCar.ApplyAfterSpikesBehaviour();
            }
        };
        State_game.prototype.onRaceCheckpointHit = function (body, bodyB, shapeA, shapeB, equation) {
            if (this._playState != ePlayState.PLAY)
                return;
            this._dailyRaceManager.CurrentCheckpoint++;
            this._dailyRaceManager.UpdateDailyRaceCounter(this._dailyRaceManager.CurrentCheckpoint);
            if (this._dailyRaceManager.CurrentCheckpoint >= this._dailyRaceManager.CheckpointsTotal) {
                this._dailyRaceManager.DestroyCheckpointSprite();
                this._objectToFollow = null;
                this._playerCar.DestroyRaceArrow();
                this.completeDailyRaceEvent();
            }
            else {
                //generate another checkpoint
                this._dailyRaceManager.GenerateCheckpoint(this._playerCar);
                this._objectToFollow = this._dailyRaceManager.CheckpointSprite.position;
            }
        };
        State_game.prototype.postBroadPhaseCallback = function (body1, body2) {
            //handle rage car behaviour!
            if (this._playerCar != null && this._playerCar.CarmageddonOn) {
                if (body1.sprite === this._playerCar && body2.sprite.ObjectType === Base.eObjectType.POLICE ||
                    body2.sprite === this._playerCar && body1.sprite.ObjectType === Base.eObjectType.POLICE) {
                    var policeCar = body1.sprite.ObjectType === Base.eObjectType.POLICE ? body1.sprite : body2.sprite;
                    Base.AudioPlayer.Instance.PlaySound(this.game.rnd.pick(this._policeCrashSounds));
                    this.killPolice(policeCar, true);
                    this.addToComboCounter(1);
                    this.game.camera.flash(0xFFFFFF, 200);
                    if (!this._playerCar.NitroOn)
                        this.game.camera.shake(0.02, 300);
                    return false;
                }
            }
            return true;
        };
        State_game.prototype.killPolice = function (policeCar, addScore) {
            this._animInstantiator.SpawnExplosion(policeCar.x, policeCar.y);
            this.killOffScreenIcon(policeCar);
            this.killGameeFriendIcon(policeCar);
            var indexToDel = this._policeCars.indexOf(policeCar, 0);
            if (indexToDel > -1)
                Utils.ArrayUtils.OneItemSplice(this._policeCars, indexToDel);
            if (addScore)
                this.addScore(this._scoreDoubleOn ? policeCar.BaseScore * 2 : policeCar.BaseScore, policeCar.x, policeCar.y, this._dailyRaceManager.CurrentRaceType == PoliceRunners.DailyRaceType.NONE);
            policeCar.DestroyCar();
            this._numOfPoliceCars--;
            this._numOfDestroyedCars++;
            if (this._dailyRaceManager.CurrentRaceType === PoliceRunners.DailyRaceType.COP_HUNT && !this._dailyRaceManager.MissionCompleted) {
                this._dailyRaceManager.UpdateDailyRaceCounter(this._numOfDestroyedCars);
                if (this._dailyRaceManager.NumOfCopsToAchieve <= this._numOfDestroyedCars) {
                    this.completeDailyRaceEvent();
                }
            }
            if (this._sceneObjectGenerator.CheckForWantedLevelChange(this._numOfDestroyedCars)) {
                this._currentWantedLevel++;
                this._currentPoliceMax = Math.min(this._currentPoliceMax + 1, this._sceneObjectGenerator.CurrentPoliceThresholds.maxPolice);
            }
        };
        //** This is actually called on the begin of each collision with player car, but we are using it just for powerUp picking */
        //** For some strange reason, bodyB property has no sprite attached */
        State_game.prototype.onPowerUpHit = function (body, bodyB, shapeA, shapeB, equation) {
            //  This callback is sent 5 arguments:
            //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
            //  The p2.Body this Body is in contact with.
            //  The Shape from this body that caused the contact.
            //  The Shape from the contact body.
            //  The Contact Equation data array.
            //because of Checkpoint hit
            if (this._playState != ePlayState.PLAY || body == null || body.sprite == null)
                return;
            //console.log("ULALA!!! TYPE? ", (<Base.SceneObject>body.sprite).ObjectType);
            if (body.sprite.ObjectType == Base.eObjectType.POWER_UP) {
                var powerUp = body.sprite;
                if (powerUp.PowerUpType == PoliceRunners.ePowerUpType.MONEY) {
                    var coinsAdded = this._gameSettingsHandler.GetCoinReward(this._currentWantedLevel);
                    if (Gamee.PlayerDataStorage.Instance.IsBoosterActive(eBoosterType.DOUBLE_MONEY))
                        coinsAdded *= 2;
                    this._totalMoneyPicked += coinsAdded; //we will save it in the end of the session
                    this._UI.ShowPowerUpTakenText(true, PoliceRunners.eActivatedPowerUpType.CARMAGEDDON, GameOptions.REG_TIME_POWERUP_SHOW, coinsAdded);
                    this._lastTakenPowerup = PoliceRunners.ePowerUpType.MONEY;
                }
                else {
                    var chosenNum = this.game.rnd.integerInRange(0, 6);
                    //chosenNum = eActivatedPowerUpType.SPIKE_STRIP;
                    switch (chosenNum) {
                        case PoliceRunners.eActivatedPowerUpType.EXTRA_LIFE:
                            var addedHP = Math.round(this._playerCar.MaxHealth / 2);
                            this._playerCar.Health = Math.min(this._playerCar.Health + addedHP, this._playerCar.MaxHealth);
                            this.game.camera.flash(0x00cd00, 200);
                            this._UI.UpdateHealthProgressBar(this._playerCar.Health / this._playerCar.MaxHealth, true);
                            this._playerCar.ShowHealthAnim();
                            this._UI.ShowPowerUpTakenText(false, PoliceRunners.eActivatedPowerUpType.EXTRA_LIFE, GameOptions.REG_TIME_POWERUP_SHOW, addedHP);
                            if (this._playerCar.Health > this._playerCar.MaxHealth / 3) {
                                this._particleEmmiter.StopSmoke();
                            }
                            break;
                        case (PoliceRunners.eActivatedPowerUpType.DOUBLE_SCORE):
                            this.game.camera.flash(0x00cd00, 200);
                            this._UI.ShowPowerUpTakenText(false, PoliceRunners.eActivatedPowerUpType.DOUBLE_SCORE, GameOptions.SCORE_DOUBLE_DURATION);
                            this._scoreDoubleOn = true;
                            this._scoreDoubleTime = 0;
                            break;
                        case (PoliceRunners.eActivatedPowerUpType.NITRO):
                            this.game.camera.flash(0xffa500, 200);
                            this.game.camera.shake(0.005, GameOptions.NITRO_DURATION);
                            this._playerCar.NitroOn = true;
                            this._playerCar.ShowNitroAnim();
                            this._nitroTime = 0;
                            this._UI.ShowPowerUpTakenText(false, PoliceRunners.eActivatedPowerUpType.NITRO, GameOptions.REG_TIME_POWERUP_SHOW);
                            break;
                        case (PoliceRunners.eActivatedPowerUpType.SHIELD):
                            this.game.camera.flash(0x0080ff, 200);
                            this._playerCar.ShieldOn = true;
                            this._shieldTime = 0;
                            this._playerCar.ShowShieldAnim();
                            this._UI.ShowPowerUpTakenText(false, PoliceRunners.eActivatedPowerUpType.SHIELD, GameOptions.REG_TIME_POWERUP_SHOW);
                            break;
                        case (PoliceRunners.eActivatedPowerUpType.OIL_SPILL):
                            if (this._playerCar.SpikeSpilling)
                                this._playerCar.SpikeSpilling = false;
                            this.game.camera.flash(0x000000, 200);
                            this._playerCar.OilSpilling = true;
                            this._oilSpillingTime = 0;
                            this._timeSinceLastOilSpill = 0;
                            this._UI.ShowPowerUpTakenText(false, PoliceRunners.eActivatedPowerUpType.OIL_SPILL, GameOptions.REG_TIME_POWERUP_SHOW);
                            break;
                        case (PoliceRunners.eActivatedPowerUpType.SPIKE_STRIP):
                            if (this._playerCar.OilSpilling)
                                this._playerCar.OilSpilling = false;
                            this.game.camera.flash(0xFF0000, 200);
                            this._playerCar.SpikeSpilling = true;
                            this._spikeSpillingTime = 0;
                            this._timeSinceLastSpikeSpill = 0;
                            this._UI.ShowPowerUpTakenText(false, PoliceRunners.eActivatedPowerUpType.SPIKE_STRIP, GameOptions.REG_TIME_POWERUP_SHOW);
                            break;
                        case (PoliceRunners.eActivatedPowerUpType.CARMAGEDDON):
                            this.game.camera.flash(0xFF0000, 200);
                            this._playerCar.ApplyCarmageddon(true);
                            this._carmageddonTime = 0;
                            this._UI.ShowPowerUpTakenText(false, PoliceRunners.eActivatedPowerUpType.CARMAGEDDON, GameOptions.CARMAGEDDON_DURATION);
                            this._carmageddonDuration = GameOptions.CARMAGEDDON_DURATION;
                            break;
                    }
                    if (powerUp.AssignedImgText != null) {
                        //powerUp.AssignedImgText.SetPowerUpText(chosenNum);
                        powerUp.AssignedImgText.SetPowerUpTaken();
                    }
                    this._playerCar.SetAfterPowerUpTake();
                    this._lastTakenPowerup = chosenNum;
                }
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_POWER_UP_PICKUP);
                if (powerUp.AssignedIcon != null) {
                    powerUp.AssignedIcon.KillObjectAndRemoveFromScene();
                    powerUp.AssignedIcon = null;
                    this._sceneObjectGenerator.UpdateAvailablePowerUpList(powerUp.PowerUpType);
                }
                var indexToDel = this._powerUps.indexOf(powerUp, 0);
                if (indexToDel > -1)
                    Utils.ArrayUtils.OneItemSplice(this._powerUps, indexToDel);
                powerUp.KillObjectAndRemoveFromScene();
            }
        };
        State_game.prototype.onNearMissHit = function (body, bodyB, shapeA, shapeB, equation) {
            if (body == null || Gamee.Gamee.instance.IsBattle || this._dailyRaceManager.CurrentRaceType != PoliceRunners.DailyRaceType.NONE)
                return;
            if (body.sprite.ObjectType == Base.eObjectType.POLICE) {
                if (body.sprite.alive && !this._nextLevelReached) {
                    var addedXP = Math.max(10, Math.round(GameOptions.XP_OBTAIN_ON_NEAR_MISS_BASE * (1 + this._gameSettingsHandler.NearMissMultiplier * (this._currentComboCounter - 1))));
                    this._UI.ShowXPAddNotification(PoliceRunners.UI.eXPNotifyType.NEAR_MISS, addedXP);
                    this.addXP(addedXP);
                }
            }
        };
        State_game.prototype.onCarsCollisionHandler = function (body1, body2) {
            if (body1.sprite.data === 1 && body2.sprite.data === 1)
                this.onPolicePoliceCollision(body1, body2);
        };
        State_game.prototype.onPlayerCollision = function (player, secondBody) {
            var secondItem = secondBody.sprite;
            if (secondItem.ObjectType == Base.eObjectType.POLICE) {
                this.onPlayerPoliceCollision(player, secondItem);
            }
        };
        State_game.prototype.onPlayerPoliceCollision = function (player, policeCar) {
            //console.log("PLEJA POLIS COLLIDING " + player.sprite.data + " WITH ");
            if (!policeCar.alive)
                return;
            //crash to the dead car
            // if (!this._playerCar.Alive)
            //   Base.AudioPlayer.Instance.PlaySound(this.game.rnd.pick(this._playerCrashSounds));
            Base.AudioPlayer.Instance.PlaySound(this.game.rnd.pick(this._playerCrashSounds));
            this.killPolice(policeCar, false);
            if (this._playerCar.ShieldOn) {
                this._playerCar.ShieldOn = false;
                this._playerCar.StopShieldAnim();
            }
            else {
                var lowerHealth = GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED ? !this._nextLevelReached : true;
                if (!this._playerCar.CarmageddonOn && lowerHealth) {
                    this._playerCar.Health = this.game.math.max(this._playerCar.Health - policeCar.Damage, 0);
                    this._UI.UpdateHealthProgressBar(this._playerCar.Health / this._playerCar.MaxHealth, true);
                }
            }
            //we dont kill the player in case of cop hunt race when he hits the last cop and should die - let player collect money instead
            if (this._playerCar.Health <= 0 && !(this._dailyRaceManager.CurrentRaceType == PoliceRunners.DailyRaceType.COP_HUNT && this._dailyRaceManager.MissionCompleted)) {
                this._animInstantiator.SpawnExplosion(this._playerCar.x, this._playerCar.y);
                if (this._playerCar.Alive)
                    this.game.camera.shake(0.02, 300);
                this.killPlayer();
                return;
            }
            else {
                this._playerCar.OnPoliceHit();
                //Base.AudioPlayer.Instance.PlaySound(this.game.rnd.pick(this._playerCrashSounds));
                if (!this._playerCar.NitroOn)
                    this.game.camera.shake(0.01, 200);
                //this.addToComboCounter(1);
                if (!this._particleEmmiter.EmmitingSmoke && this._playerCar.Health <= this._playerCar.MaxHealth / 3) {
                    this._particleEmmiter.StartSmokeEmit();
                }
            }
            if (!this._playerCar.CarmageddonOn) {
                this._afterCrash = true;
                this._afterCrashTime = 0;
            }
        };
        State_game.prototype.killPlayer = function () {
            if (!this._gameOver) {
                if (!Gamee.Gamee.instance.IsBattle && App.Global.LOG_EVENTS)
                    Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_DEATH, Gamee.PlayerDataStorage.Instance.Level.toString());
                this._playerCar.KillCar();
                Base.AudioPlayer.Instance.StopSound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE);
                Base.AudioPlayer.Instance.StopSound(PoliceRunners.StringConstants.SOUND_CAR_DRIFT);
                Base.AudioPlayer.Instance.StopMusic();
                this.endGame(3000);
            }
        };
        State_game.prototype.onPolicePoliceCollision = function (police1, police2) {
            if (this._playState === ePlayState.PLAY && police1.sprite.alive && police2.sprite.alive) {
                this._animInstantiator.SpawnExplosion(police1.x, police1.y); //TODO put explosion more precisely
                if (!this._playerCar.NitroOn)
                    this.game.camera.shake(0.01, 200);
                var policeCar1 = police1.sprite;
                var policeCar2 = police2.sprite;
                this.addToComboCounter(2);
                Base.AudioPlayer.Instance.PlaySound(this.game.rnd.pick(this._policeCrashSounds));
                this.killPolice(policeCar1, true);
                this.killPolice(policeCar2, true);
                this._policeRadioManager.PlayDeadPoliceSound();
            }
        };
        State_game.prototype.addToComboCounter = function (valToAdd) {
            this._comboTime = 0;
            this._comboRunning = true;
            this._currentComboCounter = Math.min(this._playerCar.MaxCombo, this._currentComboCounter + valToAdd);
            this._UI.UpdateComboNum(this._currentComboCounter);
            if (this._dailyRaceManager.CurrentRaceType === PoliceRunners.DailyRaceType.COMBO_RUN
                && !this._dailyRaceManager.MissionCompleted) {
                this._dailyRaceManager.UpdateDailyRaceCounter(this._currentComboCounter, true);
                if (this._currentComboCounter >= this._dailyRaceManager.NumOfComboToAchieve)
                    this.completeDailyRaceEvent();
            }
        };
        State_game.prototype.stopComboCounter = function () {
            this._comboTime = 0;
            this._comboRunning = false;
            this._currentComboCounter = 0;
            this._UI.UpdateComboNum(0);
        };
        State_game.prototype.addScore = function (baseScoreToAdd, xPos, yPos, addToXP) {
            var addedScore = Math.ceil(Math.max(this._currentComboCounter, 1) * baseScoreToAdd);
            this._score += addedScore;
            this._UI.ShowAddedScore(addedScore, xPos, yPos);
            if (addToXP && !Gamee.Gamee.instance.IsBattle)
                this.addXP(addedScore);
            if (App.Global.GAMEE)
                Gamee.Gamee.instance.setScore(this._score);
        };
        State_game.prototype.addXP = function (xpToAdd) {
            if (!this._playerCar.Alive || this._nextLevelReached)
                return;
            this._currentXP += xpToAdd;
            this._UI.UpdateLevelBar(Math.min(1, this._currentXP / this._nextLevelVal));
            if (this._currentXP >= this._nextLevelVal) {
                //TODO zvuky!
                Base.AudioPlayer.Instance.StopSound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE);
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_LEVEL_COMPLETED);
                Base.AudioPlayer.Instance.StopMusic();
                if (App.Global.LOG_EVENTS)
                    Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_LEVEL_COMPLETED, Gamee.PlayerDataStorage.Instance.Level.toString());
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_BUY);
                Gamee.PlayerDataStorage.Instance.LevelUp(false);
                Gamee.PlayerDataStorage.Instance.SetNewCarsUnlocked(this._gameSettingsHandler.IsNewCarUnlocked(Gamee.PlayerDataStorage.Instance.Level), true);
                this._nextLevelReached = true;
                //this._UI.SetTimerToLevelComplete();
                // if (GameOptions.END_GAME_RIGHT_AFTER_LEVEL_REACHED) {
                //   this._playerCar.StopCarByDrift();
                //   this._UI.ShowFinalScreen(this._currentRaceType == eGameType.REGULAR, this._nextLevelReached, this._dailyRaceManager.MissionCompleted, Gamee.PlayerDataStorage.Instance.Level - 1, 1, this._totalMoneyPicked, this.onVideoOfferClosed.bind(this));
                // }
                // else 
                this._UI.SetTimerToLevelComplete();
            }
        };
        State_game.prototype.onGameeSoundChange = function (soundOn) {
            this.sound.mute = !soundOn;
            App.Global.soundOn = soundOn;
            if (!soundOn) {
                Base.AudioPlayer.Instance.StopMusic();
                Base.AudioPlayer.Instance.StopSound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE);
                for (var i = 0; i < this._policeCars.length; i++) {
                    this._policeCars[i].StopSirenSound();
                }
            }
            else {
                if (this._playState == ePlayState.PLAY) {
                    Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE, true);
                }
                Base.AudioPlayer.Instance.PlayMusic(PoliceRunners.StringConstants.MUSIC_MAIN);
            }
        };
        State_game.prototype.onGameePause = function () {
            this.game.paused = true;
        };
        State_game.prototype.onGameeUnpause = function () {
            this.game.paused = false;
        };
        //This is called from Gamee framework as start event callback
        State_game.prototype.onGameeRestart = function (resetState, replay, ghostMode) {
            //console.log("RESTAAAAART!!!!!!!!");
            //reset during game
            if (this._playState == ePlayState.PLAY) {
                //console.log("OU JEEEEEEEEEEEEEEEEEEEEEEEE!!!!!!!!");
                this._gameOver = true;
                this._playerCar.StopTheCarImmediatelly();
                this._levelPrepared = false;
                this.disableAllPowerups();
                this._policeCars.forEach(function (element) {
                    element.StopSirenSound();
                });
                this._playerCar.KillCar();
                Base.AudioPlayer.Instance.StopSound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE);
                Base.AudioPlayer.Instance.StopSound(PoliceRunners.StringConstants.SOUND_CAR_DRIFT);
                Base.AudioPlayer.Instance.StopMusic();
                this._levelPrepared = false;
                this.game.camera.follow(null);
            }
            else if (this._playState == ePlayState.TUTORIAL) {
                this._tutorialManager.DestroyTutorial();
            }
            this._playState = ePlayState.FORCE_RESET;
            App.Global.game.paused = false;
        };
        //This is called on first game start
        State_game.prototype.prepareGameData = function () {
            this._firstGameStart = true;
            if (!Gamee.Gamee.instance.IsBattle) {
                var currentSaveState = Gamee.Gamee.instance.saveState;
                if (currentSaveState == null) {
                    Gamee.PlayerDataStorage.Instance.InitDataFirstTime();
                    //this._playState = ePlayState.FORCE_RESET;
                }
                else {
                    //TODO smazat!!!!!
                    //Gamee.PlayerDataStorage.Instance.InitDataFirstTime();
                    Gamee.PlayerDataStorage.Instance.LoadData(Gamee.Gamee.instance.saveState);
                }
                //console.log("GAMEEtest! Load data! " + Gamee.PlayerDataStorage.Instance.GetDataInString());
            }
            else {
                //wait for battle data
                //TESTING ... DUMMY
                // Gamee.Gamee.instance.BattleData = {
                //   author: {
                //     id: "58",
                //     firstname: "Martin",
                //     lastname: "Žákovec",
                //     followersCount: 55,
                //     photo: "https://users-devel.cdn.gamee.io/a85141cf7797f4477a8bce329ab94d0c.png"
                //   }
                // }
                // this.prepareBattleScreen(Gamee.Gamee.instance.BattleData);
                // return;
                //END OF TESTING ... DUMMY... TODO DELETE!!!!!!!!!!!
                if (Gamee.Gamee.instance.IsBattle && Gamee.Gamee.instance.BattleDataRequested) {
                    //console.log("GAMEEtest: Checking callback state");
                    if (Gamee.Gamee.instance.BattleCallbackState == Gamee.eCallbackState.SUCCESS) {
                        //console.log("GAMEEtest: Checking callback state: 1");
                        this.prepareBattleScreen(Gamee.Gamee.instance.BattleData);
                    }
                    else if (Gamee.Gamee.instance.BattleCallbackState == Gamee.eCallbackState.WAITING) {
                        // console.log("GAMEEtest: Checking callback state: 2");
                        Gamee.Gamee.instance.OnBattleDataObtained.addOnce(this.prepareBattleScreen);
                    }
                    //else failure, try it again
                    else {
                        //console.log("GAMEEtest: Checking callback state: 3");
                        Gamee.Gamee.instance.RequestBattleData();
                        Gamee.Gamee.instance.OnBattleDataObtained = new Phaser.Signal();
                        Gamee.Gamee.instance.OnBattleDataObtained.addOnce(this.prepareBattleScreen);
                    }
                }
            }
            this.prepareLevel();
        };
        // private onVideoOfferClosed(videoWatched: UI.eAfterVideoState) {
        //   //console.log("YALLA! LET GO!");
        //   this._videoRewardShown = true;
        //   let eventLogStatus: string;
        //   if (!this._nextLevelReached) {
        //     if (videoWatched === UI.eAfterVideoState.NOT_WATCHED) {
        //       eventLogStatus = "notWatched";
        //       this.commitEnd(false);
        //     }
        //     else {
        //       if (videoWatched === UI.eAfterVideoState.WATCHED_WHOLE) {
        //         this._gameOver = false;
        //         this.clearPolice();
        //         this.killPowerUps();
        //         this.clearSceneObjects(this._frontLayer);
        //         this._playerCar.ReviveCar();
        //         this._UI.UpdateHealthProgressBar(this._playerCar.Health / this._playerCar.MaxHealth, true);
        //         this._particleEmmiter.StopSmoke();
        //         Base.AudioPlayer.Instance.PlaySound(StringConstants.SOUND_CAR_ENGINE);
        //         Base.AudioPlayer.Instance.PlayMusic(StringConstants.MUSIC_MAIN);
        //         eventLogStatus = "watchedWhole";
        //       }
        //       else eventLogStatus = "watchedPartially";
        //       this._afterVideoWatchWait = true;
        //       this._UI.ShowAfterVideoWatchText("tap to\ncontinue!");
        //     }
        //   }
        //   //level finished
        //   else {
        //     if (videoWatched === UI.eAfterVideoState.WATCHED_WHOLE) {
        //       this._doubleMoneyOnEnd = true;
        //       this._afterVideoWatchWait = true;
        //       eventLogStatus = "watchedWhole";
        //       this._UI.ShowAfterVideoWatchText("tap to get\nyour reward!");
        //     }
        //     else {
        //       if (videoWatched === UI.eAfterVideoState.WATCHED_PARTIALLY)
        //         eventLogStatus = "watchedPartially";
        //       else eventLogStatus = "notWatched";
        //       this.commitEnd(false);
        //     }
        //   }
        //   //logging
        //   if (App.Global.LOG_EVENTS) {
        //     if (Gamee.Gamee.instance.IsBattle) {
        //       Gamee.Gamee.instance.logGameEvent(StringConstants.EVENT_VIDEO_OFFER_REACTION_BATTLE, eventLogStatus);
        //     }
        //     else {
        //       let eventString: string = this._nextLevelReached == true ? StringConstants.EVENT_VIDEO_OFFER_REACTION_LCOMPLETED :
        //         StringConstants.EVENT_VIDEO_OFFER_REACTION_LNOTCOMPLETED;
        //       Gamee.Gamee.instance.logGameEvent(eventString, eventLogStatus);
        //     }
        //   }
        // }
        //continue playing - relevant only when payed for in-game continue
        State_game.prototype.onVideoOfferClosed = function (continuePlaying) {
            //console.log("YALLA! LET GO!");
            //TODO event log status
            this._videoRewardShown = true;
            var eventLogStatus = "";
            if (!this._nextLevelReached) {
                if (continuePlaying) {
                    eventLogStatus = "notWatched";
                    this._gameOver = false;
                    this.clearPolice();
                    this.killPowerUps();
                    this.clearSceneObjects(this._frontLayer);
                    this._playerCar.ReviveCar();
                    this._UI.UpdateHealthProgressBar(this._playerCar.Health / this._playerCar.MaxHealth, true);
                    this._particleEmmiter.StopSmoke();
                    Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_ENGINE);
                    Base.AudioPlayer.Instance.PlayMusic(PoliceRunners.StringConstants.MUSIC_MAIN);
                    eventLogStatus = "watchedWhole";
                    this._afterVideoWatchWait = true;
                    this._UI.ShowAfterVideoWatchText("tap to\ncontinue!");
                }
                else {
                    this.commitEnd();
                }
            }
            else
                this.commitEnd();
            //}
            //level finished
            // else {
            //   if (videoWatched === UI.eAfterVideoState.WATCHED_WHOLE) {
            //     this._doubleMoneyOnEnd = true;
            //     this._afterVideoWatchWait = true;
            //     eventLogStatus = "watchedWhole";
            //     this._UI.ShowAfterVideoWatchText("tap to get\nyour reward!");
            //   }
            //   else {
            //     if (videoWatched === UI.eAfterVideoState.WATCHED_PARTIALLY)
            //       eventLogStatus = "watchedPartially";
            //     else eventLogStatus = "notWatched";
            //     this.commitEnd(false);
            //   }
            // }
            //logging
            // if (App.Global.LOG_EVENTS) {
            //   if (Gamee.Gamee.instance.IsBattle) {
            //     Gamee.Gamee.instance.logGameEvent(StringConstants.EVENT_VIDEO_OFFER_REACTION_BATTLE, eventLogStatus);
            //   }
            //   else {
            //     let eventString: string = this._nextLevelReached == true ? StringConstants.EVENT_VIDEO_OFFER_REACTION_LCOMPLETED :
            //       StringConstants.EVENT_VIDEO_OFFER_REACTION_LNOTCOMPLETED;
            //     Gamee.Gamee.instance.logGameEvent(eventString, eventLogStatus);
            //   }
            // }
        };
        return State_game;
    }(Phaser.State));
    PoliceRunners.State_game = State_game;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    //during this state loading screen is shown and all needed files are loaded
    var State_preload = /** @class */ (function (_super) {
        __extends(State_preload, _super);
        function State_preload() {
            return _super.call(this) || this;
        }
        State_preload.prototype.preload = function () {
            var spritesPath = "assets/sprites/";
            var fontsPath = "assets/fonts/";
            var audioPath = "assets/sounds/";
            //** FILES TO PRELOAD */
            this.game.load.image(PoliceRunners.StringConstants.SPRITE_MAP_BG1, spritesPath + "environment/bg.jpg");
            this.game.load.image(PoliceRunners.StringConstants.SPRITE_MAP_BG_BATTLE, spritesPath + "environment/bg_battle.jpg");
            this.game.load.image(PoliceRunners.StringConstants.SPRITE_CHECKPOINT, spritesPath + "items/checkpoint.png");
            this.game.load.bitmapFont(PoliceRunners.StringConstants.FONT_DEADJIM, fontsPath + 'deadjim.png', fontsPath + 'deadjim.fnt');
            this.game.load.bitmapFont(PoliceRunners.StringConstants.FONT_UNISANS, fontsPath + 'unisans.png', fontsPath + 'unisans.fnt');
            this.game.load.bitmapFont(PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, fontsPath + 'roboto_blackItalic.png', fontsPath + 'roboto_blackItalic.fnt');
            this.game.load.bitmapFont(PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, fontsPath + 'roboto_boldItalic.png', fontsPath + 'roboto_boldItalic.fnt');
            this.game.load.bitmapFont(PoliceRunners.StringConstants.FONT_MENU_LIGHTITALIC, fontsPath + 'roboto_lightItalic.png', fontsPath + 'roboto_lightItalic.fnt');
            this.game.load.bitmapFont(PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, fontsPath + 'roboto_CondensedBoldItalic.png', fontsPath + 'roboto_CondensedBoldItalic.fnt');
            this.game.load.bitmapFont(PoliceRunners.StringConstants.FONT_POWER_UP, fontsPath + 'powerUpFont.png', fontsPath + 'powerUpFont.fnt');
            this.game.load.spritesheet(PoliceRunners.StringConstants.SPRITESHEET_EXPLOSION, spritesPath + 'items/explosion.png', 376, 260);
            this.game.load.spritesheet(PoliceRunners.StringConstants.SPRITESHEET_HIT_EFFECT, spritesPath + 'items/hitEffect.png', 130, 142);
            this.game.load.spritesheet(PoliceRunners.StringConstants.SPRITESHEET_BATTLE_RAIN, spritesPath + 'environment/rainSheet.png', 732, 1300);
            this.game.load.json(PoliceRunners.StringConstants.JSON_GAMESETTINGS, 'assets/gameSettings.json');
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_MAIN_MENU, spritesPath + "UI/mainMenu_atlas.png", spritesPath + "UI/mainMenu_atlas.json");
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_UI, spritesPath + "UI/UIatlas.png", spritesPath + "UI/UIatlas.json");
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, spritesPath + "UI/finalScreenAtlas.png", spritesPath + "UI/finalScreenAtlas.json");
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_CARS, spritesPath + "cars/carsAtlas.png", spritesPath + "cars/carsAtlas.json");
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_POLICE_CARS, spritesPath + "cars/policeCarsAtlas.png", spritesPath + "cars/policeCarsAtlas.json");
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_POWER_UPS, spritesPath + "items/powerUpsAtlas.png", spritesPath + "items/powerUpsAtlas.json");
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_TUTORIAL, spritesPath + "UI/tutAtlas.png", spritesPath + "UI/tutAtlas.json");
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_BATTLE, spritesPath + "UI/battleAtlas.png", spritesPath + "UI/battleAtlas.json");
            this.game.load.atlas(PoliceRunners.StringConstants.ATLAS_DAILY_RACE, spritesPath + "UI/dailyRaceAtlas.png", spritesPath + "UI/dailyRaceAtlas.json");
            //we have this sound as gg because we want it to loop
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CAR_ENGINE, [audioPath + 'car_engine_loop.ogg', audioPath + 'car_engine_loop.m4a']);
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CAR_DRIFT, audioPath + 'car_drifting_loop.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CRASH_POLICE_POLICE1, audioPath + 'crash_police_to_police01.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CRASH_POLICE_POLICE2, audioPath + 'crash_police_to_police02.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CRASH_POLICE_PLAYER1, audioPath + 'crash_police_to_player01.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CRASH_POLICE_PLAYER2, audioPath + 'crash_police_to_player02.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_SIREN1, [audioPath + 'police_siren_loop1.ogg', audioPath + 'police_siren_loop1.m4a']);
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_SIREN2, [audioPath + 'police_siren_loop2.ogg', audioPath + 'police_siren_loop2.m4a']);
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POWER_UP_PICKUP, audioPath + 'power_up.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CAR_DRIFT, audioPath + 'car_drifting_loop.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_GAME_OVER, audioPath + 'game_over.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_OFFER_SHOWN, audioPath + 'offerShown.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CLICK_POP, audioPath + 'pop.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CAR_BUY, audioPath + 'car_buy.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CAR_UPGRADE, audioPath + 'car_upgrade.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CAR_SELECT, audioPath + 'car_select.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_CLICK_BUTTON, audioPath + 'click_button.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_LEVEL_COMPLETED, audioPath + 'level_completed.mp3');
            //this.game.load.audio(StringConstants.SOUND_ADD_XP, audioPath + 'addXP.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO1, audioPath + 'radioSounds/policeRadio1.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO2, audioPath + 'radioSounds/policeRadio2.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO3, audioPath + 'radioSounds/policeRadio3.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO4, audioPath + 'radioSounds/policeRadio4.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO5, audioPath + 'radioSounds/policeRadio5.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO6, audioPath + 'radioSounds/policeRadio6.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO7, audioPath + 'radioSounds/policeRadio7.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO8, audioPath + 'radioSounds/policeRadio8.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO9, audioPath + 'radioSounds/policeRadio9.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.SOUND_POLICE_RADIO10, audioPath + 'radioSounds/policeRadio10.mp3');
            this.game.load.audio(PoliceRunners.StringConstants.MUSIC_MAIN, audioPath + 'music/mainMusic.mp3');
        };
        State_preload.prototype.create = function () {
            //Add sounds and music to AudioPlayer
            var soundList = [
                PoliceRunners.StringConstants.SOUND_CAR_ENGINE,
                PoliceRunners.StringConstants.SOUND_CAR_DRIFT,
                PoliceRunners.StringConstants.SOUND_CRASH_POLICE_POLICE1,
                PoliceRunners.StringConstants.SOUND_CRASH_POLICE_POLICE2,
                PoliceRunners.StringConstants.SOUND_CRASH_POLICE_PLAYER1,
                PoliceRunners.StringConstants.SOUND_CRASH_POLICE_PLAYER2,
                PoliceRunners.StringConstants.SOUND_POWER_UP_PICKUP,
                PoliceRunners.StringConstants.SOUND_POLICE_SIREN1,
                PoliceRunners.StringConstants.SOUND_POLICE_SIREN2,
                PoliceRunners.StringConstants.SOUND_GAME_OVER,
                PoliceRunners.StringConstants.SOUND_OFFER_SHOWN,
                PoliceRunners.StringConstants.SOUND_CLICK_POP,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO1,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO2,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO3,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO4,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO5,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO6,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO7,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO8,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO9,
                PoliceRunners.StringConstants.SOUND_POLICE_RADIO10,
                PoliceRunners.StringConstants.SOUND_CAR_BUY,
                PoliceRunners.StringConstants.SOUND_CAR_UPGRADE,
                PoliceRunners.StringConstants.SOUND_CAR_SELECT,
                PoliceRunners.StringConstants.SOUND_CLICK_BUTTON,
                PoliceRunners.StringConstants.SOUND_LEVEL_COMPLETED
                //StringConstants.SOUND_ADD_XP
            ];
            var musicList = [
                PoliceRunners.StringConstants.MUSIC_MAIN,
            ];
            for (var i = 0; i < soundList.length; i++) {
                var snd = this.game.add.sound(soundList[i]);
                snd.allowMultiple = true;
                Base.AudioPlayer.Instance.AddSound(soundList[i], snd);
            }
            Base.AudioPlayer.Instance.SetSoundVolume(PoliceRunners.StringConstants.SOUND_CAR_ENGINE, 0.2);
            Base.AudioPlayer.Instance.SetSoundVolume(PoliceRunners.StringConstants.SOUND_CAR_DRIFT, 0.6);
            for (var i = 0; i < musicList.length; i++) {
                var music = this.game.add.sound(musicList[i]);
                Base.AudioPlayer.Instance.AddMusic(musicList[i], music);
            }
            Base.AudioPlayer.Instance.SetMusicVolume(PoliceRunners.StringConstants.MUSIC_MAIN, 0.6);
            this.state.start(PoliceRunners.StringConstants.STATE_GAME);
        };
        return State_preload;
    }(Phaser.State));
    PoliceRunners.State_preload = State_preload;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var StringConstants = /** @class */ (function () {
        function StringConstants() {
        }
        //states
        StringConstants.STATE_BOOT = "Boot";
        StringConstants.STATE_PRELOAD = "Preload";
        StringConstants.STATE_GAME = "Game";
        //keys to assets
        StringConstants.JSON_GAMESETTINGS = "gameSettings";
        StringConstants.FONT_DEADJIM = "fontDeadJim";
        StringConstants.FONT_UNISANS = "fontUnisans";
        StringConstants.FONT_MENU_BLACKITALIC = "fontMenuBlackItalic";
        StringConstants.FONT_MENU_BOLDITALIC = "fontMenuBoldItalic";
        StringConstants.FONT_MENU_CONDENSED_BOLDITALIC = "fontMenuCondensedBoldItalic";
        StringConstants.FONT_MENU_LIGHTITALIC = "fontMenuLightItalic";
        StringConstants.FONT_POWER_UP = "fontPowerUp";
        StringConstants.KEY_POLICE1 = "police1";
        StringConstants.KEY_POLICE2 = "police2";
        StringConstants.KEY_POLICE3 = "police3";
        StringConstants.KEY_POLICE4 = "police4";
        StringConstants.KEY_POLICE5 = "police5";
        //.cars
        StringConstants.ATLAS_MAIN_MENU = "atlasMainMenu";
        StringConstants.ATLAS_UI = "atlasUI";
        StringConstants.ATLAS_FINAL_SCREENS = "atlasFinalScreens";
        StringConstants.ATLAS_CARS = "atlasCars";
        StringConstants.ATLAS_POLICE_CARS = "atlasPoliceCars";
        StringConstants.ATLAS_POWER_UPS = "atlasPowerUps";
        StringConstants.ATLAS_TUTORIAL = "atlasTutorial";
        StringConstants.ATLAS_BATTLE = "atlasBattle";
        StringConstants.ATLAS_DAILY_RACE = "atlasDailyRace";
        //atlas keys
        StringConstants.AK_LOBBY_ARROW_GREEN = "arrow_green";
        StringConstants.AK_LOBBY_ARROW_ORANGE = "arrow_orrange";
        StringConstants.AK_LOBBY_ARROW_RED = "arrow_red";
        //static readonly AK_LOBBY_BG: string = "bg";
        StringConstants.AK_LOBBY_BTN_RACE_COUNTING = "button_daily_race_counting";
        StringConstants.AK_LOBBY_BTN_DAILY_RACE_READY = "button_daily_race_ready";
        //static readonly AK_LOBBY_BTN_DAILY_RACE_COMING_SOON: string = "button_daily_race_coming-soon";
        StringConstants.AK_LOBBY_BTN_DRIVE = "button_drive";
        StringConstants.AK_LOBBY_BTN_GARAGE = "button_garage";
        StringConstants.AK_LOBBY_BTN_INGARAGE_PRESSED = "button_ingarage_pressed";
        StringConstants.AK_LOBBY_BTN_IN_USE = "button_in_use";
        StringConstants.AK_LOBBY_BTN_PAY = "button_pay";
        StringConstants.AK_LOBBY_BTN_PLAY = "play_button";
        StringConstants.AK_LOBBY_BTN_PLAY_PRESSED = "play_button_pressed";
        StringConstants.AK_LOBBY_BTN_PRESSED_BIG = "button_pressed_big";
        StringConstants.AK_LOBBY_BTN_PRESSED_SMALL = "button_pressed_small";
        StringConstants.AK_LOBBY_BTN_SHADOW_BIG = "button_shadow_big";
        StringConstants.AK_LOBBY_BTN_SHADOW_SMALL = "button_shadow_small";
        StringConstants.AK_LOBBY_BTN_SKIP = "button_skip";
        StringConstants.AK_LOBBY_BTN_SKIP_PRESSED = "button_skip_pressed";
        StringConstants.AK_LOBBY_CAR_CARD = "car_card";
        StringConstants.AK_LOBBY_CAR_CARD_GROUP_LINE = "car_card_group_line";
        StringConstants.AK_LOBBY_CAR_CARD_PICKED = "car_card_picked";
        StringConstants.AK_LOBBY_EXCLAMATION = "exclamation_symbol";
        StringConstants.AK_LOBBY_FILES_LIST = "filesList";
        StringConstants.AK_LOBBY_HP_BAR_BG = "hp_bar_bg";
        StringConstants.AK_LOBBY_MESSAGE = "message";
        StringConstants.AK_LOBBY_MISSION_BAR_BG = "mission_bar_bg";
        StringConstants.AK_LOBBY_MISSION_BAR_FILL = "mission_bar_fill";
        StringConstants.AK_LOBBY_MISSION_BG = "mission_bg";
        StringConstants.AK_LOBBY_MISSION_SHADOW = "mission_shadow";
        StringConstants.AK_LOBBY_TOP_DRIVER_TAB = "top_driver_tab";
        StringConstants.AK_LOBBY_TOP_DRIVER_TAB_SHADOW = "top_driver_tab_shadow";
        StringConstants.AK_LOBBY_TOP_DRIVERS_HEADLINE = "top_drivers_headline";
        StringConstants.AK_LOBBY_HPFILLBAR_LEFT = "hp_bar_fill_left";
        StringConstants.AK_LOBBY_HPFILLBAR_MIDDLE = "hp_bar_fill_center";
        StringConstants.AK_LOBBY_HPFILLBAR_RIGHT = "hp_bar_fill_right";
        //static readonly AK_LOBBY_VIDEO_BUTTON: string = "button_watch";
        //static readonly AK_LOBBY_VIDEO_BUTTON_PRESSED: string = "button_watch_pressed";
        StringConstants.AK_LOBBY_ARROW_BACK = "arrowBack";
        StringConstants.AK_LOBBY_ICON_TOPDRIVERS = "position_icon";
        StringConstants.AK_LOBBY_ICON_UPGRADES = "upgrade_icon";
        StringConstants.AK_LOBBY_BOOSTERBTN_RAGE = "rage_booster";
        StringConstants.AK_LOBBY_BOOSTERBTN_MONEY = "money_booster";
        StringConstants.AK_LOBBY_BOOSTERBTN_MYSTERYBOX = "mystery_box_booster";
        StringConstants.AK_LOBBY_BOOSTERBTN_COMBO = "combo_booster";
        StringConstants.AK_LOBBY_BOOSTERBTN_ACTIVATED = "pressed_activated_booster";
        StringConstants.AK_LOBBY_BUTTON_VIP = "button_vip";
        StringConstants.AK_LOBBY_BUTTON_VIP_POPUP_CLOSE = "close_button";
        StringConstants.AK_LOBBY_BUTTON_VIP_POPUP_CLOSE_PRESSED = "close_button_pressed";
        StringConstants.AK_LOBBY_ICON_COIN = "coin";
        StringConstants.AK_LOBBY_ICON_GEM = "gem";
        StringConstants.AK_LOBBY_PURCHASEICON_COMBO = "combo_icon";
        StringConstants.AK_LOBBY_PURCHASEICON_MONEY = "money_icon";
        StringConstants.AK_LOBBY_PURCHASEICON_MYSTERYBOX = "mystery_box_icon";
        StringConstants.AK_LOBBY_PURCHASEICON_RAGE = "rage_icon";
        StringConstants.AK_LOBBY_VIP_BADGE = "vip_badge";
        StringConstants.AK_LOBBY_VIP_POPUP = "vip_popup_bg";
        StringConstants.AK_LOBBY_PREMIUM_BADGE = "premium_badge";
        StringConstants.AK_LOBBY_VIP_BATTLE_BG = "vip_battle_bg";
        StringConstants.AK_LOBBY_VIP_BATTLE_VIPBTN = "vip_button";
        StringConstants.AK_LOBBY_VIP_BATTLE_BTNPRESSED = "vip_button_pressed";
        StringConstants.AK_LOBBY_VIP_BATTLE_GEMBTN = "gem_button";
        StringConstants.AK_LOBBY_VIP_BATTLE_CANCEL_PRESSED = "cancel_button_pressed";
        StringConstants.AK_LOBBY_VIP_BATTLE_CANCEL_BTN = "cancel_button";
        StringConstants.AK_UI_TIME_ICON = "time_icon";
        StringConstants.AK_UI_MONEY_POINTER = "money_pointer";
        StringConstants.AK_UI_COP_POINTER = "cop_pointer";
        StringConstants.AK_UI_MYSTERY_BOX_POINTER = "mb_pointer";
        StringConstants.AK_UI_DARK_OVAL = "dark_invert_oval_effect_1st_layer";
        StringConstants.AK_UI_HEALTH_BAR = "health_bar";
        StringConstants.AK_UI_HEALTH_BAR_FILL = "health_bar_fill";
        StringConstants.AK_UI_HEALTH_BAR_HEART = "health_bar_heart";
        StringConstants.AK_UI_MULTIPLY_BAR = "multiply_bar";
        StringConstants.AK_UI_MULTIPLY_BAR_FILL = "multiply_bar_fill";
        StringConstants.AK_UI_PROGRESS_BAR = "progress_bar";
        StringConstants.AK_UI_PROGRESS_BAR_FILL = "progress_bar_fill";
        StringConstants.AK_UI_CAR_LOCKED_CARD = "car_card_locked";
        StringConstants.AK_UI_PHOTO_ARROW = "photo_ukazatel";
        StringConstants.AK_UI_LC_BG = "bg";
        StringConstants.AK_UI_LC_LEVEL_TEXT = "level_text";
        StringConstants.AK_UI_LC_COMPLETED_TEXT = "completed_text";
        StringConstants.AK_UI_LC_STAR_NORMAL = "normal_star";
        StringConstants.AK_UI_LC_STAR_BIG = "big_star";
        StringConstants.AK_UI_LC_STARS_GROUP_1 = "stars_group_1";
        StringConstants.AK_UI_LC_STARS_GROUP_2 = "stars_group_2";
        StringConstants.AK_FS_TITLE_STRIPE = "title_stripe";
        //static readonly AK_FS_MONEY_SMALL: string = "money_small";
        StringConstants.AK_FS_MONEY = "money";
        StringConstants.AK_FS_BUTTON_YES = "button_yes";
        StringConstants.AK_FS_BUTTON_PRESSED = "button_pressed";
        StringConstants.AK_FS_BUTTON_DOUBLE_MONEY = "button_double_money";
        StringConstants.AK_FS_BG_SMALL = "bg";
        StringConstants.AK_FS_BG_BIG = "bg_big";
        StringConstants.AK_FS_BG_SMALLEST = "bg_smallest";
        StringConstants.AK_FS_BTN_BLUE_SMALL = "blue_small";
        StringConstants.AK_FS_BTN_BLUE_LARGE = "blue_large";
        StringConstants.AK_FS_BTN_GREEN_LARGE = "green_large";
        StringConstants.AK_FS_BTN_GREEN_SMALL = "green_small";
        StringConstants.AK_FS_BTN_PRESSED_SMALL = "small_pressed";
        StringConstants.AK_FS_BTN_PRESSED_LARGE = "large_pressed";
        StringConstants.AK_PU_MONEY = "money_pickup";
        StringConstants.AK_PU_MYSTERY_BOX_IMG = "mystery_box_box";
        StringConstants.AK_PU_MYSTERY_BOX_TEXT = "mystery_box_text";
        StringConstants.AK_PU_SPIKES = "spikes_front";
        StringConstants.AK_PU_HEART = "heart";
        StringConstants.AK_PU_SHIELD = "shield";
        StringConstants.AK_PU_OIL_FRAMES = "oil_";
        StringConstants.AK_PU_NITRO_FRAMES = "animace_bluespeedup_";
        StringConstants.AK_TUT_ARROW = "arrow";
        StringConstants.AK_TUT_BOX_1 = "box_1";
        StringConstants.AK_TUT_BOX_2 = "box_2";
        StringConstants.AK_TUT_BOX_3 = "box_3";
        StringConstants.AK_TUT_TOUCH = "touch";
        StringConstants.AK_TUT_CAR = "car";
        StringConstants.AK_TUT_CAR_SKIDMARKS = "car_skidmarks";
        StringConstants.AK_TUT_HAND = "hand";
        StringConstants.AK_TUT_COP_CARS = "cop_cars";
        StringConstants.AK_TUT_WHITE_LAYER = "white_layer";
        StringConstants.AK_CAR_LIGHTS = "car_lights";
        StringConstants.AK_CAR_DESTROYED = "car_destroyed";
        StringConstants.AK_CAR_TIRE_MARKS = "car_skidmarks";
        StringConstants.AK_CAR_SMOKE_PARTICLE = "smoke_particle";
        StringConstants.AK_CAR_TYPE = "car_";
        StringConstants.AK_POLICECAR_TYPE = "policeCar_";
        StringConstants.AK_POLICECAR_LIGHT_BLUE = "cop_light_blue";
        StringConstants.AK_POLICECAR_LIGHT_RED = "cop_light_red";
        StringConstants.AK_BATTLE_BAR_CUSTOM_BATTLE_SCREEN = "bar_custom_battle_screen";
        StringConstants.AK_BATTLE_ICON = "battle_icon";
        StringConstants.AK_BATTLE_OIL = "oil_";
        StringConstants.AK_BATTLE_SHARE_ICON_BG = "icon_bg";
        StringConstants.AK_BATTLE_SHARE_ICON_FRAME = "icon_photo_frame";
        StringConstants.AK_BATTLE_SHARE_ICON_OVERLAY = "icon_photo_overlay";
        StringConstants.AK_BATTLE_START_SCREEN_LARGE = "bg_battle_start_screen_large";
        StringConstants.AK_BATTLE_START_SCREEN_SMALL = "bg_battle_start_screen_small";
        StringConstants.AK_BATTLE_CUSTOM_BATTLE_SCREEN = "bg_custom_battle_screen";
        StringConstants.AK_BATTLE_CUSTOM_BATTLE_SCREEN_SHADOW = "bg_custom_battle_screen_shadow";
        StringConstants.AK_BATTLE_BTN_MENU_CREATE = "button_battle_create";
        StringConstants.AK_BATTLE_BTN_MENU_CREATE_PRESSED = "button_battle_create_pressed";
        StringConstants.AK_BATTLE_BTN_CROSS = "cross_button_custom_battle_screen";
        StringConstants.AK_BATTLE_BAR_DIVIDE_STRIPES = "divide_stripes_bar_custom_battle_screen";
        StringConstants.AK_BATTLE_BAR_FILL = "fill_bar_custom_battle_screen";
        StringConstants.AK_BATTLE_BAR_ICON = "icon_custom_battle_screen";
        StringConstants.AK_BATTLE_BTN_MINUS = "minus_buttom_custom_battle_screen";
        StringConstants.AK_BATTLE_BTN_PLUS = "plus_buttom_custom_battle_screen";
        StringConstants.AK_BATTLE_BTN_PLUSMINUS_PRESSED = "plus_minus_button_pressed_custom_battle_screen";
        StringConstants.AK_BATTLE_BTN_CREATE = "button_create";
        StringConstants.AK_BATTLE_BTN_CREATE_PRESSED = "button_create_pressed";
        StringConstants.AK_BATTLE_STRIPE = "stripe_custom_battle_screen";
        StringConstants.AK_BATTLE_VISIBILITY_LAYER = "visibility_layer";
        StringConstants.AK_DR_FOLLOW_ARROW = "arrow";
        StringConstants.AK_DR_CHECKPOINT = "circle";
        StringConstants.AK_DR_ICON_COMBO = "combo_icon";
        StringConstants.AK_DR_ICON_DONE = "done";
        StringConstants.AK_DR_ICON_HUNT = "hunt_icon";
        StringConstants.AK_DR_BG_LARGE = "large_bg";
        StringConstants.AK_DR_BG_SMALL = "small_bg";
        StringConstants.AK_DR_EMOJI_MUSCLE = "muscle_hand_emoji";
        StringConstants.AK_DR_EMOJI_POLICE = "police_emoji";
        StringConstants.AK_DR_EMOJI_RACE = "race_emoji";
        StringConstants.AK_DR_ICON_RACE = "race_icon";
        //anims
        StringConstants.ANIM_CAR_NITRO_PART1 = "animNitro_p1";
        StringConstants.ANIM_CAR_NITRO_PART2 = "animNitro_p2";
        StringConstants.ANIM_CAR_HEALTH = "animHealth";
        StringConstants.ANIM_CAR_SHIELD = "animShield";
        //items
        StringConstants.SPRITE_CHECKPOINT = "checkpoint";
        //.mapBg
        StringConstants.SPRITE_MAP_BG1 = "mapBg1";
        StringConstants.SPRITE_MAP_BG_BATTLE = "mapBgBattle";
        //sheets
        StringConstants.SPRITESHEET_EXPLOSION = "explosionSheet";
        StringConstants.SPRITESHEET_OFFSCREEN_SIREN = "offScreenSirenSheet";
        StringConstants.SPRITESHEET_HIT_EFFECT = "hitEffect";
        StringConstants.SPRITE_BATTLE_CREATOR_AVATAR = "battleCreatorAvatar";
        StringConstants.ATLAS_BUTTONS = "buttonAtlas";
        StringConstants.SPRITESHEET_BATTLE_RAIN = "battleRain";
        StringConstants.UI_STARBG = "moneyBox";
        StringConstants.SCREEN1_SPRITE_A = "screen1a";
        StringConstants.ANIM_JETPACKFIRE = "jpFire";
        StringConstants.ANIM_TUTORIAL_HAND = "tutorialHandClick";
        StringConstants.ANIM_AMMO_BAR_BLINKING = "ammoBarBlinking";
        StringConstants.SPINE_CAT_ANIM = "spineCatAnim";
        StringConstants.SOUND_ADD_XP = "sound_addXP";
        StringConstants.SOUND_CAR_ENGINE = "sound_carEngine";
        StringConstants.SOUND_CAR_DRIFT = "sound_carDrift";
        StringConstants.SOUND_CRASH_POLICE_POLICE1 = "sound_crashPolicePolice1";
        StringConstants.SOUND_CRASH_POLICE_POLICE2 = "sound_crashPolicePolice2";
        StringConstants.SOUND_CRASH_POLICE_PLAYER1 = "sound_carPolicePlayer1";
        StringConstants.SOUND_CRASH_POLICE_PLAYER2 = "sound_carPolicePlayer2";
        StringConstants.SOUND_POLICE_SIREN1 = "sound_policeSiren1";
        StringConstants.SOUND_POLICE_SIREN2 = "sound_policeSiren2";
        StringConstants.SOUND_GAME_OVER = "sound_gameOver";
        StringConstants.SOUND_POWER_UP_PICKUP = "sound_powerUpPickup";
        StringConstants.SOUND_OFFER_SHOWN = "sound_offerShown";
        StringConstants.SOUND_CLICK_POP = "sound_clickPop";
        StringConstants.SOUND_CAR_BUY = "sound_carBuy";
        StringConstants.SOUND_CAR_SELECT = "sound_carSelect";
        StringConstants.SOUND_CAR_UPGRADE = "sound_carUpgrade";
        StringConstants.SOUND_LEVEL_COMPLETED = "sound_levelCompleted";
        StringConstants.SOUND_CLICK_BUTTON = "sound_clickButton";
        StringConstants.SOUND_POLICE_RADIO1 = "sound_policeRadio1";
        StringConstants.SOUND_POLICE_RADIO2 = "sound_policeRadio2";
        StringConstants.SOUND_POLICE_RADIO3 = "sound_policeRadio3";
        StringConstants.SOUND_POLICE_RADIO4 = "sound_policeRadio4";
        StringConstants.SOUND_POLICE_RADIO5 = "sound_policeRadio5";
        StringConstants.SOUND_POLICE_RADIO6 = "sound_policeRadio6";
        StringConstants.SOUND_POLICE_RADIO7 = "sound_policeRadio7";
        StringConstants.SOUND_POLICE_RADIO8 = "sound_policeRadio8";
        StringConstants.SOUND_POLICE_RADIO9 = "sound_policeRadio9";
        StringConstants.SOUND_POLICE_RADIO10 = "sound_policeRadio10";
        StringConstants.MUSIC_MAIN = "music_upgradeScreen";
        StringConstants.EVENT_TUTORIAL_START = "tutorialStarted";
        StringConstants.EVENT_TUTORIAL_FINISHED = "tutorialFinished";
        StringConstants.EVENT_LEVEL_COMPLETED = "levelCompleted";
        StringConstants.EVENT_CAR_BOUGHT = "carBought";
        StringConstants.EVENT_PREMIUM_CAR_BOUGHT = "premiumCarBought";
        StringConstants.EVENT_CAR_UPGRADED = "carUpgraded";
        StringConstants.EVENT_CAR_SELECTED = "carSelected";
        StringConstants.EVENT_DEATH = "death";
        StringConstants.EVENT_BATTLE_CREATED = "battleCreated";
        StringConstants.EVENT_VIDEO_OFFER_SHOWN_BATTLE = "videoOfferShown_battle";
        StringConstants.EVENT_VIDEO_OFFER_SHOWN_CAMPAIGN = "videoOfferShown_campaign";
        StringConstants.EVENT_VIDEO_OFFER_SHOWN_DAILY_RACE = "videoOfferShown_dailyRace";
        StringConstants.EVENT_VIDEO_OFFER_CLICK_NEW_CAR = "videoOfferClick_newCar";
        StringConstants.EVENT_VIDEO_OFFER_REACTION_BATTLE = "videoOfferReaction_battle";
        StringConstants.EVENT_VIDEO_OFFER_REACTION_LCOMPLETED = "videoOfferReaction_lCompleted";
        StringConstants.EVENT_VIDEO_OFFER_REACTION_LNOTCOMPLETED = "videoOfferReaction_lNotCompleted";
        return StringConstants;
    }());
    PoliceRunners.StringConstants = StringConstants;
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var eXPNotifyType;
        (function (eXPNotifyType) {
            eXPNotifyType[eXPNotifyType["UNDEFINED"] = 0] = "UNDEFINED";
            eXPNotifyType[eXPNotifyType["NEAR_MISS"] = 1] = "NEAR_MISS";
            eXPNotifyType[eXPNotifyType["TIME_ADD"] = 2] = "TIME_ADD";
        })(eXPNotifyType = UI.eXPNotifyType || (UI.eXPNotifyType = {}));
        var AddedXPNotificator = /** @class */ (function (_super) {
            __extends(AddedXPNotificator, _super);
            function AddedXPNotificator(game, xPos, yPos, font, size) {
                var _this = _super.call(this, game, xPos, yPos, font, "XXX", size) || this;
                _this.regularTimeToShow = 1500;
                _this._currentlyShowing = eXPNotifyType.UNDEFINED;
                _this._currentAmountShowing = 0;
                _this.anchor.set(0.5);
                _this.fixedToCamera = true;
                _this.scale.y = 0;
                return _this;
            }
            AddedXPNotificator.prototype.ShowAddedXP = function (addedType, addedAmount) {
                if (this._showingTimeEvent != null)
                    this.game.time.events.remove(this._showingTimeEvent);
                //console.log("SHOW XXP ADD!");
                //Base.AudioPlayer.Instance.PlaySound(StringConstants.SOUND_ADD_XP);
                var amountToShow = addedAmount;
                if (this._currentlyShowing != eXPNotifyType.UNDEFINED) {
                    if (addedType === this._currentlyShowing)
                        amountToShow += this._currentAmountShowing;
                    else
                        this.hideText();
                }
                this._currentAmountShowing = amountToShow;
                this._currentlyShowing = addedType;
                if (addedType === eXPNotifyType.NEAR_MISS)
                    this.text = "NEAR MISS! +" + amountToShow + "XP";
                else if (addedType === eXPNotifyType.TIME_ADD)
                    this.text = "TIME BONUS! +" + amountToShow + "XP";
                this.game.add.tween(this.scale).to({ y: 1 }, 150, Phaser.Easing.Bounce.Out, true);
                this._showingTimeEvent = this.game.time.events.add(this.regularTimeToShow, this.hideText, this);
            };
            AddedXPNotificator.prototype.hideText = function () {
                this.game.add.tween(this.scale).to({ y: 0 }, 150, Phaser.Easing.Bounce.In, true);
                this._showingTimeEvent = null;
                this._currentlyShowing = eXPNotifyType.UNDEFINED;
                this._currentAmountShowing = 0;
            };
            return AddedXPNotificator;
        }(Phaser.BitmapText));
        UI.AddedXPNotificator = AddedXPNotificator;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var BattleCreatorScreen = /** @class */ (function (_super) {
            __extends(BattleCreatorScreen, _super);
            function BattleCreatorScreen(game, menuManager) {
                var _this = _super.call(this, game) || this;
                _this._menuManagerRef = menuManager;
                var bg = _this.game.add.image(_this.game.width / 2, _this.game.height / 2, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_CUSTOM_BATTLE_SCREEN);
                bg.anchor.set(0.5);
                var bgShadow = _this.game.add.image(bg.x - bg.width * .15, bg.y + bg.height * .17, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_CUSTOM_BATTLE_SCREEN_SHADOW);
                bgShadow.anchor.set(0.5);
                var cancelButton = _this.game.add.button(bg.right - bg.width * .14, bg.top + bg.height * .08, PoliceRunners.StringConstants.ATLAS_BATTLE, _this.onCancelClick, _this, PoliceRunners.StringConstants.AK_BATTLE_BTN_CROSS, PoliceRunners.StringConstants.AK_BATTLE_BTN_CROSS, PoliceRunners.StringConstants.AK_BATTLE_BTN_CROSS, PoliceRunners.StringConstants.AK_BATTLE_BTN_CROSS);
                cancelButton.anchor.set(0.5);
                cancelButton.input.priorityID = 2;
                var stripe = _this.game.add.image(bg.left, bg.top + bg.height * .18, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_STRIPE);
                stripe.anchor.set(0, 0.5);
                var stripeIcon = _this.game.add.image(stripe.width * .08, 0, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_BAR_ICON);
                stripeIcon.anchor.set(0.5);
                stripe.addChild(stripeIcon);
                var sign = _this.game.add.bitmapText(stripe.width * .18, 0, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "BATTLE CREATOR", 50);
                sign.anchor.set(0, 0.35);
                sign.tint = 0x7cfdea;
                stripe.addChild(sign);
                var startPos = stripe.bottom + bg.height * .11;
                var gap = bg.height * .12;
                _this.createAdjustBar(0, startPos, "VISIBILITY");
                _this.createAdjustBar(1, startPos + gap, "OIL SPILLS");
                _this.createAdjustBar(2, startPos + gap * 2, "CAR SPEED");
                _this.createAdjustBar(3, startPos + gap * 3, "COPS LEVEL");
                var playButton = new UI.SimpleButton(_this.game, _this.game.width / 2, bg.bottom - bg.height * .12, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_BTN_CREATE, PoliceRunners.StringConstants.AK_BATTLE_BTN_CREATE_PRESSED, _this.onCreateBattleClick, _this, undefined, 0.5, 0.5);
                //let testImg = this.game.add.image(0,0,"avatarImageKoko");
                _this.add(bgShadow);
                _this.add(bg);
                _this.add(stripe);
                _this.add(cancelButton);
                _this.add(_this._visibilityAdjustBar);
                _this.add(_this._elasticityAdjustBar);
                _this.add(_this._speedAdjustBar);
                _this.add(_this._copsAdjustBar);
                _this.add(playButton);
                return _this;
                //this.add(testImg);
            }
            BattleCreatorScreen.prototype.createAdjustBar = function (type, yPos, text) {
                //create progress bars
                var bar = new UI.ProgressBarSettable(this.game, this.game.width / 2, yPos, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_BAR_CUSTOM_BATTLE_SCREEN, PoliceRunners.StringConstants.AK_BATTLE_BAR_FILL, 0, 0, PoliceRunners.StringConstants.AK_BATTLE_BTN_MINUS, PoliceRunners.StringConstants.AK_BATTLE_BTN_PLUS, PoliceRunners.StringConstants.AK_BATTLE_BTN_PLUSMINUS_PRESSED, null, text);
                bar.x -= bar.ProgressBarBackSprite.width / 2;
                bar.CurrentVal = 0.5;
                switch (type) {
                    case 0:
                        this._visibilityAdjustBar = bar;
                        break;
                    case 1:
                        this._elasticityAdjustBar = bar;
                        break;
                    case 2:
                        this._speedAdjustBar = bar;
                        break;
                    case 3:
                        this._copsAdjustBar = bar;
                        break;
                }
            };
            BattleCreatorScreen.prototype.onCancelClick = function () {
                this._menuManagerRef.SwitchScreen(null, null, false, UI.eMenuPart.LOBBY);
            };
            BattleCreatorScreen.prototype.onCreateBattleClick = function () {
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_BUTTON);
                this.createShareImage();
                var battleData = {
                    score: null,
                    destination: "battle",
                    picture: Utils.PhaserUtils.GetBase64ImageFromSprite(this._shareIcon),
                    initData: JSON.stringify(this.getBattleSettings()),
                    text: ""
                };
                Gamee.Gamee.instance.Share(battleData);
                this._shareIcon.visible = false;
                if (App.Global.LOG_EVENTS)
                    Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_BATTLE_CREATED, "");
            };
            BattleCreatorScreen.prototype.createShareImage = function () {
                this._shareIcon = this.game.add.image(0, 0, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_SHARE_ICON_BG);
                var picFrame = this.game.add.image(this._shareIcon.width * .75, this._shareIcon.height * .45, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_SHARE_ICON_FRAME);
                picFrame.anchor.set(0.5);
                picFrame.angle = -7;
                var avatarImg = this.game.add.image(0, 0, Gamee.Gamee.instance.PlayerData.name);
                Utils.PhaserUtils.NormalizeSprite(avatarImg, picFrame.width * .7, picFrame.height * .7);
                avatarImg.anchor.set(0.37, 0.62);
                var playerNameNormalized = Utils.StringUtils.NormalizePlayerName(Gamee.Gamee.instance.PlayerData.name, 8, true);
                var battleText = this.game.add.bitmapText(picFrame.width * .15, picFrame.height * .6, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, playerNameNormalized + "'S", 26);
                battleText.anchor.set(0.6, 0.5);
                //battleText.angle = -7;
                var battleText2 = this.game.add.bitmapText(0, battleText.height * 1.2, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "BATTLE", 26);
                battleText2.anchor.set(0.5);
                battleText.addChild(battleText2);
                picFrame.addChild(avatarImg);
                picFrame.addChild(battleText);
                this._shareIcon.addChild(picFrame);
            };
            BattleCreatorScreen.prototype.getBattleSettings = function () {
                return {
                    visibility: this._visibilityAdjustBar.CurrentVal,
                    oilSpills: this._elasticityAdjustBar.CurrentVal,
                    carSpeed: this._speedAdjustBar.CurrentVal,
                    copsLevel: this._copsAdjustBar.CurrentVal
                };
            };
            return BattleCreatorScreen;
        }(Phaser.Group));
        UI.BattleCreatorScreen = BattleCreatorScreen;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var BattleInitScreen = /** @class */ (function (_super) {
            __extends(BattleInitScreen, _super);
            function BattleInitScreen(game, smallScreen) {
                var _this = _super.call(this, game) || this;
                _this.OnBattleScreenTap = new Phaser.Signal();
                _this._secondsToStart = 3;
                _this._creatorPhotoLoaded = false;
                var bg = _this.game.add.image(_this.game.width / 2, _this.game.height / 2, PoliceRunners.StringConstants.ATLAS_BATTLE, !smallScreen ? PoliceRunners.StringConstants.AK_BATTLE_START_SCREEN_LARGE : PoliceRunners.StringConstants.AK_BATTLE_START_SCREEN_SMALL);
                bg.anchor.set(0.5);
                var driverName = Gamee.Gamee.instance.BattleData.author.firstname + " " + Gamee.Gamee.instance.BattleData.author.lastname;
                driverName = Utils.StringUtils.NormalizePlayerName(driverName, 17, false);
                var title = _this.game.add.bitmapText(_this.game.width / 2, smallScreen ? bg.top + bg.height * .21 : bg.top + bg.height * .13, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "BATTLE CREATED BY\n" + driverName, 46);
                title.anchor.set(0.5);
                title.align = 'center';
                game.cache.getBitmapFont(PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC).font.lineHeight = 74; //be carefull! affects all the fonts
                _this._whiteCircle = Utils.PhaserUtils.DrawCircle(_this.game, bg.x, title.y + title.height * 1.2, bg.width * .21, 0xffffff);
                var battleIcon = _this.game.add.image(_this._whiteCircle.x + _this._whiteCircle.width * .82, _this._whiteCircle.y - _this._whiteCircle.width / 3, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_ICON);
                battleIcon.anchor.set(0.5);
                //PlayerDataStorage.Instance.BattleSettings
                if (!smallScreen) {
                    var startPos = _this._whiteCircle.bottom;
                    var gap = bg.height * .09;
                    var visProgressBar = _this.createSettingProgressBar(startPos, "VISIBILITY");
                    visProgressBar.UpdateBarProgress(Gamee.PlayerDataStorage.Instance.BattleSettings.visibility);
                    var elProgressBar = _this.createSettingProgressBar(startPos + gap, "OIL SPILLS");
                    elProgressBar.UpdateBarProgress(Gamee.PlayerDataStorage.Instance.BattleSettings.oilSpills);
                    var speedProgressBar = _this.createSettingProgressBar(startPos + gap * 2, "CAR SPEED");
                    speedProgressBar.UpdateBarProgress(Gamee.PlayerDataStorage.Instance.BattleSettings.carSpeed);
                    var copLevelProgressBar = _this.createSettingProgressBar(startPos + gap * 3, "COPS LEVEL");
                    copLevelProgressBar.UpdateBarProgress(Gamee.PlayerDataStorage.Instance.BattleSettings.copsLevel);
                }
                var tapToPlayText = _this.game.add.bitmapText(bg.x, smallScreen ? bg.bottom - bg.height * .15 : bg.bottom - bg.height * .13, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "TAP TO PLAY", 32);
                tapToPlayText.anchor.set(0.5);
                _this.game.add.tween(tapToPlayText).to({ "alpha": 0 }, 250, Phaser.Easing.Linear.None, true, 0, -1, true);
                // this._secondsText = this.game.add.bitmapText(tapToPlayText.x, tapToPlayText.y+tapToPlayText.height*1.4, StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, this._secondsToStart.toString(), 30);
                // this._secondsText.anchor.set(0.5);
                _this._tapCatcher = _this.game.add.image(0, 0);
                _this._tapCatcher.scale.setTo(_this.game.width, _this.game.height);
                _this._tapCatcher.inputEnabled = true;
                _this._tapCatcher.events.onInputUp.addOnce(function () {
                    this.OnBattleScreenTap.dispatch();
                }, _this);
                _this.add(bg);
                _this.add(title);
                _this.add(_this._whiteCircle);
                _this.add(battleIcon);
                _this.add(tapToPlayText);
                //this.add(this._secondsText);
                if (!smallScreen) {
                    _this.add(visProgressBar);
                    _this.add(elProgressBar);
                    _this.add(speedProgressBar);
                    _this.add(copLevelProgressBar);
                }
                _this.add(_this._tapCatcher);
                return _this;
            }
            BattleInitScreen.prototype.createSettingProgressBar = function (yPos, text) {
                var bar = new UI.ProgressBar(this.game, this.game.width / 2, yPos, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_BAR_CUSTOM_BATTLE_SCREEN, PoliceRunners.StringConstants.AK_BATTLE_BAR_FILL, 0, 0, text, .1);
                bar.x -= bar.ProgressBarBackSprite.width / 2;
                return bar;
            };
            //Called after the photo download
            BattleInitScreen.prototype.SetCreatorPhoto = function () {
                this._creatorPhotoLoaded = true;
                //console.log("setting photo!!!!");
                this._avatarImage = this.game.add.image(this._whiteCircle.x, this._whiteCircle.y, PoliceRunners.StringConstants.SPRITE_BATTLE_CREATOR_AVATAR);
                this._avatarImage.anchor.set(0.5);
                Utils.PhaserUtils.NormalizeSprite(this._avatarImage, this._whiteCircle.width, this._whiteCircle.width);
                this._avatarImage.mask = Utils.PhaserUtils.DrawCircle(this.game, this._whiteCircle.x, this._whiteCircle.y, this._whiteCircle.width * .88, 0xffffff);
                this.add(this._avatarImage);
            };
            // public LowerCountdown() {
            //     this._secondsToStart--;
            //     this._secondsText.text = this._secondsToStart.toString();
            // }
            BattleInitScreen.prototype.DestroyScreen = function () {
                this._creatorPhotoLoaded = true;
                if (this._creatorPhotoLoaded)
                    this._avatarImage.mask.destroy();
                else
                    Utils.PhaserImageDownloader.OnFilesLoaded.removeAll(this);
                this.destroy();
            };
            return BattleInitScreen;
        }(Phaser.Group));
        UI.BattleInitScreen = BattleInitScreen;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        /**
         * There is overlay sprite shown on click - it is not using phaser way of sprite change on events
         */
        var SimpleButton = /** @class */ (function (_super) {
            __extends(SimpleButton, _super);
            function SimpleButton(game, xPos, yPos, atlasKey, buttonSprite, buttonTintSprite, onClickCallback, callbackContext, additionalInfo, xTintAnchor, yTintAnchor, additionaltext) {
                var _this = _super.call(this, game) || this;
                //button behaviour
                _this._button = new Phaser.Button(game, xPos, yPos, atlasKey, undefined, undefined, buttonSprite, buttonSprite);
                _this._button.anchor.set(0.5);
                _this._tintSprite = _this.game.add.image(xPos, yPos, atlasKey, buttonTintSprite);
                _this._tintSprite.anchor.set(xTintAnchor == null ? 0.5 : xTintAnchor, yTintAnchor == null ? 0.6 : yTintAnchor);
                _this._tintSprite.visible = false;
                _this._button.events.onInputDown.add(_this.manageButtonDownClick, _this);
                _this._button.events.onInputUp.add(_this.manageButtonUpClick, _this);
                if (onClickCallback != null)
                    _this._button.events.onInputUp.add(onClickCallback, callbackContext, 0, UI.eMenuPart.GARAGE);
                _this._button.input.priorityID = 2;
                if (additionalInfo) {
                    //additionalInfo.anchor.set(0.5);
                    additionalInfo.x = _this._button.left + _this._button.width * .33;
                    additionalInfo.y = _this._button.y - _this._button.height * .1;
                }
                if (additionaltext) {
                    _this._additionalText = _this.game.add.bitmapText(_this._button.x, _this._button.y, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, additionaltext, 28);
                    _this._additionalText.anchor.set(0.5, 0.6);
                }
                _this.add(_this._button);
                if (_this._additionalText)
                    _this.add(_this._additionalText);
                if (additionalInfo)
                    _this.add(additionalInfo);
                _this.add(_this._tintSprite);
                return _this;
            }
            Object.defineProperty(SimpleButton.prototype, "X", {
                get: function () {
                    return this._button.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SimpleButton.prototype, "Y", {
                get: function () {
                    return this._button.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SimpleButton.prototype, "Width", {
                get: function () {
                    return this._button.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SimpleButton.prototype, "Height", {
                get: function () {
                    return this._button.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SimpleButton.prototype, "Button", {
                get: function () {
                    return this._button;
                },
                enumerable: true,
                configurable: true
            });
            SimpleButton.prototype.manageButtonDownClick = function () {
                this._tintSprite.visible = true;
            };
            SimpleButton.prototype.manageButtonUpClick = function () {
                this._tintSprite.visible = false;
            };
            SimpleButton.prototype.RemoveCallbacks = function () {
                this._button.onInputDown.removeAll();
                this._button.onInputUp.removeAll();
            };
            return SimpleButton;
        }(Phaser.Group));
        UI.SimpleButton = SimpleButton;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
/// <reference path="SimpleButton.ts"/>
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var BoosterButton = /** @class */ (function (_super) {
            __extends(BoosterButton, _super);
            function BoosterButton(game, xPos, yPos, atlasKey, buttonSprite, buttonTintSprite, 
            /*onClickCallback: Function, callbackContext: any, */ boosterType, additionalInfo, xTintAnchor, yTintAnchor) {
                var _this = _super.call(this, game, xPos, yPos, atlasKey, buttonSprite, buttonTintSprite, null, null, additionalInfo, xTintAnchor, yTintAnchor) || this;
                _this._price = 10;
                _this._button.events.onInputUp.add(_this.onButtonClick, _this, 0, UI.eMenuPart.GARAGE);
                _this._boosterType = boosterType;
                var priceText = _this.game.add.bitmapText(_this._button.left + _this._button.width * .5, _this._button.bottom - _this._button.height * .19, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, _this._price.toString(), 36);
                priceText.anchor.set(1, 0.66);
                var iconImg = _this.game.add.image(_this._button.right - _this._button.width * .27, _this._button.bottom - _this._button.height * .17, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_ICON_COIN);
                iconImg.anchor.set(0.55);
                _this._buttonActivated = false;
                _this._waitingForResponse = false;
                if (Gamee.PlayerDataStorage.Instance.IsBoosterActive(_this._boosterType)) {
                    var ts = Gamee.PlayerDataStorage.Instance.GetBoosterTimestamp(_this._boosterType);
                    //expired - remove
                    if (Utils.DateUtils.HasTimestampInSecondsExpired(ts, PoliceRunners.GameOptions.BOOSTER_DURATION)) {
                        Gamee.PlayerDataStorage.Instance.RemoveBooster(_this._boosterType, true);
                    }
                    else {
                        _this._timeRemaining = (ts + PoliceRunners.GameOptions.BOOSTER_DURATION) - Utils.DateUtils.GetTimestampInSeconds();
                        _this.setActivated();
                    }
                }
                _this.addAt(priceText, 1);
                _this.addAt(iconImg, 1);
                return _this;
            }
            BoosterButton.prototype.DestroyButton = function () {
                if (this._timerEvent != null) {
                    this.game.time.events.remove(this._timerEvent);
                    this._timerEvent = null;
                }
            };
            BoosterButton.prototype.onButtonClick = function () {
                if (this._buttonActivated || this._waitingForResponse)
                    return;
                //for delayed response in app
                this._waitingForResponse = true;
                // this.game.time.events.add(1000, function() {
                //     this.afterBuyCallback(true);
                // }, this);
                // return;
                //console.log("BOOSTER CLICKED: " + this._boosterType);
                //if (this._price <= Gamee.Gamee.instance.PlayerData.coins) {
                Gamee.Gamee.instance.PurchaseItemWithCoins(Utils.PhaserUtils.GenerateCoinPurchaseParams(this.game, this._price, this.getBoosterName(), PoliceRunners.StringConstants.ATLAS_MAIN_MENU, this.getBoosterIcon(), true), this.afterBuyCallback.bind(this));
                //}
                //else console.log("GAMEE: NEMAS NA TO PRACHY KAMO");
            };
            BoosterButton.prototype.setActivated = function () {
                this._buttonActivated = true;
                this._tintSprite.visible = true;
                this._button.inputEnabled = false;
                this._activatedSign = this.game.add.bitmapText(this._button.centerX, this._button.top + this._button.height * .45, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "ACTIVATED", 24);
                this._activatedSign.anchor.set(0.5);
                this._activatedSign.tint = 0xffe45b;
                this._activatedTimer = new UI.ScreenTimer(this.game, this._button.right - this._button.width * .18, this._button.top + this._button.height * .59, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, 24, UI.eTimerMode.M_S, false, 0xffe45b);
                this._activatedTimer.UpdateTime(this._timeRemaining * 1000);
                this.add(this._activatedSign);
                this.add(this._activatedTimer);
                //create timer event
                this._timerEvent = this.game.time.events.loop(Phaser.Timer.SECOND, this.onTimeUpdate, this);
            };
            BoosterButton.prototype.resetToDefault = function () {
                this._buttonActivated = false;
                this._tintSprite.visible = false;
                this._button.inputEnabled = true;
                this._activatedSign.destroy();
                this._activatedTimer.destroy();
            };
            BoosterButton.prototype.onTimeUpdate = function () {
                this._timeRemaining--;
                //console.log("UPDATE!!! time? " + this._timeRemaining);
                if (this._timeRemaining < 0) {
                    this.game.time.events.remove(this._timerEvent);
                    this._timerEvent = null;
                    Gamee.PlayerDataStorage.Instance.RemoveBooster(this._boosterType, true);
                    this.resetToDefault();
                    //TODO remove from player data
                    return;
                }
                this._activatedTimer.UpdateTime(this._timeRemaining * 1000);
            };
            BoosterButton.prototype.getBoosterName = function () {
                switch (this._boosterType) {
                    case PoliceRunners.eBoosterType.COMBO_TIME:
                        return "2X COMBO TIME BOOSTER";
                    case PoliceRunners.eBoosterType.DOUBLE_MONEY:
                        return "2X MONEY BOOSTER";
                    case PoliceRunners.eBoosterType.MYSTERY_BOXES:
                        return "3X MORE BOXES BOOSTER";
                    case PoliceRunners.eBoosterType.RAGE:
                        return "RAGE BOOSTER";
                }
            };
            BoosterButton.prototype.getBoosterIcon = function () {
                switch (this._boosterType) {
                    case PoliceRunners.eBoosterType.COMBO_TIME:
                        return PoliceRunners.StringConstants.AK_LOBBY_PURCHASEICON_COMBO;
                    case PoliceRunners.eBoosterType.DOUBLE_MONEY:
                        return PoliceRunners.StringConstants.AK_LOBBY_PURCHASEICON_MONEY;
                    case PoliceRunners.eBoosterType.MYSTERY_BOXES:
                        return PoliceRunners.StringConstants.AK_LOBBY_PURCHASEICON_MYSTERYBOX;
                    case PoliceRunners.eBoosterType.RAGE:
                        return PoliceRunners.StringConstants.AK_LOBBY_PURCHASEICON_RAGE;
                }
            };
            BoosterButton.prototype.afterBuyCallback = function (boughtSuccessfull) {
                this._waitingForResponse = false;
                if (boughtSuccessfull) {
                    //console.log("GAMEE: BOUGHT SUCCESFULLY, GETTING BOOSTER!");
                    Gamee.PlayerDataStorage.Instance.BuyBooster(this._boosterType, Utils.DateUtils.GetTimestampInSeconds(), true);
                    //Gamee.PlayerDataStorage.Instance.SavePlayerData();
                    this._timeRemaining = PoliceRunners.GameOptions.BOOSTER_DURATION;
                    this.setActivated();
                }
                //else console.log("GAMEE: BOUGHT FAILURE");
            };
            return BoosterButton;
        }(UI.SimpleButton));
        UI.BoosterButton = BoosterButton;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        /**
         * This button has "attention" sprite assigned - this sprite is revealed when needed
         * Also, there is overlay sprite shown on click - it is not using phaser way of sprite change on events
         */
        var ButtonAttention = /** @class */ (function (_super) {
            __extends(ButtonAttention, _super);
            function ButtonAttention(game, xPos, yPos, atlasKey, buttonSprite, buttonTintSprite, attentionImgSprite, onClickCallback, callbackContext, additionalText) {
                var _this = _super.call(this, game) || this;
                //button behaviour
                _this._button = new Phaser.Button(game, xPos, yPos, atlasKey, undefined, undefined, buttonSprite, buttonSprite);
                _this._button.anchor.set(0.5);
                _this._tintSprite = _this.game.add.image(xPos, yPos, atlasKey, buttonTintSprite);
                _this._tintSprite.anchor.set(0.5);
                _this._tintSprite.visible = false;
                _this._button.events.onInputDown.add(_this.manageButtonDownClick, _this);
                _this._button.events.onInputUp.add(_this.manageButtonUpClick, _this);
                _this._button.events.onInputUp.add(onClickCallback, callbackContext, 0, UI.eMenuPart.GARAGE);
                _this._button.input.priorityID = 2;
                _this._attentionSprite = _this.game.add.image(_this._button.right - _this._button.width * .03, _this._button.top + _this._button.height * .1, atlasKey, attentionImgSprite);
                _this._attentionSprite.anchor.set(0.5);
                _this.HideAttention();
                //this.AttentionPlease();
                if (additionalText) {
                    _this._additionalString = additionalText;
                    _this._additionalText = _this.game.add.bitmapText(_this._button.x, _this._button.top + _this._button.height * .66, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, additionalText, 22);
                    _this._additionalText.anchor.set(0.5);
                }
                _this.add(_this._button);
                if (_this._additionalText)
                    _this.add(_this._additionalText);
                _this.add(_this._tintSprite);
                _this.add(_this._attentionSprite);
                return _this;
            }
            ButtonAttention.prototype.AttentionPlease = function () {
                this._attentionTween = this.game.add.tween(this._attentionSprite.scale).to({ x: 1.1, y: 1.1 }, 200, Phaser.Easing.Linear.None, true, 0, -1, true);
                this._attentionSprite.visible = true;
            };
            ButtonAttention.prototype.HideAttention = function () {
                if (this._attentionTween != null)
                    this._attentionTween.stop();
                this._attentionSprite.visible = false;
            };
            ButtonAttention.prototype.UpdateButtonText = function (newText) {
                this._additionalText.text = newText;
            };
            ButtonAttention.prototype.manageButtonDownClick = function () {
                this._tintSprite.visible = true;
            };
            ButtonAttention.prototype.manageButtonUpClick = function () {
                this._tintSprite.visible = false;
            };
            return ButtonAttention;
        }(Phaser.Group));
        UI.ButtonAttention = ButtonAttention;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var ComboNum = /** @class */ (function (_super) {
            __extends(ComboNum, _super);
            function ComboNum(game, posX, posY, fontKey, size) {
                var _this = _super.call(this, game, posX, posY, fontKey, "0", size) || this;
                //small x illusion - some fonts are rendered big as default, this is here for workaround
                var smallX = game.add.bitmapText(0, 0, fontKey, "X", size);
                smallX.anchor.set(1, 0.5);
                _this.anchor.set(0, 0.5);
                _this.addChild(smallX);
                game.add.tween(_this.scale).to({ x: 1.1, y: 1.1 }, 100, Phaser.Easing.Linear.None, true, 0, -1, true);
                return _this;
            }
            ComboNum.prototype.SetComboVal = function (val) {
                //console.log("setting combo val to " + val);
                this.text = val.toString();
            };
            return ComboNum;
        }(Phaser.BitmapText));
        UI.ComboNum = ComboNum;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var DailyRaceButton = /** @class */ (function (_super) {
            __extends(DailyRaceButton, _super);
            function DailyRaceButton(game, xPos, yPos, atlasKey, buttonActiveSprite, buttonInactiveSprite, buttonTintSprite, onClickCallback, additionalInfo, xTintAnchor, yTintAnchor) {
                var _this = _super.call(this, game, xPos, yPos, atlasKey, buttonInactiveSprite, buttonTintSprite, onClickCallback, null, additionalInfo, xTintAnchor, yTintAnchor) || this;
                _this._activeSprite = buttonActiveSprite;
                _this._inactiveSprite = buttonInactiveSprite;
                if (Utils.DateUtils.HasTimestampInSecondsExpired(Gamee.PlayerDataStorage.Instance.LastDailyRace, PoliceRunners.GameOptions.DAILY_RACE_TIMEOUT)) {
                    var readyText = _this.game.add.bitmapText(_this._button.x, _this._button.top + _this._button.height * .66, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "CLICK TO PLAY!", 20);
                    readyText.anchor.set(0.5);
                    _this._button.setFrames(_this._activeSprite, _this._activeSprite, _this._activeSprite, _this._activeSprite);
                    _this._buttonActivated = true;
                    _this.addAt(readyText, 1);
                }
                else {
                    _this._nextText = _this.game.add.bitmapText(_this._button.x - _this._button.width * .13, _this._button.top + _this._button.height * .72, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, "NEXT:", 22);
                    _this._nextText.anchor.set(0.5);
                    _this._timeRemaining = (Gamee.PlayerDataStorage.Instance.LastDailyRace + PoliceRunners.GameOptions.DAILY_RACE_TIMEOUT) - Utils.DateUtils.GetTimestampInSeconds();
                    //console.log("SETTING TIME REMAINING!!! time? " + this._timeRemaining);
                    _this._activatedTimer = new UI.ScreenTimer(_this.game, _this._button.x + _this._button.width * .2, _this._nextText.y, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, 22, UI.eTimerMode.H_M);
                    _this._activatedTimer.UpdateTime(_this._timeRemaining * 1000);
                    _this._button.setFrames(_this._inactiveSprite, _this._inactiveSprite, _this._inactiveSprite, _this._inactiveSprite);
                    _this._buttonActivated = false;
                    _this.addAt(_this._nextText, 1);
                    _this.addAt(_this._activatedTimer, 2);
                    _this._timerEvent = _this.game.time.events.loop(60 * Phaser.Timer.SECOND, _this.onTimeUpdate, _this);
                }
                return _this;
            }
            Object.defineProperty(DailyRaceButton.prototype, "ButtonActivated", {
                get: function () {
                    return this._buttonActivated;
                },
                enumerable: true,
                configurable: true
            });
            DailyRaceButton.prototype.DestroyButton = function () {
                if (this._timerEvent != null) {
                    this.game.time.events.remove(this._timerEvent);
                    this._timerEvent = null;
                }
            };
            DailyRaceButton.prototype.onTimeUpdate = function () {
                this._timeRemaining -= 60;
                if (this._timeRemaining <= 0) {
                    this._nextText.destroy();
                    this._activatedTimer.destroy();
                    this.game.time.events.remove(this._timerEvent);
                    var readyText = this.game.add.bitmapText(this._button.x, this._button.top + this._button.height * .66, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "CLICK TO PLAY!", 20);
                    readyText.anchor.set(0.5);
                    this._button.setFrames(this._activeSprite, this._activeSprite, this._activeSprite, this._activeSprite);
                    this._buttonActivated = true;
                    this.addAt(readyText, 1);
                    return;
                }
                this._activatedTimer.UpdateTime(this._timeRemaining * 1000);
            };
            return DailyRaceButton;
        }(UI.SimpleButton));
        UI.DailyRaceButton = DailyRaceButton;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var DailyRaceCounter = /** @class */ (function (_super) {
            __extends(DailyRaceCounter, _super);
            function DailyRaceCounter(game, typeOfRace, goalNum) {
                var _this = _super.call(this, game) || this;
                var bg = _this.game.add.image(_this.game.width * .14, _this.game.height * .18, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, PoliceRunners.StringConstants.AK_DR_BG_SMALL);
                bg.anchor.set(0.5);
                var iconName;
                switch (typeOfRace) {
                    case PoliceRunners.DailyRaceType.COMBO_RUN:
                        iconName = PoliceRunners.StringConstants.AK_DR_ICON_COMBO;
                        break;
                    case PoliceRunners.DailyRaceType.COP_HUNT:
                        iconName = PoliceRunners.StringConstants.AK_DR_ICON_HUNT;
                        break;
                    case PoliceRunners.DailyRaceType.RACE:
                        iconName = PoliceRunners.StringConstants.AK_DR_ICON_RACE;
                        break;
                }
                var iconImg = _this.game.add.image(bg.left + bg.width * .38, bg.y, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, iconName);
                iconImg.anchor.set(typeOfRace == PoliceRunners.DailyRaceType.RACE ? 0.4 : 0.5, 0.9);
                iconImg.scale.set(0.6);
                _this._leftNum = 0;
                _this._leftNumText = _this.game.add.bitmapText(bg.left + bg.width * .65, bg.y, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, "0", 27);
                _this._leftNumText.anchor.set(1, 0.75);
                var rightNumText = _this.game.add.bitmapText(_this._leftNumText.x, bg.y, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, "/" + goalNum, 27);
                rightNumText.anchor.set(0, 0.75);
                _this.add(bg);
                _this.add(iconImg);
                _this.add(_this._leftNumText);
                _this.add(rightNumText);
                _this.alpha = 0;
                _this.fixedToCamera = true;
                _this.game.add.tween(_this).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
                return _this;
            }
            DailyRaceCounter.prototype.UpdateCounter = function (newNum, saveOnlyMaxVal) {
                if (saveOnlyMaxVal) {
                    this._leftNum = (newNum > this._leftNum ? newNum : this._leftNum);
                }
                else
                    this._leftNum = newNum;
                this._leftNumText.text = this._leftNum.toString();
            };
            return DailyRaceCounter;
        }(Phaser.Group));
        UI.DailyRaceCounter = DailyRaceCounter;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var DailyRaceHeadline = /** @class */ (function (_super) {
            __extends(DailyRaceHeadline, _super);
            function DailyRaceHeadline(game, typeOfRace, goalNum) {
                var _this = _super.call(this, game) || this;
                _this.OnHeadlineHidden = new Phaser.Signal();
                _this.TIME_OF_SHOWING = 2500;
                _this._bg = _this.game.add.image(_this.game.width / 2 - _this.game.width * .05, _this.game.height * .28, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, PoliceRunners.StringConstants.AK_DR_BG_LARGE);
                _this._bg.anchor.set(0.5);
                _this.add(_this._bg);
                _this.createHeadline(typeOfRace);
                _this.createDescription(typeOfRace, goalNum);
                _this.alpha = 0;
                _this.fixedToCamera = true;
                _this._inTween = _this.game.add.tween(_this).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
                _this._inTween.onComplete.add(_this.afterShowBehaviour, _this);
                return _this;
            }
            //called only when user click restart
            DailyRaceHeadline.prototype.DestroyTweens = function () {
                if (this._inTween != null && this._inTween.isRunning) {
                    this._inTween.stop();
                }
                if (this._outTween != null && this._outTween.isRunning) {
                    this._outTween.stop();
                }
                this.destroy();
            };
            DailyRaceHeadline.prototype.afterShowBehaviour = function () {
                this._outTween = this.game.add.tween(this).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, this.TIME_OF_SHOWING);
                this._outTween.onComplete.add(function () {
                    this.OnHeadlineHidden.dispatch();
                    this.destroy();
                }, this);
            };
            DailyRaceHeadline.prototype.createHeadline = function (typeOfRace) {
                var iconName;
                var missionName;
                switch (typeOfRace) {
                    case PoliceRunners.DailyRaceType.COMBO_RUN:
                        iconName = PoliceRunners.StringConstants.AK_DR_ICON_COMBO;
                        missionName = "COMBO RUN MISSION:";
                        break;
                    case PoliceRunners.DailyRaceType.COP_HUNT:
                        iconName = PoliceRunners.StringConstants.AK_DR_ICON_HUNT;
                        missionName = "COP HUNT MISSION:";
                        break;
                    case PoliceRunners.DailyRaceType.RACE:
                        iconName = PoliceRunners.StringConstants.AK_DR_ICON_RACE;
                        missionName = "RACE MISSION:";
                        break;
                }
                var iconImg = this.game.add.image(this._bg.left + this._bg.width * .19, this._bg.top + this._bg.height * .14, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, iconName);
                iconImg.anchor.set(typeOfRace == PoliceRunners.DailyRaceType.RACE ? 0.4 : 0.5, 0.5);
                var titleText = this.game.add.bitmapText(iconImg.right + iconImg.width * .15, iconImg.y, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, missionName, 38);
                titleText.anchor.set(0, 0.33);
                titleText.tint = 0x7cfdea;
                this.add(iconImg);
                this.add(titleText);
            };
            DailyRaceHeadline.prototype.createDescription = function (typeOfRace, goalNum) {
                var descString;
                switch (typeOfRace) {
                    case PoliceRunners.DailyRaceType.COMBO_RUN:
                        descString = "GET " + goalNum + "X COMBO LEVEL";
                        break;
                    case PoliceRunners.DailyRaceType.COP_HUNT:
                        descString = "DESTROY " + goalNum + " COP CARS";
                        break;
                    case PoliceRunners.DailyRaceType.RACE:
                        descString = "FIND " + goalNum + " CHECKPOINT CIRCLES";
                        break;
                }
                var descText = this.game.add.bitmapText(this._bg.x, this._bg.top + this._bg.height * .45, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, descString, 30);
                descText.anchor.set(0.4, 0.33);
                this.add(descText);
                if (typeOfRace != PoliceRunners.DailyRaceType.COMBO_RUN) {
                    var leftEmoji = this.game.add.image(descText.left - this._bg.width * .04, descText.y, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, typeOfRace == PoliceRunners.DailyRaceType.COP_HUNT ? PoliceRunners.StringConstants.AK_DR_EMOJI_POLICE : PoliceRunners.StringConstants.AK_DR_FOLLOW_ARROW);
                    leftEmoji.anchor.set(0.8, 0.5);
                    if (typeOfRace == PoliceRunners.DailyRaceType.RACE)
                        leftEmoji.scale.set(0.7);
                    var rightEmoji = this.game.add.image(descText.right + this._bg.width * .04, descText.y, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, typeOfRace == PoliceRunners.DailyRaceType.COP_HUNT ? PoliceRunners.StringConstants.AK_DR_EMOJI_MUSCLE : PoliceRunners.StringConstants.AK_DR_EMOJI_RACE);
                    rightEmoji.anchor.set(0.2, 0.5);
                    this.add(leftEmoji);
                    this.add(rightEmoji);
                }
            };
            return DailyRaceHeadline;
        }(Phaser.Group));
        UI.DailyRaceHeadline = DailyRaceHeadline;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        /** Animated text shown when taking ammo*/
        var FloatingScore = /** @class */ (function (_super) {
            __extends(FloatingScore, _super);
            function FloatingScore(game, xPos, yPos, fontKey, size, onCompleteCallback, callBackListenerContext, prefix) {
                var _this = _super.call(this, game, xPos, yPos, fontKey, "0", size) || this;
                _this.anchor.set(0.5);
                if (prefix)
                    _this._prefix = prefix;
                _this.ScaleTween = _this.game.add.tween(_this.scale).to({ x: 1.5, y: 1.5 }, 700, Phaser.Easing.Bounce.Out, false);
                _this.AlphaTween = _this.game.add.tween(_this).to({ alpha: 0 }, 1300, Phaser.Easing.Linear.None, false);
                if (onCompleteCallback) {
                    _this.AlphaTween.onComplete.add(onCompleteCallback, callBackListenerContext, 0, _this);
                }
                _this.KillItem();
                return _this;
            }
            FloatingScore.prototype.SetScoreText = function (num) {
                this._scoreVal = num;
                this.text = this._prefix !== "" && this._prefix !== undefined ? this._prefix + this._scoreVal : "+" + this._scoreVal.toString();
            };
            FloatingScore.prototype.SpawnScore = function (posX, posY) {
                this.scale.set(1, 1);
                this.alpha = 1;
                //this.angle = 0;
                this.reset(posX, posY);
                if (this.ScaleTween)
                    this.ScaleTween.start();
                if (this.AlphaTween)
                    this.AlphaTween.start();
                //this.PositionTween = this.game.add.tween(this).to({ y: this.y - 40 }, 700, Phaser.Easing.Linear.None, true);
            };
            FloatingScore.prototype.KillItem = function () {
                this.kill();
            };
            return FloatingScore;
        }(Phaser.BitmapText));
        UI.FloatingScore = FloatingScore;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var GarageCarItem = /** @class */ (function (_super) {
            __extends(GarageCarItem, _super);
            function GarageCarItem(game, posY, id, carName, inUse, isOwned, unlockLevel, isLocked, unlockableByVideo, price, carMaxHP, currentHP, nextLevelHP, globalMaxHP, maxCombo, isVip, isPremium, onButtonBuyCb, onButtonPremiumBuy, onButtonUpgradeCb, onVideoButtonClick) {
                var _this = _super.call(this, game) || this;
                //console.log("creating CAR!");
                _this._ID = id;
                _this._inUse = inUse;
                _this._owned = isOwned;
                _this._locked = isLocked;
                _this._currentHP = currentHP;
                _this._currentPrice = price;
                _this._maxCarHP = carMaxHP;
                _this._maxTotalHP = globalMaxHP;
                _this._nextLevelHP = nextLevelHP;
                _this._maxed = _this._nextLevelHP == null;
                _this._unlockableByVideo = unlockableByVideo;
                _this._isVip = isVip;
                _this._isPremium = isPremium;
                _this._maxCombo = maxCombo;
                _this._upgradeBtnClickCb = onButtonUpgradeCb;
                _this._buyBtnClickCb = onButtonBuyCb;
                _this._premiumBuyBtnClickCb = onButtonPremiumBuy;
                _this._bg = _this.game.add.image(_this.game.width / 2, posY, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_CAR_CARD);
                _this._bg.anchor.set(0.5, 0);
                _this._anchorPoint = _this.game.add.image(_this._bg.x, _this._bg.y + _this._bg.height / 2);
                _this._carName = _this.game.add.bitmapText(_this._bg.left + _this._bg.width * .04, _this._bg.top + _this._bg.height * .1, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, carName, 34);
                _this._carName.anchor.set(0, 0.5);
                if (_this._isVip)
                    _this._carName.tint = 0x9400d8;
                else if (_this._isPremium)
                    _this._carName.tint = 0xffe035;
                else
                    _this._carName.tint = 0x6be5ff;
                _this._carSprite = _this.game.add.image(_this._bg.left + _this._bg.width * .16, _this._bg.top + _this._bg.height * .62, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_TYPE + (id + 1));
                _this._carSprite.anchor.set(0.5);
                _this._carSprite.scale.set(0.8);
                _this._carSprite.angle = 220;
                _this._maxComboNum = _this.game.add.bitmapText(_this._bg.centerX - _this._bg.width * .2, _this._bg.bottom - _this._bg.height * .15, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "MAX COMBO ", 16);
                _this._maxComboNum.anchor.set(0, 1);
                var xLetter = _this.game.add.bitmapText(_this._maxComboNum.width, 0, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "x", 26);
                xLetter.anchor.set(0, 1);
                var comboNum = _this.game.add.bitmapText(xLetter.width * .6, 0, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, _this._maxCombo.toString(), 32);
                comboNum.anchor.set(0, 0.98);
                xLetter.addChild(comboNum);
                _this._maxComboNum.addChild(xLetter);
                _this._HPprogressBar = new UI.RoundedProgressBar(_this.game, _this._bg.left + _this._bg.width * .71, _this._bg.top + _this._bg.height * .15, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_HP_BAR_BG, PoliceRunners.StringConstants.AK_LOBBY_HPFILLBAR_LEFT, PoliceRunners.StringConstants.AK_LOBBY_HPFILLBAR_MIDDLE, PoliceRunners.StringConstants.AK_LOBBY_HPFILLBAR_RIGHT, "HP", _this._currentHP, _this._maxCarHP, _this._maxTotalHP, 1);
                var premiumBadge = null;
                var vipBadge = null;
                if (_this._isPremium) {
                    premiumBadge = _this.game.add.image(_this._carName.x, _this._carName.y + _this._carName.height, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_PREMIUM_BADGE);
                    premiumBadge.anchor.set(0, 0.5);
                }
                else if (_this._isVip) {
                    vipBadge = _this.game.add.image(_this._carName.x, _this._carName.y + _this._carName.height, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_VIP_BADGE);
                    vipBadge.anchor.set(0, 0.5);
                }
                if (!_this._locked || _this._isVip || _this._isPremium) {
                    if (_this._inUse)
                        _this.createUsedCarBg();
                    if (_this._owned)
                        _this.createUpgradeSection(false);
                    if (!_this._isPremium || (_this._isPremium && _this._owned)) {
                        _this._buyButton = new UI.StateButton(_this.game, _this._bg.right - _this._bg.width * .23, _this._bg.bottom - _this._bg.height * .19, _this._ID, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_BTN_PAY, PoliceRunners.StringConstants.AK_LOBBY_BTN_DRIVE, PoliceRunners.StringConstants.AK_LOBBY_BTN_IN_USE, PoliceRunners.StringConstants.AK_LOBBY_BUTTON_VIP, PoliceRunners.StringConstants.AK_LOBBY_BTN_INGARAGE_PRESSED, onButtonBuyCb);
                        if (!_this._owned && !_this._isVip) {
                            _this._buyButton.Price = price;
                        }
                        else if (!_this._owned && _this._isVip)
                            _this._buyButton.SetState(3);
                        else if (!inUse)
                            _this._buyButton.SetState(1);
                        else
                            _this._buyButton.SetState(2);
                    }
                    else if (_this._isPremium) {
                        _this._buyButton = new UI.SimplePaymentButton(_this.game, _this._bg.right - _this._bg.width * .23, _this._bg.bottom - _this._bg.height * .19, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_BTN_BLUE_SMALL, PoliceRunners.StringConstants.AK_FS_BTN_PRESSED_SMALL, Gamee.ePaymentType.GEMS, price, true, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_TYPE + (id + 1), _this._carName.text, onButtonPremiumBuy, _this._ID, null, 0.5, 0.5);
                    }
                }
                else {
                    _this._lockedSprite = _this.game.add.image(_this._bg.x, _this._bg.centerY, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_UI_CAR_LOCKED_CARD);
                    _this._lockedSprite.anchor.set(0.5);
                    var unlockText = void 0;
                    if (!_this._unlockableByVideo) {
                        unlockText = _this.game.add.bitmapText(-_this._lockedSprite.width * .05, 0, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "UNLOCK AT LEVEL " + (unlockLevel + 1), 22);
                        unlockText.anchor.set(0, 0.5);
                    }
                    else {
                        unlockText = _this.game.add.bitmapText(-_this._lockedSprite.width * .05, -_this._lockedSprite.height * .08, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "UNLOCK AT LEVEL " + (unlockLevel + 1) + "\nOR", 22);
                        unlockText.align = 'center';
                        unlockText.anchor.set(0, 0.5);
                        _this._videoUnlockButton = new UI.SimplePaymentButton(_this.game, _this._lockedSprite.left + _this._lockedSprite.width * .59, _this._lockedSprite.top + _this._lockedSprite.height * .69, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_BTN_BLUE_SMALL, PoliceRunners.StringConstants.AK_FS_BTN_PRESSED_SMALL, Gamee.ePaymentType.COINS, 5, false, null, null, _this._carName.text + " UNLOCK", onVideoButtonClick, _this._ID, null, 0.5, 0.5);
                    }
                    _this._lockedSprite.addChild(unlockText);
                }
                _this._visibilityOn = true;
                _this.add(_this._bg);
                _this.add(_this._anchorPoint);
                if (_this._usedCarBg)
                    _this.add(_this._usedCarBg);
                _this.add(_this._maxComboNum);
                _this.add(_this._carName);
                _this.add(_this._carSprite);
                if (premiumBadge)
                    _this.add(premiumBadge);
                if (vipBadge)
                    _this.add(vipBadge);
                if (_this._cardLine)
                    _this.add(_this._cardLine);
                if (_this._upgradeText)
                    _this.add(_this._upgradeText);
                _this.add(_this._HPprogressBar);
                if (_this._upgradeButton)
                    _this.add(_this._upgradeButton);
                if (_this._buyButton)
                    _this.add(_this._buyButton);
                if (_this._lockedSprite)
                    _this.add(_this._lockedSprite);
                if (_this._videoUnlockButton)
                    _this.add(_this._videoUnlockButton);
                return _this;
            }
            Object.defineProperty(GarageCarItem.prototype, "Bg", {
                get: function () {
                    return this._bg;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GarageCarItem.prototype, "ID", {
                get: function () {
                    return this._ID;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GarageCarItem.prototype, "InUse", {
                get: function () {
                    return this._inUse;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GarageCarItem.prototype, "Locked", {
                get: function () {
                    return this._locked;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GarageCarItem.prototype, "Owned", {
                get: function () {
                    return this._owned;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GarageCarItem.prototype, "Maxed", {
                get: function () {
                    return this._maxed;
                },
                enumerable: true,
                configurable: true
            });
            GarageCarItem.prototype.BuyCar = function (upgradePrice) {
                this._owned = true;
                this._currentPrice = upgradePrice;
                this.createUpgradeSection(true);
                if (!this._isPremium)
                    this._buyButton.SetState(1);
                else {
                    //in case of premium car - destroy old SimpleBuyButton and create State button instead
                    this._buyButton.destroy();
                    this._buyButton = new UI.StateButton(this.game, this._bg.right - this._bg.width * .23, this._bg.bottom - this._bg.height * .19, this._ID, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_BTN_PAY, PoliceRunners.StringConstants.AK_LOBBY_BTN_DRIVE, PoliceRunners.StringConstants.AK_LOBBY_BTN_IN_USE, PoliceRunners.StringConstants.AK_LOBBY_BUTTON_VIP, PoliceRunners.StringConstants.AK_LOBBY_BTN_INGARAGE_PRESSED, this._buyBtnClickCb);
                    this._buyButton.SetState(1);
                    this.add(this._buyButton);
                }
            };
            GarageCarItem.prototype.UpgradeCar = function (newHP, nextLevelHP, nextLevelPrice) {
                //console.log("Upgrading car " + this._ID + ", newHP: " + newHP + ", nextLevelHP: " + nextLevelHP);
                this.UpdateHPBar(newHP, nextLevelHP);
                if (!this._maxed)
                    this._upgradeButton.Price = nextLevelPrice;
                else {
                    this._upgradeButton.setText("MAX");
                    this._upgradeButton.interactive = false;
                }
            };
            GarageCarItem.prototype.UpdateHPBar = function (newHP, nextLevelHP) {
                this._HPprogressBar.UpdateBarProgress(newHP, newHP / this._maxTotalHP);
                this._currentHP = newHP;
                this._nextLevelHP = nextLevelHP;
                if (nextLevelHP == null)
                    this._maxed = true;
                this.setUpgradeText();
            };
            //NOT UNLOCKED by video anymore... just by gamee coin
            GarageCarItem.prototype.UnlockByVideo = function () {
                this._locked = false;
                this._videoUnlockButton.destroy();
                this._lockedSprite.destroy();
                if (!this._isPremium) {
                    this._buyButton = new UI.StateButton(this.game, this._bg.right - this._bg.width * .23, this._bg.bottom - this._bg.height * .19, this._ID, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_BTN_PAY, PoliceRunners.StringConstants.AK_LOBBY_BTN_DRIVE, PoliceRunners.StringConstants.AK_LOBBY_BTN_IN_USE, PoliceRunners.StringConstants.AK_LOBBY_BUTTON_VIP, PoliceRunners.StringConstants.AK_LOBBY_BTN_INGARAGE_PRESSED, this._buyBtnClickCb);
                    this._buyButton.Price = this._currentPrice;
                }
                else {
                    this._buyButton = new UI.SimplePaymentButton(this.game, this._bg.right - this._bg.width * .23, this._bg.bottom - this._bg.height * .19, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_BTN_BLUE_SMALL, PoliceRunners.StringConstants.AK_FS_BTN_PRESSED_SMALL, Gamee.ePaymentType.GEMS, this._currentPrice, true, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_TYPE + (this._ID + 1), this._carName.text + " PURCHASE", this._premiumBuyBtnClickCb, this._ID, null, 0.5, 0.5);
                }
                this.add(this._buyButton);
            };
            //called from Update
            GarageCarItem.prototype.HandleItemShow = function () {
                if (this._visibilityOn && (this._anchorPoint.worldPosition.y < this.game.camera.y || this._anchorPoint.worldPosition.y > this.game.camera.y + this.game.height * 1.2)) {
                    this.setVisibility(false);
                    //console.log("ITEM NUM " + this._ID + " OFF!!!!");
                    return;
                }
                else if (!this._visibilityOn && (this._anchorPoint.worldPosition.y > this.game.camera.y && this._anchorPoint.worldPosition.y < this.game.camera.y + this.game.height * 1.2)) {
                    this.setVisibility(true);
                    //console.log("ITEM NUM " + this._ID + " ON!!!!");
                    return;
                }
            };
            GarageCarItem.prototype.SelectAsUsedCar = function () {
                this._inUse = true;
                if (this._usedCarBg != null) {
                    this._usedCarBg.visible = true;
                }
                else {
                    this.createUsedCarBg();
                    this.addChildAt(this._usedCarBg, 2);
                }
                this._buyButton.SetState(2);
            };
            GarageCarItem.prototype.DeselectAsUsedCar = function () {
                this._inUse = false;
                if (this._usedCarBg != null) {
                    this._usedCarBg.visible = false;
                }
                this._buyButton.SetState(1);
            };
            GarageCarItem.prototype.DestroyGarageCarItem = function () {
                if (this._upgradeButton)
                    this._upgradeButton.RemoveCallbacks();
                if (this._buyButton)
                    this._buyButton.RemoveCallbacks();
                this.destroy();
            };
            GarageCarItem.prototype.createUsedCarBg = function () {
                this._usedCarBg = this.game.add.image(this.game.width / 2, this._bg.y, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_CAR_CARD_PICKED);
                this._usedCarBg.anchor.set(0.5, 0);
            };
            GarageCarItem.prototype.createUpgradeSection = function (addToGroup) {
                this._cardLine = this.game.add.image(this._bg.left + this._bg.width * .63, this._bg.centerY - this._bg.height * .04, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_CAR_CARD_GROUP_LINE);
                this._cardLine.anchor.set(0.5);
                this._upgradeText = this.game.add.bitmapText(this._cardLine.left + this._cardLine.width * .23, this._cardLine.y + this._cardLine.height * .05, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "", 20);
                this._upgradeText.align = 'center';
                this._upgradeText.tint = 0x6be5ff;
                this._upgradeText.anchor.set(0.5);
                this.setUpgradeText();
                this._upgradeButton = new UI.UpgradeButton(this.game, this._bg.right - this._bg.width * .23, this._cardLine.y, PoliceRunners.StringConstants.AK_LOBBY_BTN_PAY, PoliceRunners.StringConstants.AK_LOBBY_BTN_INGARAGE_PRESSED, this._ID, this._upgradeBtnClickCb);
                if (!this._maxed)
                    this._upgradeButton.Price = this._currentPrice;
                else
                    this._upgradeButton.setText("MAX");
                if (addToGroup) {
                    this.add(this._cardLine);
                    this.add(this._upgradeText);
                    this.add(this._upgradeButton);
                }
            };
            GarageCarItem.prototype.setUpgradeText = function () {
                if (this._maxed) {
                    this._upgradeText.text = "MAXED OUT";
                    //this._upgradeText.visible = false;
                }
                else {
                    this._upgradeText.text = "INCREASE HP\n" + this._currentHP + ">" + this._nextLevelHP;
                }
            };
            GarageCarItem.prototype.setVisibility = function (state) {
                this._visibilityOn = state;
                if (!this._visibilityOn) {
                    this._bg.kill();
                    if (this._usedCarBg)
                        this._usedCarBg.kill();
                    this._maxComboNum.kill();
                    this._carName.kill();
                    this._carSprite.kill();
                    if (this._cardLine)
                        this._cardLine.kill();
                    if (this._upgradeText)
                        this._upgradeText.kill();
                    this._HPprogressBar.kill();
                    if (this._upgradeButton)
                        this._upgradeButton.kill();
                    if (this._buyButton)
                        this._buyButton.kill();
                    if (this._locked && this._lockedSprite)
                        this._lockedSprite.kill();
                    if (this._videoUnlockButton)
                        this._videoUnlockButton.kill();
                }
                else {
                    this._bg.revive();
                    if (this._usedCarBg) {
                        this._usedCarBg.revive();
                        this._usedCarBg.visible = this._inUse;
                    }
                    this._maxComboNum.revive();
                    this._carName.revive();
                    this._carSprite.revive();
                    if (this._cardLine)
                        this._cardLine.revive();
                    if (this._upgradeText)
                        this._upgradeText.revive();
                    this._HPprogressBar.revive();
                    if (this._upgradeButton)
                        this._upgradeButton.revive();
                    if (this._buyButton)
                        this._buyButton.revive();
                    if (this._locked && this._lockedSprite)
                        this._lockedSprite.revive();
                    if (this._videoUnlockButton)
                        this._videoUnlockButton.revive();
                }
            };
            return GarageCarItem;
        }(Phaser.Group));
        UI.GarageCarItem = GarageCarItem;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var GarageScreen = /** @class */ (function (_super) {
            __extends(GarageScreen, _super);
            function GarageScreen(game, gameSettings, menuManager) {
                var _this = _super.call(this, game) || this;
                //public static OnGarageScreenLoaded: Phaser.Signal;
                _this._allCars = [];
                _this._gameSettings = gameSettings;
                _this._menuManagerRef = menuManager;
                var startPosY = _this.game.height * .1;
                var itemHeight = 0;
                //the last param - heightAdjust - added to scrollable area for proper align of last item
                //for 15 items, it is 1.04, for 8 it was 1.08 - if we want to change the number of cars, we need to change heightAdjust as well
                _this._scroller = _this.game.add.existing(new ScrollableArea(_this.game, 0, 0, _this.game.width, _this.game.height, 1.06));
                var nextCarToUnlock = gameSettings.GetFirstLockedCar(Gamee.PlayerDataStorage.Instance.Level);
                var nextCarToUnlockID = nextCarToUnlock != null ? nextCarToUnlock.id : -666;
                for (var i = 0; i < gameSettings.PlayerCarInfos.length; i++) {
                    var carGameSettings = gameSettings.PlayerCarInfos[i];
                    var playerOwnedCar = Gamee.PlayerDataStorage.Instance.GetGivenCar(carGameSettings.id);
                    var garageCarItem = new UI.GarageCarItem(_this.game, startPosY + i * itemHeight, carGameSettings.id, carGameSettings.name, carGameSettings.id == Gamee.PlayerDataStorage.Instance.UsedCar, playerOwnedCar != null, carGameSettings.unlockLevel, (Gamee.PlayerDataStorage.Instance.Level < carGameSettings.unlockLevel) && (carGameSettings.unlockLevel > Gamee.PlayerDataStorage.Instance.LastVideoUnlockedCarLvl), 
                    /*TODO MOZNA TADY BUDE JINA PODMINKA? Gamee.Gamee.instance.VideoLoaded*/ true && carGameSettings.id === nextCarToUnlockID && Gamee.PlayerDataStorage.Instance.Level >= Gamee.PlayerDataStorage.Instance.LastVideoUnlockedCarLvl, playerOwnedCar == null ? carGameSettings.price : (playerOwnedCar.level >= carGameSettings.upgrades.length ? undefined : carGameSettings.upgrades[playerOwnedCar.level].price), carGameSettings.upgrades[carGameSettings.upgrades.length - 1].hp, playerOwnedCar == null ? carGameSettings.hpBase : (playerOwnedCar.level == 0 ? carGameSettings.hpBase : carGameSettings.upgrades[playerOwnedCar.level - 1].hp), playerOwnedCar == null ? carGameSettings.upgrades[0].hp : (playerOwnedCar.level >= carGameSettings.upgrades.length ? undefined : carGameSettings.upgrades[playerOwnedCar.level].hp), gameSettings.MaxCarHP, carGameSettings.comboMax, carGameSettings.vip == null ? false : carGameSettings.vip, carGameSettings.premium == null ? false : carGameSettings.premium, _this.onBuyButtonClick.bind(_this), _this.onPremiumCarBuyClick.bind(_this), _this.onBuyUpgradeClick.bind(_this), _this.onVideoButtonClick.bind(_this));
                    _this._allCars.push(garageCarItem);
                    _this._scroller.addChild(garageCarItem);
                    //determine height after first created item
                    if (i == 0)
                        itemHeight = garageCarItem.Bg.height * 1.02;
                }
                _this.add(_this._scroller);
                _this.HandleGarageItemsVisibility();
                return _this;
            }
            GarageScreen.prototype.onScreenShow = function () {
                this._scroller.start();
                var usedCar = this.getCarFromArray(Gamee.PlayerDataStorage.Instance.UsedCar);
                if (usedCar.ID > 2) {
                    var scrollCoord = Math.min(usedCar.Bg.y - usedCar.Bg.height, this._allCars[this._allCars.length - 5].Bg.y);
                    this._scroller.scrollTo(0, scrollCoord, 700, false);
                }
            };
            GarageScreen.prototype.onScreenHide = function () {
                this._scroller.stop();
            };
            GarageScreen.prototype.HandleGarageItemsVisibility = function () {
                for (var i = 0, j = this._allCars.length; i < j; i++) {
                    this._allCars[i].HandleItemShow();
                }
            };
            //We are destroying the screen because of performance gain during gameplay
            GarageScreen.prototype.DestroyGarageScreen = function () {
                for (var i = 0, j = this._allCars.length; i < j; i++) {
                    this._allCars[i].DestroyGarageCarItem();
                }
                this.destroy();
            };
            GarageScreen.prototype.onBuyButtonClick = function (clickedCarID, buttonState, price) {
                //buy car
                if (buttonState == 0) {
                    var carToBuy = this.getCarFromArray(clickedCarID);
                    if (carToBuy != null) {
                        if (price <= Gamee.PlayerDataStorage.Instance.CurrencyAmount) {
                            Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_BUY);
                            var carGameSettings = this._gameSettings.PlayerCarInfos.find(function (item) { return item.id === clickedCarID; });
                            if (carGameSettings == null)
                                return;
                            Gamee.PlayerDataStorage.Instance.AddToOwnedCars(clickedCarID, false);
                            carToBuy.BuyCar(carGameSettings.upgrades[0].price);
                            Gamee.PlayerDataStorage.Instance.SetCurrencyAmount(Gamee.PlayerDataStorage.Instance.CurrencyAmount - price, false);
                            this._menuManagerRef.UpdateGarageButtonText();
                            //select
                            var previouslySelected = this.getCarFromArray(Gamee.PlayerDataStorage.Instance.UsedCar);
                            previouslySelected.DeselectAsUsedCar();
                            carToBuy.SelectAsUsedCar();
                            Gamee.PlayerDataStorage.Instance.SetUsedCar(clickedCarID, true);
                            this._menuManagerRef.CreateCurrentCarItem();
                            if (App.Global.LOG_EVENTS)
                                Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_CAR_BOUGHT, clickedCarID.toString());
                        }
                    }
                }
                //car select
                else if (buttonState == 1) {
                    var newlySelected = this.getCarFromArray(clickedCarID);
                    Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_SELECT);
                    if (newlySelected != null) {
                        var previouslySelected = this.getCarFromArray(Gamee.PlayerDataStorage.Instance.UsedCar);
                        previouslySelected.DeselectAsUsedCar();
                        newlySelected.SelectAsUsedCar();
                        Gamee.PlayerDataStorage.Instance.SetUsedCar(clickedCarID, true);
                        this._menuManagerRef.CreateCurrentCarItem();
                        this._menuManagerRef.SwitchScreen(null, null, null, UI.eMenuPart.LOBBY);
                        if (App.Global.LOG_EVENTS)
                            Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_CAR_SELECTED, clickedCarID.toString());
                    }
                }
                //vip
                else if (buttonState == 3) {
                    Gamee.Gamee.instance.ShowSubscribeDialog(function (vipBought) {
                        if (vipBought)
                            this.onPremiumCarBuyClick(true, clickedCarID);
                    }.bind(this));
                }
            };
            GarageScreen.prototype.onPremiumCarBuyClick = function (success, clickedCarID) {
                if (!success)
                    return;
                var carToBuy = this.getCarFromArray(clickedCarID);
                if (carToBuy != null) {
                    Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_BUY);
                    var carGameSettings = this._gameSettings.PlayerCarInfos.find(function (item) { return item.id === clickedCarID; });
                    if (carGameSettings == null)
                        return;
                    Gamee.PlayerDataStorage.Instance.AddToOwnedCars(clickedCarID, false);
                    carToBuy.BuyCar(carGameSettings.upgrades[0].price);
                    //Gamee.PlayerDataStorage.Instance.SetCurrencyAmount(Gamee.PlayerDataStorage.Instance.CurrencyAmount-price, false);
                    this._menuManagerRef.UpdateGarageButtonText();
                    //select
                    var previouslySelected = this.getCarFromArray(Gamee.PlayerDataStorage.Instance.UsedCar);
                    previouslySelected.DeselectAsUsedCar();
                    carToBuy.SelectAsUsedCar();
                    Gamee.PlayerDataStorage.Instance.SetUsedCar(clickedCarID, true);
                    this._menuManagerRef.CreateCurrentCarItem();
                    if (App.Global.GAMEE && App.Global.LOG_EVENTS)
                        Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_PREMIUM_CAR_BOUGHT, clickedCarID.toString());
                }
            };
            GarageScreen.prototype.onBuyUpgradeClick = function (clickedCarID, price) {
                var carToUpgrade = this.getCarFromArray(clickedCarID);
                if (carToUpgrade != null && !carToUpgrade.Maxed) {
                    if (price <= Gamee.PlayerDataStorage.Instance.CurrencyAmount) {
                        Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CAR_UPGRADE);
                        var carGameSettings = this._gameSettings.PlayerCarInfos.find(function (item) { return item.id === clickedCarID; });
                        var playerOwnedCar = Gamee.PlayerDataStorage.Instance.GetGivenCar(clickedCarID);
                        if (carGameSettings == null || playerOwnedCar == null)
                            return;
                        Gamee.PlayerDataStorage.Instance.SetCurrencyAmount(Gamee.PlayerDataStorage.Instance.CurrencyAmount - price, false);
                        playerOwnedCar.level++;
                        var newHP = carGameSettings.upgrades[playerOwnedCar.level - 1].hp;
                        var nextLevelHP = playerOwnedCar.level >= carGameSettings.upgrades.length ? null : carGameSettings.upgrades[playerOwnedCar.level].hp;
                        var nextLevelPrice = playerOwnedCar.level >= carGameSettings.upgrades.length ? null : carGameSettings.upgrades[playerOwnedCar.level].price;
                        carToUpgrade.UpgradeCar(newHP, nextLevelHP, nextLevelPrice);
                        Gamee.PlayerDataStorage.Instance.SavePlayerData();
                        if (clickedCarID === Gamee.PlayerDataStorage.Instance.UsedCar)
                            this._menuManagerRef.CreateCurrentCarItem();
                        if (App.Global.LOG_EVENTS) {
                            var logJSON = {
                                carID: clickedCarID,
                                level: playerOwnedCar.level
                            };
                            Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_CAR_UPGRADED, JSON.stringify(logJSON));
                        }
                    }
                }
            };
            //this method is no longer used for video unlock - it is unlocked by gamee gems and coins
            GarageScreen.prototype.onVideoButtonClick = function (enoughMoney, clickedCarID) {
                //console.log("video watched? " + videoWatched + ", car iD? " + clickedCarID);
                if (!enoughMoney)
                    return;
                if (App.Global.GAMEE && App.Global.LOG_EVENTS)
                    Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_VIDEO_OFFER_CLICK_NEW_CAR, clickedCarID.toString());
                var carToUnlock = this.getCarFromArray(clickedCarID);
                var carGameSettings = this._gameSettings.PlayerCarInfos.find(function (item) { return item.id === clickedCarID; });
                Gamee.PlayerDataStorage.Instance.SetLastVideoUnlockedCarLvl(carGameSettings.unlockLevel, true);
                Gamee.PlayerDataStorage.Instance.SavePlayerData();
                carToUnlock.UnlockByVideo();
            };
            GarageScreen.prototype.getCarFromArray = function (carID) {
                return this._allCars.find(function (item) { return item.ID === carID; });
            };
            return GarageScreen;
        }(Phaser.Group));
        UI.GarageScreen = GarageScreen;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var InGameFriendIcon = /** @class */ (function (_super) {
            __extends(InGameFriendIcon, _super);
            function InGameFriendIcon(game) {
                var _this = _super.call(this, game, 0, 0, Base.eObjectType.UI_ICON, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_PHOTO_ARROW) || this;
                _this.anchor.set(0.5, 1);
                _this._avatarPhoto = _this.game.add.image(-_this.width * .08, -_this.height * .57);
                _this._avatarPhoto.anchor.set(0.5);
                var mask = Utils.PhaserUtils.DrawCircle(_this.game, 0, 0, _this.width * 7.7, 0xffffff);
                _this._avatarPhoto.addChild(mask);
                _this._avatarPhoto.mask = mask;
                _this.addChild(_this._avatarPhoto);
                _this.kill();
                return _this;
            }
            Object.defineProperty(InGameFriendIcon.prototype, "AssignedAvatarName", {
                get: function () {
                    return this._assignedAvatarName;
                },
                enumerable: true,
                configurable: true
            });
            InGameFriendIcon.prototype.SpawnObject = function (posX, posY) {
                //this._assignedAvatarName = null;
                _super.prototype.SpawnObject.call(this, posX, posY);
            };
            InGameFriendIcon.prototype.SetAvatarIcon = function (avatarName) {
                if (avatarName != this._avatarPhoto.key) {
                    this._assignedAvatarName = avatarName;
                    this._avatarPhoto.loadTexture(avatarName);
                    this._avatarPhoto.width = this._avatarPhoto.height = this.width * .8;
                }
            };
            InGameFriendIcon.prototype.UpdateIconPosition = function (posX, posY) {
                this.x = posX;
                this.y = posY;
            };
            return InGameFriendIcon;
        }(Base.SceneObject));
        UI.InGameFriendIcon = InGameFriendIcon;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var InGameFriendsManager = /** @class */ (function () {
            function InGameFriendsManager(game) {
                this._loadedAvatars = [];
                this._availableAvatars = [];
                this._game = game;
                this.loadAvatars();
            }
            InGameFriendsManager.prototype.loadAvatars = function () {
                var socialData = Gamee.Gamee.instance.SocialData;
                var avatarsToBeLoaded = [];
                //console.log("load 1");
                for (var i = 0; i < Gamee.Gamee.instance.SocialData.length; i++) {
                    if (socialData[i].avatar != null && this._loadedAvatars.indexOf(socialData[i].name) == -1) {
                        //console.log("load 2: " + socialData[i].name);
                        if (this._game.cache.checkImageKey(socialData[i].name)) {
                            this._loadedAvatars.push(socialData[i].name);
                        }
                        else {
                            avatarsToBeLoaded.push({
                                fileName: socialData[i].name,
                                filePath: socialData[i].avatar
                            });
                        }
                    }
                }
                if (avatarsToBeLoaded.length > 0) {
                    Utils.PhaserImageDownloader.AddFilesToQueue(this._game, avatarsToBeLoaded);
                    Utils.PhaserImageDownloader.OnImageLoaded.add(this.imageLoaded, this);
                    Utils.PhaserImageDownloader.OnFilesLoaded.add(this.loadQueueCompleted, this);
                }
                else
                    this.loadQueueCompleted();
            };
            InGameFriendsManager.prototype.imageLoaded = function (success, cacheKey) {
                //console.log("IN GAME AVATAR!!! IMAGE LOADED! success? " + success + ", cacheKey: " + cacheKey);
                if (success)
                    this._loadedAvatars.push(cacheKey);
            };
            InGameFriendsManager.prototype.loadQueueCompleted = function () {
                this._availableAvatars = this._loadedAvatars;
                //console.log("IN GAME AVATAR!!! available avatars> " + JSON.stringify(this._availableAvatars));
            };
            InGameFriendsManager.prototype.FriendsAvatarsReady = function () {
                return this._availableAvatars.length > 0;
            };
            InGameFriendsManager.prototype.GetRandomFriendAvatar = function () {
                return this._availableAvatars.splice(this._game.rnd.integerInRange(0, this._availableAvatars.length - 1), 1)[0];
            };
            InGameFriendsManager.prototype.ReturnAvatarToArray = function (avatarName) {
                this._availableAvatars.push(avatarName);
            };
            InGameFriendsManager.prototype.ResetFriendsManager = function () {
                this.loadAvatars();
            };
            return InGameFriendsManager;
        }());
        UI.InGameFriendsManager = InGameFriendsManager;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var LevelCompletedScreen = /** @class */ (function (_super) {
            __extends(LevelCompletedScreen, _super);
            function LevelCompletedScreen(game, fillBarTexture, fillBarPosition) {
                var _this = _super.call(this, game) || this;
                _this.TIME_TO_SHOW = 4500;
                _this.OnAnimationOver = new Phaser.Signal();
                _this._overlayBg = Utils.PhaserUtils.DrawRectangle(_this.game, 0, 0, _this.game.width, _this.game.height, 0x000000, 0.4);
                _this._fillbarImage = _this.game.add.image(fillBarPosition.x, fillBarPosition.y, fillBarTexture);
                _this._fillbarImage.anchor.set(0.5, 1);
                _this.game.add.tween(_this._fillbarImage.scale).to({ x: 1.05, y: 1.05 }, 150, Phaser.Easing.Linear.None, true, 0, -1, true);
                var textBg = _this.game.add.image(_this.game.width / 2, _this.game.height * .42, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_LC_BG);
                textBg.anchor.set(0.5);
                textBg.scale.set(0, 1);
                _this._levelText = _this.game.add.image(_this.game.width / 2, textBg.top + textBg.height * .35, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_LC_LEVEL_TEXT);
                _this._levelText.anchor.set(0.5);
                _this._levelText.visible = false;
                _this._completedText = _this.game.add.image(_this._levelText.x + _this._levelText.width * .08, _this._levelText.y + _this._levelText.height * .6, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_LC_COMPLETED_TEXT);
                _this._completedText.anchor.set(0.5);
                _this._completedText.visible = false;
                var starCenterBig = _this.game.add.image(_this._levelText.x, _this._levelText.top - _this._levelText.height * .22, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_LC_STAR_BIG);
                starCenterBig.anchor.set(0.5);
                var starCenterLeft = _this.game.add.image(starCenterBig.x - starCenterBig.width * .9, _this._levelText.top - _this._levelText.height * .1, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_LC_STAR_BIG);
                starCenterLeft.anchor.set(0.5);
                var starCenterRight = _this.game.add.image(starCenterBig.x + starCenterBig.width * .9, _this._levelText.top - _this._levelText.height * .18, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_LC_STAR_BIG);
                starCenterRight.anchor.set(0.5);
                starCenterLeft.scale.set(0);
                starCenterBig.scale.set(0);
                starCenterRight.scale.set(0);
                var starGroupLeft = _this.game.add.image(_this._completedText.left + _this._completedText.width * .06, _this._completedText.bottom + _this._completedText.height * .27, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_LC_STARS_GROUP_2);
                starGroupLeft.anchor.set(0.5);
                starGroupLeft.scale.set(0);
                var starGroupRight = _this.game.add.image(_this._completedText.right - _this._completedText.width * .1, _this._completedText.bottom + _this._completedText.height * .08, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_LC_STARS_GROUP_1);
                starGroupRight.anchor.set(0.5);
                starGroupRight.scale.set(0);
                _this.add(_this._overlayBg);
                _this.add(textBg);
                _this.add(_this._levelText);
                _this.add(_this._completedText);
                _this.add(_this._fillbarImage);
                _this.add(starCenterBig);
                _this.add(starCenterLeft);
                _this.add(starCenterRight);
                _this.add(starGroupLeft);
                _this.add(starGroupRight);
                _this.fixedToCamera = true;
                var levelTween = _this.game.add.tween(_this._levelText).from({ x: -_this.game.width / 2 }, 600, Phaser.Easing.Bounce.Out, false, 0);
                var completedTween = _this.game.add.tween(_this._completedText).from({ x: _this.game.width * 1.5 }, 600, Phaser.Easing.Bounce.Out, false, 0);
                var centerStarTween = _this.game.add.tween(starCenterBig.scale).to({ x: 1, y: 1 }, 400, Phaser.Easing.Bounce.Out, false, 0);
                var leftStarTween = _this.game.add.tween(starCenterLeft.scale).to({ x: 0.77, y: 0.77 }, 400, Phaser.Easing.Bounce.Out, false, 0);
                var rightStarTween = _this.game.add.tween(starCenterRight.scale).to({ x: 0.77, y: 0.77 }, 400, Phaser.Easing.Bounce.Out, false, 0);
                var lGroupStarTween = _this.game.add.tween(starGroupLeft.scale).to({ x: 1, y: 1 }, 400, Phaser.Easing.Bounce.Out, false, 0);
                var rGroupStarTween = _this.game.add.tween(starGroupRight.scale).to({ x: 1, y: 1 }, 400, Phaser.Easing.Bounce.Out, false, 0);
                var alphaTween = _this.game.add.tween(_this._overlayBg).from({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
                var textBgTween = _this.game.add.tween(textBg.scale).to({ x: 1 }, 500, Phaser.Easing.Bounce.Out, false);
                alphaTween.chain(textBgTween);
                textBgTween.onComplete.add(function () {
                    this._levelText.visible = true;
                    this._completedText.visible = true;
                    levelTween.start();
                    completedTween.start();
                }, _this);
                completedTween.chain(centerStarTween);
                centerStarTween.chain(leftStarTween);
                leftStarTween.chain(rightStarTween);
                rightStarTween.onComplete.add(function () {
                    rGroupStarTween.start();
                }, _this);
                rGroupStarTween.chain(lGroupStarTween);
                _this.game.time.events.add(_this.TIME_TO_SHOW, function () {
                    this.OnAnimationOver.dispatch();
                    this.tweenOutOfScreen();
                }, _this);
                return _this;
            }
            LevelCompletedScreen.prototype.tweenOutOfScreen = function () {
                var tweenOut = this.game.add.tween(this.cameraOffset).to({
                    x: -this.game.width
                }, 1500, Phaser.Easing.Elastic.Out, true);
                tweenOut.onComplete.add(function () {
                    this.destroy();
                }, this);
            };
            return LevelCompletedScreen;
        }(Phaser.Group));
        UI.LevelCompletedScreen = LevelCompletedScreen;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var LobbyCarItem = /** @class */ (function (_super) {
            __extends(LobbyCarItem, _super);
            //private _currentLevel: number;
            function LobbyCarItem(game, posY, id, carName, carMaxHP, currentHP, globalMaxHP, maxCombo) {
                var _this = _super.call(this, game) || this;
                //console.log("creating CAR!");
                _this._ID = id;
                _this._currentHP = currentHP;
                _this._maxCarHP = carMaxHP;
                _this._maxTotalHP = globalMaxHP;
                _this._maxCombo = maxCombo;
                _this._bg = _this.game.add.image(_this.game.width / 2, posY, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_CAR_CARD);
                _this._bg.scale.set(0.94);
                _this._bg.anchor.set(0.5);
                _this._carName = _this.game.add.bitmapText(_this._bg.width * .71, _this._bg.top + _this._bg.height * .24, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, carName, 38);
                _this._carName.tint = 0x6be5ff;
                _this._carName.anchor.set(0.5);
                _this._carSprite = _this.game.add.image(_this._bg.left + _this._bg.width * .21, _this._bg.top + _this._bg.height * .5, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_TYPE + (id + 1));
                _this._carSprite.anchor.set(0.5);
                _this._carSprite.scale.set(0.9);
                _this._carSprite.angle = 34;
                var lights = game.add.image(Math.cos(_this._carSprite.rotation - 1.57079633) * _this._carSprite.height * .35 + _this._carSprite.x, Math.sin(_this._carSprite.rotation - 1.57079633) * _this._carSprite.height * .35 + _this._carSprite.y, PoliceRunners.StringConstants.ATLAS_CARS, PoliceRunners.StringConstants.AK_CAR_LIGHTS);
                lights.angle = _this._carSprite.angle;
                lights.scale.set(0.9);
                lights.anchor.set(0.5);
                var barGroup = new UI.RoundedProgressBar(_this.game, _this._carName.x, _this._carName.bottom + _this._bg.height * .1, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_HP_BAR_BG, PoliceRunners.StringConstants.AK_LOBBY_HPFILLBAR_LEFT, PoliceRunners.StringConstants.AK_LOBBY_HPFILLBAR_MIDDLE, PoliceRunners.StringConstants.AK_LOBBY_HPFILLBAR_RIGHT, "HP", _this._currentHP, _this._maxCarHP, _this._maxTotalHP, 1);
                _this._HPprogressBar = _this.game.add.image(_this._carName.x, _this._carName.bottom + _this._bg.height * .15, barGroup.generateTexture());
                barGroup.destroy();
                _this._HPprogressBar.anchor.set(0.5);
                _this._HPprogressBar.scale.set(0.85);
                _this._maxComboNum = _this.game.add.bitmapText(_this._carName.x - _this._bg.width * .04, _this._HPprogressBar.y + _this._HPprogressBar.height * 2.2, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "MAX COMBO: ", 22);
                _this._maxComboNum.anchor.set(0.5, 1);
                var xLetter = _this.game.add.bitmapText(_this._maxComboNum.width * .6, 0, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "x", 28);
                xLetter.anchor.set(0, 1);
                var comboNum = _this.game.add.bitmapText(xLetter.width * .6, 0, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, _this._maxCombo.toString(), 34);
                comboNum.anchor.set(0, 0.98);
                xLetter.addChild(comboNum);
                _this._maxComboNum.addChild(xLetter);
                _this.add(_this._bg);
                _this.add(_this._maxComboNum);
                _this.add(_this._carName);
                _this.add(lights);
                _this.add(_this._carSprite);
                _this.add(_this._HPprogressBar);
                return _this;
            }
            Object.defineProperty(LobbyCarItem.prototype, "Bg", {
                get: function () {
                    return this._bg;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LobbyCarItem.prototype, "ID", {
                get: function () {
                    return this._ID;
                },
                enumerable: true,
                configurable: true
            });
            return LobbyCarItem;
        }(Phaser.Group));
        UI.LobbyCarItem = LobbyCarItem;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var eMenuPart;
        (function (eMenuPart) {
            eMenuPart[eMenuPart["LOBBY"] = 0] = "LOBBY";
            eMenuPart[eMenuPart["GARAGE"] = 1] = "GARAGE";
            eMenuPart[eMenuPart["BATTLE"] = 2] = "BATTLE";
        })(eMenuPart = UI.eMenuPart || (UI.eMenuPart = {}));
        var MenuManager = /** @class */ (function (_super) {
            __extends(MenuManager, _super);
            function MenuManager(game, gameSettings, UIhandler, onRegRaceClickCb, onDailyRaceClickCb, onCarChangeCb) {
                var _this = _super.call(this, game) || this;
                _this._currentMoney = 350000;
                _this._alphaTweening = false;
                _this._onCarChangeCb = onCarChangeCb;
                _this._onDailyRaceClickCb = onDailyRaceClickCb;
                //console.log("KOKOKOSSSSS!!!!!!");
                _this._gameSettings = gameSettings;
                _this._UIHandler = UIhandler;
                _this._garageLoaded = false;
                _this._avatarsLoaded = false;
                _this._battleScreenLoaded = false;
                _this._alphaTweening = false;
                //bg
                // let bg: Phaser.Image = this.game.add.image(this.game.width / 2, this.game.height / 2, StringConstants.ATLAS_MAIN_MENU, StringConstants.AK_LOBBY_BG);
                // bg.width = this.game.width;
                // bg.height = this.game.height;
                // bg.anchor.set(0.5);
                //this.add(bg);
                _this.createLobbyScreen(onRegRaceClickCb);
                //TODO teoreticky se muze stat, ze Gamee.PlayerDataStorage.Instance.CurrencyAmount jeste nebude inicializovane
                _this.createCurrencyHeader(App.Global.GAMEE ? Gamee.PlayerDataStorage.Instance.CurrencyAmount : 0);
                _this.createBoostersSection();
                _this._activeMenuPart = eMenuPart.LOBBY;
                //set Avatar loading
                if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS && Gamee.Gamee.instance.SocialDataRequested) {
                    //console.log("GAMEEtest: STATE GAME, Getting socialdata stuff");
                    Gamee.GameeSocialDataManager.Instance.OnPlayerAvatarsLoaded.add(_this.onAvatarsLoaded, _this);
                    if (Gamee.Gamee.instance.LoginState == Gamee.eLoginState.LOGGED_IN) {
                        //console.log("GameeTest: STATE GAME START, PLAYER LOADED");
                        Gamee.GameeSocialDataManager.Instance.parseSocialData(Gamee.Gamee.instance.PlayerData, Gamee.Gamee.instance.SocialData);
                    }
                    else if (Gamee.Gamee.instance.LoginState == Gamee.eLoginState.WAITING_FOR_CALLBACK) {
                        //console.log("GameeTest: STATE GAME START, STILL WAITIN FOR CALLBACK");
                        //Gamee.Gamee.instance.OnSocialDataObtained.add(this._gameeFriendsManager.LoadAndReloadSocialData, this);
                        Gamee.Gamee.instance.OnSocialDataObtained.add(_this.onSocialDataReady, _this);
                    }
                }
                else
                    _this.createPlayerAvatarSection(false);
                return _this;
            }
            Object.defineProperty(MenuManager.prototype, "ActiveMenuPart", {
                get: function () {
                    return this._activeMenuPart;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuManager.prototype, "AlphaTweening", {
                get: function () {
                    return this._alphaTweening;
                },
                enumerable: true,
                configurable: true
            });
            //destroy garage screen
            MenuManager.prototype.DestroyMenu = function () {
                if (this._garageLoaded) {
                    this.GarageScreen.DestroyGarageScreen();
                    this._garageLoaded = false;
                }
                if (this._battleScreenLoaded)
                    this._battleScreen.destroy();
                Gamee.PlayerDataStorage.Instance.OnCurrencyChanged.remove(this.changeCurrency, this);
                if (App.Global.GAMEE) {
                    Gamee.GameeSocialDataManager.Instance.OnPlayerAvatarsLoaded.removeAll();
                    if (Gamee.Gamee.instance.OnSocialDataObtained != null)
                        Gamee.Gamee.instance.OnSocialDataObtained.removeAll();
                }
                for (var i = 0; i < this._boosterButtons.length; i++) {
                    this._boosterButtons[i].DestroyButton();
                }
                this._dailyRaceButton.DestroyButton();
                if (this._playerAvatar)
                    this._playerAvatar.mask.destroy();
                this._shadowTextTween.stop();
                this._mainTextTween.stop();
                //this._menuHeader.getBottom().mask.destroy();
                this._menuHeader.destroy();
                this._lobbyScreen.destroy();
                this.destroy();
            };
            MenuManager.prototype.UpdateGarageButtonText = function () {
                this._garageButton.UpdateButtonText(this.createCarsNumText());
            };
            //fullVIPBought param - true = full VIP bought, false = only battle creator purchased
            MenuManager.prototype.OnVipOfferAction = function (fullVIPBought) {
                //remove VIP badge
                this._battleScreenLoaded = false;
                this._battleScreen.destroy();
                this._battleButton.Button.removeChildAt(0);
                if (fullVIPBought) {
                    this._UIHandler.ShowVIPThankWindow();
                }
            };
            //TODO add onDailyRaceClickCb
            MenuManager.prototype.createLobbyScreen = function (onRegRaceClickCb) {
                this._lobbyScreen = this.game.add.group();
                //console.log("menuManager.ts: LOBBY!!!");
                //leaderboards
                this.createTopDriversSign();
                this.createNoFriendsText();
                this.createStartTapArea(onRegRaceClickCb);
                //this.createTopDriversLeaderboards();
                //this.createNoFriendsText();
                // this._dailyRaceButton = this.game.add.image(this.game.width * .28, this.game.height * .48, StringConstants.ATLAS_MAIN_MENU, StringConstants.AK_LOBBY_BTN_DAILY_RACE_COMING_SOON);
                // this._dailyRaceButton.anchor.set(0.5, 0.42);
                // this._dailyRaceButton = new ButtonAttention(this.game, this.game.width * .28, this.game.height * .685, StringConstants.ATLAS_MAIN_MENU, StringConstants.AK_LOBBY_BTN_DAILY_RACE_READY, StringConstants.AK_LOBBY_BTN_RACE_COUNTING,
                //     StringConstants.AK_LOBBY_BTN_PRESSED_BIG, StringConstants.AK_LOBBY_EXCLAMATION, onDailyRaceClickCb, this, "NEXT: TODO");
                this._dailyRaceButton = new UI.DailyRaceButton(this.game, this.game.width * .28, this.game.height * .685, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_BTN_DAILY_RACE_READY, PoliceRunners.StringConstants.AK_LOBBY_BTN_RACE_COUNTING, PoliceRunners.StringConstants.AK_LOBBY_BTN_PRESSED_BIG, this.onDailyraceButtonClick.bind(this), null, 0.5, 0.46);
                this._garageButton = new UI.ButtonAttention(this.game, this.game.width * .72, this.game.height * .685, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_BTN_GARAGE, PoliceRunners.StringConstants.AK_LOBBY_BTN_PRESSED_BIG, PoliceRunners.StringConstants.AK_LOBBY_EXCLAMATION, this.SwitchScreen, this, this.createCarsNumText());
                this._lobbyScreen.add(this._dailyRaceButton);
                this._lobbyScreen.add(this._garageButton);
                if (Gamee.PlayerDataStorage.Instance.NewCarsUnlocked)
                    this._garageButton.AttentionPlease();
                //
                // if (App.Global.GAMEE && Gamee.Gamee.instance.Platform != Gamee.eGamePlatform.WEB && Gamee.Gamee.instance.Platform != Gamee.eGamePlatform.MOBILE_WEB) {
                //     this._battleButton = new SimpleButton(this.game, this.game.width * .83, this.game.height * .55, StringConstants.ATLAS_BATTLE, StringConstants.AK_BATTLE_BTN_MENU_CREATE, StringConstants.AK_BATTLE_BTN_MENU_CREATE_PRESSED,
                //     this.onBattleButtonClick, this, null, 0.5, 0.48);
                //     //uncomment block below to see VIP badge
                //     // if ((Gamee.Gamee.instance.MembershipType != Gamee.eMembershipType.VIP) || !Gamee.PlayerDataStorage.Instance.BattleScreenPurchased) {
                //     //     let vipBadge: Phaser.Image = this.game.add.image(0, this._battleButton.height*.22, StringConstants.ATLAS_MAIN_MENU, StringConstants.AK_LOBBY_VIP_BADGE);
                //     //     vipBadge.anchor.set(0,0.5);
                //     //     vipBadge.scale.set(1.15);
                //     //     this._battleButton.Button.addChild(vipBadge);
                //     // }
                // }
                this._lobbyScreen.add(this._dailyRaceButton);
                if (this._battleButton != null)
                    this._lobbyScreen.add(this._battleButton);
                this.add(this._lobbyScreen);
            };
            //TODO tohle musi byt jinak
            MenuManager.prototype.CreateCurrentCarItem = function () {
                // if (this._currentCarItem != null)
                //     this._currentCarItem.destroy();
                // let playerOwnedCar: Gamee.OwnedCarInfo = Gamee.PlayerDataStorage.Instance.GetGivenCar(Gamee.PlayerDataStorage.Instance.UsedCar);
                // let carGameSettings: PlayerCarInfo = this._gameSettings.PlayerCarInfos.find(item => item.id === playerOwnedCar.id);
                // this._currentCarItem = new LobbyCarItem(this.game, this.game.height * .66, playerOwnedCar.id, carGameSettings.name, carGameSettings.upgrades[carGameSettings.upgrades.length - 1].hp,
                //     playerOwnedCar.level == 0 ? carGameSettings.hpBase : carGameSettings.upgrades[playerOwnedCar.level - 1].hp, this._gameSettings.MaxCarHP, carGameSettings.comboMax);
                // this._lobbyScreen.add(this._currentCarItem);
                this._onCarChangeCb();
            };
            MenuManager.prototype.createCarsNumText = function () {
                return "CARS: " + Gamee.PlayerDataStorage.Instance.OwnedCars.length + "/" + this._gameSettings.PlayerCarInfos.length;
            };
            MenuManager.prototype.createNoFriendsText = function () {
                this._noFriendsText = this.game.add.bitmapText(this.game.camera.x + this.game.width / 2, this._topDriversBg.y + this.game.height * .1, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "NO DRIVERS FOUND!", 44);
                this._noFriendsText.anchor.set(0.5);
                this._noFriendsText.align = "center";
                this._lobbyScreen.add(this._noFriendsText);
            };
            MenuManager.prototype.createStartTapArea = function (onRegRaceClickCb) {
                //console.log("TAP TAP TAP!!!");
                var tapTextShadow = this.game.add.bitmapText(this.game.width / 2, this.game.height * .38, PoliceRunners.StringConstants.FONT_DEADJIM, "TAP TO PLAY\nAND GETAWAY", 34);
                tapTextShadow.anchor.set(0.5);
                tapTextShadow.align = "center";
                tapTextShadow.tint = 0xd1252d;
                this._shadowTextTween = this.game.add.tween(tapTextShadow).to({ x: tapTextShadow.x + tapTextShadow.width * .03, y: tapTextShadow.y + tapTextShadow.height * .05 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                this._startTapText = this.game.add.bitmapText(this.game.width / 2, this.game.height * .38, PoliceRunners.StringConstants.FONT_DEADJIM, "TAP TO PLAY\nAND GETAWAY", 34);
                this._startTapText.anchor.set(0.5);
                this._startTapText.align = "center";
                this._mainTextTween = this.game.add.tween(this._startTapText.scale).to({ x: 1.05, y: 1.05 }, 750, Phaser.Easing.Linear.None, true, 0, -1, true);
                var rectWidth = this.game.width * .9;
                this._startTapRect = Utils.PhaserUtils.DrawRectangle(this.game, this.game.width / 2 - rectWidth / 2, this.game.height * .3, rectWidth, this.game.height * .33, 0xaa5fde, 0);
                this._startTapRect.inputEnabled = true;
                this._startTapRect.events.onInputDown.add(onRegRaceClickCb, this);
                this._startTapRect.input.priorityID = 2;
                this._lobbyScreen.add(tapTextShadow);
                this._lobbyScreen.add(this._startTapText);
                this._lobbyScreen.add(this._startTapRect);
            };
            MenuManager.prototype.createTopDriversSign = function () {
                this._topDriversBg = this.game.add.image(this.game.width * .03, this.game.height * .11, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_TOP_DRIVERS_HEADLINE);
                this._topDriversBg.anchor.set(0, 0.5);
                var topDriversIcon = this.game.add.image(this._topDriversBg.x + this._topDriversBg.width * .1, this._topDriversBg.y, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_ICON_TOPDRIVERS);
                topDriversIcon.anchor.set(0.5);
                var topDriversSign = this.game.add.bitmapText(topDriversIcon.right + this._topDriversBg.width * .03, this._topDriversBg.y, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "TOP DRIVERS", 38);
                topDriversSign.anchor.set(0, 0.33);
                topDriversSign.tint = 0x7cfdea;
                this._lobbyScreen.add(this._topDriversBg);
                this._lobbyScreen.add(topDriversIcon);
                this._lobbyScreen.add(topDriversSign);
            };
            MenuManager.prototype.createTopDriversLeaderboards = function () {
                var vertSpaceBetween = this.game.height * .05;
                var maxIndex = Math.min(Gamee.Gamee.instance.SocialData.length, 3);
                for (var i = 0; i < maxIndex; i++) {
                    var friendData = Gamee.Gamee.instance.SocialData[i];
                    var player = new UI.TopPlayerItem(this.game, this.game.width * .07, this._topDriversBg.y + this._topDriversBg.height * 1.45 + i * vertSpaceBetween, i + 1, friendData.name, friendData.name, friendData.highScore, i == 0 ? 52 : 46);
                    this._lobbyScreen.add(player);
                }
            };
            MenuManager.prototype.createPlayerAvatarSection = function (withPhoto) {
                var textStart = withPhoto ? this.game.width * .15 : this.game.width * .03;
                this._levelText = this.game.add.bitmapText(textStart, this.game.height * .037, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "LVL " + (Gamee.PlayerDataStorage.Instance.Level + 1), 45);
                this._levelText.anchor.set(0, 0.42);
                this._menuHeader.add(this._levelText);
                if (withPhoto) {
                    this._playerAvatar = this.game.add.image(this.game.width * .07, this._levelText.y, Gamee.Gamee.instance.PlayerData.name);
                    this._playerAvatar.anchor.set(0.5, 0.6);
                    var expectedWidth = this.game.width * .09;
                    Utils.PhaserUtils.NormalizeSprite(this._playerAvatar, expectedWidth, expectedWidth);
                    this._playerAvatar.mask = Utils.PhaserUtils.DrawCircle(this.game, this._playerAvatar.x, this._playerAvatar.y - this._playerAvatar.height * .1, this._playerAvatar.width * .95, 0xffffff);
                    this._menuHeader.add(this._playerAvatar);
                }
            };
            MenuManager.prototype.createBoostersSection = function () {
                var boostersBg = this.game.add.image(this.game.width * .03, this.game.height * .8, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_TOP_DRIVERS_HEADLINE);
                boostersBg.anchor.set(0, 0.5);
                var boostersIcon = this.game.add.image(boostersBg.x + boostersBg.width * .1, boostersBg.y, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_ICON_UPGRADES);
                boostersIcon.anchor.set(0.5);
                var boostersSign = this.game.add.bitmapText(boostersIcon.right + boostersBg.width * .03, boostersBg.y, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "UPGRADES", 38);
                boostersSign.anchor.set(0, 0.33);
                boostersSign.tint = 0x7cfdea;
                var boosterSubtitle = this.game.add.bitmapText(boostersSign.right + boostersSign.width * .1, boostersSign.bottom, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "BOOST YOUR GAME", 22);
                boosterSubtitle.anchor.set(0, 0.8);
                this._lobbyScreen.add(boostersBg);
                this._lobbyScreen.add(boostersIcon);
                this._lobbyScreen.add(boostersSign);
                this._lobbyScreen.add(boosterSubtitle);
                //booster buttons
                this._boosterButtons = [];
                var boosterWidth = this._dailyRaceButton.width * .52;
                var startX = this.game.width / 2 - boosterWidth * 1.5;
                for (var i = 0; i < 4; i++) {
                    var btn = new UI.BoosterButton(this.game, startX + i * boosterWidth, boostersBg.y + this.game.height * .105, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, this.getCorrectBoosterBtnTextture(i), PoliceRunners.StringConstants.AK_LOBBY_BOOSTERBTN_ACTIVATED, i, null, 0.5, 0.5);
                    this._boosterButtons.push(btn);
                    this._lobbyScreen.add(btn);
                }
            };
            MenuManager.prototype.getCorrectBoosterBtnTextture = function (index) {
                switch (index) {
                    case 0:
                        return PoliceRunners.StringConstants.AK_LOBBY_BOOSTERBTN_RAGE;
                    case 1:
                        return PoliceRunners.StringConstants.AK_LOBBY_BOOSTERBTN_MONEY;
                    case 2:
                        return PoliceRunners.StringConstants.AK_LOBBY_BOOSTERBTN_MYSTERYBOX;
                    case 3:
                        return PoliceRunners.StringConstants.AK_LOBBY_BOOSTERBTN_COMBO;
                    default:
                        return null;
                }
            };
            MenuManager.prototype.createGarageScreen = function () {
                this.GarageScreen = new UI.GarageScreen(this.game, this._gameSettings, this);
                this.GarageScreen.x = this.game.width;
                this.addAt(this.GarageScreen, 2);
                this._garageLoaded = true;
                this.SwitchScreen(undefined, undefined, false, eMenuPart.GARAGE);
            };
            MenuManager.prototype.createBattleScreen = function () {
                this._battleScreen = new UI.BattleCreatorScreen(this.game, this);
                // if (Gamee.Gamee.instance.MembershipType == Gamee.eMembershipType.VIP || Gamee.PlayerDataStorage.Instance.BattleScreenPurchased) {
                //     this._battleScreen = new BattleCreatorScreen(this.game, this);
                // }
                // else {
                //     this._battleScreen = new VipOfferWindow(this.game, this);
                // }
                //this._battleScreen.visible = false;
                this._battleScreen.alpha = 0;
                this.add(this._battleScreen);
                this._battleScreenLoaded = true;
                this.SwitchScreen(undefined, undefined, false, eMenuPart.BATTLE);
            };
            MenuManager.prototype.createCurrencyHeader = function (currencyAmount) {
                this._menuHeader = this.game.add.group();
                var header = Utils.PhaserUtils.DrawRectangle(this.game, 0, 0, this.game.width, this.game.height * .065, 0x1a2b44);
                // let bg: Phaser.Image = this.game.add.image(this.game.width / 2, this.game.height / 2, StringConstants.ATLAS_MAIN_MENU, StringConstants.AK_LOBBY_BG);
                // bg.width = this.game.width;
                // bg.height = this.game.height;
                // bg.anchor.set(0.5);
                // //	A mask is a Graphics object
                // let mask = this.game.add.graphics(0, 0);
                // mask.beginFill(0xffffff);
                // mask.drawRect(0, 0, this.game.width, this.game.height * .09);
                // bg.mask = mask;
                this._currencySign = this.game.add.bitmapText(this.game.width * .95, this.game.height * .04, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, Utils.StringUtils.AddSpacesToString(currencyAmount.toString()), 45);
                this._currencySign.anchor.set(1, 0.5);
                this._currencySign.tint = 0xffcc32;
                this._garageArrowBack = this.game.add.image(this.game.width * .07, this._currencySign.y, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_ARROW_BACK);
                this._garageArrowBack.anchor.set(0.6);
                this._garageArrowBack.inputEnabled = true;
                this._garageArrowBack.input.priorityID = 2;
                this._garageArrowBack.events.onInputUp.add(this.SwitchScreen, this, 0, eMenuPart.LOBBY);
                this._garageArrowBack.visible = false;
                var currencyImg = this.game.add.image(this._currencySign.left - this._garageArrowBack.width * .1, this._currencySign.y, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_MONEY);
                currencyImg.anchor.set(1, 0.7);
                currencyImg.scale.set(1.2);
                this._menuHeader.add(header);
                this._menuHeader.add(this._garageArrowBack);
                //this._menuHeader.add(this._currencySignShadow);
                this._menuHeader.add(this._currencySign);
                this._menuHeader.add(currencyImg);
                //TODO tohle se mozna bude volat furt
                Gamee.PlayerDataStorage.Instance.OnCurrencyChanged.add(this.changeCurrency, this);
                this.add(this._menuHeader);
            };
            MenuManager.prototype.changeCurrency = function (newCurrencyVal) {
                this._currencySign.text = Utils.StringUtils.AddSpacesToString(newCurrencyVal.toString());
                //this._currencySignShadow.text = "$ " + Utils.StringUtils.AddSpacesToString(newCurrencyVal.toString());
            };
            MenuManager.prototype.SwitchScreen = function (receiver, pointer, isOver, switchTo) {
                if (this._alphaTweening)
                    return;
                //first switch to garage
                if (switchTo === eMenuPart.GARAGE && !this._garageLoaded) {
                    this.createGarageScreen();
                    return;
                }
                if (switchTo === eMenuPart.BATTLE && !this._battleScreenLoaded) {
                    this.createBattleScreen();
                    return;
                }
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_BUTTON);
                if (this._activeMenuPart === switchTo)
                    return;
                if (switchTo == eMenuPart.GARAGE) {
                    this.game.add.tween(this._lobbyScreen).to({ x: -this.game.width }, 350, Phaser.Easing.Linear.None, true);
                    this.game.add.tween(this.GarageScreen).to({ x: 0 }, 350, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                        this.GarageScreen.onScreenShow();
                        this._garageArrowBack.visible = true;
                        this.bringToTop(this._menuHeader);
                        if (this._playerAvatar)
                            this._playerAvatar.visible = false;
                        if (this._levelText)
                            this._levelText.visible = false;
                        if (this._levelTextShadow)
                            this._levelTextShadow.visible = false;
                        if (Gamee.PlayerDataStorage.Instance.NewCarsUnlocked) {
                            this._garageButton.HideAttention();
                            Gamee.PlayerDataStorage.Instance.SetNewCarsUnlocked(false, true);
                        }
                    }, this);
                }
                else if (switchTo == eMenuPart.LOBBY) {
                    if (this._activeMenuPart === eMenuPart.GARAGE) {
                        this.game.add.tween(this._lobbyScreen).to({ x: 0 }, 350, Phaser.Easing.Linear.None, true);
                        this.game.add.tween(this.GarageScreen).to({ x: this.game.width }, 350, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                            this.GarageScreen.onScreenHide();
                            this._garageArrowBack.visible = false;
                            if (this._playerAvatar)
                                this._playerAvatar.visible = true;
                            if (this._levelText)
                                this._levelText.visible = true;
                            if (this._levelTextShadow)
                                this._levelTextShadow.visible = true;
                            //videos are turned off now
                            // if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS && !Gamee.Gamee.instance.VideoLoaded)
                            //     Gamee.Gamee.instance.LoadRewardedVideo();
                        }, this);
                    }
                    else {
                        this._alphaTweening = true;
                        this._lobbyScreen.visible = true;
                        this.game.add.tween(this._lobbyScreen).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
                        this.game.add.tween(this._battleScreen).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true)
                            .onComplete.add(this.onAlphaTweeningEnd, this, 0, true);
                    }
                }
                //battle
                else {
                    this._battleScreen.visible = true;
                    this._alphaTweening = true;
                    this.game.add.tween(this._lobbyScreen).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
                    this.game.add.tween(this._battleScreen).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true)
                        .onComplete.add(this.onAlphaTweeningEnd, this, 0, false);
                }
                this._activeMenuPart = switchTo;
            };
            MenuManager.prototype.onAlphaTweeningEnd = function (targetObj, tween, lobbyScreenVisible) {
                this._alphaTweening = false;
                this._lobbyScreen.visible = lobbyScreenVisible;
                this._battleScreen.visible = !lobbyScreenVisible;
            };
            MenuManager.prototype.onBattleButtonClick = function () {
                //todo BASE64 STRING TEXTOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOWjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj
                // let imgShit = this.game.add.image(0,0, StringConstants.ATLAS_BATTLE, StringConstants.AK_BATTLE_SHARE_ICON_BG, this);
                // console.log(Utils.PhaserUtils.GetBase64ImageFromSprite(imgShit));
                // return;
                if (this._alphaTweening)
                    return;
                if (Gamee.Gamee.instance.PlayerData != null && Gamee.Gamee.instance.PlayerData.avatar != null
                    && !this.game.cache.checkImageKey(Gamee.Gamee.instance.PlayerData.name)) {
                    Utils.PhaserImageDownloader.AddFilesToQueue(this.game, [{
                            fileName: Gamee.Gamee.instance.PlayerData.name,
                            filePath: Gamee.Gamee.instance.PlayerData.avatar
                        }]);
                }
                this.SwitchScreen(null, null, false, eMenuPart.BATTLE);
            };
            MenuManager.prototype.onDailyraceButtonClick = function () {
                //console.log("Dailz race CLICKED!!! TODO");
                if (!this._dailyRaceButton.ButtonActivated)
                    return;
                this._onDailyRaceClickCb();
            };
            MenuManager.prototype.onAvatarsLoaded = function () {
                this._avatarsLoaded = true;
                if (Gamee.Gamee.instance.SocialData.length > 0) {
                    this._noFriendsText.destroy();
                    this.createTopDriversLeaderboards();
                }
                if (Gamee.Gamee.instance.PlayerData != null) {
                    this.createPlayerAvatarSection(true);
                }
                else
                    this.createPlayerAvatarSection(false);
            };
            MenuManager.prototype.onSocialDataReady = function (playerData, socialData) {
                if (Gamee.Gamee.instance.OnSocialDataObtained != null)
                    Gamee.Gamee.instance.OnSocialDataObtained.remove(this.onSocialDataReady, this);
                Gamee.GameeSocialDataManager.Instance.parseSocialData(playerData, socialData);
            };
            return MenuManager;
        }(Phaser.Group));
        UI.MenuManager = MenuManager;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var eIconType;
        (function (eIconType) {
            eIconType[eIconType["POLICE"] = 0] = "POLICE";
            eIconType[eIconType["POWERUP"] = 1] = "POWERUP";
        })(eIconType = UI.eIconType || (UI.eIconType = {}));
        ;
        var eTextPos;
        (function (eTextPos) {
            eTextPos[eTextPos["DOWN"] = 0] = "DOWN";
            eTextPos[eTextPos["UP"] = 1] = "UP";
        })(eTextPos || (eTextPos = {}));
        /** This icon is shown when important game objects are outside of camera bounds */
        var OffScreenIcon = /** @class */ (function (_super) {
            __extends(OffScreenIcon, _super);
            function OffScreenIcon(game, iconType) {
                var _this = this;
                var currentSprite;
                if (iconType == eIconType.POLICE) {
                    currentSprite = PoliceRunners.StringConstants.AK_UI_COP_POINTER;
                }
                else {
                    currentSprite = PoliceRunners.StringConstants.AK_UI_MYSTERY_BOX_POINTER;
                }
                _this = _super.call(this, game, 0, 0, Base.eObjectType.UI_ICON, PoliceRunners.StringConstants.ATLAS_UI, currentSprite) || this;
                _this._iconType = iconType;
                _this.anchor.set(0.5);
                _this._distanceText = _this.game.add.bitmapText(0, _this.height * .8, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, "100M", 18);
                _this._distanceText.anchor.set(0.5);
                _this._distTextPos = eTextPos.DOWN;
                _this.addChild(_this._distanceText);
                //console.log("oh yeah check");
                _this._halfWidth = _this.width / 2 + _this.width * .1;
                _this._halfHeight = _this.height / 2 + _this.height * .1;
                _this.kill();
                return _this;
            }
            OffScreenIcon.prototype.SpawnObject = function (posX, posY, powerUpType) {
                //console.log("loading icon with type " + powerUpType);
                if (powerUpType != null)
                    this.loadPowerUpIcon(powerUpType);
                _super.prototype.SpawnObject.call(this, posX, posY);
            };
            OffScreenIcon.prototype.UpdateIconPosition = function (assignedSprite, distance) {
                if (assignedSprite.x <= this.game.camera.x) { //left 
                    this.x = this.game.camera.x + this._halfWidth;
                }
                else if (assignedSprite.x >= this.game.camera.x + this.game.width) { //right
                    this.x = this.game.camera.x + this.game.width - this._halfWidth;
                }
                else
                    this.x = assignedSprite.x;
                //handle y coord
                if (assignedSprite.y <= this.game.camera.y) {
                    this.y = this.game.camera.y + this._halfHeight;
                }
                else if (assignedSprite.y >= this.game.camera.y + this.game.height) {
                    this.y = this.game.camera.y + this.game.camera.height - this._halfHeight;
                }
                else
                    this.y = assignedSprite.y;
                //check text position
                this._distanceText.text = distance + "M";
                if (this._distTextPos != eTextPos.UP && this.y >= this.game.camera.y + this.game.camera.height * .85) {
                    this._distanceText.y = -this.height * .8;
                    this._distTextPos = eTextPos.UP;
                }
                else if (this._distTextPos != eTextPos.DOWN && this.y < this.game.camera.y + this.game.camera.height * .85) {
                    this._distanceText.y = this.height * .8;
                    this._distTextPos = eTextPos.DOWN;
                }
            };
            OffScreenIcon.prototype.loadPowerUpIcon = function (powerUpType) {
                var frameToLoad;
                switch (powerUpType) {
                    case PoliceRunners.ePowerUpType.MONEY:
                        frameToLoad = PoliceRunners.StringConstants.AK_UI_MONEY_POINTER;
                        break;
                    case PoliceRunners.ePowerUpType.MYSTERY_BOX:
                        frameToLoad = PoliceRunners.StringConstants.AK_UI_MYSTERY_BOX_POINTER;
                        break;
                }
                if (frameToLoad != this.frameName) {
                    this.frameName = frameToLoad;
                }
            };
            return OffScreenIcon;
        }(Base.SceneObject));
        UI.OffScreenIcon = OffScreenIcon;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var PlaceHolderButton = /** @class */ (function (_super) {
            __extends(PlaceHolderButton, _super);
            function PlaceHolderButton(game, xPos, yPos, text, callback, param) {
                var _this = _super.call(this, game) || this;
                var width = _this.game.width * .7;
                var height = _this.game.height * .12;
                _this._clickableBg = game.add.graphics(0, 0);
                _this._clickableBg.beginFill(0x31c01d);
                _this._clickableBg.drawRect(xPos - width / 2, yPos - height / 2, width, height);
                _this._clickableBg.endFill();
                _this._clickableBg.inputEnabled = true;
                _this._clickableBg.events.onInputUp.add(callback, _this, 0, param);
                _this._textSign = _this.game.add.text(xPos, yPos, text, { font: 'Arial', fontSize: 35, fontStyle: 'bold' });
                _this._textSign.anchor.set(0.5);
                _this.add(_this._clickableBg);
                _this.add(_this._textSign);
                return _this;
            }
            Object.defineProperty(PlaceHolderButton.prototype, "ClickableBg", {
                get: function () {
                    return this._clickableBg;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlaceHolderButton.prototype, "TextSign", {
                get: function () {
                    return this._textSign;
                },
                enumerable: true,
                configurable: true
            });
            return PlaceHolderButton;
        }(Phaser.Group));
        UI.PlaceHolderButton = PlaceHolderButton;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var PowerUpTakenText = /** @class */ (function (_super) {
            __extends(PowerUpTakenText, _super);
            function PowerUpTakenText(game, xPos, yPos) {
                var _this = _super.call(this, game, xPos, yPos, PoliceRunners.StringConstants.FONT_POWER_UP, "MONEY", 44) || this;
                _this.TINT_NITRO = 0x57fcff;
                _this.TINT_RAGE = 0xffef28;
                _this.TINT_EXTRAHP = 0xfb0063;
                _this.TINT_MAGNET = 0x00cc8a;
                _this.TINT_SPIKES = 0xce49ff;
                _this.TINT_OIL = 0xffffff;
                _this.TINT_MONEY = 0x8be000;
                _this._isRunning = false;
                _this.anchor.set(0.5);
                //let childText = this.game.add.bitmapText(xPos + this.game.width*.1,this.bottom, StringConstants.FONT_MENU_BLACKITALIC, "+3 HP", 18);
                _this._additionalText = _this.game.add.bitmapText(0, _this.height * .22, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "+5 HP", 22);
                _this._effectFillBar = new UI.SimpleGraphicsProgressBar(_this.game, _this.width * .05, -_this.height, _this.width, _this.height * .15, 0xfb0063);
                //this.scale.y = 0;
                _this.addChild(_this._additionalText);
                _this.addChild(_this._effectFillBar);
                _this._additionalText.visible = false;
                _this.fixedToCamera = true;
                return _this;
            }
            Object.defineProperty(PowerUpTakenText.prototype, "CurrentlyShowing", {
                get: function () {
                    return this._currentlyShowing;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PowerUpTakenText.prototype, "IsRunning", {
                get: function () {
                    return this._isRunning;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PowerUpTakenText.prototype, "FillbarRunning", {
                get: function () {
                    return this._fillbarRunning;
                },
                enumerable: true,
                configurable: true
            });
            PowerUpTakenText.prototype.SetPowerUpText = function (isMoney, powerUpType) {
                if (isMoney) {
                    this.setPowerUptext("MONEY!", this.TINT_MONEY);
                    this._currentlyShowing = PoliceRunners.ePowerUpType.MONEY;
                    this.setupProgressBar(false);
                }
                else {
                    switch (powerUpType) {
                        case PoliceRunners.eActivatedPowerUpType.CARMAGEDDON:
                            this.setPowerUptext("RAGE!", this.TINT_RAGE);
                            this.setupProgressBar(true);
                            break;
                        case PoliceRunners.eActivatedPowerUpType.NITRO:
                            this.setPowerUptext("NITRO!", this.TINT_NITRO);
                            this.setupProgressBar(false);
                            break;
                        case PoliceRunners.eActivatedPowerUpType.OIL_SPILL:
                            this.setPowerUptext("OIL!", this.TINT_OIL);
                            this.setupProgressBar(false);
                            break;
                        case PoliceRunners.eActivatedPowerUpType.EXTRA_LIFE:
                            this.setPowerUptext("EXTRA HP!", this.TINT_EXTRAHP);
                            this.setupProgressBar(false);
                            break;
                        case PoliceRunners.eActivatedPowerUpType.SPIKE_STRIP:
                            this.setPowerUptext("SPIKES!", this.TINT_SPIKES);
                            this.setupProgressBar(false);
                            break;
                        case PoliceRunners.eActivatedPowerUpType.MAGNET:
                            this.setPowerUptext("MAGNET!", this.TINT_MAGNET);
                            this.setupProgressBar(false);
                            break;
                        case PoliceRunners.eActivatedPowerUpType.DOUBLE_SCORE:
                            this.setPowerUptext("2x SCORE!", this.TINT_OIL);
                            this.setupProgressBar(true);
                            break;
                        case PoliceRunners.eActivatedPowerUpType.SHIELD:
                            this.setPowerUptext("SHIELD!", this.TINT_OIL);
                            this.setupProgressBar(false);
                            break;
                    }
                    this._currentlyShowing = powerUpType;
                }
                this._additionalText.visible = false;
            };
            PowerUpTakenText.prototype.SetAdditionalText = function (isMoney, amount) {
                if (isMoney) {
                    this._additionalText.text = "+" + amount + " BUCKS";
                }
                else
                    this._additionalText.text = "+" + amount + " HP";
                this._additionalText.visible = true;
            };
            PowerUpTakenText.prototype.Show = function (timeToShow) {
                if (this._showingTimeEvent != null)
                    this.game.time.events.remove(this._showingTimeEvent);
                this.game.add.tween(this.scale).to({ y: 1 }, 150, Phaser.Easing.Bounce.Out, true);
                this._showingTimeEvent = this.game.time.events.add(timeToShow, this.hideText, this);
                this._isRunning = true;
            };
            PowerUpTakenText.prototype.UpdateBarRatio = function (ratio) {
                this._effectFillBar.UpdateBarProgress(ratio);
            };
            PowerUpTakenText.prototype.setupProgressBar = function (showProgressBar) {
                if (showProgressBar) {
                    this._effectFillBar.UpdateAppearance(this.textWidth);
                    this._effectFillBar.visible = true;
                }
                else
                    this._effectFillBar.visible = false;
                this._fillbarRunning = showProgressBar;
            };
            PowerUpTakenText.prototype.hideText = function () {
                this.game.add.tween(this.scale).to({ y: 0 }, 150, Phaser.Easing.Bounce.In, true);
                this._showingTimeEvent = null;
                if (this._fillbarRunning)
                    this._fillbarRunning = false;
                this._isRunning = false;
            };
            PowerUpTakenText.prototype.setPowerUptext = function (name, tint) {
                this.text = name;
                this.tint = tint;
                this.updateText();
            };
            return PowerUpTakenText;
        }(Phaser.BitmapText));
        UI.PowerUpTakenText = PowerUpTakenText;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var ProgressBar = /** @class */ (function (_super) {
            __extends(ProgressBar, _super);
            //This bar uses rectangular masked fill... no composition from two parts
            function ProgressBar(game, xPos, yPos, atlasImg, backImg, fillImg, xAddNum, yAddNum, overlayText, textOffset, frontImg) {
                var _this = _super.call(this, game) || this;
                _this._fullFillWidth = 0;
                _this._maskStartX = 0;
                _this._progressBack = game.add.sprite(xPos, yPos, atlasImg, backImg);
                _this._progressBack.anchor.set(0, 0.5);
                _this._progressFill = game.add.sprite(_this._progressBack.x + _this._progressBack.width * xAddNum, _this._progressBack.y - _this._progressBack.height * yAddNum, atlasImg, fillImg);
                _this._progressFill.anchor.set(0, 0.5);
                _this._rectMask = Utils.PhaserUtils.DrawRectangle(_this.game, _this._progressFill.left, _this._progressFill.top, _this._progressFill.width, _this._progressFill.height, 0xfffff);
                _this._fullFillWidth = _this._rectMask.width;
                _this._progressFill.mask = _this._rectMask;
                _this._maskStartX = _this._rectMask.x;
                var text = null;
                if (overlayText) {
                    text = _this.game.add.bitmapText(_this._progressBack.centerX, _this._progressBack.centerY - _this._progressBack.height * textOffset, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, overlayText, 20);
                    text.anchor.set(0.5);
                }
                var addImg = null;
                if (frontImg) {
                    addImg = _this.game.add.image(_this._progressBack.centerX, _this._progressBack.centerY, atlasImg, frontImg);
                    addImg.anchor.set(0.5);
                }
                //this.add(this._polygonMask);
                _this.add(_this._progressBack);
                _this.add(_this._progressFill);
                _this.add(_this._rectMask);
                if (addImg != null)
                    _this.add(addImg);
                if (text)
                    _this.add(text);
                return _this;
            }
            Object.defineProperty(ProgressBar.prototype, "ProgressBarBackSprite", {
                get: function () {
                    return this._progressBack;
                },
                enumerable: true,
                configurable: true
            });
            ProgressBar.prototype.UpdateBarProgress = function (ratio) {
                var finalPos = this._maskStartX - ((1 - ratio) * this._fullFillWidth);
                this._rectMask.x = finalPos;
            };
            return ProgressBar;
        }(Phaser.Group));
        UI.ProgressBar = ProgressBar;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var ProgressBar2 = /** @class */ (function (_super) {
            __extends(ProgressBar2, _super);
            //This bar uses just polygon masked fill... no composition from two parts
            function ProgressBar2(game, xPos, yPos, atlasImg, frontImg, fillImg, xAddNum, yAddNum, additionalImg) {
                var _this = _super.call(this, game) || this;
                _this._fullFillWidth = 0;
                _this._maskStartX = 0;
                _this._progressFront = game.add.sprite(xPos, yPos, atlasImg, frontImg);
                _this._progressFront.anchor.set(0, 0.5);
                _this._progressFill = game.add.sprite(_this._progressFront.x + _this._progressFront.width * xAddNum, _this._progressFront.y - _this._progressFront.height * yAddNum, atlasImg, fillImg);
                _this._progressFill.anchor.set(0, 0.5);
                var polygon = new Phaser.Polygon(new Phaser.Point(_this._progressFill.left, _this._progressFill.bottom), new Phaser.Point(_this._progressFill.left, _this._progressFill.top), new Phaser.Point(_this._progressFill.right + _this.game.width * .07, _this._progressFill.top), new Phaser.Point(_this._progressFill.right, _this._progressFill.bottom));
                _this._polygonMask = _this.game.add.graphics();
                _this._polygonMask.beginFill(0xffffff);
                _this._polygonMask.drawPolygon(polygon.points);
                _this._polygonMask.endFill;
                _this._fullFillWidth = _this._polygonMask.width;
                _this._progressFill.mask = _this._polygonMask;
                _this._maskStartX = _this._polygonMask.x;
                var addImg = null;
                if (additionalImg) {
                    addImg = _this.game.add.image(_this._progressFront.x + _this._progressFront.width * .14, _this._progressFront.y - _this._progressFront.height * .08, PoliceRunners.StringConstants.ATLAS_UI, additionalImg);
                    addImg.anchor.set(0.5);
                }
                //this.add(this._polygonMask);
                _this.add(_this._progressFront);
                _this.add(_this._progressFill);
                _this.add(_this._polygonMask);
                if (addImg != null)
                    _this.add(addImg);
                return _this;
            }
            Object.defineProperty(ProgressBar2.prototype, "ProgressBarFrontSprite", {
                get: function () {
                    return this._progressFront;
                },
                enumerable: true,
                configurable: true
            });
            ProgressBar2.prototype.UpdateBarProgress = function (ratio) {
                var finalPos = this._maskStartX - ((1 - ratio) * this._fullFillWidth);
                this._polygonMask.x = finalPos;
            };
            //Set number left and right for level bar
            ProgressBar2.prototype.SetLevelNumbers = function (numLeft, numRight) {
                if (this._numLeft == null) {
                    this._numLeft = this.game.add.bitmapText(this._progressFront.left + this._progressFront.width * .1, this._progressFront.y, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, numLeft.toString(), 32);
                    this._numLeft.anchor.set(0.5, 0.85);
                    this.add(this._numLeft);
                }
                else
                    this._numLeft.text = numLeft.toString();
                if (this._numRight == null) {
                    this._numRight = this.game.add.bitmapText(this._progressFront.right - this._progressFront.width * .094, this._progressFront.y, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, numRight.toString(), 32);
                    this._numRight.anchor.set(0.5, 0.85);
                    this.add(this._numRight);
                }
                else
                    this._numRight.text = numRight.toString();
            };
            ProgressBar2.prototype.StartBarScaling = function () {
                this.game.add.tween(this.scale).to({ x: 1.02, y: 1.02 }, 150, Phaser.Easing.Linear.None, true, 0, -1, true);
            };
            //NOT USED NOW
            ProgressBar2.prototype.ShowBlinkFX = function () {
                //console.log("blinking!!!!");
                // if (this._fxTween != null && this._fxTween.isRunning) {
                //     this._fxTween.stop();
                //     this._progressFx.alpha = 0;
                //     //this._fxTween.resume();
                // }
                // this._fxTween = this.game.add.tween(this._progressFx).to({alpha: 1}, 150, Phaser.Easing.Linear.None, true, 0, 5, true);
                // //else this._fxTween.start();
            };
            return ProgressBar2;
        }(Phaser.Group));
        UI.ProgressBar2 = ProgressBar2;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var ProgressBarSettable = /** @class */ (function (_super) {
            __extends(ProgressBarSettable, _super);
            function ProgressBarSettable(game, xPos, yPos, atlasImg, backImg, fillImg, xAddNum, yAddNum, leftBtnImg, rightBtnImg, adjustBtnsOverlay, frontImg, overlayText) {
                var _this = _super.call(this, game, xPos, yPos, atlasImg, backImg, fillImg, xAddNum, yAddNum, overlayText, .04, frontImg) || this;
                _this.STEP_VAL = 0.1;
                _this._currentVal = 1;
                var leftBtn = new UI.SimpleButton(_this.game, _this._progressBack.left - _this._progressBack.width * .11, _this._progressBack.y - _this._progressBack.height * .06, atlasImg, leftBtnImg, adjustBtnsOverlay, _this.onMinusClick, _this, null, 0.5, 0.52);
                var rightBtn = new UI.SimpleButton(_this.game, _this._progressBack.right + _this._progressBack.width * .11, _this._progressBack.y - _this._progressBack.height * .06, atlasImg, rightBtnImg, adjustBtnsOverlay, _this.onPlusClick, _this, null, 0.5, 0.52);
                _this._currentVal = 1;
                _this.add(leftBtn);
                _this.add(rightBtn);
                return _this;
            }
            Object.defineProperty(ProgressBarSettable.prototype, "CurrentVal", {
                get: function () {
                    return this._currentVal;
                },
                set: function (value) {
                    this._currentVal = value;
                    this.UpdateBarProgress(this._currentVal);
                },
                enumerable: true,
                configurable: true
            });
            ProgressBarSettable.prototype.onMinusClick = function () {
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_POP);
                this._currentVal = Math.max(0, this._currentVal - this.STEP_VAL);
                this.UpdateBarProgress(this._currentVal);
            };
            ProgressBarSettable.prototype.onPlusClick = function () {
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_POP);
                this._currentVal = Math.min(1, this._currentVal + this.STEP_VAL);
                this.UpdateBarProgress(this._currentVal);
            };
            return ProgressBarSettable;
        }(UI.ProgressBar));
        UI.ProgressBarSettable = ProgressBarSettable;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var RoundedProgressBar = /** @class */ (function (_super) {
            __extends(RoundedProgressBar, _super);
            //Progress bar composed from three parts (left, center, right)
            function RoundedProgressBar(game, xPos, yPos, atlasName, fillBarBg, leftImg, fillImg, imgFront, barText, currVal, localMax, globalMax, maxFillConst) {
                var _this = _super.call(this, game) || this;
                // private _text: Phaser.BitmapText;
                // public get Text(): Phaser.BitmapText {
                //     return this._text;
                // }
                _this._fullFillWidth = 0;
                _this._fullArrowWidth = 0;
                var fillBg = _this.game.add.image(xPos, yPos, atlasName, fillBarBg);
                fillBg.anchor.set(0.5);
                var fillLeft = _this.game.add.image(fillBg.left + fillBg.width * 0.005, fillBg.y, atlasName, leftImg);
                fillLeft.anchor.set(0, 0.5);
                _this._progressFill = _this.game.add.image(fillLeft.right, fillBg.y, atlasName, fillImg);
                _this._progressFill.anchor.set(0.008, 0.5);
                _this._fullFillWidth = _this._progressFill.width * maxFillConst;
                // this._progressFill.width = this._fullFillWidth;
                _this._progressFillFront = _this.game.add.image(_this._progressFill.right, _this._progressFill.y, atlasName, imgFront);
                _this._progressFillFront.anchor.set(0.04, 0.5);
                var HPtext = _this.game.add.bitmapText(_this._progressFill.left, _this._progressFill.y, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, barText, 25);
                HPtext.anchor.set(0, 0.35);
                _this._localMax = localMax;
                _this._globalMax = globalMax;
                _this._progressStat = _this.game.add.bitmapText(_this._progressFill.right, _this._progressFill.y, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, currVal + "/" + localMax, 25);
                _this._progressStat.anchor.set(1, 0.35);
                _this.UpdateBarProgress(currVal, currVal / globalMax);
                _this.add(fillBg);
                _this.add(fillLeft);
                _this.add(_this._progressFill);
                _this.add(_this._progressFillFront);
                _this.add(HPtext);
                _this.add(_this._progressStat);
                return _this;
            }
            RoundedProgressBar.prototype.UpdateBarProgress = function (actualValue, ratio) {
                this._progressFill.width = Math.min(this._fullFillWidth, ratio * this._fullFillWidth);
                if (this._progressFillFront != null) {
                    this._progressFillFront.x = this._progressFill.right;
                    if (this._progressFill.width <= this._fullArrowWidth) {
                        this._progressFillFront.scale.set(this._progressFill.width / this._fullArrowWidth, 1);
                    }
                    else {
                        this._progressFillFront.scale.set(1);
                    }
                }
                this._progressStat.text = actualValue + "/" + this._localMax;
            };
            RoundedProgressBar.prototype.ShowBlinkFX = function () {
                //console.log("blinking!!!!");
                if (this._fxTween != null && this._fxTween.isRunning) {
                    this._fxTween.stop();
                    this._progressFx.alpha = 0;
                    //this._fxTween.resume();
                }
                this._fxTween = this.game.add.tween(this._progressFx).to({ alpha: 1 }, 150, Phaser.Easing.Linear.None, true, 0, 5, true);
                //else this._fxTween.start();
            };
            return RoundedProgressBar;
        }(Phaser.Group));
        UI.RoundedProgressBar = RoundedProgressBar;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var UI;
(function (UI) {
    /** Used for generating bitmap texts */
    var ScreenTextsGenerator = /** @class */ (function () {
        //private _lastPosY: number = 0;
        function ScreenTextsGenerator(game, layer) {
            this._textShowing = false;
            this._wantedLevelRaisedText = "WANTED LEVEL\nRAISED!";
            this._tweenIdle = false;
            this._lastPosX = 0;
            this._game = game;
            this._assignedLayer = layer;
            this._wantedLevelText = this._game.add.bitmapText(this._game.width / 2, this._game.height / 2, PoliceRunners.StringConstants.FONT_UNISANS, this._wantedLevelRaisedText, 62, layer);
            this._wantedLevelText.anchor.set(0.5);
            this._wantedLevelText.align = 'center';
            this._levelTextPosDiff = new Phaser.Point(this._wantedLevelText.x - this._game.camera.x, this._wantedLevelText.y - this._game.camera.y);
            this._wantedLevelText.kill();
        }
        Object.defineProperty(ScreenTextsGenerator.prototype, "IsTextShowing", {
            get: function () {
                return this._textShowing;
            },
            enumerable: true,
            configurable: true
        });
        ScreenTextsGenerator.prototype.GenerateWantedLevelRaisedText = function () {
            this._textShowing = true;
            this._wantedLevelText.reset(this._game.camera.x + this._game.width + this._wantedLevelText.width / 2, this._game.camera.y + PoliceRunners.GameGlobalVariables.GAME_HALF_HEIGHT);
            var tweenIn = this._game.add.tween(this._wantedLevelText).to({ x: this._game.camera.x + PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH }, 700, Phaser.Easing.Elastic.Out, true);
            tweenIn.onUpdateCallback(this.tweenInUpdate, this);
            tweenIn.onComplete.add(function () {
                this._tweenIdle = true;
                this._lastPosX = this._game.camera.x;
                this._game.time.events.add(1000, this.goOffScreen, this);
            }, this);
        };
        //second part of the tween - we cannot use tween1.chain(tween2), 
        //because then on the start of tween2 the position is returned to the state of the end of tween1
        ScreenTextsGenerator.prototype.goOffScreen = function () {
            this._tweenIdle = false;
            var tweenOut = this._game.add.tween(this._wantedLevelText).to({ x: this._game.camera.x - this._game.width }, 1400, Phaser.Easing.Elastic.In, true);
            tweenOut.onComplete.add(function () {
                this._wantedLevelText.kill();
                this._textShowing = false;
            }, this);
            tweenOut.onUpdateCallback(this.tweenOutUpdate, this);
        };
        //we need to continuously update target X coords
        ScreenTextsGenerator.prototype.tweenInUpdate = function (tween, percent, tweenData) {
            tweenData.to({ x: this._game.camera.x + PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH }, 700, Phaser.Easing.Elastic.Out);
        };
        ScreenTextsGenerator.prototype.tweenOutUpdate = function (tween, percent, tweenData) {
            tweenData.to({ x: this._game.camera.x - this._game.width }, 1400, Phaser.Easing.Elastic.Out);
        };
        ScreenTextsGenerator.prototype.UpdateTextPositionToCenter = function () {
            if (this._tweenIdle) {
                this._wantedLevelText.x += (this._game.camera.x - this._lastPosX);
            }
            this._wantedLevelText.y = this._game.camera.y + this._levelTextPosDiff.y;
            this._lastPosX = this._game.camera.x;
        };
        return ScreenTextsGenerator;
    }());
    UI.ScreenTextsGenerator = ScreenTextsGenerator;
})(UI || (UI = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var eTimerMode;
        (function (eTimerMode) {
            eTimerMode[eTimerMode["M_S_MS"] = 0] = "M_S_MS";
            eTimerMode[eTimerMode["M_S"] = 1] = "M_S";
            eTimerMode[eTimerMode["H_M"] = 2] = "H_M"; // hours/minutes/seconds
        })(eTimerMode = UI.eTimerMode || (UI.eTimerMode = {}));
        var ScreenTimer = /** @class */ (function (_super) {
            __extends(ScreenTimer, _super);
            function ScreenTimer(game, xPos, yPos, fontKey, size, timerMode, showAlarmImg, tint) {
                var _this = _super.call(this, game) || this;
                _this._prevMinVal = -1;
                _this._currMinVal = -1;
                _this._prevSecsVal = -1;
                _this._currSecsVal = -1;
                _this._msecsVal = -1;
                _this._timerMode = timerMode;
                _this._fontKey = fontKey;
                _this._fontSize = size;
                _this._minValDivider = _this._timerMode == eTimerMode.H_M ? 3600000 : 60000;
                _this._secsValDivider = _this._timerMode == eTimerMode.H_M ? 60000 : 1000;
                _this._secsText = _this.game.add.bitmapText(xPos, yPos, fontKey, "00", size);
                _this._secsText.anchor.set(0.5);
                if (tint)
                    _this._secsText.tint = tint;
                var colonLeft = _this.game.add.bitmapText(_this._secsText.left - _this._secsText.width * .15, _this._secsText.y, fontKey, ":", size);
                colonLeft.anchor.set(0.5, 0.55);
                if (tint)
                    colonLeft.tint = tint;
                var colonRight;
                if (_this._timerMode == eTimerMode.M_S_MS) {
                    colonRight = _this.game.add.bitmapText(_this._secsText.right + _this._secsText.width * .18, _this._secsText.y, fontKey, ":", size);
                    colonRight.anchor.set(0.5, 0.55);
                    if (tint)
                        colonRight.tint = tint;
                }
                _this._minText = _this.game.add.bitmapText(colonLeft.left, _this._secsText.y, fontKey, "00", size);
                _this._minText.anchor.set(1.07, 0.5);
                if (tint)
                    _this._minText.tint = tint;
                if (_this._timerMode == eTimerMode.M_S_MS) {
                    _this._msecsText = _this.game.add.bitmapText(colonRight.right, _this._secsText.y, fontKey, "00", size);
                    _this._msecsText.anchor.set(0, 0.5);
                    if (tint)
                        _this._msecsText.tint = tint;
                }
                var alarmImg = null;
                if (showAlarmImg) {
                    alarmImg = _this.game.add.image(_this._minText.left, _this._secsText.y, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_TIME_ICON);
                    alarmImg.anchor.set(1.5, 0.7);
                    if (tint)
                        alarmImg.tint = tint;
                }
                _this.add(_this._secsText);
                _this.add(colonLeft);
                if (colonRight)
                    _this.add(colonRight);
                _this.add(_this._minText);
                if (_this._msecsText)
                    _this.add(_this._msecsText);
                if (alarmImg)
                    _this.add(alarmImg);
                return _this;
            }
            Object.defineProperty(ScreenTimer.prototype, "SecsText", {
                get: function () {
                    return this._secsText;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Updates the timer
             * @param totalTimeMs time to set in milliseconds
             */
            ScreenTimer.prototype.UpdateTime = function (totalTimeMs) {
                //ms - used only in M_S_MS mode
                if (this._msecsText) {
                    this._msecsVal = Math.floor(totalTimeMs % 1000);
                    this._msecsText.text = this._msecsVal.toString().substring(0, 2);
                }
                //seconds or minutes, depends on the mode
                this._currSecsVal = Math.floor((totalTimeMs / this._secsValDivider) % 60);
                if (this._currSecsVal != this._prevSecsVal) {
                    this._secsText.text = this._currSecsVal.toString().padStart(2, '0');
                    this._prevSecsVal = this._currSecsVal;
                    //minutes or hours, depends on the mode
                    this._currMinVal = Math.floor((totalTimeMs / this._minValDivider) % 60);
                    if (this._currMinVal != this._prevMinVal) {
                        this._minText.text = this._currMinVal.toString().padStart(2, '0');
                        this._prevMinVal = this._currMinVal;
                    }
                }
            };
            ScreenTimer.prototype.SetToLevelCompleted = function () {
                this.forEachAlive(function (item) {
                    item.visible = false;
                }, this);
                this._levelCompletedText = this.game.add.bitmapText(this._secsText.x, this._secsText.y, this._fontKey, "LEVEL COMPLETED!", this._fontSize - 4);
                this._levelCompletedText.anchor.set(0.53, 0.5);
                this._blinkingTween = this.game.add.tween(this._levelCompletedText).to({ alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, -1, true);
                this.add(this._levelCompletedText);
            };
            ScreenTimer.prototype.HideLevelCompletedText = function () {
                this._blinkingTween.stop();
                this.game.add.tween(this._levelCompletedText).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            };
            ScreenTimer.prototype.ResetTimer = function () {
                if (this._levelCompletedText != null) {
                    this._levelCompletedText.destroy();
                    this._levelCompletedText = null;
                    this.forEachAlive(function (item) {
                        item.visible = true;
                    }, this);
                }
                this._prevMinVal = 0;
                this._currMinVal = 0;
                this._prevSecsVal = 0;
                this._currSecsVal = 0;
                this._msecsVal = 0;
                this._msecsText.text = this._msecsVal.toString().substring(0, 2);
                this._secsText.text = this._currSecsVal.toString().padStart(2, '0');
                this._minText.text = this._currMinVal.toString().padStart(2, '0');
            };
            ScreenTimer.prototype.GetCurrentVal = function () {
                return this._minText.text + ":" + this._secsText.text + ":" + this._msecsText.text;
            };
            return ScreenTimer;
        }(Phaser.Group));
        UI.ScreenTimer = ScreenTimer;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        /**
         * Simple progress bar which is using simple graphics rectangle
         */
        var SimpleGraphicsProgressBar = /** @class */ (function (_super) {
            __extends(SimpleGraphicsProgressBar, _super);
            function SimpleGraphicsProgressBar(game, xPos, yPos, width, height, color, alpha) {
                //super(game, xPos, yPos);
                var _this = this;
                var graphicsBar = Utils.PhaserUtils.DrawRectangle(game, xPos, yPos, width, height, color, alpha);
                _this = _super.call(this, game, xPos, yPos, graphicsBar.generateTexture()) || this;
                graphicsBar.destroy();
                _this.anchor.set(0.5);
                _this._fullFillWidth = _this.width;
                return _this;
            }
            SimpleGraphicsProgressBar.prototype.UpdateAppearance = function (width) {
                this.width = width;
                this._fullFillWidth = width;
            };
            SimpleGraphicsProgressBar.prototype.UpdateBarProgress = function (ratio) {
                this.width = ratio * this._fullFillWidth;
            };
            return SimpleGraphicsProgressBar;
        }(Phaser.Sprite));
        UI.SimpleGraphicsProgressBar = SimpleGraphicsProgressBar;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var SimplePaymentButton = /** @class */ (function (_super) {
            __extends(SimplePaymentButton, _super);
            function SimplePaymentButton(game, xPos, yPos, atlasKey, buttonSprite, buttonTintSprite, paymentType, price, showPurchaseDialog, purchaseIconAtlas, purchaseIconImg, purchaseName, afterPurchaseCallback, additionalParam, additionalInfo, xTintAnchor, yTintAnchor) {
                var _this = _super.call(this, game, xPos, yPos, atlasKey, buttonSprite, buttonTintSprite, null, null, additionalInfo, xTintAnchor, yTintAnchor) || this;
                _this._afterPurchaseCallback = afterPurchaseCallback;
                _this._price = price;
                _this._paymentType = paymentType;
                _this._purchaseName = purchaseName;
                _this._purchaseIconAtlas = purchaseIconAtlas;
                _this._purchaseIconFrame = purchaseIconImg;
                _this._silentPurchase = !showPurchaseDialog;
                _this._additionalCallbackParam = additionalParam;
                _this._waitingForResponse = false;
                var iconImg = paymentType == Gamee.ePaymentType.COINS ? PoliceRunners.StringConstants.AK_LOBBY_ICON_COIN : PoliceRunners.StringConstants.AK_LOBBY_ICON_GEM;
                _this._icon = _this.game.add.image(_this._button.left + _this._button.width * .65, _this._button.y, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, iconImg);
                _this._icon.anchor.set(0.55);
                _this._priceText = _this.game.add.bitmapText(_this._icon.left - _this._icon.width * .2, _this._icon.y, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, price.toString(), 36);
                _this._priceText.anchor.set(1, 0.66);
                //console.log("1GAME? " + this.game);
                _this.addAt(_this._icon, 1);
                _this.addAt(_this._priceText, 1);
                _this._button.events.onInputUp.add(_this.onClick, _this);
                return _this;
            }
            Object.defineProperty(SimplePaymentButton.prototype, "Icon", {
                get: function () {
                    return this._icon;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SimplePaymentButton.prototype, "PriceText", {
                get: function () {
                    return this._priceText;
                },
                enumerable: true,
                configurable: true
            });
            SimplePaymentButton.prototype.onClick = function () {
                if (this._waitingForResponse)
                    return;
                this._waitingForResponse = true;
                //console.log("2GAME? " + this.game);
                // this.afterPurchase(true);
                // return;
                if (this._paymentType == Gamee.ePaymentType.COINS) {
                    Gamee.Gamee.instance.PurchaseItemWithCoins(Utils.PhaserUtils.GenerateCoinPurchaseParams(this.game, this._price, this._purchaseName, this._purchaseIconAtlas, this._purchaseIconFrame, this._silentPurchase), this.afterPurchase.bind(this));
                }
                else {
                    Gamee.Gamee.instance.PurchaseItemWithGems(Utils.PhaserUtils.GenerateGemsPurchaseParams(this.game, this._price, this._purchaseName, this._purchaseIconAtlas, this._purchaseIconFrame, this._silentPurchase), this.afterPurchase.bind(this));
                }
            };
            SimplePaymentButton.prototype.afterPurchase = function (success) {
                this._waitingForResponse = false;
                if (this._additionalCallbackParam)
                    this._afterPurchaseCallback(success, this._additionalCallbackParam);
                else
                    this._afterPurchaseCallback(success);
            };
            return SimplePaymentButton;
        }(UI.SimpleButton));
        UI.SimplePaymentButton = SimplePaymentButton;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var UI;
(function (UI) {
    var SimpleProgressBar = /** @class */ (function (_super) {
        __extends(SimpleProgressBar, _super);
        function SimpleProgressBar(game, xPos, yPos, progressBgKey, progressFillKey) {
            var _this = _super.call(this, game) || this;
            _this._fullFillWidth = 0;
            _this._progressBg = game.add.sprite(xPos, yPos, progressBgKey);
            _this._progressBg.anchor.set(0.5);
            _this._progressBg.scale.set(0.63);
            _this._progressFill = game.add.sprite(_this._progressBg.left + 2, _this._progressBg.y, progressFillKey);
            _this._progressFill.anchor.set(0, 0.5);
            _this._progressFill.scale.set(0.63);
            _this._fullFillWidth = _this._progressFill.width;
            _this.add(_this._progressBg);
            _this.add(_this._progressFill);
            _this.fixedToCamera = true;
            return _this;
        }
        SimpleProgressBar.prototype.UpdateBarProgress = function (ratio) {
            this._progressFill.width = Math.min(this._fullFillWidth - 2, ratio * (this._fullFillWidth - 2));
        };
        return SimpleProgressBar;
    }(Phaser.Group));
    UI.SimpleProgressBar = SimpleProgressBar;
})(UI || (UI = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var SimpleVideoButton = /** @class */ (function (_super) {
            __extends(SimpleVideoButton, _super);
            function SimpleVideoButton(game, xPos, yPos, atlasKey, buttonSprite, buttonTintSprite, afterVideoCallback, callbackContext, additionalCbParam, additionalInfo, xTintAnchor, yTintAnchor) {
                var _this = _super.call(this, game, xPos, yPos, atlasKey, buttonSprite, buttonTintSprite, null, null, additionalInfo, xTintAnchor, yTintAnchor) || this;
                _this._afterVideoCallback = afterVideoCallback;
                _this._additionalCallbackParam = additionalCbParam;
                _this._button.events.onInputUp.add(_this.onClick, _this);
                return _this;
            }
            SimpleVideoButton.prototype.onClick = function () {
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_POP);
                if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS)
                    Gamee.Gamee.instance.ShowRewardedVideo(this.afterVideoWatched.bind(this));
                else
                    this.afterVideoWatched(true);
            };
            SimpleVideoButton.prototype.afterVideoWatched = function (watched) {
                if (this._additionalCallbackParam)
                    this._afterVideoCallback(watched, this._additionalCallbackParam);
                else
                    this._afterVideoCallback(watched);
            };
            return SimpleVideoButton;
        }(UI.SimpleButton));
        UI.SimpleVideoButton = SimpleVideoButton;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var SimpleWindow = /** @class */ (function (_super) {
            __extends(SimpleWindow, _super);
            function SimpleWindow(game, xPos, yPos, atlasImg, mainSprite, UIlayer, closeButtonSprite) {
                var _this = _super.call(this, game) || this;
                //should be called when window is ready
                //public OnWindowOpened: Phaser.Signal = new Phaser.Signal();
                _this.OnWindowClosed = new Phaser.Signal();
                _this._game = game;
                _this._darkOverlay = Utils.PhaserUtils.DrawRectangle(_this.game, _this.game.camera.x - _this.game.width * .15, _this.game.camera.y - _this.game.height * .15, _this.game.width * 1.3, _this.game.height * 1.3, 0x000000, 0.4);
                UIlayer.add(_this._darkOverlay);
                _this._darkOverlay.inputEnabled = true;
                _this._darkOverlay.input.priorityID = 10;
                _this._darkOverlay.events.onInputDown.add(_this.onCloseClick, _this);
                _this._image = game.add.sprite(xPos, yPos, atlasImg, mainSprite);
                _this._image.anchor.setTo(0.47, 0.5);
                //this._image.scale.set(1.15);
                _this._image.inputEnabled = true;
                _this._image.input.priorityID = 11;
                _this._image.events.onInputDown.add(_this.onCloseClick, _this);
                _this.add(_this._image);
                //this.add(closeButton);
                _this.x = _this.game.width;
                _this.tweenToScreen();
                return _this;
            }
            SimpleWindow.prototype.tweenToScreen = function () {
                this._game.add.tween(this).to({
                    x: 0
                }, 1500, Phaser.Easing.Elastic.Out, true);
            };
            SimpleWindow.prototype.tweenOutOfScreen = function () {
                var tweenOut = this._game.add.tween(this).to({
                    x: -this._game.width
                }, 250, Phaser.Easing.Default, true);
                tweenOut.onComplete.add(function () {
                    this.OnWindowClosed.dispatch();
                    this._darkOverlay.destroy();
                    this.destroy();
                }, this);
            };
            SimpleWindow.prototype.onCloseClick = function () {
                this.tweenOutOfScreen();
            };
            return SimpleWindow;
        }(Phaser.Group));
        UI.SimpleWindow = SimpleWindow;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var StateButton = /** @class */ (function (_super) {
            __extends(StateButton, _super);
            /*
             * Three states: 0 - buy Button with price, 1 - drive sign, 2 - in use
             */
            function StateButton(game, xPos, yPos, carID, atlasKey, spriteStateOne, spriteStateTwo, spriteStateThree, spriteStateFour, spriteDarken, onClickCallback) {
                var _this = _super.call(this, game, xPos, yPos, atlasKey, undefined, undefined, spriteStateOne, spriteStateOne, spriteStateOne, spriteStateOne) || this;
                _this.anchor.set(0.5);
                _this.input.priorityID = 2;
                _this._stateOneSprite = spriteStateOne;
                _this._stateTwoSprite = spriteStateTwo;
                _this._stateThreeSprite = spriteStateThree;
                _this._stateFourSprite = spriteStateFour;
                _this._currentState = 0;
                _this._price = 0;
                _this._assignedCarID = carID;
                _this._btnCallback = onClickCallback;
                _this._tintSprite = _this.game.add.image(0, 0, atlasKey, spriteDarken);
                _this._tintSprite.anchor.set(0.5);
                _this._tintSprite.visible = false;
                _this._buttonText = _this.game.add.bitmapText(0, -_this.height * .12, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "DRIVE", 32);
                _this._buttonText.anchor.set(0.5);
                _this.events.onInputDown.add(_this.manageButtonDownClick, _this);
                _this.events.onInputUp.add(_this.manageButtonUpClick, _this);
                //onClickCallback = onClickCallback.bind(this);
                //let self = this;
                //this.events.onInputUp.add(onClickCallback, this, 0, this._assignedCarID, this._currentState, this.Price);
                _this.events.onInputUp.add(_this.onClick, _this);
                _this.addChild(_this._buttonText);
                _this.addChild(_this._tintSprite);
                return _this;
            }
            Object.defineProperty(StateButton.prototype, "Price", {
                get: function () {
                    return this._price;
                },
                set: function (price) {
                    //console.log("car ID " + this._assignedCarID + ", setting price to " + price);
                    this._price = price;
                    this.setPriceText();
                },
                enumerable: true,
                configurable: true
            });
            StateButton.prototype.SetState = function (stateNum) {
                if (this._currentState == stateNum)
                    return;
                this._currentState = stateNum;
                var buttonText;
                var buttonSprite;
                switch (stateNum) {
                    case 0:
                        buttonText = "$"; //needed to set Price later!
                        buttonSprite = this._stateOneSprite;
                        break;
                    case 1:
                        buttonText = "DRIVE";
                        buttonSprite = this._stateTwoSprite;
                        break;
                    case 2:
                        buttonText = "IN USE";
                        buttonSprite = this._stateThreeSprite;
                        break;
                    case 3:
                        buttonText = "VIP";
                        buttonSprite = this._stateFourSprite;
                        break;
                    default:
                        console.error("StatesButton: wrong state!");
                        return;
                }
                this.setFrames(buttonSprite, buttonSprite, buttonSprite, buttonSprite);
                this._buttonText.text = buttonText;
            };
            StateButton.prototype.RemoveCallbacks = function () {
                this.events.onInputDown.removeAll();
                this.events.onInputUp.removeAll();
            };
            StateButton.prototype.onClick = function () {
                //console.log("CAALBACK!!!!!");
                this._btnCallback(this._assignedCarID, this._currentState, this._price);
            };
            StateButton.prototype.manageButtonDownClick = function () {
                this._tintSprite.visible = true;
            };
            StateButton.prototype.manageButtonUpClick = function () {
                this._tintSprite.visible = false;
            };
            StateButton.prototype.setPriceText = function () {
                this._buttonText.text = "$" + this._price;
                // if (this._price.toString().length > 4)
                //     this._priceText.fontSize = this.TEXT_SIZE_SMALLER;
            };
            return StateButton;
        }(Phaser.Button));
        UI.StateButton = StateButton;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var TopPlayerPosChange;
        (function (TopPlayerPosChange) {
            TopPlayerPosChange[TopPlayerPosChange["UNDEFINED"] = 0] = "UNDEFINED";
            TopPlayerPosChange[TopPlayerPosChange["SAME"] = 1] = "SAME";
            TopPlayerPosChange[TopPlayerPosChange["RANK_UP"] = 2] = "RANK_UP";
            TopPlayerPosChange[TopPlayerPosChange["RANK_DOWN"] = 3] = "RANK_DOWN";
        })(TopPlayerPosChange = UI.TopPlayerPosChange || (UI.TopPlayerPosChange = {}));
        var TopPlayerItem = /** @class */ (function (_super) {
            __extends(TopPlayerItem, _super);
            /**
             * posX, posY - coords of the pivot point on the left and in the middle
             */
            function TopPlayerItem(game, posX, posY, position, playerName, playerAvatarKey, playerScore, baseFontSize) {
                var _this = _super.call(this, game) || this;
                //let bg = this.game.add.image(posX, posY, StringConstants.ATLAS_MAIN_MENU, StringConstants.AK_LOBBY_TOP_DRIVER_TAB);
                //bg.anchor.set(0,0.5);
                //let bgShadow = this.game.add.image(bg.x - bg.width*.12, bg.y + bg.height*.3, StringConstants.ATLAS_MAIN_MENU, StringConstants.AK_LOBBY_TOP_DRIVER_TAB_SHADOW);
                //bgShadow.anchor.set(0,0.5);
                _this._posNum = _this.game.add.bitmapText(posX, posY, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, position.toString() + ".", baseFontSize);
                _this._posNum.anchor.set(0, 0.4);
                _this._playerAvatar = _this.game.add.image(posX + _this.game.width * .13, posY, playerAvatarKey);
                _this._playerAvatar.anchor.set(0.5, 0.52);
                var expectedWidth = _this.game.width * .06;
                Utils.PhaserUtils.NormalizeSprite(_this._playerAvatar, expectedWidth, expectedWidth);
                _this._playerName = _this.game.add.bitmapText(_this._playerAvatar.right + expectedWidth, posY, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, Utils.StringUtils.NormalizePlayerName(playerName, 13, false), baseFontSize - 20);
                _this._playerName.anchor.set(0, 0.4);
                _this._playerScore = _this.game.add.bitmapText(_this.game.width - _this.game.width * .06, posY, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, playerScore.toString(), baseFontSize - 20);
                _this._playerScore.anchor.set(1, 0.4);
                //tint all the text
                _this._playerScore.tint = _this._playerName.tint = _this._posNum.tint = 0x6be5ff;
                //this.add(bgShadow);
                //this.add(bg);
                _this.add(_this._posNum);
                _this.add(_this._playerAvatar);
                _this.add(_this._playerName);
                // if (this._posDiffArrow != null) this.add(this._posDiffArrow);
                _this.add(_this._playerScore);
                return _this;
                // if (position != 1) {
                //     this.scale.set(scale);
                // }
            }
            return TopPlayerItem;
        }(Phaser.Group));
        UI.TopPlayerItem = TopPlayerItem;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var UIHandler = /** @class */ (function () {
            function UIHandler(game, gameSettings, uiLayer, frontLayer) {
                /** Signals for our upgrade buttons */
                this.OnStartClick = new Phaser.Signal();
                this.OnCarChange = new Phaser.Signal();
                this.DailyRaceCountdownDone = new Phaser.Signal();
                this._levelBarShown = false;
                this._tapToPlayText = null;
                this._followArrow = null;
                this._healthBar = null;
                this._comboBar = null;
                this._comboNum = null;
                this._levelBar = null;
                this._screenTimer = null;
                this._darkEdgesOverlay = null;
                this._menu = null;
                this._game = game;
                this._gameSettings = gameSettings;
                this._UILayer = uiLayer;
                //TODO uncomment when we want the floating score to be visible
                var takenScoreShowCb = this.killFloatingScoreText;
                var callbackContext = this;
                this._floatingScorePool = new Base.Pool(UI.FloatingScore, 10, function () {
                    return new UI.FloatingScore(game, 0, 0, PoliceRunners.StringConstants.FONT_UNISANS, 30, takenScoreShowCb, callbackContext);
                });
                this._offScreenIconsPolicePool = new Base.Pool(UI.OffScreenIcon, 15, function () {
                    return new UI.OffScreenIcon(this._game, UI.eIconType.POLICE);
                }.bind(this));
                Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._offScreenIconsPolicePool, uiLayer);
                this._offScreenIconsPowerUpPool = new Base.Pool(UI.OffScreenIcon, 25, function () {
                    return new UI.OffScreenIcon(this._game, UI.eIconType.POWERUP);
                }.bind(this));
                Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._offScreenIconsPowerUpPool, uiLayer);
                this._gameeFriendsIconsPool = new Base.Pool(UI.InGameFriendIcon, 10, function () {
                    return new UI.InGameFriendIcon(this._game);
                }.bind(this));
                Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._gameeFriendsIconsPool, frontLayer);
            }
            Object.defineProperty(UIHandler.prototype, "LevelBarShown", {
                get: function () {
                    return this._levelBarShown;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIHandler.prototype, "BattleInitScreen", {
                get: function () {
                    return this._battleInitScreen;
                },
                enumerable: true,
                configurable: true
            });
            UIHandler.prototype.ShowPowerUpTakenText = function (isMoney, powerUpType, timeToShow, amountTaken) {
                if (this._powerUpTakeText == null) {
                    this._powerUpTakeText = new UI.PowerUpTakenText(this._game, this._game.width / 2, this._game.height * .4);
                    this._UILayer.add(this._powerUpTakeText);
                }
                this._powerUpTakeText.SetPowerUpText(isMoney, powerUpType);
                if (isMoney || powerUpType === PoliceRunners.eActivatedPowerUpType.EXTRA_LIFE)
                    this._powerUpTakeText.SetAdditionalText(isMoney, amountTaken);
                this._powerUpTakeText.Show(timeToShow);
            };
            UIHandler.prototype.HidePowerUpTextIfRunning = function () {
                if (this._powerUpTakeText != null && this._powerUpTakeText.IsRunning) {
                    this._powerUpTakeText.hideText();
                }
            };
            UIHandler.prototype.UpdatePowerUpFillBar = function (ratio) {
                if (this._powerUpTakeText.FillbarRunning)
                    this._powerUpTakeText.UpdateBarRatio(ratio);
            };
            UIHandler.prototype.ShowTapToPlayText = function () {
                this._tapToPlayText = this._game.add.bitmapText(PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH, PoliceRunners.GameGlobalVariables.GAME_HALF_HEIGHT, PoliceRunners.StringConstants.FONT_DEADJIM, "TAP TO\nPLAY!", 120);
                this._tapToPlayText.align = 'center';
                this._tapToPlayText.anchor.set(0.5);
                this._UILayer.add(this._tapToPlayText);
                //console.log("showing tap to play text!");
            };
            UIHandler.prototype.HideTapToPlayText = function () {
                this._tapToPlayText.destroy();
                this._UILayer.remove(this._tapToPlayText);
            };
            UIHandler.prototype.ShowXPAddNotification = function (addedType, addedAmount) {
                if (this._XPNotificator == null) {
                    this._XPNotificator = new UI.AddedXPNotificator(this._game, PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH, this._screenTimer.SecsText.y + this._screenTimer.SecsText.height * 1.2, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, 30);
                    this._UILayer.add(this._XPNotificator);
                }
                this._XPNotificator.ShowAddedXP(addedType, addedAmount);
            };
            UIHandler.prototype.GetPoliceOffscreenIcon = function () {
                return this._offScreenIconsPolicePool.GetFirstAvailable();
            };
            UIHandler.prototype.GetPowerUpOffscreenIcon = function () {
                return this._offScreenIconsPowerUpPool.GetFirstAvailable();
            };
            UIHandler.prototype.GetGameeFriendIcon = function () {
                return this._gameeFriendsIconsPool.GetFirstAvailable();
            };
            UIHandler.prototype.ShowBattleInitScreen = function (isSmall) {
                this._battleInitScreen = new UI.BattleInitScreen(this._game, isSmall);
                this._UILayer.add(this._battleInitScreen);
            };
            UIHandler.prototype.HideBattleInitScreen = function () {
                if (this._battleInitScreen != null) {
                    this._battleInitScreen.DestroyScreen();
                    this._battleInitScreen = null;
                }
            };
            UIHandler.prototype.ShowLevelCompletedScreen = function () {
                this._levelCompletedScreen = new UI.LevelCompletedScreen(this._game, this.GenerateLevelBarTexture(), new Phaser.Point(this._game.width / 2, this._levelBar.ProgressBarFrontSprite.bottom));
            };
            UIHandler.prototype.ShowMainMenu = function () {
                if (this._comboNum != null)
                    this._comboNum.visible = false;
                if (this._menu === null)
                    this._menu = new UI.MenuManager(this._game, this._gameSettings, this, this.onRegularRaceClick.bind(this), this.onDailyRaceClick.bind(this), this.onCarChanged.bind(this));
                this._menu.visible = true;
                // if (App.Global.GAMEE && Gamee.Gamee.instance.MembershipType == Gamee.eMembershipType.VIP && !Gamee.PlayerDataStorage.Instance.VipScreenShown) {
                //   this.ShowVIPThankWindow();
                // }
                // else if (App.Global.GAMEE && Gamee.Gamee.instance.MembershipType != Gamee.eMembershipType.VIP
                //   && Gamee.PlayerDataStorage.Instance.VipScreenShown) {
                //   //vip membership has expired - remove car and vip membership
                //   Gamee.PlayerDataStorage.Instance.SetVipScreenShown(false, false);
                //   Gamee.PlayerDataStorage.Instance.RemoveFromOwnedCars(19, true);//car number 19 is vip car
                // }
            };
            UIHandler.prototype.HideMainMenu = function () {
                if (this._menu != null) {
                    this._menu.DestroyMenu();
                    this._menu = null;
                }
            };
            UIHandler.prototype.HideMissionPassedText = function () {
                if (this._missionPassedText != null) {
                    this._missionPassedText.destroy();
                    this._missionPassedText = null;
                }
            };
            UIHandler.prototype.ShowRaceMissionText = function (checkpointsTotal) {
                this._inGameRaceMission_text = this._game.add.text(this._game.camera.x + this._game.width * .02, this._game.camera.y + this._game.height * .18, "PASSED: 0/" + checkpointsTotal + ", TIME: 0.00", { font: 'Arial', fontSize: 38, fontStyle: 'bold', fill: 'white' });
                this._inGameRaceMission_text.fixedToCamera = true;
                this._UILayer.add(this._inGameRaceMission_text);
            };
            //TODO PREDELAT, TOHLE RESENI JE TOTALNI BLBOST
            UIHandler.prototype.UpdateRaceMissionText = function (timePassed, checkpointsPassed, checkpointsTotal) {
                this._inGameRaceMission_text.text = "PASSED: " + checkpointsPassed + "/" + checkpointsTotal + ", TIME: " + (timePassed / 1000).toFixed(2);
            };
            UIHandler.prototype.ShowVIPThankWindow = function () {
                var vipWindow = new UI.SimpleWindow(this._game, this._game.width / 2 - this._game.width * .072, this._game.height / 2, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_VIP_POPUP, this._menu);
                vipWindow.OnWindowClosed.add(function () {
                    Gamee.PlayerDataStorage.Instance.SetVipScreenShown(true, false);
                    //Gamee.PlayerDataStorage.Instance.SetBattleCreationPurchased(true, false);
                    Gamee.PlayerDataStorage.Instance.AddToOwnedCars(19, true); //car number 19 is vip car
                    //console.log("DATA SAVED!!!!");
                });
            };
            UIHandler.prototype.ShowFinalScreen = function (isRegularRace, nextLevelReached, dailyRaceCompleted, playedLevel, fillBarRatio, moneyEarned, dailyRaceStats, onCloseCallback) {
                // console.log("isRegRace: " + isRegularRace);
                // console.log("nextLevelReached: " + nextLevelReached);
                // console.log("dailyRaceCompleted: " + dailyRaceCompleted);
                //for unreachead levels, battles and daily races 
                if (!nextLevelReached)
                    this.showVideoRewardWindow(isRegularRace, nextLevelReached, dailyRaceCompleted, playedLevel, fillBarRatio, moneyEarned, dailyRaceStats, onCloseCallback);
                else {
                    this.ShowLevelCompletedScreen();
                    this._levelCompletedScreen.OnAnimationOver.addOnce(this.showVideoRewardWindow, this, 0, isRegularRace, nextLevelReached, dailyRaceCompleted, playedLevel, fillBarRatio, moneyEarned, dailyRaceStats, onCloseCallback);
                }
            };
            UIHandler.prototype.StartAfterDailyRaceCountdown = function () {
                //console.log("starting shit!");
                this._dailyRaceEndingNum = PoliceRunners.GameOptions.AFTER_DAILY_RACE_COUNTDOWN;
                this._missionPassedText = this._game.add.bitmapText(this._game.width / 2, this._game.height * .25, PoliceRunners.StringConstants.FONT_DEADJIM, "mission complete!\ncollect your reward!", 36);
                this._missionPassedText.anchor.set(0.5);
                this._missionPassedText.align = 'center';
                this._dailyRaceEndingTimer = this._game.add.bitmapText(this._game.width / 2, this._game.height * .33, PoliceRunners.StringConstants.FONT_DEADJIM, this._dailyRaceEndingNum.toString(), 72);
                this._dailyRaceEndingTimer.anchor.set(0.5);
                this._missionPassedText.fixedToCamera = true;
                this._dailyRaceEndingTimer.fixedToCamera = true;
                this._game.time.events.repeat(Phaser.Timer.SECOND, this._dailyRaceEndingNum, function () {
                    this._dailyRaceEndingNum--;
                    this._dailyRaceEndingTimer.text = this._dailyRaceEndingNum.toString();
                    if (this._dailyRaceEndingNum == 0) {
                        this._dailyRaceEndingTimer.destroy();
                        this.DailyRaceCountdownDone.dispatch();
                    }
                }, this);
            };
            UIHandler.prototype.showVideoRewardWindow = function (isRegularRace, nextLevelReached, dailyRaceCompleted, playedLevel, fillBarRatio, moneyEarned, dailyRaceStats, onCloseCallback) {
                var videoRewardWindow = new UI.VideoOfferWindow(this._game, this._game.camera.x + PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH * .9, this._game.camera.y + PoliceRunners.GameGlobalVariables.GAME_HALF_HEIGHT * 1.1, isRegularRace, nextLevelReached, dailyRaceCompleted, playedLevel, this.GenerateLevelBarTexture(), fillBarRatio, moneyEarned, (playedLevel + 1) * this._gameSettings.LevelReward, dailyRaceStats, this._UILayer);
                videoRewardWindow.OnWindowClosed.add(onCloseCallback);
            };
            // public ShowFollowArrow() {
            //   if (!this._followArrow)
            //     this.createFollowArrow();
            //   this._followArrow.visible = true;
            // }
            UIHandler.prototype.ShowAfterVideoWatchText = function (text) {
                this._afterVideoWatchText = this._game.add.bitmapText(this._game.camera.x + PoliceRunners.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y + PoliceRunners.GameGlobalVariables.GAME_HALF_HEIGHT, PoliceRunners.StringConstants.FONT_DEADJIM, text, 80);
                this._afterVideoWatchText.anchor.set(0.5);
                this._afterVideoWatchText.align = 'center';
                this._UILayer.add(this._afterVideoWatchText);
            };
            UIHandler.prototype.HideAfterVideoWatchText = function () {
                this._UILayer.remove(this._afterVideoWatchText);
                this._afterVideoWatchText.destroy();
            };
            // public HideFollowArrow() {
            //   if (this._followArrow)
            //     this._followArrow.visible = false;
            // }
            // public UpdateFollowArrow(pointToFollow: Phaser.Point) {
            //   let angle: number = Math.atan2(pointToFollow.y - this._followArrow.y, pointToFollow.x - this._followArrow.x);
            //   //this._followArrow.rotation = angle + 1.57079633;
            //   this._followArrow.rotation = angle - 2*(1.57079633);
            // }
            UIHandler.prototype.ShowUI = function (currentLevel, notInMission) {
                if (this._healthBar == null)
                    this.createHealthBar();
                else
                    this._healthBar.visible = true;
                if (this._comboBar == null)
                    this.createComboBar();
                else
                    this._comboBar.visible = true;
                if (!App.Global.GAMEE || !Gamee.Gamee.instance.IsBattle) {
                    if (notInMission && this._levelBar == null)
                        this.createLevelBar(currentLevel);
                    else if (notInMission) {
                        this._levelBar.SetLevelNumbers(currentLevel + 1, currentLevel + 2);
                        this._levelBar.visible = true;
                    }
                    else if (this._levelBar != null)
                        this._levelBar.visible = false;
                }
                if (this._screenTimer == null)
                    this.createScreenTimer(!notInMission);
                else {
                    this._screenTimer.ResetTimer();
                    this._screenTimer.visible = true;
                }
            };
            UIHandler.prototype.HideUI = function () {
                if (this._healthBar != null)
                    this._healthBar.visible = false;
                if (this._comboBar != null)
                    this._comboBar.visible = false;
                if (!App.Global.GAMEE || !Gamee.Gamee.instance.IsBattle) {
                    if (this._levelBar != null)
                        this._levelBar.visible = false;
                    ;
                }
                if (this._screenTimer != null) {
                    this._screenTimer.destroy();
                    this._screenTimer = null;
                }
            };
            UIHandler.prototype.UpdateHealthProgressBar = function (ratio, blink) {
                this._healthBar.UpdateBarProgress(ratio);
                if (blink)
                    this._healthBar.ShowBlinkFX();
            };
            UIHandler.prototype.UpdateComboBar = function (ratio) {
                this._comboBar.UpdateBarProgress(ratio);
            };
            UIHandler.prototype.GetLevelBarForTut = function () {
                var levelBar = new UI.ProgressBar2(this._game, this._game.camera.x, this._healthBar.ProgressBarFrontSprite.y + this._game.height * .05, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_PROGRESS_BAR, PoliceRunners.StringConstants.AK_UI_PROGRESS_BAR_FILL, .023, .095);
                levelBar.SetLevelNumbers(1, 2);
                levelBar.fixedToCamera = true;
                levelBar.cameraOffset = new Phaser.Point((this._game.camera.width - this._levelBar.ProgressBarFrontSprite.width) / 2, this._levelBar.cameraOffset.y);
                //this._UILayer.add(this._levelBar);
                return levelBar;
            };
            UIHandler.prototype.GetScreenTimerTime = function () {
                if (this._screenTimer)
                    return this._screenTimer.GetCurrentVal();
            };
            UIHandler.prototype.UpdateLevelBar = function (ratio) {
                this._levelBar.UpdateBarProgress(ratio);
            };
            UIHandler.prototype.UpdateComboNum = function (comboCount) {
                //TODO uncomment!
                if (comboCount === 0)
                    this._comboNum.visible = false;
                else {
                    this._comboNum.visible = true;
                    this._comboNum.SetComboVal(comboCount);
                    //this._comboBar.ShowBlinkFX();
                }
            };
            UIHandler.prototype.HandleMenuItemsVisibility = function () {
                if (this._menu != null && this._menu.ActiveMenuPart == UI.eMenuPart.GARAGE)
                    this._menu.GarageScreen.HandleGarageItemsVisibility();
            };
            //creates texture from level bar
            UIHandler.prototype.GenerateLevelBarTexture = function () {
                if (this._levelBar != null)
                    return this._levelBar.generateTexture();
                else
                    return null;
            };
            UIHandler.prototype.createHealthBar = function () {
                this._healthBar = new UI.ProgressBar2(this._game, this._game.camera.x + this._game.camera.width * .08, this._game.camera.y + this._game.camera.height * .088, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_HEALTH_BAR, PoliceRunners.StringConstants.AK_UI_HEALTH_BAR_FILL, .043, .085, PoliceRunners.StringConstants.AK_UI_HEALTH_BAR_HEART);
                this._healthBar.fixedToCamera = true;
                this._UILayer.add(this._healthBar);
            };
            UIHandler.prototype.createComboBar = function () {
                this._comboBar = new UI.ProgressBar2(this._game, this._game.camera.x + this._game.width * .92 - this._healthBar.ProgressBarFrontSprite.width, this._healthBar.ProgressBarFrontSprite.y, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_MULTIPLY_BAR, PoliceRunners.StringConstants.AK_UI_MULTIPLY_BAR_FILL, .04, .11);
                this._comboNum = new UI.ComboNum(this._game, this._comboBar.right - this._game.width * .04, this._comboBar.ProgressBarFrontSprite.y - this._comboBar.ProgressBarFrontSprite.height * .21, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, 42);
                this._comboNum.fixedToCamera = true;
                this._comboBar.fixedToCamera = true;
                this._UILayer.add(this._comboBar);
                this._UILayer.add(this._comboNum);
            };
            UIHandler.prototype.createLevelBar = function (currentLevel) {
                this._levelBar = new UI.ProgressBar2(this._game, this._game.camera.x, this._healthBar.ProgressBarFrontSprite.y + this._game.height * .05, PoliceRunners.StringConstants.ATLAS_UI, PoliceRunners.StringConstants.AK_UI_PROGRESS_BAR, PoliceRunners.StringConstants.AK_UI_PROGRESS_BAR_FILL, .023, .095);
                this._levelBar.SetLevelNumbers(currentLevel + 1, currentLevel + 2);
                this._levelBar.fixedToCamera = true;
                this._levelBar.cameraOffset = new Phaser.Point((this._game.camera.width - this._levelBar.ProgressBarFrontSprite.width) / 2, this._levelBar.cameraOffset.y);
                this._UILayer.add(this._levelBar);
            };
            UIHandler.prototype.SetLevelBarBlinking = function () {
                if (this._levelBar != null) {
                    this._levelBar.StartBarScaling();
                }
            };
            UIHandler.prototype.createScreenTimer = function (inDailyRace) {
                var timerYPos = App.Global.GAMEE ? ((inDailyRace || Gamee.Gamee.instance.IsBattle) ? this._healthBar.ProgressBarFrontSprite.y + this._healthBar.ProgressBarFrontSprite.height : this._levelBar.ProgressBarFrontSprite.y + this._levelBar.ProgressBarFrontSprite.height * .8)
                    : this._levelBar.ProgressBarFrontSprite.y + this._game.height * .05;
                this._screenTimer = new UI.ScreenTimer(this._game, this._game.width / 2 + this._game.width * .02, timerYPos, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, 42, UI.eTimerMode.M_S_MS, true);
                this._screenTimer.fixedToCamera = true;
                this._UILayer.add(this._screenTimer);
            };
            UIHandler.prototype.UpdateTimer = function (timePassedMS) {
                if (this._screenTimer)
                    this._screenTimer.UpdateTime(timePassedMS);
            };
            UIHandler.prototype.SetTimerToLevelComplete = function () {
                if (this._screenTimer)
                    this._screenTimer.SetToLevelCompleted();
            };
            UIHandler.prototype.HideLevelCompleteText = function () {
                if (this._screenTimer)
                    this._screenTimer.HideLevelCompletedText();
            };
            UIHandler.prototype.UpdateFloatingScoreText = function (additionPerAmmo) {
                for (var i = 0; i < this._floatingScorePool.Pool.length; i++) {
                    this._floatingScorePool.Pool[i].SetScoreText(additionPerAmmo);
                }
            };
            UIHandler.prototype.ShowAddedScore = function (scoreToAdd, xPos, yPos) {
                var addedNum = this._floatingScorePool.GetFirstAvailable();
                if (addedNum != null) {
                    this._UILayer.add(addedNum);
                    addedNum.SetScoreText(scoreToAdd);
                    addedNum.SpawnScore(xPos, yPos);
                }
            };
            UIHandler.prototype.killFloatingScoreText = function (addedNum) {
                //console.log("Adding score back to pool!");
                addedNum.KillItem();
                this._UILayer.remove(addedNum);
                this._floatingScorePool.AddToPool(addedNum);
            };
            //**-----------SIGNAL EVENTS------------------- */
            UIHandler.prototype.onRegularRaceClick = function () {
                if (this._menu.AlphaTweening)
                    return;
                //console.log("in handler: " + missionType);
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_BUTTON);
                this.OnStartClick.dispatch(PoliceRunners.eGameType.REGULAR);
            };
            UIHandler.prototype.onDailyRaceClick = function () {
                if (this._menu.AlphaTweening)
                    return;
                //console.log("in handler: " + missionType);
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_BUTTON);
                this.OnStartClick.dispatch(PoliceRunners.eGameType.DAILY_RACE);
            };
            UIHandler.prototype.onCarChanged = function () {
                if (this._menu.AlphaTweening)
                    return;
                this.OnCarChange.dispatch();
            };
            return UIHandler;
        }());
        UI.UIHandler = UIHandler;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
;
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var UpgradeButton = /** @class */ (function (_super) {
            __extends(UpgradeButton, _super);
            /** Constructor */
            function UpgradeButton(game, xPos, yPos, spriteActive, spriteDarken, carID, onClickCb, xAnchor, yAnchor) {
                var _this = _super.call(this, game) || this;
                _this._button = new Phaser.Button(game, xPos, yPos, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, undefined, undefined, spriteActive, spriteActive, spriteActive, spriteActive);
                if (xAnchor !== undefined && yAnchor !== undefined) {
                    _this._button.anchor.setTo(xAnchor, yAnchor);
                }
                _this._button.anchor.set(0.5);
                _this._button.input.priorityID = 2;
                _this._button.events.onInputDown.add(_this.manageButtonDownClick, _this);
                _this._button.events.onInputUp.add(_this.manageButtonUpClick, _this);
                _this._button.events.onInputUp.add(_this.onClick, _this);
                _this._tintSprite = _this.game.add.image(xPos, yPos, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, spriteDarken);
                _this._tintSprite.anchor.set(0.5);
                _this._tintSprite.visible = false;
                _this._assignedCarID = carID;
                _this._onClickCb = onClickCb;
                _this._activeSprite = spriteActive;
                _this._priceText = game.add.bitmapText(_this._button.centerX, _this._button.centerY - _this._button.height * .12, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "$ 5000", 32);
                _this._priceText.anchor.setTo(0.5);
                _this.add(_this._button);
                _this.add(_this._priceText);
                _this.add(_this._tintSprite);
                return _this;
            }
            Object.defineProperty(UpgradeButton.prototype, "Locked", {
                get: function () {
                    return this._locked;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UpgradeButton.prototype, "Price", {
                get: function () {
                    return this._price;
                },
                set: function (price) {
                    this._price = price;
                    this.setPriceText();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UpgradeButton.prototype, "x", {
                //** This overrides standard Phaser.Group properties */
                get: function () {
                    return this._button.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UpgradeButton.prototype, "y", {
                get: function () {
                    return this._button.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UpgradeButton.prototype, "height", {
                get: function () {
                    return this._button.height;
                },
                enumerable: true,
                configurable: true
            });
            UpgradeButton.prototype.onClick = function () {
                this._onClickCb(this._assignedCarID, this._price);
            };
            UpgradeButton.prototype.manageButtonDownClick = function () {
                this._tintSprite.visible = true;
            };
            UpgradeButton.prototype.manageButtonUpClick = function () {
                this._tintSprite.visible = false;
            };
            UpgradeButton.prototype.RemoveCallbacks = function () {
                this._button.events.onInputDown.removeAll();
                this._button.events.onInputUp.removeAll();
            };
            UpgradeButton.prototype.setText = function (text) {
                this._priceText.text = text;
            };
            UpgradeButton.prototype.setPriceText = function () {
                this._priceText.text = "$" + this._price;
            };
            return UpgradeButton;
        }(Phaser.Group));
        UI.UpgradeButton = UpgradeButton;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var eAfterVideoState;
        (function (eAfterVideoState) {
            eAfterVideoState[eAfterVideoState["WATCHED_WHOLE"] = 0] = "WATCHED_WHOLE";
            eAfterVideoState[eAfterVideoState["WATCHED_PARTIALLY"] = 1] = "WATCHED_PARTIALLY";
            eAfterVideoState[eAfterVideoState["NOT_WATCHED"] = 2] = "NOT_WATCHED";
        })(eAfterVideoState = UI.eAfterVideoState || (UI.eAfterVideoState = {}));
        var VideoOfferWindow = /** @class */ (function (_super) {
            __extends(VideoOfferWindow, _super);
            //TODO uncomment when timer needed
            //private _timer: Phaser.Timer;
            //private _timeText: Phaser.BitmapText;
            //private _currentTime: number;
            function VideoOfferWindow(game, xPos, yPos, isRegularRace, nextLevelReached, dailyRaceCompleted, playedLevel, fillbarTexture, fillbarRatio, moneyEarned, levelReward, dailyRaceStats, UIlayer) {
                var _this = _super.call(this, game) || this;
                //should be called when window is ready
                _this.OnWindowClosed = new Phaser.Signal();
                _this._game = game;
                _this._inPlaceFadeIn = !nextLevelReached;
                //console.log("level reward: " + levelReward + ", " + moneyEarned);
                _this._totalMoneyEarned = moneyEarned + levelReward;
                //console.log("isRegRace: " + isRegularRace);
                //console.log("nextLevReached: " + nextLevelReached);
                //console.log("dailyRaceCompleted: " + dailyRaceCompleted);
                _this._dailyRaceCompleted = dailyRaceCompleted;
                _this._darkOverlay = Utils.PhaserUtils.DrawRectangle(_this.game, _this.game.camera.x - _this.game.width * .15, _this.game.camera.y - _this.game.height * .15, _this.game.width * 1.3, _this.game.height * 1.3, 0x000000, 0.4);
                if (_this._inPlaceFadeIn) {
                    UIlayer.add(_this._darkOverlay);
                    _this._darkOverlay.alpha = 0;
                    _this.game.add.tween(_this._darkOverlay).to({ "alpha": 1 }, 500, Phaser.Easing.Linear.None, true, 0);
                }
                _this._bg = game.add.image(xPos, yPos, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, (nextLevelReached || dailyRaceCompleted) ? PoliceRunners.StringConstants.AK_FS_BG_BIG : ((Gamee.Gamee.instance.IsBattle || !dailyRaceCompleted) ? PoliceRunners.StringConstants.AK_FS_BG_SMALLEST : PoliceRunners.StringConstants.AK_FS_BG_SMALL));
                _this._bg.anchor.setTo(0.5);
                var stripe = game.add.image(_this._bg.right, _this._bg.top + _this._bg.width * .14, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_TITLE_STRIPE);
                stripe.anchor.set(0.995, 0.5);
                var titleText = _this.game.add.bitmapText(stripe.centerX, stripe.centerY, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, nextLevelReached ? "LEVEL COMPLETED" : (dailyRaceCompleted ? "DAILY RACE DONE" : "KEEP PLAYING?"), 52);
                titleText.anchor.set(0.5, 0.33);
                titleText.tint = 0x7cfdea;
                // let pbCoords = nextLevelReached ? new Phaser.Point(this._bg.left + this._bg.width * .25, stripe.bottom + this._bg.width * .25) :
                //     new Phaser.Point(this._bg.left + this._bg.width * .21, stripe.bottom + this._bg.width * .25);
                //let overviewScreen: Phaser.Group = null;
                var yellowText = null;
                if (fillbarTexture != null) {
                    _this._progressBar = _this.game.add.image(_this._bg.x + _this._bg.width * (nextLevelReached ? .08 : .06), _this._bg.top + _this._bg.height * (nextLevelReached ? .20 : .225), fillbarTexture);
                    _this._progressBar.anchor.set(0.5);
                    _this._progressBar.scale.set(0.9);
                    if (!nextLevelReached)
                        yellowText = _this.createPercentualText(Math.round((1 - fillbarRatio) * 100), playedLevel + 2);
                    else
                        yellowText = _this.createLevelCompletedText(playedLevel + 2);
                    if (nextLevelReached) {
                        _this._overviewScreen = _this.createOverviewScreen(dailyRaceCompleted, levelReward, moneyEarned);
                    }
                }
                var buttonOk;
                //let yesSign: Phaser.BitmapText;
                if (!nextLevelReached) {
                    //failed battle or failed daily race
                    if (Gamee.Gamee.instance.IsBattle || (!isRegularRace && !dailyRaceCompleted)) {
                        if (App.Global.LOG_EVENTS && Gamee.Gamee.instance.IsBattle)
                            Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_VIDEO_OFFER_SHOWN_BATTLE, "");
                        else if (App.Global.LOG_EVENTS) {
                            Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_VIDEO_OFFER_SHOWN_DAILY_RACE, "");
                        }
                        // buttonOk = new SimpleButton(this.game, this._bg.x + this._bg.width * .06, this._bg.bottom - this._bg.height * .55, StringConstants.ATLAS_FINAL_SCREENS,
                        // StringConstants.AK_FS_BUTTON_YES, StringConstants.AK_FS_BUTTON_PRESSED, this.onButtonOkClick, this);
                        //console.log("A");
                        //yesSign = this.game.add.bitmapText(this._bg.x + this._bg.width * .06, this._bg.bottom - this._bg.height * .638, StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "(YES)", 34);
                        //yesSign.anchor.set(0.5);
                        buttonOk = new UI.SimplePaymentButton(_this.game, _this._bg.x + _this._bg.width * .06, _this._bg.bottom - _this._bg.height * .53, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_BTN_BLUE_LARGE, PoliceRunners.StringConstants.AK_FS_BUTTON_PRESSED, Gamee.ePaymentType.COINS, 5, false, null, null, "GAME CONTINUE", _this.afterPurchase.bind(_this), null, null, 0.5, 0.5);
                        buttonOk.Icon.y -= buttonOk.Button.height * .1;
                        buttonOk.Icon.x -= buttonOk.Button.height * .13;
                        buttonOk.PriceText.y -= buttonOk.Button.height * .1;
                        buttonOk.PriceText.x -= buttonOk.Button.height * .13;
                    }
                    //successful daily race
                    else if (dailyRaceCompleted) {
                        //console.log("B");
                        //TODO LOG EVENTS
                        // if (App.Global.LOG_EVENTS)
                        //     Gamee.Gamee.instance.logGameEvent(StringConstants.EVENT_VIDEO_OFFER_SHOWN_CAMPAIGN, "false");
                        _this.createDailyRaceStats(dailyRaceStats);
                        _this.createClaimButtons();
                    }
                    //failed regular race
                    else {
                        //console.log("C");
                        buttonOk = new UI.SimplePaymentButton(_this.game, _this._bg.x + _this._bg.width * .06, _this._bg.bottom - _this._bg.height * .42, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_BTN_BLUE_SMALL, PoliceRunners.StringConstants.AK_FS_BTN_PRESSED_SMALL, Gamee.ePaymentType.COINS, 5, false, null, null, "GAME CONTINUE", _this.afterPurchase.bind(_this), null, null, 0.5, 0.5);
                    }
                }
                else if (nextLevelReached) {
                    _this.createClaimButtons();
                    if (App.Global.LOG_EVENTS)
                        Gamee.Gamee.instance.logGameEvent(PoliceRunners.StringConstants.EVENT_VIDEO_OFFER_SHOWN_CAMPAIGN, "true");
                }
                //TODO uncomment
                var cancelButton = null;
                if ((isRegularRace && !nextLevelReached) || (!isRegularRace && !dailyRaceCompleted) || Gamee.Gamee.instance.IsBattle) {
                    // cancelButton = game.add.bitmapText(this._bg.x + this._bg.width * .06, this._bg.bottom - this._bg.height * ((Gamee.Gamee.instance.IsBattle || (!isRegularRace && !dailyRaceCompleted)) ? .3 : .26), StringConstants.FONT_MENU_BOLDITALIC,
                    //     (nextLevelReached || dailyRaceCompleted) ? "OK" : "NO, THANKS", 22);
                    cancelButton = game.add.bitmapText(_this._bg.x + _this._bg.width * .06, _this._bg.bottom - _this._bg.height * ((Gamee.Gamee.instance.IsBattle || (!isRegularRace && !dailyRaceCompleted)) ? .3 : .26), PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, "NO, THANKS", 22);
                    cancelButton.anchor.set(0.5);
                    cancelButton.inputEnabled = true;
                    cancelButton.events.onInputDown.add(_this.onButtonCancelClick, _this);
                    var cancelClickArea = Utils.PhaserUtils.DrawRectangle(_this.game, -(cancelButton.width * 1.5) / 2, -(cancelButton.height * 1.7) / 2, cancelButton.width * 1.5, cancelButton.height * 1.7, 0xffffff, 0);
                    cancelButton.addChild(cancelClickArea);
                }
                if (!_this._inPlaceFadeIn)
                    _this.add(_this._darkOverlay);
                _this.add(_this._bg);
                _this.add(stripe);
                _this.add(titleText);
                if (_this._progressBar)
                    _this.add(_this._progressBar);
                if (_this._overviewScreen)
                    _this.add(_this._overviewScreen);
                if (yellowText)
                    _this.add(yellowText);
                // if (yesSign) this.add(yesSign);
                if (_this._claimButtonsGroup)
                    _this.add(_this._claimButtonsGroup);
                if (buttonOk)
                    _this.add(buttonOk);
                //TODO uncomment
                if (cancelButton)
                    _this.add(cancelButton);
                _this.x = _this.game.width;
                _this.tweenToScreen();
                return _this;
            }
            VideoOfferWindow.prototype.createPercentualText = function (percents, unlockLevel) {
                var percent = this.game.add.bitmapText(this._progressBar.left + this._progressBar.width * .26, this._progressBar.bottom + this._progressBar.height * .2, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, percents + "%", 36);
                percent.tint = 0xfff56b;
                percent.anchor.set(0.5, 1);
                var restOfPercents = this.game.add.bitmapText(percent.width * .65, 0, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "LEFT TO UNLOCK LVL " + unlockLevel, 20);
                restOfPercents.anchor.set(0, 1.11);
                restOfPercents.tint = 0xfff56b;
                percent.addChild(restOfPercents);
                return percent;
            };
            VideoOfferWindow.prototype.createDailyRaceStats = function (dailyRaceStats) {
                var drIcon;
                var drHeadline;
                var drText;
                var drRecordName;
                var iconOffset;
                switch (dailyRaceStats.raceType) {
                    case PoliceRunners.DailyRaceType.COMBO_RUN:
                        drIcon = PoliceRunners.StringConstants.AK_DR_ICON_COMBO;
                        drHeadline = "\"COMBO RUN MISSION";
                        drText = "\"GET " + dailyRaceStats.goal + "X COMBO LEVEL\"";
                        drRecordName = "COMBO";
                        iconOffset = this._bg.left + this._bg.width * .32;
                        break;
                    case PoliceRunners.DailyRaceType.COP_HUNT:
                        drIcon = PoliceRunners.StringConstants.AK_DR_ICON_HUNT;
                        drHeadline = "COP HUNT MISSION";
                        drText = "\"DESTROY " + dailyRaceStats.goal + " COP CARS\"";
                        iconOffset = this._bg.left + this._bg.width * .32;
                        break;
                    case PoliceRunners.DailyRaceType.RACE:
                        drIcon = PoliceRunners.StringConstants.AK_DR_ICON_RACE;
                        drHeadline = "RACE MISSION";
                        drText = "\"FIND " + dailyRaceStats.goal + " CHECKPOINT CIRCLES\"";
                        drRecordName = "CHECKPOINTS";
                        iconOffset = this._bg.left + this._bg.width * .37;
                        break;
                }
                var iconImg = this.game.add.image(iconOffset, this._bg.top + this._bg.height * .18, PoliceRunners.StringConstants.ATLAS_DAILY_RACE, drIcon);
                iconImg.anchor.set(dailyRaceStats.raceType == PoliceRunners.DailyRaceType.RACE ? 0.4 : 0.5, 0.5);
                var titleText = this.game.add.bitmapText(iconImg.right + iconImg.width * .2, iconImg.y, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, drHeadline, 32);
                titleText.anchor.set(0, 0.33);
                titleText.tint = 0x7cfdea;
                var missionText = this.game.add.bitmapText(this._bg.left + this._bg.width * .62, this._bg.top + this._bg.height * .26, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, drText, 26);
                missionText.anchor.set(0.6);
                this._overviewScreen = new Phaser.Group(this.game);
                this._overviewScreen.add(iconImg);
                this._overviewScreen.add(titleText);
                this._overviewScreen.add(missionText);
                if (dailyRaceStats.raceType != PoliceRunners.DailyRaceType.COP_HUNT)
                    this._overviewScreen.add(this.createDailyStatRecord(this._bg.top + this._bg.height * .35, drRecordName, dailyRaceStats.goal + "/" + dailyRaceStats.goal));
                this._overviewScreen.add(this.createDailyStatRecord(this._bg.top + this._bg.height * .41, "COPS DESTROYED", dailyRaceStats.raceType == PoliceRunners.DailyRaceType.COP_HUNT ? dailyRaceStats.copsDestroyed + "/" + dailyRaceStats.goal : dailyRaceStats.copsDestroyed.toString()));
                this._overviewScreen.add(this.createDailyStatRecord(this._bg.top + this._bg.height * .47, "TIME SPENT", dailyRaceStats.timeSpent));
                this._overviewScreen.add(this.createMoneyRecord(this._bg.top + this._bg.height * .53, "MONEY EARNED", this._totalMoneyEarned, false));
            };
            VideoOfferWindow.prototype.createClaimButtons = function () {
                //console.log("CREATING CLAIM BUTTONS!!!!");
                this._claimButtonsGroup = new Phaser.Group(this.game);
                var moneyIcon1 = this.game.add.image(this._bg.left + this._bg.width * .3, this._bg.bottom - this._bg.height * .33, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_MONEY);
                moneyIcon1.anchor.set(0.5);
                var moneyAmount1 = this.game.add.bitmapText(moneyIcon1.right + moneyIcon1.width / 2, moneyIcon1.y, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, this._totalMoneyEarned.toString(), 42);
                moneyAmount1.anchor.set(0, 0.4);
                var claimButton = new UI.SimpleButton(this.game, this._bg.right - this._bg.width * .28, moneyIcon1.y, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_BTN_BLUE_SMALL, PoliceRunners.StringConstants.AK_FS_BTN_PRESSED_SMALL, this.onClaimMoneyButtonClick, this, null, 0.5, 0.5, "CLAIM");
                this._claimButtonsGroup.add(moneyIcon1);
                this._claimButtonsGroup.add(moneyAmount1);
                this._claimButtonsGroup.add(claimButton);
                if (this._totalMoneyEarned > 0) {
                    var moneyIcon2 = this.game.add.image(moneyIcon1.x, moneyIcon1.y + this._bg.height * .1, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_MONEY);
                    moneyIcon2.anchor.set(0.5);
                    var moneyAmount2 = this.game.add.bitmapText(moneyAmount1.x, moneyIcon2.y, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, (2 * this._totalMoneyEarned).toString(), 42);
                    moneyAmount2.anchor.set(0, 0.4);
                    var doubleButton = new UI.SimplePaymentButton(this.game, claimButton.Button.x, moneyAmount2.y, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_BTN_GREEN_SMALL, PoliceRunners.StringConstants.AK_FS_BTN_PRESSED_SMALL, Gamee.ePaymentType.COINS, 5, false, null, null, "END GAME DOUBLE MONEY", this.afterDoubleRewardClick.bind(this), null);
                    this._claimButtonsGroup.add(moneyIcon2);
                    this._claimButtonsGroup.add(moneyAmount2);
                    this._claimButtonsGroup.add(doubleButton);
                }
            };
            VideoOfferWindow.prototype.createLevelCompletedText = function (unlockedLevel) {
                var unlockedText = this.game.add.bitmapText(this._progressBar.centerX, this._progressBar.y - this._progressBar.height * .04, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, "LVL " + unlockedLevel + " UNLOCKED", 28);
                unlockedText.anchor.set(0.5, 1);
                unlockedText.tint = 0xfff56b;
                return unlockedText;
            };
            //for the overview on end win screen
            VideoOfferWindow.prototype.createOverviewScreen = function (dailyRaceCompleted, levelReward, moneyEarned) {
                var overviewScreen = this.game.add.group();
                //TODO level reward... progress bar tam neni more!
                var levelCompletedText = this.createMoneyRecord(!dailyRaceCompleted ? this._progressBar.bottom + this._progressBar.height * .4 : this._bg.top + this._bg.height * .29, !dailyRaceCompleted ? "LEVEL COMPLETED" : "DAILY RACE BONUS", levelReward, false);
                var levelRewardText;
                if (!dailyRaceCompleted)
                    levelRewardText = this.createMoneyRecord(!dailyRaceCompleted ? this._progressBar.bottom + this._progressBar.height * .8 : this._bg.top + this._bg.height * .35, "MONEY EARNED", moneyEarned, false);
                var summaryText = this.createMoneyRecord(!dailyRaceCompleted ? this._progressBar.bottom + this._progressBar.height * 1.25 : this._bg.top + this._bg.height * .45, "SUMMARY", this._totalMoneyEarned, true);
                overviewScreen.add(levelCompletedText);
                if (levelRewardText)
                    overviewScreen.add(levelRewardText);
                overviewScreen.add(summaryText);
                return overviewScreen;
            };
            VideoOfferWindow.prototype.createMoneyRecord = function (yPos, text, moneyAmount, big) {
                var recordGroup = this.game.add.group();
                var recordText = this.game.add.bitmapText(this._bg.left + this._bg.width * .27, yPos, PoliceRunners.StringConstants.FONT_MENU_LIGHTITALIC, text, big ? 26 : 20);
                recordText.anchor.set(0, 0.5);
                recordText.tint = 0x7cfdea;
                var moneyText = this.game.add.bitmapText(this._bg.right - this._bg.width * .12, yPos, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, moneyAmount.toString(), big ? 36 : 30);
                moneyText.anchor.set(1, 0.5);
                moneyText.tint = 0x7cfdea;
                var money = this.game.add.image(moneyText.left - this._bg.width * .03, moneyText.y, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, big ? PoliceRunners.StringConstants.AK_FS_MONEY : PoliceRunners.StringConstants.AK_FS_MONEY);
                money.anchor.set(1, 0.6);
                recordGroup.add(recordText);
                recordGroup.add(moneyText);
                recordGroup.add(money);
                return recordGroup;
            };
            VideoOfferWindow.prototype.createDailyStatRecord = function (yPos, text, statText) {
                var recordGroup = this.game.add.group();
                var recordText = this.game.add.bitmapText(this._bg.left + this._bg.width * .27, yPos, PoliceRunners.StringConstants.FONT_MENU_LIGHTITALIC, text, 20);
                recordText.anchor.set(0, 0.5);
                recordText.tint = 0x7cfdea;
                var textRight = this.game.add.bitmapText(this._bg.right - this._bg.width * .12, yPos, PoliceRunners.StringConstants.FONT_MENU_CONDENSED_BOLDITALIC, statText, 30);
                textRight.anchor.set(1, 0.5);
                textRight.tint = 0x7cfdea;
                recordGroup.add(recordText);
                recordGroup.add(textRight);
                return recordGroup;
            };
            VideoOfferWindow.prototype.createButtonMoneyAddition = function (totalValue) {
                var moneyImg = this.game.add.image(0, 0, PoliceRunners.StringConstants.ATLAS_FINAL_SCREENS, PoliceRunners.StringConstants.AK_FS_MONEY);
                moneyImg.anchor.set(1, 0.5);
                var text = this.game.add.bitmapText(moneyImg.width * .3, 0, PoliceRunners.StringConstants.FONT_MENU_BOLDITALIC, totalValue.toString(), 38);
                text.anchor.set(0, 0.37);
                moneyImg.addChild(text);
                return moneyImg;
            };
            VideoOfferWindow.prototype.tweenToScreen = function () {
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_OFFER_SHOWN);
                this._game.add.tween(this).to({
                    x: 0
                }, 1500, Phaser.Easing.Elastic.Out, true);
            };
            // private onButtonOkClick(): void {
            //     Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_POP);
            //     if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS)
            //         Gamee.Gamee.instance.ShowRewardedVideo(this.afterPurchase.bind(this));
            //     else this.afterPurchase(true);
            // }
            VideoOfferWindow.prototype.onClaimMoneyButtonClick = function () {
                if (App.Global.GAMEE)
                    //dont save it - this will be saved in the last call of gameOver
                    Gamee.PlayerDataStorage.Instance.SetCurrencyAmount(Gamee.PlayerDataStorage.Instance.CurrencyAmount + this._totalMoneyEarned, false);
                this.tweenOutOfScreen(false);
            };
            VideoOfferWindow.prototype.afterDoubleRewardClick = function (success) {
                //console.log("double reward click! ");
                if (success) {
                    this._totalMoneyEarned *= 2;
                    //dont save it - this will be saved in the last call of gameOver
                    if (App.Global.GAMEE)
                        Gamee.PlayerDataStorage.Instance.SetCurrencyAmount(Gamee.PlayerDataStorage.Instance.CurrencyAmount + this._totalMoneyEarned, false);
                }
                this.tweenOutOfScreen(false);
            };
            VideoOfferWindow.prototype.onButtonCancelClick = function () {
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_CLICK_POP);
                this.tweenOutOfScreen(false);
            };
            VideoOfferWindow.prototype.afterPurchase = function (success) {
                this.tweenOutOfScreen(success);
            };
            VideoOfferWindow.prototype.tweenOutOfScreen = function (continueGame) {
                //dont save it - this will be saved in the last call of gameOver
                if (this._dailyRaceCompleted)
                    Gamee.PlayerDataStorage.Instance.SetLastDailyRaceTime(Utils.DateUtils.GetTimestampInSeconds(), false);
                Base.AudioPlayer.Instance.PlaySound(PoliceRunners.StringConstants.SOUND_OFFER_SHOWN);
                var tweenOut = this._game.add.tween(this).to({
                    x: -this._game.width
                }, 250, Phaser.Easing.Default, true);
                tweenOut.onComplete.add(function () {
                    this.OnWindowClosed.dispatch(continueGame);
                    if (this._inPlaceFadeIn)
                        this._darkOverlay.destroy();
                    this.destroy();
                }, this);
            };
            return VideoOfferWindow;
        }(Phaser.Group));
        UI.VideoOfferWindow = VideoOfferWindow;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var PoliceRunners;
(function (PoliceRunners) {
    var UI;
    (function (UI) {
        var VipOfferWindow = /** @class */ (function (_super) {
            __extends(VipOfferWindow, _super);
            function VipOfferWindow(game, menuManager) {
                var _this = _super.call(this, game) || this;
                _this._menuManagerRef = menuManager;
                var bg = _this.game.add.image(_this.game.width / 2, _this.game.height / 2, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_BG);
                bg.anchor.set(0.5);
                var cancelButton = _this.game.add.button(bg.right - bg.width * .1, bg.top + bg.height * .06, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, _this.onCancelClick, _this, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_CANCEL_BTN, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_CANCEL_PRESSED, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_CANCEL_PRESSED, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_CANCEL_BTN);
                cancelButton.anchor.set(0.5);
                cancelButton.input.priorityID = 2;
                var gemButton = new UI.SimplePaymentButton(_this.game, bg.x, bg.y + bg.height * .2, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_GEMBTN, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_BTNPRESSED, Gamee.ePaymentType.GEMS, 49, true, PoliceRunners.StringConstants.ATLAS_BATTLE, PoliceRunners.StringConstants.AK_BATTLE_BAR_ICON, "BATTLE CREATOR", _this.afterGemsPurchase.bind(_this), null, null, 0.5, 0.47);
                gemButton.Icon.y -= cancelButton.height * .3;
                gemButton.PriceText.y -= cancelButton.height * .3;
                var vipButton = new UI.SimpleButton(_this.game, bg.x, bg.y + bg.height * .4, PoliceRunners.StringConstants.ATLAS_MAIN_MENU, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_VIPBTN, PoliceRunners.StringConstants.AK_LOBBY_VIP_BATTLE_BTNPRESSED, _this.onVipButtonClick.bind(_this), _this, null, 0.5, 0.47);
                var vipButtontext = _this.game.add.bitmapText(vipButton.Button.x, vipButton.Button.y, PoliceRunners.StringConstants.FONT_MENU_BLACKITALIC, "VIP", 36);
                vipButtontext.anchor.set(0.5, 0.9);
                vipButton.addAt(vipButtontext, 1);
                _this.add(bg);
                _this.add(cancelButton);
                _this.add(gemButton);
                _this.add(vipButton);
                return _this;
            }
            VipOfferWindow.prototype.onCancelClick = function () {
                this._menuManagerRef.SwitchScreen(null, null, false, UI.eMenuPart.LOBBY);
            };
            VipOfferWindow.prototype.afterGemsPurchase = function (success) {
                //console.log("AFTER BUY! SUCCESS? " + success);
                if (success) {
                    Gamee.PlayerDataStorage.Instance.SetBattleCreationPurchased(true, true);
                    this._menuManagerRef.OnVipOfferAction(false);
                    this._menuManagerRef.SwitchScreen(null, null, false, UI.eMenuPart.LOBBY);
                }
            };
            VipOfferWindow.prototype.onVipButtonClick = function () {
                Gamee.Gamee.instance.ShowSubscribeDialog(this.afterVipPurchase.bind(this));
                //this.afterVipPurchase(true);
            };
            VipOfferWindow.prototype.afterVipPurchase = function (purchased) {
                if (purchased) {
                    this._menuManagerRef.OnVipOfferAction(true);
                    this._menuManagerRef.SwitchScreen(null, null, false, UI.eMenuPart.LOBBY);
                }
            };
            return VipOfferWindow;
        }(Phaser.Group));
        UI.VipOfferWindow = VipOfferWindow;
    })(UI = PoliceRunners.UI || (PoliceRunners.UI = {}));
})(PoliceRunners || (PoliceRunners = {}));
var Utils;
(function (Utils) {
    var ArrayUtils = /** @class */ (function () {
        function ArrayUtils() {
        }
        /** This is fast and low GC splice - use only when removing one item*/
        ArrayUtils.OneItemSplice = function (a, i) {
            var l = a.length;
            if (l) {
                while (i < l) {
                    a[i++] = a[i];
                }
                --a.length;
            }
        };
        return ArrayUtils;
    }());
    Utils.ArrayUtils = ArrayUtils;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var DateUtils = /** @class */ (function () {
        function DateUtils() {
        }
        DateUtils.GetTimestampInSeconds = function () {
            return Date.now() / 1000;
        };
        /**
         * Receives timestamp in seconds and determines whether it is expired
         * @param timestamp given timestamp in seconds
         * @param duration expected duration of given timestamp
         */
        DateUtils.HasTimestampInSecondsExpired = function (timestamp, duration) {
            var tsNow = Date.now() / 1000;
            return (tsNow - (timestamp + duration) <= 0 ? false : true);
        };
        return DateUtils;
    }());
    Utils.DateUtils = DateUtils;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var PhaserImageDownloader = /** @class */ (function () {
        function PhaserImageDownloader() {
        }
        PhaserImageDownloader.AddFilesToQueue = function (game, filesToLoad) {
            PhaserImageDownloader.OnImageLoaded = new Phaser.Signal();
            PhaserImageDownloader.OnFilesLoaded = new Phaser.Signal();
            for (var i = 0; i < filesToLoad.length; i++) {
                game.load.image(filesToLoad[i].fileName, filesToLoad[i].filePath);
            }
            App.Global.game.load.onFileComplete.add(this.fileLoadComplete, this);
            App.Global.game.load.onLoadComplete.addOnce(this.filesLoaded, this);
            App.Global.game.load.start();
        };
        PhaserImageDownloader.fileLoadComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            this.OnImageLoaded.dispatch(success, cacheKey);
        };
        PhaserImageDownloader.filesLoaded = function () {
            //console.log("GAMEEtest: PhaserImageDownloader, all files loaded!!!");
            App.Global.game.load.onFileComplete.remove(this.fileLoadComplete, this);
            this.OnFilesLoaded.dispatch();
        };
        return PhaserImageDownloader;
    }());
    Utils.PhaserImageDownloader = PhaserImageDownloader;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var PhaserUtils = /** @class */ (function () {
        function PhaserUtils() {
        }
        /** Changes physics body size and set it in the middle of sprite */
        PhaserUtils.ChangePhysicsBodySizeRect = function (sprite, xMultiplier, yMultiplier) {
            var wantedBodyWidth = sprite.body.width * xMultiplier;
            var wantedBodyHeight = sprite.body.height * yMultiplier;
            var xOffset = (sprite.body.width - wantedBodyWidth) / 2;
            var yOffset = (sprite.body.height - wantedBodyHeight) / 2;
            sprite.body.setSize(wantedBodyWidth / sprite.scale.x, wantedBodyHeight / sprite.scale.y, xOffset / sprite.scale.x, yOffset / sprite.scale.y);
        };
        /** Changes physics body size and set it in the middle of sprite */
        PhaserUtils.ChangePhysicsBodySizeCircle = function (sprite, radius) {
            var diff = Math.abs((radius * 2) - sprite.width);
            if (radius * 2 > sprite.width) {
                diff *= -1;
            }
            sprite.body.setCircle(radius, sprite.scale.x * (diff / 2), sprite.scale.x * (diff / 2));
        };
        /** slowMoCoeff - 1 is normal time, 2 is two times slower and so on... */
        PhaserUtils.SlowDownTime = function (game, slowMoCoeff) {
            game.time.slowMotion = slowMoCoeff;
            game.time.desiredFps = 60 * game.time.slowMotion;
        };
        PhaserUtils.SetPoolObjectsParentAndLayer = function (poolToSet, layerToSet) {
            for (var i = 0; i < poolToSet.Size; i++) {
                poolToSet.Pool[i].ParentPool = poolToSet;
                poolToSet.Pool[i].AssignedLayer = layerToSet;
            }
        };
        PhaserUtils.ShowGameVersion = function (game, version) {
            var text = game.add.text(0 + game.camera.width * 0.02, game.camera.height * 0.996, "v" + version, {
                font: "16px Arial",
                fill: "#ffffff"
            });
            text.alpha = 0.6;
            text.anchor.setTo(0, 1);
            text.fixedToCamera = true;
        };
        //Not sure if this will gonna work under WEB_GL renderer
        //Using sprite->RenderTexture conversion and then method getBase64 from RenderTexture
        PhaserUtils.GetBase64ImageFromSprite = function (sprite) {
            return sprite.generateTexture().getBase64();
        };
        /**
         * Used for achieving of the same img dimensions across platforms. Useful when working with player avatars
         */
        PhaserUtils.NormalizeSprite = function (sprite, neededWidth, neededHeight) {
            sprite.scale.set(neededWidth / sprite.width, neededHeight / sprite.height);
        };
        PhaserUtils.GenerateCoinPurchaseParams = function (game, coinPrice, name, iconAtlas, iconKey, silentPurchase) {
            var icon = game.add.image(0, 0, iconAtlas, iconKey);
            var iconBase64Sprite = PhaserUtils.GetBase64ImageFromSprite(icon);
            icon.destroy();
            return {
                coinsCost: coinPrice,
                itemName: name,
                itemImage: iconBase64Sprite,
                silentPurchase: silentPurchase
            };
        };
        PhaserUtils.GenerateGemsPurchaseParams = function (game, gemPrice, name, iconAtlas, iconKey, silentPurchase) {
            var icon = game.add.image(0, 0, iconAtlas, iconKey);
            var iconBase64Sprite = PhaserUtils.GetBase64ImageFromSprite(icon);
            icon.destroy();
            return {
                gemsCost: gemPrice,
                itemName: name,
                itemImage: iconBase64Sprite,
                silentPurchase: silentPurchase
            };
        };
        /** Returns Phaser.Graphics object */
        PhaserUtils.DrawRectangle = function (game, xPos, yPos, width, height, color, alpha) {
            var rect = game.add.graphics(xPos, yPos);
            rect.beginFill(color, alpha);
            rect.drawRect(0, 0, width, height);
            rect.endFill();
            return rect;
        };
        PhaserUtils.DrawCircle = function (game, xPos, yPos, diameter, color, alpha) {
            var circle = game.add.graphics(xPos, yPos);
            circle.beginFill(0xffffff, alpha);
            circle.drawCircle(0, 0, diameter);
            circle.endFill();
            return circle;
        };
        return PhaserUtils;
    }());
    Utils.PhaserUtils = PhaserUtils;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var StringUtils = /** @class */ (function () {
        function StringUtils() {
        }
        StringUtils.AddSpacesToString = function (stringToModify) {
            return stringToModify.replace(/(.{3})/g, " $1");
        };
        StringUtils.RemoveDiacritic