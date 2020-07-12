var app = app || {}
app.objects = app.objects || {}

app.objects.Player = function(state) {
    this.state = state
    this.player = this.state.add.sprite(app.settings.dogX, app.settings.dogY, 'player');
    this.state.physics.arcade.enable(this.player)
    this.setGravity(app.settings.dogJumpSpeed)
    this.player.animations.add('playerAnimation', [0, 1, 2, 3, 4, 5], app.settings.dogSpeed, true)
    this.maxJumsInRow = 3
    this.maxJumpDeviation = 5
    this.upKey = this.state.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.spacebarKey = this.state.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.totalJumps = 0
    app.snd.cry = this.state.game.add.audio('cry')
    app.snd.jump = this.state.game.add.audio('jump')
    app.snd.bark = this.state.game.add.audio('bark')

    this.text1 = this.state.add.text(640, 0, '', {font: "26px Comic Sans MS", fill: "#FFFFFF"});
    this.text2 = this.state.add.text(640, 0, '+5', {font: "26px Comic Sans MS", fill: "#FFFFFF", fontWeight: "bold", stroke: "#000000", strokeThickness: 3});
    this.text3 = this.state.add.text(640, 0, 'combo!', {font: "26px Comic Sans MS", fill: "#FFFFFF", stroke: "#000000", strokeThickness: 3});
   
}

app.objects.Player.prototype.get = function() {
   return this.player
}

app.objects.Player.prototype.update = function() {
    if(this.player.body.touching.down) {
        this.player.animations.play('playerAnimation')
    } else {
        this.player.animations.stop('playerAnimation')
        this.player.frame = 3;
    }
   this.jump()
}

app.objects.Player.prototype.stop = function() {
   this.player.animations.stop('playerAnimation')
}

app.objects.Player.prototype.resume = function() {
   this.player.animations.play('playerAnimation')
}

app.objects.Player.prototype.mute = function() {
   app.snd.cry.volume = 0
   app.snd.jump.volume = 0
   app.snd.bark.volume = 0
}

app.objects.Player.prototype.unmute = function() {
   app.snd.cry.volume = app.settings.soundsVolume
   app.snd.jump.volume = app.settings.soundsVolume
   app.snd.bark.volume = app.settings.soundsVolume
}

app.objects.Player.prototype.jump = function() {
    if((((this.upKey.isDown || this.spacebarKey.isDown || this.state.game.input.activePointer.isDown) && !app.isGamee) || ((app.isGamee || app.game.device.touch) && app.controller.buttons.button.isDown())) && !this.cursorIsOver) {
        if(this.player.body.touching.down) {
            this.startJumpY = this.player.y
            this.isJumping = true
            this.player.body.velocity.y = -Math.sqrt(2 * this.player.body.gravity.y * app.settings.dogJumpHeight)
            this.jumsInRow = 1
            this.maxJumpDistance = app.settings.dogJumpHeight
            this.wasJumping = false
            this.totalJumps++
            app.snd.jump.play()
        } else if(this.isJumping) {
            var distance = this.startJumpY - this.player.y
            if (this.wasJumping) {
                this.jumsInRow++;
                this.totalJumps++
                this.wasJumping = false
                this.maxJumpDistance = distance + app.settings.dogJumpHeight
                app.snd.jump.play()
            }
            if(this.jumsInRow <= this.maxJumsInRow) {
                if(distance + this.maxJumpDeviation < this.maxJumpDistance) {  
                    this.player.body.velocity.y = -Math.sqrt(2 * this.player.body.gravity.y * (this.maxJumpDistance - distance))
                } else {
                    this.cursorIsOver = true
                }
            }
        }
    } else if(((this.upKey.isUp || this.spacebarKey.isUp || this.state.game.input.activePointer.isUp) && !app.isGamee) || ((app.isGamee || app.game.device.touch) && !app.controller.buttons.button.isDown())) {
        this.wasJumping = true
        this.cursorIsOver = false
        if (this.jumsInRow == this.maxJumsInRow) {
            this.jumsInRow = 1
            this.isJumping = false
            this.isTrippleJump = true
        }
    }
    //check tripplejump
    if(this.player.body.touching.down && this.isTrippleJump) {
        this.isTrippleJump = false
        this.state.score.add(5)
        app.snd.bark.play()
        this.showTrippleJumpMessage()
    }
}

app.objects.Player.prototype.showTrippleJumpMessage = function() {
    var messages = ["Wow","Such jump","Much combo","So high","Such landing","So jumpy","Very distance","Much hop","Very moon","Much power","How far","Very well","Sweet","Oh boy"]
    var colors = ['#4aff00','#ff00de']

    var selectedMessage = messages[Math.floor(Math.random()*messages.length)]
    var selectedColor = colors[Math.floor(Math.random()*colors.length)]

    var x = this.player.x + this.player.width + 25
    var y = this.player.y
    this.text1.fill = selectedColor
    this.text1.setText(selectedMessage)
    this.text1.position.x = x
    this.text1.position.y = y
    this.text1.alpha = 1
    this.state.game.add.tween(this.text1).to({alpha: 0, x: x + 50, y: y - 150}, 1500, Phaser.Easing.Linear.In, true)

    this.text2.position.x = this.player.x
    this.text2.position.y = this.player.y - 80
    this.text2.alpha = 1
    this.state.game.add.tween(this.text2).to({alpha: 0}, 1000, Phaser.Easing.Linear.In, true)

    this.text3.position.x = this.player.x + 50
    this.text3.position.y = this.player.y - 80
    this.text3.alpha = 1
    this.state.game.add.tween(this.text3).to({alpha: 0}, 1000, Phaser.Easing.Linear.In, true)
}

app.objects.Player.prototype.setGravity = function(gravity) {
    this.player.body.gravity.y = gravity * 1000
}

app.objects.Player.prototype.setAnimationSpeed = function(speed) {
    this.player.speed = speed
}


