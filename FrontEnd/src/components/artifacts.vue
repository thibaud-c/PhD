<template lang="pug">
#import
	v-navigation-drawer.sidebar(absolute permanent right hide-overlay clipped)
		v-form(ref="form" lazy-validation)
			v-card(flat)
				// Tile Title
				v-card-title
					.title.font-weight-bold {{text.menutitle.fr}}
				
				// address
				v-card-title.pb-0.pt-0
					v-layout(row align-center)
						small.font-italic.grey--text {{reverseAdress}}
						v-btn(flat icon small @click="refreshAdress")
							v-icon(small :class="refreshColor") {{refreshIcon}}

				v-card-title
					// Title
					v-flex(xs8)
						v-text-field(v-model="usertitle" :rules='[rules.required]' :label='text.title.fr')
					// Centrality
					v-layout(align-center justify-center column)
						.subtitle.font-weight-regular.font-italic.grey--text {{text.centrality.fr}}
						v-btn(:class="centrality ? 'red--text' : ''", icon, @click='centrality = !centrality')
							v-icon.fas.fa-map-marker-alt
						
				
				// opinion
				v-card-title.pb-0.pt-0
					span.pl-2.pb-2.grey--text {{text.opinion.fr}}
					v-slider(v-model="feelingSlider" append-icon="far fa-thumbs-up"  @click:append="feelingMore()" prepend-icon="far fa-thumbs-down" @click:prepend="feelingLess()" :min="opinionMin" :max="opinionMax" ticks color="indigo darken-3")
				
				// category
				v-card-title.pb-0.pt-0
					span.pl-2.pb-2.grey--text {{text.category.fr}}
				v-card-title.pb-0.pt-0
					v-layout(align-center justify-space-around column v-for="categorie in get_unlock_categories()")
						v-avatar(size="50" tile)
							img(:src='categorie.icon')
					v-container.pa-0(fluid)
					v-layout(align-center justify-space-around row)
						v-radio-group.ma-0(mandatory v-model='categorieRadio' v-for="categorie in get_unlock_categories()")
							v-radio.ma-0.pl-3.ml-1(:value="categorie.id" :key="categorie.id" color="indigo darken-3")
				
				// attendance
				v-card-title.pb-0.pt-0
					span.pl-2.pb-2.grey--text {{text.attendance.fr}}
					v-slider(v-model="attendanceSlider" append-icon="fas fa-plus-circle"  @click:append="attendanceMore()" prepend-icon="fas fa-minus-circle" @click:prepend="attendanceLess()" :min="attendanceMin" :max="attendanceMax" ticks color="indigo darken-3")
				
				// description
				v-card-title.pb-0.pt-0
					span.pl-2.grey--text Ajouter une description
					v-textarea.full-width(color="indigo darken-3" name="com" :label="text.commentlabel.fr" v-model="usercomment" auto-grow :rules='[rules.required]')
					
				
				// picture
				v-card-title.pb-0.pt-0
					span.pl-2.pb-2.grey--text Ajouter une image
					file-pond.full-width(name="filepond" ref="pond" class="filepond" :label-idle="text.dragdrop.fr" accepted-file-types="image/jpeg, image/png" :files="myFiles" allowRevert instantUpload @init="handleFilePondInit")
					small.pb-2 {{text.requiredhint.fr}}
				
				// exits
				v-card-actions
					v-spacer
					v-btn(flat @click="closeArtifactPanel()" small) {{text.cancel.fr}}
					v-btn(color="indigo darken-3" @click="addArtifact()" small dark) {{text.submit.fr}}
					
</template>

<script>
	// Config imports
	import categoriesOptions from './../assets/categories-options.json'
	import opinionOptions from './../assets/opinion-likert-options.json'
	import attendanceOptions from './../assets/attendance-likert-options.json'

	// Import FilePond
	import vueFilePond from 'vue-filepond';
	// Import plugins
	import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js';
	import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
	// Import styles
	import 'filepond/dist/filepond.min.css';
	import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
	const FilePond = vueFilePond( FilePondPluginFileValidateType, FilePondPluginImagePreview );

export default {
	components : { 
	    // liste des composants utilisés dans la div principale
	    FilePond
	},	
	data() {
		return {
		  	text:{
		  		menutitle:{
	            	fr:'Ajouter du contenu'
	            },
		  		title:{
	            	fr:'Ajouter un titre *'
	            },
	            centrality:{
	            	fr:'Centralité ?'
	            },
	            category:{
	            	fr:'Catégorie'
	            },
	            opinion:{
	            	fr:'Opinion'
	            },
	            attendance:{
	            	fr:'Fréquentation'
	            },
	            commentlabel:{
	            	fr:'Description *'
	            },
	            cancel:{
	              fr:"Annuler"
	            },
	            submit:{
	              fr:"Valider"
	            },
	            requiredhint:{
            		fr:'* Indique que le champs est obligatoire'
          		},
	            dragdrop:{
	              fr:"Glisser déposer votre image ou <span class='filepond--label-action'> Explorer </span>"
	            },
	            require:{
	            	fr:"Ce champs est obligatoire"
	            }
	        },
	        usertitle:"",
	        usercomment:"",
	        feelingSlider:null,
	        attendanceSlider:null,
	        centrality: false,
	        categorieRadio:null,
	        cat:false,
	        categoriesOptions:categoriesOptions,
	        myFiles: [],
	        opinionMin:null,
	        opinionMax:null,
	        attendanceMin:null,
	        attendanceMax:null,
	        reverseAdress:"",
	        refreshColor:"grey--text",
	        refreshIcon:"fas fa-sync-alt",
	        rules: {
	          required: value => !!value || this.text.require.fr,
	        }
		  }
	},
	methods:{
		get_unlock_categories(){
        	let categories = [];
        	let active_categories = this.categoriesOptions.filter(cat => cat.isActive);
        	active_categories.forEach((cat) => {
          		categories.push(cat)
        	})
        	return categories
      	},
        closeArtifactPanel(){
        	Event.$emit('fireCloseArtifactPanel');
        	console.log('##__EMIT ->  fireCloseArtifactPanel__##');
        	this.razArtifactPanel();
	        	
	    },
	    addArtifact(){
			if (this.$refs.form.validate()) {
			let picture;
			if (typeof this.$refs.pond.getFiles()[0] === "undefined"){
				picture="";
			}else {
				picture = this.$refs.pond.getFiles()[0].file
			}
			console.log(this.myFiles)
			console.log(this.$refs.pond.getFiles()[0])
			console.log(this.$refs.pond.getFiles())
			console.log(picture)
			/*let t = this.$refs.pond.getFiles()[0].process(picture,()=>{
				console.log(results)
			});
			*/

			let yposition = window.innerHeight/2;
			let xposition = window.innerWidth/2;

			let submitedPicJson = '{"title":"'+this.usertitle+'","address":"'+this.reverseAdress+'","opinion":"'+this.feelingSlider+'","category":"'+this.categorieRadio+'","usercomment":"'+this.usercomment+'","attendance":"'+this.attendanceSlider+'","centrality":"'+this.centrality+'","picture":"'+picture+'","user":"'+"Jack Black"+'","yposition":"'+yposition+'","xposition":"'+xposition+'"}';
			console.log(JSON.parse(submitedPicJson))
			Event.$emit('fireUploadArtifact', JSON.parse(submitedPicJson));
			console.log('##__EMIT ->  fireUploadArtifact__##');
			this.closeArtifactPanel(); 
			this.razArtifactPanel();
			}
	    },
	    razArtifactPanel(){
	    	this.$refs.form.reset();
	    	this.$refs.pond.removeFile();
	    	this.feelingSlider = (this.opinionMax+1)/2;
	    	this.attendanceSlider = (this.attendanceMax+1)/2;
	    	this.centrality=false;
	    },
	    handleFilePondInit() {
            console.log('FilePond has initialized');
            /*this.FilePond.setOptions({
				server:{
				    url: 'http://localhost:1337',
				    process: './process'
				}
	    	});
	    	*/
        },
        feelingMore(){
        	this.feelingSlider = this.feelingSlider + 1;
        },
        feelingLess(){
        	this.feelingSlider = this.feelingSlider - 1;
        },
        attendanceMore(){
        	this.attendanceSlider = this.attendanceSlider + 1;
        },
        attendanceLess(){
        	this.attendanceSlider = this.attendanceSlider - 1;
        },
        initOpinion(){
        	this.opinionMin = 1;
        	this.opinionMax = opinionOptions.length;
        	this.feelingSlider = (this.opinionMax+1)/2;
        },
        initAttendance(){
        	this.attendanceMin = 1;
        	this.attendanceMax = attendanceOptions.length;
        	this.attendanceSlider = (this.attendanceMax+1)/2;
        },
        refreshAdress(){
        	this.refreshColor = "blue--text";
        	this.refreshIcon = "fas fa-sync-alt fa-spin"
			let yposition = window.innerHeight/2;
			let xposition = window.innerWidth/2;
			Event.$emit('fireGetAddressFromPixels', xposition, yposition);
			console.log('##__EMIT ->  fireGetAddressFromPixels__##');
        }

    },
    mounted(){
    	this.initOpinion();
    	this.initAttendance();

    	Event.$on('fireUpdateAddress', (address) => {
    		this.refreshColor = "grey--text";
        	this.refreshIcon = "fas fa-sync-alt"
    		this.reverseAdress = address;
    	});

    }

}
</script>

<style>
.full-width{
	width:100% !important;
}
.sidebar{
	z-index: 5;
}
</style>