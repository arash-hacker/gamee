var Opponents;
(function (Opponents) {
    var Card = (function () {
        function Card() {
            var game = Game.Global.game;
            this._container = game.add.group();
            this._container.fixedToCamera = true;
            this._avatar = game.add.image(Card.AVATAR_RADIUS / 2, Card.AVATAR_RADIUS / 2, Game.Global.ATLAS_0, "opponentAvatar", this._container);
            this._avatar.anchor.set(0.5);
            var img = game.add.image(Card.AVATAR_RADIUS / 2, Card.AVATAR_RADIUS / 2, Game.Global.ATLAS_0, "opponentFrame", this._container);
            img.anchor.set(0.5);
            this._score = game.add.bitmapText(Card.AVATAR_RADIUS / 2, Card.AVATAR_RADIUS + 12, Game.Global.FNT_OPPONENT, "", 24, this._container);
            this._score.anchor.set(0.5, 0);
            this._score.text = "2851";
            this._container.cameraOffset.set(Game.Global.GAME_MAX_WIDTH - 20 - img.width, 50);
        }
        Object.defineProperty(Card.prototype, "continer", {
            get: function () { return this._container; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Card.prototype, "data", {
            get: function () { return this._data; },
            set: function (data) {
                this.setData(data);
            },
            enumerable: true,
            configurable: true
        });
        Card.prototype.setData = function (data) {
            this._data = data;
            if (data.avatarLoaded) {
                this._avatar.loadTexture(data.avatarCacheKey);
            }
            else if (this._avatar.key != Game.Global.ATLAS_0) {
                this._avatar.loadTexture(Game.Global.ATLAS_0, "opponentAvatar");
            }
            this._avatar.width = Card.AVATAR_RADIUS;
            this._avatar.height = Card.AVATAR_RADIUS;
            this._score.text = data.score.toString();
            if (this._avatar.mask == null) {
                var mask = Game.Global.game.add.graphics(0, 0, this._container);
                mask.beginFill(0xFFFFFF);
                mask.drawCircle(Card.AVATAR_RADIUS / 2, Card.AVATAR_RADIUS / 2, Card.AVATAR_RADIUS);
                mask.endFill();
                this._avatar.mask = mask;
            }
        };
        return Card;
    }());
    Card.AVATAR_RADIUS = 70;
    Opponents.Card = Card;
})(Opponents || (Opponents = {}));
var Opponents;
(function (Opponents) {
    var Data = (function () {
        function Data(id, friend) {
            this._id = id;
            this._friend = friend;
            this.avatarLoaded = false;
        }
        Object.defineProperty(Data.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Data.prototype, "name", {
            get: function () { return this._friend.name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Data.prototype, "score", {
            get: function () { return this._friend.highScore; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Data.prototype, "avatarCacheKey", {
            get: function () { return "op_" + this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Data.prototype, "avatarURL", {
            get: function () { return this._friend.avatar; },
            enumerable: true,
            configurable: true
        });
        return Data;
    }());
    Opponents.Data = Data;
})(Opponents || (Opponents = {}));
var Opponents;
(function (Opponents) {
    var Manager = (function () {
        function Manager() {
            this._opponents = [];
            this._card = new Opponents.Card();
        }
        Manager.prototype.reset = function (reload) {
            if (!reload) {
                if (this._opponents.length != 0) {
                    this._card.data = this._opponents[0];
                    this._card.continer.visible = true;
                    this._nextOpponentId = 1;
                }
                return;
            }
            this._card.continer.visible = false;
            this._nextOpponentId = -1;
            if (this._opponents.length != 0) {
                var cache = Game.Global.game.cache;
                var id = this._opponents.length;
                while (id-- != 0) {
                    var op = this._opponents[id];
                    if (op.avatarLoaded)
                        cache.removeImage(this._opponents[id].avatarCacheKey, true);
                }
                this._opponents.length = 0;
            }
            if (Gamee2.Gamee.initialized)
                Gamee2.Gamee.requestSocial(this.gameeFriendsLoaded, this);
        };
        Manager.prototype.update = function () {
            if (this._card.continer.visible && this._card.data.score <= Game.Play.instance.score) {
                if (this._nextOpponentId < this._opponents.length) {
                    this._card.data = this._opponents[this._nextOpponentId];
                    this._nextOpponentId++;
                }
                else {
                    this._card.continer.visible = false;
                }
            }
        };
        Manager.prototype.gameeFriendsLoaded = function (res) {
            if (!res)
                return;
            var gameeFriends = Gamee2.Gamee.friends;
            if (this._avatarLoader == undefined) {
                this._avatarLoader = new Phaser.Loader(Game.Global.game);
                this._avatarLoader.crossOrigin = "anonymous";
                this._avatarLoader.onFileComplete.add(this.avatarLoaded, this);
                this._avatarLoader.onLoadComplete.add(this.allAvatarsLoaded, this);
            }
            for (var id = 0; id < gameeFriends.length; id++) {
                var opponent = new Opponents.Data(id, gameeFriends[id]);
                this._opponents.push(opponent);
                this._avatarLoader.image(opponent.avatarCacheKey, opponent.avatarURL);
            }
            if (this._opponents.length != 0)
                this._avatarLoader.start();
        };
        Manager.prototype.avatarLoaded = function (progress, key, success) {
            if (!success)
                return;
            for (var id = 0; id < this._opponents.length; id++) {
                var opponent = this._opponents[id];
                if (!opponent.avatarLoaded && opponent.avatarCacheKey == key) {
                    opponent.avatarLoaded = true;
                    break;
                }
            }
        };
        Manager.prototype.allAvatarsLoaded = function () {
            var score = Game.Play.instance.score;
            this._nextOpponentId = 0;
            while (this._opponents[this._nextOpponentId].score < score) {
                if (++this._nextOpponentId == this._opponents.length) {
                    this._nextOpponentId = -1;
                    break;
                }
            }
            if (this._nextOpponentId >= 0) {
                this._card.data = this._opponents[this._nextOpponentId];
                this._card.continer.visible = true;
                this._nextOpponentId++;
            }
        };
        return Manager;
    }());
    Opponents.Manager = Manager;
})(Opponents || (Opponents = {}));
var HUD;
(function (HUD) {
    var RaceTime = (function () {
        function RaceTime() {
            RaceTime._instance = this;
            var game = Game.Global.game;
            this._layer = game.add.group();
            this._layer.fixedToCamera = true;
            game.add.image(0, 0, Game.Global.ATLAS_0, "icoTime", this._layer);
            this._timePresenter = [];
            this._timePresenter[0] = game.add.bitmapText(this._layer.width + 10, this._layer.height / 2, Game.Global.FNT_HUD_NUMS_0, "00.00", 80, this._layer);
            this._timePresenter[0].anchor.set(0, 0.45);
            this._timePresenter[1] = game.add.bitmapText(this._timePresenter[0].x, this._timePresenter[0].y, Game.Global.FNT_HUD_NUMS_1, "", 80, this._layer);
            this._timePresenter[1].anchor.set(0, 0.45);
            this._layer.cameraOffset.set(Math.floor((Game.Global.GAME_MAX_WIDTH - this._layer.width) / 2), 60);
        }
        Object.defineProperty(RaceTime, "instance", {
            get: function () { return RaceTime._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RaceTime.prototype, "outOfTimeTime", {
            get: function () { return this._outOfTimeTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RaceTime.prototype, "outOfTime", {
            get: function () { return this._outOfTime; },
            enumerable: true,
            configurable: true
        });
        RaceTime.prototype.reset = function (visible) {
            if (visible) {
                this._timeTotal = RaceTime.RACE_TIME;
                this._timeSeconds = RaceTime.RACE_TIME / 1000;
                this._timePresenter[0].text = this._timeSeconds + ".00";
                this._timePresenter[0].visible = true;
                this._timePresenter[1].visible = false;
                this._timePresenterId = 0;
                this._outOfTime = false;
            }
            this._layer.visible = this._layer.exists = visible;
        };
        RaceTime.prototype.update = function () {
            var remTime = this._timeTotal - (Game.Global.elapsedTime - Game.Play.startTime);
            var presenterId = this._timePresenterId;
            var presenter = this._timePresenter[presenterId];
            if (remTime <= 0) {
                if (!this._outOfTime) {
                    this._outOfTime = true;
                    this._outOfTimeTime = Game.Global.elapsedTime;
                    presenter.text = "00.00";
                    Utils.AudioUtils.playSound("game_over");
                }
                return false;
            }
            var seconds = Math.floor(remTime / 1000);
            var milliseconds = Math.floor((remTime % 1000) / 10);
            if (seconds > 4) {
                presenterId = 0;
            }
            else {
                if (seconds != this._timeSeconds) {
                    this._timeSeconds = seconds;
                    if (seconds <= 4) {
                        Utils.AudioUtils.playSound("low_energy");
                    }
                }
                presenterId = (Math.floor(milliseconds / 10) & 1) != 0 ? 0 : 1;
            }
            if (this._timePresenterId != presenterId) {
                presenter.visible = false;
                presenter = this._timePresenter[presenterId];
                presenter.visible = true;
                this._timePresenterId = presenterId;
            }
            presenter.text = (seconds < 10 ? "0" + seconds : seconds.toString());
            presenter.text += "." + (milliseconds >= 10 ? milliseconds.toString() : "0" + milliseconds);
            return true;
        };
        RaceTime.prototype.addTime = function () {
            this._timeTotal += RaceTime.BONUS_TIME;
            if (this._outOfTime) {
                this._outOfTime = false;
                this._timeTotal += Game.Global.elapsedTime - this._outOfTimeTime;
            }
        };
        return RaceTime;
    }());
    RaceTime.RACE_TIME = 30 * 1000;
    RaceTime.BONUS_TIME = 5 * 1000;
    HUD.RaceTime = RaceTime;
})(HUD || (HUD = {}));
var Gamee2;
(function (Gamee2) {
    var eInitState;
    (function (eInitState) {
        eInitState[eInitState["none"] = 0] = "none";
        eInitState[eInitState["ok"] = 1] = "ok";
        eInitState[eInitState["inProgress"] = 2] = "inProgress";
        eInitState[eInitState["error"] = 3] = "error";
    })(eInitState = Gamee2.eInitState || (Gamee2.eInitState = {}));
    var eStarFlag;
    (function (eStarFlag) {
        eStarFlag[eStarFlag["replay"] = 1] = "replay";
        eStarFlag[eStarFlag["ghost"] = 2] = "ghost";
        eStarFlag[eStarFlag["reset"] = 4] = "reset";
    })(eStarFlag = Gamee2.eStarFlag || (Gamee2.eStarFlag = {}));
    var Gamee = (function () {
        function Gamee() {
        }
        Object.defineProperty(Gamee, "onInitialized", {
            get: function () { return this._onInitialized; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onStart", {
            get: function () { return this._onStart; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onPause", {
            get: function () { return this._onPause; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onResume", {
            get: function () { return this._onResume; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onMute", {
            get: function () { return this._onMute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onUnmute", {
            get: function () { return this._onUnmute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onGhostShow", {
            get: function () { return Gamee._onGhostShow; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onGhostHide", {
            get: function () { return Gamee._onGhostHide; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "initState", {
            get: function () { return this._initState; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "initialized", {
            get: function () { return this._initState == eInitState.ok; },
            enumerable: true,
            configurable: true
        });
        Gamee.initialize = function (controller, gameCapabilities) {
            if (Gamee._initState === eInitState.none) {
                if (window.gamee === undefined) {
                    Gamee._initState = eInitState.error;
                    console.log("window.gamee doesn't exist");
                    return false;
                }
                Gamee._initState = eInitState.inProgress;
                window.gamee.gameInit(controller, {}, gameCapabilities, function (error, data) {
                    if (error === undefined || error === null) {
                        Gamee._initState = eInitState.ok;
                        Gamee.initData = data;
                        window.gamee.emitter.addEventListener("start", function (event) {
                            var flags = 0;
                            if (event.detail != undefined) {
                                if (event.detail.opt_replay != undefined && event.detail.opt_replay != false)
                                    flags |= eStarFlag.replay;
                                if (event.detail.opt_ghostMode != undefined && event.detail.opt_ghostMode != false)
                                    flags |= eStarFlag.ghost;
                                if (event.detail.opt_resetState != undefined && event.detail.opt_resetState != false)
                                    flags |= eStarFlag.reset;
                            }
                            Gamee.onStart.dispatch(flags);
                        });
                        window.gamee.emitter.addEventListener("pause", function () {
                            Gamee.onPause.dispatch();
                        });
                        window.gamee.emitter.addEventListener("resume", function () {
                            Gamee.onResume.dispatch();
                        });
                        window.gamee.emitter.addEventListener("mute", function () {
                            Gamee.onMute.dispatch();
                        });
                        window.gamee.emitter.addEventListener("unmute", function () {
                            Gamee.onUnmute.dispatch();
                        });
                        window.gamee.emitter.addEventListener("ghostShow", function () {
                            Gamee.onGhostShow.dispatch();
                        });
                        window.gamee.emitter.addEventListener("ghostHide", function () {
                            Gamee._onGhostHide.dispatch();
                        });
                    }
                    else {
                        Gamee._initState = eInitState.error;
                        console.log(error);
                    }
                    Gamee.onInitialized.dispatch(Gamee._initState);
                });
            }
            return true;
        };
        Object.defineProperty(Gamee, "ready", {
            get: function () { return Gamee._ready; },
            enumerable: true,
            configurable: true
        });
        Gamee.gameReady = function () {
            if (Gamee._initState == eInitState.ok && !Gamee._ready) {
                window.gamee.gameReady(function (error) {
                    if (error == null) {
                        Gamee._ready = true;
                    }
                    else {
                        console.log(error);
                    }
                });
            }
        };
        Object.defineProperty(Gamee, "friends", {
            get: function () { return this._friends; },
            enumerable: true,
            configurable: true
        });
        Gamee.requestSocial = function (callback, callbackContext) {
            if (Gamee._initState == eInitState.ok) {
                window.gamee.requestSocial(function (error, data) {
                    var res = (error == undefined || error == null);
                    if (res) {
                        if (data && data.socialData && data.socialData.friends) {
                            Gamee.setFriendList(data.socialData.friends);
                        }
                        else {
                            res = false;
                        }
                    }
                    if (callback != undefined)
                        callback.call(callbackContext, res);
                });
            }
        };
        Gamee.setFriendList = function (friends) {
            Gamee._friends.length = 0;
            for (var friendId = 0; friendId < friends.length; friendId++) {
                Gamee._friends.push(friends[friendId]);
            }
        };
        Gamee.gameOver = function (replayData) {
            if (replayData === void 0) { replayData = null; }
            if (Gamee._initState == eInitState.ok && Gamee._ready) {
                if (replayData == null) {
                    window.gamee.gameOver();
                }
                else {
                    window.gamee.gameOver({ data: replayData, variant: "0" });
                }
            }
        };
        Gamee.gameSave = function (data) {
            if (Gamee._initState == eInitState.ok && Gamee._ready) {
                window.gamee.gameSave(data);
            }
        };
        Object.defineProperty(Gamee, "score", {
            get: function () {
                return Gamee._score;
            },
            set: function (score) {
                Gamee._score = score;
                if (Gamee._initState == eInitState.ok)
                    window.gamee.updateScore(score);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "ghostScore", {
            set: function (score) {
                if (Gamee._initState == eInitState.ok) {
                    window.gamee.updateScore(score, true);
                    Game.Global.addDebugMessage("ghost score: " + score);
                }
            },
            enumerable: true,
            configurable: true
        });
        return Gamee;
    }());
    Gamee._onInitialized = new Phaser.Signal();
    Gamee._onStart = new Phaser.Signal();
    Gamee._onPause = new Phaser.Signal();
    Gamee._onResume = new Phaser.Signal();
    Gamee._onMute = new Phaser.Signal();
    Gamee._onUnmute = new Phaser.Signal();
    Gamee._onGhostShow = new Phaser.Signal();
    Gamee._onGhostHide = new Phaser.Signal();
    Gamee._initState = eInitState.none;
    Gamee._ready = false;
    Gamee._friends = [];
    Gamee._score = 0;
    Gamee2.Gamee = Gamee;
})(Gamee2 || (Gamee2 = {}));
var Game;
(function (Game) {
    var Global = (function () {
        function Global() {
        }
        Global.setAudioUnlockCallback = function (callback, context) {
            Global._audioUnlockCallback = callback;
            Global._audioUnlockCallbackContext = context;
        };
        Global.unlockAudio = function () {
            Global.game.input.touch.addTouchLockCallback(function () {
                if (this.noAudio || !this.touchLocked) {
                    return true;
                }
                if (this.usingWebAudio) {
                    var buffer = this.context.createBuffer(1, 1, 22050);
                    var unlockSource = this.context.createBufferSource();
                    unlockSource.buffer = buffer;
                    unlockSource.connect(this.context.destination);
                    if (unlockSource.start === undefined) {
                        unlockSource.noteOn(0);
                    }
                    else {
                        unlockSource.start(0);
                    }
                    if (unlockSource.context.state == 'suspended') {
                        unlockSource.context.resume();
                    }
                }
                if (Global._audioUnlockCallback != undefined)
                    Global._audioUnlockCallback.call(Global._audioUnlockCallbackContext);
                return true;
            }, Global.game.sound, true);
        };
        Global.initDebugMessages = function () {
            Global._debugMessages = new Collections.WrappedArray();
        };
        Global.addDebugMessage = function (message) {
            if (Global.DEBUG) {
                if (Global._debugMessages.itemCnt == Global.DEBUG_MESSAGE_MAX_CNT)
                    Global._debugMessages.removeItem(false);
                Global._debugMessages.addItem(message, true);
            }
        };
        Global.showDebugMessages = function (x, y, lineH, color, font) {
            if (lineH === void 0) { lineH = 30; }
            if (Global.DEBUG) {
                var id = Global._debugMessages.itemCnt;
                while (id-- != 0) {
                    Global.game.debug.text(Global._debugMessages.getItemAtIndex(id), x, y, color, font);
                    y += lineH;
                }
            }
            return y;
        };
        Global.init = function (game) {
            Global.game = game;
            this.ghost = new Ghost.Ghost();
            this.gameeGhostMode = false;
            if (Global.DEBUG)
                Global.initDebugMessages();
        };
        return Global;
    }());
    Global.GAME_MAX_WIDTH = 640;
    Global.GAME_MAX_HEIGHT = 1138;
    Global.GAME_MIN_WIDTH = 640;
    Global.GAME_MIN_HEIGHT = 854;
    Global.FPS = 60;
    Global.DEBUG = false;
    Global.GAMEE = true;
    Global.ATLAS_0 = "atlas_0";
    Global.FNT_HUD_CP_ID = "fnt_hudCPId";
    Global.FNT_HUD_NUMS_0 = "fnt_hudNums_0";
    Global.FNT_HUD_NUMS_1 = "fnt_hudNums_1";
    Global.FNT_POPUP_SCORE = "fnt_popupScore";
    Global.FNT_OPPONENT = "fnt_opponent";
    Global.elapsedTime = 0;
    Global.deltaRatio = 1;
    Global.DEBUG_MESSAGE_MAX_CNT = 20;
    Game.Global = Global;
    window.onload = function () {
        Global.init(new Game.Game());
    };
})(Game || (Game = {}));
var Collections;
(function (Collections) {
    var ILinkedListNode = (function () {
        function ILinkedListNode() {
        }
        return ILinkedListNode;
    }());
    Collections.ILinkedListNode = ILinkedListNode;
    var LinkedList = (function () {
        function LinkedList(defNodeCnt) {
            this._firstNode = null;
            this._lastNode = null;
            this._nElements = 0;
            this._nodePool = new Collections.Pool(undefined, defNodeCnt, true, function () {
                return new ILinkedListNode();
            }, this);
        }
        LinkedList.prototype.add = function (item, index) {
            if (Collections.isUndefined(index)) {
                index = this._nElements;
            }
            if (index < 0 || index > this._nElements || Collections.isUndefined(item)) {
                return false;
            }
            var newNode = this.createNode(item);
            if (this._nElements === 0) {
                this._firstNode = newNode;
                this._lastNode = newNode;
            }
            else if (index === this._nElements) {
                this._lastNode.next = newNode;
                newNode.prev = this._lastNode;
                this._lastNode = newNode;
            }
            else if (index === 0) {
                this._firstNode.prev = newNode;
                newNode.next = this._firstNode;
                this._firstNode = newNode;
            }
            else {
                var prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                newNode.prev = prev;
                newNode.next.prev = newNode;
                prev.next = newNode;
            }
            this._nElements++;
            return true;
        };
        LinkedList.prototype.addToNode = function (item, neighbor, before) {
            var newNode = this.createNode(item);
            if (before) {
                newNode.prev = neighbor.prev;
                newNode.next = neighbor;
                neighbor.prev = newNode;
                if (neighbor == this._firstNode)
                    this._firstNode = newNode;
            }
            else {
                newNode.next = neighbor.next;
                newNode.prev = neighbor;
                neighbor.next = newNode;
                if (neighbor == this._lastNode)
                    this._lastNode = newNode;
            }
            this._nElements++;
        };
        Object.defineProperty(LinkedList.prototype, "first", {
            get: function () {
                if (this._firstNode !== null) {
                    return this._firstNode.element;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "last", {
            get: function () {
                if (this._lastNode !== null) {
                    return this._lastNode.element;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "firstNode", {
            get: function () { return this._firstNode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "lastNode", {
            get: function () { return this._lastNode; },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype.elementAtIndex = function (index) {
            var node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        };
        LinkedList.prototype.indexOf = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (Collections.isUndefined(item)) {
                return -1;
            }
            var currentNode = this._firstNode;
            var index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        };
        LinkedList.prototype.previous = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (Collections.isUndefined(item)) {
                return null;
            }
            var currentNode = this._firstNode;
            var prevNode = null;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return prevNode != null ? prevNode.element : null;
                }
                prevNode = currentNode;
                currentNode = currentNode.next;
            }
            return null;
        };
        LinkedList.prototype.next = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (Collections.isUndefined(item)) {
                return null;
            }
            var currentNode = this._firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    var next = currentNode.next;
                    return next != undefined && next != null ? next.element : null;
                }
                currentNode = currentNode.next;
            }
            return null;
        };
        LinkedList.prototype.contains = function (item, equalsFunction) {
            return (this.indexOf(item, equalsFunction) >= 0);
        };
        LinkedList.prototype.remove = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (this._nElements < 1 || Collections.isUndefined(item)) {
                return false;
            }
            var previous = null;
            var currentNode = this._firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    if (currentNode === this._firstNode) {
                        if ((this._firstNode = this._firstNode.next) != null)
                            this._firstNode.prev = null;
                        if (currentNode === this._lastNode)
                            this._lastNode = null;
                    }
                    else if (currentNode === this._lastNode) {
                        this._lastNode = previous;
                        previous.next = null;
                    }
                    else {
                        previous.next = currentNode.next;
                        previous.next.prev = previous;
                    }
                    currentNode.element = null;
                    this._nElements--;
                    this._nodePool.returnItem(currentNode);
                    return true;
                }
                previous = currentNode;
                currentNode = currentNode.next;
            }
            return false;
        };
        LinkedList.prototype.clear = function () {
            var currentNode = this._firstNode;
            while (currentNode != null) {
                this._nodePool.returnItem(currentNode);
                currentNode.element = null;
                currentNode = currentNode.next;
            }
            this._firstNode = null;
            this._lastNode = null;
            this._nElements = 0;
        };
        LinkedList.prototype.equals = function (other, equalsFunction) {
            var eqF = equalsFunction || Collections.defaultEquals;
            if (!(other instanceof LinkedList)) {
                return false;
            }
            if (this.size != other.size) {
                return false;
            }
            return this.equalsAux(this._firstNode, other._firstNode, eqF);
        };
        LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        };
        LinkedList.prototype.removeElementAtIndex = function (index) {
            if (index < 0 || index >= this._nElements) {
                return undefined;
            }
            var node;
            if (this._nElements === 1) {
                node = this._firstNode;
                this._firstNode = null;
                this._lastNode = null;
            }
            else {
                var previous = this.nodeAtIndex(index - 1);
                if (previous === null) {
                    node = this._firstNode;
                    this._firstNode = node.next;
                    this._firstNode.prev = null;
                }
                else if (previous.next === this._lastNode) {
                    node = this._lastNode;
                    this._lastNode = previous;
                    this._lastNode.next = null;
                }
                else {
                    node = previous.next;
                    previous.next = node.next;
                    node.next.prev = previous;
                }
            }
            this._nElements--;
            var element = node.element;
            node.element = null;
            this._nodePool.returnItem(node);
            return element;
        };
        LinkedList.prototype.forEach = function (callback, thisContext) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var currentNode = this._firstNode;
            while (currentNode !== null) {
                var nextNode = currentNode.next;
                if (!callback.call(thisContext, currentNode.element, args))
                    break;
                currentNode = nextNode;
            }
        };
        LinkedList.prototype.reverse = function () {
            var previous = null;
            var current = this._firstNode;
            var temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this._firstNode;
            this._firstNode = this._lastNode;
            this._lastNode = temp;
        };
        LinkedList.prototype.toArray = function () {
            var array = [];
            var currentNode = this._firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        };
        Object.defineProperty(LinkedList.prototype, "size", {
            get: function () {
                return this._nElements;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "isEmpty", {
            get: function () {
                return this._nElements <= 0;
            },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype.toString = function () {
            return this.toArray().toString();
        };
        LinkedList.prototype.nodeAtIndex = function (index) {
            if (index < 0 || index >= this._nElements) {
                return null;
            }
            if (index === (this._nElements - 1)) {
                return this._lastNode;
            }
            var node = this._firstNode;
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        };
        LinkedList.prototype.createNode = function (item) {
            var node = this._nodePool.getItem();
            node.element = item;
            node.next = null;
            node.prev = null;
            return node;
        };
        return LinkedList;
    }());
    Collections.LinkedList = LinkedList;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var Pool = (function () {
        function Pool(itemType, defSize, canGrow, itemCreateFnc, itemCreateFncThis, id) {
            if (defSize === void 0) { defSize = 0; }
            if (canGrow === void 0) { canGrow = true; }
            if (itemCreateFnc === void 0) { itemCreateFnc = null; }
            if (id === void 0) { id = 0; }
            this._itemType = itemType;
            this._itemCreateFnc = itemCreateFnc;
            this._itemCreateFncThis = itemCreateFncThis;
            this._canGrow = canGrow;
            this._pool = [];
            this._count = 0;
            this._id = 0;
            this._allocatedItemCnt = 0;
            while (defSize-- != 0) {
                this._pool.push(this.newItem());
                this._count++;
            }
        }
        Object.defineProperty(Pool.prototype, "count", {
            get: function () { return this._count; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "canGrow", {
            get: function () { return this._canGrow; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "allocatedItemCnt", {
            get: function () { return this._allocatedItemCnt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "id", {
            get: function () { return this._id; },
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
            this._allocatedItemCnt++;
            if (this._itemCreateFnc != null) {
                return this._itemCreateFnc.call(this._itemCreateFncThis, this._count);
            }
            else {
                return new this._itemType();
            }
        };
        return Pool;
    }());
    Collections.Pool = Pool;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    Collections.has = function (obj, prop) {
        return _hasOwnProperty.call(obj, prop);
    };
    function defaultCompare(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a === b) {
            return 0;
        }
        else {
            return 1;
        }
    }
    Collections.defaultCompare = defaultCompare;
    function defaultEquals(a, b) {
        return a === b;
    }
    Collections.defaultEquals = defaultEquals;
    function defaultToString(item) {
        if (item === null) {
            return 'COLLECTION_NULL';
        }
        else if (isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        }
        else if (isString(item)) {
            return '$s' + item;
        }
        else {
            return '$o' + item.toString();
        }
    }
    Collections.defaultToString = defaultToString;
    function makeString(item, join) {
        if (join === void 0) { join = ','; }
        if (item === null) {
            return 'COLLECTION_NULL';
        }
        else if (isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        }
        else if (isString(item)) {
            return item.toString();
        }
        else {
            var toret = '{';
            var first = true;
            for (var prop in item) {
                if (Collections.has(item, prop)) {
                    if (first) {
                        first = false;
                    }
                    else {
                        toret = toret + join;
                    }
                    toret = toret + prop + ':' + item[prop];
                }
            }
            return toret + '}';
        }
    }
    Collections.makeString = makeString;
    function isFunction(func) {
        return (typeof func) === 'function';
    }
    Collections.isFunction = isFunction;
    function isUndefined(obj) {
        return (typeof obj) === 'undefined';
    }
    Collections.isUndefined = isUndefined;
    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    Collections.isString = isString;
    function reverseCompareFunction(compareFunction) {
        if (!isFunction(compareFunction)) {
            return function (a, b) {
                if (a < b) {
                    return 1;
                }
                else if (a === b) {
                    return 0;
                }
                else {
                    return -1;
                }
            };
        }
        else {
            return function (d, v) {
                return compareFunction(d, v) * -1;
            };
        }
    }
    Collections.reverseCompareFunction = reverseCompareFunction;
    function compareToEquals(compareFunction) {
        return function (a, b) {
            return compareFunction(a, b) === 0;
        };
    }
    Collections.compareToEquals = compareToEquals;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var WrappedArray = (function () {
        function WrappedArray() {
            this._array = [];
            this._firstItemId = 0;
            this._itemCnt = 0;
        }
        Object.defineProperty(WrappedArray.prototype, "itemCnt", {
            get: function () {
                return this._itemCnt;
            },
            enumerable: true,
            configurable: true
        });
        WrappedArray.prototype.addItem = function (item, atTheEnd) {
            if (atTheEnd === void 0) { atTheEnd = true; }
            this.ensureSpaceForNewItem(atTheEnd);
            var itemId;
            if (atTheEnd) {
                itemId = this.itemId2ItemArrayPos(this._itemCnt);
            }
            else {
                if (this._itemCnt != 0) {
                    itemId = this._firstItemId - 1;
                    if (itemId < 0)
                        itemId = this._array.length - 1;
                }
                else {
                    itemId = 0;
                }
                this._firstItemId = itemId;
            }
            this._array[itemId] = item;
            this._itemCnt++;
        };
        WrappedArray.prototype.removeItem = function (atTheEnd) {
            if (atTheEnd === void 0) { atTheEnd = true; }
            var item = null;
            if (this._itemCnt != 0) {
                if (atTheEnd) {
                    var itemId = this.itemId2ItemArrayPos(this._itemCnt - 1);
                    item = this._array[itemId];
                    this._array[itemId] = null;
                }
                else {
                    item = this._array[this._firstItemId];
                    this._array[this._firstItemId] = null;
                    if (++this._firstItemId == this._array.length)
                        this._firstItemId = 0;
                }
                this._itemCnt--;
            }
            return item;
        };
        WrappedArray.prototype.clear = function () {
            var itemCnt = this._itemCnt;
            var itemId = this._firstItemId;
            while (itemCnt-- != 0) {
                this._array[itemId] = null;
                if (++itemId == this._array.length)
                    itemId = 0;
            }
            this._firstItemId = 0;
            this._itemCnt = 0;
        };
        WrappedArray.prototype.getItemAtIndex = function (itemId) {
            if (itemId >= this._itemCnt)
                return null;
            return this._array[this.itemId2ItemArrayPos(itemId)];
        };
        WrappedArray.prototype.getLastItem = function () {
            return this.getItemAtIndex(this._itemCnt - 1);
        };
        WrappedArray.prototype.ensureSpaceForNewItem = function (atTheEnd) {
            if (this._itemCnt < this._array.length)
                return;
            if (this._itemCnt != 0) {
                if (this._firstItemId != 0) {
                    this._array = this.toArray();
                    this._firstItemId = 0;
                }
                if (!atTheEnd) {
                    this._array.unshift(null);
                    this._firstItemId = 1;
                    return;
                }
            }
            this._array.push(null);
        };
        WrappedArray.prototype.toArray = function () {
            var newArray = [];
            var oldArray = this._array;
            var itemCnt = this._itemCnt;
            var itemId = this._firstItemId;
            while (itemCnt-- != 0) {
                newArray.push(oldArray[itemId]);
                if (++itemId == this._array.length)
                    itemId = 0;
            }
            return newArray;
        };
        WrappedArray.prototype.itemId2ItemArrayPos = function (itemId) {
            itemId += this._firstItemId;
            if (itemId >= this._array.length)
                itemId -= this._array.length;
            return itemId;
        };
        return WrappedArray;
    }());
    Collections.WrappedArray = WrappedArray;
})(Collections || (Collections = {}));
var PopupMessage;
(function (PopupMessage) {
    var MessageBase = (function () {
        function MessageBase() {
            this._active = false;
        }
        Object.defineProperty(MessageBase.prototype, "startY", {
            get: function () { return this._startY; },
            enumerable: true,
            configurable: true
        });
        MessageBase.prototype.update = function (elapsedTime) {
            if (!this._active)
                return false;
            var time = elapsedTime - this._timer;
            if (!this._type.updateMessage(time, this)) {
                this._active = false;
                return false;
            }
            return true;
        };
        MessageBase.prototype.showMessage = function (x, y, type, elapsedTime) {
            var msg = this.getMsgContainer();
            msg.x = x;
            msg.y = y;
            msg.alpha = 1;
            this._timer = elapsedTime;
            this._startY = y;
            this._type = type;
            this._active = true;
        };
        MessageBase.prototype.kill = function () {
            this._active = false;
        };
        return MessageBase;
    }());
    PopupMessage.MessageBase = MessageBase;
})(PopupMessage || (PopupMessage = {}));
var PopupMessage;
(function (PopupMessage) {
    var MessageType = (function () {
        function MessageType(moveDistance, moveTime, moveEase, alphaDelay, alphaTime, alphaEase) {
            this._moveDistance = moveDistance;
            this._moveTime = moveTime;
            this._moveEase = moveEase;
            this._alphaDelay = alphaDelay;
            this._alphaTime = alphaTime;
            this._alphaEase = alphaEase;
        }
        Object.defineProperty(MessageType.prototype, "moveDistance", {
            get: function () { return this._moveDistance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "moveTime", {
            get: function () { return this._moveTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "moveEase", {
            get: function () { return this._moveEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "alphaDelay", {
            get: function () { return this._alphaDelay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "alphaTime", {
            get: function () { return this._alphaTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "alphaEase", {
            get: function () { return this._alphaEase; },
            enumerable: true,
            configurable: true
        });
        MessageType.prototype.updateMessage = function (time, msg) {
            var completeMask = 0;
            var msgContainer = msg.getMsgContainer();
            var progress = time / this._moveTime;
            if (progress >= 1) {
                progress = 1;
                completeMask |= 1;
            }
            msgContainer.y = msg.startY - (this._moveEase(progress) * this._moveDistance);
            if (time > this._alphaDelay) {
                progress = (time - this._alphaDelay) / this._alphaTime;
                if (progress >= 1) {
                    progress = 1;
                    completeMask |= 2;
                }
                msgContainer.alpha = 1 - this._alphaEase(progress);
            }
            if (completeMask == 3)
                return false;
            return true;
        };
        return MessageType;
    }());
    PopupMessage.MessageType = MessageType;
})(PopupMessage || (PopupMessage = {}));
var SlideMessage;
(function (SlideMessage) {
    var eMessageState;
    (function (eMessageState) {
        eMessageState[eMessageState["completed"] = 0] = "completed";
        eMessageState[eMessageState["slideIn"] = 1] = "slideIn";
        eMessageState[eMessageState["slideOutDelay"] = 2] = "slideOutDelay";
        eMessageState[eMessageState["slideOut"] = 3] = "slideOut";
    })(eMessageState = SlideMessage.eMessageState || (SlideMessage.eMessageState = {}));
    var MessageBase = (function () {
        function MessageBase() {
            this._state = eMessageState.completed;
            this._onStateChange = new Phaser.Signal();
        }
        Object.defineProperty(MessageBase.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageBase.prototype, "onStateChange", {
            get: function () { return this._onStateChange; },
            enumerable: true,
            configurable: true
        });
        MessageBase.prototype.update = function (elapsedTime) {
            if (this._state == eMessageState.completed)
                return false;
            var time = elapsedTime - this._timer;
            var state = this._type.updateMessage(time, this);
            if (state != this._state) {
                this._state = state;
                this.onStateChange.dispatch(state);
            }
            return this._state != eMessageState.completed;
        };
        MessageBase.prototype.kill = function () {
            this._state = eMessageState.completed;
        };
        MessageBase.prototype.showMessage = function (y, type, elapsedTime) {
            this._type = type;
            this._timer = elapsedTime;
            this._state = eMessageState.slideIn;
            var msg = this.getMsgContainer();
            msg.cameraOffset.y = y;
            msg.cameraOffset.x = type.getMessageStartX(this);
            msg.alpha = type.slideInAlphaStart;
            this.onStateChange.dispatch(eMessageState.slideIn);
        };
        return MessageBase;
    }());
    SlideMessage.MessageBase = MessageBase;
})(SlideMessage || (SlideMessage = {}));
var SlideMessage;
(function (SlideMessage) {
    var MessageType = (function () {
        function MessageType(game, slideDir, slideInTime, slideInEase, slideInAlphaStart, slideInAlphaEase, slideOutTime, slideOutDelay, slideOutEase, slideOutAlphaEnd, slideOutAlphaEase) {
            this._game = game;
            this._dir = slideDir;
            this._slideInTime = slideInTime;
            this._slideInEase = slideInEase;
            this._slideInAlphaStart = slideInAlphaStart;
            this._slideInAlphaEase = (slideInAlphaEase == undefined || slideInAlphaEase == null ? slideInEase : slideInAlphaEase);
            this._slideOutTime = slideOutTime;
            this._slideOutDelay = slideOutDelay;
            this._slideOutEase = slideOutEase;
            this._slideOutAlphaEnd = slideOutAlphaEnd;
            this._slideOutAlphaEase = (slideOutAlphaEase == undefined || slideOutAlphaEase == null ? slideOutEase : slideOutAlphaEase);
        }
        Object.defineProperty(MessageType.prototype, "slideDir", {
            get: function () { return this._dir; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideInTime", {
            get: function () { return this._slideInTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideInEase", {
            get: function () { return this._slideInEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideInAlphaStart", {
            get: function () { return this._slideInAlphaStart; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideInAlphaEase", {
            get: function () { return this._slideInAlphaEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutTime", {
            get: function () { return this._slideOutTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutDelay", {
            get: function () { return this._slideOutDelay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutEase", {
            get: function () { return this._slideOutEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutAlphaEnd", {
            get: function () { return this._slideOutAlphaEnd; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutAlphaEase", {
            get: function () { return this._slideOutAlphaEase; },
            enumerable: true,
            configurable: true
        });
        MessageType.prototype.getMessageStartX = function (msg) {
            var camera = this._game.camera;
            return this._dir < 0 ? camera.width : -msg.getMsgContainer().width;
        };
        MessageType.prototype.updateMessage = function (time, msg) {
            var msgContainer = msg.getMsgContainer();
            var res = msg.state;
            var camera = this._game.camera;
            switch (res) {
                case SlideMessage.eMessageState.slideIn: {
                    var progress = time / this._slideInTime;
                    if (progress >= 1) {
                        progress = 1;
                        res = SlideMessage.eMessageState.slideOutDelay;
                    }
                    if (this._slideInAlphaStart != 1)
                        msgContainer.alpha = this._slideInAlphaStart + this._slideInAlphaEase(progress) * (1 - this._slideInAlphaStart);
                    var startX = this.getMessageStartX(msg);
                    var centerX = (camera.width - msgContainer.width) / 2;
                    msgContainer.cameraOffset.x = startX + this._slideInEase(progress) * (centerX - startX);
                    break;
                }
                case SlideMessage.eMessageState.slideOutDelay: {
                    if (time - this._slideInTime < this._slideOutDelay) {
                        msgContainer.cameraOffset.x = (camera.width - msgContainer.width) / 2;
                        break;
                    }
                    res = SlideMessage.eMessageState.slideOut;
                }
                case SlideMessage.eMessageState.slideOut: {
                    var progress = (time - this._slideInTime - this._slideOutDelay) / this._slideOutTime;
                    if (progress >= 1) {
                        progress = 1;
                        res = SlideMessage.eMessageState.completed;
                    }
                    var centerX = (camera.width - msgContainer.width) / 2;
                    var endX = this._dir < 0 ? -msgContainer.width : camera.width;
                    msgContainer.cameraOffset.x = centerX + (endX - centerX) * this._slideOutEase(progress);
                    if (this._slideOutAlphaEnd != 1)
                        msgContainer.alpha = 1 - (1 - this._slideOutAlphaEnd) * this._slideOutAlphaEase(progress);
                    break;
                }
            }
            return res;
        };
        return MessageType;
    }());
    SlideMessage.MessageType = MessageType;
})(SlideMessage || (SlideMessage = {}));
var InfiniteTileMap;
(function (InfiniteTileMap) {
    var TileMap = (function () {
        function TileMap() {
            this._viewX = 0;
            this._viewY = 0;
            this._viewW = 0;
            this._viewH = 0;
        }
        Object.defineProperty(TileMap.prototype, "minX", {
            get: function () { return this._mainLayer.minX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMap.prototype, "maxX", {
            get: function () { return this._mainLayer.maxX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMap.prototype, "minY", {
            get: function () { return this._mainLayer.minY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMap.prototype, "maxY", {
            get: function () { return this._mainLayer.maxY; },
            enumerable: true,
            configurable: true
        });
        TileMap.prototype.getLayer = function (id) { return this._layers[id]; };
        TileMap.prototype.setLayers = function (layers, mainLayerId) {
            if (mainLayerId === void 0) { mainLayerId = 0; }
            this._layers = layers;
            this._mainLayer = layers[mainLayerId];
        };
        TileMap.prototype.reset = function (viewX, viewY) {
            this._viewX = viewX;
            this._viewY = viewY;
            if (this._layers != undefined) {
                var i = this._layers.length;
                while (i-- != 0)
                    this._layers[i].redraw();
            }
        };
        Object.defineProperty(TileMap.prototype, "viewX", {
            get: function () { return this._viewX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMap.prototype, "viewY", {
            get: function () { return this._viewY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMap.prototype, "viewW", {
            get: function () { return this._viewW; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMap.prototype, "viewH", {
            get: function () { return this._viewH; },
            enumerable: true,
            configurable: true
        });
        TileMap.prototype.setViewSize = function (width, height) {
            if (this._viewW == width && this._viewH == height)
                return;
            this._viewW = width;
            this._viewH = height;
            if (this._layers != undefined) {
                var i = this._layers.length;
                while (i-- != 0)
                    this._layers[i].updateBufferSize();
            }
        };
        TileMap.prototype.setViewPosition = function (x, y) {
            if (this._viewX == x && this._viewY == y)
                return;
            this._viewX = x;
            this._viewY = y;
            var i = this._layers.length;
            while (i-- != 0)
                this._layers[i].update();
        };
        return TileMap;
    }());
    InfiniteTileMap.TileMap = TileMap;
})(InfiniteTileMap || (InfiniteTileMap = {}));
var InfiniteTileMap;
(function (InfiniteTileMap) {
    var TileMapContent = (function () {
        function TileMapContent() {
        }
        return TileMapContent;
    }());
    InfiniteTileMap.TileMapContent = TileMapContent;
})(InfiniteTileMap || (InfiniteTileMap = {}));
var InfiniteTileMap;
(function (InfiniteTileMap) {
    var TileMapLayer = (function () {
        function TileMapLayer(map, content, tileSet, group, showBuffer) {
            if (showBuffer === void 0) { showBuffer = false; }
            this._map = map;
            this._content = content;
            this._tileSet = tileSet;
            var game = Game.Global.game;
            this._buffer = game.make.bitmapData(this.calculateBufferWidth(), this.calculateBufferHeight());
            var img = game.add.image(0, 0, this._buffer);
            if (showBuffer) {
                img.fixedToCamera = true;
                img.scale.set(0.5);
            }
            else {
                img.visible = false;
            }
            this._presenters = [];
            for (var i = 0; i < 4; i++) {
                var presenter = game.add.image(0, 0, new PIXI.Texture(this._buffer.baseTexture, new PIXI.Rectangle(0, 0, this._buffer.width, this._buffer.height)), null, group);
                presenter.crop(new Phaser.Rectangle(0, 0, 0, 0), false);
                this._presenters.push(presenter);
            }
        }
        Object.defineProperty(TileMapLayer.prototype, "map", {
            get: function () { return this._map; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMapLayer.prototype, "content", {
            get: function () { return this._content; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMapLayer.prototype, "minX", {
            get: function () {
                var minCol = this._content.minCol();
                if (minCol == null)
                    return null;
                return minCol * this._tileSet.tileWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMapLayer.prototype, "maxX", {
            get: function () {
                var maxCol = this._content.maxCol();
                if (maxCol == null)
                    return null;
                return maxCol * this._tileSet.tileWidth + this._tileSet.tileWidth - 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMapLayer.prototype, "minY", {
            get: function () {
                var minRow = this._content.minRow();
                if (minRow == null)
                    return null;
                return minRow * this._tileSet.tileHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileMapLayer.prototype, "maxY", {
            get: function () {
                var maxRow = this._content.maxRow();
                if (maxRow == null)
                    return null;
                return maxRow * this._tileSet.tileHeight + this._tileSet.tileHeight - 1;
            },
            enumerable: true,
            configurable: true
        });
        TileMapLayer.prototype.calculateBufferWidth = function () {
            var tileW = this._tileSet.tileWidth;
            return Math.ceil((this._map.viewW + tileW * 2) / tileW) * tileW + tileW;
        };
        TileMapLayer.prototype.calculateBufferHeight = function () {
            var tileH = this._tileSet.tileHeight;
            return Math.ceil((this._map.viewH + tileH * 2) / tileH) * tileH + tileH;
        };
        TileMapLayer.prototype.updateBufferSize = function () {
            var newW = this.calculateBufferWidth();
            var newH = this.calculateBufferHeight();
            if (this._buffer.width != newW || this._buffer.height != newH) {
                for (var i = 0; i < 4; i++) {
                    this._presenters[i].texture.destroy(false);
                }
                this._buffer.resize(newW, newH);
                for (var i = 0; i < 4; i++) {
                    this._presenters[i].loadTexture(new PIXI.Texture(this._buffer.baseTexture, new PIXI.Rectangle(0, 0, newW, newH)));
                }
                this.redraw();
            }
        };
        TileMapLayer.prototype.checkMinX = function (x) {
            var minX = this.minX;
            if (minX != null && x < minX)
                return minX;
            return x;
        };
        TileMapLayer.prototype.checkMaxX = function (x) {
            var maxX = this.maxX;
            if (maxX != null && x > maxX)
                return maxX;
            return x;
        };
        TileMapLayer.prototype.checkMinY = function (y) {
            var minY = this.minY;
            if (minY != null && y < minY)
                return minY;
            return y;
        };
        TileMapLayer.prototype.checkMaxY = function (y) {
            var maxY = this.maxY;
            if (maxY != null && y > maxY)
                return maxY;
            return y;
        };
        TileMapLayer.prototype.redraw = function () {
            var tileSet = this._tileSet;
            var tileW = tileSet.tileWidth;
            var tileH = tileSet.tileHeight;
            var mapViewX = this._map.viewX;
            var mapViewY = this._map.viewY;
            var mapViewW = this._map.viewW;
            var mapViewH = this._map.viewH;
            var bufViewX = this.checkMinX(mapViewX - tileW);
            var bufViewY = this.checkMinY(mapViewY - tileH);
            var bufViewW = this.checkMaxX(mapViewX + mapViewW + tileW - 1) - bufViewX + 1;
            var bufViewH = this.checkMaxY(mapViewY + mapViewH + tileH - 1) - bufViewY + 1;
            this._bufX = 0;
            this._bufY = 0;
            this._lCol = Math.floor(bufViewX / tileW);
            this._rCol = Math.floor((bufViewX + bufViewW - 1) / tileW);
            this._tRow = Math.floor(bufViewY / tileH);
            this._bRow = Math.floor((bufViewY + bufViewH - 1) / tileH);
            var context = this._buffer.context;
            var y = 0;
            var row = this._tRow;
            var layerCnt = this._content.layerCnt();
            do {
                var x = 0;
                var col = this._lCol;
                do {
                    for (var layerId = 0; layerId < layerCnt; layerId++) {
                        var tileId = this._content.getTileId(col, row, layerId);
                        if (tileId >= 0)
                            tileSet.draw(context, x, y, tileId);
                    }
                    col++;
                    x += tileW;
                } while (x < bufViewW);
                y += tileH;
            } while (++row <= this._bRow);
            this._buffer.dirty = true;
            var presenter = this._presenters[0];
            presenter.cropRect.setTo(mapViewX - (this._lCol * tileW), mapViewY - (this._tRow * tileH), mapViewW, mapViewH);
            presenter.updateCrop();
            this._presenters[1].visible = false;
            this._presenters[2].visible = false;
            this._presenters[3].visible = false;
        };
        TileMapLayer.prototype.update = function () {
            var tileW = this._tileSet.tileWidth;
            var tileH = this._tileSet.tileHeight;
            var mapViewX = this._map.viewX;
            var mapViewY = this._map.viewY;
            var mapViewW = this._map.viewW;
            var mapViewH = this._map.viewH;
            var bufViewX = this.checkMinX(mapViewX - tileW);
            var bufViewY = this.checkMinY(mapViewY - tileH);
            var bufViewW = this.checkMaxX(mapViewX + mapViewW + tileW - 1) - bufViewX + 1;
            var bufViewH = this.checkMaxY(mapViewY + mapViewH + tileH - 1) - bufViewY + 1;
            var newLCol = Math.floor(bufViewX / tileW);
            var newRCol = Math.floor((bufViewX + bufViewW - 1) / tileW);
            var newTRow = Math.floor(bufViewY / tileH);
            var newBRow = Math.floor((bufViewY + bufViewH - 1) / tileH);
            if (this._lCol > newRCol || this._rCol < newLCol || this._tRow > newBRow || this._bRow < newTRow) {
                this.redraw();
                return;
            }
            if (this._tRow > newTRow) {
                this.addTop(this._tRow - newTRow);
            }
            else if (this._bRow < newBRow) {
                this.addBottom(newBRow - this._bRow);
            }
            else if (this._bRow > newBRow) {
                this._bRow = newBRow;
            }
            if (this._lCol > newLCol) {
                this.addLeft(this._lCol - newLCol);
            }
            else if (this._rCol < newRCol) {
                this.addRight(newRCol - this._rCol);
            }
            var bufferW = this._buffer.width;
            var bufferH = this._buffer.height;
            var presenter;
            var lPresenterX = this._bufX + (mapViewX - (this._lCol * tileW));
            if (lPresenterX > bufferW)
                lPresenterX = lPresenterX - bufferW;
            var tPresenterY = this._bufY + (mapViewY - (this._tRow * tileH));
            if (tPresenterY > bufferH)
                tPresenterY = tPresenterY - bufferH;
            var lPresenterW = mapViewW;
            var tPresenterH = mapViewH;
            if (lPresenterX + lPresenterW > bufferW)
                lPresenterW = bufferW - lPresenterX;
            if (tPresenterY + tPresenterH <= bufferH) {
                this._presenters[2].visible = false;
                this._presenters[3].visible = false;
            }
            else {
                tPresenterH = bufferH - tPresenterY;
                presenter = this._presenters[2];
                presenter.visible = true;
                presenter.y = tPresenterH;
                presenter.cropRect.setTo(lPresenterX, 0, lPresenterW, mapViewH - tPresenterH);
                presenter.updateCrop();
                if (lPresenterW != mapViewW) {
                    presenter = this._presenters[3];
                    presenter.visible = true;
                    presenter.position.set(lPresenterW, tPresenterH);
                    presenter.cropRect.setTo(0, 0, mapViewW - lPresenterW, mapViewH - tPresenterH);
                    presenter.updateCrop();
                }
                else {
                    this._presenters[3].visible = false;
                }
            }
            presenter = this._presenters[0];
            presenter.cropRect.setTo(lPresenterX, tPresenterY, lPresenterW, tPresenterH);
            presenter.updateCrop();
            if (lPresenterW != mapViewW) {
                presenter = this._presenters[1];
                presenter.visible = true;
                presenter.x = lPresenterW;
                presenter.cropRect.setTo(0, tPresenterY, mapViewW - lPresenterW, tPresenterH);
                presenter.updateCrop();
            }
            else {
                this._presenters[1].visible = false;
            }
        };
        TileMapLayer.prototype.addLeft = function (colCnt) {
            var tileW = this._tileSet.tileWidth;
            var bufW = this._buffer.width;
            var bufLX = this._bufX;
            var bufRX = bufLX + (this._rCol - this._lCol) * tileW;
            if (bufRX >= bufW)
                bufRX = bufRX - bufW;
            do {
                bufLX -= tileW;
                if (bufLX < 0)
                    bufLX = bufW - tileW;
                if (bufLX == bufRX) {
                    bufRX -= tileW;
                    if (bufRX < 0)
                        bufRX = bufW - tileW;
                    this._rCol--;
                }
                this.drawColumn(bufLX, --this._lCol);
            } while (--colCnt != 0);
            this._bufX = bufLX;
            this._buffer.dirty = true;
        };
        TileMapLayer.prototype.addRight = function (colCnt) {
            var tileW = this._tileSet.tileWidth;
            var bufW = this._buffer.width;
            var bufLX = this._bufX;
            var bufRX = bufLX + (this._rCol - this._lCol) * tileW;
            if (bufRX >= bufW)
                bufRX = bufRX - bufW;
            do {
                bufRX += tileW;
                if (bufRX == bufW)
                    bufRX = 0;
                if (bufRX == bufLX) {
                    bufLX += tileW;
                    if (bufLX == bufW)
                        bufLX = 0;
                    this._bufX = bufLX;
                    this._lCol++;
                }
                this.drawColumn(bufRX, ++this._rCol);
            } while (--colCnt != 0);
            this._buffer.dirty = true;
        };
        TileMapLayer.prototype.addTop = function (rowCnt) {
            var tileH = this._tileSet.tileHeight;
            var bufH = this._buffer.height;
            var bufTY = this._bufY;
            var bufBY = bufTY + (this._bRow - this._tRow) * tileH;
            if (bufBY >= bufH)
                bufBY = bufBY - bufH;
            do {
                bufTY -= tileH;
                if (bufTY < 0)
                    bufTY = bufH - tileH;
                if (bufTY == bufBY) {
                    bufBY -= tileH;
                    if (bufBY < 0)
                        bufBY = bufH - tileH;
                    this._bRow--;
                }
                this.drawRow(bufTY, --this._tRow);
            } while (--rowCnt != 0);
            this._bufY = bufTY;
            this._buffer.dirty = true;
        };
        TileMapLayer.prototype.addBottom = function (rowCnt) {
            var tileH = this._tileSet.tileHeight;
            var bufH = this._buffer.height;
            var bufTY = this._bufY;
            var bufBY = bufTY + (this._bRow - this._tRow) * tileH;
            if (bufBY >= bufH)
                bufBY = bufBY - bufH;
            do {
                bufBY += tileH;
                if (bufBY == bufH)
                    bufBY = 0;
                if (bufBY == bufTY) {
                    bufTY += tileH;
                    if (bufTY == bufH)
                        bufTY = 0;
                    this._bufY = bufTY;
                    this._tRow++;
                }
                this.drawRow(bufBY, ++this._bRow);
            } while (--rowCnt != 0);
            this._buffer.dirty = true;
        };
        TileMapLayer.prototype.drawColumn = function (bufX, col) {
            var bufY = this._bufY;
            var bufH = this._buffer.height;
            var row = this._tRow;
            var context = this._buffer.context;
            var tileSet = this._tileSet;
            var content = this._content;
            var layerCnt = content.layerCnt();
            do {
                this._buffer.clear(bufX, bufY, tileSet.tileWidth, tileSet.tileHeight);
                for (var layerId = 0; layerId < layerCnt; layerId++) {
                    var tileId = content.getTileId(col, row, layerId);
                    if (tileId >= 0)
                        tileSet.draw(context, bufX, bufY, tileId);
                }
                row++;
                bufY += tileSet.tileHeight;
                if (bufY == bufH)
                    bufY = 0;
            } while (row <= this._bRow);
        };
        TileMapLayer.prototype.drawRow = function (bufY, row) {
            var bufX = this._bufX;
            var bufW = this._buffer.width;
            var col = this._lCol;
            var context = this._buffer.context;
            var tileSet = this._tileSet;
            var content = this._content;
            var layerCnt = content.layerCnt();
            do {
                for (var layerId = 0; layerId < layerCnt; layerId++) {
                    var tileId = content.getTileId(col, row, layerId);
                    if (tileId >= 0)
                        tileSet.draw(context, bufX, bufY, tileId);
                }
                col++;
                bufX += tileSet.tileWidth;
                if (bufX == bufW)
                    bufX = 0;
            } while (col <= this._rCol);
        };
        return TileMapLayer;
    }());
    InfiniteTileMap.TileMapLayer = TileMapLayer;
})(InfiniteTileMap || (InfiniteTileMap = {}));
var GameMap;
(function (GameMap) {
    function initMapBlocks() {
        var blockId = 0;
        var blocks = [];
        var map;
        var barriers;
        var difficulties;
        var settings;
        var objects;
        var obsTireColor0 = new GameObjects.ObsTireCustomData(0);
        var obsTireColor1 = new GameObjects.ObsTireCustomData(1);
        var obsSpeedBar1 = new GameObjects.ObsSpeedBarCustomData(false);
        difficulties = [];
        map = [];
        map[0] = [46, 47, 44, 45, 46, 47, 70, 71, 97, 132, 113, 102, 44, 45, 46, 47, 70, 71, 46, 47, 58, 59, 56, 57, 58, 59, 82, 83, 109, 113, 113, 114, 56, 57, 58, 59, 82, 83, 58, 59, 68, 69, 70, 71, 44, 45, 46, 47, 97, 144, 113, 102, 70, 71, 68, 69, 46, 47, 44, 45, 80, 81, 82, 83, 56, 57, 58, 59, 109, 113, 113, 114, 82, 83, 80, 81, 58, 59, 56, 57, 44, 45, 70, 71, 70, 71, 68, 69, 97, 113, 131, 102, 46, 47, 44, 45, 44, 45, 70, 71, 56, 57, 82, 83, 82, 83, 80, 81, 109, 113, 113, 114, 58, 59, 56, 57, 56, 57, 82, 83, 70, 71, 46, 47, 46, 47, 44, 45, 97, 113, 132, 102, 68, 69, 70, 71, 46, 47, 46, 47, 82, 83, 58, 59, 58, 59, 56, 57, 109, 113, 113, 114, 80, 81, 82, 83, 58, 59, 58, 59, 44, 45, 46, 47, 70, 71, 70, 71, 97, 131, 113, 102, 44, 45, 46, 47, 70, 71, 68, 69, 56, 57, 58, 59, 82, 83, 82, 83, 109, 113, 113, 114, 56, 57, 58, 59, 82, 83, 80, 81];
        map[1] = [0, 0, 0, 227, 228, 0, 0, 140, 0, 0, 0, 0, 140, 0, 153, 154, 0, 0, 0, 0, 0, 1, 2, 239, 240, 0, 198, 139, 0, 0, 0, 0, 139, 0, 0, 0, 221, 222, 223, 0, 0, 13, 14, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 4, 5, 233, 234, 235, 227, 0, 25, 26, 0, 0, 0, 197, 140, 0, 0, 0, 0, 140, 15, 16, 17, 18, 0, 0, 239, 0, 37, 153, 154, 156, 161, 162, 139, 0, 0, 0, 0, 140, 27, 28, 29, 30, 219, 220, 0, 0, 49, 0, 0, 168, 173, 174, 140, 0, 0, 0, 0, 153, 154, 40, 41, 42, 231, 232, 0, 0, 61, 0, 0, 180, 185, 186, 140, 0, 0, 0, 0, 139, 221, 222, 223, 0, 0, 205, 206, 0, 0, 0, 0, 219, 220, 0, 139, 0, 0, 0, 0, 140, 233, 234, 235, 213, 214, 217, 218, 220, 221, 222, 223, 231, 232, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 225, 226, 229, 230, 232, 233, 234, 235, 0, 0, 153, 154, 0, 0, 0, 0, 140, 0, 198, 0, 237, 238, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [486, 0, 486, 639];
        barriers[1] = [790, 0, 790, 639];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 143, 536, 124, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 143, 741, 124, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        settings.push(new GameMap.MapBlockSettings(null));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 473, 535, 454, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 326, 722, 294));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 312, 538, 293, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 143, 536, 124, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 473, 743, 454, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 328, 555, 296));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 312, 743, 293, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 143, 743, 124, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 471, 580, 438));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 332, 643, 299));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 188, 710, 155));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 464, 647, 400, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 128, 533, 109, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 128, 743, 109, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 8));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 433, 531, 414, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 374, 569, 355, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 315, 607, 296, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 143, 687, 111));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 433, 744, 414, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 373, 712, 354, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 315, 686, 296, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 155, 605, 123));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 392, 651, 328, 0, obsSpeedBar1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 536, 570, 503));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 448, 748, 429, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 403, 570, 370));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 306, 748, 287, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 269, 570, 236));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 165, 750, 146, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 130, 570, 97));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 533, 739, 514, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 453, 739, 434, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 373, 695, 354, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 293, 695, 274, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 173, 620, 141));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 273, 740, 254, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 142, 741, 123, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 8));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 331, 538, 312, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 331, 740, 312, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 331, 599, 312, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 175, 670, 143));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 339, 676, 320, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 339, 737, 320, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 339, 534, 320, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 164, 610, 132));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 469, 690, 437, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 239, 675, 207));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 178, 566, 159, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 117, 566, 98, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 516, 570, 484));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 320, 568, 288, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 225, 730, 206, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 156, 731, 137, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 387, 699, 323, 0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 456, 647, 392, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 144, 649, 112));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 507, 562, 443, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 314, 639, 282));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 202, 716, 138, 0, obsSpeedBar1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 465, 601, 446, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 465, 535, 446, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 334, 648, 302));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 165, 739, 146, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 165, 672, 146, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 5));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 46, 47, 70, 71, 46, 47, 97, 113, 131, 102, 46, 47, 44, 45, 46, 47, 68, 69, 56, 57, 58, 59, 82, 83, 58, 59, 109, 113, 113, 114, 58, 59, 56, 57, 58, 59, 80, 81, 68, 69, 70, 71, 68, 69, 44, 45, 97, 113, 132, 102, 44, 45, 68, 69, 70, 71, 68, 69, 80, 81, 82, 83, 80, 81, 56, 57, 109, 113, 113, 114, 56, 57, 80, 81, 82, 83, 80, 81, 46, 47, 44, 45, 46, 47, 68, 69, 97, 131, 125, 126, 68, 69, 68, 69, 44, 45, 46, 47, 58, 59, 56, 57, 58, 59, 80, 81, 109, 124, 137, 83, 80, 81, 80, 81, 56, 57, 58, 59, 44, 45, 68, 69, 70, 71, 68, 69, 97, 102, 44, 45, 68, 69, 70, 71, 68, 69, 70, 71, 56, 57, 80, 81, 82, 83, 80, 81, 109, 114, 56, 57, 80, 81, 82, 83, 80, 81, 82, 83, 68, 69, 68, 69, 44, 45, 46, 47, 97, 102, 68, 69, 70, 71, 44, 45, 46, 47, 46, 47, 80, 81, 80, 81, 56, 57, 58, 59, 109, 114, 80, 81, 82, 83, 56, 57, 58, 59, 58, 59, 68, 69, 70, 71, 68, 69, 70, 71, 97, 22, 11, 71, 46, 47, 68, 69, 70, 71, 44, 45, 80, 81, 82, 83, 80, 81, 82, 83, 109, 113, 0, 83, 58, 59, 80, 81, 82, 83, 56, 57, 70, 71, 44, 45, 46, 47, 46, 47, 97, 113, 0, 36, 44, 45, 70, 71, 46, 47, 68, 69, 82, 83, 56, 57, 58, 59, 58, 59, 109, 113, 0, 0, 56, 57, 82, 83, 58, 59, 80, 81, 46, 47, 68, 69, 70, 71, 44, 45, 97, 113, 0, 0, 70, 71, 44, 45, 46, 47, 46, 47, 58, 59, 80, 81, 82, 83, 56, 57, 109, 113, 113, 0, 82, 83, 56, 57, 58, 59, 58, 59, 44, 45, 70, 71, 46, 47, 68, 69, 97, 131, 113, 60, 46, 47, 68, 69, 70, 71, 44, 45, 56, 57, 82, 83, 58, 59, 80, 81, 109, 113, 113, 114, 58, 59, 80, 81, 82, 83, 56, 57];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 0, 236, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 198, 180, 185, 186, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 73, 110, 78, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 112, 99, 62, 233, 234, 235, 0, 0, 0, 0, 0, 0, 221, 222, 40, 41, 1, 2, 0, 0, 111, 100, 63, 78, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 13, 14, 0, 0, 112, 98, 99, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 25, 26, 0, 0, 111, 99, 98, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 37, 0, 0, 0, 133, 52, 100, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 49, 0, 0, 0, 0, 133, 39, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 197, 0, 145, 146, 139, 0, 0, 0, 0, 153, 154, 0, 221, 222, 223, 0, 0, 233, 234, 235, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 233, 234, 235, 0, 0, 219, 220, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 219, 220, 0, 231, 232, 0, 0, 0, 0, 0, 140, 0, 0, 0, 129, 160, 0, 0, 0, 0, 231, 232, 0, 0, 213, 214, 0, 0, 221, 222, 223, 0, 0, 7, 33, 0, 0, 0, 0, 0, 155, 0, 0, 0, 225, 226, 205, 206, 233, 234, 235, 0, 0, 140, 197, 0, 0, 0, 0, 0, 167, 0, 0, 0, 237, 238, 217, 218, 0, 0, 140, 0, 0, 139, 0, 0, 0, 0, 0, 0, 179, 0, 0, 0, 0, 0, 229, 230, 224, 0, 139, 0, 0, 140, 0, 0, 0, 0, 0, 0, 191, 192, 0, 220, 0, 0, 0, 0, 236, 0, 140, 0, 0, 139, 0, 0, 0, 0, 0, 0, 203, 204, 0, 232, 0, 0, 0, 0, 0, 0, 139, 0, 0, 24, 0, 0, 0, 0, 0, 0, 215, 216, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 34, 12, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 223, 0, 42, 0, 140, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 34, 12, 145, 146, 205, 206, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 213, 214, 217, 218, 0, 0, 219, 161, 162, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 225, 226, 229, 230, 0, 0, 231, 173, 174, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 237, 238, 0, 221, 222, 223, 0, 185, 186, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 233, 234, 235, 0];
        barriers = [];
        barriers[0] = [486, 0, 486, 1151];
        barriers[1] = [790, 1151, 791, 887, 665, 652, 662, 420, 690, 338, 749, 265, 790, 235, 790, 0];
        settings = [];
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 950, 730, 917));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 835, 664, 802));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 708, 597, 675));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 153, 705, 121));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 868, 674, 836));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 489, 576, 456));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 341, 577, 308));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 242, 665, 209));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 974, 535, 955, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 974, 598, 955, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 549, 577, 517));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 136, 744, 117, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 136, 531, 117, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1014, 730, 981));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 909, 651, 876));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 903, 742, 884, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 838, 705, 819, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 782, 573, 749));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 774, 671, 755, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 199, 524, 180, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 193, 701, 161));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 144, 574, 125, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 964, 572, 900, 0, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 533, 528, 514, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 437, 527, 418, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 344, 529, 325, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 169, 663, 137));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [68, 69, 44, 45, 70, 71, 46, 47, 97, 113, 113, 102, 44, 45, 70, 71, 68, 69, 44, 45, 80, 81, 56, 57, 82, 83, 58, 59, 109, 113, 113, 114, 56, 57, 82, 83, 80, 81, 56, 57, 70, 71, 68, 69, 46, 47, 70, 71, 97, 113, 131, 102, 68, 69, 44, 45, 70, 71, 68, 69, 82, 83, 80, 81, 58, 59, 157, 158, 86, 113, 113, 114, 80, 81, 56, 57, 82, 83, 80, 81, 70, 71, 70, 71, 147, 148, 159, 113, 131, 113, 125, 126, 70, 71, 68, 69, 44, 45, 70, 71, 82, 83, 157, 158, 159, 113, 113, 113, 113, 189, 137, 83, 82, 83, 80, 81, 56, 57, 82, 83, 46, 47, 169, 100, 98, 113, 113, 200, 201, 202, 68, 69, 46, 47, 70, 71, 68, 69, 46, 47, 58, 59, 109, 98, 99, 124, 211, 212, 82, 83, 80, 81, 58, 59, 82, 83, 80, 81, 58, 59, 70, 71, 97, 113, 100, 102, 44, 45, 46, 47, 68, 69, 70, 71, 46, 47, 70, 71, 70, 71, 82, 83, 109, 113, 113, 114, 56, 57, 58, 59, 80, 81, 82, 83, 58, 59, 82, 83, 82, 83, 44, 45, 97, 113, 113, 88, 76, 76, 151, 152, 70, 71, 44, 45, 70, 71, 46, 47, 44, 45, 56, 57, 109, 113, 143, 113, 113, 113, 113, 164, 165, 166, 56, 57, 82, 83, 58, 59, 56, 57, 68, 69, 193, 194, 195, 113, 113, 131, 113, 113, 99, 178, 68, 69, 44, 45, 70, 71, 68, 69, 80, 81, 82, 83, 207, 208, 135, 136, 123, 98, 100, 114, 80, 81, 56, 57, 82, 83, 80, 81, 70, 71, 46, 47, 68, 69, 70, 71, 97, 113, 113, 102, 70, 71, 68, 69, 44, 45, 70, 71, 82, 83, 58, 59, 80, 81, 82, 83, 109, 113, 113, 114, 82, 83, 80, 81, 56, 57, 82, 83];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 221, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0, 0, 0, 233, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 73, 101, 110, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 111, 0, 0, 62, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 0, 0, 0, 0, 0, 0, 112, 0, 0, 50, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 219, 220, 0, 0, 220, 0, 133, 52, 0, 62, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 231, 232, 0, 0, 232, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 78, 0, 0, 15, 16, 17, 18, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 73, 64, 0, 50, 0, 0, 27, 28, 29, 30, 0, 37, 221, 222, 223, 0, 0, 0, 0, 0, 112, 0, 0, 62, 0, 0, 0, 40, 41, 42, 0, 49, 233, 234, 235, 0, 0, 0, 0, 0, 133, 38, 39, 138, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 154, 0, 197, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 129, 33, 197, 0, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 153, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 171, 139, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 160, 140, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 115, 184, 139, 0, 139, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 140, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 196, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 183, 141, 139, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [486, 0, 484, 186, 100, 373, 102, 776, 365, 915, 485, 914, 486, 1023];
        barriers[1] = [412, 531, 544, 469, 544, 622, 486, 623, 424, 594, 406, 532];
        barriers[2] = [790, 0, 790, 249, 716, 299, 662, 371, 663, 688, 792, 761, 790, 1023];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 771, 148, 752, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 757, 665, 738, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 694, 548, 675, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 688, 613, 655));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 580, 613, 547));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 467, 613, 434));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 414, 143, 395, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 189, 753, 170, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 157, 575, 125));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 91, 753, 72, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 892, 752, 873, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 811, 449, 778));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 804, 753, 785, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 771, 152, 752, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 767, 305, 734));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 674, 609, 655, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 616, 245, 583));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 459, 302, 426));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 421, 141, 402, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 400, 446, 367));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 293, 380, 274, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 252, 465, 233, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 152, 705, 120));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 817, 230, 760, 25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 812, 753, 793, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 803, 513, 770));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 761, 359, 728));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 674, 609, 655, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 632, 252, 599));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 467, 436, 408, 62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 440, 610, 421, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 417, 146, 398, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 172, 708, 140));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 150, 527, 131, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 60, 527, 41, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 833, 670, 801));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 766, 149, 747, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 624, 347, 605, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 583, 149, 564, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 547, 249, 514));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 543, 347, 524, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 410, 286, 377));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 406, 145, 387, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 341, 412, 308));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 281, 542, 248));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 236, 755, 217, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 181, 577, 117, 0, obsSpeedBar1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 2, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [70, 71, 46, 47, 44, 45, 46, 47, 97, 144, 132, 102, 44, 45, 70, 71, 68, 69, 44, 45, 82, 83, 58, 59, 56, 57, 58, 59, 109, 113, 100, 99, 56, 57, 82, 83, 80, 81, 56, 57, 44, 45, 70, 71, 68, 69, 70, 71, 97, 98, 99, 98, 68, 69, 44, 45, 70, 71, 68, 69, 56, 57, 82, 83, 80, 81, 82, 83, 109, 113, 100, 114, 80, 81, 56, 57, 82, 83, 80, 81, 68, 69, 44, 45, 70, 71, 70, 8, 21, 113, 144, 84, 70, 71, 68, 69, 44, 45, 70, 71, 80, 81, 56, 57, 82, 83, 82, 20, 113, 143, 95, 96, 82, 83, 80, 81, 56, 57, 82, 83, 70, 71, 68, 69, 44, 45, 31, 32, 113, 113, 107, 71, 46, 47, 70, 71, 68, 69, 46, 47, 82, 83, 80, 81, 56, 57, 43, 113, 113, 106, 119, 83, 58, 59, 82, 0, 80, 81, 58, 59, 44, 45, 70, 71, 68, 69, 97, 113, 132, 102, 44, 45, 70, 71, 46, 47, 70, 71, 70, 71, 56, 57, 82, 83, 80, 81, 109, 113, 113, 114, 56, 57, 82, 83, 58, 59, 82, 83, 82, 83, 68, 69, 44, 45, 70, 71, 97, 143, 113, 102, 68, 69, 44, 45, 70, 71, 46, 47, 44, 45, 80, 81, 56, 57, 82, 83, 109, 113, 113, 114, 80, 81, 56, 57, 82, 83, 58, 59, 56, 57, 70, 71, 68, 69, 46, 47, 99, 144, 113, 102, 70, 71, 68, 69, 44, 45, 70, 71, 68, 69, 82, 83, 80, 81, 58, 59, 98, 100, 113, 114, 82, 83, 80, 81, 56, 57, 82, 83, 80, 81, 46, 47, 70, 71, 70, 71, 79, 98, 100, 22, 11, 71, 70, 71, 68, 69, 44, 45, 70, 71, 58, 59, 82, 83, 82, 83, 91, 92, 143, 113, 23, 83, 82, 83, 80, 81, 56, 57, 82, 83, 70, 71, 46, 47, 44, 45, 70, 104, 113, 113, 35, 36, 44, 45, 70, 71, 68, 69, 44, 45, 82, 83, 58, 59, 56, 57, 82, 116, 105, 132, 113, 48, 56, 57, 82, 83, 80, 81, 56, 57, 44, 45, 70, 71, 68, 69, 46, 47, 97, 113, 113, 102, 68, 69, 44, 45, 70, 71, 68, 69, 56, 57, 0, 83, 80, 81, 58, 59, 109, 113, 113, 114, 80, 81, 56, 57, 82, 83, 80, 81, 68, 69, 44, 45, 70, 71, 70, 71, 97, 113, 143, 102, 70, 71, 68, 69, 44, 45, 70, 71, 80, 81, 56, 57, 82, 83, 82, 83, 109, 113, 113, 114, 82, 83, 80, 81, 56, 57, 82, 83];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 110, 101, 78, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 221, 222, 223, 0, 73, 64, 0, 0, 50, 219, 220, 0, 0, 0, 0, 0, 0, 0, 227, 228, 233, 234, 235, 0, 112, 0, 0, 0, 62, 231, 232, 0, 0, 221, 222, 223, 0, 0, 239, 240, 0, 0, 0, 0, 133, 52, 0, 51, 138, 0, 0, 224, 0, 233, 234, 235, 0, 0, 0, 0, 0, 153, 154, 0, 0, 133, 39, 138, 0, 0, 0, 236, 0, 0, 0, 0, 0, 156, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 4, 5, 0, 153, 154, 0, 0, 168, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 180, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 40, 41, 42, 0, 213, 214, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 0, 0, 0, 0, 225, 226, 233, 234, 235, 219, 220, 0, 0, 0, 0, 0, 0, 0, 25, 26, 221, 222, 223, 0, 237, 238, 0, 0, 0, 231, 232, 73, 110, 78, 0, 0, 0, 198, 37, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 112, 0, 63, 78, 0, 0, 0, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 0, 0, 63, 78, 0, 0, 61, 0, 0, 0, 197, 0, 221, 222, 0, 0, 221, 222, 223, 133, 52, 0, 0, 62, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 0, 0, 233, 234, 235, 0, 133, 38, 39, 138, 0, 0, 153, 154, 156, 161, 162, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 0, 0, 0, 4, 5, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 0, 227, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 239, 27, 28, 29, 30, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 40, 41, 42, 233, 234, 235, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [486, 0, 486, 255, 353, 539, 355, 877, 484, 1135, 486, 1407];
        barriers[1] = [790, 0, 790, 254, 663, 499, 663, 889, 794, 1158, 790, 1407];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1138, 734, 1119, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1070, 694, 1051, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1065, 571, 1032));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 997, 658, 978, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 929, 500, 896));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 758, 495, 725));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 615, 397, 596, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 584, 493, 551));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 525, 406, 506, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 448, 445, 429, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 172, 653, 140));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1221, 527, 1202, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1221, 746, 1202, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1060, 580, 1027));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 911, 507, 878));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 736, 501, 703));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 562, 501, 529));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 318, 641, 286));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 168, 527, 149, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 168, 746, 149, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1143, 648, 1071, -25, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 982, 497, 950));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 861, 405, 842, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 754, 405, 735, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 583, 435, 551, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 568, 527, 535));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 447, 601, 414));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 310, 674, 277));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 184, 753, 165, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 107, 753, 88, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1382, 645, 1318, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1125, 726, 1106, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1048, 685, 1029, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 971, 646, 952, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 927, 551, 894));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 772, 549, 739));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 614, 549, 581));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 525, 406, 506, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 448, 445, 429, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 360, 488, 341, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 204, 657, 172));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1347, 753, 1328, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1241, 753, 1222, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1190, 676, 1157));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 1138, 522, 1066, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1064, 608, 1031));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 932, 529, 899));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 788, 564, 769, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 788, 622, 769, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 537, 402, 518, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 460, 443, 441, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 353, 626, 321));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 192, 753, 173, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 113, 753, 94, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 70, 71, 68, 69, 44, 45, 97, 113, 143, 102, 44, 45, 70, 71, 68, 69, 44, 45, 56, 57, 82, 83, 80, 81, 56, 57, 109, 113, 113, 114, 56, 57, 82, 83, 80, 81, 56, 57, 68, 69, 44, 45, 70, 71, 68, 69, 97, 132, 125, 126, 68, 69, 44, 45, 70, 71, 68, 69, 80, 81, 56, 57, 82, 83, 80, 81, 109, 98, 137, 83, 80, 81, 56, 57, 82, 83, 80, 81, 70, 71, 68, 69, 44, 45, 70, 71, 97, 99, 11, 71, 70, 71, 68, 69, 44, 45, 70, 71, 82, 83, 80, 81, 56, 57, 82, 83, 109, 100, 23, 83, 82, 83, 80, 81, 56, 57, 82, 83, 46, 47, 46, 47, 68, 69, 46, 47, 97, 131, 35, 36, 46, 47, 68, 69, 68, 69, 46, 47, 58, 59, 58, 59, 80, 81, 58, 59, 109, 144, 132, 48, 58, 59, 80, 81, 80, 81, 58, 59, 70, 71, 46, 47, 68, 69, 70, 71, 121, 122, 113, 102, 70, 71, 46, 47, 70, 71, 70, 71, 82, 83, 58, 59, 80, 81, 82, 83, 82, 134, 123, 114, 82, 83, 58, 59, 82, 83, 82, 83, 44, 45, 70, 71, 46, 47, 44, 45, 70, 71, 97, 102, 44, 45, 70, 71, 46, 47, 44, 45, 56, 57, 82, 83, 58, 59, 56, 57, 82, 83, 109, 114, 56, 57, 82, 83, 58, 59, 56, 57, 68, 69, 44, 45, 70, 71, 68, 69, 70, 8, 21, 102, 68, 69, 44, 45, 0, 71, 68, 69, 80, 81, 56, 57, 82, 83, 80, 81, 82, 20, 113, 114, 80, 81, 56, 57, 82, 83, 80, 81, 70, 71, 68, 69, 44, 45, 70, 71, 31, 32, 98, 102, 70, 71, 68, 69, 44, 45, 70, 71, 82, 83, 80, 81, 56, 57, 82, 83, 43, 100, 99, 114, 82, 83, 80, 81, 56, 57, 82, 83, 44, 45, 70, 71, 68, 69, 44, 45, 97, 98, 113, 102, 44, 45, 70, 71, 68, 69, 44, 45, 56, 57, 82, 83, 80, 81, 56, 57, 109, 113, 113, 114, 56, 57, 82, 83, 80, 81, 56, 57, 68, 69, 44, 45, 70, 71, 68, 69, 97, 113, 131, 102, 68, 69, 44, 45, 70, 71, 68, 69, 80, 81, 56, 57, 82, 83, 80, 81, 109, 132, 113, 114, 80, 81, 56, 57, 82, 83, 80, 81];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 205, 206, 0, 221, 222, 223, 0, 239, 240, 0, 233, 234, 235, 0, 73, 101, 78, 0, 0, 0, 217, 218, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 112, 0, 50, 0, 213, 214, 229, 230, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 111, 0, 62, 0, 225, 226, 0, 0, 0, 153, 154, 0, 222, 223, 0, 0, 168, 173, 174, 0, 112, 0, 50, 0, 237, 238, 219, 220, 0, 0, 0, 0, 234, 235, 0, 0, 180, 185, 186, 0, 133, 38, 138, 0, 0, 0, 231, 232, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 219, 220, 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 25, 0, 231, 232, 0, 236, 0, 197, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 49, 0, 0, 0, 145, 146, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 61, 221, 222, 223, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 233, 234, 235, 0, 0, 0, 0, 198, 0, 73, 101, 78, 0, 0, 0, 40, 41, 42, 219, 220, 0, 0, 0, 0, 0, 219, 220, 0, 73, 64, 0, 50, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 231, 232, 0, 112, 0, 0, 62, 0, 156, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 0, 51, 138, 0, 168, 173, 174, 0, 0, 0, 0, 227, 228, 0, 0, 221, 222, 223, 0, 133, 38, 138, 0, 0, 180, 185, 186, 0, 0, 221, 222, 239, 240, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 199, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [486, 0, 485, 504, 548, 596, 548, 906, 483, 1032, 486, 1279];
        barriers[1] = [790, 0, 787, 153, 728, 212, 726, 382, 788, 504, 790, 1279];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1141, 753, 1122, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1050, 753, 1031, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 966, 631, 933));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 821, 708, 788));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 643, 705, 610));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 504, 603, 471));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 222, 599, 190));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 76, 753, 57, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1216, 525, 1197, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1050, 753, 1031, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1049, 602, 1016));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 944, 753, 925, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 900, 687, 867));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 725, 704, 692));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 414, 598, 382));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 347, 693, 328, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 280, 660, 261, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 69, 525, 50, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [70, 71, 46, 47, 70, 71, 70, 71, 97, 113, 143, 102, 68, 69, 68, 69, 70, 71, 46, 47, 82, 83, 58, 59, 82, 83, 82, 83, 109, 131, 113, 114, 80, 81, 80, 81, 82, 83, 58, 59, 68, 69, 70, 71, 68, 0, 70, 71, 97, 144, 113, 102, 46, 47, 70, 71, 68, 69, 70, 71, 80, 81, 82, 83, 80, 81, 82, 83, 109, 113, 131, 114, 58, 59, 82, 83, 80, 81, 82, 83, 68, 69, 70, 71, 70, 71, 68, 69, 97, 132, 125, 126, 46, 47, 46, 47, 68, 69, 70, 71, 80, 81, 82, 83, 82, 83, 80, 81, 109, 124, 137, 83, 58, 59, 58, 59, 80, 81, 82, 83, 70, 71, 46, 47, 46, 47, 68, 69, 97, 102, 68, 69, 68, 69, 70, 71, 70, 71, 46, 47, 82, 83, 58, 59, 58, 59, 80, 81, 109, 114, 80, 81, 80, 81, 82, 83, 82, 83, 58, 59, 46, 47, 68, 69, 70, 71, 70, 71, 97, 22, 11, 47, 44, 45, 46, 47, 46, 47, 68, 69, 58, 59, 80, 81, 82, 83, 82, 83, 109, 113, 23, 59, 56, 57, 58, 59, 58, 59, 80, 81, 70, 71, 46, 47, 70, 71, 70, 71, 121, 122, 35, 36, 68, 69, 68, 69, 70, 71, 46, 47, 82, 83, 58, 59, 82, 83, 82, 83, 82, 134, 123, 48, 80, 81, 80, 81, 82, 83, 58, 59, 68, 69, 70, 71, 68, 69, 70, 71, 44, 45, 97, 102, 46, 47, 70, 71, 68, 69, 70, 71, 0, 81, 82, 83, 80, 81, 82, 83, 56, 57, 109, 114, 58, 59, 82, 83, 80, 81, 82, 83, 68, 69, 70, 71, 70, 71, 68, 69, 70, 71, 97, 102, 46, 47, 46, 47, 68, 69, 70, 71, 80, 81, 82, 83, 82, 83, 80, 81, 82, 83, 109, 114, 58, 59, 58, 59, 80, 81, 82, 83, 70, 71, 46, 47, 46, 47, 68, 69, 70, 8, 21, 84, 68, 69, 70, 71, 70, 71, 46, 47, 82, 83, 58, 59, 58, 59, 80, 81, 82, 20, 95, 96, 80, 81, 82, 83, 82, 83, 58, 59, 70, 71, 46, 47, 70, 71, 70, 71, 31, 32, 107, 71, 68, 69, 68, 69, 70, 71, 46, 47, 82, 83, 58, 59, 82, 83, 82, 83, 43, 106, 119, 83, 80, 81, 80, 81, 82, 83, 58, 59, 68, 69, 70, 71, 68, 69, 70, 71, 97, 102, 46, 47, 46, 47, 70, 71, 68, 69, 70, 71, 80, 81, 82, 83, 80, 81, 82, 83, 109, 114, 58, 59, 58, 59, 82, 83, 80, 81, 82, 83, 68, 69, 70, 71, 70, 71, 68, 69, 97, 102, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 80, 81, 82, 83, 82, 83, 80, 81, 109, 114, 82, 83, 58, 0, 58, 59, 80, 81, 82, 83, 70, 71, 46, 47, 46, 47, 68, 69, 97, 22, 11, 71, 68, 69, 70, 71, 70, 71, 46, 47, 82, 83, 58, 59, 58, 59, 80, 81, 109, 132, 23, 83, 80, 81, 82, 83, 82, 83, 58, 59, 46, 47, 68, 69, 70, 71, 70, 71, 97, 113, 35, 36, 44, 45, 46, 47, 46, 47, 68, 69, 58, 59, 80, 81, 82, 83, 82, 83, 109, 143, 113, 48, 56, 57, 58, 59, 58, 59, 80, 81, 70, 71, 46, 47, 70, 71, 70, 71, 97, 113, 132, 102, 68, 69, 68, 69, 70, 71, 46, 47, 82, 83, 58, 59, 82, 83, 82, 83, 109, 113, 113, 114, 80, 81, 80, 81, 82, 83, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 156, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 168, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 0, 180, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 219, 220, 0, 0, 185, 186, 0, 221, 222, 223, 0, 0, 0, 0, 0, 239, 240, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 233, 234, 235, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 236, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 213, 214, 0, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 0, 0, 0, 0, 0, 225, 226, 0, 0, 221, 222, 223, 0, 0, 0, 0, 168, 173, 174, 0, 0, 0, 0, 0, 0, 237, 238, 205, 206, 233, 234, 235, 0, 0, 0, 0, 180, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 229, 230, 0, 0, 0, 0, 0, 0, 0, 224, 221, 222, 223, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 236, 233, 234, 235, 0, 0, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 233, 234, 235, 0, 0, 236, 0, 221, 222, 223, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 173, 174, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 4, 5, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 129, 33, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 108, 0, 0, 0, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 140, 0, 0, 0, 25, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 139, 0, 0, 0, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 24, 0, 0, 0, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 12, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 103, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 17, 18, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 29, 30, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 41, 42, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 139, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 7, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 140, 0, 4, 5, 0, 0, 0, 0, 0, 155, 153, 154, 0, 0, 0, 0, 0, 139, 0, 0, 139, 15, 16, 17, 18, 0, 0, 0, 0, 167, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 140, 27, 28, 29, 30, 0, 0, 0, 0, 179, 0, 0, 0, 0, 0, 1, 2, 139, 0, 0, 24, 0, 40, 41, 42, 0, 0, 0, 0, 191, 0, 0, 0, 0, 0, 13, 14, 140, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 203, 0, 0, 0, 0, 0, 25, 26, 140, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 215, 0, 0, 0, 0, 0, 37, 0, 139, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 49, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [486, 0, 487, 624, 611, 783, 611, 1028, 482, 1280, 486, 1919];
        barriers[1] = [790, 0, 789, 238, 665, 368, 668, 522, 792, 768, 790, 1026, 664, 1264, 664, 1538, 791, 1788, 790, 1919];
        settings = [];
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 1719, 665, 1687));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1592, 527, 1573, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1293, 526, 1274, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1036, 647, 1017, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 753, 650, 720));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 674, 567, 641));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 550, 539, 517));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 413, 541, 380));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 176, 557, 130, 62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 94, 752, 75, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1815, 753, 1796, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1700, 696, 1681, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1402, 629, 1369));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1270, 637, 1237));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1151, 703, 1118));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1044, 752, 1011));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 632, 524, 613, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 502, 524, 483, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 233, 675, 201));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 2, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [70, 71, 68, 69, 68, 69, 44, 45, 68, 69, 46, 47, 44, 45, 97, 113, 113, 102, 46, 47, 82, 83, 80, 81, 80, 81, 56, 57, 80, 81, 58, 59, 56, 57, 109, 113, 113, 114, 58, 59, 68, 69, 46, 47, 68, 69, 70, 71, 44, 45, 70, 71, 68, 69, 97, 113, 113, 102, 70, 71, 80, 81, 58, 59, 80, 81, 82, 83, 56, 57, 82, 83, 80, 81, 109, 113, 113, 114, 82, 83, 44, 45, 46, 47, 44, 45, 68, 69, 68, 69, 68, 69, 68, 69, 97, 113, 113, 84, 68, 69, 56, 57, 58, 59, 56, 57, 80, 81, 80, 81, 80, 81, 80, 81, 109, 113, 95, 96, 80, 81, 70, 71, 44, 45, 46, 47, 46, 47, 70, 71, 68, 69, 70, 74, 86, 113, 107, 71, 68, 69, 82, 83, 56, 57, 58, 59, 58, 59, 82, 83, 80, 81, 85, 86, 113, 106, 119, 83, 80, 81, 44, 45, 68, 69, 44, 45, 46, 47, 46, 47, 70, 8, 21, 113, 113, 84, 44, 45, 46, 47, 56, 57, 80, 81, 56, 57, 58, 59, 58, 59, 82, 20, 113, 98, 95, 96, 56, 57, 58, 59, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 31, 32, 98, 98, 107, 71, 46, 47, 68, 69, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 43, 113, 98, 106, 119, 83, 58, 59, 80, 81, 68, 69, 70, 71, 68, 69, 44, 45, 70, 8, 21, 113, 113, 84, 46, 47, 68, 69, 70, 71, 80, 81, 82, 83, 80, 81, 56, 57, 82, 20, 113, 113, 95, 96, 58, 59, 80, 81, 82, 83, 44, 45, 46, 47, 44, 45, 46, 47, 31, 32, 113, 113, 107, 71, 46, 47, 68, 69, 46, 47, 56, 57, 58, 59, 56, 57, 58, 59, 43, 113, 113, 106, 119, 83, 58, 59, 80, 81, 58, 59, 68, 69, 68, 69, 44, 45, 46, 47, 97, 113, 113, 102, 44, 45, 70, 71, 68, 69, 70, 71, 80, 81, 80, 81, 56, 57, 58, 59, 109, 113, 113, 114, 56, 57, 82, 83, 80, 81, 82, 83];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 132, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 167, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 179, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 191, 192, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 203, 204, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 215, 216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 73, 64, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 99, 100, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 112, 0, 51, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 132, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 2, 0, 0, 221, 222, 223, 0, 219, 220, 0, 0, 0, 153, 154, 0, 0, 0, 0, 139, 221, 14, 0, 0, 233, 234, 235, 0, 231, 232, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 233, 26, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 227, 0, 0, 219, 220, 0, 27, 28, 29, 30, 0, 0, 0, 7, 0, 0, 0, 0, 108, 197, 239, 0, 0, 231, 232, 0, 0, 40, 41, 42, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 213, 214, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 221, 222, 223, 0, 0, 225, 226, 205, 206, 0, 0, 19, 0, 0, 0, 94, 120, 221, 222, 223, 233, 234, 235, 0, 0, 237, 238, 217, 218, 0, 7, 0, 0, 0, 0, 108, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 229, 230, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 228, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 198, 0, 0, 0, 0, 240, 0, 227, 228, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 156, 161, 162, 0, 5, 0, 239, 240, 0, 0, 0, 198, 7, 0, 0, 0, 0, 108, 0, 0, 168, 173, 174, 0, 17, 18, 0, 0, 221, 222, 223, 0, 19, 0, 0, 0, 94, 120, 0, 0, 180, 185, 186, 0, 29, 30, 0, 0, 233, 234, 235, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 41, 42, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 153, 154, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 231, 232, 0, 0, 0];
        barriers = [];
        barriers[0] = [870, 0, 870, 251, 485, 1037, 486, 1151];
        barriers[1] = [1174, 0, 1171, 259, 792, 1007, 790, 1151];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 983, 570, 964, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 901, 783, 868));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 898, 608, 879, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 773, 848, 740));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 656, 911, 623));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 533, 974, 500));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 382, 1065, 363, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 291, 1113, 272, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 209, 1026, 177));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1133, 749, 1114, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1046, 749, 1027, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 953, 656, 881, 25, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 824, 802, 792));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 657, 898, 624));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 568, 770, 549, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 537, 958, 504));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 489, 814, 470, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 429, 881, 410, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 405, 1007, 372));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 258, 1005, 225));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 202, 1096, 170, 0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1015, 677, 943, 25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 881, 827, 862, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 795, 868, 776, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 658, 722, 639, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 573, 762, 554, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 377, 903, 358, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 300, 903, 281, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 168, 1032, 136));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 70, 71, 70, 71, 68, 69, 44, 45, 70, 71, 68, 69, 97, 113, 131, 102, 46, 47, 56, 57, 82, 83, 82, 83, 80, 81, 56, 57, 82, 83, 80, 81, 109, 113, 113, 72, 58, 59, 68, 69, 46, 47, 46, 47, 70, 71, 68, 69, 46, 47, 70, 74, 87, 113, 113, 84, 44, 45, 80, 81, 58, 59, 58, 59, 82, 83, 80, 81, 58, 59, 85, 86, 113, 98, 95, 96, 56, 57, 68, 69, 44, 45, 70, 71, 68, 69, 70, 71, 147, 148, 87, 113, 99, 100, 107, 71, 68, 69, 80, 81, 56, 57, 82, 83, 80, 81, 157, 158, 159, 113, 131, 113, 113, 95, 119, 83, 80, 81, 70, 71, 68, 69, 44, 45, 70, 71, 169, 113, 143, 113, 113, 200, 201, 202, 70, 71, 68, 69, 82, 83, 80, 81, 56, 57, 82, 83, 109, 113, 113, 124, 211, 212, 82, 83, 82, 83, 80, 81, 46, 47, 70, 71, 68, 69, 46, 47, 97, 131, 113, 102, 44, 45, 46, 47, 44, 45, 68, 69, 58, 59, 82, 83, 80, 81, 58, 59, 109, 113, 113, 114, 56, 57, 58, 59, 56, 57, 80, 81];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 155, 0, 219, 220, 0, 0, 227, 228, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 219, 167, 0, 231, 232, 0, 0, 239, 240, 221, 222, 223, 0, 0, 0, 73, 101, 78, 0, 0, 231, 179, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 73, 64, 0, 50, 0, 0, 0, 191, 192, 0, 4, 5, 0, 0, 197, 0, 0, 0, 0, 0, 112, 0, 0, 62, 0, 0, 221, 203, 204, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 133, 38, 39, 138, 0, 0, 233, 215, 216, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 156, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 180, 232, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 129, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 172, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 172, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 172, 0, 0, 0, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 199, 187, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 199, 187, 188, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [1174, 0, 1171, 152, 1140, 176, 1032, 393, 792, 515, 790, 639];
        barriers[1] = [870, 0, 870, 152, 785, 221, 484, 377, 486, 639];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 503, 531, 484, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 424, 531, 405, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 381, 600, 362, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 361, 861, 329));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 210, 1097, 191, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 133, 1133, 114, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 547, 574, 483, 0, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 496, 776, 477, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 457, 858, 438, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 255, 966, 223));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 90, 1086, 71, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 90, 1135, 71, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 572, 527, 553, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 492, 800, 435, -25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 417, 524, 398, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 336, 956, 304));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 230, 915, 184, -45));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 87, 1135, 68, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 1, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [46, 47, 97, 131, 113, 102, 70, 71, 44, 45, 46, 47, 70, 71, 68, 69, 68, 69, 44, 45, 58, 59, 109, 113, 113, 114, 82, 83, 56, 57, 58, 59, 82, 83, 80, 81, 80, 81, 56, 57, 44, 45, 97, 113, 113, 102, 46, 47, 68, 69, 70, 71, 68, 69, 46, 47, 68, 69, 70, 71, 99, 98, 100, 99, 113, 114, 58, 59, 80, 81, 82, 83, 80, 81, 58, 59, 80, 81, 82, 83, 98, 100, 99, 98, 113, 22, 11, 71, 68, 69, 68, 69, 44, 45, 46, 47, 44, 45, 68, 69, 80, 81, 98, 100, 113, 131, 23, 83, 80, 81, 80, 81, 56, 57, 58, 59, 56, 57, 80, 81, 44, 45, 70, 104, 113, 113, 22, 36, 46, 47, 68, 69, 70, 71, 44, 45, 46, 47, 46, 47, 56, 57, 82, 116, 105, 132, 113, 48, 58, 59, 80, 81, 82, 83, 56, 57, 58, 59, 58, 59, 46, 47, 68, 69, 79, 113, 113, 22, 11, 71, 68, 69, 44, 45, 68, 69, 44, 45, 46, 47, 58, 59, 80, 81, 91, 92, 113, 143, 23, 83, 80, 81, 56, 57, 80, 81, 56, 57, 58, 59, 68, 69, 44, 45, 70, 104, 113, 113, 35, 36, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 80, 81, 56, 57, 82, 116, 105, 113, 113, 48, 56, 57, 58, 59, 58, 59, 80, 81, 82, 83, 70, 71, 46, 47, 68, 69, 79, 131, 113, 22, 11, 71, 68, 69, 70, 71, 68, 69, 44, 45, 82, 83, 58, 59, 80, 81, 91, 92, 113, 113, 23, 83, 80, 81, 82, 83, 80, 81, 56, 57, 68, 69, 68, 69, 44, 45, 70, 104, 113, 113, 35, 100, 46, 47, 46, 47, 44, 45, 46, 47, 80, 81, 80, 81, 56, 57, 82, 116, 105, 113, 98, 99, 98, 59, 58, 59, 56, 57, 58, 59, 44, 45, 70, 71, 68, 69, 44, 45, 97, 113, 100, 98, 100, 71, 68, 69, 44, 45, 46, 47, 56, 57, 82, 83, 80, 81, 56, 57, 109, 113, 113, 114, 82, 83, 80, 81, 56, 57, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 197, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 227, 228, 0, 0, 0, 0, 0, 110, 101, 110, 101, 78, 0, 0, 0, 0, 0, 231, 232, 0, 239, 240, 221, 222, 223, 0, 0, 0, 0, 0, 0, 62, 0, 0, 221, 222, 223, 0, 197, 0, 0, 0, 233, 234, 235, 0, 156, 0, 0, 0, 0, 50, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 39, 52, 0, 0, 62, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 219, 220, 0, 0, 180, 219, 133, 38, 39, 138, 0, 0, 0, 227, 228, 0, 13, 14, 0, 0, 231, 232, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 239, 240, 0, 25, 26, 4, 5, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 15, 16, 17, 18, 0, 0, 0, 0, 161, 162, 198, 0, 0, 0, 0, 0, 0, 0, 0, 49, 27, 28, 29, 30, 0, 0, 0, 0, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 198, 40, 41, 42, 221, 222, 223, 0, 185, 186, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 231, 232, 115, 93, 0, 0, 0, 0, 153, 154, 156, 161, 162, 0, 0, 0, 0, 214, 0, 0, 0, 0, 0, 103, 0, 0, 0, 73, 101, 78, 168, 173, 174, 0, 0, 4, 5, 226, 0, 0, 221, 222, 223, 115, 93, 0, 73, 64, 0, 63, 78, 185, 186, 0, 15, 16, 17, 238, 205, 206, 233, 234, 235, 0, 103, 0, 112, 0, 0, 0, 62, 0, 0, 0, 27, 28, 29, 0, 217, 218, 0, 0, 0, 0, 140, 0, 111, 0, 0, 139, 50, 221, 222, 223, 0, 40, 41, 0, 229, 230, 0, 0, 0, 153, 154, 0, 133, 39, 38, 39, 138, 233, 234, 235, 0, 0, 0];
        map[2] = [0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [406, 0, 404, 247, 791, 1026, 790, 1151];
        barriers[1] = [102, 0, 101, 247, 484, 1001, 486, 1151];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1046, 744, 1027, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 998, 621, 965));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 872, 551, 839));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 745, 486, 712));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 548, 499, 529, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 530, 288, 511, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 415, 322, 383));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 247, 143, 228, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1042, 744, 1023, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 889, 631, 856));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 857, 462, 785, -25, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 751, 557, 718));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 607, 490, 574));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 542, 291, 523, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 486, 266, 467, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 462, 463, 443, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 409, 434, 390, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 257, 146, 238, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 207, 258, 175));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1048, 753, 1029, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 826, 609, 793));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 684, 542, 651));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 559, 305, 540, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 534, 467, 501));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 461, 255, 442, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 232, 257, 200));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 88, 143, 69, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1048, 753, 1029, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 940, 568, 868, -25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 673, 355, 654, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 607, 324, 588, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 409, 434, 390, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 347, 402, 328, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 260, 143, 241, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 154, 261, 122));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 3));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1048, 753, 1029, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 859, 591, 787, -25, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 850, 501, 817));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 673, 452, 640));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 545, 296, 473, -25, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 487, 391, 454));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 260, 143, 241, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 169, 258, 137));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 895, 470, 876, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 869, 512, 850, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 617, 436, 585));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 373, 356, 354, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 347, 402, 328, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 95, 355, 76, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 95, 142, 76, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 890, 484, 844, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 836, 587, 803));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 711, 474, 678));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 585, 359, 552));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 475, 392, 403, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 428, 281, 395));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 169, 258, 137));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 1, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [68, 69, 97, 113, 131, 102, 44, 45, 70, 71, 68, 69, 44, 45, 70, 71, 70, 71, 68, 69, 80, 81, 109, 113, 113, 114, 56, 57, 82, 83, 80, 81, 56, 57, 82, 83, 82, 83, 80, 81, 70, 71, 79, 113, 113, 88, 77, 71, 46, 47, 70, 71, 68, 69, 46, 47, 46, 47, 70, 71, 82, 83, 91, 92, 100, 113, 89, 90, 58, 59, 82, 83, 80, 81, 58, 59, 58, 59, 82, 83, 46, 47, 70, 104, 99, 98, 113, 88, 151, 152, 70, 71, 68, 69, 44, 45, 70, 71, 68, 69, 58, 59, 82, 116, 105, 113, 113, 113, 113, 164, 165, 166, 80, 81, 56, 57, 82, 83, 80, 81, 70, 71, 68, 69, 193, 194, 195, 131, 113, 113, 113, 178, 70, 71, 68, 69, 44, 45, 70, 71, 82, 83, 80, 81, 82, 83, 207, 208, 123, 132, 113, 114, 82, 83, 80, 81, 56, 57, 82, 83, 44, 45, 46, 47, 44, 45, 68, 69, 97, 113, 143, 102, 46, 47, 70, 71, 68, 69, 46, 47, 56, 57, 58, 59, 56, 57, 80, 81, 109, 113, 113, 114, 58, 59, 82, 83, 80, 81, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 198, 0, 156, 161, 162, 0, 224, 0, 4, 5, 0, 0, 153, 235, 0, 0, 73, 110, 78, 0, 0, 0, 168, 173, 174, 0, 236, 15, 16, 17, 18, 0, 0, 0, 0, 0, 111, 0, 63, 78, 0, 0, 180, 185, 186, 0, 0, 27, 28, 29, 30, 0, 0, 227, 228, 0, 112, 0, 0, 62, 0, 0, 0, 0, 0, 153, 154, 0, 40, 41, 42, 0, 0, 239, 240, 0, 133, 38, 39, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 233, 234, 235, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0];
        map[2] = [0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 183, 93, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 184, 196, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 196, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [102, 0, 100, 108, 242, 397, 484, 526, 486, 639];
        barriers[1] = [406, 0, 408, 136, 481, 217, 788, 375, 790, 639];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 511, 753, 492, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 430, 753, 411, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 352, 419, 320));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 227, 192, 208, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 153, 154, 134, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 462, 696, 405, 25));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 352, 419, 320));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 227, 192, 208, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 153, 154, 134, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 469, 715, 437, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 414, 500, 382));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 262, 405, 243, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 262, 469, 243, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 201, 405, 182, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 116, 147, 97, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 10));
        blocks.push(new GameMap.MapBlock(blockId++, 1, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [68, 69, 97, 113, 113, 102, 44, 45, 70, 71, 68, 69, 44, 45, 97, 113, 132, 102, 68, 69, 80, 81, 109, 113, 113, 114, 56, 57, 82, 83, 80, 81, 56, 57, 109, 113, 113, 114, 80, 81, 70, 71, 79, 143, 113, 88, 77, 71, 46, 47, 70, 71, 147, 148, 87, 131, 125, 126, 70, 71, 82, 83, 91, 92, 113, 132, 89, 90, 58, 59, 157, 158, 159, 132, 113, 189, 137, 59, 82, 83, 46, 47, 70, 104, 113, 113, 113, 88, 151, 148, 170, 113, 113, 200, 201, 202, 70, 71, 68, 69, 58, 59, 82, 116, 105, 113, 131, 113, 113, 113, 98, 100, 211, 212, 82, 83, 82, 83, 80, 81, 70, 71, 68, 69, 193, 194, 195, 113, 132, 113, 99, 102, 70, 71, 68, 69, 44, 45, 70, 71, 82, 83, 80, 81, 82, 83, 207, 208, 123, 113, 100, 114, 82, 83, 80, 81, 56, 57, 82, 83, 44, 45, 46, 47, 44, 45, 68, 69, 97, 113, 113, 102, 46, 47, 70, 71, 68, 69, 46, 47, 56, 57, 58, 59, 56, 57, 80, 81, 109, 113, 113, 114, 58, 59, 82, 83, 80, 81, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 232, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 110, 78, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 0, 0, 50, 0, 0, 0, 153, 154, 0, 25, 221, 222, 223, 0, 0, 0, 0, 0, 0, 112, 0, 51, 138, 0, 4, 5, 0, 0, 0, 37, 233, 234, 235, 0, 0, 0, 0, 0, 0, 111, 0, 62, 0, 15, 16, 17, 18, 0, 0, 49, 0, 0, 0, 0, 153, 154, 0, 0, 0, 133, 38, 138, 0, 27, 28, 29, 30, 198, 0, 61, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0];
        map[2] = [0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 115, 93, 0, 0, 0, 183, 93, 0, 0, 0, 171, 172, 160, 0, 0, 0, 129, 33, 0, 0, 0, 103, 0, 0, 0, 0, 175, 176, 171, 172, 0, 0, 0, 0, 0, 129, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 163, 160, 0, 0, 0, 0, 199, 187, 160, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 0, 199, 187, 188, 0, 0, 0, 0, 0, 0, 0, 0, 115, 184, 196, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 196, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [102, 0, 98, 111, 243, 404, 485, 526, 486, 639];
        barriers[1] = [1174, 0, 1175, 105, 1037, 237, 1017, 276, 789, 387, 790, 639];
        barriers[2] = [406, 0, 407, 139, 499, 234, 584, 264, 868, 117, 870, 0];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 500, 501, 481, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 499, 642, 467));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 420, 763, 401, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 400, 492, 367));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 393, 277, 374, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 317, 365, 284));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 314, 612, 295, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 184, 1083, 116, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 176, 282, 143));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 146, 155, 127, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 491, 632, 459));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 435, 351, 378, 25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 399, 761, 380, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 321, 775, 288));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 270, 469, 251, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 250, 914, 217));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 203, 404, 184, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 131, 1023, 98));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 118, 918, 99, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 118, 1127, 99, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 3, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 46, 47, 44, 45, 70, 71, 68, 69, 46, 47, 68, 69, 97, 113, 132, 102, 68, 69, 56, 57, 58, 59, 56, 57, 82, 83, 80, 81, 58, 59, 80, 81, 109, 113, 113, 114, 80, 81, 0, 69, 44, 45, 70, 71, 68, 69, 46, 47, 68, 69, 70, 74, 87, 113, 113, 84, 70, 71, 80, 81, 56, 57, 82, 83, 80, 81, 58, 59, 80, 81, 85, 86, 113, 131, 95, 96, 82, 83, 70, 71, 44, 45, 70, 71, 147, 148, 149, 76, 75, 76, 87, 143, 113, 113, 107, 71, 68, 69, 82, 83, 56, 57, 157, 158, 159, 100, 98, 113, 113, 113, 113, 113, 143, 95, 119, 83, 80, 81, 68, 69, 70, 74, 159, 113, 98, 99, 113, 113, 113, 131, 113, 200, 201, 202, 44, 45, 70, 71, 80, 81, 85, 86, 113, 113, 113, 124, 135, 136, 135, 136, 211, 212, 82, 83, 56, 57, 82, 83, 70, 71, 97, 113, 131, 113, 125, 126, 44, 45, 46, 47, 44, 45, 70, 71, 68, 69, 46, 47, 82, 83, 109, 113, 113, 124, 137, 83, 56, 57, 58, 59, 56, 57, 82, 83, 80, 81, 58, 59, 46, 47, 97, 113, 113, 102, 44, 45, 46, 47, 44, 45, 70, 71, 68, 69, 46, 47, 68, 69, 58, 59, 109, 113, 132, 114, 56, 57, 58, 59, 56, 57, 82, 83, 80, 81, 58, 59, 80, 81];
        map[1] = [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 17, 18, 198, 0, 153, 154, 0, 219, 220, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 221, 29, 30, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 41, 42, 221, 222, 223, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 73, 101, 101, 78, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 220, 0, 0, 0, 0, 73, 64, 0, 50, 62, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 232, 0, 0, 0, 0, 111, 0, 0, 51, 138, 0, 0, 0, 0, 0, 0, 0, 0, 180, 185, 0, 0, 0, 0, 0, 133, 38, 39, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 231, 232, 0, 221, 222, 235, 0, 0, 0, 0, 0, 0, 239, 240, 0, 197, 0, 153, 154, 198, 0, 0, 0, 233, 234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 120, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 171, 142, 141, 142, 141, 188, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 171, 172, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 199, 172, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 94, 188, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 187, 188, 0, 0, 0, 0, 94, 188, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 187, 188, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 130, 141, 142, 141, 142, 160, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [1174, 0, 1170, 133, 1031, 398, 732, 543, 490, 535, 400, 621, 406, 767];
        barriers[1] = [870, 0, 869, 139, 778, 230, 516, 229, 235, 375, 101, 528, 102, 767];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 607, 381, 588, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 544, 446, 525, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 532, 282, 500));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 426, 682, 393));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 384, 833, 351));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 299, 960, 266));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 260, 825, 241, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 201, 886, 182, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 167, 1030, 134));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 634, 151, 615, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 602, 263, 569));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 602, 411, 534, -45));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 544, 151, 525, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 480, 342, 447));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 411, 471, 378));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 403, 635, 370));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 351, 1009, 279, 25, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 285, 715, 266, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 285, 617, 266, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 250, 928, 218));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 73, 906, 54, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 73, 1139, 54, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 609, 372, 541, 45));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 525, 176, 506, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 469, 234, 450, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 424, 726, 391));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 385, 1004, 366, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 371, 853, 338));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 287, 651, 268, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 287, 727, 268, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 273, 962, 240));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 123, 1023, 91));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 2, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 46, 47, 44, 45, 46, 47, 97, 113, 132, 102, 68, 69, 44, 45, 46, 47, 68, 69, 56, 57, 58, 59, 56, 57, 58, 59, 109, 113, 113, 114, 80, 81, 56, 57, 58, 59, 80, 81, 68, 69, 44, 45, 46, 0, 70, 8, 21, 113, 125, 126, 68, 69, 70, 71, 44, 45, 46, 47, 80, 81, 56, 57, 58, 59, 82, 20, 144, 124, 137, 83, 80, 81, 82, 83, 56, 57, 58, 59, 70, 71, 68, 69, 70, 71, 31, 32, 113, 84, 46, 47, 44, 45, 46, 47, 68, 69, 70, 71, 82, 83, 80, 81, 82, 83, 43, 113, 95, 96, 58, 59, 56, 57, 58, 59, 80, 81, 82, 83, 44, 45, 46, 47, 70, 8, 21, 113, 107, 71, 68, 69, 70, 71, 46, 47, 44, 45, 46, 47, 56, 57, 58, 59, 82, 20, 113, 106, 119, 83, 80, 81, 82, 83, 58, 59, 56, 57, 58, 59, 68, 69, 70, 71, 31, 32, 113, 102, 44, 45, 70, 71, 46, 47, 68, 69, 68, 69, 70, 71, 80, 81, 82, 83, 43, 113, 99, 72, 56, 57, 82, 83, 58, 59, 80, 81, 80, 81, 82, 83, 46, 47, 70, 8, 21, 98, 98, 84, 70, 71, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 58, 59, 82, 20, 113, 98, 98, 96, 82, 83, 58, 59, 56, 57, 58, 59, 82, 83, 80, 81, 70, 71, 31, 32, 113, 98, 107, 71, 68, 69, 70, 71, 70, 71, 46, 47, 46, 47, 68, 69, 82, 83, 43, 113, 113, 106, 119, 83, 80, 81, 82, 83, 82, 83, 58, 59, 58, 59, 80, 81, 44, 45, 97, 144, 132, 102, 44, 45, 68, 69, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 56, 57, 109, 113, 113, 114, 56, 57, 80, 81, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83];
        map[1] = [223, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 235, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 224, 15, 16, 0, 219, 220, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 236, 27, 28, 0, 231, 232, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 156, 161, 162, 0, 221, 222, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 233, 234, 154, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 73, 101, 78, 0, 0, 0, 13, 14, 0, 0, 0, 0, 153, 154, 0, 161, 162, 0, 0, 73, 64, 101, 50, 0, 0, 0, 25, 26, 227, 228, 0, 0, 0, 0, 0, 173, 174, 0, 0, 111, 0, 100, 62, 0, 224, 0, 37, 0, 239, 240, 213, 214, 0, 221, 222, 185, 186, 0, 0, 112, 99, 0, 50, 0, 236, 0, 49, 0, 197, 0, 225, 226, 0, 233, 234, 0, 0, 0, 0, 111, 0, 51, 138, 0, 0, 0, 61, 0, 0, 0, 237, 238, 205, 206, 0, 0, 0, 0, 0, 133, 38, 138, 0, 221, 222, 223, 0, 219, 220, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 231, 232, 0, 0, 0, 229, 230, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [486, 0, 485, 133, 98, 911, 102, 1023];
        barriers[1] = [790, 0, 789, 121, 403, 891, 406, 1023];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 880, 230, 808, 25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 781, 430, 762, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 647, 321, 614));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 528, 379, 495));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 416, 434, 383));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 298, 454, 279, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 208, 499, 189, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 129, 694, 97));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 839, 353, 806));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 767, 224, 748, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 728, 417, 695));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 613, 299, 594, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 593, 446, 560));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 451, 470, 418));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 273, 557, 241));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 135, 709, 103, 0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 921, 214, 849, -62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 900, 317, 867));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 784, 377, 751));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 671, 452, 625, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 646, 363, 613));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 529, 497, 510, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 521, 421, 488));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 269, 629, 250, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 205, 502, 186, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 137, 629, 105));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 118, 753, 99, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 883, 236, 811, 25, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 705, 431, 673));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 529, 497, 510, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 444, 543, 425, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 348, 589, 329, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 237, 484, 218, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 153, 529, 134, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 46, 47, 70, 71, 44, 45, 97, 131, 113, 102, 44, 45, 46, 47, 68, 69, 70, 71, 56, 57, 58, 59, 82, 83, 56, 57, 109, 113, 113, 114, 56, 57, 58, 59, 80, 81, 82, 83, 68, 69, 70, 71, 46, 47, 70, 71, 97, 113, 113, 102, 68, 69, 70, 71, 70, 71, 68, 69, 80, 81, 82, 83, 58, 59, 82, 83, 109, 113, 113, 114, 80, 81, 82, 83, 82, 83, 80, 81, 70, 71, 44, 45, 44, 45, 46, 47, 79, 113, 131, 88, 75, 76, 75, 10, 11, 71, 44, 45, 82, 83, 56, 57, 56, 57, 58, 59, 91, 92, 113, 113, 113, 113, 98, 98, 23, 83, 56, 57, 44, 45, 46, 47, 68, 69, 70, 71, 70, 104, 113, 143, 113, 113, 98, 113, 35, 36, 68, 69, 56, 57, 58, 59, 80, 81, 82, 83, 82, 116, 117, 136, 135, 136, 123, 113, 113, 48, 80, 81, 68, 69, 70, 71, 46, 47, 44, 0, 68, 69, 70, 71, 44, 45, 97, 113, 131, 102, 70, 71, 80, 81, 82, 83, 58, 59, 56, 57, 80, 81, 82, 83, 56, 57, 109, 113, 113, 72, 82, 83, 46, 47, 44, 45, 68, 69, 70, 71, 147, 148, 149, 76, 75, 76, 87, 113, 113, 84, 68, 69, 58, 59, 56, 57, 80, 81, 157, 158, 159, 113, 113, 98, 98, 113, 113, 143, 95, 96, 80, 81, 68, 69, 70, 71, 147, 148, 170, 132, 113, 113, 98, 98, 98, 113, 113, 113, 107, 71, 44, 45, 80, 81, 157, 158, 159, 113, 113, 113, 113, 189, 135, 136, 135, 136, 135, 118, 119, 83, 56, 57, 70, 71, 169, 113, 113, 143, 113, 200, 201, 202, 44, 45, 46, 47, 68, 69, 70, 71, 68, 69, 82, 83, 109, 113, 113, 124, 211, 212, 82, 83, 56, 57, 58, 59, 80, 81, 82, 83, 80, 81, 68, 69, 97, 131, 113, 102, 68, 69, 70, 71, 68, 69, 70, 71, 44, 45, 68, 69, 70, 71, 80, 81, 109, 113, 113, 114, 80, 81, 82, 83, 80, 81, 82, 83, 56, 57, 80, 81, 82, 83];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 110, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 99, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 112, 0, 51, 138, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 73, 110, 101, 78, 0, 0, 0, 0, 0, 0, 173, 174, 0, 0, 0, 171, 0, 160, 0, 73, 64, 100, 99, 50, 0, 0, 0, 0, 0, 155, 185, 186, 0, 0, 0, 0, 0, 0, 0, 111, 0, 99, 0, 62, 0, 0, 0, 0, 0, 167, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 39, 38, 39, 138, 0, 0, 0, 0, 0, 179, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 191, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 203, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 215, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 197, 0, 153, 154, 0, 0, 0, 0, 140, 0, 219, 220, 0, 227, 228, 0, 0, 13, 14, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 231, 232, 0, 239, 240, 0, 0, 25, 26, 0, 221, 222, 223, 140, 0, 0, 0, 0, 115, 141, 142, 141, 93, 0, 221, 222, 0, 37, 0, 0, 233, 234, 235, 115, 93, 0, 0, 0, 0, 0, 0, 0, 24, 0, 233, 234, 0, 49, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 34, 12, 0, 0, 0, 61, 0, 227, 228, 0, 0, 0, 115, 93, 0, 0, 0, 0, 0, 0, 0, 24, 0, 219, 0, 0, 0, 239, 240, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 0, 12, 231, 0, 0, 197, 0, 0, 0, 0, 0, 0, 139, 0, 140, 141, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 120, 0, 115, 141, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 221, 222, 223, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 0, 233, 234, 235, 172, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 171, 172, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 108, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 199, 187, 141, 142, 141, 141, 142, 141, 33, 0, 0, 0, 154, 140, 0, 0, 0, 0, 199, 187, 188, 0, 0, 221, 222, 223, 198, 0, 153, 154, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 219, 220, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [486, 0, 485, 249, 614, 496, 598, 640, 98, 886, 102, 1151];
        barriers[1] = [790, 0, 791, 169, 817, 221, 920, 233, 1030, 233, 1173, 509, 1168, 666, 1010, 926, 647, 916, 408, 1028, 406, 1151];
        barriers[2] = [737, 514, 819, 536, 869, 530, 865, 625, 736, 593, 733, 524];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 983, 456, 924, 62, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 929, 149, 910, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 888, 737, 869, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 844, 1013, 772, 25, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 799, 386, 780, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 740, 631, 707));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 601, 676, 568));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 507, 1128, 488, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 469, 693, 436));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 398, 610, 326, 62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 371, 1056, 352, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 333, 709, 300));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 150, 756, 131, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 139, 647, 107));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 947, 509, 928, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 929, 146, 910, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 913, 386, 881));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 901, 600, 882, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 849, 1020, 777, -62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 791, 833, 758));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 741, 503, 722, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 722, 962, 689));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 597, 1016, 564));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 507, 1128, 488, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 447, 971, 414));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 407, 623, 335, -25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 288, 998, 269, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 150, 756, 131, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 2, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 46, 47, 70, 71, 44, 45, 97, 143, 113, 102, 44, 45, 46, 47, 68, 69, 70, 71, 56, 57, 58, 59, 82, 83, 56, 57, 109, 113, 113, 114, 56, 57, 58, 59, 80, 81, 82, 83, 68, 69, 70, 71, 46, 47, 70, 71, 79, 113, 113, 22, 11, 45, 46, 0, 70, 71, 44, 45, 80, 81, 82, 83, 58, 59, 82, 83, 91, 92, 131, 113, 23, 57, 58, 59, 82, 83, 56, 57, 70, 71, 44, 45, 44, 45, 46, 47, 70, 104, 113, 113, 35, 36, 70, 71, 46, 47, 70, 71, 82, 83, 56, 57, 56, 57, 58, 59, 82, 116, 105, 113, 98, 48, 82, 83, 58, 59, 82, 83, 44, 45, 70, 71, 68, 69, 70, 71, 44, 45, 97, 113, 100, 98, 44, 45, 44, 45, 46, 47, 56, 57, 82, 83, 80, 81, 82, 83, 56, 57, 109, 113, 98, 99, 56, 57, 56, 57, 58, 59, 70, 71, 46, 47, 44, 45, 70, 71, 147, 148, 87, 113, 125, 126, 46, 47, 68, 69, 70, 71, 82, 83, 58, 59, 56, 57, 157, 158, 159, 113, 131, 189, 137, 57, 58, 59, 80, 81, 82, 83, 44, 45, 46, 47, 70, 74, 170, 143, 113, 200, 201, 202, 44, 45, 46, 47, 70, 71, 44, 45, 56, 57, 58, 59, 85, 86, 113, 124, 211, 212, 82, 83, 56, 57, 58, 59, 82, 83, 56, 57, 70, 71, 70, 74, 87, 131, 125, 126, 44, 45, 46, 47, 70, 71, 44, 45, 46, 47, 70, 71, 82, 83, 85, 86, 113, 124, 137, 83, 56, 57, 58, 59, 82, 83, 56, 57, 58, 59, 82, 83, 46, 47, 97, 113, 143, 102, 46, 47, 68, 69, 0, 71, 46, 47, 70, 71, 44, 45, 46, 47, 58, 59, 109, 113, 113, 114, 58, 59, 80, 81, 82, 83, 58, 59, 82, 83, 56, 57, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 221, 222, 223, 0, 155, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 233, 234, 235, 0, 167, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 179, 0, 0, 0, 0, 231, 232, 0, 0, 0, 73, 101, 78, 0, 0, 1, 2, 0, 0, 0, 191, 192, 0, 227, 228, 0, 0, 0, 0, 0, 111, 0, 63, 78, 0, 13, 14, 0, 0, 0, 203, 204, 0, 239, 240, 221, 222, 223, 0, 0, 112, 0, 0, 50, 0, 25, 26, 0, 0, 0, 215, 216, 0, 0, 0, 233, 234, 235, 0, 0, 111, 0, 0, 62, 0, 37, 0, 219, 220, 0, 0, 0, 224, 0, 197, 0, 0, 0, 0, 0, 133, 38, 39, 138, 0, 49, 0, 231, 232, 0, 0, 0, 236, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 156, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 213, 214, 0, 168, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 225, 226, 0, 180, 185, 186, 0, 0, 0, 0, 0, 0, 4, 5, 0, 198, 0, 0, 0, 0, 237, 238, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 198, 0, 227, 228, 0, 0, 221, 222, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 239, 240, 0, 197, 233, 234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 160, 0, 0, 0, 130, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 172, 0, 0, 0, 0, 129, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 130, 0, 0, 0, 0, 171, 172, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 129, 0, 0, 0, 171, 172, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 130, 0, 0, 0, 129, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 129, 0, 0, 0, 108, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [790, 0, 791, 137, 921, 383, 917, 501, 757, 646, 516, 761, 408, 882, 406, 1023];
        barriers[1] = [486, 0, 486, 123, 617, 371, 610, 493, 563, 558, 389, 637, 99, 912, 102, 1023];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 946, 141, 927, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 866, 416, 798, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 732, 460, 699));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 710, 597, 677));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 648, 714, 615));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 509, 884, 490, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 456, 799, 424));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 401, 660, 382, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 306, 768, 234, 62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 90, 527, 71, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 946, 141, 927, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 857, 417, 789, 45, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 631, 718, 598));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 542, 816, 509));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 508, 657, 489, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 418, 657, 399, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 407, 839, 374));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 322, 737, 289));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 260, 809, 241, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 191, 772, 172, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 105, 703, 73));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 90, 527, 71, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 2, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 97, 131, 113, 102, 44, 45, 46, 47, 46, 47, 46, 47, 70, 71, 68, 69, 70, 71, 56, 57, 109, 113, 113, 114, 56, 57, 58, 59, 58, 59, 58, 59, 82, 83, 80, 81, 82, 83, 46, 47, 97, 144, 113, 102, 68, 69, 70, 0, 46, 47, 68, 69, 68, 69, 70, 71, 46, 47, 58, 59, 109, 113, 113, 0, 0, 81, 82, 83, 58, 59, 80, 81, 80, 81, 82, 83, 58, 59, 70, 71, 109, 113, 0, 0, 0, 0, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 70, 71, 82, 83, 109, 113, 113, 0, 0, 0, 58, 59, 56, 57, 58, 59, 82, 83, 80, 81, 82, 83, 44, 45, 97, 144, 113, 0, 44, 45, 68, 69, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 56, 57, 109, 113, 113, 114, 56, 57, 80, 81, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 68, 69, 97, 113, 131, 102, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 46, 47, 80, 81, 109, 113, 113, 114, 56, 57, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 110, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 64, 98, 99, 63, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 112, 98, 99, 100, 98, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 52, 100, 98, 100, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 98, 51, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 140, 0, 0, 0, 0, 140, 0, 4, 5, 6, 0, 0, 0, 224, 0, 0, 0, 0, 0, 2, 139, 0, 0, 0, 0, 139, 15, 16, 17, 18, 221, 222, 223, 236, 0, 0, 213, 214, 0, 14, 139, 0, 0, 0, 0, 140, 27, 28, 29, 30, 233, 234, 235, 0, 197, 0, 225, 226, 0, 26, 140, 0, 0, 0, 0, 139, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 237, 238, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 227, 228, 0, 198, 153, 154, 0, 0, 221, 222, 153, 154, 0, 0, 0, 0, 139, 0, 0, 198, 239, 240, 0, 0, 0, 0, 0, 0, 233, 234, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 197, 0, 0, 156, 161, 162, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 221, 222, 223, 0, 0, 0, 0, 168, 173, 174, 0, 0, 223, 140, 0, 0, 0, 0, 153, 154, 233, 234, 235, 0, 219, 220, 0, 180, 185, 186, 145, 146, 235, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [406, 0, 406, 639];
        barriers[1] = [102, 0, 102, 639];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 562, 363, 543, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 467, 303, 434));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 349, 260, 316));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 217, 219, 184));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 85, 366, 66, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 557, 148, 538, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 334, 258, 302));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 99, 145, 80, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 516, 256, 452, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 182, 259, 150));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 443, 192, 379, 0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 521, 157, 502, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 521, 360, 502, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 309, 303, 277));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 124, 363, 105, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 124, 155, 105, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 3));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 592, 147, 573, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 489, 314, 425, 0, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 489, 217, 425, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 111, 273, 79));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 523, 349, 504, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 467, 301, 448, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 286, 269, 254));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 161, 151, 142, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 110, 199, 91, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 552, 219, 488, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 302, 314, 270));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 155, 350, 136, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 95, 302, 76, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 520, 210, 488, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 284, 247, 252));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 129, 322, 97, 0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 97, 113, 113, 102, 44, 45, 46, 47, 46, 47, 46, 47, 70, 71, 68, 69, 70, 71, 56, 57, 109, 113, 113, 114, 56, 57, 58, 59, 58, 59, 58, 59, 82, 83, 80, 81, 82, 83, 46, 47, 97, 113, 143, 102, 68, 69, 70, 71, 46, 47, 68, 69, 68, 69, 70, 71, 46, 47, 58, 59, 109, 113, 113, 114, 80, 81, 82, 83, 58, 59, 80, 81, 80, 81, 82, 83, 58, 59, 70, 71, 121, 122, 131, 102, 70, 71, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 70, 71, 82, 83, 82, 134, 123, 114, 82, 83, 58, 59, 56, 57, 58, 59, 82, 83, 80, 81, 82, 83, 44, 45, 46, 47, 97, 102, 44, 45, 68, 69, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 56, 57, 58, 59, 109, 114, 56, 57, 80, 81, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 68, 69, 70, 71, 97, 0, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 46, 47, 80, 81, 82, 83, 109, 0, 0, 0, 58, 59, 58, 0, 80, 81, 82, 83, 82, 83, 58, 59, 44, 45, 70, 8, 21, 0, 0, 0, 46, 47, 46, 47, 46, 47, 70, 71, 68, 69, 70, 71, 56, 57, 82, 20, 113, 0, 0, 57, 58, 59, 58, 59, 58, 59, 82, 83, 80, 81, 82, 83, 46, 47, 31, 32, 113, 0, 68, 69, 70, 71, 46, 47, 68, 69, 68, 69, 70, 71, 46, 47, 58, 59, 43, 113, 0, 0, 80, 81, 82, 83, 58, 59, 80, 81, 80, 81, 82, 83, 58, 59, 70, 71, 97, 113, 113, 102, 70, 71, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 70, 71, 82, 83, 109, 113, 113, 114, 82, 83, 58, 59, 56, 57, 58, 59, 82, 83, 80, 81, 82, 83, 44, 45, 97, 143, 113, 102, 44, 45, 68, 69, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 56, 57, 109, 113, 113, 114, 56, 57, 80, 81, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 68, 69, 97, 113, 131, 102, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 46, 47, 80, 81, 109, 113, 113, 114, 56, 57, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 167, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 179, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 191, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 203, 204, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 215, 216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 110, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 111, 100, 63, 110, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 112, 98, 99, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 111, 99, 100, 98, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 100, 98, 51, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 73, 64, 98, 51, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 0, 0, 0, 112, 98, 99, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 0, 0, 0, 133, 38, 39, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [153, 154, 0, 0, 0, 0, 139, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 228, 139, 0, 0, 0, 0, 140, 0, 0, 0, 221, 222, 223, 0, 227, 228, 0, 0, 233, 234, 240, 139, 0, 0, 0, 0, 140, 0, 0, 0, 233, 234, 235, 0, 239, 240, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 163, 103, 0, 0, 0, 140, 0, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 103, 0, 0, 139, 0, 0, 0, 231, 232, 224, 0, 156, 161, 162, 0, 0, 233, 234, 235, 198, 139, 0, 0, 140, 0, 0, 0, 0, 0, 236, 0, 168, 173, 174, 0, 0, 0, 0, 0, 0, 139, 0, 0, 34, 103, 0, 0, 4, 5, 6, 0, 180, 185, 186, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 115, 176, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 219, 0, 0, 0, 140, 0, 0, 0, 0, 139, 27, 28, 29, 30, 0, 221, 222, 223, 0, 0, 231, 0, 0, 0, 19, 0, 0, 0, 0, 140, 0, 40, 41, 42, 0, 233, 234, 235, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 0, 139, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 145, 146, 19, 0, 0, 0, 171, 187, 188, 0, 0, 197, 0, 153, 154, 0, 0, 0, 0, 0, 223, 7, 33, 0, 0, 0, 140, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 235, 140, 0, 0, 0, 0, 139, 0, 239, 240, 0, 219, 220, 0, 0, 0, 221, 222, 223, 0, 0, 140, 0, 0, 0, 0, 153, 154, 0, 0, 0, 231, 232, 205, 206, 0, 233, 234, 235, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 197, 140, 0, 0, 0, 0, 139, 221, 222, 223, 0, 213, 214, 229, 230, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 233, 234, 235, 0, 225, 226, 0, 0, 0, 0, 0, 221, 222, 198, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 237, 238, 0, 0, 0, 0, 0, 233, 234];
        barriers = [];
        barriers[0] = [102, 0, 99, 240, 227, 359, 224, 648, 100, 914, 102, 1279];
        barriers[1] = [406, 0, 408, 433, 533, 565, 535, 783, 403, 821, 406, 1279];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1062, 149, 1043, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1062, 363, 1043, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 896, 344, 863));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 765, 397, 732));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 626, 397, 593));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 493, 329, 460));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 187, 186, 155));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 119, 365, 100, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1065, 363, 1046, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1046, 190, 1013));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 988, 363, 969, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 927, 249, 894));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 807, 318, 774));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 672, 404, 640));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 158, 151, 139, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 80, 151, 61, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1191, 355, 1172, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1120, 355, 1101, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 994, 256, 962));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 829, 193, 810, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 722, 245, 703, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 609, 431, 576));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 502, 324, 469));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 357, 320, 324));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 249, 224, 216));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 114, 142, 95, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1075, 311, 1011, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 845, 187, 826, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 777, 222, 758, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 262, 354, 243, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 192, 355, 173, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 118, 236, 86));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        settings = [];
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1129, 259, 1096));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1094, 335, 1030, 0, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1091, 178, 1027, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 990, 257, 957));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 854, 326, 821));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 713, 408, 680));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 694, 324, 675, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 694, 268, 675, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 237, 362, 218, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 236, 309, 217, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 193, 225, 161));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1087, 316, 1023, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 640, 273, 621, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 514, 398, 495, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 263, 262, 231));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 150, 371, 131, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 148, 156, 129, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 148, 325, 129, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1083, 167, 1050));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1065, 313, 1001, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 954, 163, 921));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 846, 238, 813));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 746, 325, 713));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 572, 410, 540));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 221, 354, 202, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 164, 356, 145, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 97, 131, 113, 102, 46, 47, 68, 69, 70, 71, 46, 47, 44, 45, 46, 47, 44, 45, 56, 57, 109, 113, 113, 114, 58, 59, 80, 81, 82, 83, 58, 59, 56, 57, 58, 59, 56, 57, 46, 47, 97, 132, 113, 88, 77, 71, 44, 45, 46, 47, 70, 71, 68, 69, 70, 71, 46, 47, 58, 59, 109, 113, 113, 143, 89, 90, 56, 57, 58, 59, 82, 83, 80, 81, 82, 83, 58, 59, 70, 71, 121, 122, 113, 113, 113, 88, 75, 76, 151, 152, 70, 71, 46, 47, 44, 45, 70, 71, 82, 83, 82, 134, 123, 131, 113, 113, 113, 113, 113, 164, 165, 166, 58, 59, 56, 57, 82, 83, 44, 45, 68, 69, 121, 122, 113, 132, 113, 113, 113, 113, 113, 177, 151, 152, 70, 71, 46, 47, 56, 57, 80, 81, 82, 134, 123, 124, 135, 136, 182, 113, 143, 113, 113, 164, 165, 166, 58, 59, 68, 69, 44, 45, 46, 47, 97, 102, 46, 47, 193, 194, 195, 113, 113, 98, 99, 178, 44, 45, 80, 81, 56, 57, 58, 59, 65, 66, 58, 59, 82, 83, 207, 208, 123, 113, 100, 114, 56, 57, 70, 71, 68, 69, 70, 71, 46, 47, 44, 45, 46, 47, 68, 69, 97, 113, 113, 102, 68, 69, 82, 83, 80, 81, 82, 83, 58, 59, 56, 57, 58, 59, 80, 81, 109, 113, 113, 114, 80, 81, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 70, 71, 70, 74, 86, 113, 132, 102, 70, 71, 58, 59, 56, 57, 58, 59, 82, 83, 80, 81, 82, 83, 85, 86, 113, 113, 113, 114, 82, 83, 70, 71, 68, 69, 70, 71, 70, 71, 147, 148, 75, 76, 86, 113, 131, 113, 125, 126, 44, 45, 82, 0, 80, 81, 82, 83, 157, 158, 159, 113, 113, 113, 113, 113, 113, 124, 137, 83, 56, 57, 44, 45, 70, 71, 147, 148, 159, 113, 99, 100, 113, 113, 113, 143, 125, 126, 46, 47, 68, 69, 56, 57, 157, 158, 159, 113, 113, 113, 98, 189, 135, 136, 135, 136, 137, 83, 58, 59, 80, 81, 68, 69, 169, 113, 131, 113, 100, 98, 201, 202, 44, 45, 46, 47, 44, 45, 70, 71, 68, 69, 80, 81, 109, 113, 113, 124, 211, 212, 82, 83, 56, 57, 58, 59, 56, 57, 82, 0, 80, 81, 70, 71, 97, 113, 113, 102, 44, 45, 46, 47, 44, 45, 70, 71, 68, 69, 44, 45, 68, 69, 82, 83, 109, 113, 113, 114, 56, 57, 58, 59, 56, 57, 82, 83, 80, 81, 56, 57, 80, 81];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 227, 228, 0, 236, 198, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0, 0, 0, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 197, 0, 0, 0, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 221, 222, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 233, 234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 110, 78, 0, 0, 0, 0, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 0, 0, 50, 0, 0, 222, 223, 25, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 52, 0, 62, 0, 153, 234, 235, 37, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 0, 0, 133, 39, 138, 0, 0, 0, 0, 49, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 156, 161, 162, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 168, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 17, 18, 0, 180, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 29, 30, 0, 0, 0, 0, 73, 110, 101, 78, 0, 0, 0, 0, 0, 0, 0, 221, 222, 40, 41, 42, 0, 0, 0, 0, 112, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 233, 234, 0, 0, 0, 0, 0, 73, 110, 64, 0, 51, 138, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 111, 0, 0, 51, 138, 44, 45, 0, 0, 0, 15, 16, 17, 18, 0, 154, 0, 0, 0, 0, 133, 38, 38, 138, 83, 56, 221, 222, 223, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 70, 233, 234, 235, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 82, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 163, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 115, 142, 141, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 128, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 139, 0, 0, 129, 141, 176, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 140, 0, 0, 139, 0, 163, 175, 176, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 163, 103, 0, 163, 103, 0, 0, 163, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 115, 176, 0, 140, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 140, 0, 0, 199, 120, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 115, 142, 141, 188, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 130, 33, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 0, 0, 129, 160, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 130, 160, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 129, 160, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 199, 187, 188, 141, 142, 141, 160, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 199, 187, 188, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [102, 0, 101, 241, 151, 275, 355, 491, 353, 629, 411, 675, 484, 771, 483, 955, 98, 1143, 102, 1407];
        barriers[1] = [406, 0, 406, 111, 516, 236, 638, 233, 1172, 503, 1173, 889, 1130, 919, 866, 1179, 644, 1164, 408, 1280, 406, 1407];
        barriers[2] = [531, 554, 555, 523, 661, 555, 864, 658, 854, 798, 774, 869, 646, 871, 601, 813, 605, 677, 538, 621, 527, 559];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1220, 502, 1201, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1188, 148, 1169, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1141, 882, 1122, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 1127, 395, 1070, -25));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1097, 686, 1064));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1079, 835, 1046));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 999, 956, 966));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 933, 754, 914, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 929, 633, 910, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 894, 888, 848, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 878, 1052, 845));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 867, 1130, 848, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 730, 1075, 697));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 570, 1136, 551, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 504, 529, 485, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 504, 611, 485, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 458, 794, 399, -62, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 399, 448, 367));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 350, 245, 282, -45, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 126, 144, 107, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 121, 363, 102, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 1227, 209, 1170, -25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1224, 508, 1205, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 1131, 879, 1085, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1044, 526, 1011));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 976, 707, 944, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 891, 553, 858));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 819, 1133, 800, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 746, 535, 713));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 699, 1132, 680, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 624, 452, 591));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 570, 870, 511, -62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 551, 1130, 532, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 382, 440, 350));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 204, 144, 185, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 95, 141, 76, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 3, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 97, 113, 143, 102, 68, 69, 68, 69, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 56, 57, 109, 113, 113, 114, 80, 81, 80, 81, 58, 59, 56, 57, 58, 59, 82, 83, 80, 81, 46, 47, 97, 143, 113, 102, 70, 71, 44, 45, 68, 69, 70, 71, 46, 47, 46, 47, 68, 69, 58, 59, 109, 113, 113, 114, 82, 83, 56, 57, 80, 81, 82, 83, 58, 59, 58, 59, 80, 81, 70, 71, 121, 122, 113, 102, 70, 71, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 82, 83, 82, 134, 123, 114, 82, 83, 56, 57, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 44, 45, 44, 45, 97, 102, 44, 45, 46, 47, 46, 47, 46, 47, 70, 71, 68, 69, 70, 0, 56, 57, 56, 57, 109, 114, 56, 57, 58, 59, 58, 59, 58, 59, 82, 83, 80, 81, 82, 83, 68, 69, 68, 69, 97, 102, 68, 69, 70, 71, 46, 47, 68, 69, 68, 69, 70, 71, 46, 47, 80, 81, 80, 81, 109, 114, 80, 81, 82, 83, 58, 59, 80, 81, 80, 81, 82, 83, 58, 59, 44, 45, 70, 8, 21, 102, 46, 47, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 70, 71, 56, 57, 82, 20, 113, 114, 58, 59, 58, 59, 0, 57, 58, 59, 82, 83, 80, 81, 82, 83, 46, 47, 31, 32, 113, 102, 44, 45, 68, 69, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 58, 59, 43, 113, 113, 114, 56, 57, 80, 81, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 70, 71, 97, 113, 143, 102, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 46, 47, 82, 83, 109, 113, 113, 114, 56, 57, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 1, 2, 153, 154, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 139, 25, 26, 0, 156, 161, 162, 0, 221, 222, 223, 0, 0, 153, 0, 140, 0, 0, 0, 0, 140, 37, 0, 0, 168, 173, 174, 0, 233, 234, 235, 0, 4, 5, 0, 139, 0, 0, 0, 0, 140, 49, 0, 0, 180, 185, 186, 0, 0, 0, 0, 15, 16, 17, 0, 139, 0, 0, 0, 0, 139, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 0, 140, 0, 0, 0, 0, 140, 221, 222, 223, 0, 0, 0, 0, 205, 206, 0, 0, 40, 41, 0, 139, 0, 0, 0, 0, 139, 233, 234, 235, 197, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 4, 5, 0, 213, 214, 229, 230, 0, 219, 220, 0, 0, 140, 0, 0, 0, 0, 139, 0, 15, 16, 17, 18, 225, 226, 0, 0, 0, 231, 232, 0, 0, 139, 0, 0, 0, 0, 153, 154, 27, 28, 29, 30, 237, 238, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 221, 222, 0, 140, 0, 0, 0, 0, 140, 227, 228, 0, 0, 0, 0, 221, 222, 223, 0, 0, 233, 234, 0, 140, 0, 0, 0, 0, 139, 239, 240, 0, 219, 220, 0, 233, 234, 235, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [102, 0, 102, 1023];
        barriers[1] = [406, 0, 406, 1023];
        settings = [];
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 869, 225, 836));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 755, 287, 722));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 636, 348, 603));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 503, 347, 470));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 403, 268, 384, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 183, 364, 164, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 148, 225, 116));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 69, 363, 50, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 916, 242, 844, 25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 844, 175, 825, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 762, 217, 743, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 671, 265, 652, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 354, 363, 335, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 204, 363, 185, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 154, 229, 122));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 69, 363, 50, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 987, 329, 923, 0, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 851, 171, 832, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 762, 217, 743, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 671, 265, 652, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 396, 262, 377, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 221, 331, 157, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 192, 215, 160));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [46, 47, 97, 131, 113, 102, 44, 45, 46, 47, 68, 69, 70, 71, 97, 113, 131, 102, 68, 69, 58, 59, 109, 113, 113, 114, 56, 57, 58, 59, 80, 81, 82, 83, 109, 113, 113, 114, 80, 81, 70, 71, 79, 132, 113, 22, 11, 71, 68, 69, 70, 71, 70, 74, 87, 131, 113, 84, 70, 71, 82, 83, 91, 92, 113, 131, 23, 83, 80, 81, 82, 83, 85, 86, 113, 132, 95, 96, 82, 83, 0, 69, 70, 104, 113, 113, 35, 36, 70, 71, 147, 148, 87, 132, 113, 125, 126, 71, 44, 45, 80, 81, 82, 116, 105, 113, 113, 48, 157, 158, 159, 113, 144, 113, 124, 137, 82, 83, 56, 57, 44, 45, 68, 69, 97, 144, 113, 88, 159, 113, 131, 113, 113, 200, 126, 71, 70, 71, 68, 69, 56, 57, 80, 81, 109, 113, 113, 100, 113, 113, 113, 189, 211, 212, 82, 83, 82, 83, 80, 81, 70, 71, 44, 45, 97, 113, 98, 99, 113, 200, 201, 202, 44, 45, 70, 71, 44, 45, 70, 71, 82, 83, 56, 57, 109, 113, 99, 124, 211, 212, 82, 83, 56, 57, 82, 83, 56, 57, 82, 83, 46, 47, 70, 71, 97, 113, 98, 102, 70, 71, 44, 45, 70, 71, 46, 47, 70, 71, 68, 69, 58, 59, 82, 83, 109, 113, 113, 72, 82, 83, 56, 57, 82, 83, 58, 59, 82, 83, 80, 81, 44, 45, 70, 8, 21, 113, 131, 84, 44, 45, 70, 0, 46, 47, 68, 69, 44, 45, 70, 71, 56, 57, 82, 20, 113, 113, 95, 96, 56, 57, 82, 83, 58, 59, 80, 81, 56, 57, 82, 83, 68, 69, 31, 32, 113, 131, 107, 71, 68, 69, 44, 45, 46, 47, 70, 71, 68, 69, 44, 45, 80, 81, 43, 113, 113, 106, 119, 83, 80, 81, 56, 57, 58, 59, 82, 83, 80, 81, 56, 57, 46, 47, 97, 113, 113, 102, 44, 45, 70, 71, 44, 45, 68, 69, 46, 47, 70, 71, 68, 69, 58, 59, 109, 113, 131, 114, 56, 57, 82, 83, 56, 57, 80, 81, 58, 59, 82, 83, 80, 81, 70, 71, 97, 113, 113, 102, 68, 69, 44, 45, 70, 71, 46, 47, 68, 69, 44, 45, 70, 71, 82, 83, 109, 113, 132, 114, 80, 81, 56, 57, 82, 83, 58, 59, 80, 81, 56, 57, 82, 83];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 221, 222, 29, 30, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 73, 101, 78, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 233, 234, 235, 0, 0, 73, 64, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 0, 0, 0, 0, 111, 0, 0, 62, 0, 0, 0, 0, 0, 221, 222, 223, 180, 185, 186, 161, 162, 153, 154, 0, 112, 0, 51, 138, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 173, 174, 0, 0, 0, 111, 0, 50, 0, 0, 4, 5, 0, 155, 0, 0, 0, 0, 0, 0, 185, 186, 0, 0, 0, 133, 38, 138, 0, 15, 16, 17, 18, 167, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 179, 0, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 191, 192, 0, 0, 0, 0, 0, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 203, 204, 0, 197, 0, 221, 222, 232, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 215, 216, 0, 0, 0, 233, 234, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 198, 0, 0, 223, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 235, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 239, 240, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 231, 232, 0, 0];
        map[2] = [0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 94, 120, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 171, 120, 0, 0, 0, 0, 108, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 171, 172, 160, 0, 0, 0, 0, 94, 33, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 172, 160, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 199, 187, 33, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 199, 187, 188, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 187, 188, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [406, 0, 406, 133, 520, 349, 790, 222, 859, 142, 870, 0];
        barriers[1] = [102, 0, 100, 121, 226, 359, 228, 773, 101, 1025, 102, 1279];
        barriers[2] = [1174, 0, 1171, 141, 1046, 343, 882, 477, 533, 646, 531, 784, 406, 1012, 406, 1279];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1187, 367, 1168, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1166, 196, 1102, 0, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1061, 367, 1042, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 756, 392, 723));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 629, 528, 610, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 611, 408, 578));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 563, 526, 544, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 498, 523, 465));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 478, 314, 446, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 436, 664, 403));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 412, 520, 393, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 408, 924, 389, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 212, 1053, 180));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 129, 915, 110, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 124, 1139, 105, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 110, 339, 78, 0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 1176, 330, 1144, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1040, 146, 1021, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 937, 412, 918, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 846, 456, 827, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 546, 636, 487, 62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 518, 281, 499, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 495, 430, 462));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 470, 330, 451, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 386, 474, 367, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 365, 362, 332));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 284, 876, 216, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 228, 321, 195));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 132, 1131, 113, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 82, 304, 50));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1172, 313, 1108, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 935, 374, 902));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 806, 434, 773));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 745, 286, 726, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 687, 323, 668, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 657, 436, 624));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 537, 529, 504));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 475, 314, 456, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 466, 646, 433));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 452, 899, 384, -45));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 414, 278, 395, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 222, 856, 203, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 193, 1073, 161));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 155, 185, 123, 0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 3));
        blocks.push(new GameMap.MapBlock(blockId++, 3, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [46, 47, 70, 71, 68, 69, 70, 71, 46, 47, 68, 69, 70, 71, 97, 113, 113, 102, 70, 71, 58, 59, 82, 83, 80, 81, 82, 83, 58, 59, 80, 81, 82, 83, 109, 113, 131, 114, 82, 83, 68, 69, 68, 69, 70, 71, 46, 47, 70, 71, 70, 71, 46, 47, 97, 113, 125, 126, 68, 69, 80, 81, 80, 81, 82, 83, 58, 59, 82, 83, 82, 83, 58, 59, 109, 124, 137, 83, 80, 81, 46, 47, 0, 71, 68, 69, 70, 71, 68, 69, 70, 71, 46, 47, 97, 102, 44, 45, 70, 71, 58, 59, 82, 83, 80, 81, 82, 83, 80, 81, 82, 83, 58, 59, 109, 114, 56, 57, 82, 83, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 68, 69, 70, 71, 97, 88, 77, 47, 46, 47, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 80, 81, 82, 83, 109, 113, 89, 90, 58, 59, 68, 69, 70, 71, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 97, 131, 113, 102, 70, 71, 80, 81, 82, 83, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 109, 113, 113, 114, 82, 83, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 46, 47, 97, 113, 132, 102, 46, 47, 56, 57, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 58, 59, 109, 113, 113, 114, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 198, 221, 222, 223, 140, 0, 0, 0, 0, 140, 0, 0, 4, 5, 231, 232, 0, 0, 224, 0, 0, 233, 234, 235, 139, 0, 0, 0, 0, 139, 0, 15, 16, 17, 18, 221, 222, 223, 236, 0, 0, 213, 214, 0, 140, 0, 0, 0, 0, 153, 154, 27, 28, 29, 30, 233, 234, 235, 0, 197, 0, 225, 226, 0, 140, 0, 0, 0, 0, 140, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 237, 238, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 227, 228, 0, 198, 153, 154, 0, 0, 221, 222, 140, 0, 0, 0, 0, 140, 0, 0, 0, 198, 239, 240, 0, 0, 0, 0, 0, 0, 233, 234, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 197, 0, 0, 156, 161, 162, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 221, 222, 223, 0, 0, 0, 0, 168, 173, 174, 0, 0, 140, 0, 0, 0, 0, 139, 0, 154, 233, 234, 235, 0, 219, 220, 0, 180, 185, 186, 145, 153, 154, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        barriers = [];
        barriers[0] = [870, 0, 870, 767];
        barriers[1] = [1174, 0, 1174, 767];
        settings = [];
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 574, 1095, 541));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 479, 989, 446));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 382, 1041, 363, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 327, 962, 294));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 285, 1041, 266, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 77, 1072, 45));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 465, 1141, 446, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 356, 957, 324));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 196, 1141, 177, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 681, 1106, 648));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 563, 1107, 530));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 470, 1023, 437));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 448, 1104, 429, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 382, 1041, 363, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 285, 1041, 266, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 81, 1065, 49));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 46, 47, 70, 71, 68, 69, 46, 47, 44, 45, 46, 47, 97, 132, 113, 102, 46, 47, 56, 57, 58, 59, 82, 83, 80, 81, 58, 59, 56, 57, 58, 59, 109, 113, 113, 114, 58, 59, 70, 71, 44, 45, 44, 45, 46, 47, 70, 71, 68, 69, 70, 74, 87, 113, 113, 102, 70, 71, 82, 83, 56, 57, 56, 57, 58, 59, 82, 83, 80, 81, 85, 86, 113, 132, 113, 114, 82, 83, 44, 45, 46, 47, 70, 74, 75, 76, 75, 76, 75, 76, 87, 131, 113, 113, 125, 126, 44, 45, 56, 57, 58, 59, 85, 86, 0, 0, 113, 113, 113, 113, 113, 113, 113, 189, 137, 83, 56, 57, 46, 0, 70, 8, 21, 113, 113, 0, 113, 113, 113, 132, 113, 200, 201, 202, 68, 69, 68, 69, 58, 59, 82, 20, 113, 113, 113, 124, 135, 136, 135, 136, 211, 212, 82, 83, 80, 81, 80, 81, 44, 45, 31, 32, 113, 144, 125, 126, 44, 45, 70, 71, 46, 47, 44, 45, 44, 45, 70, 71, 56, 57, 43, 113, 113, 124, 137, 83, 56, 57, 82, 83, 58, 59, 56, 57, 56, 57, 82, 83, 68, 69, 97, 113, 131, 102, 46, 47, 68, 69, 44, 45, 70, 71, 68, 69, 46, 47, 46, 47, 80, 81, 109, 113, 113, 114, 58, 59, 80, 81, 56, 57, 82, 83, 80, 81, 58, 59, 58, 59, 46, 47, 79, 113, 144, 88, 77, 71, 46, 47, 68, 69, 44, 45, 0, 47, 46, 47, 68, 69, 58, 59, 91, 92, 113, 113, 89, 90, 58, 59, 80, 81, 56, 57, 58, 59, 58, 59, 80, 81, 44, 45, 70, 104, 132, 113, 113, 88, 75, 76, 75, 150, 151, 152, 70, 71, 70, 71, 44, 45, 56, 57, 82, 116, 105, 113, 113, 113, 0, 0, 0, 113, 113, 164, 165, 166, 82, 83, 56, 57, 68, 69, 46, 47, 121, 122, 113, 0, 0, 0, 0, 113, 144, 113, 113, 177, 77, 71, 46, 47, 80, 81, 58, 59, 82, 134, 135, 136, 135, 136, 135, 136, 123, 113, 132, 113, 89, 90, 58, 59, 70, 71, 44, 45, 68, 69, 70, 71, 44, 45, 46, 47, 121, 122, 113, 131, 113, 102, 70, 71, 82, 83, 56, 57, 80, 81, 82, 83, 56, 57, 58, 59, 82, 134, 123, 113, 113, 114, 82, 83, 68, 69, 70, 71, 44, 45, 68, 69, 70, 71, 44, 45, 46, 47, 97, 113, 113, 102, 70, 71, 80, 81, 82, 83, 56, 57, 80, 81, 82, 83, 56, 57, 58, 59, 109, 113, 113, 114, 82, 83];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 110, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 98, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 52, 98, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 25, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 110, 101, 78, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 64, 98, 99, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 0, 111, 98, 99, 100, 98, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 0, 133, 38, 39, 38, 39, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 213, 214, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224, 140, 0, 0, 0, 0, 139, 0, 0, 225, 226, 205, 206, 0, 219, 220, 0, 221, 222, 223, 236, 139, 0, 0, 0, 0, 0, 0, 0, 237, 238, 217, 218, 0, 231, 232, 0, 233, 234, 235, 0, 19, 0, 0, 0, 0, 140, 0, 0, 0, 0, 229, 230, 0, 171, 141, 142, 142, 141, 142, 172, 0, 0, 0, 0, 0, 139, 0, 4, 5, 6, 0, 171, 172, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 129, 160, 0, 16, 17, 18, 7, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 130, 33, 0, 0, 28, 29, 30, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 172, 0, 221, 222, 223, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 187, 188, 198, 0, 233, 234, 235, 0, 0, 19, 0, 0, 0, 0, 129, 103, 0, 0, 108, 188, 0, 0, 0, 0, 0, 0, 0, 0, 94, 160, 0, 0, 0, 108, 33, 139, 0, 0, 139, 0, 0, 0, 0, 0, 0, 227, 228, 0, 140, 0, 0, 0, 0, 140, 224, 140, 0, 0, 140, 0, 0, 0, 0, 0, 0, 239, 240, 153, 154, 0, 0, 0, 0, 139, 236, 139, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 115, 93, 140, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 228, 0, 103, 0, 0, 0, 0, 115, 140, 0, 0, 139, 176, 0, 0, 0, 0, 0, 197, 0, 240, 0, 115, 93, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 198, 221, 222, 0, 0, 0, 115, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 176, 233, 234, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 176, 0, 0, 0, 0, 0, 0, 0, 141, 142, 141, 142, 141, 142, 196, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 198, 0, 0, 0, 219, 220, 0, 0, 0, 183, 196, 0, 0, 0, 0, 139, 0, 221, 222, 223, 0, 0, 197, 0, 231, 232, 0, 221, 222, 223, 139, 0, 0, 0, 0, 140, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 140, 0, 0, 0, 0, 139, 0];
        barriers = [];
        barriers[0] = [870, 0, 864, 160, 771, 234, 446, 233, 257, 331, 97, 662, 102, 759, 217, 983, 393, 1175, 752, 1181, 868, 1295, 870, 1407];
        barriers[1] = [509, 515, 547, 561, 543, 889, 409, 771, 408, 622, 503, 518];
        barriers[2] = [1174, 0, 1173, 240, 923, 462, 731, 537, 726, 876, 807, 889, 1056, 1020, 1178, 1150, 1174, 1407];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1264, 886, 1245, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1210, 832, 1191, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1092, 901, 1033, -62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 984, 384, 951));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 894, 601, 875, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 894, 674, 875, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 880, 287, 847));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 728, 251, 695));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 590, 402, 544, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 570, 289, 537));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 568, 674, 549, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 568, 601, 549, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 401, 784, 369));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 261, 828, 242, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 211, 883, 192, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1160, 1099, 1141, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1147, 492, 1128, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1100, 1038, 1081, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 913, 486, 894, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 867, 646, 834));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 735, 646, 702));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 720, 140, 701, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 601, 647, 568));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 351, 351, 332, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 310, 418, 291, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 245, 847, 226, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 190, 901, 171, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 166, 1040, 134));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1148, 543, 1129, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 949, 543, 930, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 922, 262, 865, -25));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 884, 641, 851));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 756, 187, 724, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 755, 642, 722));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 629, 643, 596));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 473, 643, 440));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 451, 854, 432, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 409, 937, 390, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 341, 525, 322, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 286, 525, 267, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 280, 976, 248));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1249, 885, 1181, -45, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1152, 536, 1133, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1098, 536, 1079, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 996, 377, 963));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 948, 536, 929, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 858, 284, 825));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 731, 143, 712, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 724, 366, 705, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 671, 256, 638));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 525, 362, 492));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 384, 293, 365, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 365, 646, 319, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 304, 970, 272));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 215, 1127, 196, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 129, 1127, 110, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        blocks.push(new GameMap.MapBlock(blockId++, 2, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [46, 47, 46, 47, 46, 47, 70, 71, 68, 69, 70, 71, 44, 45, 97, 113, 144, 102, 44, 45, 58, 59, 58, 59, 58, 59, 82, 83, 80, 81, 82, 83, 56, 57, 109, 113, 113, 114, 56, 57, 70, 71, 46, 47, 68, 69, 68, 69, 70, 71, 46, 0, 68, 69, 97, 0, 113, 102, 46, 47, 82, 83, 58, 59, 80, 81, 80, 81, 82, 83, 58, 59, 80, 81, 109, 0, 113, 114, 58, 59, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 70, 71, 70, 8, 21, 113, 113, 84, 70, 71, 58, 59, 56, 57, 58, 59, 82, 83, 80, 81, 82, 83, 82, 20, 113, 143, 95, 96, 82, 83, 68, 69, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 31, 32, 113, 113, 107, 71, 44, 45, 80, 81, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 43, 113, 144, 106, 119, 83, 56, 57, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 46, 47, 55, 143, 113, 102, 46, 47, 68, 69, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 58, 59, 67, 113, 113, 114, 58, 59, 80, 81, 46, 47, 46, 47, 46, 47, 70, 71, 68, 69, 70, 71, 79, 113, 113, 22, 11, 71, 44, 45, 58, 59, 58, 59, 58, 59, 82, 83, 80, 81, 82, 83, 91, 92, 0, 113, 23, 83, 56, 57, 70, 71, 46, 47, 68, 69, 68, 69, 70, 71, 46, 47, 70, 104, 113, 0, 35, 36, 46, 47, 82, 83, 58, 59, 80, 81, 80, 81, 82, 83, 58, 59, 82, 116, 105, 113, 113, 48, 58, 59, 46, 47, 44, 45, 46, 47, 70, 71, 68, 69, 70, 71, 46, 47, 97, 144, 113, 60, 70, 71, 58, 59, 56, 57, 58, 59, 82, 83, 80, 81, 82, 83, 58, 59, 109, 113, 113, 114, 82, 83, 68, 69, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 44, 45, 97, 113, 143, 102, 44, 45, 80, 81, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 56, 57, 109, 113, 113, 114, 56, 57];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 15, 16, 17, 18, 0, 73, 101, 78, 0, 0, 213, 0, 0, 0, 0, 0, 0, 0, 13, 14, 27, 28, 29, 30, 0, 112, 100, 50, 0, 0, 225, 0, 0, 0, 0, 0, 0, 0, 25, 26, 0, 40, 41, 42, 0, 111, 98, 62, 0, 0, 237, 0, 0, 0, 0, 0, 0, 0, 37, 0, 0, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 167, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 179, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 78, 0, 197, 0, 191, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 98, 63, 78, 0, 0, 203, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 52, 100, 50, 0, 0, 215, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 221, 222, 223, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 198, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 239, 240, 0, 0, 0, 0, 219, 220, 0, 7, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 19, 0, 0, 0, 94, 120, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 108, 0, 0, 0, 233, 234, 235, 0, 153, 154, 0, 0, 145, 146, 0, 139, 0, 0, 0, 0, 153, 154, 0, 0, 206, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 218, 0, 0, 0, 0, 156, 161, 162, 221, 222, 223, 115, 93, 0, 0, 0, 24, 0, 0, 0, 230, 0, 0, 0, 0, 168, 173, 174, 233, 234, 235, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 197, 0, 227, 228, 0, 231, 232, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 221, 222, 223, 0, 0, 239, 240, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 198, 0, 153, 154, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0];
        barriers = [];
        barriers[0] = [870, 0, 868, 264, 739, 520, 740, 638, 873, 885, 870, 1151];
        barriers[1] = [1174, 0, 1172, 250, 1050, 481, 1051, 656, 1172, 889, 1174, 1151];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1040, 1133, 1021, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 961, 1133, 942, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 831, 980, 798));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 689, 909, 656));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 537, 912, 504));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 391, 989, 358));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 236, 1133, 217, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 207, 1031, 175));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 165, 1133, 146, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 874, 1118, 855, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 805, 1078, 786, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 737, 1042, 718, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 602, 958, 569));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 487, 809, 468, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 455, 996, 422));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 399, 856, 380, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 335, 1073, 302));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 299, 909, 280, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 102, 911, 83, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 102, 1137, 83, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 87, 1025, 55));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1095, 963, 1031, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1056, 1135, 1037, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 974, 1135, 955, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 713, 901, 680));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 588, 1007, 569, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 588, 787, 569, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 567, 903, 534));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 434, 957, 401));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 264, 909, 245, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 264, 1132, 245, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 145, 962, 113));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 881, 954, 848));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 866, 1102, 847, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 790, 1062, 771, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 758, 890, 725));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 636, 789, 617, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 620, 891, 587));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 550, 789, 531, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 469, 896, 436));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 235, 993, 203));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 142, 1133, 123, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 142, 1073, 123, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 3));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [68, 69, 68, 69, 70, 71, 46, 47, 70, 71, 70, 71, 46, 47, 97, 144, 113, 102, 68, 69, 80, 81, 80, 81, 82, 83, 58, 59, 82, 83, 82, 83, 58, 59, 109, 113, 113, 114, 80, 81, 46, 47, 70, 71, 68, 69, 70, 71, 68, 69, 70, 71, 46, 47, 97, 113, 131, 102, 70, 71, 58, 59, 82, 83, 80, 81, 82, 83, 80, 81, 82, 83, 58, 59, 109, 113, 113, 114, 82, 83, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 68, 69, 70, 71, 121, 122, 132, 102, 46, 47, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 80, 81, 82, 83, 82, 134, 123, 114, 58, 59, 68, 69, 70, 71, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 44, 45, 97, 102, 68, 69, 80, 81, 82, 83, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 56, 57, 109, 114, 80, 81, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 46, 47, 70, 8, 21, 102, 70, 71, 56, 57, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 58, 59, 82, 20, 113, 114, 82, 83, 68, 69, 68, 69, 70, 71, 46, 47, 70, 71, 70, 71, 46, 47, 31, 32, 113, 102, 68, 69, 80, 81, 80, 81, 82, 83, 58, 59, 82, 83, 82, 83, 58, 59, 43, 113, 143, 114, 80, 81, 46, 47, 70, 71, 68, 69, 70, 71, 68, 69, 70, 71, 46, 47, 97, 131, 113, 102, 68, 69, 58, 59, 82, 83, 80, 81, 82, 83, 80, 81, 82, 83, 58, 59, 109, 100, 113, 114, 80, 81, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 68, 69, 70, 71, 97, 98, 100, 102, 46, 47, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 80, 81, 82, 83, 109, 113, 98, 114, 58, 59, 68, 69, 70, 71, 70, 71, 46, 47, 46, 47, 68, 69, 44, 45, 97, 113, 125, 126, 44, 45, 80, 81, 82, 83, 82, 83, 58, 59, 58, 59, 80, 81, 56, 57, 109, 124, 137, 83, 56, 57, 68, 69, 68, 69, 70, 71, 46, 47, 70, 71, 70, 71, 46, 47, 97, 102, 68, 69, 46, 47, 80, 81, 80, 81, 82, 83, 58, 59, 82, 83, 82, 83, 58, 59, 109, 114, 80, 81, 58, 59, 46, 47, 70, 71, 68, 69, 70, 71, 68, 69, 70, 71, 46, 47, 97, 22, 11, 71, 70, 71, 58, 59, 82, 83, 80, 81, 82, 83, 80, 81, 82, 83, 58, 59, 109, 113, 23, 83, 82, 83, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 68, 69, 70, 71, 97, 131, 35, 36, 68, 69, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 80, 81, 82, 83, 109, 144, 113, 48, 80, 81, 68, 69, 70, 71, 70, 71, 46, 47, 46, 47, 68, 69, 70, 71, 97, 113, 132, 102, 46, 47, 80, 81, 82, 83, 82, 83, 58, 59, 58, 59, 80, 81, 82, 83, 109, 113, 113, 114, 58, 59, 44, 45, 46, 47, 46, 47, 68, 69, 70, 71, 70, 71, 46, 47, 97, 113, 131, 102, 70, 71, 56, 57, 58, 59, 58, 59, 80, 81, 82, 83, 82, 83, 58, 59, 109, 113, 113, 114, 82, 83, 68, 69, 68, 69, 70, 71, 46, 47, 70, 71, 70, 71, 46, 47, 97, 144, 113, 102, 68, 69, 80, 81, 80, 81, 82, 83, 58, 59, 82, 83, 82, 83, 58, 59, 109, 132, 113, 114, 80, 81];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 25, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 0, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 0, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 221, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 101, 78, 0, 0, 156, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 112, 0, 63, 78, 0, 168, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 111, 0, 0, 50, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 52, 0, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 221, 222, 223, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 13, 14, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 0, 0, 0, 0, 0, 0, 198, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 49, 0, 0, 0, 0, 0, 0, 0, 219, 0, 13, 14, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 231, 0, 25, 26, 0, 0, 0, 0, 0, 0, 4, 5, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 37, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 221, 0, 49, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 233, 0, 61, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 155, 0, 221, 222, 223, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 167, 0, 233, 234, 235, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 179, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 191, 192, 0, 0, 115, 103, 0, 0, 0, 140, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 203, 204, 0, 0, 0, 115, 103, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 215, 216, 0, 0, 0, 0, 140, 0, 0, 153, 154, 221, 222, 223, 227, 228, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 140, 0, 233, 234, 235, 239, 240, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 19, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 219, 220, 0, 7, 33, 0, 0, 139, 0, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 19, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 7, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 233, 234, 235, 0, 153, 154, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 153, 154, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0, 139, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 140, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 140, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 0, 0, 140, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 0, 0, 139, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 219, 220, 0, 180, 185, 186, 0, 0, 0, 140, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 139, 0, 0, 0, 0, 233, 234, 235, 0, 219, 220, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0];
        barriers = [];
        barriers[0] = [870, 0, 869, 251, 1001, 371, 994, 522, 868, 779, 870, 1919];
        barriers[1] = [1174, 0, 1172, 1040, 1047, 1175, 1048, 1285, 1172, 1530, 1174, 1919];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1728, 917, 1709, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1669, 1096, 1636));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1648, 917, 1629, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1528, 1073, 1495));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1406, 1001, 1373));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1256, 955, 1223));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 835, 1058, 803));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 739, 947, 720, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 667, 983, 648, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 594, 1017, 575, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 161, 1135, 142, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 78, 1135, 59, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1771, 964, 1707, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1495, 1095, 1476, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1432, 1067, 1413, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1368, 1039, 1349, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 933, 1109, 900));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 785, 1109, 752));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 779, 999, 707, 25, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 638, 1105, 605));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 485, 1104, 452));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 191, 1127, 172, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 120, 984, 88));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 114, 1127, 95, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1646, 982, 1627, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1646, 920, 1627, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 1378, 961, 1346));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 902, 982, 883, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 902, 920, 883, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 673, 1048, 640));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 529, 1094, 496));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 362, 1089, 329));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 236, 1002, 203));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 134, 1133, 115, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 134, 1073, 115, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 1, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 70, 71, 68, 69, 44, 45, 97, 113, 113, 102, 46, 47, 44, 45, 70, 71, 44, 45, 56, 57, 82, 83, 80, 81, 56, 57, 109, 143, 113, 114, 58, 59, 56, 57, 82, 83, 56, 57, 68, 69, 44, 45, 44, 45, 68, 69, 121, 122, 113, 22, 11, 71, 70, 71, 68, 69, 68, 69, 80, 81, 56, 57, 56, 57, 80, 81, 82, 134, 123, 132, 23, 83, 82, 83, 80, 81, 80, 81, 46, 47, 46, 47, 70, 71, 46, 47, 68, 69, 79, 113, 35, 36, 46, 47, 44, 45, 46, 47, 58, 59, 58, 59, 82, 83, 58, 59, 80, 81, 91, 92, 144, 48, 58, 59, 56, 57, 58, 59, 70, 71, 68, 69, 46, 47, 70, 71, 44, 45, 70, 104, 113, 22, 11, 71, 70, 71, 70, 71, 82, 83, 80, 81, 58, 59, 82, 83, 56, 57, 82, 116, 105, 113, 23, 83, 82, 83, 82, 83, 68, 69, 44, 45, 44, 45, 70, 71, 68, 69, 46, 47, 97, 131, 35, 36, 46, 47, 68, 69, 80, 81, 56, 57, 56, 57, 82, 83, 80, 81, 58, 59, 109, 113, 113, 48, 58, 59, 80, 81, 44, 45, 68, 69, 68, 69, 44, 45, 44, 45, 70, 71, 79, 113, 113, 22, 11, 71, 44, 45, 56, 57, 80, 81, 80, 81, 56, 57, 56, 57, 82, 83, 91, 92, 143, 113, 23, 83, 56, 57, 70, 71, 46, 47, 46, 47, 46, 47, 70, 71, 44, 45, 70, 104, 113, 113, 35, 36, 70, 71, 82, 83, 58, 59, 58, 59, 58, 59, 82, 83, 56, 57, 82, 116, 105, 113, 98, 48, 82, 83, 46, 47, 70, 71, 70, 71, 68, 69, 46, 47, 46, 47, 70, 71, 97, 113, 99, 100, 46, 47, 58, 59, 82, 83, 82, 83, 80, 81, 58, 59, 58, 59, 82, 83, 109, 113, 113, 114, 58, 59];
        map[1] = [0, 0, 0, 0, 0, 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 213, 214, 0, 0, 236, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 227, 228, 0, 0, 0, 225, 226, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 239, 240, 0, 0, 0, 237, 238, 205, 206, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 224, 220, 0, 0, 0, 217, 218, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 236, 232, 0, 0, 0, 229, 230, 167, 0, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 0, 0, 0, 0, 0, 0, 179, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 0, 0, 221, 222, 223, 0, 191, 192, 0, 0, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 0, 0, 233, 234, 235, 0, 203, 204, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 215, 216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 219, 222, 223, 0, 0, 0, 231, 232, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 231, 234, 235, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 73, 110, 78, 0, 0, 0, 0, 0, 227, 228, 0, 221, 222, 223, 40, 41, 42, 0, 0, 0, 111, 0, 63, 78, 221, 0, 0, 0, 239, 240, 0, 233, 234, 235, 0, 0, 197, 0, 0, 0, 112, 0, 0, 50, 233, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 38, 39, 138, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0];
        barriers = [];
        barriers[0] = [486, 0, 484, 115, 867, 883, 870, 1023];
        barriers[1] = [790, 0, 791, 134, 1174, 896, 1174, 1023];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 938, 1131, 919, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 873, 935, 840));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 760, 880, 727));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 643, 820, 610));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 496, 820, 463));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 248, 713, 216));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 139, 538, 120, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 875, 940, 842));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 788, 992, 716, -25, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 760, 880, 727));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 622, 878, 589));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 590, 775, 571, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 530, 783, 511, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 345, 780, 313));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 271, 656, 252, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 201, 582, 182, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 10));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [68, 69, 70, 71, 44, 45, 46, 47, 97, 113, 113, 102, 44, 45, 68, 69, 44, 45, 46, 47, 80, 81, 82, 83, 56, 57, 58, 59, 109, 113, 113, 114, 56, 57, 80, 81, 56, 57, 58, 59, 44, 45, 46, 47, 68, 69, 70, 71, 97, 144, 113, 102, 68, 69, 70, 71, 44, 45, 68, 69, 56, 57, 58, 59, 80, 81, 82, 83, 109, 113, 131, 72, 80, 81, 82, 83, 56, 57, 80, 81, 46, 47, 70, 8, 9, 76, 75, 76, 87, 144, 113, 84, 46, 47, 68, 69, 68, 69, 70, 71, 58, 59, 82, 20, 100, 99, 113, 113, 131, 113, 95, 96, 58, 59, 80, 81, 80, 81, 82, 83, 46, 47, 31, 32, 113, 98, 113, 113, 113, 113, 107, 71, 70, 71, 44, 45, 46, 47, 68, 69, 58, 59, 43, 113, 113, 124, 135, 136, 135, 118, 119, 83, 82, 83, 56, 57, 58, 59, 80, 81, 70, 71, 55, 113, 113, 102, 70, 71, 46, 47, 44, 45, 68, 69, 70, 71, 70, 71, 44, 45, 82, 83, 67, 113, 113, 114, 82, 83, 58, 59, 56, 57, 80, 81, 82, 83, 82, 83, 56, 57, 44, 45, 79, 113, 144, 88, 75, 76, 75, 76, 151, 152, 70, 71, 46, 47, 68, 69, 70, 71, 56, 57, 91, 92, 113, 113, 113, 113, 100, 113, 113, 164, 165, 166, 58, 59, 80, 81, 82, 83, 68, 69, 70, 104, 131, 113, 113, 98, 99, 98, 113, 113, 113, 177, 151, 152, 70, 71, 46, 47, 80, 81, 82, 116, 117, 136, 135, 136, 135, 136, 182, 113, 131, 113, 113, 164, 165, 166, 58, 59, 46, 47, 44, 45, 68, 69, 44, 45, 46, 47, 193, 194, 195, 113, 144, 113, 113, 178, 68, 69, 58, 59, 56, 57, 80, 81, 56, 57, 58, 59, 82, 83, 207, 208, 123, 113, 113, 114, 80, 81, 70, 71, 68, 69, 70, 71, 44, 45, 68, 69, 44, 45, 46, 47, 97, 131, 113, 102, 44, 45, 82, 83, 80, 81, 82, 83, 56, 57, 80, 81, 56, 57, 58, 59, 109, 113, 113, 114, 56, 57];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 227, 228, 0, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 221, 222, 223, 233, 234, 235, 239, 240, 0, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 219, 220, 0, 73, 110, 101, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 231, 232, 0, 111, 0, 0, 50, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 133, 52, 0, 62, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 198, 0, 0, 154, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 93, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 235, 0, 0, 0, 0, 0, 0, 73, 101, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 64, 0, 63, 78, 0, 0, 0, 0, 0, 197, 0, 0, 213, 0, 198, 0, 0, 0, 0, 111, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 225, 161, 162, 0, 0, 0, 0, 133, 39, 38, 39, 138, 0, 0, 0, 0, 0, 0, 0, 0, 237, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 185, 186, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 239, 240, 0, 221, 222, 223, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 141, 142, 141, 120, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 1, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 25, 0, 7, 33, 0, 0, 0, 0, 0, 0, 0, 108, 0, 0, 0, 0, 4, 5, 0, 0, 37, 0, 139, 0, 0, 0, 0, 139, 141, 0, 0, 139, 0, 0, 0, 15, 16, 17, 18, 0, 49, 0, 140, 0, 0, 0, 0, 140, 7, 0, 0, 140, 0, 0, 0, 27, 28, 29, 30, 0, 61, 0, 115, 93, 0, 0, 0, 0, 0, 0, 0, 0, 175, 176, 0, 0, 40, 41, 42, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 175, 93, 0, 0, 0, 0, 115, 141, 141, 142, 141, 142, 141, 184, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 196, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0];
        barriers = [];
        barriers[0] = [486, 0, 482, 231, 251, 231, 96, 532, 102, 641, 250, 921, 648, 923, 869, 1035, 870, 1151];
        barriers[1] = [790, 0, 790, 240, 667, 485, 666, 628, 1173, 889, 1174, 1151];
        barriers[2] = [413, 528, 499, 542, 500, 627, 410, 626, 408, 525];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 847, 980, 828, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 841, 247, 822, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 839, 738, 806));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 807, 900, 788, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 764, 818, 745, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 743, 613, 710));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 742, 200, 723, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 605, 583, 572));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 453, 587, 420));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 291, 355, 272, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 291, 438, 272, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 170, 696, 138));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 949, 777, 930, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 938, 1014, 892, 62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 911, 688, 892, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 885, 275, 813, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 791, 467, 758));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 737, 318, 704));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 598, 255, 565));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 442, 321, 409));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 391, 537, 359));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 362, 233, 343, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 354, 691, 282, -62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 295, 277, 276, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 84, 750, 65, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 84, 527, 65, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1059, 1131, 1040, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 976, 1131, 957, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 887, 861, 828, -62, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 747, 299, 715));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 646, 584, 627, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 642, 152, 623, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 555, 152, 536, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 511, 259, 478));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 476, 630, 404, -62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 396, 343, 363));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 366, 493, 333));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 278, 618, 245));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 175, 529, 156, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 84, 529, 65, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 2, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [70, 71, 44, 45, 46, 47, 44, 45, 97, 131, 113, 102, 68, 69, 46, 47, 44, 45, 70, 71, 82, 83, 56, 57, 58, 59, 56, 57, 109, 113, 113, 114, 80, 81, 58, 59, 56, 57, 82, 83, 46, 47, 68, 69, 70, 71, 68, 69, 97, 144, 113, 88, 77, 71, 70, 71, 68, 69, 46, 47, 58, 59, 80, 81, 82, 83, 80, 81, 109, 113, 113, 131, 89, 90, 82, 83, 80, 81, 58, 59, 70, 71, 46, 47, 44, 45, 46, 47, 121, 122, 144, 113, 113, 88, 151, 152, 70, 71, 70, 71, 82, 83, 58, 59, 56, 57, 58, 59, 82, 134, 123, 113, 143, 113, 113, 164, 165, 166, 82, 83, 44, 45, 70, 71, 46, 47, 44, 45, 46, 47, 193, 194, 195, 113, 144, 113, 113, 178, 44, 45, 56, 57, 82, 83, 58, 59, 56, 57, 58, 59, 82, 83, 207, 208, 123, 113, 113, 114, 56, 57, 68, 69, 46, 47, 70, 71, 68, 69, 70, 71, 68, 69, 46, 47, 97, 113, 131, 102, 68, 69, 80, 81, 58, 59, 82, 83, 80, 81, 82, 83, 80, 81, 58, 59, 109, 113, 113, 114, 80, 81];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 2, 0, 153, 154, 221, 222, 223, 140, 0, 0, 0, 0, 140, 0, 197, 156, 161, 162, 0, 155, 14, 0, 0, 0, 233, 234, 235, 139, 0, 0, 0, 0, 115, 176, 0, 168, 173, 174, 0, 167, 26, 0, 219, 220, 0, 0, 0, 115, 93, 0, 0, 0, 0, 34, 103, 180, 185, 186, 0, 179, 0, 0, 231, 232, 0, 4, 5, 0, 103, 0, 0, 0, 0, 0, 0, 175, 176, 0, 0, 191, 0, 0, 0, 224, 15, 16, 17, 18, 115, 93, 0, 0, 0, 0, 0, 0, 163, 175, 176, 203, 161, 162, 0, 236, 27, 28, 29, 30, 0, 183, 184, 0, 0, 0, 0, 0, 0, 0, 140, 215, 173, 174, 0, 0, 0, 40, 41, 42, 198, 0, 0, 183, 184, 196, 0, 0, 0, 0, 139, 0, 185, 186, 0, 0, 197, 0, 227, 228, 0, 221, 222, 223, 0, 140, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 239, 240, 0, 233, 234, 235, 0, 139, 0, 0, 0, 0, 139, 0];
        barriers = [];
        barriers[0] = [486, 0, 485, 194, 596, 393, 869, 518, 870, 639];
        barriers[1] = [790, 0, 796, 134, 997, 286, 1177, 378, 1174, 639];
        settings = [];
        objects = [];
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 427, 953, 395));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 250, 858, 231, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 187, 785, 168, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 163, 525, 144, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 93, 523, 74, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 458, 1088, 412, -45));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 372, 642, 304, -45));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 250, 858, 231, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 187, 785, 168, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 163, 525, 144, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 128, 644, 96));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 93, 523, 74, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        blocks.push(new GameMap.MapBlock(blockId++, 1, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [68, 69, 97, 113, 113, 102, 46, 47, 44, 45, 46, 47, 68, 69, 70, 71, 44, 45, 68, 69, 80, 81, 109, 113, 131, 114, 58, 59, 56, 57, 58, 59, 80, 81, 82, 83, 56, 57, 80, 81, 70, 71, 97, 132, 113, 22, 11, 71, 70, 71, 70, 71, 44, 45, 68, 69, 68, 69, 70, 71, 82, 83, 109, 113, 113, 113, 23, 83, 82, 83, 82, 83, 56, 57, 80, 81, 80, 81, 82, 83, 68, 69, 79, 113, 100, 113, 35, 36, 46, 47, 68, 69, 70, 71, 44, 45, 46, 47, 68, 69, 80, 81, 91, 92, 99, 98, 113, 48, 58, 59, 80, 81, 82, 83, 56, 57, 58, 59, 80, 81, 44, 45, 70, 104, 113, 113, 113, 88, 77, 71, 68, 69, 46, 47, 70, 71, 70, 71, 44, 45, 56, 57, 82, 116, 105, 113, 113, 131, 89, 90, 80, 81, 58, 59, 82, 83, 82, 83, 56, 57, 70, 71, 44, 45, 121, 122, 132, 113, 113, 88, 151, 152, 70, 71, 46, 47, 68, 69, 70, 71, 82, 83, 56, 57, 82, 134, 123, 113, 131, 113, 113, 164, 165, 166, 58, 59, 80, 81, 82, 83, 68, 69, 46, 47, 46, 47, 193, 194, 195, 113, 143, 113, 113, 177, 77, 71, 44, 45, 46, 47, 80, 81, 58, 59, 58, 59, 82, 83, 207, 208, 123, 113, 98, 100, 89, 90, 56, 57, 58, 59, 70, 71, 44, 45, 68, 69, 68, 69, 46, 47, 121, 122, 113, 98, 113, 22, 11, 71, 70, 71, 82, 83, 56, 57, 80, 81, 80, 81, 58, 59, 82, 134, 123, 113, 113, 113, 23, 83, 82, 83, 68, 69, 68, 69, 70, 71, 68, 69, 44, 45, 46, 47, 79, 113, 113, 131, 35, 36, 44, 45, 80, 81, 80, 81, 82, 83, 80, 81, 56, 57, 58, 59, 91, 92, 113, 113, 113, 48, 56, 57, 44, 45, 46, 47, 68, 69, 70, 71, 44, 45, 68, 69, 70, 104, 113, 113, 132, 102, 68, 69, 56, 57, 58, 59, 80, 81, 82, 83, 56, 57, 80, 81, 82, 116, 105, 131, 113, 114, 80, 81, 70, 71, 70, 71, 44, 45, 68, 69, 68, 69, 70, 71, 44, 45, 97, 113, 132, 102, 70, 71, 82, 83, 82, 83, 56, 57, 80, 81, 80, 81, 82, 83, 56, 57, 109, 113, 113, 114, 82, 83];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 227, 228, 0, 221, 222, 223, 0, 153, 232, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 239, 240, 0, 233, 234, 235, 0, 0, 0, 0, 0, 73, 101, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 0, 111, 0, 63, 78, 0, 0, 0, 219, 220, 0, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 112, 0, 0, 50, 0, 0, 0, 231, 232, 0, 0, 0, 0, 153, 154, 0, 145, 161, 162, 0, 133, 38, 39, 138, 0, 0, 198, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 4, 5, 0, 0, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 1, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 73, 110, 101, 78, 0, 40, 41, 42, 13, 146, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 111, 0, 0, 50, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 133, 52, 0, 62, 0, 0, 0, 0, 37, 219, 220, 0, 0, 0, 239, 240, 0, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 49, 231, 232, 0, 0, 0, 0, 0, 0, 213, 214, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 4, 5, 0, 0, 0, 197, 0, 225, 226, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 237, 238, 205, 206, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 221, 222, 223, 0, 0, 217, 218, 0, 0, 0, 0, 0, 0, 0, 219, 0, 40, 41, 42, 0, 233, 234, 235, 0, 0, 229, 230, 0, 0, 0, 0, 0, 0, 0, 231, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 128, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 163, 175, 196, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 184, 196, 0, 0, 0, 0, 0, 0, 175, 196, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 0, 115, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 34, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0];
        barriers = [];
        barriers[0] = [406, 0, 410, 140, 563, 437, 652, 507, 904, 630, 1049, 763, 1180, 1031, 1174, 1279];
        barriers[1] = [102, 0, 102, 254, 235, 500, 400, 676, 704, 827, 874, 1142, 870, 1279];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1185, 1135, 1166, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1094, 1135, 1075, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1016, 964, 983));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 888, 908, 855));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 875, 770, 856, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 806, 705, 787, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 765, 822, 732));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 686, 697, 653));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 439, 345, 407));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 266, 414, 247, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 190, 382, 171, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 1073, 886, 1001, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 869, 892, 836));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 761, 787, 728));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 756, 956, 737, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 699, 888, 680, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 688, 655, 655));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 622, 530, 589));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 605, 371, 586, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 520, 519, 474, -45));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 519, 414, 486));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 516, 279, 497, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 385, 209, 366, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 271, 152, 252, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 270, 290, 238));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 116, 366, 97, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 46, 367, 27, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1160, 1133, 1141, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1051, 1137, 1032, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1050, 862, 1031, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 949, 812, 930, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 819, 875, 787));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 728, 694, 669, -62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 646, 403, 627, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 480, 394, 447));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 381, 482, 362, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 367, 307, 334));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 232, 270, 199));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 231, 406, 212, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [68, 69, 97, 113, 113, 102, 46, 47, 44, 45, 46, 47, 68, 69, 97, 113, 113, 102, 68, 69, 80, 81, 109, 113, 113, 114, 58, 59, 56, 57, 58, 59, 80, 81, 109, 113, 132, 114, 80, 81, 70, 71, 97, 113, 132, 22, 11, 71, 70, 71, 70, 71, 70, 74, 87, 113, 125, 126, 70, 71, 82, 83, 109, 113, 113, 113, 23, 83, 82, 83, 82, 83, 85, 86, 113, 124, 137, 83, 82, 83, 68, 69, 79, 144, 113, 143, 35, 36, 46, 47, 70, 8, 21, 113, 144, 84, 46, 47, 68, 69, 80, 81, 91, 92, 113, 113, 113, 48, 58, 59, 82, 20, 113, 113, 95, 96, 58, 59, 80, 81, 44, 45, 70, 104, 113, 98, 113, 88, 77, 71, 31, 32, 113, 113, 107, 71, 70, 71, 44, 45, 56, 57, 82, 116, 105, 113, 100, 113, 89, 90, 43, 113, 113, 106, 119, 83, 82, 83, 56, 57, 70, 71, 44, 45, 121, 122, 113, 98, 113, 88, 87, 113, 132, 102, 46, 47, 68, 69, 70, 71, 82, 83, 56, 57, 82, 134, 123, 113, 113, 113, 144, 113, 113, 114, 58, 59, 80, 81, 82, 83, 68, 69, 46, 47, 46, 47, 193, 194, 195, 143, 113, 113, 113, 88, 77, 71, 44, 45, 46, 47, 80, 81, 58, 59, 58, 59, 82, 83, 207, 208, 123, 144, 113, 143, 89, 90, 56, 57, 58, 59, 70, 71, 44, 45, 68, 69, 68, 69, 46, 47, 121, 122, 113, 113, 113, 22, 11, 71, 70, 71, 82, 83, 56, 57, 80, 81, 80, 81, 58, 59, 82, 134, 123, 131, 113, 113, 23, 83, 82, 83, 68, 69, 68, 69, 70, 71, 68, 69, 44, 45, 46, 47, 121, 122, 113, 132, 35, 36, 44, 45, 80, 81, 80, 81, 82, 83, 80, 81, 56, 57, 58, 59, 82, 134, 123, 113, 113, 48, 56, 57, 44, 45, 46, 47, 68, 69, 70, 71, 44, 45, 68, 69, 46, 47, 97, 113, 143, 102, 68, 69, 56, 57, 58, 59, 80, 81, 82, 83, 56, 57, 80, 81, 58, 59, 109, 113, 113, 114, 80, 81, 70, 71, 70, 71, 44, 45, 68, 69, 68, 69, 70, 71, 44, 45, 97, 132, 113, 102, 70, 71, 82, 83, 82, 83, 56, 57, 80, 81, 80, 81, 82, 83, 56, 57, 109, 113, 113, 114, 82, 83];
        map[1] = [223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 235, 0, 0, 0, 0, 0, 0, 0, 0, 156, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 220, 0, 0, 0, 0, 0, 0, 0, 198, 180, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 0, 0, 0, 0, 73, 101, 78, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 222, 223, 0, 0, 111, 0, 63, 78, 0, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 234, 235, 0, 0, 133, 52, 0, 63, 78, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 133, 52, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 0, 0, 197, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 231, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 220, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 0, 233, 234, 235, 4, 5, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 27, 28, 29, 30, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 0, 0, 40, 41, 42, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 26, 0, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 0, 37, 0, 227, 228, 0, 231, 232, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 233, 0, 49, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 139, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 140, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 94, 33, 0, 0, 0, 94, 19, 0, 0, 139, 0, 0, 0, 0, 0, 12, 0, 0, 0, 94, 33, 0, 0, 0, 171, 188, 0, 0, 0, 115, 93, 0, 0, 0, 0, 24, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 34, 12, 0, 7, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 24, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 128, 33, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 184, 196, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0];
        barriers = [];
        barriers[0] = [406, 0, 407, 130, 561, 438, 628, 497, 746, 244, 868, 126, 870, 0];
        barriers[1] = [102, 0, 99, 242, 225, 483, 394, 670, 708, 828, 873, 1138, 870, 1279];
        barriers[2] = [1174, 0, 1178, 139, 1011, 303, 918, 503, 917, 634, 1067, 800, 1172, 1021, 1174, 1279];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1169, 1134, 1150, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1069, 1134, 1050, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 945, 1014, 873, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 741, 839, 709));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 739, 625, 720, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 575, 471, 542));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 559, 624, 540, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 476, 832, 404, 25));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 472, 375, 439));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 353, 315, 320));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 331, 189, 312, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 261, 152, 242, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 178, 150, 159, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 136, 1125, 117, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 924, 1073, 905, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 869, 905, 837));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 831, 1028, 812, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 746, 628, 727, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 705, 537, 686, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 622, 711, 589));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 601, 834, 569, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 480, 776, 447));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 364, 407, 292, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 350, 865, 317));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 238, 961, 205));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 145, 1134, 126, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 117, 174, 85, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 58, 1131, 39, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 3, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [70, 71, 68, 69, 70, 71, 46, 47, 44, 45, 70, 71, 44, 45, 97, 113, 131, 102, 70, 71, 82, 83, 80, 81, 82, 83, 58, 59, 56, 57, 82, 83, 56, 57, 109, 113, 113, 114, 82, 83, 68, 69, 70, 71, 68, 69, 44, 45, 70, 71, 70, 71, 147, 148, 87, 113, 113, 102, 44, 45, 80, 81, 82, 83, 80, 81, 56, 57, 82, 83, 157, 158, 159, 113, 132, 113, 113, 190, 56, 57, 44, 45, 44, 45, 44, 45, 70, 71, 147, 148, 170, 144, 113, 113, 113, 200, 201, 202, 68, 69, 56, 57, 56, 57, 56, 57, 157, 158, 159, 131, 113, 113, 132, 124, 211, 212, 82, 83, 80, 81, 46, 47, 70, 71, 147, 148, 170, 113, 113, 113, 113, 113, 125, 126, 70, 71, 68, 69, 44, 45, 58, 59, 157, 158, 159, 113, 113, 113, 132, 189, 123, 124, 137, 83, 82, 83, 80, 81, 56, 57, 70, 71, 169, 113, 113, 113, 113, 200, 201, 202, 97, 102, 46, 47, 68, 69, 46, 47, 46, 47, 82, 83, 109, 113, 113, 124, 211, 212, 82, 83, 65, 66, 58, 59, 80, 81, 58, 59, 58, 59, 68, 69, 97, 131, 113, 102, 46, 47, 46, 47, 68, 69, 70, 71, 46, 47, 70, 71, 70, 71, 80, 81, 109, 113, 113, 114, 58, 59, 58, 59, 80, 81, 82, 83, 58, 59, 82, 83, 82, 83, 44, 45, 97, 113, 113, 102, 70, 71, 44, 45, 46, 47, 44, 45, 70, 71, 68, 69, 44, 45, 56, 57, 109, 113, 113, 114, 82, 83, 56, 57, 58, 59, 56, 57, 82, 83, 80, 81, 56, 57, 68, 69, 97, 113, 113, 88, 151, 152, 70, 71, 70, 71, 68, 69, 68, 69, 44, 45, 46, 47, 80, 81, 109, 113, 113, 113, 113, 164, 165, 166, 82, 83, 80, 81, 80, 81, 56, 57, 58, 59, 46, 47, 97, 113, 113, 113, 113, 113, 113, 177, 151, 152, 70, 71, 70, 71, 44, 45, 70, 71, 58, 59, 109, 113, 113, 124, 182, 113, 131, 113, 113, 88, 165, 166, 82, 83, 56, 57, 82, 83, 70, 71, 97, 113, 132, 102, 193, 194, 195, 113, 113, 113, 113, 177, 151, 152, 70, 71, 44, 45, 82, 83, 109, 113, 113, 114, 82, 83, 207, 208, 182, 113, 113, 113, 113, 164, 165, 166, 56, 57, 68, 69, 97, 113, 132, 102, 46, 47, 44, 45, 193, 194, 195, 113, 113, 113, 113, 178, 68, 69, 80, 81, 109, 113, 113, 114, 58, 59, 56, 57, 82, 83, 207, 208, 123, 113, 113, 114, 80, 81, 44, 45, 97, 132, 113, 102, 44, 45, 70, 71, 68, 69, 68, 69, 97, 113, 113, 102, 70, 71, 56, 57, 109, 113, 113, 114, 56, 57, 82, 83, 80, 81, 80, 81, 109, 113, 132, 114, 82, 83];
        map[1] = [222, 223, 0, 219, 220, 0, 0, 3, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 234, 235, 0, 231, 232, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 0, 73, 101, 110, 78, 0, 0, 153, 154, 0, 221, 222, 223, 0, 40, 41, 42, 0, 0, 0, 0, 111, 100, 99, 50, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 112, 98, 51, 138, 0, 161, 162, 73, 101, 110, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 39, 138, 0, 153, 173, 174, 112, 98, 100, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 185, 186, 111, 99, 98, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 221, 222, 0, 0, 111, 100, 51, 138, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 233, 234, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 205, 206, 0, 0, 0, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 0, 73, 110, 101, 78, 0, 0, 0, 0, 0, 0, 0, 0, 229, 230, 0, 0, 0, 220, 0, 0, 111, 99, 98, 63, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 232, 0, 73, 64, 100, 99, 99, 50, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 13, 14, 0, 0, 111, 98, 99, 98, 51, 138, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 25, 26, 0, 0, 133, 39, 38, 39, 138, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 37, 0, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 49, 0, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 110, 101, 78, 0, 0, 0, 0, 0, 154, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 111, 98, 99, 63, 101, 78, 0, 0, 221, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 133, 52, 98, 100, 98, 50, 0, 0, 233, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 133, 39, 38, 39, 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 199, 187, 160, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 199, 187, 188, 0, 0, 0, 0, 0, 0, 171, 172, 160, 0, 0, 0, 0, 0, 0, 0, 171, 188, 0, 0, 0, 0, 0, 0, 94, 172, 160, 0, 0, 0, 0, 0, 0, 0, 0, 7, 160, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 171, 139, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 171, 172, 160, 140, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 139, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 140, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 227, 228, 140, 0, 0, 139, 213, 214, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 239, 240, 139, 0, 0, 140, 225, 226, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 163, 175, 176, 140, 0, 0, 140, 237, 238, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 163, 127, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 164, 163, 175, 176, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 199, 196, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 183, 184, 196, 0, 0, 0, 0, 0, 0, 163, 175, 196, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 183, 184, 196, 0, 0, 0, 0, 0, 0, 140, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 183, 184, 196, 0, 0, 0, 0, 139, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0];
        barriers = [];
        barriers[0] = [409, 626, 411, 885, 613, 1000, 614, 523, 411, 626];
        barriers[1] = [406, 1535, 406, 1184, 868, 1412, 870, 1535];
        barriers[2] = [870, 0, 871, 122, 103, 506, 102, 1535];
        barriers[3] = [1174, 0, 1172, 248, 945, 373, 818, 472, 789, 534, 789, 1085, 1172, 1281, 1174, 1535];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1486, 313, 1422, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1356, 139, 1337, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1347, 801, 1288, -62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1300, 191, 1281, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1245, 982, 1226, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1208, 915, 1189, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1052, 703, 1033, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 952, 261, 919));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 816, 371, 797, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 807, 228, 774));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 751, 332, 732, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 662, 227, 629));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 529, 315, 496));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 342, 628, 323, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 336, 553, 317, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 307, 888, 275));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 209, 1139, 190, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 140, 1141, 121, 0, obsTireColor1));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1346, 195, 1282, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1300, 697, 1281, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1286, 928, 1227, -62, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1269, 636, 1250, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1163, 395, 1144, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1105, 394, 1086, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 1037, 675, 1004));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 916, 148, 897, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 898, 722, 865));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 872, 360, 840, 0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 764, 674, 731));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 619, 723, 586));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 543, 149, 524, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 475, 463, 416, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 253, 859, 221));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 4));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [44, 45, 46, 47, 68, 69, 44, 45, 97, 113, 113, 102, 44, 45, 68, 69, 44, 45, 46, 47, 56, 57, 58, 59, 80, 81, 56, 57, 109, 113, 113, 114, 56, 57, 80, 81, 56, 57, 58, 59, 46, 47, 70, 71, 70, 71, 68, 69, 97, 113, 131, 102, 68, 69, 70, 71, 46, 47, 70, 71, 58, 59, 82, 83, 82, 83, 80, 81, 109, 113, 113, 114, 80, 81, 82, 83, 58, 59, 82, 83, 68, 69, 44, 45, 44, 45, 70, 74, 87, 100, 143, 88, 77, 71, 46, 47, 68, 69, 44, 45, 80, 81, 56, 57, 56, 57, 85, 86, 131, 98, 100, 99, 89, 90, 58, 59, 0, 81, 56, 57, 70, 71, 68, 69, 70, 74, 87, 113, 125, 126, 121, 98, 143, 88, 77, 71, 70, 71, 68, 69, 82, 83, 80, 81, 85, 86, 144, 124, 137, 83, 82, 134, 123, 113, 89, 90, 82, 83, 80, 81, 46, 47, 70, 8, 21, 131, 113, 84, 46, 47, 44, 45, 79, 113, 131, 22, 11, 71, 70, 71, 58, 59, 82, 20, 113, 113, 95, 96, 58, 59, 56, 57, 91, 92, 113, 113, 23, 83, 82, 83, 70, 71, 31, 32, 113, 143, 107, 71, 70, 71, 46, 47, 70, 104, 113, 143, 35, 36, 44, 45, 82, 83, 43, 113, 113, 106, 119, 83, 82, 83, 58, 59, 82, 116, 105, 113, 113, 48, 56, 57, 44, 45, 97, 113, 143, 102, 68, 69, 44, 45, 70, 71, 68, 69, 97, 131, 113, 102, 68, 69, 56, 57, 109, 113, 113, 114, 80, 81, 56, 57, 82, 83, 80, 81, 109, 113, 113, 114, 80, 81];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 110, 78, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 219, 220, 221, 222, 223, 0, 0, 112, 0, 63, 110, 78, 0, 15, 16, 17, 18, 0, 0, 0, 231, 232, 233, 234, 235, 0, 0, 111, 0, 0, 0, 50, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 39, 52, 0, 62, 0, 0, 40, 41, 42, 0, 0, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 133, 38, 138, 0, 0, 0, 0, 0, 0, 1, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 49, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 227, 228, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 153, 154, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 129, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 153, 0, 0, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 129, 0, 0, 0, 130, 12, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 199, 120, 0, 0, 0, 108, 160, 163, 12, 0, 0, 0, 127, 93, 197, 0, 0, 0, 0, 0, 129, 0, 0, 0, 94, 120, 219, 220, 115, 93, 0, 0, 0, 103, 0, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 231, 232, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 221, 222, 223, 93, 0, 0, 0, 24, 0, 0, 0, 7, 0, 0, 0, 0, 108, 0, 205, 206, 233, 234, 235, 103, 0, 0, 0, 0, 12, 0, 0, 139, 0, 0, 0, 0, 139, 0, 217, 218, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 140, 0, 0, 0, 0, 140, 0, 229, 230, 0, 197, 0, 139, 0, 0, 0, 0, 140, 0];
        barriers = [];
        barriers[0] = [486, 0, 486, 280, 234, 524, 99, 767, 102, 895];
        barriers[1] = [406, 895, 407, 754, 510, 536, 612, 403, 649, 406, 757, 523, 867, 753, 870, 895];
        barriers[2] = [790, 0, 787, 264, 1044, 543, 1171, 743, 1174, 895];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 865, 913, 846, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 859, 364, 840, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 744, 916, 672, -25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 744, 352, 672, 25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 548, 994, 529, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 530, 289, 511, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 266, 744, 247, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 170, 534, 151, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 169, 745, 150, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 130, 656, 98));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 72, 530, 53, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [68, 69, 97, 113, 113, 102, 44, 45, 70, 71, 68, 69, 70, 71, 68, 69, 46, 47, 68, 69, 80, 81, 109, 113, 113, 114, 56, 57, 82, 83, 80, 81, 82, 83, 80, 81, 58, 59, 80, 81, 46, 47, 97, 113, 113, 102, 68, 69, 46, 47, 68, 69, 70, 71, 70, 71, 68, 69, 70, 71, 58, 59, 109, 113, 113, 114, 80, 81, 58, 59, 80, 81, 82, 83, 82, 83, 80, 81, 82, 83, 46, 47, 79, 113, 113, 102, 46, 47, 70, 71, 68, 69, 70, 71, 68, 69, 68, 69, 46, 47, 58, 59, 91, 92, 113, 114, 58, 59, 82, 83, 80, 81, 82, 83, 80, 81, 80, 81, 58, 59, 0, 69, 70, 104, 113, 102, 70, 71, 46, 47, 68, 69, 70, 71, 70, 71, 70, 71, 68, 69, 80, 81, 82, 116, 105, 114, 82, 83, 58, 59, 80, 81, 82, 83, 0, 83, 82, 83, 80, 81, 44, 45, 44, 45, 97, 88, 77, 71, 70, 71, 70, 71, 46, 47, 46, 47, 46, 47, 68, 69, 56, 57, 56, 57, 109, 113, 89, 90, 82, 83, 82, 83, 58, 59, 58, 59, 58, 59, 80, 81, 68, 69, 70, 71, 97, 113, 113, 88, 77, 71, 44, 45, 70, 71, 44, 45, 70, 71, 46, 47, 80, 81, 82, 83, 109, 124, 123, 113, 89, 90, 56, 57, 82, 83, 56, 57, 82, 83, 58, 59, 46, 47, 46, 47, 97, 102, 121, 122, 113, 88, 151, 152, 70, 71, 68, 69, 44, 45, 46, 47, 58, 59, 58, 59, 109, 114, 82, 134, 123, 113, 113, 164, 165, 166, 80, 81, 56, 57, 58, 59, 46, 47, 70, 74, 87, 102, 70, 71, 193, 194, 195, 113, 113, 177, 77, 71, 68, 69, 68, 69, 58, 59, 85, 86, 113, 114, 82, 83, 82, 83, 207, 208, 123, 113, 89, 90, 80, 81, 80, 81, 68, 69, 97, 113, 113, 102, 44, 45, 46, 47, 44, 45, 121, 122, 113, 88, 77, 71, 70, 71, 80, 81, 109, 113, 113, 114, 56, 57, 58, 59, 56, 57, 82, 134, 123, 113, 89, 90, 82, 83, 68, 69, 97, 113, 113, 102, 68, 69, 70, 71, 68, 69, 70, 71, 97, 113, 113, 102, 68, 69, 80, 81, 109, 113, 113, 114, 80, 81, 82, 83, 80, 81, 82, 83, 109, 113, 113, 114, 80, 81];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 220, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 1, 2, 0, 0, 0, 231, 232, 221, 222, 232, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 13, 14, 0, 153, 154, 0, 0, 233, 234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 26, 0, 0, 0, 0, 0, 0, 0, 5, 6, 0, 0, 0, 0, 0, 227, 228, 198, 0, 37, 0, 0, 221, 222, 223, 0, 0, 205, 17, 18, 0, 0, 0, 0, 0, 239, 240, 0, 0, 49, 0, 0, 233, 234, 235, 0, 0, 217, 29, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 0, 0, 0, 0, 213, 214, 229, 41, 42, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 225, 226, 0, 0, 219, 220, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 0, 0, 0, 237, 238, 0, 192, 231, 232, 0, 0, 0, 0, 0, 0, 0, 224, 0, 156, 161, 162, 0, 0, 0, 0, 0, 204, 0, 0, 0, 0, 0, 0, 0, 0, 0, 236, 0, 168, 173, 174, 0, 0, 221, 222, 223, 216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 0, 233, 234, 235, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 0, 0, 234, 235, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 206, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 218, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 230, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 115, 93, 0, 0, 140, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 139, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 24, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 127, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 163, 175, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 0, 0, 108, 128, 0, 0, 0, 0, 163, 175, 196, 0, 0, 0, 0, 0, 0, 0, 129, 160, 0, 0, 139, 163, 184, 196, 0, 0, 0, 0, 127, 93, 0, 0, 0, 0, 0, 7, 160, 0, 0, 0, 140, 0, 0, 183, 184, 196, 0, 0, 0, 127, 196, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 183, 184, 0, 0, 0, 128, 0, 0, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 127, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 103, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0];
        barriers = [];
        barriers[0] = [102, 0, 100, 244, 229, 500, 228, 879, 143, 939, 99, 1035, 102, 1279];
        barriers[1] = [406, 0, 407, 515, 461, 597, 614, 737, 871, 859, 1174, 1186, 1174, 1279];
        barriers[2] = [406, 1279, 405, 890, 432, 840, 472, 849, 525, 930, 822, 1074, 876, 1132, 870, 1279];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1224, 322, 1160, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1188, 1124, 1169, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 993, 771, 960));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 925, 623, 892));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 876, 777, 857, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 828, 516, 795));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 730, 477, 662, 45));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 695, 267, 676, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 597, 267, 578, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 289, 230, 257));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 230, 325, 166, 0, obsSpeedBar1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 91, 146, 72, 0, obsTireColor0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 1));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        difficulties = [];
        map = [];
        map[0] = [70, 71, 97, 113, 131, 102, 44, 45, 46, 47, 68, 69, 70, 71, 97, 113, 131, 102, 68, 69, 82, 83, 109, 113, 113, 114, 56, 57, 58, 59, 80, 81, 82, 83, 109, 113, 113, 114, 80, 81, 68, 69, 97, 131, 113, 102, 68, 69, 44, 45, 46, 47, 68, 69, 97, 144, 113, 102, 46, 47, 80, 81, 67, 113, 113, 114, 80, 81, 56, 57, 58, 59, 80, 81, 109, 113, 131, 72, 58, 59, 44, 45, 79, 113, 132, 22, 11, 71, 68, 69, 46, 47, 70, 8, 32, 113, 113, 84, 70, 71, 56, 57, 91, 92, 113, 113, 23, 83, 80, 81, 58, 59, 82, 20, 113, 143, 95, 96, 82, 83, 46, 47, 70, 104, 113, 131, 35, 36, 46, 47, 68, 69, 31, 32, 113, 144, 107, 71, 68, 69, 58, 59, 82, 116, 105, 144, 113, 48, 58, 59, 80, 81, 43, 113, 132, 106, 119, 83, 80, 81, 70, 71, 70, 71, 121, 122, 143, 88, 151, 152, 147, 148, 87, 143, 125, 126, 46, 47, 44, 45, 82, 83, 82, 83, 82, 134, 123, 132, 113, 164, 159, 113, 131, 124, 137, 83, 58, 59, 56, 57, 68, 69, 44, 45, 46, 47, 121, 122, 113, 113, 144, 113, 125, 126, 44, 45, 68, 69, 68, 69, 80, 81, 56, 57, 58, 59, 85, 86, 131, 124, 123, 132, 89, 90, 56, 57, 80, 81, 80, 81, 44, 45, 68, 69, 70, 74, 87, 113, 125, 126, 121, 122, 113, 88, 77, 71, 70, 71, 46, 47, 56, 57, 80, 81, 85, 86, 132, 124, 137, 83, 82, 134, 123, 131, 89, 90, 82, 83, 58, 59, 68, 69, 70, 8, 21, 113, 113, 84, 44, 45, 46, 47, 79, 144, 113, 22, 11, 71, 70, 71, 80, 81, 82, 20, 113, 113, 95, 96, 56, 57, 58, 59, 91, 92, 113, 143, 23, 83, 82, 83, 46, 47, 31, 32, 113, 131, 107, 71, 44, 45, 46, 47, 70, 104, 113, 113, 35, 36, 68, 69, 58, 59, 43, 131, 113, 106, 119, 83, 56, 57, 58, 59, 82, 116, 105, 132, 113, 48, 80, 81, 70, 71, 55, 113, 143, 102, 68, 69, 68, 69, 70, 71, 46, 47, 97, 113, 144, 60, 44, 45, 82, 83, 109, 113, 113, 114, 80, 81, 80, 81, 82, 83, 58, 59, 109, 113, 113, 114, 56, 57, 68, 69, 97, 143, 113, 102, 44, 45, 46, 47, 44, 45, 46, 47, 97, 113, 113, 102, 44, 45, 80, 81, 109, 113, 113, 114, 56, 57, 58, 59, 56, 57, 58, 59, 109, 113, 113, 114, 56, 57];
        map[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 198, 156, 161, 162, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 168, 173, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 180, 185, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 222, 223, 0, 0, 0, 0, 0, 0, 0, 227, 228, 0, 0, 0, 0, 0, 0, 0, 221, 222, 234, 235, 0, 0, 0, 0, 0, 0, 0, 239, 240, 0, 0, 0, 0, 0, 0, 0, 233, 234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 231, 232, 0, 197, 0, 0, 219, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 221, 222, 223, 0, 0, 0, 0, 0, 0, 231, 232, 0, 0, 0, 0, 0, 0, 0, 0, 0, 233, 234, 235, 0, 0, 0, 222, 223, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 234, 235, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 16, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        map[2] = [0, 139, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 140, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 153, 154, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 140, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 19, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 0, 0, 7, 33, 0, 0, 0, 108, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 0, 103, 0, 0, 0, 34, 12, 0, 0, 7, 0, 0, 0, 0, 120, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 115, 141, 142, 33, 0, 0, 0, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 130, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 129, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 153, 154, 0, 0, 198, 198, 0, 130, 0, 0, 0, 129, 128, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 94, 129, 0, 0, 0, 108, 33, 0, 103, 0, 0, 0, 128, 93, 227, 228, 0, 0, 0, 0, 19, 0, 0, 0, 94, 120, 0, 0, 115, 93, 0, 0, 0, 24, 239, 240, 0, 161, 162, 7, 0, 0, 0, 0, 108, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 197, 173, 174, 19, 0, 0, 0, 94, 120, 0, 0, 0, 0, 115, 93, 0, 0, 0, 24, 0, 0, 185, 7, 0, 0, 0, 0, 108, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 12, 0, 0, 139, 0, 0, 0, 0, 139, 0, 0, 0, 0, 0, 0, 139, 0, 0, 0, 0, 139, 0, 192, 140, 0, 0, 0, 0, 140, 0, 0, 0, 221, 222, 223, 140, 0, 0, 0, 0, 153, 154, 204, 140, 0, 0, 0, 0, 139, 227, 228, 0, 233, 234, 235, 139, 0, 0, 0, 0, 140, 0, 216, 139, 0, 0, 0, 0, 140, 239, 240, 0, 0, 0, 0, 140, 0, 0, 0, 0, 139, 0];
        barriers = [];
        barriers[0] = [102, 0, 100, 252, 235, 501, 433, 682, 431, 717, 274, 876, 231, 890, 98, 1170, 102, 1407];
        barriers[1] = [1174, 0, 1179, 266, 1039, 480, 842, 697, 843, 720, 1006, 878, 1060, 915, 1173, 1144, 1174, 1407];
        barriers[2] = [406, 1407, 406, 1133, 559, 842, 627, 777, 657, 776, 744, 879, 870, 1142, 870, 1407];
        barriers[3] = [406, 0, 405, 266, 551, 533, 666, 556, 752, 499, 874, 236, 870, 0];
        settings = [];
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1286, 157, 1267, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1286, 211, 1267, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1188, 1129, 1169, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1187, 1066, 1168, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1132, 357, 1060, 25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 983, 835, 964, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 916, 804, 897, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 701, 663, 668));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 680, 490, 661, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 630, 568, 611, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 607, 765, 574));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 524, 281, 452, 62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 509, 862, 476));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 423, 971, 390));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 279, 951, 247, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 262, 1134, 243, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 244, 303, 180, 0, obsSpeedBar1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 122, 1023, 90));
        settings.push(new GameMap.MapBlockSettings(objects));
        objects = [];
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 1359, 966, 1291, 45));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 1323, 333, 1291, 0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1188, 1129, 1169, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 1173, 145, 1154, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.speedBar, 1111, 912, 1039, -25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 1059, 257, 987, -62));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 905, 494, 886, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 717, 611, 684));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 668, 773, 649, 0, obsTireColor1));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 643, 494, 610));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 624, 700, 605, 0, obsTireColor0));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 523, 436, 490));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 437, 268, 380, -25));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil2, 405, 1057, 333, -62));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.coin, 399, 377, 366));
        objects.push(new GameObjects.GameObjectData(GameObjects.eObjectType.bonus, GameObjects.eBonusType.energy, 256, 235, 224));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 139, 145, 120, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 139, 368, 120, 0, obsTireColor1));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.tire, 139, 308, 120, 0, obsTireColor0));
        objects.push(new GameObjects.ObstacleData(GameObjects.eObstacleType.oil1, 120, 941, 88, 0));
        settings.push(new GameMap.MapBlockSettings(objects));
        difficulties.push(new GameMap.MapBlockDifficulty(settings, 2));
        blocks.push(new GameMap.MapBlock(blockId++, 0, map, barriers, difficulties));
        blocks[0].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[1].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[2].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[3].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[4].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[5].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[6].setConnections([blocks[20], blocks[21], blocks[22], blocks[23], blocks[24], blocks[25], blocks[26], blocks[27], blocks[28]]);
        blocks[7].setConnections([blocks[20], blocks[21], blocks[22], blocks[23], blocks[24], blocks[25], blocks[26], blocks[27], blocks[28]]);
        blocks[8].setConnections([blocks[11], blocks[12], blocks[13], blocks[14], blocks[15], blocks[16], blocks[17], blocks[18], blocks[19]]);
        blocks[9].setConnections([blocks[11], blocks[12], blocks[13], blocks[14], blocks[15], blocks[16], blocks[17], blocks[18], blocks[19]]);
        blocks[10].setConnections([blocks[29], blocks[30], blocks[31], blocks[32]]);
        blocks[11].setConnections([blocks[20], blocks[21], blocks[22], blocks[23], blocks[24], blocks[25], blocks[26], blocks[27], blocks[28]]);
        blocks[12].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[13].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[14].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[15].setConnections([blocks[11], blocks[12], blocks[13], blocks[14], blocks[15], blocks[16], blocks[17], blocks[18], blocks[19]]);
        blocks[16].setConnections([blocks[11], blocks[12], blocks[13], blocks[14], blocks[15], blocks[16], blocks[17], blocks[18], blocks[19]]);
        blocks[17].setConnections([blocks[11], blocks[12], blocks[13], blocks[14], blocks[15], blocks[16], blocks[17], blocks[18], blocks[19]]);
        blocks[18].setConnections([blocks[11], blocks[12], blocks[13], blocks[14], blocks[15], blocks[16], blocks[17], blocks[18], blocks[19]]);
        blocks[19].setConnections([blocks[29], blocks[30], blocks[31], blocks[32]]);
        blocks[20].setConnections([blocks[20], blocks[21], blocks[22], blocks[23], blocks[24], blocks[25], blocks[26], blocks[27], blocks[28]]);
        blocks[21].setConnections([blocks[20], blocks[21], blocks[22], blocks[23], blocks[24], blocks[25], blocks[26], blocks[27], blocks[28]]);
        blocks[22].setConnections([blocks[20], blocks[21], blocks[22], blocks[23], blocks[24], blocks[25], blocks[26], blocks[27], blocks[28]]);
        blocks[23].setConnections([blocks[20], blocks[21], blocks[22], blocks[23], blocks[24], blocks[25], blocks[26], blocks[27], blocks[28]]);
        blocks[24].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[25].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[26].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[27].setConnections([blocks[11], blocks[12], blocks[13], blocks[14], blocks[15], blocks[16], blocks[17], blocks[18], blocks[19]]);
        blocks[28].setConnections([blocks[29], blocks[30], blocks[31], blocks[32]]);
        blocks[29].setConnections([blocks[20], blocks[21], blocks[22], blocks[23], blocks[24], blocks[25], blocks[26], blocks[27], blocks[28]]);
        blocks[30].setConnections([blocks[0], blocks[1], blocks[2], blocks[3], blocks[4], blocks[5], blocks[6], blocks[7], blocks[8], blocks[9], blocks[10]]);
        blocks[31].setConnections([blocks[11], blocks[12], blocks[13], blocks[14], blocks[15], blocks[16], blocks[17], blocks[18], blocks[19]]);
        blocks[32].setConnections([blocks[29], blocks[30], blocks[31], blocks[32]]);
        return blocks;
    }
    GameMap.initMapBlocks = initMapBlocks;
})(GameMap || (GameMap = {}));
var GameMap;
(function (GameMap) {
    var Map = (function () {
        function Map() {
            Map._instance = this;
            this._path = new GameMap.PathGenerator();
            this._tilesetTerrainData = new GameMap.TilesetTerrainData();
            this._barrierBody = new Phaser.Physics.Box2D.Body(Game.Global.game, null, 0, 0, 0);
            this._barrierBody.friction = 0.1;
            this._barrierBody.restitution = 0.1;
            this._barrierBodyColFilter = new box2d.b2Filter();
            this._barrierBodyColFilter.categoryBits = 0x08;
            this._barrierBodyColFilter.maskBits = 0x0B;
        }
        Object.defineProperty(Map, "instance", {
            get: function () { return this._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "path", {
            get: function () { return this._path; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "barrierBody", {
            get: function () { return this._barrierBody; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "barrierBodyColFilter", {
            get: function () { return this._barrierBodyColFilter; },
            enumerable: true,
            configurable: true
        });
        Map.prototype.reset = function () {
            this._barrierBody.clearFixtures();
            this._path.reset(true);
        };
        Map.prototype.getTerrainData = function (mapView, x, y) {
            var row = Math.floor(y / Map.TILE_H);
            var block = this.getBlock(mapView.terrainBlock, row);
            mapView.terrainBlock = block;
            var map = block.block.map;
            var mapPos = Math.floor(x / Map.TILE_W) + ((row - block.row) * Map.WORLD_W);
            for (var layerId = 1; layerId >= 0; layerId--) {
                var tileId = block.block.map[layerId][mapPos];
                if (tileId != 0) {
                    var terrain = this._tilesetTerrainData.getTileTerrain(tileId - 1, x % Map.TILE_W, Map.TILE_H + (y % Map.TILE_H));
                    if (terrain <= 2)
                        return terrain;
                }
            }
            return 0;
        };
        Map.prototype.getBlock = function (block, row) {
            if (block.row > row) {
                do {
                    block = block.next;
                    if (block == null)
                        block = this._path.getNextBlock();
                } while (block.row > row);
            }
            else if (block.row + block.height <= row) {
                do {
                    block = block.prev;
                } while (block != null && block.row + block.height <= row);
            }
            return block;
        };
        return Map;
    }());
    Map.TILE_W = 64;
    Map.TILE_H = 64;
    Map.WORLD_W = 20;
    Map.WORLD_W_PIX = Map.WORLD_W * Map.TILE_W;
    GameMap.Map = Map;
})(GameMap || (GameMap = {}));
var GameMap;
(function (GameMap) {
    var MapBlock = (function () {
        function MapBlock(id, minCheckpointId, map, barriers, difficulties) {
            this._id = id;
            this._minCheckpointId = minCheckpointId;
            this._map = map;
            this._height = map[0].length / GameMap.Map.WORLD_W;
            this._barriers = barriers;
            var i = difficulties.length;
            while (i-- != 0)
                difficulties[i].id = i;
            this._difficulties = difficulties;
        }
        Object.defineProperty(MapBlock.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapBlock.prototype, "map", {
            get: function () { return this._map; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapBlock.prototype, "height", {
            get: function () { return this._height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapBlock.prototype, "barriers", {
            get: function () { return this._barriers; },
            enumerable: true,
            configurable: true
        });
        MapBlock.prototype.setConnections = function (blocks) {
            this._connections = blocks.sort(function (a, b) {
                if (a._minCheckpointId < b._minCheckpointId)
                    return -1;
                if (a._minCheckpointId > b._minCheckpointId)
                    return 1;
                return 0;
            });
        };
        MapBlock.prototype.reset = function () {
            this._curDifId = 0;
            var dif = this._difficulties[0];
            this._nextDifDelay = dif.repeatCnt;
            this._settingsUnusedCnt = dif.settings.length;
            this._settingsUsedMask = 0;
        };
        MapBlock.prototype.selectNextBlock = function () {
            var blockCnt = this._connections.length;
            while (this._connections[blockCnt - 1]._minCheckpointId > HUD.Map.instance.checkpointId) {
                if (--blockCnt == 0) {
                    blockCnt = 1;
                    break;
                }
            }
            if (blockCnt == 0)
                return this._connections[0];
            var i = Game.Global.game.rnd.integerInRange(0, blockCnt - 1);
            var block = this._connections[i];
            if (block.id != this.id)
                return block;
            return this._connections[(i > 0 ? i - 1 : blockCnt - 1)];
        };
        MapBlock.prototype.used = function (settings) {
            if (--this._nextDifDelay == 0) {
                if (++this._curDifId == this._difficulties.length)
                    this._curDifId--;
                var dif = this._difficulties[this._curDifId];
                this._nextDifDelay = dif.repeatCnt;
                this._settingsUnusedCnt = dif.settings.length;
                this._settingsUsedMask = 0;
            }
            else {
                if (settings.difficulty.id == this._curDifId) {
                    var dif = this._difficulties[this._curDifId];
                    if (dif.settings.length > 1) {
                        if (--this._settingsUnusedCnt == 0) {
                            this._settingsUnusedCnt = dif.settings.length - 1;
                            this._settingsUsedMask = 0;
                        }
                        this._settingsUsedMask |= (1 << settings.id);
                    }
                }
            }
        };
        MapBlock.prototype.selectSettings = function () {
            var difficulty = this._difficulties[this._curDifId];
            var setCnt = difficulty.settings.length;
            var setId = 0;
            if (setCnt > 1) {
                setId = Game.Global.game.rnd.integerInRange(0, setCnt - 1);
                while ((this._settingsUsedMask & (1 << setId)) != 0) {
                    if (++setId == setCnt)
                        setId = 0;
                }
            }
            return difficulty.settings[setId];
        };
        MapBlock.prototype.getSettings = function (difficulty, settingsId) {
            return this._difficulties[difficulty].settings[settingsId];
        };
        return MapBlock;
    }());
    GameMap.MapBlock = MapBlock;
})(GameMap || (GameMap = {}));
var GameMap;
(function (GameMap) {
    var PathBlock = (function () {
        function PathBlock() {
            if (PathBlock._vertexBuffer == undefined)
                PathBlock._vertexBuffer = [];
            this.next = null;
            this.prev = null;
            this._barrierFixtures = [];
        }
        Object.defineProperty(PathBlock.prototype, "active", {
            get: function () { return this._activeCnt != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathBlock.prototype, "block", {
            get: function () { return this._block; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathBlock.prototype, "blockSettings", {
            get: function () { return this._blockSettings; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathBlock.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathBlock.prototype, "y", {
            get: function () { return this._row * GameMap.Map.TILE_H; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathBlock.prototype, "row", {
            get: function () { return this._row; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathBlock.prototype, "height", {
            get: function () { return this._block.height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathBlock.prototype, "gameObjects", {
            get: function () { return this._blockSettings.objects; },
            enumerable: true,
            configurable: true
        });
        PathBlock.prototype.init = function (prev) {
            this.prev = prev;
            if (prev != null) {
                this._id = prev._id + 1;
                this._block = prev._block.selectNextBlock();
                this._row = prev._row - this._block.height;
                prev.next = this;
            }
            else {
                this._id = 0;
                this._block = GameMap.PathGenerator.getBlock(0);
                this._row = -this._block.height;
            }
            this._blockSettings = this._block.selectSettings();
            this._block.used(this._blockSettings);
            this._activeCnt = 0;
        };
        PathBlock.prototype.activate = function () {
            if (this._activeCnt++ != 0)
                return;
            var map = GameMap.Map.instance;
            var body = map.barrierBody;
            var colFilter = map.barrierBodyColFilter;
            var blockY = this._row * GameMap.Map.TILE_H;
            var barriers = this._block.barriers;
            var barrierId = barriers.length;
            while (barrierId-- != 0) {
                var srcVertices = barriers[barrierId];
                var desVertices = PathBlock._vertexBuffer;
                var verCnt = srcVertices.length;
                var verId = 0;
                while (verId < verCnt) {
                    desVertices[verId] = srcVertices[verId];
                    verId++;
                    desVertices[verId] = blockY + srcVertices[verId];
                    verId++;
                }
                var fixture = body.addChain(desVertices, 0, verCnt >> 1);
                fixture.SetFilterData(colFilter);
                this._barrierFixtures.push(fixture);
            }
        };
        PathBlock.prototype.deactivate = function () {
            if (--this._activeCnt != 0)
                return;
            var body = GameMap.Map.instance.barrierBody;
            var fixtures = this._barrierFixtures;
            var fixtureId = fixtures.length;
            while (fixtureId-- != 0) {
                body.removeFixture(fixtures[fixtureId]);
            }
            this._barrierFixtures.length = 0;
        };
        PathBlock.prototype.load = function (prev) {
            this._id = (prev != null ? prev._id + 1 : 0);
            var dataView = Game.Global.ghost.path;
            var dataViewOffset = this._id * PathBlock.SAVE_DATA_SIZE;
            this.prev = prev;
            this.next = null;
            this._block = GameMap.PathGenerator.getBlock(dataView.getUint8(dataViewOffset + PathBlock.DATA_OFF_BLOCK_ID));
            if (prev != null) {
                this._row = prev._row - this._block.height;
                prev.next = this;
            }
            else {
                this._row = -this._block.height;
            }
            this._blockSettings = this._block.getSettings(dataView.getUint8(dataViewOffset + PathBlock.DATA_OFF_BLOCK_DIFF), dataView.getUint8(dataViewOffset + PathBlock.DATA_OFF_BLOCK_SET_ID));
            this._block.used(this._blockSettings);
            this._activeCnt = 0;
        };
        PathBlock.prototype.save = function (dataView) {
            var dataViewOffset = this._id * PathBlock.SAVE_DATA_SIZE;
            dataView.setUint8(dataViewOffset++, this._block.id);
            dataView.setUint8(dataViewOffset++, this._blockSettings.difficulty.id);
            dataView.setUint8(dataViewOffset++, this._blockSettings.id);
        };
        return PathBlock;
    }());
    PathBlock.SAVE_DATA_SIZE = 3;
    PathBlock.DATA_OFF_BLOCK_ID = 0;
    PathBlock.DATA_OFF_BLOCK_DIFF = 1;
    PathBlock.DATA_OFF_BLOCK_SET_ID = 2;
    GameMap.PathBlock = PathBlock;
})(GameMap || (GameMap = {}));
var GameMap;
(function (GameMap) {
    var PathGenerator = (function () {
        function PathGenerator() {
            if (PathGenerator._blocks == undefined)
                PathGenerator._blocks = GameMap.initMapBlocks();
            this._firstFreeBlock = null;
            this._firstActBlock = null;
            this._lastActBlock = null;
            this._saveData = new DataView(new ArrayBuffer(1000 * GameMap.PathBlock.SAVE_DATA_SIZE));
        }
        PathGenerator.getBlock = function (blockId) { return PathGenerator._blocks[blockId]; };
        Object.defineProperty(PathGenerator.prototype, "firstActBlock", {
            get: function () { return this._firstActBlock; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathGenerator.prototype, "lastActBlock", {
            get: function () { return this._lastActBlock; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathGenerator.prototype, "saveData", {
            get: function () { return this._saveData; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathGenerator.prototype, "savedBlocksNum", {
            get: function () { return this._savedBlocksNum; },
            enumerable: true,
            configurable: true
        });
        PathGenerator.prototype.reset = function (clearPath, pathData) {
            if (pathData === void 0) { pathData = null; }
            var i = PathGenerator._blocks.length;
            while (i-- != 0)
                PathGenerator._blocks[i].reset();
            if (this._lastActBlock != null) {
                this._lastActBlock.next = this._firstFreeBlock;
                this._firstFreeBlock = this._firstActBlock;
                this._firstActBlock = null;
            }
            this._firstActBlock = this.getFreeBlock();
            this._lastActBlock = this._firstActBlock;
            if (Game.Global.ghost.valid) {
                this._firstActBlock.load(null);
            }
            else {
                this._firstActBlock.init(null);
            }
            this._firstActBlock.save(this._saveData);
            this._savedBlocksNum = 1;
        };
        PathGenerator.prototype.getNextBlock = function () {
            var ghost = Game.Global.ghost;
            var block = this.getFreeBlock();
            if (ghost.valid && this._lastActBlock.id + 1 < ghost.pathBlocksNum) {
                block.load(this._lastActBlock);
            }
            else {
                block.init(this._lastActBlock);
            }
            this._lastActBlock = block;
            block.save(this._saveData);
            this._savedBlocksNum++;
            return this._lastActBlock;
        };
        PathGenerator.prototype.releaseFirstActBlock = function () {
            var newFirstActBlock = this._firstActBlock.next;
            newFirstActBlock.prev = null;
            this._firstActBlock.next = (this._firstFreeBlock != null ? this._firstFreeBlock : null);
            this._firstActBlock.prev = null;
            this._firstFreeBlock = this._firstActBlock;
            this._firstActBlock = newFirstActBlock;
        };
        PathGenerator.prototype.getFreeBlock = function () {
            var block = this._firstFreeBlock;
            if (block == null) {
                return new GameMap.PathBlock();
            }
            this._firstFreeBlock = block.next;
            block.next = null;
            return block;
        };
        return PathGenerator;
    }());
    GameMap.PathGenerator = PathGenerator;
})(GameMap || (GameMap = {}));
var GameMap;
(function (GameMap) {
    var TilesetTerrainData = (function () {
        function TilesetTerrainData() {
            var terrainColors = new Uint32Array(3);
            terrainColors[0] = 0x8a7f62ff;
            terrainColors[1] = 0xffff00ff;
            terrainColors[2] = 0x646464ff;
            if (Game.Global.game.device.littleEndian) {
                var i = terrainColors.length;
                while (i-- != 0)
                    terrainColors[i] = Utils.changeByteOrder(terrainColors[i]);
            }
            var bmd = Game.Global.game.make.bitmapData(TilesetTerrainData.TILE_W * TilesetTerrainData.TILES_PER_ROW, TilesetTerrainData.TILE_H * TilesetTerrainData.TILES_PER_COL);
            var img = Game.Global.game.make.image(0, 0, Game.Global.ATLAS_0, "tilesetTerrain");
            bmd.draw(img, 0, 0);
            bmd.update();
            var pixId = bmd.width * bmd.height;
            var bmdPixels = bmd.pixels;
            var data = new Uint8Array(pixId);
            while (pixId-- != 0) {
                var pixel = bmdPixels[pixId];
                if (pixel != 0) {
                    var colorId = terrainColors.length;
                    while (colorId-- != 0) {
                        if (pixel == terrainColors[colorId])
                            break;
                    }
                    data[pixId] = colorId;
                    continue;
                }
                data[pixId] = -1;
            }
            this._data = data;
            bmd.destroy();
            img.destroy();
        }
        TilesetTerrainData.prototype.getTileTerrain = function (tileId, offsetX, offsetY) {
            return this._data[(((Math.floor(tileId / TilesetTerrainData.TILES_PER_ROW) * TilesetTerrainData.TILE_H) + Math.floor(offsetY / TilesetTerrainData.SCALE)) * (TilesetTerrainData.TILE_W * TilesetTerrainData.TILES_PER_ROW))
                + ((tileId % TilesetTerrainData.TILES_PER_ROW) * TilesetTerrainData.TILE_W) + Math.floor(offsetX / TilesetTerrainData.SCALE)];
        };
        return TilesetTerrainData;
    }());
    TilesetTerrainData.SCALE = 4;
    TilesetTerrainData.TILE_W = GameMap.Map.TILE_W / TilesetTerrainData.SCALE;
    TilesetTerrainData.TILE_H = GameMap.Map.TILE_H / TilesetTerrainData.SCALE;
    TilesetTerrainData.TILES_PER_ROW = 12;
    TilesetTerrainData.TILES_PER_COL = 18;
    GameMap.TilesetTerrainData = TilesetTerrainData;
})(GameMap || (GameMap = {}));
var GameMap;
(function (GameMap) {
    var MapView = (function () {
        function MapView() {
            this._map = GameMap.Map.instance;
            this._topBlock = null;
            this._botBlock = null;
            this._botBorderBody = new Phaser.Physics.Box2D.Body(Game.Global.game, null, 0, 0, 0);
            this._botBorderBody.setEdge(-GameMap.Map.WORLD_W_PIX / 2, 0, GameMap.Map.WORLD_W_PIX / 2, 0);
            this._botBorderBody.x = GameMap.Map.WORLD_W_PIX / 2;
            var filter = new box2d.b2Filter();
            filter.categoryBits = 0x04;
            filter.maskBits = 0x01;
            this._botBorderBody.data.GetFixtureList().SetFilterData(filter);
            this._objects = new GameObjects.Manager(this);
        }
        Object.defineProperty(MapView.prototype, "topBlock", {
            get: function () { return this._topBlock; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "botBlock", {
            get: function () { return this._botBlock; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "objects", {
            get: function () { return this._objects; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "topY", {
            get: function () { return this._y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "botY", {
            get: function () { return this._y + this._height - 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "height", {
            get: function () { return this._height; },
            enumerable: true,
            configurable: true
        });
        MapView.prototype.deactivateBlocks = function () {
            var block = this._topBlock;
            if (block != undefined) {
                do {
                    block.deactivate();
                    block = block.prev;
                } while (block != null && block.next.id != this._botBlock.id);
            }
        };
        MapView.prototype.reset = function () {
            var map = this._map;
            var firstActBlock = map.path.firstActBlock;
            this._topBlock = map.getBlock(firstActBlock, Math.floor(this._y / GameMap.Map.TILE_H));
            this._botBlock = map.getBlock(firstActBlock, Math.floor((this._y + this._height - 1) / GameMap.Map.TILE_H));
            var block = this._topBlock;
            do {
                block.activate();
                block = block.prev;
            } while (block != null && block.next.id != this._botBlock.id);
            this.terrainBlock = firstActBlock;
            this._botBorderBody.y = this._y + this._height - 5;
            this._objects.reset();
        };
        MapView.prototype.viewPosUpdated = function () {
            var row = Math.floor(this._y / GameMap.Map.TILE_H);
            if (this._topBlock.row > row) {
                do {
                    this._topBlock = this._topBlock.next;
                    if (this._topBlock == null)
                        this._topBlock = this._map.path.getNextBlock();
                    this._topBlock.activate();
                } while (this._topBlock.row > row);
            }
            row = Math.floor((this._y + this._height - 1) / GameMap.Map.TILE_H);
            if (this._botBlock.row > row) {
                do {
                    this._botBlock.deactivate();
                    this._botBlock = this._botBlock.next;
                    this._map.path.releaseFirstActBlock();
                    if (!this.terrainBlock.active)
                        this.terrainBlock = this._botBlock;
                } while (this._botBlock.row > row);
            }
            this._botBorderBody.y = this._y + this._height;
            this._objects.activateObjects();
        };
        return MapView;
    }());
    GameMap.MapView = MapView;
})(GameMap || (GameMap = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameMap;
(function (GameMap) {
    var MapViewPlayer = (function (_super) {
        __extends(MapViewPlayer, _super);
        function MapViewPlayer() {
            var _this = _super.call(this) || this;
            var game = Game.Global.game;
            _this._tileMap = new InfiniteTileMap.TileMap();
            _this._tileMap.setViewSize(game.camera.width, game.camera.height);
            var tileSet = new Phaser.Tileset("", 0, GameMap.Map.TILE_W, GameMap.Map.TILE_H, 4, 8);
            tileSet.setImage(game.cache.getImage("tileset"));
            var layer = game.add.group();
            layer.fixedToCamera = true;
            var content = new TileMapContent(_this, _this.getTileId, _this);
            var tileLayer = new InfiniteTileMap.TileMapLayer(_this._tileMap, content, tileSet, layer);
            _this._tileMap.setLayers([tileLayer]);
            _this._height = _this._tileMap.viewH;
            Game.Play.instance.onResize.add(function (camera) {
                this.setViewSize(camera.width, camera.height);
            }, _this);
            return _this;
        }
        MapViewPlayer.prototype.reset = function () {
            var camera = Game.Global.game.camera;
            this._tileBlock = this._map.path.firstActBlock;
            this._tileMap.reset(camera.x, camera.y);
            this._y = this._tileMap.viewY;
            this._height = this._tileMap.viewH;
            _super.prototype.reset.call(this);
        };
        MapViewPlayer.prototype.setViewSize = function (width, height) {
            this._tileMap.setViewSize(width, height);
            this._height = height;
            this.viewPosUpdated();
        };
        MapViewPlayer.prototype.setViewPosition = function (x, y) {
            if (this._y != y) {
                this._y = y;
                this.viewPosUpdated();
                if (!this._tileBlock.active)
                    this._tileBlock = this._botBlock;
            }
            this._tileMap.setViewPosition(x, y);
        };
        MapViewPlayer.prototype.getTileId = function (col, row, layerId) {
            var block = this._map.getBlock(this._tileBlock, row);
            if (block == null)
                return -1;
            this._tileBlock = block;
            return block.block.map[layerId][col + GameMap.Map.WORLD_W * (row - block.row)] - 1;
        };
        return MapViewPlayer;
    }(GameMap.MapView));
    GameMap.MapViewPlayer = MapViewPlayer;
    var TileMapContent = (function (_super) {
        __extends(TileMapContent, _super);
        function TileMapContent(mapView, getTileIdFunc, getTileIdContext) {
            var _this = _super.call(this) || this;
            _this._mapView = mapView;
            _this._getTileIdFunc = getTileIdFunc;
            _this._getTileIdContext = getTileIdContext;
            return _this;
        }
        TileMapContent.prototype.minCol = function () { return 0; };
        TileMapContent.prototype.maxCol = function () { return GameMap.Map.WORLD_W - 1; };
        TileMapContent.prototype.minRow = function () { return null; };
        TileMapContent.prototype.maxRow = function () {
            var bBlock = this._mapView.botBlock;
            if (bBlock == null)
                return -1;
            return bBlock.row + bBlock.height - 1;
        };
        TileMapContent.prototype.layerCnt = function () { return 3; };
        TileMapContent.prototype.getTileId = function (col, row, layerId) {
            return this._getTileIdFunc.call(this._getTileIdContext, col, row, layerId);
        };
        return TileMapContent;
    }(InfiniteTileMap.TileMapContent));
})(GameMap || (GameMap = {}));
var GameMap;
(function (GameMap) {
    var MapBlockSettings = (function () {
        function MapBlockSettings(objects) {
            this._objects = objects;
        }
        Object.defineProperty(MapBlockSettings.prototype, "objects", {
            get: function () { return this._objects; },
            enumerable: true,
            configurable: true
        });
        return MapBlockSettings;
    }());
    GameMap.MapBlockSettings = MapBlockSettings;
    var MapBlockDifficulty = (function () {
        function MapBlockDifficulty(settings, repeatCnt) {
            this._repeatCnt = repeatCnt;
            this._settings = settings;
            var i = settings.length;
            while (i-- != 0) {
                var set = settings[i];
                set.difficulty = this;
                set.id = i;
            }
        }
        Object.defineProperty(MapBlockDifficulty.prototype, "repeatCnt", {
            get: function () { return this._repeatCnt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapBlockDifficulty.prototype, "settings", {
            get: function () { return this._settings; },
            enumerable: true,
            configurable: true
        });
        return MapBlockDifficulty;
    }());
    GameMap.MapBlockDifficulty = MapBlockDifficulty;
})(GameMap || (GameMap = {}));
var GameObjects;
(function (GameObjects) {
    var GameObject = (function () {
        function GameObject(frameKey) {
            if (GameObject._phyColFilter == undefined) {
                GameObject._phyColFilter = new box2d.b2Filter();
                GameObject._phyColFilter.categoryBits = 0x02;
                GameObject._phyColFilter.maskBits = 0x0B;
                GameObject._phySolidColFilter = new box2d.b2Filter();
                GameObject._phySolidColFilter.categoryBits = 0x08;
                GameObject._phySolidColFilter.maskBits = 0x0B;
            }
            this._sprite = new GameObjectSprite(this, frameKey);
            Game.Global.game.physics.box2d.enableBody(this._sprite);
            this._spriteBody = this._sprite.body;
            this._sprite.kill();
            this._spriteBody.kill();
        }
        Object.defineProperty(GameObject.prototype, "data", {
            get: function () { return this._data; },
            enumerable: true,
            configurable: true
        });
        GameObject.prototype.getType = function () { return this._data.type; };
        GameObject.prototype.activate = function (data, blockY, block, view, layerId) {
            if (layerId === void 0) { layerId = 0; }
            this._data = data;
            this._view = view;
            this._sprite.reset(data.x, blockY + data.y);
            Game.Play.instance.objectLayers[layerId].add(this._sprite);
        };
        GameObject.prototype.deactivate = function () {
            this._sprite.parent.removeChild(this._sprite);
            this._sprite.kill();
            this._spriteBody.kill();
            this._view.objects.returnObjectToPool(this);
        };
        GameObject.prototype.postUpdate = function () {
            if (this._spriteBody.y - this._deactOffset > this._view.botY)
                this.deactivate();
        };
        return GameObject;
    }());
    GameObjects.GameObject = GameObject;
    var GameObjectSprite = (function (_super) {
        __extends(GameObjectSprite, _super);
        function GameObjectSprite(gameObject, frameKey) {
            var _this = _super.call(this, Game.Global.game, 0, 0, Game.Global.ATLAS_0, frameKey) || this;
            _this._gameObject = gameObject;
            return _this;
        }
        Object.defineProperty(GameObjectSprite.prototype, "gameObject", {
            get: function () { return this._gameObject; },
            enumerable: true,
            configurable: true
        });
        GameObjectSprite.prototype.postUpdate = function () {
            _super.prototype.postUpdate.call(this);
            this._gameObject.postUpdate();
        };
        return GameObjectSprite;
    }(Phaser.Sprite));
    GameObjects.GameObjectSprite = GameObjectSprite;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var Manager = (function () {
        function Manager(view) {
            if (Manager._objectPools == undefined) {
                Manager._objectPools = [];
                var pools = [];
                pools[GameObjects.eObstacleType.tire] = new Collections.Pool(GameObjects.ObsTire, 6, true);
                pools[GameObjects.eObstacleType.speedBar] = new Collections.Pool(GameObjects.ObsSpeedBar, 2, true);
                pools[GameObjects.eObstacleType.oil1] = new Collections.Pool(GameObjects.ObsOil1, 2, true);
                pools[GameObjects.eObstacleType.oil2] = new Collections.Pool(GameObjects.ObsOil2, 2, true);
                Manager._objectPools[GameObjects.eObjectType.obstacle] = pools;
                pools = [];
                pools[GameObjects.eBonusType.energy] = new Collections.Pool(GameObjects.BnsEnergy, 1, true);
                pools[GameObjects.eBonusType.coin] = new Collections.Pool(GameObjects.BnsCoin, 3, true);
                Manager._objectPools[GameObjects.eObjectType.bonus] = pools;
                Manager._bonusSpacing = [];
                Manager._bonusSpacing[GameObjects.eBonusType.energy] = 2000;
                Manager._bonusSpacing[GameObjects.eBonusType.coin] = 0;
            }
            this._view = view;
            this._lastBonusPos = [0];
        }
        Manager.prototype.reset = function () {
            var layers = Game.Play.instance.objectLayers;
            var i = layers.length;
            while (i-- != 0) {
                var layer = layers[i];
                while (layer.length != 0) {
                    var layerItem = layer.getAt(0);
                    if (layerItem instanceof GameObjects.GameObjectSprite) {
                        layerItem.gameObject.deactivate();
                    }
                    else {
                        layer.removeChild(layerItem);
                    }
                }
            }
            i = this._lastBonusPos.length;
            while (i-- != 0)
                this._lastBonusPos[i] = 0;
            this._objBlock = GameMap.Map.instance.path.firstActBlock;
            this._nextObjId = this._objBlock.gameObjects != null ? 0 : -1;
            this.activateObjects();
        };
        Manager.prototype.activateObjects = function () {
            if (this._nextObjId < 0) {
                if (!this.findNextObjectBlock())
                    return;
            }
            var objData = this._objBlock.gameObjects[this._nextObjId];
            var objBlockY = this._objBlock.y;
            var viewY = this._view.topY;
            while (objBlockY + objData.activationPos >= viewY) {
                var objType = objData.objectType;
                var type = objData.type;
                if (objType == GameObjects.eObjectType.bonus) {
                    if (type == GameObjects.eBonusType.energy) {
                        if (this._lastBonusPos[GameObjects.eBonusType.energy] - (objBlockY + objData.activationPos) < Manager._bonusSpacing[GameObjects.eBonusType.energy]) {
                            type = -1;
                        }
                        else {
                            this._lastBonusPos[GameObjects.eBonusType.energy] = objBlockY + objData.activationPos;
                        }
                    }
                }
                if (type >= 0)
                    Manager._objectPools[objType][type].getItem().activate(objData, objBlockY, this._objBlock, this._view);
                if (++this._nextObjId == this._objBlock.gameObjects.length) {
                    this._nextObjId = -1;
                    if (!this.findNextObjectBlock())
                        break;
                    objBlockY = this._objBlock.y;
                }
                objData = this._objBlock.gameObjects[this._nextObjId];
            }
        };
        Manager.prototype.returnObjectToPool = function (object) {
            Manager._objectPools[object.data.objectType][object.getType()].returnItem(object);
        };
        Manager.prototype.findNextObjectBlock = function () {
            while (this._objBlock.id != this._view.topBlock.id) {
                this._objBlock = this._objBlock.next;
                if (this._objBlock.gameObjects != null) {
                    this._nextObjId = 0;
                    return true;
                }
            }
            return false;
        };
        return Manager;
    }());
    GameObjects.Manager = Manager;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var eObjectType;
    (function (eObjectType) {
        eObjectType[eObjectType["obstacle"] = 0] = "obstacle";
        eObjectType[eObjectType["bonus"] = 1] = "bonus";
    })(eObjectType = GameObjects.eObjectType || (GameObjects.eObjectType = {}));
    var GameObjectData = (function () {
        function GameObjectData(objType, type, actPos, x, y) {
            this._objectType = objType;
            this._type = type;
            this._actPos = actPos;
            this._x = x;
            this._y = y;
        }
        Object.defineProperty(GameObjectData.prototype, "objectType", {
            get: function () { return this._objectType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectData.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectData.prototype, "x", {
            get: function () { return this._x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectData.prototype, "y", {
            get: function () { return this._y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectData.prototype, "activationPos", {
            get: function () { return this._actPos; },
            enumerable: true,
            configurable: true
        });
        return GameObjectData;
    }());
    GameObjects.GameObjectData = GameObjectData;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var eObstacleType;
    (function (eObstacleType) {
        eObstacleType[eObstacleType["tire"] = 0] = "tire";
        eObstacleType[eObstacleType["speedBar"] = 1] = "speedBar";
        eObstacleType[eObstacleType["oil1"] = 2] = "oil1";
        eObstacleType[eObstacleType["oil2"] = 3] = "oil2";
    })(eObstacleType = GameObjects.eObstacleType || (GameObjects.eObstacleType = {}));
    var ObstacleData = (function (_super) {
        __extends(ObstacleData, _super);
        function ObstacleData(type, actPos, x, y, angle, customData) {
            if (angle === void 0) { angle = 0; }
            if (customData === void 0) { customData = null; }
            var _this = _super.call(this, GameObjects.eObjectType.obstacle, type, actPos, x, y) || this;
            _this._type = type;
            _this._angle = angle;
            _this._customData = customData;
            return _this;
        }
        Object.defineProperty(ObstacleData.prototype, "angle", {
            get: function () { return this._angle; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObstacleData.prototype, "customData", {
            get: function () { return this._customData; },
            enumerable: true,
            configurable: true
        });
        return ObstacleData;
    }(GameObjects.GameObjectData));
    GameObjects.ObstacleData = ObstacleData;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var ObsTireCustomData = (function () {
        function ObsTireCustomData(color) {
            this._color = color;
        }
        Object.defineProperty(ObsTireCustomData.prototype, "color", {
            get: function () { return this._color; },
            enumerable: true,
            configurable: true
        });
        return ObsTireCustomData;
    }());
    GameObjects.ObsTireCustomData = ObsTireCustomData;
    var ObsTire = (function (_super) {
        __extends(ObsTire, _super);
        function ObsTire() {
            var _this = _super.call(this, "obsTire_0") || this;
            _this._spriteBody.setCircle(12, -2, -2);
            _this._spriteBody.friction = 0.2;
            _this._spriteBody.linearDamping = 1;
            _this._spriteBody.restitution = 0.3;
            _this._spriteBody.fixedRotation = true;
            _this._spriteBody.mass *= 3;
            _this._spriteBody.data.GetFixtureList().SetFilterData(ObsTire._phySolidColFilter);
            _this._deactOffset = 12;
            return _this;
        }
        ObsTire.prototype.activate = function (data, blockY, block, view, layerId, blockId) {
            if (layerId === void 0) { layerId = 0; }
            if (blockId === void 0) { blockId = 0; }
            this._sprite.frameName = "obsTire_" + data.customData.color;
            this._spriteBody.setZeroRotation();
            this._spriteBody.setZeroVelocity();
            this._spriteBody.angle = data.angle;
            _super.prototype.activate.call(this, data, blockY, block, view, 1);
        };
        return ObsTire;
    }(GameObjects.GameObject));
    GameObjects.ObsTire = ObsTire;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var ObsSpeedBarCustomData = (function () {
        function ObsSpeedBarCustomData(speedUp) {
            this._speedUp = speedUp;
        }
        Object.defineProperty(ObsSpeedBarCustomData.prototype, "speedUp", {
            get: function () { return this._speedUp; },
            enumerable: true,
            configurable: true
        });
        return ObsSpeedBarCustomData;
    }());
    GameObjects.ObsSpeedBarCustomData = ObsSpeedBarCustomData;
    var ObsSpeedBar = (function (_super) {
        __extends(ObsSpeedBar, _super);
        function ObsSpeedBar() {
            var _this = _super.call(this, "obsSpeedBar_0") || this;
            _this._sprite.anchor.set(0.5);
            _this._spriteBody.setRectangle(36, 106, 0, 0, 0);
            _this._spriteBody.static = true;
            _this._spriteBody.sensor = true;
            _this._spriteBody.data.GetFixtureList().SetFilterData(GameObjects.GameObject._phyColFilter);
            _this._spriteBody.setCategoryContactCallback(1, _this.carCollision, _this);
            _this._deactOffset = Math.round(_this._sprite.height / 2);
            return _this;
        }
        ObsSpeedBar.prototype.activate = function (data, blockY, block, view, layerId) {
            if (layerId === void 0) { layerId = 0; }
            var customData = data.customData;
            this._sprite.frameName = "obsSpeedBar_" + (customData == null || customData.speedUp ? 0 : 1).toString();
            this._spriteBody.angle = data.angle;
            _super.prototype.activate.call(this, data, blockY, block, view, 0);
        };
        ObsSpeedBar.prototype.carCollision = function (body, carBody) {
            var customData = this._data.customData;
            carBody.data.GetUserData().activateAdjustment(customData == null || customData.speedUp ? Car.eCarAdjustment.speedUp : Car.eCarAdjustment.slowDown);
        };
        return ObsSpeedBar;
    }(GameObjects.GameObject));
    GameObjects.ObsSpeedBar = ObsSpeedBar;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var ObsOil = (function (_super) {
        __extends(ObsOil, _super);
        function ObsOil(frameName) {
            var _this = _super.call(this, frameName) || this;
            _this._deactOffset = Math.round(_this._sprite.height / 2);
            return _this;
        }
        ObsOil.prototype.activate = function (data, blockY, block, view, layerId) {
            if (layerId === void 0) { layerId = 0; }
            this._spriteBody.angle = data.angle;
            _super.prototype.activate.call(this, data, blockY, block, view, 0);
        };
        ObsOil.prototype.createBody = function (vertices) {
            this._spriteBody.setPolygon(vertices);
            this._spriteBody.static = true;
            this._spriteBody.sensor = true;
            this._spriteBody.data.GetFixtureList().SetFilterData(GameObjects.GameObject._phyColFilter);
            this._spriteBody.setCategoryContactCallback(1, this.carCollision, this);
        };
        ObsOil.prototype.carCollision = function (body, carBody) {
            carBody.data.GetUserData().activateAdjustment(Car.eCarAdjustment.lessGrip);
        };
        return ObsOil;
    }(GameObjects.GameObject));
    GameObjects.ObsOil = ObsOil;
    var ObsOil1 = (function (_super) {
        __extends(ObsOil1, _super);
        function ObsOil1() {
            var _this = _super.call(this, "obsOil_0") || this;
            _this._sprite.anchor.set(0.5);
            var anchorX = Math.round(_this._sprite.anchor.x * _this._sprite.width);
            var anchorY = Math.round(_this._sprite.anchor.y * _this._sprite.height);
            _this.createBody([10 - anchorX, 23 - anchorY, 50 - anchorX, 12 - anchorY, 54 - anchorX, 52 - anchorY, 16 - anchorX, 53 - anchorY]);
            return _this;
        }
        return ObsOil1;
    }(ObsOil));
    GameObjects.ObsOil1 = ObsOil1;
    var ObsOil2 = (function (_super) {
        __extends(ObsOil2, _super);
        function ObsOil2() {
            var _this = _super.call(this, "obsOil_1") || this;
            _this._sprite.anchor.set(0.5);
            var anchorX = Math.round(_this._sprite.anchor.x * _this._sprite.width);
            var anchorY = Math.round(_this._sprite.anchor.y * _this._sprite.height);
            _this.createBody([11 - anchorX, 47 - anchorY, 43 - anchorX, 11 - anchorY, 102 - anchorX, 20 - anchorY, 93 - anchorX, 54 - anchorY]);
            return _this;
        }
        return ObsOil2;
    }(ObsOil));
    GameObjects.ObsOil2 = ObsOil2;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var eBonusType;
    (function (eBonusType) {
        eBonusType[eBonusType["energy"] = 0] = "energy";
        eBonusType[eBonusType["coin"] = 1] = "coin";
    })(eBonusType = GameObjects.eBonusType || (GameObjects.eBonusType = {}));
    ;
    var Bonus = (function (_super) {
        __extends(Bonus, _super);
        function Bonus(frameKey, glowKey) {
            var _this = _super.call(this, frameKey) || this;
            var game = Game.Global.game;
            _this._glow = game.make.image(0, 0, Game.Global.ATLAS_0, glowKey);
            _this._glow.anchor.set(0.5);
            _this._shadow = game.make.image(0, 0, Game.Global.ATLAS_0, "bnsShadow");
            _this._shadow.anchor.set(0.5);
            return _this;
        }
        Bonus.prototype.activate = function (data, blockY, block, view, layerId) {
            if (layerId === void 0) { layerId = 0; }
            this._pickedUp = false;
            var layer = Game.Play.instance.objectLayers[0];
            this._shadow.alpha = 1;
            this._shadow.position.set(data.x, blockY + data.y + 20);
            layer.add(this._shadow);
            this._glow.alpha = 1;
            this._glow.scale.set(1);
            this._glow.position.set(data.x, blockY + data.y);
            layer.add(this._glow);
            this._sprite.alpha = 1;
            this._sprite.scale.set(1);
            _super.prototype.activate.call(this, data, blockY, block, view, 0);
        };
        Bonus.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            var layer = this._shadow.parent;
            if (layer != null)
                layer.removeChild(this._shadow);
            layer = this._glow.parent;
            if (layer != null)
                layer.removeChild(this._glow);
        };
        Bonus.prototype.postUpdate = function () {
            if (!this._pickedUp) {
                _super.prototype.postUpdate.call(this);
            }
            else {
                var fxState = (Game.Global.elapsedTime - this._pickupFxTimer) / 500;
                if (fxState >= 1) {
                    this.deactivate();
                    return;
                }
                var scale = 1 + Phaser.Easing.Cubic.Out(fxState);
                var alpha = 1 - Phaser.Easing.Cubic.In(fxState);
                this._sprite.scale.set(scale);
                this._sprite.alpha = alpha;
                this._glow.scale.set(scale);
                this._glow.alpha = alpha;
                this._shadow.alpha = alpha;
            }
            this._glow.angle += Game.Global.deltaRatio * 1.5;
        };
        Bonus.prototype.pickUp = function () {
            this._pickedUp = true;
            this._pickupFxTimer = Game.Global.elapsedTime;
        };
        return Bonus;
    }(GameObjects.GameObject));
    GameObjects.Bonus = Bonus;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var BnsEnergy = (function (_super) {
        __extends(BnsEnergy, _super);
        function BnsEnergy() {
            var _this = _super.call(this, "bnsTime", "bnsEnergyGlow") || this;
            GameObjects.eBonusType;
            var body = _this._spriteBody;
            body.setCircle(16, 0, 2);
            body.sensor = true;
            body.static = true;
            body.data.GetFixtureList().SetFilterData(GameObjects.GameObject._phyColFilter);
            body.setCategoryContactCallback(1, _this.carCollision, _this);
            _this._deactOffset = (_this._sprite.height / 2) - 10;
            return _this;
        }
        BnsEnergy.prototype.getType = function () { return GameObjects.eBonusType.energy; };
        BnsEnergy.prototype.carCollision = function (body, carBody) {
            if (!this._pickedUp) {
                carBody.data.GetUserData().pickupBonus(GameObjects.eBonusType.energy, this._sprite.position);
                _super.prototype.pickUp.call(this);
            }
        };
        return BnsEnergy;
    }(GameObjects.Bonus));
    GameObjects.BnsEnergy = BnsEnergy;
})(GameObjects || (GameObjects = {}));
var GameObjects;
(function (GameObjects) {
    var BnsCoin = (function (_super) {
        __extends(BnsCoin, _super);
        function BnsCoin() {
            var _this = _super.call(this, "bnsCoin_0", "bnsCoinGlow") || this;
            var body = _this._spriteBody;
            body.setCircle(15, 0, 0);
            body.sensor = true;
            body.static = true;
            body.data.GetFixtureList().SetFilterData(GameObjects.GameObject._phyColFilter);
            body.setCategoryContactCallback(1, _this.carCollision, _this);
            var frames = [];
            for (var frameId = 0; frameId <= 6; frameId++)
                frames[frameId] = "bnsCoin_" + frameId;
            _this._sprite.animations.add("default", frames, 10, true, false);
            _this._sprite.animations.play("default");
            _this._deactOffset = (_this._sprite.height / 2) - 10;
            return _this;
        }
        BnsCoin.prototype.getType = function () { return GameObjects.eBonusType.coin; };
        BnsCoin.prototype.activate = function (data, blockY, block, view, layerId) {
            if (layerId === void 0) { layerId = 0; }
            _super.prototype.activate.call(this, data, blockY, block, view, 0);
            this._coinGroup = block.id;
        };
        BnsCoin.prototype.carCollision = function (body, carBody) {
            if (!this._pickedUp) {
                carBody.data.GetUserData().pickupBonus(GameObjects.eBonusType.coin, this._sprite.position, this._coinGroup);
                _super.prototype.pickUp.call(this);
            }
        };
        return BnsCoin;
    }(GameObjects.Bonus));
    GameObjects.BnsCoin = BnsCoin;
})(GameObjects || (GameObjects = {}));
var Car;
(function (Car_1) {
    var eCarWheel;
    (function (eCarWheel) {
        eCarWheel[eCarWheel["tLeft"] = 0] = "tLeft";
        eCarWheel[eCarWheel["tRight"] = 1] = "tRight";
        eCarWheel[eCarWheel["bLeft"] = 2] = "bLeft";
        eCarWheel[eCarWheel["bRight"] = 3] = "bRight";
    })(eCarWheel = Car_1.eCarWheel || (Car_1.eCarWheel = {}));
    var Car = (function () {
        function Car(settings, view, vecPool) {
            this._terrainInfluenceCnt = [0, 0];
            this._settings = settings;
            this._settingsAdjustment = new Car_1.CarSettings(1, 1, 1, 1);
            this._view = view;
            this._vecPool = vecPool;
            this._latVelLocVec = new box2d.b2Vec2(1, 0);
            this._forVelLocVec = new box2d.b2Vec2(0, 1);
            var game = Game.Global.game;
            this._sprite = game.add.sprite(0, 0, Game.Global.ATLAS_0, "car_0");
            this._sprite.anchor.set(0.5, 0.5);
            var anchorX = Math.round(this._sprite.width * this._sprite.anchor.x);
            var anchorY = Math.round(this._sprite.height * this._sprite.anchor.y);
            this._sprite.animations.add("move", ["car_0", "car_1"], 12, true, false);
            this._adjSpeedUpFx = game.add.image(0, 0, Game.Global.ATLAS_0, "carTurboFx_0");
            this._adjSpeedUpFx.anchor.set(0.53, 0.33);
            this._adjSpeedUpFx.animations.add("turbo", ["carTurboFx_0", "carTurboFx_1"], 10, true);
            this._adjSpeedUpFx.kill();
            this._sprite.addChild(this._adjSpeedUpFx);
            this._adjSlowDownFx = game.add.image(0, 0, Game.Global.ATLAS_0, "carBreaks");
            this._adjSlowDownFx.anchor.set(0.57, -0.7);
            this._adjSlowDownFx.kill();
            this._sprite.addChild(this._adjSlowDownFx);
            this._oilStains = new Car_1.OilStainManager(this);
            game.physics.box2d.enableBody(this._sprite);
            this._spriteBody = this._sprite.body;
            this._spriteBody.setPolygon([3 - anchorX, 8 - anchorY, 19 - anchorX, 0 - anchorY, 35 - anchorX, 8 - anchorY, 35 - anchorX, 46 - anchorY, 3 - anchorX, 46 - anchorY]);
            this._spriteBody.friction = 0.1;
            this._spriteBody.restitution = 0.1;
            this._spriteBody.mass = 0.8135999999999999;
            var filter = new box2d.b2Filter();
            filter.categoryBits = 0x01;
            filter.maskBits = 0x0F;
            this._spriteBox2dBody = this._spriteBody.data;
            this._spriteBox2dBody.GetFixtureList().SetFilterData(filter);
            this._spriteBox2dBody.SetUserData(this);
            this._spriteBody.setCategoryPostsolveCallback(0x08, this.barrierCollision, this);
            this._position = new Phaser.Point();
            this._wheelLocalPos = [];
            this._wheelLocalPos[eCarWheel.tLeft] = new box2d.b2Vec2(2 - anchorX, 12 - anchorY);
            this._wheelLocalPos[eCarWheel.tRight] = new box2d.b2Vec2(36 - anchorX, 12 - anchorY);
            this._wheelLocalPos[eCarWheel.bLeft] = new box2d.b2Vec2(1 - anchorX, 40 - anchorY);
            this._wheelLocalPos[eCarWheel.bRight] = new box2d.b2Vec2(37 - anchorX, 40 - anchorY);
            this._wheelWorldPos = [];
            for (var i = 0; i < 4; i++)
                this._wheelWorldPos.push(new Phaser.Point(0, 0));
            this._skidFx = new Car_1.SkidFxManager(this);
            this._skidSfxState = false;
            this.initAdjustments();
            this._saveData = new DataView(new ArrayBuffer(Math.round(Car_1.CarGhostRecord.DATA_SIZE * (1000 / Car.SAVE_INTERVAL) * 60 * 10)));
        }
        Object.defineProperty(Car.prototype, "position", {
            get: function () { return this._position; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Car.prototype, "x", {
            get: function () { return this._position.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Car.prototype, "y", {
            get: function () { return this._position.y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Car.prototype, "body", {
            get: function () { return this._spriteBody; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Car.prototype, "distance", {
            get: function () { return this._distance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Car.prototype, "skid", {
            get: function () { return this._skid != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Car.prototype, "saveData", {
            get: function () { return this._saveData; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Car.prototype, "saveDataSize", {
            get: function () { return this._saveDataOffset; },
            enumerable: true,
            configurable: true
        });
        Car.prototype.reset = function (visible) {
            if (visible === void 0) { visible = true; }
            this._sprite.reset(GameMap.Map.WORLD_W_PIX / 2, -100);
            this._sprite.animations.stop();
            this._spriteBody.setZeroRotation();
            this._spriteBody.setZeroVelocity();
            this._spriteBody.rotation = 0;
            this._position.copyFrom(this._sprite.position);
            this._minY = this._position.y;
            this.updateWheelPos();
            this._turnDir = 0;
            this._skid = 0;
            this._skidFx.reset();
            if (this._skidSfxState) {
                this._skidSfxState = false;
                Utils.AudioUtils.stopSound("skid");
            }
            this._coinGroup = -1;
            this._oilStains.reset();
            this.resetAdjustments();
            this._adjSpeedUpFx.kill();
            this._adjSlowDownFx.kill();
            this._distance = 0;
            this._distanceScore = 0;
            this._saveDataOffset = 0;
            this._lastSaveTime = Game.Global.elapsedTime;
            this._started = false;
            if (!visible)
                this._sprite.kill();
        };
        Car.prototype.start = function () {
            this._sprite.animations.play("move");
            this._started = true;
        };
        Car.prototype.update = function () {
            this._settingsAdjustment.reset();
            if (this._firstActAdjustment != null) {
                var adjustment = this._firstActAdjustment;
                var prevAdjustment = null;
                while (adjustment != null) {
                    if (!adjustment.active || adjustment.timer <= Game.Global.elapsedTime) {
                        if (adjustment.active) {
                            var fnc = Car._adjustmentDeactFnc[adjustment.type];
                            if (fnc != null)
                                fnc.call(this);
                        }
                        if (prevAdjustment != null) {
                            adjustment.deactivate(prevAdjustment);
                            adjustment = prevAdjustment.next;
                        }
                        else {
                            this._firstActAdjustment = adjustment.next;
                            adjustment.deactivate();
                            adjustment = this._firstActAdjustment;
                        }
                        continue;
                    }
                    else {
                        Car._adjustmentUpdateFnc[adjustment.type].call(this);
                    }
                    prevAdjustment = adjustment;
                    adjustment = adjustment.next;
                }
            }
            if (this._adjSpeedUpFx.alive)
                this.updateSpeedUpFx();
            if (this._adjSlowDownFx.alive)
                this.updateSlowDownFx();
            this.updateTerrainInfluence();
            var keyboard = Game.Global.game.input.keyboard;
            var newDir = 0;
            if (keyboard.isDown(Phaser.KeyCode.LEFT)) {
                newDir = -1;
            }
            else if (keyboard.isDown(Phaser.KeyCode.RIGHT)) {
                newDir = 1;
            }
            else {
                var pointer = Game.Global.game.input.activePointer;
                if (pointer != null && pointer.isDown) {
                    newDir = (pointer.x < Game.Global.game.camera.width / 2 ? -1 : 1);
                }
            }
            this._turnDir = newDir;
            this.updateTurn();
            this.updateDrive();
            this.updateFriction();
            Game.Play.instance.updateCamera(this._spriteBody.x, this._spriteBody.y, this._spriteBody.rotation, Math.max(5, Math.abs(this._spriteBody.velocity.x * 1.5 / 60)));
        };
        Car.prototype.preRender = function () {
            if (!this._started)
                return;
            var y = this._spriteBody.y;
            this._position.set(this._spriteBody.x, y);
            if (y < this._minY) {
                this._distance += (this._minY - y);
                this._minY = y;
                var score = Math.round(this._distance / Car.SCORE_DISTANCE_RATIO);
                if (score != this._distanceScore) {
                    Game.Play.instance.addScore(score - this._distanceScore);
                    this._distanceScore = score;
                }
            }
            this.updateWheelPos();
            if (this._skid == 2) {
                this._skid = 1;
                this._skidFx.start();
            }
            this._skidFx.update();
            this._oilStains.update();
            if (this._started && Game.Global.elapsedTime - this._lastSaveTime >= Car.SAVE_INTERVAL) {
                this._lastSaveTime = Game.Global.elapsedTime;
                Car_1.CarGhostRecord.save(this, this._saveData, this._saveDataOffset);
                this._saveDataOffset += Car_1.CarGhostRecord.DATA_SIZE;
            }
        };
        Car.prototype.drawDebug = function (debug, x, y, debugGfx, camera) {
            debug.text("speed: " + this._forwardSpeed, x, y);
            y += 30;
            return y;
        };
        Car.prototype.updateSpeedUpFx = function () {
            var i;
            if (this._adjustments[Car_1.eCarAdjustment.speedUp].active) {
                i = (this._adjustments[Car_1.eCarAdjustment.speedUp].timer - Game.Global.elapsedTime) / 500;
                if (i < 1) {
                    this._adjSpeedUpFx.alpha = i;
                }
                else if (this._adjSpeedUpFx.alpha < 1) {
                    i = this._adjSpeedUpFx.alpha + (0.04 * Game.Global.deltaRatio);
                    if (i > 1)
                        i = 1;
                    this._adjSpeedUpFx.alpha = i;
                }
            }
            else {
                i = this._adjSpeedUpFx.alpha - (0.04 * Game.Global.deltaRatio);
                if (i > 0) {
                    this._adjSpeedUpFx.alpha = i;
                }
                else {
                    this._adjSpeedUpFx.kill();
                }
            }
        };
        Car.prototype.updateSlowDownFx = function () {
            if (!this._adjustments[Car_1.eCarAdjustment.slowDown].active) {
                var alpha = this._adjSlowDownFx.alpha - (0.04 * Game.Global.deltaRatio);
                if (alpha > 0) {
                    this._adjSlowDownFx.alpha = alpha;
                }
                else {
                    this._adjSlowDownFx.kill();
                }
            }
        };
        Car.prototype.updateTurn = function () {
            var desiredTorque = 0;
            var turnForce = this._settings.turnForce * this._settingsAdjustment.turnForce;
            if (this._turnDir < 0) {
                desiredTorque = -turnForce;
            }
            else if (this._turnDir > 0) {
                desiredTorque = turnForce;
            }
            this._spriteBox2dBody.ApplyTorque(desiredTorque);
        };
        Car.prototype.updateDrive = function () {
            var forwardNormal = this._vecPool.getItem();
            var forwardVelocity = this.getForwardVelocity();
            var speed = box2d.b2DotVV(forwardVelocity, this._spriteBox2dBody.GetWorldVector(this._forVelLocVec, forwardNormal));
            this._forwardSpeed = speed;
            this._vecPool.returnItem(forwardVelocity);
            if (!HUD.RaceTime.instance.outOfTime) {
                var desiredSpeed = this._settings.maxSpeed * this._settingsAdjustment.maxSpeed;
                if (speed < desiredSpeed) {
                    var acceleration = this._settings.acceleration * this._settingsAdjustment.acceleration;
                    var force = acceleration + (speed / desiredSpeed) * (acceleration * 2);
                    this._spriteBox2dBody.ApplyForceToCenter(forwardNormal.SelfMul(force));
                }
            }
            this._vecPool.returnItem(forwardNormal);
        };
        Car.prototype.updateFriction = function () {
            var body = this._spriteBox2dBody;
            var mass = body.GetMass();
            var angularVelocity = this.getVelocityForLocVec(this._latVelLocVec);
            var impulse = this._vecPool.getItem();
            impulse.SetXY(-angularVelocity.x * mass, -angularVelocity.y * mass);
            this._vecPool.returnItem(angularVelocity);
            var impulseLen = impulse.Length();
            var maxLateralImpulse = this._settings.maxLateralImpulse * this._settingsAdjustment.maxLateralImpulse;
            if (impulseLen > maxLateralImpulse) {
                impulse.SelfMul(maxLateralImpulse / impulseLen);
                if (!this._skidSfxState && impulseLen > maxLateralImpulse * 1.5) {
                    this._skidSfxState = true;
                    Utils.AudioUtils.playSound("skid");
                }
                if (this._skid == 0) {
                    this._skid = 2;
                }
            }
            else {
                this._skid = 0;
                if (this._skidSfxState) {
                    this._skidSfxState = false;
                    Utils.AudioUtils.stopSound("skid");
                }
            }
            var bodyCenter = this._vecPool.getItem();
            body.ApplyLinearImpulse(impulse, body.GetWorldCenter(bodyCenter));
            body.ApplyAngularImpulse(0.1 * body.GetInertia() * -body.GetAngularVelocity());
            this._vecPool.returnItem(impulse);
            this._vecPool.returnItem(bodyCenter);
            var forwardVelocity = this.getForwardVelocity();
            var forwardSpeed = forwardVelocity.Normalize();
            var dragForceMagnitude = -1.5 * forwardSpeed;
            body.ApplyForceToCenter(forwardVelocity.SelfMul(dragForceMagnitude));
            this._vecPool.returnItem(forwardVelocity);
        };
        Car.prototype.getVelocityForLocVec = function (locVec) {
            var normal = this._vecPool.getItem();
            var velocity = this._vecPool.getItem();
            this._spriteBox2dBody.GetWorldVector(locVec, normal);
            this._spriteBox2dBody.GetLinearVelocity(velocity);
            normal.SelfMul(normal.Dot(velocity));
            this._vecPool.returnItem(velocity);
            return normal;
        };
        Car.prototype.getForwardVelocity = function () {
            return this.getVelocityForLocVec(this._forVelLocVec);
        };
        Car.prototype.getWheelPos = function (wheel) { return this._wheelWorldPos[wheel]; };
        Car.prototype.updateWheelPos = function () {
            var body = this._spriteBody;
            var wheelId = 4;
            var res = this._vecPool.getItem();
            while (wheelId--) {
                body.toWorldPoint(res, this._wheelLocalPos[wheelId]);
                this._wheelWorldPos[wheelId].set(Math.round(res.x), Math.round(res.y));
            }
            this._vecPool.returnItem(res);
        };
        Car.prototype.updateTerrainInfluence = function () {
            var map = GameMap.Map.instance;
            var influenceCnt = this._terrainInfluenceCnt;
            influenceCnt[0] = 0;
            influenceCnt[1] = 0;
            for (var wheelId = 0; wheelId < 4; wheelId++) {
                var wheelPos = this._wheelWorldPos[wheelId];
                var terrain = map.getTerrainData(this._view, wheelPos.x, wheelPos.y);
                if (terrain != 0)
                    influenceCnt[terrain - 1]++;
            }
            var adjustmentRatio = influenceCnt[0] / 4;
            if (adjustmentRatio != 0) {
                this._settingsAdjustment.acceleration *= (1 - 0.4 * adjustmentRatio);
                this._settingsAdjustment.maxSpeed *= (1 - 0.4 * adjustmentRatio);
            }
            adjustmentRatio = influenceCnt[1] / 4;
            if (adjustmentRatio != 0) {
                this._settingsAdjustment.maxLateralImpulse *= (1 + 0.5 * adjustmentRatio);
            }
        };
        Car.prototype.initAdjustments = function () {
            if (Car._adjustmentActFnc == undefined) {
                Car._adjustmentActFnc = [];
                Car._adjustmentActFnc[Car_1.eCarAdjustment.speedUp] = this.activateSpeedUpAdjustment;
                Car._adjustmentActFnc[Car_1.eCarAdjustment.slowDown] = this.activateSlowDownAdjustment;
                Car._adjustmentActFnc[Car_1.eCarAdjustment.lessGrip] = this.activateLessGripAdjustment;
                Car._adjustmentUpdateFnc = [];
                Car._adjustmentUpdateFnc[Car_1.eCarAdjustment.speedUp] = this.updateSpeedUpAdjustment;
                Car._adjustmentUpdateFnc[Car_1.eCarAdjustment.slowDown] = this.updateSlowDownAdjustment;
                Car._adjustmentUpdateFnc[Car_1.eCarAdjustment.lessGrip] = this.updateLessGripAdjustment;
                Car._adjustmentDeactFnc = [];
                Car._adjustmentDeactFnc[Car_1.eCarAdjustment.speedUp] = null;
                Car._adjustmentDeactFnc[Car_1.eCarAdjustment.slowDown] = null;
                Car._adjustmentDeactFnc[Car_1.eCarAdjustment.lessGrip] = this.deactivateLessGrip;
            }
            this._adjustments = [];
            this._adjustments[Car_1.eCarAdjustment.speedUp] = new Car_1.CarAdjustment(Car_1.eCarAdjustment.speedUp, 1000);
            this._adjustments[Car_1.eCarAdjustment.slowDown] = new Car_1.CarAdjustment(Car_1.eCarAdjustment.slowDown, 2000);
            this._adjustments[Car_1.eCarAdjustment.lessGrip] = new Car_1.CarAdjustment(Car_1.eCarAdjustment.lessGrip, 2000);
        };
        Car.prototype.resetAdjustments = function () {
            this._firstActAdjustment = null;
            var i = this._adjustments.length;
            while (i-- != 0)
                this._adjustments[i].deactivate();
        };
        Car.prototype.activateAdjustment = function (adjustment) {
            if (this._adjustments[adjustment].active) {
                this._adjustments[adjustment].renew();
            }
            else {
                Car._adjustmentActFnc[adjustment].call(this);
                var adj = this._adjustments[adjustment];
                adj.activate(this._firstActAdjustment);
                this._firstActAdjustment = adj;
                Utils.AudioUtils.playSound(adjustment == Car_1.eCarAdjustment.speedUp ? "speed_up" : "slow_down");
            }
        };
        Car.prototype.activateSpeedUpAdjustment = function () {
            this._adjustments[Car_1.eCarAdjustment.slowDown].deactivate();
            this._adjSpeedUpFx.reset(0, 0);
            this._adjSpeedUpFx.alpha = 0;
            this._adjSpeedUpFx.animations.play("run");
        };
        Car.prototype.updateSpeedUpAdjustment = function () {
            this._settingsAdjustment.acceleration *= 1.3;
            this._settingsAdjustment.maxSpeed *= 1.3;
            this._settingsAdjustment.maxLateralImpulse *= 1.2;
        };
        Car.prototype.activateSlowDownAdjustment = function () {
            this._adjustments[Car_1.eCarAdjustment.speedUp].deactivate();
            this._adjSlowDownFx.reset(0, 0);
            this._adjSlowDownFx.alpha = 1;
        };
        Car.prototype.updateSlowDownAdjustment = function () {
            this._settingsAdjustment.acceleration *= 0.7;
            this._settingsAdjustment.maxSpeed *= 0.7;
        };
        Car.prototype.activateLessGripAdjustment = function () {
            this._oilStains.start();
        };
        Car.prototype.updateLessGripAdjustment = function () {
            this._settingsAdjustment.maxLateralImpulse *= 0.7;
            this._settingsAdjustment.turnForce *= 1.3;
        };
        Car.prototype.deactivateLessGrip = function () {
            this._oilStains.stop();
        };
        Car.prototype.pickupBonus = function (bonusType, bonusPos, group) {
            if (group === void 0) { group = 0; }
            if (!this._sprite.exists)
                return;
            var play = Game.Play.instance;
            switch (bonusType) {
                case GameObjects.eBonusType.energy: {
                    HUD.RaceTime.instance.addTime();
                    play.showPopupMessage("+5 sec", bonusPos.x, bonusPos.y - 10);
                    Utils.AudioUtils.playSound("pick_up_energy");
                    break;
                }
                case GameObjects.eBonusType.coin: {
                    if (group != this._coinGroup) {
                        this._coinGroup = group;
                        this._coinGroupSize = 0;
                    }
                    var score = 50 * ++this._coinGroupSize;
                    play.addScore(score);
                    play.showPopupMessage("+" + score, bonusPos.x, bonusPos.y - 10);
                    Utils.AudioUtils.playSound("pick_up_coin");
                    break;
                }
            }
        };
        Car.prototype.barrierCollision = function (carBody, barrierBody, carFixture, barrierFixture, contact, impulseInfo) {
            var i = impulseInfo.count;
            var impulse = 0;
            while (i-- != 0) {
                var imp = impulseInfo.normalImpulses[i];
                if (imp > impulse)
                    impulse = imp;
            }
            var minImpulse = 3.5;
            if (barrierBody.sprite instanceof GameObjects.GameObjectSprite) {
                minImpulse = 1.5;
            }
            if (impulse > minImpulse) {
                Utils.AudioUtils.playSound("hit_hard");
            }
        };
        return Car;
    }());
    Car.SCORE_DISTANCE_RATIO = 10;
    Car.SAVE_INTERVAL = 1000 / 5;
    Car_1.Car = Car;
})(Car || (Car = {}));
var Car;
(function (Car) {
    var eCarAdjustment;
    (function (eCarAdjustment) {
        eCarAdjustment[eCarAdjustment["speedUp"] = 0] = "speedUp";
        eCarAdjustment[eCarAdjustment["slowDown"] = 1] = "slowDown";
        eCarAdjustment[eCarAdjustment["lessGrip"] = 2] = "lessGrip";
    })(eCarAdjustment = Car.eCarAdjustment || (Car.eCarAdjustment = {}));
    var CarAdjustment = (function () {
        function CarAdjustment(type, lifeSpan) {
            this._type = type;
            this._lifeSpan = lifeSpan;
        }
        Object.defineProperty(CarAdjustment.prototype, "active", {
            get: function () { return this._active; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CarAdjustment.prototype, "next", {
            get: function () { return this._next; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CarAdjustment.prototype, "timer", {
            get: function () { return this._timer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CarAdjustment.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CarAdjustment.prototype, "lifeSpan", {
            get: function () { return this._lifeSpan; },
            enumerable: true,
            configurable: true
        });
        CarAdjustment.prototype.activate = function (next) {
            this._next = next;
            this._timer = Game.Global.elapsedTime + this._lifeSpan;
            this._active = true;
        };
        CarAdjustment.prototype.deactivate = function (prev) {
            if (prev === void 0) { prev = null; }
            if (prev != null)
                prev._next = this._next;
            this._active = false;
        };
        CarAdjustment.prototype.renew = function () {
            this._timer = Game.Global.elapsedTime + this._lifeSpan;
        };
        return CarAdjustment;
    }());
    Car.CarAdjustment = CarAdjustment;
})(Car || (Car = {}));
var Car;
(function (Car) {
    var CarSettings = (function () {
        function CarSettings(maxSpeed, acceleration, maxLateralImpulse, turnForce) {
            this.maxSpeed = maxSpeed;
            this.acceleration = acceleration;
            this.maxLateralImpulse = maxLateralImpulse;
            this.turnForce = turnForce;
        }
        CarSettings.prototype.reset = function () {
            this.maxSpeed = 1;
            this.acceleration = 1;
            this.maxLateralImpulse = 1;
            this.turnForce = 1;
        };
        CarSettings.prototype.copyFrom = function (from) {
            this.maxSpeed = from.maxSpeed;
            this.acceleration = from.acceleration;
            this.maxLateralImpulse = from.maxLateralImpulse;
            this.turnForce = from.turnForce;
        };
        return CarSettings;
    }());
    Car.CarSettings = CarSettings;
})(Car || (Car = {}));
var Car;
(function (Car) {
    var CarGhostRecord = (function () {
        function CarGhostRecord() {
        }
        Object.defineProperty(CarGhostRecord.prototype, "time", {
            get: function () { return this._time; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CarGhostRecord.prototype, "x", {
            get: function () { return this._x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CarGhostRecord.prototype, "y", {
            get: function () { return this._y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CarGhostRecord.prototype, "angle", {
            get: function () { return this._angle; },
            enumerable: true,
            configurable: true
        });
        CarGhostRecord.prototype.load = function (dataOffset) {
            var dataView = Game.Global.ghost.carData;
            this._time = dataView.getUint32(dataOffset, false);
            this._x = dataView.getUint16(dataOffset + CarGhostRecord.DATA_OFF_X, false);
            this._y = -dataView.getUint32(dataOffset + CarGhostRecord.DATA_OFF_Y, false);
            this._angle = dataView.getInt16(dataOffset + CarGhostRecord.DATA_OFF_ANGLE, false);
        };
        CarGhostRecord.loadTime = function (dataOffset) {
            return Game.Global.ghost.carData.getUint32(dataOffset, false);
        };
        CarGhostRecord.save = function (car, dataView, dataOffset) {
            dataView.setUint32(dataOffset, Game.Global.elapsedTime - Game.Play.startTime, false);
            dataView.setUint16(dataOffset + CarGhostRecord.DATA_OFF_X, Math.round(car.x), false);
            dataView.setUint32(dataOffset + CarGhostRecord.DATA_OFF_Y, -Math.round(car.y), false);
            dataView.setInt16(dataOffset + CarGhostRecord.DATA_OFF_ANGLE, Math.round(Phaser.Math.radToDeg(car.body.data.GetAngle())), false);
        };
        return CarGhostRecord;
    }());
    CarGhostRecord.DATA_OFF_X = 4;
    CarGhostRecord.DATA_OFF_Y = CarGhostRecord.DATA_OFF_X + 2;
    CarGhostRecord.DATA_OFF_ANGLE = CarGhostRecord.DATA_OFF_Y + 4;
    CarGhostRecord.DATA_SIZE = CarGhostRecord.DATA_OFF_ANGLE + 2;
    Car.CarGhostRecord = CarGhostRecord;
})(Car || (Car = {}));
var Car;
(function (Car) {
    var GhostCar = (function () {
        function GhostCar() {
            this._sprite = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "car_0");
            this._sprite.anchor.set(0.5);
            this._sprite.alpha = 0.4;
            this._sprite.animations.add("move", ["car_0", "car_1"], 12, true, false);
            this._rec1 = new Car.CarGhostRecord();
            this._rec2 = new Car.CarGhostRecord();
        }
        Object.defineProperty(GhostCar.prototype, "completed", {
            get: function () { return this._completed; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GhostCar.prototype, "visible", {
            get: function () { return this._sprite.visible; },
            set: function (visible) {
                this._sprite.exists = this._sprite.visible = visible;
            },
            enumerable: true,
            configurable: true
        });
        GhostCar.prototype.reset = function () {
            this._sprite.position.set(GameMap.Map.WORLD_W_PIX / 2, -100);
            this._sprite.angle = 0;
            this._sprite.animations.stop();
            if (Game.Global.ghost.valid) {
                this._rec1.load(0);
                this._rec2.load(Car.CarGhostRecord.DATA_SIZE);
                this._dataOffset = 2 * Car.CarGhostRecord.DATA_SIZE;
                this._completed = false;
            }
            else {
                this._completed = true;
            }
            if (Game.Global.gameeGhostMode && Game.Play.instance.state != Game.ePlayState.waitForGameeStartEvent) {
                if (Game.Global.game.device.iOS) {
                    Gamee2.Gamee.ghostScore = 0;
                }
                else {
                    Gamee2.Gamee.ghostScore = Game.Global.ghost.score;
                }
            }
        };
        GhostCar.prototype.start = function () {
            this._sprite.animations.play("move");
            if (Game.Global.game.device.iOS && Game.Global.gameeGhostMode)
                Gamee2.Gamee.ghostScore = Game.Global.ghost.score;
        };
        GhostCar.prototype.stop = function () {
            this._sprite.animations.stop();
        };
        GhostCar.prototype.update = function () {
            if (this._completed)
                return;
            var gameTime = Game.Global.elapsedTime - Game.Play.startTime;
            while (this._rec2.time <= gameTime) {
                if (this._dataOffset == Game.Global.ghost.carDataSize) {
                    this._completed = true;
                    return;
                }
                var rec = this._rec1;
                this._rec1 = this._rec2;
                this._rec2 = rec;
                rec.load(this._dataOffset);
                this._dataOffset += Car.CarGhostRecord.DATA_SIZE;
            }
            if (this._sprite.visible) {
                var progress = (gameTime - this._rec1.time) / (this._rec2.time - this._rec1.time);
                this._sprite.position.set(this._rec1.x + (this._rec2.x - this._rec1.x) * progress, this._rec1.y + (this._rec2.y - this._rec1.y) * progress);
                this._sprite.angle = this._rec1.angle + (this._rec2.angle - this._rec1.angle) * progress;
                var play = Game.Play.instance;
                if (play.state == Game.ePlayState.replay)
                    play.updateCamera(this._sprite.x, this._sprite.y, this._sprite.rotation, 5);
            }
        };
        return GhostCar;
    }());
    Car.GhostCar = GhostCar;
})(Car || (Car = {}));
var Car;
(function (Car) {
    var SkidLine = (function () {
        function SkidLine() {
            this._images = [];
            for (var i = 0; i < 2; i++) {
                var image = Game.Global.game.make.image(0, 0, Game.Global.ATLAS_0, "skidLine");
                image.anchor.set(0, 0.5);
                this._images.push(image);
            }
            this.next = null;
        }
        SkidLine.prototype.activate = function (startPos, car) {
            var layer = Game.Play.instance.skidLinesLayer;
            for (var i = 0; i < 2; i++) {
                var sPos = startPos[i];
                var ePos = car.getWheelPos(Car.eCarWheel.bLeft + i);
                var image = this._images[i];
                image.position.copyFrom(sPos);
                image.width = sPos.distance(ePos, true);
                image.rotation = sPos.angle(ePos, false);
                layer.add(image, true);
                sPos.copyFrom(ePos);
            }
            this._timer = Game.Global.elapsedTime;
        };
        SkidLine.prototype.deactivate = function () {
            var layer = this._images[0].parent;
            if (layer != null) {
                var i = this._images.length;
                while (i-- != 0)
                    layer.removeChild(this._images[i]);
            }
        };
        SkidLine.prototype.update = function () {
            var progress = (Game.Global.elapsedTime - this._timer) / SkidLine.LIFE_SPAN;
            if (progress >= 1) {
                this.deactivate();
                return false;
            }
            var alpha = 1 - progress;
            var wheelId = this._images.length;
            while (wheelId-- != 0)
                this._images[wheelId].alpha = alpha;
            return true;
        };
        return SkidLine;
    }());
    SkidLine.LIFE_SPAN = 1000;
    Car.SkidLine = SkidLine;
})(Car || (Car = {}));
var Car;
(function (Car) {
    var SkidFxManager = (function () {
        function SkidFxManager(car) {
            this._car = car;
            this._carLastPos = new Phaser.Point();
            this._firstFreeLine = null;
            this._firstActLine = null;
            this._nextLinePos = [new Phaser.Point(), new Phaser.Point()];
            this._smokeEmitters = [];
            for (var i = 0; i < 2; i++) {
                var emitter = Game.Global.game.make.emitter(0, 0, 50);
                emitter.makeParticles(Game.Global.ATLAS_0, "smokeParticle", 50, false, false);
                emitter.setAlpha(1, 0, 500);
                emitter.setScale(0, 2, 0, 2, 400);
                emitter.setXSpeed(0, 0);
                emitter.setYSpeed(0, 0);
                emitter.gravity = 0;
                emitter.start(false, 500, 50);
                Game.Play.instance.skidSmokeLayer.add(emitter);
                this._smokeEmitters.push(emitter);
            }
        }
        Object.defineProperty(SkidFxManager.prototype, "car", {
            get: function () { return this._car; },
            enumerable: true,
            configurable: true
        });
        SkidFxManager.prototype.reset = function () {
            var line = this._firstActLine;
            while (line != null) {
                line.deactivate();
                var lastLine = line;
                line = line.next;
                lastLine.next = this._firstFreeLine;
                this._firstFreeLine = lastLine;
            }
            this._firstActLine = null;
            this._smokeEmitters[0].on = false;
            this._smokeEmitters[1].on = false;
        };
        SkidFxManager.prototype.start = function () {
            var car = this._car;
            this._carLastPos.copyFrom(car.position);
            for (var i = 0; i < 2; i++) {
                this._nextLinePos[i].copyFrom(car.getWheelPos(Car.eCarWheel.bLeft + i));
                this._smokeEmitters[i].on = true;
            }
        };
        SkidFxManager.prototype.update = function () {
            var line = this._firstActLine;
            var nextLine;
            var prevLine = null;
            while (line != null) {
                nextLine = line.next;
                if (!line.update()) {
                    if (prevLine == null) {
                        this._firstActLine = nextLine;
                    }
                    else {
                        prevLine.next = nextLine;
                    }
                    line.next = this._firstFreeLine;
                    this._firstFreeLine = line;
                    line = prevLine;
                }
                prevLine = line;
                line = nextLine;
            }
            if (this._car.skid) {
                var dis = Phaser.Point.distance(this._carLastPos, this._car, false);
                if (dis >= SkidFxManager.LINE_INTERVAL) {
                    var line_1 = this._firstFreeLine;
                    if (line_1 != null) {
                        this._firstFreeLine = line_1.next;
                    }
                    else {
                        line_1 = new Car.SkidLine();
                    }
                    line_1.next = this._firstActLine;
                    this._firstActLine = line_1;
                    line_1.activate(this._nextLinePos, this._car);
                    this._carLastPos.copyFrom(this._car.position);
                }
                for (var i = 0; i < 2; i++) {
                    var wheelPos = this._car.getWheelPos(Car.eCarWheel.bLeft + i);
                    this._smokeEmitters[i].emitX = wheelPos.x;
                    this._smokeEmitters[i].emitY = wheelPos.y;
                }
            }
            else if (this._smokeEmitters[0].on) {
                this._smokeEmitters[0].on = false;
                this._smokeEmitters[1].on = false;
            }
        };
        return SkidFxManager;
    }());
    SkidFxManager.LINE_INTERVAL = 20;
    Car.SkidFxManager = SkidFxManager;
})(Car || (Car = {}));
var Car;
(function (Car) {
    var OilStain = (function (_super) {
        __extends(OilStain, _super);
        function OilStain() {
            var _this = _super.call(this, Game.Global.game, 0, 0, Game.Global.ATLAS_0, "carOilStain_0") || this;
            _this.anchor.set(0.5);
            return _this;
        }
        OilStain.prototype.activate = function (x, y, rotation) {
            this._timer = Game.Global.elapsedTime;
            this.frameName = "carOilStain_" + Game.Global.game.rnd.integerInRange(0, OilStain.VERSION_CNT - 1);
            this.position.set(x, y);
            this.alpha = 1;
            this.rotation = rotation;
            Game.Play.instance.oilStainsLayer.addChild(this);
        };
        OilStain.prototype.update = function () {
            var lifePos = (Game.Global.elapsedTime - this._timer) / OilStain.LIFE_SPAN;
            if (lifePos < 1) {
                this.alpha = 1 - lifePos;
            }
            else {
                this.parent.removeChild(this);
                Car.OilStainManager.stainPool.returnItem(this);
            }
        };
        return OilStain;
    }(Phaser.Image));
    OilStain.VERSION_CNT = 2;
    OilStain.LIFE_SPAN = 750;
    Car.OilStain = OilStain;
})(Car || (Car = {}));
var Car;
(function (Car) {
    var OilStainManager = (function () {
        function OilStainManager(car) {
            if (OilStainManager._stainPool == undefined) {
                OilStainManager._stainPool = new Collections.Pool(Car.OilStain, 6, true);
            }
            this._car = car;
            this._active = false;
        }
        Object.defineProperty(OilStainManager, "stainPool", {
            get: function () { return OilStainManager._stainPool; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OilStainManager.prototype, "active", {
            get: function () { return this._active; },
            enumerable: true,
            configurable: true
        });
        OilStainManager.prototype.reset = function () {
            var layer = Game.Play.instance.oilStainsLayer;
            layer.forEachAlive(function (stain) {
                OilStainManager._stainPool.returnItem(stain);
            }, this);
            layer.removeAll(false, true, false);
        };
        OilStainManager.prototype.start = function () {
            this._nextStainTime = Game.Global.elapsedTime;
            this._active = true;
        };
        OilStainManager.prototype.stop = function () {
            this._active = false;
        };
        OilStainManager.prototype.update = function () {
            if (this._active && Game.Global.elapsedTime >= this._nextStainTime) {
                var carBody = this._car.body;
                OilStainManager._stainPool.getItem().activate(carBody.x, carBody.y, carBody.rotation);
                this._nextStainTime = Game.Global.elapsedTime + OilStainManager.STAIN_INTERVAL;
            }
        };
        return OilStainManager;
    }());
    OilStainManager.STAIN_INTERVAL = 200;
    Car.OilStainManager = OilStainManager;
})(Car || (Car = {}));
var Ghost;
(function (Ghost_1) {
    var Ghost = (function () {
        function Ghost() {
            this._pathBlocksNum = 0;
            this._carDataSize = 0;
            this._score = 0;
        }
        Object.defineProperty(Ghost.prototype, "valid", {
            get: function () { return this._pathBlocksNum != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ghost.prototype, "path", {
            get: function () { return this._path; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ghost.prototype, "pathBlocksNum", {
            get: function () { return this._pathBlocksNum; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ghost.prototype, "carData", {
            get: function () { return this._carData; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ghost.prototype, "carDataSize", {
            get: function () { return this._carDataSize; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ghost.prototype, "score", {
            get: function () { return this._score; },
            enumerable: true,
            configurable: true
        });
        Ghost.prototype.createFromGameeData = function (data) {
            this._path = new DataView(new ArrayBuffer(data.pathBlocksNum * GameMap.PathBlock.SAVE_DATA_SIZE));
            Utils.base64ToAb(this._path.buffer, data.path);
            this._pathBlocksNum = data.pathBlocksNum;
            this._carData = new DataView(new ArrayBuffer(data.carDataSize));
            Utils.base64ToAb(this._carData.buffer, data.carData);
            this._carDataSize = data.carDataSize;
            this._score = data.score;
            if (this._score == undefined)
                this._score = 0;
        };
        Ghost.prototype.createFromPlayerData = function () {
            var pathGenerator = GameMap.Map.instance.path;
            this._path = new DataView(pathGenerator.saveData.buffer.slice(0, pathGenerator.savedBlocksNum * GameMap.PathBlock.SAVE_DATA_SIZE));
            this._pathBlocksNum = pathGenerator.savedBlocksNum;
            var player = Game.Play.instance.player;
            this._carData = new DataView(player.saveData.buffer.slice(0, player.saveDataSize));
            this._carDataSize = player.saveDataSize;
        };
        return Ghost;
    }());
    Ghost_1.Ghost = Ghost;
})(Ghost || (Ghost = {}));
var HUD;
(function (HUD) {
    var EnergyBar = (function () {
        function EnergyBar() {
        }
        Object.defineProperty(EnergyBar, "instance", {
            get: function () { return EnergyBar._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnergyBar.prototype, "energy", {
            get: function () { return this._totalEnergy; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnergyBar.prototype, "outOfEnergyTime", {
            get: function () { return this._outOfEnergyTime; },
            enumerable: true,
            configurable: true
        });
        return EnergyBar;
    }());
    EnergyBar.START_ENERGY = 25 * Game.Global.FPS;
    EnergyBar.BONUS_ENERGY = 6 * Game.Global.FPS;
    HUD.EnergyBar = EnergyBar;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var Map = (function () {
        function Map() {
            Map._instance = this;
            var game = Game.Global.game;
            this._layer = game.add.group();
            this._layer.fixedToCamera = true;
            var img = game.add.image(0, 0, Game.Global.ATLAS_0, "hudMapLine", this._layer);
            img.anchor.set(0.5, 0.025);
            this._checkpointPool = new Collections.Pool(HUD.MapCheckpoint, 3, true);
            this._checkpoints = new Collections.WrappedArray();
            this._plIcon = game.add.image(0, 0, Game.Global.ATLAS_0, "hudMapPlIcon", this._layer);
            this._plIcon.anchor.set(0.5);
            this._message = new HUD.CheckpointSlideMessage();
            Game.Play.instance.onResize.add(this.updatePosition, this);
            this._player = Game.Play.instance.player;
        }
        Object.defineProperty(Map, "instance", {
            get: function () { return Map._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "layer", {
            get: function () { return this._layer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "checkpointId", {
            get: function () { return this._plSectionId; },
            enumerable: true,
            configurable: true
        });
        Map.prototype.reset = function (visible) {
            if (visible === void 0) { visible = true; }
            this._plSectionId = 0;
            if (visible) {
                this._layer.visible = true;
                while (this._checkpoints.itemCnt != 0) {
                    var cp = this._checkpoints.getItemAtIndex(0);
                    cp.deactivate();
                    this._checkpointPool.returnItem(cp);
                    this._checkpoints.removeItem(false);
                }
                this._nextCheckpointId = 0;
                this._nextCheckpointDis = Map.SECTION_DEF_LEN;
                this._plIcon.y = Map.HEIGHT;
                this._plIconMapPos = 0;
                this._message.kill();
                this.actNewCheckpoints();
            }
            else {
                this._layer.visible = false;
            }
        };
        Map.prototype.actNewCheckpoints = function () {
            var plIconMapPos = this._plIcon.y;
            var cpMapPos = plIconMapPos + (this._player.distance - this._nextCheckpointDis) * Map.SCALE;
            while (cpMapPos >= 0) {
                var cp = this._checkpointPool.getItem();
                this._checkpoints.addItem(cp);
                cp.activate(this._nextCheckpointId, this._nextCheckpointDis);
                cp.mapPosition = cpMapPos;
                this._nextCheckpointId++;
                this._nextCheckpointDis += (Map.SECTION_DEF_LEN + (this._nextCheckpointId * Map.NEW_SECTION_LEN_INC));
                cpMapPos = plIconMapPos + (this._player.distance - this._nextCheckpointDis) * Map.SCALE;
            }
        };
        Map.prototype.update = function () {
            if (this._message.state != SlideMessage.eMessageState.completed)
                this._message.update();
            var plPos = this._player.distance;
            var plMapPos = Math.floor(plPos * Map.SCALE);
            if (plMapPos == this._plIconMapPos)
                return;
            this._plIconMapPos = plMapPos;
            if (plMapPos > Map.PLICON_MAX_BOT_OFFSET)
                plMapPos = Map.PLICON_MAX_BOT_OFFSET;
            plMapPos = Map.HEIGHT - plMapPos;
            this._plIcon.y = plMapPos;
            var cpCnt = this._checkpoints.itemCnt;
            var cpId = 0;
            while (cpId < cpCnt) {
                var cp = this._checkpoints.getItemAtIndex(cpId);
                var cpMapPos = Math.floor(plMapPos + ((plPos - cp.distance) * Map.SCALE));
                if (!cp.reached && cpMapPos > plMapPos) {
                    cp.reached = true;
                    this._plSectionId++;
                    this._message.show(this._plSectionId, Game.Global.game.camera.height / 2);
                }
                if (cpMapPos > Map.HEIGHT) {
                    this._checkpoints.removeItem(false);
                    this._checkpointPool.returnItem(cp);
                    cp.deactivate();
                    cpCnt--;
                    continue;
                }
                cp.mapPosition = cpMapPos;
                cpId++;
            }
            this.actNewCheckpoints();
        };
        Map.prototype.updatePosition = function (camera) {
            this._layer.cameraOffset.set(30, (camera.height - Map.HEIGHT) / 2);
        };
        return Map;
    }());
    Map.SECTION_DEF_LEN = 10000;
    Map.NEW_SECTION_LEN_INC = 500;
    Map.SCALE = 0.018;
    Map.HEIGHT = 380;
    Map.PLICON_MAX_BOT_OFFSET = 100;
    HUD.Map = Map;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var MapCheckpoint = (function () {
        function MapCheckpoint() {
            this._layer = Game.Global.game.add.group();
            this._layer.parent.removeChild(this._layer);
            var img = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "hudMapCheckpoint", this._layer);
            img.anchor.set(17 / img.width, 20 / img.height);
            this._number = Game.Global.game.add.bitmapText(16, -9, Game.Global.FNT_HUD_CP_ID, "", 12, this._layer);
            this._number.anchor.set(0.5);
        }
        Object.defineProperty(MapCheckpoint.prototype, "distance", {
            get: function () { return this._distance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCheckpoint.prototype, "mapPosition", {
            get: function () { return this._layer.position.y; },
            set: function (pos) {
                if (this._layer.position.y != pos) {
                    this._layer.position.y = pos;
                    if (pos < MapCheckpoint.ALPHA_OFFSET) {
                        this._layer.alpha = (pos / MapCheckpoint.ALPHA_OFFSET);
                    }
                    else if (pos > HUD.Map.HEIGHT - MapCheckpoint.ALPHA_OFFSET) {
                        this._layer.alpha = 1 - ((pos - (HUD.Map.HEIGHT - MapCheckpoint.ALPHA_OFFSET)) / MapCheckpoint.ALPHA_OFFSET);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        MapCheckpoint.prototype.activate = function (id, distance) {
            this._number.text = (id + 1).toString();
            HUD.Map.instance.layer.add(this._layer, true, 1);
            this._distance = distance;
            this.reached = false;
        };
        MapCheckpoint.prototype.deactivate = function () {
            this._layer.parent.removeChild(this._layer);
        };
        return MapCheckpoint;
    }());
    MapCheckpoint.ALPHA_OFFSET = 20;
    HUD.MapCheckpoint = MapCheckpoint;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var CheckpointSlideMessage = (function (_super) {
        __extends(CheckpointSlideMessage, _super);
        function CheckpointSlideMessage() {
            var _this = _super.call(this) || this;
            var game = Game.Global.game;
            _this._msgType = new SlideMessage.MessageType(game, -1, 1000, Phaser.Easing.Elastic.Out, 0, Phaser.Easing.Cubic.Out, 500, 1500, Phaser.Easing.Cubic.In, 0, Phaser.Easing.Cubic.In);
            _this._msgContainer = game.make.image(0, 0, Game.Global.ATLAS_0, "msgBackground");
            _this._msgContainer.fixedToCamera = true;
            _this._msgContent = game.add.group(_this._msgContainer);
            game.add.image(0, 0, Game.Global.ATLAS_0, "msgCheckpoint", _this._msgContent);
            _this._msgCheckpointNum = game.add.bitmapText(_this._msgContent.width + 10, 0, Game.Global.FNT_HUD_NUMS_0, "1", 72, _this._msgContent);
            _this._msgContent.y = Math.floor((_this._msgContainer.height - _this._msgContent.height) / 2) + 2;
            return _this;
        }
        CheckpointSlideMessage.prototype.getMsgContainer = function () {
            return this._msgContainer;
        };
        CheckpointSlideMessage.prototype.show = function (cpNum, y, parent) {
            this._msgCheckpointNum.text = cpNum.toString();
            this._msgContent.x = Math.floor((this._msgContainer.width - this._msgContent.width) / 2);
            if (parent == undefined)
                parent = Game.Global.game.world;
            parent.addChild(this._msgContainer);
            parent.bringToTop(this._msgContainer);
            _super.prototype.showMessage.call(this, y, this._msgType, Game.Global.elapsedTime);
        };
        CheckpointSlideMessage.prototype.update = function () {
            var res = _super.prototype.update.call(this, Game.Global.elapsedTime);
            if (!res)
                this.kill();
            return res;
        };
        CheckpointSlideMessage.prototype.kill = function () {
            if (this._msgContainer.parent != null) {
                this._msgContainer.parent.removeChild(this._msgContainer);
                _super.prototype.kill.call(this);
            }
        };
        return CheckpointSlideMessage;
    }(SlideMessage.MessageBase));
    HUD.CheckpointSlideMessage = CheckpointSlideMessage;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var ScorePopupMessage = (function (_super) {
        __extends(ScorePopupMessage, _super);
        function ScorePopupMessage() {
            var _this = _super.call(this) || this;
            if (ScorePopupMessage._type == undefined) {
                ScorePopupMessage._type = new PopupMessage.MessageType(100, 1000, Phaser.Easing.Cubic.Out, 500, 1000, Phaser.Easing.Cubic.In);
            }
            _this._msgContainer = new Phaser.BitmapText(Game.Global.game, 0, 0, Game.Global.FNT_POPUP_SCORE, "", 30);
            _this._msgContainer.anchor.set(0.5, 1);
            return _this;
        }
        ScorePopupMessage.prototype.getMsgContainer = function () {
            return this._msgContainer;
        };
        ScorePopupMessage.prototype.show = function (x, y, message, parent) {
            this._msgContainer.text = message;
            parent.addChild(this._msgContainer);
            parent.bringToTop(this._msgContainer);
            _super.prototype.showMessage.call(this, x, y, ScorePopupMessage._type, Game.Global.elapsedTime);
        };
        ScorePopupMessage.prototype.update = function () {
            return _super.prototype.update.call(this, Game.Global.elapsedTime);
        };
        ScorePopupMessage.prototype.kill = function () {
            _super.prototype.kill.call(this);
            this._msgContainer.parent.removeChild(this._msgContainer);
        };
        return ScorePopupMessage;
    }(PopupMessage.MessageBase));
    HUD.ScorePopupMessage = ScorePopupMessage;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var StartCountdown = (function () {
        function StartCountdown() {
            var game = Game.Global.game;
            this._layer = game.make.group(null);
            this._layer.fixedToCamera = true;
            this._bg = game.add.image(0, 0, Game.Global.ATLAS_0, "msgBackground", this._layer);
            this._countdownImg = game.add.image(this._layer.width / 2, this._layer.height / 2, Game.Global.ATLAS_0, "msgStart1", this._layer);
            this._countdownImg.anchor.set(0.5);
            Game.Play.instance.onResize.add(this.updatePosition, this);
        }
        Object.defineProperty(StartCountdown.prototype, "active", {
            get: function () { return this._active; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StartCountdown.prototype, "countdown", {
            get: function () {
                return 3 - this._countdownPos;
            },
            enumerable: true,
            configurable: true
        });
        StartCountdown.prototype.reset = function () {
            if (this._layer.parent != null)
                this._layer.parent.removeChild(this._layer);
            this._active = false;
        };
        StartCountdown.prototype.show = function () {
            this._active = true;
            this._countdownPos = 0;
            this.setCountdownFrame();
            this._bg.alpha = 1;
            Game.Global.game.world.addChild(this._layer);
        };
        StartCountdown.prototype.update = function () {
            if (!this._active)
                return false;
            var progress = (Game.Global.elapsedTime - this._timer) / 750;
            if (progress > 1)
                progress = 1;
            this._countdownImg.alpha = 1 - Phaser.Easing.Cubic.In(progress);
            this._countdownImg.scale.set(1 + Phaser.Easing.Cubic.Out(progress));
            if (this._countdownPos == StartCountdown._countdownFrames.length - 1)
                this._bg.alpha = this._countdownImg.alpha;
            if (progress == 1) {
                if (++this._countdownPos == StartCountdown._countdownFrames.length) {
                    this._active = false;
                }
                else {
                    this.setCountdownFrame();
                }
            }
            return true;
        };
        StartCountdown.prototype.updatePosition = function (camera) {
            this._layer.cameraOffset.set(Math.floor(camera.width - this._layer.width) / 2, Math.floor(camera.height - this._layer.height) / 2);
        };
        StartCountdown.prototype.setCountdownFrame = function () {
            this._countdownImg.frameName = StartCountdown._countdownFrames[this._countdownPos];
            this._countdownImg.alpha = 1;
            this._countdownImg.scale.set(1);
            this._timer = Game.Global.elapsedTime;
            Utils.AudioUtils.playSound(this._countdownPos < StartCountdown._countdownFrames.length - 1 ? "countdownBeep" : "countdownGo");
        };
        return StartCountdown;
    }());
    StartCountdown._countdownFrames = ["msgStart3", "msgStart2", "msgStart1", "msgStartGO"];
    HUD.StartCountdown = StartCountdown;
})(HUD || (HUD = {}));
var Game;
(function (Game_1) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, {
                width: 128,
                height: 128,
                renderer: Phaser.AUTO,
                parent: "content",
                transparent: false,
                antialias: true,
                physicsConfig: null,
                forceSetTimeOut: false,
                preserveDrawingBuffer: true
            }) || this;
            _this.state.add("Boot", Game_1.Boot);
            _this.state.add("Preload", Game_1.Preload);
            _this.state.add("Play", Game_1.Play);
            _this.state.start("Boot");
            if (Game_1.Global.GAMEE) {
                Gamee2.Gamee.onStart.add(_this.onGameeStart, _this);
                Gamee2.Gamee.onPause.add(_this.onGameePause, _this);
                Gamee2.Gamee.onResume.add(_this.onGameeResume, _this);
                Gamee2.Gamee.onMute.add(_this.onGameeMute, _this);
                Gamee2.Gamee.onUnmute.add(_this.onGameeUnmute, _this);
            }
            return _this;
        }
        Game.prototype.onGameeStart = function (flags) {
            var curState = this.state.getCurrentState();
            if ((curState instanceof Game_1.Play)) {
                this.paused = false;
                curState.gameeStartGame(flags);
            }
        };
        Game.prototype.onGameePause = function () {
            Utils.AudioUtils.pauseMusic();
            this.paused = true;
        };
        Game.prototype.onGameeResume = function () {
            this.paused = false;
            Utils.AudioUtils.resumeMusic();
        };
        Game.prototype.onGameeMute = function () {
            Utils.AudioUtils.sfxOn = false;
            Utils.AudioUtils.musicOn = false;
        };
        Game.prototype.onGameeUnmute = function () {
            Utils.AudioUtils.sfxOn = true;
            Utils.AudioUtils.musicOn = true;
        };
        return Game;
    }(Phaser.Game));
    Game_1.Game = Game;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Sounds = (function () {
        function Sounds() {
        }
        return Sounds;
    }());
    Sounds.AUDIO_JSON = {
        "resources": [
            "sfx.ogg",
            "sfx.mp3"
        ],
        "spritemap": {
            "countdownBeep": {
                "start": 0,
                "end": 0.4148526077097506,
                "loop": false
            },
            "countdownGo": {
                "start": 2,
                "end": 2.470408163265306,
                "loop": false
            },
            "pick_up_coin": {
                "start": 4,
                "end": 5.0153968253968255,
                "loop": false
            },
            "game_over": {
                "start": 7,
                "end": 8.893356009070295,
                "loop": false
            },
            "hit_hard": {
                "start": 10,
                "end": 10.565328798185941,
                "loop": false
            },
            "hit_soft": {
                "start": 12,
                "end": 12.431995464852609,
                "loop": false
            },
            "low_energy": {
                "start": 14,
                "end": 14.194648526077097,
                "loop": false
            },
            "pick_up_energy": {
                "start": 16,
                "end": 16.720748299319727,
                "loop": false
            },
            "skid": {
                "start": 18,
                "end": 21.00174603174603,
                "loop": false
            },
            "slow_down": {
                "start": 23,
                "end": 24.906938775510206,
                "loop": false
            },
            "speed_up": {
                "start": 26,
                "end": 27.880816326530613,
                "loop": false
            }
        }
    };
    Game.Sounds = Sounds;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._gameMinDims = new Phaser.Point(Game.Global.GAME_MIN_WIDTH, Game.Global.GAME_MIN_HEIGHT);
            _this._gameMaxDims = new Phaser.Point(Game.Global.GAME_MAX_WIDTH, Game.Global.GAME_MAX_HEIGHT);
            _this._gameDims = new Phaser.Point();
            _this._userScale = new Phaser.Point(0, 0);
            return _this;
        }
        Boot.prototype.init = function () {
            this.input.maxPointers = 2;
            this.game.renderer.renderSession.roundPixels = true;
            this.stage.disableVisibilityChange = true;
            this._gameDims.x = undefined;
            this._gameDims.y = undefined;
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setResizeCallback(this.gameResized, this);
            this.gameResized(this.scale, null);
            this.world.resize(Game.Global.GAME_MAX_WIDTH, Game.Global.GAME_MAX_HEIGHT);
            if (this.game.device.iOS || (this.game.device.android && this.game.device.chrome && this.game.device.chromeVersion >= 55)) {
                this.game.sound.touchLocked = true;
                Game.Global.unlockAudio();
            }
        };
        Boot.prototype.create = function () {
            this.game.state.start("Preload");
        };
        Boot.prototype.calcGameDims = function () {
            var scale = this.scale;
            var i;
            var minAspectRatio = Math.min(this._gameMinDims.x, this._gameMaxDims.x) / Math.max(this._gameMinDims.y, this._gameMaxDims.y);
            var maxAspectRatio = Math.max(this._gameMinDims.x, this._gameMaxDims.x) / Math.min(this._gameMinDims.y, this._gameMaxDims.y);
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
                var oldW = this._gameDims.x;
                var oldH = this._gameDims.y;
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
                        if (typeof currentState.resized == "function") {
                            currentState.resized(dims.x, dims.y, oldW, oldH);
                        }
                    }
                }
            }
        };
        return Boot;
    }(Phaser.State));
    Game.Boot = Boot;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var ePlayState;
    (function (ePlayState) {
        ePlayState[ePlayState["startCountdown"] = 0] = "startCountdown";
        ePlayState[ePlayState["race"] = 1] = "race";
        ePlayState[ePlayState["gameOver"] = 2] = "gameOver";
        ePlayState[ePlayState["replay"] = 3] = "replay";
        ePlayState[ePlayState["replayCompleted"] = 4] = "replayCompleted";
        ePlayState[ePlayState["waitForGameeStartEvent"] = 5] = "waitForGameeStartEvent";
    })(ePlayState = Game.ePlayState || (Game.ePlayState = {}));
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._playerMaxDistance = 0;
            _this._cameraViewPoints = [0, 0, 0];
            return _this;
        }
        Object.defineProperty(Play, "instance", {
            get: function () { return Play._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play, "startTime", {
            get: function () { return Play._startTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "onResize", {
            get: function () { return this._onResize; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "map", {
            get: function () { return this._map; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "player", {
            get: function () { return this._player; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "oilStainsLayer", {
            get: function () { return this._oilStainsLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "skidLinesLayer", {
            get: function () { return this._skidLinesLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "skidSmokeLayer", {
            get: function () { return this._skidSmokeLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "objectLayers", {
            get: function () { return this._objectLayers; },
            enumerable: true,
            configurable: true
        });
        Play.prototype.init = function () {
            Play._instance = this;
            this._onResize = new Phaser.Signal();
            if (Game.Global.DEBUG)
                this.time.advancedTiming = true;
            if (Gamee2.Gamee.initialized) {
                Gamee2.Gamee.onGhostShow.add(this.gameeShowGhost, this);
                Gamee2.Gamee.onGhostHide.add(this.gameeHideGhost, this);
                if (!Gamee2.Gamee.initData.sound) {
                    Utils.AudioUtils.sfxOn = false;
                    Utils.AudioUtils.musicOn = false;
                }
            }
            this._gameeNewSocialData = true;
        };
        Play.prototype.create = function () {
            var vecPool = new Collections.Pool(box2d.b2Vec2, 6, true);
            this.physics.startSystem(Phaser.Physics.BOX2D);
            this._map = new GameMap.Map();
            this._mapView = new GameMap.MapViewPlayer();
            this._oilStainsLayer = this.add.group();
            this._skidLinesLayer = this.add.group();
            this._skidSmokeLayer = this.add.group();
            this._objectLayers = [this.add.group(), this.add.group()];
            this._ghost = new Car.GhostCar();
            if (!Game.Global.ghost.valid)
                this._ghost.visible = false;
            this._player = new Car.Car(new Car.CarSettings(11, 7, 0.25, 1.5), this._mapView, vecPool);
            this._popupScoreLayer = this.add.group();
            this._popupScore = new Utils.GameObjectCollection(HUD.ScorePopupMessage, null, null, 4);
            if (!Game.Global.gameeGhostMode)
                this._opponents = new Opponents.Manager();
            this._raceTime = new HUD.RaceTime();
            this._hudMap = new HUD.Map();
            this._startCountdown = new HUD.StartCountdown();
            if (Game.Global.DEBUG) {
                this._debugGfxLayer = this.add.graphics(0, 0);
                this._debugGfxLayer.fixedToCamera = true;
                this._debugGfxLayer.cameraOffset.set(0);
            }
            this.camera.bounds = null;
            this._state = Game.Global.GAMEE && Gamee2.Gamee.initialized && !Gamee2.Gamee.ready ? ePlayState.waitForGameeStartEvent : ePlayState.gameOver;
            this.reset();
            this.resized();
            if (Game.Global.GAMEE && Gamee2.Gamee.initialized && !Gamee2.Gamee.ready) {
                this.game.paused = true;
                Gamee2.Gamee.gameReady();
            }
        };
        Play.prototype.update = function () {
            if (this._state == ePlayState.waitForGameeStartEvent)
                return;
            Game.Global.elapsedTime = this.time.elapsedSince(Game.Global.timeBase);
            Game.Global.deltaRatio = this.time.elapsedMS / (1000 / 60);
            if (Game.Global.deltaRatio > 4)
                Game.Global.deltaRatio = 4;
            if (this._gameeUpdateScore && Game.Global.elapsedTime - this._gameeScoreUpdateTime >= Play.GAMEE_SCORE_UPDATE_INTERVAL) {
                this._gameeScoreUpdateTime = Game.Global.elapsedTime;
                this._gameeUpdateScore = false;
                Gamee2.Gamee.score = this._score;
            }
            if (this._startCountdown.active) {
                this._startCountdown.update();
                if (this._state == ePlayState.startCountdown && this._startCountdown.countdown == 0) {
                    this._state = ePlayState.race;
                    Play._startTime = Game.Global.elapsedTime;
                    this._player.start();
                    this._ghost.start();
                }
            }
            if (this._state == ePlayState.race) {
                this._player.update();
                this._ghost.update();
                this._hudMap.update();
                if (!Game.Global.gameeGhostMode)
                    this._opponents.update();
                if (!this._raceTime.update() && Game.Global.elapsedTime - this._raceTime.outOfTimeTime >= 2000)
                    this.gameOver();
                this._popupScore.updateObjects();
            }
            else if (this._state == ePlayState.replay) {
                this._ghost.update();
                if (this._ghost.completed) {
                    this._ghost.stop();
                    this._state = ePlayState.replayCompleted;
                    this._replayCompletedTime = Game.Global.elapsedTime;
                }
            }
            else if (this._state == ePlayState.replayCompleted) {
                if (Game.Global.elapsedTime - this._replayCompletedTime >= 2000)
                    this.reset(Gamee2.eStarFlag.replay);
            }
        };
        Play.prototype.preRender = function () {
            this._player.preRender();
        };
        Play.prototype.render = function () {
            if (Game.Global.DEBUG) {
                this._debugGfxLayer.clear();
                var x = 10;
                var y = 100;
                this.game.debug.text("fps: " + this.time.fps, x, y);
                y += 30;
                Game.Global.showDebugMessages(x, y, 30);
            }
        };
        Play.prototype.resumed = function () {
            Game.Global.timeBase += this.time.pauseDuration;
        };
        Play.prototype.resized = function () {
            var camera = this.camera;
            if (Game.Global.DEBUG) {
                this._debugGfxLayer.width = camera.width;
                this._debugGfxLayer.height = camera.height;
            }
            this._onResize.dispatch(camera);
        };
        Play.prototype.reset = function (flags) {
            if (flags === void 0) { flags = 0; }
            Game.Global.timeBase = this.time.elapsedSince(0);
            Game.Global.elapsedTime = 0;
            this.tweens.removeAll();
            this.time.events.removeAll();
            var replay = (flags & Gamee2.eStarFlag.replay) != 0;
            if (replay) {
                this._state = ePlayState.replay;
            }
            else if (this._state != ePlayState.waitForGameeStartEvent) {
                this._state = ePlayState.startCountdown;
            }
            this._score = 0;
            this._gameeUpdateScore = false;
            this._gameeScoreUpdateTime = 0;
            this._startCountdown.reset();
            this._ghost.reset();
            this._popupScore.reset();
            if (!Game.Global.gameeGhostMode)
                this._opponents.reset(this._gameeNewSocialData);
            this._gameeNewSocialData = false;
            if (this._state == ePlayState.waitForGameeStartEvent) {
                this._player.reset(false);
                this._raceTime.reset(false);
                this._hudMap.reset(false);
            }
            else {
                var replay_1 = (flags & Gamee2.eStarFlag.replay) != 0;
                this._player.reset(!replay_1);
                this._raceTime.reset(!replay_1);
                this._hudMap.reset(!replay_1);
                if (replay_1) {
                    this._ghost.start();
                    Play._startTime = 0;
                }
                else {
                    this._startCountdown.show();
                }
            }
            this.camera.x = Math.round((GameMap.Map.WORLD_W_PIX - this.camera.width) / 2);
            if (this.camera.x < 0) {
                this.camera.x = 0;
            }
            else if (this.camera.x + this.camera.width > GameMap.Map.WORLD_W_PIX) {
                this.camera.x = GameMap.Map.WORLD_W_PIX - this.camera.width;
            }
            this.camera.y = -this.camera.height;
            this._mapView.deactivateBlocks();
            this._map.reset();
            this._mapView.reset();
        };
        Play.prototype.gameOver = function () {
            if (Gamee2.Gamee.initialized) {
                var replayData = {
                    path: Utils.abToBase64(this._map.path.saveData.buffer, this._map.path.savedBlocksNum * GameMap.PathBlock.SAVE_DATA_SIZE),
                    pathBlocksNum: this._map.path.savedBlocksNum,
                    carData: Utils.abToBase64(this._player.saveData.buffer, this._player.saveDataSize),
                    carDataSize: this._player.saveDataSize,
                    score: this._score
                };
                Gamee2.Gamee.gameOver(JSON.stringify(replayData));
                this._state = ePlayState.gameOver;
                this._gameeNewSocialData = true;
                this.game.paused = true;
            }
            if (!Game.Global.gameeGhostMode) {
                var plDis = Math.round(this._player.distance);
                if (plDis > this._playerMaxDistance) {
                    this._playerMaxDistance = this._player.distance;
                    Game.Global.ghost.createFromPlayerData();
                    this._ghost.visible = true;
                }
            }
            if (!Gamee2.Gamee.initialized)
                this.reset();
        };
        Play.prototype.updateCamera = function (carX, carY, carRotation, cameraHSpeed) {
            var camera = this.camera;
            var viewPoints = this._cameraViewPoints;
            viewPoints[0] = Math.round(carX + Math.sin(carRotation - Play.CAMERA_VIEW_RANGE) * Play.CAMERA_VIEW_DISTANCE);
            viewPoints[1] = Math.round(carX + Math.sin(carRotation) * Play.CAMERA_VIEW_DISTANCE);
            viewPoints[2] = Math.round(carX + Math.sin(carRotation + Play.CAMERA_VIEW_RANGE) * Play.CAMERA_VIEW_DISTANCE);
            var cameraX = camera.x;
            for (var i = 0; i < 3; i++) {
                var x = viewPoints[i];
                if (x < 0) {
                    x = 0;
                }
                else if (x >= GameMap.Map.WORLD_W_PIX) {
                    x = GameMap.Map.WORLD_W_PIX - 1;
                }
                if (x < cameraX) {
                    if ((cameraX = Math.round(cameraX - cameraHSpeed * Game.Global.deltaRatio)) < x) {
                        cameraX = x;
                    }
                    else if (cameraX < 0) {
                        cameraX = 0;
                    }
                }
                else if (x >= cameraX + camera.width) {
                    cameraX = Math.round(camera.x + cameraHSpeed * Game.Global.deltaRatio);
                    if (cameraX + camera.width - 1 > x) {
                        cameraX = x - camera.width + 1;
                    }
                    else if (cameraX + camera.width > GameMap.Map.WORLD_W_PIX) {
                        cameraX = GameMap.Map.WORLD_W_PIX - camera.width;
                    }
                }
            }
            camera.x = cameraX;
            var cameraY = Math.round(carY + Play.CAR_VIEW_BOT_OFFSET - camera.height);
            if (camera.y < cameraY)
                cameraY = camera.y;
            camera.y = cameraY;
            this._mapView.setViewPosition(cameraX, cameraY);
        };
        Object.defineProperty(Play.prototype, "score", {
            get: function () { return this._score; },
            enumerable: true,
            configurable: true
        });
        Play.prototype.addScore = function (value) {
            this._score += value;
            if (Game.Global.GAMEE)
                this._gameeUpdateScore = true;
                console.log("score",this._score)
                var score =(this._score)/100
                var tmp=""
                tmp +=score
                  
                $("#score").html(tmp)
        };
        Play.prototype.showPopupMessage = function (message, x, y) {
            this._popupScore.activateObject().show(x, y, message, this._popupScoreLayer);
        };
        Play.prototype.gameeStartGame = function (flags) {
            if (this._state == ePlayState.waitForGameeStartEvent)
                this._state = ePlayState.gameOver;
            this.reset(flags);
        };
        Play.prototype.gameeShowGhost = function () {
            this._ghost.visible = true;
        };
        Play.prototype.gameeHideGhost = function () {
            this._ghost.visible = false;
        };
        return Play;
    }(Phaser.State));
    Play.CAR_VIEW_BOT_OFFSET = 200;
    Play.GAMEE_SCORE_UPDATE_INTERVAL = 1000;
    Play.CAMERA_VIEW_DISTANCE = 400;
    Play.CAMERA_VIEW_RANGE = Phaser.Math.degToRad(22.5);
    Game.Play = Play;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._ready = false;
            return _this;
        }
        Preload.prototype.preload = function () {
            this.load.baseURL = "assets/";
            this.load.atlasJSONArray(Game.Global.ATLAS_0);
            this.load.image("tileset");
            this.load.bitmapFont(Game.Global.FNT_HUD_CP_ID);
            this.load.bitmapFont(Game.Global.FNT_HUD_NUMS_0);
            this.load.bitmapFont(Game.Global.FNT_HUD_NUMS_1);
            this.load.bitmapFont(Game.Global.FNT_POPUP_SCORE);
            this.load.bitmapFont(Game.Global.FNT_OPPONENT);
            if (!this.game.device.webAudio) {
                for (var property in Game.Sounds.AUDIO_JSON.spritemap) {
                    this.load.audio(property, property + ".mp3");
                }
            }
            else {
                this.load.audiosprite("sfx", Game.Sounds.AUDIO_JSON.resources, null, Game.Sounds.AUDIO_JSON);
            }
            if (Game.Global.GAMEE) {
                Gamee2.Gamee.onInitialized.add(function (initState) {
                    this._gameeInitialized = true;
                    var initData = Gamee2.Gamee.initData;
                    if (initData != undefined && initData.replayData != undefined && initData.replayData.data != undefined) {
                        Game.Global.ghost.createFromGameeData(JSON.parse(initData.replayData.data));
                        Game.Global.gameeGhostMode = true;
                    }
                    Gamee2.Gamee.requestSocial();
                }, this);
                if (Gamee2.Gamee.initialize("FullScreen", ["replay", "ghostMode", "socialData"])) {
                    this._gameeInitialized = false;
                }
            }
        };
        Preload.prototype.create = function () {
            if (!this.game.device.webAudio) {
                for (var property in Game.Sounds.AUDIO_JSON.spritemap) {
                    var snd = this.add.audio(property);
                    snd.allowMultiple = true;
                    Utils.AudioUtils.addSfxSound(property, snd);
                }
            }
            else {
                var audioSprite = this.add.audioSprite("sfx");
                for (var property in Game.Sounds.AUDIO_JSON.spritemap) {
                    audioSprite.sounds[property].allowMultiple = true;
                }
                Utils.AudioUtils.setSfxAudioSprite(audioSprite);
            }
        };
        Preload.prototype.update = function () {
            if (this._gameeInitialized != undefined && !this._gameeInitialized) {
                return;
            }
            if (this._ready == false) {
                this._ready = true;
                this.game.state.start("Play");
            }
        };
        return Preload;
    }(Phaser.State));
    Game.Preload = Preload;
})(Game || (Game = {}));
var Utils;
(function (Utils) {
    function abToBase64(ab, len) {
        var binary = '';
        var bytes = new Uint8Array(ab);
        for (var i = 0; i < len; i++)
            binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }
    Utils.abToBase64 = abToBase64;
    function base64ToAb(ab, base64) {
        var binary = atob(base64);
        var bytes = new Uint8Array(ab);
        var len = binary.length;
        for (var i = 0; i < len; i++)
            bytes[i] = binary.charCodeAt(i);
    }
    Utils.base64ToAb = base64ToAb;
})(Utils || (Utils = {}));
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
                AudioUtils._musicOn = on;
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
        return AudioUtils;
    }());
    AudioUtils._sfxOn = true;
    AudioUtils._musicOn = true;
    AudioUtils._sfxAudioSprite = null;
    AudioUtils._sfxSounds = [];
    AudioUtils._music = [];
    AudioUtils._currentMusic = null;
    AudioUtils.onMusicFinished = new Phaser.Signal();
    Utils.AudioUtils = AudioUtils;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var GameObjectCollection = (function () {
        function GameObjectCollection(objectType, objectCreateFnc, objectCreateFncThis, defSize) {
            if (objectType === void 0) { objectType = undefined; }
            if (defSize === void 0) { defSize = 3; }
            this._objectType = objectType;
            this._objectCreateFnc = objectCreateFnc;
            this._objectCreateFncThis = objectCreateFncThis;
            this._actObjects = new Collections.LinkedList(defSize);
            this._inactObjects = new Collections.Pool(objectType, defSize, true, objectCreateFnc, objectCreateFncThis);
        }
        Object.defineProperty(GameObjectCollection.prototype, "activeObjects", {
            get: function () {
                return this._actObjects;
            },
            enumerable: true,
            configurable: true
        });
        GameObjectCollection.prototype.reset = function () {
            while (!this._actObjects.isEmpty) {
                this.deactivateObject(this._actObjects.elementAtIndex(0));
            }
        };
        GameObjectCollection.prototype.activateObject = function () {
            var obj = this._inactObjects.getItem();
            this._actObjects.add(obj);
            return obj;
        };
        GameObjectCollection.prototype.deactivateObject = function (obj) {
            if (obj["kill"])
                obj.kill();
            if (this._actObjects.remove(obj))
                this._inactObjects.returnItem(obj);
        };
        GameObjectCollection.prototype.updateObjects = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._actObjects.forEach(this.updateObjectsInt, this, args);
        };
        GameObjectCollection.prototype.updateObjectsInt = function (obj) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (obj["update"]) {
                if (!obj.update(args)) {
                    this.deactivateObject(obj);
                }
            }
            return true;
        };
        return GameObjectCollection;
    }());
    Utils.GameObjectCollection = GameObjectCollection;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    function setPhaserTextText(phaserText, text, maxWidth) {
        phaserText.text = text;
        while (phaserText.width > maxWidth) {
            var newTextLen = Math.floor(phaserText.text.length * (maxWidth / phaserText.width));
            if (newTextLen == phaserText.text.length)
                newTextLen--;
            phaserText.text = phaserText.text.slice(0, newTextLen);
        }
    }
    Utils.setPhaserTextText = setPhaserTextText;
    function changeByteOrder(val) {
        if ((val & 0x80000000) == 0) {
            return (val >> 24) | ((val >> 8) & 0xFF00) | ((val << 8) & 0xFF0000) | ((val & 0xFF) << 24);
        }
        else {
            val &= ~0x80000000;
            return (val >> 24) | ((val >> 8) & 0xFF00) | ((val << 8) & 0xFF0000) | ((val & 0xFF) << 24) | 0x80;
        }
    }
    Utils.changeByteOrder = changeByteOrder;
    function angleBetweenLines(lineA, lineB) {
        var dAx = lineA.end.x - lineA.start.x;
        var dAy = lineA.end.y - lineA.start.y;
        var dBx = lineB.end.x - lineB.start.x;
        var dBy = lineB.end.y - lineB.start.y;
        var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
        return angle;
    }
    Utils.angleBetweenLines = angleBetweenLines;
})(Utils || (Utils = {}));
//# sourceMappingURL=BeachRacer.js.map
