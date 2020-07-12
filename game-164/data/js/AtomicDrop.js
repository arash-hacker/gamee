var RoboJump;
(function (RoboJump) {
    var Global = (function () {
        function Global() {
        }
        Global.GAME_MAX_WIDTH = 640;
        Global.GAME_MAX_HEIGHT = 1280;
        Global.GAME_MIN_WIDTH = 640;
        Global.GAME_MIN_HEIGHT = 640;
        Global.FPS = 60;
        Global.GAMEE = true;
        Global.DEBUG = false;
        Global.elapsedTime = 0;
        Global.deltaRatio = 1;
        Global.ATLAS_KEY_0 = "atlas0";
        return Global;
    }());
    RoboJump.Global = Global;
    window.onload = function () {
        Global.game = new RoboJump.Game();
    };
})(RoboJump || (RoboJump = {}));
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
        LinkedList.prototype.first = function () {
            if (this.firstNode !== null) {
                return this.firstNode.element;
            }
            return undefined;
        };
        LinkedList.prototype.last = function () {
            if (this.lastNode !== null) {
                return this.lastNode.element;
            }
            return undefined;
        };
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
            if (this.size() !== other.size()) {
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
        LinkedList.prototype.forEach = function (callback) {
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (callback(currentNode.element) === false) {
                    break;
                }
                currentNode = currentNode.next;
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
        LinkedList.prototype.size = function () {
            return this.nElements;
        };
        LinkedList.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };
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
var Controls;
(function (Controls) {
    var Button = (function () {
        function Button(id, type, x, y, content, fixedToCamera, states, parent) {
            if (fixedToCamera === void 0) { fixedToCamera = true; }
            this._id = id;
            this._type = type;
            this._states = (states != undefined && states != null ? states : type.states);
            this._state = 0;
            this._onClick = new Phaser.Signal();
            if (parent == undefined)
                parent = type.layer;
            this._container = RoboJump.Global.game.add.group(parent);
            this._container.fixedToCamera = fixedToCamera;
            this._image = this.createImage(this._container, this._states);
            this._image.anchor.copyFrom(type.anchor);
            this._image.inputEnabled = true;
            this._image.input.priorityID = 100;
            this._image.events.onInputDown.add(this.handlePointerDown, this, 0);
            this._image.events.onInputUp.add(this.handlePointerUp, this, 0);
            this.x = x;
            this.y = y;
            if (content != undefined && content != null) {
                this._content = content;
                this._container.addChild(this._content);
                this.updateContentPos();
            }
            else {
                this._content = null;
            }
        }
        Object.defineProperty(Button.prototype, "id", {
            get: function () { return this._id; },
            set: function (id) { this._id = id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "type", {
            get: function () { return this._type; },
            set: function (type) {
                this._type = type;
                this._image.anchor.copyFrom(type.anchor);
                if (type.states != undefined) {
                    var prevStates = this._states;
                    var state = this._state;
                    this._states = type.states;
                    if (prevStates[state].texture != this._states[state].texture) {
                        this._image.loadTexture(this._states[state].texture, this._states[state].frame);
                    }
                    else if (prevStates[this._state].frame != this._states[state].frame) {
                        this._image.frameName = this._states[state].frame;
                    }
                }
                this.updateContentPos();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "onClick", {
            get: function () { return this._onClick; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "content", {
            get: function () { return this._content; },
            set: function (content) {
                if (this._content != null)
                    this._container.removeChild(this._content);
                if (content == undefined)
                    content = null;
                this._content = content;
                if (this._content != null) {
                    this._container.addChild(this._content);
                    this.updateContentPos();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "x", {
            get: function () { return this._container.fixedToCamera ? this._container.cameraOffset.x : this._container.x; },
            set: function (x) {
                if (this._container.fixedToCamera)
                    this._container.cameraOffset.x = x;
                else
                    this._container.x = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "y", {
            get: function () { return this._container.fixedToCamera ? this._container.cameraOffset.y : this._container.y; },
            set: function (y) {
                if (this._container.fixedToCamera)
                    this._container.cameraOffset.y = y;
                else
                    this._container.y = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "width", {
            get: function () { return this._image.width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "height", {
            get: function () { return this._image.height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "visible", {
            get: function () { return this._container.visible; },
            set: function (visible) { this._container.visible = visible; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "enabled", {
            get: function () { return this._state != 2; },
            set: function (value) {
                if (this.enabled != value) {
                    this._image.inputEnabled = value;
                    this.setState(value ? 0 : 2);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "pressed", {
            get: function () { return this._state == 1; },
            enumerable: true,
            configurable: true
        });
        Button.prototype.setState = function (state) {
            if (this._state == state)
                return;
            if (this._states[this._state].texture != this._states[state].texture) {
                this._image.loadTexture(this._states[state].texture, this._states[state].frame);
            }
            else if (this._states[this._state].frame != this._states[state].frame) {
                this._image.frameName = this._states[state].frame;
            }
            this._state = state;
            this.updateContentPos();
        };
        Button.prototype.updateContentPos = function () {
            if (this._content == null)
                return;
            var anchor = this._type.contentAnchor;
            this._content.position.set(this._image.x + this._states[this._state].contentOffsetX + Math.round(this._image.width * anchor.x), this._image.y + this._states[this._state].contentOffsetY + Math.round(this._image.height * anchor.y));
        };
        Button.prototype.handlePointerDown = function () {
            if (this._state != 0)
                return true;
            this.setState(1);
            return false;
        };
        Button.prototype.handlePointerUp = function (img, pointer, isOver) {
            if (this._state != 1)
                return;
            this.setState(0);
            if (isOver) {
                this._onClick.dispatch(this);
                this._type.onClick.dispatch(this);
            }
        };
        Button.prototype.createImage = function (container, states) {
            return RoboJump.Global.game.add.image(0, 0, states[0].texture, states[0].frame, container);
        };
        return Button;
    }());
    Controls.Button = Button;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ButtonState = (function () {
        function ButtonState(texture, frame, contentOffsetX, contentOffsetY) {
            if (frame === void 0) { frame = null; }
            if (contentOffsetX === void 0) { contentOffsetX = 0; }
            if (contentOffsetY === void 0) { contentOffsetY = 0; }
            this._texture = texture;
            this._frame = frame;
            this._contentOffsetX = contentOffsetX;
            this._contentOffsetY = contentOffsetY;
        }
        Object.defineProperty(ButtonState.prototype, "texture", {
            get: function () { return this._texture; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonState.prototype, "frame", {
            get: function () { return this._frame; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonState.prototype, "contentOffsetX", {
            get: function () { return this._contentOffsetX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonState.prototype, "contentOffsetY", {
            get: function () { return this._contentOffsetY; },
            enumerable: true,
            configurable: true
        });
        return ButtonState;
    }());
    Controls.ButtonState = ButtonState;
    var ButtonType = (function () {
        function ButtonType(anchor, states, contentAnchor, layer) {
            if (states === void 0) { states = null; }
            this._states = states;
            this._anchor = anchor ? anchor : new Phaser.Point();
            this._contentAnchor = contentAnchor ? contentAnchor : new Phaser.Point(0.5, 0.5);
            this._layer = layer;
            this._onClick = new Phaser.Signal();
        }
        Object.defineProperty(ButtonType.prototype, "layer", {
            get: function () { return this._layer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonType.prototype, "anchor", {
            get: function () { return this._anchor; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonType.prototype, "states", {
            get: function () { return this._states; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonType.prototype, "contentAnchor", {
            get: function () { return this._contentAnchor; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonType.prototype, "onClick", {
            get: function () { return this._onClick; },
            enumerable: true,
            configurable: true
        });
        return ButtonType;
    }());
    Controls.ButtonType = ButtonType;
})(Controls || (Controls = {}));
var Playfield;
(function (Playfield) {
    var Checkpoint = (function () {
        function Checkpoint() {
        }
        Object.defineProperty(Checkpoint.prototype, "column", {
            get: function () { return this._col; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Checkpoint.prototype, "row", {
            get: function () { return this._row; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Checkpoint.prototype, "playerVersion", {
            get: function () { return this._plVer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Checkpoint.prototype, "playerDir", {
            get: function () { return this._plDir; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Checkpoint.prototype, "score", {
            get: function () { return this._score; },
            enumerable: true,
            configurable: true
        });
        Checkpoint.prototype.reset = function () {
            this._col = 2;
            this._row = 0;
            this._plVer = 0;
            this._plDir = Characters.eCharacterDir.left;
            this._score = 0;
        };
        Checkpoint.prototype.init = function (col, row, plVer, plDir, score) {
            this._col = col;
            this._row = row;
            this._plVer = plVer;
            this._plDir = plDir;
            this._score = score;
        };
        return Checkpoint;
    }());
    Playfield.Checkpoint = Checkpoint;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var MapSectionNode = (function () {
        function MapSectionNode() {
        }
        Object.defineProperty(MapSectionNode.prototype, "prev", {
            get: function () { return this._prev; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapSectionNode.prototype, "next", {
            get: function () { return this._next; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapSectionNode.prototype, "worldPos", {
            get: function () { return this._worldPos; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapSectionNode.prototype, "size", {
            get: function () { return this._data.length; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapSectionNode.prototype, "data", {
            get: function () { return this._data; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapSectionNode.prototype, "flipped", {
            get: function () { return this._flipped; },
            enumerable: true,
            configurable: true
        });
        MapSectionNode.prototype.init = function (prev, data, flipped) {
            this._next = null;
            this._prev = prev;
            if (prev != null) {
                prev._next = this;
                this._worldPos = prev._worldPos + prev.size;
            }
            else {
                this._worldPos = 0;
            }
            this._data = data;
            this._flipped = flipped;
        };
        return MapSectionNode;
    }());
    Playfield.MapSectionNode = MapSectionNode;
})(Playfield || (Playfield = {}));
var RoboJump;
(function (RoboJump) {
    var ReviveScreen = (function () {
        function ReviveScreen() {
            var add = RoboJump.Global.game.add;
            var atlasKey = "atlas0";
            this._layer = add.group();
            this._layer.fixedToCamera = true;
            this._bg = add.graphics(0, 0, this._layer);
            this._cubeLayer = add.group(this._layer);
            this._btnNo = new Controls.Button(0, new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState(atlasKey, "continueBtnNo_0"),
                new Controls.ButtonState(atlasKey, "continueBtnNo_1"),
                new Controls.ButtonState(atlasKey, "continueBtnNo_0")
            ], new Phaser.Point(0, 0), this._cubeLayer), 0, 194, null, false);
            this._btnNo.onClick.add(this.handleButtonClick, this);
            this._btnYes = new Controls.Button(1, new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState(atlasKey, "continueBtnYes_0"),
                new Controls.ButtonState(atlasKey, "continueBtnYes_1"),
                new Controls.ButtonState(atlasKey, "continueBtnYes_0")
            ], new Phaser.Point(0, 0), this._cubeLayer), 265, 194, null, false);
            this._btnYes.onClick.add(this.handleButtonClick, this);
            add.image(0, 0, atlasKey, "continueCubeTop", this._cubeLayer);
            this._onComplete = new Phaser.Signal();
        }
        Object.defineProperty(ReviveScreen.prototype, "onComplete", {
            get: function () { return this._onComplete; },
            enumerable: true,
            configurable: true
        });
        ReviveScreen.prototype.reset = function () {
            this._layer.visible = this._layer.exists = false;
            this._btnNo.enabled = false;
            this._btnYes.enabled = false;
        };
        ReviveScreen.prototype.show = function () {
            var _this = this;
            var camera = RoboJump.Global.game.camera;
            this._layer.visible = this._layer.exists = true;
            this._bg.alpha = 0;
            this._cubeLayer.x = -this._cubeLayer.width;
            this._cubeLayer.alpha = 1;
            this._layer.parent.bringToTop(this._layer);
            this.handleScreenResize(camera.width, camera.height);
            RoboJump.Global.game.tweens.create(this._bg).to({ alpha: 0.8 }, 750, Phaser.Easing.Cubic.Out, true);
            RoboJump.Global.game.tweens.create(this._cubeLayer).to({ alpha: 1, x: (camera.width - this._cubeLayer.width) >> 1 }, 1000, Phaser.Easing.Cubic.Out, true).onComplete.addOnce(function () {
                _this._btnNo.enabled = true;
                _this._btnYes.enabled = true;
            }, this);
        };
        ReviveScreen.prototype.handleScreenResize = function (w, h) {
            if (!this._layer.visible)
                return;
            this._bg.clear();
            this._bg.beginFill(0, 1);
            this._bg.drawRect(0, 0, w, h);
            this._bg.endFill();
            this._cubeLayer.y = (h - this._cubeLayer.height) >> 1;
        };
        ReviveScreen.prototype.handleButtonClick = function (button) {
            var _this = this;
            this._btnNo.enabled = false;
            this._btnYes.enabled = false;
            Utils.AudioUtils.playSound("click");
            switch (button.id) {
                case 0: {
                    this._onComplete.dispatch(false);
                    break;
                }
                case 1: {
                    if (Gamee2.Gamee.adState == Gamee2.eAdState.ready) {
                        Gamee2.Gamee.showAd(function (res) {
                            if (res) {
                                _this._onComplete.dispatch(true);
                            }
                            else {
                                _this._onComplete.dispatch(false);
                            }
                        }, this);
                    }
                    else {
                        this._onComplete.dispatch(true);
                    }
                    break;
                }
            }
        };
        return ReviveScreen;
    }());
    RoboJump.ReviveScreen = ReviveScreen;
})(RoboJump || (RoboJump = {}));
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
var RoboJump;
(function (RoboJump) {
    var TutorialJumpArrow = (function (_super) {
        __extends(TutorialJumpArrow, _super);
        function TutorialJumpArrow() {
            return _super.call(this, RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "tutorArrow") || this;
        }
        TutorialJumpArrow.prototype.update = function () {
            this.position.y = Characters.Player.instance.y - RoboJump.Global.game.camera.y + 10;
        };
        return TutorialJumpArrow;
    }(Phaser.Image));
    var Tutorial = (function () {
        function Tutorial() {
            this._touchFxTweenScalePars = { x: 2, y: 2 };
            this._touchFxTweenAlphaPars = { alpha: 0 };
            var game = RoboJump.Global.game;
            this._layer = new Phaser.Group(game);
            this._layer.fixedToCamera = true;
            this._imgLine = game.add.image(RoboJump.Global.GAME_MAX_WIDTH / 2, 0, RoboJump.Global.ATLAS_KEY_0, "tutorLine", this._layer);
            this._imgLine.anchor.x = 0.5;
            this._imgLHand = game.add.image(Tutorial.HAND_X_OFFSET, 0, RoboJump.Global.ATLAS_KEY_0, "tutorHand", this._layer);
            this._imgLHand.scale.x = -1;
            this._imgLHand.anchor.set(0.5, 1);
            this._imgRHand = game.add.image(RoboJump.Global.GAME_MAX_WIDTH - Tutorial.HAND_X_OFFSET, 0, RoboJump.Global.ATLAS_KEY_0, "tutorHand", this._layer);
            this._imgRHand.anchor.set(0.5, 1);
            this._imgTouchFx = game.add.image(0, 0, RoboJump.Global.ATLAS_KEY_0, "tutorTouchFx", this._layer);
            this._imgTouchFx.anchor.set(0.5);
            this._imgJumpArrow = new TutorialJumpArrow();
            this._layer.add(this._imgJumpArrow);
        }
        Object.defineProperty(Tutorial.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            enumerable: true,
            configurable: true
        });
        Tutorial.prototype.show = function () {
            RoboJump.Global.game.world.add(this._layer);
            this.reposition();
            this._showJumpLeft = false;
            this._visible = true;
            this.showJump();
        };
        Tutorial.prototype.hide = function () {
            if (this._jumpArrowTimer != undefined) {
                RoboJump.Global.game.time.events.remove(this._jumpArrowTimer);
                this._jumpArrowTimer = undefined;
            }
            RoboJump.Global.game.tweens.removeFrom(this._imgTouchFx);
            var parent = this._layer.parent;
            if (parent != undefined && parent != null)
                parent.removeChild(this._layer);
            this._visible = false;
        };
        Tutorial.prototype.reposition = function () {
            var camera = RoboJump.Global.game.camera;
            this._imgLHand.y = this._imgRHand.y = camera.height - Tutorial.HAND_Y_OFFSET;
            this._imgTouchFx.y = camera.height - Tutorial.TOUCH_FX_Y_OFFSET;
            this._imgLine.height = camera.height;
        };
        Tutorial.prototype.showJump = function () {
            if ((this._showJumpLeft = !this._showJumpLeft)) {
                this._imgTouchFx.x = Tutorial.TOUCH_FX_X_OFFSET;
                this._imgJumpArrow.scale.x = -1;
                this._imgJumpArrow.x = Characters.Player.instance.x - Tutorial.JUMP_ARROW_X_OFFSET;
            }
            else {
                this._imgJumpArrow.scale.x = 1;
                this._imgTouchFx.x = RoboJump.Global.GAME_MAX_WIDTH - Tutorial.TOUCH_FX_X_OFFSET;
                this._imgJumpArrow.x = Characters.Player.instance.x + Tutorial.JUMP_ARROW_X_OFFSET;
            }
            this._imgTouchFx.scale.set(1);
            this._imgTouchFx.alpha = 1;
            var tween = RoboJump.Global.game.add.tween(this._imgTouchFx.scale).to(this._touchFxTweenScalePars, 750, Phaser.Easing.Cubic.Out, true, 0, 2);
            tween.onRepeat.add(function () {
                this._imgTouchFx.scale.set(1);
                this._imgTouchFx.alpha = 1;
                this.showJumpArrow();
            }, this);
            tween.onComplete.add(function () {
                this.showJump();
            }, this);
            RoboJump.Global.game.add.tween(this._imgTouchFx).to(this._touchFxTweenAlphaPars, 750, Phaser.Easing.Cubic.Out, true, 0, 2);
            this.showJumpArrow();
        };
        Tutorial.prototype.showJumpArrow = function () {
            if (this._jumpArrowTimer != undefined) {
                RoboJump.Global.game.time.events.remove(this._jumpArrowTimer);
                this._jumpArrowTimer = undefined;
            }
            this._imgJumpArrow.visible = true;
            this._jumpArrowTimer = RoboJump.Global.game.time.events.add(500, function () {
                this._imgJumpArrow.visible = false;
                this._jumpArrowTimer = undefined;
            }, this);
        };
        Tutorial.HAND_X_OFFSET = 100;
        Tutorial.HAND_Y_OFFSET = 50;
        Tutorial.TOUCH_FX_X_OFFSET = 120;
        Tutorial.TOUCH_FX_Y_OFFSET = 215;
        Tutorial.JUMP_ARROW_X_OFFSET = 30;
        return Tutorial;
    }());
    RoboJump.Tutorial = Tutorial;
})(RoboJump || (RoboJump = {}));
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
                if (AudioUtils._musicOn != on) {
                    if (on) {
                        AudioUtils.resumeMusic();
                    }
                    else {
                        AudioUtils.pauseMusic();
                    }
                    AudioUtils._musicOn = on;
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
        AudioUtils.playSound = function (key, volume, loop) {
            if (volume === void 0) { volume = 1.0; }
            if (loop === void 0) { loop = false; }
            if (!AudioUtils._sfxOn)
                return;
            if (AudioUtils._sfxAudioSprite != null) {
                AudioUtils._sfxAudioSprite.play(key, volume).loop = loop;
            }
            else {
                var sound = AudioUtils._sfxSounds[key];
                if (sound != undefined)
                    sound.play("", 0, volume, loop);
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
        AudioUtils.playMusic = function (key, loop, fadeIntDuration) {
            if (loop === void 0) { loop = true; }
            if (fadeIntDuration === void 0) { fadeIntDuration = 0; }
            if (!AudioUtils._musicOn || AudioUtils._currentMusic == key)
                return;
            if (AudioUtils.isMusicPlaying)
                AudioUtils.stopMusic();
            if (!(key in AudioUtils._music))
                return;
            AudioUtils._currentMusic = key;
            var music = AudioUtils._music[key];
            if (fadeIntDuration <= 0) {
                music.play("", 0, 1, loop, true);
            }
            else {
                music.fadeIn(fadeIntDuration, true);
            }
            if (!loop) {
                music.onStop.addOnce(function () {
                    AudioUtils.onMusicFinished.dispatch(key);
                }, this);
            }
        };
        AudioUtils.stopMusic = function (fadeOutDuration) {
            if (fadeOutDuration === void 0) { fadeOutDuration = 0; }
            if (AudioUtils.isMusicPlaying) {
                var music_1 = AudioUtils._music[AudioUtils._currentMusic];
                if (fadeOutDuration > 0) {
                    music_1.onFadeComplete.addOnce(function () {
                        music_1.stop();
                    });
                    music_1.fadeOut(fadeOutDuration);
                }
                else {
                    music_1.stop();
                }
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
var Playfield;
(function (Playfield_1) {
    var ePlayfieldLayer;
    (function (ePlayfieldLayer) {
        ePlayfieldLayer[ePlayfieldLayer["cells"] = 0] = "cells";
        ePlayfieldLayer[ePlayfieldLayer["characters"] = 1] = "characters";
        ePlayfieldLayer[ePlayfieldLayer["effects"] = 2] = "effects";
    })(ePlayfieldLayer = Playfield_1.ePlayfieldLayer || (Playfield_1.ePlayfieldLayer = {}));
    var Playfield = (function () {
        function Playfield() {
            this._blockPool = [];
            this._bonusPool = [];
            this._displayLayer = [];
            Playfield._instance = this;
            var simpleBlockPool = new Utils.Pool(Blocks.SimpleBlock);
            this._blockPool[Blocks.eBlockType.empty1] = simpleBlockPool;
            this._blockPool[Blocks.eBlockType.full] = simpleBlockPool;
            this._blockPool[Blocks.eBlockType.explosive] = new Utils.Pool(Blocks.ExplosiveBlock);
            this._blockPool[Blocks.eBlockType.trap] = new Utils.Pool(Blocks.TrapBlock);
            this._blockPool[Blocks.eBlockType.flipDir] = simpleBlockPool;
            this._blockPool[Blocks.eBlockType.belt] = new Utils.Pool(Blocks.BeltBlock);
            this._blockPool[Blocks.eBlockType.monsterRoad] = new Utils.Pool(Blocks.MonsterRoadBlock);
            this._blockPool[Blocks.eBlockType.unstable] = new Utils.Pool(Blocks.UnstableBlock);
            this._blockPool[Blocks.eBlockType.sticky] = simpleBlockPool;
            this._blockPool[Blocks.eBlockType.portal] = new Utils.Pool(Blocks.PortalBlock);
            this._blockPool[Blocks.eBlockType.spikes] = new Utils.Pool(Blocks.SpikyBlock);
            this._blockPool[Blocks.eBlockType.poison] = new Utils.Pool(Blocks.PoisonBlock);
            this._blockPool[Blocks.eBlockType.versionSwitch] = simpleBlockPool;
            this._blockPool[Blocks.eBlockType.catapult] = new Utils.Pool(Blocks.CatapultBlock);
            this._blockPool[Blocks.eBlockType.empty2] = simpleBlockPool;
            this._blockPool[Blocks.eBlockType.gate] = new Utils.Pool(Blocks.GateBlock);
            this._bonusPool.push(new Utils.Pool(Bonuses.ScoreBonus));
            this._bonusPool.push(new Utils.Pool(Bonuses.Potion));
            this._bonusPickupFxPool = new Utils.Pool(Bonuses.BonusPickupFx);
            this._blockExplosionPool = new Utils.Pool(Blocks.BlockExplosion);
            this._blockSpikesPool = new Utils.Pool(Blocks.SpikyBlockSpikes, 10);
            this._spikyBlockGroups = [new Blocks.SpikyBlockGroup(0), new Blocks.SpikyBlockGroup(1)];
            this._enemyPool = new Utils.Pool(Characters.Enemy);
            this._enemyList = new Collections.LinkedList();
            this._mapRows = new Playfield_1.RowPool(Math.ceil(RoboJump.Global.game.camera.height / Playfield.CELL_HEIGHT) + 1, Playfield_1.MapRow);
            this._mapGenerator = new Playfield_1.MapGenerator(this._mapRows);
            this._displayLayer.push(RoboJump.Global.game.add.group());
            this._displayLayer.push(RoboJump.Global.game.add.group());
            this._displayLayer.push(RoboJump.Global.game.add.group());
            this._openTrapBack = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloTrapOpenB");
            this._openTrapBack.exists = false;
            this._openTrapFront = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloTrapOpenF");
            this._openTrapFront.exists = false;
            this._checkpoint = new Playfield_1.Checkpoint();
        }
        Object.defineProperty(Playfield, "instance", {
            get: function () { return Playfield._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "blockSpikesPool", {
            get: function () { return this._blockSpikesPool; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "mapGenerator", {
            get: function () { return this._mapGenerator; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "checkpoint", {
            get: function () { return this._checkpoint; },
            enumerable: true,
            configurable: true
        });
        Playfield.prototype.reset = function (restartFromCP) {
            if (this._openTrapBack.exists) {
                var layer = this._displayLayer[ePlayfieldLayer.cells];
                layer.remove(this._openTrapBack);
                layer.remove(this._openTrapFront);
                this._openTrapBack.exists = false;
                this._openTrapFront.exists = false;
            }
            while (!this._enemyList.isEmpty()) {
                this.deactivateEnemy(this._enemyList.elementAtIndex(0));
            }
            for (var i = 0; i < 2; i++)
                this._spikyBlockGroups[i].reset();
            var rowCnt = this._mapRows.activeRowCnt;
            for (var rowId = 0; rowId < rowCnt; rowId++) {
                this._mapRows.getRow(rowId).reset();
            }
            this._mapRows.reset();
            if (!restartFromCP)
                this._checkpoint.reset();
            this._mapFirstRowId = this._checkpoint.row;
            this._mapLastRowId = this._mapFirstRowId - 1;
            this._mapFirstRowY = Playfield.FIRST_ROW_Y + this._mapFirstRowId * Playfield.CELL_HEIGHT;
            this._mapLastRowY = this._mapFirstRowY - Playfield.CELL_HEIGHT;
            if (!restartFromCP) {
                this._mapGenerator.reset();
            }
            else {
                this._mapGenerator.restart(this._checkpoint.row);
            }
            this.refillMapRows();
        };
        Playfield.prototype.update = function () {
            var i = 2;
            while (i-- != 0)
                this._spikyBlockGroups[i].update();
            var camera = RoboJump.Global.game.camera;
            var cameraPos = camera.y;
            var rowId = 0;
            var rowY = this._mapFirstRowY;
            while (cameraPos + (camera.height - RoboJump.ViewController.PLAYER_BOTTOM_MAX_OFFSET - Playfield.CELL_HEIGHT * 2) >= rowY) {
                var mapRow = this._mapRows.getRow(rowId);
                if (!mapRow.isCollapsing) {
                    mapRow.collapse();
                    break;
                }
                rowId++;
                rowY += Playfield.CELL_HEIGHT;
            }
            this.refillMapRows();
            while (this._mapRows.getRow(0).actCellCnt == 0) {
                this._mapRows.moveCursor().reset();
                this._mapFirstRowId++;
                this._mapFirstRowY += Playfield.CELL_HEIGHT;
            }
        };
        Playfield.prototype.mapRow = function (row) {
            if (row < this._mapFirstRowId || row >= this._mapFirstRowId + this._mapRows.activeRowCnt)
                return undefined;
            return this._mapRows.getRow(row - this._mapFirstRowId);
        };
        Playfield.prototype.mapCell = function (col, row) {
            var mapRow = this.mapRow(row);
            if (mapRow == undefined)
                return undefined;
            if (col < 0 || col >= mapRow.size)
                return undefined;
            return mapRow.cell(col);
        };
        Playfield.prototype.getMapCellX = function (col, row) {
            var x = Playfield.X + col * Playfield.CELL_WIDTH;
            if ((row & 1) != 0)
                x += Playfield.CELL_WIDTH / 2;
            return x;
        };
        Playfield.prototype.getMapCellY = function (row) {
            return Playfield.FIRST_ROW_Y + (row * Playfield.CELL_HEIGHT);
        };
        Playfield.prototype.getCellNeighbor = function (cell, left, up) {
            var cellRow = cell.row;
            var neighborCol = cell.col;
            var neighborRow = this.mapRow(cellRow + (up ? -1 : 1));
            if (neighborRow == undefined)
                return null;
            if ((neighborRow.rowId & 1) == 0) {
                if (!left)
                    neighborCol++;
            }
            else if (left) {
                neighborCol--;
            }
            if (neighborCol < 0 || neighborCol >= neighborRow.size)
                return null;
            return neighborRow.cell(neighborCol);
        };
        Playfield.prototype.blockPool = function (blockType) {
            return this._blockPool[blockType];
        };
        Playfield.prototype.bonusPool = function (bonusType) {
            return this._bonusPool[bonusType];
        };
        Object.defineProperty(Playfield.prototype, "bonusPickupFxPool", {
            get: function () {
                return this._bonusPickupFxPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playfield.prototype, "blockExplosionPool", {
            get: function () {
                return this._blockExplosionPool;
            },
            enumerable: true,
            configurable: true
        });
        Playfield.prototype.spikyBlockGroup = function (groupId) {
            return this._spikyBlockGroups[groupId];
        };
        Playfield.prototype.displayLayer = function (layer) {
            return this._displayLayer[layer];
        };
        Playfield.prototype.activateTrap = function (cell) {
            var index = cell.block.getLayerIndex();
            cell.deactivate();
            var layer = this._displayLayer[ePlayfieldLayer.cells];
            var cellX = cell.x;
            var cellY = cell.y;
            var img = this._openTrapBack;
            img.exists = true;
            img.position.set(cellX, cellY);
            layer.addAt(img, index);
            img = this._openTrapFront;
            img.exists = true;
            img.position.set(cellX, cellY);
            layer.addAt(img, index + 1);
            return index + 1;
        };
        Playfield.prototype.activateEnemy = function (cell, actPar) {
            var enemy = this._enemyPool.getItem();
            enemy.activateEnemy(cell, actPar);
            this._enemyList.add(enemy);
        };
        Playfield.prototype.deactivateEnemy = function (enemy) {
            enemy.deactivate();
            this._enemyList.remove(enemy);
            this._enemyPool.returnItem(enemy);
        };
        Playfield.prototype.moveToLayer = function (object, layer, pos) {
            var l = this._displayLayer[layer];
            if (object.parent == l)
                return;
            object.parent.removeChild(object);
            if (pos != undefined) {
                l.addAt(object, pos, true);
            }
            else {
                l.add(object, true);
            }
        };
        Playfield.prototype.refillMapRows = function () {
            var camera = RoboJump.Global.game.camera;
            var cameraPos = camera.y + camera.height;
            while (cameraPos > this._mapLastRowY + Playfield.NEW_ROW_ACTIVATION_OFFSET) {
                this.showNewMapRow();
            }
        };
        Playfield.prototype.showNewMapRow = function () {
            var mapRowId = ++this._mapLastRowId - this._mapFirstRowId;
            if (this._mapRows.activeRowCnt <= mapRowId)
                this._mapGenerator.addNewSection(this._mapFirstRowId + this._mapRows.activeRowCnt);
            this._mapRows.getRow(mapRowId).activate();
            this._mapLastRowY += Playfield.CELL_HEIGHT;
        };
        Playfield.CELL_WIDTH = 120;
        Playfield.CELL_HEIGHT = 103;
        Playfield.CELL_CENTER_X = 60;
        Playfield.CELL_CENTER_Y = 34;
        Playfield.MAP_WIDTH = 5;
        Playfield.X = 20;
        Playfield.FIRST_ROW_Y = 250;
        Playfield.NEW_ROW_ACTIVATION_OFFSET = 58;
        return Playfield;
    }());
    Playfield_1.Playfield = Playfield;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var RowPool = (function () {
        function RowPool(poolMinSize, poolItemType) {
            this._pool = [];
            var i = poolMinSize;
            while (i-- != 0)
                this._pool.push(new poolItemType());
            this._poolItemType = poolItemType;
            this.reset();
        }
        Object.defineProperty(RowPool.prototype, "activeRowCnt", {
            get: function () {
                if (this._poolCursorFRow < 0)
                    return 0;
                if (this._poolCursorFRow <= this._poolCursorLRow) {
                    return (this._poolCursorLRow - this._poolCursorFRow) + 1;
                }
                else {
                    return (this._pool.length - this._poolCursorFRow) + this._poolCursorLRow + 1;
                }
            },
            enumerable: true,
            configurable: true
        });
        RowPool.prototype.reset = function () {
            this._poolCursorFRow = -1;
        };
        RowPool.prototype.moveCursor = function () {
            if (this._poolCursorFRow < 0)
                return null;
            var firstRow = this._pool[this._poolCursorFRow];
            var actRowCnt = this.activeRowCnt;
            var cursorFRow = this._poolCursorFRow + 1;
            if (cursorFRow == this._pool.length) {
                cursorFRow = 0;
            }
            this._poolCursorFRow = cursorFRow;
            if (actRowCnt - 1 == 0)
                this._poolCursorLRow = cursorFRow;
            return firstRow;
        };
        RowPool.prototype.activateNewRow = function () {
            if (this.activeRowCnt == this._pool.length) {
                this.ensureCapacity(this._pool.length + 1);
            }
            if (this._poolCursorFRow < 0) {
                this._poolCursorFRow = 0;
                this._poolCursorLRow = 0;
            }
            else if (++this._poolCursorLRow == this._pool.length) {
                this._poolCursorLRow = 0;
            }
            return this._pool[this._poolCursorLRow];
        };
        RowPool.prototype.getRow = function (rowId) {
            if (rowId < 0 || rowId >= this.activeRowCnt)
                return null;
            rowId = this._poolCursorFRow + rowId;
            if (this._poolCursorFRow > this._poolCursorLRow && rowId >= this._pool.length)
                rowId -= this._pool.length;
            return this._pool[rowId];
        };
        RowPool.prototype.ensureCapacity = function (rowCnt) {
            var curRowCnt = this._pool.length;
            if (rowCnt <= curRowCnt)
                return;
            var pool = this._pool;
            var newItemCnt = rowCnt - curRowCnt;
            if (this._poolCursorFRow >= 0 && this._poolCursorFRow > this._poolCursorLRow) {
                var i = void 0;
                var cnt = Math.min(newItemCnt, this._poolCursorLRow + 1);
                for (i = 0; i < cnt; i++)
                    pool.push(pool[i]);
                if (cnt < newItemCnt) {
                    this._poolCursorLRow = pool.length - 1;
                    for (i = cnt; i < newItemCnt; i++)
                        pool.push(new this._poolItemType());
                    for (i = 0; i < cnt; i++)
                        pool[i] = new this._poolItemType();
                }
                else {
                    var cursorLRow = this._poolCursorLRow;
                    if (cnt <= this._poolCursorLRow) {
                        i = 0;
                        while (cnt <= cursorLRow)
                            pool[i++] = pool[cnt++];
                        this._poolCursorLRow = i - 1;
                    }
                    else {
                        this._poolCursorLRow = pool.length - 1;
                        i = 0;
                    }
                    while (i <= cursorLRow)
                        pool[i++] = new this._poolItemType();
                }
            }
            else {
                while (newItemCnt-- != 0)
                    pool.push(new this._poolItemType());
            }
        };
        return RowPool;
    }());
    Playfield.RowPool = RowPool;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var MapCellContent = (function () {
        function MapCellContent() {
        }
        Object.defineProperty(MapCellContent.prototype, "cell", {
            get: function () {
                return this._cell;
            },
            enumerable: true,
            configurable: true
        });
        MapCellContent.prototype.activate = function (cell) {
            this._cell = cell;
            cell.addContent(this);
        };
        MapCellContent.prototype.deactivate = function () {
            this._cell.removeContent(this);
            this._cell = undefined;
        };
        MapCellContent.prototype.update = function () {
        };
        MapCellContent.collapseObject = function (object, changeAlpha) {
            if (changeAlpha) {
                return RoboJump.Global.game.add.tween(object).to({ y: object.y + 200, alpha: 0 }, 600, Phaser.Easing.Quadratic.In, true);
            }
            return RoboJump.Global.game.add.tween(object).to({ y: object.y + 200 }, 600, Phaser.Easing.Quadratic.In, true);
        };
        return MapCellContent;
    }());
    Playfield.MapCellContent = MapCellContent;
    var MapCellUpdatableContentImage = (function (_super) {
        __extends(MapCellUpdatableContentImage, _super);
        function MapCellUpdatableContentImage(owner, atlasKey, frameKey) {
            var _this = _super.call(this, RoboJump.Global.game, 0, 0, atlasKey, frameKey) || this;
            _this._owner = owner;
            return _this;
        }
        MapCellUpdatableContentImage.prototype.update = function () {
            _super.prototype.update.call(this);
            this._owner.update();
        };
        return MapCellUpdatableContentImage;
    }(Phaser.Image));
    Playfield.MapCellUpdatableContentImage = MapCellUpdatableContentImage;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var MapCell = (function () {
        function MapCell(col, row) {
            this._flags = 0;
            this._col = col;
            this._row = row;
            this._block = null;
            this._bonus = null;
            this._otherContent = new Collections.LinkedList();
        }
        Object.defineProperty(MapCell.prototype, "blockType", {
            get: function () {
                return this._blockType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "blockCustomData", {
            get: function () {
                return this._blockCustomData;
            },
            set: function (data) {
                this._blockCustomData = data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "activated", {
            get: function () {
                return (this._flags & MapCell.FLAG_ACTIVATED) != 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "active", {
            get: function () {
                return (this._block != null);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "collapsing", {
            get: function () {
                return (this._flags & MapCell.FLAG_COLLAPSING) != 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "block", {
            get: function () {
                return this._block;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "bonus", {
            get: function () {
                return this._bonus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "row", {
            get: function () {
                return this._row.rowId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "col", {
            get: function () {
                return this._col;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "x", {
            get: function () {
                var x = Playfield.Playfield.X + (this._col * Playfield.Playfield.CELL_WIDTH);
                if ((this._row.rowId & 1) != 0)
                    x += Playfield.Playfield.CELL_WIDTH / 2;
                return x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCell.prototype, "y", {
            get: function () {
                return Playfield.Playfield.FIRST_ROW_Y + (this._row.rowId * Playfield.Playfield.CELL_HEIGHT);
            },
            enumerable: true,
            configurable: true
        });
        MapCell.prototype.setup = function (blockType, blockCustomData, bonusType) {
            this._flags = 0;
            this._blockType = blockType;
            this._blockCustomData = blockCustomData;
            this._bonusType = bonusType;
            this._block = null;
            this._bonus = null;
            this.character = undefined;
        };
        MapCell.prototype.activate = function () {
            this._flags |= MapCell.FLAG_ACTIVATED;
            this._block = Playfield.Playfield.instance.blockPool(this._blockType).getItem();
            this._block.activateBlock(this, this._blockType);
            if (this._bonusType != Bonuses.eBonusType.none) {
                this._bonus = Playfield.Playfield.instance.bonusPool(this._bonusType).getItem();
                this._bonus.activate(this);
            }
            this._row.actCellCnt++;
        };
        MapCell.prototype.deactivate = function () {
            if (this._block != null) {
                if (this._bonus != null)
                    this._bonus.deactivate();
                this.character = undefined;
                var otherContent = this._otherContent;
                while (!otherContent.isEmpty)
                    this._otherContent.elementAtIndex(0).deactivate();
                this._block.deactivate();
            }
        };
        MapCell.prototype.removeBlock = function () {
            this._block = null;
            this._row.actCellCnt--;
        };
        MapCell.prototype.removeBonus = function () {
            this._bonus = null;
        };
        MapCell.prototype.addContent = function (content) {
            this._otherContent.add(content);
        };
        MapCell.prototype.removeContent = function (content) {
            this._otherContent.remove(content);
        };
        MapCell.prototype.collapse = function (delay) {
            if (this._block != null) {
                if (delay == undefined)
                    delay = RoboJump.Global.game.rnd.integerInRange(0, 250);
                if (delay != 0) {
                    RoboJump.Global.game.time.events.add(delay, this.startCollapsing, this);
                }
                else {
                    this.startCollapsing();
                }
            }
        };
        MapCell.prototype.startCollapsing = function () {
            if (this._block != null) {
                this._block.collapse();
                if (this._bonus != null)
                    this._bonus.collapse();
                if (this.character != undefined)
                    this.character.collapse();
                this._flags |= MapCell.FLAG_COLLAPSING;
            }
        };
        MapCell.FLAG_ACTIVATED = 0x0001;
        MapCell.FLAG_COLLAPSING = 0x0002;
        return MapCell;
    }());
    Playfield.MapCell = MapCell;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var MapRow = (function () {
        function MapRow() {
            this._flags = 0;
            this.actCellCnt = 0;
            var cells = [];
            for (var col = 0; col < Playfield.Playfield.MAP_WIDTH; col++)
                cells.push(new Playfield.MapCell(col, this));
            this._cells = cells;
        }
        Object.defineProperty(MapRow.prototype, "isCollapsing", {
            get: function () {
                return (this._flags & MapRow.FLAG_COLLAPSING) != 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapRow.prototype, "rowId", {
            get: function () {
                return this._rowId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapRow.prototype, "size", {
            get: function () {
                return (this._rowId & 1) == 0 ? Playfield.Playfield.MAP_WIDTH : Playfield.Playfield.MAP_WIDTH - 1;
            },
            enumerable: true,
            configurable: true
        });
        MapRow.prototype.reset = function () {
            this._flags = 0;
            if (this.actCellCnt != 0) {
                for (var col = 0; col < Playfield.Playfield.MAP_WIDTH; col++) {
                    this._cells[col].deactivate();
                }
            }
        };
        MapRow.prototype.cell = function (col) {
            return this._cells[col];
        };
        MapRow.prototype.setRowId = function (rowId) {
            this._rowId = rowId;
        };
        MapRow.prototype.activate = function () {
            var col = Playfield.Playfield.MAP_WIDTH;
            if ((this._rowId & 1) != 0) {
                col--;
            }
            while (col-- != 0) {
                this._cells[col].activate();
            }
        };
        MapRow.prototype.collapse = function () {
            if (!this.isCollapsing) {
                this._flags |= MapRow.FLAG_COLLAPSING;
                for (var col = 0; col < Playfield.Playfield.MAP_WIDTH; col++) {
                    this._cells[col].collapse();
                }
            }
        };
        MapRow.FLAG_COLLAPSING = 1;
        return MapRow;
    }());
    Playfield.MapRow = MapRow;
})(Playfield || (Playfield = {}));
var Playfield;
(function (Playfield) {
    var MapGenerator = (function () {
        function MapGenerator(mapRows) {
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.empty1);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.full);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.explosive);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.trap);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.trap);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.belt);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.belt);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.flipDir);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.monsterRoad);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.monsterRoad);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.monsterRoad);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.monsterRoad);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.monsterRoad);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.monsterRoad);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.unstable);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.sticky);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.portal);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.portal);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.spikes);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.poison);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.versionSwitch);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.catapult);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.empty2);
            MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.push(Blocks.eBlockType.gate);
            var blockCnt = MapGenerator.BLOCK_ID_TO_BLOCK_TYPE.length;
            for (var i = 0; i < blockCnt; i++) {
                MapGenerator.BLOCK_ID_TO_FLIPPED_ID.push(i);
            }
            MapGenerator.BLOCK_ID_TO_FLIPPED_ID[5] = 6;
            MapGenerator.BLOCK_ID_TO_FLIPPED_ID[6] = 5;
            MapGenerator.BLOCK_ID_TO_FLIPPED_ID[8] = 9;
            MapGenerator.BLOCK_ID_TO_FLIPPED_ID[9] = 8;
            MapGenerator.BLOCK_ID_TO_FLIPPED_ID[10] = 11;
            MapGenerator.BLOCK_ID_TO_FLIPPED_ID[11] = 10;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[0] = 0x01;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[1] = 0x10;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[2] = 0x02;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[3] = 0x20;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[4] = 0x04;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[5] = 0x40;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[6] = 0x06;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[7] = 0x42;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[8] = 0x24;
            MapGenerator.OBJECT_ID_TO_SPIKE_MASK[9] = 0x60;
            this._curDifSections = new Collections.LinkedList();
            MapGenerator.BLOCK_ID_CUSTOM_DATA[3] = false;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[4] = true;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[5] = true;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[6] = false;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[8] = Blocks.eMonsterRoadBlockType.left;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[9] = Blocks.eMonsterRoadBlockType.right;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[10] = Blocks.eMonsterRoadBlockType.connectLeft;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[11] = Blocks.eMonsterRoadBlockType.connectRight;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[12] = Blocks.eMonsterRoadBlockType.connectTop;
            MapGenerator.BLOCK_ID_CUSTOM_DATA[13] = Blocks.eMonsterRoadBlockType.connectBot;
            this._sectioNodesPool = new Utils.Pool(Playfield.MapSectionNode, 2, true);
            this._fSectionNode = null;
            this._mapRows = mapRows;
            var game = RoboJump.Global.game;
            var mapId = 0;
            var totalRowCnt = 0;
            while (true) {
                var tmKey = "map_" + mapId;
                if (!game.cache.checkJSONKey(tmKey))
                    break;
                var tiledMap = RoboJump.Global.game.cache.getJSON(tmKey, false);
                var tmLayer0Data = tiledMap.layers[0].data;
                var tmLayer1Data = tiledMap.layers[1].data;
                var tmLayerPos = 0;
                var tmRowId = 0;
                var sections = [];
                MapGenerator.SECTIONS[mapId] = sections;
                while (tmRowId < tiledMap.height) {
                    var section = [];
                    while (tmRowId < tiledMap.height) {
                        var rowSize = (tmRowId & 1) == 0 ? Playfield.Playfield.MAP_WIDTH : Playfield.Playfield.MAP_WIDTH - 1;
                        var rowData = [];
                        for (var colId = 0; colId < rowSize; colId++) {
                            var cell = tmLayer0Data[tmLayerPos + colId] - 1;
                            if (cell < 0)
                                break;
                            var cellExData = tmLayer1Data[tmLayerPos + colId];
                            if (cellExData >= 25) {
                                cell |= ((cellExData - 24) << 16);
                            }
                            rowData.push(cell);
                        }
                        if (rowData.length == 0)
                            break;
                        tmLayerPos += tiledMap.width;
                        tmRowId++;
                        section.push(rowData);
                        totalRowCnt++;
                    }
                    if ((tmRowId & 1) != 0) {
                        console.warn("Map section error! (map: " + mapId + " | row: " + (tmRowId - 1) + ")");
                        section.splice(section.length - 1);
                    }
                    if (section.length != 0)
                        sections.push(section);
                    while (tmRowId < tiledMap.height) {
                        if (tmLayer0Data[tmLayerPos] != 0) {
                            if ((tmRowId & 1) == 0)
                                break;
                            console.warn("Map section error! (map: " + mapId + " | row: " + tmRowId + ")");
                        }
                        tmRowId++;
                        tmLayerPos += tiledMap.width;
                    }
                }
                RoboJump.Global.game.cache.removeJSON("map_" + mapId);
                mapId++;
            }
            console.log("Total number of rows: " + totalRowCnt);
        }
        MapGenerator.prototype.reset = function () {
            var node = this._fSectionNode;
            while (node != null) {
                this._sectioNodesPool.returnItem(node);
                node = node.next;
            }
            this._fSectionNode = null;
            this._lSectionNode = null;
            this._curDifId = -1;
            this.nextDifficulty();
        };
        MapGenerator.prototype.restart = function (rowId) {
            var secNode = this._fSectionNode;
            while (rowId >= secNode.worldPos + secNode.size)
                secNode = secNode.next;
            var secRowId = rowId - secNode.worldPos;
            var portals = [];
            while (secRowId < secNode.size)
                this.addRow(secNode.data[secRowId++], rowId++, secNode.flipped, portals);
            secNode = secNode.next;
            while (secNode != null) {
                for (secRowId = 0; secRowId < secNode.size; secRowId++)
                    this.addRow(secNode.data[secRowId], rowId++, secNode.flipped, portals);
                secNode = secNode.next;
            }
        };
        MapGenerator.prototype.addNewSection = function (rowId) {
            var curDifSecs = this._curDifSections;
            if (curDifSecs.size() == 0)
                this.nextDifficulty();
            var i = RoboJump.Global.game.rnd.integerInRange(0, curDifSecs.size() - 1);
            var section = curDifSecs.elementAtIndex(i);
            var secSize = section.length;
            curDifSecs.removeElementAtIndex(i);
            var flip = (RoboJump.Global.game.rnd.integer() & 1) != 0;
            var sectionNode = this._sectioNodesPool.getItem();
            sectionNode.init(this._lSectionNode, section, flip);
            if (this._fSectionNode == null)
                this._fSectionNode = sectionNode;
            this._lSectionNode = sectionNode;
            var portals = [];
            for (i = 0; i < secSize; i++)
                this.addRow(section[i], rowId++, flip, portals);
        };
        MapGenerator.prototype.addRow = function (secRowData, worldRowId, flip, portals) {
            var row = this._mapRows.activateNewRow();
            var secRowSize = secRowData.length;
            var secColId = secRowSize;
            row.setRowId(worldRowId++);
            var _loop_1 = function () {
                var enemyActPar = void 0;
                var cell = row.cell(secColId);
                var blockId = secRowData[(flip ? secRowSize - secColId - 1 : secColId)];
                var bonusType = Bonuses.eBonusType.none;
                var blockCustomData = undefined;
                if ((blockId & 0xFFFF0000) != 0) {
                    switch ((blockId >> 16) - 1) {
                        case 0: {
                            bonusType = Bonuses.eBonusType.score;
                            break;
                        }
                        case 1: {
                            bonusType = Bonuses.eBonusType.potion;
                            break;
                        }
                        case 2: {
                            enemyActPar = 0;
                            break;
                        }
                        case 3: {
                            enemyActPar = 1;
                            break;
                        }
                        case 4:
                        case 5: {
                            blockCustomData = ((blockId >> 16) - 1) == 4;
                            if (flip)
                                blockCustomData = !blockCustomData;
                            blockId = 23;
                            break;
                        }
                        default: {
                            var mask = MapGenerator.OBJECT_ID_TO_SPIKE_MASK[(blockId >> 16) - 7];
                            if (flip) {
                                var newMask = (mask & 0x11);
                                if ((mask & 0x02) != 0) {
                                    newMask |= 0x04;
                                }
                                else if ((mask & 0x20) != 0) {
                                    newMask |= 0x40;
                                }
                                if ((mask & 0x04) != 0) {
                                    newMask |= 0x02;
                                }
                                else if ((mask & 0x40) != 0) {
                                    newMask |= 0x20;
                                }
                                mask = newMask;
                            }
                            blockCustomData = mask;
                            break;
                        }
                    }
                    blockId &= 0xFFFF;
                }
                if (flip)
                    blockId = MapGenerator.BLOCK_ID_TO_FLIPPED_ID[blockId];
                if (blockCustomData == undefined)
                    blockCustomData = MapGenerator.BLOCK_ID_CUSTOM_DATA[blockId];
                cell.setup(MapGenerator.BLOCK_ID_TO_BLOCK_TYPE[blockId], blockCustomData, bonusType);
                if (enemyActPar != undefined) {
                    Playfield.Playfield.instance.activateEnemy(cell, enemyActPar);
                }
                else if (blockId == 16) {
                    portals.push(cell);
                }
                else if (blockId == 17) {
                    portals.forEach(function (e) {
                        e.blockCustomData = cell;
                    });
                }
            };
            while (secColId-- != 0) {
                _loop_1();
            }
        };
        MapGenerator.prototype.nextDifficulty = function () {
            if (++this._curDifId >= MapGenerator.SECTIONS.length) {
                this._curDifId = 4;
                RoboJump.ViewController.instance.incrementSpeed();
            }
            var newDifSecs = MapGenerator.SECTIONS[this._curDifId];
            var curDifSecs = this._curDifSections;
            curDifSecs.clear();
            var i = newDifSecs.length;
            while (i-- != 0) {
                curDifSecs.add(newDifSecs[i]);
            }
        };
        MapGenerator.BLOCK_ID_TO_BLOCK_TYPE = [];
        MapGenerator.BLOCK_ID_TO_FLIPPED_ID = [];
        MapGenerator.OBJECT_ID_TO_SPIKE_MASK = [];
        MapGenerator.SECTIONS = [];
        MapGenerator.BLOCK_ID_CUSTOM_DATA = [];
        return MapGenerator;
    }());
    Playfield.MapGenerator = MapGenerator;
})(Playfield || (Playfield = {}));
var Characters;
(function (Characters) {
    var eCharacterDir;
    (function (eCharacterDir) {
        eCharacterDir[eCharacterDir["left"] = 1] = "left";
        eCharacterDir[eCharacterDir["right"] = -1] = "right";
        eCharacterDir[eCharacterDir["none"] = 0] = "none";
    })(eCharacterDir = Characters.eCharacterDir || (Characters.eCharacterDir = {}));
    var CharacterDisplayGroup = (function (_super) {
        __extends(CharacterDisplayGroup, _super);
        function CharacterDisplayGroup(character) {
            var _this = _super.call(this, RoboJump.Global.game) || this;
            _this._character = character;
            return _this;
        }
        Object.defineProperty(CharacterDisplayGroup.prototype, "character", {
            get: function () {
                return this._character;
            },
            enumerable: true,
            configurable: true
        });
        return CharacterDisplayGroup;
    }(Phaser.Group));
    var CharacterBase = (function (_super) {
        __extends(CharacterBase, _super);
        function CharacterBase() {
            var _this = _super.call(this) || this;
            _this._jumpTargetPos = new Phaser.Point();
            _this._displayGroup = new CharacterDisplayGroup(_this);
            return _this;
        }
        Object.defineProperty(CharacterBase.prototype, "onCell", {
            get: function () { return (this._flags & CharacterBase.FLAG_ON_CELL) != 0; },
            set: function (onCell) {
                if (onCell) {
                    this._flags |= CharacterBase.FLAG_ON_CELL;
                }
                else {
                    this._flags &= ~CharacterBase.FLAG_ON_CELL;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterBase.prototype, "collapsing", {
            get: function () { return (this._flags & CharacterBase.FLAG_COLLAPSING) != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterBase.prototype, "depth", {
            get: function () { return this._depth; },
            enumerable: true,
            configurable: true
        });
        CharacterBase.prototype.collapseCharacter = function (changeAlpha) {
            this._flags |= CharacterBase.FLAG_COLLAPSING;
            Playfield.MapCellContent.collapseObject(this._shadow, changeAlpha);
            Playfield.MapCellContent.collapseObject(this._sprite, changeAlpha).onComplete.add(function () {
                this.death();
            }, this);
            var cell = this._cell;
            Playfield.Playfield.instance.moveToLayer(this._displayGroup, Playfield.ePlayfieldLayer.cells, (cell.bonus != null ? cell.bonus : cell.block).getLayerIndex() + 1);
        };
        CharacterBase.prototype.getLayerIndex = function () {
            var layer = this._displayGroup.parent;
            if (layer != null)
                return layer.getIndex(this._displayGroup);
            return -1;
        };
        CharacterBase.prototype.instertToCharacterLayer = function () {
            var depth = (this._depth = this._cell.row);
            var layerPos = 0;
            var layer = Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.characters);
            var layerChildCnt = layer.total;
            if (this._displayGroup.parent != layer) {
                layer.cursorIndex = 0;
                while (layerPos < layerChildCnt && depth > layer.cursor.character._depth) {
                    layer.next();
                    layerPos++;
                }
            }
            layer.addAt(this._displayGroup, layerPos, true);
        };
        CharacterBase.prototype.setJumpTarget = function (jumpDown, jumpLeft, acceptUndefinedTarget) {
            if (acceptUndefinedTarget === void 0) { acceptUndefinedTarget = true; }
            var playfield = Playfield.Playfield.instance;
            var curCell = this._cell;
            var targetCellCol = curCell.col;
            var targetCellRow = curCell.row + (jumpDown ? 1 : -1);
            var targetRowSize;
            if ((targetCellRow & 1) != 0) {
                targetRowSize = Playfield.Playfield.MAP_WIDTH - 1;
                if (jumpLeft)
                    targetCellCol--;
            }
            else {
                targetRowSize = Playfield.Playfield.MAP_WIDTH;
                if (!jumpLeft)
                    targetCellCol++;
            }
            this._jumpTargetCell = playfield.mapCell(targetCellCol, targetCellRow);
            if (this._jumpTargetCell != undefined || acceptUndefinedTarget) {
                this._jumpTargetPos.x = playfield.getMapCellX(targetCellCol, targetCellRow) + Playfield.Playfield.CELL_CENTER_X;
                this._jumpTargetPos.y = playfield.getMapCellY(targetCellRow) + Playfield.Playfield.CELL_CENTER_Y;
                this._jumpStartCell = this._cell;
            }
        };
        CharacterBase.prototype.cancelJump = function () {
            RoboJump.Global.game.tweens.removeFrom(this._displayGroup, true);
            RoboJump.Global.game.tweens.removeFrom(this._shadow.scale);
        };
        CharacterBase.prototype.slideDown = function () {
            var game = RoboJump.Global.game;
            this.setJumpTarget(true, this._hDir == eCharacterDir.left);
            game.add.tween(this._sprite).to({ x: this._jumpTargetPos.x }, 300, Phaser.Easing.Linear.None, true).onUpdateCallback(this.jumpSpriteXChange, this);
            game.add.tween(this._shadow).to({ alpha: 0 }, 150, Phaser.Easing.Linear.None, true);
            var tweenY1 = game.add.tween(this._sprite).to({ y: this._jumpStartCell.y + Playfield.Playfield.CELL_CENTER_Y * 2 }, 300, Phaser.Easing.Linear.None, true);
            var tweenY2 = game.add.tween(this._sprite).to({ y: this._jumpTargetPos.y }, 150, Phaser.Easing.Quadratic.In);
            tweenY1.chain(tweenY2);
            tweenY1.onComplete.add(this.jumpMoveShadow, this, 0, this._shadow.scale.x > 0 ? 1 : -1);
            tweenY2.onComplete.add(this.jumpComplete, this);
            this.onCell = false;
        };
        CharacterBase.prototype.jumpOnPlace = function () {
            var game = RoboJump.Global.game;
            var startY = this._cell.y + Playfield.Playfield.CELL_CENTER_Y;
            var tweenFall = game.add.tween(this._sprite).to({ y: startY }, 150, Phaser.Easing.Cubic.In);
            tweenFall.onComplete.add(this.jumpComplete, this);
            game.add.tween(this._sprite).to({ y: this._sprite.y - 20 }, 150, Phaser.Easing.Cubic.Out, true).chain(tweenFall);
            game.add.tween(this._shadow.scale).to({ x: 0.75, y: 0.75 }, 150, Phaser.Easing.Cubic.Out, true).chain(game.add.tween(this._shadow.scale).to({ x: 1, y: 1 }, 150, Phaser.Easing.Cubic.In));
            this.onCell = false;
            this._flags |= CharacterBase.FLAG_JUMP_ON_PLACE;
        };
        CharacterBase.prototype.jumpUp = function () {
            var game = RoboJump.Global.game;
            var tweenY1 = game.add.tween(this._sprite).to({ y: this._jumpTargetPos.y - 10 }, 225, Phaser.Easing.Cubic.Out, true);
            var tweenY2 = game.add.tween(this._sprite).to({ y: this._jumpTargetPos.y }, 100, Phaser.Easing.Cubic.In);
            tweenY1.chain(tweenY2);
            tweenY2.onComplete.add(this.jumpComplete, this);
            game.add.tween(this._sprite).to({ x: this._jumpTargetPos.x }, 300, Phaser.Easing.Linear.None, true).onUpdateCallback(this.jumpSpriteXChange, this);
            var shadowScaleX = this._shadow.scale.x > 0 ? 1 : -1;
            game.add.tween(this._shadow.scale).to({ x: 0.5 * shadowScaleX, y: 0.5 }, 150, Phaser.Easing.Linear.None, true).onComplete.add(this.jumpMoveShadow, this, 0, shadowScaleX);
            game.add.tween(this._shadow).to({ alpha: 0.2 }, 150, Phaser.Easing.Linear.None, true);
            this.onCell = false;
        };
        CharacterBase.prototype.jumpDown = function () {
            var game = RoboJump.Global.game;
            var tweenX = game.add.tween(this._sprite).to({ x: this._jumpTargetPos.x }, 300, Phaser.Easing.Linear.None, true).onUpdateCallback(this.jumpSpriteXChange, this);
            var tweenY1 = game.add.tween(this._sprite).to({ y: this._sprite.y - 10 }, 100, Phaser.Easing.Cubic.Out, true);
            var tweenY2 = game.add.tween(this._sprite).to({ y: this._jumpTargetPos.y }, 225, Phaser.Easing.Cubic.In);
            tweenY2.onComplete.add(this.jumpComplete, this);
            tweenY1.chain(tweenY2);
            var shadowScaleX = this._shadow.scale.x > 0 ? 1 : -1;
            game.add.tween(this._shadow.scale).to({ x: 0.5 * shadowScaleX, y: 0.5 }, 150, Phaser.Easing.Linear.None, true).onComplete.add(this.jumpMoveShadow, this, 0, shadowScaleX);
            game.add.tween(this._shadow).to({ alpha: 0.2 }, 150, Phaser.Easing.Linear.None, true);
            this.onCell = false;
        };
        CharacterBase.prototype.jumpMoveShadow = function (sprite, tween, shadowScaleX) {
            var targetCell = this._jumpTargetCell;
            var shadowVisible = false;
            if (this._jumpStartCell.character == this) {
                this._jumpStartCell.character = undefined;
            }
            this._cell = targetCell;
            if (targetCell != undefined) {
                if (targetCell.character != undefined) {
                    Characters.Player.instance.killed();
                }
                else {
                    targetCell.character = this;
                }
                if (targetCell.active && !targetCell.collapsing) {
                    shadowVisible = true;
                    this._shadow.position.set(targetCell.x + Playfield.Playfield.CELL_CENTER_X, targetCell.y + Playfield.Playfield.CELL_CENTER_Y);
                    this._shadow.scale.set(0.5 * shadowScaleX, 0.5);
                    RoboJump.Global.game.add.tween(this._shadow.scale).to({ x: 1 * shadowScaleX, y: 1 }, 150, Phaser.Easing.Linear.None, true);
                    RoboJump.Global.game.add.tween(this._shadow).to({ alpha: 1 }, 150, Phaser.Easing.Linear.None, true);
                }
            }
            if (!shadowVisible)
                this._shadow.visible = false;
        };
        CharacterBase.prototype.jumpSpriteXChange = function () {
            var startX = this._jumpStartCell.x + Playfield.Playfield.CELL_CENTER_X;
            var targetX = this._jumpTargetPos.x;
            var depth = this._jumpStartCell.row;
            var depthChangeProgress = (this._sprite.x - startX) / (targetX - startX);
            if (this._jumpStartCell.y + Playfield.Playfield.CELL_CENTER_Y < this._jumpTargetPos.y) {
                depth += depthChangeProgress;
            }
            else {
                depth -= depthChangeProgress;
            }
            this.setDepth(depth);
        };
        CharacterBase.prototype.jumpComplete = function () {
            if ((this._flags & CharacterBase.FLAG_JUMP_ON_PLACE) == 0) {
                if (this._cell != undefined)
                    this.setDepth(this._cell.row);
            }
            else {
                this._flags &= ~CharacterBase.FLAG_JUMP_ON_PLACE;
            }
            if (this._cell != undefined)
                this.onCell = true;
        };
        CharacterBase.prototype.setDepth = function (depth) {
            if (this._depth == depth)
                return;
            var layer = Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.characters);
            var curLayerPos = layer.getIndex(this._displayGroup);
            var newLayerPos = curLayerPos;
            layer.cursorIndex = curLayerPos;
            if (this._depth < depth) {
                var layerLastChildId = layer.total - 1;
                while (layerLastChildId > newLayerPos && layer.next().character._depth < depth) {
                    newLayerPos++;
                }
            }
            else {
                while (newLayerPos > 0 && layer.previous().character._depth > depth) {
                    newLayerPos--;
                }
            }
            if (curLayerPos != newLayerPos) {
                layer.removeChildAt(curLayerPos);
                layer.addChildAt(this._displayGroup, newLayerPos);
            }
            this._depth = depth;
        };
        CharacterBase.FLAG_ON_CELL = 0x0001;
        CharacterBase.FLAG_COLLAPSING = 0x0002;
        CharacterBase.FLAG_JUMP_ON_PLACE = 0x0004;
        return CharacterBase;
    }(Playfield.MapCellContent));
    Characters.CharacterBase = CharacterBase;
})(Characters || (Characters = {}));
var Characters;
(function (Characters) {
    var ePlayerState;
    (function (ePlayerState) {
        ePlayerState[ePlayerState["idle"] = 0] = "idle";
        ePlayerState[ePlayerState["jump"] = 1] = "jump";
        ePlayerState[ePlayerState["jumpOnPlace"] = 2] = "jumpOnPlace";
        ePlayerState[ePlayerState["belt"] = 3] = "belt";
        ePlayerState[ePlayerState["portalEnter"] = 4] = "portalEnter";
        ePlayerState[ePlayerState["portalCameraMove"] = 5] = "portalCameraMove";
        ePlayerState[ePlayerState["portalExit"] = 6] = "portalExit";
        ePlayerState[ePlayerState["collapse"] = 7] = "collapse";
        ePlayerState[ePlayerState["trapped"] = 8] = "trapped";
        ePlayerState[ePlayerState["explosion"] = 9] = "explosion";
        ePlayerState[ePlayerState["fall"] = 10] = "fall";
        ePlayerState[ePlayerState["versionChange"] = 11] = "versionChange";
        ePlayerState[ePlayerState["catapult"] = 12] = "catapult";
    })(ePlayerState = Characters.ePlayerState || (Characters.ePlayerState = {}));
    var PlayerDeathParticle = (function (_super) {
        __extends(PlayerDeathParticle, _super);
        function PlayerDeathParticle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlayerDeathParticle.prototype.onEmit = function () {
            this.game.add.tween(this.body.velocity).to({ x: 0, y: 0 }, this.lifespan, Phaser.Easing.Cubic.In, true);
        };
        return PlayerDeathParticle;
    }(Phaser.Particle));
    var ePlayerFrame;
    (function (ePlayerFrame) {
        ePlayerFrame[ePlayerFrame["normalIdle"] = 0] = "normalIdle";
        ePlayerFrame[ePlayerFrame["normalJump"] = 1] = "normalJump";
        ePlayerFrame[ePlayerFrame["happyIdle"] = 2] = "happyIdle";
        ePlayerFrame[ePlayerFrame["happyJump"] = 3] = "happyJump";
        ePlayerFrame[ePlayerFrame["dead"] = 4] = "dead";
    })(ePlayerFrame || (ePlayerFrame = {}));
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(playState) {
            var _this = _super.call(this) || this;
            _this._landCallbacks = [];
            _this._playState = playState;
            Player._instance = _this;
            _this._shadow = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "robotShadow");
            _this._shadow.anchor.set(0.5);
            _this._displayGroup.add(_this._shadow);
            _this._sprite = new Playfield.MapCellUpdatableContentImage(_this, RoboJump.Global.ATLAS_KEY_0, null);
            _this._sprite.pivot.set(47, 84);
            _this._displayGroup.add(_this._sprite);
            _this._poisonOverlay = new Phaser.Image(RoboJump.Global.game, 45, 55, RoboJump.Global.ATLAS_KEY_0, "robotPoisonOverlay");
            _this._poisonOverlay.anchor.set(0.5);
            _this._sprite.addChild(_this._poisonOverlay);
            _this._transition = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0);
            _this._transition.pivot.set(60, 110);
            _this._transition.animations.add("in", Phaser.Animation.generateFrameNames("transitionFx_", 0, 10, undefined, 2), 20, false, false).onComplete.add(_this.onTransitionAnim, _this, 0, 0);
            _this._transition.animations.add("out", Phaser.Animation.generateFrameNames("transitionFx_", 10, 0, undefined, 2), 20, false, false).onComplete.add(_this.onTransitionAnim, _this, 0, 1);
            _this._displayGroup.addChild(_this._transition);
            var emitter = new Phaser.Particles.Arcade.Emitter(RoboJump.Global.game, 0, 0, 12);
            _this._explosionEmitter = emitter;
            emitter.particleClass = PlayerDeathParticle;
            emitter.makeParticles(RoboJump.Global.ATLAS_KEY_0, ["robotExplosionPart0", "robotExplosionPart1"]);
            emitter.setXSpeed(-500, 500);
            emitter.setYSpeed(-500, 500);
            emitter.setSize(40, 40);
            emitter.setAlpha(1, 0, 800, Phaser.Easing.Exponential.In, false);
            emitter.setScale(1, 2.5, 1, 2.5, 600);
            emitter.gravity.y = 0;
            _this._landCallbacks[Blocks.eBlockType.trap] = _this.landOnTrap;
            _this._landCallbacks[Blocks.eBlockType.belt] = _this.landOnBelt;
            _this._landCallbacks[Blocks.eBlockType.explosive] = _this.landOnExplosive;
            _this._landCallbacks[Blocks.eBlockType.unstable] = _this.landOnUnstable;
            _this._landCallbacks[Blocks.eBlockType.portal] = _this.landOnPortal;
            _this._landCallbacks[Blocks.eBlockType.poison] = _this.landOnPoison;
            _this._landCallbacks[Blocks.eBlockType.versionSwitch] = _this.landOnVersionSwitch;
            _this._landCallbacks[Blocks.eBlockType.catapult] = _this.landOnCatapult;
            return _this;
        }
        Object.defineProperty(Player, "instance", {
            get: function () {
                return Player._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "x", {
            get: function () {
                return this._sprite.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "y", {
            get: function () {
                return this._sprite.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "flippedDir", {
            get: function () {
                return (this._state == ePlayerState.idle && this._cell.blockType == Blocks.eBlockType.flipDir);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isHappy", {
            get: function () {
                return (this._flags & Player.FLAG_IS_HAPPY) != 0;
            },
            set: function (isHappy) {
                if (isHappy) {
                    this._flags |= Player.FLAG_IS_HAPPY;
                }
                else {
                    this._flags &= ~Player.FLAG_IS_HAPPY;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isPoisoned", {
            get: function () {
                return (this._flags & Player.FLAG_IS_POISONED) != 0;
            },
            set: function (isPoisoned) {
                if (this.isPoisoned != isPoisoned) {
                    if (isPoisoned) {
                        this._flags |= Player.FLAG_IS_POISONED;
                        this._poisonOverlay.exists = this._poisonOverlay.visible = true;
                        this._poisonOverlayScaleDir = -1;
                        this._poisonTime = RoboJump.Global.elapsedTime;
                        Utils.AudioUtils.playSound("poison");
                    }
                    else {
                        this._flags &= ~Player.FLAG_IS_POISONED;
                        this._poisonOverlay.exists = this._poisonOverlay.visible = false;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "version", {
            get: function () { return this._version; },
            enumerable: true,
            configurable: true
        });
        Player.prototype.reset = function () {
            var playfield = Playfield.Playfield.instance;
            var checkpoint = playfield.checkpoint;
            this._flags = 0;
            this._version = checkpoint.playerVersion;
            var emitter = this._explosionEmitter;
            emitter.setAll("exists", false);
            if (emitter.parent != undefined)
                emitter.parent.removeChild(emitter);
            this._cell = Playfield.Playfield.instance.mapCell(checkpoint.column, checkpoint.row);
            this._cell.character = this;
            this.onCell = true;
            if (this._cell.bonus != null)
                this._cell.bonus.deactivate();
            this._sprite.alpha = 1;
            this._sprite.position.set(this._cell.x + Playfield.Playfield.CELL_CENTER_X, this._cell.y + Playfield.Playfield.CELL_CENTER_Y);
            this._shadow.position.copyFrom(this._sprite.position);
            this._shadow.visible = true;
            this._shadow.alpha = 1;
            this._shadow.scale.set(1);
            this._poisonOverlay.exists = this._poisonOverlay.visible = false;
            this._transition.animations.stop();
            this._transition.exists = this._transition.visible = false;
            this._hDir = Number.MAX_VALUE;
            this.setDir(checkpoint.playerDir);
            this.setPlayerSpriteFrame(ePlayerFrame.normalIdle);
            this._displayGroup.visible = true;
            this._depth = checkpoint.row;
            if (this._displayGroup.parent != Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.characters)) {
                this._displayGroup.parent.removeChild(this._displayGroup);
                this.instertToCharacterLayer();
            }
            this._jumpReqDir = Characters.eCharacterDir.none;
            this._state = ePlayerState.idle;
        };
        Player.prototype.update = function () {
            if (this.isHappy && this._happyTime < RoboJump.Global.elapsedTime) {
                this.isHappy = false;
                this.setPlayerSpriteFrame(this._state == ePlayerState.jump ? ePlayerFrame.normalJump : ePlayerFrame.normalIdle);
            }
            if (this._state == ePlayerState.idle && this._cell.blockType == Blocks.eBlockType.belt) {
                if (RoboJump.Global.elapsedTime >= this._beltSlideTime) {
                    this.slide();
                }
            }
            else if (this._state == ePlayerState.portalCameraMove) {
                if (!RoboJump.ViewController.instance.playerOutOfBounds) {
                    this._state = ePlayerState.portalExit;
                    this._displayGroup.visible = true;
                    RoboJump.Global.game.add.tween(this._displayGroup).to({ alpha: 1 }, 750, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
                        this._state = ePlayerState.idle;
                        this._cell = this._jumpTargetCell;
                        this._cell.character = this;
                        this.onCell = true;
                    }, this);
                    Utils.AudioUtils.playSound("teleport");
                }
            }
            if (this._state < ePlayerState.portalEnter && this.isPoisoned) {
                var progress = (RoboJump.Global.elapsedTime - this._poisonTime) / Player.POISON_LIFE_LEN;
                if (progress < 1) {
                    var scaleStep = (Player.POISON_MIN_SCALE_SPEED + progress * (Player.POISON_MAX_SCALE_SPEED - Player.POISON_MIN_SCALE_SPEED)) * RoboJump.Global.deltaRatio;
                    var scale = this._poisonOverlay.scale.x;
                    if (this._poisonOverlayScaleDir > 0) {
                        if ((scale += scaleStep) >= Player.POISON_MAX_SCALE) {
                            scale -= (scale - Player.POISON_MAX_SCALE);
                            this._poisonOverlayScaleDir = -1;
                        }
                    }
                    else if ((scale -= scaleStep) <= Player.POISON_MIN_SCALE) {
                        scale += (Player.POISON_MIN_SCALE - scale);
                        this._poisonOverlayScaleDir = 1;
                    }
                    this._poisonOverlay.scale.set(scale);
                }
                else {
                    this.killed();
                }
            }
        };
        Player.prototype.jump = function (left) {
            var dir = left ? Characters.eCharacterDir.left : Characters.eCharacterDir.right;
            if (this._state == ePlayerState.jumpOnPlace) {
                this.cancelJump();
            }
            else if (this._state != ePlayerState.idle) {
                if (this._state == ePlayerState.belt) {
                    this._jumpReqDir = dir;
                    this._jumpReqTime = RoboJump.Global.elapsedTime;
                }
                return;
            }
            else if (this._cell.blockType == Blocks.eBlockType.sticky) {
                this.jumpOnPlace();
                this._state = ePlayerState.jumpOnPlace;
                Utils.AudioUtils.playSound("sticky");
                return;
            }
            else if (this._cell.blockType == Blocks.eBlockType.gate) {
                var block = this._cell.block;
                if (block.locked && (block.gateSide == 0 && left || block.gateSide != 0 && !left)) {
                    Utils.AudioUtils.playSound("gateLocked");
                    return;
                }
            }
            else if (this._cell.blockType == Blocks.eBlockType.catapult) {
                this._cell.block.cancelLaunchCountdown();
            }
            this.setJumpTarget(true, left);
            if (this._jumpTargetCell != undefined) {
                if (this._jumpTargetCell.blockType == Blocks.eBlockType.full)
                    return;
                if (this._jumpTargetCell.blockType == Blocks.eBlockType.gate)
                    this._jumpTargetCell.block.moveGateToFxLayer();
            }
            this.setDir(dir);
            this.setPlayerSpriteFrame(!this.isHappy ? ePlayerFrame.normalJump : ePlayerFrame.happyJump);
            _super.prototype.jumpDown.call(this);
            this._state = ePlayerState.jump;
            Utils.AudioUtils.playSound("jump");
            if (RoboJump.Global.GAMEE)
                Gamee2.Gamee.score++;
        };
        Player.prototype.slide = function () {
            this.setDir(this._cell.block.leftDir ? Characters.eCharacterDir.left : Characters.eCharacterDir.right);
            Utils.AudioUtils.playSound("conveyorBelt");
            this.slideDown();
            this._state = ePlayerState.belt;
        };
        Player.prototype.catapult = function (dir) {
            var game = RoboJump.Global.game;
            var camera = game.camera;
            game.add.tween(this._sprite).to({ x: (dir < 0 ? "-400" : "+400") }, 500, Phaser.Easing.Linear.None, true);
            game.add.tween(this._sprite).to({ y: this._sprite.y - 100 }, 250, Phaser.Easing.Quadratic.Out, true).chain(game.add.tween(this._sprite).to({ y: this._sprite.y }, 250, Phaser.Easing.Quadratic.In));
            this._shadow.visible = false;
            this.setPlayerSpriteFrame(ePlayerFrame.dead);
            this.onCell = false;
            this._state = ePlayerState.catapult;
            RoboJump.Global.game.time.events.add(1000, this.death, this);
        };
        Player.prototype.trapped = function () {
            if (this._state != ePlayerState.idle)
                return;
            var index = Playfield.Playfield.instance.activateTrap(this._cell);
            Playfield.Playfield.instance.moveToLayer(this._displayGroup, Playfield.ePlayfieldLayer.cells, index);
            Playfield.MapCellContent.collapseObject(this._shadow, false);
            Playfield.MapCellContent.collapseObject(this._sprite, false).onComplete.add(function () {
                this.death();
            }, this);
            this.isHappy = false;
            this.setPlayerSpriteFrame(ePlayerFrame.dead);
            this._state = ePlayerState.trapped;
            Utils.AudioUtils.playSound("fall");
        };
        Player.prototype.killed = function () {
            if (this._state != ePlayerState.explosion) {
                this._state = ePlayerState.explosion;
                this.cancelJump();
                this._displayGroup.visible = false;
                var emitter = this._explosionEmitter;
                emitter.exists = true;
                Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.effects).addChild(emitter);
                emitter.position.set(this._sprite.x, this._sprite.y - 20);
                emitter.explode(800, emitter.maxParticles);
                if (this._cell != undefined) {
                    if (this._cell.character == this)
                        this._cell.character = undefined;
                    this._cell = undefined;
                }
                Utils.AudioUtils.playSound("monsterKill");
                RoboJump.Global.game.time.events.add(1000, this.death, this);
            }
        };
        Player.prototype.collapse = function () {
            if (this.onCell && !this.collapsing) {
                _super.prototype.collapseCharacter.call(this, false);
                this.isHappy = false;
                this.setPlayerSpriteFrame(ePlayerFrame.dead);
                this._state = ePlayerState.collapse;
                if (this._cell.blockType == Blocks.eBlockType.gate) {
                    var block = this._cell.block;
                    if (block.locked) {
                        block.moveGateToCellLayer();
                    }
                }
                Utils.AudioUtils.playSound("fall");
            }
        };
        Player.prototype.fall = function () {
            var playfield = Playfield.Playfield.instance;
            var row = playfield.mapRow(this._jumpStartCell.row + 2);
            if (row != undefined && row.actCellCnt != 0) {
                var col = row.size;
                while (col-- != 0) {
                    var cell = row.cell(col++);
                    if (cell.active) {
                        playfield.moveToLayer(this._displayGroup, Playfield.ePlayfieldLayer.cells, cell.block.getLayerIndex());
                        break;
                    }
                }
            }
            RoboJump.Global.game.add.tween(this._sprite).to({ y: this._sprite.y + 400 }, 600, Phaser.Easing.Linear.None, true);
            RoboJump.Global.game.add.tween(this._sprite).to({ alpha: 0 }, 400, Phaser.Easing.Cubic.In, true, 200).onComplete.add(this.death, this);
            this._state = ePlayerState.fall;
            this.isHappy = false;
            this.setPlayerSpriteFrame(ePlayerFrame.dead);
            Utils.AudioUtils.playSound("fall");
        };
        Player.prototype.jumpComplete = function () {
            _super.prototype.jumpComplete.call(this);
            if (this._jumpStartCell.blockType == Blocks.eBlockType.gate)
                this._jumpStartCell.block.moveGateToCellLayer();
            var cell = this._cell;
            if (this._cell == undefined || !cell.active) {
                this.fall();
                return;
            }
            if (!cell.activate || cell.collapsing) {
                this.collapse();
                return;
            }
            if (cell.blockType == Blocks.eBlockType.spikes) {
                if (cell.block.isDeadly(Blocks.eSpikesType.top)) {
                    this.killed();
                    return;
                }
            }
            else if (cell.blockType == Blocks.eBlockType.gate && this._version != 0) {
                cell.block.unlock();
            }
            var neighborCell = Playfield.Playfield.instance.getCellNeighbor(cell, true, true);
            var neighborBlock;
            if (neighborCell != null) {
                neighborBlock = neighborCell.block;
                if (neighborBlock != null && neighborBlock.type == Blocks.eBlockType.spikes && neighborBlock.isDeadly(Blocks.eSpikesType.right)) {
                    this.killed();
                    return;
                }
            }
            if ((neighborCell = Playfield.Playfield.instance.getCellNeighbor(cell, false, true)) != null) {
                neighborBlock = neighborCell.block;
                if (neighborBlock != null && neighborBlock.type == Blocks.eBlockType.spikes && neighborBlock.isDeadly(Blocks.eSpikesType.left)) {
                    this.killed();
                    return;
                }
            }
            var prevState = this._state;
            this._state = ePlayerState.idle;
            if (prevState != ePlayerState.jumpOnPlace) {
                var frame = void 0;
                var block = cell.block;
                var callback = this._landCallbacks[block.type];
                if (callback != undefined)
                    frame = callback.call(this, block);
                if (cell.bonus != null) {
                    this.pickUpBonus();
                }
                if (frame == undefined) {
                    frame = (!this.isHappy ? ePlayerFrame.normalIdle : ePlayerFrame.happyIdle);
                }
                this.setPlayerSpriteFrame(frame);
                if (block.safe)
                    Playfield.Playfield.instance.checkpoint.init(cell.col, cell.row, this._version, this._hDir, Gamee2.Gamee.score);
            }
        };
        Player.prototype.pickUpBonus = function () {
            var bonus = this._cell.bonus;
            Playfield.Playfield.instance.bonusPickupFxPool.getItem().activate(this._cell);
            bonus.deactivate();
            this.isHappy = true;
            this._happyTime = RoboJump.Global.elapsedTime + Player.HAPPY_STATE_LEN;
            if (bonus.type == Bonuses.eBonusType.score) {
                if (RoboJump.Global.GAMEE)
                    Gamee2.Gamee.score += 5;
                Utils.AudioUtils.playSound("bonus");
            }
            else {
                this.isPoisoned = false;
                Utils.AudioUtils.playSound("potion");
            }
        };
        Player.prototype.landOnTrap = function (block) {
            if (block.isOpen) {
                this.trapped();
                return ePlayerFrame.dead;
            }
            return undefined;
        };
        Player.prototype.landOnBelt = function (block) {
            if (this._jumpReqDir != Characters.eCharacterDir.none) {
                if (this._jumpReqTime + 200 >= RoboJump.Global.elapsedTime) {
                    this.jump(this._jumpReqDir == Characters.eCharacterDir.left);
                }
                this._jumpReqDir = Characters.eCharacterDir.none;
            }
            if (this._state == ePlayerState.idle) {
                this._beltSlideTime = RoboJump.Global.elapsedTime + 200;
            }
            return undefined;
        };
        Player.prototype.landOnExplosive = function (block) {
            block.explode();
            return ePlayerFrame.dead;
        };
        Player.prototype.landOnUnstable = function (block) {
            block.startFallTiming();
            return undefined;
        };
        Player.prototype.landOnPortal = function (block) {
            if (block.exit != undefined) {
                this.onCell = false;
                this._jumpTargetCell = this._cell.block.exit;
                this._state = ePlayerState.portalEnter;
                RoboJump.Global.game.add.tween(this._displayGroup).to({ alpha: 0 }, 750, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
                    this._cell.character = undefined;
                    this._cell = this._jumpTargetCell;
                    this._cell.character = this;
                    this._sprite.position.set(this._jumpTargetCell.x + Playfield.Playfield.CELL_CENTER_X, this._jumpTargetCell.y + Playfield.Playfield.CELL_CENTER_Y);
                    this._shadow.position.copyFrom(this._sprite.position);
                    this._displayGroup.visible = false;
                    this._state = ePlayerState.portalCameraMove;
                }, this);
                Utils.AudioUtils.playSound("teleport");
            }
            return undefined;
        };
        Player.prototype.landOnPoison = function () {
            if (!this.isPoisoned) {
                this.isPoisoned = true;
            }
            return undefined;
        };
        Player.prototype.landOnVersionSwitch = function () {
            if (this._version == 0) {
                this._state = ePlayerState.versionChange;
                this._transition.position.set(this._sprite.x, this._sprite.y);
                this._transition.exists = this._transition.visible = true;
                this._transition.animations.play("in");
                Utils.AudioUtils.playSound("switchRobot");
            }
            return undefined;
        };
        Player.prototype.landOnCatapult = function (block) {
            block.startLaunchCountdown();
            return undefined;
        };
        Player.prototype.setDir = function (dir) {
            if (this._hDir != dir) {
                this._hDir = dir;
                this._shadow.scale.x = (this._sprite.scale.x = (dir == Characters.eCharacterDir.left ? 1 : -1));
            }
        };
        Player.prototype.death = function () {
            RoboJump.Global.game.state.getCurrentState().gameOver();
        };
        Player.prototype.setPlayerSpriteFrame = function (frame) {
            this._frame = frame;
            this._sprite.frameName = "robot" + this._version + Player.FRAME_NAMES[frame];
        };
        Player.prototype.onTransitionAnim = function (image, anim, progress) {
            if (progress == 0) {
                if (this._version == 0) {
                    this._version = 1;
                    this._sprite.pivot.set(44, 84);
                }
                else {
                    this._version = 0;
                    this._sprite.pivot.set(47, 84);
                }
                this.setPlayerSpriteFrame(this._frame);
                this._transition.animations.play("out");
            }
            else {
                this._transition.exists = this._transition.visible = false;
                this._state = ePlayerState.idle;
            }
        };
        Player.HAPPY_STATE_LEN = 1000;
        Player.FLAG_IS_HAPPY = 0x1000;
        Player.FLAG_IS_POISONED = 0x2000;
        Player.FRAME_NAMES = ["NormalIdle", "NormalJump", "HappyIdle", "HappyJump", "Dead"];
        Player.POISON_MIN_SCALE = 0.95;
        Player.POISON_MAX_SCALE = 1;
        Player.POISON_MIN_SCALE_SPEED = 0.05 / 30;
        Player.POISON_MAX_SCALE_SPEED = 0.05 / 10;
        Player.POISON_LIFE_LEN = 7000;
        return Player;
    }(Characters.CharacterBase));
    Characters.Player = Player;
})(Characters || (Characters = {}));
var Characters;
(function (Characters) {
    var eEnemyState;
    (function (eEnemyState) {
        eEnemyState[eEnemyState["idle"] = 0] = "idle";
        eEnemyState[eEnemyState["jump"] = 1] = "jump";
        eEnemyState[eEnemyState["collapse"] = 2] = "collapse";
    })(eEnemyState || (eEnemyState = {}));
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy() {
            var _this = _super.call(this) || this;
            _this._nextMoveTimerEvent = null;
            if (Enemy.MOVE_DOWN_FRAME_NAMES == null) {
                Enemy.MOVE_DOWN_FRAME_NAMES = Phaser.Animation.generateFrameNames("monsterD_", 0, 12, "", 2);
                Enemy.MOVE_UP_FRAME_NAMES = Phaser.Animation.generateFrameNames("monsterU_", 0, 12, "", 2);
            }
            _this._shadow = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "monsterShadow");
            _this._shadow.anchor.set(0.5);
            _this._displayGroup.add(_this._shadow);
            _this._sprite = new Playfield.MapCellUpdatableContentImage(_this, RoboJump.Global.ATLAS_KEY_0, "monsterD_00");
            _this._sprite.pivot.set(48, 84);
            _this._displayGroup.add(_this._sprite);
            _this._sprite.animations.add("down", Enemy.MOVE_DOWN_FRAME_NAMES, 10, true, false);
            _this._sprite.animations.add("up", Enemy.MOVE_UP_FRAME_NAMES, 10, true, false);
            _this._displayGroup.exists = false;
            return _this;
        }
        Enemy.prototype.activateEnemy = function (cell, actPar) {
            this._flags = 0;
            this._cell = cell;
            this._cell.character = this;
            this.onCell = true;
            var moveLeft;
            var moveDown;
            switch (cell.blockCustomData) {
                case Blocks.eMonsterRoadBlockType.left: {
                    moveLeft = (moveDown = (actPar == 0));
                    break;
                }
                case Blocks.eMonsterRoadBlockType.right: {
                    moveLeft = !(moveDown = (actPar == 0));
                    break;
                }
                case Blocks.eMonsterRoadBlockType.connectLeft: {
                    moveLeft = true;
                    moveDown = (actPar == 0);
                    break;
                }
                case Blocks.eMonsterRoadBlockType.connectRight: {
                    moveLeft = false;
                    moveDown = (actPar == 0);
                    break;
                }
                case Blocks.eMonsterRoadBlockType.connectTop: {
                    moveDown = true;
                    moveLeft = (actPar == 0);
                    break;
                }
                case Blocks.eMonsterRoadBlockType.connectBot: {
                    moveDown = false;
                    moveLeft = (actPar == 0);
                    break;
                }
            }
            this.setHorizontalDir(moveLeft);
            this.setVerticalDir(moveDown);
            this._shadow.visible = true;
            this._shadow.alpha = 1;
            this._shadow.scale.set(1);
            this._shadow.position.set(cell.x + Playfield.Playfield.CELL_CENTER_X, cell.y + Playfield.Playfield.CELL_CENTER_Y);
            this._sprite.visible = true;
            this._sprite.alpha = 1;
            this._sprite.position.copyFrom(this._shadow.position);
            this._state = eEnemyState.idle;
            this._nextMoveTimerEvent = RoboJump.Global.game.time.events.add(Enemy.IDLE_STATE_LEN, this.nextMove, this);
            this._displayGroup.exists = true;
            this.instertToCharacterLayer();
        };
        Enemy.prototype.deactivate = function () {
            if (this._nextMoveTimerEvent != undefined) {
                RoboJump.Global.game.time.events.remove(this._nextMoveTimerEvent);
                this._nextMoveTimerEvent = undefined;
            }
            this.cancelJump();
            this._displayGroup.exists = false;
            this._displayGroup.parent.removeChild(this._displayGroup);
            if (this._cell != undefined) {
                if (this._cell.character == this)
                    this._cell.character = undefined;
                this._cell = undefined;
            }
        };
        Enemy.prototype.collapse = function () {
            if (this.onCell && !this.collapsing) {
                _super.prototype.collapseCharacter.call(this, true);
                if (this._nextMoveTimerEvent != undefined) {
                    RoboJump.Global.game.time.events.remove(this._nextMoveTimerEvent);
                    this._nextMoveTimerEvent = undefined;
                }
                this._state = eEnemyState.collapse;
            }
        };
        Enemy.prototype.death = function () {
            Playfield.Playfield.instance.deactivateEnemy(this);
        };
        Enemy.prototype.nextMove = function () {
            this._nextMoveTimerEvent = undefined;
            if (this._state != eEnemyState.idle)
                return;
            var moveDown = this._moveDown;
            var moveLeft = this._hDir == Characters.eCharacterDir.left;
            var attemptId = 0;
            while (true) {
                switch (this._cell.blockCustomData) {
                    case Blocks.eMonsterRoadBlockType.left: {
                        this.setJumpTarget(moveDown, moveDown, false);
                        if (this._jumpTargetCell == undefined)
                            break;
                        if (this._jumpTargetCell.blockType != Blocks.eBlockType.monsterRoad) {
                            moveDown = !moveDown;
                            this.setJumpTarget(moveDown, moveDown);
                        }
                        moveLeft = moveDown;
                        break;
                    }
                    case Blocks.eMonsterRoadBlockType.right: {
                        this.setJumpTarget(moveDown, !moveDown);
                        if (this._jumpTargetCell == undefined)
                            break;
                        if (this._jumpTargetCell.blockType != Blocks.eBlockType.monsterRoad) {
                            moveDown = !moveDown;
                            this.setJumpTarget(moveDown, !moveDown);
                        }
                        moveLeft = !moveDown;
                        break;
                    }
                    case Blocks.eMonsterRoadBlockType.connectLeft:
                    case Blocks.eMonsterRoadBlockType.connectRight: {
                        if (attemptId == 0)
                            moveLeft = !moveLeft;
                        this.setJumpTarget(moveDown, moveLeft);
                        break;
                    }
                    case Blocks.eMonsterRoadBlockType.connectTop: {
                        moveDown = true;
                        this.setJumpTarget(true, moveLeft);
                        break;
                    }
                    case Blocks.eMonsterRoadBlockType.connectBot: {
                        moveDown = false;
                        this.setJumpTarget(false, moveLeft);
                        break;
                    }
                }
                if (this._jumpTargetCell != undefined && !this._jumpTargetCell.collapsing)
                    break;
                if (attemptId == 0 && this._cell.blockCustomData != Blocks.eMonsterRoadBlockType.connectBot) {
                    attemptId++;
                    this.setVerticalDir((moveDown = !moveDown));
                    continue;
                }
                return;
            }
            this.setVerticalDir(moveDown);
            this.setHorizontalDir(moveLeft);
            if (moveDown) {
                this.jumpDown();
            }
            else {
                this.jumpUp();
            }
        };
        Enemy.prototype.jumpComplete = function () {
            _super.prototype.jumpComplete.call(this);
            if (!this.cell.activated || (this._cell.active && !this._cell.collapsing)) {
                this._state = eEnemyState.idle;
                this._nextMoveTimerEvent = RoboJump.Global.game.time.events.add(Enemy.IDLE_STATE_LEN, this.nextMove, this);
            }
            else {
                this.collapse();
            }
        };
        Enemy.prototype.setVerticalDir = function (down) {
            if (this._moveDown != down) {
                this._moveDown = down;
                this._sprite.animations.play(down ? "down" : "up");
            }
        };
        Enemy.prototype.setHorizontalDir = function (left) {
            this._hDir = left ? Characters.eCharacterDir.left : Characters.eCharacterDir.right;
            var scaleX = 1;
            if ((this._moveDown && left) || (!this._moveDown && !left))
                scaleX = -1;
            this._shadow.scale.x = (this._sprite.scale.x = scaleX);
        };
        Enemy.MOVE_DOWN_FRAME_NAMES = null;
        Enemy.IDLE_STATE_LEN = 250;
        return Enemy;
    }(Characters.CharacterBase));
    Characters.Enemy = Enemy;
})(Characters || (Characters = {}));
var Blocks;
(function (Blocks) {
    var eBlockType;
    (function (eBlockType) {
        eBlockType[eBlockType["empty1"] = 0] = "empty1";
        eBlockType[eBlockType["full"] = 1] = "full";
        eBlockType[eBlockType["explosive"] = 2] = "explosive";
        eBlockType[eBlockType["trap"] = 3] = "trap";
        eBlockType[eBlockType["flipDir"] = 4] = "flipDir";
        eBlockType[eBlockType["belt"] = 5] = "belt";
        eBlockType[eBlockType["monsterRoad"] = 6] = "monsterRoad";
        eBlockType[eBlockType["unstable"] = 7] = "unstable";
        eBlockType[eBlockType["sticky"] = 8] = "sticky";
        eBlockType[eBlockType["portal"] = 9] = "portal";
        eBlockType[eBlockType["spikes"] = 10] = "spikes";
        eBlockType[eBlockType["poison"] = 11] = "poison";
        eBlockType[eBlockType["versionSwitch"] = 12] = "versionSwitch";
        eBlockType[eBlockType["catapult"] = 13] = "catapult";
        eBlockType[eBlockType["empty2"] = 14] = "empty2";
        eBlockType[eBlockType["gate"] = 15] = "gate";
    })(eBlockType = Blocks.eBlockType || (Blocks.eBlockType = {}));
    var BlockBase = (function (_super) {
        __extends(BlockBase, _super);
        function BlockBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(BlockBase.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockBase.prototype, "safe", {
            get: function () { return BlockBase.SAFE_FLAG[this._type]; },
            enumerable: true,
            configurable: true
        });
        BlockBase.prototype.getLayerIndex = function () {
            var layer = this._sprite.parent;
            if (layer != null)
                return layer.getIndex(this._sprite);
            return -1;
        };
        BlockBase.prototype.activateBlock = function (cell, blockType) {
            this._type = blockType;
            this._flags = 0;
            var sprite = this._sprite;
            sprite.position.set(cell.x, cell.y);
            sprite.alpha = 1;
            sprite.exists = true;
            Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.cells).add(sprite);
            this._cell = cell;
        };
        BlockBase.prototype.deactivate = function () {
            RoboJump.Global.game.tweens.removeFrom(this._sprite);
            this._cell.removeBlock();
            this._cell = undefined;
            this._sprite.animations.stop();
            this._sprite.parent.removeChild(this._sprite);
            this._sprite.exists = false;
            Playfield.Playfield.instance.blockPool(this._type).returnItem(this);
        };
        BlockBase.prototype.collapse = function () {
            if ((this._flags & BlockBase.FLAG_COLLAPSING) == 0) {
                this._flags |= BlockBase.FLAG_COLLAPSING;
                Playfield.MapCellContent.collapseObject(this._sprite, true).onComplete.add(function () {
                    this.deactivate();
                }, this);
            }
        };
        BlockBase.FLAG_COLLAPSING = 1;
        BlockBase.SAFE_FLAG = [
            true,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
        ];
        return BlockBase;
    }(Playfield.MapCellContent));
    Blocks.BlockBase = BlockBase;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var SimpleBlock = (function (_super) {
        __extends(SimpleBlock, _super);
        function SimpleBlock() {
            var _this = _super.call(this) || this;
            if (SimpleBlock.TYPE_FRAME_NAME == undefined) {
                SimpleBlock.TYPE_FRAME_NAME = [];
                SimpleBlock.TYPE_FRAME_NAME[Blocks.eBlockType.empty1] = "bloEmpty1";
                SimpleBlock.TYPE_FRAME_NAME[Blocks.eBlockType.full] = "bloTree";
                SimpleBlock.TYPE_FRAME_NAME[Blocks.eBlockType.flipDir] = "bloFlipDir";
                SimpleBlock.TYPE_FRAME_NAME[Blocks.eBlockType.sticky] = "bloSticky";
                SimpleBlock.TYPE_FRAME_NAME[Blocks.eBlockType.versionSwitch] = "bloVersionSwitch";
                SimpleBlock.TYPE_FRAME_NAME[Blocks.eBlockType.empty2] = "bloEmpty2";
            }
            _this._type = Blocks.eBlockType.empty1;
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloEmpty1");
            _this._sprite.exists = false;
            return _this;
        }
        SimpleBlock.prototype.activateBlock = function (cell, blockType) {
            if (blockType == Blocks.eBlockType.versionSwitch && Characters.Player.instance.version != 0) {
                this._sprite.frameName = SimpleBlock.TYPE_FRAME_NAME[Blocks.eBlockType.empty2];
            }
            else {
                this._sprite.frameName = SimpleBlock.TYPE_FRAME_NAME[blockType];
            }
            if (blockType == Blocks.eBlockType.full)
                this._sprite.pivot.y = 57;
            else
                this._sprite.pivot.y = 0;
            _super.prototype.activateBlock.call(this, cell, blockType);
        };
        return SimpleBlock;
    }(Blocks.BlockBase));
    Blocks.SimpleBlock = SimpleBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var UnstableBlock = (function (_super) {
        __extends(UnstableBlock, _super);
        function UnstableBlock() {
            var _this = _super.call(this) || this;
            _this._type = Blocks.eBlockType.unstable;
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloUnstable");
            _this._sprite.exists = false;
            return _this;
        }
        UnstableBlock.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            if (this._fallTimerEvent != undefined) {
                RoboJump.Global.game.time.events.remove(this._fallTimerEvent);
                this._fallTimerEvent = undefined;
            }
        };
        UnstableBlock.prototype.startFallTiming = function () {
            if (this._fallTimerEvent == undefined) {
                this._fallTimerEvent = RoboJump.Global.game.time.events.add(UnstableBlock._FALL_DEALY, function () {
                    this._fallTimerEvent = undefined;
                    this._cell.collapse();
                }, this);
            }
        };
        UnstableBlock._FALL_DEALY = 400;
        return UnstableBlock;
    }(Blocks.BlockBase));
    Blocks.UnstableBlock = UnstableBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var TrapBlock = (function (_super) {
        __extends(TrapBlock, _super);
        function TrapBlock() {
            var _this = _super.call(this) || this;
            if (TrapBlock._animOpenFrameNames == null) {
                TrapBlock._animOpenFrameNames = Phaser.Animation.generateFrameNames("bloTrap_", 1, 5);
                TrapBlock._animCloseFrameNames = Phaser.Animation.generateFrameNames("bloTrap_", 5, 1);
            }
            _this._type = Blocks.eBlockType.trap;
            _this._sprite = new Playfield.MapCellUpdatableContentImage(_this, RoboJump.Global.ATLAS_KEY_0, "bloTrap_0");
            return _this;
        }
        Object.defineProperty(TrapBlock.prototype, "isOpen", {
            get: function () {
                return this._isOpen;
            },
            enumerable: true,
            configurable: true
        });
        TrapBlock.prototype.activateBlock = function (cell, blockType) {
            _super.prototype.activateBlock.call(this, cell, blockType);
            this._startedOpen = cell.blockCustomData;
            this.update();
        };
        TrapBlock.prototype.update = function () {
            var lifePos = RoboJump.Global.elapsedTime % (TrapBlock._STATE_LEN * 2);
            if (this._startedOpen)
                lifePos = (lifePos + TrapBlock._STATE_LEN) % (TrapBlock._STATE_LEN * 2);
            var isOpen = false;
            var frameName;
            if (lifePos < TrapBlock._STATE_LEN) {
                if (lifePos < TrapBlock._ANIM_LEN) {
                    frameName = TrapBlock._animCloseFrameNames[Math.floor((lifePos / TrapBlock._ANIM_LEN) * TrapBlock._animCloseFrameNames.length)];
                }
                else {
                    frameName = "bloTrap_0";
                }
            }
            else {
                lifePos -= TrapBlock._STATE_LEN;
                if (lifePos < TrapBlock._ANIM_LEN) {
                    frameName = TrapBlock._animOpenFrameNames[Math.floor((lifePos / TrapBlock._ANIM_LEN) * TrapBlock._animOpenFrameNames.length)];
                }
                else {
                    frameName = "bloTrap_6";
                    isOpen = true;
                }
            }
            this._sprite.frameName = frameName;
            if (isOpen && !this._isOpen) {
                if (this._cell.character != undefined)
                    Characters.Player.instance.trapped();
            }
            this._isOpen = isOpen;
        };
        TrapBlock._animOpenFrameNames = null;
        TrapBlock._animCloseFrameNames = null;
        TrapBlock._STATE_LEN = 1200;
        TrapBlock._ANIM_LEN = 400;
        return TrapBlock;
    }(Blocks.BlockBase));
    Blocks.TrapBlock = TrapBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var ExplosiveBlock = (function (_super) {
        __extends(ExplosiveBlock, _super);
        function ExplosiveBlock() {
            var _this = _super.call(this) || this;
            _this._type = Blocks.eBlockType.explosive;
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloExplosive");
            _this._sprite.exists = false;
            return _this;
        }
        ExplosiveBlock.prototype.explode = function () {
            Playfield.Playfield.instance.blockExplosionPool.getItem().activate(this._cell);
            this._cell.collapse(0);
            Utils.AudioUtils.playSound("explosion");
        };
        return ExplosiveBlock;
    }(Blocks.BlockBase));
    Blocks.ExplosiveBlock = ExplosiveBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var BeltBlock = (function (_super) {
        __extends(BeltBlock, _super);
        function BeltBlock() {
            var _this = _super.call(this) || this;
            if (BeltBlock.lDirFrameNames == null) {
                BeltBlock.lDirFrameNames = Phaser.Animation.generateFrameNames("bloBeltL_", 0, 5);
                BeltBlock.rDirFrameNames = Phaser.Animation.generateFrameNames("bloBeltR_", 0, 5);
            }
            _this._type = Blocks.eBlockType.belt;
            _this._sprite = new Phaser.Sprite(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloBeltL_0");
            _this._sprite.exists = false;
            _this._sprite.animations.add("left", BeltBlock.lDirFrameNames, 20, true, false);
            _this._sprite.animations.add("right", BeltBlock.rDirFrameNames, 20, true, false);
            return _this;
        }
        Object.defineProperty(BeltBlock.prototype, "leftDir", {
            get: function () {
                return this._leftDir;
            },
            enumerable: true,
            configurable: true
        });
        BeltBlock.prototype.activateBlock = function (cell, blockType) {
            _super.prototype.activateBlock.call(this, cell, blockType);
            if ((this._leftDir = cell.blockCustomData)) {
                this._sprite.animations.play("left");
            }
            else {
                this._sprite.animations.play("right");
            }
        };
        BeltBlock.lDirFrameNames = null;
        BeltBlock.rDirFrameNames = null;
        return BeltBlock;
    }(Blocks.BlockBase));
    Blocks.BeltBlock = BeltBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var eMonsterRoadBlockType;
    (function (eMonsterRoadBlockType) {
        eMonsterRoadBlockType[eMonsterRoadBlockType["left"] = 0] = "left";
        eMonsterRoadBlockType[eMonsterRoadBlockType["right"] = 1] = "right";
        eMonsterRoadBlockType[eMonsterRoadBlockType["connectLeft"] = 2] = "connectLeft";
        eMonsterRoadBlockType[eMonsterRoadBlockType["connectRight"] = 3] = "connectRight";
        eMonsterRoadBlockType[eMonsterRoadBlockType["connectTop"] = 4] = "connectTop";
        eMonsterRoadBlockType[eMonsterRoadBlockType["connectBot"] = 5] = "connectBot";
    })(eMonsterRoadBlockType = Blocks.eMonsterRoadBlockType || (Blocks.eMonsterRoadBlockType = {}));
    var MonsterRoadBlock = (function (_super) {
        __extends(MonsterRoadBlock, _super);
        function MonsterRoadBlock() {
            var _this = _super.call(this) || this;
            _this._type = Blocks.eBlockType.monsterRoad;
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloRoadL");
            _this._sprite.exists = false;
            return _this;
        }
        Object.defineProperty(MonsterRoadBlock.prototype, "roadType", {
            get: function () {
                return this._roadType;
            },
            enumerable: true,
            configurable: true
        });
        MonsterRoadBlock.prototype.activateBlock = function (cell, blockType) {
            _super.prototype.activateBlock.call(this, cell, blockType);
            this._roadType = cell.blockCustomData;
            this._sprite.frameName = MonsterRoadBlock.ROAD_TYPE_FRAME_NAME[this.roadType];
        };
        MonsterRoadBlock.ROAD_TYPE_FRAME_NAME = ["bloRoadL", "bloRoadR", "bloRoadConL", "bloRoadConR", "bloRoadConT", "bloRoadConB"];
        return MonsterRoadBlock;
    }(Blocks.BlockBase));
    Blocks.MonsterRoadBlock = MonsterRoadBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var PortalBlock = (function (_super) {
        __extends(PortalBlock, _super);
        function PortalBlock() {
            var _this = _super.call(this) || this;
            if (PortalBlock.FRAME_NAMES == null) {
                PortalBlock.FRAME_NAMES = Phaser.Animation.generateFrameNames("bloPortal_", 0, 5);
            }
            _this._type = Blocks.eBlockType.portal;
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloPortal_0");
            _this._sprite.exists = false;
            _this._sprite.animations.add("default", PortalBlock.FRAME_NAMES, 10, true, false);
            return _this;
        }
        Object.defineProperty(PortalBlock.prototype, "exit", {
            get: function () {
                return this._exit;
            },
            enumerable: true,
            configurable: true
        });
        PortalBlock.prototype.activateBlock = function (cell, blockType) {
            _super.prototype.activateBlock.call(this, cell, blockType);
            this._exit = cell.blockCustomData;
            this._sprite.animations.play("default");
        };
        return PortalBlock;
    }(Blocks.BlockBase));
    Blocks.PortalBlock = PortalBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var BlockExplosion = (function (_super) {
        __extends(BlockExplosion, _super);
        function BlockExplosion() {
            var _this = _super.call(this) || this;
            _this._showNextPartEvent = null;
            var frameName = "explosion_0";
            _this._group = new Phaser.Group(RoboJump.Global.game);
            _this._group.exists = false;
            _this._group.add(new Phaser.Image(RoboJump.Global.game, 26, 70, RoboJump.Global.ATLAS_KEY_0, frameName));
            _this._group.add(new Phaser.Image(RoboJump.Global.game, 60, 34, RoboJump.Global.ATLAS_KEY_0, frameName));
            _this._group.add(new Phaser.Image(RoboJump.Global.game, 94, 70, RoboJump.Global.ATLAS_KEY_0, frameName));
            _this._group.callAll("anchor.set", "anchor", 0.5, 0.5);
            if (BlockExplosion._frameNames == null)
                BlockExplosion._frameNames = Phaser.Animation.generateFrameNames("explosion_", 0, 8);
            _this._group.callAll('animations.add', 'animations', 'default', BlockExplosion._frameNames, 20, false, false);
            return _this;
        }
        BlockExplosion.prototype.getLayerIndex = function () {
            var layer = this._group.parent;
            if (layer != null)
                return layer.getIndex(this._group);
            return -1;
        };
        BlockExplosion.prototype.activate = function (cell) {
            _super.prototype.activate.call(this, cell);
            this._group.position.set(cell.x, cell.y);
            Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.effects).add(this._group);
            this._group.exists = true;
            for (var i = 1; i < BlockExplosion._PART_CNT; i++)
                this._group.getChildAt(i).exists = false;
            this._partId = 0;
            this.showNextPart();
            this._showNextPartEvent = RoboJump.Global.game.time.events.loop(200, this.showNextPart, this);
        };
        BlockExplosion.prototype.deactivate = function () {
            if (this._group.exists) {
                _super.prototype.deactivate.call(this);
                if (this._showNextPartEvent != null) {
                    RoboJump.Global.game.time.events.remove(this._showNextPartEvent);
                    this._showNextPartEvent = null;
                }
                this._group.parent.removeChild(this._group);
                this._group.exists = false;
                Playfield.Playfield.instance.blockExplosionPool.returnItem(this);
            }
        };
        BlockExplosion.prototype.showNextPart = function () {
            var part = this._group.getChildAt(this._partId++);
            part.exists = true;
            part.animations.play("default").onComplete.add(this.partAnimationComplete, this);
            if (this._partId == BlockExplosion._PART_CNT) {
                RoboJump.Global.game.time.events.remove(this._showNextPartEvent);
                this._showNextPartEvent = null;
            }
        };
        BlockExplosion.prototype.partAnimationComplete = function (part) {
            part.exists = false;
            if (this._group.total == 0 && this._partId == BlockExplosion._PART_CNT) {
                this.deactivate();
            }
        };
        BlockExplosion._frameNames = null;
        BlockExplosion._PART_CNT = 3;
        return BlockExplosion;
    }(Playfield.MapCellContent));
    Blocks.BlockExplosion = BlockExplosion;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var PoisonBlock = (function (_super) {
        __extends(PoisonBlock, _super);
        function PoisonBlock() {
            var _this = _super.call(this) || this;
            _this._type = Blocks.eBlockType.poison;
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bloPoison");
            _this._sprite.exists = false;
            if (PoisonBlock._bubblesFrames == undefined)
                PoisonBlock._bubblesFrames = Phaser.Animation.generateFrameNames("bubbles_", 0, 9);
            var bubbles = new Phaser.Image(RoboJump.Global.game, 26, 8, RoboJump.Global.ATLAS_KEY_0, "bubbles_0");
            bubbles.animations.add("default", PoisonBlock._bubblesFrames, 10, true, false);
            bubbles.exists = false;
            _this._sprite.addChild(bubbles);
            _this._bubbles = bubbles;
            return _this;
        }
        PoisonBlock.prototype.activateBlock = function (cell, blockType) {
            _super.prototype.activateBlock.call(this, cell, blockType);
            this._bubbles.exists = true;
            this._bubbles.animations.play("default");
        };
        PoisonBlock.prototype.deactivate = function () {
            this._bubbles.animations.stop();
            _super.prototype.deactivate.call(this);
        };
        return PoisonBlock;
    }(Blocks.BlockBase));
    Blocks.PoisonBlock = PoisonBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var GateBlock = (function (_super) {
        __extends(GateBlock, _super);
        function GateBlock() {
            var _this = _super.call(this) || this;
            _this._type = Blocks.eBlockType.gate;
            _this._sprite = new Playfield.MapCellUpdatableContentImage(_this, RoboJump.Global.ATLAS_KEY_0, "bloEmpty2");
            _this._sprite.exists = false;
            _this._gate = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "gate_0");
            _this._gate.exists = false;
            _this._gate.animations.add("idle", Phaser.Animation.generateFrameNames("gate_", 0, 3), 10, true, false);
            return _this;
        }
        Object.defineProperty(GateBlock.prototype, "gateSide", {
            get: function () {
                return (this._flags & GateBlock.FLAG_LEFT_GATE) != 0 ? 0 : 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GateBlock.prototype, "locked", {
            get: function () {
                return (this._flags & GateBlock.FLAG_UNLOCKED) == 0;
            },
            enumerable: true,
            configurable: true
        });
        GateBlock.prototype.activateBlock = function (cell, blockType) {
            _super.prototype.activateBlock.call(this, cell, blockType);
            var gate = this._gate;
            if (cell.blockCustomData) {
                this._flags |= GateBlock.FLAG_LEFT_GATE;
                gate.scale.x = 1;
                gate.position.set(this._sprite.x + 3, this._sprite.y + GateBlock.GATE_V_OFFSET);
            }
            else {
                this._flags &= ~GateBlock.FLAG_LEFT_GATE;
                gate.scale.x = -1;
                gate.position.set(this._sprite.x + 117, this._sprite.y + GateBlock.GATE_V_OFFSET);
            }
            Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.cells).add(gate);
            gate.alpha = 1;
            gate.exists = gate.visible = true;
            gate.animations.play("idle");
        };
        GateBlock.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._gate.animations.stop();
            this._gate.parent.removeChild(this._gate);
            this._gate.exists = false;
        };
        GateBlock.prototype.update = function () {
            if (this._gate.exists) {
                this._gate.position.y = this._sprite.y + GateBlock.GATE_V_OFFSET;
                if ((this._flags & GateBlock.FLAG_UNLOCKING) != 0) {
                    var state = (RoboJump.Global.elapsedTime - this._unlockTimer) / 200;
                    if (state < 1) {
                        this._gate.alpha = 1 - state;
                    }
                    else {
                        this._flags &= ~GateBlock.FLAG_UNLOCKING;
                        this._flags |= GateBlock.FLAG_UNLOCKED;
                        this._gate.exists = this._gate.visible = false;
                    }
                }
            }
        };
        GateBlock.prototype.unlock = function () {
            if ((this._flags & (GateBlock.FLAG_UNLOCKED | GateBlock.FLAG_UNLOCKING)) == 0) {
                this._flags |= GateBlock.FLAG_UNLOCKING;
                this._unlockTimer = RoboJump.Global.elapsedTime;
                Utils.AudioUtils.playSound("gateUnlock");
            }
        };
        GateBlock.prototype.moveGateToFxLayer = function () {
            Playfield.Playfield.instance.moveToLayer(this._gate, Playfield.ePlayfieldLayer.effects);
        };
        GateBlock.prototype.moveGateToCellLayer = function () {
            var player = Characters.Player.instance;
            var layerPos = (!player.onCell || player.cell != this._cell ? this.getLayerIndex() : player.getLayerIndex()) + 1;
            Playfield.Playfield.instance.moveToLayer(this._gate, Playfield.ePlayfieldLayer.cells, layerPos);
        };
        GateBlock.FLAG_LEFT_GATE = 0x10000;
        GateBlock.FLAG_UNLOCKED = 0x20000;
        GateBlock.FLAG_UNLOCKING = 0x40000;
        GateBlock.GATE_V_OFFSET = -31;
        return GateBlock;
    }(Blocks.BlockBase));
    Blocks.GateBlock = GateBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var eCatapultState;
    (function (eCatapultState) {
        eCatapultState[eCatapultState["idle"] = 0] = "idle";
        eCatapultState[eCatapultState["countdown"] = 1] = "countdown";
        eCatapultState[eCatapultState["launch"] = 2] = "launch";
        eCatapultState[eCatapultState["launched"] = 3] = "launched";
    })(eCatapultState || (eCatapultState = {}));
    var CatapultBlock = (function (_super) {
        __extends(CatapultBlock, _super);
        function CatapultBlock() {
            var _this = _super.call(this) || this;
            _this._type = Blocks.eBlockType.catapult;
            _this._sprite = new Playfield.MapCellUpdatableContentImage(_this, RoboJump.Global.ATLAS_KEY_0, "bloCatapult");
            _this._sprite.pivot.y = -34;
            _this._sprite.exists = false;
            if (CatapultBlock._frameNames == undefined) {
                CatapultBlock._frameNames = [];
                var commonFrameNames = Phaser.Animation.generateFrameNames("catapult_", 0, 3);
                CatapultBlock._frameNames.push(commonFrameNames.concat(Phaser.Animation.generateFrameNames("catapultL_", 4, 6)));
                CatapultBlock._frameNames.push(commonFrameNames.concat(Phaser.Animation.generateFrameNames("catapultR_", 4, 6)));
            }
            _this._catapult = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "catapult_0");
            _this._catapult.pivot.set(4, 26);
            _this._catapult.animations.add("left", CatapultBlock._frameNames[0], 10, false, false);
            _this._catapult.animations.add("right", CatapultBlock._frameNames[1], 10, false, false);
            _this._catapult.exists = false;
            return _this;
        }
        CatapultBlock.prototype.activateBlock = function (cell, blockType) {
            _super.prototype.activateBlock.call(this, cell, blockType);
            this._catapult.position.set(cell.x, cell.y);
            this._catapult.frameName = "catapult_0";
            this._catapult.exists = true;
            Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.cells).add(this._catapult);
            this._launchDir = (cell.col < 2 || cell.col == 2 && RoboJump.Global.game.rnd.realInRange(0, 1) < 0.5 ? -1 : 0);
            this._state = eCatapultState.idle;
        };
        CatapultBlock.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._catapult.animations.stop();
            this._catapult.parent.removeChild(this._catapult);
            this._catapult.exists = false;
        };
        CatapultBlock.prototype.update = function () {
            this._catapult.position.y = this._sprite.y;
            if (this._state == eCatapultState.countdown) {
                if (this._launchTimer <= RoboJump.Global.elapsedTime) {
                    var neighborCell = void 0;
                    if (this._launchDir < 0) {
                        neighborCell = Playfield.Playfield.instance.mapCell(this._cell.col - 1, this._cell.row);
                    }
                    else {
                        neighborCell = Playfield.Playfield.instance.mapCell(this._cell.col + 1, this._cell.row);
                    }
                    if (neighborCell != undefined && neighborCell.active) {
                        var neighborCellLayerPos = neighborCell.block.getLayerIndex();
                        if (neighborCellLayerPos > this.getLayerIndex()) {
                            var layer = this._catapult.parent;
                            layer.removeChild(this._catapult);
                            layer.add(this._catapult, true, neighborCellLayerPos + 1);
                        }
                    }
                    this._catapult.animations.play(this._launchDir < 0 ? "left" : "right");
                    this._state = eCatapultState.launch;
                }
            }
            else if (this._state == eCatapultState.launch) {
                var player = Characters.Player.instance;
                if (this._catapult.frameName == "catapult_3") {
                    Utils.AudioUtils.playSound("catapult");
                    this._state = eCatapultState.launched;
                    if (player.onCell && player.cell == this._cell)
                        player.catapult(this._launchDir);
                }
            }
        };
        CatapultBlock.prototype.startLaunchCountdown = function () {
            if (this._state == eCatapultState.idle) {
                this._state = eCatapultState.countdown;
                this._launchTimer = RoboJump.Global.elapsedTime + CatapultBlock.LAUNCH_DELAY;
            }
        };
        CatapultBlock.prototype.cancelLaunchCountdown = function () {
            if (this._state == eCatapultState.countdown) {
                this._state = eCatapultState.idle;
            }
        };
        CatapultBlock.LAUNCH_DELAY = 400;
        return CatapultBlock;
    }(Blocks.BlockBase));
    Blocks.CatapultBlock = CatapultBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var SpikyBlock = (function (_super) {
        __extends(SpikyBlock, _super);
        function SpikyBlock() {
            var _this = _super.call(this) || this;
            _this._type = Blocks.eBlockType.spikes;
            _this._sprite = new Playfield.MapCellUpdatableContentImage(_this, RoboJump.Global.ATLAS_KEY_0, "bloSpiky");
            _this._sprite.exists = false;
            _this._spikes = [];
            for (var i = 0; i < 3; i++)
                _this._spikes.push(null);
            return _this;
        }
        SpikyBlock.prototype.isDeadly = function (spikesType) {
            var spikes = this._spikes[spikesType];
            return (spikes != null && spikes.deadly);
        };
        SpikyBlock.prototype.activateBlock = function (cell, blockType) {
            _super.prototype.activateBlock.call(this, cell, blockType);
            var plf = Playfield.Playfield.instance;
            var spikesPool = plf.blockSpikesPool;
            var mask = cell.blockCustomData;
            for (var groupId = 0; groupId < 2; groupId++) {
                var groupMask = (groupId == 0 ? mask & 0xF : (mask >> 4) & 0xF);
                if (groupMask == 0)
                    continue;
                var group = plf.spikyBlockGroup(groupId);
                for (var spikesType = 0; spikesType < 3; spikesType++) {
                    if ((groupMask & (1 << spikesType)) != 0) {
                        var spikes = spikesPool.getItem();
                        this._spikes[spikesType] = spikes;
                        this._sprite.addChild(spikes.activate(this, spikesType, group));
                    }
                }
            }
        };
        SpikyBlock.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            var spikesPool = Playfield.Playfield.instance.blockSpikesPool;
            for (var i = 0; i < 3; i++) {
                var spikes = this._spikes[i];
                if (spikes != null) {
                    spikes.deactivate();
                    spikesPool.returnItem(spikes);
                    this._spikes[i] = null;
                }
            }
        };
        SpikyBlock.prototype.update = function () {
            var i = 3;
            while (i-- != 0) {
                var spikes = this._spikes[i];
                if (spikes != null)
                    spikes.update();
            }
        };
        return SpikyBlock;
    }(Blocks.BlockBase));
    Blocks.SpikyBlock = SpikyBlock;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var SpikyBlockGroup = (function () {
        function SpikyBlockGroup(groupId) {
            if (SpikyBlockGroup._vFrames == undefined) {
                SpikyBlockGroup._vFrames = Phaser.Animation.generateFrameNames("spikesV_", 0, 7);
                SpikyBlockGroup._hFrames = Phaser.Animation.generateFrameNames("spikesH_", 0, 7);
            }
            this._groupId = groupId;
        }
        Object.defineProperty(SpikyBlockGroup.prototype, "groupId", {
            get: function () { return this._groupId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpikyBlockGroup.prototype, "newFrame", {
            get: function () { return this._newFrame; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpikyBlockGroup.prototype, "deadly", {
            get: function () { return this._deadly; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpikyBlockGroup.prototype, "justDeadly", {
            get: function () { return this._justDeadly; },
            enumerable: true,
            configurable: true
        });
        SpikyBlockGroup.prototype.reset = function () {
            this._deadly = false;
            this._curFrameId = -1;
            this.update();
            this._justDeadly = false;
        };
        SpikyBlockGroup.prototype.update = function () {
            var lifePos = RoboJump.Global.elapsedTime % (SpikyBlockGroup.STATE_LEN * 2);
            if (this._groupId != 0)
                lifePos = (lifePos + SpikyBlockGroup.STATE_LEN) % (SpikyBlockGroup.STATE_LEN * 2);
            var frameId = 0;
            if (lifePos < SpikyBlockGroup.STATE_LEN) {
                if (lifePos < SpikyBlockGroup.ANIM_LEN) {
                    frameId = Math.floor((lifePos / SpikyBlockGroup.ANIM_LEN) * (SpikyBlockGroup._vFrames.length - 1));
                }
                else {
                    frameId = SpikyBlockGroup._vFrames.length - 1;
                }
            }
            else {
                lifePos -= SpikyBlockGroup.STATE_LEN;
                if (lifePos < SpikyBlockGroup.ANIM_LEN) {
                    frameId = SpikyBlockGroup._vFrames.length - Math.ceil((lifePos / SpikyBlockGroup.ANIM_LEN) * (SpikyBlockGroup._vFrames.length - 1));
                }
                else {
                    frameId = 0;
                }
            }
            this._newFrame = false;
            if (this._curFrameId != frameId) {
                this._curFrameId = frameId;
                this._newFrame = true;
            }
            this._justDeadly = false;
            var deadly = frameId >= 5;
            if (deadly != this._deadly) {
                if (deadly)
                    this._justDeadly = true;
                this._deadly = deadly;
            }
        };
        SpikyBlockGroup.prototype.getCurFrame = function (spikesType) {
            if (spikesType == Blocks.eSpikesType.top) {
                return SpikyBlockGroup._vFrames[this._curFrameId];
            }
            return SpikyBlockGroup._hFrames[this._curFrameId];
        };
        SpikyBlockGroup.STATE_LEN = 1200;
        SpikyBlockGroup.ANIM_LEN = 400;
        return SpikyBlockGroup;
    }());
    Blocks.SpikyBlockGroup = SpikyBlockGroup;
})(Blocks || (Blocks = {}));
var Blocks;
(function (Blocks) {
    var eSpikesType;
    (function (eSpikesType) {
        eSpikesType[eSpikesType["top"] = 0] = "top";
        eSpikesType[eSpikesType["left"] = 1] = "left";
        eSpikesType[eSpikesType["right"] = 2] = "right";
    })(eSpikesType = Blocks.eSpikesType || (Blocks.eSpikesType = {}));
    var SpikyBlockSpikes = (function () {
        function SpikyBlockSpikes() {
            this._image = RoboJump.Global.game.make.image(0, 0, RoboJump.Global.ATLAS_KEY_0);
            this._image.anchor.set(0.5);
        }
        Object.defineProperty(SpikyBlockSpikes.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpikyBlockSpikes.prototype, "deadly", {
            get: function () { return this._group.deadly; },
            enumerable: true,
            configurable: true
        });
        SpikyBlockSpikes.prototype.activate = function (block, type, group) {
            this._type = type;
            this._group = group;
            this._block = block;
            switch (type) {
                case eSpikesType.top: {
                    this._image.position.set(SpikyBlockSpikes.V_SPIKES_OFFSET_X, SpikyBlockSpikes.V_SPIKES_OFFSET_Y);
                    this._image.scale.x = 1;
                    break;
                }
                case eSpikesType.left: {
                    this._image.position.set(Playfield.Playfield.CELL_CENTER_X - SpikyBlockSpikes.H_SPIKES_OFFSET_X, SpikyBlockSpikes.H_SPIKES_OFFSET_Y);
                    this._image.scale.x = 1;
                    break;
                }
                default: {
                    this._image.position.set(Playfield.Playfield.CELL_CENTER_X + SpikyBlockSpikes.H_SPIKES_OFFSET_X, SpikyBlockSpikes.H_SPIKES_OFFSET_Y);
                    this._image.scale.x = -1;
                    break;
                }
            }
            this._image.frameName = group.getCurFrame(type);
            this._image.exists = true;
            return this._image;
        };
        SpikyBlockSpikes.prototype.deactivate = function () {
            this._group = null;
            this._block = null;
            this._image.parent.removeChild(this._image);
            this._image.exists = false;
        };
        SpikyBlockSpikes.prototype.update = function () {
            if (this._group.newFrame) {
                this._image.frameName = this._group.getCurFrame(this._type);
            }
            if (this._group.justDeadly) {
                var cell = this._block.cell;
                if (this._type == eSpikesType.left) {
                    cell = Playfield.Playfield.instance.getCellNeighbor(cell, true, false);
                }
                else if (this._type == eSpikesType.right) {
                    cell = Playfield.Playfield.instance.getCellNeighbor(cell, false, false);
                }
                if (cell != null && cell.character != undefined) {
                    var player = Characters.Player.instance;
                    if (player.onCell)
                        Characters.Player.instance.killed();
                }
            }
        };
        SpikyBlockSpikes.V_SPIKES_OFFSET_X = 60;
        SpikyBlockSpikes.V_SPIKES_OFFSET_Y = 30;
        SpikyBlockSpikes.H_SPIKES_OFFSET_X = 32;
        SpikyBlockSpikes.H_SPIKES_OFFSET_Y = 87;
        return SpikyBlockSpikes;
    }());
    Blocks.SpikyBlockSpikes = SpikyBlockSpikes;
})(Blocks || (Blocks = {}));
var Bonuses;
(function (Bonuses) {
    var eBonusType;
    (function (eBonusType) {
        eBonusType[eBonusType["score"] = 0] = "score";
        eBonusType[eBonusType["potion"] = 1] = "potion";
        eBonusType[eBonusType["none"] = 2] = "none";
    })(eBonusType = Bonuses.eBonusType || (Bonuses.eBonusType = {}));
    var BonusBase = (function (_super) {
        __extends(BonusBase, _super);
        function BonusBase(type, pickupFxFrameName) {
            var _this = _super.call(this) || this;
            _this._type = type;
            _this._pickupFxFrameName = pickupFxFrameName;
            return _this;
        }
        Object.defineProperty(BonusBase.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BonusBase.prototype, "pickupFxFrameName", {
            get: function () {
                return this._pickupFxFrameName;
            },
            enumerable: true,
            configurable: true
        });
        BonusBase.prototype.getLayerIndex = function () {
            var layer = this._sprite.parent;
            if (layer != null)
                return layer.getIndex(this._sprite);
            return -1;
        };
        BonusBase.prototype.activate = function (cell) {
            var sprite = this._sprite;
            sprite.position.set(cell.x + BonusBase.X_OFFSET, cell.y + BonusBase.Y_OFFSET);
            sprite.alpha = 1;
            sprite.exists = true;
            Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.cells).add(sprite);
            sprite.animations.play("idle");
            this._cell = cell;
        };
        BonusBase.prototype.deactivate = function () {
            RoboJump.Global.game.tweens.removeFrom(this._sprite);
            this._cell.removeBonus();
            this._cell = undefined;
            this._sprite.parent.removeChild(this._sprite);
            this._sprite.exists = false;
            Playfield.Playfield.instance.bonusPool(this._type).returnItem(this);
        };
        BonusBase.prototype.collapse = function () {
            var tween = Playfield.MapCellContent.collapseObject(this._sprite, true);
            tween.onComplete.add(function () {
                this.deactivate();
            }, this);
        };
        BonusBase.X_OFFSET = 60;
        BonusBase.Y_OFFSET = 34;
        return BonusBase;
    }(Playfield.MapCellContent));
    Bonuses.BonusBase = BonusBase;
})(Bonuses || (Bonuses = {}));
var Bonuses;
(function (Bonuses) {
    var BonusPickupFx = (function (_super) {
        __extends(BonusPickupFx, _super);
        function BonusPickupFx() {
            var _this = _super.call(this) || this;
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0);
            _this._sprite.exists = false;
            _this._sprite.anchor.set(0.5);
            return _this;
        }
        BonusPickupFx.prototype.getLayerIndex = function () {
            var layer = this._sprite.parent;
            if (layer != null)
                return layer.getIndex(this._sprite);
            return -1;
        };
        BonusPickupFx.prototype.activate = function (cell) {
            _super.prototype.activate.call(this, cell);
            var sprite = this._sprite;
            sprite.frameName = this._cell.bonus.pickupFxFrameName;
            sprite.exists = true;
            sprite.alpha = 1;
            sprite.scale.set(1);
            Playfield.Playfield.instance.displayLayer(Playfield.ePlayfieldLayer.effects).add(sprite, true);
            sprite.position.set(this._cell.x + Playfield.Playfield.CELL_CENTER_X, this._cell.y + Playfield.Playfield.CELL_CENTER_Y - 40);
            RoboJump.Global.game.add.tween(this._sprite).to({ y: sprite.y - 100 }, 750, Phaser.Easing.Cubic.Out, true);
            RoboJump.Global.game.add.tween(this._sprite.scale).to({ x: 1.5, y: 1.5 }, 500, Phaser.Easing.Cubic.In, true, 300);
            RoboJump.Global.game.add.tween(this._sprite).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 600).onComplete.add(this.deactivate, this);
        };
        BonusPickupFx.prototype.deactivate = function () {
            var sprite = this._sprite;
            if (sprite.exists) {
                RoboJump.Global.game.tweens.removeFrom(this._sprite);
                RoboJump.Global.game.tweens.removeFrom(this._sprite.scale);
                this._sprite.parent.removeChild(this._sprite);
                this._sprite.exists = false;
                _super.prototype.deactivate.call(this);
                Playfield.Playfield.instance.bonusPickupFxPool.returnItem(this);
            }
        };
        return BonusPickupFx;
    }(Playfield.MapCellContent));
    Bonuses.BonusPickupFx = BonusPickupFx;
})(Bonuses || (Bonuses = {}));
var Bonuses;
(function (Bonuses) {
    var ScoreBonus = (function (_super) {
        __extends(ScoreBonus, _super);
        function ScoreBonus() {
            var _this = _super.call(this, Bonuses.eBonusType.score, "pickupFxScoreBns") || this;
            if (ScoreBonus._frameNames == undefined) {
                ScoreBonus._frameNames = Phaser.Animation.generateFrameNames("bonusScore_", 0, 13, "", 2);
            }
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bonusScore_00");
            _this._sprite.exists = false;
            _this._sprite.pivot.set(24, 66);
            _this._sprite.animations.add("idle", ScoreBonus._frameNames, 15, true, false);
            return _this;
        }
        return ScoreBonus;
    }(Bonuses.BonusBase));
    Bonuses.ScoreBonus = ScoreBonus;
})(Bonuses || (Bonuses = {}));
var Bonuses;
(function (Bonuses) {
    var Potion = (function (_super) {
        __extends(Potion, _super);
        function Potion() {
            var _this = _super.call(this, Bonuses.eBonusType.potion, "pickupFxPotion") || this;
            if (Potion._frameNames == undefined) {
                Potion._frameNames = Phaser.Animation.generateFrameNames("bonusPotion_", 0, 13, "", 2);
            }
            _this._sprite = new Phaser.Image(RoboJump.Global.game, 0, 0, RoboJump.Global.ATLAS_KEY_0, "bonusPotion_00");
            _this._sprite.exists = false;
            _this._sprite.pivot.set(24, 66);
            _this._sprite.animations.add("idle", Potion._frameNames, 15, true, false);
            return _this;
        }
        return Potion;
    }(Bonuses.BonusBase));
    Bonuses.Potion = Potion;
})(Bonuses || (Bonuses = {}));
var RoboJump;
(function (RoboJump) {
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
            _this.state.add("Boot", RoboJump.Boot);
            _this.state.add("Preload", RoboJump.Preload);
            _this.state.add("Play", RoboJump.Play);
            _this.state.start("Boot");
            return _this;
        }
        return Game;
    }(Phaser.Game));
    RoboJump.Game = Game;
})(RoboJump || (RoboJump = {}));
var RoboJump;
(function (RoboJump) {
    var Sounds = (function () {
        function Sounds() {
        }
        Sounds.AUDIO_JSON = {
            "resources": [
                "sfx.ogg",
                "sfx.mp3"
            ],
            "spritemap": {
                "click": {
                    "start": 0,
                    "end": 0.07888888888888888,
                    "loop": false
                },
                "bonus": {
                    "start": 2,
                    "end": 2.5174149659863945,
                    "loop": false
                },
                "explosion": {
                    "start": 4,
                    "end": 4.978775510204081,
                    "loop": false
                },
                "fall": {
                    "start": 6,
                    "end": 6.8375510204081635,
                    "loop": false
                },
                "intro": {
                    "start": 8,
                    "end": 8.615668934240363,
                    "loop": false
                },
                "jump": {
                    "start": 10,
                    "end": 10.250770975056689,
                    "loop": false
                },
                "monsterKill": {
                    "start": 12,
                    "end": 12.85814058956916,
                    "loop": false
                },
                "sticky": {
                    "start": 14,
                    "end": 14.16718820861678,
                    "loop": false
                },
                "teleport": {
                    "start": 16,
                    "end": 16.80185941043084,
                    "loop": false
                },
                "conveyorBelt": {
                    "start": 18,
                    "end": 18.5,
                    "loop": false
                },
                "gateLocked": {
                    "start": 20,
                    "end": 20.88061224489796,
                    "loop": false
                },
                "gateUnlock": {
                    "start": 22,
                    "end": 23.138163265306122,
                    "loop": false
                },
                "poison": {
                    "start": 25,
                    "end": 25.880975056689344,
                    "loop": false
                },
                "potion": {
                    "start": 27,
                    "end": 28.475759637188208,
                    "loop": false
                },
                "switchRobot": {
                    "start": 30,
                    "end": 31.29954648526077,
                    "loop": false
                },
                "catapult": {
                    "start": 33,
                    "end": 33.873605442176874,
                    "loop": false
                }
            }
        };
        return Sounds;
    }());
    RoboJump.Sounds = Sounds;
})(RoboJump || (RoboJump = {}));
var RoboJump;
(function (RoboJump) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._gameMinDims = new Phaser.Point(RoboJump.Global.GAME_MIN_WIDTH, RoboJump.Global.GAME_MIN_HEIGHT);
            _this._gameMaxDims = new Phaser.Point(RoboJump.Global.GAME_MAX_WIDTH, RoboJump.Global.GAME_MAX_HEIGHT);
            _this._gameDims = new Phaser.Point();
            _this._userScale = new Phaser.Point(0, 0);
            return _this;
        }
        Boot.prototype.init = function () {
            this.input.maxPointers = 1;
            this.game.renderer.renderSession.roundPixels = true;
            this.stage.disableVisibilityChange = true;
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
    RoboJump.Boot = Boot;
})(RoboJump || (RoboJump = {}));
var RoboJump;
(function (RoboJump) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._background = null;
            return _this;
        }
        Object.defineProperty(Play, "instance", {
            get: function () { return Play._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "mode", {
            get: function () { return this._mode; },
            enumerable: true,
            configurable: true
        });
        Play.prototype.init = function () {
            Play._instance = this;
        };
        Play.prototype.create = function () {
            var _this = this;
            var game = this.game;
            if (RoboJump.Global.DEBUG != false) {
                this._debugText = this.game.add.text(10, 10, "", { font: "Courier", fontSize: 14, fill: "#FFFFFF" });
                this._debugText.lineSpacing = 2;
                this._debugText.fixedToCamera = true;
            }
            this._view = new RoboJump.ViewController(this);
            this._background = game.add.image(0, 0, "atlas0", "background");
            this._background.fixedToCamera = true;
            this._background.height = this.camera.height;
            this._playfield = new Playfield.Playfield();
            this._player = new Characters.Player(this);
            this._tutorial = new RoboJump.Tutorial();
            this._reviveScreen = new RoboJump.ReviveScreen();
            this._reviveScreen.onComplete.add(function (revive) {
                if (revive) {
                    _this.resetGame(true);
                }
                else {
                    _this.endGame();
                }
            }, this);
            this._cursorKeys = game.input.keyboard.createCursorKeys();
            game.input.onDown.add(function (pointer) {
                _this.playerJump(pointer.x < (_this.world.width >> 1));
            }, this);
            if (this._debugText != undefined)
                this._debugText.bringToTop();
            this.resetGame(false);
            if (Gamee2.Gamee.initialized) {
                Gamee2.Gamee.onStart.add(this.onGameeStart, this);
                Gamee2.Gamee.onPause.add(this.onGameePause, this);
                Gamee2.Gamee.onResume.add(this.onGameeResume, this);
                Gamee2.Gamee.onMute.add(this.onGameeMute, this);
                Gamee2.Gamee.onUnmute.add(this.onGameeUnmute, this);
                this._mode = 4;
                Gamee2.Gamee.gameReady();
            }
        };
        Play.prototype.update = function () {
            RoboJump.Global.elapsedTime = this.time.elapsedSince(this._timeBase);
            RoboJump.Global.deltaRatio = this.time.elapsedMS / (1000 / 60);
            this._view.update();
            if (this._cursorKeys.left.justDown) {
                this.playerJump(true);
            }
            else if (this._cursorKeys.right.justDown) {
                this.playerJump(false);
            }
            this._playfield.update();
        };
        Play.prototype.resumed = function () {
            this._timeBase += this.time.pauseDuration;
        };
        Play.prototype.gameOver = function () {
            if (this._mode != 0)
                return;
            if (this._gameCredits != 0 && this._player.depth > 10 && (!Gamee2.Gamee.initialized || Gamee2.Gamee.adState == Gamee2.eAdState.ready)) {
                this._mode = 1;
                this._reviveScreen.show();
            }
            else {
                this.endGame();
            }
        };
        Play.prototype.playerJump = function (left) {
            if (this._mode != 0) {
                if (this._mode == 3) {
                    this._mode = 0;
                    this._tutorial.hide();
                }
                else {
                    return;
                }
            }
            if (this._player.flippedDir)
                left = !left;
            this._player.jump(left);
        };
        Play.prototype.resetGame = function (restartFromCP) {
            if (restartFromCP) {
                this._gameCredits--;
            }
            else {
                this._gameCredits = 1;
            }
            this.game.tweens.removeAll();
            this.game.time.removeAll();
            this.game.paused = false;
            this._timeBase = this.time.elapsedSince(0);
            RoboJump.Global.elapsedTime = 0;
            this._view.reset(restartFromCP);
            this._playfield.reset(restartFromCP);
            this._player.reset();
            this._reviveScreen.reset();
            this._tutorial.hide();
            this._tutorial.show();
            this._mode = 3;
        };
        Play.prototype.endGame = function () {
            if (!Gamee2.Gamee.initialized) {
                this.resetGame(false);
            }
            else {
                Gamee2.Gamee.gameOver();
                this.game.paused = true;
            }
        };
        Play.prototype.onResize = function (newGameW, newGameH) {
            if (this._background != null) {
                this._background.height = this.camera.height;
            }
            this._view.updateOffsets();
            if (this._tutorial.visible) {
                this._tutorial.reposition();
            }
            this._reviveScreen.handleScreenResize(newGameW, newGameH);
        };
        Play.prototype.onGameeStart = function () {
            Gamee2.Gamee.loadAd();
            if (this._mode != 4) {
                this.resetGame(false);
            }
            else {
                this._mode = 3;
            }
            Utils.AudioUtils.playSound("intro");
        };
        Play.prototype.onGameePause = function () {
            this.game.paused = true;
        };
        Play.prototype.onGameeResume = function () {
            this.game.paused = false;
        };
        Play.prototype.onGameeMute = function () {
            Utils.AudioUtils.sfxOn = false;
            Utils.AudioUtils.musicOn = false;
        };
        Play.prototype.onGameeUnmute = function () {
            Utils.AudioUtils.sfxOn = true;
            Utils.AudioUtils.musicOn = true;
        };
        return Play;
    }(Phaser.State));
    RoboJump.Play = Play;
})(RoboJump || (RoboJump = {}));
var RoboJump;
(function (RoboJump) {
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
            this.load.atlasJSONArray("atlas0");
            for (var mapId = 0; mapId <= 12; mapId++)
                this.load.json("map_" + mapId);
            if (!this.game.device.webAudio) {
                for (var property in RoboJump.Sounds.AUDIO_JSON.spritemap) {
                    this.load.audio(property, property + ".mp3");
                }
            }
            else {
                this.load.audiosprite("sfx", RoboJump.Sounds.AUDIO_JSON.resources, null, RoboJump.Sounds.AUDIO_JSON);
            }
            Gamee2.Gamee.onInitialized.add(function (initState, initData) {
                if (initState != Gamee2.eInitState.ok)
                    throw new Error("gamee.gameInit() failed");
                if (!initData.sound) {
                    Utils.AudioUtils.sfxOn = false;
                    Utils.AudioUtils.musicOn = false;
                }
                _this._gameeInitialized = true;
            }, this);
            this._gameeInitialized = !Gamee2.Gamee.initialize("FullScreen", ["rewardedAds"]);
        };
        Preload.prototype.create = function () {
            if (!this.game.device.webAudio) {
                for (var property in RoboJump.Sounds.AUDIO_JSON.spritemap) {
                    var snd = this.add.audio(property);
                    snd.allowMultiple = true;
                    Utils.AudioUtils.addSfxSound(property, snd);
                }
            }
            else {
                var audioSprite = this.add.audioSprite("sfx");
                for (var property in RoboJump.Sounds.AUDIO_JSON.spritemap) {
                    audioSprite.sounds[property].allowMultiple = true;
                }
                Utils.AudioUtils.setSfxAudioSprite(audioSprite);
            }
        };
        Preload.prototype.update = function () {
            if (!this._gameeInitialized)
                return;
            if (this._ready == false) {
                this._ready = true;
                this.game.state.start("Play");
            }
        };
        return Preload;
    }(Phaser.State));
    RoboJump.Preload = Preload;
})(RoboJump || (RoboJump = {}));
var RoboJump;
(function (RoboJump) {
    var ViewController = (function () {
        function ViewController(playState) {
            ViewController._instance = this;
            this._playState = playState;
            RoboJump.Global.game.camera.bounds = null;
            this.updateOffsets();
        }
        Object.defineProperty(ViewController, "instance", {
            get: function () { return this._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewController.prototype, "playerOutOfBounds", {
            get: function () {
                var camera = RoboJump.Global.game.camera;
                return (camera.y + camera.height - Characters.Player.instance.y < ViewController.PLAYER_BOTTOM_MIN_OFFSET);
            },
            enumerable: true,
            configurable: true
        });
        ViewController.prototype.reset = function (restartFromCP) {
            if (restartFromCP) {
                var pf = Playfield.Playfield.instance;
                RoboJump.Global.game.camera.y = pf.checkpoint.row * Playfield.Playfield.CELL_HEIGHT;
                this._startPlayerDepth = pf.checkpoint.row;
            }
            else {
                RoboJump.Global.game.camera.y = 0;
                this._startPlayerDepth = 0;
            }
            this._cameraStepWholePixRem = 0;
            this.autoScrollSpeed = ViewController.AUTO_MOVE_MIN_SPEED;
        };
        ViewController.prototype.incrementSpeed = function () {
            if (this.autoScrollSpeed < ViewController.AUTO_MOVE_MAX_SPEED)
                RoboJump.Global.game.add.tween(this).to({ autoScrollSpeed: this.autoScrollSpeed + 1 }, 2000, Phaser.Easing.Linear.None, true);
        };
        ViewController.prototype.updateOffsets = function () {
            var camera = RoboJump.Global.game.camera;
            ViewController.PLAYER_BOTTOM_MIN_OFFSET = camera.height >> 1;
            ViewController.PLAYER_BOTTOM_MAX_OFFSET = Math.round((camera.height / 3) * 2);
        };
        ViewController.prototype.update = function () {
            var camera = RoboJump.Global.game.camera;
            var player = Characters.Player.instance;
            if (player.state <= Characters.ePlayerState.portalExit) {
                var moveStep = this._cameraStepWholePixRem;
                if (this._playState.mode == 0)
                    moveStep += this.autoScrollSpeed * RoboJump.Global.deltaRatio;
                var plY = Math.round(player.y);
                var plBotOffset = camera.y + camera.height - plY;
                if (plBotOffset < ViewController.PLAYER_BOTTOM_MAX_OFFSET) {
                    var followSpeed = ViewController.PLAYER_FOLLOW_MIN_SPEED + (ViewController.PLAYER_FOLLOW_MAX_SPEED - ViewController.PLAYER_FOLLOW_MIN_SPEED) *
                        (1 - ((plBotOffset - ViewController.PLAYER_BOTTOM_MIN_OFFSET) / (ViewController.PLAYER_BOTTOM_MAX_OFFSET - ViewController.PLAYER_BOTTOM_MIN_OFFSET)));
                    moveStep += (followSpeed * RoboJump.Global.deltaRatio);
                }
                var flooredMoveStep = Math.floor(moveStep);
                this._cameraStepWholePixRem = moveStep - flooredMoveStep;
                camera.y += flooredMoveStep;
                if (plBotOffset < ViewController.PLAYER_BOTTOM_MAX_OFFSET) {
                    if (camera.y + camera.height - plY > ViewController.PLAYER_BOTTOM_MAX_OFFSET)
                        camera.y = plY + ViewController.PLAYER_BOTTOM_MAX_OFFSET - camera.height;
                }
            }
        };
        ViewController.AUTO_MOVE_MIN_SPEED = 1;
        ViewController.AUTO_MOVE_MAX_SPEED = 3;
        ViewController.PLAYER_FOLLOW_MIN_SPEED = 1;
        ViewController.PLAYER_FOLLOW_MAX_SPEED = 8;
        return ViewController;
    }());
    RoboJump.ViewController = ViewController;
})(RoboJump || (RoboJump = {}));
//# sourceMappingURL=AtomicDrop.js.map
