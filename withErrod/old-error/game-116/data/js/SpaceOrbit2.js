var Game;
(function (Game) {
    var Bonus;
    (function (Bonus_1) {
        class Bonus {
            constructor(type, shortName, longName, unlockVal, price, duration, priority) {
                this._type = type;
                this._shortName = shortName;
                this._longName = longName;
                this._unlockVal = 0;
                this._unlockTargetVal = unlockVal;
                this._price = price;
                this._actDuration = duration;
                this._priority = priority;
                this._state = (this._unlockVal < this._unlockTargetVal ? 0 : 1);
            }
            get priority() { return this._priority; }
            get actTime() { return this._actTime; }
            get type() { return this._type; }
            get state() {
                if (this._state == 2) {
                    if (this.getRemActTime() != 0)
                        return 2;
                    this._state = 1;
                }
                return this._state;
            }
            get price() { return this._price; }
            get shortName() { return this._shortName; }
            get longName() { return this._longName; }
            get unlockProgress() { return this._unlockVal / this._unlockTargetVal; }
            incUnlockVal(val) {
                if (this._state == 0) {
                    if ((this._unlockVal += val) >= this._unlockTargetVal) {
                        val = this._unlockVal - this._unlockTargetVal;
                        this._unlockVal = this._unlockTargetVal;
                        this._state = 1;
                    }
                    else {
                        val = 0;
                    }
                }
                return val;
            }
            activate(actTime = Date.now()) {
                if (this._state != 1)
                    return;
                this._actTime = actTime;
                this._state = 2;
                Game.game.events.emit(Bonus.EVENT_ACTIVATED, this);
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
        Bonus.EVENT_ACTIVATED = "bnsActivated";
        Bonus_1.Bonus = Bonus;
    })(Bonus = Game.Bonus || (Game.Bonus = {}));
})(Game || (Game = {}));
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
                return false;
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
    class MathUtils {
        static mod(num1, num2) {
            return ((num1 % num2) + num2) % 1;
        }
    }
    Helpers.MathUtils = MathUtils;
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
(function (Game_1) {
    class Price {
        constructor(price, currency) {
            this._price = price;
            this._currency = currency;
            this._sale = false;
        }
        get price() { return this._price; }
        get currency() { return this._currency; }
        get sale() { return this._sale; }
        set(price, currency, sale) {
            this._price = price;
            this._currency = currency;
            this._sale = sale;
        }
    }
    Game_1.Price = Price;
    Game_1.gameeGameReady = false;
    class Game extends Phaser.Game {
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
            Game_1.game = this;
            Game_1.scale = new Helpers.ScaleManager(this.scale, new Phaser.Geom.Point(640, 852), new Phaser.Geom.Point(640, 1280));
            Game_1.scale.resize();
            Game_1.circuits = [
                new Game_1.Settings.Circuit(0, "Circle", 560, 560, (scale) => {
                    let path = new Phaser.Curves.Path(0, 0);
                    path.add(new Phaser.Curves.Ellipse(Math.round(280 * scale), Math.round(280 * scale), Math.round(280 * scale)));
                    return path;
                }, [new Game_1.Settings.Cannon(280, 280, 2, 0, 600, 800)], 0.75, 300, new Price(0, 4), true),
                new Game_1.Settings.Circuit(1, "Cube", 560, 560, (scale) => {
                    let path = new Phaser.Curves.Path(0, 0);
                    let w = Math.round(560 * scale);
                    let h = Math.round(560 * scale);
                    let cornerRadius = Math.round(100 * scale);
                    path.moveTo(cornerRadius, 0);
                    path.lineTo(w - cornerRadius, 0);
                    path.ellipseTo(cornerRadius, cornerRadius, 270, 0, false);
                    path.lineTo(w, h - cornerRadius);
                    path.ellipseTo(cornerRadius, cornerRadius, 0, 90, false);
                    path.lineTo(cornerRadius, h);
                    path.ellipseTo(cornerRadius, cornerRadius, 90, 180, false);
                    path.lineTo(0, cornerRadius);
                    path.ellipseTo(cornerRadius, cornerRadius, 180, 270, false);
                    return path;
                }, [new Game_1.Settings.Cannon(280, 280, 2, 0, 600, 800)], 0, 300, new Price(0, 4), true),
                new Game_1.Settings.Circuit(2, "Infinite", 560, 920, (scale) => {
                    let path = new Phaser.Curves.Path(0, 0);
                    let radiusX = Math.round(280 * scale);
                    let radiusY = Math.round(230 * scale);
                    path.moveTo(radiusX, radiusY * 2);
                    path.ellipseTo(radiusX, radiusY, 90.9, 91, true);
                    path.ellipseTo(radiusX, radiusY, 270, 269.9, false);
                    return path;
                }, [
                    new Game_1.Settings.Cannon(280, 230, 1.5, 280, 700, 850),
                    new Game_1.Settings.Cannon(280, 690, 1.5, 280, 700, 850)
                ], 0.25, 300, new Price(199, 4), false),
                new Game_1.Settings.Circuit(3, "Frame", 540, 730, (scale) => {
                    let path = new Phaser.Curves.Path(0, 0);
                    let w = Math.round(540 * scale);
                    let tilt = Math.round(50 * scale);
                    let y2 = Math.round(680 * scale);
                    let innerOffet = Math.round(30 * scale);
                    let verticalOffset = Math.round(100 * scale);
                    path.moveTo(w, tilt);
                    path.lineTo(0, 0);
                    path.moveTo(0, y2);
                    path.lineTo(w, y2 + tilt);
                    path.moveTo(0, verticalOffset);
                    path.lineTo(0, y2 - verticalOffset);
                    path.moveTo(w, y2 + tilt - verticalOffset);
                    path.lineTo(w, tilt + verticalOffset);
                    path.moveTo(w, tilt + innerOffet);
                    path.lineTo(0, innerOffet);
                    path.moveTo(0, y2 - innerOffet);
                    path.lineTo(w, y2 + tilt - innerOffet);
                    path.moveTo(innerOffet, verticalOffset);
                    path.lineTo(innerOffet, y2 - verticalOffset);
                    path.moveTo(w - innerOffet, y2 + tilt - verticalOffset);
                    path.lineTo(w - innerOffet, tilt + verticalOffset);
                    return path;
                }, [new Game_1.Settings.Cannon(270, 365, 2, 0, 600, 1000),], 0, 300, new Price(0, 4), true),
                new Game_1.Settings.Circuit(4, "UFO", 1600, 600, (scale) => {
                    var radius1 = Math.round(250 * scale);
                    var radius2 = Math.round(300 * scale);
                    let path = new Phaser.Curves.Path(0, radius2);
                    path.ellipseTo(radius1, radius2, 180, 0, false);
                    path.ellipseTo(radius2, radius1, 180, 0, true);
                    path.ellipseTo(radius1, radius2, 180, 0, false);
                    path.ellipseTo(radius1, radius2, 0, 180, false);
                    path.ellipseTo(radius2, radius1, 0, 180, true);
                    path.ellipseTo(radius1, radius2, 0, 180, false);
                    return path;
                }, [
                    new Game_1.Settings.Cannon(250, 300, 1.5, 300, 600, 800),
                    new Game_1.Settings.Cannon(800, 300, 2, 300, 600, 800),
                    new Game_1.Settings.Cannon(1350, 300, 1.5, 300, 600, 800),
                ], 0, 350, new Price(199, 4), false),
                new Game_1.Settings.Circuit(5, "Eye", 600, 800, (scale) => {
                    var radius = Math.round(300 * scale);
                    var offset = Math.round(100 * scale);
                    let path = new Phaser.Curves.Path(0, radius + offset);
                    path.ellipseTo(radius, radius - offset, 180, 0, false);
                    path.ellipseTo(radius, radius - offset, 0, 180, false);
                    path.ellipseTo(radius, radius, 180, 0, false);
                    path.ellipseTo(radius, radius, 0, 180, false);
                    path.ellipseTo(radius, radius + offset, 180, 0, false);
                    path.ellipseTo(radius, radius + offset, 0, 180, false);
                    return path;
                }, [new Game_1.Settings.Cannon(300, 400, 2, 400, 500, 800)], 0, 300, new Price(199, 4), true),
            ];
            Game_1.themes = [
                new Game_1.Settings.Theme(0, "", 0xc8b37a, 6, 5, new Price(0, 4), new Game_1.Settings.ThemePlayer()),
                new Game_1.Settings.Theme(1, "Tron", 0x00d3d6, 3, 5, new Price(49, 4), new Game_1.Settings.ThemePlayer()),
                new Game_1.Settings.Theme(2, "Black", 0xa7a7a7, 3, 5, new Price(49, 4), new Game_1.Settings.ThemePlayer()),
                new Game_1.Settings.Theme(3, "Wood", 0xc69c6d, 3, 5, new Price(79, 4), new Game_1.Settings.ThemePlayer()),
                new Game_1.Settings.Theme(4, "Ice", 0xc8b37a, 3, 1, new Price(0, 4), new Game_1.Settings.ThemePlayer()),
                new Game_1.Settings.Theme(5, "Beach", 0xce9f2a, 3, 1, new Price(79, 4), new Game_1.Settings.ThemePlayer()),
                new Game_1.Settings.Theme(6, "Halloween", 0x54769f, 1, 1, new Price(79, 4), new Game_1.Settings.ThemePlayer(2, 7)),
            ];
            Game_1.bonuses = [
                new Game_1.Bonus.Bonus(0, "shield", "shield", 0, 5, 10 * 60 * 1000, 10),
                new Game_1.Bonus.Bonus(1, "2x score", "2x score", 0, 8, 10 * 60 * 1000, 10),
                new Game_1.Bonus.Bonus(2, "slow", "slow bullets", 0, 8, 10 * 60 * 1000, 10),
                new Game_1.Bonus.Bonus(3, "pause", "pause bullets", 0, 8, 10 * 60 * 1000, 10),
                new Game_1.Bonus.Bonus(4, "speed", "extra speed", 0, 5, 10 * 60 * 1000, 10),
            ];
            Gamee2.Gamee.events.on("audioChange", (on) => { Game_1.game.sound.mute = !on; });
            Gamee2.Gamee.events.on("pause", () => {
                this.pause();
            }, this);
            Gamee2.Gamee.events.on("resume", () => {
                this.resume();
            }, this);
            Gamee2.Gamee.events.on("start", () => {
                this.resume();
                Gamee2.Gamee.loadAd();
                if (Game_1.saveState.vipMember && Gamee2.Gamee.initData.playerMembershipType != "vip")
                    Game_1.saveState.vipMember = false;
                let stateId = Game_1.States.states.state.id;
                if (stateId == 2 || stateId == 4)
                    return;
                Game_1.States.states.setCurState(2);
            }, this);
            this.scene.add("welcomeVIP", Game_1.States.WelcomeVIP.Scene);
            Game_1.States.Manager.create();
        }
        static create() {
            Game_1.game = new Game();
        }
        gameeGameReady(scene) {
            Game_1.gameeGameReady = true;
            Game_1.game.pause();
            Gamee2.Gamee.gameReady();
        }
        gameOver() {
            if (Gamee2.Gamee.ready) {
                Gamee2.Gamee.gameOver();
            }
            else {
                let camera = Game_1.States.states.state.scene.cameras.main;
                camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    camera.resetFX();
                    Game_1.States.states.setCurState(2);
                });
                camera.fadeOut(250, 0xFF, 0xFF, 0xFF);
            }
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
    }
    window.onload = function () {
        Game.create();
    };
})(Game || (Game = {}));
var Game;
(function (Game) {
    class SaveState {
        constructor(data) {
            this._data = {
                unlockMasks: [],
                bonusBuyTime: [],
                bonusBuyMask: 0,
                vipMember: (data && data.vipMember != undefined ? data.vipMember : false)
            };
            let masks = this.createMasks(Math.ceil(Game.circuits.length / 31), (data && data.unlockMasks ? data.unlockMasks[0] : undefined), [3]);
            this._data.unlockMasks[0] = masks;
            masks = this.createMasks(Math.ceil(Game.themes.length / 31), (data && data.unlockMasks ? data.unlockMasks[1] : undefined), [1]);
            this._data.unlockMasks[1] = masks;
            let mask = (data && data.bonusBuyMask != undefined ? data.bonusBuyMask : 0);
            let i = Game.bonuses.length;
            while (i-- != 0)
                this._data.bonusBuyTime.push(0);
            if ((this._data.bonusBuyMask = mask) != 0) {
                Game.bonuses.forEach((bonus, i) => {
                    if ((mask & (1 << i)) != 0 && Array.isArray(data.bonusBuyTime)) {
                        bonus.activate(data.bonusBuyTime[i]);
                        this._data.bonusBuyTime[i] = bonus.actTime;
                    }
                });
            }
            Game.game.events.on(Game.Bonus.Bonus.EVENT_ACTIVATED, this.handleBonusActivated, this);
            if (this._data.vipMember == undefined)
                this._data.vipMember = false;
            this._flags = 0;
        }
        get vipMember() { return this._data.vipMember; }
        set vipMember(member) {
            if (this._data.vipMember != member) {
                this._data.vipMember = member;
                this._flags |= 1;
                this.save();
            }
        }
        unlockBattleItem(item) {
            if (item.price.currency != 2) {
                this.setMaskBit(this._data.unlockMasks[item.type], item.id);
                this._flags |= 1;
                this.save();
            }
        }
        isBattleItemUnlocked(item) {
            let currency = item.price.currency;
            if (currency == 4)
                return true;
            if (currency != 2)
                return this.isMaskBitSet(this._data.unlockMasks[item.type], item.id);
            return (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.playerMembershipType == "vip");
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
        createMasks(cnt, srcMasks, defSettings) {
            let masks = [];
            for (let i = 0; i < cnt; i++)
                masks.push((srcMasks && srcMasks.length > i ? srcMasks[i] : 0) | defSettings[i]);
            return masks;
        }
        isMaskBitSet(mask, id) {
            return (mask[Math.floor(id / 31)] & (1 << (id % 31))) != 0;
        }
        setMaskBit(mask, id) {
            mask[Math.floor(id / 31)] |= (1 << (id % 31));
        }
        clearMaskBit(mask, id) {
            mask[Math.floor(id / 31)] &= ~(1 << (id % 31));
        }
        handleBonusActivated(bonus) {
            this._data.bonusBuyMask |= (1 << bonus.type);
            this._data.bonusBuyTime[bonus.type] = bonus.actTime;
            this._flags |= 1;
            this.save();
        }
    }
    Game.SaveState = SaveState;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Settings;
    (function (Settings) {
        class BattleItemSettings {
            constructor(type, id, price, name) {
                this._type = type;
                this._id = id;
                this._price = price;
                this._name = name;
            }
            get type() { return this._type; }
            get id() { return this._id; }
            get price() { return this._price; }
            get name() { return this._name; }
            get locked() { return !Game.saveState.isBattleItemUnlocked(this); }
        }
        Settings.BattleItemSettings = BattleItemSettings;
    })(Settings = Game.Settings || (Game.Settings = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Settings;
    (function (Settings) {
        class Cannon {
            constructor(x, y, bgScale, aimRadius, shootingInterval, bulletHitDelay) {
                this._x = x;
                this._y = y;
                this._bgScale = bgScale;
                this._aimRadius = aimRadius;
                this._shootingInterval = shootingInterval;
                this._bulletHitDelay = bulletHitDelay;
            }
            get x() { return this._x; }
            get y() { return this._y; }
            get aimRadius() { return this._aimRadius; }
            get bgScale() { return this._bgScale; }
            getShootingInterval(levelId) {
                return this._shootingInterval - (Math.min(1, levelId / 5) * (this._shootingInterval * 0.5));
            }
            getBulletHitDelay(levelId) {
                return this._bulletHitDelay - (Math.min(1, levelId / 9) * (this._bulletHitDelay * 0.2));
            }
        }
        Settings.Cannon = Cannon;
    })(Settings = Game.Settings || (Game.Settings = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Settings;
    (function (Settings) {
        class Circuit {
            constructor(uid, name, width, height, pathGenerator, cannons, startPos, speed, battlePrice, lockedCamera) {
                this._width = width;
                this._height = height;
                this._pathGenerator = pathGenerator;
                this._cannons = cannons;
                this._startPos = startPos;
                this._speed = speed;
                this._lockedCamera = lockedCamera;
                this._battleSettings = new Settings.BattleItemSettings(0, uid, battlePrice, name);
            }
            get battleSettings() { return this._battleSettings; }
            get width() { return this._width; }
            get height() { return this._height; }
            get pathGenerator() { return this._pathGenerator; }
            get cannons() { return this._cannons; }
            get startPos() { return this._startPos; }
            get speed() { return this._speed; }
            get lockedCamera() { return this._lockedCamera; }
            static getPointCnt(pathLen) {
                return Math.floor(pathLen / 60);
            }
        }
        Settings.Circuit = Circuit;
    })(Settings = Game.Settings || (Game.Settings = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Settings;
    (function (Settings_1) {
        class Settings {
            constructor(gameMode, theme, circuit) {
                this._gameMode = gameMode;
                this._theme = theme;
                this._circuit = circuit;
            }
            get gameMode() { return this._gameMode; }
            get theme() { return this._theme; }
            get circuit() { return this._circuit; }
        }
        Settings_1.Settings = Settings;
    })(Settings = Game.Settings || (Game.Settings = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Settings;
    (function (Settings) {
        class ThemePlayer {
            constructor(frameCnt = 1, frameRate) {
                this._frameCnt = frameCnt;
                this._frameRate = frameRate;
            }
            get frameCnt() { return this._frameCnt; }
            get frameRate() { return this._frameRate; }
        }
        Settings.ThemePlayer = ThemePlayer;
        class Theme {
            constructor(uid, name, pathColor, bulletVerCnt, cannonVerCnt, battlePrice, player) {
                this._pathColor = pathColor;
                this._bulletVerCnt = bulletVerCnt;
                this._cannonVerCnt = cannonVerCnt;
                this._battleSettings = new Settings.BattleItemSettings(1, uid, battlePrice, name);
                this._player = player;
            }
            get battleSettings() { return this._battleSettings; }
            get assetPath() { return "theme_" + this._battleSettings.id + "/"; }
            get pathColor() { return this._pathColor; }
            get bulletVerCnt() { return this._bulletVerCnt; }
            get cannonVerCnt() { return this._cannonVerCnt; }
            get player() { return this._player; }
        }
        Settings.Theme = Theme;
    })(Settings = Game.Settings || (Game.Settings = {}));
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
            get scene() { return this._scene; }
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
                    new States.Gameplay.State(),
                    new States.Shop.State(),
                    new States.ExtraLife.State(),
                    new States.Battle.State()
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
            class State extends States.State {
                constructor() {
                    super(0);
                    State._instance = this;
                    Game.game.scene.add("boot", Boot.Scene);
                }
                static get instance() { return State._instance; }
                activate(prevState, data) {
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
                    this.load.xml("fntText32");
                    this.load.xml("fntText64");
                    this.load.audioSprite("sfx", "sfx.json");
                    Gamee2.Gamee.events.once("initialized", (initState, initData) => {
                        this._mode = 1;
                        Game.game.sound.mute = !initData.sound;
                        Gamee2.Gamee.loadAd();
                        Game.saveState = new Game.SaveState((initData && initData.saveState ? JSON.parse(initData.saveState) : undefined));
                        if (initData.gameContext == "normal") {
                            Game.settings = new Game.Settings.Settings(0, Game.themes[0], Game.circuits[0]);
                            if (initData && initData.initData) {
                                try {
                                    let data = JSON.parse(initData.initData);
                                    console.log(initData.initData);
                                    if (data && data.type && (data.type == "shape" || data.type == "skin")) {
                                        let item = (data.type == "shape" ? Game.circuits[data.id].battleSettings : Game.themes[data.id].battleSettings);
                                        let currency = data.currency == "gems" ? 1 : 0;
                                        if (item.price.currency != currency || item.price.price != data.cost)
                                            item.price.set(data.cost, currency, true);
                                        this._battleCreatorActData = new States.Battle.ActivationData((item.type == 0 ? item.id : 0), (item.type == 1 ? item.id : 0));
                                    }
                                }
                                catch (e) {
                                    this._battleCreatorActData = null;
                                }
                            }
                        }
                        else {
                            let battleData;
                            if (initData && initData.initData) {
                                battleData = JSON.parse(initData.initData);
                            }
                            else {
                                battleData = {
                                    circuit: 0,
                                    theme: 0
                                };
                            }
                            Game.settings = new Game.Settings.Settings(1, Game.themes[battleData.theme], Game.circuits[battleData.circuit]);
                        }
                    });
                    this._mode = Gamee2.Gamee.initialize("FullScreen", ["saveState", "logEvents", "share", "rewardedAds"]) ? 0 : 1;
                    if (this._mode == 1) {
                        Game.saveState = new Game.SaveState(undefined);
                        Game.settings = new Game.Settings.Settings(0, Game.themes[0], Game.circuits[0]);
                    }
                }
                create() {
                    let fontKeys = [
                        "fntText32",
                        "fntText64",
                    ];
                    fontKeys.forEach((key) => {
                        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, key, "atlas_0", "fonts/" + key, key, 0, 0);
                    }, this);
                }
                update() {
                    if (this._mode == 1) {
                        if (this._battleCreatorActData) {
                            States.states.setCurState(4, this._battleCreatorActData);
                        }
                        else {
                            States.states.setCurState(2);
                        }
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
        var Battle;
        (function (Battle) {
            class SelBox {
                constructor(width, height, boxItemCreate, content, curItemId) {
                    this._events = new Phaser.Events.EventEmitter();
                    this._container = new Controls.Group.Group(true)
                        .setCustomSize(width, height);
                    this._content = content;
                    this._curItemId = curItemId;
                    this._boxItem1 = boxItemCreate.call(this, this);
                    this._boxItem1.activate(content[curItemId]);
                    this._boxItem1.position = 0.5;
                    this._boxItem2 = boxItemCreate.call(this, this);
                    this._boxItem2.deactivate();
                    this._state = 0;
                }
                get container() { return this._container; }
                get curItem() { return this._boxItem1; }
                get curData() { return this._content[this._curItemId]; }
                get events() { return this._events; }
                get state() { return this._state; }
                moveToNext() {
                    if (this._state != 0)
                        return false;
                    if (++this._curItemId == this._content.length)
                        this._curItemId = 0;
                    this._boxItem2.activate(this._content[this._curItemId]);
                    this._boxItem2.position = 1;
                    this._boxItem2.alpha = 0;
                    this._state = 1;
                    this._timer = 0;
                    return true;
                }
                moveToPrev() {
                    if (this._state != 0)
                        return false;
                    if (this._curItemId-- == 0)
                        this._curItemId = this._content.length - 1;
                    this._boxItem2.activate(this._content[this._curItemId]);
                    this._boxItem2.position = 0;
                    this._boxItem2.alpha = 0;
                    this._state = 2;
                    this._timer = 0;
                    return true;
                }
                update(delta) {
                    if (this._state == 0)
                        return;
                    this._timer += delta;
                    let progress = Phaser.Math.Easing.Cubic.Out(this._timer / 500);
                    if (progress < 1) {
                        let mp = progress * 0.5;
                        if (this._state == 1) {
                            this._boxItem1.position = 0.5 - mp;
                            this._boxItem2.position = 1 - mp;
                        }
                        else {
                            this._boxItem1.position = 0.5 + mp;
                            this._boxItem2.position = mp;
                        }
                        this._boxItem1.alpha = 1 - progress;
                        this._boxItem2.alpha = progress;
                    }
                    else {
                        let box = this._boxItem1;
                        this._boxItem1 = this._boxItem2;
                        this._boxItem2 = box;
                        this._boxItem1.position = 0.5;
                        this._boxItem1.alpha = 1;
                        this._boxItem2.deactivate();
                        this._state = 0;
                        this._events.emit(SelBox.EVENT_NEW_SELECTION, this._content[this._curItemId]);
                    }
                }
                setWidth(width) {
                    if (width != this._container.width) {
                        this._container.setCustomSize(width, this._container.height);
                        this._boxItem1.updatePosition();
                        if (this._boxItem2.active)
                            this._boxItem2.updatePosition();
                    }
                }
            }
            SelBox.EVENT_NEW_SELECTION = "newSel";
            Battle.SelBox = SelBox;
        })(Battle = States.Battle || (States.Battle = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Battle;
        (function (Battle) {
            class SelBoxItem {
                constructor(owner, container) {
                    this._owner = owner;
                    this._container = owner.container.add(container, 0, 0, 8, false);
                    this._position = -1;
                    this.position = 0;
                }
                get owner() { return this._owner; }
                get data() { return this._data; }
                get position() { return this._position; }
                set position(pos) {
                    if (this._position == pos)
                        return;
                    this._position = pos;
                    this.updatePosition();
                }
                get alpha() { return this._container.alpha; }
                set alpha(alpha) { this._container.alpha = alpha; }
                get active() { return this._container.visible; }
                activate(data) {
                    this._data = data;
                    this._container.visible = true;
                }
                deactivate() {
                    this._container.visible = false;
                }
                updatePosition() {
                    this._container.setOffsetX(-this._container.width + (this._container.width + this._owner.container.width) * this._position);
                }
            }
            SelBoxItem.EVENT_TAP = "itemTap";
            Battle.SelBoxItem = SelBoxItem;
        })(Battle = States.Battle || (States.Battle = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Battle;
        (function (Battle) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "battle",
                        physics: {},
                        plugins: ["InputPlugin"],
                    });
                    Scene._instance = this;
                }
                static get instance() { return Scene._instance; }
                update(time, delta) {
                    Battle.State.instance.update(delta);
                }
            }
            Battle.Scene = Scene;
        })(Battle = States.Battle || (States.Battle = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Battle;
        (function (Battle) {
            class ActivationData {
                constructor(circuitId = 0, themeId = 0) {
                    this._circuitId = circuitId;
                    this._themeId = themeId;
                }
                get circuitId() { return this._circuitId; }
                get themeId() { return this._themeId; }
            }
            Battle.ActivationData = ActivationData;
            class State extends States.State {
                constructor() {
                    super(4);
                    State._instance = this;
                    this._flags = 0;
                    Game.game.scene.add("battle", Battle.Scene);
                }
                static get instance() { return State._instance; }
                activate(prevState, data) {
                    this._actData = null;
                    if (data)
                        this._actData = data;
                    if (!this._scene) {
                        this._scene = Game.game.scene.getScene("battle");
                        this._scene.events.on(Phaser.Scenes.Events.CREATE, this.handleSceneCreate, this);
                    }
                    this._flags &= ~1;
                    Game.game.scene.run("battle");
                    this._scene.cameras.main.fadeIn(250, 0xFF, 0xFF, 0xFF);
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                }
                deactivate(newState) {
                    let camera = this._scene.cameras.main;
                    camera.removeListener(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, undefined, this);
                    camera.resetFX();
                    Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this._scene.sys.sleep();
                }
                update(delta) {
                    if (Gamee2.Gamee.initialized && !Game.gameeGameReady)
                        Game.game.gameeGameReady(this._scene);
                    this._selBoxes.forEach((box) => { box.update(delta); });
                    let deltaT = delta / (1000 / 60);
                    this._bg.tilePositionX += deltaT;
                    this._bg.tilePositionY -= deltaT;
                }
                purchaseBattleItem(slbItem, img) {
                    let settings = slbItem.data.battleSettings;
                    let currency = settings.price.currency;
                    if (currency == 2) {
                        Gamee2.Gamee.showSubscribeDialog((res) => {
                            if (res) {
                                Gamee2.Gamee.initData.playerMembershipType = "vip";
                                this._selBoxes.forEach((selBox) => {
                                    if (selBox.curData.battleSettings.price.currency == 2) {
                                        selBox.curItem.activate(selBox.curData);
                                    }
                                }, this);
                                this.updateCreateBtn();
                                this._scene.sys.pause();
                                Game.game.scene.bringToTop("welcomeVIP");
                                Game.game.scene.run("welcomeVIP");
                                Game.game.scene.getScene("welcomeVIP").events.once(Phaser.Scenes.Events.DESTROY, () => {
                                    this._scene.sys.resume();
                                }, this);
                            }
                        }, this);
                    }
                    else {
                        Gamee2.Gamee.purchaseItem(settings.price.price, currency == 0 ? 0 : 1, settings.name, img, false, (res) => {
                            if (res) {
                                this.unlockBattleItem(slbItem);
                            }
                        }, this);
                    }
                }
                unlockBattleItem(slbItem) {
                    let settings = slbItem.data.battleSettings;
                    Game.saveState.unlockBattleItem(settings);
                    slbItem.activate(slbItem.data);
                    this.updateCreateBtn();
                    Gamee2.Gamee.logEvent(settings.type == 1 ? "PURCHASE_THEME" : "PURCHASE_CIRCUIT", settings.id.toString());
                }
                createBattle() {
                    let theme = this._selBoxes[1].curData;
                    let bg = this._scene.make.tileSprite({ key: "atlas_0", frame: theme.assetPath + "bgTile", width: State.BATTLE_SPLASH_W, height: State.BATTLE_SPLASH_H })
                        .setOrigin(0, 0);
                    this._tmpRenderTex
                        .clear()
                        .draw(bg);
                    bg.destroy();
                    let circuitOffset = 20;
                    let circuit = this._selBoxes[0].curData;
                    let circuitScale = Math.min((State.BATTLE_SPLASH_W - circuitOffset * 2) / circuit.width, (State.BATTLE_SPLASH_H - circuitOffset * 2) / circuit.height);
                    let x = (State.BATTLE_SPLASH_W - (circuit.width * circuitScale)) / 2;
                    let y = (State.BATTLE_SPLASH_H - (circuit.height * circuitScale)) / 2;
                    let cannonBgImg = this._scene.make.image({ key: "atlas_0", frame: theme.assetPath + "cannon/cannonBg" });
                    let cannonImg = this._scene.make.image({ key: "atlas_0", frame: theme.assetPath + "cannon/cannon_" + Phaser.Math.RND.integerInRange(0, theme.cannonVerCnt - 1) })
                        .setScale(circuitScale);
                    circuit.cannons.forEach((cannon) => {
                        let cannonX = cannon.x * circuitScale + x;
                        let cannonY = cannon.y * circuitScale + y;
                        cannonBgImg.setScale(cannon.bgScale * circuitScale);
                        this._tmpRenderTex.draw(cannonBgImg, cannonX, cannonY);
                        this._tmpRenderTex.draw(cannonImg, cannonX, cannonY);
                    }, this);
                    cannonImg.destroy();
                    cannonBgImg.destroy();
                    let path = circuit.pathGenerator(circuitScale);
                    this._tmpGraphics
                        .clear()
                        .lineStyle(2, theme.pathColor, 1);
                    path.draw(this._tmpGraphics);
                    this._tmpRenderTex.draw(this._tmpGraphics, (State.BATTLE_SPLASH_W - (circuit.width * circuitScale)) / 2, (State.BATTLE_SPLASH_H - (circuit.height * circuitScale)) / 2);
                    this._tmpGraphics.clear();
                    let pointImg = this.scene.make.image({ key: "atlas_0", frame: theme.assetPath + "point" })
                        .setScale(circuitScale);
                    let pointCnt = Game.Settings.Circuit.getPointCnt(path.getLength());
                    let pointSpacing = 1 / pointCnt;
                    let pointPathPos = pointSpacing / 2;
                    while (pointCnt-- != 0) {
                        let pos = path.getPoint(pointPathPos);
                        this._tmpRenderTex.draw(pointImg, x + pos.x, y + pos.y);
                        pointPathPos += pointSpacing;
                    }
                    pointImg.destroy();
                    path.destroy();
                    Helpers.RenderTexture.toBase64(this._tmpRenderTex, 0, 0, State.BATTLE_SPLASH_W, State.BATTLE_SPLASH_H, (base64) => {
                        let battleData = {
                            circuit: circuit.battleSettings.id,
                            theme: theme.battleSettings.id
                        };
                        if (Gamee2.Gamee.ready) {
                            Gamee2.Gamee.share({
                                text: "Space Orbit",
                                picture: base64,
                                destination: "battle",
                                initData: JSON.stringify(battleData)
                            }, (res) => {
                            }, this);
                        }
                        else {
                            console.log(base64);
                        }
                    }, this, "image/jpeg", 0.9);
                }
                handleSceneCreate(scene) {
                    this._tmpGraphics = scene.make.graphics();
                    this._cannonImg = scene.make.image({ key: "atlas_0", frame: "battle/circuitCannon" });
                    this._tmpRenderTex = scene.make.renderTexture({ width: Math.max(State.BATTLE_SPLASH_W, State.CIRCUIT_SHOP_ICON_W), height: Math.max(State.BATTLE_SPLASH_H, State.CIRCUIT_SHOP_ICON_H) });
                    let w = Game.scale.width;
                    let h = Game.scale.height;
                    let circuitsSlb = new Battle.SelBox(w, 380, (owner) => { return new Battle.CircuitSelBoxItem(owner, this._tmpGraphics, this._cannonImg); }, Game.circuits, this._actData ? this._actData.circuitId : 0);
                    let btnId = 0;
                    let btnHitArea = new Phaser.Geom.Rectangle(-20, -20, 100, 100);
                    this._selBoxes = [circuitsSlb];
                    circuitsSlb.container.depth = 10;
                    circuitsSlb.container.add(new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "battle/btnPrev_", btnHitArea).setId(btnId++).setDepth(State.BTN_DEPTH), 20, 0, 8, false);
                    circuitsSlb.container.add(new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "battle/btnNext_", btnHitArea).setId(btnId++).setDepth(State.BTN_DEPTH), -20, 0, 1 | 8, false);
                    circuitsSlb.events.on(Battle.SelBoxItem.EVENT_TAP, this.handleBattleItemTap, this);
                    circuitsSlb.events.on(Battle.SelBox.EVENT_NEW_SELECTION, () => { this.updateCreateBtn(); }, this);
                    let themesSlb = new Battle.SelBox(w, 218, (owner) => { return new Battle.ThemeSelBoxItem(owner); }, Game.themes, this._actData ? this._actData.themeId : 0);
                    this._selBoxes.push(themesSlb);
                    themesSlb.container.depth = 10;
                    themesSlb.container.add(new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "battle/btnPrev_", btnHitArea).setId(btnId++).setDepth(State.BTN_DEPTH), 20, 0, 8, false);
                    themesSlb.container.add(new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "battle/btnNext_", btnHitArea).setId(btnId++).setDepth(State.BTN_DEPTH), -20, 0, 1 | 8, false);
                    themesSlb.events.on(Battle.SelBoxItem.EVENT_TAP, this.handleBattleItemTap, this);
                    themesSlb.events.on(Battle.SelBox.EVENT_NEW_SELECTION, this.handleThemeSelect, this);
                    this._bg = scene.add.tileSprite(0, 0, w, h, "atlas_0", themesSlb.curData.assetPath + "bgTile")
                        .setOrigin(0);
                    let content = new Controls.Group.Group();
                    content.add(scene.add.bitmapText(0, 0, "fntText64", "CREATE BATTLE", 45), 0, 0, 0, true);
                    this._btnCreate = new Controls.Buttons.ContentButton(scene, 0, 0, "atlas_0", "battle/btnCreate_");
                    this._btnCreate.setDepth(State.BTN_DEPTH)
                        .setContent(content)
                        .setId(btnId++);
                    this.updateCreateBtn();
                    this._btnClose = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "battle/btnClose_")
                        .setId(btnId++)
                        .setDepth(State.BTN_DEPTH);
                    scene.events.on("btn_press", this.handleBtnPress, this);
                    scene.events.on("btn_click", this.handleBtnClick, this);
                }
                handleBattleItemTap(slbItem) {
                    let settings = slbItem.data.battleSettings;
                    if (settings.locked && slbItem.owner.state == 0) {
                        if (Gamee2.Gamee.ready) {
                            if (settings.type == 1) {
                                this.purchaseBattleItem(slbItem, Game.game.textures.getBase64("atlas_0", slbItem.data.assetPath + "themeIcon"));
                            }
                            else {
                                this._tmpGraphics
                                    .clear()
                                    .fillStyle(0x083239, 1)
                                    .fillRoundedRect(0, 0, State.CIRCUIT_SHOP_ICON_W, State.CIRCUIT_SHOP_ICON_H, 20);
                                this._tmpRenderTex.draw(this._tmpGraphics, 0, 0);
                                let circuitOffset = 20;
                                let circuit = slbItem.data;
                                let pathScale = Math.min((State.CIRCUIT_SHOP_ICON_W - (circuitOffset * 2)) / circuit.width, (State.CIRCUIT_SHOP_ICON_H - (circuitOffset * 2)) / circuit.height);
                                let path = circuit.pathGenerator(pathScale);
                                this._tmpGraphics
                                    .clear()
                                    .lineStyle(4, 0xFFFFFF, 0.5);
                                path.draw(this._tmpGraphics);
                                this._tmpGraphics.lineStyle(2, 0xFFFFFF, 1);
                                path.draw(this._tmpGraphics);
                                path.destroy();
                                this._tmpRenderTex.draw(this._tmpGraphics, (State.CIRCUIT_SHOP_ICON_W - circuit.width * pathScale) / 2, (State.CIRCUIT_SHOP_ICON_H - circuit.height * pathScale) / 2);
                                circuit.cannons.forEach((cannon) => {
                                    this._cannonImg.setScale(cannon.bgScale / 2);
                                    this._tmpRenderTex.draw(this._cannonImg, circuitOffset + (cannon.x / circuit.width) * (State.CIRCUIT_SHOP_ICON_W - (circuitOffset * 2)), circuitOffset + (cannon.y / circuit.height) * (State.CIRCUIT_SHOP_ICON_H - (circuitOffset * 2)));
                                }, this);
                                Helpers.RenderTexture.toBase64(this._tmpRenderTex, 0, 0, State.CIRCUIT_SHOP_ICON_W, State.CIRCUIT_SHOP_ICON_H, (img) => {
                                    this.purchaseBattleItem(slbItem, img);
                                }, this);
                            }
                        }
                        else {
                            this.unlockBattleItem(slbItem);
                        }
                    }
                }
                handleBtnPress(button) {
                    let btnId = button.id;
                    if ((this._flags & 1) == 0 && btnId < this._selBoxes.length * 2) {
                        let res;
                        if ((btnId & 1) == 0) {
                            res = this._selBoxes[btnId >> 1].moveToPrev();
                        }
                        else {
                            res = this._selBoxes[btnId >> 1].moveToNext();
                        }
                        if (res)
                            Game.game.sound.playAudioSprite("sfx", "click");
                    }
                }
                handleBtnClick(button) {
                    if ((this._flags & 1) == 0) {
                        let btnId = button.id;
                        let minBtnId = this._selBoxes.length * 2;
                        if (btnId < minBtnId)
                            return;
                        Game.game.sound.playAudioSprite("sfx", "click");
                        if (btnId == minBtnId) {
                            this.createBattle();
                        }
                        else if (btnId == minBtnId + 1) {
                            let camera = this._scene.cameras.main;
                            camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { States.states.setCurState(2); });
                            camera.fadeOut(250, 0xFF, 0xFF, 0xFF);
                            this._flags |= 1;
                        }
                    }
                }
                handleThemeSelect(theme) {
                    this._bg.setFrame(theme.assetPath + "bgTile");
                    this.updateCreateBtn();
                }
                updateCreateBtn() {
                    this._btnCreate.enabled = !(this._selBoxes[0].curData.battleSettings.locked || this._selBoxes[1].curData.battleSettings.locked);
                }
                handleResChange(w, h) {
                    this._scene.cameras.main.setSize(w, h);
                    this._bg.setSize(w, h);
                    this._btnCreate.setPosition((w - this._btnCreate.width) / 2, h - State.BTN_CREATE_BOT_OFFSET - this._btnCreate.height);
                    this._btnClose.setPosition(w - this._btnClose.width - 10, 10);
                    let totH = 0;
                    this._selBoxes.forEach((box) => {
                        let container = box.container;
                        container.setCustomSize(w, container.height);
                        totH += container.height;
                    });
                    let spacing = (h - (State.BTN_CREATE_BOT_OFFSET + this._btnCreate.height) - totH) / (this._selBoxes.length + 1);
                    let y = spacing;
                    this._selBoxes.forEach((box) => {
                        box.container.setPosition(0, y);
                        y += box.container.height + spacing;
                    });
                }
            }
            State.BTN_CREATE_BOT_OFFSET = 80;
            State.BTN_DEPTH = 10;
            State.CIRCUIT_SHOP_ICON_W = 320;
            State.CIRCUIT_SHOP_ICON_H = 320;
            State.BATTLE_SPLASH_W = 320;
            State.BATTLE_SPLASH_H = 320;
            Battle.State = State;
        })(Battle = States.Battle || (States.Battle = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Battle;
        (function (Battle) {
            class CircuitSelBoxItem extends Battle.SelBoxItem {
                constructor(owner, pathGraphics, pathCannon) {
                    let scene = Battle.Scene.instance;
                    let container = new Controls.Group.Group(false);
                    super(owner, container);
                    this._events = new Phaser.Events.EventEmitter();
                    let img = scene.add.image(0, 0, "atlas_0", "battle/circuitPanel_0")
                        .setOrigin(0)
                        .setInteractive();
                    img.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer, localX, localY, event) => {
                        event.stopPropagation();
                        this._owner.events.emit(Battle.SelBoxItem.EVENT_TAP, this);
                    }, this);
                    this._panel = container.add(img, 0, 0, 0, true);
                    this._pathGraphics = pathGraphics;
                    this._pathCannon = pathCannon;
                    this._pathRenderTex = scene.add.renderTexture(0, 0, CircuitSelBoxItem.PATH_MAX_WIDTH, CircuitSelBoxItem.PATH_MAX_HEIGHT);
                    container.add(this._pathRenderTex, 41, 41, 0, false);
                    this._vipBadge = container.add(scene.add.image(0, 0, "atlas_0", "gamee/vipBadge").setOrigin(0), 30, 30, 0, false);
                    this._saleBadge = container.add(scene.add.image(0, 0, "atlas_0", "gamee/saleBadge"), -20, 20, 1, false);
                    let btnContent = new Controls.Group.Group();
                    img = scene.add.image(0, 0, "atlas_0", "battle/lock").setOrigin(0, 0.5);
                    img.setScale(CircuitSelBoxItem.PRICE_ICON_HEIGHT / img.height);
                    btnContent.add(img, 0, 0, 8, true);
                    this._priceText = btnContent.add(scene.add.bitmapText(0, 0, "fntText64", "", CircuitSelBoxItem.PRICE_ICON_HEIGHT), btnContent.width + 20, 6, 0, false);
                    img = scene.add.image(0, 0, "atlas_0", "gamee/gem");
                    img.setScale(CircuitSelBoxItem.PRICE_ICON_HEIGHT / img.height)
                        .setOrigin(0, 0.5);
                    this._priceIcon = btnContent.add(img, btnContent.width, 0, 8, true);
                    this._btnBuy = new Controls.Buttons.ContentButton(scene, 0, 0, "atlas_0", "battle/btnCircuit_")
                        .setContent(btnContent);
                    this._btnBuy.events = this._events;
                    this._events.on("btn_click", () => {
                        this._owner.events.emit(Battle.SelBoxItem.EVENT_TAP, this);
                    }, this);
                    container.add(this._btnBuy, 0, -18, 4 | 2, false);
                }
                activate(data) {
                    super.activate(data);
                    let locked = data.battleSettings.locked;
                    this._panel.content.setFrame("battle/circuitPanel_" + (locked ? 0 : 1));
                    if (this._panel.updateGroupOccupationArea())
                        this._container.updatePosition();
                    let circuitOffset = 4;
                    let circuitScale = Math.min((CircuitSelBoxItem.PATH_MAX_WIDTH - circuitOffset * 2) / data.width, (CircuitSelBoxItem.PATH_MAX_HEIGHT - circuitOffset * 2) / data.height);
                    let path = data.pathGenerator(circuitScale);
                    this._pathGraphics
                        .clear()
                        .lineStyle(4, 0xFFFFFF, 0.5);
                    path.draw(this._pathGraphics);
                    this._pathGraphics.lineStyle(2, 0xFFFFFF, 1);
                    path.draw(this._pathGraphics);
                    path.destroy();
                    this._pathRenderTex
                        .clear()
                        .draw(this._pathGraphics, (CircuitSelBoxItem.PATH_MAX_WIDTH - data.width * circuitScale) / 2, (CircuitSelBoxItem.PATH_MAX_HEIGHT - data.height * circuitScale) / 2);
                    this._pathGraphics.clear();
                    data.cannons.forEach((cannon) => {
                        this._pathCannon.setScale(cannon.bgScale / 2);
                        this._pathRenderTex.draw(this._pathCannon, circuitOffset + (cannon.x / data.width) * (CircuitSelBoxItem.PATH_MAX_WIDTH - circuitOffset * 2), circuitOffset + (cannon.y / data.height) * (CircuitSelBoxItem.PATH_MAX_HEIGHT - circuitOffset * 2));
                    }, this);
                    if (locked) {
                        let priceTxt = this._priceText.content;
                        let priceIcon = this._priceIcon.content;
                        let price = data.battleSettings.price;
                        if (price.currency == 2) {
                            priceTxt.setText("");
                            priceIcon.setFrame("gamee/vipBadge");
                            this._priceIcon.setOffsetX(this._priceText.offsetX);
                        }
                        else {
                            priceTxt.setText(data.battleSettings.price.price.toString());
                            priceIcon.setFrame("gamee/" + (price.currency == 1 ? "gem" : "coin"));
                            this._priceIcon.setOffsetX(priceTxt.width + 5 + this._priceText.offsetX);
                        }
                        priceIcon.setScale(CircuitSelBoxItem.PRICE_ICON_HEIGHT / priceIcon.height);
                        this._priceIcon.updateGroupOccupationArea();
                        this._btnBuy.visible = true;
                        this._vipBadge.visible = false;
                        this._saleBadge.visible = price.sale;
                    }
                    else {
                        this._btnBuy.visible = false;
                        this._vipBadge.visible = (data.battleSettings.price.currency == 2);
                        this._saleBadge.visible = false;
                    }
                }
            }
            CircuitSelBoxItem.PATH_MAX_WIDTH = 330;
            CircuitSelBoxItem.PATH_MAX_HEIGHT = 240;
            CircuitSelBoxItem.PRICE_ICON_HEIGHT = 40;
            Battle.CircuitSelBoxItem = CircuitSelBoxItem;
        })(Battle = States.Battle || (States.Battle = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Battle;
        (function (Battle) {
            class ThemeSelBoxItem extends Battle.SelBoxItem {
                constructor(owner) {
                    let scene = Battle.Scene.instance;
                    let container = new Controls.Group.Group(false);
                    super(owner, container);
                    this._events = new Phaser.Events.EventEmitter();
                    let img = scene.add.image(0, 0, "atlas_0", "battle/themePanel_0")
                        .setOrigin(0)
                        .setInteractive();
                    img.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer, localX, localY, event) => {
                        event.stopPropagation();
                        this._owner.events.emit(Battle.SelBoxItem.EVENT_TAP, this);
                    }, this);
                    this._panel = container.add(img, 0, 0, 0, true);
                    this._image = scene.add.image(0, 0, "atlas_0", "")
                        .setOrigin(0);
                    container.add(this._image, 18, 18, 0, false);
                    this._vipBadge = container.add(scene.add.image(0, 0, "atlas_0", "gamee/vipBadge").setOrigin(0).setScale(0.5), 26, 26, 0, false);
                    this._saleBadge = container.add(scene.add.image(0, 0, "atlas_0", "gamee/saleBadge"), -20, 20, 1, false);
                    let btnContent = new Controls.Group.Group();
                    img = scene.add.image(0, 0, "atlas_0", "battle/lock").setOrigin(0, 0.5);
                    img.setScale(ThemeSelBoxItem.PRICE_ICON_HEIGHT / img.height);
                    btnContent.add(img, 0, 0, 8, true);
                    this._priceText = btnContent.add(scene.add.bitmapText(0, 0, "fntText64", "", ThemeSelBoxItem.PRICE_ICON_HEIGHT), btnContent.width + 16, 8, 0, false);
                    img = scene.add.image(0, 0, "atlas_0", "gamee/gem");
                    img.setScale(ThemeSelBoxItem.PRICE_ICON_HEIGHT / img.height)
                        .setOrigin(0, 0.5);
                    this._priceIcon = btnContent.add(img, btnContent.width, 0, 8, true);
                    this._btnBuy = new Controls.Buttons.ContentButton(scene, 0, 0, "atlas_0", "battle/btnTheme_")
                        .setContent(btnContent);
                    this._btnBuy.events = this._events;
                    this._events.on("btn_click", () => { this._owner.events.emit(Battle.SelBoxItem.EVENT_TAP, this); }, this);
                    container.add(this._btnBuy, 0, -18, 4 | 2, false);
                }
                activate(data) {
                    super.activate(data);
                    let locked = data.battleSettings.locked;
                    this._panel.content.setFrame("battle/themePanel_" + (locked ? 0 : 1));
                    if (this._panel.updateGroupOccupationArea())
                        this._container.updatePosition();
                    this._image.setFrame(data.assetPath + "themeIcon");
                    if (locked) {
                        let priceTxt = this._priceText.content;
                        let priceIcon = this._priceIcon.content;
                        let price = data.battleSettings.price;
                        if (price.currency == 2) {
                            priceTxt.setText("");
                            priceIcon.setFrame("gamee/vipBadge");
                            this._priceIcon.setOffsetX(this._priceText.offsetX);
                        }
                        else {
                            priceTxt.setText(data.battleSettings.price.price.toString());
                            priceIcon.setFrame("gamee/gem");
                            this._priceIcon.setOffsetX(priceTxt.width + 4 + this._priceText.offsetX);
                        }
                        priceIcon.setScale(ThemeSelBoxItem.PRICE_ICON_HEIGHT / priceIcon.height);
                        this._priceIcon.updateGroupOccupationArea();
                        this._btnBuy.visible = true;
                        this._vipBadge.visible = false;
                        this._saleBadge.visible = price.sale;
                    }
                    else {
                        this._btnBuy.visible = false;
                        this._vipBadge.visible = (data.battleSettings.price.currency == 2);
                        this._saleBadge.visible = false;
                    }
                }
            }
            ThemeSelBoxItem.PRICE_ICON_HEIGHT = 36;
            Battle.ThemeSelBoxItem = ThemeSelBoxItem;
        })(Battle = States.Battle || (States.Battle = {}));
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
                    this._pressed = false;
                    this._bonus = bonus;
                    this._bonusState = bonus.state;
                    this._container = new Controls.Group.Group(false)
                        .setPosition(x, y);
                    let path = "shop/card";
                    this._bg = scene.add.image(0, 0, "atlas_0", path + "Bg_1_0")
                        .setOrigin(0, 0)
                        .setInteractive();
                    this._bg.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handlePointerDown, this);
                    this._bg.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePointerUp, this);
                    this._bg.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handlePointerOut, this);
                    container.add(this._bg);
                    this._container.add(this._bg, 0, 0, 0, true);
                    let img = scene.add.image(0, 0, "atlas_0", "bonus/iconA_" + bonus.shortName);
                    container.add(img);
                    this._container.add(img, 56, 56, 0, false);
                    let txt = scene.add.bitmapText(0, 0, "fntText32", bonus.shortName.toUpperCase(), 32);
                    container.add(txt);
                    this._container.add(txt, (BonusCard.WIDTH - txt.width) / 2, 130, 0, false);
                    txt = scene.add.bitmapText(0, 0, "fntText32", "", 32)
                        .setTint(0xffb901);
                    this._price = this._container.add(txt, 0, 170, 0, false);
                    container.add(txt);
                    img = scene.add.image(0, 0, "atlas_0", "gamee/video")
                        .setOrigin(0.5);
                    img.setScale(32 / img.height);
                    this._priceIcon = this._container.add(img, 0, 180, 0, false);
                    container.add(img);
                    this.updateBonusState();
                }
                get bonus() { return this._bonus; }
                update() {
                    if (this._bonus.state != this._bonusState) {
                        this.updateBonusState();
                        return this._bonusState == 2;
                    }
                    else if (this._bonusState == 2) {
                        return this.updateBonusRemActTime();
                    }
                }
                setPosition(x, y) {
                    this._container.setPosition(x, y);
                }
                updateBonusState() {
                    let bnsState = this._bonus.state;
                    this._bonusState = bnsState;
                    this.updateBg();
                    if (bnsState == 2) {
                        this._price.visible = true;
                        this._priceIcon.visible = false;
                        this.updateBonusRemActTime();
                    }
                    else {
                        this._price.visible = false;
                        this._priceIcon
                            .setOffsetX(BonusCard.WIDTH / 2)
                            .setVisible(true);
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
                        let bmTxt = this._price.content;
                        bmTxt.setText(min + ":" + sec);
                        this._price.setOffsetX((BonusCard.WIDTH - bmTxt.width) / 2);
                        return true;
                    }
                    else {
                        this.updateBonusState();
                        return false;
                    }
                }
                updateBg() {
                    let path = "shop/cardBg_";
                    if (this._bonusState == 1) {
                        this._bg.setFrame(path + "1_" + (this._pressed ? "1" : "0"));
                    }
                    else {
                        this._bg.setFrame(path + "2");
                    }
                }
                handlePointerDown(pointer, localX, localY, event) {
                    event.stopPropagation();
                    if (this._bonusState == 1) {
                        this._pressed = true;
                        this.updateBg();
                    }
                }
                handlePointerUp(pointer, localX, localY, event) {
                    event.stopPropagation();
                    if (!this._pressed)
                        return;
                    this._pressed = false;
                    this.updateBg();
                    this._scene.events.emit(BonusCard.EVENT_CLICK, this);
                }
                handlePointerOut() {
                    if (this._pressed) {
                        this._pressed = false;
                        this.updateBg();
                    }
                }
            }
            BonusCard.WIDTH = 112;
            BonusCard.HEIGHT = 218;
            BonusCard.EVENT_CLICK = "bnsCardClick";
            Shop.BonusCard = BonusCard;
        })(Shop = States.Shop || (States.Shop = {}));
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
                }
                update(time, delta) {
                    Shop.State.instance.update(delta);
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
                    super(2);
                    State._instance = this;
                    Game.game.scene.add("shop", Shop.Scene);
                    this._actBnsCards = new Collections.NodeList();
                }
                static get instance() { return State._instance; }
                activate(prevState, data) {
                    let gameplay = States.states.getState(1);
                    if (prevState != 1 && prevState != 3) {
                        gameplay.activate(prevState, null);
                        gameplay.deactivate(2);
                    }
                    else {
                        gameplay.reset();
                    }
                    if (!this._scene) {
                        this._scene = Game.game.scene.getScene("shop");
                        this._scene.events.on(Phaser.Scenes.Events.CREATE, this.handleSceneCreate, this);
                    }
                    Game.game.scene.run("shop");
                    let camera = this._scene.cameras.main;
                    camera.removeListener(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, undefined, this);
                    camera.resetFX();
                    if (prevState != 0)
                        camera.fadeIn(250, 0xFF, 0xFF, 0xFF);
                    this._time = 0;
                    this._actBnsCards.clear();
                    this._bnsCards.forEach((card) => {
                        if (card.bonus.state == 2)
                            this._actBnsCards.add(card);
                    }, this);
                    if (!this._actBnsCards.empty)
                        this.createActBonusCardsUpdateEvent();
                    this._mode = 0;
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                }
                deactivate(newState) {
                    Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    if (this._actBnsCardsUpdateEv) {
                        this._actBnsCardsUpdateEv.remove(false);
                        this._actBnsCardsUpdateEv = null;
                    }
                    this._scene.sys.sleep();
                    if (newState != 1)
                        States.states.getState(1).deactivate(newState);
                }
                update(delta) {
                    if (Gamee2.Gamee.initialized && !Game.gameeGameReady)
                        Game.game.gameeGameReady(this._scene);
                    this._time += delta;
                    this._tapToPlay.visible = (Math.floor(this._time / 500) & 1) != 0;
                    if (this._lblCustomize) {
                        let t = (this._time % 1500) / 750;
                        if (t > 1)
                            t = 1 - (t - 1);
                        this._lblCustomize.setPosition(this._btnBattle.x - 20 - 25 * t, this._btnBattle.y + this._btnBattle.height / 2);
                    }
                }
                createActBonusCardsUpdateEvent() {
                    this._actBnsCardsUpdateEv = this._scene.time.addEvent({
                        delay: 1000,
                        loop: true,
                        callback: this.handleUpdateActBonusCards,
                        callbackScope: this
                    });
                }
                goToNextState(state) {
                    if (this._mode == 0) {
                        this._mode = 1;
                        let camera = this._scene.cameras.main;
                        camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { States.states.setCurState(state); });
                        camera.fadeOut(250, 0xFF, 0xFF, 0xFF);
                    }
                }
                activateBonus(card) {
                    card.bonus.activate();
                    card.update();
                    this._actBnsCards.add(card);
                    if (!this._actBnsCardsUpdateEv)
                        this.createActBonusCardsUpdateEvent();
                }
                handleSceneCreate(scene) {
                    this._bgOverlay = scene.add.graphics();
                    this._tapToPlay = scene.add.bitmapText(0, 0, "fntText64", "TAP TO PLAY", 64)
                        .setVisible(false);
                    if (Game.settings.gameMode == 0 && (!Gamee2.Gamee.initialized || (Gamee2.Gamee.initData.platform != "web" && Gamee2.Gamee.initData.platform != "mobile_web"))) {
                        this._btnBattle = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "shop/btnBattle_");
                        this._lblCustomize = scene.add.image(0, 0, "atlas_0", "shop/lblCustomize").setOrigin(1, 0.5);
                    }
                    this._bnsCardsContainer = scene.add.container(0, 0).setSize(scene.cameras.main.width, Shop.BonusCard.HEIGHT);
                    this._bnsCards = [];
                    Game.bonuses.forEach((bonus) => {
                        this._bnsCards.push(new Shop.BonusCard(scene, this._bnsCardsContainer, 0, 0, bonus));
                    }, this);
                    scene.events.on("btn_click", this.handleButtonClick, this);
                    scene.events.on(Shop.BonusCard.EVENT_CLICK, this.handleBonusCardClick, this);
                    scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => { this.goToNextState(1); });
                }
                handleUpdateActBonusCards() {
                    this._actBnsCards.forEach((card, node) => {
                        if (!card.update()) {
                            this._actBnsCards.removeByNode(node);
                        }
                    }, this);
                }
                showAd(card) {
                    Gamee2.Gamee.showAd((res) => {
                        if (res) {
                            this.activateBonus(card);
                            Gamee2.Gamee.logEvent("PURCHASE_BONUS", card.bonus.longName.toUpperCase());
                        }
                    }, this);
                }
                handleBonusCardClick(card) {
                    if (this._mode != 0)
                        return;
                    Game.game.sound.playAudioSprite("sfx", "click");
                    if (Gamee2.Gamee.ready) {
                        if (!Gamee2.Gamee.adReady) {
                            if (Gamee2.Gamee.loadAd((res) => {
                                this._mode = 0;
                                this.showAd(card);
                            }, this)) {
                                this._mode = 2;
                            }
                        }
                        else {
                            this.showAd(card);
                        }
                    }
                    else {
                        this.activateBonus(card);
                    }
                }
                handleButtonClick(button) {
                    Game.game.sound.playAudioSprite("sfx", "click");
                    this.goToNextState(4);
                }
                handleResChange(w, h) {
                    this._scene.cameras.main.setSize(w, h);
                    this._bgOverlay
                        .clear()
                        .fillStyle(0, 0.4)
                        .fillRect(0, 0, w, h);
                    this._tapToPlay.setPosition((w - this._tapToPlay.width) / 2, (h - this._tapToPlay.height) / 2);
                    if (this._btnBattle)
                        this._btnBattle.setPosition(w - this._btnBattle.width - 20, 20);
                    this._bnsCardsContainer.width = w;
                    this._bnsCardsContainer.y = h - this._bnsCardsContainer.height;
                    let spacing = (w - (Shop.BonusCard.WIDTH * Game.bonuses.length)) / (Game.bonuses.length + 1);
                    let x = spacing;
                    this._bnsCards.forEach((card) => {
                        card.setPosition(x, 0);
                        x += Shop.BonusCard.WIDTH + spacing;
                    });
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
                update(time, delta) {
                    ExtraLife.State.instance.update(delta);
                }
            }
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
                    State._instance = this;
                    Game.game.scene.add("extraLife", ExtraLife.Scene);
                }
                static get instance() { return State._instance; }
                activate(prevState, data) {
                    if (!this._scene) {
                        this._scene = Game.game.scene.getScene("extraLife");
                        this._scene.events.on(Phaser.Scenes.Events.CREATE, this.handleSceneCreate, this);
                    }
                    Game.game.scene.run("extraLife");
                    this._content.visible = true;
                    this._tapToPlay.visible = false;
                    this._mode = 0;
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                }
                deactivate(newState) {
                    let camera = this._scene.cameras.main;
                    camera.removeListener(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, undefined, this);
                    camera.resetFX();
                    Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this._scene.sys.sleep();
                }
                update(delta) {
                    if (this._mode == 2) {
                        this._timer += delta;
                        this._tapToPlay.visible = (Math.floor(this._timer / 500) & 1) == 0;
                    }
                }
                revivePlayer() {
                    let camera = this._scene.cameras.main;
                    camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { States.states.setCurState(1); });
                    camera.fadeOut(250, 0xFF, 0xFF, 0xFF);
                }
                handleSceneCreate(scene) {
                    this._bgOverlay = scene.add.graphics();
                    if (State.EXTRA_LIFE_CURRENCY == 3) {
                        this._tapToPlay = scene.add.bitmapText(0, 0, "fntText64", "TAP TO PLAY", 64)
                            .setVisible(false);
                        scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
                            if (this._mode == 2)
                                this.revivePlayer();
                        });
                    }
                    this._content = new Controls.Group.Group();
                    this._content.add(scene.add.image(0, 0, "atlas_0", "extraLife/txtExtraLife").setOrigin(0.5, 0), 0, 0, 4, true);
                    let btnContent = new Controls.Group.Group();
                    if (State.EXTRA_LIFE_CURRENCY == 0) {
                        btnContent.add(scene.add.bitmapText(0, 0, "fntText64", State.EXTRA_LIFE_PRICE.toString(), 64), 0, 5, 0, true);
                        btnContent.add(scene.add.image(0, 0, "atlas_0", "gamee/coin").setOrigin(0, 0.5), btnContent.width + 5, 0, 8, true);
                    }
                    else {
                        btnContent.add(scene.add.image(0, 0, "atlas_0", "gamee/video").setOrigin(0, 0.5), 0, 0, 8, true);
                        btnContent.add(scene.add.bitmapText(0, 0, "fntText64", "YES", 64), btnContent.width + 5, 6, 0, true);
                    }
                    this._btnBuy = new Controls.Buttons.ContentButton(scene, 0, 0, "atlas_0", "commonUI/btnMiddle_")
                        .setContent(btnContent);
                    this._btnBuy.setId(0);
                    this._content.add(this._btnBuy, 0, 140, 4, true);
                    this._content.add(new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "extraLife/btnCancel_").setId(1), 0, 290, 4, true);
                    scene.events.on("btn_click", this.handleButtonClick, this);
                }
                handleButtonClick(button) {
                    if (this._mode != 0)
                        return;
                    Game.game.sound.playAudioSprite("sfx", "click");
                    switch (button.id) {
                        case 0: {
                            if (Gamee2.Gamee.ready) {
                                if (State.EXTRA_LIFE_CURRENCY == 0) {
                                    Gamee2.Gamee.purchaseItem(State.EXTRA_LIFE_PRICE, 0, "EXTRA LIFE", Game.game.textures.getBase64("atlas_0", "extraLife"), true, (res) => {
                                        if (res)
                                            this.revivePlayer();
                                    }, this);
                                }
                                else {
                                    Gamee2.Gamee.showAd((res) => {
                                        if (res) {
                                            this._mode = 2;
                                            this._timer = 0;
                                            this._content.visible = false;
                                        }
                                    }, this);
                                }
                            }
                            else {
                                this.revivePlayer();
                            }
                            break;
                        }
                        case 1: {
                            Game.game.gameOver();
                            break;
                        }
                    }
                }
                handleResChange(w, h) {
                    this._scene.cameras.main.setSize(w, h);
                    this._bgOverlay
                        .clear()
                        .fillStyle(0, 0.4)
                        .fillRect(0, 0, w, h);
                    this._content.setPosition((w - this._content.width) / 2, (h - this._content.height) / 2);
                    this._tapToPlay.setPosition((w - this._tapToPlay.width) / 2, (h - this._tapToPlay.height) / 2);
                }
            }
            State.EXTRA_LIFE_PRICE = 5;
            State.EXTRA_LIFE_CURRENCY = 3;
            ExtraLife.State = State;
        })(ExtraLife = States.ExtraLife || (States.ExtraLife = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Bonus;
            (function (Bonus_2) {
                class Bonus {
                    constructor(manager, type, duration) {
                        this._manager = manager;
                        this._type = type;
                        this._duration = duration;
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
                    reset() {
                        if (this._active)
                            this.deactivate();
                    }
                    activate() {
                        this._actTime = Gameplay.timer.time;
                        let active = this._active;
                        if (this._duration > 0)
                            this._active = true;
                        Game.game.sound.playAudioSprite("sfx", "bonusPickup");
                        this._manager.events.emit(Bonus.EVENT_ACTIVATED, this, active);
                        this._manager.events.emit(Bonus.EVENT_ACTIVATED + this._type, this, active);
                        return true;
                    }
                    cancel(remTime) {
                        if (!this._active)
                            return;
                        if (remTime > 0) {
                            if (remTime < this.remActTime)
                                this._actTime = Gameplay.timer.time - this._duration + remTime;
                        }
                        else {
                            this.deactivate();
                        }
                    }
                    update() {
                        if (this._active && Gameplay.timer.time > this._actTime + this._duration)
                            this.deactivate();
                    }
                    deactivate() {
                        this._active = false;
                        this._manager.events.emit(Bonus.EVENT_DEACTIVATED, this);
                        this._manager.events.emit(Bonus.EVENT_DEACTIVATED + this._type, this);
                    }
                }
                Bonus.EVENT_ACTIVATED = "act";
                Bonus.EVENT_DEACTIVATED = "deact";
                Bonus_2.Bonus = Bonus;
            })(Bonus = Gameplay.Bonus || (Gameplay.Bonus = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Bonus;
            (function (Bonus) {
                class Manager {
                    constructor() {
                        this._bonuses = [
                            new Bonus.Bonus(this, 0, 5000),
                            new Bonus.Bonus(this, 1, 10000),
                            new Bonus.Bonus(this, 2, 5000),
                            new Bonus.Bonus(this, 3, 3000),
                            new Bonus.Bonus(this, 4, 5000),
                        ];
                        this._events = new Phaser.Events.EventEmitter();
                        this._events.on(Bonus.Bonus.EVENT_ACTIVATED, this.handleBonusActivation, this);
                        this._actBonuses = new Collections.NodeList();
                        this._freePickupNames = new Collections.Pool(Bonus.PickupName, 1, true);
                        this._actPickupNames = new Collections.NodeList();
                    }
                    get events() { return this._events; }
                    get selectableBonusCnt() { return this._selBonuses.length; }
                    reset() {
                        this._actBonuses.forEach((bonus) => { bonus.reset(); });
                        this._actBonuses.clear();
                        this._actBonusMask = 0;
                    }
                    resetPickupFxs() {
                        this._actPickupNames.forEach((name) => {
                            name.kill();
                            this._freePickupNames.returnItem(name);
                        }, this);
                        this._actPickupNames.clear();
                    }
                    resetSelectableBonuses() {
                        this._selBonuses = [];
                        Game.bonuses.forEach((bonus) => {
                            if (bonus.state == 2)
                                this._selBonuses.push(new Bonus.SelectableBonus(bonus));
                        }, this);
                    }
                    update() {
                        this._actBonuses.forEach((bonus, node) => {
                            bonus.update();
                            if (!bonus.active) {
                                this._actBonuses.removeByNode(node);
                                this._actBonusMask &= ~(1 << bonus.type);
                            }
                        }, this);
                        this._actPickupNames.forEach((item, node) => {
                            if (!item.update())
                                this._freePickupNames.returnItem(this._actPickupNames.removeByNode(node));
                        }, this);
                    }
                    selectBonus() {
                        let i = this._selBonuses.length;
                        if (i == 0)
                            return null;
                        let totP = 0;
                        while (i-- != 0)
                            totP += this._selBonuses[i].priority;
                        let p = Phaser.Math.RND.integerInRange(1, totP);
                        let bonus = null;
                        i = this._selBonuses.length;
                        while (i-- != 0) {
                            if (bonus == null) {
                                let bp = this._selBonuses[i].priority;
                                if (bp >= p) {
                                    bonus = this._selBonuses[i].bonus;
                                    this._selBonuses[i].resetPriority();
                                }
                                else {
                                    p -= bp;
                                    this._selBonuses[i].incPriority();
                                }
                            }
                            else {
                                this._selBonuses[i].incPriority();
                            }
                        }
                        return bonus;
                    }
                    isBonusActive(type) {
                        return (this._actBonusMask & (1 << type)) != 0;
                    }
                    getBonus(type) {
                        return this._bonuses[type];
                    }
                    handleBonusActivation(bonus, prevState) {
                        if (bonus.active && !prevState) {
                            this._actBonusMask |= (1 << bonus.type);
                            this._actBonuses.add(bonus);
                        }
                        let i = this._selBonuses.length;
                        if (i > 1) {
                            while (i-- != 0) {
                                if (this._selBonuses[i].bonus.type == bonus.type) {
                                    this._selBonuses[i].nullPriority();
                                    break;
                                }
                            }
                        }
                        let name = this._freePickupNames.getItem();
                        let pl = Gameplay.State.instance.player;
                        name.show(Game.bonuses[bonus.type].longName.toUpperCase(), pl.x, pl.y);
                        this._actPickupNames.add(name);
                    }
                }
                Bonus.Manager = Manager;
            })(Bonus = Gameplay.Bonus || (Gameplay.Bonus = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Bonus;
            (function (Bonus) {
                class IconPanel {
                    constructor(bonusManager) {
                        this._container = new Controls.Group.Group(true)
                            .setDepth(200)
                            .setPosition(10, 10);
                        this._freeIcons = new Collections.Pool(undefined, 0, true, () => {
                            return new Icon(this._container);
                        }, this);
                        this._actIcons = new Collections.NodeList();
                        this._actSlotsMask = 0;
                        bonusManager.events.on(Bonus.Bonus.EVENT_ACTIVATED, this.handleBonusActivated, this);
                    }
                    reset() {
                        this._actIcons.forEach((icon) => {
                            icon.reset();
                            this._freeIcons.returnItem(icon);
                        });
                        this._actSlotsMask = 0;
                    }
                    update() {
                        this._actIcons.forEach((icon, node) => {
                            if (!icon.update()) {
                                this._freeIcons.returnItem(this._actIcons.removeByNode(node));
                                this._actSlotsMask &= ~(1 << icon.slotId);
                            }
                        }, this);
                    }
                    handleBonusActivated(bonus, prevState) {
                        if (prevState)
                            return;
                        let slotId = 0;
                        while ((this._actSlotsMask & (1 << slotId)) != 0)
                            slotId++;
                        this._actSlotsMask |= (1 << slotId);
                        let icon = this._freeIcons.getItem();
                        icon.activate(bonus, slotId);
                        this._actIcons.add(icon);
                    }
                }
                IconPanel.SLOT_W = 100;
                IconPanel.SLOT_H = 86;
                Bonus.IconPanel = IconPanel;
                class Icon {
                    get bonus() { return this._bonus; }
                    get slotId() { return this._slotId; }
                    constructor(container) {
                        let img = Gameplay.Scene.instance.add.image(0, 0, "atlas_0")
                            .setVisible(false)
                            .setScrollFactor(0);
                        this._icon = container.add(img, 0, IconPanel.SLOT_H / 2, 0, false);
                    }
                    reset() {
                        this._icon.visible = false;
                    }
                    activate(bonus, slotId) {
                        this._bonus = bonus;
                        this._slotId = slotId;
                        this._icon.content.setFrame("bonus/iconB_" + Game.bonuses[bonus.type].shortName);
                        this._icon
                            .setOffsetX((slotId * IconPanel.SLOT_W) + (IconPanel.SLOT_W / 2))
                            .setVisible(true);
                    }
                    update() {
                        if (!this._bonus.active) {
                            this.reset();
                            return false;
                        }
                        let time = this._bonus.remActTime;
                        if (time < 1500) {
                            time = 1500 - time;
                            this._icon.visible = (Math.floor(time / (250 - (150 * (time / 1500)))) & 1) != 0;
                        }
                        return true;
                    }
                }
            })(Bonus = Gameplay.Bonus || (Gameplay.Bonus = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Bonus;
            (function (Bonus) {
                class PickupName extends PopupMessage.MessageBase {
                    constructor() {
                        if (!PickupName.TYPE)
                            PickupName.TYPE = new PopupMessage.MessageType(100, 750, Phaser.Math.Easing.Cubic.Out, 0, 750, Phaser.Math.Easing.Cubic.In);
                        super();
                        this._container = Gameplay.Scene.instance.add.bitmapText(0, 0, "fntText32", "", 32)
                            .setDepth(20)
                            .setOrigin(0.5)
                            .setVisible(false);
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
                Bonus.PickupName = PickupName;
            })(Bonus = Gameplay.Bonus || (Gameplay.Bonus = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Bonus;
            (function (Bonus) {
                class SelectableBonus {
                    constructor(bonus) {
                        this._bonus = bonus;
                        this._priority = bonus.priority;
                    }
                    get bonus() { return this._bonus; }
                    get priority() { return this._priority; }
                    resetPriority() {
                        this._priority = this._bonus.priority;
                    }
                    nullPriority() {
                        this._priority = 0;
                    }
                    incPriority() {
                        this._priority += this._bonus.priority;
                    }
                }
                Bonus.SelectableBonus = SelectableBonus;
            })(Bonus = Gameplay.Bonus || (Gameplay.Bonus = {}));
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
                        constructor(type, bonus, player, container) {
                            this._type = type;
                            this._player = player;
                            this._bonus = bonus;
                            this._sprite = Gameplay.Scene.instance.add.image(0, 0, "atlas_0", "plOverlay/" + Game.bonuses[bonus.type].shortName);
                            this._spriteGroupItem = container.add(this._sprite, 0, 0, 0, false);
                            this.reset();
                        }
                        get bonus() { return this._bonus; }
                        get active() { return this._state >= 0; }
                        reset() {
                            this._spriteGroupItem.visible = false;
                            this._state = -1;
                        }
                        show() {
                            this._state = 0;
                            this._spriteGroupItem.visible = true;
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
                    class Shield extends Overlays.Overlay {
                        constructor(player, container) {
                            super(0, Gameplay.State.instance.bonuses.getBonus(0), player, container);
                        }
                        show() {
                            super.show();
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
                    constructor() {
                        this._container = new Controls.Group.Group(true)
                            .setDepth(100);
                        this._sprite = this._container.add(Gameplay.Scene.instance.add.sprite(0, 0, "atlas_0", Game.settings.theme.assetPath + "player/player_0"), 0, 0, 0, false);
                        let plSettings = Game.settings.theme.player;
                        if (plSettings.frameCnt > 1) {
                            Gameplay.Scene.instance.anims.create({
                                key: Player.ANIM_KEY,
                                frames: Gameplay.Scene.instance.anims.generateFrameNames("atlas_0", { prefix: Game.settings.theme.assetPath + "player/player_", end: plSettings.frameCnt - 1 }),
                                frameRate: plSettings.frameRate,
                                repeat: -1
                            });
                        }
                        this._overlays = [
                            new Player_1.Overlays.Shield(this, this._container)
                        ];
                        this._actOverlays = new Collections.NodeList();
                        this._pathPosVec = new Phaser.Math.Vector2(0, 0);
                        Gameplay.State.instance.bonuses.events.on(Gameplay.Bonus.Bonus.EVENT_ACTIVATED + 0, this.handleShieldActivation, this);
                        Gameplay.State.instance.bonuses.events.on(Gameplay.Bonus.Bonus.EVENT_ACTIVATED + 4, this.handleExtraSpeedActivation, this);
                        Gameplay.State.instance.bonuses.events.on(Gameplay.Bonus.Bonus.EVENT_DEACTIVATED + 4, this.handleExtraSpeedDeactivation, this);
                    }
                    get state() { return this._state; }
                    get pathPos() { return this._pathPos; }
                    get pathPrevPos() { return this._pathPrevPos; }
                    get pathDir() { return this._pathDir; }
                    get x() { return this._container.x; }
                    get y() { return this._container.y; }
                    activate() {
                        if (!this._container.visible) {
                            this._container.visible = true;
                            if (!Game.settings.circuit.lockedCamera)
                                Gameplay.Scene.instance.cameras.main.startFollow(this._sprite.content);
                            Gameplay.Scene.instance.input.on(Phaser.Input.Events.POINTER_DOWN, this.flipDir, this);
                        }
                    }
                    deactivate() {
                        if (this._container.visible) {
                            this._container.visible = false;
                            if (!Game.settings.circuit.lockedCamera)
                                Gameplay.Scene.instance.cameras.main.stopFollow();
                            Gameplay.Scene.instance.input.off(Phaser.Input.Events.POINTER_DOWN, this.flipDir, this);
                        }
                    }
                    reset() {
                        this.resetSprite();
                        this._actOverlays.forEach((overlay) => { overlay.reset(); });
                        this._actOverlays.clear();
                        this._pathDir = 1;
                        this._pathMoveSpeed = (1 / 60) / (Gameplay.State.instance.path.getLength() / Game.settings.circuit.speed);
                        if (Gameplay.State.instance.bonuses.isBonusActive(4)) {
                            this._pathMoveSpeedBackup = this._pathMoveSpeed;
                            this._pathMoveSpeed *= 1.5;
                        }
                        this._pathPos = this._pathPrevPos = Game.settings.circuit.startPos;
                        this.updatePosition();
                        this._state = 0;
                    }
                    revive() {
                        this.resetSprite();
                        this._state = 0;
                        Gameplay.Scene.instance.events.emit(Player.EVENT_REVIVE, this);
                    }
                    update() {
                        if (this._container.visible) {
                            if (this._state == 0) {
                                this.processFlight();
                            }
                            else if (this._state == 1) {
                                this.processExplosion();
                            }
                            this._actOverlays.forEach((overlay, node) => {
                                if (!overlay.update())
                                    this._actOverlays.removeByNode(node);
                            }, this);
                        }
                    }
                    getFuturePosition(timeOffset) {
                        let t = Helpers.MathUtils.mod(this._pathPos + (this._pathMoveSpeed * (timeOffset / 1000 * 60)) * this._pathDir, 1);
                        return Gameplay.State.instance.path.getPoint(t, this._pathPosVec);
                    }
                    handleBulletCollision(bullet) {
                        let shield = Gameplay.State.instance.bonuses.isBonusActive(0);
                        if (!shield) {
                            this._time = Gameplay.timer.time;
                            this._state = 1;
                            this._sprite.content.anims.stop();
                            Game.game.sound.playAudioSprite("sfx", "crash");
                        }
                        else {
                            bullet.destroy();
                            if (shield)
                                Gameplay.State.instance.bonuses.getBonus(0).cancel(500);
                            Game.game.sound.playAudioSprite("sfx", "shieldHit");
                        }
                    }
                    resetSprite() {
                        this._container.alpha = 1;
                        let sprite = this._sprite.content;
                        sprite.setScale(1);
                        if (Game.game.anims.exists(Player.ANIM_KEY))
                            sprite.play(Player.ANIM_KEY);
                    }
                    flipDir() {
                        if (this._state == 0) {
                            this._pathDir *= -1;
                            Game.game.sound.playAudioSprite("sfx", "changeDir");
                        }
                    }
                    processFlight() {
                        this._pathPrevPos = this._pathPos;
                        this._pathPos = Helpers.MathUtils.mod(this._pathPos + (this._pathMoveSpeed * this._pathDir * Gameplay.timer.delta), 1);
                        this.updatePosition();
                    }
                    processExplosion() {
                        let progress = (Gameplay.timer.time - this._time) / 1000;
                        if (progress >= 1) {
                            this._state = 2;
                            Gameplay.Scene.instance.events.emit(Player.EVENT_DEATH, this);
                        }
                        else {
                            progress = Phaser.Math.Easing.Cubic.Out(progress);
                            this._container.alpha = 1 - progress;
                            this._sprite.content.setScale(progress + 1);
                        }
                    }
                    updatePosition() {
                        let path = Gameplay.State.instance.path;
                        path.getPoint(this._pathPos, this._pathPosVec);
                        this._container.setPosition(this._pathPosVec.x, this._pathPosVec.y);
                        let sprite = this._sprite.content;
                        path.getPoint(Helpers.MathUtils.mod(this._pathPos - (this._pathMoveSpeed * this._pathDir), 1), this._pathPosVec);
                        sprite.rotation = Phaser.Math.Angle.Between(this._pathPosVec.x, this._pathPosVec.y, this._container.x, this._container.y);
                        sprite.flipY = (this._pathDir < 0);
                    }
                    getBonusOverlay(bonus) {
                        let i = this._overlays.length;
                        while (i-- != 0)
                            if (this._overlays[i].bonus == bonus)
                                return this._overlays[i];
                        return undefined;
                    }
                    showBonusOverlay(bonus) {
                        let overlay = this.getBonusOverlay(bonus);
                        if (overlay) {
                            if (!overlay.active) {
                                this._actOverlays.add(overlay.show());
                            }
                            else {
                                overlay.reactivate();
                            }
                        }
                    }
                    handleShieldActivation(bonus, prevState) {
                        this.showBonusOverlay(bonus);
                    }
                    handleExtraSpeedActivation(bonus, prevState) {
                        if (!prevState) {
                            this._pathMoveSpeedBackup = this._pathMoveSpeed;
                            this._pathMoveSpeed *= 1.5;
                        }
                    }
                    handleExtraSpeedDeactivation() {
                        this._pathMoveSpeed = this._pathMoveSpeedBackup;
                    }
                }
                Player.EVENT_DEATH = "plDeath";
                Player.EVENT_REVIVE = "plRevive";
                Player.COLLISION_RADIUS = 16;
                Player.ANIM_KEY = "player";
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
            var Cannon;
            (function (Cannon) {
                class Bullet {
                    constructor() {
                        if (!Bullet._stateProcessFnc) {
                            Bullet._stateProcessFnc = [
                                this.processFly,
                                this.processDestroy
                            ];
                        }
                        let scene = Gameplay.Scene.instance;
                        this._tail = scene.add.image(0, 0, "atlas_0")
                            .setVisible(false)
                            .setOrigin(1, 0.5)
                            .setDepth(20);
                        this._sprite = scene.add.image(0, 0, "atlas_0")
                            .setVisible(false)
                            .setDepth(20);
                        this._mode = -1;
                        this._type = -1;
                    }
                    get mode() { return this._mode; }
                    reset() {
                        this._sprite.setVisible(false);
                        this._tail.setVisible(false);
                    }
                    activate(cannon, mode, type, dir, speed) {
                        this._time = Gameplay.timer.time;
                        dir = dir;
                        speed /= 60;
                        this._stepX = Math.cos(dir) * speed;
                        this._stepY = Math.sin(dir) * speed;
                        if (this._mode != mode || this._type != type) {
                            this._mode = mode;
                            this._type = type;
                            if (mode == 0) {
                                let path = Game.settings.theme.assetPath + "cannon/";
                                this._sprite.setFrame(path + "bullet_" + type);
                                this._tail.setFrame(path + "tail_" + type)
                                    .setVisible(true);
                            }
                            else {
                                let path = "bonus/bullet";
                                this._sprite.setFrame(path + "_" + Game.bonuses[type].shortName);
                                this._tail.visible = false;
                            }
                        }
                        this._sprite
                            .setPosition(cannon.x, cannon.y)
                            .setAlpha(1)
                            .setScale(1)
                            .setVisible(true);
                        if (mode == 0) {
                            this._tail
                                .setPosition(cannon.x, cannon.y)
                                .setAlpha(0)
                                .setRotation(dir)
                                .setVisible(true);
                        }
                        this._state = 0;
                        return this;
                    }
                    destroy() {
                        if (this._state == 0) {
                            this._state = 1;
                            this._time = Gameplay.timer.time;
                        }
                    }
                    update() {
                        return Bullet._stateProcessFnc[this._state].call(this);
                    }
                    processFly() {
                        let x = this._sprite.x + this._stepX * Gameplay.timer.delta;
                        let y = this._sprite.y + this._stepY * Gameplay.timer.delta;
                        let camera = Gameplay.Scene.instance.cameras.main;
                        let deadZoneW = camera.width / 2;
                        let deadZoneH = camera.height / 2;
                        if (x - Bullet.BULLET_RADIUS >= camera.scrollX + camera.width + deadZoneW || x + Bullet.BULLET_RADIUS <= camera.scrollX - deadZoneW ||
                            y - Bullet.BULLET_RADIUS >= camera.scrollY + camera.height + deadZoneH || y + Bullet.BULLET_RADIUS <= camera.scrollY - deadZoneH) {
                            this.reset();
                            return false;
                        }
                        this._tail.alpha = Math.min(1, (Gameplay.timer.time - this._time) / 300);
                        this._sprite.setPosition(x, y);
                        this._tail.setPosition(x, y);
                        let pl = Gameplay.State.instance.player;
                        if (pl.state == 0) {
                            let plX = pl.x;
                            let plY = pl.y;
                            if (Math.abs(plX - x) <= Gameplay.Player.Player.COLLISION_RADIUS + Bullet.BULLET_RADIUS && Math.abs(plY - y) <= Gameplay.Player.Player.COLLISION_RADIUS + Bullet.BULLET_RADIUS) {
                                if (Phaser.Math.Distance.Between(plX, plY, x, y) <= Gameplay.Player.Player.COLLISION_RADIUS + Bullet.BULLET_RADIUS) {
                                    if (this._mode == 0) {
                                        pl.handleBulletCollision(this);
                                    }
                                    else {
                                        Gameplay.State.instance.bonuses.getBonus(this._type).activate();
                                        this.destroy();
                                    }
                                }
                            }
                        }
                        return true;
                    }
                    processDestroy() {
                        let progress = (Gameplay.timer.time - this._time) / 750;
                        if (progress >= 1) {
                            this.reset();
                            return false;
                        }
                        progress = Phaser.Math.Easing.Cubic.Out(progress);
                        this._sprite
                            .setScale(1 + progress)
                            .setAlpha(1 - progress);
                        if (this._tail.visible)
                            this._tail.alpha = Math.min(this._sprite.alpha, this._tail.alpha);
                        return true;
                    }
                }
                Bullet.BULLET_RADIUS = 11;
                Bullet.BONUS_RADIUS = 11;
                Cannon.Bullet = Bullet;
            })(Cannon = Gameplay.Cannon || (Gameplay.Cannon = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Cannon;
            (function (Cannon_1) {
                class Cannon {
                    constructor(manager, freeBullets, actBullets) {
                        this._manager = manager;
                        this._bg = Gameplay.Scene.instance.add.image(0, 0, "atlas_0")
                            .setDepth(5)
                            .setVisible(false);
                        this._sprite = Gameplay.Scene.instance.add.image(0, 0, "atlas_0")
                            .setDepth(5)
                            .setVisible(false);
                        this._freeBullets = freeBullets;
                        this._actBullets = actBullets;
                    }
                    get x() { return this._sprite.x; }
                    get y() { return this._sprite.y; }
                    activate(cannon) {
                        this._settings = cannon;
                        let path = Gameplay.State.instance.path;
                        let x = cannon.x + path.offsetX;
                        let y = cannon.y + path.offsetY;
                        this._bg
                            .setFrame(Game.settings.theme.assetPath + "cannon/cannonBg")
                            .setPosition(x, y)
                            .setScale(cannon.bgScale)
                            .setVisible(true);
                        this._sprite
                            .setFrame(Game.settings.theme.assetPath + "cannon/cannon_" + Phaser.Math.RND.integerInRange(0, Game.settings.theme.cannonVerCnt - 1))
                            .setPosition(x, y)
                            .setVisible(true);
                        Gameplay.State.instance.bonuses.events.on(Gameplay.Bonus.Bonus.EVENT_ACTIVATED + 3, this.handleBnsDestroyBullets, this);
                        return this;
                    }
                    deactivate() {
                        this._bg.visible = false;
                        this._sprite.visible = false;
                        Gameplay.State.instance.bonuses.events.off(Gameplay.Bonus.Bonus.EVENT_ACTIVATED + 3, this.handleBnsDestroyBullets, this);
                    }
                    reset() {
                        this.setNextBulletTime();
                    }
                    setNextBulletTime() {
                        this._nextBulletTime = Gameplay.timer.time + this._settings.getShootingInterval(Gameplay.State.instance.levelId);
                    }
                    update() {
                        if (this._nextBulletTime <= Gameplay.timer.time && Gameplay.State.instance.player.state == 0) {
                            this.setNextBulletTime();
                            if (!this.shoot()) {
                                this._nextBulletExtraShot = false;
                                this._nextBulletTime = Gameplay.timer.time + (this._nextBulletTime - Gameplay.timer.time) / 2;
                            }
                            else {
                                if (Phaser.Math.RND.realInRange(0, 1) < 0.5) {
                                    this._nextBulletTime = Gameplay.timer.time + (this._nextBulletTime - Gameplay.timer.time) / 2;
                                    this._nextBulletExtraShot = true;
                                }
                                else {
                                    this._nextBulletExtraShot = false;
                                }
                            }
                        }
                        this._bg.angle -= 0.5 * Gameplay.timer.delta * Gameplay.State.instance.player.pathDir;
                    }
                    shoot() {
                        let x = this.x;
                        let y = this.y;
                        let delay = 0;
                        let bulletHitDelay = this._settings.getBulletHitDelay(Gameplay.State.instance.levelId);
                        let bulletMode = (this._nextBulletExtraShot || this._manager.nextBonusBulletDelay != 0 ? 0 : 1);
                        let bulletType;
                        if (bulletMode == 0) {
                            if (Gameplay.State.instance.bonuses.isBonusActive(2))
                                bulletHitDelay *= 2;
                            if (!this._nextBulletExtraShot) {
                                let i = Phaser.Math.RND.integerInRange(0, 10);
                                if (i > 8) {
                                    delay = bulletHitDelay + Phaser.Math.RND.integerInRange(150, 250);
                                }
                                else if (i > 6) {
                                    delay = bulletHitDelay - Phaser.Math.RND.integerInRange(150, 400);
                                }
                                else {
                                    delay = bulletHitDelay;
                                }
                            }
                            else {
                                delay += bulletHitDelay / 4;
                            }
                            bulletType = Phaser.Math.RND.integerInRange(0, Game.settings.theme.bulletVerCnt - 1);
                        }
                        else {
                            bulletHitDelay *= 2;
                            bulletType = Gameplay.State.instance.bonuses.selectBonus().type;
                            this._manager.resetNextBonusBulletDelay();
                        }
                        let plColPos = Gameplay.State.instance.player.getFuturePosition(delay);
                        let dis = Phaser.Math.Distance.Between(x, y, plColPos.x, plColPos.y);
                        if (this._settings.aimRadius > 0 && dis > this._settings.aimRadius)
                            return false;
                        let dir = Phaser.Math.Angle.Between(x, y, plColPos.x, plColPos.y);
                        let speed = dis / (bulletHitDelay / 1000);
                        this._actBullets.add(this._freeBullets.getItem().activate(this, bulletMode, bulletType, dir, speed));
                        return true;
                    }
                    handleBnsDestroyBullets() {
                        this._nextBulletTime += Gameplay.State.instance.bonuses.getBonus(3).duration;
                    }
                }
                Cannon_1.Cannon = Cannon;
            })(Cannon = Gameplay.Cannon || (Gameplay.Cannon = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Cannon;
            (function (Cannon) {
                class Manager {
                    constructor() {
                        this._freeBullets = new Collections.Pool(Cannon.Bullet, 3, true);
                        this._actBullets = new Collections.NodeList();
                        this._freeCannons = new Collections.Pool(undefined, 1, true, () => {
                            return new Cannon.Cannon(this, this._freeBullets, this._actBullets);
                        }, this);
                        this._actCannons = new Collections.NodeList();
                        Gameplay.State.instance.bonuses.events.on(Gameplay.Bonus.Bonus.EVENT_ACTIVATED + 3, this.destroyAllBullets, this);
                        Gameplay.Scene.instance.events.on(Gameplay.Point.Manager.EVENT_ALL_POINTS_COLLECTED, this.destroyAllBullets, this);
                        Gameplay.Scene.instance.events.on(Gameplay.Player.Player.EVENT_REVIVE, this.destroyAllBullets, this);
                    }
                    get nextBonusBulletDelay() { return this._nextBonusBulletDelay; }
                    handleCircuitChange() {
                        this._actCannons.forEach((cannon) => {
                            cannon.deactivate();
                            this._freeCannons.returnItem(cannon);
                        }, this);
                        this._actCannons.clear();
                        Game.settings.circuit.cannons.forEach((cannon) => {
                            this._actCannons.add(this._freeCannons.getItem().activate(cannon));
                        }, this);
                    }
                    reset() {
                        this._actBullets.forEach((bullet) => {
                            bullet.reset();
                            this._freeBullets.returnItem(bullet);
                        }, this);
                        this._actBullets.clear();
                        this._actCannons.forEach((cannon) => { cannon.reset(); });
                    }
                    update() {
                        if (this._nextBonusBulletDelay > 0) {
                            if ((this._nextBonusBulletDelay -= Gameplay.timer.deltaMs) < 0)
                                this._nextBonusBulletDelay = 0;
                        }
                        this._actCannons.forEach((cannon) => { cannon.update(); });
                        this._actBullets.forEach((bullet, node) => {
                            if (!bullet.update())
                                this._freeBullets.returnItem(this._actBullets.removeByNode(node));
                        }, this);
                    }
                    resetNextBonusBulletDelay() {
                        let i = Gameplay.State.instance.bonuses.selectableBonusCnt;
                        this._nextBonusBulletDelay = (i > 0 ? Manager.BONUS_BULLET_INTERVAL[Math.min(i, Manager.BONUS_BULLET_INTERVAL.length) - 1] : -1);
                    }
                    destroyAllBullets() {
                        this._actBullets.forEach((bullet) => {
                            if (bullet.mode == 0)
                                bullet.destroy();
                        });
                    }
                }
                Manager.BONUS_BULLET_INTERVAL = [
                    5 * 1000,
                    8 * 1000,
                    6 * 1000
                ];
                Cannon.Manager = Manager;
            })(Cannon = Gameplay.Cannon || (Gameplay.Cannon = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Point;
            (function (Point_1) {
                class Point {
                    constructor() {
                        this._sprite = Gameplay.Scene.instance.add.image(0, 0, "atlas_0")
                            .setDepth(15)
                            .setVisible(false);
                    }
                    get state() { return this._state; }
                    get pathPos() { return this._pathPos; }
                    reset() {
                        this._sprite
                            .setAlpha(1)
                            .setScale(1)
                            .setVisible(true);
                        this._state = 0;
                    }
                    activate(pathPos, angleT) {
                        this._pathPos = pathPos;
                        this._state = 0;
                        let path = Gameplay.State.instance.path;
                        let pos = path.getPoint(pathPos, new Phaser.Math.Vector2());
                        this._sprite
                            .setFrame(Game.settings.theme.assetPath + "point")
                            .setPosition(pos.x, pos.y);
                        let nextPos = path.getPoint(pathPos + angleT, new Phaser.Math.Vector2());
                        this._sprite.rotation = Phaser.Math.Angle.Between(pos.x, pos.y, nextPos.x, nextPos.y);
                        return this;
                    }
                    deactivate() {
                        this._sprite.visible = false;
                    }
                    collect() {
                        if (this._state == 0) {
                            this._time = Gameplay.timer.time;
                            this._state = 1;
                            return true;
                        }
                        return false;
                    }
                    update() {
                        if (this._state == 1) {
                            let progress = (Gameplay.timer.time - this._time) / 500;
                            if (progress < 1) {
                                progress = Phaser.Math.Easing.Cubic.Out(progress);
                                this._sprite
                                    .setScale(progress * 1 + 1)
                                    .setAlpha(1 - progress);
                                return true;
                            }
                            else {
                                this._sprite.setVisible(false);
                                this._state = 2;
                                return false;
                            }
                        }
                        return false;
                    }
                }
                Point_1.Point = Point;
            })(Point = Gameplay.Point || (Gameplay.Point = {}));
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var Gameplay;
        (function (Gameplay) {
            var Point;
            (function (Point) {
                class Manager {
                    constructor() {
                        this._freePoints = new Collections.Pool(Point.Point, 10, true);
                        this._actPoints = new Collections.NodeList();
                        Gameplay.Scene.instance.events.on(Gameplay.Player.Player.EVENT_REVIVE, this.resetPlPointIds, this);
                    }
                    get remPointsToCollect() { return this._remPointsToCollect; }
                    handleCircuitChange() {
                        if (this._points) {
                            this._points.forEach((pickup) => {
                                pickup.deactivate();
                                this._freePoints.returnItem(pickup);
                            }, this);
                        }
                        this._points = [];
                        let cnt = Game.Settings.Circuit.getPointCnt(Gameplay.State.instance.path.getLength());
                        let spacing = 1 / cnt;
                        let t = spacing / 2;
                        let angleT = 1 / (Gameplay.State.instance.path.getLength() / 5);
                        while (cnt-- != 0) {
                            let pickup = this._freePoints.getItem();
                            this._points.push(pickup.activate(t, angleT));
                            t += spacing;
                        }
                    }
                    reset() {
                        this._remPointsToCollect = this._points.length;
                        this._actPoints.clear();
                        this._points.forEach((pickup) => { pickup.reset(); });
                        this.resetPlPointIds();
                    }
                    update() {
                        this._actPoints.forEach((pickup, node) => {
                            if (!pickup.update())
                                this._actPoints.removeByNode(node);
                        }, this);
                        let pl = Gameplay.State.instance.player;
                        if (pl.state == 0) {
                            let prevPos = pl.pathPrevPos;
                            let curPos = pl.pathPos;
                            if (pl.pathDir > 0) {
                                while (true) {
                                    let point = this._points[this._plPointId1];
                                    let pointPos = point.pathPos;
                                    if (prevPos > pointPos && curPos < prevPos)
                                        prevPos = 0;
                                    if (prevPos > pointPos || curPos < pointPos)
                                        break;
                                    if (point.collect())
                                        this.pickupPoint(point);
                                    if (++this._plPointId1 == this._points.length)
                                        this._plPointId1 = 0;
                                }
                            }
                            else {
                                while (true) {
                                    let point = this._points[this._plPointId2];
                                    let pointPos = point.pathPos;
                                    if (prevPos < pointPos && curPos > prevPos)
                                        prevPos = 1;
                                    if (prevPos < pointPos || curPos > pointPos)
                                        break;
                                    if (point.collect())
                                        this.pickupPoint(point);
                                    if (this._plPointId2-- == 0)
                                        this._plPointId2 = this._points.length - 1;
                                }
                            }
                        }
                    }
                    pickupPoint(point) {
                        this._actPoints.add(point);
                        Gameplay.State.instance.addScore(1);
                        if (--this._remPointsToCollect == 0)
                            Gameplay.Scene.instance.events.emit(Manager.EVENT_ALL_POINTS_COLLECTED);
                        Game.game.sound.playAudioSprite("sfx", (this._remPointsToCollect != 0 ? "point" : "lastPoint"));
                    }
                    resetPlPointIds() {
                        let plPathPos = Gameplay.State.instance.player.pathPos;
                        this._plPointId1 = 0;
                        this._points.every((pickup) => {
                            if (pickup.pathPos < plPathPos) {
                                this._plPointId1++;
                                return true;
                            }
                            return false;
                        });
                        if (this._plPointId1 == this._points.length)
                            this._plPointId1 = 0;
                        if ((this._plPointId2 = this._plPointId1 - 1) < 0)
                            this._plPointId2 = this._points.length - 1;
                    }
                }
                Manager.EVENT_ALL_POINTS_COLLECTED = "allPoints";
                Point.Manager = Manager;
            })(Point = Gameplay.Point || (Gameplay.Point = {}));
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
                    super(1);
                    State._instance = this;
                    Game.game.scene.add("gameplay", Gameplay.Scene);
                    Gameplay.timer = new Helpers.GameTimer(false);
                }
                static get instance() { return State._instance; }
                get mode() { return this._mode; }
                get score() { return this._score; }
                get levelId() { return this._levelId; }
                get path() { return this._path; }
                get player() { return this._player; }
                get points() { return this._points; }
                get bonuses() { return this._bonuses; }
                activate(prevState, data) {
                    let addResChangeLst = (!this._scene || this._scene.sys.isSleeping());
                    this._mode = 0;
                    if (!this._scene) {
                        this._scene = Gameplay.Scene.instance;
                        this._scene.events.on(Phaser.Scenes.Events.CREATE, this.handleMainSceneCreate, this);
                        Game.game.scene.run("gameplay");
                        this._path.handleCircuitChange();
                        this._points.handleCircuitChange();
                        this._cannons.handleCircuitChange();
                        this.reset();
                    }
                    else {
                        if (prevState == 4) {
                            this._scene.sys.wake();
                        }
                        else if (prevState == 2 || prevState == 3) {
                            if (prevState == 3) {
                                this._extraLifes--;
                                this._player.revive();
                            }
                            else {
                                this._bonuses.resetSelectableBonuses();
                                this._cannons.resetNextBonusBulletDelay();
                                Gamee2.Gamee.loadAd();
                            }
                            this._player.activate();
                            this._scene.sys.resume();
                            this._scene.cameras.main.fadeIn(250, 0xFF, 0xFF, 0xFF);
                        }
                        else {
                            this._scene.sys.resume();
                        }
                    }
                    if (addResChangeLst) {
                        Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                        this.handleResChange(Game.scale.width, Game.scale.height);
                    }
                }
                deactivate(newState) {
                    let camera = this._scene.cameras.main;
                    camera.off(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, undefined, this);
                    camera.off(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, undefined, this);
                    camera.resetFX();
                    if (newState == 2 || newState == 3) {
                        this._player.deactivate();
                        if (newState == 2)
                            this._scene.cameras.main.setScroll(Math.floor((Game.scale.maxWidth - Game.scale.width) / 2), Math.floor((Game.scale.maxHeight - Game.scale.height) / 2));
                        this._scene.cameras.main.resetFX();
                        Game.game.scene.pause("gameplay");
                    }
                    else {
                        Game.game.scene.sleep("gameplay");
                        Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    }
                }
                reset() {
                    this._scene.cameras.main.off(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, undefined, this);
                    Gameplay.timer.start();
                    this._score = 0;
                    this._extraLifes = 1;
                    this._levelId = 0;
                    this._bonuses.reset();
                    this._bonuses.resetPickupFxs();
                    this._bonuses.resetSelectableBonuses();
                    this._bonusIconPanel.reset();
                    this._player.reset();
                    this._cannons.reset();
                    this._cannons.resetNextBonusBulletDelay();
                    this._points.reset();
                }
                update(delta) {
                    Gameplay.timer.update(delta);
                    this._player.update();
                    this._cannons.update();
                    this._points.update();
                    this._bonuses.update();
                    this._bonusIconPanel.update();
                    let camera = this._scene.cameras.main;
                    this._bg.tilePositionX = camera.scrollX * 0.5;
                    this._bg.tilePositionY = camera.scrollY * 0.5;
                }
                addScore(value) {
                    if (this._bonuses.isBonusActive(1))
                        value *= 2;
                    this._score += value;
                    Gamee2.Gamee.score = this._score;
                  
                    var tmp=""
                    tmp +=    this._score 
                    $("#score").html(tmp)
                                    }
                handlePlayerDeath() {
                    if (this._levelId > 0 && this._extraLifes != 0 && (!Gamee2.Gamee.ready || States.ExtraLife.State.EXTRA_LIFE_CURRENCY != 3 || Gamee2.Gamee.adReady)) {
                        States.states.setCurState(3);
                    }
                    else {
                        Game.game.gameOver();
                    }
                }
                handleMainSceneCreate(scene) {
                    Gameplay.Scene.instance.cameras.main.removeBounds();
                    this._bg = scene.add.tileSprite(0, 0, Game.scale.width, Game.scale.height, "atlas_0", Game.settings.theme.assetPath + "bgTile")
                        .setOrigin(0)
                        .setScrollFactor(0);
                    this._path = new Gameplay.Path();
                    this._bonuses = new Gameplay.Bonus.Manager();
                    this._bonusIconPanel = new Gameplay.Bonus.IconPanel(this._bonuses);
                    this._cannons = new Gameplay.Cannon.Manager();
                    this._points = new Gameplay.Point.Manager();
                    this._player = new Gameplay.Player.Player();
                    scene.events.on(Gameplay.Player.Player.EVENT_DEATH, this.handlePlayerDeath, this);
                    scene.events.on(Gameplay.Point.Manager.EVENT_ALL_POINTS_COLLECTED, this.handleAllPointsCollected, this);
                }
                handleAllPointsCollected() {
                    let camera = this._scene.cameras.main;
                    this._mode = 1;
                    camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                        this._levelId++;
                        this._points.reset();
                        camera.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => { this._mode = 0; }, this);
                        camera.fadeIn(250, 0xFF, 0xFF, 0xFF);
                    }, this);
                    camera.fadeOut(300, 0xFF, 0xFF, 0xFF);
                }
                handleResChange(w, h) {
                    let camera = this._scene.cameras.main;
                    camera.setSize(w, h);
                    camera.scrollY = Math.floor((Game.scale.maxHeight - h) / 2);
                    camera.emit("resize", camera);
                    this._bg.setSize(w, h);
                }
            }
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
            class Path {
                constructor() {
                    this._graphics = Gameplay.Scene.instance.add.graphics()
                        .setDepth(10);
                }
                get offsetX() { return this._offsetX; }
                get offsetY() { return this._offsetY; }
                handleCircuitChange() {
                    let circuit = Game.settings.circuit;
                    this._path = circuit.pathGenerator(1);
                    this._offsetX = Math.floor((Game.scale.maxWidth - circuit.width) / 2);
                    this._offsetY = Math.floor((Game.scale.maxHeight - circuit.height) / 2);
                    this._graphics
                        .clear()
                        .lineStyle(2, Game.settings.theme.pathColor, 1)
                        .setPosition(this._offsetX, this._offsetY);
                    this._path.draw(this._graphics);
                }
                getLength() {
                    return this._path.getLength();
                }
                getPoint(t, out) {
                    out = this._path.getPoint(t, out);
                    out.x += this._offsetX;
                    out.y += this._offsetY;
                    return out;
                }
            }
            Gameplay.Path = Path;
        })(Gameplay = States.Gameplay || (States.Gameplay = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var States;
    (function (States) {
        var WelcomeVIP;
        (function (WelcomeVIP) {
            class Scene extends Phaser.Scene {
                constructor() {
                    super({
                        key: "welcomeVIP",
                        physics: {},
                        plugins: ["InputPlugin"],
                    });
                }
                create() {
                    this._bgOverlay = this.add.graphics();
                    this._popup = new Controls.Group.Group();
                    this._popup.add(this.add.image(0, 0, "atlas_0", "gamee/vipWelcome").setOrigin(0), 0, 0, 0, true);
                    let btnContent = new Controls.Group.Group();
                    btnContent.add(this.add.bitmapText(0, 0, "fntText64", "GREAT!", 64), 0, 0, 0, true);
                    let btn = new Controls.Buttons.ContentButton(this, 0, 0, "atlas_0", "commonUI/btnMiddle_")
                        .setContent(btnContent);
                    this._popup.add(btn, (this._popup.width - btn.width) / 2, this._popup.height - 100, 0, false);
                    this.events.on("btn_click", this.handleBtnClick, this);
                    Game.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this.handleResChange(Game.scale.width, Game.scale.height);
                    this.events.on(Phaser.Scenes.Events.DESTROY, this.handleDestroy, this);
                }
                handleDestroy() {
                    Game.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    this._popup.destroy();
                    this._popup = null;
                }
                handleBtnClick() {
                    Game.saveState.vipMember = true;
                    this.scene.remove("welcomeVIP");
                }
                handleResChange(w, h) {
                    this.cameras.main.setSize(w, h);
                    this._bgOverlay
                        .clear()
                        .fillStyle(0, 0.75)
                        .fillRect(0, 0, w, h);
                    this._popup.setPosition((w - this._popup.width) / 2, (h - this._popup.height) / 2);
                }
            }
            WelcomeVIP.Scene = Scene;
        })(WelcomeVIP = States.WelcomeVIP || (States.WelcomeVIP = {}));
    })(States = Game.States || (Game.States = {}));
})(Game || (Game = {}));

