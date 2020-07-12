// =============================================================================
// ***** GAME: PINIT *****
// =============================================================================

// uses HTML5 audio tag or bgsound tag for IE
function playSound(src) {
  var audio1 = document.createElement("audio");
  if (audio1.play) {
      audio1.src = src;
      audio1.loop = false;
      audio1.play();
  }
  else {
    if (navigator.appName == "Microsoft Internet Explorer") {
      var audio2 = document.createElement("bgsound");
        audio2.src = src;
        audio2.loop = "1";
        audio2.volume = "0";
        getHtmlEl("sound").innerHTML = "";
        getHtmlEl("sound").appendChild(audio2);
    }
  }
}
