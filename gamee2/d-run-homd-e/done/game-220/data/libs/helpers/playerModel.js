var playerModel = function () {
    var playerInfo = {
        coins:0,
        impulse:85000,
        speedLimit:-1400,
        bulletsNumber:5,
        bulletLimit:10,
        bulletLevel:0,
        impulseLevel:0,
        impulseLimit:5,
        bestScore:0,
    }
    
    var initialInfo = {
        coins:0,
        impulse:85000,
        speedLimit:-1400,
        bulletsNumber:5,
        bulletLimit:10,
        bulletLevel:0,
        impulseLevel:0,
        bestScore:0,
    }
    
	function getPlayer(){

		return playerInfo

	}
    
    function setPlayer(data){
        
        var parsedData = JSON.parse(data)
        console.log(parsedData)
        
        playerInfo = parsedData
    }
    
    function restartInfo(){
        playerInfo = initialInfo
    }
    
	return{
		getPlayer:getPlayer,
        setPlayer:setPlayer,
	}
		
}()