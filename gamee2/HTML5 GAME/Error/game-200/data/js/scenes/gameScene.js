
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
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "drum1",
				file: soundsPath + "drum1.mp3"},
            {	name: "drum2",
				file: soundsPath + "drum2.mp3"},
            {	name: "explode",
				file: soundsPath + "fireExplosion.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "splashMud",
				file: soundsPath + "splashMud.mp3"},
            {	name: "gameSong",
				file: soundsPath + "songs/space_music.mp3"},
		],
    }

	var GRAVITY = 100
	var GAME_SCALE = 0.7
    var DEBUG_PHYSICS = false
	
	var worldGroup
	var friendsGroup, guiFriends, playerGroup, playerInfoGroup
	var sceneGroup = null
	var background
	var buttonsActive, gameActive
	var particlesGroup, particlesUsed
	var gameLevel, gameScore
	var socialList
	var tweensList, timerList
    var textPlayer, textFriends
    var indexIsland
    var lastScor
    var balloon, circleBarrier
    var buttonPressed
    var setInitPos,initX,initY
    var obstaclesGroup, usedObstacles
    var barrierCollisionGroup, obstaclesCollisionGroup, noCollisionGroup, kinematicCollisionGroup
    var spike
    var pivotObstacles
    var levelNumber
    var levelList
    var backgrounds
    var barsGroup
    var stars
    var levelText
    var currentDifficulty, currentLevel, levelUsed
    var itemsGroup, usedItems
    var itemNames
    var indexBackground,backToUse
    var hitSound, unmuteSong
    var numPiecesList = []
    var fastFigures
    var tutorialGroup
    var showTutorial
    var whiteFade
    var fpsText
    
    var backgroundColors = [0xc605f0,0xff3535,0x00ae00,0xff43f4,0x09b7ff,0xff8d13]
    var obstaclesType = ['square','circle','triangle','rhombus','rectangle','bar','cross']
    var levelColors = [
        ["#ca0092","#ffda20",0xca0092,0xffda20],
        ["#ffda20","#7500ba",0xffda20,0x7500ba],
        ["#7500ba","#fabb02",0x7500ba,0xfabb02],
        ["#fabb02","#4a61ff",0xfabb02,0x4a61ff],
        ["#4a61ff","#fb9902",0x4a61ff,0xfb9902],
        ["#fb9902","#4cffd8",0xfb9902,0x4cffd8],
        ["#4cffd8","#f60035",0x4cffd8,0xf60035],
        ["#f60035","#353789",0xf60035,0x353789],
        ["#353789","#ff4f53",0x353789,0xff4f53],
        ["#ff4f53","#00f862",0xff4f53,0x00f862],
        ["#00f862","#910013",0x00f862,0x910013],
        ["#910013","#ffe786",0x910013,0xffe786],
        ["#ffe786","#860052",0xffe786,0x860052],
        ["#860052","#fefe31",0x860052,0xfefe31],
        ["#fefe31","#ca0092",0xfefe31,0xca0092],
        
    ]

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
        
        unmuteSong = false
		gameScore = 0
        pivotObstacles = -200
		buttonsActive = false
        setInitPos = false
        canSound = true
		gameLevel = 0
        initX = 0
        initY = 0
        currentLevel = 0
        currentDifficulty = 'Easy'
        levelUsed = levelList.easyLevels
        Phaser.ArrayUtils.shuffle(levelUsed)
		socialList = []      
        indexBackground = game.rnd.integerInRange(0,levelColors.length - 1)
        //indexBackground = 9
        backToUse = null
        fastFigures = false
        
        levelText.text = 'Difficulty: ' + currentDifficulty + '\nLevel: ' + (currentLevel +1)
        
	}
	
    function rotateBalloon(){
        
        var valueRotate = 5
        balloon.angle = -valueRotate
        
        var tween = game.add.tween(balloon).to({angle:valueRotate},750,"Linear",true,0,-1)
        tween.yoyo(true,0)
        
        tweensList.push(tween)
    }
    
    function animateScene() {
        
        sceneGroup.alpha = 1
        whiteFade.alpha = 1
        tweensList[tweensList.length] = game.add.tween(whiteFade).to({alpha:0},750, Phaser.Easing.Cubic.In,true)
        
        rotateBalloon()
        setObstacle()
        
        timerList.push(game.time.events.add(250,activateGame))
    }
    
    function activateGame(){
        
        gameActive = true
        startScore()
    }
    
    function startScore(){
        
        if(!gameActive){
            return
        }
        
        gameScore+= game.time.fps * .016
        if(gameScore > gameLevel * 60){
            gameScore = gameLevel * 60
        }
        
        gamee.updateScore(gameScore)
        
        game.time.events.add(100,startScore)
    }
    
    function changeColorBack(){
        
        var arrayNumbers = Phaser.ArrayUtils.numberArray(0,backgrounds.length-1)
        arrayNumbers = Phaser.ArrayUtils.shuffle(arrayNumbers)
        
        //console.log(arrayNumbers + ' array')
        
        var backToUse = backgrounds.children[arrayNumbers[0]]
        //console.log(backToUse.colorUsed + ' tint1 ' + backgrounds.currentBack.colorUsed + ' tint2')
        if(backToUse.colorUsed == backgrounds.currentBack.colorUsed){
            backToUse = backgrounds.children[arrayNumbers[1]]
        }
        
        backgrounds.currentBack = backToUse
        backgrounds.remove(backToUse)
        backgrounds.add(backToUse)
        
        backToUse.alpha = 1
        
        tweensList.push(game.add.tween(backToUse).from({y:backToUse.y-backToUse.height},1500,"Linear",true))
        
    }
    

    function setBackground(){
        
        var back = backgrounds.list[indexBackground]
        var timeDelay = 500
                
        if(backToUse){
            
            tweensList.push(game.add.tween(back).from({alpha:0},500,"Linear",true))
            timeDelay+= 500
        }
        
        var startColor = back.startColor 
        
        if(gameLevel == 0){
            back.alpha = 1
            startColor.alpha = 1
        }
        
        var tween = game.add.tween(startColor).to({alpha:1},1000,"Linear",true,0)
        tweensList.push(tween)
        
        tween.onComplete.add(function(){
            
            timerList.push(game.time.events.add(timeDelay, function(){
                fastFigures = true
            }))
            
            timerList.push(game.time.events.add(1700, function(){
                fastFigures = false
            }))
            
            tweensList.push(game.add.tween(startColor).to({alpha:0},1200,"Linear",true,timeDelay))
            
            changeImage(indexBackground,backgrounds)
            indexBackground++
        
            if(indexBackground >= backgrounds.length){
                indexBackground = 0
            }
            
            if(backToUse)
                backToUse.alpha = 0

            backToUse = back
            
        })
        
    }
    
    function setObstacle(skip){
        
        //console.log('set Obstacle')
        if(gameLevel != 0 && !skip){
            addPoint(20,balloon)
            
            var tween = game.add.tween(balloon.scale).to({x:1.4,y:1.4},200,"Linear",true,0,0)
            tween.yoyo(true,0)
            
            tweensList.push(tween)
            
            //changeColorBack()
        }
        
        setBackground()
        
        gameLevel++
        
        if(levelNumber.alpha == 0)
            levelNumber.alpha = 1
        
        levelNumber.text = gameLevel
        levelNumber.reset(game.world.centerX,-levelNumber.height * 1.5)
        
        levelNumber.active = true
        
        var sBody = levelNumber.obstacle.body
        sBody.reset(levelNumber.x, levelNumber.y)
        sBody.velocity.x = 0
        sBody.velocity.y = 0
        sBody.fixedRotation = false
        sBody.angularVelocity = 0
        sBody.gravityScale = 1.2
        sBody.rotation = 0
        levelNumber.obstacle.active = true
        
        placeFigures()
    }
    
    function placeFigures(){
        
        if(gameLevel % 2 == 0 && game.rnd.integerInRange(0,4) > 2){
            
            var item = getObjectPool(Phaser.ArrayUtils.getRandomItem(itemNames),itemsGroup,usedItems)
            item.reset(game.rnd.integerInRange(100,game.world.width - 100),-item.height)
        }
        
        var levelToUse = levelUsed[currentLevel]
        
        pivotObstacles = -400
        
        var pivotX = game.world.centerX
        var stillLooking = true
        var totalWidth
        
        for(var i = levelToUse.length - 1; i > -1;i--){
            
            var levelRow = levelToUse[i]
            pivotX = game.world.centerX
            
            totalWidth = 0
            var rowToUse = []
            
            for(var u = 0; u < levelRow.length;u++){
                
                var tagTouse = levelRow[u]
                var checkTag = tagTouse.substring(0,5)
                
                //console.log(checkTag + ' tagCheck')
                if(checkTag == 'empty'){
                    
                    var numberUse = tagTouse.substring(5,tagTouse.length)
                    var numberOffset = Number(numberUse)
                    
                    pivotX+= numberOffset
                    totalWidth+= numberOffset
                }else{
                    
                    var tagUsed = tagTouse
                    if(tagTouse.substring(tagTouse.length - 4,tagTouse.length) == 'Left'|| tagTouse.substring(tagTouse.length - 5,tagTouse.length) == 'Right')
                        tagUsed = 'circle'
                                                            
                    var obstacle = getObjectPool(tagUsed,obstaclesGroup,usedObstacles)
                    if(!obstacle){
                        console.log(tagUsed + ' not found')
                    }
                    obstacle.friend = null

                    if(u>0){
                        pivotX+= obstacle.width * 0.5
                        totalWidth+= obstacle.width * 0.5
                    }

                    var sBody = obstacle.body
                    sBody.velocity.x = 0
                    sBody.velocity.y = 0
                    sBody.fixedRotation = false
                    sBody.angularVelocity = 0
                    sBody.gravityScale = 0.5
                    sBody.rotation = 0
                    sBody.enabled = false
                    sBody.reset(pivotX,pivotObstacles)
                    
                    if(obstacle.tag == 'bar'){
                        sBody.fixedRotation = true
                    }
                    
                    rowToUse[rowToUse.length] = obstacle
                    
                    pivotX+= obstacle.width * 0.5 + 25

                    if(u < (levelRow.length - 1)){
                        totalWidth+= obstacle.width * 0.5 + 25
                    }
                }
            }
            
            rowToUse.forEach(function(obs){
                
                obs.body.x-= totalWidth * 0.5
 
                if(Math.abs(obs.body.x - game.world.centerX) < 200){

                    var friend = checkifPlayer()

                    if(friend){

                        friend.x = 0
                        friend.y = 0
                        friend.alpha = 1

                        obs.addChild(friend)
                        obs.friend = friend
                    }
                }
            })
            
            pivotObstacles-= 150
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
        
        return objectToUse
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
    
	function update() {
        
        //background.tilePosition.y+= 1   
        stars.tilePosition.x+=1.5
        stars.tilePosition.y+=1.5
        
        circleBarrier.body.setZeroVelocity()
        
        if(levelNumber.active){
            var obs = levelNumber.obstacle
            levelNumber.reset(obs.body.x,obs.body.y)
            levelNumber.angle = obs.angle    
        }
        
		if(!gameActive){
			return
		}

        fpsText.text = 'fps: ' + game.time.fps
        checkObjects()
        		
	}
    
    function explodeBalloon(){
        
        createPart('ouch',balloon)
        sound.play("explode")
        
        tweensList.push(game.add.tween(balloon.scale).to({x:3,y:3},300,Phaser.Easing.Bounce.InOut,true))
        tweensList.push(game.add.tween(balloon).to({alpha:0,angle:balloon.angle + 20},300,"Linear",true))
    }
    
    function itemGrow(){
        
        sound.play("powerup")
        
        circleBarrier.alpha = 0
        tweensList.push(game.add.tween(circleBarrier).to({alpha:1},200,"Linear",true,0,4))
        
        var scaleToUse = circleBarrier.originalScale * 2.5
        circleBarrier.scale.setTo(scaleToUse,scaleToUse)
        circleBarrier.body.setCircle(circleBarrier.width * 0.3)

    }
    
    function turnOffItem(tag){
        
        if(tag == 'scale'){
            
            circleBarrier.alpha = 0
            var tween = game.add.tween(circleBarrier).to({alpha:1},200,"Linear",true,0,3)
            tween.onComplete.add(function(){

                circleBarrier.scale.setTo(circleBarrier.originalScale,circleBarrier.originalScale)
                circleBarrier.body.setCircle(circleBarrier.width * 0.3)
                //setBarrierPhysics()
            })

            tweensList.push(tween)
        }else if(tag == 'spike'){
            
            circleBarrier.alpha = 0
            spike.alpha = 0
            tweensList.push(game.add.tween(spike).to({alpha:1},200,"Linear",true,0,3))
            var tween = game.add.tween(circleBarrier).to({alpha:1},200,"Linear",true,0,3)
            tween.onComplete.add(function(){
                
                spike.alpha = 0
                circleBarrier.invincible = false
            })
            
            tweensList.push(tween)
        }
    }
    
    function itemSpike(){
        
        sound.play('powerup')
        
        spike.reset(circleBarrier.body.x,circleBarrier.body.y)
        spike.alpha = 1
        
        circleBarrier.invincible = true

    }
    
    function checkObjects(){
        
        if(spike.alpha > 0){
            spike.reset(circleBarrier.body.x, circleBarrier.body.y)
            spike.angle+= 10
        }
        
        usedItems.forEach(function(item){
            
            item.y+= 8
            if(checkOverlap(item,circleBarrier) && item.active){
                
                createPart('star',circleBarrier)
                if(item.tag == 'grow'){
                    itemGrow()
                }else if(item.tag == 'spikeItem'){
                    itemSpike()
                }
                deactivateObject(item,itemsGroup,usedItems)
            }
            
            if(item.y> game.world.height + item.height && item.active){
                deactivateObject(item,itemsGroup,usedItems)
            }
            
        })
        
        if(backToUse){
            
            backToUse.barsGroup.forEach(function(group){
                
                if(fastFigures){
                    group.y+= 3
                }else{
                    group.y+=1
                }

                if(group.y > game.world.height + group.height){
                    group.y= -group.height * 0.6
                    //console.log('back restarted')
                }
            })
        }
        
        checkCollisionObstacle(levelNumber.obstacle)
        
        usedObstacles.forEach(function(obs){
            
            checkCollisionObstacle(obs)
            
            if(obs.body.y > (game.world.height + obs.height) || obs.body.x < -100 || obs.body.x > (game.world.width + 100) || (obs.body.y < - game.world.height * 0.3 && obs.body.gravityScale > 2)){
                
                restartObstacle(obs)
            }
        })
        
        /*if(levelNumber.y < (game.world.height + levelNumber.height)){
            levelNumber.y+= 5
        }*/
    
    }
    
    function checkCollisionObstacle(obs){
        
        if(checkOverlap(obs,circleBarrier) && obs.active && circleBarrier.invincible){
                
            sound.play('splashMud')
            createPart('ouch',obs)
            
            if(obs.tag!= 'levelText' && obs.tag != 'bar'){
                restartObstacle(obs)
            }else{
                obs.body.x+= game.world.width
            }
                
        }

        if(checkOverlap(obs,balloon.col) && obs.active){
            explodeBalloon()
            stopGame()
        }
    }
    
    function restartObstacle(obs){
        
        deactivateObject(obs,obstaclesGroup,usedObstacles)
        if(usedObstacles.length == 0 && gameActive){
            //console.log('set Obstacle ' +  obstaclesGroup.length + ' to use')
            setObstacle()
        }
    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
                group.children[i].active = true
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
        		
        createPart('star',obj)
        sound.play("magic")
        
        if(circleBarrier.scale.x > 1.2){
            turnOffItem('scale')
        }else if(spike.alpha == 1){
            turnOffItem('spike')
        }
        
		//gameScore+= number
		//gamee.updateScore(gameScore)
        
        addLevel()
        //createTextPart('+'+ number,obj)
        
    }
    
    function addLevel(){
        
        var limitLevel = 7
        
        currentLevel++
        if(currentLevel >= limitLevel){
            if(currentDifficulty == 'Easy'){
                currentDifficulty = 'Medium'
                levelUsed = levelList.mediumLevels
                Phaser.ArrayUtils.shuffle(levelUsed)
            }else if(currentDifficulty == 'Medium'){
                currentDifficulty = 'Hard'
                levelUsed = levelList.hardLevels
                Phaser.ArrayUtils.shuffle(levelUsed)
            }else if(currentDifficulty == 'Hard'){
                currentDifficulty = 'Hard'
                levelUsed = levelList.hardLevels
                Phaser.ArrayUtils.shuffle(levelUsed)
            }
            currentLevel = 0
        }
        
        levelText.text = 'Difficulty: ' + currentDifficulty + '\nLevel: ' + (currentLevel+1)
    }
    
    function stopGame(win){
		
        sound.stop("gameSong")
        sound.play("gameLose")
        gameActive = false
				        		
        game.stage.backgroundColor = "#ffffff"
        
		var endTween = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1000)
		tweensList[tweensList.length] = endTween
		endTween.onComplete.add(function(){
            
            lastScore = gameScore
			gamee.gameOver()
		})
    }
    
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
		game.load.bitmapFont('roundsBlack','images/game/font/roundsBlack.png','images/game/font/roundsBlack.fnt');
        //game.load.physics('physicsData', 'libs/helpers/physicsData.json');
        
    }

	function createBackground(){
        
        backgrounds = game.add.group()
        sceneGroup.add(backgrounds)
        
        backgrounds.list = []
                
        for(var i = 0; i < levelColors.length;i++){
            
            var gameGroup = game.add.group()
            gameGroup.active = false
            gameGroup.alpha = 0
            backgrounds.add(gameGroup)
            
            backgrounds.list[backgrounds.list.length] = gameGroup
            
            var myBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
            var grd = myBitmap.context.createLinearGradient(0,0,0,game.world.height);
            grd.addColorStop(0,levelColors[i][1]);
            grd.addColorStop(1,levelColors[i][0]);
            myBitmap.context.fillStyle=grd;
            myBitmap.context.fillRect(0,0,this.game.width, this.game.height);

            var back = this.game.add.sprite(0,0, myBitmap);
            gameGroup.add(back)
            
            var startColor = new Phaser.Graphics(game)
            startColor.alpha = 0
            startColor.beginFill(levelColors[i][2])
            startColor.drawRect(0,0,game.world.width, game.world.height)
            startColor.endFill()
            overlayGroup.add(startColor)
            gameGroup.startColor = startColor
            
            var planetGroup = game.add.group()
            gameGroup.add(planetGroup)
            
            var barsGroup = game.add.group()
            gameGroup.add(barsGroup)
            gameGroup.barsGroup = barsGroup
            
            var pivotX, pivotY
            if(i == 0){
                
                var mainTriangle = gameGroup.create(game.world.centerX,game.world.height - 200,'atlas.game','main_trianle')
                mainTriangle.anchor.setTo(0.5,1)
                mainTriangle.tint = levelColors[i][2]
                
                createPlanet(planetGroup,game.world.centerX,-game.world.height * 0.23,0xf5ff7d)
                
                var pivotGY = game.world.height - 100
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    if(o==1){
                        group1.alpha = 0.4
                    }
                    
                    for(var u = 0; u < 3; u++){
                        var triangleLine = group1.create(pivotX,pivotY,'atlas.game','triangle_line')
                        triangleLine.scale.setTo(2,2)
                        triangleLine.anchor.setTo(0.5,1)
                        if(o == 1)
                            triangleLine.scale.y*= -1
                        pivotY-= triangleLine.height * 0.75
                        pivotX-= 100
                        triangleLine.tint = levelColors[i][2]

                        if(u == 1)
                            pivotX = game.world.centerX
                    }
                    
                    pivotGY-= game.world.height * 1.2
                }
                
            }else if(i == 1){
                
                createPlanet(planetGroup,game.world.centerX - 200,game.world.centerY + 50, 200,0xf5ff7d)
                createPlanet(planetGroup,game.world.centerX + 100,game.world.centerY - 100, 100,0xf5ff7d)
                
                var pivotGY = game.world.height - 100
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.2

                    pivotX = game.world.centerX - 400
                    pivotY = 0
                    
                    for(var u = 0; u < 6; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','box')
                        bar.anchor.setTo(0.5,0.5)
                        bar.scale.setTo(2,2)
                        bar.angle = 45
                        bar.tint = levelColors[i][2]
                        
                        if(o==1)
                            bar.scale.y*=-1
                        
                        pivotX+= 145
                        pivotY+= 165
                        
                        if((u+1) % 3 == 0){
                            pivotX = game.world.centerX - 90
                            pivotY = -155
                            
                        }
                    }
                    
                    pivotGY-= game.world.height * 1.25
                }
                
            }else if(i == 2){
                
                createPlanet(planetGroup,game.world.centerX, game.world.centerY - 50,300,0xf5ff7d)
                createPlanet(planetGroup,game.world.centerX + 200, game.world.centerY + 100,100,0xf5ff7d)
                
                var pivotGY = game.world.height - 50
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 3; u++){
                        var guilotina = group1.create(game.world.centerX,pivotY,'atlas.game','gilotina')
                        guilotina.anchor.setTo(0.5,0.5)
                        guilotina.origWidth = guilotina.width
                        guilotina.width = game.world.width
                        guilotina.scale.y = 2
                        guilotina.tint = levelColors[i][2]
                        
                        pivotY-= (120 - u*10)
                        
                    }
                    
                    if(o == 1)
                        group1.alpha = 0.1
                    
                    pivotGY-= game.world.height * 1
                }
                
            }else if(i == 3){
                
                createPlanet(planetGroup,game.world.centerX - 200, game.world.centerY - 200,150,0xf5ff7d)
                createPlanet(planetGroup,game.world.centerX + 150, game.world.centerY - 50,100,0xf5ff7d)
                
                var pivotGY = game.world.height - 100
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.5

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 3; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','curved_triangle')
                        bar.anchor.setTo(0.5,0.5)
                        bar.scale.setTo(2,2)
                        bar.tint = levelColors[i][2]
                        
                        if(o==1)
                            bar.scale.y*=-1
                        
                        pivotY-= 100
                    }
                    
                    pivotGY-= game.world.height * 1.35
                }
                
            }else if(i == 4){
                
                
                var pivotGY = game.world.height - 100
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    var tagToUse = 'blue'
                    var colorUse = levelColors[i][2]
                    if(o == 1){
                        tagToUse = 'yellow'
                        colorUse = levelColors[i][3]
                    }
                        
                    for(var u = 0; u < 3; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game',tagToUse)
                        bar.anchor.setTo(0.5,0.5)
                        bar.scale.setTo(2,2)
                        bar.tint = colorUse
                        bar.width = game.world.width
                        
                        pivotY-= 100
                    }
                    
                    pivotGY-= game.world.height * 1
                }
                
                createPlanet(planetGroup,game.world.centerX, game.world.centerY + 50,400,0xadfff9)
                createPlanet(planetGroup,game.world.centerX, game.world.centerY - 250,100,0xadfff9)
            }else if(i == 5){
                createPlanet(planetGroup,game.world.centerX + 200, game.world.centerY + 100,150,0xf5ff7d)
                createPlanet(planetGroup,game.world.centerX - 200, game.world.centerY - 200,50,0xf5ff7d)
                
                var pivotGY = game.world.height - 100
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.5

                    pivotX = game.world.centerX-200
                    pivotY = 0
                    
                    for(var u = 0; u < 3; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','chair_shape')
                        bar.anchor.setTo(0.5,0.5)
                        bar.scale.setTo(2,2)
                        bar.tint = levelColors[i][3]
                        
                        if(o==1){
                            bar.scale.y*=-1
                            bar.scale.x*=-1
                        }
                            
                        
                        pivotX+= 118
                        pivotY-= 100
                    }
                    
                    pivotGY-= game.world.height * 1.5
                }
            }else if(i == 6){
                
                createPlanet(planetGroup,game.world.centerX - 50,game.world.centerY - 50,250,0x78ffe5)
                var pivotGY = game.world.height - 200
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.7

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 3; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','wave')
                        bar.width = game.world.width
                        bar.scale.y = 2
                        bar.anchor.setTo(0.5,0.5)
                        bar.tint = 0xf60035
                        
                        if(o==1){
                            bar.scale.x*= -1
                            bar.scale.y*= -1
                        }else{
                            bar.tint = levelColors[i][2]
                        }
                            
                        
                        pivotY-= 75
                    }
                    
                    pivotGY-= game.world.height * 1.1
                }
            }else if(i == 7){
                
                createPlanet(planetGroup, game.world.width, game.world.height,game.world.width * 1.4,0x78ffe5)
                createPlanet(planetGroup, game.world.centerX - 100, game.world.centerY - 100,100,0x78ffe5)
                
                var group1 = game.add.group()
                group1.x = game.world.width
                group1.y = game.world.height - 100
                group1.initY = group1.y
                barsGroup.add(group1)

                var pivotX = 0
                var pivotY = 0

                for(var u = 0; u < 7; u++){

                    var bar = group1.create(pivotX,pivotY,'atlas.game','box')
                    bar.scale.x*= 1.6
                    bar.tint = levelColors[i][2]
                    bar.anchor.setTo(1,0.5)

                    pivotX-= bar.width - 5
                    pivotY+= 75
                }

                var group2 = game.add.group()
                group2.alpha = 0.5
                group2.initY = 0
                barsGroup.add(group2)

                pivotX = 0
                pivotY = 0

                for(var u = 0; u < 7; u++){

                    var bar = group2.create(pivotX,pivotY,'atlas.game','box')
                    bar.scale.x*= 1.6
                    bar.scale.y*= -1
                    bar.tint = levelColors[i][2]
                    bar.anchor.setTo(0,0.5)

                    pivotX+= bar.width - 1
                    pivotY-= 75
                }
            }else if(i == 8){
                
                createPlanet(planetGroup,game.world.centerX - 200,game.world.centerY - 50,200,0x65005f)
                createPlanet(planetGroup,game.world.centerX + 200,game.world.centerY - 50,200,0x65005f)
                
                var pivotGY = game.world.height - 100
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.7

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 6; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','diamond')
                        bar.anchor.setTo(0.5,0.5)
                        bar.scale.setTo(2,2)
                        bar.tint = levelColors[i][3]
                        bar.x-= bar.width
                        
                        if(o==1){
                            bar.scale.y*= -1
                        }                            
                        
                        pivotX+=bar.width
                        
                        if(u == 2){
                            pivotX-= bar.width * 2.5
                            pivotY-= bar.height * 0.5
                        }else if(u == 4){
                            pivotX = game.world.centerX + bar.width
                            pivotY-= bar.height * 0.5
                        }
                    }
                    
                    pivotGY-= game.world.height * 1.5
                }
            }else if(i == 9){
                
                createPlanet(planetGroup,game.world.centerX, game.world.centerY + 150,500,0xa2ff66)
                var pivotGY = game.world.height - 200
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.4

                    pivotX = 0
                    pivotY = 0
                    
                    for(var u = 0; u < 4; u++){
                        //var bar = game.add.tileSprite(pivotX, pivotY, game.world.width * 1.4,316,'atlas.game','small_waves')
                        var bar = group1.create(pivotX, pivotY,'atlas.game','small_waves')
                        bar.anchor.setTo(0,0.5)
                        bar.scale.setTo(2,2)
                        bar.tint = levelColors[i][2]
                        group1.add(bar)
                        
                        var bar2 = group1.create(bar.x + bar.width -1.5, pivotY,'atlas.game','small_waves')
                        bar2.anchor.setTo(0,0.5)
                        bar2.scale.setTo(2,2)
                        bar2.tint = levelColors[i][2]
                        group1.add(bar2)
                        
                        if((u+1) % 2 == 0){
                            bar.x-= 75
                            bar2.x-= 75
                        }
                            
                        if(o==1){
                            bar.scale.y*= -1
                            bar2.scale.y*= -1
                        }
                            
                        
                        pivotY-= bar.height * 0.3
                    }
                    
                    pivotGY-= game.world.height * 1.4
                }
            }else if(i == 10){
                
                createPlanet(planetGroup,game.world.centerX, game.world.centerY + 150,500,0x00f862)
                createPlanet(planetGroup,game.world.centerX, game.world.centerY -300,200,0x00f862)
                var pivotGY = game.world.height - 200
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.3

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 3; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','triangles')
                        //bar.width = game.world.width
                        bar.scale.setTo(2,2)
                        bar.anchor.setTo(0.5,0.5)
                        bar.tint = levelColors[i][2]
                        
                        if(o==1){
                            bar.scale.x*= -1
                            bar.scale.y*= -1
                        }
                            
                        
                        pivotY-= 100
                    }
                    
                    pivotGY-= game.world.height * 1.2
                }
            }else if(i == 11){
                
                var bigWorm = gameGroup.create(game.world.centerX,game.world.centerY,'atlas.game','earthworm')
                bigWorm.anchor.setTo(0.5,0.5)
                bigWorm.scale.setTo(2,2)
                bigWorm.alpha = 0.2
                bigWorm.tint = 0x910013
                
                var bigWorm = gameGroup.create(game.world.centerX +100,game.world.centerY + 100,'atlas.game','earthworm')
                bigWorm.anchor.setTo(0.5,0.5)
                bigWorm.scale.setTo(2,2)
                bigWorm.alpha = 0.2
                bigWorm.tint = 0x910013
                
                var pivotGY = game.world.height - 100
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.1

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 5; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','small_waves_2')
                        bar.scale.setTo(2,2)
                        //bar.width = game.world.width
                        bar.anchor.setTo(0.5,0.5)
                        bar.tint = levelColors[i][2]
                        
                        if(o==1){
                            bar.scale.x*= -1
                            bar.scale.y*= -1
                        }
                            
                        
                        pivotY-= 75
                    }
                    
                    pivotGY-= game.world.height * 1
                }
            }else if(i == 12){
                
                pivotX = game.world.centerX - 250
                for (var u = 0; u < 3; u++){
                    
                    var diamond = gameGroup.create(pivotX,game.world.centerY,'atlas.game','diamond')
                    diamond.anchor.setTo(0.5,0.5)
                    diamond.alpha = 0.2
                    diamond.tint = 0xffec76
                    diamond.scale.setTo(0.8,0.8)
                    pivotX+= 250
                    if(u == 1)
                        diamond.scale.setTo(0.8,0.8)
                }
                
                var pivotGY = game.world.height - 200
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.3

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 3; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','mountains')
                        //bar.width = game.world.width
                        bar.anchor.setTo(0.5,0.5)
                        bar.scale.setTo(2,2)
                        bar.tint = levelColors[i][2]
                        
                        if(o==1){
                            bar.scale.x*= -1
                            bar.scale.y*= -1
                        }
                            
                        
                        pivotY-= 100
                    }
                    
                    pivotGY-= game.world.height * 1
                }
            }else if(i == 13){
                
                createPlanet(planetGroup,game.world.centerX, game.world.centerY,110,0xffec76)
                createPlanet(planetGroup,game.world.centerX - 225, game.world.centerY - 100,110,0xffec76)
                createPlanet(planetGroup,game.world.centerX + 225, game.world.centerY - 100,110,0xffec76)
                
                var pivotGY = game.world.height - 350
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.3

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 2; u++){
                        
                        var bar = group1.create(pivotX,pivotY,'atlas.game','planet_system')
                        bar.scale.setTo(2,2)
                        bar.anchor.setTo(0.5,0.5)
                        bar.tint = levelColors[i][2]
                        
                        if(u == 1){
                            bar.scale.setTo(1.4,1.4)
                        }
                        
                        if(o==1){
                            bar.scale.y*= -1
                        }
                            
                        
                        pivotY-= 60
                    }
                    
                    pivotGY-= game.world.height * 0.8
                }
                
            }else if(i == 14){
                
                createPlanet(planetGroup,game.world.width, game.world.height,800,0xffec76)
                createPlanet(planetGroup,game.world.centerX - 200, game.world.centerY - 100,150,0xffec76)
                
                var pivotGY = game.world.height + 100
                for(var o = 0 ; o < 2;o++){
                    
                    var group1 = game.add.group()
                    barsGroup.add(group1)
                    
                    group1.y = pivotGY
                    group1.initY = group1.y
                    
                    if(o==1)
                        group1.alpha = 0.4

                    pivotX = game.world.centerX
                    pivotY = 0
                    
                    for(var u = 0; u < 3; u++){
                        var bar = group1.create(pivotX,pivotY,'atlas.game','hexagon')
                        //bar.width = game.world.width
                        bar.scale.setTo(2,2)
                        bar.anchor.setTo(0.5,0.5)
                        bar.tint = levelColors[i][2]
                        
                        if(o==1){
                            bar.scale.y*= -1
                        }
                            
                        
                        pivotY-= 125
                    }
                    
                    pivotGY-= game.world.height * 1.4
                }
            }else{
                
                createPlanet(planetGroup,game.world.width, game.world.height)            
            
            }
        }
        
        levelText = game.add.bitmapText(0,game.world.height - 50,'roundsBlack','',20)
        levelText.tint = 0xffffff
        levelText.anchor.setTo(0,1)
        levelText.alpha = 0
        overlayGroup.add(levelText)
        
        fpsText = game.add.bitmapText(game.world.width - 10,15,'roundsBlack','fps: 0',20)
        fpsText.anchor.setTo(1,0)
        overlayGroup.add(fpsText)
        
        stars = game.add.tileSprite(0,-game.world.height,game.world.width * 4,game.world.height * 2,'atlas.game','stars')
        stars.angle = 45
        sceneGroup.add(stars)
        
	}
    
    function createPlanet(group, posX, posY, size,colorUsed){
        
        var colorToUse = colorUsed || 0xffffff
        var sizeToUse = size || game.world.height * 1.1
        var planet = game.add.graphics(0,0)
        planet.beginFill(colorToUse)
        planet.alpha = 0.1
        planet.drawCircle(posX,posY,sizeToUse)
        planet.endFill()
        group.add(planet)
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
			particle.start(true, 1500, null, 6)
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
                particle.minParticleSpeed.setTo(-400, -400);
                particle.maxParticleSpeed.setTo(400,400);
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
	
	function gameeActions(){
		
		gamee.emitter.addEventListener("pause", function(event) {
			
			game.paused = true
			event.detail.callback();
		}); 

		gamee.emitter.addEventListener("resume", function(event) {
			
            if(unmuteSong){
                sound.play("gameSong",{loop:true,volume:0.5})
                unmuteSong = false
            }
            
			game.paused = false
			event.detail.callback();
		});

		gamee.emitter.addEventListener("mute", function(event) {
			
            sound.stop("gameSong")
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
        
        backgrounds.forEach(function(group){
            
            group.alpha = 0
            group.active = false
            group.barsGroup.forEach(function(group){
                group.y = group.initY
            })
            group.startColor.alpha = 0
        })
        
        //indexBackground = 0
        changeImage(indexBackground,backgrounds)
        
        levelNumber.active = false
        levelNumber.obstacle.active = false
        
        worldGroup.y = 0        
        spike.alpha = 0
        spike.angle = 0
        
        balloon.scale.setTo(balloon.origScale, balloon.origScale)
        balloon.alpha = 1
        balloon.angle = 0
                
        balloon.x = game.world.centerX
        balloon.y = game.world.height * 0.8
        
        balloon.col.body.x = balloon.x
        balloon.col.body.y = balloon.y + 3
        
        circleBarrier.body.x = balloon.x
        circleBarrier.body.y = balloon.y - 300
        circleBarrier.scale.setTo(circleBarrier.originalScale,circleBarrier.originalScale)
        circleBarrier.alpha = 1
        circleBarrier.invincible = false
        setBarrierPhysics()
        
        emptyGroup(obstaclesGroup,usedObstacles)
        emptyGroup(itemsGroup,usedItems)
                
        sound.play("gameSong",{loop:true,volume:0.5})
        
	}
        
    function emptyGroup(group,usedGroup){
        
        while(usedGroup.length > 0){
            var obj = usedGroup.children[0]
            deactivateObject(obj,group,usedGroup)
        }
    }
    
    function deactivateObject(obj,group,usedGroup){
        
        if(obj.body){
            
            var objBody = obj.body
            //console.log(objBody.gravityScale + ' gravityScale')
            objBody.gravityScale = 0
            objBody.setZeroVelocity()
            objBody.setZeroRotation()
            objBody.x = -game.world.width
            objBody.kill()
        }
        
        
        if(obj.friend){
            obj.friend.active = false
            obj.friend.alpha = 0
            friendsGroup.add(obj.friend)
            obj.friend = null
        }
        
        obj.active = false
        obj.alpha = 0
        usedGroup.remove(obj)
        group.add(obj)
        
    }
	
	function show(){
        
		cancelTweens()
		restartAssets()
		sceneloader.socialRequest(createFriendsImages,game,10)
		initialize()
        
        console.log(sceneloader.showTutorial() + ' showTut')
        if(showTutorial && sceneloader.showTutorial()){
            startTutorial()
        }else{
            
            tutorialGroup.globe.alpha = 0
            tutorialGroup.barrier.alpha = 0
            animateScene()
        }
		
	}
    
    function startTutorial(){
        
        whiteFade.alpha = 0
        tweensList.push(game.add.tween(whiteFade).from({alpha:1},500,"Linear",true))
        
        var indexChoose = [0,2,4,7,9,11]
        indexBackground = Phaser.ArrayUtils.getRandomItem(indexChoose)
        game.stage.backgroundColor = levelColors[indexBackground][0]
        
        var back = backgrounds.list[indexBackground]
        back.startColor.alpha = 1
        
        circleBarrier.alpha = 0
        balloon.alpha = 0
        
        var hand = tutorialGroup.hand
        var barrier = tutorialGroup.barrier
        var obstacle = tutorialGroup.obstacle
        var globe = tutorialGroup.globe
        
        barrier.y = game.world.centerY
        hand.alpha = 0
        obstacle.angle = 0
        
        globe.angle = 5
        globe.tween = game.add.tween(globe).to({angle:-5},750,"Linear",true,0,-1)
        globe.tween.yoyo(true,0)
        
        obstacle.reset(game.world.centerX, -200)
        changeImage(0,globe)
        
        var tween = game.add.tween(obstacle).to({y:barrier.y - 250},2000,"Linear",true)
        tweensList.push(tween)
        
        tween.onComplete.add(function(){
            
            winkObject(globe,100)
            changeImage(1,globe)
            
            hand.y = barrier.y + 15
            
            tween = game.add.tween(hand).to({alpha:1},200,"Linear",true,0,4)
            tweensList.push(tween)
            tween.onComplete.add(function(){
                
                tweensList.push(game.add.tween(barrier).to({y:barrier.y - 150},500,"Linear",true))
                tweensList.push(game.add.tween(obstacle).to({y:obstacle.y + 50},500,"Linear",true))
                tween = game.add.tween(hand).to({y:barrier.y - 125},500,"Linear",true)
                tweensList.push(tween)
                
                tween.onComplete.add(function(){
                    
                    winkObject(globe,100)
                    changeImage(2,globe)
                    
                    sound.play("magic")
                    
                    sound.play('drum1')
                    createPart('ouch',barrier)
                    
                    tween = game.add.tween(obstacle).to({x:-200,y:obstacle.y - 250, angle:obstacle.angle - 270},1000,"Linear",true)
                    tweensList.push(tween)
                    
                    timerList.push(game.time.events.add(2300,function(){
                        
                        console.log('start')
                        globe.tween.stop()
                        circleBarrier.alpha = 1
                        balloon.alpha = 1
                        
                        showTutorial = false
                        tutorialGroup.alpha = 0

                        gamee.gameSave("tutorialDone")
                        animateScene()
                    }))
                        
                        
                })
            })
        })
        
    }
    
    function winkObject(obj,timeUsed){
        
        sound.play("cut")
        
        var tween = game.add.tween(obj.scale).to({x:obj.scale.x * 0.6, y:obj.scale.y * 0.6},timeUsed,"Linear",true,0,0)
        tween.yoyo(true,0)
        
        tweensList.push(tween)
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
		
        var scoreToCheck = gameScore + 60
		for(var i = 0; i < friendsGroup.length;i++){
			
			var friend = friendsGroup.children[i]
			
			//console.log(friend.score + ' fScore ' + scoreToCheck + ' scoreToCheck ' + gameScore + ' gameScore')
			if(friend.score < scoreToCheck && friend.score >= gameScore && friend.active && friend.score > lastScore){
				return friend
			}
		}
				
	}
    
	function createFriendsImages(){
		
		//console.log('creating social images')
		
		socialList = sceneloader.getSocialInfo()
		var initScore = 1
		
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
			//group.score = initScore
            
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

			if(game.cache.checkImageKey(player.name)){
				
				var friend = playerGroup.create(0,0,name)
                getSpriteSize(90,friend)
                friend.anchor.setTo(0.5,0.5)

				playerGroup.friend = friend			
				friend.mask = playerGroup.maskUsed
			}
            
            playerGroup.remove(playerGroup.bubble)
			playerGroup.add(playerGroup.bubble)
            
        }
        
        if(playerGroup.friend){
            tweensList.push(game.add.tween(playerGroup).to({alpha:1},500,"Linear",true))
        }
	}
    
    function getSpriteSize(size,sprite){
        
        sprite.width = (sprite.width * size)/ sprite.height
        sprite.height = size
        
        while(sprite.width < 90){
            
            sprite.width+= sprite.width * 0.1
            sprite.height+= sprite.height * 0.1
        }
    }
    
    function createFriendsGUI(){
        
        playerInfoGroup = game.add.group()
        sceneGroup.add(playerInfoGroup)
        
        playerInfoGroup.x = 100
        playerInfoGroup.y = 100
        
        playerInfoGroup.alpha = 0
        
        var textName = game.add.bitmapText(playerGroup.width * 0.7,0,'roundsBlack','',20)
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
        
        //playerGroup.scale.setTo(0.8,0.8)
        playerGroup.x = 2
        playerGroup.y= 4
        balloon.addChild(playerGroup)
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
        bubble.alpha = 0
		group.bubble = bubble
		
		return group
	}
	
    function inputButton(obj){
        
        if(!gameActive || !buttonsActive || buttonPressed){
            return
        }
        
        buttonPressed = true
        buttonsActive = false
        
    }
    
    function outputButton(obj){
        
        if(!gameActive || sideTag != obj.tag || !buttonPressed){
            return
        }
        
    }
    
    function checkDistance(obj1,obj2) {

        return Phaser.Math.distance(obj1.world.x, obj1.world.y, obj2.world.x, obj2.world.y)

    }
    
    function createNames(){
        
        var button = sceneGroup.create(game.world.centerX, 135,'atlas.game','btn')
        button.anchor.setTo(0.5,0.5)
        button.scale.setTo(1.8,1.2)
        button.events.onInputDown.add(inputButton)
        button.inputEnabled = true
        
        var gameOverText = game.add.bitmapText(button.x, button.y, 'roundsBlack', 'Game Over', 40);
        gameOverText.tint = 0xffffff    
        gameOverText.anchor.setTo(0.5,0.5)
        sceneGroup.add(gameOverText)
        
        textPlayer = game.add.bitmapText(game.world.centerX - 150,250, 'roundsBlack', 'Player', 50);
        textPlayer.tint = 0x000000
        textPlayer.anchor.setTo(0.5,0.5)
        sceneGroup.add(textPlayer)
        
        textFriends = game.add.bitmapText(game.world.centerX + 150,textPlayer.y, 'roundsBlack', 'Friends', 50);
        textFriends.tint = 0x000000
        textFriends.anchor.setTo(0.5,0.5)
        sceneGroup.add(textFriends)
        
    }
    
    function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',1)
		createParticles('wrong',1)
		createParticles('ouch',1)
		createParticles('text',2)
	}
    
    function createBalloon(){
        
        balloon = overlayGroup.create(0,0,'atlas.game','balloon')
        balloon.anchor.setTo(0.5,0.3)
        balloon.scale.setTo(0.8,0.8)
        balloon.origScale = balloon.scale.x
        
        //balloon.inputEnabled = true
        balloon.events.onInputDown.add(changeDifficulty)
        
        var circleCol = sceneGroup.create(0,-3,'atlas.game','circle')
        circleCol.anchor.setTo(0.5,0.5)
        circleCol.scale.setTo(2,2)
        circleCol.tint = 0x000000
        circleCol.alpha = 0
        
        balloon.col = circleCol
        
        game.physics.box2d.enable(circleCol)
        circleCol.body.setCircle(circleCol.width * 0.5)
        circleCol.body.kinematic = true
        
    }
    
    function changeDifficulty(){
    
        if(!gameActive){
            return
        }
        
        sound.play("pop")
        
        indexBackground++
        restartAssets()
        addLevel()
        setObstacle(true)
    }
    
    function createBarrier(){
        
        spike = overlayGroup.create(0,0,'atlas.game','spike')
        spike.anchor.setTo(0.5,0.5)
        spike.alpha = 0
        
        circleBarrier = overlayGroup.create(game.world.centerX,game.world.centerY,'atlas.game','circleBarrier')
        circleBarrier.scale.setTo(0.7,0.7)
        circleBarrier.originalScale = circleBarrier.scale.x
        circleBarrier.anchor.setTo(0.5,0.5)
        
        setBarrierPhysics()
        
    }
    
    function setBarrierPhysics(){
        
        game.physics.box2d.enable(circleBarrier)
        circleBarrier.body.setCircle(circleBarrier.width * 0.3);
        circleBarrier.body.collideWorldBounds = true;
        //circleBarrier.body.fixedRotation = true;
        //circleBarrier.body.mass = 0.5
        //circleBarrier.body.linearDamping = 100000
        
        game.input.onDown.add(mouseDragStart, this);
        game.input.addMoveCallback(mouseDragMove, this);
        game.input.onUp.add(mouseDragEnd, this);
    }
    
    function mouseDragStart() {
        
        if(!gameActive)
            return
            
        initX = game.input.activePointer.x - circleBarrier.x
        initY = game.input.activePointer.y - circleBarrier.y
        
        var point = {x:circleBarrier.x,y:circleBarrier.y}
        
        game.physics.box2d.mouseDragStart(point);
    }

    function mouseDragMove() {
        
        if(!gameActive)
            return
            
        var point = {x: game.input.x - initX, y: game.input.y - initY}
        game.physics.box2d.mouseDragMove(point);

    }

    function mouseDragEnd() {

        game.physics.box2d.mouseDragEnd();

    }
    
    function getNumberOfPieces(){
        
        numPiecesList = []
        var levelCheck = []
        
        for(var i = 0; i < obstaclesType.length;i++){
            
            numPiecesList[i] = 0
            var obstacleName = obstaclesType[i]
            levelCheck = [levelList.easyLevels, levelList.mediumLevels, levelList.hardLevels]
            
            for(var u = 0; u < levelCheck.length;u++){
                
                for(var o = 0; o < levelCheck[u].length;o++){
                    
                    var level = levelCheck[u][o]
                    var numberUsed = 0
                    for(var e = 0; e < level.length;e++){
                        
                        for(var x = 0; x < level[e].length;x++){
                            
                            var pieceName = level[e][x]
                            if(obstacleName == pieceName)
                                numberUsed++
                        }
                        
                    }
                    
                    if(numPiecesList[i] < numberUsed){
                        numPiecesList[i] = numberUsed
                    }                    
                }
            }
            
            //console.log(obstacleName + ' - ' + numPiecesList[i])
        }
    }
    
    function createObstacles(){
        
        getNumberOfPieces()
        
        obstaclesGroup = game.add.group()
        sceneGroup.add(obstaclesGroup)
        
        usedObstacles = game.add.group()
        overlayGroup.add(usedObstacles)
        
        for(var i = 0; i < obstaclesType.length; i++){
            
            //console.log(obstaclesType[i] + ' - ' + numPiecesList[i])
            for(var u = 0; u < numPiecesList[i]; u++){
                
                var imageName = obstaclesType[i]
                var type = imageName
                
                if(imageName == 'bar')
                    imageName = 'square'
                
                var obstacle = obstaclesGroup.create(-500,0,'atlas.game',imageName)
                obstacle.anchor.setTo(0.5,0.5)
                obstacle.active= false
                obstacle.tag = type

                game.physics.box2d.enable(obstacle)
                
                var obW = obstacle.width
                var obH = obstacle.height
                if(type == 'circle'){
                    obstacle.body.setCircle(obW * 0.5)
                }else if(type == 'triangle'){
                    obstacle.body.setPolygon([-obW * 0.5,obH * 0.5,0,-obH * 0.5,obW * 0.5,obH * 0.5])
                }else if(type == 'rhombus'){
                    obstacle.body.setPolygon([-obW * 0.5, 0, 0,-obH * 0.5,obW * 0.5,0,0,obH * 0.5])
                }else if(type == 'cross'){
                    obstacle.body.setPolygon([-obW * 0.20, obH * 0.5,-obW * 0.20 , obH * 0.20,-obW * 0.5, obH * 0.20,-obW * 0.5,-obH * 0.20,
                                             -obW * 0.20,-obH * 0.20,-obW * 0.20,-obH * 0.5,obW * 0.20, -obH * 0.5,obW * 0.20, -obH * 0.20,obW * 0.5, -obH * 0.20,
                                              obW * 0.5,obH * 0.20,obW * 0.20,obH * 0.20,obW * 0.20, obH * 0.5])
                }
                
                if(type == 'bar'){
                    //obstacle.body.kinematic = true
                    obstacle.tint = 0x000000
                    obstacle.body.mass = 1000000000000000000000
                }
                    
                obstacle.body.setCollisionCategory(2)
                //obstacle.body.bullet = true
                obstacle.body.kill()
                obstacle.body.setCategoryContactCallback(2, activateObstacle, this);

                obstacle.body.collideWorldBounds = false;
                
            }
            
            
        }
        
        circleBarrier.body.setCategoryContactCallback(2, activateObstacle, this);
        //circleBarrier.body.collides(obstaclesCollisionGroup, activateObstacle, this);
    }
    
    function activateObstacle(body1, body2){
                    
        //console.log('activate Obstacle')
        if(!body1.sprite.tag && canSound && gameActive){
            
            sound.play("drum" + game.rnd.integerInRange(1,2))
            
            canSound = false
            timerList.push(game.time.events.add(250,function(){
                canSound = true
            }))
        }
            
        
        if(body2.sprite.tag && body2.sprite.tag != 'bar'){
            body2.gravityScale = 3
            //console.log('gravity grow')
        }
            
    }
    
    function movePointer(pointer){
		
		if(!gameActive || !setInitPos){
			return
		}
		
		/*var follow = false
		
		if(game.device.desktop){
			
			if(game.input.activePointer.isDown){
				follow = true	
			}
		}else{
			follow = true
		}
		
		if(follow){
			
			/*circleBarrier.body.x = pointer.x - initX
			circleBarrier.body.y = pointer.y - initY
            //accelerateToObject(circleBarrier,pointer.x - initX,pointer.y - initY,15)
            
            /*if(circleBarrier.body.x < (0 + circleBarrier.width * 0.5)){
                circleBarrier.body.x = 0
            }
            
            if(circleBarrier.body.x > game.world.width){
                circleBarrier.body.x = game.world.width
            }
            
            //var point = {x:pointer.x - initX,y:pointer.y - initY}
            //game.physics.box2d.mouseDragMove(game.input.mousePointer);
		}*/
		
	}
    
    function createLevelNumber(){
        
        levelNumber = game.add.bitmapText(0,0, 'roundsBlack', '0', 100);
        levelNumber.anchor.setTo(0.5,0.5)
        levelNumber.alpha = 0
        overlayGroup.add(levelNumber)
        
        var obstacle = overlayGroup.create(-500,0,'atlas.game','square')
        obstacle.anchor.setTo(0.5,0.5)
        obstacle.scale.setTo(0.4,0.7)
        obstacle.alpha = 0

        game.physics.box2d.enable(obstacle)
        obstacle.body.setRectangle(levelNumber.width,levelNumber.height,0,-10)
        obstacle.body.kinematic = false
        obstacle.body.collideWorldBounds = false;
        obstacle.body.setCollisionCategory(2)
        obstacle.tag = 'levelText'
        obstacle.body.kill()
        
        levelNumber.obstacle = obstacle
    }
    
    function createItems(){
        
        itemsGroup = game.add.group()
        overlayGroup.add(itemsGroup)
        
        usedItems = game.add.group()
        overlayGroup.add(usedItems)
        
        itemNames = ['grow','spikeItem']
        for(var i = 0; i < itemNames.length;i++){
            
            var item = itemsGroup.create(0,0,'atlas.game',itemNames[i])
            item.anchor.setTo(0.5,0.5)
            item.alpha = 0
            item.active = false
            item.tag = itemNames[i]
        }
        
    }
    
    function render() {
        
        //game.time.physicsElapsed = 1 / game.time.fps;
        //game.debug.box2dWorld();
    }
    
    function createWhiteFade(){
        
        whiteFade = new Phaser.Graphics(game)
        whiteFade.alpha = 0
        whiteFade.beginFill(0xffffff)
        whiteFade.drawRect(0,0,game.world.width, game.world.height)
        whiteFade.endFill()
        overlayGroup.add(whiteFade)
    }
    
    function createTutorial(){
        
        tutorialGroup = game.add.group()
        overlayGroup.add(tutorialGroup)
        
        var handTut = tutorialGroup.create(game.world.centerX, game.world.centerY + 100,'atlas.game','hand')
        handTut.alpha = 0
        handTut.scale.setTo(0.7,0.7)
        handTut.anchor.setTo(0.4,0.2)
        tutorialGroup.hand = handTut
        
        var globeGroup = game.add.group()
        globeGroup.x = game.world.centerX
        globeGroup.y = game.world.height - 150
        globeGroup.scale.setTo(0.8,0.8)
        tutorialGroup.add(globeGroup)
        tutorialGroup.globe = globeGroup
        
        for(var i = 1; i < 4; i++){
            
            var globeImage = globeGroup.create(0,0,'atlas.game','balloon' + i)
            globeImage.anchor.setTo(0.5,0.5)
        }
        
        changeImage(0,globeGroup)
        
        var circle = tutorialGroup.create(game.world.centerX, game.world.centerY,'atlas.game','circleBarrier')
        circle.anchor.setTo(0.5,0.5)
        circle.scale.setTo(0.7,0.7)
        tutorialGroup.barrier = circle
        
        var obstacle = tutorialGroup.create(game.world.centerX, -200,'atlas.game','square')
        obstacle.anchor.setTo(0.5,0.5)
        tutorialGroup.obstacle = obstacle
    }
    
	return {
		
		assets: assets,
		name: "gameScene",
		update: update,
        preload:preload,
        render:render,
		create: function(event){
    		
            levelList = levels.getLevels()
            
            game.physics.startSystem(Phaser.Physics.BOX2D);
            game.physics.box2d.gravity.y = 150;
            game.physics.box2d.restitution = 0.2;
            game.physics.box2d.setBoundsToWorld();
            
            game.time.advancedTiming = true;
            //game.physics.box2d.useElapsedTime = true;
            
            //game.input.addMoveCallback(movePointer, this);
            
            lastScore = 0
            showTutorial = true
			game.stage.backgroundColor = "#ffffff"
			
			tweensList = []
			timerList = []
			
			sceneGroup = game.add.group()
            
            overlayGroup = game.add.group()
            
            createBackground()
            
            worldGroup = game.add.group()
            sceneGroup.add(worldGroup)
            
            createBalloon()
            createBarrier()
            createObstacles()
            createItems()
            createLevelNumber()
            createWhiteFade()
            createTutorial()
            
            sceneGroup.add(overlayGroup)
            
			createFriendsGroup()
            createFriendsGUI()
                        
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