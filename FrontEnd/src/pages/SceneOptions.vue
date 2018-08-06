<template lang="pug">
#scene
	v-flex.bottom-position(xs2 offset-xs2 fuild)
		v-menu(:close-on-content-click="false" max-width="500" offset-overflow transition="scale-transition" max-height="200")
			v-btn(slot="activator" color="indigo" dark small) {{text.title.fr}}

			v-list
				v-list-tile.pt-3

					// Liste des layers
					v-list-tile-action
						v-select(:items="getLayersName()" v-model="activLayers" :label="text.select_layers.fr" small-chips multiple)
				v-list-tile.pt-3

					// Liste des caméras
					v-list-tile-action
						v-select(:items="getCamerasName()" :label="text.select_cameras.fr" v-model="activCamera")
				v-list-tile.pt-3

					// Vitesse caméra
					v-list-tile-action
						v-slider(v-model="cameraspeed" append-icon="fas fa-forward" :label="text.speed_camera.fr" max-width="500" :disabled='activCamera!=="Première Personne"')

						


	//span.is-centered.add-border-up.add-visible
		.tag.is-primary.is-small.thematic-S-headers.has-text-weight-bold.is-size-7 {{menuname}}
			button.delete.is-small(aria-label="delete", @click="camerasMenuVisibility=false;layersMenuVisibility=false;closeMenu()") 

	//.is-center.columns.put-at-bottom
		.is-fluid.column
			.dropdown.is-up.add-visible(:class="{ 'is-active': layersMenuVisibility }")
				.dropdown-trigger
					a.button.is-rounded.is-focused.thematic-S-bottom-menu(aria-haspopup='true', aria-controls='dropdown-menu', @click="layersMenuVisibility=!layersMenuVisibility;camerasMenuVisibility=false")
						span.icon.is-small
							i.fa.fa-filter.fa-inverse.icon-small(aria-hidden='true') 
						span.has-text-white.has-text-weight-semibold Couches
						span.icon.is-small
							i.fas.fa-angle-up.fa-inverse.icon-small(aria-hidden='true') 

				#dropdown-menu.dropdown-menu(role='menu')
					.dropdown-content.thematic-S-sub-menu.add-padding
						.field(v-for='box in layers_checkboxes')
							input.is-checkradio.has-background-color.is-circle.is-info.is-small(:id='box.label', type='checkbox', :name='box.label', :checked='box.check', v-model='box.check', @change='updateVisibleLayers(box.label,box.check)')
							label.has-text-white(:for='box.label') {{box.label}}
						hr.dropdown-divider


		.is-fluid.column.is-offset-5
			.dropdown.is-up.add-visible(:class="{ 'is-active': camerasMenuVisibility }")
				.dropdown-trigger
					a.button.is-rounded.is-focused.thematic-S-bottom-menu(aria-haspopup='true', aria-controls='dropdown-menu', @click="camerasMenuVisibility=!camerasMenuVisibility;layersMenuVisibility=false")
						span.icon.is-small
							i.fa.fa-camera.fa-inverse.icon-small(aria-hidden='true') 
						span.has-text-white.has-text-weight-semibold Caméras
						span.icon.is-small
							i.fas.fa-angle-up.fa-inverse.icon-small(aria-hidden='true') 

				#dropdown-menu.dropdown-menu(role='menu')
					.dropdown-content.thematic-S-sub-menu.add-padding
						.field
							.control.has-icons-left
								.select.is-small
									select.thematic-S-select-camera(v-model='cameraSelected', @change='updateCameraSelector')
										option.thematic-S-select-camera(v-for="cam in cameras", :value='cam.text') {{ cam.text }}
								.icon.is-left
									i.fas.fa-eye.fa-inverse.icon-small
						hr.dropdown-divider
						.field.thematic-S-label.is-4.reduce-margin Vitesse Caméra 
						input.slider.centeredslider.is-fullwidth.is-small.is-info.reduce-margin(step='1', min='0', max='100', :value='speedStartingValue', type='range' @change='updateSpeedSlider')
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
		          }
		        },
		        activLayers: [],
		        activCamera: '',
		        cameraspeed:30,
				layersMenuVisibility:false,
				camerasMenuVisibility:false,

				layers_checkboxes: ['foobar','Batiments','Végétation','Commentaires','Prévisualisation'],
      			scenemenu: false,
				cameraSelected:'Selection caméra',
				
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
		    }
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