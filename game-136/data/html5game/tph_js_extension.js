var wndW, wndH;
var canvasScaleX, canvasScaleY;
var canvasX, canvasY;
var drawCtx;
var degToRadRatio = Math.PI / 180;
var gmCallback = new Object();


//-----------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------
function js_init()
{   
    // Ziskat kontext do canvasu
    var canvas = document.getElementById("canvas");
    
    drawCtx = canvas.getContext("2d");
    
    // Zachytavat udalost okna "resize"
    wndW = window.innerWidth;
    wndH = window.innerHeight;
    
    window.addEventListener("resize", function()
    {			
        if (wndW !== window.innerWidth || wndH !== window.innerHeight)
        {
            // Doslo ke zmene velikosti
            wndW = window.innerWidth;
            wndH = window.innerHeight;

            gmCallback.html5_onWindowResize(wndW, wndH);
        }       
    });
       
    // Gamee
    if (typeof gamee !== "undefined")
    {        
        // Controller
        var controller = gamee.controller.requestController('OneButton');
        
        controller.on('keydown', function() { gmCallback.gamee_onController(); });
        
        // Callbacky
        gamee.onPause = function() { gmCallback.gamee_onPause(); };
        gamee.onUnpause = function() { gmCallback.gamee_onResume(); };        
        gamee.onResume = function() { gmCallback.gamee_onResume(); };
        gamee.onRestart = function() { gmCallback.gamee_onRestart(); };
        gamee.onMute = function() { gmCallback.gamee_onMute(); };
        gamee.onUnmute = function() { gmCallback.gamee_onUnMute(); };
    }    
}


//-----------------------------------------------------------------------------
// Nastaveni velikosti okna a jeho zvetseni
//-----------------------------------------------------------------------------
function js_setWndSize(intWidth, intHeight, extWidth, extHeight)
{
    var canvas = document.getElementById("canvas");    
    
    canvas.width = intWidth;
    canvas.height = intHeight;
    canvas.style.width = extWidth + "px";
    canvas.style.height = extHeight + "px";
    
    canvasScaleX = intWidth / extWidth;
    canvasScaleY = intHeight / extHeight;
}



//-----------------------------------------------------------------------------
// Nastaveni pozice okna
//-----------------------------------------------------------------------------
function js_setWndPos(x, y)
{
    var canvas = document.getElementById("canvas");
    
    canvas.style.left = x + "px";
    canvas.style.top = y + "px";
    
    canvasX = x;
    canvasY = y;
}



function js_setCircleClip(centerX,centerY,radius,startAngle,endAngle)
{
    drawCtx.save();
    drawCtx.beginPath();
    drawCtx.moveTo(centerX, centerY);
    drawCtx.arc(centerX, centerY, radius, startAngle * degToRadRatio, endAngle * degToRadRatio);
    drawCtx.closePath();
    drawCtx.clip();
}


function js_cancelClip()
{
    drawCtx.restore();
}

//-----------------------------------------------------------------------------
// Vypsani zpravy do debug konzole
//-----------------------------------------------------------------------------
function js_consoleLog(message)
{
    if ("console" in window)
        console.log(message);
}


//-----------------------------------------------------------------------------
// Vykresleni loading baru
//-----------------------------------------------------------------------------
function js_drawLoadingBar(_graphics, _width, _height, _total, _current, _loadingscreen)
{   
    // Pouzit skutecnou sirku a vysku okna
    _width = window.innerWidth;
    _height = window.innerHeight;
    
    // Zajistit spravnou velikost canvasu
    var cnv = document.getElementById("loading_screen");

    if (cnv.width !== _width || cnv.height !== _height)
    {
        cnv.width = _width;
        cnv.height = _height;
        cnv.style.width = _width + "px";
        cnv.style.height = _height + "px";
    }
       
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
function js_callbackDefineScript(extName, gmScript)
{
    if (gmCallback[extName] !== undefined)
        return true;

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
    }
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