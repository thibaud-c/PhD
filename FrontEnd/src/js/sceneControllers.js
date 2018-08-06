// ** Parameters **//
import Cesium from 'cesium/Cesium' 
var viewer;
var scene;
var camera;
var ds;
var removeListener;
var singleDigitPins = new Array(8);


var flickrPicturesNumber = 1000;

var pinBuilder = new Cesium.PinBuilder();
	    var pin50 = pinBuilder.fromText('50+', Cesium.Color.RED, 48).toDataURL();
	    var pin40 = pinBuilder.fromText('40+', Cesium.Color.ORANGE, 48).toDataURL();
	    var pin30 = pinBuilder.fromText('30+', Cesium.Color.YELLOW, 48).toDataURL();
	    var pin20 = pinBuilder.fromText('20+', Cesium.Color.GREEN, 48).toDataURL();
	    var pin10 = pinBuilder.fromText('10+', Cesium.Color.BLUE, 48).toDataURL();

//handler de dessin
var drawingHandler;

// ** Non Vue Methods **//

/**
	Get la position du regard de la camera

	@return success : position de la camera lat/lon/height
	@return false : position non calculée
*/
function cameraLookingAt() {

	// pick le mileu de l'écran (regard camera)
    var ray = camera.getPickRay(new Cesium.Cartesian2(
        Math.round(viewer.canvas.clientWidth / 2),
        Math.round(viewer.canvas.clientHeight / 2)
    ));

    //Calcul la position
    var position = viewer.scene.globe.pick(ray, viewer.scene);
    //Definit la lat lon hauteur et distance
    if (Cesium.defined(position)) {
        var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
        var height = cartographic.height;
        var range = Cesium.Cartesian3.distance(position, camera.position);

        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lon = Cesium.Math.toDegrees(cartographic.longitude);
        
        return [lat, lon, height]
    }else{
    	return[0,0,0]
    }
};


/**
	Ajout un pin's dans la scène 

	@param name : (string) nom de l'objet
	@param auteur : (string) auteur de l'info
	@param type : (string) type de l'objet
	@param content : (string) contenu de l'object img/commentaire...
	@param camPosition : (obj) position de lq caméra 
	@param pins : (string) image du pins à afficher
	@param scale : (string) echelle du pins
	@param datetime : date de l'objet si prise avant (Reseau sociaux) 

	@return the entity created
*/
function addPinToScene(name, auteur, type, content, camPosition, pins, scale, datetime=0){
	//get Info camera
	var cameraProperties = {
	  position: camera.position.clone(),
	  direction: camera.direction.clone(),
	  up: camera.up.clone(),
	  right: camera.right.clone(),
	  transform: camera.transform.clone(),
	  frustum: camera.frustum.clone()
	};

	if (datetime==0){
		datetime = new Date();
	}

	//Ajout du pinpoint à la scène
	var pinbuilder = new Cesium.PinBuilder();
	var entity = ds.entities.add({
	    //name: name,
	    //paramètre du pins
	    _title:name,
	    _auteur:auteur,
	    _type:type,
	    _camera:cameraProperties,
	    _userDescription: content,
	    _datetime:datetime,
	    position:camPosition,
	    //definit l'icone
	    billboard: {
	        image: pins,
	        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
	        scale:scale
	    }/*,
	    polyline : {
	        positions : [Cesium.Cartesian3.fromDegrees(camPosition.x,camPosition.y,camPosition.z-camPosition.z), camPosition],
	        width : 0.1,
	        followSurface : false,
	        material : Cesium.Color.WHITE
    	}*/
	});
	console.log(pins)
	console.log(entity)
	return entity;
};


/**
	fonction permettant de retour de X element aléatoire dans un array

	@param arr : (array) tableau ou séléctionner les éléments
	@param items : (int) nombre X d'éléments en retour 
	@return : array d'éléments sélectionnés
*/
function getRandomItems(arr, items) {
  var ret = [];
  var indexes = [];
  var arr_length = arr.length;
  
  // If we don't have enough items to return - return the original array
  if (arr_length < items) {
    return arr;
  }
  
  while (ret.length < items) {
    var i = Math.floor(Math.random() * (arr_length-1));
    indexes[indexes.length] = i;
    ret[ret.length] = arr[i];
  }
  return ret;
}


/**
	Affiche la description d'une feature en fonction des information présente

	@param feature : feature picked
*/	
function addScreenshotDescription(feature,category){
	console.log(feature)
	var data ={
		cat:category,
		author:"Jack Black",
		date:feature._datetime,
		type:feature._type,
		content:feature._userDescription,
		title:feature._title
	}
	Event.$emit('fireDisplayDescription', data);
};

function customStyle() {
    if (Cesium.defined(removeListener)) {
        removeListener();
        removeListener = undefined;
    } else {
        removeListener = ds.clustering.clusterEvent.addEventListener(function(clusteredEntities, cluster) {
            cluster.label.show = false;
            cluster.billboard.show = true;
            cluster.billboard.id = cluster.label.id;
            cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

            if (clusteredEntities.length >= 50) {
                cluster.billboard.image = pin50;
            } else if (clusteredEntities.length >= 40) {
                cluster.billboard.image = pin40;
            } else if (clusteredEntities.length >= 30) {
                cluster.billboard.image = pin30;
            } else if (clusteredEntities.length >= 20) {
                cluster.billboard.image = pin20;
            } else if (clusteredEntities.length >= 10) {
                cluster.billboard.image = pin10;
            } else {
                cluster.billboard.image = singleDigitPins[clusteredEntities.length - 2];
            }
        });
    }

    // force a re-cluster with the new styling
    var pixelRange = ds.clustering.pixelRange;
    ds.clustering.pixelRange = 0;
    ds.clustering.pixelRange = pixelRange;
};

// ** Vue Methods **//

export default {

	// ** Constructor **//

	/**
		Parameter initialisation

		@param viewer : (obj) cesium viewer
	*/
	sceneControllersConstructor(view){
		viewer = view;
		scene = view.scene;
		camera = view.camera;

		//creation du cluster d'entitées
		ds = new Cesium.CustomDataSource()
		ds.clustering.enabled = true
		viewer.dataSources.add(ds)

	    var pixelRange = 15;
	    var minimumClusterSize = 3;
	    var enabled = true;

	    ds.clustering.enabled = enabled;
	    ds.clustering.pixelRange = pixelRange;
	    ds.clustering.minimumClusterSize = minimumClusterSize;


		/*var billboards = scene.primitives.add(new Cesium.BillboardCollection());
		billboards.add({
		  position : new Cesium.Cartesian3(46.5128354157421, 6.571012644237877, 800),
		  image : 'icons/Comment.png',
		  scale:1,
		});
          console.log(billboards)
	    */

	    
	    for (var i = 0; i < singleDigitPins.length; ++i) {
	        singleDigitPins[i] = pinBuilder.fromText('' + (i + 2), Cesium.Color.VIOLET, 48).toDataURL();
	    }

	    // start with custom style
	    customStyle();
	},


	// ** Getters & Setters ** //

	/**
		Set the number of flickR pictures on screen 

		@param number : (string) set the number of picture
	*/
	setNumberFlickR(number){
		flickrPicturesNumber = number;
	},

	getlonlatfromxy(x,y){
		var ellipsoid = Cesium.Ellipsoid.WGS84;
	    var clickposition = new Cesium.Cartesian2(x, y);
        var cartesian = camera.pickEllipsoid(clickposition, ellipsoid);
        if (cartesian) {         

            var ray = viewer.camera.getPickRay(clickposition);
            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);

            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            return [latitudeString,longitudeString]
		}
	 	return 0
	},

	// ** Methods **//

	/**
		Take a screenshot of the canvas and add a pin's within the scene

		@emit : event pour ajouter la description au screen 
		@return null : if the camera doesn't aim the scene
	*/
	takeScreen() {
		//Capture l'image de l'écran
	    var screen = viewer.canvas.toDataURL('image/jpeg', 1);

	    //recuperation de la position du regard de la camera
		var [lat, lon, height] = cameraLookingAt();
		var camlook = new Cesium.Cartesian3.fromDegrees(lon, lat, height+15);

		if (!camlook){
			//position non trouvée
			console.error('Erreur dans la récupération de la position de la caméra');
			alert("Ne regardez pas en l'air =)");
			return;
		}
		//Ajout le pins à la carte
		var entity = addPinToScene("Copie d'écran utilisateur", 'Unknown', 'UserScreen', screen, camlook, './../public/icons/user_screen.png', 0.1);	

		//Event pour faire un appel rest sur l'url flickR
		Event.$emit('fireAddDescription', entity);
	},

	/**
		add a user uploaded picture within the scene
	
		@param picture : picture uploaded (get by an event)
		@return null : if the camera doesn't aim the scene
	*/
	addPicture(picture){
	    //recuperation de la position du regard de la camera
	    var height = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(picture.yposition, picture.xposition));
		if (!height){
			//position non trouvée
			console.error('Erreur dans la récupération de la position du commentaire');
			alert("Ne cliquez pas en l'air =)");
			return;
		}
		var camlook = new Cesium.Cartesian3.fromDegrees(picture.yposition, picture.xposition, height+15);
		var [lat, lon, height] = cameraLookingAt();

		//Ajout le pins à la carte
		var entity = addPinToScene("Image importée utilisateur", 'Unknown', 'UserPicture', picture, camlook, '/icons/image2.png', 0.05);	
	},

	/**
		add a user comment within the scene
	
		@param name : name of the user
		@param email : email of the user
		@param comment : comment of the user
		@return null : if the camera doesn't aim the scene
	*/
	addCom(comment){
	    //recuperation de la position du regard de la camera
		var height = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(comment.yposition, comment.xposition));
		if (!height){
			//position non trouvée
			console.error('Erreur dans la récupération de la position du commentaire');
			alert("Ne cliquez pas en l'air =)");
			return;
		}
		var camlook = new Cesium.Cartesian3.fromDegrees(comment.yposition, comment.xposition, height+15);

		//Ajout le pins à la carte
		var entity = addPinToScene("Commentaire utilisateur", '', 'UserComment', comment, camlook, 'icons/comment2.png', 0.05);	
	},


	// ** Handlers **//

	/**
		Ajout de l'handler qui console les coordonnées de la souris pour le mode débug
	*/	
	addMouseCoordinates(){
		var printcoordinates = new Cesium.ScreenSpaceEventHandler(viewer); 
		printcoordinates.setInputAction((evt) => {
			var ellipsoid = Cesium.Ellipsoid.WGS84;
		    var clickposition = new Cesium.Cartesian2(evt.x,evt.y);
            var cartesian = camera.pickEllipsoid(clickposition, ellipsoid);
            if (cartesian) {         

                var ray = viewer.camera.getPickRay(clickposition);
                var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);

                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
			}
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	},

	/**
		Ajout de l'handler de selection / Survol de feature
	*/
	addFeatureSelectionHandler() {

		//feature actuellement selectionnée
		var current_feature = {
		    feature: undefined,
		    originalColor: new Cesium.Color()
		};

		//feature actuellement survollée
		var highlighted_feature = {
		    feature: undefined,
		    originalColor: new Cesium.Color()
		};

        //Objet actuellement en mémoire pour un affichage dans l'infobox
		var selectedEntity = new Cesium.Entity();

		// ** Mouse Move ** //

		// Déclaration d'un handler "mousemove" pour colorier les features survollées
		var highlighthandling = new Cesium.ScreenSpaceEventHandler(viewer.canvas); 
		highlighthandling.setInputAction(function onMouseMove(movement) {
		    // If a feature was previously highlighted, undo the highlight
		    if (Cesium.defined(highlighted_feature.feature)) {
		        highlighted_feature.feature.color = highlighted_feature.originalColor;
		        highlighted_feature.feature = undefined;
		    }

		    // Pick a new feature
		    var pickedFeature = viewer.scene.pick(movement.endPosition);
		    if (!Cesium.defined(pickedFeature)) {
		        return;
		    }

		    // Highlight the feature if it's not already selected.
		    if (pickedFeature !== current_feature.feature) {
		        highlighted_feature.feature = pickedFeature;
		        Cesium.Color.clone(pickedFeature.color, highlighted_feature.originalColor);
		        pickedFeature.color = Cesium.Color.PALEGREEN;
		        if (typeof pickedFeature.id !== "undefined"){
		        	Event.$emit('showPreviz',pickedFeature.id._type,pickedFeature.id._userDescription,movement.endPosition)
		        }else{
		        	Event.$emit('hidePreviz')
		        }
		        
		    }
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

		// ** Mouse Left Click ** //

		//Selection au click
		var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

		// Color la feature selectionnée et affiche son infobox
		var selectionhandling = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
		selectionhandling.setInputAction(function onLeftClick(movement) {
		    // If a feature was previously selected, undo the highlight
		    if (Cesium.defined(current_feature.feature)) {
		        current_feature.feature.color = current_feature.originalColor;
		        current_feature.feature = undefined;
		    }

		    // Pick a new feature rattaché à l'handleur clickHandler
		    var pickedFeature = viewer.scene.pick(movement.position);
		    if (!Cesium.defined(pickedFeature)) {
		        clickHandler(movement);
		        return;
		    }

		    // Select the feature if it's not already selected
		    if (current_feature.feature === pickedFeature) {
		        return;
		    }
		    current_feature.feature = pickedFeature;
		    // Save the selected feature's original color
		    if (pickedFeature === highlighted_feature.feature) {
		        Cesium.Color.clone(highlighted_feature.originalColor, current_feature.originalColor);
		        highlighted_feature.feature = undefined;
		    } else {
		        Cesium.Color.clone(pickedFeature.color, current_feature.originalColor);
		    }
		    if (typeof pickedFeature.id === "undefined"){

		        // Highlight newly selected feature
		        pickedFeature.color = Cesium.Color.LIME;
		        // Set feature infobox description 
		        
		        var featureName = pickedFeature.getProperty('name');

		        selectedEntity.name = featureName;
		        if (typeof pickedFeature.content.batchTable.batchTableJson.Height != "undefined"){
		            selectedEntity.description = '<strong>Height : </strong>' + (pickedFeature.content.batchTable.batchTableJson.Height[pickedFeature._batchId]*0.01).toFixed(2)+" m";
		        }else{

		        selectedEntity.description = '<strong>Role : </strong>' + pickedFeature.content.batchTable.batchTableJson.OBJEKTART[pickedFeature._batchId] + '</br>' +
		                                     '<strong>Date de révision : </strong>' + pickedFeature.content.batchTable.batchTableJson.REVISION_MONAT[pickedFeature._batchId]+'/'+ pickedFeature.content.batchTable.batchTableJson.REVISION_JAHR[pickedFeature._batchId] + '</br>' +
		                                     '<strong>SOURCE ID : </strong>' + pickedFeature.content.batchTable.batchTableJson.UUID[pickedFeature._batchId] + '</br>';
		        }                           
		        viewer.selectedEntity = selectedEntity;

		    }else{
		        if (pickedFeature.id._type==='UserScreen'){
		        	//affiche la description de screenshot ustilisateur 
		        	addScreenshotDescription(pickedFeature.id,"Copie d'écran utilisateur");
		            
		        }else if (pickedFeature.id._type==='History'){
	
		        	addScreenshotDescription(pickedFeature.id,"Element complémentaire d'information");

		        }else if (pickedFeature.id._type==='UserComment'){

		        	addScreenshotDescription(pickedFeature.id,"Commentaire utilisateur");
		        
		        }else if (pickedFeature.id._type==='FlickR'){

		        	addScreenshotDescription(pickedFeature.id,"Réseau sociaux : Image FlickR");
		        }else if (pickedFeature.id._type==='UserPicture'){

		        	addScreenshotDescription(pickedFeature.id,"Import Utilisateur");
		        }

		    }  
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	},

	/**
		Création de l'handler des images FlickR

		@param position : (obj) position de la caméra en lon lat
		@param flickR : (obj) paramètre flickR url, methodes ...
		@emit : Appel RESTAPI sur les photos
	*/
	addflickRPicHandler(position, flickR, page=1){
		var vueOldPosition = position;

		//Listener a chaque fin de déplacement de caméra
		camera.moveEnd.addEventListener((event) => { 

			//Récupération du regard de la caméra
			var [vueNewLat,vueNewLon,vueNewHeight] = cameraLookingAt();

			//Changement du set d'image si la caméra c'est assez déplacée
			if (Math.abs(vueOldPosition.lat-vueNewLat)>0.01 || Math.abs(vueOldPosition.lon-vueNewLon)>0.01){
				console.warn('Load FlickR Pictures')
				//Maj des positions
				vueOldPosition.lat = vueNewLat;
				vueOldPosition.lon = vueNewLon;
				//Suppression des éléments
				if(ds.entities._entities._array.length>0){

					//Récupère seulement les images de type FlickR
					var flickREntities = ds.entities._entities._array.filter( entity => entity._type === "FlickR" );
					for (var i = 0; i<flickREntities.length; i++){

						ds.entities.remove(flickREntities[i])
					}
				}

				//Déclaration des options
				var options = {
					'method':'flickr.photos.search',
					'api_key':flickR.apikey,
					'lat':vueOldPosition.lat,
					'lon':vueOldPosition.lon,
					'radius':1,
					'page':page,
					'per_page':250,
					'extras':'geo, url_l'					
				} 

				//Event pour faire un appel rest sur l'url flickR
				Event.$emit('fireRestApi', 'get', flickR.url, options);
			}
		});
	},

	/**
		Traitement de la réponse get IMG de l'appel rest API 

		@param pics : (obj) un set d'images
		@emit : maj du numbre de page du panel control
	*/
	pinsFlickRPictures(pics){
		//pour Toute les photos
		// definition du nombre d'élements
		if (flickrPicturesNumber === "All"){
			flickrPicturesNumber = pics.length+1;
		}
		pics = getRandomItems(pics, flickrPicturesNumber) 

		for (var p in pics){
			//récupération d'une image
			var image = pics[p];

			//Get height et si défini on continue l'affichage
			var height = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(image.longitude, image.latitude));
    		if(typeof height === 'undefined'){
    			break;
    		}
            var positionImage = new Cesium.Cartesian3.fromDegrees(image.longitude, image.latitude, height+15);
            //Ajout un pin's à la carte
            addPinToScene(image.title, image.owner, 'FlickR', image.url_l, positionImage, './../publicpublic/icons/Creatures.png', 0.04);	
      	}
	},

	/**
		Add historic pictures to the scene 

		@param photos : (obj) un set d'images
	*/
	addHistoryContext(photos){
		for (var i = 0; i < photos.length; i++){
			var pic = photos[i];
			var height = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(pic.icon.lon, pic.icon.lat));
			var positionImage = new Cesium.Cartesian3.fromDegrees(pic.icon.lon, pic.icon.lat, height+15);
			var description = "http://localhost:8080/public/"+pic.folder+pic.name+".jpg"; 
			addPinToScene("Place de la Riponne", 'Municipalité', 'History', description, positionImage, './../public/icons/present.png', 0.3);
		}

	},

	/**
		Création de l'handler de la carte 2D

		@emit : envoie les coordonnées et l'azimut de la caméra à floating menu
	*/
	addMap2DHandler(){
		/*Handler de mise à jour de carte !*/
		camera.moveEnd.addEventListener(function() { 
			var [lat, lon, height] = cameraLookingAt();
			var position = [Cesium.Math.toDegrees(camera.positionCartographic.longitude),Cesium.Math.toDegrees(camera.positionCartographic.latitude)];
			var direction = [lat,lon];
		    Event.$emit('Update2Dmap', position, direction, camera.heading);
		});
	},

	/**
		Lance la fonction de sketch dans la scène

		Ajout de 1 handler à la scène : mouse click et mouse move
	*/
	drawOnScene(){
		  var color;
		  var polyline;
		  var drawing = false;
		  var positions = [];
		  drawingHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
		  drawingHandler.setInputAction(
		      function (click) {
		          if (drawing) {
		              color.alpha = 0.6;
		              viewer.entities.add({
		              	  _type:'Sketch',
		                  polygon: {
		                      hierarchy : {
		                          positions : positions
		                      },
		                      material : color,
		                      outline : true
		                  }
		              });
		              ds.entities.remove(polyline);
		              positions = [];
		          } else {
		              color = Cesium.Color.fromRandom({alpha : 1.0});
		              polyline = ds.entities.add({
		                  polyline : {
		                  	width: 10,
		                    positions : new Cesium.CallbackProperty(function(){
		                      return positions;
		                    }, false),
		                    material : color
		                  }
		              });
		          }
		          drawing = !drawing;
		      },
		      Cesium.ScreenSpaceEventType.LEFT_CLICK
		  );

		  drawingHandler.setInputAction(
		      function (movement) {
		      	  

		          //var surfacePosition = camera.pickEllipsoid(movement.endPosition);
		           var ray = viewer.camera.getPickRay(movement.endPosition);
		           var surfacePosition = viewer.scene.globe.pick(ray, viewer.scene);
		           
		           //var ellipsoid = Cesium.Ellipsoid.WGS84;
		      	   
		          if (drawing && Cesium.defined(surfacePosition)) {
		              positions.push(surfacePosition);
		          }
		      },
		      Cesium.ScreenSpaceEventType.MOUSE_MOVE
		  );
	},

	/**
		Arrête la fonction de sketch dans la scène

		Supprime l'handler de la scène
	*/
	stopDrawOnScene(){
		if(typeof drawingHandler !== 'undefined'){
			drawingHandler.destroy();
		}
	},

	/**
		Supprimer le dernier élément de dessin créé par l'utilisateur 
	*/
	undoDrawOnScene(){
		//filtre sur les entité et récupération des type sketches seulement
		var sketches = viewer.entities._entities._array.filter(entity => entity._type === 'Sketch')
		if (sketches.length != 0){
			//suppression de l'élément par id
			var sketch = sketches.pop();
			viewer.entities.removeById(sketch._id)
		}else{
			console.warn('Toutes les sketches ont déjà été supprimés')
		}
	}
}
