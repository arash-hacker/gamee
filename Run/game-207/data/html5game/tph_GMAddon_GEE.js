
// INIT callback object
var gmCallback = new Object();

// INIT Gamee
function gee_init()
{   
    if (typeof gamee !== "undefined")
    {        
    	/*
        // Controller OneButton
        var controller = gamee.controller.requestController('OneButton'); 
               
		controller.buttons.button.on('keydown', function() { gmCallback.gamee_onButtonPress(); });
		*/
		/*
		// Controller TwoButtons
        var controller = gamee.controller.requestController('TwoButtons');
        
        controller.buttons.left.on('keydown', function() { gmCallback.gamee_onLeftPress(); });
        controller.buttons.right.on('keydown', function() { gmCallback.gamee_onRightPress(); }); 	
		*/
        // Callbacky
        gamee.onPause = 	function() { gmCallback.gee_on_pause(); };
        gamee.onUnpause = 	function() { gmCallback.gee_on_resume(); };        
        gamee.onResume = 	function() { gmCallback.gee_on_resume(); };
        gamee.onRestart = 	function() { gmCallback.gee_on_restart(); };
        gamee.onStop = 		function() { gmCallback.gee_on_stop(); };
        gamee.onMute = 		function() { gmCallback.gee_on_mute(); };
        gamee.onUnmute = 	function() { gmCallback.gee_on_unmute(); };
		
		return 1;
    }  
	return 0;  
}

// Callbacks
function gee_callback_script(extName, numArgs)
{
    if (gmCallback[extName] !== undefined)
        return 1;

    var obFunc = window["gee_callback_script"].caller.name;

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

    return 0;
}

function gee_callback_script_define(extname, gmScript)
{
	if(gmCallback[extname] != undefined)
	{
		return 1;
	}	
	return 0;
}

// Game Load
function gee_game_loaded()
{
	if (typeof gamee !== "undefined")
    {
        gamee.gameLoaded();     
		return 1; 
    }
	return 0;
}

// Game Start
function gee_game_start()
{
    if (typeof gamee !== "undefined")
    {
        gamee.gameStart();     
		return 1; 
    }
	return 0;
}

// Game Over
function gee_game_over()
{
    if (typeof gamee !== "undefined")
    {
        gamee.gameOver();     
		return 1; 
    }
	return 0;
}

// SET Score
function gee_score_set(score)
{
	if (typeof gamee !== "undefined")
    {
        gamee.score = score; 
		return 1; 
    }
	return 0;
}

// LOADING BAR
function gee_draw_loading_bar(_graphics, _width, _height, _total, _current, _loadingscreen)
{   
	//Hide scroll bar
	document.documentElement.style.overflow = 'hidden';
	
    //Set window size
    _width = window.innerWidth;
    _height = window.innerHeight;
       
    //Clear background
    _graphics.fillStyle = "#FFFFFF";
    _graphics.fillRect(0, 0, _width, _height);
    
    //Loading bar size
    var barW = Math.round(_width / 4);
    var barH = Math.max(Math.round(_height / 40), 4);
    var barX = Math.round((_width - barW) / 2);
    var barY = Math.round((_height - barH) / 2);    
    
    //Background
    _graphics.fillStyle = "rgba(0, 0, 0, 0.5)";
    _graphics.fillRect(barX, barY, barW, barH);
    
    //Fill frame 
    var fillW = Math.round((_current / _total) * barW);        
    
    if (fillW !== 0)
    {
        _graphics.fillStyle = "#000000";
        _graphics.fillRect(barX, barY, fillW, barH);
    }    
}
