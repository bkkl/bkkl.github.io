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
var VR_layers = 0;

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
    Tetris.camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
//	Tetris.camera.zoom = 1;	
    Tetris.scene = new THREE.Scene();

    // the camera starts at 0,0,0 so pull it back
    Tetris.camera.position.z = 150;
	Tetris.camera.position.y = -100;
    Tetris.scene.add(Tetris.camera);

    // start the renderer
    Tetris.renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    document.body.appendChild(Tetris.renderer.domElement);

    // configuration object
    var boundingBoxConfig = {
        width:360,
        height:360,
        depth:1200,
        splitX:6,
        splitY:6,
        splitZ:20
    };
    Tetris.boundingBoxConfig = boundingBoxConfig;
    Tetris.blockSize = boundingBoxConfig.width / boundingBoxConfig.splitX;

    Tetris.Board.init(boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ);

    var boundingBox = new THREE.Mesh(
        new THREE.CubeGeometry(boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth, boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ),
        new THREE.MeshBasicMaterial({color:0xffaa00, wireframe:true, side: THREE.DoubleSide, transparent:true})
    );
	// BKL controling color of the bounding box
	boundingBox.setColor = function(color){
		boundingBox.material.color = new THREE.Color(color);
		}
//	boundingBox.setColor(0xFFFFFF)  //change color using hex value or
//	boundingBox.setColor("blue")    //set material color by using color name
	
    Tetris.scene.add(boundingBox);

    Tetris.renderer.render(Tetris.scene, Tetris.camera);

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
	var geometry2 = new THREE.BoxGeometry(10,10,10);
	var material2 = new THREE.MeshNormalMaterial();
	var cube2 = new THREE.Mesh(geometry2, material2);
	var cube3 = new THREE.Mesh(geometry2, material2);
	var fit = new THREE.Object3D(); 
	// Position cube mesh
/*
	cube2.position.z = 5;
	cube2.position.x = 0;
	cube2.position.y = 0;
	cube2.layers.set(1);
	
	cube3.position.z = 5;
	cube3.position.x = 0;
	cube3.position.y = -10;
	cube3.layers.set(0);
	
	fit.add(cube2);
	fit.add(cube3);
	
	Tetris.scene.add(fit);
*/	
	// bkl 
	
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

Tetris.gameStepTime = 750;

Tetris.frameTime = 0; // ms
Tetris.cumulatedFrameTime = 0; // ms
Tetris._lastFrameTime = Date.now(); // timestamp

Tetris.gameOver = false;

Tetris.animate = function () {
    var time = Date.now();
    Tetris.frameTime = time - Tetris._lastFrameTime;
    Tetris._lastFrameTime = time;
    Tetris.cumulatedFrameTime += Tetris.frameTime;

    while (Tetris.cumulatedFrameTime > Tetris.gameStepTime) {
        Tetris.cumulatedFrameTime -= Tetris.gameStepTime;
        Tetris.Block.move(0, 0, -0.5);
    }
	
	Tetris.stats.update();
	 
//	Tetris.Block.mesh.layers.set(1);
//    Tetris.renderer.render(Tetris.scene, Tetris.camera);
	// BKL Render the VR scene.
//	Tetris.camera.updateProjectionMatrix();
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



// nice test:
// var i = 0, j = 0, k = 0, interval = setInterval(function() {if(i==6) {i=0;j++;} if(j==6) {j=0;k++;} if(k==6) {clearInterval(interval); return;} Tetris.addStaticBlock(i,j,k); i++;},30)

Tetris.staticBlocks = [];
Tetris.zColors = [
    0x6666ff, 0x66ffff, 0xcc68EE, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66, 0x66EE33, 0x003399, 0x330099, 0xFFA500, 0x99ff00, 0xee1289, 0x71C671, 0x00BFFF, 0x666633, 0x669966, 0x9966ff
];
Tetris.addStaticBlock = function (x, y, z) {
    if (Tetris.staticBlocks[x] === undefined) Tetris.staticBlocks[x] = [];
    if (Tetris.staticBlocks[x][y] === undefined) Tetris.staticBlocks[x][y] = [];

    var mesh = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize), [
        new THREE.MeshBasicMaterial({color:0x000000, shading:THREE.FlatShading, wireframe:true, transparent:true}),
        new THREE.MeshBasicMaterial({color:Tetris.zColors[z]})
    ]);

    mesh.position.x = (x - Tetris.boundingBoxConfig.splitX / 2) * Tetris.blockSize + Tetris.blockSize / 2;
    mesh.position.y = (y - Tetris.boundingBoxConfig.splitY / 2) * Tetris.blockSize + Tetris.blockSize / 2;
    mesh.position.z = (z - Tetris.boundingBoxConfig.splitZ / 2) * Tetris.blockSize + Tetris.blockSize / 2;

    Tetris.scene.add(mesh);
    Tetris.staticBlocks[x][y][z] = mesh;
};

Tetris.currentPoints = 0;
Tetris.addPoints = function (n) {
    Tetris.currentPoints += n;
    Tetris.pointsDOM.innerHTML = Tetris.currentPoints;
    Cufon.replace('#points');
    Tetris.sounds["score"].play();
};

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
			setTimeout(Tetris.start(), 5000);
//            Tetris.start();
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
			 
    }
}, false);	

