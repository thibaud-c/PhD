<template lang="pug">
  // description du composant cesium et attribution de l'id
  #root

    #cesiumRoot.cesium-VE(@contextmenu.prevent="showRightMenu")
    v-menu(v-model='showRMenu' :position-x='xMenu' :position-y='yMenu' absolute offset-y)
      v-list
        v-list-tile(v-for='(option, index) in actionlist' :key='index' @click='option.action')
          v-list-tile-title {{ option.title }}

    v-navigation-drawer.sidebar(v-model='drawer' absolute permanent right hide-overlay clipped v-show="isCommentActiv")
      v-list.pa-1(dense)
        v-list-tile
          v-list-tile-title.font-weight-bold.subheading {{text.addcom.fr}}
        commentPanel.pa-2(:xposition="xMenu" :yposition="yMenu")
    v-navigation-drawer.sidebar(v-model='drawer' absolute permanent right hide-overlay clipped  v-show="isUploadActiv")
      v-list.pa-1(dense)
        v-list-tile
          v-list-tile-title.font-weight-bold.subheading {{text.addpicture.fr}}
        importPanel.pa-2(:xposition="xMenu" :yposition="yMenu")

            



</template>

<script>
  // Import Cesium
  import Cesium from 'cesium/Cesium' 
  require('cesium/Widgets/widgets.css');


  // Config imports
  import initConfig from './../assets/scene-initialisation.json'
  import modeDebug from './../assets/debug-options.json'
  import projectMockups from './../assets/project-propositions.json'

  //plugin imports
  import scElements from './../js/sceneElements.js'
  import scCameras from './../js/sceneCamerasHandlers.js'
  import scControllers from './../js/sceneControllers.js'
  //Data bases relation imports
  import dao from './../js/DataAccessObjects.js'

  // Import components
  import commentPanel from "./../components/comments.vue"
  import importPanel from "./../components/imports.vue"


  export default {
      components : { 
        // liste des composants utilisés dans la div principale
        commentPanel,
        importPanel
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
          isDescriptionVisible:false,
          descriptionurl:'',
          descriptiontitle:'',
          showRMenu: false,
          showcommentpannel:true,
          xMenu: 0,
          yMenu: 0,
          isCommentActiv: false,
          isUploadActiv: false,
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
        takescreenshot(){
          alert("Scrren")
        },
        addcomment(){
          this.isCommentActiv = true;
        },
        uploadpicture(){
          this.isUploadActiv = true;
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

        Event.$on('fireUploadPicture', pic => {
          console.log(pic)
          let position = scControllers.getlonlatfromxy(pic.xposition, pic.yposition-40);
          console.log(position)
          pic.xposition = position[0];
          pic.yposition = position[1];

          scControllers.addPicture(pic);
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

        Event.$on('fireCloseUploadsPanel', () => {
          this.isUploadActiv= false;
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