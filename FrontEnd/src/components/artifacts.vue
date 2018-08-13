<template lang="pug">
#import
	v-navigation-drawer.sidebar(absolute permanent right hide-overlay clipped)
		v-form(ref="form" lazy-validation)
			v-card(flat)
				v-card-title
					.title.font-weight-bold {{text.title.fr}}
					v-avatar.ml-5(size="40" tile :color="opinion")
						img(:src='categorie')
				v-card-title.pb-0.pt-0
					span.pl-2.pb-2.grey--text Ajouter une image
					file-pond.full-width(name="filepond" ref="pond" class="filepond" :label-idle="text.dragdrop.fr" accepted-file-types="image/jpeg, image/png" :files="myFiles" allowRevert instantUpload)
				v-card-title.pb-0.pt-0
					span.pl-2.grey--text Ajouter une description
					v-textarea.full-width(color="indigo darken-3" name="com" :label="text.commentlabel.fr" v-model="usercomment" auto-grow :rules='[rules.required]')
					small.pb-2 {{text.requiredhint.fr}}
				v-card-actions
					v-spacer
					v-btn(color="indigo darken-3" @click="addArtifact()" small dark) {{text.submit.fr}}
					v-btn(flat @click="closeArtifactPanel()" small) {{text.cancel.fr}}
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
	props: ['xposition','yposition','categorie','opinion'],
	data() {
		return {
		  	text:{
		  		title:{
	            	fr:'Ajouter du contenu'
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
	        usercomment:"",
	        myFiles:"",
	        rules: {
	          required: value => !!value || this.text.require.fr,
	        }
		  }
	},
	methods:{
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

            	console.log(this.$refs.pond.getFiles()[0])
            	console.log(picture)
			}
            

			let submitedPicJson = '{"opinion":"'+this.opinion+'","category":"'+this.categorie+'","usercomment":"'+this.usercomment+'","picture":"'+picture+'","user":"'+"Jack Black"+'","yposition":"'+this.yposition+'","xposition":"'+this.xposition+'"}';
			Event.$emit('fireUploadArtifact', JSON.parse(submitedPicJson));
			console.log('##__EMIT ->  fireUploadArtifact__##');
			this.closeArtifactPanel(); 
			this.razArtifactPanel();
			}
	    },
	    razArtifactPanel(){
	    	this.$refs.form.reset();
	    	this.$refs.pond.removeFile();
	    }
      },

	
}
</script>

<style>
.full-width{
	width:100% !important;
}
</style>