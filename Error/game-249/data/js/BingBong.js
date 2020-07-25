var Gamee2;
(function (Gamee2) {
    class Gamee {
        static get events() { return Gamee._events; }
        static get initialized() { return this._initState == 1; }
        static get initData() { return Gamee._initData; }
        static get startFlags() { return Gamee._startFlags; }
        static initialize(controller, gameCapabilities) {
            if (Gamee._initState == 0) {
                if (window.gamee == undefined) {
                    Gamee._initState = 3;
                    console.log("GAMEE doesn't exist");
                    return false;
                }
                Gamee._initState = 2;
                window.gamee.gameInit(controller, {}, gameCapabilities, function (error, data) {
                    if (error == null) {
                        Gamee._initState = 1;
                        Gamee._initData = data;
                        window.gamee.emitter.addEventListener("start", function (event) {
                            let flags = 0;
                            if (event.detail != undefined) {
                                if (event.detail.opt_replay != undefined && event.detail.opt_replay != false)
                                    flags |= 1;
                                if (event.detail.opt_ghostMode != undefined && event.detail.opt_ghostMode != false)
                                    flags |= 2;
                                if (event.detail.opt_resetState != undefined && event.detail.opt_resetState != false)
                                    flags |= 4;
                            }
                            Gamee._score = 0;
                            Gamee._startFlags = flags;
                            Gamee._events.emit("start", flags);
                        });
                        window.gamee.emitter.addEventListener("pause", function () {
                            Gamee._events.emit("pause");
                        });
                        window.gamee.emitter.addEventListener("resume", function () {
                            Gamee._events.emit("resume");
                        });
                        window.gamee.emitter.addEventListener("mute", function () {
                            Gamee._events.emit("audioChange", false);
                        });
                        window.gamee.emitter.addEventListener("unmute", function () {
                            Gamee._events.emit("audioChange", true);
                        });
                        window.gamee.emitter.addEventListener("ghostHide", function () {
                            Gamee._events.emit("ghostChange", false);
                        });
                        window.gamee.emitter.addEventListener("ghostShow", function () {
                            Gamee._events.emit("ghostChange", true);
                        });
                    }
                    else {
                        Gamee._initState = 3;
                        console.log(error);
                    }
                    Gamee._events.emit("initialized", Gamee._initState, data);
                });
            }
            return true;
        }
        static get ready() { return Gamee._ready; }
        static gameReady() {
            if (Gamee._initState == 1 && !Gamee._ready) {
                window.gamee.gameReady(function (error) {
                    if (error == null) {
                        Gamee._ready = true;
                    }
                    else {
                        console.log(error);
                    }
                });
            }
        }
        static requestSocial(cbFnc, cbCtx, entryCnt = 10) {
            if (Gamee._initState == 1) {
                window.gamee.requestSocial(function (error, data) {
                    let player;
                    let friends;
                    if (!error && data && data.socialData) {
                        player = data.socialData.player;
                        friends = data.socialData.friends;
                    }
                    cbFnc.call(cbCtx, player, friends);
                }, entryCnt);
            }
        }
        static requestPlayerReplay(cbFnc, cbCtx, playerId) {
            if (Gamee._initState == 1) {
                window.gamee.requestPlayerReplay(playerId, function (error, data) {
                    let replayData;
                    if (data && data.replayData) {
                        replayData = data.replayData.data;
                    }
                    else {
                        replayData = null;
                    }
                    cbFnc.call(cbCtx, replayData);
                });
            }
        }
        static requestPlayerSaveData(cbFnc, cbCtx, playerId) {
            if (Gamee._initState == 1) {
                window.gamee.requestPlayerSaveState(playerId, function (error, data) {
                    let saveData;
                    if (data && data.saveState) {
                        saveData = data.saveState;
                    }
                    else {
                        saveData = "";
                    }
                    cbFnc.call(cbCtx, saveData);
                });
            }
        }
        static requestPlayerData(cbFnc, cbCtx, playerId) {
            if (Gamee._initState == 1) {
                window.gamee.requestPlayerData(function (error, data) {
                    cbFnc.call(cbCtx, data ? data.player : undefined);
                });
            }
        }
        static requestBattleData(cbFnc, cbCtx) {
            if (Gamee._initState == 1) {
                window.gamee.requestBattleData((error, data) => {
                    cbFnc.call(cbCtx, data ? data.battle : undefined);
                });
            }
        }
        static logEvent(name, value = "") {
            if (Gamee._ready) {
                window.gamee.logEvent(name, value);
            }
        }
        static share(data, cbFnc, cbCtx) {
            if (Gamee._initState == 1) {
                window.gamee.share(data, function (error, data) {
                    if (cbFnc)
                        cbFnc.call(cbCtx, (data && data.shareStaus));
                });
            }
        }
        static gameOver(replayData, saveData) {
            if (Gamee._ready) {
                let replay;
                if (replayData)
                    replay = { data: replayData, variant: "0" };
                window.gamee.gameOver(replay, null, saveData);
            }
        }
        static gameSave(saveData, cbFnc, cbCtx) {
            if (Gamee._ready) {
                window.gamee.gameSave(saveData, true, (error) => {
                    if (cbFnc)
                        cbFnc.call(cbCtx, error == null);
                });
                return true;
            }
            return false;
        }
        static get score() {
            return Gamee._score;
        }
        static set score(score) {
            Gamee._score = score;
            if (Gamee._initState == 1)
                window.gamee.updateScore(score);
        }
        static set ghostScore(score) {
            if (Gamee._initState == 1)
                window.gamee.updateScore(score, true);
        }
        static get adState() { return Gamee._adState; }
        static get adReady() { return Gamee._adState == 0; }
        static loadAd(cbFnc, cbCtx) {
            if (Gamee._initState != 1 || Gamee._adState != 3)
                return false;
            Gamee._adState = 1;
            try {
                window.gamee.loadRewardedVideo(function (error, data) {
                    Gamee._adState = (data && data.videoLoaded ? 0 : 3);
                    if (cbFnc)
                        cbFnc.call(cbCtx, Gamee._adState == 0);
                });
            }
            catch (e) {
                return false;
            }
            return true;
        }
        static showAd(cbFnc, cbCtx) {
            if (Gamee._adState != 0) {
                Gamee.loadAd((res) => {
                    if (res)
                        Gamee.showAd(cbFnc, cbCtx);
                });
                return true;
            }
            Gamee._adState = 2;
            window.gamee.showRewardedVideo(function (error, data) {
                Gamee._adState = 3;
                cbFnc.call(cbCtx, (data && data.videoPlayed));
            });
            return true;
        }
        static purchaseItem(cost, currency, name, base64Img, silent, cbFnc, cbCtx) {
            if (!Gamee.ready)
                return false;
            if (currency == 0) {
                window.gamee.purchaseItemWithCoins({
                    coinsCost: cost,
                    silentPurchase: silent,
                    itemName: name,
                    itemImage: base64Img
                }, (error, data) => {
                    cbFnc.call(cbCtx, (data && data.purchaseStatus));
                });
            }
            else {
                window.gamee.purchaseItemWithGems({
                    gemsCost: cost,
                    silentPurchase: silent,
                    itemName: name,
                    itemImage: base64Img
                }, (error, data) => {
                    cbFnc.call(cbCtx, (data && data.purchaseStatus));
                });
            }
            return true;
        }
        static showSubscribeDialog(cbFnc, cbCtx) {
            if (!Gamee.ready)
                return false;
            window.gamee.showSubscribeDialog((error, data) => {
                cbFnc.call(cbCtx, (data && data.vipPurchased));
            });
            return true;
        }
    }
    Gamee._events = new Phaser.Events.EventEmitter();
    Gamee._initState = 0;
    Gamee._ready = false;
    Gamee._score = 0;
    Gamee._adState = 3;
    Gamee2.Gamee = Gamee;
})(Gamee2 || (Gamee2 = {}));
var Helpers;
(function (Helpers) {
    class CollisionArea {
        constructor(type, shape) {
            this._type = type;
            if (shape) {
                this._shape = shape;
            }
            else {
                this._shape = (type == 0 ? new Phaser.Geom.Rectangle() : type == 1 ? new Phaser.Geom.Circle() : new Phaser.Geom.Triangle());
            }
        }
        get type() { return this._type; }
        get shape() { return this._shape; }
        get width() {
            return this._shape.right - this._shape.left;
        }
        get height() {
            return this._shape.bottom - this._shape.top;
        }
        checkCollision(area) {
            return CollisionArea._checkColFnc[this._type][area._type](this._shape, area._shape);
        }
        setTo(src, offsetX, offsetY) {
            CollisionArea._setFnc[this._type](this.shape, src.shape, offsetX, offsetY);
            return this;
        }
        static setRect(des, src, offsetX, offsetY) {
            des.setTo(src.x + offsetX, src.y + offsetY, src.width, src.height);
        }
        static setCircle(des, src, offsetX, offsetY) {
            des.setTo(src.x + offsetX, src.y + offsetY, src.radius);
        }
        static setTriangle(des, src, offsetX, offsetY) {
            des.setTo(src.x1 + offsetX, src.y1 + offsetY, src.x2 + offsetX, src.y2 + offsetY, src.x3 + offsetX, src.y3 + offsetY);
        }
        static checkRectVsRect(rectA, rectB) {
            return Phaser.Geom.Intersects.RectangleToRectangle(rectA, rectB);
        }
        static checkRectVsCircle(rect, circle) {
            return Phaser.Geom.Intersects.CircleToRectangle(circle, rect);
        }
        static checkRectVsTriangle(rect, triangle) {
            return Phaser.Geom.Intersects.RectangleToTriangle(rect, triangle);
        }
        static checkCircleVsRect(circle, rect) {
            return Phaser.Geom.Intersects.CircleToRectangle(circle, rect);
        }
        static checkCircleVsCircle(circleA, circleB) {
            return Phaser.Geom.Intersects.CircleToCircle(circleA, circleB);
        }
        static checkCircleVsTriangle(circle, triangle) {
            return Phaser.Geom.Intersects.TriangleToCircle(triangle, circle);
        }
        static checkTriangleVsRect(triangle, rect) {
            return Phaser.Geom.Intersects.RectangleToTriangle(rect, triangle);
        }
        static checkTriangleVsCircle(triangle, circle) {
            return Phaser.Geom.Intersects.TriangleToCircle(triangle, circle);
        }
        static checkTriangleVsTriangle(triangleA, triangleB) {
            return Phaser.Geom.Intersects.TriangleToTriangle(triangleA, triangleB);
        }
        static getCollisionRc(areas, rc) {
            let lX = Number.MAX_SAFE_INTEGER;
            let rX = Number.MIN_SAFE_INTEGER;
            let tY = Number.MAX_SAFE_INTEGER;
            let bY = Number.MIN_SAFE_INTEGER;
            areas.forEach((area) => {
                let areaShape = area.shape;
                if (lX > areaShape.left)
                    lX = areaShape.left;
                if (tY > areaShape.top)
                    tY = areaShape.top;
                if (rX < areaShape.right)
                    rX = areaShape.right;
                if (bY < areaShape.bottom)
                    bY = areaShape.bottom;
            });
            if (rc) {
                rc.setTo(lX, tY, rX - lX, bY - tY);
            }
            else {
                rc = new Phaser.Geom.Rectangle(lX, tY, rX - lX + 1, bY - tY + 1);
            }
            return rc;
        }
    }
    CollisionArea._setFnc = [
        CollisionArea.setRect,
        CollisionArea.setCircle,
        CollisionArea.setTriangle,
    ];
    CollisionArea._checkColFnc = [
        [
            CollisionArea.checkRectVsRect,
            CollisionArea.checkRectVsCircle,
            CollisionArea.checkRectVsTriangle,
        ],
        [
            CollisionArea.checkCircleVsRect,
            CollisionArea.checkCircleVsCircle,
            CollisionArea.checkCircleVsTriangle,
        ],
        [
            CollisionArea.checkTriangleVsRect,
            CollisionArea.checkTriangleVsCircle,
            CollisionArea.checkTriangleVsTriangle
        ]
    ];
    Helpers.CollisionArea = CollisionArea;
})(Helpers || (Helpers = {}));
var Helpers;
(function (Helpers) {
    class GameTimer {
        constructor(emitEvents = false) {
            this.time = 0;
            this.delta = 0;
            this._flags = 0;
            if (emitEvents)
                this._events = new Phaser.Events.EventEmitter();
        }
        get started() { return (this._flags & 1) != 0; }
        get paused() { return (this._flags & 2) != 0; }
        get events() { return this._events; }
        start() {
            this.time = 0;
            this.delta = 0;
            this._flags |= 1;
            if (this._events)
                this._events.emit(GameTimer.EVENT_START, this);
        }
        stop() {
            this._flags = 0;
        }
        update(delta) {
            if ((this._flags & (1 | 2)) == 1) {
                this.time += delta;
                this.delta = delta / (1000 / 60);
                this.deltaMs = delta;
                if (this._events)
                    this._events.emit(GameTimer.EVENT_UPDATE, this);
            }
        }
        pause() {
            if ((this._flags & (1 | 2)) == 1) {
                this._flags |= 2;
                this.delta = 0;
                if (this._events)
                    this._events.emit(GameTimer.EVENT_PAUSE, this);
            }
        }
        resume() {
            if ((this._flags & 2) != 0) {
                this._flags &= ~2;
                this.delta = 1;
                if (this._events)
                    this._events.emit(GameTimer.EVENT_RESUME, this);
            }
        }
    }
    GameTimer.EVENT_UPDATE = "update";
    GameTimer.EVENT_START = "start";
    GameTimer.EVENT_PAUSE = "pause";
    GameTimer.EVENT_RESUME = "resume";
    Helpers.GameTimer = GameTimer;
})(Helpers || (Helpers = {}));
var Helpers;
(function (Helpers) {
    class RenderTexture {
        static toBase64(tex, x, y, w, h, clb, clbCtx, type = "image/png", quality = 0.92) {
            tex.snapshotArea(x, y, w, h, (snapshot) => {
                let canvas = Phaser.Display.Canvas.CanvasPool.create2D(this, w, h);
                canvas
                    .getContext("2d")
                    .drawImage(snapshot, 0, 0);
                let base64 = canvas.toDataURL(type, quality);
                Phaser.Display.Canvas.CanvasPool.remove(canvas);
                clb.call(clbCtx, base64);
            });
        }
    }
    Helpers.RenderTexture = RenderTexture;
})(Helpers || (Helpers = {}));
var Helpers;
(function (Helpers) {
    class ScaleManager {
        constructor(scaleManager, minDims, maxDims) {
            this._scale = scaleManager;
            this._minDims = minDims;
            this._maxDims = maxDims;
            this._events = scaleManager.game.events;
            this._unlimitedWidth = this._maxDims.x <= 0;
            this._unlimitedHeight = this._maxDims.y <= 0;
            if (!this._unlimitedWidth && !this._unlimitedHeight) {
                this._minRatio = Math.min(this._minDims.x, this._maxDims.x) / Math.max(this._minDims.y, this._maxDims.y);
                this._maxRatio = Math.max(this._minDims.x, this._maxDims.x) / Math.min(this._minDims.y, this._maxDims.y);
                if (this._minRatio > this._maxRatio) {
                    let i = this._minRatio;
                    this._minRatio = this._maxRatio;
                    this._maxRatio = i;
                }
            }
            window.addEventListener("resize", () => {
                this.resize();
            }, false);
        }
        get minWidth() { return Math.min(this._minDims.x, this._maxDims.x); }
        get maxWidth() { return this._unlimitedWidth ? window.innerWidth : Math.max(this._minDims.x, this._maxDims.x); }
        get minHeight() { return Math.min(this._minDims.y, this._maxDims.y); }
        get maxHeight() { return this._unlimitedHeight ? window.innerHeight : Math.max(this._minDims.y, this._maxDims.y); }
        get width() { return this._scale.width; }
        get height() { return this._scale.height; }
        get events() { return this._events; }
        resize() {
            let extResW = window.innerWidth;
            let extResH = window.innerHeight;
            let intResW;
            let intResH;
            if (!this._unlimitedWidth && !this._unlimitedHeight) {
                let ratio = extResW / extResH;
                if (ratio < this._minRatio) {
                    extResH = Math.floor(extResW / this._minRatio);
                }
                else if (ratio > this._maxRatio) {
                    extResW = Math.floor(extResH * this._maxRatio);
                }
                intResW = extResW;
                intResH = extResH;
                if (intResW < this._minDims.x) {
                    intResH = Math.round(intResH * (this._minDims.x / intResW));
                    intResW = this._minDims.x;
                }
                else if (intResW > this._maxDims.x) {
                    intResH = Math.round(intResH * (this._maxDims.x / intResW));
                    intResW = this._maxDims.x;
                }
                if (intResH < this._minDims.y) {
                    intResW = Math.round(intResW * (this._minDims.y / intResH));
                    intResH = this._minDims.y;
                }
                else if (intResH > this._maxDims.y) {
                    intResW = Math.round(intResW * (this._maxDims.y / intResH));
                    intResH = this._maxDims.y;
                }
                intResW = Math.min(Math.max(this._minDims.x, intResW), this._maxDims.x);
                intResH = Math.min(Math.max(this._minDims.y, intResH), this._maxDims.y);
            }
            else if (this._unlimitedWidth) {
                let minH = this._minDims.y;
                let maxH = this._maxDims.y;
                if (minH > maxH) {
                    minH = maxH;
                    maxH = this._minDims.y;
                }
                intResH = Math.max(minH, Math.min(extResH, maxH));
                intResW = Math.round(extResW * (intResH / extResH));
                if (intResW < this._minDims.x) {
                    let scale = intResW / this._minDims.x;
                    intResW = this._minDims.x;
                    extResH = Math.round(extResH * scale);
                }
            }
            let canvas = document.querySelector("canvas");
            canvas.style.width = extResW + "px";
            canvas.style.height = extResH + "px";
            canvas.style.left = ((window.innerWidth - extResW) / 2) + "px";
            canvas.style.top = ((window.innerHeight - extResH) / 2) + "px";
            if (this._scale.width != intResW || this._scale.height != intResH) {
                this._scale.resize(intResW, intResH);
                this._events.emit(ScaleManager.EVENT_RESIZE, intResW, intResH);
            }
        }
    }
    ScaleManager.EVENT_RESIZE = "resize";
    Helpers.ScaleManager = ScaleManager;
})(Helpers || (Helpers = {}));
var Collections;
(function (Collections) {
    class Node {
        constructor(data) {
            this.data = data;
        }
        get prev() { return this._prev; }
        get next() { return this._next; }
        addToChain(neighbor, asNext = true) {
            this._prev = null;
            this._next = null;
            if (neighbor != null) {
                if (asNext) {
                    if ((this._next = neighbor._next) != null)
                        this._next._prev = this;
                    neighbor._next = this;
                    this._prev = neighbor;
                }
                else {
                    if ((this._prev = neighbor._prev) != null)
                        this._prev._next = this;
                    neighbor._prev = this;
                    this._next = neighbor;
                }
            }
            return this;
        }
        removeFromChain() {
            if (this._prev != null)
                this._prev._next = this._next;
            if (this._next != null)
                this._next._prev = this._prev;
            this._prev = null;
            this._next = null;
        }
    }
    Collections.Node = Node;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    class NodeList {
        constructor() {
            this._nodePool = new Collections.Pool(undefined, 0, true, () => {
                return new Collections.Node();
            }, this);
            this._firstNode = null;
            this._lastNode = null;
            this._itemCnt = 0;
        }
        get first() { return (this._firstNode != null ? this._firstNode.data : undefined); }
        get last() { return (this._lastNode != null ? this._lastNode.data : undefined); }
        get firstNode() { return this._firstNode; }
        get lastNode() { return this._lastNode; }
        get size() { return this._itemCnt; }
        get empty() { return this._itemCnt == 0; }
        clear() {
            let node = this._firstNode;
            while (node != null) {
                this._nodePool.returnItem(node);
                node = node.next;
            }
            this._firstNode = null;
            this._lastNode = null;
            this._itemCnt = 0;
            return this;
        }
        add(item, id) {
            let node = this._nodePool.getItem();
            if (id == undefined || id >= this._itemCnt) {
                node.addToChain(this._lastNode);
            }
            else {
                if (id == 0) {
                    node.addToChain(this._firstNode, false);
                }
                else {
                    node.addToChain(this.getItemById(id - 1));
                }
            }
            if (node.prev == null)
                this._firstNode = node;
            if (node.next == null)
                this._lastNode = node;
            node.data = item;
            this._itemCnt++;
            return this;
        }
        removeById(id) {
            let node = this.getItemById(id);
            if (node == undefined)
                return undefined;
            return this.removeByNode(node);
        }
        removeByNode(node) {
            if (this._firstNode == node)
                this._firstNode = node.next;
            if (this._lastNode == node)
                this._lastNode = node.prev;
            node.removeFromChain();
            this._nodePool.returnItem(node);
            this._itemCnt--;
            return node.data;
        }
        getItemById(id) {
            if (id < 0 || id >= this._itemCnt)
                return undefined;
            let node;
            if (id < (this._itemCnt >> 1)) {
                node = this._firstNode;
                while (id-- != 0)
                    node = node.next;
            }
            else {
                let _id = this._itemCnt;
                node = this._lastNode;
                while (--_id != id)
                    node = node.prev;
            }
            return node;
        }
        forEach(clb, clbCtx) {
            let node = this._firstNode;
            while (node != null) {
                let nextNode = node.next;
                clb.call(clbCtx, node.data, node);
                node = nextNode;
            }
            return this;
        }
        every(clb, clbCtx) {
            let node = this._firstNode;
            while (node != null) {
                let nextNode = node.next;
                if (!clb.call(clbCtx, node.data, node))
                    break;
                node = nextNode;
            }
            return this;
        }
    }
    Collections.NodeList = NodeList;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    class Pool {
        constructor(itemType, defSize = 0, canGrow = true, itemCreateClb = null, itemCreateClbCtx) {
            this._itemType = itemType;
            this._itemCreateClb = itemCreateClb;
            this._itemCreateClbCtx = itemCreateClbCtx;
            this._canGrow = canGrow;
            this._pool = [];
            this._size = 0;
            this._bufferSize = 0;
            while (defSize-- != 0) {
                this._pool.push(this.newItem());
                this._size++;
            }
        }
        get size() { return this._size; }
        get canGrow() { return this._canGrow; }
        get bufferSize() { return this._bufferSize; }
        getItem() {
            if (this._size == 0) {
                return (this._canGrow ? this.newItem() : null);
            }
            else {
                let item = this._pool[--this._size];
                this._pool[this._size] = null;
                return item;
            }
        }
        returnItem(item) {
            this._pool[this._size++] = item;
            return item;
        }
        newItem() {
            this._bufferSize++;
            if (this._itemCreateClb) {
                return this._itemCreateClb.call(this._itemCreateClbCtx, this._size);
            }
            else {
                return new this._itemType();
            }
        }
    }
    Collections.Pool = Pool;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    class WrappedArray {
        constructor() {
            this._array = [];
            this._firstItemId = 0;
            this._size = 0;
        }
        get size() { return this._size; }
        get empty() { return this._size == 0; }
        get first() { return this.getItemAtIndex(0); }
        get last() { return this.getItemAtIndex(this._size - 1); }
        add(item, atTheEnd = true) {
            this.ensureSpaceForNewItem(atTheEnd);
            let itemId;
            if (atTheEnd) {
                itemId = this.itemId2ItemArrayPos(this._size);
            }
            else {
                if (this._size != 0) {
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
            this._size++;
            return item;
        }
        remove(atTheEnd = true) {
            let item = null;
            if (this._size != 0) {
                if (atTheEnd) {
                    let itemId = this.itemId2ItemArrayPos(this._size - 1);
                    item = this._array[itemId];
                    this._array[itemId] = null;
                }
                else {
                    item = this._array[this._firstItemId];
                    this._array[this._firstItemId] = null;
                    if (++this._firstItemId == this._array.length)
                        this._firstItemId = 0;
                }
                this._size--;
            }
            return item;
        }
        clear(removeItems = true) {
            if (removeItems) {
                let itemCnt = this._size;
                let itemId = this._firstItemId;
                while (itemCnt-- != 0) {
                    this._array[itemId] = undefined;
                    if (++itemId == this._array.length)
                        itemId = 0;
                }
            }
            this._firstItemId = 0;
            this._size = 0;
        }
        getItemAtIndex(itemId) {
            if (itemId >= this._size)
                return null;
            return this._array[this.itemId2ItemArrayPos(itemId)];
        }
        forEach(callback, context) {
            let remItemCnt = this._size;
            if (remItemCnt == 0)
                return;
            let itemId = this._firstItemId;
            while (remItemCnt-- != 0) {
                callback.call(context, this._array[itemId], itemId);
                if (++itemId == this._array.length)
                    itemId = 0;
            }
        }
        every(callback, context) {
            let remItemCnt = this._size;
            if (remItemCnt == 0)
                return;
            let itemId = this._firstItemId;
            while (remItemCnt-- != 0) {
                if (!callback.call(context, this._array[itemId]))
                    break;
                if (++itemId == this._array.length)
                    itemId = 0;
            }
        }
        ensureSpaceForNewItem(atTheEnd) {
            if (this._size < this._array.length)
                return;
            if (this._size != 0) {
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
        }
        toArray() {
            let newArray = [];
            let oldArray = this._array;
            let itemCnt = this._size;
            let itemId = this._firstItemId;
            while (itemCnt-- != 0) {
                newArray.push(oldArray[itemId]);
                if (++itemId == this._array.length)
                    itemId = 0;
            }
            return newArray;
        }
        itemId2ItemArrayPos(itemId) {
            itemId += this._firstItemId;
            if (itemId >= this._array.length)
                itemId -= this._array.length;
            return itemId;
        }
    }
    Collections.WrappedArray = WrappedArray;
})(Collections || (Collections = {}));
var Controls;
(function (Controls) {
    class ProgressBar {
        constructor(scene, texKey, bgFrameKey, fillFrameKey, fillOffset, minVal = 0, maxVal = 1) {
            this._container = new Controls.Group.Group(false);
            this._container.add(scene.add.image(0, 0, texKey, bgFrameKey)
                .setOrigin(0));
            this._fill = scene.add.image(0, 0, texKey, fillFrameKey)
                .setOrigin(0);
            this._fillCropRc = new Phaser.Geom.Rectangle(0, 0, 0, this._fill.height);
            let fillOffsetX = 0;
            let fillOffsetY = 0;
            if (fillOffset) {
                fillOffsetX = fillOffset.x;
                fillOffsetY = fillOffset.y;
            }
            this._container.add(this._fill, fillOffsetX, fillOffsetY, 0, false);
            this._minValue = minVal;
            this._maxValue = maxVal;
            this._value = minVal - 1;
            this.value = minVal;
        }
        get container() { return this._container; }
        get value() { return this._value; }
        set value(val) {
            val = Math.min(Math.max(val, this._minValue), this._maxValue);
            if (val != this._value) {
                this._value = val;
                this._fillCropRc.width = Math.round(this._fill.width * this.fillRatio);
                this._fill.setCrop(this._fillCropRc);
            }
        }
        get minValue() { return this._minValue; }
        set minValue(val) { this._minValue = val; }
        get maxValue() { return this._maxValue; }
        set maxValue(val) { this._maxValue = val; }
        get fillRatio() { return (this._value - this._minValue) / (this._maxValue - this._minValue); }
    }
    Controls.ProgressBar = ProgressBar;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var Buttons;
    (function (Buttons) {
        class BasicButton {
            constructor(scene, x, y, atlasKey, frameKey, hitArea) {
                this._scene = scene;
                this._events = scene.events;
                this._image = scene.add.image(x, y, atlasKey, frameKey + 0)
                    .setInteractive()
                    .setOrigin(0, 0);
                if (hitArea)
                    this._image.input.hitArea.setTo(hitArea.x, hitArea.y, hitArea.width, hitArea.height);
                this._imageFrameKey = frameKey;
                this._image.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                this._image.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
                this._image.on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut, this);
                this._state = 0;
                this._visible = true;
                this._enabled = true;
            }
            get scene() { return this._scene; }
            get image() { return this._image; }
            get state() { return this._state; }
            get id() { return this._id; }
            set id(id) { this._id = id; }
            get x() { return this._image.x; }
            set x(x) { this.setPosition(x, this.y); }
            get y() { return this._image.y; }
            set y(y) { this.setPosition(this.x, y); }
            get width() { return this._image.width; }
            get height() { return this._image.height; }
            get alpha() { return this.getAlpha(); }
            set alpha(alpha) { this.setAlpha(alpha); }
            get visible() { return this._visible; }
            set visible(visible) {
                if (this._visible != visible) {
                    this._image.input.enabled = (this._visible = visible) && this._enabled;
                    this.handleVisibleChange(visible);
                }
            }
            get enabled() { return this._state != 2; }
            set enabled(enabled) {
                if (this.enabled != enabled) {
                    this._state = (enabled ? 0 : 2);
                    this._image.input.enabled = enabled;
                    this.handleStateChange();
                    this._events.emit("btn_enabledChange", this, enabled);
                }
            }
            get depth() { return this.getDepth(); }
            set depth(depth) { this.setDepth(depth); }
            get cameraFilter() { return this._image.cameraFilter; }
            set cameraFilter(filter) { this.setCameraFilter(filter); }
            get events() { return this._events; }
            set events(events) { this._events = events; }
            setId(id) {
                this._id = id;
                return this;
            }
            setEventEmitter(emitter) {
                this._events = emitter;
                return this;
            }
            setImageFrameKey(frameKey) {
                if (this._imageFrameKey != frameKey) {
                    this._imageFrameKey = frameKey;
                    this.setImageFrame();
                }
                return this;
            }
            setAlpha(alpha) {
                this._image.alpha = alpha;
                return this;
            }
            getAlpha() {
                return this._image.alpha;
            }
            setVisible(visible) {
                this.visible = visible;
                return this;
            }
            setEnabled(enabled) {
                this.enabled = enabled;
                return this;
            }
            setPosition(x, y) {
                this._image.setPosition(x, y);
                return this;
            }
            setDepth(depth) {
                this._image.setDepth(depth);
                return this;
            }
            getDepth() {
                return this._image.depth;
            }
            setCameraFilter(filter) {
                this._image.cameraFilter = filter;
                return this;
            }
            handlePointerDown(pointer, x, y, event) {
                if (this._state == 0) {
                    this._state = 1;
                    this.handleStateChange();
                    event.stopPropagation();
                    this._events.emit("btn_press", this);
                }
            }
            handlePointerUp() {
                if (this._state != 1)
                    return;
                this._state = 0;
                this.handleStateChange();
                this.events.emit("btn_click", this);
            }
            handlePointerOut() {
                if (this._state != 1)
                    return;
                this._state = 0;
                this.handleStateChange();
            }
            handleVisibleChange(visible) {
                this._image.visible = visible;
            }
            handleStateChange() {
                this.setImageFrame();
            }
            setImageFrame() {
                let frameKey = this._imageFrameKey + this._state;
                if (this._state != 0) {
                    if (!this._scene.textures.get(this._image.texture.key).has(frameKey))
                        frameKey = this._imageFrameKey + 0;
                }
                this._image.setFrame(frameKey);
            }
        }
        Buttons.BasicButton = BasicButton;
    })(Buttons = Controls.Buttons || (Controls.Buttons = {}));
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var Buttons;
    (function (Buttons) {
        class ContentButton extends Buttons.BasicButton {
            constructor(scene, x, y, atlasKey, frameKey, pressedContentOffsetY = 0, hitArea) {
                super(scene, x, y, atlasKey, frameKey, hitArea);
                this._content = null;
                this._contentArea = new Phaser.Geom.Rectangle();
                this._pressedContentOffY = pressedContentOffsetY;
            }
            get content() { return this._content; }
            setContent(content, contentArea, contentAlign = 4 | 8) {
                if (this._content)
                    this._content.events.removeListener("group_sizeChange", this.handleContentSizeChange, this);
                this._content = content;
                this._contentAlign = contentAlign;
                if (contentArea) {
                    this._contentArea.setTo(contentArea.x, contentArea.y, contentArea.width, contentArea.height);
                }
                else {
                    this._contentArea.setTo(0, 0, this._image.width, this._image.height);
                }
                if (this._content) {
                    this._content
                        .setDepth(this._image.depth + 1)
                        .setVisible(this._visible)
                        .setCameraFilter(this._image.cameraFilter);
                    this.updateContentPos();
                    this._content.events.on("group_sizeChange", this.handleContentSizeChange, this);
                }
                return this;
            }
            setPosition(x, y) {
                super.setPosition(x, y);
                this.updateContentPos();
                return this;
            }
            setDepth(depth) {
                super.setDepth(depth);
                if (this._content)
                    this._content.setDepth(depth + 1);
                return this;
            }
            setCameraFilter(filter) {
                super.setCameraFilter(filter);
                if (this._content)
                    this._content.cameraFilter = filter;
                return this;
            }
            handleContentSizeChange() {
                if (this._contentAlign != 0)
                    this.updateContentPos();
            }
            handleStateChange() {
                super.handleStateChange();
                this.updateContentPos();
            }
            handleVisibleChange(visible) {
                super.handleVisibleChange(visible);
                if (this._content)
                    this._content.visible = visible;
            }
            updateContentPos() {
                if (!this._content)
                    return;
                let image = this._image;
                let x = image.x - image.displayOriginX + this._contentArea.x;
                let y = image.y - image.displayOriginY + this._contentArea.y;
                if (this._state == 1)
                    y += this._pressedContentOffY;
                let align = this._contentAlign;
                if ((align & 4) != 0) {
                    x += (this._contentArea.width - this._content.width) / 2;
                }
                else if ((align & 1) != 0) {
                    x += (this._contentArea.width - this._content.width);
                }
                if ((align & 8) != 0) {
                    y += (this._contentArea.height - this._content.height) / 2;
                }
                else if ((align & 2) != 0) {
                    y += (this._contentArea.height - this._content.height);
                }
                this._content.setPosition(x, y);
            }
        }
        Buttons.ContentButton = ContentButton;
    })(Buttons = Controls.Buttons || (Controls.Buttons = {}));
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var Group;
    (function (Group_1) {
        class Group {
            constructor(customSize = false) {
                this._customSize = customSize;
                this._events = null;
                this._firstItem = this._lastItem = null;
                this._x = 0;
                this._y = 0;
                this._width = 0;
                this._height = 0;
                this._visible = true;
                this._alpha = 1;
                this._depth = 0;
                this._cameraFilter = 0;
            }
            get events() {
                if (!this._events)
                    this._events = new Phaser.Events.EventEmitter();
                return this._events;
            }
            get firstItem() { return this._firstItem; }
            get lastItem() { return this._lastItem; }
            get x() { return this._x; }
            set x(x) {
                if (this._x != x)
                    this.setPosition(x, this._y);
            }
            get y() { return this._y; }
            set y(y) {
                if (this._y != y)
                    this.setPosition(this._x, y);
            }
            get width() { return this._width; }
            get height() { return this._height; }
            get customSize() { return this._customSize; }
            get visible() { return this._visible; }
            set visible(visible) {
                if (this._visible != visible) {
                    this._visible = visible;
                    let item = this._firstItem;
                    while (item != null) {
                        if (item.visible)
                            item.content.visible = visible;
                        item = item.next;
                    }
                }
            }
            get alpha() { return this._alpha; }
            set alpha(alpha) {
                if (this._alpha != alpha) {
                    this._alpha = alpha;
                    let item = this._firstItem;
                    while (item != null) {
                        item.content.alpha = item.alpha * alpha;
                        item = item.next;
                    }
                }
            }
            get depth() { return this._depth; }
            set depth(depth) {
                if (this._depth != depth) {
                    this._depth = depth;
                    let item = this._firstItem;
                    while (item != null) {
                        item.content.depth = depth + item.depth;
                        item = item.next;
                    }
                }
            }
            get cameraFilter() { return this._cameraFilter; }
            set cameraFilter(filter) {
                if (this._cameraFilter != filter) {
                    this._cameraFilter = filter;
                    let item = this._firstItem;
                    while (item != null) {
                        item.content.cameraFilter = filter;
                        item = item.next;
                    }
                }
            }
            destroy() {
                let node = this._lastItem;
                while (node != null) {
                    node.destroy();
                    node = node.prev;
                }
                this._firstItem = null;
                this._lastItem = null;
                if (!this._customSize) {
                    this._width = 0;
                    this._height = 0;
                }
            }
            setPosition(x, y) {
                if (this._x == x && this._y == y)
                    return this;
                this._x = x;
                this._y = y;
                let item = this._firstItem;
                while (item != null) {
                    if (item.visible)
                        item.updatePosition();
                    item = item.next;
                }
                return this;
            }
            setCustomSize(width, height) {
                this._customSize = true;
                if (width == this._width && height == this._height)
                    return this;
                this._width = width;
                this._height = height;
                let item = this._firstItem;
                while (item != null) {
                    if (item.alignment != 0)
                        item.updatePosition();
                    item = item.next;
                }
                if (this._events)
                    this._events.emit("group_sizeChange", this, this._width, this._height);
                return this;
            }
            recalculateSize() {
                if (this._customSize)
                    return this;
                let width = 0;
                let height = 0;
                let item = this._firstItem;
                while (item != null) {
                    if (item.affectGroupSize && item.visible) {
                        if (item.groupOccupationW > width)
                            width = item.groupOccupationW;
                        if (item.groupOccupationH > height)
                            height = item.groupOccupationH;
                    }
                    item = item.next;
                }
                if (width != this._width || height != this._height)
                    this.handleSizeChange(width, height);
                return this;
            }
            resetCustomSize() {
                if (this._customSize) {
                    this._customSize = false;
                    this.recalculateSize();
                }
                return this;
            }
            add(content, offsetX = 0, offsetY = 0, alignment = 0, affectSize = true) {
                return this.addExisting(new Group_1.Item(content, offsetX, offsetY, alignment, affectSize));
            }
            addExisting(item) {
                if (item.group != null) {
                    if (item.group == this)
                        return item;
                    item.group.remove(item);
                }
                this._lastItem = item._addToGroup(this);
                if (this._firstItem == null)
                    this._firstItem = item;
                item.blockPosUpdate = true;
                if (item.affectGroupSize && item.visible && !this._customSize) {
                    if (this._width < item.groupOccupationW || this._height < item.groupOccupationH)
                        this.handleSizeChange(Math.max(this._width, item.groupOccupationW), Math.max(this._height, item.groupOccupationH));
                }
                item.blockPosUpdate = false;
                item.updatePosition();
                return item;
            }
            remove(item) {
                if (item.group != this)
                    return;
                if (this._firstItem == item)
                    this._firstItem = item.next;
                if (this._lastItem == item)
                    this._lastItem = item.prev;
                item._removeFromGroup();
            }
            getItem(content) {
                let item = this._firstItem;
                while (item != null) {
                    if (item.content == content)
                        return item;
                    item = item.next;
                }
                return null;
            }
            every(callback, context) {
                this.everyItem((item) => {
                    return callback.call(context, item.content);
                });
            }
            setItemsProperty(property, value) {
                this.everyItem((item) => {
                    let go = item.content;
                    if (property in go)
                        go[property] = value;
                    return true;
                });
                return this;
            }
            setVisible(visible) {
                this.visible = visible;
                return this;
            }
            setAlpha(alpha) {
                this.alpha = alpha;
                return this;
            }
            setDepth(depth) {
                this.depth = depth;
                return this;
            }
            setCameraFilter(filter) {
                this.cameraFilter = filter;
                return this;
            }
            everyItem(callback) {
                let item = this._firstItem;
                while (item != null) {
                    if (!callback.call(this, item))
                        break;
                    item = item.next;
                }
            }
            handleSizeChange(width, height) {
                this._width = width;
                this._height = height;
                let item = this._firstItem;
                while (item != null) {
                    if (item.alignment != 0)
                        item.updatePosition();
                    item = item.next;
                }
                if (this._events)
                    this._events.emit("group_sizeChange", this, width, height);
            }
        }
        Group_1.Group = Group;
    })(Group = Controls.Group || (Controls.Group = {}));
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var Group;
    (function (Group) {
        class Item {
            constructor(content, offsetX = 0, offsetY = 0, alignment = 0, affectGroupSize = true) {
                this._group = null;
                this._content = content;
                this._offsetX = offsetX;
                this._offsetY = offsetY;
                this._alignment = alignment;
                this._affectGroupSize = affectGroupSize;
                this._visible = content.visible;
                this._alpha = content.alpha;
                this._depth = content.depth;
                this._flags = 0;
                if (content.width != undefined)
                    this._flags |= 4;
                if (content.displayWidth != undefined)
                    this._flags |= 2;
                if (content.originX != undefined)
                    this._flags |= 1;
                if ((this._flags & (4 | 2)) == 0)
                    this._affectGroupSize = false;
                this.updateGroupOccupationArea();
            }
            get group() { return this._group; }
            get content() { return this._content; }
            get next() { return this._next; }
            get prev() { return this._prev; }
            get offsetX() { return this._offsetX; }
            set offsetX(x) { this.setOffsetX(x); }
            get offsetY() { return this._offsetY; }
            set offsetY(y) { this.setOffsetY(y); }
            get alignment() { return this._alignment; }
            set alignment(alignment) {
                if (this._alignment != alignment) {
                    this._alignment = alignment;
                    this.blockPosUpdate = true;
                    this.updateGroupOccupationArea();
                    this.blockPosUpdate = false;
                    this.updatePosition();
                }
            }
            get groupOccupationW() { return this._groupOccupationW; }
            get groupOccupationH() { return this._groupOccupationH; }
            get width() { return (this._flags & 2) != 0 ? this._content.displayWidth : (this._flags & 4) != 0 ? this._content.width : 0; }
            get height() { return (this._flags & 2) != 0 ? this._content.displayHeight : (this._flags & 4) != 0 ? this._content.height : 0; }
            get displayOriginX() { return (this._flags & 1) != 0 ? this._content.originX * this.width : 0; }
            get displayOriginY() { return (this._flags & 1) != 0 ? this._content.originY * this.height : 0; }
            get visible() { return this._visible; }
            set visible(visible) { this.setVisible(visible); }
            get alpha() { return this._alpha; }
            set alpha(alpha) { this.setAlpha(alpha); }
            get depth() { return this._depth; }
            set depth(depth) { this.setDepth(depth); }
            get affectGroupSize() { return this._affectGroupSize; }
            destroy() {
                if (typeof this._content["destroy"] == "function")
                    this._content["destroy"]();
            }
            _addToGroup(group) {
                this._group = group;
                if (group == null)
                    return this;
                if (!group.visible)
                    this._content.visible = false;
                this._content.alpha = this._alpha * group.alpha;
                this._content.depth = this._depth + group.depth;
                this._content.cameraFilter = group.cameraFilter;
                if ((this._prev = group.lastItem) != null)
                    this._prev._next = this;
                this._next = null;
                return this;
            }
            _removeFromGroup() {
                if (this._prev != null)
                    this._prev._next = this._next;
                if (this._next != null)
                    this._next._prev = this._prev;
                this._prev = this._next = null;
                if (this._affectGroupSize && this._visible)
                    this._group.recalculateSize();
                this._group = null;
            }
            setAlignment(alignment) {
                this.alignment = alignment;
                return this;
            }
            setOffset(x, y) {
                if (this._offsetX == x && this._offsetY == y)
                    return this;
                this._offsetX = x;
                this._offsetY = y;
                this.blockPosUpdate = true;
                this.updateGroupOccupationArea();
                this.blockPosUpdate = false;
                this.updatePosition();
                return this;
            }
            setOffsetX(x) {
                if (this._offsetX != x) {
                    this._offsetX = x;
                    this.updateGroupOccupationArea();
                    this._content.x = this.getGameObjectX();
                }
                return this;
            }
            setOffsetY(y) {
                if (this._offsetY != y) {
                    this._offsetY = y;
                    this.updateGroupOccupationArea();
                    this._content.y = this.getGameObjectY();
                }
                return this;
            }
            setVisible(visible) {
                if (this._visible != visible) {
                    this._visible = visible;
                    if (this._group == null) {
                        this._content.setVisible(visible);
                    }
                    else {
                        this._content.setVisible(visible && this._group.visible);
                        this.blockPosUpdate = true;
                        if (this._affectGroupSize)
                            this._group.recalculateSize();
                        this.blockPosUpdate = false;
                        this.updatePosition();
                    }
                }
                return this;
            }
            setAlpha(alpha) {
                if (alpha != this._alpha) {
                    this._alpha = alpha;
                    if (this._group != null)
                        alpha *= this._group.alpha;
                    this._content.alpha = alpha;
                }
                return this;
            }
            setDepth(depth) {
                if (this._depth != depth) {
                    this._depth = depth;
                    if (this._group != null)
                        depth += this._group.depth;
                    this._content.depth = depth;
                }
                return this;
            }
            updateGroupOccupationArea() {
                if (!this._affectGroupSize)
                    return false;
                let w;
                let h;
                if ((this._alignment & 1) != 0) {
                    w = ((this._flags & 1) == 0 ? this.width : this.displayOriginX) - this._offsetX;
                }
                else if ((this._alignment & 4) != 0) {
                    if ((this._flags & 1) == 0) {
                        w = this.width;
                    }
                    else {
                        let origin = this.displayOriginX;
                        w = Math.max(origin, this.width - origin) * 2;
                    }
                }
                else {
                    w = ((this._flags & 1) == 0 ? this.width : this.width - this.displayOriginX) + this._offsetX;
                }
                if ((this._alignment & 2) != 0) {
                    h = ((this._flags & 1) == 0 ? this.height : this.displayOriginY) - this._offsetY;
                }
                else if ((this._alignment & 8) != 0) {
                    if ((this._flags & 1) == 0) {
                        h = this.height;
                    }
                    else {
                        let origin = this.displayOriginY;
                        h = Math.max(origin, this.height - origin) * 2;
                    }
                }
                else {
                    h = ((this._flags & 1) == 0 ? this.height : this.height - this.displayOriginY) + this._offsetY;
                }
                if (this._groupOccupationW == undefined || this._groupOccupationW != w || this._groupOccupationH != h) {
                    this._groupOccupationW = w;
                    this._groupOccupationH = h;
                    if (this._group != null && this._visible)
                        this._group.recalculateSize();
                    return true;
                }
                return false;
            }
            updatePosition() {
                if (!this.blockPosUpdate)
                    this._content.setPosition(this.getGameObjectX(), this.getGameObjectY());
            }
            getGameObjectX() {
                let x;
                if ((this._alignment & (4 | 1)) == 0) {
                    x = this._offsetX;
                }
                else {
                    let hasOrigin = (this._flags & 1) != 0;
                    if ((this._alignment & 4) != 0) {
                        x = (this._group.width - (hasOrigin ? 0 : this.width)) / 2 + this._offsetX;
                    }
                    else {
                        x = this._group.width + this._offsetX;
                        if (!hasOrigin)
                            x -= this.width;
                    }
                }
                return this._group.x + x;
            }
            getGameObjectY() {
                let y;
                if ((this._alignment & (8 | 2)) == 0) {
                    y = this._offsetY;
                }
                else {
                    let hasOrigin = (this._flags & 1) != 0;
                    if ((this._alignment & 8) != 0) {
                        y = (this._group.height - (hasOrigin ? 0 : this.height)) / 2 + this._offsetY;
                    }
                    else {
                        y = this._group.height + this._offsetY;
                        if (!hasOrigin)
                            y -= this.height;
                    }
                }
                return this._group.y + y;
            }
        }
        Group.Item = Item;
    })(Group = Controls.Group || (Controls.Group = {}));
})(Controls || (Controls = {}));
var Game;
(function (Game) {
    var Bonus;
    (function (Bonus_1) {
        class Bonus {
            constructor(type, name, shortName, unlockVal, price, duration) {
                this._type = type;
                this._name = name;
                this._shortName = shortName;
                this._unlockVal = 0;
                this._unlockTargetVal = unlockVal;
                this._price = price;
                this._actDuration = duration;
                this._state = 0;
            }
            get activationTime() { return this._actTime; }
            get type() { return this._type; }
            get state() {
                if (this._state == 2) {
                    if (this.getRemActTime() != 0)
                        return 2;
                    this._state = 1;
                }
                if (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle")
                    return 1;
                return this._state;
            }
            get price() { return this._price; }
            get shortName() { return this._shortName; }
            get name() { return this._name; }
            get unlockProgress() { return this._unlockVal / this._unlockTargetVal; }
            incUnlockVal(val) {
                if (this.state == 0) {
                    if ((this._unlockVal += val) >= this._unlockTargetVal) {
                        val = this._unlockVal - this._unlockTargetVal;
                        this._unlockVal = this._unlockTargetVal;
                        this._state = 1;
                    }
                    else {
                        val = -1;
                    }
                }
                return val;
            }
            activate(actTime, emitEvent = true) {
                if (this.state != 0) {
                    if (actTime == undefined) {
                        actTime = Date.now();
                    }
                    else {
                        if (this._actDuration - (Date.now() - actTime) <= 0)
                            return;
                    }
                    this._state = 2;
                    this._actTime = actTime;
                    if (emitEvent)
                        Game.game.events.emit(Bonus.EVENT_ACTIVATE, this);
                }
            }
            getRemActTime() {
                if (this._state != 2)
                    return 0;
                let remTime = this._actDuration - (Date.now() - this._actTime);
                if (remTime <= 0) {
                    this._state = 1;
                    return 0;
                }
                return remTime;
            }
        }
        Bonus.EVENT_ACTIVATE = "bnsActivate";
        Bonus_1.Bonus = Bonus;
    })(Bonus = Game.Bonus || (Game.Bonus = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Bonus;
    (function (Bonus) {
        class Manager {
            constructor() {
                this._bonuses = [
                    new Bonus.Bonus(0, "SHIELD", "shield", 40, 5, 10 * 60 * 1000),
                    new Bonus.Bonus(1, "STOP THE BALL", "stop", 60, 5, 10 * 60 * 1000),
                    new Bonus.Bonus(2, "FREEZE OBSTACLES", "freeze", 90, 10, 10 * 60 * 1000),
                    new Bonus.Bonus(3, "BOMB", "bomb", 140, 10, 10 * 60 * 1000),
                    new Bonus.Bonus(4, "DOUBLE SCORE", "2x score", 210, 15, 10 * 60 * 1000),
                ];
                this._unlockedBonusCnt = 0;
            }
            get bonuses() { return this._bonuses; }
            get unlockedBonusCnt() {
                if (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle")
                    return this._bonuses.length;
                return this._unlockedBonusCnt;
            }
            getBonus(type) {
                return this._bonuses[type];
            }
            incBonusUnlockVal(val) {
                while (this.unlockedBonusCnt < this._bonuses.length) {
                    val = this._bonuses[this._unlockedBonusCnt].incUnlockVal(val);
                    if (val < 0)
                        break;
                    if (Gamee2.Gamee.initialized)
                        Gamee2.Gamee.logEvent("BONUS_UNLOCKED", this._bonuses[this._unlockedBonusCnt].shortName);
                    this._unlockedBonusCnt++;
                    if (val == 0)
                        break;
                }
            }
        }
        Bonus.Manager = Manager;
    })(Bonus = Game.Bonus || (Game.Bonus = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Themes;
    (function (Themes) {
        class BgLayer {
            constructor(y, height, scrollSpeed) {
                this._y = y;
                this._height = height;
                this._scrollSpeed = scrollSpeed;
            }
            get y() { return this._y; }
            get height() { return this._height; }
            get scrollSpeed() { return this._scrollSpeed; }
        }
        Themes.BgLayer = BgLayer;
    })(Themes = Game.Themes || (Game.Themes = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Themes;
    (function (Themes) {
        class Manager {
            constructor() {
                this._themes = [
                    new Themes.Theme(0, "", null, [
                        new Themes.BgLayer(217, 526, 0),
                        new Themes.BgLayer(539, 235, 60),
                        new Themes.BgLayer(579, 259, -90),
                        new Themes.BgLayer(643, 317, 120),
                        new Themes.BgLayer(918, 42, -150)
                    ], new Phaser.Display.Color(0xe3, 0xcc, 0xd9, 1), new Phaser.Display.Color(0x4b, 0x00, 0x2b, 1), 0x00122a),
                    new Themes.Theme(1, "Wooden Theme", null, [
                        new Themes.BgLayer(62, 836, 0),
                        new Themes.BgLayer(585, 313, 60),
                        new Themes.BgLayer(538, 360, -90),
                        new Themes.BgLayer(644, 316, 120),
                    ], new Phaser.Display.Color(0x9e, 0xb0, 0xa4, 1), new Phaser.Display.Color(0x00, 0x17, 0x07, 1), 0x4e2b0c),
                    new Themes.Theme(2, "Underwater Theme", null, [
                        new Themes.BgLayer(258, 444, 0),
                        new Themes.BgLayer(563, 233, 60),
                        new Themes.BgLayer(707, 193, -90),
                        new Themes.BgLayer(765, 195, 120),
                    ], new Phaser.Display.Color(0xca, 0xd8, 0xe0, 1), new Phaser.Display.Color(0x11, 0x65, 0x94, 1), 0x003560),
                ];
                this._curTheme = this._themes[0];
            }
            get themes() { return this._themes; }
            get curTheme() { return this._curTheme; }
            set curTheme(theme) { this._curTheme = theme; }
            getTheme(uid) {
                let i = this._themes.length;
                while (i-- != 0) {
                    if (this._themes[i].uid == uid)
                        return this._themes[i];
                }
                return null;
            }
        }
        Themes.Manager = Manager;
    })(Themes = Game.Themes || (Game.Themes = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Themes;
    (function (Themes) {
        class Theme {
            constructor(uid, name, price, bgLayers, bgFlashColor1, bgFlashColor2, bgColor) {
                this._uid = uid;
                this._price = price;
                this._name = name;
                this._bgLayers = bgLayers;
                this._bgFlashColor1 = bgFlashColor1;
                this._bgFlashColor2 = bgFlashColor2;
                this._bgColor = bgColor;
            }
            get uid() { return this._uid; }
            get price() { return this._price; }
            get name() { return this._name; }
            get bgLayers() { return this._bgLayers; }
            get bgFlashColor1() { return this._bgFlashColor1; }
            get bgFlashColor2() { return this._bgFlashColor2; }
            get bgColor() { return this._bgColor; }
            get assetsPath() { return "themes/" + this._uid + "/"; }
            get unlocked() { return Game.saveState.isThemeUnlocked(this); }
        }
        Themes.Theme = Theme;
    })(Themes = Game.Themes || (Game.Themes = {}));
})(Game || (Game = {}));
var PopupMessage;
(function (PopupMessage) {
    class MessageBase {
        constructor() {
            this._active = false;
            this._startPos = new Phaser.Geom.Point();
            this._moveAngle = Phaser.Math.DegToRad(-90);
        }
        update() {
            if (!this._active)
                return false;
            let time = this._timer.time - this._startTime;
            let completeMask = 0;
            let container = this.getContainer();
            let progress = time / this._type.moveTime;
            if (progress >= 1) {
                progress = 1;
                completeMask |= 1;
            }
            let progressEased = this._type.moveEase(progress);
            container.x = this._startPos.x + (Math.cos(this._moveAngle) * (progressEased * this._type.moveDistance));
            container.y = this._startPos.y + (Math.sin(this._moveAngle) * (progressEased * this._type.moveDistance));
            if (time > this._type.alphaDelay) {
                progress = (time - this._type.alphaDelay) / this._type.alphaTime;
                if (progress >= 1) {
                    progress = 1;
                    completeMask |= 2;
                }
                container.alpha = 1 - this._type.alphaEase(progress);
            }
            if (completeMask == 3) {
                this.kill();
                return false;
            }
            return true;
        }
        showMessage(x, y, type, timer) {
            let msg = this.getContainer();
            msg.x = x;
            msg.y = y;
            msg.alpha = 1;
            this._timer = timer;
            this._startPos.setTo(x, y);
            this._startTime = timer.time;
            this._type = type;
            this._active = true;
        }
        kill() {
            this._active = false;
        }
    }
    PopupMessage.MessageBase = MessageBase;
})(PopupMessage || (PopupMessage = {}));
var PopupMessage;
(function (PopupMessage) {
    class MessageType {
        constructor(moveDistance, moveTime, moveEase, alphaDelay, alphaTime, alphaEase) {
            this._moveDistance = moveDistance;
            this._moveTime = moveTime;
            this._moveEase = moveEase;
            this._alphaDelay = alphaDelay;
            this._alphaTime = alphaTime;
            this._alphaEase = alphaEase;
        }
        get moveDistance() { return this._moveDistance; }
        get moveTime() { return this._moveTime; }
        get moveEase() { return this._moveEase; }
        get alphaDelay() { return this._alphaDelay; }
        get alphaTime() { return this._alphaTime; }
        get alphaEase() { return this._alphaEase; }
    }
    PopupMessage.MessageType = MessageType;
})(PopupMessage || (PopupMessage = {}));
var Game;
(function (Game) {
    var SharedScenes;
    (function (SharedScenes) {
        var Background;
        (function (Background) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "bg",
                        physics: {},
                        plugins: [],
                    });
                }
                create() {
                    Background.layers = new Background.Layers(this);
                    Background.layers.reset();
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                }
                update(time, delta) {
                    Background.layers.update(time, delta);
                }
                handleResChange(w, h) {
                    if (!Background.layers.hasCustomWidth) {
                        let camera = this.cameras.main;
                        camera.setSize(w, h);
                        camera.setScroll((Game.scale.maxWidth - w) >> 1, 0);
                        camera.emit("cameraResize", camera);
                    }
                }
            }
            Background.Scene = Scene;
        })(Background = SharedScenes.Background || (SharedScenes.Background = {}));
    })(SharedScenes = Game.SharedScenes || (Game.SharedScenes = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var SharedScenes;
    (function (SharedScenes) {
        var Background;
        (function (Background) {
            class Layers {
                constructor(scene) {
                    this._scene = scene;
                    this._freeLayers = new Collections.Pool(undefined, 4, true, () => {
                        return new Layer(this._scene);
                    }, this);
                    this._actLayers = new Collections.NodeList();
                    let camera = scene.cameras.main;
                    this._viewVisW = camera.width;
                    this._viewCustomVisW = 0;
                    this.setTheme(Game.themes.curTheme);
                    camera.on("cameraResize", this.handleCameraResize, this);
                }
                get camera() { return this._scene.cameras.main; }
                get speedRatio() { return this._speedRatio; }
                set speedRatio(ratio) {
                    if (this._speedRatio != ratio) {
                        if (ratio < 0) {
                            ratio = 0;
                        }
                        else if (ratio > 1) {
                            ratio = 1;
                        }
                        this._speedRatio = ratio;
                    }
                }
                get hasCustomWidth() { return this._viewCustomVisW != 0; }
                reset() {
                    this._flashTime = 0;
                    this._actLayers.getItemById(0).data.sprite.clearTint();
                    let x = (Game.scale.maxWidth - this._viewVisW) >> 1;
                    this._actLayers.forEach((layer) => {
                        layer.sprite.x = x;
                        layer.sprite.width = this._viewVisW;
                    });
                    this._speedRatio = 1;
                }
                setTheme(theme) {
                    if (this._curTheme && this._curTheme.uid == theme.uid)
                        return;
                    this._curTheme = theme;
                    this._actLayers.forEach((layer) => {
                        layer.reset();
                        this._freeLayers.returnItem(layer);
                    }, this);
                    this._actLayers.clear();
                    let x = (Game.scale.maxWidth - this._viewVisW) >> 1;
                    let w = this._viewVisW;
                    for (let i = 0; i < theme.bgLayers.length; i++) {
                        let layer = this._freeLayers.getItem();
                        layer.init(theme, i, x, w, false);
                        this._actLayers.add(layer);
                        if (i != 0) {
                            layer = this._freeLayers.getItem();
                            layer.init(theme, i, x, w, true);
                            this._actLayers.add(layer);
                        }
                    }
                    this.camera.setBackgroundColor(theme.bgColor);
                }
                setCustomWidth(w) {
                    this._viewCustomVisW = w;
                }
                clearCustomWidth() {
                    this._viewCustomVisW = 0;
                }
                update(time, delta) {
                    delta /= (1000 / 60);
                    let scale = this.speedRatio * delta;
                    let wDif = 0;
                    let hwDif = 0;
                    if (this._viewCustomVisW != 0) {
                        wDif = this._viewCustomVisW - this._viewVisW;
                        if (wDif != 0) {
                            this._viewVisW += wDif;
                            hwDif = wDif >> 1;
                        }
                    }
                    this._actLayers.forEach((layer) => {
                        let sprite = layer.sprite;
                        sprite.tilePositionX += ((layer.data.scrollSpeed / 60) * scale) - hwDif;
                        sprite.x -= hwDif;
                        sprite.width += wDif;
                    });
                    if (this._flashTime != 0) {
                        let progress = Phaser.Math.Easing.Cubic.Out((time - this._flashTime) / 250);
                        if (progress < 1) {
                            let col = Phaser.Display.Color.Interpolate.ColorWithColor(this._curTheme.bgFlashColor1, this._curTheme.bgFlashColor2, 100, progress * 100);
                            this._actLayers.getItemById(0).data.sprite.setTintFill(Phaser.Display.Color.GetColor32(col.r, col.g, col.b, 1));
                        }
                        else {
                            progress = 1;
                            this._actLayers.getItemById(0).data.sprite.clearTint();
                            this._flashTime = 0;
                        }
                    }
                }
                startFlashFx() {
                    this._flashTime = this._scene.game.loop.time;
                }
                handleCameraResize(camera) {
                    if (this._viewCustomVisW != 0) {
                        this._viewVisW = this._viewCustomVisW;
                    }
                    else {
                        this._viewVisW = camera.width;
                    }
                    let x = (Game.scale.maxWidth - this._viewVisW) >> 1;
                    this._actLayers.forEach((layer) => {
                        layer.sprite.x = x;
                        layer.sprite.width = this._viewVisW;
                    });
                }
            }
            Background.Layers = Layers;
            class Layer {
                get sprite() { return this._sprite; }
                get data() { return this._layer; }
                constructor(scene) {
                    this._scene = scene;
                }
                init(theme, layerId, x, w, flipped) {
                    this._layer = theme.bgLayers[layerId];
                    let y = this._layer.y;
                    if (flipped)
                        y = Game.scale.maxHeight - this._layer.height - y;
                    if (this._sprite) {
                        this._sprite
                            .setPosition(x, y)
                            .setSize(w, this._layer.height)
                            .setDepth(layerId);
                        this._sprite.setFrame(this.getFrame(theme, layerId));
                    }
                    else {
                        this._sprite = this._scene.add.tileSprite(x, y, w, this._layer.height, "atlas_0", this.getFrame(theme, layerId))
                            .setDepth(layerId)
                            .setOrigin(0);
                    }
                    this._sprite.flipY = flipped;
                    this._sprite.visible = true;
                }
                reset() {
                    this._layer = null;
                    this._sprite.destroy();
                    this._sprite = null;
                }
                getFrame(theme, layerId) {
                    return theme.assetsPath + "bg/layer_" + layerId;
                }
            }
        })(Background = SharedScenes.Background || (SharedScenes.Background = {}));
    })(SharedScenes = Game.SharedScenes || (Game.SharedScenes = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    class BingBong extends Phaser.Game {
        constructor() {
            super({
                type: Phaser.AUTO,
                width: 128,
                height: 128,
                physics: null,
                scale: {
                    mode: Phaser.Scale.NONE,
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
            });
            Game.game = this;
            Game.scale = new Helpers.ScaleManager(Game.game.scale, new Phaser.Geom.Point(480, 960), new Phaser.Geom.Point(720, 960));
            Game.scale.resize();
            Game.bonuses = new Game.Bonus.Manager();
            Game.themes = new Game.Themes.Manager();
            Game.saveState = new Game.SaveState.Manager();
            Gamee2.Gamee.events.on("audioChange", (on) => { Game.game.sound.mute = !on; });
            Gamee2.Gamee.events.on("pause", () => {
                this.pause();
            }, this);
            Gamee2.Gamee.events.on("resume", () => {
                this.resume();
            }, this);
            Gamee2.Gamee.events.on("start", () => {
                this.resume();
                if (Game.States.states.state.id == 1)
                    return;
                Game.States.states.setCurState(1);
            }, this);
            Game.game.scene.add("boot", Game.SharedScenes.Background.Scene);
            Game.States.Manager.create();
        }
        pause() {
            if (!this._pausedScenes || this._pausedScenes.length == 0) {
                this._pausedScenes = this.scene.getScenes(true, false);
                if (this._pausedScenes)
                    this._pausedScenes.forEach((scene) => { scene.sys.pause(); });
            }
        }
        resume() {
            if (this._pausedScenes) {
                this._pausedScenes.forEach((scene) => { scene.sys.resume(); });
                this._pausedScenes = null;
            }
        }
        static create() {
            new BingBong();
        }
        static gameOver() {
            if (Game.States.states.state.id != 5) {
                let gameplay = Game.States.states.getState(2);
                if (gameplay.xp != 0) {
                    let unlockedBnsCnt = Game.bonuses.unlockedBonusCnt;
                    Game.bonuses.incBonusUnlockVal(gameplay.xp);
                    if (unlockedBnsCnt != Game.bonuses.unlockedBonusCnt) {
                        Game.States.states.setCurState(5, Game.bonuses.bonuses[unlockedBnsCnt]);
                        return;
                    }
                }
            }
            if (Gamee2.Gamee.ready) {
                Gamee2.Gamee.gameOver();
            }
            else {
                Game.States.states.setCurState(1);
            }
        }
    }
    BingBong._DEBUG = false;
    BingBong._CAM_FADE_LEN = 300;
    Game.BingBong = BingBong;
    window.onload = function () {
        BingBong.create();
    };
})(Game || (Game = {}));
var Game;
(function (Game) {
    class ItemPrice {
        constructor(value, currency) {
            this._value = value;
            this._currency = currency;
        }
        get value() { return this._value; }
        get currency() { return this._currency; }
    }
    Game.ItemPrice = ItemPrice;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var SaveState;
    (function (SaveState) {
        class Manager {
            constructor() {
                this._data = {
                    xp: 0,
                    actBonuses: null,
                    themesMask: 1,
                };
                this._flags = 0;
                Game.game.events.on(Game.Bonus.Bonus.EVENT_ACTIVATE, this.handleBonusActivation, this);
            }
            get xp() { return this._data.xp; }
            set xp(xp) {
                if (xp != this._data.xp) {
                    this._data.xp = xp;
                    this._flags |= 1;
                }
            }
            load(data) {
                this._data.xp = (data.xp != undefined ? data.xp : 0);
                Game.bonuses.incBonusUnlockVal(this._data.xp);
                if (data.actBonuses) {
                    data.actBonuses.forEach((ab) => {
                        Game.bonuses.getBonus(ab.type).activate(ab.actTime, false);
                    });
                    data.actBonuses = data.actBonuses.filter((ab) => {
                        return (Game.bonuses.getBonus(ab.type).state == 2);
                    });
                    this._data.actBonuses = data.actBonuses;
                }
                if (data.themesMask != undefined)
                    this._data.themesMask = data.themesMask;
            }
            save() {
                if ((this._flags & 1) == 0)
                    return;
                if ((this._flags & 2) != 0)
                    return;
                this._flags &= ~1;
                if (Gamee2.Gamee.ready) {
                    this._flags |= 2;
                    Gamee2.Gamee.gameSave(JSON.stringify(this._data), (res) => {
                        this._flags &= ~2;
                        if (!res)
                            this._flags |= 1;
                    }, this);
                }
            }
            unlockTheme(theme) {
                this._data.themesMask |= (1 << theme.uid);
                this._flags |= 1;
                this.save();
            }
            isThemeUnlocked(theme) {
                if (!theme.price)
                    return true;
                if (theme.price.currency == 2)
                    return Gamee2.Gamee.initialized && Gamee2.Gamee.initData.playerMembershipType == "vip";
                return (this._data.themesMask & (1 << theme.uid)) != 0;
            }
            handleBonusActivation(bonus) {
                if (!this._data.actBonuses)
                    this._data.actBonuses = [];
                let complete = false;
                this._data.actBonuses.every((data) => {
                    if (data.type == bonus.type) {
                        data.actTime = bonus.activationTime;
                        complete = true;
                        return false;
                    }
                    return true;
                });
                if (!complete)
                    this._data.actBonuses.push({ type: bonus.type, actTime: bonus.activationTime });
                this._flags |= 1;
                this.save();
            }
        }
        SaveState.Manager = Manager;
    })(SaveState = Game.SaveState || (Game.SaveState = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        class State {
            constructor(id) {
                this._id = id;
            }
            get id() { return this._id; }
            deactivate(newState) { }
            update(delta) { }
        }
        States.State = State;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        class Manager {
            constructor() {
                this._states = [
                    new States.Boot.State(),
                    new States.Shop.State(),
                    new States.Gameplay.State(),
                    new States.ExtraLife.State(),
                    new States.BattleCreator.State(),
                    new States.BonusIntro.State()
                ];
                this._state = -1;
            }
            get state() { return this._states[this._state]; }
            static create() {
                if (States.states)
                    return;
                States.states = new Manager();
                States.states.setCurState(0);
            }
            getState(state) { return this._states[state]; }
            setCurState(state, data) {
                let prevState = this._state;
                if (prevState >= 0)
                    this._states[prevState].deactivate(state);
                this._states[state].activate(prevState, data);
                this._state = state;
            }
        }
        States.Manager = Manager;
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Boot;
        (function (Boot) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "boot",
                        physics: {},
                        plugins: ["Loader"],
                    });
                }
                preload() {
                    this.load.setPath("assets/");
                    this.load.atlas("atlas_0");
                    this.load.xml("fntScore");
                    this.load.xml("fntText40");
                    this.load.xml("fntText66");
                    this.load.audioSprite("sfx", "sfx.json");
                    this.load.audio("mainTheme", [
                        "main.ogg",
                        "main.mp3"
                    ]);
                    Gamee2.Gamee.events.once("initialized", (initState, initData) => {
                        this._mode = 1;
                        Game.game.sound.mute = !initData.sound;
                        Gamee2.Gamee.loadAd();
                        if (initData.saveState)
                            Game.saveState.load(JSON.parse(initData.saveState));
                        if (initData.gameContext == "battle") {
                            if (initData && initData.initData) {
                                let battleData = JSON.parse(initData.initData);
                                Game.themes.curTheme = Game.themes.getTheme(battleData.themeUID);
                            }
                        }
                    });
                    this._mode = Gamee2.Gamee.initialize("FullScreen", ["saveState", "logEvents", "share", "rewardedAds"]) ? 0 : 1;
                }
                update() {
                    if (this._mode == 1) {
                        let fontKeys = [
                            "fntScore",
                            "fntText40",
                            "fntText66"
                        ];
                        fontKeys.forEach((key) => {
                            Phaser.GameObjects.BitmapText.ParseFromAtlas(this, key, "atlas_0", "fonts/" + key, key, 0, 0);
                        }, this);
                        Game.game.scene.run("bg");
                        States.states.setCurState(1);
                    }
                }
            }
            Boot.Scene = Scene;
        })(Boot = States.Boot || (States.Boot = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Boot;
        (function (Boot) {
            class State extends States.State {
                constructor() {
                    super(0);
                    State._instance = this;
                    Game.game.scene.add("boot", Boot.Scene);
                }
                static get instance() { return State._instance; }
                activate(prevState) {
                    Game.game.scene.start("boot");
                }
                deactivate(newState) {
                    Game.game.scene.remove("boot");
                }
            }
            Boot.State = State;
        })(Boot = States.Boot || (States.Boot = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Shop;
        (function (Shop) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "shop",
                        physics: {},
                        plugins: ["InputPlugin", "Clock"],
                    });
                    this._gameeGameReady = false;
                }
                create() {
                    this._tapToPlayLbl = this.add.bitmapText(0, 0, "fntText66", "TAP TO PLAY", 66)
                        .setOrigin(0.5)
                        .setAngle(-90)
                        .setVisible(false);
                    this._cardsContainer = this.add.container(0, 0);
                    let bg = this.make.graphics();
                    this._cardsContainer.add(bg);
                    this._cards = [];
                    Game.bonuses.bonuses.forEach((bonus, i) => {
                        this._cards.push(new Shop.BonusCard(this, this._cardsContainer, 20, i * (Shop.BonusCard.HEIGHT + 20) + 20, bonus));
                    }, this);
                    this._cardsContainer.setSize(Shop.BonusCard.WIDTH + 40, (this._cards.length * (Shop.BonusCard.HEIGHT + 20)) + 20);
                    bg.fillStyle(0xFFFFFF, 0.3)
                        .fillRect(0, 0, this._cardsContainer.width, this._cardsContainer.height);
                    this._actCards = new Collections.NodeList();
                    if (!Gamee2.Gamee.initialized || (Gamee2.Gamee.initData.platform != "web" && Gamee2.Gamee.initData.platform != "mobile_web" && Gamee2.Gamee.initData.gameContext != "battle")) {
                        this._btnBattle = new Controls.Buttons.BasicButton(this, 0, 0, "atlas_0", "ui/btnBattle_");
                        this.events.on("btn_click", () => {
                            if (this._state == 0) {
                                this._state = 1;
                                Game.game.sound.playAudioSprite("sfx", "click");
                                this.fadeOut(() => { States.states.setCurState(4); });
                            }
                        }, this);
                    }
                    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                    this.events.on(Phaser.Scenes.Events.WAKE, this.handleSceneWake, this);
                    this.events.on(Phaser.Scenes.Events.SLEEP, this.handleSceneSleep, this);
                    this.handleSceneWake();
                }
                update(time, delta) {
                    if (Gamee2.Gamee.initialized && !this._gameeGameReady) {
                        this._gameeGameReady = true;
                        Game.game.pause();
                        Gamee2.Gamee.gameReady();
                    }
                    this._tapToPlayLbl.visible = (Math.floor(time / 500) & 1) != 0;
                }
                fadeOut(clb) {
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                        clb();
                    }, this);
                    this.cameras.main.fadeOut(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                }
                handleSceneWake() {
                    this._state = 0;
                    this._actCards.clear();
                    this._cards.forEach((card) => {
                        card.updateCard();
                        if (card.bonus.state == 2)
                            this._actCards.add(card);
                    }, this);
                    if (!this._actCards.empty)
                        this.createCardUpdateEvent();
                    this.cameras.main.removeListener(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE);
                    this.cameras.main.resetFX();
                    let bgLayers = Game.SharedScenes.Background.layers;
                    bgLayers.camera.setAngle(0);
                    bgLayers.clearCustomWidth();
                    bgLayers.reset();
                    Game.game.events.on(Game.Bonus.Bonus.EVENT_ACTIVATE, this.handleBonusActivation, this);
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                }
                handleSceneSleep() {
                    if (this._cardsUpdateEvent) {
                        this._cardsUpdateEvent.remove(false);
                        this._cardsUpdateEvent = null;
                    }
                    Game.game.events.off(Game.Bonus.Bonus.EVENT_ACTIVATE, this.handleBonusActivation, this);
                    Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                createCardUpdateEvent() {
                    this._cardsUpdateEvent = this.time.addEvent({
                        delay: 1000,
                        loop: true,
                        callback: this.handleCardsUpdateEvent,
                        callbackScope: this,
                    });
                    this.handleCardsUpdateEvent();
                }
                handleBonusActivation(bonus) {
                    let bonusCard;
                    this._cards.every((card) => {
                        if (card.bonus.type == bonus.type) {
                            bonusCard = card;
                            return false;
                        }
                        return true;
                    });
                    bonusCard.updateCard();
                    this._actCards.add(bonusCard);
                    if (!this._cardsUpdateEvent) {
                        this.createCardUpdateEvent();
                    }
                    else {
                        bonusCard.update();
                    }
                }
                handleCardsUpdateEvent() {
                    this._actCards.forEach((card, node) => {
                        if (!card.update())
                            this._actCards.removeByNode(node);
                    }, this);
                }
                handlePointerDown() {
                    if (this._state != 0)
                        return;
                    this._state = 1;
                    Game.game.sound.play("mainTheme", { loop: true, rate: 1 });
                    this.fadeOut(() => {
                        Gamee2.Gamee.loadAd();
                        States.states.setCurState(2);
                    });
                }
                handleResChange(w, h) {
                    this.cameras.main.setSize(w, h);
                    this._tapToPlayLbl.setPosition((w - this._cardsContainer.width) / 2, h / 2);
                    this._cardsContainer.x = w - this._cardsContainer.width;
                    this._cardsContainer.y = (h - this._cardsContainer.height) / 2;
                    if (this._btnBattle)
                        this._btnBattle.setPosition(20, 20);
                }
            }
            Shop.Scene = Scene;
        })(Shop = States.Shop || (States.Shop = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Shop;
        (function (Shop) {
            class State extends States.State {
                constructor() {
                    super(1);
                    Game.game.scene.add("shop", Shop.Scene);
                }
                activate(prevState) {
                    Game.game.scene.run("shop");
                    if (!this._scene) {
                        this._scene = Game.game.scene.getScene("shop");
                        this._scene.events.on(Shop.BonusCard.EVENT_CLICK, this.handleBnsCardClick, this);
                    }
                    if (prevState != 0)
                        this._scene.cameras.main.fadeIn(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                }
                deactivate(newState) {
                    this._scene.sys.sleep();
                }
                handleBnsCardClick(card) {
                    let bonus = card.bonus;
                    if (bonus.state == 1) {
                        Game.game.sound.playAudioSprite("sfx", "click");
                        if (Gamee2.Gamee.ready) {
                            Gamee2.Gamee.showAd((res) => {
                                if (res)
                                    bonus.activate();
                            }, this);
                        }
                        else {
                            bonus.activate();
                        }
                    }
                }
            }
            Shop.State = State;
        })(Shop = States.Shop || (States.Shop = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Shop;
        (function (Shop) {
            class BonusCard {
                constructor(scene, container, x, y, bonus) {
                    this._scene = scene;
                    this._bonus = bonus;
                    this._bonusState = bonus.state;
                    this._container = new Controls.Group.Group(false)
                        .setPosition(x, y);
                    this._bg = scene.add.image(0, 0, "atlas_0", "ui/common/btnBigBlue_0")
                        .setOrigin(0, 0)
                        .setInteractive();
                    this._bg.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handlePointerDown, this);
                    this._bg.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handlePointerOut, this);
                    this._bg.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePointerUp, this);
                    container.add(this._bg);
                    this._container.add(this._bg);
                    let content = new Controls.Group.Group(true)
                        .setPosition(x, y)
                        .setCustomSize(this._container.width, this._container.height - BonusCard.PRESSED_SHIFT);
                    this._content = this._container.add(content, 0, 0, 0, false);
                    this._stateIcon = scene.add.image(0, 0, "atlas_0", BonusCard.ASSET_PATH + "StateMark_" + this._bonusState)
                        .setOrigin(0, 0);
                    container.add(this._stateIcon);
                    content.add(this._stateIcon, 0, 0, 0, false);
                    let img = scene.add.image(0, 0, "atlas_0", "ui/bonuses/" + bonus.shortName);
                    container.add(img);
                    this._icon = content.add(img, 100, 50, 0, false);
                    let txt = scene.add.bitmapText(0, 0, "fntText40", bonus.shortName.toUpperCase(), 40)
                        .setOrigin(1, 0);
                    container.add(txt);
                    this._name = content.add(txt, 310, 12, 0, false);
                    this._unlockBar = new Controls.ProgressBar(scene, "atlas_0", BonusCard.ASSET_PATH + "BarBg", BonusCard.ASSET_PATH + "BarFill");
                    this._unlockBarGroupItem = content.add(this._unlockBar.container, 155, 62, 0, false);
                    this._unlockBar.container.every((object) => {
                        container.add(object);
                        return true;
                    }, this);
                    txt = scene.add.bitmapText(0, 0, "fntText40", "", Math.round(40 * 0.8))
                        .setOrigin(1, 0)
                        .setTint(0xffb901);
                    this._price = content.add(txt, 310, 56, 0, false);
                    container.add(txt);
                    img = scene.add.image(0, 0, "atlas_0", "gamee/video");
                    img.setScale(32 / img.height)
                        .setOrigin(1, 0.5);
                    this._priceIcon = content.add(img, 310, 70, 0, false);
                    container.add(img);
                    this.updateCard();
                }
                get bonus() { return this._bonus; }
                get bonusIcon() { return this._icon.content; }
                update() {
                    if (this._bonusState == 2)
                        return this.updateBonusRemActTime();
                    return false;
                }
                updateCard() {
                    let bnsState = this._bonus.state;
                    this._bonusState = bnsState;
                    this._stateIcon.setFrame(BonusCard.ASSET_PATH + "StateMark_" + bnsState);
                    if (bnsState == 0) {
                        this._icon.setAlpha(0.3);
                        this._name.setAlpha(0.3);
                        this._unlockBarGroupItem.visible = true;
                        this._unlockBar.value = this._bonus.unlockProgress;
                        this._price.visible = false;
                        this._priceIcon.visible = false;
                    }
                    else {
                        this._icon.setAlpha(1);
                        this._name.setAlpha(1);
                        this._unlockBarGroupItem.visible = false;
                        if (bnsState == 1) {
                            this._price.visible = false;
                            this._priceIcon.visible = true;
                        }
                        else {
                            this._price.visible = true;
                            this._priceIcon.visible = false;
                            this.updateBonusRemActTime();
                        }
                    }
                }
                updateBonusRemActTime() {
                    let remActTime = Math.ceil(this._bonus.getRemActTime() / 1000);
                    if (remActTime > 0) {
                        let min = Math.floor(remActTime / 60).toString();
                        if (min.length == 1)
                            min = "0" + min;
                        let sec = Math.floor(remActTime % 60).toString();
                        if (sec.length == 1)
                            sec = "0" + sec;
                        this._price.content.setText(min + ":" + sec);
                        return true;
                    }
                    else {
                        this.updateCard();
                        return false;
                    }
                }
                setPressState(pressed) {
                    if (this._pressed != pressed) {
                        this._pressed = pressed;
                        this._bg.setFrame("ui/common/btnBigBlue_" + (pressed ? 1 : 0));
                        this._content.setOffsetY(pressed ? BonusCard.PRESSED_SHIFT : 0);
                    }
                }
                handlePointerDown(pointer, localX, localY, event) {
                    event.stopPropagation();
                    if (this._bonusState == 1)
                        this.setPressState(true);
                }
                handlePointerOut(pointer, event) {
                    event.stopPropagation();
                    this.setPressState(false);
                }
                handlePointerUp(pointer, localX, localY, event) {
                    event.stopPropagation();
                    if (this._pressed) {
                        this.setPressState(false);
                        this._scene.events.emit(BonusCard.EVENT_CLICK, this);
                    }
                }
            }
            BonusCard.WIDTH = 328;
            BonusCard.HEIGHT = 100;
            BonusCard.PRESSED_SHIFT = 4;
            BonusCard.EVENT_CLICK = "bnsCardClick";
            BonusCard.ASSET_PATH = "ui/shop/item";
            Shop.BonusCard = BonusCard;
        })(Shop = States.Shop || (States.Shop = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var BattleCreator;
        (function (BattleCreator) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "battleCreator",
                        physics: {},
                        plugins: ["InputPlugin"],
                    });
                }
                create() {
                    this._panel = new Controls.Group.Group(true)
                        .setCustomSize(Scene.PANEL_W, Scene.PANEL_H);
                    let bg = this.add.graphics()
                        .fillStyle(0xFFFFFF, 0.3)
                        .fillRect(0, 0, Scene.PANEL_W, Scene.PANEL_H);
                    this._panel.add(bg, 0, 0, 0, false);
                    this._panel.add(this.add.bitmapText(0, 0, "fntText66", "BATTLE CREATOR", 50).setOrigin(0.5, 0), 0, 40, 4, false);
                    let y = 120;
                    this._themeBtns = [];
                    Game.themes.themes.forEach((theme, index) => {
                        let btn = new BattleCreator.ThemeButton(this, theme);
                        btn.setId(index);
                        if (Game.themes.curTheme.uid == theme.uid) {
                            btn.enabled = false;
                            this._curThemeBtn = btn;
                        }
                        this._themeBtns.push(btn);
                        this._panel.add(btn, 0, y, 4, false);
                        y += btn.height + 20;
                    }, this);
                    let btnContent = new Controls.Group.Group(false);
                    btnContent.add(this.add.bitmapText(0, 0, "fntText66", "CREATE", 50));
                    let btn = new Controls.Buttons.ContentButton(this, 0, 0, "atlas_0", "ui/common/btnBigBlue_", 4)
                        .setContent(btnContent)
                        .setId(Game.themes.themes.length);
                    this._panel.add(btn, 0, -30, 4 | 2, false);
                    btnContent = new Controls.Group.Group(false);
                    btnContent.add(this.add.bitmapText(0, 0, "fntText66", "X", 50), 4, 5);
                    this._btnClose = new Controls.Buttons.ContentButton(this, 0, 0, "atlas_0", "ui/common/btnMinorSquare_", 3);
                    this._btnClose.setContent(btnContent)
                        .setId(-1);
                    this.events.on("btn_click", this.handleButtonClick, this);
                    this.events.on(Phaser.Scenes.Events.WAKE, this.handleSceneWake, this);
                    this.events.on(Phaser.Scenes.Events.SLEEP, this.handleSceneSleep, this);
                    this.handleSceneWake();
                }
                fadeOut(clb) {
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                        clb();
                    }, this);
                    this.cameras.main.fadeOut(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                }
                handleSceneWake() {
                    this.cameras.main.removeListener(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE);
                    this.cameras.main.resetFX();
                    this._btnClose.enabled = true;
                    Game.SharedScenes.Background.layers.setTheme(this._curThemeBtn.theme);
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                }
                handleSceneSleep() {
                    Game.SharedScenes.Background.layers.setTheme(Game.themes.themes[0]);
                    Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                handleButtonClick(button) {
                    let btnId = button.id;
                    Game.game.sound.playAudioSprite("sfx", "click");
                    if (btnId < 0) {
                        this._btnClose.enabled = false;
                        this.fadeOut(() => { States.states.setCurState(1); });
                    }
                    else if (btnId < Game.themes.themes.length) {
                        let theme = Game.themes.themes[btnId];
                        if (theme.unlocked) {
                            this.setNewTheme(button);
                        }
                        else {
                            if (Gamee2.Gamee.initialized) {
                                if (theme.price.currency == 1) {
                                    Gamee2.Gamee.purchaseItem(theme.price.value, theme.price.currency, theme.name, Game.game.textures.getBase64("atlas_0", theme.assetsPath + "icon_0"), false, (res) => {
                                        if (res)
                                            this.unlockTheme(button);
                                    }, this);
                                }
                                else {
                                    Gamee2.Gamee.showSubscribeDialog((res) => {
                                        if (res)
                                            this.unlockTheme(button);
                                    }, this);
                                }
                            }
                            else {
                                this.unlockTheme(button);
                            }
                        }
                    }
                    else {
                        if (Gamee2.Gamee.initialized) {
                            let settings = {
                                themeUID: this._curThemeBtn.theme.uid
                            };
                            Gamee2.Gamee.share({
                                text: "BATTLE!",
                                picture: Game.game.textures.getBase64("atlas_0", "battle/splash_" + settings.themeUID),
                                destination: "battle",
                                initData: JSON.stringify(settings)
                            });
                        }
                    }
                }
                unlockTheme(themeBtn) {
                    Game.saveState.unlockTheme(themeBtn.theme);
                    themeBtn.handleThemeUnlock();
                    this.setNewTheme(themeBtn);
                }
                setNewTheme(newThemeBtn) {
                    this._curThemeBtn.enabled = true;
                    this._curThemeBtn = newThemeBtn;
                    newThemeBtn.enabled = false;
                    Game.SharedScenes.Background.layers.setTheme(newThemeBtn.theme);
                }
                handleResChange(w, h) {
                    this.cameras.main.setSize(w, h);
                    this._panel.setPosition((w - this._panel.width) / 2, (h - this._panel.height) / 2);
                    this._btnClose.setPosition(w - 20 - this._btnClose.width, 20);
                }
            }
            Scene.PANEL_W = 400;
            Scene.PANEL_H = 650;
            BattleCreator.Scene = Scene;
        })(BattleCreator = States.BattleCreator || (States.BattleCreator = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var BattleCreator;
        (function (BattleCreator) {
            class State extends States.State {
                constructor() {
                    super(4);
                    Game.game.scene.add("battleCreator", BattleCreator.Scene);
                }
                activate(prevState) {
                    Game.game.scene.run("battleCreator");
                    Game.game.scene.getScene("battleCreator").cameras.main.fadeIn(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                }
                deactivate(newState) {
                    Game.game.scene.sleep("battleCreator");
                }
            }
            BattleCreator.State = State;
        })(BattleCreator = States.BattleCreator || (States.BattleCreator = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var BattleCreator;
        (function (BattleCreator) {
            class ThemeButton extends Controls.Buttons.ContentButton {
                constructor(scene, theme) {
                    super(scene, 0, 0, "atlas_0", "ui/battle creator/btnTheme_", 4);
                    this._theme = theme;
                    let unlocked = theme.unlocked;
                    let content = new Controls.Group.Group(true)
                        .setCustomSize(308, 79);
                    this._themeImg = scene.add.image(0, 0, "atlas_0", theme.assetsPath + "icon_" + (unlocked ? 1 : 0)).setOrigin(0);
                    content.add(this._themeImg, 0, 0, 0, false);
                    if (!unlocked) {
                        let currency = theme.price.currency;
                        this._lockIcon = scene.add.image(0, 0, "atlas_0", "ui/lockIcon");
                        content.add(this._lockIcon, 71, 40, 0, false);
                        this._priceContainer = new Controls.Group.Group();
                        let priceIcon = scene.add.image(0, 0, "atlas_0");
                        let priceText = scene.add.bitmapText(0, 0, "fntText40", "", 40);
                        if (currency == 2) {
                            priceIcon
                                .setFrame("gamee/vipBadge")
                                .setOrigin(0.5, 0);
                            priceText.setText("SUBSCRIBE")
                                .setFontSize(Math.round(40 * 0.8))
                                .setOrigin(0.5, 0);
                            this._priceContainer.add(priceIcon, 0, 0, 4, true);
                            this._priceContainer.add(priceText, 0, this._priceContainer.height + 6, 4, true);
                        }
                        else {
                            priceIcon
                                .setFrame("gamee/gem")
                                .setOrigin(0, 0.5);
                            priceText.setText(theme.price.value.toString())
                                .setOrigin(0, 0.5);
                            this._priceContainer.add(priceIcon, 0, 0, 8, true);
                            this._priceContainer.add(priceText, this._priceContainer.width + 6, 6, 8, true);
                        }
                        content.add(this._priceContainer, 226 - this._priceContainer.width / 2, 40 - this._priceContainer.height / 2, 0, false);
                    }
                    this.setContent(content, new Phaser.Geom.Rectangle(0, 0, this.width, this.height - this._pressedContentOffY));
                    this.setId(theme.uid);
                }
                get theme() { return this._theme; }
                handleThemeUnlock() {
                    this._themeImg.setFrame(this._theme.assetsPath + "icon_1");
                    this._lockIcon.setVisible(false);
                    this._priceContainer.setVisible(false);
                }
            }
            BattleCreator.ThemeButton = ThemeButton;
        })(BattleCreator = States.BattleCreator || (States.BattleCreator = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var BonusIntro;
        (function (BonusIntro) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "bonusIntro",
                        physics: {},
                        plugins: ["InputPlugin", "TweenManager"],
                    });
                }
                create() {
                    this._panel = new Controls.Group.Group(true)
                        .setCustomSize(Scene.PANEL_W, Scene.PANEL_H);
                    let bg = this.add.graphics()
                        .fillStyle(0xFFFFFF, 0.3)
                        .fillRect(0, 0, Scene.PANEL_W, Scene.PANEL_H);
                    this._panel.add(bg, 0, 0, 0, false);
                    this._bonusName = this._panel.add(this.add.bitmapText(0, 0, "fntText40", "", 40).setOrigin(0.5, 0), 0, 30, 4, false);
                    this._unlockedLbl = this._panel.add(this.add.bitmapText(0, 0, "fntText40", "UNLOCKED!", 40).setOrigin(0.5, 0).setTint(0xffb903), 0, 80, 4, false);
                    this._bonusFx = this.add.image(0, 0, "atlas_0", "ui/bonuses/unlockFx");
                    this._panel.add(this._bonusFx, 0, -20, 4 | 8, false);
                    this._bonusIcon = this.add.image(0, 0, "atlas_0");
                    this._panel.add(this._bonusIcon, 0, -20, 4 | 8, false);
                    let btnContent = new Controls.Group.Group(false);
                    btnContent.add(this.add.bitmapText(0, 0, "fntText66", "CONTINUE", 50));
                    let btn = new Controls.Buttons.ContentButton(this, 0, 0, "atlas_0", "ui/common/btnBigBlue_", 4)
                        .setContent(btnContent);
                    this._panel.add(btn, 0, -30, 4 | 2, false);
                    this.events.on("btn_click", this.handleBtnClick, this);
                    this.events.on(Phaser.Scenes.Events.WAKE, this.handleSceneWake, this);
                    this.events.on(Phaser.Scenes.Events.SLEEP, this.handleSceneSleep, this);
                    this.handleSceneWake();
                }
                update(time, delta) {
                    delta = delta / (1000 / 60);
                    this._bonusFx.angle += delta;
                    this._unlockedLbl.visible = (Math.floor(time / 500) & 1) != 0;
                }
                fadeOut(clb) {
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                        clb();
                    }, this);
                    this.cameras.main.fadeOut(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                }
                handleBtnClick() {
                    if (this._state == 0) {
                        this._state = 1;
                        Game.game.sound.playAudioSprite("sfx", "click");
                        Game.BingBong.gameOver();
                    }
                }
                handleSceneWake() {
                    this._state = 0;
                    let bg = Game.SharedScenes.Background.layers;
                    bg.camera.setAngle(0);
                    bg.clearCustomWidth();
                    bg.reset();
                    let bonus = States.states.getState(5).bonus;
                    this._bonusName.content.setText(bonus.name);
                    this._bonusIcon.setFrame("ui/bonuses/big/" + bonus.shortName)
                        .setScale(0.25)
                        .setAlpha(0);
                    this._bonusFx.setScale(0.25)
                        .setAlpha(0);
                    this.tweens.add({
                        targets: [this._bonusFx, this._bonusIcon],
                        duration: 1000,
                        ease: Phaser.Math.Easing.Elastic.Out,
                        scaleX: 1,
                        scaleY: 1,
                        alpha: 1
                    });
                    this.cameras.main.removeListener(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE);
                    this.cameras.main
                        .resetFX()
                        .fadeIn(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                    Game.game.sound.playAudioSprite("sfx", "bonusIntro");
                }
                handleSceneSleep() {
                    Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                handleResChange(w, h) {
                    this.cameras.main.setSize(w, h);
                    this._panel.setPosition((w - this._panel.width) / 2, (h - this._panel.height) / 2);
                }
            }
            Scene.PANEL_W = 400;
            Scene.PANEL_H = 600;
            BonusIntro.Scene = Scene;
        })(BonusIntro = States.BonusIntro || (States.BonusIntro = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var BonusIntro;
        (function (BonusIntro) {
            class State extends States.State {
                constructor() {
                    super(5);
                    Game.game.scene.add("bonusIntro", BonusIntro.Scene);
                }
                get bonus() { return this._bonus; }
                activate(prevState, bonus) {
                    this._bonus = bonus;
                    Game.game.scene.run("bonusIntro");
                }
                deactivate(newState) {
                    Game.game.scene.sleep("bonusIntro");
                }
            }
            BonusIntro.State = State;
        })(BonusIntro = States.BonusIntro || (States.BonusIntro = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "gameplay",
                        physics: {},
                    });
                    Scene._instance = this;
                }
                static get instance() { return Scene._instance; }
                update(time, delta) {
                    if (!this.sys.isSleeping())
                        Gameplay.State.instance.update(delta);
                }
            }
            Gameplay.Scene = Scene;
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            class State extends States.State {
                constructor() {
                    super(2);
                    State._instance = this;
                    Game.game.scene.add("gameplay", Gameplay.Scene);
                    Gameplay.timer = new Helpers.GameTimer();
                    this._score = new Gameplay.Model.Score();
                    this._bonuses = new Gameplay.Model.Bonus.Manager();
                    this._manualBonuses = new Collections.NodeList();
                }
                static get instance() { return State._instance; }
                get score() { return this._score; }
                get xp() { return this._xp; }
                get view() { return this._view; }
                get player() { return this._player; }
                get obstacles() { return this._obstacles; }
                get objectsTrace() { return this._objectsTrace; }
                get bonuses() { return this._bonuses; }
                get manualBonuses() { return this._manualBonuses; }
                get debugLayer() { return this._debugLayer; }
                activate(prevState, data) {
                    if (!this._view)
                        Gameplay.Scene.instance.events.on(Phaser.Scenes.Events.CREATE, this.handleSceneCreate, this);
                    Game.game.scene.run("gameplay");
                    let revive = prevState == 3;
                    if (!revive) {
                        Gameplay.timer.start();
                        this._score.reset();
                        this._xp = 0;
                        this._extraLife = 1;
                        this._manualBonuses.clear();
                        if (Game.bonuses.getBonus(0).state == 2)
                            this._manualBonuses.add(this._bonuses.getBonus(0));
                        if (Game.bonuses.getBonus(3).state == 2)
                            this._manualBonuses.add(this._bonuses.getBonus(3));
                        this._gameAxis.reset();
                        this._view.reset();
                        this._bonuses.reset();
                        this._ui.reset();
                        this._path.reset();
                    }
                    else {
                        this._extraLife--;
                        Game.game.sound.play("mainTheme", { loop: true, rate: 1 });
                    }
                    this._player.reset(revive);
                    this._obstacles.reset(revive);
                    this._bonusObjects.reset(revive);
                    this._view.activate();
                }
                deactivate(newState) {
                    this._view.deactivate();
                    Game.game.sound.rate = 1;
                    Game.game.sound.stopAll();
                    Game.game.scene.sleep("gameplay");
                }
                update(delta) {
                    Gameplay.timer.update(delta);
                    if (Game.BingBong._DEBUG)
                        this._debugLayer.clear();
                    this._view.update();
                    this._bonuses.update();
                    this._player.update();
                    this._bonusObjects.update();
                    this._obstacles.update();
                    if (this._player.movement.mode == 1)
                        this._score.combo.decNextComboProgress((1 / 4) * Gameplay.timer.delta);
                    this._ui.update();
                    let plSpeedRatio = this._player.movement.speedRatio;
                    Game.SharedScenes.Background.layers.speedRatio = 0.25 + 0.75 * plSpeedRatio;
                    let sound = Game.game.sound;
                    if (this._player.state < 2) {
                        let soundRate = 0.75 + plSpeedRatio * 0.25;
                        if (soundRate != sound.rate)
                            sound.rate = soundRate;
                    }
                    else {
                        if (sound.rate > 0) {
                            let rate = sound.rate - 0.015 * Gameplay.timer.delta;
                            if (rate <= 0.1) {
                                sound.rate = 1;
                                sound.stopAll();
                            }
                            else {
                                sound.rate = rate;
                            }
                        }
                    }
                }
                handleSceneCreate(scene) {
                    this._view = new Gameplay.View();
                    if (Game.BingBong._DEBUG) {
                        this._debugLayer = scene.add.graphics()
                            .setDepth(100);
                        this._debugLayer.cameraFilter = ~Gameplay.cameras[3].id;
                    }
                    this._objectsTrace = scene.add.particles("atlas_0")
                        .setDepth(40);
                    this._objectsTrace.cameraFilter = ~Gameplay.cameras[2].id;
                    this._path = new Gameplay.Path.Path();
                    this._player = new Gameplay.Player.Player(this._path);
                    this._player.events.on(Gameplay.Player.Player.EVENT_CRASH, this.handlePlayerCrash, this);
                    this._player.events.on(Gameplay.Player.Player.EVENT_DEATH, this.handlePlayerDeath, this);
                    this._player.events.on(Gameplay.Player.Player.EVENT_END_POINT, this.handlePlayerEndPoint, this);
                    this._gameAxis = new Gameplay.GameAxis.Manager();
                    this._obstacles = new Gameplay.Objects.Obstacles.Manager();
                    this._bonusObjects = new Gameplay.Objects.Bonuses.Manager();
                    this._ui = new Gameplay.UI.Layer();
                }
                handlePlayerCrash() {
                    this._view.startShake();
                }
                handlePlayerDeath() {
                    Game.saveState.save();
                    if (this._extraLife != 0 && this._xp > 5 && (Gamee2.Gamee.adReady || !Gamee2.Gamee.initialized)) {
                        this._view.fadeOut(() => { States.states.setCurState(3); }, this);
                    }
                    else {
                        Game.BingBong.gameOver();
                    }
                }
                handlePlayerEndPoint() {
                    this._xp++;
                    Game.saveState.xp++;
                    this._score.incScore();
                    Game.SharedScenes.Background.layers.startFlashFx();
                    this._manualBonuses.forEach((bonus) => { bonus.incEnergy(); });
                }
            }
            State.DEBUG_COL_AREAS = false;
            State.WORLD_W = 720;
            Gameplay.State = State;
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            class View {
                constructor() {
                    let scene = Gameplay.Scene.instance;
                    let defCam = scene.cameras.main;
                    Gameplay.cameras = [
                        Game.SharedScenes.Background.layers.camera,
                        defCam,
                        scene.cameras.add(),
                        scene.cameras.add()
                    ];
                    this._rotAngle = 0;
                    this._line1 = new Phaser.Geom.Line();
                    this._line2 = new Phaser.Geom.Line(Game.scale.maxWidth / 2, Game.scale.maxHeight / 2);
                    this._intersectPos = new Phaser.Geom.Point();
                }
                get visibleWidth() { return this._visWidth; }
                get rotating() { return (this._flags & (1 | 2)) == 1; }
                get angle() { return this._rotAngle; }
                activate() {
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                    let cam = Gameplay.cameras[3];
                    cam.removeListener(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE);
                    cam.resetFX()
                        .fadeIn(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                }
                deactivate() {
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                reset() {
                    this._flags = 0;
                    this._rotAngle = 0;
                    Gameplay.cameras[0].setAngle(0);
                    Gameplay.cameras[2].setAngle(0);
                    this._visWidth = Gameplay.cameras[0].width;
                    this._visMinWidth = this._visWidth;
                    if (this._shakeTween && this._shakeTween.isPlaying()) {
                        this._shakeTween.stop();
                        Gameplay.cameras[0].x = Gameplay.cameras[2].x = 0;
                    }
                }
                update() {
                    if ((this._flags & 1) != 0)
                        this.updateRotation();
                }
                fadeOut(clbFnc, clbCtx) {
                    let cam = Gameplay.cameras[3];
                    cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, clbFnc, clbCtx);
                    cam.fadeOut(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                }
                startRotation(speed, maxAngle) {
                    this._flags &= ~2;
                    if ((this._flags & 1) == 0) {
                        this._flags |= 1;
                        this._rotDir = Phaser.Math.RND.pick([-1, 1]);
                    }
                    this._rotSpeed = speed;
                    this._rotMaxAngle = maxAngle;
                }
                stopRotation() {
                    if ((this._flags & 1) != 0)
                        this._flags |= 2;
                }
                startShake() {
                    Gameplay.cameras[0].x = Gameplay.cameras[2].x = -40;
                    if (!this._shakeTween) {
                        this._shakeTween = Gameplay.Scene.instance.tweens.add({
                            targets: [Gameplay.cameras[0], Gameplay.cameras[2]],
                            x: 0,
                            duration: 1200,
                            ease: Phaser.Math.Easing.Elastic.Out
                        });
                    }
                    else {
                        this._shakeTween.restart();
                    }
                }
                updateRotation() {
                    let step = this._rotSpeed / 60 * Gameplay.timer.delta;
                    let angle = this._rotAngle;
                    let stop = (this._flags & 2) != 0;
                    if (this._rotDir > 0) {
                        if ((angle += step) >= this._rotMaxAngle) {
                            angle = this._rotMaxAngle - (angle - this._rotMaxAngle);
                            this._rotDir = -1;
                        }
                        if (stop && this._rotAngle <= 0 && angle >= 0) {
                            angle = 0;
                            this._flags &= ~(2 | 1);
                        }
                    }
                    else {
                        if ((angle -= step) <= -this._rotMaxAngle) {
                            angle = -this._rotMaxAngle - (angle + this._rotMaxAngle);
                            this._rotDir = 1;
                        }
                        if (stop && this._rotAngle >= 0 && angle <= 0) {
                            angle = 0;
                            this._flags &= ~(2 | 1);
                        }
                    }
                    this._rotAngle = angle;
                    Gameplay.cameras[0].setAngle(angle);
                    Gameplay.cameras[2].setAngle(angle);
                    this.updateVisibleWidth();
                }
                updateVisibleWidth() {
                    let angle = Phaser.Math.DegToRad(this._rotAngle);
                    this._line1.x2 = this._line1.x1 + Math.cos(angle) * 1000;
                    this._line1.y2 = this._line1.y1 + Math.sin(angle) * 1000;
                    angle = Phaser.Math.DegToRad(this._rotAngle - 90);
                    this._line2.x2 = this._line2.x1 + Math.cos(angle) * 1000;
                    this._line2.y2 = this._line2.y1 + Math.sin(angle) * 1000;
                    Phaser.Geom.Intersects.LineToLine(this._line1, this._line2, this._intersectPos);
                    this._visWidth = Math.ceil(Phaser.Math.Distance.Between(this._line1.x1, this._line1.y1, this._intersectPos.x, this._intersectPos.y)) << 1;
                    if (this._visWidth < this._visMinWidth)
                        this._visWidth = this._visMinWidth + (this._visMinWidth - this._visWidth);
                    Game.SharedScenes.Background.layers.setCustomWidth(this._visWidth);
                }
                handleResChange(w, h) {
                    this._line1.x1 = (Game.scale.maxWidth - w) >> 1;
                    this._line1.y1 = 0;
                    this._visMinWidth = w;
                    this.updateVisibleWidth();
                    Gameplay.cameras.forEach((camera) => {
                        camera.setSize(w, h);
                        camera.setScroll((Game.scale.maxWidth - w) >> 1, 0);
                        camera.emit("cameraResize", camera);
                    });
                }
            }
            Gameplay.View = View;
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var GameAxis;
            (function (GameAxis) {
                class ItemBase {
                    constructor(pos) {
                        this._pos = pos;
                    }
                    get pos() { return this._pos; }
                }
                GameAxis.ItemBase = ItemBase;
                class ItemRotateView extends ItemBase {
                    constructor(pos, rotate) {
                        super(pos);
                        this._rotate = rotate;
                    }
                    apply() {
                        let view = Gameplay.State.instance.view;
                        if (this._rotate) {
                            view.startRotation(5, 30);
                        }
                        else {
                            view.stopRotation();
                        }
                    }
                }
                GameAxis.ItemRotateView = ItemRotateView;
                class ItemObsActInterval extends ItemBase {
                    constructor(pos, obsActIntervalDecStep, obsActIntervalChangeDelay) {
                        super(pos);
                        this._obsActIntervalDecStep = obsActIntervalDecStep;
                        this._obsActIntervalChangeDelay = obsActIntervalChangeDelay;
                    }
                    apply() {
                        let diff = Gameplay.State.instance.obstacles.difficulty;
                        diff.actIntervalDecStep = this._obsActIntervalDecStep;
                        if (this._obsActIntervalChangeDelay != undefined)
                            diff.actIntervalChangeDelay = this._obsActIntervalChangeDelay;
                    }
                }
                GameAxis.ItemObsActInterval = ItemObsActInterval;
                class ItemObsTypeCnt extends ItemBase {
                    constructor(pos, obsTypeCnt) {
                        super(pos);
                        this._obsTypeCnt = obsTypeCnt;
                    }
                    apply() {
                        Gameplay.State.instance.obstacles.difficulty.enabledTypeCnt = this._obsTypeCnt;
                    }
                }
                GameAxis.ItemObsTypeCnt = ItemObsTypeCnt;
            })(GameAxis = Gameplay.GameAxis || (Gameplay.GameAxis = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var GameAxis;
            (function (GameAxis) {
                class Manager {
                    constructor() {
                        this._axis = [
                            new GameAxis.ItemObsTypeCnt(15, 3),
                            new GameAxis.ItemRotateView(20, true),
                            new GameAxis.ItemObsActInterval(21, 0),
                            new GameAxis.ItemObsActInterval(30, 25),
                            new GameAxis.ItemRotateView(30, false),
                            new GameAxis.ItemRotateView(40, true),
                            new GameAxis.ItemRotateView(50, false),
                            new GameAxis.ItemRotateView(60, true),
                            new GameAxis.ItemRotateView(70, false),
                            new GameAxis.ItemRotateView(80, true),
                            new GameAxis.ItemRotateView(90, false),
                            new GameAxis.ItemRotateView(100, true),
                        ];
                        Gameplay.State.instance.player.events.on(Gameplay.Player.Player.EVENT_END_POINT, this.handlePlEndPoint, this);
                    }
                    reset() {
                        this._axisPos = 0;
                    }
                    handlePlEndPoint(player) {
                        while (this._axisPos < this._axis.length && this._axis[this._axisPos].pos == player.movement.endPointCnt) {
                            this._axis[this._axisPos++].apply();
                        }
                    }
                }
                GameAxis.Manager = Manager;
            })(GameAxis = Gameplay.GameAxis || (Gameplay.GameAxis = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Model;
            (function (Model) {
                var Bonus;
                (function (Bonus_2) {
                    class Bonus {
                        constructor(manager, type, duration, actSfx) {
                            this._manager = manager;
                            this._type = type;
                            this._duration = duration;
                            this._actSfx = actSfx;
                            this._active = false;
                        }
                        get manager() { return this._manager; }
                        get type() { return this._type; }
                        get duration() { return this._duration; }
                        get actTime() { return this._actTime; }
                        get active() { return this._active; }
                        get remActTime() {
                            return (this._actTime + this._duration) - Gameplay.timer.time;
                        }
                        get actSfx() { return this._actSfx; }
                        reset() {
                            this._active = false;
                        }
                        activate() {
                            Game.game.sound.playAudioSprite("sfx", this._actSfx);
                            this._actTime = Gameplay.timer.time;
                            let active = this._active;
                            if (this._duration > 0)
                                this._active = true;
                            this._manager.events.emit(Bonus.EVENT_ACTIVATED, this, active);
                            return true;
                        }
                        update() {
                            if (this._active && Gameplay.timer.time > this._actTime + this._duration) {
                                this._active = false;
                                this._manager.events.emit(Bonus.EVENT_DEACTIVATED, this);
                            }
                        }
                    }
                    Bonus.EVENT_ACTIVATED = "act";
                    Bonus.EVENT_DEACTIVATED = "deact";
                    Bonus_2.Bonus = Bonus;
                })(Bonus = Model.Bonus || (Model.Bonus = {}));
            })(Model = Gameplay.Model || (Gameplay.Model = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Model;
            (function (Model) {
                var Bonus;
                (function (Bonus) {
                    class Manager {
                        constructor() {
                            this._bonuses = [
                                new Bonus.ManualBonus(this, 0, 2000, 5, "shield"),
                                new Bonus.Bonus(this, 1, 10000, "bonus"),
                                new Bonus.Bonus(this, 2, 5000, "freeze"),
                                new Bonus.ManualBonus(this, 3, 0, 5, "bomb"),
                                new Bonus.Bonus(this, 4, 10000, "bonus"),
                            ];
                            this._actBonuses = new Collections.NodeList();
                            this._events = new Phaser.Events.EventEmitter();
                            this._events.on(Bonus.Bonus.EVENT_ACTIVATED, (bonus, prevState) => {
                                if (bonus.active && !prevState) {
                                    this._actBonusMask |= (1 << bonus.type);
                                    this._actBonuses.add(bonus);
                                }
                            }, this);
                        }
                        get actBonuses() { return this._actBonuses; }
                        get events() { return this._events; }
                        reset() {
                            this._bonuses.forEach((bonus) => { bonus.reset(); });
                            this._actBonuses.clear();
                            this._actBonusMask = 0;
                        }
                        update() {
                            this._actBonuses.forEach((bonus, node) => {
                                bonus.update();
                                if (!bonus.active) {
                                    this._actBonuses.removeByNode(node);
                                    this._actBonusMask &= ~(1 << bonus.type);
                                }
                            }, this);
                        }
                        getBonus(type) {
                            return this._bonuses.find((bonus) => { return bonus.type == type; });
                        }
                        isBonusActive(type) {
                            return (this._actBonusMask & (1 << type)) != 0;
                        }
                    }
                    Bonus.Manager = Manager;
                })(Bonus = Model.Bonus || (Model.Bonus = {}));
            })(Model = Gameplay.Model || (Gameplay.Model = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Model;
            (function (Model) {
                var Bonus;
                (function (Bonus) {
                    class ManualBonus extends Bonus.Bonus {
                        constructor(manager, type, duration, maxEnergy, actSfx) {
                            super(manager, type, duration, actSfx);
                            this._defMaxEnergy = maxEnergy;
                            this._maxEnergy = maxEnergy;
                            this._energy = maxEnergy;
                        }
                        get energy() { return this._energy / this._maxEnergy; }
                        reset() {
                            super.reset();
                            this._energy = this._maxEnergy = this._defMaxEnergy;
                        }
                        activate() {
                            if (this._active)
                                return true;
                            if (this._energy != this._maxEnergy)
                                return false;
                            Game.game.sound.playAudioSprite("sfx", this._actSfx);
                            this._actTime = Gameplay.timer.time;
                            this._energy = 0;
                            this._maxEnergy += this._defMaxEnergy;
                            if (this._duration > 0)
                                this._active = true;
                            this._manager.events.emit(Bonus.Bonus.EVENT_ACTIVATED, this);
                            return true;
                        }
                        incEnergy() {
                            if (this._energy < this._maxEnergy) {
                                this._energy++;
                                this._manager.events.emit(ManualBonus.EVENT_INC_ENERGY + this._type, this);
                            }
                        }
                    }
                    ManualBonus.EVENT_INC_ENERGY = "incEnergy";
                    Bonus.ManualBonus = ManualBonus;
                })(Bonus = Model.Bonus || (Model.Bonus = {}));
            })(Model = Gameplay.Model || (Gameplay.Model = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Model;
            (function (Model) {
                class Combo {
                    get value() { return this._value; }
                    get nextValueProgress() { return this._nextValueProgress; }
                    reset() {
                        this._value = 1;
                        this._nextValueProgress = 0;
                    }
                    incNextComboProgress(val) {
                        if (this._value < Combo.MAX_COMBO && (this._nextValueProgress += val) >= 100) {
                            if (++this._value == Combo.MAX_COMBO) {
                                this._nextValueProgress = 100;
                            }
                            else {
                                this._nextValueProgress -= 100;
                            }
                            Gameplay.Scene.instance.events.emit(Combo.EVENT_COMBO_CHANGE, this._value, this._nextValueProgress, this);
                        }
                    }
                    decNextComboProgress(val) {
                        if ((this._nextValueProgress -= val) < 0) {
                            if (this._value == 1) {
                                this._nextValueProgress = 0;
                            }
                            else {
                                this._value--;
                                this._nextValueProgress += 100;
                                Gameplay.Scene.instance.events.emit(Combo.EVENT_COMBO_CHANGE, this._value, this._nextValueProgress, this);
                            }
                        }
                    }
                }
                Combo.EVENT_COMBO_CHANGE = "comboChange";
                Combo.MAX_COMBO = 5;
                Model.Combo = Combo;
            })(Model = Gameplay.Model || (Gameplay.Model = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Model;
            (function (Model) {
                class Score {
                    constructor() {
                        this._combo = new Model.Combo();
                        this._score = 0;
                    }
                    get score() { return this._score; }
                    get combo() { return this._combo; }
                    reset() {
                        this._score = 0;
                        this._combo.reset();
                    }
                    incScore() {
                        let val = 1 * this._combo.value;
                        if (Gameplay.State.instance.bonuses.isBonusActive(4))
                            val *= 2;
                        this._score += val;
                        this._combo.incNextComboProgress(15);
                        Gameplay.Scene.instance.events.emit(Score.EVENT_SCORE_INC, this._score);
                        if (Gamee2.Gamee.initialized)
                            Gamee2.Gamee.score = this._score;
                    }
                }
                Score.EVENT_SCORE_INC = "scoreInc";
                Model.Score = Score;
            })(Model = Gameplay.Model || (Gameplay.Model = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Objects;
            (function (Objects) {
                var Bonuses;
                (function (Bonuses) {
                    class Bonus {
                        constructor() {
                            if (!Bonus._stateProcessFnc) {
                                Bonus._stateProcessFnc = [
                                    this.processMoving,
                                    this.processPickup
                                ];
                            }
                            this._sprite = Gameplay.Scene.instance.add.image(0, 0, "atlas_0")
                                .setDepth(60)
                                .setVisible(false);
                            this._sprite.cameraFilter = ~Gameplay.cameras[2].id;
                            this._particles = Gameplay.State.instance.objectsTrace.createEmitter({
                                frame: "gameplay objects/bonuses/trace",
                                lifespan: 750,
                                follow: this._sprite,
                                frequency: 100,
                                gravityY: 800,
                                alpha: { start: 0.5, end: 0, ease: "Cubic.Out" },
                                scale: { start: 0.9, end: 0.1, ease: "Cubic.Out" }
                            });
                            this._particles.stop();
                        }
                        get type() { return this._type; }
                        get state() { return this._state; }
                        get x() { return this._sprite.x; }
                        get y() { return this._sprite.y; }
                        reset() {
                            this._sprite.visible = false;
                            this._particles.stop();
                            return this;
                        }
                        activate(type, y, dir) {
                            this._type = type;
                            this._dir = dir;
                            this._state = 0;
                            this._sprite
                                .setFrame("gameplay objects/bonuses/" + Game.bonuses.getBonus(type).shortName)
                                .setPosition((dir > 0 ? -this._sprite.width / 2 : Gameplay.State.WORLD_W + this._sprite.width / 2), Gameplay.Path.Path.Y + y)
                                .setAlpha(0)
                                .setScale(1)
                                .setVisible(true);
                            this._particles.start();
                            return this;
                        }
                        update() {
                            return Bonus._stateProcessFnc[this._state].call(this);
                        }
                        processMoving() {
                            let step = Bonus.SPEED / 60 * Gameplay.timer.delta;
                            let hw = this._sprite.width / 2;
                            let progress;
                            if (this._dir > 0) {
                                if ((this._sprite.x += step) - hw >= Gameplay.State.WORLD_W) {
                                    this.reset();
                                    return false;
                                }
                                progress = (this._sprite.x - -hw) / (Gameplay.State.WORLD_W + hw * 2);
                            }
                            else {
                                if ((this._sprite.x -= step) + hw <= 0) {
                                    this.reset();
                                    return false;
                                }
                                progress = Gameplay.State.WORLD_W + hw;
                                progress = (progress - this._sprite.x) / (progress + hw);
                            }
                            let alpha = 1;
                            if (progress < 0.2) {
                                alpha = Phaser.Math.Easing.Cubic.Out(progress / 0.2);
                            }
                            else if (progress > 0.8) {
                                alpha = 1 - Phaser.Math.Easing.Cubic.In((progress - 0.8) / 0.2);
                            }
                            this._sprite.alpha = alpha;
                            return true;
                        }
                        processPickup() {
                            let progress = (Gameplay.timer.time - this._time) / 1000;
                            if (progress >= 1) {
                                this.reset();
                                return false;
                            }
                            progress = Phaser.Math.Easing.Cubic.Out(progress);
                            this._sprite
                                .setScale(1 + 1 * progress)
                                .setAlpha(1 - progress);
                            return true;
                        }
                        handleCollision() {
                            Gameplay.State.instance.bonuses.getBonus(this._type).activate();
                            this._particles.stop();
                            this._time = Gameplay.timer.time;
                            this._state = 1;
                        }
                    }
                    Bonus.COLLISION_RADIUS = 33;
                    Bonus.SPEED = 90;
                    Bonuses.Bonus = Bonus;
                })(Bonuses = Objects.Bonuses || (Objects.Bonuses = {}));
            })(Objects = Gameplay.Objects || (Gameplay.Objects = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Objects;
            (function (Objects) {
                var Bonuses;
                (function (Bonuses) {
                    class Manager {
                        constructor() {
                            this._freeBonuses = new Collections.Pool(Bonuses.Bonus, 0, true);
                            this._actBonuses = new Collections.NodeList();
                            this._validBonuses = [];
                            this._freePickupNames = new Collections.Pool(Bonuses.PickupName, 1, true);
                            this._actPickupNames = new Collections.NodeList();
                            Gameplay.State.instance.bonuses.events.on(Gameplay.Model.Bonus.Bonus.EVENT_ACTIVATED, this.handleBonusActivation, this);
                        }
                        reset(revive) {
                            this._actBonuses.forEach((bonus) => {
                                this._freeBonuses.returnItem(bonus.reset());
                            }, this);
                            this._actBonuses.clear();
                            this._actPickupNames.forEach((name) => {
                                name.kill();
                                this._freePickupNames.returnItem(name);
                            }, this);
                            this._actPickupNames.clear();
                            if (!revive) {
                                let bnsTypes = [
                                    2,
                                    4,
                                    1,
                                ];
                                this._validBonuses.length = 0;
                                bnsTypes.forEach((type) => {
                                    let bonus = Game.bonuses.getBonus(type);
                                    if (bonus.state == 2)
                                        this._validBonuses.push(bonus);
                                }, this);
                                if (this._validBonuses.length != 0) {
                                    this.prepareNextBonus();
                                    this._nextBonusTime *= 0.7;
                                }
                            }
                        }
                        update() {
                            if (!this._actBonuses.empty) {
                                let pl = Gameplay.State.instance.player;
                                let checkCollision = pl.state == 1;
                                let plX = pl.x;
                                let plY = pl.y;
                                this._actBonuses.forEach((bonus, node) => {
                                    if (!bonus.update()) {
                                        this._freeBonuses.returnItem(this._actBonuses.removeByNode(node));
                                    }
                                    else if (checkCollision && bonus.state == 0 && Phaser.Math.Distance.Between(plX, plY, bonus.x, bonus.y) <= Gameplay.Player.Player.COLLISION_RADIUS + Bonuses.Bonus.COLLISION_RADIUS) {
                                        bonus.handleCollision();
                                    }
                                }, this);
                            }
                            this._actPickupNames.forEach((item, node) => {
                                if (!item.update())
                                    this._freePickupNames.returnItem(this._actPickupNames.removeByNode(node));
                            }, this);
                            if (Gameplay.timer.time >= this._nextBonusTime) {
                                let bonus = this._freeBonuses.getItem();
                                bonus.activate(this._nextBonus.type, Phaser.Math.RND.integerInRange(Manager.PATH_MARGIN, Gameplay.Path.Path.LEN - Manager.PATH_MARGIN), Phaser.Math.RND.integerInRange(0, 1) == 0 ? 1 : -1);
                                this._actBonuses.add(bonus);
                                this.prepareNextBonus();
                            }
                        }
                        prepareNextBonus() {
                            let i = Phaser.Math.RND.integerInRange(0, this._validBonuses.length - 1);
                            if (this._validBonuses.length > 1 && !this._actBonuses.empty && this._validBonuses[i].type == this._actBonuses.last.type) {
                                if (++i == this._validBonuses.length)
                                    i = 0;
                            }
                            this._nextBonus = this._validBonuses[i];
                            this._nextBonusTime = Gameplay.timer.time + Manager.BONUS_INTERVAL;
                        }
                        handleBonusActivation(bonus) {
                            this._actBonuses.every((bnsObj) => {
                                if (bonus.type == bnsObj.type) {
                                    let name = this._freePickupNames.getItem();
                                    name.show(Game.bonuses.getBonus(bonus.type).shortName.toUpperCase(), bnsObj.x, bnsObj.y);
                                    this._actPickupNames.add(name);
                                    return false;
                                }
                                return true;
                            }, this);
                        }
                    }
                    Manager.PATH_MARGIN = 120;
                    Manager.BONUS_INTERVAL = 15000;
                    Bonuses.Manager = Manager;
                })(Bonuses = Objects.Bonuses || (Objects.Bonuses = {}));
            })(Objects = Gameplay.Objects || (Gameplay.Objects = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Objects;
            (function (Objects) {
                var Bonuses;
                (function (Bonuses) {
                    class PickupName extends PopupMessage.MessageBase {
                        constructor() {
                            if (!PickupName.TYPE)
                                PickupName.TYPE = new PopupMessage.MessageType(175, 750, Phaser.Math.Easing.Cubic.Out, 0, 750, Phaser.Math.Easing.Cubic.In);
                            super();
                            this._container = Gameplay.Scene.instance.add.bitmapText(0, 0, "fntText66", "", 66)
                                .setDepth(60)
                                .setOrigin(0.5)
                                .setTint(0xffb903)
                                .setVisible(false);
                            this._container.cameraFilter = ~Gameplay.cameras[2].id;
                        }
                        getContainer() { return this._container; }
                        show(text, x, y) {
                            this._moveAngleDeg = Phaser.Math.RND.realInRange(-110, -70);
                            this._moveAngle = Phaser.Math.DegToRad(this._moveAngleDeg);
                            this._container
                                .setText(text)
                                .setAngle(0)
                                .setVisible(true);
                            this.showMessage(x, y, PickupName.TYPE, Gameplay.timer);
                        }
                        kill() {
                            super.kill();
                            this._container.visible = false;
                        }
                        update() {
                            if (!super.update())
                                return false;
                            let progress = (this._timer.time - this._startTime) / PickupName.TYPE.moveTime;
                            this._container.angle = progress * ((this._moveAngleDeg - -90) * 3);
                            return true;
                        }
                    }
                    Bonuses.PickupName = PickupName;
                })(Bonuses = Objects.Bonuses || (Objects.Bonuses = {}));
            })(Objects = Gameplay.Objects || (Gameplay.Objects = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Objects;
            (function (Objects) {
                var Obstacles;
                (function (Obstacles) {
                    class Obstacle {
                        constructor(manager) {
                            this._manager = manager;
                            this._sprite = Gameplay.Scene.instance.add.image(0, 0, "atlas_0")
                                .setDepth(50)
                                .setVisible(false);
                            this._sprite.cameraFilter = ~Gameplay.cameras[2].id;
                            this._iceSprite = Gameplay.Scene.instance.add.image(0, 0, "atlas_0")
                                .setDepth(51)
                                .setVisible(false);
                            this._iceSprite.cameraFilter = ~Gameplay.cameras[2].id;
                            this._particles = Gameplay.State.instance.objectsTrace.createEmitter({
                                lifespan: 750,
                                follow: this._sprite,
                                frequency: 100,
                                gravityY: 800,
                                alpha: { start: 0.5, end: 0, ease: "Cubic.Out" },
                                scale: { start: 0.9, end: 0.1, ease: "Cubic.Out" }
                            });
                            this._particles.stop();
                        }
                        get type() { return this._type; }
                        get x() { return this._sprite.x; }
                        get y() { return this._sprite.y; }
                        get deadly() { return this._destroyTime <= 0; }
                        reset() {
                            this._sprite.visible = false;
                            this._iceSprite.visible = false;
                            this._particles.stop();
                            return this;
                        }
                        activate(type, y, dir, timeOffset) {
                            this._type = type;
                            this._dir = dir;
                            this._destroyTime = 0;
                            let path = "gameplay objects/obstacles/";
                            this._sprite
                                .setFrame(Game.themes.curTheme.assetsPath + "obstacles/" + type.assetId)
                                .setPosition((dir > 0 ? -this._sprite.width / 2 : Gameplay.State.WORLD_W + this._sprite.width / 2) + (((timeOffset / 1000) * type.speed) * dir), Gameplay.Path.Path.Y + y + this._sprite.height / 2)
                                .setAlpha(0)
                                .setScale(1)
                                .setVisible(true);
                            this._iceSprite
                                .setFrame(path + "ice_" + type.assetId)
                                .setY(this._sprite.y)
                                .setAlpha(1)
                                .setScale(1);
                            this._iceSprite.displayOriginY = (this._iceSprite.height / 2) - 16;
                            this._particles
                                .setFrame(path + "trace_" + type.assetId)
                                .start();
                            return this;
                        }
                        update() {
                            if (this._destroyTime == 0)
                                return this.updateNormalMode();
                            return this.updateDestroyMode();
                        }
                        updateNormalMode() {
                            let speedRatio = this._manager.moveSpeedRatio;
                            let step = this._type.speed * speedRatio / 60 * Gameplay.timer.delta;
                            let hw = this._sprite.width / 2;
                            let progress;
                            if (this._dir > 0) {
                                if ((this._sprite.x += step) >= Gameplay.State.WORLD_W + hw) {
                                    this.reset();
                                    return false;
                                }
                                progress = (this._sprite.x - -hw) / (Gameplay.State.WORLD_W + hw * 2);
                            }
                            else {
                                if ((this._sprite.x -= step) + hw <= 0) {
                                    this.reset();
                                    return false;
                                }
                                progress = Gameplay.State.WORLD_W + hw;
                                progress = (progress - this._sprite.x) / (progress + hw);
                            }
                            let alpha = 1;
                            if (progress < 0.2) {
                                alpha = Phaser.Math.Easing.Cubic.Out(progress / 0.2);
                            }
                            else if (progress > 0.8) {
                                alpha = 1 - Phaser.Math.Easing.Cubic.In((progress - 0.8) / 0.2);
                            }
                            this._sprite.alpha = alpha;
                            this._iceSprite.x = this._sprite.x;
                            if (this._manager.mode == 2) {
                                let i = Gameplay.timer.time - this._manager.time;
                                this._iceSprite.visible = (Math.floor(i / (250 - (150 * (i / Obstacles.Manager.RESUME_LEN)))) & 1) != 0;
                            }
                            return true;
                        }
                        updateDestroyMode() {
                            let progress = (Gameplay.timer.time - this._destroyTime) / 1000;
                            if (progress >= 1) {
                                this.reset();
                                return false;
                            }
                            progress = Phaser.Math.Easing.Cubic.Out(progress);
                            this._sprite
                                .setScale(1 + progress)
                                .setAlpha(this._destroyAlpha - progress * this._destroyAlpha);
                            if (this._iceSprite.visible) {
                                this._iceSprite.setScale(this._sprite.scaleX)
                                    .setAlpha(1 - progress);
                            }
                            return true;
                        }
                        pause() {
                            this._iceSprite
                                .setPosition(this._sprite.x, this._sprite.y)
                                .setVisible(true);
                        }
                        resume() {
                            this._iceSprite.visible = false;
                        }
                        destroy(emitter) {
                            if (this._destroyTime == 0) {
                                this._destroyTime = Gameplay.timer.time;
                                this._destroyAlpha = this._sprite.alpha;
                                this._particles.stop();
                                let x = this._sprite.x;
                                let y = this._sprite.y;
                                emitter.setFrame("gameplay objects/obstacles/desPart_" + this._type.assetId);
                                emitter.emitZone.source = new Phaser.Geom.Rectangle(-this._sprite.width / 2, -this._sprite.height / 2, this._sprite.width, this._sprite.height);
                                emitter.explode(10, x, y);
                            }
                        }
                    }
                    Obstacles.Obstacle = Obstacle;
                })(Obstacles = Objects.Obstacles || (Objects.Obstacles = {}));
            })(Objects = Gameplay.Objects || (Gameplay.Objects = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Objects;
            (function (Objects) {
                var Obstacles;
                (function (Obstacles) {
                    class Manager {
                        constructor() {
                            if (!Manager._obstacleTypes) {
                                Manager._obstacleTypes = [
                                    new Obstacles.Type(0, 240, new Helpers.CollisionArea(0, new Phaser.Geom.Rectangle(-33, -33, 66, 66))),
                                    new Obstacles.Type(1, 300, new Helpers.CollisionArea(0, new Phaser.Geom.Rectangle(-33, -67, 66, 134))),
                                    new Obstacles.Type(2, 300, new Helpers.CollisionArea(0, new Phaser.Geom.Rectangle(-67, -33, 134, 66))),
                                ];
                            }
                            this._freeObstacles = new Collections.Pool(undefined, 3, true, () => {
                                return new Obstacles.Obstacle(this);
                            }, this);
                            this._actObstacles = new Collections.NodeList();
                            this._tmpColAreas = [];
                            for (let i = 0; i < 3; i++)
                                this._tmpColAreas.push(new Helpers.CollisionArea(i));
                            this._nextEnemyProps = new NextEnemyProps();
                            this._freeNewEnemyMarks = new Collections.Pool(Obstacles.NewObstacleMark, 1, true);
                            this._actNewEnemyMarks = new Collections.NodeList();
                            this._difficulty = new Obstacles.Difficulty();
                            this._desPartEmitter = Gameplay.State.instance.objectsTrace.createEmitter({
                                lifespan: 1000,
                                gravityY: 800,
                                alpha: { start: 0.5, end: 0, ease: "Cubic.In" },
                                speed: { min: 400, max: 600 },
                                angle: { min: 135, max: 405 },
                                rotate: { min: 0, max: 360 },
                                emitZone: { source: null, type: "random" },
                                on: false
                            });
                            Gameplay.State.instance.player.events.on(Gameplay.Player.Player.EVENT_END_POINT, this.handlePlEndPoint, this);
                            let events = Gameplay.State.instance.bonuses.events;
                            events.on(Gameplay.Model.Bonus.Bonus.EVENT_ACTIVATED, this.handleBonusActivation, this);
                            events.on(Gameplay.Model.Bonus.Bonus.EVENT_DEACTIVATED, this.handleBonusDeactivation, this);
                        }
                        get difficulty() { return this._difficulty; }
                        get moveSpeedRatio() { return this._moveSpeedRatio; }
                        get mode() { return this._mode; }
                        get time() { return this._time; }
                        reset(revive) {
                            this._moveSpeedRatio = 1;
                            this._mode = 0;
                            this._actObstacles.forEach((enemy) => {
                                this._freeObstacles.returnItem(enemy.reset());
                            }, this);
                            this._actObstacles.clear();
                            this._actNewEnemyMarks.forEach((mark) => {
                                this._freeNewEnemyMarks.returnItem(mark.reset());
                            }, this);
                            this._actNewEnemyMarks.clear();
                            this._desPartEmitter.killAll();
                            if (!revive) {
                                this._difficulty.reset();
                                this._obsActInterval = Obstacles.Difficulty.START_ACT_INTERVAL;
                                this._obsActIntervalChangeDelay = this._difficulty.actIntervalChangeDelay;
                            }
                            this.prepareNextObstacle();
                        }
                        update() {
                            if (this._mode == 0) {
                                if (Gameplay.timer.time >= this._nextEnemyProps.time) {
                                    this._actObstacles.add(this._freeObstacles.getItem().activate(this._nextEnemyProps.type, this._nextEnemyProps.pathPos, this._nextEnemyProps.dir, Gameplay.timer.time - this._nextEnemyProps.time));
                                    this.prepareNextObstacle();
                                }
                                this._actNewEnemyMarks.forEach((mark, node) => {
                                    if (!mark.update())
                                        this._freeNewEnemyMarks.returnItem(this._actNewEnemyMarks.removeByNode(node));
                                }, this);
                            }
                            else if (this._mode == 2) {
                                let i = Gameplay.timer.time - this._time;
                                if (i >= Manager.RESUME_START_MOVE_DELAY) {
                                    if ((this._moveSpeedRatio = (i - Manager.RESUME_START_MOVE_DELAY) / (Manager.RESUME_LEN - Manager.RESUME_START_MOVE_DELAY)) >= 1) {
                                        this._moveSpeedRatio = 1;
                                        this._actObstacles.forEach((obstacle) => { obstacle.resume(); });
                                        this._mode = 0;
                                        let pauseLen = Gameplay.timer.time - this._pauseTime;
                                        this._nextEnemyProps.delay += pauseLen;
                                        this._actNewEnemyMarks.forEach((mark) => { mark.correctTime(pauseLen); });
                                    }
                                }
                            }
                            let pl = Gameplay.State.instance.player;
                            let plColArea = pl.colArea;
                            this._actObstacles.forEach((obstacle, node) => {
                                if (obstacle.update()) {
                                    if (obstacle.deadly && this._mode == 0 && pl.state == 1) {
                                        let enemyStaticColArea = obstacle.type.collisionArea;
                                        let enemyColArea = this._tmpColAreas[enemyStaticColArea.type];
                                        enemyColArea.setTo(enemyStaticColArea, obstacle.x, obstacle.y);
                                        if (Gameplay.State.DEBUG_COL_AREAS) {
                                            let shape = enemyColArea.shape;
                                            Gameplay.State.instance.debugLayer.lineStyle(1, 0xFF0000, 1)
                                                .strokeRect(shape.left, shape.top, shape.right - shape.left, shape.bottom - shape.top);
                                        }
                                        if (enemyColArea.checkCollision(plColArea)) {
                                            pl.handleObstacleCollision();
                                        }
                                    }
                                }
                                else {
                                    this._freeObstacles.returnItem(this._actObstacles.removeByNode(node));
                                }
                            }, this);
                        }
                        handlePlEndPoint() {
                            if (--this._obsActIntervalChangeDelay == 0) {
                                this._obsActIntervalChangeDelay = this._difficulty.actIntervalChangeDelay;
                                if (this._obsActInterval > Obstacles.Difficulty.MIN_ACT_INTERVAL)
                                    this._obsActInterval -= this._difficulty.actIntervalDecStep;
                            }
                        }
                        handleBonusActivation(bonus) {
                            switch (bonus.type) {
                                case 2: {
                                    if (this._mode != 1) {
                                        if (this._mode == 0)
                                            this._pauseTime = Gameplay.timer.time;
                                        this._mode = 1;
                                        this._moveSpeedRatio = 0;
                                        this._actObstacles.forEach((obstacle) => { obstacle.pause(); });
                                    }
                                    break;
                                }
                                case 3: {
                                    Gameplay.State.instance.view.startShake();
                                    this._actObstacles.forEach((obstacle) => { obstacle.destroy(this._desPartEmitter); }, this);
                                    break;
                                }
                            }
                        }
                        handleBonusDeactivation(bonus) {
                            if (bonus.type == 2 && this._mode == 1) {
                                this._time = Gameplay.timer.time;
                                this._mode = 2;
                            }
                        }
                        prepareNextObstacle() {
                            this._nextEnemyProps.init(this._obsActInterval, Manager._obstacleTypes[Phaser.Math.RND.integerInRange(0, this._difficulty.enabledTypeCnt - 1)], Phaser.Math.RND.integerInRange(0, 1) == 0 ? -1 : 1);
                            if (Phaser.Math.RND.integerInRange(0, 1) == 0) {
                                this.xxx1();
                            }
                            else {
                                this.xxx2();
                            }
                            this._actNewEnemyMarks.add(this._freeNewEnemyMarks.getItem().activate(this._nextEnemyProps, 1000));
                        }
                        xxx1() {
                            let pl = Gameplay.State.instance.player;
                            let plPathPos = pl.movement.getPathPosInTime(this._nextEnemyProps.delay + this._nextEnemyProps.timeToCol + this._nextEnemyProps.colLen, true);
                            let pathPos = plPathPos.pos;
                            let enemyH = this._nextEnemyProps.type.collisionArea.height;
                            if (plPathPos.dir < 0) {
                                let minPos = Manager.PATH_MARGIN + enemyH;
                                if (plPathPos.pos < minPos) {
                                    this._nextEnemyProps.delay -= pl.movement.getDistanceTime(minPos - plPathPos.pos, true);
                                    pathPos = Manager.PATH_MARGIN;
                                }
                                else {
                                    pathPos -= enemyH;
                                }
                            }
                            else {
                                let maxPos = Gameplay.Path.Path.LEN - Manager.PATH_MARGIN - this._nextEnemyProps.type.collisionArea.height;
                                if (plPathPos.pos > maxPos) {
                                    this._nextEnemyProps.delay -= pl.movement.getDistanceTime(plPathPos.pos - maxPos, true);
                                    pathPos = maxPos;
                                }
                            }
                            this._nextEnemyProps.pathPos = pathPos;
                        }
                        xxx2() {
                            let pl = Gameplay.State.instance.player;
                            let plPathPos = pl.movement.getPathPosInTime(this._nextEnemyProps.delay + this._nextEnemyProps.timeToCol, true);
                            let pathPos = plPathPos.pos;
                            let enemyH = this._nextEnemyProps.type.collisionArea.height;
                            if (plPathPos.dir < 0) {
                                let minPos = Manager.PATH_MARGIN + enemyH;
                                if (plPathPos.pos < minPos) {
                                    this._nextEnemyProps.delay -= pl.movement.getDistanceTime(minPos - plPathPos.pos, true);
                                    pathPos = Manager.PATH_MARGIN;
                                }
                                else {
                                    pathPos -= enemyH;
                                }
                            }
                            else {
                                let maxPos = Gameplay.Path.Path.LEN - Manager.PATH_MARGIN - this._nextEnemyProps.type.collisionArea.height;
                                if (plPathPos.pos > maxPos) {
                                    this._nextEnemyProps.delay -= pl.movement.getDistanceTime(plPathPos.pos - maxPos, true);
                                    pathPos = maxPos;
                                }
                            }
                            this._nextEnemyProps.delay -= Phaser.Math.RND.realInRange(0, this._nextEnemyProps.colLen / 2);
                            this._nextEnemyProps.pathPos = pathPos;
                        }
                    }
                    Manager.PATH_MARGIN = 100;
                    Manager.RESUME_LEN = 1500;
                    Manager.RESUME_START_MOVE_DELAY = 1000;
                    Obstacles.Manager = Manager;
                    class NextEnemyProps {
                        get time() { return this._initTime + this.delay; }
                        get type() { return this._type; }
                        get dir() { return this._dir; }
                        get timeToCol() { return this._timeToCol; }
                        get colLen() { return this._colLen; }
                        init(delay, type, dir) {
                            let pl = Gameplay.State.instance.player;
                            let plRadius = pl.colArea.width / 2;
                            this._initTime = Gameplay.timer.time;
                            this.delay = delay;
                            this._type = type;
                            this._dir = dir;
                            this._timeToCol = ((Gameplay.Path.Path.X - plRadius) / type.speed) * 1000;
                            this._colLen = ((type.collisionArea.width + plRadius * 2) / type.speed) * 1000;
                        }
                    }
                    Obstacles.NextEnemyProps = NextEnemyProps;
                })(Obstacles = Objects.Obstacles || (Objects.Obstacles = {}));
            })(Objects = Gameplay.Objects || (Gameplay.Objects = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Objects;
            (function (Objects) {
                var Obstacles;
                (function (Obstacles) {
                    class NewObstacleMark {
                        constructor() {
                            this._sprite = Gameplay.Scene.instance.add.image(0, 0, "atlas_0")
                                .setOrigin(0, 0.5)
                                .setDepth(20)
                                .setVisible(false);
                            this._sprite.cameraFilter = ~Gameplay.cameras[2].id;
                        }
                        get visible() { return this._sprite.visible; }
                        reset() {
                            this._sprite.visible = false;
                            return this;
                        }
                        activate(obstacleProps, timeOffset = 1000) {
                            this._obstacleDir = obstacleProps.dir;
                            this._obstacleActTime = obstacleProps.time;
                            this._time = obstacleProps.time - timeOffset;
                            if (this._time < Gameplay.timer.time)
                                this._time = Gameplay.timer.time;
                            this._sprite.setFrame("gameplay objects/obstacles/mark_" + obstacleProps.type.assetId)
                                .setY(Gameplay.Path.Path.Y + obstacleProps.pathPos + obstacleProps.type.collisionArea.height / 2)
                                .setFlipX(obstacleProps.dir < 0)
                                .setAlpha(0);
                            this._state = 0;
                            return this;
                        }
                        correctTime(pauseLen) {
                            this._time += pauseLen;
                            this._obstacleActTime += pauseLen;
                        }
                        update() {
                            let time = Gameplay.timer.time - this._time;
                            switch (this._state) {
                                case 0: {
                                    if (time < 0)
                                        break;
                                    this._sprite.setVisible(true);
                                    this._state++;
                                }
                                case 1: {
                                    let progress = time / 1000;
                                    if (progress >= 1) {
                                        progress = 1;
                                        this._state++;
                                    }
                                    progress = Phaser.Math.Easing.Cubic.In(progress);
                                    this._sprite.alpha = progress;
                                    this._sprite.x = (this._obstacleDir > 0 ? -this._sprite.width + (progress * this._sprite.width) : Gameplay.State.WORLD_W - (progress * this._sprite.width));
                                    break;
                                }
                                case 2: {
                                    if (Gameplay.timer.time >= this._obstacleActTime) {
                                        this._time = Gameplay.timer.time;
                                        this._state++;
                                    }
                                    break;
                                }
                                case 3: {
                                    let progress = (Gameplay.timer.time - this._time) / 1000;
                                    if (progress >= 1) {
                                        this.reset();
                                        return false;
                                    }
                                    progress = Phaser.Math.Easing.Cubic.In(progress);
                                    this._sprite.alpha = 1 - progress;
                                    break;
                                }
                            }
                            return true;
                        }
                    }
                    Obstacles.NewObstacleMark = NewObstacleMark;
                })(Obstacles = Objects.Obstacles || (Objects.Obstacles = {}));
            })(Objects = Gameplay.Objects || (Gameplay.Objects = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Objects;
            (function (Objects) {
                var Obstacles;
                (function (Obstacles) {
                    class Type {
                        constructor(assetId, speed, collisionArea) {
                            this._assetId = assetId;
                            this._speed = speed;
                            this._collisionArea = collisionArea;
                        }
                        get assetId() { return this._assetId; }
                        get speed() { return this._speed; }
                        get collisionArea() { return this._collisionArea; }
                    }
                    Obstacles.Type = Type;
                })(Obstacles = Objects.Obstacles || (Objects.Obstacles = {}));
            })(Objects = Gameplay.Objects || (Gameplay.Objects = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Objects;
            (function (Objects) {
                var Obstacles;
                (function (Obstacles) {
                    class Difficulty {
                        reset() {
                            this.actIntervalDecStep = 75;
                            this.actIntervalChangeDelay = 5;
                            this.enabledTypeCnt = 2;
                        }
                    }
                    Difficulty.START_ACT_INTERVAL = 1800;
                    Difficulty.MIN_ACT_INTERVAL = 1250;
                    Obstacles.Difficulty = Difficulty;
                })(Obstacles = Objects.Obstacles || (Objects.Obstacles = {}));
            })(Objects = Gameplay.Objects || (Gameplay.Objects = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Path;
            (function (Path) {
                class EndPoint {
                    constructor(flip) {
                        let scene = Gameplay.Scene.instance;
                        this._image = scene.add.image(0, 0, "atlas_0", Game.themes.curTheme.assetsPath + "endPoint")
                            .setDepth(30)
                            .setFlipY(flip);
                        this._image.cameraFilter = ~Gameplay.cameras[2].id;
                        this._fx = scene.add.sprite(0, 0, "atlas_0", "path/lightning_01")
                            .setOrigin(0.5, 0.63)
                            .setDepth(30)
                            .setVisible(false);
                        this._fx.cameraFilter = ~Gameplay.cameras[2].id;
                        if (flip)
                            this._fx.scaleY = -1;
                        if (!scene.anims.exists(EndPoint.FX_ANIM_KEY)) {
                            let frames = scene.anims.generateFrameNames("atlas_0", { prefix: "path/lightning_", start: 1, end: 9, zeroPad: 2 });
                            scene.anims.create({
                                key: EndPoint.FX_ANIM_KEY,
                                frames: frames,
                                frameRate: 15,
                                hideOnComplete: true
                            });
                        }
                        this._fx.play(EndPoint.FX_ANIM_KEY);
                    }
                    get x() { return this._image.x; }
                    get y() { return this._image.y; }
                    reset() {
                        this._fx.anims.stop();
                        this._fx.visible = false;
                    }
                    setPosition(x, y) {
                        this._image.setPosition(x, y);
                        this._fx.setPosition(x, y);
                        return this;
                    }
                    showPickupFx() {
                        this._fx
                            .setVisible(true)
                            .anims.play(EndPoint.FX_ANIM_KEY, false);
                    }
                }
                EndPoint.FX_ANIM_KEY = "endPointFx";
                Path.EndPoint = EndPoint;
            })(Path = Gameplay.Path || (Gameplay.Path = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Path;
            (function (Path_1) {
                class Path {
                    constructor() {
                        this._pointA = new Path_1.EndPoint(true);
                        this._pointB = new Path_1.EndPoint(false);
                        this._pointA.setPosition(Path.X, Path.Y);
                        this._pointB.setPosition(Path.X, Path.Y + Path.LEN);
                        this._ready = false;
                    }
                    get pointA() { return this._pointA; }
                    get pointB() { return this._pointB; }
                    reset() {
                        this._pointA.reset();
                        this._pointB.reset();
                        if (!this._ready) {
                            this._ready = true;
                            Gameplay.State.instance.player.events.on(Gameplay.Player.Player.EVENT_END_POINT, this.handlePlEndPoint, this);
                        }
                    }
                    handlePlEndPoint(player, pointId) {
                        (pointId == 0 ? this._pointA : this._pointB).showPickupFx();
                    }
                }
                Path.X = 360;
                Path.Y = 70;
                Path.LEN = 690;
                Path_1.Path = Path;
            })(Path = Gameplay.Path || (Gameplay.Path = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Player;
            (function (Player) {
                var Overlays;
                (function (Overlays) {
                    class Overlay {
                        constructor(type, bonusType, player, container) {
                            this._type = type;
                            this._bonusType = bonusType;
                            this._player = player;
                            this._sprite = Gameplay.Scene.instance.add.image(0, 0, "atlas_0", "player/overlay/" + Game.bonuses.getBonus(bonusType).shortName);
                            this._spriteGroupItem = container.add(this._sprite, 0, 0, 0, false);
                            this.reset();
                        }
                        get bonusType() { return this._bonusType; }
                        get active() { return this._state >= 0; }
                        reset() {
                            this._spriteGroupItem.visible = false;
                            this._state = -1;
                        }
                        show(bonus) {
                            this._bonus = bonus;
                            this._state = 0;
                            this._sprite.setScale(1);
                            this._spriteGroupItem.setVisible(true);
                            return this;
                        }
                        reactivate() { }
                        update() {
                            if (!this._bonus.active) {
                                this.reset();
                                return false;
                            }
                            return true;
                        }
                        setScale(scale) {
                            this._sprite.setScale(scale);
                        }
                    }
                    Overlays.Overlay = Overlay;
                })(Overlays = Player.Overlays || (Player.Overlays = {}));
            })(Player = Gameplay.Player || (Gameplay.Player = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Player;
            (function (Player) {
                var Overlays;
                (function (Overlays) {
                    class Basic extends Overlays.Overlay {
                        update() {
                            if (!super.update())
                                return false;
                            let time = this._bonus.remActTime;
                            if (time < 1500) {
                                time = 1500 - time;
                                this._spriteGroupItem.visible = (Math.floor(time / (250 - (150 * (time / 1500)))) & 1) != 0;
                            }
                            return true;
                        }
                    }
                    Overlays.Basic = Basic;
                })(Overlays = Player.Overlays || (Player.Overlays = {}));
            })(Player = Gameplay.Player || (Gameplay.Player = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Player;
            (function (Player) {
                var Overlays;
                (function (Overlays) {
                    class Shield extends Overlays.Overlay {
                        constructor(player, container) {
                            super(2, 0, player, container);
                        }
                        show(bonus) {
                            super.show(bonus);
                            this._spriteGroupItem.setAlpha(0.25);
                            this._sprite.setScale(0.3);
                            return this;
                        }
                        update() {
                            if (!super.update())
                                return false;
                            let progress;
                            switch (this._state) {
                                case 0: {
                                    progress = ((Gameplay.timer.time - this._bonus.actTime) / 750);
                                    if (progress >= 1) {
                                        progress = 1;
                                        this._state++;
                                    }
                                    this._spriteGroupItem.alpha = 0.25 + 0.75 * Phaser.Math.Easing.Cubic.Out(progress);
                                    this._sprite.setScale(0.3 + 0.7 * Phaser.Math.Easing.Elastic.Out(progress));
                                    break;
                                }
                                case 1: {
                                    progress = this._bonus.remActTime;
                                    if (progress < 500) {
                                        if ((progress = (500 - progress) / 500) > 1)
                                            progress = 1;
                                        progress = Phaser.Math.Easing.Cubic.Out(progress);
                                        this._spriteGroupItem.alpha = 1 - progress;
                                        this._sprite.setScale(1 + 0.5 * progress);
                                    }
                                    break;
                                }
                            }
                            return true;
                        }
                        setScale(scale) { }
                    }
                    Overlays.Shield = Shield;
                })(Overlays = Player.Overlays || (Player.Overlays = {}));
            })(Player = Gameplay.Player || (Gameplay.Player = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Player;
            (function (Player_1) {
                class Player {
                    constructor(path) {
                        this._events = new Phaser.Events.EventEmitter();
                        this._path = path;
                        this._movement = new Player_1.Movement(this);
                        this._display = new Player_1.Display(this);
                        this._staticColArea = new Helpers.CollisionArea(1, new Phaser.Geom.Circle(0, 0, Player.COLLISION_RADIUS));
                        this._colArea = new Helpers.CollisionArea(1);
                        this._events.on(Player.EVENT_DEATH, () => { this._state = 3; }, this);
                        let input = Gameplay.Scene.instance.input;
                        input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                        input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
                    }
                    get events() { return this._events; }
                    get path() { return this._path; }
                    get state() { return this._state; }
                    get x() { return Gameplay.Path.Path.X; }
                    get y() { return Gameplay.Path.Path.Y + this._movement.pathPos; }
                    get colArea() { return this._colArea; }
                    get staticColArea() { return this._staticColArea; }
                    get movement() { return this._movement; }
                    reset(revive) {
                        this._pressedPointer = null;
                        this._movement.reset(revive);
                        this._display.reset(revive);
                        this._colArea.setTo(this._staticColArea, this.x, this.y);
                        this._state = 1;
                    }
                    update() {
                        if (this._state == 1) {
                            this._movement.update();
                            this._colArea.setTo(this._staticColArea, this.x, this.y);
                            if (Gameplay.State.DEBUG_COL_AREAS) {
                                let colAreaShape = this._colArea.shape;
                                Gameplay.State.instance.debugLayer.lineStyle(1, 0x00FF00)
                                    .strokeCircle(colAreaShape.x, colAreaShape.y, colAreaShape.radius);
                            }
                        }
                        this._display.update();
                    }
                    handleObstacleCollision() {
                        if (this._state != 1 || Gameplay.State.instance.bonuses.isBonusActive(0))
                            return false;
                        this._state = 2;
                        this._events.emit(Player.EVENT_CRASH, this);
                    }
                    handlePointerDown(pointer) {
                        if (!this._pressedPointer) {
                            this._pressedPointer = pointer;
                            this._movement.mode = 1;
                        }
                    }
                    handlePointerUp(pointer) {
                        if (this._pressedPointer && this._pressedPointer.id == pointer.id) {
                            this._pressedPointer = null;
                            this._movement.mode = 0;
                        }
                    }
                }
                Player.COLLISION_RADIUS = 32;
                Player.EVENT_CRASH = "crash";
                Player.EVENT_DEATH = "death";
                Player.EVENT_END_POINT = "endPoint";
                Player_1.Player = Player;
            })(Player = Gameplay.Player || (Gameplay.Player = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Player;
            (function (Player) {
                class Movement {
                    constructor(player) {
                        this._player = player;
                        this._tmpPathPos = new PathPos();
                        player.events.on(Player.Player.EVENT_CRASH, this.handlePlayerCrash, this);
                        let events = Gameplay.State.instance.bonuses.events;
                        events.on(Gameplay.Model.Bonus.Bonus.EVENT_ACTIVATED, this.handleBonusActivation, this);
                        events.on(Gameplay.Model.Bonus.Bonus.EVENT_DEACTIVATED, this.handleBonusDeactivation, this);
                        this.reset(false);
                    }
                    get mode() { return this._mode; }
                    set mode(mode) {
                        if (this._mode == mode)
                            return;
                        this._mode = mode;
                        let dir = (mode == 1 ? -1 : 1);
                        if (dir == this._speedChangeDir)
                            return;
                        if (this._speedChangeDir == 0) {
                            this._speedChangeDir = dir;
                            this._speedChangeTime = Gameplay.timer.time;
                        }
                        else {
                            let time = Gameplay.timer.time;
                            this._speedChangeDir = dir;
                            this._speedChangeTime = time - (Movement.SPEED_CHANGE_LEN - (Gameplay.timer.time - this._speedChangeTime));
                        }
                    }
                    get speedRatio() { return (this._speed - this._minSpeed) / (Movement.DEF_SPEED - this._minSpeed); }
                    get pathPos() { return this._pathPos; }
                    get dir() { return this._dir; }
                    get endPointCnt() { return this._endPointCnt; }
                    reset(revive) {
                        if (!revive) {
                            this._minSpeed = Movement.SLOW_SPEED;
                            this._endPointCnt = 0;
                        }
                        this._speed = Movement.DEF_SPEED;
                        this._speedChangeDir = 0;
                        this._mode = 0;
                        this._pathPos = Movement.START_PATH_POS;
                        this._dir = Phaser.Math.RND.integerInRange(0, 1) == 0 ? -1 : 1;
                    }
                    update() {
                        if (this._speedChangeDir != 0) {
                            let progress = (Gameplay.timer.time - this._speedChangeTime) / Movement.SPEED_CHANGE_LEN;
                            if (progress >= 1)
                                progress = 1;
                            progress = Phaser.Math.Easing.Cubic.In(progress);
                            let offset = (Movement.DEF_SPEED - this._minSpeed) * progress;
                            if (this._speedChangeDir > 0) {
                                this._speed = this._minSpeed + offset;
                            }
                            else {
                                this._speed = Movement.DEF_SPEED - offset;
                            }
                            if (progress == 1)
                                this._speedChangeDir = 0;
                        }
                        let step = ((this._speed / 60) * Gameplay.timer.delta);
                        this._pathPos += step * this._dir;
                        let flipDir = false;
                        if (this._dir > 0) {
                            if (this._pathPos >= Gameplay.Path.Path.LEN) {
                                this._pathPos = Gameplay.Path.Path.LEN - (this._pathPos - Gameplay.Path.Path.LEN);
                                flipDir = true;
                            }
                        }
                        else {
                            if (this._pathPos <= 0) {
                                this._pathPos = this._pathPos * -1;
                                flipDir = true;
                            }
                        }
                        if (flipDir) {
                            this._dir *= -1;
                            this._endPointCnt++;
                            this._player.events.emit(Player.Player.EVENT_END_POINT, this._player, (this._dir > 0 ? 0 : 1));
                        }
                    }
                    getPathPosInTime(timeOffset, defSpeed) {
                        let speed = defSpeed ? Movement.DEF_SPEED : Movement.SLOW_SPEED;
                        let dis = speed * (timeOffset / 1000);
                        let dir = this._dir;
                        let pos = this._pathPos + dis * dir;
                        if (pos >= Gameplay.Path.Path.LEN || pos <= 0) {
                            dir = (Math.floor(Math.abs(pos) / Gameplay.Path.Path.LEN) & 1) != 0 ? -1 : 1;
                            pos = Math.abs(pos) % Gameplay.Path.Path.LEN;
                            if (dir < 0)
                                pos = Gameplay.Path.Path.LEN - pos;
                        }
                        if (dir > 0) {
                            pos += this._player.staticColArea.shape.bottom;
                        }
                        else {
                            pos += this._player.staticColArea.shape.top;
                        }
                        return this._tmpPathPos.init(pos, dir);
                    }
                    getDistanceTime(distance, defSpeed) {
                        let speed = defSpeed ? Movement.DEF_SPEED : Movement.SLOW_SPEED;
                        return (distance / speed) * 1000;
                    }
                    handlePlayerCrash() {
                        this._speed = Movement.DEF_SPEED;
                        this._speedChangeDir = 0;
                        this._mode = 0;
                    }
                    handleBonusActivation(bonus) {
                        if (bonus.type == 1)
                            this._minSpeed = 0;
                    }
                    handleBonusDeactivation(bonus) {
                        if (bonus.type == 1) {
                            this._minSpeed = Movement.SLOW_SPEED;
                            if (this._speed < this._minSpeed)
                                this._speed = this._minSpeed;
                        }
                    }
                }
                Movement.DEF_SPEED = 420;
                Movement.SLOW_SPEED = 120;
                Movement.SPEED_CHANGE_LEN = 300;
                Movement.START_PATH_POS = Gameplay.Path.Path.LEN / 2;
                Player.Movement = Movement;
                class PathPos {
                    get pos() { return this._pos; }
                    get dir() { return this._dir; }
                    init(pos, dir) {
                        this._pos = pos;
                        this._dir = dir;
                        return this;
                    }
                }
                Player.PathPos = PathPos;
            })(Player = Gameplay.Player || (Gameplay.Player = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Player;
            (function (Player) {
                class Display {
                    constructor(player) {
                        let scene = Gameplay.Scene.instance;
                        this._player = player;
                        player.events.on(Player.Player.EVENT_CRASH, this.handlePlCrash, this);
                        let path = "player/";
                        this._container = new Controls.Group.Group(true)
                            .setDepth(70)
                            .setCustomSize(0, 0)
                            .setCameraFilter(~Gameplay.cameras[2].id);
                        this._container.x = this._player.x;
                        this._sprite = scene.add.image(this._player.x, 0, "atlas_0", path + "ball_0");
                        this._container.add(this._sprite, 0, 0, 0, false);
                        this._overlays = [
                            new Player.Overlays.Basic(0, 1, player, this._container),
                            new Player.Overlays.Basic(1, 4, player, this._container),
                            new Player.Overlays.Shield(player, this._container)
                        ];
                        this._actOverlays = new Collections.NodeList();
                        Gameplay.State.instance.bonuses.events.on(Gameplay.Model.Bonus.Bonus.EVENT_ACTIVATED, this.handleBonusActivation, this);
                        this._particles = Gameplay.State.instance.objectsTrace.createEmitter({
                            frame: "player/trace_0",
                            lifespan: 600,
                            follow: this._sprite,
                            frequency: 100,
                            alpha: { start: 0.5, end: 0, ease: "Cubic.Out" },
                            scale: { start: 0.9, end: 0.1, ease: "Cubic.Out" }
                        });
                    }
                    get scale() { return this._sprite.scaleX; }
                    reset(revive) {
                        this._container.y = this._player.y;
                        this._container.setAlpha(1);
                        this._sprite.setScale(1);
                        if (!revive) {
                            this._actOverlays.forEach((overlay) => { overlay.reset(); });
                            this._actOverlays.clear();
                        }
                        else {
                            this._actOverlays.forEach((overlay) => { overlay.setScale(1); });
                        }
                        this._particles.start();
                    }
                    update() {
                        this._container.y = this._player.y;
                        if (this._player.state == 2) {
                            let progress = (Gameplay.timer.time - this._crashTime) / 1000;
                            if (progress < 1) {
                                progress = Phaser.Math.Easing.Cubic.Out(progress);
                                this._sprite.setScale(1 + progress);
                                this._actOverlays.forEach((overlay) => { overlay.setScale(this._sprite.scaleX); });
                                this._container.alpha = 1 - progress;
                            }
                            else {
                                this._player.events.emit(Player.Player.EVENT_DEATH, this._player);
                            }
                        }
                        this._actOverlays.forEach((overlay, node) => {
                            if (!overlay.update())
                                this._actOverlays.removeByNode(node);
                        }, this);
                    }
                    getBonusTypeOverlay(bonusType) {
                        let i = this._overlays.length;
                        while (i-- != 0)
                            if (this._overlays[i].bonusType == bonusType)
                                return this._overlays[i];
                        return undefined;
                    }
                    handlePlCrash() {
                        this._crashTime = Gameplay.timer.time;
                        this._particles.stop();
                    }
                    handleBonusActivation(bonus) {
                        let overlay = this.getBonusTypeOverlay(bonus.type);
                        if (overlay) {
                            if (!overlay.active) {
                                this._actOverlays.add(overlay.show(bonus));
                            }
                            else {
                                overlay.reactivate();
                            }
                        }
                    }
                }
                Player.Display = Display;
            })(Player = Gameplay.Player || (Gameplay.Player = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var UI;
            (function (UI) {
                class Combo {
                    constructor() {
                        let scene = Gameplay.Scene.instance;
                        this._text = scene.make.bitmapText({ font: "fntText66", size: 66, text: Combo.LBL_COMBO + "0x" }, false);
                        let texW = this._text.width;
                        let texH = this._text.height;
                        this._textures = [
                            scene.make.renderTexture({ width: texW, height: texH }, false),
                            scene.make.renderTexture({ width: texW, height: texH }, false),
                        ];
                        this._presenters = [];
                        for (let i = 0; i < 2; i++) {
                            let key = "combo" + i;
                            this._textures[i].saveTexture(key);
                            let presenter = scene.add.image(0, Combo.Y, key)
                                .setOrigin(0, 0.5)
                                .setDepth(10);
                            presenter.cameraFilter = ~Gameplay.cameras[1].id;
                            this._presenters.push(presenter);
                        }
                        this._presenters[0].alpha = 0.15;
                        this._presenters[1].alpha = 0.7;
                        this._fxImg = scene.add.image(Gameplay.State.WORLD_W / 2, 610, this._presenters[0].texture.key)
                            .setDepth(10)
                            .setOrigin(0.5, 0.48);
                        this._fxImg.cameraFilter = this._presenters[0].cameraFilter;
                        this._cropRc = new Phaser.Geom.Rectangle(0, 0, 0, texH);
                        Gameplay.Scene.instance.events.on(Gameplay.Model.Combo.EVENT_COMBO_CHANGE, this.handleComboChange, this);
                    }
                    reset() {
                        this.updateTextures(1);
                        this.updateComboFillCrop(0);
                        this._fxImg.visible = false;
                        this._fxTime = -1;
                    }
                    update() {
                        let progress;
                        if (this._fxTime >= 0) {
                            progress = (Gameplay.timer.time - this._fxTime) / 500;
                            if (progress < 1) {
                                progress = Phaser.Math.Easing.Cubic.Out(progress);
                                this._fxImg
                                    .setAlpha(0.5 - progress * 0.5)
                                    .setScale(1 + progress * 0.25)
                                    .setVisible(true);
                            }
                            else {
                                this._fxTime = -1;
                                this._fxImg.visible = false;
                            }
                        }
                        progress = Gameplay.State.instance.score.combo.nextValueProgress;
                        if (progress != this._nextComboProgress) {
                            if (progress > this._nextComboProgress)
                                this._fxTime = Gameplay.timer.time;
                            this.updateComboFillCrop(progress);
                        }
                        let x = (Gameplay.State.WORLD_W - this._cropRcMaxW) / 2;
                        let y = Combo.Y;
                        if (progress != 0 && Gameplay.State.instance.player.movement.mode == 1) {
                            x += Phaser.Math.RND.integerInRange(-4, 4);
                            y += Phaser.Math.RND.integerInRange(-4, 4);
                        }
                        this._presenters[0].setPosition(x, y);
                        this._presenters[1].setPosition(x, y);
                    }
                    updateTextures(combo) {
                        let text = this._text;
                        text.setText(Combo.LBL_COMBO + combo + "x");
                        text.clearTint();
                        this._textures[0]
                            .clear()
                            .draw(text);
                        text.setTint(0xc2791f);
                        this._textures[1]
                            .clear()
                            .draw(text);
                        this._cropRcMaxW = text.width;
                        this._presenters[0].x = this._presenters[1].x = (Gameplay.State.WORLD_W - this._cropRcMaxW) / 2;
                        this._fxImg.displayOriginX = this._cropRcMaxW / 2;
                    }
                    updateComboFillCrop(nextComboProgress) {
                        let presenter = this._presenters[1];
                        this._cropRc.width = Math.round(this._cropRcMaxW * (nextComboProgress / 100));
                        presenter.setCrop(this._cropRc);
                        this._nextComboProgress = nextComboProgress;
                    }
                    handleComboChange(combo, nextComboProgress) {
                        this.updateTextures(combo);
                        this.updateComboFillCrop(nextComboProgress);
                        this._fxTime = Gameplay.timer.time;
                    }
                }
                Combo.LBL_COMBO = "COMBO ";
                Combo.Y = 610;
                UI.Combo = Combo;
            })(UI = Gameplay.UI || (Gameplay.UI = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var UI;
            (function (UI) {
                class Score {
                    constructor() {
                        let scene = Gameplay.Scene.instance;
                        this._text = scene.add.bitmapText(Gameplay.State.WORLD_W >> 1, Gameplay.Path.Path.Y + Gameplay.Path.Path.LEN / 2, "fntScore", "", 200 * 2)
                            .setOrigin(0.5)
                            .setAlpha(0.15)
                            .setDepth(10);
                        this._text.cameraFilter = ~Gameplay.cameras[1].id;
                        this._fx = scene.add.bitmapText(Gameplay.State.WORLD_W >> 1, Gameplay.Path.Path.Y + Gameplay.Path.Path.LEN / 2, "fntScore", "", 200 * 2)
                            .setOrigin(0.5)
                            .setDepth(10)
                            .setVisible(false);
                        this._fx.cameraFilter = ~Gameplay.cameras[1].id;
                        scene.events.on(Gameplay.Model.Score.EVENT_SCORE_INC, this.handleScoreInc, this);
                    }
                    reset() {
                        this._text.text = "0";
                        this._fx.visible = false;
                        if (this._fxTween && this._fxTween.isPlaying())
                            this._fxTween.stop();
                    }
                    handleScoreInc(score) {
                        this._text.text = this._fx.text = score.toString();
                        this._fx.setFontSize(200 * 2)
                            .setAlpha(0.5)
                            .setVisible(true);
                        if (this._fxTween) {
                            this._fxTween.restart();
                        }
                        else {
                            this._fxTween = Gameplay.Scene.instance.tweens.add({
                                targets: this._fx,
                                duration: 500,
                                ease: Phaser.Math.Easing.Cubic.Out,
                                alpha: 0,
                                fontSize: Math.round(200 * 2.5),
                                onComplete: () => { this._fx.visible = false; }
                            });
                        }
                    }
                }
                UI.Score = Score;
            })(UI = Gameplay.UI || (Gameplay.UI = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var UI;
            (function (UI) {
                class Layer {
                    constructor() {
                        this._score = new UI.Score();
                        this._combo = new UI.Combo();
                        this._freeBnsButtons = new Collections.Pool(UI.BonusActButton, 0, true);
                        this._actBnsButtons = new Collections.NodeList();
                        Gameplay.cameras[1].on("cameraResize", this.handleCameraResize, this);
                    }
                    reset() {
                        this._score.reset();
                        this._combo.reset();
                        this._actBnsButtons.forEach((button) => {
                            button.deactivate();
                            this._freeBnsButtons.returnItem(button);
                        }, this);
                        this._actBnsButtons.clear();
                        Gameplay.State.instance.manualBonuses.forEach((bonus) => {
                            let btn = this._freeBnsButtons.getItem();
                            btn.activate(bonus);
                            this._actBnsButtons.add(btn);
                        }, this);
                        this.handleCameraResize(Gameplay.cameras[1]);
                    }
                    update() {
                        this._combo.update();
                    }
                    handleCameraResize(camera) {
                        let btnCnt = this._actBnsButtons.size;
                        if (btnCnt != 0) {
                            let container = this._actBnsButtons.first.container;
                            let y = camera.scrollY + camera.height - container.height;
                            if (btnCnt == 1) {
                                container.setPosition(camera.scrollX + (camera.width - container.width) / 2, y);
                            }
                            else {
                                container.setPosition(camera.scrollX + (camera.width / 4) - (container.width / 2), y);
                                this._actBnsButtons.last.container.setPosition(camera.scrollX + camera.width - (camera.width / 4) - (container.width / 2), y);
                            }
                        }
                    }
                }
                UI.Layer = Layer;
            })(UI = Gameplay.UI || (Gameplay.UI = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var UI;
            (function (UI) {
                class BonusActButton {
                    constructor() {
                        let scene = Gameplay.Scene.instance;
                        this._container = new Controls.Group.Group()
                            .setDepth(10)
                            .setCameraFilter(~Gameplay.cameras[1].id);
                        this._container.add(scene.add.image(0, 0, "atlas_0", Game.themes.curTheme.assetsPath + "btnActBoosterBg").setOrigin(0));
                        this._fullFx = scene.add.image(0, 0, "atlas_0", "ui/lightBeams").setVisible(false);
                        this._fullFxItem = this._container.add(this._fullFx, 0, 114, 4, false);
                        this._fill = scene.add.image(0, 0, "atlas_0", "ui/btnActBoosterFill")
                            .setInteractive();
                        this._fill.input.hitArea.setTo(-40, -40, this._fill.width + 80, this._fill.height + 80);
                        this._container.add(this._fill, 0, 114, 4, false);
                        this._fillCropRc = new Phaser.Geom.Rectangle(0, 0, this._fill.width, this._fill.height);
                        this._fillFx = scene.add.image(0, 0, "atlas_0", "ui/btnActBoosterFillFx").setVisible(false);
                        this._fillFxItem = this._container.add(this._fillFx, 0, 114, 4, false);
                        this._icon = scene.add.image(0, 0, "atlas_0");
                        this._container.add(this._icon, 0, 114, 4, false);
                        this._bonus = null;
                    }
                    get container() { return this._container; }
                    get bonus() { return this._bonus; }
                    activate(bonus) {
                        if (this._bonus)
                            throw new Error("BonusActButton.activate() - already active");
                        this._bonus = bonus;
                        this._fill.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                        this.updateFillCrop();
                        bonus.manager.events.on(Gameplay.Model.Bonus.ManualBonus.EVENT_INC_ENERGY + bonus.type, this.handleBonusIncEnergy, this);
                        this._icon
                            .setFrame("ui/bonuses/" + Game.bonuses.getBonus(this._bonus.type).shortName)
                            .setScale(1.2)
                            .setAlpha(0.5);
                        this._container.visible = true;
                    }
                    deactivate() {
                        if (this._bonus) {
                            this._fill.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                            this._bonus.manager.events.off(Gameplay.Model.Bonus.ManualBonus.EVENT_INC_ENERGY + this._bonus.type, this.handleBonusIncEnergy, this);
                            this._fillFx.visible = false;
                            this._fullFx.visible = false;
                            if (this._fillFxTween && this._fillFxTween.isPlaying)
                                this._fillFxTween.stop();
                            if (this._fullFxTween && this._fullFxTween.isPlaying)
                                this._fullFxTween.stop();
                            this._container.visible = false;
                            this._bonus = null;
                        }
                    }
                    updateFillCrop() {
                        this._fillCropRc.top = this._fill.height - Math.round(this._fill.height * this._bonus.energy);
                        this._fill.setCrop(this._fillCropRc);
                    }
                    handlePointerDown(pointer, x, y, event) {
                        if (this._bonus.activate())
                            this.updateFillCrop();
                        event.stopPropagation();
                    }
                    handleBonusIncEnergy(bonus) {
                        this.updateFillCrop();
                        if (bonus.energy != 1) {
                            this._fillFx
                                .setAlpha(0.5)
                                .setScale(1);
                            this._fillFxItem.setVisible(true);
                            if (this._fillFxTween) {
                                this._fillFxTween.restart();
                            }
                            else {
                                this._fillFxTween = Gameplay.Scene.instance.tweens.add({
                                    targets: this._fillFx,
                                    duration: 500,
                                    ease: Phaser.Math.Easing.Cubic.Out,
                                    alpha: 0,
                                    scaleX: 2,
                                    scaleY: 2,
                                    onComplete: () => { this._fillFxItem.setVisible(false); }
                                });
                            }
                        }
                        else {
                            this._fullFx
                                .setAlpha(0)
                                .setAngle(0)
                                .setScale(0);
                            this._fullFxItem.setVisible(true);
                            if (this._fullFxTween) {
                                this._fullFxTween.restart();
                            }
                            else {
                                this._fullFxTween = Gameplay.Scene.instance.tweens.add({
                                    targets: this._fullFx,
                                    alpha: { value: 1, duration: 750, ease: Phaser.Math.Easing.Cubic.Out, yoyo: true },
                                    scaleX: { value: 2, duration: 1000, ease: Phaser.Math.Easing.Cubic.Out },
                                    scaleY: { value: 2, duration: 1000, ease: Phaser.Math.Easing.Cubic.Out },
                                    angle: { value: 270, duration: 1500 },
                                    onComplete: () => { this._fullFxItem.setVisible(false); }
                                });
                            }
                        }
                    }
                }
                UI.BonusActButton = BonusActButton;
            })(UI = Gameplay.UI || (Gameplay.UI = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var ExtraLife;
        (function (ExtraLife) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "extraLife",
                        physics: {},
                        plugins: ["InputPlugin"],
                    });
                }
                create() {
                    this._tapToPlayLbl = this.add.bitmapText(0, 0, "fntText66", "TAP TO PLAY", 66)
                        .setOrigin(0.5)
                        .setVisible(false);
                    this._panel = new Controls.Group.Group(true)
                        .setCustomSize(Scene.PANEL_W, Scene.PANEL_H);
                    let bg = this.add.graphics()
                        .fillStyle(0xFFFFFF, 0.3)
                        .fillRect(0, 0, Scene.PANEL_W, Scene.PANEL_H);
                    this._panel.add(bg, 0, 0, 0, false);
                    this._panel.add(this.add.bitmapText(0, 0, "fntText66", "KEEP PLAYING?", 50).setOrigin(0.5, 0), 0, 40, 4, false);
                    let btnContent = new Controls.Group.Group(false);
                    btnContent.add(this.add.image(0, 0, "atlas_0", "gamee/video").setOrigin(0, 0.5), 0, 0, 8, true);
                    btnContent.add(this.add.bitmapText(0, 0, "fntText66", "YES", 50).setOrigin(0, 0.5), btnContent.width + 30, 4, 8, true);
                    let btn = new Controls.Buttons.ContentButton(this, 0, 0, "atlas_0", "ui/common/btnBigBlue_", 4)
                        .setContent(btnContent)
                        .setId(0);
                    this._panel.add(btn, 0, 0, 4 | 8, false);
                    btnContent = new Controls.Group.Group(false);
                    btnContent.add(this.add.bitmapText(0, 0, "fntText40", "NO, THANKS", 40), 0, 2, 0, true);
                    btn = new Controls.Buttons.ContentButton(this, 0, 0, "atlas_0", "ui/common/btnMinor_", 3)
                        .setContent(btnContent)
                        .setId(1);
                    this._panel.add(btn, 0, -20, 4 | 2, false);
                    this.events.on("btn_click", this.handleBtnClick, this);
                    this.events.on(Phaser.Scenes.Events.WAKE, this.handleSceneWake, this);
                    this.events.on(Phaser.Scenes.Events.SLEEP, this.handleSceneSleep, this);
                    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                    this.handleSceneWake();
                }
                update(time, delta) {
                    if (this._state == 1)
                        this._tapToPlayLbl.visible = (Math.floor(time / 500) & 1) != 0;
                }
                fadeOut(clb) {
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                        clb();
                    }, this);
                    this.cameras.main.fadeOut(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                }
                handleSceneWake() {
                    this._state = 0;
                    let bg = Game.SharedScenes.Background.layers;
                    bg.camera.setAngle(0);
                    bg.clearCustomWidth();
                    bg.reset();
                    this._tapToPlayLbl.visible = false;
                    this._panel.visible = true;
                    this.cameras.main.removeListener(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE);
                    this.cameras.main
                        .resetFX()
                        .fadeIn(Game.BingBong._CAM_FADE_LEN, 0xFF, 0xFF, 0xFF);
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                }
                handleSceneSleep() {
                    Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                handleBtnClick(button) {
                    if (this._state != 0)
                        return;
                    Game.game.sound.playAudioSprite("sfx", "click");
                    switch (button.id) {
                        case 0: {
                            if (Gamee2.Gamee.ready) {
                                Gamee2.Gamee.showAd((res) => {
                                    if (res) {
                                        this._state = 1;
                                        this._panel.visible = false;
                                    }
                                }, this);
                            }
                            else {
                                this._state = 1;
                                this._panel.visible = false;
                            }
                            break;
                        }
                        case 1: {
                            this._state = 2;
                            Game.BingBong.gameOver();
                            break;
                        }
                    }
                }
                handlePointerDown() {
                    if (this._state != 1)
                        return;
                    this._state = 2;
                    this.fadeOut(() => { States.states.setCurState(2); });
                }
                handleResChange(w, h) {
                    this.cameras.main.setSize(w, h);
                    this._panel.setPosition((w - this._panel.width) / 2, (h - this._panel.height) / 2);
                    this._tapToPlayLbl.setPosition(w / 2, h / 2);
                }
            }
            Scene.PANEL_W = 400;
            Scene.PANEL_H = 410;
            Scene.EXTRA_LIFE_PRICE = 5;
            ExtraLife.Scene = Scene;
        })(ExtraLife = States.ExtraLife || (States.ExtraLife = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var ExtraLife;
        (function (ExtraLife) {
            class State extends States.State {
                constructor() {
                    super(3);
                    Game.game.scene.add("extraLife", ExtraLife.Scene);
                }
                activate(prevState) {
                    Game.game.scene.run("extraLife");
                }
                deactivate(newState) {
                    Game.game.scene.sleep("extraLife");
                }
            }
            ExtraLife.State = State;
        })(ExtraLife = States.ExtraLife || (States.ExtraLife = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));

