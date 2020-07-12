var TheLine = function() {  
	this.initialize();
}
TheLine.prototype = new createjs.Container();

$(document).ready(function(){ 
	this.theline = new TheLine();
});	


MOVE_SPEED = 15;		
GAME_SPEED = 50; //fps
	
_(TheLine.prototype).extend({

	Container_initialize : TheLine.prototype.initialize,
	
	initialize : function() { 								

		this.Container_initialize();		
	
		// bind functions
        _(this).bindAll( "handleComplete" , "handleProgress", "tick" , "onmouseMove" , "onmouseDown" , "handleKey" , "handleTouch" , "touchStart" , "touchMove2" , "touchStart2" , "showFps" );					
									
		this.canvas = document.getElementById("canvas");	
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;	
				
		document.onmousemove = this.onmouseMove;
		document.onmousedown = this.onmouseDown;
		//document.ontouchstart = this.touchStart2;			 	
		//document.ontouchmove = this.touchMove2;	//pro test. na dotyk. zarizenich mimo gamee framework	 
				
		//check to see if we are running in a browser with touch support
		this.stage = new createjs.Stage(this.canvas);									
			
		// enable touch interactions if supported on the current device:
		createjs.Touch.enable(this.stage);			
		
		this.gameStarted = false;	
		this.muted = false;				
		
		this.preload = new createjs.LoadQueue(false);
		//createjs.Sound.alternateExtensions = ["mp3"];		
		this.preload.installPlugin(createjs.Sound);
		//this.soundsEnabled = true;
		this.preload.addEventListener("complete", this.handleComplete);
		this.preload.addEventListener("progress", this.handleProgress);											
							
		this.preload.loadFile( {id: "player", src:"assets/player.png"} ); 
		this.preload.loadFile( {id: "rectClosed", src:"assets/rectClosed.png"} ); 
		this.preload.loadFile( {id: "rectOpen", src:"assets/rectOpen.png"} );      									
		
		var t = this;				
		this.deadSound = new Howl({ 
			 src: ['assets/dead.ogg' , 'assets/dead.mp3'],
			 /*onplay: function() {				
				t.showDebugMsg( "dead sound played" );
			 },
			 onload: function() {
				t.showDebugMsg('dead sound loaded');
			 },*/
			 onloaderror: function() {
				t.showDebugMsg('dead sound load ERROR');
			 }
		});				
		
		this.preload.load();
		
		this.stage.update();	
		
		
		//window.setInterval( this.showFps , 1000 );				
	},								
	
	showFps: function() {		
		if( this.debugTxt != null ) { 	
			this.debugTxt.text = createjs.Ticker.getMeasuredFPS().toString();
		}
	},
	
	handleProgress: function() {		
		this.stage.update();
	},
	handleComplete: function() {					 
		 this.stage.update();		 		 		 		 	  				 						 
		 
		 this.canvas.width = window.innerWidth;
		 this.canvas.height = window.innerHeight;	
		 
		 this.start();
	},					
	
	start: function () {						
			
		this.showDebugMsg( "START called" );																																							 				
				
		this.stage.removeAllChildren();
				
		this.speed = 125 // 5;
		this.speedMax = 375 // 15;		
		this.speedInc = 3.125; // 0.005;	
		this.time = 0;
		this.alive = true;
		this.framesCount = 0;
		this.touchPlayerStartX = 0;
		this.touchStartX = 0;
		
		this.rowsAr = new Array();
			
		this.redraw();						
		
		if( !this.gameInitialized ) {
			this.gameInitialized = true;
			this.gamee_init();	
		}

		this.gamee_gameLoaded();
		
		//this.gamee_gameStart();							
		
		//start game timer, pro testovani mimo gamee
		//this.addTickListener();				
		
		this.stage.update();
	},
	
	addTickListener: function() {
		createjs.Ticker.removeEventListener("tick", this.tick);
		createjs.Ticker.setFPS( GAME_SPEED );
		createjs.Ticker.addEventListener("tick", this.tick);
	},
		
	redraw: function() {
			
		this.stage.removeAllChildren();																																
		
		this.w = this.canvas.width;
		this.h = this.canvas.height;
		
		//grafika je delana na velikost 640 x 640, dle te mensi strany budu grafiku zmensovat ci zvetsovat
		if( this.w < this.h ) {
			this.scale = this.w / 640; 	
		} else {
			this.scale = this.h / 640; 
		}
		
		/*
		if( this.scale == null ) {			
			var context = canvas.getContext('2d');
			var devicePixelRatio = window.devicePixelRatio || 1;
			var backingStoreRatio = context.webkitBackingStorePixelRatio ||
								context.mozBackingStorePixelRatio ||
								context.msBackingStorePixelRatio ||
								context.oBackingStorePixelRatio ||
								context.backingStorePixelRatio || 1;
			var ratio = devicePixelRatio / backingStoreRatio;
			
			var oldWidth = canvas.width;
			var oldHeight = canvas.height;
			
			canvas.width = oldWidth * ratio;
			canvas.height = oldHeight * ratio;
			
			canvas.style.width = oldWidth + 'px';
			canvas.style.height = oldHeight + 'px';
			
			context.scale(ratio, ratio);			
			
			this.w = this.canvas.width;
			this.h = this.canvas.height;
			
			//grafika je delana na velikost 640 x 640, dle te mensi strany budu grafiku zmensovat ci zvetsovat
			if( this.w < this.h ) {
				this.scale = this.w / 640; 	
			} else {
				this.scale = this.h / 640; 
			}														
		}	
		*/
	
		var whiteBg = new createjs.Shape();
		whiteBg.graphics.beginFill(createjs.Graphics.getRGB(245,245,245)).drawRect(0, 0, this.w, this.h).endFill();					
		this.stage.addChild( whiteBg );				
		
		this.rowsContainer = new createjs.Container();
		this.rowsContainer2 = new createjs.Container();
		
		this.rowsContainer.y = this.h;
		this.rowsContainer.addNewRows = true;
		this.addRows();
		this.rowsContainer.scaleX = this.rowsContainer.scaleY = this.scale;				
		
		this.rowsContainer2.y = this.h - this.getRealHeight( this.rowsContainer );
		this.rowsContainer2.addNewRows = true;
		this.addRows();
		this.rowsContainer2.scaleX = this.rowsContainer2.scaleY = this.scale;				
		//this.printRows();				

		this.stage.addChild( this.rowsContainer );
		this.stage.addChild( this.rowsContainer2 );				
				
		//player bitmap				
		this.curPlayer = new createjs.Bitmap( this.preload.getResult("player") );						
		this.curPlayer.scaleX = this.curPlayer.scaleY = this.scale;
		this.curPlayer.x = this.canvas.width / 2 - this.getRealWidth( this.curPlayer ) / 2;
		this.curPlayer.y = this.canvas.height - 40 * this.scale - this.getRealHeight( this.curPlayer ) / 2;
		this.stage.addChild( this.curPlayer );
		
		this.playerRealSize = 30 * this.scale;
		this.blockSize = 80 * this.scale;
		this.rightBorder = 640 * this.scale - this.blockSize;
		this.containerRealHeight = 12 * this.blockSize;				
			
	
		this.curPlayerShape = new createjs.Shape();	
		this.curPlayerShape.graphics.beginFill(createjs.Graphics.getRGB(239,62,35)).drawCircle(0, 0, 16 * this.scale ).endFill();							
		this.curPlayerShape.x = this.curPlayer.x;
		this.curPlayerShape.y = this.canvas.height - 40 * this.scale;
		this.curPlayerShape.regX = -this.getRealHeight( this.curPlayer ) / 2;
		this.stage.addChild( this.curPlayerShape );			
	
			
		var oldMsg = "";								 			
		if( this.debugTxt != null ) {
			oldMsg = this.debugTxt.text;
		}
		this.debugTxt = new createjs.Text("","12px Verdana","white");	
		this.debugTxt.textAlign = "left";		
		this.debugTxt.text = "DEBUG2:";
		this.debugTxt.width = 100;
		this.debugTxt.height = 100;		
		this.debugTxt.x = 0;
		this.debugTxt.y = 0;
		this.debugTxt.text = oldMsg;			
		//this.stage.addChild( this.debugTxt );																					
																		
		this.stage.update();
	},
	
	getRealWidth: function( obj ) {
		return obj.getBounds().width * obj.scaleX;
	},
	
	getRealHeight: function( obj ) {
		return obj.getBounds().height * obj.scaleY;
	},		
	
	gameOver: function () {

	    this.gameStarted = false;

		createjs.Ticker.removeEventListener( "tick", this.tick );	
		this.stage.update(event);
		this.gamee_gameOver();
	},
	
	tick: function (event) {											
				
		if( !this.alive ) {													
			
			/*
			if( this.curPlayer.animCount % 2 == 0 ) {
				this.curPlayer.alpha -= 0.1; 			
			} else {
				 this.curPlayer.alpha += 0.1; 
			}
			*/			
							
			if( this.blockAnim.animUp ) {			
				this.blockAnim.alpha += 0.05; 
				if( this.blockAnim.alpha >= 1 ) {
					this.blockAnim.animUp = false;
					this.blockAnim.animCount++;	
				}
			} else {
				this.blockAnim.alpha -= 0.05; 
				if( this.blockAnim.alpha <= 0 ) {
					this.blockAnim.animUp = true;	
					this.blockAnim.animCount++;
				}
			}
			
			/*
			if( this.curPlayer.alpha <= 0 ) {
				  this.curPlayer.animCount++;
				  this.curPlayer.alpha = 0.01;
			} else if( this.curPlayer.alpha > 1 ) {
				  this.curPlayer.animCount++;
				  this.curPlayer.alpha = 0.99;
			}
			*/
			  
			if( this.blockAnim.animCount == 6 ) {					
				this.stage.removeChild( this.blockAnim );	     		
				this.blockAnim = null;	
				this.gameOver();						 	
				return;
			}			  			  
			  			  	  
			this.stage.update(event);
			return;
		 }
		  		 
		  		  	  	  
		  this.time += event.delta;		
		  // 10 bodu za kazdou vterinu ve hre
		  this.gamee_setScore( Math.floor( this.time / 100 ) );			
					  
		  //handle player movement with keybaord	 		  		  		  		  
		  if( this.lfHeld ){
			  this.curPlayer.x -= MOVE_SPEED;			
			  this.curPlayerShape.x -= MOVE_SPEED;			
		  } else if( this.rtHeld ) {
			  this.curPlayer.x += MOVE_SPEED;
			  this.curPlayerShape.x += MOVE_SPEED;			
		  }		 	  				  	
				
		//console.log( this.speed );		
		this.rowsContainer.y += ( event.delta / 1000 ) * this.speed;
		this.rowsContainer2.y += ( event.delta / 1000 ) * this.speed;
		
		if( this.speed < this.speedMax ) {
			this.speed += ( event.delta / 1000 ) * this.speedInc;	
		}	
		
		if( this.rowsContainer.y - this.containerRealHeight > this.h ) {
			this.rowsContainer.addNewRows = true;	
			this.rowsContainer.y = this.rowsContainer2.y - this.containerRealHeight;
			this.addRows();
		}
		if( this.rowsContainer2.y - this.containerRealHeight > this.h ) {
			this.rowsContainer2.addNewRows = true;	
			this.rowsContainer2.y = this.rowsContainer.y - this.containerRealHeight;
			this.addRows();
		}									  				  								 							 						 
	
		this.framesCount++;
		if( this.framesCount % 2 == 0 ) {
			this.checkCollission();	
		}
		 			
		this.stage.update(event);
	},				


	checkCollission: function() {	
	
		//vyjeti mimo obrazovku
		if( this.curPlayer.x < 0 || this.curPlayer.x + this.playerRealSize > this.rightBorder ) {
			this.dead( null );
			return;		
		}
	
		if( this.curPlayer.x < this.blockSize || this.curPlayer.x + this.playerRealSize > this.rightBorder  ) {															
			var bitmapsToCheck = new Array();
			var minYToTest = this.h - this.blockSize * 1.5;
			if( this.rowsContainer.y > minYToTest ) {	
				for( var i = 0 ; i < this.rowsContainer.children.length ; i++ ) {
					if( this.rowsContainer.children[i].row == 0 || this.rowsContainer.children[i].row == 7 ) {
						bitmapY = this.rowsContainer.y + this.rowsContainer.children[i].y * this.scale;			
						if( bitmapY > minYToTest && bitmapY < this.h ) {
							bitmapsToCheck.push( this.rowsContainer.children[i] );	
						}
					}					
				}
			}
			if( this.rowsContainer2.y > minYToTest ) {			
				for( var i = 0 ; i < this.rowsContainer2.children.length ; i++ ) {
					if( this.rowsContainer2.children[i].row == 0 || this.rowsContainer2.children[i].row == 7 ) {
						bitmapY = this.rowsContainer2.y + this.rowsContainer2.children[i].y * this.scale;	
						if( bitmapY > minYToTest && bitmapY < this.h ) {
							bitmapsToCheck.push( this.rowsContainer2.children[i] );	
						}
					}
				}	
			}
		
			for( var i = 0 ; i < bitmapsToCheck.length ; i++ ) {		
				var collision = ndgmr.checkPixelCollision( bitmapsToCheck[i] , this.curPlayer,1);			
				if( collision ) {																	
					this.dead( bitmapsToCheck[i] );	
					break;				
				}
			}		
			return;
		}										
		
		var bitmapsToCheck = new Array();				
		
		var bitmapY;
		var minYToTest = this.h - this.blockSize * 1.5;
		if( this.rowsContainer.y > minYToTest ) {						
			for( var i = 0 ; i < this.rowsContainer.children.length ; i++ ) {
				if( this.rowsContainer.children[i].row > 0 && this.rowsContainer.children[i].row < 7 ) {
					bitmapY = this.rowsContainer.y + this.rowsContainer.children[i].y * this.scale;			
					if( bitmapY > minYToTest && bitmapY < this.h ) {
						bitmapsToCheck.push( this.rowsContainer.children[i] );	
					}
				}
			}	
		}
		if( this.rowsContainer2.y > minYToTest ) {			
			for( var i = 0 ; i < this.rowsContainer2.children.length ; i++ ) {
				if( this.rowsContainer2.children[i].row > 0 && this.rowsContainer2.children[i].row < 7 ) {
					bitmapY = this.rowsContainer2.y + this.rowsContainer2.children[i].y * this.scale;	
					if( bitmapY > minYToTest && bitmapY < this.h ) {
						bitmapsToCheck.push( this.rowsContainer2.children[i] );	
					}
				}
			}	
		}
										
		//console.log( bitmapsToCheck.length );
		for( var i = 0 ; i < bitmapsToCheck.length ; i++ ) {		
			var collision = ndgmr.checkPixelCollision( bitmapsToCheck[i] , this.curPlayer,1);			
			if( collision ) {																	
				this.dead( bitmapsToCheck[i] );	
				break;				
			}
		}
	},

	dead: function( bitmap ) {
		
		//console.log( "collission" );	
		
		if( bitmap == null ) {		
			this.gameOver();
		} else {
			this.blockAnim = new createjs.Shape();
			this.blockAnim.graphics.beginFill(createjs.Graphics.getRGB(239,62,35)).drawRect(0, 0, this.blockSize, this.blockSize).endFill();					
			var pt = bitmap.parent.localToGlobal( bitmap.x , bitmap.y );
			this.blockAnim.x = pt.x;
			this.blockAnim.y = pt.y;
			this.blockAnim.alpha = 0;
			this.blockAnim.animUp = true;
			this.blockAnim.animCount = 0;
			this.stage.addChild(this.blockAnim);				
		}
		
		if( !this.muted ) {
			this.deadSound.play();			 
		}		 		
		this.alive = false;			
	},

	addRows: function() {			
				
		var containerToDraw = null;
		var color = true;
						
		if( this.rowsContainer.addNewRows ) {		
			containerToDraw = this.rowsContainer;
		}
		if( this.rowsContainer2.addNewRows ) {			
			containerToDraw = this.rowsContainer2;
			color = false;
		}
		if( containerToDraw != null ) {
			var row = 0;
			while( row < 12 ) {
				this.addRow();	
				row++;
			}
			containerToDraw.addNewRows = false;
			containerToDraw.removeAllChildren();
			
			var row = 0;		
			var rowIdx = this.rowsAr.length - 12;
			var bitmap;
			while( rowIdx < this.rowsAr.length ) {
				for( var i = 0 ; i < 8 ; i++ ) { 
					if( this.rowsAr[ rowIdx ][i] == 0 ) {
						//if( !color )  {
							bitmap = new createjs.Bitmap( this.preload.getResult("rectClosed") );	
						//} else {
							//bitmap = new createjs.Bitmap( this.preload.getResult("rectOpen") );	
						//}												
						
						bitmap.row = i;
						bitmap.x = i * 80;
						bitmap.y = 0 - row * 80 - 80;
						containerToDraw.addChild( bitmap );
					}
				}
				rowIdx++;
				row++;			
			}
				
		}
		
	},

	addRow: function() {
		
		this.rowsAr[ this.rowsAr.length ] = new Array();		
		for( var i = 0 ; i < 8 ; i++ ) { this.rowsAr[ this.rowsAr.length - 1 ][i] = 0; }
		
		if( this.rowsAr.length <= 8  ) {
						
			if( this.rowsAr.length <= 4 ) {
				for( var i = 1 ; i <= 6 ; i++ ) { this.rowsAr[ this.rowsAr.length - 1 ][i] = 1; }					
			} else if( this.rowsAr.length <= 6 ) {
				for( var i = 2 ; i <= 5 ; i++ ) { this.rowsAr[ this.rowsAr.length - 1 ][i] = 1; }					
			} else {
				for( var i = 3 ; i <= 4 ; i++ ) { this.rowsAr[ this.rowsAr.length - 1 ][i] = 1; }					
			}
						
			this.obj1 = { start:3, size:1 };
			this.obj2 = { start:4, size:1 };						
			return;
		}												
				
		var rnd;		
		//pokud byl minuly krok zatacka tak jdem rovne at to hned nezahne pryc
		if( this.obj1.lastAction == "turnLeft" || this.obj1.lastAction == "turnRight" ) {
			
			//pokud se zatoci, je to vysoke dva bloky
			if( this.obj1.straightLength == 1 ) {
				this.obj1.straightLength = 2;
			} else {
			
				if( this.obj1.lastAction == "turnRight" ) {
					this.obj1.start = this.obj1.start + this.obj1.size - 1;
				}			
				this.obj1.size = 1;			
				this.straight( this.obj1 );
			}
			
		//pokud jdem rovne prilis dlouho tak zatocime
		} else if( this.obj1.lastAction == "straight" && this.obj1.straightLength > 2 ) {			
			rnd = this.randRange( 1 , 100 );
			if( rnd > 50 ) {
				this.turn( this.obj1, true, true );	
			} else {
				this.turn( this.obj1, false, true );	
			}					
		} else {			
		
			//jit rovne dal 30pct
			//zahnout dole ci doprava 30pct
			//rozsirit se doleva ci doprava 20pct
			//zuzit se zleva ci zprava 20pct
		
			rnd = this.randRange( 1 , 100 );
			if( rnd > 30 ) {
				if( rnd <= 65 ) {				
					this.turn( this.obj1, true, true );								
				} else if( rnd <= 100 ) {
					this.turn( this.obj1 , false, true );				
				}
			} else {
				this.straight( this.obj1 );	
			}
			
		}
		
		
		//2. cesta
		if( this.obj2.lastAction == "turnLeft" || this.obj2.lastAction == "turnRight" ) {
			
			if( this.obj2.straightLength == 1 ) {
				this.obj2.straightLength = 2;
			} else {
			
				if( this.obj2.lastAction == "turnRight" ) {
					this.obj2.start = this.obj2.start + this.obj2.size - 1;
				}			
				this.obj2.size = 1;			
				this.straight( this.obj2 );
			}
			
		//pokud jdem rovne prilis dlouho tak zatocime
		} else if( this.obj2.lastAction == "straight" && this.obj2.straightLength > 2 ) {			
			rnd = this.randRange( 1 , 100 );
			if( rnd > 50 ) {
				this.turn2( this.obj2, true, false );	
			} else {
				this.turn2( this.obj2, false, false );	
			}					
		} else {			
		
			//jit rovne dal 30pct
			//zahnout dole ci doprava 30pct			
			//zuzit se zleva ci zprava 40pct
		
			rnd = this.randRange( 1 , 100 );
			if( rnd > 30 ) {
				if( rnd <= 65 ) {				
					this.turn2( this.obj2, true, false );								
				} else if( rnd <= 100 ) {
					this.turn2( this.obj2 , false, false );												
				}
			} else {
				this.straight( this.obj2 );	
			}
			
		}
		
		var newRowIdx = this.rowsAr.length - 1;
		for( var i = this.obj1.start ; i < this.obj1.start + this.obj1.size ; i++ ) { 	
			this.rowsAr[ newRowIdx ][i] = 1;			
		}
		for( var i = this.obj2.start ; i < this.obj2.start + this.obj2.size ; i++ ) { 	
			this.rowsAr[ newRowIdx ][i] = 1;			
		}					
	},
	
	turn: function( obj, left , wideTurns ) {
		
		if( left ) {
			//zahneme doleva pokud to jde		
			if( obj.start > 1 ) {
				if( obj.size == 1 ) {						
					//musi to rozsirit na sirku 2 jinak by to nebylo spojene
					obj.size = 2;
				}
				obj.start--;	
				
				if( wideTurns ) {
				
					//50pct sance ze zatacka bude sirsi
					rnd = this.randRange( 0 , 100 );
					if( rnd < 50 && obj.start > 1 ) {
						obj.start--;	
						obj.size++;
					}
					
					//25pct sance ze zatacka bude jeste vic sirsi
					if( rnd < 25 && obj.start > 1 ) {
						obj.start--;	
						obj.size++;
					}
				
				}
				
						
				obj.lastAction = "turnLeft";													
			} else {
				//nejde zahnout doleva, musime rovne			
				//this.straight( obj );				
				this.turn( obj, false, wideTurns );	
			}
		} else {
			//zahneme doprava pokud to jde
			if( obj.start + obj.size - 1 < 3 ) {
				if( obj.size == 1 ) {						
					//musi to rozsirit na sirku 2 jinak by to nebylo spojene
					obj.size = 2;
				} else {
					obj.start++;	
				}
					
				if( wideTurns ) {
				
					//50pct sance se zatacka bude sirsi
					rnd = this.randRange( 0 , 100 );
					if( rnd < 50 && obj.start + obj.size - 1 < 4 ) {						
						obj.size++;
					}
					
					//25pct sance ze zatacka bude jeste vic sirsi		
					if( rnd < 25 && obj.start + obj.size - 1 < 4 ) {						
						obj.size++;
					}
				
				}
					
				obj.lastAction = "turnRight";	
					
			} else {				
				//nejde zahnout doprava, musime rovne
				//this.straight( obj );	
				this.turn( obj, true, wideTurns );
			}	
		}
		obj.straightLength = 1;
	},
	
	turn2: function( obj, left , wideTurns ) {
		wideTurns = true;
		if( left ) {
			//zahneme doleva pokud to jde		
			if( obj.start > 4 ) {
				if( obj.size == 1 ) {						
					//musi to rozsirit na sirku 2 jinak by to nebylo spojene
					obj.size = 2;
				}
				obj.start--;	
				
				if( wideTurns ) {
				
					//50pct sance ze zatacka bude sirsi
					rnd = this.randRange( 0 , 100 );
					if( rnd < 50 && obj.start > 4 ) {
						obj.start--;	
						obj.size++;
					}
					
					//25pct sance ze zatacka bude jeste vic sirsi
					if( rnd < 25 && obj.start > 4 ) {
						obj.start--;	
						obj.size++;
					}
				
				}
				
						
				obj.lastAction = "turnLeft";													
			} else {
				//nejde zahnout doleva, musime rovne			
				//this.straight( obj );				
				this.turn2( obj, false, wideTurns );	
			}
		} else {
			//zahneme doprava pokud to jde
			if( obj.start + obj.size - 1 < 6 ) {
				if( obj.size == 1 ) {						
					//musi to rozsirit na sirku 2 jinak by to nebylo spojene
					obj.size = 2;
				} else {
					obj.start++;	
				}
					
				if( wideTurns ) {
				
					//50pct sance se zatacka bude sirsi
					rnd = this.randRange( 0 , 100 );
					if( rnd < 50 && obj.start + obj.size - 1 < 6 ) {						
						obj.size++;
					}
					
					//25pct sance ze zatacka bude jeste vic sirsi		
					if( rnd < 25 && obj.start + obj.size - 1 < 6 ) {						
						obj.size++;
					}
				
				}
					
				obj.lastAction = "turnRight";	
					
			} else {				
				//nejde zahnout doprava, musime rovne
				//this.straight( obj );	
				this.turn2( obj, true, wideTurns );
			}	
		}
		obj.straightLength = 1;
	},
	
	straight: function( obj ) {
		if( obj.lastAction == "straight" ) {
			obj.straightLength++;	
		} else {
			obj.lastAction = "straight";
			obj.straightLength = 1;	
		}
	},
		
	printRows: function() {		
		var row = "";
		for( var i = this.rowsAr.length - 1 ; i >= 0 ; i-- ) { 
			row = i + ": ";
			for( var a = 0 ; a < 8 ; a++ ) { 
				row +=  this.rowsAr[i][a] + ",";
			}
			console.log( row );
		}
	},

	touchStart2: function( e ) {
		/*if( !this.gameStarted ) {
		  try {
				  this.bonusSound.play();	
			 } catch( err ) {
				  this.showDebugMsg( err.message );  
			 }		
		}*/
	},
	//alternativa pro testovani hry, kdy gamee touch controller nefungoval na androidu
	touchMove2: function( e ){				
	    if (!this.gameStarted) {

	        this.gamee_gameStart();

			this.gameStarted = true;	
			this.addTickListener();
			return;
		}				
		
		if( this.alive ) {			
			this.curPlayer.x = e.changedTouches[0].pageX - this.playerRealSize / 2;	
			this.curPlayerShape.x = this.stage.mouseX;							
		}
						
	},

	onmouseDown: function( e ){
	    if (!this.gameStarted) {

	        this.gamee_gameStart();

			this.gameStarted = true;	
			this.addTickListener();
			return;
		}	
	},
		
	onmouseMove: function( e ){
		if( this.alive ) {								
			this.curPlayer.x = this.stage.mouseX - this.playerRealSize / 2;	
			this.curPlayerShape.x = this.curPlayer.x;	
			
			//pro testovani detekce kolizi na PC
			//this.curPlayer.y = this.stage.mouseY - this.playerRealSize / 2;	
			//this.curPlayerShape.y = this.stage.mouseY;					
			
			this.stage.update();
		}		
	},
	
	touchStart: function( posX, posY ) { 				
		//this.showDebugMsg( "handleTouch: " + posX );
/*		if( this.alive ) {
			this.curPlayer.x = posX * this.w - this.playerRealSize / 2;
			this.curPlayerShape.x = posX * this.w;
		}*/
		
		this.touchStartX = posX;		
		this.touchPlayerStartX = this.curPlayer.x;
	},
	
	handleTouch: function( posX, posY ) {		
		
	    if (!this.gameStarted) {

	        this.gamee_gameStart();

			this.gameStarted = true;	
			this.addTickListener();
			if( !this.muted ) {
				this.deadSound.play();			 
			}
			return;
		}				
		
		//this.showDebugMsg( "handleTouch: " + posX );
		/* if( this.alive ) {
			this.curPlayer.x = posX * this.w - this.getRealWidth( this.curPlayer ) / 2;
			this.curPlayerShape.x = posX * this.w;
		} */
		
		if( this.alive ) {
			this.curPlayer.x = this.touchPlayerStartX + ( posX - this.touchStartX ) * this.w - this.getRealWidth( this.curPlayer ) / 2;	
			this.curPlayerShape.x = this.curPlayer.x;	
		}
		
	},
	
	handleKey: function( keyType, down ) {		
		if( keyType == "left" ) {
			this.lfHeld = down;			
		} else if( keyType == "right" ) {
			this.rtHeld = down;	
		}
	},
	
	randRange: function( min, max ) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},	
	
	showDebugMsg: function( msg ) {		
		console.log( "DEBUG: " + msg );
		if( this.debugTxt != null ) { 
			this.debugTxt.text += "\n " + msg;	
		}
	},	
	
	///////////////////
	//     GAMEE 
	///////////////////	
	
	gamee_init: function() {
		
		this.showDebugMsg( "gamee_INIT 4" );
		
		var t = this;		
		gamee.onResume = function() { t.gamee_resume(); }
		gamee.onPause = function() { t.gamee_pause(); }
		gamee.onUnpause = function() { t.gamee_unpause(); }
		gamee.onStop = function() { t.gamee_stop(); }
		gamee.onRestart = function() { t.gamee_restart(); }	
		gamee.onMute = function() { t.gamee_onMute(); }		
		gamee.onUnmute = function() { t.gamee_onUnmute(); }			
										
		this.controller = gamee.controller.requestController('TwoButtons');		 		
		this.controller.buttons.left.on('keydown', function(data) { t.handleKey( "left" , true ) } );
		this.controller.buttons.left.on('keyup', function(data) { t.handleKey( "left" , false ) } );
		this.controller.buttons.right.on('keydown', function(data) { t.handleKey( "right" , true ) } );
		this.controller.buttons.right.on('keyup', function(data) { t.handleKey( "right" , false ) } );
		this.controller.enableKeyboard();		
		
		this.touchController = gamee.controller.requestController("Touch");					
		this.touchController.on('touchstart', function(data) { 
			t.showDebugMsg( "touchstart" );				
			t.touchStart( data.position.x, data.position.y ); 
		});
		this.touchController.on('touchmove', function(data) { t.handleTouch( data.position.x, data.position.y ); });				

	},		
	
	gamee_setScore: function( score ) {	
		if( score > 0 ) {	
	 		gamee.score = score;	
		}
	},	
	
	gamee_resume: function() {
		this.showDebugMsg( "gamee_resume" );	
		this.addTickListener();
	},	
	
	gamee_pause: function() {
		this.showDebugMsg( "gamee_pause" );		
		createjs.Ticker.removeEventListener("tick", this.tick);
	},	
	
	gamee_unpause: function() {
		this.showDebugMsg( "gamee_unpause" );
		this.addTickListener();
	},
	
	gamee_stop: function() {
		this.showDebugMsg( "gamee_stop" );	
		createjs.Ticker.removeEventListener("tick", this.tick);
	},	
	
	gamee_restart: function() {
		this.showDebugMsg( "gamee_restart" );
		this.start();
		this.addTickListener();
	},
	
	gamee_gameLoaded: function () {
	    //this.showDebugMsg( "gamee_loaded" );	

	    console.log("sloaded");
	    gamee.gameLoaded();
	},

	gamee_gameStart: function() {
		//this.showDebugMsg( "gamee_gameStart" );	
		gamee.gameStart();
	},	
	
	gamee_gameOver: function() {	
		this.showDebugMsg( "gamee_gameOver" );
		gamee.gameOver();
	},
	
	gamee_onMute: function() {	
		this.showDebugMsg( "gamee_onMute" );
		this.muted = true;
	},	
	
	gamee_onUnmute: function() {	
		this.showDebugMsg( "gamee_onUnmute" );
		this.muted = false;
	}	
			
});
