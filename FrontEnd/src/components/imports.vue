<template lang="pug">
#import
	v-form(ref="form" v-model="picturevalidation" lazy-validation)
		v-list-tile-content
			.caption.font-weight-thin(color="grey darken-2") {{text.title.fr}}
		v-list-tile-content.pb-2.pt-3
			v-container.pa-2(grid-list-md)
				v-layout(wrap)
					v-flex(xs12 sm6)
						v-select.pb-2.pt-3(color="cyan accent-3" :items="getOpinionOptions()" :label="text.opinionlabel.fr" v-model="opinion" dense small required :rules="rules")
					v-flex(xs12 sm6)
						v-select.pb-2.pt-3(color="cyan accent-3" :items="getCategorieOptions()" :label="text.categorielabel.fr" v-model="categorie" dense small required :rules="rules")
		v-list-tile-content.pt-3
			file-pond.full-width(name="filepond" ref="pond" class="filepond" :label-idle="text.dragdrop.fr" accepted-file-types="image/jpeg, image/png" :files="myFiles" allowRevert)
		v-list-tile-content
			v-text-field.pb-4.pt-3(:label='text.keywords.fr', color="cyan accent-3" v-model="keywords", hint='test 2 différents' persistent-hint)
		v-list-tile-content.pb-2.pt-2
			v-textarea.full-width(color="cyan accent-3" name="com" :label="text.commentlabel.fr" v-model="usercomment" auto-grow)
		v-list-tile-content.pt-5
			v-layout(justify-space-around)
				v-btn(color="cyan accent-3" @click="addPicture()" small dark) {{text.submit.fr}}
				v-btn(flat @click="closeUploadsPanel()" small) {{text.cancel.fr}}
    

</template>

<script>
	// Config imports
	import opinionOptions from './../assets/opinion-options.json'
	import categoriesOptions from './../assets/categories-options.json'

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

 		
	props: ['xposition','yposition'],
	data() {
		return {
		  	text:{
		  		title:{
	            	fr:'Catégorisez votre publication :'
	            },
	            opinionlabel:{
	            	fr:'Opinion'
	            },
	            categorielabel:{
	            	fr:'Catégorie'
	            },
	            commentlabel:{
	            	fr:'Description (optionnel)'
	            },
	            cancel:{
	              fr:"Annuler"
	            },
	            submit:{
	              fr:"Valider"
	            },
	            keywords:{
	            	fr:'Ajouter des mots-clés'
	            },
	            dragdrop:{
	              fr:"Glisser déposer votre image ou <span class='filepond--label-action'> Explorer </span>"
	            },
	        },
	        opinion:"",
	        categorie:"",
	        usercomment:"",
	        picturevalidation:"",
	        keywords:"",
	        myFiles:"",
	        rules: [
	            v => !!v || 'Champs obligatoire',
	        ],
		  }
	},
	methods:{
		getOpinionOptions(){
			let opinions=[];
			let activeOpinions = opinionOptions.filter(opinion => opinion.isActive)
			activeOpinions.forEach((opinion) => {
					opinions.push(opinion)
			})

			return opinions
		},
		getCategorieOptions(){
			let categories=[];
			let activeCategories = categoriesOptions.filter(categorie => categorie.isActive)
			activeCategories.forEach((categorie) => {
					categories.push(categorie)
			})

			return categories
		},
		handleFilePondInit: function() {
            console.log('FilePond has initialized');

            // example of instance method call on pond reference
            this.$refs.pond.getFiles();
        },
        closeUploadsPanel(){
			console.error('fireCloseUploadsPanel')
        	Event.$emit('fireCloseUploadsPanel')
        	
      },
      addPicture(){
      	console.log(this.$refs.pond.getFiles()[0].load());
		if (this.$refs.form.validate()) {
			let submitedPicJson = '{"opinion":"'+this.opinion+'","categorie":"'+this.categorie+'","usercomment":"'+this.usercomment+'","keywords":"'+this.keywords+'","picture":"'+this.$refs.pond.getFiles()+'","yposition":'+this.yposition+',"xposition":'+this.xposition+'}'
			      console.log(submitedPicJson)
			      Event.$emit('fireUploadPicture', JSON.parse(submitedPicJson));
			      console.log('##__EMIT ->  fireUploadPicture##');
			      console.log(this.$refs.pond.getFiles())
			      this.closeUploadsPanel(); 
			      this.razUploadsPanel();
			}
	    },
	    razUploadsPanel(){
	    	this.$refs.form.reset()
	    }
      },

	
}

</script>

<style>
.full-width{
	width:100% !important;
}
</style>