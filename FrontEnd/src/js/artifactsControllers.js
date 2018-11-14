/**
MIT License

Copyright (c) [2018] [Thibaud Chassin]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// ** Parameters **//
import Cesium from 'cesium/Cesium' 

let viewer;
let scene;
let camera;

//entities type - data sets
let frequenceDataSet;
let customDataSet;
let temporaryDataSet;

let temporaryIconSrc = "/icons/art-temporary.png";
let temporaryIconSize= 0.25; 
let temporaryIconContext= "TMP"; 

let frequencyIconSrc = "/icons/art-frequency.png";
let frequencyIconSize= 0.17; 
let frequencyIconContext= "FREQ";

let customIconSrc = "/icons/art-custom.png";
let customIconSize= 0.17; 
let customIconContext= "CUST";

// ** Non Vue Methods **//

/**
	Ajout un pin's dans la scène 

	@param name : (string) nom de l'objet
	@param auteur : (string) auteur de l'info
	@param type : (string) type de l'objet
	@param content : (string) contenu de l'object img/commentaire...
	@param camPosition : (obj) position de lq caméra 
	@param pins : (string) image du pins à afficher
	@param scale : (string) echelle du pins

	@return the entity created
*/
function addPinToScene(context, position, data, icon, size){
	let entity
	//get Info camera

	data.cameraProperties = {
	  	position: camera.position.clone(),
	 	direction: camera.direction.clone(),
	  	up: camera.up.clone(),
	  	right: camera.right.clone(),
	  	transform: camera.transform.clone(),
	  	frustum: camera.frustum.clone()
	};
	data.date = new Date();

	//Create pins 
	let pinbuilder = new Cesium.PinBuilder();

	//choose the dataset (tmp, frep, cust)
	console.log(context)
	switch(context){

		case "TMP":
			entity = temporaryDataSet.entities.add({
			    //paramètre du pins
			    type:"TMP",
			    data:data,
			    position:position,
			    //definit l'icone
			    billboard: {
			        image: icon,
			        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			        scale:size
			    }
			});
			break
		case "FREQ":
			entity = frequenceDataSet.entities.add({
			    //paramètre du pins
			    type:"FREQ",
			    data:data,
			    position:position,
			    //definit l'icone
			    billboard: {
			        image: icon,
			        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			        scale:size
			    }
			});
			break
		case "CUST":
			entity = customDataSet.entities.add({
			    //paramètre du pins
			    type:"CUST",
			    data:data,
			    position:position,
			    //definit l'icone
			    billboard: {
			        image: icon,
			        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			        scale:size
			    }
			});
			break
	}

	return entity;
};


// ** Vue Methods **//

export default {
	// ** Constructor **//

	/**
		Parameter initialisation

		@param viewer : (obj) cesium viewer
	*/
	artifactsControllerConstructor(view){
		viewer = view;
		scene = view.scene;
		camera = view.camera;

		//creation du cluster d'entitées
		frequenceDataSet = new Cesium.CustomDataSource()
		viewer.dataSources.add(frequenceDataSet)

		customDataSet = new Cesium.CustomDataSource()
		viewer.dataSources.add(customDataSet)

		temporaryDataSet = new Cesium.CustomDataSource()
		viewer.dataSources.add(temporaryDataSet)
	},

	addTemporaryArtifact(position){
		let artifactData = {};
		//recuperation de la position du regard de la camera
	    let height = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(position[1], position[0]));
		if (!height){
			//position non trouvée
			console.error("Erreur dans la récupération de la position de l'artéfact");
			alert(":( Oh Noo ! <br> J'ai rencontré un problème pour récupérer la position de l'élément ... Pouvez-vous recommencer, s'il vous plait ?");
			return;
		}
		let artifactPosition = new Cesium.Cartesian3.fromDegrees(position[1], position[0], height+15);
		
		//Ajout le pins à la carte
		let entity = addPinToScene(temporaryIconContext, artifactPosition, artifactData, temporaryIconSrc, temporaryIconSize);
	},

	addFrequencyArtifact(position, data){
		//recuperation de la position du regard de la camera
	    let height = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(position[1], position[0]));
		if (!height){
			//position non trouvée
			console.error("Erreur dans la récupération de la position de l'artéfact");
			alert(":( Oh Noo ! <br> J'ai rencontré un problème pour récupérer la position de l'élément ... Pouvez-vous recommencer, s'il vous plait ?");
			return;
		}
		let artifactPosition = new Cesium.Cartesian3.fromDegrees(position[1], position[0], height+15);
		
		//Ajout le pins à la carte
		let entity = addPinToScene(frequencyIconContext, artifactPosition, data, frequencyIconSrc, frequencyIconSize);
	},

	addCustomArtifact(position, data){
		//recuperation de la position du regard de la camera
	    let height = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(position[1], position[0]));
		if (!height){
			//position non trouvée
			console.error("Erreur dans la récupération de la position de l'artéfact");
			alert(":( Oh Noo ! <br> J'ai rencontré un problème pour récupérer la position de l'élément ... Pouvez-vous recommencer, s'il vous plait ?");
			return;
		}
		let artifactPosition = new Cesium.Cartesian3.fromDegrees(position[1], position[0], height+15);
		
		//Ajout le pins à la carte
		let entity = addPinToScene(customIconContext, artifactPosition, data, customIconSrc, customIconSize);
	},

	removeallTemporaryArtifact(){
		temporaryDataSet.entities.removeAll()
	}

}
