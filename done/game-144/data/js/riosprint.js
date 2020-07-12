var Gamee;
!(function (t) {
  var e = (function () {
    function t(e, i) {
      void 0 === i && (i = !1),
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
          ("Touch" !== e
            ? ((this._gameeController = window.gamee.controller.requestController(
                e,
                { enableKeyboard: i }
              )),
              this.keyHandlers())
            : ((this._gameeController = window.gamee.controller.requestController(
                "Touch"
              )),
              this.touchHandlers())),
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
          t._pressesCache |= t._indices[e.button];
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
        this._gameRunning ||
          (window.gamee.gameStart(), (this._gameRunning = !0));
      }),
      (t.prototype.gameOver = function () {
        this._gameRunning &&
          (window.gamee.gameOver(), (this._gameRunning = !1));
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
        t.messages.push(e);
      }),
      (t.messages = []),
      t
    );
  })();
  t.Log = e;
})(Log || (Log = {}));
var Helper;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.randomizeArray = function (t, e, i, n) {
        void 0 === i && (i = !1), void 0 === n && (n = !1);
        var r = i ? e.slice() : e;
        return Phaser.ArrayUtils.shuffle(r), n ? r.slice(0, t) : r;
      }),
      (t.sort = function (e, i, n, r) {
        if ((void 0 === n && (n = 0), void 0 === r && (r = e.length), r > n)) {
          for (var s, a = n, o = n + 1; r >= o; o++)
            i(e[n], e[o]) > 0 && ((s = e[++a]), (e[a] = e[o]), (e[o] = s));
          (s = e[n]),
            (e[n] = e[a]),
            (e[a] = s),
            t.sort(e, i, n, a - 1),
            t.sort(e, i, a + 1, r);
        }
      }),
      t
    );
  })();
  t.ArrayUtils = e;
})(Helper || (Helper = {}));
var Helper;
!(function (t) {
  var e;
  !(function (t) {
    function e(t, e, i) {
      var n = t * Math.PI * 2 * e,
        r = t * (2 * Math.PI * i + Math.PI / 2);
      return Math.sin(n) * Math.cos(r);
    }
    function i(t, e, i) {
      var n = t * Math.PI * 2 * e,
        r = -t * i;
      return Math.sin(n) * Math.exp(r);
    }
    function n(t) {
      return -2 * t * t + 3 * t;
    }
    function r(t) {
      return -(n(1 - t) - 1);
    }
    function s(t) {
      return Math.sin(2 * t * Math.PI);
    }
    function a(t) {
      return Math.sin(t * Math.PI);
    }
    function o(t, e) {
      return Math.sin(2 * t * Math.PI * e);
    }
    (t.wiggle = e),
      (t.sinWithExpDecay = i),
      (t.pop5 = n),
      (t.pop5rev = r),
      (t.sin = s),
      (t.halfSin = a),
      (t.sinWithPeriod = o);
  })((e = t.Easing || (t.Easing = {})));
})(Helper || (Helper = {}));
var Helper;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.create = function (e, i, n, r, s, a, o, h, p, l) {
        return (
          void 0 === a && (a = 0),
          void 0 === o && (o = 0),
          void 0 === h && (h = 0),
          void 0 === p && (p = 0),
          void 0 === l && (l = !1),
          (t._image = new Phaser.Image(e, 0, 0, r)),
          "string" == typeof s
            ? (t._frame = e.cache.getFrameByName(r, s))
            : (t._frame = e.cache.getFrameByIndex(r, s)),
          t.calculateNineImage(i, n, a, o, h, p, l),
          (t._nineImage = new Phaser.BitmapData(
            e,
            "NineImage" + t._textureKey++,
            t._width,
            t._height
          )),
          t.renderNineImage(),
          t._nineImage
        );
      }),
      (t.calculateNineImage = function (e, i, n, r, s, a, o) {
        var h = t._frame;
        if (
          ((t._centralWidth = h.width - r - a),
          (t._centralHeight = h.height - n - s),
          o)
        )
          (t._horizontalRepeats = e),
            (t._verticalRepeats = i),
            (t._width = r + a + t._centralWidth * e),
            (t._height = n + s + t._centralHeight * i),
            (t._lastWidth = 0),
            (t._lastHeight = 0);
        else {
          var p = e - r - a;
          (t._horizontalRepeats = Math.floor(p / t._centralWidth)),
            (t._lastWidth = p % t._centralWidth);
          var l = i - n - s;
          (t._verticalRepeats = Math.floor(l / t._centralHeight)),
            (t._lastHeight = l % t._centralHeight),
            (t._width = e),
            (t._height = i);
        }
        (t._leftWidth = r),
          (t._rightWidth = a),
          (t._topHeight = n),
          (t._bottomHeight = s);
      }),
      (t.renderNineImage = function () {
        var e = t._frame.y,
          i = 0;
        t._topHeight > 0 &&
          (t.renderNineImageRow(t._image, e, i, t._topHeight),
          (e += t._topHeight),
          (i += t._topHeight));
        for (var n = 0; n < t._verticalRepeats; n++)
          t.renderNineImageRow(t._image, e, i, t._centralHeight),
            (i += t._centralHeight);
        t._lastHeight > 0 &&
          (t.renderNineImageRow(t._image, e, i, t._lastHeight),
          (i += t._lastHeight)),
          (e += t._centralHeight),
          t._bottomHeight > 0 &&
            t.renderNineImageRow(t._image, e, i, t._bottomHeight);
      }),
      (t.renderNineImageRow = function (e, i, n, r) {
        var s = t._frame.x,
          a = 0;
        t._leftWidth > 0 &&
          (t._nineImage.copy(e, s, i, t._leftWidth, r, a, n),
          (a += t._leftWidth),
          (s += t._leftWidth));
        for (var o = 0; o < t._horizontalRepeats; o++)
          t._nineImage.copy(e, s, i, t._centralWidth, r, a, n),
            (a += t._centralWidth);
        t._lastWidth > 0 &&
          (t._nineImage.copy(e, s, i, t._lastWidth, r, a, n),
          (a += t._lastWidth)),
          (s += t._centralWidth),
          t._rightWidth > 0 &&
            t._nineImage.copy(e, s, i, t._rightWidth, r, a, n);
      }),
      (t._textureKey = 0),
      t
    );
  })();
  t.NineImage = e;
})(Helper || (Helper = {}));
var Helper;
!(function (t) {
  var e;
  !(function (t) {
    (t[(t.UNDEFINED = -1)] = "UNDEFINED"),
      (t[(t.SPACE = 1)] = "SPACE"),
      (t[(t.NEWLINE = 2)] = "NEWLINE"),
      (t[(t.CHARACTER = 3)] = "CHARACTER");
  })(e || (e = {}));
  var i = (function () {
    function t() {}
    return (
      (t.hasNext = function () {
        return t.textPosition < t.text.length;
      }),
      (t.getChar = function () {
        return t.text.charAt(t.textPosition++);
      }),
      (t.peekChar = function () {
        return t.text.charAt(t.textPosition);
      }),
      (t.getPosition = function () {
        return t.textPosition;
      }),
      (t.setPosition = function (e) {
        t.textPosition = e;
      }),
      (t.getCharAdvance = function (e, i) {
        var n = t.fontData.chars[e],
          r = n.xAdvance;
        return i > 0 && n.kerning[i] && (r += n.kerning[i]), r;
      }),
      (t.getCharType = function (t) {
        return " " === t
          ? e.SPACE
          : /(?:\r\n|\r|\n)/.test(t)
          ? e.NEWLINE
          : e.CHARACTER;
      }),
      (t.wrapText = function (i, n, r, s, a, o) {
        (t.text = n),
          t.setPosition(0),
          (t.fontData = i.cache.getBitmapFont(a).font),
          void 0 === o && (o = t.fontData.size);
        var h = o / t.fontData.size,
          p = t.fontData.lineHeight * h,
          l = r / h,
          u = [],
          c = [],
          _ = [],
          d = 0,
          f = !0,
          m = 0,
          g = 0;
        (u[d] = g), (_[m++] = 0);
        for (var y = s; t.hasNext(); ) {
          for (
            var v = 0,
              T = 0,
              b = -1,
              A = e.UNDEFINED,
              I = e.UNDEFINED,
              S = l,
              E = -1;
            t.hasNext();

          ) {
            g = t.getPosition();
            var P = t.getChar();
            A = t.getCharType(P);
            var N = P.charCodeAt(0);
            if (A === e.SPACE)
              I !== e.SPACE && (T = v), ++v, (S -= t.getCharAdvance(N, E));
            else if (A === e.CHARACTER) {
              if (
                (I !== e.CHARACTER && (b = g),
                (S -= t.getCharAdvance(N, E)),
                0 > S)
              )
                break;
              ++v;
            } else if (A === e.NEWLINE) {
              var O = !1;
              if (
                (t.hasNext() &&
                  ((O = !0),
                  (T = v),
                  (b = t.getPosition()),
                  (g = b),
                  (S = -1),
                  (A = e.CHARACTER)),
                O)
              )
                break;
            }
            (I = A), (E = N);
          }
          (y -= p),
            0 > y && (_[m++] = d),
            0 > S && A === e.CHARACTER
              ? (0 !== T ? (c[d] = T) : (c[d] = v),
                (f = !1),
                0 > y && ((f = !0), (y = s - p)),
                0 !== T
                  ? ((u[++d] = b), t.setPosition(b))
                  : ((u[++d] = g), t.setPosition(g)))
              : t.hasNext() ||
                (A === e.CHARACTER ? (c[d] = v) : A === e.SPACE && (c[d] = T));
        }
        _[m] = d + 1;
        for (var M = [], R = 1; m >= R; R++) {
          for (var C = _[R - 1], x = _[R], L = [], F = C; x > F; F++)
            L.push(t.text.substr(u[F], c[F]));
          M.push(L.join("\n"));
        }
        return M;
      }),
      t
    );
  })();
  t.TextWrapper = i;
})(Helper || (Helper = {}));
var RioSprint;
!(function (t) {
  var e = (function () {
    function e() {
      if (
        ((this._debug = !1),
        (this._debugFloor = 500),
        (this._debugMiddle = 320),
        (this._safeJump = []),
        this._debug)
      ) {
        var e = t.Global.game;
        (this._debugBitmap = new Phaser.BitmapData(
          e,
          "Debug",
          e.width,
          e.height
        )),
          this._debugBitmap.fill(192, 255, 192),
          this._debugBitmap.addToWorld(),
          this._debugBitmap.line(
            0,
            this._debugFloor + 0.5,
            e.width,
            this._debugFloor + 0.5,
            "#008000",
            1
          ),
          this._debugBitmap.line(
            this._debugMiddle + 0.5,
            this._debugFloor + 0.5 - t.Gameplay.HURDLE_HEIGHT,
            this._debugMiddle + 0.5,
            this._debugFloor + 0.5,
            "#808080",
            1
          ),
          this._debugBitmap.line(
            this._debugMiddle + 0.5 - 20,
            this._debugFloor + 0.5 - t.Gameplay.JUMP_HEIGHT,
            this._debugMiddle + 0.5 - 20,
            this._debugFloor + 0.5,
            "#C08080",
            1
          );
      }
      this.calcHurdleJump(),
        (this._jumpVelocity = this.calcJumpVelocity(t.Gameplay.JUMP_HEIGHT)),
        (this._jumpTime = this.calcJumpTime(t.Gameplay.JUMP_HEIGHT)),
        (this._hurdleDistanceMin = Math.ceil(
          this._jumpTime * t.Gameplay.VELOCITY_X_MAX +
            t.Gameplay.DISTANCE_BETWEEN_HRUDLES
        )),
        (this._hurdleDistanceMax = Math.floor(
          this._hurdleDistanceMin * t.Gameplay.HURDLE_DISTANCE_MAX_COEF
        ));
    }
    return (
      Object.defineProperty(e.prototype, "hurdleDistanceMin", {
        get: function () {
          return this._hurdleDistanceMin;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "hurdleDistanceMax", {
        get: function () {
          return this._hurdleDistanceMax;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "jumpTime", {
        get: function () {
          return this._jumpTime;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "jumpTimeHalf", {
        get: function () {
          return this._jumpTime / 2;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "jumpVelocity", {
        get: function () {
          return this._jumpVelocity;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "safeJumpArea", {
        get: function () {
          return this._safeJumpArea;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.safeJumpHeight = function (t) {
        return this._safeJump[t];
      }),
      (e.prototype.calcHurdleJump = function () {
        for (
          var e = (t.Gameplay.VELOCITY_X_MIN + t.Gameplay.VELOCITY_X_MAX) / 2,
            i = 1 / 60 / 100,
            n = 0,
            r = 0,
            s = t.Gameplay.HURDLE_HEIGHT,
            a = 0;
          s >= t.Gameplay.HURDLE_TEST_HEIGHT;

        ) {
          var o = Math.round(n);
          o >= this._safeJump.length &&
            (o > this._safeJump.length,
            (this._safeJump[o] = s),
            (r = o),
            this._debug &&
              this._debugBitmap.rect(
                n + this._debugMiddle,
                this._debugFloor - s,
                2,
                2,
                "#206020"
              )),
            (a += t.Gameplay.GRAVITY * i),
            (s -= a * i),
            (n += e * i);
        }
        this._safeJumpArea = this._safeJump.length;
      }),
      (e.prototype.calcJumpVelocity = function (e) {
        return -Math.sqrt(2 * e * t.Gameplay.GRAVITY);
      }),
      (e.prototype.calcJumpTime = function (e) {
        var i = this.calcJumpVelocity(e);
        return (-2 * i) / t.Gameplay.GRAVITY;
      }),
      e
    );
  })();
  t.Calcs = e;
})(RioSprint || (RioSprint = {}));
var Particles;
!(function (t) {
  var e = (function () {
    function e(t, i) {
      (this.maxVelocity = e.MAX_VELOCITY),
        (this._delay = 0),
        (this._velocity = new Phaser.Point(0, 0)),
        (this._angularVelocity = 0),
        (this._friction = 0),
        (this._angularDrag = 0),
        (this._gravity = 0),
        (this._alpha = 1),
        (this._scaleChange = 0),
        (this._alphaChange = 0),
        (this._game = t);
    }
    return (
      Object.defineProperty(e.prototype, "visual", {
        get: function () {
          return this._visual;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "on", {
        set: function (t) {
          (this._on = t), (this._visual.exists = t), (this._visual.visible = t);
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.remove = function () {
        var t = this._visual.parent;
        null !== t &&
          (t instanceof Phaser.Group
            ? t.remove(this._visual)
            : t.removeChild(this._visual),
          (t = null));
      }),
      (e.prototype.bringToTop = function () {
        var t = this._visual.parent;
        t instanceof Phaser.Group && t.bringToTop(this._visual);
      }),
      (e.prototype.sendToBack = function () {
        var t = this._visual.parent;
        t instanceof Phaser.Group && t.sendToBack(this._visual);
      }),
      Object.defineProperty(e.prototype, "textureKey", {
        set: function (t) {
          this._textureKey = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.setScaleChange = function (t, e) {
        void 0 === e && (e = 0),
          (this._scaleChangeType = t),
          (this._scaleChange = e);
      }),
      Object.defineProperty(e.prototype, "delay", {
        set: function (t) {
          (this._delay = t), t > 0 && (this.on = !1);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "alpha", {
        set: function (t) {
          (this._alpha = t), (this._visual.alpha = Phaser.Math.clamp(t, 0, 1));
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.setAlphaChange = function (t, e) {
        void 0 === e && (e = 0),
          (this._alphaChangeType = t),
          (this._alphaChange = e);
      }),
      (e.prototype.setPhysics = function (t, e, i, n, r, s) {
        void 0 === t && (t = 0),
          void 0 === e && (e = 0),
          void 0 === i && (i = 0),
          void 0 === n && (n = 0),
          void 0 === r && (r = 0),
          void 0 === s && (s = 0),
          this._velocity.setTo(t, e),
          (this._angularVelocity = i),
          (this._friction = n),
          (this._angularDrag = r),
          (this._gravity = s),
          (this._simplePhysics = 0 === s && 0 === n && 0 === r);
      }),
      (e.prototype.setFrame = function (t) {}),
      (e.prototype.onEmit = function (t) {
        t.add(this._visual);
      }),
      (e.prototype.onKill = function (t) {}),
      (e.prototype.update = function (e) {
        void 0 === e && (e = !0);
        var i = this._game.time.physicsElapsed;
        if (this._delay > 0) {
          if ((this._delay -= i) > 0) return !0;
          this.on = !0;
        }
        if (this.lifetime > 0 && (this.lifetime -= i) <= 0) return !1;
        if (
          ((0 !== this._velocity.x || 0 !== this._velocity.y) &&
            ((this._visual.x += this._velocity.x * i),
            (this._visual.y += this._velocity.y * i)),
          0 !== this._angularVelocity &&
            (this._visual.angle += this._angularVelocity * i),
          this._simplePhysics ||
            ((this._velocity.x += -this._friction * this._velocity.x * i),
            (this._velocity.y +=
              (this._gravity - this._friction * this._velocity.y) * i),
            (this._angularVelocity +=
              -this._angularDrag * this._angularVelocity * i)),
          !e)
        )
          return !0;
        if (this._scaleChangeType != t.eParameterChangeType.NO_CHANGE)
          switch (this._scaleChangeType) {
            case t.eParameterChangeType.IN_TIME:
              (this._visual.scale.x += this._scaleChange * i) < 0 &&
                ((this._visual.scale.x = 0),
                this._scaleChange < 0 &&
                  (this._scaleChangeType = t.eParameterChangeType.NO_CHANGE)),
                (this._visual.scale.y += this._scaleChange * i) < 0 &&
                  ((this._visual.scale.y = 0),
                  this._scaleChange < 0 &&
                    (this._scaleChangeType = t.eParameterChangeType.NO_CHANGE));
          }
        if (this._alphaChangeType != t.eParameterChangeType.NO_CHANGE)
          switch (this._alphaChangeType) {
            case t.eParameterChangeType.IN_TIME:
              (this._alpha += this._alphaChange * i),
                this._alpha < 0
                  ? ((this._visual.alpha = 0),
                    this._alphaChange < 0 &&
                      (this._alphaChangeType =
                        t.eParameterChangeType.NO_CHANGE))
                  : this._alpha > 1
                  ? ((this._visual.alpha = 1),
                    this._alphaChange > 0 &&
                      (this._alphaChangeType =
                        t.eParameterChangeType.NO_CHANGE))
                  : (this._visual.alpha = this._alpha);
          }
        return !0;
      }),
      (e.MAX_VELOCITY = 1e3),
      e
    );
  })();
  t.Particle = e;
})(Particles || (Particles = {}));
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
  Particles;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.apply(this, arguments);
    }
    return (
      __extends(e, t),
      (e.prototype.setFrame = function (t) {
        var e = this._visual;
        "string" == typeof t ? (e.frameName = t) : (e.frame = t);
      }),
      (e.prototype.onCreate = function (t) {
        var e = new Phaser.Sprite(this._game, 0, 0, this._textureKey);
        e.anchor.setTo(0.5, 0.5), (this._visual = e);
      }),
      e
    );
  })(t.Particle);
  t.SpriteParticle = e;
})(Particles || (Particles = {}));
var Particles;
!(function (t) {
  var e = (function (t) {
    function e(e, i) {
      t.call(this, e, i), (void 0 === i || null !== i) && (this._anims = i[0]);
    }
    return (
      __extends(e, t),
      (e.prototype.onCreate = function (e) {
        t.prototype.onCreate.call(this, e);
        for (var i = this._visual, n = 0; n < this._anims.length; n++) {
          var r = this._anims[n],
            s = i.animations.add(r.name, r.frames, r.frameRate, r.loop);
          !r.loop && r.killOnComplete && (s.killOnComplete = !0);
        }
      }),
      (e.prototype.update = function (e) {
        void 0 === e && (e = !0);
        var i = this._delay,
          n = t.prototype.update.call(this, e);
        return (
          i > 0 &&
            this._delay <= 0 &&
            this._visual.animations.currentAnim.play(),
          n
        );
      }),
      (e.prototype.setFrame = function (t) {
        this.setAnim(t);
      }),
      (e.prototype.setAnim = function (t) {
        var e = this._visual;
        e.animations.stop(null, !0),
          this._delay <= 0
            ? e.animations.play(t)
            : ((e.animations.currentAnim = e.animations.getAnimation(t)),
              e.animations.currentAnim.setFrame(0, !0));
      }),
      (e.prototype.setRandomAnim = function () {
        var t =
          (this._visual,
          this._anims[this._game.rnd.integerInRange(0, this._anims.length - 1)]
            .name);
        this.setAnim(t);
      }),
      e
    );
  })(t.SpriteParticle);
  t.AnimatedParticle = e;
})(Particles || (Particles = {}));
var Particles;
!(function (t) {
  var e = (function () {
    function e(e) {
      (this.area = new Phaser.Point(0, 0)),
        (this.gravity = 0),
        (this.minLifetime = 1),
        (this.maxLifetime = 1),
        (this.delay = 0),
        (this.minScale = 1),
        (this.maxScale = 1),
        (this.scaleChange = 0),
        (this.scaleChangeType = t.eParameterChangeType.NO_CHANGE),
        (this.minAngle = 0),
        (this.maxAngle = 0),
        (this.minSpeedX = 0),
        (this.maxSpeedX = 0),
        (this.minSpeedY = 0),
        (this.maxSpeedY = 0),
        (this.friction = 0),
        (this.minAngularSpeed = 0),
        (this.maxAngularSpeed = 0),
        (this.angularDrag = 0),
        (this.minAlpha = 1),
        (this.maxAlpha = 1),
        (this.alphaChange = 0),
        (this.alphaChangeType = t.eParameterChangeType.NO_CHANGE),
        (this.frames = null),
        (this._minAdvScale = new Phaser.Point(1, 1)),
        (this._maxAdvScale = new Phaser.Point(1, 1)),
        (this._game = e);
    }
    return (
      (e.readParams = function (t, i) {
        var n = {};
        for (var r in i) {
          var s = new e(t);
          e.doReadParams(s, i, r), (n[r] = s);
        }
        return n;
      }),
      (e.doReadParams = function (t, i, n) {
        var r = i[n];
        if ("undefined" != typeof r.parent && null !== r.parent) {
          var s = r.parent;
          e.doReadParams(t, i, s);
        }
        for (var a in r)
          "parent" !== a && ("undefined" == typeof t[a], (t[a] = r[a]));
      }),
      (e.prototype.clear = function () {
        (this.gravity = 0),
          this.setXSpeed(0, 0),
          this.setYSpeed(0, 0),
          this.setAngularSpeed(0);
      }),
      (e.prototype.randomFrame = function () {
        var t = null;
        return (
          null !== this.frames &&
            (t = Array.isArray(this.frames)
              ? "string" == typeof this.frames[0]
                ? this._game.rnd.pick(this.frames)
                : this._game.rnd.pick(this.frames)
              : this.frames),
          t
        );
      }),
      (e.prototype.setXSpeed = function (t, e) {
        (t = t || 0), (e = e || 0), (this.minSpeedX = t), (this.maxSpeedX = e);
      }),
      (e.prototype.setYSpeed = function (t, e) {
        (t = t || 0), (e = e || 0), (this.minSpeedY = t), (this.maxSpeedY = e);
      }),
      (e.prototype.setAngularSpeed = function (t, e) {
        (t = t || 0),
          (e = e || 0),
          (this.minAngularSpeed = t),
          (this.maxAngularSpeed = e);
      }),
      (e.prototype.setAlpha = function (t, e) {
        void 0 === t && (t = 1),
          void 0 === e && (e = 1),
          (this.minAlpha = t),
          (this.maxAlpha = e);
      }),
      (e.prototype.setAlphaChange = function (e, i, n) {
        switch (
          (void 0 === i && (i = 0),
          void 0 === n && (n = 0),
          (this.alphaChangeType = e),
          e)
        ) {
          case t.eParameterChangeType.NO_CHANGE:
            this.alphaChange = 0;
            break;
          case t.eParameterChangeType.IN_TIME:
            0 === n && (n = 1), (this.alphaChange = i / n);
        }
      }),
      (e.prototype.setScale = function (t, e) {
        (t = t || 0), (e = e || 0), (this.minScale = t), (this.maxScale = e);
      }),
      Object.defineProperty(e.prototype, "advScaleMin", {
        get: function () {
          return this._minAdvScale;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "advScaleMax", {
        get: function () {
          return this._maxAdvScale;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.setAdvScale = function (t, e, i, n) {
        void 0 === t && (t = 1),
          void 0 === e && (e = 1),
          void 0 === i && (i = 1),
          void 0 === n && (n = 1),
          this._minAdvScale.setTo(t, i),
          this._maxAdvScale.setTo(e, n);
      }),
      (e.prototype.setScaleChange = function (e, i, n) {
        switch (
          (void 0 === i && (i = 0),
          void 0 === n && (n = 0),
          (this.scaleChangeType = e),
          e)
        ) {
          case t.eParameterChangeType.NO_CHANGE:
            this.scaleChange = 0;
            break;
          case t.eParameterChangeType.IN_TIME:
            0 === n && (n = 1), (this.scaleChange = i / n);
        }
      }),
      (e.prototype.setAngle = function (t, e) {
        void 0 === t && (t = 0),
          void 0 === e && (e = 0),
          (this.minAngle = t),
          (this.maxAngle = e);
      }),
      e
    );
  })();
  t.ParticleParams = e;
})(Particles || (Particles = {}));
var Particles;
!(function (t) {
  var e;
  !(function (t) {
    (t[(t.NONE = 0)] = "NONE"),
      (t[(t.FLOW = 1)] = "FLOW"),
      (t[(t.EXPLODE = 2)] = "EXPLODE");
  })(e || (e = {})),
    (function (t) {
      (t[(t.NO_CHANGE = 0)] = "NO_CHANGE"), (t[(t.IN_TIME = 1)] = "IN_TIME");
    })(t.eParameterChangeType || (t.eParameterChangeType = {}));
  var i = t.eParameterChangeType,
    n = (function (n) {
      function r(i, s, a, o) {
        n.call(this, i, null),
          (this._maxParticles = r.MAX_PARTICELES),
          (this.emitPoint = new Phaser.Point(0, 0)),
          (this.emitObject = null),
          (this.particleClass = t.SpriteParticle),
          (this.particleBringToTop = !1),
          (this.particleSendToBack = !1),
          (this.frequency = 100),
          (this.forceEmit = !1),
          (this._alternativeParams = null),
          (this._on = !1),
          (this._mode = e.NONE),
          (this._flowQuantity = 0),
          (this._flowTotal = 0),
          (this._flowCounter = 0),
          (this._particlesPool = []),
          (this._counterPool = 0),
          (this._particlesUsed = []),
          (this._counterUsed = 0),
          (this._timer = 0),
          (this._emitPoint = new Phaser.Point(0, 0)),
          (this._params = new t.ParticleParams(i)),
          this.position.setTo(s, a),
          (this._maxParticles = o);
      }
      return (
        __extends(r, n),
        Object.defineProperty(r.prototype, "params", {
          set: function (t) {
            this._params = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        (r.prototype.clear = function () {
          this._params.clear();
        }),
        (r.prototype.update = function () {
          if (
            this._on &&
            this.game.time.time >= this._timer &&
            ((this._timer =
              this.game.time.time + this.frequency * this.game.time.slowMotion),
            this._mode === e.FLOW)
          )
            if (-1 !== this._flowTotal && this._flowCounter >= this._flowTotal)
              this.stopFlow();
            else
              for (
                var t = Math.max(1, this._flowQuantity), i = 0;
                t > i &&
                !(
                  this.emitParticle(this.forceEmit) &&
                  (this._flowCounter++,
                  -1 !== this._flowTotal &&
                    this._flowCounter >= this._flowTotal)
                );
                i++
              );
          for (var i = this._counterUsed - 1; i >= 0; i--) {
            var n = this._particlesUsed[i];
            n.update() ||
              ((n.on = !1),
              n.remove(),
              n.onKill(this),
              (this._particlesUsed[i] = this._particlesUsed[
                --this._counterUsed
              ]),
              (this._particlesPool[this._counterPool++] = n));
          }
        }),
        (r.prototype.makeParticles = function (t, e, i, n) {
          (void 0 === i || i > this._maxParticles) && (i = this._maxParticles),
            void 0 !== e && (this._params.frames = e);
          for (var r = 0; i > r; r++) {
            var s = new this.particleClass(this.game, n);
            (s.textureKey = t),
              s.onCreate(this),
              (s.on = !1),
              (this._particlesPool[this._counterPool++] = s);
          }
        }),
        Object.defineProperty(r.prototype, "on", {
          set: function (t) {
            (this._on = t), (this.exists = t), (this.visible = t);
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "count", {
          get: function () {
            return this._counterUsed;
          },
          enumerable: !0,
          configurable: !0,
        }),
        (r.prototype.explode = function (t, i, n) {
          (this._mode = e.EXPLODE), (this.on = !0), this.emitParticles(t, i, n);
        }),
        (r.prototype.flow = function (t, i, n, r, s, a) {
          (this._mode = e.FLOW),
            (this.on = !0),
            (void 0 === i || 0 === i) && (i = 1),
            void 0 === n && (n = -1),
            void 0 === r && (r = !0),
            i > this._maxParticles && (i = this._maxParticles),
            (this.frequency = t),
            (this._flowCounter = 0),
            (this._flowQuantity = i),
            (this._flowTotal = n),
            r &&
              (this.emitParticles(i, s, a),
              (this._flowCounter += i),
              (this._timer =
                this.game.time.time + t * this.game.time.slowMotion));
        }),
        (r.prototype.stopFlow = function () {
          this._mode = e.NONE;
        }),
        (r.prototype.killAllParticles = function (t) {
          for (void 0 === t && (t = !0); this._counterUsed > 0; ) {
            var e = this._particlesUsed[--this._counterUsed];
            e.remove(),
              t || e.onKill(this),
              (this._particlesPool[this._counterPool++] = e);
          }
        }),
        (r.prototype.emitParticles = function (t, e, i) {
          for (var n = 0; t > n; n++) {
            var r = this.emitParticle(this.forceEmit);
            if (null === r) break;
            void 0 !== e && null !== e && e.call(i, r);
          }
        }),
        (r.prototype.emitParticle = function (t, e) {
          if (
            (void 0 === t && (t = !1),
            void 0 === e && (e = !1),
            0 === this._counterPool)
          ) {
            if (!t) return null;
            var n = this._particlesUsed[0];
            (this._particlesUsed[0] = this._particlesUsed[--this._counterUsed]),
              n.remove(),
              n.onKill(this),
              (this._particlesPool[this._counterPool++] = n);
          }
          var r = this._particlesPool[--this._counterPool];
          (this._particlesUsed[this._counterUsed++] = r), (r.on = !0);
          var s =
            null !== this._alternativeParams
              ? this._alternativeParams
              : this._params;
          if (
            (this.randomEmitPoint(this._emitPoint, s),
            r.visual.position.set(this._emitPoint.x, this._emitPoint.y),
            (r.visual.angle = 0),
            e)
          )
            (r.lifetime = -1),
              r.visual.scale.set(1, 1),
              r.setScaleChange(i.NO_CHANGE),
              (r.visual.angle = 0),
              (r.alpha = 1),
              r.setAlphaChange(i.NO_CHANGE),
              r.setPhysics();
          else {
            if (
              ((r.lifetime = this.game.rnd.realInRange(
                s.minLifetime,
                s.maxLifetime
              )),
              (r.delay = s.delay),
              1 !== s.minScale || 1 !== s.maxScale)
            ) {
              var a = this.game.rnd.realInRange(s.minScale, s.maxScale);
              r.visual.scale.set(a, a);
            } else
              s.advScaleMin.x !== s.advScaleMax.x ||
              s.advScaleMin.y !== s.advScaleMax.y
                ? r.visual.scale.set(
                    this.game.rnd.realInRange(s.advScaleMin.x, s.advScaleMax.x),
                    this.game.rnd.realInRange(s.advScaleMin.y, s.advScaleMax.y)
                  )
                : r.visual.scale.set(1, 1);
            r.setScaleChange(s.scaleChangeType, s.scaleChange),
              (r.visual.angle =
                s.minAngle === s.maxAngle
                  ? s.minAngle
                  : this.game.rnd.realInRange(s.minAngle, s.maxAngle)),
              (r.alpha = this.game.rnd.realInRange(s.minAlpha, s.maxAlpha)),
              r.setAlphaChange(s.alphaChangeType, s.alphaChange),
              r.setPhysics(
                this.game.rnd.realInRange(s.minSpeedX, s.maxSpeedX),
                this.game.rnd.realInRange(s.minSpeedY, s.maxSpeedY),
                this.game.rnd.realInRange(s.minAngularSpeed, s.maxAngularSpeed),
                s.friction,
                s.angularDrag,
                s.gravity
              ),
              null !== s.frames && r.setFrame(s.randomFrame());
          }
          return (
            r.onEmit(this),
            this.particleBringToTop
              ? r.bringToTop()
              : this.particleSendToBack && r.sendToBack(),
            r
          );
        }),
        (r.prototype.destroy = function () {
          t.ParticlesManager.instance.remove(this),
            n.prototype.destroy.call(this, !0, !1);
        }),
        (r.prototype.randomEmitPoint = function (t, e) {
          return (
            e.area instanceof Phaser.Point ? t.setTo(0, 0) : e.area.random(t),
            (t.x += this.emitPoint.x),
            (t.y += this.emitPoint.y),
            null !== this.emitObject &&
              ((t.x += this.emitObject.x), (t.y += this.emitObject.y)),
            t
          );
        }),
        Object.defineProperty(r.prototype, "area", {
          set: function (t) {
            this._params.area = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "gravity", {
          set: function (t) {
            this._params.gravity = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "friction", {
          set: function (t) {
            this._params.friction = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "angularDrag", {
          set: function (t) {
            this._params.angularDrag = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "minScale", {
          set: function (t) {
            this._params.minScale = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "maxScale", {
          set: function (t) {
            this._params.maxScale = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "minAngle", {
          set: function (t) {
            this._params.minAngle = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "maxAngle", {
          set: function (t) {
            this._params.maxAngle = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "lifetime", {
          set: function (t) {
            this._params.minLifetime = this._params.maxLifetime = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        (r.prototype.setXSpeed = function (t, e) {
          this._params.setXSpeed(t, e);
        }),
        (r.prototype.setYSpeed = function (t, e) {
          this._params.setYSpeed(t, e);
        }),
        (r.prototype.setAngularSpeed = function (t, e) {
          this._params.setAngularSpeed(t, e);
        }),
        (r.prototype.setAlpha = function (t, e) {
          this._params.setAlpha(t, e);
        }),
        (r.prototype.setAlphaChange = function (t, e, i) {
          void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            this._params.setAlphaChange(t, e, i);
        }),
        (r.prototype.setScale = function (t, e) {
          this._params.setScale(t, e);
        }),
        (r.prototype.setAdvScale = function (t, e, i, n) {
          this._params.setAdvScale(t, e, i, n);
        }),
        (r.prototype.setScaleChange = function (t, e, i) {
          void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            this._params.setScaleChange(t, e, i);
        }),
        (r.prototype.setAngle = function (t, e) {
          this._params.setAngle(t, e);
        }),
        (r.prototype.emitAt = function (t, e) {
          this.emitPoint.setTo(t, e);
        }),
        (r.prototype.emitAtObject = function (t) {
          t.center
            ? this.emitPoint.setTo(t.center.x, t.center.y)
            : this.emitPoint.setTo(t.x, t.y);
        }),
        (r.MAX_PARTICELES = 16),
        r
      );
    })(Phaser.Group);
  t.ParticlesEmitter = n;
})(Particles || (Particles = {}));
var Particles;
!(function (t) {
  var e = (function () {
    function t(t, e, i, n) {
      void 0 === i && (i = null),
        void 0 === n && (n = null),
        (this._emitter = null),
        (this._game = t),
        (this._emitter = e),
        (this._animEmitter = i),
        (this._params = n);
    }
    return (
      (t.prototype.emit = function (t, e, i, n, r) {
        for (
          this._emitter.emitAt(t, e),
            null !== this._animEmitter && this._animEmitter.emitAt(t, e);
          null !== i;

        ) {
          var s = i.animated ? this._animEmitter : this._emitter;
          if (
            (null === this._params && null !== i.paramsName,
            null !== this._params)
          ) {
            var a = this._params[i.paramsName];
            "undefined" == typeof a || (s.params = a);
          }
          s.explode(
            this._game.rnd.integerInRange(i.countMin, i.countMax),
            n,
            r
          ),
            (i = i.next);
        }
      }),
      t
    );
  })();
  t.ParticleChain = e;
})(Particles || (Particles = {}));
var Particles;
!(function (t) {
  var e = (function () {
    function t() {
      (this._emitters = []), (this._emittersCount = 0);
    }
    return (
      Object.defineProperty(t, "instance", {
        get: function () {
          return null === t._instance && (t._instance = new t()), t._instance;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.add = function (t) {
        this._emitters[this._emittersCount++] = t;
      }),
      (t.prototype.remove = function (t) {
        for (
          var e = this._emittersCount - 1;
          e >= 0 && this._emitters[e] !== t;
          e--
        );
        -1 !== e && (this._emitters[e] = this._emitters[--this._emittersCount]);
      }),
      (t.prototype.update = function () {
        for (var t = 0; t < this._emittersCount; t++) {
          var e = this._emitters[t];
          e.exists && e.update();
        }
      }),
      (t._instance = null),
      t
    );
  })();
  t.ParticlesManager = e;
})(Particles || (Particles = {}));
var RioSprint;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.GRAVITY = 2400),
      (t.HURDLE_HEIGHT = 55),
      (t.HURDLE_TEST_HEIGHT = 0.5 * t.HURDLE_HEIGHT),
      (t.JUMP_HEIGHT = 1.3 * t.HURDLE_HEIGHT),
      (t.TOUCH_LIMIT = 20),
      (t.INITIAL_HURDLE_DISTANCE = 700),
      (t.DISTANCE_BETWEEN_HRUDLES = 100),
      (t.HURDLE_DISTANCE_MAX_COEF = 2),
      (t.VELOCITY_X_MIN = 150),
      (t.VELOCITY_X_MAX = 300),
      (t.TITLES_FREQUENCY = 5),
      (t.TIME_SAFE = 3e3),
      (t.TIME_FAIL = 5e3),
      (t.TIME_YELLOW = 2e3),
      (t.AIs = [
        {
          INITIAL_AI_SPEED: 4,
          FINAL_AI_SPEED: 4.8,
          AI_SPEED_CHANGE_DURATION: 4e4,
          INITIAL_JUMP_EPSILON: 50,
          FINAL_JUMP_EPSILON: 30,
          JUMP_EPSILON_CHANGE_DURATION: 6e4,
        },
        {
          INITIAL_AI_SPEED: 4,
          FINAL_AI_SPEED: 4.8,
          AI_SPEED_CHANGE_DURATION: 4e4,
          INITIAL_JUMP_EPSILON: 50,
          FINAL_JUMP_EPSILON: 30,
          JUMP_EPSILON_CHANGE_DURATION: 6e4,
        },
      ]),
      t
    );
  })();
  t.Gameplay = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function () {
    function t(t, e, i) {
      void 0 === i && (i = null),
        (this.name = "<no name>"),
        (this.debug = 0),
        (this._newFunction = null),
        (this._count = 0),
        (this._pool = []),
        (this._canGrow = !0),
        (this._poolSize = 0),
        (this._classType = t),
        (this._newFunction = i);
      for (var n = 0; e > n; n++) {
        var r = this.newItem();
        this._pool[this._count++] = r;
      }
      this._poolSize = e;
    }
    return (
      (t.prototype.createItem = function () {
        return 0 === this._count
          ? ((this.debug & t.DEBUG_ALLOCATION) > 0,
            this._canGrow ? this.newItem() : null)
          : ((this.debug & t.DEBUG_CREATE) > 0, this._pool[--this._count]);
      }),
      (t.prototype.destroyItem = function (e) {
        (this.debug & t.DEBUG_DESTROY) > 0, (this._pool[this._count++] = e);
      }),
      Object.defineProperty(t.prototype, "newFunction", {
        set: function (t) {
          this._newFunction = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.newItem = function () {
        return null !== this._newFunction
          ? this._newFunction()
          : new this._classType();
      }),
      Object.defineProperty(t.prototype, "canGrow", {
        set: function (t) {
          this._canGrow = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.DEBUG_ALLOCATION = 1),
      (t.DEBUG_CREATE = 2),
      (t.DEBUG_DESTROY = 4),
      (t.DEBUG_ALL = 7),
      t
    );
  })();
  t.Pool = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (t) {
    function e(e, i) {
      t.call(this, e, i),
        (this._nextX = 0),
        this.createMultiple(4, "Sprites", "reklama", !1);
    }
    return (
      __extends(e, t),
      (e.prototype.reset = function () {
        (this._nextX = 0),
          this.forEachExists(function (t) {
            t.exists = !1;
          }, this);
      }),
      (e.prototype.removeOld = function (t) {
        this.forEachExists(function (e) {
          e.x < t - 230 && (e.exists = !1);
        }, this);
      }),
      (e.prototype.updateAds = function (t) {
        for (this.removeOld(t); this._nextX < t + this.game.width; ) {
          var e = this._nextX;
          this._nextX += 230 * this.game.rnd.integerInRange(1, 4);
          var i = this.getFirstExists(!1);
          if (null === i) break;
          (i.x = e), (i.exists = !0);
        }
      }),
      e
    );
  })(Phaser.Group);
  t.AdTable = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function () {
    function t(t, e, i, n) {
      (this._game = t),
        (this._track = e),
        (this._calcs = i),
        (this._aiParams = n),
        this.reset();
    }
    return (
      (t.prototype.reset = function () {
        (this._pressTime = 0),
          (this._targetSpeed = this._aiParams.INITIAL_AI_SPEED),
          (this._jumpEpsilon = this._aiParams.INITIAL_JUMP_EPSILON),
          (this._time = 0);
      }),
      (t.prototype.update = function (t) {
        this.simulatePress(),
          this.simulateJump(),
          this._track.updateTrack(this._game.camera.x, t),
          this.updateDifficulty();
      }),
      (t.prototype.updateDifficulty = function () {
        this._time += this._game.time.elapsed;
        var t = Phaser.Math.clamp(
          this._time / this._aiParams.AI_SPEED_CHANGE_DURATION,
          0,
          1
        );
        (this._targetSpeed =
          this._aiParams.INITIAL_AI_SPEED +
          (this._aiParams.FINAL_AI_SPEED - this._aiParams.INITIAL_AI_SPEED) *
            t),
          (t = Phaser.Math.clamp(
            this._time / this._aiParams.JUMP_EPSILON_CHANGE_DURATION,
            0,
            1
          )),
          (this._jumpEpsilon =
            this._aiParams.INITIAL_JUMP_EPSILON +
            (this._aiParams.FINAL_JUMP_EPSILON -
              this._aiParams.INITIAL_JUMP_EPSILON) *
              t);
      }),
      (t.prototype.simulatePress = function () {
        if (!(this._game.time.time < this._pressTime)) {
          var t = this._track.player;
          t.run();
          var e = t.averageSpeed,
            i = this._targetSpeed;
          e < this._targetSpeed
            ? (i = 7)
            : e > this._targetSpeed && (i = this._targetSpeed),
            (this._pressTime = this._game.time.time + 1e3 / i);
        }
      }),
      (t.prototype.simulateJump = function () {
        var t = this._track.player;
        if (t.standing) {
          var e = this._game.camera.x;
          if (!(t.x < e - 128 - 16)) {
            var i = this._track.closestHurdle();
            if (null !== i) {
              if (!i.aiJumpCalculated) {
                for (
                  var n = 2, r = 0, s = Math.floor(this._jumpEpsilon), a = 0;
                  n > a;
                  a++
                )
                  r += this._game.rnd.integerInRange(-s, s);
                (r /= n), (i.aiJumpOffset = r);
              }
              if (!i.aiJumped) {
                var o = this._calcs.jumpTimeHalf * t.velX + i.aiJumpOffset;
                t.x < i.x && t.x >= i.x - o && (t.jump(), (i.aiJumped = !0));
              }
            }
          }
        }
      }),
      t
    );
  })();
  t.AI = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (t) {
    function e(e, i, n, r, s) {
      t.call(this, e, i, n, r), void 0 !== s && this.setAnchoredFrame(s);
    }
    return (
      __extends(e, t),
      (e.prototype.setAnchoredFrame = function (t) {
        if ("string" == typeof this.key) {
          var e = null;
          "string" == typeof t
            ? ((this.frameName = t),
              (e = this.game.cache.getFrameByName(this.key, t)))
            : ((this.frame = t),
              (e = this.game.cache.getFrameByIndex(this.key, t))),
            void 0 !== e.anchorX &&
              void 0 !== e.anchorY &&
              this.anchor.setTo(e.anchorX, e.anchorY);
        }
      }),
      e
    );
  })(Phaser.Sprite);
  t.AnchoredSprite = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (t) {
    function e(e, i, n, r, s) {
      t.call(this, e, i), (this._scrollCoef = s);
      var a = e.cache.getFrameByName("Sprites", n),
        o = e.add.sprite(0, 0, "Sprites", n, this);
      (o.anchor.y = r),
        (o.fixedToCamera = !0),
        (this._sprite1Crop = new Phaser.Rectangle(0, 0, 0, a.height)),
        o.crop(this._sprite1Crop, !1),
        (this._sprite1 = o),
        (o = e.add.sprite(0, 0, "Sprites", n, this)),
        (o.fixedToCamera = !0),
        (o.anchor.y = r),
        (this._sprite2Crop = new Phaser.Rectangle(0, 0, 0, a.height)),
        o.crop(this._sprite2Crop, !1),
        (this._sprite2 = o);
    }
    return (
      __extends(e, t),
      (e.prototype.updatePosition = function (t) {
        (t *= this._scrollCoef), 0 > t && (t += 640);
        var e = Math.floor(t) % 640;
        (this._sprite1Crop.x = e),
          (this._sprite1Crop.width = 640 - e),
          this._sprite1.updateCrop(),
          (this._sprite2Crop.width = e),
          (this._sprite2.cameraOffset.x = 640 - e),
          this._sprite2.updateCrop();
      }),
      e
    );
  })(Phaser.Group);
  t.BgLayer = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (e) {
    function i(t, n, r) {
      e.call(this, t, 0, 0, "Sprites", i.ANIM[0]),
        (this._calcs = n),
        (this._floor = r),
        this.clear();
    }
    return (
      __extends(i, e),
      Object.defineProperty(i.prototype, "collisionMax", {
        get: function () {
          return this._collisionMax;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "pointsAdded", {
        get: function () {
          return this._pointsAdded;
        },
        set: function (t) {
          this._pointsAdded = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "aiJumped", {
        get: function () {
          return this._aiJumped;
        },
        set: function (t) {
          this._aiJumped = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "aiJumpOffset", {
        get: function () {
          return this._aiJumpOffset;
        },
        set: function (t) {
          (this._aiJumpOffset = t), (this._aiJumpCalculated = !0);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "aiJumpCalculated", {
        get: function () {
          return this._aiJumpCalculated;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (i.prototype.clear = function () {
        (this._collisionMax = 0),
          (this._collisionLevel = 0),
          (this._pointsAdded = !1),
          (this.frameName = i.ANIM[0]),
          (this._frameIndex = 0),
          (this._animForward = !0),
          (this._aiJumped = !1),
          (this._aiJumpCalculated = !1),
          (this._aiJumpOffset = 0);
      }),
      (i.prototype.updateAnim = function () {
        if (0 === this._collisionLevel || 999 === this._collisionLevel)
          return !1;
        var t = this.game.time.time;
        return (
          t > this._nextFrameTime &&
            ((this._nextFrameTime = t + i.FRAME_DURATION),
            1 === this._collisionLevel
              ? this._animForward
                ? (++this._frameIndex,
                  3 === this._frameIndex &&
                    ((this._frameIndex -= 2), (this._animForward = !1)))
                : (--this._frameIndex,
                  this._frameIndex < 0 &&
                    ((this._frameIndex = 0), (this._collisionLevel = 0)))
              : 2 === this._collisionLevel &&
                (++this._frameIndex,
                this._frameIndex >= i.ANIM.length &&
                  ((this._frameIndex = i.ANIM.length - 1),
                  (this._collisionLevel = 999))),
            (this.frameName = i.ANIM[this._frameIndex])),
          999 === this._collisionLevel
        );
      }),
      (i.prototype.collided = function (e) {
        var n = Math.round(e.x) - this.x,
          r = Math.abs(n);
        if (r >= this._calcs.safeJumpArea) return 0;
        var s = this._floor - this._calcs.safeJumpHeight(r);
        if (e.y < s) return 0;
        var a = e.y < s + t.Gameplay.TOUCH_LIMIT ? 1 : 2;
        return a > this._collisionLevel
          ? (0 === this._collisionLevel &&
              ((this._nextFrameTime = this.game.time.time + i.FRAME_DURATION),
              (this._frameIndex = 0),
              (this._animForward = !0)),
            (this._collisionMax = a),
            (this._collisionLevel = a),
            a)
          : 0;
      }),
      (i.ANIM = [
        "prekazky1",
        "prekazky2",
        "prekazky3",
        "prekazky4",
        "prekazkyspadla",
      ]),
      (i.FRAME_DURATION = 20),
      i
    );
  })(t.AnchoredSprite);
  t.Hurdle = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (e) {
    function i(i, n, r) {
      e.call(this, i, 0, 0, "Sprites", "empty"),
        (this._samples = []),
        (this._lastPressTime = 0),
        (this._average = 0),
        (this._cutoff = 0.25),
        (this._isMainPlayer = !1),
        (this._calcs = n),
        (this._floor = r),
        this.anchor.set(0.5, 1),
        (this._spriterGroup = new Spriter.SpriterGroup(
          this.game,
          t.Global.runAnim,
          "Sprites",
          "entity_000",
          "running",
          100
        )),
        this._spriterGroup.position.set(0, -55),
        this.addChild(this._spriterGroup),
        this._spriterGroup.onFinish.add(this.onAnimationFinished, this),
        (this._velX = t.Gameplay.VELOCITY_X_MIN),
        (this._velY = 0),
        (this._standing = !1),
        (this._jumpTime = 0),
        this.resetPlayer();
    }
    return (
      __extends(i, e),
      Object.defineProperty(i.prototype, "isMainPlayer", {
        get: function () {
          return this._isMainPlayer;
        },
        set: function (t) {
          this._isMainPlayer = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (i.prototype.resetPlayer = function () {
        for (var t = 0; 5 > t; t++) this._samples[t] = 0;
        (this._average = 0),
          (this._lastPressTime = 0),
          (this._standing = !0),
          this.position.set(50, 0),
          this._spriterGroup.position.set(0, -55),
          this._spriterGroup.playAnimationByName("idle"),
          (this._nextStepTime = 0),
          (this._stepCount = 0);
      }),
      (i.prototype.setCharMap = function (t) {
        this._spriterGroup.clearCharMaps(),
          null !== t && this._spriterGroup.pushCharMap(t);
      }),
      Object.defineProperty(i.prototype, "averageSpeed", {
        get: function () {
          return Math.min(this._average, 5);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "velX", {
        get: function () {
          return this._velX;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "standing", {
        get: function () {
          return this._standing;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (i.prototype.updateAnim = function () {
        var t = this._spriterGroup.currentAnimationName;
        "running" === t
          ? (this._spriterGroup.setAnimationSpeedPercent(
              60 + 10 * this._average
            ),
            this._isMainPlayer &&
              this.game.time.time > this._nextStepTime &&
              ((this._nextStepTime =
                this.game.time.time + 600 - 50 * this._average),
              Utils.AudioUtils.playSound(i.STEP_SOUNDS[this._stepCount]),
              ++this._stepCount >= 2 && (this._stepCount = 0)))
          : (this._spriterGroup.setAnimationSpeedPercent(100),
            "odraz" === t &&
              this._velY > 0 &&
              this._spriterGroup.playAnimationByName("doskok")),
          this._spriterGroup.updateAnimation();
      }),
      (i.prototype.onAnimationFinished = function (t) {
        var e = this._spriterGroup.currentAnimationName;
        ("doskok" === e || "idle" === e) &&
          this._spriterGroup.playAnimationByName("running");
      }),
      (i.prototype.updatePhysics = function () {
        var e = this.game.time.physicsElapsed;
        (this._velY += t.Gameplay.GRAVITY * e),
          (this.y += this._velY * e),
          (this.y = Math.min(this.y, this._floor)),
          (this._standing = this.y >= this._floor),
          (this.x += this._velX * e),
          this._standing
            ? ((this._average = Math.max(0, this._average - (5 * e) / 3)),
              (this._velX =
                t.Gameplay.VELOCITY_X_MIN +
                ((t.Gameplay.VELOCITY_X_MAX - t.Gameplay.VELOCITY_X_MIN) *
                  Math.min(this._average, 5)) /
                  5))
            : (this._lastPressTime = this.game.time.time);
      }),
      (i.prototype.jump = function () {
        !this._standing ||
          this.game.time.time < this._jumpTime ||
          ((this._jumpTime = this.game.time.time + 150),
          (this._velY = this._calcs.jumpVelocity),
          this._spriterGroup.playAnimationByName("odraz"));
      }),
      (i.prototype.run = function () {
        var e = Phaser.Math.clamp(
          this.game.time.time - this._lastPressTime,
          150,
          5e3
        );
        this._lastPressTime = this.game.time.time;
        for (var i = 0, n = 1; 5 > n; n++)
          (this._samples[n - 1] = this._samples[n]), (i += this._samples[n]);
        (this._samples[4] = e), (i += e);
        var r = 0;
        i > 0 && (r = 5e3 / i),
          (this._average =
            this._average * (1 - this._cutoff) + r * this._cutoff),
          (this._velX =
            t.Gameplay.VELOCITY_X_MIN +
            ((t.Gameplay.VELOCITY_X_MAX - t.Gameplay.VELOCITY_X_MIN) *
              Math.min(this._average, 5)) /
              5);
      }),
      (i.prototype.penalty = function (t) {
        (this._average = Math.max(this._average - 1.5 * t, 0)),
          (this._samples[4] = 1e3 * t);
      }),
      (i.STEP_SOUNDS = ["step_1", "step_2", "step_3"]),
      i
    );
  })(Phaser.Sprite);
  t.Player = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (e) {
    function i(t) {
      e.call(this, t, i.OFFSET_X, i.OFFSET_Y, "Sprites"),
        (this.onGameOver = new Phaser.Signal()),
        this.anchor.set(0.5, 0.5),
        this.clear();
    }
    return (
      __extends(i, e),
      (i.prototype.clear = function () {
        (this._startTime = 0), (this._state = 0), (this.visible = !1);
      }),
      (i.prototype.updateSmiley = function (e, n) {
        var r = this.game.time.elapsed;
        if (this._startTime < t.Gameplay.TIME_SAFE)
          return void (this._startTime += r);
        var s = e.x < this.parent.x || n.x < this.parent.x;
        switch (this._state) {
          case 0:
            s ||
              ((this.frameName = "smileyBad"),
              (this._counter = i.TIME_RED),
              (this._state = 1),
              (this.visible = !0));
            break;
          case 1:
            if (s)
              (this.frameName = "smileyGood"),
                (this._counter = i.TIME_YELLOW),
                (this._state = 2),
                (this.visible = !0);
            else {
              this._counter = Math.max(0, this._counter - r);
              var a = Math.ceil(this._counter / 1e3);
              i.TIME_RED - this._counter > 1e3 &&
                (this.frameName = "redFont_" + a),
                0 === this._counter && this.onGameOver.dispatch();
            }
            break;
          case 2:
            s
              ? (this._counter -= r) <= 0 && (this.visible = !1)
              : (this._state = 0);
        }
      }),
      (i.OFFSET_X = 6),
      (i.OFFSET_Y = -180),
      (i.TIME_RED = t.Gameplay.TIME_FAIL),
      (i.TIME_YELLOW = t.Gameplay.TIME_YELLOW),
      i
    );
  })(Phaser.Sprite);
  t.Smiley = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (t) {
    function e(i, n) {
      t.call(this, i, n),
        (this._timeTotal = -1),
        (this.fixedToCamera = !0),
        this.cameraOffset.set(i.width / 2, 0);
      var r = new Phaser.Sprite(i, 0, 0, "Sprites", "cedule");
      r.anchor.set(0.5, 0),
        this.add(r),
        (this._bar = new Phaser.Sprite(
          i,
          e.BAR_X,
          e.BAR_Y,
          "Sprites",
          "pasek"
        )),
        (this._barCrop = new Phaser.Rectangle(0, 0, 0, this._bar.height)),
        this._bar.crop(this._barCrop, !1),
        this.add(this._bar),
        (this._textCenter = new Phaser.BitmapText(
          i,
          e.TEXT_X,
          e.TEXT_Y,
          "Font",
          "",
          64,
          "center"
        )),
        this._textCenter.anchor.set(0.5, 0.5),
        (this._textLeft = new Phaser.BitmapText(
          i,
          e.TEXT_X - 13,
          e.TEXT_Y,
          "Font",
          "",
          64,
          "right"
        )),
        this._textLeft.anchor.set(1, 0.5),
        (this._textRight = new Phaser.BitmapText(
          i,
          e.TEXT_X + 13,
          e.TEXT_Y,
          "Font",
          "",
          64,
          "left"
        )),
        this._textRight.anchor.set(0, 0.5),
        this.add(this._textLeft),
        this.add(this._textCenter),
        this.add(this._textRight);
    }
    return (
      __extends(e, t),
      (e.prototype.reset = function () {
        (this._barCrop.width = 0),
          this._bar.updateCrop(),
          (this._timeTotal = -1),
          (this._textCenter.text = ""),
          (this._textLeft.text = ""),
          (this._textRight.text = "");
      }),
      (e.prototype.updateTable = function (t) {
        this.updateTime(), this.setBarWidth(t);
      }),
      (e.prototype.updateTime = function () {
        var t = Math.floor(this._timeTotal / 1e3);
        this._timeTotal += this.game.time.elapsed;
        var e = Math.max(Math.floor(this._timeTotal / 1e3), 0);
        e > t &&
          ((this._textCenter.text = ":"),
          (this._textLeft.text = "" + Math.floor(e / 60)),
          (this._textRight.text = Utils.StringUtils.padNumber(e % 60, 2)));
      }),
      Object.defineProperty(e.prototype, "time", {
        get: function () {
          return this._timeTotal;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.setBarWidth = function (t) {
        (this._barCrop.width =
          (this.game.cache.getFrameByName("Sprites", "pasek").width / 5) * t),
          this._bar.updateCrop();
      }),
      Object.defineProperty(e.prototype, "centerText", {
        set: function (t) {
          this._textCenter.text = "" + t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.BAR_X = -98),
      (e.BAR_Y = 114),
      (e.TEXT_X = 0),
      (e.TEXT_Y = 65),
      e
    );
  })(Phaser.Group);
  t.Table = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (t) {
    function e(e) {
      t.call(this, e, e.width / 2, 150, "Sprites"),
        this.anchor.set(0.5, 0.5),
        (this._tweenShout = e.add.tween(this.scale).to(
          { x: 1.5, y: 1.5 },
          1200,
          function (t) {
            return Math.abs(Helper.Easing.sinWithExpDecay(t, 2, 0.75));
          },
          !1,
          200
        )),
        this._tweenShout.onComplete.add(function () {
          this.visible = !1;
        }, this),
        (this.visible = !1);
    }
    return (
      __extends(e, t),
      (e.prototype.show = function (t) {
        (this.visible = !0),
          this.scale.set(1, 1),
          (this.alpha = 1),
          (this.frameName = e.TITLES[t]),
          this.cameraOffset.set(this.game.width / 2, 190),
          this._tweenShout.start();
      }),
      (e.TITLES = ["PERFECT", "SUPER", "WOW"]),
      e
    );
  })(Phaser.Sprite);
  t.Title = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (e) {
    function i(n, r, s, a) {
      e.call(this, n, r),
        (this.onAchievement = new Phaser.Signal()),
        (this.onScore = new Phaser.Signal()),
        (this._hurdles = []),
        (this._hurdlesCount = 0),
        (this._closestHurdleIdx = 0),
        (this._calcs = s),
        (this._floor = a),
        (this._rnd = new Phaser.RandomDataGenerator([0])),
        (this._fallenHurdlesGroup = new Phaser.Group(n, this)),
        this.add(this._fallenHurdlesGroup),
        (this._shadow = new Phaser.Sprite(n, 0, 0, "Sprites", "stin")),
        this._shadow.anchor.set(0.5, 0.5),
        this.add(this._shadow),
        (this._hurdlesGroup = new Phaser.Group(n, this)),
        this.add(this._hurdlesGroup),
        (this._player = new t.Player(n, s, 0)),
        this.add(this._player),
        (this._hurdlesPool = new t.Pool(t.Hurdle, i.HURDLES_MAX, function () {
          var e = new t.Hurdle(n, s, 0);
          return e;
        })),
        (this._hurdlesPool.debug = t.Pool.DEBUG_ALLOCATION),
        (this._nextHurdleX = t.Gameplay.INITIAL_HURDLE_DISTANCE),
        (this.y = this._floor);
    }
    return (
      __extends(i, e),
      Object.defineProperty(i.prototype, "isMainPlayer", {
        set: function (t) {
          this._player.isMainPlayer = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (i.prototype.reset = function () {
        (this._nextHurdleX = t.Gameplay.INITIAL_HURDLE_DISTANCE),
          (this._closestHurdleIdx = 0);
        for (var e = this._hurdlesCount - 1; e >= 0; e--) {
          var i = this._hurdles[e];
          (this._hurdles[e] = this._hurdles[--this._hurdlesCount]),
            this._hurdlesPool.destroyItem(i),
            i.parent.remove(i);
        }
        this._player.resetPlayer(),
          (this._shadow.position.x = this._player.x),
          (this._consecutiveHurdles = 0);
      }),
      Object.defineProperty(i.prototype, "player", {
        get: function () {
          return this._player;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (i.prototype.randomize = function (t) {
        this._rnd.sow([t]);
      }),
      (i.prototype.updateTrack = function (e, i) {
        i && (this.cleanHurdles(e), this.generateHurdle(e)),
          this._player.updatePhysics(),
          (this._shadow.position.x = this._player.x);
        var n = 0.25 * (1 - this._player.y / -t.Gameplay.JUMP_HEIGHT) + 0.75;
        this._shadow.scale.set(n, n);
        var r = this.closestHurdle();
        if (null !== r) {
          var s = r.collided(this._player);
          s > 0 &&
            (this._player.penalty(s),
            (this._consecutiveHurdles = 0),
            this._player.isMainPlayer &&
              (1 === r.collisionMax
                ? Utils.AudioUtils.playSound("colision_small")
                : Utils.AudioUtils.playSound("colision_big"))),
            !r.pointsAdded &&
              this._player.standing &&
              r.x < this._player.x &&
              ((r.pointsAdded = !0),
              r.collisionMax <= 1 &&
                (this.onScore.dispatch(r),
                0 === r.collisionMax &&
                  (++this._consecutiveHurdles,
                  this._consecutiveHurdles % t.Gameplay.TITLES_FREQUENCY ===
                    0 &&
                    (this.onAchievement.dispatch(
                      this._consecutiveHurdles / t.Gameplay.TITLES_FREQUENCY - 1
                    ),
                    this._consecutiveHurdles ===
                      3 * t.Gameplay.TITLES_FREQUENCY &&
                      (this._consecutiveHurdles = 0)))));
        }
        for (var a = 0; a < this._hurdlesCount; a++)
          this._hurdles[a].updateAnim() &&
            this._fallenHurdlesGroup.add(this._hurdles[a]);
        this._player.updateAnim();
      }),
      (i.prototype.generateHurdle = function (t) {
        if (
          0 !== this._nextHurdleX &&
          (this._nextHurdleX < t + this.game.width + 128 ||
            this._nextHurdleX - this._player.x < 256)
        ) {
          var e = this._hurdlesPool.createItem();
          null !== e &&
            (e.clear(),
            e.position.set(this._nextHurdleX, 0),
            this.addHurdle(e),
            (this._nextHurdleX += this._rnd.integerInRange(
              this._calcs.hurdleDistanceMin,
              this._calcs.hurdleDistanceMax
            )));
        }
      }),
      (i.prototype.cleanHurdles = function (t) {
        for (
          var e = 0;
          e < this._hurdlesCount && this._hurdles[e].x < t - 128;

        )
          ++e;
        e > 0 &&
          (this.removeHurdlesWithIndexLessThan(e),
          (this._closestHurdleIdx -= e));
      }),
      (i.prototype.addHurdle = function (t) {
        (this._hurdles[this._hurdlesCount++] = t), this._hurdlesGroup.add(t);
      }),
      (i.prototype.removeHurdle = function (t) {
        for (var e = this._hurdlesCount - 1; e >= 0; e--)
          this._hurdles[e] === t &&
            ((this._hurdles[e] = this._hurdles[--this._hurdlesCount]),
            this._hurdlesPool.destroyItem(t),
            t.parent.remove(t));
      }),
      (i.prototype.removeHurdlesWithIndexLessThan = function (t) {
        for (var e = 0; t > e; ) {
          var i = this._hurdles[e];
          this._hurdlesPool.destroyItem(i), i.parent.remove(i), ++e;
        }
        for (; e < this._hurdlesCount; )
          (this._hurdles[e - t] = this._hurdles[e]),
            (this._hurdles[e] = null),
            ++e;
        this._hurdlesCount -= t;
      }),
      (i.prototype.closestHurdle = function () {
        if (
          (this._closestHurdleIdx < 0 && (this._closestHurdleIdx = 0),
          0 === this._hurdlesCount)
        )
          return null;
        var t = this._hurdles[this._closestHurdleIdx];
        if (
          t.x < this._player.x &&
          this._closestHurdleIdx < this._hurdlesCount - 1
        ) {
          var e = this._hurdles[this._closestHurdleIdx + 1];
          Math.abs(e.x - this._player.x) < Math.abs(t.x - this._player.x) &&
            ((t = e), ++this._closestHurdleIdx);
        }
        return t;
      }),
      (i.HURDLES_MAX = 16),
      i
    );
  })(Phaser.Group);
  t.Track = e;
})(RioSprint || (RioSprint = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t() {
      (this._items = []), (this._itemNames = []);
    }
    return (
      (t.prototype.add = function (t, e, i) {
        void 0 === e && (e = this._items.length),
          (void 0 === i || null === i) && (i = "item_" + e),
          (this._items[e] = t),
          (this._itemNames[i] = e);
      }),
      (t.prototype.getById = function (t) {
        return this._items[t];
      }),
      (t.prototype.getByName = function (t) {
        var e = this._itemNames[t];
        return "number" == typeof e ? this._items[e] : null;
      }),
      Object.defineProperty(t.prototype, "length", {
        get: function () {
          return this._items.length;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })();
  t.IdNameMap = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t() {
      this.reset();
    }
    return (
      Object.defineProperty(t.prototype, "current", {
        get: function () {
          return this._line.at(this._currentIndex);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "currentIndex", {
        get: function () {
          return this._currentIndex;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "next", {
        get: function () {
          return this._line.at(this._nextIndex);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "nextIndex", {
        get: function () {
          return this._nextIndex;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "lastTime", {
        set: function (t) {
          this._lastTime = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "line", {
        get: function () {
          return this._line;
        },
        set: function (t) {
          this._line = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.reset = function () {
        (this._lastTime = -1), (this._currentIndex = -1), (this._nextIndex = 0);
      }),
      (t.prototype.step = function (t) {
        var e = this._nextIndex,
          i = this._line.keys[e],
          n = i.time,
          r = t < this._lastTime;
        return (!r && n > this._lastTime && t >= n) ||
          (r && (n > this._lastTime || t >= n))
          ? ((this._lastTime = n),
            (this._currentIndex = e),
            ++e >= this._line.keys.length && (e = 0),
            (this._nextIndex = e),
            i)
          : null;
      }),
      t
    );
  })();
  t.LineStepper = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function e() {}
    return (
      (e.prototype.load = function (e) {
        (this._spriter = new t.Spriter()), (this._fileType = e.getType());
        var i = e.getNodes("folder");
        this.loadFolders(this._spriter, i), i.processed();
        var n = e.getNodes("tag_list");
        this.loadTags(this._spriter, n), n.processed();
        var r = e.getNodes("entity");
        return (
          this.loadEntities(this._spriter, r), r.processed(), this._spriter
        );
      }),
      (e.prototype.loadFolders = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getFolder(i),
            r = e.getChildNodes(i, "file");
          this.loadFiles(n, r), r.processed(), t.addFolder(n);
        }
      }),
      (e.prototype.loadFiles = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getFile(i);
          null !== n && t.addFile(n);
        }
      }),
      (e.prototype.loadTags = function (e, i) {
        if (0 !== i.length()) {
          var n;
          n = this._fileType !== t.eFileType.JSON ? i.getChildNodes(0, "i") : i;
          for (var r = 0; r < n.length(); r++) {
            var s = n.getTag(r);
            e.addTag(s);
          }
          this._fileType !== t.eFileType.JSON && n.processed();
        }
      }),
      (e.prototype.loadEntities = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getEntity(i),
            r = e.getChildNodes(i, "obj_info");
          this.loadObjInfo(n, r), r.processed();
          var s = e.getChildNodes(i, "character_map");
          this.loadCharMaps(n, s), s.processed();
          var a = e.getChildNodes(i, "var_defs");
          this.loadVariables(n, a), a.processed();
          var o = e.getChildNodes(i, "animation");
          this.loadAnimations(n, o), o.processed(), t.addEntity(n);
        }
      }),
      (e.prototype.loadObjInfo = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getObjectInfo(i);
          t.addObjectInfo(n);
        }
      }),
      (e.prototype.loadCharMaps = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getCharMap(i),
            r = e.getChildNodes(i, "map");
          this.loadCharMapEntries(n, r), r.processed(), t.addCharMap(n);
        }
      }),
      (e.prototype.loadCharMapEntries = function (t, e) {
        for (var i = 0; i < e.length(); i++)
          e.getCharMapEntry(i, t, this._spriter);
      }),
      (e.prototype.loadVariables = function (e, i) {
        if (0 !== i.length()) {
          var n;
          n = this._fileType !== t.eFileType.JSON ? i.getChildNodes(0, "i") : i;
          for (var r = 0; r < n.length(); r++) {
            var s = n.getVariable(r);
            e.addVariable(s);
          }
          this._fileType !== t.eFileType.JSON && n.processed();
        }
      }),
      (e.prototype.loadAnimations = function (e, i) {
        for (var n = 0; n < i.length(); n++) {
          var r = i.getAnimation(n),
            s = i.getChildNodes(n, "mainline");
          this.loadMainline(r, s), s.processed();
          var a = i.getChildNodes(n, "timeline");
          this.loadTimelines(r, a), a.processed();
          var o = i.getChildNodes(n, "soundline");
          this.loadSoundlines(r, o), o.processed();
          var h = i.getChildNodes(n, "eventline");
          this.loadEventlines(r, h), h.processed();
          var p = i.getChildNodes(n, "meta");
          if (p.length() > 0) {
            var l = p.getChildNodes(
              0,
              this._fileType !== t.eFileType.JSON ? "varline" : "valline"
            );
            this.loadVarlines(e, r, l), l.processed();
            var u = p.getChildNodes(0, "tagline");
            this.loadTaglines(r, u), u.processed();
          }
          p.processed(), e.addAnimation(r);
        }
      }),
      (e.prototype.loadMainline = function (e, i) {
        var n = i.getMainline(0);
        n.type = t.eTimelineType.MAIN_LINE;
        var r = i.getChildNodes(0, "key");
        this.loadMainlineKeys(n, r), r.processed(), (e.mainline = n);
      }),
      (e.prototype.loadMainlineKeys = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          for (
            var n = e.getMainlineKey(i),
              r = e.getChildNodes(i, "bone_ref"),
              s = 0;
            s < r.length();
            s++
          )
            n.addBoneRef(r.getRef(s));
          r.processed();
          for (
            var a = e.getChildNodes(i, "object_ref"), o = 0;
            o < a.length();
            o++
          )
            n.addObjectRef(a.getRef(o));
          a.processed(), t.add(n);
        }
      }),
      (e.prototype.loadTimelines = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getTimeline(i),
            r = e.getChildNodes(i, "key");
          this.loadTimelineKeys(n, r), r.processed(), t.addTimeline(n);
        }
      }),
      (e.prototype.loadTimelineKeys = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getTimelineKey(i, this._spriter);
          t.add(n);
        }
      }),
      (e.prototype.loadSoundlines = function (e, i) {
        for (var n = 0; n < i.length(); n++) {
          var r = i.getSoundline(n);
          r.type = t.eTimelineType.SOUND_LINE;
          var s = i.getChildNodes(n, "key");
          this.loadKeys(r, s), s.processed(), e.addLine(r);
        }
      }),
      (e.prototype.loadKeys = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getKey(i);
          t.add(n);
        }
      }),
      (e.prototype.loadEventlines = function (e, i) {
        for (var n = 0; n < i.length(); n++) {
          var r = i.getEventline(n);
          r.type = t.eTimelineType.EVENT_LINE;
          var s = i.getChildNodes(n, "key");
          this.loadKeys(r, s), s.processed(), e.addLine(r);
        }
      }),
      (e.prototype.loadTaglines = function (e, i) {
        for (var n = 0; n < i.length(); n++) {
          var r = i.getTagline(n);
          r.type = t.eTimelineType.TAG_LINE;
          var s = i.getChildNodes(n, "key");
          this.loadTagKeys(r, s), s.processed(), e.addLine(r);
        }
      }),
      (e.prototype.loadTagKeys = function (t, e) {
        for (var i = 0; i < e.length(); i++) {
          var n = e.getTagKey(i),
            r = e.getChildNodes(i, "tag"),
            s = r.getTagChanges(this._spriter);
          r.processed(), (n.tagsOn = s), t.add(n);
        }
      }),
      (e.prototype.loadVarlines = function (t, e, i) {
        for (var n = 0; n < i.length(); n++) {
          var r = i.getVarline(n),
            s = t.getVariableById(r.varDefId).type,
            a = i.getChildNodes(n, "key");
          this.loadVariableKeys(r, a, s), a.processed(), e.addLine(r);
        }
      }),
      (e.prototype.loadVariableKeys = function (t, e, i) {
        for (var n = 0; n < e.length(); n++) {
          var r = e.getVariableKey(n, i);
          t.add(r);
        }
      }),
      e
    );
  })();
  t.Loader = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t(t, e) {
      (this._file = t), (this._nodeList = e);
    }
    return (
      (t.prototype.length = function () {
        return this._nodeList.length;
      }),
      (t.prototype.processed = function () {
        this._file.processed();
      }),
      (t.prototype.getChildNodes = function (t, e) {
        return this._file.getNodesForElement(this._nodeList[t], e);
      }),
      (t.prototype.getFolder = function (t) {
        return this._file.getFolder(this._nodeList[t]);
      }),
      (t.prototype.getFile = function (t) {
        return this._file.getFile(this._nodeList[t]);
      }),
      (t.prototype.getTag = function (t) {
        return this._file.getTag(this._nodeList[t]);
      }),
      (t.prototype.getEntity = function (t) {
        return this._file.getEntity(this._nodeList[t]);
      }),
      (t.prototype.getObjectInfo = function (t) {
        return this._file.getObjectInfo(this._nodeList[t], t);
      }),
      (t.prototype.getCharMap = function (t) {
        return this._file.getCharMap(this._nodeList[t]);
      }),
      (t.prototype.getCharMapEntry = function (t, e, i) {
        this._file.getCharMapEntry(this._nodeList[t], e, i);
      }),
      (t.prototype.getVariable = function (t) {
        return this._file.getVariable(this._nodeList[t]);
      }),
      (t.prototype.getAnimation = function (t) {
        return this._file.getAnimation(this._nodeList[t]);
      }),
      (t.prototype.getMainline = function (t) {
        return this._file.getBaseline(this._nodeList[t]);
      }),
      (t.prototype.getMainlineKey = function (t) {
        return this._file.getMainlineKey(this._nodeList[t]);
      }),
      (t.prototype.getRef = function (t) {
        return this._file.getRef(this._nodeList[t]);
      }),
      (t.prototype.getTimeline = function (t) {
        return this._file.getTimeline(this._nodeList[t]);
      }),
      (t.prototype.getSoundline = function (t) {
        return this._file.getBaseline(this._nodeList[t]);
      }),
      (t.prototype.getEventline = function (t) {
        return this._file.getBaseline(this._nodeList[t]);
      }),
      (t.prototype.getTagline = function (t) {
        return this._file.getBaseline(this._nodeList[t]);
      }),
      (t.prototype.getVarline = function (t) {
        return this._file.getVarline(this._nodeList[t]);
      }),
      (t.prototype.getKey = function (t) {
        return this._file.getKey(this._nodeList[t]);
      }),
      (t.prototype.getTagKey = function (t) {
        return this._file.getTagKey(this._nodeList[t]);
      }),
      (t.prototype.getVariableKey = function (t, e) {
        return this._file.getVariableKey(this._nodeList[t], e);
      }),
      (t.prototype.getTimelineKey = function (t, e) {
        return this._file.getTimelineKey(this._nodeList[t], t, e);
      }),
      (t.prototype.getTagChanges = function (t) {
        for (var e = 0, i = 0; i < this.length(); i++) {
          var n = this._file.getTagChange(this._nodeList[i]);
          e |= 1 << n;
        }
        return e;
      }),
      t
    );
  })();
  t.NodeListBin = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t(t, e) {
      (this._file = t),
        (this._nodeList = e),
        Array.isArray(e) || (e.length = 1);
    }
    return (
      (t.prototype.length = function () {
        return this._nodeList.length;
      }),
      (t.prototype.processed = function () {
        this._file.processed();
      }),
      (t.prototype.getNode = function (t) {
        return Array.isArray(this._nodeList)
          ? this._nodeList[t]
          : this._nodeList;
      }),
      (t.prototype.getChildNodes = function (t, e) {
        return this._file.getNodesForElement(this.getNode(t), e);
      }),
      (t.prototype.getFolder = function (t) {
        return this._file.getFolder(this.getNode(t));
      }),
      (t.prototype.getFile = function (t) {
        return this._file.getFile(this.getNode(t));
      }),
      (t.prototype.getTag = function (t) {
        return this._file.getTag(this.getNode(t));
      }),
      (t.prototype.getEntity = function (t) {
        return this._file.getEntity(this.getNode(t));
      }),
      (t.prototype.getObjectInfo = function (t) {
        return this._file.getObjectInfo(this.getNode(t), t);
      }),
      (t.prototype.getCharMap = function (t) {
        return this._file.getCharMap(this.getNode(t));
      }),
      (t.prototype.getCharMapEntry = function (t, e, i) {
        this._file.getCharMapEntry(this.getNode(t), e, i);
      }),
      (t.prototype.getVariable = function (t) {
        return this._file.getVariable(this.getNode(t));
      }),
      (t.prototype.getAnimation = function (t) {
        return this._file.getAnimation(this.getNode(t));
      }),
      (t.prototype.getMainline = function (t) {
        return this._file.getBaseline(this.getNode(t));
      }),
      (t.prototype.getMainlineKey = function (t) {
        return this._file.getMainlineKey(this.getNode(t));
      }),
      (t.prototype.getRef = function (t) {
        return this._file.getRef(this.getNode(t));
      }),
      (t.prototype.getTimeline = function (t) {
        return this._file.getTimeline(this.getNode(t));
      }),
      (t.prototype.getSoundline = function (t) {
        return this._file.getBaseline(this.getNode(t));
      }),
      (t.prototype.getEventline = function (t) {
        return this._file.getBaseline(this.getNode(t));
      }),
      (t.prototype.getTagline = function (t) {
        return this._file.getBaseline(this.getNode(t));
      }),
      (t.prototype.getVarline = function (t) {
        return this._file.getVarline(this.getNode(t));
      }),
      (t.prototype.getKey = function (t) {
        return this._file.getKey(this.getNode(t));
      }),
      (t.prototype.getTagKey = function (t) {
        return this._file.getTagKey(this.getNode(t));
      }),
      (t.prototype.getVariableKey = function (t, e) {
        return this._file.getVariableKey(this.getNode(t), e);
      }),
      (t.prototype.getTimelineKey = function (t, e) {
        return this._file.getTimelineKey(this.getNode(t), t, e);
      }),
      (t.prototype.getTagChanges = function (t) {
        for (var e = 0, i = 0; i < this.length(); i++) {
          var n = this._file.getTagChange(this.getNode(i));
          e |= 1 << n;
        }
        return e;
      }),
      t
    );
  })();
  t.NodeListJSON = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t(t, e) {
      (this._file = t), (this._nodeList = e);
    }
    return (
      (t.prototype.length = function () {
        return this._nodeList.length;
      }),
      (t.prototype.processed = function () {
        this._file.processed();
      }),
      (t.prototype.getChildNodes = function (t, e) {
        return this._file.getNodesForElement(this._nodeList.item(t), e);
      }),
      (t.prototype.getFolder = function (t) {
        return this._file.getFolder(this._nodeList.item(t));
      }),
      (t.prototype.getFile = function (t) {
        return this._file.getFile(this._nodeList.item(t));
      }),
      (t.prototype.getTag = function (t) {
        return this._file.getTag(this._nodeList.item(t));
      }),
      (t.prototype.getEntity = function (t) {
        return this._file.getEntity(this._nodeList.item(t));
      }),
      (t.prototype.getObjectInfo = function (t) {
        return this._file.getObjectInfo(this._nodeList.item(t), t);
      }),
      (t.prototype.getCharMap = function (t) {
        return this._file.getCharMap(this._nodeList.item(t));
      }),
      (t.prototype.getCharMapEntry = function (t, e, i) {
        this._file.getCharMapEntry(this._nodeList.item(t), e, i);
      }),
      (t.prototype.getVariable = function (t) {
        return this._file.getVariable(this._nodeList.item(t));
      }),
      (t.prototype.getAnimation = function (t) {
        return this._file.getAnimation(this._nodeList.item(t));
      }),
      (t.prototype.getMainline = function (t) {
        return this._file.getBaseline(this._nodeList.item(t));
      }),
      (t.prototype.getMainlineKey = function (t) {
        return this._file.getMainlineKey(this._nodeList.item(t));
      }),
      (t.prototype.getRef = function (t) {
        return this._file.getRef(this._nodeList.item(t));
      }),
      (t.prototype.getTimeline = function (t) {
        return this._file.getTimeline(this._nodeList.item(t));
      }),
      (t.prototype.getSoundline = function (t) {
        return this._file.getBaseline(this._nodeList.item(t));
      }),
      (t.prototype.getEventline = function (t) {
        return this._file.getBaseline(this._nodeList.item(t));
      }),
      (t.prototype.getTagline = function (t) {
        return this._file.getBaseline(this._nodeList.item(t));
      }),
      (t.prototype.getVarline = function (t) {
        return this._file.getVarline(this._nodeList.item(t));
      }),
      (t.prototype.getKey = function (t) {
        return this._file.getKey(this._nodeList.item(t));
      }),
      (t.prototype.getTagKey = function (t) {
        return this._file.getTagKey(this._nodeList.item(t));
      }),
      (t.prototype.getVariableKey = function (t, e) {
        return this._file.getVariableKey(this._nodeList.item(t), e);
      }),
      (t.prototype.getTimelineKey = function (t, e) {
        return this._file.getTimelineKey(this._nodeList.item(t), t, e);
      }),
      (t.prototype.getTagChanges = function (t) {
        for (var e = 0, i = 0; i < this.length(); i++) {
          var n = this._file.getTagChange(this._nodeList.item(i));
          e |= 1 << n;
        }
        return e;
      }),
      t
    );
  })();
  t.NodeListXml = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  !(function (t) {
    (t[(t.XML = 0)] = "XML"),
      (t[(t.JSON = 1)] = "JSON"),
      (t[(t.BIN = 2)] = "BIN");
  })(t.eFileType || (t.eFileType = {}));
  var e =
    (t.eFileType,
    (function () {
      function t() {}
      return (
        (t.prototype.processed = function () {
          this.popMinDefsStack();
        }),
        (t.prototype.setMinimized = function (t, e) {
          void 0 === e && (e = null),
            (this._minimized = t),
            (this._minDefs = e),
            t && ((this._minDefsStack = []), null === e);
        }),
        (t.prototype.getFileNameWithoutExtension = function (t) {
          var e = t.split("\\").pop().split("/").pop().split(".")[0];
          return e;
        }),
        (t.prototype.translateElementName = function (t) {
          if (this._minimized) {
            if (this._minDefs.name !== t) return t;
            null !== this._minDefs.minName && (t = this._minDefs.minName);
          }
          return t;
        }),
        (t.prototype.translateChildElementName = function (t) {
          if (this._minimized && null !== this._minDefs) {
            var e = this._minDefs.childElements;
            null !== e && (t = null === e[t] ? t : e[t].minName);
          }
          return t;
        }),
        (t.prototype.translateAttributeName = function (t) {
          if (this._minimized && null !== this._minDefs) {
            var e = this._minDefs.attributes;
            null !== e && (t = null === e[t] ? t : e[t]);
          }
          return t;
        }),
        (t.prototype.setMinDefsToElementName = function (t) {
          if (this._minimized) {
            this._minDefsStack.push(this._minDefs);
            var e = this._minDefs.childElements[t];
            this._minDefs = e;
          }
        }),
        (t.prototype.popMinDefsStack = function () {
          this._minimized && (this._minDefs = this._minDefsStack.pop());
        }),
        t
      );
    })());
  t.SpriterFile = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(t) {
      e.call(this),
        (this._elements = {
          spriter_data: 1,
          folder: 2,
          file: 3,
          entity: 4,
          obj_info: 5,
          frames: 6,
          i: 7,
          animation: 8,
          mainline: 9,
          key: 10,
          bone_ref: 11,
          object_ref: 12,
          timeline: 13,
          bone: 14,
          object: 15,
        }),
        (this._smallOffset = !1),
        (this._bin = new DataView(t)),
        (this._smallOffset = 1 === this._bin.getUint8(0));
    }
    return (
      __extends(i, e),
      (i.prototype.getType = function () {
        return t.eFileType.BIN;
      }),
      (i.prototype.readUint8 = function () {
        return this._bin.getUint8(this._tmpPosition++);
      }),
      (i.prototype.readInt8 = function () {
        return this._bin.getInt8(this._tmpPosition++);
      }),
      (i.prototype.readUint16 = function () {
        var t = this._bin.getUint16(this._tmpPosition, !0);
        return (this._tmpPosition += 2), t;
      }),
      (i.prototype.readInt16 = function () {
        var t = this._bin.getInt16(this._tmpPosition, !0);
        return (this._tmpPosition += 2), t;
      }),
      (i.prototype.readUint32 = function () {
        var t = this._bin.getUint32(this._tmpPosition, !0);
        return (this._tmpPosition += 4), t;
      }),
      (i.prototype.readInt32 = function () {
        var t = this._bin.getInt32(this._tmpPosition, !0);
        return (this._tmpPosition += 4), t;
      }),
      (i.prototype.readFixed16_16 = function () {
        var t = this._bin.getInt32(this._tmpPosition, !0);
        return (this._tmpPosition += 4), t / 65536;
      }),
      (i.prototype.readFixed1_7 = function () {
        var t = 255 & this._bin.getInt8(this._tmpPosition++);
        return t / 128;
      }),
      (i.prototype.readString = function () {
        for (
          var t = [], e = this._bin.getUint8(this._tmpPosition++) - 1;
          e >= 0;
          e--
        )
          t.push(this._bin.getUint8(this._tmpPosition++));
        return String.fromCharCode.apply(null, t);
      }),
      (i.prototype.getNodes = function (e) {
        return new t.NodeListBin(
          this,
          this.getSubNodesOfElementType(1, this._elements[e])
        );
      }),
      (i.prototype.getNodesForElement = function (e, i) {
        return new t.NodeListBin(
          this,
          this.getSubNodesOfElementType(e, this._elements[i])
        );
      }),
      (i.prototype.getSubNodesOfElementType = function (t, e) {
        var i = [],
          n = this._bin.getUint8(t + 1);
        t += 2;
        for (var r = 0; n > r; r++) {
          var s = this._smallOffset
              ? this._bin.getUint16(t + 2 * r, !0)
              : this._bin.getUint32(t + 4 * r, !0),
            a = this._bin.getUint8(t + s);
          a === e && i.push(t + s);
        }
        return i;
      }),
      (i.prototype.getAttribsPosition = function (t) {
        var e = this._bin.getUint8(t + 1);
        return t + 2 + e * (this._smallOffset ? 2 : 4);
      }),
      (i.prototype.getFolder = function (e) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var n = 0, r = "", s = this._bin.getUint8(this._tmpPosition++) - 1;
          s >= 0;
          s--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_FOLDER_ID:
              n = this.readUint8();
              break;
            case i.ATTR_FOLDER_NAME:
              r = this.readString();
          }
        return new t.Folder(n, r);
      }),
      (i.prototype.getFile = function (e) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var n = 0,
            r = "",
            s = 0,
            a = 0,
            o = this._bin.getUint8(this._tmpPosition++) - 1;
          o >= 0;
          o--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_FILE_ID:
              n = this.readUint8();
              break;
            case i.ATTR_FILE_NAME:
              r = this.readString();
              break;
            case i.ATTR_FILE_PIVOT_X:
              s = this.readFixed16_16();
              break;
            case i.ATTR_FILE_PIVOT_Y:
              a = this.readFixed16_16();
              break;
            case i.ATTR_FILE_WIDTH:
            case i.ATTR_FILE_HEIGHT:
              this._tmpPosition += 2;
          }
        return new t.File(n, this.getFileNameWithoutExtension(r), s, 1 - a);
      }),
      (i.prototype.getTag = function (t) {
        return null;
      }),
      (i.prototype.getEntity = function (e) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var n = 0, r = "", s = this._bin.getUint8(this._tmpPosition++) - 1;
          s >= 0;
          s--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_ENTITY_ID:
              n = this.readUint8();
              break;
            case i.ATTR_ENTITY_NAME:
              r = this.readString();
          }
        return new t.Entity(n, r);
      }),
      (i.prototype.getObjectInfo = function (e, n) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var r = "",
            s = 0,
            a = 0,
            o = 0,
            h = this._bin.getUint8(this._tmpPosition++) - 1;
          h >= 0;
          h--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_OBJ_INFO_NAME:
              r = this.readString();
              break;
            case i.ATTR_OBJ_INFO_TYPE:
              1 === this.readUint8() && (s = 1);
              break;
            case i.ATTR_OBJ_INFO_WIDTH:
              a = this.readFixed16_16();
              break;
            case i.ATTR_OBJ_INFO_HEIGHT:
              o = this.readFixed16_16();
          }
        return new t.ObjectInfo(n, r, s, a, o, 0, 0);
      }),
      (i.prototype.getCharMap = function (t) {
        return null;
      }),
      (i.prototype.getCharMapEntry = function (t, e, i) {
        return null;
      }),
      (i.prototype.getVariable = function (t) {
        return null;
      }),
      (i.prototype.getAnimation = function (e) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var n = 0,
            r = "",
            s = 0,
            a = t.eAnimationLooping.LOOPING,
            o = this._bin.getUint8(this._tmpPosition++) - 1;
          o >= 0;
          o--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_ANIMATION_ID:
              n = this.readUint8();
              break;
            case i.ATTR_ANIMATION_NAME:
              r = this.readString();
              break;
            case i.ATTR_ANIMATION_LENGTH:
              s = this.readUint32();
              break;
            case i.ATTR_ANIMATION_INTERVAL:
              this._tmpPosition += 2;
              break;
            case i.ATTR_ANIMATION_LOOPING:
              a =
                1 === this.readUint8()
                  ? t.eAnimationLooping.LOOPING
                  : t.eAnimationLooping.NO_LOOPING;
          }
        return new t.Animation(n, r, s, a);
      }),
      (i.prototype.getMainlineKey = function (e) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var n = 0, r = 0, s = this._bin.getUint8(this._tmpPosition++) - 1;
          s >= 0;
          s--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_MAINLINE_KEY_ID:
              n = this.readUint8();
              break;
            case i.ATTR_MAINLINE_KEY_TIME:
              r = this.readUint32();
          }
        return new t.KeyMainline(n, r);
      }),
      (i.prototype.getRef = function (e) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var n = 0,
            r = -1,
            s = 0,
            a = 0,
            o = 0,
            h = this._bin.getUint8(this._tmpPosition++) - 1;
          h >= 0;
          h--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_BONE_REF_ID:
            case i.ATTR_OBJ_REF_ID:
              n = this.readUint8();
              break;
            case i.ATTR_BONE_REF_PARENT:
            case i.ATTR_OBJ_REF_PARENT:
              r = this.readUint8();
              break;
            case i.ATTR_BONE_REF_TIMELINE:
            case i.ATTR_OBJ_REF_TIMELINE:
              s = this.readUint8();
              break;
            case i.ATTR_BONE_REF_KEY:
            case i.ATTR_OBJ_REF_KEY:
              a = this.readUint8();
              break;
            case i.ATTR_OBJ_REF_Z:
              o = this.readUint8();
              break;
            case i.ATTR_OBJ_REF_NAME:
              this.readString();
              break;
            case i.ATTR_OBJ_REF_FOLDER:
            case i.ATTR_OBJ_REF_FILE:
              ++this._tmpPosition;
              break;
            case i.ATTR_OBJ_REF_ABS_X:
            case i.ATTR_OBJ_REF_ABS_Y:
            case i.ATTR_OBJ_REF_ABS_PIVOT_X:
            case i.ATTR_OBJ_REF_ABS_PIVOT_Y:
            case i.ATTR_OBJ_REF_ABS_SCALE_X:
            case i.ATTR_OBJ_REF_ABS_SCALE_Y:
            case i.ATTR_OBJ_REF_ANGLE:
              this._tmpPosition += 4;
              break;
            case i.ATTR_OBJ_REF_ALPHA:
              ++this._tmpPosition;
          }
        return new t.Ref(n, r, s, a, o);
      }),
      (i.prototype.getTimeline = function (e) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var n = 0,
            r = "",
            s = 0,
            a = 0,
            o = this._bin.getUint8(this._tmpPosition++) - 1;
          o >= 0;
          o--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_TIMELINE_ID:
              n = this.readUint8();
              break;
            case i.ATTR_TIMELINE_NAME:
              r = this.readString();
              break;
            case i.ATTR_TIMELINE_OBJ:
              s = this.readUint8();
              break;
            case i.ATTR_TIMELINE_OBJ_TYPE:
              1 === this.readUint8() && (a = 1);
          }
        return new t.Timeline(n, r, a, s);
      }),
      (i.prototype.getBaseline = function (t) {
        return null;
      }),
      (i.prototype.getVarline = function (t) {
        return null;
      }),
      (i.prototype.getKey = function (t) {
        return null;
      }),
      (i.prototype.getTagKey = function (t) {
        return null;
      }),
      (i.prototype.getVariableKey = function (t, e) {
        return null;
      }),
      (i.prototype.getTimelineKey = function (e, n, r) {
        this._tmpPosition = this.getAttribsPosition(e);
        for (
          var s = 0,
            a = 1,
            o = 0,
            h = 0,
            p = 0,
            l = 0,
            u = 0,
            c = this._bin.getUint8(this._tmpPosition++) - 1;
          c >= 0;
          c--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_TIMELINE_KEY_ID:
              ++this._tmpPosition;
              break;
            case i.ATTR_TIMELINE_KEY_TIME:
              s = this.readUint32();
              break;
            case i.ATTR_TIMELINE_KEY_SPIN:
              a = this.readInt8();
              break;
            case i.ATTR_TIMELINE_KEY_CURVE:
              o = this.readUint8();
              break;
            case i.ATTR_TIMELINE_KEY_C1:
              h = this.readFixed1_7();
              break;
            case i.ATTR_TIMELINE_KEY_C2:
              p = this.readFixed1_7();
          }
        e += 2;
        var _ =
            e +
            (this._smallOffset
              ? this._bin.getUint16(e, !0)
              : this._bin.getUint32(e, !0)),
          d = this._bin.getUint8(_),
          f = null,
          m = !1;
        14 === d
          ? (f = new t.KeyBone(n, s, a))
          : 15 === d && ((f = new t.KeyObject(n, s, a)), (m = !0)),
          0 !== o && f.setCurve(o, h, p, l, u),
          (this._tmpPosition = this.getAttribsPosition(_));
        var g = f.info;
        (g.x = 0),
          (g.y = 0),
          (g.scaleX = 1),
          (g.scaleY = 1),
          (g.angle = 0),
          (g.alpha = 1);
        for (
          var y = 0,
            v = !1,
            T = 0,
            b = !1,
            A = 0,
            I = 0,
            c = this._bin.getUint8(this._tmpPosition++) - 1;
          c >= 0;
          c--
        )
          switch (this._bin.getUint8(this._tmpPosition++)) {
            case i.ATTR_BONE_X:
            case i.ATTR_OBJ_X:
              g.x = this.readFixed16_16();
              break;
            case i.ATTR_BONE_Y:
            case i.ATTR_OBJ_Y:
              g.y = -this.readFixed16_16();
              break;
            case i.ATTR_BONE_ANGLE:
            case i.ATTR_OBJ_ANGLE:
              g.angle = 360 - this.readFixed16_16();
              break;
            case i.ATTR_BONE_SCALE_X:
            case i.ATTR_OBJ_SCALE_X:
              g.scaleX = this.readFixed16_16();
              break;
            case i.ATTR_BONE_SCALE_Y:
            case i.ATTR_OBJ_SCALE_Y:
              g.scaleY = this.readFixed16_16();
              break;
            case i.ATTR_OBJ_FOLDER:
              A = this.readUint8();
              break;
            case i.ATTR_OBJ_FILE:
              I = this.readUint8();
              break;
            case i.ATTR_OBJ_PIVOT_X:
              (y = this.readFixed16_16()), (v = !0);
              break;
            case i.ATTR_OBJ_PIVOT_Y:
              (T = this.readFixed16_16()), (b = !0);
              break;
            case i.ATTR_OBJ_ALPHA:
              g.alpha = this.readFixed1_7();
          }
        if (m) {
          f.setFolderAndFile(A, I);
          var S = r.getFolderById(A).getFileById(I);
          (g.pivotX = v ? y : S.pivotX),
            (g.pivotY = 1 - (b ? T : 1 - S.pivotY));
        }
        return f;
      }),
      (i.prototype.getTagChange = function (t) {
        return null;
      }),
      (i.ATTR_VERSION = 0),
      (i.ATTR_GENERATOR = 1),
      (i.ATTR_GENERATOR_VERSION = 2),
      (i.ATTR_FOLDER_ID = 0),
      (i.ATTR_FOLDER_NAME = 1),
      (i.ATTR_FILE_ID = 0),
      (i.ATTR_FILE_NAME = 1),
      (i.ATTR_FILE_WIDTH = 2),
      (i.ATTR_FILE_HEIGHT = 3),
      (i.ATTR_FILE_PIVOT_X = 4),
      (i.ATTR_FILE_PIVOT_Y = 5),
      (i.ATTR_ENTITY_ID = 0),
      (i.ATTR_ENTITY_NAME = 1),
      (i.ATTR_OBJ_INFO_NAME = 0),
      (i.ATTR_OBJ_INFO_TYPE = 1),
      (i.ATTR_OBJ_INFO_WIDTH = 2),
      (i.ATTR_OBJ_INFO_HEIGHT = 3),
      (i.ATTR_FRAMES_I_FOLDER = 0),
      (i.ATTR_FRAMES_I_FILE = 1),
      (i.ATTR_ANIMATION_ID = 0),
      (i.ATTR_ANIMATION_NAME = 1),
      (i.ATTR_ANIMATION_LENGTH = 2),
      (i.ATTR_ANIMATION_INTERVAL = 3),
      (i.ATTR_ANIMATION_LOOPING = 4),
      (i.ATTR_MAINLINE_KEY_ID = 0),
      (i.ATTR_MAINLINE_KEY_TIME = 1),
      (i.ATTR_BONE_REF_ID = 0),
      (i.ATTR_BONE_REF_PARENT = 1),
      (i.ATTR_BONE_REF_TIMELINE = 2),
      (i.ATTR_BONE_REF_KEY = 3),
      (i.ATTR_OBJ_REF_ID = 4),
      (i.ATTR_OBJ_REF_PARENT = 5),
      (i.ATTR_OBJ_REF_TIMELINE = 6),
      (i.ATTR_OBJ_REF_KEY = 7),
      (i.ATTR_OBJ_REF_NAME = 8),
      (i.ATTR_OBJ_REF_Z = 9),
      (i.ATTR_OBJ_REF_FOLDER = 10),
      (i.ATTR_OBJ_REF_FILE = 11),
      (i.ATTR_OBJ_REF_ABS_X = 12),
      (i.ATTR_OBJ_REF_ABS_Y = 13),
      (i.ATTR_OBJ_REF_ABS_PIVOT_X = 14),
      (i.ATTR_OBJ_REF_ABS_PIVOT_Y = 15),
      (i.ATTR_OBJ_REF_ABS_SCALE_X = 16),
      (i.ATTR_OBJ_REF_ABS_SCALE_Y = 17),
      (i.ATTR_OBJ_REF_ANGLE = 18),
      (i.ATTR_OBJ_REF_ALPHA = 19),
      (i.ATTR_TIMELINE_ID = 0),
      (i.ATTR_TIMELINE_NAME = 1),
      (i.ATTR_TIMELINE_OBJ = 2),
      (i.ATTR_TIMELINE_OBJ_TYPE = 3),
      (i.ATTR_TIMELINE_KEY_ID = 0),
      (i.ATTR_TIMELINE_KEY_TIME = 1),
      (i.ATTR_TIMELINE_KEY_SPIN = 2),
      (i.ATTR_TIMELINE_KEY_CURVE = 3),
      (i.ATTR_TIMELINE_KEY_C1 = 4),
      (i.ATTR_TIMELINE_KEY_C2 = 5),
      (i.ATTR_BONE_X = 0),
      (i.ATTR_BONE_Y = 1),
      (i.ATTR_BONE_ANGLE = 2),
      (i.ATTR_BONE_SCALE_X = 3),
      (i.ATTR_BONE_SCALE_Y = 4),
      (i.ATTR_OBJ_FOLDER = 5),
      (i.ATTR_OBJ_FILE = 6),
      (i.ATTR_OBJ_X = 7),
      (i.ATTR_OBJ_Y = 8),
      (i.ATTR_OBJ_SCALE_X = 9),
      (i.ATTR_OBJ_SCALE_Y = 10),
      (i.ATTR_OBJ_PIVOT_X = 11),
      (i.ATTR_OBJ_PIVOT_Y = 12),
      (i.ATTR_OBJ_ANGLE = 13),
      (i.ATTR_OBJ_ALPHA = 14),
      i
    );
  })(t.SpriterFile);
  t.SpriterBin = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(t, i) {
      void 0 === i && (i = null), e.call(this), (this._json = t);
      var n = void 0 !== t.min;
      this.setMinimized(n, i);
    }
    return (
      __extends(i, e),
      (i.prototype.getType = function () {
        return t.eFileType.JSON;
      }),
      (i.prototype.parseInt = function (t, e, i) {
        void 0 === i && (i = 0);
        var n = t[this.translateAttributeName(e)];
        return void 0 === n ? i : "number" == typeof n ? n : parseInt(n);
      }),
      (i.prototype.parseFloat = function (t, e, i) {
        void 0 === i && (i = 0);
        var n = t[this.translateAttributeName(e)];
        return void 0 === n ? i : "number" == typeof n ? n : parseFloat(n);
      }),
      (i.prototype.parseBoolean = function (t, e, i) {
        void 0 === i && (i = !1);
        var n = t[this.translateAttributeName(e)];
        return void 0 === n ? i : "boolean" == typeof n ? n : "true" === n;
      }),
      (i.prototype.parseString = function (t, e, i) {
        void 0 === i && (i = "");
        var n = t[this.translateAttributeName(e)];
        return void 0 === n ? i : n;
      }),
      (i.prototype.getNodes = function (e) {
        this.setMinDefsToElementName(e);
        var i = this.translateElementName(e);
        return new t.NodeListJSON(
          this,
          void 0 !== this._json[i] ? this._json[i] : []
        );
      }),
      (i.prototype.getNodesForElement = function (e, i) {
        this.setMinDefsToElementName(i);
        var n = this.translateElementName(i);
        return new t.NodeListJSON(this, void 0 !== e[n] ? e[n] : []);
      }),
      (i.prototype.getFolder = function (e) {
        return new t.Folder(
          this.parseInt(e, "id"),
          this.parseString(e, "name")
        );
      }),
      (i.prototype.getFile = function (e) {
        return void 0 !== e.type && "sound" === e.type
          ? null
          : new t.File(
              this.parseInt(e, "id"),
              this.getFileNameWithoutExtension(this.parseString(e, "name")),
              this.parseFloat(e, "pivot_x"),
              1 - this.parseFloat(e, "pivot_y")
            );
      }),
      (i.prototype.getTag = function (e) {
        return new t.Item(this.parseInt(e, "id"), this.parseString(e, "name"));
      }),
      (i.prototype.getEntity = function (e) {
        return new t.Entity(
          this.parseInt(e, "id"),
          this.parseString(e, "name")
        );
      }),
      (i.prototype.getObjectInfo = function (e, i) {
        return new t.ObjectInfo(
          i,
          this.parseString(e, "name"),
          t.Types.getObjectTypeForName(this.parseString(e, "type")),
          this.parseFloat(e, "w"),
          this.parseFloat(e, "h"),
          this.parseFloat(e, "pivot_x"),
          this.parseFloat(e, "pivot_y")
        );
      }),
      (i.prototype.getCharMap = function (e) {
        return new t.CharMap(
          this.parseInt(e, "id"),
          this.parseString(e, "name")
        );
      }),
      (i.prototype.getCharMapEntry = function (t, e, i) {
        var n = i
            .getFolderById(this.parseInt(t, "folder"))
            .getFileById(this.parseInt(t, "file")).name,
          r = null;
        void 0 !== t.target_folder &&
          void 0 !== t.target_file &&
          (r = i
            .getFolderById(this.parseInt(t, "target_folder"))
            .getFileById(this.parseInt(t, "target_file"))),
          e.put(n, r);
      }),
      (i.prototype.getVariable = function (e) {
        var i = t.Types.getVariableTypeForName(this.parseString(e, "type"));
        return new t.Variable(
          this.parseInt(e, "id"),
          this.parseString(e, "name"),
          i,
          2 === i
            ? this.parseString(e, "default")
            : this.parseFloat(e, "default", 0)
        );
      }),
      (i.prototype.getAnimation = function (e) {
        return new t.Animation(
          this.parseInt(e, "id"),
          this.parseString(e, "name"),
          this.parseFloat(e, "length"),
          this.parseBoolean(e, "looping", !0) === !0
            ? t.eAnimationLooping.LOOPING
            : t.eAnimationLooping.NO_LOOPING
        );
      }),
      (i.prototype.getMainlineKey = function (e) {
        return new t.KeyMainline(
          this.parseInt(e, "id"),
          this.parseFloat(e, "time")
        );
      }),
      (i.prototype.getRef = function (e) {
        return new t.Ref(
          this.parseInt(e, "id"),
          this.parseInt(e, "parent", -1),
          this.parseInt(e, "timeline"),
          this.parseInt(e, "key"),
          this.parseInt(e, "z_index")
        );
      }),
      (i.prototype.getTimeline = function (e) {
        return new t.Timeline(
          this.parseInt(e, "id"),
          this.parseString(e, "name"),
          t.Types.getObjectTypeForName(
            this.parseString(e, "object_type", "sprite")
          ),
          this.parseInt(e, "obj", -1)
        );
      }),
      (i.prototype.getBaseline = function (e) {
        return new t.Baseline(
          this.parseInt(e, "id"),
          this.parseString(e, "name", null)
        );
      }),
      (i.prototype.getVarline = function (e) {
        return new t.Varline(this.parseInt(e, "id"), this.parseInt(e, "def"));
      }),
      (i.prototype.getKey = function (e) {
        return new t.Key(this.parseInt(e, "id"), this.parseInt(e, "time"));
      }),
      (i.prototype.getTagKey = function (e) {
        return new t.KeyTag(this.parseInt(e, "id"), this.parseInt(e, "time"));
      }),
      (i.prototype.getVariableKey = function (e, i) {
        return new t.KeyVariable(
          this.parseInt(e, "id"),
          this.parseInt(e, "time"),
          2 === i ? this.parseString(e, "val") : this.parseFloat(e, "val")
        );
      }),
      (i.prototype.getTimelineKey = function (e, i, n) {
        var r = this.parseInt(e, "time"),
          s = this.parseInt(e, "spin", 1),
          a = this.parseString(e, "curve_type", "linear"),
          o = this.parseFloat(e, "c1", 0),
          h = this.parseFloat(e, "c2", 0),
          p = this.parseFloat(e, "c3", 0),
          l = this.parseFloat(e, "c4", 0),
          u = this.translateChildElementName("bone"),
          c = this.translateChildElementName("object"),
          _ = null,
          d = null,
          f = !1;
        void 0 !== e[u]
          ? ((d = e[u]),
            (_ = new t.KeyBone(i, r, s)),
            this.setMinDefsToElementName("bone"))
          : void 0 !== e[c] &&
            ((d = e[c]),
            (_ = new t.KeyObject(i, r, s)),
            this.setMinDefsToElementName("object"),
            (f = !0)),
          "linear" !== a &&
            _.setCurve(t.Types.getCurveTypeForName(a), o, h, p, l);
        var m = _.info;
        if (
          ((m.x = this.parseFloat(d, "x")),
          (m.y = -this.parseFloat(d, "y")),
          (m.scaleX = this.parseFloat(d, "scale_x", 1)),
          (m.scaleY = this.parseFloat(d, "scale_y", 1)),
          (m.angle = 360 - this.parseFloat(d, "angle")),
          (m.alpha = this.parseFloat(d, "a", 1)),
          f)
        ) {
          var g = this.parseInt(d, "folder"),
            y = this.parseInt(d, "file");
          _.setFolderAndFile(g, y);
          var v = n.getFolderById(g).getFileById(y);
          (m.pivotX = this.parseFloat(d, "pivot_x", v.pivotX)),
            (m.pivotY = 1 - this.parseFloat(d, "pivot_y", 1 - v.pivotY));
        }
        return this.popMinDefsStack(), _;
      }),
      (i.prototype.getTagChange = function (t) {
        return this.parseInt(t, "t");
      }),
      i
    );
  })(t.SpriterFile);
  t.SpriterJSON = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(t, i) {
      void 0 === i && (i = null), e.call(this), (this._xml = t);
      var n = t.documentElement.hasAttribute("min");
      this.setMinimized(n, i);
    }
    return (
      __extends(i, e),
      (i.prototype.getType = function () {
        return t.eFileType.XML;
      }),
      (i.prototype.parseInt = function (t, e, i) {
        void 0 === i && (i = 0);
        var n = t.getAttribute(this.translateAttributeName(e));
        return null !== n ? parseInt(n) : i;
      }),
      (i.prototype.parseFloat = function (t, e, i) {
        void 0 === i && (i = 0);
        var n = t.getAttribute(this.translateAttributeName(e));
        return null !== n ? parseFloat(n) : i;
      }),
      (i.prototype.parseString = function (t, e, i) {
        void 0 === i && (i = "");
        var n = t.getAttribute(this.translateAttributeName(e));
        return null !== n ? n : i;
      }),
      (i.prototype.getNodes = function (e) {
        this.setMinDefsToElementName(e);
        var i = this.translateElementName(e);
        return new t.NodeListXml(
          this,
          this._xml.documentElement.getElementsByTagName(i)
        );
      }),
      (i.prototype.getNodesForElement = function (e, i) {
        this.setMinDefsToElementName(i);
        var n = this.translateElementName(i);
        return new t.NodeListXml(this, e.getElementsByTagName(n));
      }),
      (i.prototype.getFolder = function (e) {
        return new t.Folder(
          this.parseInt(e, "id"),
          this.parseString(e, "name")
        );
      }),
      (i.prototype.getFile = function (e) {
        return e.hasAttribute("type") && "sound" === e.getAttribute("type")
          ? null
          : new t.File(
              this.parseInt(e, "id"),
              this.getFileNameWithoutExtension(this.parseString(e, "name")),
              this.parseFloat(e, "pivot_x"),
              1 - this.parseFloat(e, "pivot_y")
            );
      }),
      (i.prototype.getTag = function (e) {
        return new t.Item(this.parseInt(e, "id"), this.parseString(e, "name"));
      }),
      (i.prototype.getEntity = function (e) {
        return new t.Entity(
          this.parseInt(e, "id"),
          this.parseString(e, "name")
        );
      }),
      (i.prototype.getObjectInfo = function (e, i) {
        return new t.ObjectInfo(
          i,
          this.parseString(e, "name"),
          t.Types.getObjectTypeForName(this.parseString(e, "type")),
          this.parseFloat(e, "w"),
          this.parseFloat(e, "h"),
          this.parseFloat(e, "pivot_x"),
          this.parseFloat(e, "pivot_y")
        );
      }),
      (i.prototype.getCharMap = function (e) {
        return new t.CharMap(
          this.parseInt(e, "id"),
          this.parseString(e, "name")
        );
      }),
      (i.prototype.getCharMapEntry = function (t, e, i) {
        var n = i
            .getFolderById(this.parseInt(t, "folder"))
            .getFileById(this.parseInt(t, "file")).name,
          r = null;
        t.hasAttribute("target_folder") &&
          t.hasAttribute("target_file") &&
          (r = i
            .getFolderById(this.parseInt(t, "target_folder"))
            .getFileById(this.parseInt(t, "target_file"))),
          e.put(n, r);
      }),
      (i.prototype.getVariable = function (e) {
        var i = t.Types.getVariableTypeForName(this.parseString(e, "type"));
        return new t.Variable(
          this.parseInt(e, "id"),
          this.parseString(e, "name"),
          i,
          2 === i
            ? this.parseString(e, "default")
            : this.parseFloat(e, "default", 0)
        );
      }),
      (i.prototype.getAnimation = function (e) {
        return new t.Animation(
          this.parseInt(e, "id"),
          this.parseString(e, "name"),
          this.parseFloat(e, "length"),
          "true" === this.parseString(e, "looping", "true")
            ? t.eAnimationLooping.LOOPING
            : t.eAnimationLooping.NO_LOOPING
        );
      }),
      (i.prototype.getMainlineKey = function (e) {
        return new t.KeyMainline(
          this.parseInt(e, "id"),
          this.parseFloat(e, "time")
        );
      }),
      (i.prototype.getRef = function (e) {
        return new t.Ref(
          this.parseInt(e, "id"),
          this.parseInt(e, "parent", -1),
          this.parseInt(e, "timeline"),
          this.parseInt(e, "key"),
          this.parseInt(e, "z_index")
        );
      }),
      (i.prototype.getTimeline = function (e) {
        return new t.Timeline(
          this.parseInt(e, "id"),
          this.parseString(e, "name"),
          t.Types.getObjectTypeForName(
            this.parseString(e, "object_type", "sprite")
          ),
          this.parseInt(e, "obj", -1)
        );
      }),
      (i.prototype.getBaseline = function (e) {
        return new t.Baseline(
          this.parseInt(e, "id"),
          this.parseString(e, "name", null)
        );
      }),
      (i.prototype.getVarline = function (e) {
        return new t.Varline(this.parseInt(e, "id"), this.parseInt(e, "def"));
      }),
      (i.prototype.getKey = function (e) {
        return new t.Key(this.parseInt(e, "id"), this.parseInt(e, "time"));
      }),
      (i.prototype.getTagKey = function (e) {
        return new t.KeyTag(this.parseInt(e, "id"), this.parseInt(e, "time"));
      }),
      (i.prototype.getVariableKey = function (e, i) {
        return new t.KeyVariable(
          this.parseInt(e, "id"),
          this.parseInt(e, "time"),
          2 === i ? this.parseString(e, "val") : this.parseFloat(e, "val")
        );
      }),
      (i.prototype.getTimelineKey = function (e, i, n) {
        var r = this.parseInt(e, "time"),
          s = this.parseInt(e, "spin", 1),
          a = this.parseString(e, "curve_type", "linear"),
          o = this.parseFloat(e, "c1", 0),
          h = this.parseFloat(e, "c2", 0),
          p = this.parseFloat(e, "c3", 0),
          l = this.parseFloat(e, "c4", 0),
          u = this.translateChildElementName("bone"),
          c = this.translateChildElementName("object"),
          _ = null,
          d = e.firstElementChild,
          f = !1;
        d.tagName === u
          ? ((_ = new t.KeyBone(i, r, s)), this.setMinDefsToElementName("bone"))
          : d.tagName === c &&
            (this.setMinDefsToElementName("object"),
            (_ = new t.KeyObject(i, r, s)),
            (f = !0)),
          "linear" !== a &&
            _.setCurve(t.Types.getCurveTypeForName(a), o, h, p, l);
        var m = _.info;
        if (
          ((m.x = this.parseFloat(d, "x")),
          (m.y = -this.parseFloat(d, "y")),
          (m.scaleX = this.parseFloat(d, "scale_x", 1)),
          (m.scaleY = this.parseFloat(d, "scale_y", 1)),
          (m.angle = 360 - this.parseFloat(d, "angle")),
          (m.alpha = this.parseFloat(d, "a", 1)),
          f)
        ) {
          var g = this.parseInt(d, "folder"),
            y = this.parseInt(d, "file");
          _.setFolderAndFile(g, y);
          var v = n.getFolderById(g).getFileById(y);
          (m.pivotX = this.parseFloat(d, "pivot_x", v.pivotX)),
            (m.pivotY = 1 - this.parseFloat(d, "pivot_y", 1 - v.pivotY));
        }
        return this.popMinDefsStack(), _;
      }),
      (i.prototype.getTagChange = function (t) {
        return this.parseInt(t, "t");
      }),
      i
    );
  })(t.SpriterFile);
  t.SpriterXml = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  function e(t, e, i) {
    return (e - t) * i + t;
  }
  function i(t, i, n, r) {
    return e(e(t, i, r), e(i, n, r), r);
  }
  function n(t, n, r, s, a) {
    return e(i(t, n, r, a), i(n, r, s, a), a);
  }
  function r(t, i, r, s, a, o) {
    return e(n(t, i, r, s, o), n(i, r, s, a, o), o);
  }
  function s(t, i, n, s, a, o, h) {
    return e(r(t, i, n, s, a, h), r(i, n, s, a, o, h), h);
  }
  function a(t, e, i) {
    var n = 1,
      r = 1 - i,
      s = i * i,
      a = r * r,
      o = s * i;
    return 0 + 3 * a * i * t + 3 * r * s * e + o * n;
  }
  function o(t, e, i, n, r) {
    for (
      var s = 0.001,
        o = 10,
        h = 0,
        p = 1,
        l = (p + h) / 2,
        u = a(t, i, l),
        c = 0;
      Math.abs(r - u) > s && o > c;

    )
      r > u ? (h = l) : (p = l), (l = (p + h) / 2), (u = a(t, i, l)), ++c;
    return a(e, n, l);
  }
  function h(t, e, i, n) {
    return 0 === i
      ? t
      : (i > 0 ? e > t && (e -= 360) : t > e && (e += 360),
        this.linear(t, e, n));
  }
  (t.linear = e),
    (t.quadratic = i),
    (t.cubic = n),
    (t.quartic = r),
    (t.quintic = s),
    (t.bezier = o),
    (t.angleLinear = h);
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function e() {
      (this._folders = new t.IdNameMap()),
        (this._tags = new t.IdNameMap()),
        (this._entities = new t.IdNameMap());
    }
    return (
      (e.prototype.addFolder = function (t) {
        this._folders.add(t, t.id, t.name);
      }),
      (e.prototype.getFolderById = function (t) {
        return this._folders.getById(t);
      }),
      (e.prototype.getFolderByName = function (t) {
        return this._folders.getByName(t);
      }),
      (e.prototype.addEntity = function (t) {
        this._entities.add(t, t.id, t.name);
      }),
      (e.prototype.getEntityById = function (t) {
        return this._entities.getById(t);
      }),
      (e.prototype.getEntityByName = function (t) {
        return this._entities.getByName(t);
      }),
      (e.prototype.addTag = function (t) {
        this._tags.add(t, t.id, t.name);
      }),
      (e.prototype.getTagById = function (t) {
        return this._tags.getById(t);
      }),
      (e.prototype.getTagByName = function (t) {
        return this._tags.getByName(t);
      }),
      Object.defineProperty(e.prototype, "tagsLength", {
        get: function () {
          return this._tags.length;
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })();
  t.Spriter = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function e() {
      (this.timeline = -1),
        (this.timelineKey = -1),
        (this.transformed = new t.SpatialInfo());
    }
    return (
      (e.prototype.setOn = function (t) {
        this._on = t;
      }),
      Object.defineProperty(e.prototype, "on", {
        get: function () {
          return this._on;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.setKey = function (i, n, r, s) {
        (this.timeline = r), (this.timelineKey = s);
        var a = n.getTimelineById(r);
        (this.name = a.name),
          (this.objectInfo =
            -1 === a.objectRef ? null : i.getObjectInfoById(a.objectRef));
        var o = a.at(s),
          h = a.at(s + 1, n.loopType !== t.eAnimationLooping.NO_LOOPING);
        (this.key = o),
          (this.timeFrom = o.time),
          (this.timeTo = h.time),
          this.timeTo < this.timeFrom && (this.timeTo = n.length),
          (this.from = o.info),
          (this.to = h.info),
          (this.updateMask = 0),
          Math.abs(this.from.x - this.to.x) > 0.001 &&
            (this.updateMask += e.UPDATE_X),
          Math.abs(this.from.y - this.to.y) > 0.001 &&
            (this.updateMask += e.UPDATE_Y),
          Math.abs(this.from.scaleX - this.to.scaleX) > 0.001 &&
            (this.updateMask += e.UPDATE_SCALE_X),
          Math.abs(this.from.scaleY - this.to.scaleY) > 0.001 &&
            (this.updateMask += e.UPDATE_SCALE_Y),
          Math.abs(this.from.pivotX - this.to.pivotX) > 0.001 &&
            (this.updateMask += e.UPDATE_PIVOT_X),
          Math.abs(this.from.pivotY - this.to.pivotY) > 0.001 &&
            (this.updateMask += e.UPDATE_PIVOT_Y),
          Math.abs(this.from.alpha - this.to.alpha) > 0.001 &&
            (this.updateMask += e.UPDATE_ALPHA),
          Math.abs(this.from.angle - this.to.angle) > 0.001 &&
            (this.updateMask += e.UPDATE_ANGLE),
          (this.transformed.x = this.from.x),
          (this.transformed.y = this.from.y),
          (this.transformed.scaleX = this.from.scaleX),
          (this.transformed.scaleY = this.from.scaleY),
          (this.transformed.pivotX = this.from.pivotX),
          (this.transformed.pivotY = this.from.pivotY),
          (this.transformed.angle = this.from.angle),
          (this.transformed.alpha = this.from.alpha);
      }),
      (e.prototype.tween = function (i) {
        var n = this.updateMask > 0 ? this.getTweenTime(i) : 0;
        (this.transformed.x =
          (this.updateMask & e.UPDATE_X) > 0
            ? t.linear(this.from.x, this.to.x, n)
            : this.from.x),
          (this.transformed.y =
            (this.updateMask & e.UPDATE_Y) > 0
              ? t.linear(this.from.y, this.to.y, n)
              : this.from.y),
          (this.transformed.scaleX =
            (this.updateMask & e.UPDATE_SCALE_X) > 0
              ? t.linear(this.from.scaleX, this.to.scaleX, n)
              : this.from.scaleX),
          (this.transformed.scaleY =
            (this.updateMask & e.UPDATE_SCALE_Y) > 0
              ? t.linear(this.from.scaleY, this.to.scaleY, n)
              : this.from.scaleY),
          (this.transformed.pivotX =
            (this.updateMask & e.UPDATE_PIVOT_X) > 0
              ? t.linear(this.from.pivotX, this.to.pivotX, n)
              : this.from.pivotX),
          (this.transformed.pivotY =
            (this.updateMask & e.UPDATE_PIVOT_Y) > 0
              ? t.linear(this.from.pivotY, this.to.pivotY, n)
              : this.from.pivotY),
          (this.transformed.alpha =
            (this.updateMask & e.UPDATE_ALPHA) > 0
              ? t.linear(this.from.alpha, this.to.alpha, n)
              : this.from.alpha),
          (this.transformed.angle =
            (this.updateMask & e.UPDATE_ANGLE) > 0
              ? t.angleLinear(this.from.angle, this.to.angle, this.key.spin, n)
              : this.from.angle);
      }),
      (e.prototype.update = function (t) {
        (this.transformed.angle *=
          Phaser.Math.sign(t.scaleX) * Phaser.Math.sign(t.scaleY)),
          (this.transformed.angle += t.angle),
          (this.transformed.scaleX *= t.scaleX),
          (this.transformed.scaleY *= t.scaleY),
          this.scalePosition(t.scaleX, t.scaleY),
          this.rotatePosition(t.angle),
          this.translatePosition(t.x, t.y),
          (this.transformed.alpha *= t.alpha);
      }),
      (e.prototype.scalePosition = function (t, e) {
        (this.transformed.x *= t), (this.transformed.y *= e);
      }),
      (e.prototype.rotatePosition = function (t) {
        var e = this.transformed.x,
          i = this.transformed.y;
        if (0 !== e || 0 !== i) {
          var n = t * (Math.PI / 180),
            r = Math.cos(n),
            s = Math.sin(n);
          (this.transformed.x = e * r - i * s),
            (this.transformed.y = e * s + i * r);
        }
      }),
      (e.prototype.translatePosition = function (t, e) {
        (this.transformed.x += t), (this.transformed.y += e);
      }),
      (e.prototype.getTweenTime = function (e) {
        if (1 === this.key.curveType) return 0;
        var i = Phaser.Math.clamp(
          (e - this.timeFrom) / (this.timeTo - this.timeFrom),
          0,
          1
        );
        switch (this.key.curveType) {
          case 0:
            return i;
          case 2:
            return t.quadratic(0, this.key.c1, 1, i);
          case 3:
            return t.cubic(0, this.key.c1, this.key.c2, 1, i);
          case 4:
            return t.quartic(0, this.key.c1, this.key.c2, this.key.c3, 1, i);
          case 5:
            return t.quintic(
              0,
              this.key.c1,
              this.key.c2,
              this.key.c3,
              this.key.c4,
              1,
              i
            );
          case 6:
            return t.bezier(
              this.key.c1,
              this.key.c2,
              this.key.c3,
              this.key.c4,
              i
            );
        }
        return 0;
      }),
      (e.UPDATE_X = 1),
      (e.UPDATE_Y = 2),
      (e.UPDATE_SCALE_X = 4),
      (e.UPDATE_SCALE_Y = 8),
      (e.UPDATE_PIVOT_X = 16),
      (e.UPDATE_PIVOT_Y = 32),
      (e.UPDATE_ANGLE = 64),
      (e.UPDATE_ALPHA = 128),
      e
    );
  })();
  t.SpriterBone = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(i, n, r, s, a, o) {
      e.call(this, i, null),
        (this.onLoop = new Phaser.Signal()),
        (this.onFinish = new Phaser.Signal()),
        (this.onSound = new Phaser.Signal()),
        (this.onEvent = new Phaser.Signal()),
        (this.onTagChange = new Phaser.Signal()),
        (this.onVariableSet = new Phaser.Signal()),
        (this._mainlineStepper = new t.LineStepper()),
        (this._lineSteppers = []),
        (this._lineSteppersCount = 0),
        (this._bones = []),
        (this._objects = []),
        (this._tags = 0),
        (this._vars = []),
        (this._paused = !1),
        (this._spriter = n),
        (this._entityName = s),
        (this._entity = n.getEntityByName(s)),
        (this._textureKey = r),
        (this._root = new t.SpatialInfo());
      for (var h = 0; h < this._entity.variablesLength; h++)
        this._vars[h] = this._entity.getVariableById(h).clone();
      (this._charMapStack = new t.CharMapStack(this._entity)),
        void 0 === o && (o = 100),
        this.setAnimationSpeedPercent(o),
        void 0 === a || null === a
          ? this.playAnimationById(0)
          : "number" == typeof a
          ? this.playAnimationById(a)
          : this.playAnimationByName(a);
    }
    return (
      __extends(i, e),
      Object.defineProperty(i.prototype, "spriter", {
        get: function () {
          return this._spriter;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "entity", {
        get: function () {
          return this._entity;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "charMapStack", {
        get: function () {
          return this._charMapStack;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "paused", {
        get: function () {
          return this._paused;
        },
        set: function (t) {
          this.paused = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "animationsCount", {
        get: function () {
          return this._entity.animationsLength;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "currentAnimationName", {
        get: function () {
          return this._animationName;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (i.prototype.pushCharMap = function (t) {
        this._charMapStack.push(t), this.resetSprites();
      }),
      (i.prototype.removeCharMap = function (t) {
        this._charMapStack.remove(t), this.resetSprites();
      }),
      (i.prototype.clearCharMaps = function () {
        this._charMapStack.reset(), this.resetSprites();
      }),
      (i.prototype.resetSprites = function () {
        for (var t = 0; t < this._objects.length; t++)
          this._objects[t].resetFile();
      }),
      (i.prototype.isTagOn = function (t) {
        return this.isTagOnById(this._spriter.getTagByName(t).id);
      }),
      (i.prototype.isTagOnById = function (t) {
        return (this._tags & (1 << t)) > 0;
      }),
      (i.prototype.getVariable = function (t) {
        return this.getVariableById(this._entity.getVariableByName(t).id);
      }),
      (i.prototype.getVariableById = function (t) {
        return this._vars[t];
      }),
      (i.prototype.getObject = function (t) {
        for (var e = 0; e < this._objects.length; e++) {
          var i = this._objects[e];
          if (i.name === t) return i;
        }
        return null;
      }),
      (i.prototype.setAnimationSpeedPercent = function (t) {
        void 0 === t && (t = 100), (this._animationSpeed = t / 100);
      }),
      (i.prototype.playAnimationById = function (t) {
        var e = this._entity.getAnimationById(t);
        void 0 !== e && null !== e && this.playAnimation(e);
      }),
      (i.prototype.playAnimationByName = function (t) {
        var e = this._entity.getAnimationByName(t);
        void 0 !== e && null !== e && this.playAnimation(e);
      }),
      (i.prototype.playAnimation = function (t) {
        (this._animationName = t.name),
          (this._animation = t),
          (this._finished = !1),
          this._mainlineStepper.reset(),
          (this._mainlineStepper.line = this._animation.mainline),
          (this._time = 0),
          this.resetLines(),
          (this._tags = 0);
        for (var e = 0; e < this._vars.length; e++) this._vars[e].reset();
        this.loadKeys(this._animation.mainline.at(0), !0),
          this.updateCharacter();
      }),
      (i.prototype.resetLines = function () {
        this._lineSteppersCount = 0;
        for (var e = 0; e < this._animation.linesLength; e++) {
          var i = this._animation.getLineById(e);
          this._lineSteppersCount >= this._lineSteppers.length &&
            (this._lineSteppers[this._lineSteppersCount] = new t.LineStepper());
          var n = this._lineSteppers[this._lineSteppersCount++];
          n.reset(), (n.line = i);
        }
      }),
      (i.prototype.setBones = function (e, i) {
        void 0 === i && (i = !1);
        for (var n = 0; n < this._bones.length; n++)
          void 0 !== this._bones[n] && this._bones[n].setOn(!1);
        for (var n = 0; n < e.length; n++) {
          var r = e[n];
          if (void 0 === this._bones[r.id]) {
            var s = new t.SpriterBone();
            (s.type = 1), (this._bones[r.id] = s);
          }
          var a = this._bones[r.id];
          a.setOn(!0),
            (a.parent = r.parent),
            (a.timelineKey !== r.key || a.timeline !== r.timeline || i) &&
              a.setKey(this._entity, this._animation, r.timeline, r.key);
        }
      }),
      (i.prototype.setObjects = function (e, i) {
        void 0 === i && (i = !1);
        for (var n = 0; n < this._objects.length; n++)
          void 0 !== this._objects[n] && this._objects[n].setOn(!1);
        for (var r = !1, n = 0; n < e.length; n++) {
          var s = e[n],
            a = null,
            o = null;
          void 0 === this._objects[s.id]
            ? ((o = new Phaser.Sprite(this.game, 0, 0, this._textureKey)),
              (a = new t.SpriterObject(this, o)),
              (this._objects[s.id] = a),
              this.add(o))
            : ((a = this._objects[s.id]), (o = a.sprite)),
            (a.parent = s.parent),
            (a.type = this._animation.getTimelineById(s.timeline).objectType),
            0 === a.type &&
              (a.setOn(!0),
              a.sprite.z !== s.z && ((a.sprite.z = s.z), (r = !0))),
            (a.timelineKey !== s.key || a.timeline !== s.timeline || i) &&
              a.setKey(this._entity, this._animation, s.timeline, s.key);
        }
        r && this.sort();
      }),
      (i.prototype.loadKeys = function (t, e) {
        void 0 === e && (e = !1),
          this.setBones(t.boneRefs, e),
          this.setObjects(t.objectRefs, e);
      }),
      (i.prototype.updateAnimation = function () {
        if (!this._paused && !this._finished) {
          var e = this._mainlineStepper;
          this._time > this._animation.length &&
            (this._animation.loopType === t.eAnimationLooping.NO_LOOPING
              ? ((this._time = this._animation.length), (this._finished = !0))
              : ((this._time -= this._animation.length),
                this.onLoop.dispatch(this)));
          for (var i; null !== (i = e.step(this._time)); )
            this.loadKeys(i), (e.lastTime = i.time);
          this.updateCharacter(),
            this.updateLines(),
            this._finished && this.onFinish.dispatch(this),
            (this._time +=
              this.game.time.physicsElapsedMS * this._animationSpeed);
        }
      }),
      (i.prototype.updateCharacter = function () {
        for (var t = 0; t < this._bones.length; t++) {
          var e = this._bones[t];
          if (e.on) {
            var i =
              -1 === e.parent ? this._root : this._bones[e.parent].transformed;
            e.tween(this._time), e.update(i);
          }
        }
        for (var t = 0; t < this._objects.length; t++) {
          var n = this._objects[t];
          if (n.on) {
            var i =
              -1 === n.parent ? this._root : this._bones[n.parent].transformed;
            n.tween(this._time), n.update(i);
          }
        }
      }),
      (i.prototype.updateLines = function () {
        for (var e = this._lineSteppersCount - 1; e >= 0; e--)
          for (
            var i, n = this._lineSteppers[e], r = n.line;
            null !== (i = n.step(this._time));

          ) {
            switch (r.type) {
              case t.eTimelineType.SOUND_LINE:
                this.onSound.dispatch(this, r.name);
                break;
              case t.eTimelineType.EVENT_LINE:
                this.onEvent.dispatch(this, r.name);
                break;
              case t.eTimelineType.TAG_LINE:
                var s = i.tagsOn,
                  a = this._tags ^ s;
                this._tags = s;
                for (var o = 0; o < this._spriter.tagsLength; o++) {
                  var h = 1 << o;
                  a & h &&
                    this.onTagChange.dispatch(
                      this,
                      this._spriter.getTagById(o).name,
                      (s & h) > 0
                    );
                }
                break;
              case t.eTimelineType.VAR_LINE:
                var p = i.value,
                  l = this._vars[r.varDefId];
                (l.value = p), this.onVariableSet.dispatch(this, l);
            }
            n.lastTime = i.time;
          }
      }),
      i
    );
  })(Phaser.Group);
  t.SpriterGroup = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e(e, i) {
      t.call(this),
        (this._spriter = e.spriter),
        (this._charMapStack = e.charMapStack),
        (this._sprite = i);
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, "sprite", {
        get: function () {
          return this._sprite;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.setOn = function (e) {
        t.prototype.setOn.call(this, e),
          (this._sprite.exists = e),
          (this._sprite.visible = e && !this._hide);
      }),
      (e.prototype.setKey = function (e, i, n, r) {
        if ((t.prototype.setKey.call(this, e, i, n, r), 0 === this.type)) {
          var s = this.key,
            a = this._spriter.getFolderById(s.folder).getFileById(s.file);
          (this._file = a), this.setFile(a);
        } else this._file = null;
      }),
      (e.prototype.resetFile = function () {
        0 === this.type && this.setFile(this._file);
      }),
      (e.prototype.setFile = function (t) {
        (t = this._charMapStack.getFile(t)),
          null !== t
            ? ((this._hide = !1), (this._sprite.frameName = t.name))
            : ((this._hide = !0), (this._sprite.visible = !1));
      }),
      (e.prototype.update = function (e) {
        t.prototype.update.call(this, e), this.updateSprite();
      }),
      (e.prototype.updateSprite = function () {
        var t = this.transformed,
          e = this.sprite;
        e.position.set(t.x, t.y),
          e.scale.set(t.scaleX, t.scaleY),
          e.anchor.set(t.pivotX, t.pivotY),
          (e.alpha = t.alpha),
          (e.angle = t.angle);
      }),
      e
    );
  })(t.SpriterBone);
  t.SpriterObject = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t(t, e) {
      (this._id = t), (this._name = e);
    }
    return (
      Object.defineProperty(t.prototype, "id", {
        get: function () {
          return this._id;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "name", {
        get: function () {
          return this._name;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })();
  t.Item = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  !(function (t) {
    (t[(t.NO_LOOPING = 0)] = "NO_LOOPING"), (t[(t.LOOPING = 1)] = "LOOPING");
  })(t.eAnimationLooping || (t.eAnimationLooping = {}));
  var e =
    (t.eAnimationLooping,
    (function (e) {
      function i(i, n, r, s) {
        e.call(this, i, n),
          (this._length = r),
          (this._loopType = s),
          (this._timelines = new t.IdNameMap()),
          (this._lines = new t.IdNameMap());
      }
      return (
        __extends(i, e),
        Object.defineProperty(i.prototype, "mainline", {
          get: function () {
            return this._mainline;
          },
          set: function (t) {
            this._mainline = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        (i.prototype.addTimeline = function (t) {
          this._timelines.add(t, t.id, t.name);
        }),
        (i.prototype.getTimelineById = function (t) {
          return this._timelines.getById(t);
        }),
        (i.prototype.getTimelineByName = function (t) {
          return this._timelines.getByName(t);
        }),
        (i.prototype.addLine = function (t) {
          this._lines.add(t, this._lines.length, t.name);
        }),
        (i.prototype.getLineById = function (t) {
          return this._lines.getById(t);
        }),
        (i.prototype.getLineByName = function (t) {
          return this._lines.getByName(t);
        }),
        Object.defineProperty(i.prototype, "linesLength", {
          get: function () {
            return this._lines.length;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(i.prototype, "length", {
          get: function () {
            return this._length;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(i.prototype, "loopType", {
          get: function () {
            return this._loopType;
          },
          enumerable: !0,
          configurable: !0,
        }),
        i
      );
    })(t.Item));
  t.Animation = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  !(function (t) {
    (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
      (t[(t.MAIN_LINE = 1)] = "MAIN_LINE"),
      (t[(t.TIME_LINE = 2)] = "TIME_LINE"),
      (t[(t.SOUND_LINE = 3)] = "SOUND_LINE"),
      (t[(t.EVENT_LINE = 4)] = "EVENT_LINE"),
      (t[(t.TAG_LINE = 5)] = "TAG_LINE"),
      (t[(t.VAR_LINE = 6)] = "VAR_LINE");
  })(t.eTimelineType || (t.eTimelineType = {}));
  var e = t.eTimelineType,
    i = (function (t) {
      function i(i, n) {
        void 0 === n && (n = null),
          t.call(this, i, n),
          (this._type = e.UNKNOWN);
      }
      return (
        __extends(i, t),
        Object.defineProperty(i.prototype, "type", {
          get: function () {
            return this._type;
          },
          set: function (t) {
            this._type = t;
          },
          enumerable: !0,
          configurable: !0,
        }),
        Object.defineProperty(i.prototype, "keys", {
          get: function () {
            return this._keys;
          },
          enumerable: !0,
          configurable: !0,
        }),
        (i.prototype.add = function (t) {
          (null === this._keys || void 0 === this._keys) && (this._keys = []),
            this._keys.push(t);
        }),
        (i.prototype.at = function (t, e) {
          if ((void 0 === e && (e = !0), 0 > t)) return null;
          var i = this._keys.length;
          return t >= i && (e ? (t %= i) : (t = i - 1)), this._keys[t];
        }),
        i
      );
    })(t.Item);
  t.Baseline = i;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.apply(this, arguments);
    }
    return (
      __extends(e, t),
      (e.prototype.put = function (t, e) {
        void 0 === this._map && (this._map = {}),
          void 0 !== this._map[t],
          (this._map[t] = e);
      }),
      (e.prototype.value = function (t) {
        return this._map[t];
      }),
      e
    );
  })(t.Item);
  t.CharMap = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t(t) {
      (this._stack = []), (this._length = 0), (this._entity = t);
    }
    return (
      (t.prototype.reset = function () {
        this._length = 0;
      }),
      (t.prototype.push = function (t) {
        var e = this.getCharMap(t);
        this._stack[this._length++] = e;
      }),
      (t.prototype.remove = function (t) {
        var e = this.getCharMap(t),
          i = this.findCharMap(e);
        if (-1 !== i) {
          for (var n = i; n < this._length - 2; n++)
            this._stack[n] = this._stack[n + 1];
          this._stack[--this._length] = null;
        }
      }),
      (t.prototype.getFile = function (t) {
        for (var e = this._length - 1; e >= 0; e--) {
          var i = this._stack[e].value(t.name);
          if (void 0 !== i) return i;
        }
        return t;
      }),
      (t.prototype.getCharMap = function (t) {
        var e = this._entity.getCharMapByName(t);
        return e;
      }),
      (t.prototype.findCharMap = function (t) {
        for (var e = 0; e < this._length; e++)
          if (this._stack[e] === t) return e;
        return -1;
      }),
      t
    );
  })();
  t.CharMapStack = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(i, n) {
      e.call(this, i, n),
        (this._objectInfos = new t.IdNameMap()),
        (this._charMaps = new t.IdNameMap()),
        (this._variables = new t.IdNameMap()),
        (this._animations = new t.IdNameMap());
    }
    return (
      __extends(i, e),
      (i.prototype.addObjectInfo = function (t) {
        this._objectInfos.add(t, t.id, t.name);
      }),
      (i.prototype.getObjectInfoById = function (t) {
        return this._objectInfos.getById(t);
      }),
      (i.prototype.getObjectInfoByName = function (t) {
        return this._objectInfos.getByName(t);
      }),
      (i.prototype.addCharMap = function (t) {
        this._charMaps.add(t, t.id, t.name);
      }),
      (i.prototype.getCharMapById = function (t) {
        return this._charMaps.getById(t);
      }),
      (i.prototype.getCharMapByName = function (t) {
        return this._charMaps.getByName(t);
      }),
      Object.defineProperty(i.prototype, "charMapsLength", {
        get: function () {
          return this._charMaps.length;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (i.prototype.addVariable = function (t) {
        this._variables.add(t, t.id, t.name);
      }),
      (i.prototype.getVariableById = function (t) {
        return this._variables.getById(t);
      }),
      (i.prototype.getVariableByName = function (t) {
        return this._variables.getByName(t);
      }),
      Object.defineProperty(i.prototype, "variablesLength", {
        get: function () {
          return this._variables.length;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (i.prototype.addAnimation = function (t) {
        this._animations.add(t, t.id, t.name);
      }),
      (i.prototype.getAnimationById = function (t) {
        return this._animations.getById(t);
      }),
      (i.prototype.getAnimationByName = function (t) {
        return this._animations.getByName(t);
      }),
      Object.defineProperty(i.prototype, "animationsLength", {
        get: function () {
          return this._animations.length;
        },
        enumerable: !0,
        configurable: !0,
      }),
      i
    );
  })(t.Item);
  t.Entity = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e(e, i, n, r) {
      t.call(this, e, i), (this._pivotX = n), (this._pivotY = r);
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, "pivotX", {
        get: function () {
          return this._pivotX;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "pivotY", {
        get: function () {
          return this._pivotY;
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })(t.Item);
  t.File = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(i, n) {
      e.call(this, i, n), (this._files = new t.IdNameMap());
    }
    return (
      __extends(i, e),
      (i.prototype.addFile = function (t) {
        this._files.add(t, t.id, t.name);
      }),
      (i.prototype.getFileById = function (t) {
        return this._files.getById(t);
      }),
      (i.prototype.getFileByName = function (t) {
        return this._files.getByName(t);
      }),
      i
    );
  })(t.Item);
  t.Folder = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t(t, e) {
      (this._id = t), (this._time = e);
    }
    return (
      Object.defineProperty(t.prototype, "id", {
        get: function () {
          return this._id;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "time", {
        get: function () {
          return this._time;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })();
  t.Key = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(i, n, r) {
      e.call(this, i, n),
        (this._info = new t.SpatialInfo()),
        (this._spin = r),
        this.setCurve(0);
    }
    return (
      __extends(i, e),
      (i.prototype.setCurve = function (t, e, i, n, r) {
        void 0 === e && (e = 0),
          void 0 === i && (i = 0),
          void 0 === n && (n = 0),
          void 0 === r && (r = 0),
          (this._curveType = t),
          (this._c1 = e),
          (this._c2 = i),
          (this._c3 = n),
          (this._c4 = r);
      }),
      Object.defineProperty(i.prototype, "spin", {
        get: function () {
          return this._spin;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "curveType", {
        get: function () {
          return this._curveType;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "c1", {
        get: function () {
          return this._c1;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "c2", {
        get: function () {
          return this._c2;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "c3", {
        get: function () {
          return this._c3;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "c4", {
        get: function () {
          return this._c4;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "info", {
        get: function () {
          return this._info;
        },
        enumerable: !0,
        configurable: !0,
      }),
      i
    );
  })(t.Key);
  t.KeyTimeline = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.apply(this, arguments);
    }
    return __extends(e, t), e;
  })(t.KeyTimeline);
  t.KeyBone = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.apply(this, arguments), (this._boneRefs = []), (this._objectRefs = []);
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, "boneRefs", {
        get: function () {
          return this._boneRefs;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.addBoneRef = function (t) {
        this._boneRefs.push(t);
      }),
      Object.defineProperty(e.prototype, "objectRefs", {
        get: function () {
          return this._objectRefs;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.addObjectRef = function (t) {
        this._objectRefs.push(t);
      }),
      e
    );
  })(t.Key);
  t.KeyMainline = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.apply(this, arguments);
    }
    return (
      __extends(e, t),
      (e.prototype.setFolderAndFile = function (t, e) {
        (this._folder = t), (this._file = e);
      }),
      Object.defineProperty(e.prototype, "folder", {
        get: function () {
          return this._folder;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "file", {
        get: function () {
          return this._file;
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })(t.KeyTimeline);
  t.KeyObject = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.apply(this, arguments);
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, "tagsOn", {
        get: function () {
          return this._tagsOn;
        },
        set: function (t) {
          this._tagsOn = t;
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })(t.Key);
  t.KeyTag = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e(e, i, n) {
      t.call(this, e, i), (this._value = n);
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, "value", {
        get: function () {
          return this._value;
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })(t.Key);
  t.KeyVariable = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e(e, i, n, r, s, a, o) {
      t.call(this, e, i),
        (this._type = n),
        (this._width = r),
        (this._height = s),
        (this._pivotX = a),
        (this._pivotY = o);
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, "type", {
        get: function () {
          return this._type;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "width", {
        get: function () {
          return this._width;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "height", {
        get: function () {
          return this._height;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "pivotX", {
        get: function () {
          return this._pivotX;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "pivotY", {
        get: function () {
          return this._pivotY;
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })(t.Item);
  t.ObjectInfo = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t(t, e, i, n, r) {
      void 0 === r && (r = 0),
        (this.id = t),
        (this.parent = e),
        (this.timeline = i),
        (this.key = n),
        (this.z = r);
    }
    return t;
  })();
  t.Ref = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t() {
      (this.x = 0),
        (this.y = 0),
        (this.scaleX = 1),
        (this.scaleY = 1),
        (this.pivotX = 0),
        (this.pivotY = 0),
        (this.alpha = 1),
        (this.angle = 0);
    }
    return t;
  })();
  t.SpatialInfo = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(i, n, r, s) {
      void 0 === r && (r = 0),
        void 0 === s && (s = -1),
        e.call(this, i, n),
        (this.type = t.eTimelineType.TIME_LINE),
        (this._objectType = r),
        (this._objectRef = s);
    }
    return (
      __extends(i, e),
      Object.defineProperty(i.prototype, "objectType", {
        get: function () {
          return this._objectType;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, "objectRef", {
        get: function () {
          return this._objectRef;
        },
        enumerable: !0,
        configurable: !0,
      }),
      i
    );
  })(t.Baseline);
  t.Timeline = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.getObjectTypeForName = function (e) {
        var i = t.nameToObjectType[e];
        return i;
      }),
      (t.getCurveTypeForName = function (e) {
        var i = t.nameToCurveType[e];
        return i;
      }),
      (t.getVariableTypeForName = function (e) {
        var i = t.nameToVariableType[e];
        return i;
      }),
      (t.nameToObjectType = { sprite: 0, bone: 1, box: 2, point: 3, sound: 4 }),
      (t.nameToCurveType = {
        instatnt: 1,
        linear: 0,
        quadratic: 2,
        cubic: 3,
        quartic: 4,
        quintic: 5,
        bezier: 6,
      }),
      (t.nameToVariableType = { int: 0, float: 1, string: 2 }),
      t
    );
  })();
  t.Types = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (t) {
    function e(e, i, n, r) {
      t.call(this, e, i), (this._type = n), (this._default = r), this.reset();
    }
    return (
      __extends(e, t),
      (e.prototype.clone = function () {
        return new e(this.id, this.name, this.type, this._default);
      }),
      (e.prototype.reset = function () {
        this.value = this._default;
      }),
      Object.defineProperty(e.prototype, "type", {
        get: function () {
          return this._type;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "value", {
        get: function () {
          return this._value;
        },
        set: function (t) {
          0 === this._type ? (this._value = Math.floor(t)) : (this._value = t);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "int", {
        get: function () {
          return this._value;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "float", {
        get: function () {
          return this._value;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "string", {
        get: function () {
          return this._value;
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })(t.Item);
  t.Variable = e;
})(Spriter || (Spriter = {}));
var Spriter;
!(function (t) {
  var e = (function (e) {
    function i(i, n) {
      e.call(this, i, null),
        (this._varDefId = n),
        (this.type = t.eTimelineType.VAR_LINE);
    }
    return (
      __extends(i, e),
      Object.defineProperty(i.prototype, "varDefId", {
        get: function () {
          return this._varDefId;
        },
        enumerable: !0,
        configurable: !0,
      }),
      i
    );
  })(t.Baseline);
  t.Varline = e;
})(Spriter || (Spriter = {}));
var RioSprint;
!(function (t) {
  var e = (function (t) {
    function e() {
      t.call(this), (this._ignoreNextResize = !1);
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
            this.scale.forceOrientation(!0, !1),
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
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (e) {
    function i() {
      e.call(this), (this._restartCounter = 2);
    }
    return (
      __extends(i, e),
      (i.prototype.create = function () {
        (this._once = !1), (this._pressed = !1);
        var t = this.add.image(0, 0, "Tut");
        (t.inputEnabled = !0),
          t.events.onInputUp.add(function () {
            this._pressed = !0;
          }, this),
          (this._cursorKeys = this.game.input.keyboard.createCursorKeys());
      }),
      (i.prototype.onGameeRestart = function () {
        --this._restartCounter <= 0 &&
          ((this._pressed = !0), Utils.AudioUtils.playSound("step_1"));
      }),
      (i.prototype.onGameeButtonDown = function (t) {
        (this._pressed = !0), Utils.AudioUtils.playSound("step_1");
      }),
      (i.prototype.update = function () {
        this._once ||
          ((this._cursorKeys.left.justDown ||
            this._cursorKeys.right.justDown ||
            this._cursorKeys.up.justDown ||
            this._cursorKeys.down.justDown) &&
            (this._pressed = !0),
          this._pressed &&
            ((this._once = !0),
            t.Global.GAMEE && Gamee.Gamee.instance.gameStart(),
            this.game.state.start("Play")));
      }),
      i
    );
  })(Phaser.State);
  t.Menu = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (e) {
    function i() {
      e.call(this), (this._ready = !1);
    }
    return (
      __extends(i, e),
      (i.prototype.preload = function () {
        var t = "assets/",
          t = "assets/";
        this.game.device.ie || Phaser.Device.isAndroidStockBrowser()
          ? (this.load.audio("beep_1", "assets/sfx/beep_1.mp3"),
            this.load.audio("beep_2", "assets/sfx/beep_2.mp3"),
            this.load.audio("colision_big", "assets/sfx/colision_big.mp3"),
            this.load.audio("colision_small", "assets/sfx/colision_small.mp3"),
            this.load.audio("game_over", "assets/sfx/game_over.mp3"),
            this.load.audio("shoot", "assets/sfx/shoot.mp3"),
            this.load.audio("step_1", "assets/sfx/step_1.mp3"),
            this.load.audio("step_2", "assets/sfx/step_2.mp3"),
            this.load.audio("step_3", "assets/sfx/step_3.mp3"),
            this.load.audio("bonus", "assets/sfx/bonus.mp3"),
            this.load.audio("Music", ["assets/sfx/ambi.mp3"]))
          : (this.load.audio("SFX", [
              "assets/sfx/sfx.ogg",
              "assets/sfx/sfx.m4a",
            ]),
            this.load.audio("Music", [
              "assets/sfx/ambi.ogg",
              "assets/sfx/ambi.m4a",
            ])),
          this.load.image("Tut", t + "tut.jpg"),
          this.load.atlas("Sprites", t + "Sprites.png", t + "Sprites.json"),
          this.load.xml("FontData", t + "font.xml"),
          this.load.xml("RunAnim", t + "run.xml"),
          this.load.json("Config", t + "config.json");
      }),
      (i.prototype.loadUpdate = function () {
        this.setLoadingText(this.load.progress);
      }),
      (i.prototype.create = function () {
        this.cache.addBitmapFontFromImage(
          "Font",
          null,
          "Sprites",
          this.cache.getXML("FontData"),
          "xml"
        );
        var e = new Spriter.Loader(),
          i = new Spriter.SpriterXml(this.game.cache.getXML("RunAnim"));
        (t.Global.runAnim = e.load(i)), this.readConfig();
        var n = this.add.audio("Music");
        (n.volume = 0.3), Utils.AudioUtils.addMusic("Music", n);
        var r = 0;
        if (this.game.device.ie || Phaser.Device.isAndroidStockBrowser()) {
          (r = 0.02), Utils.AudioUtils.setSounds(null);
          var n = this.add.audio("beep_1");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("beep_1", n);
          var n = this.add.audio("beep_2");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("beep_2", n);
          var n = this.add.audio("colision_big");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("colision_big", n);
          var n = this.add.audio("colision_small");
          (n.allowMultiple = !0),
            Utils.AudioUtils.addSound("colision_small", n);
          var n = this.add.audio("game_over");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("game_over", n);
          var n = this.add.audio("shoot");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("shoot", n);
          var n = this.add.audio("step_1");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("step_1", n);
          var n = this.add.audio("step_2");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("step_2", n);
          var n = this.add.audio("step_3");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("step_3", n);
          var n = this.add.audio("bonus");
          (n.allowMultiple = !0), Utils.AudioUtils.addSound("bonus", n);
        } else {
          this.game.device.iOS && (r = 0.1);
          var s = this.add.audio("SFX");
          Utils.AudioUtils.setSounds(s),
            (s.allowMultiple = !0),
            s.addMarker("beep_1", 0, 1.3322),
            s.addMarker("beep_2", 3 - r, 1.2016 + r),
            s.addMarker("colision_big", 6 - r, 1.2539 + r),
            s.addMarker("colision_small", 9 - r, 1.2539 + r),
            s.addMarker("game_over", 12 - r, 3.0563 + r),
            s.addMarker("shoot", 17 - r, 1.7502 + r),
            s.addMarker("step_1", 20 - r, 0.7314 + r),
            s.addMarker("step_2", 22 - r, 0.7314 + r),
            s.addMarker("step_3", 24 - r, 0.6269 + r),
            s.addMarker("bonus", 26 - r, 3.288 + r);
        }
      }),
      (i.prototype.readConfig = function () {
        var e = this.game.cache.getJSON("Config");
        void 0 !== e.AIs && (t.Gameplay.AIs = e.AIs);
      }),
      (i.prototype.update = function () {
        this._ready === !1 &&
          ((this._ready = !0), this.game.state.start("Menu"));
      }),
      (i.prototype.setLoadingText = function (t) {}),
      i
    );
  })(Phaser.State);
  t.Preloader = e;
})(RioSprint || (RioSprint = {}));
var RioSprint;
!(function (t) {
  var e = (function (e) {
    function i() {
      e.call(this),
        (this._charMaps = ["Oponent1", "Oponent2", null]),
        (this._gameOver = !1),
        (this._stopUpdate = !1),
        (this._runFromRestart = !1),
        (this._tracks = []),
        (this._gamesPlayed = 0);
    }
    return (
      __extends(i, e),
      (i.prototype.create = function () {
        (this.camera.bounds = null),
          (this.stage.backgroundColor = 12632319),
          (this._cursorKeys = this.game.input.keyboard.createCursorKeys()),
          (this._calcs = new t.Calcs()),
          (this._topLayer = new t.BgLayer(
            this.game,
            this.world,
            "vrch",
            0,
            0.2
          )),
          (this._bottomLayer = new t.BgLayer(
            this.game,
            this.world,
            "draha",
            1,
            1
          )),
          (this._bottomLayer.position.y = this.game.height),
          (this._adTable = new t.AdTable(this.game, this.world)),
          (this._adTable.y =
            this.game.height -
            this.cache.getFrameByName("Sprites", "draha").height +
            18),
          (this._table = new t.Table(this.game, this.world));
        for (var e = 0; 3 > e; e++)
          this._tracks[e] = new t.Track(
            this.game,
            this.world,
            this._calcs,
            i.FLOORS[e]
          );
        var n = this._tracks[1];
        n.onScore.add(this.onScore, this),
          n.onAchievement.add(this.onAchievement, this),
          (n.isMainPlayer = !0),
          (this._smiley = new t.Smiley(this.game)),
          n.player.addChild(this._smiley),
          this._smiley.onGameOver.add(this.onGameOver, this),
          (this._topAI = new t.AI(
            this.game,
            this._tracks[0],
            this._calcs,
            t.Gameplay.AIs[0]
          )),
          (this._bottomAI = new t.AI(
            this.game,
            this._tracks[2],
            this._calcs,
            t.Gameplay.AIs[1]
          )),
          this.createEmitters(),
          (this._title = new t.Title(this.game)),
          (this._title.fixedToCamera = !0),
          this.world.add(this._title),
          (this._tutHand = new Phaser.Sprite(
            this.game,
            320,
            220,
            "Sprites",
            "tut0"
          )),
          this._tutHand.anchor.set(0.5, 0.5),
          (this._tutHand.fixedToCamera = !0),
          this._tutHand.animations.add("tut", i.TUTORIAL_FRAMES, 10, !0),
          (this._tutHand.exists = !1),
          this.world.add(this._tutHand),
          (this._tutArrow = new Phaser.Sprite(
            this.game,
            0,
            -90,
            "Sprites",
            "sipka"
          )),
          this._tutArrow.anchor.set(0, 0.5),
          (this._tutArrow.exists = !1),
          this._tracks[1].add(this._tutArrow),
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
          this.reset(),
          Gamee.Gamee.instance.gameStart(),
          Utils.AudioUtils.playSound("step_1");
      }),
      (i.prototype.onGameeButtonDown = function (t) {
        var e = Gamee.Gamee.instance;
        e.gameRunning
          ? "left" === t
            ? (this._keyLeft = !0)
            : "right" === t && (this._keyRight = !0)
          : this._runFromRestart ||
            (e.gameStart(), Utils.AudioUtils.playSound("step_1"));
      }),
      (i.prototype.onGameeButtonUp = function (t) {
        Gamee.Gamee.instance;
      }),
      (i.prototype.reset = function () {
        (this._gameOver = !1),
          (this._stopUpdate = !1),
          (this._startTime = this.game.time.time),
          (this._keyLeft = this._keyRight = !1),
          this._cursorKeys.left.justDown,
          this._cursorKeys.left.justUp,
          this._table.reset(),
          (this._initialCountdown = i.INITIAL_COUNTDOWN),
          ++this._gamesPlayed,
          (this.camera.x = 0),
          this._topLayer.updatePosition(this.camera.x),
          this._bottomLayer.updatePosition(this.camera.x),
          this._adTable.updateAds(this.camera.x),
          Phaser.ArrayUtils.shuffle(this._charMaps);
        for (var e = 0; 3 > e; e++) {
          var n = this._tracks[e];
          n.reset(),
            n.player.setCharMap(this._charMaps[e]),
            n.randomize(this.game.rnd.integer());
        }
        this._smiley.clear(),
          this._topAI.reset(),
          this._bottomAI.reset(),
          this._konfetyEmitter.killAllParticles(),
          this._scoreEmitter.killAllParticles(),
          (this._score = 0),
          t.Global.GAMEE && (Gamee.Gamee.instance.score = 0),
          Utils.AudioUtils.playMusic("Music");
      }),
      (i.prototype.update = function () {
        if (!this._stopUpdate) {
          if (this._initialCountdown > 0) {
            var t = Math.ceil(this._initialCountdown / 1e3);
            this._initialCountdown = Math.max(
              this._initialCountdown - 1.5 * this.game.time.elapsed,
              0
            );
            var e = Math.ceil(this._initialCountdown / 1e3);
            return (
              t > e &&
                0 !== e &&
                ((this._table.centerText = Math.ceil(
                  this._initialCountdown / 1e3
                )),
                1 !== e
                  ? Utils.AudioUtils.playSound("beep_1")
                  : Utils.AudioUtils.playSound("beep_2")),
              void (
                0 === e &&
                this._gamesPlayed <= 3 &&
                ((this._tutHand.exists = !0),
                this._tutHand.play("tut"),
                this.game.time.events.add(
                  3100,
                  function () {
                    this._tutHand.animations.stop(),
                      (this._tutHand.exists = !1),
                      (this._tutArrow.exist = !1);
                  },
                  this
                ),
                Utils.AudioUtils.playSound("shoot"))
              )
            );
          }
          var i = this._tracks[1];
          this._gameOver ||
            ((this._keyLeft || this._cursorKeys.left.justDown) &&
              i.player.jump(),
            (this._keyRight || this._cursorKeys.right.justDown) &&
              i.player.run(),
            (this.camera.x = Math.max(0, i.player.x - 200)),
            this._topLayer.updatePosition(this.camera.x),
            this._bottomLayer.updatePosition(this.camera.x),
            this._adTable.updateAds(this.camera.x),
            this._table.updateTable(i.player.averageSpeed),
            this._table.time < 3e3 &&
              ((this._tutArrow.x = i.player.x + 50),
              (this._tutArrow.visible =
                0 === (1 & Math.floor(this._table.time / 250)))),
            this._smiley.updateSmiley(
              this._tracks[0].player,
              this._tracks[2].player
            )),
            i.updateTrack(this.camera.x, !this._gameOver),
            this._topAI.update(!this._gameOver),
            this._bottomAI.update(!this._gameOver),
            (this._keyLeft = this._keyRight = !1),
            this._cursorKeys.up.justDown && this.setGameOver();
        }
      }),
      (i.prototype.setGameOver = function () {
        this._gameOver ||
          ((this._gameOver = !0),
          Utils.AudioUtils.playSound("game_over"),
          this.time.events.add(
            1500,
            function () {
              (this._stopUpdate = !0),
                t.Global.GAMEE
                  ? ((this._runFromRestart = !0),
                    Gamee.Gamee.instance.gameOver())
                  : this.reset();
            },
            this
          ));
      }),
      (i.prototype.onGameOver = function () {
        this._gameOver || this.setGameOver();
      }),
      (i.prototype.onScore = function (e) {
        var i = 0 === e.collisionMax ? 2 : 1;
        (this._score += i),
          t.Global.GAMEE && (Gamee.Gamee.instance.score = this._score),
          this._scoreEmitter.emitAt(
            this._tracks[1].player.x,
            this._tracks[1].y - 100
          );
        var n = this._scoreEmitter.emitParticle();
        null !== n && n.setFrame(0 === e.collisionMax ? "score2" : "score1");
      }),
      (i.prototype.onAchievement = function (t) {
        3 > t &&
          (this._title.show(t),
          this._konfetyEmitter.flow(100, 3, 50, !0),
          Utils.AudioUtils.playSound("bonus"));
      }),
      (i.prototype.createEmitters = function () {
        var t = new Particles.ParticlesEmitter(this.game, 0, 0, 32);
        (t = new Particles.ParticlesEmitter(this.game, 0, 0, 100)),
          (t.fixedToCamera = !0),
          (t.lifetime = 3),
          t.setXSpeed(-50, 50),
          t.setYSpeed(150, 200),
          t.setAngularSpeed(-90, 90),
          t.setScale(0.5, 1),
          (t.area = new Phaser.Line(0, 0, this.game.width, 0)),
          t.makeParticles("Sprites", ["konfeta1", "konfeta2", "konfeta3"], 100),
          this.world.add(t),
          (this._konfetyEmitter = t),
          (t = new Particles.ParticlesEmitter(this.game, 0, 0, 4)),
          (t.lifetime = 1),
          t.setYSpeed(-100, -100),
          t.makeParticles("Sprites", ["konfeta1", "konfeta2", "konfeta3"], 4),
          this.world.add(t),
          (this._scoreEmitter = t);
      }),
      (i.INITIAL_COUNTDOWN = 3001),
      (i.FLOORS = [381, 461, 541]),
      (i.TUTORIAL_FRAMES = ["tut0", "tut1"]),
      i
    );
  })(Phaser.State);
  t.Play = e;
})(RioSprint || (RioSprint = {}));
var Utils;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.setSounds = function (e, i) {
        void 0 === i && (i = null), (t._sfx = e), (t._sfxIds = i);
      }),
      (t.addSound = function (e, i) {
        t._sfxs[e] = i;
      }),
      (t.playSound = function (e) {
        var i;
        (i = "number" == typeof e ? t._sfxIds[e] : e),
          RioSprint.Global.soundOn &&
            (null !== t._sfx
              ? t._sfx.play(i)
              : void 0 !== t._sfxs[i] && t._sfxs[i].play());
      }),
      Object.defineProperty(t, "currentMusic", {
        get: function () {
          return t._currentMusic;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t, "isMusicPlaying", {
        get: function () {
          if (null === this._currentMusic || 0 === this._currentMusic.length)
            return !1;
          var e = t._music[t._currentMusic];
          return e.isPlaying;
        },
        enumerable: !0,
        configurable: !0,
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
            e in t._music && RioSprint.Global.musicOn))
        ) {
          t._currentMusic = e;
          var n = t._music[e];
          (n.loop = i),
            n.play(),
            i ||
              n.onStop.addOnce(function () {
                t.onFinished.dispatch(e);
              }, this);
        }
      }),
      (t.stopMusic = function () {
        if (null !== t._currentMusic && t._currentMusic.length > 0) {
          var e = t._music[t._currentMusic];
          e.isPlaying && e.stop(), (t._currentMusic = "");
        }
      }),
      (t.pauseMusic = function () {
        if (null !== t._currentMusic && t._currentMusic.length > 0) {
          var e = t._music[t._currentMusic];
          e.isPlaying && e.pause();
        }
      }),
      (t.resumeMusic = function () {
        if (null !== t._currentMusic && t._currentMusic.length > 0) {
          var e = t._music[t._currentMusic];
          e.paused && e.resume();
        }
      }),
      (t._sfx = null),
      (t._sfxs = {}),
      (t._music = {}),
      (t._currentMusic = ""),
      (t.onFinished = new Phaser.Signal()),
      t
    );
  })();
  t.AudioUtils = e;
})(Utils || (Utils = {}));
var Utils;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.supported = function () {
        var t = RioSprint.Global.game;
        return t.scale.compatibility.supportsFullScreen;
      }),
      (t.isFullscreen = function () {
        return RioSprint.Global.game.scale.isFullScreen;
      }),
      (t.changeFullscreen = function () {
        var e = RioSprint.Global.game;
        t._fullscreen
          ? e.scale.stopFullScreen()
          : e.scale.startFullScreen(!1, !1);
      }),
      (t.onEnterFullscreen = function () {
        (t._fullscreen = !0),
          null !== t._listener && t._listener.call(t._listenerContext, !0);
      }),
      (t.onLeaveFullscreen = function () {
        (t._fullscreen = !1),
          null !== t._listener && t._listener.call(t._listenerContext, !1);
      }),
      (t.setListener = function (e, i) {
        (t._listener = e), (t._listenerContext = i);
      }),
      (t.removeListener = function () {
        (t._listener = null), (t._listenerContext = null);
      }),
      (t._fullscreen = !1),
      (t._listener = null),
      (t._listenerContext = null),
      t
    );
  })();
  t.FullscreenUtils = e;
})(Utils || (Utils = {}));
var Utils;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.ChangeAnimationPhaserJSONData = function (t) {
        (Phaser.AnimationParser.myCallback = t),
          (Phaser.AnimationParser.JSONData = function (t, e) {
            if (e.frames) {
              for (
                var i = new Phaser.FrameData(), n = e.frames, r = 0;
                r < n.length;
                r++
              ) {
                var s = i.addFrame(
                  new Phaser.Frame(
                    r,
                    n[r].frame.x,
                    n[r].frame.y,
                    n[r].frame.w,
                    n[r].frame.h,
                    n[r].filename
                  )
                );
                n[r].trimmed &&
                  s.setTrim(
                    n[r].trimmed,
                    n[r].sourceSize.w,
                    n[r].sourceSize.h,
                    n[r].spriteSourceSize.x,
                    n[r].spriteSourceSize.y,
                    n[r].spriteSourceSize.w,
                    n[r].spriteSourceSize.h
                  ),
                  Phaser.AnimationParser.myCallback(s, n[r]);
              }
              return i;
            }
          });
      }),
      (t.AdjustTweenFunctions = function () {
        (Phaser.TweenManager.prototype.removeFromUpdateQueue = function (t) {
          var e = this._tweens.indexOf(t);
          -1 !== e
            ? this._tweens.splice(e, 1)
            : ((e = this._add.indexOf(t)), -1 !== e && this._add.splice(e, 1));
        }),
          (Phaser.Tween.prototype.stopAndRemoveFromUpdateQueue = function (t) {
            var e = this,
              i = e.stop(t);
            return (
              e.manager.removeFromUpdateQueue(e), (e.pendingDelete = !1), i
            );
          });
      }),
      (t.AddBitmapFontAddMethod = function () {
        Phaser.Cache.prototype.addBitmapFontFromImage = function (
          t,
          e,
          i,
          n,
          r,
          s,
          a
        ) {
          var o = this.getImage(i, !0),
            h = { url: e, data: o.data, font: null, base: o.base };
          void 0 === s && (s = 0),
            void 0 === a && (a = 0),
            "json" === r
              ? (h.font = Phaser.LoaderParser.jsonBitmapFont(n, h.base, s, a))
              : (h.font = Phaser.LoaderParser.xmlBitmapFont(n, h.base, s, a)),
            (this._cache.bitmapFont[t] = h),
            this._resolveURL(e, h);
        };
      }),
      t
    );
  })();
  t.PhaserUtils = e;
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
        (t.calculateScreenMetrics = function (t, n, r, s, a) {
          void 0 === r && (r = i.LANDSCAPE);
          var o, h;
          (o = window.innerWidth),
            (h = window.innerHeight),
            (o = Math.min(o, 1.5 * t)),
            (h = Math.min(h, 1.5 * n));
          var p = r === i.LANDSCAPE ? t / n : t / n,
            l = o / h,
            u = 0,
            c = 0,
            _ = 0,
            d = 0;
          l > p
            ? ((d = n),
              (_ = 2 * Math.ceil((d * l) / 2)),
              (_ = Math.min(_, s)),
              (u = (_ - t) / 2),
              (c = 0))
            : ((_ = t),
              (d = 2 * Math.ceil(_ / l / 2)),
              (d = Math.min(d, a)),
              (u = 0),
              (c = (d - n) / 2));
          var f = o / _,
            m = h / d;
          return (
            (this.screenMetrics = new e()),
            (this.screenMetrics.windowWidth = o),
            (this.screenMetrics.windowHeight = h),
            (this.screenMetrics.defaultGameWidth = t),
            (this.screenMetrics.defaultGameHeight = n),
            (this.screenMetrics.maxGameWidth = s),
            (this.screenMetrics.maxGameHeight = a),
            (this.screenMetrics.gameWidth = _),
            (this.screenMetrics.gameHeight = d),
            (this.screenMetrics.scaleX = f),
            (this.screenMetrics.scaleY = m),
            (this.screenMetrics.offsetX = u),
            (this.screenMetrics.offsetY = c),
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
            (i.musicOn = RioSprint.Global.musicOn),
              (i.soundOn = RioSprint.Global.soundOn),
              (i.currentLanguage = RioSprint.Global.currentLanguage);
            var n = JSON.stringify(i);
            localStorage.setItem("rio_save", n);
          }
        }),
        (t.load = function () {
          if (t.localStorageSupported()) {
            var e = JSON.parse(localStorage.getItem("rio_save"));
            return null === e || void 0 === e
              ? !1
              : ((RioSprint.Global.musicOn = e.musicOn),
                (RioSprint.Global.soundOn = e.soundOn),
                (RioSprint.Global.currentLanguage = e.currentLanguage),
                !0);
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
      (t.isAndroidStockBrowser = function () {
        var t = navigator.userAgent,
          e = /Android/.test(t),
          i = /Chrome/.test(t);
        return e && !i;
      }),
      t
    );
  })();
  t.SystemUtils = e;
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
        var n = i[e][RioSprint.Global.currentLanguage];
        return (
          void 0 === n &&
            ((RioSprint.Global.currentLanguage = "en"),
            (n = i[e][RioSprint.Global.currentLanguage])),
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
var RioSprint;
!(function (t) {
  var e = (function () {
    function t() {}
    return (
      (t.GAMEE = !0),
      (t.game = null),
      (t.paralax = !0),
      (t.GAME_WIDTH = 640),
      (t.GAME_HEIGHT = 640),
      (t.MAX_GAME_WIDTH = 640),
      (t.MAX_GAME_HEIGHT = 640),
      (t.scaleX = 1),
      (t.scaleY = 1),
      (t.correctOrientation = !1),
      (t.musicOn = !0),
      (t.soundOn = !0),
      (t.showLanguages = !1),
      (t.supportedLanguages = ["en"]),
      (t.currentLanguage = "en"),
      t
    );
  })();
  t.Global = e;
})(RioSprint || (RioSprint = {}));
var PhaserGlobal = { stopFocus: !0 };
window.onload = function () {
  var t = new RioSprint.Game();
  if (((RioSprint.Global.game = t), RioSprint.Global.GAMEE)) {
    var e = new Gamee.Gamee("TwoButtons", !0);
    e.setGame(t);
  }
};
var RioSprint;
!(function (t) {
  var e = (function (e) {
    function i() {
      var n =
          (window.innerWidth,
          window.innerHeight,
          Utils.ScreenUtils.calculateScreenMetrics(
            t.Global.GAME_WIDTH,
            t.Global.GAME_HEIGHT,
            Utils.Orientation.PORTRAIT,
            t.Global.MAX_GAME_WIDTH,
            t.Global.MAX_GAME_HEIGHT
          )),
        r = Phaser.AUTO;
      e.call(this, {
        width: n.gameWidth,
        height: n.gameHeight,
        renderer: r,
        parent: "content",
        transparent: !1,
        antialias: !0,
        physicsConfig: null,
        preserveDrawingBuffer: !0,
      }),
        (i.game = this),
        Utils.PhaserUtils.ChangeAnimationPhaserJSONData(
          this.additionalFrameProperties
        ),
        Utils.PhaserUtils.AdjustTweenFunctions(),
        Utils.PhaserUtils.AddBitmapFontAddMethod(),
        this.state.add("Boot", t.Boot),
        this.state.add("Preloader", t.Preloader),
        this.state.add("Menu", t.Menu),
        this.state.add("Play", t.Play),
        this.state.add("Test", t.Play),
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
      (i.prototype.additionalFrameProperties = function (t, e) {
        e.anchor && ((t.anchorX = e.anchor.w), (t.anchorY = e.anchor.h)),
          e.nextitem &&
            ((t.nextItemX = e.nextitem.w), (t.nextItemY = e.nextitem.h));
      }),
      i
    );
  })(Phaser.Game);
  t.Game = e;
})(RioSprint || (RioSprint = {}));
