<template lang="jade">
#project
	span.is-centered.add-border-up.add-visible
		.tag.is-primary.is-small.thematic-Pr-headers.has-text-weight-bold.is-size-7 {{menuname}}
			button.delete.is-small(aria-label="delete", @click="propositionMenuVisibility=false;ombreMenuVisibility=false;closeMenu()") 

	.is-center.columns.put-at-bottom
		.is-fluid.column
			.dropdown.is-up.add-visible(:class="{ 'is-active': propositionMenuVisibility }")
				.dropdown-trigger
					a.button.is-rounded.is-focused.thematic-Pr-bottom-menu(aria-haspopup='true', aria-controls='dropdown-menu', @click="propositionMenuVisibility=!propositionMenuVisibility;ombreMenuVisibility=false;")
						span.icon.is-small
							i.fa.fa-building.fa-inverse.icon-small(aria-hidden='true') 
						span.has-text-white.has-text-weight-semibold Propositions
						span.icon.is-small
							i.fas.fa-angle-up.fa-inverse.icon-small(aria-hidden='true') 

				#dropdown-menu.dropdown-menu(role='menu')
					.dropdown-content.thematic-Pr-sub-menu.add-padding
						.field(v-for='mockup in mockups')
							input.is-checkradio.is-small.is-danger(:id='mockup.label', type='radio', :name='mockupRadioName', v-model='mockup.check', :checked='mockup.check', @change='updateMockupSelector')
							label.has-text-white(:for='mockup.label') {{mockup.label}}


		.is-fluid.column.is-offset-5
			.dropdown.is-up.add-visible(:class="{ 'is-active': ombreMenuVisibility }")
				.dropdown-trigger
					a.button.is-rounded.is-focused.thematic-Pr-bottom-menu(aria-haspopup='true', aria-controls='dropdown-menu', @click="ombreMenuVisibility=!ombreMenuVisibility;propositionMenuVisibility=false;")
						span.icon.is-small
							i.fa.fa-adjust.fa-inverse.icon-small(aria-hidden='true') 
						span.has-text-white.has-text-weight-semibold Ombrage
						span.icon.is-small
							i.fas.fa-angle-up.fa-inverse.icon-small(aria-hidden='true') 

				#dropdown-menu.dropdown-menu(role='menu')
					.dropdown-content.thematic-S-sub-menu.add-padding
						.field
							input.is-checkradio.has-background-color.is-circle.is-danger.is-small(:id='shadowbox', type='checkbox', :name='shadowbox', :checked='isActiveShadow', v-model='isActiveShadow', @change='activShadow(isActiveShadow)')
							label.has-text-white(:for='shadowbox') Activation des Ombres
						hr.dropdown-divider
						.field.thematic-Pr-label.is-4.reduce-margin Mois	
							i.far.fa-calendar-alt.fa-inverse.icon-small(aria-hidden='true') 
						input.slider.centeredslider.is-fullwidth.is-small.is-danger.reduce-margin.has-output(:id='m_slider',step='0', min='1', max='11', :value='date.month', type='range', @change='UpdateMonth')
						output(:for='m_slider') {{months[date.month]}}
						.field.thematic-Pr-label.is-4.reduce-margin Heures	
							i.far.fa-clock.fa-inverse.icon-small(aria-hidden='true') 
						input.slider.centeredslider.is-fullwidth.is-small.is-danger.reduce-margin.has-output(:id='h_slider',step='1', min='00', max='23', :value='date.hour', type='range', @change='UpdateHour')
						output(:for='h_slider') {{date.hour}}h
</template>

<script>

	export default {
		data () {
			return {
				menuname:'Projet Options',
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
		        date:{hour:15,month:6},
		        m_slider:'monthSlider',
		        h_slider:'hourSlider',
		        months:{0:'Jan',1:'Fév',2:'Mar',3:'Avr',4:'Mai',5:'Juin',6:'Juil',7:'Aou',8:'Sep',9:'Oct',10:'Nov',11:'Déc'}
		    }		
		},
		methods:{
			closeMenu(){
		      	Event.$emit('firecloseMenu');
				console.error('firecloseMenu')
			},
		    updateMockupSelector (e) {
		    	Event.$emit('fireUpdateMockup', e.target.id);
		    	console.error('fireUpdateMockup : ' + e.target.id)
		    },
		    UpdateHour(hour){
		        this.date.hour = hour.target.value;
		        Event.$emit('fireUpdateShadow', this.date);
		        console.error('fireUpdateShadow : ' + this.date)
		    },
		    UpdateMonth(month){
		        this.date.month = month.target.value;
		        Event.$emit('fireUpdateShadow', this.date);
		        console.error('fireUpdateShadow : ' + this.date)
		    },
		    activShadow(bool){
		        Event.$emit('fireActivationShadow', bool);
		        console.error('fireActivationShadow :' + bool)
		    },
		},
      	mounted() {
        	Event.$on('fireCloseAllMenu', () => {
        		this.propositionMenuVisibility=false;
        		this.ombreMenuVisibility=false
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
  .thematic-Pr-headers{
    background-color: rgb(255, 127, 80, 0.6) !important;
  }
  .thematic-Pr-bottom-menu{
    background-color: rgb(255, 127, 80, 0.9) !important;
    border-color: rgb(255, 127, 80, 1) !important;
  }
  .thematic-Pr-sub-menu{
    background-color: rgb(255, 127, 80, 0.3) !important;
  }
  .thematic-Pr-select-camera{

  	background-color: rgb(255, 255, 255, 0) !important;
  	color:rgb(196, 196, 196, 1) !important;
  	text-align: left;
  }
  .thematic-Pr-label{
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