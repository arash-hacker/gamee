var app = app || {}
app.objects = app.objects || {}

app.objects.Background = function(state) {
    this.state = state

    this.create()
}

app.objects.Background.prototype.update = function() {
    this.backgroundObjects.forEach(function(bgo) {
          if(bgo.x + bgo.width < 0) {
            var bounds = this.backgroundObjects.getBounds()
            bgo.x = bounds.x  + bounds.width
          }
    }, this)
    if(this.foreground.x + 2442  < 0) { //2442 width image
        this.foreground.x = this.foreground.x + 2442 + 3500 //3500 free space
    }
}

app.objects.Background.prototype.get = function() {
    return this.background
}

app.objects.Background.prototype.stop = function() {
   this.background.autoScroll(0)
}

app.objects.Background.prototype.resume = function() {
   this.background.autoScroll(-app.settings.backgroundSpeed, 0)
}

app.objects.Background.prototype.create = function() {
    this.background = this.state.add.tileSprite(0, 0, this.state.game.width, this.state.game.height, 'background')
    this.background.autoScroll(-app.settings.backgroundSpeed, 0)
    this.state.game.world.sendToBack(this.background)

    this.backgroundObjects = this.state.add.group();

    var backgroundObject1 = this.state.add.sprite(0, 0, 'background-objects1')
    this.state.physics.arcade.enable(backgroundObject1)
    backgroundObject1.body.allowGravity = false;
    backgroundObject1.body.velocity.x = -app.settings.backgroundObjectsSpeed
    this.backgroundObjects.add(backgroundObject1)

    var backgroundObject2 = this.state.add.sprite(2048, 0, 'background-objects2')
    this.state.physics.arcade.enable(backgroundObject2)
    backgroundObject2.body.allowGravity = false;
    backgroundObject2.body.velocity.x = -app.settings.backgroundObjectsSpeed
    this.backgroundObjects.add(backgroundObject2)

    var backgroundObject3 = this.state.add.sprite(4096, 0, 'background-objects3')
    this.state.physics.arcade.enable(backgroundObject3)
    backgroundObject3.body.allowGravity = false;
    backgroundObject3.body.velocity.x = -app.settings.backgroundObjectsSpeed
    this.backgroundObjects.add(backgroundObject3)

    var backgroundObject4 = this.state.add.sprite(6144, 0, 'background-objects4')
    this.state.physics.arcade.enable(backgroundObject4)
    backgroundObject4.body.allowGravity = false;
    backgroundObject4.body.velocity.x = -app.settings.backgroundObjectsSpeed
    this.backgroundObjects.add(backgroundObject4)
}

app.objects.Background.prototype.createForeground = function() {
    this.foreground = this.state.add.sprite(3500, 480, 'foreground')
    this.state.physics.arcade.enable(this.foreground)
    this.foreground.body.allowGravity = false;
    this.foreground.body.velocity.x = -app.settings.groundScrollSpeed
}

app.objects.Background.prototype.setSpeed = function(speed) {
    this.background.autoScroll(-speed, 0)
}

app.objects.Background.prototype.setForegroundSpeed = function(speed) {
    this.foreground.body.velocity.x = -speed
}
