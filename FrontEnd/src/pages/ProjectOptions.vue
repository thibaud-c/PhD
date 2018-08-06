<template lang="pug">
#project
	v-flex.bottom-position(xs6 offset-xs2 fuild)

		// menu Choix de propositions à afficher

		v-menu(origin="center center" transition="scale-transition" color="white" background-color="white")
			v-btn(slot="activator" color="green lighten-1" dark small) {{ text.prop_title.fr }}
			v-list
				v-radio-group.pa-2(v-model="activProject" column background-color="white" v-for='project in getProjectNames()' @click="updateMockupSelector()")
					v-radio(:label="project.text" :value="project.id" color="success" )
		
		// menu de gestion des ombres

		v-menu(origin="center center" :close-on-content-click="false" max-width="500" offset-overflow transition="scale-transition" max-height="200")
			v-btn(slot="activator" color="green lighten-1" dark small) {{text.shadow_title.fr}}
			v-list

				// Activation des ombres
				v-list-tile.pt-2
					v-list-tile-action
						v-checkbox(:label="text.shadow_activ.fr" color="green lighten-1" v-model="isactivShadow" @click='activShadow(isactivShadow)')
				
				// datepicker
				v-list-tile.pt-2
					v-list-tile-action
						v-menu(ref="datemenu" :close-on-content-click="false" v-model="isDatePickerActive" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" :disabled='!isactivShadow')
							v-text-field(color="green lighten-1"  slot="activator" v-model="date" :label="text.date_selection.fr" prepend-icon="event" readonly :disabled='!isactivShadow')
							v-date-picker(v-model="date" type="month" no-title scrollable reactive color="green lighten-1")
								v-spacer
								v-btn(flat color="green lighten-1" @click="isDatePickerActive = false") Cancel
								v-btn(flat color="green lighten-1" @click="$refs.datemenu.save(date);UpdateDateTime()") OK
				// timepicker
				v-list-tile.pt-2
					v-list-tile-action
						v-menu(ref="timemenu" :close-on-content-click="false" v-model="isTimePickerActive" :nudge-right="40" :return-value.sync="time" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px" :disabled='!isactivShadow')
							v-text-field(slot="activator" v-model="time" :label="text.time_selection.fr" prepend-icon="access_time" readonly color="green lighten-1" :disabled='!isactivShadow')
							v-time-picker(v-if="isTimePickerActive" v-model="time" @change="$refs.timemenu.save(time);UpdateDateTime()" color="green lighten-1" format="24hr" no-title)
</template>

<script>
	// Config imports
	import projectsList from './../assets/project-propositions.json'


	export default {
		data () {
			return {
				text:{
		          	prop_title:{
		            	fr:'Projet Options'
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
		      	},
				date: "2018-05",
				isDatePickerActive: false,
				time: "12:00",
				isTimePickerActive: false,
				timeStep:'',
		      	activProject:'',
		      	isactivShadow:false,				
		      	propositionMenuVisibility:false,
				ombreMenuVisibility:false,
				mockupRadioName:'mockupRadioEntities',
				mockups: [
			        { label: 'Aucun' , check:null},
			        { label: 'Proposition 1', check:false},
			        { label: 'Proposition 2' , check:false}
			    ],
			    isActiveShadow:false,
		        shadowbox:'shadowCheckBox',

		        m_slider:'monthSlider',
		        h_slider:'hourSlider',
		        
		    }		
		},
		methods:{
			getProjectNames(){
				let projects=[];
				let activeProjects = projectsList.filter(project => project.isActive);
				activeProjects.forEach((project) => {
          			projects.push(project);
        		})

        		return projects;
			},
			closeMenu(){
		      	Event.$emit('firecloseMenu');
				console.log('##__EMIT ->  firecloseMenu__##')
			},
		    updateMockupSelector () {
		    	Event.$emit('fireUpdateMockup', this.activProject);
		    	console.log('##__EMIT ->  fireUpdateMockup : ' + this.activProject +'__##')
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
      		console.warn('ProjectOptions.vue Loaded')
      		
      		this.activProject = projectsList.filter(project => project.check)[0].id;
        	Event.$on('fireCloseAllMenu', () => {
        		this.propositionMenuVisibility=false;
        		this.ombreMenuVisibility=false
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