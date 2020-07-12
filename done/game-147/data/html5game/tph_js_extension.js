var gmCallback = new Object();


//-----------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------
function js_init()
{      
    // Gamee
	
	
    if (typeof gamee !== "undefined")
    {        
        // Controller OneButton		
		
        var controller = gamee.controller.requestController('OneButton');
		
		//return 2;
        
		controller.buttons.button.on('keydown', function() { gmCallback.gamee_onButtonPress(); });
		
		// Controller TwoButtons
        //var controller = gamee.controller.requestController('TwoButtons');
        //
        //controller.buttons.left.on('keydown', function() { gmCallback.gamee_onLeftPress(); });
        //controller.buttons.right.on('keydown', function() { gmCallback.gamee_onRightPress(); }); 	
		
        // Callbacky
        gamee.onPause = function() { gmCallback.gamee_onPause(); };
        gamee.onUnpause = function() { gmCallback.gamee_onResume(); };        
        gamee.onResume = function() { gmCallback.gamee_onResume(); };
        gamee.onRestart = function() { gmCallback.gamee_onRestart(); };
        gamee.onMute = function() { gmCallback.gamee_onMute(); };
        gamee.onUnmute = function() { gmCallback.gamee_onUnmute(); };
		
		return 1;
    }  
	return -1;  
}

function js_restart()
{
	location.reload();
  document.location.href = "";
 
	return 1;	
}

function js_type_gamee()
{
	return (typeof gamee);	
}

function js_type_gamee_native()
{
	//return (gameeNativeType);	
	return (typeof($gameeNative) + " " + $gameeNative.type);	
	//return (typeof($gameeNative));	
}



//-----------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------
function js_callbackScript(extName, numArgs)
{
    if (gmCallback[extName] !== undefined)
        return true;

    var obFunc = window["js_callbackScript"].caller.name;

    if (obFunc === undefined) //IE always makes things difficult.
        obFunc = arguments.callee.caller.toString().match(/function ([^\(]+)/)[1];

    var args = "";
    var gmres = "0,0";

    if (numArgs > 0)
    {
        while(numArgs > 0)
        {
            args = "arg"+numArgs+","+args;
            numArgs--;
        }

        args = args.slice(0,-1);
        gmres = gmres+",";
    }

    gmCallback[extName] = eval("(function("+ args +"){"+ obFunc +"("+ gmres + args +");})");

    return false;
}


//-----------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------
function js_callbackDefineScript(extname, gmScript)
{
	if(gmCallback[extname] != undefined)
	{return true;}
	
	return false;
}


function gamee_isAvailable()
{
    return (typeof gamee !== "undefined");
}


function gamee_gameStart()
{
    if (typeof gamee !== "undefined")
    {
        gamee.gameStart();     
		return true; 
    }
	return false;
}


function gamee_setScore(score)
{
    if (typeof gamee !== "undefined")
        gamee.score = score;
      
}


function gamee_gameOver()
{
    if (typeof gamee !== "undefined")
        gamee.gameOver();
}


function gamee_gameLoaded()
{
    if (typeof gamee !== "undefined")       
        gamee.gameLoaded();
}

function js_setScroll()
{
		document.documentElement.style.overflow = 'hidden';
		return true;
}

function js_iframeWidth() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  
  return myWidth;
}

function js_iframeHeight() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  
  return myHeight;
}

function js_drawLoadingBar(_graphics, _width, _height, _total, _current, _loadingscreen)
{   
	//Skryt scroll bary
	document.documentElement.style.overflow = 'hidden';
	
    // Pouzit skutecnou sirku a vysku okna
    _width = window.innerWidth;
    _height = window.innerHeight;
       
    // Vycistit pozadi
    _graphics.fillStyle = "#FFFFFF";
    _graphics.fillRect(0, 0, _width, _height);
    
    // Rozmer loading baru
    var barW = Math.round(_width / 4);
    var barH = Math.max(Math.round(_height / 40), 4);
    var barX = Math.round((_width - barW) / 2);
    var barY = Math.round((_height - barH) / 2);    
    
    // Pozadi
    _graphics.fillStyle = "rgba(0, 0, 0, 0.5)";
    _graphics.fillRect(barX, barY, barW, barH);
    
    // Vykreslit vypln   
    var fillW = Math.round((_current / _total) * barW);        
    
    if (fillW !== 0)
    {
        _graphics.fillStyle = "#000000";
        _graphics.fillRect(barX, barY, fillW, barH);
    }    
}
