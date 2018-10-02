<template lang="pug">
  // description du composant cesium et attribution de l'id
  #root
    #cesiumRoot.cesium-VE(@contextmenu.prevent="showRightMenu")
    artifactPanel.pa-2(:xposition="xMenu" :yposition="yMenu" :categorie="categorieIcon" :opinion="opinionColor" v-show="isArtifactActiv")

</template>

<script>
  // Import Cesium
  import Cesium from 'cesium/Cesium' 
  require('cesium/Widgets/widgets.css');
  const axios = require('axios');


  // Config imports
  import initConfig from './../assets/scene-initialisation.json'
  import modeDebug from './../assets/debug-options.json'
  import environmentConfig from './../assets/environment-options.json'
  import projectMockups from './../assets/project-propositions.json'

  

  import opinionOptions from './../assets/opinion-options.json'
  import categoriesOptions from './../assets/categories-options.json'

  //plugin imports
  import scElements from './../js/sceneElements.js'
  import scCameras from './../js/sceneCamerasHandlers.js'
  import scControllers from './../js/sceneControllers.js'
  //Data bases relation imports
  import dao from './../js/DataAccessObjects.js'
  //Geocoder
  import geocoder from './../js/geocoder.js'

  // Import components
  import artifactPanel from "./../components/artifacts.vue"
  import addArtifactMenu from "./../components/addArtifactMenu.vue"

  export default {
      components : { 
        // liste des composants utilisés dans la div principale
        artifactPanel,
        addArtifactMenu
      },

      data (){
        return {
          text:{
                addcom:{
                  fr:'Rédiger un commentaire'
                },
                addpicture:{
                  fr:'Importer une image'
                },
          },
          opinionOptions:opinionOptions,
          categoriesOptions:categoriesOptions,
          categorieIcon:"",
          opinionColor:"",
          isDescriptionVisible:false,
          descriptionurl:'',
          descriptiontitle:'',
          showRMenu: false,
          showcommentpannel:true,
          xMenu: 0,
          yMenu: 0,
          isCommentActiv: false,
          isArtifactActiv: false,
          actionlist:[
            {
              "title":"Capturer l'écran",
              "icon":"fab fa-instagram",
              "action":this.takescreenshot
            },
            {
              "title":"Commenter",
              "icon":"message-plus",
              "action":this.addcomment
            },
            {
              "title":"Importer une image",
              "icon":"fas fa-pencil-alt",
              "action":this.uploadpicture
            }
          ],

          drawer: true,
          items: [
            { title: 'Home', icon: 'dashboard' },
            { title: 'About', icon: 'question_answer' }
          ]

        }
      },
     methods:{
        get_unlock_opinions(){
          let opinions = [];
          let active_opinion = this.opinionOptions.filter(opinion => opinion.isActive);
          active_opinion.forEach((opinion) => {
              opinions.push(opinion)
          })
          console.log(opinions)
          return opinions
        },
        get_unlock_categories(){
          let categories = [];
          let active_categories = this.categoriesOptions.filter(cat => cat.isActive);
          active_categories.forEach((cat) => {
              categories.push(cat)
          })
          return categories
        },
        takescreenshot(){
          alert("Scrren")
        },
        addcomment(){
          this.isCommentActiv = true;
        },
        uploadpicture(){
          this.isArtifactActiv = true;
        },
        showRightMenu (e) {
              e.preventDefault()
              this.showRMenu = false
              this.xMenu = e.clientX
              this.yMenu = e.clientY
              this.$nextTick(() => {
                  this.showRMenu = true
              })
          }
        },


        /** 

      Main Cesium, Start on mount

      */
      mounted() {
        
        console.warn('CesiumVirtualGlobe.vue loaded')

        Event.$on('fireCloseaddArtifactMenu', () => {
          this.showRMenu=false;
        });

        Event.$on('fireOpenaddArtifact', () => {
          this.isArtifactActiv=true;
        });

        Event.$on('fireUpdate3DCam', (lat,lon) => {
          //Take zero as height but is balanced during the setcampositionwith tilt which get the current height of the camera
          let position = scControllers.getSceneCoordinatesfromLonLatHeight(lon, lat, -1)
          scCameras.setCamPositionWithTilt(position)
          let zoomLevel = scCameras.detectZoomLevel();
        });

        Event.$on('fireAboveViewMode', () => {
          //Camera from above to get an 2D view
          
          let position = scCameras.cameraLookingAt();
          //new Cesium.Cartesian3.fromDegrees(
          //scCameras.setCamPositionFromAbove(position)
        });

        Event.$on('fireCloseArtifactPanel', () => {
          this.isArtifactActiv= false;
        });

        Event.$on('fireSetXY', (height,width) => {
          this.xMenu = width;
          this.yMenu = height;
        });

        Event.$on('fireGetAddressFromPixels', (x,y) => {
          let position = scControllers.getlonlatfromxy(x, y-40);

          let lat = position[0];
          let long = position[1];

          geocoder.getAdressFromPix(lat,long,environmentConfig.Rgeocoder.base_url);
        });

        Event.$on('fireSearchAddress', (address) => {
          geocoder.getPositionfromAddress(address,environmentConfig.SwissTopoGeocoder.base_url);
        });

        // ** Scene Initialisation ** //

        // debug mode activation 
        if(modeDebug.DEBUG){
          scControllers.addMouseCoordinates();
        }

        // Add viewer with option 
        scElements.loadCesiumScene(initConfig.CESIUM_SCENE_OPTION, initConfig.ROOT_CESIUM_DIV);

        //Parameters inbitialisation to CameraHandler & Scenecontrolleur
        scCameras.sceneCameraHandlerConstructor(scElements.getCesiumViewer());
        scControllers.sceneControllersConstructor(scElements.getCesiumViewer());

        //camera position into the VE
        scCameras.setCameraPosition(initConfig.CAMERA_INIT);

        //Ajout de la 3D : mnt/bati/vegetation
        scElements.loadCesium3DContext();

        //Ajout des handlers de selection survol d'entitées
        scControllers.addFeatureSelectionHandler();

        //Ajout de l'handler carte 2D
        scControllers.addMap2DHandler();

        //Outils de hauteur pour grandson
        scElements.sketchesHeight()
        

        // ** Lance le chargement des objets 3D ** //

        Event.$on('fireTilesLoaded', () => {
          //Ajout des mockups solutions
          let mockupPositions=[];
          let Mockups = projectMockups.filter(mockup => mockup.location);
          scElements.loadCesiumMockUp(Mockups[0].location);

          //Ajout des Images FlickR
          //scControllers.addflickRPicHandler(initConfig.MockUp_position, initConfig.flickR);
          
          //Ajout des object historique
          //scControllers.addHistoryContext(initConfig.RiponneContext);
          //scControllers.addHistoryContext(initConfig.RiponneHistory);
        });


        /**

          Handlers

        */

        // ** Camera ** //
        //Camera selection
        Event.$on('fireUpdateCamera', cameraName => {
          console.log(cameraName)
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
              scCameras.fixedcam(initConfig.fixedcam_1);
              break;
            case 'Point de vue 2' : 
              scCameras.fixedcam(initConfig.fixedcam_2);
              break;
            case 'Point de vue 3' : 
              scCameras.fixedcam(initConfig.fixedcam_3);
              break;
            case 'example' : 
              scCameras.fixedcam(initConfig.fixedcam_3);
              break;
          }
        });
        //Camera Speed
        Event.$on('fireUpdateSpeed', speed => {
          scCameras.setMovingSpeed(speed);
        });

        // ** Taking Screenshots ** //

        Event.$on('fireTakeScreenShot', mockup => {
          scControllers.takeScreen();
        });

        // ** Add Picture ** //

        Event.$on('fireUploadArtifact', artifact => {
          let position = scControllers.getlonlatfromxy(artifact.xposition, artifact.yposition-40);

          artifact.xposition = position[0];
          artifact.yposition = position[1];

          scControllers.addNewArtifact(artifact);
        });
        

        // ** Add Comments ** //

        Event.$on('fireAddComment', (comment) => {

          console.log(comment)
          let position = scControllers.getlonlatfromxy(comment.xposition, comment.yposition-40);
          console.log(position)
          comment.xposition = position[0];
          comment.yposition = position[1];
          scControllers.addCom(comment);
        });

        Event.$on('fireCloseCommentsPanel', () => {
          this.isCommentActiv= false;
        });


        
        
        // ** Hide/Draw Layers ** //

        Event.$on('fireUpdateLayer',(layers) => {
          scElements.layersDrawHide(layers);
        });

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

        //___SCENE OPTIONS___//

        // ** Modification de l'ombre de la scène ** //

        //Change l'heure et la date de la scène pour les ombres
        Event.$on('fireUpdateShadow', (date,time) => {
          scElements.updateJulianDate(date,time);
        });

        //Active ou désactive les ombres dans la scène
        Event.$on('fireActivationShadow', (activ) => {
          scElements.updateShadow(activ);
        });

        // ** MockUp Solutions ** //

        Event.$on('fireUpdateMockup', mockup => {
          scElements.drawMockUp(mockup);
        });


    }, 
  }
  

</script>

<style>
  .cesium-VE{
    height: calc(100% - 40px);
    position: absolute;
    width:100%;
    top:40px;
  }
  .sidebar{
    height: calc(100% - 40px) !important;
    top:40px !important;
  }
</style>