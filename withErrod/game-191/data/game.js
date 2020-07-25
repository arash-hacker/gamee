var _STRINGS = {
  Ad: {
    Mobile: {
      Preroll: {
        ReadyIn: "The game is ready in ",
        Loading: "Your game is loading...",
        Close: "Close",
      },
      Header: {
        ReadyIn: "The game is ready in ",
        Loading: "Your game is loading...",
        Close: "Close",
      },
      End: {
        ReadyIn: "Advertisement ends in ",
        Loading: "Please wait ...",
        Close: "Close",
      },
    },
  },
  Loading: { Loading: "LOADING" },
  Tutorial: [
    ["Hi! My name is Makiman.", "Welcome to Gamee Street Racing!"],
    ["Hi! My name is Makiman.", "Welcome to Gamee Street Racing!"],
    ["Flick upwards to jump.", ""],
    ["Press the UP ARROW to", "jump."],
    ["Flick to the right", "to move!"],
    ["Press the RIGHT ARROW", "to move!"],
    ["Flick to go left.", ""],
    ["Press the LEFT ARROW to go left.", ""],
    ["Almost there! Go left!", ""],
    ["Almost there! Go left!", ""],
    ["Flick downwards to slide.", ""],
    ["Press the DOWN ARROW to slide.", ""],
    ["It's all up to you now.", "Good luck and have fun!"],
  ],
  UI: {
    enter: "enter",
    continue: "continue",
    owned: "owned",
    using: "using",
    makiman: "Makiman",
    "makiman-cape": "Makiman - Cape",
    "makiman-skateboard": "Skateboard",
    "makiman-hoverboard": "Hoverboard",
    patty: "Patty",
    "patty-cape": "Patty - Cape",
    "patty-rollerblades": "Hoverrollers",
    "patty-jetpack": "UFO",
  },
};
var _SETTINGS = {
  API: {
    Enabled: !0,
    Log: {
      Events: {
        InitializeGame: !0,
        EndGame: !0,
        Level: { Begin: !0, End: !0, Win: !0, Lose: !0, Draw: !0 },
      },
    },
  },
  Ad: {
    Mobile: {
      Preroll: {
        Enabled: !1,
        Duration: 5,
        Width: 300,
        Height: 250,
        Rotation: {
          Enabled: !1,
          Weight: {
            MobileAdInGamePreroll: 40,
            MobileAdInGamePreroll2: 40,
            MobileAdInGamePreroll3: 20,
          },
        },
      },
      Header: {
        Enabled: !1,
        Duration: 5,
        Width: 320,
        Height: 50,
        Rotation: {
          Enabled: !1,
          Weight: {
            MobileAdInGameHeader: 40,
            MobileAdInGameHeader2: 40,
            MobileAdInGameHeader3: 20,
          },
        },
      },
      Footer: {
        Enabled: !1,
        Duration: 5,
        Width: 320,
        Height: 50,
        Rotation: {
          Enabled: !1,
          Weight: {
            MobileAdInGameFooter: 40,
            MobileAdInGameFooter2: 40,
            MobileAdInGameFooter3: 20,
          },
        },
      },
      End: {
        Enabled: !1,
        Duration: 1,
        Width: 300,
        Height: 250,
        Rotation: {
          Enabled: !1,
          Weight: {
            MobileAdInGameEnd: 40,
            MobileAdInGameEnd2: 40,
            MobileAdInGameEnd3: 20,
          },
        },
      },
    },
  },
  Language: { Default: "en" },
  DeveloperBranding: {
    Splash: { Enabled: !1 },
    Logo: {
      Enabled: !0,
      Link: "http://google.com",
      LinkEnabled: !0,
      Width: 166,
      Height: 61,
    },
  },
  Branding: {
    Splash: { Enabled: !1 },
    Logo: {
      Enabled: !0,
      Link: "http://google.com",
      LinkEnabled: !0,
      Width: 166,
      Height: 61,
    },
  },
  MoreGames: {
    Enabled: !1,
    Link: "http://www.marketjs.com/game/links/mobile",
    NewWindow: !0,
  },
  Gamecenter: { Enabled: !0 },
};
var MobileAdInGamePreroll = {
  ad_duration: _SETTINGS.Ad.Mobile.Preroll.Duration,
  ad_width: _SETTINGS.Ad.Mobile.Preroll.Width,
  ad_height: _SETTINGS.Ad.Mobile.Preroll.Height,
  ready_in: _STRINGS.Ad.Mobile.Preroll.ReadyIn,
  loading: _STRINGS.Ad.Mobile.Preroll.Loading,
  close:
    _STRINGS.Ad.Mobile.Preroll.Close +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
  Initialize: function () {
    if (_SETTINGS.Ad.Mobile.Preroll.Rotation.Enabled) {
      var b = _SETTINGS.Ad.Mobile.Preroll.Rotation.Weight,
        c = b.MobileAdInGamePreroll,
        d = c + b.MobileAdInGamePreroll2,
        b = d + b.MobileAdInGamePreroll3,
        e = Math.floor(100 * Math.random());
      console.log("seed: ", e);
      e <= c
        ? (this.selectedOverlayName = "MobileAdInGamePreroll")
        : e <= d
        ? (this.selectedOverlayName = "MobileAdInGamePreroll2")
        : e <= b && (this.selectedOverlayName = "MobileAdInGamePreroll3");
      console.log("Ad rotating preroll enabled");
    } else
      (this.selectedOverlayName = "MobileAdInGamePreroll"),
        console.log("Ad rotating preroll disabled");
    console.log("selected:", this.selectedOverlayName);
    this.overlay = $("#" + this.selectedOverlayName);
    this.box = $("#" + this.selectedOverlayName + "-Box");
    this.game = $("#game");
    this.boxContents = {
      footer: $("#" + this.selectedOverlayName + "-Box-Footer"),
      header: $("#" + this.selectedOverlayName + "-Box-Header"),
      close: $("#" + this.selectedOverlayName + "-Box-Close"),
      body: $("#" + this.selectedOverlayName + "-Box-Body"),
    };
    this.box.width(this.ad_width);
    this.box.height(this.ad_height);
    this.box.css("left", (this.overlay.width() - this.box.width()) / 2);
    this.box.css(
      "top",
      (this.overlay.height() -
        this.box.height() -
        this.boxContents.header.height() -
        this.boxContents.footer.height()) /
        2
    );
    this.overlay.show(this.Timer(this.ad_duration));
  },
  Timer: function (b) {
    var c = b,
      d = setInterval(function () {
        MobileAdInGamePreroll.boxContents.header.text(
          MobileAdInGamePreroll.ready_in + c + "..."
        );
        MobileAdInGamePreroll.boxContents.footer.text(
          MobileAdInGamePreroll.loading
        );
        c--;
        0 > c &&
          (clearInterval(d),
          MobileAdInGamePreroll.boxContents.close.css(
            "left",
            MobileAdInGamePreroll.boxContents.body.width() - 23
          ),
          MobileAdInGamePreroll.boxContents.close.show(),
          MobileAdInGamePreroll.boxContents.header.html(
            MobileAdInGamePreroll.close
          ),
          MobileAdInGamePreroll.boxContents.footer.text(""));
      }, 1e3);
  },
  Close: function () {
    this.boxContents.close.hide();
    this.overlay.hide();
  },
};
var MobileAdInGameHeader = {
  ad_duration: _SETTINGS.Ad.Mobile.Header.Duration,
  ad_width: _SETTINGS.Ad.Mobile.Header.Width,
  ad_height: _SETTINGS.Ad.Mobile.Header.Height,
  Initialize: function () {
    if (_SETTINGS.Ad.Mobile.Header.Rotation.Enabled) {
      var b = _SETTINGS.Ad.Mobile.Header.Rotation.Weight,
        c = b.MobileAdInGameHeader,
        d = c + b.MobileAdInGameHeader2,
        b = d + b.MobileAdInGameHeader3,
        e = Math.floor(100 * Math.random());
      console.log("seed: ", e);
      e <= c
        ? (this.selectedOverlayName = "MobileAdInGameHeader")
        : e <= d
        ? (this.selectedOverlayName = "MobileAdInGameHeader2")
        : e <= b && (this.selectedOverlayName = "MobileAdInGameHeader3");
      console.log("Ad rotating header enabled");
    } else
      (this.selectedOverlayName = "MobileAdInGameHeader"),
        console.log("Ad rotating header disabled");
    this.div = $("#" + this.selectedOverlayName);
    this.game = $("#game");
    this.div.width(this.ad_width);
    this.div.height(this.ad_height);
    this.div.css(
      "left",
      this.game.position().left + (this.game.width() - this.div.width()) / 2
    );
    this.div.css("top", 0);
    this.div.show(this.Timer(this.ad_duration));
  },
  Timer: function (b) {
    var c = setInterval(function () {
      b--;
      0 > b && (MobileAdInGameHeader.div.hide(), clearInterval(c));
    }, 1e3);
  },
};
var MobileAdInGameFooter = {
  ad_duration: _SETTINGS.Ad.Mobile.Footer.Duration,
  ad_width: _SETTINGS.Ad.Mobile.Footer.Width,
  ad_height: _SETTINGS.Ad.Mobile.Footer.Height,
  Initialize: function () {
    if (_SETTINGS.Ad.Mobile.Footer.Rotation.Enabled) {
      var b = _SETTINGS.Ad.Mobile.Footer.Rotation.Weight,
        c = b.MobileAdInGameFooter,
        d = c + b.MobileAdInGameFooter2,
        b = d + b.MobileAdInGameFooter3,
        e = Math.floor(100 * Math.random());
      console.log("seed: ", e);
      e <= c
        ? (this.selectedOverlayName = "MobileAdInGameFooter")
        : e <= d
        ? (this.selectedOverlayName = "MobileAdInGameFooter2")
        : e <= b && (this.selectedOverlayName = "MobileAdInGameFooter3");
      console.log("Ad rotating footer enabled");
    } else
      (this.selectedOverlayName = "MobileAdInGameFooter"),
        console.log("Ad rotating footer disabled");
    this.div = $("#" + this.selectedOverlayName);
    this.game = $("#game");
    this.div.width(this.ad_width);
    this.div.height(this.ad_height);
    this.div.css(
      "left",
      this.game.position().left + (this.game.width() - this.div.width()) / 2
    );
    this.div.css("top", this.game.height() - this.div.height() - 5);
    this.div.show(this.Timer(this.ad_duration));
  },
  Timer: function (b) {
    var c = setInterval(function () {
      b--;
      0 > b && (MobileAdInGameFooter.div.hide(), clearInterval(c));
    }, 1e3);
  },
};
var MobileAdInGameEnd = {
  ad_duration: _SETTINGS.Ad.Mobile.End.Duration,
  ad_width: _SETTINGS.Ad.Mobile.End.Width,
  ad_height: _SETTINGS.Ad.Mobile.End.Height,
  ready_in: _STRINGS.Ad.Mobile.End.ReadyIn,
  loading: _STRINGS.Ad.Mobile.End.Loading,
  close:
    _STRINGS.Ad.Mobile.End.Close +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
  Initialize: function () {
    if (_SETTINGS.Ad.Mobile.End.Rotation.Enabled) {
      var b = _SETTINGS.Ad.Mobile.End.Rotation.Weight,
        c = b.MobileAdInGameEnd,
        d = c + b.MobileAdInGameEnd2,
        b = d + b.MobileAdInGameEnd3,
        e = Math.floor(100 * Math.random());
      console.log("seed: ", e);
      e <= c
        ? (this.selectedOverlayName = "MobileAdInGameEnd")
        : e <= d
        ? (this.selectedOverlayName = "MobileAdInGameEnd2")
        : e <= b && (this.selectedOverlayName = "MobileAdInGameEnd3");
      console.log("Ad rotating end enabled");
    } else
      (this.selectedOverlayName = "MobileAdInGameEnd"),
        console.log("Ad rotating end disabled");
    console.log("selected:", this.selectedOverlayName);
    this.overlay = $("#" + this.selectedOverlayName);
    this.box = $("#" + this.selectedOverlayName + "-Box");
    this.game = $("#game");
    this.boxContents = {
      footer: $("#" + this.selectedOverlayName + "-Box-Footer"),
      header: $("#" + this.selectedOverlayName + "-Box-Header"),
      close: $("#" + this.selectedOverlayName + "-Box-Close"),
      body: $("#" + this.selectedOverlayName + "-Box-Body"),
    };
    this.box.width(this.ad_width);
    this.box.height(this.ad_height);
    this.box.css("left", (this.overlay.width() - this.box.width()) / 2);
    this.box.css(
      "top",
      (this.overlay.height() -
        this.box.height() -
        this.boxContents.header.height() -
        this.boxContents.footer.height()) /
        2
    );
    this.overlay.show(this.Timer(this.ad_duration));
  },
  Timer: function (b) {
    var c = b,
      d = setInterval(function () {
        MobileAdInGameEnd.boxContents.header.text(
          MobileAdInGameEnd.ready_in + c + "..."
        );
        MobileAdInGameEnd.boxContents.footer.text(MobileAdInGameEnd.loading);
        c--;
        0 > c &&
          (clearInterval(d),
          MobileAdInGameEnd.boxContents.close.css(
            "left",
            MobileAdInGameEnd.boxContents.body.width() - 23
          ),
          MobileAdInGameEnd.boxContents.close.show(),
          MobileAdInGameEnd.boxContents.header.html(MobileAdInGameEnd.close),
          MobileAdInGameEnd.boxContents.footer.text(""));
      }, 1e3);
  },
  Close: function () {
    this.boxContents.close.hide();
    this.overlay.hide();
  },
};
(function (b, c) {
  function d(b, t, u) {
    if (u === c && 1 === b.nodeType)
      if (
        ((u = "data-" + t.replace(qc, "-$1").toLowerCase()),
        (u = b.getAttribute(u)),
        "string" == typeof u)
      ) {
        try {
          u =
            "true" === u
              ? !0
              : "false" === u
              ? !1
              : "null" === u
              ? null
              : +u + "" === u
              ? +u
              : rc.test(u)
              ? g.parseJSON(u)
              : u;
        } catch (d) {}
        g.data(b, t, u);
      } else u = c;
    return u;
  }
  function e(b) {
    for (var c in b)
      if (!("data" === c && g.isEmptyObject(b[c])) && "toJSON" !== c) return !1;
    return !0;
  }
  function f() {
    return !1;
  }
  function j() {
    return !0;
  }
  function m(b) {
    return !b || !b.parentNode || 11 === b.parentNode.nodeType;
  }
  function q(b, c) {
    do b = b[c];
    while (b && 1 !== b.nodeType);
    return b;
  }
  function l(b, c, u) {
    c = c || 0;
    if (g.isFunction(c))
      return g.grep(b, function (b, y) {
        return !!c.call(b, y, b) === u;
      });
    if (c.nodeType)
      return g.grep(b, function (b) {
        return (b === c) === u;
      });
    if ("string" == typeof c) {
      var d = g.grep(b, function (b) {
        return 1 === b.nodeType;
      });
      if (tc.test(c)) return g.filter(c, d, !u);
      c = g.filter(c, d);
    }
    return g.grep(b, function (b) {
      return 0 <= g.inArray(b, c) === u;
    });
  }
  function p(b) {
    var c = sb.split("|");
    b = b.createDocumentFragment();
    if (b.createElement) for (; c.length; ) b.createElement(c.pop());
    return b;
  }
  function n(b, c) {
    if (1 === c.nodeType && g.hasData(b)) {
      var u, d, l;
      d = g._data(b);
      var e = g._data(c, d),
        f = d.events;
      if (f)
        for (u in (delete e.handle, (e.events = {}), f)) {
          d = 0;
          for (l = f[u].length; d < l; d++) g.event.add(c, u, f[u][d]);
        }
      e.data && (e.data = g.extend({}, e.data));
    }
  }
  function s(b, c) {
    var u;
    1 === c.nodeType &&
      (c.clearAttributes && c.clearAttributes(),
      c.mergeAttributes && c.mergeAttributes(b),
      (u = c.nodeName.toLowerCase()),
      "object" === u
        ? (c.parentNode && (c.outerHTML = b.outerHTML),
          g.support.html5Clone &&
            b.innerHTML &&
            !g.trim(c.innerHTML) &&
            (c.innerHTML = b.innerHTML))
        : "input" === u && tb.test(b.type)
        ? ((c.defaultChecked = c.checked = b.checked),
          c.value !== b.value && (c.value = b.value))
        : "option" === u
        ? (c.selected = b.defaultSelected)
        : "input" === u || "textarea" === u
        ? (c.defaultValue = b.defaultValue)
        : "script" === u && c.text !== b.text && (c.text = b.text),
      c.removeAttribute(g.expando));
  }
  function r(b) {
    return "undefined" != typeof b.getElementsByTagName
      ? b.getElementsByTagName("*")
      : "undefined" != typeof b.querySelectorAll
      ? b.querySelectorAll("*")
      : [];
  }
  function v(b) {
    tb.test(b.type) && (b.defaultChecked = b.checked);
  }
  function z(b, c) {
    if (c in b) return c;
    for (
      var u = c.charAt(0).toUpperCase() + c.slice(1), d = c, g = ub.length;
      g--;

    )
      if (((c = ub[g] + u), c in b)) return c;
    return d;
  }
  function B(b, c) {
    return (
      (b = c || b),
      "none" === g.css(b, "display") || !g.contains(b.ownerDocument, b)
    );
  }
  function F(b, c) {
    for (var u, d, l = [], e = 0, f = b.length; e < f; e++)
      (u = b[e]),
        u.style &&
          ((l[e] = g._data(u, "olddisplay")),
          c
            ? (!l[e] && "none" === u.style.display && (u.style.display = ""),
              "" === u.style.display &&
                B(u) &&
                (l[e] = g._data(u, "olddisplay", ca(u.nodeName))))
            : ((d = M(u, "display")),
              !l[e] && "none" !== d && g._data(u, "olddisplay", d)));
    for (e = 0; e < f; e++)
      if (
        ((u = b[e]),
        u.style && (!c || "none" === u.style.display || "" === u.style.display))
      )
        u.style.display = c ? l[e] || "" : "none";
    return b;
  }
  function E(b, c, u) {
    return (b = uc.exec(c)) ? Math.max(0, b[1] - (u || 0)) + (b[2] || "px") : c;
  }
  function C(b, c, u, d) {
    c = u === (d ? "border" : "content") ? 4 : "width" === c ? 1 : 0;
    for (var l = 0; 4 > c; c += 2)
      "margin" === u && (l += g.css(b, u + da[c], !0)),
        d
          ? ("content" === u && (l -= parseFloat(M(b, "padding" + da[c])) || 0),
            "margin" !== u &&
              (l -= parseFloat(M(b, "border" + da[c] + "Width")) || 0))
          : ((l += parseFloat(M(b, "padding" + da[c])) || 0),
            "padding" !== u &&
              (l += parseFloat(M(b, "border" + da[c] + "Width")) || 0));
    return l;
  }
  function Y(b, c, u) {
    var d = "width" === c ? b.offsetWidth : b.offsetHeight,
      l = !0,
      e = g.support.boxSizing && "border-box" === g.css(b, "boxSizing");
    if (0 >= d || null == d) {
      d = M(b, c);
      if (0 > d || null == d) d = b.style[c];
      if (va.test(d)) return d;
      l = e && (g.support.boxSizingReliable || d === b.style[c]);
      d = parseFloat(d) || 0;
    }
    return d + C(b, c, u || (e ? "border" : "content"), l) + "px";
  }
  function ca(b) {
    if (Ua[b]) return Ua[b];
    var c = g("<" + b + ">").appendTo(x.body),
      u = c.css("display");
    c.remove();
    if ("none" === u || "" === u) {
      ka = x.body.appendChild(
        ka ||
          g.extend(x.createElement("iframe"), {
            frameBorder: 0,
            width: 0,
            height: 0,
          })
      );
      if (!la || !ka.createElement)
        (la = (ka.contentWindow || ka.contentDocument).document),
          la.write("<!doctype html><html><body>"),
          la.close();
      c = la.body.appendChild(la.createElement(b));
      u = M(c, "display");
      x.body.removeChild(ka);
    }
    return (Ua[b] = u), u;
  }
  function G(b, c, u, d) {
    var l;
    if (g.isArray(c))
      g.each(c, function (c, t) {
        u || vc.test(b)
          ? d(b, t)
          : G(b + "[" + ("object" == typeof t ? c : "") + "]", t, u, d);
      });
    else if (!u && "object" === g.type(c))
      for (l in c) G(b + "[" + l + "]", c[l], u, d);
    else d(b, c);
  }
  function vb(b) {
    return function (c, u) {
      "string" != typeof c && ((u = c), (c = "*"));
      var d,
        l,
        e = c.toLowerCase().split(ea),
        f = 0,
        p = e.length;
      if (g.isFunction(u))
        for (; f < p; f++)
          (d = e[f]),
            (l = /^\+/.test(d)) && (d = d.substr(1) || "*"),
            (d = b[d] = b[d] || []),
            d[l ? "unshift" : "push"](u);
    };
  }
  function wa(b, t, u, d, g, l) {
    g = g || t.dataTypes[0];
    l = l || {};
    l[g] = !0;
    var e;
    g = b[g];
    for (var f = 0, p = g ? g.length : 0, j = b === Va; f < p && (j || !e); f++)
      (e = g[f](t, u, d)),
        "string" == typeof e &&
          (!j || l[e]
            ? (e = c)
            : (t.dataTypes.unshift(e), (e = wa(b, t, u, d, e, l))));
    return (j || !e) && !l["*"] && (e = wa(b, t, u, d, "*", l)), e;
  }
  function wb(b, t) {
    var u,
      d,
      l = g.ajaxSettings.flatOptions || {};
    for (u in t) t[u] !== c && ((l[u] ? b : d || (d = {}))[u] = t[u]);
    d && g.extend(!0, b, d);
  }
  function xb() {
    try {
      return new b.XMLHttpRequest();
    } catch (y) {}
  }
  function yb() {
    return (
      setTimeout(function () {
        xa = c;
      }, 0),
      (xa = g.now())
    );
  }
  function zb(b, c, u) {
    var d,
      l = 0,
      e = ya.length,
      f = g.Deferred().always(function () {
        delete p.elem;
      }),
      p = function () {
        for (
          var c = xa || yb(),
            c = Math.max(0, j.startTime + j.duration - c),
            t = 1 - (c / j.duration || 0),
            d = 0,
            u = j.tweens.length;
          d < u;
          d++
        )
          j.tweens[d].run(t);
        return (
          f.notifyWith(b, [j, t, c]),
          1 > t && u ? c : (f.resolveWith(b, [j]), !1)
        );
      },
      j = f.promise({
        elem: b,
        props: g.extend({}, c),
        opts: g.extend(!0, { specialEasing: {} }, u),
        originalProperties: c,
        originalOptions: u,
        startTime: xa || yb(),
        duration: u.duration,
        tweens: [],
        createTween: function (c, t) {
          var d = g.Tween(
            b,
            j.opts,
            c,
            t,
            j.opts.specialEasing[c] || j.opts.easing
          );
          return j.tweens.push(d), d;
        },
        stop: function (c) {
          for (var t = 0, d = c ? j.tweens.length : 0; t < d; t++)
            j.tweens[t].run(1);
          return c ? f.resolveWith(b, [j, c]) : f.rejectWith(b, [j, c]), this;
        },
      });
    c = j.props;
    u = j.opts.specialEasing;
    var n, s, r, m;
    for (d in c)
      if (
        ((n = g.camelCase(d)),
        (s = u[n]),
        (r = c[d]),
        g.isArray(r) && ((s = r[1]), (r = c[d] = r[0])),
        d !== n && ((c[n] = r), delete c[d]),
        (m = g.cssHooks[n]) && "expand" in m)
      )
        for (d in ((r = m.expand(r)), delete c[n], r))
          d in c || ((c[d] = r[d]), (u[d] = s));
      else u[n] = s;
    for (; l < e; l++) if ((d = ya[l].call(j, b, c, j.opts))) return d;
    var v = j;
    g.each(c, function (b, y) {
      for (
        var c = (qa[b] || []).concat(qa["*"]), t = 0, d = c.length;
        t < d && !c[t].call(v, b, y);
        t++
      );
    });
    return (
      g.isFunction(j.opts.start) && j.opts.start.call(b, j),
      g.fx.timer(g.extend(p, { anim: j, queue: j.opts.queue, elem: b })),
      j
        .progress(j.opts.progress)
        .done(j.opts.done, j.opts.complete)
        .fail(j.opts.fail)
        .always(j.opts.always)
    );
  }
  function O(b, c, d, g, l) {
    return new O.prototype.init(b, c, d, g, l);
  }
  function za(b, c) {
    var d,
      g = { height: b },
      l = 0;
    for (c = c ? 1 : 0; 4 > l; l += 2 - c)
      (d = da[l]), (g["margin" + d] = g["padding" + d] = b);
    return c && (g.opacity = g.width = b), g;
  }
  function Ab(b) {
    return g.isWindow(b)
      ? b
      : 9 === b.nodeType
      ? b.defaultView || b.parentWindow
      : !1;
  }
  var Bb,
    Aa,
    x = b.document,
    xc = b.location,
    yc = b.navigator,
    zc = b.jQuery,
    Ac = b.$,
    Cb = Array.prototype.push,
    X = Array.prototype.slice,
    Db = Array.prototype.indexOf,
    Bc = Object.prototype.toString,
    Wa = Object.prototype.hasOwnProperty,
    Xa = String.prototype.trim,
    g = function (b, c) {
      return new g.fn.init(b, c, Bb);
    },
    Ba = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
    Cc = /\S/,
    ea = /\s+/,
    Dc = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    Ec = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
    Eb = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    Fc = /^[\],:{}\s]*$/,
    Gc = /(?:^|:|,)(?:\s*\[)+/g,
    Hc = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
    Ic = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
    Jc = /^-ms-/,
    Kc = /-([\da-z])/gi,
    Lc = function (b, c) {
      return (c + "").toUpperCase();
    },
    Ca = function () {
      x.addEventListener
        ? (x.removeEventListener("DOMContentLoaded", Ca, !1), g.ready())
        : "complete" === x.readyState &&
          (x.detachEvent("onreadystatechange", Ca), g.ready());
    },
    Fb = {};
  g.fn = g.prototype = {
    constructor: g,
    init: function (b, t, d) {
      var l, e;
      if (!b) return this;
      if (b.nodeType)
        return (this.context = this[0] = b), (this.length = 1), this;
      if ("string" == typeof b) {
        "<" === b.charAt(0) && ">" === b.charAt(b.length - 1) && 3 <= b.length
          ? (l = [null, b, null])
          : (l = Ec.exec(b));
        if (l && (l[1] || !t)) {
          if (l[1])
            return (
              (t = t instanceof g ? t[0] : t),
              (e = t && t.nodeType ? t.ownerDocument || t : x),
              (b = g.parseHTML(l[1], e, !0)),
              Eb.test(l[1]) && g.isPlainObject(t) && this.attr.call(b, t, !0),
              g.merge(this, b)
            );
          if ((t = x.getElementById(l[2])) && t.parentNode) {
            if (t.id !== l[2]) return d.find(b);
            this.length = 1;
            this[0] = t;
          }
          return (this.context = x), (this.selector = b), this;
        }
        return !t || t.jquery ? (t || d).find(b) : this.constructor(t).find(b);
      }
      return g.isFunction(b)
        ? d.ready(b)
        : (b.selector !== c &&
            ((this.selector = b.selector), (this.context = b.context)),
          g.makeArray(b, this));
    },
    selector: "",
    jquery: "1.8.2",
    length: 0,
    size: function () {
      return this.length;
    },
    toArray: function () {
      return X.call(this);
    },
    get: function (b) {
      return null == b
        ? this.toArray()
        : 0 > b
        ? this[this.length + b]
        : this[b];
    },
    pushStack: function (b, c, d) {
      b = g.merge(this.constructor(), b);
      return (
        (b.prevObject = this),
        (b.context = this.context),
        "find" === c
          ? (b.selector = this.selector + (this.selector ? " " : "") + d)
          : c && (b.selector = this.selector + "." + c + "(" + d + ")"),
        b
      );
    },
    each: function (b, c) {
      return g.each(this, b, c);
    },
    ready: function (b) {
      return g.ready.promise().done(b), this;
    },
    eq: function (b) {
      return (b = +b), -1 === b ? this.slice(b) : this.slice(b, b + 1);
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(-1);
    },
    slice: function () {
      return this.pushStack(
        X.apply(this, arguments),
        "slice",
        X.call(arguments).join(",")
      );
    },
    map: function (b) {
      return this.pushStack(
        g.map(this, function (c, d) {
          return b.call(c, d, c);
        })
      );
    },
    end: function () {
      return this.prevObject || this.constructor(null);
    },
    push: Cb,
    sort: [].sort,
    splice: [].splice,
  };
  g.fn.init.prototype = g.fn;
  g.extend = g.fn.extend = function () {
    var b,
      t,
      d,
      l,
      e,
      f,
      K = arguments[0] || {},
      j = 1,
      p = arguments.length,
      n = !1;
    "boolean" == typeof K && ((n = K), (K = arguments[1] || {}), (j = 2));
    "object" != typeof K && !g.isFunction(K) && (K = {});
    for (p === j && ((K = this), --j); j < p; j++)
      if (null != (b = arguments[j]))
        for (t in b)
          (d = K[t]),
            (l = b[t]),
            K !== l &&
              (n && l && (g.isPlainObject(l) || (e = g.isArray(l)))
                ? (e
                    ? ((e = !1), (f = d && g.isArray(d) ? d : []))
                    : (f = d && g.isPlainObject(d) ? d : {}),
                  (K[t] = g.extend(n, f, l)))
                : l !== c && (K[t] = l));
    return K;
  };
  g.extend({
    noConflict: function (c) {
      return b.$ === g && (b.$ = Ac), c && b.jQuery === g && (b.jQuery = zc), g;
    },
    isReady: !1,
    readyWait: 1,
    holdReady: function (b) {
      b ? g.readyWait++ : g.ready(!0);
    },
    ready: function (b) {
      if (!(!0 === b ? --g.readyWait : g.isReady)) {
        if (!x.body) return setTimeout(g.ready, 1);
        g.isReady = !0;
        (!0 !== b && 0 < --g.readyWait) ||
          (Aa.resolveWith(x, [g]),
          g.fn.trigger && g(x).trigger("ready").off("ready"));
      }
    },
    isFunction: function (b) {
      return "function" === g.type(b);
    },
    isArray:
      Array.isArray ||
      function (b) {
        return "array" === g.type(b);
      },
    isWindow: function (b) {
      return null != b && b == b.window;
    },
    isNumeric: function (b) {
      return !isNaN(parseFloat(b)) && isFinite(b);
    },
    type: function (b) {
      return null == b ? String(b) : Fb[Bc.call(b)] || "object";
    },
    isPlainObject: function (b) {
      if (!b || "object" !== g.type(b) || b.nodeType || g.isWindow(b))
        return !1;
      try {
        if (
          b.constructor &&
          !Wa.call(b, "constructor") &&
          !Wa.call(b.constructor.prototype, "isPrototypeOf")
        )
          return !1;
      } catch (t) {
        return !1;
      }
      for (var d in b);
      return d === c || Wa.call(b, d);
    },
    isEmptyObject: function (b) {
      for (var c in b) return !1;
      return !0;
    },
    error: function (b) {
      throw Error(b);
    },
    parseHTML: function (b, c, d) {
      var l;
      return !b || "string" != typeof b
        ? null
        : ("boolean" == typeof c && ((d = c), (c = 0)),
          (c = c || x),
          (l = Eb.exec(b))
            ? [c.createElement(l[1])]
            : ((l = g.buildFragment([b], c, d ? null : [])),
              g.merge(
                [],
                (l.cacheable ? g.clone(l.fragment) : l.fragment).childNodes
              )));
    },
    parseJSON: function (c) {
      if (!c || "string" != typeof c) return null;
      c = g.trim(c);
      if (b.JSON && b.JSON.parse) return b.JSON.parse(c);
      if (Fc.test(c.replace(Hc, "@").replace(Ic, "]").replace(Gc, "")))
        return new Function("return " + c)();
      g.error("Invalid JSON: " + c);
    },
    parseXML: function (y) {
      var t, d;
      if (!y || "string" != typeof y) return null;
      try {
        b.DOMParser
          ? ((d = new DOMParser()), (t = d.parseFromString(y, "text/xml")))
          : ((t = new ActiveXObject("Microsoft.XMLDOM")),
            (t.async = "false"),
            t.loadXML(y));
      } catch (l) {
        t = c;
      }
      return (
        (!t ||
          !t.documentElement ||
          t.getElementsByTagName("parsererror").length) &&
          g.error("Invalid XML: " + y),
        t
      );
    },
    noop: function () {},
    globalEval: function (c) {
      c &&
        Cc.test(c) &&
        (
          b.execScript ||
          function (c) {
            b.eval.call(b, c);
          }
        )(c);
    },
    camelCase: function (b) {
      return b.replace(Jc, "ms-").replace(Kc, Lc);
    },
    nodeName: function (b, c) {
      return b.nodeName && b.nodeName.toLowerCase() === c.toLowerCase();
    },
    each: function (b, t, d) {
      var l,
        e = 0,
        f = b.length,
        K = f === c || g.isFunction(b);
      if (d)
        if (K)
          for (l in b) {
            if (!1 === t.apply(b[l], d)) break;
          }
        else for (; e < f && !1 !== t.apply(b[e++], d); );
      else if (K)
        for (l in b) {
          if (!1 === t.call(b[l], l, b[l])) break;
        }
      else for (; e < f && !1 !== t.call(b[e], e, b[e++]); );
      return b;
    },
    trim:
      Xa && !Xa.call("\ufeff\u00a0")
        ? function (b) {
            return null == b ? "" : Xa.call(b);
          }
        : function (b) {
            return null == b ? "" : (b + "").replace(Dc, "");
          },
    makeArray: function (b, c) {
      var d,
        l = c || [];
      return (
        null != b &&
          ((d = g.type(b)),
          null == b.length ||
          "string" === d ||
          "function" === d ||
          "regexp" === d ||
          g.isWindow(b)
            ? Cb.call(l, b)
            : g.merge(l, b)),
        l
      );
    },
    inArray: function (b, c, d) {
      var l;
      if (c) {
        if (Db) return Db.call(c, b, d);
        l = c.length;
        for (d = d ? (0 > d ? Math.max(0, l + d) : d) : 0; d < l; d++)
          if (d in c && c[d] === b) return d;
      }
      return -1;
    },
    merge: function (b, t) {
      var d = t.length,
        l = b.length,
        g = 0;
      if ("number" == typeof d) for (; g < d; g++) b[l++] = t[g];
      else for (; t[g] !== c; ) b[l++] = t[g++];
      return (b.length = l), b;
    },
    grep: function (b, c, d) {
      var l,
        g = [],
        e = 0,
        f = b.length;
      for (d = !!d; e < f; e++) (l = !!c(b[e], e)), d !== l && g.push(b[e]);
      return g;
    },
    map: function (b, t, d) {
      var l,
        e,
        f = [],
        K = 0,
        j = b.length;
      if (
        b instanceof g ||
        (j !== c &&
          "number" == typeof j &&
          ((0 < j && b[0] && b[j - 1]) || 0 === j || g.isArray(b)))
      )
        for (; K < j; K++) (l = t(b[K], K, d)), null != l && (f[f.length] = l);
      else for (e in b) (l = t(b[e], e, d)), null != l && (f[f.length] = l);
      return f.concat.apply([], f);
    },
    guid: 1,
    proxy: function (b, t) {
      var d, l, e;
      return (
        "string" == typeof t && ((d = b[t]), (t = b), (b = d)),
        g.isFunction(b)
          ? ((l = X.call(arguments, 2)),
            (e = function () {
              return b.apply(t, l.concat(X.call(arguments)));
            }),
            (e.guid = b.guid = b.guid || g.guid++),
            e)
          : c
      );
    },
    access: function (b, t, d, l, e, f, K) {
      var j,
        p = null == d,
        n = 0,
        s = b.length;
      if (d && "object" == typeof d) {
        for (n in d) g.access(b, t, n, d[n], 1, f, l);
        e = 1;
      } else if (l !== c) {
        j = K === c && g.isFunction(l);
        p &&
          (j
            ? ((j = t),
              (t = function (b, c, y) {
                return j.call(g(b), y);
              }))
            : (t.call(b, l), (t = null)));
        if (t)
          for (; n < s; n++) t(b[n], d, j ? l.call(b[n], n, t(b[n], d)) : l, K);
        e = 1;
      }
      return e ? b : p ? t.call(b) : s ? t(b[0], d) : f;
    },
    now: function () {
      return new Date().getTime();
    },
  });
  g.ready.promise = function (c) {
    if (!Aa)
      if (((Aa = g.Deferred()), "complete" === x.readyState))
        setTimeout(g.ready, 1);
      else if (x.addEventListener)
        x.addEventListener("DOMContentLoaded", Ca, !1),
          b.addEventListener("load", g.ready, !1);
      else {
        x.attachEvent("onreadystatechange", Ca);
        b.attachEvent("onload", g.ready);
        var t = !1;
        try {
          t = null == b.frameElement && x.documentElement;
        } catch (d) {}
        t &&
          t.doScroll &&
          (function sc() {
            if (!g.isReady) {
              try {
                t.doScroll("left");
              } catch (b) {
                return setTimeout(sc, 50);
              }
              g.ready();
            }
          })();
      }
    return Aa.promise(c);
  };
  g.each(
    "Boolean Number String Function Array Date RegExp Object".split(" "),
    function (b, c) {
      Fb["[object " + c + "]"] = c.toLowerCase();
    }
  );
  Bb = g(x);
  var Gb = {};
  g.Callbacks = function (b) {
    var t;
    if ("string" == typeof b) {
      if (!(t = Gb[b])) {
        t = b;
        var d = (Gb[t] = {});
        t =
          (g.each(t.split(ea), function (b, c) {
            d[c] = !0;
          }),
          d);
      }
    } else t = g.extend({}, b);
    b = t;
    var l,
      e,
      f,
      K,
      j,
      p,
      n = [],
      s = !b.once && [],
      r = function (c) {
        l = b.memory && c;
        e = !0;
        p = K || 0;
        K = 0;
        j = n.length;
        for (f = !0; n && p < j; p++)
          if (!1 === n[p].apply(c[0], c[1]) && b.stopOnFalse) {
            l = !1;
            break;
          }
        f = !1;
        n && (s ? s.length && r(s.shift()) : l ? (n = []) : m.disable());
      },
      m = {
        add: function () {
          if (n) {
            var c = n.length;
            (function wc(c) {
              g.each(c, function (c, t) {
                var d = g.type(t);
                "function" === d && (!b.unique || !m.has(t))
                  ? n.push(t)
                  : t && t.length && "string" !== d && wc(t);
              });
            })(arguments);
            f ? (j = n.length) : l && ((K = c), r(l));
          }
          return this;
        },
        remove: function () {
          return (
            n &&
              g.each(arguments, function (b, c) {
                for (var y; -1 < (y = g.inArray(c, n, y)); )
                  n.splice(y, 1), f && (y <= j && j--, y <= p && p--);
              }),
            this
          );
        },
        has: function (b) {
          return -1 < g.inArray(b, n);
        },
        empty: function () {
          return (n = []), this;
        },
        disable: function () {
          return (n = s = l = c), this;
        },
        disabled: function () {
          return !n;
        },
        lock: function () {
          return (s = c), l || m.disable(), this;
        },
        locked: function () {
          return !s;
        },
        fireWith: function (b, c) {
          return (
            (c = c || []),
            (c = [b, c.slice ? c.slice() : c]),
            n && (!e || s) && (f ? s.push(c) : r(c)),
            this
          );
        },
        fire: function () {
          return m.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!e;
        },
      };
    return m;
  };
  g.extend({
    Deferred: function (b) {
      var c = [
          ["resolve", "done", g.Callbacks("once memory"), "resolved"],
          ["reject", "fail", g.Callbacks("once memory"), "rejected"],
          ["notify", "progress", g.Callbacks("memory")],
        ],
        d = "pending",
        l = {
          state: function () {
            return d;
          },
          always: function () {
            return e.done(arguments).fail(arguments), this;
          },
          then: function () {
            var b = arguments;
            return g
              .Deferred(function (y) {
                g.each(c, function (c, t) {
                  var d = t[0],
                    l = b[c];
                  e[t[1]](
                    g.isFunction(l)
                      ? function () {
                          var b = l.apply(this, arguments);
                          b && g.isFunction(b.promise)
                            ? b
                                .promise()
                                .done(y.resolve)
                                .fail(y.reject)
                                .progress(y.notify)
                            : y[d + "With"](this === e ? y : this, [b]);
                        }
                      : y[d]
                  );
                });
                b = null;
              })
              .promise();
          },
          promise: function (b) {
            return null != b ? g.extend(b, l) : l;
          },
        },
        e = {};
      return (
        (l.pipe = l.then),
        g.each(c, function (b, y) {
          var g = y[2],
            f = y[3];
          l[y[1]] = g.add;
          f &&
            g.add(
              function () {
                d = f;
              },
              c[b ^ 1][2].disable,
              c[2][2].lock
            );
          e[y[0]] = g.fire;
          e[y[0] + "With"] = g.fireWith;
        }),
        l.promise(e),
        b && b.call(e, e),
        e
      );
    },
    when: function (b) {
      var c = 0,
        d = X.call(arguments),
        l = d.length,
        e = 1 !== l || (b && g.isFunction(b.promise)) ? l : 0,
        f = 1 === e ? b : g.Deferred(),
        j = function (b, c, y) {
          return function (t) {
            c[b] = this;
            y[b] = 1 < arguments.length ? X.call(arguments) : t;
            y === p ? f.notifyWith(c, y) : --e || f.resolveWith(c, y);
          };
        },
        p,
        n,
        s;
      if (1 < l) {
        p = Array(l);
        n = Array(l);
        for (s = Array(l); c < l; c++)
          d[c] && g.isFunction(d[c].promise)
            ? d[c]
                .promise()
                .done(j(c, s, d))
                .fail(f.reject)
                .progress(j(c, n, p))
            : --e;
      }
      return e || f.resolveWith(s, d), f.promise();
    },
  });
  var Mc = g,
    Ya,
    L,
    Da,
    fa,
    Ea,
    Fa,
    Q,
    ga,
    Ga,
    Za,
    ra,
    Hb,
    H = x.createElement("div");
  H.setAttribute("className", "t");
  H.innerHTML =
    "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
  Da = H.getElementsByTagName("*");
  fa = H.getElementsByTagName("a")[0];
  fa.style.cssText = "top:1px;float:left;opacity:.5";
  if (!Da || !Da.length) Ya = {};
  else {
    Ea = x.createElement("select");
    Fa = Ea.appendChild(x.createElement("option"));
    Q = H.getElementsByTagName("input")[0];
    L = {
      leadingWhitespace: 3 === H.firstChild.nodeType,
      tbody: !H.getElementsByTagName("tbody").length,
      htmlSerialize: !!H.getElementsByTagName("link").length,
      style: /top/.test(fa.getAttribute("style")),
      hrefNormalized: "/a" === fa.getAttribute("href"),
      opacity: /^0.5/.test(fa.style.opacity),
      cssFloat: !!fa.style.cssFloat,
      checkOn: "on" === Q.value,
      optSelected: Fa.selected,
      getSetAttribute: "t" !== H.className,
      enctype: !!x.createElement("form").enctype,
      html5Clone:
        "<:nav></:nav>" !== x.createElement("nav").cloneNode(!0).outerHTML,
      boxModel: "CSS1Compat" === x.compatMode,
      submitBubbles: !0,
      changeBubbles: !0,
      focusinBubbles: !1,
      deleteExpando: !0,
      noCloneEvent: !0,
      inlineBlockNeedsLayout: !1,
      shrinkWrapBlocks: !1,
      reliableMarginRight: !0,
      boxSizingReliable: !0,
      pixelPosition: !1,
    };
    Q.checked = !0;
    L.noCloneChecked = Q.cloneNode(!0).checked;
    Ea.disabled = !0;
    L.optDisabled = !Fa.disabled;
    try {
      delete H.test;
    } catch (Od) {
      L.deleteExpando = !1;
    }
    !H.addEventListener &&
      H.attachEvent &&
      H.fireEvent &&
      (H.attachEvent(
        "onclick",
        (Hb = function () {
          L.noCloneEvent = !1;
        })
      ),
      H.cloneNode(!0).fireEvent("onclick"),
      H.detachEvent("onclick", Hb));
    Q = x.createElement("input");
    Q.value = "t";
    Q.setAttribute("type", "radio");
    L.radioValue = "t" === Q.value;
    Q.setAttribute("checked", "checked");
    Q.setAttribute("name", "t");
    H.appendChild(Q);
    ga = x.createDocumentFragment();
    ga.appendChild(H.lastChild);
    L.checkClone = ga.cloneNode(!0).cloneNode(!0).lastChild.checked;
    L.appendChecked = Q.checked;
    ga.removeChild(Q);
    ga.appendChild(H);
    if (H.attachEvent)
      for (Za in { submit: !0, change: !0, focusin: !0 })
        (Ga = "on" + Za),
          (ra = Ga in H) ||
            (H.setAttribute(Ga, "return;"), (ra = "function" == typeof H[Ga])),
          (L[Za + "Bubbles"] = ra);
    Ya =
      (g(function () {
        var c,
          t,
          d,
          l,
          g = x.getElementsByTagName("body")[0];
        g &&
          ((c = x.createElement("div")),
          (c.style.cssText =
            "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px"),
          g.insertBefore(c, g.firstChild),
          (t = x.createElement("div")),
          c.appendChild(t),
          (t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>"),
          (d = t.getElementsByTagName("td")),
          (d[0].style.cssText = "padding:0;margin:0;border:0;display:none"),
          (ra = 0 === d[0].offsetHeight),
          (d[0].style.display = ""),
          (d[1].style.display = "none"),
          (L.reliableHiddenOffsets = ra && 0 === d[0].offsetHeight),
          (t.innerHTML = ""),
          (t.style.cssText =
            "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;"),
          (L.boxSizing = 4 === t.offsetWidth),
          (L.doesNotIncludeMarginInBodyOffset = 1 !== g.offsetTop),
          b.getComputedStyle &&
            ((L.pixelPosition =
              "1%" !== (b.getComputedStyle(t, null) || {}).top),
            (L.boxSizingReliable =
              "4px" ===
              (b.getComputedStyle(t, null) || { width: "4px" }).width),
            (l = x.createElement("div")),
            (l.style.cssText = t.style.cssText =
              "padding:0;margin:0;border:0;display:block;overflow:hidden;"),
            (l.style.marginRight = l.style.width = "0"),
            (t.style.width = "1px"),
            t.appendChild(l),
            (L.reliableMarginRight = !parseFloat(
              (b.getComputedStyle(l, null) || {}).marginRight
            ))),
          "undefined" != typeof t.style.zoom &&
            ((t.innerHTML = ""),
            (t.style.cssText =
              "padding:0;margin:0;border:0;display:block;overflow:hidden;width:1px;padding:1px;display:inline;zoom:1"),
            (L.inlineBlockNeedsLayout = 3 === t.offsetWidth),
            (t.style.display = "block"),
            (t.style.overflow = "visible"),
            (t.innerHTML = "<div></div>"),
            (t.firstChild.style.width = "5px"),
            (L.shrinkWrapBlocks = 3 !== t.offsetWidth),
            (c.style.zoom = 1)),
          g.removeChild(c));
      }),
      ga.removeChild(H),
      (Da = fa = Ea = Fa = Q = ga = H = null),
      L);
  }
  Mc.support = Ya;
  var rc = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
    qc = /([A-Z])/g;
  g.extend({
    cache: {},
    deletedIds: [],
    uuid: 0,
    expando: "jQuery" + (g.fn.jquery + Math.random()).replace(/\D/g, ""),
    noData: {
      embed: !0,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      applet: !0,
    },
    hasData: function (b) {
      return (
        (b = b.nodeType ? g.cache[b[g.expando]] : b[g.expando]), !!b && !e(b)
      );
    },
    data: function (b, t, d, l) {
      if (g.acceptData(b)) {
        var e,
          f,
          j = g.expando,
          p = "string" == typeof t,
          n = b.nodeType,
          s = n ? g.cache : b,
          r = n ? b[j] : b[j] && j;
        if ((r && s[r] && (l || s[r].data)) || !(p && d === c)) {
          r || (n ? (b[j] = r = g.deletedIds.pop() || g.guid++) : (r = j));
          s[r] || ((s[r] = {}), n || (s[r].toJSON = g.noop));
          if ("object" == typeof t || "function" == typeof t)
            l
              ? (s[r] = g.extend(s[r], t))
              : (s[r].data = g.extend(s[r].data, t));
          return (
            (e = s[r]),
            l || (e.data || (e.data = {}), (e = e.data)),
            d !== c && (e[g.camelCase(t)] = d),
            p ? ((f = e[t]), null == f && (f = e[g.camelCase(t)])) : (f = e),
            f
          );
        }
      }
    },
    removeData: function (b, c, d) {
      if (g.acceptData(b)) {
        var l,
          f,
          j,
          p = b.nodeType,
          n = p ? g.cache : b,
          s = p ? b[g.expando] : g.expando;
        if (n[s]) {
          if (c && (l = d ? n[s] : n[s].data)) {
            g.isArray(c) ||
              (c in l
                ? (c = [c])
                : ((c = g.camelCase(c)),
                  c in l ? (c = [c]) : (c = c.split(" "))));
            f = 0;
            for (j = c.length; f < j; f++) delete l[c[f]];
            if (!(d ? e : g.isEmptyObject)(l)) return;
          }
          if (d || !(delete n[s].data, !e(n[s])))
            p
              ? g.cleanData([b], !0)
              : g.support.deleteExpando || n != n.window
              ? delete n[s]
              : (n[s] = null);
        }
      }
    },
    _data: function (b, c, d) {
      return g.data(b, c, d, !0);
    },
    acceptData: function (b) {
      var c = b.nodeName && g.noData[b.nodeName.toLowerCase()];
      return !c || (!0 !== c && b.getAttribute("classid") === c);
    },
  });
  g.fn.extend({
    data: function (b, t) {
      var l,
        e,
        f,
        j,
        p,
        n = this[0],
        s = 0,
        r = null;
      if (b === c) {
        if (
          this.length &&
          ((r = g.data(n)), 1 === n.nodeType && !g._data(n, "parsedAttrs"))
        ) {
          f = n.attributes;
          for (p = f.length; s < p; s++)
            (j = f[s].name),
              j.indexOf("data-") ||
                ((j = g.camelCase(j.substring(5))), d(n, j, r[j]));
          g._data(n, "parsedAttrs", !0);
        }
        return r;
      }
      return "object" == typeof b
        ? this.each(function () {
            g.data(this, b);
          })
        : ((l = b.split(".", 2)),
          (l[1] = l[1] ? "." + l[1] : ""),
          (e = l[1] + "!"),
          g.access(
            this,
            function (t) {
              if (t === c)
                return (
                  (r = this.triggerHandler("getData" + e, [l[0]])),
                  r === c && n && ((r = g.data(n, b)), (r = d(n, b, r))),
                  r === c && l[1] ? this.data(l[0]) : r
                );
              l[1] = t;
              this.each(function () {
                var c = g(this);
                c.triggerHandler("setData" + e, l);
                g.data(this, b, t);
                c.triggerHandler("changeData" + e, l);
              });
            },
            null,
            t,
            1 < arguments.length,
            null,
            !1
          ));
    },
    removeData: function (b) {
      return this.each(function () {
        g.removeData(this, b);
      });
    },
  });
  g.extend({
    queue: function (b, c, d) {
      var l;
      if (b)
        return (
          (c = (c || "fx") + "queue"),
          (l = g._data(b, c)),
          d &&
            (!l || g.isArray(d)
              ? (l = g._data(b, c, g.makeArray(d)))
              : l.push(d)),
          l || []
        );
    },
    dequeue: function (b, c) {
      c = c || "fx";
      var d = g.queue(b, c),
        l = d.length,
        e = d.shift(),
        f = g._queueHooks(b, c),
        j = function () {
          g.dequeue(b, c);
        };
      "inprogress" === e && ((e = d.shift()), l--);
      e &&
        ("fx" === c && d.unshift("inprogress"), delete f.stop, e.call(b, j, f));
      !l && f && f.empty.fire();
    },
    _queueHooks: function (b, c) {
      var d = c + "queueHooks";
      return (
        g._data(b, d) ||
        g._data(b, d, {
          empty: g.Callbacks("once memory").add(function () {
            g.removeData(b, c + "queue", !0);
            g.removeData(b, d, !0);
          }),
        })
      );
    },
  });
  g.fn.extend({
    queue: function (b, d) {
      var l = 2;
      return (
        "string" != typeof b && ((d = b), (b = "fx"), l--),
        arguments.length < l
          ? g.queue(this[0], b)
          : d === c
          ? this
          : this.each(function () {
              var c = g.queue(this, b, d);
              g._queueHooks(this, b);
              "fx" === b && "inprogress" !== c[0] && g.dequeue(this, b);
            })
      );
    },
    dequeue: function (b) {
      return this.each(function () {
        g.dequeue(this, b);
      });
    },
    delay: function (b, c) {
      return (
        (b = g.fx ? g.fx.speeds[b] || b : b),
        (c = c || "fx"),
        this.queue(c, function (c, d) {
          var t = setTimeout(c, b);
          d.stop = function () {
            clearTimeout(t);
          };
        })
      );
    },
    clearQueue: function (b) {
      return this.queue(b || "fx", []);
    },
    promise: function (b, d) {
      var l,
        e = 1,
        f = g.Deferred(),
        j = this,
        p = this.length,
        n = function () {
          --e || f.resolveWith(j, [j]);
        };
      "string" != typeof b && ((d = b), (b = c));
      for (b = b || "fx"; p--; )
        (l = g._data(j[p], b + "queueHooks")) &&
          l.empty &&
          (e++, l.empty.add(n));
      return n(), f.promise(d);
    },
  });
  var Z,
    Ib,
    Jb,
    Kb = /[\t\r\n]/g,
    Nc = /\r/g,
    Oc = /^(?:button|input)$/i,
    Pc = /^(?:button|input|object|select|textarea)$/i,
    Qc = /^a(?:rea|)$/i,
    Lb = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    Mb = g.support.getSetAttribute;
  g.fn.extend({
    attr: function (b, c) {
      return g.access(this, g.attr, b, c, 1 < arguments.length);
    },
    removeAttr: function (b) {
      return this.each(function () {
        g.removeAttr(this, b);
      });
    },
    prop: function (b, c) {
      return g.access(this, g.prop, b, c, 1 < arguments.length);
    },
    removeProp: function (b) {
      return (
        (b = g.propFix[b] || b),
        this.each(function () {
          try {
            (this[b] = c), delete this[b];
          } catch (d) {}
        })
      );
    },
    addClass: function (b) {
      var c, d, l, e, f, j, p;
      if (g.isFunction(b))
        return this.each(function (c) {
          g(this).addClass(b.call(this, c, this.className));
        });
      if (b && "string" == typeof b) {
        c = b.split(ea);
        d = 0;
        for (l = this.length; d < l; d++)
          if (((e = this[d]), 1 === e.nodeType))
            if (!e.className && 1 === c.length) e.className = b;
            else {
              f = " " + e.className + " ";
              j = 0;
              for (p = c.length; j < p; j++)
                0 > f.indexOf(" " + c[j] + " ") && (f += c[j] + " ");
              e.className = g.trim(f);
            }
      }
      return this;
    },
    removeClass: function (b) {
      var d, l, e, f, j, p, n;
      if (g.isFunction(b))
        return this.each(function (c) {
          g(this).removeClass(b.call(this, c, this.className));
        });
      if ((b && "string" == typeof b) || b === c) {
        d = (b || "").split(ea);
        p = 0;
        for (n = this.length; p < n; p++)
          if (((e = this[p]), 1 === e.nodeType && e.className)) {
            l = (" " + e.className + " ").replace(Kb, " ");
            f = 0;
            for (j = d.length; f < j; f++)
              for (; 0 <= l.indexOf(" " + d[f] + " "); )
                l = l.replace(" " + d[f] + " ", " ");
            e.className = b ? g.trim(l) : "";
          }
      }
      return this;
    },
    toggleClass: function (b, c) {
      var d = typeof b,
        l = "boolean" == typeof c;
      return g.isFunction(b)
        ? this.each(function (d) {
            g(this).toggleClass(b.call(this, d, this.className, c), c);
          })
        : this.each(function () {
            if ("string" === d)
              for (
                var e, f = 0, j = g(this), p = c, n = b.split(ea);
                (e = n[f++]);

              )
                (p = l ? p : !j.hasClass(e)),
                  j[p ? "addClass" : "removeClass"](e);
            else if ("undefined" === d || "boolean" === d)
              this.className && g._data(this, "__className__", this.className),
                (this.className =
                  this.className || !1 === b
                    ? ""
                    : g._data(this, "__className__") || "");
          });
    },
    hasClass: function (b) {
      b = " " + b + " ";
      for (var c = 0, d = this.length; c < d; c++)
        if (
          1 === this[c].nodeType &&
          0 <= (" " + this[c].className + " ").replace(Kb, " ").indexOf(b)
        )
          return !0;
      return !1;
    },
    val: function (b) {
      var d,
        l,
        e,
        f = this[0];
      if (arguments.length)
        return (
          (e = g.isFunction(b)),
          this.each(function (l) {
            var f,
              u = g(this);
            if (
              1 === this.nodeType &&
              (e ? (f = b.call(this, l, u.val())) : (f = b),
              null == f
                ? (f = "")
                : "number" == typeof f
                ? (f += "")
                : g.isArray(f) &&
                  (f = g.map(f, function (b) {
                    return null == b ? "" : b + "";
                  })),
              (d =
                g.valHooks[this.type] ||
                g.valHooks[this.nodeName.toLowerCase()]),
              !d || !("set" in d) || d.set(this, f, "value") === c)
            )
              this.value = f;
          })
        );
      if (f)
        return (
          (d = g.valHooks[f.type] || g.valHooks[f.nodeName.toLowerCase()]),
          d && "get" in d && (l = d.get(f, "value")) !== c
            ? l
            : ((l = f.value),
              "string" == typeof l ? l.replace(Nc, "") : null == l ? "" : l)
        );
    },
  });
  g.extend({
    valHooks: {
      option: {
        get: function (b) {
          var c = b.attributes.value;
          return !c || c.specified ? b.value : b.text;
        },
      },
      select: {
        get: function (b) {
          var c,
            d,
            l = b.selectedIndex,
            e = [],
            f = b.options,
            j = "select-one" === b.type;
          if (0 > l) return null;
          b = j ? l : 0;
          for (d = j ? l + 1 : f.length; b < d; b++)
            if (
              ((c = f[b]),
              c.selected &&
                (g.support.optDisabled
                  ? !c.disabled
                  : null === c.getAttribute("disabled")) &&
                (!c.parentNode.disabled ||
                  !g.nodeName(c.parentNode, "optgroup")))
            ) {
              c = g(c).val();
              if (j) return c;
              e.push(c);
            }
          return j && !e.length && f.length ? g(f[l]).val() : e;
        },
        set: function (b, c) {
          var d = g.makeArray(c);
          return (
            g(b)
              .find("option")
              .each(function () {
                this.selected = 0 <= g.inArray(g(this).val(), d);
              }),
            d.length || (b.selectedIndex = -1),
            d
          );
        },
      },
    },
    attrFn: {},
    attr: function (b, d, l, e) {
      var f,
        j,
        p = b.nodeType;
      if (b && !(3 === p || 8 === p || 2 === p)) {
        if (e && g.isFunction(g.fn[d])) return g(b)[d](l);
        if ("undefined" == typeof b.getAttribute) return g.prop(b, d, l);
        (e = 1 !== p || !g.isXMLDoc(b)) &&
          ((d = d.toLowerCase()),
          (j = g.attrHooks[d] || (Lb.test(d) ? Ib : Z)));
        if (l !== c) {
          if (null === l) {
            g.removeAttr(b, d);
            return;
          }
          return j && "set" in j && e && (f = j.set(b, l, d)) !== c
            ? f
            : (b.setAttribute(d, l + ""), l);
        }
        return j && "get" in j && e && null !== (f = j.get(b, d))
          ? f
          : ((f = b.getAttribute(d)), null === f ? c : f);
      }
    },
    removeAttr: function (b, c) {
      var d,
        l,
        e,
        f,
        j = 0;
      if (c && 1 === b.nodeType)
        for (l = c.split(ea); j < l.length; j++)
          (e = l[j]) &&
            ((d = g.propFix[e] || e),
            (f = Lb.test(e)),
            f || g.attr(b, e, ""),
            b.removeAttribute(Mb ? e : d),
            f && d in b && (b[d] = !1));
    },
    attrHooks: {
      type: {
        set: function (b, c) {
          if (Oc.test(b.nodeName) && b.parentNode)
            g.error("type property can't be changed");
          else if (
            !g.support.radioValue &&
            "radio" === c &&
            g.nodeName(b, "input")
          ) {
            var d = b.value;
            return b.setAttribute("type", c), d && (b.value = d), c;
          }
        },
      },
      value: {
        get: function (b, c) {
          return Z && g.nodeName(b, "button")
            ? Z.get(b, c)
            : c in b
            ? b.value
            : null;
        },
        set: function (b, c, d) {
          if (Z && g.nodeName(b, "button")) return Z.set(b, c, d);
          b.value = c;
        },
      },
    },
    propFix: {
      tabindex: "tabIndex",
      readonly: "readOnly",
      for: "htmlFor",
      class: "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable",
    },
    prop: function (b, d, l) {
      var e,
        f,
        j,
        p = b.nodeType;
      if (b && !(3 === p || 8 === p || 2 === p))
        return (
          (j = 1 !== p || !g.isXMLDoc(b)),
          j && ((d = g.propFix[d] || d), (f = g.propHooks[d])),
          l !== c
            ? f && "set" in f && (e = f.set(b, l, d)) !== c
              ? e
              : (b[d] = l)
            : f && "get" in f && null !== (e = f.get(b, d))
            ? e
            : b[d]
        );
    },
    propHooks: {
      tabIndex: {
        get: function (b) {
          var d = b.getAttributeNode("tabindex");
          return d && d.specified
            ? parseInt(d.value, 10)
            : Pc.test(b.nodeName) || (Qc.test(b.nodeName) && b.href)
            ? 0
            : c;
        },
      },
    },
  });
  Ib = {
    get: function (b, d) {
      var l,
        e = g.prop(b, d);
      return !0 === e ||
        ("boolean" != typeof e &&
          (l = b.getAttributeNode(d)) &&
          !1 !== l.nodeValue)
        ? d.toLowerCase()
        : c;
    },
    set: function (b, c, d) {
      var l;
      return (
        !1 === c
          ? g.removeAttr(b, d)
          : ((l = g.propFix[d] || d),
            l in b && (b[l] = !0),
            b.setAttribute(d, d.toLowerCase())),
        d
      );
    },
  };
  Mb ||
    ((Jb = { name: !0, id: !0, coords: !0 }),
    (Z = g.valHooks.button = {
      get: function (b, d) {
        var l;
        return (
          (l = b.getAttributeNode(d)),
          l && (Jb[d] ? "" !== l.value : l.specified) ? l.value : c
        );
      },
      set: function (b, c, d) {
        var l = b.getAttributeNode(d);
        return (
          l || ((l = x.createAttribute(d)), b.setAttributeNode(l)),
          (l.value = c + "")
        );
      },
    }),
    g.each(["width", "height"], function (b, c) {
      g.attrHooks[c] = g.extend(g.attrHooks[c], {
        set: function (b, y) {
          if ("" === y) return b.setAttribute(c, "auto"), y;
        },
      });
    }),
    (g.attrHooks.contenteditable = {
      get: Z.get,
      set: function (b, c, d) {
        "" === c && (c = "false");
        Z.set(b, c, d);
      },
    }));
  g.support.hrefNormalized ||
    g.each(["href", "src", "width", "height"], function (b, d) {
      g.attrHooks[d] = g.extend(g.attrHooks[d], {
        get: function (b) {
          b = b.getAttribute(d, 2);
          return null === b ? c : b;
        },
      });
    });
  g.support.style ||
    (g.attrHooks.style = {
      get: function (b) {
        return b.style.cssText.toLowerCase() || c;
      },
      set: function (b, c) {
        return (b.style.cssText = c + "");
      },
    });
  g.support.optSelected ||
    (g.propHooks.selected = g.extend(g.propHooks.selected, {
      get: function (b) {
        b = b.parentNode;
        return (
          b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex),
          null
        );
      },
    }));
  g.support.enctype || (g.propFix.enctype = "encoding");
  g.support.checkOn ||
    g.each(["radio", "checkbox"], function () {
      g.valHooks[this] = {
        get: function (b) {
          return null === b.getAttribute("value") ? "on" : b.value;
        },
      };
    });
  g.each(["radio", "checkbox"], function () {
    g.valHooks[this] = g.extend(g.valHooks[this], {
      set: function (b, c) {
        if (g.isArray(c)) return (b.checked = 0 <= g.inArray(g(b).val(), c));
      },
    });
  });
  var $a = /^(?:textarea|input|select)$/i,
    Nb = /^([^\.]*|)(?:\.(.+)|)$/,
    Rc = /(?:^|\s)hover(\.\S+|)\b/,
    Sc = /^key/,
    Tc = /^(?:mouse|contextmenu)|click/,
    Ob = /^(?:focusinfocus|focusoutblur)$/,
    Pb = function (b) {
      return g.event.special.hover
        ? b
        : b.replace(Rc, "mouseenter$1 mouseleave$1");
    };
  g.event = {
    add: function (b, d, l, e, f) {
      var j, p, n, s, r, m, v, q, z;
      if (
        !(3 === b.nodeType || 8 === b.nodeType || !d || !l || !(j = g._data(b)))
      ) {
        l.handler && ((v = l), (l = v.handler), (f = v.selector));
        l.guid || (l.guid = g.guid++);
        (n = j.events) || (j.events = n = {});
        (p = j.handle) ||
          ((j.handle = p = function (b) {
            return "undefined" != typeof g &&
              (!b || g.event.triggered !== b.type)
              ? g.event.dispatch.apply(p.elem, arguments)
              : c;
          }),
          (p.elem = b));
        d = g.trim(Pb(d)).split(" ");
        for (j = 0; j < d.length; j++) {
          s = Nb.exec(d[j]) || [];
          r = s[1];
          m = (s[2] || "").split(".").sort();
          z = g.event.special[r] || {};
          r = (f ? z.delegateType : z.bindType) || r;
          z = g.event.special[r] || {};
          s = g.extend(
            {
              type: r,
              origType: s[1],
              data: e,
              handler: l,
              guid: l.guid,
              selector: f,
              needsContext: f && g.expr.match.needsContext.test(f),
              namespace: m.join("."),
            },
            v
          );
          q = n[r];
          if (
            !q &&
            ((q = n[r] = []),
            (q.delegateCount = 0),
            !z.setup || !1 === z.setup.call(b, e, m, p))
          )
            b.addEventListener
              ? b.addEventListener(r, p, !1)
              : b.attachEvent && b.attachEvent("on" + r, p);
          z.add &&
            (z.add.call(b, s), s.handler.guid || (s.handler.guid = l.guid));
          f ? q.splice(q.delegateCount++, 0, s) : q.push(s);
          g.event.global[r] = !0;
        }
        b = null;
      }
    },
    global: {},
    remove: function (b, c, d, l, e) {
      var f,
        j,
        p,
        n,
        s,
        r,
        m,
        v,
        q,
        z,
        x = g.hasData(b) && g._data(b);
      if (x && (m = x.events)) {
        c = g.trim(Pb(c || "")).split(" ");
        for (f = 0; f < c.length; f++)
          if (((j = Nb.exec(c[f]) || []), (p = n = j[1]), (j = j[2]), p)) {
            v = g.event.special[p] || {};
            p = (l ? v.delegateType : v.bindType) || p;
            q = m[p] || [];
            s = q.length;
            j = j
              ? RegExp(
                  "(^|\\.)" +
                    j.split(".").sort().join("\\.(?:.*\\.|)") +
                    "(\\.|$)"
                )
              : null;
            for (r = 0; r < q.length; r++)
              (z = q[r]),
                (e || n === z.origType) &&
                  (!d || d.guid === z.guid) &&
                  (!j || j.test(z.namespace)) &&
                  (!l || l === z.selector || ("**" === l && z.selector)) &&
                  (q.splice(r--, 1),
                  z.selector && q.delegateCount--,
                  v.remove && v.remove.call(b, z));
            0 === q.length &&
              s !== q.length &&
              ((!v.teardown || !1 === v.teardown.call(b, j, x.handle)) &&
                g.removeEvent(b, p, x.handle),
              delete m[p]);
          } else for (p in m) g.event.remove(b, p + c[f], d, l, !0);
        g.isEmptyObject(m) && (delete x.handle, g.removeData(b, "events", !0));
      }
    },
    customEvent: { getData: !0, setData: !0, changeData: !0 },
    trigger: function (d, l, e, f) {
      if (!e || (3 !== e.nodeType && 8 !== e.nodeType)) {
        var j,
          p,
          n,
          s,
          r,
          m,
          v,
          q = d.type || d;
        s = [];
        if (
          !Ob.test(q + g.event.triggered) &&
          (0 <= q.indexOf("!") && ((q = q.slice(0, -1)), (j = !0)),
          0 <= q.indexOf(".") &&
            ((s = q.split(".")), (q = s.shift()), s.sort()),
          (e && !g.event.customEvent[q]) || g.event.global[q])
        )
          if (
            ((d =
              "object" == typeof d
                ? d[g.expando]
                  ? d
                  : new g.Event(q, d)
                : new g.Event(q)),
            (d.type = q),
            (d.isTrigger = !0),
            (d.exclusive = j),
            (d.namespace = s.join(".")),
            (d.namespace_re = d.namespace
              ? RegExp("(^|\\.)" + s.join("\\.(?:.*\\.|)") + "(\\.|$)")
              : null),
            (s = 0 > q.indexOf(":") ? "on" + q : ""),
            e)
          ) {
            if (
              ((d.result = c),
              d.target || (d.target = e),
              (l = null != l ? g.makeArray(l) : []),
              l.unshift(d),
              (r = g.event.special[q] || {}),
              !(r.trigger && !1 === r.trigger.apply(e, l)))
            ) {
              v = [[e, r.bindType || q]];
              if (!f && !r.noBubble && !g.isWindow(e)) {
                p = r.delegateType || q;
                j = Ob.test(p + q) ? e : e.parentNode;
                for (n = e; j; j = j.parentNode) v.push([j, p]), (n = j);
                n === (e.ownerDocument || x) &&
                  v.push([n.defaultView || n.parentWindow || b, p]);
              }
              for (p = 0; p < v.length && !d.isPropagationStopped(); p++)
                (j = v[p][0]),
                  (d.type = v[p][1]),
                  (m =
                    (g._data(j, "events") || {})[d.type] &&
                    g._data(j, "handle")) && m.apply(j, l),
                  (m = s && j[s]) &&
                    g.acceptData(j) &&
                    m.apply &&
                    !1 === m.apply(j, l) &&
                    d.preventDefault();
              return (
                (d.type = q),
                !f &&
                  !d.isDefaultPrevented() &&
                  (!r._default ||
                    !1 === r._default.apply(e.ownerDocument, l)) &&
                  ("click" !== q || !g.nodeName(e, "a")) &&
                  g.acceptData(e) &&
                  s &&
                  e[q] &&
                  (("focus" !== q && "blur" !== q) ||
                    0 !== d.target.offsetWidth) &&
                  !g.isWindow(e) &&
                  ((n = e[s]),
                  n && (e[s] = null),
                  (g.event.triggered = q),
                  e[q](),
                  (g.event.triggered = c),
                  n && (e[s] = n)),
                d.result
              );
            }
          } else
            for (p in ((e = g.cache), e))
              e[p].events &&
                e[p].events[q] &&
                g.event.trigger(d, l, e[p].handle.elem, !0);
      }
    },
    dispatch: function (d) {
      d = g.event.fix(d || b.event);
      var l,
        e,
        f,
        j,
        p,
        n,
        s = (g._data(this, "events") || {})[d.type] || [],
        r = s.delegateCount,
        m = X.call(arguments),
        q = !d.exclusive && !d.namespace,
        v = g.event.special[d.type] || {},
        z = [];
      m[0] = d;
      d.delegateTarget = this;
      if (!(v.preDispatch && !1 === v.preDispatch.call(this, d))) {
        if (r && (!d.button || "click" !== d.type))
          for (e = d.target; e != this; e = e.parentNode || this)
            if (!0 !== e.disabled || "click" !== d.type) {
              j = {};
              p = [];
              for (l = 0; l < r; l++)
                (f = s[l]),
                  (n = f.selector),
                  j[n] === c &&
                    (j[n] = f.needsContext
                      ? 0 <= g(n, this).index(e)
                      : g.find(n, this, null, [e]).length),
                  j[n] && p.push(f);
              p.length && z.push({ elem: e, matches: p });
            }
        s.length > r && z.push({ elem: this, matches: s.slice(r) });
        for (l = 0; l < z.length && !d.isPropagationStopped(); l++) {
          j = z[l];
          d.currentTarget = j.elem;
          for (
            e = 0;
            e < j.matches.length && !d.isImmediatePropagationStopped();
            e++
          )
            if (
              ((f = j.matches[e]),
              q ||
                (!d.namespace && !f.namespace) ||
                (d.namespace_re && d.namespace_re.test(f.namespace)))
            )
              (d.data = f.data),
                (d.handleObj = f),
                (f = (
                  (g.event.special[f.origType] || {}).handle || f.handler
                ).apply(j.elem, m)),
                f !== c &&
                  ((d.result = f),
                  !1 === f && (d.preventDefault(), d.stopPropagation()));
        }
        return v.postDispatch && v.postDispatch.call(this, d), d.result;
      }
    },
    props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
      " "
    ),
    fixHooks: {},
    keyHooks: {
      props: ["char", "charCode", "key", "keyCode"],
      filter: function (b, c) {
        return (
          null == b.which &&
            (b.which = null != c.charCode ? c.charCode : c.keyCode),
          b
        );
      },
    },
    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(
        " "
      ),
      filter: function (b, d) {
        var l,
          e,
          f,
          g = d.button,
          j = d.fromElement;
        return (
          null == b.pageX &&
            null != d.clientX &&
            ((l = b.target.ownerDocument || x),
            (e = l.documentElement),
            (f = l.body),
            (b.pageX =
              d.clientX +
              ((e && e.scrollLeft) || (f && f.scrollLeft) || 0) -
              ((e && e.clientLeft) || (f && f.clientLeft) || 0)),
            (b.pageY =
              d.clientY +
              ((e && e.scrollTop) || (f && f.scrollTop) || 0) -
              ((e && e.clientTop) || (f && f.clientTop) || 0))),
          !b.relatedTarget &&
            j &&
            (b.relatedTarget = j === b.target ? d.toElement : j),
          !b.which &&
            g !== c &&
            (b.which = g & 1 ? 1 : g & 2 ? 3 : g & 4 ? 2 : 0),
          b
        );
      },
    },
    fix: function (b) {
      if (b[g.expando]) return b;
      var c,
        d,
        l = b,
        e = g.event.fixHooks[b.type] || {},
        f = e.props ? this.props.concat(e.props) : this.props;
      b = g.Event(l);
      for (c = f.length; c; ) (d = f[--c]), (b[d] = l[d]);
      return (
        b.target || (b.target = l.srcElement || x),
        3 === b.target.nodeType && (b.target = b.target.parentNode),
        (b.metaKey = !!b.metaKey),
        e.filter ? e.filter(b, l) : b
      );
    },
    special: {
      load: { noBubble: !0 },
      focus: { delegateType: "focusin" },
      blur: { delegateType: "focusout" },
      beforeunload: {
        setup: function (b, c, d) {
          g.isWindow(this) && (this.onbeforeunload = d);
        },
        teardown: function (b, c) {
          this.onbeforeunload === c && (this.onbeforeunload = null);
        },
      },
    },
    simulate: function (b, c, d, l) {
      b = g.extend(new g.Event(), d, {
        type: b,
        isSimulated: !0,
        originalEvent: {},
      });
      l ? g.event.trigger(b, null, c) : g.event.dispatch.call(c, b);
      b.isDefaultPrevented() && d.preventDefault();
    },
  };
  g.event.handle = g.event.dispatch;
  g.removeEvent = x.removeEventListener
    ? function (b, c, d) {
        b.removeEventListener && b.removeEventListener(c, d, !1);
      }
    : function (b, c, d) {
        c = "on" + c;
        b.detachEvent &&
          ("undefined" == typeof b[c] && (b[c] = null), b.detachEvent(c, d));
      };
  g.Event = function (b, c) {
    if (this instanceof g.Event)
      b && b.type
        ? ((this.originalEvent = b),
          (this.type = b.type),
          (this.isDefaultPrevented =
            b.defaultPrevented ||
            !1 === b.returnValue ||
            (b.getPreventDefault && b.getPreventDefault())
              ? j
              : f))
        : (this.type = b),
        c && g.extend(this, c),
        (this.timeStamp = (b && b.timeStamp) || g.now()),
        (this[g.expando] = !0);
    else return new g.Event(b, c);
  };
  g.Event.prototype = {
    preventDefault: function () {
      this.isDefaultPrevented = j;
      var b = this.originalEvent;
      b && (b.preventDefault ? b.preventDefault() : (b.returnValue = !1));
    },
    stopPropagation: function () {
      this.isPropagationStopped = j;
      var b = this.originalEvent;
      b && (b.stopPropagation && b.stopPropagation(), (b.cancelBubble = !0));
    },
    stopImmediatePropagation: function () {
      this.isImmediatePropagationStopped = j;
      this.stopPropagation();
    },
    isDefaultPrevented: f,
    isPropagationStopped: f,
    isImmediatePropagationStopped: f,
  };
  g.each({ mouseenter: "mouseover", mouseleave: "mouseout" }, function (b, c) {
    g.event.special[b] = {
      delegateType: c,
      bindType: c,
      handle: function (b) {
        var d,
          l = b.relatedTarget,
          y = b.handleObj;
        if (!l || (l !== this && !g.contains(this, l)))
          (b.type = y.origType),
            (d = y.handler.apply(this, arguments)),
            (b.type = c);
        return d;
      },
    };
  });
  g.support.submitBubbles ||
    (g.event.special.submit = {
      setup: function () {
        if (g.nodeName(this, "form")) return !1;
        g.event.add(this, "click._submit keypress._submit", function (b) {
          b = b.target;
          (b =
            g.nodeName(b, "input") || g.nodeName(b, "button") ? b.form : c) &&
            !g._data(b, "_submit_attached") &&
            (g.event.add(b, "submit._submit", function (b) {
              b._submit_bubble = !0;
            }),
            g._data(b, "_submit_attached", !0));
        });
      },
      postDispatch: function (b) {
        b._submit_bubble &&
          (delete b._submit_bubble,
          this.parentNode &&
            !b.isTrigger &&
            g.event.simulate("submit", this.parentNode, b, !0));
      },
      teardown: function () {
        if (g.nodeName(this, "form")) return !1;
        g.event.remove(this, "._submit");
      },
    });
  g.support.changeBubbles ||
    (g.event.special.change = {
      setup: function () {
        if ($a.test(this.nodeName)) {
          if ("checkbox" === this.type || "radio" === this.type)
            g.event.add(this, "propertychange._change", function (b) {
              "checked" === b.originalEvent.propertyName &&
                (this._just_changed = !0);
            }),
              g.event.add(this, "click._change", function (b) {
                this._just_changed && !b.isTrigger && (this._just_changed = !1);
                g.event.simulate("change", this, b, !0);
              });
          return !1;
        }
        g.event.add(this, "beforeactivate._change", function (b) {
          b = b.target;
          $a.test(b.nodeName) &&
            !g._data(b, "_change_attached") &&
            (g.event.add(b, "change._change", function (b) {
              this.parentNode &&
                !b.isSimulated &&
                !b.isTrigger &&
                g.event.simulate("change", this.parentNode, b, !0);
            }),
            g._data(b, "_change_attached", !0));
        });
      },
      handle: function (b) {
        var c = b.target;
        if (
          this !== c ||
          b.isSimulated ||
          b.isTrigger ||
          ("radio" !== c.type && "checkbox" !== c.type)
        )
          return b.handleObj.handler.apply(this, arguments);
      },
      teardown: function () {
        return g.event.remove(this, "._change"), !$a.test(this.nodeName);
      },
    });
  g.support.focusinBubbles ||
    g.each({ focus: "focusin", blur: "focusout" }, function (b, c) {
      var d = 0,
        l = function (b) {
          g.event.simulate(c, b.target, g.event.fix(b), !0);
        };
      g.event.special[c] = {
        setup: function () {
          0 === d++ && x.addEventListener(b, l, !0);
        },
        teardown: function () {
          0 === --d && x.removeEventListener(b, l, !0);
        },
      };
    });
  g.fn.extend({
    on: function (b, d, l, e, j) {
      var p, n;
      if ("object" == typeof b) {
        "string" != typeof d && ((l = l || d), (d = c));
        for (n in b) this.on(n, d, l, b[n], j);
        return this;
      }
      null == l && null == e
        ? ((e = d), (l = d = c))
        : null == e &&
          ("string" == typeof d
            ? ((e = l), (l = c))
            : ((e = l), (l = d), (d = c)));
      if (!1 === e) e = f;
      else if (!e) return this;
      return (
        1 === j &&
          ((p = e),
          (e = function (b) {
            return g().off(b), p.apply(this, arguments);
          }),
          (e.guid = p.guid || (p.guid = g.guid++))),
        this.each(function () {
          g.event.add(this, b, e, l, d);
        })
      );
    },
    one: function (b, c, d, l) {
      return this.on(b, c, d, l, 1);
    },
    off: function (b, d, l) {
      var e, j;
      if (b && b.preventDefault && b.handleObj)
        return (
          (e = b.handleObj),
          g(b.delegateTarget).off(
            e.namespace ? e.origType + "." + e.namespace : e.origType,
            e.selector,
            e.handler
          ),
          this
        );
      if ("object" == typeof b) {
        for (j in b) this.off(j, d, b[j]);
        return this;
      }
      if (!1 === d || "function" == typeof d) (l = d), (d = c);
      return (
        !1 === l && (l = f),
        this.each(function () {
          g.event.remove(this, b, l, d);
        })
      );
    },
    bind: function (b, c, d) {
      return this.on(b, null, c, d);
    },
    unbind: function (b, c) {
      return this.off(b, null, c);
    },
    live: function (b, c, d) {
      return g(this.context).on(b, this.selector, c, d), this;
    },
    die: function (b, c) {
      return g(this.context).off(b, this.selector || "**", c), this;
    },
    delegate: function (b, c, d, l) {
      return this.on(c, b, d, l);
    },
    undelegate: function (b, c, d) {
      return 1 === arguments.length
        ? this.off(b, "**")
        : this.off(c, b || "**", d);
    },
    trigger: function (b, c) {
      return this.each(function () {
        g.event.trigger(b, c, this);
      });
    },
    triggerHandler: function (b, c) {
      if (this[0]) return g.event.trigger(b, c, this[0], !0);
    },
    toggle: function (b) {
      var c = arguments,
        d = b.guid || g.guid++,
        l = 0,
        e = function (d) {
          var e = (g._data(this, "lastToggle" + b.guid) || 0) % l;
          return (
            g._data(this, "lastToggle" + b.guid, e + 1),
            d.preventDefault(),
            c[e].apply(this, arguments) || !1
          );
        };
      for (e.guid = d; l < c.length; ) c[l++].guid = d;
      return this.click(e);
    },
    hover: function (b, c) {
      return this.mouseenter(b).mouseleave(c || b);
    },
  });
  g.each(
    "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
      " "
    ),
    function (b, c) {
      g.fn[c] = function (b, d) {
        return (
          null == d && ((d = b), (b = null)),
          0 < arguments.length ? this.on(c, null, b, d) : this.trigger(c)
        );
      };
      Sc.test(c) && (g.event.fixHooks[c] = g.event.keyHooks);
      Tc.test(c) && (g.event.fixHooks[c] = g.event.mouseHooks);
    }
  );
  var Uc = b,
    A = function (b, c, d, l) {
      d = d || [];
      c = c || U;
      var e,
        f,
        g,
        j,
        p = c.nodeType;
      if (!b || "string" != typeof b) return d;
      if (1 !== p && 9 !== p) return [];
      g = Ha(c);
      if (!g && !l && (e = Vc.exec(b)))
        if ((j = e[1]))
          if (9 === p) {
            f = c.getElementById(j);
            if (!f || !f.parentNode) return d;
            if (f.id === j) return d.push(f), d;
          } else {
            if (
              c.ownerDocument &&
              (f = c.ownerDocument.getElementById(j)) &&
              Qb(c, f) &&
              f.id === j
            )
              return d.push(f), d;
          }
        else {
          if (e[2])
            return ma.apply(d, na.call(c.getElementsByTagName(b), 0)), d;
          if ((j = e[3]) && Rb && c.getElementsByClassName)
            return ma.apply(d, na.call(c.getElementsByClassName(j), 0)), d;
        }
      return ab(b.replace(Ia, "$1"), c, d, l, g);
    },
    sa = function (b) {
      return function (c) {
        return "input" === c.nodeName.toLowerCase() && c.type === b;
      };
    },
    Sb = function (b) {
      return function (c) {
        var d = c.nodeName.toLowerCase();
        return ("input" === d || "button" === d) && c.type === b;
      };
    },
    ha = function (b) {
      return V(function (c) {
        return (
          (c = +c),
          V(function (d, l) {
            for (var e, f = b([], d.length, c), g = f.length; g--; )
              d[(e = f[g])] && (d[e] = !(l[e] = d[e]));
          })
        );
      });
    },
    Ja = function (b, c, d) {
      if (b === c) return d;
      for (b = b.nextSibling; b; ) {
        if (b === c) return -1;
        b = b.nextSibling;
      }
      return 1;
    },
    La = function (b, c) {
      var d, l, e, f, g, j, p;
      if ((g = Tb[I][b])) return c ? 0 : g.slice(0);
      g = b;
      j = [];
      for (p = J.preFilter; g; ) {
        if (!d || (l = Wc.exec(g)))
          l && (g = g.slice(l[0].length)), j.push((e = []));
        d = !1;
        if ((l = Xc.exec(g)))
          e.push((d = new Ub(l.shift()))),
            (g = g.slice(d.length)),
            (d.type = l[0].replace(Ia, " "));
        for (f in J.filter)
          (l = Ka[f].exec(g)) &&
            (!p[f] || (l = p[f](l, U, !0))) &&
            (e.push((d = new Ub(l.shift()))),
            (g = g.slice(d.length)),
            (d.type = f),
            (d.matches = l));
        if (!d) break;
      }
      return c ? g.length : g ? A.error(b) : Tb(b, j).slice(0);
    },
    cb = function (b, c, d) {
      var l = c.dir,
        e = d && "parentNode" === c.dir,
        f = Yc++;
      return c.first
        ? function (c, d, f) {
            for (; (c = c[l]); ) if (e || 1 === c.nodeType) return b(c, d, f);
          }
        : function (c, d, g) {
            if (g)
              for (; (c = c[l]); ) {
                if ((e || 1 === c.nodeType) && b(c, d, g)) return c;
              }
            else
              for (var t, j = ta + " " + f + " ", u = j + bb; (c = c[l]); )
                if (e || 1 === c.nodeType) {
                  if ((t = c[I]) === u) return c.sizset;
                  if ("string" == typeof t && 0 === t.indexOf(j)) {
                    if (c.sizset) return c;
                  } else {
                    c[I] = u;
                    if (b(c, d, g)) return (c.sizset = !0), c;
                    c.sizset = !1;
                  }
                }
          };
    },
    db = function (b) {
      return 1 < b.length
        ? function (c, d, l) {
            for (var e = b.length; e--; ) if (!b[e](c, d, l)) return !1;
            return !0;
          }
        : b[0];
    },
    Ma = function (b, c, d, l, e) {
      for (var f, g = [], j = 0, p = b.length, n = null != c; j < p; j++)
        if ((f = b[j])) if (!d || d(f, l, e)) g.push(f), n && c.push(j);
      return g;
    },
    eb = function (b, c, d, l, e, f) {
      return (
        l && !l[I] && (l = eb(l)),
        e && !e[I] && (e = eb(e, f)),
        V(function (f, g, j, p) {
          if (!f || !e) {
            var n,
              s,
              r = [],
              m = [],
              N = g.length;
            if (!(s = f)) {
              s = c || "*";
              var q = j.nodeType ? [j] : j,
                v = [];
              n = 0;
              for (var z = q.length; n < z; n++) A(s, q[n], v, f);
              s = v;
            }
            q = b && (f || !c) ? Ma(s, r, b, j, p) : s;
            v = d ? (e || (f ? b : N || l) ? [] : g) : q;
            d && d(q, v, j, p);
            if (l) {
              s = Ma(v, m);
              l(s, [], j, p);
              for (j = s.length; j--; )
                if ((n = s[j])) v[m[j]] = !(q[m[j]] = n);
            }
            if (f)
              for (j = b && v.length; j--; ) {
                if ((n = v[j])) f[r[j]] = !(g[r[j]] = n);
              }
            else
              (v = Ma(v === g ? v.splice(N, v.length) : v)),
                e ? e(null, g, v, p) : ma.apply(g, v);
          }
        })
      );
    },
    fb = function (b) {
      var c,
        d,
        l,
        e = b.length,
        f = J.relative[b[0].type];
      d = f || J.relative[" "];
      for (
        var g = f ? 1 : 0,
          j = cb(
            function (b) {
              return b === c;
            },
            d,
            !0
          ),
          p = cb(
            function (b) {
              return -1 < Vb.call(c, b);
            },
            d,
            !0
          ),
          n = [
            function (b, d, l) {
              return (
                (!f && (l || d !== Na)) ||
                ((c = d).nodeType ? j(b, d, l) : p(b, d, l))
              );
            },
          ];
        g < e;
        g++
      )
        if ((d = J.relative[b[g].type])) n = [cb(db(n), d)];
        else {
          d = J.filter[b[g].type].apply(null, b[g].matches);
          if (d[I]) {
            for (l = ++g; l < e && !J.relative[b[l].type]; l++);
            return eb(
              1 < g && db(n),
              1 < g &&
                b
                  .slice(0, g - 1)
                  .join("")
                  .replace(Ia, "$1"),
              d,
              g < l && fb(b.slice(g, l)),
              l < e && fb((b = b.slice(l))),
              l < e && b.join("")
            );
          }
          n.push(d);
        }
      return db(n);
    },
    ab = function (b, c, d, l, e) {
      var f,
        g,
        j,
        p,
        n = La(b);
      if (!l && 1 === n.length) {
        g = n[0] = n[0].slice(0);
        if (
          2 < g.length &&
          "ID" === (j = g[0]).type &&
          9 === c.nodeType &&
          !e &&
          J.relative[g[1].type]
        ) {
          c = J.find.ID(j.matches[0].replace(ia, ""), c, e)[0];
          if (!c) return d;
          b = b.slice(g.shift().length);
        }
        for (f = Ka.POS.test(b) ? -1 : g.length - 1; 0 <= f; f--) {
          j = g[f];
          if (J.relative[(p = j.type)]) break;
          if ((p = J.find[p]))
            if (
              (l = p(
                j.matches[0].replace(ia, ""),
                (gb.test(g[0].type) && c.parentNode) || c,
                e
              ))
            ) {
              g.splice(f, 1);
              b = l.length && g.join("");
              if (!b) return ma.apply(d, na.call(l, 0)), d;
              break;
            }
        }
      }
      return hb(b, n)(l, c, e, d, gb.test(b)), d;
    },
    Wb = function () {},
    bb,
    ib,
    J,
    Oa,
    Ha,
    Qb,
    hb,
    jb,
    ua,
    Na,
    Xb = !0,
    I = ("sizcache" + Math.random()).replace(".", ""),
    Ub = String,
    U = Uc.document,
    T = U.documentElement,
    ta = 0,
    Yc = 0,
    Zc = [].pop,
    ma = [].push,
    na = [].slice,
    Vb =
      [].indexOf ||
      function (b) {
        for (var c = 0, d = this.length; c < d; c++)
          if (this[c] === b) return c;
        return -1;
      },
    V = function (b, c) {
      return (b[I] = null == c || c), b;
    },
    kb = function () {
      var b = {},
        c = [];
      return V(function (d, l) {
        return c.push(d) > J.cacheLength && delete b[c.shift()], (b[d] = l);
      }, b);
    },
    Yb = kb(),
    Tb = kb(),
    Zb = kb(),
    $b =
      "\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[-\\w]|[^\\x00-\\xa0])+)[\\x20\\t\\r\\n\\f]*(?:([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" +
      "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+".replace("w", "w#") +
      ")|)|)[\\x20\\t\\r\\n\\f]*\\]",
    lb =
      ":((?:\\\\.|[-\\w]|[^\\x00-\\xa0])+)(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" +
      $b +
      ")|[^:]|\\\\.)*|.*))\\)|)",
    Ia = /^[\x20\t\r\n\f]+|((?:^|[^\\])(?:\\.)*)[\x20\t\r\n\f]+$/g,
    Wc = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,
    Xc = /^[\x20\t\r\n\f]*([\x20\t\r\n\f>+~])[\x20\t\r\n\f]*/,
    $c = RegExp(lb),
    Vc = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,
    gb = /[\x20\t\r\n\f]*[+~]/,
    ad = /h\d/i,
    bd = /input|select|textarea|button/i,
    ia = /\\(?!\\)/g,
    Ka = {
      ID: /^#((?:\\.|[-\w]|[^\x00-\xa0])+)/,
      CLASS: /^\.((?:\\.|[-\w]|[^\x00-\xa0])+)/,
      NAME: /^\[name=['"]?((?:\\.|[-\w]|[^\x00-\xa0])+)['"]?\]/,
      TAG: RegExp(
        "^(" + "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+".replace("w", "w*") + ")"
      ),
      ATTR: RegExp("^" + $b),
      PSEUDO: RegExp("^" + lb),
      POS: /:(even|odd|eq|gt|lt|nth|first|last)(?:\([\x20\t\r\n\f]*((?:-\d)?\d*)[\x20\t\r\n\f]*\)|)(?=[^-]|$)/i,
      CHILD: RegExp(
        "^:(only|nth|first|last)-child(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)",
        "i"
      ),
      needsContext: RegExp(
        "^[\\x20\\t\\r\\n\\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)",
        "i"
      ),
    },
    aa = function (b) {
      var c = U.createElement("div");
      try {
        return b(c);
      } catch (d) {
        return !1;
      } finally {
      }
    },
    cd = aa(function (b) {
      return (
        b.appendChild(U.createComment("")), !b.getElementsByTagName("*").length
      );
    }),
    dd = aa(function (b) {
      return (
        (b.innerHTML = "<a href='#'></a>"),
        b.firstChild &&
          "undefined" !== typeof b.firstChild.getAttribute &&
          "#" === b.firstChild.getAttribute("href")
      );
    }),
    ed = aa(function (b) {
      b.innerHTML = "<select></select>";
      b = typeof b.lastChild.getAttribute("multiple");
      return "boolean" !== b && "string" !== b;
    }),
    Rb = aa(function (b) {
      return (
        (b.innerHTML =
          "<div class='hidden e'></div><div class='hidden'></div>"),
        !b.getElementsByClassName || !b.getElementsByClassName("e").length
          ? !1
          : ((b.lastChild.className = "e"),
            2 === b.getElementsByClassName("e").length)
      );
    }),
    fd = aa(function (b) {
      b.id = I + 0;
      b.innerHTML = "<a name='" + I + "'></a><div name='" + I + "'></div>";
      T.insertBefore(b, T.firstChild);
      var c =
        U.getElementsByName &&
        U.getElementsByName(I).length === 2 + U.getElementsByName(I + 0).length;
      return (ib = !U.getElementById(I)), T.removeChild(b), c;
    });
  try {
    na.call(T.childNodes, 0)[0].nodeType;
  } catch (Pd) {
    na = function (b) {
      for (var c, d = []; (c = this[b]); b++) d.push(c);
      return d;
    };
  }
  A.matches = function (b, c) {
    return A(b, null, null, c);
  };
  A.matchesSelector = function (b, c) {
    return 0 < A(c, null, null, [b]).length;
  };
  Oa = A.getText = function (b) {
    var c,
      d = "",
      l = 0;
    if ((c = b.nodeType))
      if (1 === c || 9 === c || 11 === c) {
        if ("string" == typeof b.textContent) return b.textContent;
        for (b = b.firstChild; b; b = b.nextSibling) d += Oa(b);
      } else {
        if (3 === c || 4 === c) return b.nodeValue;
      }
    else for (; (c = b[l]); l++) d += Oa(c);
    return d;
  };
  Ha = A.isXML = function (b) {
    return (b = b && (b.ownerDocument || b).documentElement)
      ? "HTML" !== b.nodeName
      : !1;
  };
  Qb = A.contains = T.contains
    ? function (b, c) {
        var d = 9 === b.nodeType ? b.documentElement : b,
          l = c && c.parentNode;
        return (
          b === l || !(!l || !(1 === l.nodeType && d.contains && d.contains(l)))
        );
      }
    : T.compareDocumentPosition
    ? function (b, c) {
        return c && !!(b.compareDocumentPosition(c) & 16);
      }
    : function (b, c) {
        for (; (c = c.parentNode); ) if (c === b) return !0;
        return !1;
      };
  A.attr = function (b, c) {
    var d,
      l = Ha(b);
    return (
      l || (c = c.toLowerCase()),
      (d = J.attrHandle[c])
        ? d(b)
        : l || ed
        ? b.getAttribute(c)
        : ((d = b.getAttributeNode(c)),
          d
            ? "boolean" == typeof b[c]
              ? b[c]
                ? c
                : null
              : d.specified
              ? d.value
              : null
            : null)
    );
  };
  J = A.selectors = {
    cacheLength: 50,
    createPseudo: V,
    match: Ka,
    attrHandle: dd
      ? {}
      : {
          href: function (b) {
            return b.getAttribute("href", 2);
          },
          type: function (b) {
            return b.getAttribute("type");
          },
        },
    find: {
      ID: ib
        ? function (b, c, d) {
            if ("undefined" !== typeof c.getElementById && !d)
              return (b = c.getElementById(b)) && b.parentNode ? [b] : [];
          }
        : function (b, c, d) {
            if ("undefined" !== typeof c.getElementById && !d)
              return (c = c.getElementById(b))
                ? c.id === b ||
                  ("undefined" !== typeof c.getAttributeNode &&
                    c.getAttributeNode("id").value === b)
                  ? [c]
                  : void 0
                : [];
          },
      TAG: cd
        ? function (b, c) {
            if ("undefined" !== typeof c.getElementsByTagName)
              return c.getElementsByTagName(b);
          }
        : function (b, c) {
            var d = c.getElementsByTagName(b);
            if ("*" === b) {
              for (var l, e = [], f = 0; (l = d[f]); f++)
                1 === l.nodeType && e.push(l);
              return e;
            }
            return d;
          },
      NAME:
        fd &&
        function (b, c) {
          if ("undefined" !== typeof c.getElementsByName)
            return c.getElementsByName(name);
        },
      CLASS:
        Rb &&
        function (b, c, d) {
          if ("undefined" !== typeof c.getElementsByClassName && !d)
            return c.getElementsByClassName(b);
        },
    },
    relative: {
      ">": { dir: "parentNode", first: !0 },
      " ": { dir: "parentNode" },
      "+": { dir: "previousSibling", first: !0 },
      "~": { dir: "previousSibling" },
    },
    preFilter: {
      ATTR: function (b) {
        return (
          (b[1] = b[1].replace(ia, "")),
          (b[3] = (b[4] || b[5] || "").replace(ia, "")),
          "~=" === b[2] && (b[3] = " " + b[3] + " "),
          b.slice(0, 4)
        );
      },
      CHILD: function (b) {
        return (
          (b[1] = b[1].toLowerCase()),
          "nth" === b[1]
            ? (b[2] || A.error(b[0]),
              (b[3] = +(b[3]
                ? b[4] + (b[5] || 1)
                : 2 * ("even" === b[2] || "odd" === b[2]))),
              (b[4] = +(b[6] + b[7] || "odd" === b[2])))
            : b[2] && A.error(b[0]),
          b
        );
      },
      PSEUDO: function (b) {
        var c, d;
        if (Ka.CHILD.test(b[0])) return null;
        if (b[3]) b[2] = b[3];
        else if ((c = b[4]))
          $c.test(c) &&
            (d = La(c, !0)) &&
            (d = c.indexOf(")", c.length - d) - c.length) &&
            ((c = c.slice(0, d)), (b[0] = b[0].slice(0, d))),
            (b[2] = c);
        return b.slice(0, 3);
      },
    },
    filter: {
      ID: ib
        ? function (b) {
            return (
              (b = b.replace(ia, "")),
              function (c) {
                return c.getAttribute("id") === b;
              }
            );
          }
        : function (b) {
            return (
              (b = b.replace(ia, "")),
              function (c) {
                return (
                  (c =
                    "undefined" !== typeof c.getAttributeNode &&
                    c.getAttributeNode("id")) && c.value === b
                );
              }
            );
          },
      TAG: function (b) {
        return "*" === b
          ? function () {
              return !0;
            }
          : ((b = b.replace(ia, "").toLowerCase()),
            function (c) {
              return c.nodeName && c.nodeName.toLowerCase() === b;
            });
      },
      CLASS: function (b) {
        var c = Yb[I][b];
        return (
          c ||
            (c = Yb(
              b,
              RegExp("(^|[\\x20\\t\\r\\n\\f])" + b + "([\\x20\\t\\r\\n\\f]|$)")
            )),
          function (b) {
            return c.test(
              b.className ||
                ("undefined" !== typeof b.getAttribute &&
                  b.getAttribute("class")) ||
                ""
            );
          }
        );
      },
      ATTR: function (b, c, d) {
        return function (l) {
          l = A.attr(l, b);
          return null == l
            ? "!=" === c
            : c
            ? ((l += ""),
              "=" === c
                ? l === d
                : "!=" === c
                ? l !== d
                : "^=" === c
                ? d && 0 === l.indexOf(d)
                : "*=" === c
                ? d && -1 < l.indexOf(d)
                : "$=" === c
                ? d && l.substr(l.length - d.length) === d
                : "~=" === c
                ? -1 < (" " + l + " ").indexOf(d)
                : "|=" === c
                ? l === d || l.substr(0, d.length + 1) === d + "-"
                : !1)
            : !0;
        };
      },
      CHILD: function (b, c, d, l) {
        return "nth" === b
          ? function (b) {
              var c, e;
              c = b.parentNode;
              if (1 === d && 0 === l) return !0;
              if (c) {
                e = 0;
                for (
                  c = c.firstChild;
                  c && !(1 === c.nodeType && (e++, b === c));
                  c = c.nextSibling
                );
              }
              return (e -= l), e === d || (0 === e % d && 0 <= e / d);
            }
          : function (c) {
              var d = c;
              switch (b) {
                case "only":
                case "first":
                  for (; (d = d.previousSibling); )
                    if (1 === d.nodeType) return !1;
                  if ("first" === b) return !0;
                  d = c;
                case "last":
                  for (; (d = d.nextSibling); ) if (1 === d.nodeType) return !1;
                  return !0;
              }
            };
      },
      PSEUDO: function (b, c) {
        var d,
          l =
            J.pseudos[b] ||
            J.setFilters[b.toLowerCase()] ||
            A.error("unsupported pseudo: " + b);
        return l[I]
          ? l(c)
          : 1 < l.length
          ? ((d = [b, b, "", c]),
            J.setFilters.hasOwnProperty(b.toLowerCase())
              ? V(function (b, d) {
                  for (var e, f = l(b, c), g = f.length; g--; )
                    (e = Vb.call(b, f[g])), (b[e] = !(d[e] = f[g]));
                })
              : function (b) {
                  return l(b, 0, d);
                })
          : l;
      },
    },
    pseudos: {
      not: V(function (b) {
        var c = [],
          d = [],
          l = hb(b.replace(Ia, "$1"));
        return l[I]
          ? V(function (b, c, d, e) {
              e = l(b, null, e, []);
              for (var f = b.length; f--; ) if ((d = e[f])) b[f] = !(c[f] = d);
            })
          : function (b, e, f) {
              return (c[0] = b), l(c, null, f, d), !d.pop();
            };
      }),
      has: V(function (b) {
        return function (c) {
          return 0 < A(b, c).length;
        };
      }),
      contains: V(function (b) {
        return function (c) {
          return -1 < (c.textContent || c.innerText || Oa(c)).indexOf(b);
        };
      }),
      enabled: function (b) {
        return !1 === b.disabled;
      },
      disabled: function (b) {
        return !0 === b.disabled;
      },
      checked: function (b) {
        var c = b.nodeName.toLowerCase();
        return (
          ("input" === c && !!b.checked) || ("option" === c && !!b.selected)
        );
      },
      selected: function (b) {
        return b.parentNode && b.parentNode.selectedIndex, !0 === b.selected;
      },
      parent: function (b) {
        return !J.pseudos.empty(b);
      },
      empty: function (b) {
        var c;
        for (b = b.firstChild; b; ) {
          if ("@" < b.nodeName || 3 === (c = b.nodeType) || 4 === c) return !1;
          b = b.nextSibling;
        }
        return !0;
      },
      header: function (b) {
        return ad.test(b.nodeName);
      },
      text: function (b) {
        var c, d;
        return (
          "input" === b.nodeName.toLowerCase() &&
          "text" === (c = b.type) &&
          (null == (d = b.getAttribute("type")) || d.toLowerCase() === c)
        );
      },
      radio: sa("radio"),
      checkbox: sa("checkbox"),
      file: sa("file"),
      password: sa("password"),
      image: sa("image"),
      submit: Sb("submit"),
      reset: Sb("reset"),
      button: function (b) {
        var c = b.nodeName.toLowerCase();
        return ("input" === c && "button" === b.type) || "button" === c;
      },
      input: function (b) {
        return bd.test(b.nodeName);
      },
      focus: function (b) {
        var c = b.ownerDocument;
        return (
          b === c.activeElement &&
          (!c.hasFocus || c.hasFocus()) &&
          (!!b.type || !!b.href)
        );
      },
      active: function (b) {
        return b === b.ownerDocument.activeElement;
      },
      first: ha(function () {
        return [0];
      }),
      last: ha(function (b, c) {
        return [c - 1];
      }),
      eq: ha(function (b, c, d) {
        return [0 > d ? d + c : d];
      }),
      even: ha(function (b, c) {
        for (var d = 0; d < c; d += 2) b.push(d);
        return b;
      }),
      odd: ha(function (b, c) {
        for (var d = 1; d < c; d += 2) b.push(d);
        return b;
      }),
      lt: ha(function (b, c, d) {
        for (c = 0 > d ? d + c : d; 0 <= --c; ) b.push(c);
        return b;
      }),
      gt: ha(function (b, c, d) {
        for (d = 0 > d ? d + c : d; ++d < c; ) b.push(d);
        return b;
      }),
    },
  };
  jb = T.compareDocumentPosition
    ? function (b, c) {
        return b === c
          ? ((ua = !0), 0)
          : (
              !b.compareDocumentPosition || !c.compareDocumentPosition
                ? b.compareDocumentPosition
                : b.compareDocumentPosition(c) & 4
            )
          ? -1
          : 1;
      }
    : function (b, c) {
        if (b === c) return (ua = !0), 0;
        if (b.sourceIndex && c.sourceIndex)
          return b.sourceIndex - c.sourceIndex;
        var d,
          l,
          e = [],
          f = [];
        d = b.parentNode;
        l = c.parentNode;
        var g = d;
        if (d === l) return Ja(b, c);
        if (!d) return -1;
        if (!l) return 1;
        for (; g; ) e.unshift(g), (g = g.parentNode);
        for (g = l; g; ) f.unshift(g), (g = g.parentNode);
        d = e.length;
        l = f.length;
        for (g = 0; g < d && g < l; g++)
          if (e[g] !== f[g]) return Ja(e[g], f[g]);
        return g === d ? Ja(b, f[g], -1) : Ja(e[g], c, 1);
      };
  [0, 0].sort(jb);
  Xb = !ua;
  A.uniqueSort = function (b) {
    var c,
      d = 1;
    ua = Xb;
    b.sort(jb);
    if (ua) for (; (c = b[d]); d++) c === b[d - 1] && b.splice(d--, 1);
    return b;
  };
  A.error = function (b) {
    throw Error("Syntax error, unrecognized expression: " + b);
  };
  hb = A.compile = function (b, c) {
    var d,
      l = [],
      e = [],
      g = Zb[I][b];
    if (!g) {
      c || (c = La(b));
      for (d = c.length; d--; ) (g = fb(c[d])), g[I] ? l.push(g) : e.push(g);
      var f = 0 < l.length,
        j = 0 < e.length,
        p = function (b, c, d, g, y) {
          var t,
            n,
            u = [],
            s = 0,
            r = "0",
            m = b && [],
            q = null != y,
            v = Na,
            N = b || (j && J.find.TAG("*", (y && c.parentNode) || c)),
            z = (ta += null == v ? 1 : Math.E);
          for (
            q && ((Na = c !== U && c), (bb = p.el));
            null != (y = N[r]);
            r++
          ) {
            if (j && y) {
              for (t = 0; (n = e[t]); t++)
                if (n(y, c, d)) {
                  g.push(y);
                  break;
                }
              q && ((ta = z), (bb = ++p.el));
            }
            f && ((y = !n && y) && s--, b && m.push(y));
          }
          s += r;
          if (f && r !== s) {
            for (t = 0; (n = l[t]); t++) n(m, u, c, d);
            if (b) {
              if (0 < s) for (; r--; ) !m[r] && !u[r] && (u[r] = Zc.call(g));
              u = Ma(u);
            }
            ma.apply(g, u);
            q && !b && 0 < u.length && 1 < s + l.length && A.uniqueSort(g);
          }
          return q && ((ta = z), (Na = v)), m;
        };
      d = ((p.el = 0), f ? V(p) : p);
      g = Zb(b, d);
    }
    return g;
  };
  if (U.querySelectorAll) {
    var ac,
      gd = ab,
      hd = /'|\\/g,
      id = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
      W = [":focus"],
      Pa = [":active", ":focus"],
      Qa =
        T.matchesSelector ||
        T.mozMatchesSelector ||
        T.webkitMatchesSelector ||
        T.oMatchesSelector ||
        T.msMatchesSelector;
    aa(function (b) {
      b.innerHTML = "<select><option selected=''></option></select>";
      b.querySelectorAll("[selected]").length ||
        W.push(
          "\\[[\\x20\\t\\r\\n\\f]*(?:checked|disabled|ismap|multiple|readonly|selected|value)"
        );
      b.querySelectorAll(":checked").length || W.push(":checked");
    });
    aa(function (b) {
      b.innerHTML = "<p test=''></p>";
      b.querySelectorAll("[test^='']").length &&
        W.push("[*^$]=[\\x20\\t\\r\\n\\f]*(?:\"\"|'')");
      b.innerHTML = "<input type='hidden'/>";
      b.querySelectorAll(":enabled").length || W.push(":enabled", ":disabled");
    });
    W = RegExp(W.join("|"));
    ab = function (b, c, d, l, e) {
      if (!l && !e && (!W || !W.test(b))) {
        var g,
          f,
          j = !0,
          p = I;
        f = c;
        g = 9 === c.nodeType && b;
        if (1 === c.nodeType && "object" !== c.nodeName.toLowerCase()) {
          g = La(b);
          (j = c.getAttribute("id"))
            ? (p = j.replace(hd, "\\$&"))
            : c.setAttribute("id", p);
          p = "[id='" + p + "'] ";
          for (f = g.length; f--; ) g[f] = p + g[f].join("");
          f = (gb.test(b) && c.parentNode) || c;
          g = g.join(",");
        }
        if (g)
          try {
            return ma.apply(d, na.call(f.querySelectorAll(g), 0)), d;
          } catch (n) {
          } finally {
            j || c.removeAttribute("id");
          }
      }
      return gd(b, c, d, l, e);
    };
    Qa &&
      (aa(function (b) {
        ac = Qa.call(b, "div");
        try {
          Qa.call(b, "[test!='']:sizzle"), Pa.push("!=", lb);
        } catch (c) {}
      }),
      (Pa = RegExp(Pa.join("|"))),
      (A.matchesSelector = function (b, c) {
        c = c.replace(id, "='$1']");
        if (!Ha(b) && !Pa.test(c) && (!W || !W.test(c)))
          try {
            var d = Qa.call(b, c);
            if (d || ac || (b.document && 11 !== b.document.nodeType)) return d;
          } catch (l) {}
        return 0 < A(c, null, null, [b]).length;
      }));
  }
  J.pseudos.nth = J.pseudos.eq;
  J.filters = Wb.prototype = J.pseudos;
  J.setFilters = new Wb();
  A.attr = g.attr;
  g.find = A;
  g.expr = A.selectors;
  g.expr[":"] = g.expr.pseudos;
  g.unique = A.uniqueSort;
  g.text = A.getText;
  g.isXMLDoc = A.isXML;
  g.contains = A.contains;
  var jd = /Until$/,
    kd = /^(?:parents|prev(?:Until|All))/,
    tc = /^.[^:#\[\.,]*$/,
    bc = g.expr.match.needsContext,
    ld = { children: !0, contents: !0, next: !0, prev: !0 };
  g.fn.extend({
    find: function (b) {
      var c,
        d,
        l,
        e,
        f,
        j,
        p = this;
      if ("string" != typeof b)
        return g(b).filter(function () {
          c = 0;
          for (d = p.length; c < d; c++) if (g.contains(p[c], this)) return !0;
        });
      j = this.pushStack("", "find", b);
      c = 0;
      for (d = this.length; c < d; c++)
        if (((l = j.length), g.find(b, this[c], j), 0 < c))
          for (e = l; e < j.length; e++)
            for (f = 0; f < l; f++)
              if (j[f] === j[e]) {
                j.splice(e--, 1);
                break;
              }
      return j;
    },
    has: function (b) {
      var c,
        d = g(b, this),
        l = d.length;
      return this.filter(function () {
        for (c = 0; c < l; c++) if (g.contains(this, d[c])) return !0;
      });
    },
    not: function (b) {
      return this.pushStack(l(this, b, !1), "not", b);
    },
    filter: function (b) {
      return this.pushStack(l(this, b, !0), "filter", b);
    },
    is: function (b) {
      return (
        !!b &&
        ("string" == typeof b
          ? bc.test(b)
            ? 0 <= g(b, this.context).index(this[0])
            : 0 < g.filter(b, this).length
          : 0 < this.filter(b).length)
      );
    },
    closest: function (b, c) {
      for (
        var d,
          l = 0,
          e = this.length,
          f = [],
          j = bc.test(b) || "string" != typeof b ? g(b, c || this.context) : 0;
        l < e;
        l++
      )
        for (
          d = this[l];
          d && d.ownerDocument && d !== c && 11 !== d.nodeType;

        ) {
          if (j ? -1 < j.index(d) : g.find.matchesSelector(d, b)) {
            f.push(d);
            break;
          }
          d = d.parentNode;
        }
      return (
        (f = 1 < f.length ? g.unique(f) : f), this.pushStack(f, "closest", b)
      );
    },
    index: function (b) {
      return b
        ? "string" == typeof b
          ? g.inArray(this[0], g(b))
          : g.inArray(b.jquery ? b[0] : b, this)
        : this[0] && this[0].parentNode
        ? this.prevAll().length
        : -1;
    },
    add: function (b, c) {
      var d =
          "string" == typeof b
            ? g(b, c)
            : g.makeArray(b && b.nodeType ? [b] : b),
        l = g.merge(this.get(), d);
      return this.pushStack(m(d[0]) || m(l[0]) ? l : g.unique(l));
    },
    addBack: function (b) {
      return this.add(null == b ? this.prevObject : this.prevObject.filter(b));
    },
  });
  g.fn.andSelf = g.fn.addBack;
  g.each(
    {
      parent: function (b) {
        return (b = b.parentNode) && 11 !== b.nodeType ? b : null;
      },
      parents: function (b) {
        return g.dir(b, "parentNode");
      },
      parentsUntil: function (b, c, d) {
        return g.dir(b, "parentNode", d);
      },
      next: function (b) {
        return q(b, "nextSibling");
      },
      prev: function (b) {
        return q(b, "previousSibling");
      },
      nextAll: function (b) {
        return g.dir(b, "nextSibling");
      },
      prevAll: function (b) {
        return g.dir(b, "previousSibling");
      },
      nextUntil: function (b, c, d) {
        return g.dir(b, "nextSibling", d);
      },
      prevUntil: function (b, c, d) {
        return g.dir(b, "previousSibling", d);
      },
      siblings: function (b) {
        return g.sibling((b.parentNode || {}).firstChild, b);
      },
      children: function (b) {
        return g.sibling(b.firstChild);
      },
      contents: function (b) {
        return g.nodeName(b, "iframe")
          ? b.contentDocument || b.contentWindow.document
          : g.merge([], b.childNodes);
      },
    },
    function (b, c) {
      g.fn[b] = function (d, l) {
        var e = g.map(this, c, d);
        return (
          jd.test(b) || (l = d),
          l && "string" == typeof l && (e = g.filter(l, e)),
          (e = 1 < this.length && !ld[b] ? g.unique(e) : e),
          1 < this.length && kd.test(b) && (e = e.reverse()),
          this.pushStack(e, b, X.call(arguments).join(","))
        );
      };
    }
  );
  g.extend({
    filter: function (b, c, d) {
      return (
        d && (b = ":not(" + b + ")"),
        1 === c.length
          ? g.find.matchesSelector(c[0], b)
            ? [c[0]]
            : []
          : g.find.matches(b, c)
      );
    },
    dir: function (b, d, l) {
      var e = [];
      for (
        b = b[d];
        b && 9 !== b.nodeType && (l === c || 1 !== b.nodeType || !g(b).is(l));

      )
        1 === b.nodeType && e.push(b), (b = b[d]);
      return e;
    },
    sibling: function (b, c) {
      for (var d = []; b; b = b.nextSibling)
        1 === b.nodeType && b !== c && d.push(b);
      return d;
    },
  });
  var sb =
      "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    md = / jQuery\d+="(?:null|\d+)"/g,
    mb = /^\s+/,
    cc = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    dc = /<([\w:]+)/,
    nd = /<tbody/i,
    od = /<|&#?\w+;/,
    pd = /<(?:script|style|link)/i,
    qd = /<(?:script|object|embed|option|style)/i,
    nb = RegExp("<(?:" + sb + ")[\\s/>]", "i"),
    tb = /^(?:checkbox|radio)$/,
    ec = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rd = /\/(java|ecma)script/i,
    sd = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
    S = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      area: [1, "<map>", "</map>"],
      _default: [0, "", ""],
    },
    fc = p(x),
    ob = fc.appendChild(x.createElement("div"));
  S.optgroup = S.option;
  S.tbody = S.tfoot = S.colgroup = S.caption = S.thead;
  S.th = S.td;
  g.support.htmlSerialize || (S._default = [1, "X<div>", "</div>"]);
  g.fn.extend({
    text: function (b) {
      return g.access(
        this,
        function (b) {
          return b === c
            ? g.text(this)
            : this.empty().append(
                ((this[0] && this[0].ownerDocument) || x).createTextNode(b)
              );
        },
        null,
        b,
        arguments.length
      );
    },
    wrapAll: function (b) {
      if (g.isFunction(b))
        return this.each(function (c) {
          g(this).wrapAll(b.call(this, c));
        });
      if (this[0]) {
        var c = g(b, this[0].ownerDocument).eq(0).clone(!0);
        this[0].parentNode && c.insertBefore(this[0]);
        c.map(function () {
          for (var b = this; b.firstChild && 1 === b.firstChild.nodeType; )
            b = b.firstChild;
          return b;
        }).append(this);
      }
      return this;
    },
    wrapInner: function (b) {
      return g.isFunction(b)
        ? this.each(function (c) {
            g(this).wrapInner(b.call(this, c));
          })
        : this.each(function () {
            var c = g(this),
              d = c.contents();
            d.length ? d.wrapAll(b) : c.append(b);
          });
    },
    wrap: function (b) {
      var c = g.isFunction(b);
      return this.each(function (d) {
        g(this).wrapAll(c ? b.call(this, d) : b);
      });
    },
    unwrap: function () {
      return this.parent()
        .each(function () {
          g.nodeName(this, "body") || g(this).replaceWith(this.childNodes);
        })
        .end();
    },
    append: function () {
      return this.domManip(arguments, !0, function (b) {
        (1 === this.nodeType || 11 === this.nodeType) && this.appendChild(b);
      });
    },
    prepend: function () {
      return this.domManip(arguments, !0, function (b) {
        (1 === this.nodeType || 11 === this.nodeType) &&
          this.insertBefore(b, this.firstChild);
      });
    },
    before: function () {
      if (!m(this[0]))
        return this.domManip(arguments, !1, function (b) {
          this.parentNode.insertBefore(b, this);
        });
      if (arguments.length) {
        var b = g.clean(arguments);
        return this.pushStack(g.merge(b, this), "before", this.selector);
      }
    },
    after: function () {
      if (!m(this[0]))
        return this.domManip(arguments, !1, function (b) {
          this.parentNode.insertBefore(b, this.nextSibling);
        });
      if (arguments.length) {
        var b = g.clean(arguments);
        return this.pushStack(g.merge(this, b), "after", this.selector);
      }
    },
    remove: function (b, c) {
      for (var d, l = 0; null != (d = this[l]); l++)
        if (!b || g.filter(b, [d]).length)
          !c &&
            1 === d.nodeType &&
            (g.cleanData(d.getElementsByTagName("*")), g.cleanData([d])),
            d.parentNode && d.parentNode.removeChild(d);
      return this;
    },
    empty: function () {
      for (var b, c = 0; null != (b = this[c]); c++)
        for (
          1 === b.nodeType && g.cleanData(b.getElementsByTagName("*"));
          b.firstChild;

        )
          b.removeChild(b.firstChild);
      return this;
    },
    clone: function (b, c) {
      return (
        (b = null == b ? !1 : b),
        (c = null == c ? b : c),
        this.map(function () {
          return g.clone(this, b, c);
        })
      );
    },
    html: function (b) {
      return g.access(
        this,
        function (b) {
          var d = this[0] || {},
            l = 0,
            e = this.length;
          if (b === c)
            return 1 === d.nodeType ? d.innerHTML.replace(md, "") : c;
          if (
            "string" == typeof b &&
            !pd.test(b) &&
            (g.support.htmlSerialize || !nb.test(b)) &&
            (g.support.leadingWhitespace || !mb.test(b)) &&
            !S[(dc.exec(b) || ["", ""])[1].toLowerCase()]
          ) {
            b = b.replace(cc, "<$1></$2>");
            try {
              for (; l < e; l++)
                (d = this[l] || {}),
                  1 === d.nodeType &&
                    (g.cleanData(d.getElementsByTagName("*")),
                    (d.innerHTML = b));
              d = 0;
            } catch (f) {}
          }
          d && this.empty().append(b);
        },
        null,
        b,
        arguments.length
      );
    },
    replaceWith: function (b) {
      return m(this[0])
        ? this.length
          ? this.pushStack(g(g.isFunction(b) ? b() : b), "replaceWith", b)
          : this
        : g.isFunction(b)
        ? this.each(function (c) {
            var d = g(this),
              l = d.html();
            d.replaceWith(b.call(this, c, l));
          })
        : ("string" != typeof b && (b = g(b).detach()),
          this.each(function () {
            var c = this.nextSibling,
              d = this.parentNode;
            g(this).remove();
            c ? g(c).before(b) : g(d).append(b);
          }));
    },
    detach: function (b) {
      return this.remove(b, !0);
    },
    domManip: function (b, d, l) {
      b = [].concat.apply([], b);
      var e,
        f,
        j,
        p = 0,
        n = b[0],
        s = [],
        r = this.length;
      if (!g.support.checkClone && 1 < r && "string" == typeof n && ec.test(n))
        return this.each(function () {
          g(this).domManip(b, d, l);
        });
      if (g.isFunction(n))
        return this.each(function (e) {
          var f = g(this);
          b[0] = n.call(this, e, d ? f.html() : c);
          f.domManip(b, d, l);
        });
      if (this[0]) {
        e = g.buildFragment(b, this, s);
        j = e.fragment;
        f = j.firstChild;
        1 === j.childNodes.length && (j = f);
        if (f) {
          d = d && g.nodeName(f, "tr");
          for (e = e.cacheable || r - 1; p < r; p++)
            l.call(
              d && g.nodeName(this[p], "table")
                ? this[p].getElementsByTagName("tbody")[0] ||
                    this[p].appendChild(
                      this[p].ownerDocument.createElement("tbody")
                    )
                : this[p],
              p === e ? j : g.clone(j, !0, !0)
            );
        }
        j = f = null;
        s.length &&
          g.each(s, function (b, c) {
            c.src
              ? g.ajax
                ? g.ajax({
                    url: c.src,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    throws: !0,
                  })
                : g.error("no ajax")
              : g.globalEval(
                  (c.text || c.textContent || c.innerHTML || "").replace(sd, "")
                );
            c.parentNode && c.parentNode.removeChild(c);
          });
      }
      return this;
    },
  });
  g.buildFragment = function (b, d, l) {
    var e,
      f,
      j,
      p = b[0];
    return (
      (d = d || x),
      (d = (!d.nodeType && d[0]) || d),
      (d = d.ownerDocument || d),
      1 === b.length &&
        "string" == typeof p &&
        512 > p.length &&
        d === x &&
        "<" === p.charAt(0) &&
        !qd.test(p) &&
        (g.support.checkClone || !ec.test(p)) &&
        (g.support.html5Clone || !nb.test(p)) &&
        ((f = !0), (e = g.fragments[p]), (j = e !== c)),
      e ||
        ((e = d.createDocumentFragment()),
        g.clean(b, d, e, l),
        f && (g.fragments[p] = j && e)),
      { fragment: e, cacheable: f }
    );
  };
  g.fragments = {};
  g.each(
    {
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith",
    },
    function (b, c) {
      g.fn[b] = function (d) {
        var l,
          e = 0,
          f = [];
        d = g(d);
        var j = d.length;
        l = 1 === this.length && this[0].parentNode;
        if (
          (null == l ||
            (l && 11 === l.nodeType && 1 === l.childNodes.length)) &&
          1 === j
        )
          return d[c](this[0]), this;
        for (; e < j; e++)
          (l = (0 < e ? this.clone(!0) : this).get()),
            g(d[e])[c](l),
            (f = f.concat(l));
        return this.pushStack(f, b, d.selector);
      };
    }
  );
  g.extend({
    clone: function (b, c, d) {
      var l, e, f, j;
      g.support.html5Clone || g.isXMLDoc(b) || !nb.test("<" + b.nodeName + ">")
        ? (j = b.cloneNode(!0))
        : ((ob.innerHTML = b.outerHTML), ob.removeChild((j = ob.firstChild)));
      if (
        (!g.support.noCloneEvent || !g.support.noCloneChecked) &&
        (1 === b.nodeType || 11 === b.nodeType) &&
        !g.isXMLDoc(b)
      ) {
        s(b, j);
        l = r(b);
        e = r(j);
        for (f = 0; l[f]; ++f) e[f] && s(l[f], e[f]);
      }
      if (c && (n(b, j), d)) {
        l = r(b);
        e = r(j);
        for (f = 0; l[f]; ++f) n(l[f], e[f]);
      }
      return j;
    },
    clean: function (b, c, d, l) {
      var e,
        f,
        j,
        n,
        s,
        r,
        m,
        q = c === x && fc,
        z = [];
      if (!c || "undefined" == typeof c.createDocumentFragment) c = x;
      for (e = 0; null != (j = b[e]); e++)
        if (("number" == typeof j && (j += ""), j)) {
          if ("string" == typeof j)
            if (od.test(j)) {
              q = q || p(c);
              r = c.createElement("div");
              q.appendChild(r);
              j = j.replace(cc, "<$1></$2>");
              f = (dc.exec(j) || ["", ""])[1].toLowerCase();
              n = S[f] || S._default;
              s = n[0];
              for (r.innerHTML = n[1] + j + n[2]; s--; ) r = r.lastChild;
              if (!g.support.tbody) {
                s = nd.test(j);
                n =
                  "table" === f && !s
                    ? r.firstChild && r.firstChild.childNodes
                    : "<table>" === n[1] && !s
                    ? r.childNodes
                    : [];
                for (f = n.length - 1; 0 <= f; --f)
                  g.nodeName(n[f], "tbody") &&
                    !n[f].childNodes.length &&
                    n[f].parentNode.removeChild(n[f]);
              }
              !g.support.leadingWhitespace &&
                mb.test(j) &&
                r.insertBefore(c.createTextNode(mb.exec(j)[0]), r.firstChild);
              j = r.childNodes;
              r.parentNode.removeChild(r);
            } else j = c.createTextNode(j);
          j.nodeType ? z.push(j) : g.merge(z, j);
        }
      r && (j = r = q = null);
      if (!g.support.appendChecked)
        for (e = 0; null != (j = z[e]); e++)
          g.nodeName(j, "input")
            ? v(j)
            : "undefined" != typeof j.getElementsByTagName &&
              g.grep(j.getElementsByTagName("input"), v);
      if (d) {
        b = function (b) {
          if (!b.type || rd.test(b.type))
            return l
              ? l.push(b.parentNode ? b.parentNode.removeChild(b) : b)
              : d.appendChild(b);
        };
        for (e = 0; null != (j = z[e]); e++)
          if (!g.nodeName(j, "script") || !b(j))
            d.appendChild(j),
              "undefined" != typeof j.getElementsByTagName &&
                ((m = g.grep(g.merge([], j.getElementsByTagName("script")), b)),
                z.splice.apply(z, [e + 1, 0].concat(m)),
                (e += m.length));
      }
      return z;
    },
    cleanData: function (b, c) {
      for (
        var d,
          l,
          e,
          f,
          j = 0,
          p = g.expando,
          n = g.cache,
          s = g.support.deleteExpando,
          r = g.event.special;
        null != (e = b[j]);
        j++
      )
        if (c || g.acceptData(e))
          if ((d = (l = e[p]) && n[l])) {
            if (d.events)
              for (f in d.events)
                r[f] ? g.event.remove(e, f) : g.removeEvent(e, f, d.handle);
            n[l] &&
              (delete n[l],
              s
                ? delete e[p]
                : e.removeAttribute
                ? e.removeAttribute(p)
                : (e[p] = null),
              g.deletedIds.push(l));
          }
    },
  });
  var Ra, ba;
  g.uaMatch = function (b) {
    b = b.toLowerCase();
    b =
      /(chrome)[ \/]([\w.]+)/.exec(b) ||
      /(webkit)[ \/]([\w.]+)/.exec(b) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b) ||
      /(msie) ([\w.]+)/.exec(b) ||
      (0 > b.indexOf("compatible") &&
        /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b)) ||
      [];
    return { browser: b[1] || "", version: b[2] || "0" };
  };
  Ra = g.uaMatch(yc.userAgent);
  ba = {};
  Ra.browser && ((ba[Ra.browser] = !0), (ba.version = Ra.version));
  ba.chrome ? (ba.webkit = !0) : ba.webkit && (ba.safari = !0);
  g.browser = ba;
  g.sub = function () {
    function b(c, d) {
      return new b.fn.init(c, d);
    }
    g.extend(!0, b, this);
    b.superclass = this;
    b.fn = b.prototype = this();
    b.fn.constructor = b;
    b.sub = this.sub;
    b.fn.init = function (d, l) {
      return (
        l && l instanceof g && !(l instanceof b) && (l = b(l)),
        g.fn.init.call(this, d, l, c)
      );
    };
    b.fn.init.prototype = b.fn;
    var c = b(x);
    return b;
  };
  var M,
    ka,
    la,
    pb = /alpha\([^)]*\)/i,
    td = /opacity=([^)]*)/,
    ud = /^(top|right|bottom|left)$/,
    vd = /^(none|table(?!-c[ea]).+)/,
    gc = /^margin/,
    uc = RegExp("^(" + Ba + ")(.*)$", "i"),
    va = RegExp("^(" + Ba + ")(?!px)[a-z%]+$", "i"),
    wd = RegExp("^([-+])=(" + Ba + ")", "i"),
    Ua = {},
    xd = { position: "absolute", visibility: "hidden", display: "block" },
    hc = { letterSpacing: 0, fontWeight: 400 },
    da = ["Top", "Right", "Bottom", "Left"],
    ub = ["Webkit", "O", "Moz", "ms"],
    yd = g.fn.toggle;
  g.fn.extend({
    css: function (b, d) {
      return g.access(
        this,
        function (b, d, l) {
          return l !== c ? g.style(b, d, l) : g.css(b, d);
        },
        b,
        d,
        1 < arguments.length
      );
    },
    show: function () {
      return F(this, !0);
    },
    hide: function () {
      return F(this);
    },
    toggle: function (b, c) {
      var d = "boolean" == typeof b;
      return g.isFunction(b) && g.isFunction(c)
        ? yd.apply(this, arguments)
        : this.each(function () {
            (d ? b : B(this)) ? g(this).show() : g(this).hide();
          });
    },
  });
  g.extend({
    cssHooks: {
      opacity: {
        get: function (b, c) {
          if (c) {
            var d = M(b, "opacity");
            return "" === d ? "1" : d;
          }
        },
      },
    },
    cssNumber: {
      fillOpacity: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
    },
    cssProps: { float: g.support.cssFloat ? "cssFloat" : "styleFloat" },
    style: function (b, d, l, e) {
      if (b && !(3 === b.nodeType || 8 === b.nodeType || !b.style)) {
        var f,
          j,
          p,
          n = g.camelCase(d),
          s = b.style;
        d = g.cssProps[n] || (g.cssProps[n] = z(s, n));
        p = g.cssHooks[d] || g.cssHooks[n];
        if (l === c)
          return p && "get" in p && (f = p.get(b, !1, e)) !== c ? f : s[d];
        j = typeof l;
        "string" === j &&
          (f = wd.exec(l)) &&
          ((l = (f[1] + 1) * f[2] + parseFloat(g.css(b, d))), (j = "number"));
        if (!(null == l || ("number" === j && isNaN(l))))
          if (
            ("number" === j && !g.cssNumber[n] && (l += "px"),
            !p || !("set" in p) || (l = p.set(b, l, e)) !== c)
          )
            try {
              s[d] = l;
            } catch (r) {}
      }
    },
    css: function (b, d, l, e) {
      var f,
        j,
        p,
        n = g.camelCase(d);
      return (
        (d = g.cssProps[n] || (g.cssProps[n] = z(b.style, n))),
        (p = g.cssHooks[d] || g.cssHooks[n]),
        p && "get" in p && (f = p.get(b, !0, e)),
        f === c && (f = M(b, d)),
        "normal" === f && d in hc && (f = hc[d]),
        l || e !== c
          ? ((j = parseFloat(f)), l || g.isNumeric(j) ? j || 0 : f)
          : f
      );
    },
    swap: function (b, c, d) {
      var l,
        e = {};
      for (l in c) (e[l] = b.style[l]), (b.style[l] = c[l]);
      d = d.call(b);
      for (l in c) b.style[l] = e[l];
      return d;
    },
  });
  b.getComputedStyle
    ? (M = function (c, d) {
        var l,
          e,
          f,
          j,
          p = b.getComputedStyle(c, null),
          n = c.style;
        return (
          p &&
            ((l = p[d]),
            "" === l && !g.contains(c.ownerDocument, c) && (l = g.style(c, d)),
            va.test(l) &&
              gc.test(d) &&
              ((e = n.width),
              (f = n.minWidth),
              (j = n.maxWidth),
              (n.minWidth = n.maxWidth = n.width = l),
              (l = p.width),
              (n.width = e),
              (n.minWidth = f),
              (n.maxWidth = j))),
          l
        );
      })
    : x.documentElement.currentStyle &&
      (M = function (b, c) {
        var d,
          l,
          e = b.currentStyle && b.currentStyle[c],
          f = b.style;
        return (
          null == e && f && f[c] && (e = f[c]),
          va.test(e) &&
            !ud.test(c) &&
            ((d = f.left),
            (l = b.runtimeStyle && b.runtimeStyle.left),
            l && (b.runtimeStyle.left = b.currentStyle.left),
            (f.left = "fontSize" === c ? "1em" : e),
            (e = f.pixelLeft + "px"),
            (f.left = d),
            l && (b.runtimeStyle.left = l)),
          "" === e ? "auto" : e
        );
      });
  g.each(["height", "width"], function (b, c) {
    g.cssHooks[c] = {
      get: function (b, d, l) {
        if (d)
          return 0 === b.offsetWidth && vd.test(M(b, "display"))
            ? g.swap(b, xd, function () {
                return Y(b, c, l);
              })
            : Y(b, c, l);
      },
      set: function (b, d, l) {
        return E(
          b,
          d,
          l
            ? C(
                b,
                c,
                l,
                g.support.boxSizing && "border-box" === g.css(b, "boxSizing")
              )
            : 0
        );
      },
    };
  });
  g.support.opacity ||
    (g.cssHooks.opacity = {
      get: function (b, c) {
        return td.test(
          (c && b.currentStyle ? b.currentStyle.filter : b.style.filter) || ""
        )
          ? 0.01 * parseFloat(RegExp.$1) + ""
          : c
          ? "1"
          : "";
      },
      set: function (b, c) {
        var d = b.style,
          l = b.currentStyle,
          e = g.isNumeric(c) ? "alpha(opacity=" + 100 * c + ")" : "",
          f = (l && l.filter) || d.filter || "";
        d.zoom = 1;
        if (
          !(
            1 <= c &&
            "" === g.trim(f.replace(pb, "")) &&
            d.removeAttribute &&
            (d.removeAttribute("filter"), l && !l.filter)
          )
        )
          d.filter = pb.test(f) ? f.replace(pb, e) : f + " " + e;
      },
    });
  g(function () {
    g.support.reliableMarginRight ||
      (g.cssHooks.marginRight = {
        get: function (b, c) {
          return g.swap(b, { display: "inline-block" }, function () {
            if (c) return M(b, "marginRight");
          });
        },
      });
    !g.support.pixelPosition &&
      g.fn.position &&
      g.each(["top", "left"], function (b, c) {
        g.cssHooks[c] = {
          get: function (b, d) {
            if (d) {
              var l = M(b, c);
              return va.test(l) ? g(b).position()[c] + "px" : l;
            }
          },
        };
      });
  });
  g.expr &&
    g.expr.filters &&
    ((g.expr.filters.hidden = function (b) {
      return (
        (0 === b.offsetWidth && 0 === b.offsetHeight) ||
        (!g.support.reliableHiddenOffsets &&
          "none" === ((b.style && b.style.display) || M(b, "display")))
      );
    }),
    (g.expr.filters.visible = function (b) {
      return !g.expr.filters.hidden(b);
    }));
  g.each({ margin: "", padding: "", border: "Width" }, function (b, c) {
    g.cssHooks[b + c] = {
      expand: function (d) {
        var l = "string" == typeof d ? d.split(" ") : [d],
          e = {};
        for (d = 0; 4 > d; d++) e[b + da[d] + c] = l[d] || l[d - 2] || l[0];
        return e;
      },
    };
    gc.test(b) || (g.cssHooks[b + c].set = E);
  });
  var zd = /%20/g,
    vc = /\[\]$/,
    ic = /\r?\n/g,
    Ad = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    Bd = /^(?:select|textarea)/i;
  g.fn.extend({
    serialize: function () {
      return g.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        return this.elements ? g.makeArray(this.elements) : this;
      })
        .filter(function () {
          return (
            this.name &&
            !this.disabled &&
            (this.checked || Bd.test(this.nodeName) || Ad.test(this.type))
          );
        })
        .map(function (b, c) {
          var d = g(this).val();
          return null == d
            ? null
            : g.isArray(d)
            ? g.map(d, function (b) {
                return { name: c.name, value: b.replace(ic, "\r\n") };
              })
            : { name: c.name, value: d.replace(ic, "\r\n") };
        })
        .get();
    },
  });
  g.param = function (b, d) {
    var l,
      e = [],
      f = function (b, c) {
        c = g.isFunction(c) ? c() : null == c ? "" : c;
        e[e.length] = encodeURIComponent(b) + "=" + encodeURIComponent(c);
      };
    d === c && (d = g.ajaxSettings && g.ajaxSettings.traditional);
    if (g.isArray(b) || (b.jquery && !g.isPlainObject(b)))
      g.each(b, function () {
        f(this.name, this.value);
      });
    else for (l in b) G(l, b[l], d, f);
    return e.join("&").replace(zd, "+");
  };
  var oa,
    ja,
    Cd = /#.*$/,
    Dd = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    Ed = /^(?:GET|HEAD)$/,
    Fd = /^\/\//,
    jc = /\?/,
    Gd = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    Hd = /([?&])_=[^&]*/,
    kc = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
    lc = g.fn.load,
    Va = {},
    mc = {},
    nc = ["*/"] + ["*"];
  try {
    ja = xc.href;
  } catch (Qd) {
    (ja = x.createElement("a")), (ja.href = ""), (ja = ja.href);
  }
  oa = kc.exec(ja.toLowerCase()) || [];
  g.fn.load = function (b, d, l) {
    if ("string" != typeof b && lc) return lc.apply(this, arguments);
    if (!this.length) return this;
    var e,
      f,
      j,
      p = this,
      n = b.indexOf(" ");
    return (
      0 <= n && ((e = b.slice(n, b.length)), (b = b.slice(0, n))),
      g.isFunction(d)
        ? ((l = d), (d = c))
        : d && "object" == typeof d && (f = "POST"),
      g
        .ajax({
          url: b,
          type: f,
          dataType: "html",
          data: d,
          complete: function (b, c) {
            l && p.each(l, j || [b.responseText, c, b]);
          },
        })
        .done(function (b) {
          j = arguments;
          p.html(e ? g("<div>").append(b.replace(Gd, "")).find(e) : b);
        }),
      this
    );
  };
  g.each(
    "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),
    function (b, c) {
      g.fn[c] = function (b) {
        return this.on(c, b);
      };
    }
  );
  g.each(["get", "post"], function (b, d) {
    g[d] = function (b, l, e, f) {
      return (
        g.isFunction(l) && ((f = f || e), (e = l), (l = c)),
        g.ajax({ type: d, url: b, data: l, success: e, dataType: f })
      );
    };
  });
  g.extend({
    getScript: function (b, d) {
      return g.get(b, c, d, "script");
    },
    getJSON: function (b, c, d) {
      return g.get(b, c, d, "json");
    },
    ajaxSetup: function (b, c) {
      return (
        c ? wb(b, g.ajaxSettings) : ((c = b), (b = g.ajaxSettings)), wb(b, c), b
      );
    },
    ajaxSettings: {
      url: ja,
      isLocal: /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(
        oa[1]
      ),
      global: !0,
      type: "GET",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      processData: !0,
      async: !0,
      accepts: {
        xml: "application/xml, text/xml",
        html: "text/html",
        text: "text/plain",
        json: "application/json, text/javascript",
        "*": nc,
      },
      contents: { xml: /xml/, html: /html/, json: /json/ },
      responseFields: { xml: "responseXML", text: "responseText" },
      converters: {
        "* text": b.String,
        "text html": !0,
        "text json": g.parseJSON,
        "text xml": g.parseXML,
      },
      flatOptions: { context: !0, url: !0 },
    },
    ajaxPrefilter: vb(Va),
    ajaxTransport: vb(mc),
    ajax: function (b, d) {
      function l(b, d, j, s) {
        var t,
          y,
          m,
          u,
          N,
          P = d;
        if (2 !== C) {
          C = 2;
          n && clearTimeout(n);
          p = c;
          f = s || "";
          D.readyState = 0 < b ? 4 : 0;
          if (j) {
            u = q;
            s = D;
            var R,
              A,
              F,
              H,
              J = u.contents,
              I = u.dataTypes,
              L = u.responseFields;
            for (A in L) A in j && (s[L[A]] = j[A]);
            for (; "*" === I[0]; )
              I.shift(),
                R === c &&
                  (R = u.mimeType || s.getResponseHeader("content-type"));
            if (R)
              for (A in J)
                if (J[A] && J[A].test(R)) {
                  I.unshift(A);
                  break;
                }
            if (I[0] in j) F = I[0];
            else {
              for (A in j) {
                if (!I[0] || u.converters[A + " " + I[0]]) {
                  F = A;
                  break;
                }
                H || (H = A);
              }
              F = F || H;
            }
            u = j = F ? (F !== I[0] && I.unshift(F), j[F]) : void 0;
          }
          if ((200 <= b && 300 > b) || 304 === b)
            if (
              (q.ifModified &&
                ((N = D.getResponseHeader("Last-Modified")),
                N && (g.lastModified[e] = N),
                (N = D.getResponseHeader("Etag")),
                N && (g.etag[e] = N)),
              304 === b)
            )
              (P = "notmodified"), (t = !0);
            else {
              var G;
              a: {
                t = q;
                y = u;
                var M,
                  P = t.dataTypes.slice();
                j = P[0];
                R = {};
                A = 0;
                t.dataFilter && (y = t.dataFilter(y, t.dataType));
                if (P[1])
                  for (G in t.converters) R[G.toLowerCase()] = t.converters[G];
                for (; (m = P[++A]); )
                  if ("*" !== m) {
                    if ("*" !== j && j !== m) {
                      G = R[j + " " + m] || R["* " + m];
                      if (!G)
                        for (M in R)
                          if (
                            ((N = M.split(" ")),
                            N[1] === m &&
                              (G = R[j + " " + N[0]] || R["* " + N[0]]))
                          ) {
                            !0 === G
                              ? (G = R[M])
                              : !0 !== R[M] &&
                                ((m = N[0]), P.splice(A--, 0, m));
                            break;
                          }
                      if (!0 !== G)
                        if (G && t["throws"]) y = G(y);
                        else
                          try {
                            y = G(y);
                          } catch (O) {
                            G = {
                              state: "parsererror",
                              error: G
                                ? O
                                : "No conversion from " + j + " to " + m,
                            };
                            break a;
                          }
                    }
                    j = m;
                  }
                G = { state: "success", data: y };
              }
              t = G;
              P = t.state;
              y = t.data;
              m = t.error;
              t = !m;
            }
          else if (((m = P), !P || b)) (P = "error"), 0 > b && (b = 0);
          D.status = b;
          D.statusText = (d || P) + "";
          t ? x.resolveWith(v, [y, P, D]) : x.rejectWith(v, [D, P, m]);
          D.statusCode(E);
          E = c;
          r && z.trigger("ajax" + (t ? "Success" : "Error"), [D, q, t ? y : m]);
          B.fireWith(v, [D, P]);
          r &&
            (z.trigger("ajaxComplete", [D, q]),
            --g.active || g.event.trigger("ajaxStop"));
        }
      }
      "object" == typeof b && ((d = b), (b = c));
      d = d || {};
      var e,
        f,
        j,
        p,
        n,
        s,
        r,
        m,
        q = g.ajaxSetup({}, d),
        v = q.context || q,
        z = v !== q && (v.nodeType || v instanceof g) ? g(v) : g.event,
        x = g.Deferred(),
        B = g.Callbacks("once memory"),
        E = q.statusCode || {},
        A = {},
        F = {},
        C = 0,
        H = "canceled",
        D = {
          readyState: 0,
          setRequestHeader: function (b, c) {
            if (!C) {
              var d = b.toLowerCase();
              b = F[d] = F[d] || b;
              A[b] = c;
            }
            return this;
          },
          getAllResponseHeaders: function () {
            return 2 === C ? f : null;
          },
          getResponseHeader: function (b) {
            var d;
            if (2 === C) {
              if (!j)
                for (j = {}; (d = Dd.exec(f)); ) j[d[1].toLowerCase()] = d[2];
              d = j[b.toLowerCase()];
            }
            return d === c ? null : d;
          },
          overrideMimeType: function (b) {
            return C || (q.mimeType = b), this;
          },
          abort: function (b) {
            return (b = b || H), p && p.abort(b), l(0, b), this;
          },
        };
      x.promise(D);
      D.success = D.done;
      D.error = D.fail;
      D.complete = B.add;
      D.statusCode = function (b) {
        if (b) {
          var c;
          if (2 > C) for (c in b) E[c] = [E[c], b[c]];
          else (c = b[D.status]), D.always(c);
        }
        return this;
      };
      q.url = ((b || q.url) + "").replace(Cd, "").replace(Fd, oa[1] + "//");
      q.dataTypes = g
        .trim(q.dataType || "*")
        .toLowerCase()
        .split(ea);
      null == q.crossDomain &&
        ((s = kc.exec(q.url.toLowerCase()) || !1),
        (q.crossDomain =
          s &&
          s.join(":") + (s[3] ? "" : "http:" === s[1] ? 80 : 443) !==
            oa.join(":") + (oa[3] ? "" : "http:" === oa[1] ? 80 : 443)));
      q.data &&
        q.processData &&
        "string" != typeof q.data &&
        (q.data = g.param(q.data, q.traditional));
      wa(Va, q, d, D);
      if (2 === C) return D;
      r = q.global;
      q.type = q.type.toUpperCase();
      q.hasContent = !Ed.test(q.type);
      r && 0 === g.active++ && g.event.trigger("ajaxStart");
      if (
        !q.hasContent &&
        (q.data &&
          ((q.url += (jc.test(q.url) ? "&" : "?") + q.data), delete q.data),
        (e = q.url),
        !1 === q.cache)
      ) {
        s = g.now();
        var J = q.url.replace(Hd, "$1_=" + s);
        q.url =
          J + (J === q.url ? (jc.test(q.url) ? "&" : "?") + "_=" + s : "");
      }
      ((q.data && q.hasContent && !1 !== q.contentType) || d.contentType) &&
        D.setRequestHeader("Content-Type", q.contentType);
      q.ifModified &&
        ((e = e || q.url),
        g.lastModified[e] &&
          D.setRequestHeader("If-Modified-Since", g.lastModified[e]),
        g.etag[e] && D.setRequestHeader("If-None-Match", g.etag[e]));
      D.setRequestHeader(
        "Accept",
        q.dataTypes[0] && q.accepts[q.dataTypes[0]]
          ? q.accepts[q.dataTypes[0]] +
              ("*" !== q.dataTypes[0] ? ", " + nc + "; q=0.01" : "")
          : q.accepts["*"]
      );
      for (m in q.headers) D.setRequestHeader(m, q.headers[m]);
      if (!q.beforeSend || (!1 !== q.beforeSend.call(v, D, q) && 2 !== C)) {
        H = "abort";
        for (m in { success: 1, error: 1, complete: 1 }) D[m](q[m]);
        if ((p = wa(mc, q, d, D))) {
          D.readyState = 1;
          r && z.trigger("ajaxSend", [D, q]);
          q.async &&
            0 < q.timeout &&
            (n = setTimeout(function () {
              D.abort("timeout");
            }, q.timeout));
          try {
            (C = 1), p.send(A, l);
          } catch (I) {
            if (2 > C) l(-1, I);
            else throw I;
          }
        } else l(-1, "No Transport");
        return D;
      }
      return D.abort();
    },
    active: 0,
    lastModified: {},
    etag: {},
  });
  var oc = [],
    Id = /\?/,
    Sa = /(=)\?(?=&|$)|\?\?/,
    Jd = g.now();
  g.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var b = oc.pop() || g.expando + "_" + Jd++;
      return (this[b] = !0), b;
    },
  });
  g.ajaxPrefilter("json jsonp", function (d, l, e) {
    var f,
      j,
      p,
      n = d.data,
      s = d.url,
      r = !1 !== d.jsonp,
      q = r && Sa.test(s),
      m =
        r &&
        !q &&
        "string" == typeof n &&
        !(d.contentType || "").indexOf("application/x-www-form-urlencoded") &&
        Sa.test(n);
    if ("jsonp" === d.dataTypes[0] || q || m)
      return (
        (f = d.jsonpCallback = g.isFunction(d.jsonpCallback)
          ? d.jsonpCallback()
          : d.jsonpCallback),
        (j = b[f]),
        q
          ? (d.url = s.replace(Sa, "$1" + f))
          : m
          ? (d.data = n.replace(Sa, "$1" + f))
          : r && (d.url += (Id.test(s) ? "&" : "?") + d.jsonp + "=" + f),
        (d.converters["script json"] = function () {
          return p || g.error(f + " was not called"), p[0];
        }),
        (d.dataTypes[0] = "json"),
        (b[f] = function () {
          p = arguments;
        }),
        e.always(function () {
          b[f] = j;
          d[f] && ((d.jsonpCallback = l.jsonpCallback), oc.push(f));
          p && g.isFunction(j) && j(p[0]);
          p = j = c;
        }),
        "script"
      );
  });
  g.ajaxSetup({
    accepts: {
      script:
        "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
    },
    contents: { script: /javascript|ecmascript/ },
    converters: {
      "text script": function (b) {
        return g.globalEval(b), b;
      },
    },
  });
  g.ajaxPrefilter("script", function (b) {
    b.cache === c && (b.cache = !1);
    b.crossDomain && ((b.type = "GET"), (b.global = !1));
  });
  g.ajaxTransport("script", function (b) {
    if (b.crossDomain) {
      var d,
        l = x.head || x.getElementsByTagName("head")[0] || x.documentElement;
      return {
        send: function (e, f) {
          d = x.createElement("script");
          d.async = "async";
          b.scriptCharset && (d.charset = b.scriptCharset);
          d.src = b.url;
          d.onload = d.onreadystatechange = function (b, e) {
            if (e || !d.readyState || /loaded|complete/.test(d.readyState))
              (d.onload = d.onreadystatechange = null),
                l && d.parentNode && l.removeChild(d),
                (d = c),
                e || f(200, "success");
          };
          l.insertBefore(d, l.firstChild);
        },
        abort: function () {
          d && d.onload(0, 1);
        },
      };
    }
  });
  var pa,
    qb = b.ActiveXObject
      ? function () {
          for (var b in pa) pa[b](0, 1);
        }
      : !1,
    Kd = 0;
  g.ajaxSettings.xhr = b.ActiveXObject
    ? function () {
        var c;
        if (!(c = !this.isLocal && xb()))
          a: {
            try {
              c = new b.ActiveXObject("Microsoft.XMLHTTP");
              break a;
            } catch (d) {}
            c = void 0;
          }
        return c;
      }
    : xb;
  var rb = g.ajaxSettings.xhr();
  g.extend(g.support, { ajax: !!rb, cors: !!rb && "withCredentials" in rb });
  g.support.ajax &&
    g.ajaxTransport(function (d) {
      if (!d.crossDomain || g.support.cors) {
        var l;
        return {
          send: function (e, f) {
            var j,
              p,
              n = d.xhr();
            d.username
              ? n.open(d.type, d.url, d.async, d.username, d.password)
              : n.open(d.type, d.url, d.async);
            if (d.xhrFields) for (p in d.xhrFields) n[p] = d.xhrFields[p];
            d.mimeType && n.overrideMimeType && n.overrideMimeType(d.mimeType);
            !d.crossDomain &&
              !e["X-Requested-With"] &&
              (e["X-Requested-With"] = "XMLHttpRequest");
            try {
              for (p in e) n.setRequestHeader(p, e[p]);
            } catch (s) {}
            n.send((d.hasContent && d.data) || null);
            l = function (b, e) {
              var p, s, r, q, m;
              try {
                if (l && (e || 4 === n.readyState))
                  if (
                    ((l = c),
                    j && ((n.onreadystatechange = g.noop), qb && delete pa[j]),
                    e)
                  )
                    4 !== n.readyState && n.abort();
                  else {
                    p = n.status;
                    r = n.getAllResponseHeaders();
                    q = {};
                    (m = n.responseXML) && m.documentElement && (q.xml = m);
                    try {
                      q.text = n.responseText;
                    } catch (v) {}
                    try {
                      s = n.statusText;
                    } catch (u) {
                      s = "";
                    }
                    !p && d.isLocal && !d.crossDomain
                      ? (p = q.text ? 200 : 404)
                      : 1223 === p && (p = 204);
                  }
              } catch (z) {
                e || f(-1, z);
              }
              q && f(p, s, q, r);
            };
            d.async
              ? 4 === n.readyState
                ? setTimeout(l, 0)
                : ((j = ++Kd),
                  qb && (pa || ((pa = {}), g(b).unload(qb)), (pa[j] = l)),
                  (n.onreadystatechange = l))
              : l();
          },
          abort: function () {
            l && l(0, 1);
          },
        };
      }
    });
  var xa,
    Ta,
    Ld = /^(?:toggle|show|hide)$/,
    Md = RegExp("^(?:([-+])=|)(" + Ba + ")([a-z%]*)$", "i"),
    Nd = /queueHooks$/,
    ya = [
      function (b, c, d) {
        var l,
          e,
          f,
          j,
          p,
          n,
          s = this,
          r = b.style,
          q = {},
          m = [],
          v = b.nodeType && B(b);
        d.queue ||
          ((p = g._queueHooks(b, "fx")),
          null == p.unqueued &&
            ((p.unqueued = 0),
            (n = p.empty.fire),
            (p.empty.fire = function () {
              p.unqueued || n();
            })),
          p.unqueued++,
          s.always(function () {
            s.always(function () {
              p.unqueued--;
              g.queue(b, "fx").length || p.empty.fire();
            });
          }));
        1 === b.nodeType &&
          ("height" in c || "width" in c) &&
          ((d.overflow = [r.overflow, r.overflowX, r.overflowY]),
          "inline" === g.css(b, "display") &&
            "none" === g.css(b, "float") &&
            (!g.support.inlineBlockNeedsLayout || "inline" === ca(b.nodeName)
              ? (r.display = "inline-block")
              : (r.zoom = 1)));
        d.overflow &&
          ((r.overflow = "hidden"),
          g.support.shrinkWrapBlocks ||
            s.done(function () {
              r.overflow = d.overflow[0];
              r.overflowX = d.overflow[1];
              r.overflowY = d.overflow[2];
            }));
        for (l in c)
          (e = c[l]),
            Ld.exec(e) &&
              (delete c[l], e !== (v ? "hide" : "show") && m.push(l));
        if ((e = m.length)) {
          f = g._data(b, "fxshow") || g._data(b, "fxshow", {});
          v
            ? g(b).show()
            : s.done(function () {
                g(b).hide();
              });
          s.done(function () {
            var c;
            g.removeData(b, "fxshow", !0);
            for (c in q) g.style(b, c, q[c]);
          });
          for (l = 0; l < e; l++)
            (c = m[l]),
              (j = s.createTween(c, v ? f[c] : 0)),
              (q[c] = f[c] || g.style(b, c)),
              c in f ||
                ((f[c] = j.start),
                v &&
                  ((j.end = j.start),
                  (j.start = "width" === c || "height" === c ? 1 : 0)));
        }
      },
    ],
    qa = {
      "*": [
        function (b, c) {
          var d,
            l,
            e = this.createTween(b, c),
            f = Md.exec(c),
            j = e.cur(),
            p = +j || 0,
            n = 1,
            s = 20;
          if (f) {
            d = +f[2];
            l = f[3] || (g.cssNumber[b] ? "" : "px");
            if ("px" !== l && p) {
              p = g.css(e.elem, b, !0) || d || 1;
              do (n = n || ".5"), (p /= n), g.style(e.elem, b, p + l);
              while (n !== (n = e.cur() / j) && 1 !== n && --s);
            }
            e.unit = l;
            e.start = p;
            e.end = f[1] ? p + (f[1] + 1) * d : d;
          }
          return e;
        },
      ],
    };
  g.Animation = g.extend(zb, {
    tweener: function (b, c) {
      g.isFunction(b) ? ((c = b), (b = ["*"])) : (b = b.split(" "));
      for (var d, l = 0, e = b.length; l < e; l++)
        (d = b[l]), (qa[d] = qa[d] || []), qa[d].unshift(c);
    },
    prefilter: function (b, c) {
      c ? ya.unshift(b) : ya.push(b);
    },
  });
  g.Tween = O;
  O.prototype = {
    constructor: O,
    init: function (b, c, d, l, e, f) {
      this.elem = b;
      this.prop = d;
      this.easing = e || "swing";
      this.options = c;
      this.start = this.now = this.cur();
      this.end = l;
      this.unit = f || (g.cssNumber[d] ? "" : "px");
    },
    cur: function () {
      var b = O.propHooks[this.prop];
      return b && b.get ? b.get(this) : O.propHooks._default.get(this);
    },
    run: function (b) {
      var c,
        d = O.propHooks[this.prop];
      return (
        this.options.duration
          ? (this.pos = c = g.easing[this.easing](
              b,
              this.options.duration * b,
              0,
              1,
              this.options.duration
            ))
          : (this.pos = c = b),
        (this.now = (this.end - this.start) * c + this.start),
        this.options.step && this.options.step.call(this.elem, this.now, this),
        d && d.set ? d.set(this) : O.propHooks._default.set(this),
        this
      );
    },
  };
  O.prototype.init.prototype = O.prototype;
  O.propHooks = {
    _default: {
      get: function (b) {
        var c;
        return null == b.elem[b.prop] ||
          (b.elem.style && null != b.elem.style[b.prop])
          ? ((c = g.css(b.elem, b.prop, !1, "")), !c || "auto" === c ? 0 : c)
          : b.elem[b.prop];
      },
      set: function (b) {
        g.fx.step[b.prop]
          ? g.fx.step[b.prop](b)
          : b.elem.style &&
            (null != b.elem.style[g.cssProps[b.prop]] || g.cssHooks[b.prop])
          ? g.style(b.elem, b.prop, b.now + b.unit)
          : (b.elem[b.prop] = b.now);
      },
    },
  };
  O.propHooks.scrollTop = O.propHooks.scrollLeft = {
    set: function (b) {
      b.elem.nodeType && b.elem.parentNode && (b.elem[b.prop] = b.now);
    },
  };
  g.each(["toggle", "show", "hide"], function (b, c) {
    var d = g.fn[c];
    g.fn[c] = function (l, e, f) {
      return null == l ||
        "boolean" == typeof l ||
        (!b && g.isFunction(l) && g.isFunction(e))
        ? d.apply(this, arguments)
        : this.animate(za(c, !0), l, e, f);
    };
  });
  g.fn.extend({
    fadeTo: function (b, c, d, l) {
      return this.filter(B)
        .css("opacity", 0)
        .show()
        .end()
        .animate({ opacity: c }, b, d, l);
    },
    animate: function (b, c, d, l) {
      var e = g.isEmptyObject(b),
        f = g.speed(c, d, l);
      c = function () {
        var c = zb(this, g.extend({}, b), f);
        e && c.stop(!0);
      };
      return e || !1 === f.queue ? this.each(c) : this.queue(f.queue, c);
    },
    stop: function (b, d, l) {
      var e = function (b) {
        var c = b.stop;
        delete b.stop;
        c(l);
      };
      return (
        "string" != typeof b && ((l = d), (d = b), (b = c)),
        d && !1 !== b && this.queue(b || "fx", []),
        this.each(function () {
          var c = !0,
            d = null != b && b + "queueHooks",
            f = g.timers,
            j = g._data(this);
          if (d) j[d] && j[d].stop && e(j[d]);
          else for (d in j) j[d] && j[d].stop && Nd.test(d) && e(j[d]);
          for (d = f.length; d--; )
            f[d].elem === this &&
              (null == b || f[d].queue === b) &&
              (f[d].anim.stop(l), (c = !1), f.splice(d, 1));
          (c || !l) && g.dequeue(this, b);
        })
      );
    },
  });
  g.each(
    {
      slideDown: za("show"),
      slideUp: za("hide"),
      slideToggle: za("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" },
    },
    function (b, c) {
      g.fn[b] = function (b, d, l) {
        return this.animate(c, b, d, l);
      };
    }
  );
  g.speed = function (b, c, d) {
    var l =
      b && "object" == typeof b
        ? g.extend({}, b)
        : {
            complete: d || (!d && c) || (g.isFunction(b) && b),
            duration: b,
            easing: (d && c) || (c && !g.isFunction(c) && c),
          };
    l.duration = g.fx.off
      ? 0
      : "number" == typeof l.duration
      ? l.duration
      : l.duration in g.fx.speeds
      ? g.fx.speeds[l.duration]
      : g.fx.speeds._default;
    if (null == l.queue || !0 === l.queue) l.queue = "fx";
    return (
      (l.old = l.complete),
      (l.complete = function () {
        g.isFunction(l.old) && l.old.call(this);
        l.queue && g.dequeue(this, l.queue);
      }),
      l
    );
  };
  g.easing = {
    linear: function (b) {
      return b;
    },
    swing: function (b) {
      return 0.5 - Math.cos(b * Math.PI) / 2;
    },
  };
  g.timers = [];
  g.fx = O.prototype.init;
  g.fx.tick = function () {
    for (var b, c = g.timers, d = 0; d < c.length; d++)
      (b = c[d]), !b() && c[d] === b && c.splice(d--, 1);
    c.length || g.fx.stop();
  };
  g.fx.timer = function (b) {
    b() &&
      g.timers.push(b) &&
      !Ta &&
      (Ta = setInterval(g.fx.tick, g.fx.interval));
  };
  g.fx.interval = 13;
  g.fx.stop = function () {
    clearInterval(Ta);
    Ta = null;
  };
  g.fx.speeds = { slow: 600, fast: 200, _default: 400 };
  g.fx.step = {};
  g.expr &&
    g.expr.filters &&
    (g.expr.filters.animated = function (b) {
      return g.grep(g.timers, function (c) {
        return b === c.elem;
      }).length;
    });
  var pc = /^(?:body|html)$/i;
  g.fn.offset = function (b) {
    if (arguments.length)
      return b === c
        ? this
        : this.each(function (c) {
            g.offset.setOffset(this, b, c);
          });
    var d,
      l,
      e,
      f,
      j,
      p,
      n,
      s = { top: 0, left: 0 },
      r = this[0],
      q = r && r.ownerDocument;
    if (q)
      return (l = q.body) === r
        ? g.offset.bodyOffset(r)
        : ((d = q.documentElement),
          g.contains(d, r)
            ? ("undefined" != typeof r.getBoundingClientRect &&
                (s = r.getBoundingClientRect()),
              (e = Ab(q)),
              (f = d.clientTop || l.clientTop || 0),
              (j = d.clientLeft || l.clientLeft || 0),
              (p = e.pageYOffset || d.scrollTop),
              (n = e.pageXOffset || d.scrollLeft),
              { top: s.top + p - f, left: s.left + n - j })
            : s);
  };
  g.offset = {
    bodyOffset: function (b) {
      var c = b.offsetTop,
        d = b.offsetLeft;
      return (
        g.support.doesNotIncludeMarginInBodyOffset &&
          ((c += parseFloat(g.css(b, "marginTop")) || 0),
          (d += parseFloat(g.css(b, "marginLeft")) || 0)),
        { top: c, left: d }
      );
    },
    setOffset: function (b, c, d) {
      var l = g.css(b, "position");
      "static" === l && (b.style.position = "relative");
      var e = g(b),
        f = e.offset(),
        j = g.css(b, "top"),
        p = g.css(b, "left"),
        n = {},
        s = {},
        r,
        q;
      ("absolute" === l || "fixed" === l) && -1 < g.inArray("auto", [j, p])
        ? ((s = e.position()), (r = s.top), (q = s.left))
        : ((r = parseFloat(j) || 0), (q = parseFloat(p) || 0));
      g.isFunction(c) && (c = c.call(b, d, f));
      null != c.top && (n.top = c.top - f.top + r);
      null != c.left && (n.left = c.left - f.left + q);
      "using" in c ? c.using.call(b, n) : e.css(n);
    },
  };
  g.fn.extend({
    position: function () {
      if (this[0]) {
        var b = this[0],
          c = this.offsetParent(),
          d = this.offset(),
          l = pc.test(c[0].nodeName) ? { top: 0, left: 0 } : c.offset();
        return (
          (d.top -= parseFloat(g.css(b, "marginTop")) || 0),
          (d.left -= parseFloat(g.css(b, "marginLeft")) || 0),
          (l.top += parseFloat(g.css(c[0], "borderTopWidth")) || 0),
          (l.left += parseFloat(g.css(c[0], "borderLeftWidth")) || 0),
          { top: d.top - l.top, left: d.left - l.left }
        );
      }
    },
    offsetParent: function () {
      return this.map(function () {
        for (
          var b = this.offsetParent || x.body;
          b && !pc.test(b.nodeName) && "static" === g.css(b, "position");

        )
          b = b.offsetParent;
        return b || x.body;
      });
    },
  });
  g.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (
    b,
    d
  ) {
    var l = /Y/.test(d);
    g.fn[b] = function (e) {
      return g.access(
        this,
        function (b, e, f) {
          var j = Ab(b);
          if (f === c)
            return j ? (d in j ? j[d] : j.document.documentElement[e]) : b[e];
          j
            ? j.scrollTo(l ? g(j).scrollLeft() : f, l ? f : g(j).scrollTop())
            : (b[e] = f);
        },
        b,
        e,
        arguments.length,
        null
      );
    };
  });
  g.each({ Height: "height", Width: "width" }, function (b, d) {
    g.each({ padding: "inner" + b, content: d, "": "outer" + b }, function (
      l,
      e
    ) {
      g.fn[e] = function (e, f) {
        var j = arguments.length && (l || "boolean" != typeof e),
          p = l || (!0 === e || !0 === f ? "margin" : "border");
        return g.access(
          this,
          function (d, l, e) {
            var f;
            return g.isWindow(d)
              ? d.document.documentElement["client" + b]
              : 9 === d.nodeType
              ? ((f = d.documentElement),
                Math.max(
                  d.body["scroll" + b],
                  f["scroll" + b],
                  d.body["offset" + b],
                  f["offset" + b],
                  f["client" + b]
                ))
              : e === c
              ? g.css(d, l, e, p)
              : g.style(d, l, e, p);
          },
          d,
          j ? e : c,
          j,
          null
        );
      };
    });
  });
  b.jQuery = b.$ = g;
  "function" == typeof define &&
    define.amd &&
    define.amd.jQuery &&
    define("jquery", [], function () {
      return g;
    });
})(window);
var portraitMode = !0,
  startScreen = null,
  mobilePortraitWidth = 640,
  mobilePortraitHeight = 1024,
  mobileLandscapeWidth = 1024,
  mobileLandscapeHeight = 640,
  showRotate = !1,
  mobileLoaded = !1,
  mobileWidth = portraitMode ? mobilePortraitWidth : mobileLandscapeWidth,
  mobileHeight = portraitMode ? mobilePortraitHeight : mobileLandscapeHeight,
  desktopWidth = 640,
  desktopHeight = 1024,
  w,
  h,
  multiplier,
  destW,
  destH,
  initOrientation = !0,
  isHeightBigger = !1,
  deviceRatio,
  gameRatio,
  widthOffset = 0,
  halfWidthOffset = 0,
  heightOffset = 0,
  halfHeightOffset = 0,
  dynamicClickableEntityDivs = {},
  coreDivsToResize = ["game", "play"],
  advancedDivsToResize = {
    MobileAdInGamePreroll: {
      "box-width": _SETTINGS.Ad.Mobile.Preroll.Width + 2,
      "box-height": _SETTINGS.Ad.Mobile.Preroll.Height + 20,
    },
    MobileAdInGameEnd: {
      "box-width": _SETTINGS.Ad.Mobile.End.Width + 2,
      "box-height": _SETTINGS.Ad.Mobile.End.Height + 20,
    },
    MobileAdInGamePreroll2: {
      "box-width": _SETTINGS.Ad.Mobile.Preroll.Width + 2,
      "box-height": _SETTINGS.Ad.Mobile.Preroll.Height + 20,
    },
    MobileAdInGameEnd2: {
      "box-width": _SETTINGS.Ad.Mobile.End.Width + 2,
      "box-height": _SETTINGS.Ad.Mobile.End.Height + 20,
    },
    MobileAdInGamePreroll3: {
      "box-width": _SETTINGS.Ad.Mobile.Preroll.Width + 2,
      "box-height": _SETTINGS.Ad.Mobile.Preroll.Height + 20,
    },
    MobileAdInGameEnd3: {
      "box-width": _SETTINGS.Ad.Mobile.End.Width + 2,
      "box-height": _SETTINGS.Ad.Mobile.End.Height + 20,
    },
  };
function adjustLayers(b) {
  for (i = 0; i < coreDivsToResize.length; i++)
    ig.ua.mobile
      ? ($("#" + coreDivsToResize[i]).width(destW),
        $("#" + coreDivsToResize[i]).height(destH),
        $("#" + coreDivsToResize[i]).css("left", b ? 0 : w / 2 - destW / 2),
        $("#" + coreDivsToResize[i]).css("top", b ? 0 : h / 2 - destH / 2))
      : ($("#" + coreDivsToResize[i]).width(destW),
        $("#" + coreDivsToResize[i]).height(destH),
        $("#" + coreDivsToResize[i]).css("left", b ? 0 : w / 2 - destW / 2));
  for (key in advancedDivsToResize)
    try {
      $("#" + key).width(w);
      $("#" + key).height(h);
      var c = $("#" + key + "-Box"),
        d = c.width(),
        e = c.height() + 40,
        f = (window.innerWidth - d) / 2,
        j = (window.innerHeight - e) / 2;
      5 > j && (j = 5);
      $("#" + key + "-Box").css("left", f);
      $("#" + key + "-Box").css("top", j);
    } catch (m) {
      console.log(m);
    }
  $("#ajaxbar").width(w);
  $("#ajaxbar").height(h);
}
function sizeHandler() {
  if ($("#game")) {
    w = window.innerWidth;
    h = window.innerHeight;
    ig.ua.mobile
      ? ((multiplier = Math.min(h / mobileHeight, w / mobileWidth)),
        (destW = mobileWidth * multiplier),
        (destH = mobileHeight * multiplier))
      : ((multiplier = Math.min(h / desktopHeight, w / desktopWidth)),
        (destW = desktopWidth * multiplier),
        (destH = desktopHeight * multiplier));
    widthRatio = window.innerWidth / mobileWidth;
    heightRatio = window.innerHeight / mobileHeight;
    adjustLayers();
    window.scrollTo(0, 1);
    for (var b = navigator.userAgent.split(" "), c = 0; c < b.length; c++)
      b[c].substr(0, 8);
    navigator.userAgent.indexOf("wv");
    navigator.userAgent.indexOf("SamsungBrowser");
    !1 == showRotate && resizeMobile();
  }
}
function orientationHandler() {
  console.log("changing orientation ...");
  ig.ua.mobile &&
    ((
      portraitMode
        ? window.innerHeight < window.innerWidth
        : window.innerHeight > window.innerWidth
    )
      ? ((showRotate = !0), $("#orientate").show(), $("#game").hide())
      : ((showRotate = !1), $("#orientate").hide(), $("#game").show()));
  sizeHandler();
  !0 == initOrientation &&
    ((initOrientation = !1), window.setTimeout("resizeMobile()", 100));
}
function fixSamsungHandler() {
  ig.ua.android &&
    !(
      4.2 >
      parseFloat(
        navigator.userAgent.slice(
          navigator.userAgent.indexOf("Android") + 8,
          navigator.userAgent.indexOf("Android") + 11
        )
      )
    ) &&
    !(0 > navigator.userAgent.indexOf("GT")) &&
    !(0 < navigator.userAgent.indexOf("Chrome")) &&
    !(0 < navigator.userAgent.indexOf("Firefox")) &&
    (document.addEventListener(
      "touchstart",
      function (b) {
        b.preventDefault();
        return !1;
      },
      !1
    ),
    document.addEventListener(
      "touchmove",
      function (b) {
        b.preventDefault();
        return !1;
      },
      !1
    ),
    document.addEventListener(
      "touchend",
      function (b) {
        b.preventDefault();
        return !1;
      },
      !1
    ));
}
orientationTimeout = orientationInterval = null;
function resizeDelayHandler() {
  orientationDelayHandler();
}
function orientationDelayHandler() {
  ig.ua.iOS
    ? (null == orientationInterval &&
        (orientationInterval = window.setInterval(orientationHandler, 100)),
      null == orientationTimeout &&
        (orientationTimeout = window.setTimeout(function () {
          clearAllIntervals();
        }, 800)))
    : orientationHandler();
}
function resizeMobile() {
  if (!(ig.game && !0 == ig.game.leaderboardOn) && ig.ua.mobile) {
    mobileWidth = portraitMode ? mobilePortraitWidth : mobileLandscapeWidth;
    mobileHeight = portraitMode ? mobilePortraitHeight : mobileLandscapeHeight;
    deviceRatio = window.innerWidth / window.innerHeight;
    gameRatio = mobileWidth / mobileHeight;
    mobileHeight = (mobileHeight / deviceRatio) * gameRatio;
    heightOffset = mobileHeight - desktopHeight;
    halfHeightOffset = 0.5 * heightOffset;
    if (ig.system.width != mobileWidth || ig.system.height != mobileHeight)
      if ((ig.system.resize(mobileWidth, mobileHeight), ig.game)) {
        var b = ig.game.getEntitiesByType(EntityGameControl)[0];
        b && b.updatePosition();
        (b = ig.game.getEntitiesByType(EntityGameCharacter)[0]) &&
          b.updateReposition();
      }
    "visible" == document.getElementById("play").style.visibility &&
      drawStartScreen();
  }
}
function clearAllIntervals() {
  window.clearInterval(orientationInterval);
  orientationInterval = null;
  window.clearTimeout(orientationTimeout);
  orientationTimeout = null;
  resizeMobile();
}
window.addEventListener("orientationchange", orientationDelayHandler);
window.addEventListener("resize", resizeDelayHandler);
var gamediv = document.getElementById("ajaxbar");
gamediv &&
  (gamediv.ontouchmove = function (b) {
    window.scrollTo(0, 1);
    b.preventDefault();
  });
function getInternetExplorerVersion() {
  var b = -1;
  "Microsoft Internet Explorer" == navigator.appName &&
    null != /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent) &&
    (b = parseFloat(RegExp.$1));
  return b;
}
var ie = getInternetExplorerVersion();
function getQueryVariable(b) {
  for (
    var c = window.location.search.substring(1).split("&"), d = 0;
    d < c.length;
    d++
  ) {
    var e = c[d].split("=");
    if (decodeURIComponent(e[0]) == b) return decodeURIComponent(e[1]);
  }
}
this.jukebox = {};
jukebox.Player = function (b, c) {
  this.id = ++jukebox.__jukeboxId;
  this.origin = c || null;
  this.settings = {};
  for (var d in this.defaults) this.settings[d] = this.defaults[d];
  if ("[object Object]" === Object.prototype.toString.call(b))
    for (var e in b) this.settings[e] = b[e];
  "[object Function]" === Object.prototype.toString.call(jukebox.Manager) &&
    (jukebox.Manager = new jukebox.Manager());
  this.resource = this.isPlaying = null;
  this.resource =
    "[object Object]" === Object.prototype.toString.call(jukebox.Manager)
      ? jukebox.Manager.getPlayableResource(this.settings.resources)
      : this.settings.resources[0] || null;
  if (null === this.resource)
    throw "Your browser can't playback the given resources - or you have missed to include jukebox.Manager";
  this.__init();
  return this;
};
jukebox.__jukeboxId = 0;
jukebox.Player.prototype = {
  defaults: {
    resources: [],
    autoplay: !1,
    spritemap: {},
    flashMediaElement: "./swf/FlashMediaElement.swf",
    timeout: 1e3,
  },
  __addToManager: function () {
    !0 !== this.__wasAddedToManager &&
      (jukebox.Manager.add(this), (this.__wasAddedToManager = !0));
  },
  __init: function () {
    var b = this,
      c = this.settings,
      d = {},
      e;
    jukebox.Manager &&
      void 0 !== jukebox.Manager.features &&
      (d = jukebox.Manager.features);
    if (!0 === d.html5audio) {
      this.context = new Audio();
      this.context.src = this.resource;
      if (null === this.origin) {
        var f = function (c) {
          b.__addToManager(c);
        };
        this.context.addEventListener("canplaythrough", f, !0);
        window.setTimeout(function () {
          b.context.removeEventListener("canplaythrough", f, !0);
          f("timeout");
        }, c.timeout);
      }
      this.context.autobuffer = !0;
      this.context.preload = !0;
      for (e in this.HTML5API) this[e] = this.HTML5API[e];
      1 < d.channels
        ? !0 === c.autoplay
          ? (this.context.autoplay = !0)
          : void 0 !== c.spritemap[c.autoplay] && this.play(c.autoplay)
        : 1 === d.channels &&
          void 0 !== c.spritemap[c.autoplay] &&
          ((this.backgroundMusic = c.spritemap[c.autoplay]),
          (this.backgroundMusic.started = Date.now ? Date.now() : +new Date()),
          this.play(c.autoplay));
      1 == d.channels &&
        !0 !== c.canPlayBackground &&
        (window.addEventListener("pagehide", function () {
          null !== b.isPlaying && (b.pause(), (b.__wasAutoPaused = !0));
        }),
        window.addEventListener("pageshow", function () {
          b.__wasAutoPaused && (b.resume(), delete b._wasAutoPaused);
        }));
    } else if (!0 === d.flashaudio) {
      for (e in this.FLASHAPI) this[e] = this.FLASHAPI[e];
      d = [
        "id=jukebox-flashstream-" + this.id,
        "autoplay=" + c.autoplay,
        "file=" + window.encodeURIComponent(this.resource),
      ];
      this.__initFlashContext(d);
      !0 === c.autoplay
        ? this.play(0)
        : c.spritemap[c.autoplay] && this.play(c.autoplay);
    } else throw "Your Browser does not support Flash Audio or HTML5 Audio.";
  },
  __initFlashContext: function (b) {
    var c,
      d = this.settings.flashMediaElement,
      e,
      f = {
        flashvars: b.join("&"),
        quality: "high",
        bgcolor: "#000000",
        wmode: "transparent",
        allowscriptaccess: "always",
        allowfullscreen: "true",
      };
    if (navigator.userAgent.match(/MSIE/)) {
      c = document.createElement("div");
      document.getElementsByTagName("body")[0].appendChild(c);
      var j = document.createElement("object");
      j.id = "jukebox-flashstream-" + this.id;
      j.setAttribute("type", "application/x-shockwave-flash");
      j.setAttribute("classid", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000");
      j.setAttribute("width", "0");
      j.setAttribute("height", "0");
      f.movie = d + "?x=" + (Date.now ? Date.now() : +new Date());
      f.flashvars = b.join("&amp;");
      for (e in f)
        (b = document.createElement("param")),
          b.setAttribute("name", e),
          b.setAttribute("value", f[e]),
          j.appendChild(b);
      c.outerHTML = j.outerHTML;
      this.context = document.getElementById("jukebox-flashstream-" + this.id);
    } else {
      c = document.createElement("embed");
      c.id = "jukebox-flashstream-" + this.id;
      c.setAttribute("type", "application/x-shockwave-flash");
      c.setAttribute("width", "100");
      c.setAttribute("height", "100");
      f.play = !1;
      f.loop = !1;
      f.src = d + "?x=" + (Date.now ? Date.now() : +new Date());
      for (e in f) c.setAttribute(e, f[e]);
      document.getElementsByTagName("body")[0].appendChild(c);
      this.context = c;
    }
  },
  backgroundHackForiOS: function () {
    if (void 0 !== this.backgroundMusic) {
      var b = Date.now ? Date.now() : +new Date();
      void 0 === this.backgroundMusic.started
        ? ((this.backgroundMusic.started = b),
          this.setCurrentTime(this.backgroundMusic.start))
        : ((this.backgroundMusic.lastPointer =
            (((b - this.backgroundMusic.started) / 1e3) %
              (this.backgroundMusic.end - this.backgroundMusic.start)) +
            this.backgroundMusic.start),
          this.play(this.backgroundMusic.lastPointer));
    }
  },
  play: function (b, c) {
    if (null !== this.isPlaying && !0 !== c)
      void 0 !== jukebox.Manager && jukebox.Manager.addToQueue(b, this.id);
    else {
      var d = this.settings.spritemap,
        e;
      if (void 0 !== d[b]) e = d[b].start;
      else if ("number" === typeof b) {
        e = b;
        for (var f in d)
          if (e >= d[f].start && e <= d[f].end) {
            b = f;
            break;
          }
      }
      void 0 !== e &&
        "[object Object]" === Object.prototype.toString.call(d[b]) &&
        ((this.isPlaying = this.settings.spritemap[b]),
        this.context.play && this.context.play(),
        (this.wasReady = this.setCurrentTime(e)));
    }
  },
  stop: function () {
    this.__lastPosition = 0;
    this.isPlaying = null;
    this.backgroundMusic ? this.backgroundHackForiOS() : this.context.pause();
    return !0;
  },
  pause: function () {
    this.isPlaying = null;
    this.__lastPosition = this.getCurrentTime();
    this.context.pause();
    return this.__lastPosition;
  },
  resume: function (b) {
    b = "number" === typeof b ? b : this.__lastPosition;
    if (null !== b) return this.play(b), (this.__lastPosition = null), !0;
    this.context.play();
    return !1;
  },
  HTML5API: {
    getVolume: function () {
      return this.context.volume || 1;
    },
    setVolume: function (b) {
      this.context.volume = b;
      return 1e-4 > Math.abs(this.context.volume - b) ? !0 : !1;
    },
    getCurrentTime: function () {
      return this.context.currentTime || 0;
    },
    setCurrentTime: function (b) {
      try {
        return (this.context.currentTime = b), !0;
      } catch (c) {
        return !1;
      }
    },
  },
  FLASHAPI: {
    getVolume: function () {
      return this.context && "function" === typeof this.context.getVolume
        ? this.context.getVolume()
        : 1;
    },
    setVolume: function (b) {
      return this.context && "function" === typeof this.context.setVolume
        ? (this.context.setVolume(b), !0)
        : !1;
    },
    getCurrentTime: function () {
      return this.context && "function" === typeof this.context.getCurrentTime
        ? this.context.getCurrentTime()
        : 0;
    },
    setCurrentTime: function (b) {
      return this.context && "function" === typeof this.context.setCurrentTime
        ? this.context.setCurrentTime(b)
        : !1;
    },
  },
};
if (void 0 === this.jukebox)
  throw "jukebox.Manager requires jukebox.Player (Player.js) to run properly.";
jukebox.Manager = function (b) {
  this.features = {};
  this.codecs = {};
  this.__players = {};
  this.__playersLength = 0;
  this.__clones = {};
  this.__queue = [];
  this.settings = {};
  for (var c in this.defaults) this.settings[c] = this.defaults[c];
  if ("[object Object]" === Object.prototype.toString.call(b))
    for (var d in b) this.settings[d] = b[d];
  this.__detectFeatures();
  jukebox.Manager.__initialized =
    !1 === this.settings.useGameLoop
      ? window.setInterval(function () {
          jukebox.Manager.loop();
        }, 20)
      : !0;
};
jukebox.Manager.prototype = {
  defaults: { useFlash: !1, useGameLoop: !1 },
  __detectFeatures: function () {
    var b = window.Audio && new Audio();
    if (b && b.canPlayType && !1 === this.settings.useFlash) {
      for (
        var c = [
            { e: "3gp", m: ["audio/3gpp", "audio/amr"] },
            { e: "aac", m: ["audio/aac", "audio/aacp"] },
            { e: "amr", m: ["audio/amr", "audio/3gpp"] },
            {
              e: "caf",
              m: [
                "audio/IMA-ADPCM",
                "audio/x-adpcm",
                'audio/x-aiff; codecs="IMA-ADPCM, ADPCM"',
              ],
            },
            {
              e: "m4a",
              m: 'audio/mp4{audio/mp4; codecs="mp4a.40.2,avc1.42E01E"{audio/mpeg4{audio/mpeg4-generic{audio/mp4a-latm{audio/MP4A-LATM{audio/x-m4a'.split(
                "{"
              ),
            },
            {
              e: "mp3",
              m: [
                "audio/mp3",
                "audio/mpeg",
                'audio/mpeg; codecs="mp3"',
                "audio/MPA",
                "audio/mpa-robust",
              ],
            },
            {
              e: "mpga",
              m: ["audio/MPA", "audio/mpa-robust", "audio/mpeg", "video/mpeg"],
            },
            { e: "mp4", m: ["audio/mp4", "video/mp4"] },
            {
              e: "ogg",
              m: [
                "application/ogg",
                "audio/ogg",
                'audio/ogg; codecs="theora, vorbis"',
                "video/ogg",
                'video/ogg; codecs="theora, vorbis"',
              ],
            },
            {
              e: "wav",
              m: [
                "audio/wave",
                "audio/wav",
                'audio/wav; codecs="1"',
                "audio/x-wav",
                "audio/x-pn-wav",
              ],
            },
            {
              e: "webm",
              m: ["audio/webm", 'audio/webm; codecs="vorbis"', "video/webm"],
            },
          ],
          d,
          e,
          f = 0,
          j = c.length;
        f < j;
        f++
      )
        if (((e = c[f].e), c[f].m.length && "object" === typeof c[f].m))
          for (var m = 0, q = c[f].m.length; m < q; m++)
            if (((d = c[f].m[m]), "" !== b.canPlayType(d))) {
              this.codecs[e] = d;
              break;
            } else this.codecs[e] || (this.codecs[e] = !1);
      this.features.html5audio = !(
        !this.codecs.mp3 &&
        !this.codecs.ogg &&
        !this.codecs.webm &&
        !this.codecs.wav
      );
      this.features.channels = 8;
      b.volume = 0.1337;
      this.features.volume = !!(1e-4 > Math.abs(b.volume - 0.1337));
      navigator.userAgent.match(/iPhone|iPod|iPad/i) &&
        (this.features.channels = 1);
    }
    this.features.flashaudio =
      !!navigator.mimeTypes["application/x-shockwave-flash"] ||
      !!navigator.plugins["Shockwave Flash"] ||
      !1;
    if (window.ActiveXObject)
      try {
        new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10"),
          (this.features.flashaudio = !0);
      } catch (l) {}
    !0 === this.settings.useFlash && (this.features.flashaudio = !0);
    !0 === this.features.flashaudio &&
      !this.features.html5audio &&
      ((this.codecs.mp3 = "audio/mp3"),
      (this.codecs.mpga = "audio/mpeg"),
      (this.codecs.mp4 = "audio/mp4"),
      (this.codecs.m4a = "audio/mp4"),
      (this.codecs["3gp"] = "audio/3gpp"),
      (this.codecs.amr = "audio/amr"),
      (this.features.volume = !0),
      (this.features.channels = 1));
  },
  __getPlayerById: function (b) {
    return this.__players && void 0 !== this.__players[b]
      ? this.__players[b]
      : null;
  },
  __getClone: function (b, c) {
    for (var d in this.__clones) {
      var e = this.__clones[d];
      if (null === e.isPlaying && e.origin === b) return e;
    }
    if ("[object Object]" === Object.prototype.toString.call(c)) {
      d = {};
      for (var f in c) d[f] = c[f];
      d.autoplay = !1;
      f = new jukebox.Player(d, b);
      f.isClone = !0;
      f.wasReady = !1;
      return (this.__clones[f.id] = f);
    }
    return null;
  },
  loop: function () {
    if (0 !== this.__playersLength)
      if (
        this.__queue.length &&
        this.__playersLength < this.features.channels
      ) {
        var b = this.__queue[0],
          c = this.__getPlayerById(b.origin);
        if (null !== c) {
          var d = this.__getClone(b.origin, c.settings);
          null !== d &&
            (!0 === this.features.volume &&
              (c = this.__players[b.origin]) &&
              d.setVolume(c.getVolume()),
            this.add(d),
            d.play(b.pointer, !0));
        }
        this.__queue.splice(0, 1);
      } else
        for (d in (this.__queue.length &&
          1 === this.features.channels &&
          ((b = this.__queue[0]),
          (c = this.__getPlayerById(b.origin)),
          null !== c && c.play(b.pointer, !0),
          this.__queue.splice(0, 1)),
        this.__players))
          (b = this.__players[d]),
            (c = b.getCurrentTime() || 0),
            b.isPlaying && !1 === b.wasReady
              ? (b.wasReady = b.setCurrentTime(b.isPlaying.start))
              : b.isPlaying && !0 === b.wasReady
              ? c > b.isPlaying.end &&
                (!0 === b.isPlaying.loop
                  ? b.play(b.isPlaying.start, !0)
                  : b.stop())
              : b.isClone && null === b.isPlaying
              ? this.remove(b)
              : void 0 !== b.backgroundMusic &&
                null === b.isPlaying &&
                c > b.backgroundMusic.end &&
                b.backgroundHackForiOS();
  },
  getPlayableResource: function (b) {
    "[object Array]" !== Object.prototype.toString.call(b) && (b = [b]);
    for (var c = 0, d = b.length; c < d; c++) {
      var e = b[c],
        f = e.match(/\.([^\.]*)$/)[1];
      if (f && this.codecs[f]) return e;
    }
    return null;
  },
  add: function (b) {
    return b instanceof jukebox.Player && void 0 === this.__players[b.id]
      ? (this.__playersLength++, (this.__players[b.id] = b), !0)
      : !1;
  },
  remove: function (b) {
    return b instanceof jukebox.Player && void 0 !== this.__players[b.id]
      ? (this.__playersLength--, delete this.__players[b.id], !0)
      : !1;
  },
  addToQueue: function (b, c) {
    return ("string" === typeof b || "number" === typeof b) &&
      void 0 !== this.__players[c]
      ? (this.__queue.push({ pointer: b, origin: c }), !0)
      : !1;
  },
};
(function () {
  var b = function () {
    this.init();
  };
  b.prototype = {
    init: function () {
      var b = this || c;
      b._codecs = {};
      b._howls = [];
      b._muted = !1;
      b._volume = 1;
      b._canPlayEvent = "canplaythrough";
      b._navigator =
        "undefined" !== typeof window && window.navigator
          ? window.navigator
          : null;
      b.masterGain = null;
      b.noAudio = !1;
      b.usingWebAudio = !0;
      b.autoSuspend = !0;
      b.ctx = null;
      b.mobileAutoEnable = !0;
      b._setup();
      return b;
    },
    volume: function (b) {
      var d = this || c;
      b = parseFloat(b);
      d.ctx || q();
      if ("undefined" !== typeof b && 0 <= b && 1 >= b) {
        d._volume = b;
        if (d._muted) return d;
        d.usingWebAudio && (d.masterGain.gain.value = b);
        for (var e = 0; e < d._howls.length; e++)
          if (!d._howls[e]._webAudio)
            for (var f = d._howls[e]._getSoundIds(), j = 0; j < f.length; j++) {
              var m = d._howls[e]._soundById(f[j]);
              m && m._node && (m._node.volume = m._volume * b);
            }
        return d;
      }
      return d._volume;
    },
    mute: function (b) {
      var d = this || c;
      d.ctx || q();
      d._muted = b;
      d.usingWebAudio && (d.masterGain.gain.value = b ? 0 : d._volume);
      for (var e = 0; e < d._howls.length; e++)
        if (!d._howls[e]._webAudio)
          for (var f = d._howls[e]._getSoundIds(), j = 0; j < f.length; j++) {
            var m = d._howls[e]._soundById(f[j]);
            m && m._node && (m._node.muted = b ? !0 : m._muted);
          }
      return d;
    },
    unload: function () {
      for (var b = this || c, d = b._howls.length - 1; 0 <= d; d--)
        b._howls[d].unload();
      b.usingWebAudio &&
        b.ctx &&
        "undefined" !== typeof b.ctx.close &&
        (b.ctx.close(), (b.ctx = null), q());
      return b;
    },
    codecs: function (b) {
      return (this || c)._codecs[b.replace(/^x-/, "")];
    },
    _setup: function () {
      var b = this || c;
      b.state = b.ctx ? b.ctx.state || "running" : "running";
      b._autoSuspend();
      if (!b.usingWebAudio)
        if ("undefined" !== typeof Audio)
          try {
            var d = new Audio();
            "undefined" === typeof d.oncanplaythrough &&
              (b._canPlayEvent = "canplay");
          } catch (e) {
            b.noAudio = !0;
          }
        else b.noAudio = !0;
      try {
        (d = new Audio()), d.muted && (b.noAudio = !0);
      } catch (f) {}
      b.noAudio || b._setupCodecs();
      return b;
    },
    _setupCodecs: function () {
      var b = this || c,
        d = null;
      try {
        d = "undefined" !== typeof Audio ? new Audio() : null;
      } catch (e) {
        return b;
      }
      if (!d || "function" !== typeof d.canPlayType) return b;
      var f = d.canPlayType("audio/mpeg;").replace(/^no$/, ""),
        j = b._navigator && b._navigator.userAgent.match(/OPR\/([0-6].)/g),
        j = j && 33 > parseInt(j[0].split("/")[1], 10);
      b._codecs = {
        mp3: !(j || (!f && !d.canPlayType("audio/mp3;").replace(/^no$/, ""))),
        mpeg: !!f,
        opus: !!d.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
        ogg: !!d.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
        oga: !!d.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
        wav: !!d.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
        aac: !!d.canPlayType("audio/aac;").replace(/^no$/, ""),
        caf: !!d.canPlayType("audio/x-caf;").replace(/^no$/, ""),
        m4a: !!(
          d.canPlayType("audio/x-m4a;") ||
          d.canPlayType("audio/m4a;") ||
          d.canPlayType("audio/aac;")
        ).replace(/^no$/, ""),
        mp4: !!(
          d.canPlayType("audio/x-mp4;") ||
          d.canPlayType("audio/mp4;") ||
          d.canPlayType("audio/aac;")
        ).replace(/^no$/, ""),
        weba: !!d
          .canPlayType('audio/webm; codecs="vorbis"')
          .replace(/^no$/, ""),
        webm: !!d
          .canPlayType('audio/webm; codecs="vorbis"')
          .replace(/^no$/, ""),
        dolby: !!d.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
        flac: !!(
          d.canPlayType("audio/x-flac;") || d.canPlayType("audio/flac;")
        ).replace(/^no$/, ""),
      };
      return b;
    },
    _enableMobileAudio: function () {
      var b = this || c,
        d = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(
          b._navigator && b._navigator.userAgent
        ),
        e = !!(
          "ontouchend" in window ||
          (b._navigator && 0 < b._navigator.maxTouchPoints) ||
          (b._navigator && 0 < b._navigator.msMaxTouchPoints)
        );
      if (!b._mobileEnabled && b.ctx && (d || e)) {
        b._mobileEnabled = !1;
        !b._mobileUnloaded &&
          44100 !== b.ctx.sampleRate &&
          ((b._mobileUnloaded = !0), b.unload());
        b._scratchBuffer = b.ctx.createBuffer(1, 1, 22050);
        var f = function () {
          var c = b.ctx.createBufferSource();
          c.buffer = b._scratchBuffer;
          c.connect(b.ctx.destination);
          "undefined" === typeof c.start ? c.noteOn(0) : c.start(0);
          c.onended = function () {
            c.disconnect(0);
            b._mobileEnabled = !0;
            b.mobileAutoEnable = !1;
            document.removeEventListener("touchend", f, !0);
          };
        };
        document.addEventListener("touchend", f, !0);
        return b;
      }
    },
    _autoSuspend: function () {
      var b = this;
      if (
        b.autoSuspend &&
        b.ctx &&
        "undefined" !== typeof b.ctx.suspend &&
        c.usingWebAudio
      ) {
        for (var d = 0; d < b._howls.length; d++)
          if (b._howls[d]._webAudio)
            for (var e = 0; e < b._howls[d]._sounds.length; e++)
              if (!b._howls[d]._sounds[e]._paused) return b;
        b._suspendTimer && clearTimeout(b._suspendTimer);
        b._suspendTimer = setTimeout(function () {
          b.autoSuspend &&
            ((b._suspendTimer = null),
            (b.state = "suspending"),
            b.ctx.suspend().then(function () {
              b.state = "suspended";
              b._resumeAfterSuspend &&
                (delete b._resumeAfterSuspend, b._autoResume());
            }));
        }, 3e4);
        return b;
      }
    },
    _autoResume: function () {
      var b = this;
      if (b.ctx && "undefined" !== typeof b.ctx.resume && c.usingWebAudio)
        return (
          "running" === b.state && b._suspendTimer
            ? (clearTimeout(b._suspendTimer), (b._suspendTimer = null))
            : "suspended" === b.state
            ? ((b.state = "resuming"),
              b.ctx.resume().then(function () {
                b.state = "running";
                for (var c = 0; c < b._howls.length; c++)
                  b._howls[c]._emit("resume");
              }),
              b._suspendTimer &&
                (clearTimeout(b._suspendTimer), (b._suspendTimer = null)))
            : "suspending" === b.state && (b._resumeAfterSuspend = !0),
          b
        );
    },
  };
  var c = new b(),
    d = function (b) {
      !b.src || 0 === b.src.length
        ? console.error(
            "An array of source files must be passed with any new Howl."
          )
        : this.init(b);
    };
  d.prototype = {
    init: function (b) {
      var d = this;
      c.ctx || q();
      d._autoplay = b.autoplay || !1;
      d._format = "string" !== typeof b.format ? b.format : [b.format];
      d._html5 = b.html5 || !1;
      d._muted = b.mute || !1;
      d._loop = b.loop || !1;
      d._pool = b.pool || 5;
      d._preload = "boolean" === typeof b.preload ? b.preload : !0;
      d._rate = b.rate || 1;
      d._sprite = b.sprite || {};
      d._src = "string" !== typeof b.src ? b.src : [b.src];
      d._volume = void 0 !== b.volume ? b.volume : 1;
      d._duration = 0;
      d._state = "unloaded";
      d._sounds = [];
      d._endTimers = {};
      d._queue = [];
      d._onend = b.onend ? [{ fn: b.onend }] : [];
      d._onfade = b.onfade ? [{ fn: b.onfade }] : [];
      d._onload = b.onload ? [{ fn: b.onload }] : [];
      d._onloaderror = b.onloaderror ? [{ fn: b.onloaderror }] : [];
      d._onpause = b.onpause ? [{ fn: b.onpause }] : [];
      d._onplay = b.onplay ? [{ fn: b.onplay }] : [];
      d._onstop = b.onstop ? [{ fn: b.onstop }] : [];
      d._onmute = b.onmute ? [{ fn: b.onmute }] : [];
      d._onvolume = b.onvolume ? [{ fn: b.onvolume }] : [];
      d._onrate = b.onrate ? [{ fn: b.onrate }] : [];
      d._onseek = b.onseek ? [{ fn: b.onseek }] : [];
      d._onresume = [];
      d._webAudio = c.usingWebAudio && !d._html5;
      "undefined" !== typeof c.ctx &&
        c.ctx &&
        c.mobileAutoEnable &&
        c._enableMobileAudio();
      c._howls.push(d);
      d._autoplay &&
        d._queue.push({
          event: "play",
          action: function () {
            d.play();
          },
        });
      d._preload && d.load();
      return d;
    },
    load: function () {
      var b = null;
      if (c.noAudio) this._emit("loaderror", null, "No audio support.");
      else {
        "string" === typeof this._src && (this._src = [this._src]);
        for (var d = 0; d < this._src.length; d++) {
          var n, s;
          if (this._format && this._format[d]) n = this._format[d];
          else {
            s = this._src[d];
            if ("string" !== typeof s) {
              this._emit(
                "loaderror",
                null,
                "Non-string found in selected audio sources - ignoring."
              );
              continue;
            }
            (n = /^data:audio\/([^;,]+);/i.exec(s)) ||
              (n = /\.([^.]+)$/.exec(s.split("?", 1)[0]));
            n && (n = n[1].toLowerCase());
          }
          if (c.codecs(n)) {
            b = this._src[d];
            break;
          }
        }
        if (b) {
          this._src = b;
          this._state = "loading";
          "https:" === window.location.protocol &&
            "http:" === b.slice(0, 5) &&
            ((this._html5 = !0), (this._webAudio = !1));
          new e(this);
          if (this._webAudio) {
            var r = this,
              q = r._src;
            if (f[q]) (r._duration = f[q].duration), m(r);
            else if (/^data:[^;]+;base64,/.test(q)) {
              b = atob(q.split(",")[1]);
              d = new Uint8Array(b.length);
              for (n = 0; n < b.length; ++n) d[n] = b.charCodeAt(n);
              j(d.buffer, r);
            } else {
              var z = new XMLHttpRequest();
              z.open("GET", q, !0);
              z.responseType = "arraybuffer";
              z.onload = function () {
                var b = (z.status + "")[0];
                "0" !== b && "2" !== b && "3" !== b
                  ? r._emit(
                      "loaderror",
                      null,
                      "Failed loading audio file with status: " + z.status + "."
                    )
                  : j(z.response, r);
              };
              z.onerror = function () {
                r._webAudio &&
                  ((r._html5 = !0),
                  (r._webAudio = !1),
                  (r._sounds = []),
                  delete f[q],
                  r.load());
              };
              try {
                z.send();
              } catch (B) {
                z.onerror();
              }
            }
          }
          return this;
        }
        this._emit(
          "loaderror",
          null,
          "No codec support for selected audio sources."
        );
      }
    },
    play: function (b, d) {
      var e = this,
        f = null;
      if ("number" === typeof b) (f = b), (b = null);
      else {
        if ("string" === typeof b && "loaded" === e._state && !e._sprite[b])
          return null;
        if ("undefined" === typeof b) {
          b = "__default";
          for (var j = 0, q = 0; q < e._sounds.length; q++)
            e._sounds[q]._paused &&
              !e._sounds[q]._ended &&
              (j++, (f = e._sounds[q]._id));
          1 === j ? (b = null) : (f = null);
        }
      }
      var m = f ? e._soundById(f) : e._inactiveSound();
      if (!m) return null;
      f && !b && (b = m._sprite || "__default");
      if ("loaded" !== e._state && !e._sprite[b])
        return (
          e._queue.push({
            event: "play",
            action: function () {
              e.play(e._soundById(m._id) ? m._id : void 0);
            },
          }),
          m._id
        );
      if (f && !m._paused)
        return (
          d ||
            setTimeout(function () {
              e._emit("play", m._id);
            }, 0),
          m._id
        );
      e._webAudio && c._autoResume();
      var B = Math.max(0, 0 < m._seek ? m._seek : e._sprite[b][0] / 1e3),
        F = Math.max(0, (e._sprite[b][0] + e._sprite[b][1]) / 1e3 - B),
        E = (1e3 * F) / Math.abs(m._rate);
      m._paused = !1;
      m._ended = !1;
      m._sprite = b;
      m._seek = B;
      m._start = e._sprite[b][0] / 1e3;
      m._stop = (e._sprite[b][0] + e._sprite[b][1]) / 1e3;
      m._loop = !(!m._loop && !e._sprite[b][2]);
      var C = m._node;
      if (e._webAudio)
        (f = function () {
          e._refreshBuffer(m);
          C.gain.setValueAtTime(
            m._muted || e._muted ? 0 : m._volume,
            c.ctx.currentTime
          );
          m._playStart = c.ctx.currentTime;
          "undefined" === typeof C.bufferSource.start
            ? m._loop
              ? C.bufferSource.noteGrainOn(0, B, 86400)
              : C.bufferSource.noteGrainOn(0, B, F)
            : m._loop
            ? C.bufferSource.start(0, B, 86400)
            : C.bufferSource.start(0, B, F);
          Infinity !== E &&
            (e._endTimers[m._id] = setTimeout(e._ended.bind(e, m), E));
          d ||
            setTimeout(function () {
              e._emit("play", m._id);
            }, 0);
        }),
          (j = "running" === c.state),
          "loaded" === e._state && j
            ? f()
            : (e.once(j ? "load" : "resume", f, j ? m._id : null),
              e._clearTimer(m._id));
      else {
        var Y = function () {
            C.currentTime = B;
            C.muted = m._muted || e._muted || c._muted || C.muted;
            C.volume = m._volume * c.volume();
            C.playbackRate = m._rate;
            setTimeout(function () {
              C.play();
              Infinity !== E &&
                (e._endTimers[m._id] = setTimeout(e._ended.bind(e, m), E));
              d || e._emit("play", m._id);
            }, 0);
          },
          f =
            "loaded" === e._state &&
            ((window && window.ejecta) ||
              (!C.readyState && c._navigator.isCocoonJS));
        if (4 === C.readyState || f) Y();
        else {
          var ca = function () {
            Y();
            C.removeEventListener(c._canPlayEvent, ca, !1);
          };
          C.addEventListener(c._canPlayEvent, ca, !1);
          e._clearTimer(m._id);
        }
      }
      return m._id;
    },
    pause: function (b, c) {
      var d = this;
      if ("loaded" !== d._state)
        return (
          d._queue.push({
            event: "pause",
            action: function () {
              d.pause(b);
            },
          }),
          d
        );
      for (var e = d._getSoundIds(b), f = 0; f < e.length; f++) {
        d._clearTimer(e[f]);
        var j = d._soundById(e[f]);
        if (
          j &&
          !j._paused &&
          ((j._seek = d.seek(e[f])),
          (j._rateSeek = 0),
          (j._paused = !0),
          d._stopFade(e[f]),
          j._node)
        )
          if (d._webAudio) {
            if (!j._node.bufferSource) break;
            "undefined" === typeof j._node.bufferSource.stop
              ? j._node.bufferSource.noteOff(0)
              : j._node.bufferSource.stop(0);
            d._cleanBuffer(j._node);
          } else
            (!isNaN(j._node.duration) || Infinity === j._node.duration) &&
              j._node.pause();
        c || d._emit("pause", j ? j._id : null);
      }
      return d;
    },
    stop: function (b, c) {
      var d = this;
      if ("loaded" !== d._state)
        return (
          d._queue.push({
            event: "stop",
            action: function () {
              d.stop(b);
            },
          }),
          d
        );
      for (var e = d._getSoundIds(b), f = 0; f < e.length; f++) {
        d._clearTimer(e[f]);
        var j = d._soundById(e[f]);
        if (
          j &&
          ((j._seek = j._start || 0),
          (j._rateSeek = 0),
          (j._paused = !0),
          (j._ended = !0),
          d._stopFade(e[f]),
          j._node)
        )
          if (d._webAudio) {
            if (!j._node.bufferSource) {
              c || d._emit("stop", j._id);
              break;
            }
            "undefined" === typeof j._node.bufferSource.stop
              ? j._node.bufferSource.noteOff(0)
              : j._node.bufferSource.stop(0);
            d._cleanBuffer(j._node);
          } else if (!isNaN(j._node.duration) || Infinity === j._node.duration)
            (j._node.currentTime = j._start || 0), j._node.pause();
        j && !c && d._emit("stop", j._id);
      }
      return d;
    },
    mute: function (b, d) {
      var e = this;
      if ("loaded" !== e._state)
        return (
          e._queue.push({
            event: "mute",
            action: function () {
              e.mute(b, d);
            },
          }),
          e
        );
      if ("undefined" === typeof d)
        if ("boolean" === typeof b) e._muted = b;
        else return e._muted;
      for (var f = e._getSoundIds(d), j = 0; j < f.length; j++) {
        var m = e._soundById(f[j]);
        m &&
          ((m._muted = b),
          e._webAudio && m._node
            ? m._node.gain.setValueAtTime(b ? 0 : m._volume, c.ctx.currentTime)
            : m._node && (m._node.muted = c._muted ? !0 : b),
          e._emit("mute", m._id));
      }
      return e;
    },
    volume: function () {
      var b = this,
        d = arguments,
        e,
        f;
      if (0 === d.length) return b._volume;
      1 === d.length || (2 === d.length && "undefined" === typeof d[1])
        ? 0 <= b._getSoundIds().indexOf(d[0])
          ? (f = parseInt(d[0], 10))
          : (e = parseFloat(d[0]))
        : 2 <= d.length && ((e = parseFloat(d[0])), (f = parseInt(d[1], 10)));
      var j;
      if ("undefined" !== typeof e && 0 <= e && 1 >= e) {
        if ("loaded" !== b._state)
          return (
            b._queue.push({
              event: "volume",
              action: function () {
                b.volume.apply(b, d);
              },
            }),
            b
          );
        "undefined" === typeof f && (b._volume = e);
        f = b._getSoundIds(f);
        for (var m = 0; m < f.length; m++)
          if ((j = b._soundById(f[m])))
            (j._volume = e),
              d[2] || b._stopFade(f[m]),
              b._webAudio && j._node && !j._muted
                ? j._node.gain.setValueAtTime(e, c.ctx.currentTime)
                : j._node && !j._muted && (j._node.volume = e * c.volume()),
              b._emit("volume", j._id);
      } else return (j = f ? b._soundById(f) : b._sounds[0]) ? j._volume : 0;
      return b;
    },
    fade: function (b, d, e, f) {
      var j = this,
        m = Math.abs(b - d),
        q = b > d ? "out" : "in",
        B = m / 0.01,
        m = 0 < B ? e / B : e;
      4 > m && ((B = Math.ceil(B / (4 / m))), (m = 4));
      if ("loaded" !== j._state)
        return (
          j._queue.push({
            event: "fade",
            action: function () {
              j.fade(b, d, e, f);
            },
          }),
          j
        );
      j.volume(b, f);
      for (var F = j._getSoundIds(f), E = 0; E < F.length; E++) {
        var C = j._soundById(F[E]);
        if (C) {
          f || j._stopFade(F[E]);
          if (j._webAudio && !C._muted) {
            var Y = c.ctx.currentTime,
              ca = Y + e / 1e3;
            C._volume = b;
            C._node.gain.setValueAtTime(b, Y);
            C._node.gain.linearRampToValueAtTime(d, ca);
          }
          var G = b;
          C._interval = setInterval(
            function (b, c) {
              0 < B && (G += "in" === q ? 0.01 : -0.01);
              G = Math.max(0, G);
              G = Math.min(1, G);
              G = Math.round(100 * G) / 100;
              j._webAudio
                ? ("undefined" === typeof f && (j._volume = G), (c._volume = G))
                : j.volume(G, b, !0);
              G === d &&
                (clearInterval(c._interval),
                (c._interval = null),
                j.volume(G, b),
                j._emit("fade", b));
            }.bind(j, F[E], C),
            m
          );
        }
      }
      return j;
    },
    _stopFade: function (b) {
      var d = this._soundById(b);
      d &&
        d._interval &&
        (this._webAudio &&
          d._node.gain.cancelScheduledValues(c.ctx.currentTime),
        clearInterval(d._interval),
        (d._interval = null),
        this._emit("fade", b));
      return this;
    },
    loop: function () {
      var b = arguments,
        c,
        d;
      if (0 === b.length) return this._loop;
      if (1 === b.length)
        if ("boolean" === typeof b[0]) this._loop = c = b[0];
        else return (b = this._soundById(parseInt(b[0], 10))) ? b._loop : !1;
      else 2 === b.length && ((c = b[0]), (d = parseInt(b[1], 10)));
      d = this._getSoundIds(d);
      for (var e = 0; e < d.length; e++)
        if ((b = this._soundById(d[e])))
          if (
            ((b._loop = c),
            this._webAudio &&
              b._node &&
              b._node.bufferSource &&
              (b._node.bufferSource.loop = c))
          )
            (b._node.bufferSource.loopStart = b._start || 0),
              (b._node.bufferSource.loopEnd = b._stop);
      return this;
    },
    rate: function () {
      var b = this,
        d = arguments,
        e,
        f;
      0 === d.length
        ? (f = b._sounds[0]._id)
        : 1 === d.length
        ? 0 <= b._getSoundIds().indexOf(d[0])
          ? (f = parseInt(d[0], 10))
          : (e = parseFloat(d[0]))
        : 2 === d.length && ((e = parseFloat(d[0])), (f = parseInt(d[1], 10)));
      var j;
      if ("number" === typeof e) {
        if ("loaded" !== b._state)
          return (
            b._queue.push({
              event: "rate",
              action: function () {
                b.rate.apply(b, d);
              },
            }),
            b
          );
        "undefined" === typeof f && (b._rate = e);
        f = b._getSoundIds(f);
        for (var m = 0; m < f.length; m++)
          if ((j = b._soundById(f[m]))) {
            j._rateSeek = b.seek(f[m]);
            j._playStart = b._webAudio ? c.ctx.currentTime : j._playStart;
            j._rate = e;
            b._webAudio && j._node && j._node.bufferSource
              ? (j._node.bufferSource.playbackRate.value = e)
              : j._node && (j._node.playbackRate = e);
            var q = b.seek(f[m]),
              q =
                (1e3 *
                  ((b._sprite[j._sprite][0] + b._sprite[j._sprite][1]) / 1e3 -
                    q)) /
                Math.abs(j._rate);
            if (b._endTimers[f[m]] || !j._paused)
              b._clearTimer(f[m]),
                (b._endTimers[f[m]] = setTimeout(b._ended.bind(b, j), q));
            b._emit("rate", j._id);
          }
      } else return (j = b._soundById(f)) ? j._rate : b._rate;
      return b;
    },
    seek: function () {
      var b = this,
        d = arguments,
        e,
        f;
      0 === d.length
        ? (f = b._sounds[0]._id)
        : 1 === d.length
        ? 0 <= b._getSoundIds().indexOf(d[0])
          ? (f = parseInt(d[0], 10))
          : ((f = b._sounds[0]._id), (e = parseFloat(d[0])))
        : 2 === d.length && ((e = parseFloat(d[0])), (f = parseInt(d[1], 10)));
      if ("undefined" === typeof f) return b;
      if ("loaded" !== b._state)
        return (
          b._queue.push({
            event: "seek",
            action: function () {
              b.seek.apply(b, d);
            },
          }),
          b
        );
      var j = b._soundById(f);
      if (j)
        if ("number" === typeof e && 0 <= e) {
          var m = b.playing(f);
          m && b.pause(f, !0);
          j._seek = e;
          j._ended = !1;
          b._clearTimer(f);
          m && b.play(f, !0);
          !b._webAudio && j._node && (j._node.currentTime = e);
          b._emit("seek", f);
        } else
          return b._webAudio
            ? ((e = b.playing(f) ? c.ctx.currentTime - j._playStart : 0),
              j._seek +
                ((j._rateSeek ? j._rateSeek - j._seek : 0) +
                  e * Math.abs(j._rate)))
            : j._node.currentTime;
      return b;
    },
    playing: function (b) {
      if ("number" === typeof b)
        return (b = this._soundById(b)) ? !b._paused : !1;
      for (b = 0; b < this._sounds.length; b++)
        if (!this._sounds[b]._paused) return !0;
      return !1;
    },
    duration: function (b) {
      var c = this._duration;
      (b = this._soundById(b)) && (c = this._sprite[b._sprite][1] / 1e3);
      return c;
    },
    state: function () {
      return this._state;
    },
    unload: function () {
      for (var b = this._sounds, d = 0; d < b.length; d++) {
        b[d]._paused || (this.stop(b[d]._id), this._emit("end", b[d]._id));
        this._webAudio ||
          ((b[d]._node.src =
            "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="),
          b[d]._node.removeEventListener("error", b[d]._errorFn, !1),
          b[d]._node.removeEventListener(c._canPlayEvent, b[d]._loadFn, !1));
        delete b[d]._node;
        this._clearTimer(b[d]._id);
        var e = c._howls.indexOf(this);
        0 <= e && c._howls.splice(e, 1);
      }
      b = !0;
      for (d = 0; d < c._howls.length; d++)
        if (c._howls[d]._src === this._src) {
          b = !1;
          break;
        }
      f && b && delete f[this._src];
      c.noAudio = !1;
      this._state = "unloaded";
      this._sounds = [];
      return null;
    },
    on: function (b, c, d, e) {
      b = this["_on" + b];
      "function" === typeof c &&
        b.push(e ? { id: d, fn: c, once: e } : { id: d, fn: c });
      return this;
    },
    off: function (b, c, d) {
      var e = this["_on" + b],
        f = 0;
      if (c)
        for (f = 0; f < e.length; f++) {
          if (c === e[f].fn && d === e[f].id) {
            e.splice(f, 1);
            break;
          }
        }
      else if (b) this["_on" + b] = [];
      else {
        b = Object.keys(this);
        for (f = 0; f < b.length; f++)
          0 === b[f].indexOf("_on") &&
            Array.isArray(this[b[f]]) &&
            (this[b[f]] = []);
      }
      return this;
    },
    once: function (b, c, d) {
      this.on(b, c, d, 1);
      return this;
    },
    _emit: function (b, c, d) {
      for (var e = this["_on" + b], f = e.length - 1; 0 <= f; f--)
        if (!e[f].id || e[f].id === c || "load" === b)
          setTimeout(
            function (b) {
              b.call(this, c, d);
            }.bind(this, e[f].fn),
            0
          ),
            e[f].once && this.off(b, e[f].fn, e[f].id);
      return this;
    },
    _loadQueue: function () {
      var b = this;
      if (0 < b._queue.length) {
        var c = b._queue[0];
        b.once(c.event, function () {
          b._queue.shift();
          b._loadQueue();
        });
        c.action();
      }
      return b;
    },
    _ended: function (b) {
      var d = b._sprite,
        d = !(!b._loop && !this._sprite[d][2]);
      this._emit("end", b._id);
      !this._webAudio && d && this.stop(b._id, !0).play(b._id);
      if (this._webAudio && d) {
        this._emit("play", b._id);
        b._seek = b._start || 0;
        b._rateSeek = 0;
        b._playStart = c.ctx.currentTime;
        var e = (1e3 * (b._stop - b._start)) / Math.abs(b._rate);
        this._endTimers[b._id] = setTimeout(this._ended.bind(this, b), e);
      }
      this._webAudio &&
        !d &&
        ((b._paused = !0),
        (b._ended = !0),
        (b._seek = b._start || 0),
        (b._rateSeek = 0),
        this._clearTimer(b._id),
        this._cleanBuffer(b._node),
        c._autoSuspend());
      !this._webAudio && !d && this.stop(b._id);
      return this;
    },
    _clearTimer: function (b) {
      this._endTimers[b] &&
        (clearTimeout(this._endTimers[b]), delete this._endTimers[b]);
      return this;
    },
    _soundById: function (b) {
      for (var c = 0; c < this._sounds.length; c++)
        if (b === this._sounds[c]._id) return this._sounds[c];
      return null;
    },
    _inactiveSound: function () {
      this._drain();
      for (var b = 0; b < this._sounds.length; b++)
        if (this._sounds[b]._ended) return this._sounds[b].reset();
      return new e(this);
    },
    _drain: function () {
      var b = this._pool,
        c = 0,
        d = 0;
      if (!(this._sounds.length < b)) {
        for (d = 0; d < this._sounds.length; d++) this._sounds[d]._ended && c++;
        for (d = this._sounds.length - 1; 0 <= d && !(c <= b); d--)
          this._sounds[d]._ended &&
            (this._webAudio &&
              this._sounds[d]._node &&
              this._sounds[d]._node.disconnect(0),
            this._sounds.splice(d, 1),
            c--);
      }
    },
    _getSoundIds: function (b) {
      if ("undefined" === typeof b) {
        b = [];
        for (var c = 0; c < this._sounds.length; c++)
          b.push(this._sounds[c]._id);
        return b;
      }
      return [b];
    },
    _refreshBuffer: function (b) {
      b._node.bufferSource = c.ctx.createBufferSource();
      b._node.bufferSource.buffer = f[this._src];
      b._panner
        ? b._node.bufferSource.connect(b._panner)
        : b._node.bufferSource.connect(b._node);
      if ((b._node.bufferSource.loop = b._loop))
        (b._node.bufferSource.loopStart = b._start || 0),
          (b._node.bufferSource.loopEnd = b._stop);
      b._node.bufferSource.playbackRate.value = b._rate;
      return this;
    },
    _cleanBuffer: function (b) {
      if (this._scratchBuffer) {
        b.bufferSource.onended = null;
        b.bufferSource.disconnect(0);
        try {
          b.bufferSource.buffer = this._scratchBuffer;
        } catch (c) {}
      }
      b.bufferSource = null;
      return this;
    },
  };
  var e = function (b) {
    this._parent = b;
    this.init();
  };
  e.prototype = {
    init: function () {
      var b = this._parent;
      this._muted = b._muted;
      this._loop = b._loop;
      this._volume = b._volume;
      this._muted = b._muted;
      this._rate = b._rate;
      this._seek = 0;
      this._ended = this._paused = !0;
      this._sprite = "__default";
      this._id = Math.round(Date.now() * Math.random());
      b._sounds.push(this);
      this.create();
      return this;
    },
    create: function () {
      var b = this._parent,
        d = c._muted || this._muted || this._parent._muted ? 0 : this._volume;
      b._webAudio
        ? ((this._node =
            "undefined" === typeof c.ctx.createGain
              ? c.ctx.createGainNode()
              : c.ctx.createGain()),
          this._node.gain.setValueAtTime(d, c.ctx.currentTime),
          (this._node.paused = !0),
          this._node.connect(c.masterGain))
        : ((this._node = new Audio()),
          (this._errorFn = this._errorListener.bind(this)),
          this._node.addEventListener("error", this._errorFn, !1),
          (this._loadFn = this._loadListener.bind(this)),
          this._node.addEventListener(c._canPlayEvent, this._loadFn, !1),
          (this._node.src = b._src),
          (this._node.preload = "auto"),
          (this._node.volume = d * c.volume()),
          this._node.load());
      return this;
    },
    reset: function () {
      var b = this._parent;
      this._muted = b._muted;
      this._loop = b._loop;
      this._volume = b._volume;
      this._muted = b._muted;
      this._rate = b._rate;
      this._rateSeek = this._seek = 0;
      this._ended = this._paused = !0;
      this._sprite = "__default";
      this._id = Math.round(Date.now() * Math.random());
      return this;
    },
    _errorListener: function () {
      this._parent._emit(
        "loaderror",
        this._id,
        this._node.error ? this._node.error.code : 0
      );
      this._node.removeEventListener("error", this._errorListener, !1);
    },
    _loadListener: function () {
      var b = this._parent;
      b._duration = Math.ceil(10 * this._node.duration) / 10;
      0 === Object.keys(b._sprite).length &&
        (b._sprite = { __default: [0, 1e3 * b._duration] });
      "loaded" !== b._state &&
        ((b._state = "loaded"), b._emit("load"), b._loadQueue());
      this._node.removeEventListener(c._canPlayEvent, this._loadFn, !1);
    },
  };
  var f = {},
    j = function (b, d) {
      c.ctx.decodeAudioData(
        b,
        function (b) {
          b && 0 < d._sounds.length && ((f[d._src] = b), m(d, b));
        },
        function () {
          d._emit("loaderror", null, "Decoding audio data failed.");
        }
      );
    },
    m = function (b, c) {
      c && !b._duration && (b._duration = c.duration);
      0 === Object.keys(b._sprite).length &&
        (b._sprite = { __default: [0, 1e3 * b._duration] });
      "loaded" !== b._state &&
        ((b._state = "loaded"), b._emit("load"), b._loadQueue());
    },
    q = function () {
      try {
        "undefined" !== typeof AudioContext
          ? (c.ctx = new AudioContext())
          : "undefined" !== typeof webkitAudioContext
          ? (c.ctx = new webkitAudioContext())
          : (c.usingWebAudio = !1);
      } catch (b) {
        c.usingWebAudio = !1;
      }
      var d = /iP(hone|od|ad)/.test(c._navigator && c._navigator.platform),
        e =
          c._navigator &&
          c._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
        e = e ? parseInt(e[1], 10) : null;
      if (
        d &&
        e &&
        9 > e &&
        ((d = /safari/.test(
          c._navigator && c._navigator.userAgent.toLowerCase()
        )),
        (c._navigator && c._navigator.standalone && !d) ||
          (c._navigator && !c._navigator.standalone && !d))
      )
        c.usingWebAudio = !1;
      c.usingWebAudio &&
        ((c.masterGain =
          "undefined" === typeof c.ctx.createGain
            ? c.ctx.createGainNode()
            : c.ctx.createGain()),
        (c.masterGain.gain.value = 1),
        c.masterGain.connect(c.ctx.destination));
      c._setup();
    };
  "function" === typeof define &&
    define.amd &&
    define([], function () {
      return { Howler: c, Howl: d };
    });
  "undefined" !== typeof exports && ((exports.Howler = c), (exports.Howl = d));
  "undefined" !== typeof window
    ? ((window.HowlerGlobal = b),
      (window.Howler = c),
      (window.Howl = d),
      (window.Sound = e))
    : "undefined" !== typeof global &&
      ((global.HowlerGlobal = b),
      (global.Howler = c),
      (global.Howl = d),
      (global.Sound = e));
})();
(function () {
  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
  HowlerGlobal.prototype.stereo = function (b) {
    if (!this.ctx || !this.ctx.listener) return this;
    for (var c = this._howls.length - 1; 0 <= c; c--) this._howls[c].stereo(b);
    return this;
  };
  HowlerGlobal.prototype.pos = function (b, c, d) {
    if (!this.ctx || !this.ctx.listener) return this;
    c = "number" !== typeof c ? this._pos[1] : c;
    d = "number" !== typeof d ? this._pos[2] : d;
    if ("number" === typeof b)
      (this._pos = [b, c, d]),
        this.ctx.listener.setPosition(this._pos[0], this._pos[1], this._pos[2]);
    else return this._pos;
    return this;
  };
  HowlerGlobal.prototype.orientation = function (b, c, d, e, l, p) {
    if (!this.ctx || !this.ctx.listener) return this;
    var n = this._orientation;
    c = "number" !== typeof c ? n[1] : c;
    d = "number" !== typeof d ? n[2] : d;
    e = "number" !== typeof e ? n[3] : e;
    l = "number" !== typeof l ? n[4] : l;
    p = "number" !== typeof p ? n[5] : p;
    if ("number" === typeof b)
      (this._orientation = [b, c, d, e, l, p]),
        this.ctx.listener.setOrientation(b, c, d, e, l, p);
    else return n;
    return this;
  };
  var b = Howl.prototype.init;
  Howl.prototype.init = function (c) {
    this._orientation = c.orientation || [1, 0, 0];
    this._stereo = c.stereo || null;
    this._pos = c.pos || null;
    this._pannerAttr = {
      coneInnerAngle:
        "undefined" !== typeof c.coneInnerAngle ? c.coneInnerAngle : 360,
      coneOuterAngle:
        "undefined" !== typeof c.coneOuterAngle ? c.coneOuterAngle : 360,
      coneOuterGain:
        "undefined" !== typeof c.coneOuterGain ? c.coneOuterGain : 0,
      distanceModel:
        "undefined" !== typeof c.distanceModel ? c.distanceModel : "inverse",
      maxDistance: "undefined" !== typeof c.maxDistance ? c.maxDistance : 1e4,
      panningModel:
        "undefined" !== typeof c.panningModel ? c.panningModel : "HRTF",
      refDistance: "undefined" !== typeof c.refDistance ? c.refDistance : 1,
      rolloffFactor:
        "undefined" !== typeof c.rolloffFactor ? c.rolloffFactor : 1,
    };
    this._onstereo = c.onstereo ? [{ fn: c.onstereo }] : [];
    this._onpos = c.onpos ? [{ fn: c.onpos }] : [];
    this._onorientation = c.onorientation ? [{ fn: c.onorientation }] : [];
    return b.call(this, c);
  };
  Howl.prototype.stereo = function (b, c) {
    var d = this;
    if (!d._webAudio) return d;
    if ("loaded" !== d._state)
      return (
        d._queue.push({
          event: "stereo",
          action: function () {
            d.stereo(b, c);
          },
        }),
        d
      );
    var q =
      "undefined" === typeof Howler.ctx.createStereoPanner
        ? "spatial"
        : "stereo";
    if ("undefined" === typeof c)
      if ("number" === typeof b) (d._stereo = b), (d._pos = [b, 0, 0]);
      else return d._stereo;
    for (var l = d._getSoundIds(c), p = 0; p < l.length; p++) {
      var n = d._soundById(l[p]);
      if (n)
        if ("number" === typeof b)
          (n._stereo = b),
            (n._pos = [b, 0, 0]),
            n._node &&
              ((n._pannerAttr.panningModel = "equalpower"),
              (!n._panner || !n._panner.pan) && e(n, q),
              "spatial" === q
                ? n._panner.setPosition(b, 0, 0)
                : (n._panner.pan.value = b)),
            d._emit("stereo", n._id);
        else return n._stereo;
    }
    return d;
  };
  Howl.prototype.pos = function (b, c, d, q) {
    var l = this;
    if (!l._webAudio) return l;
    if ("loaded" !== l._state)
      return (
        l._queue.push({
          event: "pos",
          action: function () {
            l.pos(b, c, d, q);
          },
        }),
        l
      );
    c = "number" !== typeof c ? 0 : c;
    d = "number" !== typeof d ? -0.5 : d;
    if ("undefined" === typeof q)
      if ("number" === typeof b) l._pos = [b, c, d];
      else return l._pos;
    for (var p = l._getSoundIds(q), n = 0; n < p.length; n++) {
      var s = l._soundById(p[n]);
      if (s)
        if ("number" === typeof b)
          (s._pos = [b, c, d]),
            s._node &&
              ((!s._panner || s._panner.pan) && e(s, "spatial"),
              s._panner.setPosition(b, c, d)),
            l._emit("pos", s._id);
        else return s._pos;
    }
    return l;
  };
  Howl.prototype.orientation = function (b, c, d, q) {
    var l = this;
    if (!l._webAudio) return l;
    if ("loaded" !== l._state)
      return (
        l._queue.push({
          event: "orientation",
          action: function () {
            l.orientation(b, c, d, q);
          },
        }),
        l
      );
    c = "number" !== typeof c ? l._orientation[1] : c;
    d = "number" !== typeof d ? l._orientation[2] : d;
    if ("undefined" === typeof q)
      if ("number" === typeof b) l._orientation = [b, c, d];
      else return l._orientation;
    for (var p = l._getSoundIds(q), n = 0; n < p.length; n++) {
      var s = l._soundById(p[n]);
      if (s)
        if ("number" === typeof b)
          (s._orientation = [b, c, d]),
            s._node &&
              (s._panner ||
                (s._pos || (s._pos = l._pos || [0, 0, -0.5]), e(s, "spatial")),
              s._panner.setOrientation(b, c, d)),
            l._emit("orientation", s._id);
        else return s._orientation;
    }
    return l;
  };
  Howl.prototype.pannerAttr = function () {
    var b = arguments,
      c,
      d;
    if (!this._webAudio) return this;
    if (0 === b.length) return this._pannerAttr;
    if (1 === b.length)
      if ("object" === typeof b[0])
        (c = b[0]),
          "undefined" === typeof d &&
            (this._pannerAttr = {
              coneInnerAngle:
                "undefined" !== typeof c.coneInnerAngle
                  ? c.coneInnerAngle
                  : this._coneInnerAngle,
              coneOuterAngle:
                "undefined" !== typeof c.coneOuterAngle
                  ? c.coneOuterAngle
                  : this._coneOuterAngle,
              coneOuterGain:
                "undefined" !== typeof c.coneOuterGain
                  ? c.coneOuterGain
                  : this._coneOuterGain,
              distanceModel:
                "undefined" !== typeof c.distanceModel
                  ? c.distanceModel
                  : this._distanceModel,
              maxDistance:
                "undefined" !== typeof c.maxDistance
                  ? c.maxDistance
                  : this._maxDistance,
              panningModel:
                "undefined" !== typeof c.panningModel
                  ? c.panningModel
                  : this._panningModel,
              refDistance:
                "undefined" !== typeof c.refDistance
                  ? c.refDistance
                  : this._refDistance,
              rolloffFactor:
                "undefined" !== typeof c.rolloffFactor
                  ? c.rolloffFactor
                  : this._rolloffFactor,
            });
      else
        return (b = this._soundById(parseInt(b[0], 10)))
          ? b._pannerAttr
          : this._pannerAttr;
    else 2 === b.length && ((c = b[0]), (d = parseInt(b[1], 10)));
    d = this._getSoundIds(d);
    for (var q = 0; q < d.length; q++)
      if ((b = this._soundById(d[q]))) {
        var l = b._pannerAttr,
          l = {
            coneInnerAngle:
              "undefined" !== typeof c.coneInnerAngle
                ? c.coneInnerAngle
                : l.coneInnerAngle,
            coneOuterAngle:
              "undefined" !== typeof c.coneOuterAngle
                ? c.coneOuterAngle
                : l.coneOuterAngle,
            coneOuterGain:
              "undefined" !== typeof c.coneOuterGain
                ? c.coneOuterGain
                : l.coneOuterGain,
            distanceModel:
              "undefined" !== typeof c.distanceModel
                ? c.distanceModel
                : l.distanceModel,
            maxDistance:
              "undefined" !== typeof c.maxDistance
                ? c.maxDistance
                : l.maxDistance,
            panningModel:
              "undefined" !== typeof c.panningModel
                ? c.panningModel
                : l.panningModel,
            refDistance:
              "undefined" !== typeof c.refDistance
                ? c.refDistance
                : l.refDistance,
            rolloffFactor:
              "undefined" !== typeof c.rolloffFactor
                ? c.rolloffFactor
                : l.rolloffFactor,
          },
          p = b._panner;
        p
          ? ((p.coneInnerAngle = l.coneInnerAngle),
            (p.coneOuterAngle = l.coneOuterAngle),
            (p.coneOuterGain = l.coneOuterGain),
            (p.distanceModel = l.distanceModel),
            (p.maxDistance = l.maxDistance),
            (p.panningModel = l.panningModel),
            (p.refDistance = l.refDistance),
            (p.rolloffFactor = l.rolloffFactor))
          : (b._pos || (b._pos = this._pos || [0, 0, -0.5]), e(b, "spatial"));
      }
    return this;
  };
  var c = Sound.prototype.init;
  Sound.prototype.init = function () {
    var b = this._parent;
    this._orientation = b._orientation;
    this._stereo = b._stereo;
    this._pos = b._pos;
    this._pannerAttr = b._pannerAttr;
    c.call(this);
    this._stereo
      ? b.stereo(this._stereo)
      : this._pos && b.pos(this._pos[0], this._pos[1], this._pos[2], this._id);
  };
  var d = Sound.prototype.reset;
  Sound.prototype.reset = function () {
    var b = this._parent;
    this._orientation = b._orientation;
    this._pos = b._pos;
    this._pannerAttr = b._pannerAttr;
    return d.call(this);
  };
  var e = function (b, c) {
    "spatial" === (c || "spatial")
      ? ((b._panner = Howler.ctx.createPanner()),
        (b._panner.coneInnerAngle = b._pannerAttr.coneInnerAngle),
        (b._panner.coneOuterAngle = b._pannerAttr.coneOuterAngle),
        (b._panner.coneOuterGain = b._pannerAttr.coneOuterGain),
        (b._panner.distanceModel = b._pannerAttr.distanceModel),
        (b._panner.maxDistance = b._pannerAttr.maxDistance),
        (b._panner.panningModel = b._pannerAttr.panningModel),
        (b._panner.refDistance = b._pannerAttr.refDistance),
        (b._panner.rolloffFactor = b._pannerAttr.rolloffFactor),
        b._panner.setPosition(b._pos[0], b._pos[1], b._pos[2]),
        b._panner.setOrientation(
          b._orientation[0],
          b._orientation[1],
          b._orientation[2]
        ))
      : ((b._panner = Howler.ctx.createStereoPanner()),
        (b._panner.pan.value = b._stereo));
    b._panner.connect(b._node);
    b._paused || b._parent.pause(b._id, !0).play(b._id);
  };
})();
(function (b) {
  Number.prototype.map = function (b, c, d, e) {
    return d + (e - d) * ((this - b) / (c - b));
  };
  Number.prototype.limit = function (b, c) {
    return Math.min(c, Math.max(b, this));
  };
  Number.prototype.round = function (b) {
    b = Math.pow(10, b || 0);
    return Math.round(this * b) / b;
  };
  Number.prototype.floor = function () {
    return Math.floor(this);
  };
  Number.prototype.ceil = function () {
    return Math.ceil(this);
  };
  Number.prototype.toInt = function () {
    return this | 0;
  };
  Number.prototype.toRad = function () {
    return (this / 180) * Math.PI;
  };
  Number.prototype.toDeg = function () {
    return (180 * this) / Math.PI;
  };
  Array.prototype.erase = function (b) {
    for (var c = this.length; c--; ) this[c] === b && this.splice(c, 1);
    return this;
  };
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };
  Function.prototype.bind =
    Function.prototype.bind ||
    function (b) {
      var c = this;
      return function () {
        var d = Array.prototype.slice.call(arguments);
        return c.apply(b || null, d);
      };
    };
  b.ig = {
    game: null,
    debug: null,
    version: "1.20",
    global: b,
    modules: {},
    resources: [],
    ready: !1,
    baked: !1,
    nocache: "",
    ua: {},
    prefix: b.ImpactPrefix || "",
    lib: "lib/",
    _current: null,
    _loadQueue: [],
    _waitForOnload: 0,
    $: function (b) {
      return "#" == b.charAt(0)
        ? document.getElementById(b.substr(1))
        : document.getElementsByTagName(b);
    },
    $new: function (b) {
      return document.createElement(b);
    },
    copy: function (b) {
      if (
        !b ||
        "object" != typeof b ||
        b instanceof HTMLElement ||
        b instanceof ig.Class
      )
        return b;
      if (b instanceof Array)
        for (var c = [], d = 0, e = b.length; d < e; d++) c[d] = ig.copy(b[d]);
      else for (d in ((c = {}), b)) c[d] = ig.copy(b[d]);
      return c;
    },
    merge: function (b, c) {
      for (var d in c) {
        var e = c[d];
        if (
          "object" != typeof e ||
          e instanceof HTMLElement ||
          e instanceof ig.Class
        )
          b[d] = e;
        else {
          if (!b[d] || "object" != typeof b[d])
            b[d] = e instanceof Array ? [] : {};
          ig.merge(b[d], e);
        }
      }
      return b;
    },
    ksort: function (b) {
      if (!b || "object" != typeof b) return [];
      var c = [],
        d = [],
        e;
      for (e in b) c.push(e);
      c.sort();
      for (e = 0; e < c.length; e++) d.push(b[c[e]]);
      return d;
    },
    setVendorAttribute: function (b, c, d) {
      var e = c.charAt(0).toUpperCase() + c.substr(1);
      b[c] = b["ms" + e] = b["moz" + e] = b["webkit" + e] = b["o" + e] = d;
    },
    getVendorAttribute: function (b, c) {
      var d = c.charAt(0).toUpperCase() + c.substr(1);
      return (
        b[c] || b["ms" + d] || b["moz" + d] || b["webkit" + d] || b["o" + d]
      );
    },
    normalizeVendorAttribute: function (b, c) {
      var d = ig.getVendorAttribute(b, c);
      !b[c] && d && (b[c] = d);
    },
    getImagePixels: function (b, c, d, e, f) {
      var j = ig.$new("canvas");
      j.width = b.width;
      j.height = b.height;
      var m = j.getContext("2d");
      ig.System.SCALE.CRISP(j, m);
      var q = ig.getVendorAttribute(m, "backingStorePixelRatio") || 1;
      ig.normalizeVendorAttribute(m, "getImageDataHD");
      var F = b.width / q,
        E = b.height / q;
      j.width = Math.ceil(F);
      j.height = Math.ceil(E);
      m.drawImage(b, 0, 0, F, E);
      return 1 === q
        ? m.getImageData(c, d, e, f)
        : m.getImageDataHD(c, d, e, f);
    },
    module: function (b) {
      if (ig._current)
        throw "Module '" + ig._current.name + "' defines nothing";
      if (ig.modules[b] && ig.modules[b].body)
        throw "Module '" + b + "' is already defined";
      ig._current = { name: b, requires: [], loaded: !1, body: null };
      ig.modules[b] = ig._current;
      ig._loadQueue.push(ig._current);
      return ig;
    },
    requires: function () {
      ig._current.requires = Array.prototype.slice.call(arguments);
      return ig;
    },
    defines: function (b) {
      ig._current.body = b;
      ig._current = null;
      ig._initDOMReady();
    },
    addResource: function (b) {
      ig.resources.push(b);
    },
    setNocache: function (b) {
      ig.nocache = b ? "?" + Date.now() : "";
    },
    log: function () {},
    assert: function () {},
    show: function () {},
    mark: function () {},
    _loadScript: function (b, c) {
      ig.modules[b] = { name: b, requires: [], loaded: !1, body: null };
      ig._waitForOnload++;
      var d = ig.prefix + ig.lib + b.replace(/\./g, "/") + ".js" + ig.nocache,
        e = ig.$new("script");
      e.type = "text/javascript";
      e.src = d;
      e.onload = function () {
        ig._waitForOnload--;
        ig._execModules();
      };
      e.onerror = function () {
        throw "Failed to load module " + b + " at " + d + " required from " + c;
      };
      ig.$("head")[0].appendChild(e);
    },
    _execModules: function () {
      for (var b = !1, c = 0; c < ig._loadQueue.length; c++) {
        for (
          var d = ig._loadQueue[c], e = !0, f = 0;
          f < d.requires.length;
          f++
        ) {
          var j = d.requires[f];
          ig.modules[j]
            ? ig.modules[j].loaded || (e = !1)
            : ((e = !1), ig._loadScript(j, d.name));
        }
        e &&
          d.body &&
          (ig._loadQueue.splice(c, 1),
          (d.loaded = !0),
          d.body(),
          (b = !0),
          c--);
      }
      if (b) ig._execModules();
      else if (
        !ig.baked &&
        0 == ig._waitForOnload &&
        0 != ig._loadQueue.length
      ) {
        b = [];
        for (c = 0; c < ig._loadQueue.length; c++) {
          e = [];
          j = ig._loadQueue[c].requires;
          for (f = 0; f < j.length; f++)
            (d = ig.modules[j[f]]), (!d || !d.loaded) && e.push(j[f]);
          b.push(ig._loadQueue[c].name + " (requires: " + e.join(", ") + ")");
        }
        throw (
          "Unresolved (circular?) dependencies. Most likely there's a name/path mismatch for one of the listed modules:\n" +
          b.join("\n")
        );
      }
    },
    _DOMReady: function () {
      if (!ig.modules["dom.ready"].loaded) {
        if (!document.body) return setTimeout(ig._DOMReady, 13);
        ig.modules["dom.ready"].loaded = !0;
        ig._waitForOnload--;
        ig._execModules();
      }
      return 0;
    },
    _boot: function () {
      document.location.href.match(/\?nocache/) && ig.setNocache(!0);
      ig.ua.pixelRatio = b.devicePixelRatio || 1;
      ig.ua.viewport = { width: b.innerWidth, height: b.innerHeight };
      ig.ua.screen = {
        width: b.screen.availWidth * ig.ua.pixelRatio,
        height: b.screen.availHeight * ig.ua.pixelRatio,
      };
      ig.ua.iPhone = /iPhone/i.test(navigator.userAgent);
      ig.ua.iPhone4 = ig.ua.iPhone && 2 == ig.ua.pixelRatio;
      ig.ua.iPad = /iPad/i.test(navigator.userAgent);
      ig.ua.android = /android/i.test(navigator.userAgent);
      ig.ua.is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
        navigator.userAgent
      );
      ig.ua.is_safari_or_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit/i.test(
        navigator.userAgent
      );
      ig.ua.iOS = ig.ua.iPhone || ig.ua.iPad;
      ig.ua.iOS6_tag = /OS 6_/i.test(navigator.userAgent);
      ig.ua.iOS6 = (ig.ua.iPhone || ig.ua.iPad) && ig.ua.iOS6_tag;
      ig.ua.iOSgt5 =
        ig.ua.iOS &&
        5 < parseInt(navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1]);
      ig.ua.HTCONE = /HTC_One/i.test(navigator.userAgent);
      ig.ua.winPhone = /Windows Phone/i.test(navigator.userAgent);
      ig.ua.Kindle = /Silk/i.test(navigator.userAgent);
      ig.ua.touchDevice = "ontouchstart" in b || b.navigator.msMaxTouchPoints;
      ig.ua.mobile =
        ig.ua.iOS ||
        ig.ua.android ||
        ig.ua.iOS6 ||
        ig.ua.winPhone ||
        ig.ua.Kindle ||
        /mobile/i.test(navigator.userAgent);
    },
    _initDOMReady: function () {
      ig.modules["dom.ready"]
        ? ig._execModules()
        : (ig._boot(),
          (ig.modules["dom.ready"] = { requires: [], loaded: !1, body: null }),
          ig._waitForOnload++,
          "complete" === document.readyState
            ? ig._DOMReady()
            : (document.addEventListener("DOMContentLoaded", ig._DOMReady, !1),
              b.addEventListener("load", ig._DOMReady, !1)));
    },
  };
  for (
    var c = ["ms", "moz", "webkit", "o"], d = 0;
    d < c.length && !b.requestAnimationFrame;
    d++
  )
    b.requestAnimationFrame = b[c[d] + "RequestAnimationFrame"];
  if (b.requestAnimationFrame) {
    var e = 1,
      f = {};
    b.ig.setAnimation = function (c, d) {
      var j = e++;
      f[j] = !0;
      var m = function () {
        f[j] && (b.requestAnimationFrame(m, d), c());
      };
      b.requestAnimationFrame(m, d);
      return j;
    };
    b.ig.clearAnimation = function (b) {
      delete f[b];
    };
  } else
    (b.ig.setAnimation = function (c) {
      return b.setInterval(c, 1e3 / 60);
    }),
      (b.ig.clearAnimation = function (c) {
        b.clearInterval(c);
      });
  var j = !1,
    m = /xyz/.test(function () {
      xyz;
    })
      ? /\bparent\b/
      : /.*/;
  b.ig.Class = function () {};
  var q = function (b) {
    var c = this.prototype,
      d = {},
      e;
    for (e in b)
      "function" == typeof b[e] && "function" == typeof c[e] && m.test(b[e])
        ? ((d[e] = c[e]),
          (c[e] = (function (b, c) {
            return function () {
              var e = this.parent;
              this.parent = d[b];
              var f = c.apply(this, arguments);
              this.parent = e;
              return f;
            };
          })(e, b[e])))
        : (c[e] = b[e]);
  };
  b.ig.Class.extend = function (c) {
    function d() {
      if (!j) {
        if (this.staticInstantiate) {
          var b = this.staticInstantiate.apply(this, arguments);
          if (b) return b;
        }
        for (var c in this)
          "object" == typeof this[c] && (this[c] = ig.copy(this[c]));
        this.init && this.init.apply(this, arguments);
      }
      return this;
    }
    var e = this.prototype;
    j = !0;
    var f = new this();
    j = !1;
    for (var r in c)
      f[r] =
        "function" == typeof c[r] && "function" == typeof e[r] && m.test(c[r])
          ? (function (b, c) {
              return function () {
                var d = this.parent;
                this.parent = e[b];
                var f = c.apply(this, arguments);
                this.parent = d;
                return f;
              };
            })(r, c[r])
          : c[r];
    d.prototype = f;
    d.constructor = d;
    d.extend = b.ig.Class.extend;
    d.inject = q;
    return d;
  };
})(window);
ig.baked = !0;
ig.module("impact.image").defines(function () {
  ig.Image = ig.Class.extend({
    data: null,
    width: 0,
    height: 0,
    loaded: !1,
    failed: !1,
    loadCallback: null,
    path: "",
    staticInstantiate: function (b) {
      return ig.Image.cache[b] || null;
    },
    init: function (b) {
      this.path = b;
      this.load();
    },
    load: function (b) {
      this.loaded
        ? b && b(this.path, !0)
        : (!this.loaded && ig.ready
            ? ((this.loadCallback = b || null),
              (this.data = new Image()),
              (this.data.onload = this.onload.bind(this)),
              (this.data.onerror = this.onerror.bind(this)),
              (this.data.src = ig.prefix + this.path + ig.nocache))
            : ig.addResource(this),
          (ig.Image.cache[this.path] = this));
    },
    reload: function () {
      this.loaded = !1;
      this.data = new Image();
      this.data.onload = this.onload.bind(this);
      this.data.src = this.path + "?" + Date.now();
    },
    onload: function () {
      this.width = this.data.width;
      this.height = this.data.height;
      this.loaded = !0;
      1 != ig.system.scale && this.resize(ig.system.scale);
      this.loadCallback && this.loadCallback(this.path, !0);
    },
    onerror: function () {
      this.failed = !0;
      this.loadCallback && this.loadCallback(this.path, !1);
    },
    resize: function (b) {
      var c = this.width * b,
        d = this.height * b,
        e = ig.$new("canvas");
      e.width = this.width;
      e.height = this.height;
      e = e.getContext("2d");
      e.drawImage(
        this.data,
        0,
        0,
        this.width,
        this.height,
        0,
        0,
        this.width,
        this.height
      );
      var e = e.getImageData(0, 0, this.width, this.height),
        f = ig.$new("canvas");
      f.width = c;
      f.height = d;
      for (
        var j = f.getContext("2d"), m = j.getImageData(0, 0, c, d), q = 0;
        q < d;
        q++
      )
        for (var l = 0; l < c; l++) {
          var p = 4 * (Math.floor(q / b) * this.width + Math.floor(l / b)),
            n = 4 * (q * c + l);
          m.data[n] = e.data[p];
          m.data[n + 1] = e.data[p + 1];
          m.data[n + 2] = e.data[p + 2];
          m.data[n + 3] = e.data[p + 3];
        }
      j.putImageData(m, 0, 0);
      this.data = f;
    },
    draw: function (b, c, d, e, f, j) {
      if (this.loaded) {
        var m = ig.system.scale;
        f = (f ? f : this.width) * m;
        j = (j ? j : this.height) * m;
        ig.system.context.drawImage(
          this.data,
          d ? d * m : 0,
          e ? e * m : 0,
          f,
          j,
          ig.system.getDrawPos(b),
          ig.system.getDrawPos(c),
          f,
          j
        );
        ig.Image.drawCount++;
      }
    },
    drawTile: function (b, c, d, e, f, j, m) {
      f = f ? f : e;
      if (this.loaded && !(e > this.width || f > this.height)) {
        var q = ig.system.scale,
          l = Math.floor(e * q),
          p = Math.floor(f * q),
          n = j ? -1 : 1,
          s = m ? -1 : 1;
        if (j || m) ig.system.context.save(), ig.system.context.scale(n, s);
        ig.system.context.drawImage(
          this.data,
          (Math.floor(d * e) % this.width) * q,
          Math.floor((d * e) / this.width) * f * q,
          l,
          p,
          ig.system.getDrawPos(b) * n - (j ? l : 0),
          ig.system.getDrawPos(c) * s - (m ? p : 0),
          l,
          p
        );
        (j || m) && ig.system.context.restore();
        ig.Image.drawCount++;
      }
    },
  });
  ig.Image.drawCount = 0;
  ig.Image.cache = {};
  ig.Image.reloadCache = function () {
    for (var b in ig.Image.cache) ig.Image.cache[b].reload();
  };
});
ig.baked = !0;
ig.module("impact.font")
  .requires("impact.image")
  .defines(function () {
    ig.Font = ig.Image.extend({
      widthMap: [],
      indices: [],
      firstChar: 32,
      alpha: 1,
      letterSpacing: 1,
      lineSpacing: 0,
      onload: function (b) {
        this._loadMetrics(this.data);
        this.parent(b);
      },
      widthForString: function (b) {
        if (-1 !== b.indexOf("\n")) {
          b = b.split("\n");
          for (var c = 0, d = 0; d < b.length; d++)
            c = Math.max(c, this._widthForLine(b[d]));
          return c;
        }
        return this._widthForLine(b);
      },
      _widthForLine: function (b) {
        for (var c = 0, d = 0; d < b.length; d++)
          c +=
            this.widthMap[b.charCodeAt(d) - this.firstChar] +
            this.letterSpacing;
        return c;
      },
      heightForString: function (b) {
        return b.split("\n").length * (this.height + this.lineSpacing);
      },
      draw: function (b, c, d, e) {
        "string" != typeof b && (b = b.toString());
        if (-1 !== b.indexOf("\n")) {
          b = b.split("\n");
          for (var f = this.height + this.lineSpacing, j = 0; j < b.length; j++)
            this.draw(b[j], c, d + j * f, e);
        } else {
          if (e == ig.Font.ALIGN.RIGHT || e == ig.Font.ALIGN.CENTER)
            (j = this._widthForLine(b)),
              (c -= e == ig.Font.ALIGN.CENTER ? j / 2 : j);
          1 !== this.alpha && (ig.system.context.globalAlpha = this.alpha);
          for (j = 0; j < b.length; j++)
            (e = b.charCodeAt(j)),
              (c += this._drawChar(e - this.firstChar, c, d));
          1 !== this.alpha && (ig.system.context.globalAlpha = 1);
          ig.Image.drawCount += b.length;
        }
      },
      _drawChar: function (b, c, d) {
        if (!this.loaded || 0 > b || b >= this.indices.length) return 0;
        var e = ig.system.scale,
          f = this.widthMap[b] * e,
          j = (this.height - 2) * e;
        ig.system.context.drawImage(
          this.data,
          this.indices[b] * e,
          0,
          f,
          j,
          ig.system.getDrawPos(c),
          ig.system.getDrawPos(d),
          f,
          j
        );
        return this.widthMap[b] + this.letterSpacing;
      },
      _loadMetrics: function (b) {
        this.height = b.height - 1;
        this.widthMap = [];
        this.indices = [];
        for (
          var c = ig.getImagePixels(b, 0, b.height - 1, b.width, 1),
            d = 0,
            e = 0,
            f = 0;
          f < b.width;
          f++
        ) {
          var j = 4 * f + 3;
          0 != c.data[j]
            ? e++
            : 0 == c.data[j] &&
              e &&
              (this.widthMap.push(e), this.indices.push(f - e), d++, (e = 0));
        }
        this.widthMap.push(e);
        this.indices.push(f - e);
      },
    });
    ig.Font.ALIGN = { LEFT: 0, RIGHT: 1, CENTER: 2 };
  });
ig.baked = !0;
ig.module("impact.sound").defines(function () {
  ig.SoundManager = ig.Class.extend({
    clips: {},
    volume: 1,
    format: null,
    init: function () {
      for (var b = new Audio(), c = 0; c < ig.Sound.use.length; c++) {
        var d = ig.Sound.use[c];
        if (b.canPlayType(d.mime)) {
          this.format = d;
          break;
        }
      }
      this.format || (ig.Sound.enabled = !1);
    },
    load: function (b, c, d) {
      var e = ig.prefix + b.replace(/[^\.]+$/, this.format.ext) + ig.nocache;
      if (this.clips[b]) {
        if (c && this.clips[b].length < ig.Sound.channels)
          for (c = this.clips[b].length; c < ig.Sound.channels; c++) {
            var f = new Audio(e);
            f.load();
            this.clips[b].push(f);
          }
        return this.clips[b][0];
      }
      var j = new Audio(e);
      d &&
        (j.addEventListener(
          "canplaythrough",
          function q(c) {
            j.removeEventListener("canplaythrough", q, !1);
            d(b, !0, c);
          },
          !1
        ),
        j.addEventListener(
          "error",
          function (c) {
            d(b, !0, c);
          },
          !1
        ));
      j.preload = "auto";
      j.load();
      this.clips[b] = [j];
      if (c)
        for (c = 1; c < ig.Sound.channels; c++)
          (f = new Audio(e)), f.load(), this.clips[b].push(f);
      return j;
    },
    get: function (b) {
      b = this.clips[b];
      for (var c = 0, d; (d = b[c++]); )
        if (d.paused || d.ended) return d.ended && (d.currentTime = 0), d;
      b[0].pause();
      b[0].currentTime = 0;
      return b[0];
    },
  });
  ig.Music = ig.Class.extend({
    tracks: [],
    namedTracks: {},
    currentTrack: null,
    currentIndex: 0,
    random: !1,
    _volume: 1,
    _loop: !1,
    _fadeInterval: 0,
    _fadeTimer: null,
    _endedCallbackBound: null,
    init: function () {
      this._endedCallbackBound = this._endedCallback.bind(this);
      Object.defineProperty
        ? (Object.defineProperty(this, "volume", {
            get: this.getVolume.bind(this),
            set: this.setVolume.bind(this),
          }),
          Object.defineProperty(this, "loop", {
            get: this.getLooping.bind(this),
            set: this.setLooping.bind(this),
          }))
        : this.__defineGetter__ &&
          (this.__defineGetter__("volume", this.getVolume.bind(this)),
          this.__defineSetter__("volume", this.setVolume.bind(this)),
          this.__defineGetter__("loop", this.getLooping.bind(this)),
          this.__defineSetter__("loop", this.setLooping.bind(this)));
    },
    add: function (b, c) {
      if (ig.Sound.enabled) {
        var d = ig.soundManager.load(b instanceof ig.Sound ? b.path : b, !1);
        d.loop = this._loop;
        d.volume = this._volume;
        d.addEventListener("ended", this._endedCallbackBound, !1);
        this.tracks.push(d);
        c && (this.namedTracks[c] = d);
        this.currentTrack || (this.currentTrack = d);
      }
    },
    next: function () {
      this.tracks.length &&
        (this.stop(),
        (this.currentIndex = this.random
          ? Math.floor(Math.random() * this.tracks.length)
          : (this.currentIndex + 1) % this.tracks.length),
        (this.currentTrack = this.tracks[this.currentIndex]),
        this.play());
    },
    pause: function () {
      this.currentTrack && this.currentTrack.pause();
    },
    stop: function () {
      if (this.currentTrack) {
        this.currentTrack.pause();
        try {
          this.currentTrack.currentTime = 0;
        } catch (b) {
          console.log(b);
        }
      }
    },
    play: function (b) {
      if (b && this.namedTracks[b])
        (b = this.namedTracks[b]),
          b != this.currentTrack && (this.stop(), (this.currentTrack = b));
      else if (!this.currentTrack) return;
      this.currentTrack.play();
    },
    getLooping: function () {
      return this._loop;
    },
    setLooping: function (b) {
      this._loop = b;
      for (var c in this.tracks) this.tracks[c].loop = b;
    },
    getVolume: function () {
      return this._volume;
    },
    setVolume: function (b) {
      this._volume = b.limit(0, 1);
      for (var c in this.tracks) this.tracks[c].volume = this._volume;
    },
    fadeOut: function (b) {
      this.currentTrack &&
        (clearInterval(this._fadeInterval),
        (this.fadeTimer = new ig.Timer(b)),
        (this._fadeInterval = setInterval(this._fadeStep.bind(this), 50)));
    },
    _fadeStep: function () {
      var b =
        this.fadeTimer
          .delta()
          .map(-this.fadeTimer.target, 0, 1, 0)
          .limit(0, 1) * this._volume;
      0.01 >= b
        ? (this.stop(),
          (this.currentTrack.volume = this._volume),
          clearInterval(this._fadeInterval))
        : (this.currentTrack.volume = b);
    },
    _endedCallback: function () {
      this._loop ? this.play() : this.next();
    },
  });
  ig.Sound = ig.Class.extend({
    path: "",
    volume: 1,
    currentClip: null,
    multiChannel: !0,
    init: function (b, c) {
      this.path = b;
      this.multiChannel = !1 !== c;
      this.load();
    },
    load: function (b) {
      ig.Sound.enabled
        ? ig.ready
          ? ig.soundManager.load(this.path, this.multiChannel, b)
          : ig.addResource(this)
        : b && b(this.path, !0);
    },
    play: function () {
      ig.Sound.enabled &&
        ((this.currentClip = ig.soundManager.get(this.path)),
        (this.currentClip.volume = ig.soundManager.volume * this.volume),
        this.currentClip.play());
    },
    stop: function () {
      this.currentClip &&
        (this.currentClip.pause(), (this.currentClip.currentTime = 0));
    },
  });
  ig.Sound.FORMAT = {
    MP3: { ext: "mp3", mime: "audio/mpeg" },
    M4A: { ext: "m4a", mime: "audio/mp4; codecs=mp4a" },
    OGG: { ext: "ogg", mime: "audio/ogg; codecs=vorbis" },
    WEBM: { ext: "webm", mime: "audio/webm; codecs=vorbis" },
    CAF: { ext: "caf", mime: "audio/x-caf" },
  };
  ig.Sound.use = [ig.Sound.FORMAT.MP3, ig.Sound.FORMAT.OGG];
  ig.Sound.channels = 4;
  ig.Sound.enabled = !0;
});
ig.baked = !0;
ig.module("impact.loader")
  .requires("impact.image", "impact.font", "impact.sound")
  .defines(function () {
    ig.Loader = ig.Class.extend({
      resources: [],
      gameClass: null,
      status: 0,
      done: !1,
      _unloaded: [],
      _drawStatus: 0,
      _intervalId: 0,
      _loadCallbackBound: null,
      init: function (b, c) {
        this.gameClass = b;
        this.resources = c;
        this._loadCallbackBound = this._loadCallback.bind(this);
        for (var d = 0; d < this.resources.length; d++)
          this._unloaded.push(this.resources[d].path);
      },
      load: function () {
        ig.system.clear("#000");
        if (this.resources.length) {
          for (var b = 0; b < this.resources.length; b++)
            this.loadResource(this.resources[b]);
          this._intervalId = setInterval(this.draw.bind(this), 16);
        } else this.end();
      },
      loadResource: function (b) {
        b.load(this._loadCallbackBound);
      },
      end: function () {
        this.done || ((this.done = !0), clearInterval(this._intervalId));
      },
      draw: function () {},
      _loadCallback: function (b, c) {
        if (c) this._unloaded.erase(b);
        else throw "Failed to load resource: " + b;
        this.status = 1 - this._unloaded.length / this.resources.length;
        0 == this._unloaded.length && setTimeout(this.end.bind(this), 250);
      },
    });
  });
ig.baked = !0;
ig.module("impact.timer").defines(function () {
  ig.Timer = ig.Class.extend({
    target: 0,
    base: 0,
    last: 0,
    pausedAt: 0,
    init: function (b) {
      this.last = this.base = ig.Timer.time;
      this.target = b || 0;
    },
    set: function (b) {
      this.target = b || 0;
      this.base = ig.Timer.time;
      this.pausedAt = 0;
    },
    reset: function () {
      this.base = ig.Timer.time;
      this.pausedAt = 0;
    },
    tick: function () {
      var b = ig.Timer.time - this.last;
      this.last = ig.Timer.time;
      return this.pausedAt ? 0 : b;
    },
    delta: function () {
      return (this.pausedAt || ig.Timer.time) - this.base - this.target;
    },
    pause: function () {
      this.pausedAt || (this.pausedAt = ig.Timer.time);
    },
    unpause: function () {
      this.pausedAt &&
        ((this.base += ig.Timer.time - this.pausedAt), (this.pausedAt = 0));
    },
  });
  ig.Timer._last = 0;
  ig.Timer.time = 0;
  ig.Timer.timeScale = 1;
  ig.Timer.maxStep = 0.05;
  ig.Timer.step = function () {
    var b = Date.now();
    ig.Timer.time +=
      Math.min((b - ig.Timer._last) / 1e3, ig.Timer.maxStep) *
      ig.Timer.timeScale;
    ig.Timer._last = b;
  };
});
ig.baked = !0;
ig.module("impact.system")
  .requires("impact.timer", "impact.image")
  .defines(function () {
    ig.System = ig.Class.extend({
      fps: 30,
      width: 320,
      height: 240,
      realWidth: 320,
      realHeight: 240,
      scale: 1,
      tick: 0,
      animationId: 0,
      newGameClass: null,
      running: !1,
      delegate: null,
      clock: null,
      canvas: null,
      context: null,
      init: function (b, c, d, e, f) {
        this.fps = c;
        this.clock = new ig.Timer();
        this.canvas = ig.$(b);
        this.resize(d, e, f);
        this.context = this.canvas.getContext("2d");
        this.getDrawPos = ig.System.drawMode;
      },
      resize: function (b, c, d) {
        this.width = b;
        this.height = c;
        this.scale = d || this.scale;
        this.realWidth = this.width * this.scale;
        this.realHeight = this.height * this.scale;
        this.canvas.width = this.realWidth;
        this.canvas.height = this.realHeight;
      },
      setGame: function (b) {
        this.running ? (this.newGameClass = b) : this.setGameNow(b);
      },
      setGameNow: function (b) {
        ig.game = new b();
        ig.system.setDelegate(ig.game);
      },
      setDelegate: function (b) {
        if ("function" == typeof b.run)
          (this.delegate = b), this.startRunLoop();
        else throw "System.setDelegate: No run() function in object";
      },
      stopRunLoop: function () {
        ig.clearAnimation(this.animationId);
        this.running = !1;
      },
      startRunLoop: function () {
        this.stopRunLoop();
        this.animationId = ig.setAnimation(this.run.bind(this), this.canvas);
        this.running = !0;
      },
      clear: function (b) {
        this.context.fillStyle = b;
        this.context.fillRect(0, 0, this.realWidth, this.realHeight);
      },
      run: function () {
        ig.Timer.step();
        this.tick = this.clock.tick();
        this.delegate.run();
        ig.input.clearPressed();
        this.newGameClass &&
          (this.setGameNow(this.newGameClass), (this.newGameClass = null));
      },
      getDrawPos: null,
    });
    ig.System.DRAW = {
      AUTHENTIC: function (b) {
        return Math.round(b) * this.scale;
      },
      SMOOTH: function (b) {
        return Math.round(b * this.scale);
      },
      SUBPIXEL: function (b) {
        return b * this.scale;
      },
    };
    ig.System.drawMode = ig.System.DRAW.SMOOTH;
    ig.System.SCALE = {
      CRISP: function (b, c) {
        ig.setVendorAttribute(c, "imageSmoothingEnabled", !1);
        b.style.imageRendering = "-moz-crisp-edges";
        b.style.imageRendering = "-o-crisp-edges";
        b.style.imageRendering = "-webkit-optimize-contrast";
        b.style.imageRendering = "crisp-edges";
        b.style.msInterpolationMode = "nearest-neighbor";
      },
      SMOOTH: function (b, c) {
        ig.setVendorAttribute(c, "imageSmoothingEnabled", !0);
        b.style.imageRendering = "";
        b.style.msInterpolationMode = "";
      },
    };
    ig.System.scaleMode = ig.System.SCALE.SMOOTH;
  });
ig.baked = !0;
ig.module("impact.input").defines(function () {
  ig.KEY = {
    MOUSE1: -1,
    MOUSE2: -3,
    MWHEEL_UP: -4,
    MWHEEL_DOWN: -5,
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    PAUSE: 19,
    CAPS: 20,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    INSERT: 45,
    DELETE: 46,
    _0: 48,
    _1: 49,
    _2: 50,
    _3: 51,
    _4: 52,
    _5: 53,
    _6: 54,
    _7: 55,
    _8: 56,
    _9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    NUMPAD_0: 96,
    NUMPAD_1: 97,
    NUMPAD_2: 98,
    NUMPAD_3: 99,
    NUMPAD_4: 100,
    NUMPAD_5: 101,
    NUMPAD_6: 102,
    NUMPAD_7: 103,
    NUMPAD_8: 104,
    NUMPAD_9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBSTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PLUS: 187,
    COMMA: 188,
    MINUS: 189,
    PERIOD: 190,
  };
  ig.Input = ig.Class.extend({
    bindings: {},
    actions: {},
    presses: {},
    locks: {},
    delayedKeyup: {},
    isUsingMouse: !1,
    isUsingKeyboard: !1,
    isUsingAccelerometer: !1,
    mouse: { x: 0, y: 0 },
    accel: { x: 0, y: 0, z: 0 },
    initMouse: function () {
      if (!this.isUsingMouse) {
        this.isUsingMouse = !0;
        var b = this.mousewheel.bind(this);
        ig.system.canvas.addEventListener("mousewheel", b, !1);
        ig.system.canvas.addEventListener("DOMMouseScroll", b, !1);
        ig.system.canvas.addEventListener(
          "contextmenu",
          this.contextmenu.bind(this),
          !1
        );
        ig.system.canvas.addEventListener(
          "mousedown",
          this.keydown.bind(this),
          !1
        );
        ig.system.canvas.addEventListener("mouseup", this.keyup.bind(this), !1);
        ig.system.canvas.addEventListener(
          "mousemove",
          this.mousemove.bind(this),
          !1
        );
        ig.ua.touchDevice &&
          (ig.system.canvas.addEventListener(
            "touchstart",
            this.keydown.bind(this),
            !1
          ),
          ig.system.canvas.addEventListener(
            "touchend",
            this.keyup.bind(this),
            !1
          ),
          ig.system.canvas.addEventListener(
            "touchmove",
            this.mousemove.bind(this),
            !1
          ),
          ig.system.canvas.addEventListener(
            "MSPointerDown",
            this.keydown.bind(this),
            !1
          ),
          ig.system.canvas.addEventListener(
            "MSPointerUp",
            this.keyup.bind(this),
            !1
          ),
          ig.system.canvas.addEventListener(
            "MSPointerMove",
            this.mousemove.bind(this),
            !1
          ),
          (ig.system.canvas.style.msTouchAction = "none"));
      }
    },
    initKeyboard: function () {
      this.isUsingKeyboard ||
        ((this.isUsingKeyboard = !0),
        window.addEventListener("keydown", this.keydown.bind(this), !1),
        window.addEventListener("keyup", this.keyup.bind(this), !1));
    },
    initAccelerometer: function () {
      this.isUsingAccelerometer ||
        window.addEventListener(
          "devicemotion",
          this.devicemotion.bind(this),
          !1
        );
    },
    mousewheel: function (b) {
      var c = this.bindings[
        0 < (b.wheelDelta ? b.wheelDelta : -1 * b.detail)
          ? ig.KEY.MWHEEL_UP
          : ig.KEY.MWHEEL_DOWN
      ];
      c &&
        ((this.actions[c] = !0),
        (this.presses[c] = !0),
        (this.delayedKeyup[c] = !0),
        b.stopPropagation(),
        b.preventDefault());
    },
    mousemove: function (b) {
      for (var c = ig.system.canvas, d = 0, e = 0; null != c; )
        (d += c.offsetLeft), (e += c.offsetTop), (c = c.offsetParent);
      var c = b.pageX,
        f = b.pageY;
      b.touches && ((c = b.touches[0].clientX), (f = b.touches[0].clientY));
      this.mouse.x = (c - d) / ig.system.scale;
      this.mouse.y = (f - e) / ig.system.scale;
    },
    contextmenu: function (b) {
      this.bindings[ig.KEY.MOUSE2] && (b.stopPropagation(), b.preventDefault());
    },
    keydown: function (b) {
      b.stopPropagation();
      b.preventDefault();
      var c = b.target.tagName;
      if (!("INPUT" == c || "TEXTAREA" == c))
        if (
          ((c =
            "keydown" == b.type
              ? b.keyCode
              : 2 == b.button
              ? ig.KEY.MOUSE2
              : ig.KEY.MOUSE1),
          0 > c && !ig.ua.mobile && window.focus(),
          ("touchstart" == b.type || "mousedown" == b.type) &&
            this.mousemove(b),
          (b = this.bindings[c]))
        )
          (this.actions[b] = !0),
            this.locks[b] || ((this.presses[b] = !0), (this.locks[b] = !0));
    },
    keyup: function (b) {
      if ("text" != b.target.type) {
        var c = this.bindings[
          "keyup" == b.type
            ? b.keyCode
            : 2 == b.button
            ? ig.KEY.MOUSE2
            : ig.KEY.MOUSE1
        ];
        c &&
          ((this.delayedKeyup[c] = !0),
          b.stopPropagation(),
          b.preventDefault());
      }
    },
    devicemotion: function (b) {
      this.accel = b.accelerationIncludingGravity;
    },
    bind: function (b, c) {
      0 > b ? this.initMouse() : 0 < b && this.initKeyboard();
      this.bindings[b] = c;
    },
    bindTouch: function (b, c) {
      var d = ig.$(b),
        e = this;
      d.addEventListener(
        "touchstart",
        function (b) {
          e.touchStart(b, c);
        },
        !1
      );
      d.addEventListener(
        "touchend",
        function (b) {
          e.touchEnd(b, c);
        },
        !1
      );
    },
    unbind: function (b) {
      this.delayedKeyup[this.bindings[b]] = !0;
      this.bindings[b] = null;
    },
    unbindAll: function () {
      this.bindings = {};
      this.actions = {};
      this.presses = {};
      this.locks = {};
      this.delayedKeyup = {};
    },
    state: function (b) {
      return this.actions[b];
    },
    pressed: function (b) {
      return this.presses[b];
    },
    released: function (b) {
      return this.delayedKeyup[b];
    },
    clearPressed: function () {
      for (var b in this.delayedKeyup)
        (this.actions[b] = !1), (this.locks[b] = !1);
      this.delayedKeyup = {};
      this.presses = {};
    },
    touchStart: function (b, c) {
      this.actions[c] = !0;
      this.presses[c] = !0;
      ig.game.webaudioPlugin &&
        (ig.game.webaudioPlugin.initIOSWebAudioUnlock(),
        ig.game.webaudioPlugin.play());
      b.stopPropagation();
      b.preventDefault();
      return !1;
    },
    touchEnd: function (b, c) {
      this.delayedKeyup[c] = !0;
      b.stopPropagation();
      b.preventDefault();
      return !1;
    },
  });
});
ig.baked = !0;
ig.module("impact.sound-handler").defines(function () {
  ig.SoundHandler = ig.Class.extend({
    formats: { ogg: ".ogg", mp3: ".mp3" },
    jukebox: null,
    pausePosition: null,
    globalMute: !1,
    forceMuted: !1,
    muted: !1,
    bgmPlaying: !1,
    soundPlaying: !1,
    currentSoundPlaying: null,
    soundBuffer: [],
    voSoundLoaded: [],
    sfxSoundLoaded: [],
    SOUNDID: {},
    voSoundsToLoad: [],
    sfxSoundsToLoad: [
      { name: "staticSound", path: "media/audio/play/static" },
      { name: "openingSound", path: "media/audio/opening/opening" },
      { name: "kittyopeningSound", path: "media/audio/opening/kittyopening" },
      { name: "button", path: "media/audio/sfx/button" },
      { name: "hit", path: "media/audio/sfx/hit2" },
      { name: "step", path: "media/audio/sfx/step" },
      { name: "skate", path: "media/audio/sfx/skate" },
      { name: "jump", path: "media/audio/sfx/jump2" },
      { name: "slide", path: "media/audio/sfx/woosh" },
      { name: "crunch", path: "media/audio/sfx/crunch" },
      { name: "coin", path: "media/audio/sfx/ding" },
      { name: "chirp", path: "media/audio/sfx/chirp" },
    ],
    debug: !1,
    init: function () {
      this.initSfx();
      this.setupWindowHandler();
    },
    allVoSoundLoaded: function () {
      if (this.voSoundLoaded.length >= this.voSoundsToLoad.length) {
        this.debug && console.log("Vo ready");
        for (index = 0; index < this.voSoundLoaded.length; index++)
          this.voSoundLoaded[index].on(
            "end",
            function (b) {
              b.isPlaying = !1;
              this.soundBuffer.pop();
            }.bind(this, this.voSoundLoaded[index])
          ),
            this.voSoundLoaded[index].on(
              "play",
              function (b) {
                b.isPlaying = !0;
              }.bind(this, this.voSoundLoaded[index])
            );
        return !0;
      }
      return !1;
    },
    allSfxSoundLoaded: function () {
      return this.sfxSoundLoaded.length >= this.sfxSoundsToLoad.length
        ? !0
        : !1;
    },
    stopBackgroundMusic: function () {
      ig.game && ig.game.webaudioPlugin && ig.game.webaudioPlugin.stop();
    },
    playBackgroundMusic: function () {
      ig.game && ig.game.webaudioPlugin && ig.game.webaudioPlugin.play();
      this.jukebox &&
        (null != this.pausePosition
          ? this.jukebox.player.resume(this.pausePosition)
          : (this.jukebox.player.resume(
              this.jukebox.player.settings.spritemap.music.start
            ),
            this.jukebox.player.play()),
        (this.bgmPlaying = !0));
    },
    playSound: function (b) {
      if ((b = this[b]) && (!this.forceMuted || !this.muted) && !b.isPlaying)
        this.soundBuffer.push(b), b.play();
    },
    stopAllAndPlaySound: function (b) {
      this.stopAllSounds();
      this.playSound(b);
    },
    stopAllSounds: function () {
      for (index = 0; index < this.soundBuffer.length; index++)
        (this.soundBuffer[index].isPlaying = !1),
          this.soundBuffer.splice(0, 1)[0].stop();
    },
    addSound: function (b, c, d) {
      var e = c + this.formats.ogg;
      c += this.formats.mp3;
      this.SOUNDID[b] = b;
      this[b] = d
        ? new Howl({ src: [e, c], onload: d })
        : new Howl({ src: [e, c] });
    },
    _muteSounds: function () {
      for (i = 0; i < ig.resources.length; i++)
        ig.resources[i].multiChannel && ig.resources[i].stop();
      Howler.mute(!0);
      this.debug && console.log("Sounds muted");
    },
    _unMuteSounds: function () {
      Howler.mute(!1);
      ig.Sound.enabled = !0;
      this.debug && console.log("Sounds can play");
    },
    focusBlurMute: function () {
      this.forceMuted || this.mute();
    },
    focusBlurUnmute: function () {
      this.forceMuted || this.unmute();
    },
    setForceMuted: function (b) {
      this.forceMuted = b;
    },
    mute: function () {
      this._muteSounds();
      ig.game &&
        (ig.game.webaudioPlugin && ig.game.webaudioPlugin.mute(),
        this.jukebox &&
          ((this.pausePosition = this.jukebox.player.pause()),
          this.jukebox.player.setVolume(0.01)));
      this.muted = !0;
    },
    unmute: function () {
      this._unMuteSounds();
      ig.game &&
        !1 == ig.game.muted &&
        ig.game.webaudioPlugin &&
        (ig.game.webaudioPlugin.unmute(), ig.game.webaudioPlugin.play());
      if (this.jukebox && this.bgmPlaying) {
        this.bgmPauseResume(this.pausePosition);
        var b = this.musicVolume;
        0 == b && (b = 0.01);
        this.jukebox.player.setVolume(b);
      }
      this.muted = !1;
      ig.soundHandler.playBackgroundMusic();
    },
    setupWindowHandler: function () {
      "true" === getQueryVariable("webview")
        ? ($(window).focus(function () {
            ig.game && ig.game.resumeGame();
            ig.soundHandler && ig.soundHandler.focusBlurUnmute();
          }),
          $(window).blur(function () {
            ig.game && ig.game.pauseGame();
            ig.soundHandler && ig.soundHandler.focusBlurMute();
          }))
        : ((window.onfocus = function () {
            ig.game && ig.game.resumeGame();
            ig.soundHandler && ig.soundHandler.focusBlurUnmute();
          }),
          (window.onblur = function () {
            ig.game && ig.game.pauseGame();
            ig.soundHandler && ig.soundHandler.focusBlurMute();
          }));
    },
    initSfx: function () {
      for (index = 0; index < this.sfxSoundsToLoad.length; index++) {
        var b = function (b) {
          this.sfxSoundLoaded.push(this[b]);
        }.bind(this, this.sfxSoundsToLoad[index].name);
        this.addSound(
          this.sfxSoundsToLoad[index].name,
          this.sfxSoundsToLoad[index].path,
          b
        );
      }
    },
    initVoSfx: function () {
      for (index = 0; index < this.voSoundsToLoad.length; index++) {
        var b = function (b) {
          this.voSoundLoaded.push(this[b]);
        }.bind(this, this.voSoundsToLoad[index].name);
        this.addSound(
          this.voSoundsToLoad[index].name,
          this.voSoundsToLoad[index].path,
          b
        );
      }
    },
    setupDesktopMusic: function () {
      ig.music.add("media/audio/music/bgm.*", "background");
    },
    setupJukebox: function () {
      this.jukebox ||
        ((this.jukebox = new ig.Jukebox()),
        -1 != this.jukebox.player.resource.indexOf("ogg") &&
          ((this.jukebox.player.settings.spritemap.music.start = 0),
          (this.jukebox.player.settings.spritemap.music.end -= 0.05)),
        (this.pausePosition = this.jukebox.player.settings.spritemap.music.start),
        this.jukebox.player.setVolume(0.01));
    },
    forceLoopBGM: function () {
      if (
        this.bgmPlaying &&
        !this.forceMuted &&
        this.jukebox &&
        this.jukebox.player
      )
        if (this.jukebox.player.getCurrentTime()) {
          var b = 0.06;
          ig.ua.mobile && ((b = 0.06), ig.ua.android && (b = 0.07));
          ig.ua.mobile || (b = 0);
          this.jukebox.player.settings.spritemap.music &&
          this.jukebox.player.settings.spritemap.music.loop
            ? this.jukebox.player.getCurrentTime() >=
                this.jukebox.player.settings.spritemap.music.end - b &&
              this.bgmPauseResume(
                this.jukebox.player.settings.spritemap.music.start
              )
            : this.jukebox.player.isPlaying &&
              this.jukebox.player.isPlaying.loop
            ? this.jukebox.player.getCurrentTime() >=
                this.jukebox.player.isPlaying.end - b &&
              this.bgmPauseResume(this.jukebox.player.isPlaying.start)
            : this.jukebox.player.backgroundMusic &&
              this.jukebox.player.backgroundMusic.loop &&
              this.jukebox.player.getCurrentTime() >=
                this.jukebox.player.backgroundMusic.end - b &&
              this.bgmPauseResume(this.jukebox.player.backgroundMusic.start);
        } else this.jukebox.player.resume();
    },
    bgmPauseResume: function () {
      this.bgmPlaying = !0;
    },
    setSfxVolume: function (b) {
      this.sfxVolume = b;
      Howler.volume(this.sfxVolume);
    },
    setMusicVolume: function (b) {
      this.musicVolume = b;
      this.jukebox &&
        ((b = this.musicVolume),
        0 == b
          ? (this.jukebox.player.setVolume(b),
            this.bgmPlaying && this.jukebox.player.pause(),
            (this.bgmPlaying = !1))
          : (this.jukebox.player.setVolume(b),
            this.bgmPlaying ||
              this.jukebox.player.resume(
                this.jukebox.player.settings.spritemap.music.start
              ),
            (this.bgmPlaying = !0)));
    },
  });
});
function getHiddenProp() {
  var b = ["webkit", "moz", "ms", "o"];
  if ("hidden" in document) return "hidden";
  for (var c = 0; c < b.length; c++)
    if (b[c] + "Hidden" in document) return b[c] + "Hidden";
  return null;
}
function isHidden() {
  var b = getHiddenProp();
  return !b ? !1 : document[b];
}
var visProp = getHiddenProp();
if (visProp) {
  var evtname = visProp.replace(/[H|h]idden/, "") + "visibilitychange";
  document.addEventListener(evtname, visChange);
}
window.addEventListener(
  "pagehide",
  function () {
    ig.soundHandler && ig.soundHandler.focusBlurMute();
  },
  !1
);
window.addEventListener(
  "pageshow",
  function () {
    ig.ua.mobile && ig.game && ig.game.resumeGame();
    ig.soundHandler && ig.soundHandler.focusBlurUnmute();
  },
  !1
);
function visChange() {
  isHidden()
    ? ig.soundHandler && ig.soundHandler.focusBlurMute()
    : (ig.ua.mobile && ig.game && ig.game.resumeGame(),
      ig.soundHandler && ig.soundHandler.focusBlurUnmute());
}
ig.baked = !0;
ig.module("impact.impact")
  .requires(
    "dom.ready",
    "impact.loader",
    "impact.system",
    "impact.input",
    "impact.sound",
    "impact.sound-handler"
  )
  .defines(function () {
    ig.main = function (b, c, d, e, f, j, m) {
      ig.system = new ig.System(b, d, e, f, j || 1);
      ig.input = new ig.Input();
      ig.soundManager = new ig.SoundManager();
      ig.music = new ig.Music();
      ig.ready = !0;
      ig.soundHandler = new ig.SoundHandler();
      new (m || ig.Loader)(c, ig.resources).load();
    };
  });
ig.baked = !0;
ig.module("impact.animation")
  .requires("impact.timer", "impact.image")
  .defines(function () {
    ig.AnimationSheet = ig.Class.extend({
      width: 8,
      height: 8,
      image: null,
      init: function (b, c, d) {
        this.width = c;
        this.height = d;
        this.image = new ig.Image(b);
      },
    });
    ig.Animation = ig.Class.extend({
      sheet: null,
      timer: null,
      sequence: [],
      flip: { x: !1, y: !1 },
      pivot: { x: 0, y: 0 },
      frame: 0,
      tile: 0,
      loopCount: 0,
      alpha: 1,
      angle: 0,
      init: function (b, c, d, e) {
        this.sheet = b;
        this.pivot = { x: b.width / 2, y: b.height / 2 };
        this.timer = new ig.Timer();
        this.frameTime = c;
        this.sequence = d;
        this.stop = !!e;
        this.tile = this.sequence[0];
      },
      rewind: function () {
        this.timer.reset();
        this.loopCount = 0;
        this.tile = this.sequence[0];
        return this;
      },
      gotoFrame: function (b) {
        this.timer.set(this.frameTime * -b);
        this.update();
      },
      gotoRandomFrame: function () {
        this.gotoFrame(Math.floor(Math.random() * this.sequence.length));
      },
      update: function () {
        var b = Math.floor(this.timer.delta() / this.frameTime);
        this.loopCount = Math.floor(b / this.sequence.length);
        this.frame =
          this.stop && 0 < this.loopCount
            ? this.sequence.length - 1
            : b % this.sequence.length;
        this.tile = this.sequence[this.frame];
      },
      draw: function (b, c) {
        var d = Math.max(this.sheet.width, this.sheet.height);
        b > ig.system.width ||
          c > ig.system.height ||
          0 > b + d ||
          0 > c + d ||
          (1 != this.alpha && (ig.system.context.globalAlpha = this.alpha),
          0 == this.angle
            ? this.sheet.image.drawTile(
                b,
                c,
                this.tile,
                this.sheet.width,
                this.sheet.height,
                this.flip.x,
                this.flip.y
              )
            : (ig.system.context.save(),
              ig.system.context.translate(
                ig.system.getDrawPos(b + this.pivot.x),
                ig.system.getDrawPos(c + this.pivot.y)
              ),
              ig.system.context.rotate(this.angle),
              this.sheet.image.drawTile(
                -this.pivot.x,
                -this.pivot.y,
                this.tile,
                this.sheet.width,
                this.sheet.height,
                this.flip.x,
                this.flip.y
              ),
              ig.system.context.restore()),
          1 != this.alpha && (ig.system.context.globalAlpha = 1));
      },
    });
  });
ig.baked = !0;
ig.module("impact.entity")
  .requires("impact.animation", "impact.impact")
  .defines(function () {
    ig.Entity = ig.Class.extend({
      id: 0,
      settings: {},
      size: { x: 16, y: 16 },
      offset: { x: 0, y: 0 },
      posMP: { x: 0, y: 0 },
      posML: { x: 0, y: 0 },
      enableReposition: !1,
      pos: { x: 0, y: 0 },
      last: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      accel: { x: 0, y: 0 },
      friction: { x: 0, y: 0 },
      maxVel: { x: 100, y: 100 },
      zIndex: 0,
      gravityFactor: 1,
      standing: !1,
      bounciness: 0,
      minBounceVelocity: 40,
      anims: {},
      animSheet: null,
      currentAnim: null,
      health: 10,
      type: 0,
      checkAgainst: 0,
      collides: 0,
      _killed: !1,
      slopeStanding: { min: (44).toRad(), max: (136).toRad() },
      init: function (b, c, d) {
        this.id = ++ig.Entity._lastId;
        this.pos.x = b;
        this.pos.y = c;
        ig.merge(this, d);
      },
      addAnim: function (b, c, d, e) {
        if (!this.animSheet)
          throw "No animSheet to add the animation " + b + " to.";
        c = new ig.Animation(this.animSheet, c, d, e);
        this.anims[b] = c;
        this.currentAnim || (this.currentAnim = c);
        return c;
      },
      update: function () {
        this.last.x = this.pos.x;
        this.last.y = this.pos.y;
        this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
        this.vel.x = this.getNewVelocity(
          this.vel.x,
          this.accel.x,
          this.friction.x,
          this.maxVel.x
        );
        this.vel.y = this.getNewVelocity(
          this.vel.y,
          this.accel.y,
          this.friction.y,
          this.maxVel.y
        );
        var b = ig.game.collisionMap.trace(
          this.pos.x,
          this.pos.y,
          this.vel.x * ig.system.tick,
          this.vel.y * ig.system.tick,
          this.size.x,
          this.size.y
        );
        this.handleMovementTrace(b);
        this.currentAnim && this.currentAnim.update();
      },
      getNewVelocity: function (b, c, d, e) {
        return c
          ? (b + c * ig.system.tick).limit(-e, e)
          : d
          ? ((c = d * ig.system.tick),
            0 < b - c ? b - c : 0 > b + c ? b + c : 0)
          : b.limit(-e, e);
      },
      handleMovementTrace: function (b) {
        this.standing = !1;
        b.collision.y &&
          (0 < this.bounciness && Math.abs(this.vel.y) > this.minBounceVelocity
            ? (this.vel.y *= -this.bounciness)
            : (0 < this.vel.y && (this.standing = !0), (this.vel.y = 0)));
        b.collision.x &&
          (this.vel.x =
            0 < this.bounciness && Math.abs(this.vel.x) > this.minBounceVelocity
              ? this.vel.x * -this.bounciness
              : 0);
        if (b.collision.slope) {
          var c = b.collision.slope;
          if (0 < this.bounciness) {
            var d = this.vel.x * c.nx + this.vel.y * c.ny;
            this.vel.x = (this.vel.x - 2 * c.nx * d) * this.bounciness;
            this.vel.y = (this.vel.y - 2 * c.ny * d) * this.bounciness;
          } else
            (d =
              (this.vel.x * c.x + this.vel.y * c.y) / (c.x * c.x + c.y * c.y)),
              (this.vel.x = c.x * d),
              (this.vel.y = c.y * d),
              (c = Math.atan2(c.x, c.y)),
              c > this.slopeStanding.min &&
                c < this.slopeStanding.max &&
                (this.standing = !0);
        }
        this.pos = b.pos;
      },
      reposition: function () {
        ig.ua.mobile &&
          this.enableReposition &&
          (portraitMode
            ? ((this.pos.x = this.posMP.x), (this.pos.y = this.posMP.y))
            : ((this.pos.x = this.posML.x), (this.pos.y = this.posML.y)));
      },
      draw: function () {
        this.currentAnim &&
          this.currentAnim.draw(
            this.pos.x - this.offset.x - ig.game._rscreen.x,
            this.pos.y - this.offset.y - ig.game._rscreen.y
          );
      },
      kill: function () {
        ig.game.removeEntity(this);
      },
      receiveDamage: function (b) {
        this.health -= b;
        0 >= this.health && this.kill();
      },
      touches: function (b) {
        return !(
          this.pos.x >= b.pos.x + b.size.x ||
          this.pos.x + this.size.x <= b.pos.x ||
          this.pos.y >= b.pos.y + b.size.y ||
          this.pos.y + this.size.y <= b.pos.y
        );
      },
      distanceTo: function (b) {
        var c = this.pos.x + this.size.x / 2 - (b.pos.x + b.size.x / 2);
        b = this.pos.y + this.size.y / 2 - (b.pos.y + b.size.y / 2);
        return Math.sqrt(c * c + b * b);
      },
      angleTo: function (b) {
        return Math.atan2(
          b.pos.y + b.size.y / 2 - (this.pos.y + this.size.y / 2),
          b.pos.x + b.size.x / 2 - (this.pos.x + this.size.x / 2)
        );
      },
      check: function () {},
      collideWith: function () {},
      ready: function () {},
    });
    ig.Entity._lastId = 0;
    ig.Entity.COLLIDES = { NEVER: 0, LITE: 1, PASSIVE: 2, ACTIVE: 4, FIXED: 8 };
    ig.Entity.TYPE = { NONE: 0, A: 1, B: 2, BOTH: 3 };
    ig.Entity.checkPair = function (b, c) {
      b.checkAgainst & c.type && b.check(c);
      c.checkAgainst & b.type && c.check(b);
      b.collides &&
        c.collides &&
        b.collides + c.collides > ig.Entity.COLLIDES.ACTIVE &&
        ig.Entity.solveCollision(b, c);
    };
    ig.Entity.solveCollision = function (b, c) {
      var d = null;
      if (
        b.collides == ig.Entity.COLLIDES.LITE ||
        c.collides == ig.Entity.COLLIDES.FIXED
      )
        d = b;
      else if (
        c.collides == ig.Entity.COLLIDES.LITE ||
        b.collides == ig.Entity.COLLIDES.FIXED
      )
        d = c;
      b.last.x + b.size.x > c.last.x && b.last.x < c.last.x + c.size.x
        ? (b.last.y < c.last.y
            ? ig.Entity.seperateOnYAxis(b, c, d)
            : ig.Entity.seperateOnYAxis(c, b, d),
          b.collideWith(c, "y"),
          c.collideWith(b, "y"))
        : b.last.y + b.size.y > c.last.y &&
          b.last.y < c.last.y + c.size.y &&
          (b.last.x < c.last.x
            ? ig.Entity.seperateOnXAxis(b, c, d)
            : ig.Entity.seperateOnXAxis(c, b, d),
          b.collideWith(c, "x"),
          c.collideWith(b, "x"));
    };
    ig.Entity.seperateOnXAxis = function (b, c, d) {
      var e = b.pos.x + b.size.x - c.pos.x;
      d
        ? ((d.vel.x = -d.vel.x * d.bounciness + (b === d ? c : b).vel.x),
          (c = ig.game.collisionMap.trace(
            d.pos.x,
            d.pos.y,
            d == b ? -e : e,
            0,
            d.size.x,
            d.size.y
          )),
          (d.pos.x = c.pos.x))
        : ((d = (b.vel.x - c.vel.x) / 2),
          (b.vel.x = -d),
          (c.vel.x = d),
          (d = ig.game.collisionMap.trace(
            b.pos.x,
            b.pos.y,
            -e / 2,
            0,
            b.size.x,
            b.size.y
          )),
          (b.pos.x = Math.floor(d.pos.x)),
          (b = ig.game.collisionMap.trace(
            c.pos.x,
            c.pos.y,
            e / 2,
            0,
            c.size.x,
            c.size.y
          )),
          (c.pos.x = Math.ceil(b.pos.x)));
    };
    ig.Entity.seperateOnYAxis = function (b, c, d) {
      var e = b.pos.y + b.size.y - c.pos.y;
      if (d) {
        c = b === d ? c : b;
        d.vel.y = -d.vel.y * d.bounciness + c.vel.y;
        var f = 0;
        d == b &&
          Math.abs(d.vel.y - c.vel.y) < d.minBounceVelocity &&
          ((d.standing = !0), (f = c.vel.x * ig.system.tick));
        b = ig.game.collisionMap.trace(
          d.pos.x,
          d.pos.y,
          f,
          d == b ? -e : e,
          d.size.x,
          d.size.y
        );
        d.pos.y = b.pos.y;
        d.pos.x = b.pos.x;
      } else
        ig.game.gravity && (c.standing || 0 < b.vel.y)
          ? ((d = ig.game.collisionMap.trace(
              b.pos.x,
              b.pos.y,
              0,
              -(b.pos.y + b.size.y - c.pos.y),
              b.size.x,
              b.size.y
            )),
            (b.pos.y = d.pos.y),
            0 < b.bounciness && b.vel.y > b.minBounceVelocity
              ? (b.vel.y *= -b.bounciness)
              : ((b.standing = !0), (b.vel.y = 0)))
          : ((d = (b.vel.y - c.vel.y) / 2),
            (b.vel.y = -d),
            (c.vel.y = d),
            (f = c.vel.x * ig.system.tick),
            (d = ig.game.collisionMap.trace(
              b.pos.x,
              b.pos.y,
              f,
              -e / 2,
              b.size.x,
              b.size.y
            )),
            (b.pos.y = d.pos.y),
            (b = ig.game.collisionMap.trace(
              c.pos.x,
              c.pos.y,
              0,
              e / 2,
              c.size.x,
              c.size.y
            )),
            (c.pos.y = b.pos.y));
    };
  });
ig.baked = !0;
ig.module("impact.map").defines(function () {
  ig.Map = ig.Class.extend({
    tilesize: 8,
    width: 1,
    height: 1,
    data: [[]],
    name: null,
    init: function (b, c) {
      this.tilesize = b;
      this.data = c;
      this.height = c.length;
      this.width = c[0].length;
    },
    getTile: function (b, c) {
      var d = Math.floor(b / this.tilesize),
        e = Math.floor(c / this.tilesize);
      return 0 <= d && d < this.width && 0 <= e && e < this.height
        ? this.data[e][d]
        : 0;
    },
    setTile: function (b, c, d) {
      b = Math.floor(b / this.tilesize);
      c = Math.floor(c / this.tilesize);
      0 <= b &&
        b < this.width &&
        0 <= c &&
        c < this.height &&
        (this.data[c][b] = d);
    },
  });
});
ig.baked = !0;
ig.module("impact.collision-map")
  .requires("impact.map")
  .defines(function () {
    ig.CollisionMap = ig.Map.extend({
      lastSlope: 1,
      tiledef: null,
      init: function (b, c, f) {
        this.parent(b, c);
        this.tiledef = f || ig.CollisionMap.defaultTileDef;
        for (var j in this.tiledef)
          j | (0 > this.lastSlope) && (this.lastSlope = j | 0);
      },
      trace: function (b, c, f, j, m, q) {
        var l = {
            collision: { x: !1, y: !1, slope: !1 },
            pos: { x: b, y: c },
            tile: { x: 0, y: 0 },
          },
          p = Math.ceil(Math.max(Math.abs(f), Math.abs(j)) / this.tilesize);
        if (1 < p)
          for (
            var n = f / p, s = j / p, r = 0;
            r < p &&
            (n || s) &&
            !(this._traceStep(l, b, c, n, s, m, q, f, j, r),
            (b = l.pos.x),
            (c = l.pos.y),
            l.collision.x && (f = n = 0),
            l.collision.y && (j = s = 0),
            l.collision.slope);
            r++
          );
        else this._traceStep(l, b, c, f, j, m, q, f, j, 0);
        return l;
      },
      _traceStep: function (b, c, f, j, m, q, l, p, n, s) {
        b.pos.x += j;
        b.pos.y += m;
        var r = 0;
        if (j) {
          var v = 0 < j ? q : 0,
            z = 0 > j ? this.tilesize : 0,
            r = Math.max(Math.floor(f / this.tilesize), 0),
            B = Math.min(Math.ceil((f + l) / this.tilesize), this.height);
          j = Math.floor((b.pos.x + v) / this.tilesize);
          var F = Math.floor((c + v) / this.tilesize);
          if (0 < s || j == F || 0 > F || F >= this.width) F = -1;
          if (0 <= j && j < this.width)
            for (
              var E = r;
              E < B &&
              !(
                -1 != F &&
                ((r = this.data[E][F]),
                1 < r &&
                  r <= this.lastSlope &&
                  this._checkTileDef(b, r, c, f, p, n, q, l, F, E))
              );
              E++
            )
              if (
                ((r = this.data[E][j]),
                1 == r ||
                  r > this.lastSlope ||
                  (1 < r && this._checkTileDef(b, r, c, f, p, n, q, l, j, E)))
              ) {
                if (1 < r && r <= this.lastSlope && b.collision.slope) break;
                b.collision.x = !0;
                b.tile.x = r;
                c = b.pos.x = j * this.tilesize - v + z;
                p = 0;
                break;
              }
        }
        if (m) {
          v = 0 < m ? l : 0;
          m = 0 > m ? this.tilesize : 0;
          r = Math.max(Math.floor(b.pos.x / this.tilesize), 0);
          z = Math.min(Math.ceil((b.pos.x + q) / this.tilesize), this.width);
          E = Math.floor((b.pos.y + v) / this.tilesize);
          B = Math.floor((f + v) / this.tilesize);
          if (0 < s || E == B || 0 > B || B >= this.height) B = -1;
          if (0 <= E && E < this.height)
            for (
              j = r;
              j < z &&
              !(
                -1 != B &&
                ((r = this.data[B][j]),
                1 < r &&
                  r <= this.lastSlope &&
                  this._checkTileDef(b, r, c, f, p, n, q, l, j, B))
              );
              j++
            )
              if (
                ((r = this.data[E][j]),
                1 == r ||
                  r > this.lastSlope ||
                  (1 < r && this._checkTileDef(b, r, c, f, p, n, q, l, j, E)))
              ) {
                if (1 < r && r <= this.lastSlope && b.collision.slope) break;
                b.collision.y = !0;
                b.tile.y = r;
                b.pos.y = E * this.tilesize - v + m;
                break;
              }
        }
      },
      _checkTileDef: function (b, c, f, j, m, q, l, p, n, s) {
        var r = this.tiledef[c];
        if (!r) return !1;
        c = (r[2] - r[0]) * this.tilesize;
        var v = (r[3] - r[1]) * this.tilesize,
          z = r[4];
        l = f + m + (0 > v ? l : 0) - (n + r[0]) * this.tilesize;
        p = j + q + (0 < c ? p : 0) - (s + r[1]) * this.tilesize;
        if (0 < c * p - v * l) {
          if (0 > m * -v + q * c) return z;
          n = Math.sqrt(c * c + v * v);
          s = v / n;
          n = -c / n;
          var B = l * s + p * n,
            r = s * B,
            B = n * B;
          if (r * r + B * B >= m * m + q * q)
            return z || 0.5 > c * (p - q) - v * (l - m);
          b.pos.x = f + m - r;
          b.pos.y = j + q - B;
          b.collision.slope = { x: c, y: v, nx: s, ny: n };
          return !0;
        }
        return !1;
      },
    });
    var b = 1 / 3,
      c = 2 / 3;
    ig.CollisionMap.defaultTileDef = {
      5: [0, 1, 1, c, !0],
      6: [0, c, 1, b, !0],
      7: [0, b, 1, 0, !0],
      3: [0, 1, 1, 0.5, !0],
      4: [0, 0.5, 1, 0, !0],
      2: [0, 1, 1, 0, !0],
      10: [0.5, 1, 1, 0, !0],
      21: [0, 1, 0.5, 0, !0],
      32: [c, 1, 1, 0, !0],
      43: [b, 1, c, 0, !0],
      54: [0, 1, b, 0, !0],
      27: [0, 0, 1, b, !0],
      28: [0, b, 1, c, !0],
      29: [0, c, 1, 1, !0],
      25: [0, 0, 1, 0.5, !0],
      26: [0, 0.5, 1, 1, !0],
      24: [0, 0, 1, 1, !0],
      11: [0, 0, 0.5, 1, !0],
      22: [0.5, 0, 1, 1, !0],
      33: [0, 0, b, 1, !0],
      44: [b, 0, c, 1, !0],
      55: [c, 0, 1, 1, !0],
      16: [1, b, 0, 0, !0],
      17: [1, c, 0, b, !0],
      18: [1, 1, 0, c, !0],
      14: [1, 0.5, 0, 0, !0],
      15: [1, 1, 0, 0.5, !0],
      13: [1, 1, 0, 0, !0],
      8: [0.5, 1, 0, 0, !0],
      19: [1, 1, 0.5, 0, !0],
      30: [b, 1, 0, 0, !0],
      41: [c, 1, b, 0, !0],
      52: [1, 1, c, 0, !0],
      38: [1, c, 0, 1, !0],
      39: [1, b, 0, c, !0],
      40: [1, 0, 0, b, !0],
      36: [1, 0.5, 0, 1, !0],
      37: [1, 0, 0, 0.5, !0],
      35: [1, 0, 0, 1, !0],
      9: [1, 0, 0.5, 1, !0],
      20: [0.5, 0, 0, 1, !0],
      31: [1, 0, c, 1, !0],
      42: [c, 0, b, 1, !0],
      53: [b, 0, 0, 1, !0],
      12: [0, 0, 1, 0, !1],
      23: [1, 1, 0, 1, !1],
      34: [1, 0, 1, 1, !1],
      45: [0, 1, 0, 0, !1],
    };
    ig.CollisionMap.staticNoCollision = {
      trace: function (b, c, f, j) {
        return {
          collision: { x: !1, y: !1, slope: !1 },
          pos: { x: b + f, y: c + j },
          tile: { x: 0, y: 0 },
        };
      },
    };
  });
ig.baked = !0;
ig.module("impact.background-map")
  .requires("impact.map", "impact.image")
  .defines(function () {
    ig.BackgroundMap = ig.Map.extend({
      tiles: null,
      scroll: { x: 0, y: 0 },
      distance: 1,
      repeat: !1,
      tilesetName: "",
      foreground: !1,
      enabled: !0,
      preRender: !1,
      preRenderedChunks: null,
      chunkSize: 512,
      debugChunks: !1,
      anims: {},
      init: function (b, c, d) {
        this.parent(b, c);
        this.setTileset(d);
      },
      setTileset: function (b) {
        this.tilesetName = b instanceof ig.Image ? b.path : b;
        this.tiles = new ig.Image(this.tilesetName);
        this.preRenderedChunks = null;
      },
      setScreenPos: function (b, c) {
        this.scroll.x = b / this.distance;
        this.scroll.y = c / this.distance;
      },
      preRenderMapToChunks: function () {
        var b = this.width * this.tilesize * ig.system.scale,
          c = this.height * this.tilesize * ig.system.scale,
          d = Math.ceil(b / this.chunkSize),
          e = Math.ceil(c / this.chunkSize);
        this.preRenderedChunks = [];
        for (var f = 0; f < e; f++) {
          this.preRenderedChunks[f] = [];
          for (var j = 0; j < d; j++)
            this.preRenderedChunks[f][j] = this.preRenderChunk(
              j,
              f,
              j == d - 1 ? b - j * this.chunkSize : this.chunkSize,
              f == e - 1 ? c - f * this.chunkSize : this.chunkSize
            );
        }
      },
      preRenderChunk: function (b, c, d, e) {
        var f = d / this.tilesize / ig.system.scale + 1,
          j = e / this.tilesize / ig.system.scale + 1,
          m = ((b * this.chunkSize) / ig.system.scale) % this.tilesize,
          q = ((c * this.chunkSize) / ig.system.scale) % this.tilesize;
        b = Math.floor((b * this.chunkSize) / this.tilesize / ig.system.scale);
        c = Math.floor((c * this.chunkSize) / this.tilesize / ig.system.scale);
        var l = ig.$new("canvas");
        l.width = d;
        l.height = e;
        d = ig.system.context;
        ig.system.context = l.getContext("2d");
        for (e = 0; e < f; e++)
          for (var p = 0; p < j; p++)
            if (e + b < this.width && p + c < this.height) {
              var n = this.data[p + c][e + b];
              n &&
                this.tiles.drawTile(
                  e * this.tilesize - m,
                  p * this.tilesize - q,
                  n - 1,
                  this.tilesize
                );
            }
        ig.system.context = d;
        return l;
      },
      draw: function () {
        this.tiles.loaded &&
          this.enabled &&
          (this.preRender ? this.drawPreRendered() : this.drawTiled());
      },
      drawPreRendered: function () {
        this.preRenderedChunks || this.preRenderMapToChunks();
        var b = ig.system.getDrawPos(this.scroll.x),
          c = ig.system.getDrawPos(this.scroll.y);
        this.repeat &&
          ((b %= this.width * this.tilesize * ig.system.scale),
          (c %= this.height * this.tilesize * ig.system.scale));
        var d = Math.max(Math.floor(b / this.chunkSize), 0),
          e = Math.max(Math.floor(c / this.chunkSize), 0),
          f = Math.ceil((b + ig.system.realWidth) / this.chunkSize),
          j = Math.ceil((c + ig.system.realHeight) / this.chunkSize),
          m = this.preRenderedChunks[0].length,
          q = this.preRenderedChunks.length;
        this.repeat || ((f = Math.min(f, m)), (j = Math.min(j, q)));
        for (var l = 0; e < j; e++) {
          for (var p = 0, n = d; n < f; n++) {
            var s = this.preRenderedChunks[e % q][n % m],
              r = -b + n * this.chunkSize - p,
              v = -c + e * this.chunkSize - l;
            ig.system.context.drawImage(s, r, v);
            ig.Image.drawCount++;
            this.debugChunks &&
              ((ig.system.context.strokeStyle = "#f0f"),
              ig.system.context.strokeRect(
                r,
                v,
                this.chunkSize,
                this.chunkSize
              ));
            this.repeat &&
              s.width < this.chunkSize &&
              r + s.width < ig.system.realWidth &&
              ((p = this.chunkSize - s.width), f++);
          }
          this.repeat &&
            s.height < this.chunkSize &&
            v + s.height < ig.system.realHeight &&
            ((l = this.chunkSize - s.height), j++);
        }
      },
      drawTiled: function () {
        for (
          var b = 0,
            c = null,
            d = (this.scroll.x / this.tilesize).toInt(),
            e = (this.scroll.y / this.tilesize).toInt(),
            f = this.scroll.x % this.tilesize,
            j = this.scroll.y % this.tilesize,
            m = -f - this.tilesize,
            f = ig.system.width + this.tilesize - f,
            q = ig.system.height + this.tilesize - j,
            l = -1,
            j = -j - this.tilesize;
          j < q;
          l++, j += this.tilesize
        ) {
          var p = l + e;
          if (p >= this.height || 0 > p) {
            if (!this.repeat) continue;
            p =
              0 < p
                ? p % this.height
                : ((p + 1) % this.height) + this.height - 1;
          }
          for (var n = -1, s = m; s < f; n++, s += this.tilesize) {
            b = n + d;
            if (b >= this.width || 0 > b) {
              if (!this.repeat) continue;
              b =
                0 < b
                  ? b % this.width
                  : ((b + 1) % this.width) + this.width - 1;
            }
            if ((b = this.data[p][b]))
              (c = this.anims[b - 1])
                ? c.draw(s, j)
                : this.tiles.drawTile(s, j, b - 1, this.tilesize);
          }
        }
      },
    });
  });
ig.baked = !0;
ig.module("impact.game")
  .requires(
    "impact.impact",
    "impact.entity",
    "impact.collision-map",
    "impact.background-map"
  )
  .defines(function () {
    ig.Game = ig.Class.extend({
      clearColor: "#000000",
      gravity: 0,
      screen: { x: 0, y: 0 },
      _rscreen: { x: 0, y: 0 },
      entities: [],
      namedEntities: {},
      collisionMap: ig.CollisionMap.staticNoCollision,
      backgroundMaps: [],
      backgroundAnims: {},
      autoSort: !1,
      sortBy: null,
      cellSize: 64,
      _deferredKill: [],
      _levelToLoad: null,
      _doSortEntities: !1,
      staticInstantiate: function () {
        this.sortBy = this.sortBy || ig.Game.SORT.Z_INDEX;
        ig.game = this;
        return null;
      },
      loadLevelWithoutEntities: function (b) {
        this.screen = { x: 0, y: 0 };
        this.collisionMap = ig.CollisionMap.staticNoCollision;
        this.backgroundMaps = [];
        for (var c = 0; c < b.layer.length; c++) {
          var d = b.layer[c];
          if ("collision" == d.name)
            this.collisionMap = new ig.CollisionMap(d.tilesize, d.data);
          else {
            var e = new ig.BackgroundMap(d.tilesize, d.data, d.tilesetName);
            e.anims = this.backgroundAnims[d.tilesetName] || {};
            e.repeat = d.repeat;
            e.distance = d.distance;
            e.foreground = !!d.foreground;
            e.preRender = !!d.preRender;
            e.name = d.name;
            this.backgroundMaps.push(e);
          }
        }
      },
      loadLevel: function (b) {
        this.screen = { x: 0, y: 0 };
        this.entities = [];
        this.namedEntities = {};
        for (var c = 0; c < b.entities.length; c++) {
          var d = b.entities[c];
          this.spawnEntity(d.type, d.x, d.y, d.settings);
        }
        this.sortEntities();
        this.collisionMap = ig.CollisionMap.staticNoCollision;
        this.backgroundMaps = [];
        for (c = 0; c < b.layer.length; c++)
          if (((d = b.layer[c]), "collision" == d.name))
            this.collisionMap = new ig.CollisionMap(d.tilesize, d.data);
          else {
            var e = new ig.BackgroundMap(d.tilesize, d.data, d.tilesetName);
            e.anims = this.backgroundAnims[d.tilesetName] || {};
            e.repeat = d.repeat;
            e.distance = d.distance;
            e.foreground = !!d.foreground;
            e.preRender = !!d.preRender;
            e.name = d.name;
            this.backgroundMaps.push(e);
          }
        for (c = 0; c < this.entities.length; c++) this.entities[c].ready();
      },
      loadLevelDeferred: function (b) {
        this._levelToLoad = b;
      },
      getMapByName: function (b) {
        if ("collision" == b) return this.collisionMap;
        for (var c = 0; c < this.backgroundMaps.length; c++)
          if (this.backgroundMaps[c].name == b) return this.backgroundMaps[c];
        return null;
      },
      getEntityByName: function (b) {
        return this.namedEntities[b];
      },
      getEntitiesByType: function (b) {
        b = "string" === typeof b ? ig.global[b] : b;
        for (var c = [], d = 0; d < this.entities.length; d++) {
          var e = this.entities[d];
          e instanceof b && !e._killed && c.push(e);
        }
        return c;
      },
      spawnEntity: function (b, c, d, e) {
        var f = "string" === typeof b ? ig.global[b] : b;
        if (!f) throw "Can't spawn entity of type " + b;
        b = new f(c, d, e || {});
        this.entities.push(b);
        b.name && (this.namedEntities[b.name] = b);
        return b;
      },
      sortEntities: function () {
        this.entities.sort(this.sortBy);
      },
      sortEntitiesDeferred: function () {
        this._doSortEntities = !0;
      },
      removeEntity: function (b) {
        b.name && delete this.namedEntities[b.name];
        b._killed = !0;
        b.type = ig.Entity.TYPE.NONE;
        b.checkAgainst = ig.Entity.TYPE.NONE;
        b.collides = ig.Entity.COLLIDES.NEVER;
        this._deferredKill.push(b);
      },
      run: function () {
        this.update();
        this.draw();
      },
      update: function () {
        this._levelToLoad &&
          (this.loadLevel(this._levelToLoad), (this._levelToLoad = null));
        if (this._doSortEntities || this.autoSort)
          this.sortEntities(), (this._doSortEntities = !1);
        this.updateEntities();
        this.checkEntities();
        for (var b = 0; b < this._deferredKill.length; b++)
          this.entities.erase(this._deferredKill[b]);
        this._deferredKill = [];
        for (var c in this.backgroundAnims) {
          var b = this.backgroundAnims[c],
            d;
          for (d in b) b[d].update();
        }
      },
      updateEntities: function () {
        for (var b = 0; b < this.entities.length; b++) {
          var c = this.entities[b];
          c._killed || c.update();
        }
      },
      draw: function () {
        this.clearColor && ig.system.clear(this.clearColor);
        this._rscreen.x = ig.system.getDrawPos(this.screen.x) / ig.system.scale;
        this._rscreen.y = ig.system.getDrawPos(this.screen.y) / ig.system.scale;
        var b;
        for (b = 0; b < this.backgroundMaps.length; b++) {
          var c = this.backgroundMaps[b];
          if (c.foreground) break;
          c.setScreenPos(this.screen.x, this.screen.y);
          c.draw();
        }
        this.drawEntities();
        for (b; b < this.backgroundMaps.length; b++)
          (c = this.backgroundMaps[b]),
            c.setScreenPos(this.screen.x, this.screen.y),
            c.draw();
      },
      drawEntities: function () {
        for (var b = 0; b < this.entities.length; b++) this.entities[b].draw();
      },
      checkEntities: function () {
        for (var b = {}, c = 0; c < this.entities.length; c++) {
          var d = this.entities[c];
          if (
            !(
              d.type == ig.Entity.TYPE.NONE &&
              d.checkAgainst == ig.Entity.TYPE.NONE &&
              d.collides == ig.Entity.COLLIDES.NEVER
            )
          )
            for (
              var e = {},
                f = Math.floor(d.pos.y / this.cellSize),
                j = Math.floor((d.pos.x + d.size.x) / this.cellSize) + 1,
                m = Math.floor((d.pos.y + d.size.y) / this.cellSize) + 1,
                q = Math.floor(d.pos.x / this.cellSize);
              q < j;
              q++
            )
              for (var l = f; l < m; l++)
                if (b[q])
                  if (b[q][l]) {
                    for (var p = b[q][l], n = 0; n < p.length; n++)
                      d.touches(p[n]) &&
                        !e[p[n].id] &&
                        ((e[p[n].id] = !0), ig.Entity.checkPair(d, p[n]));
                    p.push(d);
                  } else b[q][l] = [d];
                else (b[q] = {}), (b[q][l] = [d]);
        }
      },
    });
    ig.Game.SORT = {
      Z_INDEX: function (b, c) {
        return b.zIndex - c.zIndex;
      },
      POS_X: function (b, c) {
        return b.pos.x + b.size.x - (c.pos.x + c.size.x);
      },
      POS_Y: function (b, c) {
        return b.pos.y + b.size.y - (c.pos.y + c.size.y);
      },
    };
  });
ig.baked = !0;
ig.module("impact.debug.menu")
  .requires("dom.ready", "impact.system")
  .defines(function () {
    ig.System.inject({
      run: function () {
        ig.debug.beforeRun();
        this.parent();
        ig.debug.afterRun();
      },
      setGameNow: function (b) {
        this.parent(b);
        ig.debug.ready();
      },
    });
    ig.Debug = ig.Class.extend({
      options: {},
      panels: {},
      numbers: {},
      container: null,
      panelMenu: null,
      activePanel: null,
      debugTime: 0,
      debugTickAvg: 0.016,
      debugRealTime: Date.now(),
      init: function () {
        this.container = ig.$new("div");
        this.container.className = "ig_debug";
        ig.$("body")[0].appendChild(this.container);
        this.panelMenu = ig.$new("div");
        this.panelMenu.innerHTML =
          '<div class="ig_debug_head">Impact.Debug:</div>';
        this.panelMenu.className = "ig_debug_panel_menu";
        this.container.appendChild(this.panelMenu);
        this.numberContainer = ig.$new("div");
        this.numberContainer.className = "ig_debug_stats";
        this.panelMenu.appendChild(this.numberContainer);
        window.console &&
          window.console.log &&
          window.console.assert &&
          ((ig.log = console.log.bind
            ? console.log.bind(console)
            : console.log),
          (ig.assert = console.assert.bind
            ? console.assert.bind(console)
            : console.assert));
        ig.show = this.showNumber.bind(this);
      },
      addNumber: function (b) {
        var c = ig.$new("span");
        this.numberContainer.appendChild(c);
        this.numberContainer.appendChild(document.createTextNode(b));
        this.numbers[b] = c;
      },
      showNumber: function (b, c, d) {
        this.numbers[b] || this.addNumber(b, d);
        this.numbers[b].textContent = c;
      },
      addPanel: function (b) {
        var c = new b.type(b.name, b.label);
        if (b.options)
          for (var d = 0; d < b.options.length; d++) {
            var e = b.options[d];
            c.addOption(new ig.DebugOption(e.name, e.object, e.property));
          }
        this.panels[c.name] = c;
        c.container.style.display = "none";
        this.container.appendChild(c.container);
        b = ig.$new("div");
        b.className = "ig_debug_menu_item";
        b.textContent = c.label;
        b.addEventListener(
          "click",
          function () {
            this.togglePanel(c);
          }.bind(this),
          !1
        );
        c.menuItem = b;
        e = !1;
        for (d = 1; d < this.panelMenu.childNodes.length; d++) {
          var f = this.panelMenu.childNodes[d];
          if (f.textContent > c.label) {
            this.panelMenu.insertBefore(b, f);
            e = !0;
            break;
          }
        }
        e || this.panelMenu.appendChild(b);
      },
      showPanel: function (b) {
        this.togglePanel(this.panels[b]);
      },
      togglePanel: function (b) {
        b != this.activePanel &&
          this.activePanel &&
          (this.activePanel.toggle(!1),
          (this.activePanel.menuItem.className = "ig_debug_menu_item"),
          (this.activePanel = null));
        var c = "block" != b.container.style.display;
        b.toggle(c);
        b.menuItem.className = "ig_debug_menu_item" + (c ? " active" : "");
        c && (this.activePanel = b);
      },
      ready: function () {
        for (var b in this.panels) this.panels[b].ready();
      },
      beforeRun: function () {
        var b = Date.now();
        this.debugTickAvg =
          0.8 * this.debugTickAvg + 0.2 * (b - this.debugRealTime);
        this.debugRealTime = b;
        this.activePanel && this.activePanel.beforeRun();
      },
      afterRun: function () {
        var b = Date.now() - this.debugRealTime;
        this.debugTime = 0.8 * this.debugTime + 0.2 * b;
        this.activePanel && this.activePanel.afterRun();
        this.showNumber("ms", this.debugTime.toFixed(2));
        this.showNumber("fps", Math.round(1e3 / this.debugTickAvg));
        this.showNumber("draws", ig.Image.drawCount);
        ig.game &&
          ig.game.entities &&
          this.showNumber("entities", ig.game.entities.length);
        ig.Image.drawCount = 0;
      },
    });
    ig.DebugPanel = ig.Class.extend({
      active: !1,
      container: null,
      options: [],
      panels: [],
      label: "",
      name: "",
      init: function (b, c) {
        this.name = b;
        this.label = c;
        this.container = ig.$new("div");
        this.container.className = "ig_debug_panel " + this.name;
      },
      toggle: function (b) {
        this.active = b;
        this.container.style.display = b ? "block" : "none";
      },
      addPanel: function (b) {
        this.panels.push(b);
        this.container.appendChild(b.container);
      },
      addOption: function (b) {
        this.options.push(b);
        this.container.appendChild(b.container);
      },
      ready: function () {},
      beforeRun: function () {},
      afterRun: function () {},
    });
    ig.DebugOption = ig.Class.extend({
      name: "",
      labelName: "",
      className: "ig_debug_option",
      label: null,
      mark: null,
      container: null,
      active: !1,
      colors: { enabled: "#fff", disabled: "#444" },
      init: function (b, c, d) {
        this.name = b;
        this.object = c;
        this.property = d;
        this.active = this.object[this.property];
        this.container = ig.$new("div");
        this.container.className = "ig_debug_option";
        this.label = ig.$new("span");
        this.label.className = "ig_debug_label";
        this.label.textContent = this.name;
        this.mark = ig.$new("span");
        this.mark.className = "ig_debug_label_mark";
        this.container.appendChild(this.mark);
        this.container.appendChild(this.label);
        this.container.addEventListener("click", this.click.bind(this), !1);
        this.setLabel();
      },
      setLabel: function () {
        this.mark.style.backgroundColor = this.active
          ? this.colors.enabled
          : this.colors.disabled;
      },
      click: function (b) {
        this.active = !this.active;
        this.object[this.property] = this.active;
        this.setLabel();
        b.stopPropagation();
        b.preventDefault();
        return !1;
      },
    });
    ig.debug = new ig.Debug();
  });
ig.baked = !0;
ig.module("impact.debug.entities-panel")
  .requires("impact.debug.menu", "impact.entity")
  .defines(function () {
    ig.Entity.inject({
      colors: { names: "#fff", velocities: "#0f0", boxes: "#f00" },
      draw: function () {
        this.parent();
        ig.Entity._debugShowBoxes &&
          ((ig.system.context.strokeStyle = this.colors.boxes),
          (ig.system.context.lineWidth = 1),
          ig.system.context.strokeRect(
            ig.system.getDrawPos(this.pos.x.round() - ig.game.screen.x) - 0.5,
            ig.system.getDrawPos(this.pos.y.round() - ig.game.screen.y) - 0.5,
            this.size.x * ig.system.scale,
            this.size.y * ig.system.scale
          ));
        if (ig.Entity._debugShowVelocities) {
          var b = this.pos.x + this.size.x / 2,
            c = this.pos.y + this.size.y / 2;
          this._debugDrawLine(
            this.colors.velocities,
            b,
            c,
            b + this.vel.x,
            c + this.vel.y
          );
        }
        if (
          ig.Entity._debugShowNames &&
          (this.name &&
            ((ig.system.context.fillStyle = this.colors.names),
            ig.system.context.fillText(
              this.name,
              ig.system.getDrawPos(this.pos.x - ig.game.screen.x),
              ig.system.getDrawPos(this.pos.y - ig.game.screen.y)
            )),
          "object" == typeof this.target)
        )
          for (var d in this.target)
            (b = ig.game.getEntityByName(this.target[d])) &&
              this._debugDrawLine(
                this.colors.names,
                this.pos.x + this.size.x / 2,
                this.pos.y + this.size.y / 2,
                b.pos.x + b.size.x / 2,
                b.pos.y + b.size.y / 2
              );
      },
      _debugDrawLine: function (b, c, d, e, f) {
        ig.system.context.strokeStyle = b;
        ig.system.context.lineWidth = 1;
        ig.system.context.beginPath();
        ig.system.context.moveTo(
          ig.system.getDrawPos(c - ig.game.screen.x),
          ig.system.getDrawPos(d - ig.game.screen.y)
        );
        ig.system.context.lineTo(
          ig.system.getDrawPos(e - ig.game.screen.x),
          ig.system.getDrawPos(f - ig.game.screen.y)
        );
        ig.system.context.stroke();
        ig.system.context.closePath();
      },
    });
    ig.Entity._debugEnableChecks = !0;
    ig.Entity._debugShowBoxes = !1;
    ig.Entity._debugShowVelocities = !1;
    ig.Entity._debugShowNames = !1;
    ig.Entity.oldCheckPair = ig.Entity.checkPair;
    ig.Entity.checkPair = function (b, c) {
      ig.Entity._debugEnableChecks && ig.Entity.oldCheckPair(b, c);
    };
    ig.debug.addPanel({
      type: ig.DebugPanel,
      name: "entities",
      label: "Entities",
      options: [
        {
          name: "Checks & Collisions",
          object: ig.Entity,
          property: "_debugEnableChecks",
        },
        {
          name: "Show Collision Boxes",
          object: ig.Entity,
          property: "_debugShowBoxes",
        },
        {
          name: "Show Velocities",
          object: ig.Entity,
          property: "_debugShowVelocities",
        },
        {
          name: "Show Names & Targets",
          object: ig.Entity,
          property: "_debugShowNames",
        },
      ],
    });
  });
ig.baked = !0;
ig.module("impact.debug.maps-panel")
  .requires("impact.debug.menu", "impact.game", "impact.background-map")
  .defines(function () {
    ig.Game.inject({
      loadLevel: function (b) {
        this.parent(b);
        ig.debug.panels.maps.load(this);
      },
    });
    ig.DebugMapsPanel = ig.DebugPanel.extend({
      maps: [],
      mapScreens: [],
      init: function (b, c) {
        this.parent(b, c);
        this.load();
      },
      load: function (b) {
        this.options = [];
        this.panels = [];
        if (!b || !b.backgroundMaps.length)
          this.container.innerHTML = "<em>No Maps Loaded</em>";
        else {
          this.maps = b.backgroundMaps;
          this.mapScreens = [];
          this.container.innerHTML = "";
          for (b = 0; b < this.maps.length; b++) {
            var c = this.maps[b],
              d = new ig.DebugPanel(b, "Layer " + b),
              e = new ig.$new("strong");
            e.textContent = b + ": " + c.tiles.path;
            d.container.appendChild(e);
            d.addOption(new ig.DebugOption("Enabled", c, "enabled"));
            d.addOption(new ig.DebugOption("Pre Rendered", c, "preRender"));
            d.addOption(new ig.DebugOption("Show Chunks", c, "debugChunks"));
            this.generateMiniMap(d, c, b);
            this.addPanel(d);
          }
        }
      },
      generateMiniMap: function (b, c, d) {
        var e = ig.system.scale,
          f = ig.$new("canvas"),
          j = f.getContext("2d"),
          m = c.tiles.width * e,
          q = c.tiles.height * e,
          l = m / c.tilesize;
        j.drawImage(c.tiles.data, 0, 0, m, q, 0, 0, l, q / c.tilesize);
        j = ig.$new("canvas");
        j.width = c.width * e;
        j.height = c.height * e;
        var p = j.getContext("2d");
        ig.game.clearColor &&
          ((p.fillStyle = ig.game.clearColor), p.fillRect(0, 0, m, q));
        for (q = m = 0; q < c.width; q++)
          for (var n = 0; n < c.height; n++)
            (m = c.data[n][q]) &&
              p.drawImage(
                f,
                Math.floor(((m - 1) * e) % l),
                Math.floor(((m - 1) * e) / l) * e,
                e,
                e,
                q * e,
                n * e,
                e,
                e
              );
        f = ig.$new("div");
        f.className = "ig_debug_map_container";
        f.style.width = c.width * e + "px";
        f.style.height = c.height * e + "px";
        l = ig.$new("div");
        l.className = "ig_debug_map_screen";
        l.style.width = (ig.system.width / c.tilesize) * e - 2 + "px";
        l.style.height = (ig.system.height / c.tilesize) * e - 2 + "px";
        this.mapScreens[d] = l;
        f.appendChild(j);
        f.appendChild(l);
        b.container.appendChild(f);
      },
      afterRun: function () {
        for (var b = ig.system.scale, c = 0; c < this.maps.length; c++) {
          var d = this.maps[c],
            e = this.mapScreens[c];
          if (d && e) {
            var f = d.scroll.x / d.tilesize,
              j = d.scroll.y / d.tilesize;
            d.repeat && ((f %= d.width), (j %= d.height));
            e.style.left = f * b + "px";
            e.style.top = j * b + "px";
          }
        }
      },
    });
    ig.debug.addPanel({
      type: ig.DebugMapsPanel,
      name: "maps",
      label: "Background Maps",
    });
  });
ig.baked = !0;
ig.module("impact.debug.graph-panel")
  .requires("impact.debug.menu", "impact.system", "impact.game", "impact.image")
  .defines(function () {
    ig.Game.inject({
      draw: function () {
        ig.graph.beginClock("draw");
        this.parent();
        ig.graph.endClock("draw");
      },
      update: function () {
        ig.graph.beginClock("update");
        this.parent();
        ig.graph.endClock("update");
      },
      checkEntities: function () {
        ig.graph.beginClock("checks");
        this.parent();
        ig.graph.endClock("checks");
      },
    });
    ig.DebugGraphPanel = ig.DebugPanel.extend({
      clocks: {},
      marks: [],
      textY: 0,
      height: 128,
      ms: 64,
      timeBeforeRun: 0,
      init: function (b, c) {
        this.parent(b, c);
        this.mark16ms = (this.height - 16 * (this.height / this.ms)).round();
        this.mark33ms = (this.height - 33 * (this.height / this.ms)).round();
        this.msHeight = this.height / this.ms;
        this.graph = ig.$new("canvas");
        this.graph.width = window.innerWidth;
        this.graph.height = this.height;
        this.container.appendChild(this.graph);
        this.ctx = this.graph.getContext("2d");
        this.ctx.fillStyle = "#444";
        this.ctx.fillRect(0, this.mark16ms, this.graph.width, 1);
        this.ctx.fillRect(0, this.mark33ms, this.graph.width, 1);
        this.addGraphMark("16ms", this.mark16ms);
        this.addGraphMark("33ms", this.mark33ms);
        this.addClock("draw", "Draw", "#13baff");
        this.addClock("update", "Entity Update", "#bb0fff");
        this.addClock("checks", "Entity Checks & Collisions", "#a2e908");
        this.addClock("lag", "System Lag", "#f26900");
        ig.mark = this.mark.bind(this);
        ig.graph = this;
      },
      addGraphMark: function (b, c) {
        var d = ig.$new("span");
        d.className = "ig_debug_graph_mark";
        d.textContent = b;
        d.style.top = c.round() + "px";
        this.container.appendChild(d);
      },
      addClock: function (b, c, d) {
        var e = ig.$new("span");
        e.className = "ig_debug_legend_color";
        e.style.backgroundColor = d;
        var f = ig.$new("span");
        f.className = "ig_debug_legend_number";
        f.appendChild(document.createTextNode("0"));
        var j = ig.$new("span");
        j.className = "ig_debug_legend";
        j.appendChild(e);
        j.appendChild(document.createTextNode(c + " ("));
        j.appendChild(f);
        j.appendChild(document.createTextNode("ms)"));
        this.container.appendChild(j);
        this.clocks[b] = {
          description: c,
          color: d,
          current: 0,
          start: Date.now(),
          avg: 0,
          html: f,
        };
      },
      beginClock: function (b, c) {
        this.clocks[b].start = Date.now() + (c || 0);
      },
      endClock: function (b) {
        b = this.clocks[b];
        b.current = Math.round(Date.now() - b.start);
        b.avg = 0.8 * b.avg + 0.2 * b.current;
      },
      mark: function (b, c) {
        this.active && this.marks.push({ msg: b, color: c || "#fff" });
      },
      beforeRun: function () {
        this.endClock("lag");
        this.timeBeforeRun = Date.now();
      },
      afterRun: function () {
        var b = Date.now() - this.timeBeforeRun;
        this.beginClock("lag", Math.max(1e3 / ig.system.fps - b, 0));
        var b = this.graph.width - 1,
          c = this.height;
        this.ctx.drawImage(this.graph, -1, 0);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(b, 0, 1, this.height);
        this.ctx.fillStyle = "#444";
        this.ctx.fillRect(b, this.mark16ms, 1, 1);
        this.ctx.fillStyle = "#444";
        this.ctx.fillRect(b, this.mark33ms, 1, 1);
        for (var d in this.clocks) {
          var e = this.clocks[d];
          e.html.textContent = e.avg.toFixed(2);
          if (e.color && 0 < e.current) {
            this.ctx.fillStyle = e.color;
            var f = e.current * this.msHeight,
              c = c - f;
            this.ctx.fillRect(b, c, 1, f);
            e.current = 0;
          }
        }
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "top";
        this.ctx.globalAlpha = 0.5;
        for (d = 0; d < this.marks.length; d++)
          (c = this.marks[d]),
            (this.ctx.fillStyle = c.color),
            this.ctx.fillRect(b, 0, 1, this.height),
            c.msg &&
              (this.ctx.fillText(c.msg, b - 1, this.textY),
              (this.textY = (this.textY + 8) % 32));
        this.ctx.globalAlpha = 1;
        this.marks = [];
      },
    });
    ig.debug.addPanel({
      type: ig.DebugGraphPanel,
      name: "graph",
      label: "Performance",
    });
  });
ig.baked = !0;
ig.module("impact.debug.debug")
  .requires(
    "impact.debug.entities-panel",
    "impact.debug.maps-panel",
    "impact.debug.graph-panel"
  )
  .defines(function () {});
ig.baked = !0;
ig.module("plugins.splash-loader")
  .requires("impact.loader", "impact.animation")
  .defines(function () {
    ig.SplashLoader = ig.Loader.extend({
      solidBg: new ig.Image("media/graphics/game/backgrounds/bg.png"),
      bgImage: new ig.Image("media/graphics/game/backgrounds/mainbg.png"),
      loadingTextAlpha: 1,
      init: function (b, c) {
        ig.ua.mobile || (halfHeightOffset = heightOffset = 0);
        this.parent(b, c);
        this.setupCustomAnimation();
        ig.ua.mobile &&
          _SETTINGS.Ad.Mobile.Preroll.Enabled &&
          MobileAdInGamePreroll.Initialize();
        ig.system.context.font = "18px mainfont, Helvetica, Verdana";
        ig.system.context.fillText("", 0, 0);
      },
      end: function () {
        this.loadingTextAlpha = 1;
        this.draw();
        this.parent();
        var b = 0 <= document.URL.indexOf("localhost") ? 500 : 3e3;
        window.setTimeout("ig.system.setGame(MyGame)", b);
        window.clearInterval(ig.loadingScreen.animationTimer);
      },
      setupCustomAnimation: function () {
        ig.loadingScreen = this;
        ig.loadingScreen.animationTimer = window.setInterval(
          "ig.loadingScreen.animate()",
          100
        );
      },
      animate: function () {
        var b = (Date.now() / 1e3) % 1;
        0.5 < b && (b = 1 - b);
        this.loadingTextAlpha = 1 - 2 * b;
      },
      draw: function () {
        isHeightBigger = 1024 < ig.system.height ? !0 : !1;
        this._drawStatus += (this.status - this._drawStatus) / 5;
        var b = ig.system.context;
        b.save();
        b.fillStyle = "#000000";
        b.fillRect(0, 0, ig.system.width, ig.system.height);
        ig.system.context.drawImage(
          this.solidBg.data,
          0,
          0,
          ig.system.width,
          ig.system.height
        );
        this.bgImage.width < ig.system.width &&
          b.scale(ig.system.width / this.bgImage.width, 1);
        isHeightBigger
          ? this.bgImage.draw(0, heightOffset)
          : this.bgImage.draw(0, halfHeightOffset);
        b.restore();
        w0 = 300;
        h0 = 11;
        x0 = (ig.system.width - w0) / 2;
        y0 = isHeightBigger ? 725 + heightOffset : 725 + halfHeightOffset;
        ig.system.context.save();
        b.translate(x0 + w0 / 2, y0);
        b.fillStyle = "#000000";
        b.strokeStyle = "#000000";
        b.lineWidth = 0;
        b.fillRect(-w0 / 2, 0, w0, h0);
        b.strokeRect(-w0 / 2, 0, w0, h0);
        var c = this._drawStatus * w0;
        b.fillStyle = "#A5DE3E";
        b.strokeStyle = "#A5DE3E";
        b.lineWidth = 0;
        b.fillRect(-w0 / 2, 0, c, h0 / 2);
        b.strokeRect(-w0 / 2, 0, c, h0 / 2);
        b.fillStyle = "#67BD51";
        b.strokeStyle = "#67BD51";
        b.lineWidth = 0;
        b.fillRect(-w0 / 2, h0 / 2, c, h0 / 2);
        b.strokeRect(-w0 / 2, h0 / 2, c, h0 / 2);
        ig.system.context.fillStyle = "#FFFFFF";
        ig.system.context.font = "20px mainfont, Helvetica, Verdana";
        b = _STRINGS.Loading.Loading;
        ig.system.context.measureText("m");
        ig.system.context.globalAlpha = this.loadingTextAlpha;
        ig.system.context.textAlign = "center";
        ig.system.context.fillText(b, 0, 50);
        ig.system.context.restore();
      },
    });
  });
ig.baked = !0;
ig.module("plugins.tween")
  .requires("impact.entity")
  .defines(function () {
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = function (b) {
        for (var c = 0; c < this.length; ++c) if (this[c] === b) return c;
        return -1;
      });
    ig.Entity.prototype.tweens = [];
    ig.Entity.prototype._preTweenUpdate = ig.Entity.prototype.update;
    ig.Entity.prototype.update = function () {
      this._preTweenUpdate();
      if (0 < this.tweens.length) {
        for (var b = [], c = 0; c < this.tweens.length; c++)
          this.tweens[c].update(),
            this.tweens[c].complete || b.push(this.tweens[c]);
        this.tweens = b;
      }
    };
    ig.Entity.prototype.tween = function (b, c, d) {
      b = new ig.Tween(this, b, c, d);
      this.tweens.push(b);
      return b;
    };
    ig.Entity.prototype.pauseTweens = function () {
      for (var b = 0; b < this.tweens.length; b++) this.tweens[b].pause();
    };
    ig.Entity.prototype.resumeTweens = function () {
      for (var b = 0; b < this.tweens.length; b++) this.tweens[b].resume();
    };
    ig.Entity.prototype.stopTweens = function (b) {
      for (var c = 0; c < this.tweens.length; c++) this.tweens[c].stop(b);
    };
    ig.Tween = function (b, c, d, e) {
      var f = {},
        j = {},
        m = {},
        q = 0,
        l = !1,
        p = !1,
        n = !1;
      this.duration = d;
      this.paused = this.complete = !1;
      this.easing = ig.Tween.Easing.Linear.EaseNone;
      this.onComplete = !1;
      this.loop = this.delay = 0;
      this.loopCount = -1;
      ig.merge(this, e);
      this.loopNum = this.loopCount;
      this.chain = function (b) {
        n = b;
      };
      this.initEnd = function (b, c, d) {
        if ("object" !== typeof c[b]) d[b] = c[b];
        else
          for (subprop in c[b])
            d[b] || (d[b] = {}), this.initEnd(subprop, c[b], d[b]);
      };
      this.initStart = function (b, c, d, e) {
        if ("object" !== typeof d[b])
          "undefined" !== typeof c[b] && (e[b] = d[b]);
        else
          for (subprop in d[b])
            e[b] || (e[b] = {}),
              "undefined" !== typeof c[b] &&
                this.initStart(subprop, c[b], d[b], e[b]);
      };
      this.start = function () {
        this.paused = this.complete = !1;
        this.loopNum = this.loopCount;
        q = 0;
        -1 == b.tweens.indexOf(this) && b.tweens.push(this);
        p = !0;
        l = new ig.Timer();
        for (var d in c) this.initEnd(d, c, j);
        for (d in j) this.initStart(d, j, b, f), this.initDelta(d, m, b, j);
      };
      this.initDelta = function (b, c, d, e) {
        if ("object" !== typeof e[b]) c[b] = e[b] - d[b];
        else
          for (subprop in e[b])
            c[b] || (c[b] = {}), this.initDelta(subprop, c[b], d[b], e[b]);
      };
      this.propUpdate = function (b, c, d, e, f) {
        if ("object" !== typeof d[b])
          c[b] = "undefined" != typeof d[b] ? d[b] + e[b] * f : c[b];
        else
          for (subprop in d[b]) this.propUpdate(subprop, c[b], d[b], e[b], f);
      };
      this.propSet = function (b, c, d) {
        if ("object" !== typeof c[b]) d[b] = c[b];
        else
          for (subprop in c[b])
            d[b] || (d[b] = {}), this.propSet(subprop, c[b], d[b]);
      };
      this.update = function () {
        if (!p) return !1;
        if (this.delay) {
          if (l.delta() < this.delay) return;
          this.delay = 0;
          l.reset();
        }
        if (this.paused || this.complete) return !1;
        var c = (l.delta() + q) / this.duration,
          c = 1 < c ? 1 : c,
          d = this.easing(c);
        for (property in m) this.propUpdate(property, b, f, m, d);
        if (1 <= c) {
          if (0 == this.loopNum || !this.loop) {
            this.complete = !0;
            if (this.onComplete) this.onComplete();
            n && n.start();
            return !1;
          }
          if (this.loop == ig.Tween.Loop.Revert) {
            for (property in f) this.propSet(property, f, b);
            q = 0;
            l.reset();
            -1 != this.loopNum && this.loopNum--;
          } else if (this.loop == ig.Tween.Loop.Reverse) {
            c = {};
            d = {};
            ig.merge(c, j);
            ig.merge(d, f);
            ig.merge(f, c);
            ig.merge(j, d);
            for (property in j) this.initDelta(property, m, b, j);
            q = 0;
            l.reset();
            -1 != this.loopNum && this.loopNum--;
          }
        }
      };
      this.pause = function () {
        this.paused = !0;
        q += l.delta();
      };
      this.resume = function () {
        this.paused = !1;
        l.reset();
      };
      this.stop = function (b) {
        b &&
          ((this.loop = this.complete = this.paused = !1),
          (q += d),
          this.update());
        this.complete = !0;
      };
    };
    ig.Tween.Loop = { Revert: 1, Reverse: 2 };
    ig.Tween.Easing = {
      Linear: {},
      Quadratic: {},
      Cubic: {},
      Quartic: {},
      Quintic: {},
      Sinusoidal: {},
      Exponential: {},
      Circular: {},
      Elastic: {},
      Back: {},
      Bounce: {},
    };
    ig.Tween.Easing.Linear.EaseNone = function (b) {
      return b;
    };
    ig.Tween.Easing.Quadratic.EaseIn = function (b) {
      return b * b;
    };
    ig.Tween.Easing.Quadratic.EaseOut = function (b) {
      return -b * (b - 2);
    };
    ig.Tween.Easing.Quadratic.EaseInOut = function (b) {
      return 1 > (b *= 2) ? 0.5 * b * b : -0.5 * (--b * (b - 2) - 1);
    };
    ig.Tween.Easing.Cubic.EaseIn = function (b) {
      return b * b * b;
    };
    ig.Tween.Easing.Cubic.EaseOut = function (b) {
      return --b * b * b + 1;
    };
    ig.Tween.Easing.Cubic.EaseInOut = function (b) {
      return 1 > (b *= 2) ? 0.5 * b * b * b : 0.5 * ((b -= 2) * b * b + 2);
    };
    ig.Tween.Easing.Quartic.EaseIn = function (b) {
      return b * b * b * b;
    };
    ig.Tween.Easing.Quartic.EaseOut = function (b) {
      return -(--b * b * b * b - 1);
    };
    ig.Tween.Easing.Quartic.EaseInOut = function (b) {
      return 1 > (b *= 2)
        ? 0.5 * b * b * b * b
        : -0.5 * ((b -= 2) * b * b * b - 2);
    };
    ig.Tween.Easing.Quintic.EaseIn = function (b) {
      return b * b * b * b * b;
    };
    ig.Tween.Easing.Quintic.EaseOut = function (b) {
      return (b -= 1) * b * b * b * b + 1;
    };
    ig.Tween.Easing.Quintic.EaseInOut = function (b) {
      return 1 > (b *= 2)
        ? 0.5 * b * b * b * b * b
        : 0.5 * ((b -= 2) * b * b * b * b + 2);
    };
    ig.Tween.Easing.Sinusoidal.EaseIn = function (b) {
      return -Math.cos((b * Math.PI) / 2) + 1;
    };
    ig.Tween.Easing.Sinusoidal.EaseOut = function (b) {
      return Math.sin((b * Math.PI) / 2);
    };
    ig.Tween.Easing.Sinusoidal.EaseInOut = function (b) {
      return -0.5 * (Math.cos(Math.PI * b) - 1);
    };
    ig.Tween.Easing.Exponential.EaseIn = function (b) {
      return 0 == b ? 0 : Math.pow(2, 10 * (b - 1));
    };
    ig.Tween.Easing.Exponential.EaseOut = function (b) {
      return 1 == b ? 1 : -Math.pow(2, -10 * b) + 1;
    };
    ig.Tween.Easing.Exponential.EaseInOut = function (b) {
      return 0 == b
        ? 0
        : 1 == b
        ? 1
        : 1 > (b *= 2)
        ? 0.5 * Math.pow(2, 10 * (b - 1))
        : 0.5 * (-Math.pow(2, -10 * (b - 1)) + 2);
    };
    ig.Tween.Easing.Circular.EaseIn = function (b) {
      return -(Math.sqrt(1 - b * b) - 1);
    };
    ig.Tween.Easing.Circular.EaseOut = function (b) {
      return Math.sqrt(1 - --b * b);
    };
    ig.Tween.Easing.Circular.EaseInOut = function (b) {
      return 1 > (b /= 0.5)
        ? -0.5 * (Math.sqrt(1 - b * b) - 1)
        : 0.5 * (Math.sqrt(1 - (b -= 2) * b) + 1);
    };
    ig.Tween.Easing.Elastic.EaseIn = function (b) {
      var c,
        d = 0.1,
        e = 0.4;
      if (0 == b) return 0;
      if (1 == b) return 1;
      e || (e = 0.3);
      !d || 1 > d
        ? ((d = 1), (c = e / 4))
        : (c = (e / (2 * Math.PI)) * Math.asin(1 / d));
      return -(
        d *
        Math.pow(2, 10 * (b -= 1)) *
        Math.sin((2 * (b - c) * Math.PI) / e)
      );
    };
    ig.Tween.Easing.Elastic.EaseOut = function (b) {
      var c,
        d = 0.1,
        e = 0.4;
      if (0 == b) return 0;
      if (1 == b) return 1;
      e || (e = 0.3);
      !d || 1 > d
        ? ((d = 1), (c = e / 4))
        : (c = (e / (2 * Math.PI)) * Math.asin(1 / d));
      return (
        d * Math.pow(2, -10 * b) * Math.sin((2 * (b - c) * Math.PI) / e) + 1
      );
    };
    ig.Tween.Easing.Elastic.EaseInOut = function (b) {
      var c,
        d = 0.1,
        e = 0.4;
      if (0 == b) return 0;
      if (1 == b) return 1;
      e || (e = 0.3);
      !d || 1 > d
        ? ((d = 1), (c = e / 4))
        : (c = (e / (2 * Math.PI)) * Math.asin(1 / d));
      return 1 > (b *= 2)
        ? -0.5 *
            d *
            Math.pow(2, 10 * (b -= 1)) *
            Math.sin((2 * (b - c) * Math.PI) / e)
        : 0.5 *
            d *
            Math.pow(2, -10 * (b -= 1)) *
            Math.sin((2 * (b - c) * Math.PI) / e) +
            1;
    };
    ig.Tween.Easing.Back.EaseIn = function (b) {
      return b * b * (2.70158 * b - 1.70158);
    };
    ig.Tween.Easing.Back.EaseOut = function (b) {
      return (b -= 1) * b * (2.70158 * b + 1.70158) + 1;
    };
    ig.Tween.Easing.Back.EaseInOut = function (b) {
      return 1 > (b *= 2)
        ? 0.5 * b * b * (3.5949095 * b - 2.5949095)
        : 0.5 * ((b -= 2) * b * (3.5949095 * b + 2.5949095) + 2);
    };
    ig.Tween.Easing.Bounce.EaseIn = function (b) {
      return 1 - ig.Tween.Easing.Bounce.EaseOut(1 - b);
    };
    ig.Tween.Easing.Bounce.EaseOut = function (b) {
      return (b /= 1) < 1 / 2.75
        ? 7.5625 * b * b
        : b < 2 / 2.75
        ? 7.5625 * (b -= 1.5 / 2.75) * b + 0.75
        : b < 2.5 / 2.75
        ? 7.5625 * (b -= 2.25 / 2.75) * b + 0.9375
        : 7.5625 * (b -= 2.625 / 2.75) * b + 0.984375;
    };
    ig.Tween.Easing.Bounce.EaseInOut = function (b) {
      return 0.5 > b
        ? 0.5 * ig.Tween.Easing.Bounce.EaseIn(2 * b)
        : 0.5 * ig.Tween.Easing.Bounce.EaseOut(2 * b - 1) + 0.5;
    };
  });
ig.baked = !0;
ig.module("plugins.url-parameters").defines(function () {
  ig.UrlParameters = ig.Class.extend({
    init: function () {
      switch (getQueryVariable("iphone")) {
        case "true":
          (ig.ua.iPhone = !0), console.log("iPhone mode");
      }
      var b = getQueryVariable("webview");
      if (b)
        switch (b) {
          case "true":
            (ig.ua.is_uiwebview = !0), console.log("webview mode");
        }
      if ((b = getQueryVariable("debug")))
        switch (b) {
          case "true":
            ig.game.showDebugMenu(), console.log("debug mode");
        }
      switch (getQueryVariable("view")) {
        case "stats":
          ig.game.resetPlayerStats(), ig.game.endGame();
      }
      getQueryVariable("ad");
    },
  });
});
ig.baked = !0;
ig.module("plugins.jukebox").defines(function () {
  ig.Jukebox = ig.Class.extend({
    init: function () {
      this.player = new jukebox.Player({
        resources: ["media/audio/music/bgm.mp3", "media/audio/music/bgm.ogg"],
        spritemap: { music: { start: 0.05, end: 13.14, loop: !0 } },
      });
    },
  });
});
ig.baked = !0;
ig.module("plugins.director")
  .requires("impact.impact")
  .defines(function () {
    ig.Director = ig.Class.extend({
      init: function (b, c) {
        this.game = b;
        this.levels = [];
        this.currentLevel = 0;
        this.append(c);
      },
      loadLevel: function (b) {
        for (key in dynamicClickableEntityDivs) ig.game.hideOverlay([key]);
        this.currentLevel = b;
        this.game.loadLevel(this.levels[b]);
        return !0;
      },
      loadLevelWithoutEntities: function (b) {
        this.currentLevel = b;
        this.game.loadLevelWithoutEntities(this.levels[b]);
        return !0;
      },
      append: function (b) {
        newLevels = [];
        return "object" === typeof b
          ? (b.constructor === [].constructor
              ? (newLevels = b)
              : (newLevels[0] = b),
            (this.levels = this.levels.concat(newLevels)),
            !0)
          : !1;
      },
      nextLevel: function () {
        return this.currentLevel + 1 < this.levels.length
          ? this.loadLevel(this.currentLevel + 1)
          : !1;
      },
      previousLevel: function () {
        return 0 <= this.currentLevel - 1
          ? this.loadLevel(this.currentLevel - 1)
          : !1;
      },
      jumpTo: function (b) {
        var c = null;
        for (i = 0; i < this.levels.length; i++) this.levels[i] == b && (c = i);
        return 0 <= c ? this.loadLevel(c) : !1;
      },
      firstLevel: function () {
        return this.loadLevel(0);
      },
      lastLevel: function () {
        return this.loadLevel(this.levels.length - 1);
      },
      reloadLevel: function () {
        return this.loadLevel(this.currentLevel);
      },
    });
  });
ig.baked = !0;
ig.module("plugins.impact-storage")
  .requires("impact.game")
  .defines(function () {
    ig.Storage = ig.Class.extend({
      staticInstantiate: function () {
        return !ig.Storage.instance ? null : ig.Storage.instance;
      },
      init: function () {
        ig.Storage.instance = this;
      },
      isCapable: function () {
        return "undefined" !== typeof window.localStorage;
      },
      isSet: function (b) {
        return null !== this.get(b);
      },
      initUnset: function (b, c) {
        null === this.get(b) && this.set(b, c);
      },
      get: function (b) {
        if (!this.isCapable()) return null;
        try {
          return JSON.parse(localStorage.getItem(b));
        } catch (c) {
          return window.localStorage.getItem(b);
        }
      },
      getInt: function (b) {
        return ~~this.get(b);
      },
      getFloat: function (b) {
        return parseFloat(this.get(b));
      },
      getBool: function (b) {
        return !!this.get(b);
      },
      key: function (b) {
        return this.isCapable() ? window.localStorage.key(b) : null;
      },
      set: function (b, c) {
        if (!this.isCapable()) return null;
        try {
          window.localStorage.setItem(b, JSON.stringify(c));
        } catch (d) {
          console.log(d);
        }
      },
      setHighest: function (b, c) {
        c > this.getFloat(b) && this.set(b, c);
      },
      remove: function (b) {
        if (!this.isCapable()) return null;
        window.localStorage.removeItem(b);
      },
      clear: function () {
        if (!this.isCapable()) return null;
        window.localStorage.clear();
      },
    });
  });
ig.baked = !0;
ig.module("plugins.webaudio-music-player").defines(function () {
  WebaudioMusicPlayer = ig.Class.extend({
    bgmPlaying: !1,
    isSupported: !1,
    muteFlag: !1,
    pausedTime: 0,
    webaudio: null,
    soundList: {},
    init: function (b) {
      this.webaudio = {
        compatibility: {},
        gainNode: null,
        buffer: null,
        source_loop: {},
        source_once: {},
      };
      try {
        (this.AudioContext = window.AudioContext || window.webkitAudioContext),
          (this.webaudio.context = new this.AudioContext()),
          (this.isSupported = !0);
      } catch (c) {
        console.log("Web Audio API not supported in this browser.");
        return;
      }
      this.webaudio.gainNode = this.webaudio.context.createGain();
      this.webaudio.gainNode.connect(this.webaudio.context.destination);
      var d = "start",
        e = "stop",
        f = this.webaudio.context.createBufferSource();
      "function" !== typeof f.start && (d = "noteOn");
      this.webaudio.compatibility.start = d;
      "function" !== typeof f.stop && (e = "noteOff");
      this.webaudio.compatibility.stop = e;
      for (var j in b) {
        this.soundList[j] = j;
        d = b[j].path;
        b = d + "." + ig.Sound.FORMAT.MP3.ext;
        var m = d + "." + ig.Sound.FORMAT.OGG.ext;
        ig.ua.mobile
          ? ig.ua.iOS && (m = b)
          : ((d = navigator.userAgent.toLowerCase()),
            -1 != d.indexOf("safari") && -1 >= d.indexOf("chrome") && (m = b));
        var q = new XMLHttpRequest();
        q.open("GET", m, !0);
        q.responseType = "arraybuffer";
        q.onload = function () {
          this.webaudio.context.decodeAudioData(
            q.response,
            function (b) {
              this.webaudio.buffer = b;
              this.webaudio.source_loop = {};
              this.bgmPlaying ? this.play() : this.stop();
            }.bind(this),
            function () {
              console.log('Error decoding audio "' + m + '".');
            }
          );
        }.bind(this);
        q.send();
        break;
      }
    },
    initIOSWebAudioUnlock: function () {
      webaudio = this.webaudio;
      var b = function () {
        var c = webaudio.context,
          d = c.createBuffer(1, 1, 22050),
          e = c.createBufferSource();
        
        e.buffer = d;
        e.connect(c.destination);
        "undefined" === typeof e.start ? e.noteOn(0) : e.start(0);
        setTimeout(function () {
          (e.playbackState === e.PLAYING_STATE ||
            e.playbackState === e.FINISHED_STATE) &&
            window.removeEventListener("touchend", b, !1);
        }, 0);
      };
      window.addEventListener("touchend", b, !1);
    },
    play: function () {
      console.log("play function runs 1");
      if (this.isSupported)
        if (this.webaudio.buffer) {
          if (
            (console.log("play function runs 2"),
            !this.muteFlag &&
              ((this.bgmPlaying = !0),
              console.log("play function runs 3"),
              !this.webaudio.source_loop._playing))
          ) {
            console.log("play function runs 4");
            this.webaudio.source_loop = this.webaudio.context.createBufferSource();
            this.webaudio.source_loop.buffer = this.webaudio.buffer;
            this.webaudio.source_loop.loop = !0;
            this.webaudio.source_loop.connect(this.webaudio.gainNode);
            var b = 0;
            this.pausedTime && (b = this.pausedTime);
            this.webaudio.source_loop._startTime = this.webaudio.context.currentTime;
            if ("noteOn" === this.webaudio.compatibility.start)
              (this.webaudio.source_once = this.webaudio.context.createBufferSource()),
                (this.webaudio.source_once.buffer = this.webaudio.buffer),
                this.webaudio.source_once.connect(this.webaudio.gainNode),
                this.webaudio.source_once.noteGrainOn(
                  0,
                  b,
                  this.webaudio.buffer.duration - b
                ),
                this.webaudio.source_loop[this.webaudio.compatibility.start](
                  this.webaudio.context.currentTime +
                    (this.webaudio.buffer.duration - b)
                );
            else
              this.webaudio.source_loop[this.webaudio.compatibility.start](
                0,
                b
              );
            this.webaudio.source_loop._playing = !0;
          }
        } else this.bgmPlaying = !0;
    },
    stop: function () {
      this.bgmPlaying = !1;
      if (
        this.isSupported &&
        this.webaudio.source_loop._playing &&
        (this.webaudio.source_loop[this.webaudio.compatibility.stop](0),
        (this.webaudio.source_loop._playing = !1),
        (this.pausedTime =
          this.webaudio.context.currentTime %
          this.webaudio.source_loop.buffer.duration),
        (this.webaudio.source_loop._startTime = 0),
        "noteOn" === this.webaudio.compatibility.start)
      )
        this.webaudio.source_once[this.webaudio.compatibility.stop](0);
    },
    volume: function (b) {
      this.isSupported &&
        this.webaudio.gainNode &&
        (this.webaudio.gainNode.gain.value = b);
    },
    getVolume: function () {
      return !this.isSupported || !this.webaudio.gainNode
        ? 0
        : this.webaudio.gainNode.gain.value;
    },
    mute: function () {
      !1 == this.muteFlag &&
        ((this.muteFlag = !0), this.bgmPlaying && this.stop());
    },
    unmute: function () {
      !0 == this.muteFlag && ((this.muteFlag = !1), this.play());
    },
  });
});
ig.baked = !0;
ig.module("plugins.fake-storage")
  .requires("impact.game")
  .defines(function () {
    ig.FakeStorage = ig.Class.extend({
      tempData: {},
      init: function () {
        ig.FakeStorage.instance = this;
      },
      initUnset: function (b, c) {
        null === this.get(b) && this.set(b, c);
      },
      set: function (b, c) {
        this.tempData[b] = JSON.stringify(c);
      },
      setHighest: function (b, c) {
        c > this.getFloat(b) && this.set(b, c);
      },
      get: function (b) {
        return "undefined" == typeof this.tempData[b]
          ? null
          : JSON.parse(this.tempData[b]);
      },
      getInt: function (b) {
        return ~~this.get(b);
      },
      getFloat: function (b) {
        return parseFloat(this.get(b));
      },
      getBool: function (b) {
        return !!this.get(b);
      },
      isSet: function (b) {
        return null !== this.get(b);
      },
      remove: function () {
        delete this.tempData.key;
      },
      clear: function () {
        this.tempData = {};
      },
    });
  });
this.START_BRANDING_SPLASH;
ig.baked = !0;
ig.module("plugins.branding.splash")
  .requires("impact.impact", "impact.entity")
  .defines(function () {
    ig.BrandingSplash = ig.Class.extend({
      init: function () {
        ig.game.spawnEntity(EntityBranding, 0, 0);
      },
    });
    EntityBranding = ig.Entity.extend({
      gravityFactor: 0,
      size: { x: 32, y: 32 },
      init: function (b, c, d) {
        this.parent(b, c, d);
        320 >= ig.system.width
          ? ((this.size.x = 320),
            (this.size.y = 200),
            (this.anims.idle = new ig.Animation(
              this.splash_320x480,
              0,
              [0],
              !0
            )))
          : ((this.size.x = 480),
            (this.size.y = 240),
            (this.anims.idle = new ig.Animation(
              this.splash_480x640,
              0,
              [0],
              !0
            )));
        this.pos.x = (ig.system.width - this.size.x) / 2;
        this.pos.y = -this.size.y - 200;
        this.endPosY = (ig.system.height - this.size.y) / 2;
        b = this.tween({ pos: { y: this.endPosY } }, 0.5, {
          easing: ig.Tween.Easing.Bounce.EaseIn,
        });
        c = this.tween({}, 2.5, {
          onComplete: function () {
            ig.game.director.loadLevel(ig.game.director.currentLevel);
          },
        });
        b.chain(c);
        b.start();
        this.currentAnim = this.anims.idle;
      },
      createClickableLayer: function () {
        console.log("Build clickable layer");
        this.checkClickableLayer(
          "branding-splash",
          _SETTINGS.Branding.Logo.Link,
          !0
        );
      },
      doesClickableLayerExist: function (b) {
        for (k in dynamicClickableEntityDivs) if (k == b) return !0;
        return !1;
      },
      checkClickableLayer: function (b, c, d) {
        "undefined" == typeof wm &&
          (this.doesClickableLayerExist(b)
            ? (ig.game.showOverlay([b]),
              $("#" + b)
                .find("[href]")
                .attr("href", c))
            : this.createClickableOutboundLayer(
                b,
                c,
                "media/graphics/misc/invisible.png",
                d
              ));
      },
      createClickableOutboundLayer: function (b, c, d, e) {
        var f = ig.$new("div");
        f.id = b;
        document.body.appendChild(f);
        $("#" + f.id).css("float", "left");
        $("#" + f.id).css("position", "absolute");
        if (ig.ua.mobile) {
          var j = window.innerHeight / mobileHeight,
            m = window.innerWidth / mobileWidth;
          $("#" + f.id).css("left", this.pos.x * m);
          $("#" + f.id).css("top", this.pos.y * j);
          $("#" + f.id).css("width", this.size.x * m);
          $("#" + f.id).css("height", this.size.y * j);
        } else
          (j = w / 2 - destW / 2),
            (m = h / 2 - destH / 2),
            console.log(j, m),
            $("#" + f.id).css("left", j + this.pos.x * multiplier),
            $("#" + f.id).css("top", m + this.pos.y * multiplier),
            $("#" + f.id).css("width", this.size.x * multiplier),
            $("#" + f.id).css("height", this.size.y * multiplier);
        e
          ? $("#" + f.id).html(
              "<a target='_blank' href='" +
                c +
                "'><img style='width:100%;height:100%' src='" +
                d +
                "'></a>"
            )
          : $("#" + f.id).html(
              "<a href='" +
                c +
                "'><img style='width:100%;height:100%' src='" +
                d +
                "'></a>"
            );
        dynamicClickableEntityDivs[b] = {};
        dynamicClickableEntityDivs[b].width = this.size.x * multiplier;
        dynamicClickableEntityDivs[b].height = this.size.y * multiplier;
        dynamicClickableEntityDivs[b].entity_pos_x = this.pos.x;
        dynamicClickableEntityDivs[b].entity_pos_y = this.pos.y;
      },
      draw: function () {
        ig.system.context.fillStyle = "#ffffff";
        ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
        this.parent();
      },
    });
  });
this.END_BRANDING_SPLASH;
ig.baked = !0;
ig.module("game.entities.branding-logo-placeholder")
  .requires("impact.entity")
  .defines(function () {
    EntityBrandingLogoPlaceholder = ig.Entity.extend({
      gravityFactor: 0,
      size: { x: 32, y: 32 },
      _wmDrawBox: !0,
      _wmBoxColor: "rgba(0, 0, 255, 0.7)",
      init: function (b, c, d) {
        this.parent(b, c, d);
        if (d)
          switch (
            (console.log("settings found ... using that div layer name"),
            (b = d.div_layer_name),
            console.log("settings.centralize:", d.centralize),
            d.centralize)
          ) {
            case "true":
              console.log("centralize true");
              centralize = !0;
              break;
            case "false":
              console.log("centralize false");
              centralize = !1;
              break;
            default:
              console.log("default ... centralize false"), (centralize = !1);
          }
        else (b = "branding-logo"), (centralize = !1);
        if ("undefined" == typeof wm) {
          if (_SETTINGS.Branding.Logo.Enabled)
            try {
              ig.game.spawnEntity(EntityBrandingLogo, this.pos.x, this.pos.y, {
                div_layer_name: b,
                centralize: centralize,
              });
            } catch (e) {
              console.log(e);
            }
          this.kill();
        }
      },
    });
  });
this.START_BRANDING_LOGO;
ig.baked = !0;
ig.module("game.entities.branding-logo")
  .requires("impact.entity")
  .defines(function () {
    EntityBrandingLogo = ig.Entity.extend({
      gravityFactor: 0,
      size: { x: 32, y: 32 },
      zIndex: 10001,
      init: function (b, c, d) {
        this.parent(b, c, d);
        "undefined" == typeof wm &&
          (_SETTINGS.Branding.Logo.Enabled
            ? ((this.size.x = _SETTINGS.Branding.Logo.Width),
              (this.size.y = _SETTINGS.Branding.Logo.Height),
              d &&
                d.centralize &&
                ((this.pos.x = ig.system.width / 2 - this.size.x / 2),
                console.log("centralize true ... centering branded logo ...")))
            : this.kill());
        this.anims.idle = new ig.Animation(this.logo, 0, [0], !0);
        this.currentAnim = this.anims.idle;
        d
          ? (console.log(
              "branding settings found ... using that div layer name"
            ),
            (b = d.div_layer_name))
          : (b = "branding-logo");
        _SETTINGS.Branding.Logo.LinkEnabled &&
          (console.log("logo link enabled"),
          this.checkClickableLayer(b, _SETTINGS.Branding.Logo.Link, !0));
        console.log("branding logo spawed ...");
      },
      doesClickableLayerExist: function (b) {
        for (k in dynamicClickableEntityDivs) if (k == b) return !0;
        return !1;
      },
      checkClickableLayer: function (b, c, d) {
        "undefined" == typeof wm &&
          (this.doesClickableLayerExist(b)
            ? (ig.game.showOverlay([b]),
              $("#" + b)
                .find("[href]")
                .attr("href", c))
            : this.createClickableOutboundLayer(
                b,
                c,
                "media/graphics/misc/invisible.png",
                d
              ));
      },
      createClickableOutboundLayer: function (b, c, d, e) {
        var f = ig.$new("div");
        f.id = b;
        document.body.appendChild(f);
        $("#" + f.id).css("float", "left");
        $("#" + f.id).css("position", "absolute");
        if (ig.ua.mobile) {
          var j = window.innerHeight / mobileHeight,
            m = window.innerWidth / mobileWidth;
          $("#" + f.id).css("left", this.pos.x * m);
          $("#" + f.id).css("top", this.pos.y * j);
          $("#" + f.id).css("width", this.size.x * m);
          $("#" + f.id).css("height", this.size.y * j);
        } else
          (j = w / 2 - destW / 2),
            (m = h / 2 - destH / 2),
            console.log(j, m),
            $("#" + f.id).css("left", j + this.pos.x * multiplier),
            $("#" + f.id).css("top", m + this.pos.y * multiplier),
            $("#" + f.id).css("width", this.size.x * multiplier),
            $("#" + f.id).css("height", this.size.y * multiplier);
        e
          ? $("#" + f.id).html(
              "<a target='_blank' href='" +
                c +
                "'><img style='width:100%;height:100%' src='" +
                d +
                "'></a>"
            )
          : $("#" + f.id).html(
              "<a href='" +
                c +
                "'><img style='width:100%;height:100%' src='" +
                d +
                "'></a>"
            );
        dynamicClickableEntityDivs[b] = {};
        dynamicClickableEntityDivs[b].width = this.size.x * multiplier;
        dynamicClickableEntityDivs[b].height = this.size.y * multiplier;
        dynamicClickableEntityDivs[b].entity_pos_x = this.pos.x;
        dynamicClickableEntityDivs[b].entity_pos_y = this.pos.y;
      },
    });
  });
this.END_BRANDING_LOGO;
ig.baked = !0;
ig.module("game.entities.button-more-games")
  .requires("impact.entity")
  .defines(function () {
    EntityButtonMoreGames = ig.Entity.extend({
      size: { x: 176, y: 116 },
      zIndex: 750,
      type: ig.Entity.TYPE.B,
      init: function (b, c, d) {
        this.parent(b, c, d);
      },
      ready: function () {
        setTimeout(this.spawnDiv(), 5);
      },
      spawnDiv: function () {
        if (!this.canSpawnDiv)
          if (((this.canSpawnDiv = !0), _SETTINGS.MoreGames.Enabled)) {
            var b;
            b = this.divLayerName ? this.divLayerName : "more-games";
            this.checkClickableLayer(
              b,
              _SETTINGS.MoreGames.Link,
              _SETTINGS.MoreGames.NewWindow
            );
            if (ig.ua.mobile) {
              var c = window.innerHeight / mobileHeight,
                d = window.innerWidth / mobileWidth;
              $("#" + b).css("left", this.pos.x * d);
              $("#" + b).css("top", this.pos.y * c);
              $("#" + b).css("width", this.size.x * d);
              $("#" + b).css("height", this.size.y * c);
            } else
              (c = document.getElementById("game").offsetLeft),
                (d = document.getElementById("game").offsetTop),
                $("#" + b).css("left", c + this.pos.x * multiplier),
                $("#" + b).css("top", d + this.pos.y * multiplier),
                $("#" + b).css("width", this.size.x * multiplier),
                $("#" + b).css("height", this.size.y * multiplier);
          } else this.kill();
      },
      doesClickableLayerExist: function (b) {
        for (k in dynamicClickableEntityDivs) if (k == b) return !0;
        return !1;
      },
      checkClickableLayer: function (b, c, d) {
        "undefined" == typeof wm &&
          (this.doesClickableLayerExist(b)
            ? (ig.game.showOverlay([b]),
              $("#" + b)
                .find("[href]")
                .attr("href", c))
            : this.createClickableOutboundLayer(
                b,
                c,
                "media/graphics/misc/invisible.png",
                d
              ));
      },
      createClickableOutboundLayer: function (b, c, d, e) {
        var f = ig.$new("div");
        f.id = b;
        document.body.appendChild(f);
        $("#" + f.id).css("float", "left");
        $("#" + f.id).css("position", "absolute");
        if (ig.ua.mobile) {
          var j = window.innerHeight / mobileHeight,
            m = window.innerWidth / mobileWidth;
          $("#" + f.id).css("left", this.pos.x * m);
          $("#" + f.id).css("top", this.pos.y * j);
          $("#" + f.id).css("width", this.size.x * m);
          $("#" + f.id).css("height", this.size.y * j);
        } else
          (j = document.getElementById("game").offsetLeft),
            (m = document.getElementById("game").offsetTop),
            $("#" + f.id).css("left", j + this.pos.x * multiplier),
            $("#" + f.id).css("top", m + this.pos.y * multiplier),
            $("#" + f.id).css("width", this.size.x * multiplier),
            $("#" + f.id).css("height", this.size.y * multiplier);
        e
          ? $("#" + f.id).html(
              "<a target='_blank' href='" +
                c +
                "'><img style='width:100%;height:100%' src='" +
                d +
                "'></a>"
            )
          : $("#" + f.id).html(
              "<a href='" +
                c +
                "'><img style='width:100%;height:100%' src='" +
                d +
                "'></a>"
            );
        dynamicClickableEntityDivs[b] = {};
        dynamicClickableEntityDivs[b].width = this.size.x * multiplier;
        dynamicClickableEntityDivs[b].height = this.size.y * multiplier;
        dynamicClickableEntityDivs[b].entity_pos_x = this.pos.x;
        dynamicClickableEntityDivs[b].entity_pos_y = this.pos.y;
      },
      hide: function () {
        var b = "more-games";
        this.divLayerName && (b = this.divLayerName);
        document.getElementById(b).style.visibility = "hidden";
        $("#" + b).hide();
      },
      show: function () {
        var b = "more-games";
        this.divLayerName && (b = this.divLayerName);
        document.getElementById(b).style.visibility = "visible";
        $("#" + b).show();
      },
      clicking: function () {},
      released: function () {},
      over: function () {},
      leave: function () {},
    });
  });
ig.baked = !0;
ig.module("game.entities.opening-shield")
  .requires("impact.entity")
  .defines(function () {
    EntityOpeningShield = ig.Entity.extend({
      size: { x: 48, y: 48 },
      move: 0,
      mIconAnim: 0,
      shieldAnim: 0,
      titleAnim: 0,
      init: function (b, c, d) {
        this.parent(b, c, d);
      },
      ready: function () {
        if (!ig.wm)
          if (_SETTINGS.DeveloperBranding.Splash.Enabled) {
            this.initTimer = new ig.Timer(0.1);
            try {
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.openingSound);
            } catch (b) {
              console.log(b);
            }
          } else
            ig.game.director.nextLevel(),
              (ig.system.context.globalAlpha = 1),
              this.kill();
      },
      update: function () {
        this.parent();
        this.updateOriginalShieldOpening();
      },
      draw: function () {
        this.parent();
        ig.global.wm ||
          (this.nextLevelTimer &&
            0 > this.nextLevelTimer.delta() &&
            (ig.system.context.globalAlpha = -this.nextLevelTimer.delta()),
          this.drawOriginalShieldOpening());
      },
      updateOriginalShieldOpening: function () {
        this.initTimer &&
          0 < this.initTimer.delta() &&
          ((this.initTimer = null), (this.sheildTimer = new ig.Timer(0.05)));
        this.sheildTimer &&
          0 < this.sheildTimer.delta() &&
          (3 > this.shieldAnim
            ? (this.shieldAnim++, this.sheildTimer.reset())
            : ((this.sheildTimer = null),
              (this.moveTimer = new ig.Timer(0.001)),
              (this.mIconTimer = new ig.Timer(0.05)),
              (this.titleTimer = new ig.Timer(0.15))));
        this.moveTimer &&
          0 < this.moveTimer.delta() &&
          ((this.move += 0.3), this.moveTimer.reset());
        this.mIconTimer &&
          0 < this.mIconTimer.delta() &&
          (12 > this.mIconAnim
            ? (this.mIconAnim++, this.moveTimer.reset())
            : (this.mIconTimer = null));
        this.titleTimer &&
          0 < this.titleTimer.delta() &&
          (11 > this.titleAnim
            ? (this.titleAnim++, this.titleTimer.reset())
            : ((this.titleTimer = null),
              (this.nextLevelTimer = new ig.Timer(1))));
        this.nextLevelTimer &&
          0 < this.nextLevelTimer.delta() &&
          ((this.nextLevelTimer = null),
          ig.game.director.nextLevel(),
          (ig.system.context.globalAlpha = 1));
      },
      drawOriginalShieldOpening: function () {
        if (this.moveTimer) {
          var b = ig.system.context;
          b.save();
          var c = ig.system.width / 2,
            d = ig.system.height / 2;
          b.translate(c, d);
          b.rotate((this.move * Math.PI) / 180);
          b.beginPath();
          b.moveTo(0, 0);
          for (var e = 0, f = 1; 48 >= f; f += 1)
            b.lineTo(
              0 + 800 * Math.cos((2 * f * Math.PI) / 48),
              0 + 800 * Math.sin((2 * f * Math.PI) / 48)
            ),
              e++,
              2 == e && ((e = 0), b.lineTo(0, 0));
          b.translate(-c, -d);
          c = b.createRadialGradient(c, d, 100, c, d, 250);
          c.addColorStop(0, "rgba(255,255,255,0.1)");
          c.addColorStop(1, "rgba(0,0,0,0)");
          b.fillStyle = c;
          b.fill();
          b.restore();
        }
        ig.system.context.globalAlpha = 1;
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.opening-kitty")
  .requires("impact.entity")
  .defines(function () {
    EntityOpeningKitty = ig.Entity.extend({
      size: { x: 48, y: 48 },
      kittyAnim: -1,
      init: function (b, c, d) {
        this.parent(b, c, d);
      },
      ready: function () {
        if (!ig.wm)
          if (_SETTINGS.DeveloperBranding.Splash.Enabled) {
            this.initTimer = new ig.Timer(0.1);
            try {
              ig.soundHandler.playSound(
                ig.soundHandler.SOUNDID.kittyopeningSound
              );
            } catch (b) {
              console.log(b);
            }
          } else
            ig.game.director.nextLevel(),
              (ig.system.context.globalAlpha = 1),
              this.kill();
      },
      update: function () {
        this.parent();
        this.updateKittyOpening();
      },
      draw: function () {
        this.parent();
        ig.global.wm ||
          (this.nextLevelTimer &&
            0 > this.nextLevelTimer.delta() &&
            (ig.system.context.globalAlpha = -this.nextLevelTimer.delta()),
          this.drawKittyOpening());
      },
      updateKittyOpening: function () {
        this.initTimer &&
          0 < this.initTimer.delta() &&
          ((this.initTimer = null), (this.kittyTimer = new ig.Timer(0.15)));
        this.kittyTimer &&
          0 < this.kittyTimer.delta() &&
          (7 > this.kittyAnim
            ? (this.kittyAnim++, this.kittyTimer.reset())
            : ((this.kittyTimer = null),
              (this.nextLevelTimer = new ig.Timer(2))));
        this.nextLevelTimer &&
          0 < this.nextLevelTimer.delta() &&
          ((this.nextLevelTimer = null),
          ig.game.director.nextLevel(),
          (ig.system.context.globalAlpha = 1));
      },
      drawKittyOpening: function () {
        var b = ig.system.context.createLinearGradient(
          0,
          0,
          0,
          ig.system.height
        );
        b.addColorStop(0, "#ffed94");
        b.addColorStop(1, "#ffcd85");
        ig.system.context.fillStyle = b;
        ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
        ig.system.context.globalAlpha = 1;
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.pointer")
  .requires("impact.entity")
  .defines(function () {
    EntityPointer = ig.Entity.extend({
      type: ig.Entity.TYPE.A,
      checkAgainst: ig.Entity.TYPE.B,
      isClicking: !1,
      isHovering: !1,
      firstClick: !1,
      isReleased: !1,
      hoveringItem: null,
      objectArray: [],
      ignorePause: !0,
      zIndex: 5e3,
      check: function (b) {
        this.objectArray.push(b);
      },
      clickObject: function (b) {
        this.isClicking &&
          !this.firstClick &&
          "function" == typeof b.clicked &&
          b.clicked();
        this.firstClick &&
          !this.isReleased &&
          "function" == typeof b.clicking &&
          b.clicking();
        this.firstClick &&
          this.isReleased &&
          "function" == typeof b.released &&
          b.released();
      },
      refreshPos: function () {
        if (ig.ua.mobile) {
          var b = multiplier;
          this.pos.x =
            ig.input.mouse.x / multiplier - this.size.x / 2 + ig.game.screen.x;
          this.pos.y = ig.input.mouse.y / b - this.size.y / 2;
        } else
          (this.pos.x =
            ig.input.mouse.x / 1 - this.size.x / 2 + ig.game.screen.x),
            (this.pos.y = ig.input.mouse.y / 1 - this.size.y / 2);
      },
      update: function () {
        this.refreshPos();
        var b = null,
          c = -1;
        for (a = this.objectArray.length - 1; -1 < a; a--)
          this.objectArray[a].zIndex > c &&
            ((c = this.objectArray[a].zIndex), (b = this.objectArray[a]));
        null != b
          ? (null != this.hoveringItem &&
              "function" == typeof this.hoveringItem.leave &&
              this.hoveringItem != b &&
              this.hoveringItem.leave(),
            null != this.hoveringItem &&
              "function" == typeof this.hoveringItem.over &&
              this.hoveringItem == b &&
              this.hoveringItem.over(),
            (this.hoveringItem = b),
            this.clickObject(b),
            (this.objectArray = []))
          : null != this.hoveringItem &&
            "function" == typeof this.hoveringItem.leave &&
            (this.hoveringItem.leave(), (this.hoveringItem = null));
        this.isClicking && !this.firstClick
          ? (this.firstClick = !0)
          : this.isReleased && this.firstClick && (this.firstClick = !1);
        this.isClicking = ig.input.pressed("click");
        this.isReleased = ig.input.released("click");
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.pointer-selector")
  .requires("game.entities.pointer")
  .defines(function () {
    EntityPointerSelector = EntityPointer.extend({
      zIndex: 5e3,
      _wmDrawBox: !0,
      _wmBoxColor: "rgba(0, 0, 255, 0.7)",
      size: { x: 15, y: 15 },
      init: function (b, c, d) {
        this.parent(b, c, d);
      },
    });
  });
ig.baked = !0;
ig.module("game.levels.opening")
  .requires("impact.image", "game.entities.opening-kitty")
  .defines(function () {
    LevelOpening = {
      entities: [{ type: "EntityOpeningKitty", x: 520, y: 212 }],
      layer: [],
    };
  });
ig.baked = !0;
ig.module("game.entities.audio-toggle")
  .requires("impact.entity")
  .defines(function () {
    EntityAudioToggle = ig.Entity.extend({
      zIndex: 3e3,
      togglePos: { x: 0, y: 0 },
      toggleRect: { x: -27, y: -28, w: 54, h: 56 },
      toggleOffset: { x: 0, y: 0 },
      toggleAlpha: 1,
      toggleDown: !1,
      pointer: null,
      control: null,
      hidden: !1,
      init: function (b, c, d) {
        this.parent(b, c, d);
      },
      ready: function () {
        this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];
        (this.control = ig.game.getEntitiesByType(EntityHomeControl)[0]) ||
          (this.control = ig.game.getEntitiesByType(EntityGameControl)[0]);
        this.control ||
          (this.control = ig.game.getEntitiesByType(EntityShopControl)[0]);
      },
      draw: function () {
        if (!this.hidden) {
          var b = ig.system.context;
          b.save();
          b.globalAlpha = this.toggleAlpha;
          b.restore();
        }
      },
      update: function () {
        this.hidden || this.checkClicks();
      },
      aabbCheck: function (b, c) {
        return b.x + b.w > c.x &&
          b.x < c.x + c.w &&
          b.y + b.h > c.y &&
          b.y < c.y + c.h
          ? !0
          : !1;
      },
      checkClicks: function () {
        this.pointer.refreshPos();
        var b = {};
        ig.ua.mobile
          ? ((b.x = this.pointer.pos.x + this.pointer.size.x / 2),
            (b.y = this.pointer.pos.y + this.pointer.size.y / 2))
          : ((b.x = this.pointer.pos.x / multiplier + this.pointer.size.x / 2),
            (b.y = this.pointer.pos.y / multiplier + this.pointer.size.y / 2));
        b.w = 1;
        b.h = 1;
        var c = {};
        c.x = this.pos.x + this.togglePos.x + this.toggleRect.x;
        c.y = this.pos.y + this.togglePos.y + this.toggleRect.y;
        c.w = this.toggleRect.w;
        c.h = this.toggleRect.h;
        this.toggleDown = !1;
        this.aabbCheck(b, c) &&
          (ig.input.state("click") && (this.toggleDown = !0),
          ig.input.released("click") &&
            ((this.toggleDown = !1),
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button),
            ig.game.muted ? this.unmuteAudio() : this.muteAudio()));
      },
      muteAudio: function () {
        ig.game.muted = !0;
        ig.soundHandler.setMusicVolume(0);
        ig.soundHandler.setSfxVolume(0);
        ig.game.webaudioPlugin.mute();
        ig.game.savePlayerStats();
      },
      unmuteAudio: function () {
        ig.game.muted = !1;
        ig.soundHandler.setMusicVolume(ig.game.musicVolume);
        ig.soundHandler.setSfxVolume(ig.game.sfxVolume);
        ig.game.webaudioPlugin.unmute();
        ig.game.savePlayerStats();
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.shop-control")
  .requires("impact.entity")
  .defines(function () {
    EntityShopControl = ig.Entity.extend({
      zIndex: 7e3,
      pointer: null,
      control: null,
      gControl: null,
      solidBg: new ig.Image("media/graphics/game/backgrounds/bg.png"),
      bgImage: new ig.Image("media/graphics/game/backgrounds/mainbg.png"),
      coinImage: new ig.Image("media/graphics/game/ui/game/coinicon.png"),
      coinRect: { x: 20, y: 75, w: 41, h: 42 },
      coinCountPos: { x: 90, y: 126 },
      lifeImage: new ig.Image("media/graphics/game/ui/game/lifeicon.png"),
      lifeRect: { x: 320, y: 350, w: 40, h: 40 },
      titleImage: new ig.Image(
        "media/graphics/game/ui/mainmenu/shop-title.png"
      ),
      titlePos: { x: 202, y: 64 },
      panelGreyImage: new ig.Image(
        "media/graphics/game/ui/game/shop-panel0.png"
      ),
      panelImage: new ig.Image("media/graphics/game/ui/game/shop-panel1.png"),
      panelPos: { x: 257, y: 245 },
      panelOffset: { x: 0, y: 0 },
      panelAlpha: 1,
      itemImage: [
        new ig.Image("media/graphics/game/ui/game/upg0.png"),
        new ig.Image("media/graphics/game/ui/game/upg1.png"),
        new ig.Image("media/graphics/game/ui/game/upg2.png"),
        new ig.Image("media/graphics/game/ui/game/upg3.png"),
        new ig.Image("media/graphics/game/ui/game/upg4.png"),
        new ig.Image("media/graphics/game/ui/game/upg5.png"),
        new ig.Image("media/graphics/game/ui/game/upg6.png"),
        new ig.Image("media/graphics/game/ui/game/upg7.png"),
      ],
      itemId: 0,
      itemPos: { x: 250, y: 310 },
      itemTextPos: { x: 320, y: 248 },
      arrowSheet: new ig.AnimationSheet(
        "media/graphics/game/ui/game/arrow.png",
        77,
        79
      ),
      arrowRightAnimUp: null,
      arrowRightAnimDown: null,
      arrowRightAnim: null,
      arrowRightRect: { x: 490, y: 330, w: 77, h: 79 },
      arrowLeftAnimUp: null,
      arrowLeftAnimDown: null,
      arrowLeftAnim: null,
      arrowLeftRect: { x: 75, y: 330, w: 77, h: 79 },
      buttonSheet: new ig.AnimationSheet(
        "media/graphics/game/ui/game/shop-button.png",
        119,
        65
      ),
      buttonAnimUp: null,
      buttonAnimDown: null,
      buttonAnim: null,
      buttonRect: { x: 259, y: 510, w: 119, h: 65 },
      buttonOffset: { x: 0, y: 0 },
      homeSheet: new ig.AnimationSheet(
        "media/graphics/game/ui/game/play.png",
        110,
        122
      ),
      homeAnimUp: null,
      homeAnimDown: null,
      homeAnimHover: null,
      homeAnim: null,
      homeRect: { x: 270, y: 450, w: 110, h: 122 },
      homeOffset: { x: 0, y: 0 },
      resumeSheet: new ig.AnimationSheet(
        "media/graphics/game/ui/game/play.png",
        110,
        122
      ),
      resumeAnimUp: null,
      resumeAnimDown: null,
      resumeAnimHover: null,
      resumeAnim: null,
      resumeRect: { x: 270, y: 450, w: 110, h: 122 },
      resumeOffset: { x: 0, y: 0 },
      skateboardPrice: 1e3,
      hidden: !0,
      showDone: !1,
      hideDone: !1,
      isShowing: !1,
      isHiding: !1,
      showTime: 0,
      showDuration: 0.5,
      hideTime: 0,
      hideDuration: 0.5,
      alpha: 0,
      pagingLeft: !1,
      pagingRight: !1,
      pagingTime: 0,
      toHome: !1,
      fromGame: !1,
      inGameOnShop: !1,
      hidePlayButton: !1,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.titlePos.x = ig.system.width / 2 - this.titleImage.width / 2;
        this.panelPos.x = ig.system.width / 2 - this.panelImage.width / 2;
        this.itemTextPos.x = ig.system.width / 2;
        this.itemTextPos.y = this.panelPos.y + 55;
        this.buttonRect.x = ig.system.width / 2 - 61;
        this.buttonAnimUp = new ig.Animation(this.buttonSheet, 0.1, [0]);
        this.buttonAnimDown = new ig.Animation(this.buttonSheet, 0.1, [1]);
        this.buttonAnim = this.buttonAnimUp;
        this.homeAnimUp = new ig.Animation(this.homeSheet, 0.1, [0]);
        this.homeAnimDown = new ig.Animation(this.homeSheet, 0.1, [2]);
        this.homeAnimHover = new ig.Animation(this.homeSheet, 0.1, [1]);
        this.homeAnim = this.homeAnimUp;
        this.resumeAnimUp = new ig.Animation(this.resumeSheet, 0.1, [0]);
        this.resumeAnimDown = new ig.Animation(this.resumeSheet, 0.1, [2]);
        this.resumeAnimHover = new ig.Animation(this.resumeSheet, 0.1, [1]);
        this.resumeAnim = this.resumeAnimUp;
        this.arrowLeftAnimUp = new ig.Animation(this.arrowSheet, 0.1, [0]);
        this.arrowLeftAnimDown = new ig.Animation(this.arrowSheet, 0.1, [1]);
        this.arrowLeftAnim = this.arrowLeftAnimUp;
        this.arrowLeftAnimUp.flip.x = !0;
        this.arrowLeftAnimDown.flip.x = !0;
        this.arrowRightAnimUp = new ig.Animation(this.arrowSheet, 0.1, [0]);
        this.arrowRightAnimDown = new ig.Animation(this.arrowSheet, 0.1, [1]);
        this.arrowRightAnim = this.arrowRightAnimUp;
        this.lifeRect.x = this.panelPos.x + this.panelImage.width - 45;
        this.alpha = 0;
      },
      ready: function () {
        this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];
        (this.control = ig.game.getEntitiesByType(EntityHomeControl)[0]) ||
          (this.gControl = ig.game.getEntitiesByType(EntityGameControl)[0]);
      },
      draw: function () {
        if (!this.hidden) {
          this.control ||
            (ig.system.context.drawImage(
              this.solidBg.data,
              0,
              0,
              ig.system.width,
              ig.system.height
            ),
            isHeightBigger
              ? this.bgImage.draw(0, heightOffset)
              : this.bgImage.draw(0, halfHeightOffset));
          ig.system.context.globalAlpha = this.control
            ? this.control.inShop
              ? 0.7
              : 0
            : 0.7;
          ig.system.context.fillStyle = "#000000";
          ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
          ig.system.context.globalAlpha = 1;
          ig.system.context.globalAlpha = this.alpha;
          this.titleImage.draw(this.titlePos.x, this.titlePos.y);
          ig.system.context.globalAlpha =
            1 <= this.alpha ? this.panelAlpha : this.alpha;
          ig.game.getItemUpgradeStatus(this.itemId)
            ? this.panelImage.draw(
                this.panelPos.x + this.panelOffset.x,
                this.panelPos.y + this.panelOffset.y
              )
            : this.panelGreyImage.draw(
                this.panelPos.x + this.panelOffset.x,
                this.panelPos.y + this.panelOffset.y
              );
          3 <= this.itemId
            ? this.itemImage[this.itemId].draw(
                this.itemPos.x + 22 + this.panelOffset.x,
                this.itemPos.y + this.panelOffset.y
              )
            : this.itemImage[this.itemId].draw(
                this.itemPos.x + this.panelOffset.x,
                this.itemPos.y + this.panelOffset.y
              );
          ig.system.context.textAlign = "center";
          ig.system.context.font = "18px mainfont, Helvetica, Verdana";
          ig.system.context.fillStyle = "#1A4283";
          ig.system.context.fillText(
            ig.game.getItemUpgradeName(this.itemId),
            this.itemTextPos.x + this.panelOffset.x,
            this.itemTextPos.y + this.panelOffset.y
          );
          if (!ig.game.getItemUpgradeStatus(this.itemId)) {
            this.buttonAnim.draw(this.buttonRect.x, this.buttonRect.y);
            ig.system.context.textAlign = "center";
            ig.system.context.font = "16px mainfont, Helvetica, Verdana";
            ig.system.context.fillStyle = "#1A4283";
            var b =
                this.buttonRect.x -
                17 +
                this.buttonRect.w / 2 +
                this.buttonOffset.x,
              c =
                this.buttonRect.y -
                27 +
                this.buttonRect.h +
                this.buttonOffset.y;
            ig.system.context.fillText(
              ig.game.getItemUpgradePrice(this.itemId),
              b,
              c
            );
          }
          for (
            b = 0;
            b < ig.game.upgrades.length && !ig.game.upgrades[b].equipped;
            b++
          );
          ig.system.context.globalAlpha = this.alpha;
          this.arrowLeftAnim.draw(this.arrowLeftRect.x, this.arrowLeftRect.y);
          this.arrowRightAnim.draw(
            this.arrowRightRect.x,
            this.arrowRightRect.y
          );
          this.hidePlayButton ||
            (this.fromGame
              ? this.resumeAnim.draw(this.resumeRect.x, this.resumeRect.y)
              : this.homeAnim.draw(this.homeRect.x, this.homeRect.y));
          this.coinImage.draw(this.coinRect.x, this.coinRect.y);
          ig.system.context.textAlign = "left";
          ig.system.context.font = "20px mainfont, Helvetica, Verdana";
          ig.system.context.fillStyle = "#000000";
          ig.system.context.fillText(
            ig.game.money,
            this.coinCountPos.x + 2,
            this.coinCountPos.y + 2
          );
          ig.system.context.fillStyle = "#ffffff";
          ig.system.context.fillText(
            ig.game.money,
            this.coinCountPos.x,
            this.coinCountPos.y
          );
          ig.system.context.globalAlpha = 1;
        }
      },
      show: function () {
        this.hidden = !1;
        this.isShowing = this.inGameOnShop = !0;
        this.hideDone = this.showDone = !1;
        this.showTime = ig.system.clock.delta();
        var b = this.showDuration;
        this.offset.y = ig.system.height;
        this.tweenObj = this.tween({ offset: { x: 0, y: 0 } }, b, {
          easing: ig.Tween.Easing.Elastic.EaseOut,
          entity: this,
          onComplete: function () {
            this.entity.showDone = !0;
            this.entity.isShowing = !1;
            this.entity.control && (this.entity.control.inShop = !0);
          },
        });
        this.tweenObj.start();
        ig.game.visitedShop = !0;
        ig.game.savePlayerStats();
        if ((b = ig.game.getEntitiesByType(EntitySelectScreen)[0]))
          b.hiding = !0;
      },
      hide: function () {
        this.isHiding = !0;
        this.hideDone = this.showDone = !1;
        this.hideTime = ig.system.clock.delta();
        var b = this.hideDuration;
        this.offset.y = 0;
        if (this.control) {
          this.control.blackCover = !0;
          for (b = 0; b < ig.game.upgrades.length; b++)
            ig.game.upgrades[b].equipped = !1;
          ig.game.upgrades[this.itemId].equipped = !0;
          ig.game.savePlayerStats();
          ig.input.clearPressed();
          ig.game.firstrun &&
            ((ig.game.doTutorialFlag = !0),
            (ig.game.firstrun = !1),
            ig.game.savePlayerStats());
          ig.game.resetStats();
        } else if (
          ((this.tweenObj = this.tween(
            { offset: { x: 0, y: ig.system.height } },
            b,
            {
              easing: ig.Tween.Easing.Elastic.EaseIn,
              entity: this,
              onComplete: function () {
                this.entity.hideDone = !0;
                this.entity.hidden = !0;
                this.entity.isHiding = !1;
                this.entity.control ||
                  (this.entity.toHome
                    ? ig.game.director.jumpTo(LevelHome)
                    : ((this.entity.gControl.ui.shopWindow = !1),
                      (this.entity.gControl.pressDelay = 5),
                      this.entity.gControl.unpauseGame()));
                this.entity.inGameOnShop = !1;
              },
            }
          )),
          this.tweenObj.start(),
          (this.alpha = 0),
          this.control && (this.control.inShop = !1),
          (b = ig.game.getEntitiesByType(EntitySelectScreen)[0]))
        )
          (b.hiding = !1), (b.alpha = 0), b.updateChar();
      },
      update: function () {
        if (!this.hidden) {
          isHeightBigger
            ? ((this.coinRect.y = 75 + heightOffset),
              (this.coinCountPos.y = 126 + heightOffset),
              (this.lifeRect.y = 350 + heightOffset),
              (this.titlePos.y = 64 + heightOffset),
              (this.panelPos.y = 245 + heightOffset),
              (this.itemPos.y = 310 + heightOffset),
              (this.arrowRightRect.y = 330 + heightOffset),
              (this.arrowLeftRect.y = 330 + heightOffset),
              (this.buttonRect.y = 510 + heightOffset),
              (this.homeRect.y = 600 + heightOffset),
              (this.resumeRect.y = 600 + heightOffset),
              (this.itemTextPos.y = 300 + heightOffset))
            : ((this.lifeRect.y = 350 + halfHeightOffset),
              (this.panelPos.y = 245 + halfHeightOffset),
              (this.itemPos.y = 310 + halfHeightOffset),
              (this.arrowRightRect.y = 330 + halfHeightOffset),
              (this.arrowLeftRect.y = 330 + halfHeightOffset),
              (this.buttonRect.y = 510 + halfHeightOffset),
              (this.homeRect.y = 600 + halfHeightOffset),
              (this.resumeRect.y = 600 + halfHeightOffset),
              (this.itemTextPos.y = 300 + halfHeightOffset));
          this.hidePlayButton = !ig.game.getItemUpgradeStatus(this.itemId);
          if (this.isShowing) {
            var b = ig.system.clock.delta() - this.showTime;
            b > this.showDuration / 2 && (b = this.showDuration / 2);
            b /= this.showDuration / 2;
            this.control
              ? (this.control.mainMenuAlpha = 1 - b)
              : (this.gControl.mainMenuAlpha = 1 - b);
            b = ig.system.clock.delta() - this.showTime;
            b >= this.showDuration / 2 &&
              ((b -= this.showDuration / 2),
              b > this.showDuration / 2 && (b = this.showDuration / 2),
              (this.alpha = b /= this.showDuration / 2));
          }
          this.isHiding &&
            ((b = ig.system.clock.delta() - this.hideTime),
            b > this.hideDuration / 2 && (b = this.hideDuration / 2),
            (b /= this.hideDuration / 2),
            (this.alpha = 1 - b),
            (b = ig.system.clock.delta() - this.hideTime),
            b >= this.hideDuration / 2 &&
              ((b -= this.hideDuration / 2),
              b > this.hideDuration / 2 && (b = this.hideDuration / 2),
              (b /= this.hideDuration / 2),
              this.control
                ? (this.control.mainMenuAlpha = b)
                : (this.gControl.mainMenuAlpha = b)));
          this.tweenObj && this.tweenObj.update();
          this.showDone && this.checkClicks();
          this.pagingRight &&
            ((b = ig.system.clock.delta() - this.pagingTime),
            0.5 >= b
              ? ((b /= 0.5),
                (this.panelAlpha = 1 - b * b),
                (this.panelOffset.x -= 200 * ig.system.tick))
              : 1 >= b
              ? (0.5 >= b - ig.system.tick &&
                  ((this.panelOffset.x = 100),
                  (this.itemId += 1),
                  this.itemId >= this.itemImage.length && (this.itemId = 0)),
                (b = (b - 0.5) / 0.5),
                (this.panelAlpha = b * b),
                (this.panelOffset.x -= 200 * ig.system.tick))
              : ((this.pagingRight = !1), (this.panelOffset.x = 0)));
          this.pagingLeft &&
            ((b = ig.system.clock.delta() - this.pagingTime),
            0.5 >= b
              ? ((b /= 0.5),
                1 < b && (b = 1),
                (this.panelAlpha = 1 - b * b),
                (this.panelOffset.x += 200 * ig.system.tick))
              : 1 >= b
              ? (0.5 >= b - ig.system.tick &&
                  ((this.panelOffset.x = -100),
                  (this.itemId -= 1),
                  0 > this.itemId && (this.itemId = this.itemImage.length - 1)),
                (b = (b - 0.5) / 0.5),
                1 < b && (b = 1),
                (this.panelAlpha = b * b),
                (this.panelOffset.x += 200 * ig.system.tick))
              : ((this.pagingLeft = !1), (this.panelOffset.x = 0)));
        }
      },
      aabbCheck: function (b, c) {
        return b.x + b.w > c.x &&
          b.x < c.x + c.w &&
          b.y + b.h > c.y &&
          b.y < c.y + c.h
          ? !0
          : !1;
      },
      checkClicks: function () {
        this.pointer.refreshPos();
        var b = {};
        ig.ua.mobile
          ? ((b.x = this.pointer.pos.x), (b.y = this.pointer.pos.y))
          : ((b.x = this.pointer.pos.x / multiplier),
            (b.y = this.pointer.pos.y / multiplier));
        b.w = this.pointer.size.x;
        b.h = this.pointer.size.y;
        if (
          !ig.game.getItemUpgradeStatus(this.itemId) &&
          !this.pagingLeft &&
          !this.pagingRight
        )
          if (this.aabbCheck(b, this.buttonRect)) {
            if (
              (ig.input.state("click") &&
                ((this.buttonAnim = this.buttonAnimDown),
                (this.buttonOffset.y = 2)),
              ig.input.released("click"))
            ) {
              this.buttonAnim = this.buttonAnimUp;
              this.buttonOffset.y = 0;
              var c = ig.game.getItemUpgradePrice(this.itemId);
              if (ig.game.money >= c) {
                ig.game.money -= c;
                ig.game.setItemUpgradeStatus(this.itemId, !0);
                4 > this.itemId
                  ? (ig.game.equipGuy = this.itemId)
                  : (ig.game.equipGirl = this.itemId);
                if (
                  ig.game.getItemUpgradeStatus(this.itemId) &&
                  this.fromGame
                ) {
                  for (c = 0; c < ig.game.upgrades.length; c++)
                    ig.game.upgrades[c].equipped = !1;
                  0 !== this.charType &&
                    (ig.game.upgrades[this.itemId].equipped = !0);
                  c = ig.game.getEntitiesByType(EntityGameCharacter)[0];
                  c.changeCharacter();
                  console.log("changing chara");
                }
                ig.game.savePlayerStats();
                ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button);
              }
            }
          } else
            (this.buttonAnim = this.buttonAnimUp), (this.buttonOffset.y = 0);
        if (
          ig.game.getItemUpgradeStatus(this.itemId) &&
          !this.pagingLeft &&
          !this.pagingRight &&
          ((c = { x: 0, y: 0, w: 0, h: 0 }),
          (c.x = this.panelPos.x),
          (c.y = this.panelPos.y),
          (c.w = this.panelImage.width),
          (c.h = this.panelImage.height),
          this.aabbCheck(b, c) && ig.input.released("click"))
        ) {
          4 > this.itemId
            ? (ig.game.equipGuy = this.itemId)
            : (ig.game.equipGirl = this.itemId);
          if (ig.game.getItemUpgradeStatus(this.itemId) && this.fromGame) {
            for (c = 0; c < ig.game.upgrades.length; c++)
              ig.game.upgrades[c].equipped = !1;
            0 !== this.charType &&
              (ig.game.upgrades[this.itemId].equipped = !0);
            c = ig.game.getEntitiesByType(EntityGameCharacter)[0];
            c.changeCharacter();
            console.log("changing chara");
          }
          ig.game.savePlayerStats();
          ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button);
        }
        if (this.fromGame)
          if (this.aabbCheck(b, this.resumeRect)) {
            if (this.hidePlayButton) return;
            this.resumeAnim = ig.input.state("click")
              ? this.resumeAnimDown
              : this.resumeAnimHover;
            if (ig.input.released("click")) {
              for (c = 0; c < ig.game.upgrades.length; c++)
                ig.game.upgrades[c].equipped = !1;
              ig.game.getItemUpgradeStatus(this.itemId) &&
                this.fromGame &&
                (0 !== this.charType &&
                  (ig.game.upgrades[this.itemId].equipped = !0),
                (c = ig.game.getEntitiesByType(EntityGameCharacter)[0]),
                c.changeCharacter(),
                console.log("changing chara"));
              this.resumeAnim = this.resumeAnimUp;
              this.hide();
              this.toHome = !1;
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button);
            }
          } else this.resumeAnim = this.resumeAnimUp;
        else if (this.aabbCheck(b, this.homeRect)) {
          if (this.hidePlayButton) return;
          this.homeAnim = ig.input.state("click")
            ? this.homeAnimDown
            : this.homeAnimHover;
          if (ig.input.released("click")) {
            this.homeAnim = this.homeAnimUp;
            for (c = 0; c < ig.game.upgrades.length; c++)
              ig.game.upgrades[c].equipped = !1;
            0 !== this.charType &&
              (ig.game.upgrades[this.itemId].equipped = !0);
            ig.game.savePlayerStats();
            this.hide();
            this.toHome = !0;
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button);
          }
        } else this.homeAnim = this.homeAnimUp;
        this.aabbCheck(b, this.arrowRightRect)
          ? (ig.input.state("click") &&
              (this.arrowRightAnim = this.arrowRightAnimDown),
            ig.input.released("click") &&
              ((this.arrowRightAnim = this.arrowRightAnimUp),
              this.doPageRight(),
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button)))
          : (this.arrowRightAnim = this.arrowRightAnimUp);
        this.aabbCheck(b, this.arrowLeftRect)
          ? (ig.input.state("click") &&
              (this.arrowLeftAnim = this.arrowLeftAnimDown),
            ig.input.released("click") &&
              ((this.arrowLeftAnim = this.arrowLeftAnimUp),
              this.doPageLeft(),
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button)))
          : (this.arrowLeftAnim = this.arrowLeftAnimUp);
      },
      doPageLeft: function () {
        !this.pagingLeft &&
          !this.pagingRight &&
          ((this.pagingLeft = !0), (this.pagingTime = ig.system.clock.delta()));
      },
      doPageRight: function () {
        !this.pagingRight &&
          !this.pagingLeft &&
          ((this.pagingRight = !0),
          (this.pagingTime = ig.system.clock.delta()));
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.select-screen")
  .requires("impact.entity")
  .defines(function () {
    EntitySelectScreen = ig.Entity.extend({
      zIndex: 2999,
      solidBg: new ig.Image("media/graphics/game/backgrounds/bg.png"),
      bgImage: new ig.Image("media/graphics/game/backgrounds/mainbg.png"),
      pointer: null,
      alpha: 0,
      buttons: [],
      control: null,
      hiding: !1,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];
        this.buttons.push(
          ig.game.spawnEntity(EntitySelectScreenBtn, 130, 374, {
            charType: 0,
            control: d.control,
            selScreen: this,
          })
        );
        this.buttons.push(
          ig.game.spawnEntity(EntitySelectScreenBtn, 364, 374, {
            charType: 4,
            control: d.control,
            selScreen: this,
          })
        );
      },
      updateChar: function () {
        for (var b = 0; b < this.buttons.length; b++)
          this.buttons[b].updateChar();
      },
      update: function () {
        if (this.pointer) {
          if (this.pointer.isClicking)
            for (var b = 0; b < this.buttons.length; b++)
              this.buttons[b].checkMousePos() &&
                (ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button),
                this.buttons[b].enabled && this.buttons[b].playGame());
          this.hiding
            ? 0 < this.alpha && (this.alpha -= 0.03)
            : 1 > this.alpha && (this.alpha += 0.03);
        }
      },
      draw: function () {
        ig.system.context.drawImage(
          this.solidBg.data,
          0,
          0,
          ig.system.width,
          ig.system.height
        );
        isHeightBigger
          ? this.bgImage.draw(0, 0 + heightOffset)
          : this.bgImage.draw(0, 0 + halfHeightOffset);
        this.control.inShop ||
          ((ig.system.context.globalAlpha = 0.7),
          (ig.system.context.fillStyle = "#000000"),
          ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height),
          (ig.system.context.globalAlpha = 1),
          ig.game.sortEntitiesDeferred());
      },
    });
    EntitySelectScreenBtn = ig.Entity.extend({
      zIndex: 3e3,
      size: { x: 165, y: 177 },
      pointer: null,
      enabled: !0,
      control: null,
      selScreen: null,
      panelGreyImage: new ig.Image(
        "media/graphics/game/ui/game/shop-panel0.png"
      ),
      panelImage: new ig.Image("media/graphics/game/ui/game/shop-panel1.png"),
      origPos: { x: 0, y: 0 },
      charImage: [
        new ig.Image("media/graphics/game/ui/game/upg0.png"),
        new ig.Image("media/graphics/game/ui/game/upg1.png"),
        new ig.Image("media/graphics/game/ui/game/upg2.png"),
        new ig.Image("media/graphics/game/ui/game/upg3.png"),
        new ig.Image("media/graphics/game/ui/game/upg4.png"),
        new ig.Image("media/graphics/game/ui/game/upg5.png"),
        new ig.Image("media/graphics/game/ui/game/upg6.png"),
        new ig.Image("media/graphics/game/ui/game/upg7.png"),
      ],
      charType: 0,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.origPos.x = b;
        this.origPos.y = c;
        this.updateChar();
      },
      updateChar: function () {
        if (4 > this.charType)
          for (var b = 0; 3 >= b; b++) {
            if (ig.game.equipGuy === b) {
              this.charType = b;
              break;
            }
          }
        else
          for (b = 4; 7 >= b; b++)
            if (ig.game.equipGirl === b) {
              this.charType = b;
              break;
            }
      },
      ready: function () {
        this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];
      },
      draw: function () {
        if (!this.control.inShop) {
          this.pos.x = this.origPos.x;
          if (isHeightBigger) {
            this.pos.y = this.origPos.y + heightOffset;
            var b = this.pos.y;
          } else
            (this.pos.y = this.origPos.y + halfHeightOffset), (b = this.pos.y);
          var c = ig.system.context;
          c.save();
          c.globalAlpha = this.selScreen.alpha;
          c.drawImage(this.panelImage.data, this.pos.x, b, 165, 177);
          b = isHeightBigger ? 400 + heightOffset : 400 + halfHeightOffset;
          switch (this.charType) {
            case 0:
              c.drawImage(this.charImage[this.charType].data, 163, b, 95, 120);
              break;
            case 1:
              c.drawImage(this.charImage[this.charType].data, 163, b, 100, 125);
              break;
            case 2:
              c.drawImage(this.charImage[this.charType].data, 163, b, 95, 120);
              break;
            case 3:
              c.drawImage(this.charImage[this.charType].data, 163, b, 90, 120);
              break;
            case 4:
              c.drawImage(this.charImage[this.charType].data, 405, b, 80, 127);
              break;
            case 5:
              c.drawImage(this.charImage[this.charType].data, 405, b, 90, 135);
              break;
            case 6:
              c.drawImage(this.charImage[this.charType].data, 405, b, 90, 135);
              break;
            case 7:
              c.drawImage(this.charImage[this.charType].data, 405, b, 95, 135);
          }
          c.restore();
          this.parent();
        }
      },
      checkMousePos: function () {
        if (this.control.inShop) return !1;
        var b = ig.game.getEntitiesByType(EntityPointer)[0];
        b.refreshPos();
        return ig.ua.mobile
          ? b.pos.x >= this.pos.x + this.pointer.size.x / 2 &&
              b.pos.x <= this.pos.x + this.size.x + this.pointer.size.x / 2 &&
              b.pos.y >= this.pos.y + this.pointer.size.y / 2 &&
              b.pos.y <= this.pos.y + this.size.y + this.pointer.size.y / 2
          : b.pos.x / multiplier >= this.pos.x + this.pointer.size.x / 2 &&
              b.pos.x / multiplier <=
                this.pos.x + this.size.x + this.pointer.size.x / 2 &&
              b.pos.y / multiplier >= this.pos.y + this.pointer.size.y / 2 &&
              b.pos.y / multiplier <=
                this.pos.y + this.size.y + this.pointer.size.y / 2;
      },
      playGame: function () {
        for (var b = 0; b < ig.game.upgrades.length; b++)
          ig.game.upgrades[b].equipped = !1;
        0 !== this.charType && (ig.game.upgrades[this.charType].equipped = !0);
        ig.game.savePlayerStats();
        ig.input.clearPressed();
        ig.game.firstrun &&
          ((ig.game.doTutorialFlag = !0),
          (ig.game.firstrun = !1),
          ig.game.savePlayerStats());
        ig.game.curLevel = "street";
        ig.game.cookies = 0;
        ig.game.lvlChn_coinCollected = 0;
        ig.game.lvlChn_powerLevel = 0;
        ig.game.distanceLimit = 400;
        ig.game.lastRunSpeed = 20;
        ig.game.lastLifeCount = 3;
        ig.game.director.jumpTo(LevelGame);
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.home-control")
  .requires(
    "impact.entity",
    "game.entities.button-more-games",
    "game.entities.audio-toggle",
    "game.entities.shop-control",
    "game.entities.select-screen"
  )
  .defines(function () {
    EntityHomeControl = ig.Entity.extend({
      zIndex: 5e3,
      isHome: !0,
      bgImage: new ig.Image("media/graphics/game/backgrounds/mainbg.png"),
      time: 1,
      playButtonPos: { x: 202, y: 720 },
      playButtonRect: { x: -125, y: -62, w: 250, h: 125 },
      playButtonOffset: { x: 0, y: 0 },
      playButtonAlpha: 1,
      playButtonDown: !1,
      shopButtonAnim: new ig.Animation(
        new ig.AnimationSheet(
          "media/graphics/game/ui/mainmenu/shop-title.png",
          202,
          64
        ),
        0,
        [0]
      ),
      shopButtonPos: { x: 265, y: 650 },
      shopButtonRect: { x: -36, y: -38, w: 202, h: 64 },
      shopButtonOffset: { x: 0, y: 0 },
      shopButtonAlpha: 1,
      shopButtonDown: !1,
      infoButtonAnim: new ig.Animation(
        new ig.AnimationSheet(
          "media/graphics/game/ui/mainmenu/info.png",
          68,
          68
        ),
        0,
        [0, 1, 2]
      ),
      infoButtonPos: { x: 600, y: 45 },
      infoButtonRect: { x: -34, y: -34, w: 68, h: 68 },
      infoButtonOffset: { x: 0, y: 0 },
      infoButtonAlpha: 1,
      infoButtonDown: !1,
      moregamesButtonPos: { x: 500, y: 45 },
      moregamesButtonRect: { x: -31, y: -21, w: 62, h: 42 },
      moregamesButtonOffset: { x: 0, y: 0 },
      moregamesButtonAlpha: 1,
      moregamesButtonDown: !1,
      pointer: null,
      moregames: null,
      audiotoggle: null,
      shop: null,
      inShop: !1,
      menuPaused: !1,
      mainMenuAlpha: 1,
      blackCover: !1,
      init: function (b, c, d) {
        this.parent(b, c, d);
        ig.global.wm || (this.playButtonPos.x = ig.system.width / 2);
      },
      ready: function () {
        this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];
        this.moregames = ig.game.spawnEntity(
          EntityButtonMoreGames,
          this.moregamesButtonPos.x + this.moregamesButtonRect.x,
          this.moregamesButtonPos.y + this.moregamesButtonRect.y
        );
        this.moregames.divLayerName = "more-games";
        this.moregames.size.x = this.moregamesButtonRect.w;
        this.moregames.size.y = this.moregamesButtonRect.h;
        this.moregames.ready();
        this.shop = ig.game.spawnEntity(EntityShopControl, 0, 0);
        this.shop.ready();
        ig.game.sortEntitiesDeferred();
        ig.global.wm ||
          (!1 == ig.game.muted && ig.soundHandler.playBackgroundMusic(),
          ig.game.doShop && ((ig.game.doShop = !1), this.showShop()),
          ig.game.spawnEntity(EntitySelectScreen, 0, 0, { control: this }));
      },
      draw: function () {
        if (!this.inShop) {
          var b = ig.system.context;
          if (0 != this.mainMenuAlpha) {
            b.globalAlpha = this.mainMenuAlpha;
            b.textAlign = "center";
            b.font = "20px mainfont, Helvetica, Verdana";
            b.fillStyle = "#FFFFFF";
            var c =
                this.shopButtonPos.x +
                this.shopButtonOffset.x +
                this.shopButtonRect.x,
              d =
                this.shopButtonPos.y +
                this.shopButtonOffset.y +
                this.shopButtonRect.y;
            this.shopButtonDown && (d += 2);
            b.save();
            b.globalAlpha = this.mainMenuAlpha * this.shopButtonAlpha;
            this.shopButtonAnim.draw(c, d);
            b.restore();
            c =
              this.infoButtonPos.x +
              this.infoButtonOffset.x +
              this.infoButtonRect.x;
            d =
              this.infoButtonPos.y +
              this.infoButtonOffset.y +
              this.infoButtonRect.y;
            this.infoButtonDown && (d += 2);
            b.save();
            b.globalAlpha = this.mainMenuAlpha * this.infoButtonAlpha;
            this.infoButtonAnim.draw(c, d);
            b.restore();
            _SETTINGS.MoreGames.Enabled &&
              (b.save(),
              (b.globalAlpha = this.mainMenuAlpha * this.moregamesButtonAlpha),
              b.restore());
            b.globalAlpha = 1;
            this.blackCover &&
              ((ig.system.context.fillStyle = "#000000"),
              ig.system.context.fillRect(
                0,
                0,
                ig.system.width,
                ig.system.height
              ));
          }
        }
      },
      playGame: function () {
        ig.input.clearPressed();
        _SETTINGS.MoreGames.Enabled && this.moregames.hide();
        ig.game.firstrun
          ? ((ig.game.doTutorialFlag = !0),
            (ig.game.firstrun = !1),
            ig.game.savePlayerStats())
          : (ig.game.doTutorialFlag = !1);
        ig.game.curLevel = "street";
        ig.game.cookies = 0;
        ig.game.lvlChn_coinCollected = 0;
        ig.game.lvlChn_powerLevel = 0;
        ig.game.distanceLimit = 400;
        ig.game.lastRunSpeed = 20;
        ig.game.lastLifeCount = 3;
        ig.game.director.jumpTo(LevelGame);
      },
      playTutorial: function () {
        for (var b = 0; b < ig.game.upgrades.length; b++)
          ig.game.upgrades[b].equipped = !1;
        ig.game.savePlayerStats();
        ig.input.clearPressed();
        _SETTINGS.MoreGames.Enabled && this.moregames.hide();
        ig.game.doTutorialFlag = !0;
        ig.game.firstrun = !1;
        ig.game.savePlayerStats();
        ig.game.curLevel = "street";
        ig.game.cookies = 0;
        ig.game.lvlChn_coinCollected = 0;
        ig.game.lvlChn_powerLevel = 0;
        ig.game.distanceLimit = 400;
        ig.game.lastRunSpeed = 20;
        ig.game.lastLifeCount = 3;
        ig.game.director.jumpTo(LevelGame);
      },
      showShop: function () {
        this.pause();
        this.shop.show();
      },
      hideShop: function () {
        this.unpause();
      },
      pause: function () {
        this.menuPaused = !0;
        _SETTINGS.MoreGames.Enabled && this.moregames.hide();
      },
      unpause: function () {
        this.menuPaused = !1;
        _SETTINGS.MoreGames.Enabled && this.moregames.show();
      },
      update: function () {
        this.time += ig.system.tick;
        this.shopButtonPos.x = 265;
        this.infoButtonPos.x = 600;
        isHeightBigger
          ? ((this.shopButtonPos.y = 650 + heightOffset),
            (this.infoButtonPos.y = 45 + heightOffset))
          : ((this.shopButtonPos.y = 650 + halfHeightOffset),
            (this.infoButtonPos.y = 45));
        this.menuPaused || this.checkClicks();
      },
      aabbCheck: function (b, c) {
        return b.x + b.w > c.x &&
          b.x < c.x + c.w &&
          b.y + b.h > c.y &&
          b.y < c.y + c.h
          ? !0
          : !1;
      },
      checkClicks: function () {
        this.pointer.refreshPos();
        var b = {};
        ig.ua.mobile
          ? ((b.x = this.pointer.pos.x + this.pointer.size.x / 2),
            (b.y = this.pointer.pos.y + this.pointer.size.y / 2))
          : ((b.x = this.pointer.pos.x / multiplier + this.pointer.size.x / 2),
            (b.y = this.pointer.pos.y / multiplier + this.pointer.size.y / 2));
        b.w = 1;
        b.h = 1;
        var c = {};
        c.x = this.shopButtonPos.x + this.shopButtonRect.x;
        c.y = this.shopButtonPos.y + this.shopButtonRect.y;
        c.w = this.shopButtonRect.w;
        c.h = this.shopButtonRect.h;
        if (this.aabbCheck(b, c)) {
          if (
            ((this.shopButtonDown = !1),
            ig.input.state("click") && (this.shopButtonDown = !0),
            ig.input.released("click"))
          ) {
            this.shopButtonDown = !1;
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button);
            this.showShop();
            return;
          }
        } else this.shopButtonDown = !1;
        c = {};
        c.x = this.infoButtonPos.x + this.infoButtonRect.x;
        c.y = this.infoButtonPos.y + this.infoButtonRect.y;
        c.w = this.infoButtonRect.w;
        c.h = this.infoButtonRect.h;
        if (this.aabbCheck(b, c)) {
          if (
            ((this.infoButtonDown = !1),
            (this.infoButtonAnim.tile = 0),
            ig.ua.mobile || (this.infoButtonAnim.tile = 1),
            ig.input.state("click") &&
              ((this.infoButtonDown = !0), (this.infoButtonAnim.tile = 2)),
            ig.input.released("click"))
          ) {
            this.infoButtonDown = !1;
            ig.ua.mobile || (this.infoButtonAnim.tile = 1);
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button);
            this.playTutorial();
            return;
          }
        } else (this.infoButtonDown = !1), (this.infoButtonAnim.tile = 0);
        c = {};
        c.x = this.moregamesButtonPos.x + this.moregamesButtonRect.x;
        c.y = this.moregamesButtonPos.y + this.moregamesButtonRect.y;
        c.w = this.moregamesButtonRect.w;
        c.h = this.moregamesButtonRect.h;
        this.aabbCheck(b, c)
          ? ((this.moregamesButtonDown = !1),
            ig.input.state("click") && (this.moregamesButtonDown = !0),
            ig.input.released("click") &&
              ((this.moregamesButtonDown = !1),
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button)))
          : (this.moregamesButtonDown = !1);
      },
      roundRect: function (b, c, d, e, f, j, m, q) {
        "undefined" == typeof q && (q = !0);
        "undefined" === typeof j && (j = 5);
        b.beginPath();
        b.moveTo(c + j, d);
        b.lineTo(c + e - j, d);
        b.quadraticCurveTo(c + e, d, c + e, d + j);
        b.lineTo(c + e, d + f - j);
        b.quadraticCurveTo(c + e, d + f, c + e - j, d + f);
        b.lineTo(c + j, d + f);
        b.quadraticCurveTo(c, d + f, c, d + f - j);
        b.lineTo(c, d + j);
        b.quadraticCurveTo(c, d, c + j, d);
        b.closePath();
        q && b.stroke();
        m && b.fill();
      },
    });
  });
ig.baked = !0;
ig.module("game.levels.home")
  .requires(
    "impact.image",
    "game.entities.home-control",
    "game.entities.pointer-selector"
  )
  .defines(function () {
    LevelHome = {
      entities: [
        { type: "EntityHomeControl", x: 0, y: 0 },
        { type: "EntityPointerSelector", x: 0, y: 0 },
      ],
      layer: [],
    };
  });
ig.baked = !0;
ig.module("game.entities.game-ui")
  .requires("impact.entity")
  .defines(function () {
    EntityGameUi = ig.Entity.extend({
      zIndex: 3e3,
      overlayAlpha: 1,
      homeSheet: new ig.AnimationSheet(
        "media/graphics/game/ui/mainmenu/shop-title.png",
        202,
        64
      ),
      homeSheet2: new ig.AnimationSheet(
        "media/graphics/game/ui/game/home.png",
        98,
        83
      ),
      homeAnimUp: null,
      homeAnimDown: null,
      homeAnim: null,
      homeRect: { x: 426, y: 26, w: 202, h: 64 },
      homeEndRect: { x: 270, y: 650, w: 98, h: 83 },
      homeEndOffset: { x: 0, y: 0 },
      restartSheet: new ig.AnimationSheet(
        "media/graphics/game/ui/game/restart.png",
        90,
        90
      ),
      restartAnimUp: null,
      restartAnimDown: null,
      restartAnim: null,
      restartEndRect: { x: 320, y: 650, w: 90, h: 90 },
      restartEndOffset: { x: 0, y: 0 },
      pauseSheet: new ig.AnimationSheet(
        "media/graphics/game/ui/game/pause.png",
        60,
        65
      ),
      pauseAnimUp: null,
      pauseAnimOver: null,
      pauseAnimDown: null,
      pauseAnim: null,
      pauseRect: { x: 550, y: 136, w: 60, h: 65 },
      pauseOffset: { x: 0, y: 0 },
      playRect: { x: 615, y: 5, w: 35, h: 44 },
      lifeImage: new ig.Image("media/graphics/game/ui/game/lifeicon.png"),
      lifeRect: { x: 28, y: 195, w: 45, h: 45 },
      lifeCountPos: { x: 90, y: 228 },
      coinImage: new ig.Image("media/graphics/game/ui/game/coinicon.png"),
      coinRect: { x: 17, y: 25, w: 79, h: 78 },
      coinCountPos: { x: 90, y: 73 },
      cookieImage: new ig.Image("media/graphics/game/ui/game/cookieicon.png"),
      cookieRect: { x: 25, y: 110, w: 57, h: 64 },
      cookieCountPos: { x: 110, y: 154 },
      powerLevelGrad: null,
      powerLevelRect: { x: 90, y: 125, w: 10, h: 34 },
      gameOverTitleRect: { x: 153, y: 115, w: 519, h: 100 },
      gameOverTitleOffset: { x: 0, y: 0 },
      gameOverPanelRect: { x: 219, y: 390, w: 458, h: 359 },
      gameOverPanelOffset: { x: 0, y: 0 },
      gameOverBgRect: { x: 263, y: 220, w: 252, h: 252 },
      gameOverBgOffset: { x: 0, y: 0 },
      gameOverAnim: null,
      panelIconsImage: new ig.Image(
        "media/graphics/game/ui/game/panel-icons.png"
      ),
      panelIconsRect: { x: 240, y: 500, w: 72, h: 139 },
      panelIconsOffset: { x: 0, y: 0 },
      pausedTitleImage: new ig.Image(
        "media/graphics/game/ui/game/paused-title.png"
      ),
      pausedTitlePos: { x: 0, y: 220 },
      coinEndCountPos: { x: 339, y: 390 },
      cookieEndCountPos: { x: 339, y: 443 },
      happyBgImage: new ig.Image(
        "media/graphics/game/ui/game/levelup-anim-bg.png"
      ),
      happyBgRect: { x: -17, y: 533, w: 126, h: 126 },
      happyBgOffset: { x: 0, y: 0 },
      happyAnimSheet: new ig.AnimationSheet(
        "media/graphics/game/ui/game/guy-tutorial.png",
        126,
        147
      ),
      happyAnim: null,
      happyPanelImage: new ig.Image(
        "media/graphics/game/ui/game/levelup-panel.png"
      ),
      happyPanelRect: { x: 219, y: 307, w: 202, h: 155 },
      happyPanelOffset: { x: 0, y: 0 },
      fingerImage: new ig.Image("media/graphics/game/ui/game/finger.png"),
      fingerRect: { x: 0, y: 0, w: 122, h: 111 },
      fingerOffset: { x: 0, y: 0 },
      tutorialUIShowTime: 0,
      tutorialUIShowingFlag: !1,
      tutorialUIHideTime: 0,
      tutorialUIHidingFlag: !1,
      tutorialUITickStartTime: 0,
      tutorialUITickFlag: !1,
      tutorialUIFadeTime: 0,
      tutorialUIFadeFlag: !1,
      tutorialUIDrawFlag: !1,
      tutorialUIAlpha: 0,
      tutorialUIOffset: { x: 0, y: 0 },
      tutorialID: 0,
      nextTutorialID: 0,
      tutorialTextOrder: 0,
      tutorialTextAlpha: 0,
      tutorialTextRect: { x: 40, y: 470, w: 400, h: 100 },
      tutorialTime: 0,
      control: null,
      pointer: null,
      shop: null,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.powerLevelGrad = ig.system.context.createLinearGradient(
          0,
          0,
          0,
          this.powerLevelRect.h
        );
        this.powerLevelGrad.addColorStop(0, "#cc1e1c");
        this.powerLevelGrad.addColorStop(1, "#f59f2a");
        this.pauseAnimUp = new ig.Animation(this.pauseSheet, 0.1, [0]);
        this.pauseAnimOver = new ig.Animation(this.pauseSheet, 0.1, [1]);
        this.pauseAnimDown = new ig.Animation(this.pauseSheet, 0.1, [1]);
        this.pauseAnim = this.pauseAnimUp;
        this.homeAnimUp = new ig.Animation(this.homeSheet, 0.1, [0]);
        this.homeAnimDown = new ig.Animation(this.homeSheet, 0.1, [1]);
        this.homeAnim = this.homeAnimUp;
        this.homeAnimUp2 = new ig.Animation(this.homeSheet2, 0.1, [0]);
        this.homeAnimDown2 = new ig.Animation(this.homeSheet2, 0.1, [1]);
        this.homeAnim2 = this.homeAnimUp2;
        this.restartAnimUp = new ig.Animation(this.restartSheet, 0.1, [0]);
        this.restartAnimDown = new ig.Animation(this.restartSheet, 0.1, [1]);
        this.restartAnim = this.restartAnimUp;
        this.gameOverTitleRect.x =
          ig.system.width / 2 - this.gameOverTitleRect.w / 2;
        this.gameOverPanelRect.x =
          ig.system.width / 2 - this.gameOverPanelRect.w / 2;
        this.gameOverBgRect.x = ig.system.width / 2 - this.gameOverBgRect.w / 2;
        this.coinEndCountPos.x = this.panelIconsRect.x + 103;
        this.coinEndCountPos.y = this.panelIconsRect.y + 118;
        this.cookieEndCountPos.x = this.panelIconsRect.x + 103;
        this.cookieEndCountPos.y = this.panelIconsRect.y + 63;
        this.homeEndRect.x = ig.system.width / 2 - this.homeEndRect.w - 40;
        this.restartEndRect.x = ig.system.width / 2 + 40;
        this.pausedTitlePos.x =
          ig.system.width / 2 - this.pausedTitleImage.width / 2;
        this.happyAnim = new ig.Animation(
          this.happyAnimSheet,
          0.04,
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          !0
        );
        this.tutorialTextRect.x =
          ig.system.width / 2 - this.tutorialTextRect.w / 2;
        this.happyBgRect.x = this.tutorialTextRect.x - this.happyBgRect.w / 2;
        this.happyBgRect.y =
          this.tutorialTextRect.y +
          this.tutorialTextRect.h / 2 -
          this.happyBgRect.h / 2;
        this.tutorialTextRect.w += this.happyBgRect.w / 2;
      },
      ready: function () {
        this.control = ig.game.getEntitiesByType(EntityGameControl)[0];
        this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];
      },
      draw: function () {
        var b = ig.system.context;
        b.fillStyle = this.control.bgHorizonLinGrad;
        "sewer" !== ig.game.curLevel &&
          b.fillRect(
            0,
            461 + heightOffset,
            ig.system.width,
            700 + heightOffset
          );
        this.drawGameStats();
        this.drawTutorialUI();
        this.control.gamePaused &&
          ((ig.system.context.globalAlpha = 0.5),
          (ig.system.context.fillStyle = "#000000"),
          ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height),
          (ig.system.context.globalAlpha = 1),
          this.pausedTitleImage.draw(
            this.pausedTitlePos.x,
            this.pausedTitlePos.y
          ));
        this.control.gamePaused &&
          ((b = ig.system.clock.delta() % 2),
          1 < b && (b = 1 - (b - 1)),
          (ig.system.context.globalAlpha = 0.25 + 0.75 * b));
        ig.system.context.globalAlpha = 1;
        this.homeAnim.draw(
          this.homeRect.x + this.pos.x - this.offset.x - ig.game._rscreen.x,
          this.homeRect.y + this.pos.y - this.offset.y - ig.game._rscreen.y
        );
        this.drawGameOver();
        if (this.control.gameStarting || this.control.gameEnding)
          (ig.system.context.globalAlpha = this.overlayAlpha),
            (ig.system.context.fillStyle = "#000000"),
            ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height),
            (ig.system.context.globalAlpha = 1);
      },
      drawGameStats: function () {
        this.lifeImage.draw(this.lifeRect.x, this.lifeRect.y);
        ig.system.context.textAlign = "left";
        ig.system.context.font = "20px mainfont, Helvetica, Verdana";
        ig.system.context.fillStyle = "#000000";
        ig.system.context.fillText(
          this.control.lifeCount,
          this.lifeCountPos.x + 2,
          this.lifeCountPos.y + 2
        );
        ig.system.context.fillStyle = "#ffffff";
        ig.system.context.fillText(
          this.control.lifeCount,
          this.lifeCountPos.x,
          this.lifeCountPos.y
        );
        this.coinImage.draw(this.coinRect.x, this.coinRect.y);
        ig.system.context.textAlign = "left";
        ig.system.context.font = "20px mainfont, Helvetica, Verdana";
        ig.system.context.fillStyle = "#000000";
        ig.system.context.fillText(
          ig.game.money,
          this.coinCountPos.x + 2,
          this.coinCountPos.y + 2
        );
        ig.system.context.fillStyle = "#ffffff";
        ig.system.context.fillText(
          ig.game.money,
          this.coinCountPos.x,
          this.coinCountPos.y
        );
        this.cookieImage.draw(this.cookieRect.x, this.cookieRect.y);
        ig.system.context.textAlign = "left";
        ig.system.context.font = "20px mainfont, Helvetica, Verdana";
        ig.system.context.fillStyle = "#000000";
        ig.system.context.fillText(
          ig.game.cookies,
          this.cookieCountPos.x + 2,
          this.cookieCountPos.y + 2
        );
        ig.system.context.fillStyle = "#ffffff";
        ig.system.context.fillText(
          ig.game.cookies,
          this.cookieCountPos.x,
          this.cookieCountPos.y
        );
        var b = ig.system.context;
        b.save();
        var c = this.powerLevelRect.w,
          d = this.powerLevelRect.h,
          e = this.control.powerLevel;
        b.translate(this.powerLevelRect.x, this.powerLevelRect.y);
        b.fillStyle = "#000000";
        b.strokeStyle = "#000000";
        b.lineWidth = 0;
        b.fillRect(2, 2, c, d);
        b.fillStyle = this.powerLevelGrad;
        b.fillRect(0, (1 - e) * d, c, e * d);
        b.strokeStyle = "#ffffff";
        b.lineWidth = 3;
        b.strokeRect(0, 0, c, d);
        b.restore();
      },
      drawGameOver: function () {
        if (this.control.gameOver) {
          var b = ig.system.clock.delta() - this.control.gameOverTime;
          0.5 < b && (b = 0.5);
          ig.system.context.globalAlpha = (0.75 * b) / 0.5;
          ig.system.context.fillStyle = "#000000";
          ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
          ig.system.context.globalAlpha = 1;
        }
      },
      drawFPS: function () {
        ig.system.context.fillStyle = "#ffffff";
        ig.system.context.font = "20px mainfont, Helvetica, Verdana";
        ig.system.context.textAlign = "center";
        ig.system.context.fillText(ig.game.fps, ig.system.width / 2, 40);
      },
      aabbCheck: function (b, c) {
        return b.x + b.w > c.x &&
          b.x < c.x + c.w &&
          b.y + b.h > c.y &&
          b.y < c.y + c.h
          ? !0
          : !1;
      },
      shopClicked: !1,
      shopWindow: !1,
      checkMainClicks: function () {
        this.pointer.refreshPos();
        var b = {};
        ig.ua.mobile
          ? ((b.x = this.pointer.pos.x), (b.y = this.pointer.pos.y))
          : ((b.x = this.pointer.pos.x / multiplier),
            (b.y = this.pointer.pos.y / multiplier));
        b.w = this.pointer.size.x;
        b.h = this.pointer.size.y;
        this.control.gameOver ||
          (this.aabbCheck(b, this.homeRect)
            ? this.shopWindow ||
              (ig.input.state("click") && (this.homeAnim = this.homeAnimUp),
              ig.input.released("click") &&
                (this.control.gamePaused ||
                  (this.control.pauseGame(),
                  (this.shop = ig.game.spawnEntity(EntityShopControl, 0, 0, {
                    fromGame: !0,
                  })),
                  this.shop.ready(),
                  this.shop.show(),
                  (this.shopWindow = !0)),
                ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button)))
            : (this.homeAnim = this.homeAnimUp));
      },
      update: function () {
        this.checkMainClicks();
        if (this.control.gameStarting) {
          var b = ig.system.clock.delta() - this.control.gameStartTime,
            b = b / 0.25;
          1 < b && (b = 1);
          this.overlayAlpha = 1 - b;
        } else
          this.control.gameEnding &&
            ((b = ig.system.clock.delta() - this.control.gameEndTime),
            (b /= 0.25),
            1 < b && (b = 1),
            (this.overlayAlpha = b));
        this.control.tutorialMode &&
          !this.control.gamePaused &&
          (this.tutorialTime += ig.system.tick);
        this.updateTutorialUI();
      },
      drawTime: function (b, c, d, e) {
        if (!isNaN(this.control.gameTime)) {
          b = Math.floor(this.control.gameTime / 60);
          c = Math.floor(this.control.gameTime % 60);
          10 > c && (c = "0" + c);
          var f = _STRINGS.UI.TIME + ": " + b + ":" + c;
          d = ig.system.context.measureText(f).width;
          e = ig.system.context.measureText("m").width;
          b = ig.system.width / 2 - d / 2;
          c = ig.system.height / 2 + e / 3 + 30;
          ig.system.context.fillText(f, b, c);
        }
      },
      drawArrow: function (b, c, d, e) {
        var f, j;
        f = d - b;
        j = e - c;
        var m = Math.sqrt(f * f + j * j);
        if (0 != m) {
          var q;
          f /= m;
          q = j / m;
          j = d - 10 * f;
          var m = e - 10 * q,
            l;
          l = -q;
          var p;
          q = j + 10 * l;
          p = m + 10 * f;
          l = j - 10 * l;
          f = m - 10 * f;
          var n = ig.system.context;
          n.fillStyle = "#000000";
          n.beginPath();
          n.moveTo(d, e);
          n.lineTo(q, p);
          n.lineTo(l, f);
          n.closePath();
          n.fill();
          n.strokeStyle = "#000000";
          n.lineWidth = 10;
          n.beginPath();
          n.moveTo(j, m);
          n.lineTo(b, c);
          n.stroke();
        }
      },
      roundRect: function (b, c, d, e, f, j, m, q) {
        "undefined" == typeof q && (q = !0);
        "undefined" === typeof j && (j = 5);
        b.beginPath();
        b.moveTo(c + j, d);
        b.lineTo(c + e - j, d);
        b.quadraticCurveTo(c + e, d, c + e, d + j);
        b.lineTo(c + e, d + f - j);
        b.quadraticCurveTo(c + e, d + f, c + e - j, d + f);
        b.lineTo(c + j, d + f);
        b.quadraticCurveTo(c, d + f, c, d + f - j);
        b.lineTo(c, d + j);
        b.quadraticCurveTo(c, d, c + j, d);
        b.closePath();
        q && b.stroke();
        m && b.fill();
      },
      checkTutorialClicks: function () {
        if (
          this.control.tutorialMode &&
          !this.tutorialUIHidingFlag &&
          !this.tutorialUIShowingFlag &&
          !this.tutorialUITickFlag &&
          (0 == this.control.tutorialStage ||
            1 == this.control.tutorialStage ||
            2 == this.control.tutorialStage ||
            13 == this.control.tutorialStage)
        ) {
          this.pointer.refreshPos();
          var b = {};
          ig.ua.mobile
            ? ((b.x = this.pointer.pos.x), (b.y = this.pointer.pos.y))
            : ((b.x = this.pointer.pos.x / multiplier),
              (b.y = this.pointer.pos.y / multiplier));
          b.w = this.pointer.size.x;
          b.h = this.pointer.size.y;
          this.aabbCheck(b, this.tutorialTextRect) &&
            ig.input.released("click") &&
            (this.control.doNextTutorialStage(),
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button));
          ig.input.released("enter") &&
            (this.control.doNextTutorialStage(),
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.button));
        }
      },
      updateTutorialUI: function () {
        if (this.tutorialUIDrawFlag) {
          if (this.tutorialUIShowingFlag) {
            var b = 1 - this.tutorialUIOffset.x / ig.system.width;
            0 > b && (b = 0);
            1 < b && (b = 1);
            this.tutorialUIAlpha = 0.25 + 0.75 * b;
            0 < this.tutorialUIOffset.x
              ? (this.tutorialUIOffset.x -= 2e3 * ig.system.tick)
              : 0 > this.tutorialUIOffset.x &&
                ((this.tutorialUIOffset.x += 2e3 * ig.system.tick),
                0 <= this.tutorialUIOffset.x &&
                  ((this.tutorialUIOffset.x = 0),
                  (this.tutorialUIShowingFlag = !1),
                  this.happyAnim.rewind(),
                  (this.tutorialUITickStartTime = ig.system.clock.delta()),
                  (this.tutorialUITickFlag = !0),
                  (this.tutorialUIAlpha = 1)));
          } else
            this.tutorialUIHidingFlag &&
              ((b = this.tutorialUIOffset.x / -ig.system.width),
              0 > b && (b = 0),
              1 < b && (b = 1),
              (this.tutorialUIAlpha = 0.25 + 0.75 * (1 - b)),
              (this.tutorialUIOffset.x -= 2e3 * ig.system.tick),
              this.tutorialUIOffset.x <= -ig.system.width &&
                ((this.tutorialUITickFlag = this.tutorialUIFadeFlag = this.tutorialUIShowingFlag = this.tutorialUIDrawFlag = this.tutorialUIHidingFlag = !1),
                (this.tutorialUIAlpha = this.tutorialTextAlpha = 0)));
          if (this.tutorialUITickFlag) {
            var b = (
                _STRINGS.Tutorial[this.tutorialID][0] +
                _STRINGS.Tutorial[this.tutorialID][1]
              ).length,
              c =
                (ig.system.clock.delta() - this.tutorialUITickStartTime) /
                (0.02 * b);
            1 < c && (c = 1);
            this.tutorialTextOrder = Math.floor(c * b);
            1 <= c &&
              ((this.tutorialUITickFlag = !1), (this.tutorialTextOrder = b));
            this.tutorialTextAlpha = 1;
          } else
            this.tutorialUIFadeFlag &&
              ((c = (ig.system.clock.delta() - this.tutorialUIFadeTime) / 0.25),
              1 <= c
                ? ((this.tutorialID = this.nextTutorialID),
                  (this.tutorialUIFadeFlag = !1),
                  this.happyAnim.rewind(),
                  (this.tutorialUITickStartTime = ig.system.clock.delta()),
                  (this.tutorialUITickFlag = !0),
                  (this.tutorialTextOrder = this.tutorialTextAlpha = 0))
                : (this.tutorialTextAlpha = 1 - c));
          !this.tutorialUIShowingFlag &&
            !this.tutorialUIHidingFlag &&
            (this.happyAnim.update(),
            this.tutorialUITickFlag || this.checkTutorialClicks());
        }
      },
      showTutorialUI: function (b) {
        this.tutorialUIDrawFlag
          ? this.tutorialUIHidingFlag
            ? ((this.tutorialUIHidingFlag = !1),
              (this.tutorialUIShowingFlag = !0),
              (this.tutorialUIShowTime = ig.system.clock.delta()),
              (this.tutorialUIOffset.x = ig.system.width),
              this.happyAnim.rewind(),
              (this.tutorialID = b),
              (this.tutorialTextAlpha = this.tutorialTextOrder = 0))
            : ((this.tutorialUIFadeFlag = !0),
              (this.tutorialUIFadeTime = ig.system.clock.delta()),
              (this.nextTutorialID = b))
          : ((this.tutorialUIShowingFlag = this.tutorialUIDrawFlag = !0),
            (this.tutorialUIShowTime = ig.system.clock.delta()),
            (this.tutorialUIOffset.x = ig.system.width),
            this.happyAnim.rewind(),
            (this.tutorialID = b),
            (this.tutorialTextAlpha = this.tutorialTextOrder = 0));
      },
      hideTutorialUI: function () {
        this.tutorialUIHidingFlag = !0;
        this.tutorialUIHideTime = ig.system.clock.delta();
      },
      drawTutorialUI: function () {
        if (this.tutorialUIDrawFlag) {
          var b = ig.system.context;
          b.globalAlpha = this.tutorialUIAlpha;
          b.save();
          b.fillStyle = "rgba(0,0,0,0.75)";
          b.strokeStyle = "rgba(0,0,0,0.75)";
          var c = this.tutorialTextRect.x + this.tutorialUIOffset.x,
            d = this.tutorialTextRect.y + this.tutorialUIOffset.y,
            e = this.tutorialTextRect.w,
            f = this.tutorialTextRect.h;
          this.roundRect(b, c, d, e, f, 20, !0, !1);
          b.restore();
          b.globalAlpha = 1;
          this.tutorialUIShowingFlag || this.drawText();
          if (
            !this.tutorialUIShowingFlag &&
            !this.tutorialUIHidingFlag &&
            !this.tutorialUITickFlag &&
            !this.tutorialUIFadeFlag &&
            (0 == this.control.tutorialStage ||
              1 == this.control.tutorialStage ||
              2 == this.control.tutorialStage ||
              13 == this.control.tutorialStage) &&
            0.5 < ig.system.clock.delta() - this.control.tutorialPausedTime
          )
            (c = c + e - 20),
              (d = d + f - 10),
              (e = this.tutorialTime % 2),
              1 < e && (e = 2 - e),
              (e = 0.25 + 0.75 * e),
              b.save(),
              (b.font = "12px mainfont, Helvetica, Verdana"),
              b.translate(c, d),
              (b.textAlign = "right"),
              (b.fillStyle = "rgba(255,255,255," + e + ")"),
              b.fillText(_STRINGS.UI["continue"], 0, 0),
              b.restore();
          !this.tutorialUIShowingFlag &&
            !this.tutorialUIHidingFlag &&
            !this.tutorialUIFadeFlag &&
            (3 == this.control.tutorialStage
              ? this.drawJumpInstructions()
              : 5 == this.control.tutorialStage
              ? this.drawRightInstructions()
              : 7 == this.control.tutorialStage ||
                9 == this.control.tutorialStage
              ? this.drawLeftInstructions()
              : 11 == this.control.tutorialStage &&
                this.drawSlideInstructions());
          b.globalAlpha = this.tutorialUIAlpha;
          this.happyBgImage.draw(
            this.happyBgRect.x + this.happyBgOffset.x + this.tutorialUIOffset.x,
            this.happyBgRect.y + this.happyBgOffset.y + this.tutorialUIOffset.y
          );
          this.happyAnim.draw(
            this.happyBgRect.x + this.happyBgOffset.x + this.tutorialUIOffset.x,
            this.happyBgRect.y + this.happyBgOffset.y + this.tutorialUIOffset.y
          );
          b.globalAlpha = 1;
        }
      },
      drawText: function () {
        if (0 != this.tutorialTextOrder) {
          var b, c, d;
          c = this.tutorialTextRect.x + this.tutorialUIOffset.x;
          d = this.tutorialTextRect.y + this.tutorialUIOffset.y;
          c += 80;
          d += 28;
          var e = ig.system.context;
          b = this.tutorialTextOrder;
          var f = _STRINGS.Tutorial[this.tutorialID][0],
            j = _STRINGS.Tutorial[this.tutorialID][1];
          b < f.length
            ? ((f = f.substr(0, b)), (j = ""))
            : b < f.length + j.length && (j = j.substr(0, b - f.length));
          e.save();
          e.font = "16px mainfont, Helvetica, Verdana";
          b = (2 * e.measureText("m").width) / 3;
          e.translate(c, d + b);
          e.textAlign = "left";
          e.fillStyle = "rgba(255,255,255," + this.tutorialTextAlpha + ")";
          e.fillText(f, 0, 0);
          e.translate(0, (4 * b) / 2);
          e.fillText(j, 0, 0);
          e.restore();
        }
      },
      drawJumpInstructions: function () {
        var b = ig.system.context;
        if (ig.ua.mobile || this.control.isApp) {
          var c = ig.system.width / 2 + 200,
            d = this.tutorialTextRect.y - 50,
            e = 0;
          b.fillStyle = "rgba(0,0,0,0.75)";
          b.strokeStyle = "rgba(0,0,0,0.75)";
          this.roundRect(b, c - 80, d - 150, 80, 180, 10, !0, !1);
          e = this.tutorialTime % 1.5;
          if (0 <= e && 0.5 > e) {
            var f = e / 0.25;
            1 < f && (f = 1);
            e = -Math.PI / 8 + ((1 - f) * Math.PI) / 4;
            0 > e && (e = 2 * Math.PI + e);
          } else
            0.5 <= e && 0.75 > e
              ? ((f = (e - 0.5) / 0.25),
                1 < f && (f = 1),
                (e = -Math.PI / 8),
                0 > e && (e = 2 * Math.PI + e),
                (d -= 100 * f))
              : ((f = (e - 0.75) / 0.25),
                1 < f && (f = 1),
                (e = -Math.PI / 8 + (f * Math.PI) / 4),
                0 > e && (e = 2 * Math.PI + e),
                (d -= 100));
          b.save();
          b.translate(c, d);
          b.rotate(e);
          this.fingerImage.draw(
            -this.fingerImage.width / 2,
            -this.fingerImage.height / 2
          );
          b.restore();
        } else
          (c = ig.system.width / 2 + 150),
            (d = this.tutorialTextRect.y - 100),
            (b.fillStyle = "rgba(0,0,0,0.75)"),
            (b.strokeStyle = "rgba(0,0,0,0.75)"),
            this.roundRect(b, c - 75, d - 30, 150, 105, 10, !0, !1),
            (e = this.tutorialTime % 2),
            1 < e && (e = 2 - e),
            (b.globalAlpha = 0.25 + 0.75 * e),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c, d + 10, c, d - 10),
            (b.globalAlpha = 1),
            (d += 45),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c, d - 10, c, d + 10),
            (c -= 45),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c + 10, d, c - 10, d),
            (c += 90),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c - 10, d, c + 10, d);
      },
      drawSlideInstructions: function () {
        var b = ig.system.context;
        if (ig.ua.mobile || this.control.isApp) {
          var c = ig.system.width / 2 + 200,
            d = this.tutorialTextRect.y - 50 - 100,
            e = 0;
          b.fillStyle = "rgba(0,0,0,0.75)";
          b.strokeStyle = "rgba(0,0,0,0.75)";
          this.roundRect(b, c - 90, d - 40, 80, 180, 10, !0, !1);
          e = this.tutorialTime % 1.5;
          if (0 <= e && 0.5 > e) {
            var f = e / 0.25;
            1 < f && (f = 1);
            e = -Math.PI / 8 + ((1 - f) * Math.PI) / 4;
            0 > e && (e = 2 * Math.PI + e);
          } else
            0.5 <= e && 0.75 > e
              ? ((f = (e - 0.5) / 0.25),
                1 < f && (f = 1),
                (e = -Math.PI / 8),
                0 > e && (e = 2 * Math.PI + e),
                (d += 100 * f))
              : ((f = (e - 0.75) / 0.25),
                1 < f && (f = 1),
                (e = -Math.PI / 8 + (f * Math.PI) / 4),
                0 > e && (e = 2 * Math.PI + e),
                (d += 100));
          b.save();
          b.translate(c, d);
          b.rotate(e);
          this.fingerImage.draw(
            -this.fingerImage.width / 2,
            -this.fingerImage.height / 2
          );
          b.restore();
        } else
          (c = ig.system.width / 2 + 150),
            (d = this.tutorialTextRect.y - 100),
            (b.fillStyle = "rgba(0,0,0,0.75)"),
            (b.strokeStyle = "rgba(0,0,0,0.75)"),
            this.roundRect(b, c - 75, d - 30, 150, 105, 10, !0, !1),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c, d + 10, c, d - 10),
            (e = this.tutorialTime % 2),
            1 < e && (e = 2 - e),
            (b.globalAlpha = 0.25 + 0.75 * e),
            (d += 45),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c, d - 10, c, d + 10),
            (b.globalAlpha = 1),
            (c -= 45),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c + 10, d, c - 10, d),
            (c += 90),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c - 10, d, c + 10, d);
      },
      drawLeftInstructions: function () {
        var b = ig.system.context;
        if (ig.ua.mobile || this.control.isApp) {
          var c = ig.system.width / 2 + 200,
            d = this.tutorialTextRect.y - 50,
            e = 0;
          b.fillStyle = "rgba(0,0,0,0.75)";
          b.strokeStyle = "rgba(0,0,0,0.75)";
          this.roundRect(b, c - 200, d - 40, 180, 80, 10, !0, !1);
          e = this.tutorialTime % 1.5;
          if (0 <= e && 0.5 > e) {
            var f = e / 0.25;
            1 < f && (f = 1);
            e = -Math.PI / 8 + ((1 - f) * Math.PI) / 4;
            0 > e && (e = 2 * Math.PI + e);
          } else
            0.5 <= e && 0.75 > e
              ? ((f = (e - 0.5) / 0.25),
                1 < f && (f = 1),
                (e = -Math.PI / 8),
                0 > e && (e = 2 * Math.PI + e),
                (c -= 100 * f))
              : ((f = (e - 0.75) / 0.25),
                1 < f && (f = 1),
                (e = -Math.PI / 8 + (f * Math.PI) / 4),
                0 > e && (e = 2 * Math.PI + e),
                (c -= 100));
          b.save();
          b.translate(c, d);
          b.rotate(e);
          this.fingerImage.draw(
            -this.fingerImage.width / 2,
            -this.fingerImage.height / 2
          );
          b.restore();
        } else
          (c = ig.system.width / 2 + 150),
            (d = this.tutorialTextRect.y - 100),
            (b.fillStyle = "rgba(0,0,0,0.75)"),
            (b.strokeStyle = "rgba(0,0,0,0.75)"),
            this.roundRect(b, c - 75, d - 30, 150, 105, 10, !0, !1),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c, d + 10, c, d - 10),
            (d += 45),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c, d - 10, c, d + 10),
            (e = this.tutorialTime % 2),
            1 < e && (e = 2 - e),
            (b.globalAlpha = 0.25 + 0.75 * e),
            (c -= 45),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c + 10, d, c - 10, d),
            (b.globalAlpha = 1),
            (c += 90),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c - 10, d, c + 10, d);
      },
      drawRightInstructions: function () {
        var b = ig.system.context;
        if (ig.ua.mobile || this.control.isApp) {
          var c = ig.system.width / 2 + 100,
            d = this.tutorialTextRect.y - 50,
            e = 0;
          b.fillStyle = "rgba(0,0,0,0.75)";
          b.strokeStyle = "rgba(0,0,0,0.75)";
          this.roundRect(b, c - 90, d - 40, 180, 80, 10, !0, !1);
          e = this.tutorialTime % 1.5;
          if (0 <= e && 0.5 > e) {
            var f = e / 0.25;
            1 < f && (f = 1);
            e = -Math.PI / 8 + ((1 - f) * Math.PI) / 4;
            0 > e && (e = 2 * Math.PI + e);
          } else
            0.5 <= e && 0.75 > e
              ? ((f = (e - 0.5) / 0.25),
                1 < f && (f = 1),
                (e = -Math.PI / 8),
                0 > e && (e = 2 * Math.PI + e),
                (c += 100 * f))
              : ((f = (e - 0.75) / 0.25),
                1 < f && (f = 1),
                (e = -Math.PI / 8 + (f * Math.PI) / 4),
                0 > e && (e = 2 * Math.PI + e),
                (c += 100));
          b.save();
          b.translate(c, d);
          b.rotate(e);
          this.fingerImage.draw(
            -this.fingerImage.width / 2,
            -this.fingerImage.height / 2
          );
          b.restore();
        } else
          (c = ig.system.width / 2 + 150),
            (d = this.tutorialTextRect.y - 100),
            (b.fillStyle = "rgba(0,0,0,0.75)"),
            (b.strokeStyle = "rgba(0,0,0,0.75)"),
            this.roundRect(b, c - 75, d - 30, 150, 105, 10, !0, !1),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c, d + 10, c, d - 10),
            (d += 45),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c, d - 10, c, d + 10),
            (c -= 45),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c + 10, d, c - 10, d),
            (e = this.tutorialTime % 2),
            1 < e && (e = 2 - e),
            (b.globalAlpha = 0.25 + 0.75 * e),
            (c += 90),
            (b.fillStyle = "rgba(255,255,255,1)"),
            (b.strokeStyle = "rgba(255,255,255,1)"),
            this.roundRect(b, c - 20, d - 20, 40, 40, 5, !0, !1),
            this.drawArrow(c - 10, d, c + 10, d),
            (b.globalAlpha = 1);
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.game-character")
  .requires("impact.entity")
  .defines(function () {
    EntityGameCharacter = ig.Entity.extend({
      offset: { x: 75, y: 120 },
      offsetOrig: { x: 75, y: 120 },
      size: { x: 1, y: 1 },
      charWidth: 50,
      charHeight: 50,
      runContactRect: { x: -25, y: -50, w: 50, h: 50 },
      jumpContactRect: { x: -25, y: -100, w: 50, h: 50 },
      jumpOffset: 0,
      jumpTime: 0,
      alpha: 1,
      zIndex: 1400,
      isPowered: !1,
      runAnimSheet_01: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-normal-run.png",
        130,
        172
      ),
      slideAnimSheet_01: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-normal-slide.png",
        126,
        181
      ),
      jumpAnimSheet_01: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-normal-jump.png",
        120,
        215
      ),
      runAnimSheet_02: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-cape-run.png",
        153,
        176
      ),
      slideAnimSheet_02: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-cape-slide.png",
        147,
        196
      ),
      jumpAnimSheet_02: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-cape-jump.png",
        130,
        228
      ),
      runAnimSheet_03: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-skateboard-run.png",
        122,
        161
      ),
      slideAnimSheet_03: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-skateboard-slide.png",
        128,
        154
      ),
      jumpAnimSheet_03: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-skateboard-jump.png",
        123,
        186
      ),
      runAnimSheet_04: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-hoverboard-run.png",
        122,
        161
      ),
      slideAnimSheet_04: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-hoverboard-slide.png",
        128,
        154
      ),
      jumpAnimSheet_04: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-hoverboard-jump.png",
        123,
        186
      ),
      runAnimSheet_05: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-normal-run.png",
        113,
        175
      ),
      slideAnimSheet_05: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-normal-slide.png",
        103,
        162
      ),
      jumpAnimSheet_05: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-normal-jump.png",
        100,
        207
      ),
      runAnimSheet_06: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-cape-run.png",
        123,
        175
      ),
      slideAnimSheet_06: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-cape-slide.png",
        132,
        162
      ),
      jumpAnimSheet_06: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-cape-jump.png",
        159,
        207
      ),
      runAnimSheet_07: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-hoverrollers-run.png",
        110,
        185
      ),
      slideAnimSheet_07: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-hoverrollers-slide.png",
        128,
        192
      ),
      jumpAnimSheet_07: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-hoverrollers-jump.png",
        128,
        222
      ),
      runAnimSheet_08: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-jetpack-run.png",
        126,
        156
      ),
      slideAnimSheet_08: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-jetpack-slide.png",
        144,
        183
      ),
      jumpAnimSheet_08: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-jetpack-jump.png",
        126,
        176
      ),
      bikeAnimSheet_guy: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-bike.png",
        111,
        174
      ),
      bikeAnimSheet_girl: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-bike.png",
        155,
        178
      ),
      jumpAnimSheet_girlBike: new ig.AnimationSheet(
        "media/graphics/game/character/girl/girl-bike-jump.png",
        159,
        207
      ),
      jumpAnimSheet_guyBike: new ig.AnimationSheet(
        "media/graphics/game/character/guy/guy-bike-jump.png",
        159,
        207
      ),
      runAnim: null,
      slideAnim: null,
      jumpAnim: null,
      anim: null,
      jumpAnim_bike: null,
      squeezePerc: 1,
      growTime: 0,
      growFPS: 0.03,
      growFrame: 0,
      growImage: [],
      STATES: { RUN: 0, SLIDE: 1, JUMP: 2, POWERED: 3, INTRO: 4 },
      state: 0,
      worldPos: { x: 0, y: 0, z: 0 },
      zValue: 13,
      scale: 1,
      scaleModifier: 1,
      zWidth: 1,
      invulnerableDuration: 2,
      invulnerableStartTime: 0,
      isInvulnerable: !1,
      isShaking: !1,
      shakeDuration: 0.25,
      shakeStartTime: 0,
      shakeOffset: { x: 0, y: 0 },
      shakeAmount: 3,
      queuedPowerUp: !1,
      stepSoundPlayed: 0,
      stepSoundPlayedTime: 0,
      control: null,
      hitByGap: !1,
      fallScale: 1,
      fallRotation: 0,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.changeCharacter();
        this.state = this.STATES.RUN;
      },
      updateReposition: function () {},
      changeCharacter: function () {
        ig.game.getItemUpgradeEquipped(1)
          ? ((this.runAnim = new ig.Animation(
              this.runAnimSheet_02,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 7],
              !1
            )),
            (this.jumpAnim = new ig.Animation(
              this.jumpAnimSheet_02,
              0.03,
              [
                0,
                1,
                2,
                3,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                12,
                12,
                12,
                13,
                13,
                14,
                15,
              ],
              !0
            )),
            (this.slideAnim = new ig.Animation(
              this.slideAnimSheet_02,
              0.03,
              [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                6,
                6,
                7,
                7,
                7,
                8,
                8,
                8,
                9,
                9,
                9,
                9,
                10,
                10,
                10,
                11,
                11,
                11,
                12,
                12,
                12,
                13,
              ],
              !0
            )),
            (ig.game.isCharaGirl = !1))
          : ig.game.getItemUpgradeEquipped(2)
          ? ((this.runAnim = new ig.Animation(
              this.runAnimSheet_03,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              !1
            )),
            (this.jumpAnim = new ig.Animation(
              this.jumpAnimSheet_03,
              0.03,
              [0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 13, 13],
              !0
            )),
            (this.slideAnim = new ig.Animation(
              this.slideAnimSheet_03,
              0.03,
              [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                6,
                6,
                7,
                7,
                7,
                8,
                8,
                8,
                9,
                9,
                9,
                9,
                10,
                10,
                10,
                11,
                11,
                11,
                12,
                12,
                12,
                13,
              ],
              !0
            )),
            (ig.game.isCharaGirl = !1))
          : ig.game.getItemUpgradeEquipped(3)
          ? ((this.runAnim = new ig.Animation(
              this.runAnimSheet_04,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              !1
            )),
            (this.jumpAnim = new ig.Animation(
              this.jumpAnimSheet_04,
              0.03,
              [0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 13, 13],
              !0
            )),
            (this.slideAnim = new ig.Animation(
              this.slideAnimSheet_04,
              0.03,
              [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                6,
                6,
                7,
                7,
                7,
                8,
                8,
                8,
                9,
                9,
                9,
                9,
                10,
                10,
                10,
                11,
                11,
                11,
                12,
                12,
                12,
                13,
              ],
              !0
            )),
            (ig.game.isCharaGirl = !1))
          : ig.game.getItemUpgradeEquipped(4)
          ? ((this.runAnim = new ig.Animation(
              this.runAnimSheet_05,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 7, 8],
              !1
            )),
            (this.jumpAnim = new ig.Animation(
              this.jumpAnimSheet_05,
              0.03,
              [
                0,
                1,
                2,
                3,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                12,
                12,
                12,
                13,
                13,
                14,
                14,
              ],
              !0
            )),
            (this.slideAnim = new ig.Animation(
              this.slideAnimSheet_05,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12],
              !0
            )),
            (ig.game.isCharaGirl = !0))
          : ig.game.getItemUpgradeEquipped(5)
          ? ((this.runAnim = new ig.Animation(
              this.runAnimSheet_06,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 7, 8],
              !1
            )),
            (this.jumpAnim = new ig.Animation(
              this.jumpAnimSheet_06,
              0.03,
              [
                0,
                1,
                2,
                3,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                12,
                12,
                12,
                13,
                13,
                14,
                14,
              ],
              !0
            )),
            (this.slideAnim = new ig.Animation(
              this.slideAnimSheet_06,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12],
              !0
            )),
            (ig.game.isCharaGirl = !0))
          : ig.game.getItemUpgradeEquipped(6)
          ? ((this.runAnim = new ig.Animation(
              this.runAnimSheet_07,
              0.03,
              [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
              ],
              !1
            )),
            (this.jumpAnim = new ig.Animation(
              this.jumpAnimSheet_07,
              0.03,
              [
                0,
                1,
                2,
                3,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                11,
                12,
                12,
                12,
                13,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
              ],
              !0
            )),
            (this.slideAnim = new ig.Animation(
              this.slideAnimSheet_07,
              0.03,
              [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                6,
                6,
                7,
                7,
                7,
                8,
                8,
                8,
                9,
                9,
                9,
                9,
                10,
                10,
                10,
                11,
                11,
                11,
                12,
                12,
                12,
                13,
                13,
                14,
                14,
                15,
                15,
              ],
              !0
            )),
            (ig.game.isCharaGirl = !0))
          : ig.game.getItemUpgradeEquipped(7)
          ? ((this.runAnim = new ig.Animation(
              this.runAnimSheet_08,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              !1
            )),
            (this.jumpAnim = new ig.Animation(
              this.jumpAnimSheet_08,
              0.03,
              [
                0,
                1,
                2,
                3,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                11,
                12,
                12,
                12,
                13,
                13,
                14,
                15,
                16,
                17,
              ],
              !0
            )),
            (this.slideAnim = new ig.Animation(
              this.slideAnimSheet_08,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
              !0
            )),
            (ig.game.isCharaGirl = !0))
          : ((this.runAnim = new ig.Animation(
              this.runAnimSheet_01,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 7],
              !1
            )),
            (this.jumpAnim = new ig.Animation(
              this.jumpAnimSheet_01,
              0.03,
              [
                0,
                1,
                2,
                3,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                11,
                12,
                12,
                12,
                13,
                13,
                14,
                15,
              ],
              !0
            )),
            (this.slideAnim = new ig.Animation(
              this.slideAnimSheet_01,
              0.03,
              [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                6,
                6,
                7,
                7,
                7,
                8,
                8,
                8,
                9,
                9,
                9,
                9,
                10,
                10,
                10,
                11,
                11,
                11,
                12,
                12,
                12,
                13,
              ],
              !0
            )),
            (ig.game.isCharaGirl = !1));
        ig.game.isCharaGirl
          ? ((this.jumpAnim_bike = new ig.Animation(
              this.jumpAnimSheet_girlBike,
              0.03,
              [
                0,
                1,
                2,
                3,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                12,
                12,
                12,
                13,
                13,
                14,
                14,
              ],
              !0
            )),
            (this.ballAnim = new ig.Animation(
              this.bikeAnimSheet_girl,
              0.03,
              [0, 1, 2, 3, 4, 5, 6],
              !1
            )))
          : ((this.jumpAnim_bike = new ig.Animation(
              this.jumpAnimSheet_guyBike,
              0.03,
              [
                0,
                1,
                2,
                3,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                12,
                12,
                12,
                13,
                13,
                14,
                14,
              ],
              !0
            )),
            (this.ballAnim = new ig.Animation(
              this.bikeAnimSheet_guy,
              0.03,
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              !1
            )));
        this.anim =
          this.state == this.STATES.POWERED ? this.ballAnim : this.runAnim;
        this.charWidth *= this.scaleModifier;
        this.charHeight *= this.scaleModifier;
      },
      ready: function () {
        this.control = ig.game.getEntitiesByType(EntityGameControl)[0];
        this.zIndex = 1400 - this.zValue;
        ig.game.sortEntitiesDeferred();
        this.growTime = this.control.gameTime;
      },
      draw: function () {
        if (this.hitByGap)
          (b = this.pos.x + 100 * this.fallScale),
            (c = 800 - 100 * this.fallScale),
            ig.system.context.save(),
            ig.system.context.translate(
              this.bitwiseRound(b),
              this.bitwiseRound(c) + heightOffset
            ),
            ig.system.context.scale(this.fallScale, this.fallScale),
            ig.system.context.rotate((this.fallRotation * Math.PI) / 180),
            ig.system.context.translate(
              -this.bitwiseRound(b),
              -this.bitwiseRound(c) - heightOffset
            ),
            (ig.system.context.globalAlpha = this.alpha),
            this.anim.gotoFrame(0),
            this.anim.draw(
              this.bitwiseRound(b),
              this.bitwiseRound(c) + heightOffset
            ),
            (ig.system.context.globalAlpha = 1),
            ig.system.context.restore(),
            0 < this.fallScale &&
              ((this.fallScale -= 0.03),
              (this.distIncrease += 0.09),
              (this.fallRotation += 5));
        else {
          var b =
              this.pos.x -
              this.offset.x +
              this.shakeOffset.x +
              0.25 * this.distIncrease,
            c =
              800 +
              heightOffset +
              this.jumpOffset -
              this.offset.y +
              this.shakeOffset.y -
              this.distIncrease;
          ig.system.context.save();
          ig.system.context.translate(
            this.bitwiseRound(b),
            this.bitwiseRound(c) * this.adj
          );
          this.state == this.STATES.POWERED
            ? (ig.system.context.scale(this.adj, this.squeezePerc),
              1 > this.squeezePerc && (this.squeezePerc += 0.03))
            : ig.system.context.scale(this.adj, this.adj);
          ig.system.context.translate(
            -this.bitwiseRound(b),
            -this.bitwiseRound(c) * this.adj
          );
          ig.system.context.globalAlpha = this.alpha;
          this.anim.draw(this.bitwiseRound(b), this.bitwiseRound(c));
          ig.system.context.globalAlpha = 1;
          ig.system.context.restore();
          this.control.lvl_isEnding &&
            !this.control.gamePaused &&
            ((this.adj -= 0.003), (this.distIncrease += 0.9));
        }
      },
      adj: 1,
      distIncrease: 0,
      update: function () {
        if (
          !this.control.gamePaused &&
          !this.control.gameOver &&
          !this.control.gameStarting
        ) {
          this.parent();
          if (this.state == this.STATES.INTRO) {
            var b = this.control.gameTime - this.growTime;
            this.growFrame = Math.floor(b / this.growFPS);
            if (
              this.growFrame >= this.growImage.length &&
              ((this.growFrame = this.growImage.length - 1), 2.5 < b)
            ) {
              this.run();
              return;
            }
          }
          if (
            this.state == this.STATES.RUN ||
            this.state == this.STATES.POWERED
          )
            ig.game.getItemUpgradeEquipped(1)
              ? ((b = ig.system.clock.delta() - this.stepSoundPlayedTime),
                2 < b &&
                  ((this.stepSoundPlayedTime = ig.system.clock.delta()),
                  ig.soundHandler.playSound(ig.soundHandler.SOUNDID.skate)))
              : !ig.game.getItemUpgradeEquipped(2) &&
                !ig.game.getItemUpgradeEquipped(5) &&
                !ig.game.getItemUpgradeEquipped(6) &&
                (4 == this.runAnim.frame &&
                  4 != this.stepSoundPlayed &&
                  ((this.stepSoundPlayed = 4),
                  ig.soundHandler.playSound(ig.soundHandler.SOUNDID.step)),
                11 == this.runAnim.frame &&
                  11 != this.stepSoundPlayed &&
                  ((this.stepSoundPlayed = 11),
                  ig.soundHandler.playSound(ig.soundHandler.SOUNDID.step)));
          this.state == this.STATES.POWERED &&
            (3 == this.ballAnim.frame &&
              3 != this.stepSoundPlayed &&
              ((this.stepSoundPlayed = 3),
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.step)),
            8 == this.ballAnim.frame &&
              8 != this.stepSoundPlayed &&
              ((this.stepSoundPlayed = 8),
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.step)),
            14 == this.ballAnim.frame &&
              14 != this.stepSoundPlayed &&
              ((this.stepSoundPlayed = 14),
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.step)),
            19 == this.ballAnim.frame &&
              19 != this.stepSoundPlayed &&
              ((this.stepSoundPlayed = 19),
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.step)));
          this.control.tutorialPauseMode ||
            (this.anim.update(),
            this.isInvulnerable &&
              ((b = this.control.gameTime - this.invulnerableStartTime),
              b >= this.invulnerableDuration
                ? ((this.alpha = 1), (this.isInvulnerable = !1))
                : ((b %= 0.5),
                  0.25 < b && (b = 0.25 - (b - 0.25)),
                  (this.alpha = 0.25 + 0.75 * (b / 0.25)))),
            this.isShaking &&
              ((b = this.control.gameTime - this.shakeStartTime),
              b >= this.shakeDuration &&
                ((this.shakeOffset.x = 0),
                (this.shakeOffset.y = 0),
                (this.isShaking = !1))),
            this.queuedPowerUp &&
              (this.state == this.STATES.RUN ||
                this.state == this.STATES.SLIDE) &&
              this.powerUp());
        }
      },
      canJump: !0,
      run: function () {
        this.state = this.STATES.RUN;
        this.isPowered
          ? ((this.state = this.STATES.POWERED), (this.anim = this.ballAnim))
          : (this.anim = this.runAnim);
        this.anim.rewind();
        this.canJump = !0;
        this.zIndex = 1400 - this.zValue;
        ig.game.sortEntitiesDeferred();
      },
      slide: function () {
        this.state != this.STATES.POWERED &&
          ((this.state = this.STATES.SLIDE),
          this.isPowered && (this.state = this.STATES.POWERED),
          (this.anim = this.slideAnim),
          this.anim.rewind(),
          (this.zIndex = 1300 - this.zValue),
          (this.zIndex -= 1),
          ig.game.sortEntitiesDeferred(),
          ig.soundHandler.playSound(ig.soundHandler.SOUNDID.slide));
      },
      jump: function () {
        this.state != this.STATES.JUMP &&
          ((this.jumpTime = this.control.gameTime),
          (this.zIndex = 1400 - this.zValue),
          (this.zIndex += 10),
          ig.game.sortEntitiesDeferred(),
          this.state != this.STATES.POWERED
            ? ((this.state = this.STATES.JUMP),
              this.isPowered && (this.state = this.STATES.POWERED),
              (this.anim = this.jumpAnim),
              this.anim.gotoFrame(0),
              this.anim.rewind())
            : ((this.state = this.STATES.JUMP),
              this.isPowered && (this.state = this.STATES.POWERED),
              (this.jumpOffset = this.jumpAmt = -150),
              (this.squeezePerc = 0.5)),
          ig.soundHandler.playSound(ig.soundHandler.SOUNDID.jump));
      },
      queuePowerUp: function () {
        this.queuedPowerUp = !0;
      },
      powerUp: function () {
        this.queuedPowerUp = !1;
        this.state != this.STATES.POWERED &&
          ((this.state = this.STATES.POWERED),
          (this.isPowered = !0),
          (this.anim = this.ballAnim),
          this.anim.rewind(),
          (this.zIndex = 1400 - this.zValue),
          ig.game.sortEntitiesDeferred());
      },
      powerDown: function () {
        0 > this.jumpOffset
          ? (this.state = this.STATES.JUMP)
          : ((this.state = this.STATES.RUN), this.run());
        this.isPowered = !1;
        this.invulnerableStartTime = this.control.gameTime - 1;
        this.isInvulnerable = !0;
      },
      shake: function () {
        this.isShaking = !0;
        this.shakeStartTime = this.control.gameTime;
        this.shakeOffset.x =
          -this.shakeAmount + 2 * Math.random() * this.shakeAmount;
        this.shakeOffset.y = -this.shakeAmount;
      },
      bitwiseRound: function (b) {
        return (0.5 + b) << 0;
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.game-bgObject")
  .requires("impact.entity")
  .defines(function () {
    EntityGameBgObject = ig.Entity.extend({
      offset: { x: 140, y: 362 },
      size: { x: 1, y: 1 },
      contactRect: { x: 0, y: 0 },
      zIndex: 1200,
      image: null,
      images_bgStreet: [
        new ig.Image("media/graphics/game/objects/bg00.png"),
        new ig.Image("media/graphics/game/objects/bg01.png"),
        new ig.Image("media/graphics/game/objects/bg00.png"),
        new ig.Image("media/graphics/game/objects/bg03.png"),
        new ig.Image("media/graphics/game/objects/bg04.png"),
        new ig.Image("media/graphics/game/objects/bg05.png"),
        new ig.Image("media/graphics/game/objects/bg06.png"),
        new ig.Image("media/graphics/game/objects/bg07.png"),
        new ig.Image("media/graphics/game/objects/bg08.png"),
        new ig.Image("media/graphics/game/objects/bg09.png"),
        new ig.Image("media/graphics/game/objects/bg10.png"),
        new ig.Image("media/graphics/game/objects/bg11.png"),
        new ig.Image("media/graphics/game/objects/bg12.png"),
        new ig.Image("media/graphics/game/objects/bg13.png"),
        new ig.Image("media/graphics/game/objects/bg14.png"),
        new ig.Image("media/graphics/game/objects/bg15.png"),
        new ig.Image("media/graphics/game/objects/bg16.png"),
        new ig.Image("media/graphics/game/objects/bg17.png"),
        new ig.Image("media/graphics/game/objects/bg00.png"),
        new ig.Image("media/graphics/game/objects/bg19.png"),
        new ig.Image("media/graphics/game/objects/bg00.png"),
        new ig.Image("media/graphics/game/objects/bg00.png"),
        new ig.Image("media/graphics/game/objects/bg00.png"),
        new ig.Image("media/graphics/game/objects/bg23.png"),
        new ig.Image("media/graphics/game/objects/bg17.png"),
        new ig.Image("media/graphics/game/objects/bg25.png"),
        new ig.Image("media/graphics/game/objects/bg26.png"),
        new ig.Image("media/graphics/game/objects/bg00.png"),
        new ig.Image("media/graphics/game/objects/bg00.png"),
        new ig.Image("media/graphics/game/objects/bg29.png"),
        new ig.Image("media/graphics/game/objects/bg30.png"),
      ],
      images_bgSewer: [
        new ig.Image("media/graphics/game/objects/sewer/bg00.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg01.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg02.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg03.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg04.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg05.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg06.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg07.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg08.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg09.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg10.png"),
        new ig.Image("media/graphics/game/objects/sewer/bg11.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer01.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer01.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer03.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer01.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer05.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer06.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer07.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer01.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer09.png"),
        new ig.Image("media/graphics/game/objects/sewer/rnd_sewer10.png"),
      ],
      images_bgRooftop: [
        new ig.Image("media/graphics/game/objects/rooftop/bg00.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg05.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg10.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg13.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg17.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg01.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg06.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg07.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg12.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg15.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg16.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg03.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg04.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg08.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg09.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg11.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg14.png"),
        new ig.Image("media/graphics/game/objects/rooftop/bg18.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops01.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops02.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops03.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops04.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops05.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops06.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops07.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops08.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops09.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops10.png"),
        new ig.Image("media/graphics/game/objects/rooftop/rnd_rooftops11.png"),
      ],
      imageId: 0,
      worldPos: { x: 0, y: 0, z: 0 },
      zValue: 0,
      scale: 1,
      scaleModifier: 1,
      objType: 0,
      control: null,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.offset.y += heightOffset;
      },
      ready: function () {
        this.control = ig.game.getEntitiesByType(EntityGameControl)[0];
        "rooftop" === ig.game.curLevel &&
          (0 === this.imageId
            ? (this.imageId = 0 + Math.floor(4 * Math.random()))
            : 5 === this.imageId
            ? (this.imageId = 5 + Math.floor(5 * Math.random()))
            : 11 === this.imageId &&
              (this.imageId = 11 + Math.floor(6 * Math.random())));
        this.setImageId(this.imageId);
        this.scale = this.control.cameraDistance / this.zValue;
        this.zIndex = 1200 - this.zValue;
        ig.game.sortEntitiesDeferred();
      },
      setImageId: function (b) {
        null != b &&
          ((this.imageId = b),
          "street" === ig.game.curLevel
            ? (this.image = this.images_bgStreet[b])
            : "sewer" === ig.game.curLevel
            ? (this.image = this.images_bgSewer[b])
            : "rooftop" === ig.game.curLevel &&
              (this.image = this.images_bgRooftop[b]),
          (this.offset.x = this.image.width / 2),
          (this.offset.y = this.image.height));
      },
      draw: function () {
        var b = this.worldPos.x,
          c = this.worldPos.y,
          d = this.zValue,
          e = this.control.cameraDistance;
        -10 > d
          ? ((this.killed = !0), this.control.cleanObjects(), this.kill())
          : ((d = e / d),
            (b = ig.system.width / 2 - this.control.cameraPos.x * d + b * d),
            (c =
              this.control.cameraPos.y * d +
              ig.system.height -
              c * d -
              (1 - d) * (ig.system.height - this.control.vanishingPoint.y)),
            (this.pos.x = b),
            (this.pos.y = c),
            (b = this.control.horizonLine.y),
            (e = this.control.horizonLine.y + this.control.distanceFogHeight),
            c < b ||
              (c < e && (ig.system.context.globalAlpha = (c - b) / (e - b)),
              (d *= this.scaleModifier),
              (c = this.pos.y - this.offset.y * d - ig.game._rscreen.y),
              ig.system.context.drawImage(
                this.image.data,
                this.bitwiseRound(
                  this.pos.x - this.offset.x * d - ig.game._rscreen.x
                ),
                this.bitwiseRound(c),
                this.image.width * d,
                this.image.height * d
              ),
              (ig.system.context.globalAlpha = 1)));
      },
      update: function () {
        if (
          !this.control.gamePaused &&
          !this.control.gameOver &&
          !this.control.gameStarting &&
          this.control.character.state != this.control.character.STATES.INTRO &&
          !this.control.tutorialPauseMode
        ) {
          var b = this.control.runSpeed;
          this.control.character.state ==
            this.control.character.STATES.POWERED &&
            (b += this.control.bikeSpeedGain);
          this.moveForward(-b * ig.system.tick);
        }
      },
      moveForward: function (b) {
        this.control.lvl_isEnding ||
          ((this.zValue += b),
          (this.zIndex = 1200 - this.zValue),
          ig.game.sortEntitiesDeferred());
      },
      bitwiseRound: function (b) {
        return (0.5 + b) << 0;
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.game-obstacle")
  .requires("impact.entity")
  .defines(function () {
    EntityGameObstacle = ig.Entity.extend({
      offset: { x: 72, y: 100 },
      size: { x: 1, y: 1 },
      contactRect: { x: -58, y: -95, w: 119, h: 92 },
      zIndex: 1300,
      image: null,
      images_street: [
        new ig.Image("media/graphics/game/objects/obstacle00.png"),
        new ig.Image("media/graphics/game/objects/obstacle00.png"),
        new ig.Image("media/graphics/game/objects/obstacle00.png"),
        new ig.Image("media/graphics/game/objects/obstacle03.png"),
        new ig.Image("media/graphics/game/objects/obstacle07.png"),
        new ig.Image("media/graphics/game/objects/obstacle05.png"),
        new ig.Image("media/graphics/game/objects/obstacle00.png"),
        new ig.Image("media/graphics/game/objects/obstacle07.png"),
        new ig.Image("media/graphics/game/objects/obstacle08.png"),
        new ig.Image("media/graphics/game/objects/obstacle09.png"),
        new ig.Image("media/graphics/game/objects/obstacle07.png"),
        new ig.Image("media/graphics/game/objects/obstacle07.png"),
        new ig.Image("media/graphics/game/objects/obstacle11.png"),
        new ig.Image("media/graphics/game/objects/obstacle12.png"),
        new ig.Image("media/graphics/game/objects/enders/street_end.png"),
        new ig.Image("media/graphics/game/objects/enders/street_end2.png"),
      ],
      images_sewer: [
        new ig.Image("media/graphics/game/objects/sewer/obstacle00.png"),
        new ig.Image("media/graphics/game/objects/sewer/obstacle01.png"),
        new ig.Image("media/graphics/game/objects/sewer/obstacle02.png"),
        new ig.Image("media/graphics/game/objects/sewer/obstacle03.png"),
        new ig.Image("media/graphics/game/objects/sewer/obstacle04.png"),
        new ig.Image("media/graphics/game/objects/sewer/obstacle05.png"),
        new ig.Image("media/graphics/game/objects/obstacle03.png"),
        new ig.Image("media/graphics/game/objects/obstacle00.png"),
        new ig.Image("media/graphics/game/objects/obstacle07.png"),
        new ig.Image("media/graphics/game/objects/sewer/obstacle06.png"),
        new ig.Image("media/graphics/game/objects/sewer/obstacle07.png"),
        new ig.Image("media/graphics/game/objects/enders/sewers_end.png"),
      ],
      images_rooftop: [
        new ig.Image("media/graphics/game/objects/rooftop/obstacle00.png"),
        new ig.Image("media/graphics/game/objects/rooftop/obstacle01.png"),
        new ig.Image("media/graphics/game/objects/rooftop/obstacle02.png"),
        new ig.Image("media/graphics/game/objects/rooftop/obstacle03.png"),
        new ig.Image("media/graphics/game/objects/rooftop/obstacle04.png"),
        new ig.Image("media/graphics/game/objects/rooftop/obstacle05.png"),
        new ig.Image("media/graphics/game/objects/rooftop/obstacle06.png"),
        new ig.Image("media/graphics/game/objects/obstacle03.png"),
        new ig.Image("media/graphics/game/objects/obstacle00.png"),
        new ig.Image("media/graphics/game/objects/enders/rooftops_end.png"),
        new ig.Image("media/graphics/game/objects/rooftop/obstacle07.png"),
      ],
      imageId: 0,
      worldPos: { x: 0, y: 0, z: 0 },
      zValue: 0,
      scale: 1,
      scaleModifier: 1,
      objType: 1,
      slidable: !1,
      zWidth: 1,
      knockedOut: !1,
      knockOutPos: { x: 0, y: 0 },
      knockOutOffset: { x: 0, y: 0 },
      knockOutGravity: 1200,
      knockOutVector: { x: 0, y: 0 },
      knockOutAlpha: 0,
      knockOutAngle: 0,
      knockOutDirection: 1,
      knockOutStopped: !1,
      control: null,
      lvlSwitch: !1,
      lvlSwitch_nextLevel: null,
      isGap: !1,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.offset.y += heightOffset;
      },
      ready: function () {
        this.control = ig.game.getEntitiesByType(EntityGameControl)[0];
        switch (ig.game.curLevel) {
          case "street":
            if (14 === this.imageId || 15 === this.imageId)
              this.control.lvl_endObstacles
                ? ((this.lvlSwitch = !0),
                  (this.lvlSwitch_nextLevel =
                    14 === this.imageId ? "rooftop" : "sewer"))
                : (this.imageId = 0);
            break;
          case "rooftop":
            9 === this.imageId
              ? this.control.lvl_endObstacles
                ? ((this.lvlSwitch = !0), (this.lvlSwitch_nextLevel = "street"))
                : (this.imageId = 0)
              : 10 === this.imageId && (this.isGap = !0);
            break;
          case "sewer":
            11 === this.imageId &&
              (this.control.lvl_endObstacles
                ? ((this.lvlSwitch = !0), (this.lvlSwitch_nextLevel = "street"))
                : (this.imageId = 5));
        }
        this.setImageId(this.imageId);
        this.scale = this.control.cameraDistance / this.zValue;
        this.zIndex = 1300 - this.zValue;
        ig.game.sortEntitiesDeferred();
      },
      setImageId: function (b) {
        if (null != b) {
          if ("street" === ig.game.curLevel) {
            if (0 == b || 1 == b || 2 == b)
              b = 0 + Math.floor(3 * Math.random());
            if (8 == b || 9 == b) b = 8 + Math.floor(2 * Math.random());
            if (10 == b || 11 == b) b = 10 + Math.floor(2 * Math.random());
          }
          this.imageId = b;
          "street" === ig.game.curLevel
            ? (this.image = this.images_street[b])
            : "sewer" === ig.game.curLevel
            ? (this.image = this.images_sewer[b])
            : "rooftop" === ig.game.curLevel &&
              (this.image = this.images_rooftop[b]);
          this.offset.x = this.image.width / 2;
          this.offset.y = this.image.height;
          this.slidable =
            ("street" === ig.game.curLevel && 3 === b) ||
            ("sewer" === ig.game.curLevel && 6 === b) ||
            ("rooftop" === ig.game.curLevel && 7 === b)
              ? !0
              : !1;
          this.contactRect.w = this.lvlSwitch
            ? 180
            : this.image.width * this.scaleModifier;
          this.contactRect.h = (this.image.height / 2) * this.scaleModifier;
          this.contactRect.x = -this.contactRect.w / 2;
          this.contactRect.y = -this.contactRect.h;
          if ("street" === ig.game.curLevel) {
            if (5 == b || 8 == b || 9 == b) this.zWidth = 2;
            if (10 == b || 11 == b) this.zWidth = 4;
          }
        }
      },
      draw: function () {
        var b = this.worldPos.x,
          c = this.worldPos.y,
          d = this.zValue,
          e = this.control.cameraDistance;
        if (-10 > d)
          (this.killed = !0), this.control.cleanObjects(), this.kill();
        else {
          var f = 0;
          this.knockedOut &&
            ((b += this.knockOutPos.x),
            (c -= this.knockOutPos.y),
            (f = this.knockOutAngle));
          d = e / d;
          b = ig.system.width / 2 - this.control.cameraPos.x * d + b * d;
          c =
            this.control.cameraPos.y * d +
            ig.system.height -
            c * d -
            (1 - d) * (ig.system.height - this.control.vanishingPoint.y);
          this.pos.x = b;
          this.pos.y = c;
          b = this.control.horizonLine.y;
          e = this.control.horizonLine.y + this.control.distanceFogHeight;
          if (!(c < b)) {
            c < e && (ig.system.context.globalAlpha = (c - b) / (e - b));
            this.knockedOut &&
              (ig.system.context.globalAlpha *= this.knockOutAlpha);
            var j = d * this.scaleModifier,
              d = this.pos.x,
              c = this.pos.y,
              b = -this.offset.x * j,
              e = -this.offset.y * j,
              m = this.image.width * j,
              j = this.image.height * j;
            0 > m && (m = 0);
            0 > j && (j = 0);
            ig.system.context.save();
            ig.system.context.translate(d, c);
            0 < f && ig.system.context.rotate(f);
            ig.system.context.drawImage(this.image.data, b, e, m, j);
            ig.system.context.restore();
            ig.system.context.globalAlpha = 1;
          }
        }
      },
      update: function () {
        if (
          !this.control.gamePaused &&
          !this.control.gameOver &&
          !this.control.gameStarting &&
          this.control.character.state != this.control.character.STATES.INTRO &&
          !this.control.tutorialPauseMode
        ) {
          var b = this.control.runSpeed;
          this.control.character.state ==
            this.control.character.STATES.POWERED &&
            (b += this.control.bikeSpeedGain);
          this.moveForward(-b * ig.system.tick);
        }
      },
      moveForward: function (b) {
        this.zValue += b;
        this.zIndex = 1300 - this.zValue;
        ig.game.sortEntitiesDeferred();
        this.knockedOut &&
          ((this.zIndex = 2e3),
          ig.game.sortEntitiesDeferred(),
          (this.knockOutPos.x += this.knockOutVector.x * ig.system.tick),
          (this.knockOutPos.y += this.knockOutVector.y * ig.system.tick),
          0 < this.knockOutPos.y &&
            ((this.knockOutPos.y = 0),
            (this.knockOutVector.x = 0),
            (this.knockOutVector.y = 0),
            (this.knockOutStopped = !0)),
          this.knockOutStopped ||
            ((this.knockOutVector.y += this.knockOutGravity * ig.system.tick),
            (this.knockOutAngle +=
              3 * (this.knockOutDirection * Math.PI) * ig.system.tick),
            0 > this.knockOutAngle &&
              (this.knockOutAngle = 2 * Math.PI + this.knockOutAngle),
            (this.knockOutAlpha -= 2 * ig.system.tick),
            0 > this.knockOutAlpha &&
              ((this.knockOutAlpha = 0), (this.knockOutStopped = !0))));
      },
      bitwiseRound: function (b) {
        return (0.5 + b) << 0;
      },
      knockOut: function () {
        if (!this.knockedOut) {
          this.knockedOut = !0;
          var b = 200 + 100 * Math.random(),
            c = 1;
          85 < this.worldPos.x
            ? (c = 1)
            : -85 > this.worldPos.x
            ? (c = -1)
            : 0.5 <= Math.random() && (c = -1);
          this.knockOutVector.x = (b * c) / 0.25;
          this.knockOutVector.y = -1200;
          this.knockOutPos.x = 0;
          this.knockOutPos.y = 0;
          this.knockOutAlpha = 1;
          this.knockOutAngle = 0;
          this.knockOutDirection = c;
        }
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.game-pickup")
  .requires("impact.entity")
  .defines(function () {
    EntityGamePickup = ig.Entity.extend({
      offset: { x: 68, y: 126 },
      size: { x: 1, y: 1 },
      contactRect: { x: -57, y: -109, w: 114, h: 106 },
      zIndex: 1300,
      cookieImage: new ig.Image("media/graphics/game/pickups/cookie.png"),
      cookieOffset: { x: 0, y: 0 },
      cookieDown: !1,
      coinAnimSheet: new ig.AnimationSheet(
        "media/graphics/game/pickups/coin.png",
        73,
        104
      ),
      anim: null,
      worldPos: { x: 0, y: 0, z: 0 },
      zValue: 0,
      scale: 1,
      scaleModifier: 1,
      objType: 2,
      zWidth: 0,
      pickupId: 0,
      control: null,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.anim = new ig.Animation(
          this.coinAnimSheet,
          0.06,
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          !1
        );
        this.offset.x = 35;
        this.offset.y = 66;
        this.contactRect.w = 70;
        this.contactRect.h = 66;
        this.contactRect.x = -this.contactRect.w / 2;
        this.contactRect.y = -this.contactRect.h;
      },
      ready: function () {
        this.control = ig.game.getEntitiesByType(EntityGameControl)[0];
        this.scale = this.control.cameraDistance / this.zValue;
        this.zIndex = 1300 - this.zValue;
        ig.game.sortEntitiesDeferred();
      },
      setPickupId: function (b) {
        null != b &&
          ((this.pickupId = b),
          1 == b
            ? ((this.offset.x = this.cookieImage.width / 2),
              (this.offset.y = this.cookieImage.height),
              (this.contactRect.w = this.cookieImage.width),
              (this.contactRect.h = this.cookieImage.height))
            : ((this.offset.x = 35),
              (this.offset.y = 66),
              (this.contactRect.w = 70),
              (this.contactRect.h = 66)),
          (this.contactRect.x = -this.contactRect.w / 2),
          (this.contactRect.y = -this.contactRect.h / 2));
      },
      draw: function () {
        var b = this.worldPos.x,
          c = this.worldPos.y,
          d = this.zValue,
          e = this.control.cameraDistance;
        if (-10 > d)
          (this.killed = !0), this.control.cleanObjects(), this.kill();
        else {
          d = e / d;
          e = ig.system.width / 2 - this.control.cameraPos.x * d + b * d;
          b =
            this.control.cameraPos.y * d +
            ig.system.height -
            c * d -
            (1 - d) * (ig.system.height - this.control.vanishingPoint.y);
          this.pos.x = e;
          this.pos.y = b;
          var e = this.control.horizonLine.y,
            f = this.control.horizonLine.y + this.control.distanceFogHeight;
          if (!(b < e)) {
            b < f && (ig.system.context.globalAlpha = (b - e) / (f - e));
            b = d * this.scaleModifier;
            d =
              this.control.cameraPos.y * d +
              ig.system.height -
              (1 - d) * (ig.system.height - this.control.vanishingPoint.y);
            0 > d && (d = 0);
            if (1 == this.pickupId) {
              if (0 < d) {
                e = 1 - (c - this.cookieOffset.y) / 500;
                0 > e && (e = 0);
                var f = (this.cookieImage.width / 4) * b * e,
                  c = this.pos.x,
                  j = ig.system.context;
                j.save();
                j.translate(this.bitwiseRound(c), this.bitwiseRound(d));
                j.scale(1, 0.5);
                j.beginPath();
                j.arc(0, 0, f, 0, 2 * Math.PI, !1);
                j.fillStyle = "rgba(0,0,0," + 0.2 * e + ")";
                j.fill();
                j.restore();
              }
              c = this.pos.x - (this.offset.x - this.cookieOffset.x) * b;
              d = this.pos.y - (this.offset.y - this.cookieOffset.y) * b;
              e = this.cookieImage.width * b;
              b *= this.cookieImage.height;
              0 < e &&
                0 < b &&
                ig.system.context.drawImage(this.cookieImage.data, c, d, e, b);
            } else
              0 < d &&
                ((e = 1 - c / 500),
                0 > e && (e = 0),
                (f = 17.5 * b * e),
                (c = this.pos.x),
                (j = ig.system.context),
                j.save(),
                j.translate(this.bitwiseRound(c), this.bitwiseRound(d)),
                j.scale(1, 0.5),
                j.beginPath(),
                j.arc(0, 0, f, 0, 2 * Math.PI, !1),
                (j.fillStyle = "rgba(0,0,0," + 0.2 * e + ")"),
                j.fill(),
                j.restore()),
                (c = this.pos.x - this.offset.x * b),
                (d = this.pos.y - this.offset.y * b),
                ig.system.context.save(),
                ig.system.context.translate(
                  this.bitwiseRound(c),
                  this.bitwiseRound(d)
                ),
                ig.system.context.scale(b, b),
                this.anim.draw(0, 0),
                ig.system.context.restore();
            ig.system.context.globalAlpha = 1;
          }
        }
      },
      update: function () {
        if (
          !this.control.gamePaused &&
          !this.control.gameOver &&
          !this.control.gameStarting &&
          this.control.character.state != this.control.character.STATES.INTRO &&
          !this.control.tutorialPauseMode
        ) {
          var b = this.control.runSpeed;
          this.control.character.state ==
            this.control.character.STATES.POWERED &&
            (b += this.control.bikeSpeedGain);
          this.moveForward(-b * ig.system.tick);
          1 == this.pickupId
            ? this.cookieDown
              ? ((this.cookieOffset.y += 60 * ig.system.tick),
                0 <= this.cookieOffset.y &&
                  ((this.cookieOffset.y = -this.cookieOffset.y),
                  (this.cookieDown = !1)))
              : ((this.cookieOffset.y -= 60 * ig.system.tick),
                -20 >= this.cookieOffset.y &&
                  ((this.cookieOffset.y = -20 - (this.cookieOffset.y + 20)),
                  (this.cookieDown = !0)))
            : this.anim.update();
        }
      },
      moveForward: function (b) {
        this.zValue += b;
        this.zIndex = 1300 - this.zValue;
        ig.game.sortEntitiesDeferred();
      },
      bitwiseRound: function (b) {
        return (0.5 + b) << 0;
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.game-hiteffect")
  .requires("impact.entity")
  .defines(function () {
    EntityGameHiteffect = ig.Entity.extend({
      offset: { x: 150, y: 150 },
      size: { x: 1, y: 1 },
      contactRect: { x: 0, y: 0 },
      zIndex: 1300,
      explodeAnimSheet: new ig.AnimationSheet(
        "media/graphics/game/effects/explosion1.png",
        205,
        204
      ),
      explode2AnimSheet: new ig.AnimationSheet(
        "media/graphics/game/effects/explosion2.png",
        205,
        204
      ),
      explodeAnim: null,
      explode2Anim: null,
      anim: null,
      worldPos: { x: 0, y: 0, z: 0 },
      zValue: 0,
      scale: 1,
      scaleModifier: 1,
      angle: 0,
      alpha: 1,
      timeAlive: 0,
      effectDuration: 0.3,
      effectId: 0,
      control: null,
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.explodeAnim = new ig.Animation(
          this.explodeAnimSheet,
          this.effectDuration / 7,
          [0, 1, 2, 3, 4, 5, 6],
          !0
        );
        this.anim = this.explode2Anim = new ig.Animation(
          this.explode2AnimSheet,
          this.effectDuration / 8,
          [0, 1, 2, 3, 4, 5, 6, 7],
          !0
        );
        this.angle = 2 * Math.random() * Math.PI;
      },
      ready: function () {
        this.control = ig.game.getEntitiesByType(EntityGameControl)[0];
      },
      setEffectId: function (b) {
        this.effectId = b;
        1 == b
          ? ((this.anim = this.explodeAnim),
            (this.offset.y = 150),
            (this.scaleModifier = 0.8))
          : (this.anim = this.explode2Anim);
      },
      draw: function () {
        var b = this.scale * this.scaleModifier,
          c = this.bitwiseRound(this.pos.x),
          d = this.bitwiseRound(this.pos.y),
          e = this.bitwiseRound(-this.offset.x),
          f = this.bitwiseRound(-this.offset.y);
        ig.system.context.save();
        ig.system.context.globalAlpha = this.alpha;
        ig.system.context.translate(c, d);
        ig.system.context.rotate(this.angle);
        ig.system.context.scale(b, b);
        this.anim.draw(e, f);
        ig.system.context.restore();
      },
      update: function () {
        if (
          !this.control.gamePaused &&
          (this.anim.update(),
          (this.timeAlive += ig.system.tick),
          this.timeAlive > this.effectDuration &&
            ((this.killed = !0), this.control.cleanEffects(), this.kill()),
          1 == this.effectId)
        ) {
          var b = this.timeAlive / this.effectDuration;
          1 < b && (b = 1);
          0 > b && (b = 0);
          0.5 < b && (this.alpha = 1 - (b - 0.5) / 0.5);
        }
      },
      bitwiseRound: function (b) {
        return (0.5 + b) << 0;
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.segment-control")
  .requires("impact.entity")
  .defines(function () {
    EntitySegmentControl = ig.Entity.extend({
      init: function (b, c, d) {
        this.parent(b, c, d);
      },
      setObstacleSegments: function () {
        var b = null;
        "street" === ig.game.curLevel
          ? (b = [
              [
                { id: 5, x: -220, y: 0, z: 15 },
                { id: 5, x: -220, y: 0, z: 12 },
                { id: 6, x: -220, y: 0, z: 8 },
                { id: 0, x: 0, y: 0, z: 11 },
                { id: 8, x: 220, y: 0, z: 12 },
                { id: 9, x: 220, y: 0, z: 17 },
                { type: 2, id: 1, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 19 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
                { type: 2, id: 0, x: 225, y: 0, z: 25 },
              ],
              [
                { id: 5, x: -220, y: 0, z: 17 },
                { id: 5, x: -220, y: 0, z: 14 },
                { id: 13, x: -90, y: 0, z: 8 },
                { id: 8, x: 220, y: 0, z: 12 },
                { id: 9, x: 220, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 18 },
                { type: 2, id: 0, x: 0, y: 0, z: 20 },
                { type: 2, id: 0, x: 0, y: 0, z: 22 },
                { type: 2, id: 0, x: -225, y: 0, z: 26 },
                { type: 2, id: 0, x: 225, y: 0, z: 26 },
              ],
              [
                { id: 3, x: -140, y: 0, z: 11 },
                { id: 15, x: 220, y: 0, z: 10 },
                { id: 9, x: 220, y: 0, z: 15 },
                { type: 2, id: 1, x: -225, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 20 },
                { type: 2, id: 0, x: 225, y: 0, z: 24 },
                { type: 2, id: 0, x: 225, y: 0, z: 27 },
                { type: 2, id: 0, x: 225, y: 0, z: 30 },
              ],
              [
                { id: 3, x: 140, y: 0, z: 11 },
                { id: 5, x: -220, y: 0, z: 15 },
                { id: 12, x: 90, y: 0, z: 25 },
                { id: 9, x: 220, y: 0, z: 15 },
                { type: 2, id: 0, x: -225, y: 0, z: 11 },
                { type: 2, id: 1, x: -225, y: 200, z: 15 },
                { type: 2, id: 0, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: -225, y: 0, z: 23 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
                { type: 2, id: 0, x: -225, y: 0, z: 27 },
                { type: 2, id: 0, x: 125, y: 0, z: 30 },
              ],
              [
                { id: 3, x: 140, y: 0, z: 11 },
                { id: 14, x: -220, y: 0, z: 10 },
                { id: 5, x: -220, y: 0, z: 15 },
                { type: 2, id: 1, x: 225, y: 0, z: 9 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: -225, y: 0, z: 21 },
                { type: 2, id: 0, x: -225, y: 0, z: 23 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
              ],
              [
                { id: 3, x: -220, y: 0, z: 10 },
                { id: 5, x: -220, y: 0, z: 19 },
                { id: 12, x: 90, y: 0, z: 14 },
                { id: 7, x: 220, y: 0, z: 22 },
                { type: 2, id: 0, x: -225, y: 0, z: 11 },
                { type: 2, id: 0, x: -225, y: 0, z: 24 },
                { type: 2, id: 0, x: -225, y: 0, z: 26 },
                { type: 2, id: 0, x: -225, y: 0, z: 28 },
              ],
              [
                { id: 5, x: -220, y: 0, z: 10 },
                { id: 5, x: -220, y: 0, z: 15 },
                { id: 3, x: 140, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: 225, y: 0, z: 24 },
                { type: 2, id: 0, x: 0, y: 0, z: 26 },
                { type: 2, id: 0, x: 225, y: 0, z: 28 },
                { type: 2, id: 1, x: -225, y: 0, z: 24 },
              ],
              [
                { id: 5, x: -220, y: 0, z: 20 },
                { id: 5, x: -220, y: 0, z: 25 },
                { id: 3, x: 140, y: 0, z: 21 },
                { id: 7, x: 220, y: 0, z: 13 },
                { id: 5, x: -220, y: 0, z: 10 },
                { type: 2, id: 1, x: 0, y: 0, z: 21 },
                { type: 2, id: 0, x: 225, y: 0, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 30 },
              ],
              [
                { id: 8, x: 220, y: 0, z: 12 },
                { id: 9, x: 220, y: 0, z: 17 },
                { id: 0, x: 0, y: 0, z: 11 },
                { id: 5, x: -220, y: 0, z: 12 },
                { id: 5, x: -220, y: 0, z: 17 },
                { type: 2, id: 1, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 19 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
                { type: 2, id: 0, x: 225, y: 0, z: 25 },
              ],
              [
                { id: 8, x: 220, y: 0, z: 22 },
                { id: 9, x: 220, y: 0, z: 27 },
                { id: 3, x: 0, y: 0, z: 21 },
                { id: 5, x: -220, y: 0, z: 22 },
                { id: 5, x: -220, y: 0, z: 27 },
                { id: 5, x: -220, y: 0, z: 7 },
                { id: 1, x: 0, y: 0, z: 7 },
                { type: 2, id: 0, x: 0, y: 200, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 27 },
                { type: 2, id: 0, x: 0, y: 0, z: 29 },
                { type: 2, id: 0, x: 225, y: 0, z: 7 },
              ],
              [
                { id: 5, x: -220, y: 0, z: 11 },
                { id: 5, x: -220, y: 0, z: 16 },
                { id: 6, x: 0, y: 0, z: 10 },
                { type: 2, x: 225, y: 0, z: 12 },
                { type: 2, x: 225, y: 0, z: 14 },
                { type: 2, x: 0, y: 0, z: 20 },
                { type: 2, x: -225, y: 0, z: 24 },
                { type: 2, x: -225, y: 0, z: 26 },
              ],
              [
                { id: 5, x: -220, y: 0, z: 11 },
                { id: 5, x: -220, y: 0, z: 16 },
                { id: 6, x: 0, y: 0, z: 10 },
                { id: 6, x: 0, y: 0, z: 15 },
                { type: 2, x: 225, y: 0, z: 12 },
                { type: 2, x: 225, y: 0, z: 14 },
                { type: 2, x: 225, y: 0, z: 16 },
                { type: 2, x: 0, y: 0, z: 26 },
                { type: 2, x: -225, y: 0, z: 30 },
              ],
              [
                { id: 5, x: -220, y: 0, z: 11 },
                { id: 6, x: 0, y: 0, z: 10 },
                { id: 11, x: 220, y: 0, z: 12 },
                { id: 3, x: 140, y: 0, z: 17 },
                { type: 2, x: -225, y: 0, z: 16 },
                { type: 2, x: -225, y: 0, z: 18 },
                { type: 2, x: -225, y: 0, z: 20 },
                { type: 2, x: -225, y: 0, z: 22 },
                { type: 2, x: -225, y: 0, z: 24 },
              ],
              [
                { id: 1, x: -220, y: 0, z: 11 },
                { id: 6, x: -220, y: 0, z: 17 },
                { id: 5, x: -220, y: 0, z: 23 },
                { id: 5, x: -220, y: 0, z: 28 },
                { id: 6, x: 0, y: 0, z: 10 },
                { id: 11, x: 220, y: 0, z: 12 },
                { type: 2, id: 1, x: -225, y: 0, z: 14 },
                { type: 2, x: -225, y: 0, z: 20 },
                { type: 2, x: 225, y: 0, z: 23 },
                { type: 2, x: 225, y: 0, z: 26 },
                { type: 2, x: 225, y: 0, z: 29 },
              ],
              [
                { id: 5, x: -220, y: 0, z: 10 },
                { id: 6, x: 0, y: 0, z: 13 },
                { id: 6, x: 0, y: 0, z: 18 },
                { id: 1, x: 220, y: 0, z: 12 },
                { id: 1, x: 220, y: 0, z: 20 },
                { type: 2, x: -225, y: 0, z: 26 },
                { type: 2, x: -225, y: 0, z: 28 },
                { type: 2, x: 225, y: 0, z: 16 },
                { type: 2, x: 225, y: 0, z: 24 },
                { type: 2, x: 225, y: 0, z: 26 },
              ],
              [
                { id: 5, x: -220, y: 0, z: 10 },
                { id: 10, x: 220, y: 0, z: 13 },
                { id: 11, x: 220, y: 0, z: 20 },
                { id: 1, x: 0, y: 0, z: 12 },
                { id: 1, x: 0, y: 0, z: 20 },
                { type: 2, x: 0, y: 0, z: 26 },
                { type: 2, x: 0, y: 0, z: 28 },
                { type: 2, x: 0, y: 0, z: 30 },
              ],
            ])
          : "sewer" === ig.game.curLevel
          ? (b = [
              [
                { id: 4, x: -220, y: 0, z: 17 },
                { id: 10, x: -100, y: 0, z: 5 },
                { id: 0, x: -220, y: 0, z: 14 },
                { id: 6, x: 0, y: 0, z: 11 },
                { id: 3, x: 220, y: 0, z: 12 },
                { id: 3, x: 220, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 1, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 19 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
                { type: 2, id: 0, x: 225, y: 0, z: 25 },
              ],
              [
                { id: 2, x: -220, y: 0, z: 17 },
                { id: 1, x: -220, y: 0, z: 14 },
                { id: 1, x: -220, y: 0, z: 12 },
                { id: 5, x: 220, y: 0, z: 12 },
                { id: 5, x: 220, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 15 },
                { type: 2, id: 0, x: 0, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 19 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
                { type: 2, id: 0, x: 225, y: 0, z: 25 },
              ],
              [
                { id: 6, x: -140, y: 0, z: 11 },
                { id: 4, x: 220, y: 0, z: 10 },
                { id: 2, x: 220, y: 0, z: 15 },
                { id: 11, x: 0, y: 0, z: 20 },
                { type: 2, id: 1, x: -225, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: 225, y: 0, z: 24 },
                { type: 2, id: 0, x: 225, y: 0, z: 27 },
                { type: 2, id: 0, x: 225, y: 0, z: 30 },
              ],
              [
                { id: 6, x: -140, y: 0, z: 11 },
                { id: 9, x: 100, y: 0, z: 7 },
                { id: 1, x: 220, y: 0, z: 10 },
                { id: 2, x: 220, y: 0, z: 15 },
                { type: 2, id: 0, x: -225, y: 0, z: 11 },
                { type: 2, id: 1, x: -225, y: 200, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 23 },
                { type: 2, id: 0, x: 0, y: 0, z: 25 },
                { type: 2, id: 0, x: 225, y: 0, z: 27 },
              ],
              [
                { id: 6, x: 140, y: 0, z: 11 },
                { id: 3, x: -220, y: 0, z: 10 },
                { id: 3, x: -220, y: 0, z: 15 },
                { id: 11, x: 0, y: 0, z: 17 },
                { type: 2, id: 1, x: 225, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: -225, y: 0, z: 24 },
                { type: 2, id: 0, x: -225, y: 0, z: 26 },
                { type: 2, id: 0, x: -225, y: 0, z: 28 },
              ],
              [
                { id: 6, x: 140, y: 0, z: 11 },
                { id: 1, x: -220, y: 0, z: 15 },
                { id: 4, x: 220, y: 0, z: 20 },
                { id: 0, x: 0, y: 0, z: 22 },
                { type: 2, id: 1, x: 0, y: 200, z: 22 },
                { type: 2, id: 0, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: -225, y: 0, z: 24 },
                { type: 2, id: 0, x: -225, y: 0, z: 26 },
                { type: 2, id: 0, x: -225, y: 0, z: 28 },
              ],
              [
                { id: 10, x: -100, y: 0, z: 7 },
                { id: 4, x: -220, y: 0, z: 15 },
                { id: 6, x: 140, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: 225, y: 0, z: 24 },
                { type: 2, id: 0, x: 0, y: 0, z: 26 },
                { type: 2, id: 0, x: 225, y: 0, z: 28 },
                { type: 2, id: 1, x: -225, y: 0, z: 24 },
              ],
              [
                { id: 4, x: -220, y: 0, z: 20 },
                { id: 5, x: -220, y: 0, z: 25 },
                { id: 6, x: 140, y: 0, z: 21 },
                { id: 9, x: 100, y: 0, z: 10 },
                { id: 3, x: -220, y: 0, z: 10 },
                { type: 2, id: 0, x: 0, y: 200, z: 10 },
                { type: 2, id: 0, x: 225, y: 200, z: 10 },
                { type: 2, id: 1, x: 0, y: 0, z: 21 },
                { type: 2, id: 0, x: 225, y: 0, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 30 },
              ],
              [
                { id: 9, x: 100, y: 0, z: 5 },
                { id: 5, x: 220, y: 0, z: 17 },
                { id: 6, x: 0, y: 0, z: 11 },
                { id: 3, x: -220, y: 0, z: 12 },
                { id: 2, x: -220, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 1, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 19 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
                { type: 2, id: 0, x: 225, y: 0, z: 25 },
              ],
              [
                { id: 3, x: 220, y: 0, z: 18 },
                { id: 6, x: 0, y: 0, z: 21 },
                { id: 3, x: -220, y: 0, z: 22 },
                { id: 4, x: -220, y: 0, z: 27 },
                { id: 0, x: -220, y: 0, z: 7 },
                { id: 0, x: 0, y: 0, z: 7 },
                { type: 2, id: 0, x: 0, y: 200, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 27 },
                { type: 2, id: 0, x: 0, y: 0, z: 29 },
                { type: 2, id: 0, x: 225, y: 0, z: 7 },
              ],
              [
                { id: 0, x: -220, y: 0, z: 11 },
                { id: 0, x: -220, y: 0, z: 16 },
                { id: 4, x: 0, y: 0, z: 10 },
                { type: 2, x: 225, y: 0, z: 12 },
                { type: 2, x: 225, y: 0, z: 14 },
                { type: 2, x: 0, y: 0, z: 20 },
                { type: 2, x: -225, y: 0, z: 24 },
                { type: 2, x: -225, y: 0, z: 26 },
              ],
              [
                { id: 4, x: -220, y: 0, z: 11 },
                { id: 3, x: -220, y: 0, z: 16 },
                { id: 4, x: 0, y: 0, z: 10 },
                { id: 7, x: 0, y: 0, z: 15 },
                { type: 2, x: 225, y: 0, z: 12 },
                { type: 2, x: 225, y: 0, z: 14 },
                { type: 2, x: 225, y: 0, z: 16 },
                { type: 2, x: 0, y: 0, z: 26 },
                { type: 2, x: -225, y: 0, z: 30 },
              ],
              [
                { id: 0, x: -220, y: 0, z: 11 },
                { id: 7, x: 0, y: 0, z: 10 },
                { id: 5, x: 220, y: 0, z: 12 },
                { type: 2, x: -225, y: 0, z: 16 },
                { type: 2, x: -225, y: 0, z: 18 },
                { type: 2, x: -225, y: 0, z: 20 },
                { type: 2, x: -225, y: 0, z: 22 },
                { type: 2, x: -225, y: 0, z: 24 },
              ],
              [
                { id: 4, x: -220, y: 0, z: 11 },
                { id: 0, x: -220, y: 0, z: 17 },
                { id: 2, x: -220, y: 0, z: 23 },
                { id: 3, x: -220, y: 0, z: 28 },
                { id: 7, x: 0, y: 0, z: 10 },
                { id: 9, x: 100, y: 0, z: 12 },
                { type: 2, id: 1, x: -225, y: 0, z: 14 },
                { type: 2, x: -225, y: 0, z: 20 },
                { type: 2, x: 225, y: 0, z: 23 },
                { type: 2, x: 225, y: 0, z: 26 },
                { type: 2, x: 225, y: 0, z: 29 },
              ],
              [
                { id: 2, x: -220, y: 0, z: 10 },
                { id: 7, x: 0, y: 0, z: 13 },
                { id: 7, x: 0, y: 0, z: 18 },
                { id: 0, x: 220, y: 0, z: 12 },
                { id: 0, x: 220, y: 0, z: 20 },
                { type: 2, x: -225, y: 0, z: 26 },
                { type: 2, x: -225, y: 0, z: 28 },
                { type: 2, x: 225, y: 0, z: 16 },
                { type: 2, x: 225, y: 0, z: 24 },
                { type: 2, x: 225, y: 0, z: 26 },
              ],
              [
                { id: 4, x: -220, y: 0, z: 10 },
                { id: 5, x: 220, y: 0, z: 13 },
                { id: 5, x: 220, y: 0, z: 20 },
                { id: 2, x: 0, y: 0, z: 12 },
                { id: 2, x: 0, y: 0, z: 20 },
                { type: 2, x: 0, y: 0, z: 26 },
                { type: 2, x: 0, y: 0, z: 28 },
                { type: 2, x: 0, y: 0, z: 30 },
              ],
            ])
          : "rooftop" === ig.game.curLevel &&
            (b = [
              [
                { id: 2, x: -220, y: 0, z: 17 },
                { id: 4, x: -220, y: 0, z: 12 },
                { id: 0, x: -220, y: 0, z: 14 },
                { id: 7, x: 0, y: 0, z: 11 },
                { id: 0, x: 220, y: 0, z: 12 },
                { id: 0, x: 220, y: 0, z: 17 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 1, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 19 },
                { type: 2, id: 0, x: -225, y: 0, z: 22 },
                { type: 2, id: 0, x: 225, y: 0, z: 22 },
              ],
              [
                { id: 1, x: -220, y: 0, z: 17 },
                { id: 1, x: -220, y: 0, z: 14 },
                { id: 1, x: -220, y: 0, z: 12 },
                { id: 5, x: 220, y: 0, z: 12 },
                { id: 5, x: 220, y: 0, z: 17 },
                { id: 9, x: 0, y: 0, z: 17 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, id: 0, x: 0, y: 0, z: 15 },
                { type: 2, id: 0, x: 0, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 19 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
                { type: 2, id: 0, x: 225, y: 0, z: 25 },
              ],
              [
                { id: 1, x: 0, y: 0, z: 6 },
                { id: 1, x: 220, y: 0, z: 8 },
                { id: 7, x: -140, y: 0, z: 11 },
                { id: 3, x: 220, y: 0, z: 13 },
                { id: 4, x: 220, y: 0, z: 15 },
                { id: 9, x: 0, y: 0, z: 18 },
                { id: 3, x: 0, y: 0, z: 25 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, id: 1, x: -225, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: -225, y: 0, z: 13 },
                { type: 2, id: 0, x: -225, y: 0, z: 15 },
                { type: 2, id: 0, x: -225, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 20 },
                { type: 2, id: 0, x: 0, y: 0, z: 22 },
              ],
              [
                { id: 7, x: -140, y: 0, z: 11 },
                { id: 4, x: -220, y: 0, z: 15 },
                { id: 3, x: 220, y: 0, z: 10 },
                { id: 2, x: 220, y: 0, z: 15 },
                { id: 6, x: -220, y: 0, z: 22 },
                { id: 9, x: 0, y: 0, z: 24 },
                { id: 6, x: -220, y: 0, z: 26 },
                { id: 2, x: 0, y: 0, z: 28 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, id: 0, x: -225, y: 0, z: 11 },
                { type: 2, id: 1, x: -225, y: 200, z: 15 },
                { type: 2, id: 0, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 20 },
                { type: 2, id: 0, x: 0, y: 0, z: 22 },
                { type: 2, id: 0, x: 225, y: 0, z: 24 },
                { type: 2, id: 0, x: 225, y: 0, z: 26 },
              ],
              [
                { id: 7, x: 0, y: 0, z: 11 },
                { id: 6, x: -220, y: 0, z: 10 },
                { id: 0, x: -220, y: 0, z: 15 },
                { id: 6, x: 220, y: 0, z: 17 },
                { id: 9, x: 0, y: 0, z: 19 },
                { id: 10, x: 0, y: 0, z: 30 },
                { id: 7, x: -140, y: 0, z: 23 },
                { type: 2, id: 1, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: -225, y: 0, z: 24 },
                { type: 2, id: 0, x: -225, y: 0, z: 26 },
                { type: 2, id: 0, x: -225, y: 0, z: 28 },
              ],
              [
                { id: 7, x: 140, y: 0, z: 11 },
                { id: 1, x: -220, y: 0, z: 10 },
                { id: 2, x: -220, y: 0, z: 15 },
                { id: 4, x: 220, y: 0, z: 20 },
                { id: 0, x: 0, y: 0, z: 22 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, id: 1, x: 0, y: 200, z: 22 },
                { type: 2, id: 0, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: -225, y: 0, z: 24 },
              ],
              [
                { id: 0, x: -220, y: 0, z: 10 },
                { id: 4, x: -220, y: 0, z: 15 },
                { id: 7, x: 140, y: 0, z: 11 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 0, x: 225, y: 0, z: 24 },
                { type: 2, id: 0, x: 0, y: 0, z: 26 },
                { type: 2, id: 0, x: 225, y: 0, z: 28 },
                { type: 2, id: 1, x: -225, y: 0, z: 24 },
              ],
              [
                { id: 2, x: -220, y: 0, z: 20 },
                { id: 1, x: -220, y: 0, z: 25 },
                { id: 7, x: 140, y: 0, z: 21 },
                { id: 6, x: 220, y: 0, z: 10 },
                { id: 2, x: 0, y: 0, z: 10 },
                { id: 10, x: 0, y: 0, z: 28 },
                { type: 2, id: 0, x: 0, y: 200, z: 10 },
                { type: 2, id: 0, x: 225, y: 200, z: 10 },
                { type: 2, id: 1, x: 0, y: 0, z: 21 },
                { type: 2, id: 0, x: 225, y: 0, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 30 },
              ],
              [
                { id: 2, x: 220, y: 0, z: 12 },
                { id: 4, x: 220, y: 0, z: 17 },
                { id: 7, x: 0, y: 0, z: 11 },
                { id: 3, x: -220, y: 0, z: 12 },
                { id: 2, x: -220, y: 0, z: 17 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, id: 0, x: 0, y: 200, z: 11 },
                { type: 2, id: 1, x: 0, y: 0, z: 11 },
                { type: 2, id: 0, x: 0, y: 0, z: 17 },
                { type: 2, id: 0, x: 0, y: 0, z: 19 },
                { type: 2, id: 0, x: -225, y: 0, z: 25 },
                { type: 2, id: 0, x: 225, y: 0, z: 25 },
              ],
              [
                { id: 0, x: 220, y: 0, z: 22 },
                { id: 1, x: 220, y: 0, z: 27 },
                { id: 7, x: 0, y: 0, z: 21 },
                { id: 2, x: -220, y: 0, z: 22 },
                { id: 6, x: -220, y: 0, z: 27 },
                { id: 0, x: -220, y: 0, z: 7 },
                { id: 0, x: 0, y: 0, z: 7 },
                { type: 2, id: 0, x: 0, y: 200, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 21 },
                { type: 2, id: 0, x: 0, y: 0, z: 27 },
                { type: 2, id: 0, x: 0, y: 0, z: 29 },
                { type: 2, id: 0, x: 225, y: 0, z: 7 },
              ],
              [
                { id: 0, x: -220, y: 0, z: 11 },
                { id: 0, x: -220, y: 0, z: 16 },
                { id: 9, x: 0, y: 0, z: 10 },
                { id: 10, x: 0, y: 0, z: 30 },
                { id: 0, x: 220, y: 0, z: 22 },
                { id: 0, x: 220, y: 0, z: 27 },
                { type: 2, x: 225, y: 0, z: 12 },
                { type: 2, x: 225, y: 0, z: 14 },
                { type: 2, x: 0, y: 0, z: 20 },
                { type: 2, x: -225, y: 0, z: 24 },
                { type: 2, x: -225, y: 0, z: 26 },
              ],
              [
                { id: 4, x: -220, y: 0, z: 11 },
                { id: 3, x: -220, y: 0, z: 16 },
                { id: 8, x: 0, y: 0, z: 10 },
                { id: 8, x: 0, y: 0, z: 15 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, x: 225, y: 0, z: 12 },
                { type: 2, x: 225, y: 0, z: 14 },
                { type: 2, x: 225, y: 0, z: 16 },
                { type: 2, x: 0, y: 0, z: 26 },
              ],
              [
                { id: 1, x: -220, y: 0, z: 11 },
                { id: 8, x: 0, y: 0, z: 10 },
                { id: 6, x: 220, y: 0, z: 12 },
                { id: 1, x: 220, y: 0, z: 17 },
                { id: 8, x: 0, y: 0, z: 19 },
                { id: 1, x: -220, y: 0, z: 22 },
                { id: 8, x: 0, y: 0, z: 25 },
                { id: 10, x: 0, y: 0, z: 30 },
                { type: 2, x: -225, y: 0, z: 16 },
                { type: 2, x: -225, y: 0, z: 18 },
                { type: 2, x: -225, y: 0, z: 20 },
                { type: 2, x: 225, y: 0, z: 22 },
                { type: 2, x: 225, y: 0, z: 24 },
              ],
              [
                { id: 4, x: -220, y: 0, z: 11 },
                { id: 0, x: -220, y: 0, z: 17 },
                { id: 2, x: -220, y: 0, z: 23 },
                { id: 3, x: -220, y: 0, z: 28 },
                { id: 8, x: 0, y: 0, z: 10 },
                { id: 6, x: 220, y: 0, z: 12 },
                { type: 2, id: 1, x: -225, y: 0, z: 14 },
                { type: 2, x: -225, y: 0, z: 20 },
                { type: 2, x: 225, y: 0, z: 23 },
                { type: 2, x: 225, y: 0, z: 26 },
                { type: 2, x: 225, y: 0, z: 29 },
              ],
              [
                { id: 2, x: -220, y: 0, z: 10 },
                { id: 8, x: 0, y: 0, z: 13 },
                { id: 8, x: 0, y: 0, z: 18 },
                { id: 1, x: 220, y: 0, z: 12 },
                { id: 1, x: 220, y: 0, z: 20 },
                { type: 2, x: -225, y: 0, z: 26 },
                { type: 2, x: -225, y: 0, z: 28 },
                { type: 2, x: 225, y: 0, z: 16 },
                { type: 2, x: 225, y: 0, z: 24 },
                { type: 2, x: 225, y: 0, z: 26 },
              ],
              [
                { id: 3, x: -220, y: 0, z: 10 },
                { id: 6, x: 220, y: 0, z: 13 },
                { id: 4, x: 220, y: 0, z: 20 },
                { id: 2, x: 0, y: 0, z: 12 },
                { id: 2, x: 0, y: 0, z: 20 },
                { type: 2, x: 0, y: 0, z: 26 },
                { type: 2, x: 0, y: 0, z: 28 },
                { type: 2, x: 0, y: 0, z: 30 },
              ],
            ]);
        return b;
      },
      setBgSegments: function () {
        var b = null;
        "street" === ig.game.curLevel
          ? (b = [
              [
                { id: 10, x: -475, y: 0, z: 2 },
                { id: 8, x: -475, y: 0, z: 3 },
                { id: 12, x: -425, y: 10, z: 7 },
                { id: 13, x: -475, y: 0, z: 9 },
                { id: 11, x: -475, y: -10, z: 11 },
                { id: 14, x: -475, y: -10, z: 13 },
                { id: 8, x: -475, y: 0, z: 17 },
                { id: 9, x: -475, y: 0, z: 19 },
                { id: 7, x: -475, y: 0, z: 24 },
                { id: 6, x: -475, y: 0, z: 27 },
                { id: 10, x: -475, y: 0, z: 32 },
                { id: 8, x: -475, y: 0, z: 33 },
                { id: 12, x: -425, y: 10, z: 37 },
                { id: 13, x: -475, y: 0, z: 39 },
                { id: 11, x: -475, y: -10, z: 41 },
                { id: 14, x: -475, y: -10, z: 43 },
                { id: 8, x: -475, y: 0, z: 47 },
                { id: 9, x: -475, y: 0, z: 49 },
                { id: 7, x: -475, y: 0, z: 54 },
                { id: 6, x: -475, y: 0, z: 57 },
                { id: 10, x: -475, y: 0, z: 62 },
                { id: 8, x: -475, y: 0, z: 63 },
                { id: 12, x: -425, y: 10, z: 67 },
                { id: 13, x: -475, y: 0, z: 69 },
                { id: 11, x: -475, y: -10, z: 71 },
                { id: 14, x: -475, y: -10, z: 73 },
                { id: 8, x: -475, y: 0, z: 77 },
                { id: 9, x: -475, y: 0, z: 79 },
                { id: 7, x: -475, y: 0, z: 84 },
                { id: 6, x: -475, y: 0, z: 87 },
                { id: 1, x: -675, y: 0, z: 8 },
                { id: 29, x: -675, y: 0, z: 10 },
                { id: 0, x: -775, y: 0, z: 19 },
                { id: 3, x: -695, y: 0, z: 20 },
                { id: 1, x: -1125, y: 0, z: 27 },
                { id: 29, x: -675, y: 0, z: 28 },
                { id: 1, x: -675, y: 0, z: 38 },
                { id: 29, x: -675, y: 0, z: 40 },
                { id: 0, x: -775, y: 0, z: 49 },
                { id: 4, x: -695, y: 0, z: 50 },
                { id: 1, x: -1125, y: 0, z: 57 },
                { id: 29, x: -675, y: 0, z: 58 },
                { id: 1, x: -675, y: 0, z: 68 },
                { id: 29, x: -675, y: 0, z: 70 },
                { id: 0, x: -775, y: 0, z: 79 },
                { id: 5, x: -695, y: 0, z: 80 },
                { id: 1, x: -1125, y: 0, z: 87 },
                { id: 29, x: -675, y: 0, z: 88 },
                { id: 0, x: 450, y: 0, z: 0 },
                { id: 19, x: 450, y: 0, z: 3 },
                { id: 25, x: 400, y: 0, z: 7 },
                { id: 16, x: 450, y: 0, z: 8 },
                { id: 23, x: 450, y: 0, z: 11 },
                { id: 17, x: 450, y: 0, z: 14 },
                { id: 2, x: 450, y: 0, z: 19 },
                { id: 24, x: 450, y: 0, z: 22 },
                { id: 15, x: 450, y: 0, z: 26 },
                { id: 0, x: 450, y: 0, z: 30 },
                { id: 19, x: 450, y: 0, z: 33 },
                { id: 25, x: 400, y: 0, z: 37 },
                { id: 16, x: 450, y: 0, z: 38 },
                { id: 23, x: 450, y: 0, z: 41 },
                { id: 17, x: 450, y: 0, z: 44 },
                { id: 2, x: 450, y: 0, z: 49 },
                { id: 24, x: 450, y: 0, z: 52 },
                { id: 15, x: 450, y: 0, z: 56 },
                { id: 0, x: 450, y: 0, z: 60 },
                { id: 19, x: 450, y: 0, z: 63 },
                { id: 25, x: 400, y: 0, z: 67 },
                { id: 16, x: 450, y: 0, z: 68 },
                { id: 23, x: 450, y: 0, z: 71 },
                { id: 17, x: 450, y: 0, z: 74 },
                { id: 2, x: 450, y: 0, z: 79 },
                { id: 24, x: 450, y: 0, z: 82 },
                { id: 15, x: 450, y: 0, z: 86 },
                { id: 2, x: 600, y: 0, z: 8 },
                { id: 30, x: 650, y: 0, z: 9 },
                { id: 26, x: 700, y: 0, z: 19 },
                { id: 30, x: 650, y: 0, z: 23 },
                { id: 2, x: 600, y: 0, z: 38 },
                { id: 30, x: 650, y: 0, z: 39 },
                { id: 26, x: 700, y: 0, z: 49 },
                { id: 30, x: 650, y: 0, z: 53 },
                { id: 2, x: 600, y: 0, z: 68 },
                { id: 30, x: 650, y: 0, z: 69 },
                { id: 26, x: 700, y: 0, z: 79 },
                { id: 30, x: 650, y: 0, z: 83 },
              ],
            ])
          : "sewer" === ig.game.curLevel
          ? (b = [
              [
                { id: 9, x: -520, y: 0, z: 0 },
                { id: 9, x: -520, y: 0, z: 6 },
                { id: 8, x: -520, y: 0, z: 12 },
                { id: 7, x: -520, y: 0, z: 18 },
                { id: 6, x: -520, y: 0, z: 24 },
                { id: 8, x: -520, y: 0, z: 30 },
                { id: 8, x: -520, y: 0, z: 36 },
                { id: 7, x: -520, y: 0, z: 42 },
                { id: 8, x: -520, y: 0, z: 48 },
                { id: 9, x: -520, y: 0, z: 54 },
                { id: 6, x: -520, y: 0, z: 60 },
                { id: 7, x: -520, y: 0, z: 66 },
                { id: 11, x: -520, y: 0, z: 72 },
                { id: 8, x: -520, y: 0, z: 78 },
                { id: 8, x: -520, y: 0, z: 84 },
                { id: 14, x: -166, y: 0, z: 4 },
                { id: 12, x: 264, y: 0, z: 7 },
                { id: 20, x: 260, y: 0, z: 11 },
                { id: 18, x: -177, y: 0, z: 13 },
                { id: 21, x: 34, y: 0, z: 20 },
                { id: 12, x: 191, y: 0, z: 24 },
                { id: 16, x: -245, y: 0, z: 24 },
                { id: 16, x: 186, y: 0, z: 27 },
                { id: 18, x: 21, y: 0, z: 2 },
                { id: 17, x: -70, y: 0, z: 3 },
                { id: 20, x: -276, y: 0, z: 4 },
                { id: 20, x: 215, y: 0, z: 13 },
                { id: 17, x: -58, y: 0, z: 20 },
                { id: 14, x: -107, y: 0, z: 21 },
                { id: 12, x: 142, y: 0, z: 26 },
                { id: 18, x: 108, y: 0, z: 28 },
                { id: 14, x: -166, y: 0, z: 34 },
                { id: 12, x: 264, y: 0, z: 37 },
                { id: 20, x: 260, y: 0, z: 41 },
                { id: 18, x: -177, y: 0, z: 43 },
                { id: 21, x: 34, y: 0, z: 50 },
                { id: 12, x: 191, y: 0, z: 54 },
                { id: 16, x: -245, y: 0, z: 54 },
                { id: 16, x: 186, y: 0, z: 57 },
                { id: 18, x: 21, y: 0, z: 32 },
                { id: 17, x: -70, y: 0, z: 33 },
                { id: 20, x: -276, y: 0, z: 34 },
                { id: 20, x: 215, y: 0, z: 43 },
                { id: 17, x: -58, y: 0, z: 50 },
                { id: 14, x: -107, y: 0, z: 51 },
                { id: 12, x: 142, y: 0, z: 56 },
                { id: 18, x: 108, y: 0, z: 58 },
                { id: 14, x: -166, y: 0, z: 64 },
                { id: 12, x: 264, y: 0, z: 67 },
                { id: 20, x: 260, y: 0, z: 71 },
                { id: 18, x: -177, y: 0, z: 73 },
                { id: 21, x: 34, y: 0, z: 80 },
                { id: 12, x: 191, y: 0, z: 84 },
                { id: 16, x: -245, y: 0, z: 84 },
                { id: 16, x: 186, y: 0, z: 87 },
                { id: 18, x: 21, y: 0, z: 62 },
                { id: 17, x: -70, y: 0, z: 63 },
                { id: 20, x: -276, y: 0, z: 64 },
                { id: 20, x: 215, y: 0, z: 73 },
                { id: 17, x: -58, y: 0, z: 80 },
                { id: 14, x: -107, y: 0, z: 81 },
                { id: 12, x: 142, y: 0, z: 86 },
                { id: 18, x: 108, y: 0, z: 88 },
                { id: 3, x: 520, y: 0, z: 0 },
                { id: 0, x: 520, y: 0, z: 6 },
                { id: 1, x: 520, y: 0, z: 12 },
                { id: 2, x: 520, y: 0, z: 18 },
                { id: 4, x: 520, y: 0, z: 24 },
                { id: 5, x: 520, y: 0, z: 30 },
                { id: 5, x: 520, y: 0, z: 36 },
                { id: 0, x: 520, y: 0, z: 42 },
                { id: 10, x: 520, y: 0, z: 48 },
                { id: 3, x: 520, y: 0, z: 54 },
                { id: 1, x: 520, y: 0, z: 60 },
                { id: 5, x: 520, y: 0, z: 66 },
                { id: 1, x: 520, y: 0, z: 72 },
                { id: 2, x: 520, y: 0, z: 78 },
                { id: 3, x: 520, y: 0, z: 84 },
              ],
            ])
          : "rooftop" === ig.game.curLevel &&
            (b = [
              [
                { id: 0, x: -500, y: 0, z: 3 },
                { id: 11, x: -500, y: 0, z: 8 },
                { id: 11, x: -500, y: 0, z: 14 },
                { id: 11, x: -500, y: 0, z: 20 },
                { id: 0, x: -500, y: 0, z: 33 },
                { id: 11, x: -500, y: 0, z: 40 },
                { id: 11, x: -500, y: 0, z: 44 },
                { id: 11, x: -500, y: 0, z: 50 },
                { id: 0, x: -500, y: 0, z: 63 },
                { id: 11, x: -500, y: 0, z: 68 },
                { id: 11, x: -500, y: 0, z: 74 },
                { id: 11, x: -500, y: 0, z: 80 },
                { id: 18, x: 111, y: 0, z: 7 },
                { id: 28, x: -56, y: 0, z: 3 },
                { id: 21, x: 181, y: 0, z: 13 },
                { id: 25, x: -8, y: 0, z: 17 },
                { id: 26, x: -213, y: 0, z: 21 },
                { id: 22, x: 100, y: 0, z: 25 },
                { id: 28, x: 205, y: 0, z: 27 },
                { id: 20, x: -161, y: 0, z: 24 },
                { id: 18, x: 111, y: 0, z: 37 },
                { id: 28, x: -56, y: 0, z: 33 },
                { id: 21, x: 181, y: 0, z: 43 },
                { id: 25, x: -8, y: 0, z: 47 },
                { id: 26, x: -213, y: 0, z: 51 },
                { id: 22, x: 100, y: 0, z: 55 },
                { id: 28, x: 205, y: 0, z: 57 },
                { id: 20, x: -200, y: 0, z: 54 },
                { id: 18, x: 111, y: 0, z: 67 },
                { id: 28, x: -56, y: 0, z: 63 },
                { id: 21, x: 181, y: 0, z: 73 },
                { id: 25, x: -8, y: 0, z: 77 },
                { id: 26, x: -213, y: 0, z: 81 },
                { id: 22, x: 100, y: 0, z: 85 },
                { id: 28, x: 205, y: 0, z: 87 },
                { id: 20, x: -161, y: 0, z: 84 },
                { id: 5, x: 500, y: 0, z: 6 },
                { id: 11, x: 500, y: 0, z: 14 },
                { id: 11, x: 500, y: 0, z: 20 },
                { id: 5, x: 450, y: 0, z: 35 },
                { id: 11, x: 500, y: 0, z: 42 },
                { id: 11, x: 500, y: 0, z: 44 },
                { id: 11, x: 500, y: 0, z: 50 },
                { id: 5, x: 500, y: 0, z: 66 },
                { id: 11, x: 500, y: 0, z: 74 },
                { id: 11, x: 500, y: 0, z: 80 },
              ],
            ]);
        return b;
      },
    });
  });
ig.baked = !0;
ig.module("game.entities.game-control")
  .requires(
    "impact.entity",
    "game.entities.game-ui",
    "game.entities.game-character",
    "game.entities.game-bgObject",
    "game.entities.game-obstacle",
    "game.entities.game-pickup",
    "game.entities.game-hiteffect",
    "game.entities.segment-control"
  )
  .defines(function () {
    EntityGameControl = ig.Entity.extend({
      zIndex: 100,
      cityImage: new ig.Image("media/graphics/game/backgrounds/cityscape.png"),
      cityPos: { x: 0, y: 395 },
      sewerBgImage: new ig.Image(
        "media/graphics/game/backgrounds/sewer-bg.png"
      ),
      sewerBgPos: { x: 0, y: 0 },
      cloudImage: [
        new ig.Image("media/graphics/game/backgrounds/cloud0.png"),
        new ig.Image("media/graphics/game/backgrounds/cloud1.png"),
        new ig.Image("media/graphics/game/backgrounds/cloud2.png"),
        new ig.Image("media/graphics/game/backgrounds/cloud3.png"),
      ],
      cloudPos: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      gameStarting: !0,
      gameEnding: !1,
      gamePaused: !1,
      gameOver: !1,
      ui: null,
      character: null,
      gameStartTime: 0,
      gameTime: 0,
      gameOverTime: 0,
      tutorialMode: !1,
      tutorialPauseMode: !1,
      tutorialStage: 1,
      tutorialStopDistance: 0,
      tutorialPausedTime: 0,
      vanishingPoint: { x: 240, y: 355 },
      horizonLine: { x: 0, y: 520 },
      distanceFogHeight: 50,
      sidewalk1ScreenPoints: Array(4),
      sidewalk2ScreenPoints: Array(4),
      roadScreenPoints: Array(4),
      roadLine1ScreenPoints: Array(4),
      roadLine2ScreenPoints: Array(4),
      laneLine1ScreenPoints: Array(4),
      laneLine2ScreenPoints: Array(4),
      grass1ScreenPoints: Array(4),
      grass2ScreenPoints: Array(4),
      cameraPos: { x: 0, y: 0, z: 0 },
      sidewalkPos: { x: 0, y: 0 },
      sidewalkWidth: 950,
      sidewalkColor: { r: 214, g: 220, b: 230 },
      sidewalk1Pos: { x: -450, y: 0 },
      sidewalk1Width: 200,
      sidewalk2Pos: { x: 450, y: 0 },
      sidewalk2Width: 200,
      roadPos: { x: 0, y: 0 },
      roadWidth: 700,
      roadColor: { r: 89, g: 100, b: 106 },
      roadLine1Pos: { x: 268, y: 0 },
      roadLine1Width: 10,
      roadLine1Color: { r: 120, g: 141, b: 175 },
      roadLine2Pos: { x: -268, y: 0 },
      roadLine2Width: 10,
      roadLine2Color: { r: 120, g: 141, b: 175 },
      laneLine1Pos: { x: -125, y: 0, z: 0 },
      laneLine1Width: 15,
      laneLine1Color: { r: 255, g: 255, b: 255 },
      laneLine2Pos: { x: 125, y: 0, z: 0 },
      laneLine2Width: 15,
      laneLine2Color: { r: 255, g: 255, b: 255 },
      roadZOffset: 0,
      laneLineLength: 4,
      cameraDistance: 10,
      vanishingPointOffset: { x: 0, y: 0 },
      runSpeed: 20,
      maxRunSpeed: 35,
      acceleration: 0.05,
      jumpGravity: 2e3,
      jumpAmt: 0,
      canSlide: !0,
      isSliding: !1,
      slideDuration: 0.7,
      slideTime: 0,
      objects: [],
      effects: [],
      segments: [],
      bgSets: [],
      segmentSize: 21,
      bgSetSize: 90,
      segmentSizeVariable: 5,
      totalDistance: 0,
      lastBgSetDistance: 0,
      lastSegmentDistance: 0,
      charMoveTargetLim_X: 180,
      charChangeLaneSpeed: 1e3,
      bgSetDefinitions: null,
      segmentDefinitions: null,
      distanceLimit: 0,
      distanceInc: 200,
      lvl_isEnding: !1,
      lvl_endObstacles: !1,
      lvlEnd_timeLeft: 0,
      lvlEnd_endObsTime: 8,
      lvlEnd_endLvlTime: 2.65,
      bikeSpeedGain: 6,
      isApp: !1,
      tutorialDefinitions: [
        [
          { id: 5, x: -225, y: 0, z: 7 },
          { id: 0, x: -225, y: 0, z: 12 },
          { id: 5, x: -225, y: 0, z: 14 },
          { id: 3, x: 0, y: 0, z: 6 },
          { id: 8, x: 225, y: 0, z: 7 },
          { id: 9, x: 225, y: 0, z: 12 },
          { type: 2, id: 1, x: 0, y: 200, z: 6 },
          { type: 2, id: 0, x: 0, y: 0, z: 12 },
          { type: 2, id: 0, x: 0, y: 0, z: 14 },
          { type: 2, id: 0, x: 225, y: 0, z: 20 },
          { id: 5, x: -225, y: 0, z: 26 },
          { id: 5, x: -225, y: 0, z: 31 },
          { id: 6, x: 0, y: 0, z: 25 },
          { type: 2, x: 225, y: 0, z: 27 },
          { type: 2, x: 225, y: 0, z: 29 },
          { type: 2, x: 0, y: 0, z: 39 },
          { type: 2, x: -225, y: 0, z: 43 },
          { type: 2, x: -225, y: 0, z: 45 },
          { id: 3, x: -140, y: 0, z: 50 },
          { id: 6, x: 0, y: 0, z: 51 },
          { id: 6, x: 0, y: 0, z: 56 },
          { id: 11, x: 225, y: 0, z: 52 },
          { type: 2, id: 1, x: -225, y: 0, z: 50 },
          { type: 2, x: -225, y: 0, z: 56 },
          { type: 2, x: -225, y: 0, z: 58 },
          { type: 2, x: -225, y: 0, z: 60 },
        ],
      ],
      charIsMoving: !1,
      charIsMovingLeft: !1,
      charMoveTargetX: 0,
      touchTime: 0,
      touchPos: { x: 0, y: 0 },
      touchThreshold: 1,
      lifeCount: 3,
      coinsCollected: 0,
      powerLevel: 0,
      powerLevelUsage: 0.1,
      endImg_sewer: new ig.Image(
        "media/graphics/game/objects/enders/sewer_end2.png"
      ),
      init: function (b, c, d) {
        this.parent(b, c, d);
        this.vanishingPoint.y += heightOffset;
        this.horizonLine.y += heightOffset;
        this.cityPos.y += heightOffset;
        this.isApp = "ontouchstart" in window;
        console.log(this.isApp);
        "sewer" === ig.game.curLevel &&
          (this.vanishingPoint = { x: 240, y: 355 + heightOffset });
        this.powerLevel = ig.game.lvlChn_powerLevel;
        this.coinsCollected = ig.game.lvlChn_coinCollected;
        this.vanishingPoint.x = ig.system.width / 2;
        b = ig.game.spawnEntity(EntitySegmentControl, 0, 0);
        this.bgSetDefinitions = b.setBgSegments();
        this.segmentDefinitions = b.setObstacleSegments();
        this.distanceLimit = ig.game.distanceLimit;
        this.runSpeed = ig.game.lastRunSpeed;
        this.lifeCount = ig.game.lastLifeCount;
        "street" === ig.game.curLevel
          ? ((b = ig.system.context),
            (this.bgSkyLinGrad = b.createLinearGradient(
              0,
              0,
              0,
              this.horizonLine.y
            )),
            this.bgSkyLinGrad.addColorStop(0, "rgba(102,190,223,1)"),
            this.bgSkyLinGrad.addColorStop(1, "rgba(203,232,196,1)"),
            (this.bgGroundLinGrad = b.createLinearGradient(
              0,
              this.horizonLine.y,
              0,
              ig.system.height
            )),
            this.bgGroundLinGrad.addColorStop(0, "rgba(166,212,74,1)"),
            this.bgGroundLinGrad.addColorStop(1, "rgba(110,170,70,1)"),
            (this.bgHorizonLinGrad = b.createLinearGradient(
              0,
              461 + heightOffset,
              0,
              575 + heightOffset
            )),
            this.bgHorizonLinGrad.addColorStop(0, "rgba(194,255,194,0)"),
            this.bgHorizonLinGrad.addColorStop(0.5, "rgba(194,255,194,0.5)"),
            this.bgHorizonLinGrad.addColorStop(1, "rgba(194,255,194,0)"),
            (this.cityPos.x = ig.system.width / 2 - this.cityImage.width / 2),
            (this.cloudPos[0].x = ig.system.width / 2 - 30),
            (this.cloudPos[0].y = 20 + heightOffset),
            (this.cloudPos[1].x = ig.system.width / 2 - 120),
            (this.cloudPos[1].y = 45 + heightOffset),
            (this.cloudPos[2].x = ig.system.width / 2 + 60),
            (this.cloudPos[2].y = 60 + heightOffset),
            (this.segmentSize = 22))
          : "sewer" === ig.game.curLevel
          ? ((b = ig.system.context),
            (this.bgSkyLinGrad = b.createLinearGradient(
              0,
              0,
              0,
              this.horizonLine.y
            )),
            this.bgSkyLinGrad.addColorStop(0, "rgba(0,0,0,1)"),
            this.bgSkyLinGrad.addColorStop(1, "rgba(0,0,0,1)"),
            (this.bgGroundLinGrad = b.createLinearGradient(
              0,
              this.horizonLine.y,
              0,
              ig.system.height
            )),
            this.bgGroundLinGrad.addColorStop(0, "rgba(0,0,0,1)"),
            this.bgGroundLinGrad.addColorStop(1, "rgba(0,0,0,1)"),
            (this.bgHorizonLinGrad = b.createLinearGradient(0, 461, 0, 370)),
            this.bgHorizonLinGrad.addColorStop(0, "rgba(150,200,0,0)"),
            this.bgHorizonLinGrad.addColorStop(0.5, "rgba(150,200,0,0.25)"),
            this.bgHorizonLinGrad.addColorStop(1, "rgba(150,200,0,0)"),
            (this.roadColor = { r: 70, g: 92, b: 43 }),
            (this.sidewalkColor = { r: 26, g: 38, b: 42 }))
          : "rooftop" === ig.game.curLevel &&
            ((b = ig.system.context),
            (this.bgSkyLinGrad = b.createLinearGradient(
              0,
              0,
              0,
              this.horizonLine.y
            )),
            this.bgSkyLinGrad.addColorStop(0, "rgba(91,205,239,1)"),
            (this.bgGroundLinGrad = b.createLinearGradient(
              0,
              this.horizonLine.y,
              0,
              ig.system.height
            )),
            this.bgGroundLinGrad.addColorStop(0, "rgba(91,205,239,1)"),
            (this.bgHorizonLinGrad = b.createLinearGradient(
              0,
              461 + heightOffset,
              0,
              575 + heightOffset
            )),
            this.bgHorizonLinGrad.addColorStop(0, "rgba(91,205,239,0)"),
            this.bgHorizonLinGrad.addColorStop(0.5, "rgba(91,205,239,0.5)"),
            this.bgHorizonLinGrad.addColorStop(1, "rgba(91,205,239,0)"),
            (this.cityPos.x = ig.system.width / 2 - this.cityImage.width / 2),
            (this.cloudPos[0].x = ig.system.width / 2 - 30),
            (this.cloudPos[0].y = 20 + heightOffset),
            (this.cloudPos[1].x = ig.system.width / 2 - 120),
            (this.cloudPos[1].y = 45 + heightOffset),
            (this.cloudPos[2].x = ig.system.width / 2 + 60),
            (this.cloudPos[2].y = 60 + heightOffset),
            (this.roadColor = { r: 90, g: 124, b: 133 }),
            (this.sidewalkColor = { r: 78, g: 111, b: 120 }),
            (this.sidewalk2Width = this.sidewalk1Width = this.sidewalkWidth = 470),
            (this.segmentSize = 30),
            (this.laneLineLength = 10),
            (this.laneLine2Width = this.laneLine1Width = 7));
        ig.game.doTutorialFlag && (this.tutorialMode = !0);
      },
      updatePosition: function () {
        this.vanishingPoint.y = 355 + heightOffset;
        this.horizonLine.y = 520 + heightOffset;
        this.cityPos.y = 395 + heightOffset;
        "sewer" === ig.game.curLevel &&
          (this.vanishingPoint = { x: 240, y: 355 + heightOffset });
        this.powerLevel = ig.game.lvlChn_powerLevel;
        this.coinsCollected = ig.game.lvlChn_coinCollected;
        this.vanishingPoint.x = ig.system.width / 2;
        if ("street" === ig.game.curLevel) {
          var b = ig.system.context;
          this.bgSkyLinGrad = b.createLinearGradient(
            0,
            0,
            0,
            this.horizonLine.y
          );
          this.bgSkyLinGrad.addColorStop(0, "rgba(102,190,223,1)");
          this.bgSkyLinGrad.addColorStop(1, "rgba(203,232,196,1)");
          this.bgGroundLinGrad = b.createLinearGradient(
            0,
            this.horizonLine.y,
            0,
            ig.system.height
          );
          this.bgGroundLinGrad.addColorStop(0, "rgba(166,212,74,1)");
          this.bgGroundLinGrad.addColorStop(1, "rgba(110,170,70,1)");
          this.bgHorizonLinGrad = b.createLinearGradient(
            0,
            461 + heightOffset,
            0,
            575 + heightOffset
          );
          this.bgHorizonLinGrad.addColorStop(0, "rgba(194,255,194,0)");
          this.bgHorizonLinGrad.addColorStop(0.5, "rgba(194,255,194,0.5)");
          this.bgHorizonLinGrad.addColorStop(1, "rgba(194,255,194,0)");
          this.cityPos.x = ig.system.width / 2 - this.cityImage.width / 2;
          this.cloudPos[0].x = ig.system.width / 2 - 30;
          this.cloudPos[0].y = 20 + heightOffset;
          this.cloudPos[1].x = ig.system.width / 2 - 120;
          this.cloudPos[1].y = 45 + heightOffset;
          this.cloudPos[2].x = ig.system.width / 2 + 60;
          this.cloudPos[2].y = 60 + heightOffset;
          this.segmentSize = 22;
        } else
          "sewer" === ig.game.curLevel
            ? ((b = ig.system.context),
              (this.bgSkyLinGrad = b.createLinearGradient(
                0,
                0,
                0,
                this.horizonLine.y
              )),
              this.bgSkyLinGrad.addColorStop(0, "rgba(0,0,0,1)"),
              this.bgSkyLinGrad.addColorStop(1, "rgba(0,0,0,1)"),
              (this.bgGroundLinGrad = b.createLinearGradient(
                0,
                this.horizonLine.y,
                0,
                ig.system.height
              )),
              this.bgGroundLinGrad.addColorStop(0, "rgba(0,0,0,1)"),
              this.bgGroundLinGrad.addColorStop(1, "rgba(0,0,0,1)"),
              (this.bgHorizonLinGrad = b.createLinearGradient(0, 461, 0, 370)),
              this.bgHorizonLinGrad.addColorStop(0, "rgba(150,200,0,0)"),
              this.bgHorizonLinGrad.addColorStop(0.5, "rgba(150,200,0,0.25)"),
              this.bgHorizonLinGrad.addColorStop(1, "rgba(150,200,0,0)"))
            : "rooftop" === ig.game.curLevel &&
              ((b = ig.system.context),
              (this.bgSkyLinGrad = b.createLinearGradient(
                0,
                0,
                0,
                this.horizonLine.y
              )),
              this.bgSkyLinGrad.addColorStop(0, "rgba(91,205,239,1)"),
              (this.bgGroundLinGrad = b.createLinearGradient(
                0,
                this.horizonLine.y,
                0,
                ig.system.height
              )),
              this.bgGroundLinGrad.addColorStop(0, "rgba(91,205,239,1)"),
              (this.bgHorizonLinGrad = b.createLinearGradient(
                0,
                461 + heightOffset,
                0,
                575 + heightOffset
              )),
              this.bgHorizonLinGrad.addColorStop(0, "rgba(91,205,239,0)"),
              this.bgHorizonLinGrad.addColorStop(0.5, "rgba(91,205,239,0.5)"),
              this.bgHorizonLinGrad.addColorStop(1, "rgba(91,205,239,0)"),
              (this.cityPos.x = ig.system.width / 2 - this.cityImage.width / 2),
              (this.cloudPos[0].x = ig.system.width / 2 - 30),
              (this.cloudPos[0].y = 20 + heightOffset),
              (this.cloudPos[1].x = ig.system.width / 2 - 120),
              (this.cloudPos[1].y = 45 + heightOffset),
              (this.cloudPos[2].x = ig.system.width / 2 + 60),
              (this.cloudPos[2].y = 60 + heightOffset));
        ig.game.sortEntities();
        this.recalculateScreenPoints();
      },
      ready: function () {
        this.pointer = ig.game.getEntitiesByType(EntityPointer)[0];
        this.character = ig.game.spawnEntity(
          EntityGameCharacter,
          ig.system.width / 2,
          800 + heightOffset
        );
        this.character.startY = 800 + heightOffset;
        this.character.ready();
        this.ui = ig.game.spawnEntity(EntityGameUi, 0, 0);
        this.ui.ready();
        this.spawnStartingObjects();
        ig.game.sortEntities();
        this.recalculateScreenPoints();
        this.gameStartTime = ig.system.clock.delta();
        this.tutorialMode &&
          (this.character.run(),
          0 == this.tutorialStopDistance &&
            ((this.tutorialPauseMode = !0), this.doNextTutorialStage()));
      },
      draw: function () {
        ig.system.context.scale(1, 1);
        var b = ig.system.context,
          c = null,
          d = null,
          c = this.sidewalkColor;
        b.fillStyle = "rgba(" + c.r + "," + c.g + "," + c.b + ",1)";
        d = this.sidewalk1ScreenPoints;
        b.beginPath();
        b.moveTo(d[0].x, d[0].y);
        for (var e = 1; e < d.length; e++) b.lineTo(d[e].x, d[e].y);
        b.closePath();
        b.fill();
        d = this.sidewalk2ScreenPoints;
        b.beginPath();
        b.moveTo(d[0].x, d[0].y);
        for (e = 1; e < d.length; e++) b.lineTo(d[e].x, d[e].y);
        b.closePath();
        b.fill();
        c = this.roadColor;
        b.fillStyle = "rgba(" + c.r + "," + c.g + "," + c.b + ",1)";
        d = this.roadScreenPoints;
        b.beginPath();
        b.moveTo(d[0].x, d[0].y);
        for (e = 1; e < d.length; e++) b.lineTo(d[e].x, d[e].y);
        b.closePath();
        b.fill();
        c = this.roadLine1Color;
        b.fillStyle = "rgba(" + c.r + "," + c.g + "," + c.b + ",1)";
        d = this.roadLine1ScreenPoints;
        b.beginPath();
        b.moveTo(d[0].x, d[0].y);
        for (e = 1; e < d.length; e++) b.lineTo(d[e].x, d[e].y);
        b.closePath();
        d = this.roadLine2ScreenPoints;
        b.beginPath();
        b.moveTo(d[0].x, d[0].y);
        for (e = 1; e < d.length; e++) b.lineTo(d[e].x, d[e].y);
        b.closePath();
        if ("street" === ig.game.curLevel) {
          c = this.laneLine1Color;
          b.fillStyle = "rgba(" + c.r + "," + c.g + "," + c.b + ",0.75)";
          var d = 7,
            f = {};
          f.x = this.laneLine1Pos.x;
          f.y = this.laneLine1Pos.y;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += 4 * this.laneLineLength),
              this.drawPerspectiveLine(
                f,
                this.laneLineLength,
                this.laneLine1Width,
                this.laneLine1Color
              );
          f.x = this.laneLine2Pos.x;
          f.y = this.laneLine2Pos.y;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += 4 * this.laneLineLength),
              this.drawPerspectiveLine(
                f,
                this.laneLineLength,
                this.laneLine2Width,
                this.laneLine2Color
              );
        } else if ("sewer" === ig.game.curLevel) {
          b.fillStyle = "rgba(58,79,36,1)";
          d = 7;
          this.laneLineLength = 10;
          f = {};
          f.x = this.laneLine1Pos.x;
          f.y = this.laneLine1Pos.y;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(
                f,
                this.laneLineLength,
                this.laneLine1Width,
                this.laneLine1Color
              );
          f.x = this.laneLine2Pos.x;
          f.y = this.laneLine2Pos.y;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(
                f,
                this.laneLineLength,
                this.laneLine2Width,
                this.laneLine2Color
              );
          f = { x: -340 };
          f.y = this.laneLine1Pos.y;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(
                f,
                this.laneLineLength,
                30,
                this.laneLine1Color
              );
          f.x = 350;
          f.y = this.laneLine2Pos.y;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(
                f,
                this.laneLineLength,
                30,
                this.laneLine2Color
              );
          var j = { r: 58, g: 79, b: 36 };
          b.fillStyle = "rgba(78,99,56,1)";
          f = { x: -315, y: 10, z: 0 };
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(f, this.laneLineLength, 15, j);
          f.x = 325;
          f.y = 0;
          for (e = f.z = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(f, this.laneLineLength, 15, j);
          this.gutter1.draw(0, 515 + heightOffset);
          this.gutter2.draw(408, 515 + heightOffset);
        } else if ("rooftop" === ig.game.curLevel) {
          b.fillStyle = "rgba(80,113,120,1)";
          d = 7;
          f = {};
          f.x = this.laneLine1Pos.x;
          f.y = this.laneLine1Pos.y;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(
                f,
                this.laneLineLength,
                this.laneLine1Width,
                this.laneLine1Color
              );
          f.x = this.laneLine2Pos.x;
          f.y = this.laneLine2Pos.y;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(
                f,
                this.laneLineLength,
                this.laneLine2Width,
                this.laneLine2Color
              );
        }
        if ("street" === ig.game.curLevel) {
          "street" === ig.game.curLevel
            ? (c = this.roadLine1Color)
            : "sewer" === ig.game.curLevel && (c = { r: 15, g: 26, b: 25 });
          b.fillStyle = "rgba(" + c.r + "," + c.g + "," + c.b + ",1)";
          d = 24;
          f = {};
          f.x = -this.sidewalk1Pos.x;
          "sewer" === ig.game.curLevel && (f.x += 15);
          f.y = 0;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(f, 0.05, 200, this.roadLine1Color);
          f = {};
          f.x = this.sidewalk1Pos.x;
          "sewer" === ig.game.curLevel && (f.x -= 15);
          f.y = 0;
          f.z = this.roadZOffset;
          for (e = 0; e < d; e++)
            (f.z += this.laneLineLength),
              this.drawPerspectiveLine(f, 0.05, 200, this.roadLine2Color);
        }
        this.drawGround();
        "street" === ig.game.curLevel &&
          this.cityImage.draw(this.cityPos.x, this.cityPos.y);
        "sewer" === ig.game.curLevel &&
          this.sewerBgImage.draw(this.cityPos.x, this.cityPos.y + 1);
      },
      gutter1: new ig.Image("media/graphics/game/objects/sewer/gutter.png"),
      gutter2: new ig.Image("media/graphics/game/objects/sewer/gutter2.png"),
      camPos: !1,
      camFrame: 0,
      update: function () {
        this.character.state == this.character.STATES.POWERED &&
        !this.gamePaused
          ? (this.camFrame++,
            5 <= this.camFrame &&
              ((this.cameraPos = (this.camPos = !this.camPos)
                ? { x: 2, y: 0, z: 0 }
                : { x: -2, y: 0, z: 0 }),
              (this.camFrame = 0)))
          : ((this.camPos = !1), (this.cameraPos = { x: 0, y: 0, z: 0 }));
        if (this.gameStarting)
          0.25 < ig.system.clock.delta() - this.gameStartTime &&
            ((this.gameStarting = !1),
            (this.gameStartTime = ig.system.clock.delta()));
        else if (this.gameEnding)
          0.25 < ig.system.clock.delta() - this.gameEndTime && this.endGame();
        else if (!this.gamePaused && !this.gameOver)
          if (
            ((this.gameTime += ig.system.tick),
            this.character.state == this.character.STATES.INTRO ||
              this.lvl_isEnding)
          )
            (this.lvlEnd_timeLeft -= ig.system.tick),
              0 >= this.lvlEnd_timeLeft && this.switchLevel();
          else if ((this.updatePlayerInput(), !this.tutorialPauseMode)) {
            var b = this.runSpeed;
            this.character.state == this.character.STATES.POWERED &&
              (b += this.bikeSpeedGain);
            b *= ig.system.tick;
            if (
              this.tutorialMode &&
              this.totalDistance + b >= this.tutorialStopDistance
            ) {
              b = this.tutorialStopDistance - this.totalDistance;
              if (0 < b)
                for (var c = 0; c < this.objects.length; c++)
                  this.objects[c].moveForward(-b);
              this.doNextTutorialStage();
            }
            0 < b &&
              ((this.totalDistance += b),
              (this.roadZOffset -= b),
              this.roadZOffset < 4 * -this.laneLineLength &&
                (this.roadZOffset += 4 * this.laneLineLength));
            0 != this.jumpAmt
              ? ((this.character.jumpOffset -= this.jumpAmt * ig.system.tick),
                0 <= this.character.jumpOffset
                  ? ((this.jumpAmt = this.character.jumpOffset = 0),
                    this.character.run(),
                    (this.canSlide = !0))
                  : (this.jumpAmt -= this.jumpGravity * ig.system.tick))
              : 0 > this.character.jumpOffset &&
                (this.jumpAmt -= this.jumpGravity * ig.system.tick);
            this.isSliding &&
              ((this.slideTime += ig.system.tick),
              this.slideTime > this.slideDuration &&
                ((this.isSliding = !1),
                (this.canSlide = !0),
                this.character.run()));
            this.charIsMoving &&
              (this.charIsMovingLeft
                ? ((this.character.pos.x -=
                    this.charChangeLaneSpeed * ig.system.tick),
                  this.character.pos.x < this.charMoveTargetX &&
                    ((this.character.pos.x = this.charMoveTargetX),
                    (this.charIsMoving = !1)))
                : ((this.character.pos.x +=
                    this.charChangeLaneSpeed * ig.system.tick),
                  this.character.pos.x > this.charMoveTargetX &&
                    ((this.character.pos.x = this.charMoveTargetX),
                    (this.charIsMoving = !1))));
            this.updateBgSets();
            this.updateSegments();
            this.updateCollisions();
            this.runSpeed += this.acceleration * ig.system.tick;
            this.runSpeed > this.maxRunSpeed &&
              (this.runSpeed = this.maxRunSpeed);
            this.character.state == this.character.STATES.POWERED &&
              ((this.powerLevel -= this.powerLevelUsage * ig.system.tick),
              0 >= this.powerLevel &&
                ((this.powerLevel = 0), this.character.powerDown()));
            this.totalDistance >= this.distanceLimit &&
              !this.lvl_endObstacles &&
              (this.lvl_endObstacles = !0);
          }
      },
      togglePauseGame: function () {
        this.gamePaused ? this.unpauseGame() : this.pauseGame();
      },
      pauseGame: function () {
        if (!this.gameOver && !this.gamePaused) {
          this.gamePaused = !0;
          this.character.anim.timer.pause();
          for (var b = 0; b < this.objects.length; b++)
            this.objects[b].anim && this.objects[b].anim.timer.pause();
          for (b = 0; b < this.effects.length; b++)
            this.effects[b].anim && this.effects[b].anim.timer.pause();
        }
      },
      unpauseGame: function () {
        if (this.gamePaused) {
          this.gamePaused = !1;
          this.character.anim.timer.unpause();
          for (var b = 0; b < this.objects.length; b++)
            this.objects[b].anim && this.objects[b].anim.timer.unpause();
          for (b = 0; b < this.effects.length; b++)
            this.effects[b].anim && this.effects[b].anim.timer.unpause();
        }
      },
      aabbCheck: function (b, c) {
        return b.x + b.w > c.x &&
          b.x < c.x + c.w &&
          b.y + b.h > c.y &&
          b.y < c.y + c.h
          ? !0
          : !1;
      },
      updatePlayerInput: function () {
        this.gamePaused ||
          (ig.ua.mobile || this.isApp
            ? this.processTouchInput()
            : this.processKeyboardInput());
      },
      processKeyboardInput: function () {
        ig.input.state("left")
          ? this.characterMoveLeft()
          : ig.input.state("right") && this.characterMoveRight();
        ig.input.state("up") && this.characterJump();
        ig.input.state("down") && this.characterSlide();
      },
      pressDelay: 0,
      processTouchInput: function () {
        if (
          !this.ui.shop ||
          !(console.log(this.ui.shop.inGameOnShop), this.ui.shop.inGameOnShop)
        )
          if (0 < this.pressDelay) this.pressDelay--;
          else if (ig.input.pressed("click")) {
            this.touchTime = ig.system.clock.delta();
            this.pointer.refreshPos();
            if (ig.ua.mobile)
              (b = this.pointer.pos.x - this.pointer.size.x / 2),
                (c = this.pointer.pos.y - this.pointer.size.y / 2);
            else
              var b = this.pointer.pos.x / multiplier - this.pointer.size.x / 2,
                c = this.pointer.pos.y / multiplier - this.pointer.size.y / 2;
            430 <= this.pointer.pos.x && 30 >= this.pointer.pos.y
              ? console.log("shop button")
              : (this.touchPos = { x: b, y: c });
          } else if (
            ig.input.released("click") &&
            ig.system.clock.delta() - this.touchTime < this.touchThreshold
          )
            if (
              (this.pointer.refreshPos(),
              ig.ua.mobile
                ? ((b = this.pointer.pos.x - this.pointer.size.x / 2),
                  (c = this.pointer.pos.y - this.pointer.size.y / 2))
                : ((b =
                    this.pointer.pos.x / multiplier - this.pointer.size.x / 2),
                  (c =
                    this.pointer.pos.y / multiplier - this.pointer.size.y / 2)),
              this.pointer.pos.x >= 400 + widthOffset &&
                140 >= this.pointer.pos.y)
            )
              console.log("shop button");
            else {
              var d = 0,
                e = 0,
                d = b - this.touchPos.x,
                e = c - this.touchPos.y;
              300 > d * d + e * e ||
                (Math.abs(e) >= Math.abs(d)
                  ? 0 > e
                    ? this.characterJump()
                    : this.characterSlide()
                  : 0 > d
                  ? this.characterMoveLeft()
                  : this.characterMoveRight());
            }
      },
      characterMoveLeft: function () {
        if (this.tutorialMode)
          if (7 == this.tutorialStage || 9 == this.tutorialStage) {
            if (!this.doNextTutorialStage()) return;
          } else return;
        !this.charIsMoving &&
          this.character.pos.x >
            ig.system.width / 2 - this.charMoveTargetLim_X &&
          ((this.charIsMovingLeft = this.charIsMoving = !0),
          (this.charMoveTargetX =
            this.character.pos.x > ig.system.width / 2
              ? ig.system.width / 2
              : ig.system.width / 2 - this.charMoveTargetLim_X));
      },
      characterMoveRight: function () {
        if (this.tutorialMode)
          if (5 == this.tutorialStage) {
            if (!this.doNextTutorialStage()) return;
          } else return;
        !this.charIsMoving &&
          this.character.pos.x <
            ig.system.width / 2 + this.charMoveTargetLim_X &&
          ((this.charIsMoving = !0),
          (this.charIsMovingLeft = !1),
          (this.charMoveTargetX =
            this.character.pos.x < ig.system.width / 2
              ? ig.system.width / 2
              : ig.system.width / 2 + this.charMoveTargetLim_X));
      },
      characterJump: function () {
        if (this.character.state != this.character.STATES.POWERED) {
          if (this.tutorialMode)
            if (3 == this.tutorialStage) {
              if (!this.doNextTutorialStage()) return;
            } else return;
          this.slideTime = 0;
          this.isSliding = !1;
          this.canSlide = !0;
          this.character.state = this.character.STATES.RUN;
          this.character.pos.y == this.character.startY &&
            this.character.canJump &&
            (this.character.state == this.character.STATES.SLIDE &&
              ((this.isSliding = !1), (this.slideTime = this.slideDuration)),
            (this.jumpAmt = 600),
            this.character.jump(),
            (this.character.canJump = !1));
        }
      },
      characterSlide: function () {
        if (this.tutorialMode)
          if (11 == this.tutorialStage) {
            if (!this.doNextTutorialStage()) return;
          } else return;
        this.character.state != this.character.STATES.POWERED &&
          ((this.jumpAmt = this.character.jumpOffset = 0),
          (this.character.canJump = !0),
          (this.character.state = this.character.STATES.RUN),
          0 == this.cameraPos.y &&
            this.canSlide &&
            (this.character.slide(),
            this.character.state == this.character.STATES.SLIDE &&
              ((this.isSliding = !0),
              (this.canSlide = !1),
              (this.character.canJump = !0),
              (this.slideTime = 0))));
      },
      spawnCollectEffect: function (b) {
        if (b) {
          var c = null,
            c = ig.game.spawnEntity(
              EntityGameHiteffect,
              this.character.pos.x,
              this.character.pos.y + heightOffset
            );
          return null != c
            ? ((c.worldPos = { x: b.worldPos.x, y: b.worldPos.y, z: b.zValue }),
              (c.zValue = b.zValue),
              c.setEffectId(1),
              c.ready(),
              (c.pos.x = b.pos.x),
              (c.pos.y = b.pos.y - 10),
              (c.zIndex = this.character.zIndex - 15),
              c.pos.x < ig.system.width / 2
                ? (c.pos.x -= 10)
                : c.pos.x > ig.system.width / 2 && (c.pos.x += 10),
              ig.game.sortEntities(),
              this.effects.push(c),
              c)
            : null;
        }
      },
      spawnHitEffect: function () {
        var b = null,
          b = ig.game.spawnEntity(
            EntityGameHiteffect,
            this.character.pos.x,
            this.character.pos.y + heightOffset
          );
        return null != b
          ? ((b.worldPos = {
              x: this.character.pos.x - ig.system.width / 2,
              y: 0,
              z: this.character.zValue,
            }),
            (b.zValue = this.character.zValue),
            b.ready(),
            (b.pos.x = this.character.pos.x),
            (b.pos.y = this.character.pos.y - 60 + heightOffset),
            ig.game.sortEntitiesDeferred(),
            this.effects.push(b),
            b)
          : null;
      },
      drawPerspectiveInfinite: function (b, c, d) {
        var e = this.cameraPos.y + ig.system.height,
          f = ig.system.width / 2 - this.cameraPos.x + b.x - c / 2,
          j = (e - this.vanishingPoint.y) / (f - this.vanishingPoint.x),
          m = this.horizonLine.y,
          j = (m - (this.vanishingPoint.y - j * this.vanishingPoint.x)) / j,
          q = this.cameraPos.y + ig.system.height;
        b = ig.system.width / 2 - this.cameraPos.x + b.x + c / 2;
        var l = (q - this.vanishingPoint.y) / (b - this.vanishingPoint.x);
        c = this.horizonLine.y;
        var l = (c - (this.vanishingPoint.y - l * this.vanishingPoint.x)) / l,
          p = ig.system.context;
        p.fillStyle = "rgba(" + d.r + "," + d.g + "," + d.b + ",1)";
        p.beginPath();
        p.moveTo(f, e);
        p.lineTo(j, m);
        p.lineTo(l, c);
        p.lineTo(b, q);
        p.closePath();
        p.fill();
      },
      drawPerspectiveLine: function (b, c, d) {
        var e = this.cameraDistance,
          f = b.z;
        if (!(f + c < e)) {
          var j = b.x;
          b = b.y;
          var m = f,
            q = m + c;
          f < e && (m = e);
          c = e / (m - this.cameraPos.z);
          f = e / (q - this.cameraPos.z);
          q = ig.system.width / 2 - this.cameraPos.x * c + j * c;
          e =
            this.cameraPos.y * c +
            ig.system.height -
            b * f -
            (1 - c) * (ig.system.height - this.vanishingPoint.y);
          m = ig.system.width / 2 - this.cameraPos.x * f + j * f;
          b =
            this.cameraPos.y * f +
            ig.system.height -
            b * f -
            (1 - f) * (ig.system.height - this.vanishingPoint.y);
          if (!(e <= this.horizonLine.y)) {
            b < this.horizonLine.y &&
              ((j = (e - b) / (q - m)),
              (b = this.horizonLine.y),
              (m = (b - (e - j * q)) / j));
            j = q - (d * c) / 2;
            c = q + (d * c) / 2;
            var q = m + (d * f) / 2,
              l = b;
            d = m - (d * f) / 2;
            f = b;
            b = ig.system.context;
            b.beginPath();
            b.moveTo(j, e);
            b.lineTo(c, e);
            b.lineTo(q, l);
            b.lineTo(d, f);
            b.closePath();
            b.fill();
          }
        }
      },
      drawGround: function () {
        var b = ig.system.context;
        b.save();
        b.fillStyle = this.bgSkyLinGrad;
        b.fillRect(0, 0, ig.system.width, this.horizonLine.y);
        if ("street" === ig.game.curLevel)
          for (var c = 0; c < this.cloudImage.length; c++)
            this.cloudImage[c].draw(this.cloudPos[c].x, this.cloudPos[c].y);
        else
          "rooftop" === ig.game.curLevel &&
            (this.cloudImage[1].draw(-44, 341 + heightOffset),
            this.cloudImage[3].draw(48, 190 + heightOffset),
            this.cloudImage[2].draw(511, 331 + heightOffset),
            this.cloudImage[0].draw(48, 122 + heightOffset),
            this.cloudImage[0].draw(261, 64 + heightOffset),
            this.cloudImage[0].draw(451, 101 + heightOffset));
        b.fillStyle = this.bgGroundLinGrad;
        points = this.grass1ScreenPoints;
        b.beginPath();
        b.moveTo(points[0].x, points[0].y);
        for (c = 1; c < points.length; c++) b.lineTo(points[c].x, points[c].y);
        b.closePath();
        b.fill();
        points = this.grass2ScreenPoints;
        b.beginPath();
        b.moveTo(points[0].x, points[0].y);
        for (c = 1; c < points.length; c++) b.lineTo(points[c].x, points[c].y);
        b.closePath();
        b.fill();
        b.restore();
      },
      spawnObject: function (b, c, d) {
        var e = this.cameraDistance,
          f = d.z;
        if (!(f < e)) {
          d = { x: d.x, y: d.y, z: d.z };
          f < e && (d.z = e);
          var j = e / (d.z - this.cameraPos.z),
            e = ig.system.width / 2 - this.cameraPos.x * j + d.x * j,
            j =
              this.cameraPos.y * j +
              ig.system.height +
              d.y -
              (1 - j) * (ig.system.height - this.vanishingPoint.y),
            m = null;
          0 == b
            ? ((m = ig.game.spawnEntity(EntityGameBgObject, e, j)),
              m.setImageId(c))
            : 1 == b
            ? ((m = ig.game.spawnEntity(EntityGameObstacle, e, j)),
              m.setImageId(c))
            : 2 == b &&
              ((m = ig.game.spawnEntity(EntityGamePickup, e, j)),
              m.setPickupId(c));
          return null != m
            ? ((m.worldPos = d),
              (m.zValue = f),
              m.ready(),
              this.objects.push(m),
              ig.game.sortEntitiesDeferred(),
              m)
            : null;
        }
      },
      cleanObjects: function () {
        for (var b = [], c = 0; c < this.objects.length; c++) {
          var d = this.objects[c];
          d.killed && (d.kill(), b.push(d));
        }
        if (0 < b.length) {
          for (var e = [], d = this.objects.pop(); d; ) {
            for (var f = !1, c = 0; c < b.length; c++)
              if (b[c] == d) {
                f = !0;
                break;
              }
            f || e.push(d);
            d = this.objects.pop();
          }
          this.objects = e;
        }
      },
      cleanEffects: function () {
        for (var b = [], c = 0; c < this.effects.length; c++) {
          var d = this.effects[c];
          d.killed && (d.kill(), b.push(d));
        }
        if (0 < b.length) {
          for (var e = [], d = this.effects.pop(); d; ) {
            for (var f = !1, c = 0; c < b.length; c++)
              if (b[c] == d) {
                f = !0;
                break;
              }
            f || e.push(d);
            d = this.effects.pop();
          }
          this.effects = e;
        }
      },
      spawnStartingObjects: function () {
        var b = 30 * Math.random();
        "rooftop" === ig.game.curLevel && (b = 30);
        this.lastBgSetDistance = -b;
        for (var c = 0; 2 > c; c++) {
          for (
            var d = [], b = 0, b = this.bgSetDefinitions[b], e = 0;
            e < b.length;
            e++
          ) {
            var f = b[e],
              f = this.spawnObject(0, f.id, {
                x: f.x,
                y: f.y,
                z: this.lastBgSetDistance - this.totalDistance + f.z,
              });
            d.push(f);
          }
          this.bgSets.push(d);
          this.lastBgSetDistance += this.bgSetSize;
        }
        if (this.tutorialMode) {
          this.lastSegmentDistance = 10;
          b = this.tutorialDefinitions[0];
          c = [];
          for (e = 0; e < b.length; e++)
            (f = b[e]),
              (d = f.type),
              null == d && (d = 1),
              (f = this.spawnObject(d, f.id, {
                x: f.x,
                y: f.y,
                z: this.lastSegmentDistance + f.z,
              })),
              c.push(f);
          this.segments.push(c);
          this.lastSegmentDistance += 120;
        } else {
          this.lastSegmentDistance = 70;
          b = this.segmentDefinitions[2];
          c = [];
          if ("rooftop" === !ig.game.curLevel)
            for (e = 0; e < b.length; e++)
              (f = b[e]),
                (d = f.type),
                null == d && (d = 1),
                (f = this.spawnObject(d, f.id, {
                  x: f.x,
                  y: f.y,
                  z: this.lastSegmentDistance + f.z,
                })),
                c.push(f);
          this.segments.push(c);
          b = Math.floor(Math.random() * this.segmentSizeVariable);
          "rooftop" === ig.game.curLevel && (b = 0);
          this.lastSegmentDistance += this.segmentSize + b;
        }
        ig.game.sortEntitiesDeferred();
        "rooftop" === ig.game.curLevel && (this.lastSegmentDistance = 60);
      },
      updateBgSets: function () {
        if (!(this.totalDistance <= this.lastBgSetDistance - this.bgSetSize)) {
          this.bgSets.splice(0, 1);
          for (
            var b = [], c = this.bgSetDefinitions[0], d = 0;
            d < c.length;
            d++
          ) {
            var e = c[d],
              e = this.spawnObject(0, e.id, {
                x: e.x,
                y: e.y,
                z: this.lastBgSetDistance - this.totalDistance + e.z,
              });
            b.push(e);
          }
          this.bgSets.push(b);
          this.lastBgSetDistance += this.bgSetSize;
          ig.game.sortEntitiesDeferred();
        }
      },
      updateSegments: function () {
        for (var b = [], c = 0; c < this.segments.length; c++) {
          for (var d = this.segments[c], e = !0, f = 0; f < d.length; f++) {
            var j = d[f];
            if (j && !j.killed) {
              e = !1;
              break;
            }
          }
          e && b.push(d);
        }
        if (0 < b.length) {
          d = [];
          for (j = this.segments.pop(); j; ) {
            e = !1;
            for (c = 0; c < b.length; c++)
              if (b[c] == j) {
                e = !0;
                break;
              }
            e || d.push(j);
            j = this.segments.pop();
          }
          this.segments = d;
        }
        if (
          !(this.totalDistance <= this.lastSegmentDistance - this.bgSetSize)
        ) {
          c = this.segmentDefinitions.length;
          c = Math.floor(Math.random() * c);
          b = this.segmentDefinitions[c];
          d = [];
          for (c = 0; c < b.length; c++)
            (j = b[c]),
              (e = j.type),
              null == e && (e = 1),
              (j = this.spawnObject(e, j.id, {
                x: j.x,
                y: j.y,
                z: this.lastSegmentDistance - this.totalDistance + j.z,
              })),
              d.push(j);
          this.segments.push(d);
          c = Math.floor(Math.random() * this.segmentSizeVariable);
          "rooftop" === ig.game.curLevel && (c = 0);
          this.lastSegmentDistance += this.segmentSize + c;
          ig.game.sortEntitiesDeferred();
        }
      },
      updateCollisions: function () {
        var b = this.character.pos.x - ig.system.width / 2,
          c = 0;
        0 > this.character.jumpOffset && (c = 200);
        var d = {};
        d.w = this.character.charWidth;
        d.h = this.character.charHeight;
        d.x = this.character.worldPos.x + b - d.w / 2;
        d.y = -(this.character.worldPos.y + c) - d.h;
        for (b = 0; b < this.segments.length; b++)
          for (var c = this.segments[b], e = 0; e < c.length; e++) {
            var f = c[e];
            if (!f.hit) {
              var j = this.character.zValue - this.character.zWidth,
                m = j + 2 * this.character.zWidth;
              2 == f.objType &&
                ((j -= this.character.zWidth / 2),
                (m += this.character.zWidth / 2));
              if (
                f.zValue + f.zWidth >= j &&
                f.zValue <= m &&
                (!(1 == f.objType && f.slidable) || !this.isSliding)
              )
                (j = {}),
                  (j.w = f.contactRect.w),
                  (j.h = f.contactRect.h),
                  (j.x = f.worldPos.x - j.w / 2),
                  (j.y = -f.worldPos.y - j.h),
                  this.aabbCheck(d, j) &&
                    ((f.hit = !0),
                    2 == f.objType
                      ? ((f.killed = !0),
                        this.cleanObjects(),
                        f.kill(),
                        this.collectPickup(f.pickupId),
                        this.spawnCollectEffect(f))
                      : this.character.isInvulnerable ||
                        (this.hitObstacle(f),
                        this.spawnHitEffect(),
                        this.character.shake()));
            }
          }
      },
      recalculateScreenPoints: function () {
        var b = null,
          c = null,
          d,
          e,
          f,
          j,
          m,
          q = null,
          l = null,
          b = this.sidewalk1Pos,
          c = this.sidewalk1Width;
        e = this.cameraPos.y + ig.system.height;
        d = ig.system.width / 2 - this.cameraPos.x + b.x - c / 2;
        f = (e - this.vanishingPoint.y) / (d - this.vanishingPoint.x);
        q = this.vanishingPoint.y - f * this.vanishingPoint.x;
        j = this.horizonLine.y;
        f = (j - q) / f;
        q = this.cameraPos.y + ig.system.height;
        c = ig.system.width / 2 - this.cameraPos.x + b.x + c / 2;
        m = (q - this.vanishingPoint.y) / (c - this.vanishingPoint.x);
        l = this.vanishingPoint.y - m * this.vanishingPoint.x;
        b = this.horizonLine.y;
        m = (b - l) / m;
        this.sidewalk1ScreenPoints[0] = {
          x: this.bitwiseRound(d),
          y: this.bitwiseRound(e),
        };
        this.sidewalk1ScreenPoints[1] = {
          x: this.bitwiseRound(f),
          y: this.bitwiseRound(j),
        };
        this.sidewalk1ScreenPoints[2] = {
          x: this.bitwiseRound(m),
          y: this.bitwiseRound(b),
        };
        this.sidewalk1ScreenPoints[3] = {
          x: this.bitwiseRound(c),
          y: this.bitwiseRound(q),
        };
        this.grass1ScreenPoints[0] = { x: 0, y: this.horizonLine.y };
        this.grass1ScreenPoints[1] = {
          x: this.bitwiseRound(f) + 1,
          y: this.bitwiseRound(j),
        };
        this.grass1ScreenPoints[2] = {
          x: this.bitwiseRound(d) + 1,
          y: this.bitwiseRound(e),
        };
        this.grass1ScreenPoints[3] = { x: 0, y: ig.system.height };
        b = this.sidewalk2Pos;
        c = this.sidewalk2Width;
        e = this.cameraPos.y + ig.system.height;
        d = ig.system.width / 2 - this.cameraPos.x + b.x - c / 2;
        f = (e - this.vanishingPoint.y) / (d - this.vanishingPoint.x);
        q = this.vanishingPoint.y - f * this.vanishingPoint.x;
        j = this.horizonLine.y;
        f = (j - q) / f;
        q = this.cameraPos.y + ig.system.height;
        c = ig.system.width / 2 - this.cameraPos.x + b.x + c / 2;
        m = (q - this.vanishingPoint.y) / (c - this.vanishingPoint.x);
        l = this.vanishingPoint.y - m * this.vanishingPoint.x;
        b = this.horizonLine.y;
        m = (b - l) / m;
        this.sidewalk2ScreenPoints[0] = {
          x: this.bitwiseRound(d),
          y: this.bitwiseRound(e),
        };
        this.sidewalk2ScreenPoints[1] = {
          x: this.bitwiseRound(f),
          y: this.bitwiseRound(j),
        };
        this.sidewalk2ScreenPoints[2] = {
          x: this.bitwiseRound(m),
          y: this.bitwiseRound(b),
        };
        this.sidewalk2ScreenPoints[3] = {
          x: this.bitwiseRound(c),
          y: this.bitwiseRound(q),
        };
        this.grass2ScreenPoints[0] = {
          x: ig.system.width,
          y: this.horizonLine.y,
        };
        this.grass2ScreenPoints[1] = {
          x: this.bitwiseRound(m) - 1,
          y: this.bitwiseRound(b),
        };
        this.grass2ScreenPoints[2] = {
          x: this.bitwiseRound(c) - 1,
          y: this.bitwiseRound(q),
        };
        this.grass2ScreenPoints[3] = {
          x: ig.system.width,
          y: ig.system.height,
        };
        b = this.roadPos;
        c = this.roadWidth;
        e = this.cameraPos.y + ig.system.height;
        d = ig.system.width / 2 - this.cameraPos.x + b.x - c / 2;
        f = (e - this.vanishingPoint.y) / (d - this.vanishingPoint.x);
        q = this.vanishingPoint.y - f * this.vanishingPoint.x;
        j = this.horizonLine.y;
        f = (j - q) / f;
        q = this.cameraPos.y + ig.system.height;
        c = ig.system.width / 2 - this.cameraPos.x + b.x + c / 2;
        m = (q - this.vanishingPoint.y) / (c - this.vanishingPoint.x);
        l = this.vanishingPoint.y - m * this.vanishingPoint.x;
        b = this.horizonLine.y;
        m = (b - l) / m;
        this.roadScreenPoints[0] = {
          x: this.bitwiseRound(d),
          y: this.bitwiseRound(e),
        };
        this.roadScreenPoints[1] = {
          x: this.bitwiseRound(f),
          y: this.bitwiseRound(j),
        };
        this.roadScreenPoints[2] = {
          x: this.bitwiseRound(m),
          y: this.bitwiseRound(b),
        };
        this.roadScreenPoints[3] = {
          x: this.bitwiseRound(c),
          y: this.bitwiseRound(q),
        };
        b = this.roadLine1Pos;
        c = this.roadLine1Width;
        e = this.cameraPos.y + ig.system.height;
        d = ig.system.width / 2 - this.cameraPos.x + b.x - c / 2;
        f = (e - this.vanishingPoint.y) / (d - this.vanishingPoint.x);
        q = this.vanishingPoint.y - f * this.vanishingPoint.x;
        j = this.horizonLine.y;
        f = (j - q) / f;
        q = this.cameraPos.y + ig.system.height;
        c = ig.system.width / 2 - this.cameraPos.x + b.x + c / 2;
        m = (q - this.vanishingPoint.y) / (c - this.vanishingPoint.x);
        l = this.vanishingPoint.y - m * this.vanishingPoint.x;
        b = this.horizonLine.y;
        m = (b - l) / m;
        this.roadLine1ScreenPoints[0] = {
          x: this.bitwiseRound(d),
          y: this.bitwiseRound(e),
        };
        this.roadLine1ScreenPoints[1] = {
          x: this.bitwiseRound(f),
          y: this.bitwiseRound(j),
        };
        this.roadLine1ScreenPoints[2] = {
          x: this.bitwiseRound(m),
          y: this.bitwiseRound(b),
        };
        this.roadLine1ScreenPoints[3] = {
          x: this.bitwiseRound(c),
          y: this.bitwiseRound(q),
        };
        b = this.roadLine2Pos;
        c = this.roadLine2Width;
        e = this.cameraPos.y + ig.system.height;
        d = ig.system.width / 2 - this.cameraPos.x + b.x - c / 2;
        f = (e - this.vanishingPoint.y) / (d - this.vanishingPoint.x);
        q = this.vanishingPoint.y - f * this.vanishingPoint.x;
        j = this.horizonLine.y;
        f = (j - q) / f;
        q = this.cameraPos.y + ig.system.height;
        c = ig.system.width / 2 - this.cameraPos.x + b.x + c / 2;
        m = (q - this.vanishingPoint.y) / (c - this.vanishingPoint.x);
        l = this.vanishingPoint.y - m * this.vanishingPoint.x;
        b = this.horizonLine.y;
        m = (b - l) / m;
        this.roadLine2ScreenPoints[0] = {
          x: this.bitwiseRound(d),
          y: this.bitwiseRound(e),
        };
        this.roadLine2ScreenPoints[1] = {
          x: this.bitwiseRound(f),
          y: this.bitwiseRound(j),
        };
        this.roadLine2ScreenPoints[2] = {
          x: this.bitwiseRound(m),
          y: this.bitwiseRound(b),
        };
        this.roadLine2ScreenPoints[3] = {
          x: this.bitwiseRound(c),
          y: this.bitwiseRound(q),
        };
      },
      bitwiseRound: function (b) {
        return (0.5 + b) << 0;
      },
      collectPickup: function (b) {
        0 == b
          ? ((ig.game.money += 1),
            (this.coinsCollected += 1),
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.coin),
            gamee.updateScore(this.coinsCollected))
          : 1 == b &&
            ((ig.game.cookies += 1),
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.crunch),
            (this.powerLevel = (10 * this.powerLevel + 1) / 10),
            1 <= this.powerLevel &&
              ((this.powerLevel = 1), this.character.queuePowerUp()));
      },
      switchLevel: function () {
        this.tutorialMode = ig.game.doTutorialFlag = !1;
        ig.game.lvlChn_coinCollected = this.coinsCollected;
        ig.game.lvlChn_powerLevel = this.powerLevel;
        ig.game.distanceLimit += this.distanceInc;
        ig.game.lastRunSpeed = this.runSpeed;
        ig.game.lastLifeCount = this.lifeCount;
        ig.game.director.jumpTo(LevelGame);
      },
      hitObstacle: function (b) {
        b.lvlSwitch
          ? ((ig.game.curLevel = b.lvlSwitch_nextLevel), this.switchLevel())
          : this.character.state == this.character.STATES.POWERED
          ? b.isGap
            ? this.character.jump()
            : (b.knockOut(),
              ig.soundHandler.playSound(ig.soundHandler.SOUNDID.hit))
          : ((this.lifeCount -= 1),
            b.isGap && ((this.lifeCount = -1), (this.character.hitByGap = !0)),
            ig.soundHandler.playSound(ig.soundHandler.SOUNDID.hit),
            0 > this.lifeCount
              ? ((this.lifeCount = 0), this.finishGame())
              : ((this.character.invulnerableStartTime = this.gameTime),
                (this.character.isInvulnerable = !0),
                b.knockOut()));
      },
      quitGame: function () {
        ig.game.restartGameFlag = !1;
        this.gameEndTime = ig.system.clock.delta();
        this.gameEnding = !0;
      },
      finishGame: function () {
        gamee.gameOver();
        this.gameOver = !0;
        this.gameOverTime = ig.system.clock.delta();
        ig.game.savePlayerStats();
        ig.soundHandler.playSound(ig.soundHandler.SOUNDID.chirp);
      },
      restartGame: function () {
        ig.game.doTutorialFlag = !1;
        ig.game.restartGameFlag = !0;
        this.gameEndTime = ig.system.clock.delta();
        this.gameEnding = !0;
      },
      endGame: function () {
        ig.input.clearPressed();
        ig.game.savePlayerStats();
        ig.game.curLevel = "street";
        ig.game.cookies = 0;
        ig.game.lvlChn_coinCollected = 0;
        ig.game.lvlChn_powerLevel = 0;
        ig.game.distanceLimit = 400;
        ig.game.lastRunSpeed = 20;
        ig.game.lastLifeCount = 3;
        ig.game.visitedShop
          ? ig.game.restartGameFlag
            ? ((ig.game.restartGameFlag = !1),
              ig.game.director.jumpTo(LevelGame))
            : ig.game.director.jumpTo(LevelHome)
          : ((ig.game.restartGameFlag = !1),
            (ig.game.doShop = !0),
            ig.game.director.jumpTo(LevelHome));
      },
      doNextTutorialStage: function () {
        var b = ig.system.clock.delta() - this.tutorialPausedTime;
        if (
          (1 == this.tutorialStage ||
            2 == this.tutorialStage ||
            3 == this.tutorialStage ||
            5 == this.tutorialStage ||
            7 == this.tutorialStage ||
            9 == this.tutorialStage ||
            11 == this.tutorialStage ||
            13 == this.tutorialStage) &&
          0.5 > b
        )
          return !1;
        this.tutorialStage += 1;
        this.tutorialPausedTime = ig.system.clock.delta();
        switch (this.tutorialStage) {
          case 1:
            this.tutorialPauseMode = !0;
            this.ui.showTutorialUI(0);
            break;
          case 2:
            this.tutorialPauseMode = !0;
            this.ui.showTutorialUI(1);
            this.doNextTutorialStage();
            ig.game.doTutorialFlag = !1;
            ig.game.doTutorial = !1;
            ig.game.firstrun = !1;
            break;
          case 3:
            this.tutorialPauseMode = !0;
            ig.ua.mobile || this.isApp
              ? this.ui.showTutorialUI(2)
              : this.ui.showTutorialUI(3);
            break;
          case 4:
            this.ui.hideTutorialUI();
            this.tutorialPauseMode = !1;
            this.tutorialStopDistance = 14;
            break;
          case 5:
            this.tutorialPauseMode = !0;
            ig.ua.mobile || this.isApp
              ? this.ui.showTutorialUI(4)
              : this.ui.showTutorialUI(5);
            break;
          case 6:
            this.ui.hideTutorialUI();
            this.tutorialPauseMode = !1;
            this.tutorialStopDistance = 33.5;
            break;
          case 7:
            this.tutorialPauseMode = !0;
            ig.ua.mobile || this.isApp
              ? this.ui.showTutorialUI(6)
              : this.ui.showTutorialUI(7);
            break;
          case 8:
            this.ui.hideTutorialUI();
            this.tutorialPauseMode = !1;
            this.tutorialStopDistance = 38;
            break;
          case 9:
            this.tutorialPauseMode = !0;
            ig.ua.mobile || this.isApp
              ? this.ui.showTutorialUI(8)
              : this.ui.showTutorialUI(9);
            break;
          case 10:
            this.ui.hideTutorialUI();
            this.tutorialPauseMode = !1;
            this.tutorialStopDistance = 43;
            break;
          case 11:
            this.tutorialPauseMode = !0;
            ig.ua.mobile || this.isApp
              ? this.ui.showTutorialUI(10)
              : this.ui.showTutorialUI(11);
            break;
          case 12:
            this.ui.hideTutorialUI();
            this.tutorialPauseMode = !1;
            this.tutorialStopDistance = 62;
            break;
          case 13:
            this.tutorialPauseMode = !0;
            this.ui.showTutorialUI(12);
            break;
          case 14:
            this.ui.hideTutorialUI(),
              (this.tutorialMode = this.tutorialPauseMode = !1),
              this.characterMoveRight();
        }
        return !0;
      },
    });
  });
ig.baked = !0;
ig.module("game.levels.game")
  .requires(
    "impact.image",
    "game.entities.game-control",
    "game.entities.pointer-selector"
  )
  .defines(function () {
    LevelGame = {
      entities: [
        { type: "EntityGameControl", x: 0, y: 0 },
        { type: "EntityPointerSelector", x: 0, y: 0 },
      ],
      layer: [],
    };
  });
ig.baked = !0;
ig.module("game.main")
  .requires(
    "impact.game",
    "impact.debug.debug",
    "plugins.splash-loader",
    "plugins.tween",
    "plugins.url-parameters",
    "plugins.jukebox",
    "plugins.director",
    "plugins.impact-storage",
    "plugins.webaudio-music-player",
    "plugins.fake-storage",
    "plugins.branding.splash",
    "game.entities.branding-logo-placeholder",
    "game.entities.branding-logo",
    "game.entities.button-more-games",
    "game.entities.opening-shield",
    "game.entities.opening-kitty",
    "game.entities.pointer",
    "game.entities.pointer-selector",
    "game.levels.opening",
    "game.levels.home",
    "game.levels.game"
  )
  .defines(function () {
    this.START_OBFUSCATION;
    this.FRAMEBREAKER;
    MyGame = ig.Game.extend({
      muted: !1,
      musicVolume: 0.4,
      sfxVolume: 1,
      money: 0,
      cookies: 0,
      doTutorial: !1,
      doShop: !1,
      isCharaGirl: !1,
      curStage: "street",
      lvlChn_coinCollected: 0,
      lvlChn_powerLevel: 0,
      distanceLimit: 0,
      lastRunSpeed: 0,
      lastLifeCount: 3,
      equipGuy: 0,
      equipGirl: 0,
      upgrades: [
        { status: !0, equipped: !1 },
        { status: !1, equipped: !1 },
        { status: !1, equipped: !1 },
        { status: !1, equipped: !1 },
        { status: !0, equipped: !1 },
        { status: !1, equipped: !1 },
        { status: !1, equipped: !1 },
        { status: !1, equipped: !1 },
      ],
      visitedShop: !1,
      restartGameFlag: !1,
      doTutorialFlag: !1,
      firstrun: !1,
      gameStart: !1,
      init: function () {
        console.log("Finished: Version #16");
        var b = { bgm: { path: "media/audio/music/bgm" } };
        ig.ua.mobile || (this.webaudioPlugin = new WebaudioMusicPlayer(b));
        this.setupControls();
        this.setupLocalStorage();
        this.removeLoadingWheel();
        this.injectMobileLink();
        this.setupURLParameters();
        for (this.finalize(); 8 > this.upgrades.length; )
          this.upgrades.push({ status: !1, equipped: !1 });
        console.log(window.g_isMuted);
        window.g_isMuted && !ig.ua.mobile
          ? (console.log("muting game"),
            ig.soundHandler.focusBlurMute(),
            (this.testStr = "AAA"))
          : (ig.game.webaudioPlugin &&
              (ig.soundHandler.focusBlurUnmute(),
              ig.game.webaudioPlugin.play()),
            (this.testStr = "WWW"));
        ig.game.webaudioPlugin && ig.soundHandler.focusBlurUnmute();
      },
      testStr: "QQQ",
      initSfx: function () {},
      initSound: function () {
        if (
          ig.ua.mobile &&
          (console.log("initSound runs 1"),
          void 0 == this.soundReady &&
            (console.log("initSound runs 2"),
            (this.soundReady = !0),
            ig.soundHandler.staticSound.play(),
            (this.webaudioPlugin = new WebaudioMusicPlayer({
              bgm: { path: "media/audio/music/bgm" },
            })),
            this.webaudioPlugin.webaudio))
        ) {
          webaudio = this.webaudioPlugin.webaudio;
          console.log("initSound runs 3");
          var b = webaudio.context,
            d = b.createBuffer(1, 1, 22050),
            e = b.createBufferSource();
          e.buffer = d;
          e.connect(b.destination);
          "undefined" === typeof e.start ? e.noteOn(0) : e.start(0);
          ig.game.webaudioPlugin.play();
        }
      },
      resetStats: function () {
        ig.game.curLevel = "street";
        ig.game.cookies = 0;
        ig.game.lvlChn_coinCollected = 0;
        ig.game.lvlChn_powerLevel = 0;
        ig.game.distanceLimit = 400;
        ig.game.lastRunSpeed = 20;
        ig.game.lastLifeCount = 3;
        ig.game.director.jumpTo(LevelGame);
      },
      isRestart: !1,
      finalize: function () {
        ig.game.startGame();
        gamee.gameReady();
        sizeHandler();
        gamee.emitter.addEventListener("start", function (b) {
          ig.game.initSound();
          ig.game.curLevel = "street";
          ig.game.cookies = 0;
          ig.game.lvlChn_coinCollected = 0;
          ig.game.lvlChn_powerLevel = 0;
          ig.game.distanceLimit = 400;
          ig.game.lastRunSpeed = 20;
          ig.game.lastLifeCount = 3;
          console.log("window.g_isMuted = " + window.g_isMuted);
          window.g_isMuted && !ig.ua.mobile
            ? (ig.game.webaudioPlugin && ig.soundHandler.focusBlurMute(),
              (this.testStr = "MMM"),
              console.log("muting game"))
            : (ig.game.webaudioPlugin && ig.soundHandler.focusBlurUnmute(),
              (this.testStr = "SSS"),
              console.log("unmuting game"));
          ig.game.gameStart
            ? (ig.game.director.jumpTo(LevelGame),
              ig.game.isRestart &&
                ((ig.game.isRestart = !1),
                ig.game.webaudioPlugin && ig.soundHandler.focusBlurUnmute()))
            : (ig.game.director.jumpTo(LevelHome), (ig.game.gameStart = !0));
          b.detail.callback();
        });
        gamee.emitter.addEventListener("pause", function (b) {
          var d = ig.game.getEntitiesByType(EntityGameControl)[0];
          d && d.pauseGame();
          ig.soundHandler.focusBlurMute();
          console.log("pausing game...");
          b.detail.callback();
        });
        gamee.emitter.addEventListener("resume", function (b) {
          var d = ig.game.getEntitiesByType(EntityGameControl)[0];
          d && d.unpauseGame();
          ig.soundHandler.focusBlurUnmute();
          ig.game.webaudioPlugin.unmute();
          ig.game.webaudioPlugin.play();
          console.log("resuming game...");
          b.detail.callback();
        });
      },
      injectMobileLink: function () {
        $("#play").attr(
          "onclick",
          "ig.game.pressPlay();ig.soundHandler.staticSound.play();"
        );
      },
      removeLoadingWheel: function () {
        try {
          $("#ajaxbar").css("background", "none");
        } catch (b) {
          console.log(b);
        }
      },
      showDebugMenu: function () {
        console.log("showing debug menu ...");
        ig.Entity._debugShowBoxes = !0;
        $(".ig_debug").show();
      },
      setupLocalStorage: function () {
        try {
          localStorage.setItem("testStorage", "testStorage"),
            localStorage.removeItem("testStorage"),
            (localStorageSupport =
              "localStorage" in window && null !== window.localStorage),
            (ig.game.storage = new ig.Storage());
        } catch (b) {
          ig.game.storage = new ig.FakeStorage();
        }
        this.getPlayerStats();
      },
      savePlayerStats: function () {
        null != this.storage &&
          (this.storage.set("gameeracing.musicVolume", this.musicVolume),
          this.storage.set("gameeracing.sfxVolume", this.sfxVolume),
          this.storage.set("gameeracing.muted", this.muted),
          this.storage.set("gameeracing.money", this.money),
          this.storage.set("gameeracing.upgrades", this.upgrades),
          this.storage.set("gameeracing.firstrun", this.firstrun),
          this.storage.set("gameeracing.visitedShop", this.visitedShop),
          this.storage.set("gameeracing.equipguy", this.equipGuy),
          this.storage.set("gameeracing.equipgirl", this.equipGirl));
      },
      getPlayerStats: function () {
        if (null != this.storage) {
          var b = this.storage.get("gameeracing.musicVolume");
          null != b && (this.musicVolume = b);
          ig.soundHandler.setMusicVolume(this.musicVolume);
          b = this.storage.get("gameeracing.sfxVolume");
          null != b && (this.sfxVolume = b);
          ig.soundHandler.setSfxVolume(this.sfxVolume);
          b = this.storage.get("gameeracing.muted");
          null != b && (this.muted = b);
          this.muted
            ? (ig.soundHandler.setMusicVolume(0),
              ig.soundHandler.setSfxVolume(0))
            : (ig.soundHandler.setMusicVolume(this.musicVolume),
              ig.soundHandler.setSfxVolume(this.sfxVolume));
          b = this.storage.get("gameeracing.firstrun");
          null != b && (this.firstrun = b);
          b = this.storage.get("gameeracing.money");
          null != b && (this.money = b);
          b = this.storage.get("gameeracing.upgrades");
          null != b &&
            (null != b[0] &&
              null != b[0].status &&
              null != b[0].equipped &&
              (this.upgrades = b),
            b[3].status || (b[3].status = !0));
          b = this.storage.get("gameeracing.equipguy");
          null != b && (this.equipGuy = b);
          b = this.storage.get("gameeracing.equipgirl");
          null != b && (this.equipGirl = b);
          b = this.storage.get("gameeracing.visitedShop");
          null != b && (this.visitedShop = b);
          this.muted && ig.game.webaudioPlugin.mute();
        }
      },
      startGame: function () {
        this.getPlayerStats();
        this.director = new ig.Director(this, [
          LevelOpening,
          LevelHome,
          LevelGame,
        ]);
        if (_SETTINGS.Branding.Splash.Enabled)
          try {
            this.branding = new ig.BrandingSplash();
          } catch (b) {
            console.log(b),
              console.log("Loading original levels ..."),
              this.director.jumpTo(LevelOpening);
          }
        else this.director.jumpTo(LevelOpening);
      },
      fpsCount: function () {
        this.fpsTimer || (this.fpsTimer = new ig.Timer(1));
        this.fpsTimer && 0 > this.fpsTimer.delta()
          ? null != this.fpsCounter
            ? this.fpsCounter++
            : (this.fpsCounter = 0)
          : ((ig.game.fps = this.fpsCounter),
            (this.fpsCounter = 0),
            this.fpsTimer.reset());
      },
      endGame: function () {
        console.log("End game");
        ig.soundHandler.stopBackgroundMusic();
        ig.ua.mobile &&
          _SETTINGS.Ad.Mobile.End.Enabled &&
          MobileAdInGameEnd.Initialize();
      },
      resetPlayerStats: function () {
        ig.log("resetting player stats ...");
        this.playerStats = {
          id: this.playerStats ? this.playerStats.id : null,
        };
      },
      setItemUpgradeEquipped: function (b, d) {
        for (var e = 0; e < this.upgrades.length; e++)
          this.upgrades[e].equipped = !1;
        this.upgrades[b].equipped = d;
      },
      getItemUpgradeEquipped: function (b) {
        return this.upgrades[b].equipped;
      },
      setItemUpgradeStatus: function (b, d) {
        this.upgrades[b].status = d;
      },
      getItemUpgradeStatus: function (b) {
        return this.upgrades[b].status;
      },
      getItemUpgradePrice: function (b) {
        switch (b) {
          case 1:
            return 100;
          case 2:
            return 200;
          case 3:
            return 300;
          case 5:
            return 500;
          case 6:
            return 600;
          case 7:
            return 700;
        }
        return 0;
      },
      getItemUpgradeName: function (b) {
        switch (b) {
          case 0:
            return _STRINGS.UI.makiman;
          case 1:
            return _STRINGS.UI["makiman-cape"];
          case 2:
            return _STRINGS.UI["makiman-skateboard"];
          case 3:
            return _STRINGS.UI["makiman-hoverboard"];
          case 4:
            return _STRINGS.UI.patty;
          case 5:
            return _STRINGS.UI["patty-cape"];
          case 6:
            return _STRINGS.UI["patty-rollerblades"];
          case 7:
            return _STRINGS.UI["patty-jetpack"];
        }
        return "";
      },
      setupControls: function () {
        ig.input.unbindAll();
        ig.input.initMouse();
        ig.input.bind(ig.KEY.MOUSE1, "click");
        ig.input.bind(ig.KEY.LEFT_ARROW, "left");
        ig.input.bind(ig.KEY.RIGHT_ARROW, "right");
        ig.input.bind(ig.KEY.UP_ARROW, "up");
        ig.input.bind(ig.KEY.DOWN_ARROW, "down");
        ig.input.bind(ig.KEY.ENTER, "enter");
      },
      setupURLParameters: function () {
        this.setupURLParameters = new ig.UrlParameters();
      },
      setupMarketJsGameCenter: function () {
        _SETTINGS &&
          (_SETTINGS.MarketJSGameCenter
            ? (_SETTINGS.MarketJSGameCenter.Activator.Enabled &&
                _SETTINGS.MarketJSGameCenter.Activator.Position &&
                (console.log(
                  "MarketJSGameCenter activator settings present ...."
                ),
                $(".gamecenter-activator").css(
                  "top",
                  _SETTINGS.MarketJSGameCenter.Activator.Position.Top
                ),
                $(".gamecenter-activator").css(
                  "left",
                  _SETTINGS.MarketJSGameCenter.Activator.Position.Left
                )),
              $(".gamecenter-activator").show())
            : console.log(
                "MarketJSGameCenter settings not defined in game settings"
              ));
      },
      pressPlay: function () {
        this.hideOverlay(["play"]);
        this.startGame();
        ig.ua.mobile &&
          _SETTINGS.Ad.Mobile.Footer.Enabled &&
          MobileAdInGameFooter.Initialize();
        ig.ua.mobile &&
          _SETTINGS.Ad.Mobile.Header.Enabled &&
          MobileAdInGameHeader.Initialize();
      },
      pauseGame: function () {
        console.log("Game Paused");
        var b = ig.game.getEntitiesByType(EntityGameControl)[0];
        b && b.pauseGame();
        ig.soundHandler &&
          ig.game.webaudioPlugin &&
          (ig.soundHandler.focusBlurMute(), ig.game.webaudioPlugin.mute());
      },
      resumeGame: function () {
        console.log("Game Resumed");
        var b = ig.game.getEntitiesByType(EntityGameControl)[0];
        b && b.unpauseGame();
        ig.soundHandler &&
          ig.game.webaudioPlugin &&
          (ig.soundHandler.focusBlurUnmute(),
          ig.game.webaudioPlugin.unmute(),
          ig.game.webaudioPlugin.play());
      },
      showOverlay: function (b) {
        for (i = 0; i < b.length; i++)
          $("#" + b[i]).show(),
            (document.getElementById(b[i]).style.visibility = "visible");
      },
      hideOverlay: function (b) {
        for (i = 0; i < b.length; i++)
          $("#" + b[i]).hide(),
            (document.getElementById(b[i]).style.visibility = "hidden");
      },
      update: function () {
        isHeightBigger = 1024 < ig.system.height ? !0 : !1;
        this.fpsCount();
        if (this.paused)
          for (var b = 0; b < this.entities.length; b++)
            this.entities[b].ignorePause && this.entities[b].update();
        else this.parent(), ig.soundHandler && ig.soundHandler.forceLoopBGM();
      },
      draw: function () {
        this._rscreen.x = ig.system.getDrawPos(this.screen.x) / ig.system.scale;
        this._rscreen.y = ig.system.getDrawPos(this.screen.y) / ig.system.scale;
        this.drawEntities();
      },
      drawDebug: function () {
        if (
          !ig.global.wm &&
          (this.debugEnable(),
          this.viewDebug &&
            ((ig.system.context.fillStyle = "#000000"),
            (ig.system.context.globalAlpha = 0.35),
            ig.system.context.fillRect(
              0,
              0,
              ig.system.width / 4,
              ig.system.height
            ),
            (ig.system.context.globalAlpha = 1),
            this.debug && 0 < this.debug.length))
        )
          for (i = 0; i < this.debug.length; i++)
            (ig.system.context.font = "10px Arial"),
              (ig.system.context.fillStyle = "#ffffff"),
              ig.system.context.fillText(
                this.debugLine - this.debug.length + i + ": " + this.debug[i],
                10,
                50 + 10 * i
              );
      },
      debugCL: function (b) {
        this.debug
          ? (50 > this.debug.length || this.debug.splice(0, 1),
            this.debug.push(b),
            this.debugLine++)
          : ((this.debug = []), (this.debugLine = 1), this.debug.push(b));
        console.log(b);
      },
      debugEnable: function () {
        ig.input.pressed("click") && (this.debugEnableTimer = new ig.Timer(2));
        this.debugEnableTimer && 0 > this.debugEnableTimer.delta()
          ? ig.input.released("click") && (this.debugEnableTimer = null)
          : this.debugEnableTimer &&
            0 < this.debugEnableTimer.delta() &&
            ((this.debugEnableTimer = null),
            (this.viewDebug = this.viewDebug ? !1 : !0));
      },
    });
    var b = getQueryVariable("device");
    if (b)
      switch (b) {
        case "mobile":
          console.log("serving mobile version ...");
          ig.ua.mobile = !0;
          break;
        case "desktop":
          console.log("serving desktop version ...");
          ig.ua.mobile = !1;
          break;
        default:
          console.log("serving universal version ...");
      }
    else console.log("serving universal version ...");
    if ((b = getQueryVariable("force-rotate")))
      switch (b) {
        case "portrait":
          console.log("force rotate to portrait");
          window.orientation = 0;
          break;
        case "landscape":
          console.log("force rotate to horizontal");
          window.orientation = 90;
          break;
        default:
          alert(
            "wrong command/type in param force-rotate. Defaulting value to portrait"
          ),
            (window.orientation = 0);
      }
    ig.ua.mobile
      ? ((ig.Sound.enabled = !1),
        ig.main(
          "#canvas",
          MyGame,
          60,
          mobileWidth,
          mobileHeight,
          1,
          ig.SplashLoader
        ))
      : ig.main(
          "#canvas",
          MyGame,
          60,
          desktopWidth,
          desktopHeight,
          1,
          ig.SplashLoader
        );
    ig.ua.mobile && orientationHandler();
    sizeHandler();
    fixSamsungHandler();
    this.END_OBFUSCATION;
  });
