var app = app || {}
app.isGameStarted = false

app.controller = gamee.controller.requestController('OneButton')

app.controller.on('keydown', function() {
  if(!app.isGameStarted) {
    app.isGameStarted = true
    app.states.game.restart()
  }
});

app.game = new Phaser.Game(640, 640, Phaser.CANVAS, 'game')

app.isGamee = app.game.device.webApp

app.game.state.add('boot', app.states.boot)
app.game.state.add('preload', app.states.preload)
app.game.state.add('game', app.states.game)

app.settings = {
    wallWidth: 35, //sirka zdi
    maxWallsInRow: 3, //max pocet zdi v rade
    minWallHeight: 50, // minimalni vyska zdi
    maxWallHeight: 200, // maximalni vyska zdi
    spaceBetweenWalls: 30, // vzdalenost mezi dvema zdmi
    spaceBetweenWallsGroups: 300, // vzdalenost mezi dvema skupinami zdi
    dogJumpHeight: 160, // max velikost jednoho skoku
    dogX: 50, // startovni pozice zleva
    dogY: 50, //startovni pozice zvrchu
    groundScrollSpeed: 200, // rychlost posunu
    dogSpeed: 9, //rychlost animace psa (vizualni rychlost jeho pohybu)
    dogJumpSpeed: 1.3, //rychlost skoku psa
    backgroundSpeed: 50, // rychlost pozadi s hvezdami
    backgroundObjectsSpeed: 75, // rychlost pohybu veci na pozadi
    musicVolume: 0.4, // hlasitost hudby
    soundsVolume: 1.5, // hlasitost zvuku
    isSoundMuted: false, //jestli je zapnuty zvuk
    defaultScore: 0 //pocatecni score
}

app.game.state.start('boot')

gamee.onPause = function() {
  app.states.game.pause()
}

gamee.onStop = function() {
  app.states.game.stop()
}

gamee.onRestart = function() {
  app.isGameStarted = true
  app.states.game.playInitSound()
  app.states.game.restart()
}

gamee.onResume = function() {
  app.states.game.resume()
}

gamee.onMute = function() {
  app.states.game.mute()
}

gamee.onUnmute = function() {
  app.states.game.unmute()
}

gamee.onUnpause = function() {
  app.states.game.unpause()
}

