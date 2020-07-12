var __extends =
    (this && this.__extends) ||
    function (t, e) {
      function i() {
        this.constructor = t;
      }
      for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
      t.prototype =
        null === e ? Object.create(e) : ((i.prototype = e.prototype), new i());
    },
  JinJang;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.GAMEE = !0),
      (t.DEBUG_GAMEE = !1),
      (t.game = null),
      (t.GAME_WIDTH = 640),
      (t.GAME_HEIGHT = 640),
      (t.MAX_GAME_WIDTH = 640),
      (t.MAX_GAME_HEIGHT = 640),
      (t.scaleX = 1),
      (t.scaleY = 1),
      (t.correctOrientation = !1),
      (t.musicOn = !0),
      (t.soundOn = !0),
      (t.supportedLanguages = []),
      (t.currentLanguage = "en"),
      t
    );
  })();
  t.Global = e;
})(JinJang || (JinJang = {})),
  (window.onload = function () {
    var t = new Gamee.Gamee("OneButton", !0),
      e = new JinJang.Game();
    (JinJang.Global.game = e), t.setGame(e);
  });
var JinJang;
!(function (t) {
  var e = (function (e) {
    function i() {
      var n = Utils.ScreenUtils.calculateScreenMetrics(
        t.Global.GAME_WIDTH,
        t.Global.GAME_HEIGHT,
        Utils.Orientation.PORTRAIT,
        t.Global.MAX_GAME_WIDTH,
        t.Global.MAX_GAME_HEIGHT
      );
      e.call(this, {
        width: n.gameWidth,
        height: n.gameHeight,
        renderer: Phaser.AUTO,
        parent: "content",
        transparent: !1,
        antialias: !0,
        physicsConfig: null,
        preserveDrawingBuffer: !0,
      }),
        (i.game = this),
        this.state.add("Boot", t.Boot),
        this.state.add("Preloader", t.Preloader),
        this.state.add("Menu", t.Menu),
        this.state.add("Play", t.Play),
        this.state.start("Boot");
    }
    return (
      __extends(i, e),
      (i.prototype.onMute = function () {
        Utils.AudioUtils.stopMusic(),
          (t.Global.soundOn = !1),
          (t.Global.musicOn = !1);
      }),
      (i.prototype.onUnmute = function () {
        (t.Global.soundOn = !0), (t.Global.musicOn = !0);
      }),
      i
    );
  })(Phaser.Game);
  t.Game = e;
})(JinJang || (JinJang = {}));
var Gamee;
!(function (t) {
  var e = (function () {
    function t(e, i) {
      void 0 === i && (i = !1),
        (this.onFirstRestart = new Phaser.Signal()),
        (this._onFirstRestartCalled = !1),
        (this._game = null),
        (this._gameeController = null),
        (this._indices = {
          right: 1,
          up: 2,
          left: 4,
          down: 8,
          A: 16,
          B: 32,
          button: 64,
        }),
        (this._pressesCache = 0),
        (this._isDown = 0),
        (this._justDown = 0),
        (this._justUp = 0),
        (this._gameRunning = !1),
        (this._score = 0),
        void 0 !== window.gamee &&
          (null === e ||
            ("Touch" !== e
              ? ((this._gameeController = window.gamee.controller.requestController(
                  e,
                  { enableKeyboard: i }
                )),
                this.keyHandlers())
              : ((this._gameeController = window.gamee.controller.requestController(
                  "Touch"
                )),
                this.touchHandlers()))),
        this.eventHandlers(),
        (t._instance = this);
    }
    return (
      Object.defineProperty(t, "instance", {
        get: function () {
          return null === t._instance, t._instance;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.setGame = function (t) {
        this._game = t;
      }),
      Object.defineProperty(t.prototype, "gameRunning", {
        get: function () {
          return this._gameRunning;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.keyHandlers = function () {
        var t = this;
        this._gameeController.on("keydown", function (e) {
          JinJang.Global.DEBUG_GAMEE && Log.Log.msg("Gamee - keydown"),
            (t._pressesCache |= t._indices[e.button]);
          var i = t._game.state.getCurrentState();
          "function" == typeof i.onGameeButtonDown &&
            i.onGameeButtonDown(e.button);
        }),
          this._gameeController.on("keyup", function (e) {
            t._pressesCache &= ~t._indices[e.button];
            var i = t._game.state.getCurrentState();
            "function" == typeof i.onGameeButtonUp &&
              i.onGameeButtonUp(e.button);
          });
      }),
      (t.prototype.processKeys = function () {
        var t = this._isDown;
        this._isDown = this._pressesCache;
        var e = t ^ this._isDown;
        (this._justDown = e & this._isDown), (this._justUp = e & ~this._isDown);
      }),
      (t.prototype.clearKeys = function () {
        (this._pressesCache = 0),
          (this._isDown = 0),
          (this._justDown = 0),
          (this._justUp = 0);
      }),
      (t.prototype.isDown = function (t) {
        return (this._isDown & this._indices[t]) > 0;
      }),
      (t.prototype.justDown = function (t) {
        return (this._justDown & this._indices[t]) > 0;
      }),
      Object.defineProperty(t.prototype, "anyIsDown", {
        get: function () {
          return this._isDown > 0;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "anyJustDown", {
        get: function () {
          return this._justDown > 0;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.isUp = function (t) {
        return !this.isDown(t);
      }),
      (t.prototype.justUp = function (t) {
        return (this._justUp & this._indices[t]) > 0;
      }),
      (t.prototype.touchHandlers = function () {
        var t = this;
        this._gameeController.on("touchstart", function (e) {
          var i = t._game.state.getCurrentState();
          "function" == typeof i.onGameeTouchStart && i.onGameeTouchStart(e);
        }),
          this._gameeController.on("touchend", function (e) {
            var i = t._game.state.getCurrentState();
            "function" == typeof i.onGameeTouchEnd && i.onGameeTouchEnd(e);
          }),
          this._gameeController.on("touchmove", function (e) {
            var i = t._game.state.getCurrentState();
            "function" == typeof i.onGameeTouchMove && i.onGameeTouchMove(e);
          }),
          this._gameeController.on("touchleave", function (e) {
            var i = t._game.state.getCurrentState();
            "function" == typeof i.onGameeTouchLeave && i.onGameeTouchLeave(e);
          }),
          this._gameeController.on("touchcancel", function (e) {
            var i = t._game.state.getCurrentState();
            "function" == typeof i.onGameeTouchCancel &&
              i.onGameeTouchCancel(e);
          });
      }),
      (t.prototype.eventHandlers = function () {
        var t = this;
        (window.gamee.onPause = function () {
          t.onPause();
        }),
          (window.gamee.onUnpause = function () {
            t.onUnpause();
          }),
          (window.gamee.onRestart = function () {
            t.onRestart();
          }),
          (window.gamee.onMute = function () {
            t._game.onMute();
          }),
          (window.gamee.onUnmute = function () {
            t._game.onUnmute();
          });
      }),
      (t.prototype.onPause = function () {
        var t = this._game.state.getCurrentState();
        "function" == typeof t.onGameePause && t.onGameePause();
      }),
      (t.prototype.onUnpause = function () {
        var t = this._game.state.getCurrentState();
        "function" == typeof t.onGameeUnpause && t.onGameeUnpause();
      }),
      (t.prototype.onRestart = function () {
        this._onFirstRestartCalled ||
          (this.onFirstRestart.dispatch(), (this._onFirstRestartCalled = !0)),
          JinJang.Global.DEBUG_GAMEE && Log.Log.msg("Gamee - onRestart");
        var t = this._game.state.getCurrentState();
        "function" == typeof t.onGameeRestart && t.onGameeRestart();
      }),
      Object.defineProperty(t.prototype, "score", {
        get: function () {
          return this._score;
        },
        set: function (t) {
          (this._score = t), (window.gamee.score = t);
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.addScore = function (t) {
        this.score += t;
      }),
      (t.prototype.gameStart = function () {
        return (
          JinJang.Global.DEBUG_GAMEE && Log.Log.msg("Gamee - game start"),
          this._gameRunning
            ? void (
                JinJang.Global.DEBUG_GAMEE &&
                Log.Log.msg(
                  "Gamee - game start - Gamee game is already running"
                )
              )
            : ((this._gameRunning = !0), void window.gamee.gameStart())
        );
      }),
      (t.prototype.gameOver = function () {
        return (
          JinJang.Global.DEBUG_GAMEE && Log.Log.msg("Gamee - game over"),
          this._gameRunning
            ? ((this._gameRunning = !1), void window.gamee.gameOver())
            : void (
                JinJang.Global.DEBUG_GAMEE &&
                Log.Log.msg("Gamee - game over - Gamee game is not running")
              )
        );
      }),
      (t._instance = null),
      t
    );
  })();
  t.Gamee = e;
})(Gamee || (Gamee = {}));
var Log;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.msg = function (e) {
        var i = t.messages;
        if (i.length < t.MAX_LINE) t.messages.push(e);
        else {
          for (var n = 1; n < t.MAX_LINE; n++) i[n - 1] = i[n];
          i[t.MAX_LINE - 1] = e;
        }
      }),
      (t.render = function (e) {
        for (var i = t.messages, n = 0; n < i.length; n++)
          e.text(i[n], 50, 70 + 16 * n, "RGB(255, 0, 0)");
      }),
      (t.MAX_LINE = 20),
      (t.messages = []),
      t
    );
  })();
  t.Log = e;
})(Log || (Log = {}));
var JinJang;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.call(this);
    }
    return (
      __extends(e, t),
      (e.prototype.init = function () {
        (this.input.maxPointers = 1), (this.stage.disableVisibilityChange = !0);
        var t = Utils.ScreenUtils.screenMetrics;
        this.game.device.desktop
          ? ((this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE),
            this.scale.setMinMax(
              0.25 * this.game.width,
              0.25 * this.game.height,
              2.5 * this.game.width,
              2.5 * this.game.height
            ),
            this.scale.setUserScale(t.scaleX, t.scaleY),
            (this.scale.pageAlignHorizontally = !0),
            (this.scale.pageAlignVertically = !0),
            this.scale.setResizeCallback(this.gameResized, this))
          : ((this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE),
            this.scale.setUserScale(t.scaleX, t.scaleY),
            (this.scale.pageAlignHorizontally = !0),
            (this.scale.pageAlignVertically = !0),
            this.scale.setResizeCallback(this.gameResized, this),
            this.scale.onOrientationChange.add(this.orientationChange, this)),
          this.orientationChange(this.scale, "", !0);
      }),
      (e.prototype.create = function () {
        this.game.state.start("Preloader", !0, !1);
      }),
      (e.prototype.gameResized = function (t, e) {}),
      (e.prototype.orientationChange = function (t, e, i) {}),
      e
    );
  })(Phaser.State);
  t.Boot = e;
})(JinJang || (JinJang = {}));
var JinJang;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.call(this);
    }
    return (
      __extends(e, t),
      (e.prototype.create = function () {
        this.stage.backgroundColor = 6344912;
        var t = this.add.button(
          this.world.centerX,
          this.world.centerY,
          "Sprites",
          function () {
            this.game.state.start("Play", !0, !1);
          },
          this,
          "DotLeft",
          "DotLeft",
          "DotLeft",
          "DotLeft",
          this.world
        );
        t.anchor.setTo(0.5, 0.5), t.scale.set(3, 3);
      }),
      e
    );
  })(Phaser.State);
  t.Menu = e;
})(JinJang || (JinJang = {}));
var JinJang;
!(function (t) {
  var e = (function (e) {
    function i() {
      e.call(this),
        (this._bgType = "RenderTexture"),
        (this._bgSpeed = 0),
        (this._collCurve = []),
        (this._mainLead = [new Phaser.Point(), new Phaser.Point()]),
        (this._curve = [
          new Phaser.Point(),
          new Phaser.Point(),
          new Phaser.Point(),
          new Phaser.Point(),
        ]),
        (this._curvePoint = new Phaser.Point()),
        (this._ballsGroupSpeed = 0),
        (this._collOffsetX = []),
        (this._collOffsetY = []),
        (this._gameOver = !1),
        (this._runFromRestart = !1),
        (this._downHill = !0),
        (this._lineSpritesLeft = []),
        (this._lineSpritesRight = []),
        (this._lineAntialias = []);
    }
    return (
      __extends(i, e),
      (i.prototype.create = function () {
        this.createBalls(),
          this.createEmitter(),
          (this._linesGroup = new Phaser.Group(this.game, null, "linesGroup"));
        for (var e = 0; 640 > e; e++) {
          var i = new Phaser.Sprite(this.game, 0, 0, "Sprites", "Left");
          (i.cropRect = new Phaser.Rectangle(0, 0, 1, 1)),
            this._lineSpritesLeft.push(i);
          var n = new Phaser.Sprite(this.game, 0, 0, "Sprites", "Right");
          (n.cropRect = new Phaser.Rectangle(0, 0, 1, 1)),
            this._lineSpritesRight.push(n),
            this._linesGroup.add(i),
            this._linesGroup.add(n);
        }
        for (var e = 0; 640 > e; e++) {
          var s = new Phaser.Sprite(this.game, 0, 0, "Sprites", "Antialias");
          (s.cropRect = new Phaser.Rectangle(0, 0, 1, 1)),
            s.anchor.set(0.5, 0),
            this._lineAntialias.push(s),
            this._linesGroup.add(s);
        }
        this.game.renderType === Phaser.WEBGL
          ? (this._bgType = "RenderTexture")
          : (this._bgType = "BtimapData"),
          "RenderTexture" == this._bgType
            ? (this._bg = this.game.add.renderTexture(
                t.Global.GAME_WIDTH,
                t.Global.GAME_HEIGHT
              ))
            : (this._bg = this.game.add.bitmapData(
                t.Global.GAME_WIDTH,
                t.Global.GAME_HEIGHT
              )),
          (this._screenSprite1 = this.game.add.sprite(0, 0, this._bg)),
          (this._screenSprite2 = this.game.add.sprite(0, 0, this._bg)),
          t.Global.GAMEE || this.game.input.onDown.add(this.onTouch, this),
          this.reset();
      }),
      (i.prototype.onGameePause = function () {
        this.game.paused = !0;
      }),
      (i.prototype.onGameeUnpause = function () {
        this.game.paused = !1;
      }),
      (i.prototype.onGameeRestart = function () {
        (t.Global.game.paused = !1),
          Gamee.Gamee.instance.gameOver(),
          this.reset(),
          Gamee.Gamee.instance.gameStart(),
          Utils.AudioUtils.playSound("click");
      }),
      (i.prototype.onGameeButtonDown = function (t) {
        var e = Gamee.Gamee.instance;
        e.gameRunning || Utils.AudioUtils.playSound("click"),
          (this._buttonDown = !0);
      }),
      (i.prototype.reset = function () {
        var e = 0 === this.rnd.between(0, 1) ? -1 : 1;
        (this._difficulty = 0),
          (this._gameTime = 0),
          (this._lastTimeStep = 0),
          this.initCurve(e),
          this.updateBG(0, 640),
          (this._bgSpeed = i.SPEED_MIN),
          (this._bgOffset = 640),
          (this._bgSpeedCumulative = 0),
          this.setScreenSprites(this._bgOffset),
          this.world.bringToTop(this._ballsGroup),
          (this._ballsGroupDir = e),
          (this._ballsGroupSpeed = i.SPEED_MIN),
          (this._ballDistFromGroupCenter = i.BALLS_GROUP_DIST_X_MAX / 2),
          this._rightBall.scale.setTo(1, 1),
          (this._rightBall.alpha = 1),
          this._leftBall.scale.setTo(1, 1),
          (this._leftBall.alpha = 1),
          (this._ballsGroup.y = i.BALLS_POSITION_Y),
          (this._ballsGroup.x = t.Global.GAME_WIDTH / 2),
          (this._gameOver = !1),
          (this._buttonDown = !1),
          (this._score = 0),
          t.Global.GAMEE && (Gamee.Gamee.instance.score = 0),
          (this.waitForMusicDecode = !0);
      }),
      (i.prototype.checkMusic = function () {
        this.waitForMusicDecode &&
          this.game.cache.isSoundDecoded("MusicStart") &&
          ((this.waitForMusicDecode = !1),
          Utils.AudioUtils.stopMusic(),
          Utils.AudioUtils.playMusic("MusicStart"));
      }),
      (i.prototype.update = function () {
        if (
          (this.checkMusic(),
          !this._gameOver &&
            (t.Global.GAMEE &&
              !Gamee.Gamee.instance.gameRunning &&
              this._buttonDown &&
              Gamee.Gamee.instance.gameStart(),
            !t.Global.GAMEE ||
              (t.Global.GAMEE && Gamee.Gamee.instance.gameRunning)))
        ) {
          this._buttonDown && this.onTouch(null, null);
          var e = this.collision();
          if (null !== e) {
            (this._gameOver = !0), Utils.AudioUtils.playSound("explosion");
            var n = this.game.add
              .tween(e)
              .to({ alpha: 0 }, 1e3, Phaser.Easing.Cubic.Out, !0);
            this.game.add
              .tween(e.scale)
              .to({ x: 2, y: 2 }, 800, Phaser.Easing.Cubic.Out, !0),
              n.onComplete.add(function () {
                t.Global.GAMEE &&
                  ((this._runFromRestart = !0),
                  Gamee.Gamee.instance.gameOver()),
                  this._rightBall.scale.setTo(1, 1),
                  (this._rightBall.alpha = 1),
                  this._leftBall.scale.setTo(1, 1),
                  (this._leftBall.alpha = 1),
                  (this._ballsGroup.y = i.BALLS_POSITION_Y),
                  (this._ballsGroup.x = t.Global.GAME_WIDTH / 2),
                  (this._leftBall.x = -i.BALLS_GROUP_DIST_X_MAX / 2),
                  (this._rightBall.x = i.BALLS_GROUP_DIST_X_MAX / 2),
                  t.Global.GAMEE || this.reset();
              }, this);
          }
          (this._ballsGroup.x +=
            this._ballsGroupDir *
            (this._ballsGroupSpeed * this.game.time.physicsElapsed)),
            (this._bgSpeedCumulative +=
              this._bgSpeed * this.game.time.physicsElapsed);
          var s = Math.floor(this._bgSpeedCumulative);
          if (s > 0) {
            (this._bgSpeedCumulative -= s),
              this.updateBG(this._bgOffset, s),
              (this._bgOffset += s),
              this.setScreenSprites(this._bgOffset);
            var a = Math.floor((this._bgOffset - 640) / 100);
            a > this._score &&
              (t.Global.GAMEE && (Gamee.Gamee.instance.score = a),
              (this._score = a));
          }
          (this._gameTime += this.game.time.physicsElapsed),
            this.adjustDifficulty();
        }
      }),
      (i.prototype.onTouch = function (t, e) {
        this._gameOver ||
          ((this._ballsGroupDir *= -1), Utils.AudioUtils.playSound("click")),
          (this._buttonDown = !1);
      }),
      (i.prototype.updateBG = function (e, n) {
        for (var s = 0; s < this._lineSpritesLeft.length; s++)
          this._lineSpritesLeft[s].kill(),
            this._lineSpritesRight[s].kill(),
            this._lineAntialias[s].kill();
        for (var a = 0, s = e; e + n > s; s++) {
          var o = t.Global.GAME_HEIGHT - 1 - (s % t.Global.GAME_HEIGHT),
            r = i.BG_SPRITE_HEIGHT - 1 - (s % i.BG_SPRITE_HEIGHT),
            l = this.getCurveX(s);
          (this._collCurve[o] = l), (l += t.Global.GAME_WIDTH / 2);
          var u = this._lineSpritesLeft[a];
          u.reset(0, o),
            u.cropRect.setTo(0, r, l, 1),
            u.updateCrop(),
            (u = this._lineSpritesRight[a]),
            u.reset(l, o),
            u.cropRect.setTo(
              i.BG_SPRITE_WIDTH - (t.Global.GAME_WIDTH - l),
              r,
              t.Global.GAME_WIDTH - l,
              1
            ),
            u.updateCrop(),
            (u = this._lineAntialias[a++]);
          var h = Math.floor(l),
            c = Math.floor(10 * l) % 10;
          u.reset(h + 5, o), (u.cropRect.x = c), u.updateCrop();
        }
        "RenderTexture" == this._bgType
          ? this._bg.renderXY(this._linesGroup, 0, 0)
          : (this._bg.drawGroup(this._linesGroup), (this._bg.dirty = !0));
      }),
      (i.prototype.setScreenSprites = function (e) {
        (this._screenSprite1.y = this._bgOffset % t.Global.GAME_HEIGHT),
          (this._screenSprite2.y =
            this._screenSprite1.y - t.Global.GAME_HEIGHT);
      }),
      (i.prototype.createBalls = function () {
        this.createBallSprites(), this.createBallCollisions();
      }),
      (i.prototype.createEmitter = function () {}),
      (i.prototype.burstParticles = function (t) {}),
      (i.prototype.createBallSprites = function () {
        (this._ballsGroup = this.add.group()),
          (this._ballsGroup.y = i.BALLS_POSITION_Y),
          (this._ballsGroup.x = t.Global.GAME_WIDTH / 2),
          (this._leftBall = this.add.sprite(
            -i.BALLS_GROUP_DIST_X_MAX / 2,
            0,
            "Sprites",
            "DotLeft",
            this._ballsGroup
          )),
          this._leftBall.anchor.setTo(0.5, 0.5),
          (this._rightBall = this.add.sprite(
            i.BALLS_GROUP_DIST_X_MAX / 2,
            0,
            "Sprites",
            "DotRight",
            this._ballsGroup
          )),
          this._rightBall.anchor.setTo(0.5, 0.5);
      }),
      (i.prototype.createBallCollisions = function () {
        for (
          var t = this.cache.getFrameByName("Sprites", "DotLeft"),
            e = Math.floor(t.width / 2),
            n = (2 * Math.PI) / i.COLLISION_POINTS - 1,
            s = 0,
            a = Math.PI / 2;
          s < i.COLLISION_POINTS - 1;
          s++, a -= n
        )
          (this._collOffsetX[s] = Math.floor(Math.cos(a) * e)),
            (this._collOffsetY[s] = Math.floor(Math.sin(a) * e));
        (this._collOffsetX[i.COLLISION_POINTS - 1] = this._collOffsetX[0]),
          (this._collOffsetY[i.COLLISION_POINTS - 1] = this._collOffsetY[0]);
      }),
      (i.prototype.collision = function () {
        return this.ballCurveCollision(
          this._leftBall,
          0,
          (i.COLLISION_POINTS - 1) / 2,
          !0
        )
          ? this._leftBall
          : this.ballCurveCollision(
              this._rightBall,
              (i.COLLISION_POINTS - 1) / 2,
              i.COLLISION_POINTS - 1,
              !1
            )
          ? this._rightBall
          : null;
      }),
      (i.prototype.ballCurveCollision = function (e, n, s, a) {
        for (
          var o = e.x + this._ballsGroup.x - t.Global.GAME_WIDTH / 2,
            r =
              t.Global.GAME_HEIGHT -
              ((this._bgOffset - i.BALLS_POSITION_Y) % t.Global.GAME_HEIGHT),
            l = n;
          s >= l;
          l++
        ) {
          var u = this._collOffsetX[l],
            h = this._collOffsetY[l],
            c = this._collCurve[(r + h) % t.Global.GAME_HEIGHT];
          if ((a && o + u > c) || (!a && c > o + u)) return !0;
        }
        return !1;
      }),
      (i.prototype.adjustDifficulty = function () {
        var t = Math.floor(this._gameTime / i.DIFFICULTY_STEP);
        t > this._lastTimeStep &&
          (this._difficulty = 1 - Math.pow(i.DIFFICULTY_COEF, t));
        var e =
            (i.BALLS_GROUP_DIST_X_MAX - i.BALLS_GROUP_DIST_X_MIN) *
              (1 - this._difficulty) +
            i.BALLS_GROUP_DIST_X_MIN,
          n =
            Math.sin(2 * Math.PI * this._gameTime * i.BALLS_GROUP_DIST_FREQ) *
            i.BALLS_GROUP_DIST_SIN_AMPLITUDE;
        (n = Phaser.Math.clamp(
          n,
          -i.BALLS_GROUP_DIST_AMPLITUDE,
          i.BALLS_GROUP_DIST_AMPLITUDE
        )),
          (this._ballDistFromGroupCenter = (e - n * this._difficulty) / 2),
          (this._leftBall.x = -this._ballDistFromGroupCenter),
          (this._rightBall.x = this._ballDistFromGroupCenter);
        var s = i.SPEED_MIN + (i.SPEED_MAX - i.SPEED_MIN) * this._difficulty;
        (this._ballsGroupSpeed = s), (this._bgSpeed = s);
      }),
      (i.prototype.initCurve = function (e) {
        (this._nextLeadPoint = this.selectLeadPointMethod()),
          (this._nextCurvePoint = this.selectCurvePointMethod()),
          (this._getCurvePoint = this.selectGetPointMethod()),
          this._mainLead[0].setTo(0, 0),
          this._mainLead[1].setTo(0, t.Global.GAME_HEIGHT / 2),
          this._curve[0].setTo(0, -t.Global.GAME_HEIGHT / 4),
          this._curve[1].setTo(0, 0),
          this._curve[2].setTo(0, t.Global.GAME_HEIGHT / 4),
          this._curve[3].setTo(0, t.Global.GAME_HEIGHT / 2),
          (this._curveProgress = 0);
      }),
      (i.prototype.getCurveX = function (e) {
        var n = 1;
        e > this._curve[2].y &&
          (this.nextCurvePoint(), (this._curveProgress = 0)),
          (n = 1 / (4 * (this._curve[2].y - this._curve[1].y)));
        for (
          var s = this._getCurvePoint(this._curve, this._curveProgress);
          Math.floor(s.y) < e;

        )
          (this._curveProgress += n),
            (s = this._getCurvePoint(this._curve, this._curveProgress));
        return (
          (s.x = Phaser.Math.clamp(
            s.x,
            -t.Global.GAME_WIDTH / 2 + i.MIN_CURVE_BORDER_DIST,
            t.Global.GAME_WIDTH / 2 - i.MIN_CURVE_BORDER_DIST
          )),
          s.x
        );
      }),
      (i.prototype.nextCurvePoint = function () {
        this._nextCurvePoint();
      }),
      (i.prototype.getLeadPoint = function (t) {
        t > this._mainLead[1].y && this.nextLeadPoint();
        var e = this._mainLead[this._mainLead.length - 1],
          i = this._mainLead[this._mainLead.length - 2];
        return ((t - i.y) / (e.y - i.y)) * (e.x - i.x) + i.x;
      }),
      (i.prototype.nextLeadPoint = function () {
        this.shiftPointsArray(this._mainLead);
        var t = this._mainLead[this._mainLead.length - 1],
          e = this._mainLead[this._mainLead.length - 2];
        this._nextLeadPoint(t, e);
      }),
      (i.prototype.shiftPointsArray = function (t) {
        for (var e = t[0], i = 1; i < t.length; i++) t[i - 1] = t[i];
        t[t.length - 1] = e;
      }),
      (i.prototype.getCurvePointCosine2 = function (t, e) {
        var i = t[1],
          n = t[2],
          s = (i.x - n.x) / 2,
          a = n.x + s,
          o = 0;
        return (
          (o =
            i.x > n.x
              ? Math.cos(Math.PI * e) * Math.abs(s)
              : Math.cos(Math.PI + Math.PI * e) * Math.abs(s)),
          (this._curvePoint.x = a + o),
          (this._curvePoint.y = i.y + e * (n.y - i.y)),
          this._curvePoint
        );
      }),
      (i.prototype.selectLeadPointMethod = function () {
        return function (t, e) {
          t.setTo(0, e.y + 600);
        };
      }),
      (i.prototype.selectCurvePointMethod = function () {
        var e = 100;
        return function () {
          this.shiftPointsArray(this._curve);
          var i = this._curve[this._curve.length - 1],
            n = this._curve[this._curve.length - 2],
            s = n.x,
            a = n.y,
            o = 0,
            r = 0;
          do
            (o = this.rnd.between(
              Math.floor(25 * (1 + this._difficulty)),
              Math.floor(100 + 100 * (2 * this._difficulty))
            )),
              (o = Phaser.Math.clamp(o, 0.5 * e, 2 * e)),
              ++r > 5 && (this._downHill = !this._downHill);
          while (
            (this._downHill && s + 2 * o > t.Global.GAME_WIDTH / 2 - 128) ||
            (!this._downHill && s - 2 * o < -t.Global.GAME_WIDTH / 2 + 128)
          );
          (e = o),
            this._downHill || (o *= -1),
            this.rnd.between(0, 9) < 7 && (this._downHill = !this._downHill);
          var l = s + 2 * o,
            u = a + Math.abs(this.rnd.realInRange(2.8, 3.5) * o);
          0 === this.rnd.between(0, 9) &&
            ((l = s),
            (u =
              a + Math.min(200, Math.abs(this.rnd.realInRange(2.8, 3.5) * o)))),
            i.setTo(l, u);
        };
      }),
      (i.prototype.outOfRange = function (e, n) {
        var s = Math.max(0, n - 225) / 1e3;
        return (
          e + t.Global.GAME_WIDTH / 2 < i.MIN_CURVE_BORDER_DIST * (1.5 + s) ||
          e + t.Global.GAME_WIDTH / 2 >
            t.Global.GAME_WIDTH - i.MIN_CURVE_BORDER_DIST * (1.5 + s)
        );
      }),
      (i.prototype.selectGetPointMethod = function () {
        return this.getCurvePointCosine2;
      }),
      (i.DIFFICULTY_COEF = 0.96),
      (i.DIFFICULTY_STEP = 1),
      (i.SPEED_MIN = 130),
      (i.SPEED_MAX = 192),
      (i.BALLS_GROUP_DIST_X_MAX = 200),
      (i.BALLS_GROUP_DIST_X_MIN = 150),
      (i.BALLS_GROUP_DIST_AMPLITUDE = 30),
      (i.BALLS_GROUP_DIST_SIN_AMPLITUDE = 40),
      (i.BALLS_GROUP_DIST_FREQ = 0.1),
      (i.BALLS_POSITION_Y = 580),
      (i.MIN_CURVE_BORDER_DIST = 100),
      (i.BG_SPRITE_WIDTH = 512),
      (i.BG_SPRITE_HEIGHT = 512),
      (i.COLLISION_POINTS = 17),
      i
    );
  })(Phaser.State);
  t.Play = e;
})(JinJang || (JinJang = {}));
var JinJang;
!(function (t) {
  var e = (function (e) {
    function i() {
      e.call(this), (this._ready = !1);
    }
    return (
      __extends(i, e),
      (i.prototype.preload = function () {
        this.load.atlas("Sprites", "assets/Sprites.png", "assets/Sprites.json"),
          this.load.json("Config", "assets/config.json"),
          this.load.audio("SFX", ["assets/sfx.ogg", "assets/sfx.m4a"]),
          this.load.audio("MusicStart", [
            "assets/musicBasic.ogg",
            "assets/musicBasic.m4a",
          ]),
          this.load.audio("MusicLoop", [
            "assets/musicFull.ogg",
            "assets/musicFull.m4a",
          ]);
      }),
      (i.prototype.loadUpdate = function () {
        this.setLoadingText(this.load.progress);
      }),
      (i.prototype.create = function () {
        (this.stage.backgroundColor = 16185078),
          this.setLoadingText(100),
          this.readConfig();
        var t = this.add.audio("MusicStart"),
          e = this.add.audio("MusicLoop");
        (t.volume = 1),
          (e.volume = 1),
          t.onLoop.add(function () {
            this.cache.isSoundDecoded("MusicLoop") &&
              (t.stop(), Utils.AudioUtils.playMusic("MusicLoop", !0));
          }, this),
          Utils.AudioUtils.addMusic("MusicStart", t),
          Utils.AudioUtils.addMusic("MusicLoop", e);
        var i = this.add.audio("SFX");
        Utils.AudioUtils.setSounds(i), (i.allowMultiple = !0);
        var n = 0;
        if (this.game.device.ie && this.game.device.ieVersion <= 10)
          var n = 0.02;
        i.addMarker("click", 0, 0.5),
          i.addMarker("explosion", 1.9 - n, 0.8 + n);
      }),
      (i.prototype.readConfig = function () {
        var e = this.game.cache.getJSON("Config");
        void 0 !== e.difficultyCoef &&
          (t.Play.DIFFICULTY_COEF = e.difficultyCoef),
          void 0 !== e.difficultyStep &&
            (t.Play.DIFFICULTY_STEP = e.difficultyStep),
          void 0 !== e.speedMin && (t.Play.SPEED_MIN = e.speedMin),
          void 0 !== e.speedMax && (t.Play.SPEED_MAX = e.speedMax),
          void 0 !== e.ballsDistMax &&
            (t.Play.BALLS_GROUP_DIST_X_MAX = e.ballsDistMax),
          void 0 !== e.ballsDistMin &&
            (t.Play.BALLS_GROUP_DIST_X_MIN = e.ballsDistMin),
          void 0 !== e.ballsDistAmplitude &&
            (t.Play.BALLS_GROUP_DIST_AMPLITUDE = e.ballsDistAmplitude),
          void 0 !== e.ballsDistSinAmplitude &&
            (t.Play.BALLS_GROUP_DIST_SIN_AMPLITUDE = e.ballsDistSinAmplitude),
          void 0 !== e.ballDistSinFreq &&
            (t.Play.BALLS_GROUP_DIST_FREQ = e.ballDistSinFreq),
          void 0 !== e.ballsY && (t.Play.BALLS_POSITION_Y = e.ballsY),
          void 0 !== e.explodeParticlesCount;
      }),
      (i.prototype.update = function () {
        this._ready === !1 &&
          ((this._ready = !0),
          t.Global.GAMEE
            ? this.game.state.start("Play")
            : this.game.state.start("Play"));
      }),
      (i.prototype.setLoadingText = function (t) {}),
      i
    );
  })(Phaser.State);
  t.Preloader = e;
})(JinJang || (JinJang = {}));
var Utils;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.setSounds = function (e) {
        t._sfx = e;
      }),
      (t.playSound = function (e) {
        JinJang.Global.soundOn && null !== t._sfx && t._sfx.play(e);
      }),
      (t.addMusic = function (e, i) {
        t._music[e] = i;
      }),
      (t.playMusic = function (e, i) {
        if (
          (void 0 === i && (i = !0),
          t._currentMusic !== e &&
            (null !== t._currentMusic &&
              t._currentMusic.length > 0 &&
              t.stopMusic(),
            e in t._music && JinJang.Global.musicOn))
        ) {
          t._currentMusic = e;
          var n = t._music[e];
          (n.loop = i), n.play();
        }
      }),
      (t.stopMusic = function () {
        null !== t._currentMusic &&
          t._currentMusic.length > 0 &&
          (t._music[t._currentMusic].stop(), (t._currentMusic = ""));
      }),
      (t.pauseMusic = function () {
        null !== t._currentMusic &&
          t._currentMusic.length > 0 &&
          t._music[t._currentMusic].pause();
      }),
      (t.resumeMusic = function () {
        null !== t._currentMusic &&
          t._currentMusic.length > 0 &&
          t._music[t._currentMusic].resume();
      }),
      (t._sfx = null),
      (t._music = {}),
      (t._currentMusic = ""),
      t
    );
  })();
  t.AudioUtils = e;
})(Utils || (Utils = {}));
var Utils;
!(function (t) {
  var e = (function () {
    function t() {}
    return t;
  })();
  (t.ScreenMetrics = e),
    (function (t) {
      (t[(t.PORTRAIT = 0)] = "PORTRAIT"), (t[(t.LANDSCAPE = 1)] = "LANDSCAPE");
    })(t.Orientation || (t.Orientation = {}));
  var i = t.Orientation,
    n = (function () {
      function t() {}
      return (
        (t.calculateScreenMetrics = function (t, n, s, a, o) {
          void 0 === s && (s = i.LANDSCAPE);
          var r, l;
          (r = window.innerWidth),
            (l = window.innerHeight),
            (r = Math.min(r, 1.5 * t)),
            (l = Math.min(l, 1.5 * n)),
            ("undefined" == typeof a || "undefined" == typeof o) &&
              (s === i.LANDSCAPE
                ? ((a = Math.round((640 * t) / 640)),
                  (o = Math.round((640 * n) / 640)))
                : ((a = Math.round((640 * t) / 640)),
                  (o = Math.round((640 * n) / 640))));
          var u = (s === i.LANDSCAPE, 1),
            h = r / l,
            c = 0,
            _ = 0,
            g = 0,
            p = 0;
          h > u
            ? ((p = n),
              (g = 2 * Math.ceil((p * h) / 2)),
              (g = Math.min(g, a)),
              (c = (g - t) / 2),
              (_ = 0))
            : ((g = t),
              (p = 2 * Math.ceil(g / h / 2)),
              (p = Math.min(p, o)),
              (c = 0),
              (_ = (p - n) / 2));
          var d = r / g,
            f = l / p;
          return (
            (this.screenMetrics = new e()),
            (this.screenMetrics.windowWidth = r),
            (this.screenMetrics.windowHeight = l),
            (this.screenMetrics.defaultGameWidth = t),
            (this.screenMetrics.defaultGameHeight = n),
            (this.screenMetrics.maxGameWidth = a),
            (this.screenMetrics.maxGameHeight = o),
            (this.screenMetrics.gameWidth = g),
            (this.screenMetrics.gameHeight = p),
            (this.screenMetrics.scaleX = d),
            (this.screenMetrics.scaleY = f),
            (this.screenMetrics.offsetX = c),
            (this.screenMetrics.offsetY = _),
            this.screenMetrics
          );
        }),
        t
      );
    })();
  t.ScreenUtils = n;
})(Utils || (Utils = {}));
var Utils;
!(function (t) {
  var e = (function () {
      function t() {}
      return t;
    })(),
    i = (function () {
      function t() {}
      return (
        (t.save = function () {
          if (t.localStorageSupported()) {
            var i = new e();
            (i.musicOn = JinJang.Global.musicOn),
              (i.soundOn = JinJang.Global.soundOn),
              (i.currentLanguage = JinJang.Global.currentLanguage);
            var n = JSON.stringify(i);
            localStorage.setItem("woodventure_save", n);
          }
        }),
        (t.load = function () {
          if (t.localStorageSupported()) {
            var e = JSON.parse(localStorage.getItem("woodventure_save"));
            null === e ||
              "undefined" === e ||
              ((JinJang.Global.musicOn = e.musicOn),
              (JinJang.Global.soundOn = e.soundOn),
              (JinJang.Global.currentLanguage = e.currentLanguage));
          }
        }),
        (t.localStorageSupported = function () {
          try {
            return "localStorage" in window && null !== window.localStorage;
          } catch (t) {
            return !1;
          }
        }),
        t
      );
    })();
  t.StorageUtils = i;
})(Utils || (Utils = {}));
var Utils;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.padNumber = function (t, e, i) {
        void 0 === i && (i = "0");
        var n = t + "";
        return n.length >= e ? n : new Array(e - n.length + 1).join(i) + n;
      }),
      t
    );
  })();
  t.StringUtils = e;
})(Utils || (Utils = {}));
var Utils;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.setTexts = function (e) {
        t._texts = e;
      }),
      (t.getText = function (e) {
        if (null === t._texts) return "Texts not set";
        var i = t._texts;
        if (void 0 === i[e]) return "";
        var n = i[e][JinJang.Global.currentLanguage];
        return (
          void 0 === n &&
            ((JinJang.Global.currentLanguage = "en"),
            (n = i[e][JinJang.Global.currentLanguage])),
          n
        );
      }),
      (t.game = null),
      (t._texts = null),
      t
    );
  })();
  t.TextUtils = e;
})(Utils || (Utils = {}));
