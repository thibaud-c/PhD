/**

	Parameters

*/
//Scene
var viewer;
var scene;
var camera;

//Cameras
var fixedCamera;
var lookingListener;
var movingListener;

//init mouse position
var startMousePosition;
var mousePosition;

//Flag to stop/start looking
var flags = {
    looking : false,
    moveForward : false,
    moveBackward : false,
    moveUp : false,
    moveDown : false,
    moveLeft : false,
    moveRight : false
};

//Speed of the camera
var cameraSpeed= 30 ;

/**

	Private Methods

*/


/**
	Getter :> récupère les information caméra en deg lon, lat, altitude

	@param cam : (obj) Cesium caméra
	@return lon : (float) longitude de la camera en deg
	@return lat : (float) latitude de la camera en deg
	@return alt : (float) altitude de la camera en m
*/
function getCameraPosition(){

	var lon = Cesium.Math.toDegrees(camera.positionCartographic.longitude);
    var lat = Cesium.Math.toDegrees(camera.positionCartographic.latitude);
    var alt = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(lon, lat));

    return [lat,lon,alt];
}

/**
	Remise à zéro des caméras. Désactive l'ensemble des mouvements possibles dans la scène
*/
function razcam(){
	// Stop le movement en cours
    camera.cancelFlight();

	//Supprime l'handler fixed
    if (typeof fixedCamera !== "undefined"){
        fixedCamera.destroy();
    }

    //Supprime l'handler regarder
    if (typeof lookingListener !== "undefined"){
        viewer.clock.onTick.removeEventListener(lookingListener);
    }

	//Supprime l'handler déplacer
    if (typeof movingListener !== "undefined"){
        viewer.clock.onTick.removeEventListener(movingListener);
    }

    //Désactive les handlers freefly
   	scene.screenSpaceCameraController.enableRotate = false;
    scene.screenSpaceCameraController.enableTranslate = false;
    scene.screenSpaceCameraController.enableZoom = false;
   	scene.screenSpaceCameraController.enableTilt = false;
    scene.screenSpaceCameraController.enableLook = false;
};

/**
	Methode permettant de gérer le lookAt caméra en fonction du drag de la souris: Gère le roll
	Crée 1 handler et 1 timer
*/
function lookingAroundHandler(){

	//create fixed camera Handler
    fixedCamera = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    
    //left Click
    fixedCamera.setInputAction((movement) => {
        flags.looking = true;
        mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    
    //Mouse moving
    fixedCamera.setInputAction((movement) => {
        mousePosition = movement.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    
    //Stop moving 
    fixedCamera.setInputAction((position) => {
        flags.looking = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    var initPitchCamera = Cesium.Math.toDegrees(camera.pitch);
    
    // Definition de l'handler regarder
    lookingListener = (clock) => {
        if (flags.looking) {
            var width = viewer.canvas.clientWidth;
            var height = viewer.canvas.clientHeight;

            // Coordinate (0.0, 0.0) will be where the mouse was clicked.
            var x = (mousePosition.x - startMousePosition.x) / width;
            var y = -(mousePosition.y - startMousePosition.y) / height;
            // Speed
            var lookFactor = 0.1;
            camera.lookRight(x * lookFactor);
            camera.lookUp(y * lookFactor);
            // Block the view between -25 and 25deg
            if (Cesium.Math.toDegrees(camera.pitch) > initPitchCamera+10) {
                camera.lookUp(-y * lookFactor);
            } else if (Cesium.Math.toDegrees(camera.pitch) < initPitchCamera-25) {
                camera.lookUp(-y * lookFactor);
            }
            camera.twistRight(-camera.roll);
        }
    }
    // Timer
    viewer.clock.onTick.addEventListener(lookingListener);
};

/**
	Methode permettant de le déplacement de la caméra via les touche clavier : devant/derriere/gauche/droite
	Crée 2 listeneurs + un timer
*/
function movingAroundHandler(){
    // Déclaration des listeners keydown and keyup pour lancer ou arrêter le mouvement
    document.addEventListener('keydown', (event) => {
	    	var flagName = getFlagForKeyCode(event.keyCode);
		    if (typeof flagName !== 'undefined') {
		        flags[flagName] = true
		    }
	    },false);
    document.addEventListener('keyup', (event) => {
	    	var flagName = getFlagForKeyCode(event.keyCode);
		    if (typeof flagName !== 'undefined') {
		        flags[flagName] = false;
		    }
		    console.log(event.keyCode)
	    }, false);

    // Definition de l'handler déplacer
    movingListener = (clock) => {
    
    	// Speed of camera * moving speed cursor
	    var moveRate = cameraSpeed * 1;

	    //Déplacement selon l'input
	    if (flags.moveForward) {
	        camera.moveForward(moveRate);
	    }
	    if (flags.moveBackward) {
	        camera.moveBackward(moveRate);
	    }
	    if (flags.moveLeft) {
	        camera.moveLeft(moveRate);
	    }
	    if (flags.moveRight) {
	        camera.moveRight(moveRate);
	    }

	    //Controle de l'altitude de la caméra : doit restée à 1.80 (hauteur moyenne humaine)
	    var [lat,lon,height] = getCameraPosition();  

	    if (camera.positionCartographic.height<height) {
	        camera.moveDown(camera.positionCartographic.height-height-1.80);
	    }else if (camera.positionCartographic.height>height) {
	        camera.moveDown(camera.positionCartographic.height-height-1.80);
	    }
	};
    // Timer
	viewer.clock.onTick.addEventListener(movingListener);
};

/**
	Mapping des inputs key en action 

	@param keyCode : (char) a letter in input
	@retun string : chaine de caractères définissant une action
*/
function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
    case 'W'.charCodeAt(0):
        return 'moveForward';
    case 'S'.charCodeAt(0):
        return 'moveBackward';
    case 'D'.charCodeAt(0):
        return 'moveRight';
    case 'A'.charCodeAt(0):
        return 'moveLeft';
    default:
        return undefined;
    }
};


/**

	Exported Functions

*/
export default {
	// ** Constructor ** //

	/**
		Parameter initialisation

		@param viewer : (obj) cesium viewer
	*/
	sceneCameraHandlerConstructor(view){
		viewer = view;
		scene = view.scene;
		camera = view.camera;
	},

	// ** Getters & Setters ** //

	/**
		Set la valeur de la vitesse de déplacement

		@param speed : (int) vitesse de déplacement entre 0-100
	*/
	setMovingSpeed(speed){
		console.log(speed)
		cameraSpeed = speed;
	},

	// ** Methods ** //
	
	/**
		Positionnement de la caméra en fonction de coordonnées - garde le même azimut/tilt

		@param position : (obj) object contenant la position de la caméra contient des coordonnées destination, direction up ...  
	*/
	setCameraPosition(position,flightCompleteCallback=null) {
		//Placement de la caméra sur la ville de Lausanne
		var destination = new Cesium.Cartesian3(position.destination.lat,position.destination.lon,position.destination.alt);
		camera.flyTo({
			destination : destination,
		    orientation : {
		        direction : new Cesium.Cartesian3(position.direction.x,position.direction.y,position.direction.z),
		        up : new Cesium.Cartesian3(position.up.x,position.up.y,position.up.z)
			},
			complete:flightCompleteCallback
		});
	},

	/**
		Création d'une caméra fixe à une position données 

		@param coordinates : (obj) object contenant la position de la caméra contient des coordonnées destination, direction up ...  
	*/
	fixedcam(coordinates){
		//Arrets des caméras
		razcam();
		//Positionnement au bonnes coordonnées
	    this.setCameraPosition(coordinates,lookingAroundHandler());
	},

	/**
		Création d'une caméra de type freefly   
	*/
	freeflyfcam(){
	    razcam();
	    // enable the default event handlers
	    scene.screenSpaceCameraController.enableRotate = true;
	    scene.screenSpaceCameraController.enableTranslate = true;
	    scene.screenSpaceCameraController.enableZoom = true;
	    scene.screenSpaceCameraController.enableTilt = true;
	    scene.screenSpaceCameraController.enableLook = true;
	},

	/**
		Création d'une caméra de type première personne   
	*/
	firstPersonCam(){
		//Arrets des caméras
	    razcam();

	    //Récupération des paramètres caméra
	    var [lat,lon,height] = getCameraPosition();
	    //initialisation des paramètre de type vue au sol
	    var positioncam = new Cesium.Cartesian3.fromDegrees(lon, lat, height+1.80);
	    var orientationcam = new Cesium.HeadingPitchRoll(camera.heading, 0, 0);

	    //set the camera position
	    camera.flyTo({
	        destination : positioncam,
	        orientation : {
	            heading : orientationcam.heading,
	            pitch : orientationcam.pitch,
	            roll : orientationcam.roll
	        },
	        complete:lookingAroundHandler
	    },)		
	    movingAroundHandler();
	}


}