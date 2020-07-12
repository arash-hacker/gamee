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