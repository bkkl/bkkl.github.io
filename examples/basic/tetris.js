if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = ( function () {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

window.Tetris = window.Tetris || {};
Tetris.sounds = {};
//BKL used to control left eye / right eye layers. (0 = both, 1=left, 2=right)
var VR_layers = 0; // active block
var VR_layers2 = 0; // background blocks
// BKL used to create easy level 
//BKL global for gamepad
var gamepadconnected = 0;
var flipflop = 0;  // debounce control for gamepad buttons 0-3 
var flipflop2 = 0 ; // debounce control for gamepad 
var flipflop3 = 0 ; // debounce control for gamepad 
var flipflop4 = 0 ; // debounce control for gamepad 
var flipflop5 = 0 ; // debounce control for gamepad 


var level = 0;
var CurrentBlockOpacity = 0;
var CurrentBlockWireFrame = false;

Tetris.init = function () {
    Tetris.sounds["theme"] = document.getElementById("audio_theme");  
    Tetris.sounds["collision"] = document.getElementById("audio_collision");  
    Tetris.sounds["move"] = document.getElementById("audio_move");  
    Tetris.sounds["gameover"] = document.getElementById("audio_gameover");  
    Tetris.sounds["score"] = document.getElementById("audio_score");  

    Tetris.sounds["theme"].play();
    // set the scene size

    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    // set some camera attributes
    var VIEW_ANGLE = 50,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 20.1,
        FAR = 2000;

    // create a WebGL renderer, camera
    // and a scene
    Tetris.renderer = new THREE.WebGLRenderer({antialias: true});
	Tetris.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
    Tetris.camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
//	Tetris.camera.zoom = 1;	
    Tetris.scene = new THREE.Scene();

    // the camera starts at 0,0,0 so pull it back
    Tetris.camera.position.z = 800;
	Tetris.camera.position.y = -325;
    Tetris.scene.add(Tetris.camera);

    // start the renderer
    Tetris.renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    document.body.appendChild(Tetris.renderer.domElement);
	
// Apply VR headset positional data to camera.
	Tetris.controls = new THREE.VRControls(Tetris.camera);	
		
    // configuration object
    var boundingBoxConfig = {
        width:360,
        height:360,
        depth:1800,
        splitX:6,
        splitY:6,
        splitZ:30
    };
    Tetris.boundingBoxConfig = boundingBoxConfig;
    Tetris.blockSize = boundingBoxConfig.width / boundingBoxConfig.splitX;

    Tetris.Board.init(boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ);
	//BKL adding texture to bounding box
    var texture1 = THREE.ImageUtils.loadTexture( 'img/bricks.jpg' );
    var texture2 = THREE.ImageUtils.loadTexture( 'img/crate.jpg' );
		texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
	    texture2.repeat.set( 6, 6 );
	var material = new THREE.MeshLambertMaterial({ map: texture2, side: THREE.BackSide });
	

 	var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, vertexColors: THREE.VertexColors, side: THREE.BackSide, opacity: 0.90, transparent: true } );
	var color, face, numberOfSides, vertexIndex;
	// faces are indexed using characters
	var faceIndices = [ 'a', 'b', 'c', 'd' ];
	// randomly color cube
	var cubeGeometry = new THREE.CubeGeometry(boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth, boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ);
	for ( var i = 0; i < cubeGeometry.faces.length; i++ ) 
	{
		face  = cubeGeometry.faces[ i ];	
		// determine if current face is a tri or a quad
		numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
		// assign color to each vertex of current face
		for( var j = 0; j < numberOfSides; j++ ) 
		{
			vertexIndex = face[ faceIndices[ j ] ];
			// initialize color variable
			color = new THREE.Color( 0xffffff );
			if((j%2)==0){
			color.setHex( 0x264942 );}
				//color.setHex( Math.random() * 0xff0000 );}	   
			else{
				color.setHex( 0x56bca6 );}
			
			face.vertexColors[ j ] = color;
		}
	}
	
    var boundingBox = new THREE.Mesh( cubeGeometry, material);


    Tetris.scene.add(boundingBox);
//  Adding Light
	var light = new THREE.AmbientLight( 0x404040 );
	Tetris.scene.add( light );
	var light2 = new THREE.PointLight( 0xffffff, 1, 100 );
	light2.intensity = 1;
	Tetris.scene.add( light2 );
	var light3 = new THREE.DirectionalLight( 0xffffff );
	light3.position.set( -1, -6, 10 ).normalize();
	Tetris.scene.add(light3);
	
    Tetris.stats = new Stats();
    Tetris.stats.domElement.style.position = 'absolute';
    Tetris.stats.domElement.style.top = '10px';
    Tetris.stats.domElement.style.left = '10px';
// BKL Use to disable stat window 	
//    document.body.appendChild(Tetris.stats.domElement);

    document.getElementById("play_button").addEventListener('click', function (event) {
        event.preventDefault();
        Tetris.start();
    });
};

Tetris.start = function () {
    document.getElementById("menu").style.display = "none";
    Tetris.pointsDOM = document.getElementById("points");
    Tetris.pointsDOM.style.display = "block";
	
    Tetris.sounds["theme"].pause();
	
    Tetris.Block.generate();
	//BKL test block
	var geometry2 = new THREE.BoxGeometry(60,60,60);

	
	//BKL 
	// Apply VR stereo rendering to renderer.
	Tetris.effect = new THREE.VREffect(Tetris.renderer);
	Tetris.effect.setSize(window.innerWidth, window.innerHeight);
	
	// Get the VRDisplay and save it for later.
	Tetris.vrDisplay = null;
	navigator.getVRDisplays().then(function(displays) {
	  if (displays.length > 0) {
		Tetris.vrDisplay = displays[0];

		// Kick off the render loop.
		Tetris.vrDisplay.requestAnimationFrame(Tetris.animate);
	  }
	  
	
	  
	});
	
};


Tetris.gameStepTime = 1000;

Tetris.frameTime = 0; // ms
Tetris.cumulatedFrameTime = 0; // ms
Tetris._lastFrameTime = Date.now(); // timestamp

Tetris.gameOver = false;

Tetris.animate = function () {
    var time = Date.now();
    Tetris.frameTime = time - Tetris._lastFrameTime;
    Tetris._lastFrameTime = time;
    Tetris.cumulatedFrameTime += Tetris.frameTime;
	Tetris.controls.update();
// BKL Adding HTML5 GAMEPAD READ
	if (gamepadconnected == 1) {
					var gp = navigator.getGamepads()[0];
					var axeLF = gp.axes[0];
					var axeUP = gp.axes[1];
					// left - right joystick
					if(axeLF < -0.9) {
						if (flipflop2 == 0) {
							Tetris.Block.rotate(0, -90, 0);
							flipflop2 = 1;
						}	
					
					} else if(axeLF > 0.9) {
						if (flipflop2 == 0) {
							Tetris.Block.rotate(0, 90, 0);
							flipflop2 = 1;
						}
					
					} else {
						flipflop2 = 0;
					}	
					
					// left - right joystick
					if(axeUP < -0.9) {
						if (flipflop4 == 0) {
							Tetris.Block.rotate(-90, 0, 0);
							flipflop4 = 1;
						}	
					
					} else if(axeUP > 0.9) {
						if (flipflop4 == 0) {
							Tetris.Block.rotate(90, 0, 0);
							flipflop4 = 1;
						}
					
					} else {
						flipflop4 = 0;
					}	
					
					
					
					if(gp.buttons[0].pressed) {
						if (flipflop == 0) {
							Tetris.Block.move(-1, 0, 0);
							flipflop = 1;
						}	
						
					} else if (gp.buttons[2].pressed) { 
						if (flipflop == 0) {
							Tetris.Block.move(1, 0, 0);
							flipflop = 1;
						}	
					} else if (gp.buttons[1].pressed) { 
						if (flipflop == 0) {
							Tetris.Block.move(0, -1, 0);
							flipflop = 1;
						}	
					} else if (gp.buttons[3].pressed) { 
						if (flipflop == 0) {
							Tetris.Block.move(0, 1, 0);
							flipflop = 1;
						}							
					} else {
						flipflop = 0;
					}
					            
					
					if(gp.buttons[6].pressed) {
						if (flipflop3 == 0) {
							Tetris.Block.moveto(0, 0, -0.5);
							flipflop3 = 1;
						}	
						
					} else if (gp.buttons[7].pressed) { 
						if (flipflop3 == 0) {
							Tetris.Block.moveto(0, 0, -0.5);
							flipflop3 = 1;
						}								
					} else {
						flipflop3 = 0;
					}
					
					if(gp.buttons[4].pressed) {
						if (flipflop5 == 0) {
							Tetris.Block.rotate(0, 0, 90);
							flipflop5 = 1;
						}	
						
					} else if (gp.buttons[5].pressed) { 
						if (flipflop5 == 0) {
							Tetris.Block.rotate(0, 0, -90);
							flipflop5 = 1;
						}								
					} else {
						flipflop5 = 0 ;
					}
					
	}

// BKL end Gamepad	
	
// adding progressive effect for new blocks 	
	if (CurrentBlockOpacity <1){
		 CurrentBlockOpacity = CurrentBlockOpacity+0.005;
			if (CurrentBlockOpacity > 0.3){
			    CurrentBlockOpacity = 1;
				CurrentBlockWireFrame = true;
				Tetris.Block.mesh.children["0"].material.wireframe = true;
			}	
		Tetris.Block.mesh.children["0"].material.opacity = CurrentBlockOpacity;
		Tetris.Block.mesh.children["1"].material.opacity = CurrentBlockOpacity;
	}
// BKL speed up the game the higher the score. 
	
	if (Tetris.currentPoints > 9999){
		Tetris.gameStepTime = 100;	
	} else if (Tetris.currentPoints > 3999){
		Tetris.gameStepTime = 200;	
	} else if (Tetris.currentPoints > 2999){
		Tetris.gameStepTime = 300;	
	} else if (Tetris.currentPoints > 1999){
		Tetris.gameStepTime = 400;
	} else if (Tetris.currentPoints > 999){
		Tetris.gameStepTime = 500;
	}			

    while (Tetris.cumulatedFrameTime > Tetris.gameStepTime) {
        Tetris.cumulatedFrameTime -= Tetris.gameStepTime;
        Tetris.Block.move(0, 0, -0.5);
    }
	
	Tetris.stats.update();
	 

	Tetris.effect.render(Tetris.scene, Tetris.camera);
   
	// BKL    if (!Tetris.gameOver) window.requestAnimationFrame(Tetris.animate);
	if (!Tetris.gameOver) Tetris.vrDisplay.requestAnimationFrame(Tetris.animate);
};

//BKL  - adding Button click handlers for VR.
document.querySelector('button#fullscreen').addEventListener('click', function() {
  enterFullscreen(Tetris.renderer.domElement);
});

document.querySelector('button#vr').addEventListener('click', function() {
  Tetris.vrDisplay.requestPresent([{source: Tetris.renderer.domElement}]);
});

function enterFullscreen (el) {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}

function onResize() {
  console.log('Resizing to %s x %s.', window.innerWidth, window.innerHeight);
  Tetris.effect.setSize(window.innerWidth, window.innerHeight);
  Tetris.camera.aspect = window.innerWidth / window.innerHeight;
  Tetris.camera.updateProjectionMatrix();
}

function onVRDisplayPresentChange() {
  console.log('onVRDisplayPresentChange');
  onResize();
}

// Resize the WebGL canvas when we resize and also when we change modes.
window.addEventListener('resize', onResize);
window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);


Tetris.staticBlocks = [];
Tetris.zColors = [
    0x6666ff, 0x66ffff, 0xcc68EE, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66, 0x66EE33, 0x003399, 0x330099, 0xFFA500, 0x99ff00, 0xee1289, 0x71C671, 0x00BFFF, 0x666633, 0x669966, 0x9966ff
];
Tetris.addStaticBlock = function (x, y, z) {
    if (Tetris.staticBlocks[x] === undefined) Tetris.staticBlocks[x] = [];
    if (Tetris.staticBlocks[x][y] === undefined) Tetris.staticBlocks[x][y] = [];

    var mesh = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize), [
        new THREE.MeshPhongMaterial({color:Tetris.zColors[z], shading:THREE.FlatShading, wireframe:true, transparent:false}),
        new THREE.MeshPhongMaterial({color:Tetris.zColors[z]})
    ]);

    mesh.position.x = (x - Tetris.boundingBoxConfig.splitX / 2) * Tetris.blockSize + Tetris.blockSize / 2;
    mesh.position.y = (y - Tetris.boundingBoxConfig.splitY / 2) * Tetris.blockSize + Tetris.blockSize / 2;
    mesh.position.z = (z - Tetris.boundingBoxConfig.splitZ / 2) * Tetris.blockSize + Tetris.blockSize / 2;
//bkl - force background mesh to be viewable by only one eye	
	mesh.layers.set(VR_layers2);
	mesh.children["0"].layers.set(VR_layers2);
	mesh.children["1"].layers.set(VR_layers2);
// end BKL	
    Tetris.scene.add(mesh);
    Tetris.staticBlocks[x][y][z] = mesh;
};

Tetris.currentPoints = 0;
Tetris.addPoints = function (n) {
    Tetris.currentPoints += n;
    
	Tetris.pointsDOM.innerHTML = Tetris.currentPoints; 
    Cufon.replace('#points');
	if (n == 1000) {
		Tetris.sounds["score"].play();
	}
};

// BKL adding HTML-5 Gamepad support 

window.addEventListener("gamepadconnected", function() {
	var gp = navigator.getGamepads()[0];
	// testing to make sure connected controller has enough buttons and axis for control - this code tested only with PS4 controller
	if (gp.buttons.length > 8) {
		if (gp.axes.length > 1) {
				gamepadconnected = 1;
		}
	}
});

window.addEventListener("gamepaddisconnected", function(e) {
    	gamepadconnected = 0;
});


//BKL end gamepad 


window.addEventListener("load", Tetris.init);

window.addEventListener('keydown', function (event) {
    var key = event.which ? event.which : event.keyCode;

    switch (key) {
        //case
		// BKL changed from arrows to use BT keyboard with phone
        case 73: // up (i)
            Tetris.Block.move(0, 1, 0);
            break;
        case 75: // down (k)
            Tetris.Block.move(0, -1, 0);
            break;
        case 74: // left(j)
            Tetris.Block.move(-1, 0, 0);
            break;
        case 76: // right (l)
            Tetris.Block.move(1, 0, 0);
            break;
        case 32: // space
            Tetris.Block.moveto(0, 0, -0.5);
            break;

        case 87: // up (w)
            Tetris.Block.rotate(90, 0, 0);
            break;
        case 83: // down (s)
            Tetris.Block.rotate(-90, 0, 0);
            break;

        case 65: // left(a)
            Tetris.Block.rotate(0, 0, 90);
            break;
        case 68: // right (d)
            Tetris.Block.rotate(0, 0, -90);
            break;

        case 81: // (q)
            Tetris.Block.rotate(0, 90, 0);
            break;
        case 69: // (e)
            Tetris.Block.rotate(0, -90, 0);
            break;
		// BKL adding keyboard commands 	
		case 80: // (p)
            Tetris.start();
            break;	
		case 70: // (f)
			Tetris.vrDisplay.requestPresent([{source: Tetris.renderer.domElement}]);
			enterFullscreen(Tetris.renderer.domElement);
            break;	
		case 86: // (v)
            Tetris.vrDisplay.requestPresent([{source: Tetris.renderer.domElement}]);
			enterFullscreen(Tetris.renderer.domElement);
            break;		
		case 48: // (0)
			VR_layers = 0;
            break;	
		case 49:// (1)
			VR_layers = 1;
            break;			
		case 50: //2
			VR_layers = 2;
            break;		
		case 51: //3
			level = 1;
            break;	
		case 52: //4
			level = 0;
            break;		
		case 53: //5
				VR_layers2 = 1;
			break;			
			 
		case 54: //6
				VR_layers2 = 2;
			break;	 
		case 55: //7
				VR_layers2 = 0;
			break;	 

    }
}, false);	

