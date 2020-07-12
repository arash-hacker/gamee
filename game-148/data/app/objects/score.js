var app = app || {}
app.objects = app.objects || {}

app.objects.Score = function(state) {
    this.state = state
    this.score = app.settings.defaultScore

    this.create()
}

app.objects.Score.prototype.create = function() {
    if(app.isCustom) {
        this.text = this.state.add.text(20, 20, this.score, {font: "32px Arial", fill: "#fff"});
    }
}

app.objects.Score.prototype.update = function() {
    if(app.isCustom) {
        this.text.setText(this.score)
    }
}

app.objects.Score.prototype.add = function(num) {
    this.score = this.score + num
    if(!app.isCustom) gamee.score = this.score
    this.update()
    this.updateParams()
}

app.objects.Score.prototype.updateParams = function() {
   if(this.score > 600  && this.state.level == 3) {
        this.state.player.setGravity(2)
        this.state.player.setAnimationSpeed(15)
        this.state.background.setForegroundSpeed(500)
        this.state.walls.setSpeed(500)
        this.state.ground.setSpeed(500)
        this.state.level ++
        app.settings.dogJumpHeight = 220
        app.settings.groundScrollSpeed = 500
        app.settings.spaceBetweenWallsGroups = 450
        app.settings.spaceBetweenWalls = 50
   } else if(this.score > 500 && this.state.level == 2) {
        this.state.player.setGravity(1)
        this.state.player.setAnimationSpeed(13)
        this.state.background.setForegroundSpeed(400)
        this.state.walls.setSpeed(400)
        this.state.ground.setSpeed(400)
        this.state.level ++
        app.settings.dogJumpHeight = 220
        app.settings.groundScrollSpeed = 400
        app.settings.spaceBetweenWallsGroups = 450
   } else if(this.score > 200 && this.state.level == 1) {
        this.state.player.setGravity(1)
        this.state.player.setAnimationSpeed(12)
        this.state.background.setForegroundSpeed(300)
        this.state.walls.setSpeed(300)
        this.state.ground.setSpeed(300)
        this.state.level ++
        app.settings.dogJumpHeight = 190
        app.settings.groundScrollSpeed = 300
        app.settings.spaceBetweenWallsGroups = 350
   } else if(this.score > 100 && this.state.level == 0) {
        this.state.player.setGravity(1.1)
        this.state.player.setAnimationSpeed(11)
        this.state.background.setForegroundSpeed(250)
        this.state.walls.setSpeed(250)
        this.state.ground.setSpeed(250)
        this.state.level ++
        app.settings.dogJumpHeight = 180
        app.settings.groundScrollSpeed = 250
   }
}
