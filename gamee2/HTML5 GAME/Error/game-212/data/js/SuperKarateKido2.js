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
        foreach(clb, clbCtx) {
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
            get enabled() { return this._enabled; }
            set enabled(enabled) {
                if (this._enabled != enabled) {
                    this._enabled = enabled;
                    this._image.input.enabled = enabled;
                    this.handleStateChange(enabled ? 0 : 2);
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
            setImageFrakeKey(frameKey) {
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
                    this.handleStateChange(this._state);
                    event.stopPropagation();
                }
            }
            handlePointerUp() {
                if (this._state != 1)
                    return;
                this._state = 0;
                this.handleStateChange(this._state);
                this.events.emit("btn_click", this);
            }
            handlePointerOut() {
                if (this._state != 1)
                    return;
                this._state = 0;
                this.handleStateChange(this._state);
            }
            handleVisibleChange(visible) {
                this._image.visible = visible;
            }
            handleStateChange(state) {
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
                    this._content.visible = this._visible;
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
            setCameraFilter(filter) {
                super.setCameraFilter(filter);
                this._content.cameraFilter = filter;
                return this;
            }
            handleContentSizeChange() {
                if (this._contentAlign != 0)
                    this.updateContentPos();
            }
            handleStateChange(state) {
                super.handleStateChange(state);
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
            resetCustomSize() {
                if (this._customSize) {
                    this._customSize = false;
                    let width = 0;
                    let height = 0;
                    let item = this._firstItem;
                    while (item != null) {
                        if (item.affectGroupSize) {
                            if (item.groupOccupationW > width)
                                width = item.groupOccupationW;
                            if (item.groupOccupationH > height)
                                height = item.groupOccupationH;
                        }
                        item = item.next;
                    }
                    if (width != this._width || height != this._height) {
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
                    }
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
                if (!this._updateSize(item, true) || item.alignment == 0)
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
            _updateSize(item, start) {
                if (!item.affectGroupSize || this._customSize)
                    return false;
                let newSize = false;
                if (start) {
                    if (item.groupOccupationW > this._width) {
                        this._width = item.groupOccupationW;
                        newSize = true;
                    }
                    if (item.groupOccupationH > this._height) {
                        this._height = item.groupOccupationH;
                        newSize = true;
                    }
                }
                else if (item.groupOccupationW >= this._width || item.groupOccupationH >= this._height) {
                    let width = 0;
                    let height = 0;
                    let i = this._firstItem;
                    while (i != null) {
                        if (i.affectGroupSize && i.visible) {
                            if (width < i.groupOccupationW)
                                width = i.groupOccupationW;
                            if (height < i.groupOccupationH)
                                height = i.groupOccupationH;
                        }
                        i = i.next;
                    }
                    if (width != this._width || height != this._height) {
                        this._width = width;
                        this._height = height;
                        newSize = true;
                    }
                }
                if (!newSize)
                    return false;
                let i = this._firstItem;
                while (i != null) {
                    if (i.alignment != 0)
                        i.updatePosition();
                    i = i.next;
                }
                if (this._events)
                    this._events.emit("group_sizeChange", this, this._width, this._height);
                return true;
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
                if (content.displayOriginX != undefined)
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
                    this.updateGroupOccupationArea();
                    this.updatePosition();
                }
            }
            get groupOccupationW() { return this._groupOccupationW; }
            get groupOccupationH() { return this._groupOccupationH; }
            get width() { return (this._flags & 2) != 0 ? this._content.displayWidth : (this._flags & 4) != 0 ? this._content.width : 0; }
            get height() { return (this._flags & 2) != 0 ? this._content.displayHeight : (this._flags & 4) != 0 ? this._content.height : 0; }
            get displayOriginX() { return (this._flags & 1) != 0 ? this._content.displayOriginX : 0; }
            get displayOriginY() { return (this._flags & 1) != 0 ? this._content.displayOriginY : 0; }
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
                this._group._updateSize(this, false);
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
                this.updateGroupOccupationArea();
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
                        this._group._updateSize(this, visible);
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
                    return;
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
                        this._group._updateSize(this, true);
                }
            }
            updatePosition() {
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
var Controls;
(function (Controls) {
    class ValueSetter {
        constructor(scene, minValue = 0, defValue = 0, title = "") {
            this._container = new Controls.Group.Group(false);
            this._btnMinus = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "hud/btnMinus_")
                .setId(0);
            this._container.add(this._btnMinus);
            this._fill = scene.add.image(0, 0, "atlas_0", "hud/valSetterFill")
                .setOrigin(0, 0.5);
            this._container.add(this._fill, this._btnMinus.width + ValueSetter.BAR_OFFSET + ValueSetter.BAR_FILL_OFFSET, 0, 8, false);
            let frame = scene.add.image(0, 0, "atlas_0", "hud/valSetterFrame")
                .setOrigin(0, 0.5);
            this._container.add(frame, this._btnMinus.width + ValueSetter.BAR_OFFSET, 0, 8, true);
            this._title = scene.add.bitmapText(0, 0, "font_0", title, 40).setOrigin(0.5);
            this._container.add(this._title, 0, 0, 4 | 8, false);
            this._btnPlus = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "hud/btnPlus_")
                .setId(1);
            this._container.add(this._btnPlus, this._container.width + ValueSetter.BAR_OFFSET);
            this._events = new Phaser.Events.EventEmitter();
            this._btnMinus.events = this._events;
            this._btnPlus.events = this._events;
            this._events.on("btn_click", this.handleBtnClick, this);
            this._value = -1;
            this._minValue = minValue;
            this.value = defValue;
        }
        get container() { return this._container; }
        get events() { return this._events; }
        get value() { return this._value; }
        set value(value) {
            if (value < this._minValue) {
                value = this._minValue;
            }
            else if (value > ValueSetter.MAX_VALUE) {
                value = ValueSetter.MAX_VALUE;
            }
            if (this._value != value) {
                this._value = value;
                this._fill.setCrop(0, 0, Math.round((this._fill.width / ValueSetter.MAX_VALUE) * value), this._fill.height);
                this._btnMinus.enabled = value != 0;
                this._btnPlus.enabled = value < ValueSetter.MAX_VALUE;
                this._events.emit(ValueSetter.EVENT_VALUE_CHANGED, this, value);
            }
        }
        get title() { return this._title.text; }
        set title(title) { this._title.setText(title); }
        handleBtnClick(btn) {
            Game.Global.game.sound.playAudioSprite("sfx", "click");
            if (btn.id == 0) {
                this.value--;
            }
            else {
                this.value++;
            }
        }
    }
    ValueSetter.EVENT_VALUE_CHANGED = "valSet_valChanged";
    ValueSetter.BAR_OFFSET = 10;
    ValueSetter.BAR_FILL_OFFSET = 4;
    ValueSetter.MAX_VALUE = 4;
    Controls.ValueSetter = ValueSetter;
})(Controls || (Controls = {}));
var Helpers;
(function (Helpers) {
    var Buffer;
    (function (Buffer) {
        function abToBase64(ab, len) {
            let binary = '';
            let bytes = new Uint8Array(ab);
            for (let i = 0; i < len; i++)
                binary += String.fromCharCode(bytes[i]);
            return btoa(binary);
        }
        Buffer.abToBase64 = abToBase64;
        function base64ToAb(base64) {
            let binary = atob(base64);
            let len = binary.length;
            let ab = new ArrayBuffer(len);
            let bytes = new Uint8Array(ab);
            for (let i = 0; i < len; i++)
                bytes[i] = binary.charCodeAt(i);
            return ab;
        }
        Buffer.base64ToAb = base64ToAb;
    })(Buffer = Helpers.Buffer || (Helpers.Buffer = {}));
})(Helpers || (Helpers = {}));
var Helpers;
(function (Helpers) {
    class GameTimer {
        constructor() {
            this._events = new Phaser.Events.EventEmitter();
            this.time = 0;
            this.delta = 0;
            this._flags = 0;
        }
        get started() { return (this._flags & 1) != 0; }
        get paused() { return (this._flags & 2) != 0; }
        get events() { return this._events; }
        start() {
            this.time = 0;
            this.delta = 0;
            this._flags |= 1;
        }
        stop() {
            this._flags = 0;
        }
        update(delta) {
            if ((this._flags & (1 | 2)) == 1) {
                this.time += delta;
                this.delta = delta / (1000 / 60);
                this._events.emit(GameTimer.EVENT_UPDATE, this);
            }
        }
        pause() {
            if ((this._flags & (1 | 2)) == 1) {
                this._flags |= 2;
                this.delta = 0;
            }
        }
        resume() {
            if ((this._flags & 2) != 0) {
                this._flags &= ~2;
                this.delta = 1;
            }
        }
    }
    GameTimer.EVENT_UPDATE = "update";
    Helpers.GameTimer = GameTimer;
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
    ScaleManager.EVENT_RESIZE = "sm_resize";
    Helpers.ScaleManager = ScaleManager;
})(Helpers || (Helpers = {}));
var Helpers;
(function (Helpers) {
    class StringUtils {
        static latinise(text) {
            return text.replace(/[^A-Za-z0-9\[\] ]/g, function (a) { return StringUtils._latinMap[a] || a; });
        }
    }
    StringUtils._latinMap = { "Á": "A", "Ă": "A", "Ắ": "A", "Ặ": "A", "Ằ": "A", "Ẳ": "A", "Ẵ": "A", "Ǎ": "A", "Â": "A", "Ấ": "A", "Ậ": "A", "Ầ": "A", "Ẩ": "A", "Ẫ": "A", "Ä": "A", "Ǟ": "A", "Ȧ": "A", "Ǡ": "A", "Ạ": "A", "Ȁ": "A", "À": "A", "Ả": "A", "Ȃ": "A", "Ā": "A", "Ą": "A", "Å": "A", "Ǻ": "A", "Ḁ": "A", "Ⱥ": "A", "Ã": "A", "Ꜳ": "AA", "Æ": "AE", "Ǽ": "AE", "Ǣ": "AE", "Ꜵ": "AO", "Ꜷ": "AU", "Ꜹ": "AV", "Ꜻ": "AV", "Ꜽ": "AY", "Ḃ": "B", "Ḅ": "B", "Ɓ": "B", "Ḇ": "B", "Ƀ": "B", "Ƃ": "B", "Ć": "C", "Č": "C", "Ç": "C", "Ḉ": "C", "Ĉ": "C", "Ċ": "C", "Ƈ": "C", "Ȼ": "C", "Ď": "D", "Ḑ": "D", "Ḓ": "D", "Ḋ": "D", "Ḍ": "D", "Ɗ": "D", "Ḏ": "D", "ǲ": "D", "ǅ": "D", "Đ": "D", "Ƌ": "D", "Ǳ": "DZ", "Ǆ": "DZ", "É": "E", "Ĕ": "E", "Ě": "E", "Ȩ": "E", "Ḝ": "E", "Ê": "E", "Ế": "E", "Ệ": "E", "Ề": "E", "Ể": "E", "Ễ": "E", "Ḙ": "E", "Ë": "E", "Ė": "E", "Ẹ": "E", "Ȅ": "E", "È": "E", "Ẻ": "E", "Ȇ": "E", "Ē": "E", "Ḗ": "E", "Ḕ": "E", "Ę": "E", "Ɇ": "E", "Ẽ": "E", "Ḛ": "E", "Ꝫ": "ET", "Ḟ": "F", "Ƒ": "F", "Ǵ": "G", "Ğ": "G", "Ǧ": "G", "Ģ": "G", "Ĝ": "G", "Ġ": "G", "Ɠ": "G", "Ḡ": "G", "Ǥ": "G", "Ḫ": "H", "Ȟ": "H", "Ḩ": "H", "Ĥ": "H", "Ⱨ": "H", "Ḧ": "H", "Ḣ": "H", "Ḥ": "H", "Ħ": "H", "Í": "I", "Ĭ": "I", "Ǐ": "I", "Î": "I", "Ï": "I", "Ḯ": "I", "İ": "I", "Ị": "I", "Ȉ": "I", "Ì": "I", "Ỉ": "I", "Ȋ": "I", "Ī": "I", "Į": "I", "Ɨ": "I", "Ĩ": "I", "Ḭ": "I", "Ꝺ": "D", "Ꝼ": "F", "Ᵹ": "G", "Ꞃ": "R", "Ꞅ": "S", "Ꞇ": "T", "Ꝭ": "IS", "Ĵ": "J", "Ɉ": "J", "Ḱ": "K", "Ǩ": "K", "Ķ": "K", "Ⱪ": "K", "Ꝃ": "K", "Ḳ": "K", "Ƙ": "K", "Ḵ": "K", "Ꝁ": "K", "Ꝅ": "K", "Ĺ": "L", "Ƚ": "L", "Ľ": "L", "Ļ": "L", "Ḽ": "L", "Ḷ": "L", "Ḹ": "L", "Ⱡ": "L", "Ꝉ": "L", "Ḻ": "L", "Ŀ": "L", "Ɫ": "L", "ǈ": "L", "Ł": "L", "Ǉ": "LJ", "Ḿ": "M", "Ṁ": "M", "Ṃ": "M", "Ɱ": "M", "Ń": "N", "Ň": "N", "Ņ": "N", "Ṋ": "N", "Ṅ": "N", "Ṇ": "N", "Ǹ": "N", "Ɲ": "N", "Ṉ": "N", "Ƞ": "N", "ǋ": "N", "Ñ": "N", "Ǌ": "NJ", "Ó": "O", "Ŏ": "O", "Ǒ": "O", "Ô": "O", "Ố": "O", "Ộ": "O", "Ồ": "O", "Ổ": "O", "Ỗ": "O", "Ö": "O", "Ȫ": "O", "Ȯ": "O", "Ȱ": "O", "Ọ": "O", "Ő": "O", "Ȍ": "O", "Ò": "O", "Ỏ": "O", "Ơ": "O", "Ớ": "O", "Ợ": "O", "Ờ": "O", "Ở": "O", "Ỡ": "O", "Ȏ": "O", "Ꝋ": "O", "Ꝍ": "O", "Ō": "O", "Ṓ": "O", "Ṑ": "O", "Ɵ": "O", "Ǫ": "O", "Ǭ": "O", "Ø": "O", "Ǿ": "O", "Õ": "O", "Ṍ": "O", "Ṏ": "O", "Ȭ": "O", "Ƣ": "OI", "Ꝏ": "OO", "Ɛ": "E", "Ɔ": "O", "Ȣ": "OU", "Ṕ": "P", "Ṗ": "P", "Ꝓ": "P", "Ƥ": "P", "Ꝕ": "P", "Ᵽ": "P", "Ꝑ": "P", "Ꝙ": "Q", "Ꝗ": "Q", "Ŕ": "R", "Ř": "R", "Ŗ": "R", "Ṙ": "R", "Ṛ": "R", "Ṝ": "R", "Ȑ": "R", "Ȓ": "R", "Ṟ": "R", "Ɍ": "R", "Ɽ": "R", "Ꜿ": "C", "Ǝ": "E", "Ś": "S", "Ṥ": "S", "Š": "S", "Ṧ": "S", "Ş": "S", "Ŝ": "S", "Ș": "S", "Ṡ": "S", "Ṣ": "S", "Ṩ": "S", "Ť": "T", "Ţ": "T", "Ṱ": "T", "Ț": "T", "Ⱦ": "T", "Ṫ": "T", "Ṭ": "T", "Ƭ": "T", "Ṯ": "T", "Ʈ": "T", "Ŧ": "T", "Ɐ": "A", "Ꞁ": "L", "Ɯ": "M", "Ʌ": "V", "Ꜩ": "TZ", "Ú": "U", "Ŭ": "U", "Ǔ": "U", "Û": "U", "Ṷ": "U", "Ü": "U", "Ǘ": "U", "Ǚ": "U", "Ǜ": "U", "Ǖ": "U", "Ṳ": "U", "Ụ": "U", "Ű": "U", "Ȕ": "U", "Ù": "U", "Ủ": "U", "Ư": "U", "Ứ": "U", "Ự": "U", "Ừ": "U", "Ử": "U", "Ữ": "U", "Ȗ": "U", "Ū": "U", "Ṻ": "U", "Ų": "U", "Ů": "U", "Ũ": "U", "Ṹ": "U", "Ṵ": "U", "Ꝟ": "V", "Ṿ": "V", "Ʋ": "V", "Ṽ": "V", "Ꝡ": "VY", "Ẃ": "W", "Ŵ": "W", "Ẅ": "W", "Ẇ": "W", "Ẉ": "W", "Ẁ": "W", "Ⱳ": "W", "Ẍ": "X", "Ẋ": "X", "Ý": "Y", "Ŷ": "Y", "Ÿ": "Y", "Ẏ": "Y", "Ỵ": "Y", "Ỳ": "Y", "Ƴ": "Y", "Ỷ": "Y", "Ỿ": "Y", "Ȳ": "Y", "Ɏ": "Y", "Ỹ": "Y", "Ź": "Z", "Ž": "Z", "Ẑ": "Z", "Ⱬ": "Z", "Ż": "Z", "Ẓ": "Z", "Ȥ": "Z", "Ẕ": "Z", "Ƶ": "Z", "Ĳ": "IJ", "Œ": "OE", "ᴀ": "A", "ᴁ": "AE", "ʙ": "B", "ᴃ": "B", "ᴄ": "C", "ᴅ": "D", "ᴇ": "E", "ꜰ": "F", "ɢ": "G", "ʛ": "G", "ʜ": "H", "ɪ": "I", "ʁ": "R", "ᴊ": "J", "ᴋ": "K", "ʟ": "L", "ᴌ": "L", "ᴍ": "M", "ɴ": "N", "ᴏ": "O", "ɶ": "OE", "ᴐ": "O", "ᴕ": "OU", "ᴘ": "P", "ʀ": "R", "ᴎ": "N", "ᴙ": "R", "ꜱ": "S", "ᴛ": "T", "ⱻ": "E", "ᴚ": "R", "ᴜ": "U", "ᴠ": "V", "ᴡ": "W", "ʏ": "Y", "ᴢ": "Z", "á": "a", "ă": "a", "ắ": "a", "ặ": "a", "ằ": "a", "ẳ": "a", "ẵ": "a", "ǎ": "a", "â": "a", "ấ": "a", "ậ": "a", "ầ": "a", "ẩ": "a", "ẫ": "a", "ä": "a", "ǟ": "a", "ȧ": "a", "ǡ": "a", "ạ": "a", "ȁ": "a", "à": "a", "ả": "a", "ȃ": "a", "ā": "a", "ą": "a", "ᶏ": "a", "ẚ": "a", "å": "a", "ǻ": "a", "ḁ": "a", "ⱥ": "a", "ã": "a", "ꜳ": "aa", "æ": "ae", "ǽ": "ae", "ǣ": "ae", "ꜵ": "ao", "ꜷ": "au", "ꜹ": "av", "ꜻ": "av", "ꜽ": "ay", "ḃ": "b", "ḅ": "b", "ɓ": "b", "ḇ": "b", "ᵬ": "b", "ᶀ": "b", "ƀ": "b", "ƃ": "b", "ɵ": "o", "ć": "c", "č": "c", "ç": "c", "ḉ": "c", "ĉ": "c", "ɕ": "c", "ċ": "c", "ƈ": "c", "ȼ": "c", "ď": "d", "ḑ": "d", "ḓ": "d", "ȡ": "d", "ḋ": "d", "ḍ": "d", "ɗ": "d", "ᶑ": "d", "ḏ": "d", "ᵭ": "d", "ᶁ": "d", "đ": "d", "ɖ": "d", "ƌ": "d", "ı": "i", "ȷ": "j", "ɟ": "j", "ʄ": "j", "ǳ": "dz", "ǆ": "dz", "é": "e", "ĕ": "e", "ě": "e", "ȩ": "e", "ḝ": "e", "ê": "e", "ế": "e", "ệ": "e", "ề": "e", "ể": "e", "ễ": "e", "ḙ": "e", "ë": "e", "ė": "e", "ẹ": "e", "ȅ": "e", "è": "e", "ẻ": "e", "ȇ": "e", "ē": "e", "ḗ": "e", "ḕ": "e", "ⱸ": "e", "ę": "e", "ᶒ": "e", "ɇ": "e", "ẽ": "e", "ḛ": "e", "ꝫ": "et", "ḟ": "f", "ƒ": "f", "ᵮ": "f", "ᶂ": "f", "ǵ": "g", "ğ": "g", "ǧ": "g", "ģ": "g", "ĝ": "g", "ġ": "g", "ɠ": "g", "ḡ": "g", "ᶃ": "g", "ǥ": "g", "ḫ": "h", "ȟ": "h", "ḩ": "h", "ĥ": "h", "ⱨ": "h", "ḧ": "h", "ḣ": "h", "ḥ": "h", "ɦ": "h", "ẖ": "h", "ħ": "h", "ƕ": "hv", "í": "i", "ĭ": "i", "ǐ": "i", "î": "i", "ï": "i", "ḯ": "i", "ị": "i", "ȉ": "i", "ì": "i", "ỉ": "i", "ȋ": "i", "ī": "i", "į": "i", "ᶖ": "i", "ɨ": "i", "ĩ": "i", "ḭ": "i", "ꝺ": "d", "ꝼ": "f", "ᵹ": "g", "ꞃ": "r", "ꞅ": "s", "ꞇ": "t", "ꝭ": "is", "ǰ": "j", "ĵ": "j", "ʝ": "j", "ɉ": "j", "ḱ": "k", "ǩ": "k", "ķ": "k", "ⱪ": "k", "ꝃ": "k", "ḳ": "k", "ƙ": "k", "ḵ": "k", "ᶄ": "k", "ꝁ": "k", "ꝅ": "k", "ĺ": "l", "ƚ": "l", "ɬ": "l", "ľ": "l", "ļ": "l", "ḽ": "l", "ȴ": "l", "ḷ": "l", "ḹ": "l", "ⱡ": "l", "ꝉ": "l", "ḻ": "l", "ŀ": "l", "ɫ": "l", "ᶅ": "l", "ɭ": "l", "ł": "l", "ǉ": "lj", "ſ": "s", "ẜ": "s", "ẛ": "s", "ẝ": "s", "ḿ": "m", "ṁ": "m", "ṃ": "m", "ɱ": "m", "ᵯ": "m", "ᶆ": "m", "ń": "n", "ň": "n", "ņ": "n", "ṋ": "n", "ȵ": "n", "ṅ": "n", "ṇ": "n", "ǹ": "n", "ɲ": "n", "ṉ": "n", "ƞ": "n", "ᵰ": "n", "ᶇ": "n", "ɳ": "n", "ñ": "n", "ǌ": "nj", "ó": "o", "ŏ": "o", "ǒ": "o", "ô": "o", "ố": "o", "ộ": "o", "ồ": "o", "ổ": "o", "ỗ": "o", "ö": "o", "ȫ": "o", "ȯ": "o", "ȱ": "o", "ọ": "o", "ő": "o", "ȍ": "o", "ò": "o", "ỏ": "o", "ơ": "o", "ớ": "o", "ợ": "o", "ờ": "o", "ở": "o", "ỡ": "o", "ȏ": "o", "ꝋ": "o", "ꝍ": "o", "ⱺ": "o", "ō": "o", "ṓ": "o", "ṑ": "o", "ǫ": "o", "ǭ": "o", "ø": "o", "ǿ": "o", "õ": "o", "ṍ": "o", "ṏ": "o", "ȭ": "o", "ƣ": "oi", "ꝏ": "oo", "ɛ": "e", "ᶓ": "e", "ɔ": "o", "ᶗ": "o", "ȣ": "ou", "ṕ": "p", "ṗ": "p", "ꝓ": "p", "ƥ": "p", "ᵱ": "p", "ᶈ": "p", "ꝕ": "p", "ᵽ": "p", "ꝑ": "p", "ꝙ": "q", "ʠ": "q", "ɋ": "q", "ꝗ": "q", "ŕ": "r", "ř": "r", "ŗ": "r", "ṙ": "r", "ṛ": "r", "ṝ": "r", "ȑ": "r", "ɾ": "r", "ᵳ": "r", "ȓ": "r", "ṟ": "r", "ɼ": "r", "ᵲ": "r", "ᶉ": "r", "ɍ": "r", "ɽ": "r", "ↄ": "c", "ꜿ": "c", "ɘ": "e", "ɿ": "r", "ś": "s", "ṥ": "s", "š": "s", "ṧ": "s", "ş": "s", "ŝ": "s", "ș": "s", "ṡ": "s", "ṣ": "s", "ṩ": "s", "ʂ": "s", "ᵴ": "s", "ᶊ": "s", "ȿ": "s", "ɡ": "g", "ᴑ": "o", "ᴓ": "o", "ᴝ": "u", "ť": "t", "ţ": "t", "ṱ": "t", "ț": "t", "ȶ": "t", "ẗ": "t", "ⱦ": "t", "ṫ": "t", "ṭ": "t", "ƭ": "t", "ṯ": "t", "ᵵ": "t", "ƫ": "t", "ʈ": "t", "ŧ": "t", "ᵺ": "th", "ɐ": "a", "ᴂ": "ae", "ǝ": "e", "ᵷ": "g", "ɥ": "h", "ʮ": "h", "ʯ": "h", "ᴉ": "i", "ʞ": "k", "ꞁ": "l", "ɯ": "m", "ɰ": "m", "ᴔ": "oe", "ɹ": "r", "ɻ": "r", "ɺ": "r", "ⱹ": "r", "ʇ": "t", "ʌ": "v", "ʍ": "w", "ʎ": "y", "ꜩ": "tz", "ú": "u", "ŭ": "u", "ǔ": "u", "û": "u", "ṷ": "u", "ü": "u", "ǘ": "u", "ǚ": "u", "ǜ": "u", "ǖ": "u", "ṳ": "u", "ụ": "u", "ű": "u", "ȕ": "u", "ù": "u", "ủ": "u", "ư": "u", "ứ": "u", "ự": "u", "ừ": "u", "ử": "u", "ữ": "u", "ȗ": "u", "ū": "u", "ṻ": "u", "ų": "u", "ᶙ": "u", "ů": "u", "ũ": "u", "ṹ": "u", "ṵ": "u", "ᵫ": "ue", "ꝸ": "um", "ⱴ": "v", "ꝟ": "v", "ṿ": "v", "ʋ": "v", "ᶌ": "v", "ⱱ": "v", "ṽ": "v", "ꝡ": "vy", "ẃ": "w", "ŵ": "w", "ẅ": "w", "ẇ": "w", "ẉ": "w", "ẁ": "w", "ⱳ": "w", "ẘ": "w", "ẍ": "x", "ẋ": "x", "ᶍ": "x", "ý": "y", "ŷ": "y", "ÿ": "y", "ẏ": "y", "ỵ": "y", "ỳ": "y", "ƴ": "y", "ỷ": "y", "ỿ": "y", "ȳ": "y", "ẙ": "y", "ɏ": "y", "ỹ": "y", "ź": "z", "ž": "z", "ẑ": "z", "ʑ": "z", "ⱬ": "z", "ż": "z", "ẓ": "z", "ȥ": "z", "ẕ": "z", "ᵶ": "z", "ᶎ": "z", "ʐ": "z", "ƶ": "z", "ɀ": "z", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl", "ﬁ": "fi", "ﬂ": "fl", "ĳ": "ij", "œ": "oe", "ﬆ": "st", "ₐ": "a", "ₑ": "e", "ᵢ": "i", "ⱼ": "j", "ₒ": "o", "ᵣ": "r", "ᵤ": "u", "ᵥ": "v", "ₓ": "x" };
    Helpers.StringUtils = StringUtils;
})(Helpers || (Helpers = {}));
var Helpers;
(function (Helpers) {
    var Tweens;
    (function (Tweens) {
        function playTween(tween) {
            if (tween.paused) {
                tween.play(false);
            }
            else {
                tween.restart();
            }
        }
        Tweens.playTween = playTween;
    })(Tweens = Helpers.Tweens || (Helpers.Tweens = {}));
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
var SlideMessage;
(function (SlideMessage) {
    let eMessageState;
    (function (eMessageState) {
        eMessageState[eMessageState["completed"] = 0] = "completed";
        eMessageState[eMessageState["slideIn"] = 1] = "slideIn";
        eMessageState[eMessageState["slideOutDelay"] = 2] = "slideOutDelay";
        eMessageState[eMessageState["slideOut"] = 3] = "slideOut";
    })(eMessageState = SlideMessage.eMessageState || (SlideMessage.eMessageState = {}));
    class MessageBase {
        constructor() {
            this._state = eMessageState.completed;
        }
        get state() { return this._state; }
        update() {
            if (this._state == eMessageState.completed)
                return false;
            let time = this._timer.time - this._showTime;
            let type = this._type;
            let msg = this.getContainer();
            let state = this._state;
            switch (state) {
                case eMessageState.slideIn: {
                    let progress = time / type.slideInTime;
                    if (progress >= 1) {
                        progress = 1;
                        state = eMessageState.slideOutDelay;
                    }
                    if (type.slideInAlphaStart != 1)
                        msg.alpha = type.slideInAlphaStart + type.slideInAlphaEase(progress) * (1 - type.slideInAlphaStart);
                    let startX = this.getStartX();
                    let centerX = this.getCenterX();
                    msg.x = startX + type.slideInEase(progress) * (centerX - startX);
                    break;
                }
                case eMessageState.slideOutDelay: {
                    if (time - type.slideInTime < type.slideOutDelay) {
                        msg.x = this.getCenterX();
                        break;
                    }
                    state = eMessageState.slideOut;
                }
                case eMessageState.slideOut: {
                    let progress = (time - type.slideInTime - type.slideOutDelay) / type.slideOutTime;
                    if (progress >= 1) {
                        progress = 1;
                        state = eMessageState.completed;
                    }
                    let centerX = this.getCenterX();
                    ;
                    let endX = type.slideDir < 0 ? -msg.width : this._camera.width;
                    msg.x = centerX + (endX - centerX) * type.slideOutEase(progress);
                    if (type.slideOutAlphaEnd != 1)
                        msg.alpha = 1 - (1 - type.slideOutAlphaEnd) * type.slideOutAlphaEase(progress);
                    break;
                }
            }
            if (state != this._state) {
                this._state = state;
                this.callCalback();
            }
            return this._state != eMessageState.completed;
        }
        kill() {
            this._state = eMessageState.completed;
        }
        getStartX() {
            return this._camera.scrollX + (this._type.slideDir < 0 ? this._camera.width : -this.getContainer().width);
        }
        getCenterX() {
            return this._camera.scrollX + ((this._camera.width - this.getContainer().width) / 2);
        }
        showMessage(camera, y, type, timer) {
            this._camera = camera;
            this._type = type;
            this._timer = timer;
            this._showTime = timer.time;
            let msg = this.getContainer();
            msg.x = this.getStartX();
            msg.y = y;
            msg.alpha = type.slideInAlphaStart;
            this._state = eMessageState.slideIn;
            this.callCalback();
        }
        callCalback() {
            if (this._onStateChangeClb)
                this._onStateChangeClb.call(this._onStateChangeClbCtx, this._state);
        }
    }
    SlideMessage.MessageBase = MessageBase;
})(SlideMessage || (SlideMessage = {}));
var SlideMessage;
(function (SlideMessage) {
    class MessageType {
        constructor(slideDir, slideInTime, slideInEase, slideInAlphaStart, slideInAlphaEase, slideOutTime, slideOutDelay, slideOutEase, slideOutAlphaEnd, slideOutAlphaEase) {
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
        get slideDir() { return this._dir; }
        get slideInTime() { return this._slideInTime; }
        get slideInEase() { return this._slideInEase; }
        get slideInAlphaStart() { return this._slideInAlphaStart; }
        get slideInAlphaEase() { return this._slideInAlphaEase; }
        get slideOutTime() { return this._slideOutTime; }
        get slideOutDelay() { return this._slideOutDelay; }
        get slideOutEase() { return this._slideOutEase; }
        get slideOutAlphaEnd() { return this._slideOutAlphaEnd; }
        get slideOutAlphaEase() { return this._slideOutAlphaEase; }
    }
    SlideMessage.MessageType = MessageType;
})(SlideMessage || (SlideMessage = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Social;
        (function (Social) {
            class Avatar {
                constructor(url, textureKey, textureFrame) {
                    this._url = url;
                    this._textureKey = textureKey;
                    this._textureFrame = textureFrame;
                    this._state = (this._textureKey != "atlas_0" ? 0 : 2);
                }
                get url() { return this._url; }
                get textureKey() { return this._textureKey; }
                get textureFrame() { return this._textureFrame; }
                get state() { return this._state; }
                set state(state) { this._state = state; }
                get loaded() { return (this._textureKey ? Game.Global.game.textures.exists(this._textureKey) : false); }
                release() {
                    if (this._textureKey != "atlas_0" && this._state == 2)
                        Game.Global.game.textures.remove(this._textureKey);
                    this._state = 0;
                }
            }
            Social.Avatar = Avatar;
        })(Social = Gameplay.Social || (Gameplay.Social = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Social;
        (function (Social) {
            class Player {
                get uid() { return this._uid; }
                get name() { return this._name; }
                get avatar() { return this._avatar; }
                release() {
                    this._avatar.release();
                }
            }
            Social.Player = Player;
        })(Social = Gameplay.Social || (Gameplay.Social = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Social;
        (function (Social) {
            class FriendManager {
                constructor() {
                    this._events = new Phaser.Events.EventEmitter();
                    this._friends = [];
                    this._ready = false;
                }
                get events() { return this._events; }
                get friends() { return this._friends; }
                get ready() { return this._ready; }
                load(scene) {
                    this._scene = scene;
                    if (Gamee2.Gamee.initialized) {
                        this._ready = false;
                        Gamee2.Gamee.requestSocial((player, gameeFriends) => {
                            let newFriends = [];
                            for (let i = 0; i < gameeFriends.length; i++) {
                                let gameeFriend = gameeFriends[i];
                                let newFriend = null;
                                let j = this._friends.length;
                                while (j-- != 0) {
                                    let friend = this._friends[j];
                                    if (friend && friend.uid == gameeFriend.userID) {
                                        friend.score = gameeFriend.highScore;
                                        newFriend = friend;
                                        this._friends[j] = null;
                                        break;
                                    }
                                }
                                if (j < 0)
                                    newFriend = new Social.Friend(gameeFriend.userID, gameeFriend.name, gameeFriend.avatar, gameeFriend.highScore);
                                if (newFriends.length == 0 || newFriends[newFriends.length - 1].score != newFriend.score)
                                    newFriends.push(newFriend);
                            }
                            this._friends.forEach((friend) => {
                                if (friend)
                                    friend.release();
                            });
                            this._friends = newFriends;
                            this._ready = true;
                            this._events.emit(FriendManager.EVENT_NEW_FRIENDS, newFriends);
                            if (newFriends.length == 0) {
                                this._events.emit(FriendManager.EVENT_LOAD_COMPLETE);
                            }
                            else {
                                let loader = this._scene.load;
                                loader.reset();
                                loader.crossOrigin = "anonymous";
                                this._friends.forEach((friend) => {
                                    if (friend.avatar.state == 0) {
                                        loader.image(friend.avatar.textureKey, friend.avatar.url);
                                        friend.avatar.state = 1;
                                    }
                                }, this);
                                if (loader.list.size != 0) {
                                    loader.once(Phaser.Loader.Events.COMPLETE, () => {
                                        loader.off(Phaser.Loader.Events.FILE_COMPLETE, this.handleAvatarLoadComplete, this);
                                        loader.off(Phaser.Loader.Events.FILE_LOAD_ERROR, this.handleAvatarLoadError, this);
                                        this._events.emit(FriendManager.EVENT_LOAD_COMPLETE);
                                    }, this);
                                    loader.on(Phaser.Loader.Events.FILE_LOAD_ERROR, this.handleAvatarLoadError, this);
                                    loader.on(Phaser.Loader.Events.FILE_COMPLETE, this.handleAvatarLoadComplete, this);
                                    loader.start();
                                }
                                else {
                                    this._events.emit(FriendManager.EVENT_LOAD_COMPLETE);
                                }
                            }
                        }, this, 10);
                    }
                    else {
                        this._friends = [
                            new Social.Friend(0, "PLAYER1", undefined, 50),
                            new Social.Friend(1, "PLAYER2", undefined, 200),
                            new Social.Friend(1, "PLAYER3", undefined, 480),
                        ];
                        this._ready = true;
                        this._events.emit(FriendManager.EVENT_NEW_FRIENDS, this._friends);
                        this._events.emit(FriendManager.EVENT_LOAD_COMPLETE);
                    }
                }
                handleAvatarLoadError(file) {
                    this._friends.every((friend) => {
                        if (friend.avatar.textureKey == file.key) {
                            friend.avatar.state = 3;
                            this._events.emit(FriendManager.EVENT_AVATAR_LOADED + friend.uid, false);
                            return false;
                        }
                        return true;
                    }, this);
                }
                handleAvatarLoadComplete(key) {
                    this._friends.every((friend) => {
                        if (friend.avatar.textureKey == key) {
                            friend.avatar.state = 2;
                            this._events.emit(FriendManager.EVENT_AVATAR_LOADED + friend.uid, true);
                            return false;
                        }
                        return true;
                    }, this);
                }
            }
            FriendManager.EVENT_NEW_FRIENDS = "newFriends";
            FriendManager.EVENT_AVATAR_LOADED = "avatarLoaded";
            FriendManager.EVENT_LOAD_COMPLETE = "loadComplete";
            Social.FriendManager = FriendManager;
        })(Social = Gameplay.Social || (Gameplay.Social = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Social;
        (function (Social) {
            class Friend extends Social.Player {
                constructor(uid, name, avatarUrl, score) {
                    super();
                    this._uid = uid;
                    this._name = name;
                    this._score = score;
                    let avatarTexKey;
                    let avatarFrameKey;
                    if (avatarUrl) {
                        avatarTexKey = "avatar_" + uid;
                    }
                    else {
                        avatarTexKey = "atlas_0";
                        avatarFrameKey = "hud/normal/avatar/defAvatar";
                    }
                    this._avatar = new Gameplay.Social.Avatar(avatarUrl, avatarTexKey, avatarFrameKey);
                }
                get score() { return this._score; }
                set score(score) { this._score = score; }
            }
            Social.Friend = Friend;
        })(Social = Gameplay.Social || (Gameplay.Social = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        class DayTime {
            constructor(timer) {
                this._timer = timer;
                this._objects = new Phaser.Structs.List(this);
            }
            get dayPos() { return this._dayPos; }
            get startDayTime() { return this._startDayTime; }
            get objects() { return this._objects; }
            get timer() { return this._timer; }
            reset(startPos) {
                this._startDayTime = (startPos == undefined ? DayTime.DAY_LENGTH * Phaser.Math.RND.realInRange(0, 0.99) : startPos);
                this._dayPos = this._startDayTime / DayTime.DAY_LENGTH;
                this._objects.each(this.resetObject, this);
                this._objects.each(this.updateObject, this);
            }
            update() {
                this._dayPos = ((this._startDayTime + this._timer.time) % DayTime.DAY_LENGTH) / DayTime.DAY_LENGTH;
                this._objects.each(this.updateObject, this);
            }
            resetObject(object) {
                object.reset();
            }
            updateObject(object) {
                let pointId = object.curTimePointId;
                let nextPointId = pointId + 1;
                if (pointId >= 0) {
                    nextPointId = pointId < object.timePoints.length - 1 ? pointId + 1 : 0;
                }
                else {
                    pointId = object.timePoints.length;
                    while (pointId-- != 0) {
                        if (object.timePoints[pointId] <= this._dayPos)
                            break;
                    }
                    if (pointId < 0)
                        pointId = object.timePoints.length - 1;
                    nextPointId = pointId + 1;
                    if (nextPointId == object.timePoints.length)
                        nextPointId = 0;
                }
                let progressToNextPoint;
                while (true) {
                    if (nextPointId != 0) {
                        progressToNextPoint = (this._dayPos - object.timePoints[pointId]) / (object.timePoints[nextPointId] - object.timePoints[pointId]);
                    }
                    else {
                        progressToNextPoint = (this._dayPos >= object.timePoints[pointId] ? this._dayPos - object.timePoints[pointId] : (1 - object.timePoints[pointId]) + this._dayPos) / ((1 - object.timePoints[pointId]) + object.timePoints[0]);
                    }
                    if (progressToNextPoint < 1)
                        break;
                    pointId = nextPointId;
                    if (++nextPointId == object.timePoints.length)
                        nextPointId = 0;
                }
                object.updateTime(pointId, nextPointId, progressToNextPoint);
            }
        }
        DayTime.DAY_LENGTH = 180 * 1000;
        Gameplay.DayTime = DayTime;
        class DayTimeObject {
            constructor(timePoints) {
                this._timePoints = timePoints;
            }
            get timePoints() { return this._timePoints; }
            get curTimePointId() { return this._curTimePointId; }
            reset() {
                this._curTimePointId = -1;
            }
        }
        Gameplay.DayTimeObject = DayTimeObject;
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        class MainScene extends Phaser.Scene {
            constructor() {
                super({
                    key: "gameplay",
                    physics: {},
                });
                MainScene._instance = this;
            }
            static get instance() { return MainScene._instance; }
            init(data) {
                this._initData = data;
            }
            create() {
                if (Game.Global.gameMode == 0) {
                    this._manager = new Gameplay.Normal.Manager(this._initData);
                }
                else {
                    this._manager = new Gameplay.Battle.Manager(this._initData);
                }
                Game.Global.scale.events.emit(Helpers.ScaleManager.EVENT_RESIZE, Game.Global.game.scale.width, Game.Global.game.scale.height);
                this._manager.reset(false);
            }
            update(time, delta) {
                this._manager.update(delta);
            }
        }
        Gameplay.MainScene = MainScene;
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        class Manager {
            constructor() {
                Manager._instance = this;
                Manager._timer = new Helpers.GameTimer();
                Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                if (Gamee2.Gamee.initialized) {
                    Gamee2.Gamee.events.on("pause", () => { Gameplay.MainScene.instance.sys.pause(); });
                    Gamee2.Gamee.events.on("resume", () => { Gameplay.MainScene.instance.sys.resume(); });
                    Gamee2.Gamee.events.on("audioChange", (on) => { Game.Global.game.sound.mute = !on; });
                }
            }
            static get instance() { return Manager._instance; }
            static get timer() { return Manager._timer; }
            get playTime() { return this._playTime; }
            get trunkGenerator() { return this._trunkGenerator; }
            get friends() { return this._friends; }
            reset(resetScene) {
                if (resetScene) {
                    let scene = Gameplay.MainScene.instance;
                    scene.tweens.killAll();
                    scene.time.removeAllEvents();
                }
                Manager._timer.start();
                this._playTime = 0;
                this._bg.reset();
                this._hud.reset();
            }
            update(delta) {
                Manager._timer.update(delta);
                if (this.isPlaying())
                    this._playTime += delta;
                this._bg.update();
            }
            applyTrunkBonus(bonus) { }
            handleResChange(w, h) {
                let camera = Gameplay.MainScene.instance.cameras.main;
                camera.setSize(w, h);
                camera.emit("cam_resize", camera, w, h, camera.scrollX, camera.scrollY);
            }
        }
        Gameplay.Manager = Manager;
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background_1) {
            class Background {
                constructor(depth, cameras) {
                    this._cameraFilter = ~cameras[0].id;
                    for (let i = 1; i < cameras.length; i++)
                        this._cameraFilter &= ~cameras[i].id;
                    this._leaves = new Background_1.Leaves(depth + 5, this._cameraFilter, Gameplay.Manager.timer);
                    new Background_1.Ground(depth + 6, this._cameraFilter);
                }
                get cameraFilter() { return this._cameraFilter; }
                reset() {
                    this._leaves.reset();
                }
                update() { }
            }
            Background_1.Background = Background;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            Background.ASSET_PREFIX = "bg/";
            class Ground {
                constructor(depth, cameraFilter) {
                    this._leftPart = null;
                    this._rightPart = null;
                    this._centerPart = Gameplay.MainScene.instance.add.image(0, Game.Global.CAMERA_HEIGHT, "atlas_0", Background.ASSET_PREFIX + "groundCenter")
                        .setDepth(depth)
                        .setOrigin(0, 1);
                    this._centerPart.cameraFilter = cameraFilter;
                    Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                handleResChange(w, h) {
                    this._centerPart.setX(Math.floor((w - this._centerPart.width) / 2));
                    if (this._centerPart.x > 0) {
                        if (!this._leftPart) {
                            this._leftPart = Gameplay.MainScene.instance.add.tileSprite(0, h, this._centerPart.x, Ground.SIDE_TILE_FRAME_H, "atlas_0", Background.ASSET_PREFIX + "groundLeft")
                                .setDepth(this._centerPart.depth)
                                .setOrigin(0, 1);
                            this._leftPart.cameraFilter = this._centerPart.cameraFilter;
                        }
                        else {
                            this._leftPart.setSize(this._centerPart.x, Ground.SIDE_TILE_FRAME_H)
                                .setVisible(true);
                        }
                        this._leftPart.tilePositionX = (this._leftPart.width <= Ground.SIDE_TILE_FRAME_W ? Ground.SIDE_TILE_FRAME_W - this._leftPart.width : -(this._leftPart.width % Ground.SIDE_TILE_FRAME_W));
                    }
                    else if (this._leftPart) {
                        this._leftPart.setVisible(false);
                    }
                    if (w > this._centerPart.x + this._centerPart.width) {
                        let x = this._centerPart.x + this._centerPart.width;
                        if (!this._rightPart) {
                            this._rightPart = Gameplay.MainScene.instance.add.tileSprite(x, Game.Global.CAMERA_HEIGHT, w - x, Ground.SIDE_TILE_FRAME_H, "atlas_0", Background.ASSET_PREFIX + "groundRight")
                                .setDepth(this._centerPart.depth)
                                .setOrigin(0, 1);
                            this._rightPart.cameraFilter = this._centerPart.cameraFilter;
                        }
                        else {
                            this._rightPart.setX(x)
                                .setSize(w - x, Ground.SIDE_TILE_FRAME_H)
                                .setVisible(true);
                        }
                    }
                    else if (this._rightPart) {
                        this._rightPart.setVisible(false);
                    }
                }
            }
            Ground.SIDE_TILE_FRAME_W = 256;
            Ground.SIDE_TILE_FRAME_H = 247;
            Background.Ground = Ground;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Sky extends Gameplay.DayTimeObject {
                constructor(depth, cameraFilter, worldY, frameKey, frameH) {
                    super(Sky.TIME_POINTS);
                    let scene = Gameplay.MainScene.instance;
                    this._frameKey = frameKey;
                    this._frameH = frameH;
                    this._img = [];
                    for (let i = 0; i < 2; i++) {
                        let bg = scene.add.tileSprite(0, worldY, Game.Global.game.scale.width, frameH, "atlas_0", Background.ASSET_PREFIX + frameKey + "0")
                            .setOrigin(0);
                        bg.cameraFilter = cameraFilter;
                        this._img.push(bg);
                    }
                    Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                updateTime(pointId, nextPointId, progressToNextPoint) {
                    if (this._curTimePointId != pointId) {
                        this._curTimePointId = pointId;
                        let w = Game.Global.game.scale.width;
                        this._img[0].setFrame(Background.ASSET_PREFIX + this._frameKey + pointId)
                            .setSize(w, this._frameH);
                        this._img[1].setFrame(Background.ASSET_PREFIX + this._frameKey + nextPointId)
                            .setSize(w, this._frameH);
                    }
                    this._img[1].alpha = Phaser.Math.Easing.Cubic.In(progressToNextPoint);
                }
                handleResChange(w, h) {
                    this._img.forEach((img) => {
                        img.setSize(w, this._frameH);
                    });
                }
            }
            Sky.TIME_POINTS = [0.2, 0.34, 0.42, 0.7, 0.88];
            Background.Sky = Sky;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Planet extends Gameplay.DayTimeObject {
                constructor(depth, cameraFilter, riseDayPos, setDayPos, frameNameBase) {
                    let timePoints = [];
                    if (riseDayPos < setDayPos) {
                        timePoints = [riseDayPos, riseDayPos + (setDayPos - riseDayPos) / 2, setDayPos];
                    }
                    else {
                        let middle = riseDayPos + ((1 - riseDayPos) + setDayPos) / 2;
                        if (middle > 1)
                            middle -= 1;
                        if (middle < setDayPos)
                            timePoints = [middle, setDayPos, riseDayPos];
                        else
                            timePoints = [setDayPos, riseDayPos, middle];
                    }
                    super(timePoints);
                    if (riseDayPos < setDayPos) {
                        this._riseTimePointId = 0;
                    }
                    else {
                        this._riseTimePointId = 1;
                    }
                    this._frameNameBase = Background.ASSET_PREFIX + frameNameBase + "_";
                    this._img = [];
                    for (let i = 0; i < 2; i++) {
                        let img = Gameplay.MainScene.instance.add.image(0, 0, "atlas_0", this._frameNameBase + i)
                            .setDepth(depth);
                        img.cameraFilter = cameraFilter;
                        this._img.push(img);
                    }
                }
                reset() {
                    super.reset();
                    this._img[0].visible = false;
                    this._img[1].visible = false;
                    this._state = 2;
                }
                updateTime(pointId, nextPointId, progressToNextPoint) {
                    if (pointId != this._curTimePointId) {
                        let i = this._riseTimePointId;
                        let state = 0;
                        while (i != pointId) {
                            if (++i == 3)
                                i = 0;
                            state++;
                        }
                        this._state = state;
                        if (state != 2) {
                            if (!this._img[0].visible) {
                                this._img[0].visible = true;
                                this._img[1].visible = true;
                            }
                            if (state == 0) {
                                this._img[0].setFrame(this._frameNameBase + "0");
                                this._img[1].setFrame(this._frameNameBase + "1");
                            }
                            else {
                                this._img[0].setFrame(this._frameNameBase + "1");
                                this._img[1].setFrame(this._frameNameBase + "0");
                            }
                        }
                        else {
                            this._img[0].visible = false;
                            this._img[1].visible = false;
                        }
                    }
                    if (this._img[0].visible) {
                        this._img[0].alpha = 1 - progressToNextPoint;
                        this._img[1].alpha = progressToNextPoint;
                    }
                    let progress = (this._state == 1 ? 0.5 : 0) + progressToNextPoint * 0.5;
                    let angle = Phaser.Math.DegToRad(Planet.RISE_ANGLE + (Planet.SET_ANGLE - Planet.RISE_ANGLE) * progress);
                    this._img[0].x = (Game.Global.game.scale.width / 2) + Math.cos(angle) * Planet.ORBIT_RADIUS;
                    this._img[0].y = Planet.ORBIT_CENTER_Y + Math.sin(angle) * Planet.ORBIT_RADIUS;
                    this._img[1].x = this._img[0].x;
                    this._img[1].y = this._img[0].y;
                }
            }
            Planet.ORBIT_CENTER_Y = 1000;
            Planet.ORBIT_RADIUS = 390;
            Planet.RISE_ANGLE = 175;
            Planet.SET_ANGLE = 365;
            Background.Planet = Planet;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Temple extends Gameplay.DayTimeObject {
                constructor(depth, cameraFilter) {
                    super(Background.Sky.TIME_POINTS);
                    this._img = Gameplay.MainScene.instance.add.image(0, 0, "atlas_0", Background.ASSET_PREFIX + "temple")
                        .setOrigin(0.5, 0)
                        .setPosition(0, 296)
                        .setDepth(depth);
                    this._img.cameraFilter = cameraFilter;
                    Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, (w) => { this._img.x = w / 2; }, this);
                }
                updateTime(pointId, nextPointId, progressToNextPoint) {
                    this._img.tint = Phaser.Display.Color.ObjectToColor(Phaser.Display.Color.Interpolate.ColorWithColor(Temple._colors[pointId], Temple._colors[nextPointId], 1, Phaser.Math.Easing.Cubic.In(progressToNextPoint))).color32;
                }
            }
            Temple._colors = [
                new Phaser.Display.Color(0xb3, 0x4b, 0xb1),
                new Phaser.Display.Color(0x64, 0x19, 0x6e),
                new Phaser.Display.Color(0xb3, 0x2b, 0x36),
                new Phaser.Display.Color(0x66, 0x42, 0x4c),
                new Phaser.Display.Color(0x36, 0x18, 0x34)
            ];
            Background.Temple = Temple;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Clouds extends Gameplay.DayTimeObject {
                constructor(depth, cameraFilter, timer) {
                    super(Background.Sky.TIME_POINTS);
                    this._timer = timer;
                    this._color = 0;
                    this._depth = depth;
                    this._freeClouds = new Collections.Pool(undefined, 6, true, () => {
                        let img = Gameplay.MainScene.instance.add.image(0, 0, "atlas_0")
                            .setActive(false)
                            .setVisible(false)
                            .setDepth(this._depth);
                        img.cameraFilter = cameraFilter;
                        return img;
                    }, this);
                    this._actClouds = new Collections.NodeList();
                }
                reset() {
                    super.reset();
                    this._actClouds.foreach((cloud) => {
                        this._freeClouds.returnItem(cloud.setVisible(false));
                    }, this);
                    this._actClouds.clear();
                    let nextCloudX = Phaser.Math.RND.integerInRange(-100, 100);
                    while (nextCloudX < Game.Global.game.scale.width) {
                        let cloud = this.addCloud(nextCloudX);
                        nextCloudX = cloud.x + this._nextCloudSpacing;
                    }
                }
                updateTime(pointId, nextPointId, progressToNextPoint) {
                    this._color = Phaser.Display.Color.ObjectToColor(Phaser.Display.Color.Interpolate.ColorWithColor(Clouds._colors[pointId], Clouds._colors[nextPointId], 1, Phaser.Math.Easing.Cubic.In(progressToNextPoint))).color32;
                    this._actClouds.foreach((cloud, node) => {
                        cloud.x -= cloud.getData("speed") * this._timer.delta;
                        if (cloud.x + cloud.width <= 0) {
                            cloud.visible = false;
                            this._freeClouds.returnItem(this._actClouds.removeByNode(node));
                        }
                        else {
                            cloud.tint = this._color;
                        }
                    }, this);
                    let nextCloudX = this._actClouds.last.x + this._nextCloudSpacing;
                    while (nextCloudX < Game.Global.game.scale.width)
                        nextCloudX = this.addCloud(nextCloudX).x + this._nextCloudSpacing;
                }
                addCloud(x) {
                    let rnd = Phaser.Math.RND;
                    let cloud = this._freeClouds.getItem();
                    this._actClouds.add(cloud);
                    cloud.setFrame(Clouds.FRAME_NAME_BASE + rnd.integerInRange(0, 2))
                        .setOrigin(0, 0)
                        .setTint(this._color)
                        .setVisible(true);
                    cloud.setData("speed", rnd.realInRange(Clouds.SPEED_MIN, Clouds.SPEED_MAX));
                    cloud.setPosition(x, rnd.integerInRange(Clouds.Y_MIN, Clouds.Y_MAX - cloud.displayHeight));
                    this._nextCloudSpacing = rnd.realInRange(Clouds.H_SPACING_MIN, Clouds.H_SPACING_MAX) * cloud.displayWidth;
                    return cloud;
                }
            }
            Clouds.FRAME_NAME_BASE = Background.ASSET_PREFIX + "cloud_";
            Clouds.SPEED_MIN = 0.2;
            Clouds.SPEED_MAX = 1.0;
            Clouds.Y_MIN = -10;
            Clouds.Y_MAX = 500;
            Clouds.H_SPACING_MIN = 0.5;
            Clouds.H_SPACING_MAX = 1.5;
            Clouds._colors = [
                new Phaser.Display.Color(0xed, 0x60, 0x69),
                new Phaser.Display.Color(0xfa, 0xcd, 0xa4),
                new Phaser.Display.Color(0xff, 0xff, 0xff),
                new Phaser.Display.Color(0x50, 0x22, 0xa6),
                new Phaser.Display.Color(0x13, 0x09, 0x26)
            ];
            Background.Clouds = Clouds;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Fog {
                constructor(depth, cameraFilter, level) {
                    this._img = Gameplay.MainScene.instance.add.tileSprite(0, Game.Global.CAMERA_HEIGHT - Fog.SPRITE_H, Game.Global.game.scale.width, Fog.SPRITE_H, "atlas_0", "fx/fog")
                        .setDepth(depth)
                        .setOrigin(0);
                    this._img.cameraFilter = cameraFilter;
                    this._level = -1;
                    this.level = level;
                    Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                get level() { return this._level; }
                set level(level) {
                    if (this._level != level) {
                        if ((this._level = level) == 0) {
                            this._img.visible = false;
                        }
                        else {
                            this._img.tilePositionY = Math.round((Fog.FRAME_H - Fog.SPRITE_H) - (Fog.FRAME_H - Fog.SPRITE_H) * ((level - 1) / (Fog.MAX_LEVEL - 1)));
                            this._img.visible = true;
                        }
                    }
                }
                handleResChange(w) {
                    this._img.width = w;
                }
            }
            Fog.FRAME_H = 709;
            Fog.SPRITE_H = 560;
            Fog.MAX_LEVEL = 4;
            Background.Fog = Fog;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Leaf {
                constructor(manager) {
                    this._manager = manager;
                    this._image = Gameplay.MainScene.instance.add.image(0, 0, "atlas_0")
                        .setDepth(manager.depth);
                    this._image.cameraFilter = manager.cameraFilter;
                }
                reset(fallFromTop = true) {
                    let rnd = Phaser.Math.RND;
                    let spawnArea = this._manager.spawnArea;
                    let lifePos = fallFromTop ? 0 : Math.random();
                    this._x = rnd.realInRange(spawnArea.left, spawnArea.right);
                    this._angle = rnd.realInRange(Leaf.MIN_ANGLE, Leaf.MAX_ANGLE);
                    this._swingRange = rnd.integerInRange(Leaf.SWING_MIN_RANGE, Leaf.SWING_MAX_RANGE);
                    this._fallLen = rnd.integerInRange(Leaf.MIN_FALL_LEN, Leaf.MAX_FALL_LEN);
                    this._fallStartTime = this._manager.timer.time - Math.round(lifePos * this._fallLen);
                    this._image.setPosition(this._x, fallFromTop ? spawnArea.top : spawnArea.top + lifePos * spawnArea.height)
                        .setFrame(Leaf.FRAME_NAME_BASE + Phaser.Math.RND.integerInRange(0, 2))
                        .setAlpha(rnd.realInRange(0.5, 1));
                }
                update(time) {
                    time = time - this._fallStartTime;
                    let lifePos = time / this._fallLen;
                    if (lifePos >= 1) {
                        this.reset(true);
                        return;
                    }
                    let spawnArea = this._manager.spawnArea;
                    let i = time % (Leaf.SWING_LEN * 2);
                    if (i > Leaf.SWING_LEN)
                        i = Leaf.SWING_LEN - (i - Leaf.SWING_LEN);
                    i = Phaser.Math.Easing.Sine.InOut(i / Leaf.SWING_LEN);
                    this._image.setPosition(this._x - (this._swingRange >> 1) + (this._swingRange * i), spawnArea.top + (lifePos * spawnArea.height))
                        .setAngle(this._angle + Leaf.MIN_ANGLE + (60 * i));
                }
            }
            Leaf.FRAME_NAME_BASE = Background.ASSET_PREFIX + "leaf_";
            Leaf.MIN_ANGLE = -30;
            Leaf.MAX_ANGLE = 30;
            Leaf.MIN_FALL_LEN = 5000;
            Leaf.MAX_FALL_LEN = 20000;
            Leaf.SWING_LEN = 1000;
            Leaf.SWING_MIN_RANGE = 50;
            Leaf.SWING_MAX_RANGE = 100;
            Background.Leaf = Leaf;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Leaves {
                constructor(depth, cameraFilter, timer) {
                    this._cameraFilter = cameraFilter;
                    this._depth = depth;
                    this._timer = timer;
                    this._spawnArea = new Phaser.Geom.Rectangle(-20, -10, 0, 760);
                    this._leaves = [];
                    for (let i = 0; i < Leaves.LEAF_CNT; i++)
                        this._leaves.push(new Background.Leaf(this));
                    timer.events.on(Helpers.GameTimer.EVENT_UPDATE, this.handleTimerUpdate, this);
                    Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                get spawnArea() { return this._spawnArea; }
                get timer() { return this._timer; }
                get cameraFilter() { return this._cameraFilter; }
                get depth() { return this._depth; }
                reset() {
                    for (let i = 0; i < this._leaves.length; i++)
                        this._leaves[i].reset(false);
                }
                handleTimerUpdate(timer) {
                    let i = this._leaves.length;
                    let time = timer.time;
                    while (i-- != 0)
                        this._leaves[i].update(time);
                }
                handleResChange(w, h) {
                    this._spawnArea.width = w + 20;
                }
            }
            Leaves.LEAF_CNT = 10;
            Background.Leaves = Leaves;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Fireflies extends Gameplay.DayTimeObject {
                constructor(depth, cameraFilter, timer) {
                    super(Fireflies.TIME_POINTS);
                    this._timer = timer;
                    this._spawnArea = new Phaser.Geom.Rectangle(0, Fireflies.MIN_Y, 0, Fireflies.MAX_Y - Fireflies.MIN_Y);
                    this._blitter = Gameplay.MainScene.instance.add.blitter(0, 0, "atlas_0", Background.ASSET_PREFIX + "firefly")
                        .setDepth(depth);
                    this._blitter.cameraFilter = cameraFilter;
                    this._swarms = [];
                    let remCnt = Fireflies.TOTAL_CNT;
                    while (remCnt > 0) {
                        let swarmSize = Phaser.Math.RND.integerInRange(Fireflies.SWARM_MIN_SIZE, Fireflies.SWARM_MAX_SIZE);
                        this._swarms.push(new Background.FireflySwarm(this, this._blitter, swarmSize));
                        remCnt -= swarmSize;
                    }
                    this._timePointId = -1;
                    Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                }
                get timer() { return this._timer; }
                get spawnArea() { return this._spawnArea; }
                updateTime(pointId, nextPointId, progressToNextPoint) {
                    if (pointId == 0) {
                        if (pointId != this._timePointId) {
                            this._timePointId = pointId;
                            this._blitter.visible = false;
                        }
                    }
                    else {
                        if (pointId != this._timePointId) {
                            this._timePointId = pointId;
                            this._blitter.visible = true;
                            let i = this._swarms.length;
                            while (i-- != 0)
                                this._swarms[i].reset();
                        }
                        let i = this._swarms.length;
                        let alpha = 1;
                        if (progressToNextPoint < 0.2) {
                            alpha = progressToNextPoint / 0.2;
                        }
                        else if (progressToNextPoint > 0.8) {
                            alpha = 1 - ((progressToNextPoint - 0.8) / 0.2);
                        }
                        while (i-- != 0)
                            this._swarms[i].update(alpha);
                    }
                }
                handleResChange(w) {
                    this._spawnArea.left = -18;
                    this._spawnArea.right = w + 18;
                    let i = this._swarms.length;
                    while (i-- != 0)
                        this._swarms[i].respawn();
                }
            }
            Fireflies.MIN_Y = 450;
            Fireflies.MAX_Y = 740;
            Fireflies.SWARM_MIN_SIZE = 6;
            Fireflies.SWARM_MAX_SIZE = 10;
            Fireflies.TOTAL_CNT = 30;
            Fireflies.TIME_POINTS = [0.2, 0.84];
            Background.Fireflies = Fireflies;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class Firefly {
                constructor(blitter) {
                    this.bob = blitter.create(0, 0);
                }
                reset(x, y) {
                    this.alpha = 0.1 + Math.random() * 0.9;
                    this.moveScaleX = 0.5 + Math.random();
                    if (Math.random() < 0.5)
                        this.moveScaleX *= -1;
                    this.moveScaleY = 0.5 * Math.random();
                    if (Math.random() < 0.5)
                        this.moveScaleY *= -1;
                    this.bob.x = x;
                    this.bob.y = y;
                    this.bob.alpha = 0;
                }
            }
            Background.Firefly = Firefly;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Background;
        (function (Background) {
            class FireflySwarm {
                constructor(manager, blitter, swarmSize) {
                    this._manager = manager;
                    this._members = [];
                    while (swarmSize-- != 0)
                        this._members.push(new Background.Firefly(blitter));
                    this._moveTotalOffset = new Phaser.Geom.Point();
                    this._moveCurOffset = new Phaser.Geom.Point();
                }
                reset() {
                    if (Math.random() < 0.5) {
                        this._state = 0;
                        this._moveStartTime = Phaser.Math.RND.integerInRange(FireflySwarm.MIN_MOVE_DELAY, FireflySwarm.MAX_MOVE_DELAY);
                    }
                    else {
                        this.setMoveProps();
                        let progress = Math.random() * 0.9;
                        this._moveStartTime = this._manager.timer.time - (progress * this._moveTime);
                        this._moveCurOffset.setTo(this._moveTotalOffset.x * progress, this._moveTotalOffset.y * progress);
                        this._state = 1;
                    }
                    this.respawn();
                }
                respawn() {
                    let spawnArea = this._manager.spawnArea;
                    let memId = this._members.length;
                    while (memId-- != 0) {
                        this._members[memId].reset(spawnArea.left + Math.random() * spawnArea.width, spawnArea.top + Math.random() * spawnArea.height);
                    }
                }
                update(alpha) {
                    let elapsedTime = this._manager.timer.time;
                    let spawnArea = this._manager.spawnArea;
                    let stepX = 0;
                    let stepY = 0;
                    if (this._state == 0) {
                        if (elapsedTime >= this._moveStartTime) {
                            this.setMoveProps();
                            this._moveStartTime = elapsedTime;
                            this._moveCurOffset.setTo(0, 0);
                            this._state = 1;
                        }
                    }
                    else {
                        let moveProgress = (elapsedTime - this._moveStartTime) / this._moveTime;
                        if (moveProgress > 1)
                            moveProgress = 1;
                        let newOffsetX = moveProgress * this._moveTotalOffset.x;
                        let newOffsetY = moveProgress * this._moveTotalOffset.y;
                        stepX = newOffsetX - this._moveCurOffset.x;
                        stepY = newOffsetY - this._moveCurOffset.y;
                        this._moveCurOffset.x = newOffsetX;
                        this._moveCurOffset.y = newOffsetY;
                        if (moveProgress == 1)
                            this._state = 0;
                    }
                    let id = this._members.length;
                    let blinkId = Phaser.Math.RND.integerInRange(0, 4 * id);
                    while (id-- != 0) {
                        let member = this._members[id];
                        let bob = member.bob;
                        if (this._state == 1) {
                            bob.x += stepX * member.moveScaleX;
                            if (bob.x < spawnArea.left) {
                                bob.x = spawnArea.right;
                            }
                            else if (bob.x > spawnArea.right) {
                                bob.x = spawnArea.left;
                            }
                            bob.y += stepY * member.moveScaleY;
                        }
                        if (id == blinkId) {
                            let newAlpha = member.alpha + Phaser.Math.RND.realInRange(-0.15, 0.15);
                            if (newAlpha < 0.1) {
                                newAlpha = 0.1;
                            }
                            if (newAlpha > 1) {
                                newAlpha = 1;
                            }
                            member.alpha = newAlpha;
                        }
                        bob.alpha = alpha * member.alpha;
                    }
                }
                setMoveProps() {
                    let dir = Phaser.Math.DegToRad(Math.random() * 360);
                    let dis = FireflySwarm.MIN_MOVE_DISTANCE + (Math.random() * (FireflySwarm.MAX_MOVE_DISTANCE - FireflySwarm.MIN_MOVE_DISTANCE));
                    this._moveTotalOffset.setTo(Math.cos(dir) * dis, -Math.sin(dir) * dis);
                    let speedPerPixel = FireflySwarm.MIN_MOVE_SPEED + Math.random() * (FireflySwarm.MAX_MOVE_SPEED - FireflySwarm.MIN_MOVE_SPEED);
                    this._moveTime = speedPerPixel * dis;
                }
            }
            FireflySwarm.MIN_MOVE_DELAY = 0;
            FireflySwarm.MAX_MOVE_DELAY = 2000;
            FireflySwarm.MIN_MOVE_DISTANCE = 5;
            FireflySwarm.MAX_MOVE_DISTANCE = 15;
            FireflySwarm.MIN_MOVE_SPEED = 300;
            FireflySwarm.MAX_MOVE_SPEED = 25;
            Background.FireflySwarm = FireflySwarm;
        })(Background = Gameplay.Background || (Gameplay.Background = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        class PlayerGroup {
            constructor(id, camera, depth, assetId, trunkGenerator, fallingBonuses) {
                this._id = id;
                this._score = 0;
                this._camera = camera;
                this._depth = depth;
                this._assetId = assetId;
                this._events = new Phaser.Events.EventEmitter();
                this._trunk = new Gameplay.Trunk.Trunk(this, trunkGenerator);
                this._player = new Gameplay.Player.Player(this);
                this._fallingBonuses = fallingBonuses ? new Gameplay.Bonuses.Falling.Manager(this) : null;
            }
            get id() { return this._id; }
            get events() { return this._events; }
            get camera() { return this._camera; }
            get depth() { return this._depth; }
            get assetId() { return this._assetId; }
            get visible() { return this._trunk.visible && this._player.visible; }
            set visible(visible) {
                this._trunk.visible = visible;
                this._player.visible = visible;
            }
            get score() { return this._score; }
            get scoreMultiplier() { return this._scoreMultiplier; }
            get hitEnergy() { return this._hitEnergy; }
            set hitEnergy(value) { this._hitEnergy = value; }
            get trunk() { return this._trunk; }
            get player() { return this._player; }
            get controller() { return this._controller; }
            set controller(controller) {
                if (this._controller != controller) {
                    this._controller = controller;
                    this._controller.player = this._player;
                }
            }
            get fallingBonuses() { return this._fallingBonuses; }
            reset() {
                this._score = 0;
                this._scoreMultiplier = 1;
                this._hitEnergy = 0.025;
                this._trunk.reset();
                this._player.reset();
                this._controller.reset();
                if (this._fallingBonuses)
                    this._fallingBonuses.reset();
            }
            update() {
                this._trunk.update();
                this._player.update();
                this._controller.update();
                if (this._fallingBonuses)
                    this._fallingBonuses.update();
                if (this._scoreMultiplier != 1 && this._scoreMultiplierEndTime <= Gameplay.Manager.timer.time) {
                    this._scoreMultiplier = 1;
                    this._events.emit(PlayerGroup.EVENT_SCORE_MULTIPLIER_CHANGE, this, this._scoreMultiplier);
                }
            }
            addScore(value) {
                this._score += value;
                if (this._id == 0 && Gamee2.Gamee.initialized)
                    Gamee2.Gamee.score = this._score;
                this._events.emit(PlayerGroup.EVENT_SCORE_CHANGE, this, this._score);
                return this._score;
            }
            setScoreMultiplier(multiplier) {
                this._scoreMultiplier = multiplier;
                this._scoreMultiplierEndTime = Gameplay.Manager.timer.time + 5000;
                this._events.emit(PlayerGroup.EVENT_SCORE_MULTIPLIER_CHANGE, this, multiplier);
            }
        }
        PlayerGroup.EVENT_SCORE_CHANGE = "pl_scoreChange";
        PlayerGroup.EVENT_SCORE_MULTIPLIER_CHANGE = "pl_scoreMultiChange";
        Gameplay.PlayerGroup = PlayerGroup;
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Player;
        (function (Player) {
            var Controllers;
            (function (Controllers) {
                class Controller {
                    constructor(type) {
                        this._type = type;
                    }
                    get type() { return this._type; }
                    set player(player) { this._player = player; }
                    get player() { return this._player; }
                    reset() { }
                    update() { }
                }
                Controllers.Controller = Controller;
            })(Controllers = Player.Controllers || (Player.Controllers = {}));
        })(Player = Gameplay.Player || (Gameplay.Player = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Player;
        (function (Player) {
            var Controllers;
            (function (Controllers) {
                class Human extends Controllers.Controller {
                    constructor(leftKey, rightKey) {
                        super(0);
                        let scene = Gameplay.MainScene.instance;
                        this._keyL = scene.input.keyboard.addKey(leftKey, true, false);
                        this._keyL.on(Phaser.Input.Keyboard.Events.DOWN, () => {
                            this.hit(1);
                        }, this);
                        this._keyR = scene.input.keyboard.addKey(rightKey, true, false);
                        this._keyR.on(Phaser.Input.Keyboard.Events.DOWN, () => {
                            this.hit(-1);
                        }, this);
                        scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
                            let camera = pointer.camera;
                            this.hit(pointer.worldX < camera.scrollX + camera.width / 2 ? 1 : -1);
                        }, this);
                    }
                }
                class HumanBattle extends Human {
                    constructor(leftKey, rightKey) {
                        super(leftKey, rightKey);
                        this._commands = new Controllers.CommandManager(false);
                    }
                    get commands() { return this._commands; }
                    reset() {
                        super.reset();
                        this._commands.reset();
                    }
                    hit(dir) {
                        if (Gameplay.Manager.instance.isPlaying() && this._player.hit(dir))
                            this._commands.addCommand(Gameplay.Manager.instance.playTime, dir);
                    }
                }
                Controllers.HumanBattle = HumanBattle;
                class HumanNormal extends Human {
                    constructor(leftKey, rightKey) {
                        super(leftKey, rightKey);
                        this._enabled = true;
                    }
                    get enabled() { return this._enabled; }
                    set enabled(enabled) { this._enabled = enabled; }
                    reset() {
                        super.reset();
                        this._enabled = true;
                    }
                    hit(dir) {
                        if (this._enabled) {
                            if (Gameplay.Manager.instance.state != 5) {
                                if (Gameplay.Manager.instance.isPlaying())
                                    this._player.hit(dir);
                            }
                            else {
                                if (!Gameplay.Normal.HUD.BattleButton.instance || Gameplay.Normal.HUD.BattleButton.instance.state != 1) {
                                    Gameplay.Manager.instance.startPlaying();
                                    this._player.hit(dir);
                                }
                            }
                        }
                    }
                }
                Controllers.HumanNormal = HumanNormal;
            })(Controllers = Player.Controllers || (Player.Controllers = {}));
        })(Player = Gameplay.Player || (Gameplay.Player = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Player;
        (function (Player) {
            var Controllers;
            (function (Controllers) {
                class AI extends Controllers.Controller {
                    constructor() {
                        super(1);
                    }
                    getEstimateScore() {
                        let score = 10 / ((this._minHitDelay + this._maxHitDelay) / 2);
                        return Math.round(score * Math.min(Gameplay.Manager.instance.settings.battleLen * 1000, (this._minLifeLen + Phaser.Math.RND.integerInRange(5000, 12500))));
                    }
                    init(minLifeLen, hitsPerSec) {
                        this._minLifeLen = minLifeLen * 1000;
                        let hitInterval = 1000 / hitsPerSec;
                        this._minHitDelay = hitInterval - (hitInterval * 0.2);
                        this._maxHitDelay = hitInterval + (hitInterval * 0.2);
                        this.reset();
                    }
                    reset() {
                        super.reset();
                        this._nextHitTime = Phaser.Math.RND.integerInRange(this._minHitDelay, this._maxHitDelay);
                    }
                    update() {
                        let manager = Gameplay.Manager.instance;
                        let trunk = this._player.group.trunk;
                        if (trunk.idle && manager.isPlaying && manager.playTime >= this._nextHitTime) {
                            let success = true;
                            let afterlifeLen = manager.playTime - this._minLifeLen;
                            if (afterlifeLen > 0) {
                                if (Phaser.Math.RND.realInRange(0, 1) > 1 - Math.min(1, (afterlifeLen / 10000)) * 0.5)
                                    success = false;
                            }
                            let block = trunk.getBlock(0);
                            if (block.branchSide == 0)
                                block = trunk.getBlock(1);
                            let hitDir = (block.branchSide == 1 ? -1 : 1);
                            if (!success)
                                hitDir *= -1;
                            this._player.hit(hitDir);
                            this._nextHitTime = manager.playTime + Phaser.Math.RND.integerInRange(this._minHitDelay, this._maxHitDelay);
                        }
                    }
                }
                Controllers.AI = AI;
            })(Controllers = Player.Controllers || (Player.Controllers = {}));
        })(Player = Gameplay.Player || (Gameplay.Player = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Player;
        (function (Player) {
            var Controllers;
            (function (Controllers) {
                class Ghost extends Controllers.Controller {
                    constructor() {
                        super(2);
                        this._commands = new Controllers.CommandManager(true);
                    }
                    get commands() { return this._commands; }
                    reset() {
                        super.reset();
                        this._commandId = 0;
                    }
                    update() {
                        let commands = this._commands.commands;
                        if (this._commandId < commands.size) {
                            let nextCmd = commands.getItemAtIndex(this._commandId);
                            if (nextCmd.time <= Gameplay.Manager.instance.playTime) {
                                this._player.hit(nextCmd.command);
                                this._commandId++;
                            }
                        }
                    }
                }
                Controllers.Ghost = Ghost;
            })(Controllers = Player.Controllers || (Player.Controllers = {}));
        })(Player = Gameplay.Player || (Gameplay.Player = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Player;
        (function (Player) {
            var Controllers;
            (function (Controllers) {
                class Command {
                    get time() { return this._time; }
                    get command() { return this._command; }
                    init(time, command) {
                        this._time = Math.round(time);
                        this._command = command;
                        return this;
                    }
                }
                Controllers.Command = Command;
                class CommandManager {
                    constructor(readonly) {
                        this._commands = new Collections.WrappedArray();
                        if (!readonly)
                            this._freeCommands = new Collections.Pool(Command, 10, true);
                    }
                    get commands() { return this._commands; }
                    reset() {
                        if (!this._commands.empty) {
                            if (this._freeCommands) {
                                this._commands.forEach((cmd) => {
                                    this._freeCommands.returnItem(cmd);
                                }, this);
                            }
                            this._commands.clear();
                        }
                    }
                    load(data) {
                        this._commands.clear();
                        let buf = new DataView(Helpers.Buffer.base64ToAb(data));
                        let bufPos = 0;
                        let cmdCnt = buf.getUint16(0, false);
                        bufPos += 2;
                        let mask;
                        let bufDirOffset = cmdCnt * 4 + 2;
                        for (let cmdId = 0; cmdId < cmdCnt; cmdId++) {
                            let cmd = new Command();
                            if (cmdId % 8 == 0)
                                mask = buf.getUint8(bufDirOffset++);
                            this._commands.add(cmd.init(buf.getUint32(bufPos, false), (mask & (1 << (cmdId % 8))) == 0 ? -1 : 1));
                            bufPos += 4;
                        }
                    }
                    save() {
                        let buf = new DataView(new ArrayBuffer((this._commands.size * 4) + Math.ceil(this._commands.size / 8) + 2));
                        let bufPos = 0;
                        buf.setUint16(0, this._commands.size, false);
                        bufPos += 2;
                        this._commands.forEach((cmd) => {
                            buf.setUint32(bufPos, cmd.time, false);
                            bufPos += 4;
                        });
                        let mask = 0;
                        let cmdId = 0;
                        this._commands.forEach((cmd) => {
                            if (cmd.command > 0)
                                mask |= (1 << (cmdId % 8));
                            if (++cmdId % 8 == 0) {
                                buf.setUint8(bufPos++, mask);
                                mask = 0;
                            }
                        });
                        if (cmdId % 8 != 0)
                            buf.setUint8(bufPos++, mask);
                        return Helpers.Buffer.abToBase64(buf.buffer, bufPos);
                    }
                    addCommand(time, dir) {
                        this._commands.add(this._freeCommands.getItem().init(time, dir));
                    }
                }
                Controllers.CommandManager = CommandManager;
            })(Controllers = Player.Controllers || (Player.Controllers = {}));
        })(Player = Gameplay.Player || (Gameplay.Player = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Player;
        (function (Player) {
            class CharacterProgress {
                constructor(chars, group, totalBlockCnt) {
                    this._characters = chars;
                    this._charBlockCnt = 0;
                    this._totalBlockCnt = totalBlockCnt;
                    let blockCnt = totalBlockCnt;
                    let blocksPerBelt = chars[0].blocksPerBelt[0];
                    let charId = 0;
                    let beltId = 0;
                    let charBlockCnt = 0;
                    while (true) {
                        if (blockCnt < blocksPerBelt)
                            break;
                        blockCnt -= blocksPerBelt;
                        charBlockCnt += blocksPerBelt;
                        if (++beltId == chars[charId].blocksPerBelt.length) {
                            charBlockCnt = 0;
                            if (charId == chars.length - 1) {
                                this._nextLevelRemBlockCnt = -1;
                                beltId--;
                                break;
                            }
                            charId++;
                            beltId = 0;
                        }
                        blocksPerBelt = chars[charId].blocksPerBelt[beltId];
                    }
                    this._charId = charId;
                    this._charBlockCnt = charBlockCnt + blockCnt;
                    this._beltId = beltId;
                    if (this._nextLevelRemBlockCnt == undefined) {
                        this._nextLevelRemBlockCnt = this.character.blocksPerBelt[this._beltId] - blockCnt;
                        group.events.on(Gameplay.Trunk.Trunk.EVENT_BLOCK_DESTROYED, this.handleTrunkBlockDestroyed, this);
                    }
                }
                get character() { return this._characters[this._charId]; }
                get beltId() { return this._beltId; }
                get totalBlockCnt() { return this._totalBlockCnt; }
                get progress() {
                    if (this._nextLevelRemBlockCnt >= 0) {
                        let reqBlockCnt = this.character.blocksPerBelt[this._beltId];
                        return (reqBlockCnt - this._nextLevelRemBlockCnt) / reqBlockCnt;
                    }
                    return 1;
                }
                reapplyCharMods() {
                    this._charNextModId = 0;
                    this.applyCharMods();
                }
                handleTrunkBlockDestroyed(trunk, block, hitDir, deadly) {
                    if (deadly || this._nextLevelRemBlockCnt <= 0)
                        return;
                    this._nextLevelRemBlockCnt--;
                    this._totalBlockCnt++;
                    this._charBlockCnt++;
                    Gameplay.MainScene.instance.events.emit(CharacterProgress.EVENT_PROGRESS_CHANGE, this, this.progress);
                    if (this._nextLevelRemBlockCnt == 0) {
                        if (++this._beltId == this.character.belts.length) {
                            if (this._charId < this._characters.length - 1) {
                                this._charId++;
                                this._charBlockCnt = 0;
                                this._charNextModId = 0;
                                this._beltId = 0;
                            }
                            else {
                                this._beltId--;
                                this._nextLevelRemBlockCnt = -1;
                            }
                        }
                        if (this._nextLevelRemBlockCnt == 0) {
                            this._nextLevelRemBlockCnt = this.character.blocksPerBelt[this._beltId];
                            Gameplay.MainScene.instance.events.emit(CharacterProgress.EVENT_NEW_LEVEL, this);
                        }
                    }
                    this.applyCharMods();
                }
                applyCharMods() {
                    let charMods = this.character.gameplayModifiers;
                    while (this._charNextModId < charMods.length && charMods[this._charNextModId].pos <= this._charBlockCnt)
                        charMods[this._charNextModId++].apply();
                }
            }
            CharacterProgress.EVENT_PROGRESS_CHANGE = "charProg_progress";
            CharacterProgress.EVENT_NEW_LEVEL = "charProg_newLevel";
            Player.CharacterProgress = CharacterProgress;
        })(Player = Gameplay.Player || (Gameplay.Player = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Player;
        (function (Player) {
            class Character {
                constructor(uid, height, hitStrength, trunkHOffset, animHOffsets, animVOffsets, belts, blocksPerBelt, hasBelt, trunkRootHeight, blockBranchVOffset, scoreMulti, beltScoreMultiInc, trunkBonuses, gameplayModifiers) {
                    this._uid = uid;
                    this._height = height;
                    this._hitStrength = hitStrength;
                    this._trunkHOffset = trunkHOffset;
                    this._animHOffsets = animHOffsets;
                    this._animVOffsets = animVOffsets;
                    this._belts = belts;
                    this._blocksPerBelt = blocksPerBelt;
                    this._hasBelt = hasBelt;
                    this._trunkRootHeight = trunkRootHeight;
                    this._branchVOffset = blockBranchVOffset;
                    this._scoreMulti = scoreMulti;
                    this._beltScoreMultiInc = beltScoreMultiInc;
                    this._trunkBonuses = trunkBonuses;
                    this._gameplayModifiers = gameplayModifiers;
                }
                get uid() { return this._uid; }
                get height() { return this._height; }
                get trunkHOffset() { return this._trunkHOffset; }
                get trunkRootHeight() { return this._trunkRootHeight; }
                get branchVOffset() { return this._branchVOffset; }
                get belts() { return this._belts; }
                get hasBelt() { return this._hasBelt; }
                get blocksPerBelt() { return this._blocksPerBelt; }
                get trunkBonuses() { return this._trunkBonuses; }
                get gameplayModifiers() { return this._gameplayModifiers; }
                get hitStrength() { return this._hitStrength; }
                getAnimHOffset(anim) {
                    return this._animHOffsets[anim];
                }
                getAnimVOffset(anim) {
                    return this._animVOffsets[anim];
                }
                getScoreMultiplier(beltId) {
                    return this._scoreMulti + beltId * this._beltScoreMultiInc;
                }
            }
            Player.Character = Character;
        })(Player = Gameplay.Player || (Gameplay.Player = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Player;
        (function (Player_1) {
            class Player {
                constructor(group) {
                    let scene = group.camera.scene;
                    this._group = group;
                    this._character = null;
                    this._beltId = -1;
                    this._state = -1;
                    this._container = new Controls.Group.Group(true)
                        .setDepth(group.depth + 6)
                        .setCameraFilter(~group.camera.id);
                    if (Game.Global.gameMode == 0) {
                        this._godModeFx = this._container.add(scene.add.sprite(0, 0, "atlas_0", "fx/fire/0")
                            .setOrigin(0.5, 1));
                        scene.anims.create({
                            key: "fireFx",
                            frames: scene.anims.generateFrameNames("atlas_0", { prefix: "fx/fire/", end: 5 }),
                            frameRate: 15,
                            repeat: -1
                        });
                    }
                    this._shadowSprite = scene.add.sprite(0, 0, "atlas_1")
                        .setOrigin(0.5, 0.95)
                        .setScale(1, -0.75)
                        .setTint(0)
                        .setAlpha(0.25);
                    this._container.add(this._shadowSprite);
                    this._charSprite = scene.add.sprite(0, 0, "atlas_1")
                        .setOrigin(0.5, 1);
                    this._charSprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.handleAnimComplete, this);
                    this._container.add(this._charSprite);
                    this._beltSprite = scene.add.sprite(0, 0, "atlas_1")
                        .setOrigin(0.5, 1)
                        .setTint(0xFF0000);
                    this._container.add(this._beltSprite);
                    if (Game.Global.gameMode == 1) {
                        this._dizzyFx = this._container.add(scene.add.sprite(0, 0, "atlas_0", "fx/dizzy/" + group.assetId + "/0")
                            .setVisible(false));
                        scene.anims.create({
                            key: "dizzyFx_" + group.assetId,
                            frames: scene.anims.generateFrameNames("atlas_0", { prefix: "fx/dizzy/" + group.assetId + "/", end: 2 }),
                            frameRate: 10,
                            repeat: -1
                        });
                    }
                    group.events.on(Gameplay.Trunk.Trunk.EVENT_POS_CHANGE, this.setPosition, this);
                }
                get group() { return this._group; }
                get character() { return this._character; }
                get y() { return this._container.y; }
                get visible() { return this._container.visible; }
                set visible(visible) { this._container.visible = visible; }
                get beltId() { return this._beltId; }
                get scoreMultiplier() { return this.character.getScoreMultiplier(this._beltId); }
                get hitCnt() { return this._hitCnt; }
                get state() { return this._state; }
                get death() { return this._state == 2 || this._state == 3; }
                get trunkSide() { return this._charSprite.flipX ? 1 : -1; }
                reset() {
                    this._charSprite.flipX = false;
                    this._beltSprite.flipX = false;
                    this._shadowSprite.flipX = false;
                    this.setState(0);
                    this.setPosition();
                    this._dizzyMode = false;
                    if (this._dizzyFx) {
                        this._dizzyFx.visible = false;
                        this._dizzyFx.content.anims.stop();
                    }
                    this._godMode = false;
                    if (this._godModeFx) {
                        this._godModeFx.visible = false;
                        this._godModeFx.content.anims.stop();
                    }
                    this._hitCnt = 0;
                }
                update() {
                    if (this._state == 0 || this._state == 1) {
                        if (this._godMode)
                            this.processGodMode();
                        if (this._dizzyMode && Gameplay.Manager.timer.time >= this._dizzyEndTime) {
                            this._dizzyFx.content.anims.stop();
                            this._dizzyFx.visible = false;
                            this._dizzyMode = false;
                        }
                    }
                    else if (this._state == 3) {
                        if (this._group.trunk.idle)
                            this.kill(1);
                    }
                }
                hit(dir) {
                    if ((this._state == 0 || this._state == 1) && !this._godMode && !this._dizzyMode) {
                        this._hitCnt++;
                        this.hitTrunk(dir);
                        return true;
                    }
                    return false;
                }
                kill(reason) {
                    if (this._state == 2)
                        return;
                    this.setState(2);
                    this._reasonOfDeath = reason;
                    Game.Global.game.sound.playAudioSprite("sfx", "death");
                }
                revive() {
                    if (this._reasonOfDeath == 1) {
                        let flipX = !this._charSprite.flipX;
                        this._charSprite.flipX = flipX;
                        this._beltSprite.flipX = flipX;
                        this._shadowSprite.flipX = flipX;
                    }
                    this.setState(0);
                }
                setCharacter(character) {
                    if (this._character && this._character.uid == character.uid)
                        return;
                    let emitEvent = this._character != null;
                    let scene = Gameplay.MainScene.instance;
                    let assetsId = character.uid;
                    let keySuffix = "_" + this._group.id;
                    this._charSprite.anims.stop();
                    this._beltSprite.anims.stop();
                    this._container.getItem(this._beltSprite).visible = character.hasBelt;
                    if (this._character) {
                        for (let i = 0; i < Player.ANIM_KEYS.length; i++) {
                            scene.anims.remove(Player.ANIM_KEYS[i] + keySuffix);
                            scene.anims.remove(Player.BELT_ANIM_KEY_PREFIX + Player.ANIM_KEYS[i] + keySuffix);
                        }
                    }
                    scene.anims.create({
                        key: Player.ANIM_KEYS[0] + keySuffix,
                        frames: scene.anims.generateFrameNames("atlas_1", { prefix: assetsId + "/" + Player.ANIM_KEYS[0] + "_", end: 3 }),
                        repeat: -1,
                        frameRate: 10,
                        yoyo: true
                    });
                    if (character.hasBelt) {
                        scene.anims.create({
                            key: Player.BELT_ANIM_KEY_PREFIX + Player.ANIM_KEYS[0] + keySuffix,
                            frames: scene.anims.generateFrameNames("atlas_1", { prefix: assetsId + "/belt/" + Player.ANIM_KEYS[0] + "_", end: 3 }),
                            repeat: -1,
                            frameRate: 10,
                            yoyo: true
                        });
                    }
                    scene.anims.create({
                        key: Player.ANIM_KEYS[1] + keySuffix,
                        frames: scene.anims.generateFrameNames("atlas_1", { prefix: assetsId + "/" + Player.ANIM_KEYS[1] + "_", end: 2 }),
                        frameRate: 10
                    });
                    if (character.hasBelt) {
                        scene.anims.create({
                            key: Player.BELT_ANIM_KEY_PREFIX + Player.ANIM_KEYS[1] + keySuffix,
                            frames: scene.anims.generateFrameNames("atlas_1", { prefix: assetsId + "/belt/" + Player.ANIM_KEYS[1] + "_", end: 2 }),
                            frameRate: 10
                        });
                    }
                    scene.anims.create({
                        key: Player.ANIM_KEYS[2] + keySuffix,
                        frames: scene.anims.generateFrameNames("atlas_1", { prefix: assetsId + "/" + Player.ANIM_KEYS[2] + "_", end: 1 }),
                        frameRate: 15,
                        yoyo: true,
                    });
                    if (character.hasBelt) {
                        scene.anims.create({
                            key: Player.BELT_ANIM_KEY_PREFIX + Player.ANIM_KEYS[2] + keySuffix,
                            frames: scene.anims.generateFrameNames("atlas_1", { prefix: assetsId + "/belt/" + Player.ANIM_KEYS[2] + "_", end: 1 }),
                            frameRate: 15,
                            yoyo: true
                        });
                    }
                    scene.anims.create({
                        key: Player.ANIM_KEYS[3] + keySuffix,
                        frames: scene.anims.generateFrameNames("atlas_1", { prefix: assetsId + "/" + Player.ANIM_KEYS[3] + "_", end: 1 }),
                        frameRate: 15,
                        yoyo: true,
                    });
                    if (character.hasBelt) {
                        scene.anims.create({
                            key: Player.BELT_ANIM_KEY_PREFIX + Player.ANIM_KEYS[3] + keySuffix,
                            frames: scene.anims.generateFrameNames("atlas_1", { prefix: assetsId + "/belt/" + Player.ANIM_KEYS[3] + "_", end: 1 }),
                            frameRate: 15,
                            yoyo: true
                        });
                    }
                    if (this._dizzyFx)
                        this._dizzyFx.setOffsetY(-character.height);
                    if (this._godModeFx)
                        this._godModeFx.setOffsetY(46);
                    this._character = character;
                    this._curAnim = -1;
                    this.setState(0);
                    Gameplay.Manager.instance.trunkGenerator.setEnabledBonusTypes(character.trunkBonuses);
                    if (emitEvent)
                        this._group.events.emit(Player.EVENT_CHAR_CHANGE, character);
                }
                setBelt(beltId) {
                    let emitEvent = this._beltId >= 0;
                    let char = this.character;
                    if (char.hasBelt)
                        this._beltSprite.tint = char.belts[beltId];
                    this._beltId = beltId;
                    if (emitEvent)
                        this._group.events.emit(Player.EVENT_BELT_CHANGE, beltId);
                }
                startGodMode() {
                    if (this._state == 0 || this._state == 1) {
                        this._godModeEndTime = Gameplay.Manager.timer.time + 4000;
                        this._godModeFx.visible = true;
                        this._godModeFxBlinkTimer = 0;
                        Game.Global.game.sound.playAudioSprite("sfx", "godMode");
                        if (!this._godMode) {
                            this._godMode = true;
                            this._godModeFx.content.play("fireFx");
                        }
                    }
                }
                startDizzines() {
                    if (this._state == 0 || this._state == 1) {
                        if (!this._dizzyMode) {
                            this._dizzyMode = true;
                            this._dizzyFx.visible = true;
                            this._dizzyFx.content.play("dizzyFx_" + this._group.assetId);
                        }
                        this._dizzyEndTime = Gameplay.Manager.timer.time + 2500;
                    }
                }
                processGodMode() {
                    if (Gameplay.Manager.timer.paused)
                        return;
                    let remTime = this._godModeEndTime - Gameplay.Manager.timer.time;
                    if (remTime < 1500) {
                        if (remTime <= 0) {
                            this._godMode = false;
                            this._godModeFx.content.anims.stop();
                            this._godModeFx.visible = false;
                            return;
                        }
                        else {
                            this._godModeFxBlinkTimer -= Gameplay.Manager.timer.delta;
                            if (this._godModeFxBlinkTimer <= 0) {
                                this._godModeFxBlinkTimer = 60 / 15;
                                this._godModeFx.visible = !this._godModeFx.visible;
                            }
                        }
                    }
                    let trunk = this._group.trunk;
                    if (trunk.idle) {
                        let block = trunk.getBlock(0);
                        if (block.branchSide == 0)
                            block = trunk.getBlock(1);
                        this.hitTrunk(block.branchSide == 1 ? -1 : 1);
                    }
                }
                setState(state) {
                    this._state = state;
                    let animKeySuffix = "_" + this._group.id;
                    let anim;
                    switch (state) {
                        case 0:
                            anim = 0;
                            break;
                        case 1:
                            anim = Phaser.Math.RND.integerInRange(0, 1) + 2;
                            break;
                        case 2:
                            anim = 1;
                            break;
                    }
                    if (this._curAnim != anim) {
                        this._ignoreAnimComplete = true;
                        this._charSprite.play(Player.ANIM_KEYS[anim] + animKeySuffix);
                        this._shadowSprite.play(Player.ANIM_KEYS[anim] + animKeySuffix);
                        if (this.character.hasBelt)
                            this._beltSprite.play(Player.BELT_ANIM_KEY_PREFIX + Player.ANIM_KEYS[anim] + animKeySuffix);
                        this._ignoreAnimComplete = false;
                        this._curAnim = anim;
                        this.setPosition();
                    }
                }
                setPosition() {
                    if (!this._character || this._state < 0)
                        return;
                    let char = this.character;
                    this._container.setPosition(this._group.trunk.x + (char.trunkHOffset + char.getAnimHOffset(this._curAnim)) * this.trunkSide, this._group.trunk.y + char.getAnimVOffset(this._curAnim));
                }
                hitTrunk(hitDir) {
                    let trunk = this._group.trunk;
                    if (this._charSprite.flipX != (hitDir == -1)) {
                        let flipX = hitDir < 0;
                        this._charSprite.flipX = flipX;
                        this._beltSprite.flipX = flipX;
                        this._shadowSprite.flipX = flipX;
                        let branchSide = trunk.getBlock(0).branchSide;
                        if ((branchSide == 1 && hitDir == 1) || (branchSide == 2 && hitDir == -1)) {
                            this.kill(1);
                            return;
                        }
                    }
                    this.setState(1);
                    let nextBlockBranch = trunk.getBlock(1).branchSide;
                    let deadlyHit = false;
                    if (nextBlockBranch != 0) {
                        let plSide = this.trunkSide;
                        if ((nextBlockBranch == 1 && plSide == -1) || (nextBlockBranch == 2 && plSide == 1))
                            deadlyHit = true;
                    }
                    if (trunk.hit(hitDir, deadlyHit) == 2 && deadlyHit) {
                        this._state = 3;
                    }
                }
                handleAnimComplete(anim, frame) {
                    if (this._ignoreAnimComplete || anim == null)
                        return;
                    let animKeySuffix = "_" + this._group.id;
                    switch (anim.key) {
                        case Player.ANIM_KEYS[2] + animKeySuffix:
                        case Player.ANIM_KEYS[3] + animKeySuffix: {
                            if (this._state == 1)
                                this.setState(0);
                            break;
                        }
                        case Player.ANIM_KEYS[1] + animKeySuffix: {
                            this._group.events.emit(Player.EVENT_DEATH, this);
                            break;
                        }
                    }
                }
            }
            Player.ANIM_KEYS = ["idle", "death", "hit1", "hit2"];
            Player.BELT_ANIM_KEY_PREFIX = "belt_";
            Player.EVENT_DEATH = "pl_death";
            Player.EVENT_CHAR_CHANGE = "pl_charChange";
            Player.EVENT_BELT_CHANGE = "pl_beltChange";
            Player_1.Player = Player;
        })(Player = Gameplay.Player || (Gameplay.Player = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Bonuses;
        (function (Bonuses) {
            var Trunk;
            (function (Trunk) {
                class Generator {
                    get nextBonusBlockId() { return this._nextBonusBlockId; }
                    get nextBonusId() { return this._nextBonusId; }
                    get enabledTypes() { return this._enabledTypes; }
                    set enabledTypes(types) { this._enabledTypes = types; }
                    reset() {
                        this._nextBonusBlockId = Generator.FIRST_BONUS_DELAY + Phaser.Math.RND.integerInRange(Generator.BONUS_MIN_SPACING, Generator.BONUS_MAX_SPACING);
                        this._nextBonusId = 0;
                        this._lastBonusType = -1;
                    }
                    getNextBonus(blockId, trunkSide, isTrap) {
                        if (this._nextBonusBlockId > blockId || !this._enabledTypes || this._enabledTypes.length == 0)
                            return null;
                        let type;
                        let typeId = Phaser.Math.RND.integerInRange(0, this._enabledTypes.length - 1);
                        type = this._enabledTypes[typeId];
                        if (this._enabledTypes.length > 1 && type == this._lastBonusType) {
                            if (++typeId == this._enabledTypes.length)
                                typeId = 0;
                            type = this._enabledTypes[typeId];
                        }
                        let settings = new Trunk.BonusSettings(blockId, trunkSide, type);
                        let delay = Phaser.Math.RND.integerInRange(Generator.BONUS_MIN_SPACING, Generator.BONUS_MAX_SPACING);
                        if (isTrap)
                            delay = Math.max(Math.floor(delay / 2), Generator.BONUS_MIN_SPACING);
                        this._nextBonusBlockId = blockId + delay;
                        this._nextBonusId++;
                        return settings;
                    }
                }
                Generator.FIRST_BONUS_DELAY = 20;
                Generator.BONUS_MIN_SPACING = 30;
                Generator.BONUS_MAX_SPACING = 50;
                Trunk.Generator = Generator;
            })(Trunk = Bonuses.Trunk || (Bonuses.Trunk = {}));
        })(Bonuses = Gameplay.Bonuses || (Gameplay.Bonuses = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Bonuses;
        (function (Bonuses) {
            var Trunk;
            (function (Trunk) {
                class Manager {
                    constructor(group) {
                        this._group = group;
                        this._freeBonuses = new Collections.Pool(undefined, 0, true, () => {
                            return new Trunk.Bonus(this);
                        }, this);
                        this._trunkBonuses = new Collections.WrappedArray();
                        this._pickedUpBonuses = new Collections.WrappedArray();
                        group.events.on(Gameplay.Trunk.Trunk.EVENT_BLOCK_DESTROYED, this.handleTrunkBlockDestroyed, this);
                    }
                    get group() { return this._group; }
                    reset() {
                        if (!this._trunkBonuses.empty) {
                            this._trunkBonuses.forEach((bonus) => {
                                bonus.reset();
                                this._freeBonuses.returnItem(bonus);
                            });
                            this._trunkBonuses.clear();
                        }
                        if (!this._pickedUpBonuses.empty) {
                            this._pickedUpBonuses.forEach((bonus) => {
                                bonus.reset();
                                this._freeBonuses.returnItem(bonus);
                            });
                            this._pickedUpBonuses.clear();
                        }
                    }
                    showBonus(bonusSettings) {
                        while (!this._pickedUpBonuses.empty && this._pickedUpBonuses.first.state == 0)
                            this._freeBonuses.returnItem(this._pickedUpBonuses.remove(false));
                        let bonus = this._freeBonuses.getItem();
                        bonus.show(bonusSettings);
                        this._trunkBonuses.add(bonus);
                    }
                    processFall(fallStep) {
                        this._trunkBonuses.forEach((bonus) => { bonus.processFall(fallStep); });
                    }
                    handleTrunkBlockDestroyed(trunk, block, hitDir) {
                        if (this._trunkBonuses.empty)
                            return;
                        let bonus = this._trunkBonuses.first;
                        if (bonus.block.id <= block.id + 1) {
                            if (hitDir != bonus.settings.trunkSide) {
                                bonus.pickup();
                                this._pickedUpBonuses.add(this._trunkBonuses.remove(false));
                                Gameplay.Manager.instance.applyTrunkBonus(bonus.settings.type);
                            }
                            else if (bonus.block.id == block.id) {
                                bonus.reset();
                                this._trunkBonuses.remove(false);
                                this._freeBonuses.returnItem(bonus);
                            }
                        }
                    }
                }
                Manager.LONG_BRANCH_OFFSET = [130, 78];
                Manager.SHORT_BRANCH_OFFSET = [100, 60];
                Manager.TYPE_NAMES = [
                    "TIME FROZEN",
                    "GOD MODE",
                    "TIME REFILL",
                    "DOUBLE SCORE"
                ];
                Trunk.Manager = Manager;
            })(Trunk = Bonuses.Trunk || (Bonuses.Trunk = {}));
        })(Bonuses = Gameplay.Bonuses || (Gameplay.Bonuses = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Bonuses;
        (function (Bonuses) {
            var Trunk;
            (function (Trunk) {
                class BonusSettings {
                    constructor(blockId, trunkSide, type) {
                        this._blockId = blockId;
                        this._trunkSide = trunkSide;
                        this._type = type;
                    }
                    get type() { return this._type; }
                    get blockId() { return this._blockId; }
                    get trunkSide() { return this._trunkSide; }
                }
                Trunk.BonusSettings = BonusSettings;
                class Bonus {
                    constructor(manager) {
                        this._manager = manager;
                        let scene = manager.group.camera.scene;
                        let assetPrefix = manager.group.trunk.assetPrefix;
                        this._container = scene.add.container(0, 0)
                            .setVisible(false)
                            .setActive(false)
                            .setDepth(manager.group.depth + 5);
                        this._ropeImg = scene.make.image({ key: "atlas_0", frame: assetPrefix + "bonus/trunkRope" }, false)
                            .setOrigin(0.5, 0);
                        this._container.add(this._ropeImg);
                        this._lightFx = scene.make.image({ key: "atlas_0", frame: "fx/lightBeams", y: 60 }, false);
                        this._container.add(this._lightFx);
                        this._bonusImg = scene.make.image({ key: "atlas_0", frame: assetPrefix + "bonus/trunk_0", y: 60 }, false);
                        this._container.add(this._bonusImg);
                        this._state = 0;
                    }
                    get settings() { return this._settings; }
                    get state() { return this._state; }
                    get block() { return this._block; }
                    reset() {
                        if (this._state != 0) {
                            this._state = 0;
                            this._container.setVisible(false);
                            if (this._idleTween)
                                this._idleTween.stop();
                            if (this._pickupTween1) {
                                this._pickupTween1.stop();
                                this._pickupTween2.stop();
                            }
                        }
                    }
                    show(settings) {
                        let trunk = this._manager.group.trunk;
                        let block = trunk.getBlock(settings.blockId - trunk.getBlock().id);
                        this._state = 1;
                        this._settings = settings;
                        this._block = block;
                        this._ropeImg.visible = true;
                        this._bonusImg.setFrame(trunk.assetPrefix + "bonus/trunk_" + settings.type);
                        this._lightFx.visible = false;
                        this._container.setPosition(block.x + Bonus.TRUNK_H_OFFSET * settings.trunkSide, block.y + trunk.group.player.character.branchVOffset - Gameplay.Trunk.Block.getHeight(this._manager.group.trunk))
                            .setAngle(-5)
                            .setAlpha(1)
                            .setVisible(true);
                        if (this._idleTween) {
                            this._idleTween.restart();
                        }
                        else {
                            this._idleTween = Gameplay.MainScene.instance.tweens.add({
                                targets: this._container,
                                angle: { value: 5, duration: 1000, ease: "Quad.easeInOut", yoyo: true, repeat: -1 }
                            });
                        }
                    }
                    pickup() {
                        this._state = 2;
                        this._idleTween.stop();
                        this._ropeImg.visible = false;
                        this._lightFx.setVisible(true)
                            .setScale(0.5)
                            .setAlpha(0)
                            .setAngle(0);
                        if (this._pickupTween1) {
                            this._pickupTween1.restart();
                            this._pickupTween2.restart();
                        }
                        else {
                            this._pickupTween1 = Gameplay.MainScene.instance.tweens.add({
                                targets: this._container,
                                y: { value: "-=150", duration: 750, ease: "Cubic.easeOut" },
                                angle: { value: 0, duration: 750, ease: "Cubic.easeOut" },
                                alpha: { value: 0, duration: 1000, delay: 750, ease: "Cubic.easeIn" },
                                onComplete: () => {
                                    if (this._state != 0) {
                                        this._state = 0;
                                        this._container.setVisible(false);
                                        this._pickupTween2.stop();
                                    }
                                }
                            });
                            this._pickupTween2 = Gameplay.MainScene.instance.tweens.add({
                                targets: this._lightFx,
                                alpha: { value: 1, duration: 500 },
                                angle: { value: "+=360", duration: 4000, repeat: -1 },
                                scaleX: { value: 1, ease: "Elastic.easeIn" },
                                scaleY: { value: 1, ease: "Elastic.easeIn" },
                                duration: 1000
                            });
                        }
                        Gameplay.HUD.HUD.instance.showPopupMsg(Trunk.Manager.TYPE_NAMES[this._settings.type], this._container.x, this._container.y);
                    }
                    processFall(fallStep) {
                        this._container.y += fallStep;
                    }
                }
                Bonus.TRUNK_H_OFFSET = 130;
                Trunk.Bonus = Bonus;
            })(Trunk = Bonuses.Trunk || (Bonuses.Trunk = {}));
        })(Bonuses = Gameplay.Bonuses || (Gameplay.Bonuses = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Bonuses;
        (function (Bonuses) {
            var Falling;
            (function (Falling) {
                class Bonus {
                    constructor(manager) {
                        this._manager = manager;
                        let camera = manager.plGroup.camera;
                        this._image = camera.scene.add.image(0, 0, "atlas_0")
                            .setOrigin(0.5, 1)
                            .setDepth(manager.plGroup.depth + 5)
                            .setVisible(false);
                        this._image.cameraFilter = ~camera.id;
                        this._state = 0;
                    }
                    get settings() { return this._settings; }
                    get x() { return this._image.x; }
                    get y() { return this._image.y - this._image.height / 2; }
                    get frameKey() { return this._image.frame.name; }
                    reset() {
                        if (this._state != 0) {
                            this._image.visible = false;
                            this._manager.plGroup.events.off(Gameplay.Trunk.Trunk.EVENT_POS_CHANGE, this.handleTrunkPosChange, this);
                        }
                    }
                    update() {
                        if (this._state == 1) {
                            let y = this._image.y + (this._manager.bnsFallSpeed * Gameplay.Manager.timer.delta);
                            if (y >= this._manager.bnsDestroyY) {
                                y = this._manager.bnsDestroyY;
                                this._state = 2;
                                this._time = Gameplay.Manager.timer.time;
                            }
                            else if (y >= this._manager.bnsPickupY) {
                                let pl = this._manager.plGroup.player;
                                if (this._settings.side == pl.trunkSide && !pl.death) {
                                    return 1;
                                }
                            }
                            this._image.y = y;
                        }
                        if (this._state == 2) {
                            let time = Gameplay.Manager.timer.time - this._time;
                            if (time < 1000) {
                                this._image.visible = (Math.floor(time / 100) & 1) == 0;
                            }
                            else {
                                return 2;
                            }
                        }
                        return 0;
                    }
                    show(settings) {
                        this._settings = settings;
                        let group = this._manager.plGroup;
                        this._image.setFrame(group.trunk.assetPrefix + "bonus/fall_" + settings.type)
                            .setPosition(group.trunk.x + this.getTrunkOffset() * settings.side, 0)
                            .setVisible(true);
                        group.events.on(Gameplay.Trunk.Trunk.EVENT_POS_CHANGE, this.handleTrunkPosChange, this);
                        this._state = 1;
                    }
                    getTrunkOffset() {
                        return 100 * (1 - 0.2 * this._manager.plGroup.assetId);
                    }
                    handleTrunkPosChange(trunk) {
                        this._image.setX(trunk.x + this.getTrunkOffset() * this._settings.side);
                    }
                }
                Falling.Bonus = Bonus;
                class BonusSettings {
                    constructor(type, side) {
                        this._type = type;
                        this._side = side;
                    }
                    get type() { return this._type; }
                    get side() { return this._side; }
                }
                Falling.BonusSettings = BonusSettings;
            })(Falling = Bonuses.Falling || (Bonuses.Falling = {}));
        })(Bonuses = Gameplay.Bonuses || (Gameplay.Bonuses = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Bonuses;
        (function (Bonuses) {
            var Falling;
            (function (Falling) {
                class Generator {
                    constructor(gameLen, cycleLen, bonusCntPerCycle) {
                        let ratio = gameLen / cycleLen;
                        let totBnsCnt = 0;
                        this._totBnsCnt = [];
                        this._remBnsCnt = [];
                        for (let i = 0; i < 2; i++)
                            totBnsCnt += (this._totBnsCnt[i] = Math.round(bonusCntPerCycle[i] * ratio));
                        this._interval = gameLen / (totBnsCnt + 1) * 1000;
                        this._nextBnsTypePri = [];
                        this._bonusSettings = new Collections.WrappedArray();
                    }
                    load(data) {
                        this.reset(true);
                        let buffer = new DataView(Helpers.Buffer.base64ToAb(data));
                        for (let i = 0; i < buffer.byteLength; i++) {
                            let v = buffer.getUint8(i);
                            this._bonusSettings.add(new Falling.BonusSettings(v >> 1, (v & 1) == 0 ? -1 : 1));
                        }
                    }
                    save() {
                        let buffer = new DataView(new ArrayBuffer(this._bonusSettings.size));
                        this._bonusSettings.forEach((bonus, i) => {
                            buffer.setUint8(i, (bonus.side < 0 ? 0 : 1) | (bonus.type << 1));
                        }, this);
                        return Helpers.Buffer.abToBase64(buffer.buffer, buffer.byteLength);
                    }
                    reset(resetBonusSettings) {
                        if (resetBonusSettings)
                            this._bonusSettings.clear();
                        for (let i = 0; i < this._totBnsCnt.length; i++) {
                            this._remBnsCnt[i] = this._totBnsCnt[i];
                            this._nextBnsTypePri[i] = this._remBnsCnt[i] != 0 ? 1 : 0;
                        }
                        this._nextBonusId = 0;
                        this._complete = false;
                    }
                    update() {
                        if (!this._complete && Gameplay.Manager.instance.playTime >= (this._nextBonusId + 1) * this._interval) {
                            let bnsSettings;
                            if (this._nextBonusId < this._bonusSettings.size) {
                                bnsSettings = this._bonusSettings.getItemAtIndex(this._nextBonusId);
                            }
                            else {
                                bnsSettings = this.chooseBonus();
                                this._bonusSettings.add(bnsSettings);
                            }
                            this._nextBnsTypePri[bnsSettings.type] = 0;
                            let totalRemBnsCnt = 0;
                            for (let i = 0; i < this._totBnsCnt.length; i++) {
                                if (i == bnsSettings.type)
                                    this._remBnsCnt[i]--;
                                if (this._remBnsCnt[i] != 0) {
                                    totalRemBnsCnt += this._remBnsCnt[i];
                                    this._nextBnsTypePri[i] += 1;
                                }
                            }
                            this._nextBonusId++;
                            if (totalRemBnsCnt == 0)
                                this._complete = true;
                            Gameplay.MainScene.instance.events.emit(Generator.EVENT_BONUS, bnsSettings);
                        }
                    }
                    chooseBonus() {
                        let prioritySum = 0;
                        this._nextBnsTypePri.forEach((priority) => {
                            prioritySum += priority;
                        });
                        let i = Phaser.Math.RND.integerInRange(0, prioritySum - 1);
                        let bnsType;
                        for (bnsType = 0; bnsType < this._nextBnsTypePri.length; bnsType++) {
                            if (i < this._nextBnsTypePri[bnsType])
                                break;
                            i -= this._nextBnsTypePri[bnsType];
                        }
                        return new Falling.BonusSettings(bnsType, Phaser.Math.RND.realInRange(0, 1) < 0.5 ? -1 : 1);
                    }
                }
                Generator.EVENT_BONUS = "fallBns_newBonus";
                Falling.Generator = Generator;
            })(Falling = Bonuses.Falling || (Bonuses.Falling = {}));
        })(Bonuses = Gameplay.Bonuses || (Gameplay.Bonuses = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Bonuses;
        (function (Bonuses) {
            var Falling;
            (function (Falling) {
                class Manager {
                    constructor(plGroup) {
                        this._plGroup = plGroup;
                        this._freeBonuses = new Collections.Pool(undefined, 1, true, () => {
                            return new Falling.Bonus(this);
                        }, this);
                        this._actBonuses = new Collections.NodeList();
                        this._freePickupFx = new Collections.Pool(undefined, 0, true, () => {
                            return new Bonuses.PickupFx(this._plGroup.camera);
                        }, this);
                        this._actPickupFx = new Collections.WrappedArray();
                        Gameplay.MainScene.instance.events.on(Falling.Generator.EVENT_BONUS, this.handleGeneratorNewBonus, this);
                    }
                    get plGroup() { return this._plGroup; }
                    get bnsFallSpeed() { return this._bnsFallSpeed; }
                    get bnsPickupY() { return this._bnsPickupY; }
                    get bnsDestroyY() { return this._bnsDestroyY; }
                    reset() {
                        this._actBonuses.foreach((bonus) => {
                            bonus.reset();
                            this._freeBonuses.returnItem(bonus);
                        });
                        this._actBonuses.clear();
                        this._actPickupFx.forEach((fx) => {
                            fx.reset();
                            this._freePickupFx.returnItem(fx);
                        }, this);
                        this._actPickupFx.clear();
                        this._bnsDestroyY = this._plGroup.player.y;
                        this._bnsPickupY = this._bnsDestroyY - this._plGroup.player.character.height;
                        this._bnsFallSpeed = (this._bnsPickupY / 3000) * 1000 / 60;
                    }
                    update() {
                        this._actBonuses.foreach((bonus, node) => {
                            let res = bonus.update();
                            if (res != 0) {
                                if (res == 1) {
                                    if (this._plGroup.id == 0) {
                                        let msg = Manager.TYPE_NAMES[bonus.settings.type];
                                        if (msg)
                                            Gameplay.HUD.HUD.instance.showPopupMsg(msg, bonus.x, bonus.y);
                                        this._actPickupFx.add(this._freePickupFx.getItem()
                                            .show(bonus.x, bonus.y, bonus.frameKey));
                                        Game.Global.game.sound.playAudioSprite("sfx", Manager.TYPE_PICKUP_SFX[bonus.settings.type]);
                                    }
                                    switch (bonus.settings.type) {
                                        case 0: {
                                            this._plGroup.addScore(100);
                                            break;
                                        }
                                        case 1: {
                                            this._plGroup.player.startDizzines();
                                            break;
                                        }
                                    }
                                }
                                bonus.reset();
                                this._actBonuses.removeByNode(node);
                                this._freeBonuses.returnItem(bonus);
                            }
                        }, this);
                        while (!this._actPickupFx.empty && !this._actPickupFx.first.active)
                            this._freePickupFx.returnItem(this._actPickupFx.remove(false));
                    }
                    handleGeneratorNewBonus(bonusSettings) {
                        let bonus = this._freeBonuses.getItem();
                        bonus.show(bonusSettings);
                        this._actBonuses.add(bonus);
                    }
                }
                Manager.TYPE_NAMES = ["+100 POINTS", null];
                Manager.TYPE_PICKUP_SFX = ["extraPoints", "dizzy"];
                Falling.Manager = Manager;
            })(Falling = Bonuses.Falling || (Bonuses.Falling = {}));
        })(Bonuses = Gameplay.Bonuses || (Gameplay.Bonuses = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Bonuses;
        (function (Bonuses) {
            class PickupFx {
                constructor(camera) {
                    let scene = camera.scene;
                    this._container = scene.add.container(0, 0)
                        .setDepth(5)
                        .setVisible(false);
                    this._container.cameraFilter = ~camera.id;
                    this._beams = scene.make.image({ key: "atlas_0", frame: "fx/lightBeams" }, false);
                    this._container.add(this._beams);
                    this._bonusImg = scene.make.image({ key: "atlas_0" }, false);
                    this._container.add(this._bonusImg);
                    this._pickupTweens = [
                        scene.tweens.add({
                            targets: this._container,
                            y: { value: "-=150", duration: 750, ease: "Cubic.easeOut" },
                            alpha: { value: 0, duration: 1000, delay: 750, ease: "Cubic.easeIn" },
                            onComplete: () => {
                                if (this._container.visible) {
                                    this._container.visible = false;
                                    this._pickupTweens[1].stop();
                                }
                            }
                        }).pause(),
                        scene.tweens.add({
                            targets: this._beams,
                            alpha: { value: 1, duration: 500 },
                            angle: { value: "+=360", duration: 4000, repeat: -1 },
                            scaleX: { value: 1, ease: "Elastic.easeIn" },
                            scaleY: { value: 1, ease: "Elastic.easeIn" },
                            duration: 1000
                        }).pause()
                    ];
                }
                get active() { return this._container.visible; }
                reset() {
                    if (this._container.visible) {
                        this._container.setVisible(false);
                        this._pickupTweens[0].stop();
                        this._pickupTweens[1].stop();
                    }
                }
                show(bnsX, bnsY, bnsFrame) {
                    this._bonusImg.setFrame(bnsFrame)
                        .setOrigin(0.5);
                    this._beams.setVisible(true)
                        .setScale(0.5)
                        .setAlpha(0)
                        .setAngle(0);
                    this._container.setPosition(bnsX, bnsY)
                        .setVisible(true);
                    this.playTween(this._pickupTweens[0]);
                    this.playTween(this._pickupTweens[1]);
                    return this;
                }
                playTween(tween) {
                    if (tween.paused) {
                        tween.resume();
                    }
                    else {
                        tween.restart();
                    }
                }
            }
            Bonuses.PickupFx = PickupFx;
        })(Bonuses = Gameplay.Bonuses || (Gameplay.Bonuses = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk_1) {
            class Trunk {
                constructor(group, generator) {
                    this._group = group;
                    this._generator = generator;
                    this._assetPrefix = "tree/" + group.assetId + "/";
                    this._x = 0;
                    this._y = 0;
                    this._minVisHeight = 0;
                    this._root = new Trunk_1.TrunkRoot(this);
                    this._blocksImgPool = new Collections.Pool(undefined, 5, true, () => {
                        return Gameplay.MainScene.instance.make.image({ key: "atlas_0", active: false }, false);
                    });
                    this._freeBlocks = new Collections.Pool(undefined, 0, true, () => { return new Trunk_1.Block(this, this._blocksImgPool); }, this);
                    this._trunkBlocks = new Collections.WrappedArray();
                    this._flyingBlocks = new Collections.WrappedArray();
                    this._iceParticles = new Trunk_1.IceParticleManager(this);
                    this._bonuses = new Gameplay.Bonuses.Trunk.Manager(group);
                    if (Gameplay.Manager.instance.friends) {
                        this._friendsAvatarPool = new Collections.Pool(undefined, 0, true, () => {
                            return new Trunk_1.Avatar(group.depth + 3, group);
                        }, this);
                        this._nextFriend = new Gameplay.HUD.NextTrunkFriend(group, group.depth + 7);
                        Gameplay.Manager.instance.friends.events.on(Gameplay.Social.FriendManager.EVENT_NEW_FRIENDS, this.resetAvatars, this);
                    }
                    group.events.on(Gameplay.Player.Player.EVENT_CHAR_CHANGE, this.handlePlCharChange, this);
                    group.events.on(Gameplay.Player.Player.EVENT_BELT_CHANGE, this.handlePlBeltChange, this);
                    group.events.on(Gameplay.PlayerGroup.EVENT_SCORE_MULTIPLIER_CHANGE, this.handlePlBeltChange, this);
                }
                get assetPrefix() { return this._assetPrefix; }
                get group() { return this._group; }
                get x() { return this._x; }
                get y() { return this._y; }
                get visible() { return this._root.visible; }
                set visible(visible) {
                    if (visible == this.visible)
                        return;
                    this._root.visible = visible;
                    this._trunkBlocks.forEach((block) => {
                        block.visible = visible;
                    });
                    this._flyingBlocks.forEach((block) => {
                        block.visible = visible;
                    });
                    if (this._nextFriend)
                        this._nextFriend.visible = visible;
                }
                get minVisHeight() { return this._minVisHeight; }
                get idle() { return this._fallDistance == 0; }
                get destroyedBlockCnt() { return this._destroyedBlockCnt; }
                get totalScoreValue() { return this._totalScoreValue; }
                get friendsAvatarPool() { return this._friendsAvatarPool; }
                setPosition(x, y, minVisHeight) {
                    let posChange = this._x != x;
                    if (this._x != x) {
                        this._x = x;
                        posChange = true;
                    }
                    if (y != undefined && this._y != y) {
                        this._y = y;
                        posChange = true;
                    }
                    let oldMinVisHeight = this._minVisHeight;
                    this._minVisHeight = minVisHeight;
                    if (posChange) {
                        this._root.updatePos();
                        this._group.events.emit(Trunk.EVENT_POS_CHANGE, this);
                    }
                    if (oldMinVisHeight != this._minVisHeight) {
                        if (oldMinVisHeight != 0 && this._minVisHeight > oldMinVisHeight) {
                        }
                    }
                }
                reset() {
                    this._root.updateHeight();
                    this._trunkBlocks.forEach(this.releaseBlock, this);
                    this._trunkBlocks.clear();
                    this._flyingBlocks.forEach(this.releaseBlock, this);
                    this._flyingBlocks.clear();
                    this._iceParticles.reset();
                    this._bonuses.reset();
                    this._fallDistance = 0;
                    this._nextBlockId = 0;
                    this._destroyedBlockCnt = 0;
                    this._totalScoreValue = 0;
                    let height = this._root.height;
                    let blockH = Trunk_1.Block.getHeight(this);
                    let friends = Gameplay.Manager.instance.friends;
                    this._nextFriendId = friends && friends.ready && friends.friends.length != 0 ? 0 : -1;
                    while (height < this._minVisHeight) {
                        this.addBlock();
                        height += blockH;
                    }
                    if (this._nextFriendId >= 0)
                        this._nextFriend.show(friends.friends[this._nextFriendId]);
                }
                update() {
                    if (this._fallDistance != 0)
                        this.processFall(Math.round(Trunk.FALL_STEP - 0.2 * this._group.assetId));
                    if (!this._flyingBlocks.empty) {
                        this._flyingBlocks.forEach((block) => { block.processDestroy(); });
                        while (!this._flyingBlocks.empty && !this._flyingBlocks.first.active)
                            this._freeBlocks.returnItem(this._flyingBlocks.remove(false));
                    }
                }
                hit(dir, deadly) {
                    if (this._fallDistance != 0)
                        this.processFall(this._fallDistance);
                    let block = this.getBlock();
                    let hitRes = block.handleHit(dir);
                    this._group.events.emit(Trunk.EVENT_HIT, this, hitRes, block);
                    if (hitRes == 2) {
                        if (!deadly) {
                            let points = block.type.score * this._group.player.scoreMultiplier;
                            let bonusMultiplier = this._group.scoreMultiplier;
                            this._group.addScore(points * bonusMultiplier);
                            if (this._group.id == 0)
                                Gameplay.HUD.HUD.instance.showScorePopupMsg(points, bonusMultiplier, this._x, this._y - Trunk_1.Block.getHeight(this));
                            this._totalScoreValue -= (points * bonusMultiplier);
                        }
                        this._destroyedBlockCnt++;
                        this._trunkBlocks.remove(false);
                        this._flyingBlocks.add(block);
                        this.addBlock();
                        this._fallDistance = Trunk_1.Block.getHeight(this);
                        this._group.events.emit(Trunk.EVENT_BLOCK_DESTROYED, this, block, dir, deadly);
                    }
                    else if (hitRes == 1) {
                        this._iceParticles.showParticles();
                    }
                    return hitRes;
                }
                getBlock(offset = 0) {
                    return this._trunkBlocks.getItemAtIndex(offset);
                }
                getNextBlockY() {
                    return (this._trunkBlocks.empty ? this.getFirstBlockY() : this._trunkBlocks.last.y - Trunk_1.Block.getHeight(this));
                }
                getFirstBlockY() {
                    return this._y - this._root.height - Trunk_1.Block.getHeight(this) / 2;
                }
                getBlockY(blockId) {
                    let fBlock = this._trunkBlocks.first;
                    if (blockId < fBlock.id || blockId > this._trunkBlocks.last.id)
                        return undefined;
                    let blockH = fBlock.height;
                    let y = this.getFirstBlockY() - (blockId - fBlock.id) * blockH;
                    if (this._fallDistance != 0)
                        y -= this._fallDistance;
                    return y;
                }
                processFall(step) {
                    if ((this._fallDistance -= step) < 0) {
                        step += this._fallDistance;
                        this._fallDistance = 0;
                    }
                    this._trunkBlocks.forEach(function (block) { block.processFall(step); });
                    this._bonuses.processFall(step);
                }
                addBlock() {
                    let block = this._freeBlocks.getItem();
                    let blockSet = this._generator.getBlockSettings(this._nextBlockId);
                    let prevBlockType = this._generator.getBlockType(this._nextBlockId - 1);
                    let nextBlockType = this._generator.getBlockType(this._nextBlockId + 1);
                    block.show(this._nextBlockId, this.getNextBlockY(), blockSet, (prevBlockType ? prevBlockType : 0), nextBlockType);
                    this._trunkBlocks.add(block);
                    this._nextBlockId++;
                    this._totalScoreValue += block.type.score * this._group.scoreMultiplier * this._group.player.scoreMultiplier;
                    if (this._nextFriendId >= 0) {
                        let friends = Gameplay.Manager.instance.friends.friends;
                        if (this._group.score + this._totalScoreValue >= friends[this._nextFriendId].score) {
                            block.showAvatar(friends[this._nextFriendId]);
                            if (++this._nextFriendId == friends.length) {
                                this._nextFriendId = -1;
                                this._nextFriend.reset();
                            }
                            else {
                                this._nextFriend.show(friends[this._nextFriendId]);
                            }
                        }
                    }
                    if (blockSet.bonus != null)
                        this._bonuses.showBonus(blockSet.bonus);
                }
                resetAvatars() {
                    this._trunkBlocks.forEach((block) => { block.showAvatar(); });
                    this._nextFriend.reset();
                    let friends = Gameplay.Manager.instance.friends;
                    if (!friends.ready || friends.friends.length == 0)
                        return;
                    this._nextFriendId = 0;
                    let score = this._group.score;
                    let list = friends.friends;
                    if (list[0].score < score + this._totalScoreValue) {
                        while (this._nextFriendId < list.length && list[this._nextFriendId].score < score)
                            this._nextFriendId++;
                        let blockId = 0;
                        let scoreMultiplier = this._group.scoreMultiplier * this._group.player.scoreMultiplier;
                        while (this._nextFriendId < list.length && blockId < this._trunkBlocks.size) {
                            score += this._trunkBlocks.getItemAtIndex(blockId).type.score * scoreMultiplier;
                            if (score >= list[this._nextFriendId].score) {
                                this._trunkBlocks.getItemAtIndex(blockId).showAvatar(list[this._nextFriendId]);
                                this._nextFriendId++;
                            }
                            blockId++;
                        }
                    }
                    if (this._nextFriendId < list.length) {
                        this._nextFriend.show(list[this._nextFriendId]);
                    }
                    else {
                        this._nextFriendId = -1;
                    }
                }
                handlePlCharChange(char) {
                    this._root.updateHeight();
                    let blockCnt = this._trunkBlocks.size;
                    let blockY = this.getFirstBlockY();
                    let blockH = Trunk_1.Block.getHeight(this);
                    let trunkH = this._root.height;
                    for (let blockId = 0; blockId < blockCnt; blockId++) {
                        let block = this._trunkBlocks.getItemAtIndex(blockId);
                        block.updateProps(blockY, char);
                        blockY -= blockH;
                        trunkH += blockH;
                    }
                    while (trunkH < this._minVisHeight) {
                        this.addBlock();
                        trunkH += blockH;
                    }
                }
                handlePlBeltChange() {
                    this.recalculateTotalScoreValue();
                    this.resetAvatars();
                }
                recalculateTotalScoreValue() {
                    let score = 0;
                    let multiplier = this._group.player.scoreMultiplier * this._group.scoreMultiplier;
                    this._trunkBlocks.forEach((block) => { score += block.type.score * multiplier; });
                    this._totalScoreValue = score;
                }
                releaseBlock(block) {
                    block.reset();
                    this._freeBlocks.returnItem(block);
                }
            }
            Trunk.EVENT_POS_CHANGE = "trunk_posChange";
            Trunk.EVENT_HIT = "trunk_hit";
            Trunk.EVENT_BLOCK_DESTROYED = "trunk_blockDestroy";
            Trunk.FALL_STEP = 12;
            Trunk_1.Trunk = Trunk;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk) {
            class TrunkGenerator {
                constructor(mods) {
                    if (!TrunkGenerator.BLOCK_TYPES) {
                        TrunkGenerator.BLOCK_TYPES = [
                            new Trunk.BlockType(0, 1, 10),
                            new Trunk.BlockType(1, 2, 20),
                            new Trunk.BlockType(2, 3, 30),
                            new Trunk.BlockType(3, 4, 40)
                        ];
                    }
                    this._blockMods = [
                        new Trunk.BlockModifier(0),
                        new Trunk.BlockModifier(1)
                    ];
                    this._resistBlockPriorities = [0, 0, 0];
                    this._mods = mods;
                    this._freeBlockSettings = new Collections.Pool(Trunk.BlockSettings, 10, true);
                    this._blockSettings = new Collections.WrappedArray();
                    this._bonusGenerator = new Gameplay.Bonuses.Trunk.Generator();
                }
                get blockMods() { return this._blockMods; }
                get resistBlockPriorities() { return this._resistBlockPriorities; }
                load(data) {
                    this.reset(true);
                    let buf = new DataView(Helpers.Buffer.base64ToAb(data));
                    let bufPos = 0;
                    let blockCnt = buf.getUint16(bufPos, false);
                    bufPos += 2;
                    for (let blockId = 0; blockId < blockCnt; blockId++) {
                        let block = this._freeBlockSettings.getItem();
                        bufPos = block.load(buf, bufPos);
                        this._blockSettings.add(block);
                    }
                    let val = buf.getUint8(bufPos++);
                    this._nextBlockType = TrunkGenerator.BLOCK_TYPES[(val & 0x7F)];
                    this._nextBlockIce = (val & 0x80) != 0;
                    val = buf.getUint8(bufPos++);
                    this._nextBranchDelay = val & 0x7F;
                    this._nextBranchSide = (val & 0x80) != 0 ? 2 : 1;
                    this._nextModId = 0;
                    if (this._mods[this._nextModId].pos <= blockCnt)
                        this._mods[this._nextModId++].apply();
                    this._branchSideSwitchProb = this._branchSideSwitchProbStep;
                    this._blockMods.forEach((mod) => {
                        mod.setDelay(buf.getUint8(bufPos++));
                    }, this);
                }
                save() {
                    let buf = new DataView(new ArrayBuffer(2 + this._blockSettings.size + 2 + this._blockMods.length));
                    let bufPos = 0;
                    buf.setUint16(bufPos, this._blockSettings.size, false);
                    bufPos += 2;
                    this._blockSettings.forEach((blockSettings) => {
                        bufPos = blockSettings.save(buf, bufPos);
                    }, this);
                    buf.setUint8(bufPos++, this._nextBlockType.type | (this._nextBlockIce ? 0x80 : 0));
                    buf.setUint8(bufPos++, this._nextBranchDelay | (this._nextBranchSide == 2 ? 0x80 : 0));
                    this._blockMods.forEach((mod) => {
                        buf.setUint8(bufPos++, mod.delay);
                    }, this);
                    return Helpers.Buffer.abToBase64(buf.buffer, bufPos);
                }
                reset(resetBlockSettings = true) {
                    if (resetBlockSettings) {
                        this._blockSettings.forEach((settings) => {
                            this._freeBlockSettings.returnItem(settings);
                        }, this);
                        this._blockSettings.clear(false);
                    }
                    this._blockMods.forEach((modifier) => { modifier.reset(); });
                    let i = this._resistBlockPriorities.length;
                    while (i-- != 0)
                        this._resistBlockPriorities[i] = 0;
                    this._nextModId = 0;
                    this._nextBlockType = TrunkGenerator.BLOCK_TYPES[0];
                    this._nextBlockIce = false;
                    this._nextBranchDelay = 4;
                    this._nextBranchSide = Phaser.Math.RND.integerInRange(0, 1) == 0 ? 1 : 2;
                    this._branchSideSwitchProb = 0;
                    this._branchSideSwitchProbStep = 0.15;
                    this._bonusGenerator.reset();
                }
                setBranchSideSwitchProbStep(step) {
                    this._branchSideSwitchProbStep = step;
                }
                getBlockSettings(blockId) {
                    if (blockId < this._blockSettings.size) {
                        if (blockId >= 0)
                            return this._blockSettings.getItemAtIndex(blockId);
                        return undefined;
                    }
                    while (blockId >= this._blockSettings.size) {
                        this._blockSettings.add(this.getNextBlockSettings());
                        while (this._nextModId < this._mods.length && this._blockSettings.size - 1 == this._mods[this._nextModId].pos)
                            this._mods[this._nextModId++].apply();
                    }
                    return this._blockSettings.getItemAtIndex(blockId);
                }
                getBlockType(blockId) {
                    if (blockId < this._blockSettings.size) {
                        if (blockId < 0)
                            return undefined;
                        return this._blockSettings.getItemAtIndex(blockId).type.type;
                    }
                    if (blockId == this._blockSettings.size)
                        return this._nextBlockType.type;
                    return undefined;
                }
                setEnabledBonusTypes(types) {
                    this._bonusGenerator.enabledTypes = types;
                }
                getNextBlockSettings() {
                    let bonusSettings = null;
                    let branchSide = 0;
                    let branchType;
                    if (this._nextBranchDelay-- == 0) {
                        this._nextBranchDelay = 1;
                        branchSide = this._nextBranchSide;
                        if (Phaser.Math.RND.realInRange(0, 1) <= this._branchSideSwitchProb) {
                            this._nextBranchSide = (this._nextBranchSide == 1 ? 2 : 1);
                            this._branchSideSwitchProb = this._branchSideSwitchProbStep;
                        }
                        else {
                            this._branchSideSwitchProb += this._branchSideSwitchProbStep;
                        }
                        branchType = this._blockSettings.last.bonus == null ? Phaser.Math.RND.integerInRange(0, TrunkGenerator.BRANCH_TYPE_CNT - 1) : 0;
                    }
                    else if (this._nextBranchDelay == 0) {
                        bonusSettings = this.selectBonus();
                    }
                    let modMask = 0;
                    this._blockMods.forEach((mod) => {
                        if (mod.decDelay())
                            modMask |= (1 << mod.id);
                    });
                    let nextBlockIce = (modMask & (1 << 0)) != 0;
                    let nextBlockType;
                    if ((modMask & (1 << 1)) != 0) {
                        nextBlockType = TrunkGenerator.BLOCK_TYPES[this.selectResistantBlock()];
                    }
                    else {
                        nextBlockType = TrunkGenerator.BLOCK_TYPES[0];
                    }
                    let blockSettings = this._freeBlockSettings.getItem();
                    blockSettings.init(this._nextBlockType, branchSide, branchType, this._nextBlockIce, bonusSettings);
                    this._nextBlockType = nextBlockType;
                    this._nextBlockIce = nextBlockIce;
                    return blockSettings;
                }
                selectResistantBlock() {
                    let priorities = this._resistBlockPriorities;
                    let sum = 0;
                    let i = priorities.length;
                    while (i-- != 0)
                        sum += priorities[i];
                    let val = Phaser.Math.RND.integerInRange(0, sum - 1);
                    i = this._resistBlockPriorities.length;
                    while (i-- != 0) {
                        let pri = priorities[i];
                        if (pri != 0) {
                            if (pri > val)
                                break;
                            val -= pri;
                        }
                    }
                    return i + 1;
                }
                selectBonus() {
                    let blockId = this._blockSettings.size;
                    if (this._bonusGenerator.nextBonusBlockId > blockId || !this._bonusGenerator.enabledTypes || this._bonusGenerator.enabledTypes.length == 0)
                        return null;
                    let bonusIsTrap = false;
                    if (this._blockSettings.last.branchSide == this._nextBranchSide) {
                        if (this._bonusGenerator.nextBonusId >= 3 && Phaser.Math.RND.realInRange(0, 1) < 0.5) {
                            bonusIsTrap = true;
                        }
                        else {
                            this._nextBranchDelay++;
                            return null;
                        }
                    }
                    return this._bonusGenerator.getNextBonus(blockId, this._nextBranchSide == 1 ? -1 : 1, bonusIsTrap);
                }
            }
            TrunkGenerator.BRANCH_TYPE_CNT = 2;
            Trunk.TrunkGenerator = TrunkGenerator;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk) {
            class TrunkRoot {
                constructor(trunk) {
                    let group = trunk.group;
                    let scene = group.camera.scene;
                    this._trunk = trunk;
                    this._rootImg = scene.add.image(0, 0, "atlas_0", trunk.assetPrefix + "block_0")
                        .setOrigin(0.5, 1)
                        .setDepth(group.depth + 0);
                    this._rootImg.cameraFilter = ~group.camera.id;
                    this._grassImg = scene.add.image(0, 0, "atlas_0", trunk.assetPrefix + "rootGrass")
                        .setOrigin(0.4, 0.6)
                        .setDepth(group.depth + 0);
                    this._grassImg.cameraFilter = this._rootImg.cameraFilter;
                }
                get trunk() { return this._trunk; }
                get height() { return this._height; }
                get visible() { return this._rootImg.visible; }
                set visible(visible) { this._rootImg.visible = this._grassImg.visible = visible; }
                updateHeight() {
                    this._height = this._trunk.group.player.character.trunkRootHeight;
                    this._rootImg.setCrop(0, this._rootImg.height - this._height, this._rootImg.width, this._height);
                }
                updatePos() {
                    this._rootImg.setPosition(this._trunk.x, this._trunk.y);
                    this._grassImg.setPosition(this._trunk.x, this._trunk.y);
                }
            }
            Trunk.TrunkRoot = TrunkRoot;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk) {
            class Avatar {
                constructor(depth, plGroup) {
                    let scene = Gameplay.MainScene.instance;
                    let assetPrefix = "hud/normal/avatar/";
                    this._container = new Controls.Group.Group(true)
                        .setVisible(false)
                        .setDepth(depth)
                        .setCameraFilter(~plGroup.camera.id);
                    this._container.add(scene.add.image(0, 0, "atlas_0", assetPrefix + "shadow_2"));
                    this._avatar = scene.add.image(0, 0, "atlas_0", assetPrefix + "defAvatar");
                    this._container.add(this._avatar);
                    let avatarMask = scene.make.graphics({}, false)
                        .fillStyle(0xFFFFFF)
                        .fillCircle(0, 0, Avatar.AVATAR_SIZE >> 1);
                    this._container.add(avatarMask);
                    this._avatar.setMask(avatarMask.createGeometryMask());
                }
                get container() { return this._container; }
                get friend() { return this._friend; }
                reset() {
                    if (this._friend) {
                        if (this._container.visible) {
                            this._avatar.setTexture("atlas_0", "hud/normal/avatar/defAvatar");
                            this._container.visible = false;
                        }
                        else {
                            Gameplay.Manager.instance.friends.events.off(Gameplay.Social.FriendManager.EVENT_AVATAR_LOADED + this._friend.uid, this.handleAvatarLoaded, this);
                        }
                        this._friend = null;
                        this._block = null;
                    }
                }
                show(friend, block) {
                    this.reset();
                    if ((this._friend = friend)) {
                        this._block = block;
                        let avatarState = friend.avatar.state;
                        if (avatarState == 2) {
                            this.activate();
                        }
                        else if (avatarState == 1) {
                            Gameplay.Manager.instance.friends.events.once(Gameplay.Social.FriendManager.EVENT_AVATAR_LOADED + this._friend.uid, this.handleAvatarLoaded, this);
                        }
                    }
                }
                update() {
                    if (this._container.visible) {
                        this._container.setPosition(this._block.x, this._block.y)
                            .setAlpha(this._block.alpha);
                        this._container.setItemsProperty("angle", this._block.angle);
                    }
                }
                activate() {
                    this._avatar.setTexture(this._friend.avatar.textureKey, this._friend.avatar.textureFrame)
                        .setDisplaySize(Avatar.AVATAR_SIZE, Avatar.AVATAR_SIZE);
                    this._container.setVisible(true);
                    this.update();
                }
                handleAvatarLoaded(friendUID, success) {
                    if (success) {
                        this.activate();
                    }
                    else {
                        this._friend = null;
                        this._block = null;
                    }
                }
            }
            Avatar.AVATAR_SIZE = 62;
            Trunk.Avatar = Avatar;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk) {
            class Block {
                constructor(trunk, imgPool) {
                    let scene = Gameplay.MainScene.instance;
                    this._trunk = trunk;
                    this._imgPool = imgPool;
                    this._blockImg = Gameplay.MainScene.instance.make.image({ key: "atlas_0", frame: trunk.assetPrefix + "block_0", active: false }, false);
                    this._branchImg = null;
                    this._iceImg = null;
                    this._damageImg = null;
                    this._iceImg = null;
                    this._lifeCntImg = null;
                    this._avatar = null;
                    this._container = scene.add.container(0, 0);
                    this._container.add(this._blockImg);
                    this._container.setSize(this._blockImg.width, this._blockImg.height)
                        .setVisible(false)
                        .setActive(false)
                        .setDepth(trunk.group.depth + 1);
                    this._container.cameraFilter = ~trunk.group.camera.id;
                    this._active = false;
                }
                get height() { return Block._HEIGHT[this._trunk.group.assetId]; }
                static getHeight(trunk) { return Block._HEIGHT[trunk.group.assetId]; }
                get trunk() { return this._trunk; }
                get id() { return this._id; }
                get type() { return this._type; }
                get x() { return this._container.x; }
                get y() { return this._container.y; }
                get alpha() { return this._container.alpha; }
                get angle() { return this._container.angle; }
                get active() { return this._active; }
                get visible() { return this._container.visible; }
                set visible(visible) {
                    if (this._active)
                        this._container.visible = visible;
                }
                get branchSide() { return this._branchSide; }
                reset() {
                    if (!this._active)
                        return;
                    this._active = false;
                    this._container.visible = false;
                    if (this._branchImg != null) {
                        this._container.remove(this._branchImg);
                        this._imgPool.returnItem(this._branchImg);
                        this._branchImg = null;
                    }
                    if (this._iceImg != null)
                        this.releaseIceImg();
                    if (this._lifeCntImg != null)
                        this.releaseLifeCntImg();
                    if (this._avatar != null)
                        this.releaseAvatar();
                    if (this._damageImg != null)
                        this.releaseDamageImg();
                    this._trunk.group.events.off(Trunk.Trunk.EVENT_POS_CHANGE, this.handleTrunkPosChange, this);
                }
                processFall(fallLen) {
                    this._container.y += fallLen;
                    if (this._avatar != null)
                        this._avatar.update();
                }
                processDestroy() {
                    let progress = (Gameplay.Manager.timer.time - this._timer) / 750;
                    if (progress >= 1) {
                        this.reset();
                        return;
                    }
                    let assetId = this._trunk.group.assetId;
                    this._container.x = this._trunk.x + Phaser.Math.Easing.Quadratic.Out(progress) * (Block.FLIGHT_LEN_DIS_X[assetId] * this._destroyDir);
                    this._container.y = this._trunk.getFirstBlockY() + Phaser.Math.Easing.Quadratic.In(progress * 2) * Block.FLIGHT_LEN_DIS_Y[assetId];
                    this._container.angle = Phaser.Math.Easing.Cubic.Out(progress * 0.75) * 360;
                    this._container.alpha = 1 - Phaser.Math.Easing.Quadratic.In(progress);
                    if (this._avatar != null)
                        this._avatar.update();
                }
                show(id, y, settings, prevBlockType, nextBlockType) {
                    let assetPrefix = this._trunk.assetPrefix;
                    let group = this._trunk.group;
                    let plChar = group.player.character;
                    this._id = id;
                    this._type = settings.type;
                    this._blockImg.setFrame(assetPrefix + "block_" + (prevBlockType == 0 && nextBlockType == 0 ? this._type.type :
                        "0_" + (prevBlockType != 0 ? prevBlockType + "0" : nextBlockType + "1")));
                    this._branchSide = settings.branchSide;
                    if (this._branchSide != 0) {
                        let branchHOffset = Block.BRANCH_H_OFFSET[this._trunk.group.assetId][settings.branchType];
                        let branchVOffset = plChar.branchVOffset;
                        this._branchImg = this._imgPool.getItem()
                            .setFrame(assetPrefix + "branch" + (this._branchSide == 1 ? "L" : "R") + "_" + this._type.type + "_" + settings.branchType);
                        if (this._branchSide == 1) {
                            this._branchImg.setOrigin(1, 0);
                            this._branchImg.setPosition(-branchHOffset, branchVOffset);
                        }
                        else {
                            this._branchImg.setOrigin(0, 0);
                            this._branchImg.setPosition(branchHOffset, branchVOffset);
                        }
                        this._branchImg.displayOriginY = 11;
                        this._container.add(this._branchImg);
                    }
                    this._lifeCnt = Math.max(1, this._type.resistance - plChar.hitStrength + 1);
                    if (this._lifeCnt != 1) {
                        this._damageImg = this._imgPool.getItem()
                            .setOrigin(0.5)
                            .setPosition(0, 0)
                            .setVisible(false);
                        this._container.add(this._damageImg);
                        this.showLifeCnt();
                    }
                    if (settings.ice) {
                        this._iceImg = this._imgPool.getItem();
                        this._iceImg.setFrame(assetPrefix + "ice")
                            .setOrigin(0.5)
                            .setPosition(0, 0);
                        this._container.add(this._iceImg);
                    }
                    this._container.setPosition(this._trunk.x, y)
                        .setAngle(0)
                        .setAlpha(1)
                        .setDepth(group.depth + 1)
                        .setVisible(true);
                    group.events.on(Trunk.Trunk.EVENT_POS_CHANGE, this.handleTrunkPosChange, this);
                    this._state = 0;
                    this._active = true;
                }
                showAvatar(friend) {
                    if (friend) {
                        if (!this._avatar)
                            this._avatar = this._trunk.friendsAvatarPool.getItem();
                        this._avatar.show(friend, this);
                    }
                    else if (this._avatar) {
                        this.releaseAvatar();
                        if (this._lifeCnt > 1)
                            this.showLifeCnt();
                    }
                }
                handleHit(dir) {
                    let sfxKey;
                    let res = 0;
                    if (this._iceImg != null) {
                        this.releaseIceImg();
                        sfxKey = "hitIce";
                        res = 1;
                    }
                    else if (--this._lifeCnt == 0) {
                        this._state = 1;
                        this._timer = Gameplay.Manager.timer.time;
                        this._destroyDir = dir;
                        this._container.setDepth(this._trunk.group.depth + 2);
                        sfxKey = "hitWood";
                        res = 2;
                    }
                    else {
                        this._damageImg.setFrame(this._trunk.assetPrefix + "blockDamage_" + (this._lifeCnt - 1))
                            .setVisible(true);
                        sfxKey = "hitRock";
                    }
                    if (this._lifeCntImg != null)
                        this.updateLifeCnt();
                    if (this._trunk.group.id == 0)
                        Game.Global.game.sound.playAudioSprite("sfx", sfxKey);
                    return res;
                }
                updateProps(y, newPlChar) {
                    this._container.y = y;
                    if (this._avatar)
                        this._avatar.update();
                    if (this._branchSide != 0)
                        this._branchImg.y = newPlChar.branchVOffset;
                    this._lifeCnt = Math.max(1, this._type.resistance - newPlChar.hitStrength + 1);
                    if (this._avatar == null) {
                        if (this._lifeCnt > 1) {
                            if (this._lifeCntImg != null) {
                                this.updateLifeCnt();
                            }
                            else {
                                this.showLifeCnt();
                            }
                        }
                        else if (this._lifeCntImg != null) {
                            this.releaseLifeCntImg();
                        }
                    }
                }
                handleTrunkPosChange(trunk) {
                    if (this._state == 0) {
                        this._container.setPosition(trunk.x, trunk.getBlockY(this._id));
                        if (this._avatar)
                            this._avatar.update();
                    }
                    else if (this._state == 1) {
                        this.processDestroy();
                    }
                }
                showLifeCnt() {
                    this._lifeCntImg = this._imgPool.getItem();
                    this._lifeCntImg.setFrame(this._trunk.assetPrefix + "x" + this._lifeCnt)
                        .setOrigin(0.5)
                        .setPosition(0, 0)
                        .setAlpha(0.9);
                    this._container.add(this._lifeCntImg);
                }
                updateLifeCnt() {
                    if (this._lifeCnt != 0) {
                        this._lifeCntImg.setFrame(this._trunk.assetPrefix + "x" + this._lifeCnt);
                    }
                    else {
                        this.releaseLifeCntImg();
                    }
                }
                releaseDamageImg() {
                    this._container.remove(this._damageImg, false);
                    this._imgPool.returnItem(this._damageImg);
                    this._damageImg.visible = true;
                    this._damageImg = null;
                }
                releaseIceImg() {
                    this._container.remove(this._iceImg, false);
                    this._imgPool.returnItem(this._iceImg);
                    this._iceImg = null;
                }
                releaseLifeCntImg() {
                    this._container.remove(this._lifeCntImg, false);
                    this._imgPool.returnItem(this._lifeCntImg);
                    this._lifeCntImg.alpha = 1;
                    this._lifeCntImg = null;
                }
                releaseAvatar() {
                    this._avatar.reset();
                    this._trunk.friendsAvatarPool.returnItem(this._avatar);
                    this._avatar = null;
                }
            }
            Block.BRANCH_H_OFFSET = [
                [16, 28],
                [13, 22],
                [10, 17]
            ];
            Block.FLIGHT_LEN_DIS_X = [320, 256, 192];
            Block.FLIGHT_LEN_DIS_Y = [75, 60, 45];
            Block._HEIGHT = [96, 76, 58];
            Trunk.Block = Block;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk) {
            class BlockType {
                constructor(type, resistance, score) {
                    this._type = type;
                    this._resistance = resistance;
                    this._score = score;
                }
                get type() { return this._type; }
                get score() { return this._score; }
                get resistance() { return this._resistance; }
            }
            Trunk.BlockType = BlockType;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk) {
            class BlockModifier {
                constructor(id) {
                    this._id = id;
                    this._delay = -1;
                }
                get id() { return this._id; }
                get delay() { return this._delay; }
                get enabled() { return this._delay >= 0; }
                reset() {
                    this._delay = -1;
                }
                setup(minSpacing, maxSpacing) {
                    if (this.enabled) {
                        if (this._delay > maxSpacing)
                            this._delay = maxSpacing;
                    }
                    else {
                        this._delay = Phaser.Math.RND.integerInRange(minSpacing, maxSpacing);
                    }
                    this._minSpacing = minSpacing;
                    this._maxSpacing = maxSpacing;
                }
                decDelay() {
                    if (this._delay > 0) {
                        if (--this._delay == 0) {
                            this._delay = Phaser.Math.RND.integerInRange(this._minSpacing, this._maxSpacing);
                            return true;
                        }
                    }
                    return false;
                }
                setDelay(delay) {
                    this._delay = delay;
                }
            }
            Trunk.BlockModifier = BlockModifier;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk) {
            class BlockSettings {
                get type() { return this._type; }
                get branchSide() { return this._branchSide; }
                get branchType() { return this._branchType; }
                get ice() { return this._ice; }
                get bonus() { return this._bonus; }
                init(type, branchSide, branchType, ice, bonus) {
                    this._type = type;
                    this._branchSide = branchSide;
                    this._branchType = branchType;
                    this._ice = ice;
                    this._bonus = bonus;
                    return this;
                }
                load(buf, bufPos) {
                    let val = buf.getUint8(bufPos++);
                    this._type = Trunk.TrunkGenerator.BLOCK_TYPES[val & 0x07];
                    if ((val & 0x08) != 0) {
                        this._branchSide = (val & 0x10) != 0 ? 2 : 1;
                        this._branchType = Phaser.Math.RND.integerInRange(0, 1);
                    }
                    else {
                        this._branchSide = 0;
                    }
                    this._ice = (val & 0x20) != 0;
                    this._bonus = undefined;
                    return bufPos;
                }
                save(buf, bufPos) {
                    let val = this._type.type;
                    if (this._branchSide != 0) {
                        val |= (1 << 3);
                        if (this._branchSide == 2)
                            val |= (1 << 4);
                    }
                    if (this._ice)
                        val |= (1 << 5);
                    buf.setUint8(bufPos++, val);
                    return bufPos;
                }
            }
            Trunk.BlockSettings = BlockSettings;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Trunk;
        (function (Trunk) {
            class IceParticle {
                constructor(manager) {
                    this._manager = manager;
                    let plGroup = manager.trunk.group;
                    this._image = plGroup.camera.scene.add.image(0, 0, "atlas_0", manager.trunk.assetPrefix + "icePart_0")
                        .setVisible(false)
                        .setDepth(plGroup.depth + 4);
                    this._image.cameraFilter = ~plGroup.camera.id;
                }
                reset() {
                    if (this._image.visible) {
                        this._image.visible = false;
                    }
                }
                show(type) {
                    this._type = type;
                    this._image.setFrame(this._manager.trunk.assetPrefix + "icePart_" + type.assetId);
                    this._fallProgress = 0;
                    this._fallProgStep = Phaser.Math.RND.realInRange(1 / 20, 1 / 35);
                    this._fallRotStep = Phaser.Math.RND.integerInRange(2, 5);
                    if (Phaser.Math.RND.integerInRange(0, 1) == 0)
                        this._fallRotStep *= -1;
                    this.updatePosition();
                    this._image.setAlpha(1)
                        .setAngle(0)
                        .setVisible(true);
                }
                update(delta) {
                    if ((this._fallProgress += this._fallProgStep * delta) >= 1) {
                        this.reset();
                        return false;
                    }
                    this.updatePosition();
                    this._image.angle += this._fallRotStep * delta;
                    this._image.alpha = 1 - Phaser.Math.Easing.Cubic.In(this._fallProgress);
                    return true;
                }
                updatePosition() {
                    let trunk = this._manager.trunk;
                    let scale = 1 - 0.2 * trunk.group.assetId;
                    this._image.setPosition(trunk.x + this._type.offsetX * scale, trunk.getFirstBlockY() + this._type.offsetY * scale + Phaser.Math.Easing.Sine.In(this._fallProgress) * (IceParticle.FALL_DISTANCE * scale));
                }
            }
            IceParticle.FALL_DISTANCE = 120;
            Trunk.IceParticle = IceParticle;
            class IceParticleManager {
                constructor(trunk) {
                    this._trunk = trunk;
                    this._freeParticles = new Collections.Pool(undefined, IceParticleManager.TYPE_DATA.length, true, () => {
                        return new IceParticle(this);
                    }, this);
                    this._actParticles = new Collections.NodeList();
                }
                get trunk() { return this._trunk; }
                reset() {
                    if (!this._actParticles.empty) {
                        Gameplay.Manager.timer.events.off(Helpers.GameTimer.EVENT_UPDATE, this.handleTimerUpdate, this);
                        this._actParticles.foreach((particle) => {
                            particle.reset();
                            this._freeParticles.returnItem(particle);
                        }, this);
                        this._actParticles.clear();
                    }
                }
                showParticles() {
                    if (this._actParticles.empty)
                        Gameplay.Manager.timer.events.on(Helpers.GameTimer.EVENT_UPDATE, this.handleTimerUpdate, this);
                    IceParticleManager.TYPE_DATA.forEach((type) => {
                        let part = this._freeParticles.getItem();
                        part.show(type);
                        this._actParticles.add(part);
                    });
                }
                handleTimerUpdate(timer) {
                    this._actParticles.foreach((particle, node) => {
                        if (!particle.update(timer.delta)) {
                            this._freeParticles.returnItem(this._actParticles.removeByNode(node));
                        }
                    }, this);
                    if (this._actParticles.empty)
                        timer.events.off(Helpers.GameTimer.EVENT_UPDATE, this.handleTimerUpdate, this);
                }
            }
            IceParticleManager.TYPE_DATA = [
                { assetId: 0, offsetX: -31, offsetY: -28 },
                { assetId: 1, offsetX: 19, offsetY: -26.5 },
                { assetId: 2, offsetX: 46, offsetY: -15 },
                { assetId: 3, offsetX: 14, offsetY: 7 },
                { assetId: 4, offsetX: 36, offsetY: 25 },
                { assetId: 5, offsetX: -26, offsetY: 29 },
                { assetId: 6, offsetX: -32, offsetY: 5 },
            ];
            Trunk.IceParticleManager = IceParticleManager;
        })(Trunk = Gameplay.Trunk || (Gameplay.Trunk = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Modifiers;
        (function (Modifiers) {
            class Modifier {
                constructor(pos) {
                    this._pos = pos;
                }
                get pos() { return this._pos; }
            }
            Modifiers.Modifier = Modifier;
        })(Modifiers = Gameplay.Modifiers || (Gameplay.Modifiers = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Modifiers;
        (function (Modifiers) {
            class BlockModifier extends Modifiers.Modifier {
                constructor(pos, modifier, minSpacing, maxSpacing) {
                    super(pos);
                    this._modifier = modifier;
                    this._minSpacing = minSpacing;
                    this._maxSpacing = maxSpacing;
                }
                apply() {
                    Gameplay.Manager.instance.trunkGenerator.blockMods[this._modifier].setup(this._minSpacing, this._maxSpacing);
                }
            }
            Modifiers.BlockModifier = BlockModifier;
        })(Modifiers = Gameplay.Modifiers || (Gameplay.Modifiers = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Modifiers;
        (function (Modifiers) {
            class BranchSide extends Modifiers.Modifier {
                constructor(pos, step) {
                    super(pos);
                    this._step = step;
                }
                apply() {
                    Gameplay.Manager.instance.trunkGenerator.setBranchSideSwitchProbStep(this._step);
                }
            }
            Modifiers.BranchSide = BranchSide;
        })(Modifiers = Gameplay.Modifiers || (Gameplay.Modifiers = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Modifiers;
        (function (Modifiers) {
            class HitEnergy extends Modifiers.Modifier {
                constructor(pos, energy) {
                    super(pos);
                    this._energy = energy;
                }
                apply() {
                    Gameplay.Manager.instance.player.hitEnergy = this._energy;
                }
            }
            Modifiers.HitEnergy = HitEnergy;
        })(Modifiers = Gameplay.Modifiers || (Gameplay.Modifiers = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Modifiers;
        (function (Modifiers) {
            class ResistBlockPriority extends Modifiers.Modifier {
                constructor(pos, blockType, priority) {
                    super(pos);
                    this._blockType = blockType;
                    this._priority = priority;
                }
                apply() {
                    Gameplay.Manager.instance.trunkGenerator.resistBlockPriorities[this._blockType - 1] = this._priority;
                }
            }
            Modifiers.ResistBlockPriority = ResistBlockPriority;
        })(Modifiers = Gameplay.Modifiers || (Gameplay.Modifiers = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var HUD;
        (function (HUD_1) {
            class HUD {
                constructor(camera, depth) {
                    HUD._instance = this;
                    this._camera = camera;
                    camera.on("cam_resize", this.handleCameraResize, this);
                    this._depth = depth;
                    this._defPopupMsgSettings = new HUD_1.PopupMsgSettings();
                    this._freePopupMsgs = new Collections.Pool(undefined, 5, true, () => {
                        return new HUD_1.PopupMsg(depth + 10);
                    });
                    this._actPopupMsgs = new Collections.NodeList();
                    this._overlay = camera.scene.add.graphics()
                        .setVisible(false)
                        .setDepth(depth + 100);
                    this._overlay.cameraFilter = ~camera.id;
                    this._slideMsg = new HUD_1.SlideMsg(depth + 110);
                }
                static get instance() { return HUD._instance; }
                get camera() { return this._camera; }
                get depth() { return this._depth; }
                get slideMsg() { return this._slideMsg; }
                reset() {
                    this._camera.resetFX();
                    this._camera.off(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE);
                    this._camera.off(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE);
                    this._actPopupMsgs.foreach((msg) => {
                        msg.kill();
                        this._freePopupMsgs.returnItem(msg);
                    }, this);
                    this._actPopupMsgs.clear();
                    this._slideMsg.kill();
                    this._overlay.visible = false;
                }
                update() {
                    this._actPopupMsgs.foreach((msg, node) => {
                        if (!msg.update()) {
                            this._actPopupMsgs.removeByNode(node);
                            this._freePopupMsgs.returnItem(msg);
                        }
                    }, this);
                    if (this._slideMsg.state != SlideMessage.eMessageState.completed)
                        this._slideMsg.update();
                }
                showScorePopupMsg(points, multiplier, x, y, settings) {
                    let msg = this._freePopupMsgs.getItem();
                    this._actPopupMsgs.add(msg);
                    msg.show(multiplier == 1 ? "+" + points : multiplier + "X +" + points, x, y, (settings ? settings : this._defPopupMsgSettings));
                }
                showPopupMsg(message, x, y, settings) {
                    let msg = this._freePopupMsgs.getItem();
                    this._actPopupMsgs.add(msg);
                    msg.show(message, x, y, (settings ? settings : this._defPopupMsgSettings));
                }
                showScreenOverlay(redrawClb, redrawClbCtx, depth) {
                    if (depth == undefined)
                        depth = this._depth + 100;
                    this._overlay.setVisible(true)
                        .setDepth(depth);
                    this._overlayRedrawClb = redrawClb;
                    this._overlayRedrawClbCtx = redrawClbCtx;
                    redrawClb.call(redrawClbCtx, this._overlay, this._camera);
                }
                hideScreenOverlay() {
                    this._overlay.visible = false;
                }
                handleCameraResize(camera) {
                    if (this._overlay.visible)
                        this._overlayRedrawClb.call(this._overlayRedrawClbCtx, this._overlay, camera);
                }
            }
            HUD_1.HUD = HUD;
        })(HUD = Gameplay.HUD || (Gameplay.HUD = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var HUD;
        (function (HUD) {
            class PopupMsgSettings {
                constructor(fontKey = "font_0", fontSize = 60, tint = 0xFFFFFF) {
                    this._fontKey = fontKey;
                    this._fontSize = fontSize;
                    this._tint = tint;
                }
                get fontKey() { return this._fontKey; }
                get fontSize() { return this._fontSize; }
                get tint() { return this._tint; }
            }
            HUD.PopupMsgSettings = PopupMsgSettings;
            class PopupMsg extends PopupMessage.MessageBase {
                constructor(depth) {
                    if (!PopupMsg.TYPE)
                        PopupMsg.TYPE = new PopupMessage.MessageType(200, 750, Phaser.Math.Easing.Cubic.Out, 0, 750, Phaser.Math.Easing.Cubic.In);
                    super();
                    this._container = Gameplay.MainScene.instance.add.bitmapText(0, 0, "font_0", "", 50)
                        .setDepth(depth)
                        .setOrigin(0.5)
                        .setVisible(false);
                    this._container.cameraFilter = ~HUD.HUD.instance.camera.id;
                }
                getContainer() { return this._container; }
                show(text, x, y, settings) {
                    this._moveAngleDeg = Phaser.Math.RND.realInRange(-110, -70);
                    this._moveAngle = Phaser.Math.DegToRad(this._moveAngleDeg);
                    this._container.setText("")
                        .setFont(settings.fontKey, settings.fontSize)
                        .setTint(settings.tint)
                        .setText(text)
                        .setAngle(0)
                        .setVisible(true);
                    this.showMessage(x, y, PopupMsg.TYPE, Gameplay.Manager.timer);
                }
                kill() {
                    super.kill();
                    this._container.visible = false;
                }
                update() {
                    if (!super.update())
                        return false;
                    let progress = (this._timer.time - this._startTime) / PopupMsg.TYPE.moveTime;
                    this._container.angle = progress * ((this._moveAngleDeg - -90) * 3);
                    return true;
                }
            }
            HUD.PopupMsg = PopupMsg;
        })(HUD = Gameplay.HUD || (Gameplay.HUD = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var HUD;
        (function (HUD) {
            class Bar {
                constructor(scene, depth, bgFrame, fillFrame, fillFrameX, fillFrameY, incFxFrame) {
                    this._container = new Controls.Group.Group()
                        .setDepth(depth);
                    this._container.add(scene.add.image(0, 0, "atlas_0", bgFrame)
                        .setOrigin(0, 0));
                    this._fillImg = scene.add.image(0, 0, "atlas_0", fillFrame)
                        .setOrigin(0, 0);
                    this._container.add(this._fillImg, fillFrameX, fillFrameY, 0, false);
                    let incFxImg = scene.add.image(0, 0, "atlas_0", incFxFrame)
                        .setVisible(false);
                    this._incFxImg = this._container.add(incFxImg, 0, 0, 4 | 8, false);
                }
                get container() { return this._container; }
                get value() { return this._value; }
                setFillTint(color) {
                    this._fillImg.tint = color;
                }
                reset(value) {
                    this._incFxImg.visible = false;
                    this._value = Math.max(0, Math.min(1, value));
                    this.updateFillCrop();
                }
                setValue(value, showFx = true) {
                    let val = Math.max(0, Math.min(1, value));
                    if (val != this._value) {
                        if (val > this._value && showFx) {
                            this._incFxImg.content.setAlpha(0.5).setScale(1);
                            this._incFxImg.visible = true;
                            this._incFxStartTime = Gameplay.Manager.timer.time;
                        }
                        this._value = val;
                        this.updateFillCrop();
                    }
                }
                update() {
                    if (this._incFxImg.visible) {
                        let progress = (Gameplay.Manager.timer.time - this._incFxStartTime) / 300;
                        if (progress < 1) {
                            progress = Phaser.Math.Easing.Cubic.Out(progress);
                            let img = this._incFxImg.content;
                            img.setScale(1 + (((img.width + 36) / img.width) - 1) * progress, 1 + (((img.height + 36) / img.height) - 1) * progress)
                                .setAlpha(0.5 - 0.5 * progress);
                        }
                        else {
                            this._incFxImg.visible = false;
                        }
                    }
                }
                updateFillCrop() {
                    this._fillImg.setCrop(0, 0, Math.floor(this._value * this._fillImg.width), this._fillImg.height);
                }
            }
            HUD.Bar = Bar;
        })(HUD = Gameplay.HUD || (Gameplay.HUD = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var HUD;
        (function (HUD) {
            class SlideMsg extends SlideMessage.MessageBase {
                constructor(depth) {
                    super();
                    if (!SlideMsg._msgType) {
                        SlideMsg._msgType = new SlideMessage.MessageType(-1, 500, Phaser.Math.Easing.Cubic.Out, 0, Phaser.Math.Easing.Cubic.Out, 500, 1000, Phaser.Math.Easing.Cubic.In, 0, Phaser.Math.Easing.Cubic.In);
                    }
                    let camera = HUD.HUD.instance.camera;
                    this._text = camera.scene.add.bitmapText(0, 0, "font_0", "", 60)
                        .setDepth(depth)
                        .setVisible(false);
                    this._text.cameraFilter = ~camera.id;
                }
                getContainer() {
                    return this._text;
                }
                show(message, y, timer, onStateChangeClb, onStateChangeClbCtx) {
                    this._onStateChangeClb = onStateChangeClb;
                    this._onStateChangeClbCtx = onStateChangeClbCtx;
                    this._text.setText(message)
                        .setVisible(true);
                    super.showMessage(HUD.HUD.instance.camera, y, SlideMsg._msgType, timer);
                }
                update() {
                    let res = super.update();
                    if (!res)
                        this.kill();
                    return res;
                }
                kill() {
                    super.kill();
                    this._text.visible = false;
                }
            }
            HUD.SlideMsg = SlideMsg;
        })(HUD = Gameplay.HUD || (Gameplay.HUD = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var HUD;
        (function (HUD) {
            class NextTrunkFriend {
                constructor(plGroup, depth) {
                    this._plGroup = plGroup;
                    let scene = plGroup.camera.scene;
                    let assetPrefix = "hud/normal/avatar/";
                    this._container = new Controls.Group.Group(false)
                        .setDepth(depth)
                        .setVisible(false);
                    let img = scene.add.image(0, 0, "atlas_0", assetPrefix + "arrow")
                        .setOrigin(0.5, 1);
                    this._container.add(img, 0, -6, 4, false);
                    this._container.add(scene.add.image(0, 0, "atlas_0", assetPrefix + "shadow"), 0, 0, 4 | 8, true);
                    this._avatar = scene.add.image(0, 0, "atlas_0", assetPrefix + "defAvatar");
                    this._container.add(this._avatar, 0, 0, 4 | 8, false);
                    let avatarMask = scene.make.image({ key: "atlas_0", frame: assetPrefix + "mask", add: false });
                    this._container.add(avatarMask, 0, 0, 4 | 8, false);
                    this._avatar.setMask(avatarMask.createBitmapMask(avatarMask));
                    this._countdown = scene.add.bitmapText(0, 0, "font_2", "100", 32).setOrigin(0.5, 0);
                    this._container.add(this._countdown, 0, 10, 4 | 2, false);
                    plGroup.events.on(Gameplay.PlayerGroup.EVENT_SCORE_CHANGE, this.updateScoreCountdown, this);
                    plGroup.events.on(Gameplay.Trunk.Trunk.EVENT_POS_CHANGE, this.handleTrunkPosChange, this);
                }
                get friend() { return this._friend; }
                get visible() { return this._container.visible; }
                set visible(visible) {
                    if (visible != this.visible) {
                        if (!visible) {
                            this._container.visible = false;
                        }
                        else if (this._friend && this._friend.avatar.loaded) {
                            this._container.visible = true;
                        }
                    }
                }
                reset() {
                    if (this._friend) {
                        if (this._container.visible) {
                            this._avatar.setTexture("atlas_0", "hud/normal/avatar/defAvatar");
                            this._container.visible = false;
                        }
                        else {
                            Gameplay.Manager.instance.friends.events.off(Gameplay.Social.FriendManager.EVENT_AVATAR_LOADED + this._friend.uid, this.handleAvatarLoaded, this);
                        }
                        this._friend = null;
                    }
                }
                show(friend) {
                    this.reset();
                    if ((this._friend = friend)) {
                        let avatarState = friend.avatar.state;
                        if (avatarState == 2) {
                            this._avatar.setTexture(friend.avatar.textureKey, friend.avatar.textureFrame)
                                .setDisplaySize(NextTrunkFriend.AVATAR_SIZE, NextTrunkFriend.AVATAR_SIZE);
                            this.updateScoreCountdown();
                            this._container.visible = true;
                        }
                        else if (avatarState == 1) {
                            Gameplay.Manager.instance.friends.events.once(Gameplay.Social.FriendManager.EVENT_AVATAR_LOADED + friend.uid, this.handleAvatarLoaded, this);
                        }
                    }
                }
                updateScoreCountdown() {
                    if (this._friend != null) {
                        this._countdown.setText((this._friend.score - this._plGroup.score).toString());
                    }
                }
                handleAvatarLoaded(friendUID, success) {
                    if (success) {
                        this._avatar.setTexture(this._friend.avatar.textureKey, this._friend.avatar.textureFrame)
                            .setSize(NextTrunkFriend.AVATAR_SIZE, NextTrunkFriend.AVATAR_SIZE);
                        this.updateScoreCountdown();
                        this._container.visible = true;
                    }
                    else {
                        this._friend = null;
                    }
                }
                handleTrunkPosChange(trunk) {
                    this._container.setPosition(trunk.x - (this._container.width / 2), trunk.y - trunk.minVisHeight + 30);
                }
            }
            NextTrunkFriend.AVATAR_SIZE = 68;
            HUD.NextTrunkFriend = NextTrunkFriend;
        })(HUD = Gameplay.HUD || (Gameplay.HUD = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var HUD;
        (function (HUD) {
            class BlinkMessage {
                constructor(depth) {
                    this._container = new Controls.Group.Group(true)
                        .setDepth(depth)
                        .setVisible(false);
                    this._msg = this._container.add(HUD.HUD.instance.camera.scene.add.bitmapText(0, 0, "font_0", "", 60)
                        .setOrigin(0.5, 0.5), 0, 0, 0, false);
                }
                show(message, blinkInterval = 500, startAsVisible = true, alignment = 4 | 8) {
                    this.reset();
                    this._msg.content.setText(message);
                    this._msg.setVisible(startAsVisible)
                        .setAlignment(alignment)
                        .updateGroupOccupationArea();
                    this._container.visible = true;
                    let camera = HUD.HUD.instance.camera;
                    camera.on("cam_resize", this.handleCameraResize, this);
                    this.handleCameraResize(camera);
                    this._blinkEvent = Gameplay.MainScene.instance.time.addEvent({
                        delay: blinkInterval,
                        loop: true,
                        callback: () => {
                            this._msg.visible = !this._msg.visible;
                        },
                        callbackScope: this
                    });
                }
                reset() {
                    if (this._blinkEvent) {
                        this._blinkEvent.remove(false);
                        this._blinkEvent = null;
                        this._container.visible = false;
                        HUD.HUD.instance.camera.off("cam_resize", this.handleCameraResize, this);
                    }
                }
                handleCameraResize(camera) {
                    this._container.setCustomSize(camera.width, camera.height)
                        .setPosition(camera.scrollX, camera.scrollY);
                }
            }
            HUD.BlinkMessage = BlinkMessage;
        })(HUD = Gameplay.HUD || (Gameplay.HUD = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            class BattleSettings {
                constructor() {
                    let scene = Normal.HUD.HUD.instance.camera.scene;
                    this._events = new Phaser.Events.EventEmitter();
                    this._events.on("btn_click", this.handleBtnClick, this);
                    this._container = new Controls.Group.Group()
                        .setDepth(200 + 100 + 1);
                    let bg = scene.add.image(0, 0, "atlas_0", "hud/battle/settingsBg")
                        .setOrigin(0)
                        .setScale(2);
                    this._container.add(bg);
                    let btn = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "hud/btnX_")
                        .setId(BattleSettings.BTN_CLOSE)
                        .setEventEmitter(this._events);
                    this._btnX = this._container.add(btn, 0, -btn.height / 2, 1, false);
                    this._container.add(scene.add.image(0, 0, "atlas_0", "hud/battle/settingsTitle"), 0, 60, 4, false);
                    this._setters = [
                        new Controls.ValueSetter(scene, 0, 1, "GOOD BONUS"),
                        new Controls.ValueSetter(scene, 0, 1, "BAD BONUS"),
                        new Controls.ValueSetter(scene, 0, 0, "DARKNESS"),
                        new Controls.ValueSetter(scene, 1, 1)
                    ];
                    this._setters[3].events.on(Controls.ValueSetter.EVENT_VALUE_CHANGED, this.handleBattleTimeChanged, this);
                    this.handleBattleTimeChanged(this._setters[3], this._setters[3].value);
                    let x = (this._container.width - this._setters[0].container.width) / 2;
                    let y = 155;
                    for (let i = 0; i < this._setters.length; i++) {
                        this._container.add(this._setters[i].container, x, y, 0, false);
                        y += 100;
                    }
                    btn = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "hud/btnCreate_")
                        .setId(BattleSettings.BTN_CREATE)
                        .setEventEmitter(this._events);
                    this._container.add(btn, 0, -20, 4 | 2, false);
                }
                get events() { return this._events; }
                reset() {
                    this.hide();
                }
                show() {
                    if (this._container.visible)
                        return;
                    this._container.visible = true;
                    Normal.HUD.HUD.instance.showScreenOverlay((overlay, camera) => {
                        overlay.clear()
                            .fillStyle(0, 0.5)
                            .fillRect(camera.scrollX, camera.scrollY, camera.width, camera.height);
                    }, this);
                    Normal.HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                    this.handleCameraResize(Normal.HUD.HUD.instance.camera);
                }
                hide() {
                    if (this._container.visible) {
                        Normal.HUD.HUD.instance.hideScreenOverlay();
                        this._container.visible = false;
                        Normal.HUD.HUD.instance.camera.off("cam_resize", this.handleCameraResize);
                    }
                }
                handleBtnClick(btn) {
                    Game.Global.game.sound.playAudioSprite("sfx", "click");
                    if (btn.id == BattleSettings.BTN_CREATE) {
                        let settings = {
                            fog: this._setters[2].value,
                            battleLen: this._setters[3].value - 1,
                            bonusFreq: [this._setters[0].value, this._setters[1].value]
                        };
                        Gamee2.Gamee.share({
                            text: "Karate Kido 2",
                            picture: Game.Global.game.textures.getBase64("atlas_0", "battleSplash"),
                            destination: "battle",
                            initData: JSON.stringify(settings)
                        });
                        Gamee2.Gamee.logEvent("CUSTOM_BATTLE");
                    }
                    this.hide();
                    this._events.emit(BattleSettings.EVENT_CLOSE);
                }
                handleBattleTimeChanged(setter, value) {
                    let i = Gameplay.Battle.Settings.BATTLE_LEN[value - 1];
                    let time = Math.floor(i / 60) + ":";
                    if ((i %= 60) < 10)
                        time += "0";
                    time += i;
                    setter.title = "LENGTH: " + time;
                }
                handleCameraResize(camera) {
                    this._container.setPosition(camera.scrollX + ((camera.width - this._container.width) >> 1), camera.scrollY + ((camera.height - this._container.height) >> 1));
                    let space = this._container.x;
                    let offset = this._btnX.width / 2;
                    if (space < offset)
                        offset = space;
                    this._btnX.setOffsetX(offset);
                }
            }
            BattleSettings.EVENT_CLOSE = "batSet_close";
            BattleSettings.BTN_CLOSE = 0;
            BattleSettings.BTN_CREATE = 1;
            Normal.BattleSettings = BattleSettings;
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            class Manager extends Gameplay.Manager {
                constructor(friends) {
                    super();
                    this._friends = friends;
                    Manager.CHARACTERS = [
                        new Gameplay.Player.Character(0, 0, 1, 78, [0, 26.5, -2, -5], [0, 0, 0, 0], [0xf8f8f8, 0xf8d237, 0xf87500], [150, 300, 600], true, 16, 0, 1, 0.1, [2], [
                            new Gameplay.Modifiers.BlockModifier(0, 1, 10, 30),
                            new Gameplay.Modifiers.ResistBlockPriority(50, 1, 10),
                            new Gameplay.Modifiers.ResistBlockPriority(100, 2, 5),
                            new Gameplay.Modifiers.ResistBlockPriority(200, 3, 2.5)
                        ]),
                        new Gameplay.Player.Character(1, 0, 2, 100, [0, -2.5, -7, -12], [0, 3, 0, 1], [0x3ca83f, 0x3783f8, 0x9800f8], [300, 900, 1800], true, 36, 0, 1.5, 0.1, [0, 2], [
                            new Gameplay.Modifiers.BlockModifier(0, 1, 10, 30),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 1, 10),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 2, 0),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 3, 0),
                            new Gameplay.Modifiers.ResistBlockPriority(50, 2, 5),
                            new Gameplay.Modifiers.ResistBlockPriority(150, 3, 2.5)
                        ]),
                        new Gameplay.Player.Character(2, 0, 3, 100, [0, 22.5, 15.5, -5.5], [0, 0, 0, 0], [0xf53535, 0x944e25, 0x363636], [600, 1800, 3600], true, 46, 0, 2, 0.1, [0, 2, 3], [
                            new Gameplay.Modifiers.BlockModifier(0, 1, 10, 30),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 1, 10),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 2, 10),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 3, 0),
                            new Gameplay.Modifiers.ResistBlockPriority(50, 3, 10)
                        ]),
                        new Gameplay.Player.Character(3, 0, 4, 100, [0, 18, -6.5, -6], [0, 2, 0, 0], [0x363636, 0x363636, 0x363636, 0x363636, 0x363636, 0x363636], [600, 1200, 2400, 4800, 9600, 19200], false, 46, 0, 2.5, 0.1, [0, 2, 3, 1], [
                            new Gameplay.Modifiers.BlockModifier(0, 1, 10, 30),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 1, 10),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 2, 10),
                            new Gameplay.Modifiers.ResistBlockPriority(0, 3, 10),
                        ])
                    ];
                    let saveState;
                    if (Gamee2.Gamee.initialized) {
                        try {
                            if (Gamee2.Gamee.initData && Gamee2.Gamee.initData.saveState)
                                saveState = JSON.parse(Gamee2.Gamee.initData.saveState);
                        }
                        catch (e) {
                            saveState = undefined;
                        }
                    }
                    let camera = Gameplay.MainScene.instance.cameras.main;
                    this._trunkGenerator = new Gameplay.Trunk.TrunkGenerator([
                        new Gameplay.Modifiers.BranchSide(20, 0.2),
                        new Gameplay.Modifiers.BlockModifier(30, 0, 20, 40),
                        new Gameplay.Modifiers.BranchSide(40, 0.25),
                        new Gameplay.Modifiers.BranchSide(60, 0.33),
                        new Gameplay.Modifiers.BranchSide(80, 0.40),
                        new Gameplay.Modifiers.BranchSide(100, 0.50),
                        new Gameplay.Modifiers.HitEnergy(100, 0.24),
                        new Gameplay.Modifiers.BranchSide(120, 0.60),
                        new Gameplay.Modifiers.BranchSide(200, 0.75),
                        new Gameplay.Modifiers.HitEnergy(200, 0.23),
                        new Gameplay.Modifiers.HitEnergy(300, 0.22),
                        new Gameplay.Modifiers.HitEnergy(400, 0.21),
                        new Gameplay.Modifiers.HitEnergy(500, 0.20)
                    ]);
                    this._player = new Gameplay.PlayerGroup(0, camera, 100 + 50, 0, this._trunkGenerator);
                    this._player.controller = new Gameplay.Player.Controllers.HumanNormal(Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.RIGHT);
                    this._player.events.on(Gameplay.Player.Player.EVENT_DEATH, () => { this.gameOver(); }, this);
                    this._player.events.on(Gameplay.PlayerGroup.EVENT_SCORE_CHANGE, (group, score) => {
                        Gamee2.Gamee.score = score;
                    }, this);
                    this._charProgress = new Gameplay.Player.CharacterProgress(Manager.CHARACTERS, this._player, (saveState ? saveState.totalBlockCnt : 0));
                    Gameplay.MainScene.instance.events.on(Gameplay.Player.CharacterProgress.EVENT_NEW_LEVEL, (charProgress) => {
                        Manager._timer.pause();
                        this._state = 1;
                        Normal.HUD.CharIntro.instance.show(charProgress.character, charProgress.beltId, charProgress.beltId == 0);
                    }, this);
                    this._player.player.setCharacter(this._charProgress.character);
                    this._player.player.setBelt(this._charProgress.beltId);
                    this._bg = new Normal.Background(0, [camera]);
                    this._hud = new Normal.HUD.HUD(camera, 200);
                    Gameplay.MainScene.instance.events.on(Normal.HUD.CharIntro.EVENT_INTRO_COMPLETE, () => {
                        Manager._timer.resume();
                        this._state = 0;
                        this._hud.energyBar.pause(1500);
                        this._player.player.setCharacter(this._charProgress.character);
                        this._player.player.setBelt(this._charProgress.beltId);
                    }, this);
                    Gameplay.MainScene.instance.events.on(Normal.HUD.EnergyBar.EVENT_OUT_OF_ENERGY, this.gameOver, this);
                    if (!Gamee2.Gamee.initialized || (Gamee2.Gamee.initData.platform != "web" && Gamee2.Gamee.initData.platform != "mobile_web")) {
                        this._battleBtn = new Normal.HUD.BattleButton(200);
                        this._battleSettings = new Normal.BattleSettings();
                        this._battleSettings.events.on(Normal.BattleSettings.EVENT_CLOSE, () => {
                            this._battleBtn.show();
                            this.setGameplayElementsVisibility(true);
                            this._player.controller.enabled = true;
                        }, this);
                        this._battleBtn.events.on(Normal.HUD.BattleButton.EVENT_CLICK, () => {
                            this._battleBtn.hide();
                            this.setGameplayElementsVisibility(false);
                            this._player.controller.enabled = false;
                            this._battleSettings.show();
                        }, this);
                    }
                    camera.on("cam_resize", this.handleCameraResize, this);
                    if (Gamee2.Gamee.initialized) {
                        this._state = 6;
                        Gamee2.Gamee.events.on("start", this.handleGameeStart, this);
                    }
                    else {
                        this._state = 4;
                    }
                }
                get state() { return this._state; }
                get player() { return this._player; }
                get playerCharProgress() { return this._charProgress; }
                startPlaying() {
                    this._state = 0;
                    this._hud.blinkMessage.reset();
                    if (this._battleBtn)
                        this._battleBtn.hide();
                }
                isPlaying() {
                    return this._state == 0;
                }
                reset(resetScene) {
                    super.reset(resetScene);
                    this._trunkGenerator.reset();
                    this._charProgress.reapplyCharMods();
                    this._player.reset();
                    this._credits = 1;
                    if (this._battleBtn) {
                        this._battleBtn.show();
                        this._battleSettings.reset();
                    }
                    this._hud.blinkMessage.show("TAP TO PLAY", 500, false);
                    this.setGameplayElementsVisibility(true);
                    if (this._state != 6) {
                        this._state = 5;
                    }
                    else {
                        Manager._timer.pause();
                        Gamee2.Gamee.gameReady();
                    }
                }
                update(delta) {
                    super.update(delta);
                    this._player.update();
                    this._hud.update();
                }
                applyTrunkBonus(bonus) {
                    switch (bonus) {
                        case 0: {
                            this._hud.energyBar.freeze();
                            break;
                        }
                        case 2: {
                            this._hud.energyBar.refill();
                            break;
                        }
                        case 1: {
                            this._player.player.startGodMode();
                            break;
                        }
                        case 3: {
                            this._player.setScoreMultiplier(2);
                            Game.Global.game.sound.playAudioSprite("sfx", "bonusPickup");
                            break;
                        }
                    }
                }
                setGameplayElementsVisibility(visible) {
                    this._player.visible = visible;
                    this._hud.energyBar.container.visible = visible;
                    this._hud.charProgressBar.container.visible = visible;
                }
                gameOver() {
                    if (this._state == 0) {
                        if (this._player.player.state != 2) {
                            this._state = 2;
                            this._player.player.kill(0);
                            this._hud.showScreenOverlay((overlay, camera) => {
                                overlay.clear();
                                overlay.fillStyle(0xFF0000, 0.75);
                                overlay.fillRect(camera.scrollX, 440, camera.width, 80);
                            }, this);
                            this._hud.slideMsg.show("TIME'S UP", 452, Manager._timer, (state) => {
                                if (state == SlideMessage.eMessageState.completed) {
                                    Normal.HUD.HUD.instance.hideScreenOverlay();
                                    this.endGame1();
                                }
                            }, this);
                        }
                        else {
                            this.endGame1();
                        }
                    }
                }
                endGame1() {
                    if (this._credits != 0 && (!Gamee2.Gamee.ready || Gamee2.Gamee.adState == 0 && this._player.score >= 500)) {
                        let keepPlaying = Normal.HUD.KeepPlaying.instance;
                        keepPlaying.events.once(Normal.HUD.KeepPlaying.EVENT_COMPLETE, (res) => {
                            if (res) {
                                this._hud.energyBar.refill();
                                Manager._timer.resume();
                                this._state = 0;
                                this._credits--;
                                this._player.player.revive();
                            }
                            else {
                                this.endGame2();
                            }
                        }, this);
                        keepPlaying.show();
                        Manager._timer.pause();
                        this._state = 3;
                    }
                    else {
                        this.endGame2();
                    }
                }
                endGame2() {
                    this._state = 4;
                    if (Gamee2.Gamee.initialized) {
                        let saveState = {
                            totalBlockCnt: this._charProgress.totalBlockCnt
                        };
                        Game.Global.game.sound.pauseOnBlur = false;
                        Gamee2.Gamee.gameOver(undefined, JSON.stringify(saveState));
                    }
                }
                handleCameraResize(camera) {
                    this._player.trunk.setPosition(Math.floor(camera.scrollX + camera.width / 2), camera.scrollY + Manager.TRUNK_Y, Manager.TRUNK_Y);
                }
                handleGameeStart() {
                    Gamee2.Gamee.loadAd();
                    if (this._state != 6) {
                        Gameplay.MainScene.instance.sys.resume();
                        if (this._state == 4)
                            this._friends.load(Gameplay.MainScene.instance);
                        this.reset(true);
                    }
                    else {
                        Manager.timer.resume();
                        this._state = 5;
                    }
                    Game.Global.game.sound.pauseOnBlur = true;
                }
            }
            Manager.TRUNK_Y = 800;
            Normal.Manager = Manager;
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            class Background extends Gameplay.Background.Background {
                constructor(depth, cameras) {
                    super(depth, cameras);
                    this._dayTime = new Gameplay.DayTime(Normal.Manager.timer);
                    this._dayTime.objects.add(new Gameplay.Background.Sky(depth + 0, this._cameraFilter, 0, "sky_", 747));
                    this._dayTime.objects.add(new Gameplay.Background.Planet(depth + 1, this._cameraFilter, 0.10, 0.85, "sun"));
                    this._dayTime.objects.add(new Gameplay.Background.Planet(depth + 1, this._cameraFilter, 0.70, 0.30, "moon"));
                    this._dayTime.objects.add(new Gameplay.Background.Clouds(depth + 2, this._cameraFilter, Normal.Manager.timer));
                    this._dayTime.objects.add(new Gameplay.Background.Temple(depth + 3, this._cameraFilter));
                    this._dayTime.objects.add(new Gameplay.Background.Fireflies(depth + 4, this._cameraFilter, Normal.Manager.timer));
                }
                reset() {
                    super.reset();
                    this._dayTime.reset();
                }
                update() {
                    this._dayTime.update();
                }
            }
            Normal.Background = Background;
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            var HUD;
            (function (HUD) {
                class KeepPlaying {
                    constructor(depth) {
                        KeepPlaying._instance = this;
                        let scene = HUD.HUD.instance.camera.scene;
                        this._panel = new Controls.Group.Group(true)
                            .setDepth(depth)
                            .setCustomSize(200, KeepPlaying.PANEL_HEIGHT)
                            .setVisible(false);
                        this._panel.y = (Game.Global.CAMERA_HEIGHT - KeepPlaying.PANEL_HEIGHT) >> 1;
                        this._panel.add(scene.add.image(0, 0, "atlas_0", "hud/fist").setOrigin(0.5, 1), 0, 0, 4 | 2, false);
                        this._message = this._panel.add(scene.add.bitmapText(0, 0, "font_0", "", 60).setOrigin(0.5, 0), 0, 0, 4, false);
                        this._counter = this._panel.add(scene.add.bitmapText(0, 0, "font_0", "", 60)
                            .setOrigin(0.5, 0)
                            .setTintFill(0xFFED00), 0, 150, 4, false);
                        this._events = new Phaser.Events.EventEmitter();
                        this._events.on("btn_click", this.handleButtonClick, this);
                        this._button = this._panel.add(new Controls.Buttons.BasicButton(scene, 0, 260, "atlas_0", "hud/btnAd_").setEventEmitter(this._events), 0, 260, 4, false);
                        this._timer = new Helpers.GameTimer();
                    }
                    static get instance() { return KeepPlaying._instance; }
                    get events() { return this._events; }
                    get active() { return this._panel.visible; }
                    reset() {
                        if (this._panel.visible) {
                            this._panel.visible = false;
                            HUD.HUD.instance.hideScreenOverlay();
                            HUD.HUD.instance.camera.off("cam_resize", this.handleCameraResize, this);
                        }
                    }
                    show() {
                        this._flags = 0;
                        this._timer.start();
                        HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                        this.handleCameraResize(HUD.HUD.instance.camera);
                        HUD.HUD.instance.showScreenOverlay((overlay) => {
                            overlay.clear();
                            overlay.fillStyle(0x46016e, 1);
                            overlay.fillRect(this._panel.x, this._panel.y, this._panel.width, this._panel.height);
                        }, this);
                        this._message.content.setText("KEEP PLAYING?");
                        this._message.setVisible(true)
                            .setOffsetY(KeepPlaying.MSG_KEEP_PLAYING_Y);
                        this.updateCounter(KeepPlaying.COUNTER_MAX_VAL);
                        this._counter.visible = true;
                        this._button.visible = true;
                        this._panel.visible = true;
                    }
                    update() {
                        this._timer.update(Game.Global.game.loop.delta);
                        if ((this._flags & 2) != 0) {
                            this.reset();
                            this.emitCompleteEvent();
                        }
                        else if ((this._flags & 8) == 0) {
                            let time = this._timer.time;
                            if ((this._flags & 4) != 0) {
                                this._message.visible = (Math.floor(time / 500) & 1) != 0;
                            }
                            else {
                                let remSec = KeepPlaying.COUNTER_MAX_VAL - Math.floor(time / 1000);
                                if (remSec != this._counterVal)
                                    this.updateCounter(remSec);
                                if (remSec == 0) {
                                    this.reset();
                                    this.emitCompleteEvent();
                                }
                            }
                        }
                    }
                    emitCompleteEvent() {
                        this._events.emit(KeepPlaying.EVENT_COMPLETE, (this._flags & 1) != 0);
                    }
                    updateCounter(val) {
                        this._counterVal = val;
                        this._counter.content.setText(val.toString());
                    }
                    handleButtonClick() {
                        if (Gamee2.Gamee.ready) {
                            if (Gamee2.Gamee.adState != 0 || !Gamee2.Gamee.showAd((res) => {
                                this._flags &= ~8;
                                if (res) {
                                    this.showTapToPlay();
                                }
                                else {
                                    this._flags |= 2;
                                }
                            }, this)) {
                                this._flags |= 2;
                            }
                            else {
                                this._flags |= 8;
                            }
                        }
                        else {
                            this.showTapToPlay();
                        }
                    }
                    showTapToPlay() {
                        this._flags |= 1 | 4;
                        this._message.content.setText("TAP TO PLAY");
                        this._message.setOffsetY(KeepPlaying.MSG_TAP_TO_PLAY_Y);
                        this._counter.visible = false;
                        this._button.visible = false;
                        Gameplay.MainScene.instance.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
                            this._flags |= 2;
                        }, this);
                    }
                    handleCameraResize(camera) {
                        this._panel.setCustomSize(camera.width, KeepPlaying.PANEL_HEIGHT);
                    }
                }
                KeepPlaying.EVENT_COMPLETE = "keepPlaying_complete";
                KeepPlaying.PANEL_HEIGHT = 384;
                KeepPlaying.MSG_KEEP_PLAYING_Y = 34;
                KeepPlaying.MSG_TAP_TO_PLAY_Y = 158;
                KeepPlaying.COUNTER_MAX_VAL = 3;
                HUD.KeepPlaying = KeepPlaying;
            })(HUD = Normal.HUD || (Normal.HUD = {}));
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            var HUD;
            (function (HUD) {
                class EnergyBar {
                    constructor(depth) {
                        let scene = HUD.HUD.instance.camera.scene;
                        this._container = new Controls.Group.Group()
                            .setDepth(depth);
                        this._bar = new Gameplay.HUD.Bar(scene, 0, "hud/barBg", "hud/energyBarFill", 5, 5, "hud/barIncFx");
                        this._container.add(this._bar.container, 30, 0, 8, true);
                        this._freezeFxImg = this._container.add(scene.add.image(0, 0, "atlas_0", "hud/energyBarFreezeFx"), 10, 10, 4 | 8, false)
                            .setVisible(false);
                        this._container.add(scene.add.image(0, 0, "atlas_0", "hud/energyBarIcon").setOrigin(0, 0.5), 0, 0, 8, true);
                        Normal.Manager.instance.player.events.on(Gameplay.Trunk.Trunk.EVENT_HIT, this.handleTrunkHit, this);
                        HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                    }
                    get container() { return this._container; }
                    reset() {
                        this._bar.reset(1);
                        this._freezeFxImg.visible = false;
                        this._flags = 1;
                        this._pauseEndTime = -1;
                    }
                    pause(len) {
                        this._flags |= 1;
                        this._pauseEndTime = (len > 0 ? Normal.Manager.timer.time + len : -1);
                    }
                    freeze() {
                        this._flags |= 2;
                        this._unfreezeTime = Normal.Manager.timer.time + 5000;
                        this._freezeFxImg.visible = true;
                        this._freezeFxBlinkTimer = 0;
                        Game.Global.game.sound.playAudioSprite("sfx", "timeFreeze");
                    }
                    refill() {
                        if (this._bar.value == 1) {
                            this.pause(1000);
                        }
                        else {
                            this._flags |= 4;
                        }
                        Game.Global.game.sound.playAudioSprite("sfx", "timeRefill");
                    }
                    update() {
                        this._bar.update();
                        if (Normal.Manager.instance.player.player.death || Normal.Manager.timer.paused)
                            return;
                        let timer = Normal.Manager.timer;
                        if ((this._flags & 1) != 0 && this._pauseEndTime >= 0 && timer.time >= this._pauseEndTime)
                            this._flags &= ~1;
                        if ((this._flags & 2) != 0) {
                            let remTime = this._unfreezeTime - timer.time;
                            if (remTime < 1000) {
                                if (remTime <= 0) {
                                    this._freezeFxImg.visible = false;
                                    this._flags &= ~2;
                                }
                                else {
                                    this._freezeFxBlinkTimer -= timer.delta;
                                    if (this._freezeFxBlinkTimer <= 0) {
                                        this._freezeFxBlinkTimer = 60 / 10;
                                        this._freezeFxImg.visible = !this._freezeFxImg.visible;
                                    }
                                }
                            }
                        }
                        if ((this._flags & 4) != 0) {
                            if (this._bar.value < 1) {
                                this._bar.setValue(this._bar.value + 0.01, false);
                                if (this._bar.value == 1) {
                                    this._flags &= ~4;
                                    this.pause(0);
                                }
                            }
                        }
                        if ((this._flags & (2 | 1 | 4)) == 0 && this._bar.value > 0) {
                            if (this._bar.value > 0) {
                                this._bar.setValue(this._bar.value - (EnergyBar.DEC_STEP * timer.delta));
                                if (this._bar.value == 0)
                                    Gameplay.MainScene.instance.events.emit(EnergyBar.EVENT_OUT_OF_ENERGY);
                            }
                        }
                    }
                    handleTrunkHit(trunk) {
                        if ((this._flags & (2 | 4)) != 0)
                            return;
                        if ((this._flags & 1) != 0)
                            this._flags &= ~1;
                        this._bar.setValue(this._bar.value + trunk.group.hitEnergy);
                    }
                    handleCameraResize(camera) {
                        this._container.setPosition(camera.scrollX + 20, camera.scrollY + 20);
                    }
                }
                EnergyBar.EVENT_OUT_OF_ENERGY = "energyBar_outOfEnergy";
                EnergyBar.DEC_STEP = 0.00225;
                HUD.EnergyBar = EnergyBar;
            })(HUD = Normal.HUD || (Normal.HUD = {}));
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            var HUD;
            (function (HUD_2) {
                class HUD extends Gameplay.HUD.HUD {
                    constructor(camera, depth) {
                        super(camera, depth);
                        this._energyBar = new HUD_2.EnergyBar(depth);
                        this._charProgressBar = new HUD_2.CharProgressBar(Normal.Manager.instance.playerCharProgress, depth);
                        this._keepPlaying = new HUD_2.KeepPlaying(depth + 110);
                        this._charIntro = new HUD_2.CharIntro(depth + 105);
                        this._blinkMessage = new Gameplay.HUD.BlinkMessage(depth);
                    }
                    get energyBar() { return this._energyBar; }
                    get charProgressBar() { return this._charProgressBar; }
                    get blinkMessage() { return this._blinkMessage; }
                    reset() {
                        super.reset();
                        this._charIntro.reset();
                        this._keepPlaying.reset();
                        this._energyBar.reset();
                        this._blinkMessage.reset();
                    }
                    update() {
                        super.update();
                        this._energyBar.update();
                        this._charProgressBar.update();
                        if (this._charIntro.active) {
                            this._charIntro.update();
                        }
                        else if (this._keepPlaying.active) {
                            this._keepPlaying.update();
                        }
                    }
                }
                HUD_2.HUD = HUD;
            })(HUD = Normal.HUD || (Normal.HUD = {}));
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            var HUD;
            (function (HUD) {
                class CharIntro {
                    constructor(depth) {
                        CharIntro._instance = this;
                        this._timer = new Helpers.GameTimer();
                        let scene = HUD.HUD.instance.camera.scene;
                        this._container = scene.add.container(0, 0)
                            .setDepth(depth)
                            .setVisible(false);
                        this._lightFx = scene.make.image({ key: "atlas_0", frame: "fx/lightBeams", add: false })
                            .setScale(2);
                        this._container.add(this._lightFx);
                        this._sprite = scene.make.sprite({ key: "atlas_1", add: false });
                        this._container.add(this._sprite);
                        this._char = null;
                        this._beltId = -1;
                    }
                    static get instance() { return this._instance; }
                    get active() { return this._container.visible; }
                    reset() {
                        if (this._container.visible) {
                            this._container.visible = false;
                            HUD.HUD.instance.hideScreenOverlay();
                            HUD.HUD.instance.camera.off("cam_resize", this.handleCameraResize, this);
                        }
                    }
                    show(char, beltId, newChar) {
                        this._char = char;
                        this._beltId = beltId;
                        this._newChar = newChar;
                        if (newChar) {
                            this._sprite.setFrame(char.uid + "/image")
                                .setOrigin(0.5)
                                .setTint(0xFFFFFF);
                        }
                        else {
                            this._sprite.setFrame("belt")
                                .setOrigin(0.5, 0.33)
                                .setTint(char.belts[beltId]);
                        }
                        this._timer.start();
                        this._state = 0;
                        HUD.HUD.instance.camera.fadeOut(1000, 0xFF, 0xFF, 0xFF, this.handleCameraFadeOut, this);
                    }
                    update() {
                        if (!this._container.visible)
                            return;
                        this._timer.update(Game.Global.game.loop.delta);
                        this._lightFx.angle += (2 * this._timer.delta);
                    }
                    handleCameraFadeOut(camera) {
                        if (this._state == 0) {
                            let hud = HUD.HUD.instance;
                            hud.camera.on("cam_resize", this.handleCameraResize, this);
                            this.handleCameraResize(hud.camera);
                            hud.showScreenOverlay(this.handleRedrawOverlay, this);
                            hud.slideMsg.show("LEVEL UP!", CharIntro.MESSAGE_Y, this._timer, this.handleMsgStateChange, this);
                            this._msgId = 0;
                            this._container.visible = true;
                            Game.Global.game.sound.playAudioSprite("sfx", "levelUp");
                            this._state = 1;
                        }
                        else {
                            this.reset();
                            Gameplay.MainScene.instance.events.emit(CharIntro.EVENT_INTRO_COMPLETE, this._char, this._beltId, this._newChar);
                        }
                        camera.fadeIn(1000, 0xFF, 0xFF, 0xFF);
                    }
                    handleCameraResize(camera) {
                        this._container.setPosition(camera.scrollX, camera.scrollY);
                        this._container.setSize(camera.width, camera.height);
                        this._lightFx.setPosition(camera.width / 2, camera.height / 2);
                        this._sprite.setPosition(this._lightFx.x, this._lightFx.y);
                    }
                    handleRedrawOverlay(overlay, camera) {
                        overlay.clear();
                        overlay.fillStyle(0, 0.75);
                        overlay.fillRect(camera.scrollX, 0, camera.width, camera.height);
                        overlay.fillStyle(0xFF0000, 0.75);
                        overlay.fillRect(camera.scrollX, 785, camera.width, 80);
                    }
                    handleMsgStateChange(state) {
                        if (state == SlideMessage.eMessageState.completed) {
                            if (this._msgId == 0) {
                                this._msgId++;
                                HUD.HUD.instance.slideMsg.show("SCORE " + this._char.getScoreMultiplier(this._beltId) + "X", CharIntro.MESSAGE_Y, this._timer, this.handleMsgStateChange, this);
                            }
                            else {
                                this._state = 2;
                                HUD.HUD.instance.camera.fadeOut(1000, 0xFF, 0xFF, 0xFF, this.handleCameraFadeOut, this);
                            }
                        }
                    }
                }
                CharIntro.EVENT_INTRO_COMPLETE = "charIntro_complete";
                CharIntro.MESSAGE_Y = 797;
                HUD.CharIntro = CharIntro;
            })(HUD = Normal.HUD || (Normal.HUD = {}));
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            var HUD;
            (function (HUD) {
                class CharProgressBar {
                    constructor(charProgress, depth) {
                        let scene = HUD.HUD.instance.camera.scene;
                        this._container = new Controls.Group.Group()
                            .setDepth(depth);
                        this._bar = new Gameplay.HUD.Bar(scene, 0, "hud/barBg", "hud/progBarFill", 5, 5, "hud/barIncFx");
                        this._container.add(this._bar.container, 0, 0, 8, true);
                        this._container.add(scene.add.image(0, 0, "atlas_0", "hud/progBarIcon").setOrigin(0, 0.5), this._bar.container.width - 18, 0, 8, true);
                        this._iconTxt = scene.add.bitmapText(0, 0, "font_0", "", 24)
                            .setOrigin(0.5);
                        this._container.add(this._iconTxt, -24, 0, 1 | 8, false);
                        this._charProgress = charProgress;
                        Gameplay.MainScene.instance.events.on(Gameplay.Player.CharacterProgress.EVENT_PROGRESS_CHANGE, this.handleCharProgressChange, this);
                        Gameplay.MainScene.instance.events.on(HUD.CharIntro.EVENT_INTRO_COMPLETE, this.handleCharIntroComplete, this);
                        this.handleCharIntroComplete();
                        HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                    }
                    get container() { return this._container; }
                    update() {
                        this._bar.update();
                    }
                    handleCharProgressChange(charProgress, progress) {
                        this._bar.setValue(charProgress.progress, true);
                    }
                    handleCharIntroComplete() {
                        let charProgress = this._charProgress;
                        this._bar.setFillTint(charProgress.character.belts[charProgress.beltId]);
                        this._bar.setValue(charProgress.progress, false);
                        this._iconTxt.setText(charProgress.character.getScoreMultiplier(charProgress.beltId) + "X");
                    }
                    handleCameraResize(camera) {
                        this._container.setPosition(camera.scrollX + camera.width - this._container.width - 20, camera.scrollY + 20);
                    }
                }
                HUD.CharProgressBar = CharProgressBar;
            })(HUD = Normal.HUD || (Normal.HUD = {}));
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Normal;
        (function (Normal) {
            var HUD;
            (function (HUD) {
                class BattleButton {
                    constructor(depth) {
                        BattleButton._instance = this;
                        let scene = HUD.HUD.instance.camera.scene;
                        this._events = new Phaser.Events.EventEmitter();
                        this._events.on("btn_click", this.handleBtnClick, this);
                        this._button = new Controls.Buttons.BasicButton(scene, 0, 845, "atlas_0", "hud/btnBattle_")
                            .setDepth(depth)
                            .setEventEmitter(this._events);
                    }
                    static get instance() { return BattleButton._instance; }
                    get events() { return this._events; }
                    get state() { return this._button.state; }
                    show() {
                        this._button.setEnabled(true)
                            .setVisible(true);
                        HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                        this.handleCameraResize(HUD.HUD.instance.camera);
                    }
                    hide() {
                        if (this._button && this._button.visible) {
                            this._button.visible = false;
                            HUD.HUD.instance.camera.off("cam_resize", this.handleCameraResize, this);
                        }
                    }
                    handleBtnClick() {
                        Game.Global.game.sound.playAudioSprite("sfx", "click");
                        this._button.enabled = false;
                        this._events.emit(BattleButton.EVENT_CLICK);
                    }
                    handleCameraResize(camera) {
                        this._button.x = camera.scrollX + camera.width - this._button.width + 8;
                    }
                }
                BattleButton.EVENT_CLICK = "battleBtn_click";
                HUD.BattleButton = BattleButton;
            })(HUD = Normal.HUD || (Normal.HUD = {}));
        })(Normal = Gameplay.Normal || (Gameplay.Normal = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            class Settings {
                constructor(data) {
                    this._fogLevel = 0;
                    this._battleLen = 1;
                    this._bonusFreq = [1, 1];
                    let serialized = null;
                    if (data) {
                        try {
                            serialized = JSON.parse(data);
                            if (serialized) {
                                if (serialized.fog != undefined)
                                    this._fogLevel = serialized.fog;
                                if (serialized.battleLen != undefined)
                                    this._battleLen = serialized.battleLen;
                                if (serialized.bonusFreq) {
                                    if (serialized.bonusFreq[0] != undefined)
                                        this._bonusFreq[0] = serialized.bonusFreq[0];
                                    if (serialized.bonusFreq[1] != undefined)
                                        this._bonusFreq[1] = serialized.bonusFreq[1];
                                }
                            }
                        }
                        catch (e) {
                            serialized = null;
                        }
                    }
                }
                get fogLevel() { return this._fogLevel; }
                get battleLen() { return Settings.BATTLE_LEN[this._battleLen]; }
                get bonusFreq() { return this._bonusFreq; }
                getSerializedData() {
                    let data = {
                        fog: this._fogLevel,
                        battleLen: this._battleLen,
                        bonusFreq: this._bonusFreq
                    };
                    return JSON.stringify(data);
                }
            }
            Settings.BATTLE_LEN = [30, 40, 50, 60];
            Battle.Settings = Settings;
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            class Manager extends Gameplay.Manager {
                constructor(social) {
                    super();
                    Manager.AI_BOTS = [
                        { name: "HARUTO", avatar: new Gameplay.Social.Avatar(null, "atlas_0", "aiAvatars/0"), reqHitsPerSec: 0, reqLifeLen: 0, },
                        { name: "ASAHI", avatar: new Gameplay.Social.Avatar(null, "atlas_0", "aiAvatars/1"), reqHitsPerSec: 4, reqLifeLen: 0.5, },
                        { name: "RIKU", avatar: new Gameplay.Social.Avatar(null, "atlas_0", "aiAvatars/2"), reqHitsPerSec: 4.75, reqLifeLen: 0.75 },
                        { name: "KAITO", avatar: new Gameplay.Social.Avatar(null, "atlas_0", "aiAvatars/3"), reqHitsPerSec: 5.25, reqLifeLen: 0.95 }
                    ];
                    this._settings = new Battle.Settings(Gamee2.Gamee.initialized ? Gamee2.Gamee.initData.initData : null);
                    this._social = social;
                    this._opInitScreen = new Battle.OpInitScreen();
                    this._opGetNew = false;
                    this._opUseNew = true;
                    this._opUID = social.opponent != null ? social.opponent.uid : -1;
                    this._opRemAttempts = 3;
                    let scene = Gameplay.MainScene.instance;
                    let cam = scene.cameras.main;
                    cam.setName("pl2").setSize(cam.width, Game.Global.CAMERA_HEIGHT - Manager.PL1_VIEW_H)
                        .setScroll(0, Game.Global.CAMERA_HEIGHT - cam.height - 110);
                    scene.cameras.add(0, Game.Global.CAMERA_HEIGHT - Manager.PL1_VIEW_H, cam.width, Manager.PL1_VIEW_H, false, "pl1")
                        .setScroll(0, Game.Global.CAMERA_HEIGHT - Manager.PL1_VIEW_H);
                    scene.cameras.add(0, 0, cam.width, Game.Global.CAMERA_HEIGHT, true, "hud");
                    this._bg = new Battle.Background();
                    this._trunkGenerator = new Gameplay.Trunk.TrunkGenerator([
                        new Gameplay.Modifiers.BlockModifier(0, 0, 20, 40),
                        new Gameplay.Modifiers.BlockModifier(0, 1, 10, 40),
                        new Gameplay.Modifiers.ResistBlockPriority(0, 1, 10),
                        new Gameplay.Modifiers.BranchSide(40, 0.25),
                        new Gameplay.Modifiers.BranchSide(60, 0.33),
                        new Gameplay.Modifiers.BranchSide(80, 0.4),
                        new Gameplay.Modifiers.BranchSide(100, 0.5),
                        new Gameplay.Modifiers.BranchSide(120, 0.6),
                        new Gameplay.Modifiers.BranchSide(200, 0.75),
                    ]);
                    this._bonusGenerator = new Gameplay.Bonuses.Falling.Generator(this._settings.battleLen, this._settings.battleLen, this._settings.bonusFreq);
                    this._controllers = [
                        new Gameplay.Player.Controllers.HumanBattle(Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.RIGHT),
                        new Gameplay.Player.Controllers.AI(),
                        new Gameplay.Player.Controllers.Ghost()
                    ];
                    let plChar = new Gameplay.Player.Character(8, 98, 1, 80, [0, -1, -11, -10], [0, 1, 0, 0], [], [], false, 37, 0, 1, 0, [], []);
                    this._plGroups = [
                        new Gameplay.PlayerGroup(0, scene.cameras.getCamera("pl1"), 100, 1, this._trunkGenerator, this._bonusGenerator),
                        new Gameplay.PlayerGroup(1, scene.cameras.getCamera("pl2"), 100, 1, this._trunkGenerator, this._bonusGenerator)
                    ];
                    this._plGroups[0].player.setCharacter(plChar);
                    this._plGroups[0].player.setBelt(0);
                    this._plGroups[0].controller = this._controllers[0];
                    this._plGroups[0].events.on(Gameplay.Player.Player.EVENT_DEATH, () => { this.gameOver(); }, this);
                    this._plGroups[1].player.setCharacter(plChar);
                    this._plGroups[1].player.setBelt(0);
                    this._hud = new Battle.HUD.HUD();
                    this._hud.plPanel.setPlayer(social.player.name, social.player.avatar);
                    this._resultScreen = new Battle.ResultScreen();
                    scene.events.on(Battle.HUD.Timer.EVENT_TIMES_OUT, () => {
                        this._state = 2;
                        this.gameOver();
                    }, this);
                    Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResChange, this);
                    if (Gamee2.Gamee.initialized) {
                        this._state = 5;
                        Gamee2.Gamee.events.on("start", this.handleGameeStart, this);
                    }
                    else {
                        this._state = 4;
                    }
                }
                get aiBot() { return this._aiBot; }
                get settings() { return this._settings; }
                get social() { return this._social; }
                get state() { return this._state; }
                get playerGroups() { return this._plGroups; }
                isPlaying() {
                    return this._state == 0;
                }
                reset(resetScene) {
                    super.reset(resetScene);
                    if (this._opGetNew) {
                        this.setGameplayElementsVisibility(false);
                        this._resultScreen.reset();
                        this._state = 3;
                        this._opInitScreen.start(() => {
                            let op = this._social.opponent;
                            this._opGetNew = false;
                            if ((this._opUseNew = (op == null || op.uid != this._opUID)))
                                this._opUID = op != null ? op.uid : -1;
                            this._opRemAttempts = 3;
                            this.reset2();
                        }, this);
                        return;
                    }
                    else {
                        this.reset2();
                    }
                }
                reset2() {
                    this.setGameplayElementsVisibility(true);
                    if (this._opUseNew) {
                        this._opUseNew = false;
                        let socOp = this._social.opponent;
                        let ctrl;
                        if (socOp) {
                            ctrl = this._controllers[2];
                            ctrl.commands.load(socOp.saveState.commands);
                            this._hud.opPanel.setPlayer(socOp.name, socOp.avatar);
                            this._aiBot = null;
                        }
                        else {
                            let plSaveState = this._social.player.saveState;
                            let minLifeLen = Math.max(10, Math.min(plSaveState.gameLen, this._settings.battleLen));
                            let hitsPerSec = Math.max(3, plSaveState.gameLen != 0 ? plSaveState.hits / plSaveState.gameLen : 3);
                            ctrl = this._controllers[1];
                            ctrl.init(minLifeLen, hitsPerSec);
                            minLifeLen /= this._settings.battleLen;
                            for (let botId = Manager.AI_BOTS.length - 1; botId >= 0; botId--) {
                                let bot = Manager.AI_BOTS[botId];
                                if (bot.reqHitsPerSec <= hitsPerSec && bot.reqLifeLen <= minLifeLen) {
                                    this._aiBot = bot;
                                    break;
                                }
                            }
                            this._hud.opPanel.setPlayer(this._aiBot.name, this._aiBot.avatar);
                        }
                        this._plGroups[1].controller = ctrl;
                        if (socOp) {
                            this._trunkGenerator.load(socOp.saveState.trunk);
                            this._bonusGenerator.load(socOp.saveState.bonuses);
                        }
                        else {
                            this._trunkGenerator.reset(true);
                            this._bonusGenerator.reset(true);
                        }
                    }
                    else {
                        this._trunkGenerator.reset(false);
                        this._bonusGenerator.reset(false);
                    }
                    this._plGroups[0].reset();
                    this._plGroups[1].reset();
                    this._resultScreen.reset();
                    if (this._state != 5) {
                        this.startCountdown();
                    }
                    else {
                        Manager._timer.pause();
                        Gamee2.Gamee.gameReady();
                    }
                }
                update(delta) {
                    super.update(delta);
                    this._bonusGenerator.update();
                    this._plGroups[0].update();
                    this._plGroups[1].update();
                    this._hud.update();
                }
                startCountdown() {
                    Gameplay.MainScene.instance.events.once(Battle.HUD.StartCountdown.EVENT_COMPLETE, () => {
                        this._state = 0;
                        Battle.HUD.Timer.instance.visible = true;
                    }, this);
                    Battle.HUD.Timer.instance.visible = false;
                    this._hud.startCountdown.show();
                    this._state = 1;
                }
                gameOver() {
                    let plScore = this._plGroups[0].score;
                    let opScore;
                    if (this._plGroups[1].controller.type == 1) {
                        if (this._plGroups[1].player.death || Battle.HUD.Timer.instance.timesOut) {
                            opScore = this._plGroups[1].score;
                        }
                        else {
                            opScore = Math.max(this._plGroups[1].score, this._controllers[1].getEstimateScore());
                        }
                        this._opGetNew = true;
                    }
                    else {
                        opScore = this._social.opponent.saveState.score;
                        this._opGetNew = true;
                    }
                    let battleRes = plScore > opScore ? 1 : plScore == opScore ? 0 : -1;
                    this._battleLen = Math.round(this._playTime / 1000);
                    this._hud.showScreenOverlay((overlay, camera) => {
                        overlay.clear();
                        overlay.fillStyle(0xFF0000, 1);
                        overlay.fillRect(camera.scrollX, 398, camera.width, 80);
                    }, this);
                    Battle.HUD.Timer.instance.visible = false;
                    this._hud.slideMsg.show(battleRes > 0 ? "YOU WON" : battleRes < 0 ? "YOU LOST" : "IT'S A DRAW", 410, Manager._timer, (state) => {
                        if (state == SlideMessage.eMessageState.completed) {
                            Battle.HUD.HUD.instance.hideScreenOverlay();
                            this._state = 2;
                            this._resultScreen.show(this._plGroups[0].score, opScore, () => {
                                this.endGame();
                            }, this);
                        }
                    }, this);
                    Game.Global.game.sound.playAudioSprite("sfx", "battle" + (battleRes >= 0 ? "Won" : "Lost"));
                }
                endGame() {
                    this._state = 4;
                    let saveState = this._social.player.saveState;
                    if (saveState.score < this._plGroups[0].score) {
                        saveState.score = this._plGroups[0].score;
                        saveState.hits = this._plGroups[0].player.hitCnt;
                        saveState.gameLen = Math.max(1, Math.min(this._settings.battleLen, this._battleLen));
                        saveState.trunk = this._trunkGenerator.save();
                        saveState.bonuses = this._bonusGenerator.save();
                        saveState.commands = this._controllers[0].commands.save();
                    }
                    if (Gamee2.Gamee.initialized) {
                        Gamee2.Gamee.gameOver(undefined, saveState.score > 0 ? JSON.stringify(saveState) : undefined);
                    }
                    else {
                        this.reset(true);
                    }
                }
                handleResChange(w, h) {
                    this._plGroups[0].trunk.setPosition(w / 2, Manager.PL1_TRUNK_Y, Manager.PL1_TRUNK_H);
                    this._plGroups[1].trunk.setPosition(w / 2, Manager.PL2_TRUNK_Y, Manager.PL2_TRUNK_H);
                    Gameplay.MainScene.instance.cameras.cameras.forEach((camera) => {
                        camera.width = w;
                        camera.emit("cam_resize", camera);
                    });
                }
                handleGameeStart() {
                    if (this._state != 5) {
                        Gameplay.MainScene.instance.sys.resume();
                        this.reset(true);
                    }
                    else {
                        Manager._timer.resume();
                        this.startCountdown();
                    }
                    Game.Global.game.sound.pauseOnBlur = true;
                }
                setGameplayElementsVisibility(visible) {
                    this._plGroups[0].visible = visible;
                    this._plGroups[1].visible = visible;
                    let hud = this._hud;
                    hud.plPanel.visible = visible;
                    hud.opPanel.visible = visible;
                    hud.timer.visible = visible;
                }
            }
            Manager.PL1_VIEW_H = 560;
            Manager.PL1_TRUNK_Y = 800;
            Manager.PL1_TRUNK_H = 400;
            Manager.PL2_TRUNK_Y = 800;
            Manager.PL2_TRUNK_H = 390;
            Battle.Manager = Manager;
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            class OpInitScreen {
                constructor() {
                    this._msg = Gameplay.MainScene.instance.add.bitmapText(0, 0, "font_0", "", 60)
                        .setDepth(200 + 100 + 10)
                        .setOrigin(0.5)
                        .setVisible(false);
                }
                reset() {
                    if (this._msg.visible) {
                        Battle.HUD.HUD.instance.hideScreenOverlay();
                        this._msg.visible = false;
                        Battle.HUD.HUD.instance.camera.off("cam_resize", this.handleCameraResize, this);
                        Gameplay.MainScene.instance.events.off(Battle.Social.Manager.EVENT_INIT_COMPLETE, undefined, this);
                    }
                }
                start(cbFnc, cbCtx) {
                    this._cbFnc = cbFnc;
                    this._cbCtx = cbCtx;
                    this._compPartsMask = 3;
                    Battle.HUD.HUD.instance.showScreenOverlay((overlay, camera) => {
                        overlay.clear();
                        overlay.fillStyle(0xFF0000, 1);
                        overlay.fillRect(camera.scrollX, 398, camera.width, 80);
                    }, this);
                    this._msg.setText("GET READY")
                        .setVisible(true);
                    this._msg.cameraFilter = ~Battle.HUD.HUD.instance.camera.id;
                    Gameplay.MainScene.instance.time.delayedCall(750, () => { this.handlePartComplete(0); }, undefined, this);
                    Gameplay.MainScene.instance.events.once(Battle.Social.Manager.EVENT_INIT_COMPLETE, () => { this.handlePartComplete(1); }, this);
                    Battle.Manager.instance.social.initOpponent(Gameplay.MainScene.instance);
                    Battle.HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                    this.handleCameraResize(Battle.HUD.HUD.instance.camera);
                }
                handlePartComplete(partId) {
                    if ((this._compPartsMask &= ~(1 << partId)) == 0) {
                        let camera = Battle.HUD.HUD.instance.camera;
                        camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                            this.reset();
                            this._cbFnc.call(this._cbCtx);
                            camera.fadeIn(500, 0xFF, 0xFF, 0xFF);
                        }, this);
                        camera.fadeOut(500, 0xFF, 0xFF, 0xFF);
                    }
                }
                handleCameraResize(camera) {
                    this._msg.setPosition(camera.scrollX + camera.width >> 1, 438);
                }
            }
            Battle.OpInitScreen = OpInitScreen;
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            class ResultScreen {
                constructor() {
                    let depth = 200 + 100 + 10;
                    let scene = Gameplay.MainScene.instance;
                    this._beamFxImg = scene.add.image(0, 0, "atlas_0", "fx/lightBeams")
                        .setScale(2)
                        .setDepth(depth)
                        .setVisible(false);
                    this._beamFxImg.cameraFilter = ~Battle.HUD.HUD.instance.camera.id;
                    this._beamFxTween = scene.tweens.add({
                        paused: true,
                        targets: this._beamFxImg,
                        duration: 4000,
                        loop: -1,
                        angle: 360,
                    });
                    this._pl1Panel = new Battle.HUD.PlayerResultPanel(depth);
                    this._pl2Panel = new Battle.HUD.PlayerResultPanel(depth);
                    this._beamFxImg.y = ResultScreen.PANEL_Y + this._pl1Panel.height / 2;
                    this._timeEvent = null;
                }
                reset() {
                    if (this._pl1Panel.visible) {
                        this._pl1Panel.visible = false;
                        this._pl2Panel.visible = false;
                        this._beamFxImg.visible = false;
                        this._beamFxTween.stop();
                        if (this._timeEvent) {
                            this._timeEvent.remove(false);
                            this._timeEvent = null;
                        }
                        Gameplay.MainScene.instance.cameras.main.off("cam_resize", this.handleCameraResize, this);
                        Gameplay.MainScene.instance.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                    }
                }
                show(plScore, opScore, cbFnc, cbCtx) {
                    this._cbFnc = cbFnc;
                    this._cbCtx = cbCtx;
                    let social = Battle.Manager.instance.social;
                    this._battleRes = plScore > opScore ? 1 : plScore < opScore ? -1 : 0;
                    this._pl1Panel.setResult(social.player.name, social.player.avatar, plScore, this._battleRes > 0);
                    let opName;
                    let opAvatar;
                    if (social.opponent) {
                        opName = social.opponent.name;
                        opAvatar = social.opponent.avatar;
                    }
                    else {
                        let aiBot = Battle.Manager.instance.aiBot;
                        opName = aiBot.name;
                        opAvatar = aiBot.avatar;
                    }
                    this._pl2Panel.setResult(opName, opAvatar, opScore, this._battleRes < 0);
                    let camera = Gameplay.MainScene.instance.cameras.main;
                    camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                        let mng = Battle.Manager.instance;
                        mng.setGameplayElementsVisibility(false);
                        mng.playerGroups[0].fallingBonuses.reset();
                        mng.playerGroups[1].fallingBonuses.reset();
                        this._pl1Panel.visible = true;
                        this._pl2Panel.visible = true;
                        if (this._battleRes != 0) {
                            this._beamFxImg.visible = true;
                            Helpers.Tweens.playTween(this._beamFxTween);
                        }
                        this._timeEvent = Gameplay.MainScene.instance.time.delayedCall(3000, () => {
                            this._timeEvent = null;
                            this._cbFnc.call(this._cbCtx);
                        }, undefined, this);
                        camera.fadeIn(500, 0xFF, 0xFF, 0xFF);
                        camera.on("cam_resize", this.handleCameraResize, this);
                        this.handleCameraResize(camera);
                        Gameplay.MainScene.instance.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                    }, this);
                    camera.fadeOut(500, 0xFF, 0xFF, 0xFF);
                }
                handlePointerDown() {
                    this._timeEvent.remove(true);
                }
                handleCameraResize(camera) {
                    let panelW = this._pl1Panel.width;
                    let cameraHW = camera.width / 2;
                    let panel1X = (cameraHW - panelW) / 2;
                    let panel2X = cameraHW + panel1X;
                    let maxSpacing = 100;
                    if (panel2X - panel1X - panelW > maxSpacing) {
                        panel1X = cameraHW - (maxSpacing / 2) - panelW;
                        panel2X = cameraHW + (maxSpacing / 2);
                    }
                    this._pl1Panel.setPosition(camera.scrollX + panel1X, ResultScreen.PANEL_Y);
                    this._pl2Panel.setPosition(camera.scrollX + panel2X, ResultScreen.PANEL_Y);
                    if (this._beamFxImg.visible)
                        this._beamFxImg.x = (this._battleRes > 0 ? panel1X : panel2X) + camera.scrollX + panelW / 2;
                }
            }
            ResultScreen.PANEL_Y = 300;
            Battle.ResultScreen = ResultScreen;
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            class Background extends Gameplay.Background.Background {
                constructor() {
                    let cameras = [Gameplay.MainScene.instance.cameras.getCamera("pl1"), Gameplay.MainScene.instance.cameras.getCamera("pl2")];
                    super(0, cameras);
                    let camFilter = ~cameras[0].id;
                    this._dayTime1 = new Gameplay.DayTime(Battle.Manager.timer);
                    this._dayTime1.objects.add(new Gameplay.Background.Sky(0, camFilter, 0, "sky_", 747));
                    this._dayTime1.objects.add(new Gameplay.Background.Planet(1, camFilter, 0.10, 0.85, "sun"));
                    this._dayTime1.objects.add(new Gameplay.Background.Planet(1, camFilter, 0.70, 0.30, "moon"));
                    this._dayTime1.objects.add(new Gameplay.Background.Temple(3, camFilter));
                    this._dayTime1.objects.add(new Gameplay.Background.Fireflies(4, camFilter, Battle.Manager.timer));
                    camFilter = ~cameras[1].id;
                    this._dayTime2 = new Gameplay.DayTime(Battle.Manager.timer);
                    this._dayTime2.objects.add(new Gameplay.Background.Sky(0, camFilter, 0, "sky_", 747));
                    this._dayTime2.objects.add(new Gameplay.Background.Planet(1, camFilter, 0.10, 0.85, "sun"));
                    this._dayTime2.objects.add(new Gameplay.Background.Planet(1, camFilter, 0.70, 0.30, "moon"));
                    this._dayTime2.objects.add(new Gameplay.Background.Temple(3, camFilter));
                    this._dayTime2.objects.add(new Gameplay.Background.Fireflies(4, camFilter, Battle.Manager.timer));
                    let fogLevel = Battle.Manager.instance.settings.fogLevel;
                    if (fogLevel != 0)
                        new Gameplay.Background.Fog(200 - 1, this._cameraFilter, fogLevel);
                }
                reset() {
                    super.reset();
                    this._dayTime1.reset();
                    this._dayTime2.reset((this._dayTime1.startDayTime + Phaser.Math.RND.integerInRange(Math.round(Gameplay.DayTime.DAY_LENGTH * 0.25), Math.round(Gameplay.DayTime.DAY_LENGTH * 0.75))) % Gameplay.DayTime.DAY_LENGTH);
                }
                update() {
                    this._dayTime1.update();
                    this._dayTime2.update();
                }
            }
            Battle.Background = Background;
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            var HUD;
            (function (HUD_3) {
                class HUD extends Gameplay.HUD.HUD {
                    constructor() {
                        let scene = Gameplay.MainScene.instance;
                        super(scene.cameras.getCamera("hud"), 200);
                        this._splitScreenLine = scene.add.tileSprite(0, Game.Global.CAMERA_HEIGHT - Battle.Manager.PL1_VIEW_H, this._camera.width, 4, "atlas_0", "hud/splitScreenLine")
                            .setOrigin(0, 0.5);
                        this._splitScreenLine.cameraFilter = ~this._camera.id;
                        this._startCountdown = new HUD_3.StartCountdown(200 + 100 + 10);
                        this._timer = new HUD_3.Timer(200);
                        let manager = Battle.Manager.instance;
                        this._pl1Panel = new HUD_3.PlayerPanel(200, manager.playerGroups[0], manager.playerGroups[1]);
                        this._pl2Panel = new HUD_3.PlayerPanel(200, manager.playerGroups[1], manager.playerGroups[0]);
                    }
                    get startCountdown() { return this._startCountdown; }
                    get timer() { return this._timer; }
                    get plPanel() { return this._pl1Panel; }
                    get opPanel() { return this._pl2Panel; }
                    reset() {
                        super.reset();
                        this._startCountdown.reset();
                        this._timer.reset(Battle.Manager.instance.settings.battleLen);
                        this._pl1Panel.reset();
                        this._pl2Panel.reset();
                    }
                    update() {
                        super.update();
                        this._timer.update();
                        this._pl1Panel.update();
                        this._pl2Panel.update();
                    }
                    handleCameraResize(camera) {
                        super.handleCameraResize(camera);
                        this._splitScreenLine.width = camera.width;
                    }
                }
                HUD_3.HUD = HUD;
            })(HUD = Battle.HUD || (Battle.HUD = {}));
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            var HUD;
            (function (HUD) {
                class Timer {
                    constructor(depth) {
                        Timer._instance = this;
                        let scene = Gameplay.MainScene.instance;
                        this._container = new Controls.Group.Group(true)
                            .setDepth(depth)
                            .setCameraFilter(~HUD.HUD.instance.camera.id);
                        let icon = scene.add.image(0, 0, "atlas_0", "hud/energyBarIcon")
                            .setOrigin(0);
                        this._container.add(icon);
                        this._container.setCustomSize(icon.width, icon.height + 10);
                        this._time = scene.add.bitmapText(0, 0, "font_1", "", 50)
                            .setOrigin(0.5, 0);
                        this._timeContainerItem = this._container.add(this._time, 0, 0, 4 | 2, false);
                        this._timeVal = -1;
                        HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                    }
                    static get instance() { return Timer._instance; }
                    get timesOut() { return this._timeVal == 0; }
                    get visible() { return this._container.visible; }
                    set visible(visible) { this._container.visible = visible; }
                    reset(totalTime) {
                        this._timeVal = this._totalTime = totalTime;
                        this.updateTime();
                        this._time.clearTint();
                        this._timeContainerItem.setVisible(true);
                    }
                    update() {
                        if (this._timeVal <= 0)
                            return;
                        let battleTime = Battle.Manager.instance.playTime;
                        let time = this._totalTime - Math.floor(battleTime / 1000);
                        if (time <= 0) {
                            time = 0;
                            Gameplay.MainScene.instance.events.emit(Timer.EVENT_TIMES_OUT);
                        }
                        if (time != this._timeVal) {
                            if (time <= 5) {
                                if (this._timeVal > 5)
                                    this._time.setTint(0xFF0000);
                                Game.Global.game.sound.playAudioSprite("sfx", "lowTime");
                            }
                            this._timeVal = time;
                            this.updateTime();
                        }
                        if (this._timeVal <= 5)
                            this._timeContainerItem.visible = (Math.floor(battleTime / 250) & 1) == 0 || !Battle.Manager.instance.isPlaying;
                    }
                    updateTime() {
                        this._time.setText((this._timeVal >= 10 ? "0:" : "0:0") + this._timeVal);
                    }
                    handleCameraResize(camera) {
                        this._container.x = camera.scrollX + ((camera.width - this._container.width) >> 1);
                        this._container.y = Game.Global.CAMERA_HEIGHT - Battle.Manager.PL1_VIEW_H - 24;
                    }
                }
                Timer.EVENT_TIMES_OUT = "timer_timesOut";
                HUD.Timer = Timer;
            })(HUD = Battle.HUD || (Battle.HUD = {}));
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            var HUD;
            (function (HUD) {
                class PlayerPanel {
                    constructor(depth, plGroup, opGroup) {
                        this._plGroup = plGroup;
                        this._opGroup = opGroup;
                        let scene = Gameplay.MainScene.instance;
                        this._container = new Controls.Group.Group(true)
                            .setDepth(depth)
                            .setCameraFilter(~HUD.HUD.instance.camera.id);
                        this._container.y = 16;
                        this._avatar = scene.add.image(0, 0, "atlas_0", PlayerPanel.DEF_AVATAR_FRAME_KEY);
                        this._container.add(this._avatar, PlayerPanel.AVATAR_X, PlayerPanel.AVATAR_Y);
                        this._bg1 = scene.add.image(0, 0, "atlas_0", "hud/battle/plPanel1")
                            .setOrigin(0, 0);
                        this._container.add(this._bg1);
                        this._bg2 = this._container.add(scene.add.image(0, 0, "atlas_0", "hud/battle/plPanel2")
                            .setOrigin(0, 0));
                        this._container.setCustomSize(this._bg1.width, this._bg1.height);
                        this._name = scene.add.bitmapText(0, 0, "font_0", "", 20)
                            .setOrigin(0);
                        this._container.add(this._name, PlayerPanel.NAME_X, PlayerPanel.NAME_Y);
                        this._score = scene.add.bitmapText(0, 0, "font_1", "", 40)
                            .setOrigin(0);
                        this._container.add(this._score, PlayerPanel.SCORE_X, PlayerPanel.SCORE_Y);
                        if (plGroup.id != 0) {
                            let w = this._container.width;
                            this._bg1.flipX = true;
                            this._bg2.content.flipX = true;
                            this._container.getItem(this._avatar).setOffsetX(w - PlayerPanel.AVATAR_X);
                            this._name.setOrigin(1, 0);
                            this._container.getItem(this._name).setOffsetX(w - PlayerPanel.NAME_X);
                            this._score.setOrigin(1, 0);
                            this._container.getItem(this._score).setOffsetX(w - PlayerPanel.SCORE_X);
                        }
                        plGroup.events.on(Gameplay.PlayerGroup.EVENT_SCORE_CHANGE, (group, score) => {
                            this._score.text = score.toString();
                            this.updateBgColor();
                        }, this);
                        opGroup.events.on(Gameplay.PlayerGroup.EVENT_SCORE_CHANGE, () => {
                            this.updateBgColor();
                        }, this);
                        HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                    }
                    get visible() { return this._container.visible; }
                    set visible(visible) { this._container.visible = visible; }
                    reset() {
                        this._score.text = "0";
                        this._bg2.alpha = 0;
                        this._bg2TarAlpha = 0;
                    }
                    setPlayer(name, avatar) {
                        let avatarTexKey = "atlas_0";
                        let avatarFrame = PlayerPanel.DEF_AVATAR_FRAME_KEY;
                        if (avatar.loaded) {
                            avatarTexKey = avatar.textureKey;
                            avatarFrame = avatar.textureFrame;
                        }
                        this._avatar.setTexture(avatarTexKey, avatarFrame)
                            .setDisplaySize(PlayerPanel.AVATAR_SIZE, PlayerPanel.AVATAR_SIZE);
                        this._name.setText(name);
                    }
                    update() {
                        if (this._bg2.alpha != this._bg2TarAlpha) {
                            let alpha = this._bg2.alpha;
                            if (this._bg2TarAlpha > alpha) {
                                if ((alpha += 0.01) > this._bg2TarAlpha)
                                    alpha = this._bg2TarAlpha;
                            }
                            else if ((alpha -= 0.01) < this._bg2TarAlpha) {
                                alpha = this._bg2TarAlpha;
                            }
                            this._bg2.alpha = alpha;
                        }
                    }
                    updateBgColor() {
                        let scoreDif = this._plGroup.score - this._opGroup.score;
                        if (scoreDif <= 0) {
                            this._bg2TarAlpha = 0;
                        }
                        else {
                            this._bg2TarAlpha = Math.min(1, scoreDif / 100);
                        }
                    }
                    handleCameraResize(camera) {
                        if (this._plGroup.id == 0) {
                            this._container.x = camera.scrollX;
                        }
                        else {
                            this._container.x = camera.scrollX + camera.width - this._container.width;
                        }
                    }
                }
                PlayerPanel.DEF_AVATAR_FRAME_KEY = "aiAvatars/0";
                PlayerPanel.AVATAR_X = 50;
                PlayerPanel.AVATAR_Y = 38;
                PlayerPanel.AVATAR_SIZE = 70;
                PlayerPanel.NAME_X = 94;
                PlayerPanel.NAME_Y = 10;
                PlayerPanel.SCORE_X = 94;
                PlayerPanel.SCORE_Y = 35;
                HUD.PlayerPanel = PlayerPanel;
            })(HUD = Battle.HUD || (Battle.HUD = {}));
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            var HUD;
            (function (HUD) {
                class StartCountdown {
                    constructor(depth) {
                        let scene = HUD.HUD.instance.camera.scene;
                        this._msgText = scene.add.bitmapText(0, 0, "font_0", "", 60)
                            .setDepth(depth)
                            .setOrigin(0.5)
                            .setVisible(false);
                        this._msgText.cameraFilter = ~HUD.HUD.instance.camera.id;
                        this._msgTween = scene.tweens.add({
                            paused: true,
                            targets: this._msgText,
                            loop: 3,
                            duration: 1000,
                            onLoop: () => {
                                this._msgText.setText(StartCountdown.MESSAGE[++this._pos])
                                    .setScale(1)
                                    .setAlpha(1)
                                    .setOrigin(0.5);
                                Game.Global.game.sound.playAudioSprite("sfx", "countdown" + (this._pos < 3 ? "Beep" : "Go"));
                            },
                            onComplete: () => {
                                Gameplay.MainScene.instance.events.emit(StartCountdown.EVENT_COMPLETE);
                                this.reset();
                            },
                            ease: Phaser.Math.Easing.Cubic.Out,
                            scaleX: 2.5,
                            scaleY: 2.5,
                            alpha: { value: 0, ease: Phaser.Math.Easing.Cubic.In }
                        });
                        this._active = false;
                    }
                    reset() {
                        if (this._active) {
                            this._active = false;
                            HUD.HUD.instance.hideScreenOverlay();
                            this._msgText.visible = false;
                            this._msgTween.stop();
                            HUD.HUD.instance.camera.off("cam_resize", this.handleCameraResize, this);
                        }
                    }
                    show() {
                        this.reset();
                        HUD.HUD.instance.showScreenOverlay((overlay, camera) => {
                            overlay.clear();
                            overlay.fillStyle(0xFF0000, 1);
                            overlay.fillRect(camera.scrollX, 398, camera.width, 80);
                        }, this);
                        this._active = true;
                        this._pos = 0;
                        this._msgText.setText(StartCountdown.MESSAGE[0])
                            .setScale(1)
                            .setAlpha(1)
                            .setOrigin(0.5)
                            .setVisible(true);
                        HUD.HUD.instance.camera.scene.time.delayedCall(50, () => {
                            Helpers.Tweens.playTween(this._msgTween);
                            Game.Global.game.sound.playAudioSprite("sfx", "countdownBeep");
                        }, undefined, this);
                        HUD.HUD.instance.camera.on("cam_resize", this.handleCameraResize, this);
                        this.handleCameraResize(HUD.HUD.instance.camera);
                    }
                    handleCameraResize(camera) {
                        this._msgText.setPosition(camera.scrollX + camera.width >> 1, 438);
                    }
                }
                StartCountdown.EVENT_COMPLETE = "countdown_complete";
                StartCountdown.MESSAGE = ["3", "2", "1", "GO!"];
                HUD.StartCountdown = StartCountdown;
            })(HUD = Battle.HUD || (Battle.HUD = {}));
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            var HUD;
            (function (HUD) {
                class PlayerResultPanel {
                    constructor(depth) {
                        let scene = Gameplay.MainScene.instance;
                        this._container = new Controls.Group.Group()
                            .setDepth(depth)
                            .setVisible(false)
                            .setCameraFilter(~HUD.HUD.instance.camera.id);
                        this._avatar = scene.add.image(0, 0, "atlas_0", HUD.PlayerPanel.DEF_AVATAR_FRAME_KEY)
                            .setDisplaySize(PlayerResultPanel.AVATAR_SIZE, PlayerResultPanel.AVATAR_SIZE);
                        this._container.add(this._avatar, PlayerResultPanel.AVATAR_X, PlayerResultPanel.AVATAR_Y, 0, false);
                        this._bg = scene.add.image(0, 0, "atlas_0", "hud/battle/resPanel_0")
                            .setOrigin(0);
                        this._container.add(this._bg);
                        this._score = scene.add.bitmapText(0, 0, "font_1", "", 40)
                            .setOrigin(0.5, 0);
                        this._container.add(this._score, 0, 228, 4, false);
                        this._name = scene.add.bitmapText(0, 0, "font_0", "", 30)
                            .setOrigin(0.5, 0);
                        this._container.add(this._name, 0, 20, 4, false);
                    }
                    get visible() { return this._container.visible; }
                    set visible(visible) { this._container.visible = visible; }
                    get width() { return this._container.width; }
                    get height() { return this._container.height; }
                    get x() { return this._container.x; }
                    get y() { return this._container.y; }
                    setResult(name, avatar, score, winner) {
                        let avatarTexKey = "atlas_0";
                        let avatarFrame = HUD.PlayerPanel.DEF_AVATAR_FRAME_KEY;
                        if (avatar.loaded) {
                            avatarTexKey = avatar.textureKey;
                            avatarFrame = avatar.textureFrame;
                        }
                        this._avatar.setTexture(avatarTexKey, avatarFrame)
                            .setDisplaySize(PlayerResultPanel.AVATAR_SIZE, PlayerResultPanel.AVATAR_SIZE);
                        this._name.setText(name);
                        this._score.setText(score.toString());
                        this._bg.setFrame("hud/battle/resPanel_" + (winner ? +0 : 1));
                    }
                    setPosition(x, y) {
                        this._container.setPosition(x, y);
                    }
                }
                PlayerResultPanel.AVATAR_X = 106;
                PlayerResultPanel.AVATAR_Y = 144;
                PlayerResultPanel.AVATAR_SIZE = 136;
                HUD.PlayerResultPanel = PlayerResultPanel;
            })(HUD = Battle.HUD || (Battle.HUD = {}));
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            var HUD;
            (function (HUD) {
                class Reactions {
                    constructor(depth) {
                        let scene = Gameplay.MainScene.instance;
                        this._events = new Phaser.Events.EventEmitter();
                        this._events.on("btn_click", (button) => {
                            Game.Global.game.sound.playAudioSprite("sfx", "click");
                            this._events.emit(Reactions.EVENT_REACTION_SELECTED, button.id);
                        }, this);
                        this._container = new Controls.Group.Group()
                            .setDepth(depth)
                            .setCameraFilter(~HUD.HUD.instance.camera.id);
                        this._container.add(scene.add.image(0, 0, "atlas_0", "reactions/panel").setOrigin(0).setAlpha(0.25));
                        let lineH = (this._container.height - (2 * Reactions._PANEL_MARGIN)) / Reactions._ITEMS.length;
                        this._items = [];
                        let y = Reactions._PANEL_MARGIN + lineH / 2;
                        Reactions._ITEMS.forEach((line) => {
                            let w = 0;
                            let items = [];
                            line.forEach((id) => {
                                let item = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "reactions/react_" + id + "_");
                                item.events = this._events;
                                item.image.setOrigin(0.5);
                                item.id = id;
                                w += item.width;
                                items.push(item);
                            }, this);
                            let itemSpacing = (this._container.width - (Reactions._PANEL_MARGIN * 2) - w) / (line.length - 1);
                            let x = Reactions._PANEL_MARGIN;
                            items.forEach((item, i) => {
                                this._container.add(item, x + (item.width / 2), y, 0, false);
                                x += item.width + itemSpacing;
                            }, this);
                            this._items.concat(items);
                            y += lineH;
                        }, this);
                        this._enabled = true;
                    }
                    get visible() { return this._container.visible; }
                    set visible(visible) { this._container.visible = visible; }
                    get width() { return this._container.width; }
                    get height() { return this._container.height; }
                    get events() { return this._events; }
                    get enabled() { return this._enabled; }
                    set enabled(enabled) {
                        if (enabled != this._enabled) {
                            this._enabled = enabled;
                            this._items.forEach((item) => {
                                item.enabled = enabled;
                            });
                        }
                    }
                    setPosition(x, y) {
                        this._container.setPosition(x, y);
                    }
                }
                Reactions.EVENT_REACTION_SELECTED = "reactions_reactSel";
                Reactions._PANEL_MARGIN = 14;
                Reactions._ITEMS = [[0, 1, 2, 3], [4, 5, 6, 7]];
                HUD.Reactions = Reactions;
            })(HUD = Battle.HUD || (Battle.HUD = {}));
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            var Social;
            (function (Social) {
                class Manager {
                    constructor() {
                        this._opponent = null;
                        this._allowSocialRequest = false;
                    }
                    get player() { return this._player; }
                    get opponent() { return this._opponent; }
                    init(scene) {
                        this._scene = scene;
                        if (!Gamee2.Gamee.initialized) {
                            this.createPlayer();
                            this.handleLoadAvatarsComplete();
                        }
                        else {
                            this.checkBattleUserCnt(() => {
                                if (this._allowSocialRequest) {
                                    this.initOpponent(scene);
                                }
                                else {
                                    Gamee2.Gamee.requestPlayerData((player) => {
                                        this.createPlayer(player);
                                        this.loadAvatars();
                                    }, this);
                                }
                            });
                        }
                    }
                    initOpponent(scene) {
                        this._scene = scene;
                        if (!Gamee2.Gamee.initialized) {
                            this.handleLoadAvatarsComplete();
                        }
                        else {
                            this.checkBattleUserCnt(() => {
                                if (this._allowSocialRequest) {
                                    Gamee2.Gamee.requestSocial((player, friends) => {
                                        if (!this._player)
                                            this.createPlayer(player);
                                        if (friends && friends.length > 0) {
                                            let friend = friends[0];
                                            if (friend) {
                                                let updateSaveState = false;
                                                if (this._opponent) {
                                                    if (this._opponent.uid == friend.userID) {
                                                        if (this._opponent.saveState.score != friend.highScore)
                                                            updateSaveState = true;
                                                    }
                                                    else {
                                                        this.releaseOpponent();
                                                    }
                                                }
                                                if (!this._opponent) {
                                                    this._opponent = new Social.Player(friend.userID, friend.firstName, friend.avatar);
                                                    updateSaveState = true;
                                                }
                                                if (updateSaveState) {
                                                    Gamee2.Gamee.requestPlayerSaveData((data) => {
                                                        if (!this._opponent.parseSaveState(data))
                                                            this.releaseOpponent();
                                                        this.loadAvatars();
                                                    }, this, friend.userID);
                                                    return;
                                                }
                                            }
                                        }
                                        else {
                                            this.releaseOpponent();
                                        }
                                        this.loadAvatars();
                                    }, this);
                                }
                                else {
                                    this.releaseOpponent();
                                    this.handleLoadAvatarsComplete();
                                }
                            });
                        }
                    }
                    checkBattleUserCnt(cb) {
                        if (Gamee2.Gamee.initialized) {
                            if (!this._allowSocialRequest) {
                                let platform = Gamee2.Gamee.initData.platform;
                                if (platform == "android" || platform == "ios") {
                                    Gamee2.Gamee.requestBattleData((battleData) => {
                                        this._allowSocialRequest = (battleData && battleData.usersCount > 1);
                                        cb.call(this);
                                    }, this);
                                    return;
                                }
                            }
                        }
                        cb.call(this);
                    }
                    createPlayer(data) {
                        if (data && data.userID != undefined) {
                            this._player = new Social.Player(data.userID, data.firstName != undefined ? data.firstName : data.name != undefined ? data.name : "PLAYER", data.avatar);
                            let saveState = Gamee2.Gamee.initData.saveState;
                            if (saveState)
                                this._player.parseSaveState(saveState);
                        }
                        else {
                            this._player = new Social.Player(0, "PLAYER 1", null);
                        }
                    }
                    releaseOpponent() {
                        if (this._opponent) {
                            this._opponent.release();
                            this._opponent = null;
                        }
                    }
                    addAvatarToLoader(player) {
                        let url = player.avatar.url;
                        if (url) {
                            let texKey = player.avatar.textureKey;
                            if (url.slice(0, 10) == "data:image") {
                                Game.Global.game.textures.addBase64(texKey, url);
                            }
                            else {
                                this._scene.load.image(texKey, url);
                            }
                        }
                    }
                    loadAvatars() {
                        let loader = this._scene.load;
                        loader.reset();
                        loader.crossOrigin = "anonymous";
                        if (this._player && !this._player.avatar.loaded) {
                            this.addAvatarToLoader(this._player);
                        }
                        if (this._opponent && !this._opponent.avatar.loaded) {
                            this.addAvatarToLoader(this._opponent);
                        }
                        loader.once(Phaser.Loader.Events.COMPLETE, this.handleLoadAvatarsComplete, this);
                        loader.start();
                    }
                    handleLoadAvatarsComplete() {
                        this._scene.events.emit(Manager.EVENT_INIT_COMPLETE);
                    }
                }
                Manager.EVENT_INIT_COMPLETE = "social_initComplete";
                Social.Manager = Manager;
            })(Social = Battle.Social || (Battle.Social = {}));
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Battle;
        (function (Battle) {
            var Social;
            (function (Social) {
                class Player extends Gameplay.Social.Player {
                    constructor(uid, name, avatarUrl) {
                        super();
                        this._uid = uid;
                        this._name = Helpers.StringUtils.latinise(name).toUpperCase();
                        this._avatar = new Gameplay.Social.Avatar(avatarUrl, "avatar_" + uid);
                        this._saveState = null;
                        this.clearSaveState();
                    }
                    get saveState() { return this._saveState; }
                    getSaveState() {
                        return (this._saveState ? JSON.stringify(this._saveState) : "");
                    }
                    parseSaveState(data) {
                        if (data) {
                            try {
                                let d = JSON.parse(data);
                                if (d.trunk != undefined && d.bonuses != undefined && d.commands != undefined && d.score != undefined) {
                                    this._saveState = d;
                                    return true;
                                }
                            }
                            catch (e) {
                            }
                        }
                        this.clearSaveState();
                        return false;
                    }
                    clearSaveState() {
                        this._saveState = {
                            trunk: null,
                            bonuses: null,
                            commands: null,
                            score: 0,
                            hits: 0,
                            gameLen: 0
                        };
                    }
                }
                Social.Player = Player;
            })(Social = Battle.Social || (Battle.Social = {}));
        })(Battle = Gameplay.Battle || (Gameplay.Battle = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
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
        static purchaseItem(cost, name, base64Img, cbFnc, cbCtx) {
            if (!Gamee.ready)
                return false;
            window.gamee.purchaseItem({
                coinsCost: cost, itemName: name,
                itemImage: base64Img
            }, function (error, data) {
                let res = false;
                if (data && data.purchaseStatus)
                    res = true;
                cbFnc.call(cbCtx, res);
            });
        }
    }
    Gamee._events = new Phaser.Events.EventEmitter();
    Gamee._initState = 0;
    Gamee._ready = false;
    Gamee._score = 0;
    Gamee._adState = 3;
    Gamee2.Gamee = Gamee;
})(Gamee2 || (Gamee2 = {}));
var Game;
(function (Game) {
    class Global {
        static init() {
            let config = {
                type: Phaser.AUTO,
                width: 540,
                height: 960,
                physics: null,
                scale: {
                    mode: Phaser.Scale.NONE,
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
            };
            Global.game = new Phaser.Game(config);
            Global.game.scene.add("boot", Game.BootScene, true);
            Global.game.scene.add("gameplay", Game.Gameplay.MainScene);
            Global.scale = new Helpers.ScaleManager(Global.game.scale, new Phaser.Geom.Point(Global.CAMERA_MIN_WIDTH, Global.CAMERA_HEIGHT), new Phaser.Geom.Point(Global.CAMERA_MAX_WIDTH, Global.CAMERA_HEIGHT));
            Global.scale.resize();
        }
    }
    Global.CAMERA_MAX_WIDTH = 0;
    Global.CAMERA_MIN_WIDTH = 460;
    Global.CAMERA_HEIGHT = 960;
    Global.gameMode = 1;
    Game.Global = Global;
    window.onload = function () {
        Global.init();
    };
})(Game || (Game = {}));
var Game;
(function (Game) {
    class BootScene extends Phaser.Scene {
        constructor() {
            super({
                key: "boot",
                physics: {},
                plugins: ["Loader"],
            });
        }
        preload() {
            this.load.baseURL = "assets/";
            this.load.atlas("atlas_0");
            this.load.atlas("atlas_1");
            this.load.bitmapFont("font_0");
            this.load.bitmapFont("font_1");
            this.load.bitmapFont("font_2");
            this.load.audioSprite("sfx", "sfx.json");
            Gamee2.Gamee.events.once("initialized", (initState, initData) => {
                this._state = 2;
                Game.Global.game.sound.mute = !initData.sound;
                Game.Global.gameMode = initData.gameContext == "normal" ? 0 : 1;
            });
            this._state = Gamee2.Gamee.initialize("FullScreen", ["playerData", "rewardedAds", "saveState", "logEvents", "socialData", "share"]) ? 0 : 2;
        }
        update() {
            if (this._state == 2) {
                if (Game.Global.gameMode == 1) {
                    this.initBattle();
                }
                else {
                    this.initNormal();
                }
            }
        }
        initNormal() {
            this._state = 1;
            let friends = new Game.Gameplay.Social.FriendManager();
            friends.events.once(Game.Gameplay.Social.FriendManager.EVENT_LOAD_COMPLETE, () => {
                this.startGameplayScene(friends);
            }, this);
            friends.load(this);
        }
        initBattle() {
            this._state = 1;
            let socialManager = new Game.Gameplay.Battle.Social.Manager();
            this.events.once(Game.Gameplay.Battle.Social.Manager.EVENT_INIT_COMPLETE, () => {
                this.startGameplayScene(socialManager);
            }, this);
            socialManager.init(this);
        }
        startGameplayScene(sceneData) {
            this.scene.start("gameplay", sceneData);
            this.scene.remove("boot");
        }
    }
    Game.BootScene = BootScene;
})(Game || (Game = {}));

