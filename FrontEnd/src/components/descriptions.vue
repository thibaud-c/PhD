<template lang="pug">
#descriptions
	v-navigation-drawer.sidebar(absolute permanent right hide-overlay clipped)
		v-tabs(color='indigo darken-3', dark, slider-color='yellow' height="30")
			// Description of the user post
			v-tab(ripple) {{text.description.fr}}
			v-tab-item  
				v-card(flat)
					v-card-title.pa-0.pt-2
						v-layout(row justify-center align-center)
							v-flex(xs9)
								// Title
								v-card-title.pb-0.pt-2
									.title.font-weight-bold {{title}}
								// address
								v-card-title.pb-0.pt-0
									small.pb-2.font-italic.grey--text {{address}}
							v-flex(xs3)
								// category
								v-avatar(size="60" tile)
									img(:src='category')
					
					// Centrality
					v-layout(v-show="centrality" align-center justify-center column)
						v-icon.red--text fas fa-map-marker-alt
						.subtitle.font-weight-regular.font-italic.grey--text {{text.centrality.fr}}
					
					//Retour utilisateur
					v-card-title.pa-0.pl-1.pt-2
						v-layout(column justify-center)
							// Satisfaction
							v-layout.pb-2(row)
								span.pa-0.pb-2.grey--text {{text.review.fr}}
								div(v-for="star in createReview()")
									v-icon.pl-1(small :class="star.color") {{star.icon}}
							// fréquentation
							v-layout(row)
								span.grey--text {{text.attendance.fr}}
								div(v-for="plus in createFrequency()")
									v-icon.pl-1(small :class="plus.color") {{plus.icon}}
					
					// Favorite
					v-card-actions.pa-0
						v-container.pa-2(grid-list-md)
							v-layout(wrap justify-center row align-center)
								v-btn(:class="like ? 'red--text' : ''", icon, @click='like = !like; addlikes()')
									v-icon.faa-pulse.animated fas fa-heart
								.subtitle.font-weight-regular.font-italic {{likenumber}}

					// Picture
					//v-card-media(v-show="showimage" :src='userpicture', height='200px')

					// Comment
					v-card-title.pa-1
						v-textarea(outline name='input-7-4', :value='usercomment' readonly :label="text.description.fr")

					// Frequentation
					v-card-title.pa-0.pl-2
						v-layout.pa-0(row justify-start align-center)
							.grey--text {{text.added.fr}}
							.grey--text.font-weight-bold.pl-1 {{author}}
							.grey--text {{text.when.fr}} 
							.grey--text.font-weight-bold.pl-1 {{date}}.

					// Close window
					v-card-actions.pt-4
						
						v-btn.ml-2(flat icon small color="grey lighten-1" slot="activator")
							v-icon(small) fas fa-exclamation-triangle
						small.pl-2.grey--text {{text.report.fr}}
						v-spacer
						v-btn(flat @click="closepaneldescription()" color='indigo darken-3' small) {{text.close.fr}}

			// Discussion tab						
			v-tab(ripple) {{text.discussion.fr}}
			v-tab-item  
				v-card(flat)
					// Comment list 
					v-card-text.pa-1.pl-2(v-for="com in test")
						v-layout.pb-2(row align-center)
							v-flex
								.font-weight-bold {{com.user}}
							v-layout.pr-2(justify-end row align-center)
								v-icon.pr-1(small) far fa-clock
								.font-weight-light.font-italic {{getDateDifference(com.date)}}
								v-tooltip(bottom)
									v-btn(flat small color="grey lighten-1" slot="activator")
										v-icon(small) fas fa-exclamation-triangle
									span {{text.report.fr}}
						v-layout(align-center row)
							v-flex
								v-icon.pr-3(small :color="com.feedbackColor") {{com.feedbackIcon}}
							v-flex
								span {{com.comment}}
						v-divider.ma-2
					v-card(color="grey lighten-3" flat) 
						// add a comment
						v-form(ref="form" lazy-validation)
							v-textarea.pt-3.pl-3.pr-3(v-model='addcomment' solo clearable auto-grow :rules='[rules.required]' flat)
							v-layout.pl-3.pb-3(row align-center)
								v-flex
									v-btn-toggle(v-model='toggle_none')
										v-btn(flat color="red darken-1" small)
											v-icon(small) far fa-frown
										v-btn(flat color="orange darken-1" small)
											v-icon(small) far fa-meh
										v-btn(flat color="green darken-1" small)
											v-icon(small) far fa-smile
								v-layout(justify-end)
									v-flex
										v-btn(flat color="indigo darken-3" small @click="addComment()") {{text.send.fr}}
					v-card-actions
						v-spacer
						v-btn(flat @click="closepaneldescription()" color='indigo darken-3' small) {{text.close.fr}}
</template>

<script>
	import 'font-awesome-animation/dist/font-awesome-animation.min.css'
	
	// Config imports
	import categoryOptions from './../assets/categories-options.json'
	import opinionOptions from './../assets/opinion-likert-options.json'
	import attendanceOptions from './../assets/attendance-likert-options.json'
	import categoriesOptions from './../assets/categories-options.json'

	const moment = require('moment');
	
export default {

	props:['information'],
	data () {
	  return {
	  	text:{
	  		description:{
            	fr:'Description'
            },
            discussion:{
            	fr:'Discussions'
            },
            commentlabel:{
            	fr:'Votre commentaire *'
            },
            keywords:{
            	fr:'Mots-clés'
            },
            close:{
            	fr:'Fermer'
          	},
          	review:{
            	fr:'Satisfaction : '
          	},
          	attendance:{
            	fr:'Fréquentation : '
          	},
          	centrality:{
          		fr:"Centralité de quatier"
          	},
          	send:{
          		fr:"Envoyer"
          	},
          	added:{
          		fr : "Ajouté par "
          	},
          	when:{
          		fr : ", le"
          	},
          	require:{
	            fr:"Ce champs est obligatoire"
	        },
	        report:{
	        	fr:"Signaler"
	        }
        },
        test:[{
        	user:"Bobo bob",
        	feedbackIcon:"far fa-meh",
        	feedbackColor:"orange darken-1",
        	date:"Mon Aug 13 2018 15:28:52 GMT+0200 (heure d’été d’Europe centrale)",
        	comment:"blablabla non oui meh et aussi plein de choses meh - meh "
        	},
        	{
        	user:"Toto Tot",
        	feedbackIcon:"far fa-smile",
        	feedbackColor:"green darken-1",
        	date:"Thu Aug 2 2018 17:10:32 GMT+0200 (heure d’été d’Europe centrale)",
        	comment:"blablabla non oui meh et aussi plein de choses meh - meh "
        	}       
        ],
        addcomment:"",
        author:"",	
        like: false,
        likenumber:12,
        opinion:"",
        address:"",
        attendace:"",
        title:"",
        centrality:"",
        category:"",
        usercomment:"",
        commentvalidation:false,
        keywords:"",
        rules: [
            v => !!v || 'Champs obligatoire',
        ],
        iconOpinion:"",
        iconColorOpinion:"",
        iconcategorie:"",
        date:"",
        userpicture:"https://cdn.vuetifyjs.com/images/cards/desert.jpg",
        showimage:true,
        toggle_none: null,
        rules: {
	        required: value => !!value || this.text.require.fr,
	    }
	  }
	},
	methods:{
		addlikes(){
			if (this.like)
				this.likenumber+=1
			else
				this.likenumber-=1
		},
		closepaneldescription(){
			Event.$emit('fireCloseDescription');
			this.$refs.form.reset();
		},
		addComment(){
			if (this.$refs.form.validate()) {
				let color=null;
				let emoji=null;
				switch(this.toggle_none){
					case 0:
						color = "red darken-1";
						emoji = "far fa-frown";
						break;
					case 1:
						color = "orange darken-1";
						emoji = "far fa-meh";
						break;
					case 2:
						color = "green darken-1";
						emoji = "far fa-smile";
						break;
				}

				let date = new Date();

				let com = {
					user:"Jack Black",
		        	feedbackIcon:emoji,
		        	feedbackColor:color,
		        	date:date,
		        	comment:this.addcomment
				}

				this.test.push(com)
				this.$refs.form.reset();
			}
		},
		getDateDifference(date){
			let datetime = moment(date)
			let curdate = moment(new Date());
			var duration = moment.duration(curdate.diff(datetime))

			if(duration._data.months>0){
				return duration._data.months+" mois"
			}
			if(duration._data.days>0){
				return duration._data.days+" jours"
			}
			if(duration._data.hours>0){ 
				return duration._data.hours+" heures"
			}
			if(duration._data.minutes>0){
				return duration._data.minutes+" minutes"
			}
			if(duration._data.seconds>0){
				return duration._data.seconds+" secondes"
			}
			return "à l'instant";
		},
		createReview(){
			let stars=[];

			for(let i=1; i<=opinionOptions.length; i++){
				let sclass;
				if(i<=this.opinion){
					sclass={
						icon:"fas fa-star",
						color:"yellow--text"
					}
					stars.push(sclass)
					continue;
				}
				sclass={
					icon:"fas fa-star",
					color:"grey--text"
				}
				stars.push(sclass)
			}
			return stars
		},
		createFrequency(){
			let freqs=[];

			for(let i=1; i<=attendanceOptions.length; i++){
				let fclass;
				if(i<=this.attendance){
					fclass={
						icon:"fas fa-plus-circle",
						color:"yellow--text"
					}
					freqs.push(fclass)
					continue;
				}
				fclass={
						icon:"fas fa-plus-circle",
						color:"grey--text"
					}
				freqs.push(fclass)
			}
			return freqs
		}
	},
	mounted(){
		Event.$on('fireUpdateDescription', (data) => {  
			console.log(data)
            this.author = data.author;
            this.category = data.category;
			this.opinion = data.opinion;
			this.title = data.title;
			this.attendance = data.attendance;
			this.centrality=  JSON.parse(data.centrality);
			this.address = data.address;
            this.usercomment = data.descriptionContent;

            let datetime = moment(data.date);
            this.date = datetime.format('DD / MM');

            this.userpicture = URL.createObjectURL(data.picture);



            if (data.cat !== null){
            	this.showimage = false
            }else{
            	this.showimage = true
            }
        });
	}
		
}

</script>

<style>
  .sidebar{
    height: calc(100% - 40px) !important;
    top:40px !important;
  }
</style>