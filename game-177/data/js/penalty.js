var Penalty;
(function (Penalty) {
    var eMobileOS;
    (function (eMobileOS) {
        eMobileOS[eMobileOS["Android"] = 0] = "Android";
        eMobileOS[eMobileOS["iOS"] = 1] = "iOS";
        eMobileOS[eMobileOS["WindowsPhone"] = 2] = "WindowsPhone";
    })(eMobileOS = Penalty.eMobileOS || (Penalty.eMobileOS = {}));
    var Global = (function () {
        function Global() {
        }
        Global.init = function (game) {
            Global.game = game;
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
        Global.GAME_WIDTH = 640;
        Global.GAME_HEIGHT = 1280;
        Global.GAME_MIN_WIDTH = 640;
        Global.GAME_MIN_HEIGHT = 800;
        Global.FPS = 60;
        Global.GAMEE = true;
        Global.DEBUG = false;
        Global.elapsedTime = 0;
        Global.deltaRatio = 1;
        return Global;
    }());
    Penalty.Global = Global;
    window.onload = function () {
        Global.init(new Penalty.Game());
    };
})(Penalty || (Penalty = {}));
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
            this._container = Penalty.Global.game.add.group(parent);
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
            return Penalty.Global.game.add.image(0, 0, states[0].texture, states[0].frame, container);
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
var Penalty;
(function (Penalty) {
    var RemAttempts = (function () {
        function RemAttempts() {
            this._icons = [];
            this._layer = Penalty.Global.game.add.group();
            this._iconSize = new Phaser.Point(59, 56);
            var i = RemAttempts._ATTEMPT_CNT;
            var x = Math.round(this._iconSize.x / 2);
            var y = Math.round(this._iconSize.y / 2);
            while (i-- != 0) {
                Penalty.Global.game.add.image(x, y, "atlas0", "attemptFrame", this._layer).anchor.set(0.5);
                var icon = Penalty.Global.game.add.image(x, y, "atlas0", "attemptIcon", this._layer);
                icon.anchor.set(0.5);
                this._icons.push(icon);
                x += RemAttempts._SPACING;
            }
            this.resize();
        }
        Object.defineProperty(RemAttempts.prototype, "remAttampts", {
            get: function () {
                return this._remAttempts;
            },
            enumerable: true,
            configurable: true
        });
        RemAttempts.prototype.reset = function () {
            this._remAttempts = RemAttempts._ATTEMPT_CNT;
            this.showIcons();
        };
        RemAttempts.prototype.resize = function () {
            var camera = Penalty.Global.game.camera;
            var layer = this._layer;
            layer.position.set(camera.x + camera.width - layer.width - 10, camera.y + 20);
        };
        RemAttempts.prototype.attemptLost = function () {
            var attemptId = --this._remAttempts;
            var icon = this._icons[attemptId];
            Penalty.Global.game.tweens.create(icon).to({ y: icon.y - 30, alpha: 0 }, 750, Phaser.Easing.Cubic.Out, true);
            return (this._remAttempts != 0);
        };
        RemAttempts.prototype.addAttempts = function (number) {
            this._remAttempts += number;
            if (this._remAttempts > RemAttempts._ATTEMPT_CNT)
                this._remAttempts = RemAttempts._ATTEMPT_CNT;
            this.showIcons();
        };
        RemAttempts.prototype.showIcons = function () {
            var i = this._remAttempts;
            while (i-- != 0) {
                var icon = this._icons[i];
                icon.exists = true;
                icon.scale.set(1);
                icon.alpha = 1;
                icon.y = Math.round(this._iconSize.y / 2);
            }
        };
        RemAttempts._ATTEMPT_CNT = 3;
        RemAttempts._X = 500;
        RemAttempts._Y = 100;
        RemAttempts._SPACING = 66;
        return RemAttempts;
    }());
    Penalty.RemAttempts = RemAttempts;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var eBallState;
    (function (eBallState) {
        eBallState[eBallState["waitForKickOff"] = 0] = "waitForKickOff";
        eBallState[eBallState["kickOffUp"] = 1] = "kickOffUp";
        eBallState[eBallState["kickOffDown"] = 2] = "kickOffDown";
        eBallState[eBallState["bounce"] = 3] = "bounce";
        eBallState[eBallState["inactive"] = 4] = "inactive";
    })(eBallState || (eBallState = {}));
    var Ball = (function () {
        function Ball(playState) {
            this._pos = new Phaser.Point;
            this._bounceStartPos = new Phaser.Point();
            this._stateProcessFnc = [];
            this._playState = playState;
            this._ballShadow = new Phaser.Image(Penalty.Global.game, 0, 0, "atlas0", "ballShadow");
            this._ballShadow.anchor.set(0.42, 0.5);
            this._ball = new Phaser.Image(Penalty.Global.game, 0, 0, "atlas0", "ball");
            this._ball.anchor.set(0.5);
            var frames = [];
            for (var i = 0; i <= 15; i++) {
                frames.push("fire_" + i);
            }
            this._fireFx = Penalty.Global.game.make.image(0, 0, "atlas0", "fire_0");
            this._fireFx.anchor.set(0.5);
            this._fireFx.animations.add("default", frames, 15, true, false);
            this._fireFx.animations.play("default");
            this._ball.addChild(this._fireFx);
            this._stateProcessFnc[eBallState.waitForKickOff] = null;
            this._stateProcessFnc[eBallState.kickOffUp] = this.processKickOff;
            this._stateProcessFnc[eBallState.kickOffDown] = this.processKickOff;
            this._stateProcessFnc[eBallState.bounce] = this.processBounce;
            this._stateProcessFnc[eBallState.inactive] = null;
        }
        Ball.prototype.addToWorld = function () {
            this._group = Penalty.Global.game.add.group();
            this._group.add(this._ballShadow);
            this._group.add(this._ball);
        };
        Ball.prototype.reset = function (fire) {
            this._state = eBallState.waitForKickOff;
            this._targetHit = false;
            this._pos.copyFrom(Ball.startPos);
            this._height = 0;
            this._fireFx.visible = false;
            this.updatePosition();
        };
        Ball.prototype.process = function () {
            if (this._state == eBallState.inactive)
                return false;
            var res = true;
            var fnc = this._stateProcessFnc[this._state];
            if (fnc != null) {
                if (!(res = fnc.call(this)))
                    this._state = eBallState.inactive;
                this.updatePosition();
                if (this._targetHit) {
                    this._targetHit = false;
                    this._playState.onTargetHit(this._ball.position);
                }
            }
            return res;
        };
        Ball.prototype.processKickOff = function () {
            var kickOffSet = this._playState.kickOffSet;
            var roundComplete = false;
            var ballLost = false;
            var distance = (this._pathDistance += (Ball.KICKOFF_SPEED * Penalty.Global.deltaRatio));
            if (this._state == eBallState.kickOffUp) {
                if (distance >= kickOffSet.pathTopDis || (kickOffSet.pathBounceDis != 0 && distance >= kickOffSet.pathBounceDis)) {
                    if (kickOffSet.result == Penalty.eKickOffResult.goal) {
                        this._targetHit = true;
                    }
                    else {
                        ballLost = true;
                        if (kickOffSet.result == Penalty.eKickOffResult.bar)
                            Utils.AudioUtils.playSound("bar");
                    }
                    if (kickOffSet.pathBounceDis != 0 && distance >= kickOffSet.pathBounceDis) {
                        this._pathDistance = kickOffSet.pathBounceDis;
                    }
                    else {
                        this._pathDistance = kickOffSet.pathTopDis;
                    }
                    distance = this._pathDistance;
                    this._state = eBallState.kickOffDown;
                }
            }
            if (this._state == eBallState.kickOffDown && (kickOffSet.pathBounceDis != 0 && distance >= kickOffSet.pathBounceDis)) {
                this._pathDistance = (distance = kickOffSet.pathBounceDis);
                if (kickOffSet.result != Penalty.eKickOffResult.miss) {
                    this._state = eBallState.bounce;
                }
                else {
                    roundComplete = true;
                    this._state = eBallState.inactive;
                }
            }
            var ballPos = this._pos;
            ballPos.set(Ball.startPos.x + Math.cos(-kickOffSet.pathAngle) * distance, Ball.startPos.y - Math.sin(-kickOffSet.pathAngle) * distance);
            var ballScale = Ball.getBallScale(this._pos.y);
            if (this._state == eBallState.kickOffUp) {
                this._height = Phaser.Easing.Cubic.Out(distance / kickOffSet.pathTopDis) * (kickOffSet.pathTopHeight - (Ball.getBallScale(Penalty.Goal.INNER_BY1) * Ball.RADIUS));
            }
            else if (this._state == eBallState.kickOffDown && this._height != 0) {
                this._heightChange = Ball.GRAVITY * Penalty.Global.deltaRatio;
                if ((this._height -= (this._heightChange * ballScale)) <= 0) {
                    this._height = 0;
                    this._heightChange = 0;
                }
            }
            if (this._state == eBallState.bounce) {
                this._heightChange += kickOffSet.bounceHeightVel;
                this._bounceStartPos.copyFrom(this._pos);
                this._bounceStartTime = Penalty.Global.elapsedTime;
                roundComplete = true;
            }
            if (ballLost) {
                if (this._playState.roundId != 0)
                    this._playState.remAttempts.attemptLost();
                Utils.AudioUtils.playSound("boo");
            }
            if (roundComplete) {
                var nextRoundDelay = 800;
                if (this._playState.remAttempts.remAttampts == 0) {
                    if (this._state == eBallState.bounce)
                        nextRoundDelay = kickOffSet.bounceTime;
                }
                Penalty.Global.game.time.events.add(nextRoundDelay, function () {
                    this._playState.onRoundCompleted();
                }, this);
            }
            return true;
        };
        Ball.prototype.processBounce = function () {
            var kickOffSet = this._playState.kickOffSet;
            var ballScale = Ball.getBallScale(this._pos.y);
            if (this._height != 0 || this._heightChange != 0) {
                this._heightChange += (Ball.GRAVITY * Penalty.Global.deltaRatio);
                if ((this._height -= (this._heightChange * ballScale)) <= 0) {
                    this._height = 0;
                    if ((this._heightChange *= -0.6) > -1) {
                        this._heightChange = 0;
                    }
                }
            }
            var pathProgress = (Penalty.Global.elapsedTime - this._bounceStartTime) / kickOffSet.bounceTime;
            if (pathProgress > 1)
                pathProgress = 1;
            var pathDistance = Phaser.Easing.Quadratic.Out(pathProgress) * kickOffSet.bounceDis;
            this._pos.set(this._bounceStartPos.x + (Math.cos(-kickOffSet.bounceAngle) * pathDistance), this._bounceStartPos.y - (Math.sin(-kickOffSet.bounceAngle) * pathDistance));
            return true;
        };
        Ball.prototype.kickOff = function () {
            var kickOffSet = this._playState.kickOffSet;
            this._pathDistance = 0;
            this._heightChange = 0;
            this._state = eBallState.kickOffUp;
            this._targetHit = false;
        };
        Ball.prototype.updatePosition = function () {
            var scale = Ball.getBallScale(this._pos.y);
            var radius = scale * Ball.RADIUS;
            this._ball.scale.set(scale);
            this._ball.position.set(this._pos.x, this._pos.y - this._height - radius);
            if (this._pos.y < Penalty.Goal.INNER_BY1 && this._ball.position.y - radius < Penalty.Goal.TBAR_Y + Penalty.Goal.BAR_RADIUS) {
                this._ball.position.y = Penalty.Goal.TBAR_Y + Penalty.Goal.BAR_RADIUS + radius;
                this._height = this._pos.y - (this._ball.position.y + radius);
            }
            if (this._pos.y < Penalty.Keeper.START_Y) {
                var targets = this._playState.targets;
                while (this._group.z > targets.actTargetsGroup.z)
                    Penalty.Global.game.world.moveDown(this._group);
            }
            else {
                var keeper = this._playState.keeper;
                while (this._group.z < keeper.group.z)
                    Penalty.Global.game.world.moveUp(this._group);
            }
            scale -= (scale * (this._height / Ball.SHADOW_MAX_HEIGHT));
            if (scale < 0)
                scale = 0;
            this._ballShadow.scale.set(scale);
            this._ballShadow.position.copyFrom(this._pos);
        };
        Ball.getBallScale = function (y) {
            return 1 - (((Ball.startPos.y - y) / (Ball.startPos.y - Penalty.Goal.INNER_BY1)) * (1 - Ball.GOAL_SCALE));
        };
        Ball.KICKOFF_SPEED = 16;
        Ball.GRAVITY = 0.5;
        Ball.GOAL_SCALE = 0.5;
        Ball.RADIUS = 26;
        Ball.SHADOW_MAX_HEIGHT = 260;
        Ball.startPos = new Phaser.Point(320, 1107);
        return Ball;
    }());
    Penalty.Ball = Ball;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var FlashEffects = (function () {
        function FlashEffects() {
        }
        FlashEffects.prototype.addToWorld = function () {
            var group = Penalty.Global.game.add.group();
            var animFrames = Phaser.Animation.generateFrameNames("flash_", 0, 3);
            var i = FlashEffects.FX_MAX_CNT;
            while (i-- != 0) {
                var fx = group.create(0, 0, "atlas0", "flash_0", false);
                fx.animations.add("def", animFrames, 10, false, false);
                fx.anchor.set(0.5);
            }
            this._fxSpriteGroup = group;
        };
        FlashEffects.prototype.reset = function () {
            this._nextFxDelay = this._fxInterval = FlashEffects.FX_MAX_INTERVAL;
            this._fxSpriteGroup.setAllChildren("exists", false, true, true, 0);
        };
        FlashEffects.prototype.process = function () {
            if ((this._nextFxDelay -= Penalty.Global.deltaRatio) <= 0) {
                this._nextFxDelay = this._fxInterval;
                this.showFx();
            }
        };
        FlashEffects.prototype.showFx = function () {
            var fx = this._fxSpriteGroup.getFirstExists(false, false, FlashEffects.FX_AREA.randomX, FlashEffects.FX_AREA.randomY);
            if (fx != null) {
                var anim = fx.animations.play("def");
                anim.onComplete.addOnce(function (sprite) {
                    sprite.exists = false;
                }, this);
                fx.scale.set(1 - ((FlashEffects.FX_AREA.bottom - fx.y) / (FlashEffects.FX_AREA.bottom - FlashEffects.FX_AREA.top)) * 0.5);
            }
        };
        FlashEffects.FX_AREA = new Phaser.Rectangle(0, 240, Penalty.Global.GAME_WIDTH, 120);
        FlashEffects.FX_MAX_CNT = 4;
        FlashEffects.FX_MIN_INTERVAL = 5;
        FlashEffects.FX_MAX_INTERVAL = 25;
        return FlashEffects;
    }());
    Penalty.FlashEffects = FlashEffects;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var Goal = (function () {
        function Goal() {
        }
        Goal.INNER_LX1 = 60;
        Goal.INNER_RX1 = 578;
        Goal.INNER_TY1 = 461;
        Goal.INNER_BY1 = 692;
        Goal.INNER_LX2 = 104;
        Goal.INNER_RX2 = 606;
        Goal.INNER_BY2 = 662;
        Goal.LBAR_X = 53;
        Goal.RBAR_X = 586;
        Goal.TBAR_Y = 456;
        Goal.BAR_RADIUS = 7;
        Goal.innerLLine = new Phaser.Line(Goal.INNER_LX1, Goal.INNER_BY1, Goal.INNER_LX2, Goal.INNER_BY2);
        Goal.innerBLine = new Phaser.Line(Goal.INNER_LX2, Goal.INNER_BY2, Goal.INNER_RX2, Goal.INNER_BY2);
        Goal.innerRLine = new Phaser.Line(Goal.INNER_RX1, Goal.INNER_BY1, Goal.INNER_RX2, Goal.INNER_BY2);
        return Goal;
    }());
    Penalty.Goal = Goal;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var KeeperCatchProcBase = (function () {
        function KeeperCatchProcBase(playState) {
            this._playState = playState;
        }
        KeeperCatchProcBase.prototype.directMoveX = function (ballCatchDelay) {
            var kickOffSet = this._playState.kickOffSet;
            var moveDis = kickOffSet.keeperPos.x - Penalty.Keeper.START_X;
            var delay;
            if (Math.abs(moveDis) > 2) {
                var moveTime = (Math.abs(moveDis) / KeeperCatchProcBase._DIRECT_HMOVE_SPEED) * (1000 / Penalty.Global.FPS);
                var delay_1 = Math.max(0, ballCatchDelay - moveTime);
                var pos = Penalty.Keeper.START_X + moveDis;
                var keeper = this._playState.keeper;
                Penalty.Global.game.add.tween(keeper.sprite).to({ x: pos }, moveTime, Phaser.Easing.Sinusoidal.Out, true, delay_1);
                Penalty.Global.game.add.tween(keeper.shadow).to({ x: pos }, moveTime, Phaser.Easing.Sinusoidal.Out, true, delay_1);
            }
        };
        KeeperCatchProcBase._GRAVITY = 0.5;
        KeeperCatchProcBase._DIRECT_HMOVE_SPEED = 4;
        return KeeperCatchProcBase;
    }());
    Penalty.KeeperCatchProcBase = KeeperCatchProcBase;
})(Penalty || (Penalty = {}));
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
var Penalty;
(function (Penalty) {
    var eSideJumpState;
    (function (eSideJumpState) {
        eSideJumpState[eSideJumpState["waitForJump"] = 0] = "waitForJump";
        eSideJumpState[eSideJumpState["jump"] = 1] = "jump";
        eSideJumpState[eSideJumpState["completed"] = 2] = "completed";
    })(eSideJumpState || (eSideJumpState = {}));
    var KeeperSideJump = (function (_super) {
        __extends(KeeperSideJump, _super);
        function KeeperSideJump(playState) {
            var _this = _super.call(this, playState) || this;
            _this._startPos = new Phaser.Point();
            _this._ballPos = new Phaser.Point();
            _this._topPos = new Phaser.Point();
            _this._lineFromStartPos = new Phaser.Line();
            _this._lineFromBallPos = new Phaser.Line();
            return _this;
        }
        KeeperSideJump.prototype.calculateJump = function (ballCatchDelay) {
            var kickOffSet = this._playState.kickOffSet;
            var dir = this._dir;
            var fallCatch = false;
            var offsetX;
            var offsetY;
            var groundHMoveMaxDis;
            if (this._animVer == 0) {
                offsetX = KeeperSideJump._JUMP1_ANCHOR_OFFSET_X;
                offsetY = KeeperSideJump._JUMP1_ANCHOR_OFFSET_Y;
                groundHMoveMaxDis = KeeperSideJump._JUMP1_MAX_HDISTANCE;
                this._startAngle = KeeperSideJump._JUMP1_START_ANGLE;
            }
            else {
                offsetX = KeeperSideJump._JUMP1_ANCHOR_OFFSET_X;
                offsetY = KeeperSideJump._JUMP1_ANCHOR_OFFSET_Y;
                groundHMoveMaxDis = KeeperSideJump._JUMP2_MAX_HDISTANCE;
                this._startAngle = KeeperSideJump._JUMP2_START_ANGLE;
            }
            if (dir < 0)
                this._startAngle = 180 - this._startAngle;
            this._startPos.set(Penalty.Keeper.START_X + ((offsetX + this._startPosOffsetX) * dir), Penalty.Keeper.START_Y + offsetY);
            var jumpAngle = this._startPos.angle(this._ballPos, false) * -1;
            this._jumpAngle = Phaser.Math.radToDeg(jumpAngle);
            var jumpDis;
            if (this._animVer == 0 && ((dir > 0 && this._jumpAngle > this._startAngle) || (dir < 0 && this._jumpAngle < this._startAngle))) {
                this._animVer = 1;
                return 1;
            }
            else if ((dir > 0 && this._jumpAngle < KeeperSideJump._JUMP_MIN_ANGLE) || (dir < 0 && (this._jumpAngle > 180 - KeeperSideJump._JUMP_MIN_ANGLE || this._jumpAngle < 0))) {
                fallCatch = true;
                if (!this.calculateFallCatch())
                    return -1;
                jumpDis = this._startPos.distance(this._topPos);
            }
            else {
                jumpDis = this._startPos.distance(this._ballPos) - KeeperSideJump._CATCH_POINT_OFFSET;
                if (jumpDis < KeeperSideJump._JUMP_MIN_DISTANCE)
                    jumpDis = KeeperSideJump._JUMP_MIN_DISTANCE;
                this._topPos.x = this._startPos.x + (Math.cos(jumpAngle) * jumpDis);
                this._topPos.y = this._startPos.y - (Math.sin(jumpAngle) * jumpDis);
            }
            if (!fallCatch && this._startPosOffsetX == 0) {
                var groundHMoveDis = Math.abs(this._topPos.x - this._startPos.x) - groundHMoveMaxDis;
                if (groundHMoveDis > Penalty.KeeperCatchProcBase._DIRECT_HMOVE_SPEED * 2) {
                    this._startPosOffsetX = groundHMoveDis;
                    return 1;
                }
            }
            this._jumpTime = ((jumpDis / 10) / Penalty.Global.FPS) * 1000;
            this._fallTime = Math.max(250, Math.min(2, (Penalty.Keeper.START_Y - this._topPos.y) / (this._startPos.y - this._topPos.y)) * this._jumpTime);
            var animDelay = ballCatchDelay - this._jumpTime - KeeperSideJump._ANIM_BOUNCE_DELAY;
            if (fallCatch) {
                animDelay -= ((this._topPos.distance(this._ballPos) / jumpDis) * this._jumpTime) + 100;
            }
            if (this._startPosOffsetX != 0) {
                var groundHMoveTime = (this._startPosOffsetX / Penalty.KeeperCatchProcBase._DIRECT_HMOVE_SPEED) / Penalty.Global.FPS * 1000;
                Penalty.Global.game.add.tween(this._playState.keeper.sprite).to({
                    x: Penalty.Keeper.START_X + (this._startPosOffsetX * dir)
                }, groundHMoveTime, null, true, Math.max(0, animDelay - groundHMoveTime)).onComplete.addOnce(function () { this.startJumpAnim(); }, this);
            }
            else if (animDelay > 0) {
                Penalty.Global.game.time.events.add(animDelay, this.startJumpAnim, this);
            }
            else {
                this.startJumpAnim();
            }
            return 0;
        };
        KeeperSideJump.prototype.calculateFallCatch = function () {
            var angleFromBallPos;
            var angleFromStartPos;
            if (this._dir > 0) {
                angleFromBallPos = 180 - KeeperSideJump._JUMP_MIN_ANGLE * 2;
                angleFromStartPos = KeeperSideJump._JUMP_MIN_ANGLE * 2;
            }
            else {
                angleFromBallPos = KeeperSideJump._JUMP_MIN_ANGLE * 2;
                angleFromStartPos = 180 - KeeperSideJump._JUMP_MIN_ANGLE * 2;
            }
            this._lineFromStartPos.fromAngle(this._startPos.x, this._startPos.y, Phaser.Math.degToRad(-angleFromStartPos), Penalty.Global.GAME_WIDTH);
            this._lineFromBallPos.fromAngle(this._ballPos.x - (KeeperSideJump._CATCH_POINT_OFFSET * this._dir), this._ballPos.y, Phaser.Math.degToRad(-angleFromBallPos), Penalty.Global.GAME_WIDTH);
            var attempts = 3;
            while (this._lineFromBallPos.intersects(this._lineFromStartPos, true, this._topPos) == null) {
                if (--attempts == 0)
                    return false;
                this._lineFromBallPos.start.x += ((KeeperSideJump._CATCH_POINT_OFFSET * this._dir) / (attempts - 1));
            }
            this._ballPos.x = this._lineFromBallPos.start.x;
            this._jumpAngle = angleFromStartPos;
            return true;
        };
        KeeperSideJump.prototype.start = function (ballCatchDelay) {
            var kickOffSet = this._playState.kickOffSet;
            this._dir = (kickOffSet.keeperPos.x < Penalty.Keeper.START_X ? -1 : 1);
            this._ballPos.copyFrom(kickOffSet.keeperPos);
            this._animVer = 0;
            this._startPosOffsetX = 0;
            this._anchorOffsetX = 0;
            var res = 1;
            while (res == 1) {
                if ((res = this.calculateJump(ballCatchDelay)) < 0)
                    return false;
            }
            this._state = eSideJumpState.waitForJump;
            return true;
        };
        KeeperSideJump.prototype.updateRotateToZeroMask = function (mask) {
            this._rotateToZeroMask &= ~mask;
            if (this._rotateToZeroMask == 0) {
                this._rotateToZeroStartTime = Penalty.Global.elapsedTime;
                var delay = (this._fallTime - (Penalty.Global.elapsedTime - this._jumpStartTime - this._jumpTime)) - KeeperSideJump._ANIM_FALL_LEN;
                if (delay > 1) {
                    Penalty.Global.game.time.events.add(delay, this.startFallAnim, this);
                }
                else {
                    this.startFallAnim();
                }
            }
        };
        KeeperSideJump.prototype.startJumpAnim = function () {
            var sprite = this._playState.keeper.sprite;
            sprite.onEvent.addOnce(function () {
                this._state = eSideJumpState.jump;
                this._jumpStartTime = Penalty.Global.elapsedTime;
                this._rotateToZeroMask = 3;
                var game = Penalty.Global.game;
                var keeper = this._playState.keeper;
                game.add.tween(keeper.sprite).to({ angle: (this._startAngle - this._jumpAngle) }, this._jumpTime, Phaser.Easing.Sinusoidal.Out, true).onComplete.addOnce(function () {
                    this.updateRotateToZeroMask(1);
                }, this);
                var jumpHDis = this._topPos.x - this._startPos.x;
                game.add.tween(keeper.sprite).to({
                    x: this._startPos.x + jumpHDis + (jumpHDis * (this._fallTime / this._jumpTime))
                }, this._jumpTime + this._fallTime, null, true);
                game.add.tween(keeper.sprite).to({ y: this._topPos.y }, this._jumpTime, Phaser.Easing.Sinusoidal.Out, true).chain(game.add.tween(keeper.sprite).to({ y: Penalty.Keeper.START_Y }, this._fallTime, Phaser.Easing.Sinusoidal.In));
                game.time.events.add(this._jumpTime, function () {
                    this.updateRotateToZeroMask(2);
                }, this);
            }, this);
            var anchorX;
            var anchorY;
            if (this._animVer == 0) {
                anchorX = KeeperSideJump._JUMP1_ANCHOR_OFFSET_X;
                anchorY = KeeperSideJump._JUMP1_ANCHOR_OFFSET_Y;
            }
            else {
                anchorX = KeeperSideJump._JUMP2_ANCHOR_OFFSET_X;
                anchorY = KeeperSideJump._JUMP2_ANCHOR_OFFSET_Y;
            }
            sprite.x += (this._anchorOffsetX = anchorX * this._dir);
            sprite.y += anchorY;
            sprite.playAnimationByName("jump" + (this._dir < 0 ? "Left" : "Right") + this._animVer.toString());
        };
        KeeperSideJump.prototype.startFallAnim = function () {
            this._startAngle = 0;
            if (this._dir < 0)
                this._startAngle = 180 - this._startAngle;
            var keeper = this._playState.keeper.sprite;
            keeper.playAnimationByName("fall" + (this._dir < 0 ? "Left" : "Right") + this._animVer.toString());
            keeper.angle = this._startAngle - this._jumpAngle;
            keeper.onFinish.addOnce(function () {
                this._state = eSideJumpState.completed;
            }, this);
        };
        KeeperSideJump.prototype.process = function () {
            if (this._state == eSideJumpState.completed)
                return false;
            var keeper = this._playState.keeper;
            if (this._state != eSideJumpState.waitForJump) {
                var shadowScale = 1 - ((this._startPos.y - keeper.sprite.y) / 150);
                if (shadowScale > 1)
                    shadowScale = 1;
                keeper.shadow.scale.set(shadowScale);
                if (this._rotateToZeroMask == 0) {
                    var progress = (Penalty.Global.elapsedTime - this._rotateToZeroStartTime) / (this._jumpStartTime + this._jumpTime + this._fallTime - this._rotateToZeroStartTime);
                    if (progress > 1)
                        progress = 1;
                    var startAngle = this._startAngle - this._jumpAngle;
                    var targetAngle = this._startAngle;
                    if (this._dir < 0)
                        targetAngle -= 180;
                    var curAngle = startAngle + progress * (targetAngle - startAngle);
                    keeper.sprite.angle = curAngle;
                }
            }
            keeper.shadow.x = keeper.sprite.x - this._anchorOffsetX;
            return true;
        };
        KeeperSideJump._ANIM_BOUNCE_DELAY = 350;
        KeeperSideJump._ANIM_FALL_LEN = 100;
        KeeperSideJump._JUMP_MIN_ANGLE = 15;
        KeeperSideJump._JUMP_MAX_ANGLE = 70;
        KeeperSideJump._JUMP_MIN_DISTANCE = 10;
        KeeperSideJump._JUMP1_ANCHOR_OFFSET_X = 49.5;
        KeeperSideJump._JUMP1_ANCHOR_OFFSET_Y = -48.5;
        KeeperSideJump._JUMP1_START_ANGLE = 55.973;
        KeeperSideJump._JUMP1_MAX_HDISTANCE = 50;
        KeeperSideJump._JUMP2_ANCHOR_OFFSET_X = 49.5;
        KeeperSideJump._JUMP2_ANCHOR_OFFSET_Y = -48.5;
        KeeperSideJump._JUMP2_START_ANGLE = 71.857;
        KeeperSideJump._JUMP2_MAX_HDISTANCE = 80;
        KeeperSideJump._CATCH_POINT_OFFSET = 50;
        return KeeperSideJump;
    }(Penalty.KeeperCatchProcBase));
    Penalty.KeeperSideJump = KeeperSideJump;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var KeeperOnSpot = (function (_super) {
        __extends(KeeperOnSpot, _super);
        function KeeperOnSpot(playState) {
            return _super.call(this, playState) || this;
        }
        KeeperOnSpot.prototype.start = function (ballCatchDelay) {
            this.directMoveX(ballCatchDelay);
            var delay = ballCatchDelay - KeeperOnSpot._CATCH_ANIM_LEN;
            if (delay > 0) {
                Penalty.Global.game.time.events.add(delay, function () {
                    this.startAnim();
                }, this);
            }
            else {
                this.startAnim();
            }
            this._completed = false;
            return true;
        };
        KeeperOnSpot.prototype.process = function () {
            return !this._completed;
        };
        KeeperOnSpot.prototype.startAnim = function () {
            var sprite = this._playState.keeper.sprite;
            sprite.onFinish.addOnce(function () {
                this._completed = true;
            }, this);
            this._playState.keeper.sprite.playAnimationByName("onSpot");
        };
        KeeperOnSpot._CATCH_ANIM_LEN = 136;
        return KeeperOnSpot;
    }(Penalty.KeeperCatchProcBase));
    Penalty.KeeperOnSpot = KeeperOnSpot;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var KeeperOnSpotDown = (function (_super) {
        __extends(KeeperOnSpotDown, _super);
        function KeeperOnSpotDown(playState) {
            return _super.call(this, playState) || this;
        }
        KeeperOnSpotDown.prototype.start = function (ballCatchDelay) {
            this.directMoveX(ballCatchDelay);
            var delay = ballCatchDelay - KeeperOnSpotDown._CATCH_ANIM_LEN;
            if (delay > 0) {
                Penalty.Global.game.time.events.add(delay, function () {
                    this.startAnim();
                }, this);
            }
            else {
                this.startAnim();
            }
            this._completed = false;
            return true;
        };
        KeeperOnSpotDown.prototype.process = function () {
            return !this._completed;
        };
        KeeperOnSpotDown.prototype.startAnim = function () {
            var sprite = this._playState.keeper.sprite;
            sprite.onFinish.addOnce(function () {
                this._completed = true;
            }, this);
            this._playState.keeper.sprite.playAnimationByName("onSpotDown");
        };
        KeeperOnSpotDown._CATCH_ANIM_LEN = 100;
        return KeeperOnSpotDown;
    }(Penalty.KeeperCatchProcBase));
    Penalty.KeeperOnSpotDown = KeeperOnSpotDown;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var eOnSpotJumpState;
    (function (eOnSpotJumpState) {
        eOnSpotJumpState[eOnSpotJumpState["idle"] = 0] = "idle";
        eOnSpotJumpState[eOnSpotJumpState["jump"] = 1] = "jump";
        eOnSpotJumpState[eOnSpotJumpState["fall"] = 2] = "fall";
    })(eOnSpotJumpState || (eOnSpotJumpState = {}));
    var KeeperOnSpotJump = (function (_super) {
        __extends(KeeperOnSpotJump, _super);
        function KeeperOnSpotJump(playState) {
            return _super.call(this, playState) || this;
        }
        KeeperOnSpotJump.prototype.start = function (ballCatchDelay) {
            var kickOffSet = this._playState.kickOffSet;
            var ballPos = kickOffSet.keeperPos.y;
            var i = KeeperOnSpotJump._JUMP_VELOCITIES.length;
            var jumpTime;
            var jumpVelocity;
            while (i-- != 0) {
                jumpVelocity = KeeperOnSpotJump._JUMP_VELOCITIES[i];
                jumpTime = Math.ceil(jumpVelocity / Penalty.KeeperCatchProcBase._GRAVITY);
                var distance = jumpTime * ((jumpVelocity + Penalty.KeeperCatchProcBase._GRAVITY) / 2);
                if (Penalty.Keeper.START_Y + KeeperOnSpotJump._CATCH_OFFSET_Y - distance <= ballPos)
                    break;
            }
            jumpTime = (jumpTime / Penalty.Global.FPS) * 1000;
            this._jumpVelocity = jumpVelocity;
            this._jumpTime = jumpTime;
            this._state = eOnSpotJumpState.idle;
            this._completedMask = 0;
            var sprite = this._playState.keeper.sprite;
            var delay = ballCatchDelay - (jumpTime + KeeperOnSpotJump._JUMP_ANIM_BOUNCE_DELAY);
            if (delay > 0) {
                Penalty.Global.game.time.events.add(delay, function () { this.startJumpAnim(); }, this);
            }
            else {
                this.startJumpAnim();
            }
            this.directMoveX(ballCatchDelay);
            return true;
        };
        KeeperOnSpotJump.prototype.startJumpAnim = function () {
            var sprite = this._playState.keeper.sprite;
            sprite.onEvent.addOnce(function () {
                this._state = eOnSpotJumpState.jump;
            }, this);
            sprite.playAnimationByName("onSpotJump");
        };
        KeeperOnSpotJump.prototype.startFallAnim = function () {
            var sprite = this._playState.keeper.sprite;
            sprite.onFinish.addOnce(function () {
                this._completedMask |= 2;
            }, this);
            sprite.playAnimationByName("onSpotFall");
        };
        KeeperOnSpotJump.prototype.process = function () {
            if (this._state != eOnSpotJumpState.idle) {
                if ((this._completedMask & 1) == 0) {
                    var sprite = this._playState.keeper.sprite;
                    sprite.y -= this._jumpVelocity;
                    this._jumpVelocity -= (Penalty.KeeperCatchProcBase._GRAVITY * Penalty.Global.deltaRatio);
                    if (this._state == eOnSpotJumpState.jump) {
                        if (this._jumpVelocity <= 0) {
                            this._state = eOnSpotJumpState.fall;
                        }
                    }
                    else {
                        if (sprite.y >= Penalty.Keeper.START_Y) {
                            sprite.y = Penalty.Keeper.START_Y;
                            this._completedMask |= 1;
                            this.startFallAnim();
                        }
                    }
                }
            }
            return (this._completedMask != 3);
        };
        KeeperOnSpotJump._JUMP_ANIM_BOUNCE_DELAY = 650;
        KeeperOnSpotJump._CATCH_OFFSET_Y = -170;
        KeeperOnSpotJump._JUMP_VELOCITIES = [8, 7, 5];
        return KeeperOnSpotJump;
    }(Penalty.KeeperCatchProcBase));
    Penalty.KeeperOnSpotJump = KeeperOnSpotJump;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var eKeeperState;
    (function (eKeeperState) {
        eKeeperState[eKeeperState["idle"] = 0] = "idle";
        eKeeperState[eKeeperState["catchOnSpot"] = 1] = "catchOnSpot";
        eKeeperState[eKeeperState["catchOnSpotJump"] = 2] = "catchOnSpotJump";
        eKeeperState[eKeeperState["catchOnSpotDown"] = 3] = "catchOnSpotDown";
        eKeeperState[eKeeperState["catchSideJump"] = 4] = "catchSideJump";
    })(eKeeperState = Penalty.eKeeperState || (Penalty.eKeeperState = {}));
    var Keeper = (function () {
        function Keeper(playState) {
            this._catchProcessors = [];
            this._playState = playState;
            this._catchProcessors.push(new Penalty.KeeperOnSpot(playState));
            this._catchProcessors.push(new Penalty.KeeperOnSpotJump(playState));
            this._catchProcessors.push(new Penalty.KeeperOnSpotDown(playState));
            this._catchProcessors.push(new Penalty.KeeperSideJump(playState));
            this._shadow = new Phaser.Image(Penalty.Global.game, Keeper.START_X, Keeper.START_Y, "atlas0", "gaolkeeper_shadow");
            this._shadow.anchor.set(0.5);
            var spriterLoader = new Spriter.Loader();
            var spriterFile = new Spriter.SpriterJSON(playState.cache.getJSON("animKeeper"), { imageNameType: Spriter.eImageNameType.NAME_ONLY });
            var spriterData = spriterLoader.load(spriterFile);
            this._sprite = new Spriter.SpriterGroup(playState.game, spriterData, "atlas0", "keeper", "idle0", 100);
            this._sprite.position.setTo(Keeper.START_X, Keeper.START_Y);
        }
        Object.defineProperty(Keeper.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Keeper.prototype, "group", {
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Keeper.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Keeper.prototype, "shadow", {
            get: function () {
                return this._shadow;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Keeper.prototype, "catchAnimCompleted", {
            get: function () {
                return this._catchAnimCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Keeper.prototype.addToWorld = function () {
            this._group = Penalty.Global.game.add.group();
            this._group.add(this._shadow);
            this._group.add(this._sprite);
        };
        Keeper.prototype.reset = function () {
            this._state = eKeeperState.idle;
            this._sprite.playAnimationByName("idle0");
            this._sprite.position.set(Keeper.START_X, Keeper.START_Y);
            this._sprite.angle = 0;
            this._shadow.position.set(Keeper.START_X, Keeper.START_Y);
        };
        Keeper.prototype.process = function () {
            this._sprite.updateAnimation();
            if (this._state != eKeeperState.idle) {
                if (!this._catchProcessors[this._state - 1].process()) {
                    this._catchAnimCompleted = true;
                    if (this._state != eKeeperState.catchSideJump) {
                        this._state = eKeeperState.idle;
                        this._sprite.playAnimationByName("idle0");
                    }
                }
            }
        };
        Keeper.prototype.kickOff = function () {
            var kickOffSet = this._playState.kickOffSet;
            var ballCatchDelay = ((kickOffSet.keeperDistance / Penalty.Ball.KICKOFF_SPEED) * (1000 / Penalty.Global.FPS)) + Penalty.Player.KICKOFF_DELAY;
            if (kickOffSet.result == Penalty.eKickOffResult.goal) {
                var anim = this.selectCatchAnim(true);
                if (anim != eKeeperState.catchSideJump || Penalty.Global.game.rnd.realInRange(0, 1) > 0.8) {
                    kickOffSet.keeperPos.x = Keeper.START_X +
                        Penalty.Global.game.rnd.integerInRange(Keeper.ON_SPOT_CATCH_MAX_H_DISTANCE + (Penalty.Goal.INNER_RX2 - Keeper.START_X - Keeper.ON_SPOT_CATCH_MAX_H_DISTANCE) / 2, (Penalty.Goal.INNER_RX2 - Keeper.START_X) * 0.8) * (kickOffSet.keeperPos.x < Keeper.START_X ? 1 : -1);
                }
                else {
                    ballCatchDelay *= 1.2;
                }
            }
            else if (kickOffSet.result == Penalty.eKickOffResult.bar) {
                ballCatchDelay *= 1.2;
            }
            var sideJumpEnabled = true;
            while (true) {
                var anim = this.selectCatchAnim(sideJumpEnabled);
                if (this._catchProcessors[anim - 1].start(ballCatchDelay)) {
                    this._state = anim;
                    break;
                }
                sideJumpEnabled = false;
            }
            this._catchAnimCompleted = false;
        };
        Keeper.prototype.selectCatchAnim = function (sideJumpEnabled) {
            var kickOffSet = this._playState.kickOffSet;
            var res;
            if (!sideJumpEnabled || Math.abs(kickOffSet.keeperPos.x - Keeper.START_X) < Keeper.ON_SPOT_CATCH_MAX_H_DISTANCE) {
                var height = Penalty.Goal.INNER_BY1 - kickOffSet.keeperPos.y;
                if (height < 42) {
                    res = eKeeperState.catchOnSpotDown;
                }
                else if (height < 110) {
                    res = eKeeperState.catchOnSpot;
                }
                else {
                    res = eKeeperState.catchOnSpotJump;
                }
            }
            else {
                res = eKeeperState.catchSideJump;
            }
            return res;
        };
        Keeper.START_X = Penalty.Global.GAME_WIDTH / 2;
        Keeper.START_Y = 697;
        Keeper.ON_SPOT_CATCH_MAX_H_DISTANCE = 100;
        return Keeper;
    }());
    Penalty.Keeper = Keeper;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var eGoalTargetType;
    (function (eGoalTargetType) {
        eGoalTargetType[eGoalTargetType["rectangle"] = 0] = "rectangle";
        eGoalTargetType[eGoalTargetType["circle"] = 1] = "circle";
    })(eGoalTargetType = Penalty.eGoalTargetType || (Penalty.eGoalTargetType = {}));
    ;
    var eGoalTargetAnchor;
    (function (eGoalTargetAnchor) {
        eGoalTargetAnchor[eGoalTargetAnchor["topLeft"] = 0] = "topLeft";
        eGoalTargetAnchor[eGoalTargetAnchor["topRight"] = 1] = "topRight";
        eGoalTargetAnchor[eGoalTargetAnchor["bottomLeft"] = 2] = "bottomLeft";
        eGoalTargetAnchor[eGoalTargetAnchor["bottomRight"] = 3] = "bottomRight";
    })(eGoalTargetAnchor || (eGoalTargetAnchor = {}));
    ;
    var GoalTargetDifGroup = (function () {
        function GoalTargetDifGroup(groups, repetitionsCnt, startSpeedRatio, finalSpeedRatio, startSizeRatio, finalSizeRatio) {
            if (repetitionsCnt === void 0) { repetitionsCnt = 0; }
            if (startSpeedRatio === void 0) { startSpeedRatio = 1; }
            if (finalSpeedRatio === void 0) { finalSpeedRatio = 1; }
            if (startSizeRatio === void 0) { startSizeRatio = 1; }
            if (finalSizeRatio === void 0) { finalSizeRatio = 1; }
            this._groups = groups;
            this._repetitionsCnt = repetitionsCnt;
            this._startSpeedRatio = startSpeedRatio;
            this._finalSpeedRatio = finalSpeedRatio;
            this._startSizeRatio = startSizeRatio;
            this._finalSizeRatio = finalSizeRatio;
        }
        Object.defineProperty(GoalTargetDifGroup.prototype, "targetGroups", {
            get: function () {
                return this._groups;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetDifGroup.prototype, "repetitionCnt", {
            get: function () {
                return this._repetitionsCnt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetDifGroup.prototype, "startSpeedRatio", {
            get: function () {
                return this._startSpeedRatio;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetDifGroup.prototype, "finalSpeedRatio", {
            get: function () {
                return this._finalSpeedRatio;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetDifGroup.prototype, "startSizeRatio", {
            get: function () {
                return this._startSizeRatio;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetDifGroup.prototype, "finalSizeRatio", {
            get: function () {
                return this._finalSizeRatio;
            },
            enumerable: true,
            configurable: true
        });
        return GoalTargetDifGroup;
    }());
    var GoalTargetDifSettings = (function () {
        function GoalTargetDifSettings() {
        }
        Object.defineProperty(GoalTargetDifSettings.prototype, "speedRatio", {
            get: function () {
                return this._speedRatio;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetDifSettings.prototype, "sizeRatio", {
            get: function () {
                return this._sizeRatio;
            },
            enumerable: true,
            configurable: true
        });
        GoalTargetDifSettings.prototype.update = function (difGroup, repetitionId) {
            var ratio;
            if (difGroup.repetitionCnt == 0) {
                ratio = 1;
            }
            else {
                if (repetitionId > difGroup.repetitionCnt)
                    repetitionId = difGroup.repetitionCnt;
                ratio = (repetitionId / difGroup.repetitionCnt);
            }
            this._speedRatio = difGroup.startSpeedRatio + (difGroup.finalSpeedRatio - difGroup.startSpeedRatio) * ratio;
            this._sizeRatio = difGroup.startSizeRatio + (difGroup.finalSizeRatio - difGroup.startSizeRatio) * ratio;
        };
        return GoalTargetDifSettings;
    }());
    var GoalTargetData = (function () {
        function GoalTargetData(x1, y1, bonusDistance, x2, y2, moveSpeedRatio, moveEaseFnc, rndPosOffset, scale) {
            if (bonusDistance === void 0) { bonusDistance = -1; }
            if (moveSpeedRatio === void 0) { moveSpeedRatio = 1; }
            if (moveEaseFnc === void 0) { moveEaseFnc = Phaser.Easing.Linear.None; }
            if (rndPosOffset === void 0) { rndPosOffset = 0; }
            if (scale === void 0) { scale = 1; }
            this._scale = scale;
            this._movePosA = new Phaser.Point(x1, y1);
            if (x2 != undefined && moveSpeedRatio != 0) {
                this._movePosB = new Phaser.Point(x2, y2);
                this._moveSpeed = GoalTargetData._DEF_SPEED * moveSpeedRatio;
                this._moveEaseFnc = moveEaseFnc;
            }
            else {
                this._moveSpeed = 0;
            }
            this._rndPosOffset = rndPosOffset;
            this._bonusDistance = bonusDistance;
        }
        Object.defineProperty(GoalTargetData.prototype, "movePosA", {
            get: function () {
                return this._movePosA;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetData.prototype, "movePosB", {
            get: function () {
                return this._movePosB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetData.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetData.prototype, "moveSpeed", {
            get: function () {
                return this._moveSpeed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetData.prototype, "moveEaseFnc", {
            get: function () {
                return this._moveEaseFnc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetData.prototype, "rndPosOffset", {
            get: function () {
                return this._rndPosOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetData.prototype, "bonusDistance", {
            get: function () {
                return this._bonusDistance;
            },
            enumerable: true,
            configurable: true
        });
        GoalTargetData.DEF_DIAMETER = 80;
        GoalTargetData._DEF_SPEED = 1;
        return GoalTargetData;
    }());
    Penalty.GoalTargetData = GoalTargetData;
    var eGoalActTargetMode;
    (function (eGoalActTargetMode) {
        eGoalActTargetMode[eGoalActTargetMode["inactive"] = 0] = "inactive";
        eGoalActTargetMode[eGoalActTargetMode["active"] = 1] = "active";
    })(eGoalActTargetMode || (eGoalActTargetMode = {}));
    var GoalActTarget = (function (_super) {
        __extends(GoalActTarget, _super);
        function GoalActTarget() {
            var _this = _super.call(this, Penalty.Global.game, 0, 0, "atlas0", "target") || this;
            _this._targetData = null;
            _this._posA = new Phaser.Point();
            _this._posB = new Phaser.Point();
            _this._mode = eGoalActTargetMode.inactive;
            _this.anchor.set(0.5);
            _this.exists = false;
            return _this;
        }
        Object.defineProperty(GoalActTarget.prototype, "radius", {
            get: function () { return this._radius; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalActTarget.prototype, "targetData", {
            get: function () {
                return this._targetData;
            },
            enumerable: true,
            configurable: true
        });
        GoalActTarget.prototype.activateTarget = function (targetData, manager) {
            this._targetData = targetData;
            var scale = targetData.scale * manager.difficulty.sizeRatio;
            var diameter = GoalTargetData.DEF_DIAMETER * scale;
            var radius = diameter / 2;
            this._radius = radius;
            this.scale.set(scale);
            var goalW = (Penalty.Goal.INNER_RX1 - Penalty.Goal.INNER_LX1) - diameter;
            var goalH = (Penalty.Goal.INNER_BY1 - Penalty.Goal.INNER_TY1) - diameter;
            this._posA.set(Penalty.Goal.INNER_LX1 + radius + Math.floor(goalW * targetData.movePosA.x), Penalty.Goal.INNER_TY1 + radius + Math.floor(goalH * targetData.movePosA.y));
            var moveSpeed = targetData.moveSpeed * manager.difficulty.speedRatio;
            if (moveSpeed != 0) {
                this._posB.set(Penalty.Goal.INNER_LX1 + radius + Math.floor(goalW * targetData.movePosB.x), Penalty.Goal.INNER_TY1 + radius + Math.floor(goalH * targetData.movePosB.y));
                this._moveAngle = this._posA.angle(this._posB, false);
                this._moveAtoBDistance = this._posA.distance(this._posB, false);
                this._moveAtoBTime = (this._moveAtoBDistance / moveSpeed) / Penalty.Global.FPS * 1000;
            }
            else {
                this._moveAngle = 0;
                this._moveAtoBDistance = 0;
                this._moveAtoBTime = 0;
            }
            if ((targetData.rndPosOffset & 1) != 0) {
                var lX = Penalty.Goal.INNER_LX1 + radius;
                if (moveSpeed != 0) {
                    var moveLen = Math.abs(this._posA.x - this._posB.x);
                    goalW -= moveLen;
                    if (this._posA.x > this._posB.x)
                        lX += moveLen;
                }
                this._posA.x = lX + Penalty.Global.game.rnd.integerInRange(0, goalW);
            }
            if ((targetData.rndPosOffset & 2) != 0) {
                var tY = Penalty.Goal.INNER_TY1 + radius;
                if (moveSpeed != 0) {
                    var moveLen = Math.abs(this._posA.y - this._posB.y);
                    goalH -= moveLen;
                    if (this._posA.y > this._posB.y)
                        tY += moveLen;
                }
                this._posA.y = tY + Penalty.Global.game.rnd.integerInRange(0, goalH);
            }
            this.position.copyFrom(this._posA);
            var bonusDis = targetData.bonusDistance;
            if (bonusDis >= 0) {
                if (moveSpeed == 0)
                    bonusDis = 0;
                bonusDis = bonusDis * this._moveAtoBDistance;
                manager.setBonus(this.position.x + Math.cos(this._moveAngle) * bonusDis, this.position.y + Math.sin(this._moveAngle) * bonusDis);
            }
            this._actTime = Penalty.Global.elapsedTime;
            this.alpha = 1;
            this.exists = true;
            this._mode = eGoalActTargetMode.active;
        };
        GoalActTarget.prototype.update = function () {
            switch (this._mode) {
                case eGoalActTargetMode.inactive: {
                    break;
                }
                case eGoalActTargetMode.active: {
                    if (this._moveAtoBDistance != 0) {
                        var time = (Penalty.Global.elapsedTime - this._actTime);
                        var progress = (time % this._moveAtoBTime) / this._moveAtoBTime;
                        if ((Math.floor(time / this._moveAtoBTime) & 1) != 0) {
                            progress = 1 - progress;
                        }
                        progress = this._targetData.moveEaseFnc(progress);
                        var distance = this._moveAtoBDistance * progress;
                        this.x = this._posA.x + Math.cos(this._moveAngle) * distance;
                        this.y = this._posA.y + Math.sin(this._moveAngle) * distance;
                    }
                    break;
                }
            }
            this.angle += 0.2 * Penalty.Global.deltaRatio;
        };
        GoalActTarget.prototype.kickOff = function () {
            this._mode = eGoalActTargetMode.inactive;
        };
        return GoalActTarget;
    }(Phaser.Sprite));
    Penalty.GoalActTarget = GoalActTarget;
    var GoalTargetKickOffSettings = (function () {
        function GoalTargetKickOffSettings() {
        }
        Object.defineProperty(GoalTargetKickOffSettings.prototype, "angle", {
            get: function () {
                return this._angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetKickOffSettings.prototype, "power", {
            get: function () {
                return this._power;
            },
            enumerable: true,
            configurable: true
        });
        GoalTargetKickOffSettings.prototype.setup = function (angle, power) {
            this._angle = angle;
            this._power = power;
        };
        return GoalTargetKickOffSettings;
    }());
    Penalty.GoalTargetKickOffSettings = GoalTargetKickOffSettings;
    var GoalTargetManager = (function () {
        function GoalTargetManager() {
            this._targets = [];
            this._difSettings = new GoalTargetDifSettings();
            this._difTargets = [];
            this._actTargets = [];
            var targets = [];
            var groups;
            groups = [];
            groups.push([new GoalTargetData(1, 0.5, 0)]);
            targets.push(new GoalTargetDifGroup(groups, 0, 0, 0, 2.5, 2.5));
            groups = [];
            groups.push([new GoalTargetData(0.1, 0.1, 0),
                new GoalTargetData(0.9, 0.9, -1, 0, 0, 0, undefined, 0, 2)]);
            groups.push([new GoalTargetData(0.9, 0.9, 0),
                new GoalTargetData(0.1, 0.1, -1, 0, 0, 0, undefined, 0, 2)]);
            targets.push(new GoalTargetDifGroup(groups));
            groups = [];
            groups.push([new GoalTargetData(0.1, 0.5, 0),
                new GoalTargetData(0.9, 0.5, -1, 0, 0, 0, undefined, 0, 2)]);
            groups.push([new GoalTargetData(0.9, 0.5, 0),
                new GoalTargetData(0.1, 0.5, -1, 0, 0, 0, undefined, 0, 2)]);
            targets.push(new GoalTargetDifGroup(groups));
            groups = [];
            groups.push([new GoalTargetData(0.05, 0.05, 0.5, 0.05, 0.95),
                new GoalTargetData(0.95, 0.5, -1, 0, 0, 0, undefined, 0, 1.5)]);
            groups.push([new GoalTargetData(0.95, 0.05, 0.5, 0.95, 0.95),
                new GoalTargetData(0.05, 0.5, -1, 0, 0, 0, undefined, 0, 1.5)]);
            groups.push([new GoalTargetData(0.3, 0.05, 1, 0.7, 0.05),
                new GoalTargetData(0.05, 0.95, -1, 0, 0, 0, undefined, 0, 1.5)]);
            groups.push([new GoalTargetData(0.3, 0.95, 1, 0.7, 0.95),
                new GoalTargetData(0.95, 0.05, -1, 0, 0, 0, undefined, 0, 1.5)]);
            targets.push(new GoalTargetDifGroup(groups));
            groups = [];
            groups.push([new GoalTargetData(0, 0, 0.3, 0.5, 0, 1, Phaser.Easing.Sinusoidal.InOut, 3)]);
            groups.push([new GoalTargetData(0, 0, 0.7, 0, 1, 1, Phaser.Easing.Sinusoidal.InOut, 3)]);
            groups.push([new GoalTargetData(0, 0, 0.3, 0.5, 1, 1, Phaser.Easing.Sinusoidal.InOut, 3)]);
            groups.push([new GoalTargetData(0.5, 0, 0.7, 0, 1, 1, Phaser.Easing.Sinusoidal.InOut, 3)]);
            targets.push(new GoalTargetDifGroup(groups, 5, 1, 3, 1, 0.7));
            this._targets = targets;
        }
        Object.defineProperty(GoalTargetManager.prototype, "actTargetsGroup", {
            get: function () {
                return this._actTargetsGroup;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetManager.prototype, "actTargets", {
            get: function () {
                return this._actTargets;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetManager.prototype, "bonus", {
            get: function () {
                return this._bonus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GoalTargetManager.prototype, "difficulty", {
            get: function () {
                return this._difSettings;
            },
            enumerable: true,
            configurable: true
        });
        GoalTargetManager.prototype.addToWorld = function () {
            this._actTargetsGroup = Penalty.Global.game.add.group();
            this._bonus = Penalty.Global.game.add.image(0, 0, "atlas0", "star");
            this._bonus.anchor.set(0.5);
            this._bonus.exists = false;
            this._hitPoint = Penalty.Global.game.add.image(0, 0, "atlas0", "targetHitPoint");
            this._hitPoint.anchor.set(0.5);
            this._hitPoint.exists = false;
        };
        GoalTargetManager.prototype.reset = function () {
            this._hitPoint.exists = false;
            this._bonus.exists = false;
            this._actTargetsGroup.setAll("exists", false);
            this._actTargets.splice(0, this._actTargets.length);
            this.updateDifficulty(true);
        };
        GoalTargetManager.prototype.restartTargets = function () {
            this._hitPoint.exists = false;
            this._bonus.exists = false;
            var targetId = this._actTargets.length;
            while (targetId-- != 0) {
                var target = this._actTargets[targetId];
                target.activateTarget(target.targetData, this);
            }
            this._hitPoint.exists = false;
        };
        GoalTargetManager.prototype.newTargets = function () {
            if (this._difTargets.length == 0) {
                this.updateDifficulty();
            }
            this._hitPoint.exists = false;
            this._bonus.exists = false;
            var i = Penalty.Global.game.rnd.integerInRange(0, this._difTargets.length - 1);
            var targets = this._difTargets[i];
            this._difTargets.splice(i, 1);
            this._actTargetsGroup.setAll("exists", false, true, true);
            this._actTargets.splice(0, this._actTargets.length);
            i = targets.length;
            while (i-- != 0) {
                var target = this._actTargetsGroup.getFirstExists(false, false);
                if (target == null) {
                    target = new GoalActTarget();
                    this._actTargetsGroup.add(target, true);
                }
                target.activateTarget(targets[i], this);
                this._actTargets.push(target);
            }
        };
        GoalTargetManager.prototype.setBonus = function (x, y) {
            var bonus = this._bonus;
            bonus.position.set(x, y);
            bonus.exists = true;
            bonus.angle = -22.5;
            bonus.alpha = 1;
            bonus.scale.set(1);
            Penalty.Global.game.tweens.removeFrom(bonus);
            Penalty.Global.game.tweens.create(bonus).to({ angle: 22.5 }, 1000, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
        };
        GoalTargetManager.prototype.hitTarget = function (target, pos, bonus) {
            Penalty.Global.game.add.tween(target.scale).to({ x: target.scale.x + 1, y: target.scale.y + 1 }, 750, Phaser.Easing.Cubic.Out, true);
            Penalty.Global.game.add.tween(target).to({ alpha: 0 }, 750, Phaser.Easing.Cubic.In, true).onComplete.addOnce(function () {
                this.exists = false;
            }, this);
            this._hitPoint.position.copyFrom(pos);
            this._hitPoint.exists = true;
            this._hitPoint.scale.set(1);
            this._hitPoint.alpha = 1;
            Penalty.Global.game.add.tween(this._hitPoint.scale).to({ x: 2, y: 2 }, 750, Phaser.Easing.Cubic.Out, true);
            Penalty.Global.game.add.tween(this._hitPoint).to({ alpha: 0 }, 750, Phaser.Easing.Cubic.In, true).onComplete.addOnce(function () {
                this.exists = false;
            }, this);
            if (bonus) {
                Penalty.Global.game.add.tween(this._bonus.scale).to({ x: 2, y: 2 }, 750, Phaser.Easing.Cubic.Out, true);
                Penalty.Global.game.add.tween(this._bonus).to({ alpha: 0 }, 750, Phaser.Easing.Cubic.In, true).onComplete.addOnce(function () {
                    this.exists = false;
                }, this);
            }
        };
        GoalTargetManager.prototype.kickOff = function () {
            var targets = this._actTargets;
            var i = targets.length;
            while (i-- != 0)
                targets[i].kickOff();
        };
        GoalTargetManager.calculateBestKickOffSettings = function (target, result) {
            var res = (result == undefined ? new GoalTargetKickOffSettings : result);
            var angle = Penalty.Ball.startPos.angle(new Phaser.Point(target.x, Penalty.Goal.INNER_BY1), false);
            var power = (Penalty.KickOffSettings.ballMaxY - target.y) / (Penalty.KickOffSettings.ballMaxY - Penalty.KickOffSettings.ballMinY);
            res.setup(angle, power);
            return res;
        };
        GoalTargetManager.prototype.updateDifficulty = function (reset) {
            if (reset === void 0) { reset = false; }
            var difId;
            var difGroupRepId;
            var difGroup;
            if (reset) {
                difGroup = this._targets[(difId = 0)];
                difGroupRepId = 0;
            }
            else {
                difId = this._difId;
                difGroup = this._targets[difId];
                difGroupRepId = this._difGroupRepId;
                if (difGroupRepId < difGroup.repetitionCnt) {
                    difGroupRepId++;
                }
                else {
                    difGroupRepId = 0;
                    if (difId < this._targets.length - 1) {
                        difGroup = this._targets[++difId];
                    }
                }
            }
            this._difId = difId;
            var targetGroupsSrc = difGroup.targetGroups;
            var targetGroupsDes = this._difTargets;
            if (targetGroupsDes.length != 0)
                targetGroupsDes.splice(0, targetGroupsDes.length);
            var i = targetGroupsSrc.length;
            while (i-- != 0)
                targetGroupsDes.push(targetGroupsSrc[i]);
            this._difGroupRepId = difGroupRepId;
            this._difSettings.update(difGroup, difGroupRepId);
        };
        return GoalTargetManager;
    }());
    Penalty.GoalTargetManager = GoalTargetManager;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var ePlayerState;
    (function (ePlayerState) {
        ePlayerState[ePlayerState["idle"] = 0] = "idle";
        ePlayerState[ePlayerState["kickOff"] = 1] = "kickOff";
    })(ePlayerState || (ePlayerState = {}));
    var Player = (function () {
        function Player(playState) {
            this._playState = playState;
            var spriterLoader = new Spriter.Loader();
            var spriterFile = new Spriter.SpriterJSON(playState.cache.getJSON("animPlayer"), { imageNameType: Spriter.eImageNameType.NAME_ONLY });
            var plSpriterData = spriterLoader.load(spriterFile);
            this._player = new Spriter.SpriterGroup(playState.game, plSpriterData, "atlas0", "player", "idle1", 100);
            this._player.onLoop.add(this.plAnimOnCompleted, this);
            this._player.onEvent.add(this.plAnimOnEvent, this);
        }
        Player.prototype.addToWorld = function () {
            Penalty.Global.game.world.add(this._player);
        };
        Player.prototype.reset = function () {
            this._state = ePlayerState.idle;
            this._player.playAnimationByName("idle1");
            this._player.scale.set(1);
            this._player.position.set(Player._START_X, Player._START_Y);
        };
        Player.prototype.process = function () {
            this._player.updateAnimation();
            if (this._state == ePlayerState.kickOff) {
            }
        };
        Player.prototype.kickOff = function () {
            this._state = ePlayerState.kickOff;
            this._player.playAnimationByName("kickOff");
        };
        Player.prototype.plAnimOnCompleted = function (spriterGroup) {
            if (this._state == ePlayerState.idle) {
            }
            else {
                this._state = ePlayerState.idle;
                this._player.playAnimationByName("idle1");
            }
        };
        Player.prototype.plAnimOnEvent = function (spriterGroup, eventName) {
            this._playState.ball.kickOff();
            Utils.AudioUtils.playSound("kick");
        };
        Player.KICKOFF_DELAY = 560;
        Player._START_X = 400;
        Player._START_Y = 1132;
        return Player;
    }());
    Penalty.Player = Player;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var ReviveScreen = (function () {
        function ReviveScreen() {
            var _this = this;
            var add = Penalty.Global.game.add;
            this._layer = add.group();
            this._layer.visible = false;
            this._fade = add.graphics(0, 0, this._layer);
            this._content = add.group(this._layer);
            this._lightFx = add.image(0, 0, "atlas0", "bgLightFx", this._content);
            this._msgBoard = add.image(0, 0, "atlas0", "msgBoard", this._content);
            this._btnYes = new Controls.Button(0, new Controls.ButtonType(new Phaser.Point(0.5, 0), [new Controls.ButtonState("atlas0", "btnWatchAd_0", 0, 0),
                new Controls.ButtonState("atlas0", "btnWatchAd_1", 0, 0)], undefined, this._content), 0, 0, null, false);
            this._btnYes.onClick.add(function () {
                _this._onCompleteFnc.call(_this._onCompleteCtx, true);
            }, this);
            this._btnNo = new Controls.Button(0, new Controls.ButtonType(new Phaser.Point(0.5, 0), [new Controls.ButtonState("atlas0", "btnNoThanks_0", 0, 0),
                new Controls.ButtonState("atlas0", "btnNoThanks_1", 0, 0)], undefined, this._content), 0, 0, null, false);
            this._btnNo.onClick.add(function () {
                _this._onCompleteFnc.call(_this._onCompleteCtx, false);
            }, this);
        }
        ReviveScreen.prototype.show = function (onCompleteFnc, onCompleteCtx) {
            var _this = this;
            this._onCompleteFnc = onCompleteFnc;
            this._onCompleteCtx = onCompleteCtx;
            this._layer.visible = true;
            this._content.visible = false;
            this._fade.alpha = 0;
            this._layer.parent.bringToTop(this._layer);
            var tween = Penalty.Global.game.tweens.create(this._fade).to({ alpha: 0.8 }, 750, Phaser.Easing.Cubic.Out, true);
            tween.onComplete.addOnce(function () {
                _this._content.visible = true;
                _this._content.exists = true;
            }, this);
        };
        ReviveScreen.prototype.hide = function () {
            this._layer.visible = false;
            this._content.visible = false;
            this._content.exists = false;
        };
        ReviveScreen.prototype.resize = function () {
            var camera = Penalty.Global.game.camera;
            this._fade.clear();
            this._fade.beginFill(0, 1);
            this._fade.drawRect(0, 0, camera.width, camera.height);
            this._lightFx.width = camera.width;
            this._lightFx.height = camera.height;
            this._msgBoard.position.set((camera.width - this._msgBoard.width) >> 1, Math.min(307, (camera.height >> 1) - 300));
            this._btnYes.x = camera.width >> 1;
            this._btnYes.y = camera.height >> 1;
            this._btnNo.x = this._btnYes.x;
            this._btnNo.y = this._btnYes.y + 200;
            this._layer.position.set(camera.x, camera.y);
        };
        return ReviveScreen;
    }());
    Penalty.ReviveScreen = ReviveScreen;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var SwipeFxLengthSettings = (function () {
        function SwipeFxLengthSettings(length, color, alpha) {
            this._length = length;
            this._color = color;
            this._alpha = alpha;
        }
        Object.defineProperty(SwipeFxLengthSettings.prototype, "length", {
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFxLengthSettings.prototype, "color", {
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFxLengthSettings.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            enumerable: true,
            configurable: true
        });
        return SwipeFxLengthSettings;
    }());
    Penalty.SwipeFxLengthSettings = SwipeFxLengthSettings;
    var SwipeFx = (function () {
        function SwipeFx(minLenSettings, maxLenSettings, topOffsetRatio, topWidthRatio, lengthShortenerDelay, lengthShortenerSpeed, minAllowedAngle, maxAllowedAngle) {
            this._startPos = new Phaser.Point();
            this._topPos = new Phaser.Point();
            this._shapeTopPos = new Phaser.Point();
            this._shapeTopPosL = new Phaser.Point();
            this._shapeTopPosR = new Phaser.Point();
            this._shapeBotPos = new Phaser.Point();
            this._shapePoints = [];
            this._minLenSettings = minLenSettings;
            this._maxLenSettings = maxLenSettings;
            this._topOffsetRatio = topOffsetRatio;
            this._topWidthRatio = topWidthRatio;
            this._lenShortenerDelay = lengthShortenerDelay;
            this._lenShortenerSpeed = lengthShortenerSpeed;
            this._minAllowedAngle = Phaser.Math.degToRad(minAllowedAngle);
            this._maxAllowedAngle = Phaser.Math.degToRad(maxAllowedAngle);
            this._shapePoints.push(this._shapeTopPos);
            this._shapePoints.push(this._shapeTopPosR);
            this._shapePoints.push(this._shapeBotPos);
            this._shapePoints.push(this._shapeTopPosL);
            this.reset();
        }
        Object.defineProperty(SwipeFx.prototype, "minLenSettings", {
            get: function () {
                return this._minLenSettings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "maxLenSettings", {
            get: function () {
                return this._maxLenSettings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "minAllowedAngle", {
            get: function () {
                return Phaser.Math.radToDeg(this._minAllowedAngle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "maxAllowedAngle", {
            get: function () {
                return Phaser.Math.radToDeg(this._maxAllowedAngle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "valid", {
            get: function () {
                return (this._active && this._length - this._lenShortenerVal >= this._minLenSettings.length);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "shapePoints", {
            get: function () {
                return this._shapePoints;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "alpha", {
            get: function () {
                if (this._visible) {
                    return this._minLenSettings.alpha + (this._maxLenSettings.alpha - this._minLenSettings.alpha) * this._lengthMinMaxRatio;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "color", {
            get: function () {
                if (this._visible) {
                    return Phaser.Color.interpolateColor(this._minLenSettings.color, this._maxLenSettings.color, 100, this._lengthMinMaxRatio * 100);
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "angle", {
            get: function () {
                return this._angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SwipeFx.prototype, "lengthMinMaxRatio", {
            get: function () {
                return this._lengthMinMaxRatio;
            },
            enumerable: true,
            configurable: true
        });
        SwipeFx.prototype.reset = function () {
            this._active = false;
            this._visible = false;
            this._angle = 0;
            this._length = 0;
            this._lengthMinMaxRatio = 0;
        };
        SwipeFx.prototype.setTopPos = function (topPos) {
            if (this._active) {
                if (topPos.equals(this._shapeTopPos))
                    return true;
                this._topPos.copyFrom(topPos);
                this._angle = this._startPos.angle(topPos, false);
                this._length = this._startPos.distance(topPos, false);
                if (this._minAllowedAngle != this._maxAllowedAngle) {
                    if (!this._visible) {
                        if (this._length >= this._minLenSettings.length) {
                            if (this._angle < this._minAllowedAngle || this._angle > this._maxAllowedAngle) {
                                this.reset();
                                return false;
                            }
                        }
                    }
                    else {
                        var angleChanged = false;
                        if (this._angle < this._minAllowedAngle) {
                            this._angle = this._minAllowedAngle;
                            angleChanged = true;
                        }
                        else if (this._angle > this._maxAllowedAngle) {
                            this._angle = this._maxAllowedAngle;
                            angleChanged = true;
                        }
                        if (angleChanged) {
                            this._topPos.x = this._startPos.x + Math.cos(this._angle) * this._length;
                            this._topPos.y = this._startPos.y + Math.sin(this._angle) * this._length;
                        }
                    }
                }
                this._shapeTopPos.copyFrom(this._topPos);
                return this.updateShape();
            }
            else {
                this._active = true;
                this._visible = false;
                this._startPos.copyFrom(topPos);
                this._angle = 0;
                this._length = 0;
                this._lenShortenerRemDelay = this._lenShortenerDelay;
                this._lenShortenerVal = 0;
            }
            return true;
        };
        SwipeFx.prototype.update = function () {
            if (this._active) {
                if (this._visible) {
                    if (this._lenShortenerRemDelay > 0) {
                        if ((this._lenShortenerRemDelay -= Penalty.Global.deltaRatio) < 0)
                            this._lenShortenerRemDelay = 0;
                    }
                    else if (this._lenShortenerRemDelay == 0) {
                        this._lenShortenerVal += Penalty.Global.deltaRatio * this._lenShortenerSpeed;
                        return this.updateShape();
                    }
                }
            }
            return true;
        };
        SwipeFx.prototype.updateShape = function () {
            var minLenSet = this._minLenSettings;
            var maxLenSet = this._maxLenSettings;
            var length = this._length - this._lenShortenerVal;
            if (length < minLenSet.length) {
                if (this._visible) {
                    this.reset();
                    return false;
                }
                return true;
            }
            else if (length > maxLenSet.length) {
                length = maxLenSet.length;
            }
            this._visible = true;
            var lengthRatio = 0;
            if (this._visible) {
                lengthRatio = (length - minLenSet.length) / (maxLenSet.length - minLenSet.length);
                var topHalfWidth = Math.max(1, (length * this._topWidthRatio) / 2);
                var angle = this._angle - Phaser.Math.degToRad(180);
                var nintyInRad = Phaser.Math.degToRad(90);
                var topOffset = Math.max(1, (length * this._topOffsetRatio));
                var topOffsetX = Math.cos(angle - nintyInRad) * topHalfWidth;
                var topOffsetY = Math.sin(angle - nintyInRad) * topHalfWidth;
                this._shapeBotPos.set(this._shapeTopPos.x + Math.cos(angle) * topOffset, this._shapeTopPos.y + Math.sin(angle) * topOffset);
                this._shapeTopPosR.set(this._shapeBotPos.x + topOffsetX, this._shapeBotPos.y + topOffsetY);
                this._shapeTopPosL.set(this._shapeBotPos.x - topOffsetX, this._shapeBotPos.y - topOffsetY);
                this._shapeBotPos.set(this._shapeTopPos.x + Math.cos(angle) * length, this._shapeTopPos.y + Math.sin(angle) * length);
            }
            this._lengthMinMaxRatio = lengthRatio;
            return true;
        };
        return SwipeFx;
    }());
    Penalty.SwipeFx = SwipeFx;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var eTouchAimingState;
    (function (eTouchAimingState) {
        eTouchAimingState[eTouchAimingState["idle"] = 0] = "idle";
        eTouchAimingState[eTouchAimingState["setup"] = 1] = "setup";
        eTouchAimingState[eTouchAimingState["kickOff"] = 2] = "kickOff";
    })(eTouchAimingState || (eTouchAimingState = {}));
    var TouchAiming = (function () {
        function TouchAiming(play) {
            this._targetPos = new Phaser.Point();
            this._tmpLine1 = new Phaser.Line();
            this._tmpLine2 = new Phaser.Line();
            this._play = play;
            var swipeFxMinLenSet = new Penalty.SwipeFxLengthSettings(40, 0xFFFFFF, 0.1);
            var swipeFxMaxLenSet = new Penalty.SwipeFxLengthSettings(400, 0xFF0000, 0.9);
            this._swipeMinAngle = Phaser.Math.radToDeg(Penalty.Ball.startPos.angle(this._targetPos.set(0, Penalty.Goal.INNER_BY1)));
            this._swipeMaxAngle = Phaser.Math.radToDeg(Penalty.Ball.startPos.angle(this._targetPos.set(Penalty.Global.GAME_WIDTH, Penalty.Goal.INNER_BY1)));
            this._swipeFx = new Penalty.SwipeFx(swipeFxMinLenSet, swipeFxMaxLenSet, 0.1, 0.1, Penalty.Global.FPS / 2, 2, this._swipeMinAngle - 10, this._swipeMaxAngle + 10);
            this._graphics = Penalty.Global.game.add.graphics(0, 0);
            this._tutorial = new Penalty.Tutorial(this._swipeFx);
        }
        Object.defineProperty(TouchAiming.prototype, "targetPos", {
            get: function () {
                return this._targetPos;
            },
            enumerable: true,
            configurable: true
        });
        TouchAiming.prototype.reset = function () {
            this._state = eTouchAimingState.idle;
            this._swipeFx.reset();
            this._tutorial.reset();
            this._graphics.clear();
            this._graphics.alpha = 1;
            this._showTutorial = false;
        };
        TouchAiming.prototype.showTutorial = function (targetId) {
            var target = this._play.targets.actTargets[targetId];
            var startX = Penalty.Global.GAME_WIDTH / 2;
            startX += 50 * (target.x < startX ? -1 : 1);
            this._tutorial.show(startX, Penalty.Ball.startPos.y, target);
            this._showTutorial = true;
        };
        TouchAiming.prototype.process = function () {
            var layerCleared = false;
            var pointer = Penalty.Global.game.input.activePointer;
            var swipeFx = this._swipeFx;
            var pos = this._targetPos;
            if (this._tutorial.active) {
                var tutorSwipeFx = this._tutorial.swipeFx;
                if (tutorSwipeFx.visible) {
                    var graphics = this._graphics;
                    graphics.clear();
                    graphics.beginFill(tutorSwipeFx.color, tutorSwipeFx.alpha);
                    graphics.drawPolygon(tutorSwipeFx.shapePoints);
                    graphics.endFill();
                    layerCleared = true;
                }
            }
            switch (this._state) {
                case eTouchAimingState.idle: {
                    if (pointer.isDown) {
                        this._state = eTouchAimingState.setup;
                        pos.x = pointer.x;
                        pos.y = pointer.y + Penalty.Global.game.camera.y;
                        swipeFx.setTopPos(pos);
                        if (layerCleared)
                            this._graphics.clear();
                    }
                    break;
                }
                case eTouchAimingState.setup: {
                    pos.x = pointer.x;
                    pos.y = pointer.y + Penalty.Global.game.camera.y;
                    if (pointer.isUp || !swipeFx.setTopPos(pos) || !swipeFx.update()) {
                        if (swipeFx.valid) {
                            var angle = Phaser.Math.radToDeg(swipeFx.angle);
                            if (angle > 90 || angle < this._swipeMinAngle) {
                                angle = this._swipeMinAngle;
                            }
                            else if (angle > this._swipeMaxAngle) {
                                angle = this._swipeMaxAngle;
                            }
                            this._tmpLine1.setTo(0, Penalty.Goal.INNER_BY1, Penalty.Global.GAME_WIDTH, Penalty.Goal.INNER_BY1);
                            this._tmpLine2.fromAngle(Penalty.Ball.startPos.x, Penalty.Ball.startPos.y, Phaser.Math.degToRad(angle), Penalty.Global.GAME_HEIGHT);
                            this._tmpLine1.intersects(this._tmpLine2, false, pos);
                            pos.x = Math.round(pos.x);
                            var kickOffSet = this._play.kickOffSet;
                            pos.y = Penalty.KickOffSettings.ballMaxY - (Penalty.KickOffSettings.ballMaxY - Penalty.KickOffSettings.ballMinY) * swipeFx.lengthMinMaxRatio;
                            if (this._tutorial.active) {
                                this._tutorial.hide();
                                this.drawSwipeFx(true);
                            }
                            swipeFx.reset();
                            Penalty.Global.game.add.tween(this._graphics).to({ alpha: 0 }, 1000, Phaser.Easing.Cubic.In, true, 1000);
                            this._state = eTouchAimingState.kickOff;
                        }
                        else {
                            swipeFx.reset();
                            if (pointer.isDown)
                                swipeFx.setTopPos(pos);
                        }
                    }
                    else if (swipeFx.visible) {
                        this.drawSwipeFx(!layerCleared);
                        layerCleared = true;
                    }
                    break;
                }
            }
            return (this._state != eTouchAimingState.kickOff);
        };
        TouchAiming.prototype.drawSwipeFx = function (clearLayer) {
            var graphics = this._graphics;
            if (clearLayer) {
                graphics.clear();
            }
            graphics.beginFill(this._swipeFx.color, this._swipeFx.alpha);
            graphics.drawPolygon(this._swipeFx.shapePoints);
            graphics.endFill();
        };
        return TouchAiming;
    }());
    Penalty.TouchAiming = TouchAiming;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var Tutorial = (function () {
        function Tutorial(touchAminingSwipeFx) {
            this._startPos = new Phaser.Point();
            this._endPos = new Phaser.Point();
            this._hand = Penalty.Global.game.add.image(0, 0, "atlas0", "tutorHand");
            this._hand.exists = false;
            this._swipeFx = new Penalty.SwipeFx(touchAminingSwipeFx.minLenSettings, touchAminingSwipeFx.maxLenSettings, 0.1, 0.1, Penalty.Global.FPS / 2, 2, touchAminingSwipeFx.minAllowedAngle, touchAminingSwipeFx.maxAllowedAngle);
        }
        Object.defineProperty(Tutorial.prototype, "active", {
            get: function () {
                return this._hand.exists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tutorial.prototype, "swipeFx", {
            get: function () {
                return this._swipeFx;
            },
            enumerable: true,
            configurable: true
        });
        Tutorial.prototype.reset = function () {
            this.hide();
        };
        Tutorial.prototype.show = function (startX, startY, target) {
            var kickOffSet = Penalty.GoalTargetManager.calculateBestKickOffSettings(target);
            var len = this._swipeFx.minLenSettings.length + (this._swipeFx.maxLenSettings.length - this._swipeFx.minLenSettings.length) * kickOffSet.power;
            this._startPos.set(startX, startY);
            this._endPos.set(startX + Math.cos(kickOffSet.angle) * len, startY + Math.sin(kickOffSet.angle) * len);
            this._moveDuration = (len / 300) * 1000;
            this._hand.position.copyFrom(this._startPos);
            this._hand.exists = true;
            this._swipeFx.reset();
            var tween = Penalty.Global.game.tweens.create(this._hand).to({
                x: this._endPos.x, y: this._endPos.y
            }, this._moveDuration, Phaser.Easing.Circular.InOut, true);
            tween.onRepeat.add(function () {
                this._swipeFx.reset();
            }, this);
            tween.repeat(-1, 1000);
            tween.onUpdateCallback(function () {
                this._swipeFx.setTopPos(this._hand.position);
                this._swipeFx.update();
            }, this);
        };
        Tutorial.prototype.hide = function () {
            Penalty.Global.game.tweens.removeFrom(this._hand);
            this._hand.exists = false;
        };
        return Tutorial;
    }());
    Penalty.Tutorial = Tutorial;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
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
            _this.state.add("Boot", Penalty.Boot);
            _this.state.add("Preload", Penalty.Preload);
            _this.state.add("Play", Penalty.Play);
            _this.state.start("Boot");
            if (Penalty.Global.GAMEE) {
                Gamee2.Gamee.onStart.add(_this.onGameeStart, _this);
                Gamee2.Gamee.onPause.add(_this.onGameePause, _this);
                Gamee2.Gamee.onResume.add(_this.onGameeResume, _this);
                Gamee2.Gamee.onMute.add(_this.onGameeMute, _this);
                Gamee2.Gamee.onUnmute.add(_this.onGameeUnmute, _this);
            }
            return _this;
        }
        Game.prototype.onGameeStart = function () {
            Gamee2.Gamee.loadAd();
            this.state.getCurrentState().onGameeStart();
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
            Utils.AudioUtils.musicOn = false;
        };
        Game.prototype.onGameeUnmute = function () {
            Utils.AudioUtils.sfxOn = true;
            Utils.AudioUtils.musicOn = true;
        };
        return Game;
    }(Phaser.Game));
    Penalty.Game = Game;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var eKickOffResult;
    (function (eKickOffResult) {
        eKickOffResult[eKickOffResult["goal"] = 0] = "goal";
        eKickOffResult[eKickOffResult["bar"] = 1] = "bar";
        eKickOffResult[eKickOffResult["miss"] = 2] = "miss";
        eKickOffResult[eKickOffResult["catch"] = 3] = "catch";
    })(eKickOffResult = Penalty.eKickOffResult || (Penalty.eKickOffResult = {}));
    var KickOffSettings = (function () {
        function KickOffSettings() {
            this.keeperPos = new Phaser.Point();
            this._debugLayer = new Phaser.Graphics(Penalty.Global.game, 0, 0);
            this._tmpPoint1 = new Phaser.Point();
            this._ballPath = new Phaser.Line();
            this._tmpLine1 = new Phaser.Line();
            this._tmpCircle1 = new Phaser.Circle();
            this._tmpCircle2 = new Phaser.Circle();
            var ballGoalRadius = Penalty.Ball.getBallScale(Penalty.Goal.INNER_BY1) * Penalty.Ball.RADIUS;
            KickOffSettings._ballMaxY = Math.floor(Penalty.Goal.INNER_BY1 - ballGoalRadius);
            KickOffSettings._ballMinY = Math.floor(Penalty.Goal.TBAR_Y - Penalty.Goal.BAR_RADIUS - (ballGoalRadius * 0.8));
        }
        Object.defineProperty(KickOffSettings, "ballMinY", {
            get: function () {
                return KickOffSettings._ballMinY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KickOffSettings, "ballMaxY", {
            get: function () {
                return KickOffSettings._ballMaxY;
            },
            enumerable: true,
            configurable: true
        });
        KickOffSettings.prototype.addToWorld = function () {
            if (Penalty.Global.DEBUG)
                this._debugLayer = Penalty.Global.game.add.graphics(0, 0);
        };
        KickOffSettings.prototype.clearDebugLayer = function () {
            if (Penalty.Global.DEBUG)
                this._debugLayer.clear();
        };
        KickOffSettings.prototype.setup = function (ballTargetPos, targetMng) {
            var ballGoalRadius = Penalty.Ball.getBallScale(Penalty.Goal.INNER_BY1) * Penalty.Ball.RADIUS;
            var point = this._tmpPoint1.set(ballTargetPos.x, Penalty.Goal.INNER_BY1);
            this.pathAngle = Penalty.Ball.startPos.angle(point, false);
            this.pathTopDis = Penalty.Ball.startPos.distance(point, false);
            this.pathTopHeight = Penalty.Goal.INNER_BY1 - ballTargetPos.y;
            this.target = null;
            this._ballPath.fromAngle(Penalty.Ball.startPos.x, Penalty.Ball.startPos.y, this.pathAngle, Penalty.Global.GAME_HEIGHT);
            if (ballTargetPos.x + ballGoalRadius > Penalty.Goal.LBAR_X - Penalty.Goal.BAR_RADIUS && ballTargetPos.x - ballGoalRadius < Penalty.Goal.RBAR_X + Penalty.Goal.BAR_RADIUS) {
                if (ballTargetPos.y - ballGoalRadius >= Penalty.Goal.TBAR_Y + Penalty.Goal.BAR_RADIUS) {
                    if (ballTargetPos.x - ballGoalRadius >= Penalty.Goal.INNER_LX1 && ballTargetPos.x + ballGoalRadius <= Penalty.Goal.INNER_RX1) {
                        var targets = targetMng.actTargets;
                        var targetId = targets.length;
                        var ballCircle = this._tmpCircle1.setTo(ballTargetPos.x, ballTargetPos.y, ballGoalRadius * 2);
                        while (targetId-- != 0) {
                            var target = targets[targetId];
                            if (Phaser.Circle.intersects(ballCircle, this._tmpCircle2.setTo(target.x, target.y, target.width))) {
                                this.target = target;
                                this.setupGoal(ballTargetPos);
                                var bonus = targetMng.bonus;
                                this.bonus = Phaser.Circle.intersects(ballCircle, this._tmpCircle2.setTo(bonus.x, bonus.y, 54));
                                break;
                            }
                        }
                        if (targetId < 0)
                            this.setupKeeper();
                    }
                    else {
                        this.setupSideBar(ballTargetPos, ballGoalRadius);
                    }
                }
                else {
                    this.setupTopBar(ballTargetPos, ballGoalRadius);
                }
            }
            else {
                this.setupMiss(ballTargetPos);
            }
            if (Penalty.Global.DEBUG) {
                var debugLayer = this._debugLayer;
                debugLayer.clear();
                debugLayer.lineStyle(1, 0xFFFF00, 1);
                debugLayer.moveTo(Penalty.Goal.innerLLine.start.x, Penalty.Goal.innerLLine.start.y);
                debugLayer.lineTo(Penalty.Goal.innerLLine.end.x, Penalty.Goal.innerLLine.end.y);
                debugLayer.lineTo(Penalty.Goal.innerBLine.end.x, Penalty.Goal.innerBLine.end.y);
                debugLayer.lineTo(Penalty.Goal.innerRLine.start.x, Penalty.Goal.innerRLine.start.y);
                debugLayer.lineStyle(1, 0x0000FF);
                debugLayer.moveTo(Penalty.Ball.startPos.x, Penalty.Ball.startPos.y);
                debugLayer.lineTo(ballTargetPos.x, Penalty.Goal.INNER_BY1);
                if (this.pathBounceDis != 0) {
                    var x = Penalty.Ball.startPos.x + (Math.cos(-this.pathAngle) * this.pathBounceDis);
                    var y = Penalty.Ball.startPos.y - (Math.sin(-this.pathAngle) * this.pathBounceDis);
                    debugLayer.beginFill(0xFF0000, 1);
                    debugLayer.drawCircle(x, y, 10);
                    debugLayer.endFill();
                    debugLayer.lineColor = 0xFF0000;
                    debugLayer.moveTo(x, y);
                    debugLayer.lineTo(x + (Math.cos(-this.bounceAngle) * 100), y - (Math.sin(-this.bounceAngle) * 100));
                }
                debugLayer.lineStyle(0);
                debugLayer.beginFill(0x0000FF, 0.5);
                debugLayer.drawCircle(ballTargetPos.x, ballTargetPos.y, ballGoalRadius * 2);
                debugLayer.endFill();
            }
        };
        KickOffSettings.prototype.calculateKeeperIntersection = function () {
            var keeperLine = this._tmpLine1.setTo(0, Penalty.Keeper.START_Y, Penalty.Global.GAME_WIDTH, Penalty.Keeper.START_Y);
            var pos = this._tmpPoint1;
            this._ballPath.intersects(keeperLine, false, pos);
            this.keeperDistance = Penalty.Ball.startPos.distance(pos, false);
            this.keeperPos.x = pos.x;
            this.keeperPos.y = Penalty.Goal.INNER_BY1 - Math.max(0, this.pathTopHeight * (this.keeperDistance / this.pathTopDis));
        };
        KickOffSettings.prototype.setupGoal = function (ballTargetPos) {
            this.result = eKickOffResult.goal;
            var goalLine;
            var point1 = this._tmpPoint1;
            var point2;
            if (ballTargetPos.x < Penalty.Global.game.world.centerX) {
                goalLine = Penalty.Goal.innerLLine;
                point2 = this._ballPath.intersects(goalLine, true, point1);
            }
            else {
                goalLine = Penalty.Goal.innerRLine;
                point2 = this._ballPath.intersects(goalLine, true, point1);
            }
            if (point2 == null) {
                goalLine = Penalty.Goal.innerBLine;
                this._ballPath.intersects(goalLine, false, point1);
            }
            this.pathBounceDis = Penalty.Ball.startPos.distance(point1, false);
            this.bounceAngle = this._ballPath.reflect(goalLine);
            this.bounceDis = 10;
            this.bounceTime = 1000;
            this.bounceHeightVel = 0;
            this.calculateKeeperIntersection();
        };
        KickOffSettings.prototype.setupKeeper = function () {
            this.result = eKickOffResult.catch;
            this.calculateKeeperIntersection();
            var keeperLine = this._tmpLine1.setTo(0, Penalty.Keeper.START_Y, Penalty.Global.GAME_WIDTH, Penalty.Keeper.START_Y);
            this.pathBounceDis = this.keeperDistance;
            this.bounceAngle = this._ballPath.reflect(keeperLine);
            this.bounceDis = 100;
            this.bounceTime = 1500;
            this.bounceHeightVel = 0;
            this.pathTopDis = this.pathBounceDis;
            this.pathTopHeight = Penalty.Goal.INNER_BY1 - this.keeperPos.y;
        };
        KickOffSettings.prototype.setupSideBar = function (ballTargetPos, ballGoalRadius) {
            this.result = eKickOffResult.bar;
            this.pathBounceDis = this.pathTopDis;
            this.bounceDis = 300;
            this.bounceTime = 1500;
            this.bounceHeightVel = 0;
            var x = ballTargetPos.x;
            var bounceAngle = this._ballPath.reflect(this._tmpLine1.setTo(0, Penalty.Goal.INNER_BY1, Penalty.Global.GAME_WIDTH, Penalty.Goal.INNER_BY1));
            var posRatio = 0;
            if (x < Penalty.Global.game.world.centerX) {
                if (x < Penalty.Goal.LBAR_X) {
                    posRatio = -((Penalty.Goal.LBAR_X - x) / (Penalty.Goal.BAR_RADIUS + ballGoalRadius));
                }
                else {
                    posRatio = (x - Penalty.Goal.LBAR_X) / (Penalty.Goal.BAR_RADIUS + ballGoalRadius);
                }
            }
            else {
                if (x < Penalty.Goal.RBAR_X) {
                    posRatio = -((Penalty.Goal.RBAR_X - x) / (Penalty.Goal.BAR_RADIUS + ballGoalRadius));
                }
                else {
                    posRatio = (x - Penalty.Goal.RBAR_X) / (Penalty.Goal.BAR_RADIUS + ballGoalRadius);
                }
            }
            this.bounceAngle = bounceAngle - Phaser.Math.degToRad(posRatio * 60);
            this._ballPath.intersects(this._tmpLine1.setTo(0, Penalty.Keeper.START_Y, Penalty.Global.GAME_WIDTH, Penalty.Keeper.START_Y), false, this._tmpPoint1);
            this.keeperPos.x = Penalty.Keeper.START_X + (Penalty.Goal.INNER_RX2 - Penalty.Keeper.START_X) * (ballTargetPos.x < Penalty.Keeper.START_X ? -0.8 : 0.8);
            this.keeperPos.y = Math.max(ballTargetPos.y, Penalty.Goal.INNER_TY1 + (Penalty.Goal.INNER_BY1 - Penalty.Goal.INNER_TY1) * 0.25);
            this.keeperDistance = Penalty.Ball.startPos.distance(this._tmpPoint1);
        };
        KickOffSettings.prototype.setupTopBar = function (ballTargetPos, ballGoalRadius) {
            this.result = eKickOffResult.bar;
            this.bounceAngle = this._ballPath.reflect(this._tmpLine1.setTo(0, Penalty.Goal.INNER_BY1, Penalty.Global.GAME_WIDTH, Penalty.Goal.INNER_BY1));
            this.pathBounceDis = this.pathTopDis;
            this.bounceTime = 1000;
            var posRatio = 0;
            var y = ballTargetPos.y;
            if (y < Penalty.Goal.TBAR_Y) {
                posRatio = -(Penalty.Goal.TBAR_Y - y) / (Penalty.Goal.BAR_RADIUS + ballGoalRadius - 4);
            }
            else if (y > Penalty.Goal.TBAR_Y) {
                posRatio = (y - Penalty.Goal.TBAR_Y) / (Penalty.Goal.BAR_RADIUS + ballGoalRadius);
            }
            this.bounceHeightVel = 10 * posRatio;
            this.bounceDis = 400 * (1 - (0.8 * Math.abs(posRatio)));
            this._ballPath.intersects(this._tmpLine1.setTo(0, Penalty.Keeper.START_Y, Penalty.Global.GAME_WIDTH, Penalty.Keeper.START_Y), false, this._tmpPoint1);
            this.keeperPos.x = Math.max(Math.min(ballTargetPos.x + Penalty.Global.game.rnd.integerInRange(-50, 50), Penalty.Goal.INNER_RX2), Penalty.Goal.INNER_LX2);
            this.keeperPos.y = Penalty.Goal.INNER_TY1 + (Penalty.Goal.INNER_BY1 - Penalty.Goal.INNER_TY1) * 0.1;
            this.keeperDistance = Penalty.Ball.startPos.distance(this._tmpPoint1);
        };
        KickOffSettings.prototype.setupMiss = function (ballTargetPos) {
            this.result = eKickOffResult.miss;
            this.pathBounceDis = this.pathTopDis * 1.2;
            this._ballPath.intersects(this._tmpLine1.setTo(0, Penalty.Keeper.START_Y, Penalty.Global.GAME_WIDTH, Penalty.Keeper.START_Y), false, this._tmpPoint1);
            this.keeperPos.x = Penalty.Keeper.START_X + (Penalty.Goal.INNER_RX2 - Penalty.Keeper.START_X) * (ballTargetPos.x < Penalty.Keeper.START_X ? -0.8 : 0.8);
            this.keeperPos.y = Math.max(ballTargetPos.y, Penalty.Goal.INNER_TY1 + (Penalty.Goal.INNER_BY1 - Penalty.Goal.INNER_TY1) * 0.25);
            this.keeperDistance = Penalty.Ball.startPos.distance(this._tmpPoint1);
        };
        KickOffSettings._ballMinY = 0;
        KickOffSettings._ballMaxY = 0;
        return KickOffSettings;
    }());
    Penalty.KickOffSettings = KickOffSettings;
})(Penalty || (Penalty = {}));
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
var Penalty;
(function (Penalty) {
    var Sounds = (function () {
        function Sounds() {
        }
        Sounds.AUDIO_JSON = {
            "resources": [
                "sfx.ogg",
                "sfx.mp3"
            ],
            "spritemap": {
                "kick": {
                    "start": 0,
                    "end": 0.2038548752834467,
                    "loop": false
                },
                "succes1": {
                    "start": 2,
                    "end": 3.7610430839002267,
                    "loop": false
                },
                "succes2": {
                    "start": 5,
                    "end": 6.793356009070295,
                    "loop": false
                },
                "boo": {
                    "start": 8,
                    "end": 11.537687074829932,
                    "loop": false
                },
                "goal": {
                    "start": 13,
                    "end": 16.582244897959185,
                    "loop": false
                },
                "bar": {
                    "start": 18,
                    "end": 18.46049886621315,
                    "loop": false
                }
            }
        };
        return Sounds;
    }());
    Penalty.Sounds = Sounds;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._gameMinDims = new Phaser.Point(Penalty.Global.GAME_MIN_WIDTH, Penalty.Global.GAME_MIN_HEIGHT);
            _this._gameMaxDims = new Phaser.Point(Penalty.Global.GAME_WIDTH, Penalty.Global.GAME_HEIGHT);
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
            this.world.resize(Penalty.Global.GAME_WIDTH, Penalty.Global.GAME_HEIGHT);
            if (this.game.device.iOS || (this.game.device.android && this.game.device.chrome && this.game.device.chromeVersion >= 55)) {
                this.game.sound.touchLocked = true;
                Penalty.Global.unlockAudio();
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
    Penalty.Boot = Boot;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var ePlayState;
    (function (ePlayState) {
        ePlayState[ePlayState["aiming"] = 0] = "aiming";
        ePlayState[ePlayState["kickOff"] = 1] = "kickOff";
        ePlayState[ePlayState["idle"] = 2] = "idle";
        ePlayState[ePlayState["gameOver"] = 3] = "gameOver";
        ePlayState[ePlayState["reviveScreen"] = 4] = "reviveScreen";
    })(ePlayState = Penalty.ePlayState || (Penalty.ePlayState = {}));
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._showDebug = true;
            return _this;
        }
        Object.defineProperty(Play.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "kickOffSet", {
            get: function () {
                return this._kickOffSet;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "showDebug", {
            get: function () {
                return this._showDebug;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "ball", {
            get: function () {
                return this._ball;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "targets", {
            get: function () {
                return this._targets;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "keeper", {
            get: function () {
                return this._keeper;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "scorePopups", {
            get: function () {
                return this._scorePopups;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "remAttempts", {
            get: function () {
                return this._remAttempts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Play.prototype, "roundId", {
            get: function () {
                return this._roundId;
            },
            enumerable: true,
            configurable: true
        });
        Play.prototype.init = function () {
            this._restartSignal = new Phaser.Signal();
            this._restartSignal.add(this.reset, this);
            if (Penalty.Global.DEBUG) {
                this._debugKey = this.input.keyboard.addKey(Phaser.KeyCode.D);
                this._debugKey.onDown.add(function () {
                    this._showDebug = !this._showDebug;
                    this._debugLayer.visible = this._showDebug;
                    if (!this._showDebug)
                        this._kickOffSet.clearDebugLayer();
                }, this);
            }
            this.camera.onFadeComplete.add(this.roundCompleted, this);
            this._kickOffSet = new Penalty.KickOffSettings();
            this._targets = new Penalty.GoalTargetManager();
            this._ball = new Penalty.Ball(this);
            this._player = new Penalty.Player(this);
            this._keeper = new Penalty.Keeper(this);
            this._flashFx = new Penalty.FlashEffects();
            this._scorePopups = new Utils.PopupMessages("fntScore", 72, 75, 1500, Phaser.Easing.Cubic.Out);
            this._perfectPopup = new Utils.PopupMessages("fntScore", 50, 75, 1500, Phaser.Easing.Cubic.Out);
        };
        Play.prototype.create = function () {
            this.game.add.image(0, 0, "atlas0", "background");
            this._flashFx.addToWorld();
            this._targets.addToWorld();
            this._keeper.addToWorld();
            this._ball.addToWorld();
            this._kickOffSet.addToWorld();
            this._player.addToWorld();
            this._remAttempts = new Penalty.RemAttempts();
            this._scorePopups.addToWorld(this.game);
            this._perfectPopup.addToWorld(this.game);
            this._touchAiming = new Penalty.TouchAiming(this);
            this._reviveScreen = new Penalty.ReviveScreen();
            if (Penalty.Global.DEBUG) {
                this._debugLayer = this.game.add.text(10, 10, "", { font: "Courier", fontSize: 14, fill: "#FF00FF" });
                this._debugLayer.lineSpacing = 2;
                this._debugLayer.setShadow(2, 2);
            }
            this.resized(this.game.width, this.game.height, this.game.width, this.game.height);
            this.reset();
            if (Penalty.Global.GAMEE && Gamee2.Gamee.initialized && !Gamee2.Gamee.ready) {
                this.game.paused = true;
                Gamee2.Gamee.gameReady();
            }
            else {
                this.playAmbientSfx();
            }
        };
        Play.prototype.resumed = function () {
            this._timeBase += this.time.pauseDuration;
        };
        Play.prototype.update = function () {
            Penalty.Global.elapsedTime = this.time.elapsedSince(this._timeBase);
            Penalty.Global.deltaRatio = this.time.elapsedMS / (1000 / 60);
            if (Penalty.Global.deltaRatio < 1)
                Penalty.Global.deltaRatio = 1;
            this._flashFx.process();
            switch (this._state) {
                case ePlayState.aiming: {
                    if (!this._touchAiming.process()) {
                        this._state = ePlayState.kickOff;
                        this._targets.kickOff();
                        this._kickOffSet.setup(this._touchAiming.targetPos, this._targets);
                        this._player.kickOff();
                        this._keeper.kickOff();
                    }
                    break;
                }
                case ePlayState.kickOff: {
                    this._ball.process();
                    break;
                }
            }
            this._player.process();
            this._keeper.process();
        };
        Play.prototype.reset = function () {
            this._timeBase = this.time.elapsedSince(0);
            Penalty.Global.elapsedTime = this.time.elapsedSince(this._timeBase);
            this.game.paused = false;
            this.camera.resetFX();
            this._remAttempts.reset();
            this._targets.reset();
            this._flashFx.reset();
            this._reviveScreen.hide();
            this._reviveCredits = 1;
            this._roundId = -1;
            this._kickOffSet.result = Penalty.eKickOffResult.goal;
            this.startNewRound();
        };
        Play.prototype.resized = function (newGameW, newGameH, oldGameW, oldGameH) {
            var camera = this.camera;
            this.world.setBounds(0, 0, Penalty.Global.GAME_WIDTH, Penalty.Global.GAME_HEIGHT);
            camera.setSize(newGameW, newGameH);
            camera.setPosition((Penalty.Global.GAME_WIDTH - newGameW) >> 1, Math.max(Penalty.Global.GAME_HEIGHT - 72 - newGameH, 0));
            camera.update();
            this._remAttempts.resize();
            this._reviveScreen.resize();
        };
        Play.prototype.onTargetHit = function (pos) {
            var target = this._kickOffSet.target;
            var score = 1;
            if (pos.distance(target.position, false) <= target.radius / 2)
                score = 2;
            if (this._kickOffSet.bonus)
                score *= 2;
            if (score == 4) {
                this._perfectPopup.showMessage("PERFECT", pos.x, pos.y);
                pos.y += 50;
                this._fireBall = true;
            }
            this._scorePopups.showMessage("+" + score, pos.x, pos.y);
            if (Penalty.Global.GAMEE) {
                Gamee2.Gamee.score += score;
            }
            this._targets.hitTarget(target, pos, this._kickOffSet.bonus);
            Utils.AudioUtils.playSound(score == 1 ? "succes1" : "succes2");
            Utils.AudioUtils.playSound("goal");
        };
        Play.prototype.onRoundCompleted = function () {
            var _this = this;
            if (this._remAttempts.remAttampts == 0) {
                if (this._reviveCredits != 0 && (!Gamee2.Gamee.initialized || Gamee2.Gamee.adState == Gamee2.eAdState.ready)) {
                    this._reviveScreen.show(function (res) {
                        _this._reviveScreen.hide();
                        _this.game.tweens.removeAll();
                        _this.game.time.removeAll();
                        if (res) {
                            if (Gamee2.Gamee.adState == Gamee2.eAdState.ready) {
                                Utils.AudioUtils.stopMusic();
                                Gamee2.Gamee.showAd(function (res) {
                                    if (res) {
                                        _this.input.onDown.addOnce(function () { _this.playAmbientSfx(); }, _this);
                                        _this.revive();
                                    }
                                    else {
                                        _this.gameOver();
                                    }
                                }, _this);
                            }
                            else {
                                _this.revive();
                            }
                        }
                        else {
                            _this.gameOver();
                        }
                    }, this);
                    this._state = ePlayState.reviveScreen;
                }
                else {
                    this.gameOver();
                }
            }
            else {
                this.camera.fade(0xFFFFFF, 250, true);
            }
        };
        Play.prototype.revive = function () {
            this._reviveCredits--;
            this._remAttempts.addAttempts(1);
            this.startNewRound();
        };
        Play.prototype.gameOver = function () {
            if (Gamee2.Gamee.initialized) {
                this.game.paused = true;
                Gamee2.Gamee.gameOver();
            }
            else {
                this.reset();
            }
        };
        Play.prototype.roundCompleted = function () {
            this.startNewRound();
            this.camera.flash(0xFFFFFF, 250);
        };
        Play.prototype.startNewRound = function () {
            this.game.tweens.removeAll();
            this.game.time.removeAll();
            this._state = ePlayState.aiming;
            this._touchAiming.reset();
            this._ball.reset(this._fireBall);
            this._player.reset();
            this._keeper.reset();
            this._scorePopups.reset();
            this._perfectPopup.reset();
            this._fireBall = false;
            if (this._kickOffSet.result == Penalty.eKickOffResult.goal) {
                this._targets.newTargets();
                this._roundId++;
            }
            else {
                this._targets.restartTargets();
            }
            if (this._roundId == 0)
                this._touchAiming.showTutorial(0);
        };
        Play.prototype.playAmbientSfx = function () {
            if (this.game.device.webAudio) {
                if (!this.sound.touchLocked) {
                    Utils.AudioUtils.playMusic("ambient", true);
                }
                else {
                    Penalty.Global.setAudioUnlockCallback(function () {
                        Utils.AudioUtils.playMusic("ambient", true);
                    }, this);
                }
            }
        };
        Play.prototype.onGameeStart = function () {
            this.game.paused = false;
            if (Penalty.Global.elapsedTime != 0)
                this.reset();
            this.playAmbientSfx();
        };
        return Play;
    }(Phaser.State));
    Penalty.Play = Play;
})(Penalty || (Penalty = {}));
var Penalty;
(function (Penalty) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preload.prototype.preload = function () {
            var _this = this;
            this.load.baseURL = "assets/";
            this.load.atlasJSONArray("atlas0");
            this.load.json("animPlayer");
            this.load.json("animKeeper");
            this.load.bitmapFont("fntScore");
            if (!this.game.device.webAudio) {
                for (var property in Penalty.Sounds.AUDIO_JSON.spritemap) {
                    this.load.audio(property, property + ".mp3");
                }
            }
            else {
                this.load.audiosprite("sfx", Penalty.Sounds.AUDIO_JSON.resources, null, Penalty.Sounds.AUDIO_JSON);
                this.load.audio("ambient", ["ambient.ogg", "ambient.mp3"]);
            }
            if (Penalty.Global.GAMEE) {
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
            }
        };
        Preload.prototype.create = function () {
            if (!this.game.device.webAudio) {
                for (var property in Penalty.Sounds.AUDIO_JSON.spritemap) {
                    var snd = this.add.audio(property);
                    snd.allowMultiple = true;
                    Utils.AudioUtils.addSfxSound(property, snd);
                }
            }
            else {
                var audioSprite = this.add.audioSprite("sfx");
                for (var property in Penalty.Sounds.AUDIO_JSON.spritemap) {
                    audioSprite.sounds[property].allowMultiple = true;
                }
                Utils.AudioUtils.setSfxAudioSprite(audioSprite);
                Utils.AudioUtils.addMusic("ambient", this.add.audio("ambient"));
            }
        };
        Preload.prototype.update = function () {
            if (!this._gameeInitialized)
                return;
            this.game.state.start("Play");
        };
        return Preload;
    }(Phaser.State));
    Penalty.Preload = Preload;
})(Penalty || (Penalty = {}));
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
    var PopupMessages = (function () {
        function PopupMessages(fontKey, fontSize, moveDistance, moveTime, moveEase) {
            this._messages = null;
            this._fontKey = fontKey;
            this._fontSize = fontSize;
            this._moveDistance = moveDistance;
            this._moveTime = moveTime;
            this._moveEase = moveEase;
        }
        PopupMessages.prototype.addToWorld = function (game) {
            this._messages = game.add.group();
        };
        PopupMessages.prototype.reset = function () {
            if (this._messages != null) {
                this._messages.game.tweens.removeFrom(this._messages);
                this._messages.setAllChildren("exists", false);
            }
        };
        PopupMessages.prototype.showMessage = function (text, x, y) {
            var game = this._messages.game;
            var bmpText = this._messages.getFirstExists(false, false);
            if (bmpText == null) {
                bmpText = this._messages.add(new Phaser.BitmapText(game, x, y, this._fontKey, "", this._fontSize));
            }
            bmpText.text = text;
            bmpText.x = x - (bmpText.width >> 1);
            if (bmpText.x < 0) {
                bmpText.x = 0;
            }
            else if (bmpText.x + bmpText.width > game.camera.x + game.camera.width) {
                bmpText.x = game.camera.x + game.camera.width - bmpText.width;
            }
            bmpText.y = y - (bmpText.height >> 1);
            bmpText.exists = true;
            bmpText.alpha = 1;
            game.add.tween(bmpText).to({
                y: bmpText.y - this._moveDistance
            }, this._moveTime, this._moveEase, true);
            game.add.tween(bmpText).to({ alpha: 0 }, this._moveTime / 2, Phaser.Easing.Cubic.In, true, this._moveTime / 2);
        };
        return PopupMessages;
    }());
    Utils.PopupMessages = PopupMessages;
})(Utils || (Utils = {}));

