var app = app || {}
app.states = app.states || {}

app.states.preload = {
    init: function() {
        app.snd = []
    },
    preload: function() {
        this.background = this.add.sprite(0, 0, 'intro')

        this.load.image('ground', 'img/ground.png')
        this.load.spritesheet('player', 'img/player.png', 90, 82, 6)
        this.load.spritesheet('sound', 'img/sound.png', 42, 30, 2)
        this.load.image('wall-green', 'img/wall-green.png')
        this.load.image('wall-violet', 'img/wall-violet.png')
        this.load.image('wall-blue', 'img/wall-blue.png')
        this.load.image('background', 'img/background.png')
        this.load.image('background-objects1', 'img/background-objects1.png')
        this.load.image('background-objects2', 'img/background-objects2.png')
        this.load.image('background-objects3', 'img/background-objects3.png')
        this.load.image('background-objects4', 'img/background-objects4.png')
        this.load.image('foreground', 'img/foreground.png')
        this.load.image('restart', 'img/restart.png')
        this.load.image('play', 'img/play.png')
        this.load.audio('music', ['snd/music.m4a', 'snd/music.ogg'])
        this.load.audio('cry', ['snd/cry.m4a', 'snd/cry.ogg'])
        this.load.audio('jump', ['snd/jump.m4a', 'snd/jump.ogg'])
        this.load.audio('bark', ['snd/bark.m4a', 'snd/bark.ogg'])
    },
    create: function() {
        _this = this

        if (!app.isGamee && app.isCustom) {
            this.game.add.plugin(Fabrique.Plugins.InputField);

            function runGame() {
                var name = input.value.trim()
                if(name) {
                    setTimeout(function(){
                        input.endFocus()
                        app.playerName = name
                        app.states.game.restart()
                    },100)
                }
            }

            var input = this.game.add.inputField(this.state.game.width/2 - 230 , this.state.game.height/2 - 40, {
                font: '26px Comic Sans MS',
                fill: '#7a7a7a',
                fillAlpha: 0.8,
                width: 440,
                height: 37,
                padding: 20,
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 6,
                placeHolder: 'Insert player name',
                placeHolderColor: '#7a7a7a',
                backgroundColor: '#000',
                cursorColor: '#7a7a7a',
                onFocusOut: runGame,
                max: 20
            });

            this.play = this.add.sprite(500, this.state.game.height/2 - 37, 'play')
            this.play.inputEnabled = true;
            this.play.events.onInputDown.add(runGame, this);
        }

        if (!app.isGamee && !app.isCustom) {
            app.game.input.keyboard.onDownCallback = function() {
                if(!app.isGameStarted) {
                    app.isGameStarted = true
                    app.states.game.restart()
                }
            }
        }

    }
}
