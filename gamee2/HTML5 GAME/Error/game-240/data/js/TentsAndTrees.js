var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Guide;
        (function (Guide) {
            class Step {
                constructor(text, goals, extraCells, counters) {
                    this._text = text;
                    this._goals = goals;
                    this._extraCells = extraCells;
                    this._counters = counters;
                }
                get text() { return this._text[Game.Global.language]; }
                get goals() { return this._goals; }
                get extraCells() { return this._extraCells; }
                get counters() { return this._counters; }
            }
            Guide.Step = Step;
        })(Guide = Gameplay.Guide || (Gameplay.Guide = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        class MistakeGuard {
            constructor(infoBox, playfield) {
                MistakeGuard._DEF_INFO_BOX_TEXT = [
                    "Zkus dokončit level. Pokud budeš\npotřebovat poradit, tapni na " + "\u00C3" + ".",
                    "Try to complete the level.\nTap on " + "\u00C3" + " if you need help.",
                    "Intenta completar el nivel.\nToca en " + "\u00C3" + " si necesitas ayuda.",
                    "Попробуйте пройти уровень.\nКоснитесь " + "\u00C3" + ", если вам нужна помощь.",
                    "Tente completar o nível.\nToque em " + "\u00C3" + " se você precisar de ajuda.",
                    "Încearcă să completezi nivelul.\nApasă pe " + "\u00C3" + " dacă ai nevoie de ajutor.",
                ];
                MistakeGuard._MISTAKE_TOO_MANY_TENTS = [
                    "Máš moc stanů (" + "\u00BC" + ") v jedné\nřadě a nebo sloupci.",
                    "There are too many tents (" + "\u00BC" + ")\nin a row or a column.",
                    "Hay demasiadas tiendas (" + "\u00BC" + ")\nen la fila o columna.",
                    "Слишком много палаток (" + "\u00BC" + ")\nв столбце или строке.",
                    "Há muitas tendas (" + "\u00BC" + ")\nna fila ou na coluna.",
                    "Sunt prea multe corturi (" + "\u00BC" + ")\npe un rând sau o coloană.",
                ];
                this._infoBox = infoBox;
                this._playfield = playfield;
                this._mistakeCell = null;
                this._mistakeTentCountersMask = 0;
                this._showDarkLayerTweenCfg = {
                    targets: playfield,
                    darkLayerAlpha: 0.6,
                    duration: 500,
                };
            }
            get active() { return this._active; }
            show() {
                if (this._active)
                    return;
                this._active = true;
                this._infoBox.setText(MistakeGuard._DEF_INFO_BOX_TEXT[Game.Global.language]);
                this._infoBox.show();
                this._playfield.events.on("moveCntChange", this.handlePfMoveCntChange, this);
                this._playfield.events.on("showComplete", this.handlePfShowComplete, this);
            }
            hide() {
                if (!this._active)
                    return;
                this._active = false;
                this._playfield.events.off("moveCntChange", this.handlePfMoveCntChange, this);
                this._playfield.events.off("showComplete", this.handlePfShowComplete, this);
                if (this._showDarkLayerTween && this._showDarkLayerTween.isPlaying())
                    this._showDarkLayerTween.stop();
            }
            handlePfShowComplete() {
                if (!this._playfield.level.mistakeGuard)
                    return;
                this._mistakeCell = null;
                this._mistakeTentCountersMask = 0;
                if (this._playfield.lastMistake != null) {
                    this.checkCell(this._playfield.lastMistake.cell1);
                }
                else {
                    let level = this._playfield.level;
                    let col = level.width;
                    while (col-- != 0) {
                        if (this._playfield.getColTentCounter(col).state == Gameplay.Playfield.eTentCounterState.error)
                            break;
                    }
                    let row = level.height;
                    while (row-- != 0) {
                        if (this._playfield.getRowTentCounter(row).state == Gameplay.Playfield.eTentCounterState.error)
                            break;
                    }
                    if (col >= 0 || row >= 0) {
                        if (col < 0) {
                            col = 0;
                            while (this._playfield.getCell(col, row).state != 2)
                                col++;
                        }
                        else if (row < 0) {
                            row = 0;
                            while (this._playfield.getCell(col, row).state != 2)
                                row++;
                        }
                        this.checkCell(this._playfield.getCell(col, row));
                    }
                }
            }
            handlePfMoveCntChange(moveCnt, cell) {
                if (!this._playfield.level.mistakeGuard)
                    return;
                if (this._mistakeCell == null) {
                    if (cell.state == 2) {
                        this.checkCell(cell);
                    }
                }
                else {
                    this._playfield.darkLayerVisible = false;
                    if (this._showDarkLayerTween && this._showDarkLayerTween.isPlaying())
                        this._showDarkLayerTween.stop();
                    this._mistakeCell.setDepthLevel(0);
                    if (this._mistakeTentCountersMask != 0) {
                        if ((this._mistakeTentCountersMask & 1) != 0)
                            this._playfield.getColTentCounter(this._mistakeCell.col).setDepthLevel(0);
                        if ((this._mistakeTentCountersMask & 2) != 0)
                            this._playfield.getRowTentCounter(this._mistakeCell.row).setDepthLevel(0);
                        this._mistakeTentCountersMask = 0;
                    }
                    if (this._mistakeCell.mistakeCnt != 0)
                        this._mistakeCell.decMistakes();
                    this._mistakeCell = null;
                    this._infoBox.setText(MistakeGuard._DEF_INFO_BOX_TEXT[Game.Global.language]);
                    this._playfield.setCellGoals(null);
                }
            }
            checkCell(cell) {
                let mistakeDsc = null;
                this._mistakeTentCountersMask = 0;
                if (this._playfield.getColTentCounter(cell.col).state == Gameplay.Playfield.eTentCounterState.error) {
                    this._playfield.getColTentCounter(cell.col).setDepthLevel(1);
                    this._mistakeTentCountersMask |= 1;
                }
                if (this._playfield.getRowTentCounter(cell.row).state == Gameplay.Playfield.eTentCounterState.error) {
                    this._playfield.getRowTentCounter(cell.row).setDepthLevel(1);
                    this._mistakeTentCountersMask |= 2;
                }
                if (this._mistakeTentCountersMask != 0) {
                    mistakeDsc = MistakeGuard._MISTAKE_TOO_MANY_TENTS[Game.Global.language];
                }
                else if (this._playfield.lastMistake != null) {
                    mistakeDsc = Gameplay.Playfield.Mistakes.Manager.getMistakeDsc(this._playfield.lastMistake);
                }
                if (mistakeDsc != null) {
                    this._infoBox.setText(mistakeDsc);
                    this._mistakeCell = cell;
                    cell.setDepthLevel(1);
                    if (cell.mistakeCnt == 0)
                        cell.incMistakes(true);
                    this._playfield.setCellGoals([new Gameplay.Playfield.CellGoal(cell.id, 0)]);
                    this._playfield.darkLayerVisible = true;
                    this._playfield.darkLayerAlpha = 0;
                    if (!this._showDarkLayerTween || !this._showDarkLayerTween.isPlaying())
                        this._showDarkLayerTween = this._playfield.gameplay.mainScene.tweens.add(this._showDarkLayerTweenCfg);
                    return true;
                }
                return false;
            }
        }
        Gameplay.MistakeGuard = MistakeGuard;
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Results;
        (function (Results) {
            class PanelBattle {
                constructor(scene) {
                    this._scene = scene;
                    this._events = new Phaser.Events.EventEmitter();
                    this._events.on("btn_click", this.handleBtnOkClick, this);
                    this._overlay = scene.add.graphics().setVisible(false);
                    this._panel = new Controls.Group.Group()
                        .setVisible(false)
                        .setDepth(100);
                    this._panel.add(scene.add.image(0, 0, "atlas_0", Results.PanelNormal.ASSET_PREFIX + "panelBattle").setOrigin(0, 0));
                    this._steps = scene.add.bitmapText(0, 0, "fntDefaultBigC1", "", 60).setOrigin(0.5, 0);
                    this._panel.add(this._steps, 0, 20, 4, false);
                    this._time = scene.add.bitmapText(0, 0, "fntDefaultBigC1", "", 60).setOrigin(0.5, 0);
                    this._panel.add(this._time, 0, 172, 4, false);
                    this._score = scene.add.bitmapText(0, 0, "fntDefaultBigC1", "", 60).setOrigin(0.5, 0);
                    this._panel.add(this._score, 0, 330, 4, false);
                    this._btnOk = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", Results.PanelNormal.ASSET_PREFIX + "btnOk_")
                        .setVisible(false)
                        .setEventEmitter(this._events);
                    this._state = 0;
                    let self = this;
                    this._showTweenCfg = {
                        from: 0,
                        to: 1,
                        duration: 1000,
                        ease: Phaser.Math.Easing.Cubic.Out,
                        onUpdate: (tween) => {
                            let value = tween.getValue();
                            let camera = self._scene.cameras.main;
                            self._overlay.alpha = value;
                            self._panel.y = self._panelStartY + (self._panelTargetY - self._panelStartY) * value;
                            self._btnOk.x = camera.width + (((camera.width - self._btnOk.width) / 2) - camera.width) * value;
                        },
                        onComplete: () => {
                            self._btnOk.enabled = true;
                        }
                    };
                }
                reset() {
                    this._panel.visible = false;
                    this._btnOk.visible = false;
                    this._overlay.visible = false;
                    this._state = 0;
                }
                show(moveCnt, minMoveCnt, time, score, onCompleteClb, clbCtx) {
                    this._onCompleteClb = onCompleteClb;
                    this._clbCtx = clbCtx;
                    this._steps.setText(moveCnt + " / " + minMoveCnt);
                    this._time.setText(time);
                    this._score.setText(score.toString());
                    this._btnOk.setVisible(true).setEnabled(false);
                    this._panel.setVisible(true);
                    this._state = 1;
                    this.handleResolutionChange();
                    this._panel.y = this._panelStartY;
                    this._btnOk.x = this._scene.cameras.main.width;
                    this._overlay.setVisible(true).setAlpha(0);
                    this._scene.tweens.addCounter(this._showTweenCfg);
                }
                handleResolutionChange() {
                    if (!this._panel.visible)
                        return;
                    let camera = this._scene.cameras.main;
                    let x = Math.floor((camera.width - this._panel.width) / 2);
                    this._panelTargetY = camera.scrollY + Math.floor((camera.height - (this._panel.height + Results.PanelNormal.BTN_OK_OFFSET + this._btnOk.height)) / 2);
                    if (this._state == 3) {
                        this._panel.setPosition(x, this._panelTargetY);
                    }
                    else {
                        this._panel.x = x;
                        this._panelStartY = camera.scrollY - this._panel.height;
                    }
                    this._btnOk.y = this._panelTargetY + this._panel.height + Results.PanelNormal.BTN_OK_OFFSET;
                    this._overlay.clear();
                    this._overlay.fillStyle(0, 0.75);
                    this._overlay.fillRect(0, 0, camera.width, camera.height);
                    this._overlay.setPosition(0, camera.scrollY);
                }
                handleBtnOkClick() {
                    this._onCompleteClb.call(this._clbCtx);
                }
            }
            Results.PanelBattle = PanelBattle;
        })(Results = Gameplay.Results || (Gameplay.Results = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        class InfoBox {
            constructor() {
                let scene = Gameplay.Manager.instance.mainScene;
                this._scene = scene;
                this._layer = new Controls.Group.Group().setVisible(false);
                this._layer.cameraFilter = ~Gameplay.Manager.instance.uiCamera.id;
                this._layer.add(scene.add.image(0, 0, "atlas_0", "ui/instructionBox").setOrigin(0, 0).setScale(2));
                this._fx = this._layer.add(scene.add.image(0, 0, "atlas_0", "ui/instructionBoxFx").setOrigin(0, 0).setScale(2), 0, 0, 0, false)
                    .setVisible(false);
                this._fxTweenCfg = {
                    targets: this._fx,
                    alpha: 0,
                    duration: 750,
                    ease: Phaser.Math.Easing.Cubic.Out
                };
                this._text = scene.add.bitmapText(0, 0, "fntIntDef", "", 30).setCenterAlign().setOrigin(0.5);
                this._layer.add(this._text, 0, 0, 4 | 8, false);
            }
            get visible() { return this._layer.visible; }
            reset() {
                if (this._layer.visible) {
                    this._layer.visible = false;
                    this.stopFxTween();
                }
            }
            setText(text) {
                this._text.text = text;
                if (this._layer.visible)
                    this.startNewTextFx();
            }
            show() {
                if (!this._layer.visible) {
                    this._layer.setAlpha(1).setVisible(true);
                    this.updatePosition();
                }
            }
            hide(smoothly) {
                if (smoothly) {
                    Gameplay.Manager.instance.mainScene.tweens.add({
                        targets: this._layer,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => { this.reset(); }
                    });
                }
                else {
                    this.reset();
                }
            }
            updatePosition() {
                if (this._layer.visible) {
                    let camera = Gameplay.Manager.instance.uiCamera;
                    this._layer.setPosition(Gameplay.Manager.UI_LAYER_X + Math.floor((camera.width - this._layer.width) / 2), Gameplay.Manager.UI_LAYER_Y + camera.height - this._layer.height);
                }
            }
            startNewTextFx() {
                this.stopFxTween();
                this._fx.setVisible(true)
                    .setAlpha(0.6);
                this._fxTween = Gameplay.Manager.instance.mainScene.tweens.add(this._fxTweenCfg);
            }
            stopFxTween() {
                if (this._fxTween && this._fxTween.isPlaying)
                    this._fxTween.stop(0);
            }
        }
        Gameplay.InfoBox = InfoBox;
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var LevelSelect;
    (function (LevelSelect) {
        class Avatar {
            constructor(scene) {
                this._panel = new Controls.Group.Group()
                    .setVisible(false);
                this._panel.add(scene.add.image(0, 0, "atlas_0", "ui/avatarBg").setOrigin(0, 0));
                let mask = scene.make.graphics()
                    .fillStyle(0xFFFFFF)
                    .beginPath()
                    .fillCircle(this._panel.width / 2, this._panel.height / 2, Avatar.IMAGE_RADIUS);
                this._panel.add(mask, 0, 0, 0, false);
                this._image = scene.add.image(0, 0, "atlas_0")
                    .setMask(mask.createGeometryMask());
                this._panel.add(this._image, 0, 0, 4 | 8, false);
            }
            get panel() { return this._panel; }
            show(x, y, avatarKey, depth) {
                this._image.setTexture(avatarKey)
                    .setDisplaySize(Avatar.IMAGE_RADIUS * 2, Avatar.IMAGE_RADIUS * 2);
                this._panel.setPosition(x, y)
                    .setDepth(depth)
                    .setVisible(true);
            }
        }
        Avatar.IMAGE_RADIUS = 17;
        LevelSelect.Avatar = Avatar;
    })(LevelSelect = Game.LevelSelect || (Game.LevelSelect = {}));
})(Game || (Game = {}));
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
var Game;
(function (Game) {
    class LoaderScene extends Phaser.Scene {
        constructor() {
            super({
                key: "loader",
                physics: {},
                plugins: ["Loader"],
            });
            this._mode = 0;
        }
        preload() {
            this.load.setPath("assets/");
            this.load.atlas("atlas_0");
            this.load.xml("fntIntDef");
            this.load.bitmapFont("fntDefault");
            this.load.bitmapFont("fntNumsC0");
            this.load.bitmapFont("fntNumsC1");
            this.load.bitmapFont("fntDefaultBigC0");
            this.load.bitmapFont("fntDefaultBigC1");
            this.load.audioSprite("sfx", "sfx.json");
            Gamee2.Gamee.events.once("initialized", (initState, initData) => {
                this._gameeReady = true;
                if (initState == 1) {
                    Game.Global.game.sound.mute = !initData.sound;
                    Game.Global.gameContext = initData.gameContext;
                    if (initData.locale) {
                        let lngCode = initData.locale.slice(0, 2);
                        let lng = 0;
                        for (lng = 0; lng < Game.Global.languageCodes.length; lng++) {
                            if (Game.Global.languageCodes[lng] == lngCode)
                                break;
                        }
                        if (lng < Game.Global.languageCodes.length)
                            Game.Global.language = lng;
                    }
                    Game.Global.save.load(initData.saveState);
                    if (Game.Global.gameContext == "normal")
                        Gamee2.Gamee.loadAd();
                }
            });
            this._gameeReady = !Gamee2.Gamee.initialize("FullScreen", ["rewardedAds", "saveState", "logEvents", "socialData"]);
        }
        create() {
            Phaser.GameObjects.BitmapText.ParseFromAtlas(this, "fntIntDef", "atlas_0", "fonts/" + "fntIntDef", "fntIntDef", 0, 0);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/tent", 188, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/tree", 189, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/grass", 190, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/connection_1H", 191, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/connection_1V", 192, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/connection_0D", 193, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/tentCounter", 194, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/btnHelp", 195, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Helpers.FontUtils.addSpriteIntoFont(this.game, "fntIntDef", "fonts/tentCounterZero", 196, "0", Helpers.FontUtils.ALIGN_CENTER, 0.5);
            Game.Global.friends = new Game.Friends.Manager(this);
            Game.Global.friends.events.on(Game.Friends.Manager.EVENT_LOAD_COMPLETE, this.handleFriendsLoaded, this);
        }
        update() {
            if (this._mode == 0) {
                if (this._gameeReady) {
                    if (Game.Global.gameContext == "normal") {
                        if (Game.Global.save.showTutorial) {
                            this.scene.run("gameplayMain", Game.Global.levelGroups[0].levels[0]);
                        }
                        else {
                            this.scene.run("levelSelect");
                        }
                        if (Gamee2.Gamee.initialized) {
                            this._mode = 1;
                            Game.Global.friends.load();
                        }
                        else {
                            this._mode = 2;
                            this.scene.stop("loader");
                        }
                    }
                    else {
                        this._mode = 2;
                        this.scene.start("gameplayMain", Game.Global.getRndBattleLevel());
                    }
                }
            }
        }
        handleFriendsLoaded() {
            this._mode = 2;
            this.scene.pause("loader");
        }
        static loadFriends() {
            if (Game.Global.friends.initInProgress)
                return;
            let scene = Game.Global.game.scene.getScene("loader");
            if (scene.sys.isSleeping())
                scene.sys.wake();
            scene._mode = 1;
            Game.Global.friends.load();
        }
    }
    Game.LoaderScene = LoaderScene;
})(Game || (Game = {}));
var Collections;
(function (Collections) {
    class ILinkedListNode {
    }
    Collections.ILinkedListNode = ILinkedListNode;
    class LinkedList {
        constructor(defNodeCnt) {
            this._firstNode = null;
            this._lastNode = null;
            this._nElements = 0;
            this._nodePool = new Collections.Pool(undefined, Math.round(defNodeCnt), true, function () {
                return new ILinkedListNode();
            }, this);
        }
        add(item, index) {
            if (isUndefined(index)) {
                index = this._nElements;
            }
            if (index < 0 || index > this._nElements || isUndefined(item)) {
                return false;
            }
            const newNode = this.createNode(item);
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
                const prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                newNode.prev = prev;
                newNode.next.prev = newNode;
                prev.next = newNode;
            }
            this._nElements++;
            return true;
        }
        addToNode(item, neighbor, before) {
            let newNode = this.createNode(item);
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
        }
        get first() {
            if (this._firstNode !== null) {
                return this._firstNode.element;
            }
            return undefined;
        }
        get last() {
            if (this._lastNode !== null)
                return this._lastNode.element;
            return undefined;
        }
        get firstNode() { return this._firstNode; }
        get lastNode() { return this._lastNode; }
        elementAtIndex(index) {
            const node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        }
        indexOf(item, equalsFunction) {
            const equalsF = equalsFunction || defaultEquals;
            if (isUndefined(item)) {
                return -1;
            }
            let currentNode = this._firstNode;
            let index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        }
        previous(item, equalsFunction) {
            const equalsF = equalsFunction || defaultEquals;
            if (isUndefined(item)) {
                return null;
            }
            let currentNode = this._firstNode;
            let prevNode = null;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return prevNode != null ? prevNode.element : null;
                }
                prevNode = currentNode;
                currentNode = currentNode.next;
            }
            return null;
        }
        next(item, equalsFunction) {
            const equalsF = equalsFunction || defaultEquals;
            if (isUndefined(item)) {
                return null;
            }
            let currentNode = this._firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    let next = currentNode.next;
                    return next != undefined && next != null ? next.element : null;
                }
                currentNode = currentNode.next;
            }
            return null;
        }
        contains(item, equalsFunction) {
            return (this.indexOf(item, equalsFunction) >= 0);
        }
        remove(item, equalsFunction) {
            const equalsF = equalsFunction || defaultEquals;
            if (this._nElements < 1 || isUndefined(item)) {
                return false;
            }
            let previous = null;
            let currentNode = this._firstNode;
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
        }
        clear() {
            let currentNode = this._firstNode;
            while (currentNode != null) {
                this._nodePool.returnItem(currentNode);
                currentNode.element = null;
                currentNode = currentNode.next;
            }
            this._firstNode = null;
            this._lastNode = null;
            this._nElements = 0;
        }
        equals(other, equalsFunction) {
            const eqF = equalsFunction || defaultEquals;
            if (!(other instanceof LinkedList)) {
                return false;
            }
            if (this.size != other.size) {
                return false;
            }
            return this.equalsAux(this._firstNode, other._firstNode, eqF);
        }
        equalsAux(n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        }
        removeElementAtIndex(index) {
            if (index < 0 || index >= this._nElements) {
                return undefined;
            }
            return this.removeNode(this.nodeAtIndex(index));
        }
        removeNode(node) {
            if (node == this._firstNode) {
                this._firstNode = node.next;
                if (this._firstNode != null) {
                    this._firstNode.prev = null;
                }
                else {
                    this._lastNode = null;
                }
            }
            else if (node == this._lastNode) {
                this._lastNode = node.prev;
                this._lastNode.next = null;
            }
            else {
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            this._nElements--;
            let element = node.element;
            node.element = null;
            this._nodePool.returnItem(node);
            return element;
        }
        forEach(callback, thisContext, ...args) {
            let currentNode = this._firstNode;
            while (currentNode !== null) {
                let nextNode = currentNode.next;
                if (!callback.call(thisContext, currentNode.element, currentNode, args))
                    break;
                currentNode = nextNode;
            }
        }
        reverse() {
            let previous = null;
            let current = this._firstNode;
            let temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this._firstNode;
            this._firstNode = this._lastNode;
            this._lastNode = temp;
        }
        toArray() {
            const array = [];
            let currentNode = this._firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        }
        get size() {
            return this._nElements;
        }
        get isEmpty() {
            return this._nElements <= 0;
        }
        toString() {
            return this.toArray().toString();
        }
        nodeAtIndex(index) {
            if (index < 0 || index >= this._nElements) {
                return null;
            }
            if (index === (this._nElements - 1)) {
                return this._lastNode;
            }
            let node = this._firstNode;
            for (let i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        }
        createNode(item) {
            let node = this._nodePool.getItem();
            node.element = item;
            node.next = null;
            node.prev = null;
            return node;
        }
    }
    Collections.LinkedList = LinkedList;
    function defaultEquals(a, b) {
        return a === b;
    }
    function isUndefined(obj) {
        return (typeof obj) === 'undefined';
    }
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    class Stack {
        constructor(defBufSize = 0, maxSize = 0) {
            this._buffer = [];
            this._size = 0;
            this._maxSize = maxSize;
            if (maxSize > 0 && defBufSize > maxSize)
                defBufSize = maxSize;
            if (defBufSize > 0)
                this.ensureCapacity(defBufSize);
        }
        get buffer() { return this._buffer; }
        get size() { return this._size; }
        set size(size) { this._size = size; }
        get empty() { return this._size == 0; }
        get maxSize() { return this._maxSize; }
        reset(clear = false) {
            if (clear) {
                let entryId = this._buffer.length;
                while (entryId-- != 0)
                    this._buffer[entryId] = undefined;
            }
            this._size = 0;
        }
        ensureCapacity(capacity, clear = false) {
            if (clear) {
                let i = Math.min(capacity, this._buffer.length);
                while (i-- != 0)
                    this._buffer[i] = null;
            }
            while (this._buffer.length < capacity)
                this._buffer.push(null);
        }
        push(entry) {
            if (this._maxSize <= 0 || this._size < this._maxSize) {
                this._buffer[this._size++] = entry;
                return true;
            }
            return false;
        }
        pop() {
            if (this._size == 0)
                return undefined;
            let entry = this._buffer[--this._size];
            this._buffer[this._size] = undefined;
            return entry;
        }
        get(id) {
            if (id >= this._size)
                return undefined;
            return this._buffer[id];
        }
        forEach(callback, context) {
            for (let entryId = 0; entryId < this._size; entryId++) {
                callback.call(context, this._buffer[entryId]);
            }
        }
        every(callback, context) {
            for (let entryId = 0; entryId < this._size; entryId++) {
                if (!callback.call(context, this._buffer[entryId]))
                    break;
            }
        }
        toString(separator = ",") {
            if (this._size == 0)
                return "";
            let res = "";
            if (typeof this._buffer[0] == "number") {
                for (let entryId = 0; entryId < this._size; entryId++)
                    res += (this._buffer[entryId] + separator);
                return res.slice(0, res.length - 1);
            }
            return "";
        }
        copyTo(array = []) {
            for (let i = 0; i < this._size; i++)
                array[i] = this._buffer[i];
            return array;
        }
    }
    Collections.Stack = Stack;
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
            handlePointerDown() {
                if (this._state == 0) {
                    this._state = 1;
                    this.handleStateChange(this._state);
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
    class PointerScroller {
        constructor(scene, hRatio, vRatio, onStartClb, onProgressClb, callbackCtx, hitArea, camera = null) {
            this._scene = scene;
            if (!camera)
                camera = this._scene.cameras.main;
            this._camera = camera;
            this._hitArea = hitArea;
            this._hRatio = hRatio;
            this._vRatio = vRatio;
            this._onStartClb = onStartClb;
            this._onProgressClb = onProgressClb;
            this._callbackCtx = callbackCtx;
            this._x = this._y = 0;
            this._pointerPos = new Phaser.Math.Vector2();
            this._autoScrollX = false;
            this._autoScrollY = false;
            this._enabled = false;
            this._kineticChange = true;
        }
        get horizontalRatio() { return this._hRatio; }
        set horizontalRatio(ratio) { this._hRatio = ratio; }
        get verticalRatio() { return this._vRatio; }
        set verticalRatio(ratio) { this._vRatio = ratio; }
        get scene() { return this._scene; }
        get enabled() { return this._enabled; }
        set enabled(enabled) { this.setEnabled(enabled); }
        get kineticChange() { return this._kineticChange; }
        set kineticChange(enabled) { this.setKineticChange(enabled); }
        get hitArea() { return this._hitArea; }
        get x() { return this._x; }
        get y() { return this._y; }
        setEnabled(enabled) {
            if (this._enabled == enabled)
                return this;
            if ((this._enabled = enabled)) {
                this._scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                this._scene.input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
                this._scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
            }
            else {
                this._scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                this._scene.input.off(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
                this._scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
                this.abortKineticChange();
            }
            return this;
        }
        setKineticChange(enabled) {
            if (this._kineticChange == enabled)
                return this;
            if (!(this._kineticChange = enabled))
                this.abortKineticChange();
            return this;
        }
        handleScenePreUpdate() {
            let elapsedTime = this._scene.time.now - this._timeStamp;
            let x = this._x;
            let y = this._y;
            if (this._autoScrollX && this._amplitudeX != 0) {
                let delta = this._amplitudeX * Math.exp(-elapsedTime / PointerScroller.TIME_CONSTANT_SCROLL);
                if (delta > 0.5 || delta < -0.5) {
                    x = this._targetX - delta;
                }
                else {
                    this._autoScrollX = false;
                    x = this._targetX;
                }
            }
            if (this._autoScrollY && this._amplitudeY != 0) {
                let delta = this._amplitudeY * Math.exp(-elapsedTime / PointerScroller.TIME_CONSTANT_SCROLL);
                if (delta > 0.5 || delta < -0.5) {
                    y = this._targetY - delta;
                }
                else {
                    this._autoScrollY = false;
                    y = this._targetY;
                }
            }
            if (!this._autoScrollX && !this._autoScrollY)
                this._scene.events.off(Phaser.Scenes.Events.UPDATE, this.handleScenePreUpdate, this);
            if (x != this._x || y != this._y)
                this.updatePosition(x - this._x, y - this._y);
        }
        handlePointerDown(pointer) {
            pointer.positionToCamera(this._camera, this._pointerPos);
            if (!this._hitArea.contains(this._pointerPos.x, this._pointerPos.y))
                return;
            this._pointerPressed = true;
            this.abortKineticChange();
            this._timeStamp = this._scene.time.now;
            this._startX = this._pointerPos.x;
            this._startY = this._pointerPos.y;
            this._velocityX = 0;
            this._velocityY = 0;
            this._amplitudeX = 0;
            this._amplitudeY = 0;
            if (this._onStartClb) {
                this._onStartClb.call(this._callbackCtx, this._pointerPos.set(0, 0));
                this._x = this._pointerPos.x;
                this._y = this._pointerPos.y;
            }
        }
        handlePointerUp() {
            if (!this._pointerPressed)
                return;
            this._pointerPressed = false;
            if (!this._kineticChange)
                return;
            let timeStamp = this._scene.time.now;
            let elapsedTime = timeStamp - this._timeStamp;
            if (elapsedTime > 100)
                return;
            this._timeStamp = timeStamp;
            if (this._hRatio != 0 && (this._velocityX > 10 || this._velocityX < -10)) {
                this._amplitudeX = 0.4 * this._velocityX;
                this._targetX = Math.round(this._x - this._amplitudeX);
                this._autoScrollX = true;
            }
            if (this._vRatio != 0 && (this._velocityY > 10 || this._velocityY < -10)) {
                this._amplitudeY = 0.4 * this._velocityY;
                this._targetY = Math.round(this._y + this._amplitudeY);
                this._autoScrollY = true;
            }
            this._scene.events.on(Phaser.Scenes.Events.UPDATE, this.handleScenePreUpdate, this);
        }
        handlePointerMove(pointer) {
            if (!this._pointerPressed)
                return;
            let timeStamp = this._scene.time.now;
            let elapsedTime = timeStamp - this._timeStamp;
            this._timeStamp = timeStamp;
            pointer.positionToCamera(this._camera, this._pointerPos);
            let deltaX = 0;
            let deltaY = 0;
            if (this._hRatio != 0) {
                deltaX = (this._pointerPos.x - this._startX) * this._hRatio;
                if (deltaX != 0)
                    this._startX = this._pointerPos.x;
                this._velocityX = 0.6 * (1000 * deltaX / (1 + elapsedTime)) + 0.2 * this._velocityX;
            }
            if (this._vRatio != 0) {
                deltaY = (this._pointerPos.y - this._startY) * this._vRatio;
                if (deltaY != 0)
                    this._startY = this._pointerPos.y;
                this._velocityY = 0.6 * (1000 * deltaY / (1 + elapsedTime)) + 0.2 * this._velocityY;
            }
            this.updatePosition(deltaX, deltaY);
        }
        updatePosition(deltaX, deltaY) {
            let x = this._x + deltaX;
            let y = this._y + deltaY;
            if ((this._hRatio != 0 && x != this._x) || (this._vRatio != 0 && y != this._y)) {
                this._x = x;
                this._y = y;
                if (this._onProgressClb)
                    this._onProgressClb.call(this._callbackCtx, x, y, deltaX, deltaY);
            }
        }
        abortKineticChange() {
            if (this._autoScrollX || this._autoScrollY) {
                this._autoScrollX = false;
                this._autoScrollY = false;
                this._scene.events.off(Phaser.Scenes.Events.UPDATE, this.handleScenePreUpdate, this);
            }
        }
    }
    PointerScroller.TIME_CONSTANT_SCROLL = 300;
    Controls.PointerScroller = PointerScroller;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ListBox;
    (function (ListBox_1) {
        class ListBox {
            constructor(scene, bufX, bufY, itemSize, itemCreateClb, itemCreateClbCtx, itemPadding = 0, orientation = 0) {
                this._itemCreateClb = itemCreateClb;
                this._itemCreateClbCtx = itemCreateClbCtx;
                this._itemSize = itemSize;
                this._itemPadding = itemPadding;
                this._orientation = orientation;
                this._view = scene.cameras.add(0, 0, 10, 10);
                this._view.setScroll(bufX, bufY);
                this._viewOffset = 0;
                this._viewOffsetLimitAddNeg = 0;
                this._viewOffsetLimitAddPos = 0;
                this._actItems = new Collections.WrappedArray();
                this._inactItems = new Collections.Pool(null, 0, true, () => {
                    return this._itemCreateClb.call(this._itemCreateClbCtx, this);
                }, this);
                this._content = null;
                this._scroller = new Controls.PointerScroller(scene, 0, -1, (startPos) => {
                    if (this._orientation == 1) {
                        startPos.x = this._viewOffset;
                    }
                    else {
                        startPos.y = this._viewOffset;
                    }
                }, (x, y) => {
                    let offset = Math.floor((this._orientation == 0 ? y : x) - this._viewOffset);
                    if (offset != 0)
                        this.moveView(offset);
                }, this, new Phaser.Geom.Rectangle(bufX, bufY, 0, 0), this._view);
            }
            get bufX() { return this._view.scrollX; }
            get bufY() { return this._view.scrollY; }
            get scene() { return this._view.scene; }
            get orientation() { return this._orientation; }
            get x() { return this._view.x; }
            set x(x) { this.setX(x); }
            get y() { return this._view.y; }
            set y(y) { this.setY(y); }
            get width() { return this._view.width; }
            set width(width) { this.setWidth(width); }
            get height() { return this._view.height; }
            set height(height) { this.setHeight(height); }
            get itemSize() { return this._itemSize; }
            get itemPadding() { return this._itemPadding; }
            get contentSize() {
                if (!this._content)
                    return 0;
                return (this._content.length * (this._itemSize + this._itemPadding)) - this._itemPadding;
            }
            get viewOffset() { return this._viewOffset; }
            set viewOffset(viewOffset) {
                if (viewOffset == this._viewOffset)
                    return;
                this.moveView(viewOffset - this._viewOffset);
            }
            get maxViewOffset() { return this.contentSize - this.height; }
            get content() { return this._content; }
            set content(content) { this.setContent(content); }
            get visibleItems() { return this._actItems; }
            setX(x) {
                this._view.x = x;
                return this;
            }
            setY(y) {
                this._view.y = y;
                return this;
            }
            setWidth(width) {
                let curWidth = this._view.width;
                if (curWidth != width) {
                    this._view.width = width;
                    if (this._orientation != 0)
                        this.handleSizeChange(width, curWidth);
                }
                return this;
            }
            setHeight(height) {
                let curHeight = this._view.height;
                if (curHeight != height) {
                    this._view.height = height;
                    if (this._orientation == 0)
                        this.handleSizeChange(height, curHeight);
                }
                return this;
            }
            setContent(content) {
                this._content = content;
                this.fill();
                return this;
            }
            setViewOffsetLimitAddition(negative, positive) {
                this._viewOffsetLimitAddNeg = negative;
                this._viewOffsetLimitAddPos = positive;
                return this;
            }
            release() {
                this.setContent(null);
                return this;
            }
            getItemViewOffset(itemId) {
                return (this._itemSize + this._itemPadding) * itemId;
            }
            getItem(content) {
                let res = null;
                this._actItems.every((lbItem) => {
                    if (lbItem.content == content) {
                        res = lbItem;
                        return false;
                    }
                    return true;
                }, this);
                return res;
            }
            moveView(offset) {
                if (this._actItems.empty)
                    return this;
                let viewOffset = this._viewOffset + offset;
                let viewSize = (this._orientation == 0 ? this._view.height : this._view.width);
                if (viewOffset < this._viewOffsetLimitAddNeg) {
                    viewOffset = this._viewOffsetLimitAddNeg;
                }
                else if (viewOffset > Math.max(0, this.contentSize - viewSize + this._viewOffsetLimitAddPos)) {
                    viewOffset = Math.max(0, this.contentSize - viewSize + this._viewOffsetLimitAddPos);
                }
                offset = viewOffset - this._viewOffset;
                if (offset == 0)
                    return this;
                this._viewOffset = viewOffset;
                let item;
                let itemPos;
                let itemId;
                if (offset > 0) {
                    item = this._actItems.first;
                    while (item != null && item.position + this._itemSize <= this._viewOffset) {
                        this._inactItems.returnItem(this._actItems.remove(false).deactivate());
                        item = this._actItems.first;
                    }
                    this._actItems.forEach((item) => { item.updatePosition(); }, this);
                    item = this._actItems.last;
                    if (item != null) {
                        itemPos = item.position + this._itemSize + this._itemPadding;
                        itemId = item.contentId + 1;
                    }
                    else {
                        itemId = Math.floor(this._viewOffset / (this._itemSize + this._itemPadding));
                        itemPos = this.getItemViewOffset(itemId);
                    }
                    while (itemId < this._content.length && itemPos < this._viewOffset + viewSize) {
                        item = this._inactItems.getItem();
                        item.activate(itemId, this._content[itemId], itemPos);
                        this._actItems.add(item);
                        itemId++;
                        itemPos += this._itemSize + this._itemPadding;
                    }
                }
                else {
                    item = this._actItems.last;
                    while (item != null && item.position > this._viewOffset + viewSize) {
                        this._inactItems.returnItem(this._actItems.remove(true).deactivate());
                        item = this._actItems.last;
                    }
                    this._actItems.forEach((item) => { item.updatePosition(); }, this);
                    item = this._actItems.first;
                    if (item != null) {
                        itemPos = item.position - this._itemSize - this._itemPadding;
                        itemId = item.contentId - 1;
                    }
                    else {
                        itemId = Math.floor(this._viewOffset / (this._itemSize + this._itemPadding));
                        itemPos = this.getItemViewOffset(itemId);
                    }
                    while (itemId >= 0 && itemPos + this._itemSize > this._viewOffset) {
                        item = this._inactItems.getItem();
                        item.activate(itemId, this._content[itemId], itemPos);
                        this._actItems.add(item, false);
                        itemId--;
                        itemPos -= (this._itemSize + this._itemPadding);
                    }
                }
                return this;
            }
            fill() {
                this._actItems.forEach((item) => {
                    this._inactItems.returnItem(item.deactivate());
                }, this);
                this._actItems.clear();
                if (this._content) {
                    let itemPos = 0;
                    let viewSize = (this._orientation == 0 ? this.height : this.width);
                    for (let itemId = 0; itemId < this._content.length && itemPos < viewSize; itemId++) {
                        let lbItem = this._inactItems.getItem();
                        lbItem.activate(itemId, this._content[itemId], itemPos);
                        this._actItems.add(lbItem);
                        itemPos += this._itemSize + this._itemPadding;
                    }
                    this._scroller.enabled = true;
                }
                else {
                    this._scroller.enabled = false;
                }
                this._viewOffset = 0;
            }
            handleSizeChange(newSize, oldSize) {
                this._scroller.hitArea.setSize(this.width, this.height);
                if (this._actItems.empty)
                    return;
                let lastItem = this._actItems.last;
                if (newSize > oldSize) {
                    let nextItemId = lastItem.contentId + 1;
                    let nextItemPos = lastItem.position + this._itemSize + this._itemPadding;
                    while (nextItemId < this._content.length && nextItemPos - this._viewOffset < newSize) {
                        let item = this._inactItems.getItem();
                        item.activate(nextItemId, this._content[nextItemId], nextItemPos);
                        this._actItems.add(item);
                        nextItemId++;
                        nextItemPos += this._itemSize + this._itemPadding;
                    }
                }
                else {
                    while (lastItem != null && lastItem.position >= newSize) {
                        this._inactItems.returnItem(lastItem.deactivate());
                        this._actItems.remove(true);
                        lastItem = this._actItems.last;
                    }
                }
            }
        }
        ListBox_1.ListBox = ListBox;
    })(ListBox = Controls.ListBox || (Controls.ListBox = {}));
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ListBox;
    (function (ListBox) {
        class ListBoxItem {
            constructor(listBox) {
                this._listBox = listBox;
            }
            get listBox() { return this._listBox; }
            get contentId() { return this._contentId; }
            get content() { return this._content; }
            get position() { return this._position; }
            set position(pos) {
                if (pos != this._position) {
                    this._position = pos;
                    this.handlePosChange(this.x, this.y);
                }
            }
            get x() {
                let x = this._listBox.bufX;
                if (this._listBox.orientation != 0)
                    x += (this._position - this._listBox.viewOffset);
                return x;
            }
            get y() {
                let y = this._listBox.bufY;
                if (this._listBox.orientation == 0)
                    y += (this._position - this._listBox.viewOffset);
                return y;
            }
            activate(contentId, content, pos) {
                this._contentId = contentId;
                this._content = content;
                this._position = pos;
                return this;
            }
            deactivate() {
                this._contentId = -1;
                this._content = null;
                return this;
            }
            updatePosition() {
                this.handlePosChange(this.x, this.y);
                return this;
            }
        }
        ListBox.ListBoxItem = ListBoxItem;
    })(ListBox = Controls.ListBox || (Controls.ListBox = {}));
})(Controls || (Controls = {}));
var Game;
(function (Game) {
    var Friends;
    (function (Friends) {
        class Entry {
            constructor(gameePlayer) {
                this._uid = gameePlayer.userID;
                this._name = gameePlayer.name;
                this._score = gameePlayer.highScore;
                this._avatarUrl = gameePlayer.avatar;
                this._flags = 4;
                this._highestLevel = null;
            }
            get uid() { return this._uid; }
            get name() { return this._name; }
            get score() { return this._score; }
            get avatarUrl() { return this._avatarUrl; }
            get avatarKey() { return "avatar_" + this._uid; }
            get avatarLoaded() { return Game.Global.game.textures.exists(this.avatarKey); }
            get highestLevel() { return this._highestLevel; }
            release() {
                if (this.avatarLoaded)
                    Game.Global.game.textures.remove(this.avatarKey);
                if (this._highestLevel != null) {
                    this._highestLevel.removeFriend(this);
                    this._highestLevel = null;
                }
                this._flags &= ~4;
            }
            reset(gameePlayer) {
                this._score = gameePlayer.highScore;
            }
            setSaveData(saveString) {
                let highestLevelId = -1;
                if (saveString.length != 0) {
                    try {
                        let saveData = JSON.parse(saveString);
                        if (saveData.lvlResults != undefined)
                            highestLevelId = saveData.lvlResults.length - 1;
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                if (highestLevelId >= 0) {
                    if (this._highestLevel == null || this._highestLevel.id != highestLevelId) {
                        if (this._highestLevel != null)
                            this._highestLevel.removeFriend(this);
                        let level = Game.Global.getLevelById(highestLevelId);
                        level.addFriend(this);
                        this._highestLevel = level;
                    }
                }
                else if (this._highestLevel != null) {
                    this._highestLevel.removeFriend(this);
                    this._highestLevel = null;
                }
            }
        }
        Friends.Entry = Entry;
    })(Friends = Game.Friends || (Game.Friends = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Friends;
    (function (Friends) {
        class Manager {
            constructor(scene) {
                this._scene = scene;
                this._events = new Phaser.Events.EventEmitter();
                this._entries = [];
                this._initInProgress = false;
                this._lastInitTime = -1;
            }
            get events() { return this._events; }
            get entries() { return this._entries; }
            get initInProgress() { return this._initInProgress; }
            get lastInitTime() { return this._lastInitTime; }
            load() {
                if (this._initInProgress)
                    return;
                this._initInProgress = true;
                if (!Gamee2.Gamee.initialized) {
                    this.handleLoadComplete();
                    return;
                }
                Gamee2.Gamee.requestSocial(() => {
                    let friends = [];
                    let gameeFriends = Gamee2.Gamee.friends;
                    gameeFriends.forEach((gameeFriend) => {
                        let friend = null;
                        for (let i = 0; i < this._entries.length; i++) {
                            let entry = this._entries[i];
                            if (entry != null && entry.uid == gameeFriend.userID) {
                                friend = entry;
                                friend.reset(gameeFriend);
                                this._entries[i] = null;
                                break;
                            }
                        }
                        if (friend == null)
                            friend = new Friends.Entry(gameeFriend);
                        friends.push(friend);
                    }, this);
                    this._entries.forEach((entry) => {
                        if (entry != null)
                            entry.release();
                    });
                    this._entries = friends;
                    if (this._entries.length != 0) {
                        this._entryId = 0;
                        Gamee2.Gamee.requestPlayerSaveData(this.handleSaveDataLoaded, this, this._entries[this._entryId].uid);
                    }
                    else {
                        this.handleLoadComplete();
                    }
                }, this);
            }
            handleSaveDataLoaded(saveString) {
                this._entries[this._entryId].setSaveData(saveString);
                if (++this._entryId == this._entries.length) {
                    let loader = this._scene.load;
                    loader.reset();
                    loader.crossOrigin = "anonymous";
                    this._entries.forEach((entry) => {
                        if (!entry.avatarLoaded) {
                            if (entry.avatarUrl.slice(0, 10) == "data:image") {
                                this._scene.textures.addBase64(entry.avatarKey, entry.avatarUrl);
                            }
                            else {
                                loader.image(entry.avatarKey, entry.avatarUrl);
                            }
                        }
                    });
                    if (loader.totalToLoad != 0) {
                        loader.once(Phaser.Loader.Events.COMPLETE, this.handleLoadComplete, this);
                        loader.start();
                    }
                    else {
                        this.handleLoadComplete();
                    }
                }
                else {
                    Gamee2.Gamee.requestPlayerSaveData(this.handleSaveDataLoaded, this, this._entries[this._entryId].uid);
                }
            }
            handleLoadComplete() {
                this._initInProgress = false;
                this._lastInitTime = Date.now();
                this._events.emit(Manager.EVENT_LOAD_COMPLETE, this);
            }
        }
        Manager.EVENT_LOAD_COMPLETE = "friends_load_complete";
        Friends.Manager = Manager;
    })(Friends = Game.Friends || (Game.Friends = {}));
})(Game || (Game = {}));
var Helpers;
(function (Helpers) {
    class FontUtils {
        static addSpriteIntoFont(game, fontName, frame, newCharCode, referenceChar = "0", align = FontUtils.ALIGN_CENTER, originY = 0.5) {
            if (typeof referenceChar === "string") {
                referenceChar = referenceChar.charCodeAt(0);
            }
            let font = game.cache.bitmapFont.get(fontName);
            let fontTex = font.texture;
            let fontFrame = game.textures.getFrame(fontTex, font.frame);
            let fontChars = font.data.chars;
            let refChar = fontChars[referenceChar];
            if (refChar == null) {
                throw new Error(`Reference character ${String.fromCharCode(referenceChar)} with code ${referenceChar} is mssing in font. Try another.`);
            }
            let f = game.textures.getFrame(fontTex, frame);
            let fWidth = f.customData["sourceSize"]["w"];
            let fHeight = f.customData["sourceSize"]["h"];
            let refY = refChar.yOffset +
                (align === FontUtils.ALIGN_CENTER ? refChar.height / 2 :
                    align === FontUtils.ALIGN_BOTTOM ? refChar.height : 0);
            let yOffset = Math.round(refY - fHeight * originY);
            fontChars[newCharCode] = {
                x: f.cutX - fontFrame.cutX,
                y: f.cutY - fontFrame.cutY,
                width: f.cutWidth,
                height: f.cutHeight,
                centerX: Math.floor(fWidth / 2),
                centerY: Math.floor(fHeight / 2),
                xOffset: 0,
                yOffset: yOffset,
                xAdvance: fWidth,
                data: {},
                kerning: {}
            };
        }
    }
    FontUtils.ALIGN_TOP = 0;
    FontUtils.ALIGN_CENTER = 1;
    FontUtils.ALIGN_BOTTOM = 2;
    Helpers.FontUtils = FontUtils;
})(Helpers || (Helpers = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Tutorial;
        (function (Tutorial) {
            class CellConMark {
                constructor(manager, depth) {
                    this._manager = manager;
                    this._img = manager.scene.add.image(0, 0, "atlas_0", Tutorial.Manager.ASSET_PREFIX + "connection_0H").setVisible(false).setDepth(depth);
                    this._blinkEvent = null;
                }
                reset() {
                    this._img.visible = false;
                    if (this._blinkEvent != null) {
                        this._blinkEvent.remove(false);
                        this._blinkEvent = null;
                    }
                    return this;
                }
                show(cellA, cellB) {
                    let playfield = Gameplay.Manager.instance.playfield;
                    this._img.setPosition(playfield.panel.x + (Gameplay.Playfield.Cell.WIDTH / 2) + cellA.x - (cellA.x - cellB.x) / 2, playfield.panel.y + (Gameplay.Playfield.Cell.HEIGHT / 2) + cellA.y - (cellA.y - cellB.y) / 2);
                    let dir;
                    let flipX = false;
                    if (cellA.row == cellB.row) {
                        dir = "H";
                    }
                    else if (cellA.col == cellB.col) {
                        dir = "V";
                    }
                    else {
                        dir = "D";
                        flipX = (cellA.col < cellB.col && cellA.row < cellB.row) || (cellA.col > cellB.col && cellA.row > cellB.row);
                    }
                    this._img.setFrame(Tutorial.Manager.ASSET_PREFIX + "connection_" + (cellA.mistakeCnt == 0 ? 1 : 0) + dir)
                        .setFlipX(flipX)
                        .setVisible(true);
                    return this;
                }
                blink(repeats, onComppleteClb, clbCtx) {
                    this._blinkRemCnt = repeats;
                    this._blinkCompleteClb = onComppleteClb;
                    this._blinkClbCtx = clbCtx;
                    this._blinkEvent = this._manager.scene.time.addEvent({
                        callback: this.handleBlinkEvent,
                        callbackScope: this,
                        repeat: -1,
                        delay: 250,
                    });
                    return this;
                }
                handleBlinkEvent() {
                    this._img.visible = !this._img.visible;
                    if (this._blinkRemCnt >= 0) {
                        if (this._blinkRemCnt-- == 0) {
                            this._blinkCompleteClb.call(this._blinkClbCtx, this);
                            this.reset();
                        }
                    }
                }
            }
            Tutorial.CellConMark = CellConMark;
        })(Tutorial = Gameplay.Tutorial || (Gameplay.Tutorial = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Guide;
        (function (Guide_1) {
            class Guide {
                constructor(infoPanel, tapFx, playfield) {
                    this._playfield = playfield;
                    this._panel = infoPanel;
                    this._tapFx = tapFx;
                    this._stepId = -1;
                }
                get active() { return this._stepId >= 0; }
                get complete() { return this.active && this._stepId == this._level.guideSteps.length; }
                get stapId() { return this._stepId; }
                show(level) {
                    if (this.active)
                        return true;
                    let steps = level.guideSteps;
                    let save = Game.Global.save.getLevelSave(level);
                    let moveCnt = (save ? save.moveCnt : 0);
                    this._stepId = 0;
                    while (moveCnt > 0 && this._stepId < steps.length) {
                        let stepMoveCnt = 0;
                        steps[this._stepId].goals.forEach((goal) => {
                            stepMoveCnt += goal.goal;
                        });
                        if (moveCnt < stepMoveCnt)
                            break;
                        moveCnt -= stepMoveCnt;
                        this._stepId++;
                    }
                    if (this._stepId == steps.length) {
                        this._stepId = -1;
                        return false;
                    }
                    this._level = level;
                    this._playfield.events.on("showComplete", this.handlePfShowComplete, this);
                    this._playfield.events.on("goalComplete", this.handlePfGoalComplete, this);
                    this._panel.setText(steps[this._stepId].text);
                    this._panel.show();
                    return true;
                }
                hide() {
                    if (!this.active)
                        return;
                    this._stepId = -1;
                    this.reset();
                }
                restart() {
                    if (this.active) {
                        if (!this.complete)
                            this.setStepPartsDepthLevel(this._stepId, 0);
                        if (this._tapFxShowEvent) {
                            this._tapFxShowEvent.remove(false);
                            this._tapFxShowEvent = null;
                        }
                        if (this._darkLayerTween && this._darkLayerTween.isPlaying())
                            this._darkLayerTween.stop();
                        let step = this._level.guideSteps[(this._stepId = 0)];
                        this._panel.setText(step.text);
                        this._tapFx.reset();
                    }
                }
                reset() {
                    this._tapFx.reset();
                    if (this._tapFxShowEvent != null) {
                        this._tapFxShowEvent.remove(false);
                        this._tapFxShowEvent = null;
                    }
                    this._playfield.events.off("showComplete", this.handlePfShowComplete, this);
                    this._playfield.events.off("goalComplete", this.handlePfGoalComplete, this);
                }
                handlePfShowComplete() {
                    if (Gameplay.Manager.instance.state == 0) {
                        let step = this._level.guideSteps[this._stepId];
                        this._playfield.setCellGoals(step.goals);
                        this.setStepPartsDepthLevel(this._stepId, 1);
                        this._playfield.darkLayerVisible = true;
                        this._playfield.darkLayerAlpha = 0;
                        this._darkLayerTween = Gameplay.Manager.instance.mainScene.tweens.add({
                            targets: this._playfield,
                            darkLayerAlpha: 0.6,
                            duration: 500,
                        });
                        this.showTapFx(800);
                    }
                }
                handlePfGoalComplete() {
                    let steps = this._level.guideSteps;
                    if (this._stepId < steps.length) {
                        Game.Global.game.sound.playAudioSprite("sfx", "levelComplete");
                        this._playfield.resetMoveHistory();
                        if (++this._stepId < steps.length) {
                            this.setStepPartsDepthLevel(this._stepId - 1, 0);
                            let step = steps[this._stepId];
                            this._panel.setText(step.text);
                            this._playfield.setCellGoals(step.goals);
                            this.setStepPartsDepthLevel(this._stepId, 1);
                        }
                        else {
                            this.reset();
                            this._playfield.locked = true;
                            this._darkLayerTween = Gameplay.Manager.instance.mainScene.tweens.add({
                                targets: this._playfield,
                                darkLayerAlpha: 0,
                                duration: 500,
                                onComplete: () => {
                                    this.setStepPartsDepthLevel(this._stepId - 1, 0);
                                    this._playfield.darkLayerVisible = false;
                                    this._playfield.locked = false;
                                    this._stepId = -1;
                                }
                            });
                            Gameplay.Manager.instance.mistakeGuard.show();
                        }
                    }
                }
                setStepPartsDepthLevel(stepId, depthLevel) {
                    let step = this._level.guideSteps[stepId];
                    step.goals.forEach((goal) => {
                        this._playfield.getCellById(goal.cellId)
                            .setDepthLevel(depthLevel);
                    });
                    if (step.extraCells) {
                        step.extraCells.forEach((i) => {
                            this._playfield.getCellById(i).setDepthLevel(depthLevel);
                        });
                    }
                    if (step.counters) {
                        let lvlW = this._level.width;
                        step.counters.forEach((i) => {
                            if (i < lvlW)
                                this._playfield.getColTentCounter(i).setDepthLevel(depthLevel);
                            else
                                this._playfield.getRowTentCounter(i - lvlW).setDepthLevel(depthLevel);
                        });
                    }
                }
                showTapFx(delay) {
                    this._tapFxShowEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(delay, () => {
                        this._tapFxShowEvent = null;
                        let goals = this._level.guideSteps[this._stepId].goals;
                        for (let i = 0; i < goals.length; i++) {
                            let goal = goals[i];
                            let goalCell = this._playfield.getCellById(goal.cellId);
                            if (goalCell.state != goal.goal) {
                                this._tapFx.show(this._playfield.panel.x + goalCell.x + Gameplay.Playfield.Cell.WIDTH / 2, this._playfield.panel.y + goalCell.y + Gameplay.Playfield.Cell.HEIGHT / 2, () => { this.showTapFx(2500); }, this);
                                break;
                            }
                        }
                    }, undefined, this);
                }
            }
            Guide_1.Guide = Guide;
        })(Guide = Gameplay.Guide || (Gameplay.Guide = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Tutorial;
        (function (Tutorial) {
            class StepBase {
                constructor(manager) {
                    this._manager = manager;
                    this._playfield = manager.playfield;
                }
            }
            Tutorial.StepBase = StepBase;
            class Step1 extends StepBase {
                constructor(manager) {
                    super(manager);
                    this._stepData = [
                        { tapCol: 0, tapRow: 1, treeCol: 1, treeRow: 1 },
                        { tapCol: 2, tapRow: 2, treeCol: 2, treeRow: 1 },
                        { tapCol: 0, tapRow: 3, treeCol: 1, treeRow: 3 },
                    ];
                    this._timerEvent = null;
                }
                start(prevStepId) {
                    let save = Game.Save.UnfinishedLevel.fromArray(4, 4, [
                        0, 0, 0, 0,
                        0, 3, 3, 0,
                        0, 0, 0, 0,
                        0, 3, 0, 0
                    ]);
                    this._nextStepId = 0;
                    if (prevStepId < 0)
                        this._playfield.events.once("showComplete", this.buildTent, this);
                    this._playfield.show(Tutorial.Manager.levels[0], save, prevStepId < 0, 1, true, Tutorial.Manager.PLAYFIELD_TOP_PADDING, Tutorial.Manager.PLAYFIELD_BOT_PADDING);
                    if (prevStepId >= 0)
                        this.buildTent();
                }
                end() {
                    if (this._timerEvent != null) {
                        this._timerEvent.remove(false);
                        this._timerEvent = null;
                    }
                }
                buildTent() {
                    let stepData = this._stepData[this._nextStepId];
                    let cell = this._playfield.getCell(stepData.tapCol, stepData.tapRow);
                    this._manager.tapFx.show(this._playfield.panel.x + cell.x + (Gameplay.Playfield.Cell.WIDTH >> 1), this._playfield.panel.y + cell.y + (Gameplay.Playfield.Cell.HEIGHT >> 1), () => {
                        let delay;
                        cell.nextState();
                        if (cell.state == 2) {
                            cell.showHighligh(1);
                            this._playfield.getCell(stepData.treeCol, stepData.treeRow).showHighligh(1);
                            if (++this._nextStepId == this._stepData.length) {
                                this._timerEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(500, this.fillWithGrass, undefined, this);
                                return;
                            }
                            delay = 1000;
                        }
                        else {
                            delay = 500;
                        }
                        this._timerEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(delay, this.buildTent, undefined, this);
                    }, this);
                }
                fillWithGrass() {
                    this._playfield.events.once("grassFillComplete", () => {
                        this._timerEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(1000, this.restart, undefined, this);
                    }, this);
                    this._playfield.completeWithGrass(200);
                }
                restart() {
                    for (let i = 0; i < this._stepData.length; i++) {
                        let stepData = this._stepData[i];
                        if (stepData.treeCol != undefined) {
                            this._playfield.getCell(stepData.tapCol, stepData.tapRow).hideHighlight();
                            this._playfield.getCell(stepData.treeCol, stepData.treeRow).hideHighlight();
                        }
                    }
                    this._playfield.clear();
                    this._nextStepId = 0;
                    this._timerEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(1000, this.buildTent, undefined, this);
                }
            }
            Tutorial.Step1 = Step1;
        })(Tutorial = Gameplay.Tutorial || (Gameplay.Tutorial = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Tutorial;
        (function (Tutorial) {
            class Step2 extends Tutorial.StepBase {
                constructor(manager) {
                    super(manager);
                    this._blinkEvent = null;
                }
                start(prevStepId) {
                    let save = Game.Save.UnfinishedLevel.fromArray(4, 4, [
                        1, 1, 1, 1,
                        2, 3, 3, 1,
                        1, 1, 2, 1,
                        2, 3, 1, 1
                    ]);
                    if (prevStepId != 0) {
                        this._playfield.events.once("hideComplete", () => {
                            this._playfield.events.once("showComplete", this._start, this);
                            this._playfield.show(Tutorial.Manager.levels[0], save, true, 1, true, Tutorial.Manager.PLAYFIELD_TOP_PADDING, Tutorial.Manager.PLAYFIELD_BOT_PADDING);
                        }, this);
                        this._playfield.hide();
                    }
                    else {
                        this._playfield.show(Tutorial.Manager.levels[0], save, false, 1, true, Tutorial.Manager.PLAYFIELD_TOP_PADDING, Tutorial.Manager.PLAYFIELD_BOT_PADDING);
                        this._start();
                    }
                }
                end() {
                    if (this._blinkEvent != null) {
                        this._blinkEvent.remove(false);
                        this._blinkEvent = null;
                    }
                }
                _start() {
                    this._stepId = -1;
                    this.nextStep();
                    this._blinkCnt = 0;
                    this._blinkEvent = Gameplay.Manager.instance.mainScene.time.addEvent({
                        delay: 300,
                        loop: true,
                        callback: this.handleBlinkIntervalEvent,
                        callbackScope: this,
                    });
                }
                nextStep() {
                    let level = Tutorial.Manager.levels[0];
                    if (this._stepId >= 0) {
                        if (this._stepId < level.width) {
                            for (let i = 0; i < level.height; i++)
                                this._playfield.getCell(this._stepId, i).hideHighlight();
                        }
                        else {
                            for (let i = 0; i < level.width; i++)
                                this._playfield.getCell(i, this._stepId - level.width).hideHighlight();
                        }
                    }
                    if (++this._stepId == level.width + level.height)
                        this._stepId = 0;
                    if (this._stepId < level.width) {
                        for (let i = 0; i < level.height; i++)
                            this._playfield.getCell(this._stepId, i).showHighligh(1);
                    }
                    else {
                        for (let i = 0; i < level.width; i++)
                            this._playfield.getCell(i, this._stepId - level.width).showHighligh(1);
                    }
                }
                handleBlinkIntervalEvent() {
                    let level = Tutorial.Manager.levels[0];
                    let visible = (++this._blinkCnt & 1) == 0;
                    if (this._stepId < level.width) {
                        if (level.tentsPerCol[this._stepId] != 0) {
                            for (let row = 0; row < level.height; row++) {
                                let cell = this._playfield.getCell(this._stepId, row);
                                if (cell.state == 2)
                                    cell.setContentVisible(visible);
                            }
                        }
                        this._playfield.getColTentCounter(this._stepId).visible = visible;
                    }
                    else {
                        let row = this._stepId - level.width;
                        if (level.tentsPerRow[row] != 0) {
                            for (let col = 0; col < level.width; col++) {
                                let cell = this._playfield.getCell(col, row);
                                if (cell.state == 2)
                                    cell.setContentVisible(visible);
                            }
                        }
                        this._playfield.getRowTentCounter(row).visible = visible;
                    }
                    if (this._blinkCnt == 8) {
                        this._blinkCnt = 0;
                        this.nextStep();
                    }
                }
            }
            Tutorial.Step2 = Step2;
        })(Tutorial = Gameplay.Tutorial || (Gameplay.Tutorial = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Tutorial;
        (function (Tutorial) {
            class Step3 extends Tutorial.StepBase {
                constructor(manager) {
                    super(manager);
                    this._stepData = [
                        { tentCol: 0, tentRow: 1, treeCol: 1, treeRow: 1 },
                        { tentCol: 0, tentRow: 0, treeCol: 1, treeRow: 1 },
                        { tentCol: 1, tentRow: 0, treeCol: 1, treeRow: 1 },
                        { tentCol: 2, tentRow: 0, treeCol: 1, treeRow: 1 },
                        { tentCol: 2, tentRow: 1, treeCol: 1, treeRow: 1 },
                        { tentCol: 2, tentRow: 2, treeCol: 1, treeRow: 1 },
                        { tentCol: 1, tentRow: 2, treeCol: 1, treeRow: 1 },
                        { tentCol: 0, tentRow: 2, treeCol: 1, treeRow: 1 },
                    ];
                    this._timerEvent = null;
                }
                start(prevStepId) {
                    let save = Game.Save.UnfinishedLevel.fromArray(4, 4, [
                        1, 1, 1, 1,
                        1, 3, 1, 1,
                        1, 1, 1, 1,
                        1, 1, 1, 1,
                    ]);
                    this._playfield.events.once("hideComplete", () => {
                        this._playfield.events.once("showComplete", this._start, this);
                        this._playfield.show(Tutorial.Manager.levels[1], save, true, 1, false, Tutorial.Manager.PLAYFIELD_TOP_PADDING, Tutorial.Manager.PLAYFIELD_BOT_PADDING);
                    }, this);
                    this._playfield.hide();
                }
                end() {
                    if (this._timerEvent != null) {
                        this._timerEvent.remove(false);
                        this._timerEvent = null;
                    }
                }
                _start() {
                    this._stepId = 0;
                    this._timerEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(500, this.buildTent, undefined, this);
                }
                buildTent() {
                    this._timerEvent = null;
                    let stepData = this._stepData[this._stepId];
                    let tentCell = this._playfield.getCell(stepData.tentCol, stepData.tentRow);
                    this._manager.tapFx.show(this._playfield.panel.x + tentCell.x + (Gameplay.Playfield.Cell.WIDTH >> 1), this._playfield.panel.y + tentCell.y + (Gameplay.Playfield.Cell.HEIGHT >> 1), () => {
                        let treeCell = this._playfield.getCell(stepData.treeCol, stepData.treeRow);
                        tentCell.nextState();
                        if (tentCell.mistakeCnt == 0) {
                            tentCell.showHighligh(1);
                            treeCell.showHighligh(1);
                        }
                        this._manager.activateCellConMark().show(tentCell, treeCell).blink(8, this.undoLastMove, this);
                    }, this);
                }
                undoLastMove() {
                    this._playfield.undoMove();
                    let stepData = this._stepData[this._stepId];
                    if (stepData.tentCol == stepData.treeCol || stepData.tentRow == stepData.treeRow) {
                        this._playfield.getCell(stepData.tentCol, stepData.tentRow).hideHighlight();
                        this._playfield.getCell(stepData.treeCol, stepData.treeRow).hideHighlight();
                    }
                    if (++this._stepId == this._stepData.length)
                        this._stepId = 0;
                    this._timerEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(250, this.buildTent, undefined, this);
                }
            }
            Tutorial.Step3 = Step3;
        })(Tutorial = Gameplay.Tutorial || (Gameplay.Tutorial = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Tutorial;
        (function (Tutorial) {
            class Step4 extends Tutorial.StepBase {
                constructor(manager) {
                    super(manager);
                    this._stepData = [
                        { tent1Col: 2, tent1Row: 1, tent2Col: 1, tent2Row: 1 },
                        { tent1Col: 0, tent1Row: 2, tent2Col: 1, tent2Row: 1 },
                        { tent1Col: 2, tent1Row: 2, tent2Col: 1, tent2Row: 1 },
                    ];
                    this._timerEvent = null;
                    this._correctSteps = [];
                }
                start(prevStepId) {
                    let save = Game.Save.UnfinishedLevel.fromArray(4, 4, [
                        1, 3, 1, 1,
                        1, 2, 1, 3,
                        1, 1, 1, 1,
                        3, 1, 3, 1,
                    ]);
                    this._playfield.events.once("hideComplete", () => {
                        this._playfield.events.once("showComplete", this._start, this);
                        this._playfield.show(Tutorial.Manager.levels[2], save, true, 1, false, Tutorial.Manager.PLAYFIELD_TOP_PADDING, Tutorial.Manager.PLAYFIELD_BOT_PADDING);
                    }, this);
                    this._playfield.hide();
                }
                end() {
                    if (this._timerEvent != null) {
                        this._timerEvent.remove(false);
                        this._timerEvent = null;
                    }
                }
                _start() {
                    this._playfield.getCell(1, 0).showHighligh(1);
                    this._playfield.getCell(1, 1).showHighligh(1);
                    this._stepId = 0;
                    this._correctSteps.length = 0;
                    this._timerEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(500, this.buildTent, undefined, this);
                }
                buildTent() {
                    this._timerEvent = null;
                    let stepData = this._stepData[this._stepId];
                    let tent1Cell = this._playfield.getCell(stepData.tent1Col, stepData.tent1Row);
                    this._manager.tapFx.show(this._playfield.panel.x + tent1Cell.x + (Gameplay.Playfield.Cell.WIDTH >> 1), this._playfield.panel.y + tent1Cell.y + (Gameplay.Playfield.Cell.HEIGHT >> 1), () => {
                        tent1Cell.nextState();
                        this._manager.activateCellConMark().show(tent1Cell, this._playfield.getCell(stepData.tent2Col, stepData.tent2Row)).blink(8, this.undoLastMove, this);
                    }, this);
                }
                undoLastMove() {
                    this._playfield.undoMove();
                    if (++this._stepId == this._stepData.length)
                        this._stepId = 0;
                    this._timerEvent = Gameplay.Manager.instance.mainScene.time.delayedCall(250, this.buildTent, undefined, this);
                }
            }
            Tutorial.Step4 = Step4;
        })(Tutorial = Gameplay.Tutorial || (Gameplay.Tutorial = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Tutorial;
        (function (Tutorial) {
            class TapFx {
                constructor(scene, depth) {
                    this._scene = scene;
                    this._group = new Controls.Group.Group(true)
                        .setVisible(false)
                        .setDepth(depth);
                    this._group.cameraFilter = ~Gameplay.Manager.instance.playfield.camera.id;
                    this._circle = this._group.add(scene.add.image(0, 0, "atlas_0", TapFx.ASSET_PREFIX + "tapCircle").setVisible(false), 0, 0, 0, false);
                    this._hand = this._group.add(scene.add.sprite(0, 0, "atlas_0", TapFx.ASSET_PREFIX + "hand_0").setDisplayOrigin(14, 62).setVisible(false), 0, 0, 0, false);
                    if (!scene.anims.exists(TapFx.HAND_TAP_ANIM_KEY)) {
                        scene.anims.create({
                            key: TapFx.HAND_TAP_ANIM_KEY,
                            frames: scene.anims.generateFrameNames("atlas_0", { prefix: TapFx.ASSET_PREFIX + "hand_", start: 0, end: 2 }),
                            frameRate: 5,
                        });
                    }
                    this._timelineCfg = {
                        tweens: [
                            {
                                targets: this._hand,
                                offsetX: 0,
                                offsetY: 0,
                                alpha: 1,
                                duration: 400,
                                ease: Phaser.Math.Easing.Cubic.Out,
                            },
                            {
                                onStart: () => {
                                    this._circle.visible = true;
                                    this._clbFnc.call(this._clbCtx);
                                },
                                onComplete: () => { this._circle.visible = false; },
                                alpha: { value: 0, ease: Phaser.Math.Easing.Cubic.In },
                                targets: this._circle.gameObject,
                                scaleX: 1,
                                scaleY: 1,
                                duration: 400,
                                ease: Phaser.Math.Easing.Cubic.Out,
                            },
                            {
                                targets: this._hand,
                                alpha: 0,
                                duration: 400,
                                ease: Phaser.Math.Easing.Cubic.Out,
                                onComplete: () => { this._hand.visible = false; this._timeline = null; }
                            }
                        ]
                    };
                    this._timeline = null;
                }
                get scene() { return this._scene; }
                reset() {
                    this._group.setVisible(false);
                    if (this._timeline != null) {
                        this._timeline.stop();
                        this._timeline = null;
                    }
                }
                show(x, y, clbFnc, clbCtx) {
                    this._clbFnc = clbFnc;
                    this._clbCtx = clbCtx;
                    this._group.setPosition(x, y)
                        .setVisible(true);
                    this._hand.setOffset(20, 20)
                        .setAlpha(0)
                        .setVisible(true);
                    this._circle.setVisible(false);
                    this._circle.gameObject.setScale(0.1).setAlpha(0.5);
                    if (this._timeline && this._timeline.isPlaying)
                        this._timeline.stop();
                    this._hand.gameObject.play(TapFx.HAND_TAP_ANIM_KEY);
                    this._timeline = this._scene.tweens.timeline(this._timelineCfg);
                }
            }
            TapFx.HAND_TAP_ANIM_KEY = "handTap";
            TapFx.ASSET_PREFIX = "tutorial/";
            Tutorial.TapFx = TapFx;
        })(Tutorial = Gameplay.Tutorial || (Gameplay.Tutorial = {}));
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
                        if (data && data.socialData && data.socialData.player)
                            Gamee._player = data.socialData.player;
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
        static get player() { return Gamee._player; }
        static get friends() { return Gamee._friends; }
        static requestSocial(clbFnc, clbCtx, entryCnt = 10) {
            if (Gamee._initState == 1) {
                window.gamee.requestSocial(function (error, data) {
                    Gamee._player = null;
                    Gamee._friends = null;
                    if (error == undefined || error == null) {
                        if (data && data.socialData && data.socialData.friends)
                            Gamee._friends = data.socialData.friends;
                        if (data && data.socialData && data.socialData.player)
                            Gamee._player = data.socialData.player;
                    }
                    clbFnc.call(clbCtx);
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
        static requestPlayerData(cbFnc, cbCtx) {
            if (Gamee._initState == 1) {
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
        }
        static logEvent(name, value = "") {
            if (Gamee._ready) {
                window.gamee.logEvent(name, value);
            }
        }
        static gameOver(replayData, saveData) {
            if (Gamee._ready) {
                let replay;
                if (replayData != undefined)
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
                if (data && data.purchaseStatus) {
                    res = true;
                    if (data.coinsLeft && Gamee.player != null)
                        Gamee.player.coins = data.coinsLeft;
                }
                cbFnc.call(cbCtx, res);
            });
        }
    }
    Gamee._events = new Phaser.Events.EventEmitter();
    Gamee._initState = 0;
    Gamee._ready = false;
    Gamee._player = null;
    Gamee._friends = null;
    Gamee._score = 0;
    Gamee._adState = 3;
    Gamee2.Gamee = Gamee;
})(Gamee2 || (Gamee2 = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Level;
        (function (Level) {
            class Data {
                constructor(uid, tentsPerCol, tentsPerRow, treeCells, tentCells = null, flags = 0, guideSteps) {
                    this._id = -1;
                    this._uid = uid;
                    this._tentsPerCol = tentsPerCol;
                    this._tentsPerRow = tentsPerRow;
                    this._treeCells = treeCells;
                    this._tentCells = tentCells;
                    this._flags = flags;
                    this._moveCnt = 0;
                    this._guideSteps = guideSteps;
                    if (guideSteps)
                        this._flags |= 2;
                    this._fFriend = null;
                    this._lFriend = null;
                    this._friendCnt = 0;
                }
                get uid() { return this._uid; }
                get id() { return this._id; }
                get group() { return (this._id >= 0 ? Game.Global.levelGroups[Math.floor(this._id / Level.Group.LEVELS_PER_GROUP)] : null); }
                get guided() { return (this._flags & 2) != 0; }
                get tutorialLevel() { return (this._flags & 1) != 0; }
                get bonusLevel() { return (this._id >= 0 && ((this._id + 1) % Level.Group.LEVELS_PER_GROUP) == 0); }
                get mistakeGuard() { return (this._flags & 4) != 0; }
                get tentsPerCol() { return this._tentsPerCol; }
                get tentsPerRow() { return this._tentsPerRow; }
                get treeCells() { return this._treeCells; }
                get tentCells() { return this._tentCells; }
                get width() { return this._tentsPerCol.length; }
                get height() { return this._tentsPerRow.length; }
                get unlocked() {
                    if (this._id < 0)
                        return true;
                    let group = this.group;
                    if (!group.unlocked)
                        return false;
                    return (!this.bonusLevel || group.bonusLevelUnlocked);
                }
                get complete() { return (this._moveCnt > 0); }
                get partiallyComplete() { return (this._flags & 8) != 0; }
                get moveCnt() { return this._moveCnt; }
                get reqMoveCnt() {
                    let tentCnt = 0;
                    this._tentsPerCol.forEach((cnt) => {
                        tentCnt += cnt;
                    });
                    return (this.width * this.height - this._treeCells.length) + tentCnt;
                }
                get rating() { return Data.getRating(this, this._moveCnt); }
                get friendCnt() { return this._friendCnt; }
                get guideSteps() { return this._guideSteps; }
                static getScore(level, moveCnt, time) {
                    let maxScoreMoveCnt = level.reqMoveCnt;
                    if (moveCnt < maxScoreMoveCnt)
                        return 0;
                    let score;
                    if (Game.Global.gameContext == "normal") {
                        let maxScore = 1000 * (level.group.id + 1);
                        let minScore = Math.floor(maxScore / 10);
                        let minScoreMoveCnt = Math.ceil(maxScoreMoveCnt * 1.2);
                        score = maxScore - Math.round((maxScore - minScore) * Math.min(1, (moveCnt - maxScoreMoveCnt) / (minScoreMoveCnt - maxScoreMoveCnt)));
                        if (level.bonusLevel)
                            score *= 2;
                    }
                    else {
                        let minScoreMoveCnt = maxScoreMoveCnt * 2;
                        score = 50000 - Math.min(1, (moveCnt - maxScoreMoveCnt) / (minScoreMoveCnt - maxScoreMoveCnt)) * 50000;
                        score = Math.round(score + Math.max(0, (50000 - 50000 * (time / (4 * 60 * 1000)))));
                    }
                    return score;
                }
                static getRating(level, moveCnt) {
                    if (moveCnt <= 0)
                        return 0;
                    let reqMoveCnt = level.reqMoveCnt;
                    if (moveCnt <= Math.ceil(reqMoveCnt * 1.01))
                        return 3;
                    if (moveCnt < Math.ceil(reqMoveCnt * 1.2))
                        return 2;
                    return 1;
                }
                setId(id) {
                    this._id = id;
                }
                addFriend(friend) {
                    if (friend.highestLevel == this)
                        return;
                    this._lFriend = new Collections.Node(friend).addToChain(this._lFriend);
                    if (this._fFriend == null)
                        this._fFriend = this._lFriend;
                    this._friendCnt++;
                }
                removeFriend(friend) {
                    if (friend.highestLevel != this)
                        return;
                    let node = this._fFriend;
                    while (node.data != friend)
                        node = node.next;
                    if (this._fFriend == node)
                        this._fFriend = node.next;
                    if (this._lFriend == node)
                        this._lFriend = node.prev;
                    node.removeFromChain();
                    this._friendCnt--;
                }
                getFriend(friendId) {
                    if (friendId >= this._friendCnt)
                        return undefined;
                    let node = this._fFriend;
                    while (friendId-- != 0)
                        node = node.next;
                    return node.data;
                }
                setResult(moveCnt, time) {
                    let score;
                    this.deleteSave();
                    if (Game.Global.gameContext == "normal") {
                        let prevMoveCnt = this._moveCnt;
                        if (!this.complete) {
                            this._moveCnt = moveCnt;
                            this.group.incCompleteLevelCnt();
                        }
                        else if (this._moveCnt > moveCnt) {
                            this._moveCnt = moveCnt;
                        }
                        else {
                            return 0;
                        }
                        score = Data.getScore(this, moveCnt, 0) - Data.getScore(this, prevMoveCnt, 0);
                    }
                    else {
                        this._moveCnt = moveCnt;
                        score = Data.getScore(this, moveCnt, time);
                    }
                    Game.Global.save.setLevelResult(this, score);
                    return score;
                }
                deleteSave() {
                    if (this.partiallyComplete) {
                        this._flags &= ~8;
                        Game.Global.save.deleteLevelSave(this);
                    }
                }
                save(playfield) {
                    this._flags |= 8;
                    Game.Global.save.saveUnfinishedLevel(playfield);
                }
                initSetResult(moveCnt) {
                    if (moveCnt > 0) {
                        if (Game.Global.gameContext == "normal") {
                            this._moveCnt = moveCnt;
                            this.group.incCompleteLevelCnt();
                        }
                        else {
                            this._moveCnt = moveCnt;
                        }
                    }
                }
                initSetPartiallyComplete() {
                    this._flags |= 8;
                }
            }
            Level.Data = Data;
        })(Level = Gameplay.Level || (Gameplay.Level = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Level;
        (function (Level) {
            class Group {
                constructor(id, levels, difficulty = 0) {
                    this._id = id;
                    this._difficulty = difficulty;
                    this._pfWidth = levels[0].width;
                    this._pfHeight = levels[0].height;
                    this._levels = levels;
                    this._compLvlCnt = 0;
                    let lvlId = 0;
                    levels.forEach((level) => { level.setId(id * Group.LEVELS_PER_GROUP + lvlId++); });
                }
                get id() { return this._id; }
                get difficulty() { return this._difficulty; }
                get pfWidth() { return this._pfWidth; }
                get pfHeight() { return this._pfHeight; }
                get levels() { return this._levels; }
                get unlocked() { return this._id < Game.Global.save.unlockedLvlGroupCnt; }
                get bonusLevelUnlocked() { return this._compLvlCnt >= Group.LEVELS_PER_GROUP - 1 && Game.Global.save.newBonusLevelId != this._levels[Group.LEVELS_PER_GROUP - 1].id; }
                get completeLevelCnt() { return this._compLvlCnt; }
                incCompleteLevelCnt() {
                    if (++this._compLvlCnt == Group.LEVELS_PER_GROUP - 1) {
                        if (!Game.Global.save.loading) {
                            Game.Global.save.newBonusLevelId = this._levels[Group.LEVELS_PER_GROUP - 1].id;
                            if (Game.Global.save.unlockedLvlGroupCnt < Game.Global.levelGroups.length)
                                Game.Global.levelsTimeLock.start(Group.UNLOCK_DELAY);
                        }
                    }
                }
            }
            Group.LEVELS_PER_GROUP = 5;
            Group.UNLOCK_DELAY = 12 * 60 * 60 * 1000;
            Level.Group = Group;
        })(Level = Gameplay.Level || (Gameplay.Level = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Level;
        (function (Level) {
            class TimeLock {
                constructor() {
                    this._groupId = 0;
                }
                get unlockTime() { return this._unlockTime; }
                get groupId() { return this._groupId; }
                get active() { return this._groupId > 0; }
                get remTime() { return (this.active ? this._unlockTime - Date.now() : 0); }
                init(unlockTime, groupId) {
                    this._unlockTime = unlockTime;
                    this._groupId = groupId;
                }
                start(delay) {
                    this._unlockTime = Date.now() + delay;
                    this._groupId = Game.Global.save.unlockedLvlGroupCnt;
                    Game.Global.save.setLvlTimeLock();
                }
                reset() {
                    this._groupId = 0;
                }
            }
            Level.TimeLock = TimeLock;
        })(Level = Gameplay.Level || (Gameplay.Level = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        class MainScene extends Phaser.Scene {
            create(level) {
                this._manager = new Gameplay.Manager(this);
                this.events.on(Phaser.Scenes.Events.WAKE, this.handleSceneWake, this);
                this.events.on(Phaser.Scenes.Events.SLEEP, this.handleSceneSleep, this);
                this.handleSceneWake(this.sys, level);
            }
            update(time, delta) {
                if (!Game.Global.gameeGameStarted && Gamee2.Gamee.initialized) {
                    this.sys.pause();
                    Gamee2.Gamee.gameReady();
                }
                else {
                    this._manager.update(delta);
                }
            }
            handleSceneWake(sys, level) {
                if (!level)
                    return;
                this._manager.start(level);
                Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResolutionChange, this);
                this.handleResolutionChange(Game.Global.game.scale.width, Game.Global.game.scale.height);
                if (Gamee2.Gamee.initialized) {
                    Gamee2.Gamee.events.on("start", this.handleGameeStart, this);
                    Gamee2.Gamee.events.on("pause", this.handleGameePause, this);
                    Gamee2.Gamee.events.on("resume", this.handleGameeResume, this);
                }
            }
            handleSceneSleep(sys, data) {
                if (data && data.sleep) {
                    Game.Global.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResolutionChange, this);
                    if (Gamee2.Gamee.initialized) {
                        Gamee2.Gamee.events.off("start", this.handleGameeStart, this);
                        Gamee2.Gamee.events.off("pause", this.handleGameePause, this);
                        Gamee2.Gamee.events.off("resume", this.handleGameeResume, this);
                    }
                    this.tweens.killAll();
                    this.time.removeAllEvents();
                }
            }
            handleGameeStart() {
                if (!Game.Global.gameeGameStarted) {
                    Game.Global.gameeGameStarted = true;
                    this.sys.resume();
                }
                else {
                    if (Game.Global.gameContext == "normal") {
                        if (Game.Global.save.showTutorial)
                            return;
                        this._manager.end();
                        Gamee2.Gamee.score = Game.Global.save.totalScore;
                    }
                    else {
                        this.sys.resume();
                        if (this._manager.state == 0) {
                            this._manager.playfield.hide();
                        }
                        else {
                            this.tweens.killAll();
                            this.time.removeAllEvents();
                            this._manager.start(Game.Global.getRndBattleLevel());
                        }
                    }
                }
            }
            handleGameePause() {
                this.sys.pause();
            }
            handleGameeResume() {
                this.sys.resume();
            }
            handleResolutionChange(w, h) {
                this._manager.handleResolutionChange(w, h);
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
            constructor(mainScene) {
                Manager._instance = this;
                this._mainScene = mainScene;
                let bg = mainScene.add.image(0, 0, "atlas_0", Manager.ASSET_PREFIX + "bg")
                    .setOrigin(0, 0)
                    .setScale(2)
                    .setScrollFactor(0, 1);
                bg.cameraFilter = ~mainScene.cameras.main.id;
                this._playfield = new Gameplay.Playfield.Manager(this, Game.Global.scale.maxWidth * 10, Game.Global.scale.maxHeight * 10);
                this._playfield.events.on("levelComplete", this.handleLevelComplete, this);
                this._playfield.events.on("hideComplete", this.handlePfHideComplete, this);
                this._playfield.events.on("moveCntChange", (moveCnt) => { this._lblSteps.setText(moveCnt.toString()); }, this);
                this._uiCamera = mainScene.cameras.add(0, 0, 100, 100, false, "ui");
                this._uiCamera.setScroll(Manager.UI_LAYER_X, Manager.UI_LAYER_Y);
                let uiCamFilter = ~this._uiCamera.id;
                this._lblSteps = mainScene.add.bitmapText(Manager.UI_LAYER_X + 620, Manager.UI_LAYER_Y + 26, "fntDefaultBigC0", "", 60).setOrigin(1, 0);
                this._lblSteps.cameraFilter = uiCamFilter;
                this._lblStepsTitle = mainScene.add.bitmapText(Manager.UI_LAYER_X + 620, Manager.UI_LAYER_Y + 78, "fntDefault", "STEPS", 38).setOrigin(1, 0).setScale(0.6);
                this._lblStepsTitle.cameraFilter = uiCamFilter;
                if (Game.Global.gameContext == "battle") {
                    this._lblTime = mainScene.add.bitmapText(Manager.UI_LAYER_X + 620, Manager.UI_LAYER_Y + 26, "fntDefaultBigC0", "00:00", 60).setOrigin(1, 0);
                    this._lblTime.cameraFilter = uiCamFilter;
                    this._lblTimeTitle = mainScene.add.bitmapText(Manager.UI_LAYER_X + 620, Manager.UI_LAYER_Y + 78, "fntDefault", "TIME", 38).setOrigin(1, 0).setScale(0.6);
                    this._lblTimeTitle.cameraFilter = uiCamFilter;
                    this._lblSteps.x = Manager.UI_LAYER_X + 380;
                    this._lblStepsTitle.x = Manager.UI_LAYER_X + 380;
                }
                else {
                    this._levelInfo = mainScene.add.bitmapText(Manager.UI_LAYER_X + 24, Manager.UI_LAYER_Y + 116, "fntDefault", "", 38).setScale(0.6);
                    this._levelInfo.cameraFilter = uiCamFilter;
                }
                let btnId = 0;
                this._ctrlButtons = [];
                if (Game.Global.gameContext == "normal") {
                    this._ctrlButtons.push(new Controls.Buttons.BasicButton(mainScene, 0, 0, "atlas_0", Manager.ASSET_PREFIX + "btnExit_").setId(0));
                    this._ctrlButtons.push(new Controls.Buttons.BasicButton(mainScene, 0, 0, "atlas_0", Manager.ASSET_PREFIX + "btnStepBack_").setId(1));
                }
                this._ctrlButtons.push(new Controls.Buttons.BasicButton(mainScene, 0, 0, "atlas_0", Manager.ASSET_PREFIX + "btnReset_").setId(2));
                this._ctrlButtons.push(new Controls.Buttons.BasicButton(mainScene, 0, 0, "atlas_0", Manager.ASSET_PREFIX + "btnHelp_").setId(3));
                this._ctrlButtonsLayer = new Controls.Group.Group();
                this._ctrlButtonsLayer.setPosition(Manager.UI_LAYER_X + 20, Manager.UI_LAYER_Y + 20);
                this._ctrlButtonsLayer.cameraFilter = uiCamFilter;
                this._ctrlButtons.forEach((btn) => {
                    this._ctrlButtonsLayer.add(btn, btnId++ * 104, 0);
                }, this);
                mainScene.events.on("btn_click", this.handleBtnClick, this);
                if (Game.Global.gameContext == "normal") {
                    this._resPanelNormal = new Gameplay.Results.PanelNormal(mainScene);
                }
                else {
                    this._resPanelBattle = new Gameplay.Results.PanelBattle(mainScene);
                }
                this._tapFx = new Gameplay.Tutorial.TapFx(mainScene, 200);
                this._tutorial = new Gameplay.Tutorial.Manager(mainScene, this._tapFx, this._playfield);
                this._levelGuide = null;
                this._mistakeGuard = null;
                this._infoBox = null;
            }
            static get instance() { return Manager._instance; }
            get mainScene() { return this._mainScene; }
            get state() { return this._state; }
            get level() { return this._level; }
            get uiCamera() { return this._uiCamera; }
            get playfield() { return this._playfield; }
            get mistakeGuard() { return this._mistakeGuard; }
            get levelTime() { return this._levelTime; }
            start(level) {
                this._level = level;
                this._mainScene.cameras.main.scrollX = 0;
                this._lblSteps.visible = this._lblStepsTitle.visible = true;
                this._ctrlButtonsLayer.visible = true;
                if (Game.Global.gameContext == "normal") {
                    this._levelInfo.setText("LEVEL " + (level.id + 1) + " / " + level.width + "X" + level.height);
                    if (level.guided || level.mistakeGuard) {
                        if (!this._infoBox)
                            this._infoBox = new Gameplay.InfoBox();
                    }
                    else if (this._infoBox) {
                        this._infoBox.reset();
                    }
                    if (level.guided) {
                        if (!this._levelGuide)
                            this._levelGuide = new Gameplay.Guide.Guide(this._infoBox, this._tapFx, this._playfield);
                    }
                    if (this._levelGuide)
                        this._levelGuide.hide();
                    if (level.mistakeGuard) {
                        if (!this._mistakeGuard)
                            this._mistakeGuard = new Gameplay.MistakeGuard(this._infoBox, this._playfield);
                    }
                    if (this._mistakeGuard)
                        this._mistakeGuard.hide();
                    this._resPanelNormal.reset();
                    if (Game.Global.save.showTutorial) {
                        this.showTutorial(false);
                        return;
                    }
                    if (level.guided)
                        this._levelGuide.show(level);
                    if (level.mistakeGuard && (!level.guided || !this._levelGuide.active))
                        this._mistakeGuard.show();
                }
                else {
                    this._levelTime = 0;
                    this._lblTimeTime = 0;
                    this.updateTimeLbl();
                    this._resPanelBattle.reset();
                }
                this._tutorial.reset();
                this._state = 0;
                this.showPlayfield(true);
            }
            end() {
                if (this._state == 0) {
                    this._playfield.save();
                    Game.Global.save.save();
                }
                this._mainScene.scene.run("levelSelect", { mode: 1 });
                this._mainScene.sys.sleep(Game.Global.sceneSleepPars);
            }
            update(delta) {
                if (Game.Global.gameContext == "battle") {
                    if (this._state == 0) {
                        this._levelTime += delta;
                        let time = Math.floor(this._levelTime / 1000);
                        if (time != this._lblTimeTime) {
                            this._lblTimeTime = time;
                            this.updateTimeLbl();
                        }
                    }
                }
            }
            handleResolutionChange(w, h) {
                this._mainScene.cameras.main.setSize(w, h)
                    .scrollY = (Game.Global.scale.maxHeight - h) >> 1;
                this._uiCamera.setSize(w, h);
                this._playfield.updatePosition();
                if (Game.Global.gameContext == "normal") {
                    this._resPanelNormal.handleResolutionChange();
                }
                else {
                    this._resPanelBattle.handleResolutionChange();
                }
                this._tutorial.handleResolutionChange();
                if (this._infoBox != null)
                    this._infoBox.updatePosition();
            }
            updateTimeLbl() {
                let time = this._lblTimeTime;
                let timeTxt;
                let i = Math.floor(time / 60);
                if (i < 10) {
                    timeTxt = "0" + i;
                }
                else {
                    timeTxt = (i < 99 ? i : 99).toString();
                }
                timeTxt += ":";
                i = time % 60;
                if (i < 10)
                    timeTxt += "0";
                timeTxt += i;
                this._lblTime.text = timeTxt;
            }
            showTutorial(smoothly = true) {
                this._state = 2;
                if (smoothly) {
                    this._playfield.save();
                    this._tutorial.show(0);
                    this._mainScene.add.tween({
                        targets: this._uiCamera,
                        scrollX: Game.Global.scale.maxWidth,
                        ease: Phaser.Math.Easing.Cubic.InOut,
                        duration: 750
                    });
                    this._mainScene.add.tween({
                        targets: this._playfield.camera,
                        x: -Game.Global.scale.maxWidth,
                        ease: Phaser.Math.Easing.Cubic.InOut,
                        duration: 750,
                        onComplete: () => {
                            this._tutorial.show(1);
                            this._playfield.camera.x = 0;
                        },
                    });
                }
                else {
                    this._uiCamera.scrollX = Game.Global.scale.maxWidth;
                    this._tutorial.show(2);
                }
            }
            showPlayfield(smoothly) {
                let pfBotPadding = Manager.PLAYFIELD_BOT_PADDING;
                if (this._level.guided || this._level.mistakeGuard)
                    pfBotPadding = 200;
                this._playfield.show(this._level, Game.Global.save.getLevelSave(this._level), smoothly, 0, true, Manager.PLAYFIELD_TOP_PADDING, pfBotPadding);
                this._lblSteps.setText(this._playfield.moveCnt.toString());
            }
            handleBtnClick(button) {
                if (this._state == 0 && this._playfield.ready) {
                    this._mainScene.sound.playAudioSprite("sfx", "menuClick");
                    switch (button.id) {
                        case 0: {
                            this.end();
                            break;
                        }
                        case 1: {
                            this._playfield.undoMove();
                            break;
                        }
                        case 2: {
                            this._playfield.hide();
                            break;
                        }
                        case 3: {
                            if (this._level.guided && this._levelGuide.active)
                                return;
                            this.showTutorial();
                            break;
                        }
                    }
                }
            }
            handleLevelComplete() {
                this._state = 1;
                this._mainScene.sound.playAudioSprite("sfx", "levelComplete");
                if (Gamee2.Gamee.initialized) {
                    if (Game.Global.gameContext == "normal") {
                        Gamee2.Gamee.logEvent("LEVEL_COMPLETE" + (this._level.id + 1).toString(), this._level.rating.toString());
                    }
                    else {
                        Gamee2.Gamee.logEvent("BATTLE_COMPLETE", this.playfield.score.toString());
                    }
                }
                if (this._infoBox && this._infoBox.visible)
                    this._infoBox.hide(true);
                this._mainScene.time.delayedCall(1000, this._playfield.hide, undefined, this._playfield);
            }
            handleLevelResComplete() {
                if (Gamee2.Gamee.initialized) {
                    Gamee2.Gamee.gameOver(null, Game.Global.save.getSaveData());
                    Game.Global.save.resetSaveRequest();
                }
                else {
                    this._mainScene.scene.run("levelSelect", { mode: 1 });
                    this._mainScene.sys.sleep(Game.Global.sceneSleepPars);
                }
            }
            handlePfHideComplete() {
                if (this._state == 1) {
                    if (Game.Global.gameContext == "normal") {
                        this._resPanelNormal.show(this._playfield.level, this._playfield.moveCnt, this.handleLevelResComplete, this);
                    }
                    else {
                        this._resPanelBattle.show(this._playfield.moveCnt, this._level.reqMoveCnt, this._lblTime.text, this._playfield.score, this.handleLevelResComplete, this);
                    }
                    if (Gamee2.Gamee.initialized)
                        Gamee2.Gamee.score += this._playfield.score;
                }
                else if (this._state == 0) {
                    this._level.deleteSave();
                    if (Game.Global.gameContext == "normal") {
                        if (this._level.guided) {
                            if (this._levelGuide.active)
                                this._levelGuide.restart();
                            else
                                this._levelGuide.show(this._level);
                        }
                        this.showPlayfield(true);
                    }
                    else {
                        this.start(Game.Global.getRndBattleLevel());
                    }
                }
                else if (this._state == 2 && this._tutorial.complete) {
                    this._state = 0;
                    if (Game.Global.save.showTutorial) {
                        Game.Global.save.showTutorial = false;
                        Game.Global.save.save();
                        Gamee2.Gamee.logEvent("TUTORIAL_COMPLETE");
                        if (this._level.guided)
                            this._levelGuide.show(this._level);
                    }
                    this.showPlayfield(false);
                    this._mainScene.add.tween({
                        targets: this._uiCamera,
                        scrollX: 0,
                        ease: Phaser.Math.Easing.Cubic.InOut,
                        duration: 750
                    });
                    this._playfield.camera.x = -Game.Global.scale.maxWidth;
                    this._mainScene.add.tween({
                        targets: this._playfield.camera,
                        x: 0,
                        ease: Phaser.Math.Easing.Cubic.InOut,
                        duration: 750,
                        onComplete: () => {
                            this._tutorial.reset();
                        }
                    });
                }
            }
        }
        Manager.ASSET_PREFIX = "gameplay/";
        Manager.PLAYFIELD_TOP_PADDING = 150;
        Manager.PLAYFIELD_BOT_PADDING = 0;
        Manager.UI_LAYER_X = 0;
        Manager.UI_LAYER_Y = 2000;
        Gameplay.Manager = Manager;
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Playfield;
        (function (Playfield) {
            class CellContent {
                constructor(playfield) {
                    let sprite = playfield.gameplay.mainScene.add.sprite(0, 0, "atlas_0", Playfield.Manager.ASSET_PREFIX + "tree/show_0001")
                        .setOrigin(0, 0)
                        .setVisible(false);
                    sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.handleAnimComplete, this);
                    this._spriteItem = playfield.panel.add(sprite, 0, 0, 0, false);
                    this._state = 4;
                }
                get cell() { return this._cell; }
                get type() { return this._type; }
                get visible() { return this._spriteItem.visible; }
                set visible(visible) { this._spriteItem.visible = visible; }
                reset() {
                    if (this._state != 4) {
                        this._state = 4;
                        this._spriteItem.setVisible(false);
                        this._spriteItem.gameObject.anims.stop();
                        this._cell.handleContentRelease();
                        this._cell = null;
                    }
                }
                show(cell, type, smoothly = true) {
                    this._cell = cell;
                    this._type = type;
                    let origin = CellContent.TYPE_ORIGIN[0][type];
                    this._spriteItem.setOffset(cell.x + origin.x, cell.y + origin.y)
                        .setVisible(true)
                        .setDepth(cell.baseDisplayDepth + 40);
                    let sprite = this._spriteItem.gameObject;
                    if (smoothly) {
                        this._state = 2;
                        sprite.anims.play("content_" + type + "_0");
                    }
                    else {
                        this._state = 4;
                        this.playIdleAnim();
                        if (type == 0)
                            sprite.anims.stop();
                        this._state = 0;
                    }
                }
                hide() {
                    if (this._state == 3)
                        return;
                    let origin = CellContent.TYPE_ORIGIN[0][this._type];
                    this._spriteItem.gameObject.anims.playReverse("content_" + this._type + "_0", false);
                    this._spriteItem.setOffset(this._cell.x + origin.x, this._cell.y + origin.y);
                    this._state = 3;
                }
                handleCellDisplayDepthChange(baseDepth) {
                    this._spriteItem.setDepth(baseDepth + 40);
                }
                playIdleAnim() {
                    let sprite = this._spriteItem.gameObject;
                    if (sprite.anims.isPlaying)
                        return;
                    let origin = CellContent.TYPE_ORIGIN[1][this._type];
                    sprite.play("content_" + this._type + "_1");
                    this._spriteItem.setOffset(this._cell.x + origin.x, this._cell.y + origin.y);
                }
                handleAnimComplete() {
                    if (this._state == 2) {
                        if (this._type == 1)
                            this.playIdleAnim();
                        this._state = 0;
                    }
                    else if (this._state == 3) {
                        this.reset();
                    }
                }
            }
            CellContent.TYPE_ORIGIN = [
                [
                    new Phaser.Geom.Point(-6, -38),
                    new Phaser.Geom.Point(12, -17),
                ],
                [
                    new Phaser.Geom.Point(-7, -27),
                    new Phaser.Geom.Point(11, -8),
                ]
            ];
            Playfield.CellContent = CellContent;
        })(Playfield = Gameplay.Playfield || (Gameplay.Playfield = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Playfield;
        (function (Playfield) {
            class Cell {
                constructor(playfield) {
                    if (!Cell._freeTransitions) {
                        Cell._freeTransitions = new Collections.Pool(undefined, 10, true, () => {
                            let img = playfield.gameplay.mainScene.add.image(0, 0, "atlas_0", Playfield.Manager.ASSET_PREFIX + "cell_0_0")
                                .setVisible(false);
                            return playfield.panel.add(img, 0, 0, 0, false);
                        }, this);
                        Cell._freeContent = new Collections.Pool(undefined, 10, true, () => {
                            return new Playfield.CellContent(playfield);
                        }, this);
                        Cell._freeOverlays = new Collections.Pool(undefined, 2, true, () => {
                            return new Playfield.CellOverlay(playfield);
                        }, this);
                    }
                    this._playfield = playfield;
                    this._shadowPart = playfield.panel.add(playfield.gameplay.mainScene.add.image(0, 0, "atlas_0", Playfield.Manager.ASSET_PREFIX + "cellShadow")
                        .setDepth(0)
                        .setVisible(false), 0, 0, 0, false);
                    let bg = playfield.gameplay.mainScene.add.image(0, 0, "atlas_0", Playfield.Manager.ASSET_PREFIX + "cell_0_0")
                        .setInteractive()
                        .setDepth(20)
                        .setVisible(false);
                    bg.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
                    this._bgPart = playfield.panel.add(bg, 0, 0, 0, false);
                    this._transPart = null;
                    this._content = null;
                    this._hideTweenCfg = {
                        scaleX: 0,
                        scaleY: 0,
                        duration: Cell.STATE_CHANGE_ANIM_LEN,
                        ease: Phaser.Math.Easing.Cubic.In,
                        onComplete: () => {
                            if (this._transPart != null) {
                                Cell._freeTransitions.returnItem(this._transPart.setVisible(false));
                                this._transPart = null;
                            }
                            this._transProgressMask &= ~1;
                        }
                    };
                    this._showTweenCfg = {
                        scaleX: 1,
                        scaleY: 1,
                        duration: Cell.STATE_CHANGE_ANIM_LEN,
                        ease: Phaser.Math.Easing.Cubic.Out,
                        onComplete: () => {
                            this._transProgressMask &= ~2;
                        },
                    };
                    this._highlightOverlay = null;
                    this._mistakeOverlay = null;
                    this._depthLevel = 0;
                    this._timerEvent = null;
                }
                get playfield() { return this._playfield; }
                get id() { return this._playfield.level.width * this._row + this._col; }
                get col() { return this._col; }
                get row() { return this._row; }
                get state() { return this._state; }
                get x() { return this._col * Cell.WIDTH + Playfield.Manager.COUNTER_COL_W; }
                get y() { return this._row * Cell.HEIGHT + Playfield.Manager.COUNTER_ROW_H; }
                get baseDisplayDepth() { return this._depthLevel == 0 ? 0 : Playfield.Manager.DARK_LAYER_DEPTH + 1; }
                get content() { return this._content; }
                get mistakeCnt() { return this._mistakeCnt; }
                reset() {
                    this.setDepthLevel(0);
                    if (this._timerEvent != null) {
                        this._timerEvent.remove(false);
                        this._timerEvent = null;
                    }
                    if (this._transProgressMask != 0) {
                        let targets = [this._shadowPart.gameObject, this._bgPart.gameObject];
                        if (this._transPart != null)
                            targets.push(this._transPart.gameObject);
                        this._playfield.gameplay.mainScene.tweens.killTweensOf(targets);
                        this._transProgressMask = 0;
                    }
                    if (this._transPart != null) {
                        Cell._freeTransitions.returnItem(this._transPart.setVisible(false));
                        this._transPart = null;
                    }
                    if (this._content != null) {
                        this._content.reset();
                        this._content = null;
                    }
                    this._bgPart.setVisible(false);
                    this._shadowPart.setVisible(false);
                    if (this._highlightOverlay != null) {
                        this._highlightOverlay.reset();
                        Cell._freeOverlays.returnItem(this._highlightOverlay);
                        this._highlightOverlay = null;
                    }
                    this._mistakeCnt = 0;
                    if (this._mistakeOverlay != null) {
                        this._mistakeOverlay.reset();
                        Cell._freeOverlays.returnItem(this._mistakeOverlay);
                        this._mistakeOverlay = null;
                    }
                }
                incMistakes(showMistake) {
                    this._mistakeCnt++;
                    if (showMistake && this._mistakeOverlay == null) {
                        this._mistakeOverlay = Cell._freeOverlays.getItem();
                        this._mistakeOverlay.show(this, 1, 0);
                    }
                }
                decMistakes() {
                    if (--this._mistakeCnt == 0 && this._mistakeOverlay != null) {
                        this._mistakeOverlay.reset();
                        Cell._freeOverlays.returnItem(this._mistakeOverlay);
                        this._mistakeOverlay = null;
                    }
                }
                show(state, col, row, smoothly) {
                    this.reset();
                    this._state = state;
                    this._col = col;
                    this._row = row;
                    let x = Playfield.Manager.COUNTER_COL_W + (col * Cell.WIDTH) + (Cell.WIDTH / 2);
                    let y = Playfield.Manager.COUNTER_ROW_H + row * Cell.HEIGHT + (Cell.HEIGHT / 2);
                    this._shadowPart.setOffset(x, y + Cell.SHADOW_OFFSET_Y);
                    this._bgPart.setOffset(x, y);
                    if (smoothly) {
                        this._timerEvent = this._playfield.gameplay.mainScene.time.delayedCall(Phaser.Math.RND.integerInRange(0, 5) * 50, this.startShowAnim, undefined, this);
                    }
                    else {
                        this._transProgressMask = 0;
                        this._bgPart.gameObject.setFrame(Playfield.Manager.ASSET_PREFIX + "cell_" + (state == 0 ? "0_" + Phaser.Math.RND.integerInRange(0, Cell.EMPTY_ASSET_VERS - 1) : "1_" + Phaser.Math.RND.integerInRange(0, Cell.GRASS_ASSET_VERS - 1)), false, false)
                            .setScale(1, 1);
                        this._bgPart.setVisible(true);
                        if (this._state >= 2) {
                            this._content = Cell._freeContent.getItem();
                            this._content.show(this, this._state == 2 ? 1 : 0, smoothly);
                        }
                        this._shadowPart.setVisible(true);
                    }
                }
                hide() {
                    this._timerEvent = this._playfield.gameplay.mainScene.time.delayedCall(Phaser.Math.RND.integerInRange(1, 5) * 50, () => { this.startHideAnim(true); }, undefined, this);
                    if (this._highlightOverlay != null) {
                        this._highlightOverlay.reset();
                        Cell._freeOverlays.returnItem(this._highlightOverlay);
                        this._highlightOverlay = null;
                    }
                    if (this._mistakeOverlay != null) {
                        this._mistakeOverlay.reset();
                        Cell._freeOverlays.returnItem(this._mistakeOverlay);
                        this._mistakeOverlay = null;
                    }
                }
                setDepthLevel(level) {
                    if (this._depthLevel != level) {
                        this._depthLevel = level;
                        let baseDepth = this.baseDisplayDepth;
                        this._shadowPart.setDepth(baseDepth + 0);
                        this._bgPart.setDepth(baseDepth + 20);
                        if (this._content != null)
                            this._content.handleCellDisplayDepthChange(baseDepth);
                        if (this._highlightOverlay != null)
                            this._highlightOverlay.handleCellDisplayDepthChange(baseDepth);
                        if (this._mistakeOverlay != null)
                            this._mistakeOverlay.handleCellDisplayDepthChange(baseDepth);
                        if (this._transPart != null)
                            this._transPart.setDepth(baseDepth + 10);
                    }
                }
                showHighligh(mode, alpha) {
                    if (this._highlightOverlay != null)
                        return;
                    this._highlightOverlay = Cell._freeOverlays.getItem();
                    this._highlightOverlay.show(this, 0, mode, alpha);
                }
                hideHighlight() {
                    if (this._highlightOverlay != null) {
                        this._highlightOverlay.reset();
                        Cell._freeOverlays.returnItem(this._highlightOverlay);
                        this._highlightOverlay = null;
                    }
                }
                setContentVisible(visible) {
                    if (this._content != null)
                        this._content.visible = visible;
                }
                handleContentRelease() {
                    Cell._freeContent.returnItem(this._content);
                    this._content = null;
                }
                restorePrevState() {
                    if (!this._playfield.ready || this._transProgressMask != 0 || this._state == 3)
                        return false;
                    let prevState = this._state;
                    if (this._state-- == 0)
                        this._state = 2;
                    this.startHideAnim();
                    this.startShowAnim();
                    this._playfield.events.emit("cell_stateChange", this, this._state, prevState, true);
                    return true;
                }
                nextState() {
                    let prevState = this._state++;
                    if (this._state > 2)
                        this._state = 0;
                    this.startHideAnim();
                    this.startShowAnim();
                    this._playfield.events.emit("cell_stateChange", this, this._state, prevState, false);
                }
                startShowAnim() {
                    let scene = this._playfield.gameplay.mainScene;
                    this._timerEvent = null;
                    if (!this._shadowPart.visible) {
                        let shadow = this._shadowPart.gameObject;
                        this._shadowPart.setVisible(true);
                        shadow.setAlpha(0);
                        scene.add.tween({
                            targets: shadow,
                            alpha: 1,
                            duration: Cell.STATE_CHANGE_ANIM_LEN + 1,
                            onComplete: () => {
                                this._playfield.events.emit("cell_showComplete", this);
                            }
                        });
                    }
                    let bg = this._bgPart.gameObject;
                    bg.setFrame(Playfield.Manager.ASSET_PREFIX + "cell_" + (this._state == 0 ? "0_" + Phaser.Math.RND.integerInRange(0, Cell.EMPTY_ASSET_VERS - 1) : "1_" + Phaser.Math.RND.integerInRange(0, Cell.GRASS_ASSET_VERS - 1)), false, false)
                        .setScale(0, 0);
                    this._bgPart.setVisible(true);
                    this._transProgressMask |= 2;
                    this._showTweenCfg.targets = bg;
                    scene.add.tween(this._showTweenCfg);
                    if (this._state >= 2) {
                        this._content = Cell._freeContent.getItem();
                        this._content.show(this, this._state == 2 ? 1 : 0);
                    }
                }
                startHideAnim(hideAll = false) {
                    let scene = this._playfield.gameplay.mainScene;
                    this._timerEvent = null;
                    if (this._content != null)
                        this._content.hide();
                    if (hideAll) {
                        scene.add.tween({
                            targets: this._shadowPart.gameObject,
                            alpha: 0,
                            duration: Cell.STATE_CHANGE_ANIM_LEN + 1,
                            onComplete: () => {
                                this._playfield.events.emit("cell_hideComplete", this);
                            }
                        });
                        this._hideTweenCfg.targets = this._bgPart.gameObject;
                    }
                    else {
                        this._transPart = Cell._freeTransitions.getItem()
                            .setOffset(this._bgPart.offsetX, this._bgPart.offsetY)
                            .setDepth(this.baseDisplayDepth + 10)
                            .setVisible(true);
                        this._transPart.gameObject.setFrame(this._bgPart.gameObject.frame.name, false, false)
                            .setScale(1, 1);
                        this._hideTweenCfg.targets = this._transPart.gameObject;
                    }
                    this._transProgressMask |= 1;
                    scene.add.tween(this._hideTweenCfg);
                }
                handlePointerDown() {
                    if (this._playfield.level.tutorialLevel || !this._playfield.ready || this._transProgressMask != 0 || this._state == 3)
                        return;
                    if (this._playfield.hasGoals) {
                        let cellGoal = this._playfield.getCellGoal(this.id);
                        if (cellGoal < 0)
                            return;
                        if (this._state == cellGoal)
                            return;
                    }
                    this.nextState();
                }
            }
            Cell.EMPTY_ASSET_VERS = 2;
            Cell.GRASS_ASSET_VERS = 2;
            Cell.STATE_CHANGE_ANIM_LEN = 500;
            Cell.WIDTH = 91;
            Cell.HEIGHT = 91;
            Cell.SHADOW_OFFSET_Y = 8;
            Playfield.Cell = Cell;
        })(Playfield = Gameplay.Playfield || (Gameplay.Playfield = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Playfield;
        (function (Playfield) {
            class CellOverlay {
                constructor(playfield) {
                    let image = playfield.gameplay.mainScene.add.image(0, 0, "atlas_0", Playfield.Manager.ASSET_PREFIX + "cellOverlay_0")
                        .setVisible(false)
                        .setDepth(30);
                    this._imageItem = playfield.panel.add(image, 0, 0, 0, false);
                    this._blinkTimeline = null;
                    this._showTween = null;
                }
                reset() {
                    this._imageItem.setVisible(false);
                    this.abortAnim();
                }
                show(cell, type = 1, mode = 0, alpha = 0.6) {
                    this._type = type;
                    this._imageItem.setOffset(cell.x + (Playfield.Cell.WIDTH / 2), cell.y + (Playfield.Cell.HEIGHT / 2))
                        .setAlpha(0)
                        .setDepth(cell.baseDisplayDepth + (type == 0 ? 30 : 30 + 1))
                        .setVisible(true);
                    this._imageItem.gameObject.setFrame(Playfield.Manager.ASSET_PREFIX + "cellOverlay_" + type, false, false);
                    if (mode == 0) {
                        CellOverlay._blinkTimelineCfg.targets = this._imageItem;
                        CellOverlay._blinkTimelineCfg.tweens[0].alpha = alpha;
                        this._blinkTimeline = Gameplay.Manager.instance.mainScene.tweens.timeline(CellOverlay._blinkTimelineCfg);
                    }
                    else if (mode == 1) {
                        CellOverlay._showTweenCfg.targets = this._imageItem;
                        CellOverlay._showTweenCfg.alpha = alpha;
                        this._showTween = Gameplay.Manager.instance.mainScene.tweens.add(CellOverlay._showTweenCfg);
                    }
                    else {
                        this._imageItem.setAlpha(alpha);
                    }
                }
                handleCellDisplayDepthChange(baseDepth) {
                    this._imageItem.setDepth(baseDepth + (this._type == 0 ? 30 : 30 + 1));
                }
                abortAnim() {
                    if (this._blinkTimeline != null) {
                        this._blinkTimeline.stop();
                        this._blinkTimeline = null;
                    }
                    if (this._showTween != null) {
                        this._showTween.stop();
                        this._showTween = null;
                    }
                }
            }
            CellOverlay._blinkTimelineCfg = {
                targets: null,
                loop: -1,
                tweens: [{
                        alpha: 0,
                        duration: 500,
                    }, {
                        alpha: 0,
                        duration: 500,
                    }]
            };
            CellOverlay._showTweenCfg = {
                targets: null,
                alpha: 0,
                duration: 500,
            };
            Playfield.CellOverlay = CellOverlay;
        })(Playfield = Gameplay.Playfield || (Gameplay.Playfield = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Playfield;
        (function (Playfield) {
            class CellGoal {
                constructor(cellId, goal) {
                    this.cellId = cellId;
                    this.goal = goal;
                }
            }
            Playfield.CellGoal = CellGoal;
            class Manager {
                constructor(gameplay, bufX, bufY) {
                    let scene = gameplay.mainScene;
                    this._gameplay = gameplay;
                    this._camera = gameplay.mainScene.cameras.add(0, 0, 100, 100, false, "playfield")
                        .setRoundPixels(true)
                        .setOrigin(0, 0);
                    this._topScreenPadding = 0;
                    this._botScreenPadding = 0;
                    this._panel = new Controls.Group.Group(true)
                        .setPosition(bufX, bufY);
                    this._panel.cameraFilter = ~this._camera.id;
                    this._darkLayer = this._panel.add(scene.add.graphics().setDepth(Manager.DARK_LAYER_DEPTH).setVisible(false), 0, 0, 0, false);
                    this._events = new Phaser.Events.EventEmitter();
                    this._events.on("cell_stateChange", this.handleCellStateChange, this);
                    this._events.on("cell_showComplete", this.handleCellShowComplete, this);
                    this._events.on("cell_hideComplete", this.handleCellHideComplete, this);
                    scene.anims.create({
                        key: "content_0_0",
                        frames: scene.anims.generateFrameNames("atlas_0", { prefix: Manager.ASSET_PREFIX + "tree/show_", start: 1, end: 13, zeroPad: 4 }),
                        frameRate: 15,
                    });
                    scene.anims.create({
                        key: "content_0_1",
                        frames: scene.anims.generateFrameNames("atlas_0", { prefix: Manager.ASSET_PREFIX + "tree/idle_", start: 1, end: 25, zeroPad: 4 }),
                        frameRate: 15,
                    });
                    scene.anims.create({
                        key: "content_1_0",
                        frames: scene.anims.generateFrameNames("atlas_0", { prefix: Manager.ASSET_PREFIX + "tent/show_", start: 0, end: 12 }),
                        frameRate: 40,
                    });
                    scene.anims.create({
                        key: "content_1_1",
                        frames: scene.anims.generateFrameNames("atlas_0", { prefix: Manager.ASSET_PREFIX + "tent/idle_", start: 0, end: 14 }),
                        frameRate: 10,
                        repeat: -1,
                    });
                    this._treeIdleAnimStartEvent = null;
                    this._tentCounters = [];
                    this._tentsPerCol = [];
                    this._tentsPerRow = [];
                    this._showTentCountersCfg = {
                        from: 0,
                        to: 1,
                        duration: Playfield.Cell.STATE_CHANGE_ANIM_LEN,
                        onUpdate: (tween) => { this.handleTentCounterTweenUpdate(tween); }
                    };
                    this._hideTentCountersCfg = {
                        from: 1,
                        to: 0,
                        duration: Playfield.Cell.STATE_CHANGE_ANIM_LEN,
                        onUpdate: (tween) => { this.handleTentCounterTweenUpdate(tween); }
                    };
                    this._emptyCellsPerCol = [];
                    this._emptyCellsPerRow = [];
                    this._cells = [];
                    this._moveHistory = new Collections.Stack();
                    this._cellMistakes = new Playfield.Mistakes.Manager(this);
                }
                get gameplay() { return this._gameplay; }
                get events() { return this._events; }
                get camera() { return this._camera; }
                get level() { return this._level; }
                get moveCnt() { return this._moveCnt; }
                get panel() { return this._panel; }
                get cells() { return this._cells; }
                get hasGoals() { return this._remCellGoals != 0; }
                get moveHistory() { return this._moveHistory; }
                get ready() { return (this._flags & (1 | 2 | 4 | 8 | 32 | 16)) == 0; }
                get complete() { return (this._flags & 8) != 0; }
                get score() { return this._score; }
                get firstMistake() { return this._cellMistakes.firstMistake; }
                get lastMistake() { return this._cellMistakes.lastMistake; }
                get darkLayerVisible() { return this._darkLayer.visible; }
                set darkLayerVisible(visible) {
                    if (this._darkLayer.visible != visible) {
                        if ((this._darkLayer.visible = visible))
                            this.createDarkLayer();
                    }
                }
                get darkLayerAlpha() { return this._darkLayer.alpha; }
                set darkLayerAlpha(alpha) {
                    if (this._darkLayer.alpha != alpha) {
                        this._darkLayer.alpha = alpha;
                    }
                }
                get locked() { return (this._flags & 32) != 0; }
                set locked(value) {
                    if (this.locked != value) {
                        if (value)
                            this._flags |= 32;
                        else
                            this._flags &= ~32;
                    }
                }
                getCell(col, row) {
                    return this._cells[this._level.width * row + col];
                }
                getCellById(id) {
                    return this._cells[id];
                }
                setCellGoals(cellGoals) {
                    this._cellGoals = cellGoals;
                    this._remCellGoals = 0;
                    if (cellGoals) {
                        cellGoals.forEach((goal) => {
                            if (goal.goal != this._cells[goal.cellId].state)
                                this._remCellGoals++;
                        }, this);
                    }
                }
                getCellGoal(id) {
                    if (this.hasGoals) {
                        let i = this._cellGoals.length;
                        while (i-- != 0) {
                            if (id == this._cellGoals[i].cellId)
                                return this._cellGoals[i].goal;
                        }
                    }
                    return -1;
                }
                clear() {
                    let cellId = this._level.width * this._level.height;
                    this._tileChangeSfxEnabled = false;
                    while (cellId-- != 0) {
                        let cell = this._cells[cellId];
                        if (cell.state == 1) {
                            cell.restorePrevState();
                        }
                        else if (cell.state == 2) {
                            cell.nextState();
                        }
                    }
                    this._tileChangeSfxEnabled = true;
                    this.resetMoveHistory();
                }
                resetMoveHistory() {
                    this._moveHistory.reset();
                }
                show(level, save, smoothly, scaleMode, showTentCounters, topScreenPadding, botScreenPadding) {
                    this._flags = 0;
                    this._score = 0;
                    this._tileChangeSfxEnabled = true;
                    this._moveCnt = (save != null ? save.moveCnt : 0);
                    this._moveHistory.reset();
                    if (save != null && save.moveHistory) {
                        save.moveHistory.forEach((i) => {
                            this._moveHistory.push(i);
                        });
                    }
                    this._cellMistakes.init(level);
                    this._cellGoals = null;
                    this._remCellGoals = 0;
                    let curCellCnt = (this._level != null ? this._level.width * this._level.height : 0);
                    let newCellCnt = level.width * level.height;
                    for (let i = 0; i < curCellCnt; i++)
                        this._cells[i].reset();
                    while (this._cells.length < newCellCnt)
                        this._cells.push(new Playfield.Cell(this));
                    this._treeCells = [];
                    let curCounterCnt = (this._level != null ? this._level.width + this._level.height : 0);
                    let newCounterCnt = level.width + level.height;
                    while (curCounterCnt > newCounterCnt)
                        this._tentCounters[--curCounterCnt].visible = false;
                    while (this._tentCounters.length < newCounterCnt)
                        this._tentCounters.push(new Playfield.TentCounter(this));
                    while (this._tentsPerCol.length < level.width)
                        this._tentsPerCol.push(0);
                    while (this._tentsPerRow.length < level.height)
                        this._tentsPerRow.push(0);
                    let cellId = 0;
                    let treeId = 0;
                    this._level = level;
                    this._incompColsAndRows = level.width + level.height;
                    for (let row = 0; row < level.height; row++) {
                        this._tentCounters[row].init(0, Manager.COUNTER_ROW_H + (row * Playfield.Cell.HEIGHT) + 16, level.tentsPerRow[row]);
                        this._tentsPerRow[row] = 0;
                        this._emptyCellsPerRow[row] = level.width;
                        for (let col = 0; col < level.width; col++) {
                            if (row == 0) {
                                let counter = this._tentCounters[level.height + col];
                                counter.init(Manager.COUNTER_COL_W + (col * Playfield.Cell.WIDTH) + 18, 0, level.tentsPerCol[col]);
                                this._tentsPerCol[col] = 0;
                                this._emptyCellsPerCol[col] = level.height;
                            }
                            let cellState;
                            if (treeId < level.treeCells.length && cellId == level.treeCells[treeId]) {
                                cellState = 3;
                                treeId++;
                            }
                            else {
                                cellState = (save ? save.getCellState(cellId) : 0);
                            }
                            if (cellState != 0) {
                                this._emptyCellsPerCol[col]--;
                                this._emptyCellsPerRow[row]--;
                                if (cellState == 2) {
                                    this._tentsPerCol[col]++;
                                    this._tentsPerRow[row]++;
                                }
                            }
                            this._cells[cellId].show(cellState, col, row, smoothly);
                            if (cellState == 3)
                                this._treeCells.push(this._cells[cellId]);
                            cellId++;
                            if (row + 1 == level.height) {
                                if (this._tentsPerCol[col] > level.tentsPerCol[col]) {
                                    this._tentCounters[level.height + col].state = Playfield.eTentCounterState.error;
                                }
                                else if (this._emptyCellsPerCol[col] == 0 && this._tentsPerCol[col] == level.tentsPerCol[col]) {
                                    this._tentCounters[level.height + col].state = Playfield.eTentCounterState.complete;
                                    this._incompColsAndRows--;
                                }
                            }
                        }
                        if (this._tentsPerRow[row] > level.tentsPerRow[row]) {
                            this._tentCounters[row].state = Playfield.eTentCounterState.error;
                        }
                        else if (this._emptyCellsPerRow[row] == 0 && this._tentsPerRow[row] == level.tentsPerRow[row]) {
                            this._tentCounters[row].state = Playfield.eTentCounterState.complete;
                            this._incompColsAndRows--;
                        }
                    }
                    if (save != null) {
                        save.mistakes.forEach((mistake) => {
                            this._cellMistakes.addMistake(mistake.type, this._cells[mistake.cell1Id], mistake.cell2Id >= 0 ? this._cells[mistake.cell2Id] : null);
                        }, this);
                    }
                    if (level.tutorialLevel)
                        this._incompColsAndRows = -1;
                    if (this._treeIdleAnimStartEvent != null) {
                        this._treeIdleAnimStartEvent.remove(false);
                        this._treeIdleAnimStartEvent = null;
                    }
                    this._treeIdleAnimStartEvent = this._gameplay.mainScene.time.addEvent({
                        delay: 2000,
                        callback: () => { this._treeCells[Phaser.Math.RND.integerInRange(0, this._treeCells.length - 1)].content.playIdleAnim(); },
                        callbackScope: this, loop: true
                    });
                    if (!showTentCounters) {
                        for (let i = 0; i < level.width; i++)
                            this.getColTentCounter(i).visible = false;
                        for (let i = 0; i < level.height; i++)
                            this.getRowTentCounter(i).visible = false;
                    }
                    this._tentCountersVisible = showTentCounters;
                    this._panel.setCustomSize(Manager.COUNTER_COL_W + Playfield.Cell.WIDTH * level.width, Manager.COUNTER_ROW_H + Playfield.Cell.HEIGHT * level.height + 10);
                    this.darkLayerVisible = false;
                    this._scaleMode = scaleMode;
                    this._topScreenPadding = topScreenPadding;
                    this._botScreenPadding = botScreenPadding;
                    this.updatePosition();
                    if (smoothly) {
                        this._flags |= 1;
                        this._cellCnt = 0;
                        if (showTentCounters) {
                            for (let i = 0; i < newCounterCnt; i++)
                                this._tentCounters[i].alpha = 0;
                            this._gameplay.mainScene.tweens.addCounter(this._showTentCountersCfg);
                        }
                    }
                    else {
                        this._cellCnt = level.width * level.height;
                        this._events.emit("showComplete");
                    }
                }
                hide() {
                    if ((this._flags & (1 | 2 | 4)) != 0)
                        return;
                    this._flags |= 2;
                    this.cancelGrassFill();
                    let cellId = this._level.width * this._level.height;
                    while (cellId--)
                        this._cells[cellId].hide();
                    this._gameplay.mainScene.tweens.addCounter(this._hideTentCountersCfg);
                    if (this._treeIdleAnimStartEvent) {
                        this._treeIdleAnimStartEvent.remove(false);
                        this._treeIdleAnimStartEvent = null;
                    }
                }
                getRowTentCounter(row) {
                    return this._tentCounters[row];
                }
                getColTentCounter(col) {
                    return this._tentCounters[this._level.height + col];
                }
                getTentsPerCol(col) {
                    return this._tentsPerCol[col];
                }
                getTentsPerRow(row) {
                    return this._tentsPerRow[row];
                }
                undoMove() {
                    if (!this._moveHistory.empty && this.ready) {
                        let cellId = this._moveHistory.pop();
                        if (!this._cells[cellId].restorePrevState())
                            this._moveHistory.push(cellId);
                    }
                }
                save() {
                    if (!this.complete) {
                        this.cancelGrassFill();
                        let startMoveCnt = 0;
                        if (this._level.partiallyComplete)
                            startMoveCnt = Game.Global.save.getLevelSave(this._level).moveCnt;
                        if (this._moveCnt != startMoveCnt)
                            this._level.save(this);
                    }
                }
                updatePosition() {
                    let mainCamera = this._gameplay.mainScene.cameras.main;
                    let camera = this._camera;
                    let pfY;
                    let pfMaxH = this._scaleMode == 0 ? mainCamera.height - this._topScreenPadding - this._botScreenPadding : this._panel.height;
                    let zoom = pfMaxH / this._panel.height;
                    if (this._panel.width * zoom > Manager.WIDTH)
                        zoom = Manager.WIDTH / this._panel.width;
                    camera.setZoom(zoom);
                    camera.setSize(mainCamera.width, mainCamera.height);
                    if (this._botScreenPadding != 0) {
                        pfY = (this._topScreenPadding / zoom) + (((mainCamera.height - this._topScreenPadding - this._botScreenPadding) / zoom) - this._panel.height) / 2;
                        pfY = this._panel.y - pfY;
                    }
                    else {
                        pfY = ((mainCamera.height / zoom) - this._panel.height) / 2;
                        if (pfY < this._topScreenPadding / zoom)
                            pfY = this._topScreenPadding / zoom;
                        pfY = this._panel.y - pfY;
                    }
                    camera.scrollX = this._panel.x - Math.round(((camera.width / zoom) - this._panel.width) / 2);
                    camera.scrollY = Math.round(pfY);
                    if (!this._tentCountersVisible) {
                        this._camera.scrollX += (Manager.COUNTER_COL_W >> 1);
                        this._camera.scrollY += (Manager.COUNTER_ROW_H >> 1);
                    }
                    if (this._darkLayer.visible)
                        this.createDarkLayer();
                }
                createDarkLayer() {
                    let darkLayer = this._darkLayer.gameObject;
                    let camera = this._camera;
                    darkLayer.clear();
                    darkLayer.fillStyle(0, 1);
                    darkLayer.fillRect(camera.scrollX - this._panel.x, camera.scrollY - this._panel.y, Math.ceil(camera.width / camera.zoom), Math.ceil(camera.height / camera.zoom));
                }
                completeWithGrass(cellDelay) {
                    if ((this._flags & (2 | 4 | 1 | 16 | 8)) != 0)
                        return;
                    this._grassFillCellId = this.getNextEmptyCell(0);
                    if (this._grassFillCellId < 0) {
                        this._events.emit("grassFillComplete");
                        return;
                    }
                    this._flags |= 16;
                    this._grassFillEvent = this._gameplay.mainScene.time.addEvent({
                        delay: cellDelay,
                        loop: true,
                        callback: () => {
                            this._cells[this._grassFillCellId].nextState();
                            if ((this._grassFillCellId = this.getNextEmptyCell(this._grassFillCellId + 1)) < 0) {
                                this._flags &= ~16;
                                this._grassFillEvent.remove(false);
                                this._events.emit("grassFillComplete");
                            }
                        },
                        callbackScope: this
                    });
                }
                cancelGrassFill() {
                    if ((this._flags & 16) != 0) {
                        this._grassFillEvent.remove(false);
                        this._grassFillEvent = null;
                    }
                }
                getNextEmptyCell(from) {
                    let cellCnt = this._level.width * this._level.height;
                    let cellId = from;
                    while (cellId < cellCnt && this._cells[cellId].state != 0)
                        cellId++;
                    return (cellId == cellCnt ? -1 : cellId);
                }
                handleCellStateChange(cell, newState, oldState, undo) {
                    let cellCol = cell.col;
                    let cellRow = cell.row;
                    let sfx = "tileClick";
                    if (!undo)
                        this._moveHistory.push(cell.id);
                    if (newState == 2) {
                        this._tentsPerCol[cellCol]++;
                        this._tentsPerRow[cellRow]++;
                        if (this._cellMistakes.findCellMistakes(cell))
                            sfx = "tileClickFail";
                    }
                    else if (oldState == 2) {
                        this._tentsPerCol[cellCol]--;
                        this._tentsPerRow[cellRow]--;
                        this._cellMistakes.clearCellMistakes(cell);
                        this._cellMistakes.validateTentsWithoutOwnTree();
                    }
                    if (newState == 0) {
                        this._emptyCellsPerCol[cellCol]++;
                        this._emptyCellsPerRow[cellRow]++;
                    }
                    else if (oldState == 0) {
                        this._emptyCellsPerCol[cellCol]--;
                        this._emptyCellsPerRow[cellRow]--;
                    }
                    let curTentCnt = this._tentsPerCol[cellCol];
                    let reqTentCnt = this._level.tentsPerCol[cellCol];
                    let counter = this._tentCounters[this._level.height + cellCol];
                    let counterState = curTentCnt > reqTentCnt ? Playfield.eTentCounterState.error : curTentCnt == reqTentCnt && this._emptyCellsPerCol[cellCol] == 0 ? Playfield.eTentCounterState.complete : Playfield.eTentCounterState.incomplete;
                    if (counter.state == Playfield.eTentCounterState.complete)
                        this._incompColsAndRows++;
                    if (counterState == Playfield.eTentCounterState.complete)
                        this._incompColsAndRows--;
                    if (counter.state != counterState) {
                        counter.state = counterState;
                        if (counterState == Playfield.eTentCounterState.error)
                            sfx = "tileClickFail";
                    }
                    curTentCnt = this._tentsPerRow[cellRow];
                    reqTentCnt = this._level.tentsPerRow[cellRow];
                    counter = this._tentCounters[cellRow];
                    counterState = curTentCnt > reqTentCnt ? Playfield.eTentCounterState.error : curTentCnt == reqTentCnt && this._emptyCellsPerRow[cellRow] == 0 ? Playfield.eTentCounterState.complete : Playfield.eTentCounterState.incomplete;
                    if (counter.state == Playfield.eTentCounterState.complete)
                        this._incompColsAndRows++;
                    if (counterState == Playfield.eTentCounterState.complete)
                        this._incompColsAndRows--;
                    if (counter.state != counterState) {
                        counter.state = counterState;
                        if (counterState == Playfield.eTentCounterState.error)
                            sfx = "tileClickFail";
                    }
                    if (!undo) {
                        if (this._tileChangeSfxEnabled)
                            this._gameplay.mainScene.sound.playAudioSprite("sfx", sfx);
                        if (this.hasGoals) {
                            let cellGoal = this.getCellGoal(cell.id);
                            if (newState == cellGoal) {
                                if (--this._remCellGoals == 0)
                                    this._events.emit("goalComplete");
                            }
                        }
                    }
                    else if (this.hasGoals) {
                        let cellGoal = this.getCellGoal(cell.id);
                        if (oldState == cellGoal)
                            this._remCellGoals++;
                    }
                    this._moveCnt += (!undo ? 1 : -1);
                    this.events.emit("moveCntChange", this._moveCnt, cell);
                    if (this._level.tutorialLevel) {
                        this._incompColsAndRows = -1;
                    }
                    else if (this._incompColsAndRows == 0 && this._cellMistakes.firstMistake == null) {
                        this._score = this._level.setResult(this._moveCnt, this._gameplay.levelTime);
                        this._flags |= 8;
                        this._events.emit("levelComplete");
                    }
                }
                handleTentCounterTweenUpdate(tween) {
                    let i = this._level.width + this._level.height;
                    while (i-- != 0)
                        this._tentCounters[i].alpha = tween.getValue();
                }
                handleCellShowComplete() {
                    if (++this._cellCnt == this._level.width * this._level.height) {
                        this._flags &= ~1;
                        this._events.emit("showComplete");
                    }
                }
                handleCellHideComplete() {
                    if (--this._cellCnt == 0) {
                        this._flags &= ~2;
                        this._flags |= 4;
                        this._events.emit("hideComplete");
                    }
                }
            }
            Manager.ASSET_PREFIX = "playfield/";
            Manager.DARK_LAYER_DEPTH = 100;
            Manager.WIDTH = 620;
            Manager.COUNTER_COL_W = 74;
            Manager.COUNTER_ROW_H = 70;
            Playfield.Manager = Manager;
        })(Playfield = Gameplay.Playfield || (Gameplay.Playfield = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Playfield;
        (function (Playfield) {
            var Mistakes;
            (function (Mistakes) {
                class Manager {
                    constructor(playfield) {
                        if (!Manager.MISTAKE_TYPE_DSC) {
                            Manager.MISTAKE_TYPE_DSC = [];
                            Manager.MISTAKE_TYPE_DSC[0] = [
                                "Stany (" + "\u00BC" + ") nesmí stát vedle sebe\nv žádném směru.",
                                "Stan (" + "\u00BC" + ") musí stát vedle stromu (" + "\u00BD" + ").",
                                "Každý stan (" + "\u00BC" + ") musí mít vlastní strom (" + "\u00BD" + ").",
                            ];
                            Manager.MISTAKE_TYPE_DSC[1] = [
                                "Tents (" + "\u00BC" + ") can't be placed\nnext to each other in any direction.",
                                "The tent (" + "\u00BC" + ") must be next to a tree (" + "\u00BD" + ").",
                                "Each tent (" + "\u00BC" + ") must be paired\nwith its own tree (" + "\u00BD" + ")."
                            ];
                            Manager.MISTAKE_TYPE_DSC[2] = [
                                "Las tiendas (" + "\u00BC" + ") no pueden estar juntas\nen ninguna dirección.",
                                "La tienda (" + "\u00BC" + ") debe estar junto\na un árbol (" + "\u00BD" + ").",
                                "Cada tienda (" + "\u00BC" + ") sólo se puede\nemparejar con un árbol (" + "\u00BD" + ")."
                            ];
                            Manager.MISTAKE_TYPE_DSC[3] = [
                                "Палатки (" + "\u00BC" + ") нельзя располагать\nрядом друг с другом, ни в каких\nнаправлениях.",
                                "Палатки (" + "\u00BC" + ") должны находиться рядом\nс деревьями (" + "\u00BD" + ").",
                                "Не должно быть больше одной палатки (" + "\u00BC" + ")\nу каждого дерева (" + "\u00BD" + ")."
                            ];
                            Manager.MISTAKE_TYPE_DSC[4] = [
                                "As tendas (" + "\u00BC" + ") não podem estar juntas\nem nenhuma direção.",
                                "A tenda (" + "\u00BC" + ") deve estar junta\na uma árvore (" + "\u00BD" + ").",
                                "Cada tenda (" + "\u00BC" + ") só pode ser\nemparelhada com uma árvore (" + "\u00BD" + ")."
                            ];
                            Manager.MISTAKE_TYPE_DSC[5] = [
                                "Corturile (" + "\u00BC" + ") nu pot fi amplasate unul\nlângă altul în nicio direcție.",
                                "Cortul (" + "\u00BC" + ") trebuie să se afle\nlângă un copac (" + "\u00BD" + ").",
                                "Fiecărui cort (" + "\u00BC" + ") îi corespunde\nun singur copac (" + "\u00BD" + ")."
                            ];
                        }
                        this._playfield = playfield;
                        this._freeMistakes = new Collections.Pool(Mistakes.Node);
                        this._firstMistake = null;
                        this._lastMistake = null;
                        this._tentValidator = new Mistakes.TentValidator(playfield);
                    }
                    get firstMistake() { return this._firstMistake; }
                    get lastMistake() { return this._lastMistake; }
                    init(level) {
                        this._tentValidator.init(level);
                        let node = this._firstMistake;
                        while (node != null)
                            node = this._freeMistakes.returnItem(node).next;
                        this._firstMistake = null;
                        this._lastMistake = null;
                    }
                    findCellMistakes(cell) {
                        if (cell.state != 2 || cell.mistakeCnt != 0)
                            throw new Error("The cell does not contain a tent or it already has mistakes: | state: " + cell.state + " | mistakes: " + cell.mistakeCnt);
                        let lastMistake = this._lastMistake;
                        let cellCol = cell.col;
                        let cellRow = cell.row;
                        this.checkConnectedTent(cell, cellCol - 1, cellRow);
                        this.checkConnectedTent(cell, cellCol - 1, cellRow - 1);
                        this.checkConnectedTent(cell, cellCol, cellRow - 1);
                        this.checkConnectedTent(cell, cellCol + 1, cellRow - 1);
                        this.checkConnectedTent(cell, cellCol + 1, cellRow);
                        this.checkConnectedTent(cell, cellCol + 1, cellRow + 1);
                        this.checkConnectedTent(cell, cellCol, cellRow + 1);
                        this.checkConnectedTent(cell, cellCol - 1, cellRow + 1);
                        let res = this._tentValidator.validateTent(cell);
                        if (res < 0) {
                            this.addMistake(1, cell);
                        }
                        else if (res == 0) {
                            this.addMistake(2, cell);
                        }
                        return (this._lastMistake != lastMistake);
                    }
                    clearCellMistakes(cell) {
                        let node = this._firstMistake;
                        while (node != null) {
                            if (node.cell1 == cell || node.cell2 == cell)
                                this.removeMistake(node);
                            node = node.next;
                        }
                    }
                    validateTentsWithoutOwnTree() {
                        let node = this._firstMistake;
                        while (node != null) {
                            if (node.type == 2) {
                                let cell = node.cell1;
                                if (cell.mistakeCnt == 1 && this._tentValidator.validateTent(cell) == 1)
                                    this.removeMistake(node);
                            }
                            node = node.next;
                        }
                    }
                    static getMistakeDsc(mistake) {
                        return Manager.MISTAKE_TYPE_DSC[Game.Global.language][mistake.type];
                    }
                    checkConnectedTent(mainCell, col, row) {
                        if (col < 0 || col >= this._playfield.level.width || row < 0 || row >= this._playfield.level.height)
                            return;
                        let cell = this._playfield.getCell(col, row);
                        if (cell.state != 2)
                            return;
                        this.addMistake(0, mainCell, cell);
                    }
                    addMistake(type, cell1, cell2 = null) {
                        this._lastMistake = this._freeMistakes.getItem().init(this._lastMistake, type, cell1, cell2);
                        if (this._firstMistake == null)
                            this._firstMistake = this._lastMistake;
                        cell1.incMistakes(true);
                        if (cell2 != null)
                            cell2.incMistakes(!cell1.playfield.level.mistakeGuard);
                    }
                    removeMistake(mistake) {
                        mistake.cell1.decMistakes();
                        if (mistake.cell2 != null)
                            mistake.cell2.decMistakes();
                        mistake.remove();
                        if (mistake == this._firstMistake)
                            this._firstMistake = mistake.next;
                        if (mistake == this._lastMistake)
                            this._lastMistake = mistake.prev;
                    }
                }
                Mistakes.Manager = Manager;
            })(Mistakes = Playfield.Mistakes || (Playfield.Mistakes = {}));
        })(Playfield = Gameplay.Playfield || (Gameplay.Playfield = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Playfield;
        (function (Playfield) {
            var Mistakes;
            (function (Mistakes) {
                class Node {
                    get prev() { return this._prev; }
                    get next() { return this._next; }
                    get type() { return this._type; }
                    get cell1() { return this._cell1; }
                    get cell2() { return this._cell2; }
                    init(prev, type, cell1, cell2 = null) {
                        this._next = null;
                        if ((this._prev = prev) != null)
                            prev._next = this;
                        this._type = type;
                        this._cell1 = cell1;
                        this._cell2 = cell2;
                        return this;
                    }
                    remove() {
                        if (this._prev != null)
                            this._prev._next = this._next;
                        if (this._next != null)
                            this._next._prev = this._prev;
                    }
                }
                Mistakes.Node = Node;
            })(Mistakes = Playfield.Mistakes || (Playfield.Mistakes = {}));
        })(Playfield = Gameplay.Playfield || (Gameplay.Playfield = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Playfield;
        (function (Playfield) {
            let eTentCounterState;
            (function (eTentCounterState) {
                eTentCounterState[eTentCounterState["incomplete"] = 0] = "incomplete";
                eTentCounterState[eTentCounterState["complete"] = 1] = "complete";
                eTentCounterState[eTentCounterState["error"] = 2] = "error";
            })(eTentCounterState = Playfield.eTentCounterState || (Playfield.eTentCounterState = {}));
            class TentCounter {
                constructor(playfield) {
                    let scene = playfield.gameplay.mainScene;
                    let group = new Controls.Group.Group()
                        .setVisible(false);
                    this._bg = scene.add.image(0, 0, "atlas_0", Playfield.Manager.ASSET_PREFIX + "tentCounter_0")
                        .setOrigin(0);
                    group.add(this._bg);
                    this._number = scene.add.bitmapText(0, 0, "fntNumsC0", "", 38)
                        .setOrigin(0.5, 0);
                    group.add(this._number, -9, 13, 4, false);
                    this._group = playfield.panel.add(group, 0, 0, 0, false);
                    this._state = eTentCounterState.incomplete;
                }
                get state() { return this._state; }
                set state(state) {
                    if (this._state == state)
                        return;
                    this._state = state;
                    this._bg.setFrame(Playfield.Manager.ASSET_PREFIX + "tentCounter_" + state);
                    this._number.setFont(state != eTentCounterState.complete ? "fntNumsC0" : "fntNumsC1");
                }
                get visible() { return this._group.visible; }
                set visible(visible) { this._group.visible = visible; }
                get alpha() { return this._group.alpha; }
                set alpha(alpha) { this._group.alpha = alpha; }
                get width() { return this._group.width; }
                get height() { return this._group.height; }
                init(x, y, tentCnt) {
                    this._number.text = tentCnt.toString();
                    this._group.setOffset(x, y)
                        .setDepth(0)
                        .setAlpha(1)
                        .setVisible(true);
                    this.state = eTentCounterState.incomplete;
                }
                setDepthLevel(level) {
                    this._group.setDepth(level == 0 ? 0 : Playfield.Manager.DARK_LAYER_DEPTH + 1);
                }
            }
            Playfield.TentCounter = TentCounter;
        })(Playfield = Gameplay.Playfield || (Gameplay.Playfield = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Playfield;
        (function (Playfield) {
            var Mistakes;
            (function (Mistakes) {
                class TentValidator {
                    constructor(playfield) {
                        this._playfield = playfield;
                        this._cellStack = new Collections.Stack(10);
                        this._cellMask = [];
                    }
                    init(level) {
                        let cellCnt = level.width * level.height;
                        let maskCnt = Math.ceil(cellCnt / 32);
                        while (maskCnt > this._cellMask.length)
                            this._cellMask.push(0);
                    }
                    validateTent(tentCell) {
                        this._tentCnt = 0;
                        this._treeCnt = 0;
                        this._cellStack.reset();
                        this._cellStack.push(tentCell);
                        for (let i = 0; i < this._cellMask.length; i++)
                            this._cellMask[i] = 0;
                        this._cellMask[tentCell.id >> 5] |= (1 << (tentCell.id & 31));
                        while (!this._cellStack.empty) {
                            let cell = this._cellStack.pop();
                            let treeOnly = cell.state == 2;
                            this.checkCell(cell.col - 1, cell.row, treeOnly);
                            this.checkCell(cell.col + 1, cell.row, treeOnly);
                            this.checkCell(cell.col, cell.row - 1, treeOnly);
                            this.checkCell(cell.col, cell.row + 1, treeOnly);
                        }
                        if (this._treeCnt == 0)
                            return -1;
                        if (this._tentCnt >= this._treeCnt)
                            return 0;
                        return 1;
                    }
                    checkCell(col, row, acceptTreeOnly) {
                        if (col < 0 || col >= this._playfield.level.width || row < 0 || row >= this._playfield.level.height)
                            return;
                        let cell = this._playfield.getCell(col, row);
                        if ((this._cellMask[cell.id >> 5] & (1 << (cell.id & 31))) != 0)
                            return;
                        let cellState = cell.state;
                        if (cellState == 3 || (!acceptTreeOnly && cellState == 2)) {
                            this._cellStack.push(cell);
                            if (cellState == 2) {
                                this._tentCnt++;
                            }
                            else {
                                this._treeCnt++;
                            }
                        }
                        this._cellMask[cell.id >> 5] |= (1 << (cell.id & 31));
                    }
                }
                Mistakes.TentValidator = TentValidator;
            })(Mistakes = Playfield.Mistakes || (Playfield.Mistakes = {}));
        })(Playfield = Gameplay.Playfield || (Gameplay.Playfield = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Results;
        (function (Results) {
            class PanelNormal {
                constructor(scene) {
                    this._scene = scene;
                    this._events = new Phaser.Events.EventEmitter();
                    this._events.on("btn_click", this.handleBtnOkClick, this);
                    this._overlay = scene.add.graphics().setVisible(false);
                    this._overlay.cameraFilter = ~Gameplay.Manager.instance.uiCamera.id;
                    this._panel = new Controls.Group.Group()
                        .setVisible(false)
                        .setDepth(100);
                    this._panel.cameraFilter = this._overlay.cameraFilter;
                    this._bnsLvlCrown = this._panel.add(scene.add.image(0, 0, "atlas_0", PanelNormal.ASSET_PREFIX + "crown").setDisplayOrigin(42, 70), 0, 0, 1, false);
                    this._panel.add(scene.add.image(0, 0, "atlas_0", PanelNormal.ASSET_PREFIX + "panel").setOrigin(0, 0));
                    this._lvlNum = scene.add.bitmapText(0, 0, "fntDefaultBigC1", "", 60).setOrigin(0.5, 0);
                    this._panel.add(this._lvlNum, 0, 20, 4, false);
                    this._steps = scene.add.bitmapText(0, 0, "fntDefaultBigC1", "", 60).setOrigin(0.5, 0);
                    this._panel.add(this._steps, 0, 308, 4, false);
                    this._score = scene.add.bitmapText(0, 0, "fntDefaultBigC1", "", 60).setOrigin(0.5, 0);
                    this._panel.add(this._score, 0, 454, 4, false);
                    this._bnsLvlScoreMultiplier = this._panel.add(scene.add.image(0, 0, "atlas_0", PanelNormal.ASSET_PREFIX + "multiplier2x"), 426, 446, 0, false);
                    this._btnOk = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", PanelNormal.ASSET_PREFIX + "btnOk_")
                        .setVisible(false)
                        .setEventEmitter(this._events);
                    this._btnOk.cameraFilter = this._panel.cameraFilter;
                    let starPos = [
                        new Phaser.Geom.Point(145, 131),
                        new Phaser.Geom.Point(234, 122),
                        new Phaser.Geom.Point(323, 132)
                    ];
                    this._stars = [];
                    for (let i = 0; i < 3; i++)
                        this._stars.push(this._panel.add(scene.add.image(0, 0, "atlas_0", PanelNormal.ASSET_PREFIX + "star"), starPos[i].x, starPos[i].y, 0, false));
                    this._state = 0;
                    this._congratBox = null;
                    let self = this;
                    this._showTweenCfg = {
                        from: 0,
                        to: 1,
                        duration: 1000,
                        ease: Phaser.Math.Easing.Cubic.Out,
                        onUpdate: (tween) => {
                            let value = tween.getValue();
                            let camera = self._scene.cameras.main;
                            self._overlay.alpha = value;
                            self._panel.y = self._panelStartY + (self._panelTargetY - self._panelStartY) * value;
                            self._btnOk.x = Gameplay.Manager.UI_LAYER_X + camera.width + (((camera.width - self._btnOk.width) / 2) - camera.width) * value;
                        },
                        onComplete: () => {
                            self._btnOk.enabled = true;
                            self._state = 3;
                            this.showStar(0);
                        }
                    };
                    this._showStarTweenCfg = {
                        targets: null,
                        scaleX: { value: 1, ease: Phaser.Math.Easing.Cubic.In },
                        scaleY: { value: 1, ease: Phaser.Math.Easing.Cubic.In },
                        alpha: { value: 1, ease: Phaser.Math.Easing.Cubic.Out },
                        duration: 500,
                        onComplete: () => {
                            if (this._showStarId + 1 < this._showStarCnt)
                                this.showStar(this._showStarId + 1);
                        }
                    };
                }
                reset() {
                    this._panel.visible = false;
                    this._btnOk.visible = false;
                    this._overlay.visible = false;
                    if (this._congratBox != null)
                        this._congratBox.visible = false;
                    this._state = 0;
                }
                show(level, moveCnt, onCompleteClb, clbCtx) {
                    this._onCompleteClb = onCompleteClb;
                    this._clbCtx = clbCtx;
                    this._lvlNum.setText("LEVEL " + (level.id + 1));
                    let bonusLevel = level.bonusLevel;
                    this._bnsLvlCrown.visible = bonusLevel;
                    this._bnsLvlScoreMultiplier.visible = bonusLevel;
                    this._score.setText(Gameplay.Manager.instance.playfield.score.toString());
                    this._stars.forEach((star) => { star.visible = false; });
                    this._showStarCnt = Gameplay.Level.Data.getRating(level, moveCnt);
                    this._steps.setText(moveCnt.toString());
                    this._btnOk.setVisible(true).setEnabled(false);
                    if (Game.Global.save.completeLevelCnt == Game.Global.levelGroups.length * Gameplay.Level.Group.LEVELS_PER_GROUP && this._congratBox == null)
                        this.creeateCongratBox();
                    this._panel.setVisible(true);
                    this._state = 1;
                    this._stepId = 0;
                    this.handleResolutionChange();
                    this._panel.y = this._panelStartY;
                    this._btnOk.x = this._scene.cameras.main.width;
                    this._overlay.setVisible(true).setAlpha(0);
                    this._scene.tweens.addCounter(this._showTweenCfg);
                }
                handleResolutionChange() {
                    if (!this._btnOk.visible)
                        return;
                    let camera = Gameplay.Manager.instance.uiCamera;
                    let x = Gameplay.Manager.UI_LAYER_X + Math.floor((camera.width - this._panel.width) / 2);
                    this._panelTargetY = Gameplay.Manager.UI_LAYER_Y + Math.floor((camera.height - (this._panel.height + PanelNormal.BTN_OK_OFFSET + this._btnOk.height)) / 2);
                    if (this._state == 3) {
                        this._panel.setPosition(x, this._panelTargetY);
                    }
                    else {
                        this._panel.x = x;
                        this._panelStartY = Gameplay.Manager.UI_LAYER_Y - this._panel.height;
                    }
                    this._btnOk.y = this._panelTargetY + this._panel.height + PanelNormal.BTN_OK_OFFSET;
                    if (this._congratBox != null)
                        this._congratBox.y = this._panelTargetY + (this._panel.height - this._congratBox.height) / 2;
                    this._overlay.clear();
                    this._overlay.fillStyle(0, 0.75);
                    this._overlay.fillRect(Gameplay.Manager.UI_LAYER_X, Gameplay.Manager.UI_LAYER_Y, camera.width, camera.height);
                }
                showStar(starId) {
                    this._showStarId = starId;
                    this._stars[starId].visible = true;
                    this._showStarTweenCfg.targets = this._stars[starId].gameObject.setScale(3).setAlpha(0);
                    this._scene.tweens.add(this._showStarTweenCfg);
                    this._scene.sound.playAudioSprite("sfx", "star");
                }
                handleBtnOkClick() {
                    if (this._stepId == 0 && Game.Global.save.completeLevelCnt == Game.Global.levelGroups.length * Gameplay.Level.Group.LEVELS_PER_GROUP) {
                        this._btnOk.enabled = false;
                        this._congratBox.x = Gameplay.Manager.UI_LAYER_X + Game.Global.scale.maxWidth;
                        this._congratBox.setVisible(true);
                        this._state = 2;
                        this._stepId++;
                        let self = this;
                        this._scene.tweens.addCounter({
                            from: 0,
                            to: 1,
                            duration: 1000,
                            ease: Phaser.Math.Easing.Cubic.Out,
                            onUpdate: (tween) => {
                                let viewW = Game.Global.scale.maxWidth;
                                let value = tween.getValue();
                                self._panel.y = self._panelTargetY - (self._panelTargetY - self._panelStartY) * value;
                                self._congratBox.x = Gameplay.Manager.UI_LAYER_X + viewW + (((viewW - self._congratBox.width) / 2) - viewW) * value;
                            },
                            onComplete: () => {
                                self._panel.visible = false;
                                self._btnOk.enabled = true;
                                self._state = 3;
                            }
                        });
                        return;
                    }
                    this._onCompleteClb.call(this._clbCtx);
                }
                creeateCongratBox() {
                    this._congratBox = new Controls.Group.Group()
                        .setVisible(false);
                    this._congratBox.cameraFilter = this._overlay.cameraFilter;
                    this._congratBox.add(this._scene.add.image(0, 0, "atlas_0", "tutorial/textBox").setOrigin(0).setScale(2));
                    this._congratBox.add(this._scene.add.bitmapText(0, 0, "fntDefault", "GREAT JOB, YOU HAVE\nFINISHED ALL THE LEVELS!\nDO YOU WANT MORE LEVELS?\nLET US KNOW!", 38).setCenterAlign().setOrigin(0.5), 0, -16, 4 | 8, false);
                }
            }
            PanelNormal.ASSET_PREFIX = "results/";
            PanelNormal.BTN_OK_OFFSET = 40;
            Results.PanelNormal = PanelNormal;
        })(Results = Gameplay.Results || (Gameplay.Results = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Tutorial;
        (function (Tutorial) {
            class Manager {
                constructor(scene, tapFx, playfield) {
                    if (!Manager.levels) {
                        Manager.levels = [
                            new Gameplay.Level.Data(0, [2, 0, 1, 0], [0, 1, 1, 1], [5, 6, 13], [], 1),
                            new Gameplay.Level.Data(1, [5, 5, 5, 5], [5, 5, 5, 5], [5], [], 1),
                            new Gameplay.Level.Data(2, [5, 5, 5, 5], [5, 5, 5, 5], [1, 7, 12, 14], [], 1),
                        ];
                    }
                    this._scene = scene;
                    this._playfield = playfield;
                    this._events = new Phaser.Events.EventEmitter();
                    this._events.on("btn_click", this.handlePageBtnClick, this);
                    this._title = scene.add.image(Gameplay.Manager.UI_LAYER_X + Game.Global.scale.maxWidth + Game.Global.scale.maxWidth / 2, Gameplay.Manager.UI_LAYER_Y + 40, "atlas_0", Manager.ASSET_PREFIX + "title")
                        .setOrigin(0.5, 0)
                        .setVisible(false);
                    this._title.cameraFilter = ~Gameplay.Manager.instance.uiCamera.id;
                    this._textBox = new Tutorial.TextBox(this);
                    this._tapFx = tapFx;
                    this._freeCellConMarks = new Collections.Pool(undefined, 1, true, () => {
                        return new Tutorial.CellConMark(this, 90);
                    }, this);
                    this._actCellConMarks = new Collections.LinkedList(1);
                    this._steps = [
                        new Tutorial.Step1(this),
                        new Tutorial.Step2(this),
                        new Tutorial.Step3(this),
                        new Tutorial.Step4(this),
                    ];
                    this._complete = false;
                }
                get scene() { return this._scene; }
                get events() { return this._events; }
                get tapFx() { return this._tapFx; }
                get playfield() { return this._playfield; }
                get complete() { return this._complete; }
                reset() {
                    if (this._textBox.layer.visible) {
                        this._title.visible = false;
                        this._textBox.layer.visible = false;
                        this._steps[this._stepId].end();
                        this._tapFx.reset();
                        this.resetActCellConMarks();
                        this._complete = false;
                    }
                }
                show(mode) {
                    this._complete = false;
                    this._title.visible = true;
                    this._textBox.init();
                    if (mode == 0) {
                        this._textBox.showPage(0);
                        this._stepId = -1;
                    }
                    else {
                        this._stepId = -1;
                        this.startStep(0);
                    }
                    this.handleResolutionChange();
                }
                activateCellConMark() {
                    let mark = this._freeCellConMarks.getItem();
                    this._actCellConMarks.add(mark);
                    return mark;
                }
                releaseCellConMark(mark) {
                    mark.reset();
                    this._actCellConMarks.remove(mark);
                    this._freeCellConMarks.returnItem(mark);
                }
                handleResolutionChange() {
                    if (!this._textBox.layer.visible)
                        return;
                    let camera = Gameplay.Manager.instance.uiCamera;
                    let txbLayer = this._textBox.layer;
                    txbLayer.setPosition(Gameplay.Manager.UI_LAYER_X + camera.width + Math.round((camera.width - txbLayer.width) / 2), Gameplay.Manager.UI_LAYER_Y + camera.height - txbLayer.height - 20);
                }
                handlePageBtnClick(button) {
                    if (this._stepId < 0 || !Gameplay.Manager.instance.playfield.ready)
                        return;
                    Game.Global.game.sound.playAudioSprite("sfx", "menuClick");
                    if (button.id == 0) {
                        this.startStep(this._stepId - 1);
                    }
                    else {
                        if (this._textBox.lastPage) {
                            this._complete = true;
                            this._tapFx.reset();
                            this.resetActCellConMarks();
                            this._steps[this._stepId].end();
                            this._playfield.hide();
                        }
                        else {
                            this.startStep(this._stepId + 1);
                        }
                    }
                }
                startStep(stepId) {
                    if (this._stepId >= 0) {
                        this._tapFx.reset();
                        this.resetActCellConMarks();
                        this._steps[this._stepId].end();
                    }
                    this._textBox.showPage(stepId);
                    this._steps[stepId].start(this._stepId);
                    this._stepId = stepId;
                }
                resetActCellConMarks() {
                    this._actCellConMarks.forEach((mark) => {
                        this._freeCellConMarks.returnItem(mark.reset());
                        return true;
                    }, this);
                    this._actCellConMarks.clear();
                }
            }
            Manager.ASSET_PREFIX = "tutorial/";
            Manager.PLAYFIELD_TOP_PADDING = 94;
            Manager.PLAYFIELD_BOT_PADDING = 270;
            Tutorial.Manager = Manager;
        })(Tutorial = Gameplay.Tutorial || (Gameplay.Tutorial = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Gameplay;
    (function (Gameplay) {
        var Tutorial;
        (function (Tutorial) {
            class TextBox {
                constructor(manager) {
                    if (!TextBox.CONTENT) {
                        TextBox.CONTENT = [];
                        TextBox.CONTENT[0] = [
                            "Vedle každého stromu (" + "\u00BD" + ") musíš\npostavit stan (" + "\u00BC" + "). Ostatní políčka\nmusí být vyplněna trávou (" + "\u00BE" + ").",
                            "Čísla (" + "\u00C2" + ") ti říkají, kolik stanů (" + "\u00BC" + ")\nmusí stát v každé řadě a sloupci.",
                            "Každý stan (" + "\u00BC" + ") musí stát vedle\nstromu (" + "\u00BD" + "), ale nesmí být diagonálně.\n(" + "\u00BF" + " " + "\u00C0" + " " + "\u00C1" + ")",
                            "Stany (" + "\u00BC" + ") nesmí stát vedle sebe\nv žádném směru.",
                        ];
                        TextBox.CONTENT[1] = [
                            "You have to place one tent (" + "\u00BC" + ")\nnext to each tree (" + "\u00BD" + "). The other\ntiles must be filled with grass (" + "\u00BE" + ").",
                            "Numbers (" + "\u00C2" + ") tell you how many\ntents (" + "\u00BC" + ") must be in each row\nand column.",
                            "Each tent (" + "\u00BC" + ") must be next to a tree (" + "\u00BD" + ")\nbut not diagonally (" + "\u00BF" + " " + "\u00C0" + " " + "\u00C1" + ").",
                            "Tents (" + "\u00BC" + ") can't be placed\nnext to each other in any direction.",
                        ];
                        TextBox.CONTENT[2] = [
                            "Tienes que colocar una tienda (" + "\u00BC" + ")\nal lado de cada árbol (" + "\u00BD" + "). Los demás\ncuadrados deben tener hierba (" + "\u00BE" + ").",
                            "Los números (" + "\u00C2" + ") te dicen cuántas\ntiendas (" + "\u00BC" + ") caben en cada fila\ny columna.",
                            "Cada tienda (" + "\u00BC" + ") debe estar al lado de\nun árbol (" + "\u00BD" + ") pero no diagonalmente.\n(" + "\u00BF" + " " + "\u00C0" + " " + "\u00C1" + ")",
                            "Las tiendas (" + "\u00BC" + ") no pueden estar juntas\nen ninguna dirección.",
                        ];
                        TextBox.CONTENT[3] = [
                            "Нужно поставить палатку (" + "\u00BC" + ")\nу каждого дерево (" + "\u00BD" + ").\nОстальные ячейки должны быть\nзакрыты травой (" + "\u00BE" + ").",
                            "Числа (" + "\u00C2" + ") говорят вам, сколько\nпалаток (" + "\u00BC" + ") находится в каждой\nстроке и столбце.",
                            "Палатки (" + "\u00BC" + ") должны быть у\nдеревьев (" + "\u00BD" + "), только не по\nдиагонали (" + "\u00BF" + " " + "\u00C0" + " " + "\u00C1" + ").",
                            "Палатки (" + "\u00BC" + ") нельзя располагать\nрядом друг с другом, ни в каких\nнаправлениях.",
                        ];
                        TextBox.CONTENT[4] = [
                            "Você tem que colocar uma tenda (" + "\u00BC" + ")\nao lado de cada árvore (" + "\u00BD" + "). As outras\npeças devem ser preenchidas\ncom grama (" + "\u00BE" + ").",
                            "Os números (" + "\u00C2" + ") dizem a você quantas\ntendas (" + "\u00BC" + ") cabem em cada fila\ne coluna.",
                            "Cada tenda (" + "\u00BC" + ") deve estar ao lado de\numa árvore (" + "\u00BD" + ") mas não na diagonal.\n(" + "\u00BF" + " " + "\u00C0" + " " + "\u00C1" + ")",
                            "As tendas (" + "\u00BC" + ") não podem estar juntas\nem nenhuma direção.",
                        ];
                        TextBox.CONTENT[5] = [
                            "Trebuie să plasezi câte un cort (" + "\u00BC" + ")\nlângă fiecare copac (" + "\u00BD" + "). Celelalte\npătrate trebuie umplute cu iarbă (" + "\u00BE" + ").",
                            "Numerele (" + "\u00C2" + ") îți arată câte corturi (" + "\u00BC" + ")\nsunt pe fiecare rând și pe fiecare\ncoloană.",
                            "Fiecare cort (" + "\u00BC" + ") trebuie plasat lângă\nun copac (" + "\u00BD" + ") dar nu pe diagonală.\n(" + "\u00BF" + " " + "\u00C0" + " " + "\u00C1" + ")",
                            "Corturile (" + "\u00BC" + ") nu pot fi amplasate unul\nlângă altul în nicio direcție.",
                        ];
                    }
                    this._manager = manager;
                    this._layer = new Controls.Group.Group().setVisible(false);
                    this._layer.cameraFilter = ~Gameplay.Manager.instance.uiCamera.id;
                    this._layer.add(manager.scene.add.image(0, 0, "atlas_0", Tutorial.Manager.ASSET_PREFIX + "textBox").setOrigin(0, 0).setScale(2));
                    this._partContent = manager.scene.add.bitmapText(0, 0, "fntIntDef", "", 30).setCenterAlign().setOrigin(0.5);
                    this._layer.add(this._partContent, 0, -40, 4 | 8, false);
                    this._partPageId = new Controls.Group.Group();
                    this._partPageIdItems = [];
                    for (let pageId = 0; pageId < TextBox.CONTENT[0].length; pageId++)
                        this._partPageIdItems.push(this._partPageId.add(manager.scene.add.image(0, 0, "atlas_0", Tutorial.Manager.ASSET_PREFIX + "pageMark_0").setOrigin(0), pageId * 22, 0));
                    this._layer.add(this._partPageId, 0, -58, 4 | 2, false);
                    this._partBtnPrev = new Controls.Buttons.BasicButton(manager.scene, 0, 0, "atlas_0", Tutorial.Manager.ASSET_PREFIX + "btnPrev_")
                        .setEventEmitter(manager.events)
                        .setId(0);
                    this._layer.add(this._partBtnPrev, 30, -46, 2, false);
                    this._partBtnNext = new Controls.Buttons.BasicButton(manager.scene, 0, 0, "atlas_0", Tutorial.Manager.ASSET_PREFIX + "btnNext_", new Phaser.Geom.Rectangle(-20, -20, 111 + 40, 31 + 40))
                        .setEventEmitter(manager.events)
                        .setId(1);
                    this._layer.add(this._partBtnNext, -30, -46, 1 | 2, false);
                    this._pageId = -1;
                }
                get layer() { return this._layer; }
                get pageId() { return this._pageId; }
                get lastPage() { return this._pageId + 1 == TextBox.CONTENT[0].length; }
                init() {
                    this._partPageIdItems.forEach((img) => {
                        img.gameObject.setFrame(Tutorial.Manager.ASSET_PREFIX + "pageMark_0", false, false);
                    });
                    this._layer.visible = true;
                    this._pageId = -1;
                }
                showPage(pageId) {
                    if (this._pageId == pageId)
                        return;
                    this._partContent.setText(TextBox.CONTENT[Game.Global.language][pageId]);
                    this._layer.getItem(this._partContent).updatePosition();
                    if (this._pageId >= 0)
                        this._partPageIdItems[this._pageId].gameObject.setFrame(Tutorial.Manager.ASSET_PREFIX + "pageMark_0", false, false);
                    this._partPageIdItems[pageId].gameObject.setFrame(Tutorial.Manager.ASSET_PREFIX + "pageMark_1", false, false);
                    this._partBtnPrev.visible = pageId != 0;
                    this._partBtnNext.setImageFrakeKey(Tutorial.Manager.ASSET_PREFIX + (pageId + 1 < TextBox.CONTENT[0].length ? "btnNext_" : "btnOk_"));
                    this._pageId = pageId;
                }
            }
            Tutorial.TextBox = TextBox;
        })(Tutorial = Gameplay.Tutorial || (Gameplay.Tutorial = {}));
    })(Gameplay = Game.Gameplay || (Game.Gameplay = {}));
})(Game || (Game = {}));
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
                            item.gameObject.visible = visible;
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
                        item.gameObject.alpha = item.alpha * alpha;
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
                        item.gameObject.depth = depth + item.depth;
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
                        item.gameObject.cameraFilter = filter;
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
                    return;
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
            add(gameObject, offsetX = 0, offsetY = 0, alignment = 0, affectSize = true) {
                return this.addExisting(new Group_1.Item(gameObject, offsetX, offsetY, alignment, affectSize));
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
            getItem(gameObject) {
                let item = this._firstItem;
                while (item != null) {
                    if (item.gameObject == gameObject)
                        return item;
                    item = item.next;
                }
                return null;
            }
            every(callback, context) {
                this.everyItem((item) => {
                    return callback.call(context, item.gameObject);
                });
            }
            setItemsProperty(property, value) {
                this.everyItem((item) => {
                    let go = item.gameObject;
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
            constructor(gameObject, offsetX = 0, offsetY = 0, alignment = 0, affectGroupSize = true) {
                this._group = null;
                this._gameObject = gameObject;
                this._offsetX = offsetX;
                this._offsetY = offsetY;
                this._alignment = alignment;
                this._affectGroupSize = affectGroupSize;
                this._visible = gameObject.visible;
                this._alpha = gameObject.alpha;
                this._depth = gameObject.depth;
                this._flags = 0;
                if (Item.GO_WIDTH in gameObject)
                    this._flags |= 4;
                if (Item.GO_DISPLAY_WIDTH in gameObject)
                    this._flags |= 2;
                if (Item.GO_DISPLAY_ORIGIN_X in gameObject)
                    this._flags |= 1;
                if ((this._flags & (4 | 2)) == 0)
                    this._affectGroupSize = false;
                this.updateGroupOccupationArea();
            }
            get group() { return this._group; }
            get gameObject() { return this._gameObject; }
            get next() { return this._next; }
            get prev() { return this._prev; }
            get offsetX() { return this._offsetX; }
            set offsetX(x) { this.setOffsetX(x); }
            get offsetY() { return this._offsetY; }
            set offsetY(y) { this.setOffsetY(y); }
            get alignment() { return this._alignment; }
            get groupOccupationW() { return this._groupOccupationW; }
            get groupOccupationH() { return this._groupOccupationH; }
            get width() { return (this._flags & 2) != 0 ? this._gameObject[Item.GO_DISPLAY_WIDTH] : (this._flags & 4) != 0 ? this._gameObject[Item.GO_WIDTH] : 0; }
            get height() { return (this._flags & 2) != 0 ? this._gameObject[Item.GO_DISPLAY_HEIGHT] : (this._flags & 4) != 0 ? this._gameObject[Item.GO_HEIGHT] : 0; }
            get displayOriginX() { return (this._flags & 1) != 0 ? this._gameObject[Item.GO_DISPLAY_ORIGIN_X] : 0; }
            get displayOriginY() { return (this._flags & 1) != 0 ? this._gameObject[Item.GO_DISPLAY_ORIGIN_Y] : 0; }
            get visible() { return this._visible; }
            set visible(visible) { this.setVisible(visible); }
            get alpha() { return this._alpha; }
            set alpha(alpha) { this.setAlpha(alpha); }
            get depth() { return this._depth; }
            set depth(depth) { this.setDepth(depth); }
            get affectGroupSize() { return this._affectGroupSize; }
            destroy() {
                if (typeof this._gameObject["destroy"] == "function")
                    this._gameObject["destroy"]();
            }
            _addToGroup(group) {
                this._group = group;
                if (group == null)
                    return this;
                if (!group.visible)
                    this._gameObject.visible = false;
                this._gameObject.alpha = this._alpha * group.alpha;
                this._gameObject.depth = this._depth + group.depth;
                this._gameObject.cameraFilter = group.cameraFilter;
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
                    this._gameObject.x = this.getGameObjectX();
                }
                return this;
            }
            setOffsetY(y) {
                if (this._offsetY != y) {
                    this._offsetY = y;
                    this.updateGroupOccupationArea();
                    this._gameObject.y = this.getGameObjectY();
                }
                return this;
            }
            setVisible(visible) {
                if (this._visible != visible) {
                    this._visible = visible;
                    if (this._group == null) {
                        this._gameObject.setVisible(visible);
                    }
                    else {
                        this._gameObject.setVisible(visible && this._group.visible);
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
                    this._gameObject.alpha = alpha;
                }
                return this;
            }
            setDepth(depth) {
                if (this._depth != depth) {
                    this._depth = depth;
                    if (this._group != null)
                        depth += this._group.depth;
                    this._gameObject.depth = depth;
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
                this._gameObject.setPosition(this.getGameObjectX(), this.getGameObjectY());
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
        Item.GO_DISPLAY_ORIGIN_X = "displayOriginX";
        Item.GO_DISPLAY_ORIGIN_Y = "displayOriginY";
        Item.GO_DISPLAY_WIDTH = "displayWidth";
        Item.GO_DISPLAY_HEIGHT = "displayHeight";
        Item.GO_WIDTH = "width";
        Item.GO_HEIGHT = "height";
        Group.Item = Item;
    })(Group = Controls.Group || (Controls.Group = {}));
})(Controls || (Controls = {}));
var Helpers;
(function (Helpers) {
    class GameTimer {
        constructor() {
            this.time = 0;
            this.delta = 0;
            this._flags = 0;
        }
        get started() { return (this._flags & 1) != 0; }
        get paused() { return (this._flags & 2) != 0; }
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
                this.delta = delta;
            }
        }
        pause() {
            if ((this._flags & (1 | 2)) == 1)
                this._flags |= 2;
        }
        resume() {
            if ((this._flags & 2) != 0)
                this._flags &= ~2;
        }
    }
    Helpers.GameTimer = GameTimer;
})(Helpers || (Helpers = {}));
var Game;
(function (Game) {
    class Global {
        static get gameeGameStarted() { return Global._gameeGameStarted; }
        static set gameeGameStarted(val) {
            if ((Global._gameeGameStarted = val))
                Gamee2.Gamee.score = Global.save.totalScore;
        }
        static init() {
            Global.language = 1;
            Global.gameContext = "normal";
            Global.levelGroups = [
                new Game.Gameplay.Level.Group(0, [
                    new Game.Gameplay.Level.Data(19042701, [2, 0, 1, 1, 1], [2, 0, 2, 1, 0], [1, 4, 5, 17, 24], [], 4, [
                        new Game.Gameplay.Guide.Step([
                            "V řadách a sloupcích s 0 (" + "\u00C4" + ") nebudou\nžádné stany (" + "\u00BC" + "). Tapni na políčka\na proměň je na trávu (" + "\u00BE" + ").",
                            "Rows and columns with 0 (" + "\u00C4" + ")\nhave no tents (" + "\u00BC" + ").\nTap once on each tile to set grass (" + "\u00BE" + ").",
                            "Las filas y columnas con 0 (" + "\u00C4" + ")\nno admiten tiendas (" + "\u00BC" + ").\nToca una vez en cada cuadrado\npara convertirlo en hierba (" + "\u00BE" + ").",
                            "В столбцах и строках с 0 (" + "\u00C4" + ")\nпалаток нет (" + "\u00BC" + ").\nКоснитесь ячейки один раз,\nчтобы там была трава (" + "\u00BE" + ").",
                            "As filas e colunas com 0 (" + "\u00C4" + ")\nnão admitem tendas (" + "\u00BC" + ").\nToque uma vez em cada quadrado\npara convertê-lo em grama (" + "\u00BE" + ").",
                            "Rândurile și coloanele cu 0 (" + "\u00C4" + ")\nnu au corturi (" + "\u00BC" + ").\nApasă o dată pe fiecare pătrat\npentru a pune iarbă (" + "\u00BE" + ").",
                        ], [
                            new Game.Gameplay.Playfield.CellGoal(6, 1), new Game.Gameplay.Playfield.CellGoal(7, 1), new Game.Gameplay.Playfield.CellGoal(8, 1), new Game.Gameplay.Playfield.CellGoal(9, 1),
                            new Game.Gameplay.Playfield.CellGoal(11, 1), new Game.Gameplay.Playfield.CellGoal(16, 1), new Game.Gameplay.Playfield.CellGoal(20, 1), new Game.Gameplay.Playfield.CellGoal(21, 1),
                            new Game.Gameplay.Playfield.CellGoal(22, 1), new Game.Gameplay.Playfield.CellGoal(23, 1)
                        ], [1, 5, 24], [1, 6, 9]),
                        new Game.Gameplay.Guide.Step([
                            "U tohoto stromu (" + "\u00BD" + ") zbývá poslední\npolíčko, kde může stát stan (" + "\u00BC" + ").\nDvakrát tapni a postav stan (" + "\u00BC" + ").",
                            "Each tree (" + "\u00BD" + ") has to be paired with a tent (" + "\u00BC" + ").\nThere is only one tile left to place the tent (" + "\u00BC" + ").\nTap twice to place a tent (" + "\u00BC" + ").",
                            "Cada árbol (" + "\u00BD" + ") debe estar emparejado con\nuna tienda (" + "\u00BC" + "). Sólo puedes colocar\nuna tienda por cuadrado (" + "\u00BC" + ").\nToca dos veces para colocar una tienda (" + "\u00BC" + ").",
                            "Остается лишь одна ячейка, в которую\nможно поставить палатку (" + "\u00BC" + ").\nКоснитесь ее дважды, чтобы поставить\nпалатку (" + "\u00BC" + ").",
                            "Cada árvore (" + "\u00BD" + ") deve estar estar emparelhada\ncom uma tenda (" + "\u00BC" + "). Só pode colocar\numa tenda por quadrado (" + "\u00BC" + "). Toque duas\nvezes para colocar uma tenda (" + "\u00BC" + ").",
                            "Fiecare copac (" + "\u00BD" + ") trebuie să aibă un cort (" + "\u00BC" + ").\nMai există un singur pătrat unde\npoate fi amplasat cortul (" + "\u00BC" + ").\nApasă de două ori pentru a plasa cortul (" + "\u00BC" + ").",
                        ], [
                            new Game.Gameplay.Playfield.CellGoal(19, 2)
                        ], [24], [4, 8]),
                        new Game.Gameplay.Guide.Step([
                            "Okolo stanu (" + "\u00BC" + ") nesmí stát žádný jiný\nstan (" + "\u00BC" + "). Tady musíš dát trávu (" + "\u00BE" + ").",
                            "There can't be two tents (" + "\u00BC" + ") next to\neach other. Let's place grass (" + "\u00BE" + ") there.",
                            "No puede haber dos tiendas (" + "\u00BC" + ") juntas.\nColoca una hierba (" + "\u00BE" + ") ahí.",
                            "Нельзя, чтобы две палатки (" + "\u00BC" + ") стояли\nрядом друг с другом. Пусть здесь\nбудет трава (" + "\u00BE" + ").",
                            "Não pode haver duas tendas (" + "\u00BC" + ") juntas.\nColoque uma grama (" + "\u00BE" + ") aí.",
                            "Două corturi (" + "\u00BC" + ") nu pot fi plasate\nunul lângă altul. Acolo vom pune iarbă (" + "\u00BE" + ").",
                        ], [
                            new Game.Gameplay.Playfield.CellGoal(13, 1), new Game.Gameplay.Playfield.CellGoal(14, 1), new Game.Gameplay.Playfield.CellGoal(18, 1)
                        ], [19]),
                    ]),
                    new Game.Gameplay.Level.Data(19041802, [2, 1, 1, 0, 1], [1, 0, 2, 0, 2], [5, 13, 15, 16, 19], [], 4),
                    new Game.Gameplay.Level.Data(19041803, [1, 1, 1, 1, 1], [3, 0, 0, 1, 1], [1, 5, 9, 11, 22], [], 4),
                    new Game.Gameplay.Level.Data(19041804, [2, 0, 1, 1, 1], [0, 1, 2, 0, 2], [4, 5, 11, 15, 18], [], 4),
                    new Game.Gameplay.Level.Data(19041805, [1, 1, 1, 0, 2], [1, 1, 1, 1, 1], [3, 5, 12, 15, 19])
                ]),
                new Game.Gameplay.Level.Group(1, [
                    new Game.Gameplay.Level.Data(19041806, [1, 1, 2, 0, 2, 1], [1, 2, 0, 2, 0, 2], [1, 2, 17, 21, 23, 28, 32]),
                    new Game.Gameplay.Level.Data(19041807, [1, 2, 1, 2, 0, 2], [3, 0, 2, 1, 1, 1], [3, 6, 7, 11, 14, 25, 28, 29]),
                    new Game.Gameplay.Level.Data(19041808, [1, 1, 1, 1, 1, 2], [2, 0, 1, 1, 0, 3], [6, 10, 17, 20, 25, 32, 34], [0, 4, 14, 23, 31, 33, 35]),
                    new Game.Gameplay.Level.Data(19041809, [1, 1, 0, 2, 1, 2], [1, 1, 2, 0, 2, 1], [3, 8, 16, 18, 21, 26, 29]),
                    new Game.Gameplay.Level.Data(19041810, [1, 2, 1, 1, 1, 1], [1, 1, 1, 2, 0, 2], [0, 15, 17, 21, 24, 25, 34])
                ]),
                new Game.Gameplay.Level.Group(2, [
                    new Game.Gameplay.Level.Data(19041811, [1, 1, 2, 1, 1, 1], [2, 0, 1, 2, 0, 2], [2, 7, 15, 23, 24, 26, 29], [1, 3, 14, 18, 22, 32, 35]),
                    new Game.Gameplay.Level.Data(19041812, [2, 0, 3, 0, 2, 0], [1, 2, 0, 1, 1, 2], [6, 9, 14, 19, 26, 30, 35], [0, 8, 10, 20, 24, 32, 34]),
                    new Game.Gameplay.Level.Data(19041813, [1, 1, 1, 2, 1, 1], [0, 3, 0, 1, 1, 2], [2, 4, 12, 20, 26, 27, 34], [6, 8, 10, 21, 25, 33, 35]),
                    new Game.Gameplay.Level.Data(19041814, [2, 0, 2, 0, 2, 1], [1, 2, 0, 2, 1, 1], [3, 7, 16, 19, 21, 27, 34], [2, 6, 10, 18, 22, 26, 35]),
                    new Game.Gameplay.Level.Data(19041815, [1, 1, 1, 2, 1, 1], [1, 1, 2, 0, 1, 2], [2, 7, 10, 14, 18, 28, 31], [3, 11, 13, 15, 24, 32, 34])
                ]),
                new Game.Gameplay.Level.Group(3, [
                    new Game.Gameplay.Level.Data(19041816, [1, 2, 1, 1, 1, 1, 2], [4, 0, 1, 1, 1, 1, 1], [1, 5, 7, 13, 20, 23, 27, 31, 42]),
                    new Game.Gameplay.Level.Data(19041817, [0, 3, 1, 2, 0, 2, 1], [2, 1, 1, 0, 2, 0, 3], [0, 4, 6, 9, 26, 30, 40, 42, 44]),
                    new Game.Gameplay.Level.Data(19041818, [0, 3, 1, 2, 1, 0, 2], [3, 0, 2, 0, 2, 1, 1], [2, 5, 8, 19, 23, 24, 28, 40, 42]),
                    new Game.Gameplay.Level.Data(19041819, [1, 3, 0, 1, 2, 1, 1], [2, 1, 1, 2, 1, 1, 1], [0, 6, 9, 20, 22, 32, 35, 40, 44]),
                    new Game.Gameplay.Level.Data(19041820, [2, 1, 2, 1, 1, 1, 1], [1, 2, 1, 0, 3, 1, 1], [1, 8, 10, 19, 21, 25, 31, 40, 42])
                ]),
                new Game.Gameplay.Level.Group(4, [
                    new Game.Gameplay.Level.Data(19041821, [1, 0, 2, 0, 3, 0, 3], [2, 1, 2, 2, 0, 1, 1], [7, 8, 11, 13, 17, 22, 34, 47, 48], [4, 6, 9, 14, 18, 23, 27, 48, 53]),
                    new Game.Gameplay.Level.Data(19041822, [2, 0, 2, 1, 2, 1, 1], [1, 0, 1, 3, 1, 1, 2], [10, 14, 22, 25, 28, 34, 39, 45, 46], [3, 18, 21, 23, 27, 32, 35, 44, 47]),
                    new Game.Gameplay.Level.Data(19041823, [1, 2, 0, 2, 1, 0, 3], [3, 0, 2, 0, 1, 2, 1], [2, 4, 11, 13, 22, 36, 37, 41, 47], [1, 3, 6, 15, 18, 34, 35, 38, 48]),
                    new Game.Gameplay.Level.Data(19041824, [1, 1, 1, 2, 1, 0, 3], [2, 0, 2, 0, 2, 1, 2], [3, 10, 13, 21, 32, 33, 41, 43, 47], [2, 6, 14, 17, 31, 34, 36, 46, 48]),
                    new Game.Gameplay.Level.Data(19041825, [0, 3, 1, 1, 1, 1, 2], [2, 1, 1, 1, 1, 2, 1], [2, 11, 13, 19, 22, 23, 32, 34, 42], [2, 6, 10, 15, 26, 30, 39, 41, 43])
                ]),
                new Game.Gameplay.Level.Group(5, [
                    new Game.Gameplay.Level.Data(19041826, [3, 0, 2, 1, 1, 1, 2, 2], [1, 1, 1, 3, 0, 3, 0, 3], [1, 7, 19, 21, 23, 24, 32, 34, 38, 52, 59, 63]),
                    new Game.Gameplay.Level.Data(19041827, [0, 2, 2, 1, 2, 1, 2, 2], [2, 1, 2, 1, 1, 2, 0, 3], [3, 14, 20, 21, 25, 35, 39, 40, 45, 55, 57, 59]),
                    new Game.Gameplay.Level.Data(19041828, [2, 1, 2, 1, 1, 1, 2, 2], [1, 2, 1, 1, 2, 1, 1, 3], [5, 12, 14, 17, 20, 24, 31, 41, 48, 57, 62, 63]),
                    new Game.Gameplay.Level.Data(19041829, [3, 1, 1, 2, 0, 3, 0, 2], [1, 2, 1, 0, 3, 1, 1, 3], [1, 9, 12, 17, 27, 32, 38, 51, 53, 54, 57, 62]),
                    new Game.Gameplay.Level.Data(19041830, [2, 0, 2, 1, 3, 1, 1, 2], [1, 1, 1, 1, 2, 2, 1, 3], [3, 11, 19, 31, 33, 35, 45, 46, 50, 51, 57, 62])
                ]),
                new Game.Gameplay.Level.Group(6, [
                    new Game.Gameplay.Level.Data(19041831, [1, 2, 1, 1, 2, 2, 0, 3], [1, 2, 1, 1, 2, 1, 2, 2], [8, 10, 13, 31, 32, 36, 38, 44, 51, 54, 57, 59], [5, 9, 11, 23, 28, 33, 39, 45, 50, 55, 56, 60]),
                    new Game.Gameplay.Level.Data(19041832, [3, 0, 2, 0, 4, 0, 2, 1], [1, 3, 1, 0, 3, 0, 2, 2], [0, 2, 7, 12, 21, 30, 33, 37, 40, 55, 59, 61], [4, 8, 10, 15, 20, 32, 36, 38, 48, 54, 58, 60]),
                    new Game.Gameplay.Level.Data(19041833, [4, 0, 2, 1, 1, 1, 2, 1], [1, 2, 1, 1, 2, 1, 2, 2], [6, 8, 10, 17, 22, 24, 35, 45, 55, 56, 58, 62], [0, 11, 14, 16, 30, 32, 34, 44, 48, 50, 61, 63]),
                    new Game.Gameplay.Level.Data(19041834, [3, 0, 1, 2, 0, 3, 0, 3], [2, 2, 1, 2, 2, 1, 0, 2], [1, 8, 12, 19, 21, 23, 24, 38, 40, 46, 51, 62], [0, 2, 13, 15, 16, 27, 29, 32, 39, 45, 59, 63]),
                    new Game.Gameplay.Level.Data(19041835, [2, 1, 2, 1, 1, 2, 1, 2], [3, 1, 2, 1, 1, 1, 2, 1], [1, 8, 13, 14, 25, 27, 37, 38, 42, 53, 56, 62], [0, 2, 5, 15, 17, 19, 29, 34, 46, 48, 52, 63])
                ]),
                new Game.Gameplay.Level.Group(7, [
                    new Game.Gameplay.Level.Data(19041836, [4, 0, 2, 1, 2, 2, 1, 2, 2], [2, 1, 3, 1, 1, 3, 1, 1, 3], [6, 7, 14, 16, 18, 28, 29, 36, 42, 49, 52, 56, 63, 73, 77, 79], [5, 8, 9, 20, 23, 25, 27, 40, 45, 51, 53, 57, 70, 72, 74, 76]),
                    new Game.Gameplay.Level.Data(19041837, [2, 1, 2, 2, 1, 2, 2, 1, 3], [3, 0, 4, 0, 2, 2, 1, 1, 3], [8, 12, 14, 19, 22, 29, 33, 35, 36, 39, 56, 62, 64, 67, 78, 79], [3, 5, 7, 18, 20, 23, 26, 38, 42, 45, 53, 57, 69, 73, 76, 80]),
                    new Game.Gameplay.Level.Data(19041838, [1, 3, 0, 4, 0, 1, 3, 0, 4], [2, 2, 2, 1, 2, 2, 1, 1, 3], [4, 6, 9, 17, 25, 30, 34, 38, 43, 49, 50, 55, 57, 68, 71, 74], [3, 8, 10, 15, 21, 26, 33, 37, 44, 48, 51, 54, 66, 73, 77, 80]),
                    new Game.Gameplay.Level.Data(19041839, [3, 0, 2, 2, 2, 1, 3, 1, 2], [2, 2, 1, 3, 1, 2, 3, 1, 1], [1, 4, 5, 8, 19, 27, 29, 33, 41, 42, 55, 57, 62, 67, 70, 76], [2, 6, 13, 17, 18, 30, 32, 34, 36, 51, 53, 54, 56, 58, 69, 75]),
                    new Game.Gameplay.Level.Data(19041840, [5, 0, 3, 1, 1, 3, 0, 2, 1], [1, 2, 2, 2, 2, 2, 1, 2, 2], [1, 5, 12, 17, 19, 33, 34, 37, 38, 45, 49, 59, 61, 66, 73, 77], [0, 11, 14, 18, 26, 29, 32, 36, 43, 48, 50, 54, 65, 70, 72, 76])
                ]),
                new Game.Gameplay.Level.Group(8, [
                    new Game.Gameplay.Level.Data(19041841, [2, 2, 1, 3, 0, 4, 0, 4, 0], [1, 3, 0, 4, 0, 3, 1, 1, 3], [0, 4, 5, 19, 23, 25, 31, 35, 36, 38, 61, 63, 68, 70, 74, 78], [3, 9, 14, 16, 28, 30, 32, 34, 45, 47, 52, 59, 64, 75, 77, 79]),
                    new Game.Gameplay.Level.Data(19041842, [2, 2, 2, 2, 2, 1, 2, 1, 2], [3, 1, 4, 0, 3, 1, 0, 3, 1], [3, 5, 9, 11, 14, 17, 21, 27, 38, 40, 48, 57, 61, 63, 68, 71], [0, 2, 4, 15, 18, 20, 22, 26, 37, 39, 41, 52, 64, 66, 69, 80]),
                    new Game.Gameplay.Level.Data(19041843, [3, 1, 2, 1, 2, 2, 1, 2, 2], [1, 3, 0, 2, 2, 0, 4, 0, 4], [0, 1, 4, 18, 25, 31, 32, 45, 52, 55, 61, 68, 71, 74, 77, 79], [2, 9, 13, 16, 27, 30, 41, 43, 54, 56, 59, 62, 73, 76, 78, 80]),
                    new Game.Gameplay.Level.Data(19041844, [1, 3, 0, 3, 1, 3, 1, 2, 2], [3, 1, 2, 2, 0, 4, 0, 2, 2], [2, 4, 10, 14, 26, 27, 35, 39, 47, 50, 52, 59, 60, 72, 74, 79], [1, 3, 5, 17, 18, 23, 30, 34, 46, 49, 51, 53, 68, 70, 73, 75]),
                    new Game.Gameplay.Level.Data(19041845, [2, 1, 2, 2, 1, 3, 1, 1, 3], [2, 2, 1, 2, 2, 0, 3, 1, 3], [0, 2, 17, 23, 29, 30, 33, 35, 47, 52, 60, 62, 63, 73, 75, 77], [3, 8, 9, 14, 26, 28, 32, 39, 43, 54, 56, 59, 71, 74, 76, 78])
                ]),
                new Game.Gameplay.Level.Group(9, [
                    new Game.Gameplay.Level.Data(19041846, [4, 0, 3, 2, 2, 2, 1, 2, 2, 2], [3, 2, 1, 3, 1, 2, 2, 1, 2, 3], [7, 8, 10, 12, 14, 19, 31, 33, 40, 43, 50, 57, 65, 67, 72, 81, 82, 95, 96, 97]),
                    new Game.Gameplay.Level.Data(19041847, [3, 2, 1, 2, 2, 1, 3, 1, 3, 2], [2, 2, 1, 3, 0, 3, 1, 4, 0, 4], [7, 13, 15, 20, 26, 30, 38, 40, 44, 54, 57, 58, 60, 62, 69, 76, 81, 83, 88, 94]),
                    new Game.Gameplay.Level.Data(19041848, [1, 3, 2, 2, 1, 2, 3, 2, 2, 2], [3, 2, 0, 4, 0, 4, 1, 2, 2, 2], [1, 3, 4, 6, 8, 22, 28, 37, 40, 44, 53, 54, 56, 61, 68, 77, 82, 87, 92, 95]),
                    new Game.Gameplay.Level.Data(19041849, [3, 1, 3, 0, 3, 1, 2, 2, 0, 5], [3, 2, 2, 1, 2, 2, 2, 2, 3, 1], [0, 1, 3, 6, 19, 23, 34, 39, 40, 50, 55, 56, 60, 66, 69, 72, 88, 89, 94, 98]),
                    new Game.Gameplay.Level.Data(19041850, [2, 2, 1, 2, 2, 3, 1, 2, 1, 4], [1, 3, 1, 4, 1, 3, 1, 2, 2, 2], [12, 14, 15, 20, 23, 27, 28, 35, 38, 46, 53, 60, 69, 75, 76, 78, 82, 86, 95, 98])
                ]),
                new Game.Gameplay.Level.Group(10, [
                    new Game.Gameplay.Level.Data(19041851, [3, 2, 2, 1, 3, 2, 2, 1, 3, 1], [2, 3, 1, 3, 1, 3, 0, 4, 0, 3], [10, 11, 18, 21, 24, 26, 27, 33, 44, 50, 57, 63, 64, 65, 78, 81, 86, 88, 90, 96], [0, 8, 12, 14, 16, 20, 32, 34, 37, 40, 53, 55, 58, 71, 74, 76, 79, 91, 95, 98]),
                    new Game.Gameplay.Level.Data(19041852, [3, 2, 1, 2, 2, 2, 2, 3, 1, 2], [2, 3, 2, 2, 2, 2, 1, 2, 2, 2], [8, 10, 12, 16, 18, 21, 37, 39, 40, 43, 45, 46, 55, 62, 66, 88, 91, 92, 94, 98], [0, 7, 13, 15, 19, 20, 27, 33, 35, 41, 49, 54, 56, 61, 76, 78, 82, 84, 90, 97]),
                    new Game.Gameplay.Level.Data(19041853, [4, 1, 3, 0, 2, 2, 1, 3, 1, 3], [3, 2, 1, 4, 0, 3, 2, 1, 2, 2], [1, 3, 11, 18, 19, 24, 30, 33, 46, 47, 48, 55, 60, 61, 62, 68, 77, 80, 88, 96], [0, 4, 9, 12, 17, 20, 32, 34, 36, 38, 50, 52, 57, 65, 69, 71, 87, 89, 90, 95]),
                    new Game.Gameplay.Level.Data(19041854, [1, 4, 0, 2, 2, 2, 1, 3, 0, 5], [2, 2, 2, 1, 4, 0, 3, 1, 2, 3], [2, 4, 7, 8, 11, 19, 30, 36, 42, 44, 48, 54, 59, 61, 65, 77, 81, 88, 92, 94], [1, 9, 14, 17, 21, 29, 37, 40, 43, 45, 49, 64, 66, 69, 71, 87, 89, 91, 93, 95]),
                    new Game.Gameplay.Level.Data(19041855, [4, 1, 1, 3, 1, 1, 2, 2, 1, 4], [2, 2, 2, 2, 1, 4, 1, 2, 1, 3], [9, 10, 12, 13, 23, 26, 31, 38, 46, 52, 54, 57, 58, 65, 71, 80, 82, 86, 88, 89], [0, 3, 16, 19, 22, 24, 30, 39, 47, 51, 53, 55, 59, 67, 70, 79, 83, 90, 96, 98])
                ]),
                new Game.Gameplay.Level.Group(11, [
                    new Game.Gameplay.Level.Data(19041856, [4, 1, 3, 1, 2, 2, 3, 0, 4, 1, 3], [4, 1, 2, 3, 0, 3, 2, 4, 1, 2, 2], [1, 11, 16, 17, 19, 27, 30, 32, 33, 44, 46, 54, 59, 63, 66, 68, 75, 82, 84, 88, 94, 97, 102, 108], [0, 2, 5, 8, 21, 26, 28, 34, 41, 43, 55, 57, 60, 74, 76, 77, 79, 81, 83, 96, 99, 105, 113, 119]),
                    new Game.Gameplay.Level.Data(19041857, [4, 1, 2, 3, 2, 3, 1, 3, 0, 2, 3], [3, 2, 3, 1, 3, 2, 1, 2, 2, 2, 3], [2, 12, 16, 17, 21, 22, 26, 35, 40, 42, 45, 48, 60, 64, 70, 82, 85, 91, 99, 111, 112, 113, 116, 120], [3, 5, 10, 11, 18, 24, 27, 31, 33, 47, 49, 51, 56, 65, 69, 83, 86, 88, 92, 101, 109, 110, 114, 117]),
                    new Game.Gameplay.Level.Data(19041858, [4, 0, 3, 1, 3, 0, 5, 0, 3, 2, 3], [1, 4, 0, 3, 1, 4, 1, 2, 3, 1, 4], [0, 9, 10, 16, 28, 30, 34, 42, 44, 56, 61, 63, 70, 71, 80, 81, 88, 95, 100, 108, 109, 112, 117, 119], [8, 11, 15, 17, 21, 35, 41, 43, 50, 55, 57, 59, 64, 72, 77, 79, 92, 94, 97, 99, 113, 116, 118, 120]),
                    new Game.Gameplay.Level.Data(19041859, [3, 3, 3, 2, 2, 2, 1, 3, 0, 5, 0], [4, 1, 2, 2, 2, 1, 3, 1, 3, 2, 3], [0, 2, 16, 19, 20, 22, 24, 33, 35, 38, 53, 56, 61, 64, 72, 77, 91, 92, 98, 101, 104, 105, 111, 120], [1, 3, 5, 9, 18, 23, 25, 39, 42, 44, 46, 60, 67, 73, 75, 81, 88, 90, 97, 103, 106, 110, 112, 119]),
                    new Game.Gameplay.Level.Data(19041860, [3, 2, 2, 2, 3, 1, 2, 2, 2, 2, 3], [4, 2, 0, 4, 1, 2, 2, 2, 4, 0, 3], [5, 8, 11, 13, 14, 21, 31, 35, 37, 46, 51, 56, 66, 69, 73, 75, 80, 91, 95, 97, 109, 110, 114, 118], [0, 2, 6, 10, 15, 19, 34, 38, 40, 42, 47, 55, 62, 70, 76, 77, 79, 92, 94, 96, 98, 111, 113, 119])
                ]),
                new Game.Gameplay.Level.Group(12, [
                    new Game.Gameplay.Level.Data(19041861, [1, 3, 1, 4, 1, 3, 1, 4, 1, 3, 2], [3, 2, 2, 2, 3, 1, 1, 4, 1, 3, 2], [4, 6, 11, 21, 26, 29, 32, 37, 41, 44, 48, 50, 54, 63, 76, 78, 80, 89, 92, 106, 107, 113, 116, 118], [3, 5, 10, 12, 18, 25, 31, 38, 40, 45, 47, 53, 61, 74, 77, 79, 81, 87, 95, 100, 102, 108, 115, 117]),
                    new Game.Gameplay.Level.Data(19041862, [4, 1, 3, 1, 3, 2, 2, 3, 0, 4, 1], [5, 0, 1, 4, 0, 5, 0, 4, 1, 1, 3], [1, 3, 5, 18, 21, 22, 24, 28, 38, 42, 48, 56, 68, 71, 72, 75, 83, 87, 88, 92, 99, 104, 108, 118], [0, 2, 4, 7, 10, 31, 33, 35, 37, 39, 55, 57, 59, 61, 64, 77, 82, 84, 86, 91, 100, 115, 117, 119]),
                    new Game.Gameplay.Level.Data(19041863, [4, 1, 1, 4, 1, 3, 1, 3, 2, 2, 2], [1, 4, 0, 5, 0, 2, 4, 0, 3, 1, 4], [8, 12, 15, 27, 29, 32, 35, 39, 44, 52, 56, 58, 59, 63, 73, 75, 78, 90, 105, 106, 111, 112, 118, 120], [9, 11, 14, 16, 18, 33, 36, 38, 41, 43, 55, 57, 70, 72, 74, 76, 89, 91, 95, 104, 110, 113, 117, 119]),
                    new Game.Gameplay.Level.Data(19041864, [4, 1, 1, 4, 0, 4, 1, 2, 2, 1, 4], [3, 2, 2, 1, 3, 2, 2, 2, 2, 3, 2], [2, 4, 9, 15, 16, 20, 34, 43, 44, 49, 52, 54, 57, 70, 72, 76, 78, 90, 93, 100, 104, 106, 114, 120], [1, 5, 10, 14, 19, 27, 32, 33, 46, 51, 53, 55, 60, 69, 73, 77, 87, 91, 94, 99, 107, 109, 113, 115]),
                    new Game.Gameplay.Level.Data(19041865, [4, 1, 1, 3, 0, 4, 1, 4, 2, 3, 1], [4, 1, 3, 2, 3, 1, 2, 3, 1, 2, 2], [0, 6, 10, 15, 16, 23, 26, 30, 31, 33, 37, 38, 40, 57, 65, 72, 86, 88, 93, 94, 97, 99, 103, 119], [1, 5, 7, 9, 14, 22, 27, 29, 36, 42, 44, 49, 51, 64, 68, 73, 77, 82, 87, 96, 102, 105, 110, 118])
                ]),
                new Game.Gameplay.Level.Group(13, [
                    new Game.Gameplay.Level.Data(19041866, [2, 2, 1, 4, 1, 2, 3, 3, 2, 3, 3, 2], [6, 0, 3, 2, 2, 4, 1, 1, 1, 3, 0, 5], [1, 7, 9, 14, 16, 20, 22, 36, 39, 41, 44, 47, 51, 53, 56, 60, 66, 87, 89, 93, 104, 115, 117, 120, 131, 136, 140, 142], [0, 2, 4, 6, 8, 10, 27, 29, 34, 37, 43, 57, 59, 61, 63, 65, 67, 81, 90, 99, 114, 116, 118, 132, 135, 139, 141, 143]),
                    new Game.Gameplay.Level.Data(19041867, [2, 4, 1, 4, 0, 4, 1, 2, 2, 3, 1, 4], [3, 3, 3, 1, 2, 1, 4, 0, 5, 1, 2, 3], [10, 12, 14, 16, 20, 23, 26, 34, 47, 50, 51, 55, 68, 69, 72, 74, 78, 87, 95, 102, 106, 110, 113, 122, 127, 130, 133, 136], [0, 9, 11, 15, 17, 19, 25, 33, 35, 39, 49, 54, 70, 73, 75, 77, 80, 99, 101, 103, 105, 107, 109, 128, 131, 132, 134, 137]),
                    new Game.Gameplay.Level.Data(19041868, [3, 2, 3, 1, 2, 2, 2, 4, 1, 3, 3, 2], [4, 1, 3, 2, 2, 3, 1, 3, 0, 4, 1, 4], [5, 16, 17, 19, 21, 23, 25, 33, 40, 42, 48, 59, 61, 72, 74, 80, 88, 92, 93, 96, 105, 111, 113, 127, 129, 134, 138, 142], [4, 6, 9, 11, 13, 29, 31, 34, 36, 39, 54, 58, 60, 62, 68, 76, 86, 91, 94, 108, 110, 115, 117, 125, 133, 139, 141, 143]),
                    new Game.Gameplay.Level.Data(19041869, [4, 1, 3, 1, 3, 1, 4, 0, 5, 0, 5, 1], [2, 3, 3, 2, 2, 2, 3, 2, 2, 2, 2, 3], [4, 9, 16, 19, 21, 24, 25, 37, 47, 54, 57, 63, 70, 72, 78, 79, 81, 87, 90, 92, 96, 100, 106, 129, 130, 133, 135, 139], [3, 10, 12, 18, 20, 26, 28, 35, 36, 42, 56, 58, 60, 62, 77, 80, 82, 84, 86, 102, 104, 112, 118, 121, 128, 136, 138, 142]),
                    new Game.Gameplay.Level.Data(19041870, [2, 4, 0, 3, 3, 2, 3, 2, 1, 2, 2, 4], [4, 1, 3, 1, 3, 2, 2, 2, 3, 2, 1, 4], [2, 3, 5, 10, 12, 18, 28, 32, 47, 49, 52, 55, 65, 73, 75, 82, 83, 93, 94, 99, 113, 114, 121, 130, 131, 132, 136, 140], [1, 4, 6, 11, 20, 24, 27, 30, 46, 48, 51, 53, 67, 71, 76, 81, 85, 95, 100, 102, 105, 109, 119, 125, 133, 135, 139, 142])
                ]),
                new Game.Gameplay.Level.Group(14, [
                    new Game.Gameplay.Level.Data(19041871, [2, 3, 0, 5, 0, 5, 0, 5, 0, 3, 2, 3], [5, 1, 1, 4, 0, 4, 1, 5, 0, 2, 3, 2], [1, 4, 8, 10, 17, 25, 28, 29, 33, 42, 47, 48, 51, 64, 66, 71, 77, 84, 92, 94, 99, 110, 117, 124, 128, 129, 133, 142], [0, 3, 5, 7, 11, 21, 27, 37, 41, 43, 46, 60, 63, 65, 67, 83, 85, 87, 89, 91, 93, 111, 118, 121, 125, 127, 141, 143]),
                    new Game.Gameplay.Level.Data(19041872, [4, 1, 2, 2, 2, 3, 1, 4, 2, 1, 3, 3], [5, 0, 3, 3, 1, 4, 1, 1, 2, 3, 2, 3], [1, 3, 4, 7, 11, 23, 24, 27, 30, 33, 50, 56, 64, 70, 73, 77, 80, 91, 93, 108, 110, 118, 121, 124, 125, 127, 130, 139], [0, 2, 5, 8, 10, 28, 31, 35, 36, 38, 45, 55, 61, 63, 65, 71, 79, 94, 96, 103, 111, 113, 119, 120, 128, 136, 138, 142]),
                    new Game.Gameplay.Level.Data(19041873, [5, 1, 3, 0, 5, 0, 2, 2, 1, 4, 0, 5], [4, 2, 2, 1, 2, 4, 1, 2, 3, 2, 3, 2], [1, 3, 7, 16, 20, 35, 36, 40, 46, 52, 56, 67, 72, 73, 74, 83, 91, 92, 94, 96, 99, 106, 114, 120, 125, 128, 131, 133], [0, 2, 4, 6, 21, 23, 24, 28, 47, 55, 57, 60, 62, 64, 71, 80, 85, 95, 100, 103, 105, 108, 119, 124, 126, 129, 132, 134]),
                    new Game.Gameplay.Level.Data(19041874, [3, 2, 2, 2, 2, 3, 1, 4, 0, 4, 1, 4], [0, 4, 1, 5, 1, 3, 2, 1, 2, 3, 1, 5], [7, 14, 18, 24, 33, 34, 37, 38, 39, 43, 55, 59, 65, 74, 80, 83, 92, 95, 102, 110, 116, 120, 125, 131, 132, 136, 139, 142], [12, 17, 19, 22, 26, 36, 40, 42, 45, 47, 50, 64, 67, 71, 73, 81, 91, 101, 107, 108, 111, 117, 127, 133, 135, 137, 141, 143]),
                    new Game.Gameplay.Level.Data(19041875, [4, 1, 4, 1, 3, 1, 2, 2, 3, 1, 3, 3], [3, 3, 2, 2, 2, 3, 3, 0, 5, 0, 2, 3], [1, 8, 13, 20, 23, 27, 29, 32, 35, 49, 52, 60, 63, 65, 69, 71, 81, 88, 90, 92, 96, 111, 119, 123, 125, 133, 140, 141], [2, 9, 11, 12, 17, 19, 26, 34, 40, 44, 48, 59, 62, 66, 68, 72, 76, 82, 97, 99, 102, 104, 107, 122, 124, 132, 139, 142])
                ]),
                new Game.Gameplay.Level.Group(15, [
                    new Game.Gameplay.Level.Data(19043001, [2, 2, 1, 1, 3, 0, 2, 1], [2, 1, 3, 1, 1, 1, 1, 2], [0, 3, 15, 17, 21, 24, 31, 40, 44, 49, 59, 63], [1, 4, 14, 16, 18, 20, 30, 32, 43, 55, 57, 60]),
                    new Game.Gameplay.Level.Data(19043002, [2, 1, 2, 1, 1, 2, 1, 2], [2, 1, 3, 1, 0, 2, 0, 3], [2, 8, 10, 14, 15, 27, 29, 32, 46, 50, 55, 59], [1, 6, 11, 16, 21, 23, 26, 40, 45, 58, 60, 63]),
                    new Game.Gameplay.Level.Data(19043003, [1, 2, 1, 2, 1, 2, 1, 2], [1, 2, 1, 2, 1, 2, 1, 2], [4, 6, 8, 11, 23, 30, 41, 42, 47, 51, 53, 57], [7, 10, 12, 16, 29, 31, 33, 43, 46, 49, 59, 61]),
                    new Game.Gameplay.Level.Data(19043004, [3, 1, 1, 1, 2, 2, 1, 1], [1, 2, 1, 1, 2, 1, 3, 1], [1, 5, 12, 15, 25, 29, 32, 42, 48, 50, 52, 54], [4, 9, 14, 20, 24, 34, 37, 40, 51, 53, 55, 56]),
                    new Game.Gameplay.Level.Data(19043005, [2, 1, 1, 2, 1, 1, 0, 4], [2, 2, 1, 2, 1, 1, 2, 1], [5, 6, 8, 9, 19, 23, 27, 40, 44, 46, 50, 62], [1, 7, 11, 13, 16, 26, 31, 36, 47, 48, 51, 63])
                ], 1),
                new Game.Gameplay.Level.Group(16, [
                    new Game.Gameplay.Level.Data(19043006, [2, 1, 1, 1, 1, 2, 1, 3], [2, 1, 1, 1, 2, 1, 2, 2], [6, 8, 19, 21, 31, 34, 39, 45, 49, 53, 56, 62], [0, 7, 13, 23, 27, 33, 38, 44, 48, 50, 61, 63]),
                    new Game.Gameplay.Level.Data(19043007, [1, 2, 1, 2, 1, 2, 1, 2], [1, 3, 1, 1, 1, 2, 1, 2], [6, 8, 12, 19, 22, 29, 33, 41, 44, 49, 50, 54], [7, 9, 11, 13, 23, 28, 34, 40, 45, 51, 57, 62]),
                    new Game.Gameplay.Level.Data(19043008, [3, 0, 2, 1, 2, 1, 2, 1], [1, 1, 2, 2, 2, 1, 1, 2], [5, 19, 22, 23, 25, 26, 28, 41, 45, 46, 48, 60], [4, 14, 18, 20, 24, 31, 34, 37, 40, 54, 56, 59]),
                    new Game.Gameplay.Level.Data(19043009, [1, 1, 3, 1, 1, 1, 3, 1], [2, 1, 2, 1, 2, 1, 1, 2], [3, 10, 13, 14, 21, 25, 30, 42, 43, 59, 61, 62], [2, 6, 12, 18, 22, 24, 35, 38, 41, 53, 58, 63]),
                    new Game.Gameplay.Level.Data(19043010, [2, 1, 0, 3, 1, 1, 2, 2], [1, 3, 1, 1, 2, 1, 1, 2], [4, 9, 12, 23, 25, 27, 29, 37, 46, 49, 54, 58], [3, 8, 13, 15, 19, 30, 33, 36, 47, 48, 59, 62])
                ], 1),
                new Game.Gameplay.Level.Group(17, [
                    new Game.Gameplay.Level.Data(19043011, [2, 2, 1, 2, 3, 2, 1, 2, 2, 3], [2, 1, 2, 3, 0, 3, 1, 3, 1, 4], [0, 3, 9, 21, 24, 29, 33, 43, 47, 49, 51, 65, 76, 78, 80, 81, 84, 86, 93, 99], [4, 8, 10, 23, 25, 31, 37, 39, 53, 55, 59, 61, 74, 77, 79, 82, 90, 94, 96, 98]),
                    new Game.Gameplay.Level.Data(19043012, [3, 1, 4, 1, 3, 1, 2, 1, 2, 2], [3, 1, 1, 4, 1, 3, 1, 2, 3, 1], [1, 2, 4, 19, 25, 31, 33, 35, 48, 55, 56, 59, 61, 62, 81, 82, 83, 86, 89, 91], [3, 5, 9, 11, 26, 30, 32, 34, 38, 46, 52, 54, 58, 60, 72, 79, 80, 84, 87, 92]),
                    new Game.Gameplay.Level.Data(19043013, [3, 1, 4, 0, 3, 2, 3, 1, 1, 2], [3, 1, 2, 2, 2, 2, 2, 2, 1, 3], [8, 11, 14, 17, 21, 25, 26, 42, 43, 49, 50, 57, 67, 70, 73, 80, 85, 91, 96, 97], [1, 4, 9, 16, 22, 24, 36, 39, 40, 44, 52, 56, 60, 68, 72, 75, 87, 90, 92, 95]),
                    new Game.Gameplay.Level.Data(19043014, [2, 2, 3, 1, 4, 0, 3, 1, 3, 1], [2, 2, 2, 2, 2, 2, 1, 3, 1, 3], [5, 12, 14, 18, 20, 28, 32, 41, 44, 46, 47, 57, 60, 65, 79, 82, 87, 91, 95, 99], [2, 4, 10, 17, 24, 29, 31, 36, 43, 48, 51, 56, 64, 70, 72, 78, 86, 92, 94, 98]),
                    new Game.Gameplay.Level.Data(19043015, [4, 1, 2, 2, 1, 2, 1, 3, 1, 3], [3, 1, 3, 2, 2, 0, 5, 0, 2, 2], [1, 4, 12, 16, 23, 26, 30, 36, 39, 41, 48, 50, 54, 72, 77, 79, 88, 92, 93, 96], [0, 2, 5, 17, 20, 25, 29, 33, 37, 40, 49, 60, 62, 64, 67, 69, 83, 86, 91, 98])
                ], 1),
                new Game.Gameplay.Level.Group(18, [
                    new Game.Gameplay.Level.Data(19043016, [2, 2, 2, 3, 0, 3, 2, 1, 3, 2], [2, 2, 2, 2, 2, 2, 2, 2, 1, 3], [0, 9, 12, 14, 17, 19, 22, 36, 38, 50, 51, 52, 55, 67, 72, 81, 82, 86, 89, 96], [1, 8, 13, 15, 27, 29, 32, 35, 40, 48, 53, 56, 61, 68, 73, 76, 80, 92, 95, 99]),
                    new Game.Gameplay.Level.Data(19043017, [3, 1, 2, 2, 1, 3, 1, 3, 2, 2], [5, 0, 3, 1, 2, 2, 1, 3, 1, 2], [1, 3, 14, 16, 18, 22, 24, 35, 37, 49, 50, 58, 61, 67, 74, 80, 84, 88, 92, 96], [0, 2, 4, 6, 8, 23, 25, 27, 39, 40, 45, 57, 59, 62, 70, 75, 78, 83, 91, 97]),
                    new Game.Gameplay.Level.Data(19043018, [2, 2, 2, 3, 1, 3, 1, 2, 2, 2], [4, 1, 2, 2, 1, 4, 0, 2, 2, 2], [1, 5, 14, 19, 20, 23, 34, 38, 40, 52, 56, 57, 61, 69, 72, 79, 80, 84, 87, 94], [2, 4, 6, 9, 10, 22, 28, 30, 35, 47, 51, 53, 55, 59, 73, 78, 81, 85, 93, 97]),
                    new Game.Gameplay.Level.Data(19043019, [3, 1, 3, 2, 0, 3, 2, 1, 3, 2], [2, 2, 2, 1, 2, 2, 2, 3, 2, 2], [1, 15, 19, 20, 28, 32, 35, 41, 53, 57, 61, 69, 70, 76, 80, 84, 86, 87, 89, 97], [2, 5, 10, 18, 22, 25, 38, 40, 43, 56, 59, 60, 62, 75, 77, 79, 81, 83, 96, 98]),
                    new Game.Gameplay.Level.Data(19043020, [2, 3, 1, 3, 1, 1, 3, 2, 1, 3], [3, 1, 1, 3, 2, 3, 0, 2, 3, 2], [0, 8, 13, 15, 20, 23, 31, 35, 38, 43, 49, 56, 60, 66, 69, 81, 87, 91, 94, 97], [1, 3, 9, 16, 21, 33, 37, 39, 41, 45, 53, 57, 59, 70, 76, 82, 84, 88, 90, 96])
                ], 1),
                new Game.Gameplay.Level.Group(19, [
                    new Game.Gameplay.Level.Data(19043021, [1, 5, 1, 3, 1, 3, 2, 1, 2, 4, 0, 5], [5, 1, 3, 2, 1, 3, 1, 4, 1, 2, 2, 3], [2, 6, 8, 10, 12, 15, 23, 27, 30, 31, 46, 64, 71, 73, 75, 77, 78, 81, 86, 91, 108, 111, 117, 119, 126, 129, 131, 134], [1, 3, 5, 9, 11, 19, 24, 26, 35, 42, 45, 52, 61, 66, 69, 83, 85, 87, 89, 92, 107, 109, 116, 123, 125, 133, 141, 143]),
                    new Game.Gameplay.Level.Data(19043022, [2, 3, 2, 3, 3, 2, 4, 2, 1, 1, 2, 3], [4, 2, 3, 0, 5, 0, 2, 3, 1, 3, 2, 3], [4, 6, 10, 14, 16, 19, 31, 33, 36, 47, 49, 53, 55, 57, 61, 78, 83, 88, 96, 101, 108, 113, 122, 123, 124, 128, 131, 137], [3, 5, 7, 11, 13, 21, 28, 30, 35, 48, 50, 52, 54, 58, 73, 79, 87, 89, 95, 97, 111, 114, 116, 120, 130, 134, 136, 138]),
                    new Game.Gameplay.Level.Data(19043023, [5, 0, 5, 1, 4, 1, 3, 0, 4, 1, 2, 2], [4, 2, 4, 2, 2, 3, 1, 2, 1, 2, 1, 4], [1, 3, 11, 12, 16, 19, 20, 30, 31, 38, 40, 46, 48, 56, 63, 64, 67, 75, 84, 90, 94, 109, 122, 128, 129, 133, 135, 139], [0, 2, 4, 8, 18, 23, 24, 26, 28, 32, 42, 47, 52, 57, 60, 62, 66, 82, 87, 89, 96, 110, 116, 130, 132, 134, 136, 140]),
                    new Game.Gameplay.Level.Data(19043024, [3, 2, 2, 4, 2, 2, 2, 2, 1, 4, 1, 3], [3, 3, 2, 1, 4, 1, 2, 2, 1, 4, 2, 3], [0, 5, 6, 8, 9, 14, 28, 34, 52, 56, 57, 60, 63, 68, 71, 72, 99, 101, 103, 104, 113, 120, 122, 123, 126, 128, 130, 134], [2, 4, 10, 12, 18, 20, 27, 35, 45, 48, 51, 53, 55, 69, 73, 83, 87, 89, 105, 108, 110, 112, 115, 129, 131, 133, 135, 138]),
                    new Game.Gameplay.Level.Data(19043025, [4, 1, 4, 1, 3, 1, 4, 1, 4, 0, 3, 2], [3, 1, 3, 3, 2, 0, 4, 1, 3, 2, 2, 4], [3, 11, 13, 19, 25, 31, 38, 40, 45, 46, 48, 66, 76, 81, 83, 84, 92, 97, 102, 118, 120, 121, 124, 125, 127, 130, 133, 139], [1, 4, 7, 23, 26, 28, 30, 36, 44, 47, 50, 54, 72, 75, 80, 82, 90, 98, 104, 106, 108, 113, 122, 128, 132, 136, 138, 142])
                ], 1),
                new Game.Gameplay.Level.Group(20, [
                    new Game.Gameplay.Level.Data(19043026, [3, 1, 3, 2, 2, 2, 2, 3, 2, 3, 3, 2], [3, 2, 1, 4, 2, 4, 1, 3, 2, 1, 3, 2], [1, 5, 21, 22, 27, 29, 44, 46, 48, 50, 55, 56, 58, 60, 64, 69, 77, 87, 96, 98, 102, 103, 105, 110, 115, 117, 135, 142], [0, 6, 10, 15, 20, 34, 36, 38, 41, 43, 57, 59, 61, 63, 65, 67, 81, 86, 88, 90, 104, 106, 108, 122, 127, 129, 136, 143]),
                    new Game.Gameplay.Level.Data(19043027, [3, 3, 0, 3, 2, 1, 4, 1, 3, 3, 1, 4], [5, 0, 4, 1, 3, 2, 2, 3, 2, 1, 3, 2], [4, 5, 10, 13, 21, 23, 25, 30, 39, 45, 53, 57, 62, 66, 68, 72, 76, 81, 83, 90, 97, 99, 104, 116, 120, 135, 136, 143], [1, 3, 6, 9, 11, 24, 31, 33, 35, 40, 54, 56, 58, 61, 64, 78, 80, 84, 87, 95, 102, 105, 109, 123, 128, 131, 132, 137]),
                    new Game.Gameplay.Level.Data(19043028, [6, 0, 1, 4, 0, 3, 2, 1, 4, 1, 3, 3], [4, 1, 2, 3, 1, 2, 3, 2, 1, 4, 1, 4], [7, 9, 12, 15, 17, 20, 24, 33, 40, 48, 50, 59, 68, 78, 83, 87, 92, 96, 103, 110, 113, 116, 118, 120, 130, 133, 134, 138], [0, 3, 8, 10, 18, 32, 34, 36, 38, 41, 56, 60, 71, 75, 77, 80, 84, 95, 102, 108, 111, 117, 119, 125, 132, 135, 139, 142]),
                    new Game.Gameplay.Level.Data(19043029, [3, 3, 3, 2, 1, 3, 2, 2, 2, 2, 2, 3], [3, 2, 2, 3, 2, 2, 3, 1, 2, 3, 1, 4], [1, 3, 5, 9, 31, 35, 36, 38, 42, 48, 50, 56, 57, 59, 61, 76, 91, 93, 102, 109, 110, 112, 116, 126, 134, 135, 139, 142], [0, 2, 10, 17, 19, 24, 26, 41, 44, 47, 49, 51, 69, 71, 73, 77, 79, 94, 98, 100, 108, 114, 117, 123, 133, 138, 140, 143]),
                    new Game.Gameplay.Level.Data(19043030, [3, 2, 2, 2, 3, 2, 3, 1, 3, 1, 3, 3], [4, 1, 2, 3, 1, 3, 2, 2, 1, 3, 2, 4], [5, 10, 13, 18, 21, 25, 31, 32, 34, 50, 51, 58, 64, 69, 74, 77, 83, 84, 115, 118, 120, 121, 124, 125, 129, 130, 133, 137], [4, 6, 9, 11, 14, 24, 30, 39, 44, 46, 49, 65, 68, 70, 72, 75, 89, 95, 103, 109, 112, 119, 126, 128, 132, 134, 136, 142])
                ], 1),
                new Game.Gameplay.Level.Group(21, [
                    new Game.Gameplay.Level.Data(19060316, [4, 1, 2, 3, 1, 3, 2, 2, 2, 2, 3, 3], [2, 3, 1, 3, 3, 1, 4, 1, 3, 2, 2, 3], [4, 10, 13, 19, 20, 34, 46, 49, 51, 52, 56, 58, 60, 68, 70, 74, 78, 87, 101, 104, 109, 111, 112, 118, 127, 129, 133, 136], [3, 11, 12, 18, 21, 35, 37, 39, 45, 53, 55, 59, 62, 72, 77, 80, 82, 86, 100, 102, 106, 108, 116, 123, 130, 132, 137, 139]),
                    new Game.Gameplay.Level.Data(19060317, [1, 3, 1, 2, 4, 1, 3, 2, 4, 2, 2, 3], [3, 2, 3, 2, 1, 4, 0, 4, 1, 3, 1, 4], [1, 16, 17, 18, 20, 23, 35, 39, 43, 46, 59, 64, 70, 73, 74, 79, 80, 85, 89, 95, 110, 117, 120, 124, 126, 137, 139, 143], [4, 6, 8, 13, 22, 27, 29, 31, 45, 47, 52, 61, 67, 69, 71, 84, 86, 88, 92, 107, 111, 114, 116, 121, 136, 138, 140, 142]),
                    new Game.Gameplay.Level.Data(19060318, [3, 2, 2, 2, 2, 2, 4, 1, 4, 1, 2, 3], [4, 2, 1, 3, 2, 1, 3, 1, 4, 2, 1, 4], [3, 7, 12, 17, 18, 27, 29, 32, 34, 49, 52, 58, 67, 74, 82, 84, 86, 89, 90, 102, 106, 108, 116, 123, 125, 126, 141, 143], [0, 2, 6, 8, 16, 22, 30, 37, 39, 44, 53, 59, 68, 73, 78, 83, 88, 96, 98, 103, 107, 113, 117, 120, 135, 138, 140, 142]),
                    new Game.Gameplay.Level.Data(19060319, [4, 0, 4, 1, 2, 2, 3, 2, 2, 2, 1, 5], [2, 3, 1, 4, 1, 2, 1, 4, 1, 3, 1, 5], [11, 18, 21, 24, 26, 37, 39, 42, 54, 55, 57, 59, 64, 70, 72, 85, 91, 92, 99, 101, 107, 118, 131, 132, 133, 137, 140, 142], [6, 10, 12, 14, 20, 30, 36, 38, 45, 47, 53, 67, 71, 76, 84, 86, 90, 95, 104, 111, 113, 119, 120, 134, 136, 139, 141, 143]),
                    new Game.Gameplay.Level.Data(19060320, [3, 2, 1, 3, 1, 4, 2, 3, 1, 4, 0, 4], [2, 3, 2, 1, 3, 2, 0, 5, 0, 4, 2, 4], [6, 15, 17, 25, 28, 31, 32, 35, 37, 52, 54, 56, 58, 81, 83, 86, 89, 96, 101, 114, 116, 120, 127, 129, 130, 133, 134, 136], [3, 5, 13, 20, 23, 27, 29, 43, 49, 57, 59, 64, 66, 84, 87, 90, 93, 95, 108, 113, 115, 117, 122, 131, 132, 137, 139, 141]),
                ], 1),
                new Game.Gameplay.Level.Group(22, [
                    new Game.Gameplay.Level.Data(19060306, [4, 1, 1, 5, 1, 2, 3, 2, 4, 1, 4, 2, 3], [5, 1, 3, 2, 3, 2, 4, 2, 3, 0, 2, 4, 2], [1, 10, 13, 15, 16, 20, 21, 22, 24, 31, 43, 52, 60, 63, 64, 69, 75, 79, 81, 82, 87, 101, 102, 123, 125, 132, 135, 142, 144, 146, 150, 152, 161], [0, 2, 7, 9, 11, 17, 26, 34, 37, 42, 44, 53, 59, 62, 68, 77, 78, 83, 86, 88, 94, 103, 110, 112, 114, 133, 136, 143, 151, 153, 155, 159, 162]),
                    new Game.Gameplay.Level.Data(19060307, [5, 0, 5, 1, 3, 2, 2, 3, 2, 2, 3, 2, 3], [1, 4, 2, 2, 4, 3, 2, 3, 3, 3, 1, 3, 2], [4, 6, 10, 14, 20, 29, 37, 39, 41, 43, 59, 60, 62, 77, 79, 84, 87, 88, 91, 105, 107, 108, 110, 115, 121, 126, 134, 137, 142, 156, 157, 160, 165], [11, 13, 17, 19, 21, 28, 38, 46, 49, 52, 54, 56, 64, 71, 73, 75, 78, 80, 95, 100, 102, 104, 106, 111, 122, 127, 129, 133, 143, 150, 152, 158, 161]),
                    new Game.Gameplay.Level.Data(19060308, [3, 3, 3, 0, 5, 1, 2, 4, 2, 3, 2, 3, 2], [3, 2, 2, 3, 2, 2, 2, 2, 3, 1, 4, 1, 6], [2, 4, 19, 24, 27, 35, 37, 40, 43, 49, 59, 69, 71, 75, 84, 91, 92, 103, 108, 114, 118, 125, 127, 131, 136, 143, 147, 149, 153, 159, 161, 165, 168], [1, 5, 11, 20, 22, 28, 30, 46, 48, 50, 53, 56, 72, 74, 79, 90, 95, 97, 104, 112, 115, 119, 130, 134, 137, 140, 155, 156, 158, 160, 162, 164, 166]),
                    new Game.Gameplay.Level.Data(19060309, [4, 2, 3, 3, 3, 1, 3, 1, 5, 0, 2, 3, 3], [4, 1, 4, 3, 2, 2, 3, 3, 1, 4, 0, 5, 1], [6, 13, 15, 21, 24, 27, 30, 37, 41, 44, 46, 59, 62, 63, 78, 81, 82, 91, 95, 97, 99, 101, 102, 107, 115, 124, 131, 132, 144, 150, 152, 155, 159], [0, 2, 7, 11, 17, 26, 28, 34, 38, 43, 45, 49, 60, 64, 65, 68, 83, 86, 88, 92, 94, 103, 110, 118, 120, 125, 128, 143, 145, 149, 151, 154, 160]),
                    new Game.Gameplay.Level.Data(19060310, [4, 3, 2, 2, 3, 2, 3, 1, 2, 4, 1, 3, 3], [4, 1, 4, 1, 4, 2, 2, 3, 2, 2, 3, 2, 3], [0, 5, 8, 12, 18, 23, 40, 42, 47, 48, 50, 56, 64, 65, 72, 74, 83, 84, 91, 92, 103, 108, 113, 118, 120, 128, 131, 132, 137, 139, 148, 155, 157], [1, 4, 9, 11, 19, 27, 29, 34, 36, 51, 52, 55, 59, 61, 70, 77, 79, 87, 95, 97, 102, 104, 112, 119, 121, 130, 136, 141, 145, 152, 156, 161, 168])
                ], 1),
                new Game.Gameplay.Level.Group(23, [
                    new Game.Gameplay.Level.Data(19060311, [4, 1, 3, 1, 5, 0, 4, 1, 4, 2, 2, 2, 4], [4, 1, 4, 2, 2, 2, 3, 2, 2, 1, 5, 1, 4], [9, 13, 17, 23, 25, 26, 29, 31, 37, 40, 47, 49, 51, 56, 59, 67, 88, 89, 91, 99, 108, 111, 115, 117, 123, 125, 133, 135, 149, 152, 157, 160, 168], [4, 8, 10, 12, 14, 30, 32, 34, 38, 39, 41, 62, 64, 69, 72, 78, 80, 87, 95, 102, 110, 112, 128, 130, 132, 134, 136, 138, 155, 156, 159, 162, 165]),
                    new Game.Gameplay.Level.Data(19060312, [2, 3, 3, 3, 1, 3, 3, 3, 1, 4, 1, 4, 2], [2, 3, 1, 5, 0, 3, 2, 3, 2, 3, 3, 2, 4], [2, 10, 12, 13, 29, 31, 32, 33, 54, 58, 60, 62, 63, 64, 67, 83, 89, 101, 109, 110, 117, 119, 127, 134, 137, 138, 141, 144, 147, 158, 160, 162, 166], [1, 9, 16, 19, 25, 26, 41, 44, 46, 49, 51, 71, 73, 76, 80, 82, 97, 100, 102, 104, 106, 122, 124, 128, 131, 133, 139, 148, 154, 157, 159, 163, 165]),
                    new Game.Gameplay.Level.Data(19060313, [3, 3, 2, 2, 4, 1, 3, 2, 2, 3, 2, 3, 3], [3, 3, 2, 1, 3, 0, 4, 2, 4, 0, 5, 1, 5], [7, 15, 18, 21, 24, 28, 33, 36, 42, 48, 64, 66, 80, 82, 86, 90, 94, 97, 99, 105, 110, 116, 123, 127, 129, 135, 143, 146, 155, 157, 161, 163, 166], [2, 6, 8, 17, 23, 25, 27, 34, 43, 53, 61, 63, 79, 81, 85, 89, 96, 100, 104, 107, 111, 115, 130, 134, 136, 140, 142, 145, 156, 160, 162, 165, 168]),
                    new Game.Gameplay.Level.Data(19060314, [5, 1, 3, 2, 2, 3, 3, 0, 6, 0, 3, 3, 2], [4, 0, 4, 1, 4, 2, 2, 3, 2, 1, 3, 2, 5], [0, 4, 7, 12, 24, 39, 42, 46, 47, 49, 51, 55, 67, 72, 78, 83, 89, 96, 98, 104, 106, 126, 128, 131, 132, 145, 147, 148, 151, 154, 157, 163, 166], [1, 5, 8, 11, 26, 29, 34, 37, 45, 54, 56, 62, 64, 65, 73, 84, 88, 91, 93, 99, 109, 115, 125, 130, 133, 135, 153, 155, 156, 158, 160, 162, 164]),
                    new Game.Gameplay.Level.Data(19060315, [6, 0, 3, 2, 2, 4, 1, 3, 1, 2, 3, 0, 6], [5, 1, 3, 2, 3, 2, 4, 0, 5, 1, 2, 3, 2], [1, 2, 8, 11, 19, 25, 34, 35, 39, 41, 50, 53, 60, 65, 68, 70, 74, 89, 91, 96, 103, 105, 110, 119, 121, 124, 128, 130, 148, 151, 155, 161, 167], [0, 3, 7, 10, 12, 18, 26, 28, 33, 48, 51, 52, 54, 57, 73, 75, 78, 81, 83, 90, 104, 106, 109, 111, 116, 127, 134, 142, 143, 149, 152, 160, 168])
                ], 1),
                new Game.Gameplay.Level.Group(24, [
                    new Game.Gameplay.Level.Data(19060321, [2, 3, 2, 3, 2, 3, 1, 5, 0, 4, 3, 2, 3], [2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 4, 2, 3], [2, 11, 12, 19, 26, 29, 37, 41, 48, 52, 56, 59, 74, 79, 83, 84, 86, 89, 97, 101, 106, 129, 131, 134, 137, 140, 145, 146, 151, 152, 153, 156, 162], [3, 10, 13, 20, 25, 28, 30, 35, 46, 50, 53, 61, 69, 71, 87, 90, 92, 96, 98, 107, 114, 116, 118, 124, 133, 135, 139, 141, 143, 150, 158, 161, 166]),
                    new Game.Gameplay.Level.Data(19060322, [3, 3, 2, 4, 2, 3, 2, 2, 3, 0, 2, 4, 3], [4, 2, 3, 1, 3, 1, 3, 3, 2, 3, 2, 3, 3], [11, 13, 15, 17, 21, 24, 28, 32, 39, 42, 51, 55, 64, 73, 84, 93, 95, 97, 101, 103, 105, 114, 122, 124, 128, 132, 133, 134, 147, 152, 156, 161, 166], [0, 2, 4, 12, 20, 23, 27, 29, 38, 45, 52, 60, 63, 68, 83, 88, 90, 92, 94, 98, 109, 115, 118, 120, 125, 135, 141, 143, 145, 151, 160, 162, 167]),
                    new Game.Gameplay.Level.Data(19060323, [2, 4, 3, 3, 2, 2, 3, 2, 1, 3, 3, 3, 2], [4, 2, 4, 1, 4, 0, 5, 1, 3, 1, 4, 1, 3], [2, 6, 10, 14, 17, 21, 33, 38, 39, 41, 49, 54, 59, 64, 66, 79, 86, 88, 91, 95, 101, 107, 111, 120, 122, 123, 132, 144, 153, 154, 155, 162, 166], [1, 3, 5, 8, 23, 25, 26, 28, 30, 32, 48, 53, 55, 58, 63, 78, 80, 82, 87, 89, 98, 106, 109, 114, 124, 131, 133, 140, 142, 149, 157, 165, 167]),
                    new Game.Gameplay.Level.Data(19060324, [4, 2, 3, 2, 4, 2, 2, 3, 0, 4, 1, 3, 3], [3, 2, 4, 2, 4, 0, 4, 1, 2, 2, 4, 1, 4], [13, 15, 16, 21, 25, 31, 32, 37, 39, 42, 44, 50, 53, 59, 66, 71, 77, 81, 88, 93, 103, 104, 111, 119, 121, 126, 128, 137, 144, 148, 161, 164, 168], [0, 3, 12, 19, 22, 26, 28, 30, 38, 46, 49, 52, 55, 57, 64, 79, 82, 84, 87, 102, 106, 108, 117, 124, 132, 135, 139, 141, 150, 157, 160, 165, 167]),
                    new Game.Gameplay.Level.Data(19060325, [4, 1, 4, 2, 3, 3, 2, 1, 3, 1, 3, 1, 5], [2, 4, 2, 3, 3, 2, 1, 3, 2, 1, 4, 1, 5], [3, 11, 18, 24, 25, 26, 32, 33, 40, 44, 54, 60, 75, 77, 78, 82, 83, 87, 93, 98, 102, 107, 129, 131, 136, 137, 142, 144, 145, 146, 148, 151, 153], [2, 12, 13, 17, 19, 23, 34, 38, 39, 41, 43, 59, 62, 64, 65, 70, 81, 97, 100, 103, 106, 108, 128, 130, 132, 135, 138, 155, 157, 159, 161, 164, 166])
                ], 1),
                new Game.Gameplay.Level.Group(25, [
                    new Game.Gameplay.Level.Data(19060326, [3, 3, 1, 3, 2, 2, 4, 0, 3, 1, 5, 2, 4], [4, 1, 2, 3, 2, 3, 2, 4, 1, 1, 5, 1, 4], [5, 13, 16, 23, 24, 31, 35, 40, 43, 47, 50, 53, 63, 64, 69, 80, 86, 89, 90, 93, 109, 113, 117, 124, 128, 133, 135, 139, 152, 154, 156, 159, 162], [0, 3, 6, 10, 25, 32, 36, 39, 42, 51, 60, 62, 66, 70, 77, 81, 88, 92, 96, 99, 103, 114, 123, 130, 132, 134, 138, 141, 149, 157, 160, 165, 167]),
                    new Game.Gameplay.Level.Data(19060327, [5, 2, 2, 4, 2, 2, 3, 3, 3, 1, 2, 2, 2], [2, 4, 1, 3, 3, 3, 1, 4, 3, 1, 3, 2, 3], [1, 2, 10, 25, 27, 30, 33, 34, 52, 55, 57, 58, 61, 65, 73, 77, 81, 94, 98, 102, 111, 114, 117, 119, 134, 136, 137, 143, 147, 153, 156, 158, 164], [0, 9, 15, 17, 20, 24, 26, 42, 45, 47, 53, 62, 64, 68, 70, 72, 78, 95, 97, 101, 103, 104, 106, 112, 123, 130, 133, 138, 148, 154, 157, 159, 163]),
                    new Game.Gameplay.Level.Data(19060328, [5, 1, 4, 1, 4, 1, 4, 1, 2, 3, 2, 2, 3], [2, 2, 3, 3, 2, 4, 1, 4, 1, 4, 1, 2, 4], [0, 9, 24, 30, 33, 34, 39, 40, 44, 54, 56, 59, 63, 66, 74, 80, 83, 84, 89, 104, 107, 108, 110, 111, 118, 138, 141, 143, 148, 155, 159, 160, 166], [1, 10, 17, 20, 26, 35, 37, 41, 43, 45, 60, 64, 65, 67, 70, 75, 90, 91, 93, 95, 97, 112, 117, 120, 123, 128, 139, 147, 149, 156, 158, 165, 168]),
                    new Game.Gameplay.Level.Data(19060329, [5, 1, 3, 2, 1, 3, 2, 3, 3, 2, 3, 1, 4], [3, 2, 3, 2, 3, 3, 2, 1, 4, 2, 2, 2, 4], [2, 3, 5, 7, 19, 24, 25, 36, 40, 46, 47, 51, 52, 55, 68, 73, 81, 84, 94, 102, 108, 114, 115, 117, 132, 136, 137, 143, 155, 157, 162, 165, 166], [1, 6, 8, 16, 23, 32, 34, 38, 39, 49, 54, 59, 64, 65, 69, 74, 80, 85, 103, 104, 107, 109, 113, 124, 128, 130, 135, 145, 153, 156, 161, 164, 168]),
                    new Game.Gameplay.Level.Data(19060330, [2, 4, 2, 2, 2, 3, 1, 4, 2, 3, 3, 1, 4], [4, 2, 3, 3, 2, 3, 1, 4, 1, 3, 1, 4, 2], [1, 4, 9, 12, 19, 21, 28, 32, 35, 38, 39, 43, 46, 50, 53, 61, 70, 78, 89, 92, 111, 113, 117, 126, 129, 130, 134, 137, 145, 149, 151, 167, 168], [3, 6, 8, 10, 14, 25, 29, 31, 34, 40, 49, 51, 56, 59, 66, 74, 76, 83, 91, 93, 98, 100, 116, 118, 121, 124, 139, 143, 148, 150, 155, 158, 166])
                ], 1),
            ];
            Global._levels = new Phaser.Structs.Map();
            Global.levelGroups.forEach((group) => {
                group.levels.forEach((level) => {
                    Global._levels.set(level.uid, level);
                });
            });
            Global.levelsTimeLock = new Game.Gameplay.Level.TimeLock();
            Global.battleLevels = [
                new Game.Gameplay.Level.Data(19050201, [2, 1, 3, 0, 3, 1, 1, 1], [3, 1, 1, 1, 1, 1, 2, 2], [1, 3, 8, 14, 17, 29, 41, 44, 48, 50, 60, 62], [0, 2, 4, 15, 21, 25, 36, 42, 52, 54, 56, 58]),
                new Game.Gameplay.Level.Data(19050202, [1, 2, 1, 1, 2, 1, 3, 1], [1, 2, 1, 2, 1, 1, 2, 2], [1, 14, 20, 26, 30, 31, 43, 45, 57, 58, 60, 61], [6, 9, 12, 23, 25, 29, 35, 46, 50, 52, 56, 62]),
                new Game.Gameplay.Level.Data(19050203, [1, 2, 1, 1, 1, 3, 0, 3], [1, 1, 1, 2, 2, 1, 1, 3], [10, 12, 20, 29, 30, 35, 39, 41, 48, 49, 55, 62], [4, 9, 21, 27, 31, 33, 37, 47, 50, 56, 61, 63]),
                new Game.Gameplay.Level.Data(19050204, [1, 3, 1, 2, 1, 1, 1, 2], [3, 1, 2, 0, 2, 2, 1, 1], [2, 6, 11, 16, 21, 24, 27, 35, 43, 46, 50, 54], [1, 3, 7, 13, 17, 19, 32, 34, 44, 47, 49, 62]),
                new Game.Gameplay.Level.Data(19050205, [3, 1, 1, 1, 2, 1, 2, 1], [2, 0, 3, 1, 2, 0, 3, 1], [1, 8, 14, 20, 27, 32, 35, 39, 46, 48, 49, 51], [0, 6, 16, 19, 21, 31, 33, 36, 50, 52, 54, 56]),
                new Game.Gameplay.Level.Data(19050206, [2, 2, 1, 2, 2, 0, 1, 2], [1, 1, 2, 1, 2, 1, 1, 3], [0, 17, 19, 22, 25, 27, 35, 37, 50, 57, 59, 63], [1, 11, 16, 23, 28, 33, 38, 43, 55, 56, 58, 60]),
                new Game.Gameplay.Level.Data(19050207, [2, 1, 1, 1, 2, 1, 1, 3], [1, 2, 1, 1, 2, 1, 3, 1], [1, 5, 15, 18, 24, 30, 35, 46, 51, 53, 56, 61], [7, 9, 13, 19, 31, 32, 36, 47, 48, 50, 52, 62]),
                new Game.Gameplay.Level.Data(19050208, [2, 1, 1, 2, 1, 1, 1, 3], [2, 1, 1, 2, 1, 1, 3, 1], [3, 5, 8, 22, 26, 27, 38, 40, 50, 52, 54, 60], [0, 6, 11, 23, 25, 28, 39, 42, 48, 53, 55, 59]),
                new Game.Gameplay.Level.Data(19050209, [2, 2, 1, 1, 1, 2, 1, 2], [1, 2, 1, 2, 1, 1, 1, 3], [3, 7, 8, 13, 17, 23, 32, 35, 47, 48, 50, 53], [6, 9, 11, 21, 25, 31, 36, 40, 55, 56, 58, 61]),
                new Game.Gameplay.Level.Data(19050210, [2, 2, 1, 2, 1, 2, 1, 1], [2, 1, 1, 1, 2, 1, 2, 2], [1, 3, 6, 25, 27, 28, 33, 36, 45, 47, 51, 56], [0, 2, 14, 20, 24, 35, 37, 41, 53, 55, 57, 59]),
            ];
            Global.save = new Game.Save.Manager();
            let config = {
                type: Phaser.AUTO,
                width: 640,
                height: 960,
                physics: null,
                scale: {
                    mode: Phaser.Scale.NONE,
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
            };
            let game = Global.game = new Phaser.Game(config);
            game.scene.add("loader", Game.LoaderScene);
            game.scene.add("levelSelect", Game.LevelSelect.MainScene);
            game.scene.add("gameplayMain", Game.Gameplay.MainScene);
            game.scene.start("loader");
            Global.scale = new Helpers.ScaleManager(game.scale, new Phaser.Geom.Point(640, 836), new Phaser.Geom.Point(640, 1280));
            Global.scale.resize();
            Gamee2.Gamee.events.on("audioChange", (on) => { Global.game.sound.mute = !on; }, this);
        }
        static getLevelById(id) {
            return Global.levelGroups[Math.floor(id / Game.Gameplay.Level.Group.LEVELS_PER_GROUP)].levels[id % Game.Gameplay.Level.Group.LEVELS_PER_GROUP];
        }
        static getLevelByUID(uid) {
            return Global._levels.get(uid);
        }
        static getRndBattleLevel() {
            let levels = [];
            Global.battleLevels.forEach((level) => {
                if (!level.complete)
                    levels.push(level);
            });
            if (levels.length == 0)
                levels = Global.battleLevels;
            return levels[Phaser.Math.RND.integerInRange(0, levels.length - 1)];
        }
    }
    Global.languageCodes = ["cs", "en", "es", "ru", "pt", "ro"];
    Global._gameeGameStarted = false;
    Global.sceneSleepPars = { sleep: true };
    Game.Global = Global;
    window.onload = function () {
        Global.init();
    };
})(Game || (Game = {}));
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
var Game;
(function (Game) {
    var LevelSelect;
    (function (LevelSelect) {
        class LevelButton extends Controls.Buttons.BasicButton {
            constructor(scene) {
                let shadow = scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "btnShadow")
                    .setOrigin(0, 0);
                super(scene, 0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "btnA_");
                this._shadow = shadow;
                this._number = scene.add.bitmapText(0, 0, "fntNumsC0", "0", 38)
                    .setOrigin(0.5, 0);
                this._pressOverlay = scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "btnPress")
                    .setOrigin(0, 0)
                    .setVisible(false);
                this._rating = scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "rating_1")
                    .setOrigin(0.5, 0);
                if (!LevelButton._freeAvatars) {
                    LevelButton._freeAvatars = new Collections.Pool(undefined, 0, true, () => {
                        return new LevelSelect.Avatar(scene);
                    });
                }
                this._avatars = [];
                this._level = null;
            }
            get level() { return this._level; }
            set level(level) {
                this._level = level;
                this.setContent(level);
            }
            setPosition(x, y) {
                let center = x + this._image.width / 2;
                super.setPosition(x, y);
                this._shadow.setPosition(center - this._shadow.width / 2, y + 30);
                this._number.setPosition(center, y + 40);
                this._rating.setPosition(center, y + 102);
                this._pressOverlay.setPosition(x, y);
                for (let i = 0; i < this._avatars.length; i++)
                    this._avatars[i].panel.setPosition(x + LevelButton.AVATAR_OFFSET_X + i * LevelButton.AVATARS_SPACING, y + LevelButton.AVATAR_OFFSET_Y);
                return this;
            }
            updateAvatars() {
                if (this._level != null && this._level.friendCnt != 0) {
                    let avatarCnt = 0;
                    for (let i = 0; i < this._level.friendCnt && avatarCnt != LevelButton.AVATAR_MAX_CNT; i++) {
                        let friend = this._level.getFriend(i);
                        if (friend.avatarLoaded) {
                            let avatar;
                            if (i < this._avatars.length) {
                                avatar = this._avatars[i];
                            }
                            else {
                                avatar = LevelButton._freeAvatars.getItem();
                                this._avatars.push(avatar);
                            }
                            avatar.show(this.x + LevelButton.AVATAR_OFFSET_X + i * LevelButton.AVATARS_SPACING, this.y + LevelButton.AVATAR_OFFSET_Y, this._level.getFriend(i).avatarKey, 10 + i);
                            avatarCnt++;
                        }
                    }
                    if (avatarCnt < this._avatars.length) {
                        for (let i = avatarCnt; i < this._avatars.length; i++) {
                            let avatar = this._avatars[i];
                            avatar.panel.visible = false;
                            LevelButton._freeAvatars.returnItem(avatar);
                        }
                        this._avatars.length = avatarCnt;
                    }
                }
                else {
                    this._avatars.forEach((avatar) => {
                        avatar.panel.visible = false;
                        LevelButton._freeAvatars.returnItem(avatar);
                    });
                    this._avatars.length = 0;
                }
            }
            handleVisibleChange(visible) {
                super.handleVisibleChange(visible);
                this._shadow.visible = visible;
                this._number.visible = visible;
                this._rating.visible = visible;
                if (!visible)
                    this._pressOverlay.visible = false;
                for (let i = 0; i < this._avatars.length; i++)
                    this._avatars[i].panel.visible = visible;
            }
            handleStateChange(state) {
                this._pressOverlay.visible = (state == 1);
            }
            setContent(level) {
                if (level != null) {
                    this._number.setFont(level.complete || level.partiallyComplete ? "fntNumsC1" : "fntNumsC0");
                    this._number.setScale(1);
                    this._number.setText((level.id + 1).toString());
                    if (this._number.width > LevelButton.NUMBER_MAX_WIDTH)
                        this._number.setScale(LevelButton.NUMBER_MAX_WIDTH / this._number.width);
                    this._imageFrameKey = LevelSelect.MainScene.ASSET_PREFIX + "btn" + (level.partiallyComplete ? "C_" : level.complete ? "B_" : "A_");
                    this._image.setFrame(this._imageFrameKey + 0);
                    if (level.complete) {
                        this._rating.setFrame(LevelSelect.MainScene.ASSET_PREFIX + "rating_" + level.rating)
                            .setVisible(true);
                    }
                    else {
                        this._rating.setVisible(false);
                    }
                }
                this.updateAvatars();
            }
        }
        LevelButton.AVATAR_OFFSET_X = 21;
        LevelButton.AVATAR_OFFSET_Y = 70;
        LevelButton.AVATARS_SPACING = 22;
        LevelButton.AVATAR_MAX_CNT = 2;
        LevelButton.NUMBER_MAX_WIDTH = 55;
        LevelSelect.LevelButton = LevelButton;
    })(LevelSelect = Game.LevelSelect || (Game.LevelSelect = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var LevelSelect;
    (function (LevelSelect) {
        class BonusLevelButton extends LevelSelect.LevelButton {
            constructor(scene) {
                let stroke = scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "btnStroke")
                    .setOrigin(0, 0)
                    .setVisible(false);
                super(scene);
                this._stroke = stroke;
                this._crown = scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "btnCrown")
                    .setOrigin(0, 0)
                    .setVisible(false);
                this._lock = scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "btnLock")
                    .setVisible(false);
            }
            setPosition(x, y) {
                super.setPosition(x, y);
                this._stroke.setPosition(x - 7, y + 18);
                this._crown.setPosition(x + 40, y - 35);
                this._lock.setPosition(x + this._image.width / 2, y + 90);
                return this;
            }
            unlockBonusLevel() {
                this._scene.add.tween({
                    targets: this._lock,
                    scaleX: { value: 2, ease: Phaser.Math.Easing.Cubic.Out },
                    scaleY: { value: 2, ease: Phaser.Math.Easing.Cubic.Out },
                    alpha: 0,
                    duration: 1000,
                    delay: 1000,
                    onComplete: () => { Game.Global.save.newBonusLevelId = -1; this.enabled = true; }
                });
            }
            handleVisibleChange(visible) {
                super.handleVisibleChange(visible);
                this._stroke.visible = visible;
                this._crown.visible = visible;
                if (this._level)
                    this._lock.visible = visible && !this._level.unlocked;
            }
            setContent(level) {
                super.setContent(level);
                if (this._visible) {
                    if ((this._lock.visible = !this._level.unlocked))
                        this._lock.setScale(1).setAlpha(1);
                }
            }
        }
        LevelSelect.BonusLevelButton = BonusLevelButton;
    })(LevelSelect = Game.LevelSelect || (Game.LevelSelect = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var LevelSelect;
    (function (LevelSelect) {
        class ListBoxItem extends Controls.ListBox.ListBoxItem {
            constructor(listBox) {
                let scene = listBox.scene;
                if (!ListBoxItem._timeLockLayer) {
                    let layer = ListBoxItem._timeLockLayer = new Controls.Group.Group();
                    layer.setVisible(false);
                    layer.add((ListBoxItem._timeLockWatchAdBtn = new Controls.Buttons.BasicButton(scene, 0, 0, "atlas_0", "ui/btnWatchAd_").setDepth(30)), 0, 70);
                    layer.add((ListBoxItem._timeLockVal = scene.add.bitmapText(0, 0, "fntDefault", "00:00:00", 38).setOrigin(0.5, 0).setDepth(30)), 0, 0, 4, false);
                    layer.add(scene.add.bitmapText(0, 0, "fntDefault", "OR", 38).setOrigin(0.5, 0).setScale(0.6).setDepth(30), 0, 40, 4, false);
                    ListBoxItem._timeLockLayerItem = new Controls.Group.Item(layer, 0, 6, 4 | 8, false);
                    ListBoxItem._timeLockUpdateEvent = null;
                }
                super(listBox);
                this._layer = new Controls.Group.Group()
                    .setVisible(false);
                this._layer.add(scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "groupBg").setOrigin(0, 0));
                this._lvlButtons = [];
                for (let i = 0; i < Game.Gameplay.Level.Group.LEVELS_PER_GROUP; i++) {
                    let btn = (i + 1 < Game.Gameplay.Level.Group.LEVELS_PER_GROUP ? new LevelSelect.LevelButton(scene) : new LevelSelect.BonusLevelButton(scene));
                    this._lvlButtons.push(btn);
                    this._layer.add(btn, 52 + 114 * i, 40, 0, false);
                }
                this._lockOverlay = this._layer.add(scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "groupLockOverlay").setOrigin(0, 0).setDepth(20).setVisible(false), 0, 0, 0, false);
                this._lockIcon = this._layer.add(scene.add.image(0, 0, "atlas_0", LevelSelect.MainScene.ASSET_PREFIX + "groupLock_0").setDepth(20).setVisible(false), 0, 0, 4 | 8, false);
                this._title = scene.add.bitmapText(0, 0, "fntDefault", "", 38).setOrigin(0, 0).setScale(0.6).setDepth(20);
                this._layer.add(this._title, 16, 14, 0, false);
            }
            activate(contentId, content, pos) {
                super.activate(contentId, content, pos);
                this._layer.setPosition(this.x, this.y + ListBoxItem.LAYER_OFFSET_Y)
                    .setVisible(true);
                let title = content.pfWidth + "X" + content.pfHeight;
                if (content.difficulty != 0)
                    title += " HARD";
                this._title.setText(title);
                for (let i = 0; i < Game.Gameplay.Level.Group.LEVELS_PER_GROUP; i++) {
                    let btn = this._lvlButtons[i];
                    let lvl = content.levels[i];
                    btn.level = lvl;
                    btn.enabled = lvl.unlocked;
                }
                this.updateLockOverlay();
                return this;
            }
            deactivate() {
                this._layer.setVisible(false);
                this._lvlButtons.forEach((button) => { button.level = null; });
                if (Game.Global.levelsTimeLock.active && Game.Global.levelsTimeLock.groupId == this._content.id) {
                    ListBoxItem._timeLockLayer.visible = false;
                    if (ListBoxItem._timeLockUpdateEvent != null)
                        ListBoxItem._timeLockUpdateEvent.paused = true;
                }
                super.deactivate();
                return this;
            }
            updateLockOverlay() {
                let unlocked = this._content.unlocked;
                if (unlocked) {
                    this._lockOverlay.setVisible(false);
                    this._lockIcon.setVisible(false);
                }
                else {
                    this._lockOverlay.setVisible(true);
                    this._lockOverlay.gameObject.alpha = 1;
                    if (Game.Global.levelsTimeLock.active && Game.Global.levelsTimeLock.groupId == this._content.id) {
                        this._lockIcon.setVisible(false);
                        if (!ListBoxItem._timeLockLayer.visible) {
                            ListBoxItem._timeLockLayer.visible = true;
                            ListBoxItem._timeLockLayer.alpha = 1;
                            this._layer.addExisting(ListBoxItem._timeLockLayerItem);
                            ListBoxItem._timeLockWatchAdBtn.enabled = true;
                            this.updateTimeLockValue();
                        }
                        if (ListBoxItem._timeLockUpdateEvent == null) {
                            ListBoxItem._timeLockUpdateEvent = this._listBox.scene.time.addEvent({ delay: 1000, callback: this.updateTimeLockValue, callbackScope: this, loop: true });
                        }
                        else {
                            ListBoxItem._timeLockUpdateEvent.paused = false;
                        }
                    }
                    else {
                        this._lockIcon.setVisible(true);
                    }
                }
            }
            updateLevelAvatars() {
                this._lvlButtons.forEach((button) => {
                    button.updateAvatars();
                });
            }
            unlockBonusLevel() {
                this._lvlButtons[Game.Gameplay.Level.Group.LEVELS_PER_GROUP - 1].unlockBonusLevel();
                this._listBox.scene.sound.playAudioSprite("sfx", "unlock");
            }
            unlockLevelGroup() {
                ListBoxItem._timeLockWatchAdBtn.enabled = false;
                this._listBox.scene.add.tween({
                    targets: this._lockOverlay.gameObject,
                    alpha: 0,
                    duration: 1000,
                });
                this._listBox.scene.add.tween({
                    targets: ListBoxItem._timeLockLayer,
                    alpha: { value: 0 },
                    duration: 1000,
                    onComplete: () => { this.handleGroupUnlockTweenComplete(); }
                });
                this._listBox.scene.sound.playAudioSprite("sfx", "unlock");
            }
            handlePosChange(x, y) {
                this._layer.setPosition(x, y + ListBoxItem.LAYER_OFFSET_Y);
            }
            handleGroupUnlockTweenComplete() {
                this._lockOverlay.visible = false;
                this._layer.remove(ListBoxItem._timeLockLayerItem);
                ListBoxItem._timeLockLayer.visible = false;
                ListBoxItem._timeLockUpdateEvent.remove(false);
                ListBoxItem._timeLockUpdateEvent = null;
                for (let i = 0; i < Game.Gameplay.Level.Group.LEVELS_PER_GROUP - 1; i++)
                    this._lvlButtons[i].enabled = true;
            }
            updateTimeLockValue() {
                let remTime = Game.Global.levelsTimeLock.remTime;
                if (remTime < 0)
                    remTime = 0;
                let val = Math.floor(remTime / (1000 * 60 * 60));
                let txt = (val < 10 ? "0" : "") + val + ":";
                val = Math.floor(remTime / (1000 * 60)) % 60;
                txt += (val < 10 ? "0" : "") + val + ":";
                val = Math.floor(remTime / 1000) % 60;
                txt += (val < 10 ? "0" : "") + val;
                ListBoxItem._timeLockVal.setText(txt);
            }
        }
        ListBoxItem.LAYER_OFFSET_Y = 5;
        LevelSelect.ListBoxItem = ListBoxItem;
    })(LevelSelect = Game.LevelSelect || (Game.LevelSelect = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var LevelSelect;
    (function (LevelSelect) {
        class MainScene extends Phaser.Scene {
            create() {
                this._unlockGroupEvent = null;
                this.add.image(0, 0, "atlas_0", MainScene.ASSET_PREFIX + "bg")
                    .setOrigin(0, 0)
                    .setScale(2);
                this._title = this.add.bitmapText(320, 28, "fntDefaultBigC0", "LEVELS", 60).setOrigin(0.5, 0);
                this._levelCnt = this.add.bitmapText(0, 44, "fntDefault", "", 38);
                this._listBox = new Controls.ListBox.ListBox(this, Game.Global.scale.maxWidth, 0, 188, (listbox) => { return new LevelSelect.ListBoxItem(listbox); }, this, 0);
                this._listBox.setWidth(640)
                    .setY(MainScene.LISTBOX_OFFSET_Y)
                    .setViewOffsetLimitAddition(0, 40);
                this.events.on(Phaser.Scenes.Events.WAKE, this.handleSceneWake, this);
                this.events.on(Phaser.Scenes.Events.SLEEP, this.handleSceneSleep, this);
                this.events.on("btn_click", this.handleBtnClick, this);
                Game.Global.friends.events.on(Game.Friends.Manager.EVENT_LOAD_COMPLETE, this.handleFriendsLoaded, this);
                this.handleSceneWake(this.sys, { mode: 0 });
            }
            update() {
                if (!Game.Global.gameeGameStarted && Gamee2.Gamee.initialized) {
                    this.sys.pause();
                    Gamee2.Gamee.gameReady();
                }
            }
            handleBtnClick(button) {
                if (button instanceof LevelSelect.LevelButton) {
                    this.sound.playAudioSprite("sfx", "menuClick");
                    Game.Global.save.setSelectedLevel(this._listBox.viewOffset, button.level);
                    Game.Global.save.save(true);
                    this.sys.sleep(Game.Global.sceneSleepPars);
                    this.scene.run("gameplayMain", button.level);
                }
                else {
                    if (Gamee2.Gamee.initialized) {
                        if (Gamee2.Gamee.adReady) {
                            Gamee2.Gamee.showAd((res) => {
                                if (res) {
                                    this.handleTimeLockComplete();
                                }
                            }, this);
                        }
                    }
                }
            }
            handleSceneWake(sys, pars) {
                if (!pars)
                    return;
                let x = this._title.x - this._title.displayOriginX + this._title.width;
                this._levelCnt.setText(Game.Global.save.completeLevelCnt + "/" + Game.Global.levelGroups.length * Game.Gameplay.Level.Group.LEVELS_PER_GROUP)
                    .setX(x + ((640 - x) - this._levelCnt.width) / 2);
                this._listBox.content = null;
                this._listBox.content = Game.Global.levelGroups;
                if (!Game.Global.friends.initInProgress && Date.now() - Game.Global.friends.lastInitTime >= 5 * 60 * 1000)
                    Game.LoaderScene.loadFriends();
                Game.Global.scale.events.on(Helpers.ScaleManager.EVENT_RESIZE, this.handleResolutionChange, this);
                this.handleResolutionChange(Game.Global.game.scale.width, Game.Global.game.scale.height);
                let focusedGroup = null;
                if (Game.Global.levelsTimeLock.active) {
                    let lockRemTime = Game.Global.levelsTimeLock.remTime;
                    if (lockRemTime <= 0) {
                        lockRemTime = 500;
                        if (this._unlockGroupEvent != null) {
                            this._unlockGroupEvent.remove(false);
                            this._unlockGroupEvent = null;
                        }
                        focusedGroup = Game.Global.levelGroups[Game.Global.save.unlockedLvlGroupCnt];
                    }
                    else if (Game.Global.save.newTimeLock) {
                        focusedGroup = Game.Global.levelGroups[Game.Global.save.unlockedLvlGroupCnt];
                        let lsbItem = this._listBox.getItem(focusedGroup);
                        if (lsbItem != null)
                            lsbItem.updateLockOverlay();
                        if (Gamee2.Gamee.initialized && !Gamee2.Gamee.adReady)
                            Gamee2.Gamee.loadAd();
                    }
                    if (this._unlockGroupEvent == null)
                        this._unlockGroupEvent = this.time.delayedCall(Math.max(500, lockRemTime), this.handleTimeLockComplete, null, this);
                }
                let lsbViewOffset = Game.Global.save.selLevelLsbOffset;
                if (focusedGroup != null)
                    lsbViewOffset = this.ensureLevelGroupVisibility(focusedGroup.id, lsbViewOffset);
                this._listBox.viewOffset = lsbViewOffset;
                if (Game.Global.save.newBonusLevelId >= 0)
                    this._listBox.getItem(Game.Global.levelGroups[Math.floor(Game.Global.save.newBonusLevelId / Game.Gameplay.Level.Group.LEVELS_PER_GROUP)]).unlockBonusLevel();
                if (Gamee2.Gamee.initialized) {
                    Gamee2.Gamee.events.on("start", this.handleGameeStart, this);
                    Gamee2.Gamee.events.on("pause", this.handleGameePause, this);
                    Gamee2.Gamee.events.on("resume", this.handleGameeResume, this);
                }
            }
            handleSceneSleep(sys, pars) {
                if (pars && pars.sleep) {
                    Game.Global.scale.events.off(Helpers.ScaleManager.EVENT_RESIZE, this.handleResolutionChange, this);
                    if (Gamee2.Gamee.initialized) {
                        Gamee2.Gamee.events.off("start", this.handleGameeStart, this);
                        Gamee2.Gamee.events.off("pause", this.handleGameePause, this);
                        Gamee2.Gamee.events.off("resume", this.handleGameeResume, this);
                    }
                    if (this._unlockGroupEvent != null) {
                        this._unlockGroupEvent.remove(false);
                        this._unlockGroupEvent = null;
                    }
                    this.tweens.killAll();
                }
            }
            handleFriendsLoaded() {
                if (this.sys.isSleeping())
                    return;
                this._listBox.visibleItems.forEach((lsbItem) => {
                    lsbItem.updateLevelAvatars();
                }, this);
            }
            handleTimeLockComplete() {
                if (Game.Global.levelsTimeLock.active) {
                    Game.Global.levelsTimeLock.reset();
                    Game.Global.save.unlockNewLvlGroup();
                    let lbItem = this._listBox.getItem(Game.Global.levelGroups[Game.Global.save.unlockedLvlGroupCnt - 1]);
                    if (lbItem != null)
                        lbItem.unlockLevelGroup();
                    if (this._unlockGroupEvent != null) {
                        this._unlockGroupEvent.remove(false);
                        this._unlockGroupEvent = null;
                    }
                }
            }
            ensureLevelGroupVisibility(groupId, lsbViewOffset) {
                let offset = this._listBox.getItemViewOffset(groupId);
                if (offset < lsbViewOffset) {
                    lsbViewOffset = offset;
                }
                else if (offset + this._listBox.itemSize > lsbViewOffset + this._listBox.height) {
                    lsbViewOffset = offset + this._listBox.itemSize - this._listBox.height;
                }
                return lsbViewOffset;
            }
            handleGameeStart() {
                if (!Game.Global.gameeGameStarted) {
                    Game.Global.gameeGameStarted = true;
                    this.sys.resume();
                }
                else {
                    this.sys.resume();
                    Gamee2.Gamee.score = Game.Global.save.totalScore;
                }
            }
            handleGameePause() {
                this.sys.pause();
            }
            handleGameeResume() {
                this.sys.resume();
            }
            handleResolutionChange(w, h) {
                this.cameras.main.setViewport(0, 0, w, h);
                this._listBox.height = h - MainScene.LISTBOX_OFFSET_Y;
            }
        }
        MainScene.ASSET_PREFIX = "selectLevel/";
        MainScene.LISTBOX_OFFSET_Y = 100;
        LevelSelect.MainScene = MainScene;
    })(LevelSelect = Game.LevelSelect || (Game.LevelSelect = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Save;
    (function (Save) {
        class Manager {
            constructor() {
                this._saveData = {
                    score: 0,
                    groupCnt: 0,
                    lvlResults: null,
                    lvlSaves: null,
                    newBnsLvlId: 0,
                    timeLock: 0,
                    newTimeLock: false,
                    slsLsbOffset: 0,
                    selLvlId: 0,
                    tutorial: true,
                };
                this._saveBattleData = {
                    compLevelsUID: null,
                };
                this._levelSaves = new Phaser.Structs.Map();
                this.reset();
            }
            get loading() { return (this._flags & 4) != 0; }
            get totalScore() { return this._saveData.score; }
            get unlockedLvlGroupCnt() { return this._saveData.groupCnt; }
            get completeLevelCnt() { return this._compLvlCnt; }
            get maxCompleteLevelId() { return this._maxCompLvlId; }
            get newBonusLevelId() { return this._saveData.newBnsLvlId; }
            set newBonusLevelId(id) {
                if (this.newBonusLevelId != id) {
                    this._saveData.newBnsLvlId = id;
                    this.setSaveRequest();
                }
            }
            get selLevelLsbOffset() { return this._saveData.slsLsbOffset; }
            get selectedLevel() { return Game.Global.levelGroups[Math.floor(this._saveData.selLvlId / Game.Gameplay.Level.Group.LEVELS_PER_GROUP)].levels[this._saveData.selLvlId % Game.Gameplay.Level.Group.LEVELS_PER_GROUP]; }
            get newTimeLock() { return this._saveData.newTimeLock; }
            get showTutorial() { return this._saveData.tutorial; }
            set showTutorial(value) {
                if (this._saveData.tutorial != value) {
                    this._saveData.tutorial = value;
                    this.setSaveRequest();
                }
            }
            reset() {
                this._saveData.score = 0;
                this._saveData.groupCnt = 2;
                this._saveData.lvlResults = [];
                this._saveData.lvlSaves = null;
                this._saveData.newBnsLvlId = -1;
                this._saveData.timeLock = 0;
                this._saveData.newTimeLock = false;
                this._saveData.slsLsbOffset = 0;
                this._saveData.selLvlId = 0;
                this._saveData.tutorial = true;
                this._saveBattleData.compLevelsUID = [];
                this._compLvlCnt = 10;
                this._maxCompLvlId = -1;
                this._flags = 0;
            }
            load(sourceString) {
                this.reset();
                if (sourceString == undefined || sourceString == null || sourceString.length == 0)
                    return;
                this._flags |= 4;
                try {
                    if (Game.Global.gameContext == "normal") {
                        let saveData = JSON.parse(sourceString);
                        if (saveData) {
                            if (saveData.score != undefined)
                                this._saveData.score = saveData.score;
                            if (saveData.groupCnt != undefined)
                                this._saveData.groupCnt = saveData.groupCnt;
                            if (saveData.newBnsLvlId != undefined)
                                this._saveData.newBnsLvlId = saveData.newBnsLvlId;
                            if (saveData.slsLsbOffset != undefined)
                                this._saveData.slsLsbOffset = saveData.slsLsbOffset;
                            if (saveData.selLvlId != undefined)
                                this._saveData.selLvlId = saveData.selLvlId;
                            if (saveData.tutorial != undefined)
                                this._saveData.tutorial = saveData.tutorial;
                            if (saveData.timeLock != undefined)
                                this._saveData.timeLock = saveData.timeLock;
                            if (saveData.newTimeLock != undefined)
                                this._saveData.newTimeLock = saveData.newTimeLock;
                            if (this._saveData.timeLock != 0)
                                Game.Global.levelsTimeLock.init(this._saveData.timeLock, this._saveData.groupCnt);
                            if (saveData.lvlResults != undefined) {
                                this._saveData.lvlResults = saveData.lvlResults;
                                for (let i = 0; i < this._saveData.lvlResults.length; i++) {
                                    let lvl = Game.Global.getLevelById(i);
                                    lvl.initSetResult(this._saveData.lvlResults[i]);
                                    if (lvl.complete)
                                        this._compLvlCnt++;
                                }
                                this._maxCompLvlId = this._saveData.lvlResults.length - 1;
                            }
                            this._levelSaves.clear();
                            if (saveData.lvlSaves != undefined) {
                                saveData.lvlSaves.forEach((data) => {
                                    let unfinishedLvl = Save.UnfinishedLevel.fromString(data);
                                    let lvl = Game.Global.getLevelByUID(unfinishedLvl.levelUID);
                                    if (lvl != undefined) {
                                        this._levelSaves.set(unfinishedLvl.levelUID, unfinishedLvl);
                                        lvl.initSetPartiallyComplete();
                                    }
                                    else {
                                        this._flags |= 16;
                                    }
                                });
                            }
                            let groupCnt = this._saveData.groupCnt;
                            if (!Game.Global.levelsTimeLock.active && groupCnt < Game.Global.levelGroups.length && Game.Global.levelGroups[groupCnt - 1].completeLevelCnt >= Game.Gameplay.Level.Group.LEVELS_PER_GROUP - 1)
                                Game.Global.levelsTimeLock.start(Game.Gameplay.Level.Group.UNLOCK_DELAY);
                        }
                    }
                    else {
                        let saveData = JSON.parse(sourceString);
                        if (saveData) {
                            if (saveData.compLevelsUID) {
                                let compLvlCnt = 0;
                                saveData.compLevelsUID.forEach((uid) => {
                                    let i = Game.Global.battleLevels.length;
                                    while (i-- != 0) {
                                        let lvl = Game.Global.battleLevels[i];
                                        if (lvl.uid == uid) {
                                            lvl.initSetResult(lvl.reqMoveCnt);
                                            compLvlCnt++;
                                            break;
                                        }
                                    }
                                });
                                if (compLvlCnt == Game.Global.battleLevels.length) {
                                    saveData.compLevelsUID.length = 0;
                                    Game.Global.battleLevels.forEach((lvl) => { lvl.initSetResult(0); });
                                }
                                this._saveBattleData.compLevelsUID = saveData.compLevelsUID;
                            }
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                }
                this._flags &= ~4;
            }
            save(highPriorityOnly = false) {
                if ((this._flags & (highPriorityOnly ? 2 : 2 | 1)) == 0 || (this._flags & 8) != 0)
                    return;
                this._flags |= 8;
                if (!Gamee2.Gamee.gameSave(this.getSaveData(), (res) => {
                    this._flags &= ~8;
                    this._flags &= ~(2 | 1);
                }, this)) {
                    this._flags &= ~8;
                }
                ;
            }
            getSaveData() {
                if (Game.Global.gameContext == "normal") {
                    if ((this._flags & 16) != 0) {
                        this._flags &= ~16;
                        this._saveData.lvlSaves = [];
                        this._levelSaves.values().forEach((level) => {
                            this._saveData.lvlSaves.push(level.toString());
                        });
                    }
                    return JSON.stringify(this._saveData);
                }
                else {
                    return JSON.stringify(this._saveBattleData);
                }
            }
            resetSaveRequest() {
                this._flags &= ~(2 | 1);
            }
            setSelectedLevel(lsbOffset, level) {
                let reqSave = false;
                if (lsbOffset != this._saveData.slsLsbOffset) {
                    this._saveData.slsLsbOffset = lsbOffset;
                    reqSave = true;
                }
                if (this._saveData.selLvlId != level.id) {
                    this._saveData.selLvlId = level.id;
                    reqSave = true;
                }
                if (this._saveData.newTimeLock) {
                    this._saveData.newTimeLock = false;
                    reqSave = true;
                }
                if (reqSave)
                    this.setSaveRequest(false);
            }
            setLevelResult(level, score) {
                if (Game.Global.gameContext == "normal") {
                    let res = 0;
                    let levelId = level.id;
                    if (this._saveData.lvlResults.length > levelId)
                        res = this._saveData.lvlResults[levelId];
                    if (res == 0)
                        this._compLvlCnt++;
                    while (levelId >= this._saveData.lvlResults.length)
                        this._saveData.lvlResults.push(0);
                    this._saveData.lvlResults[levelId] = level.moveCnt;
                }
                else {
                    let i = this._saveBattleData.compLevelsUID.length;
                    let lvlUID = level.uid;
                    while (i-- != 0) {
                        if (this._saveBattleData.compLevelsUID[i] == lvlUID)
                            break;
                    }
                    if (i < 0)
                        this._saveBattleData.compLevelsUID.push(lvlUID);
                    this._saveData.score = 0;
                }
                this._saveData.score += score;
                this.setSaveRequest();
                return this;
            }
            saveUnfinishedLevel(playfield) {
                let levelSave = Save.UnfinishedLevel.fromPlayfield(playfield);
                this._levelSaves.set(levelSave.levelUID, levelSave);
                this.setSaveRequest();
                this._flags |= 16;
                return this;
            }
            deleteLevelSave(level) {
                if (this._levelSaves.has(level.uid)) {
                    this._levelSaves.delete(level.uid);
                    this._flags |= 16;
                    return true;
                }
                return false;
            }
            getLevelSave(level) {
                let data = this._levelSaves.get(level.uid);
                if (data)
                    return data;
                return null;
            }
            getLvlTimeLock() {
                return this._saveData.timeLock;
            }
            setLvlTimeLock() {
                this._saveData.timeLock = Game.Global.levelsTimeLock.unlockTime;
                this._saveData.newTimeLock = true;
                this.setSaveRequest();
            }
            unlockNewLvlGroup() {
                if (this._saveData.timeLock != 0) {
                    this._saveData.timeLock = 0;
                    this._saveData.newTimeLock = false;
                    this._saveData.groupCnt++;
                    this.setSaveRequest();
                }
            }
            setSaveRequest(highPriority = true) {
                this._flags |= (highPriority ? 2 : 1);
            }
        }
        Save.Manager = Manager;
    })(Save = Game.Save || (Game.Save = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Save;
    (function (Save) {
        class UnfinishedLevel {
            constructor(levelUID, moveCnt, moveHistory, cellStateMasks, mistakes) {
                this._levelUID = levelUID;
                this._moveCnt = moveCnt;
                this._moveHistory = moveHistory;
                this._cellStateMasks = cellStateMasks;
                this._mistakes = mistakes;
            }
            get levelUID() { return this._levelUID; }
            get moveCnt() { return this._moveCnt; }
            get moveHistory() { return this._moveHistory; }
            get mistakes() { return this._mistakes; }
            getCellState(cellId) {
                return (this._cellStateMasks[Math.floor(cellId / 15)] & (0x03 << ((cellId % 15) << 1))) >> ((cellId % 15) << 1);
            }
            static fromArray(levelW, levelH, cells) {
                let maskShift = 0;
                let mask = 0;
                let masks = [];
                let cellCnt = levelW * levelH;
                for (let cellId = 0; cellId < cellCnt; cellId++) {
                    mask |= (cells[cellId] << maskShift);
                    if ((maskShift += 2) == 30) {
                        masks.push(mask);
                        mask = 0;
                        maskShift = 0;
                    }
                }
                if ((cellCnt % 30) != 0)
                    masks.push(mask);
                return new UnfinishedLevel(-1, 0, [], masks, []);
            }
            static fromPlayfield(playfield) {
                let level = playfield.level;
                let maskShift = 0;
                let mask = 0;
                let masks = [];
                let cells = playfield.cells;
                let cellCnt = level.width * level.height;
                for (let cellId = 0; cellId < cellCnt; cellId++) {
                    mask |= (cells[cellId].state << maskShift);
                    if ((maskShift += 2) == 30) {
                        masks.push(mask);
                        mask = 0;
                        maskShift = 0;
                    }
                }
                if ((cellCnt % 30) != 0)
                    masks.push(mask);
                let mistakes = [];
                let mistake = playfield.firstMistake;
                while (mistake != null) {
                    mistakes.push(new Mistake(mistake.type, mistake.cell1.id, (mistake.cell2 != null ? mistake.cell2.id : -1)));
                    mistake = mistake.next;
                }
                return new UnfinishedLevel(level.uid, playfield.moveCnt, playfield.moveHistory.copyTo(), masks, mistakes);
            }
            static fromString(string) {
                let strings = string.split(",");
                let stringPos = 2;
                let masks = [];
                let mistakeCnt = parseInt(strings[stringPos++]);
                let mistakes = [];
                while (mistakeCnt-- != 0) {
                    mistakes.push(new Mistake(parseInt(strings[stringPos]), parseInt(strings[stringPos + 1]), parseInt(strings[stringPos + 2])));
                    stringPos += 3;
                }
                for (let i = stringPos; i < strings.length; i++)
                    masks.push(parseInt(strings[i], 16));
                return new UnfinishedLevel(parseInt(strings[0]), parseInt(strings[1]), [], masks, mistakes);
            }
            toString() {
                let res = this._levelUID + "," + this._moveCnt + "," + this._mistakes.length + ",";
                this._mistakes.forEach((mistake) => {
                    res += mistake.type + "," + mistake.cell1Id + "," + mistake.cell2Id;
                });
                for (let i = 0; i < this._cellStateMasks.length; i++) {
                    res += this._cellStateMasks[i].toString(16);
                    if (i + 1 < this._cellStateMasks.length)
                        res += ",";
                }
                return res;
            }
        }
        Save.UnfinishedLevel = UnfinishedLevel;
        class Mistake {
            constructor(type, cell1Id, cell2Id) {
                this._type = type;
                this._cell1Id = cell1Id;
                this._cell2Id = cell2Id;
            }
            get type() { return this._type; }
            get cell1Id() { return this._cell1Id; }
            get cell2Id() { return this._cell2Id; }
        }
        Save.Mistake = Mistake;
    })(Save = Game.Save || (Game.Save = {}));
})(Game || (Game = {}));

