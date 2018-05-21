<template lang="jade">
#scene
	span.is-centered.add-border-up.add-visible
		.tag.is-primary.is-small.thematic-S-headers.has-text-weight-bold.is-size-7 {{menuname}}
			button.delete.is-small(aria-label="delete", @click="camerasMenuVisibility=false;layersMenuVisibility=false;closeMenu()") 

	.is-center.columns.put-at-bottom
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

	export default {
		data () {
			return {
				layersMenuVisibility:false,
				camerasMenuVisibility:false,
				menuname:'Scène Options',
				layers_checkboxes: [
			        {label:'Batiments', id:'bati3d', check:'true'},
			        {label:'Végétation', id:'vege3d', check:'true'},
			        {label:'Commentaires', check:'true'},
			        {label:'Prévisualisation', check:'true'}
      			],
				cameraSelected:'Selection caméra',
				cameras: [
					{ text:'FreeFly' },
					{ text:'Première Personne' },
					//{ text:'Street View' },
					{ text:'Point de vue 1' },
					{ text:'Point de vue 2' },
					{ text:'Point de vue 3' },
				],
				speedStartingValue:30,
			}		
		},
		methods:{
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
        	Event.$on('fireCloseAllMenu', () => {
				this.camerasMenuVisibility=false;
				this.layersMenuVisibility=false
        		this.closeMenu();
			});
	  	}
	}
</script>

<style>
  .put-at-bottom{
    bottom: 2%;
    position: absolute;
  }
  .thematic-S-headers{
    background-color: rgb(70, 130, 180, 0.6) !important;
  }
  .thematic-S-bottom-menu{
    background-color: rgb(70, 130, 180, 0.9) !important;
  }
  .thematic-S-sub-menu{
    background-color: rgb(70, 130, 180, 0.3) !important;
  }
  .thematic-S-select-camera{

  	background-color: rgb(255, 255, 255, 0) !important;
  	color:rgb(196, 196, 196, 1) !important;
  	text-align: left;
  }
  .thematic-S-label{
  	color:rgb(255, 255, 255, 1);
  }
  .add-border-up{
  	padding: 0;
  	position:absolute;
    top:0.5%;
    left: 45%;
    width: 10%;
  }
  .add-visible{
    z-index:3;
  }
  .icon-small{
  	font-size:18px;
  }
  .add-padding{
  	padding: 5%;
  }
  .reduce-margin{
  	margin:0px !important;
  }
</style>