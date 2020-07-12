var app = app || {}
app.objects = app.objects || {}

app.objects.Walls = function(state) {

    this.state = state

    this.walls = this.state.add.group()
    this.wallPool = []
    this.maxWallHeight = app.settings.maxWallHeight
    this.minWallHeight = app.settings.minWallHeight
    this.nextGroupWidth = app.settings.spaceBetweenWallsGroups
    this.dogPaddingBottom = -27
    this.wallInGround = 3
    this.groundHeight = this.state.ground.height
    this.wallWidth = app.settings.wallWidth
    this.wallTypes = ['wall-green', 'wall-violet', 'wall-blue']
    this.createWallPool()
}

app.objects.Walls.prototype.get = function() {
   return this.walls
}

app.objects.Walls.prototype.update = function() {
    // remove old walls
    this.walls.forEach(function(wall) {
          if(wall.x + this.wallWidth < 0) {
            wall.kill()
            this.walls.remove(wall)
            this.wallPool.push(wall)
            this.state.score.add(1)
          }
    }, this)

    //create new wall group
    var bounds = this.walls.getBounds()
    if(this.walls.length == 0 || bounds.x  + bounds.width + this.nextGroupWidth < this.state.game.width) {
        this.createWallGroup()
    }
}

app.objects.Walls.prototype.createWallGroup = function() {
    var maxWallsInRow = Math.random() * (app.settings.maxWallsInRow)
    for(var i = 0; i < maxWallsInRow; i++) {
       var wallSeparator = this.wallWidth + app.settings.spaceBetweenWalls
       this.addWallToGroup (this.state.game.width + wallSeparator*i)
    }
}

app.objects.Walls.prototype.addWallToGroup = function(x) {
    var wallHeight =  Math.random() * (this.maxWallHeight - this.minWallHeight) + this.minWallHeight
    if(this.wallPool.length == 0) this.createWall()
    var wallNumber = Math.floor(Math.random()*this.wallPool.length)
    var wall = this.wallPool.splice(wallNumber, 1)[0]
    wall.height = wallHeight
    wall.position.x = x
    wall.position.y = this.state.game.height - this.groundHeight - wallHeight + this.wallInGround
    wall.body.setSize(this.wallWidth, wallHeight, 0, -this.dogPaddingBottom)
    wall.body.velocity.x = -app.settings.groundScrollSpeed
    wall.revive()
    this.walls.add(wall)
}

app.objects.Walls.prototype.createWall = function() {
    var wallType = Math.floor(Math.random() * this.wallTypes.length)
    var wall = this.state.add.tileSprite(640, 0, this.wallWidth, 0, this.wallTypes[wallType])
    this.state.physics.arcade.enable(wall)
    wall.body.immovable = true;
    wall.body.allowGravity = false;
    wall.body.velocity.x = -app.settings.groundScrollSpeed
    wall.kill()
    this.wallPool.push(wall)
}

app.objects.Walls.prototype.createWallPool = function() {
    for (var i = 0; i < 6; i++) {
        this.createWall()
    }
}

app.objects.Walls.prototype.setSpeed = function(speed) {
     this.walls.forEach(function(wall) {
          wall.body.velocity.x = -speed
    }, this)
}
