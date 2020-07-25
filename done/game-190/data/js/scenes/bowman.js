
var soundsPath = "sounds/"
var bowman = function(){    

	assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/game/atlas.json",
                image: "images/game/atlas.png",
            },
        ],
        images: [

		],
		sounds: [
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "bowPull",
				file: soundsPath + "bow_string.mp3"},
			{	name: "grunt",
				file: soundsPath + "grunt.mp3"},
			{	name: "growl",
				file: soundsPath + "growl.mp3"},
			{	name: "bunny",
				file: soundsPath + "bunny.mp3"},
			{	name: "rock",
				file: soundsPath + "rock.mp3"},
			{	name: "barCrash",
				file: soundsPath + "punch3.mp3"},
			{	name: "bowShoot",
				file: soundsPath + "bow_shoot.mp3"},
			{	name: "scream",
				file: soundsPath + "scream.mp3"},
			{	name: "grass",
				file: soundsPath + "grass.mp3"},
			{	name: "medievalSong",
				file: soundsPath + 'songs/fantasy_ballad.mp3'},
			{	name: "windBlow",
				file: soundsPath + 'windBlow.mp3'},
			{	name: "combo",
				file: soundsPath + 'combo.mp3'},
			{	name: "brightTransition",
				file: soundsPath + 'brightTransition.mp3'},
			
			
		],
    }
    
	var usedObjects
	var SHOT_DELAY = 300;
	var BOW_SPEED = 1000
	var NUMBER_OF_BOWS = 20
	var GRAVITY = 980
	var GAME_SCALE = 0.7
	var MAX_ROTATION = 1
	
	var rainbowGroup
	var worldGroup
	var barrier
	var arrowsGui
	var friendsGroup
	var rotationSpeed = 0.4
	var groundPivot
	var focusFrame
	var playerToUse
	var movingGroup
	var bulletToUse
	var elevatorRock
	var bulletPool, ground, gun, bowman, bowmanGroup
	var bowsGui
	var mountainsGroup, treesGroup
	var leftBowsGroup
	var fruitsGroup
	var screenBtn
	var sceneGroup = null
	var background
    var gameActive = true
	var buttonsActive
	var particlesGroup, particlesUsed
    var medievalSong
	var particlesGroup,usedParticles
	var charactersGroup
	var rocksGroup
	var gameScore
	var bowsNumber
	var gameLevel
	var nextLevel
	var socialList
	var clouds
	var bitmap, timeOffset
	var isDrawing
	var lastCharacter
	var transitionObject
	var consecutiveArrows
	var arrowEmitter, bonusGroup
	var rainbowActive
	var tweensList, timerList
	var canRainbow
	var topBarrier
	var lastScore
	var friendAheadGroup, guiFriends
	var sky
    var barrierParts
    var unmuteSong

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
		
        unmuteSong = false
		arrowsGui.backGroup.alpha = 0
        game.stage.backgroundColor = "#ffffff"
		gameScore = 0
		gameActive = true
		buttonsActive = false
		nextLevel = false
		bowsNumber = 3
		gameLevel = 0
		playerToUse = null
		movingGroup = null
		rotationSpeed = MAX_ROTATION
		socialList = []
		isDrawing = false
		bitmap.alphaValue = 0.018
		consecutiveArrows = 0
		rainbowActive = true
		canRainbow = false
		restartEmitter()
        
	}
	
	function restartEmitter(){
		
		if(arrowEmitter){
			arrowEmitter.x = -200
		}
	}
    
    function animateScene() {

        sceneGroup.alpha = 0
		
		addCharacter()
        tweensList[tweensList.length] = game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
	function popObject(obj,delay,soundName,angled,notPlaying){
        
		obj.angle = 0
		var scaleToUse = obj.origScale || 1
		
		var angleToUse = obj.angle
		if(angled){
			angleToUse = obj.angle + 360
		}
		
		obj.scale.setTo(scaleToUse,scaleToUse)
		
		var soundN = soundName || "cut"
		obj.alpha = 0
        timerList[timerList.length] = game.time.events.add(delay,function(){
            
			if(!notPlaying){
				sound.play(soundN)
			}
            
            obj.alpha = 1
            
			tweensList[tweensList.length] = game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
			tweensList[tweensList.length] = game.add.tween(obj).from({angle:angleToUse},250,"Linear",true)
			
        },this)
		
    }
	
	function checkDialogTween(){
		
		if(bowsGui.tween){
			bowsGui.tween.stop()
			bowsGui.scale.setTo(1,1)
		}
	}
	
	function checkifPlayer(){
		
		var scoreToCheck = gameScore + (consecutiveArrows - 1)
		
		if(consecutiveArrows < 3){
			scoreToCheck = gameScore + 1
		}
		
		var friendScoreList = []
		for(var i = 0; i < friendsGroup.length;i++){
			
			var friend = friendsGroup.children[i]
			
			//console.log(friend.score + ' fScore ' + scoreToCheck + ' scoreToCheck ' + gameScore + ' gameScore')
			if(friend.score < scoreToCheck && friend.score >= gameScore && friend.active && friend.score > lastScore){
				return friend
				//friendScoreList[friendScoreList.length] = friend
			}
		}
		
		/*var friend = getFriendFromList(friendScoreList)
		return friend*/
				
	}
	
	function getFriendFromList(list){
		
		var friendToSend = null
		
		var fList = []
		
		guiFriends.forEach(function(friend){
			if(friend.score >= gameScore && friend.score > lastScore){
				fList.push(friend)
			}
		})
		
		//console.log(list + ' group')
		if(fList.length > 0){
			
			var scoreList = []
			
			fList.forEach(function(friend){
				scoreList[scoreList.length] = friend.score
			})
			
			var score = Phaser.ArrayUtils.findClosest(gameScore,scoreList)
			
			fList.forEach(function(friend){
				
				//console.log(friend.score + ' fScore ' + lastScore + ' last ' + score + ' score')
				if(friend.score == score){
					friendToSend = friend
				}
			})
		}
		
		if(friendToSend){
			return friendToSend
		}
		
	}
	
	function drawTrajectory() {	
		
		bitmap.context.clearRect(0, 0, game.world.width, game.world.height);
		//bitmap.context.fillStyle = 'rgba(255, 255, 255, 0.75)';
		
		if(isDrawing){
			
			var MARCH_SPEED = 40;
			timeOffset = timeOffset + 1 || 0;
			timeOffset = timeOffset % MARCH_SPEED;

			var correctionFactor = 0.99;

			var theta = -bowmanGroup.rotation;
			var x = 0, y = 0;
			var alpha = 1
			for(var t = 0 +timeOffset/(1000*MARCH_SPEED/60); t < 3; t += 0.02) {

				x = BOW_SPEED * t * Math.cos(theta) * correctionFactor;
				y = BOW_SPEED * t * Math.sin(theta) * correctionFactor - 0.5 *GRAVITY * t * t;
				var circle = bitmap.circle(x +gun.world.x,gun.world.y - y, 3,'rgba(255,255,255,'+alpha+')');
				
				alpha-= bitmap.alphaValue
				if (y < -15) break;
			}
		}
		
		bitmap.dirty = true
		
  }
	
    function restartBarrier(){
        
        barrier.forEach(function(obj){
            obj.alpha = 0
            obj.y = 0
        })
    }
    
    function setBarrier(number){
        
        restartBarrier()
        
        var pivotY = 0
        
        for(var i = 0; i < number;i++){
            
            var barPart = barrierParts[i]
            barPart.y = pivotY
            barPart.alpha = 1
            
            pivotY-= barPart.height
            
        }
        
        barrier.topbar.alpha = 1
        barrier.topbar.y = pivotY
    }
    
	function addCharacter(){
		
		if(bowsNumber == 3){
		
			timerList[timerList.length] = game.time.events.add(350,popArrows)
		}
		
		if(nextLevel){
			nextLevel = false
			timerList[timerList.length] = game.time.events.add(500,restartBowman)
			
		}else{
			timerList[timerList.length] = game.time.events.add(500,restartBowman)
		}
		
		if(bowsNumber <= 1){
			
			checkDialogTween()
		
			bowsGui.text.text =bowsNumber
			/*popObject(bowsGui,10000)

			bowsGui.tween = game.add.tween(bowsGui.scale).to({x:0.9,y:0.9},200,"Linear",true,10300,-1)
			bowsGui.tween.yoyo(true,0)
			
			tweensList[tweensList.length] = bowsGui.tween*/
		}

		usedObjects = []				
		
		var rock = getObject(rocksGroup,'stone')
		rock.reset(pivotObjects,groundPivot)
		rock.revive()
		rock.alpha = 1
		
		Phaser.ArrayUtils.shuffle(charactersGroup.list)
		
		//console.log(charactersGroup.list[0] + ' tag')
		var character = getObject(charactersGroup,charactersGroup.list[0])
		
		if(lastCharacter && lastCharacter == charactersGroup.list[0]){
			
			animKillObj(0,character)
			character = getObject(charactersGroup,charactersGroup.list[1])
		}
		
		lastCharacter = character.tag
		
		character.x = pivotObjects
		character.y = rock.y -rock.height
		character.alpha = 1
		character.alive = true
		character.scale.setTo(GAME_SCALE,GAME_SCALE)
		
		usedObjects = [rock,character]
		
		var fruit = getObject(fruitsGroup,fruitsGroup.list[0])
		
		playerToUse = null
		playerToUse = checkifPlayer()
		
		if(playerToUse){
			
			//console.log(playerToUse.score + ' score')
			fruit.kill()
			fruit = playerToUse
			
		}
		
		if(gameLevel < 2){
			rock.kill()
			character.y = groundPivot
		}else if(gameLevel > 4 && gameLevel < 7){	
			
			setMovingGroup(rock,character,fruit,0,true,game.rnd.integerInRange(1,8) * -15)
		}else if(gameLevel > 6 && gameLevel < 9){
			
			setMovingGroup(rock,character,fruit,1300)
		}else if(gameLevel > 8 && gameLevel < 11){
			
			setMovingGroup(rock,character,fruit,700)
		}else if(gameLevel > 10 && gameLevel < 13){
			
			rock.kill()
			character.y = groundPivot
			
			setBarrier(3)
			activateBarrier(character,true)
		}else if(gameLevel > 12 && gameLevel < 15){
			
            setBarrier(6)
			activateBarrier(rock,true)
		}else if(gameLevel > 14 && gameLevel < 17){
			
			setMovingGroup(rock,character,fruit,900)
			
            setBarrier(6)
			activateBarrier(rock,true)
		}else if(gameLevel > 16){
			
			var speed = 500 - ((gameLevel - 18) * 50)
			
			if(speed < 200){
				speed = 250
			}
			setMovingGroup(rock,character,fruit,speed)
			
            setBarrier(8)
			activateBarrier(rock,true)
		}
		
		Phaser.ArrayUtils.shuffle(fruitsGroup.list)
		
		var chChild = character.children[0]
		
		if(fruit.score){
			
			fruit.x = pivotObjects
			fruit.y = character.y - chChild.height * character.scale.y - fruit.height * 0.5
			fruit.alpha = 1
			fruit.alive = true
			
		}else{
			
			fruit.reset(pivotObjects, character.y - chChild.height * character.scale.y  - fruit.height * 0.5)
			fruit.revive()
			
		}
		
		if(character.tag == 'boy' || character.tag == 'wolf'){
			fruit.y+= 5
		}
		
		/*if(fruit.tag == 'pineapple'){
			fruit.y+= 13
		}
		if(character.tag == 'bunny'){
			fruit.y-= 35
		}*/
		
	}
	
	function activateBarrier(obj,tweened){
		
		barrier.active = true
		barrier.x = obj.x - 150
		barrier.y = obj.y
		barrier.alpha = 1
		//barrier.scale.x = 1
		barrier.grass.alpha = 1
		usedObjects[usedObjects.length] = barrier
		
		/*var maskBar = barrier.maskUsed
		maskBar.x = barrier.x - barrier.width
		maskBar.y = barrier.y - (maskBar.height)
		
		console.log(barrier.y + ' posY,' + maskBar.y + ' posMask')*/
				
		if(tweened){
			
			if(gameLevel > 15){
				topBarrier.alpha = 1
				topBarrier.active = true
				topBarrier.reset(barrier.x, 0)
				tweensList[tweensList.length] = game.add.tween(topBarrier).from({y: topBarrier.height},500,"Linear",true)
			}
			
			var easingList= [Phaser.Easing.Quadratic.Out,Phaser.Easing.Circular.Out,Phaser.Easing.Cubic.Out]
			
			barrier.tween = game.add.tween(barrier).to({y:barrier.y + barrier.height},1000, Phaser.ArrayUtils.getRandomItem(easingList),true,500,-1)
			barrier.tween.yoyo(true,0)
			
			tweensList[tweensList.length] = barrier.tween
		}
	}
	
	function setMovingGroup(rock,character,fruit, timeToUse,staticMove, positionY){
		
		var timeUsed = timeToUse || 1000
				
		usedObjects[usedObjects.length] = elevatorRock
		rock.scale.y = 0.57

		elevatorRock.reset(rock.x,rock.y + rock.height * 0.2)
		elevatorRock.revive()
		elevatorRock.alpha = 1
		//popObject(elevatorRock,200)

		character.y = elevatorRock.y - elevatorRock.height
		movingGroup = [elevatorRock,character,fruit]
		
		if(!staticMove){
			
			var easingList = [Phaser.Easing.Quadratic.In, Phaser.Easing.Exponential.InOut,Phaser.Easing.Circular.Out,Phaser.Easing.Back.InOut,
							 Phaser.Easing.Bounce.InOut]
			movingGroup.timeSpeed = timeUsed
			movingGroup.moving = true
			
			var easingIndex = game.rnd.integerInRange(0,easingList.length - 1)
			if(easingIndex == 3){
				rock.scale.y = 0.617
			}
			timerList[timerList.length] = game.time.events.add(500,function(){

				for(var i = 0; i < movingGroup.length;i++){

					var obj = movingGroup[i]
					obj.pivotUsed = obj.y
					obj.tween = game.add.tween(obj).to({y:obj.y - 125},timeUsed, easingList[easingIndex],true,0,-1)
					obj.tween.yoyo(true,0)
					
					tweensList[tweensList.length] = obj.tween
				}
			})
		}else{
			
			movingGroup.timeSpeed = 0
			movingGroup.moving = false
			for(var i = 0; i < movingGroup.length;i++){
				
				var obj = movingGroup[i]
				obj.y+= positionY
			}
		}
		
	}
	
	function getObject(group,tag){
		
		for(var i = 0; i < group.length;i++){
			
			var obj = group.children[i]
			//console.log(tag + ' ' + obj.tag + ' alive ' + obj.alive)
			if(obj.tag == tag && !obj.alive){
				return obj
			}
		}
	}
	
	function checkifLose(bullet){
		
		restartEmitter()
		
		if(bowsNumber<=0){
			buttonsActive = false
			
			timerList[timerList.length] = game.time.events.add(500,stopGame)
		}
		
		if(bullet && bullet.fruit){

			if(bullet.fruit.score){
				
				playerToUse = null
				bullet.fruit.alpha = 0
				friendsGroup.add(bullet.fruit)
				
				bullet.fruit.scale.x*= GAME_SCALE
				bullet.fruit.scale.y*= GAME_SCALE
			}else{
				
				fruitsGroup.add(bullet.fruit)
				bullet.fruit.scale.setTo(GAME_SCALE,GAME_SCALE)
				bullet.fruit.kill()
			}
			
			bullet.fruit = null
		}else{
			
			if(playerToUse){

				if(playerToUse.score != gameScore){
					
					var fruit = getObject(fruitsGroup,Phaser.ArrayUtils.getRandomItem(fruitsGroup.list))
					fruit.reset(playerToUse.x,playerToUse.y + fruit.height * 0.65)
					if(fruit.tag == 'pineapple'){
						fruit.y-= 30
					}
					
					fruit.revive()
					popObject(fruit,0)
					
					var tween = game.add.tween(playerToUse).to({angle:playerToUse.angle + 360,alpha:0},250,"Linear",true)
					tween.onComplete.add(function(){
						playerToUse.alpha = 0
						playerToUse.x = -100
						playerToUse = null
					})
					tweensList[tweensList.length] = tween
					
					if(movingGroup && movingGroup.moving){
						
						stopAndMove(fruit)
					}
					
				}
				
			}
		}
		
	}
	
	function stopAndMove(fruit){
		
		var character = movingGroup[1]
		fruit.pivotUsed = character.pivotUsed - character.height - fruit.height * 1.03
		
		if(fruit.tag == 'pineapple'){
			fruit.y+= 20
		}
		
		movingGroup[movingGroup.length] = fruit
		movingGroup.forEach(function(obj){
			
			if(obj.tween){
				obj.tween.stop()
				obj.tween = null
			}
			
			if(obj.alive){
				tweensList[tweensList.length] = game.add.tween(obj).to({y:obj.pivotUsed},300,"Linear",true)
			}
		})
				
		timerList[timerList.length] = game.time.events.add(325,function(){
			movingGroup.forEach(function(obj){
				
				if(obj.alpha == 1){
					
					obj.tween = game.add.tween(obj).to({y:obj.y - 125},movingGroup.timeSpeed, Phaser.Easing.Quadratic.In,true,0,-1)
					obj.tween.yoyo(true,0)
					
					tweensList[tweensList.length] = obj.tween
				}
			})
		})
	}
	
	function shootBullet() {
		
		//console.log(bowmanGroup.angle + ' angle')
		tweensList[tweensList.length] = game.add.tween(bowmanGroup).to({angle :0},300,"Linear",true)
		if(bowsGui.alpha == 1){
			tweensList[tweensList] = game.add.tween(bowsGui).to({alpha:0},300,"Linear",true,0)
		}
		
		if(consecutiveArrows>=3){
			sound.play("brightTransition",{volume:0.2})
		}
		
		isDrawing = false
		bowsNumber--
		
		arrowsGui.arrows.children[bowsNumber].alpha = 0
		
		var back = arrowsGui.backGroup
		var tween = game.add.tween(back.scale).to({x:0.95,y:0.9},100,"Linear",true,0,0)
		tween.yoyo(true,0)
		tweensList[tweensList.length] = tween
		
		if(bowsNumber ==1){
			
			bowsGui.text.text = bowsNumber
			
			if(bowsNumber>0){
				
				if(!nextLevel){
					
					popObject(bowsGui,700,"cut",false,true)

					checkDialogTween()

					bowsGui.tween = game.add.tween(bowsGui.scale).to({x:0.9,y:0.9},200,"Linear",true,1000,-1)
					bowsGui.tween.yoyo(true,0)
					tweensList[tweensList.length] = bowsGui.tween
				}
				
			}
			
		}
		
		
		changeImage(1,bowmanBody.expressions)
		gun.alpha = 0
		sound.play("bowShoot")
		
		var tween = game.add.tween(bowmanGroup.scale).to({x:0.8,y:0.9},100,"Linear",true,0,0)
		tween.yoyo(true,0)
		tweensList[tweensList.length] = tween
		
		screenBtn.pressed = false
		buttonsActive = false
		
		if (this.lastBulletShotAt === undefined){
			this.lastBulletShotAt = 0;
		} 
		
		if (this.game.time.now - this.lastBulletShotAt < SHOT_DELAY){
			return;
		} 
		
		this.lastBulletShotAt = this.game.time.now;

		var bullet = bulletPool.getFirstDead();

		if (bullet === null || bullet === undefined){
			return;
		} 

		bullet.revive();
		bullet.active = true
		bullet.fruit = null
		bullet.checkWorldBounds = true;
		bullet.outOfBoundsKill = false;
		bulletToUse = bullet

		bullet.reset(gun.world.x, gun.world.y);
		bullet.rotation = bowmanGroup.rotation;

		bullet.body.velocity.x = Math.cos(bullet.rotation) * BOW_SPEED;
		bullet.body.velocity.y = Math.sin(bullet.rotation) * BOW_SPEED;
	}

	function update() {
		
		if(!gameActive){
			return
		}
		
		drawTrajectory()
		
		clouds.tilePosition.x-= 0.2
		if(screenBtn.pressed){
			
			if(bowmanGroup.angle < - 15){
				
				if(rotationSpeed > 0.5){
					rotationSpeed-=0.07
				}
				
			}
			
			if(bowmanGroup.angle > -82){
				bowmanGroup.angle-= rotationSpeed
			}else{
				shootBullet()
			}
			
		}
		
		checkObjects()
		
	};
	
	function attachBullet(bullet,obj){
		
		stopMovingGroup()
		
		//fruitsGroup.remove(obj)
		obj.x = 0
		obj.y = obj.y - bullet.y
		obj.scale.x = obj.scale.x / GAME_SCALE
		obj.scale.y = obj.scale.y / GAME_SCALE
		bullet.addChild(obj)
		
		bullet.fruit = obj
		bullet.active = false
		
		addPoint(1,bullet)
		nextLevel = true
		bowsNumber = 3
		checkDialogTween()
		tweensList[tweensList.length] = game.add.tween(bowsGui).to({alpha:0},500,"Linear",true)

		timerList[timerList.length] = game.time.events.add(800,restartCharacters)
		buttonsActive = false
		
	}
	
	function addAttachedArrow(bullet){
		
		var bow = leftBowsGroup.getFirstDead()
		bow.revive()
		bow.reset(bullet.x + game.rnd.integerInRange(1,5) * 4, bullet.y)
		bow.alpha = 1
		bow.rotation = bullet.rotation

		usedObjects[usedObjects.length] = bow
		
		return bow
						
	}
	
	function checkObjects(){
		
		this.game.physics.arcade.collide(bulletPool, ground, function(bullet, ground) {
			
			shutRainbow()
			if(!bullet.fruit){
				consecutiveArrows = 0; bonusGroup.alpha = 0; canRainbow = false
			}
			
			checkifLose(bullet)
			createPart('ouch',bullet)
			
			bullet.kill();
			
			sound.play("grass")
			
			restartBowman()
			
		}, null, this);
		
		if(playerToUse){
			
			//playerToUse.maskUsed.x = playerToUse.x 
			//playerToUse.maskUsed.y = playerToUse.y
		}
		
		charactersGroup.forEachAlive(function(character){
			
			if(character.arrows.length > 0){
				
				for(var i = 0; i < character.arrows.length;i++){
					
					var arrow = character.arrows[i]
					arrow.y = character.y - arrow.offY
					
				}
			}
		})
		
		bulletPool.forEachAlive(function(bullet) {
			
			if(consecutiveArrows >= 3 && canRainbow){
				
				if(arrowEmitter){
					arrowEmitter.x = bullet.x
					arrowEmitter.y = bullet.y
				}

				var rainbow = rainbowGroup.getFirstDead()
				if(rainbow){
					activateRainbow(rainbow,bullet)
				}

			}
			
			
			bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
			
			if(bullet.fruit){
			
				/*var fruit = bullet.fruit
				if(fruit.angled){
					fruit.x = bullet.x
				}else{
					fruit.x = bullet.x + fruit.width * 0.5
				}
				
				fruit.y = bullet.y + fruit.offsetY*/
			}			
			
			if(barrier.active){
				
				if(checkOverlap(bullet,barrier) && bullet.body.velocity.x > 0 ){
					
					shutRainbow()
					consecutiveArrows = 0; bonusGroup.alpha = 0; canRainbow = false
					
					checkifLose(bullet)
					createPart('ouch',bullet)
					
					bullet.body.velocity.x = -bullet.body.velocity.x * 0.3
					
					sound.play("barCrash")
					restartBowman()
					
				}
			}
			
			if(topBarrier.active){
				
				if(checkOverlap(bullet,topBarrier) && bullet.body.velocity.x > 0){
					
					shutRainbow()
					consecutiveArrows = 0; bonusGroup.alpha = 0; canRainbow = false
					
					checkifLose(bullet)
					createPart('ouch',bullet)
					bullet.body.velocity.x = -bullet.body.velocity.x * 0.3
					
					sound.play("barCrash")
					restartBowman()
					
				}
			}
			
			charactersGroup.forEachAlive(function(character){
				
				var chChildHeight = character.children[0].height * character.scale.y
				if(checkOverlap(character,bullet) && (Math.abs(character.x - bullet.x) < character.width * 0.4 && character.y - bullet.y < chChildHeight * 0.9)
				   && bullet.active){
					
					shutRainbow()
					consecutiveArrows = 0; bonusGroup.alpha = 0; canRainbow = false
					bullet.active = false
					
					if(!character.tween){
						addAttachedArrow(bullet)
					}else{
						
						var arrow = addAttachedArrow(bullet)
						
						var charObj = character.children[0]
						arrow.offY = character.y - arrow.y 
						
						//console.log(arrow.offY + ' offsetY,' + character.y + ' characterPosY ' + bullet.y + ' bullet Yy')
						character.arrows[character.arrows.length] = arrow
						
					}
					
					checkifLose(bullet)
					createPart('ouch',bullet)
					bullet.kill()
					
					changeImage(0, bowmanBody.expressions)
					changeImage(1,character)
					
					sound.play(character.soundName)
					var tween = game.add.tween(character.scale).to({x:GAME_SCALE * 0.85,y:GAME_SCALE * 0.9},100,"Linear",true,0,0)
					tween.yoyo(true,0)
					tweensList[tweensList.length] = tween
					
					restartBowman()
					
					timerList[timerList.length] = game.time.events.add(200,function(){
						changeImage(0,character)
					})
										
				}
			},this)
			
			rocksGroup.forEachAlive(function(rock){
				if(checkOverlap(bullet,rock) && bullet.body.velocity.x > 0 && bullet.active && Math.abs(bullet.x - rock.x) < rock.width * 0.47){
					shutRainbow()
					bullet.body.velocity.x = -bullet.body.velocity.x * 0.5
					sound.play("rock")
					createPart('rock',bullet)
					changeImage(0, bowmanBody.expressions)
				}
			},this)
			
			fruitsGroup.forEachAlive(function(fruit){
				if(checkOverlap(bullet,fruit) && bullet.active && Math.abs(bullet.x - fruit.x) < fruit.width * 0.6){
					
					attachBullet(bullet,fruit)
					
				}
			},this)
			
			if(playerToUse){
				
				if(checkOverlap(bullet,playerToUse) && bullet.active){
					
					attachBullet(bullet,playerToUse)
				}				
				
			}
			
			if(bullet.x > game.world.width + bullet.width){
				
				//console.log("bullet out")
				shutRainbow()
				if(!bullet.fruit){
					consecutiveArrows = 0; bonusGroup.alpha = 0; canRainbow = false
				}
				
				checkifLose(bullet)
				bullet.kill();

				restartBowman()
			}
		}, this);

	}
	
	function activateRainbow(rainbow,bullet){
		
		if(rainbowActive){
			
			rainbowActive = false
			
			rainbow.reset(bullet.x, bullet.y)
			rainbow.revive()
			rainbow.angle = bullet.angle
			
			timerList[timerList.length] = game.time.events.add(20,function(){
				rainbowActive = true
			})
		}
		
	}
	
	function stopMovingGroup(){
		
		if(movingGroup && movingGroup.moving){
			for(var i = 0; i < movingGroup.length;i++){

				var obj = movingGroup[i]
				if(obj.tween){
					//console.log(obj.tag + ' tag')
					game.tweens.remove(obj.tween)
					obj.tween = null
				}
				
			}
			movingGroup.moving = false
			movingGroup = null
		}
		
	}
	
	function animKillObj(delay,obj){
		
		timerList[timerList.length] = game.time.events.add(delay,function(){
			
			if(obj.arrow){
				obj.arrow = []
			}
			obj.alive = false
			obj.alpha = 0
            if(!obj.maskUsed){
                obj.scale.setTo(GAME_SCALE,GAME_SCALE)
            }
			
		})
		
	}
	
	function restartCharacters(){
		
		if(barrier.active){
			
			barrier.active = false
			
			if(barrier.tween){
				barrier.tween.stop()
				barrier.tween = null
			}
		}
		
		var delay = 0
		for(var i = 0; i < usedObjects.length;i++){
			
			var obj = usedObjects[i]
			animKillObj(700,obj)
			delay+=0
		}
		
		sound.play("windBlow")
		
		var wTween = game.add.tween(worldGroup).to({x:-game.world.width * 0.15},1000,"Linear",true)
		tweensList[tweensList.length] = wTween
		wTween.onComplete.add(function(){
			
			worldGroup.x = game.world.width * 0.1
			tweensList[tweensList.length] = game.add.tween(worldGroup).to({x:0},500,"Linear",true,200)
		})
		
		transitionObject.x = game.world.width
		tweensList[tweensList.length] = game.add.tween(transitionObject).to({x:0-transitionObject.width},2000,"Linear",true)
		
		delay+= 900
		timerList[timerList.length] = game.time.events.add(delay,function(){
			barrier.grass.alpha = 0
			addCharacter()
		})
		
	}
	
	function popArrows(){
		
		if(gameScore > 0){
			
			var delay = 0
			arrowsGui.arrows.forEach(function(arrow){
				popObject(arrow,delay,"cut",true,true)
				delay+=55
			})
			return
		}
		
		var delay = 100
		
		popObject(arrowsGui.backGroup,0)
				
		for(var i = 0; i < arrowsGui.arrows.length;i++){
			
			var arrow = arrowsGui.arrows.children[i]
			arrow.angle = 0
			popObject(arrow,delay,"cut",true,true)
			
			delay+= 35
		}
		
		if(bonusGroup.alpha == 1){
			popObject(bonusGroup,delay)
		}
	}
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    tweensList[tweensList.length] = game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })
				
				tweensList[tweensList.length] = tweenScale

                offsetY = 100
            }
            
			tweensList[tweensList.length] = game.add.tween(pointsText.scale).from({x:1.2,y:1.2},500,"Linear",true)
            tweensList[tweensList.length] = game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            tweensList[tweensList.length] = game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    
    function addPoint(number,obj){
        
		consecutiveArrows++
		
		var numToUse = 1
		if(consecutiveArrows >= 3){
			
			if(consecutiveArrows == 3){
				timerList[timerList.length] = game.time.events.add(700,function(){
					canRainbow = true
				})
			}
			
			numToUse = consecutiveArrows - 2
			
			if(numToUse >= 20){
				numToUse = 20
			}
			
			bonusGroup.text.text = 'x' + (numToUse + 1)		
			number*= numToUse
			
			var pitch = numToUse -1
			pitch-= 0.5
			sound.play("combo",{pitch:(numToUse-1)})
			
			if(bonusGroup.alpha == 0){
				showMedal(consecutiveArrows)
			}else{
				
				bonusGroup.angle = 0
				bonusGroup.scale.setTo(1,1)
				
				tweensList[tweensList.length] = game.add.tween(bonusGroup).to({angle:bonusGroup.angle + 360},250,"Linear",true)
				var tween = game.add.tween(bonusGroup.scale).to({x:1.2,y:1.2},250,"Linear",true,0,0)
				tween.yoyo(true,0)
				
				tweensList[tweensList.length] =  tween
				
				createPart('star',bonusGroup.children[0])
				
			}
			
		}
		
		bitmap.alphaValue+=0.015
		
		createPart('star',obj)
		sound.play("magic")
		
		
		createTextPart('+' + number,obj)
		gameScore+= number
		gameLevel++
		
		gamee.updateScore(gameScore)
		
		if(friendAheadGroup.friend && gameScore > friendAheadGroup.friend.score){
			
			tweensList[tweensList] = game.add.tween(friendAheadGroup.friend).to({alpha:0},100,"Linear",true)
			var tween = game.add.tween(friendAheadGroup).to({angle:friendAheadGroup.angle -180},300,"Linear",true)
			tween.onComplete.add(function(){
				
				friendAheadGroup.alpha = 0
				friendAheadGroup.x = game.world.width
				friendAheadGroup.friend = null
				
				timerList[timerList.length] = game.time.events.add(1000,startFriendsAhead)
			})
			
			tweensList[tweensList.length] = tween
		}
        
    }
    
	function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.game','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "28px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.15
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
		
		pointsText.anchor.setTo(1,0)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function stopGame(win){
        
		//tweenTint(sky,0xAAD18B,0x00259e,1000)
		tweensList[tweensList.lenght] = game.add.tween(sky).to({alpha:0},1000,"Linear",true)
		tweensList[tweensList.lenght] = game.add.tween(focusFrame).to({alpha:0.2},1000,"Linear",true)
		
		stopMovingGroup()
		checkDialogTween()
		
		sound.play("gameLose")
		
        gameActive = false
        //medievalSong.stop()
		sound.stop("medievalSong")
		
		changeImage(0,bowmanBody.expressions)
		        		
		var endTween = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweensList[tweensList.length] = endTween
		endTween.onComplete.add(function(){
            
			if(gameScore > lastScore){
				lastScore = gameScore
			}
			
			gamee.gameOver()
			$("#success").trigger("click");
			console.log("gameover")
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
		game.load.bitmapFont('roundsBlack','images/game/font/roundsBlack.png','images/game/font/roundsBlack.fnt');
		
		//game.load.audio('medievalSong', soundsPath + 'songs/fantasy_ballad.mp3');
		
		//social.socialRequest()
		
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }
	
	function tweenTint(obj, startColor, endColor, time) {  
		
		var colorBlend = {step: 0};    
		var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        
  
		colorTween.onUpdateCallback(function() {      
			obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
		});        
		obj.tint = startColor;            
		colorTween.start();
	}
	
    function createMountains(){
        
        var pivotX = - 275
        var pivotY = game.world.height - 50
        var mountainIndex
        
        var mountainsAhead = game.add.group()
        sceneGroup.add(mountainsAhead)
        
        var mountainsBack = game.add.group()
        sceneGroup.add(mountainsBack)
        
        var ahead = true
        
        while(pivotX < game.world.width + 400){
            
            ahead = !ahead
            
            var mountain 
            if(ahead){
                mountain = mountainsAhead.create(pivotX, pivotY,'atlas.game','mountain0')
            }else{
                mountain = mountainsBack.create(pivotX, pivotY,'atlas.game','mountain1')
            }
            
            mountain.anchor.setTo(0.5,1)
            pivotX+=450
            
        }

    }
    
	function createBackground(){
		
		var sky1 = new Phaser.Graphics(game)
        sky1.beginFill(0x4a476b)
        sky1.drawRect(-game.world.width * 0.5,0,game.world.width *2, game.world.height *2)
        sky1.endFill()
		sceneGroup.add(sky1)
		
		sky = new Phaser.Graphics(game)
        sky.beginFill(0xAAD18B)
        sky.drawRect(-game.world.width * 0.5,0,game.world.width *2, game.world.height *2)
        sky.endFill()
		sceneGroup.add(sky)
		
		clouds = game.add.tileSprite(0,35,game.world.width,261,'atlas.game','cloud')
		sceneGroup.add(clouds)
		
		ground = this.game.add.group();
		sceneGroup.add(ground)
		
		for(var x = 0; x < this.game.width * 4; x += 32) {

			var groundBlock = this.game.add.sprite(x, this.game.height - 200,'atlas.game','mushroom');
			groundBlock.alpha = 0
			this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
			groundBlock.body.immovable = true;
			groundBlock.body.allowGravity = false;
			ground.add(groundBlock);
		}

		this.game.input.activePointer.x = this.game.width/2;
		this.game.input.activePointer.y = this.game.height/2 - 100;
        
        createMountains()
				
		/*treesGroup = game.add.group()
		//treesGroup.alpha = 0
		worldGroup.add(treesGroup)
		
		var index = 0
		for(var pivotX = 100; pivotX < game.world.width;){
			
			if(index >3){
				index = 0
			}
			var tree = treesGroup.create(pivotX,game.world.height - 300,'atlas.game','tree_' + index)
			tree.anchor.setTo(0.5,1)
			
			var tween = game.add.tween(tree.scale).to({x:0.9},game.rnd.integerInRange(600,900),"Linear",true,game.rnd.integerInRange(300,600),-1)
			tween.yoyo(true,0)
			
			pivotX+= tree.width * 0.8
			
			index++
		}*/
		
		worldGroup = game.add.group()
		sceneGroup.add(worldGroup)
		
		mountainsGroup = game.add.group()
		//mountainsGroup.alpha = 0
		worldGroup.add(mountainsGroup)
		
		var index = 0
		var x = -100
		while(x<game.world.width * 1.5){
			
			var group = game.add.group()
			group.x = x
			group.y = game.world.height -250
			mountainsGroup.add(group)
			
			var mountain = group.create(0,0,'atlas.game','hill_' + index)
			mountain.anchor.setTo(0,1)
			
			var startX = mountain.width * 0.3
			for(var i = 0; i < 2;i++){
				
				var posX = game.rnd.integerInRange(startX,startX + 0.1)
				var posY = game.rnd.integerInRange(mountain.height * 0.4, mountain.height * 0.85)

				var mushroom = group.create(posX, -posY, 'atlas.game','mushroom')
				mushroom.anchor.setTo(0.5,1)

				var scaleToUse = game.rnd.integerInRange(5,10) * 0.1
				mushroom.scale.setTo(scaleToUse,scaleToUse)
				
				startX+= mountain.width * 0.4
			}
			
			/*var tween = game.add.tween(group.scale).to({x:0.97,y:0.9},game.rnd.integerInRange(300,800),"Linear",true,game.rnd.integerInRange(300,700),-1)
			tween.yoyo(true,0)*/
			
			/*var scaleToUse = game.rnd.integerInRange(7,8) * 0.2
			mountain.scale.setTo(scaleToUse,scaleToUse)
			console.log(scaleToUse + ' scale')*/
			
			if(index == 0){
				index = 1
			}else{
				index = 0
			}
			x+= mountain.width * 0.75
		}
		
		elevatorRock = worldGroup.create(0,0,'atlas.game','stone_platform')
		elevatorRock.anchor.setTo(0.5,1)
		elevatorRock.scale.setTo(GAME_SCALE,GAME_SCALE)
		elevatorRock.kill()
		
		var groundBack = new Phaser.Graphics(game)
        groundBack.beginFill(0x7D516C)
        groundBack.drawRect(0,game.world.height - 180,game.world.width *1.5, 180)
        groundBack.endFill()
		worldGroup.add(groundBack)
				
		var grass = game.add.tileSprite(0,game.world.height -groundBack.height * 0.7,game.world.width * 1.5,160,'atlas.game','grass')
		grass.anchor.setTo(0,1)
		worldGroup.add(grass)
		//console.log('grass')
		
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
	
	function createTextPart(text,obj){
        
       var pointsText = lookParticle('text')
        
       if(pointsText){
            
           pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.text = text
            pointsText.scale.setTo(1,1)

           tweensList[tweensList.length] = game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
           tweensList[tweensList.length] = game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

           deactivateParticle(pointsText,750)
        }
        
   }
    
   function lookParticle(key){
        
       for(var i = 0;i<particlesGroup.length;i++){
            
           var particle = particlesGroup.children[i]
            //console.log(particle.tag + ' tag,' + particle.used)
            if(particle.tag == key){
                
                particle.used = true
                particle.alpha = 1
                
                if(key == 'text'){
                    particlesGroup.remove(particle)
                    particlesUsed.add(particle)
                }
                
                
                //console.log(particle)
                
               return particle
                break
            }
        }
        
   }
    
   function deactivateParticle(obj,delay){
        
       timerList[timerList.length] = game.time.events.add(delay,function(){
            
           obj.used = false
            
           particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
       },this)
    }
    
   function createPart(key,obj,offsetX){
        
       var offX = offsetX || 0
        var particle = lookParticle(key)
        
       if(particle){
            
			particle.x = obj.world.x + offX
			particle.y = obj.world.y
			particle.scale.setTo(1,1)
			particle.start(true, 1500, null, 6);+
			particle.setAlpha(1,0,2000,Phaser.Easing.Cubic.In)
       }
        
       
   }
    
   function createParticles(tag,number){
                
       for(var i = 0; i < number;i++){
            
           var particle
            if(tag == 'text'){
                
               	var particle = game.add.bitmapText(0,0, 'roundsBlack', '0', 50);
            	particle.anchor.setTo(0.5,0.5)
				particlesGroup.add(particle)
                
           }else{
                var particle = game.add.emitter(0, 0, 100);

                particle.makeParticles('atlas.game',tag);
                particle.minParticleSpeed.setTo(-400, -200);
                particle.maxParticleSpeed.setTo(200, -400);
                particle.minParticleScale = 0.6;
                particle.maxParticleScale = 1.5;
                particle.gravity = 0;
                particle.angularDrag = 30;
                
                particlesGroup.add(particle)
                
           }
            
           particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
       
   }
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',1)
		createParticles('wrong',1)
		createParticles('rock',1)
		createParticles('ouch',1)
		createParticles('text',5)
	}
	
	function inputButton(obj){
		
		if(!gameActive || !buttonsActive || obj.pressed){
			return
		}		
		
		if(gameLevel < 8){
			isDrawing = true
		}
		
		focusFrame.tween = game.add.tween(focusFrame).to({alpha:0.6},300,"Linear",true)
		tweensList[tweensList.length] = focusFrame.tween
		
		changeImage(4,bowmanBody.expressions)
		sound.play("bowPull")
		obj.pressed = true
	}
	
	function restartBowman(){		
			
		if(nextLevel){
			return
		}
		
		var bTween = game.add.tween(bowmanGroup).to({angle:bowmanGroup.startAngle},300,"Linear",true)
		tweensList[tweensList.length] = bTween
		bTween.onComplete.add(function(){
			
			if(bowsNumber>0){
				changeImage(3,bowmanBody.expressions)
				gun.angle = 0
				popObject(gun,0,"cut",true)
			}
			
			timerList[timerList.length] = game.time.events.add(300,function(){
				buttonsActive = true
			})
			
		})
	}
	
	function outputButton(obj){
		
		if(!gameActive){
			return
		}
		
		bitmap.context.clearRect(0, 0, game.world.width, game.world.height);
		bitmap.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
		
		if(focusFrame.tween){
			focusFrame.tween.stop()
		}
		
		focusFrame.alpha = 0
		rotationSpeed = MAX_ROTATION
				
		if(obj.pressed){
			shootBullet()
			obj.pressed = false
		}
		
	}
	
	function createBowman(){
		
		bowmanBody = game.add.group()
		bowmanBody.x = game.world.centerX - 225
		bowmanBody.y = groundPivot - (48 * GAME_SCALE)
		worldGroup.add(bowmanBody)
		
		bowmanBody.scale.setTo(GAME_SCALE,GAME_SCALE)
		
		var bowmanLegs = bowmanBody.create(-7,-17,'atlas.game','bowman_legs')
		bowmanLegs.anchor.setTo(0.5,0)
			
		bowmanGroup = game.add.group()
		bowmanGroup.x = -6
		bowmanGroup.angle = -15
		bowmanGroup.startAngle = 15
		bowmanBody.add(bowmanGroup)
		
		var group = game.add.group()
		bowmanGroup.add(group)
		
		var expressionsList = ['sad','shoot','shoot_surprise','surprise','aim']
		
		for(var i = 0; i < expressionsList.length;i++){
			
			var bowman = group.create(5,20,'atlas.game','bowman_body_' + expressionsList[i])
			bowman.anchor.setTo(0.5,1)
		}
		
		changeImage(3,group)
		bowmanBody.expressions = group
		
		gun = this.game.add.sprite(35, -20, 'atlas.game','arrow');
		gun.anchor.setTo(0.5, 0.5);
		gun.alpha = 0
		bowmanGroup.add(gun)
		
		var pivot = bowmanGroup.create(0,0,'atlas.game','star')
		pivot.alpha = 0
		pivot.anchor.setTo(0.5,0.5)
		
		/*var dottedLine = bowmanGroup.create(gun.x + 50,gun.y - 7,'atlas.game','dotedLine')
		dottedLine.anchor.setTo(0,0.5)
		dottedLine.alpha = 0
		dottedLine.angle = 12
		
		bowmanBody.line = dottedLine*/
		
	}
	
	function createBows(){
		
		bowsGui = game.add.group()
		bowsGui.x = bowmanBody.x + 75
		bowsGui.y = bowmanBody.y - 200
		bowsGui.alpha = 0
		worldGroup.add(bowsGui)
		
		var group = game.add.group()
		group.scale.setTo(1.5,1.5)
		bowsGui.add(group)
		
		var dialogShots = group.create(0,0,'atlas.game','shots_left')
		dialogShots.anchor.setTo(0.5,0.5)
		
		var particle = game.add.bitmapText(-5,-25, 'roundsBlack', 'x', 15);
		particle.tint = 0xad2f17
		particle.anchor.setTo(0.5,0.5)
		group.add(particle)
		
		var particle = game.add.bitmapText(5,-25, 'roundsBlack', '0', 25);
		particle.tint = 0xad2f17
		particle.anchor.setTo(0,0.5)
		group.add(particle)
		
		bowsGui.text = particle
		
		bulletPool = this.game.add.group();
		sceneGroup.add(bulletPool)
		
		leftBowsGroup = game.add.group()
		worldGroup.add(leftBowsGroup)

		for(var i = 0; i < NUMBER_OF_BOWS; i++) {

			var bullet = bulletPool.create(0, 0,'atlas.game','arrow');
			bullet.scale.setTo(GAME_SCALE,GAME_SCALE)

			bullet.anchor.setTo(1, 0.5);
			this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
			bullet.kill();
			
			var leftBow = leftBowsGroup.create(0,0,'atlas.game','arrow')
			leftBow.scale.setTo(bullet.scale.x, bullet.scale.x)
			leftBow.anchor.setTo(1,0.5)
			leftBow.kill()
			
		}
	}
	
	function createScreenButton(){
		
		screenBtn = new Phaser.Graphics(game)
        screenBtn.beginFill(0x000000)
        screenBtn.drawRect(0,0,game.world.width *2, game.world.height *2)
        screenBtn.alpha = 0
        screenBtn.endFill()
		screenBtn.pressed = false
        screenBtn.inputEnabled = true
        screenBtn.events.onInputDown.add(inputButton)
		screenBtn.events.onInputUp.add(outputButton)
		sceneGroup.add(screenBtn)
		
	}
	
	function createCharacters(){
		
		var charactersList = ['rabbit','boy','redridinghood','wolf']
		var soundList = ['bunny','growl','grunt','scream']
		
		charactersGroup = game.add.group()
		worldGroup.add(charactersGroup)
		
		charactersGroup.list = charactersList
		
		for(var i = 0; i < charactersList.length;i++){
			
			var chGroup = game.add.group()
			chGroup.alpha = 0
			chGroup.alive = false
			chGroup.arrows = []
			chGroup.scale.setTo(GAME_SCALE,GAME_SCALE)
			charactersGroup.add(chGroup)
			
			for(var u = 0; u < 2;u++){
				
				var character = chGroup.create(0,0,'atlas.game',charactersList[i] + '_' + u)
				character.anchor.setTo(0.5,1)	
				
				if(i==0){
					character.x+=23
				}
			}
			
			chGroup.tag =  charactersList[i]
			chGroup.soundName = soundList[i]
			
			changeImage(0,chGroup)						
		}
	}
	
    function createBarrierParts(){
        
        barrierParts = []
        
        for(var i = 0; i < 8;i++){
            
            var barPart = barrier.create(0,0,'atlas.game','barrier_part')
            barPart.anchor.setTo(0.5,1)
            
            barrierParts.push(barPart)
            
        }
        
        var topbar = barrier.create(0,0,'atlas.game','top')
        topbar.anchor.setTo(0.5,1)
        topbar.scale.setTo(0.9,0.9)
        topbar.isTop = true
        topbar.alpha = 0
        
        barrier.topbar = topbar
        
    }
    
	function createRocks(){
		
		var rockList = ['stone']
		
		rocksGroup = game.add.group()
		worldGroup.add(rocksGroup)
		
		for(var i = 0; i < rockList.length;i++){
			
			var rock = rocksGroup.create(0,0,'atlas.game',rockList[i])
			rock.scale.setTo(GAME_SCALE,GAME_SCALE)
			rock.anchor.setTo(0.5,1)
			rock.tag = rockList[i]
			
			rock.kill()
		}
		
		barrier = game.add.group()
        barrier.alpha = 0
		barrier.active = false
        worldGroup.add(barrier)
        
        createBarrierParts()
		
		var maskBarrier = game.add.graphics(0,0)
		maskBarrier.beginFill(0xffffff)
		maskBarrier.drawRect(0,0,200,500)
		maskBarrier.endFill()
		maskBarrier.alpha = 0.5
		maskBarrier.x = pivotObjects - 200
		maskBarrier.y = groundPivot - maskBarrier.height
		worldGroup.add(maskBarrier)
		
		barrier.mask = maskBarrier
		barrier.maskUsed = maskBarrier
		
		var grassSmall = worldGroup.create(pivotObjects - 150,groundPivot + 2,'atlas.game','grass_small')
		grassSmall.anchor.setTo(0.5,1)
		grassSmall.scale.setTo(1.2,0.7)
		grassSmall.alpha = 0
		barrier.grass = grassSmall
		
		topBarrier = worldGroup.create(0,0,'atlas.game','barrier')
		topBarrier.anchor.setTo(0.5,1)
		topBarrier.scale.y = -1.6
		topBarrier.scale.setTo(1.2,-1.6)
		topBarrier.alpha = 0
		topBarrier.active = false
	}
	
	function createFruits(){
		
		var fruitList = ['burger','apple','pineapple']
		
		fruitsGroup = game.add.group()
		worldGroup.add(fruitsGroup)
		
		fruitsGroup.list = fruitList
		
		for(var i = 0; i < fruitList.length;i++){
			
			for(var u = 0; u < 2; u++){
				
				var fruit = fruitsGroup.create(0,0,'atlas.game',fruitList[i]) 
				fruit.scale.setTo(GAME_SCALE,GAME_SCALE)
				fruit.origScale = GAME_SCALE
				fruit.anchor.setTo(0.5,0.5)
				fruit.tag = fruitList[i]
				fruit.kill()
			}
			
		}
	}
	
	function gameeActions(){
		
		gamee.emitter.addEventListener("pause", function(event) {
			
			game.paused = true
			event.detail.callback();
		}); 

		gamee.emitter.addEventListener("resume", function(event) {
			
            if(unmuteSong){
                sound.play("medievalSong",{loop:true,volume:0.5})
                unmuteSong = false
            }
            
			game.paused = false
			event.detail.callback();
		});

		gamee.emitter.addEventListener("mute", function(event) {
			
            sound.stop("medievalSong")
            sound.setSound(false)
            
			game.sound.mute = true
		   	event.detail.callback();
		});

		gamee.emitter.addEventListener("unmute", function(event) {
            
            sound.setSound(true)
            unmuteSong = true
            
			game.sound.mute = false
		   	event.detail.callback();
		});
		
		gamee.emitter.addEventListener("start", function(event) {
						
			game.paused = false
			
			show()
			event.detail.callback();
			
		}); 
		
	}
	
	function restartAssets(){
		
		sky.alpha = 1
		focusFrame.alpha = 0
		
		friendAheadGroup.x = game.world.width
		friendAheadGroup.alpha = 0
		friendAheadGroup.friend = null
		
		bonusGroup.alpha = 0
		worldGroup.x = 0
		transitionObject.x = game.world.width
		
		particlesUsed.forEach(function(particle){
			particlesUsed.remove(particle)
			particlesGroup.add(particle)
			particle.alpha = 0
		})
		
		guiFriends.forEach(function(friend){
			friend.x = -200
			friend.alpha = 0
			friend.score = 0
		})
		
		bowsGui.alpha = 0
		
		barrier.active = false
		barrier.alpha = 0
		barrier.scale.y = 1
		barrier.grass.alpha = 0
		
		topBarrier.active = false
		topBarrier.alpha = 0
		topBarrier.scale.y = -1.6
		
		fruitsGroup.forEachAlive(function(fruit){
			fruit.kill()
		},this)
		
		friendsGroup.forEach(function(friend){
			
			friend.alpha = 0
			friend.active = false
			friend.score = 0
			if(friend.friend){
				friend.friend.destroy()
			}
			
		},this)
		
		rocksGroup.forEachAlive(function(rock){
			rock.kill()				
		},this)
		
		charactersGroup.forEachAlive(function(character){
			character.arrows = []
			character.alive = false
			character.alpha = 0
			character.scale.setTo(1,1)
		},this)
		
		leftBowsGroup.forEachAlive(function(bow){
			bow.offsetY = null
			bow.kill()
		},this)
		
		elevatorRock.kill()
		//medievalSong.loopFull(0.4)
		sound.play("medievalSong",{loop:true,volume:0.5})
		
		changeImage(3,bowmanBody.expressions)
		gun.alpha = 0
		
		if(usedObjects){
			for(var i = 0; i < usedObjects.length;i++){
				animKillObj(0,usedObjects[i])
			}
		}
		
		rainbowGroup.forEachAlive(function(rainbow){
			rainbow.kill()
		})
		
		bulletPool.forEachAlive(function(arrow){
			arrow.kill()
		})
		
	}
	
	function show(){
		
		cancelTweens()
		restartAssets()
		sceneloader.socialRequest(createFriendsImages,game)
		initialize()
		animateScene()
		
	}
	
	function cancelTweens(){
			
		tweensList.forEach(function(tweenUsed){
			if(tweenUsed){
				game.tweens.remove(tweenUsed)
			}
		})
		
		timerList.forEach(function(timerUsed){
			game.time.events.remove(timerUsed)
		})
		
		tweensList = []
		timerList = []
	}
	
	function createFriendsImages(){
		
		//console.log('creating social images')
		
		socialList = sceneloader.getSocialInfo()
		var initScore = 1
		
		var listGroups = [friendsGroup,guiFriends]
		
		for(var i = 0; i < socialList.length;i++){
			
			if(friendsGroup.length == i){
				break
			}
			
			for(var u = 0; u < listGroups.length;u++){
				
				var group = listGroups[u].children[i]
				group.alpha = 0
				group.active = true
				group.score = socialList[i].highScore
				//group.score = initScore + i * 3
				
				//if(u==0){console.log(socialList[i].name + ' - ' + group.score.toFixed())}
				

				var name = socialList[i].name
				if(game.cache.checkImageKey(name)){

					var friend = group.create(0,0,socialList[i].name)
					friend.width = (friend.width * 90)/ friend.height
					friend.height = 90
					friend.anchor.setTo(0.5,0.5)

					group.friend = friend			
					friend.mask = group.maskUsed
				}

				group.remove(group.bubble)
				group.add(group.bubble)
			}

		}
		
		startFriendsAhead()
	}
	
	function startFriendsAhead(){
		
        //console.log("started ahead")
		
		var friend = getFriendFromList(guiFriends)
		
		//console.log(friend.score + ' score ' + gameScore + ' gameScore')
		if(!friend || friend.score < gameScore){
			return
		}
		
		friendAheadGroup.friend = friend
		
		if(!friend.score){
			return
		}
		
		var scoreUsing = friend.score.toFixed()
        if(friendAheadGroup.tween){
            friendAheadGroup.tween.stop()
            friendAheadGroup.scale.setTo(1,1)
        }
        
        friendAheadGroup.angle = 0
        
        sound.play("cut")
        
        friendAheadGroup.alpha = 1
        var tween = game.add.tween(friendAheadGroup.scale).from({y:0},250,"Linear",true)
        
        friendAheadGroup.tween = tween
		friendAheadGroup.scoreText.text = scoreUsing
        
        tweensList.push(tween)
		
		friend.x = friendAheadGroup.x - 100
		friend.y = 153
		
        if(friend.tween){
            friend.tween.stop()
            friend.scale.setTo(0.8,0.8)
        }
        
        friend.angle = 0
        friend.alpha = 1
        var tween = game.add.tween(friend.scale).from({x:0},250,"Linear",true)
        friend.tween = tween
        
        tweensList.push(tween)
		
	}
	
	function createFocus(){
		
		focusFrame = new Phaser.Graphics(game)
        focusFrame.beginFill(0x000000)
        focusFrame.drawRect(0,0,game.world.width *2, game.world.height *2)
        focusFrame.alpha = 0
        focusFrame.endFill()
		worldGroup.add(focusFrame)
	}
	
	function createArrowsGUI(){
		
		arrowsGui = game.add.group()
		arrowsGui.y = 75
		sceneGroup.add(arrowsGui)
		
		var stick = arrowsGui.create(0,0,'atlas.game','wood')
		stick.anchor.setTo(0,0.5)
		
		var arrowsBack = game.add.group()
		arrowsBack.alpha = 0
		arrowsBack.x = 30
		arrowsBack.y = 5
		arrowsGui.add(arrowsBack)
		
		var back = arrowsBack.create(0,0,'atlas.game','arrows_back')
		
		var arrowsGroup = game.add.group()
		arrowsBack.add(arrowsGroup)
		
		arrowsGroup.y = 125
		var pivotX = 52
		for(var i = 0; i < 3;i++){
			
			var arrow = arrowsGroup.create(pivotX,0,'atlas.game','arrow_gui')
			arrow.alpha = 0
			arrow.anchor.setTo(0.5,0.5)
			
			pivotX+= arrow.width * 0.6
			
		}	
		
		arrowsGui.backGroup = arrowsBack
		arrowsGui.arrows = arrowsGroup
	}
	
	function createFriendsGroup(){
		
		friendsGroup = game.add.group()
		worldGroup.add(friendsGroup)
		
		guiFriends = game.add.group()
		sceneGroup.add(guiFriends)
		
		var indexFrame = 0
		
		for(var i = 0; i < 15;i++){
						
			friendsGroup.add(createFriend(indexFrame))
			guiFriends.add(createFriend(indexFrame,true))

			indexFrame++
			
			if(indexFrame == 4){
				indexFrame = 0
			}
			
		}
	}
	
	function createFriend(indexFrame,isGui){
		
		var frameColors = [0x05C6C1  , 0xED1E79 , 0xF15A24 , 0xD9E021]
		
		var group = game.add.group()
		group.x = 0
		group.y = 0
		group.alpha = 0
		group.active = false
		group.friend = null

		var mask = game.add.graphics(0,0)
		mask.beginFill(0xffffff)
		mask.drawCircle(0,0,90)
		mask.alpha = 0
		mask.endFill()
		if(isGui){
			group.scale.setTo(0.85,0.85)
			group.origScale = group.scale.x
			
			mask.scale.setTo(group.scale.x,group.scale.y)
			group.add(mask)
		}else{
			group.add(mask)
		}
		

		group.maskUsed = mask

		var avatar = group.create(0,0,'atlas.game','avatar')
		avatar.anchor.setTo(0.5,0.5)

		avatar.mask = mask
		group.avatar = avatar

		var bubble = group.create(0,0,'atlas.game','social_frame')
		bubble.tint = frameColors[indexFrame]
		bubble.anchor.setTo(0.5,0.5)
		group.bubble = bubble
		
		return group
	}
	
	function createTrajectory(){
		
		bitmap = game.add.bitmapData(game.world.width, game.world.height);
		bitmap.context.fillStyle = 'rgb(255, 255, 255)';
		bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
		game.add.image(0, 0, bitmap);
		
		
	}
	
	function createTransitionObject(){
		
		transitionObject = sceneGroup.create(game.world.width,game.world.height + 150,'atlas.game','mount')
		transitionObject.anchor.setTo(0,1)
		transitionObject.width = game.world.width * 1.7
		transitionObject.height = game.world.height * 1.2
	}
	
	function createEmitter(){
		
		arrowEmitter = game.add.emitter(game.world.centerX, 500, 12);
		arrowEmitter.x = -200

		arrowEmitter.makeParticles('atlas.game','arrow_star');

		//arrowEmitter.setXSpeed(0, 0);
		//arrowEmitter.setYSpeed(0, 0);
		
		var arrowTime = 500
		
		arrowEmitter.setRotation(0, 0);
		arrowEmitter.setAlpha(1, 0, arrowTime);
		arrowEmitter.setScale(0.4, 1.25, 0.4, 1.25, arrowTime, Phaser.Easing.Quintic.Out);
		arrowEmitter.gravity = -980;

		arrowEmitter.start(false, arrowTime, 30);
		
		var frameColors = [0xff0000  , 0xfcff00 , 0x18ff00 , 0x00aeff, 0xffffff, 0xff7e00]
		var index = 0
		arrowEmitter.forEach(function(particle) {
			
			particle.tint = frameColors[index];
			index++
			
			if(index == frameColors.length){
				index = 0
			}
		})
		//arrowEmitter.angle = 90

		//arrowEmitter.emitX = 64;
		//arrowEmitter.emitY = 500;	
		
		worldGroup.add(arrowEmitter)
		
	}
	
	function createRainbowImages(){
		
		rainbowGroup = game.add.group()
		worldGroup.add(rainbowGroup)
		
		for(var i = 0; i < 60;i++){
			
			var rainbow = rainbowGroup.create(0,0,'atlas.game','rainbow')
			rainbow.anchor.setTo(0.5,0.5)
			rainbow.kill()
			
		}
	}
	
	function showMedal(){
		
		bonusGroup.angle = 0
		bonusGroup.scale.setTo(1,1)
		bonusGroup.alpha = 1
		tweensList[tweensList.length] = game.add.tween(bonusGroup.scale).from({y:0},300,"Linear",true)
	}
	
	function shutRainbow(){
		
		tweensList[tweensList.length] = game.add.tween(rainbowGroup).to({alpha:0},300,"Linear",true).onComplete.add(function(){
			rainbowGroup.alpha = 1
			rainbowGroup.forEachAlive(function(rainbow){
				rainbow.kill()
			},this)
		})
		
	}
	
	function createBonusGroup(){
		
		bonusGroup = game.add.group()
		bonusGroup.origScale = 1
		bonusGroup.alpha = 0
		bonusGroup.x = 118
		bonusGroup.y = arrowsGui.y + 240
		sceneGroup.add(bonusGroup)
		
		var medal = bonusGroup.create(0,0,'atlas.game','bonusThing')
		medal.anchor.setTo(0.5,0.5)
		
		var particle = game.add.bitmapText(0,0, 'roundsBlack', 'bonus', 25);
		particle.anchor.setTo(0.5,0.5)
		bonusGroup.add(particle)
		
		var particle = game.add.bitmapText(0,35, 'roundsBlack', 'x2', 40);
		particle.anchor.setTo(0.5,0.5)
		bonusGroup.add(particle)
		
		bonusGroup.text = particle
		
	}
	
	function createFriendAheadGroup(){
		
		friendAheadGroup = game.add.group()
		friendAheadGroup.alpha = 0
		friendAheadGroup.friend = null
		sceneGroup.add(friendAheadGroup)
		
		friendAheadGroup.x = game.world.width
		friendAheadGroup.y = 50
		
		var stick = friendAheadGroup.create(0,0,'atlas.game','wood')
		stick.anchor.setTo(0,0.5)
		stick.scale.x= -1
		
		var backgroup = game.add.group()
		backgroup.x = -100
		friendAheadGroup.add(backgroup)
		
		var back = backgroup.create(0,0,'atlas.game','arrows_back')
		back.tint = 0x40ffd9
		back.anchor.setTo(0.5,0)
		
		var scoreText = game.add.bitmapText(0,back.height * 0.87, 'roundsBlack', '000', 25);
		scoreText.anchor.setTo(0.5,0.5)
		backgroup.add(scoreText)
		
		friendAheadGroup.scoreText = scoreText
		
	}
	
	return {
		
		assets: assets,
		name: "bowman",
		update: update,
        preload:preload,
		create: function(event){
    		
			lastScore = 0
			
			tweensList = []
			timerList = []
			
			sceneGroup = game.add.group()	
            
			groundPivot = game.world.height - 215
            pivotObjects = game.world.centerX + 205
			
			createBackground()
			createFocus()
			createCharacters()
			createRainbowImages()
			createFruits()
			createRocks()
			createBowman()
			createArrowsGUI()
			createTrajectory()
			//createEmitter()
			createBonusGroup()
			createFriendAheadGroup()
			
			createFriendsGroup()
			createTransitionObject()
			
			createBows()
			createScreenButton()

			// Turn on gravity
			game.physics.arcade.gravity.y = GRAVITY;
                        			
           	//medievalSong = game.add.audio('medievalSong')
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
			
			gameeActions()			
			addParticles()
			
			loadSounds() 	
          
			//show()
			
		},
	}
}()