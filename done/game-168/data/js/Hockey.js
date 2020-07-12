var FBInstantGame;
(function (FBInstantGame_1) {
    var FBInstantGame = (function () {
        function FBInstantGame() {
            this._ready = false;
            FBInstantGame._instance = this;
            if (window.FBInstant != undefined) {
                window.FBInstant.initializeAsync().then(function () {
                    FBInstantGame.instance._ready = true;
                });
            }
        }
        Object.defineProperty(FBInstantGame, "instance", {
            get: function () {
                return FBInstantGame._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FBInstantGame.prototype, "ready", {
            get: function () {
                return this._ready;
            },
            enumerable: true,
            configurable: true
        });
        FBInstantGame.prototype.setLoadingProgress = function (percentage) {
            if (window.FBInstant != undefined) {
                window.FBInstant.setLoadingProgress(percentage);
            }
        };
        FBInstantGame.prototype.setScore = function (score) {
            if (this._ready)
                window.FBInstant.setScore(score);
        };
        FBInstantGame.prototype.startGame = function (startSignal) {
            this._signal = startSignal;
            if (this._ready) {
                window.FBInstant.startGameAsync().then(function () {
                    FBInstantGame.instance._signal.dispatch();
                });
            }
            else {
                startSignal.dispatch();
            }
        };
        FBInstantGame.prototype.endGame = function (restartSignal) {
            this._signal = restartSignal;
            if (this._ready) {
                window.FBInstant.endGameAsync().then(function () {
                    FBInstantGame.instance._signal.dispatch();
                });
            }
            else {
                restartSignal.dispatch();
            }
        };
        FBInstantGame.prototype.takeScreenshot = function (game) {
            if (this._ready) {
                if (game.device.iOS && game.device.webGL) {
                    var tex = new Phaser.RenderTexture(game, game.camera.width, game.camera.height);
                    tex.render(game.world, new Phaser.Matrix(1, 0, 0, 1, 0, -game.camera.y));
                    window.FBInstant.sendScreenshotAsync(tex.getBase64());
                    tex.destroy(true);
                }
                else {
                    window.FBInstant.takeScreenshotAsync();
                }
            }
        };
        FBInstantGame._instance = null;
        return FBInstantGame;
    }());
    FBInstantGame_1.FBInstantGame = FBInstantGame;
})(FBInstantGame || (FBInstantGame = {}));
var Hockey;
(function (Hockey) {
    var BarFirePuck = (function () {
        function BarFirePuck() {
            this._emptyBars = [];
            this._fullBars = [];
            if (!Hockey.Global.GAMEE || !Gamee.Gamee.instance.ready)
                BarFirePuck.Y_OFFSET -= 40;
            BarFirePuck._instance = this;
            this._layer = Hockey.Global.game.add.group();
            this._icon = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "barFirePuckIcon", this._layer);
            var x = BarFirePuck.BARS_X_OFFSET;
            for (var i = 0; i < BarFirePuck.BAR_CNT; i++) {
                this._emptyBars.push(Hockey.Global.game.add.image(x, BarFirePuck.BARS_Y_OFFSET, Hockey.Global.ATLAS_0, "barFirePuckEBar", this._layer));
                this._fullBars.push(Hockey.Global.game.add.image(x, BarFirePuck.BARS_Y_OFFSET, Hockey.Global.ATLAS_0, "barFirePuckFBar", this._layer));
                x += BarFirePuck.BARS_SPACING;
            }
            this._fullBarCnt = 0;
            this.update();
        }
        Object.defineProperty(BarFirePuck, "instance", {
            get: function () { return this._instance; },
            enumerable: true,
            configurable: true
        });
        BarFirePuck.prototype.reposition = function () {
            var camera = Hockey.Global.game.camera;
            this._layer.position.set(camera.x + camera.width - BarFirePuck.X_OFFSET - this._layer.width, camera.y + BarFirePuck.Y_OFFSET);
        };
        BarFirePuck.prototype.reset = function () {
            this.clearBars();
        };
        BarFirePuck.prototype.clearBars = function () {
            this._fullBarCnt = 0;
            this.update();
        };
        BarFirePuck.prototype.incBars = function () {
            if (this._fullBarCnt < BarFirePuck.BAR_CNT) {
                this._fullBarCnt++;
                this.update();
            }
        };
        BarFirePuck.prototype.update = function () {
            var barId = 0;
            while (barId < this._fullBarCnt) {
                var bar = this._emptyBars[barId];
                bar.visible = bar.exists = false;
                bar = this._fullBars[barId];
                bar.visible = bar.exists = true;
                barId++;
            }
            while (barId < BarFirePuck.BAR_CNT) {
                var bar = this._emptyBars[barId];
                bar.visible = bar.exists = true;
                bar = this._fullBars[barId];
                bar.visible = bar.exists = false;
                barId++;
            }
        };
        BarFirePuck.X_OFFSET = 20;
        BarFirePuck.Y_OFFSET = 38;
        BarFirePuck.BAR_CNT = 3;
        BarFirePuck.BARS_X_OFFSET = 56;
        BarFirePuck.BARS_Y_OFFSET = 38;
        BarFirePuck.BARS_SPACING = 22;
        return BarFirePuck;
    }());
    Hockey.BarFirePuck = BarFirePuck;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var BarScore = (function () {
        function BarScore() {
            this._fxScaleTweenPars = { x: 2, y: 2 };
            this._fxAlphaTweenPars = { alpha: 0 };
            if (!Hockey.Global.GAMEE || !Gamee.Gamee.instance.ready)
                BarScore.Y_OFFSET -= 40;
            BarScore._instance = this;
            this._layer = Hockey.Global.game.add.group();
            var bck = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "barScore", this._layer);
            this._textFx = Hockey.Global.game.add.bitmapText(bck.width >> 1, 24, "fnt1", "", 25, this._layer);
            this._textFx.visible = false;
            this._textFx.anchor.set(0.5);
            this._text = Hockey.Global.game.add.bitmapText(bck.width >> 1, 24, "fnt1", "", 25, this._layer);
            this._text.anchor.set(0.5);
            this._layer.pivot.set(this._layer.width >> 1, 0);
        }
        Object.defineProperty(BarScore, "instance", {
            get: function () { return this._instance; },
            enumerable: true,
            configurable: true
        });
        BarScore.prototype.reset = function () {
            this._text.text = Hockey.Play.instance.score.toString();
            this._textFx.visible = this._textFx.exists = false;
            this._fxScaleTween = new Phaser.Tween(this._textFx.scale, Hockey.Global.game, Hockey.Global.game.tweens);
            this._fxScaleTween.to(this._fxScaleTweenPars, 1000, Phaser.Easing.Cubic.Out, false);
            this._fxScaleTween.onComplete.add(this.onFxTweenComplete, this);
            this._fxAlphaTween = new Phaser.Tween(this._textFx, Hockey.Global.game, Hockey.Global.game.tweens);
            this._fxAlphaTween.to(this._fxAlphaTweenPars, 1000, Phaser.Easing.Cubic.Out, false);
        };
        BarScore.prototype.reposition = function () {
            var camera = Hockey.Global.game.camera;
            this._layer.position.set(camera.x + (camera.width >> 1), camera.y + BarScore.Y_OFFSET);
        };
        BarScore.prototype.update = function () {
            this._text.text = Hockey.Play.instance.score.toString();
            this._textFx.text = this._text.text;
            this._textFx.scale.set(1, 1);
            this._textFx.alpha = 1;
            this._textFx.visible = this._textFx.exists = true;
            this._fxScaleTween.start();
            this._fxAlphaTween.start();
        };
        BarScore.prototype.onFxTweenComplete = function () {
            this._textFx.visible = this._textFx.exists = false;
        };
        BarScore.Y_OFFSET = 69;
        return BarScore;
    }());
    Hockey.BarScore = BarScore;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var PuckIncMsg = (function () {
        function PuckIncMsg() {
            this._moveTweenPars = { x: 0, y: 0 };
            this._scaleTweenPars = { x: 1.5, y: 1.5 };
            this._alphaTweenPars = { alpha: 0 };
            this._image = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "msgPuckPlus1");
            this._image.anchor.set(0.5);
            this._image.visible = this._image.exists = false;
        }
        Object.defineProperty(PuckIncMsg.prototype, "isActive", {
            get: function () {
                return this._moveTween.isRunning || this._scaleTween.isRunning;
            },
            enumerable: true,
            configurable: true
        });
        PuckIncMsg.prototype.reset = function () {
            this._moveTween = new Phaser.Tween(this._image, Hockey.Global.game, Hockey.Global.game.tweens);
            this._moveTween.to(this._moveTweenPars, 1000, Phaser.Easing.Cubic.Out, false);
            this._moveTween.onComplete.add(this.onMoveComplete, this);
            this._scaleTween = new Phaser.Tween(this._image.scale, Hockey.Global.game, Hockey.Global.game.tweens);
            this._scaleTween.to(this._scaleTweenPars, 1000, Phaser.Easing.Cubic.Out, false);
            this._alphaTween = new Phaser.Tween(this._image, Hockey.Global.game, Hockey.Global.game.tweens);
            this._alphaTween.to(this._alphaTweenPars, 1000, Phaser.Easing.Cubic.In, false);
            this._image.visible = this._image.exists = false;
        };
        PuckIncMsg.prototype.show = function (x, y, pucks) {
            if (!this.isActive) {
                this._barUpdated = false;
                this._image.frameName = "msgPuckPlus" + pucks;
                this._image.position.set(x, y);
                this._image.alpha = 1;
                this._image.scale.set(1);
                this._image.visible = this._image.exists = true;
                var camera = Hockey.Global.game.camera;
                this._moveTweenPars.x = camera.x + 140;
                this._moveTweenPars.y = camera.y + 140;
                this._moveTween.start();
            }
            else {
                if (this._barUpdated) {
                    Hockey.BarPucks.instance.update();
                }
            }
        };
        PuckIncMsg.prototype.onMoveComplete = function () {
            Hockey.BarPucks.instance.update();
            this._barUpdated = true;
            this._scaleTween.start();
            this._alphaTween.start();
        };
        PuckIncMsg.prototype.onHideComplete = function () {
            this._image.visible = this._image.exists = false;
        };
        return PuckIncMsg;
    }());
    Hockey.PuckIncMsg = PuckIncMsg;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var Wnd = (function () {
        function Wnd() {
            this._wndCropRc = new Phaser.Rectangle(0, 0, 0, 0);
            this._visible = false;
            var game = Hockey.Global.game;
            this._bckShadow = new Phaser.Graphics(game);
            if (this._bckShadow.parent != null)
                this._bckShadow.parent.removeChild(this._bckShadow);
            this._window = new Phaser.Group(game);
            if (this._window.parent != null)
                this._window.parent.removeChild(this._window);
            this._wndBck = game.add.image(0, 0, Hockey.Global.ATLAS_0, "windowBck", this._window);
            this._btnOK = game.add.button(0, 0, Hockey.Global.ATLAS_0, this.onBtnOKClick, this, Wnd.BTN_OK_FRAME_NAME_0, Wnd.BTN_OK_FRAME_NAME_0, Wnd.BTN_OK_FRAME_NAME_0, Wnd.BTN_OK_FRAME_NAME_0, this._window);
            this._onOkClick = new Phaser.Signal();
        }
        Object.defineProperty(Wnd.prototype, "width", {
            get: function () {
                return this._wndCropRc.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wnd.prototype, "height", {
            get: function () {
                return this._wndCropRc.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wnd.prototype, "visible", {
            get: function () { return this._visible; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wnd.prototype, "onOkClick", {
            get: function () { return this._onOkClick; },
            enumerable: true,
            configurable: true
        });
        Wnd.prototype.show = function (content, enableOKBtn) {
            if (enableOKBtn === void 0) { enableOKBtn = true; }
            if (this._window.parent != null)
                this.hide();
            if (content.getWndWidth() < 0 || content.getWndHeight() < 0) {
                this._wndBck.crop(null, false);
                this._wndCropRc.setTo(0, 0, this._wndBck.width, this._wndBck.height);
            }
            else {
                this._wndCropRc.setTo(0, 0, content.getWndWidth(), content.getWndHeight());
                this._wndBck.crop(this._wndCropRc, true);
            }
            this._window.add(this._wndBck);
            this._btnOK.position.set((this._wndCropRc.width - this._btnOK.width) >> 1, this._wndCropRc.height - this._btnOK.height - Wnd.BTN_OK_BOTTOM_OFFSET);
            this.enableBtnOK(enableOKBtn);
            this._window.add(this._btnOK);
            this._content = content;
            content.show(this, this._window);
            Hockey.Global.game.world.add(this._bckShadow);
            Hockey.Global.game.world.add(this._window);
            this.reposition();
            this._visible = true;
        };
        Wnd.prototype.hide = function () {
            this._bckShadow.parent.removeChild(this._bckShadow);
            this._window.removeAll(false);
            this._window.parent.removeChild(this._window);
            this._visible = false;
        };
        Wnd.prototype.reposition = function () {
            var camera = Hockey.Global.game.camera;
            var shadow = this._bckShadow;
            shadow.clear();
            shadow.beginFill(0x000000, 0.5);
            shadow.drawRect(camera.x, camera.y, camera.width, camera.height);
            shadow.endFill();
            this._window.position.set(camera.x + ((camera.width - this._window.width) >> 1), camera.y + ((camera.height - this._window.height) >> 1));
        };
        Wnd.prototype.enableBtnOK = function (enable) {
            this._btnOK.inputEnabled = enable;
            if (enable) {
                this._btnOK.setFrames(Wnd.BTN_OK_FRAME_NAME_0, Wnd.BTN_OK_FRAME_NAME_0, Wnd.BTN_OK_FRAME_NAME_1, Wnd.BTN_OK_FRAME_NAME_0);
            }
            else {
                this._btnOK.setFrames(Wnd.BTN_OK_FRAME_NAME_2, Wnd.BTN_OK_FRAME_NAME_2, Wnd.BTN_OK_FRAME_NAME_2, Wnd.BTN_OK_FRAME_NAME_2);
            }
        };
        Wnd.prototype.onBtnOKClick = function (button, pointer, isOver) {
            if (!isOver)
                return;
            this._btnOK.inputEnabled = false;
            this._content.onBtnOkClick();
            this._onOkClick.dispatch();
        };
        Wnd.BTN_OK_FRAME_NAME_0 = "btnOk0";
        Wnd.BTN_OK_FRAME_NAME_1 = "btnOk1";
        Wnd.BTN_OK_FRAME_NAME_2 = "btnOk2";
        Wnd.BTN_OK_BOTTOM_OFFSET = 12;
        return Wnd;
    }());
    Hockey.Wnd = Wnd;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var WndContentBase = (function () {
        function WndContentBase() {
        }
        WndContentBase.prototype.show = function (wnd, contentLayer) {
            this._wnd = wnd;
        };
        WndContentBase.prototype.onBtnOkClick = function () {
        };
        return WndContentBase;
    }());
    Hockey.WndContentBase = WndContentBase;
})(Hockey || (Hockey = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Hockey;
(function (Hockey) {
    var Tutorial = (function (_super) {
        __extends(Tutorial, _super);
        function Tutorial() {
            _super.call(this);
            this._content = new Phaser.Group(Hockey.Global.game);
            if (this._content.parent != null)
                this._content.parent.removeChild(this._content);
            var img = Hockey.Global.game.add.image(Tutorial.WND_W >> 1, 30, Hockey.Global.ATLAS_0, "tutor1", this._content);
            img.anchor.x = 0.5;
            img = Hockey.Global.game.add.image(Tutorial.WND_W >> 1, 182, Hockey.Global.ATLAS_0, "tutorHand", this._content);
            img.pivot.set(10, 10);
            img.angle = -20;
        }
        Tutorial.prototype.getWndWidth = function () {
            return Tutorial.WND_W;
        };
        Tutorial.prototype.getWndHeight = function () {
            return Tutorial.WND_H;
        };
        Tutorial.prototype.show = function (wnd, contentLayer) {
            _super.prototype.show.call(this, wnd, contentLayer);
            contentLayer.add(this._content);
        };
        Tutorial.WND_W = 600;
        Tutorial.WND_H = 450;
        return Tutorial;
    }(Hockey.WndContentBase));
    Hockey.Tutorial = Tutorial;
})(Hockey || (Hockey = {}));
var PopupMessage;
(function (PopupMessage) {
    var PopupMsgBase = (function () {
        function PopupMsgBase(game) {
            this._moveTween = null;
            this._alphaTween = null;
            this._moveTweenProps = { y: 0 };
            this._alphaTweenProps = { alpha: 0 };
            this._actTweensMask = 0;
            this._game = game;
        }
        PopupMsgBase.prototype.showMessage = function (x, y, type) {
            var msg = this.getMsgContainer();
            msg.x = x;
            msg.y = y;
            msg.alpha = 1;
            this._actTweensMask = 2;
            this._moveTweenProps.y = y - type.moveDistance;
            this._moveTween = this._game.add.tween(msg).to(this._moveTweenProps, type.moveTime, type.moveEase, true);
            this._moveTween.onComplete.add(this.onTweenComplete, this, 1, 0);
            this._alphaTween = this._game.add.tween(msg).to(this._alphaTweenProps, type.alphaTime, type.alphaEase, true, type.alphaDelay);
            this._alphaTween.onComplete.add(this.onTweenComplete, this, 1, 1);
        };
        PopupMsgBase.prototype.reset = function () {
            if (this._moveTween != null) {
                if (this._moveTween.isRunning)
                    this._moveTween.stop(false);
                this._moveTween = null;
            }
            if (this._alphaTween != null) {
                if (this._alphaTween.isRunning)
                    this._alphaTween.stop(false);
                this._alphaTween = null;
            }
            this._actTweensMask = 0;
        };
        PopupMsgBase.prototype.onTweenComplete = function (target, tween, tweenId) {
            this._actTweensMask &= ~(1 << tweenId);
            if (this._actTweensMask == 0)
                this.onComplete();
        };
        PopupMsgBase.prototype.onComplete = function () {
        };
        return PopupMsgBase;
    }());
    PopupMessage.PopupMsgBase = PopupMsgBase;
})(PopupMessage || (PopupMessage = {}));
var PopupMessage;
(function (PopupMessage) {
    var PopupMsgType = (function () {
        function PopupMsgType(moveDistance, moveTime, moveEase, alphaDelay, alphaTime, alphaEase) {
            this._moveDistance = moveDistance;
            this._moveTime = moveTime;
            this._moveEase = moveEase;
            this._alphaDelay = alphaDelay;
            this._alphaTime = alphaTime;
            this._alphaEase = alphaEase;
        }
        Object.defineProperty(PopupMsgType.prototype, "moveDistance", {
            get: function () { return this._moveDistance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopupMsgType.prototype, "moveTime", {
            get: function () { return this._moveTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopupMsgType.prototype, "moveEase", {
            get: function () { return this._moveEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopupMsgType.prototype, "alphaDelay", {
            get: function () { return this._alphaDelay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopupMsgType.prototype, "alphaTime", {
            get: function () { return this._alphaTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopupMsgType.prototype, "alphaEase", {
            get: function () { return this._alphaEase; },
            enumerable: true,
            configurable: true
        });
        return PopupMsgType;
    }());
    PopupMessage.PopupMsgType = PopupMsgType;
})(PopupMessage || (PopupMessage = {}));
var SlideMessage;
(function (SlideMessage) {
    var SlideMsgType = (function () {
        function SlideMsgType(slideDir, slideInTime, slideInEase, slideInAlphaStart, slideInAlphaEase, slideOutTime, slideOutDelay, slideOutEase, slideOutAlphaEnd, slideOutAlphaEase) {
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
        Object.defineProperty(SlideMsgType.prototype, "slideDir", {
            get: function () { return this._dir; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideInTime", {
            get: function () { return this._slideInTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideInEase", {
            get: function () { return this._slideInEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideInAlphaStart", {
            get: function () { return this._slideInAlphaStart; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideInAlphaEase", {
            get: function () { return this._slideInAlphaEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideOutTime", {
            get: function () { return this._slideOutTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideOutDelay", {
            get: function () { return this._slideOutDelay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideOutEase", {
            get: function () { return this._slideOutEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideOutAlphaEnd", {
            get: function () { return this._slideOutAlphaEnd; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgType.prototype, "slideOutAlphaEase", {
            get: function () { return this._slideOutAlphaEase; },
            enumerable: true,
            configurable: true
        });
        return SlideMsgType;
    }());
    SlideMessage.SlideMsgType = SlideMsgType;
})(SlideMessage || (SlideMessage = {}));
var SlideMessage;
(function (SlideMessage) {
    (function (eSlideMsgState) {
        eSlideMsgState[eSlideMsgState["completed"] = 0] = "completed";
        eSlideMsgState[eSlideMsgState["slideIn"] = 1] = "slideIn";
        eSlideMsgState[eSlideMsgState["slideOutDelay"] = 2] = "slideOutDelay";
        eSlideMsgState[eSlideMsgState["slideOut"] = 3] = "slideOut";
    })(SlideMessage.eSlideMsgState || (SlideMessage.eSlideMsgState = {}));
    var eSlideMsgState = SlideMessage.eSlideMsgState;
    var SlideMsgBase = (function () {
        function SlideMsgBase(game) {
            this._moveTween = null;
            this._moveTweenPars = { x: 0 };
            this._alphaTween = null;
            this._alphaTweenPars = { alpha: 0 };
            this._game = game;
            this._state = eSlideMsgState.completed;
        }
        Object.defineProperty(SlideMsgBase.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SlideMsgBase.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        SlideMsgBase.prototype.reset = function () {
            if (this._moveTween != null) {
                if (this._moveTween.isRunning)
                    this._moveTween.stop(false);
                this._moveTween = null;
            }
            if (this._alphaTween != null) {
                if (this._alphaTween.isRunning)
                    this._alphaTween.stop(false);
                this._alphaTween = null;
            }
        };
        SlideMsgBase.prototype.showMessage = function (y, type) {
            this._type = type;
            var msg = this.getMsgContainer();
            var camera = this._game.camera;
            msg.y = y;
            msg.x = camera.x + (type.slideDir > 0 ? -msg.width : camera.width);
            msg.alpha = type.slideInAlphaStart;
            this._moveTweenPars.x = camera.x + ((camera.width - msg.width) >> 1);
            this._moveTween = this._game.add.tween(msg).to(this._moveTweenPars, type.slideInTime, type.slideInEase, true);
            this._moveTween.onComplete.add(this.onMoveTweenComplete, this);
            if (type.slideInAlphaStart != 1) {
                msg.alpha = type.slideInAlphaStart;
                this._alphaTweenPars.alpha = 1;
                this._alphaTween = this._game.add.tween(msg).to(this._alphaTweenPars, type.slideInTime, type.slideInAlphaEase, true);
                this._alphaTween.onComplete.add(this.onAlphaTweenComplete, this);
            }
            this.onStateChange(eSlideMsgState.slideIn);
        };
        SlideMsgBase.prototype.onMoveTweenComplete = function () {
            switch (this._state) {
                case eSlideMsgState.slideIn: {
                    var camera = this._game.camera;
                    var msg = this.getMsgContainer();
                    var type = this._type;
                    this._moveTweenPars.x = camera.x + (type.slideDir > 0 ? camera.width : -msg.width);
                    this._moveTween = this._game.add.tween(msg).to(this._moveTweenPars, type.slideOutTime, type.slideOutEase, true, type.slideOutDelay);
                    if (type.slideOutDelay != 0) {
                        this.onStateChange(eSlideMsgState.slideOutDelay);
                        this._moveTween.onStart.add(function () {
                            this._state = eSlideMsgState.slideOut;
                            this.onStateChange(eSlideMsgState.slideOut);
                        }, this);
                    }
                    else {
                        this.onStateChange(eSlideMsgState.slideOut);
                    }
                    this._moveTween.onComplete.add(this.onMoveTweenComplete, this);
                    if (type.slideOutAlphaEnd != 1) {
                        if (this._alphaTween != null && this._alphaTween.isRunning)
                            this._alphaTween.stop(false);
                        msg.alpha = 1;
                        this._alphaTweenPars.alpha = type.slideOutAlphaEnd;
                        this._alphaTween = this._game.add.tween(msg).to(this._alphaTweenPars, type.slideOutTime, type.slideOutAlphaEase, true, type.slideOutDelay);
                        this._alphaTween.onComplete.add(this.onAlphaTweenComplete, this);
                    }
                    break;
                }
                case eSlideMsgState.slideOut: {
                    this._moveTween = null;
                    this.onStateChange(eSlideMsgState.completed);
                    break;
                }
            }
        };
        SlideMsgBase.prototype.onAlphaTweenComplete = function () {
            this._alphaTween = null;
        };
        SlideMsgBase.prototype.onStateChange = function (newState) {
            this._state = newState;
        };
        return SlideMsgBase;
    }());
    SlideMessage.SlideMsgBase = SlideMsgBase;
})(SlideMessage || (SlideMessage = {}));
var SlideMessage;
(function (SlideMessage) {
    var SlideImgMsg = (function (_super) {
        __extends(SlideImgMsg, _super);
        function SlideImgMsg(game, addToWorld) {
            _super.call(this, game);
            this._image = new Phaser.Image(game, 0, 0, "__default");
            this._image.visible = this._image.exists = false;
            if (addToWorld)
                game.world.add(this._image, true);
        }
        Object.defineProperty(SlideImgMsg.prototype, "image", {
            get: function () {
                return this._image;
            },
            enumerable: true,
            configurable: true
        });
        SlideImgMsg.prototype.getMsgContainer = function () {
            return this._image;
        };
        SlideImgMsg.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._image.visible = this._image.exists = false;
        };
        SlideImgMsg.prototype.show = function (y, type, imgTextureKey, imgFrameName, anchorY) {
            if (anchorY === void 0) { anchorY = 0; }
            if (this._image.key != imgTextureKey) {
                this._image.loadTexture(imgTextureKey, imgFrameName);
            }
            else {
                this._image.frameName = imgFrameName;
            }
            this._image.anchor.set(0, anchorY);
            this._image.visible = this._image.exists = true;
            _super.prototype.showMessage.call(this, y, type);
        };
        SlideImgMsg.prototype.onStateChange = function (newState) {
            _super.prototype.onStateChange.call(this, newState);
            if (newState == SlideMessage.eSlideMsgState.completed) {
                this._image.visible = this._image.exists = false;
            }
        };
        return SlideImgMsg;
    }(SlideMessage.SlideMsgBase));
    SlideMessage.SlideImgMsg = SlideImgMsg;
})(SlideMessage || (SlideMessage = {}));
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
        RandomPicker.prototype.setItemProbability = function (itemId, probability) {
            var curItemProb = this._itemsProb[itemId];
            this._itemsProb[itemId] = probability;
            this._itemsTotalProb += (probability - curItemProb);
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
var Hockey;
(function (Hockey) {
    var Global = (function () {
        function Global() {
        }
        Global.GAME_MAX_WIDTH = 726;
        Global.GAME_MAX_HEIGHT = 1138;
        Global.GAME_MIN_WIDTH = 640;
        Global.GAME_MIN_HEIGHT = 1050;
        Global.FPS = 60;
        Global.GAMEE = true;
        Global.FB_INSTANT_GAME = false;
        Global.DEBUG = false;
        Global.elapsedTime = 0;
        Global.deltaRatio = 1;
        Global.ATLAS_KEEPER = "atlasKeeper";
        Global.ATLAS_SHOOTER = "atlasShooter";
        Global.ATLAS_DEFENDER = "atlasDefender";
        Global.ATLAS_0 = "atlas0";
        return Global;
    }());
    Hockey.Global = Global;
    window.onload = function () {
        Global.game = new Hockey.Game();
        if (Global.GAMEE) {
            new Gamee.Gamee(Global.game);
        }
        else if (Global.FB_INSTANT_GAME) {
            new FBInstantGame.FBInstantGame();
        }
    };
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var SlideMsg = (function (_super) {
        __extends(SlideMsg, _super);
        function SlideMsg() {
            _super.call(this, Hockey.Global.game, false);
            this._msgBck = Hockey.Global.game.add.image(Hockey.Global.GAME_MAX_WIDTH >> 1, 0, Hockey.Global.ATLAS_0, "slideMsgBck");
            this._msgBck.anchor.set(0.5);
            this._msgBck.visible = this._msgBck.exists = false;
            Hockey.Global.game.world.add(this.image, true);
        }
        SlideMsg.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._msgBck.visible = this._msgBck.exists = false;
        };
        SlideMsg.prototype.show = function (y, type, imgTextureKey, imgFrameName, anchorY) {
            if (anchorY === void 0) { anchorY = 0.5; }
            this._msgBck.visible = this._msgBck.exists = true;
            this._msgBck.alpha = 0;
            this._msgBck.y = y;
            Hockey.Global.game.add.tween(this._msgBck).to({ alpha: 1 }, type.slideInTime, Phaser.Easing.Cubic.Out, true);
            _super.prototype.show.call(this, y, type, imgTextureKey, imgFrameName, anchorY);
        };
        SlideMsg.prototype.onStateChange = function (newState) {
            _super.prototype.onStateChange.call(this, newState);
            if (newState == SlideMessage.eSlideMsgState.slideOut) {
                Hockey.Global.game.add.tween(this._msgBck).to({ alpha: 0 }, this.type.slideOutTime, Phaser.Easing.Cubic.In, true);
            }
            else if (newState == SlideMessage.eSlideMsgState.completed) {
                this._msgBck.visible = this._msgBck.exists = false;
            }
        };
        return SlideMsg;
    }(SlideMessage.SlideImgMsg));
    Hockey.SlideMsg = SlideMsg;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var VsMessageTeamPart = (function () {
        function VsMessageTeamPart(parentLayer, leftPart) {
            this._leftPart = leftPart;
            this._layer = Hockey.Global.game.add.group(parentLayer);
            Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "lblVs" + (leftPart ? "L" : "R") + "Bck", this._layer);
            this._teamFlag = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "flag0", this._layer);
            this._teamName = Hockey.Global.game.add.bitmapText(0, 0, "fnt2", "", 40, this._layer);
        }
        VsMessageTeamPart.prototype.reset = function () {
            Hockey.Global.game.tweens.removeFrom(this._layer);
        };
        VsMessageTeamPart.prototype.show = function (teamId) {
            var camera = Hockey.Global.game.camera;
            Hockey.Global.game.tweens.removeFrom(this._layer);
            var bckW = this._layer.width - ((Hockey.Global.GAME_MAX_WIDTH - camera.width) >> 1);
            this._teamFlag.frameName = "flag" + teamId;
            this._teamFlag.scale.set(0.6);
            this._teamName.text = Hockey.Play.TEAM_NAMES[teamId];
            var contentW = Math.round(this._teamFlag.width + VsMessageTeamPart.CONTENT_SPACING + this._teamName.width);
            var contentX;
            if (this._leftPart)
                contentX = (this._layer.width - bckW) + (((bckW - VsMessageTeamPart.CONTENT_BORDER_PADDING) - contentW) >> 1);
            else
                contentX = VsMessageTeamPart.CONTENT_BORDER_PADDING + (((bckW - VsMessageTeamPart.CONTENT_BORDER_PADDING) - contentW) >> 1);
            this._teamFlag.x = contentX;
            this._teamFlag.y = (this._layer.height - this._teamFlag.height) >> 1;
            this._teamName.x = contentX + this._teamFlag.width + VsMessageTeamPart.CONTENT_SPACING;
            this._teamName.y = (this._layer.height - this._teamName.height) >> 1;
            var tween = Hockey.Global.game.add.tween(this._layer);
            if (this._leftPart) {
                this._layer.x = -this._layer.width;
                tween.to({ x: 0 }, 1000, Phaser.Easing.Cubic.Out, true);
            }
            else {
                this._layer.x = Hockey.Global.GAME_MAX_WIDTH;
                tween.to({ x: Hockey.Global.GAME_MAX_WIDTH - this._layer.width }, 1000, Phaser.Easing.Cubic.Out, true);
            }
        };
        VsMessageTeamPart.prototype.hide = function () {
            Hockey.Global.game.tweens.removeFrom(this._layer);
            var tween = Hockey.Global.game.add.tween(this._layer);
            if (this._leftPart) {
                tween.to({ x: -this._layer.width }, 750, Phaser.Easing.Cubic.In, true);
            }
            else {
                tween.to({ x: Hockey.Global.GAME_MAX_WIDTH }, 750, Phaser.Easing.Cubic.In, true);
            }
        };
        VsMessageTeamPart.CONTENT_SPACING = 10;
        VsMessageTeamPart.CONTENT_BORDER_PADDING = 120;
        return VsMessageTeamPart;
    }());
    var VsMessage = (function () {
        function VsMessage() {
            this._onComplete = new Phaser.Signal();
            this._layer = Hockey.Global.game.add.group();
            if (this._layer.parent != null)
                this._layer.parent.removeChild(this._layer);
            this._team1Part = new VsMessageTeamPart(this._layer, true);
            this._team2Part = new VsMessageTeamPart(this._layer, false);
            this._vsPart = Hockey.Global.game.add.image(Hockey.Global.GAME_MAX_WIDTH >> 1, 45, Hockey.Global.ATLAS_0, "lblVs", this._layer);
            this._vsPart.anchor.set(0.5);
        }
        Object.defineProperty(VsMessage.prototype, "onComplete", {
            get: function () { return this._onComplete; },
            enumerable: true,
            configurable: true
        });
        VsMessage.prototype.reset = function () {
            this._team1Part.reset();
            this._team2Part.reset();
            Hockey.Global.game.tweens.removeFrom(this._vsPart);
        };
        VsMessage.prototype.show = function (team1Id, team2Id) {
            Hockey.Global.game.world.add(this._layer, true);
            this._layer.y = Hockey.Global.game.camera.y + 150;
            this._team1Part.show(team1Id);
            this._team2Part.show(team2Id);
            this._vsPart.alpha = 0;
            Hockey.Global.game.add.tween(this._vsPart).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.onShowComplete, this);
        };
        VsMessage.prototype.onShowComplete = function () {
            var tween = Hockey.Global.game.add.tween(this._vsPart).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 1000);
            tween.onStart.add(this.onHideStart, this);
            tween.onComplete.add(this.onHideComplete, this);
        };
        VsMessage.prototype.onHideStart = function () {
            this._team1Part.hide();
            this._team2Part.hide();
        };
        VsMessage.prototype.onHideComplete = function () {
            this._layer.parent.removeChild(this._layer);
            this._onComplete.dispatch();
        };
        return VsMessage;
    }());
    Hockey.VsMessage = VsMessage;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var BarPower = (function () {
        function BarPower() {
            BarPower._instance = this;
            this._layer = Hockey.Global.game.add.group();
            this._emptyBar = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "barPowerE", this._layer);
            this._emptyBar.crop(new Phaser.Rectangle(0, 0, BarPower.BAR_PART_WIDTH, this._emptyBar.height), false);
            this._fullBar = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "barPowerF", this._layer);
            this._fullBar.crop(new Phaser.Rectangle(0, 0, BarPower.BAR_PART_WIDTH, 0), false);
        }
        Object.defineProperty(BarPower, "instance", {
            get: function () {
                return BarPower._instance;
            },
            enumerable: true,
            configurable: true
        });
        BarPower.prototype.update = function (power) {
            var fullBarPartCnt = Math.floor(BarPower.BAR_PART_CNT * power);
            var totalH = (BarPower.BAR_PART_HEIGHT + BarPower.BAR_PARTS_SPACING) * BarPower.BAR_PART_CNT - BarPower.BAR_PARTS_SPACING;
            var h = (BarPower.BAR_PART_HEIGHT + BarPower.BAR_PARTS_SPACING) * fullBarPartCnt - (BarPower.BAR_PARTS_SPACING >> 1);
            if (totalH < h)
                h = totalH;
            else if (h < 0)
                h = 0;
            this._fullBar.cropRect.y = totalH - h;
            this._fullBar.cropRect.height = h;
            this._fullBar.updateCrop();
            this._fullBar.y = this._fullBar.cropRect.y;
            this._emptyBar.cropRect.height = totalH - h;
            this._emptyBar.updateCrop();
        };
        BarPower.prototype.reposition = function () {
            var camera = Hockey.Global.game.camera;
            this._layer.position.set(camera.x + camera.width - 40, camera.y + ((camera.height - this._layer.height) >> 1));
        };
        BarPower.BAR_PART_WIDTH = 20;
        BarPower.BAR_PART_HEIGHT = 14;
        BarPower.BAR_PARTS_SPACING = 10;
        BarPower.BAR_PART_CNT = 22;
        return BarPower;
    }());
    Hockey.BarPower = BarPower;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var BarPucks = (function () {
        function BarPucks() {
            this._fxScaleTweenPars = { x: 2, y: 2 };
            this._fxAlphaTweenPars = { alpha: 0 };
            if (!Hockey.Global.GAMEE || !Gamee.Gamee.instance.ready)
                BarPucks.Y_OFFSET -= 40;
            BarPucks._instance = this;
            this._layer = Hockey.Global.game.add.group();
            Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "barPucks", this._layer);
            this._textFx = Hockey.Global.game.add.bitmapText(150, 38, "fnt1", "", 25, this._layer);
            this._textFx.visible = false;
            this._textFx.anchor.set(0.5);
            this._text = Hockey.Global.game.add.bitmapText(150, 38, "fnt1", "", 25, this._layer);
            this._text.anchor.set(0.5);
        }
        Object.defineProperty(BarPucks, "instance", {
            get: function () { return this._instance; },
            enumerable: true,
            configurable: true
        });
        BarPucks.prototype.reset = function () {
            this._text.text = Hockey.Play.instance.puckCnt.toString() + "/" + Hockey.Play.PUCK_MAX_CNT;
            this._textFx.visible = this._textFx.exists = false;
            this._fxScaleTween = new Phaser.Tween(this._textFx.scale, Hockey.Global.game, Hockey.Global.game.tweens);
            this._fxScaleTween.to(this._fxScaleTweenPars, 1000, Phaser.Easing.Cubic.Out, false);
            this._fxScaleTween.onComplete.add(this.onFxTweenComplete, this);
            this._fxAlphaTween = new Phaser.Tween(this._textFx, Hockey.Global.game, Hockey.Global.game.tweens);
            this._fxAlphaTween.to(this._fxAlphaTweenPars, 1000, Phaser.Easing.Cubic.Out, false);
        };
        BarPucks.prototype.reposition = function () {
            var camera = Hockey.Global.game.camera;
            this._layer.position.set(camera.x + BarPucks.X_OFFSET, camera.y + BarPucks.Y_OFFSET);
        };
        BarPucks.prototype.update = function () {
            this._text.text = Hockey.Play.instance.puckCnt.toString() + "/" + Hockey.Play.PUCK_MAX_CNT;
            if (!this._textFx.visible) {
                this._textFx.text = this._text.text;
                this._textFx.scale.set(1, 1);
                this._textFx.alpha = 1;
                this._textFx.visible = this._textFx.exists = true;
                this._fxScaleTween.start();
                this._fxAlphaTween.start();
            }
        };
        BarPucks.prototype.onFxTweenComplete = function () {
            this._textFx.visible = this._textFx.exists = false;
        };
        BarPucks.X_OFFSET = 20;
        BarPucks.Y_OFFSET = 55;
        return BarPucks;
    }());
    Hockey.BarPucks = BarPucks;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var eDefenderState;
    (function (eDefenderState) {
        eDefenderState[eDefenderState["wait"] = 0] = "wait";
        eDefenderState[eDefenderState["move"] = 1] = "move";
        eDefenderState[eDefenderState["dizziness"] = 2] = "dizziness";
        eDefenderState[eDefenderState["inactive"] = 3] = "inactive";
    })(eDefenderState || (eDefenderState = {}));
    var Defender = (function () {
        function Defender(id) {
            this._defendRects = [];
            this._moveTargetPos = { x: 0, y: 0 };
            this._teamId = -1;
            this._id = id;
            for (var rcId = 0; rcId < Defender.DEFEND_AREA_H_PARTS; rcId++)
                this._defendRects.push(new Phaser.Rectangle(0, 0, 0, 0));
            this._defendRectRndPicker = new Utils.RandomPicker(Hockey.Global.game.rnd, 3, Utils.eRandomPickerMode.incProbOfNonSelItems, 0);
            var spriterLoader = new Spriter.Loader();
            var spriterFile = new Spriter.SpriterJSON(Hockey.Play.instance.cache.getJSON("animDefender"), { imageNameType: Spriter.eImageNameType.NAME_ONLY });
            var spriterData = spriterLoader.load(spriterFile);
            this._sprite = new Spriter.SpriterGroup(Hockey.Global.game, spriterData, Hockey.Global.ATLAS_DEFENDER, "defence", "idle", 100);
            this._reflection = new Spriter.SpriterGroup(Hockey.Global.game, spriterData, Hockey.Global.ATLAS_DEFENDER, "reflection", "idle", 100);
            this._state = eDefenderState.inactive;
        }
        Object.defineProperty(Defender.prototype, "active", {
            get: function () {
                return this._state != eDefenderState.inactive;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Defender.prototype, "teamId", {
            set: function (teamId) {
                if (this._teamId != teamId) {
                    if (this._teamId > 0)
                        this._sprite.removeCharMap(this._teamId.toString());
                    if (teamId > 0)
                        this._sprite.pushCharMap(teamId.toString());
                    this._teamId = teamId;
                }
            },
            enumerable: true,
            configurable: true
        });
        Defender.prototype.reset = function (defenderCnt) {
            var field = Hockey.Field.instance;
            if (this._state == eDefenderState.move) {
                Hockey.Global.game.tweens.remove(this._moveTweenSprite);
                Hockey.Global.game.tweens.remove(this._moveTweenReflection);
            }
            if (this._id < defenderCnt) {
                this._sprite.x = this._reflection.x = (this._id == 0 ? 187 : 543);
                this._sprite.y = this._reflection.y = (this._id == 0 ? 520 : 521);
                this.setScale();
                this._sprite.playAnimationByName("idle");
                this._reflection.playAnimationByName("idle");
                this._sprite.visible = this._sprite.exists = true;
                this._reflection.visible = this._reflection.exists = true;
                this._behindPuck = true;
                this.setDefendRects(defenderCnt);
                this._defendRectRndPicker.reset();
                this._defendRectRndPicker.setItemProbability(this._id == 0 ? 0 : this._defendRects.length - 1, 0);
                this._moveDelay = (this._id == 0 ? Defender.MOVE_MAX_DELAY : Defender.MOVE_MIN_DELAY);
                this._state = eDefenderState.wait;
            }
            else {
                this._state = eDefenderState.inactive;
                this._sprite.visible = this._sprite.exists = false;
                this._reflection.visible = this._reflection.exists = false;
            }
        };
        Defender.prototype.addToLayers = function () {
            if (this._state != eDefenderState.inactive) {
                var field = Hockey.Field.instance;
                field.objectLayer.add(this._sprite);
                field.reflectionLayer.add(this._reflection);
                field.sortObjectInLayer(field.objectLayer, this._sprite);
                field.sortObjectInLayer(field.reflectionLayer, this._reflection);
            }
        };
        Defender.prototype.update = function () {
            if (this._state == eDefenderState.inactive)
                return;
            this._sprite.updateAnimation();
            this._reflection.updateAnimation();
            switch (this._state) {
                case eDefenderState.wait: {
                    if ((this._moveDelay -= Hockey.Global.deltaRatio) <= 0) {
                        this._moveDelay = 0;
                        this.moveToNewPos();
                    }
                    break;
                }
                case eDefenderState.move: {
                    this.setScale();
                    break;
                }
            }
        };
        Defender.prototype.checkCollision = function (puck, moveVector, colRes) {
            if (this._state == eDefenderState.inactive)
                return false;
            var y = this._sprite.y;
            if (moveVector.end.y <= y) {
                var res = false;
                if (this._behindPuck) {
                    this._behindPuck = false;
                    var x = this._sprite.x;
                    var scale = this.getScale();
                    var puckX = moveVector.end.x;
                    var colLine = Defender._tmpLine;
                    var legCol = false;
                    colLine.start.y = colLine.end.y = y;
                    if (this._state != eDefenderState.dizziness) {
                        if (puckX < x) {
                            if (this._state != eDefenderState.dizziness) {
                                colLine.start.x = x + scale * Defender.STICK_COL_X_OFFSET;
                                colLine.end.x = colLine.start.x + scale * Defender.STICK_COL_WIDTH;
                                if (colLine.intersects(moveVector, true, colRes.colPos) != null) {
                                    colRes.colLine = colLine;
                                    colRes.rating = Hockey.ePuckCollisionRating.defenderStick;
                                    this._sprite.onFinish.addOnce(function () {
                                        this._sprite.playAnimationByName("idle");
                                        this._reflection.playAnimationByName("idle");
                                    }, this);
                                    this._sprite.playAnimationByName("defence");
                                    this._reflection.playAnimationByName("defence");
                                    Utils.AudioUtils.playSound("shot" + Hockey.Global.game.rnd.integerInRange(1, 2));
                                    return true;
                                }
                            }
                            colLine.end.x = (colLine.start.x = x + scale * Defender.LLEG_COL_X_OFFSET) + scale * Defender.LLEG_COL_WIDTH;
                            if (colLine.intersects(moveVector, true, colRes.colPos) != null) {
                                colRes.colLine = colLine;
                                legCol = true;
                            }
                        }
                        else {
                            colLine.end.x = (colLine.start.x = x + scale * Defender.RLEG_COL_X_OFFSET) + scale * Defender.RLEG_COL_WIDTH;
                            if (colLine.intersects(moveVector, true, colRes.colPos) != null) {
                                colRes.colLine = colLine;
                                legCol = true;
                            }
                        }
                    }
                    else {
                        colLine.end.x = (colLine.start.x = x + scale * Defender.DIZZY_COL_X_OFFSET) + scale * Defender.DIZZY_COL_WIDTH;
                        if (colLine.intersects(moveVector, true, colRes.colPos) != null) {
                            colRes.colLine = colLine;
                            legCol = true;
                        }
                    }
                    if (legCol) {
                        if (puck.shotPower >= 0.9) {
                            this.hitByFastPuck(colRes);
                        }
                        else {
                            colRes.rating = Hockey.ePuckCollisionRating.defenderLeg;
                            Utils.AudioUtils.playSound("hit1");
                        }
                        return true;
                    }
                }
            }
            else {
                this._behindPuck = true;
            }
            return false;
        };
        Defender.prototype.setDefendRects = function (defenderCnt) {
            var rcW = Math.round(Defender.DEFEND_AREA_W / Defender.DEFEND_AREA_H_PARTS);
            var rcH = Math.round(((Defender.DEFEND_AREA_BY - Defender.DEFEND_AREA_TY) - (Defender.DEFEND_AREAS_V_SPACING * (defenderCnt - 1))) / defenderCnt);
            var rcX = Math.round((Hockey.Global.GAME_MAX_WIDTH - Defender.DEFEND_AREA_W) / 2) + 40;
            var rcY = Defender.DEFEND_AREA_TY + (rcH + Defender.DEFEND_AREAS_V_SPACING) * this._id;
            for (var rcId = 0; rcId < Defender.DEFEND_AREA_H_PARTS; rcId++) {
                this._defendRects[rcId].setTo(rcX, rcY, rcW, rcH);
                rcX += rcW;
            }
        };
        Defender.prototype.hitByFastPuck = function (colRes) {
            var colPos = colRes.colPos;
            colRes.rating = Hockey.ePuckCollisionRating.defenderLegHardHit;
            Utils.AudioUtils.playSound("hit2");
            Hockey.Puck.instance.hitFx.show(colPos.x, colPos.y, 1);
            if (this._state == eDefenderState.dizziness) {
                return false;
            }
            if (this._state == eDefenderState.move) {
                Hockey.Global.game.tweens.remove(this._moveTweenReflection);
                Hockey.Global.game.tweens.remove(this._moveTweenSprite);
                this._defendRectRndPicker.reset();
                var x = this._sprite.x;
                var rcId = this._defendRects.length;
                while (rcId-- != 0) {
                    if (this._defendRects[rcId].x <= x)
                        break;
                }
                this._defendRectRndPicker.setItemProbability(rcId, 0);
            }
            this._sprite.onFinish.addOnce(function () {
                this._sprite.onLoop.add(this.onDizzyAnimLoop, this);
                this._sprite.playAnimationByName("hit_1");
            }, this);
            this._dizzinessAnimRemLoops = 2;
            this._sprite.playAnimationByName("hit_0");
            this._reflection.playAnimationByName("hit_0");
            Hockey.Play.instance.showPopupMessage(colPos.x, colPos.y, "msgHardHit");
            Hockey.Play.instance.score += 100;
            if (!Hockey.Play.instance.incPuckCnt(colPos.x, colPos.y, 1))
                colRes.rating = Hockey.ePuckCollisionRating.defenderLegHardHitNoExtraPuck;
            this._state = eDefenderState.dizziness;
            return true;
        };
        Defender.prototype.setScale = function () {
            var scale = this.getScale();
            this._sprite.scale.set(scale);
            this._reflection.scale.set(scale);
        };
        Defender.prototype.getScale = function () {
            return Defender.MAX_DEPTH_SCALE + (1 - ((Defender.DEFEND_AREA_BY - this._sprite.y) / (Defender.DEFEND_AREA_BY - Defender.DEFEND_AREA_TY))) * (Defender.MIN_DEPTH_SCALE - Defender.MAX_DEPTH_SCALE);
        };
        Defender.prototype.moveToNewPos = function () {
            var rc = this._defendRects[this._defendRectRndPicker.selectItem()];
            this._moveTargetPos.x = Math.round(rc.randomX);
            this._moveTargetPos.y = Math.round(rc.randomY);
            var moveDis = this._sprite.position.distance(Defender._tmpPoint.set(this._moveTargetPos.x, this._moveTargetPos.y), false);
            if (moveDis < Defender.MOVE_MIN_DISTANCE) {
                if (this._moveTargetPos.x > this._sprite.position.x) {
                    this._moveTargetPos.x = this._sprite.position.x + Defender.MOVE_MIN_DISTANCE;
                }
                else {
                    this._moveTargetPos.x = this._sprite.position.x - Defender.MOVE_MIN_DISTANCE;
                }
                moveDis = this._sprite.position.distance(Defender._tmpPoint.set(this._moveTargetPos.x, this._moveTargetPos.y), false);
            }
            var moveTime = (moveDis / 100) * Defender.MOVE_TIME_PER_100_PIX;
            this._moveTweenReflection = Hockey.Global.game.add.tween(this._reflection).to(this._moveTargetPos, moveTime, Phaser.Easing.Cubic.Out, true);
            this._moveTweenSprite = Hockey.Global.game.add.tween(this._sprite).to(this._moveTargetPos, moveTime, Phaser.Easing.Cubic.Out, true);
            this._moveTweenSprite.onComplete.add(function () {
                this._moveDelay = Hockey.Global.game.rnd.integerInRange(Defender.MOVE_MIN_DELAY, Defender.MOVE_MAX_DELAY);
                this._state = eDefenderState.wait;
            }, this);
            this._state = eDefenderState.move;
        };
        Defender.prototype.onDizzyAnimLoop = function () {
            if (--this._dizzinessAnimRemLoops == 0) {
                this._sprite.onFinish.addOnce(function () {
                    this._sprite.playAnimationByName("idle");
                    this._reflection.playAnimationByName("idle");
                    this._moveDelay = Hockey.Global.game.rnd.integerInRange(Defender.MOVE_MIN_DELAY, Defender.MOVE_MAX_DELAY);
                    this._state = eDefenderState.wait;
                }, this);
                this._sprite.onLoop.remove(this.onDizzyAnimLoop, this);
                this._sprite.playAnimationByName("hit_2");
                this._reflection.playAnimationByName("hit_2");
            }
        };
        Defender.STICK_COL_X_OFFSET = -132;
        Defender.STICK_COL_WIDTH = 70;
        Defender.LLEG_COL_X_OFFSET = -56;
        Defender.LLEG_COL_WIDTH = 40;
        Defender.RLEG_COL_X_OFFSET = 15;
        Defender.RLEG_COL_WIDTH = 40;
        Defender.DIZZY_COL_X_OFFSET = -44;
        Defender.DIZZY_COL_WIDTH = 82;
        Defender.MOVE_MIN_DELAY = 60;
        Defender.MOVE_MAX_DELAY = 120;
        Defender.MOVE_MIN_DISTANCE = 100;
        Defender.MOVE_TIME_PER_100_PIX = 500;
        Defender.MAX_DEPTH_SCALE = 0.8;
        Defender.MIN_DEPTH_SCALE = 1;
        Defender.DEFEND_AREA_TY = 490;
        Defender.DEFEND_AREA_BY = 730;
        Defender.DEFEND_AREA_W = 450;
        Defender.DEFEND_AREA_H_PARTS = 3;
        Defender.DEFEND_AREAS_V_SPACING = 40;
        Defender._tmpLine = new Phaser.Line();
        Defender._tmpPoint = new Phaser.Point();
        return Defender;
    }());
    Hockey.Defender = Defender;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var Field = (function () {
        function Field() {
            this._barrierColLinesL = [];
            this._barrierColLinesR = [];
            this._goalColLinesL = [];
            this._goalColLinesR = [];
            Field._instance = this;
            this._barrierColLinesL.push(new Phaser.Line(164, 364, 84, 402));
            this._barrierColLinesL.push(new Phaser.Line(84, 402, 42, 438));
            this._barrierColLinesL.push(new Phaser.Line(42, 438, 16, 500));
            this._barrierColLinesL.push(new Phaser.Line(16, 500, 16, Hockey.Global.GAME_MAX_HEIGHT));
            this._barrierColLinesR.push(new Phaser.Line(Hockey.Global.GAME_MAX_WIDTH - 164, 364, Hockey.Global.GAME_MAX_WIDTH - 84, 402));
            this._barrierColLinesR.push(new Phaser.Line(Hockey.Global.GAME_MAX_WIDTH - 84, 402, Hockey.Global.GAME_MAX_WIDTH - 42, 438));
            this._barrierColLinesR.push(new Phaser.Line(Hockey.Global.GAME_MAX_WIDTH - 42, 438, Hockey.Global.GAME_MAX_WIDTH - 16, 500));
            this._barrierColLinesR.push(new Phaser.Line(Hockey.Global.GAME_MAX_WIDTH - 16, 500, Hockey.Global.GAME_MAX_WIDTH - 16, Hockey.Global.GAME_MAX_HEIGHT));
            this._barrierBackColLine = new Phaser.Line(164, 364, 562, 364);
            this._goalColLinesL.push(new Phaser.Line(Field.GOAL_LX_OUT, 412, Field.GOAL_LX_INNER - 1, 412));
            this._goalColLinesL.push(new Phaser.Line(273, 405, 291, 382));
            this._goalColLinesR.push(new Phaser.Line(Field.GOAL_RX_INNER + 1, 412, Field.GOAL_RX_OUT, 412));
            this._goalColLinesR.push(new Phaser.Line(449, 405, 428, 382));
            this._goalBackColLine = new Phaser.Line(292, 382, 428, 382);
            this._reflectionLayer = Hockey.Global.game.add.group();
            this._objectLayer = Hockey.Global.game.add.group();
            this._debugLayer = Hockey.Global.game.add.graphics(0, 0);
            this._keeper = new Hockey.Keeper();
            this._defender1 = new Hockey.Defender(0);
            this._defender2 = new Hockey.Defender(1);
            this._puck = new Hockey.Puck();
            this._player = new Hockey.Player();
        }
        Object.defineProperty(Field.prototype, "debugLayer", {
            get: function () { return this._debugLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field, "instance", {
            get: function () { return Field._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "reflectionLayer", {
            get: function () { return this._reflectionLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "objectLayer", {
            get: function () { return this._objectLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "defender1", {
            get: function () { return this._defender1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "defender2", {
            get: function () { return this._defender2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "puck", {
            get: function () { return this._puck; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "keeper", {
            get: function () { return this._keeper; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "player", {
            get: function () { return this._player; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "goalsInRow", {
            get: function () { return this._goalsInRow; },
            enumerable: true,
            configurable: true
        });
        Field.prototype.clearLayers = function () {
            this._reflectionLayer.removeAll(false);
            this._objectLayer.removeAll(false);
        };
        Field.prototype.start = function () {
            this.addDefender = false;
            this._keeper.reset();
            this._player.reset();
            this._defender1.reset(0);
            this._defender2.reset(0);
            this._puck.reset(true);
            this._puck.firePuck = false;
            this._goalsInRow = 0;
            this._keeper.addToLayers();
            this._puck.addToLayers();
            this._player.addToLayers();
        };
        Field.prototype.throwPuck = function () {
            this._puck.reset();
        };
        Field.prototype.update = function () {
            this._debugLayer.clear();
            this._keeper.update();
            this._player.update();
            this._defender1.update();
            this._defender2.update();
            this._puck.update();
        };
        Field.prototype.newRound = function (goal, decPuckCnt) {
            if (decPuckCnt === void 0) { decPuckCnt = true; }
            var firePuck = this._puck.firePuck;
            if (firePuck)
                this._puck.firePuck = false;
            if (!goal) {
                this._goalsInRow = 0;
                Hockey.BarFirePuck.instance.clearBars();
                var play = Hockey.Play.instance;
                if (decPuckCnt) {
                    play.decPuckCnt();
                    if (play.puckCnt == 0)
                        return false;
                }
            }
            else {
                if (!firePuck && ++this._goalsInRow == 3) {
                    this._goalsInRow = 0;
                    this._puck.firePuck = true;
                    Hockey.Play.instance.showSlideMessage("lblFirePuck", 0.77);
                }
            }
            if (this.addDefender) {
                this.addDefender = false;
                var camera = Hockey.Global.game.camera;
                camera.onFadeComplete.addOnce(function () {
                    var defenderCnt = this._defender1.active ? 2 : 1;
                    this._defender1.reset(defenderCnt);
                    this._defender2.reset(defenderCnt);
                    this._defender1.addToLayers();
                    this._defender2.addToLayers();
                    this._puck.reset();
                    Hockey.Global.game.camera.flash(0xFFFFFF, 500);
                }, this);
                camera.fade(0xFFFFFF, 500);
                return false;
            }
            return true;
        };
        Field.prototype.sortObjectInLayer = function (layer, object) {
            var objY = object.y;
            var objCurLayerPos = layer.getChildIndex(object);
            var objNewLayerPos = objCurLayerPos;
            var neighborObj;
            while (objNewLayerPos != 0) {
                neighborObj = layer.getAt(objNewLayerPos - 1);
                if (neighborObj.y < objY)
                    break;
                objNewLayerPos--;
                layer.moveDown(object);
            }
            if (objNewLayerPos == objCurLayerPos) {
                var layerObjCnt = layer.total;
                while (objNewLayerPos < layerObjCnt - 1) {
                    neighborObj = layer.getAt(objNewLayerPos + 1);
                    if (neighborObj.y > objY)
                        break;
                    objNewLayerPos++;
                    layer.moveUp(object);
                }
            }
        };
        Field.prototype.checkCollision = function (puck, moveVector, colRes) {
            var puckX = moveVector.end.x;
            var puckY = moveVector.end.y;
            var puckMoveLeft = puckX < Hockey.Global.GAME_MAX_WIDTH / 2;
            var collision = false;
            while (true) {
                var colLineId = void 0;
                var colLine = void 0;
                if (puckY <= Field.GOAL_LINE_Y_OUT && puckX >= Field.GOAL_LX_OUT && puckY <= Field.GOAL_RX_OUT) {
                    colLineId = this._goalColLinesL.length;
                    if (puckMoveLeft) {
                        while (colLineId-- != 0) {
                            colLine = this._goalColLinesL[colLineId];
                            if (colLine.intersects(moveVector, true, colRes.colPos) != null) {
                                if (colLineId != 0) {
                                    colRes.rating = Hockey.ePuckCollisionRating.goalNet;
                                }
                                else {
                                    colRes.rating = Hockey.ePuckCollisionRating.goalFrame;
                                }
                                colRes.colLine = colLine;
                                collision = true;
                                break;
                            }
                        }
                    }
                    else {
                        while (colLineId-- != 0) {
                            colLine = this._goalColLinesR[colLineId];
                            if (colLine.intersects(moveVector, true, colRes.colPos) != null) {
                                if (colLineId != 0) {
                                    colRes.rating = Hockey.ePuckCollisionRating.goalNet;
                                }
                                else {
                                    colRes.rating = Hockey.ePuckCollisionRating.goalFrame;
                                }
                                colRes.colLine = colLine;
                                collision = true;
                                break;
                            }
                        }
                    }
                    if (collision)
                        break;
                    if (this._goalBackColLine.intersects(moveVector, true, colRes.colPos) != null) {
                        colRes.colLine = this._goalBackColLine;
                        colRes.rating = Hockey.ePuckCollisionRating.goalNet;
                        collision = true;
                        break;
                    }
                }
                colLineId = this._barrierColLinesL.length;
                if (puckMoveLeft) {
                    while (colLineId-- != 0) {
                        colLine = this._barrierColLinesL[colLineId];
                        if (colLine.end.y < puckY)
                            break;
                        if (colLine.intersects(moveVector, true, colRes.colPos) != null) {
                            colRes.colLine = colLine;
                            colRes.rating = Hockey.ePuckCollisionRating.barrier;
                            collision = true;
                            break;
                        }
                    }
                }
                else {
                    var colLineId_1 = this._barrierColLinesR.length;
                    while (colLineId_1-- != 0) {
                        colLine = this._barrierColLinesR[colLineId_1];
                        if (colLine.end.y < puckY)
                            break;
                        if (colLine.intersects(moveVector, true, colRes.colPos) != null) {
                            colRes.colLine = colLine;
                            colRes.rating = Hockey.ePuckCollisionRating.barrier;
                            collision = true;
                            break;
                        }
                    }
                }
                if (collision)
                    break;
                if (this._barrierBackColLine.intersects(moveVector, true, colRes.colPos) != null) {
                    colRes.colLine = this._barrierBackColLine;
                    colRes.rating = Hockey.ePuckCollisionRating.barrier;
                    collision = true;
                    break;
                }
                break;
            }
            if (collision) {
                var sfx = null;
                var play = Hockey.Play.instance;
                if (colRes.rating == Hockey.ePuckCollisionRating.barrier) {
                    play.showPopupMessage(colRes.colPos.x, colRes.colPos.y, "msgMiss");
                    sfx = "hit0";
                }
                else if (colRes.rating == Hockey.ePuckCollisionRating.goalFrame) {
                    play.showPopupMessage(colRes.colPos.x, colRes.colPos.y, "msgScore50");
                    play.score += 50;
                    sfx = "hit0";
                }
                if (sfx != null)
                    Utils.AudioUtils.playSound(sfx);
                return true;
            }
            return false;
        };
        Field.GOAL_LX_OUT = 252;
        Field.GOAL_RX_OUT = 471;
        Field.GOAL_LINE_Y_OUT = 412;
        Field.GOAL_LX_INNER = 283;
        Field.GOAL_RX_INNER = 440;
        Field.GOAL_LINE_Y_INNER = 404;
        return Field;
    }());
    Hockey.Field = Field;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var GoalFx = (function (_super) {
        __extends(GoalFx, _super);
        function GoalFx() {
            _super.call(this, Hockey.Global.game);
            this._lightFxTweenPars = { alpha: 0 };
            GoalFx._instance = this;
            this._lightFx = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "lightFx");
            var emitter = Hockey.Global.game.add.emitter(0, 0);
            this._partEmitter = emitter;
            emitter.makeParticles(Hockey.Global.ATLAS_0, "starParticle", 30, false, false);
            emitter.setXSpeed(-300, 300);
            emitter.setYSpeed(-700, -300);
            emitter.setAlpha(1, 0, 2000, Phaser.Easing.Linear.None, false);
            emitter.setScale(1, 1.25, 1, 1.25, 2000);
            emitter.gravity = 1400;
            this._msgContainer = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "lblGoal");
            this._msgType = new SlideMessage.SlideMsgType(-1, 500, Phaser.Easing.Cubic.Out, 0, null, 500, 1000, Phaser.Easing.Cubic.In, 0);
        }
        Object.defineProperty(GoalFx, "instance", {
            get: function () { return GoalFx._instance; },
            enumerable: true,
            configurable: true
        });
        GoalFx.prototype.getMsgContainer = function () {
            return this._msgContainer;
        };
        GoalFx.prototype.onStateChange = function (newState) {
            _super.prototype.onStateChange.call(this, newState);
            switch (newState) {
                case SlideMessage.eSlideMsgState.slideIn: {
                    Utils.AudioUtils.playSound("goal");
                    this._msgContainer.exists = true;
                    this._msgContainer.visible = true;
                    this._lightFx.alpha = 0;
                    this._lightFx.exists = true;
                    this._lightFx.visible = true;
                    this._lightFxTweenPars.alpha = 1;
                    Hockey.Global.game.add.tween(this._lightFx).to(this._lightFxTweenPars, this.type.slideInTime, Phaser.Easing.Cubic.Out, true);
                    this.emitParticles();
                    break;
                }
                case SlideMessage.eSlideMsgState.slideOut: {
                    this._lightFxTweenPars.alpha = 0;
                    Hockey.Global.game.add.tween(this._lightFx).to(this._lightFxTweenPars, this.type.slideOutTime, Phaser.Easing.Cubic.In, true);
                    break;
                }
                case SlideMessage.eSlideMsgState.completed: {
                    this.reset();
                    break;
                }
            }
        };
        GoalFx.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._msgContainer.exists = false;
            this._msgContainer.visible = false;
            this._lightFx.exists = false;
            this._lightFx.visible = false;
            Hockey.Global.game.tweens.removeFrom(this._lightFx);
        };
        GoalFx.prototype.show = function () {
            _super.prototype.showMessage.call(this, Hockey.Global.game.camera.y + 150, this._msgType);
        };
        GoalFx.prototype.emitParticles = function () {
            var camera = Hockey.Global.game.camera;
            var rnd = Hockey.Global.game.rnd;
            this._partEmitter.position.set(camera.x + (camera.width >> 1) + rnd.integerInRange(-50, 50), camera.y + 240);
            this._partEmitter.explode(2000, 15);
        };
        return GoalFx;
    }(SlideMessage.SlideMsgBase));
    Hockey.GoalFx = GoalFx;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    (function (eKeeperState) {
        eKeeperState[eKeeperState["guarding"] = 0] = "guarding";
        eKeeperState[eKeeperState["kneelDown"] = 1] = "kneelDown";
    })(Hockey.eKeeperState || (Hockey.eKeeperState = {}));
    var eKeeperState = Hockey.eKeeperState;
    var Keeper = (function () {
        function Keeper() {
            this._colLines = [];
            this._tmpLine = new Phaser.Line();
            this._teamId = -1;
            Keeper._instance = this;
            this._colLines.push(new Phaser.Line(-59, Keeper.Y, -59 + 22, Keeper.Y));
            this._colLines.push(new Phaser.Line(-9, Keeper.Y, -9 + 61, Keeper.Y));
            var spriterLoader = new Spriter.Loader();
            var spriterFile = new Spriter.SpriterJSON(Hockey.Play.instance.cache.getJSON("animKeeper"), { imageNameType: Spriter.eImageNameType.NAME_ONLY });
            var spriterData = spriterLoader.load(spriterFile);
            this._sprite = new Spriter.SpriterGroup(Hockey.Global.game, spriterData, Hockey.Global.ATLAS_KEEPER, "keeper", "idle", 100);
            this._reflection = new Spriter.SpriterGroup(Hockey.Global.game, spriterData, Hockey.Global.ATLAS_KEEPER, "reflection", "idle", 100);
        }
        Object.defineProperty(Keeper, "instance", {
            get: function () { return Keeper._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Keeper.prototype, "teamId", {
            set: function (teamId) {
                if (this._teamId != teamId) {
                    if (this._teamId > 0)
                        this._sprite.removeCharMap(this._teamId.toString());
                    if (teamId > 0)
                        this._sprite.pushCharMap(teamId.toString());
                    this._teamId = teamId;
                }
            },
            enumerable: true,
            configurable: true
        });
        Keeper.prototype.reset = function () {
            this._state = eKeeperState.guarding;
            this._reflection.x = this._sprite.x = Hockey.Global.GAME_MAX_WIDTH / 2;
            this._reflection.y = this._sprite.y = Keeper.Y;
            this._moveDir = -1;
            this._sprite.playAnimationByName("idle");
            this._reflection.playAnimationByName("idle");
        };
        Keeper.prototype.addToLayers = function () {
            var field = Hockey.Field.instance;
            field.objectLayer.add(this._sprite);
            field.reflectionLayer.add(this._reflection);
            field.sortObjectInLayer(field.objectLayer, this._sprite);
            field.sortObjectInLayer(field.reflectionLayer, this._reflection);
        };
        Keeper.prototype.update = function () {
            this._sprite.updateAnimation();
            this._reflection.updateAnimation();
            if (this._state == eKeeperState.guarding)
                this.updatePosition();
        };
        Keeper.prototype.checkCollision = function (puck, moveVector, colRes) {
            var lineId = this._colLines.length;
            var x = this._sprite.x;
            var y = this._sprite.y;
            while (lineId-- != 0) {
                var line = this._colLines[lineId];
                this._tmpLine.setTo(line.start.x + x, line.y, line.end.x + x, line.y);
                if (moveVector.intersects(this._tmpLine, true, colRes.colPos) != null) {
                    colRes.colLine = this._tmpLine;
                    colRes.rating = Hockey.ePuckCollisionRating.keeper;
                    this._state = eKeeperState.kneelDown;
                    this._sprite.playAnimationByName("kneel_down");
                    this._sprite.onFinish.addOnce(function () {
                        this._sprite.playAnimationByName("idle");
                        this._reflection.playAnimationByName("idle");
                        this._state = eKeeperState.guarding;
                    }, this);
                    this._reflection.playAnimationByName("kneel_down");
                    Utils.AudioUtils.playSound("hit1");
                    return true;
                }
            }
            return false;
        };
        Keeper.prototype.updatePosition = function () {
            var x = this._sprite.x + (Keeper.MOVE_SPEED * Hockey.Global.deltaRatio * this._moveDir);
            if (x <= Keeper.MOVE_MAX_OFFSET) {
                x = Keeper.MOVE_MAX_OFFSET + (Keeper.MOVE_MAX_OFFSET - x);
                this._moveDir = 1;
            }
            else if (x >= Hockey.Global.GAME_MAX_WIDTH - Keeper.MOVE_MAX_OFFSET) {
                x = (Hockey.Global.GAME_MAX_WIDTH - Keeper.MOVE_MAX_OFFSET) - (x - (Hockey.Global.GAME_MAX_WIDTH - Keeper.MOVE_MAX_OFFSET));
                this._moveDir = -1;
            }
            this._sprite.x = x;
            this._reflection.x = x;
        };
        Keeper.Y = 428;
        Keeper.MOVE_SPEED = 2;
        Keeper.MOVE_MAX_OFFSET = 250;
        return Keeper;
    }());
    Hockey.Keeper = Keeper;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var ePlayerState;
    (function (ePlayerState) {
        ePlayerState[ePlayerState["beforeShot"] = 0] = "beforeShot";
        ePlayerState[ePlayerState["shot1"] = 1] = "shot1";
        ePlayerState[ePlayerState["shot2"] = 2] = "shot2";
        ePlayerState[ePlayerState["afterShot"] = 3] = "afterShot";
    })(ePlayerState || (ePlayerState = {}));
    var Player = (function () {
        function Player() {
            this._teamId = -1;
            Player._instance = this;
            var spriterLoader = new Spriter.Loader();
            var spriterFile = new Spriter.SpriterJSON(Hockey.Play.instance.cache.getJSON("animShooter"), { imageNameType: Spriter.eImageNameType.NAME_ONLY });
            var spriterData = spriterLoader.load(spriterFile);
            this._sprite = new Spriter.SpriterGroup(Hockey.Global.game, spriterData, Hockey.Global.ATLAS_SHOOTER, "shooter", "idle", 100);
            this._sprite.onEvent.add(this.onAnimEvent, this);
            this._sprite.onFinish.add(this.onAnimFinish, this);
            this._reflection = new Spriter.SpriterGroup(Hockey.Global.game, spriterData, Hockey.Global.ATLAS_SHOOTER, "reflection", "idle", 100);
        }
        Object.defineProperty(Player, "instance", {
            get: function () {
                return Player._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "hockeyStickCenterHPos", {
            get: function () {
                return this._sprite.x + Player.HOCKEY_STICK_CENTER_OFFSET;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "teamId", {
            set: function (teamId) {
                if (this._teamId != teamId) {
                    if (this._teamId > 0)
                        this._sprite.removeCharMap(this._teamId.toString());
                    if (teamId > 0)
                        this._sprite.pushCharMap(teamId.toString());
                    this._teamId = teamId;
                }
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.reset = function () {
            this._sprite.x = this._reflection.x = Player.START_X;
            this._sprite.y = this._reflection.y = Player.START_Y;
            this._state = ePlayerState.beforeShot;
            this._sprite.playAnimationByName("idle");
            this._reflection.playAnimationByName("idle");
            this._shotPower = 0;
            this._shotIniTime = undefined;
            Hockey.BarPower.instance.update(0);
        };
        Player.prototype.addToLayers = function () {
            var field = Hockey.Field.instance;
            field.objectLayer.add(this._sprite);
            field.reflectionLayer.add(this._reflection);
            field.sortObjectInLayer(field.objectLayer, this._sprite);
            field.sortObjectInLayer(field.reflectionLayer, this._reflection);
        };
        Player.prototype.update = function () {
            this._sprite.updateAnimation();
            this._reflection.updateAnimation();
            switch (this._state) {
                case ePlayerState.beforeShot: {
                    this.processBeforeShot();
                    break;
                }
                case ePlayerState.afterShot: {
                    this.processAfterShot();
                    break;
                }
                case ePlayerState.shot1: {
                    if (this._animPrepShotComplete)
                        this.startShootingAnim();
                    break;
                }
            }
        };
        Player.prototype.followPointer = function () {
            var actPointer = Hockey.Global.game.input.activePointer;
            if (actPointer != null && (actPointer.isMouse || actPointer.isDown)) {
                var camera = Hockey.Global.game.camera;
                var x = actPointer.x;
                if (x < camera.x) {
                    x = camera.x;
                }
                else if (x + 220 > camera.x + camera.width) {
                    x = camera.x + camera.width - 220;
                }
                if (Math.abs(this._sprite.x - x) > Player.MOVE_SPEED) {
                    x = this._sprite.x + (this._sprite.x < x ? Player.MOVE_SPEED : -Player.MOVE_SPEED);
                }
                this._sprite.x = this._reflection.x = x;
            }
        };
        Player.prototype.processBeforeShot = function () {
            this.followPointer();
            if (Hockey.Global.game.input.activePointer.isDown) {
                if (this._shotIniTime == undefined) {
                    this._shotIniTime = Hockey.Global.elapsedTime;
                    this._animPrepShotComplete = false;
                    this._sprite.playAnimationByName("shooting_0");
                    this._reflection.playAnimationByName("shooting_0");
                }
                else {
                    var power = Math.min(1, (Hockey.Global.elapsedTime - this._shotIniTime) / Player.MAX_SHOT_POWER_TIME);
                    if (power != this._shotPower) {
                        this._shotPower = power;
                        Hockey.BarPower.instance.update(power);
                    }
                }
            }
            else if (this._shotIniTime != undefined) {
                this._shotIniTime = undefined;
                this._shotMaxPowTime = undefined;
                if (this._animPrepShotComplete) {
                    this.startShootingAnim();
                }
                else {
                    this._state = ePlayerState.shot1;
                }
            }
        };
        Player.prototype.processAfterShot = function () {
            this.followPointer();
            if (Hockey.Puck.instance.state == Hockey.ePuckState.waitForShot) {
                this._state = ePlayerState.beforeShot;
            }
        };
        Player.prototype.startShootingAnim = function () {
            this._sprite.playAnimationByName("shooting_1");
            this._reflection.playAnimationByName("shooting_1");
            this._state = ePlayerState.shot2;
        };
        Player.prototype.onAnimEvent = function () {
            Hockey.Field.instance.puck.shoot(this._shotPower);
            this._shotPower = 0;
            Hockey.BarPower.instance.update(0);
        };
        Player.prototype.onAnimFinish = function (sprite) {
            switch (sprite.currentAnimationName) {
                case "shooting_0": {
                    this._animPrepShotComplete = true;
                    break;
                }
                case "shooting_1": {
                    this._sprite.playAnimationByName("idle");
                    this._reflection.playAnimationByName("idle");
                    this._state = ePlayerState.afterShot;
                    break;
                }
            }
        };
        Player.START_X = 200;
        Player.START_Y = 970;
        Player.HOCKEY_STICK_CENTER_OFFSET = 180;
        Player.HOCKEY_STICK_RADIUS = 48;
        Player.MOVE_SPEED = 8;
        Player.MAX_SHOT_POWER_TIME = 500;
        return Player;
    }());
    Hockey.Player = Player;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var PopupMsg = (function (_super) {
        __extends(PopupMsg, _super);
        function PopupMsg() {
            _super.call(this, Hockey.Global.game);
            this._msg = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "msgMiss");
            this._msg.anchor.set(0.5, 1);
            this._msg.exists = this._msg.visible = false;
        }
        PopupMsg.prototype.getMsgContainer = function () {
            return this._msg;
        };
        PopupMsg.prototype.show = function (x, y, type, imgFrameName) {
            this._msg.frameName = imgFrameName;
            this._msg.exists = this._msg.visible = true;
            this._msg.parent.bringToTop(this._msg);
            _super.prototype.showMessage.call(this, x, y, type);
        };
        PopupMsg.prototype.onComplete = function () {
            this._msg.exists = this._msg.visible = false;
            Hockey.Play.instance.popupMsgPool.returnItem(this);
        };
        return PopupMsg;
    }(PopupMessage.PopupMsgBase));
    Hockey.PopupMsg = PopupMsg;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var PuckHitFx = (function () {
        function PuckHitFx() {
            var spriterLoader = new Spriter.Loader();
            var spriterFile = new Spriter.SpriterJSON(Hockey.Play.instance.cache.getJSON("animHitFx"), { imageNameType: Spriter.eImageNameType.NAME_ONLY });
            this._sprite = new Spriter.SpriterGroup(Hockey.Global.game, spriterLoader.load(spriterFile), Hockey.Global.ATLAS_0, "hitFx", "default", 100);
            this._sprite.onFinish.add(this.hide, this);
            this.hide();
        }
        PuckHitFx.prototype.hide = function () {
            if (this._sprite.parent != null) {
                this._sprite.parent.removeChild(this._sprite);
            }
        };
        PuckHitFx.prototype.show = function (x, y, scale) {
            if (this._sprite.parent == null)
                Hockey.Field.instance.objectLayer.addChild(this._sprite);
            this._sprite.position.set(x, y);
            this._sprite.scale.set(scale);
            Hockey.Field.instance.sortObjectInLayer(Hockey.Field.instance.objectLayer, this._sprite);
            this._sprite.playAnimationByName("default");
        };
        PuckHitFx.prototype.update = function () {
            if (this._sprite.parent != null)
                this._sprite.updateAnimation();
        };
        return PuckHitFx;
    }());
    Hockey.PuckHitFx = PuckHitFx;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    (function (ePuckState) {
        ePuckState[ePuckState["waitForShot"] = 0] = "waitForShot";
        ePuckState[ePuckState["shot"] = 1] = "shot";
        ePuckState[ePuckState["shotBounce"] = 2] = "shotBounce";
        ePuckState[ePuckState["waitForResult"] = 3] = "waitForResult";
        ePuckState[ePuckState["idle"] = 4] = "idle";
    })(Hockey.ePuckState || (Hockey.ePuckState = {}));
    var ePuckState = Hockey.ePuckState;
    (function (ePuckCollisionRating) {
        ePuckCollisionRating[ePuckCollisionRating["none"] = 0] = "none";
        ePuckCollisionRating[ePuckCollisionRating["goalNet"] = 1] = "goalNet";
        ePuckCollisionRating[ePuckCollisionRating["goalFrame"] = 2] = "goalFrame";
        ePuckCollisionRating[ePuckCollisionRating["barrier"] = 3] = "barrier";
        ePuckCollisionRating[ePuckCollisionRating["defenderStick"] = 4] = "defenderStick";
        ePuckCollisionRating[ePuckCollisionRating["defenderLeg"] = 5] = "defenderLeg";
        ePuckCollisionRating[ePuckCollisionRating["defenderLegHardHit"] = 6] = "defenderLegHardHit";
        ePuckCollisionRating[ePuckCollisionRating["defenderLegHardHitNoExtraPuck"] = 7] = "defenderLegHardHitNoExtraPuck";
        ePuckCollisionRating[ePuckCollisionRating["keeper"] = 8] = "keeper";
    })(Hockey.ePuckCollisionRating || (Hockey.ePuckCollisionRating = {}));
    var ePuckCollisionRating = Hockey.ePuckCollisionRating;
    var PuckCollisionResult = (function () {
        function PuckCollisionResult() {
            this.colPos = new Phaser.Point();
        }
        return PuckCollisionResult;
    }());
    Hockey.PuckCollisionResult = PuckCollisionResult;
    var Puck = (function () {
        function Puck() {
            this._prevPosition = new Phaser.Point();
            this._processFnc = [];
            this._tmpLine = new Phaser.Line();
            this._tmpPoint = new Phaser.Point();
            this._firePuck = false;
            Puck._instance = this;
            this._colResult = new PuckCollisionResult();
            this._processFnc[ePuckState.waitForShot] = this.processWaitForShot;
            this._processFnc[ePuckState.shot] = this.processShot;
            this._processFnc[ePuckState.shotBounce] = this.processShotBounce;
            this._processFnc[ePuckState.waitForResult] = this.processWaitForResult;
            this._layer = new Phaser.Group(Hockey.Global.game);
            this._tail = new Hockey.PuckTail(Puck.MIN_VELOCITY, Puck.MAX_VELOCITY, 0.5);
            this._sprite = Hockey.Global.game.add.image(0, 0, Hockey.Global.ATLAS_0, "puck", this._layer);
            this._sprite.pivot.set(20, 11);
            this._hitFx = new Hockey.PuckHitFx();
        }
        Object.defineProperty(Puck, "instance", {
            get: function () { return Puck._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Puck.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Puck.prototype, "shotPower", {
            get: function () {
                return this._shotPower;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Puck.prototype, "position", {
            get: function () {
                return this._layer.position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Puck.prototype, "prevPosition", {
            get: function () {
                return this._prevPosition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Puck.prototype, "layer", {
            get: function () {
                return this._layer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Puck.prototype, "hitFx", {
            get: function () {
                return this._hitFx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Puck.prototype, "firePuck", {
            get: function () {
                return this._firePuck;
            },
            set: function (firePuck) {
                if (firePuck == this._firePuck)
                    return;
                this._firePuck = firePuck;
                this._tail.firePuck = firePuck;
                this._sprite.frameName = firePuck ? "firePuck" : "puck";
            },
            enumerable: true,
            configurable: true
        });
        Puck.prototype.reset = function (toIdleState) {
            if (toIdleState === void 0) { toIdleState = false; }
            if (toIdleState) {
                this._layer.visible = false;
                this._state = ePuckState.idle;
                return;
            }
            this._state = ePuckState.waitForShot;
            this.position.set(Hockey.Global.game.camera.x + Hockey.Global.game.camera.width + Puck.H_RADIUS, Puck.START_Y);
            this._prevPosition.copyFrom(this.position);
            this._layer.scale.set(1);
            this._layer.alpha = 1;
            this._layer.visible = true;
            this._tail.hide();
            this._hitFx.hide();
            this._moveVelocity = -Puck.IDLE_MOVE_MIN_SPEED;
        };
        Puck.prototype.addToLayers = function () {
            var field = Hockey.Field.instance;
            field.objectLayer.add(this._layer);
            field.sortObjectInLayer(field.objectLayer, this._layer);
        };
        Puck.prototype.update = function () {
            if (this._state != ePuckState.idle) {
                this._processFnc[this._state].call(this);
                this._hitFx.update();
            }
        };
        Puck.prototype.shoot = function (shotPower) {
            var puckOffset = this.position.x - Hockey.Player.instance.hockeyStickCenterHPos;
            if (Math.abs(puckOffset) > Hockey.Player.HOCKEY_STICK_RADIUS)
                return false;
            this._moveDir = Phaser.Math.degToRad(270 + ((puckOffset / Hockey.Player.HOCKEY_STICK_RADIUS) * 20));
            this._moveVelocity = Puck.MIN_VELOCITY + (Puck.MAX_VELOCITY - Puck.MIN_VELOCITY) * shotPower;
            this._shotPower = shotPower;
            this._goal = false;
            this._tail.show();
            this._colResult.rating = ePuckCollisionRating.none;
            this._state = ePuckState.shot;
            if (this._firePuck)
                Hockey.BarFirePuck.instance.clearBars();
            Utils.AudioUtils.playSound("shot" + Hockey.Global.game.rnd.integerInRange(1, 2));
            return true;
        };
        Puck.prototype.processWaitForShot = function () {
            var camera = Hockey.Global.game.camera;
            var x = this.position.x + this._moveVelocity * Hockey.Global.deltaRatio;
            this._prevPosition.x = x;
            if ((this._moveVelocity < 0 && x + Puck.H_RADIUS < camera.x) || (this._moveVelocity > 0 && x - Puck.H_RADIUS > camera.x + camera.width)) {
                if (this._moveVelocity < 0) {
                    this._moveVelocity *= -1.3;
                }
                else {
                    var camera_1 = Hockey.Global.game.camera;
                    this._state = ePuckState.idle;
                    Hockey.Play.instance.showPopupMessage(camera_1.x + camera_1.width - 55, Puck.START_Y, "msgMiss");
                    if (Hockey.Field.instance.newRound(false))
                        this.reset();
                }
            }
            this.position.x = x;
        };
        Puck.prototype.processShot = function () {
            var puckPos = this.position;
            var moveVector = this._tmpLine;
            moveVector.start.copyFrom(puckPos);
            if (!this.updatePosition()) {
                this._state = ePuckState.waitForResult;
                this._tail.hide();
                return;
            }
            this._tail.update();
            this.checkGoal();
            var field = Hockey.Field.instance;
            var colRes = this._colResult;
            moveVector.end.copyFrom(puckPos);
            colRes.rating = ePuckCollisionRating.none;
            while (true) {
                if (field.checkCollision(this, moveVector, colRes)) {
                    break;
                }
                if (field.defender1.checkCollision(this, moveVector, colRes) || field.defender2.checkCollision(this, moveVector, colRes)) {
                    break;
                }
                if (Hockey.Keeper.instance.checkCollision(this, moveVector, colRes)) {
                    break;
                }
                break;
            }
            if (colRes.rating != ePuckCollisionRating.none) {
                if (!this._firePuck || colRes.rating < ePuckCollisionRating.defenderStick) {
                    puckPos.copyFrom(colRes.colPos);
                    field.sortObjectInLayer(field.objectLayer, this._layer);
                    this._tail.hide();
                    this._moveDir = moveVector.reflect(colRes.colLine);
                    this._bounceTime = Hockey.Global.elapsedTime;
                    this._state = ePuckState.shotBounce;
                    this._moveVelocity = (colRes.rating == ePuckCollisionRating.goalNet ? Math.min(2, this._moveVelocity) : this._moveVelocity / 2);
                }
            }
        };
        Puck.prototype.processShotBounce = function () {
            if (this._bounceTime + Puck.BOUNCE_LEN <= Hockey.Global.elapsedTime) {
                this._layer.alpha = 0;
                this._state = ePuckState.waitForResult;
            }
            else {
                this._layer.alpha = (this._bounceTime + Puck.BOUNCE_LEN - Hockey.Global.elapsedTime) / Puck.BOUNCE_LEN;
                this.updatePosition();
                this.checkGoal();
            }
        };
        Puck.prototype.checkGoal = function () {
            var puckPos = this.position;
            if (!this._goal && puckPos.y <= Hockey.Field.GOAL_LINE_Y_INNER && puckPos.x >= Hockey.Field.GOAL_LX_INNER && puckPos.x <= Hockey.Field.GOAL_RX_INNER) {
                this._goal = true;
                var play = Hockey.Play.instance;
                var score = (this._firePuck ? 1000 : 500);
                play.score += score;
                play.showPopupMessage(puckPos.x, puckPos.y, "msgScore" + score);
                play.incPuckCnt(puckPos.x, puckPos.y, 3);
                if (!this._firePuck)
                    Hockey.BarFirePuck.instance.incBars();
                Hockey.GoalFx.instance.show();
            }
        };
        Puck.prototype.processWaitForResult = function () {
            if (!this._goal || Hockey.GoalFx.instance.state == SlideMessage.eSlideMsgState.completed) {
                if (!this._goal && this._colResult.rating == ePuckCollisionRating.none) {
                    Hockey.Play.instance.showPopupMessage(this.position.x, this.position.y, "msgMiss");
                }
                if (Hockey.Field.instance.newRound(this._goal, !this._goal && this._colResult.rating != ePuckCollisionRating.defenderLegHardHitNoExtraPuck)) {
                    this.reset();
                }
                else {
                    this._state = ePuckState.idle;
                }
            }
        };
        Puck.prototype.updatePosition = function () {
            var pos = this.position;
            var distanceRatio = Puck.getDistanceRatio(pos.y);
            this._prevPosition.copyFrom(pos);
            this._layer.scale.set(1 - distanceRatio * 0.5);
            var velocity = this._moveVelocity;
            if (velocity > 0) {
                this._moveVelocity = velocity - Puck.SLIDE_FRICTION * Hockey.Global.deltaRatio;
                if (velocity != 0) {
                    velocity = (velocity - (distanceRatio * 0.5 * velocity)) * Hockey.Global.deltaRatio;
                    pos.x += Math.cos(this._moveDir) * velocity;
                    pos.y += Math.sin(this._moveDir) * velocity;
                }
                var field = Hockey.Field.instance;
                field.sortObjectInLayer(field.objectLayer, this._layer);
                return true;
            }
            return false;
        };
        Puck.getDistanceRatio = function (y) {
            return (Puck.START_Y - y) / (Puck.START_Y - Hockey.Field.GOAL_LINE_Y_INNER);
        };
        Puck.START_Y = 912;
        Puck.H_RADIUS = 22;
        Puck.BOUNCE_LEN = 250;
        Puck.IDLE_MOVE_MIN_SPEED = 4;
        Puck.IDLE_MOVE_MAX_SPEED = 8;
        Puck.SLIDE_MIN_SPEED = 10;
        Puck.SLIDE_MAX_SPEED = 20;
        Puck.SLIDE_FRICTION = 0.1;
        Puck.MIN_VELOCITY = 5;
        Puck.MAX_VELOCITY = 25;
        return Puck;
    }());
    Hockey.Puck = Puck;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var PuckTail = (function () {
        function PuckTail(minSpeed, maxSpeed, minSpeedHeightRatio) {
            this._sprite = Hockey.Global.game.add.sprite(0, 0, Hockey.Global.ATLAS_0, "puckTail", Hockey.Puck.instance.layer);
            this._sprite.crop(new Phaser.Rectangle(0, 0, this._sprite.width, this._sprite.height), false);
            this._sprite.anchor.set(0.5, 0);
            this._minSpeed = minSpeed;
            this._maxSpeed = maxSpeed;
            this._minSpeedHeightRatio = minSpeedHeightRatio;
            this._maxSpeedHeight = this._sprite.height;
        }
        Object.defineProperty(PuckTail.prototype, "firePuck", {
            set: function (firePuck) {
                this._sprite.frameName = (firePuck ? "firePuckTail" : "puckTail");
                var cropRc = this._sprite.cropRect;
                this._sprite.crop(null, true);
                this._maxSpeedHeight = this._sprite.height;
                cropRc.width = this._sprite.width;
                cropRc.height = this._maxSpeedHeight;
                this._sprite.crop(cropRc, false);
            },
            enumerable: true,
            configurable: true
        });
        PuckTail.prototype.show = function () {
            this._sprite.visible = true;
        };
        PuckTail.prototype.hide = function () {
            this._sprite.visible = false;
        };
        PuckTail.prototype.update = function () {
            var puck = Hockey.Puck.instance;
            var curPos = puck.position;
            var prePos = puck.prevPosition;
            if (curPos.equals(prePos))
                return;
            var speed = Math.max(curPos.distance(prePos, false), this._minSpeed);
            var angle = curPos.angle(prePos, true);
            this._sprite.angle = angle - 90;
            var minSpeedHeight = Math.round(this._minSpeedHeightRatio * this._maxSpeedHeight);
            var speedRatio = Math.min((speed - this._minSpeed) / (this._maxSpeed - this._minSpeed), 1);
            var height = Math.round(minSpeedHeight + (this._maxSpeedHeight - minSpeedHeight) * speedRatio);
            if (height > Hockey.Puck.START_Y - curPos.y)
                height = Hockey.Puck.START_Y - curPos.y;
            this._sprite.cropRect.y = this._maxSpeedHeight - height;
            this._sprite.cropRect.height = height;
            this._sprite.updateCrop();
        };
        return PuckTail;
    }());
    Hockey.PuckTail = PuckTail;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var TeamButton = (function () {
        function TeamButton(x, y, id, layer, onClickFnc, onClickContext) {
            this._flag = Hockey.Global.game.add.image(x, y, Hockey.Global.ATLAS_0, "flag0", layer);
            this._flag.anchor.set(0.5);
            this._flag.frameName = "flag" + id;
            this._button = Hockey.Global.game.add.button(x, y, Hockey.Global.ATLAS_0, onClickFnc, onClickContext, TeamButton.BTN_FRAME_NAME_IDLE, TeamButton.BTN_FRAME_NAME_IDLE, TeamButton.BTN_FRAME_NAME_PRESSED, TeamButton.BTN_FRAME_NAME_IDLE, layer);
            this._button.anchor.set(0.5);
            this._button.name = id.toString();
            this._label = Hockey.Global.game.add.bitmapText(x, y + TeamButton.LABEL_OFFSET_Y, "fnt0", "", 25, layer);
            this._label.anchor.x = 0.5;
            this._label.text = Hockey.Play.TEAM_NAMES[id];
        }
        Object.defineProperty(TeamButton.prototype, "enable", {
            set: function (enable) {
                this._button.inputEnabled = enable;
            },
            enumerable: true,
            configurable: true
        });
        TeamButton.prototype.setAsSelected = function (selected) {
            var idleFrameName = (selected ? TeamButton.BTN_FRAME_NAME_PRESSED : TeamButton.BTN_FRAME_NAME_IDLE);
            this._button.setFrames(idleFrameName, idleFrameName, TeamButton.BTN_FRAME_NAME_PRESSED, idleFrameName);
        };
        TeamButton.BTN_FRAME_NAME_IDLE = "btnFlag0";
        TeamButton.BTN_FRAME_NAME_PRESSED = "btnFlag1";
        TeamButton.LABEL_OFFSET_Y = 60;
        return TeamButton;
    }());
    var TeamSelectWnd = (function (_super) {
        __extends(TeamSelectWnd, _super);
        function TeamSelectWnd() {
            _super.call(this);
            this._selectedTeamId = -1;
            this._btnTeam = [];
            this._content = new Phaser.Group(Hockey.Global.game);
            if (this._content.parent != null)
                this._content.parent.removeChild(this._content);
            this._title = Hockey.Global.game.add.image(TeamSelectWnd.WND_W >> 1, 12, Hockey.Global.ATLAS_0, "lblSelectTeam", this._content);
            this._title.anchor.x = 0.5;
            var btnIniX = ((TeamSelectWnd.WND_W - ((TeamSelectWnd.FLAG_BTN_W * 4) + (TeamSelectWnd.FLAG_BTNS_H_SPACING * 3))) >> 1) + (TeamSelectWnd.FLAG_BTN_W >> 1);
            var btnY = TeamSelectWnd.FLAG_BTNS_Y;
            for (var rowId = 0; rowId < 4; rowId++) {
                var btnX = btnIniX;
                for (var colId = 0; colId < 4; colId++) {
                    this._btnTeam.push(new TeamButton(btnX, btnY, colId + (rowId * 4), this._content, this.onTeamBtnClick, this));
                    btnX += (TeamSelectWnd.FLAG_BTN_W + TeamSelectWnd.FLAG_BTNS_H_SPACING);
                }
                btnY += (TeamSelectWnd.FLAG_BTN_H + TeamSelectWnd.FLAG_BTNS_V_SPACING);
            }
        }
        TeamSelectWnd.prototype.getWndWidth = function () {
            return TeamSelectWnd.WND_W;
        };
        TeamSelectWnd.prototype.getWndHeight = function () {
            return TeamSelectWnd.WND_H;
        };
        Object.defineProperty(TeamSelectWnd.prototype, "selectedTeamId", {
            get: function () { return this._selectedTeamId; },
            enumerable: true,
            configurable: true
        });
        TeamSelectWnd.prototype.show = function (wnd, contentLayer) {
            _super.prototype.show.call(this, wnd, contentLayer);
            contentLayer.add(this._content);
            if (this._selectedTeamId >= 0) {
                this._btnTeam[this._selectedTeamId].setAsSelected(false);
                this._selectedTeamId = -1;
            }
            this.enableTeamButtons(true);
        };
        TeamSelectWnd.prototype.onBtnOkClick = function () {
            this.enableTeamButtons(false);
        };
        TeamSelectWnd.prototype.onTeamBtnClick = function (button, pointer, isOver) {
            if (!isOver)
                return;
            this._wnd.enableBtnOK(true);
            if (this._selectedTeamId >= 0)
                this._btnTeam[this._selectedTeamId].setAsSelected(false);
            this._selectedTeamId = parseInt(button.name);
            this._btnTeam[this._selectedTeamId].setAsSelected(true);
        };
        TeamSelectWnd.prototype.enableTeamButtons = function (enable) {
            var teamId = this._btnTeam.length;
            while (teamId-- != 0)
                this._btnTeam[teamId].enable = enable;
        };
        TeamSelectWnd.WND_W = 600;
        TeamSelectWnd.WND_H = 800;
        TeamSelectWnd.FLAG_BTN_W = 97;
        TeamSelectWnd.FLAG_BTN_H = 97;
        TeamSelectWnd.FLAG_BTNS_Y = 136;
        TeamSelectWnd.FLAG_BTNS_H_SPACING = 20;
        TeamSelectWnd.FLAG_BTNS_V_SPACING = 58;
        return TeamSelectWnd;
    }(Hockey.WndContentBase));
    Hockey.TeamSelectWnd = TeamSelectWnd;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
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
            this.state.add("Boot", Hockey.Boot);
            this.state.add("Preload", Hockey.Preload);
            this.state.add("Play", Hockey.Play);
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
    Hockey.Game = Game;
})(Hockey || (Hockey = {}));
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
var Hockey;
(function (Hockey) {
    var Sounds = (function () {
        function Sounds() {
        }
        Sounds.AUDIO_JSON = {
            "resources": [
                "sfx.ogg",
                "sfx.mp3"
            ],
            "spritemap": {
                "end": {
                    "start": 0,
                    "end": 1.469342403628118,
                    "loop": false
                },
                "goal": {
                    "start": 3,
                    "end": 8,
                    "loop": false
                },
                "hit0": {
                    "start": 9,
                    "end": 10.090680272108843,
                    "loop": false
                },
                "hit1": {
                    "start": 12,
                    "end": 13.13374149659864,
                    "loop": false
                },
                "hit2": {
                    "start": 15,
                    "end": 16.96,
                    "loop": false
                },
                "shot1": {
                    "start": 18,
                    "end": 18.594263038548753,
                    "loop": false
                },
                "shot2": {
                    "start": 20,
                    "end": 20.858684807256235,
                    "loop": false
                },
                "start": {
                    "start": 22,
                    "end": 24.946666666666665,
                    "loop": false
                }
            }
        };
        return Sounds;
    }());
    Hockey.Sounds = Sounds;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
            this._gameMinDims = new Phaser.Point(Hockey.Global.GAME_MIN_WIDTH, Hockey.Global.GAME_MIN_HEIGHT);
            this._gameMaxDims = new Phaser.Point(Hockey.Global.GAME_MAX_WIDTH, Hockey.Global.GAME_MAX_HEIGHT);
            this._gameDims = new Phaser.Point();
            this._userScale = new Phaser.Point(0, 0);
        }
        Boot.prototype.init = function () {
            this.input.maxPointers = 1;
            this.game.renderer.renderSession.roundPixels = false;
            this.stage.disableVisibilityChange = true;
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setResizeCallback(this.gameResized, this);
            this.gameResized(this.scale, null);
            if (this.game.device.android && this.game.device.chrome && this.game.device.chromeVersion >= 55) {
                this.game.sound.touchLocked = true;
                this.game.input.touch.addTouchLockCallback(function () {
                    if (this.noAudio || !this.touchLocked || this._unlockSource != null) {
                        return true;
                    }
                    if (this.usingWebAudio) {
                        var buffer = this.context.createBuffer(1, 1, 22050);
                        this._unlockSource = this.context.createBufferSource();
                        this._unlockSource.buffer = buffer;
                        this._unlockSource.connect(this.context.destination);
                        if (this._unlockSource.start === undefined) {
                            this._unlockSource.noteOn(0);
                        }
                        else {
                            this._unlockSource.start(0);
                        }
                        if (this._unlockSource.context.state === 'suspended') {
                            this._unlockSource.context.resume();
                        }
                    }
                    return true;
                }, this.game.sound, true);
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
    Hockey.Boot = Boot;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    (function (ePlayState) {
        ePlayState[ePlayState["teamSelect"] = 0] = "teamSelect";
        ePlayState[ePlayState["tutorial"] = 1] = "tutorial";
        ePlayState[ePlayState["play"] = 2] = "play";
    })(Hockey.ePlayState || (Hockey.ePlayState = {}));
    var ePlayState = Hockey.ePlayState;
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            _super.call(this);
            this._background = null;
            this._keyDown = false;
            this._gameeWatermark = null;
            this._startGameeGame = false;
            Play._instance = this;
        }
        Object.defineProperty(Play, "instance", {
            get: function () { return Play._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "score", {
            get: function () { return this._score; },
            set: function (score) {
                if ((this._score < 1500 && score >= 1500) || (this._score < 4000 && score >= 4000))
                    Hockey.Field.instance.addDefender = true;
                this._score = score;
                if (Hockey.Global.GAMEE) {
                    Gamee.Gamee.instance.score = score;
                }
                else {
                    this._barScore.update();
                    if (Hockey.Global.FB_INSTANT_GAME)
                        FBInstantGame.FBInstantGame.instance.setScore(score);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "puckCnt", {
            get: function () { return this._puckCnt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "team1Id", {
            get: function () { return this._team1Id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "team2Id", {
            get: function () { return this._team2Id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "field", {
            get: function () { return this._field; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "goalFx", {
            get: function () { return this._goalFx; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "popupMsgPool", {
            get: function () { return this._popupMsgPool; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "vsMsg", {
            get: function () { return this._vsMsg; },
            enumerable: true,
            configurable: true
        });
        Play.prototype.create = function () {
            var game = this.game;
            if (Hockey.Global.FB_INSTANT_GAME) {
                this._restartSignal = new Phaser.Signal();
                this._restartSignal.add(this.reset, this);
            }
            if (Hockey.Global.GAMEE && Gamee.Gamee.instance.ready) {
                this._startGameeGame = true;
                this.input.onDown.addOnce(function () {
                    this.game.paused = false;
                    this._startGameeGame = false;
                    Gamee.Gamee.instance.gameStart();
                }, this);
            }
            this._background = game.add.image(0, 0, Hockey.Global.ATLAS_0, "background");
            if (!Hockey.Global.FB_INSTANT_GAME) {
                game.add.image(125, 318, Hockey.Global.ATLAS_0, "barrierLogoSkoda");
                game.add.image(477, 318, Hockey.Global.ATLAS_0, "barrierLogoSkoda");
            }
            else {
                this._gameeWatermark = game.add.image(Hockey.Global.GAME_MAX_WIDTH >> 1, 0, Hockey.Global.ATLAS_0, "gameeWatermark");
                this._gameeWatermark.anchor.set(0.5, 1);
            }
            this._wnd = new Hockey.Wnd();
            this._wnd.onOkClick.add(this.onWndBtnOkClick, this);
            this._team1Id = -1;
            this._team2Id = -1;
            this._teamSelWnd = new Hockey.TeamSelectWnd();
            this._tutorial = new Hockey.Tutorial();
            this._field = new Hockey.Field();
            this._slideMsg = new Hockey.SlideMsg();
            this._slideMsgType = new SlideMessage.SlideMsgType(-1, 1000, Phaser.Easing.Cubic.Out, 0, null, 1000, 1000, Phaser.Easing.Cubic.In, 0);
            this._vsMsg = new Hockey.VsMessage();
            this._goalFx = new Hockey.GoalFx();
            this._barPucks = new Hockey.BarPucks();
            this._barFirePuck = new Hockey.BarFirePuck();
            this._barPower = new Hockey.BarPower();
            if (!Hockey.Global.GAMEE)
                this._barScore = new Hockey.BarScore();
            this._popupMsgPool = new Utils.Pool(Hockey.PopupMsg, 2, true);
            this._popupMsgType = new PopupMessage.PopupMsgType(100, 1000, Phaser.Easing.Cubic.Out, 750, 500, Phaser.Easing.Cubic.In);
            this._puckIncMsg = new Hockey.PuckIncMsg();
            if (Hockey.Global.DEBUG != false) {
                this.debugText = this.game.add.text(10, 100, "", { font: "Courier", fontSize: 20, fill: "#FFFFFF" });
                this.debugText.lineSpacing = 2;
                this.debugText.setShadow(2, 2);
                this.debugText.fixedToCamera = true;
                this.time.advancedTiming = true;
            }
            this.onResize(this.game.width, this.game.height);
            this.reset();
        };
        Play.prototype.update = function () {
            Hockey.Global.elapsedTime = this.time.elapsedSince(this._timeBase);
            Hockey.Global.deltaRatio = this.time.elapsedMS / (1000 / 60);
            if (Hockey.Global.deltaRatio < 1)
                Hockey.Global.deltaRatio = 1;
            if (Hockey.Global.DEBUG) {
                this.debugText.text = "fps: " + this.time.fps + " | " + "delta: " + Hockey.Global.deltaRatio + "\n" + this._resInfo;
            }
            if (this._state == ePlayState.play) {
                this._field.update();
                if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
                    if (!this._keyDown) {
                        this._keyDown = true;
                        this._goalFx.show();
                    }
                }
                else {
                    this._keyDown = false;
                }
            }
        };
        Play.prototype.resumed = function () {
            this._timeBase += this.time.pauseDuration;
        };
        Play.prototype.gameOver = function () {
            Utils.AudioUtils.stopMusic();
            if (Hockey.Global.GAMEE == false || Gamee.Gamee.instance.ready == false) {
                if (Hockey.Global.FB_INSTANT_GAME) {
                    FBInstantGame.FBInstantGame.instance.takeScreenshot(this.game);
                    FBInstantGame.FBInstantGame.instance.endGame(this._restartSignal);
                    this.game.paused = true;
                }
                else {
                    this.reset();
                }
            }
            else {
                Gamee.Gamee.instance.gameOver();
                this.game.paused = true;
            }
        };
        Play.prototype.showPopupMessage = function (x, y, msgFrameName) {
            this._popupMsgPool.getItem().show(x, y, this._popupMsgType, msgFrameName);
        };
        Play.prototype.showSlideMessage = function (frameName, anchorY) {
            if (anchorY === void 0) { anchorY = 0.5; }
            this._slideMsg.show(this.camera.y + 190, this._slideMsgType, Hockey.Global.ATLAS_0, frameName, anchorY);
        };
        Play.prototype.decPuckCnt = function () {
            if (--this._puckCnt == 1) {
                this.showSlideMessage("lblLastPuck");
            }
            else if (this._puckCnt == 0) {
                Utils.AudioUtils.playSound("end");
                Hockey.Global.game.time.events.add(1500, function () {
                    this.gameOver();
                }, this);
            }
            this._barPucks.update();
        };
        Play.prototype.incPuckCnt = function (puckX, puckY, puckInc) {
            if (puckInc + this._puckCnt > Play.PUCK_MAX_CNT)
                puckInc = Play.PUCK_MAX_CNT - this._puckCnt;
            if (puckInc <= 0)
                return false;
            this._puckCnt += puckInc;
            this._puckIncMsg.show(puckX, puckY, puckInc);
            return true;
        };
        Play.prototype.reset = function () {
            this.game.tweens.removeAll();
            this.game.time.removeAll();
            this.game.paused = false;
            this._timeBase = this.time.elapsedSince(0);
            Hockey.Global.elapsedTime = 0;
            this._score = 0;
            this._puckCnt = Play.PUCK_MAX_CNT;
            this._barPucks.reset();
            this._barFirePuck.reset();
            this._barPower.update(0);
            if (!Hockey.Global.GAMEE)
                this._barScore.reset();
            this._slideMsg.reset();
            this._puckIncMsg.reset();
            this._vsMsg.reset();
            this._goalFx.reset();
            this._field.clearLayers();
            if (this._team1Id < 0) {
                this._wnd.show(this._teamSelWnd, false);
                this._state = ePlayState.teamSelect;
            }
            else {
                this._field.clearLayers();
                this.startGame(false);
            }
        };
        Play.prototype.startGame = function (flash) {
            if (flash === void 0) { flash = true; }
            this._timeBase = this.time.elapsedSince(0);
            Hockey.Global.elapsedTime = 0;
            this._field.start();
            if (flash)
                Hockey.Global.game.camera.flash(0xFFFFFF, 500);
            this._vsMsg.show(this._team1Id, this._team2Id);
            Utils.AudioUtils.playMusic("ambient", true);
            Utils.AudioUtils.playSound("start");
            this.game.time.events.add(2000, function () {
                this._field.throwPuck();
            }, this);
            this._state = ePlayState.play;
        };
        Play.prototype.onWndBtnOkClick = function () {
            var camera = Hockey.Global.game.camera;
            camera.resetFX();
            camera.onFadeComplete.addOnce(function () {
                this._wnd.hide();
                if (this._state == ePlayState.teamSelect) {
                    this.onTeamSelected();
                }
                else {
                    this.startGame();
                }
            }, this);
            camera.fade(0xFFFFFF, 500);
        };
        Play.prototype.onTeamSelected = function () {
            this._team1Id = this._teamSelWnd.selectedTeamId;
            this._team2Id = Hockey.Global.game.rnd.integerInRange(0, Play.TEAM_NAMES.length - 1);
            if (this._team2Id == this._team1Id) {
                if (++this._team2Id == Play.TEAM_NAMES.length)
                    this._team2Id = 0;
            }
            this._field.player.teamId = this._team1Id;
            this._field.keeper.teamId = this._team2Id;
            this._field.defender1.teamId = this._team2Id;
            this._field.defender2.teamId = this._team2Id;
            this._wnd.show(this._tutorial, true);
            this._state = ePlayState.tutorial;
            Hockey.Global.game.camera.flash(0xFFFFFF, 500);
        };
        Play.prototype.onResize = function (newGameW, newGameH) {
            this.world.setBounds(0, 0, Hockey.Global.GAME_MAX_WIDTH, Hockey.Global.GAME_MAX_HEIGHT);
            this.camera.setPosition(Math.round((Hockey.Global.GAME_MAX_WIDTH - newGameW) / 2), 0);
            this._barPucks.reposition();
            this._barFirePuck.reposition();
            this._barPower.reposition();
            if (Hockey.Global.FB_INSTANT_GAME)
                this._gameeWatermark.y = newGameH - Play.GAMEE_WATERMARK_OFFSET;
            if (!Hockey.Global.GAMEE)
                this._barScore.reposition();
            if (this._wnd.visible)
                this._wnd.reposition();
            this._resInfo = "Internal res: " + this.camera.width + "x" + this.camera.height + "\n";
            this._resInfo = this._resInfo.concat("Output res: " + this.scale.width + "x" + this.scale.height + "\n");
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
        Play.TEAM_NAMES = ["RUS", "USA", "SWE", "SVK", "GER", "LAT", "DEN", "AUT", "CAN", "FIN", "CZE", "SUI", "BLR", "NOR", "FRA", "KOR"];
        Play.GAMEE_WATERMARK_OFFSET = 20;
        Play.PUCK_MAX_CNT = 7;
        return Play;
    }(Phaser.State));
    Hockey.Play = Play;
})(Hockey || (Hockey = {}));
var Hockey;
(function (Hockey) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            _super.apply(this, arguments);
            this._ready = false;
        }
        Preload.prototype.preload = function () {
            this.load.baseURL = "assets/";
            this.load.atlasJSONArray(Hockey.Global.ATLAS_0);
            this.load.atlasJSONArray(Hockey.Global.ATLAS_KEEPER);
            this.load.atlasJSONArray(Hockey.Global.ATLAS_DEFENDER);
            this.load.atlasJSONArray(Hockey.Global.ATLAS_SHOOTER);
            this.load.bitmapFont("fnt0");
            this.load.bitmapFont("fnt1");
            this.load.bitmapFont("fnt2");
            this.load.json("animKeeper");
            this.load.json("animDefender");
            this.load.json("animShooter");
            this.load.json("animHitFx");
            {
                var soundshift = 0;
                if (this.game.device.iOS)
                    soundshift = 0.1;
                var sfxId = 0;
                for (var property in Hockey.Sounds.AUDIO_JSON.spritemap) {
                    var audioSprite = Hockey.Sounds.AUDIO_JSON.spritemap[property];
                    if (sfxId++ != 0)
                        audioSprite.start -= soundshift;
                }
                this.load.audiosprite("sfx", Hockey.Sounds.AUDIO_JSON.resources, null, Hockey.Sounds.AUDIO_JSON);
            }
            this.load.audio("ambient", ["ambient.ogg", "ambient.mp3"]);
        };
        Preload.prototype.loadUpdate = function () {
            if (Hockey.Global.FB_INSTANT_GAME) {
                FBInstantGame.FBInstantGame.instance.setLoadingProgress(this.load.progress);
            }
        };
        Preload.prototype.create = function () {
            {
                var audioSprite = this.add.audioSprite("sfx");
                for (var property in Hockey.Sounds.AUDIO_JSON.spritemap) {
                    audioSprite.sounds[property].allowMultiple = true;
                }
                Utils.AudioUtils.setSfxAudioSprite(audioSprite);
                Utils.AudioUtils.addMusic("ambient", this.add.audio("ambient"));
            }
            if (Hockey.Global.FB_INSTANT_GAME) {
                this._startSignal = new Phaser.Signal();
                this._startSignal.add(this.startGame, this);
            }
        };
        Preload.prototype.update = function () {
            if (this._ready == false) {
                this._ready = true;
                if (Hockey.Global.FB_INSTANT_GAME) {
                    FBInstantGame.FBInstantGame.instance.startGame(this._startSignal);
                }
                else {
                    this.startGame();
                }
            }
        };
        Preload.prototype.startGame = function () {
            this.game.state.start("Play");
        };
        return Preload;
    }(Phaser.State));
    Hockey.Preload = Preload;
})(Hockey || (Hockey = {}));

