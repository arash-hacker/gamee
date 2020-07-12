var app = app || {}
app.states = app.states || {}

app.states.boot = {
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.scale.setMinMax(320, 320, 640, 640)
        this.scale.pageAlignHorizontally = true

        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        this.game.stage.disableVisibilityChange = true
    },
    preload: function() {
        this.load.image('intro', 'img/intro.jpg')
    },
    create: function() {
        this.game.state.start('preload')
    }
}
