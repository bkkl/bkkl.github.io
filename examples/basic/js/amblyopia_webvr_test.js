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
//BKL used to control left eye / right eye layers. (0 = both, 1=left (default), 2=right)
var VR_layers = 1;
var N_VR_layers = 2;
//BKL global for gamepad
var gamepadconnected = 0;
var flipflop3 = 0 ; // debounce control for gamepad 
var flipflop5 = 0 ; // debounce control for gamepad 

var VR_letter_x_start_position_ref = 30;
var VR_letter_x_start_position = VR_letter_x_start_position_ref;
// swaps letter position in left (1) / right (-1) based on VR_layers 
var VR_letter_x_start_side = 1;

var VR_active_rnd_x_start = 300;
var VR_active_rnd_y_start = 600;
var VR_step_time = 70;
// BKL used to create easy level 
var level = 0;
var CurrentBlockOpacity = 1;
var CurrentBlockWireFrame = true;
var key_letter = 0;
var current_letter = 0;
var wildcard = 0;
var z_start = 550; 
var font_size = 10;
var font_size_key = 50;
var ptextMaterial = new THREE.MeshPhongMaterial( { color: 0xeeeeee, reflectivity: 0xffffff, shininess: 100} );
//bkl added to attempt to track progress of amblyopia therapy -> higher z_avg would indicate smaller letter reconginition. 
var z_score = 0;
var z_count = 0;
var z_avg = 0;

// BKL load fonts and preload master letter and 

//    var abc = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//	var rand = Math.floor(Math.random() * (abc.length-1));
//	var AB =  rand_letter();
	
/*     var abc = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";p
	var rand = Math.floor(Math.random() * (abc.length-1));
	var AB =  abc.charAt(rand); */	
	var AB =  rand_letter();
	var loader = new THREE.FontLoader();
	loader.load('fonts/helvetiker_bold.typeface.json', function ( font ) {
		// load set of letters used for "current_letter" object 
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		//A 
		var textGeo = new THREE.TextGeometry("A", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_A = new THREE.Mesh( textGeo, textMaterial );
		Tetris.text_key = new THREE.Mesh( textGeo, textMaterial );
		Tetris.text_active = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_A.position.x = -middle.x;
		Tetris.text_A.position.y = -middle.y;
		Tetris.text_A.position.z = z_start;
		Tetris.text_A.castShadow = false;
		Tetris.text_A.receiveShadow = false;	
	// B	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("B", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();

		Tetris.text_B = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_B.position.x = -middle.x;
		Tetris.text_B.position.y = -middle.y;
		Tetris.text_B.position.z = z_start;
		Tetris.text_B.castShadow = false;
		Tetris.text_B.receiveShadow = false;
	// C	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("C", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_C = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_C.position.x = -middle.x;
		Tetris.text_C.position.y = -middle.y;
		Tetris.text_C.position.z = z_start;
		Tetris.text_C.castShadow = false;
		Tetris.text_C.receiveShadow = false;
	// D	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("D", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_D = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_D.position.x = -middle.x;
		Tetris.text_D.position.y = -middle.y;
		Tetris.text_D.position.z = z_start;
		Tetris.text_D.castShadow = false;
		Tetris.text_D.receiveShadow = false;
	// E	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("E", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_E = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_E.position.x = -middle.x;
		Tetris.text_E.position.y = -middle.y;
		Tetris.text_E.position.z = z_start;
		Tetris.text_E.castShadow = false;
		Tetris.text_E.receiveShadow = false;		
	// F
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("F", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_F = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_F.position.x = -middle.x;
		Tetris.text_F.position.y = -middle.y;
		Tetris.text_F.position.z = z_start;
		Tetris.text_F.castShadow = false;
		Tetris.text_F.receiveShadow = false;	
	// G
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("G", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_G = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_G.position.x = -middle.x;
		Tetris.text_G.position.y = -middle.y;
		Tetris.text_G.position.z = z_start;
		Tetris.text_G.castShadow = false;
		Tetris.text_G.receiveShadow = false;	
	// H	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("H", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_H = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_H.position.x = -middle.x;
		Tetris.text_H.position.y = -middle.y;
		Tetris.text_H.position.z = z_start;
		Tetris.text_H.castShadow = false;
		Tetris.text_H.receiveShadow = false;
	// I	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("I", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_I = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_I.position.x = -middle.x;
		Tetris.text_I.position.y = -middle.y;
		Tetris.text_I.position.z = z_start;
		Tetris.text_I.castShadow = false;
		Tetris.text_I.receiveShadow = false;	
	// J	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("J", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_J = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_J.position.x = -middle.x;
		Tetris.text_J.position.y = -middle.y;
		Tetris.text_J.position.z = z_start;
		Tetris.text_J.castShadow = false;
		Tetris.text_J.receiveShadow = false;	
	// K	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("K", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_K = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_K.position.x = -middle.x;
		Tetris.text_K.position.y = -middle.y;
		Tetris.text_K.position.z = z_start;
		Tetris.text_K.castShadow = false;
		Tetris.text_K.receiveShadow = false;	
	// L	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("L", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_L = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_L.position.x = -middle.x;
		Tetris.text_L.position.y = -middle.y;
		Tetris.text_L.position.z = z_start;
		Tetris.text_L.castShadow = false;
		Tetris.text_L.receiveShadow = false;
	// M	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("M", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_M = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_M.position.x = -middle.x;
		Tetris.text_M.position.y = -middle.y;
		Tetris.text_M.position.z = z_start;
		Tetris.text_M.castShadow = false;
		Tetris.text_M.receiveShadow = false;	
	// N	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("N", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_N = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_N.position.x = -middle.x;
		Tetris.text_N.position.y = -middle.y;
		Tetris.text_N.position.z = z_start;
		Tetris.text_N.castShadow = false;
		Tetris.text_N.receiveShadow = false;	
	// O	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("O", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_O = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_O.position.x = -middle.x;
		Tetris.text_O.position.y = -middle.y;
		Tetris.text_O.position.z = z_start;
		Tetris.text_O.castShadow = false;
		Tetris.text_O.receiveShadow = false;	
	// P	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("P", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_P = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_P.position.x = -middle.x;
		Tetris.text_P.position.y = -middle.y;
		Tetris.text_P.position.z = z_start;
		Tetris.text_P.castShadow = false;
		Tetris.text_P.receiveShadow = false;	
	// Q	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("Q", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_Q = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_Q.position.x = -middle.x;
		Tetris.text_Q.position.y = -middle.y;
		Tetris.text_Q.position.z = z_start;
		Tetris.text_Q.castShadow = false;
		Tetris.text_Q.receiveShadow = false;	
	// R	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("R", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_R = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_R.position.x = -middle.x;
		Tetris.text_R.position.y = -middle.y;
		Tetris.text_R.position.z = z_start;
		Tetris.text_R.castShadow = false;
		Tetris.text_R.receiveShadow = false;	
	// S	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("S", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_S = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_S.position.x = -middle.x;
		Tetris.text_S.position.y = -middle.y;
		Tetris.text_S.position.z = z_start;
		Tetris.text_S.castShadow = false;
		Tetris.text_S.receiveShadow = false;	
	// T	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("T", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_T = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_T.position.x = -middle.x;
		Tetris.text_T.position.y = -middle.y;
		Tetris.text_T.position.z = z_start;
		Tetris.text_T.castShadow = false;
		Tetris.text_T.receiveShadow = false;	
	// U	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("U", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_U = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_U.position.x = -middle.x;
		Tetris.text_U.position.y = -middle.y;
		Tetris.text_U.position.z = z_start;
		Tetris.text_U.castShadow = false;
		Tetris.text_U.receiveShadow = false;
	// V	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("V", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_V = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_V.position.x = -middle.x;
		Tetris.text_V.position.y = -middle.y;
		Tetris.text_V.position.z = z_start;
		Tetris.text_V.castShadow = false;
		Tetris.text_V.receiveShadow = false;
	// W	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("W", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_W = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_W.position.x = -middle.x;
		Tetris.text_W.position.y = -middle.y;
		Tetris.text_W.position.z = z_start;
		Tetris.text_W.castShadow = false;
		Tetris.text_W.receiveShadow = false;	
	// X	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("X", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_X = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_X.position.x = -middle.x;
		Tetris.text_X.position.y = -middle.y;
		Tetris.text_X.position.z = z_start;
		Tetris.text_X.castShadow = false;
		Tetris.text_X.receiveShadow = false;
	// Y	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("Y", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_Y = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_Y.position.x = -middle.x;
		Tetris.text_Y.position.y = -middle.y;
		Tetris.text_Y.position.z = z_start;
		Tetris.text_Y.castShadow = false;
		Tetris.text_Y.receiveShadow = false;	
	// Z	
		var textMaterial = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, specular: Math.random() * 0xffffff, reflectivity: Math.random() * 0xffffff, shininess: Math.random() * 100} );
		var textGeo = new THREE.TextGeometry("Z", {
			font: font,
			size: font_size, // font size
			height: 10, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_Z = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_Z.position.x = -middle.x;
		Tetris.text_Z.position.y = -middle.y;
		Tetris.text_Z.position.z = z_start;
		Tetris.text_Z.castShadow = false;
		Tetris.text_Z.receiveShadow = false;	
	//  read this	
	// repeat and load letters for key_letter object -> these can not be shared. 
	//  read this 
		var textGeo = new THREE.TextGeometry("A", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_A = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_A.position.x = -middle.x;
		Tetris.text_key_A.position.y = -middle.y;
		Tetris.text_key_A.position.z = z_start;
		Tetris.text_key_A.castShadow = false;
		Tetris.text_key_A.receiveShadow = false;	
	// B	
		var textGeo = new THREE.TextGeometry("B", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_B = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_B.position.x = -middle.x;
		Tetris.text_key_B.position.y = -middle.y;
		Tetris.text_key_B.position.z = z_start;
		Tetris.text_key_B.castShadow = false;
		Tetris.text_key_B.receiveShadow = false;
	// C	
		var textGeo = new THREE.TextGeometry("C", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_C = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_C.position.x = -middle.x;
		Tetris.text_key_C.position.y = -middle.y;
		Tetris.text_key_C.position.z = z_start;
		Tetris.text_key_C.castShadow = false;
		Tetris.text_key_C.receiveShadow = false;
	// D	
		var textGeo = new THREE.TextGeometry("D", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_D = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_D.position.x = -middle.x;
		Tetris.text_key_D.position.y = -middle.y;
		Tetris.text_key_D.position.z = z_start;
		Tetris.text_key_D.castShadow = false;
		Tetris.text_key_D.receiveShadow = false;
	// E	
		var textGeo = new THREE.TextGeometry("E", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_E = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_E.position.x = -middle.x;
		Tetris.text_key_E.position.y = -middle.y;
		Tetris.text_key_E.position.z = z_start;
		Tetris.text_key_E.castShadow = false;
		Tetris.text_key_E.receiveShadow = false;		
	// F	
		var textGeo = new THREE.TextGeometry("F", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_F = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_F.position.x = -middle.x;
		Tetris.text_key_F.position.y = -middle.y;
		Tetris.text_key_F.position.z = z_start;
		Tetris.text_key_F.castShadow = false;
		Tetris.text_key_F.receiveShadow = false;	
	// G	
		var textGeo = new THREE.TextGeometry("G", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_G = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_G.position.x = -middle.x;
		Tetris.text_key_G.position.y = -middle.y;
		Tetris.text_key_G.position.z = z_start;
		Tetris.text_key_G.castShadow = false;
		Tetris.text_key_G.receiveShadow = false;	
	// H	
		var textGeo = new THREE.TextGeometry("H", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_H = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_H.position.x = -middle.x;
		Tetris.text_key_H.position.y = -middle.y;
		Tetris.text_key_H.position.z = z_start;
		Tetris.text_key_H.castShadow = false;
		Tetris.text_key_H.receiveShadow = false;
	// I	
		var textGeo = new THREE.TextGeometry("I", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_I = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_I.position.x = -middle.x;
		Tetris.text_key_I.position.y = -middle.y;
		Tetris.text_key_I.position.z = z_start;
		Tetris.text_key_I.castShadow = false;
		Tetris.text_key_I.receiveShadow = false;	
	// J	
		var textGeo = new THREE.TextGeometry("J", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_J = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_J.position.x = -middle.x;
		Tetris.text_key_J.position.y = -middle.y;
		Tetris.text_key_J.position.z = z_start;
		Tetris.text_key_J.castShadow = false;
		Tetris.text_key_J.receiveShadow = false;	
	// K	
		var textGeo = new THREE.TextGeometry("K", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_K = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_K.position.x = -middle.x;
		Tetris.text_key_K.position.y = -middle.y;
		Tetris.text_key_K.position.z = z_start;
		Tetris.text_key_K.castShadow = false;
		Tetris.text_key_K.receiveShadow = false;	
	// L	
		var textGeo = new THREE.TextGeometry("L", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_L = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_L.position.x = -middle.x;
		Tetris.text_key_L.position.y = -middle.y;
		Tetris.text_key_L.position.z = z_start;
		Tetris.text_key_L.castShadow = false;
		Tetris.text_key_L.receiveShadow = false;
	// M	
		var textGeo = new THREE.TextGeometry("M", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_M = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_M.position.x = -middle.x;
		Tetris.text_key_M.position.y = -middle.y;
		Tetris.text_key_M.position.z = z_start;
		Tetris.text_key_M.castShadow = false;
		Tetris.text_key_M.receiveShadow = false;	
	// N	
		var textGeo = new THREE.TextGeometry("N", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_N = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_N.position.x = -middle.x;
		Tetris.text_key_N.position.y = -middle.y;
		Tetris.text_key_N.position.z = z_start;
		Tetris.text_key_N.castShadow = false;
		Tetris.text_key_N.receiveShadow = false;	
	// O	
		var textGeo = new THREE.TextGeometry("O", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_O = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_O.position.x = -middle.x;
		Tetris.text_key_O.position.y = -middle.y;
		Tetris.text_key_O.position.z = z_start;
		Tetris.text_key_O.castShadow = false;
		Tetris.text_key_O.receiveShadow = false;	
	// P	
		var textGeo = new THREE.TextGeometry("P", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_P = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_P.position.x = -middle.x;
		Tetris.text_key_P.position.y = -middle.y;
		Tetris.text_key_P.position.z = z_start;
		Tetris.text_key_P.castShadow = false;
		Tetris.text_key_P.receiveShadow = false;	
	// Q	
		var textGeo = new THREE.TextGeometry("Q", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_Q = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_Q.position.x = -middle.x;
		Tetris.text_key_Q.position.y = -middle.y;
		Tetris.text_key_Q.position.z = z_start;
		Tetris.text_key_Q.castShadow = false;
		Tetris.text_key_Q.receiveShadow = false;	
	// R	
		var textGeo = new THREE.TextGeometry("R", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_R = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_R.position.x = -middle.x;
		Tetris.text_key_R.position.y = -middle.y;
		Tetris.text_key_R.position.z = z_start;
		Tetris.text_key_R.castShadow = false;
		Tetris.text_key_R.receiveShadow = false;	
	// S	
		var textGeo = new THREE.TextGeometry("S", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_S = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_S.position.x = -middle.x;
		Tetris.text_key_S.position.y = -middle.y;
		Tetris.text_key_S.position.z = z_start;
		Tetris.text_key_S.castShadow = false;
		Tetris.text_key_S.receiveShadow = false;	
	// T	
		var textGeo = new THREE.TextGeometry("T", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_T = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_T.position.x = -middle.x;
		Tetris.text_key_T.position.y = -middle.y;
		Tetris.text_key_T.position.z = z_start;
		Tetris.text_key_T.castShadow = false;
		Tetris.text_key_T.receiveShadow = false;	
	// U	
		var textGeo = new THREE.TextGeometry("U", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_U = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_U.position.x = -middle.x;
		Tetris.text_key_U.position.y = -middle.y;
		Tetris.text_key_U.position.z = z_start;
		Tetris.text_key_U.castShadow = false;
		Tetris.text_key_U.receiveShadow = false;
	// V	
		var textGeo = new THREE.TextGeometry("V", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_V = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_V.position.x = -middle.x;
		Tetris.text_key_V.position.y = -middle.y;
		Tetris.text_key_V.position.z = z_start;
		Tetris.text_key_V.castShadow = false;
		Tetris.text_key_V.receiveShadow = false;
	// W	
		var textGeo = new THREE.TextGeometry("W", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_W = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_W.position.x = -middle.x;
		Tetris.text_key_W.position.y = -middle.y;
		Tetris.text_key_W.position.z = z_start;
		Tetris.text_key_W.castShadow = false;
		Tetris.text_key_W.receiveShadow = false;	
	// X	
		var textGeo = new THREE.TextGeometry("X", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_X = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_X.position.x = -middle.x;
		Tetris.text_key_X.position.y = -middle.y;
		Tetris.text_key_X.position.z = z_start;
		Tetris.text_key_X.castShadow = false;
		Tetris.text_key_X.receiveShadow = false;
	// Y	
		var textGeo = new THREE.TextGeometry("Y", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_Y = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_Y.position.x = -middle.x;
		Tetris.text_key_Y.position.y = -middle.y;
		Tetris.text_key_Y.position.z = z_start;
		Tetris.text_key_Y.castShadow = false;
		Tetris.text_key_Y.receiveShadow = false;	
	// Z	
		var textGeo = new THREE.TextGeometry("Z", {
			font: font,
			size: font_size_key, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		Tetris.text_key_Z = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
		Tetris.text_key_Z.position.x = -middle.x;
		Tetris.text_key_Z.position.y = -middle.y;
		Tetris.text_key_Z.position.z = z_start;
		Tetris.text_key_Z.castShadow = false;
		Tetris.text_key_Z.receiveShadow = false;		
//  adding text handles for a score GUI
		var textGeo = new THREE.TextGeometry('POINTS:', {
			font: font,
			size: 10, // font size
			height: 1, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
//		textGeo.computeBoundingBox();
		Tetris.text_score = new THREE.Mesh( textGeo, ptextMaterial );
		Tetris.text_score.position.x = -100;
		Tetris.text_score.position.y = -100;
		Tetris.text_score.position.z = -200;
		Tetris.text_score.castShadow = false;
		Tetris.text_score.receiveShadow = false;

// current points		
		var textGeo = new THREE.TextGeometry(Tetris.currentPoints, {
			font: font,
			size: 10, // font size
			height: 1, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
//		textGeo.computeBoundingBox();
		Tetris.text_points = new THREE.Mesh( textGeo, ptextMaterial );
		Tetris.text_points.position.x = 0;
		Tetris.text_points.position.y = -100;
		Tetris.text_points.position.z = -200;
		Tetris.text_points.layers.set(VR_layers);
		Tetris.text_points.castShadow = false;
		Tetris.text_points.receiveShadow = false;
		
	});


/*  	var loader2 = new THREE.FontLoader();
	loader2.load('fonts/helvetiker_bold.typeface.json', function ( font ) {

		var textGeo = new THREE.TextGeometry(rand_letter(), {
			font: font,
			size: 45, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff } );
		Tetris.text2 = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
 		Tetris.text2.position.x = -middle.x;
		Tetris.text2.position.y = -middle.y;
		Tetris.text2.position.z = 550;
		Tetris.text2.castShadow = false;
		Tetris.text2.receiveShadow = false;
		Tetris.text2.layers.set(1);	 
	});	  */
	
	
/* function refresh_letter() {	
	var loader2 = new THREE.FontLoader();
	loader2.load('fonts/helvetiker_bold.typeface.json', function ( font ) {

		var textGeo = new THREE.TextGeometry(rand_letter(), {
			font: font,
			size: 45, // font size
			height: 20, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});
		textGeo.computeBoundingBox();
		var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff } );
		Tetris.text2 = new THREE.Mesh( textGeo, textMaterial );
		// find middle of font
		var middle = new THREE.Vector3();

		middle.x = (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x) / 2;
		middle.y = (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y) / 2;
		middle.z = (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z) / 2;
		
 		Tetris.text2.position.x = -middle.x;
		Tetris.text2.position.y = -middle.y;
		Tetris.text2.position.z = 550;
		Tetris.text2.castShadow = false;
		Tetris.text2.receiveShadow = false;
		Tetris.text2.layers.set(1);	 
	});	

} */

	
Tetris.init = function () {
    Tetris.sounds["theme"] = document.getElementById("audio_theme");  
    Tetris.sounds["collision"] = document.getElementById("audio_collision");  
    Tetris.sounds["move"] = document.getElementById("audio_move");  
    Tetris.sounds["gameover"] = document.getElementById("audio_gameover");  
    Tetris.sounds["score"] = document.getElementById("audio_score");  

    Tetris.sounds["theme"].play();
    // set the scene size
	
	// BKL create inital random letter
//	refresh_letter();

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
    Tetris.camera.position.z = 400;
	Tetris.camera.position.y = 0;
    Tetris.scene.add(Tetris.camera);

    // start the renderer
    Tetris.renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    document.body.appendChild(Tetris.renderer.domElement);
	
	// add headset postion control
	// Apply VR headset positional data to camera.
	Tetris.controls = new THREE.VRControls(Tetris.camera);

    // configuration object
    var boundingBoxConfig = {
        width:1440,
        height:720,
        depth:1700,
        splitX:6,
        splitY:6,
        splitZ:20
    };
    Tetris.boundingBoxConfig = boundingBoxConfig;
    Tetris.blockSize = boundingBoxConfig.width / boundingBoxConfig.splitX;

    Tetris.Board.init(boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ);
	//BKL adding texture to bounding box
    var texture1 = THREE.ImageUtils.loadTexture( 'img/bricks.jpg' );
    var texture2 = THREE.ImageUtils.loadTexture( 'img/sky.png' );
//		texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
//	    texture2.repeat.set( 6, 6 );
	var material = new THREE.MeshLambertMaterial({ map: texture2, side: THREE.BackSide, opacity: 0.8, transparent: true });
	
//	var material = new THREE.MeshPhongMaterial({ map: THREE.TextureLoader('img/crate'), side: THREE.BackSide, opacity: 0.75, transparent: true, wireframe: false });
 //     var material = new THREE.MeshBasicMaterial({color:0xffaa00, wireframe:true, side: THREE.DoubleSide, transparent:true});
  /*
    var boundingBox = new THREE.Mesh(
        new THREE.CubeGeometry(boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth, boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ),
        new THREE.MeshBasicMaterial({color:0xffaa00, wireframe:true, side: THREE.DoubleSide, transparent:true})
    );
 */
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
// BKL controling color of the bounding box when not using texture.
//	boundingBox.setColor = function(color){
//		boundingBox.material.color = new THREE.Color(color);
//		}
//	boundingBox.setColor(0xFFFFFF)  //change color using hex value or
//	boundingBox.setColor("blue")    //set material color by using color name

//    Tetris.scene.add(boundingBox);

// Sphere Bounding Box 
	var sphere_geometry = new THREE.SphereGeometry(1500, 32, 32);
	var sphere_material = new THREE.MeshLambertMaterial({ map: texture2, side: THREE.BackSide, opacity: 0.8, transparent: true });
	pano = new THREE.Mesh(sphere_geometry, sphere_material);
	Tetris.scene.add(pano);
	
	
//  Adding Light
	var light = new THREE.AmbientLight( 0x404040 );
	Tetris.scene.add( light );
	var light2 = new THREE.PointLight( 0xffffff, 1, 100 );
	light2.intensity = 1;
	Tetris.scene.add( light2 );
	var light3 = new THREE.DirectionalLight( 0xffffff );
	light3.position.set( -1, -6, 10 ).normalize();
	Tetris.scene.add(light3);
	
//    Tetris.renderer.render(Tetris.scene, Tetris.camera);

    Tetris.stats = new Stats();
    Tetris.stats.domElement.style.position = 'absolute';
    Tetris.stats.domElement.style.top = '10px';
    Tetris.stats.domElement.style.left = '10px';
// BKL Use to disable stat window 	
//    document.body.appendChild(Tetris.stats.domElement);

// BKL initialize random letters. 
	key_letter = rand_num();
	rand_set_key(key_letter);
	rand_set_active(1+key_letter);
	
    document.getElementById("play_button").addEventListener('click', function (event) {
        event.preventDefault();
        Tetris.start();
    });
};

Tetris.start = function () {
    document.getElementById("menu").style.display = "none";
// bkl - changing HTML points to z_avg to show progress 	
    Tetris.pointsDOM = document.getElementById("points");
    Tetris.pointsDOM.style.display = "block";
	
    Tetris.sounds["theme"].pause();
	
    //Tetris.Block.generate();
	//BKL test block
	var geometry2 = new THREE.BoxGeometry(200,200,200);

//	var material2 = new THREE.MeshLambertMaterial();
//	var loader = new THREE.TextureLoader();
//	var texture1 = loader.load('img/bricks.jpg');
//	var texture2 = loader.load('img/crate.jpg');

	var texture1 = THREE.ImageUtils.loadTexture( 'img/bricks.jpg' );
    var texture2 = THREE.ImageUtils.loadTexture( 'img/crate.jpg' );
	var material1 = new THREE.MeshLambertMaterial({ map: texture1});
	var material2 = new THREE.MeshLambertMaterial({ map: texture2});
	var material3 = new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: false});
	var material4 = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: false});
	var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
	
	Tetris.cube1 = new THREE.Mesh(geometry2, material3);
	Tetris.cubeoutline1 = new THREE.Mesh(geometry2, outlineMaterial1);
	Tetris.cube2 = new THREE.Mesh(geometry2, material4);
	Tetris.cubeoutline2 = new THREE.Mesh(geometry2, outlineMaterial1);
//	var fit = new THREE.Object3D(); 
	// Position cube mesh

	Tetris.cube1.position.z = 200;
	Tetris.cube1.position.x = 200;
	Tetris.cube1.position.y = 0;
	Tetris.cube1.layers.set(0);
	
	Tetris.cubeoutline1.position = Tetris.cube1.position;
	Tetris.cubeoutline1.scale.multiplyScalar(1.02);
	
	Tetris.cube2.position.z = -600;
	Tetris.cube2.position.x = -200;
	Tetris.cube2.position.y = 0;
	Tetris.cube2.layers.set(1);
	Tetris.cubeoutline2.position = Tetris.cube2.position;
	Tetris.cubeoutline2.scale.multiplyScalar(1.02);
//	Tetris.scene.add(Tetris.cube1);
//	Tetris.scene.add(Tetris.cubeoutline1);
//	Tetris.scene.add(Tetris.cube2);
//	Tetris.scene.add(Tetris.cubeoutline2); 
    //// add text to cube of TextGeometry
	Tetris.text_key.position.x = (VR_letter_x_start_side*VR_letter_x_start_position);
	Tetris.text_key.position.z = -150;
	Tetris.text_active.position.x = (VR_letter_x_start_side*-VR_letter_x_start_position);
//   Tetris.text_active.position.x = (-VR_letter_x_start_position);
	Tetris.text_active.position.z = -1400;
//	Tetris.cube2.position.x = -200;
	Tetris.scene.add(Tetris.text_key);  
	Tetris.scene.add(Tetris.text_active);
	Tetris.scene.add(Tetris.text_score);
	Tetris.scene.add(Tetris.text_points);
	Tetris.text_active.visible = true;

// End TextGeometry


	
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


Tetris.gameStepTime = VR_step_time;

Tetris.frameTime = 0; // ms
Tetris.cumulatedFrameTime = 0; // ms
Tetris._lastFrameTime = Date.now(); // timestamp

Tetris.gameOver = false;

Tetris.animate = function () {
	Tetris.gameStepTime = VR_step_time;
    var time = Date.now();
    Tetris.frameTime = time - Tetris._lastFrameTime;
    Tetris._lastFrameTime = time;
    Tetris.cumulatedFrameTime += Tetris.frameTime;
// Adding headset postion control 	
//	Tetris.controls.update();
// BKL adding input from controller
// BKL Adding HTML5 GAMEPAD READ
	if (gamepadconnected == 1) {
					var gp = navigator.getGamepads()[0];
/* 					var axeLF = gp.axes[0];
					var axeUP = gp.axes[1];
					// left - right joystick
					if(axeLF < -0.9) {
						if (flipflop2 == 0) {
							Tetris.Block.rotate(0, 90, 0);
							flipflop2 = 1;
						}	
					
					} else if(axeLF > 0.9) {
						if (flipflop2 == 0) {
							Tetris.Block.rotate(0, -90, 0);
							flipflop2 = 1;
						}
					
					} else {
						flipflop2 = 0;
					}	
					
					// left - right joystick
					if(axeUP < -0.9) {
						if (flipflop4 == 0) {
							Tetris.Block.rotate(90, 0, 0);
							flipflop4 = 1;
						}	
					
					} else if(axeUP > 0.9) {
						if (flipflop4 == 0) {
							Tetris.Block.rotate(-90, 0, 0);
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
					} */
					            
					
					if(gp.buttons[5].pressed) {
						if (flipflop3 == 0) {
							wrong_letter();
							flipflop3 = 1;
						}	
						
					} else if (gp.buttons[7].pressed) { 
						if (flipflop3 == 0) {
							wrong_letter();
							flipflop3 = 1;
						}								
					} else {
						flipflop3 = 0;
					}
					
					if(gp.buttons[4].pressed) {
						if (flipflop5 == 0) {
							correct_letter();
							flipflop5 = 1;
						}	
						
					} else if (gp.buttons[6].pressed) { 
						if (flipflop5 == 0) {
							correct_letter();
							flipflop5 = 1;
						}								
					} else {
						flipflop5 = 0 ;
					}
					
	}

// BKL end Gamepad
	

    while (Tetris.cumulatedFrameTime > Tetris.gameStepTime) {
        Tetris.cumulatedFrameTime -= Tetris.gameStepTime;

// Get new random letter when Z gets too close to player
	if (Tetris.text_active.position.z > 300) {
			Tetris.text_active.visible = false;
			if (Math.abs(key_letter-current_letter) < 5){
				current_letter=key_letter; 
			    }
			else {current_letter = rand_num();
				}
			current_letter = rand_num();
			rand_set_active(current_letter);
			Tetris.text_active.position.x = (VR_letter_x_start_side*-VR_letter_x_start_position);
//			Tetris.text_active.position.x = (-VR_letter_x_start_position);
			Tetris.text_active.position.z = -1400;
			Tetris.scene.add(Tetris.text_active);
			Tetris.text_active.visible = true;	
			// bkl add random level 
			if (Tetris.currentPoints > 150) {
				Tetris.text_active.position.x = (VR_letter_x_start_side*-Math.floor(Math.random() * (VR_active_rnd_x_start)));
				Tetris.text_active.position.y = (Math.floor(Math.random()*VR_active_rnd_y_start) - (VR_active_rnd_y_start/2-1));
				Tetris.text_active.position.z = -1400;
			}
	}

	
	if (Tetris.text_active.position.z > -400){
	    Tetris.text_active.position.z = Tetris.text_active.position.z +4;
				if (Tetris.text_active.position.y > 0){
					Tetris.text_active.position.y = Tetris.text_active.position.y -1;
				}
				if (Tetris.text_active.position.y < -0){
					Tetris.text_active.position.y = Tetris.text_active.position.y +1;
				}
				if (Tetris.text_active.position.x > 5){
					Tetris.text_active.position.x = Tetris.text_active.position.x -1;
				}
				if (Tetris.text_active.position.x < -5){
					Tetris.text_active.position.x = Tetris.text_active.position.x +1;
				}	
		
	}
	else{
		Tetris.text_active.position.z = Tetris.text_active.position.z +13;
		
				if (Tetris.text_active.position.y > 2){
					Tetris.text_active.position.y = Tetris.text_active.position.y -2.5;
				}
				if (Tetris.text_active.position.y < 2){
					Tetris.text_active.position.y = Tetris.text_active.position.y +2.5;
				}
				if (Tetris.text_active.position.x > 5){
					Tetris.text_active.position.x = Tetris.text_active.position.x -2.5;
				}
				if (Tetris.text_active.position.x < -5){
					Tetris.text_active.position.x = Tetris.text_active.position.x +2.5;
				}		
	}
	
		
    }
	

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

// BKL added to generate randome letters
function rand_letter() {
//    var abc = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var rand = Math.floor(Math.random() * (abc.length-1));
	return  abc.charAt(rand);
}

function rand_num() {
	var rand = Math.floor(Math.random() * (26-1+1))+1;
	return  rand;
}

function wild_num() {
	var rand = Math.floor(Math.random() * (8-1+1))+1;
	return  rand;
}

function rand_set_key (rand_key_value) {
		switch (rand_key_value) {
			case 1:
				Tetris.text_key = Tetris.text_key_A;
				break;
			case 2: 
				Tetris.text_key = Tetris.text_key_B;
				break;
			case 3: 
				Tetris.text_key = Tetris.text_key_C;
				break;
			case 4: 
				Tetris.text_key = Tetris.text_key_D;
				break;	
			case 5:
				Tetris.text_key = Tetris.text_key_E;
				break;
			case 6: 
				Tetris.text_key = Tetris.text_key_F;
				break;
			case 7: 
				Tetris.text_key = Tetris.text_key_G;
				break;
			case 8: 
				Tetris.text_key = Tetris.text_key_H;
				break;			
			case 9: 
				Tetris.text_key = Tetris.text_key_I;
				break;
			case 10: 
				Tetris.text_key = Tetris.text_key_J;
				break;
			case 11: 
				Tetris.text_key = Tetris.text_key_K;
				break;			
			case 12: 
				Tetris.text_key = Tetris.text_key_L;
				break;
			case 13: 
				Tetris.text_key = Tetris.text_key_M;
				break;
			case 14: 
				Tetris.text_key = Tetris.text_key_N;
				break;
			case 15: 
				Tetris.text_key = Tetris.text_key_O;
				break;
			case 16: 
				Tetris.text_key = Tetris.text_key_P;
				break;
			case 17: 
				Tetris.text_key = Tetris.text_key_Q;
				break;	
			case 18: 
				Tetris.text_key = Tetris.text_key_R;
				break;
			case 19: 
				Tetris.text_key = Tetris.text_key_S;
				break;
			case 20: 
				Tetris.text_key = Tetris.text_key_T;
				break;			
			case 21:
				Tetris.text_key = Tetris.text_key_U;
				break;
			case 22: 
				Tetris.text_key = Tetris.text_key_V;
				break;
			case 23: 
				Tetris.text_key = Tetris.text_key_W;
				break;
			case 24: 
				Tetris.text_key = Tetris.text_key_X;
				break;	
			case 25: 
				Tetris.text_key = Tetris.text_key_Y;
				break;
			case 26: 
				Tetris.text_key = Tetris.text_key_Z;
				break;		
		}	
		Tetris.text_key.layers.set(N_VR_layers);
}

function rand_set_active (rand_key_value) {
		switch (rand_key_value) {
			case 1:
				Tetris.text_active = Tetris.text_A;
				break;
			case 2: 
				Tetris.text_active = Tetris.text_B;
				break;
			case 3: 
				Tetris.text_active = Tetris.text_C;
				break;
			case 4: 
				Tetris.text_active = Tetris.text_D;
				break;	
			case 5:
				Tetris.text_active = Tetris.text_E;
				break;
			case 6: 
				Tetris.text_active = Tetris.text_F;
				break;
			case 7: 
				Tetris.text_active = Tetris.text_G;
				break;
			case 8: 
				Tetris.text_active = Tetris.text_H;
				break;			
			case 9: 
				Tetris.text_active = Tetris.text_I;
				break;
			case 10: 
				Tetris.text_active = Tetris.text_J;
				break;
			case 11: 
				Tetris.text_active = Tetris.text_K;
				break;			
			case 12: 
				Tetris.text_active = Tetris.text_L;
				break;
			case 13: 
				Tetris.text_active = Tetris.text_M;
				break;
			case 14: 
				Tetris.text_active = Tetris.text_N;
				break;
			case 15: 
				Tetris.text_active = Tetris.text_O;
				break;
			case 16: 
				Tetris.text_active = Tetris.text_P;
				break;
			case 17: 
				Tetris.text_active = Tetris.text_Q;
				break;	
			case 18: 
				Tetris.text_active = Tetris.text_R;
				break;
			case 19: 
				Tetris.text_active = Tetris.text_S;
				break;
			case 20: 
				Tetris.text_active = Tetris.text_T;
				break;			
			case 21:
				Tetris.text_active = Tetris.text_U;
				break;
			case 22: 
				Tetris.text_active = Tetris.text_V;
				break;
			case 23: 
				Tetris.text_active = Tetris.text_W;
				break;
			case 24: 
				Tetris.text_active = Tetris.text_X;
				break;	
			case 25: 
				Tetris.text_active = Tetris.text_Y;
				break;
			case 26: 
				Tetris.text_active = Tetris.text_Z;
				break;	
			case 27: 
				Tetris.text_active = Tetris.text_Z;
				break;					
		}	
		Tetris.text_active.layers.set(VR_layers);
 		if (VR_letter_x_start_side == 1){
			
//			if (Tetris.currentPoints < 250) {
//				VR_letter_x_start_side = 1;
				VR_letter_x_start_position = VR_letter_x_start_position_ref;
//			}

		}
		else {
//			if (Tetris.currentPoints < 250) {
//				VR_letter_x_start_side = -1;
				VR_letter_x_start_position = VR_letter_x_start_position_ref+30;
//			}
			
		} 
}

// BKL Function to process "wrong" letter input from "mouse click", "L letter press" or "right controller main button"
function wrong_letter() {
			if (key_letter != current_letter){
				// bkl keep track of avg z-distance for correct choice  (larger number is better, indicates smaller letter recognition )
					z_score = z_score + Tetris.text_active.position.z;
					z_count = z_count+1;
					z_avg = Math.round(z_score/z_count);
				
				Tetris.addPoints(10);
				Tetris.sounds["score"].play();
			    if (Math.abs(key_letter-current_letter) < 10){
				current_letter=key_letter; 
			    }
				else {current_letter = rand_num();
				}
			}
			else {current_letter = rand_num();
				Tetris.addPoints(-50);
				Tetris.sounds["collision"].play();
			}
			Tetris.text_active.visible = false;
			rand_set_active(current_letter);
			Tetris.text_active.position.x = (-15 * VR_letter_x_start_side);
//			Tetris.text_active.position.x = -10;
			Tetris.text_active.position.z = -1400;
			
			Tetris.scene.add(Tetris.text_active);
			Tetris.text_active.visible = true;	
			// bkl add random level 
			if (Tetris.currentPoints > 150) {
					Tetris.text_active.position.x = (VR_letter_x_start_side*-Math.floor(Math.random() * (VR_active_rnd_x_start)));
					Tetris.text_active.position.y = (Math.floor(Math.random()*VR_active_rnd_y_start) - (VR_active_rnd_y_start/2-1));
					Tetris.text_active.position.z = -1400;
			}
} 	
// End "wrong" letter

// BKL Function to process "correct" letter input from "space bar" or "rleft controller main button"
function correct_letter() {
			if (key_letter == current_letter){	
			// bkl keep track of avg z-distance for correct choice  (larger number is better, indicates smaller letter recognition )
			z_score = z_score + Tetris.text_active.position.z;
			z_count = z_count+1;
			z_avg = Math.round(z_score/z_count);
				
			// reset for next round 
			
			// swap field of view to make more challenging 
				if (Tetris.currentPoints > 2000) {
						VR_letter_x_start_side =  Math.floor(Math.random() * 2 - 1);
						VR_letter_x_start_position = VR_letter_x_start_position_ref+30;
						if (VR_letter_x_start_side == 0){
								VR_letter_x_start_side	= 1
								VR_letter_x_start_position = VR_letter_x_start_position_ref;
						}
				}
			// 	end field of view swap 
				Tetris.text_key.visible = false;
				key_letter = rand_num();
				rand_set_key(key_letter);
				Tetris.text_key.position.x = (VR_letter_x_start_side*VR_letter_x_start_position);
				Tetris.text_key.position.z = -150;
				Tetris.scene.add(Tetris.text_key);
				Tetris.text_key.visible = true;

				//
				Tetris.text_active.visible = false;
				current_letter = rand_num();
				rand_set_active(current_letter);
				Tetris.text_active.position.x = (VR_letter_x_start_side*-VR_letter_x_start_position);
//				Tetris.text_active.position.x = (-VR_letter_x_start_position);
				Tetris.text_active.position.z = -1400;	
				
				Tetris.scene.add(Tetris.text_active);
				Tetris.text_active.visible = true;
				// scoring update
				Tetris.addPoints(100);
				Tetris.sounds["score"].play();
				// bkl add random level 
				if (Tetris.currentPoints > 150) {
						Tetris.text_active.position.x = (VR_letter_x_start_side*-Math.floor(Math.random() * (VR_active_rnd_x_start)));
						Tetris.text_active.position.y = (Math.floor(Math.random()*VR_active_rnd_y_start) - (VR_active_rnd_y_start/2-1));
						Tetris.text_active.position.z = -1400;						
				}

				
				
				

			}
			else {
				Tetris.addPoints(-50);
				Tetris.sounds["collision"].play();
				
			}
} 	
// End "correct" letter

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

    Tetris.scene.add(mesh);
    Tetris.staticBlocks[x][y][z] = mesh;
};

Tetris.currentPoints = 0;
Tetris.addPoints = function (n) {
    Tetris.currentPoints += n;
    
//	Tetris.pointsDOM.innerHTML = Tetris.currentPoints; 
	Tetris.pointsDOM.innerHTML = z_avg; 
    Cufon.replace('#points');
//    Tetris.sounds["score"].play();
	// update score in 3D BKL
	// current points		

		Tetris.scene.remove(Tetris.text_points);

		loader.load('fonts/helvetiker_bold.typeface.json', function ( font ) {
    var ptextGeo = new THREE.TextGeometry(Tetris.currentPoints, {
			font: font,
			size: 10, // font size
			height: 1, // how much extrusion (how thick / deep are the letters)
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: false
		});

	
		Tetris.text_points_temp = new THREE.Mesh( ptextGeo, ptextMaterial );
		Tetris.text_points_temp.position.x = 0;
		Tetris.text_points_temp.position.y = -100;
		Tetris.text_points_temp.position.z = -200;
		Tetris.text_points_temp.castShadow = false;
		Tetris.text_points_temp.receiveShadow = false;
		})
		Tetris.text_points = Tetris.text_points_temp;
		Tetris.scene.add(Tetris.text_points_temp);
		// shorten step time - game moves faster with higher score
		switch (true) {
			case (Tetris.currentPoints >= 500 && Tetris.currentPoints < 1000):
				VR_step_time = 60;
				break;
			case (Tetris.currentPoints >= 1000 && Tetris.currentPoints < 2000):
				VR_step_time = 55;
				break;
			case (Tetris.currentPoints >= 2000 && Tetris.currentPoints < 3000):
				VR_step_time = 45;
				break;
			case (Tetris.currentPoints >= 3000 && Tetris.currentPoints < 4000):
				VR_step_time = 40;
				VR_active_rnd_x_start = 500;
				VR_active_rnd_y_start = 800;
				
				break;				
			default:
				break;
		}
	
	
};

	


window.addEventListener("load", Tetris.init);

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

window.addEventListener('click', function (event) {
	 wrong_letter();
})

window.addEventListener('textInput', function(e) {
    // e.data will be the 1:1 input you done
    var char = e.data; // In our example = "a"
    
    // If you want the keyCode..
    var keyCode = char.charCodeAt(0); // a = 97
    Tetris.sounds["move"].play();

});
window.addEventListener('keydown', function (event) {
    var key = event.which ? event.which : event.keyCode;

    switch (key) {
        //case
		// BKL changed from arrows to use BT keyboard with phone
        case 73: // up (i)
  
            break;
        case 75: // down (k)
          
            break;
        case 74: // left(j)
          
            break;
        case 76: // right (l)

			 wrong_letter();

					
            break;
			
        case 32: // space
			correct_letter() ;
		
            break;

        case 87: // up (w)

            break;
        case 83: // down (s)

            break;

        case 65: // left(a)

            break;
        case 68: // right (d)

            break;

        case 81: // (q)
 
            break;
        case 69: // (e)

            break;
		// BKL adding keyboard commands 	
		case 80: // (p)
            Tetris.start();
            break;	
		case 70: // (f)
//			Tetris.vrDisplay.requestPresent([{source: Tetris.renderer.domElement}]);
			enterFullscreen(Tetris.renderer.domElement);
            break;	
		case 86: // (v)
            Tetris.vrDisplay.requestPresent([{source: Tetris.renderer.domElement}]);
			enterFullscreen(Tetris.renderer.domElement);
            break;		
		case 48: // (0)
			VR_layers = 0;
			N_VR_layers = 0;
			Tetris.sounds["move"].play();
            break;	
		case 49:// (1)
			VR_layers = 1;
			N_VR_layers = 2;
			VR_letter_x_start_side = 1;
            break;			
		case 50: //2
			VR_layers = 2;
			N_VR_layers = 1;
			VR_letter_x_start_side = -1;
			Tetris.text_key.position.x = ((VR_letter_x_start_side*VR_letter_x_start_position)-30);
			Tetris.sounds["move"].play();
            break;		
		case 51: //3
			level = 1;
            break;	
		case 52: //4
			level = 0;
            break;		
		case 13: // enter key
			Tetris.sounds["move"].play();
			level = level + 1;
            break;		 
    }
}, false);	

