// ** Parameters **//

//Scene
var viewer;
var scene;
var camera;

//Mockups
var model1;
var model2;

//Layers
var bati3d;
var vege3d;
var name3d;

var terrainloaded;


// ** Non Vue Methods **//

/**
	Ajout le modèle numérique de terrain à la scène
*/
function addDEM() {
		//ajout du rectangle de définition de la Suisse (Obligatoire pour l'utilisation des données SwissTopo)  
	  	var rectangle = Cesium.Rectangle.fromDegrees(5.013926957923385, 45.35600133779394, 11.477436312994008, 48.27502358353741)
		//Ajout du Terrain 3D
		var terrainProvider = new Cesium.CesiumTerrainProvider({
		    url : '//3d.geo.admin.ch/1.0.0/ch.swisstopo.terrain.3d/default/20160115/4326/',//'https://assets.agi.com/stk-terrain/world',
		    availableLevels: [8, 9, 10, 12, 14, 16, 17],
		    rectangle: rectangle,
		    credit: '',
		    castShadows: true,
		    receiveShadows: true,
		    requestWaterMask : true, // required for water effects
		    requestVertexNormals : true, // required for terrain lighting
		    clampToGround:true // restraint les objets au sol
		});
		
		viewer.terrainProvider = terrainProvider;
		viewer.scene.globe.depthTestAgainstTerrain = true;
};

/**
	Ajout du bati à la scène
*/
function addBuildings() {
		//création du jeu de données
		bati3d = new Cesium.Cesium3DTileset({
		  url: 'https://vectortiles.geo.admin.ch/ch.swisstopo.swisstlm3d.3d/20170425/tileset.json',
		  //debugColorizeTiles:true,
		  castShadows: true,
		  receiveShadows: true,
		  show:true
		})
		//Ajout d'un style
		bati3d.style = new Cesium.Cesium3DTileStyle({
		    //color :  "color('GHOSTWHITE')",
		    meta : {
		       description : '"Building id has height."'
		   }
		   
		});
		//Attache à la scène
		var buildings = scene.primitives.add(bati3d)
};

/**
	Ajout de la végétation à la scène
*/
function addVegetation() {
		//création du jeu de données
		vege3d = new Cesium.Cesium3DTileset({
		  url: 'https://vectortiles.geo.admin.ch/ch.swisstopo.vegetation.3d/20170630/tileset.json',
		  castShadows: true,
		  receiveShadows: true,
		  show:true
		})

		//Ajout d'un style
		vege3d.style = new Cesium.Cesium3DTileStyle({
			//color :  "color('STEELBLUE')",
		   	meta : {
		       description : '"Three id has height."'
		   }
		});
		//Attache à la scène
		var vegetation = scene.primitives.add(vege3d)
}

/**
	Ajout des toponymes à la scène
*/
function addToponymes() {
		//création du jeu de données
		name3d = new Cesium.Cesium3DTileset({
		  url: 'https://vectortiles.geo.admin.ch/ch.swisstopo.swissnames3d.3d/20170814/tileset.json',
		  castShadows: false,
		  receiveShadows: false,
		  show:true
		})

		//Ajout d'un style
		name3d.style = new Cesium.Cesium3DTileStyle({
			//color :  "color('STEELBLUE')",
		   	meta : {
		       description : '"Toponymes"'
		   }
		});
		//Attache à la scène
		var names = scene.primitives.add(name3d)
}

// ** Vue Methods **//

export default {
	// ** Getters & Setters ** //

	/**
		Get cesium Viewer 

		@return the cesium viewer
	*/
	getCesiumViewer(){
		return viewer;
	},

	// ** Methods ** //

	/**
		Initialisation de la scène cesium dans une div

		@param options : (json) contenant les options de la scène 
		@param root : (string) nom de la div auquel est rattaché la scène cesium 
	*/
	loadCesiumScene(options, root) {
		// Parameters definitions
	  	viewer = new Cesium.Viewer(root, options);
	  	scene = viewer.scene;
	  	camera = scene.camera; 

		var ellipsoid = Cesium.Ellipsoid.WGS84;
		var imageryLayers = scene.imageryLayers;
		var layer = imageryLayers.get(0);

		imageryLayers.removeAll();

		var rectangle = Cesium.Rectangle.fromDegrees(5.013926957923385, 45.35600133779394, 11.477436312994008, 48.27502358353741)
	    imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
	        url: '//wmts{s}.geo.admin.ch/1.0.0/ch.swisstopo.swissimage-product/default/current/4326/{z}/{x}/{y}.jpeg',
	        subdomains: '56789',
	        availableLevels: [8, 10, 12, 14, 15, 16, 17, 18],
	        minimumRetrievingLevel: 8,
          	maximumLevel: 18,
	        tilingScheme: new Cesium.GeographicTilingScheme({
	            numberOfLevelZeroTilesX: 2,
	            numberOfLevelZeroTilesY: 1
	        }),
	        rectangle: rectangle
	    }));

		//Ajout des ombres
		var shadowMap = viewer.shadowMap;
		shadowMap.maxmimumDistance = 500.0;
		viewer.terrainShadows = Cesium.ShadowMode.ENABLED;

		//Initilalisation de la scène le 1er Juin 2018 à 15h
		var juldate = new Date(2018,6,15,15)
		viewer.clock.currentTime = new Cesium.JulianDate.fromDate(juldate)

		//Suppression des crédit
		scene.globe.depthTestAgainstTerrain = true;

		//Ajout de la détection avec le terrain
		scene.screenSpaceCameraController.enableCollisionDetection = true;

		scene.sun.show = true;
		scene.skyAtmosphere.show = true;

		scene.fog.enabled = true;
		scene.fog.density = 2.0e-4;
		scene.shadowMap.enabled = false;
		document.addEventListener('keyup', (event) => {

			if (event.keyCode == 13){
				console.log('position',camera.position)
				console.log('direction',camera.direction)
				console.log('up',camera.up)
				console.log(camera.frustum.fov)
				console.log("lat",Cesium.Math.toDegrees(Cesium.Ellipsoid.WGS84.cartesianToCartographic(camera.position).latitude))
				console.log("lon",Cesium.Math.toDegrees(Cesium.Ellipsoid.WGS84.cartesianToCartographic(camera.position).longitude))
			}
			if (event.keyCode == 107){
				camera.frustum.fov+=0.01
			}
			if (event.keyCode == 109){
				camera.frustum.fov-=0.01
			}
	    }, false);	
	},

	/**
		Ajout des éléments 3D à la scène
	*/
	loadCesium3DContext() {
		// ** Mnt 3D ** //
		addDEM();
		// ** Batiments 3D ** //
		addBuildings();
		// ** Végétation 3D ** //
		addVegetation();
		// ** Names 3D ** //
		addToponymes();
		  
		// ** Création d'n listerner appelé une seul fois permettant de charger le reste de la scène une fois les tuiles chargées ** //
      	var helper = new Cesium.EventHelper();
			helper.add(viewer.scene.globe.tileLoadProgressEvent, function (event) {
			if (event == 0) {
				//Lance la suite de construction de la scène
				Event.$emit('fireTilesLoaded');
				//Supprime le listener
				helper.removeAll();
			}
		});
	},


	/**
		Ajout des solutions batiments 3D à la scène

		@param coordinates: (obj) Object coordinates contenant une coordonnées lon/lat
	*/
	loadCesiumMockUp(coordinates) {

		//Récupère la hauteur en fonction de la lon/lat
		var height = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(coordinates.lon,coordinates.lat));
		//chargement du premier model
		var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
			Cesium.Cartesian3.fromDegrees(coordinates.lon, coordinates.lat, height));
		
		//chargement du 1er mockup
		model1 = scene.primitives.add(Cesium.Model.fromGltf({
		    url : 'public/models/solu1.gltf',
		    modelMatrix : modelMatrix,
		    scale : 3.0,
		    castShadows: true,
		    receiveShadows: true,
		    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
		    show:false
		}));
		
		model2 = scene.primitives.add(Cesium.Model.fromGltf({
		    url : 'public/models/solu2.gltf',
		    modelMatrix : modelMatrix,
		    scale : 3.0,
		    castShadows: true,
		    receiveShadows: true,
		    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
		    show:false
		}));
	},

	/**
		Méthode de gestion de l'affichage des éléments mockup à l'écran

		@param mockup: (string) solution choisie par l'utilisateur : Aucun, Prop 1, Prop 2
		@param coordinates: (obj) Object coordinates contenant une coordonnées lon/lat
	*/
	drawMockUp(mockup,coordinates){
		var model;
		//Cache les mockups
		if (mockup === 'Aucun'){
			model2.show = false;
			model1.show = false;
			return;
		}
		//Affiche la prop 1
		if (mockup === 'Proposition 1'){
			model2.show = false;
			model1.show = true;
			model = 'solu1.gltf';
		}
		//Affiche la prop 2
		if (mockup === 'Proposition 2'){
			model2.show = true;
			model1.show = false;
			model = 'solu2.gltf';
		}
	},

	/**
		Permet d'afficher ou cacher une couche en fonction de la checkbox correspondante à la couche

		@param layers: (Array) Tableau contenant tous les layers de la scène. contient pour chaque layer un label/id/check
	*/
	layersDrawHide(layers){
		//Parcours l'ensemble des layers disponibles
		for (var i = 0; i < layers.length; i++) {
			//Affiche ou cache un layer en fonction de sa checkbox
			switch(layers[i].label){
				case 'Batiments':  
					bati3d.show = layers[i].check;
					break;
				case 'Végétation':  
					vege3d.show = layers[i].check;
					break;
				case 'Commentaires':  
					viewer.entities.show = layers[i].check;
					break;
			}
		}
	},

	/**
		Permet d'activer ou de désactiver les ombres de la scène

		@param activ: (boolean) activé/ndésactivé : true/false
	*/
	updateShadow(activ){
		scene.shadowMap.enabled = activ;
	},

	/**
		Permet de mettre à jour l'heure et le moi de la scène. Le jour de référence est le milieu du mois c'est à dire le 15

		@param inputdate: (object) contient month (int compris entre 1 et 12) et une heure (int compris en 0 et 23)
	*/
	updateJulianDate(inputdate){
		//Date à partir du 15 Janvier 2018 (2458132) + 365/12 : environ 1 mois
		var juldate = new Date(2018,inputdate.month,15,inputdate.hour)
		viewer.clock.currentTime = Cesium.JulianDate.fromDate(juldate)
	},

	/**
		Add building grappes for grandson project
	*/
	sketchesHeight(){
		var hauteur_etage = 2.5

		var pitch = Cesium.Math.toRadians(0); 
        var roll = Cesium.Math.toRadians(0);      

		//scheme 1
		var posGrappe1 = Cesium.Cartesian3.fromDegrees(6.642828, 46.809308, 470);
		var headGrappe1 = Cesium.Math.toRadians(65);

		// compute orientations 
        var hpRoll_G1 = new Cesium.HeadingPitchRoll(headGrappe1,pitch,roll);   
        var orientation_G1 = Cesium.Transforms.headingPitchRollQuaternion(posGrappe1,hpRoll_G1); 

		var grappe1 = viewer.entities.add({
		    name : 'Red box with black outline',
		    position: posGrappe1,
		    orientation : orientation_G1,
		    box : {
		        dimensions : new Cesium.Cartesian3(30, 30, hauteur_etage*4+10),
		        material : Cesium.Color.WHITE.withAlpha(1),
		        outline : true,
		        outlineColor : Cesium.Color.BLACK,
		        outlineWidth:5.0,
		        shadows:Cesium.ShadowMode.ENABLED
		    }
		});

        //scheme 2
		var posGrappe2 = Cesium.Cartesian3.fromDegrees(6.643890, 46.809669, 470);
		var headGrappe2 = Cesium.Math.toRadians(65);

		// compute orientations 
        var hpRoll_G2 = new Cesium.HeadingPitchRoll(headGrappe2,pitch,roll);   
        var orientation_G2 = Cesium.Transforms.headingPitchRollQuaternion(posGrappe2,hpRoll_G2); 

		var grappe2 = viewer.entities.add({
		    name : 'Red box with black outline',
		    position: posGrappe2,
		    orientation : orientation_G2,
		    box : {
		        dimensions : new Cesium.Cartesian3(30, 30, hauteur_etage*4+10),
		        material : Cesium.Color.WHITE.withAlpha(0.9),
		        outline : true,
		        outlineColor : Cesium.Color.BLACK,
		        outlineWidth:5.0,
		        shadows:Cesium.ShadowMode.ENABLED
		    }
		});


        //scheme 3
		var posGrappe3 = Cesium.Cartesian3.fromDegrees(6.645414, 46.810026, 463);
		var headGrappe3 = Cesium.Math.toRadians(65);

		// compute orientations 
        var hpRoll_G3 = new Cesium.HeadingPitchRoll(headGrappe3,pitch,roll);   
        var orientation_G3 = Cesium.Transforms.headingPitchRollQuaternion(posGrappe3,hpRoll_G3); 

		var grappe3 = viewer.entities.add({
		    name : 'Red box with black outline',
		    position: posGrappe3,
		    orientation : orientation_G3,
		    box : {
		        dimensions : new Cesium.Cartesian3(30, 30, hauteur_etage*4+10),
		        material : Cesium.Color.WHITE.withAlpha(0.5),
		        outline : true,
		        outlineColor : Cesium.Color.BLACK,
		        outlineWidth:5.0,
		        shadows:Cesium.ShadowMode.ENABLED
		    }
		});
	}
}


