var app = app || {}
app.states = app.states || {}

app.states.game = {
    init: function() {
        app.settings.dogJumpSpeed = 1.3
        app.settings.dogJumpHeight = 160
        app.settings.groundScrollSpeed = 200
        app.settings.spaceBetweenWallsGroups = 300
        app.settings.spaceBetweenWalls = 30
        app.settings.dogSpeed = 9

        this.gameStartTime = Date.now()
        this.level = 0
        this.isPaused = false
        this.isGamePlayable = true
        this.game.physics.arcade.gravity.y = 1000
        this.game.physics.arcade.isPaused = false

        app.controller.buttons.button.resetPressed()

        //this.game.time.advancedTiming = true;
    },
    create: function() {

        var _this = this

        //pozadi
        this.background = new app.objects.Background(this)

        //zem
        this.ground = new app.objects.Ground(this)

        //prekazky
        this.walls = new app.objects.Walls(this)

        //hrac
        this.player = new app.objects.Player(this)

        //objekty nv popredi
        this.background.createForeground()

        //score
        this.score = new app.objects.Score(this)

        //zvuk
        this.sound = new app.objects.Sound(this)
    },
    update: function() {

        
        if (!this.isPaused) {

            //console.log('time', this.game.time.fps);

            this.game.physics.arcade.collide(this.player.get(), this.ground.get())
            
            //update prekazek
            this.walls.update()

            //update hrace
            this.player.update()

            //update pozadi
            this.background.update()

            //kolize hrace zdi
            if (this.game.physics.arcade.collide(this.walls.get(), this.player.get())) {
                app.snd.cry.play()
                this.stop()
            }
        }
    },
    stop: function() {
        gamee.gameOver()
        this.isGamePlayable = false
        this.pause()
        if (app.isCustom) {
            new app.objects.Restart(this)
            var gameTime = parseInt((Date.now() - this.gameStartTime) /1000, 10)
            reqwest({
                url: '/score',
                method: 'post',
                type: 'json',
                contentType: 'application/json',
                data: { 
                    n: app.playerName, 
                    s: this.score.score,
                    t: gameTime,
                    j: this.player.totalJumps
                },
                success: function (data) {
                  callbackScoreTable(data)
                }
            })
        }
    },
    restart: function() {
        gamee.gameStart()
        app.game.state.start('game')
    },
    pause: function() {
        this.player.stop()
        this.ground.stop()
        this.background.stop()
        this.isPaused =  true
        app.snd.music.fadeOut()
        this.game.physics.arcade.isPaused = true
    },
    unpause: function() {
        if (this.isGamePlayable) {
            this.isPaused =  false
            this.game.physics.arcade.isPaused = false
            this.player.resume()
            this.ground.resume()
            this.background.resume()
            !app.settings.isSoundMuted && app.snd.music.fadeIn()
        }
    },
    resume: function() {
        this.unpause()
    },
    mute: function() {
        this.sound.mute() 
    },
    unmute: function() {
        this.sound.unmute()
    },
    playInitSound: function() {
        var initSound = this.game.add.audio('jump')
        initSound.volume = 0
        initSound.play()
    }
    // render: function() {
    //     this.game.debug.body(this.walls.get())
    //     this.game.debug.body(this.player.get())
    //     this.walls.get().forEachAlive(function(wall){
    //          this.game.debug.body(wall)
    //     }, this)
    // }
}
