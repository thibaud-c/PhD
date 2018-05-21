<template lang="jade">
  <!-- description du composant cesium et attribution de l'id -->
  #cesiumRoot
    .card.descrition(v-show='isDescriptionVisible')
      .card-image
        figure.image.is-4by3
          img(:src='descriptionurl', alt='Placeholder image')
      .card-content
        .media.is-mobile
          .media-content.is-left
            p.title.is-4 {{ descriptiontitle }}
            p.subtitle.is-6 @auteur
          br
          nav.level.is-right
            .level-left
              a.level-item
                span.icon.is-small
                  i.fas.fa-reply
              a.level-item
                span.icon.is-small
                  i.fas.fa-heart
        .content
          | une description 
          | sur plusieurs lignes ...
          br
          time(datetime='2016-1-1') 11:09 PM - 1 Jan 2016
      a.delete.is-small.closedescription(@click='isDescriptionVisible=false')

</template>

<script>
  //application configuration Imports 
  import config from './../../assets/config.json'
  //plugin imports
  import scElements from './../../plugins/sceneElements.js'
  import scCameras from './../../plugins/sceneCamerasHandlers.js'
  import scControllers from './../../plugins/sceneControllers.js'
  //Data bases relation imports
  import dao from './../../plugins/DataAccessObjects.js'
  
  

	export default {
      data (){
        return {
          isDescriptionVisible:false,
          descriptionurl:'',
          descriptiontitle:''
        }
      },
      /** 

      Main Cesium, lancement une fois le composant monté

      */
      mounted() {
      /**

          Handlers

        */

        // ** Camera ** //
        //Camera selection
        Event.$on('fireUpdateCamera', cameraName => {
          switch(cameraName){
            case 'Première Personne': 
              scCameras.firstPersonCam();
              break;
            /*
              case 'Street View' : 
              break;
            */
            case 'FreeFly' : 
              scCameras.freeflyfcam();
              break;
            case 'Point de vue 1' : 
              scCameras.fixedcam(config.fixedcam_1);
              break;
            case 'Point de vue 2' : 
              scCameras.fixedcam(config.fixedcam_2);
              break;
            case 'Point de vue 3' : 
              scCameras.fixedcam(config.fixedcam_3);
              break;
          }
        });
        //Camera Speed
        Event.$on('fireUpdateSpeed', speed => {
          scCameras.setMovingSpeed(speed);
        });

        // ** MockUp Solutions ** //

        Event.$on('fireUpdateMockup', mockup => {
          scElements.drawMockUp(mockup,config.MockUp_position);
        });

        // ** Taking Screenshots ** //

        Event.$on('fireTakeScreenShot', mockup => {
          scControllers.takeScreen();
        });

        // ** Add Picture ** //

        Event.$on('fireUploadPicture', pic => {
          console.log(pic)
          scControllers.addPicture(pic);
        });
        

        // ** Add Comments ** //

        Event.$on('fireAddComment', (name,email,comment) => {
          scControllers.addCom(name,email,comment);
        });

        // ** Hide/Draw Layers ** //

        Event.$on('fireUpdateLayer',(layers) => {
          scElements.layersDrawHide(layers);
        });

        // ** Display description ** //

        /*Event.$on('fireDisplayDescription',(info) => {
          this.descriptiontitle=info[0]
          this.descriptionurl=info[1]
          this.isDescriptionVisible=true;
        });*/

        // ** Lance un appel rest FlickR ** //

        Event.$on('fireRestApi', (method, url, options) => {
          dao.restAPI(method, url, options).then((photos) => {
            console.log('photos',photos)
            scControllers.pinsFlickRPictures(photos);
          })
        });

        //Change nomnre de photo flickR 
        Event.$on('fireupdateFlickrNumber', number => {
          scControllers.setNumberFlickR(number);
        });

        // ** Lance le chargement des objets 3D ** //

        Event.$on('fireTilesLoaded', () => {
          //Ajout des mockups solutions
          scElements.loadCesiumMockUp(config.MockUp_position);
          //Ajout des Images FlickR
          scControllers.addflickRPicHandler(config.MockUp_position, config.flickR);
          //Ajout des object historique
          scControllers.addHistoryContext(config.RiponneContext);
          scControllers.addHistoryContext(config.RiponneHistory);
        });
        
        // ** Controlleurs de dessin ** // 
        
        //Lance la fonction de dessin : mode édition
        Event.$on('fireStartDrawing', () => {
          scControllers.drawOnScene();
        });
        //stop la fonction de dessin : mode édition
        Event.$on('fireStopDrawing', () => {
          scControllers.stopDrawOnScene();
        });
        //Undo la dernière forme dessinée
        Event.$on('fireUndoDrawing', () => {
          scControllers.undoDrawOnScene();
        });

        // ** Modification de l'ombre de la scène ** //
        //Change l'heure de la scène pour les ombres
        Event.$on('fireUpdateShadow', date => {
          scElements.updateJulianDate(date);
        });
        //Active ou désactive les ombres dans la scène
        Event.$on('fireActivationShadow', (activ) => {
          scElements.updateShadow(activ);
        });


        // ** Scene Initialisation ** //

        //ajout des coordonnées souris si debug
        if(config.DEBUG){
          scControllers.addMouseCoordinates();
        }
        //Ajout du viewer cesium et de ses options
        scElements.loadCesiumScene(config.CESIUM_SCENE_OPTION, config.ROOT_CESIUM_DIV);
        //Parameters inbitialisation to CameraHandler & Scenecontrolleur
        scCameras.sceneCameraHandlerConstructor(scElements.getCesiumViewer());
        scControllers.sceneControllersConstructor(scElements.getCesiumViewer());
        //camera position into the VE
        scCameras.setCameraPosition(config.LASANNE_Riponne);
        //Ajout de la 3D : mnt/bati/vegetation
        scElements.loadCesium3DContext();
        //Ajout des handlers de selection survol d'entitées
        scControllers.addFeatureSelectionHandler();
        //Ajout de l'handler carte 2D
        scControllers.addMap2DHandler();

        //Outils de hauteur pour grandson
        scElements.sketchesHeight()
    }, 
	}
  console.warn('Chargement de CesiumCpt.vue')

</script>

<style>
.cesiumcontainer{
  position:fixed;
  top:0;
  left:0;
  height:70%;
  width:100%;
}
.cesium-viewer-bottom{
  display:none;
}


</style>