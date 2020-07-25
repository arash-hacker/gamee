var sound = function(){

	decodedSounds = {}
	game = null
	var isMuted = false

	function init(gameContext){
		game = gameContext
	}
	
	function setSound(muted){
		isMuted = !muted
	}

	function decode(soundStringArray){
		console.log("Decoding Sounds...")
		for(var indexSound = 0; indexSound < soundStringArray.length; indexSound++){
			var currentSoundData = soundStringArray[indexSound]
			var currentLoadedAudio = game.add.audio(currentSoundData.name)
			decodedSounds[currentSoundData.name] = currentLoadedAudio
		}

		game.sound.setDecodedCallback(decodedSounds, function(){}, this)
	}

	function play(soundId, params){
		
		//console.log(soundId + ' soundId')
		if(isMuted){
			return
		}
		
		params = params || {}
		var pitch = params.pitch || 1
		var loop = params.loop
		var volume = params.volume || 1

		if(typeof decodedSounds[soundId] !== "undefined"){
			
			if (loop){
				game.sound.setDecodedCallback(decodedSounds[soundId], function(){
					decodedSounds[soundId].loopFull(volume)
				}, this);
			}else{
				decodedSounds[soundId].play()
				//decodedSounds[soundId]._sound.playbackRate.value = pitch
			}
			return decodedSounds[soundId]
		}else{
			console.warn("[Sound]"+"Not found Sound: "+soundId)
		}
	}

	function stop(soundId) {
		for(var key in decodedSounds){
			var sound = decodedSounds[soundId]
			if(sound)
				sound.stop()
		}
	}

	function stopAll() {
		for(var key in decodedSounds){
			var sound = decodedSounds[key]
			if(sound)
				sound.stop()
		}
	}

	return {
		decode: decode,
		init: init,
		play: play,
		stopAll:stopAll,
		setSound:setSound,
		stop:stop
	}

}()