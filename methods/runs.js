
console.log("score3",score)
var tmp=""
tmp +=  score 
$("#score").html(tmp)
// ===============================part1

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous" ></script>


// ===============================part2

<div style="    position: absolute;
top: 0px;
width: 100%;
display: flex;
justify-content: space-between;"  >
    <div>
      <div class="" style="margin-bottom: 5px;">
        <button
          style="width: 100%; font-size: 0.8rem; text-align: center;"
          type="button"
          class="SeeMore2 btn btn-success"
        onclick=	"gamee.onRestart()"
        >
          شروع
        </button>
      </div>
</div>
<div>
  <div class="" style="margin-bottom: 5px;">
    <button
      style="width: 100%; font-size: 0.8rem; text-align: center;"
      type="button"
      class="btn btn-danger"
      onclick=gamee.onPause()
    >
      وقفه
    </button>
  </div>

  <div class="" style="margin-bottom: 5px;">
    <button
      style="width: 100%; font-size: 0.8rem; text-align: center;"
      type="button"
      class="btn btn-warning"
      onclick=gamee.onResume()
    >
      ادامه
    </button>
  </div>
  <div class="" style="margin-bottom: 5px;">
    <button
      style="width: 100%; font-size: 0.8rem; text-align: center;"
      type="button"
      class="btn btn-white"
      onclick=gamee.onMute()
    >
      بی صدا
    </button>
  </div>    <div class="" style="margin-bottom: 5px;">
    <button
      style="width: 100%; font-size: 0.8rem; text-align: center;"
      type="button"
      class="btn btn-info"
      onclick=gamee.onUnmute()
    >
      با صدا
    </button>
  </div>

  <div id="done">	<button 
    style=" width: 100%;
    font-size: 0.8rem;
    text-align: center;"
      class="btn btn-success"
    type="button"   id="score"> 0</button></div>
</div>
</div>


//<<<<<=======================method--1==================================>>>>>>>\\
setTimeout(() => {
  gmCallback.gamee_onStart();
}, 1000);
//<<<<<=======================method--2==================================>>>>>>>\\
// $('#ToDoList').on('click', "input[name='todo']", function() { ... });
$("#stGame").click(function(){

setTimeout(() => {
    gameeState=2
    gmCallback["gamee_onPause"]()
    console.log("dd")     
    }, 500);        
           
      
    })
    $("#ResGame").click(function(){

setTimeout(() => {
  gameeState=2
  gmCallback["gamee_onResume"]()
      
  }, 500);        
         
    
  })

  $("#newgame").click(function(){
    setTimeout(() => {
        gameeState=1
        gmCallback["gamee_onStart"]();
  
    
    }, 1000);
})

//<<<<<=======================method--3==================================>>>>>>>\\

$("#newgame").click(function(){
    setTimeout(() => {
        gameeState=1
        gmCallback["gamee_onStart"]();
  
    
    }, 1000);
})

setInterval(() => {
console.log(_f7._79)
var tmp=""
tmp +=`
<button 
        style=" width: 100%;
        font-size: 0.8rem;
        text-align: center;"
            class="btn btn-success"
        type="button"   id="score"> `+ _f7._79 +`
</button>
`
$("#done").html(tmp)
}, 500);

//<<<<<=======================method--4==================================>>>>>>>\\
onclick=gamee.onRestart()
// for auto start and fail and restart

//<<<<<=======================method--5==================================>>>>>>>\\


onclick="gmCallback.gee_on_restart()"
//<<<<<=======================method--5==================================>>>>>>>\\

function doGame(s) {
  console.log("defineProperty._" + s)
 ["defineProperty._" + s](flags);
}
gameOver = function (score) {
  alert(score);
}

//<<<<<=======================method--6==================================>>>>>>>\\
onclick=game.startGame()

//<<<<<=======================method--7==================================>>>>>>>\\
onclick="Gamee2.Gamee._onStart.dispatch()"
//<<<<<=======================method--8==================================>>>>>>>\\