<template lang="pug">
#scene
	v-flex.bottom-position(xs6 offset-xs2 fuild)
		v-menu(:close-on-content-click="false" max-width="500" offset-overflow transition="scale-transition" max-height="200")
			v-btn(slot="activator" color="indigo darken-3" dark small) {{text.title.fr}}
			v-list
				v-list-tile.pt-3
					// Liste des caméras
					v-list-tile-action
						v-select(:items="getCamerasName()" :label="text.select_cameras.fr" v-model="activCamera")
				v-list-tile.pt-3
					// Vitesse caméra
					v-list-tile-action
						v-slider(v-model="cameraspeed" append-icon="fas fa-forward" :label="text.speed_camera.fr" max-width="500" :disabled='activCamera!=="Première Personne"')

		// menu de gestion des ombres
		v-menu(origin="center center" :close-on-content-click="false" max-width="500" offset-overflow transition="scale-transition" max-height="200")
			v-btn(slot="activator" color="indigo darken-3" dark small) {{text.shadow_title.fr}}
			v-list
				// Activation des ombres
				v-list-tile.pt-2
					v-list-tile-action
						v-checkbox(:label="text.shadow_activ.fr" color="indigo darken-3" v-model="isactivShadow" @click='activShadow(isactivShadow)')
				
				// datepicker
				v-list-tile.pt-2
					v-list-tile-action
						v-menu(ref="datemenu" :close-on-content-click="false" v-model="isDatePickerActive" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" :disabled='!isactivShadow')
							v-text-field(color="indigo darken-3"  slot="activator" v-model="date" :label="text.date_selection.fr" prepend-icon="event" readonly :disabled='!isactivShadow')
							v-date-picker(v-model="date" type="month" no-title scrollable reactive color="indigo darken-3")
								v-spacer
								v-btn(flat color="indigo darken-3" @click="$refs.datemenu.save(date);UpdateDateTime()") {{text.ok.fr}}
				// timepicker
				v-list-tile.pt-2
					v-list-tile-action
						v-menu(ref="timemenu" :close-on-content-click="false" v-model="isTimePickerActive" :nudge-right="40" :return-value.sync="time" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" :disabled='!isactivShadow')
							v-text-field(slot="activator" v-model="time" :label="text.time_selection.fr" prepend-icon="access_time" readonly color="indigo darken-3" :disabled='!isactivShadow')
							v-time-picker(v-if="isTimePickerActive" v-model="time" @change="$refs.timemenu.save(time);UpdateDateTime()" color="indigo darken-3" format="24hr" no-title)
								v-spacer
								v-btn(flat color="indigo darken-3" @click="$refs.datemenu.save(date);UpdateDateTime()") {{text.ok.fr}}
</template>

<script>
	
	// Config imports
	import layersList from './../assets/layers-options.json'
	import camerasList from './../assets/cameras-options.json'


	export default {
		data () {
			return {
				text:{
		          title:{
		            fr:'Scène Options'
		          },
		          select_layers:{
		            fr:'Sélectionner les couches à afficher'
		          },
		          select_cameras:{
		            fr:'Sélectionner la caméra'
		          },
		          speed_camera:{
		            fr:'Vitesse de la caméra'
		          },
		          shadow_title:{
		            fr:'Ombres portées'
		          },
		          shadow_activ:{
		            fr:'Activer la simulation'
		          },
		          date_selection:{
		            fr:'Sélection de la date'
		          },
		          time_selection:{
		            fr:"Sélection de l'heure"
		          },
		          ok:{
		            fr:"Valider"
		          },
		        },
		        activLayers: [],
		        activCamera: '',
		        cameraspeed:30,
				layersMenuVisibility:false,
				camerasMenuVisibility:false,
				date: "2018-05",
				isDatePickerActive: false,
				time: "12:00",
				isTimePickerActive: false,
				timeStep:'',
				isactivShadow:false,
				ombreMenuVisibility:false,

				layers_checkboxes: ['foobar','Batiments','Végétation','Commentaires','Prévisualisation'],
      			scenemenu: false,
				cameraSelected:'Selection caméra',
				isActiveShadow:false,
		        shadowbox:'shadowCheckBox',
				
			}		
		},
		methods:{
			getLayersName(){
				let layers=[];
				let activeLayers = layersList.filter(layer => layer.isActive)
				activeLayers.forEach((layer) => {
          			layers.push(layer)
        		})

        		return layers
      		},
      		getCamerasName(){
				let cameras=[];
				let activeCameras = camerasList.filter(camera => camera.isActive)
				activeCameras.forEach((camera) => {
          			cameras.push(camera)
        		})

        		return cameras
      		},
			closeMenu(){
		      	Event.$emit('firecloseMenu');
				console.error('firecloseMenu')
			},
			updateVisibleLayers(val,bool){
				Event.$emit('fireUpdateLayer', this.layers_checkboxes);
				console.error('fireUpdateLayer :' + this.layers_checkboxes.filter( layer => layer.check ))
			},
			updateCameraSelector(){
		      Event.$emit('fireUpdateCamera', this.cameraSelected);
		      //Event.$emit('fireChangeCamera', this.cameraSelected);
		      console.error('fireUpdateCamera : ' + this.cameraSelected)
		    },
		    updateSpeedSlider(slider){
		      Event.$emit('fireUpdateSpeed', slider.path[0].value);
		      this.speedStartingValue = slider.path[0].value;
		      console.error('fireUpdateSpeed :' + slider.path[0].value);
		    },
		    UpdateDateTime(){
		        Event.$emit('fireUpdateShadow', this.date, this.time);
		       console.log('##__EMIT ->  fireUpdateShadow : ' + this.date + ' '+ this.time +'__##')
		    },

		    activShadow(bool){
		        Event.$emit('fireActivationShadow', bool);
		        console.log('##__EMIT ->  fireActivationShadow : ' + bool +'__##')
		    },
		},
		mounted() {
			console.warn('Chargement de SceneOptions.vue')
			this.activLayers = this.getLayersName();
			this.activCamera = camerasList.filter(camera => camera.check)[0].text;
			// this.e7=this.getLayerName()
        	Event.$on('fireCloseAllMenu', () => {
				this.camerasMenuVisibility=false;
				this.layersMenuVisibility=false
        		this.closeMenu();
			});

	  	}
	}
</script>

<style>
	.bottom-position{
		bottom:2%;
		left:0%;
		z-index: 0;
		position: fixed;
	} 
</style>