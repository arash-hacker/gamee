var bootState={preload:function(){this.game=window.game,this.game.load.image("progressBar","assets/preloader.png"),this.game.load.image("progressBarBg","assets/preloaderbg.png")},create:function(){this.game.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL,this.game.scale.setMinMax(game.width/2,game.height/2,2*game.width,2*game.height),this.game.scale.pageAlignHorizontally=!0,this.game.scale.pageAlignVertically=!0,document.body.style.backgroundColor="#666666",this.game.stage.backgroundColor="#CCCCCC",this.game.physics.startSystem(Phaser.Physics.ARCADE),this.stage.disableVisibilityChange=!0,this.game.sound.muteOnPause=!1,this.game.state.start("load")}},playState={create:function(){this.TOTAL_ENEMIES=10,this.WORLD_MIN_Y=64,this.WORLD_MAX_Y=520,this.WORLD_MIN_X=320,this.WORLD_MAX_X=1560,this.ANGULAR_VELOCITY=350,this.ENEMY_SPAWN_TIME_MIN=3e3,this.CHANGE_COURSE_DELAY=8e3,this.MG_CREATION_COUNT=50,this.TOTAL_WIDTH=1920,this.PLAYER_TOTAL_HEALTH=25,this.EXPLOSION_COUNT=7,this.GAME_TILE_WIDTH_HEIGHT=32,this.SMOKE_CREATION_COUNT=15,this.CLOUD_COUNT=5,this.ENEMY_SPAWN_TIME_DECREASE=100,this.RANDOM_CHANCE_DECREASE=.2,this.DIVE_DIRECTION_DOWN="Down",this.DIVE_DIRECTION_UP="Up",this.PLAYER="player",this.ENEMY="enemy",this.score=0,this.enemiesAliveCount=0,this.enemySpawnTime=1e4,this.diveDirection="",this.randomChance=0,this.playerGameAltitude=4,this.cloudX=0,this.upKeyDown=!1,this.downKeyDown=!1,this.game=window.game,this.controllInput=window.inputControl,this.game.world.setBounds(0,0,this.TOTAL_WIDTH,this.game.world.height);for(var a=[0,1,2,3,4],b=0;b<a.length;b++)a[b]===this.game.global.lastBackgroundIndex&&a.splice(b,1);this.game.global.lastBackgroundIndex=this.game.rnd.pick(a);this.game.rnd.between(0,4);this.bg=this.game.add.sprite(-20,-20,"props","bg"+window.game.global.lastBackgroundIndex+"0"),this.bg.fixedToCamera=!0,this.bg1=this.game.add.sprite(this.game.world.centerX,150,"props","bg"+window.game.global.lastBackgroundIndex+"1"),this.bg1.anchor.setTo(.5,0),this.bg2=this.game.add.sprite(this.game.world.centerX,120,"props","bg"+window.game.global.lastBackgroundIndex+"2"),this.bg2.anchor.setTo(.5,0),this.bg3=this.game.add.sprite(this.game.world.centerX,430,"props","bg"+window.game.global.lastBackgroundIndex+"3"),this.bg3.anchor.setTo(.5,0),this.weapon=game.add.weapon(10,"props","mgbullet"),this.weapon.bulletKillType=Phaser.Weapon.KILL_CAMERA_BOUNDS,this.weapon.bulletSpeed=800,this.weapon.fireRate=220,this.weapon.onFire.add(this.onFireWeapon,this),this.weapon2=game.add.weapon(30,"props","mgbullet"),this.weapon2.bulletKillType=Phaser.Weapon.KILL_CAMERA_BOUNDS,this.weapon2.bulletSpeed=800,this.weapon2.fireRate=220,this.weapon2.onFire.add(this.onFireWeapon,this),this.player=this.createAircraft(this.PLAYER),this.player.moveData.type=this.PLAYER,this.player.health=this.PLAYER_TOTAL_HEALTH,this.player.events.onKilled.add(this.onPlayerKilled,this),this.game.camera.follow(this.player,Phaser.Camera.FOLLOW_LOCKON),this.weapon.trackSprite(this.player,0,0,!0),this.bullet2=this.game.add.audio("bullet2"),this.explosion1=this.game.add.audio("explosion1"),this.playerProximity=this.game.add.sprite(this.player.x,this.player.y,"props","collider"),this.playerProximity.anchor.setTo(.5,.5),this.playerProximity.width=this.game.world.game.width,this.playerProximity.height=this.GAME_TILE_WIDTH_HEIGHT,this.enemyProximity=this.game.add.sprite(this.player.x,this.player.y,"props","collider"),this.enemyProximity.anchor.setTo(.5,.5),this.enemyProximity.width=this.game.world.game.width-70,this.enemyProximity.height=this.GAME_TILE_WIDTH_HEIGHT,this.game.physics.arcade.enable(this.playerProximity),this.game.physics.arcade.enable(this.enemyProximity),this.enemies=this.game.add.group(),this.explosions=this.game.add.group(),this.smokeEmitters=this.game.add.group(),this.smokeWhiteEmitters=this.game.add.group(),this.clouds=this.game.add.group(),this.clouds.enableBody=!0,this.spawnEnemies();var b=0;for(b=0;b<this.EXPLOSION_COUNT;b++){var d=this.explosions.create(0,0,"explosion",0,!1);d.animations.add("explosion")}for(b=0;b<this.SMOKE_CREATION_COUNT;b++){var e=this.smokeEmitters.create(0,0,"smokesprite",0,!1);e.animations.add("smoke");var f=this.smokeWhiteEmitters.create(0,0,"cloudsmokesprite",0,!1);f.animations.add("smokeWhite")}for(b=1;b<=this.CLOUD_COUNT;b++){var g=this.clouds.create(this.game.rnd.between(.5*this.game.world.game.width,this.game.world.width-.5*this.game.world.game.width),2*this.GAME_TILE_WIDTH_HEIGHT*b,"cloud",this.game.rnd.between(0,3));g.anchor.set(.5,.5),g.body.setSize(192,96,0,0)}this.playerPreDirection=this.game.add.sprite(this.WORLD_MAX_X,this.game.world.centerY,"direction"),this.playerPreDirection.anchor.setTo(.5,.5);var h=this.game.rnd.between(0,1);h>0?this.diveDirection=this.DIVE_DIRECTION_DOWN:this.diveDirection=this.DIVE_DIRECTION_UP,this.playerPreDirection.frame=this.diveDirection===this.DIVE_DIRECTION_UP?0:1,this.game.add.tween(this.playerPreDirection).to({alpha:0},200,"Linear",!0,0,-1,!0),this.healthMeterBackground=this.game.add.image(20,17,"healthMeterBg"),this.healthMeterBackground.fixedToCamera=!0,this.healthMeterLevel=this.game.add.image(65,37,"healthMeterLevel"),this.healthMeterLevel.anchor.set(0,.5),this.healthMeter=this.game.add.image(65,37,"healthMeter"),this.healthMeterLevel.fixedToCamera=!0,this.healthMeter.anchor.set(0,.5),this.healthMeter.fixedToCamera=!0,this.game.time.advancedTiming=!0,this.game.time.events.loop(150,this.emitSmokeInitiate,this),this.spawnEnemiesTimer=this.game.time.events.loop(this.enemySpawnTime,this.spawnEnemies,this),this.enemySpawnTimer=this.game.time.events.loop(this.ENEMY_SPAWN_TIME_MIN,this.spawnTimeDecrease,this),this.enemySpawnTimer.autoDestroy=!0,this.ingamebgm=this.game.add.audio("ingame",.5,!0);var i=this;this.controllInput.buttons.up.on("keydown",function(){i.upKeyDown=!0}),this.controllInput.buttons.up.on("keyup",function(){i.upKeyDown=!1}),this.controllInput.buttons.down.on("keydown",function(){i.downKeyDown=!0}),this.controllInput.buttons.down.on("keyup",function(){i.downKeyDown=!1}),this.controllInput.on("keydown",function(a){i.onAnyKeyPressed(a)}),gamee.onPause=function(){i.game.paused=!0},gamee.onUnpause=function(){i.game.paused=!1},gamee.onRestart=function(){i.gameRestart()},gamee.onMute=function(){window.game.sound.mute=!0},gamee.onUnmute=function(){window.game.sound.mute=!1},this.game.global.gameRestarted?this.ingamebgm.play():(this.game.paused=!0,this.instruction=this.game.add.sprite(0,0,"props","instruction"),this.instruction.fixedToCamera=!0)},shutdown:function(){this.TOTAL_ENEMIES=null,this.WORLD_MIN_Y=null,this.WORLD_MAX_Y=null,this.WORLD_MIN_X=null,this.WORLD_MAX_X=null,this.ANGULAR_VELOCITY=null,this.ENEMY_SPAWN_TIME_MIN=null,this.CHANGE_COURSE_DELAY=null,this.MG_CREATION_COUNT=null,this.TOTAL_WIDTH=null,this.PLAYER_TOTAL_HEALTH=null,this.EXPLOSION_COUNT=null,this.GAME_TILE_WIDTH_HEIGHT=null,this.SMOKE_CREATION_COUNT=null,this.CLOUD_COUNT=null,this.ENEMY_SPAWN_TIME_DECREASE=null,this.RANDOM_CHANCE_DECREASE=null,this.DIVE_DIRECTION_DOWN=null,this.DIVE_DIRECTION_UP=null,this.PLAYER=null,this.ENEMY=null,this.score=null,this.enemiesAliveCount=null,this.enemySpawnTime=null,this.diveDirection=null,this.randomChance=null,this.playerGameAltitude=null,this.cloudX=null,this.upKeyDown=null,this.downKeyDown=null,this.bg.destroy(),this.bg=null,this.bg1.destroy(),this.bg1=null,this.bg2.destroy(),this.bg2=null,this.bg3.destroy(),this.bg3=null,gamee.onPause=function(){},gamee.onPause=null,gamee.onUnpause=function(){},gamee.onUnpause=null,gamee.onRestart=function(){},gamee.onRestart=null,gamee.onMute=function(){},gamee.onMute=null,gamee.onUnmute=function(){},gamee.onUnmute=null,this.player&&(this.player.destroy(),this.player=null),this.enemies&&(this.enemies.destroy(!0),this.enemies=null),this.weapon&&(this.weapon.destroy(!0),this.weapon=null),this.weapon2&&(this.weapon2.destroy(!0),this.weapon2=null),this.bullet2&&(this.bullet2.destroy(),this.bullet2=null),this.explosion1&&(this.explosion1.destroy(!0),this.explosion1=null),this.playerProximity&&(this.playerProximity.destroy(),this.playerProximity=null),this.enemyProximity&&(this.enemyProximity.destroy(),this.enemyProximity=null),this.smokeEmitters&&(this.smokeEmitters.destroy(),this.smokeEmitters=null),this.smokeWhiteEmitters&&(this.smokeWhiteEmitters.destroy(),this.smokeWhiteEmitters=null),this.clouds&&(this.clouds.destroy(!0),this.clouds=null),this.playerPreDirection&&(this.playerPreDirection.destroy(),this.playerPreDirection=null),this.healthMeterBackground&&(this.healthMeterBackground.destroy(),this.healthMeterBackground=null),this.healthMeterLevel&&(this.healthMeterLevel.destroy(),this.healthMeterLevel=null),this.healthMeter&&(this.healthMeter.destroy(),this.healthMeter=null),this.spawnEnemiesTimer&&(this.game.time.events.remove(this.spawnEnemiesTimer),this.spawnEnemiesTimer=null),this.enemySpawnTimer&&(this.game.time.events.remove(this.enemySpawnTimer),this.enemySpawnTime=null),this.ingamebgm&&(this.ingamebgm.destroy(),this.ingamebgm=null)},gameRestart:function(){gamee.gameStart(),this.game.paused=!1,this.game.state.start("play")},update:function(){this.playerUpdate(),this.updateAircraft(this.player),this.enemies.forEachAlive(this.updateAircraft,this),this.game.physics.arcade.overlap(this.weapon.bullets,this.enemies,this.enemyHitBullet,null,this),this.game.physics.arcade.overlap(this.weapon2.bullets,this.player,this.playerHitBullet,null,this),this.game.physics.arcade.overlap(this.player,this.enemies,this.enemyPlayerHit,null,this),this.game.physics.arcade.overlap(this.playerProximity,this.enemies,this.firePrimryWeapon,null,this),this.game.physics.arcade.overlap(this.enemyProximity,this.enemies,this.firePrimryWeapon,null,this),this.game.physics.arcade.overlap(this.player,this.clouds,this.aircraftInsideCloud,null,this),this.game.physics.arcade.overlap(this.enemies,this.clouds,this.aircraftInsideCloud,null,this);var a=this.game.camera.x+.5*this.game.camera.width,b=this.game.world.centerX-(this.game.camera.x+.5*this.game.camera.width);this.bg1.x=a+.08*b,this.bg2.x=a+.4*b,this.bg3.x=a+.72*b},spawnTimeDecrease:function(){this.enemySpawnTime>this.ENEMY_SPAWN_TIME_MIN&&(this.enemySpawnTime-=this.ENEMY_SPAWN_TIME_DECREASE,this.randomChance+=this.RANDOM_CHANCE_DECREASE,this.spawnEnemiesTimer.delay=this.enemySpawnTime)},render:function(){},renderGroup:function(a){this.game.debug.body(a)},onAnyKeyPressed:function(a){this.game.global.gameRestarted||(this.game.global.gameRestarted=!0,this.instruction.kill(),this.instruction.destroy(),this.instruction=null,this.game.paused=!1,gamee.gameStart(),this.ingamebgm.play(),this.bullet2.play())},roll0animationStopped:function(a){a.moveData.diveUp?a.moveData.diving=!1:a.body.angularVelocity=this.ANGULAR_VELOCITY},roll1animationStopped:function(a){a.moveData.diveUp?a.moveData.diving=!1:a.body.angularVelocity=-this.ANGULAR_VELOCITY},playerUpdate:function(){this.player.x>this.WORLD_MIN_X&&this.player.x<this.WORLD_MAX_X&&(this.upKeyDown&&this.player.y>this.WORLD_MIN_Y?this.divingUp(this.player):this.downKeyDown&&this.player.y<this.WORLD_MAX_Y&&this.divingDown(this.player)),this.playerProximity.x=this.enemyProximity.x=game.camera.x+game.world.game.width/2,this.playerProximity.y=this.enemyProximity.y=this.player.y},updateAircraft:function(a){a.body&&(a.moveData.type===this.ENEMY&&a.moveData.changeCourse<this.game.time.now&&(a.moveData.changeCourse=this.game.time.now+this.game.rnd.between(.5*this.CHANGE_COURSE_DELAY,this.CHANGE_COURSE_DELAY),this.diveEnemies(a)),a.moveData.diving||(a.x<this.WORLD_MIN_X&&a.body.velocity.x<0||a.x>this.WORLD_MAX_X&&a.body.velocity.x>0)&&this.autoDiveAircraft(a),a.body.angularVelocity===-this.ANGULAR_VELOCITY&&a.body.rotation>-180&&a.body.rotation<-170?(a.moveData.type===this.PLAYER&&(this.playerGameAltitude<this.CLOUD_COUNT-1?this.playerGameAltitude-=1:this.playerGameAltitude-=1,this.autoDiveDirectionPreCalculate()),a.body.rotation=-180,a.body.angularVelocity=0,a.animations.play("roll0")):a.body.angularVelocity===this.ANGULAR_VELOCITY&&a.body.rotation>-10&&a.body.rotation<0?(a.moveData.type===this.PLAYER&&(this.playerGameAltitude<this.CLOUD_COUNT-1?this.playerGameAltitude-=1:this.playerGameAltitude-=1,this.autoDiveDirectionPreCalculate()),a.body.rotation=0,a.body.angularVelocity=0,a.animations.play("roll1")):a.body.angularVelocity===-this.ANGULAR_VELOCITY&&a.body.rotation<10&&a.body.rotation>0?(a.body.rotation=0,a.body.angularVelocity=0,a.moveData.diving=!1,a.moveData.type===this.PLAYER&&(this.playerGameAltitude<this.CLOUD_COUNT-1?this.playerGameAltitude+=1:this.playerGameAltitude+=1,this.autoDiveDirectionPreCalculate())):a.body.angularVelocity===this.ANGULAR_VELOCITY&&a.body.rotation<180&&a.body.rotation>170&&(a.body.rotation=180,a.body.angularVelocity=0,a.moveData.diving=!1,a.moveData.type===this.PLAYER&&(this.playerGameAltitude<this.CLOUD_COUNT-1?this.playerGameAltitude+=1:this.playerGameAltitude+=1,this.autoDiveDirectionPreCalculate())),this.playerGameAltitude<this.CLOUD_COUNT&&(this.cloudX=this.clouds.getChildAt(this.playerGameAltitude).x),this.game.physics.arcade.velocityFromAngle(a.angle,200,a.body.velocity))},aircraftInsideCloud:function(a,b){a.moveData.cloudSmoke=this.game.time.now+300},emitSmokeInitiate:function(){this.emitSmoke(this.player),this.enemies.forEachAlive(this.emitSmoke,this)},emitSmoke:function(a){if(a.inCamera){if(a.health<4){var b=this.smokeEmitters.getFirstExists(!1);if(!b)return;b.anchor.set(.5,.5),b.reset(a.x,a.y),b.angle=this.game.rnd.between(0,180),b.play("smoke",24,!1,!0)}if(this.game.time.now<a.moveData.cloudSmoke){var c=this.smokeWhiteEmitters.getFirstExists(!1);if(!c)return;c.anchor.set(.5,.5),c.reset(a.x,a.y),c.angle=this.game.rnd.between(0,180),c.play("smokeWhite",24,!1,!0)}}},autoDiveDirectionPreCalculate:function(){var a=this.game.rnd.between(0,1);this.player.y<this.WORLD_MAX_Y&&this.player.y>this.WORLD_MIN_Y?a>0?this.diveDirection=this.DIVE_DIRECTION_DOWN:this.diveDirection=this.DIVE_DIRECTION_UP:this.player.y>this.WORLD_MIN_Y?this.diveDirection=this.DIVE_DIRECTION_UP:this.player.y<this.WORLD_MAX_Y&&(this.diveDirection=this.DIVE_DIRECTION_DOWN),this.player.body.velocity.x>0?(this.playerPreDirection.x=this.WORLD_MAX_X,this.diveDirection===this.DIVE_DIRECTION_UP?this.playerPreDirection.frame=0:this.playerPreDirection.frame=1):(this.playerPreDirection.x=this.WORLD_MIN_X,this.diveDirection===this.DIVE_DIRECTION_UP?this.playerPreDirection.frame=2:this.playerPreDirection.frame=3)},autoDiveAircraft:function(a){if(a.body)if(a.moveData.type===this.PLAYER)this.diveDirection===this.DIVE_DIRECTION_UP?this.divingUp(a):this.divingDown(a);else if(a.y<this.WORLD_MAX_Y&&a.y>this.WORLD_MIN_Y)if(this.game.math.roundAwayFromZero(this.player.y)>this.game.math.roundAwayFromZero(a.y))this.divingDown(a);else if(this.game.math.roundAwayFromZero(this.player.y)<this.game.math.roundAwayFromZero(a.y))this.divingUp(a);else{var b=this.game.rnd.between(0,1);b>0?this.divingDown(a):this.divingUp(a)}else a.y>this.WORLD_MIN_Y?this.divingUp(a):a.y<this.WORLD_MAX_Y&&this.divingDown(a)},divingUp:function(a){a.body&&(a.moveData.diving||(a.moveData.diving=!0,a.moveData.diveUp=!0,a.body.velocity.x>0?a.body.angularVelocity=-this.ANGULAR_VELOCITY:a.body.angularVelocity=this.ANGULAR_VELOCITY))},divingDown:function(a){a.body&&(a.moveData.diving||(a.moveData.diving=!0,a.moveData.diveUp=!1,a.body.velocity.x<0?a.animations.play("roll1"):a.animations.play("roll0")))},enemyPlayerHit:function(a,b){if(!b.moveData.diving){a.tint=16711680,this.game.add.tween(a).to({tint:16777215},100,Phaser.Easing.Linear.None,!0),b.tint=16711680,this.game.add.tween(b).to({tint:16777215},100,Phaser.Easing.Linear.None,!0),a.damage(1);var c=Phaser.Math.percent(this.player.health,this.PLAYER_TOTAL_HEALTH);this.healthMeter.scale=new Phaser.Point(c,1),this.game.camera.flash(16711680,100),b.damage(1),this.autoDiveAircraft(b)}},diveEnemies:function(a){a.body&&Phaser.Utils.chanceRoll(this.randomChance)+5&&((a.y<this.playerProximity.y||a.y>this.playerProximity.y)&&this.autoDiveAircraft(a),(a.body.velocity.x<0&&this.playerProximity.x>a.x||a.body.velocity.x>0&&this.playerProximity.x<a.x)&&this.autoDiveAircraft(a))},firePrimryWeapon:function(a,b){this.playerGameAltitude<=this.CLOUD_COUNT-1?a===this.enemyProximity?(b.body.velocity.x<0&&this.player.x<b.x&&(this.cloudX+96<this.player.x||this.cloudX-96>b.x)||b.body.velocity.x>0&&this.player.x>b.x&&(this.cloudX-96>this.player.x||this.cloudX+96<b.x))&&this.firePrimaryWeapon(b):(b.body.velocity.x<0&&this.player.x>b.x&&(this.cloudX+96<b.x||this.cloudX-96>this.player.x)||b.body.velocity.x>0&&this.player.x<b.x&&(this.cloudX-96>b.x||this.cloudX+96<this.player.x))&&this.firePrimaryWeapon(this.player):a===this.enemyProximity?(b.body.velocity.x<0&&this.player.x<b.x||b.body.velocity.x>0&&this.player.x>b.x)&&this.firePrimaryWeapon(b):(b.body.velocity.x<0&&this.player.x>b.x||b.body.velocity.x>0&&this.player.x<b.x)&&this.firePrimaryWeapon(this.player)},playerHitBullet:function(a,b){this.game.camera.flash(16711680,200),a.damage(1);var c=Phaser.Math.percent(this.player.health,this.PLAYER_TOTAL_HEALTH);this.healthMeter.scale=new Phaser.Point(c,1),b.kill()},enemyHitBullet:function(a,b){this.score+=1,gamee.score=this.score,b.tint=16711680,this.game.add.tween(b).to({tint:16777215},100,Phaser.Easing.Linear.None,!0),a.kill(),b.damage(1);this.game.rnd.between(0,1);this.diveEnemies(b)},firePrimaryWeapon:function(a){a.body&&(0!==a.angle&&a.angle!==-180||(a.moveData.type===this.ENEMY?(this.weapon2.trackSprite(a,0,0,!0),this.weapon2.fire()):this.weapon.fire()))},onFireWeapon:function(a,b){console.log(b),this.bullet2.play()},spawnEnemies:function(){if(this.enemiesAliveCount<this.TOTAL_ENEMIES){var a=this.createAircraft(this.ENEMY),b=this.game.rnd.between(0,1),c=b>0?this.game.world.width:-100;a.x=c,a.health=7,a.events.onKilled.add(this.onEnemyKilled,this),this.enemies.add(a),this.enemiesAliveCount+=1}},onEnemyKilled:function(a){var b=this.explosions.getFirstExists(!1);b.anchor.set(.5,.5),b.reset(a.x,a.y),b.play("explosion",30,!1,!0),this.explosion1.play(),this.game.camera.shake(.02,300),this.enemies.remove(a),a.destroy(),this.enemiesAliveCount-=1},onPlayerKilled:function(a){this.ingamebgm.stop();var b=this.explosions.getFirstExists(!1);b.anchor.set(.5,.5),b.reset(a.x,a.y);var c=b.play("explosion",18,!1,!0);c.onComplete.add(this.gameOver,this),this.game.camera.shake(.02,300)},gameOver:function(){gamee.gameOver(),this.game.paused=!0},createAircraft:function(a){var b,c,d;return a===this.PLAYER?(b=this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,"airplaneTex","sprite37"),c=b.animations.add("roll0",Phaser.Animation.generateFrameNames("sprite",37,54,"",2)),d=b.animations.add("roll1",Phaser.Animation.generateFrameNames("sprite",55,71,"",2))):(b=this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,"airplaneTex","sprite02"),c=b.animations.add("roll0",Phaser.Animation.generateFrameNames("sprite",2,19,"",2)),d=b.animations.add("roll1",Phaser.Animation.generateFrameNames("sprite",20,36,"",2))),b.moveData={},b.moveData.type=a,b.moveData.diving=!1,b.moveData.diveUp=!1,b.moveData.cloudSmoke=0,b.moveData.changeCourse=this.game.time.now+this.CHANGE_COURSE_DELAY,b.anchor.setTo(.5,.5),c.onComplete.add(this.roll0animationStopped,this),d.onComplete.add(this.roll1animationStopped,this),this.game.physics.enable(b,Phaser.Physics.ARCADE),b.body.setSize(35,20,15,20),b}};window.onload=function(){window.game=new Phaser.Game(640,640,Phaser.WEBGL,"content"),window.game.preserveDrawingBuffer=!0,window.inputControl=gamee.controller.requestController("FourArrows",{enableKeyboard:!0}),window.game.global={gameRestarted:!1,lastBackgroundIndex:window.game.rnd.between(0,4)},window.game.state.add("boot",bootState),window.game.state.add("load",loadState),window.game.state.add("play",playState),window.game.state.start("boot")};var loadState={preload:function(){var a=game.add.sprite(game.world.centerX,320,"progressBarBg");a.anchor.setTo(.5,.5);var b=game.add.sprite(game.world.centerX,320,"progressBar");b.anchor.setTo(.5,.5),this.game=window.game,this.game.load.setPreloadSprite(b),this.game.load.audio("ingame",["assets/ingame.ogg","assets/ingame.mp3"]),this.game.load.audio("bullet2",["assets/bullet2.ogg","assets/bullet2.mp3"]),this.game.load.audio("explosion1",["assets/explosion1.ogg","assets/explosion1.wav"]),this.game.load.spritesheet("cloud","assets/clouds.png",192,96,4),this.game.load.spritesheet("direction","assets/direction.png",64,64),this.game.load.spritesheet("explosion","assets/explode.png",128,128,16),this.game.load.spritesheet("smokesprite","assets/smokeSprite.png",32,32,15),this.game.load.spritesheet("cloudsmokesprite","assets/smokeWhiteSprite.png",32,32,15),this.game.load.image("healthMeterLevel","assets/healthmeterlevel.png"),this.game.load.image("healthMeter","assets/healthmeter.png"),this.game.load.image("healthMeterBg","assets/healthBackground.png"),this.game.load.atlasXML("airplaneTex","assets/airplane.png","assets/airplane.xml"),this.game.load.atlasXML("props","assets/props.png","assets/props.xml")},create:function(){gamee.gameLoaded(),this.game.state.start("play")}};