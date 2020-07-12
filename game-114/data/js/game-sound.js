// =============================================================================
// ***** GAME: PINIT *****
// =============================================================================

var audio = {};

function loadSounds() {
  loadSound("pin");
  loadSound("collision");
  loadSound("level");
}

function loadSound(id) {
 try {
    audio[id] = document.createElement("audio");;
    audio[id].src = soundSrc[id].src;
    audio[id].play();
    audio[id].pause();
  } catch(e) {
    // ignore
  }
}

function playSound(id) {
  setTimeout(function() { playSoundNow(id); }, 0);
}

function playSoundNow(id) {
 try {
    if (audio[id].play) {
        audio[id].currentTime = -0.1; 
        audio[id].play();
    }
  } catch(e) {
    // ignore
  }
}

