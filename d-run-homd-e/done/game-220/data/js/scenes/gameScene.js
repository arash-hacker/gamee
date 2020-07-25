
var soundsPath = "sounds/"
var gameScene = function(){    

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
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "rocketSound",
				file: soundsPath + "rocketSound.mp3"},
            {	name: "goUp",
				file: soundsPath + "goUp.mp3"},
            {	name: "rocketLaunch",
				file: soundsPath + "rocketLaunch.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "minigamesError",
				file: soundsPath + "minigamesError.mp3"},
            {	name: "forest",
				file: soundsPath + "forest.mp3"},
            {	name: "cat",
				file: soundsPath + "cat.mp3"},
            {	name: "noBullets",
				file: soundsPath + "noBullets.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "furiousInsects",
				file: soundsPath + "furiousInsects.mp3"},
            {	name: "gameSong",
				file: soundsPath + "songs/synthwave_80_space.mp3"},
		],
    }
    
	var GAME_SCALE = 0.7
    var TUT_LIMIT = 4
	
	var worldGroup
	var friendsGroup, guiFriends, playerGroup, playerInfoGroup
	var sceneGroup = null
	var background
	var gameActive
	var particlesGroup, particlesUsed
	var gameLevel, gameScore
	var socialList
	var tweensList, timerList
    var lastScore
    var buttonPressed
    var obstacleCount
    var unmuteSong
    var playerShip
    var lineWidth
    var itemsGroup, usedItems
    var lastObject
    var shootsNumber
    var shootsGUI
    var characterGroup
    var levelNumber
    var jetPack, mountains
    var cloudsGroup, usedClouds, frontClouds
    var smokeGroup
    var levelList
    var indexStart
    var coinsGUI
    var playerInfo
    var coinsNumber
    var showTutorial
    var handTutorial, arrowTutorial
    var buttonsGroup
    var tutorialTimes
    var linesGroup
    var indexLevel,currentDifficulty, levelToUse
    var difficultyText, backgrounds
    
    var ANGULAR_VALUE = 6.5
    var itemList = ['coin','rocket','arrow','monster','jet']
    var lineColors = [0xf60056, 0xf6d700]
    var gradientColors = [
        ["#71c8eb","#badce7"],
        ["#8cfcfb","#f9c57b"],
        ["#212c98","#557ca4"],
    ]

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
        
        unmuteSong = false
		gameScore = 0
		gameLevel = 0
		socialList = []  
        shootsNumber = playerInfo.bulletsNumber
        levelNumber = 0
        tutorialTimes = 0
        indexLevel = 0
        currentDifficulty = 'easy'
        levelToUse = levelList.easyLevels
        //coinsNumber = 0
	}
	
    function setBestLine(score, tag, friend){
        
        var bestScore = score
        //bestScore = 200
        if(bestScore < 100 || !bestScore)
            return
            
        var bestLine = getObjectPool(tag,linesGroup,usedLines)
        if(!bestLine){
            //console.log(tag + ' not found')
            return
        }
        
        bestLine.tint = lineColors[0]
        bestLine.reset(0,game.world.centerY -  (bestScore * 25))
        bestLine.text.x = 15
        
        var textToUse = 'Your Best Score: ' + bestScore
        if(friend){
        
            bestLine.tint = lineColors[1]
            bestLine.addChild(friend)
            bestLine.friend = friend
            friend.x = 50
            friend.y = 0
            friend.alpha = 1
            
            var friendName = friend.name
            if(friendName.length > 8)
                friendName = friendName.substring(0,8) + '.'
            textToUse = friendName + ' score: ' + score
            
            bestLine.text.x = 100
        }
        
        bestLine.text.text = textToUse   
        //console.log(bestScore + ' highScore')
    }
    
    function animateScene() {

        sceneGroup.alpha = 0
        tweensList[tweensList.length] = game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        setBestLine(playerInfo.bestScore,'highScore')
        addLevel(3)
        addClouds(5)
        
        if(!showTutorial){
            usedItems.forEach(function(item){
                item.y-= 1400
            })
        }
        
        tweensList.push(game.add.tween(worldGroup.scale).to({x:1.4,y:1.4},1000,"Linear",true))
        tweensList.push(game.add.tween(worldGroup).to({x:game.world.width * -0.185,y:-375},1000,"Linear",true))
        showShop()
        
        timerList.push(game.time.events.add(1000,function(){gameActive = true}))
        startSmoke(0)
        positionJetPack()
    }
    
    function positionJetPack(){
        
        if(gameActive)
            return
        
        var ragdoll = playerShip.ragDoll
        jetPack.reset(ragdoll.body.x, ragdoll.body.y + 5)
        jetPack.angle = ragdoll.body.angle
        
        timerList.push(game.time.events.add(100,positionJetPack))
        
    }
    
    function showShop(){
        
        var buttonList = [playerInfo.bulletLevel,playerInfo.impulseLevel]
        
        for(var i = 0; i < buttonsGroup.length;i++){
            
            var btn = buttonsGroup.children[i]
            btn.level = buttonList[i]
            btn.levelText.text = btn.level

            btn.price = 100 + (100 * buttonList[i])
            btn.priceText.text = btn.price
  
        }
        
        checkButtons()
        tweensList.push(game.add.tween(buttonsGroup).to({x:0},500,"Linear",true))
    }
    
    function checkButtons(){
        
        buttonsGroup.forEach(function(btn){
            
            if(coinsNumber < btn.price){
                //btn.btn.inputEnabled = false
                btn.btn.alpha = 0
            }else{
                
                btn.btn.alpha = 1
                if(btn.tag == 'bullet' && playerInfo.bulletsNumber >= playerInfo.bulletLimit)
                    btn.btn.alpha = 0
            }
        })
    }
    
    function startSmoke(index){
        
        if(playerShip.body.gravityScale > 0)
            return
            
        var smoke = smokeGroup.children[index]
        smoke.reset(background.x + 175, background.y - 275)
        smoke.alpha = 1
        tweensList.push(game.add.tween(smoke).to({alpha:0,angle:smoke.angle+360,x:smoke.x + game.rnd.integerInRange(1,3) * 50,y:smoke.y - 200},game.rnd.integerInRange(5,10) * 200,"Linear",true))
        
        index++
        if(index>3)
            index = 0
        
        timerList.push(game.time.events.add(game.rnd.integerInRange(3,7)*100,function(){
            startSmoke(index)
        }))
        
    }
    
    function addClouds(number){
        
        var numToUse = number || 1
        var tag = 'cloud_' + game.rnd.integerInRange(1,3)
        
        for(var i = 0; i < numToUse;i++){
            
            var pivotClouds = game.world.centerY - 200
            if(lastCloud)
                pivotClouds = lastCloud.y - 400
            
            var cloud = getObjectPool(tag,cloudsGroup,usedClouds)
            cloud.reset(game.rnd.integerInRange(100,game.world.width - 100),pivotClouds)
            lastCloud = cloud
            
            if(game.rnd.integerInRange(0,5) > 2){
                tag = 'cloud_' + game.rnd.integerInRange(1,2)
                var frontCloud = getObjectPool(tag,cloudsGroup,frontClouds)
                frontCloud.scale.setTo(2,2)
                frontCloud.alpha = 0.9
                frontCloud.reset(game.rnd.integerInRange(150,game.world.width - 150),pivotClouds)
            }
        }
    }
    
    function getDifficulty(){
    
        if(indexLevel >= levelToUse.length){
            if(currentDifficulty == 'easy'){
                currentDifficulty = 'medium'
                levelToUse = levelList.mediumLevels
                tweensList.push(game.add.tween(backgrounds.children[1]).to({alpha:1},2000,"Linear",true))
                //Phaser.ArrayUtils.shuffle(levelToUse)
            }else if(currentDifficulty == 'medium'){
                currentDifficulty = 'hard'
                levelToUse = levelList.hardLevels
                tweensList.push(game.add.tween(backgrounds.children[2]).to({alpha:1},2000,"Linear",true))
                //Phaser.ArrayUtils.shuffle(levelToUse)
            }else if(currentDifficulty == 'hard'){
                currentDifficulty = 'hard'
                levelToUse = levelList.hardLevels
                //Phaser.ArrayUtils.shuffle(levelToUse)
            }
            indexLevel = 0
            indexStart = 0
        }
        
        difficultyText.text = 'difficulty: ' + currentDifficulty + '\nlevel: ' + indexLevel
        indexLevel++
    }
    
    function addLevel(number){
        
        //console.log('level added')
        var numToUse =  number || 1
        for(var o = 0; o < numToUse;o++){
            
            getDifficulty()
            var pivotX
            var pivotY = game.world.centerY - 400

            if(lastObject)
                pivotY = lastObject.y - 300

            //console.log(pivotY + ' pivotobjects')
            var offX = 125
            var offY = 125
            var actualLevel = levelToUse[indexStart]
            indexStart++
            if(indexStart >= levelToUse.length)
                indexStart = 0
            for(var i = actualLevel.length - 1; i > -1;i--){

                var level = actualLevel[i]
                pivotX = game.world.centerX
                var rowUsed = []
                var totalWidth = 0
                for(var u = 0 ; u < level.length;u++){

                    var itemTag = level[u]
                    var obj
                    var direction = 'up'
                    if(itemTag.substring(0,5) == 'arrow'){

                        direction = itemTag.substring(5,itemTag.length)
                        itemTag = 'arrow'
                        //console.log(direction + ' direction')
                    }
                    
                    if(itemTag != 'none'){
                        
                        obj = getObjectPool(itemTag,itemsGroup,usedItems)
                        if(!obj)
                            console.log(itemTag)
                        else{
                            obj.reset(pivotX,pivotY)
                            obj.lastItem = false
                            rowUsed.push(obj)
                            
                            if(itemTag == 'coin')
                                obj.angleSpeed = game.rnd.integerInRange(1,20) * 0.1
                            if(itemTag == 'arrow'){
                                if(direction == 'Right'){
                                    obj.angle = 45
                                }else if(direction == 'Left'){
                                    obj.angle = -45
                                }
                                obj.direction = direction
                            }
                        }
                    }

                    pivotX+= offX                
                    if(u > 0)
                        totalWidth+= offX

                    if(obj && i == 0 && u == (level.length - 1)){
                        lastObject = obj
                        obj.lastItem = true
                    }
                }
                pivotY-= offY
                rowUsed.forEach(function(item){
                    item.x-= totalWidth * 0.5
                })
            }
        }
        
    }
    
    function getRandomItem(){
    
        var tagToUse
        var itemToUse = null
        
        //console.log(itemsGroup.length + ' objLeft')
        while(!itemToUse){
            
            tagToUse = Phaser.ArrayUtils.getRandomItem(itemsList)
            
            for(var i = 0; i < itemsGroup.length;i++){

                var item = itemsGroup.children[i]
                if(item.tag == tagToUse && !item.active){
                    itemToUse = item
                }

            }
            //console.log('looking object')
        }
        
        return itemToUse
        
    }
    
    function getObjectPool(tag,group,usedGroup){
        
        var objectToUse = null
        for(var i = 0; i < group.length;i++){
            
            var obj = group.children[i]
            if(!obj.active && obj.tag == tag){
                
                obj.alpha = 1
                group.remove(obj)
                usedGroup.add(obj)
                obj.active = true
                
                objectToUse = obj
                break
        
            }
        }
        
        //if(!objectToUse)
            //console.log(tag + ' not found')
        
        return objectToUse
    }
    
    function emptyGroup(group,usedGroup){
        
        while(usedGroup.length > 0){
            var obj = usedGroup.children[0]
            deactivateObject(obj,group,usedGroup)
        }
    }
	
	function popObject(obj,delay,soundName,angled,notPlaying){
        
		obj.angle = 0
		
		var angleToUse = obj.angle
		if(angled){
			angleToUse = obj.angle + 360
		}
		
		obj.scale.setTo(1,1)
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
    
    function updatePlayer(){
        
        playerShip.timer = 500 - (playerInfo.impulseLevel * 50)
        playerShip.speedLimit = -1300 - (playerInfo.impulseLevel * 50)
    }
    
	function update() {
        
		if(!gameActive){
			return
		}

        checkObjects()
        		
	}
    
    function moveWorld(difference,repeat){
        
        var numberToAdd = difference * 0.04
        addPoint(numberToAdd)
        playerShip.body.y+= difference
        
        usedItems.forEach(function(item){
            item.y+= difference
        })

        if(background.y < game.world.height + background.height)
            background.y+= difference

        /*if(background.shadow.y < game.world.height + background.shadow.height)
            background.shadow.y+= difference * 0.6*/

        if(mountains.y < game.world.height + mountains.height)
            mountains.y+= difference * 0.15

        usedClouds.forEach(function(cloud){
            
            cloud.y+= difference * 0.6
            if(cloud.y > game.world.height + cloud.height){
                deactivateObject(cloud,cloudsGroup,usedClouds)
                addClouds()
            }
        })

        frontClouds.forEach(function(cloud){
            cloud.y+= difference * 1.3
            if(cloud.y > game.world.height + cloud.height){
                deactivateObject(cloud,cloudsGroup,frontClouds)
                cloud.scale.setTo(1,1)
            }
        })
        
        usedLines.forEach(function(line){
            
            line.y+= difference
        })
        
        if(repeat)
            timerList.push(game.time.events.add(5,function(){moveWorld(difference,repeat)}))
    }
    
    function checkObjects(){
        
        //console.log(gameScore)
        var ragdoll = playerShip.ragDoll
        ragdoll.reset(playerShip.body.x - game.world.width * 2, playerShip.body.y)
        ragdoll.body.angle = playerShip.body.angle
        
        jetPack.reset(ragdoll.body.x, ragdoll.body.y + 5)
        jetPack.angle = ragdoll.body.angle
        
        var pivotScreen = game.world.centerY + 50
        var pivotBot = game.world.height - 150
        if(playerShip.body.y < pivotScreen){
            
            var difference = pivotScreen - playerShip.body.y
            moveWorld(difference)
            playerShip.limitBackground = 0
        }else if(playerShip.body.y > pivotBot && playerShip.limitBackground < 25){
            var difference = playerShip.body.y - pivotBot
            moveWorld(-difference)
            playerShip.limitBackground++

        }
        
        if(playerShip.body.velocity.y < playerShip.speedLimit){
            playerShip.body.velocity.y = playerShip.speedLimit
        }
        
        if(playerShip.body.x > (game.world.width * 3) + playerShip.width){
            playerShip.body.x = game.world.width * 2
            playerShip.body.velocity.x*= 0.5
        }else if(playerShip.body.x < game.world.width * 2){
            playerShip.body.x = game.world.width * 3
            playerShip.body.velocity.x*= 0.5        
        }
        
        if(playerShip.body.y > game.world.height + playerShip.height * 3){
            
            var difference = playerShip.body.y > (game.world.height + playerShip.height * 2)
            //moveWorld(-difference * 3,true)
            
            stopGame()
            
        }
        
        animGroup.forEach(function(anim){
            
            if(anim.obj){
                //anim.reset(anim.obj.x, anim.obj.y)
                anim.x = anim.obj.x
                anim.y = anim.obj.y + 15
                
                if(background.y < game.world.height + 100)
                    anim.y = anim.obj.y - 100
                anim.angle = anim.obj.angle
            }
        })
        
        playerShip.legs.forEach(function(leg){
            
            leg.body.angle = playerShip.body.angle
        })
        
        usedItems.forEach(function(item){
            
            //if(item.tag == 'coin')
                //item.angle+= item.angleSpeed
            if(item.active){
                if(checkOverlap(ragdoll,item)){

                    var tag = item.tag
                    
                    if(item.lastItem)
                        addLevel()
                    if(tag == 'coin'){
                        
                        addCoin(1,item)
                        deactivateObject(item,itemsGroup,usedItems)
                        
                    }else if(tag == 'rocket'){
                        
                        addBullet(Math.ceil(playerInfo.bulletsNumber * 0.5),item)
                        deactivateObject(item,itemsGroup,usedItems)
                    }else if(tag == 'arrow' && playerShip.canFly){
                        sound.play("goUp")
                        createPart('star',item)
                        deactivateObject(item,itemsGroup,usedItems)
                        
                        var forceX = 0
                        var forceY = -400
                        
                        if(item.direction == 'Right'){
                            forceX = 300
                            forceY = -400
                        }else if(item.direction == 'Left'){
                            forceX = -300
                            forceY = -400
                        }
                        
                        if(playerShip.body.velocity.y > 400)
                            forceY = -550
                        playerShip.body.applyForce(forceX,forceY)
                    }else if(tag == 'jet'){
                        
                        setPowerUp(tag)
                        deactivateObject(item,itemsGroup,usedItems)
                    }else if(tag == 'monster' && !playerShip.isBubble){
                        createPart('wrong',item)
                        createTextPart('ouch!',playerShip.ragDoll)
                        setPowerUp(tag)
                        deactivateObject(item,itemsGroup,usedItems)
                    }
                }

                if(item.y > game.world.height + item.height + 200){
                    if(item.lastItem)
                        addLevel()
                    deactivateObject(item,itemsGroup,usedItems)
                }
            }
            
            if(item.tag == 'monster')
                item.angle+= 2
            
        })
    }
    
    function setPowerUp(name){
        
        if(name == 'jet'){
            sound.play("powerup")
            playerShip.canFly = false
            playerShip.body.setZeroVelocity()
            playerShip.body.velocity.y = -600
            playerShip.body.gravityScale = 0
            playerShip.body.angularVelocity = 0

            playerShip.bubble.alpha = 1
            playerShip.isBubble = true
            tweensList.push(game.add.tween(playerShip.bubble.scale).from({x:0,y:0},500,"Linear",true))
            
            tweensList.push(game.add.tween(playerShip.bubble).to({alpha:0},200,"Linear",true,2000,7))

            tweensList.push(game.add.tween(playerShip.body).to({angle:360},3200,"Linear",true))
            timerList.push(game.time.events.add(3000,function(){
                playerShip.canFly = true
                playerShip.body.velocity.y = 0
                playerShip.body.gravityScale = 1
                playerShip.isBubble = false
                playerShip.body.applyForce(0,-350)
            }))
        }else if(name == 'monster'){
            
            sound.play("furiousInsects")
            playerShip.body.setZeroVelocity()
        }
    }
    
    function addBullet(number,item){
        
        shootsNumber+= number
        
        if(shootsNumber>= playerInfo.bulletsNumber)
            shootsNumber = playerInfo.bulletsNumber
        
        createTextPart('+'+number + ' fuel cells',item)
        createPart('star',item)
        sound.play("rocketSound")
        updateBullets()
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
        
		gameScore+= number
		gamee.updateScore(gameScore)

    }
    
    function addCoin(number,obj){
        		
        createPart('star',obj)
        sound.play("magic")

        //createTextPart('+'+ number,obj)
        coinsNumber+= number
        coinsGUI.text.text = coinsNumber
        createTextPart('+'+number,coinsGUI.text,true)
    }
    
    function createTextPart(text,obj,isDown){
        
       var pointsText = lookParticle('text')
       var angleToUse = 10
       var offsetPart = 0
       if(isDown)
           offsetPart = 100
       if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y 
            pointsText.text = text
            pointsText.scale.setTo(1,1)
            pointsText.angle = -angleToUse
           
            var tween = game.add.tween(pointsText).to({angle:angleToUse},200,"Linear",true,0,1)
            tween.yoyo(true,0)
            tweensList.push(tween)
            tweensList[tweensList.length] = game.add.tween(pointsText).to({y:pointsText.y + offsetPart},750,Phaser.Easing.linear,true)
            tweensList[tweensList.length] = game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
   }
    
    function stopGame(win){

        gameActive = false
				        	
        sound.play("gameLose")
        sound.stop("gameSong")
		var endTween = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true,1000)
		tweensList[tweensList.length] = endTween
		endTween.onComplete.add(function(){
        
            gameScore = Math.ceil(gameScore)
            
            lastScore = gameScore
            if(lastScore > playerInfo.bestScore)
                playerInfo.bestScore = lastScore
            playerInfo.coins = coinsNumber
            gamee.gameSave(JSON.stringify(playerInfo))
    
			gamee.gameOver()
		})
    }
    
    
    function preload(){
        
        playerInfo = playerModel.getPlayer()
        levelList = levels.getLevels()
        game.stage.disableVisibilityChange = false;        
		game.load.bitmapFont('roundsBlack','images/game/font/font.png','images/game/font/font.fnt');
        
        game.load.spritesheet('explosion', 'images/game/spritesheets/explosion.png', 203, 359, 6);
        game.load.spritesheet('explosion1', 'images/game/spritesheets/explosion1.png', 203, 359, 6);
        game.load.spritesheet('handTutorial', 'images/game/spritesheets/tutorialHand.png', 128, 125, 2);
		
    }

    function createClouds(){
        
        cloudsGroup = game.add.group()
        worldGroup.add(cloudsGroup)
        
        usedClouds = game.add.group()
        worldGroup.add(usedClouds)
        
        for(var i = 0; i < 3; i++){
            
            for(var u = 0; u < 10;u++){
                
                var tag = 'cloud_' + (i + 1)
                var cloud = cloudsGroup.create(0,0,'atlas.game',tag)
                cloud.tag = tag
                cloud.active = false
                cloud.anchor.setTo(0.5,0.5)
                cloud.alpha = 0
            }
        }
    }
    
	function createBackground(){

        backgrounds = game.add.group()
        sceneGroup.add(backgrounds)
        
        gradientColors.forEach(function(colorList){
            var myBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
            var grd = myBitmap.context.createLinearGradient(0,0,0,game.world.height);
            grd.addColorStop(0,colorList[0]);
            grd.addColorStop(1,colorList[1]);
            myBitmap.context.fillStyle=grd;
            myBitmap.context.fillRect(0,0,this.game.width, this.game.height);

            var back = this.game.add.sprite(0,0, myBitmap);
            backgrounds.add(back)       
        })
        
        changeImage(0,backgrounds)
    
        worldGroup = game.add.group()
        sceneGroup.add(worldGroup)
        
        createClouds()
        
        mountains = worldGroup.create(game.world.centerX,game.world.height + 100,'atlas.game','2nd_layer')
        //mountains.width = game.world.width
        mountains.initY = mountains.y
        mountains.anchor.setTo(0.5,1)
        
        background = worldGroup.create(game.world.centerX + 10, game.world.height,'atlas.game','house')
        background.scale.setTo(0.7,0.7)
        background.anchor.setTo(0.5,1)
        
        var moon = worldGroup.create(game.world.centerX + 100, game.world.centerY - 300,'atlas.game','moon')
        moon.anchor.setTo(0.5,0.5)
        
        /*var shadow = sceneGroup.create(0,game.world.height + 75,'atlas.game','darker_bottom')
        shadow.anchor.setTo(0,1)
        shadow.width = game.world.width
        background.shadow = shadow*/
        
        smokeGroup = game.add.group()
        sceneGroup.add(smokeGroup)
        
        for(var i = 1; i < 5;i++){
            
            var smoke = smokeGroup.create(0,0,'atlas.game','smoke'+i)
            smoke.anchor.setTo(0.5,0.5)
            smoke.alpha = 0
            
        }
	}
	
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		return Phaser.Rectangle.intersects(boundsA , boundsB );

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
			particle.start(true, 1500, null, 4)
			particle.setAlpha(1,0,2000,Phaser.Easing.Cubic.In)
       }
        
       
   }
    
   function createParticles(tag,number){
                
       for(var i = 0; i < number;i++){
            
           var particle
            if(tag == 'text'){
                
               	var particle = game.add.bitmapText(0,0, 'roundsBlack', '0', 30);
            	particle.anchor.setTo(0.5,0.5)
				particlesGroup.add(particle)
                
           }else{
                var particle = game.add.emitter(0, 0, 100);

                particle.makeParticles('atlas.game',tag);
                particle.minParticleSpeed.setTo(-400, -400);
                particle.maxParticleSpeed.setTo(400, 400);
                particle.minParticleScale = 1;
                particle.maxParticleScale = 2;
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
	
	function gameeActions(){
		
		gamee.emitter.addEventListener("pause", function(event) {
			
			game.paused = true
			// event.detail.callback();
		}); 

		gamee.emitter.addEventListener("resume", function(event) {
			
            if(unmuteSong){
                sound.play("gameSong",{loop:true,volume:0.6})
                unmuteSong = false
            }
            
			game.paused = false
			// event.detail.callback();
		});

		gamee.emitter.addEventListener("mute", function(event) {
			
            sound.stop("gameSong")
            sound.setSound(false)
            
			game.sound.mute = true
		   	// event.detail.callback();
		});

		gamee.emitter.addEventListener("unmute", function(event) {
            
            sound.setSound(true)
            unmuteSong = true
            
			game.sound.mute = false
		   	// event.detail.callback();
		});
		
		gamee.emitter.addEventListener("start", function(event) {
						
			game.paused = false
			
			show()
			// event.detail.callback();
			
		}); 
		
	}
	
	function restartAssets(){
             
        changeImage(0,backgrounds)
        levelList = levels.getLevels()
        coinsNumber = playerInfo.coins
        coinsGUI.text.text =  coinsNumber
        levelToUse = levelList.easyLevels
        
        buttonsGroup.x = 200
        
        shootsNumber = playerInfo.bulletsNumber
        updateBullets(true)
        shootsGUI.scale.setTo(1,1)
        
        indexStart = game.rnd.integerInRange(0,levelToUse.length - 1)
        if(!showTutorial)
            indexStart = 0
        
        playerShip.reset(game.world.centerX + game.world.width * 2,game.world.height - 300)
        playerShip.body.gravityScale = 0
        playerShip.body.setZeroVelocity()
        playerShip.body.angularVelocity = 0
        playerShip.body.angle = 0
        playerShip.canFly = true
        playerShip.speedLimit = -1400
        playerShip.timer = 500
        playerShip.force = 85000
        playerShip.limitBackground = 0
        playerShip.bubble.alpha = 0
        
        playerShip.ragDoll.reset(game.world.centerX, playerShip.body.y)
        jetPack.alpha = 1
        jetPack.reset(playerShip.ragDoll.body.x, playerShip.ragDoll.body.y)
        jetPack.angle = playerShip.angle
        
        background.y = game.world.height
        mountains.y = mountains.initY
        //background.shadow.y = game.world.height + 75
        
        playerShip.bodyParts.forEach(function(part){
            
            part.body.angularVelocity = 0
            part.body.angle = 0
            
            var angle =  part.startAngle || 0
            tweensList.push(game.add.tween(part.body).to({angle:angle},300,"Linear",true))
        })
        
        lastObject = null
        lastCloud = null
        
        emptyGroup(itemsGroup,usedItems)
        emptyGroup(cloudsGroup,usedClouds)
        emptyGroup(cloudsGroup,frontClouds)
        emptyGroup(linesGroup,usedLines)
        
        smokeGroup.forEach(function(smoke){
            smoke.alpha = 0
        })
        
        sound.play("forest",{loop:true,volume:0.6})
        
        friendsGroup.forEach(function(friend){
            friend.name = null
            friend.score = null
        })
        
        updatePlayer()
	}
        
    function emptyGroup(group,usedGroup){
        
        while(usedGroup.length > 0){
            var obj = usedGroup.children[0]
            deactivateObject(obj,group,usedGroup)
        }
    }
    
    function deactivateObject(obj,group,usedGroup){
        
        obj.active = false
        obj.y-= game.world.height
        obj.alpha = 0
        obj.angle = 0
        
        if(obj.friend){
            friendsGroup.add(obj.friend)
            obj.friend.alpha = 0
            obj.friend = null
        }
        usedGroup.remove(obj)
        group.add(obj)
    }
    
	function show(){
		
		cancelTweens()
		restartAssets()
		sceneloader.socialRequest(createFriendsImages,game,10)
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
    
    function startFriendsAhead(){
		
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
		
		popObject(friendAheadGroup,0)
		friendAheadGroup.scoreText.text = scoreUsing
		
		friend.x = friendAheadGroup.x - 100
		friend.y = 153
		popObject(friend,0)
		
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
    
    function checkifPlayer(){
		
        var scoreToCheck = gameScore + 1
		var friendScoreList = []
		for(var i = 0; i < friendsGroup.length;i++){
			
			var friend = friendsGroup.children[i]
			
			//console.log(friend.score + ' fScore ' + scoreToCheck + ' scoreToCheck ' + gameScore + ' gameScore')
			if(friend.score < scoreToCheck && friend.score >= gameScore && friend.active && friend.score > lastScore){
				return friend
			}
		}
				
	}
    
	function createFriendsImages(){

		socialList = sceneloader.getSocialInfo()
		var initScore = 100
		
        //console.log(socialList)
		for(var i = 0; i < socialList.length;i++){
			
			if(friendsGroup.length == i){
				break
			}
			
			var group = friendsGroup.children[i]
			group.alpha = 0
			group.active = true
			group.score = socialList[i].highScore
            group.name = socialList[i].name
            group.userID = socialList[i].userID
			//group.score = initScore + (i * 20)
            
            //console.log(group.name + '  name - ' + group.score + ' score')
			
			var name = socialList[i].name
			if(game.cache.checkImageKey(name)){
				
				var friend = group.create(0,0,name)
                getSpriteSize(90,friend)
                friend.anchor.setTo(0.5,0.5)

				group.friend = friend			
				friend.mask = group.maskUsed
			}
			
			group.remove(group.bubble)
			group.add(group.bubble)
			
            
		}
                
        if(socialList && socialList.player){
            
            var player = socialList.player
            
            playerGroup.alpha = 0
            playerGroup.score = player.highScore
            playerGroup.playerName = player.name
            playerGroup.coins = player.coins
            playerGroup.id = player.id
            
            var name = socialList.player.name
			if(game.cache.checkImageKey(name)){
				
				var friend = playerGroup.create(0,0,name)
                getSpriteSize(90,friend)
                friend.anchor.setTo(0.5,0.5)

				playerGroup.friend = friend			
				friend.mask = playerGroup.maskUsed
			}
            
            playerGroup.remove(playerGroup.bubble)
			playerGroup.add(playerGroup.bubble)
            
            console.log(player)
        }
        
        createFriendsScores()
        //createFriendsInfo()
	}
    
    function createFriendsScores(){
        
        friendsGroup.forEach(function(friend){
            
            if(friend.score && friend.name){
                setBestLine(friend.score,'line',friend)
            }
        })
    }
    
    function getSpriteSize(size,sprite){
        
        sprite.width = (sprite.width * size)/ sprite.height
        sprite.height = size
        
        while(sprite.width < 90){
            
            sprite.width+= sprite.width * 0.1
            sprite.height+= sprite.height * 0.1
        }
    }
    
    function createFriendsInfo(){

        playerInfoGroup.alpha = 0
        
        //tweensList.push(game.add.tween(playerInfoGroup).to({alpha:1},500,"Linear",true))
        
        //playerGroup.alpha = 1
        playerGroup.x = playerInfoGroup.x
        playerGroup.y = playerInfoGroup.y
        
        var coinsToUse = playerGroup.coins || 0
        var nameToUse = playerGroup.playerName || "no name"
        nameToUse+= "\n" + coinsToUse + " coins"
        
        var textName = playerInfoGroup.children[0]
        textName.text = nameToUse
        textName.alpha = 1
    }
    
    function createFriendsGUI(){
        
        playerInfoGroup = game.add.group()
        sceneGroup.add(playerInfoGroup)
        
        playerInfoGroup.x = 100
        playerInfoGroup.y = 100
        
        playerInfoGroup.alpha = 0
        
        var textName = game.add.bitmapText(playerGroup.width * 0.7,0,'roundsBlack','',16)
        textName.tint = 0x000000
        textName.anchor.setTo(0,0.5)
        playerInfoGroup.add(textName)
        
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
        
        playerGroup = createFriend(indexFrame)
        sceneGroup.add(playerGroup)
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
	
    function inputButton(obj){
        
        if(!gameActive || !playerShip.canFly)
            return
            
        if(shootsNumber < 1){
            sound.play("noBullets")
            
            if(shootsGUI.tween){
                shootsGUI.tween.stop()
                shootsGUI.scale.setTo(1,1)
            }
            shootsGUI.tween = game.add.tween(shootsGUI.scale).to({x:0.8,y:0.8},100,"Linear",true,0,0)
            shootsGUI.tween.yoyo(true,0)
            tweensList.push(shootsGUI.tween)
            return
        }
        
        var angleUsed = Math.abs(playerShip.angle)
        obj.inputEnabled = false
        timerList.push(game.time.events.add(playerShip.timer,function(){obj.inputEnabled = true}))
        //console.log(playerShip.angle + ' angleUsed')
        
        if(angleUsed > 45 && angleUsed < 65){
            console.log('bad shoot')
            var offset = 1
            if(playerShip.body.angle < -1)
                offset = -1
            
            playerShip.body.angle-= (20 * offset)
        }
        
        if(showTutorial){
            shootsNumber--
            updateBullets()
        }
        
        var tag = obj.tag
        if(tag == 'fire'){
            
            //sound.play("cat")
            sound.play("rocketLaunch")
            
            var forceToUse = playerShip.force
            if(angleUsed > 80)
                forceToUse*= 0.4
            
            //console.log(angleUsed + ' angleUsed')
            if(playerShip.body.velocity.y > 1000)
                forceToUse*= 1.5
            if(playerShip.body.gravityScale == 0){

                //playerShip.body.angularVelocity = -5
                tweensList.push(game.add.tween(buttonsGroup).to({x:200},500,"Linear",true))
                playerShip.body.gravityScale = 1
                forceToUse = 80000
                jetPack.alpha = 1
                
                tweensList.push(game.add.tween(worldGroup.scale).to({x:1,y:1},500,"Linear",true))
                tweensList.push(game.add.tween(worldGroup).to({x:0,y:0},500,"Linear",true))
                
                sound.stop("forest")
                sound.play("gameSong",{loop:true,volume:0.8})
                
                if(!showTutorial){
                    if(tutorialTimes > 0 && tutorialTimes < TUT_LIMIT)
                        stopTutorial()
                    tutorialTimes++
                    
                    if(tutorialTimes < TUT_LIMIT)
                        startTutorial()
                    else
                        showTutorial = true
                }else{
                    playerShip.body.angularVelocity = ANGULAR_VALUE * 0.08
                }
            }else{
                
                if(playerShip.angle > 0){
                    playerShip.body.angularVelocity = -ANGULAR_VALUE
                }else{
                    playerShip.body.angularVelocity = ANGULAR_VALUE
                }
            }
             
            var goodShoot = angleUsed < 15
            
            if(!showTutorial || background.y < game.world.height + 50)
                goodShoot = false
            
            if(goodShoot){
                
                var greatTexts = ['perfect!','great!','amazing!']
                createTextPart(Phaser.ArrayUtils.getRandomItem(greatTexts),jetPack, true)
                createPart('ouch',jetPack)
                forceToUse*= 1.1
                playAnim('explosion1',jetPack,goodShoot)
                playerShip.body.velocity.x*= 0.2
            }else{
                playAnim('explosion',jetPack,goodShoot)
            }
            
            playerShip.body.thrust(forceToUse);    
            
        }
    }
    
    function stopTutorial(){
        
        if(playerShip.tween)
            playerShip.tween.stop()

        arrowTutorial.text.tween.stop()
        tweensList.push(game.add.tween(frontClouds).to({alpha:1},500,"Linear",true))
        handTutorial.animations.stop()

        tweensList.push(game.add.tween(handTutorial).to({alpha:0},300,"Linear",true))
        tweensList.push(game.add.tween(arrowTutorial).to({alpha:0},300,"Linear",true))
        tweensList.push(game.add.tween(blackScreen).to({alpha:0},300,"Linear",true))

        playerShip.body.angularVelocity = ANGULAR_VALUE
    }
    
    function startTutorial(){
        
        var text = arrowTutorial.text
        text.alpha = 1
        text.tween = game.add.tween(text).to({alpha:0},500,"Linear",true,0,-1)
        text.tween.yoyo(true,0)
        tweensList.push(text.tween)
        
        playerShip.canFly = false
        //showTutorial = true
        timerList.push(game.time.events.add(1000,function(){tweensList.push(game.add.tween(blackScreen).to({alpha:0.6},500,"Linear",true))}))
        tweensList.push(game.add.tween(frontClouds).to({alpha:0},500,"Linear",true))
        
        var tween = game.add.tween(playerShip.body).to({angle:320},1500,"Linear",true)
        tweensList.push(tween)
        tween.onComplete.add(function(){
            
            sound.play("gameSong",{loop:true,volume:0.2})
            playerShip.tween = game.add.tween(playerShip.body).to({angle:20},6000,"Linear",true)
            tweensList.push(playerShip.tween)
            
            var ragdoll = playerShip.ragDoll.body
            var scaleFactor = 1
            if(ragdoll.x > game.world.width - 150){
                scaleFactor = -1
            }
            
            handTutorial.x = ragdoll.x + 95 * scaleFactor
            handTutorial.scale.x = 1 * scaleFactor
            
            arrowTutorial.x = playerShip.ragDoll.body.x + 85 * scaleFactor
            arrowTutorial.scale.x = scaleFactor
            arrowTutorial.text.scale.x = scaleFactor
            
            handTutorial.animations.play('walk',2,true)
            tweensList.push(game.add.tween(handTutorial).to({alpha:1},500,"Linear",true))
            tweensList.push(game.add.tween(arrowTutorial).to({alpha:1},300,"Linear",true,200))
            
            
            playerShip.body.setZeroVelocity()
            playerShip.body.gravityScale = 0
            
            timerList.push(game.time.events.add(500,function(){playerShip.canFly = true}))
        })
    }
    
    function outputButton(obj){
        
        obj.alpha = 1
        obj.scale.setTo(obj.origScaleX,obj.origScaleY)
        
    }
    
    function checkDistance(obj1,obj2) {

        return Phaser.Math.distance(obj1.world.x, obj1.world.y, obj2.world.x, obj2.world.y)
    }
    
    function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',1)
		createParticles('ouch',1)
		createParticles('wrong',1)
		createParticles('text',5)
        
        animGroup = game.add.group()
        sceneGroup.add(animGroup)
        
        var particlesTag = ['explosion','explosion1']
        
        for(var i = 0; i < particlesTag.length;i++){
            
            anim = game.add.sprite(200, 200, particlesTag[i]);
            anim.playBack = anim.animations.add('walk');
            anim.alpha = 0
            anim.scale.setTo(0.6,0.6)
            anim.anchor.setTo(0.5,0)
            anim.tag = particlesTag[i]
            //anim.animations.play('walk',20,true)
            animGroup.add(anim)
        }
        
        handTutorial = game.add.sprite(game.world.centerX + 150, game.world.centerY + 100, 'handTutorial');
        handTutorial.playBack = handTutorial.animations.add('walk');
        handTutorial.alpha = 0
        handTutorial.anchor.setTo(0.5,0)
        handTutorial.animations.play('walk',2,true)
        sceneGroup.add(handTutorial)
        
        arrowTutorial = sceneGroup.create(game.world.centerX + 100, game.world.centerY + 15,'atlas.game','rotateArrow')
        arrowTutorial.anchor.setTo(0.5,0.5)
        arrowTutorial.alpha = 0
        
        var tutorialText = game.add.bitmapText(0,-100, 'roundsBlack', 'Tap to fly!', 31);
        tutorialText.anchor.setTo(0.5,0.5)
        arrowTutorial.addChild(tutorialText)
        arrowTutorial.text = tutorialText
	}
    
    function playAnim(tag,obj,isGood){
        
        var anim
        animGroup.forEach(function(animObj){
            if(animObj.tag == tag)
                anim = animObj
        })
        
        if(!anim)
            return
            
        anim.alpha = 1
        var posY = obj.world.y
        if(background.y < game.world.height + 50)
            posY-= 0
        //anim.reset(0, posY)
        anim.angle = obj.angle
        anim.obj = obj
        anim.scale.setTo(1,1)
        anim.tint = 0xffffff
        if(isGood)
            anim.scale.setTo(1.3,1.3)
        anim.animations.play('walk',32,false).onComplete.add(function(){
            anim.alpha = 0
            anim.obj = null
        })
    }
    
    function createPlayer(){
    
        blackScreen = game.add.graphics(0,0)
		blackScreen.beginFill(0x000000)
        blackScreen.alpha = 0
		blackScreen.drawRect(-game.world.width,-game.world.height,game.world.width * 4, game.world.height * 4)
		blackScreen.endFill()
        worldGroup.add(blackScreen)
        
        characterGroup = game.add.group()
        worldGroup.add(characterGroup)
        
        var scaleUsed = 0.25
        
        jetPack = characterGroup.create(0,0,'atlas.game','jet_pack')
        jetPack.alpha = 0
        jetPack.anchor.setTo(0.5,0.5)
        jetPack.scale.setTo(scaleUsed,scaleUsed)
        
        var pivotParticle = sceneGroup.create(0,0,'atlas.game','star')
        jetPack.addChild(pivotParticle)
        pivotParticle.alpha = 0
        pivotParticle.y = jetPack.height * 0.5
        jetPack.pivotObject = pivotParticle
        
        /*var anim = game.add.sprite(0, jetPack.height * 0.5, 'explosion');
        anim.animations.add('walk',[0,1,2,3,4,5]);
        anim.alpha = 0
        anim.anchor.setTo(0.5,0)
        anim.animations.play('walk',24,true)
        jetPack.addChild(anim)
        jetPack.anim = anim*/
        
        playerShip = sceneGroup.create(game.world.centerX + game.world.width,game.world.height - 450,'atlas.game','body')
        playerShip.scale.setTo(scaleUsed,scaleUsed)
        playerShip.anchor.setTo(0.5,1)
        game.physics.box2d.enable(playerShip)
        playerShip.body.collideWorldBounds = false
        playerShip.body.isSensor = true
        playerShip.isBubble = false
        //playerShip.body.gravityScale = 0
        playerShip.bodyParts = []
                
        var body = characterGroup.create(game.world.centerX,game.world.height - 450,'atlas.game','body')
        body.anchor.setTo(0.5,1)
        body.scale.setTo(scaleUsed + 0.05,scaleUsed + 0.05)
        game.physics.box2d.enable(body)
        body.body.collideWorldBounds = false
        body.body.static     = true
        body.body.isSensor = true
        playerShip.ragDoll = body
        playerShip.bodyParts.push(body)
        
        var head = characterGroup.create(body.body.x,body.body.y - 50,'atlas.game','head')
        head.anchor.setTo(0.5,0.5)
        head.scale.setTo(scaleUsed + 0.1,scaleUsed + 0.1)
        game.physics.box2d.enable(head)
        head.body.setCircle(head.width * 0.45)
        head.body.collideWorldBounds = false
        head.body.mass = 0.001
        head.body.isSensor = true
        game.physics.box2d.revoluteJoint(head, body, 0, 20, 0, -35, -10, 10, false)
        playerShip.bodyParts.push(head)
        
        playerShip.legs = []
        
        var leftArm = characterGroup.create(body.body.x - 100,body.body.y - 40,'atlas.game','left_arm')
        leftArm.scale.setTo(scaleUsed,scaleUsed)
        game.physics.box2d.enable(leftArm)
        leftArm.body.setRectangle(leftArm.width * 0.9,40)
        leftArm.body.collideWorldBounds = false
        leftArm.mass = 0.001
        game.physics.box2d.revoluteJoint(leftArm, body, 10, 0, -12, -8, 0, 0, false, -10,80,false); 
        playerShip.bodyParts.push(leftArm)
        leftArm.startAngle = 15
        
        var rightArm = characterGroup.create(body.body.x + 100,body.body.y - 40,'atlas.game','right_arm')
        rightArm.scale.setTo(scaleUsed,scaleUsed)
        game.physics.box2d.enable(rightArm)
        rightArm.body.setRectangle(rightArm.width * 0.9,40)
        rightArm.body.collideWorldBounds = false
        rightArm.mass = 0.001
        //rightArm.body.isSensor = true        
        game.physics.box2d.revoluteJoint(rightArm, body, -10, 0, 12, -8, 0, 0, false, -90,20,true);  
        playerShip.bodyParts.push(rightArm)
        //playerShip.legs.push(rightArm)
        rightArm.startAngle = -20
        
        var legsPos = {x:11,y:-10}
        var leftLeg = characterGroup.create(0,0,'atlas.game','left_leg')
        leftLeg.scale.setTo(scaleUsed + 0.05,scaleUsed + 0.05)
        game.physics.box2d.enable(leftLeg)
        leftLeg.body.collideWorldBounds = false
        game.physics.box2d.revoluteJoint(body, leftLeg, -legsPos.x, legsPos.y, 0, -30, 0, 0, false, 0,0,true);
        playerShip.bodyParts.push(leftLeg)
        playerShip.legs.push(leftLeg)
        
        var rightLeg = characterGroup.create(0,0,'atlas.game','right_leg')
        rightLeg.scale.setTo(scaleUsed,scaleUsed)
        game.physics.box2d.enable(rightLeg)
        rightLeg.body.collideWorldBounds = false
        game.physics.box2d.revoluteJoint(body, rightLeg, legsPos.x, legsPos.y, 0, -30, 0, 0, false, 0,0,true);
        playerShip.bodyParts.push(rightLeg)
        playerShip.legs.push(rightLeg)
        
        var bubble = characterGroup.create(0,38,'atlas.game','bubble')
        bubble.anchor.setTo(0.5,0.5)
        bubble.alpha = 0
        head.addChild(bubble)
        bubble.scale.setTo(4.2,4.2)
        playerShip.bubble = bubble
        
        characterGroup.remove(body)
        characterGroup.add(body)
        
        characterGroup.remove(head)
        characterGroup.add(head)      
        
        playerShip.bodyParts.forEach(function(part){
            part.body.isSensor = true
        })
        
        frontClouds = game.add.group()
        worldGroup.add(frontClouds)
        
        jetPack.reset(body.body.x, body.body.y + 5)
        jetPack.angle = playerShip.angle
    }
    
    function createButtons(){
        
        var button = game.add.graphics(0,0)
		button.beginFill(0x000000)
		button.drawRect(0,0,game.world.width,game.world.height)
		button.alpha = 0
		button.endFill()
        button.tag = "fire"
        button.events.onInputDown.add(inputButton)
        button.inputEnabled = true
        sceneGroup.add(button)
    }
    
    function createItems(){
        
        itemsGroup = game.add.group()
        worldGroup.add(itemsGroup)
        
        usedItems = game.add.group()
        worldGroup.add(usedItems)
        
        for(var i = 0; i < itemList.length;i++){
            
            var numberToMake = 20
            var imgName = itemList[i]
            if(itemList[i] == 'coin'){
                numberToMake = 60
                imgName = 'starGUI'
            }
        
            for(var u = 0; u < numberToMake; u++){
                
                var item = itemsGroup.create(0,0,'atlas.game',imgName)
                item.anchor.setTo(0.5,0.5)
                item.tag = itemList[i]
                if(itemList[i] == 'coin')
                    item.scale.setTo(1.5,1.5)
                
                if(itemList[i] != 'coin')
                    item.scale.setTo(0.9,0.9)
                item.active = false
                item.alpha = 0
            }
        }
    }
    
    function updateBullets(placeBars){
    
        if(placeBars)
            shootsNumber = playerInfo.bulletsNumber
        
        var bars = shootsGUI.bars
        var pivotX = shootsGUI.bars.pivotX
        var offsetX = (shootsGUI.back.width / playerInfo.bulletsNumber) * 0.95
        for(var i = 0; i < bars.length;i++){
            
            var bar = bars.children[i]
            if(placeBars){
                bar.x = pivotX
                pivotX+= offsetX
                //console.log(pivotX + ' barPos')
            }
            
            if(i > shootsNumber - 1){
                changeImage(0,bar)
            }else{
                changeImage(1,bar)
            }
            
            if(i >= playerInfo.bulletsNumber){
                bar.alpha = 0
            }else{
                
                bar.alpha = 1
                
                if(placeBars){
                    if(bar.tween){
                        bar.tween.stop()
                        bar.scale.setTo(1,1)
                    }
                    bar.tween = game.add.tween(bar.scale).from({x:2,y:2},200,"Linear",true, i * 40)
                    tweensList.push(bar.tween)
                }                
            }
            
        }
    }
    
    function createGUI(){
        
        shootsGUI = game.add.group()
        shootsGUI.x = game.world.centerX
        shootsGUI.y = 100
        sceneGroup.add(shootsGUI)
        
        var back = shootsGUI.create(0,0,'atlas.game','bulletBar')
        back.anchor.setTo(0.5,0.5)
        shootsGUI.back = back
        
        var barsGroup = game.add.group()
        shootsGUI.add(barsGroup)
        var pivotX = -back.width * 0.4
        barsGroup.pivotX = pivotX
        for(var i = 0; i < 10;i++){
            
            var group = game.add.group()
            group.x = pivotX
            group.y = 0
            barsGroup.add(group)
            
            var slot = group.create(0,0,'atlas.game','bulletSlot')
            slot.anchor.setTo(0.5,0.5)
            
            var bullet = group.create(0,0,'atlas.game','bulletIcon')
            bullet.anchor.setTo(0.5,0.5)
            
            pivotX+= slot.width * 1.4
        }
        
        shootsGUI.bars = barsGroup
            
        coinsGUI = game.add.group()
        coinsGUI.x = game.world.width - 100
        coinsGUI.y = 40
        sceneGroup.add(coinsGUI)
        
        var back = coinsGUI.create(0,0,'atlas.game','money_box')
        back.anchor.setTo(0.5,0.5)
        
        var icon = coinsGUI.create(-50,0,'atlas.game','starGUI')
        icon.anchor.setTo(0.5,0.5)
        
        var coinsText = game.add.bitmapText(-15,-2, 'roundsBlack', '0', 23);
        coinsText.anchor.setTo(0,0.5)
        coinsGUI.add(coinsText)
        
        coinsGUI.text = coinsText
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var buttonList = ['bullet','jetpack']
        var pivotY = game.world.centerY - 100
        for(var i = 0; i < buttonList.length;i++){
            
            var group = game.add.group()
            group.x = game.world.width
            group.y = pivotY
            buttonsGroup.add(group)
            
            var img1 = group.create(0,0,'atlas.game','upgrade_' + buttonList[i] + '_disabled')
            img1.anchor.setTo(1,0.5)
            
            var img2 = group.create(0,0,'atlas.game','upgrade_' + buttonList[i])
            img2.anchor.setTo(1,0.5)
            img2.inputEnabled = true
            img2.events.onInputDown.add(inputStore)   
            group.btn = img2
            
            var priceText = game.add.bitmapText(-15,55, 'roundsBlack', '100', 27);
            priceText.anchor.setTo(1,0.5)
            group.add(priceText)
            group.priceText = priceText    
            
            var levelText = game.add.bitmapText(-150,-69, 'roundsBlack', '0', 22);
            levelText.anchor.setTo(0.5,0.5)
            group.add(levelText)
            group.levelText = levelText
            
            group.tag = buttonList[i]
            group.price = 100
            group.level = 0
            
            pivotY+= 200
            priceText.alpha = 1
            levelText.alpha = 1
        }
        
        difficultyText = game.add.bitmapText(10,10, 'roundsBlack', 'Difficulty = easy', 23);
        difficultyText.alpha = 0
        sceneGroup.add(difficultyText)
    }
    
    function render(){
        
        game.debug.box2dWorld();
    }
    
    function inputStore(obj){
        
        if(!gameActive)
            return
         
        //obj.inputEnabled = false
        //timerList.push(game.time.events.add(500,function(){obj.inputEnabled = true}))
        scaleButton(obj)
        
        var parent = obj.parent
        if(parent.price > coinsNumber){
            sound.play("minigamesError")
            return
        }
        
        if(parent.tag == 'bullet' && playerInfo.bulletsNumber >= playerInfo.bulletLimit){
            sound.play("noBullets")
            return
        }
        
        addCoin(-parent.price,parent.levelText)
        
        var tag = parent.tag
        if(tag == 'bullet'){
            
            playerInfo.bulletsNumber++
            playerInfo.bulletLevel++
            updateBullets(true)
            
            parent.price = 100 + (100 * playerInfo.bulletLevel)
            parent.priceText.text = parent.price
            
            if(playerInfoGroup.bulletsNumber >= playerInfo.bulletLimit)
                parent.priceText.text = ''
        }else if(tag == 'jetpack'){
            
            playerInfo.impulseLevel++
            parent.price = 100 + (100 * playerInfo.impulseLevel)
            
            if(playerInfoGroup.impulseLevel >= playerInfo.impulseLimit)
                parent.priceText.text = ''
            updatePlayer()
        }
        
        if(tag == 'bullet' || tag == 'jetpack'){
            sound.play("goUp")
            parent.level++
            parent.levelText.text = parent.level
            parent.priceText.text = parent.price
        }
        
        checkButtons()
        
        
    }
    
    function scaleButton(obj,notParent){
        
        var parent = obj.parent
        if(notParent)
            parent = obj
        
        if(parent.tween){
            parent.tween.stop()
            parent.scale.setTo(1,1)
        }
        
        var scale1 = parent.scale.x * 0.7
        var scale2 = parent.scale.x * 0.9
                
        
        var tween = game.add.tween(parent.scale).to({x:scale1,y:scale1},150,"Linear",true,0,0)
        tween.yoyo(true,0)
        tweensList.push(tween)
        tween.onComplete.add(function(){
            var tween = game.add.tween(parent.scale).to({x:scale2,y:scale2},50,"Linear",true,0,0)
            tween.yoyo(true,0)
            tweensList.push(tween)
        })
        
        parent.tween = tween
    }
    
    function createLines(){
        
        linesGroup = game.add.group()
        sceneGroup.add(linesGroup)
        
        usedLines = game.add.group()
        worldGroup.add(usedLines)
        
        for(var i = 0; i < 11; i++){
            
            var line = linesGroup.create(0,0,'atlas.game','line')
            //line.width = game.world.width
            line.alpha = 0
            line.anchor.setTo(0,0.5)
            line.active = false
            line.tag = 'line'
            
            if(i==10)
                line.tag = 'highScore'
            
            var lineText = game.add.bitmapText(100,0, 'roundsBlack', '0', 31);
            lineText.anchor.setTo(0,0.5)
            line.addChild(lineText)
            line.text = lineText
        }
    }
    
	return {
		
		assets: assets,
		name: "gameScene",
		update: update,
        preload:preload,
        //render:render,
		create: function(event){
            
            showTutorial = true
            indexStart = 0
            
            game.physics.startSystem(Phaser.Physics.BOX2D);
            game.physics.box2d.gravity.y = 1000;
            //game.physics.box2d.restitution = 0.2;
            game.physics.box2d.setBoundsToWorld();
            
            lastScore = 0
			game.stage.backgroundColor = "#ffffff"
			
			tweensList = []
			timerList = []
			
			sceneGroup = game.add.group()	
            createBackground()
  
            createButtons()
            createLines()
            createItems()
            createPlayer()
            createGUI()

			createFriendsGroup()
            createFriendsGUI()
            
            addParticles()
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
			
			gameeActions()						
			loadSounds() 	
          
			//show()
			
		},
	}
}()