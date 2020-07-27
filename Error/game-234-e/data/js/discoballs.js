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
var DiscoBall;
(function (DiscoBall) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = this;
            // default renderer
            var renderer = Phaser.CANVAS;
            // init game
            //super(screenDims.gameWidth, screenDims.gameHeight, renderer, "content", null /* , transparent, antialias, physicsConfig */);
            _this = _super.call(this, {
                //TODO odkomentovat, predtim to bylo oboji 1
                width: 1,
                height: 1,
                renderer: renderer,
                //parent: "content", //TODO mozna to tam dat
                transparent: false,
                antialias: true,
                physicsConfig: null,
                preserveDrawingBuffer: true
            }) || this;
            Game.game = _this;
            _this.state.add(DiscoBall.StringConstants.STATE_BOOT, DiscoBall.State_boot);
            _this.state.add(DiscoBall.StringConstants.STATE_PRELOAD, DiscoBall.State_preload);
            _this.state.add(DiscoBall.StringConstants.STATE_GAME, DiscoBall.State_game);
            _this.state.start(DiscoBall.StringConstants.STATE_BOOT);
            return _this;
        }
        Game.prototype.onSound = function (on) {
            this.sound.mute = !on;
            App.Global.soundOn = on;
            App.Global.musicOn = on;
            // if (on) {
            //     Utils.AudioUtils.playMusic("Music");
            // } else {
            //     Utils.AudioUtils.stopMusic();
            // }
        };
        return Game;
    }(Phaser.Game));
    DiscoBall.Game = Game;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var GameSettingsHandler = /** @class */ (function () {
        function GameSettingsHandler(game) {
            var gameSettingsJSON = game.cache.getJSON(DiscoBall.StringConstants.JSON_GAMESETTINGS);
            this._levelAddition = gameSettingsJSON.LEVEL_ADDITION;
            this._scoreAddition = gameSettingsJSON.SCORE_ADDITION;
            this._policeCarInfos = gameSettingsJSON.POLICE_CARS;
            this._generatorSettings = gameSettingsJSON.GENERATOR;
        }
        Object.defineProperty(GameSettingsHandler.prototype, "LevelAddition", {
            get: function () {
                return this._levelAddition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameSettingsHandler.prototype, "ScoreAddition", {
            get: function () {
                return this._scoreAddition;
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
        return GameSettingsHandler;
    }());
    DiscoBall.GameSettingsHandler = GameSettingsHandler;
})(DiscoBall || (DiscoBall = {}));
var Gamee;
(function (Gamee_1) {
    var eLoginState;
    (function (eLoginState) {
        eLoginState[eLoginState["WAITING_FOR_CALLBACK"] = 0] = "WAITING_FOR_CALLBACK";
        eLoginState[eLoginState["LOGGED_IN"] = 1] = "LOGGED_IN";
        eLoginState[eLoginState["NOT_LOGGED_IN"] = 2] = "NOT_LOGGED_IN";
    })(eLoginState = Gamee_1.eLoginState || (Gamee_1.eLoginState = {}));
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
            this._videoLoaded = false;
            this._playerDataRequested = false;
            this._socialDataRequested = false;
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
        Object.defineProperty(Gamee.prototype, "Platform", {
            get: function () {
                return this._platform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "SocialData", {
            get: function () {
                return this._socialData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee.prototype, "PlayerData", {
            get: function () {
                return this._playerData;
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
            var soundOn = data.sound;
            if (typeof soundOn === "undefined") {
                soundOn = true;
            }
            this._controller = data.controller;
            this._sound = soundOn;
            if (data.saveState != null && data.saveState.length !== 0) {
                this._saveState = JSON.parse(data.saveState);
                //console.log("gamee - loaded data:");
                //console.log(data.saveState);
            }
            if (data.replayData != null && data.replayData.data != null && data.replayData.data.length !== 0) {
                this._replayData = JSON.parse(data.replayData.data);
            }
            //console.log("*** loading replay data = " + data.replayData.data);
            // if (data.socialData != null && data.socialData.length !== 0) {
            //     this._socialData = JSON.parse(data.socialData);
            // }
            if (data.gameContext === "normal")
                this._gameContext = eGameContext.NORMAL;
            else if (data.gameContext === "battle")
                this._gameContext = eGameContext.BATTLE;
            //TODO test smazat pak
            //this._gameContext = eGameContext.BATTLE;
            // let playerData: IPlayerData = { name: "", highScore: 0, avatar: "_avatars/1.png", userID: "", coins: 5 };
            // this._playerData = playerData;
            //console.log("GAMEEtest: gamee init!!!! jaky je kontext? " + this._gameContext);
            if (data.initData != null && data.initData.length !== 0) {
                this._initData = JSON.parse(data.initData);
                //console.log("GAMEEtest: gamee init!!!! initData nasleduji? ");
                //console.log(this._initData);
            }
            //TODO delete, right now it is just for testing
            //this._gameContext = eGameContext.BATTLE;
            //HINT FOR FUTURE by Jakub:
            // - there is no data.playerData or data.player in this response method in current gamee.js version (2.2.0)
            // So i saved list of capabilities to the private property and check it separately:
            if (this._usedCapabilities.indexOf("socialData") > -1 && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS) {
                this.OnSocialDataObtained = new Phaser.Signal;
                this._socialDataRequested = true;
                this.RequestSocialData();
            }
            else if (this._usedCapabilities.indexOf("playerData") > -1 && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS) {
                this.OnPlayerDataObtained = new Phaser.Signal;
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
                self._game["onSound"](false);
            });
            window.gamee.emitter.addEventListener("unmute", function () {
                //console.log("UNMUTE");
                self._game["onSound"](true);
            });
            window.gamee.emitter.addEventListener("start", function (event) {
                //console.log("RESTART");
                self.onStart(event);
            });
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
                // throw new Error("Game received 'start' event before gameReady() was called!");
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
        // music and sound
        Global.musicOn = true;
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
        var gamee_1 = new Gamee.Gamee("FullScreen", {}, ["saveState", "logEvents", "rewardedAds", "socialData", "share"], function () {
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
    var game = new DiscoBall.Game();
    App.Global.game = game;
    return game;
}
var Base;
(function (Base) {
    var eObjectType;
    (function (eObjectType) {
        eObjectType[eObjectType["ENEMY_BALL"] = 0] = "ENEMY_BALL";
        eObjectType[eObjectType["CRATE"] = 1] = "CRATE";
        eObjectType[eObjectType["POWER_UP"] = 2] = "POWER_UP";
        eObjectType[eObjectType["ANIM"] = 3] = "ANIM";
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
            if (!App.Global.soundOn)
                return;
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
            if (!App.Global.musicOn)
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
    //class used for handling player interaction with his friends in Gamee
    var GameeFriendsManager = /** @class */ (function () {
        function GameeFriendsManager(game) {
            this.OnPlayerAvatarsLoaded = new Phaser.Signal;
            this._defeatedFriends = [];
            this._loadedAvatarsArr = [];
            this._game = game;
        }
        Object.defineProperty(GameeFriendsManager.prototype, "NextFriend", {
            get: function () {
                return this._nextFriend;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameeFriendsManager.prototype, "DefeatedFriends", {
            get: function () {
                return this._defeatedFriends;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * GAMEE JS social data loading
         */
        //we are doing another reload of social data because of poorly implemented gameeJS feature
        //we never know if the avatar is already downloaded, so it is better to call this function again
        GameeFriendsManager.prototype.ReloadSocialData = function () {
            //console.log("GameeTest: GAMEE FRIENDS MANAGER, CALLING REQUEST SOCIAL DATA");
            Gamee.Gamee.instance.OnSocialDataObtained.add(this.parseSocialData, this);
            Gamee.Gamee.instance.RequestSocialData();
        };
        /**
         * Phaser avatars loading
         */
        //TODO change this to private
        GameeFriendsManager.prototype.parseSocialData = function (playerData, socialData) {
            //this._testSocialData = socialData;//todo pak mozno odstranit
            //console.log("GameeTest: GAMEE FRIENDS MANAGER, parsing social data");
            if (playerData.avatar != null && this._loadedAvatarsArr.indexOf(playerData.name) == -1)
                this._game.load.image(playerData.name, playerData.avatar);
            this._reloadAgain = false;
            var numOfAvatarsToLoad = 0;
            for (var i = 0; i < socialData.length; i++) {
                if (socialData[i].avatar != null && this._loadedAvatarsArr.indexOf(socialData[i].name) == -1) {
                    this._game.load.image(socialData[i].name, socialData[i].avatar);
                    numOfAvatarsToLoad++;
                    if (numOfAvatarsToLoad >= DiscoBall.GameOptions.MAX_AVATARS_IN_ONE_LOAD)
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
        GameeFriendsManager.prototype.fileLoadComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            if (success)
                this._loadedAvatarsArr.push(cacheKey);
            else
                this._reloadAgain = true;
            //console.log("GameeTest: GAMEE FRIENDS MANAGER, avatar louded: " + cacheKey + ", is it succes? " + success);
            //console.log("fukin avatar louded: " + cacheKey);
        };
        GameeFriendsManager.prototype.loadQueueComplete = function () {
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
        GameeFriendsManager.prototype.Reset = function () {
            this._defeatedFriends = [];
        };
        GameeFriendsManager.prototype.AddCurrentFriendToDefeated = function () {
            if (this._nextFriend != null) {
                //console.log("GameeTest: GAMEE FRIENDS MANAGER, friend defeated: " + this._nextFriend.name);
                this._defeatedFriends.push(this._nextFriend.name);
                if (this._defeatedFriends.length > DiscoBall.GameOptions.MAX_DEFEATED_FRIENDS)
                    this._defeatedFriends.shift();
            }
        };
        GameeFriendsManager.prototype.GetNextFriend = function (currentPlayerScore) {
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
        return GameeFriendsManager;
    }());
    Base.GameeFriendsManager = GameeFriendsManager;
})(Base || (Base = {}));
var Base;
(function (Base) {
    /** This class is used for playing screen-based movie sequences in game */
    var MovieManager = /** @class */ (function () {
        function MovieManager(game, screens, immediateStart) {
            this.OnMovieEndedSignal = new Phaser.Signal();
            this.SCREEN_DURATION = 3000; //duration of one screen in miliseconds
            this.TRANSITION_DURATION = 1500;
            this.EASING_TYPE = Phaser.Easing.Exponential.Out;
            this._inTransition = false;
            this._game = game;
            this._movieScreens = screens;
            this._currentIndex = 0;
            if (immediateStart)
                this.StartMovie();
        }
        MovieManager.prototype.StartMovie = function () {
            //first screen fade in
            this._inTransition = true;
            this._movieScreens[this._currentIndex].createScreen();
            this._game.camera.flash(0x000000, 2000);
            this._game.camera.onFlashComplete.add(this.currentScreenShown, this);
        };
        //TODO later - create camera transitions for another directions
        MovieManager.prototype.OnScreenClick = function () {
            if (this._inTransition)
                return;
            this._inTransition = true;
            var isLastIndex = this._currentIndex >= this._movieScreens.length - 1;
            if (this._movieScreens[this._currentIndex].NextScreenTransition == Base.eNextScreenTransition.UP)
                this.doTheTransition({ y: this._game.height }, isLastIndex);
            else if (this._movieScreens[this._currentIndex].NextScreenTransition == Base.eNextScreenTransition.DOWN)
                this.doTheTransition({ y: -this._game.height }, isLastIndex);
            else if (this._movieScreens[this._currentIndex].NextScreenTransition == Base.eNextScreenTransition.RIGHT)
                this.doTheTransition({ x: -this._game.width }, isLastIndex);
            else if (this._movieScreens[this._currentIndex].NextScreenTransition == Base.eNextScreenTransition.LEFT)
                this.doTheTransition({ x: this._game.width }, isLastIndex);
            else //NONE
                this.currentScreenShown();
            this._currentIndex++;
        };
        MovieManager.prototype.currentScreenShown = function () {
            this._movieScreens[this._currentIndex].onScreenShown();
            //TODO add timer!!
            this._inTransition = false;
            if (this._currentIndex == 0) {
                this._game.camera.onFlashComplete.remove(this.currentScreenShown, this);
            }
            if (this._currentIndex + 1 < this._movieScreens.length) {
                //create next screen in advance
                this._movieScreens[this._currentIndex + 1].createScreen();
            }
            else {
                //TODO end this shit
            }
        };
        MovieManager.prototype.doTheTransition = function (transitionProps, lastScreen) {
            if (this._movieScreens[this._currentIndex].MoveDownOnTransition)
                this._game.world.moveDown(this._movieScreens[this._currentIndex]);
            var indexToHide = this._currentIndex;
            this._game.add.tween(this._movieScreens[this._currentIndex])
                .to(transitionProps, this.TRANSITION_DURATION, this.EASING_TYPE, true)
                .onComplete.add(function () { this._movieScreens[indexToHide].onScreenHide(); }, this);
            if (!lastScreen) {
                this._game.add.tween(this._movieScreens[this._currentIndex + 1])
                    .to(transitionProps, this.TRANSITION_DURATION, this.EASING_TYPE, true)
                    .onComplete.add(this.currentScreenShown, this);
            }
            else {
                this.tweenLastScreenAlpha();
            }
        };
        MovieManager.prototype.tweenLastScreenAlpha = function () {
            this._game.add.tween(this._movieScreens[this._currentIndex])
                .to({ alpha: 0 }, this.TRANSITION_DURATION, this.EASING_TYPE, true)
                .onComplete.add(function () { this.OnMovieEndedSignal.dispatch(); }, this);
        };
        return MovieManager;
    }());
    Base.MovieManager = MovieManager;
})(Base || (Base = {}));
var Base;
(function (Base) {
    var eNextScreenTransition;
    (function (eNextScreenTransition) {
        eNextScreenTransition[eNextScreenTransition["NONE"] = 0] = "NONE";
        eNextScreenTransition[eNextScreenTransition["LEFT"] = 1] = "LEFT";
        eNextScreenTransition[eNextScreenTransition["RIGHT"] = 2] = "RIGHT";
        eNextScreenTransition[eNextScreenTransition["UP"] = 3] = "UP";
        eNextScreenTransition[eNextScreenTransition["DOWN"] = 4] = "DOWN";
    })(eNextScreenTransition = Base.eNextScreenTransition || (Base.eNextScreenTransition = {}));
    ;
    var MovieScreen = /** @class */ (function (_super) {
        __extends(MovieScreen, _super);
        function MovieScreen(game) {
            var _this = _super.call(this, game) || this;
            _this.NextScreenTransition = eNextScreenTransition.NONE;
            _this.MoveDownOnTransition = false;
            return _this;
        }
        return MovieScreen;
    }(Phaser.Group));
    Base.MovieScreen = MovieScreen;
})(Base || (Base = {}));
var Base;
(function (Base) {
    var OneShotAnimInstantiator = /** @class */ (function () {
        function OneShotAnimInstantiator(game, assignedLayer) {
            this.NUM_OF_ANIMS_EXPLOSION = 7;
            this._explosionsPool = new Base.Pool(Base.Animation, this.NUM_OF_ANIMS_EXPLOSION, function () {
                return new Base.Animation(game, 0, 0, DiscoBall.StringConstants.SPRITESHEET_EXPLOSION, 'explosion', Base.eObjectType.ANIM, 15);
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
            this._game = game;
            this._smokeParticleEmmiter = new Phaser.Particles.Arcade.Emitter(this._game, 0, 0, 50);
            this._smokeParticleEmmiter.makeParticles(DiscoBall.StringConstants.PARTICLE_BALL);
            // this._smokeParticleEmmiter.gravity = new Phaser.Point(0,0);
            this._smokeParticleEmmiter.setScale(2, 0, 2, 0, 2500);
            this._smokeParticleEmmiter.setAlpha(0.4, 0, 2500);
            this._smokeParticleEmmiter.setXSpeed(-500, 500);
            this._smokeParticleEmmiter.setYSpeed(-500, -100);
            this._smokeParticleEmmiter.gravity = new Phaser.Point(this._game.rnd.integerInRange(-400, 400), this._game.rnd.integerInRange(-1200, -1600));
            //this._particleEmmiter.position = this.position;
            // this._smokeParticleEmmiter.setScale(1, 0, 1, 0,2000);
            // this._smokeParticleEmmiter.setAlpha(1, 0, 2000);
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
        ParticleEmmiter.prototype.StartSmokeEmit = function () {
            this._smokeParticleEmmiter.on = true;
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
        ParticleEmmiter.prototype.EmitParticles = function (x, y, numOfEmmitedParticles) {
            this._smokeParticleEmmiter.x = x;
            this._smokeParticleEmmiter.y = y;
            this._smokeParticleEmmiter.start(true, 2500, null, numOfEmmitedParticles);
            //this._particleEmmiter.visible = false
            // let sss = this._game.add.sprite(x, y, this._renderTexture);
            // sss.anchor.set(0.5);
            // sss.x = this._game.width/2;
            // sss.y = this._game.height/2;
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
            if (this._pool.length > 0)
                return this._pool.shift();
            else if (this._canGrow) {
                console.log("Trying to get new item from the pool, but pool is empty. Pool is growing.");
                return this.newItem();
            }
            console.log("Trying to get new item from the pool, but pool is empty. Returning null");
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
var DiscoBall;
(function (DiscoBall) {
    var Crate = /** @class */ (function (_super) {
        __extends(Crate, _super);
        function Crate(game, crateName) {
            var _this = _super.call(this, game, 0, 0, Base.eObjectType.CRATE) || this;
            _this._mainCrateImg = null;
            _this._moveTween = null;
            _this.createTheRestOfCrate(crateName);
            _this.anchor.set(0.5);
            //physics
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            //compute size for physics body
            var widthDiff = (_this._mainCrateImg.width / _this.width) * 0.85;
            var heightDiff = (_this._mainCrateImg.height / _this.height) * 0.85;
            Utils.PhaserUtils.ChangePhysicsBodySizeRect(_this, widthDiff, heightDiff); //TODO body asi bude potreba delat pro kazdou vec zvlast
            //this.body.collideWorldBounds = true; //TODO mozna to bude delat problemy pri pohybu kamery?
            //this.body.immovable = true;
            _this.initText(crateName);
            //this._numberText = this.game.add.text(0,0,"0", { font: "bold 50px Arial", fill: "#000"});
            // this._numberText.anchor.set(0.5);
            // this.addChild(this._numberText);
            _this.kill();
            return _this;
        }
        Object.defineProperty(Crate.prototype, "Number", {
            get: function () {
                return this._number;
            },
            set: function (value) {
                this._number = value;
                this.setNumberText(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Crate.prototype, "CrateWidth", {
            get: function () {
                return this._mainCrateImg.width;
            },
            enumerable: true,
            configurable: true
        });
        Crate.prototype.createTheRestOfCrate = function (crateName) {
            if (crateName == "crate_1") {
                var effect = this.game.add.sprite(0, 0, DiscoBall.StringConstants.ATLAS_CRATES, crateName + "_2");
                effect.anchor.set(0.5, 1.1);
                this.addChild(effect);
            }
            else if (crateName == "crate_4") {
                var effect = this.game.add.sprite(0, 0, DiscoBall.StringConstants.ATLAS_CRATES, crateName + "_2");
                effect.anchor.set(0.5, 0.68);
                this.addChild(effect);
            }
            else if (crateName == "crate_7") {
                var effect = this.game.add.sprite(0, 0, DiscoBall.StringConstants.ATLAS_CRATES, crateName + "_2");
                effect.anchor.set(0.5, 0.67);
                this.addChild(effect);
            }
            else if (crateName == "crate_10") {
                var effect = this.game.add.sprite(0, 0, DiscoBall.StringConstants.ATLAS_CRATES, crateName + "_2");
                effect.anchor.set(0.5, 0.68);
                this.addChild(effect);
            }
            else if (crateName == "crate_15") {
                var effect = this.game.add.sprite(0, 0, DiscoBall.StringConstants.ATLAS_CRATES, crateName + "_2");
                effect.anchor.set(0.5, 0.64);
                this.addChild(effect);
            }
            this._mainCrateImg = this.game.add.sprite(0, 0, DiscoBall.StringConstants.ATLAS_CRATES, crateName + "_1");
            this._mainCrateImg.anchor.set(0.5);
            this.addChild(this._mainCrateImg);
        };
        Crate.prototype.initText = function (crateName) {
            //this._numberText = this.game.add.text(0,0,"0", { font: "bold 50px Arial", fill: "#000"});
            this._numberText = this.game.add.bitmapText(0, 0, DiscoBall.StringConstants.FONT_MAINFONT, "0", 50);
            this._numberText.anchor.set(0.5);
            if (crateName === "crate_1")
                this._numberText.tint = 0x2500ff;
            else if (crateName === "crate_2")
                this._numberText.tint = 0x2820ff;
            else if (crateName === "crate_3")
                this._numberText.tint = 0xa52f00;
            else if (crateName === "crate_4")
                this._numberText.tint = 0x008aa9;
            else if (crateName === "crate_5")
                this._numberText.tint = 0x880062;
            else if (crateName === "crate_7")
                this._numberText.tint = 0xef3c00;
            else if (crateName === "crate_10")
                this._numberText.tint = 0xacc6ff;
            else if (crateName === "crate_15")
                this._numberText.tint = 0xa12904;
            this.addChild(this._numberText);
        };
        Crate.prototype.setNumberText = function (num) {
            this._numberText.text = num.toString();
        };
        Crate.prototype.IsTweening = function () {
            return this._moveTween == null ? false : true;
        };
        Crate.prototype.PauseTween = function () {
            this._moveTween.pause();
        };
        Crate.prototype.ResumeTween = function () {
            this._moveTween.resume();
        };
        Crate.prototype.SetMoveTween = function (endPosition, duration) {
            this._moveTween = this.game.add.tween(this).to({ x: endPosition }, duration, Phaser.Easing.Linear.None, true, 0, -1, true);
            this._moveTween.frameBased = true;
        };
        Crate.prototype.KillObjectAndRemoveFromScene = function () {
            if (this._moveTween != null) {
                this._moveTween.stop();
                this._moveTween = null;
            }
            _super.prototype.KillObjectAndRemoveFromScene.call(this);
        };
        /** DEBUG */
        Crate.prototype.DebugBody = function () {
            this.game.debug.body(this);
        };
        return Crate;
    }(Base.SceneObject));
    DiscoBall.Crate = Crate;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var EnemyBall = /** @class */ (function (_super) {
        __extends(EnemyBall, _super);
        function EnemyBall(game) {
            var _this = 
            //TODO tady bude random generator spritu
            _super.call(this, game, 0, 0, Base.eObjectType.ENEMY_BALL, DiscoBall.StringConstants.SPRITE_BALL_ENEMY) || this;
            _this.IsLeader = false;
            _this._stackedXPos = [];
            _this._scaleTween = null;
            _this._playPosFromArray = false;
            _this.anchor.set(0.5);
            //physics
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            Utils.PhaserUtils.ChangePhysicsBodySizeCircle(_this, _this.width * 0.37);
            return _this;
            // let ballAdd = this.game.add.sprite(0,0,StringConstants.SPRITE_BALL_ENEMY_ADDITION);
            // ballAdd.anchor.set(0.5);
            // this.addChild(ballAdd);
            //UNCOMMENT WHEN DEBUG TEXT IS NEEDED
            // this._debugNumText = this.game.add.text(0,0,"5", { font: "bold 420px Arial", fill: "#ffffff"});
            // this._debugNumText.anchor.set(0.5);
            // this.addChild(this._debugNumText);
        }
        Object.defineProperty(EnemyBall.prototype, "Zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnemyBall.prototype, "StartMoveNum", {
            get: function () {
                return this._startMoveNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnemyBall.prototype, "StackedXPos", {
            get: function () {
                return this._stackedXPos;
            },
            set: function (value) {
                this._stackedXPos = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnemyBall.prototype, "DistanceToPlayer", {
            get: function () {
                return this._distanceToPlayer;
            },
            enumerable: true,
            configurable: true
        });
        //Used only by leader enemy ball
        EnemyBall.prototype.FollowPlayer = function (player, speed) {
            //p2 physics implementation
            //let angle: number = Math.atan2(player.y - this.y, player.x - this.x) + 1.57079633;
            //this.body.rotation = angle + 1.57079633;
            //this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
            // this.body.moveForward(speed);
            //console.log("kokos");
            //arcade physics
            this.game.physics.arcade.moveToObject(this, player, speed);
            this._distanceToPlayer = this.game.physics.arcade.distanceBetween(this, player);
            //new implementation
            //let rotation: number = Math.atan2(player.y - this.y, player.x - this.x);
            //this.game.physics.arcade.velocityFromRotation(rotation, speed, this.body.velocity);
        };
        EnemyBall.prototype.SetZone = function (num) {
            this._zone = num;
            this._startMoveNum = this._zone * DiscoBall.GameOptions.FOLLOWER_BALLS_DELAY;
            //this._debugNumText.text = num.toString();
        };
        EnemyBall.prototype.SpawnObject = function (posX, posY) {
            _super.prototype.SpawnObject.call(this, posX, posY);
            this._distanceToPlayer = 5000;
            // this._debugNumText.position.x = posX;
            // this._debugNumText.position.y = posY;
            this.IsLeader = false;
            this._playPosFromArray = false;
            this._stackedXPos = [];
            //this._framesFromStart = 0;
            // this._scaleTween = this.game.add.tween(this.scale).to({x: 0.12, y: 0.12}, 500, Phaser.Easing.Bounce.Out, true, 
            //     this.game.rnd.integerInRange(300, 1000), -1, true);
        };
        EnemyBall.prototype.KillObjectAndRemoveFromScene = function () {
            //this._scaleTween.stop();
            //this._distanceToPlayer = 5000;
            _super.prototype.KillObjectAndRemoveFromScene.call(this);
        };
        /** DEBUG */
        EnemyBall.prototype.DebugBody = function () {
            this.game.debug.body(this);
        };
        return EnemyBall;
    }(Base.SceneObject));
    DiscoBall.EnemyBall = EnemyBall;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var NextLevelLine = /** @class */ (function (_super) {
        __extends(NextLevelLine, _super);
        function NextLevelLine(game, layer) {
            var _this = _super.call(this, game, DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, -50, DiscoBall.StringConstants.SPRITE_LINE) || this;
            _this.anchor.setTo(0.5);
            _this._lineText = game.add.bitmapText(0, -_this.game.height * .03, DiscoBall.StringConstants.FONT_UI, "", 32);
            _this._lineText.tint = 0x62fb00;
            _this._lineText.anchor.set(0.5);
            _this._lineText.scale.set(0.2, 0.2);
            _this._lineText.alpha = 0.3;
            _this._lineText.visible = false;
            _this.addChild(_this._lineText);
            layer.add(_this);
            return _this;
        }
        //This is called when you dont see the line
        NextLevelLine.prototype.SetLine = function (y, levelNum, scoreAdd) {
            //console.log("GAMEEtest: setting next level line on " + y);
            this.y = y;
            this._lineText.setText("level " + levelNum + " +" + scoreAdd);
            this._lineText.alpha = 0.3;
            this._lineText.scale.set(0.2, 0.2);
            this._lineText.visible = false;
        };
        NextLevelLine.prototype.ShowLineText = function () {
            this._lineText.visible = true;
            this.game.add.tween(this._lineText).to({ "alpha": 1 }, 200, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._lineText.scale).to({ "x": 1, "y": 1 }, 200, Phaser.Easing.Linear.None, true);
        };
        return NextLevelLine;
    }(Phaser.Sprite));
    DiscoBall.NextLevelLine = NextLevelLine;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var ObjectGenerator = /** @class */ (function () {
        //array used with weighted pick - earlier elements are picked up with bigger probability
        // private _availablePowerUps: ePowerUpType[] = [ePowerUpType.MONEY, ePowerUpType.NITRO, ePowerUpType.SHIELD, ePowerUpType.EXTRA_LIFE];
        // //private _availablePowerUps: ePowerUpType[] = [ePowerUpType.MONEY];
        // private _availableBgs: string[] = [DiscoBall.StringConstants.SPRITE_STREET_LIGHT_BLUE, DiscoBall.StringConstants.SPRITE_STREET_LIGHT_YELLOW];
        function ObjectGenerator(game, gameSettingsHandler, assignedLayer, bgLayer) {
            this._cratesPositions = [];
            this._crateOffsetToGenerate = 50;
            this._availableLowerNumbers = [1, 2, 3, 4, 5, 7, 10];
            this._availableHighNumbers = [5, 7, 10, 15];
            this._game = game;
            this._gameSettingsHandler = gameSettingsHandler;
            this._assignedLayer = assignedLayer;
            this._bgLayer = bgLayer;
            this._enemyBallsPool = new Base.Pool(DiscoBall.EnemyBall, 100, function () {
                return new DiscoBall.EnemyBall(this._game);
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._enemyBallsPool, this._assignedLayer);
            this.initItemsID(this._enemyBallsPool.Pool, 0);
            // this._cratesPool = new Base.Pool<Crate>(Crate, 20, function () {
            //   return new Crate(this._game, "crate_10");
            // }.bind(this));
            // Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._cratesPool, this._assignedLayer);
            this.createCratePool("crate_1", 12);
            this.createCratePool("crate_2", 12);
            this.createCratePool("crate_3", 12);
            this.createCratePool("crate_4", 12);
            this.createCratePool("crate_5", 12);
            this.createCratePool("crate_7", 12);
            this.createCratePool("crate_10", 12);
            this.createCratePool("crate_15", 12);
            this._crateWidth = this._crate1Pool.Pool[0].CrateWidth;
            var oneCrateWidth = this._game.width / 6;
            for (var i = 0; i < 6; i++) {
                this._cratesPositions.push(oneCrateWidth / 2 + i * oneCrateWidth);
            }
            this._speedUpPowerUpPool = new Base.Pool(DiscoBall.PowerUp, 7, function () {
                return new DiscoBall.PowerUp(this._game, DiscoBall.ePowerUpType.SPEEDUP, DiscoBall.StringConstants.SPRITESHEET_SPEEDUP, 0);
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._speedUpPowerUpPool, this._bgLayer);
            this._starPool = new Base.Pool(DiscoBall.PowerUp, 7, function () {
                return new DiscoBall.PowerUp(this._game, DiscoBall.ePowerUpType.STAR, DiscoBall.StringConstants.SPRITE_NOTE_COLLECTIBLE);
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(this._starPool, this._bgLayer);
            this.precomputeConstants();
        }
        Object.defineProperty(ObjectGenerator.prototype, "EnemyBallsPool", {
            get: function () {
                return this._enemyBallsPool;
            },
            enumerable: true,
            configurable: true
        });
        ObjectGenerator.prototype.GenerateItemRow = function () {
            if (this._game.rnd.realInRange(0, 1) > DiscoBall.GameOptions.CRATE_MOVEMENT_PROB) {
                return this.generateStaticRow();
            }
            else
                return this.generateMovingRow();
            //return this.generateMovingRow();
        };
        ObjectGenerator.prototype.createCratePool = function (crateName, numOfElements) {
            var cratePool = new Base.Pool(DiscoBall.Crate, numOfElements, function () {
                return new DiscoBall.Crate(this._game, crateName);
            }.bind(this));
            Utils.PhaserUtils.SetPoolObjectsParentAndLayer(cratePool, this._assignedLayer);
            if (crateName === "crate_1")
                this._crate1Pool = cratePool;
            else if (crateName === "crate_2")
                this._crate2Pool = cratePool;
            else if (crateName === "crate_3")
                this._crate3Pool = cratePool;
            else if (crateName === "crate_4")
                this._crate4Pool = cratePool;
            else if (crateName === "crate_5")
                this._crate5Pool = cratePool;
            else if (crateName === "crate_7")
                this._crate7Pool = cratePool;
            else if (crateName === "crate_10")
                this._crate10Pool = cratePool;
            else if (crateName === "crate_15")
                this._crate15Pool = cratePool;
        };
        ObjectGenerator.prototype.generateStaticRow = function () {
            // console.log("faking static row, stars arr: " + this._starPool.Pool.length);
            // console.log("faking static row, speedup arr: " + this._speedUpPowerUpPool.Pool.length);
            var availablePositions = [0, 1, 2, 3, 4, 5];
            var numOfCrates = this._game.rnd.weightedPick([3, 4, 2, 1]);
            var crates = [];
            var powerUps = [];
            var generateSpeedup = this._game.rnd.realInRange(0, 1) <= DiscoBall.GameOptions.SPEEDUP_PROB;
            //let generateSpeedup: boolean = true;
            var generateStar = this._game.rnd.realInRange(0, 1) <= DiscoBall.GameOptions.STAR_PROB;
            for (var i = 0; i < numOfCrates; i++) {
                var indexToAP = this._game.rnd.integerInRange(0, availablePositions.length - 1);
                var posIndex = availablePositions[indexToAP];
                var crateNum = this.rateTheCrate(numOfCrates);
                Utils.ArrayUtils.OneItemSplice(availablePositions, indexToAP);
                //let arrIndex = availablePositions.splice(this._game.rnd.integerInRange(0,availablePositions.length-1), 1)[0];
                //let crate: Crate = this._cratesPool.GetFirstAvailable();
                var crate = this.getCorrespondingCrate(crateNum);
                if (crate != null) {
                    crate.Number = crateNum;
                    crate.SpawnObject(this._cratesPositions[posIndex], this._game.camera.y - this._crateOffsetToGenerate);
                    crates.push(crate);
                }
            }
            if (generateStar) {
                var indexToAP = this._game.rnd.integerInRange(0, availablePositions.length - 1);
                var posIndex = availablePositions[indexToAP];
                Utils.ArrayUtils.OneItemSplice(availablePositions, indexToAP);
                var star = this._starPool.GetFirstAvailable();
                //let arrIndex = availablePositions.splice(this._game.rnd.integerInRange(0,availablePositions.length-1), 1)[0];
                if (star != null) {
                    star.SpawnObject(this._cratesPositions[posIndex], this._game.camera.y - this._crateOffsetToGenerate);
                    powerUps.push(star);
                }
            }
            if (generateSpeedup && availablePositions.length > 0) {
                var indexToAP = this._game.rnd.integerInRange(0, availablePositions.length - 1);
                var posIndex = availablePositions[indexToAP];
                Utils.ArrayUtils.OneItemSplice(availablePositions, indexToAP);
                var speedUp = this._speedUpPowerUpPool.GetFirstAvailable();
                //let arrIndex = availablePositions.splice(this._game.rnd.integerInRange(0,availablePositions.length-1), 1)[0];
                if (speedUp != null) {
                    speedUp.SpawnObject(this._cratesPositions[posIndex], this._game.camera.y - this._crateOffsetToGenerate);
                    powerUps.push(speedUp);
                }
            }
            return {
                Crates: crates,
                PowerUps: powerUps,
                SpeedUpGenerated: generateSpeedup
            };
        };
        ObjectGenerator.prototype.generateMovingRow = function () {
            var crates = [];
            var powerUps = [];
            if (this._game.rnd.realInRange(0, 1) > 0.5) {
                var crateOneNum = this.rateTheCrate(2);
                var crateTwoNum = this.rateTheCrate(2);
                //two crates moving from center to the middle (or reverse)
                // let crateOne: Crate = this._cratesPool.GetFirstAvailable();
                // let crateTwo: Crate = this._cratesPool.GetFirstAvailable();
                var crateOne = this.getCorrespondingCrate(crateOneNum);
                var crateTwo = this.getCorrespondingCrate(crateTwoNum);
                //let fromTheCenter: boolean = this._game.rnd.realInRange(0,1) > 0.5;
                var fromTheCenter = false;
                if (crateOne != null) {
                    crateOne.Number = crateOneNum;
                    crateOne.SpawnObject(fromTheCenter ? this._centerLeftCratePos : this._leftCratePos, this._game.camera.y - this._crateOffsetToGenerate);
                    crateOne.SetMoveTween(fromTheCenter ? this._leftCratePos : this._centerLeftCratePos, DiscoBall.GameOptions.CRATE_MOVEMENT_DURATION * 0.5);
                    crates.push(crateOne);
                }
                if (crateTwo != null) {
                    crateTwo.Number = crateTwoNum;
                    crateTwo.SpawnObject(fromTheCenter ? this._centerRightCratePos : this._rightCratePos, this._game.camera.y - this._crateOffsetToGenerate);
                    crateTwo.SetMoveTween(fromTheCenter ? this._rightCratePos : this._centerRightCratePos, DiscoBall.GameOptions.CRATE_MOVEMENT_DURATION * 0.5);
                    crates.push(crateTwo);
                }
            }
            else {
                //one crate moving from left to right
                var crateNum = this.rateTheCrate(1);
                //let crate: Crate = this._cratesPool.GetFirstAvailable();
                var crate = this.getCorrespondingCrate(crateNum);
                var fromLeft = this._game.rnd.realInRange(0, 1) > 0.5;
                if (crate != null) {
                    crate.Number = crateNum;
                    crate.SpawnObject(fromLeft ? this._leftCratePos : this._rightCratePos, this._game.camera.y - this._crateOffsetToGenerate);
                    crate.SetMoveTween(fromLeft ? this._rightCratePos : this._leftCratePos, DiscoBall.GameOptions.CRATE_MOVEMENT_DURATION);
                    crates.push(crate);
                }
            }
            return {
                Crates: crates,
                PowerUps: powerUps,
                SpeedUpGenerated: false
            };
        };
        ObjectGenerator.prototype.getCorrespondingCrate = function (crateNum) {
            if (crateNum === 1)
                return this._crate1Pool.GetFirstAvailable();
            else if (crateNum === 2)
                return this._crate2Pool.GetFirstAvailable();
            else if (crateNum === 3)
                return this._crate3Pool.GetFirstAvailable();
            else if (crateNum === 4)
                return this._crate4Pool.GetFirstAvailable();
            else if (crateNum === 5)
                return this._crate5Pool.GetFirstAvailable();
            else if (crateNum === 7)
                return this._crate7Pool.GetFirstAvailable();
            else if (crateNum === 10)
                return this._crate10Pool.GetFirstAvailable();
            else if (crateNum === 15)
                return this._crate15Pool.GetFirstAvailable();
            return null;
        };
        ObjectGenerator.prototype.rateTheCrate = function (numOfCratesInRow) {
            if (numOfCratesInRow > 2)
                return this._game.rnd.pick(this._availableLowerNumbers);
            else
                return this._game.rnd.pick(this._availableHighNumbers);
            // switch(numOfCratesInRow) {
            //   case 1: return this._game.rnd.integerInRange(8,14);
            //   case 2: return this._game.rnd.integerInRange(7,10);
            //   case 3: return this._game.rnd.integerInRange(4,7);
            //   case 4: return this._game.rnd.integerInRange(1,4);
            //   default: 3;
            // }
        };
        //Generate pyramid-like shape on start
        ObjectGenerator.prototype.GenerateBallsOnStart = function () {
            //console.log("BALLS HAS BEEN GENERATED, pool len " + this._enemyBallsPool.Pool.length);
            var balls = [];
            //let firstBall: EnemyBall = this.SpawnBall(this._game.width/2, this._game.camera.y + this._game.height * 1.1);
            var firstBall = this._enemyBallsPool.GetFirstAvailable();
            firstBall.SpawnObject(this._game.width / 2, this._game.camera.y + this._game.height * 1.1);
            this.BallWidth = firstBall.width * .6;
            balls.push(firstBall);
            //console.log("Ball width: " + this.BallWidth);
            //DEBUG purposes
            // let secondBall: EnemyBall = this._enemyBallsPool.GetFirstAvailable();
            // secondBall.SpawnObject(firstBall.x + this.BallWidth, this._game.camera.y + this._game.height * 0.6);
            // balls.push(secondBall);
            for (var i = 1; i <= 11; i++) {
                //second row
                if (i === 1)
                    balls = balls.concat(this.SpawnBallsRow(firstBall.x, firstBall.y, this.BallWidth, this.BallWidth, 3));
                //rows 3 and 4
                else if (i > 1 && i < 4)
                    balls = balls.concat(this.SpawnBallsRow(firstBall.x, firstBall.y, this.BallWidth * 1.5, i * this.BallWidth, 4));
                //rows 5 and 6
                else if (i > 3 && i < 6)
                    balls = balls.concat(this.SpawnBallsRow(firstBall.x, firstBall.y, this.BallWidth * 2, i * this.BallWidth, 5));
                //rows 7 and 8 and 9
                else if (i > 5 && i < 9)
                    balls = balls.concat(this.SpawnBallsRow(firstBall.x, firstBall.y, this.BallWidth * 2.5, i * this.BallWidth, 6));
                //the rest
                else
                    balls = balls.concat(this.SpawnBallsRow(firstBall.x, firstBall.y, this.BallWidth * 3, i * this.BallWidth, 7));
            }
            return balls;
        };
        ObjectGenerator.prototype.precomputeConstants = function () {
            this._leftCratePos = this._crateWidth / 2;
            this._rightCratePos = this._game.width - this._crateWidth / 2;
            this._centerLeftCratePos = DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH - this._crateWidth / 2;
            this._centerRightCratePos = DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH + this._crateWidth / 2;
        };
        /**
         * This is used for last row generation out of the screen bounds
         * @param lastRowArr array of currently last row
         */
        ObjectGenerator.prototype.GenerateLastBallsRow = function (lastRowArr) {
            // console.log("BALLS ADD: TOTAL BALLS BEFORE: " + totalBalls);
            // console.log("BALLS ADD: HOW MANY BALLS IN LAST ARRAY? " + lastRowArr.length);
            var balls = [];
            var mostLeftX = Infinity;
            var mostRightX = -Infinity;
            lastRowArr.forEach(function (element) {
                if (element.x < mostLeftX) {
                    mostLeftX = element.x;
                }
                if (element.x > mostRightX) {
                    mostRightX = element.x;
                }
            });
            //let i: number = 1;
            var startPos;
            if (lastRowArr.length > 0) {
                //console.log("ano! prvni if!!!");
                startPos = new Phaser.Point(mostLeftX + (mostRightX - mostLeftX) * 0.5, lastRowArr[0].centerY);
            }
            //else startPos = new Phaser.Point(this._game.width/2, this._game.camera.y + this._game.height);
            else
                startPos = new Phaser.Point(DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y + this._game.height);
            var numOfBalls = Math.min(lastRowArr.length + 1, 7);
            balls = balls.concat(this.SpawnBallsRow(startPos.x, startPos.y, this.BallWidth * ((numOfBalls - 1) * 0.5), this.BallWidth * .9, numOfBalls));
            return balls;
        };
        /*
         * First ball means first ball on the top of pyramid
         */
        ObjectGenerator.prototype.SpawnBallsRow = function (firstBallX, firstBallY, xOffset, yOffset, numOfBalls) {
            var balls = [];
            var startPos = new Phaser.Point(firstBallX - xOffset, firstBallY + yOffset);
            //console.log("spawning balls row. start Y is " + firstBallY + " and offset is " + yOffset);
            for (var j = 0; j < numOfBalls; j++) {
                var newBall = this._enemyBallsPool.GetFirstAvailable();
                if (newBall != null) {
                    newBall.SpawnObject(startPos.x + this.BallWidth * j, startPos.y);
                    balls.push(newBall);
                }
                else
                    console.log("Getting ball and it is null!!!");
            }
            return balls;
        };
        ObjectGenerator.prototype.getRandomScreenWidthNum = function () {
            //console.log("game width? " + this._game.width);
            return this._game.rnd.realInRange(0, this._game.width);
        };
        ObjectGenerator.prototype.getRandomScreenHeightNum = function () {
            //console.log("game height? " + this._game.height);
            return this._game.rnd.realInRange(0, this._game.height);
        };
        ObjectGenerator.prototype.initItemsID = function (pool, startIndex) {
            for (var i = 0; i < pool.length; i++) {
                pool[i].ObjectID = i + startIndex;
            }
        };
        ObjectGenerator.prototype.ResetGenerator = function () {
        };
        return ObjectGenerator;
    }());
    DiscoBall.ObjectGenerator = ObjectGenerator;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var PlayerBall = /** @class */ (function (_super) {
        __extends(PlayerBall, _super);
        function PlayerBall(game, posX, posY, groupToAssign) {
            var _this = _super.call(this, game, posX, posY) || this;
            _this.OnShockwaveEnd = new Phaser.Signal();
            _this._speedboostEvent = null;
            _this._speedboostApplied = false;
            _this._doingShockwave = false;
            _this._afterCrash = false;
            _this._blinkingEvent = null;
            _this._numOfBlinks = 0;
            _this._speedToReturnTo = 0;
            //super(game, posX, posY, StringConstants.SPRITE_BALL_PLAYER, 0);
            var shadow = _this.game.add.sprite(0, 0, DiscoBall.StringConstants.SPRITE_BALL_PLAYER_SHADOW);
            shadow.anchor.set(0.5, 0.3);
            _this.addChild(shadow);
            _this.anchor.set(0.5);
            _this._mainSprite = _this.game.add.sprite(0, 0, DiscoBall.StringConstants.SPRITE_BALL_PLAYER, 0);
            _this._mainSprite.anchor.set(0.5);
            _this.addChild(_this._mainSprite);
            //arcade physics
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            Utils.PhaserUtils.ChangePhysicsBodySizeCircle(_this, (_this._mainSprite.width / 2) * .47);
            _this._mainSprite.animations.add("discoBallAnim", undefined, 42, true);
            _this._mainSprite.animations.play("discoBallAnim");
            _this._shockwaveCircle = _this.game.add.sprite(posX, posY, DiscoBall.StringConstants.SPRITE_SHOCKWAVE_CIRCLE, undefined, groupToAssign);
            _this._shockwaveCircle.anchor.set(0.5);
            _this.game.physics.enable(_this._shockwaveCircle, Phaser.Physics.ARCADE);
            Utils.PhaserUtils.ChangePhysicsBodySizeCircle(_this._shockwaveCircle, (_this._shockwaveCircle.width / 2) * .9);
            _this._shockwaveCircle.scale.set(0);
            _this._deathsheet = _this.game.add.sprite(0, 0, DiscoBall.StringConstants.SPRITESHEET_BALL_PLAYER_DEATH, 0);
            _this._deathsheet.anchor.set(0.5, 0.72);
            _this._deathsheet.animations.add("death", undefined, 30);
            _this._deathsheet.visible = false;
            _this.addChild(_this._deathsheet);
            return _this;
            // let lightEffect = this.game.add.sprite(0,0,StringConstants.SPRITE_BALL_PLAYER_EFFECT);
            // lightEffect.scale.set(0.1);
            // lightEffect.alpha = 0.7;
            // lightEffect.anchor.set(0.5);
            // this.game.add.tween(lightEffect.scale).to({"x": 2.5, "y":2.5}, 2000, Phaser.Easing.Linear.None, true, 0, -1);
            // this.game.add.tween(lightEffect).to({"alpha": 0}, 2000, Phaser.Easing.Linear.None, true, 0, -1);
            // this.addChild(lightEffect);
            //p2 physics
            // this.game.physics.enable(this, Phaser.Physics.P2JS);
            // this.body.setCircle(this.width/2);
            // //this.body.debug = true;
            // this.body.collideWorldBounds = false;
        }
        Object.defineProperty(PlayerBall.prototype, "SpeedboostApplied", {
            get: function () {
                return this._speedboostApplied;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBall.prototype, "DoingShockwave", {
            get: function () {
                return this._doingShockwave;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBall.prototype, "ShockwaveCircle", {
            get: function () {
                return this._shockwaveCircle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerBall.prototype, "AfterCrash", {
            get: function () {
                return this._afterCrash;
            },
            enumerable: true,
            configurable: true
        });
        //needs to be called  in postUpdate method
        PlayerBall.prototype.UpdatePosition = function () {
            this._shockwaveCircle.x = this.x;
            this._shockwaveCircle.y = this.y;
        };
        PlayerBall.prototype.SetMoveUpVelocity = function (yVel) {
            this.body.velocity.y = yVel;
        };
        PlayerBall.prototype.ApplySpeedboostForceUp = function (addition) {
            if (this._speedboostApplied)
                this.game.time.events.remove(this._speedboostEvent);
            else
                this._speedToReturnTo = this.body.velocity.y;
            this._speedboostApplied = true;
            this.body.velocity.y -= addition;
            //console.log("meen, speed to return to je " + this._speedToReturnTo);
            //console.log("meen, velocity je " + this.body.velocity.y);
            this._speedboostEvent = this.game.time.events.add(DiscoBall.GameOptions.SPEEDBOOST_TIME, this.setNormalSpeed, this);
        };
        PlayerBall.prototype.SetToAfterCrashMode = function () {
            //Base.AudioPlayer.Instance.PauseMusic();
            this._numOfBlinks = 0;
            this._afterCrash = true;
            this.alpha = 0;
            this._blinkingEvent = this.game.time.events.repeat(150, 10, this.blink, this);
        };
        PlayerBall.prototype.ResetBall = function () {
            //console.log("RESETTING PLAYER BALL!!!");
            this.reset(DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT);
            this.body.reset(DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT);
            if (this._speedboostApplied)
                this.game.time.events.remove(this._speedboostEvent);
            this._speedboostApplied = false;
            this._afterCrash = false;
            this.ResetAppearance();
        };
        PlayerBall.prototype.ResetAppearance = function () {
            this._mainSprite.visible = true;
            this._deathsheet.visible = false;
        };
        PlayerBall.prototype.DoTheShockWave = function (bigOne) {
            var props = bigOne ? { x: 2.4, y: 2.4 } : { x: 1.4, y: 1.4 };
            this._doingShockwave = true;
            this.game.add.tween(this._shockwaveCircle.scale).to(props, 180, Phaser.Easing.Linear.None, true)
                .onComplete.add(function () {
                this._doingShockwave = false;
                this._shockwaveCircle.scale.set(0);
                this.OnShockwaveEnd.dispatch(bigOne);
            }, this);
        };
        PlayerBall.prototype.ShowDeathAnim = function () {
            this._mainSprite.visible = false;
            this._deathsheet.visible = true;
            this._deathsheet.animations.play("death");
        };
        PlayerBall.prototype.Stop = function () {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        };
        PlayerBall.prototype.blink = function () {
            //this.visible = !this.visible;
            this.alpha = this._numOfBlinks % 2 == 0 ? 1 : 0;
            this._numOfBlinks++;
            // if (this._numOfBlinks === 2)
            //     Base.AudioPlayer.Instance.ResumeMusic();
            if (this._numOfBlinks === 10) {
                this._afterCrash = false;
                this.alpha = 1;
                //Base.AudioPlayer.Instance.ResumeMusic();
            }
        };
        PlayerBall.prototype.setNormalSpeed = function () {
            //check if we are not watching video
            if (this.body.velocity.y === 0)
                return;
            //console.log("setting normal speed!");
            this._speedboostApplied = false;
            this.body.velocity.y = this._speedToReturnTo;
        };
        /** DEBUG */
        PlayerBall.prototype.DebugBody = function () {
            this.game.debug.body(this);
            this.game.debug.body(this._shockwaveCircle);
        };
        return PlayerBall;
    }(Phaser.Sprite));
    DiscoBall.PlayerBall = PlayerBall;
})(DiscoBall || (DiscoBall = {}));
/// <reference path="../Base/SceneObject.ts"/>
var DiscoBall;
(function (DiscoBall) {
    var ePowerUpType;
    (function (ePowerUpType) {
        ePowerUpType[ePowerUpType["SPEEDUP"] = 0] = "SPEEDUP";
        ePowerUpType[ePowerUpType["STAR"] = 1] = "STAR";
    })(ePowerUpType = DiscoBall.ePowerUpType || (DiscoBall.ePowerUpType = {}));
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
        function PowerUp(game, type, spriteKey, frame) {
            var _this = _super.call(this, game, 0, 0, Base.eObjectType.POWER_UP, spriteKey, frame) || this;
            _this._speedboostTaken = false;
            _this._powerUpType = type;
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.immovable = true;
            if (type === ePowerUpType.SPEEDUP) {
                Utils.PhaserUtils.ChangePhysicsBodySizeRect(_this, 0.9, 0.9);
                _this.scale.set(0.9);
                _this.anchor.set(0.5, 0.6);
                _this.animations.add(DiscoBall.StringConstants.ANIM_SPEEDUP);
            }
            else {
                Utils.PhaserUtils.ChangePhysicsBodySizeRect(_this, 0.6, 0.6);
                _this.anchor.set(0.5);
            }
            //for the object pool
            _this.kill();
            return _this;
        }
        Object.defineProperty(PowerUp.prototype, "PowerUpType", {
            get: function () {
                return this._powerUpType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerUp.prototype, "SpeedboostTaken", {
            get: function () {
                return this._speedboostTaken;
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
        PowerUp.prototype.SetSpeedboostTaken = function () {
            this._speedboostTaken = true;
            this.game.time.events.add(500, this.setSpeedbostBack, this);
        };
        PowerUp.prototype.setSpeedbostBack = function () {
            this._speedboostTaken = false;
        };
        PowerUp.prototype.SpawnObject = function (xPos, yPos) {
            this.animations.play(DiscoBall.StringConstants.ANIM_SPEEDUP, 24, true);
            _super.prototype.SpawnObject.call(this, xPos, yPos);
        };
        PowerUp.prototype.KillObjectAndRemoveFromScene = function () {
            if (this._powerUpType === ePowerUpType.SPEEDUP)
                this.animations.stop();
            _super.prototype.KillObjectAndRemoveFromScene.call(this);
        };
        /** DEBUG */
        PowerUp.prototype.DebugBody = function () {
            this.game.debug.body(this);
        };
        return PowerUp;
    }(Base.SceneObject));
    DiscoBall.PowerUp = PowerUp;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var ZonesMovementManager = /** @class */ (function () {
        function ZonesMovementManager() {
            //array of x velocity values for zones
            this._zonesMovementArray = [];
            //array containing actual number of elements in each zone 
            //this is basically reference to _numOfElementsInZones from State_game
            this._numOfElementsInZones = [];
            //how many elements from the zone has been already proccessed
            this._zonesElementsUsed = [];
            //for one zone there is always lot of duplicate values - make sure we add just one within one update frame
            this._zonesAddedInThisFrame = [];
        }
        ZonesMovementManager.prototype.ResetZonesArray = function (numOfZonesTotal, numOfElementsInZones) {
            //console.log("ZONE MANAGER: RESETTING ARRAYS");
            this._zonesMovementArray = [];
            this._zonesElementsUsed = [];
            this._numOfElementsInZones = numOfElementsInZones;
            for (var i = 0; i < numOfZonesTotal; i++) {
                this._zonesMovementArray.push([]);
                this._zonesElementsUsed.push(0);
            }
        };
        /**
         * Adds zone to arrays and
         * @param addedZoneArr
         * @param numOfElementsInZone
         */
        ZonesMovementManager.prototype.AddZone = function (pastVelocities) {
            //console.log("aaa auto MORE");
            //console.log("adding zone, copying arr: " + JSON.stringify(this._zonesMovementArray[this._zonesMovementArray.length-1]));
            //console.log("adding zone, pastVelocities: " + JSON.stringify(pastVelocities));
            pastVelocities.pop();
            this._zonesMovementArray.push(pastVelocities.concat(this._zonesMovementArray[this._zonesMovementArray.length - 1]));
            this._zonesElementsUsed.push(0); //TODO tohle budu muset i mazat 
            //this._numOfElementsInZones.push(numOfElementsInZone);
        };
        ZonesMovementManager.prototype.RefreshAddedZonesList = function () {
            this._zonesAddedInThisFrame = [];
        };
        ZonesMovementManager.prototype.AddVelToZone = function (zoneToAdd, valueToAdd) {
            if (this._zonesAddedInThisFrame.indexOf(zoneToAdd) == -1) {
                //if (zoneToAdd == 0) console.log("adding fucking val " + valueToAdd);
                this._zonesAddedInThisFrame.push(zoneToAdd);
                this._zonesMovementArray[zoneToAdd].push(valueToAdd);
            }
        };
        ZonesMovementManager.prototype.GetVelFromZone = function (zoneToGet) {
            //console.log("Getting zone! " + zoneToGet);
            this._zonesElementsUsed[zoneToGet]++;
            //check if value has been used for each ball in the zone
            if (zoneToGet == 0) {
                //this.DebugZonesArray();
                //console.log("arr with zero vals: " + JSON.stringify(this._zonesMovementArray[0]));
                //console.log("comparing " + this._zonesElementsUsed[zoneToGet] + " with " + this._numOfElementsInZones[zoneToGet]);
            }
            if (this._zonesElementsUsed[zoneToGet] >= this._numOfElementsInZones[zoneToGet]) {
                //if (zoneToGet == 0) console.log("0 SHIFT");
                this._zonesElementsUsed[zoneToGet] = 0;
                return this._zonesMovementArray[zoneToGet].shift();
            }
            //if (zoneToGet == 0) console.log("0 COPY!");
            return this._zonesMovementArray[zoneToGet][0];
        };
        ZonesMovementManager.prototype.GetLastVelForLater = function () {
            return this._zonesMovementArray[this._zonesMovementArray.length - 1][0];
        };
        ZonesMovementManager.prototype.DebugZonesArray = function () {
            console.log(JSON.stringify(this._zonesMovementArray));
            //console.log(JSON.stringify(this._zonesMovementArray[0]));
        };
        ZonesMovementManager.prototype.DebugZoneNums = function () {
            console.log(JSON.stringify(this._numOfElementsInZones));
        };
        return ZonesMovementManager;
    }());
    DiscoBall.ZonesMovementManager = ZonesMovementManager;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
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
            //TODO maybe set resize callback????
            //TODO tohle smaz pak!!!!
            // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.setUserScale(0.2, 0.2);
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
        State_boot.prototype.preload = function () {
            //this.game.load.image(StringConstants.SPRITE_CATHEAD, "assets/sprites/body/head.png");
            //load money box image - we will use it as a loading bar in next state
            //this.game.load.image(StringConstants.UI_STARBG, "assets/sprites/UI/money_box.png");
        };
        State_boot.prototype.create = function () {
            if (App.Global.GAMEE) {
                this.game["onSound"](Gamee.Gamee.instance.sound);
            }
            //small hack which enables custom font usage
            // this.game.add.text(0, 0, "hack", { font: "1px avengeance_mightiest_avenger", fill: "#FFFFFF" });
            this.game.state.start(DiscoBall.StringConstants.STATE_PRELOAD);
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
    DiscoBall.State_boot = State_boot;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var ColorsInRange = /** @class */ (function () {
        function ColorsInRange(range, color1, color2, tintColor) {
            this.Range = range;
            this.Colors = [color1, color2];
            this.BgTintColor = tintColor;
        }
        return ColorsInRange;
    }());
    var GameOptions = /** @class */ (function () {
        function GameOptions() {
        }
        GameOptions.MOVEMENT_MULT = 1.4;
        GameOptions.BASE_LEVEL_DISTANCE = 2000;
        GameOptions.DISTANCE_ADDITION_PER_LEVEL = 500;
        GameOptions.SCORE_ADDITION_PER_LEVEL = 100;
        GameOptions.MIN_BALLS_ON_SCENE = 50;
        GameOptions.CRATE_GEN_DIST = 450;
        GameOptions.TIME_TO_LIGHT_TWEEN = 501;
        GameOptions.MAX_AVATARS_IN_ONE_LOAD = 10;
        GameOptions.MAX_DEFEATED_FRIENDS = 3;
        //static CRATE_GEN_ADD: number = 30;
        GameOptions.FOLLOWER_BALLS_DELAY = 3;
        GameOptions.START_SPEEED = -350;
        GameOptions.TIME_TO_SPEEDUP = 6000;
        GameOptions.SPEED_ADDITION_NORMAL = -50;
        GameOptions.SPEED_ADDITION_LOW = -20;
        GameOptions.ENEMY_BALLS_SPEED_ADDITION = 0.31; //percentual addition to enemy speed
        GameOptions.MAX_LIVES = 3;
        GameOptions.SPEEDUP_PROB = 0.15;
        GameOptions.STAR_PROB = 0.3;
        GameOptions.CRATE_MOVEMENT_PROB = 0.3;
        GameOptions.CRATE_MOVEMENT_DURATION = 2000;
        //static SPEEDBOOST_MIN_BOOST: number = 1600;
        //static SPEEDBOOST_MAX_ALLOWED: number = 4000;
        GameOptions.SPEEDBOOST_ADD = 300;
        GameOptions.SPEEDBOOST_TIME = 1500;
        GameOptions.STARS_FOR_SHOCKWAVE_NEEDED = 3;
        GameOptions.RED_LINE_MIN_ALPHA_DIST = 350;
        GameOptions.RED_LINE_MAX_ALPHA_DIST = 100;
        GameOptions.RED_LINE_ALPHA_DIST_DIFF = 250;
        return GameOptions;
    }());
    DiscoBall.GameOptions = GameOptions;
    ;
    var GameGlobalVariables = /** @class */ (function () {
        function GameGlobalVariables() {
        }
        return GameGlobalVariables;
    }());
    DiscoBall.GameGlobalVariables = GameGlobalVariables;
    var ePlayState;
    (function (ePlayState) {
        ePlayState[ePlayState["GAMEE_LAYER"] = 0] = "GAMEE_LAYER";
        ePlayState[ePlayState["IDLE"] = 1] = "IDLE";
        ePlayState[ePlayState["UPGRADING"] = 2] = "UPGRADING";
        ePlayState[ePlayState["FORCE_RESET"] = 3] = "FORCE_RESET";
        ePlayState[ePlayState["PLAY"] = 4] = "PLAY";
    })(ePlayState || (ePlayState = {}));
    ;
    var eScreenSide;
    (function (eScreenSide) {
        eScreenSide[eScreenSide["LEFT"] = 0] = "LEFT";
        eScreenSide[eScreenSide["RIGHT"] = 1] = "RIGHT";
        eScreenSide[eScreenSide["UP"] = 2] = "UP";
        eScreenSide[eScreenSide["DOWN"] = 3] = "DOWN";
    })(eScreenSide = DiscoBall.eScreenSide || (DiscoBall.eScreenSide = {}));
    ;
    var State_game = /** @class */ (function (_super) {
        __extends(State_game, _super);
        function State_game() {
            var _this = _super.call(this) || this;
            //some repeated constants that are computed on the start of the game
            //private _currentLevel: number = 0;
            _this._currentArea = 0;
            //private _nextLevelVal: number = 0;
            _this._score = 0;
            _this._prevAddedScore = 0;
            _this._prevInputX = 0;
            _this._inputDiffX = 0;
            _this._offsetFromTop = 0;
            _this._currentGenTime = 0;
            _this._tutorialPlayed = false;
            _this._tutorialPlaying = false;
            _this._tutorialPart = 0;
            _this._gameeFriendsManager = null;
            _this._playState = ePlayState.GAMEE_LAYER;
            _this._gameOver = false;
            //private _particleEmmiter: Base.ParticleEmmiter;
            _this._levelPrepared = false;
            _this._gameStart = false;
            _this._inputDown = false;
            _this._levelLine = null;
            _this._level = 0;
            _this._prevLevelValue = 0;
            _this._nextLevelValue = 0;
            _this._nextLevelReached = false;
            _this._distanceWithinLevel = 0;
            _this._distanceToNextLevel = 0;
            _this._scoreAddInNextLevel = 0;
            _this._framesForLevelBarUpdate = 0;
            _this._friendAvatarChanging = false;
            _this._zonesMovementManager = null;
            _this._powerUps = [];
            _this._leaderEnemyBall = null;
            _this._lastEnemyBall = null;
            _this._enemyBalls = [];
            _this._cratesOnScene = [];
            _this._pastVelocities = [];
            _this._numOfElementsInZones = [];
            _this._currentStarsTaken = 0;
            //private _lastAddedRow: EnemyBall[] = [];
            _this._readyForShockwave = false;
            //private _changeSpeedTime: number = 0;
            _this._changeSpeed = false;
            _this._nextGenerationDiff = 0;
            _this._framesFromStart = 0;
            _this._currentLives = 0;
            _this._offsetFromBottom = 0;
            _this._scoreAddLoopEvent = null;
            _this._enemiesKilledByShockwave = 0;
            _this._lightTime = 0;
            _this._firstTouch = true;
            _this._videoRewardShown = false;
            _this._afterVideoWatchWait = false;
            return _this;
        }
        State_game.prototype.create = function () {
            this.precomputeConstants();
            //physics setup
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity = new Phaser.Point(0, 0);
            //SHOW FPS TODO delete later
            //this.game.plugins.add(Phaser.Plugin.AdvancedTiming);
            //game settings
            //this._gameSettingsHandler = new GameSettingsHandler(this.game);
            this._gameeFriendsManager = new Base.GameeFriendsManager(this.game);
            //click event handling
            this._touchField = this.game.add.sprite(0, 0);
            this._touchField.fixedToCamera = true;
            this._touchField.width = this.game.width;
            this._touchField.height = this.game.height;
            this._touchField.inputEnabled = true;
            //this.game.input.onTap.add(this.manageShockwaveTap, this);
            this.game.input.onUp.add(this.manageShockwaveTap, this);
            //handle layers
            this._bgLayer = this.game.add.group();
            this._sceneObjectsLayer = this.game.add.group();
            this._playerLayer = this.game.add.group();
            this._frontLayer = this.game.add.group();
            this._UILayer = this.game.add.group();
            //this._bgLayer.add(this.createGameBg());
            this._offsetFromTop = this.game.height * .5;
            this._playerBall = new DiscoBall.PlayerBall(this.game, GameGlobalVariables.GAME_HALF_WIDTH, this.game.camera.y + this._offsetFromTop, this._playerLayer);
            this._playerLayer.add(this._playerBall);
            this._playerBall.OnShockwaveEnd.add(this.onShockWaveEnd, this);
            this._enemyRedLine = this.game.add.sprite(GameGlobalVariables.GAME_HALF_WIDTH, this.game.camera.y + this.game.width, DiscoBall.StringConstants.SPRITE_RED_ENEMY_LINE);
            this._frontLayer.add(this._enemyRedLine);
            this._enemyRedLine.anchor.set(0.5, -0.08);
            this._enemyRedLine.visible = false;
            //this._particleEmmiter = new Base.ParticleEmmiter(this.game);
            this._levelLine = new DiscoBall.NextLevelLine(this.game, this._frontLayer);
            this._zonesMovementManager = new DiscoBall.ZonesMovementManager();
            this._sceneObjectGenerator = new DiscoBall.ObjectGenerator(this.game, this._gameSettingsHandler, this._sceneObjectsLayer, this._bgLayer);
            //UI and signals handling
            this._UI = new UI.UIHandler(this.game, this._gameSettingsHandler, this._UILayer, this._frontLayer);
            this._screenTextGenerator = new UI.ScreenTextsGenerator(this.game, this._UILayer);
            //bg stuff
            var bg = this.game.add.sprite(0, 0, DiscoBall.StringConstants.SPRITE_MAP_BG1, undefined, this._bgLayer);
            bg.fixedToCamera = true;
            var lightningBg = this.game.add.sprite(0, 0, DiscoBall.StringConstants.SPRITE_BG_LIGHT_LAYER, undefined, this._bgLayer);
            lightningBg.fixedToCamera = true;
            lightningBg.alpha = 0;
            lightningBg.width = this.game.width;
            lightningBg.height = this.game.height;
            this._lightTween = this.game.add.tween(lightningBg).to({ "alpha": 1 }, 100, Phaser.Easing.Linear.None, false);
            this._lightTween.chain(this.game.add.tween(lightningBg).to({ "alpha": 0 }, 100, Phaser.Easing.Linear.None, false));
            var bgLines = this.game.add.sprite(GameGlobalVariables.GAME_HALF_WIDTH, GameGlobalVariables.GAME_HALF_HEIGHT, DiscoBall.StringConstants.SPRITE_BG_LINES, undefined, this._bgLayer);
            bgLines.anchor.set(0.5);
            bgLines.fixedToCamera = true;
            var bgLights = this.game.add.sprite(0, bgLines.height, DiscoBall.StringConstants.SPRITE_BG_LIGHTS, undefined, this._bgLayer);
            //bgLights.alpha = 0.8;
            bgLights.anchor.set(0.5, 1);
            bgLines.addChild(bgLights);
            this.game.add.tween(bgLights).to({ y: -this.game.height }, 2700, Phaser.Easing.Linear.None, true, 500, -1);
            //blending stripes - TODO uncomment!
            // let stripe1 = this.game.add.sprite(GameGlobalVariables.GAME_HALF_WIDTH,GameGlobalVariables.GAME_HALF_HEIGHT,
            //   StringConstants.SPRITE_FRONT_STRIPE, undefined, this._frontLayer);
            // stripe1.anchor.set(0.5);
            // stripe1.blendMode = PIXI.blendModes.OVERLAY;
            // stripe1.fixedToCamera = true;
            // this.game.add.tween(stripe1).to({alpha: 0.2}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
            // let stripe2 = this.game.add.sprite(GameGlobalVariables.GAME_HALF_WIDTH,this.game.height*.85,
            //   StringConstants.SPRITE_FRONT_STRIPE, undefined, this._frontLayer);
            // stripe2.anchor.set(0.5);
            // stripe2.blendMode = PIXI.blendModes.OVERLAY;
            // stripe2.fixedToCamera = true;
            // this.game.add.tween(stripe2).to({alpha: 0.2}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
            // //dummy stuff *********** TESTING **************, comment later
            // let playerData: IPlayerData = { name: "Coco Džambo", highScore: 300, avatar: "_avatars/0.png", userID: "", coins: 5 };
            // let socialData: IPlayerData[] = [];
            // let d1: IPlayerData = { name: "kloboučník", avatar: "_avatars/1.png", highScore: 200, coins: undefined, userID: undefined };
            // let d2: IPlayerData = { name: "Věra Černá", avatar: "_avatars/2.png", highScore: 500, coins: undefined, userID: undefined };
            // let d3: IPlayerData = { name: "André Bábo", avatar: "_avatars/3.png", highScore: 1000, coins: undefined, userID: undefined };
            // let d4: IPlayerData = { name: "loko monic", avatar: "_avatars/4.png", highScore: 2000, coins: undefined, userID: undefined };
            // socialData.push(d1);
            // socialData.push(d2);
            // socialData.push(d3);
            // socialData.push(d4);
            // //TODO gameefriends delete
            // this._gameeFriendsManager.OnPlayerAvatarsLoaded.add(this.createFriendAvatarBadge, this);
            // this._gameeFriendsManager.parseSocialData(playerData, socialData);
            // //dummy stuff *********** TESTING **************
            //console.log("GAMEEtest: BEFORE ALL THE FUCKING STUFF WORK");
            if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS && Gamee.Gamee.instance.SocialDataRequested) {
                //console.log("GAMEEtest: STATE GAME, Getting socialdata stuff");
                this._gameeFriendsManager.OnPlayerAvatarsLoaded.add(this.createFriendAvatarBadge, this);
                if (Gamee.Gamee.instance.LoginState == Gamee.eLoginState.LOGGED_IN) {
                    //console.log("GameeTest: STATE GAME START, PLAYER LOADED");
                    this._gameeFriendsManager.ReloadSocialData();
                }
                else if (Gamee.Gamee.instance.LoginState == Gamee.eLoginState.WAITING_FOR_CALLBACK) {
                    //console.log("GameeTest: STATE GAME START, STILL WAITIN FOR CALLBACK");
                    //Gamee.Gamee.instance.OnSocialDataObtained.add(this._gameeFriendsManager.LoadAndReloadSocialData, this);
                    Gamee.Gamee.instance.OnSocialDataObtained.add(this.onSocialDataReady, this);
                }
            }
            if (App.Global.GAMEE) {
                this._playState = ePlayState.GAMEE_LAYER;
                Gamee.Gamee.instance.gameReady(this.prepareGameData.bind(this));
            }
            // to start play if not Gamee
            else {
                this._tutorialPlayed = true;
                this._playState = ePlayState.FORCE_RESET;
            }
            //Utils.PhaserUtils.ShowGameVersion(this.game, "0.355");
        };
        State_game.prototype.onSocialDataReady = function (playerData, socialData) {
            if (Gamee.Gamee.instance.OnSocialDataObtained != null)
                Gamee.Gamee.instance.OnSocialDataObtained.remove(this.onSocialDataReady, this);
            //console.log("GameeTest: STATE GAME, CALLBACK OF FAKIN DATA");
            this._gameeFriendsManager.ReloadSocialData();
        };
        State_game.prototype.precomputeConstants = function () {
            GameGlobalVariables.GAME_HALF_WIDTH = this.game.width / 2;
            GameGlobalVariables.GAME_HALF_HEIGHT = this.game.height / 2;
        };
        State_game.prototype.update = function () {
            switch (this._playState) {
                case ePlayState.GAMEE_LAYER:
                case ePlayState.IDLE: //TODO potrebujem vubec IDLE stav????
                case ePlayState.UPGRADING:
                    return;
                case ePlayState.FORCE_RESET:
                    this._playState = ePlayState.IDLE;
                    this.resetGame();
                    return;
                case ePlayState.PLAY:
                    if (App.Global.GAMEE && !Gamee.Gamee.instance.gameRunning) {
                        return;
                    }
                    this.playLoop();
                    break;
            }
        };
        State_game.prototype.postUpdate = function () {
            if (this._playState == ePlayState.PLAY && !this._gameOver) {
                this._playerBall.UpdatePosition();
                if (this._tutorialPart != 1) {
                    if (this._leaderEnemyBall.DistanceToPlayer > GameOptions.RED_LINE_MIN_ALPHA_DIST) {
                        this._enemyRedLine.visible = false;
                        if (Base.AudioPlayer.Instance.IsSoundPlaying(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM)) {
                            Base.AudioPlayer.Instance.SetSoundVolume(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM, 0);
                            Base.AudioPlayer.Instance.StopSound(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM);
                        }
                    }
                    else {
                        this._enemyRedLine.visible = true;
                        this._enemyRedLine.y = this._leaderEnemyBall.top;
                        var intensity = Math.min((GameOptions.RED_LINE_MIN_ALPHA_DIST - this._leaderEnemyBall.DistanceToPlayer) / GameOptions.RED_LINE_ALPHA_DIST_DIFF, 1);
                        this._enemyRedLine.alpha = intensity;
                        //console.log(this._leaderEnemyBall.DistanceToPlayer);
                        if (!Base.AudioPlayer.Instance.IsSoundPlaying(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM))
                            Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM, true);
                        else
                            Base.AudioPlayer.Instance.SetSoundVolume(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM, intensity);
                    }
                    //console.log("distance to player: " + this._leaderEnemyBall.DistanceToPlayer);
                    // console.log("tut playing? " + this._tutorialPlaying);
                    // console.log("tut part? " + this._tutorialPart);
                    // //console.log("dist? " + this._tutorialPlaying);
                    // console.log("tut showing? " + this._UI.IsTutorialShowing());
                    if (this._tutorialPlaying && this._tutorialPart === 2 && this._leaderEnemyBall.DistanceToPlayer < 400 && !this._UI.IsTutorialShowing()) {
                        this.game.physics.arcade.isPaused = true;
                        this.pauseMovingCrates();
                        this._UI.ShowTutorialScreen(2, this.onTutorialShowed.bind(this));
                    }
                }
                if (this._screenTextGenerator.IsTextShowing)
                    this._screenTextGenerator.MoveTextUp();
                //this._particleEmmiter.UpdateSmokeParticles(this._playerBall.x, this._playerBall.y);
                // if (this._screenTextGenerator.IsTextShowing)
                //   this._screenTextGenerator.UpdateTextPositionToCenter();
                // if (this._currentGenTime >= GameOptions.CRATE_GEN_TIME /*&& this._numOfRowsGen < 10*/) {
                //   //if (this._lastEnemyBall.body.y < this.game.camera.y + this.game.height + this._lastEnemyBall.height) {
                //     console.log("ADDING THE ROW!!!!!!!");
                //     let lastZoneArr: EnemyBall[] = [];
                //     this._enemyBalls.forEach(element => {
                //       if (element.Zone === this._lastEnemyBall.Zone) {
                //         lastZoneArr.push(element);
                //       }
                //     });
                //     console.log("zone " + lastZoneArr[0].Zone + ": last element yPos before row is " + lastZoneArr[0].y);
                //     this._enemyBalls = this._enemyBalls.concat(this._sceneObjectGenerator.GenerateLastBallsRow(lastZoneArr, this._enemyBalls.length));
                //     //console.log("BALLS ADD: TOTAL BALLS AFTER: " + this._enemyBalls.length);
                //     //this.manageEnemyBalls(this._leaderEnemyBall.body.velocity.x);
                //     this.manageEnemyBalls();
                //     // console.log("AFTER, LAST ROW ARR LEN: " + lastZoneArr.length);
                //     // console.log("AFTER, ALL BALLS LEN: " + this._enemyBalls.length);
                //     this._currentGenTime = 0;
                //     this._numOfRowsGen++;
                //   }
            }
        };
        State_game.prototype.render = function () {
            // this._cratesOnScene.forEach(function (item: Crate) {
            //   item.DebugBody();
            // }, this);
            // this._powerUps.forEach(function (item: PowerUp) {
            //   item.DebugBody();
            // }, this);
            // this._enemyBalls.forEach(function (item: EnemyBall) {
            //   item.DebugBody();
            // }, this);
            //this._playerBall.DebugBody();
            //CAM OFFSET
            // console.log("X Cam offset: " + this.cat.cameraOffset.x);
            // console.log("Y Cam offset: " + this.cat.cameraOffset.y);
            //CAM DEADZONE
            //TODO tohle pak smazat, v app.js predelat Phaser.CANVAS na PHaser.AUTO
            // var zone = this.game.camera.deadzone;
            // if (zone != null) {
            //   this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
            //   this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
            // }
            // var catCenter = new Phaser.Point(this._cat.centerX, this._cat.centerY);
            // this.game.debug.geom(catCenter, 'rgba(255,0,0,1)');
            //game.debug.physicsGroup(this.cat);
            //car body debug
            //this._playerCar.DebugCarBody();
            //this._playerCar.RenderPoint();
            //geometry debug
            // let rect = new Phaser.Rectangle( this._touchFieldLeft.x,  this._touchFieldLeft.y, this._touchFieldLeft.width, this._touchFieldLeft.height ) ;
            // this.game.debug.geom( rect, 'rgba(255,0,0,1)' , true) ;
            // let rect2 = new Phaser.Rectangle( this._touchFieldRight.x,  this._touchFieldRight.y, this._touchFieldRight.width, this._touchFieldRight.height ) ;
            // this.game.debug.geom( rect2, 'rgba(128,128,0,1)' , true) ;
        };
        //Called every frame when in the PLAY state
        State_game.prototype.playLoop = function () {
            if (this._gameOver) {
                //simulate the balls while player is dead
                this.game.physics.arcade.overlap(this._enemyBalls, this._cratesOnScene, this.onEnemyCrateCollision, undefined, this);
                return;
            }
            //clear old stuff
            this.clearSceneObjectsOutOfScreen(this._cratesOnScene, Base.eObjectType.CRATE);
            this.clearSceneObjectsOutOfScreen(this._powerUps, Base.eObjectType.POWER_UP);
            if (this._nextLevelReached && this.game.camera.y + this.game.height + 50 <= this._nextLevelValue) {
                this.setNextLevelLine(false);
            }
            //bg lightning
            this._lightTime += this.game.time.physicsElapsedMS;
            if (this._lightTime >= GameOptions.TIME_TO_LIGHT_TWEEN) {
                this._lightTween.start();
                this._lightTime = 0;
            }
            //speed check
            //this._changeSpeedTime += this.game.time.physicsElapsedMS;
            //if (this._changeSpeedTime >= GameOptions.TIME_TO_SPEEDUP && !this._playerBall.SpeedboostApplied) {
            if (this._changeSpeed && !this._playerBall.SpeedboostApplied) {
                this.computeSpeedAndApply(true);
                //this._changeSpeedTime = 0;
                this._changeSpeed = false;
            }
            this._cameraMovementDiff = (this._lastCamPos - this.game.camera.y);
            this._distanceWithinLevel += this._cameraMovementDiff;
            //call level bar update just once per 15 frames (for performance optimization)
            this._framesForLevelBarUpdate++;
            if (this._framesForLevelBarUpdate == 10) {
                this._UI.UpdateLevelBarProgress(this._distanceWithinLevel / this._distanceToNextLevel);
                this._framesForLevelBarUpdate = 0;
            }
            if (!this._nextLevelReached && this._playerBall.y <= this._nextLevelValue) {
                if (this._tutorialPlaying && this._tutorialPart === 1 && this._level === 0) {
                    this.createBalls();
                    this._tutorialPart = 2;
                }
                this._level++;
                this._UI.UpdateLevel(this._level + 1);
                Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_LEVEL_DONE);
                this._levelLine.ShowLineText();
                //next level reached - it is set on true just until next line set occurs
                this._nextLevelReached = true;
                this._changeSpeed = true;
                this._distanceWithinLevel = 0;
                this._distanceToNextLevel = GameOptions.BASE_LEVEL_DISTANCE + (this._level * GameOptions.DISTANCE_ADDITION_PER_LEVEL) /*- this._offsetFromBottom*/;
                this._prevLevelValue = Math.abs(this._nextLevelValue);
                if (!this._screenTextGenerator.IsTextShowing)
                    this._screenTextGenerator.GenerateText(this.game.rnd.realInRange(0, 1) > 0.5 ? UI.ScreenTextType.DISCO_FEVER : UI.ScreenTextType.YOU_ROLL);
                if (App.Global.GAMEE) {
                    //console.log("LEVEL CLEAR, ADDED " + this._scoreAddInNextLevel);
                    this._score += this._scoreAddInNextLevel;
                    //Gamee.Gamee.instance.setScore(this._score);
                }
            }
            //generating obstacles TODO uncomment
            this._distToObstacleGen += this._cameraMovementDiff;
            if (this._distToObstacleGen >= this._nextGenerationDiff) {
                var generatedRow = this._sceneObjectGenerator.GenerateItemRow();
                if (generatedRow.Crates.length > 0)
                    this._cratesOnScene = this._cratesOnScene.concat(generatedRow.Crates);
                if (generatedRow.PowerUps.length > 0)
                    this._powerUps = this._powerUps.concat(generatedRow.PowerUps);
                this._distToObstacleGen = 0;
                this._nextGenerationDiff = GameOptions.CRATE_GEN_DIST + this.game.rnd.integerInRange(-100, 100);
                if (generatedRow.SpeedUpGenerated) {
                    this._nextGenerationDiff += 150;
                }
            }
            this._lastCamPos = this.game.camera.y;
            // //ADDING NEW ROW
            if (this._tutorialPart != 1) {
                if ((this._lastEnemyBall.body.y < this.game.camera.y + this.game.height + this._lastEnemyBall.height) || this._enemyBalls.length < 5) {
                    var lastZoneArr = [];
                    for (var i = 0, n = this._enemyBalls.length; i < n; i++) {
                        if (this._enemyBalls[i].Zone === this._lastEnemyBall.Zone) {
                            lastZoneArr.push(this._enemyBalls[i]);
                        }
                    }
                    //this._zonesMovementManager.DebugZonesArray();
                    var addedRow = this._sceneObjectGenerator.GenerateLastBallsRow(lastZoneArr);
                    if (addedRow.length > 0) {
                        for (var i = 0, n = addedRow.length; i < n; i++) {
                            addedRow[i].SetZone(this._lastEnemyBall.Zone + 1);
                        }
                        this._lastEnemyBall = addedRow[addedRow.length - 1];
                    }
                    //console.log("zone was ADDED: " + this._lastEnemyBall.Zone);
                    //console.log("PAST VELOCITIES TO ADD: " + JSON.stringify(this._pastVelocities));
                    this._zonesMovementManager.AddZone(this._pastVelocities);
                    this._numOfElementsInZones.push(addedRow.length);
                    this._enemyBalls = this._enemyBalls.concat(addedRow);
                    //this._currentGenTime = 0;
                }
                //uncomment
                this._leaderEnemyBall.FollowPlayer(this._playerBall, this._currentEnemySpeed); //PUVODNE 460
                //console.log("leader enemy vel x is " + this._leaderEnemyBall.body.velocity.x);
                //this._enemyBalls.forEach(element => {
                this._framesFromStart++;
                this._zonesMovementManager.RefreshAddedZonesList();
                //console.log("UPDATE!!!!");
                //this._zonesMovementManager.DebugZonesArray();
                for (var i = 0, n = this._enemyBalls.length; i < n; i++) {
                    if (!this._enemyBalls[i].IsLeader) {
                        this._enemyBalls[i].body.velocity.y = this._leaderEnemyBall.body.velocity.y;
                        this._zonesMovementManager.AddVelToZone(this._enemyBalls[i].Zone, this._leaderEnemyBall.body.velocity.x);
                        //if (this._framesFromStart >= this._enemyBalls[i].Zone*GameOptions.FOLLOWER_BALLS_DELAY) {
                        if (this._framesFromStart >= this._enemyBalls[i].StartMoveNum) {
                            this._enemyBalls[i].body.velocity.x = this._zonesMovementManager.GetVelFromZone(this._enemyBalls[i].Zone);
                        }
                    }
                }
                if (this._pastVelocities.length === GameOptions.FOLLOWER_BALLS_DELAY + 1)
                    this._pastVelocities.shift();
                this._pastVelocities.push(this._zonesMovementManager.GetLastVelForLater());
            }
            //player ball behaviour
            var inputDown = this._touchField.input.checkPointerDown(this.game.input.activePointer);
            if (inputDown) {
                //first touch
                if (!this._inputDown) {
                    this._inputDown = true;
                    this._inputDiffX = 0;
                }
                else
                    this._inputDiffX = this.game.input.activePointer.x - this._prevInputX;
                this._playerBall.body.x += (this._inputDiffX * GameOptions.MOVEMENT_MULT);
                this._playerBall.body.x = Phaser.Math.clamp(this._playerBall.body.x, 0, this.game.camera.width - this._playerBall.body.width);
                this._prevInputX = this.game.input.activePointer.x;
            }
            else {
                this._inputDiffX = 0;
                this._inputDown = false;
            }
            //collisions 
            //this.game.physics.arcade.collide(this._enemyBalls, this._playerBall, this.onPlayerEnemyCollision, undefined, this);
            this.game.physics.arcade.overlap(this._cratesOnScene, this._playerBall, this.onPlayerCrateCollision, undefined, this);
            this.game.physics.arcade.overlap(this._enemyBalls, this._cratesOnScene, this.onEnemyCrateCollision, undefined, this);
            this.game.physics.arcade.overlap(this._playerBall, this._powerUps, this.onPowerUpTaken, undefined, this);
            if (this._playerBall.DoingShockwave) {
                this.game.physics.arcade.overlap(this._playerBall.ShockwaveCircle, this._enemyBalls, this.onEnemyShockwaveCollision, undefined, this);
            }
            else
                this.game.physics.arcade.overlap(this._enemyBalls, this._playerBall, this.onPlayerEnemyCollision, undefined, this);
            //JUST FOR DEBUG!!!
            //this.manageEnemyBalls();
        };
        State_game.prototype.createFriendAvatarBadge = function () {
            //console.log("GameeTest: STATE GAME, CREATING AVATAR BADGE");
            this._friendAvatarChanging = false;
            var nextFriend = this._gameeFriendsManager.GetNextFriend(this._score);
            //console.log("NEXT FRIEND? " + nextFriend);
            if (nextFriend != null)
                this._UI.ShowFriendAvatarBadge(nextFriend.name, nextFriend.highScore - this._score);
            else
                this._UI.HideFriendAvatarBadge();
        };
        State_game.prototype.createBalls = function () {
            this._enemyBalls = [];
            this._enemyBalls = this._sceneObjectGenerator.GenerateBallsOnStart();
            this._leaderEnemyBall = this._enemyBalls[0];
            this._leaderEnemyBall.IsLeader = true;
            this.manageEnemyBalls();
        };
        State_game.prototype.onPlayerEnemyCollision = function (sprite1, sprite2) {
            this._currentLives--;
            if (this._currentLives <= 0) {
                if (App.Global.GAMEE && !this._gameOver) {
                    if (App.Global.LOG_EVENTS)
                        Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_DEATH, "enemyBall");
                    this._playerBall.Stop();
                    this.endGame();
                }
            }
            else {
                if (App.Global.LOG_EVENTS)
                    Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_HIT, "enemyBall");
                this.doTheShockWave(false);
                this._UI.UpdateLivesNum(this._currentLives);
            }
        };
        State_game.prototype.onPlayerCrateCollision = function (sprite1, sprite2) {
            if (!this._playerBall.AfterCrash && !this._gameOver) {
                Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_CRATE_HIT);
                this._currentLives--;
                this.camera.shake(0.05, 120);
                this._UI.UpdateLivesNum(this._currentLives);
                if (this._currentLives <= 0) {
                    if (App.Global.LOG_EVENTS)
                        Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_DEATH, "crate");
                    this._playerBall.Stop();
                    this.endGame();
                }
                else {
                    if (App.Global.LOG_EVENTS)
                        Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_HIT, "crate");
                    this._playerBall.SetToAfterCrashMode();
                    if (!this._screenTextGenerator.IsTextShowing)
                        this._screenTextGenerator.GenerateText(UI.ScreenTextType.STAYIN_ALIVE);
                }
            }
        };
        State_game.prototype.onPowerUpTaken = function (sprite1, sprite2) {
            var powerUp = sprite2;
            if (powerUp.PowerUpType == DiscoBall.ePowerUpType.SPEEDUP) {
                if (!powerUp.SpeedboostTaken) {
                    Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_SPEED_STRIP);
                    powerUp.SetSpeedboostTaken();
                    this._playerBall.ApplySpeedboostForceUp(GameOptions.SPEEDBOOST_ADD);
                }
            }
            else if (powerUp.PowerUpType == DiscoBall.ePowerUpType.STAR) {
                //Base.AudioPlayer.Instance.PlaySound(StringConstants.SOUND_STAR_COLLECT);
                if (this._currentStarsTaken < GameOptions.STARS_FOR_SHOCKWAVE_NEEDED) {
                    this._currentStarsTaken++;
                    if (this._currentStarsTaken == GameOptions.STARS_FOR_SHOCKWAVE_NEEDED) {
                        Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_SHOCKWAVE_READY);
                        this._UI.ShowShockwaveReadySign();
                        this._readyForShockwave = true;
                        //TODO testing
                        //this.doTheShockWave();
                    }
                    else
                        Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_STAR_COLLECT);
                    this._UI.UpdateShockwaveBar(this._currentStarsTaken / GameOptions.STARS_FOR_SHOCKWAVE_NEEDED);
                }
                else
                    Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_STAR_COLLECT);
                if (this._tutorialPlaying && this._tutorialPart === 3 &&
                    this._currentStarsTaken >= GameOptions.STARS_FOR_SHOCKWAVE_NEEDED) {
                    this.game.physics.arcade.isPaused = true;
                    this.pauseMovingCrates();
                    this._UI.ShowTutorialScreen(3, this.onTutorialShowed.bind(this));
                }
                //this.camera.flash(0xffffff, 100);
                var indexToDel = this._powerUps.indexOf(powerUp, 0);
                if (indexToDel > -1) {
                    Utils.ArrayUtils.OneItemSplice(this._powerUps, indexToDel);
                    //this._powerUps.splice(indexToDel, 1);
                }
                powerUp.KillObjectAndRemoveFromScene();
                //this._UI.UpdateShockwaveBar(this._currentStarsTaken/GameOptions.STARS_FOR_SHOCKWAVE_NEEDED);
            }
        };
        State_game.prototype.onEnemyShockwaveCollision = function (shockwaveCircle, enemy) {
            this.killEnemy(enemy);
            //console.log("killing enemy: " + enemy.ObjectID);
            this._enemiesKilledByShockwave++;
        };
        State_game.prototype.onEnemyCrateCollision = function (sprite1, sprite2) {
            //enemyBall handling
            Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_BUBBLE_DESTROY);
            this.killEnemy(sprite1);
            //crate handle
            var crate = sprite2;
            crate.Number--;
            if (crate.Number <= 0) {
                var indexToDel = this._cratesOnScene.indexOf(crate, 0);
                //console.log("a1 DELETING CRATE! ARR LEN: " + this._cratesOnScene.length);
                if (indexToDel > -1) {
                    Utils.ArrayUtils.OneItemSplice(this._cratesOnScene, indexToDel);
                    //this._cratesOnScene.splice(indexToDel, 1);
                }
                crate.KillObjectAndRemoveFromScene();
                //console.log("a2 DELETING CRATE! ARR LEN: " + this._cratesOnScene.length);
            }
            //console.log("CRASH! Num of enemy balls: " + this._enemyBalls.length);
        };
        State_game.prototype.killEnemy = function (enemyToKill) {
            // if (enemyToKill.inCamera)
            //   this._particleEmmiter.EmitParticles(enemyToKill.x, enemyToKill.y, 5);
            var indexToDel = this._enemyBalls.indexOf(enemyToKill, 0);
            if (indexToDel > -1) {
                Utils.ArrayUtils.OneItemSplice(this._enemyBalls, indexToDel);
                //this._enemyBalls.splice(indexToDel, 1);
            }
            else
                console.log("ERROR! CANNOT FIND DELETED BALL IN BALLS ARRAY!");
            if (enemyToKill.IsLeader) {
                //console.log("DEBUG! KILLED ENEMY LEADER WITH ID VALUE " + this._leaderEnemyBall.ObjectID);
                enemyToKill.IsLeader = false;
                this.manageEnemyBalls();
            }
            else {
                this._numOfElementsInZones[enemyToKill.Zone]--;
                if (enemyToKill === this._lastEnemyBall) {
                    this._lastEnemyBall = this._enemyBalls[this._enemyBalls.length - 1];
                }
            }
            //console.log("picovina onEnemyCrateCollision: " + JSON.stringify(this._numOfElementsInZones));
            enemyToKill.KillObjectAndRemoveFromScene();
            if (App.Global.GAMEE && !this._gameOver) {
                this._score += 10;
                //Gamee.Gamee.instance.setScore(this._score);
            }
        };
        State_game.prototype.onShockWaveEnd = function (wasItBigOne) {
            //console.log("HOW MANY ENEMIES KILLED? " + this._enemiesKilledByShockwave);
            //TODO dont know why, but it looks like the number of enemies killed is too high
            if (wasItBigOne && this._enemiesKilledByShockwave >= 10) {
                Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_CROWD_CHEER);
                if (!this._screenTextGenerator.IsTextShowing)
                    this._screenTextGenerator.GenerateText(this.game.rnd.realInRange(0, 1) > 0.5 ? UI.ScreenTextType.INFERNO : UI.ScreenTextType.YOU_ROLL);
            }
            else if (!wasItBigOne) {
                if (!this._screenTextGenerator.IsTextShowing)
                    this._screenTextGenerator.GenerateText(UI.ScreenTextType.STAYIN_ALIVE);
                Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_CRATE_HIT);
            }
            this._enemiesKilledByShockwave = 0;
        };
        State_game.prototype.prepareLevel = function () {
            //console.log("preparing level!!");
            //1] clear old items from the stage
            this.clearLevel();
            //2] init properties and stuff and start game
            this._gameOver = false;
            this._cratesOnScene = [];
            this._powerUps = [];
            this._enemyBalls = [];
            this._numOfElementsInZones = [];
            this._framesFromStart = 0;
            this._framesForLevelBarUpdate = 0;
            //this._tutorialSlowDownCoeff = 0;
            this._enemiesKilledByShockwave = 0;
            //this._rowValues = [];
            //this._nextLevelVal = this._gameSettingsHandler.LevelAddition * (this._currentLevel + 1);
            this._videoRewardShown = false;
            this._score = 0;
            this._prevAddedScore = 0;
            this._level = 0;
            this._cameraMovementDiff = 0;
            this._inputDown = false;
            this._currentPlayerSpeed = GameOptions.START_SPEEED;
            this._nextGenerationDiff = GameOptions.CRATE_GEN_DIST;
            //this._changeSpeedTime = 0;
            this._currentStarsTaken = 0;
            this._currentLives = GameOptions.MAX_LIVES;
            this._readyForShockwave = false;
            this._changeSpeed = false;
            this._videoWatchStatus = UI.eAfterVideoState.NOT_WATCHED;
            this._friendAvatarChanging = false;
            //this._lastAddedRow = [];
            // this._sceneObjectGenerator.ResetGenerator();
            // this._sceneObjectGenerator.SetCurrentThresholds(this._currentArea);
            this._playerBall.ResetBall();
            this.initCamera();
            this._prevLevelValue = 0;
            this._nextLevelValue = 0;
            this._distanceWithinLevel = 0;
            this._distToObstacleGen = 0;
            //this._nextLevelLineHeightAdd = (this.game.camera.y + this.game.camera.height) - this._playerBall.y;
            this._offsetFromBottom = this._playerBall.y;
            this.setNextLevelLine(true);
            //this._playerBall.ResetBall();
            //this.generateCoin();
            //this._UI.ShowFollowArrow();
            this._UI.ShowUI( /*this._currentLevel + 1*/);
            //this._UI.ShowShockwaveReadySign();
            this._UI.UpdateLivesNum(this._currentLives);
            //this._UI.CreateDarkOverlay();
            this._levelPrepared = true;
        };
        State_game.prototype.clearLevel = function () {
            if (this._sceneObjectsLayer.length > 0) {
                for (var i = this._sceneObjectsLayer.length - 1; i >= 0; i--) {
                    var item = this._sceneObjectsLayer.children[i];
                    item.KillObjectAndRemoveFromScene();
                }
            }
            if (this._bgLayer.length > 0) {
                for (var i = this._bgLayer.length - 1; i >= 0; i--) {
                    if (this._bgLayer.children[i] instanceof Base.SceneObject) {
                        this._bgLayer.children[i].KillObjectAndRemoveFromScene();
                    }
                }
            }
        };
        State_game.prototype.clearBalls = function () {
            for (var i = this._enemyBalls.length - 1; i >= 0; i--) {
                this._enemyBalls[i].KillObjectAndRemoveFromScene();
            }
            this._enemyBalls = [];
        };
        State_game.prototype.resetGame = function () {
            if (!this._levelPrepared) {
                this.prepareLevel();
            }
            this.game.physics.arcade.isPaused = false;
            if (this._UI.IsTutorialShowing())
                this._UI.KillCurrentTutorial();
            if (this._gameStart) {
                this._gameStart = false;
                if (!App.Global.soundOn) {
                    this._UI.ShowSoundNotifyScreen(this.afterSoundNotifyShow, this);
                    return;
                }
            }
            this._playState = ePlayState.PLAY;
            //call score add each half second
            if (App.Global.GAMEE)
                this._scoreAddLoopEvent = this.game.time.events.loop(500, this.commitScore, this);
            if (this._tutorialPlayed) {
                this.createBalls();
                this.computeSpeedAndApply(false);
                Base.AudioPlayer.Instance.PlayMusic(DiscoBall.StringConstants.MUSIC_MAIN);
            }
            else {
                this._tutorialPlaying = true;
                this._tutorialPart = 1;
                this._UI.ShowTutorialScreen(this._tutorialPart, this.onTutorialShowed.bind(this));
            }
            this._UI.UpdateShockwaveBar(0);
            this._UI.UpdateLevel(1);
            this._UI.UpdateLevelBarProgress(0);
            this._gameeFriendsManager.Reset();
            if (this._gameeFriendsManager.NextFriend != null && !this._friendAvatarChanging)
                this._UI.UpdateFriendAvatarScore(this._gameeFriendsManager.NextFriend.highScore);
            this._lightTween.start();
            this._lightTime = 0;
        };
        State_game.prototype.afterSoundNotifyShow = function () {
            this.resetGame();
        };
        State_game.prototype.clearSceneObjectsOutOfScreen = function (arrayToClear, objType) {
            if (arrayToClear.length > 0) {
                for (var i = arrayToClear.length - 1; i >= 0; i--) {
                    var item = arrayToClear[i];
                    if (item.ObjectType === objType && (item.body.y >= this.game.camera.y + this.game.height)) {
                        item.KillObjectAndRemoveFromScene();
                        Utils.ArrayUtils.OneItemSplice(arrayToClear, i);
                    }
                }
            }
        };
        //this handles all balls movement vars
        State_game.prototype.manageEnemyBalls = function () {
            var tmpLastBall = this._enemyBalls[this._enemyBalls.length - 1];
            var tmpFirstLeaderBall = this._enemyBalls[0];
            var zonesArray = [];
            //let numOfElementsInZones: number[] = [];
            //TODO tohle asi neni uplne nutne - my vime, ze prvni element je vzdy prvni v poli
            // a posledni je vzdycky posledni
            for (var i = 0, n = this._enemyBalls.length; i < n; i++) {
                if (zonesArray.indexOf(this._enemyBalls[i].y) == -1) {
                    zonesArray.push(this._enemyBalls[i].y);
                    //numOfElementsInZones.push(1);
                }
                //else numOfElementsInZones[numOfElementsInZones.length-1]++;
            }
            //console.log("fakin zones array: "  + JSON.stringify(numOfElementsInZones));
            if (tmpFirstLeaderBall !== this._leaderEnemyBall) {
                if (this._leaderEnemyBall != null)
                    this._leaderEnemyBall.IsLeader = false;
                this._leaderEnemyBall = tmpFirstLeaderBall;
            }
            if (tmpLastBall !== this._lastEnemyBall)
                this._lastEnemyBall = tmpLastBall;
            //NOTE - _numOfElementsInZones doesnt work well, the numbers are not always accurate... 
            //...but it looks like it doesnt affect gameplay, so I will leave it like it is
            this._numOfElementsInZones = [];
            for (var i = 0, n = zonesArray.length; i < n; i++)
                this._numOfElementsInZones.push(0);
            //TODO mozna pak premistit jinam
            this._zonesMovementManager.ResetZonesArray(zonesArray.length, this._numOfElementsInZones);
            //console.log("DEBUG! NEW LEADER BALL HAS ID VALUE " + this._leaderEnemyBall.ObjectID);
            //mark balls by distance from leaderBalls
            this._leaderEnemyBall.IsLeader = true;
            this._leaderEnemyBall.SetZone(0);
            //this._numOfElementsInZones[0]++;
            this._lastEnemyBall.SetZone(zonesArray.length - 1);
            this._numOfElementsInZones[zonesArray.length - 1]++;
            this._framesFromStart = 0;
            // let arrayToBeCopied: number[] = [];
            // let framesfromStart: number = 0;
            for (var i = 0, n = this._enemyBalls.length; i < n; i++) {
                var element = this._enemyBalls[i];
                if (!element.IsLeader && element !== this._lastEnemyBall) {
                    //let zoneNum = Math.round((element.y-this._leaderEnemyBall.y)/this._sceneObjectGenerator.BallWidth);
                    //console.log("setting zoneNum to " + zoneNum);
                    //console.log("Other ball zone: " + (element.y-this._leaderEnemyBall.y)/this._sceneObjectGenerator.BallWidth);
                    //element.SetZone(Math.round((element.y-this._leaderEnemyBall.y)/this._sceneObjectGenerator.BallWidth));
                    var zoneNum = zonesArray.indexOf(element.y);
                    element.SetZone(zoneNum);
                    this._numOfElementsInZones[zoneNum]++;
                }
                element.body.velocity.x = 0;
            }
        };
        State_game.prototype.computeSpeedAndApply = function (speedUp) {
            if (speedUp) {
                if (this._level < 9)
                    this._currentPlayerSpeed += GameOptions.SPEED_ADDITION_NORMAL;
                else
                    this._currentPlayerSpeed += GameOptions.SPEED_ADDITION_LOW;
            }
            var absPlayerSpeed = Math.abs(this._currentPlayerSpeed);
            this._currentEnemySpeed = absPlayerSpeed + (absPlayerSpeed * GameOptions.ENEMY_BALLS_SPEED_ADDITION);
            // console.log("current player speed now: " + this._currentPlayerSpeed);
            // console.log("current enemy speed now: " + this._currentEnemySpeed);
            this._playerBall.SetMoveUpVelocity(this._currentPlayerSpeed);
        };
        State_game.prototype.manageShockwaveTap = function (pointer, doubleTap) {
            if (this._afterVideoWatchWait) {
                this._afterVideoWatchWait = false;
                this._UI.HideAfterVideoWatchText();
                //check if we watched the whole video - if so, there are no crates on scene
                if (this._videoWatchStatus === UI.eAfterVideoState.WATCHED_PARTIALLY) { //TODO tohle se musi zmenit
                    this.commitEndPart1();
                }
                else {
                    this._gameOver = false;
                    this._playerBall.SetToAfterCrashMode();
                    this.computeSpeedAndApply(false);
                    Base.AudioPlayer.Instance.PlayMusic(DiscoBall.StringConstants.MUSIC_MAIN);
                    if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS)
                        Gamee.Gamee.instance.LoadRewardedVideo();
                }
            }
            else if (this._readyForShockwave && !this._gameOver && !this._UI.IsTutorialShowing()) {
                this.doTheShockWave(true);
            }
        };
        State_game.prototype.doTheShockWave = function (doTheBigOne) {
            Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_SHOCKWAVE);
            //console.log("DO THE SHOCKWAVE!!!!");
            this._playerBall.DoTheShockWave(doTheBigOne);
            this.camera.flash(0xffffff, 150);
            this.camera.shake(0.03, 150);
            this._currentStarsTaken = 0;
            this._readyForShockwave = false;
            this._UI.UpdateShockwaveBar(0);
            this._UI.HideShockwaveReadySign();
        };
        State_game.prototype.initCamera = function () {
            this.game.camera.position = new Phaser.Point(0, 0);
            //set camera follow - set camera bounds to null to allow move outside of world bounds
            this.game.camera.bounds = null;
            this.game.camera.follow(this._playerBall, 0.5, 0.5);
            this.game.camera.deadzone = new Phaser.Rectangle(-this.game.world.width * 1.5, this._offsetFromTop, 4 * this.game.world.width, 2 * this.game.world.height);
            this._lastCamPos = this.game.camera.y;
        };
        State_game.prototype.commitScore = function () {
            //console.log("adding score, compare " + this._score + " with " + this._prevAddedScore);
            if (this._score !== this._prevAddedScore) {
                Gamee.Gamee.instance.setScore(this._score);
                this._prevAddedScore = this._score;
                if (this._gameeFriendsManager.NextFriend != null && !this._friendAvatarChanging)
                    this._UI.UpdateFriendAvatarScore(this._gameeFriendsManager.NextFriend.highScore - this._score);
                if (this._gameeFriendsManager.NextFriend != null && this._score > this._gameeFriendsManager.NextFriend.highScore && !this._friendAvatarChanging) {
                    this._friendAvatarChanging = true;
                    this._gameeFriendsManager.AddCurrentFriendToDefeated();
                    this._UI.UpdateFriendAvatarScore(0);
                    this._UI.PlayFriendAvatarDefeatAnim(this.createFriendAvatarBadge.bind(this));
                    //this.createFriendAvatarBadge();
                }
            }
        };
        State_game.prototype.setNextLevelLine = function (onStart) {
            //console.log("GameeTest, setting nextlevel line. Next level value: " + this._nextLevelValue + ", currentScoreMetersRation: " + this._currentScoreMetersRatio);
            //this._nextLevelRealValue = this._nextLevelValue * this._currentScoreMetersRatio;
            //this._nextLevelValue = (this._startCamPos + this._nextLevelLineHeightAdd) - this._nextLevelRealValue;
            this._nextLevelValue = GameOptions.BASE_LEVEL_DISTANCE + (this._level * GameOptions.DISTANCE_ADDITION_PER_LEVEL);
            if (onStart)
                this._distanceToNextLevel = this._nextLevelValue + this._playerBall.y;
            //console.log("0: NEXT LEVEL HEIGHT ADD IS " + this._nextLevelLineHeightAdd);
            //console.log("1: NEXT LEVEL VAL TO SET IS " + this._nextLevelValue);
            this._nextLevelValue = /*this._offsetFromBottom*/ -this._prevLevelValue - this._nextLevelValue;
            //console.log("2: NEXT LEVEL VAL TO SET IS " + this._nextLevelValue);
            this._scoreAddInNextLevel = GameOptions.SCORE_ADDITION_PER_LEVEL * (this._level + 1);
            this._levelLine.SetLine(this._nextLevelValue, this._level + 2, this._scoreAddInNextLevel);
            this._nextLevelReached = false;
        };
        State_game.prototype.endGame = function () {
            Base.AudioPlayer.Instance.StopSound(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM);
            Base.AudioPlayer.Instance.StopMusic();
            Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_GAME_OVER);
            this._gameOver = true;
            this._playerBall.ShowDeathAnim();
            //Base.AudioPlayer.Instance.PlaySound(StringConstants.SOUND_GAME_OVER);
            this.game.time.events.add(1000, function () {
                if (App.Global.GAMEE) {
                    // if (!this._videoRewardShown && this._tutorialPlayed)
                    //   this._UI.ShowVideoOfferWindow(this.onVideoOfferClosed.bind(this));
                    // else this.commitEndPart1();
                    //TODO uncomment in the final version
                    if (App.Global.GAMEE && Gamee.Gamee.instance.VideoLoaded && !this._videoRewardShown && this._tutorialPlayed) {
                        this._UI.ShowVideoOfferWindow(this.onVideoOfferClosed.bind(this));
                        if (App.Global.LOG_EVENTS) {
                            Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_VIDEO_OFFER_SHOW, "");
                        }
                    }
                    else {
                        this.commitEndPart1();
                    }
                }
                else {
                    //this.resetCatAndCamPosition();
                    //this._playState = ePlayState.FORCE_RESET;
                    //this.resetGame();
                    this.commitEndPart1();
                }
            }, this);
        };
        State_game.prototype.commitEndPart1 = function () {
            if (this._scoreAddLoopEvent != null) {
                this.game.time.events.remove(this._scoreAddLoopEvent);
                //Gamee.Gamee.instance.setScore(this._score);
                this.commitScore();
            }
            //console.log("GameeTest: STATE GAME, commit end Part1, defeated friends? " + JSON.stringify(this._gameeFriendsManager.DefeatedFriends));
            if (this._gameeFriendsManager.DefeatedFriends.length > 0 && Gamee.Gamee.instance.GameContext != Gamee.eGameContext.BATTLE && Gamee.Gamee.instance.Platform != Gamee.eGamePlatform.WEB && Gamee.Gamee.instance.Platform != Gamee.eGamePlatform.MOBILE_WEB) {
                //this._UI.ShowShareWindow("Coco Džambo", this._gameeFriendsManager.DefeatedFriends, this.commitEndPart2.bind(this));
                this._UI.ShowShareWindow(Gamee.Gamee.instance.PlayerData.name, this._gameeFriendsManager.DefeatedFriends, this.commitEndPart2.bind(this));
            }
            else
                this.commitEndPart2();
        };
        State_game.prototype.commitEndPart2 = function () {
            this._levelPrepared = false;
            this.game.camera.follow(null);
            this._playState = ePlayState.GAMEE_LAYER;
            //this.saveGameStats();
            if (App.Global.GAMEE)
                Gamee.Gamee.instance.gameOver();
            else
                this._playState = ePlayState.FORCE_RESET;
        };
        State_game.prototype.onGameePause = function () {
            //console.log("HEEEJ!!! PAUSE!!!");
            this.game.paused = true;
        };
        State_game.prototype.onGameeUnpause = function () {
            //console.log("HEEEJ!!! RESUME!!!");
            this.game.paused = false;
        };
        //This is called from Gamee framework as start event callback
        State_game.prototype.onGameeRestart = function (resetState, replay, ghostMode) {
            //console.log("GAMEE START signal CALLBACK!!!!!!!!!!!!!");
            //reset during game
            if (this._playState == ePlayState.PLAY) {
                this._levelPrepared = false;
                Base.AudioPlayer.Instance.StopMusic();
            }
            this._playState = ePlayState.FORCE_RESET;
            App.Global.game.paused = false;
        };
        //This is called on first game start
        State_game.prototype.prepareGameData = function () {
            this._gameStart = true;
            var currentSaveState = Gamee.Gamee.instance.saveState;
            if (currentSaveState == null) {
                this._tutorialPlayed = false;
            }
            else {
                this._tutorialPlayed = currentSaveState.tutorialPlayed == undefined ? false : currentSaveState.tutorialPlayed;
            }
            //TODO comment later
            //this._tutorialPlayed = true;
            this.prepareLevel();
        };
        State_game.prototype.saveGameStats = function () {
            var dataToSave = {
                //playerLevel: this._currentLevel,
                //playerArea: this._currentArea,
                tutorialPlayed: this._tutorialPlayed
            };
            Gamee.Gamee.instance.gameSave(JSON.stringify(dataToSave));
        };
        State_game.prototype.onTutorialShowed = function (tutorialPart) {
            //console.log("TUTORIAL NUMBER " + tutorialPart + " DONE!");
            if (tutorialPart === 1) {
                Base.AudioPlayer.Instance.PlayMusic(DiscoBall.StringConstants.MUSIC_MAIN);
                this.computeSpeedAndApply(false);
                if (App.Global.LOG_EVENTS) {
                    Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_TUTORIAL_PART1_DONE, "");
                }
            }
            else if (tutorialPart === 2) {
                this._tutorialPart = 3;
                this.resumeMovingCrates();
                this.game.physics.arcade.isPaused = false;
                if (App.Global.LOG_EVENTS) {
                    Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_TUTORIAL_PART2_DONE, "");
                }
            }
            else if (tutorialPart === 3) {
                this.resumeMovingCrates();
                this.game.physics.arcade.isPaused = false;
                this._tutorialPlayed = true;
                this._tutorialPlaying = false;
                this._tutorialPart = 0;
                this.saveGameStats();
                if (App.Global.LOG_EVENTS) {
                    Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_TUTORIAL_END, "");
                }
            }
        };
        State_game.prototype.pauseMovingCrates = function () {
            for (var i = 0, n = this._cratesOnScene.length; i < n; i++) {
                if (this._cratesOnScene[i].IsTweening()) {
                    this._cratesOnScene[i].PauseTween();
                }
            }
        };
        State_game.prototype.resumeMovingCrates = function () {
            for (var i = 0, n = this._cratesOnScene.length; i < n; i++) {
                if (this._cratesOnScene[i].IsTweening()) {
                    this._cratesOnScene[i].ResumeTween();
                }
            }
        };
        State_game.prototype.onVideoOfferClosed = function (videoWatched) {
            this._videoWatchStatus = videoWatched;
            this._videoRewardShown = true;
            var eventLogStatus;
            if (this._videoWatchStatus === UI.eAfterVideoState.NOT_WATCHED) {
                eventLogStatus = "notWatched";
                if (App.Global.LOG_EVENTS)
                    Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_VIDEO_OFFER_CLICK, eventLogStatus);
                this.commitEndPart1();
            }
            else {
                if (this._videoWatchStatus === UI.eAfterVideoState.WATCHED_WHOLE) {
                    this._playerBall.ResetAppearance();
                    this.clearBalls();
                    this.createBalls();
                    if (this._currentLives === 0) {
                        this._currentLives++;
                        this._UI.UpdateLivesNum(this._currentLives);
                    }
                    eventLogStatus = "watchedWhole";
                }
                else
                    eventLogStatus = "watchedPartially";
                this._enemyRedLine.visible = false;
                this._afterVideoWatchWait = true;
                this._UI.ShowAfterVideoWatchText();
                if (App.Global.LOG_EVENTS)
                    Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_VIDEO_OFFER_CLICK, eventLogStatus);
            }
        };
        return State_game;
    }(Phaser.State));
    DiscoBall.State_game = State_game;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
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
            //this.game.load.image(StringConstants.SPRITE_MAP_BG1, spritesPath + "environment/tilesBg/bg_tails.png");
            this.game.load.spritesheet(DiscoBall.StringConstants.SPRITE_BALL_PLAYER, spritesPath + "items/playerBall_sheet.png", 120, 120);
            this.game.load.spritesheet(DiscoBall.StringConstants.SPRITESHEET_BALL_PLAYER_DEATH, spritesPath + "items/playerBall_death_sheet.png", 180, 230);
            this.game.load.spritesheet(DiscoBall.StringConstants.SPRITESHEET_TUTORIAL_HAND, spritesPath + "UI/tutorialHand.png", 128, 125);
            this.game.load.image(DiscoBall.StringConstants.SPRITE_BALL_PLAYER_EFFECT, spritesPath + "items/playerBall_light_effect.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_BALL_PLAYER_SHADOW, spritesPath + "items/playerBall_shadow.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_BALL_ENEMY, spritesPath + "items/enemy_ball.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_BG_LIGHT_LAYER, spritesPath + "environment/bg_light_layer.png");
            //this.game.load.image(StringConstants.SPRITE_BALL_ENEMY_ADDITION, spritesPath + "items/enemy_ball_addition.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_CRATE, spritesPath + "items/crateTest.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_NOTE_COLLECTIBLE, spritesPath + "items/note_collectible.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_SHOCKWAVE_CIRCLE, spritesPath + "items/shockwave_circle.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_LINE, spritesPath + "items/level_line.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_RED_ENEMY_LINE, spritesPath + "items/red_line.png");
            this.game.load.image(DiscoBall.StringConstants.PARTICLE_BALL, spritesPath + "items/ballParticle.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_MAP_BG1, spritesPath + "environment/bg.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_BG_LINES, spritesPath + "environment/lines.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_BG_LIGHTS, spritesPath + "environment/electro_lights.png");
            this.game.load.image(DiscoBall.StringConstants.SPRITE_FRONT_STRIPE, spritesPath + "environment/top_stripe.png");
            //this.game.load.image(StringConstants.UI_ARROW, spritesPath + "UI/arrowTest.png");
            this.game.load.bitmapFont(DiscoBall.StringConstants.FONT_MAINFONT, fontsPath + 'font.png', fontsPath + 'font.fnt');
            this.game.load.bitmapFont(DiscoBall.StringConstants.FONT_UI, fontsPath + 'UIfont.png', fontsPath + 'UIfont.fnt');
            this.game.load.bitmapFont(DiscoBall.StringConstants.FONT_SHARE_SCREEN, fontsPath + 'fontShareScreen.png', fontsPath + 'fontShareScreen.fnt');
            //this.game.load.spritesheet(StringConstants.SPRITESHEET_EXPLOSION, spritesPath + 'items/explosion.png', 376, 260);
            this.game.load.json(DiscoBall.StringConstants.JSON_GAMESETTINGS, 'assets/gameSettings.json');
            //this.game.load.atlas(StringConstants.ATLAS_PLAYER_CAR_EFFECTS, spritesPath + "cars/playerCarEffects.png", spritesPath + "cars/playerCarEffects.json");
            this.game.load.spritesheet(DiscoBall.StringConstants.SPRITESHEET_SPEEDUP, spritesPath + "items/speedUpAnim.png", 128, 214);
            this.game.load.atlas(DiscoBall.StringConstants.ATLAS_CRATES, spritesPath + "items/crateAtlas.png", spritesPath + "items/crateAtlas.json");
            this.game.load.atlas(DiscoBall.StringConstants.UI_ATLAS, spritesPath + "UI/UIatlas.png", spritesPath + "UI/UIatlas.json");
            this.game.load.atlas(DiscoBall.StringConstants.UI_TEXTS_ATLAS, spritesPath + "UI/textsAtlas.png", spritesPath + "UI/textsAtlas.json");
            this.game.load.atlas(DiscoBall.StringConstants.UI_VIDEO_OFFER_ATLAS, spritesPath + "UI/videoRewardAtlas.png", spritesPath + "UI/videoRewardAtlas.json");
            this.game.load.atlas(DiscoBall.StringConstants.UI_SOUND_NOTIFY_ATLAS, spritesPath + "UI/audioNotifyAtlas.png", spritesPath + "UI/audioNotifyAtlas.json");
            this.game.load.atlas(DiscoBall.StringConstants.UI_TUTORIAL_ATLAS, spritesPath + "UI/tutorialAtlas.png", spritesPath + "UI/tutorialAtlas.json");
            this.game.load.atlas(DiscoBall.StringConstants.UI_SHARE_SCREEN_ATLAS, spritesPath + "UI/socialShareAtlas.png", spritesPath + "UI/socialShareAtlas.json");
            this.game.load.audio(DiscoBall.StringConstants.SOUND_CRATE_HIT, audioPath + 'SFX/Barrier_hit.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_STAR_COLLECT, audioPath + 'SFX/Collect_star.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_BUBBLE_DESTROY, audioPath + 'SFX/Destroy_bubble.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_GAME_OVER, audioPath + 'SFX/Game_over.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_LEVEL_DONE, audioPath + 'SFX/Level_success.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_SHOCKWAVE, audioPath + 'SFX/Shockwave.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_SPEED_STRIP, audioPath + 'SFX/Speed_strip.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_CROWD_CHEER, audioPath + 'SFX/destroy_more_balls.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_SHOCKWAVE_READY, audioPath + 'SFX/shockwave_is_ready.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_SHOCKWAVE_BLINK, audioPath + 'SFX/shockwave_blink.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_OFFER_SHOWN, audioPath + 'SFX/offerShown.mp3');
            this.game.load.audio(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM, [audioPath + 'SFX/alarm_loop.ogg', audioPath + 'SFX/alarm_loop.m4a']);
            this.game.load.audio(DiscoBall.StringConstants.MUSIC_MAIN, audioPath + 'Music/music_main.mp3');
            // this.game.load.image(StringConstants.FONT_PLUS_ADDITION, 'assets/fonts/plus.png');
            //add Phaser spine
            // this.game.add.plugin(PhaserSpine.SpinePlugin);
            // this.game.load.spine(StringConstants.SPINE_CAT_ANIM, 'assets/sprites/spineAnims/skeleton.json');
            //we have this sound as gg because we want it to loop
            //this.game.load.audio(StringConstants.SOUND_CAR_ENGINE, [audioPath + 'car_engine_loop.ogg', audioPath + 'car_engine_loop.m4a']);
        };
        State_preload.prototype.create = function () {
            //Add sounds and music to AudioPlayer
            var soundList = [
                DiscoBall.StringConstants.SOUND_CRATE_HIT,
                DiscoBall.StringConstants.SOUND_STAR_COLLECT,
                DiscoBall.StringConstants.SOUND_BUBBLE_DESTROY,
                DiscoBall.StringConstants.SOUND_GAME_OVER,
                DiscoBall.StringConstants.SOUND_LEVEL_DONE,
                DiscoBall.StringConstants.SOUND_SHOCKWAVE,
                DiscoBall.StringConstants.SOUND_SPEED_STRIP,
                DiscoBall.StringConstants.SOUND_SHOCKWAVE_READY,
                DiscoBall.StringConstants.SOUND_SHOCKWAVE_BLINK,
                DiscoBall.StringConstants.SOUND_SPEED_STRIP,
                DiscoBall.StringConstants.SOUND_CROWD_CHEER,
                DiscoBall.StringConstants.SOUND_OFFER_SHOWN,
                DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM
            ];
            var musicList = [
                DiscoBall.StringConstants.MUSIC_MAIN
            ];
            for (var i = 0; i < soundList.length; i++) {
                var snd = this.game.add.sound(soundList[i]);
                snd.allowMultiple = true;
                Base.AudioPlayer.Instance.AddSound(soundList[i], snd);
            }
            Base.AudioPlayer.Instance.SetSoundVolume(DiscoBall.StringConstants.SOUND_BUBBLE_DESTROY, 0.3);
            Base.AudioPlayer.Instance.SetSoundVolume(DiscoBall.StringConstants.SOUND_SHOCKWAVE, 1.5);
            Base.AudioPlayer.Instance.SetSoundVolume(DiscoBall.StringConstants.SOUND_SHOCKWAVE_BLINK, 0.6);
            Base.AudioPlayer.Instance.SetSoundVolume(DiscoBall.StringConstants.SOUND_ENEMY_BALL_ALARM, 0);
            for (var i = 0; i < musicList.length; i++) {
                var music = this.game.add.sound(musicList[i]);
                Base.AudioPlayer.Instance.AddMusic(musicList[i], music);
            }
            this.state.start(DiscoBall.StringConstants.STATE_GAME);
        };
        return State_preload;
    }(Phaser.State));
    DiscoBall.State_preload = State_preload;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var StringConstants = /** @class */ (function () {
        function StringConstants() {
        }
        //states
        StringConstants.STATE_BOOT = "Boot";
        StringConstants.STATE_PRELOAD = "Preload";
        StringConstants.STATE_GAME = "Game";
        //keys to assets
        StringConstants.JSON_GAMESETTINGS = "gameSettings";
        StringConstants.FONT_MAINFONT = "fontMain";
        StringConstants.FONT_UI = "fontUI";
        StringConstants.FONT_SHARE_SCREEN = "fontShareScreen";
        //.cars
        StringConstants.SPRITE_CAR_LIGHTS = "carLights";
        //anims
        StringConstants.ANIM_CAR_NITRO = "animNitro";
        //items
        StringConstants.SPRITE_BALL_PLAYER = "ball_player";
        StringConstants.SPRITE_BALL_PLAYER_SHADOW = "ball_player_shadow";
        StringConstants.SPRITE_BALL_PLAYER_EFFECT = "ball_player_effect";
        StringConstants.SPRITE_BALL_ENEMY = "ball_enemy";
        StringConstants.SPRITESHEET_BALL_PLAYER_DEATH = "ball_player_death";
        StringConstants.SPRITESHEET_TUTORIAL_HAND = "tutorialHand";
        //static readonly SPRITE_BALL_ENEMY_ADDITION: string = "ball_enemy_addition";
        StringConstants.SPRITE_CRATE = "crate";
        StringConstants.SPRITE_NOTE_COLLECTIBLE = "note_collectible";
        StringConstants.SPRITE_POWERUP_SPEEDUP = "speedup";
        StringConstants.SPRITE_SHOCKWAVE_CIRCLE = "shockwaveCircle";
        StringConstants.SPRITE_LINE = "levelLine";
        StringConstants.SPRITE_RED_ENEMY_LINE = "enemyLine";
        StringConstants.ATLAS_CRATES = "cratesAtlas";
        //ANIMS, SPRITESHEETS
        StringConstants.SPRITESHEET_SPEEDUP = "speedupSpritesheet";
        StringConstants.ANIM_SPEEDUP = "apeedupAnim";
        //.particles
        StringConstants.PARTICLE_BALL = "particleBall";
        //.mapBg
        StringConstants.SPRITE_MAP_BG1 = "mapBg1";
        StringConstants.SPRITE_BG_LIGHT_LAYER = "bgLightLayer";
        StringConstants.SPRITE_BG_LINES = "bgLines";
        StringConstants.SPRITE_BG_LIGHTS = "bgLights";
        StringConstants.SPRITE_FRONT_STRIPE = "frontStripe";
        //UI
        StringConstants.UI_ATLAS = "uiAtlas";
        StringConstants.UI_TEXTS_ATLAS = "uiTextAtlas";
        StringConstants.UI_VIDEO_OFFER_ATLAS = "uiVideoOfferAtlas";
        StringConstants.UI_SOUND_NOTIFY_ATLAS = "uiSoundNotifyAtlas";
        StringConstants.UI_TUTORIAL_ATLAS = "uiTutorialAtlas";
        StringConstants.UI_SHARE_SCREEN_ATLAS = "uiShareScreenAtlas";
        //sounds and music
        StringConstants.SOUND_CRATE_HIT = "soundCrateHit";
        StringConstants.SOUND_STAR_COLLECT = "soundStarCollect";
        StringConstants.SOUND_BUBBLE_DESTROY = "soundBubbleDestroy";
        StringConstants.SOUND_GAME_OVER = "soundGameOver";
        StringConstants.SOUND_LEVEL_DONE = "soundLevelDone";
        StringConstants.SOUND_SHOCKWAVE = "soundShockwave";
        StringConstants.SOUND_SPEED_STRIP = "soundSpeedStrip";
        StringConstants.SOUND_CROWD_CHEER = "soundCrowdCheer";
        StringConstants.SOUND_SHOCKWAVE_READY = "soundShockwaveReady";
        StringConstants.SOUND_SHOCKWAVE_BLINK = "soundShockwaveBlink";
        StringConstants.SOUND_OFFER_SHOWN = "soundOfferShown";
        StringConstants.SOUND_ENEMY_BALL_ALARM = "soundEnemyBallAlarm";
        StringConstants.MUSIC_MAIN = "musicMain";
        StringConstants.EVENT_TUTORIAL_PART1_DONE = "tutorialPart1Done";
        StringConstants.EVENT_TUTORIAL_PART2_DONE = "tutorialPart2Done";
        StringConstants.EVENT_TUTORIAL_END = "tutorialEnd";
        StringConstants.EVENT_VIDEO_OFFER_SHOW = "videoOfferShow";
        StringConstants.EVENT_VIDEO_OFFER_CLICK = "videoOfferClick";
        StringConstants.EVENT_HIT = "playerHit";
        StringConstants.EVENT_DEATH = "playerDeath";
        StringConstants.EVENT_SHARE_SHOW = "shareScreenShowed";
        StringConstants.EVENT_SHARE_CLICK = "shareScreenShareClicked";
        return StringConstants;
    }());
    DiscoBall.StringConstants = StringConstants;
})(DiscoBall || (DiscoBall = {}));
var DiscoBall;
(function (DiscoBall) {
    var eTutorialPart;
    (function (eTutorialPart) {
        eTutorialPart[eTutorialPart["START"] = 0] = "START";
        eTutorialPart[eTutorialPart["ONE"] = 1] = "ONE";
        eTutorialPart[eTutorialPart["TWO"] = 2] = "TWO";
        eTutorialPart[eTutorialPart["THREE"] = 3] = "THREE";
        eTutorialPart[eTutorialPart["FOUR"] = 4] = "FOUR";
        eTutorialPart[eTutorialPart["BETWEEN_PARTS"] = 5] = "BETWEEN_PARTS";
    })(eTutorialPart = DiscoBall.eTutorialPart || (DiscoBall.eTutorialPart = {}));
    var TutorialController = /** @class */ (function () {
        function TutorialController() {
        }
        return TutorialController;
    }());
    DiscoBall.TutorialController = TutorialController;
})(DiscoBall || (DiscoBall = {}));
var UI;
(function (UI) {
    var BlinkingSprite = /** @class */ (function (_super) {
        __extends(BlinkingSprite, _super);
        function BlinkingSprite(game, xPos, yPos, atlasKey, frameBottom, frameTop) {
            var _this = _super.call(this, game, xPos, yPos, atlasKey, frameBottom) || this;
            _this._blinkingEvent = null;
            _this._topSprite = null;
            _this.anchor.set(0.5);
            _this._topSprite = _this.game.add.sprite(0, 0, atlasKey, frameTop);
            _this._topSprite.anchor.set(0.5);
            _this.addChild(_this._topSprite);
            _this.SetToDefaultState();
            return _this;
        }
        BlinkingSprite.prototype.SetToDefaultState = function () {
            if (this._blinkingEvent != null) {
                this.game.time.events.remove(this._blinkingEvent);
                this._blinkingEvent = null;
            }
            this._topSprite.visible = false;
        };
        BlinkingSprite.prototype.StartBlinking = function () {
            this._blinkingEvent = this.game.time.events.loop(150, this.blink, this);
        };
        BlinkingSprite.prototype.blink = function () {
            this._topSprite.visible = !this._topSprite.visible;
            if (this._topSprite.visible)
                Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_SHOCKWAVE_BLINK);
        };
        return BlinkingSprite;
    }(Phaser.Sprite));
    UI.BlinkingSprite = BlinkingSprite;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var CircularProgressBar = /** @class */ (function (_super) {
        __extends(CircularProgressBar, _super);
        function CircularProgressBar(game, xPos, yPos, atlasKey, baseFrameName, totalNumOfSprites) {
            var _this = _super.call(this, game, xPos, yPos, atlasKey, baseFrameName + "0") || this;
            _this._frameNamesList = [];
            _this.anchor.set(0.5);
            _this._totalNumOfSprites = totalNumOfSprites;
            _this._baseFrameName = baseFrameName;
            _this._levelNum = _this.game.add.bitmapText(0, 0, DiscoBall.StringConstants.FONT_UI, "1", 40);
            _this._levelNum.anchor.set(0.5, 0.5);
            var lvlText = _this.game.add.bitmapText(0, _this.height * .2, DiscoBall.StringConstants.FONT_UI, "LVL", 18);
            lvlText.anchor.set(0.5);
            _this.addChild(_this._levelNum);
            _this.addChild(lvlText);
            for (var i = 0; i <= _this._totalNumOfSprites; i++) {
                _this._frameNamesList.push(baseFrameName + i.toString());
            }
            return _this;
        }
        CircularProgressBar.prototype.SetNewLevel = function (level) {
            this._levelNum.text = level.toString();
        };
        CircularProgressBar.prototype.UpdateProgress = function (ratio) {
            var indexToArr = Math.round(this._totalNumOfSprites * ratio);
            if (this.frameName != this._frameNamesList[indexToArr])
                this.frameName = this._frameNamesList[indexToArr];
        };
        return CircularProgressBar;
    }(Phaser.Sprite));
    UI.CircularProgressBar = CircularProgressBar;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var ComboNum = /** @class */ (function (_super) {
        __extends(ComboNum, _super);
        function ComboNum(game, posX, posY, fontKey, size) {
            var _this = _super.call(this, game, posX, posY, fontKey, "0", size) || this;
            //small x illusion - some fonts are rendered big as default, this is here for workaround
            var smallX = game.add.bitmapText(0, -2, fontKey, "x", size / 1.5);
            smallX.anchor.set(1);
            _this.anchor.set(0, 1);
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
})(UI || (UI = {}));
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
})(UI || (UI = {}));
var UI;
(function (UI) {
    var FriendAvatarBadge = /** @class */ (function (_super) {
        __extends(FriendAvatarBadge, _super);
        function FriendAvatarBadge(game, xPos, yPos, atlasName, playerName, score) {
            var _this = 
            //create bg
            _super.call(this, game, xPos, yPos, atlasName, "bg_badge") || this;
            _this.anchor.set(1, 0.5);
            _this._neededImgWidth = _this.game.width * .11;
            var imgBG = _this.game.add.graphics(0, 0);
            imgBG.beginFill(0xffffff);
            imgBG.drawCircle(-_this.width * .75, 0, _this._neededImgWidth);
            imgBG.endFill();
            _this.addChild(imgBG);
            _this.createAvatarImgWithMask(playerName, false);
            _this._friendImageMask = _this.game.add.graphics(0, 0);
            _this._friendImageMask.beginFill(0xffffff);
            _this._friendImageMask.drawCircle(_this._friendImage.x, _this._friendImage.y, _this._friendImage.width * .9);
            _this._friendImageMask.endFill();
            _this._friendImage.mask = _this._friendImageMask;
            _this.addChild(_this._friendImageMask);
            _this._friendNameText = _this.game.add.bitmapText(-_this.width * .3, -_this.height * .08, DiscoBall.StringConstants.FONT_UI, _this.formatNameString(playerName), 22);
            _this._friendNameText.anchor.set(0.5);
            _this.addChild(_this._friendNameText);
            _this._scoreText = _this.game.add.bitmapText(-_this.width * .3, _this.height * .2, DiscoBall.StringConstants.FONT_UI, score.toString(), 26);
            _this._scoreText.anchor.set(0.5);
            _this.addChild(_this._scoreText);
            _this._sadEmoticon = _this.game.add.sprite(-_this.width * .62, _this.height * .23, atlasName, "smile_lose");
            _this._sadEmoticon.anchor.set(0.5);
            _this.addChild(_this._sadEmoticon);
            _this._sadEmoticon.visible = false;
            return _this;
        }
        FriendAvatarBadge.prototype.RefreshBadge = function (newName, newScore) {
            this._sadEmoticon.visible = false;
            this.createAvatarImgWithMask(newName, true);
            this._friendNameText.text = this.formatNameString(newName);
            this._scoreText.text = newScore.toString();
        };
        FriendAvatarBadge.prototype.PlayDefeatedAnim = function (callback) {
            this._sadEmoticon.visible = true;
            this.game.add.tween(this._sadEmoticon.scale).from({ x: 1.5, y: 1.5 }, 800, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._sadEmoticon).from({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
        };
        FriendAvatarBadge.prototype.UpdateFriendScore = function (score) {
            this._scoreText.text = score.toString();
        };
        FriendAvatarBadge.prototype.createAvatarImgWithMask = function (playerName, useMask) {
            if (this._friendImage != null)
                this._friendImage.destroy();
            this._friendImage = this.game.add.sprite(-this.width * .75, 0, playerName);
            this._friendImage.anchor.set(0.5);
            this._friendImage.scale.set(this._neededImgWidth / this._friendImage.width, this._neededImgWidth / this._friendImage.height);
            this.addChildAt(this._friendImage, 1);
            if (useMask)
                this._friendImage.mask = this._friendImageMask;
        };
        FriendAvatarBadge.prototype.formatNameString = function (name) {
            return Utils.StringUtils.RemoveDiacriticsFromString(name.split(' ')[0]).slice(0, 8).toUpperCase();
        };
        return FriendAvatarBadge;
    }(Phaser.Sprite));
    UI.FriendAvatarBadge = FriendAvatarBadge;
})(UI || (UI = {}));
var UI;
(function (UI) {
    /**
     * Bar with stack of items, can be used as life/ammo bar. Goes from left to right
     */
    var ItemBar = /** @class */ (function (_super) {
        __extends(ItemBar, _super);
        function ItemBar(game, xPos, yPos, atlasKey, bgKey, itemKey, numOfElements) {
            var _this = _super.call(this, game, xPos, yPos, atlasKey, bgKey) || this;
            _this._blinkLastElement = true;
            _this._blinkingEvent = null;
            _this._items = [];
            _this.anchor.set(0.5);
            _this._maxElements = numOfElements;
            var numOfGaps = numOfElements - 1;
            var gapWidth = (_this.width / numOfElements);
            var from = (numOfGaps / 2) * -1;
            var to = numOfGaps / 2;
            for (var i = from; i <= to; i += 1) {
                var itemSprite = _this.game.add.sprite(i * gapWidth, -2, atlasKey, itemKey);
                itemSprite.anchor.set(0.5);
                _this.addChild(itemSprite);
                _this._items.push(itemSprite);
            }
            return _this;
        }
        ItemBar.prototype.SetItemsActive = function (numOfElementsActive) {
            var activeArrElemnts = this._maxElements - numOfElementsActive;
            for (var i = 0; i < this._items.length; i++) {
                if (i >= activeArrElemnts)
                    this._items[i].revive();
                else
                    this._items[i].kill();
            }
            if (this._blinkLastElement) {
                if (numOfElementsActive == 1 && this._blinkingEvent == null) {
                    this._blinkingEvent = this.game.time.events.loop(300, this.blink, this);
                }
                else if (numOfElementsActive != 1 && this._blinkingEvent != null) {
                    this.game.time.events.remove(this._blinkingEvent);
                    this._blinkingEvent = null;
                }
            }
        };
        ItemBar.prototype.blink = function () {
            this._items[this._maxElements - 1].visible = !this._items[this._maxElements - 1].visible;
        };
        return ItemBar;
    }(Phaser.Sprite));
    UI.ItemBar = ItemBar;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var ProgressBar = /** @class */ (function (_super) {
        __extends(ProgressBar, _super);
        function ProgressBar(game, xPos, yPos, frontImg, fillImg, fxImg, maxFillConst, fillArrow, barText) {
            var _this = _super.call(this, game) || this;
            _this._fullFillWidth = 0;
            _this._fullArrowWidth = 0;
            _this._progressFront = game.add.sprite(xPos, yPos, frontImg);
            _this._progressFront.anchor.set(0, 0.5);
            //this._progressFront.scale.set(0.47);
            if (barText != null) {
                _this._text = _this.game.add.bitmapText(_this._progressFront.left + _this._progressFront.width * .01, _this._progressFront.top - _this._progressFront.height * .22, DiscoBall.StringConstants.FONT_UNISANS, barText, 30);
                _this._text.anchor.set(0, 0.5);
            }
            _this._progressFill = game.add.sprite(_this._progressFront.left + _this._progressFront.width * .01, _this._progressFront.y, fillImg);
            _this._progressFill.anchor.set(0, 0.5);
            _this._fullFillWidth = _this._progressFront.width * maxFillConst;
            _this._progressFill.width = _this._fullFillWidth;
            if (fillArrow != null) {
                _this._progressFillArrow = game.add.sprite(_this._progressFill.right, _this._progressFill.y, fillArrow);
                _this._progressFillArrow.anchor.set(0, 0.5);
                _this._fullArrowWidth = _this._progressFillArrow.width;
            }
            _this._progressFx = game.add.sprite(xPos, yPos, fxImg);
            _this._progressFx.anchor.set(0, 0.5);
            //this._progressFx.visible = false;
            _this._progressFx.alpha = 0;
            //this._fxTween = this.game.add.tween(this._progressFx).to({alpha: 1}, 100, Phaser.Easing.Linear.None, false, 0, 7, true);
            //this._fxTween.onComplete.add(function() {this._progressFx.alpha = 0}, this);
            // this._textBgLeft = game.add.sprite(this._progressBg.left + this._progressFill.width*.03, this._progressBg.y, NameYourGame.StringConstants.UI_LEVELPROGRESS_NUM_BG);
            // this._textBgLeft.anchor.set(0.5);
            // this._textBgLeft.scale.set(0.5);
            // this._textBgRight = game.add.sprite(this._progressBg.right - this._progressFill.width*.03, this._progressBg.y, NameYourGame.StringConstants.UI_LEVELPROGRESS_NUM_BG);
            // this._textBgRight.anchor.set(0.5);
            // this._textBgRight.scale.set(0.5);
            // this._textLeft = game.add.bitmapText(this._textBgLeft.x, this._textBgLeft.y, NameYourGame.StringConstants.FONT_MAINFONT, "1", 27);
            // this._textLeft.anchor.set(0.6, 0.5);
            // this._textRight = game.add.bitmapText(this._textBgRight.x, this._textBgRight.y, NameYourGame.StringConstants.FONT_MAINFONT, "2", 27);
            // this._textRight.anchor.set(0.6, 0.5);
            // this._progressFill.width = 0;
            _this.add(_this._progressFill);
            if (_this._progressFillArrow)
                _this.add(_this._progressFillArrow);
            _this.add(_this._progressFront);
            _this.add(_this._progressFx);
            // this.add(this._textBgLeft);
            if (_this._text)
                _this.add(_this._text);
            return _this;
            // this.add(this._textBgRight);
            // this.add(this._textRight);
            // this.fixedToCamera = true;
        }
        Object.defineProperty(ProgressBar.prototype, "ProgressBarFrontSprite", {
            get: function () {
                return this._progressFront;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProgressBar.prototype, "Text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        ProgressBar.prototype.UpdateBarProgress = function (elapsedTimeRatio) {
            this._progressFill.width = Math.min(this._fullFillWidth, elapsedTimeRatio * this._fullFillWidth);
            if (this._progressFillArrow != null) {
                this._progressFillArrow.x = this._progressFill.right;
                if (this._progressFill.width <= this._fullArrowWidth) {
                    this._progressFillArrow.scale.set(this._progressFill.width / this._fullArrowWidth, 1);
                }
                else {
                    this._progressFillArrow.scale.set(1);
                }
            }
        };
        ProgressBar.prototype.ShowBlinkFX = function () {
            //console.log("blinking!!!!");
            if (this._fxTween != null && this._fxTween.isRunning) {
                this._fxTween.stop();
                this._progressFx.alpha = 0;
                //this._fxTween.resume();
            }
            this._fxTween = this.game.add.tween(this._progressFx).to({ alpha: 1 }, 150, Phaser.Easing.Linear.None, true, 0, 5, true);
            //else this._fxTween.start();
        };
        return ProgressBar;
    }(Phaser.Group));
    UI.ProgressBar = ProgressBar;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var ScreenTextType;
    (function (ScreenTextType) {
        ScreenTextType[ScreenTextType["DISCO_FEVER"] = 0] = "DISCO_FEVER";
        ScreenTextType[ScreenTextType["INFERNO"] = 1] = "INFERNO";
        ScreenTextType[ScreenTextType["STAYIN_ALIVE"] = 2] = "STAYIN_ALIVE";
        ScreenTextType[ScreenTextType["YOU_ROLL"] = 3] = "YOU_ROLL";
    })(ScreenTextType = UI.ScreenTextType || (UI.ScreenTextType = {}));
    /** Used for generating bitmap texts */
    var ScreenTextsGenerator = /** @class */ (function () {
        function ScreenTextsGenerator(game, layer) {
            this._lastCamPos = 0;
            this._textShowing = false;
            this._game = game;
            this._assignedLayer = layer;
            this._discoFeverText = this.createText("disco_fever");
            this._infernoText = this.createText("Inferno");
            this._stayinAliveText = this.createText("stayin_alive");
            this._youRollText = this.createText("you_roll");
        }
        Object.defineProperty(ScreenTextsGenerator.prototype, "IsTextShowing", {
            get: function () {
                return this._textShowing;
            },
            enumerable: true,
            configurable: true
        });
        ScreenTextsGenerator.prototype.createText = function (nameOfFrame) {
            var textRef = this._game.add.sprite(DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y, DiscoBall.StringConstants.UI_TEXTS_ATLAS, nameOfFrame, this._assignedLayer);
            textRef.anchor.set(0.5);
            textRef.kill();
            return textRef;
        };
        ScreenTextsGenerator.prototype.GenerateText = function (textType) {
            if (textType === ScreenTextType.DISCO_FEVER)
                this._currentlyShowingText = this._discoFeverText;
            else if (textType === ScreenTextType.INFERNO)
                this._currentlyShowingText = this._infernoText;
            else if (textType === ScreenTextType.STAYIN_ALIVE)
                this._currentlyShowingText = this._stayinAliveText;
            else if (textType === ScreenTextType.YOU_ROLL)
                this._currentlyShowingText = this._youRollText;
            if (this._currentlyShowingText != null) {
                this._textShowing = true;
                this._lastCamPos = this._game.camera.y;
                this.doTheTween();
            }
        };
        ScreenTextsGenerator.prototype.doTheTween = function () {
            this._currentlyShowingText.reset(DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y + this._game.height * .4);
            this._currentlyShowingText.alpha = 0;
            this._currentlyShowingText.scale.set(0.6);
            var alphaUpTween = this._game.add.tween(this._currentlyShowingText).to({ "alpha": 1 }, 300, Phaser.Easing.Bounce.Out, true, 0);
            var scaleUpTween = this._game.add.tween(this._currentlyShowingText.scale).to({ "x": 1.4, "y": 1.4 }, 300, Phaser.Easing.Bounce.Out, true, 0);
            var alphaDownTween = this._game.add.tween(this._currentlyShowingText).to({ "alpha": 0 }, 1200, Phaser.Easing.Linear.None, false, 700);
            var scaleDownTween = this._game.add.tween(this._currentlyShowingText.scale).to({ "x": 0.3, "y": 0.3 }, 1200, Phaser.Easing.Linear.None, false, 700);
            alphaUpTween.chain(alphaDownTween);
            scaleUpTween.chain(scaleDownTween);
            scaleDownTween.onComplete.add(function () {
                this._textShowing = false;
                this._currentlyShowingText.kill();
                this._currentlyShowingText = null;
            }, this);
        };
        ScreenTextsGenerator.prototype.MoveTextUp = function () {
            this._currentlyShowingText.y += (this._game.camera.y - this._lastCamPos) * 1.2;
            this._lastCamPos = this._game.camera.y;
        };
        return ScreenTextsGenerator;
    }());
    UI.ScreenTextsGenerator = ScreenTextsGenerator;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var ShareWindow = /** @class */ (function (_super) {
        __extends(ShareWindow, _super);
        function ShareWindow(game, atlasKey, playerName, defeatedFriends) {
            var _this = _super.call(this, game) || this;
            _this.OnWindowClosed = new Phaser.Signal();
            _this._atlasKey = atlasKey;
            var bg = _this.game.add.sprite(DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, _this.game.camera.y + DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT, atlasKey, "bg_2");
            bg.anchor.set(0.5);
            var titleText = _this.game.add.bitmapText(bg.x, bg.top + bg.height * .12, DiscoBall.StringConstants.FONT_SHARE_SCREEN, "I AM THE KING!", 68);
            titleText.anchor.set(0.5);
            titleText.tint = 0x314456;
            var crownImg = _this.game.add.sprite(titleText.x + titleText.width * .25, titleText.top - titleText.height * .17, atlasKey, "crown");
            crownImg.anchor.set(0.5, 1);
            _this._imgToShare = _this.game.add.sprite(bg.x, bg.y - bg.height * .05, atlasKey, "bg");
            _this._imgToShare.anchor.set(0.5);
            // this._imgToShare = this.game.add.sprite(bg.x, bg.y, "imageBgTest");
            // this._imgToShare.anchor.set(0.5);
            var winnerText = _this.createWinnerText(playerName); //TODO change winner texts
            _this._imgToShare.addChild(winnerText);
            var playerBadge = _this.createPlayerBadge(playerName, true);
            var friendBadges = [];
            for (var i = 0; i < defeatedFriends.length; i++) {
                friendBadges.push(_this.createPlayerBadge(defeatedFriends[i], false));
            }
            _this.addPlayerBadgesToImg(playerBadge, friendBadges);
            var shareImgMask = _this.game.add.graphics(0, 0);
            shareImgMask.beginFill(0xffffff);
            shareImgMask.drawRoundedRect(-_this._imgToShare.width / 2, -_this._imgToShare.height / 2, _this._imgToShare.width, _this._imgToShare.height, 50);
            shareImgMask.endFill();
            _this._imgToShare.addChild(shareImgMask);
            _this._imgToShare.mask = shareImgMask;
            _this._imgToShare.angle = -3;
            _this._imgToShare.scale.set(0.8);
            var buttonShare = _this.game.add.button(_this._imgToShare.x, _this._imgToShare.bottom + _this._imgToShare.height * .25, atlasKey, _this.shareGameResults, _this, "share_button_click", "share_button", "share_button_click", "share_button");
            buttonShare.anchor.set(0.5);
            var skipText = _this.game.add.bitmapText(buttonShare.x, buttonShare.y + bg.height * .11, DiscoBall.StringConstants.FONT_SHARE_SCREEN, "SKIP", 32);
            skipText.anchor.set(0.5);
            skipText.tint = 0x000000; //TODO change
            skipText.inputEnabled = true;
            skipText.events.onInputDown.add(_this.onCloseClick, _this);
            _this.add(bg);
            _this.add(titleText);
            _this.add(crownImg);
            _this.add(_this._imgToShare);
            _this.add(buttonShare);
            _this.add(skipText);
            //console.log(Utils.PhaserUtils.GetBase64ImageFromSprite(this._imgToShare));
            //this.add(this.createPlayerBadge(defeatedFriends[1]));
            if (App.Global.LOG_EVENTS)
                Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_SHARE_SHOW, "");
            _this.tweenToScreen();
            return _this;
        }
        ShareWindow.prototype.createWinnerText = function (winnerName) {
            var winName = this.game.add.bitmapText(0, -this._imgToShare.height * .38, DiscoBall.StringConstants.FONT_UI, Utils.StringUtils.RemoveDiacriticsFromString(winnerName.split(' ')[0]).toUpperCase().slice(0, 15), 54);
            winName.anchor.set(0.5);
            winName.tint = 0xffac05;
            var addText = this.game.add.bitmapText(0, winName.height * 1.05, DiscoBall.StringConstants.FONT_UI, "RULES THE DANCE FLOOR!", 44);
            addText.anchor.set(0.5);
            addText.tint = 0xffac05;
            winName.addChild(addText);
            return winName;
        };
        ShareWindow.prototype.addPlayerBadgesToImg = function (playerBadge, friendBadges) {
            if (friendBadges.length > 1) {
                playerBadge.y -= this._imgToShare.height * .07;
                playerBadge.scale.set(0.7);
            }
            else {
                playerBadge.y += this._imgToShare.height * .08;
                playerBadge.x -= this._imgToShare.width * .16;
                playerBadge.scale.set(0.85);
            }
            this._imgToShare.addChild(playerBadge);
            if (friendBadges.length >= 2) {
                friendBadges[0].y += this._imgToShare.height * .12;
                friendBadges[0].x += this._imgToShare.width * .23;
                friendBadges[0].scale.set(friendBadges.length === 2 ? 0.6 : 0.55);
                this._imgToShare.addChild(friendBadges[0]);
                friendBadges[1].y += this._imgToShare.height * .12;
                friendBadges[1].x -= this._imgToShare.width * .23;
                friendBadges[1].scale.set(friendBadges.length === 2 ? 0.6 : 0.55);
                this._imgToShare.addChild(friendBadges[1]);
                if (friendBadges.length === 3) {
                    friendBadges[2].y += this._imgToShare.height * .25;
                    friendBadges[2].scale.set(0.55);
                    this._imgToShare.addChild(friendBadges[2]);
                }
            }
            else {
                friendBadges[0].y += this._imgToShare.height * .08;
                friendBadges[0].x += this._imgToShare.width * .16;
                friendBadges[0].scale.set(0.7);
                this._imgToShare.addChild(friendBadges[0]);
            }
        };
        ShareWindow.prototype.createPlayerBadge = function (friendName, isWinner) {
            var imgBG = this.game.add.graphics(0, 0);
            imgBG.beginFill(0xcb22ff);
            imgBG.drawCircle(0, 0, this.game.width * .28);
            imgBG.endFill();
            var neededWidth = imgBG.width;
            var friendIMG = this.game.add.sprite(0, 0, friendName);
            friendIMG.anchor.set(0.5);
            friendIMG.scale.set(neededWidth / friendIMG.width, neededWidth / friendIMG.height);
            var imgMask = this.game.add.graphics(0, 0);
            imgMask.beginFill(0xffffff);
            imgMask.drawCircle(0, 0, friendIMG.width * .88);
            imgMask.endFill();
            friendIMG.mask = imgMask;
            imgBG.addChild(imgMask);
            var smileEmoticon = this.game.add.sprite(friendIMG.x + friendIMG.width * .3, friendIMG.y + friendIMG.height * .4, this._atlasKey, isWinner ? "smile_win" : "smile_lose");
            smileEmoticon.anchor.set(0.5, 1);
            var nameText = this.game.add.bitmapText(0, friendIMG.height * .6, DiscoBall.StringConstants.FONT_UI, Utils.StringUtils.RemoveDiacriticsFromString(friendName.split(' ')[0]).toUpperCase().slice(0, 15), 32);
            nameText.anchor.set(0.5);
            nameText.tint = 0xffac05;
            var groupFinalGroup = this.game.add.group();
            groupFinalGroup.add(imgBG);
            groupFinalGroup.add(friendIMG);
            groupFinalGroup.add(smileEmoticon);
            groupFinalGroup.add(nameText);
            return groupFinalGroup;
        };
        ShareWindow.prototype.shareGameResults = function () {
            if (App.Global.LOG_EVENTS)
                Gamee.Gamee.instance.logGameEvent(DiscoBall.StringConstants.EVENT_SHARE_CLICK, "");
            var dataToShare = {
                score: null,
                destination: "feed",
                picture: Utils.PhaserUtils.GetBase64ImageFromSprite(this._imgToShare),
                initData: null,
                text: ""
            };
            Gamee.Gamee.instance.Share(dataToShare, this.tweenOutOfScreen.bind(this));
        };
        ShareWindow.prototype.tweenToScreen = function () {
            this.game.add.tween(this).to({
                alpha: 1
            }, 500, Phaser.Easing.Linear.None, true);
        };
        ShareWindow.prototype.tweenOutOfScreen = function () {
            //console.log("GAMEEtest: ShareWindow, tweening out of screen... should be callback!");
            var tweenOut = this.game.add.tween(this).to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, true);
            tweenOut.onComplete.add(function () {
                this.OnWindowClosed.dispatch();
                this.destroy();
            }, this);
        };
        ShareWindow.prototype.onCloseClick = function () {
            this.tweenOutOfScreen();
        };
        return ShareWindow;
    }(Phaser.Group));
    UI.ShareWindow = ShareWindow;
})(UI || (UI = {}));
var UI;
(function (UI) {
    /**
     * Simple progress bar using sprite alpha mask width for progress showing - getting sprites from atlas
     * TODO pri vertikalnim pouziti nutno predelat
     */
    var SimpleAlphaProgressBar = /** @class */ (function (_super) {
        __extends(SimpleAlphaProgressBar, _super);
        function SimpleAlphaProgressBar(game, xPos, yPos, atlasName, progressBgKey, progressFillKey, orientation, scale) {
            var _this = _super.call(this, game) || this;
            _this._fullFillWidth = 0;
            _this._maskStartX = 0;
            _this._orientation = orientation;
            _this._progressBg = game.add.sprite(xPos, yPos, atlasName, progressBgKey);
            _this._progressBg.anchor.set(0.5);
            if (scale != null)
                _this._progressBg.scale.set(scale);
            if (_this._orientation == UI.ProgressBarOrientation.HORIZONTAL) {
                _this._progressFill = game.add.sprite(_this._progressBg.left + 2, _this._progressBg.y, atlasName, progressFillKey);
                _this._progressFill.anchor.set(0, 0.5);
            }
            else {
                _this._progressFill = game.add.sprite(_this._progressBg.x, _this._progressBg.bottom - 2, atlasName, progressFillKey);
                _this._progressFill.anchor.set(0.5, 1);
            }
            _this._fillMask = _this.game.add.graphics();
            _this._fillMask.beginFill(0xffffff);
            if (_this._orientation == UI.ProgressBarOrientation.HORIZONTAL) {
                _this._fillMask.drawRect(-_this._progressFill.width, -_this._progressFill.height / 2, _this._progressFill.width, _this._progressFill.height);
                _this._progressFill.addChild(_this._fillMask);
                _this._progressFill.mask = _this._fillMask;
            }
            else {
                _this._progressFill = game.add.sprite(_this._progressBg.x, _this._progressBg.bottom - 2, atlasName, progressFillKey);
                _this._progressFill.anchor.set(0.5, 1);
            }
            _this._maskStartX = _this._fillMask.x;
            _this._fillMask.endFill();
            if (scale != null)
                _this._progressFill.scale.set(scale);
            _this._fullFillWidth = (orientation == UI.ProgressBarOrientation.HORIZONTAL ? _this._progressFill.width : _this._progressFill.height);
            _this.add(_this._progressBg);
            _this.add(_this._progressFill);
            _this.fixedToCamera = true;
            return _this;
        }
        SimpleAlphaProgressBar.prototype.UpdateBarProgress = function (ratio) {
            if (this._orientation == UI.ProgressBarOrientation.HORIZONTAL) {
                var finalPos = this._maskStartX + Math.min(this._fullFillWidth - 2, ratio * (this._fullFillWidth - 2));
                this.game.add.tween(this._fillMask).to({ "x": finalPos }, 250, Phaser.Easing.Linear.None, true);
            }
            else
                this._fillMask.height = Math.min(this._fullFillWidth - 2, ratio * (this._fullFillWidth - 2));
        };
        return SimpleAlphaProgressBar;
    }(Phaser.Group));
    UI.SimpleAlphaProgressBar = SimpleAlphaProgressBar;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var ProgressBarOrientation;
    (function (ProgressBarOrientation) {
        ProgressBarOrientation[ProgressBarOrientation["VERTICAL"] = 0] = "VERTICAL";
        ProgressBarOrientation[ProgressBarOrientation["HORIZONTAL"] = 1] = "HORIZONTAL";
    })(ProgressBarOrientation = UI.ProgressBarOrientation || (UI.ProgressBarOrientation = {}));
    /**
     * Simple progress bar using sprite width for progress showing
     */
    var SimpleProgressBar = /** @class */ (function (_super) {
        __extends(SimpleProgressBar, _super);
        function SimpleProgressBar(game, xPos, yPos, progressBgKey, progressFillKey, orientation, scale) {
            var _this = _super.call(this, game) || this;
            _this._fullFillWidth = 0;
            _this._orientation = orientation;
            _this._progressBg = game.add.sprite(xPos, yPos, progressBgKey);
            _this._progressBg.anchor.set(0.5);
            if (scale != null)
                _this._progressBg.scale.set(scale);
            if (_this._orientation == ProgressBarOrientation.HORIZONTAL) {
                _this._progressFill = game.add.sprite(_this._progressBg.left + 2, _this._progressBg.y, progressFillKey);
                _this._progressFill.anchor.set(0, 0.5);
            }
            else {
                _this._progressFill = game.add.sprite(_this._progressBg.x, _this._progressBg.bottom - 2, progressFillKey);
                _this._progressFill.anchor.set(0.5, 1);
            }
            if (scale != null)
                _this._progressFill.scale.set(scale);
            _this._fullFillWidth = (orientation == ProgressBarOrientation.HORIZONTAL ? _this._progressFill.width : _this._progressFill.height);
            _this.add(_this._progressBg);
            _this.add(_this._progressFill);
            _this.fixedToCamera = true;
            return _this;
        }
        //TODO maybe add later in another project
        // public CreateText(start: number, end: number): void {
        // }
        // public UpdateText(): void {
        //     if (this._text) {
        //     }
        // }
        SimpleProgressBar.prototype.UpdateBarProgress = function (ratio) {
            if (this._orientation == ProgressBarOrientation.HORIZONTAL)
                this._progressFill.width = Math.min(this._fullFillWidth - 2, ratio * (this._fullFillWidth - 2));
            else
                this._progressFill.height = Math.min(this._fullFillWidth - 2, ratio * (this._fullFillWidth - 2));
        };
        return SimpleProgressBar;
    }(Phaser.Group));
    UI.SimpleProgressBar = SimpleProgressBar;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var SimpleWindow = /** @class */ (function (_super) {
        __extends(SimpleWindow, _super);
        function SimpleWindow(game, xPos, yPos, atlasKey) {
            var _this = _super.call(this, game) || this;
            //should be called when window is ready
            //public OnWindowOpened: Phaser.Signal = new Phaser.Signal();
            _this.OnWindowClosed = new Phaser.Signal();
            _this._game = game;
            _this._bg = game.add.sprite(xPos, yPos, atlasKey, "bg");
            _this._bg.width = _this.game.width;
            _this._bg.height = _this.game.height;
            _this._bg.anchor.setTo(0.5);
            // this._bg.inputEnabled = true;
            // this._bg.events.onInputDown.add(this.onCloseClick, this);
            var headphonesImg = _this.game.add.sprite(xPos - _this.game.width * .1, yPos, atlasKey, "headphones");
            headphonesImg.anchor.set(0.5);
            headphonesImg.angle = 10;
            _this.game.add.tween(headphonesImg).to({ angle: -10 }, 800, Phaser.Easing.Linear.None, true, 0, -1, true);
            _this.game.add.tween(headphonesImg.scale).to({ x: 1.1, y: 1.1 }, 800, Phaser.Easing.Linear.None, true, 0, -1, true);
            //headphonesImg.
            var textStuff = _this.game.add.bitmapText(headphonesImg.right + headphonesImg.width * .2, headphonesImg.y, DiscoBall.StringConstants.FONT_UI, "AWESOME\nWITH\nMUSIC", 34);
            textStuff.anchor.set(0, 0.4);
            _this.add(_this._bg);
            _this.add(headphonesImg);
            _this.add(textStuff);
            //this.add(closeButton);
            //this.x = this.game.width;
            _this.alpha = 0;
            _this.tweenToScreen();
            return _this;
        }
        SimpleWindow.prototype.tweenToScreen = function () {
            this._game.add.tween(this).to({
                alpha: 1
            }, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(function () {
                this.game.time.events.add(2000, this.tweenOutOfScreen, this);
            }, this);
        };
        SimpleWindow.prototype.tweenOutOfScreen = function () {
            var tweenOut = this._game.add.tween(this).to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, true);
            tweenOut.onComplete.add(function () {
                this.OnWindowClosed.dispatch();
                this.destroy();
            }, this);
        };
        SimpleWindow.prototype.onCloseClick = function () {
            this.tweenOutOfScreen();
        };
        return SimpleWindow;
    }(Phaser.Group));
    UI.SimpleWindow = SimpleWindow;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var TutorialWindow = /** @class */ (function (_super) {
        __extends(TutorialWindow, _super);
        function TutorialWindow(game, xPos, yPos, atlasKey, tutorialPart) {
            var _this = _super.call(this, game) || this;
            //should be called when window is ready
            //public OnWindowOpened: Phaser.Signal = new Phaser.Signal();
            _this.OnWindowClosed = new Phaser.Signal();
            _this._game = game;
            _this._bg = game.add.sprite(xPos, yPos, DiscoBall.StringConstants.UI_SOUND_NOTIFY_ATLAS, "bg");
            _this._bg.width = _this.game.width;
            _this._bg.height = _this.game.height;
            _this._bg.anchor.setTo(0.5);
            // this._bg.inputEnabled = true;
            // this._bg.events.onInputDown.add(this.onCloseClick, this);
            var img = _this.game.add.sprite(xPos, yPos, atlasKey, "screen_" + tutorialPart);
            img.anchor.set(0.5);
            _this._currentPart = tutorialPart;
            //headphonesImg
            var noteIcon = null;
            var textStuff;
            var dragHand = null;
            var ballDrag = null;
            if (tutorialPart == 1) {
                textStuff = _this.game.add.bitmapText(xPos, img.top - _this.game.height * .06, DiscoBall.StringConstants.FONT_UI, "DRAG TO MOVE\nAND AVOID THE BLOCKS", 34);
                dragHand = _this.game.add.sprite(img.left + img.width * .25, img.bottom - img.height * .3, DiscoBall.StringConstants.SPRITESHEET_TUTORIAL_HAND, 0);
                dragHand.anchor.set(0.5);
                ballDrag = _this.game.add.sprite(dragHand.x - dragHand.width * .3, dragHand.y - img.height * .2, DiscoBall.StringConstants.SPRITE_BALL_PLAYER, 0);
                ballDrag.anchor.set(0.5);
                _this.game.add.tween(ballDrag).to({ x: img.right - img.width * .25 }, 1500, Phaser.Easing.Linear.None, true, 0, -1, true);
                _this.game.add.tween(dragHand).to({ x: img.right - img.width * .2 }, 1500, Phaser.Easing.Linear.None, true, 0, -1, true);
            }
            else if (tutorialPart == 2) {
                textStuff = _this.game.add.bitmapText(xPos, img.top - _this.game.height * .06, DiscoBall.StringConstants.FONT_UI, "WATCH OUT FOR RED BALLS!\nTHEY WANT TO WRECK THE PARTY!", 34);
            }
            else if (tutorialPart == 3) {
                textStuff = _this.game.add.bitmapText(xPos, img.top - _this.game.height * .06, DiscoBall.StringConstants.FONT_UI, "3x       = PARTY POWER!", 34);
                noteIcon = _this.game.add.sprite(textStuff.x - textStuff.width * .31, textStuff.y, DiscoBall.StringConstants.SPRITE_NOTE_COLLECTIBLE);
                noteIcon.anchor.set(0.5);
                noteIcon.scale.set(0.75);
            }
            textStuff.anchor.set(0.5);
            textStuff.align = "center";
            var buttonOk = _this.game.add.button(_this._bg.x, img.bottom + _this.game.height * .06, atlasKey, _this.onCloseClick, _this, "ok_button_click", "ok_button", "ok_button_click", "ok_button");
            buttonOk.anchor.set(0.5);
            _this.add(_this._bg);
            _this.add(img);
            _this.add(textStuff);
            if (noteIcon != null)
                _this.add(noteIcon);
            if (tutorialPart === 1) {
                _this.add(ballDrag);
                _this.add(dragHand);
            }
            _this.add(buttonOk);
            //this.add(closeButton);
            //this.x = this.game.width;
            _this.alpha = 0;
            _this.tweenToScreen();
            return _this;
        }
        TutorialWindow.prototype.tweenToScreen = function () {
            //Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_OFFER_SHOWN);
            this._game.add.tween(this).to({
                alpha: 1
            }, 750, Phaser.Easing.Linear.None, true);
        };
        TutorialWindow.prototype.tweenOutOfScreen = function () {
            var tweenOut = this._game.add.tween(this).to({
                alpha: 0
            }, 750, Phaser.Easing.Linear.None, true);
            tweenOut.onComplete.add(function () {
                this.OnWindowClosed.dispatch(this._currentPart);
                this.destroy();
            }, this);
        };
        TutorialWindow.prototype.onCloseClick = function () {
            this.tweenOutOfScreen();
        };
        return TutorialWindow;
    }(Phaser.Group));
    UI.TutorialWindow = TutorialWindow;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var UIHandler = /** @class */ (function () {
        //private _levelProgressBar: ProgressBar = null;
        function UIHandler(game, gameSettings, uiLayer, frontLayer) {
            /** Signals for our upgrade buttons */
            this.OnAmmoUpgradeClick = new Phaser.Signal();
            this.OnSpeedboostUpgradeClick = new Phaser.Signal();
            this.OnMagnetUpgradeClick = new Phaser.Signal();
            this._levelBarShown = false;
            this._tapToShockWaveText = null;
            //private _healthProgressBar: SimpleProgressBar = null;
            this._followArrow = null;
            this._uiBg = null;
            this._soundNotifyScreen = null;
            this._tutorialScreen = null;
            this._shockwaveReadySign = null;
            this._levelBar = null;
            this._lifeBar = null;
            this._shareWindow = null;
            //TODO uncomment later
            //private _levelBar: ProgressBar = null;
            //private _currentLevelText: Phaser.BitmapText = null;
            this._healthBar = null;
            this._shockwaveBar = null;
            this._friendAvatarBadge = null;
            this._distanceBar = null;
            this._comboNum = null;
            this._livesNum = null;
            //private _wantedBar: WantedLevelBar = null;
            this._darkEdgesOverlay = null;
            //OLD STUFF VARS - delete later
            this._ammoBar = null;
            this._ammoSprites = [];
            this._ammoOffset = 20;
            // private _magnetBar: Phaser.Group = null;
            // private _magnetBarFullWidth: number;
            this._starBar = null;
            this._game = game;
            this._gameSettings = gameSettings;
            this._UILayer = uiLayer;
            //TODO uncomment when we want the floating score to be visible
            // let takenScoreShowCb = this.killFloatingScoreText;
            // let callbackContext = this;
            // this._floatingScorePool = new Base.Pool<FloatingScore>(UI.FloatingScore, 10, function() {
            //   return new FloatingScore(game,0,0,DiscoBall.StringConstants.FONT_UNISANS, 30, takenScoreShowCb, callbackContext);
            // });
            //console.log("WHAT IS POOL LEN??? " + this._floatingScorePool.Pool.length);
        }
        Object.defineProperty(UIHandler.prototype, "LevelBarShown", {
            get: function () {
                return this._levelBarShown;
            },
            enumerable: true,
            configurable: true
        });
        UIHandler.prototype.ShowShockwaveReadySign = function () {
            this._shockwaveReadySign.StartBlinking();
        };
        UIHandler.prototype.HideShockwaveReadySign = function () {
            this._shockwaveReadySign.SetToDefaultState();
        };
        UIHandler.prototype.ShowVideoOfferWindow = function (onCloseCallback) {
            //Base.AudioPlayer.Instance.PlaySound(AstroCat.StringConstants.SOUND_UNLOCK);
            var videoRewardWindow = new UI.VideoOfferWindow(this._game, DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y + DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT, DiscoBall.StringConstants.UI_VIDEO_OFFER_ATLAS);
            videoRewardWindow.OnWindowClosed.add(onCloseCallback);
        };
        //public ShowTa
        UIHandler.prototype.ShowAfterVideoWatchText = function () {
            this._afterVideoWatchText = this._game.add.bitmapText(this._game.camera.x + DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y + DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT, DiscoBall.StringConstants.FONT_UI, "tap to\ncontinue!", 80);
            this._afterVideoWatchText.anchor.set(0.5);
            this._afterVideoWatchText.align = 'center';
            this._UILayer.add(this._afterVideoWatchText);
        };
        UIHandler.prototype.HideAfterVideoWatchText = function () {
            this._UILayer.remove(this._afterVideoWatchText);
            this._afterVideoWatchText.destroy();
        };
        UIHandler.prototype.ShowUI = function ( /*currentLevel: number*/) {
            if (this._uiBg == null) {
                this._uiBg = this._game.add.sprite(this._game.width / 2, this._game.camera.y, DiscoBall.StringConstants.UI_ATLAS, "bg", this._UILayer);
                this._uiBg.anchor.set(0.5, 0);
                this._uiBg.fixedToCamera = true;
            }
            if (this._shockwaveBar == null)
                this.createShockwaveBar();
            else
                this._shockwaveBar.visible = true;
            if (this._shockwaveReadySign == null) {
                this.createShockwaveReadySign();
            }
            else
                this._shockwaveReadySign.SetToDefaultState();
            // if (this._distanceBar == null)
            //   this.createDistanceBar();
            // else this._distanceBar.visible = true;
            if (this._levelBar === null) {
                this.createLevelBar();
            }
            else
                this._levelBar.visible = true;
            if (this._lifeBar === null)
                this.createLifeBar();
            else
                this._lifeBar.visible = true;
        };
        UIHandler.prototype.UpdateHealthProgressBar = function (ratio, blink) {
            this._healthBar.UpdateBarProgress(ratio);
            if (blink)
                this._healthBar.ShowBlinkFX();
        };
        UIHandler.prototype.UpdateShockwaveBar = function (ratio) {
            this._shockwaveBar.UpdateBarProgress(ratio);
        };
        // public UpdateDistanceBar(ratio: number) {
        //   this._distanceBar.UpdateBarProgress(ratio);
        // }
        UIHandler.prototype.UpdateLevelBarProgress = function (ratio) {
            this._levelBar.UpdateProgress(ratio);
        };
        UIHandler.prototype.UpdateLevel = function (level) {
            this._levelBar.SetNewLevel(level);
        };
        UIHandler.prototype.ShowSoundNotifyScreen = function (callback, callbackContext) {
            this._soundNotifyScreen = new UI.SimpleWindow(this._game, DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT, DiscoBall.StringConstants.UI_SOUND_NOTIFY_ATLAS);
            this._soundNotifyScreen.OnWindowClosed.add(callback, callbackContext);
            this._UILayer.add(this._soundNotifyScreen);
        };
        UIHandler.prototype.ShowTutorialScreen = function (tutorialPart, callback) {
            this._tutorialScreen = new UI.TutorialWindow(this._game, DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y + DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT, DiscoBall.StringConstants.UI_TUTORIAL_ATLAS, tutorialPart);
            this._tutorialScreen.OnWindowClosed.add(function (tutPart) {
                this._tutorialScreen = null;
                callback(tutPart);
            }, this);
            this._UILayer.add(this._tutorialScreen);
        };
        UIHandler.prototype.IsTutorialShowing = function () {
            return this._tutorialScreen == null ? false : true;
        };
        //used just in case of unexpected behaviour
        UIHandler.prototype.KillCurrentTutorial = function () {
            this._tutorialScreen.destroy();
            this._tutorialScreen = null;
        };
        UIHandler.prototype.ShowFriendAvatarBadge = function (friendName, score) {
            //console.log("showing fucking picovina " + friendName);
            //this.HideFriendAvatarBadge();
            if (this._friendAvatarBadge == null) {
                this._friendAvatarBadge = new UI.FriendAvatarBadge(this._game, this._game.width, this._game.camera.y + this._game.height * .14, DiscoBall.StringConstants.UI_SHARE_SCREEN_ATLAS, friendName, score);
                //this._friendAvatarBadge.fixedToCamera = true; //TODO KVULIT TYHLE ZASRANY PICOVINE TO NEJEDE. KURVAAAAAAAAAAAAAAAA
                this._UILayer.add(this._friendAvatarBadge);
                this._friendAvatarBadge.fixedToCamera = true;
            }
            else
                this._friendAvatarBadge.RefreshBadge(friendName, score);
        };
        UIHandler.prototype.UpdateFriendAvatarScore = function (currentScore) {
            if (this._friendAvatarBadge != null) {
                this._friendAvatarBadge.UpdateFriendScore(currentScore);
            }
        };
        UIHandler.prototype.PlayFriendAvatarDefeatAnim = function (afterPlayCallback) {
            if (this._friendAvatarBadge != null) {
                this._friendAvatarBadge.PlayDefeatedAnim(afterPlayCallback);
            }
        };
        UIHandler.prototype.HideFriendAvatarBadge = function () {
            if (this._friendAvatarBadge != null) {
                //console.log("PICO DESTROYING");
                //this._friendAvatarBadge.fixedToCamera = false;
                this._UILayer.remove(this._friendAvatarBadge);
                this._friendAvatarBadge.destroy();
            }
        };
        UIHandler.prototype.ShowShareWindow = function (playerName, friendList, onCloseCallback) {
            this._shareWindow = new UI.ShareWindow(this._game, DiscoBall.StringConstants.UI_SHARE_SCREEN_ATLAS, playerName, friendList);
            this._UILayer.add(this._shareWindow);
            this._shareWindow.OnWindowClosed.add(onCloseCallback);
        };
        UIHandler.prototype.createShockwaveReadySign = function () {
            this._shockwaveReadySign = new UI.BlinkingSprite(this._game, this._shockwaveBar.right + this._game.width * .07, this._shockwaveBar.centerY, DiscoBall.StringConstants.UI_ATLAS, "ready_bg", "ready_fill");
            this._UILayer.add(this._shockwaveReadySign);
            this._shockwaveReadySign.fixedToCamera = true;
        };
        UIHandler.prototype.createShockwaveBar = function () {
            this._shockwaveBar = new UI.SimpleAlphaProgressBar(this._game, this._game.width * .2, this._uiBg.height * .5, DiscoBall.StringConstants.UI_ATLAS, "power_bar_bg", "power_bar_fill", UI.ProgressBarOrientation.HORIZONTAL);
            var noteIcon = this._game.add.sprite(this._uiBg.left + this._uiBg.width * .035, this._uiBg.centerY, DiscoBall.StringConstants.UI_ATLAS, "note_icon");
            noteIcon.anchor.set(0, 1);
            noteIcon.fixedToCamera = true;
            this._UILayer.add(this._shockwaveBar);
            this._UILayer.add(noteIcon);
        };
        // private createDistanceBar(): void {
        //   this._distanceBar = new SimpleProgressBar(this._game, this._game.width * .06, this._game.camera.y + DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT, 
        //     DiscoBall.StringConstants.UI_DIST_BAR_BG, DiscoBall.StringConstants.UI_DIST_BAR_FILL, ProgressBarOrientation.VERTICAL, 1.5);
        //   //this._distanceBar.pivot = new Phaser.Point(DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y + DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT);
        //   //this._distanceBar.position = new Phaser.Point(DiscoBall.GameGlobalVariables.GAME_HALF_WIDTH, this._game.camera.y + DiscoBall.GameGlobalVariables.GAME_HALF_HEIGHT);
        //   this._UILayer.add(this._distanceBar);
        // }
        UIHandler.prototype.createLevelBar = function () {
            this._levelBar = new UI.CircularProgressBar(this._game, this._game.width - this._game.width * .08, this._shockwaveBar.centerY, DiscoBall.StringConstants.UI_ATLAS, "circle_bar", 20);
            this._levelBar.fixedToCamera = true;
            this._UILayer.add(this._levelBar);
        };
        UIHandler.prototype.createLifeBar = function () {
            this._lifeBar = new UI.ItemBar(this._game, this._game.width * .725, this._shockwaveBar.centerY, DiscoBall.StringConstants.UI_ATLAS, "lifes_bg", "life_fill", 3);
            this._lifeBar.fixedToCamera = true;
            this._UILayer.add(this._lifeBar);
        };
        UIHandler.prototype.UpdateLivesNum = function (numOfLives) {
            this._lifeBar.SetItemsActive(numOfLives);
        };
        return UIHandler;
    }());
    UI.UIHandler = UIHandler;
})(UI || (UI = {}));
;
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
        function VideoOfferWindow(game, xPos, yPos, atlasKey) {
            var _this = _super.call(this, game) || this;
            //should be called when window is ready
            _this.OnWindowClosed = new Phaser.Signal();
            _this._buttonsActive = false;
            _this._game = game;
            _this._bg = game.add.sprite(xPos, yPos, atlasKey, "dark_bg");
            _this._bg.width = _this.game.width;
            _this._bg.height = _this.game.height;
            _this._bg.anchor.setTo(0.5);
            _this._textImg = _this.game.add.sprite(_this._bg.x, _this._bg.top + _this._bg.height * .3, atlasKey, "stayin_alive");
            _this._textImg.anchor.set(0.5);
            var buttonOk = _this.game.add.button(_this._bg.x, _this._bg.y, atlasKey, _this.onButtonOkClick, _this, "yes_button_click", "yes_button", "yes_button_click", "yes_button");
            buttonOk.anchor.set(0.5);
            var cancelButton = game.add.bitmapText(_this._bg.x, _this._bg.bottom - _this._bg.height * .3, DiscoBall.StringConstants.FONT_UI, "NO, I`M COOL", 30);
            cancelButton.anchor.set(0.5);
            cancelButton.tint = 0xff8bff;
            cancelButton.inputEnabled = true;
            cancelButton.events.onInputDown.add(_this.onButtonCancelClick, _this);
            var cancelClickArea = game.add.graphics(0, 0);
            cancelClickArea.beginFill(0xffffff);
            cancelClickArea.drawRect(-(cancelButton.width * 1.1) / 2, -(cancelButton.height * 1.3) / 2, cancelButton.width * 1.1, cancelButton.height * 1.3);
            cancelClickArea.endFill();
            cancelClickArea.alpha = 0;
            cancelButton.addChild(cancelClickArea);
            _this.add(_this._bg);
            _this.add(_this._textImg);
            _this.add(buttonOk);
            _this.add(cancelButton);
            //this.x = this.game.width;
            _this._buttonsActive = false;
            _this.alpha = 0;
            // this._currentTime = this.TIME_TO_WAIT;
            // this._timer = this._game.time.create(false);
            // this._timer.loop(Phaser.Timer.SECOND, this.updateTimer, this);
            //this.fixedToCamera = true;
            _this.tweenToScreen();
            return _this;
        }
        //TODO uncomment when needed time
        // private updateTimer(): void {
        //     this._currentTime--;
        //     this._timeText.text = this._currentTime.toString();
        //     if (this._currentTime == 0) {
        //         this._timer.stop();
        //         this._timer.destroy();
        //         this.tweenOutOfScreen(eAfterVideoState.NOT_WATCHED);
        //     }
        // }
        VideoOfferWindow.prototype.tweenToScreen = function () {
            //Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_OFFER_SHOWN);
            this._game.add.tween(this).to({
                alpha: 1
            }, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(function () {
                //this._timer.start();
                this._buttonsActive = true;
            }, this);
        };
        VideoOfferWindow.prototype.tweenOutOfScreen = function (watched) {
            //Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_OFFER_SHOWN);
            // let tweenOut: Phaser.Tween = this._game.add.tween(this).to({
            //     x: -this._game.width
            //   }, 250, Phaser.Easing.Default, true);
            this._buttonsActive = false;
            var tweenOut = this._game.add.tween(this).to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, true);
            tweenOut.onComplete.add(function () {
                this.OnWindowClosed.dispatch(watched);
                this.destroy();
            }, this);
        };
        VideoOfferWindow.prototype.onButtonOkClick = function () {
            // this._timer.stop();
            // this._timer.destroy();
            if (!this._buttonsActive)
                return;
            Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_BUBBLE_DESTROY);
            if (App.Global.GAMEE && App.Global.CALL_DESKTOP_UNSUPPORTED_METHODS)
                Gamee.Gamee.instance.ShowRewardedVideo(this.afterVideoWatched.bind(this));
            else
                this.afterVideoWatched(true);
        };
        VideoOfferWindow.prototype.onButtonCancelClick = function () {
            if (!this._buttonsActive)
                return;
            Base.AudioPlayer.Instance.PlaySound(DiscoBall.StringConstants.SOUND_BUBBLE_DESTROY);
            this.tweenOutOfScreen(eAfterVideoState.NOT_WATCHED);
        };
        VideoOfferWindow.prototype.afterVideoWatched = function (watched) {
            this.tweenOutOfScreen(watched ? eAfterVideoState.WATCHED_WHOLE : eAfterVideoState.WATCHED_PARTIALLY);
        };
        return VideoOfferWindow;
    }(Phaser.Group));
    UI.VideoOfferWindow = VideoOfferWindow;
})(UI || (UI = {}));
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
        // Update: does not work good
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
            var text = game.add.text(0 + game.camera.width * 0.02, game.camera.height * 0.99, "v" + version, {
                font: "16px Arial",
                fill: "#ffffff"
            });
            text.anchor.setTo(0, 1);
            text.fixedToCamera = true;
        };
        //Not sure if this will gonna work under WEB_GL renderer
        //Using sprite->RenderTexture conversion and then method getBase64 from RenderTexture
        PhaserUtils.GetBase64ImageFromSprite = function (sprite) {
            return sprite.generateTexture().getBase64();
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
        StringUtils.RemoveDiacriticsFromString = function (stringToRemove) {
            return stringToRemove.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        };
        return StringUtils;
    }());
    Utils.StringUtils = StringUtils;
})(Utils || (Utils = {}));
//# sourceMappingURL=discoballs.js.map
