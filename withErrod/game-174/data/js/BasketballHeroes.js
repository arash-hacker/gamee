var Game;
(function (Game) {
    var eTextAsset;
    (function (eTextAsset) {
        eTextAsset[eTextAsset["court0Name"] = 0] = "court0Name";
        eTextAsset[eTextAsset["court0Description"] = 1] = "court0Description";
        eTextAsset[eTextAsset["court1Name"] = 2] = "court1Name";
        eTextAsset[eTextAsset["court2Name"] = 3] = "court2Name";
        eTextAsset[eTextAsset["court2UnlockMsg"] = 4] = "court2UnlockMsg";
        eTextAsset[eTextAsset["giftBtnTitle"] = 5] = "giftBtnTitle";
        eTextAsset[eTextAsset["openNow"] = 6] = "openNow";
        eTextAsset[eTextAsset["balls"] = 7] = "balls";
        eTextAsset[eTextAsset["play"] = 8] = "play";
        eTextAsset[eTextAsset["locked"] = 9] = "locked";
        eTextAsset[eTextAsset["selected"] = 10] = "selected";
        eTextAsset[eTextAsset["use"] = 11] = "use";
        eTextAsset[eTextAsset["bestScore1"] = 12] = "bestScore1";
        eTextAsset[eTextAsset["bestScore2"] = 13] = "bestScore2";
        eTextAsset[eTextAsset["prize"] = 14] = "prize";
        eTextAsset[eTextAsset["newBest"] = 15] = "newBest";
        eTextAsset[eTextAsset["ok"] = 16] = "ok";
        eTextAsset[eTextAsset["tapTheBox"] = 17] = "tapTheBox";
        eTextAsset[eTextAsset["greatWork"] = 18] = "greatWork";
        eTextAsset[eTextAsset["beginnersCourtUnlocked"] = 19] = "beginnersCourtUnlocked";
        eTextAsset[eTextAsset["bonus"] = 20] = "bonus";
        eTextAsset[eTextAsset["thankYou"] = 21] = "thankYou";
        eTextAsset[eTextAsset["biniBallUnlocked"] = 22] = "biniBallUnlocked";
    })(eTextAsset = Game.eTextAsset || (Game.eTextAsset = {}));
    var Global = (function () {
        function Global() {
        }
        Global.initTextAssets = function () {
            Global._textAssets = [];
            Global._textAssets[eTextAsset.court0Name] = "BINI'S TRAINING";
            Global._textAssets[eTextAsset.court0Description] = "Practise your skills here";
            Global._textAssets[eTextAsset.court1Name] = "BEGINNERS COURT";
            Global._textAssets[eTextAsset.court2Name] = "CHAMPIONS COURT";
            Global._textAssets[eTextAsset.court2UnlockMsg] = "Score more than 45 on\rthe Beginner's court";
            Global._textAssets[eTextAsset.giftBtnTitle] = "DAILY GIFT";
            Global._textAssets[eTextAsset.openNow] = "OPEN NOW!";
            Global._textAssets[eTextAsset.balls] = "BALLS";
            Global._textAssets[eTextAsset.play] = "PLAY";
            Global._textAssets[eTextAsset.locked] = "LOCKED";
            Global._textAssets[eTextAsset.selected] = "SELECTED";
            Global._textAssets[eTextAsset.use] = "USE";
            Global._textAssets[eTextAsset.bestScore1] = "Best Score:";
            Global._textAssets[eTextAsset.bestScore2] = "BEST SCORE:";
            Global._textAssets[eTextAsset.prize] = "PRIZE:";
            Global._textAssets[eTextAsset.newBest] = "NEW BEST";
            Global._textAssets[eTextAsset.ok] = "OK";
            Global._textAssets[eTextAsset.tapTheBox] = "TAP THE BOX TO OPEN\rYOUR FREE DAILY GIFT!";
            Global._textAssets[eTextAsset.greatWork] = "GREAT WORK!";
            Global._textAssets[eTextAsset.beginnersCourtUnlocked] = "Let's play a match on\rthe Beginners Court.";
            Global._textAssets[eTextAsset.bonus] = "BONUS";
            Global._textAssets[eTextAsset.thankYou] = "THANK YOU!";
            Global._textAssets[eTextAsset.biniBallUnlocked] = "Here's a special Bini ball\rfor playing 15 games";
        };
        Global.getText = function (id) { return Global._textAssets[id]; };
        Object.defineProperty(Global, "saveData", {
            get: function () { return Global._saveData; },
            set: function (data) { Global._saveData = data; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "totalScore", {
            get: function () { return Global._saveData.totalScore; },
            set: function (score) { Global._saveData.totalScore = score; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "coins", {
            get: function () { return Global._saveData.coins; },
            set: function (coins) {
                if (Global._saveData.coins != coins) {
                    Global._saveData.coins = coins;
                    Global._onCoinsChange.dispatch(coins);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "onCoinsChange", {
            get: function () { return this._onCoinsChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "courts", {
            get: function () { return Global._courts; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "selectedCourt", {
            get: function () { return Global.courts[Global._saveData.selectedCourtId]; },
            set: function (court) { Global._saveData.selectedCourtId = court.id; },
            enumerable: true,
            configurable: true
        });
        Global.initCourts = function () {
            Global._courts = [];
            Global._courts[0] = new Game.CourtData(0, Global.getText(eTextAsset.court0Name), 10, 60, 4000, Global.getText(eTextAsset.court0Description));
            Global._courts[1] = new Game.CourtData(1, Global.getText(eTextAsset.court1Name), 10, 70, 3500);
            Global._courts[2] = new Game.CourtData(2, Global.getText(eTextAsset.court2Name), 30, 90, 2000, undefined, Global.getText(eTextAsset.court2UnlockMsg));
        };
        Object.defineProperty(Global, "balls", {
            get: function () { return Global._balls; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "selectedBall", {
            get: function () {
                if (Global._selectedBall == null) {
                    var selBallId = Global._saveData.selectedBallId;
                    var ballId = Global._balls.length;
                    while (ballId-- != 0) {
                        if (Global._balls[ballId].id == selBallId)
                            break;
                    }
                    Global._selectedBall = Global._balls[ballId];
                }
                return Global._selectedBall;
            },
            set: function (ball) {
                if (Global._saveData.selectedBallId != ball.id) {
                    Global._saveData.selectedBallId = ball.id;
                    Global._selectedBall = ball;
                    Global._onSelectedBallChange.dispatch();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "onSelectedBallChange", {
            get: function () { return this._onSelectedBallChange; },
            enumerable: true,
            configurable: true
        });
        Global.initBalls = function () {
            Global._balls = [];
            Global._balls.push(new Game.BallData(0, "Standard Ball", ""));
            var ball = new Game.BallData(16, "Mystery Ball", "Play 15 games on\rany court");
            ball.iconKey = "mysteryBallIcon";
            Global._balls.push(ball);
            Global._balls.push(new Game.BallData(1, "Tennis Ball", "Win 10 games on\rthe Beginners Court"));
            Global._balls.push(new Game.BallData(2, "Stripey Ball", "Win 3 games in a row on\rthe Beginners Court"));
            Global._balls.push(new Game.BallData(3, "Football", "Play 50 games on\rthe Beginners Court"));
            Global._balls.push(new Game.BallData(4, "Pool Ball", "Score 1000 in total"));
            Global._balls.push(new Game.BallData(5, "Beach Ball", "Score more than 35 on\rthe Beginners Court"));
            Global._balls.push(new Game.BallData(6, "Camo Ball", "Win 10 games on\rthe Champions Court"));
            Global._balls.push(new Game.BallData(7, "Champs Ball", "Win 3 games in a row on\rthe Champions Court"));
            ball = new Game.BallData(8, "Melon Ball", "Bonus Score 2%", 25);
            ball.scoreBonus = 0.02;
            Global._balls.push(ball);
            ball = new Game.BallData(9, "Candy Ball", "Bonus Time +2 seconds\rfor each Perfect Shot", 50);
            ball.timeBonus = 2;
            Global._balls.push(ball);
            Global._balls.push(new Game.BallData(10, "Monster Ball", "Double Power-Ups", 75));
            ball = new Game.BallData(11, "Dotty Ball", "Bonus Score 5%", 100);
            ball.scoreBonus = 0.05;
            Global._balls.push(ball);
            ball = new Game.BallData(12, "Smiley Ball", "Bonus Time +5 seconds\rfor each Perfect Shot", 100);
            ball.timeBonus = 5;
            Global._balls.push(ball);
            Global._balls.push(new Game.BallData(13, "Eye Ball", "5 Seconds Head Start", 250));
            Global._balls.push(new Game.BallData(14, "Droid Ball", "Fireball x3", 300));
            ball = new Game.BallData(15, "Golden Ball", "Bonus Score 10%", 400);
            ball.scoreBonus = 0.1;
            ball.iconKey = "goldenBallIcon";
            Global._balls.push(ball);
            Global._onSelectedBallChange = new Phaser.Signal();
        };
        Global.unlockMysteryBall = function () {
            if (Global._balls[1].locked) {
                var ball = Global._balls[1];
                ball.unlock();
                ball.name = "Bini Ball";
                ball.iconKey = null;
            }
        };
        Object.defineProperty(Global, "dailyGift", {
            get: function () { return this._dailyGift; },
            enumerable: true,
            configurable: true
        });
        Global.init = function (game) {
            Global.game = game;
            Global._onCoinsChange = new Phaser.Signal();
            Global.initTextAssets();
            Global.initCourts();
            Global.initBalls();
            Global._dailyGift = new Game.Gift();
        };
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
        Global.GAME_MAX_WIDTH = 640;
        Global.GAME_MAX_HEIGHT = 1136;
        Global.GAME_MIN_WIDTH = 640;
        Global.GAME_MIN_HEIGHT = 946;
        Global.FPS = 60;
        Global.GAMEE = true;
        Global.DEBUG = false;
        Global.ATLAS_0 = "atlas0";
        Global.ATLAS_1 = "atlas1";
        Global.FONT_0 = "fnt0";
        Global.FONT_1 = "fnt1";
        Global.elapsedTime = 0;
        Global.deltaRatio = 1;
        Global.BALL_CNT = 17;
        Global._selectedBall = null;
        return Global;
    }());
    Game.Global = Global;
    window.onload = function () {
        Global.init(new Game.Game());
    };
})(Game || (Game = {}));
var Collections;
(function (Collections) {
    function indexOf(array, item, equalsFunction) {
        var equals = equalsFunction || Collections.defaultEquals;
        var length = array.length;
        for (var i = 0; i < length; i++) {
            if (equals(array[i], item)) {
                return i;
            }
        }
        return -1;
    }
    Collections.indexOf = indexOf;
    function lastIndexOf(array, item, equalsFunction) {
        var equals = equalsFunction || Collections.defaultEquals;
        var length = array.length;
        for (var i = length - 1; i >= 0; i--) {
            if (equals(array[i], item)) {
                return i;
            }
        }
        return -1;
    }
    Collections.lastIndexOf = lastIndexOf;
    function contains(array, item, equalsFunction) {
        return indexOf(array, item, equalsFunction) >= 0;
    }
    Collections.contains = contains;
    function remove(array, item, equalsFunction) {
        var index = indexOf(array, item, equalsFunction);
        if (index < 0) {
            return false;
        }
        array.splice(index, 1);
        return true;
    }
    Collections.remove = remove;
    function frequency(array, item, equalsFunction) {
        var equals = equalsFunction || Collections.defaultEquals;
        var length = array.length;
        var freq = 0;
        for (var i = 0; i < length; i++) {
            if (equals(array[i], item)) {
                freq++;
            }
        }
        return freq;
    }
    Collections.frequency = frequency;
    function equals(array1, array2, equalsFunction) {
        var equals = equalsFunction || Collections.defaultEquals;
        if (array1.length !== array2.length) {
            return false;
        }
        var length = array1.length;
        for (var i = 0; i < length; i++) {
            if (!equals(array1[i], array2[i])) {
                return false;
            }
        }
        return true;
    }
    Collections.equals = equals;
    function copy(array) {
        return array.concat();
    }
    Collections.copy = copy;
    function swap(array, i, j) {
        if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
            return false;
        }
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        return true;
    }
    Collections.swap = swap;
    function toString(array) {
        return '[' + array.toString() + ']';
    }
    Collections.toString = toString;
    function forEach(array, callback) {
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var ele = array_1[_i];
            if (callback(ele) === false) {
                return;
            }
        }
    }
    Collections.forEach = forEach;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var LinkedList = (function () {
        function LinkedList() {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        }
        LinkedList.prototype.add = function (item, index) {
            if (Collections.isUndefined(index)) {
                index = this.nElements;
            }
            if (index < 0 || index > this.nElements || Collections.isUndefined(item)) {
                return false;
            }
            var newNode = this.createNode(item);
            if (this.nElements === 0) {
                this.firstNode = newNode;
                this.lastNode = newNode;
            }
            else if (index === this.nElements) {
                this.lastNode.next = newNode;
                this.lastNode = newNode;
            }
            else if (index === 0) {
                newNode.next = this.firstNode;
                this.firstNode = newNode;
            }
            else {
                var prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                prev.next = newNode;
            }
            this.nElements++;
            return true;
        };
        Object.defineProperty(LinkedList.prototype, "first", {
            get: function () {
                if (this.firstNode !== null) {
                    return this.firstNode.element;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "last", {
            get: function () {
                if (this.lastNode !== null) {
                    return this.lastNode.element;
                }
                return undefined;
            },
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
            var currentNode = this.firstNode;
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
            var currentNode = this.firstNode;
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
            var currentNode = this.firstNode;
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
            if (this.nElements < 1 || Collections.isUndefined(item)) {
                return false;
            }
            var previous = null;
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    if (currentNode === this.firstNode) {
                        this.firstNode = this.firstNode.next;
                        if (currentNode === this.lastNode) {
                            this.lastNode = null;
                        }
                    }
                    else if (currentNode === this.lastNode) {
                        this.lastNode = previous;
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    else {
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    this.nElements--;
                    return true;
                }
                previous = currentNode;
                currentNode = currentNode.next;
            }
            return false;
        };
        LinkedList.prototype.clear = function () {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        };
        LinkedList.prototype.equals = function (other, equalsFunction) {
            var eqF = equalsFunction || Collections.defaultEquals;
            if (!(other instanceof LinkedList)) {
                return false;
            }
            if (this.size != other.size) {
                return false;
            }
            return this.equalsAux(this.firstNode, other.firstNode, eqF);
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
            if (index < 0 || index >= this.nElements) {
                return undefined;
            }
            var element;
            if (this.nElements === 1) {
                element = this.firstNode.element;
                this.firstNode = null;
                this.lastNode = null;
            }
            else {
                var previous = this.nodeAtIndex(index - 1);
                if (previous === null) {
                    element = this.firstNode.element;
                    this.firstNode = this.firstNode.next;
                }
                else if (previous.next === this.lastNode) {
                    element = this.lastNode.element;
                    this.lastNode = previous;
                }
                if (previous !== null) {
                    element = previous.next.element;
                    previous.next = previous.next.next;
                }
            }
            this.nElements--;
            return element;
        };
        LinkedList.prototype.forEach = function (callback, thisContext) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                var nextNode = currentNode.next;
                if (!callback.call(thisContext, currentNode.element, args))
                    break;
                currentNode = nextNode;
            }
        };
        LinkedList.prototype.reverse = function () {
            var previous = null;
            var current = this.firstNode;
            var temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this.firstNode;
            this.firstNode = this.lastNode;
            this.lastNode = temp;
        };
        LinkedList.prototype.toArray = function () {
            var array = [];
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        };
        Object.defineProperty(LinkedList.prototype, "size", {
            get: function () {
                return this.nElements;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "isEmpty", {
            get: function () {
                return this.nElements <= 0;
            },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype.toString = function () {
            return Collections.toString(this.toArray());
        };
        LinkedList.prototype.nodeAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return null;
            }
            if (index === (this.nElements - 1)) {
                return this.lastNode;
            }
            var node = this.firstNode;
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        };
        LinkedList.prototype.createNode = function (item) {
            return {
                element: item,
                next: null
            };
        };
        return LinkedList;
    }());
    Collections.LinkedList = LinkedList;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var Pool = (function () {
        function Pool(itemType, defSize, canGrow, itemCreateFnc, itemCreateFncThis) {
            if (defSize === void 0) { defSize = 0; }
            if (canGrow === void 0) { canGrow = true; }
            if (itemCreateFnc === void 0) { itemCreateFnc = null; }
            this._itemType = itemType;
            this._itemCreateFnc = itemCreateFnc;
            this._itemCreateFncThis = itemCreateFncThis;
            this._canGrow = canGrow;
            this._pool = [];
            this._count = 0;
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
var Controls;
(function (Controls) {
    var ButtonBase = (function () {
        function ButtonBase(container) {
            this._enabled = true;
            this._pressed = false;
            this._onClick = new Phaser.Signal();
            this._container = container;
            container.inputEnabled = true;
            container.events.onInputDown.add(this.inputDownClb, this);
            container.events.onInputUp.add(this.inputUpClb, this);
        }
        Object.defineProperty(ButtonBase.prototype, "container", {
            get: function () { return this._container; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonBase.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (enabled) {
                if (this._enabled != enabled) {
                    this._enabled = enabled;
                    if (enabled)
                        this.enabledClb();
                    else
                        this.disabledClb();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonBase.prototype, "pressed", {
            get: function () { return this._pressed; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonBase.prototype, "x", {
            get: function () {
                return this._container.x;
            },
            set: function (x) {
                this._container.x = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonBase.prototype, "y", {
            get: function () {
                return this._container.y;
            },
            set: function (y) {
                this._container.y = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonBase.prototype, "width", {
            get: function () {
                return this._container.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonBase.prototype, "height", {
            get: function () {
                return this._container.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonBase.prototype, "onClick", {
            get: function () { return this._onClick; },
            enumerable: true,
            configurable: true
        });
        ButtonBase.prototype.inputDownClb = function () {
            if (!this._enabled)
                return;
            this._pressed = true;
            this.pressedClb();
        };
        ButtonBase.prototype.inputUpClb = function (source, pointer, isOver) {
            if (!this._pressed)
                return;
            this._pressed = false;
            var clicked = false;
            if (isOver) {
                clicked = true;
                this._onClick.dispatch(this);
            }
            this.releasedClb(clicked);
        };
        return ButtonBase;
    }());
    Controls.ButtonBase = ButtonBase;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ListBox = (function () {
        function ListBox(game, x, y, width, height, itemHeight, itemPadding, itemType, parent) {
            this._content = null;
            this._width = width;
            this._height = height;
            this._containerMask = new Phaser.Graphics(game);
            this._container = new Phaser.Group(game, parent);
            this._container.position.set(x, y);
            this._container.mask = this._containerMask;
            this.createContainerMask();
            this._itemHeight = itemHeight;
            this._itemPadding = itemPadding;
            this._itemType = itemType;
            this._actItems = new Collections.WrappedArray();
            this._inactItems = new Collections.Pool(undefined, 0, true, this.createListBoxItem, this);
            this._scrolling = new Utils.KineticScrolling(game, false, true);
            this._scrolling.area = new Phaser.Rectangle(x, y, width, height);
            this._scrolling.onPosChange.add(this.scrollingPosChanged, this);
        }
        Object.defineProperty(ListBox.prototype, "items", {
            get: function () { return this._actItems; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "x", {
            get: function () {
                return this._container.x;
            },
            set: function (x) {
                this.setPosition(x, this._container.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "y", {
            get: function () {
                return this._container.y;
            },
            set: function (y) {
                this.setPosition(this._container.x, y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (width) {
                if (this._width != width) {
                    this._width = width;
                    this.createContainerMask();
                    this.updateScrollBarPosAndSize();
                    this._scrolling.area.width = width;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (height) {
                if (this._height != height) {
                    this._height = height;
                    this.createContainerMask();
                    this.updateScrollBarPosAndSize();
                    this._scrolling.area.height = height;
                    this.refill();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "parent", {
            get: function () {
                return this._container.parent;
            },
            set: function (parent) {
                parent.addChild(this._container);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "content", {
            get: function () { return this._content; },
            set: function (content) {
                this._content = content;
                this.updateScrollBarPosAndSize();
                this.fill();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "contentHeight", {
            get: function () {
                if (this._content == null)
                    return 0;
                return (this._content.length * (this._itemHeight + this._itemPadding)) - this._itemPadding;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "viewOffset", {
            get: function () { return this._viewOffset; },
            enumerable: true,
            configurable: true
        });
        ListBox.prototype.destroy = function () {
            this._scrolling.destroy();
        };
        ListBox.prototype.update = function () {
            this._scrolling.update();
        };
        ListBox.prototype.setPosition = function (x, y) {
            this._container.position.set(x, y);
            this.createContainerMask();
            this.updateScrollBarPosAndSize();
            this._scrolling.area.x = x;
            this._scrolling.area.y = y;
        };
        ListBox.prototype.moveView = function (offset) {
            if (this._actItems.itemCnt == 0)
                return;
            var viewOffset = this._viewOffset + offset;
            var itemH = this._itemHeight + this._itemPadding;
            if (offset < 0) {
                if (viewOffset < 0) {
                    viewOffset = 0;
                }
            }
            else {
                var contentH = this._content.length * itemH - this._itemPadding;
                if (viewOffset + this._height > contentH)
                    viewOffset = Math.max(0, contentH - this._height);
            }
            if (Math.floor(this._viewOffset) == Math.floor(viewOffset))
                return;
            offset = Math.floor(viewOffset) - Math.floor(this._viewOffset);
            this.setViewOffset(viewOffset);
            var itemId = this._actItems.itemCnt;
            while (itemId-- != 0) {
                var y = this._actItems.getItemAtIndex(itemId).move(-offset);
                if (offset > 0) {
                    if (y <= -this._itemHeight) {
                        this._inactItems.returnItem(this._actItems.removeItem(false).deactivate());
                    }
                }
                else if (y >= this._height) {
                    this._inactItems.returnItem(this._actItems.removeItem().deactivate());
                }
            }
            if (this._actItems.itemCnt != 0) {
                if (offset > 0) {
                    var item = this._actItems.getLastItem();
                    var nextItemY = item.y + itemH;
                    while (nextItemY < this._height) {
                        var nextItemId = item.contentId + 1;
                        item = this._inactItems.getItem();
                        item.activate(nextItemId, nextItemY, this._content[nextItemId]);
                        this._actItems.addItem(item);
                        nextItemY += itemH;
                    }
                }
                else {
                    var item = this._actItems.getItemAtIndex(0);
                    var nextItemY = item.y - itemH;
                    while (nextItemY > -this._itemHeight) {
                        var nextItemId = item.contentId - 1;
                        item = this._inactItems.getItem();
                        item.activate(nextItemId, nextItemY, this._content[nextItemId]);
                        this._actItems.addItem(item, false);
                        nextItemY -= itemH;
                    }
                }
            }
            else {
                itemId = Math.floor(viewOffset / itemH);
                var itemY = -(viewOffset % itemH);
                while (itemY < this._height) {
                    this._actItems.addItem(this._inactItems.getItem().activate(itemId, itemY, this._content[itemId]));
                    itemId++;
                    itemY += itemH;
                }
            }
        };
        ListBox.prototype.createListBoxItem = function () {
            return new this._itemType(this._container);
        };
        ListBox.prototype.createContainerMask = function () {
            var mask = this._containerMask;
            mask.clear();
            mask.beginFill(0, 1);
            mask.drawRect(this._container.x, this._container.y, this._width, this._height);
            mask.endFill();
        };
        ListBox.prototype.setViewOffset = function (offset) {
            this._viewOffset = offset;
            this.updateScrollBarThumbPos();
        };
        ListBox.prototype.scrollingPosChanged = function (deltaX, deltaY) {
            this.moveView(-deltaY);
        };
        ListBox.prototype.fill = function () {
            var itemId = this._actItems.itemCnt;
            while (itemId-- != 0) {
                this._inactItems.returnItem(this._actItems.getItemAtIndex(itemId).deactivate());
            }
            this._actItems.clear();
            if (this._content != null) {
                var contentSize = this._content.length;
                var itemY = 0;
                itemId = 0;
                while (itemId < contentSize && itemY < this._height) {
                    var item = this._inactItems.getItem();
                    item.activate(itemId, itemY, this._content[itemId]);
                    this._actItems.addItem(item);
                    itemId++;
                    itemY += this._itemHeight + this._itemPadding;
                }
            }
            this.setViewOffset(0);
        };
        ListBox.prototype.refill = function () {
            if (this._actItems.itemCnt == 0)
                return;
            var itemH = this._itemHeight + this._itemPadding;
            var fItem = this._actItems.getItemAtIndex(0);
            var lItem = this._actItems.getLastItem();
            var lItemId = lItem.contentId;
            var lItemNewId = Math.floor((Math.floor(this._viewOffset) + this._height - 1) / itemH);
            if (lItemNewId == lItemId)
                return;
            if (lItemNewId < lItemId) {
                while (lItemNewId != lItemId) {
                    this._inactItems.returnItem(this._actItems.removeItem().deactivate());
                    lItemId--;
                }
                return;
            }
            var lItemMaxId = this._content.length - 1;
            var lItemY = lItem.y + itemH;
            while (lItemId < lItemNewId && lItemId < lItemMaxId) {
                lItemId++;
                this._actItems.addItem(this._inactItems.getItem().activate(lItemId, lItemY, this._content[lItemId]));
                lItemY += itemH;
            }
            if (lItemId != lItemNewId) {
                var offset = -fItem.y;
                if (fItem.contentId != 0)
                    offset += fItem.contentId * itemH;
                if (offset > 0) {
                    offset = Math.min(offset, this._height - (lItemY - this._itemPadding));
                    var itemId = this._actItems.itemCnt;
                    while (itemId-- != 0)
                        this._actItems.getItemAtIndex(itemId).move(offset);
                    this.setViewOffset(Math.floor(this._viewOffset) - offset);
                    var fItemY = fItem.y;
                    var fItemId = fItem.contentId;
                    if (fItemY > this._itemPadding) {
                        fItemId--;
                        fItemY -= itemH;
                        this._actItems.addItem(this._inactItems.getItem().activate(fItemId, fItemY, this._content[fItemId]), false);
                    }
                }
            }
        };
        Object.defineProperty(ListBox.prototype, "scrollBar", {
            get: function () { return this._scrollBar; },
            enumerable: true,
            configurable: true
        });
        ListBox.prototype.connectScrollBar = function (scrollBar, offset) {
            this._scrollBar = scrollBar;
            this._scrollBarOffset = offset;
            this.updateScrollBarPosAndSize();
            this.updateScrollBarThumbPos();
        };
        ListBox.prototype.updateScrollBarPosAndSize = function () {
            var scrollBar = this._scrollBar;
            if (scrollBar != undefined && scrollBar != null) {
                var thumbSize = Math.min(1, this._height / this.contentHeight);
                scrollBar.x = this.x + this.width + this._scrollBarOffset;
                scrollBar.y = this.y;
                scrollBar.height = this._height;
                scrollBar.thumbSize = thumbSize;
                scrollBar.visible = thumbSize > 0 && thumbSize < 1;
            }
        };
        ListBox.prototype.updateScrollBarThumbPos = function () {
            var scrollBar = this._scrollBar;
            if (scrollBar != undefined && scrollBar != null) {
                var contentHeight = this.contentHeight;
                scrollBar.thumbPosition = (contentHeight != 0 ? this._viewOffset / (contentHeight - this._height) : 0);
            }
        };
        ListBox.SCROLLING_MAX_SPEED = 50;
        return ListBox;
    }());
    Controls.ListBox = ListBox;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ListBoxItemBase = (function () {
        function ListBoxItemBase(game, parent) {
            this._container = new Phaser.Group(game, parent);
            this._container.visible = false;
            this._container.exists = false;
        }
        Object.defineProperty(ListBoxItemBase.prototype, "contentId", {
            get: function () { return this._contentId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBoxItemBase.prototype, "content", {
            get: function () { return this._content; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBoxItemBase.prototype, "y", {
            get: function () {
                return this._container.y;
            },
            set: function (y) {
                this._container.y = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBoxItemBase.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (enabled) {
                if (this._enabled != enabled) {
                    this._enabled = enabled;
                    this.enabledChangeClb(enabled);
                }
            },
            enumerable: true,
            configurable: true
        });
        ListBoxItemBase.prototype.move = function (offset) {
            this._container.y += offset;
            return this._container.y;
        };
        ListBoxItemBase.prototype.activate = function (id, y, content) {
            this._contentId = id;
            this.y = y;
            this._content = content;
            this._container.visible = true;
            this._container.exists = true;
            return this;
        };
        ListBoxItemBase.prototype.deactivate = function () {
            this._container.visible = false;
            this._container.exists = false;
            return this;
        };
        ListBoxItemBase.prototype.enabledChangeClb = function (enabled) {
        };
        return ListBoxItemBase;
    }());
    Controls.ListBoxItemBase = ListBoxItemBase;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ScrollBarBase = (function () {
        function ScrollBarBase(container, fixedSize, vertical) {
            this._container = container;
            this._vertical = vertical;
            this._width = vertical ? fixedSize : 0;
            this._height = vertical ? 0 : fixedSize;
            this._thumbPos = 0;
            this._thumbSize = 0;
        }
        Object.defineProperty(ScrollBarBase.prototype, "vertical", {
            get: function () { return this._vertical; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "x", {
            get: function () { return this._container.x; },
            set: function (x) { this._container.x = x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "y", {
            get: function () { return this._container.y; },
            set: function (y) { this._container.y = y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "width", {
            get: function () { return this._width; },
            set: function (width) {
                this._width = width;
                this.updateWidth(width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "height", {
            get: function () { return this._height; },
            set: function (height) {
                this._height = height;
                this.updateHeight(height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "visible", {
            get: function () { return this._container.visible; },
            set: function (visible) { this._container.visible = visible; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "thumbPosition", {
            get: function () {
                return this._thumbPos;
            },
            set: function (position) {
                if (position < 0) {
                    position = 0;
                }
                else if (position > 1) {
                    position = 1;
                }
                if (this._thumbPos != position) {
                    this._thumbPos = position;
                    this.updateThumbPos();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "thumbSize", {
            get: function () {
                return this._thumbSize;
            },
            set: function (size) {
                if (size > 1)
                    size = 1;
                this._thumbSize = size;
                this.updateThumbSize();
            },
            enumerable: true,
            configurable: true
        });
        ScrollBarBase.prototype.getThumbPosInPixels = function () {
            return (this._vertical ? (this._height - (this._thumbSize * this._height)) * this._thumbPos : (this._width - (this._thumbSize * this._width)) * this._thumbPos);
        };
        ScrollBarBase.prototype.validSettings = function () {
            return this._width > 0 && this._height > 0 && this._thumbSize > 0;
        };
        return ScrollBarBase;
    }());
    Controls.ScrollBarBase = ScrollBarBase;
})(Controls || (Controls = {}));
var Game;
(function (Game) {
    var GameResults = (function () {
        function GameResults() {
        }
        return GameResults;
    }());
    Game.GameResults = GameResults;
})(Game || (Game = {}));
var Playfield;
(function (Playfield) {
    var BallSpark = (function () {
        function BallSpark() {
            this._image = new Phaser.Image(Game.Global.game, 0, 0, Game.Global.ATLAS_0, "sparkle");
            this._image.anchor.set(0.5);
        }
        BallSpark.prototype.show = function (ball, layer) {
            this._ball = ball;
            this._timer = Game.Global.elapsedTime;
            var rnd = Game.Global.game.rnd;
            this._distance = rnd.realInRange(0.1, 0.9);
            this._dir = rnd.realInRange(0, 359.9);
            this._angle = rnd.realInRange(0, 89.9);
            layer.add(this._image, true);
        };
        BallSpark.prototype.update = function () {
            var progress = (Game.Global.elapsedTime - this._timer) / BallSpark.LIFE_SPAN;
            if (progress >= 1)
                return false;
            this._image.angle = this._angle + (progress * 90);
            var ballScale = this._ball.scale;
            var minScale = 0.1 * ballScale;
            var maxScale = 1 * ballScale;
            if (progress < 0.5) {
                progress /= 0.5;
            }
            else {
                progress = 1 - ((progress - 0.5) / 0.5);
            }
            this._image.scale.set(minScale + Phaser.Easing.Linear.None(progress) * (maxScale - minScale));
            this._image.alpha = progress;
            var distance = this._ball.radius * this._distance;
            var dir = Phaser.Math.degToRad(this._dir + this._ball.angle);
            this._image.position.set(Math.cos(dir) * distance, Math.sin(dir) * distance);
            return true;
        };
        BallSpark.prototype.kill = function () {
            this._image.parent.remove(this._image, false, true);
        };
        BallSpark.LIFE_SPAN = 1000;
        return BallSpark;
    }());
    Playfield.BallSpark = BallSpark;
})(Playfield || (Playfield = {}));
var BallFireFx;
(function (BallFireFx) {
    var TailParticle = (function () {
        function TailParticle() {
            this._image = new Phaser.Image(Game.Global.game, 0, 0, Game.Global.ATLAS_0, "fireFxTail");
            this._image.anchor.set(0.5);
        }
        TailParticle.prototype.show = function (pos, scale, group, groupPos) {
            this._image.position.copyFrom(pos);
            this._image.scale.set(scale);
            this._image.alpha = 1;
            group.add(this._image, true, groupPos);
            this._timer = Game.Global.elapsedTime;
            this._startScale = scale;
            this._startY = pos.y;
        };
        TailParticle.prototype.update = function () {
            var progress = (Game.Global.elapsedTime - this._timer) / TailParticle.LIFE_SPAN;
            if (progress >= 1)
                return false;
            var valOut = Phaser.Easing.Cubic.Out(progress);
            var scale = this._startScale * 2;
            this._image.scale.set(scale - scale * valOut);
            this._image.alpha = 0.75 - valOut * 0.75;
            return true;
        };
        TailParticle.prototype.kill = function () {
            this._image.parent.removeChild(this._image);
        };
        TailParticle.LIFE_SPAN = 750;
        return TailParticle;
    }());
    BallFireFx.TailParticle = TailParticle;
})(BallFireFx || (BallFireFx = {}));
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
var Playfield;
(function (Playfield) {
    var GiftButton = (function (_super) {
        __extends(GiftButton, _super);
        function GiftButton(parent) {
            var _this = this;
            var container = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "giftBoxSmall", parent);
            container.anchor.set(0.5);
            _this = _super.call(this, container) || this;
            container.kill();
            return _this;
        }
        GiftButton.prototype.show = function () {
            Game.Global.game.tweens.removeFrom(this._container);
            this.updatePosition();
            this._container.revive();
            this._timer = Game.Global.elapsedTime;
            this.enabled = true;
        };
        GiftButton.prototype.hide = function () {
            this.enabled = false;
            Game.Global.game.add.tween(this._container).to({ x: Game.Global.GAME_MAX_WIDTH + Math.round(this._container.width * this._container.anchor.x) }, 750, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                this._container.kill();
            }, this);
        };
        GiftButton.prototype.update = function () {
            if (!this.pressed) {
                var time = (Game.Global.elapsedTime - this._timer) % 750;
                this._container.scale.set(1.2 - Phaser.Easing.Elastic.Out(time / 750) * 0.2);
            }
            else {
                this._timer = Game.Global.elapsedTime;
            }
        };
        GiftButton.prototype.updatePosition = function () {
            var camera = Game.Global.game.camera;
            this._container.position.set(camera.x + camera.width - GiftButton.X_OFFSET, camera.y + camera.height - GiftButton.Y_OFFSET);
        };
        GiftButton.prototype.enabledClb = function () {
        };
        GiftButton.prototype.disabledClb = function () {
        };
        GiftButton.prototype.pressedClb = function () {
            this._container.scale.set(0.9);
        };
        GiftButton.prototype.releasedClb = function (clicked) {
            this._container.scale.set(1);
        };
        GiftButton.X_OFFSET = 80;
        GiftButton.Y_OFFSET = 100;
        return GiftButton;
    }(Controls.ButtonBase));
    Playfield.GiftButton = GiftButton;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var MenuButton = (function (_super) {
        __extends(MenuButton, _super);
        function MenuButton(parent) {
            var _this = this;
            var container = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "btnMenu", parent);
            container.anchor.y = 0.5;
            _this = _super.call(this, container) || this;
            _this._noticeIcon = Game.Global.game.add.image(100, -58, Game.Global.ATLAS_0, "noticeIcon");
            _this._noticeIcon.anchor.set(0.5);
            _this._noticeIcon.kill();
            container.addChild(_this._noticeIcon);
            _this._container.kill();
            return _this;
        }
        MenuButton.prototype.show = function () {
            Game.Global.game.tweens.removeFrom(this._container);
            this.updatePosition();
            this._container.revive();
            if (Game.Global.saveData.newBalls || !Game.Global.dailyGift.locked) {
                this._noticeIcon.revive();
            }
            else {
                this._noticeIcon.kill();
            }
            this.enabled = true;
        };
        MenuButton.prototype.hide = function () {
            this.enabled = false;
            Game.Global.game.add.tween(this._container).to({ x: -this._container.width }, 750, Phaser.Easing.Cubic.In, true).onComplete.add(function () {
                this._container.kill();
            }, this);
        };
        MenuButton.prototype.updatePosition = function () {
            var camera = Game.Global.game.camera;
            this._container.position.set(camera.x, camera.y + MenuButton.Y_OFFSET);
        };
        MenuButton.prototype.enabledClb = function () {
        };
        MenuButton.prototype.disabledClb = function () {
        };
        MenuButton.prototype.pressedClb = function () {
            this._container.scale.set(0.9);
        };
        MenuButton.prototype.releasedClb = function (clicked) {
            this._container.scale.set(1);
        };
        MenuButton.Y_OFFSET = 260;
        return MenuButton;
    }(Controls.ButtonBase));
    Playfield.MenuButton = MenuButton;
})(Playfield || (Playfield = {}));
var Game;
(function (Game) {
    var ResultsPanel = (function () {
        function ResultsPanel() {
            var layer = this._layer = new Phaser.Group(Game.Global.game);
            this._newBestScoreMsg = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "msgNewBestScore", layer);
            this._newBestScoreMsg.anchor.x = 0.5;
            this._resultMsg = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "msgYouWin", layer);
            this._resultMsg.anchor.x = 0.5;
            this._resultsBox = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "resultsBox", layer);
            this._resultsBox.anchor.x = 0.5;
            var boxContent = Game.Global.game.add.group(this._resultsBox);
            this._resultsBox.addChild(boxContent);
            this._scoreBonusMsg = Game.Global.game.add.bitmapText(0, 0, Game.Global.FONT_0, "", 28, boxContent);
            this._coinsMsg = Game.Global.game.add.group(boxContent);
            Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "coinIcon", this._coinsMsg);
            this._coinsVal = Game.Global.game.add.bitmapText(this._coinsMsg.width + 10, 0, Game.Global.FONT_0, "0", 28, this._coinsMsg);
            this._coinsVal.y = (this._coinsMsg.height - this._coinsVal.height) / 2;
            var emitter = Game.Global.game.add.emitter(0, this._resultsBox.height / 2, 10);
            emitter.setXSpeed(-400, 400);
            emitter.setYSpeed(-900, -700);
            emitter.setAlpha(1, 0.5, 2000);
            emitter.setScale(1, 2, 1, 2, 2000);
            emitter.gravity = 1500;
            emitter.makeParticles(Game.Global.ATLAS_0, "coinIcon", emitter.maxParticles, false, false);
            emitter.width = 100;
            this._coinEmitter = emitter;
            this._resultsBox.addChild(emitter);
        }
        ResultsPanel.prototype.show = function (results) {
            var y = 0;
            if (results.newBestScore) {
                this._newBestScoreMsg.visible = true;
                y += this._newBestScoreMsg.height + 10;
            }
            else {
                this._newBestScoreMsg.visible = false;
            }
            this._resultMsg.frameName = results.aiScore < results.playerScore ? "msgYouWin" : results.aiScore > results.playerScore ? "msgYouLose" : "msgItsADraw";
            this._resultMsg.y = y;
            y += this._resultMsg.height + 20;
            if (results.coins != 0 || results.playerBonusScore != 0) {
                this._resultsBox.visible = true;
                this._resultsBox.y = y;
                y = 0;
                if (results.playerBonusScore != 0) {
                    this._scoreBonusMsg.text = Game.Global.getText(Game.eTextAsset.bonus) + " +" + results.playerBonusScore;
                    y += this._scoreBonusMsg.height + 10;
                }
                this._coinsMsg.y = y;
                this._coinsVal.text = "+" + results.coins;
                var boxContent = this._coinsMsg.parent;
                boxContent.position.set(-boxContent.width / 2, (this._resultsBox.height - boxContent.height) / 2);
            }
            else {
                this._resultsBox.visible = false;
            }
            var camera = Game.Global.game.camera;
            this._layer.position.set(camera.x + camera.width / 2, camera.y + (camera.height - this._layer.height) / 2);
            Game.Global.game.world.addChild(this._layer);
            if (results.playerScore >= results.aiScore)
                this._coinEmitter.explode(2000, this._coinEmitter.maxParticles);
            Game.Global.game.time.events.add(3000, function () {
                if (Game.Global.saveData.totalGames == 15) {
                    Game.Play.instance.showBiniBallUnlockMsg();
                }
                else {
                    Game.Play.instance.endGame();
                }
            }, this);
        };
        ResultsPanel.prototype.hide = function () {
            if (this._layer.parent != null)
                this._layer.parent.removeChild(this._layer);
        };
        return ResultsPanel;
    }());
    Game.ResultsPanel = ResultsPanel;
})(Game || (Game = {}));
var Windows;
(function (Windows) {
    var WindowBase = (function () {
        function WindowBase() {
            this._layer = new Phaser.Group(Game.Global.game);
            this._layer.visible = this._layer.exists = false;
            Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "card", this._layer);
            new Game.TextButton(this._layer.width / 2, 216, Game.Global.FONT_0, 42, Game.Global.getText(Game.eTextAsset.ok), this._layer).onClick.add(this.okButtonClickClb, this);
            this._onClose = new Phaser.Signal();
        }
        Object.defineProperty(WindowBase.prototype, "onClose", {
            get: function () { return this._onClose; },
            enumerable: true,
            configurable: true
        });
        WindowBase.prototype.show = function () {
            this._layer.visible = this._layer.exists = true;
            this.updatePosition();
        };
        WindowBase.prototype.hide = function () {
            this._layer.visible = this._layer.exists = false;
        };
        WindowBase.prototype.updatePosition = function () {
            var camera = Game.Global.game.camera;
            this._layer.position.set(camera.x + (camera.width - this._layer.width) / 2, camera.y + (camera.height - this._layer.height) / 2);
        };
        WindowBase.prototype.okButtonClickClb = function () {
            Utils.AudioUtils.playSound("click");
            this._onClose.dispatch();
        };
        WindowBase.TITLE_FONT_SIZE = 36;
        WindowBase.MESSAGE_FONT_SIZE = 28;
        return WindowBase;
    }());
    Windows.WindowBase = WindowBase;
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var BiniBallUnlocked = (function (_super) {
        __extends(BiniBallUnlocked, _super);
        function BiniBallUnlocked() {
            var _this = _super.call(this) || this;
            var game = Game.Global.game;
            game.add.bitmapText(176, 22, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.thankYou), Windows.WindowBase.TITLE_FONT_SIZE, _this._layer);
            var shadow = Game.Global.game.add.image(83, 158, Game.Global.ATLAS_0, "ballShadow", _this._layer);
            shadow.anchor.set(0.5);
            shadow.scale.set(0.60);
            game.add.image(8, 8, Game.Global.ATLAS_0, "ball_16", _this._layer).scale.set(0.6);
            game.add.bitmapText(184, 90, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.biniBallUnlocked), Windows.WindowBase.MESSAGE_FONT_SIZE, _this._layer).tint = 0x909090;
            return _this;
        }
        return BiniBallUnlocked;
    }(Windows.WindowBase));
    Windows.BiniBallUnlocked = BiniBallUnlocked;
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var TrainingCompleted = (function (_super) {
        __extends(TrainingCompleted, _super);
        function TrainingCompleted() {
            var _this = _super.call(this) || this;
            var game = Game.Global.game;
            game.add.image(10, -10, Game.Global.ATLAS_0, "biniIcon", _this._layer).scale.set(1.1, 1.1);
            var title = game.add.group(_this._layer);
            game.add.bitmapText(0, 0, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.greatWork), Windows.WindowBase.TITLE_FONT_SIZE, title).anchor.set(0, 0.5);
            game.add.image(title.width + 20, 0, Game.Global.ATLAS_0, "coinIcon", title).anchor.set(0, 0.5);
            game.add.bitmapText(title.width + 10, 0, Game.Global.FONT_0, "+" + TrainingCompleted.PRIZE, Windows.WindowBase.TITLE_FONT_SIZE, title).anchor.set(0, 0.5);
            title.position.set(140, 36);
            var msg = game.add.bitmapText(_this._layer.width / 2, 90, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.beginnersCourtUnlocked), Windows.WindowBase.MESSAGE_FONT_SIZE, _this._layer);
            msg.anchor.set(0.5, 0);
            msg.tint = 0x909090;
            return _this;
        }
        TrainingCompleted.NORMAL_FONT_SIZE = 42;
        TrainingCompleted.PRIZE = 10;
        return TrainingCompleted;
    }(Windows.WindowBase));
    Windows.TrainingCompleted = TrainingCompleted;
})(Windows || (Windows = {}));
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
            msg.y = y;
            msg.x = type.getMessageStartX(this);
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
            return this._dir < 0 ? camera.x + camera.width : camera.x - msg.getMsgContainer().width;
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
                    var centerX = camera.x + (camera.width - msgContainer.width) / 2;
                    msgContainer.x = startX + this._slideInEase(progress) * (centerX - startX);
                    break;
                }
                case SlideMessage.eMessageState.slideOutDelay: {
                    if (time - this._slideInTime < this._slideOutDelay) {
                        msgContainer.x = camera.x + (camera.width - msgContainer.width) / 2;
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
                    var centerX = camera.x + (camera.width - msgContainer.width) / 2;
                    var endX = this._dir < 0 ? camera.x - msgContainer.width : camera.x + camera.width;
                    msgContainer.x = centerX + (endX - centerX) * this._slideOutEase(progress);
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
var BallSelection;
(function (BallSelection) {
    var BallLsbItem = (function (_super) {
        __extends(BallLsbItem, _super);
        function BallLsbItem(parent) {
            var _this = _super.call(this, Game.Global.game, parent) || this;
            if (BallLsbItem._getBallUnlockProgressFnc == undefined) {
                BallLsbItem._getBallUnlockProgressFnc = [];
                BallLsbItem._getBallUnlockProgressFnc[1] = BallLsbItem.getBallUnlockProgress1;
                BallLsbItem._getBallUnlockProgressFnc[2] = BallLsbItem.getBallUnlockProgress2;
                BallLsbItem._getBallUnlockProgressFnc[3] = BallLsbItem.getBallUnlockProgress3;
                BallLsbItem._getBallUnlockProgressFnc[4] = BallLsbItem.getBallUnlockProgress4;
                BallLsbItem._getBallUnlockProgressFnc[5] = BallLsbItem.getBallUnlockProgress5;
                BallLsbItem._getBallUnlockProgressFnc[6] = BallLsbItem.getBallUnlockProgress6;
                BallLsbItem._getBallUnlockProgressFnc[7] = BallLsbItem.getBallUnlockProgress7;
                BallLsbItem._getBallUnlockProgressFnc[16] = BallLsbItem.getBallUnlockProgress16;
            }
            _this._bg = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "card", _this._container);
            _this._iconShadow = Game.Global.game.add.image(BallLsbItem.ICON_SHADOW_X, BallLsbItem.ICON_SHADOW_Y, Game.Global.ATLAS_0, "ballShadow", _this._container);
            _this._iconShadow.anchor.set(0.5);
            _this._iconShadow.scale.set(0.60);
            _this._icon = Game.Global.game.add.image(BallLsbItem.ICON_X, BallLsbItem.ICON_Y, Game.Global.ATLAS_0, "ball_0", _this._container);
            _this._icon.scale.set(0.60);
            _this._name = Game.Global.game.add.bitmapText(BallLsbItem.NAME_X, BallLsbItem.NAME_Y, Game.Global.FONT_0, "", BallLsbItem.NAME_FONT_SIZE, _this._container);
            _this._button = new BallSelection.BallLsbItemBtn(BallLsbItem.BTN_X, BallLsbItem.BTN_Y, _this._container);
            _this._button.onClick.add(_this.buttonClickClb, _this);
            _this._description = Game.Global.game.add.bitmapText(BallLsbItem.DESCRIPTION_X, BallLsbItem.DESCRIPTION_Y, Game.Global.FONT_0, "", BallLsbItem.DESCRIPTION_FONT_SIZE, _this._container);
            _this._description.tint = 0x909090;
            _this._unlockProgress = Game.Global.game.add.bitmapText(0, BallLsbItem.UNLOCK_PROGRESS_Y, Game.Global.FONT_0, "", 24, _this._container);
            _this._newBallNotice = Game.Global.game.add.image(BallLsbItem.NOTICE_ICON_X, BallLsbItem.NOTICE_ICON_Y, Game.Global.ATLAS_0, "noticeIcon", _this._container);
            _this._newBallNotice.anchor.set(0.5);
            return _this;
        }
        BallLsbItem.prototype.activate = function (id, y, content) {
            _super.prototype.activate.call(this, id, y, content);
            var ball = content;
            this.enabled = !ball.locked || (ball.price > 0 && ball.price <= Game.Global.coins);
            this._icon.frameName = ball.iconKey;
            this._name.text = ball.name;
            this._button.content = ball;
            this._description.text = ball.description;
            this._newBallNotice.visible = false;
            if (ball.selected)
                Game.Global.onSelectedBallChange.addOnce(this.selectedBallChangeClb, this);
            if (ball.locked) {
                if (ball.price > 0) {
                    Game.Global.onCoinsChange.add(this.coinsChangeClb, this);
                    this._unlockProgress.kill();
                }
                else {
                    this._unlockProgress.text = "";
                    var fnc = BallLsbItem._getBallUnlockProgressFnc[ball.id];
                    if (fnc != undefined)
                        this._unlockProgress.text = fnc();
                    this._unlockProgress.position.x = 580 - BallLsbItem.UNLOCK_PROGRESS_X - this._unlockProgress.width;
                    this._unlockProgress.revive();
                }
            }
            else {
                this._unlockProgress.kill();
                if (ball.price == 0 && ball.justUnlocked)
                    this._newBallNotice.visible = true;
            }
            return this;
        };
        BallLsbItem.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            var ball = this._content;
            if (ball.selected)
                Game.Global.onSelectedBallChange.remove(this.selectedBallChangeClb, this);
            if (ball.locked && ball.price > 0)
                Game.Global.onCoinsChange.remove(this.coinsChangeClb, this);
            return this;
        };
        BallLsbItem.prototype.buttonClickClb = function () {
            var ball = this._content;
            if (!ball.locked) {
                Game.Global.selectedBall = ball;
                Game.Global.onSelectedBallChange.addOnce(this.selectedBallChangeClb, this);
                this._button.updateContent();
                Utils.AudioUtils.playSound("click");
            }
            else if (ball.price > 0 && ball.price <= Game.Global.coins) {
                Game.Global.onCoinsChange.remove(this.coinsChangeClb, this);
                ball.unlock();
                this._button.updateContent();
                Utils.AudioUtils.playSound("payment");
            }
            Game.Global.saveData.save();
        };
        BallLsbItem.prototype.selectedBallChangeClb = function () {
            this._button.updateContent();
        };
        BallLsbItem.prototype.coinsChangeClb = function (coins) {
            var ball = this._content;
            this.enabled = ball.price <= coins;
        };
        BallLsbItem.prototype.enabledChangeClb = function (enabled) {
            this._bg.frameName = enabled ? "card" : "cardLocked";
            this._button.enabled = enabled;
        };
        BallLsbItem.getBallUnlockProgress1 = function () {
            return Game.Global.courts[1].wins.toString() + "/10";
        };
        BallLsbItem.getBallUnlockProgress2 = function () {
            return Game.Global.courts[1].winsInRow.toString() + "/3";
        };
        BallLsbItem.getBallUnlockProgress3 = function () {
            return Game.Global.courts[1].games.toString() + "/50";
        };
        BallLsbItem.getBallUnlockProgress4 = function () {
            return Game.Global.totalScore.toString() + "/1000";
        };
        BallLsbItem.getBallUnlockProgress5 = function () {
            return Game.Global.courts[1].highScore.toString() + "/35";
        };
        BallLsbItem.getBallUnlockProgress6 = function () {
            return Game.Global.courts[2].wins.toString() + "/10";
        };
        BallLsbItem.getBallUnlockProgress7 = function () {
            return Game.Global.courts[2].winsInRow.toString() + "/3";
        };
        BallLsbItem.getBallUnlockProgress16 = function () {
            return Game.Global.saveData.totalGames.toString() + "/15";
        };
        BallLsbItem.ICON_X = 16;
        BallLsbItem.ICON_Y = 16;
        BallLsbItem.ICON_SHADOW_X = 91;
        BallLsbItem.ICON_SHADOW_Y = 166;
        BallLsbItem.NAME_X = 176;
        BallLsbItem.NAME_Y = 20;
        BallLsbItem.NAME_FONT_SIZE = 36;
        BallLsbItem.BTN_X = 290;
        BallLsbItem.BTN_Y = 218;
        BallLsbItem.DESCRIPTION_X = 184;
        BallLsbItem.DESCRIPTION_Y = 90;
        BallLsbItem.DESCRIPTION_FONT_SIZE = 28;
        BallLsbItem.UNLOCK_PROGRESS_X = 20;
        BallLsbItem.UNLOCK_PROGRESS_Y = 26;
        BallLsbItem.NOTICE_ICON_X = 91;
        BallLsbItem.NOTICE_ICON_Y = 166;
        return BallLsbItem;
    }(Controls.ListBoxItemBase));
    BallSelection.BallLsbItem = BallLsbItem;
})(BallSelection || (BallSelection = {}));
var BallSelection;
(function (BallSelection) {
    var BallLsbItemBtn = (function (_super) {
        __extends(BallLsbItemBtn, _super);
        function BallLsbItemBtn(x, y, parent) {
            var _this = this;
            var container = Game.Global.game.add.image(x, y, Game.Global.ATLAS_0, BallLsbItemBtn.NORMAL_FRAME_NAME, parent);
            container.anchor.set(0.5);
            _this = _super.call(this, container) || this;
            _this._caption = new Phaser.BitmapText(Game.Global.game, 0, 0, Game.Global.FONT_0, "", BallLsbItemBtn.CAPTION_FONT_SIZE);
            _this._caption.anchor.set(0.5, 0.4);
            container.addChild(_this._caption);
            _this._priceIcon = new Phaser.Image(Game.Global.game, 0, 0, Game.Global.ATLAS_0, "coinIcon");
            _this._priceIcon.anchor.set(0, 0.5);
            container.addChild(_this._priceIcon);
            _this._price = new Phaser.BitmapText(Game.Global.game, 0, 0, Game.Global.FONT_0, "", BallLsbItemBtn.CAPTION_FONT_SIZE);
            _this._price.anchor.set(0, 0.4);
            container.addChild(_this._price);
            return _this;
        }
        Object.defineProperty(BallLsbItemBtn.prototype, "content", {
            get: function () { return this._content; },
            set: function (content) {
                this._content = content;
                this.updateContent();
            },
            enumerable: true,
            configurable: true
        });
        BallLsbItemBtn.prototype.updateContent = function () {
            var content = this._content;
            if (content.locked) {
                if (content.price > 0) {
                    this._price.text = content.price.toString();
                    this._priceIcon.x = -(this._priceIcon.width + 10 + this._price.width) / 2;
                    this._price.x = this._priceIcon.x + this._priceIcon.width + 10;
                    this._caption.visible = false;
                    this._priceIcon.visible = this._price.visible = true;
                    this.enabled = content.price <= Game.Global.coins;
                }
                else {
                    this._caption.text = Game.Global.getText(Game.eTextAsset.locked);
                    this._caption.visible = true;
                    this._priceIcon.visible = this._price.visible = false;
                    this.enabled = false;
                }
            }
            else {
                if (content.selected) {
                    this._caption.text = Game.Global.getText(Game.eTextAsset.selected);
                    this.enabled = false;
                    this._container.frameName = BallLsbItemBtn.SELECTED_FRAME_NAME;
                }
                else {
                    this._caption.text = Game.Global.getText(Game.eTextAsset.use);
                    this.enabled = true;
                }
                this._caption.visible = true;
                this._priceIcon.visible = this._price.visible = false;
            }
            if (!this.enabled && !content.selected && this._container.frameName == BallLsbItemBtn.SELECTED_FRAME_NAME) {
                this._container.frameName = BallLsbItemBtn.DISABLED_FRAME_NAME;
            }
        };
        BallLsbItemBtn.prototype.enabledClb = function () {
            this._container.frameName = BallLsbItemBtn.NORMAL_FRAME_NAME;
        };
        BallLsbItemBtn.prototype.disabledClb = function () {
            this._container.frameName = BallLsbItemBtn.DISABLED_FRAME_NAME;
        };
        BallLsbItemBtn.prototype.pressedClb = function () {
            this._container.scale.set(0.9);
        };
        BallLsbItemBtn.prototype.releasedClb = function (clicked) {
            this._container.scale.set(1);
        };
        BallLsbItemBtn.NORMAL_FRAME_NAME = "buttonLgGreen";
        BallLsbItemBtn.SELECTED_FRAME_NAME = "buttonLgYellow";
        BallLsbItemBtn.DISABLED_FRAME_NAME = "buttonLgDisabled";
        BallLsbItemBtn.CAPTION_FONT_SIZE = 42;
        return BallLsbItemBtn;
    }(Controls.ButtonBase));
    BallSelection.BallLsbItemBtn = BallLsbItemBtn;
})(BallSelection || (BallSelection = {}));
var CourtSelection;
(function (CourtSelection) {
    var BallsButton = (function (_super) {
        __extends(BallsButton, _super);
        function BallsButton(x, y, parent) {
            var _this = this;
            var container = Game.Global.game.add.image(x, y, Game.Global.ATLAS_0, "buttonSmGreen", parent);
            container.anchor.set(0.5);
            _this = _super.call(this, container) || this;
            var caption = new Phaser.BitmapText(Game.Global.game, 0, 0, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.balls), 34);
            caption.anchor.set(0.5);
            container.addChild(caption);
            var noticeIcon = new Phaser.Image(Game.Global.game, 60, -46, Game.Global.ATLAS_0, "noticeIcon");
            noticeIcon.visible = Game.Global.saveData.newBalls;
            container.addChild(noticeIcon);
            return _this;
        }
        BallsButton.prototype.enabledClb = function () {
        };
        BallsButton.prototype.disabledClb = function () {
        };
        BallsButton.prototype.pressedClb = function () {
            this._container.scale.set(0.9);
        };
        BallsButton.prototype.releasedClb = function (clicked) {
            this._container.scale.set(1);
        };
        return BallsButton;
    }(Controls.ButtonBase));
    CourtSelection.BallsButton = BallsButton;
})(CourtSelection || (CourtSelection = {}));
var CourtSelection;
(function (CourtSelection) {
    var GiftButton = (function (_super) {
        __extends(GiftButton, _super);
        function GiftButton(x, y, parent) {
            var _this = this;
            var container = Game.Global.game.add.image(x, y, Game.Global.ATLAS_0, GiftButton.NORMAL_FRAME_NAME, parent);
            container.anchor.set(0.5);
            _this = _super.call(this, container) || this;
            container.addChild(new Phaser.Image(Game.Global.game, 58, -74, Game.Global.ATLAS_0, "giftBoxSmall"));
            container.addChild(new Phaser.BitmapText(Game.Global.game, -156, -48, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.giftBtnTitle), GiftButton.TITLE_FONT_SIZE));
            _this._message = new Phaser.BitmapText(Game.Global.game, -156, -10, Game.Global.FONT_0, "", GiftButton.TEXT_FONT_SIZE);
            container.addChild(_this._message);
            _this._noticeIcon = Game.Global.game.add.image(140, -58, Game.Global.ATLAS_0, "noticeIcon");
            _this._noticeIcon.anchor.set(0.5);
            container.addChild(_this._noticeIcon);
            return _this;
        }
        Object.defineProperty(GiftButton.prototype, "content", {
            get: function () { return this._content; },
            set: function (content) {
                this._content = content;
                this.updateGiftLockState(content.locked);
            },
            enumerable: true,
            configurable: true
        });
        GiftButton.prototype.update = function () {
            if (this._content.locked != this._giftLocked) {
                this.updateGiftLockState(!this._giftLocked);
            }
            else if (this._giftLocked) {
                this.updateGiftUnlockTime();
            }
        };
        GiftButton.prototype.updateGiftLockState = function (locked) {
            this._giftLocked = locked;
            if (locked) {
                this.enabled = false;
                this._giftUnlockTime = -1000;
                this.updateGiftUnlockTime();
                this._noticeIcon.kill();
            }
            else {
                this.enabled = true;
                this._message.text = Game.Global.getText(Game.eTextAsset.openNow);
                this._noticeIcon.revive();
            }
        };
        GiftButton.prototype.updateGiftUnlockTime = function () {
            var remTime = this._content.timeToUnlock;
            if (Math.abs(this._giftUnlockTime - remTime) < 1000)
                return;
            this._giftUnlockTime = remTime;
            var msg;
            var value = Math.floor(remTime / (1000 * 60 * 60));
            if (value < 10) {
                msg = "0" + value;
            }
            else {
                msg = value.toString();
            }
            msg += ":";
            var i = remTime % (1000 * 60 * 60);
            value = Math.floor(i / (1000 * 60));
            if (value < 10) {
                msg += "0" + value;
            }
            else {
                msg += value.toString();
            }
            msg += ":";
            value = Math.floor((i % (1000 * 60)) / 1000);
            if (value < 10) {
                msg += "0" + value;
            }
            else {
                msg += value.toString();
            }
            this._message.text = msg;
        };
        GiftButton.prototype.enabledClb = function () {
            this._container.frameName = GiftButton.NORMAL_FRAME_NAME;
        };
        GiftButton.prototype.disabledClb = function () {
            this._container.frameName = GiftButton.DISABLED_FRAME_NAME;
        };
        GiftButton.prototype.pressedClb = function () {
            this._container.scale.set(0.9);
        };
        GiftButton.prototype.releasedClb = function (clicked) {
            this._container.scale.set(1);
        };
        GiftButton.NORMAL_FRAME_NAME = "giftCard";
        GiftButton.DISABLED_FRAME_NAME = "giftCardLocked";
        GiftButton.TITLE_FONT_SIZE = 34;
        GiftButton.TEXT_FONT_SIZE = 28;
        return GiftButton;
    }(Controls.ButtonBase));
    CourtSelection.GiftButton = GiftButton;
})(CourtSelection || (CourtSelection = {}));
var CourtSelection;
(function (CourtSelection) {
    var CourtLsbItem = (function (_super) {
        __extends(CourtLsbItem, _super);
        function CourtLsbItem(parent) {
            var _this = _super.call(this, Game.Global.game, parent) || this;
            _this._bg = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "card", _this._container);
            _this._icon = Game.Global.game.add.image(CourtLsbItem.ICON_X, CourtLsbItem.ICON_Y, Game.Global.ATLAS_0, "courtIcon_0", _this._container);
            _this._title = Game.Global.game.add.bitmapText(CourtLsbItem.TITLE_X, CourtLsbItem.TITLE_Y, Game.Global.FONT_0, "", CourtLsbItem.TITLE_FONT_SIZE, _this._container);
            _this._playBtn = new CourtSelection.CourtLsbItemBtn(CourtLsbItem.PLAY_BTN_X, CourtLsbItem.PLAY_BTN_Y, _this._container);
            _this._playBtn.onClick.add(_this.playButtonClickClb, _this);
            _this._prizeGroup = Game.Global.game.add.group(_this._container);
            _this._prizeGroup.position.set(CourtLsbItem.TEXT_X, CourtLsbItem.PRIZE_Y);
            var bmText = Game.Global.game.add.bitmapText(0, 0, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.prize), CourtLsbItem.TEXT_FONT_SIZE, _this._prizeGroup);
            bmText.tint = 0;
            var img = Game.Global.game.add.image(bmText.width + 10, bmText.height / 2, Game.Global.ATLAS_0, "coinIcon", _this._prizeGroup);
            img.anchor.set(0, 0.5);
            _this._prize = Game.Global.game.add.bitmapText(_this._prizeGroup.width + 10, 0, Game.Global.FONT_0, "", CourtLsbItem.TEXT_FONT_SIZE, _this._prizeGroup);
            _this._prize.tint = 0;
            _this._highscore = Game.Global.game.add.bitmapText(CourtLsbItem.TEXT_X, CourtLsbItem.HIGHSCORE_Y, Game.Global.FONT_0, "", CourtLsbItem.TEXT_FONT_SIZE, _this._container);
            _this._highscore.tint = 0;
            _this._infoMessage = Game.Global.game.add.bitmapText(CourtLsbItem.TEXT_X, CourtLsbItem.INFO_MESSAGE_Y, Game.Global.FONT_0, "", CourtLsbItem.TEXT_FONT_SIZE, _this._container);
            _this._infoMessage.tint = 0x909090;
            return _this;
        }
        CourtLsbItem.prototype.activate = function (id, y, content) {
            _super.prototype.activate.call(this, id, y, content);
            var data = content;
            this._icon.frameName = data.iconKey;
            this._title.text = data.title;
            this._playBtn.content = data;
            if (!data.locked) {
                this._bg.frameName = "card";
                if (data.prize > 0) {
                    this._prizeGroup.visible = true;
                    this._prize.text = "+" + data.prize;
                    this._infoMessage.visible = false;
                }
                else {
                    this._prizeGroup.visible = false;
                    this._infoMessage.text = data.description;
                    this._infoMessage.visible = true;
                }
                this._highscore.text = Game.Global.getText(Game.eTextAsset.bestScore1) + " " + data.highScore;
                this._highscore.visible = true;
            }
            else {
                this._bg.frameName = "cardLocked";
                this._prizeGroup.visible = false;
                this._highscore.visible = false;
                this._infoMessage.text = data.lockedMessage;
                this._infoMessage.visible = true;
            }
            return this;
        };
        CourtLsbItem.prototype.playButtonClickClb = function () {
            Game.Global.selectedCourt = this._content;
            Game.Global.saveData.save();
            Utils.AudioUtils.playSound("click");
            Game.Global.game.state.start("Play");
        };
        CourtLsbItem.ICON_X = 16;
        CourtLsbItem.ICON_Y = 16;
        CourtLsbItem.TITLE_X = 176;
        CourtLsbItem.TITLE_Y = 20;
        CourtLsbItem.TITLE_FONT_SIZE = 36;
        CourtLsbItem.PLAY_BTN_X = 290;
        CourtLsbItem.PLAY_BTN_Y = 218;
        CourtLsbItem.TEXT_FONT_SIZE = 28;
        CourtLsbItem.TEXT_X = 184;
        CourtLsbItem.PRIZE_Y = 90;
        CourtLsbItem.HIGHSCORE_Y = 130;
        CourtLsbItem.INFO_MESSAGE_Y = 90;
        return CourtLsbItem;
    }(Controls.ListBoxItemBase));
    CourtSelection.CourtLsbItem = CourtLsbItem;
})(CourtSelection || (CourtSelection = {}));
var CourtSelection;
(function (CourtSelection) {
    var CourtLsbItemBtn = (function (_super) {
        __extends(CourtLsbItemBtn, _super);
        function CourtLsbItemBtn(x, y, parent) {
            var _this = this;
            var container = Game.Global.game.add.image(x, y, Game.Global.ATLAS_0, CourtLsbItemBtn.NORMAL_FRAME_NAME, parent);
            container.anchor.set(0.5);
            _this = _super.call(this, container) || this;
            _this._caption = new Phaser.BitmapText(Game.Global.game, 0, 0, Game.Global.FONT_0, "", 42);
            _this._caption.anchor.set(0.5, 0.4);
            container.addChild(_this._caption);
            return _this;
        }
        Object.defineProperty(CourtLsbItemBtn.prototype, "content", {
            get: function () { return this._content; },
            set: function (content) {
                this._content = content;
                if (!content.locked) {
                    this.enabled = true;
                    this._caption.text = Game.Global.getText(Game.eTextAsset.play);
                }
                else {
                    this.enabled = false;
                    this._caption.text = Game.Global.getText(Game.eTextAsset.locked);
                }
            },
            enumerable: true,
            configurable: true
        });
        CourtLsbItemBtn.prototype.enabledClb = function () {
            this._container.frameName = CourtLsbItemBtn.NORMAL_FRAME_NAME;
        };
        CourtLsbItemBtn.prototype.disabledClb = function () {
            this._container.frameName = CourtLsbItemBtn.DISABLED_FRAME_NAME;
        };
        CourtLsbItemBtn.prototype.pressedClb = function () {
            this._container.scale.set(0.9);
        };
        CourtLsbItemBtn.prototype.releasedClb = function (clicked) {
            this._container.scale.set(1);
        };
        CourtLsbItemBtn.NORMAL_FRAME_NAME = "buttonLgGreen";
        CourtLsbItemBtn.DISABLED_FRAME_NAME = "buttonLgDisabled";
        return CourtLsbItemBtn;
    }(Controls.ButtonBase));
    CourtSelection.CourtLsbItemBtn = CourtLsbItemBtn;
})(CourtSelection || (CourtSelection = {}));
var Playfield;
(function (Playfield) {
    var PopupMessageType = (function (_super) {
        __extends(PopupMessageType, _super);
        function PopupMessageType() {
            return _super.call(this, 150, 1000, Phaser.Easing.Cubic.Out, 900, 500, Phaser.Easing.Linear.None) || this;
        }
        PopupMessageType.prototype.updateMessage = function (time, msg) {
            if (time < 750) {
                msg.getMsgContainer().scale.set(1.3 - Phaser.Easing.Elastic.Out(time / 750) * 0.3);
            }
            else {
                msg.getMsgContainer().scale.set(1);
            }
            return _super.prototype.updateMessage.call(this, time, msg);
        };
        return PopupMessageType;
    }(PopupMessage.MessageType));
    Playfield.PopupMessageType = PopupMessageType;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var TimeBonusMessage = (function (_super) {
        __extends(TimeBonusMessage, _super);
        function TimeBonusMessage() {
            var _this = _super.call(this) || this;
            _this._msgContainer = new Phaser.Group(Game.Global.game);
            Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "timeIcon", _this._msgContainer).anchor.y = 0.5;
            _this._timeValue = Game.Global.game.add.bitmapText(_this._msgContainer.width + 5, 0, Game.Global.FONT_1, "", 30, _this._msgContainer);
            _this._timeValue.anchor.y = 0.4;
            return _this;
        }
        TimeBonusMessage.prototype.getMsgContainer = function () {
            return this._msgContainer;
        };
        TimeBonusMessage.prototype.show = function (x, y, timeBonus, type) {
            this._timeValue.text = "+" + timeBonus;
            Playfield.Playfield.instance.fxLayer.add(this._msgContainer, true);
            _super.prototype.showMessage.call(this, x - this._msgContainer.width / 2, y, type, Game.Global.elapsedTime);
        };
        TimeBonusMessage.prototype.update = function () {
            return _super.prototype.update.call(this, Game.Global.elapsedTime);
        };
        TimeBonusMessage.prototype.kill = function () {
            _super.prototype.kill.call(this);
            this._msgContainer.parent.removeChild(this._msgContainer);
        };
        return TimeBonusMessage;
    }(PopupMessage.MessageBase));
    Playfield.TimeBonusMessage = TimeBonusMessage;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var PointsMessage = (function (_super) {
        __extends(PointsMessage, _super);
        function PointsMessage() {
            var _this = _super.call(this) || this;
            _this._msgContainer = new Phaser.Group(Game.Global.game);
            _this._msgPart1 = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "msgPlus_2", _this._msgContainer);
            _this._msgPart2 = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "msgPoints", _this._msgContainer);
            return _this;
        }
        PointsMessage.prototype.getMsgContainer = function () {
            return this._msgContainer;
        };
        PointsMessage.prototype.show = function (x, y, msgKey, type) {
            this._msgPart1.frameName = msgKey;
            var msgW = this._msgPart1.width + 10 + this._msgPart2.width;
            this._msgPart1.x = -(msgW / 2);
            this._msgPart2.x = this._msgPart1.x + this._msgPart1.width + 10;
            var halfMsgW = msgW / 2;
            var camera = Game.Global.game.camera;
            if (x - halfMsgW < camera.x) {
                x = halfMsgW;
            }
            else if (x + halfMsgW > camera.x + camera.width) {
                x = camera.x + camera.width - halfMsgW;
            }
            Playfield.Playfield.instance.fxLayer.add(this._msgContainer, true);
            _super.prototype.showMessage.call(this, x, y, type, Game.Global.elapsedTime);
        };
        PointsMessage.prototype.update = function () {
            return _super.prototype.update.call(this, Game.Global.elapsedTime);
        };
        PointsMessage.prototype.kill = function () {
            _super.prototype.kill.call(this);
            this._msgContainer.parent.removeChild(this._msgContainer);
        };
        return PointsMessage;
    }(PopupMessage.MessageBase));
    Playfield.PointsMessage = PointsMessage;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var InfoMessage = (function (_super) {
        __extends(InfoMessage, _super);
        function InfoMessage() {
            var _this = _super.call(this) || this;
            if (InfoMessage._type == undefined) {
                InfoMessage._type = new SlideMessage.MessageType(Game.Global.game, -1, 750, Phaser.Easing.Elastic.Out, 0, Phaser.Easing.Cubic.Out, 500, 750, Phaser.Easing.Cubic.In, 0, Phaser.Easing.Linear.None);
            }
            _this._msgContainer = new Phaser.Image(Game.Global.game, 0, 0, Game.Global.ATLAS_0);
            _this._msgContainer.anchor.set(0, 0.5);
            return _this;
        }
        InfoMessage.prototype.getMsgContainer = function () {
            return this._msgContainer;
        };
        InfoMessage.prototype.show = function (y, msgFrameName) {
            this._msgContainer.frameName = msgFrameName;
            Playfield.Playfield.instance.fxLayer.add(this._msgContainer, true);
            _super.prototype.showMessage.call(this, y, InfoMessage._type, Game.Global.elapsedTime);
        };
        InfoMessage.prototype.update = function () {
            return _super.prototype.update.call(this, Game.Global.elapsedTime);
        };
        InfoMessage.prototype.kill = function () {
            if (this._msgContainer.parent != null) {
                this._msgContainer.parent.removeChild(this._msgContainer);
                _super.prototype.kill.call(this);
            }
        };
        return InfoMessage;
    }(SlideMessage.MessageBase));
    Playfield.InfoMessage = InfoMessage;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var BallController = (function () {
        function BallController() {
        }
        BallController.prototype.onBallFloorHit = function (ball) {
            return true;
        };
        BallController.prototype.onBallOutOfScreen = function (ball) {
            return true;
        };
        return BallController;
    }());
    Playfield.BallController = BallController;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var AIBallPhySimData = (function () {
        function AIBallPhySimData(time, offsetX, offsetY) {
            this._time = time;
            this._offsetX = offsetX;
            this._offsetY = offsetY;
        }
        Object.defineProperty(AIBallPhySimData.prototype, "time", {
            get: function () { return this._time; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AIBallPhySimData.prototype, "offsetX", {
            get: function () { return this._offsetX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AIBallPhySimData.prototype, "offsetY", {
            get: function () { return this._offsetY; },
            enumerable: true,
            configurable: true
        });
        return AIBallPhySimData;
    }());
    var AILaunchData = (function () {
        function AILaunchData() {
        }
        return AILaunchData;
    }());
    var AIShotData = (function () {
        function AIShotData(launchAngle, posCorrection, velocityX, velocityY, gravity) {
            var step = 250;
            var minOffsetY = Playfield.Backboard.MIN_Y;
            var maxOffsetY = Playfield.Backboard.MAX_Y;
            var offsetX = 0;
            var offsetY = 0;
            var stepX = velocityX / step;
            var stepY;
            var time = 0;
            var timeStep = 1000 / step;
            var gravityStep = gravity / step;
            var _ballPhySimData = [];
            while (true) {
                stepY = velocityY / step;
                offsetX += stepX;
                offsetY += stepY;
                velocityY += gravityStep;
                if (stepY > 0 && offsetY >= minOffsetY) {
                    _ballPhySimData.push(new AIBallPhySimData(time, offsetX, offsetY));
                    if (offsetY > maxOffsetY)
                        break;
                }
                time += timeStep;
            }
            this._ballPhySimData = _ballPhySimData;
            this._angle = launchAngle - 90;
            this._posCorrection = posCorrection;
        }
        AIShotData.prototype.setupLaunchData = function (launchData) {
            var basketTime = Game.Global.elapsedTime + this._ballPhySimData[this._ballPhySimData.length - 1].time + 500;
            var basketPos = Playfield.Backboard.instance.getPosInTime(basketTime);
            var basketY = basketPos.y + Playfield.Backboard.BASKET_VOFFSET;
            var data = null;
            var dataId = this._ballPhySimData.length;
            while (dataId-- != 0) {
                data = this._ballPhySimData[dataId];
                if (data.offsetY <= basketY) {
                    if (dataId != this._ballPhySimData.length - 1) {
                        var topDif = basketY - data.offsetY;
                        var botDif = this._ballPhySimData[dataId + 1].offsetY - basketY;
                        if (botDif < topDif)
                            data = this._ballPhySimData[dataId + 1];
                        break;
                    }
                }
            }
            var success = Game.Global.game.rnd.realInRange(0, 99) < Game.Global.selectedCourt.aiSuccessRate;
            if ((Game.Global.game.rnd.realInRange(0, 1) < 0.5 && basketPos.x + data.offsetX - this._posCorrection <= Game.Global.GAME_MAX_WIDTH / 2 + Playfield.Ball.START_X_MAX_OFFSET) ||
                basketPos.x - data.offsetX + this._posCorrection < Game.Global.GAME_MAX_WIDTH / 2 - Playfield.Ball.START_X_MAX_OFFSET) {
                launchData.angle = 90 - this._angle;
                launchData.pos = basketPos.x + data.offsetX - this._posCorrection;
            }
            else {
                launchData.angle = 90 + this._angle;
                launchData.pos = basketPos.x - data.offsetX + this._posCorrection;
            }
            if (!success) {
                var mistake = Game.Global.game.rnd.realInRange(90, 120);
                if (Game.Global.game.rnd.realInRange(0, 1) < 0.5) {
                    mistake *= -1;
                }
                launchData.pos += mistake;
            }
            launchData.time = basketTime - data.time;
        };
        return AIShotData;
    }());
    var AI = (function (_super) {
        __extends(AI, _super);
        function AI() {
            var _this = _super.call(this) || this;
            _this._launchData = new AILaunchData();
            return _this;
        }
        AI.prototype.ai = function () {
            return true;
        };
        AI.prototype.reset = function () {
            this._launchDataSet = false;
            this._playfieldState = Playfield.ePlayfieldState.waitForStart;
        };
        AI.prototype.update = function (playfieldState) {
            if (this._playfieldState != Playfield.ePlayfieldState.game) {
                if (playfieldState == Playfield.ePlayfieldState.game) {
                    this._launchData.time = Game.Global.elapsedTime + (Game.Global.selectedBall.id != 13 ? 1000 : 5000);
                }
            }
            this._playfieldState = playfieldState;
            if (playfieldState == Playfield.ePlayfieldState.game && Playfield.HUD.instance.time != 0 && Game.Global.elapsedTime >= this._launchData.time) {
                if (!this._launchDataSet) {
                    AI._shotData[Game.Global.game.rnd.integerInRange(0, AI._shotData.length - 1)].setupLaunchData(this._launchData);
                    this._launchDataSet = true;
                }
                else {
                    var ball = Playfield.BallManager.instance.activateBall();
                    ball.show(this, false, false, this._launchData.pos);
                    ball.launch(this._launchData.angle);
                    this._launchData.time = Game.Global.elapsedTime + Math.round(Game.Global.selectedCourt.aiShotInterval * Game.Global.game.rnd.realInRange(0.7, 1.1));
                    this._launchDataSet = false;
                }
            }
        };
        AI.prototype.onBallSuccessfulShot = function (ball) {
            var hud = Playfield.HUD.instance;
            hud.aiScore += (ball.hitBasketHoop ? 2 : 3);
        };
        AI.initShots = function () {
            AI._shotData = [];
            AI._shotData.push(new AIShotData(90, 0, 0, -2000, 4000));
            AI._shotData.push(new AIShotData(93, 40, 121.57310485839844, -2319.7531127929687, 4000));
            AI._shotData.push(new AIShotData(96, 90, 243.7038230895996, -2318.686981201172, 4000));
        };
        return AI;
    }(Playfield.BallController));
    Playfield.AI = AI;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            var _this = _super.call(this) || this;
            Player._instance = _this;
            _this._roundBalls = [];
            for (var i = 0; i < Player.MAX_BALLS_PER_ROUND; i++)
                _this._roundBalls.push(null);
            _this._aim = new Utils.DragAim(Game.Global.game, 150, 0, true, 20, 20);
            _this._aim.onAimed.add(_this.launchBall, _this);
            return _this;
        }
        Object.defineProperty(Player, "instance", {
            get: function () { return Player._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "roundRemBallCnt", {
            get: function () { return this._roundRemBallCnt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "activeBallCnt", {
            get: function () { return this._actBallCnt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "successfulShots", {
            get: function () { return this._successfulShots; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "ballLaunched", {
            get: function () { return this._ballLaunched; },
            enumerable: true,
            configurable: true
        });
        Player.prototype.ai = function () {
            return false;
        };
        Player.prototype.reset = function () {
            this._ballLaunched = false;
            this._successfulShots = 0;
            this._actBallCnt = 0;
            this.startRound();
        };
        Player.prototype.update = function (playfieldState) {
            this._ballLaunched = false;
            if (playfieldState != Playfield.ePlayfieldState.gameOver && this._roundRemBallCnt != 0)
                this._aim.update();
        };
        Player.prototype.startRound = function () {
            var balls = Playfield.BallManager.instance;
            var fireBall = Playfield.FireBallBar.instance.fireBallActive;
            var powerUp = Playfield.PowerUpManager.instance.actPowerUp;
            if (fireBall)
                Utils.AudioUtils.playSound("fireBall1");
            if (powerUp == Playfield.ePowerUp.multiBall) {
                this._roundBalls[1] = balls.activateBall().show(this, fireBall, false, Game.Global.GAME_MAX_WIDTH / 2 - Player.MULTI_BALL_SPACING, 1, true);
                this._roundBalls[2] = balls.activateBall().show(this, fireBall, false, Game.Global.GAME_MAX_WIDTH / 2 + Player.MULTI_BALL_SPACING, 2, true);
                this._roundBalls[0] = balls.activateBall().show(this, fireBall, false, Game.Global.GAME_MAX_WIDTH / 2, 0, true);
                this._roundRemBallCnt = Player.MAX_BALLS_PER_ROUND;
            }
            else {
                this._roundBalls[0] = balls.activateBall().show(this, fireBall, powerUp == Playfield.ePowerUp.smallBall, Playfield.Playfield.instance.state == Playfield.ePlayfieldState.waitForStart ? Game.Global.GAME_MAX_WIDTH / 2 : undefined);
                this._roundRemBallCnt = 1;
            }
            this._actBallCnt += this._roundRemBallCnt;
            this._aim.reset();
        };
        Player.prototype.launchBall = function (aimStartPos, aimDir, aimLen, targetObject) {
            if (this._roundRemBallCnt == 0 || Playfield.HUD.instance.time == 0)
                return;
            this._ballLaunched = true;
            var ballId;
            if (this._roundRemBallCnt > 1) {
                if (targetObject != null && targetObject.sprite != undefined && targetObject.sprite._ball != undefined) {
                    ballId = targetObject.sprite._ball.id;
                }
                else {
                    var selBall = void 0;
                    var selBallDistance = null;
                    for (ballId = 0; ballId < Player.MAX_BALLS_PER_ROUND; ballId++) {
                        var ball = this._roundBalls[ballId];
                        if (ball != null) {
                            var dis = Math.abs(ball.position.x - aimStartPos.x);
                            if (dis < ball.radius) {
                                selBall = ball;
                                break;
                            }
                            if (selBallDistance == null || selBallDistance > dis) {
                                selBallDistance = dis;
                                selBall = ball;
                            }
                        }
                    }
                    ballId = selBall.id;
                }
            }
            else {
                for (ballId = 0; ballId < Player.MAX_BALLS_PER_ROUND; ballId++) {
                    if (this._roundBalls[ballId] != null)
                        break;
                }
            }
            var launchDir = 90 + (90 - -aimDir);
            launchDir = 90 + (Player.AIM_ROUNDING * Math.round((launchDir - 90) / Player.AIM_ROUNDING));
            this._roundBalls[ballId].launch(launchDir);
            this._roundBalls[ballId] = null;
            this._roundRemBallCnt--;
            Utils.AudioUtils.playSound("shoot");
        };
        Player.prototype.onBallSuccessfulShot = function (ball) {
            var playfield = Playfield.Playfield.instance;
            playfield.emitStars(ball.position.x, ball.position.y, Playfield.eStarEmitter.both);
            playfield.scorePoints(ball);
            this._successfulShots++;
        };
        Player.prototype.onBallFloorHit = function (ball) {
            var hitId = ball.floorHitId;
            var bounceVol;
            if (hitId == 0) {
                bounceVol = 1;
            }
            else if (hitId <= 3) {
                bounceVol = 1 - (hitId * (1 / 4));
            }
            else {
                bounceVol = 0;
            }
            if (bounceVol != 0)
                Utils.AudioUtils.playSound("bounceFloor", bounceVol);
            if (ball.active) {
                this._actBallCnt--;
                return false;
            }
            return true;
        };
        Player.prototype.onBallOutOfScreen = function (ball) {
            if (ball.active) {
                this._actBallCnt--;
                return false;
            }
            return true;
        };
        Player.AIM_ROUNDING = 2;
        Player.MAX_BALLS_PER_ROUND = 3;
        Player.MULTI_BALL_SPACING = 160;
        return Player;
    }(Playfield.BallController));
    Playfield.Player = Player;
})(Playfield || (Playfield = {}));
var BallFireFx;
(function (BallFireFx) {
    var Spot = (function () {
        function Spot() {
            this._image = new Phaser.Image(Game.Global.game, 0, 0, Game.Global.ATLAS_0, "fireFxSpot");
            this._image.anchor.set(0.5);
        }
        Spot.prototype.show = function (ball, layer) {
            this._ball = ball;
            this._timer = Game.Global.elapsedTime;
            var rnd = Game.Global.game.rnd;
            this._distance = rnd.realInRange(0.1, 0.9);
            this._dir = rnd.realInRange(0, 359.9);
            layer.add(this._image, true);
        };
        Spot.prototype.update = function () {
            var progress = (Game.Global.elapsedTime - this._timer) / Spot.LIFE_SPAN;
            if (progress >= 1)
                return false;
            var ballScale = this._ball.scale;
            var startScale = Spot.START_SCALE * ballScale;
            var endScale = Spot.END_SCALE * ballScale;
            this._image.scale.set(startScale + (endScale - startScale) * Phaser.Easing.Cubic.Out(progress));
            this._image.alpha = (1 - Phaser.Easing.Linear.None(progress)) * this._ball.alpha;
            var distance = this._ball.radius * this._distance;
            var dir = Phaser.Math.degToRad(this._dir + this._ball.angle);
            this._image.position.set(Math.cos(dir) * distance, Math.sin(dir) * distance);
            return true;
        };
        Spot.prototype.kill = function () {
            this._image.parent.remove(this._image, false, true);
        };
        Spot.LIFE_SPAN = 1000;
        Spot.START_SCALE = 1;
        Spot.END_SCALE = 4;
        return Spot;
    }());
    BallFireFx.Spot = Spot;
})(BallFireFx || (BallFireFx = {}));
var BallFireFx;
(function (BallFireFx) {
    var Ring = (function () {
        function Ring() {
            this._image = new Phaser.Image(Game.Global.game, 0, 0, Game.Global.ATLAS_0, "fireFxRing");
            this._image.anchor.set(0.5);
        }
        Ring.prototype.show = function (ball, layer) {
            this._ball = ball;
            this._image.scale.set(Ring.START_SCALE * ball.scale);
            this._image.alpha = 1;
            this._image.revive();
            layer.add(this._image);
            this._timer = Game.Global.elapsedTime;
        };
        Ring.prototype.update = function () {
            var progress = (Game.Global.elapsedTime - this._timer) / Ring.LIFE_SPAN;
            if (progress >= 1)
                return false;
            var ballScale = this._ball.scale;
            var startScale = Ring.START_SCALE * ballScale;
            var endScale = Ring.END_SCALE * ballScale;
            this._image.scale.set(startScale + (endScale - startScale) * Phaser.Easing.Quadratic.Out(progress));
            this._image.alpha = (1 - Phaser.Easing.Cubic.Out(progress)) * this._ball.alpha;
            return true;
        };
        Ring.prototype.kill = function () {
            this._image.parent.remove(this._image, false, true);
        };
        Ring.START_SCALE = 1;
        Ring.END_SCALE = 1.5;
        Ring.LIFE_SPAN = 750;
        return Ring;
    }());
    BallFireFx.Ring = Ring;
})(BallFireFx || (BallFireFx = {}));
var Playfield;
(function (Playfield) {
    var eHUDMode;
    (function (eHUDMode) {
        eHUDMode[eHUDMode["singlePlayer"] = 0] = "singlePlayer";
        eHUDMode[eHUDMode["vsAI"] = 1] = "vsAI";
    })(eHUDMode = Playfield.eHUDMode || (Playfield.eHUDMode = {}));
    var HUD = (function () {
        function HUD() {
            HUD._instance = this;
            this._layer = Game.Global.game.add.group();
            this._layer.fixedToCamera = true;
            this._layer.cameraOffset.set(0, 0);
            this._bg = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "HUD_0", this._layer);
            this._scoreTxt = Game.Global.game.add.bitmapText(0, HUD.SCORE_Y, Game.Global.FONT_0, "", 42, this._layer);
            this._scoreTxt.anchor.set(0.5);
            this._aiScoreTxt = Game.Global.game.add.bitmapText(HUD.AI_SCORE_X, HUD.SCORE_Y, Game.Global.FONT_0, "", 42, this._layer);
            this._aiScoreTxt.anchor.set(0.5);
            this._timeTxt = Game.Global.game.add.bitmapText(0, HUD.TIME_Y, Game.Global.FONT_0, "", 42, this._layer);
            this._timeTxt.anchor.set(0.5);
        }
        Object.defineProperty(HUD, "instance", {
            get: function () { return HUD._instance; },
            enumerable: true,
            configurable: true
        });
        HUD.prototype.reset = function (mode) {
            this._mode = mode;
            this.resetScore();
            this.resetTime();
            var hudBg = "HUD_" + mode;
            if (this._bg.frameName != hudBg)
                this._bg.frameName = hudBg;
        };
        HUD.prototype.update = function (playfieldState) {
            if (playfieldState == Playfield.ePlayfieldState.game) {
                var prevSeconds = this.seconds;
                this.time -= Game.Global.deltaRatio;
                var seconds = this.seconds;
                if (prevSeconds != seconds) {
                    if (seconds <= 5) {
                        Utils.AudioUtils.playSound(seconds != 0 ? "tick" : "siren");
                        if (seconds == 0)
                            Playfield.Playfield.instance.timeOut();
                    }
                }
            }
        };
        Object.defineProperty(HUD.prototype, "score", {
            get: function () { return this._score; },
            set: function (score) {
                var change = score - this._score;
                if (change != 0) {
                    this._score = score;
                    this._scoreTxt.text = score.toString();
                    Game.Global.totalScore += change;
                    if (Game.Global.GAMEE)
                        Gamee2.Gamee.score = score;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HUD.prototype, "aiScore", {
            get: function () { return this._aiScore; },
            set: function (score) {
                this._aiScore = score;
                this._aiScoreTxt.text = score.toString();
            },
            enumerable: true,
            configurable: true
        });
        HUD.prototype.resetScore = function () {
            this._score = 0;
            this._scoreTxt.text = this._score.toString();
            this.aiScore = 0;
            if (this._mode == eHUDMode.singlePlayer) {
                this._scoreTxt.position.x = HUD.SCORE_X_0;
                this._aiScoreTxt.kill();
            }
            else {
                this._aiScoreTxt.revive();
                this._scoreTxt.position.x = HUD.SCORE_X_1;
            }
        };
        Object.defineProperty(HUD.prototype, "time", {
            get: function () {
                return this._time;
            },
            set: function (time) {
                if (time < 0)
                    time = 0;
                var seconds = Math.ceil(time / Game.Global.FPS);
                if (seconds != Math.ceil(this._time / Game.Global.FPS)) {
                    if (seconds < 10) {
                        this._timeTxt.text = "0" + seconds;
                    }
                    else {
                        this._timeTxt.text = seconds.toString();
                    }
                }
                this._time = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HUD.prototype, "seconds", {
            get: function () {
                return Math.ceil(this._time / Game.Global.FPS);
            },
            enumerable: true,
            configurable: true
        });
        HUD.prototype.resetTime = function () {
            this._time = 0;
            this.time = Game.Global.selectedCourt.id == 0 ? HUD.TUTORIAL_TIME : HUD.GAME_TIME;
            this._timeTxt.x = (this._mode == eHUDMode.singlePlayer ? HUD.TIME_X_0 : HUD.TIME_X_1);
        };
        HUD.prototype.addTime = function (seconds) {
            this.time += seconds * Game.Global.FPS;
        };
        HUD.SCORE_X_0 = 275;
        HUD.SCORE_X_1 = 161;
        HUD.SCORE_Y = 79;
        HUD.AI_SCORE_X = 480;
        HUD.GAME_TIME = 60 * Game.Global.FPS;
        HUD.TUTORIAL_TIME = 30 * Game.Global.FPS;
        HUD.TIME_X_0 = 460;
        HUD.TIME_X_1 = 346;
        HUD.TIME_Y = 79;
        return HUD;
    }());
    Playfield.HUD = HUD;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var ePowerUp;
    (function (ePowerUp) {
        ePowerUp[ePowerUp["multiBall"] = 0] = "multiBall";
        ePowerUp[ePowerUp["smallBall"] = 1] = "smallBall";
        ePowerUp[ePowerUp["none"] = 2] = "none";
    })(ePowerUp = Playfield.ePowerUp || (Playfield.ePowerUp = {}));
    var PowerUpManager = (function () {
        function PowerUpManager() {
            PowerUpManager._instance = this;
            this._sprite = Game.Global.game.add.sprite(0, 0, Game.Global.ATLAS_0, "powerUp_0", Playfield.Backboard.instance.middleLayer);
        }
        Object.defineProperty(PowerUpManager, "instance", {
            get: function () { return PowerUpManager._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerUpManager.prototype, "actPowerUp", {
            get: function () { return this._actPowerUp; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerUpManager.prototype, "phyColGroup", {
            get: function () { return this._phyColGroup; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerUpManager.prototype, "phyBodyId", {
            get: function () {
                return this._sprite.body.id;
            },
            enumerable: true,
            configurable: true
        });
        PowerUpManager.prototype.setupPhysics = function () {
            var physics = Game.Global.game.physics.p2;
            physics.enable(this._sprite, Game.Global.DEBUG);
            this._phyColGroup = physics.createCollisionGroup();
            var body = this._sprite.body;
            body.static = true;
            body.setCircle(33).sensor = true;
            body.setCollisionGroup(this._phyColGroup);
            body.collides(Playfield.BallManager.instance.ballCollisionGroup);
        };
        PowerUpManager.prototype.reset = function () {
            this._hideTweens = [];
            this._hideTweens.push(Game.Global.game.add.tween(this._sprite).to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.In, false));
            this._hideTweens.push(Game.Global.game.add.tween(this._sprite.scale).to({ x: 1.5, y: 1.5 }, 1000, Phaser.Easing.Cubic.Out, false));
            this._hideTweens[0].onComplete.add(function () {
                this._sprite.kill();
            }, this);
            this._actPowerUp = ePowerUp.none;
            this._spritePowerUp = ePowerUp.none;
            this._sprite.kill();
            if (Game.Global.selectedCourt.id != 0) {
                if (Game.Global.selectedBall.id != 10) {
                    this._nextPowerUpTime = Game.Global.game.rnd.integerInRange(25000, 35000);
                }
                else {
                    this._nextPowerUpTime = Game.Global.game.rnd.integerInRange(16000, 24000);
                }
            }
            else {
                this._nextPowerUpTime = 0;
            }
        };
        PowerUpManager.prototype.startRound = function () {
            if (this._spritePowerUp != ePowerUp.none) {
                this.hidePowerUp(false);
            }
            if (this._actPowerUp == ePowerUp.none && this._nextPowerUpTime > 0 && Game.Global.elapsedTime >= this._nextPowerUpTime && !this._sprite.visible) {
                var rnd = Game.Global.game.rnd;
                this._spritePowerUp = rnd.integerInRange(0, 1);
                var pos = Playfield.Backboard.instance.getPosInTime(Game.Global.elapsedTime + rnd.integerInRange(3000, 6000));
                if (pos.y > Playfield.Backboard.MIN_Y) {
                    pos.y = rnd.integerInRange(Playfield.Backboard.MIN_Y, pos.y);
                }
                pos.y -= 20;
                this._sprite.revive();
                this._sprite.frameName = "powerUp_" + this._spritePowerUp.toString();
                this._sprite.body.reset(pos.x, pos.y);
                this._nextPowerUpTime = 0;
                if (Game.Global.selectedBall.id == 10 && Game.Global.elapsedTime < 35 * 1000) {
                    this._nextPowerUpTime = rnd.integerInRange(36000, 44000);
                }
            }
        };
        PowerUpManager.prototype.hidePowerUp = function (pickedUp) {
            if (this._spritePowerUp != ePowerUp.none) {
                if (pickedUp) {
                    Utils.AudioUtils.playSound("powerUp");
                    this._actPowerUp = this._spritePowerUp;
                    Playfield.Playfield.instance.showInfoMessage("msgPowerUp" + this._actPowerUp);
                    var powerUpLifeSpan = 10 * 1000;
                    if (Game.Global.selectedBall.id == 10)
                        powerUpLifeSpan *= 2;
                    Game.Global.game.time.events.add(powerUpLifeSpan, this.deactivatePowerUp, this);
                }
                var i = this._hideTweens.length;
                while (i-- != 0)
                    this._hideTweens[i].start();
                this._spritePowerUp = ePowerUp.none;
            }
        };
        PowerUpManager.prototype.deactivatePowerUp = function () {
            this._actPowerUp = ePowerUp.none;
        };
        return PowerUpManager;
    }());
    Playfield.PowerUpManager = PowerUpManager;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var Tutorial = (function () {
        function Tutorial() {
            var game = Game.Global.game;
            this._layer = game.add.group();
            this._layer.position.set(Game.Global.GAME_MAX_WIDTH / 2, 600);
            game.add.image(0, 50, Game.Global.ATLAS_0, "arrow", this._layer).anchor.set(0.5, 0);
            this._hand = game.add.image(0, Tutorial.MOVE_DISTANCE, Game.Global.ATLAS_0, "hand", this._layer);
            this._hand.anchor.set(0.01);
            this._layer.visible = this._layer.exists = false;
        }
        Tutorial.prototype.show = function () {
            if (!this._layer.visible) {
                var game_1 = Game.Global.game;
                this._moveTween = game_1.add.tween(this._hand).to({ y: 0 }, 1000, Phaser.Easing.Quadratic.Out, true);
                this._moveTween.onComplete.add(function () {
                    this._moveRestartEvent = game_1.time.events.add(200, function () {
                        this._hand.y = Tutorial.MOVE_DISTANCE;
                        this._moveTween.start();
                    }, this);
                }, this);
                this._layer.visible = this._layer.exists = true;
            }
        };
        Tutorial.prototype.hide = function () {
            if (this._layer.visible) {
                this._layer.visible = this._layer.exists = false;
                this._moveTween.stop(false);
                if (this._moveRestartEvent != undefined)
                    Game.Global.game.time.events.remove(this._moveRestartEvent);
            }
        };
        Tutorial.MOVE_DISTANCE = 300;
        return Tutorial;
    }());
    Playfield.Tutorial = Tutorial;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield_1) {
    var eStarEmitter;
    (function (eStarEmitter) {
        eStarEmitter[eStarEmitter["both"] = 0] = "both";
    })(eStarEmitter = Playfield_1.eStarEmitter || (Playfield_1.eStarEmitter = {}));
    var ePlayfieldState;
    (function (ePlayfieldState) {
        ePlayfieldState[ePlayfieldState["game"] = 0] = "game";
        ePlayfieldState[ePlayfieldState["waitForStart"] = 1] = "waitForStart";
        ePlayfieldState[ePlayfieldState["gameOver"] = 2] = "gameOver";
    })(ePlayfieldState = Playfield_1.ePlayfieldState || (Playfield_1.ePlayfieldState = {}));
    var Playfield = (function () {
        function Playfield() {
            Playfield._instance = this;
            this._bg = Game.Global.game.add.sprite(Game.Global.GAME_MAX_WIDTH / 2, Game.Global.GAME_MAX_HEIGHT / 2, Game.Global.ATLAS_1, "bg_" + Game.Global.selectedCourt.id);
            this._bg.anchor.set(0.5);
            this._bg.name = "playfield";
            var physics = Game.Global.game.physics.p2;
            this._phyColGroup = physics.createCollisionGroup();
            this._backboard = new Playfield_1.Backboard();
            this._powerUp = new Playfield_1.PowerUpManager();
            this._balls = new Playfield_1.BallManager();
            this._player = new Playfield_1.Player();
            if (Game.Global.selectedCourt.id != 0)
                this._ai = new Playfield_1.AI();
            this._hud = new Playfield_1.HUD();
            this._fireBallBar = new Playfield_1.FireBallBar();
            this._fireBallBar.onFireBallStart.add(function () {
                this.showInfoMessage("msgFire");
            }, this);
            this._fxLayer = Game.Global.game.add.group();
            this.initMessages();
            this.initStarEmitters();
            this._menuButton = null;
            this._giftButton = null;
            if (Game.Global.saveData.trainingCompleted) {
                this._menuButton = new Playfield_1.MenuButton();
                this._menuButton.onClick.add(function () {
                    Utils.AudioUtils.playSound("click");
                    Game.Global.game.state.start("CourtSelection");
                }, this);
                if (!Game.Global.dailyGift.locked) {
                    this._giftButton = new Playfield_1.GiftButton();
                    this._giftButton.onClick.add(function () {
                        Utils.AudioUtils.playSound("click");
                        Game.Global.game.state.start("DailyGift", true, false, "Play");
                    }, this);
                }
            }
            this._tutorial = (Game.Global.selectedCourt.id == 0 ? new Playfield_1.Tutorial() : null);
            this.setupPhysics();
            Game.Play.instance.onResize.add(this.resize, this);
        }
        Object.defineProperty(Playfield, "instance", {
            get: function () { return Playfield._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "backboard", {
            get: function () { return this._backboard; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "balls", {
            get: function () { return this._balls; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "player", {
            get: function () { return this._player; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "hud", {
            get: function () { return this._hud; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "fxLayer", {
            get: function () { return this._fxLayer; },
            enumerable: true,
            configurable: true
        });
        Playfield.prototype.reset = function () {
            this._state = ePlayfieldState.waitForStart;
            if (this._tutorial != null)
                this._tutorial.show();
            this._fireBallBar.reset();
            this._powerUp.reset();
            this._hud.reset(Game.Global.selectedCourt.id == 0 ? Playfield_1.eHUDMode.singlePlayer : Playfield_1.eHUDMode.vsAI);
            this.resetMessages();
            this._backboard.reset();
            this._balls.reset();
            this._player.reset();
            if (Game.Global.selectedCourt.id != 0)
                this._ai.reset();
            if (this._menuButton != null)
                this._menuButton.show();
            if (this._giftButton != null)
                this._giftButton.show();
            this._timeOutTime = 0;
        };
        Playfield.prototype.update = function () {
            var state = this._state;
            this._backboard.update();
            this._balls.update();
            this._player.update(state);
            if (state == ePlayfieldState.game) {
                if (this._timeOutTime == 0) {
                    if (this._player.activeBallCnt == 0) {
                        this._player.startRound();
                        this._powerUp.startRound();
                    }
                }
                else {
                    if (this._hud.time == 0) {
                        if (Game.Global.elapsedTime - this._timeOutTime >= 2000 && this._player.activeBallCnt - this._player.roundRemBallCnt == 0) {
                            this._state = ePlayfieldState.gameOver;
                            Game.Play.instance.gameOver(this._hud.score, this._hud.aiScore);
                        }
                    }
                    else {
                        this._timeOutTime = 0;
                    }
                }
            }
            else if (state == ePlayfieldState.waitForStart) {
                if (this._player.ballLaunched) {
                    if (this._tutorial != null)
                        this._tutorial.hide();
                    if (this._menuButton != null)
                        this._menuButton.hide();
                    if (this._giftButton != null)
                        this._giftButton.hide();
                    this._state = ePlayfieldState.game;
                }
                else {
                    if (this._giftButton != null)
                        this._giftButton.update();
                }
            }
            if (Game.Global.selectedCourt.id != 0)
                this._ai.update(state);
            this._fireBallBar.update(state);
            this._hud.update(state);
            this._pointsMessages.updateObjects();
            this._timeBnsMessages.updateObjects();
            this._infoMessage.update();
        };
        Playfield.prototype.resize = function (width, height) {
            var camera = Game.Global.game.camera;
            camera.y = Game.Global.GAME_MAX_HEIGHT - Math.max(994, height);
            camera.update();
            if (this._menuButton != null)
                this._menuButton.updatePosition();
            if (this._giftButton != null)
                this._giftButton.updatePosition();
        };
        Playfield.prototype.scorePoints = function (ball) {
            var popupMsgY = ball.position.y;
            var points;
            if (ball.hitBasketHoop) {
                points = 2;
                Utils.AudioUtils.playSound("successfulShot");
            }
            else {
                points = 3;
                this.showInfoMessage("msgPerfectShot");
                Utils.AudioUtils.playSound("perfectShot");
            }
            if (ball.fireBall) {
                points *= this._fireBallBar.multiplier;
            }
            this._hud.score += points;
            var fireBall = this._fireBallBar.fireBallActive;
            this._fireBallBar.incValue(1 / 4);
            var timeBonus = 0;
            if (Game.Global.selectedCourt.id != 0 && !ball.hitBasketHoop)
                timeBonus += Game.Global.selectedBall.timeBonus;
            if (timeBonus != 0) {
                this._hud.addTime(timeBonus);
                popupMsgY -= 25;
                this._timeBnsMessages.activateObject().show(ball.position.x, popupMsgY, timeBonus, this._popupMsgType);
                popupMsgY += 50;
            }
            this._pointsMessages.activateObject().show(ball.position.x, popupMsgY, "msgPlus" + points, this._popupMsgType);
        };
        Playfield.prototype.timeOut = function () {
            this._timeOutTime = Game.Global.elapsedTime;
        };
        Playfield.prototype.showInfoMessage = function (msg) {
            if (this._infoMessage.state == SlideMessage.eMessageState.completed) {
                this._infoMessage.show(Playfield.INFO_MSG_Y, msg);
            }
            else {
                this._infoMessageStack.add(msg);
            }
        };
        Playfield.prototype.initMessages = function () {
            this._popupMsgType = new Playfield_1.PopupMessageType();
            this._pointsMessages = new Utils.GameObjectCollection(Playfield_1.PointsMessage);
            this._timeBnsMessages = new Utils.GameObjectCollection(Playfield_1.TimeBonusMessage);
            this._infoMessage = new Playfield_1.InfoMessage();
            this._infoMessage.onStateChange.add(this.onInfoMessageStateChange, this);
            this._infoMessageStack = new Collections.LinkedList();
        };
        Playfield.prototype.resetMessages = function () {
            this._pointsMessages.reset();
            this._timeBnsMessages.reset();
            this._infoMessage.kill();
            this._infoMessageStack.clear();
        };
        Playfield.prototype.onInfoMessageStateChange = function (state) {
            if (state == SlideMessage.eMessageState.completed) {
                if (!this._infoMessageStack.isEmpty) {
                    this._infoMessage.show(Playfield.INFO_MSG_Y, this._infoMessageStack.elementAtIndex(0));
                    this._infoMessageStack.removeElementAtIndex(0);
                }
            }
        };
        Playfield.prototype.emitStars = function (x, y, side) {
            var emitter = this._starEmitters[side];
            emitter.position.set(x, y);
            emitter.explode(2000, 10);
        };
        Playfield.prototype.initStarEmitters = function () {
            this._starEmitters = [];
            var emitter = Game.Global.game.add.emitter(0, 0, 15);
            emitter.setXSpeed(-300, 300);
            emitter.setYSpeed(-700, -300);
            emitter.setAlpha(1, 0, 2000);
            emitter.setScale(0.5, 1, 0.5, 1, 2000);
            emitter.gravity = 1200;
            emitter.makeParticles(Game.Global.ATLAS_0, "partStar", emitter.maxParticles, false, false);
            this._fxLayer.add(emitter, true);
            this._starEmitters[eStarEmitter.both] = emitter;
        };
        Object.defineProperty(Playfield.prototype, "phyColGroup", {
            get: function () { return this._phyColGroup; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "phyBody", {
            get: function () { return this._bg.body; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "floorPhyShape", {
            get: function () { return this._floorPhyShape; },
            enumerable: true,
            configurable: true
        });
        Playfield.prototype.setupPhysics = function () {
            var balls = Playfield_1.BallManager.instance;
            var physics = Game.Global.game.physics.p2;
            physics.enable(this._bg, Game.Global.DEBUG);
            var body = this._bg.body;
            body.static = true;
            body.clearShapes();
            body.collides(balls.ballCollisionGroup);
            var shape = body.addRectangle(Game.Global.GAME_MAX_WIDTH * 4, Game.Global.GAME_MAX_HEIGHT - Playfield.FLOOR_Y, 0, Playfield.FLOOR_Y - (Game.Global.GAME_MAX_HEIGHT / 2) + ((Game.Global.GAME_MAX_HEIGHT - Playfield.FLOOR_Y) / 2));
            var material = physics.createMaterial("floor");
            body.setCollisionGroup(this._phyColGroup, shape);
            body.setMaterial(material, shape);
            var contactMaterial = physics.createContactMaterial(material, balls.ballMaterial);
            contactMaterial.friction = 0.8;
            contactMaterial.restitution = 0.6;
            this._floorPhyShape = shape;
            this._backboard.setupPhysics();
            this._powerUp.setupPhysics();
        };
        Playfield.WALL_W = 100;
        Playfield.FLOOR_Y = 912;
        Playfield.INFO_MSG_Y = 600;
        Playfield.MENU_BUTTON_Y = 260;
        return Playfield;
    }());
    Playfield_1.Playfield = Playfield;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var Backboard = (function () {
        function Backboard() {
            var game = Game.Global.game;
            Backboard._instance = this;
            this._backboard = game.add.sprite(0, 0, Game.Global.ATLAS_0, "board_" + Game.Global.selectedCourt.id);
            this._backboard.anchor.set(0.5, 0.5);
            this._backboard.name = "basket";
            this._middleLayer = game.add.group();
            this._basket = game.add.group();
            this._net = game.add.image(0, 4, Game.Global.ATLAS_0, "net", this._basket);
            this._net.anchor.set(0.5, 0);
            var hoop = game.add.image(0, 0, Game.Global.ATLAS_0, "hoop", this._basket);
            hoop.anchor.set(0.5, 0);
            this._posInTime = new Phaser.Point();
        }
        Object.defineProperty(Backboard, "instance", {
            get: function () { return Backboard._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Backboard.prototype, "middleLayer", {
            get: function () { return this._middleLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Backboard.prototype, "basketBodyId", {
            get: function () { return this._backboard.body.id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Backboard.prototype, "basketSensorShapeId", {
            get: function () { return this._basketSensorShapeId; },
            enumerable: true,
            configurable: true
        });
        Backboard.prototype.setupPhysics = function () {
            var balls = Playfield.BallManager.instance;
            var physics = Game.Global.game.physics.p2;
            physics.enable(this._backboard, Game.Global.DEBUG);
            var body = this._backboard.body;
            body.kinematic = true;
            body.clearShapes();
            body.addCircle(10, -61, 61);
            body.addCircle(10, 60, 61);
            var sensor = body.addRectangle(80, 20, 0, 120);
            sensor.sensor = true;
            this._basketSensorShapeId = sensor.id;
            body.setCollisionGroup(Playfield.Playfield.instance.phyColGroup);
            body.collides(balls.ballCollisionGroup);
            var material = physics.createMaterial("basketHoop", body);
            var contactMaterial = physics.createContactMaterial(material, balls.ballMaterial);
            contactMaterial.restitution = 0.3;
            contactMaterial.friction = 0.5;
        };
        Backboard.prototype.reset = function () {
            var body = this._backboard.body;
            body.reset(Backboard.START_X, Backboard.START_Y, false, false);
            this._basket.position.set(Backboard.START_X, Backboard.START_Y + Backboard.BASKET_VOFFSET);
            this._net.scale.y = 1;
            this._netFxTimer = null;
            this._hMoveEnableTime = 0;
            this._vMoveEnableTime = 0;
        };
        Backboard.prototype.update = function () {
            if (Playfield.HUD.instance.time != 0) {
                if (this._hMoveEnableTime == 0) {
                    if (Playfield.Player.instance.successfulShots >= 5) {
                        this._hMoveEnableTime = Game.Global.elapsedTime;
                    }
                }
                else if (this._vMoveEnableTime == 0) {
                    if (Playfield.Player.instance.successfulShots >= 10) {
                        this._vMoveEnableTime = Game.Global.elapsedTime;
                    }
                }
                if (this._hMoveEnableTime != 0) {
                    var body = this._backboard.body;
                    this.getPosInTime(Game.Global.elapsedTime);
                    body.x = this._posInTime.x;
                    body.y = this._posInTime.y;
                    this._basket.position.set(this._posInTime.x, this._posInTime.y + Backboard.BASKET_VOFFSET);
                }
            }
            if (this._netFxTimer != null) {
                var progress = (Game.Global.elapsedTime - this._netFxTimer) / 1000;
                if (progress >= 1) {
                    progress = 1;
                    this._netFxTimer = null;
                }
                this._net.scale.y = 1.2 - Phaser.Easing.Elastic.Out(progress) * 0.2;
            }
        };
        Backboard.prototype.showNetFx = function () {
            if (this._netFxTimer == null)
                this._netFxTimer = Game.Global.elapsedTime;
        };
        Backboard.prototype.getPosInTime = function (time) {
            if (this._hMoveEnableTime == 0) {
                this._posInTime.set(Backboard.START_X, Backboard.START_Y);
            }
            else {
                var pos = ((time - this._hMoveEnableTime) / Game.Global.FPS) * Backboard.MOVE_SPEED_PER_FRAME;
                if (pos <= Backboard.START_X - Backboard.MIN_X) {
                    this._posInTime.x = Backboard.START_X - pos;
                }
                else {
                    pos -= Backboard.START_X - Backboard.MIN_X;
                    pos %= ((Backboard.MAX_X - Backboard.MIN_X) * 2);
                    if (pos <= Backboard.MAX_X - Backboard.MIN_X) {
                        pos = Backboard.MIN_X + pos;
                    }
                    else {
                        pos = Backboard.MAX_X - (pos - (Backboard.MAX_X - Backboard.MIN_X));
                    }
                    this._posInTime.x = pos;
                }
                if (this._vMoveEnableTime == 0) {
                    this._posInTime.y = Backboard.START_Y;
                }
                else {
                    pos = ((time - this._vMoveEnableTime) / Game.Global.FPS) * Backboard.MOVE_SPEED_PER_FRAME;
                    pos %= ((Backboard.MAX_Y - Backboard.MIN_Y) * 2);
                    if (pos <= Backboard.MAX_Y - Backboard.MIN_Y) {
                        pos = Backboard.MIN_Y + pos;
                    }
                    else {
                        pos = Backboard.MAX_Y - (pos - (Backboard.MAX_Y - Backboard.MIN_Y));
                    }
                    this._posInTime.y = pos;
                }
            }
            return this._posInTime;
        };
        Backboard.START_X = 320;
        Backboard.START_Y = 410;
        Backboard.BASKET_VOFFSET = 53;
        Backboard.MIN_X = 170;
        Backboard.MAX_X = 470;
        Backboard.MIN_Y = Backboard.START_Y;
        Backboard.MAX_Y = Backboard.MIN_Y + 100;
        Backboard.MOVE_SPEED_PER_FRAME = 2;
        return Backboard;
    }());
    Playfield.Backboard = Backboard;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var eBallState;
    (function (eBallState) {
        eBallState[eBallState["wait"] = 0] = "wait";
        eBallState[eBallState["launch"] = 1] = "launch";
        eBallState[eBallState["fall"] = 2] = "fall";
        eBallState[eBallState["hide"] = 3] = "hide";
    })(eBallState || (eBallState = {}));
    var eBallFlag;
    (function (eBallFlag) {
        eBallFlag[eBallFlag["hitHoop"] = 1] = "hitHoop";
        eBallFlag[eBallFlag["scaleBall"] = 2] = "scaleBall";
        eBallFlag[eBallFlag["fireBall"] = 4] = "fireBall";
        eBallFlag[eBallFlag["scored"] = 8] = "scored";
        eBallFlag[eBallFlag["smallBall"] = 16] = "smallBall";
        eBallFlag[eBallFlag["aiControlled"] = 32] = "aiControlled";
        eBallFlag[eBallFlag["active"] = 64] = "active";
        eBallFlag[eBallFlag["stuck"] = 128] = "stuck";
    })(eBallFlag || (eBallFlag = {}));
    var BallSprite = (function (_super) {
        __extends(BallSprite, _super);
        function BallSprite(ball) {
            var _this = _super.call(this, Game.Global.game, 0, 0, Game.Global.ATLAS_0, Game.Global.selectedBall.imageKey) || this;
            _this._ball = ball;
            return _this;
        }
        BallSprite.prototype.postUpdate = function () {
            _super.prototype.postUpdate.call(this);
            if (this.exists)
                this._ball.postUpdate();
        };
        return BallSprite;
    }(Phaser.Sprite));
    var Ball = (function () {
        function Ball() {
            if (Ball._fallColGroups == undefined) {
                Ball._fallColGroups = [Playfield.Playfield.instance.phyColGroup, Playfield.PowerUpManager.instance.phyColGroup];
            }
            this._flags = 0;
            this._scaleRatio = 1;
            this._updateFnc = [undefined, this.updateLaunch, this.updateFall, this.updateHide];
            this._shadow = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "ballShadow", Playfield.BallManager.instance.getLayer(Playfield.eBallLayer.behindBasketAI));
            this._shadow.anchor.set(0.5, 0.6);
            this._ball = new BallSprite(this);
            this._ball.anchor.set(0.5);
            this._ball.kill();
            Game.Global.game.physics.p2.enable(this._ball, Game.Global.DEBUG);
            var body = this._ball.body;
            this.createBallShape();
            body.onBeginContact.add(this.impactClb, this);
            this.initFireFx();
            this._sparks = new Utils.GameObjectCollection(Playfield.BallSpark);
        }
        Object.defineProperty(Ball.prototype, "active", {
            get: function () {
                return (this._flags & eBallFlag.active) != 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "floorHitId", {
            get: function () { return this._floorHitId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "alpha", {
            get: function () {
                return this._ball.alpha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "scale", {
            get: function () {
                return this._ball.scale.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "angle", {
            get: function () {
                return this._ball.angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "hitBasketHoop", {
            get: function () {
                return (this._flags & eBallFlag.hitHoop) != 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "position", {
            get: function () {
                return this._ball.position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "radius", {
            get: function () {
                return this._ball.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ball.prototype, "aiControlled", {
            get: function () {
                return (this._flags & eBallFlag.aiControlled) != 0;
            },
            enumerable: true,
            configurable: true
        });
        Ball.prototype.show = function (controller, fireBall, smallBall, x, id, inputEnabled) {
            if (id === void 0) { id = 0; }
            if (inputEnabled === void 0) { inputEnabled = false; }
            var balls = Playfield.BallManager.instance;
            var changeShape = (this._flags & eBallFlag.smallBall) != 0 != smallBall;
            var ballLayer;
            this._id = id;
            this._flags = eBallFlag.active;
            this._controller = controller;
            this._floorHitId = 0;
            if (controller.ai()) {
                this._flags |= eBallFlag.aiControlled;
                this._alphaRatio = 0.4;
                this._data = Game.Global.balls[0];
                ballLayer = balls.getLayer(Playfield.eBallLayer.inFrontOfBasketAI);
            }
            else {
                this._alphaRatio = 1;
                this._data = Game.Global.selectedBall;
                ballLayer = balls.getLayer(Playfield.eBallLayer.inFrontOfBasketPl);
            }
            if (fireBall) {
                this._flags |= eBallFlag.fireBall;
                Playfield.FireBallBar.instance.onFireBallEnd.addOnce(this.cancelFireBall, this);
                this._fireFxNextRingTime = 0;
                this._fireFxNextSpotTime = 0;
                this._fireFxRingLayer = balls.getBallFxLayer();
                ballLayer.add(this._fireFxRingLayer);
            }
            this._nextSparkTime = 0;
            if (smallBall) {
                this._flags |= eBallFlag.smallBall;
                this._scaleRatio = Ball.SMALL_BALL_SCALE_RATIO;
            }
            else {
                this._scaleRatio = 1;
            }
            this._ball.frameName = this._data.imageKey;
            this._ball.revive();
            this._ball.alpha = this._alphaRatio;
            this._ball.scale.set(Ball.START_SCALE * this._scaleRatio);
            this._ball.inputEnabled = inputEnabled;
            ballLayer.add(this._ball);
            if (fireBall || this._data.id == 15) {
                this._fxLayer = balls.getBallFxLayer();
                ballLayer.add(this._fxLayer);
            }
            else {
                this._fxLayer = null;
            }
            var body = this._ball.body;
            if (changeShape)
                this.createBallShape();
            if (x == undefined)
                x = Game.Global.game.rnd.integerInRange((Game.Global.GAME_MAX_WIDTH / 2) - Ball.START_X_MAX_OFFSET, (Game.Global.GAME_MAX_WIDTH / 2) + Ball.START_X_MAX_OFFSET);
            body.reset(x, Ball.START_Y, false, false);
            body.angle = 0;
            body.damping = 0;
            body.removeCollisionGroup(Ball._fallColGroups);
            body.data.gravityScale = 0;
            if (!this.aiControlled) {
                this._shadow.revive();
                this._shadow.scale.set(1 * this._scaleRatio);
                this._shadow.alpha = 1;
                this._shadow.position.set(body.x, body.y + (this._ball.height / 2));
            }
            this._state = eBallState.wait;
            return this;
        };
        Ball.prototype.launch = function (dir) {
            if (dir < Ball.LAUNCH_MIN_DIR) {
                dir = Ball.LAUNCH_MIN_DIR;
            }
            else if (dir > Ball.LAUNCH_MAX_DIR) {
                dir = Ball.LAUNCH_MAX_DIR;
            }
            var speed = Ball.STRAIGHT_LAUNCH_SPEED + (Phaser.Easing.Sinusoidal.In(Math.abs(90 - dir) / (90 - Ball.LAUNCH_MIN_DIR)) * (Ball.SLOPING_LAUNCH_SPEED - Ball.STRAIGHT_LAUNCH_SPEED));
            dir = Phaser.Math.degToRad(dir);
            var pX = Math.cos(dir) * speed;
            var pY = Math.sin(dir) * speed;
            var body = this._ball.body;
            body.data.gravityScale = 1;
            body.applyImpulse([pX, pY], 0, 0);
            var velX = body.velocity.x;
            var velY = body.velocity.y;
            this._shadow.kill();
            this._flags |= eBallFlag.scaleBall;
            if ((this._flags & eBallFlag.fireBall) != 0)
                this._fireFxNextTailParticleTime = Game.Global.elapsedTime;
            this._launchTime = Game.Global.elapsedTime;
            this._scored = false;
            this._state = eBallState.launch;
        };
        Ball.prototype.update = function () {
            if ((this._flags & eBallFlag.scaleBall) != 0) {
                var progress = (Game.Global.elapsedTime - this._launchTime) / 800;
                if (progress >= 1) {
                    progress = 1;
                    this._flags &= ~eBallFlag.scaleBall;
                }
                var startScale = Ball.START_SCALE * this._scaleRatio;
                var endScale = Ball.END_SCALE * this._scaleRatio;
                this._ball.scale.set(startScale - (startScale - endScale) * progress);
            }
            var fnc = this._updateFnc[this._state];
            if (fnc != undefined)
                return fnc.call(this);
            return true;
        };
        Ball.prototype.postUpdate = function () {
            if (this._fxLayer != null)
                this._fxLayer.position.copyFrom(this._ball.position);
            if ((this._flags & eBallFlag.fireBall) != 0)
                this.updateFireFx();
            if (this._data.id == 15) {
                if (Game.Global.elapsedTime >= this._nextSparkTime) {
                    this._nextSparkTime = Game.Global.elapsedTime + Ball.SPARK_INTERVAL;
                    this._sparks.activateObject().show(this, this._fxLayer);
                }
                this._sparks.updateObjects();
            }
        };
        Ball.prototype.kill = function () {
            if (this._ball.alive) {
                this._flags &= ~eBallFlag.active;
                this._ball.kill();
                this._shadow.kill();
                this._sparks.reset();
                if (this._fxLayer != null) {
                    Playfield.BallManager.instance.releaseBallFxLayer(this._fxLayer);
                    this._fxLayer = null;
                }
                this.cancelFireBall();
            }
        };
        Ball.prototype.updateLaunch = function () {
            if (this._ball.body.velocity.y >= 0) {
                this._state = eBallState.fall;
                var newLayer = Playfield.BallManager.instance.getLayer(this.aiControlled ? Playfield.eBallLayer.behindBasketAI : Playfield.eBallLayer.behindBasketPl);
                if (this.fireBall)
                    newLayer.addChild(this._fireFxRingLayer);
                newLayer.addChild(this._ball);
                if (this._fxLayer != null)
                    newLayer.addChild(this._fxLayer);
                this._ball.body.collides(Ball._fallColGroups);
            }
            return this.checkBallHPos();
        };
        Ball.prototype.updateFall = function () {
            var velocity = this._ball.body.velocity;
            if ((this._flags & eBallFlag.stuck) == 0) {
                if (Math.abs(velocity.x) < 1 && Math.abs(velocity.y) < 1) {
                    this._stuckTime = Game.Global.elapsedTime;
                    this._flags |= eBallFlag.stuck;
                }
                this.updateShadow();
                return this.checkBallHPos();
            }
            else {
                if (Math.abs(velocity.x) < 1 && Math.abs(velocity.y) < 1) {
                    if (Game.Global.elapsedTime - this._stuckTime >= 1500) {
                        this._controller.onBallOutOfScreen(this);
                        this.hideBall();
                        this._flags &= ~eBallFlag.active;
                    }
                }
                else {
                    this._flags &= ~eBallFlag.stuck;
                }
            }
            return true;
        };
        Ball.prototype.updateHide = function () {
            var progress = (Game.Global.elapsedTime - this._hideTime) / Ball.HIDE_LEN;
            if (progress >= 1)
                return false;
            this._ball.alpha = this._alphaRatio - this._alphaRatio * Phaser.Easing.Cubic.In(progress);
            this.updateShadow();
            return true;
        };
        Ball.prototype.updateShadow = function () {
            var floorDis = Playfield.Playfield.FLOOR_Y - this._ball.y;
            if (floorDis < 0)
                floorDis = 0;
            if (floorDis <= Ball.SHADOW_VISIBILITY_DIS) {
                if (!this._shadow.alive)
                    this._shadow.revive();
                var ratio = 1 - (floorDis / Ball.SHADOW_VISIBILITY_DIS);
                this._shadow.position.set(this._ball.x, Playfield.Playfield.FLOOR_Y + 10);
                this._shadow.alpha = ratio * this._ball.alpha;
                this._shadow.scale.set(Ball.SHADOW_MIN_SCALE + ((Ball.SHADOW_MAX_SCALE - Ball.SHADOW_MIN_SCALE) * ratio));
            }
        };
        Ball.prototype.checkBallHPos = function () {
            var x = this._ball.x;
            var out = false;
            if (x < this._ball.previousPosition.x) {
                if (x + this.radius <= 0)
                    out = true;
            }
            else if (x - this.radius >= Game.Global.GAME_MAX_WIDTH) {
                out = true;
            }
            if (out) {
                if (!this._controller.onBallOutOfScreen(this))
                    this._flags &= ~eBallFlag.active;
                if ((this._flags & (eBallFlag.scored | eBallFlag.aiControlled)) == 0 && Playfield.FireBallBar.instance.fireBallActive)
                    Playfield.FireBallBar.instance.clear();
                return false;
            }
            return true;
        };
        Ball.prototype.impactClb = function (phaserBody, p2Body, shapeA, shapeB) {
            var contactShapeId = shapeB.id;
            if (phaserBody.id == Playfield.Playfield.instance.phyBody.id) {
                var playfield = Playfield.Playfield.instance;
                if (contactShapeId == playfield.floorPhyShape.id) {
                    if (!this._controller.onBallFloorHit(this))
                        this._flags &= ~eBallFlag.active;
                    if (this._floorHitId++ == 0)
                        this.hideBall();
                }
            }
            else if (phaserBody.id == Playfield.Backboard.instance.basketBodyId) {
                var backboard = Playfield.Backboard.instance;
                if (contactShapeId == backboard.basketSensorShapeId) {
                    if (this._floorHitId == 0 && !this._scored) {
                        this._flags |= eBallFlag.scored;
                        this._scored = true;
                        backboard.showNetFx();
                        this._controller.onBallSuccessfulShot(this);
                    }
                }
                else {
                    if ((this._flags & eBallFlag.hitHoop) == 0) {
                        this._flags |= eBallFlag.hitHoop;
                        if (!this.aiControlled)
                            Utils.AudioUtils.playSound("bounceHoop");
                    }
                }
            }
            else if (!this.aiControlled && phaserBody.id == Playfield.PowerUpManager.instance.phyBodyId) {
                Playfield.PowerUpManager.instance.hidePowerUp(true);
            }
        };
        Ball.prototype.hideBall = function () {
            if (this._state != eBallState.hide) {
                this._state = eBallState.hide;
                this._hideTime = Game.Global.elapsedTime;
                if ((this._flags & (eBallFlag.scored | eBallFlag.aiControlled)) == 0 && Playfield.FireBallBar.instance.fireBallActive)
                    Playfield.FireBallBar.instance.clear();
            }
        };
        Ball.prototype.createBallShape = function () {
            var body = this._ball.body;
            body.clearCollision(true, true);
            body.setCircle(125 * Ball.END_SCALE * this._scaleRatio);
            body.setMaterial(Playfield.BallManager.instance.ballMaterial);
            body.setCollisionGroup(Playfield.BallManager.instance.ballCollisionGroup);
        };
        Object.defineProperty(Ball.prototype, "fireBall", {
            get: function () {
                return (this._flags & eBallFlag.fireBall) != 0;
            },
            enumerable: true,
            configurable: true
        });
        Ball.prototype.initFireFx = function () {
            this._fireFxRings = new Utils.GameObjectCollection(BallFireFx.Ring);
            this._fireFxSpots = new Utils.GameObjectCollection(BallFireFx.Spot);
        };
        Ball.prototype.updateFireFx = function () {
            var time = Game.Global.elapsedTime;
            this._fireFxRingLayer.position.copyFrom(this._ball.position);
            if (time >= this._fireFxNextRingTime) {
                this._fireFxNextRingTime = time + Ball.FIREFX_RING_INTERVAL;
                this._fireFxRings.activateObject().show(this, this._fireFxRingLayer);
            }
            this._fireFxRings.updateObjects();
            if (time >= this._fireFxNextSpotTime) {
                this._fireFxNextSpotTime = time + Ball.FIREFX_SPOT_INTERVAL;
                this._fireFxSpots.activateObject().show(this, this._fxLayer);
            }
            this._fireFxSpots.updateObjects();
            if ((this._state == eBallState.launch || this._state == eBallState.fall) && time >= this._fireFxNextTailParticleTime) {
                Playfield.BallManager.instance.activateFireBallTailParticle(this._ball.previousPosition, this._ball.scale.x);
                this._fireFxNextTailParticleTime = time + Ball.FIREFX_TAIL_INTERVAL;
            }
        };
        Ball.prototype.cancelFireBall = function () {
            if ((this._flags & eBallFlag.fireBall) != 0) {
                this._flags &= ~eBallFlag.fireBall;
                Playfield.FireBallBar.instance.onFireBallEnd.remove(this.cancelFireBall, this);
                Playfield.BallManager.instance.releaseBallFxLayer(this._fireFxRingLayer);
                this._fireFxRingLayer = null;
                this._fireFxRings.reset();
                this._fireFxSpots.reset();
            }
        };
        Ball.START_X_MAX_OFFSET = 190;
        Ball.START_Y = 950;
        Ball.START_SCALE = 1;
        Ball.END_SCALE = 0.35;
        Ball.SMALL_BALL_SCALE_RATIO = 0.7;
        Ball.SHADOW_VISIBILITY_DIS = 400;
        Ball.SHADOW_MIN_SCALE = 0.1;
        Ball.SHADOW_MAX_SCALE = 0.4;
        Ball.HIDE_LEN = 1000;
        Ball.LAUNCH_MIN_DIR = 75;
        Ball.LAUNCH_MAX_DIR = 105;
        Ball.STRAIGHT_LAUNCH_SPEED = 116;
        Ball.SLOPING_LAUNCH_SPEED = 119;
        Ball.SPARK_INTERVAL = 500;
        Ball.FIREFX_RING_INTERVAL = 250;
        Ball.FIREFX_SPOT_INTERVAL = 250;
        Ball.FIREFX_TAIL_INTERVAL = 75;
        return Ball;
    }());
    Playfield.Ball = Ball;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var eBallLayer;
    (function (eBallLayer) {
        eBallLayer[eBallLayer["behindBasketAI"] = 0] = "behindBasketAI";
        eBallLayer[eBallLayer["behindBasketPl"] = 1] = "behindBasketPl";
        eBallLayer[eBallLayer["inFrontOfBasketAI"] = 2] = "inFrontOfBasketAI";
        eBallLayer[eBallLayer["inFrontOfBasketPl"] = 3] = "inFrontOfBasketPl";
    })(eBallLayer = Playfield.eBallLayer || (Playfield.eBallLayer = {}));
    var BallManager = (function () {
        function BallManager() {
            BallManager._instance = this;
            this._fireBallTailParticles = new Utils.GameObjectCollection(BallFireFx.TailParticle);
            this._ballFxLayers = new Collections.Pool(undefined, 6, true, this.createBallFxLayer, this);
            this._balls = new Utils.GameObjectCollection(Playfield.Ball);
            this._layers = [];
            this._layers[eBallLayer.behindBasketAI] = Game.Global.game.add.group(Playfield.Backboard.instance.middleLayer);
            this._layers[eBallLayer.behindBasketPl] = Game.Global.game.add.group(Playfield.Backboard.instance.middleLayer);
            this._layers[eBallLayer.inFrontOfBasketAI] = Game.Global.game.add.group();
            this._layers[eBallLayer.inFrontOfBasketPl] = Game.Global.game.add.group();
            var physics = Game.Global.game.physics.p2;
            this._collisionGroup = physics.createCollisionGroup();
            this._material = physics.createMaterial("ball");
        }
        Object.defineProperty(BallManager, "instance", {
            get: function () { return BallManager._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallManager.prototype, "ballCollisionGroup", {
            get: function () { return this._collisionGroup; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallManager.prototype, "ballMaterial", {
            get: function () { return this._material; },
            enumerable: true,
            configurable: true
        });
        BallManager.prototype.reset = function () {
            this._fireBallTailParticles.reset();
            this._balls.reset();
        };
        BallManager.prototype.update = function () {
            this._balls.updateObjects();
            this._fireBallTailParticles.updateObjects();
        };
        BallManager.prototype.getLayer = function (layer) {
            return this._layers[layer];
        };
        BallManager.prototype.activateBall = function () {
            return this._balls.activateObject();
        };
        BallManager.prototype.activateFireBallTailParticle = function (pos, scale) {
            this._fireBallTailParticles.activateObject().show(pos, scale, this._layers[eBallLayer.behindBasketPl], 0);
        };
        BallManager.prototype.getBallFxLayer = function () {
            return this._ballFxLayers.getItem();
        };
        BallManager.prototype.releaseBallFxLayer = function (layer) {
            if (layer.parent != null)
                layer.parent.removeChild(layer.parent);
            this._ballFxLayers.returnItem(layer);
        };
        BallManager.prototype.createBallFxLayer = function () {
            return new Phaser.Group(Game.Global.game);
        };
        return BallManager;
    }());
    Playfield.BallManager = BallManager;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var FireBallBar = (function () {
        function FireBallBar() {
            this._iconTweens = [];
            this._fillFxTweens = [];
            this._multiplierActTweens = [];
            this._multiplierHideTweens = [];
            FireBallBar._instance = this;
            var game = Game.Global.game;
            this._onFireBallStart = new Phaser.Signal();
            this._onFireBallEnd = new Phaser.Signal();
            this._layer = game.add.group();
            this._layer.fixedToCamera = true;
            this._layer.cameraOffset.set(FireBallBar.X, FireBallBar.Y);
            game.add.image(139, 55, Game.Global.ATLAS_0, "fireBallBarBck", this._layer);
            this._fillFx = game.add.image(FireBallBar.FILL_OFFSET_X, FireBallBar.FILL_OFFSET_Y, Game.Global.ATLAS_0, "fireBallBarFillFx", this._layer);
            this._fillFx.position.y += this._fillFx.height / 2;
            this._fillFx.anchor.set(0, 0.5);
            this._fillFx.crop(new Phaser.Rectangle(0, 0, 0, this._fillFx.height), false);
            this._fill = game.add.image(FireBallBar.FILL_OFFSET_X, FireBallBar.FILL_OFFSET_Y, Game.Global.ATLAS_0, "fireBallBarFill", this._layer);
            this._fillFullW = this._fill.width;
            this._fill.crop(new Phaser.Rectangle(0, 0, 0, this._fill.height), false);
            this._icon = game.add.image(104, 65, Game.Global.ATLAS_0, "fireBallBarIco", this._layer);
            this._icon.anchor.set(104 / this._icon.width, 65 / this._icon.height);
            var multiplier = this.multiplier;
            this._multiplierLayer = game.add.group(this._layer);
            this._multiplierLayer.position.set(FireBallBar.MULTIPLIER_OFFSET_X, FireBallBar.MULTIPLIER_OFFSET_Y);
            this._multiplierLayer.visible = false;
            this._multiplierIconFx = game.add.image(0, 0, Game.Global.ATLAS_0, "fireBallBarMultiplierFx" + multiplier, this._multiplierLayer);
            this._multiplierIconFx.anchor.set(0.5);
            this._multiplierIcon = game.add.image(0, 0, Game.Global.ATLAS_0, "fireBallBarMultiplier" + multiplier, this._multiplierLayer);
            this._multiplierIcon.anchor.set(0.5);
        }
        Object.defineProperty(FireBallBar, "instance", {
            get: function () { return FireBallBar._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FireBallBar.prototype, "multiplier", {
            get: function () {
                return Game.Global.selectedBall.id != 14 ? 2 : 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FireBallBar.prototype, "fireBallActive", {
            get: function () { return this._fireBallActive; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FireBallBar.prototype, "onFireBallStart", {
            get: function () { return this._onFireBallStart; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FireBallBar.prototype, "onFireBallEnd", {
            get: function () { return this._onFireBallEnd; },
            enumerable: true,
            configurable: true
        });
        FireBallBar.prototype.reset = function () {
            this._fillFxTweens[0] = Game.Global.game.add.tween(this._fillFx.scale).to({ y: 3 }, 750, Phaser.Easing.Cubic.Out, false);
            this._fillFxTweens[1] = Game.Global.game.add.tween(this._fillFx).to({ alpha: 0 }, 750, Phaser.Easing.Cubic.In, false);
            this._fillFxTweens[1].onComplete.add(function () {
                this._fillFx.visible = false;
            }, this);
            this._iconTweens[0] = Game.Global.game.add.tween(this._icon.scale).to({ x: 1, y: 1 }, 750, Phaser.Easing.Elastic.Out, false);
            this._multiplierHideTweens[0] = Game.Global.game.add.tween(this._multiplierLayer).to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, false);
            this._multiplierHideTweens[1] = Game.Global.game.add.tween(this._multiplierLayer.scale).to({ x: 2, y: 2 }, 1000, Phaser.Easing.Cubic.Out, false);
            this._multiplierHideTweens[1].onComplete.add(function () {
                this.hideMultiplierLayer();
            }, this);
            this.clear(false);
        };
        FireBallBar.prototype.clear = function (hideMultiplierIconSmoothly) {
            if (hideMultiplierIconSmoothly === void 0) { hideMultiplierIconSmoothly = true; }
            this._value = 0;
            this.updateFillCrop();
            this._fillFx.visible = false;
            this._fireBallActive = false;
            if (this._multiplierLayer.visible) {
                if (hideMultiplierIconSmoothly) {
                    var i = this._multiplierHideTweens.length;
                    while (i-- != 0)
                        this._multiplierHideTweens[i].start();
                    this._onFireBallEnd.dispatch();
                }
                else {
                    this.hideMultiplierLayer();
                }
            }
        };
        FireBallBar.prototype.hideMultiplierLayer = function () {
            var i = this._multiplierActTweens.length;
            while (i-- != 0) {
                if (this._multiplierActTweens[i] != null) {
                    this._multiplierActTweens[i].stop(false);
                    this._multiplierActTweens[i] = null;
                }
            }
            this._multiplierLayer.visible = false;
        };
        FireBallBar.prototype.update = function (playfieldState) {
            if (playfieldState == Playfield.ePlayfieldState.game && !this._fireBallActive && Playfield.HUD.instance.time != 0 && this._value != 0) {
                this._value -= (this._fireBallActive ? FireBallBar.VALUE_FIREBALL_DEC_STEP : FireBallBar.VALUE_DEC_STEP) * Game.Global.deltaRatio;
                if (this._value <= 0) {
                    this.clear();
                }
                this.updateFillCrop();
            }
        };
        FireBallBar.prototype.incValue = function (inc) {
            if (!this._fireBallActive) {
                if ((this._value += inc) >= 1) {
                    this._value = 1;
                    this._multiplierLayer.alpha = 1;
                    this._multiplierLayer.scale.set(1);
                    this._multiplierLayer.visible = true;
                    this._multiplierLayer.angle = -5;
                    this._multiplierIconFx.scale.set(1);
                    this._multiplierIconFx.alpha = 0.4;
                    this._multiplierActTweens[0] = Game.Global.game.add.tween(this._multiplierLayer).to({ angle: "+10" }, 400, Phaser.Easing.Linear.None, true, 0, -1, true);
                    this._multiplierActTweens[1] = Game.Global.game.add.tween(this._multiplierIconFx.scale).to({ x: 1.3, y: 1.3 }, 400, Phaser.Easing.Cubic.Out, true, 0, -1);
                    this._multiplierActTweens[2] = Game.Global.game.add.tween(this._multiplierIconFx).to({ alpha: 0 }, 400, Phaser.Easing.Cubic.In, true, 0, -1);
                    this._fireBallActive = true;
                    this._onFireBallStart.dispatch();
                }
                this.updateFillCrop();
                this._fillFx.cropRect.width = this._fill.cropRect.width;
                this._fillFx.updateCrop();
                this._fillFx.alpha = 0.5;
                this._fillFx.scale.set(1, 1);
                this._fillFx.visible = true;
                var fxId = this._fillFxTweens.length;
                while (fxId-- != 0) {
                    this._fillFxTweens[fxId].start();
                }
                this._icon.scale.set(1.2);
                fxId = this._iconTweens.length;
                while (fxId-- != 0)
                    this._iconTweens[fxId].start();
            }
        };
        FireBallBar.prototype.updateFillCrop = function () {
            this._fill.cropRect.width = Math.floor(this._value * this._fillFullW);
            this._fill.updateCrop();
        };
        FireBallBar.TIME_BONUS = 5;
        FireBallBar.X = 30;
        FireBallBar.Y = 70;
        FireBallBar.FILL_OFFSET_X = 139;
        FireBallBar.FILL_OFFSET_Y = 60;
        FireBallBar.MULTIPLIER_OFFSET_X = 520;
        FireBallBar.MULTIPLIER_OFFSET_Y = 66;
        FireBallBar.VALUE_DEC_STEP = 0.0004;
        FireBallBar.VALUE_FIREBALL_DEC_STEP = 0.0015;
        return FireBallBar;
    }());
    Playfield.FireBallBar = FireBallBar;
})(Playfield || (Playfield = {}));
var Results;
(function (Results) {
    var ShineFx = (function () {
        function ShineFx(numOfBeams, x, y, parent) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var dirStep = 360 / numOfBeams;
            var dir = Game.Global.elapsedTime % 360;
            this._layer = Game.Global.game.add.group(parent);
            this._layer.position.set(x, y);
            this._beams = [];
            for (var i = 0; i < numOfBeams; i++) {
                var beam = Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "shine", this._layer);
                beam.anchor.set(0.5, 1);
                beam.angle = dir;
                this._beams.push(beam);
                dir += dirStep;
            }
        }
        Object.defineProperty(ShineFx.prototype, "layer", {
            get: function () {
                return this._layer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShineFx.prototype, "x", {
            get: function () { return this._layer.x; },
            set: function (x) { this._layer.x = x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShineFx.prototype, "y", {
            get: function () { return this._layer.y; },
            set: function (y) { this._layer.y = y; },
            enumerable: true,
            configurable: true
        });
        ShineFx.prototype.update = function () {
            var i = this._beams.length;
            var dir = (Game.Global.elapsedTime / 16) % 360;
            var dirStep = 360 / i;
            while (i-- != 0) {
                this._beams[i].angle = dir;
                dir += dirStep;
            }
        };
        ShineFx.prototype.setPosition = function (x, y) {
            this._layer.position.set(x, y);
        };
        return ShineFx;
    }());
    Results.ShineFx = ShineFx;
})(Results || (Results = {}));
var Game;
(function (Game) {
    var TextPopupMessage = (function (_super) {
        __extends(TextPopupMessage, _super);
        function TextPopupMessage(fontKey, fontSize) {
            var _this = _super.call(this) || this;
            _this._msgContainer = new Phaser.BitmapText(Game.Global.game, 0, 0, fontKey, "", fontSize);
            _this._msgContainer.anchor.set(0.5);
            return _this;
        }
        TextPopupMessage.prototype.getMsgContainer = function () {
            return this._msgContainer;
        };
        TextPopupMessage.prototype.show = function (x, y, text, type, parent) {
            this._msgContainer.text = text;
            if (parent == undefined)
                parent = Game.Global.game.world;
            parent.addChild(this._msgContainer);
            parent.bringToTop(this._msgContainer);
            _super.prototype.showMessage.call(this, x, y, type, Game.Global.elapsedTime);
        };
        TextPopupMessage.prototype.update = function () {
            return _super.prototype.update.call(this, Game.Global.elapsedTime);
        };
        TextPopupMessage.prototype.kill = function () {
            _super.prototype.kill.call(this);
            this._msgContainer.parent.removeChild(this._msgContainer);
        };
        return TextPopupMessage;
    }(PopupMessage.MessageBase));
    Game.TextPopupMessage = TextPopupMessage;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var ScrollBar = (function (_super) {
        __extends(ScrollBar, _super);
        function ScrollBar(x, y, vertical, parent) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (vertical === void 0) { vertical = true; }
            var _this = this;
            var container = Game.Global.game.add.group(parent);
            container.position.set(x, y);
            _this = _super.call(this, container, 10, vertical) || this;
            _this._bg = Game.Global.game.add.graphics(0, 0, container);
            _this._thumb = Game.Global.game.add.graphics(0, 0, container);
            return _this;
        }
        ScrollBar.prototype.updateThumbSize = function () {
            if (this.validSettings())
                this.createThumb();
        };
        ScrollBar.prototype.updateThumbPos = function () {
            if (this.validSettings()) {
                if (this._vertical)
                    this._thumb.y = this.getThumbPosInPixels();
                else
                    this._thumb.x = this.getThumbPosInPixels();
            }
        };
        ScrollBar.prototype.updateWidth = function (width) {
            if (width > 0 && this._height > 0) {
                this.createBg();
                if (this._thumbSize > 0) {
                    this.createThumb();
                }
            }
        };
        ScrollBar.prototype.updateHeight = function (height) {
            if (height > 0 && this._width > 0) {
                this.createBg();
                if (this._thumbSize > 0)
                    this.createThumb();
            }
        };
        ScrollBar.prototype.createBg = function () {
            var bg = this._bg;
            bg.clear();
            bg.beginFill(0x010D2A, 1);
            bg.drawRoundedRect(0, 0, this._width, this._height, 4);
            bg.endFill();
        };
        ScrollBar.prototype.createThumb = function () {
            var thumb = this._thumb;
            var width = this._width;
            var height = this._height;
            if (this._vertical) {
                height = Math.round(height * this._thumbSize);
            }
            else {
                width = Math.round(width * this._thumbSize);
            }
            thumb.clear();
            thumb.beginFill(0xFFFFFF, 1);
            thumb.drawRoundedRect(0, 0, width, height, 4);
            thumb.endFill();
            this.updateThumbPos();
        };
        return ScrollBar;
    }(Controls.ScrollBarBase));
    Game.ScrollBar = ScrollBar;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var SaveState = (function () {
        function SaveState() {
        }
        SaveState.prototype.reset = function () {
            this.version = 2;
            this.trainingCompleted = false;
            this.giftOpenTime = 0;
            this.coins = 0;
            this.totalScore = 0;
            this.totalGames = 0;
            this.courtBestScore = [0, 0, 0];
            this.courtLocked = [false, false, true];
            this.courtGames = [0, 0, 0];
            this.courtWins = [0, 0, 0];
            this.courtWinsInARow = [0, 0, 0];
            this.selectedCourtId = 0;
            this.ballLockMask = 0xFFFFFE;
            this.newBallNoticeMask = 0;
            this.selectedBallId = 0;
        };
        return SaveState;
    }());
    var SaveData = (function () {
        function SaveData() {
            this._data = new SaveState();
            this.reset();
        }
        Object.defineProperty(SaveData.prototype, "saveRequested", {
            get: function () { return this._saveReq; },
            enumerable: true,
            configurable: true
        });
        SaveData.prototype.update = function (data) {
            if (data.version == undefined) {
                this.reset();
            }
            this._data.trainingCompleted = data.trainingCompleted;
            this._data.giftOpenTime = data.giftOpenTime;
            this._data.coins = data.coins;
            this._data.totalScore = data.totalScore;
            this._data.totalGames = data.totalGames;
            this._data.courtBestScore = data.courtBestScore;
            this._data.courtLocked = data.courtLocked;
            this._data.courtWins = data.courtWins;
            this._data.courtWinsInARow = data.courtWinsInARow;
            this._data.courtGames = data.courtGames;
            this._data.selectedCourtId = data.selectedCourtId;
            if (data.version == 1) {
                var dataV1 = data;
                var i = dataV1.ballLocked.length;
                var mask = 0;
                while (i-- != 0)
                    if (dataV1.ballLocked[i])
                        mask |= (1 << i);
                this._data.ballLockMask = mask;
            }
            else {
                this._data.ballLockMask = data.ballLockMask;
            }
            this._data.selectedBallId = data.selectedBallId;
            if (data.version < 2) {
                this._data.newBallNoticeMask = 0;
            }
            else {
                this._data.newBallNoticeMask = data.newBallNoticeMask;
            }
        };
        SaveData.prototype.resetSaveRequest = function () {
            this._saveReq = false;
        };
        SaveData.prototype.save = function () {
            if (this._saveReq) {
                this._saveReq = false;
                Gamee2.Gamee.gameSave(this.toString());
            }
        };
        SaveData.prototype.toString = function () {
            return JSON.stringify(this._data);
        };
        SaveData.prototype.reset = function () {
            this._data.reset();
        };
        Object.defineProperty(SaveData.prototype, "trainingCompleted", {
            get: function () { return this._data.trainingCompleted; },
            set: function (value) {
                if (this._data.trainingCompleted != value) {
                    this._data.trainingCompleted = value;
                    this._saveReq = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SaveData.prototype, "giftOpenTime", {
            get: function () { return this._data.giftOpenTime; },
            set: function (time) {
                if (this._data.giftOpenTime != time) {
                    this._data.giftOpenTime = time;
                    this._saveReq = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SaveData.prototype, "coins", {
            get: function () { return this._data.coins; },
            set: function (coins) {
                if (this._data.coins != coins) {
                    this._data.coins = coins;
                    this._saveReq = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SaveData.prototype, "totalScore", {
            get: function () { return this._data.totalScore; },
            set: function (score) {
                if (this._data.totalScore != score) {
                    this._data.totalScore = score;
                    this._saveReq = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SaveData.prototype, "totalGames", {
            get: function () { return this._data.totalGames; },
            set: function (value) {
                if (this._data.totalGames != value) {
                    this._data.totalGames = value;
                    this._saveReq = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        SaveData.prototype.getCourtBestScore = function (courtId) {
            return this._data.courtBestScore[courtId];
        };
        SaveData.prototype.setCourtBestScore = function (courtId, score) {
            if (this._data.courtBestScore[courtId] != score) {
                this._data.courtBestScore[courtId] = score;
                this._saveReq = true;
            }
        };
        SaveData.prototype.isCourtLocked = function (courtId) {
            return this._data.courtLocked[courtId];
        };
        SaveData.prototype.unlockCourt = function (courtId) {
            if (this._data.courtLocked[courtId]) {
                this._data.courtLocked[courtId] = false;
                this._saveReq = true;
            }
        };
        SaveData.prototype.getCourtTotalGames = function (courtId) { return this._data.courtGames[courtId]; };
        SaveData.prototype.incCourtTotalGames = function (courtId) {
            this._data.courtGames[courtId]++;
            this._saveReq = true;
        };
        SaveData.prototype.getCourtTotalWins = function (courtId) { return this._data.courtWins[courtId]; };
        SaveData.prototype.getCourtWinsInRow = function (courtId) { return this._data.courtWinsInARow[courtId]; };
        SaveData.prototype.resetCourtWinsInRow = function (courtId) {
            if (this._data.courtWinsInARow[courtId] != 0) {
                this._data.courtWinsInARow[courtId] = 0;
                this._saveReq = true;
            }
        };
        SaveData.prototype.incCourtTotalWins = function (courtId) {
            this._data.courtWins[courtId]++;
            this._data.courtWinsInARow[courtId]++;
            this._saveReq = true;
        };
        Object.defineProperty(SaveData.prototype, "selectedCourtId", {
            get: function () { return this._data.selectedCourtId; },
            set: function (id) {
                if (this._data.selectedCourtId != id) {
                    this._data.selectedCourtId = id;
                    this._saveReq = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SaveData.prototype, "selectedBallId", {
            get: function () { return this._data.selectedBallId; },
            set: function (id) {
                if (this._data.selectedBallId != id) {
                    this._data.selectedBallId = id;
                    this._saveReq = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        SaveData.prototype.isBallLocked = function (id) {
            return (this._data.ballLockMask & (1 << id)) != 0;
        };
        SaveData.prototype.unlockBall = function (id) {
            if (this.isBallLocked(id)) {
                this._data.ballLockMask &= ~(1 << id);
                this._saveReq = true;
            }
        };
        SaveData.prototype.hasBallNotice = function (id) {
            return (this._data.newBallNoticeMask & (1 << id)) != 0;
        };
        SaveData.prototype.setBallNotice = function (id) {
            if ((this._data.newBallNoticeMask & (1 << id)) == 0) {
                this._data.newBallNoticeMask |= (1 << id);
                this._saveReq = true;
            }
        };
        SaveData.prototype.clearBallsNotice = function () {
            if (this._data.newBallNoticeMask != 0) {
                this._data.newBallNoticeMask = 0;
                this._saveReq = true;
            }
        };
        Object.defineProperty(SaveData.prototype, "newBalls", {
            get: function () {
                return this._data.newBallNoticeMask != 0;
            },
            enumerable: true,
            configurable: true
        });
        return SaveData;
    }());
    Game.SaveData = SaveData;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var TextButton = (function (_super) {
        __extends(TextButton, _super);
        function TextButton(x, y, fontKey, fontSize, text, parent) {
            if (text === void 0) { text = ""; }
            var _this = this;
            var container = Game.Global.game.add.image(x, y, Game.Global.ATLAS_0, TextButton.NORMAL_FRAME_NAME, parent);
            container.anchor.set(0.5);
            _this = _super.call(this, container) || this;
            _this._caption = new Phaser.BitmapText(Game.Global.game, 0, 0, fontKey, text, fontSize);
            _this._caption.anchor.set(0.5, 0.4);
            container.addChild(_this._caption);
            return _this;
        }
        Object.defineProperty(TextButton.prototype, "text", {
            get: function () {
                return this._caption.text;
            },
            set: function (text) {
                this._caption.text = text;
            },
            enumerable: true,
            configurable: true
        });
        TextButton.prototype.enabledClb = function () {
            this._container.frameName = TextButton.NORMAL_FRAME_NAME;
        };
        TextButton.prototype.disabledClb = function () {
            this._container.frameName = TextButton.DISABLED_FRAME_NAME;
        };
        TextButton.prototype.pressedClb = function () {
            this._container.scale.set(0.9);
        };
        TextButton.prototype.releasedClb = function (clicked) {
            this._container.scale.set(1);
        };
        TextButton.NORMAL_FRAME_NAME = "buttonLgGreen";
        TextButton.DISABLED_FRAME_NAME = "buttonLgDisabled";
        return TextButton;
    }(Controls.ButtonBase));
    Game.TextButton = TextButton;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gift = (function () {
        function Gift() {
        }
        Object.defineProperty(Gift.prototype, "openDate", {
            get: function () {
                if (this._openDate == undefined) {
                    if (Game.Global.saveData.giftOpenTime == 0) {
                        this._openDate = new Date(Date.now());
                    }
                    else {
                        this._openDate = new Date(Game.Global.saveData.giftOpenTime);
                    }
                }
                return this._openDate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gift.prototype, "locked", {
            get: function () {
                return this.timeToUnlock >= 1000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gift.prototype, "timeToUnlock", {
            get: function () {
                var time = this.openDate.valueOf() - Date.now();
                return Math.max(0, time);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gift.prototype, "value", {
            get: function () {
                return 25;
            },
            enumerable: true,
            configurable: true
        });
        Gift.prototype.collect = function () {
            Game.Global.coins += this.value;
            this._openDate = new Date(Date.now() + (1000 * 60 * 60 * 24));
            Game.Global.saveData.giftOpenTime = this._openDate.valueOf();
            Game.Global.saveData.save();
        };
        return Gift;
    }());
    Game.Gift = Gift;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var BallData = (function () {
        function BallData(id, name, description, price) {
            if (price === void 0) { price = 0; }
            this._iconKey = null;
            this._id = id;
            this._name = name;
            this._description = description;
            this._price = price;
            this._scoreBonus = 0;
            this._timeBonus = 0;
            this._powerUpLifeSpan = 1;
        }
        Object.defineProperty(BallData.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "name", {
            get: function () { return this._name; },
            set: function (name) { this._name = name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "iconKey", {
            get: function () {
                if (this._iconKey != null)
                    return this._iconKey;
                return this.imageKey;
            },
            set: function (key) {
                this._iconKey = key;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "imageKey", {
            get: function () { return "ball_" + this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "description", {
            get: function () { return this._description; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "price", {
            get: function () { return this._price; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "locked", {
            get: function () { return Game.Global.saveData.isBallLocked(this._id); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "justUnlocked", {
            get: function () {
                return Game.Global.saveData.hasBallNotice(this._id);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "selected", {
            get: function () { return Game.Global.saveData.selectedBallId == this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "scoreBonus", {
            get: function () { return this._scoreBonus; },
            set: function (ratio) { this._scoreBonus = ratio; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "timeBonus", {
            get: function () { return this._timeBonus; },
            set: function (seconds) { this._timeBonus = seconds; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BallData.prototype, "powerUpLifeSpan", {
            get: function () { return this._powerUpLifeSpan; },
            set: function (ratio) { this._powerUpLifeSpan = ratio; },
            enumerable: true,
            configurable: true
        });
        BallData.prototype.unlock = function () {
            if (!this.locked)
                return;
            Game.Global.saveData.unlockBall(this._id);
            if (this._price == 0) {
                Game.Global.saveData.setBallNotice(this._id);
            }
            else {
                Game.Global.coins -= this._price;
            }
        };
        return BallData;
    }());
    Game.BallData = BallData;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var CourtData = (function () {
        function CourtData(id, title, prize, aiSuccessRate, aiShotInterval, description, lockedMessage) {
            this._id = id;
            this._title = title;
            this._prize = prize;
            this._aiSuccessRate = aiSuccessRate;
            this._aiShotInterval = aiShotInterval;
            this._description = description;
            this._lockedMsg = lockedMessage;
        }
        Object.defineProperty(CourtData.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "title", {
            get: function () { return this._title; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "iconKey", {
            get: function () { return "courtIcon_" + this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "locked", {
            get: function () { return Game.Global.saveData.isCourtLocked(this._id); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "highScore", {
            get: function () { return Game.Global.saveData.getCourtBestScore(this._id); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "prize", {
            get: function () { return this._prize; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "newBestScorePrize", {
            get: function () { return this._id == 0 ? 0 : 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "games", {
            get: function () { return Game.Global.saveData.getCourtTotalGames(this._id); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "wins", {
            get: function () { return Game.Global.saveData.getCourtTotalWins(this._id); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "winsInRow", {
            get: function () { return Game.Global.saveData.getCourtWinsInRow(this._id); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "description", {
            get: function () { return this._description; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "lockedMessage", {
            get: function () { return this._lockedMsg; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "aiSuccessRate", {
            get: function () { return this._aiSuccessRate; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CourtData.prototype, "aiShotInterval", {
            get: function () { return this._aiShotInterval; },
            enumerable: true,
            configurable: true
        });
        CourtData.prototype.setGameResult = function (score, aiScore) {
            var save = Game.Global.saveData;
            var coins = 0;
            if (this.highScore < score) {
                save.setCourtBestScore(this._id, score);
                coins += this.newBestScorePrize;
            }
            save.incCourtTotalGames(this._id);
            if (this.id != 0)
                save.totalGames++;
            if (score > aiScore) {
                save.incCourtTotalWins(this._id);
                coins += this._prize;
            }
            else {
                save.resetCourtWinsInRow(this._id);
                if (score == aiScore)
                    coins += (this.id != 0 ? Math.round(this._prize / 2) : this._prize);
            }
            save.coins += coins;
            return coins;
        };
        CourtData.prototype.unlock = function () {
            Game.Global.saveData.unlockCourt(this._id);
        };
        return CourtData;
    }());
    Game.CourtData = CourtData;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var eImageButtonFrame;
    (function (eImageButtonFrame) {
        eImageButtonFrame[eImageButtonFrame["idle"] = 0] = "idle";
        eImageButtonFrame[eImageButtonFrame["disabled"] = 1] = "disabled";
    })(eImageButtonFrame = Game.eImageButtonFrame || (Game.eImageButtonFrame = {}));
    var ImageButton = (function (_super) {
        __extends(ImageButton, _super);
        function ImageButton(x, y, atlasKey, frames, parent) {
            var _this = this;
            var container = Game.Global.game.add.image(x, y, atlasKey, frames[eImageButtonFrame.idle], parent);
            container.anchor.set(0.5);
            _this = _super.call(this, container) || this;
            _this._frames = frames;
            return _this;
        }
        ImageButton.prototype.enabledClb = function () {
            this._container.frameName = this._frames[eImageButtonFrame.idle];
        };
        ImageButton.prototype.disabledClb = function () {
            var frame = this._frames[eImageButtonFrame.disabled];
            if (frame == undefined || frame == null || frame.length == 0)
                frame = this._frames[eImageButtonFrame.idle];
            this._container.frameName = frame;
        };
        ImageButton.prototype.pressedClb = function () {
            this._container.scale.set(0.9);
        };
        ImageButton.prototype.releasedClb = function (clicked) {
            this._container.scale.set(1);
        };
        return ImageButton;
    }(Controls.ButtonBase));
    Game.ImageButton = ImageButton;
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
            this.input.maxPointers = 1;
            this.game.renderer.renderSession.roundPixels = false;
            this.stage.disableVisibilityChange = false;
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
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Play, "instance", {
            get: function () { return Play._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "onResize", {
            get: function () { return this._onResize; },
            enumerable: true,
            configurable: true
        });
        Play.prototype.init = function () {
            Play._instance = this;
            if (Game.Global.saveData.trainingCompleted && Game.Global.selectedCourt.id == 0)
                Game.Global.selectedCourt = Game.Global.courts[1];
            this._results = new Game.GameResults();
            this._onResize = new Phaser.Signal();
            this.physics.startSystem(Phaser.Physics.P2JS);
            this.physics.p2.gravity.y = 4000;
            this.physics.p2.emitImpactEvent = false;
            this.physics.p2.useElapsedTime = true;
        };
        Play.prototype.create = function () {
            this._playfield = new Playfield.Playfield();
            this._bgShadow = this.game.add.graphics(0, 0);
            this._bgShadow.kill();
            this._resultsPanel = new Game.ResultsPanel();
            if (Game.Global.selectedCourt.id == 0 && !Game.Global.saveData.trainingCompleted) {
                this._wndTrainingCompleted = new Windows.TrainingCompleted();
                this._wndTrainingCompleted.onClose.add(function () {
                    this.game.state.start("CourtSelection");
                }, this);
            }
            if (Game.Global.saveData.totalGames == 14) {
                this._wndBiniBallUnlocked = new Windows.BiniBallUnlocked();
                this._wndBiniBallUnlocked.onClose.add(function () {
                    this.endGame();
                }, this);
            }
            this.reset();
            this.resized(this.game.width, this.game.height, this.game.width, this.game.height);
            if (Game.Global.GAMEE && Gamee2.Gamee.initialized && !Gamee2.Gamee.ready) {
                this.game.paused = true;
                Gamee2.Gamee.gameReady();
            }
            else {
                this.playAmbientSfx();
            }
        };
        Play.prototype.shutdown = function () {
            Utils.AudioUtils.stopMusic();
        };
        Play.prototype.update = function () {
            Game.Global.elapsedTime = this.time.elapsedSince(Game.Global.timeBase);
            Game.Global.deltaRatio = this.time.elapsedMS / (1000 / 60);
            this._playfield.update();
        };
        Play.prototype.gameOver = function (playerScore, aiScore) {
            var court = Game.Global.selectedCourt;
            var training = !Game.Global.saveData.trainingCompleted;
            this._results.playerBonusScore = Math.round(playerScore * Game.Global.selectedBall.scoreBonus);
            if (this._results.playerBonusScore != 0) {
                playerScore += this._results.playerBonusScore;
                Playfield.HUD.instance.score = playerScore;
            }
            this._results.playerScore = playerScore;
            this._results.aiScore = aiScore;
            this._results.newBestScore = court.highScore < playerScore;
            this._results.coins = court.setGameResult(playerScore, aiScore);
            var balls = Game.Global.balls;
            if (balls[4].locked && Game.Global.saveData.totalScore >= 1000)
                balls[4].unlock();
            if (court.id == 0) {
                if (training) {
                    Game.Global.saveData.trainingCompleted = true;
                }
            }
            else if (court.id == 1) {
                if (Game.Global.courts[2].locked && playerScore > 45)
                    Game.Global.courts[2].unlock();
                if (balls[1].locked && court.wins >= 10)
                    balls[1].unlock();
                if (balls[2].locked && court.winsInRow >= 3)
                    balls[2].unlock();
                if (balls[3].locked && court.games >= 50)
                    balls[3].unlock();
                if (balls[5].locked && playerScore >= 35)
                    balls[5].unlock();
            }
            else {
                if (balls[6].locked && court.wins >= 10)
                    balls[6].unlock();
                if (balls[7].locked && court.winsInRow >= 3)
                    balls[7].unlock();
            }
            if (Game.Global.saveData.totalGames == 15)
                Game.Global.unlockMysteryBall();
            Utils.AudioUtils.playSound("applause");
            this._bgShadow.revive();
            if (court.id == 0 && training) {
                Game.Global.saveData.save();
                this._wndTrainingCompleted.show();
            }
            else {
                this._resultsPanel.show(this._results);
            }
        };
        Play.prototype.showBiniBallUnlockMsg = function () {
            this._resultsPanel.hide();
            this._wndBiniBallUnlocked.show();
        };
        Play.prototype.endGame = function () {
            if (Game.Global.GAMEE && Gamee2.Gamee.initialized) {
                Utils.AudioUtils.stopMusic();
                var saveData = void 0;
                if (Game.Global.saveData.saveRequested) {
                    saveData = Game.Global.saveData.toString();
                    Game.Global.saveData.resetSaveRequest();
                }
                Gamee2.Gamee.gameOver(undefined, saveData);
            }
            else {
                Game.Global.game.state.start("CourtSelection");
            }
        };
        Play.prototype.resumed = function () {
            Game.Global.timeBase += this.time.pauseDuration;
        };
        Play.prototype.resized = function (newGameW, newGameH, oldGameW, oldGameH) {
            this._onResize.dispatch(newGameW, newGameH);
            if (this._wndBiniBallUnlocked != undefined)
                this._wndBiniBallUnlocked.updatePosition();
            if (this._wndTrainingCompleted != undefined)
                this._wndTrainingCompleted.updatePosition();
            this.updateBgShadow();
        };
        Play.prototype.onGameeStart = function () {
            if (Game.Global.elapsedTime != 0)
                this.reset();
            this.playAmbientSfx();
        };
        Play.prototype.reset = function () {
            Game.Global.timeBase = this.time.elapsedSince(0);
            Game.Global.elapsedTime = 0;
            this.tweens.removeAll();
            this.time.events.removeAll();
            this._playfield.reset();
            this._bgShadow.kill();
            this._resultsPanel.hide();
        };
        Play.prototype.playAmbientSfx = function () {
            if (this.game.device.webAudio) {
                if (!this.sound.touchLocked) {
                    Utils.AudioUtils.playMusic("ambient", true);
                }
                else {
                    Game.Global.setAudioUnlockCallback(function () {
                        Utils.AudioUtils.playMusic("ambient", true);
                    }, this);
                }
            }
        };
        Play.prototype.updateBgShadow = function () {
            this._bgShadow.clear();
            this._bgShadow.beginFill(0, 0.25);
            this._bgShadow.drawRect(this.camera.x, this.camera.y, this.camera.width, this.camera.height);
            this._bgShadow.endFill();
        };
        return Play;
    }(Phaser.State));
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
            var _this = this;
            this.load.baseURL = "assets/";
            this.load.atlasJSONArray(Game.Global.ATLAS_0);
            this.load.atlasJSONArray(Game.Global.ATLAS_1);
            this.load.bitmapFont(Game.Global.FONT_0);
            this.load.bitmapFont(Game.Global.FONT_1);
            if (!this.game.device.webAudio) {
                for (var property in Game.Sounds.AUDIO_JSON.spritemap) {
                    this.load.audio(property, property + ".mp3");
                }
            }
            else {
                this.load.audiosprite("sfx", Game.Sounds.AUDIO_JSON.resources, null, Game.Sounds.AUDIO_JSON);
                this.load.audio("ambient", ["ambient.ogg", "ambient.mp3"]);
            }
            Game.Global.saveData = new Game.SaveData();
            if (Game.Global.GAMEE) {
                Gamee2.Gamee.onInitialized.add(function (initState, initData) {
                    if (initData.saveState) {
                        Game.Global.saveData.update(JSON.parse(initData.saveState));
                        var biniBall = Game.Global.balls[1];
                        if (!biniBall.locked) {
                            biniBall.name = "Bini Ball";
                            biniBall.iconKey = null;
                        }
                        else if (Game.Global.saveData.totalGames >= 15) {
                            Game.Global.unlockMysteryBall();
                        }
                    }
                    if (!initData.sound) {
                        Utils.AudioUtils.sfxOn = false;
                        Utils.AudioUtils.musicOn = false;
                    }
                    _this._gameeInitialized = true;
                }, this);
                if (Gamee2.Gamee.initialize("FullScreen", ["saveState"])) {
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
                Utils.AudioUtils.addMusic("ambient", this.add.audio("ambient"));
            }
        };
        Preload.prototype.update = function () {
            if (this._gameeInitialized != undefined && !this._gameeInitialized) {
                return;
            }
            if (this._ready == false) {
                this._ready = true;
                Playfield.AI.initShots();
                this.startGame();
            }
        };
        Preload.prototype.startGame = function () {
            this.game.state.start("Play");
        };
        return Preload;
    }(Phaser.State));
    Game.Preload = Preload;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var BallSelectionState = (function (_super) {
        __extends(BallSelectionState, _super);
        function BallSelectionState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BallSelectionState.prototype.create = function () {
            this.stage.backgroundColor = 0x02163C;
            this._ballSelBox = new Controls.ListBox(Game.Global.game, BallSelectionState.BALL_SEL_X, BallSelectionState.BALL_SEL_Y, BallSelectionState.BALL_SEL_WIDTH, this.camera.height - BallSelectionState.BALL_SEL_Y - BallSelectionState.BALL_SEL_BOT_OFFSET, BallSelectionState.BALL_SEL_CARD_H, BallSelectionState.BALL_SEL_CARD_PADDING, BallSelection.BallLsbItem);
            this._ballSelBox.connectScrollBar(new Game.ScrollBar(), 10);
            this._ballSelBox.content = Game.Global.balls;
            Game.Global.game.add.image(BallSelectionState.COINS_X, BallSelectionState.COINS_Y, Game.Global.ATLAS_0, "coinIcon");
            this._coins = Game.Global.game.add.bitmapText(BallSelectionState.COINS_X + 56, BallSelectionState.COINS_Y + 7, Game.Global.FONT_0, Game.Global.coins.toString(), 44);
            Game.Global.onCoinsChange.add(this.coinsChangeClb, this);
            var closeBtn = new Game.ImageButton(BallSelectionState.CLOSE_BTN_X, BallSelectionState.CLOSE_BTN_Y, Game.Global.ATLAS_0, ["buttonClose"]);
            closeBtn.onClick.add(this.closeButtonClickClb, this);
        };
        BallSelectionState.prototype.update = function () {
            this._ballSelBox.update();
        };
        BallSelectionState.prototype.shutdown = function () {
            this._ballSelBox.destroy();
            Game.Global.onCoinsChange.removeAll();
            Game.Global.onSelectedBallChange.removeAll();
            Game.Global.saveData.clearBallsNotice();
            Game.Global.saveData.save();
        };
        BallSelectionState.prototype.resized = function (newGameW, newGameH) {
            this._ballSelBox.height = newGameH - BallSelectionState.BALL_SEL_Y - BallSelectionState.BALL_SEL_BOT_OFFSET;
        };
        BallSelectionState.prototype.coinsChangeClb = function (coins) {
            this._coins.text = coins.toString();
        };
        BallSelectionState.prototype.closeButtonClickClb = function () {
            Game.Global.saveData.save();
            Utils.AudioUtils.playSound("click");
            this.game.state.start("CourtSelection");
        };
        BallSelectionState.BALL_SEL_X = 30;
        BallSelectionState.BALL_SEL_Y = 120;
        BallSelectionState.BALL_SEL_BOT_OFFSET = 20;
        BallSelectionState.BALL_SEL_WIDTH = 580;
        BallSelectionState.BALL_SEL_CARD_H = 290;
        BallSelectionState.BALL_SEL_CARD_PADDING = 10;
        BallSelectionState.COINS_X = 30;
        BallSelectionState.COINS_Y = 20;
        BallSelectionState.CLOSE_BTN_X = 574;
        BallSelectionState.CLOSE_BTN_Y = 56;
        return BallSelectionState;
    }(Phaser.State));
    Game.BallSelectionState = BallSelectionState;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var CourtSelectionState = (function (_super) {
        __extends(CourtSelectionState, _super);
        function CourtSelectionState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CourtSelectionState.prototype.create = function () {
            this.stage.backgroundColor = 0x02163C;
            this._giftButton = new CourtSelection.GiftButton(CourtSelectionState.GIFT_X, CourtSelectionState.GIFT_Y);
            this._giftButton.content = Game.Global.dailyGift;
            this._giftButton.onClick.add(this.giftButtonClickClb, this);
            this._courtSelBox = new Controls.ListBox(Game.Global.game, CourtSelectionState.COURT_SEL_X, CourtSelectionState.COURT_SEL_Y, CourtSelectionState.COURT_SEL_WIDTH, this.camera.height - CourtSelectionState.COURT_SEL_Y - CourtSelectionState.COURT_SEL_BOT_OFFSET, CourtSelectionState.COURT_SEL_CARD_H, CourtSelectionState.COURT_SEL_CARD_PADDING, CourtSelection.CourtLsbItem);
            this._courtSelBox.connectScrollBar(new Game.ScrollBar(), 10);
            this._courtSelBox.content = [Game.Global.courts[1], Game.Global.courts[2]];
            Game.Global.game.add.image(CourtSelectionState.COINS_X, CourtSelectionState.COINS_Y, Game.Global.ATLAS_0, "coinIcon");
            Game.Global.game.add.bitmapText(CourtSelectionState.COINS_X + 56, CourtSelectionState.COINS_Y + 7, Game.Global.FONT_0, Game.Global.coins.toString(), 44);
            var ballsBtn = new CourtSelection.BallsButton(CourtSelectionState.BALLS_X, CourtSelectionState.BALLS_Y);
            ballsBtn.onClick.add(this.ballsButtonClickClb, this);
            if (Game.Global.GAMEE && Gamee2.Gamee.initialized) {
                Gamee2.Gamee.gameReady();
            }
        };
        CourtSelectionState.prototype.update = function () {
            this._giftButton.update();
            this._courtSelBox.update();
        };
        CourtSelectionState.prototype.shutdown = function () {
            this._courtSelBox.destroy();
        };
        CourtSelectionState.prototype.resized = function (newGameW, newGameH) {
            this._courtSelBox.height = newGameH - CourtSelectionState.COURT_SEL_Y - CourtSelectionState.COURT_SEL_BOT_OFFSET;
        };
        CourtSelectionState.prototype.ballsButtonClickClb = function () {
            Utils.AudioUtils.playSound("click");
            this.game.state.start("BallSelection");
        };
        CourtSelectionState.prototype.giftButtonClickClb = function () {
            Utils.AudioUtils.playSound("click");
            this.game.state.start("DailyGift");
        };
        CourtSelectionState.GIFT_X = 438;
        CourtSelectionState.GIFT_Y = 86;
        CourtSelectionState.COURT_SEL_X = 30;
        CourtSelectionState.COURT_SEL_Y = 170;
        CourtSelectionState.COURT_SEL_BOT_OFFSET = 20;
        CourtSelectionState.COURT_SEL_WIDTH = 580;
        CourtSelectionState.COURT_SEL_CARD_H = 290;
        CourtSelectionState.COURT_SEL_CARD_PADDING = 10;
        CourtSelectionState.COINS_X = 30;
        CourtSelectionState.COINS_Y = 20;
        CourtSelectionState.BALLS_X = 143;
        CourtSelectionState.BALLS_Y = 118;
        return CourtSelectionState;
    }(Phaser.State));
    Game.CourtSelectionState = CourtSelectionState;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var DailyGift = (function (_super) {
        __extends(DailyGift, _super);
        function DailyGift() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DailyGift.prototype.init = function (returnState) {
            if (returnState === void 0) { returnState = "CourtSelection"; }
            this._returnState = returnState;
        };
        DailyGift.prototype.create = function () {
            this.stage.backgroundColor = 0x34A2ED;
            this._timeBase = this.time.elapsedSince(0);
            Game.Global.elapsedTime = 0;
            Game.Global.game.add.image(DailyGift.COINS_X, DailyGift.COINS_Y, Game.Global.ATLAS_0, "coinIcon");
            this._coins = Game.Global.game.add.bitmapText(DailyGift.COINS_X + 56, DailyGift.COINS_Y + 7, Game.Global.FONT_0, Game.Global.coins.toString(), DailyGift.LARGE_FONT);
            var closeBtn = new Game.ImageButton(DailyGift.CLOSE_BTN_X, DailyGift.CLOSE_BTN_Y, Game.Global.ATLAS_0, ["buttonClose"]);
            closeBtn.onClick.add(this.closeButtonClickClb, this);
            var emitter = Game.Global.game.add.emitter(0, 0, 25);
            emitter.setXSpeed(-400, 400);
            emitter.setYSpeed(-900, -700);
            emitter.setAlpha(1, 0.5, 2000);
            emitter.setScale(1, 2, 1, 2, 2000);
            emitter.gravity = 1500;
            emitter.makeParticles(Game.Global.ATLAS_0, "coinIcon", emitter.maxParticles, false, false);
            emitter.width = 100;
            this._giftLayer = Game.Global.game.add.group();
            this._giftInfoText = Game.Global.game.add.bitmapText(0, 0, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.tapTheBox), DailyGift.NORMAL_FONT, this._giftLayer);
            this._giftInfoText.anchor.x = 0.5;
            this._giftBox = Game.Global.game.add.image(0, this._giftLayer.height + 30, Game.Global.ATLAS_0, "giftBoxLarge", this._giftLayer);
            this._giftBox.anchor.set(0.5);
            this._giftBox.y += (this._giftBox.height / 2);
            this._giftBox.inputEnabled = true;
            this._giftBox.events.onInputDown.addOnce(this.giftBoxInputDownClb, this);
            this._giftLayer.position.set(Game.Global.GAME_MAX_WIDTH / 2, (this.camera.height - this._giftLayer.height) / 2);
            emitter.position.set(this._giftLayer.x + this._giftBox.x, this._giftLayer.y + this._giftBox.y);
            this._coinEmitter = emitter;
            this._message = new Game.TextPopupMessage(Game.Global.FONT_0, 44);
            this._messageType = new PopupMessage.MessageType(200, 1000, Phaser.Easing.Cubic.Out, 750, 1000, Phaser.Easing.Linear.None);
            this._giftOpened = false;
        };
        DailyGift.prototype.update = function () {
            Game.Global.elapsedTime = this.time.elapsedSince(this._timeBase);
            if (this._giftOpened) {
                var giftVal = Game.Global.dailyGift.value;
                this._coins.text = (Game.Global.coins - giftVal + Math.round(Math.min(1, (Game.Global.elapsedTime - this._giftOpenTime) / 1750) * giftVal)).toString();
            }
            this._message.update();
        };
        DailyGift.prototype.resumed = function () {
            this._timeBase += this.time.pauseDuration;
        };
        DailyGift.prototype.resized = function (newGameW, newGameH) {
            this._giftLayer.y = (newGameH - this._giftLayer.height) / 2;
        };
        DailyGift.prototype.closeButtonClickClb = function () {
            Utils.AudioUtils.playSound("click");
            this.exitScreen();
        };
        DailyGift.prototype.exitScreen = function () {
            this.game.state.start(this._returnState);
        };
        DailyGift.prototype.giftBoxInputDownClb = function () {
            this._giftBox.inputEnabled = false;
            this.game.add.tween(this._giftInfoText).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            var tween = this.game.add.tween(this._giftBox.scale).to({ x: 1.3, y: 1.3 }, 250, Phaser.Easing.Cubic.Out, true, 0, 2, true);
            tween.onRepeat.add(function () {
                this._coinEmitter.explode(2000, 5);
            }, this);
            tween.onComplete.add(function () {
                this.game.add.tween(this._giftBox.scale).to({ x: 2, y: 2 }, 500, Phaser.Easing.Cubic.Out, true);
                this.game.add.tween(this._giftBox).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
                this._message.show(Game.Global.GAME_MAX_WIDTH / 2, this.camera.height / 2, "+" + Game.Global.dailyGift.value, this._messageType);
                this.game.time.events.add(3000, this.exitScreen, this);
            }, this);
            this._giftOpened = true;
            this._giftOpenTime = Game.Global.elapsedTime;
            Utils.AudioUtils.playSound("gift");
            Game.Global.dailyGift.collect();
        };
        DailyGift.LARGE_FONT = 44;
        DailyGift.NORMAL_FONT = 42;
        DailyGift.COINS_X = 30;
        DailyGift.COINS_Y = 20;
        DailyGift.CLOSE_BTN_X = 574;
        DailyGift.CLOSE_BTN_Y = 56;
        return DailyGift;
    }(Phaser.State));
    Game.DailyGift = DailyGift;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var ResultsState = (function (_super) {
        __extends(ResultsState, _super);
        function ResultsState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResultsState.prototype.init = function (gameResults) {
            var court = Game.Global.selectedCourt;
            this.stage.backgroundColor = 0x02163C;
            this._gameeGameOver = false;
            this._gameResults = gameResults;
        };
        ResultsState.prototype.create = function () {
            var camera = Game.Global.game.camera;
            var court = Game.Global.selectedCourt;
            var winnerId = (court.id == 0 || this._gameResults.playerScore > this._gameResults.aiScore ? 0 : this._gameResults.playerScore < this._gameResults.aiScore ? 1 : -1);
            this._timeBase = this.time.elapsedSince(0);
            Game.Global.elapsedTime = 0;
            if (winnerId >= 0)
                this._shineFx = new Results.ShineFx(8);
            Game.Global.game.add.image(ResultsState.COINS_X, ResultsState.COINS_Y, Game.Global.ATLAS_0, "coinIcon");
            Game.Global.game.add.bitmapText(ResultsState.COINS_X + 56, ResultsState.COINS_Y + 7, Game.Global.FONT_0, Game.Global.coins.toString(), ResultsState.LARGE_FONT);
            Game.Global.game.add.bitmapText(Game.Global.GAME_MAX_WIDTH / 2, ResultsState.COURT_NAME_Y, Game.Global.FONT_0, court.title, ResultsState.LARGE_FONT).anchor.set(0.5, 0);
            var resGroup0 = Game.Global.game.add.group();
            Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "resultsPl", resGroup0);
            Game.Global.game.add.bitmapText(75, 100, Game.Global.FONT_0, this._gameResults.playerScore.toString(), ResultsState.NORMAL_FONT, resGroup0).anchor.set(0.5, 0);
            resGroup0.y = ResultsState.RES_ICON_Y;
            if (court.id == 0) {
                resGroup0.x = Math.round((Game.Global.GAME_MAX_WIDTH - resGroup0.width) / 2);
                this._shineFx.setPosition(resGroup0.x + resGroup0.width / 2, resGroup0.y + resGroup0.height / 2);
            }
            else {
                var resGroup1 = Game.Global.game.add.group();
                Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "resultsAI", resGroup1);
                Game.Global.game.add.bitmapText(75, 100, Game.Global.FONT_0, this._gameResults.aiScore.toString(), ResultsState.NORMAL_FONT, resGroup1).anchor.set(0.5, 0);
                resGroup1.y = ResultsState.RES_ICON_Y;
                resGroup0.x = Math.round((Game.Global.GAME_MAX_WIDTH - (resGroup0.width * 2 + ResultsState.RES_ICONS_SPACING)) / 2);
                resGroup1.x = resGroup0.x + resGroup0.width + ResultsState.RES_ICONS_SPACING;
                var winnerCaption = Game.Global.game.add.image(0, ResultsState.WINNER_CAPTION_Y, Game.Global.ATLAS_0, "resultsPlWin");
                winnerCaption.anchor.x = 0.5;
                var plPrizeY = ResultsState.WINNER_PRIZE_Y;
                if (this._gameResults.playerBonusScore != 0) {
                    var msg = Game.Global.game.add.bitmapText(0, ResultsState.WINNER_PRIZE_Y, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.bonus) + " +" + this._gameResults.playerBonusScore, ResultsState.LARGE_FONT);
                    msg.x = resGroup0.x + (resGroup0.width / 2) - (msg.width / 2);
                    plPrizeY += msg.height + 40;
                }
                if (winnerId == 1) {
                    var x = resGroup1.x + resGroup1.width / 2;
                    winnerCaption.frameName = "resultsAIWins";
                    winnerCaption.x = x;
                    this._shineFx.setPosition(x, resGroup1.y + resGroup1.height / 2);
                }
                else if (winnerId == 0) {
                    var x = resGroup0.x + resGroup0.width / 2;
                    winnerCaption.x = x;
                    this._shineFx.setPosition(x, resGroup0.y + resGroup0.height / 2);
                    var layer = Game.Global.game.add.group();
                    Game.Global.game.add.image(0, 0, Game.Global.ATLAS_0, "coinIcon", layer).anchor.set(0, 0.5);
                    Game.Global.game.add.bitmapText(layer.width + 10, 0, Game.Global.FONT_0, "+" + court.prize, ResultsState.LARGE_FONT, layer).anchor.set(0, 0.5);
                    layer.position.set(x - layer.width / 2, plPrizeY);
                }
                else {
                    winnerCaption.frameName = "resultsDraw";
                    winnerCaption.x = Game.Global.GAME_MAX_WIDTH / 2;
                }
            }
            if (this._gameResults.newBestScore) {
                var layer = Game.Global.game.add.group();
                Game.Global.game.add.bitmapText(0, 0, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.newBest), ResultsState.LARGE_FONT, layer).anchor.set(0, 0.5);
                Game.Global.game.add.image(layer.width + 20, 0, Game.Global.ATLAS_0, "coinIcon", layer).anchor.set(0, 0.5);
                Game.Global.game.add.bitmapText(layer.width + 10, 0, Game.Global.FONT_0, "+" + ResultsState.NEW_BEST_PRIZE.toString(), ResultsState.LARGE_FONT, layer).anchor.set(0, 0.5);
                layer.position.set((Game.Global.GAME_MAX_WIDTH - layer.width) / 2, camera.height - ResultsState.NEW_BEST_Y);
            }
            Game.Global.game.add.bitmapText(Game.Global.GAME_MAX_WIDTH / 2, camera.height - ResultsState.BEST_SCORE_Y, Game.Global.FONT_0, Game.Global.getText(Game.eTextAsset.bestScore2) + " " + Game.Global.selectedCourt.highScore.toString(), ResultsState.NORMAL_FONT).anchor.set(0.5, 0);
            var btn = new Game.TextButton(Game.Global.GAME_MAX_WIDTH / 2, camera.height - ResultsState.OK_BUTTON_Y, Game.Global.FONT_0, ResultsState.NORMAL_FONT, Game.Global.getText(Game.eTextAsset.ok));
            btn.onClick.add(this.okButtonClickClb, this);
        };
        ResultsState.prototype.update = function () {
            Game.Global.elapsedTime = this.time.elapsedSince(this._timeBase);
            if (this._gameResults.playerScore != this._gameResults.aiScore)
                this._shineFx.update();
        };
        ResultsState.prototype.resumed = function () {
            this._timeBase += this.time.pauseDuration;
        };
        ResultsState.prototype.okButtonClickClb = function () {
            if (!this._gameeGameOver) {
                this._gameeGameOver = true;
                Utils.AudioUtils.playSound("click");
                if (Game.Global.GAMEE && Gamee2.Gamee.initialized) {
                    Gamee2.Gamee.gameOver();
                }
                else {
                    this.game.state.start("CourtSelection");
                }
            }
        };
        ResultsState.LARGE_FONT = 44;
        ResultsState.NORMAL_FONT = 42;
        ResultsState.COINS_X = 30;
        ResultsState.COINS_Y = 20;
        ResultsState.COURT_NAME_Y = 110;
        ResultsState.RES_ICONS_SPACING = 82;
        ResultsState.RES_ICON_Y = 330;
        ResultsState.WINNER_CAPTION_Y = ResultsState.RES_ICON_Y - 60;
        ResultsState.WINNER_PRIZE_Y = ResultsState.RES_ICON_Y + 184;
        ResultsState.BEST_SCORE_Y = 220;
        ResultsState.NEW_BEST_Y = 250;
        ResultsState.NEW_BEST_PRIZE = 1;
        ResultsState.OK_BUTTON_Y = 110;
        return ResultsState;
    }(Phaser.State));
    Game.ResultsState = ResultsState;
})(Game || (Game = {}));
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
            if (AudioUtils._currentMusic == null || AudioUtils._currentMusic.length == 0)
                return;
            var music = AudioUtils._music[AudioUtils._currentMusic];
            if (music == undefined)
                return;
            music.stop();
            AudioUtils._currentMusic = null;
        };
        AudioUtils.pauseMusic = function () {
            if (AudioUtils.isMusicPlaying) {
                AudioUtils._music[AudioUtils._currentMusic].pause();
            }
        };
        AudioUtils.resumeMusic = function () {
            if (AudioUtils._musicOn && AudioUtils._currentMusic != null && AudioUtils._currentMusic.length > 0) {
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
    var eDragAimState;
    (function (eDragAimState) {
        eDragAimState[eDragAimState["idle"] = 0] = "idle";
        eDragAimState[eDragAimState["aiming"] = 1] = "aiming";
        eDragAimState[eDragAimState["confirmed"] = 2] = "confirmed";
    })(eDragAimState || (eDragAimState = {}));
    var DragAim = (function () {
        function DragAim(game, minValidDistance, autoConfirmDistance, autoConfirmOnDragStop, correctionDistance, correctionDirAngleDif, minAllowedDir, maxAllowedDir) {
            this._game = game;
            this._minValidDistance = minValidDistance;
            this._autoConfirmDistance = autoConfirmDistance;
            this._autoConfirmOnDragStop = autoConfirmOnDragStop;
            this._correctionDistance = correctionDistance;
            this._correctionMaxDirDif = correctionDirAngleDif;
            this._minAllowedDir = minAllowedDir;
            this._maxAllowedDir = maxAllowedDir;
            this._startPos = new Phaser.Point();
            this._correctionPos = new Phaser.Point();
            this._lastPos = new Phaser.Point;
            this._onAimed = new Phaser.Signal();
            this.reset();
        }
        Object.defineProperty(DragAim.prototype, "onAimed", {
            get: function () { return this._onAimed; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DragAim.prototype, "targetObject", {
            get: function () { return this._targetObject; },
            enumerable: true,
            configurable: true
        });
        DragAim.prototype.reset = function () {
            this._state = eDragAimState.idle;
        };
        DragAim.prototype.update = function () {
            var pointer = this._game.input.activePointer;
            if (pointer.isDown) {
                if (this._state == eDragAimState.idle) {
                    this._state = eDragAimState.aiming;
                    this.setStartPoint(pointer.position);
                    this._targetObject = pointer.targetObject;
                    this._lastChangeTime = Game.Global.elapsedTime;
                }
                else if (this._state == eDragAimState.aiming) {
                    if (this._lastPos.equals(pointer.position)) {
                        if (Game.Global.elapsedTime - this._lastChangeTime >= 250) {
                            this.endAim(this._lastPos);
                        }
                        return;
                    }
                    this._lastPos.copyFrom(pointer.position);
                    this._lastChangeTime = Game.Global.elapsedTime;
                    var distance = this._correctionPos.distance(pointer.position);
                    if (distance >= this._correctionDistance) {
                        var dir = this._correctionPos.angle(pointer.position, true);
                        if (this._curDir == null) {
                            this._curDir = dir;
                        }
                        else {
                            if (Math.abs(this._curDir - dir) > this._correctionMaxDirDif) {
                                this.setStartPoint(this._correctionPos, dir);
                            }
                            else {
                                this._curDir = this._startPos.angle(pointer.position, true);
                            }
                            this._correctionPos.copyFrom(pointer.position);
                        }
                    }
                    if (this._autoConfirmDistance > 0) {
                        distance = this._startPos.distance(pointer.position);
                        if (distance >= this._autoConfirmDistance) {
                            this.endAim(pointer.position, distance);
                        }
                    }
                }
            }
            else {
                if (this._state == eDragAimState.aiming) {
                    this.endAim(pointer.position);
                }
                else if (this._state == eDragAimState.confirmed) {
                    this._state = eDragAimState.idle;
                }
            }
        };
        DragAim.prototype.setStartPoint = function (pos, dir) {
            if (dir === void 0) { dir = null; }
            this._startPos.copyFrom(pos);
            this._correctionPos.copyFrom(pos);
            this._lastPos.copyFrom(pos);
            this._curDir = dir;
        };
        DragAim.prototype.endAim = function (endPos, distance) {
            if (distance === void 0) { distance = 0; }
            if (distance == 0)
                distance = this._startPos.distance(endPos);
            if (this._minValidDistance <= 0 || this._minValidDistance <= distance) {
                this._state = eDragAimState.confirmed;
                this._curDir = this._startPos.angle(endPos, true);
                this._onAimed.dispatch(this._startPos, this._curDir, distance, this._targetObject);
                return true;
            }
            this._state = eDragAimState.idle;
            return false;
        };
        return DragAim;
    }());
    Utils.DragAim = DragAim;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var GameObjectCollection = (function () {
        function GameObjectCollection(objectType, objectCreateFnc, objectCreateFncThis) {
            if (objectType === void 0) { objectType = undefined; }
            this._objectType = objectType;
            this._objectCreateFnc = objectCreateFnc;
            this._objectCreateFncThis = objectCreateFncThis;
            this._actObjects = new Collections.LinkedList();
            this._inactObjects = new Collections.LinkedList();
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
            var obj;
            if (this._inactObjects.isEmpty) {
                if (this._objectCreateFnc != undefined) {
                    obj = this._objectCreateFnc.call(this._objectCreateFncThis);
                }
                else {
                    obj = new this._objectType();
                }
            }
            else {
                obj = this._inactObjects.removeElementAtIndex(0);
            }
            this._actObjects.add(obj);
            return obj;
        };
        GameObjectCollection.prototype.deactivateObject = function (obj) {
            if (obj["kill"])
                obj.kill();
            if (this._actObjects.remove(obj))
                this._inactObjects.add(obj);
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
    var KineticScrollingSettings = (function () {
        function KineticScrollingSettings() {
            this.kineticMovement = true;
            this.timeConstantScroll = 325;
            this.horizontalScroll = false;
            this.verticalScroll = false;
            this.deltaWheel = 40;
        }
        return KineticScrollingSettings;
    }());
    Utils.KineticScrollingSettings = KineticScrollingSettings;
    var KineticScrolling = (function () {
        function KineticScrolling(game, horizontalScroll, verticalScroll) {
            this._pressed = false;
            this._dragging = false;
            this._autoScrollX = false;
            this._autoScrollY = false;
            this._directionWheel = 0;
            this._game = game;
            this._settings = new KineticScrollingSettings();
            this._settings.horizontalScroll = horizontalScroll;
            this._settings.verticalScroll = verticalScroll;
            game.input.onDown.add(this.beginMove, this);
            game.input.addMoveCallback(this.move, this);
            game.input.onUp.add(this.endMove, this);
            game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this);
            this._x = 0;
            this._y = 0;
            this._onPosChange = new Phaser.Signal();
        }
        Object.defineProperty(KineticScrolling.prototype, "game", {
            get: function () { return this._game; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KineticScrolling.prototype, "settings", {
            get: function () { return this._settings; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KineticScrolling.prototype, "area", {
            get: function () { return this._area; },
            set: function (area) { this._area = area; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KineticScrolling.prototype, "x", {
            get: function () { return this._x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KineticScrolling.prototype, "y", {
            get: function () { return this._y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KineticScrolling.prototype, "onPosChange", {
            get: function () { return this._onPosChange; },
            enumerable: true,
            configurable: true
        });
        KineticScrolling.prototype.destroy = function () {
            this._game.input.onDown.remove(this.beginMove, this);
            this._game.input.deleteMoveCallback(this.move, this);
            this._game.input.onUp.remove(this.endMove, this);
            this._game.input.mouse.mouseWheelCallback = null;
        };
        KineticScrolling.prototype.update = function () {
            var elapsed = Date.now() - this._timeStamp;
            this._velocityWheelXAbs = Math.abs(this._velocityWheelX);
            this._velocityWheelYAbs = Math.abs(this._velocityWheelY);
            var x = this._x;
            var y = this._y;
            if (this._autoScrollX && this._amplitudeX != 0) {
                var delta = -this._amplitudeX * Math.exp(-elapsed / this._settings.timeConstantScroll);
                if (delta > 0.5 || delta < -0.5) {
                    var x_1 = this._targetX - delta;
                }
                else {
                    this._autoScrollX = false;
                    x = this._targetX;
                }
            }
            if (this._autoScrollY && this._amplitudeY != 0) {
                var delta = -this._amplitudeY * Math.exp(-elapsed / this._settings.timeConstantScroll);
                if (delta > 0.5 || delta < -0.5) {
                    y = this._targetY - delta;
                }
                else {
                    this._autoScrollY = false;
                    y = this._targetY;
                }
            }
            if (!this._autoScrollX && !this._autoScrollY) {
                this._dragging = false;
            }
            if (this._settings.horizontalScroll && this._velocityWheelXAbs > 0.1) {
                this._dragging = true;
                this._amplitudeX = 0;
                this._autoScrollX = false;
                x -= this._velocityWheelX;
                this._velocityWheelX *= 0.95;
            }
            if (this._settings.verticalScroll && this._velocityWheelYAbs > 0.1) {
                this._dragging = true;
                this._autoScrollY = false;
                y -= this._velocityWheelY;
                this._velocityWheelY *= 0.95;
            }
            if (x != this._x || y != this._y) {
                this.updatePosition(this._x - x, this._y - y);
            }
        };
        KineticScrolling.prototype.beginMove = function (pointer) {
            if (this._area != undefined && this._area != null) {
                if (!this._area.contains(pointer.x, pointer.y))
                    return;
            }
            this._pressed = true;
            this._timeStamp = Date.now();
            this._startX = pointer.x;
            this._startY = pointer.y;
            this._velocityX = this._velocityY = this._amplitudeX = this._amplitudeY = 0;
        };
        KineticScrolling.prototype.move = function (pointer) {
            if (!this._pressed)
                return;
            var now = Date.now();
            var elapsed = now - this._timeStamp;
            this._timeStamp = now;
            var deltaX = 0;
            var deltaY = 0;
            if (this._settings.horizontalScroll) {
                deltaX = pointer.x - this._startX;
                if (deltaX != 0) {
                    this._dragging = true;
                    this._startX = pointer.x;
                }
                this._velocityX = 0.8 * (1000 * deltaX / (1 + elapsed)) + 0.2 * this._velocityX;
            }
            if (this._settings.verticalScroll) {
                deltaY = pointer.y - this._startY;
                if (deltaY != 0) {
                    this._dragging = true;
                    this._startY = pointer.y;
                }
                this._velocityY = 0.8 * (1000 * deltaY / (1 + elapsed)) + 0.2 * this._velocityY;
            }
            this.updatePosition(deltaX, deltaY);
        };
        KineticScrolling.prototype.endMove = function () {
            if (!this._pressed)
                return;
            this._pressed = false;
            this._autoScrollX = false;
            this._autoScrollY = false;
            if (!this._settings.kineticMovement)
                return;
            var now = Date.now();
            var elapsed = now - this._timeStamp;
            if (elapsed > 100)
                return;
            this._timeStamp = now;
            if (this._game.input.activePointer.withinGame) {
                if (this._velocityX > 10 || this._velocityX < -10) {
                    this._amplitudeX = 0.8 * this._velocityX;
                    this._targetX = Math.round(this._x - this._amplitudeX);
                    this._autoScrollX = true;
                }
                if (this._velocityY > 10 || this._velocityY < -10) {
                    this._amplitudeY = 0.8 * this._velocityY;
                    this._targetY = Math.round(this._y - this._amplitudeY);
                    this._autoScrollY = true;
                }
            }
            else {
                this._velocityWheelXAbs = Math.abs(this._velocityWheelX);
                this._velocityWheelYAbs = Math.abs(this._velocityWheelY);
                if (this._settings.horizontalScroll && this._velocityWheelXAbs < 0.1) {
                    this._autoScrollX = true;
                }
                if (this._settings.verticalScroll && this._velocityWheelYAbs < 0.1) {
                    this._autoScrollY = true;
                }
            }
        };
        KineticScrolling.prototype.mouseWheel = function () {
            if (!this._settings.horizontalScroll && !this._settings.verticalScroll)
                return;
            if (this._area != undefined && this._area != null) {
                if (!this._area.contains(this._game.input.activePointer.x, this._game.input.activePointer.y))
                    return;
            }
            event.preventDefault();
            var delta = this._game.input.mouse.wheelDelta * 120 / this._settings.deltaWheel;
            if (this._directionWheel != this._game.input.mouse.wheelDelta) {
                this._velocityWheelX = 0;
                this._velocityWheelY = 0;
                this._directionWheel = this._game.input.mouse.wheelDelta;
            }
            if (this._settings.verticalScroll) {
                this._autoScrollY = false;
                this._velocityWheelY += delta;
            }
            else if (this._settings.horizontalScroll) {
                this._autoScrollX = false;
                this._velocityWheelX += delta;
            }
        };
        KineticScrolling.prototype.updatePosition = function (deltaX, deltaY) {
            this._x -= deltaX;
            this._y -= deltaY;
            this._onPosChange.dispatch(deltaX, deltaY, this._x, this._y);
        };
        return KineticScrolling;
    }());
    Utils.KineticScrolling = KineticScrolling;
})(Utils || (Utils = {}));
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
            _this.state.add("CourtSelection", Game_1.CourtSelectionState);
            _this.state.add("BallSelection", Game_1.BallSelectionState);
            _this.state.add("Play", Game_1.Play);
            _this.state.add("DailyGift", Game_1.DailyGift);
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
        Game.prototype.onGameeStart = function () {
            this.paused = false;
            var curState = this.state.getCurrentState();
            if (!(curState instanceof Game_1.Play)) {
                this.state.start("Play");
            }
            else {
                curState.onGameeStart();
            }
        };
        Game.prototype.onGameePause = function () {
            Utils.AudioUtils.stopMusic();
            this.paused = true;
        };
        Game.prototype.onGameeResume = function () {
            this.paused = false;
            if (Utils.AudioUtils.musicOn)
                Utils.AudioUtils.playMusic("ambient", true);
        };
        Game.prototype.onGameeMute = function () {
            Utils.AudioUtils.sfxOn = false;
            Utils.AudioUtils.stopMusic();
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
var Gamee2;
(function (Gamee2) {
    var eInitState;
    (function (eInitState) {
        eInitState[eInitState["none"] = 0] = "none";
        eInitState[eInitState["ok"] = 1] = "ok";
        eInitState[eInitState["inProgress"] = 2] = "inProgress";
        eInitState[eInitState["error"] = 3] = "error";
    })(eInitState = Gamee2.eInitState || (Gamee2.eInitState = {}));
    var eGameContext;
    (function (eGameContext) {
        eGameContext["normal"] = "normal";
        eGameContext["battle"] = "battle";
    })(eGameContext = Gamee2.eGameContext || (Gamee2.eGameContext = {}));
    var ePlatform;
    (function (ePlatform) {
        ePlatform["ios"] = "ios";
        ePlatform["android"] = "android";
        ePlatform["web"] = "web";
        ePlatform["mobileWeb"] = "mobile_web";
    })(ePlatform = Gamee2.ePlatform || (Gamee2.ePlatform = {}));
    var eStartFlag;
    (function (eStartFlag) {
        eStartFlag[eStartFlag["replay"] = 1] = "replay";
        eStartFlag[eStartFlag["ghost"] = 2] = "ghost";
        eStartFlag[eStartFlag["reset"] = 4] = "reset";
    })(eStartFlag = Gamee2.eStartFlag || (Gamee2.eStartFlag = {}));
    var eAdState;
    (function (eAdState) {
        eAdState[eAdState["ready"] = 0] = "ready";
        eAdState[eAdState["loading"] = 1] = "loading";
        eAdState[eAdState["showing"] = 2] = "showing";
        eAdState[eAdState["uninitialized"] = 3] = "uninitialized";
    })(eAdState = Gamee2.eAdState || (Gamee2.eAdState = {}));
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
        Object.defineProperty(Gamee, "onGhostChange", {
            get: function () { return Gamee._onGhostChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "initialized", {
            get: function () { return this._initState == eInitState.ok; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "initData", {
            get: function () { return Gamee._initData; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "startFlags", {
            get: function () { return Gamee._startFlags; },
            enumerable: true,
            configurable: true
        });
        Gamee.initialize = function (controller, gameCapabilities) {
            if (Gamee._initState == eInitState.none) {
                if (window.gamee == undefined) {
                    Gamee._initState = eInitState.error;
                    console.log("GAMEE doesn't exist");
                    return false;
                }
                Gamee._initState = eInitState.inProgress;
                window.gamee.gameInit(controller, {}, gameCapabilities, function (error, data) {
                    if (error == null) {
                        Gamee._initState = eInitState.ok;
                        Gamee._initData = data;
                        if (data && data.socialData && data.socialData.player)
                            Gamee._player = data.socialData.player;
                        window.gamee.emitter.addEventListener("start", function (event) {
                            var flags = 0;
                            if (event.detail != undefined) {
                                if (event.detail.opt_replay != undefined && event.detail.opt_replay != false)
                                    flags |= eStartFlag.replay;
                                if (event.detail.opt_ghostMode != undefined && event.detail.opt_ghostMode != false)
                                    flags |= eStartFlag.ghost;
                                if (event.detail.opt_resetState != undefined && event.detail.opt_resetState != false)
                                    flags |= eStartFlag.reset;
                            }
                            Gamee._score = 0;
                            Gamee._startFlags = flags;
                            Gamee._onStart.dispatch(flags);
                        });
                        window.gamee.emitter.addEventListener("pause", function () {
                            Gamee._onPause.dispatch();
                        });
                        window.gamee.emitter.addEventListener("resume", function () {
                            Gamee._onResume.dispatch();
                        });
                        window.gamee.emitter.addEventListener("mute", function () {
                            Gamee._onMute.dispatch();
                        });
                        window.gamee.emitter.addEventListener("unmute", function () {
                            Gamee._onUnmute.dispatch();
                        });
                        window.gamee.emitter.addEventListener("ghostHide", function () {
                            Gamee._onGhostChange.dispatch(false);
                        });
                        window.gamee.emitter.addEventListener("ghostShow", function () {
                            Gamee._onGhostChange.dispatch(true);
                        });
                    }
                    else {
                        Gamee._initState = eInitState.error;
                        console.log(error);
                    }
                    Gamee._onInitialized.dispatch(Gamee._initState, data);
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
        Object.defineProperty(Gamee, "player", {
            get: function () { return Gamee._player; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "friends", {
            get: function () { return Gamee._friends; },
            enumerable: true,
            configurable: true
        });
        Gamee.requestSocial = function (cbFnc, cbCtx, entryCnt) {
            if (entryCnt === void 0) { entryCnt = 10; }
            if (Gamee._initState == eInitState.ok) {
                window.gamee.requestSocial(function (error, data) {
                    Gamee._player = null;
                    Gamee._friends = null;
                    if (error == undefined || error == null) {
                        if (data && data.socialData && data.socialData.friends)
                            Gamee._friends = data.socialData.friends;
                        if (data && data.socialData && data.socialData.player)
                            Gamee._player = data.socialData.player;
                    }
                    cbFnc.call(cbCtx);
                }, entryCnt);
            }
        };
        Gamee.requestPlayerReplay = function (cbFnc, cbCtx, playerId) {
            if (Gamee._initState == eInitState.ok) {
                window.gamee.requestPlayerReplay(playerId, function (error, data) {
                    var replayData;
                    if (data && data.replayData) {
                        replayData = data.replayData.data;
                    }
                    else {
                        replayData = null;
                    }
                    cbFnc.call(cbCtx, replayData);
                });
            }
        };
        Gamee.requestPlayerSaveData = function (cbFnc, cbCtx, playerId) {
            if (Gamee._initState == eInitState.ok) {
                window.gamee.requestPlayerSaveState(playerId, function (error, data) {
                    var saveData;
                    if (data && data.saveState) {
                        saveData = data.saveState;
                    }
                    else {
                        saveData = "";
                    }
                    cbFnc.call(cbCtx, saveData);
                });
            }
        };
        Gamee.requestPlayerData = function (cbFnc, cbCtx) {
            if (Gamee._initState == eInitState.ok) {
                window.gamee.requestPlayerData(function (error, data) {
                    if (data && data.player) {
                        Gamee._player = data.player;
                    }
                    else {
                        Gamee._player = null;
                    }
                    cbFnc.call(cbCtx, Gamee._player);
                });
            }
        };
        Gamee.logEvent = function (name, value) {
            if (value === void 0) { value = ""; }
            if (Gamee._ready) {
                window.gamee.logEvent(name, value);
            }
        };
        Gamee.gameOver = function (replayData, saveData) {
            if (Gamee._ready) {
                var replay = void 0;
                if (replayData != undefined)
                    replay = { data: replayData, variant: "0" };
                window.gamee.gameOver(replay, null, saveData);
            }
        };
        Gamee.gameSave = function (saveData) {
            if (Gamee._ready)
                window.gamee.gameSave(saveData, true);
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
                if (Gamee._initState == eInitState.ok)
                    window.gamee.updateScore(score, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "adState", {
            get: function () { return Gamee._adState; },
            enumerable: true,
            configurable: true
        });
        Gamee.loadAd = function (cbFnc, cbCtx) {
            if (Gamee._initState != eInitState.ok || Gamee._adState != eAdState.uninitialized)
                return false;
            Gamee._adState = eAdState.loading;
            try {
                window.gamee.loadRewardedVideo(function (error, data) {
                    Gamee._adState = (data && data.videoLoaded ? eAdState.ready : eAdState.uninitialized);
                    if (cbFnc)
                        cbFnc.call(cbCtx, Gamee._adState == eAdState.ready);
                });
            }
            catch (e) {
                return false;
            }
            return true;
        };
        Gamee.showAd = function (cbFnc, cbCtx) {
            if (Gamee._adState != eAdState.ready) {
                return false;
            }
            Gamee._adState = eAdState.showing;
            window.gamee.showRewardedVideo(function (error, data) {
                Gamee._adState = eAdState.uninitialized;
                cbFnc.call(cbCtx, (data && data.videoPlayed));
            });
            return true;
        };
        Gamee.purchaseItem = function (cost, name, base64Img, cbFnc, cbCtx) {
            if (!Gamee.ready)
                return false;
            window.gamee.purchaseItem({
                coinsCost: cost, itemName: name,
                itemImage: base64Img
            }, function (error, data) {
                var res = false;
                if (data && data.purchaseStatus) {
                    res = true;
                    if (data.coinsLeft && Gamee.player != null)
                        Gamee.player.coins = data.coinsLeft;
                }
                cbFnc.call(cbCtx, res);
            });
        };
        Gamee._onInitialized = new Phaser.Signal();
        Gamee._onStart = new Phaser.Signal();
        Gamee._onPause = new Phaser.Signal();
        Gamee._onResume = new Phaser.Signal();
        Gamee._onMute = new Phaser.Signal();
        Gamee._onUnmute = new Phaser.Signal();
        Gamee._onGhostChange = new Phaser.Signal();
        Gamee._initState = eInitState.none;
        Gamee._ready = false;
        Gamee._player = null;
        Gamee._friends = null;
        Gamee._score = 0;
        Gamee._adState = eAdState.uninitialized;
        return Gamee;
    }());
    Gamee2.Gamee = Gamee;
})(Gamee2 || (Gamee2 = {}));
var Game;
(function (Game) {
    var Sounds = (function () {
        function Sounds() {
        }
        Sounds.AUDIO_JSON = {
            "resources": [
                "sfx.ogg",
                "sfx.mp3"
            ],
            "spritemap": {
                "applause": {
                    "start": 0,
                    "end": 3.047981859410431,
                    "loop": false
                },
                "bounceFloor": {
                    "start": 5,
                    "end": 5.4577097505668934,
                    "loop": false
                },
                "bounceHoop": {
                    "start": 7,
                    "end": 7.357845804988662,
                    "loop": false
                },
                "click": {
                    "start": 9,
                    "end": 9.095011337868481,
                    "loop": false
                },
                "successfulShot": {
                    "start": 11,
                    "end": 11.285986394557824,
                    "loop": false
                },
                "payment": {
                    "start": 13,
                    "end": 14.182789115646258,
                    "loop": false
                },
                "perfectShot": {
                    "start": 16,
                    "end": 16.602993197278913,
                    "loop": false
                },
                "shoot": {
                    "start": 18,
                    "end": 18.155260770975058,
                    "loop": false
                },
                "siren": {
                    "start": 20,
                    "end": 21.484308390022676,
                    "loop": false
                },
                "tick": {
                    "start": 23,
                    "end": 23.120226757369615,
                    "loop": false
                },
                "powerUp": {
                    "start": 25,
                    "end": 25.49732426303855,
                    "loop": false
                },
                "gift": {
                    "start": 27,
                    "end": 28.511496598639457,
                    "loop": false
                },
                "fireBall1": {
                    "start": 30,
                    "end": 31.40108843537415,
                    "loop": false
                }
            }
        };
        return Sounds;
    }());
    Game.Sounds = Sounds;
})(Game || (Game = {}));

