var app = app || {}
app.objects = app.objects || {}

app.objects.Ground = function(state) {
    this.state = state

    this.height = 88

    this.create()
}

app.objects.Ground.prototype.get = function() {
    return this.ground
}

app.objects.Ground.prototype.stop = function() {
   this.ground.autoScroll(0)
}

app.objects.Ground.prototype.resume = function() {
   this.ground.autoScroll(-app.settings.groundScrollSpeed, 0)
}

app.objects.Ground.prototype.create = function() {
    this.ground = this.state.add.tileSprite(0, this.state.game.height - 88, this.state.game.width, 88, 'ground');
    this.state.physics.arcade.enable(this.ground)
    this.ground.body.setSize(this.state.game.width, this.height, 0, 3)
    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;
    this.ground.autoScroll(-app.settings.groundScrollSpeed, 0)
}

app.objects.Ground.prototype.setSpeed = function(speed) {
    this.ground.autoScroll(-speed, 0)
}
