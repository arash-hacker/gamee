
// INIT callback object
var gmCallback = new Object();

var socialResult = "{noFriends}";

// INIT Gamee
function gee_init(controllerType)
{   
	//console.log("gee_init");
	//console.log(gamee);
    if (typeof gamee !== "undefined")
    { 	
		var capabilities = ["socialData"];

		gamee.gameInit(controllerType, {}, capabilities, function(error, data) {
			if(error !== null)
				throw error;

			var myController = data.controller;
			if (controllerType=="OneButton")
			{	// Controller OneButton				   
				myController.buttons.button.on('keydown', function() { gmCallback.gee_on_press_button(); });
				myController.buttons.button.on('keyup', function() { gmCallback.gee_on_release_button(); });
				//console.log("Controller OneButton");
				//console.log(myController);				
			}
			if (controllerType=="TwoButtons")
			{	// Controller TwoButtons			
				myController.buttons.left.on('keydown', function() { gmCallback.gee_on_press_left(); });
				myController.buttons.right.on('keydown', function() { gmCallback.gee_on_press_right(); });
				myController.buttons.left.on('keyup', function() { gmCallback.gee_on_release_left(); });
				myController.buttons.right.on('keyup', function() { gmCallback.gee_on_release_right(); });  
				//console.log("Controller TwoButtons");
				//console.log(myController);
			}
			
			var sound = data.sound;
			//console.log("sound");
			//console.log(sound);

			// based on game capabilities, you will obtain additional data			
			var socialData = data.socialData;
			//console.log("socialData");
			//console.log(socialData);

			// your code that should make game ready
		});
		
		// Will be emitted when user will start game or restart it. 
		gamee.emitter.addEventListener("start", function(event) {
		   // your code to start
		   gmCallback.gee_on_restart();

		   event.detail.callback();
		}); 

		// Will be emitted when user paused the game. 
		gamee.emitter.addEventListener("pause", function(event) {
		   gmCallback.gee_on_pause();

		   event.detail.callback();
		}); 

		// Will be emitted after user resumes the game after 
		// pause or GameeApp suspension. 
		gamee.emitter.addEventListener("resume", function(event) {
		   gmCallback.gee_on_resume();

		   event.detail.callback();
		});

		// Will be emitted when user clicks the mute button 
		// and the game must mute all game sounds.
		gamee.emitter.addEventListener("mute", function(event) {
		   gmCallback.gee_on_mute();

		   event.detail.callback();
		});

		// Will be emitted when user clicks the unmute button
		// and the game should unmute all game sounds.
		gamee.emitter.addEventListener("unmute", function(event) {
		   gmCallback.gee_on_unmute();

		   event.detail.callback();
		});
		
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
	var result = 0;
	if (typeof gamee !== "undefined")
    {
        //gamee.gameLoaded();
		//gamee.gameReady();
		result = 1; 
    }
	return result;
}

// Game Ready
function gee_game_ready()
{
	var result = 0;
	if (typeof gamee !== "undefined")
    {
		gamee.gameReady();		
		result = 1; 
    }
	return result;
}

// Game Start
function gee_game_start()
{
    if (typeof gamee !== "undefined")
    {
        //gamee.gameStart();
		//gamee.gameReady();
		//requestSocial
		console.log("gameStart()");
		gamee.requestSocial(function (error, data) {
			if (data && data.socialData && data.socialData.friends) {
				data.socialData.friends.forEach(function (friend) {
					//console.log(friend);
					// { name : "playerName", avatar : "_avatars/256.jpg", highScore: 1000 }
				});
				console.log("socialCallback()");
				console.log(data);
				socialResult = JSON.stringify(data.socialData.friends);
				console.log(socialResult);
			}
		});
		
		return 1; 
    }
	return 0;
}

// Game Over
function gee_game_over()
{
    if (typeof gamee !== "undefined")
    {
        //gamee.gameOver();
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
        //gamee.score = score; 
		gamee.updateScore(score);
		//console.log("score");
		//console.log(score);
		return 1; 
    }
	return 0;
}

// SET Social
function gee_social_get()
{
	if (typeof gamee !== "undefined")
    {	
		console.log("requestSocial()");
		console.log(socialResult);
		return socialResult; 
    }
	return "{}";
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
