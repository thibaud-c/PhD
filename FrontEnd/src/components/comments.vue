<template lang="pug">
#comments
	v-form(ref="form" v-model="commentvalidation")
		v-list-tile-content
			.caption.font-weight-thin(color="grey darken-2") {{text.title.fr}} 
		v-list-tile-content
			v-container.pa-2(grid-list-md)
				v-layout(wrap)
					v-flex(xs12 sm6)
						v-select.pb-2.pt-3(color="cyan accent-3" :items="getOpinionOptions()" :label="text.opinionlabel.fr" v-model="opinion" dense small required :rules="rules")
					v-flex(xs12 sm6)
						v-select.pb-2.pt-3(color="cyan accent-3" :items="getCategorieOptions()" :label="text.categorielabel.fr" v-model="categorie" dense small required :rules="rules")
		v-list-tile-content
			v-text-field.pb-4.pt-3(:label='text.keywords.fr', color="cyan accent-3" v-model="keywords", hint='test 2 différents' persistent-hint)
		v-list-tile-content
			v-textarea.full-width.pb-2.pt-2(color="cyan accent-3" name="com" :label="text.commentlabel.fr" v-model="usercomment" auto-grow required :rules="rules" hint="This field uses counter prop")
			
		v-list-tile-content
			small.pl-2 {{text.requiredhint.fr}}
			v-layout.pt-5(justify-space-around)
				v-btn(color="cyan accent-3" @click="addComment()" small :disabled="!commentvalidation") {{text.submit.fr}}
				v-btn(flat @click="closeCommentsPanel(); razCommentPanel()" small) {{text.cancel.fr}}
</template>

<script>
	// Config imports
	import opinionOptions from './../assets/opinion-options.json'
	import categoriesOptions from './../assets/categories-options.json'

export default {
	props: ['xposition','yposition'],
	data () {
	  return {
	  	text:{
	  		title:{
            	fr:'Catégorisez votre publication :'
            },
            opinionlabel:{
            	fr:'Opinion *'
            },
            categorielabel:{
            	fr:'Catégorie *'
            },
            commentlabel:{
            	fr:'Votre commentaire *'
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
            requiredhint:{
            	fr:'* Indique que le champs est obligatoire'
          	}
        },

        opinion:"",
        categorie:"",
        usercomment:"",
        commentvalidation:false,
        keywords:"",
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
		closeCommentsPanel(){
			console.error('fireCloseCommentsPanel')
        	Event.$emit('fireCloseCommentsPanel')
      	},
      	addComment(event){
      		if (this.$refs.form.validate()) {
			      let submitedComJson = '{"opinion":"'+this.opinion+'","categorie":"'+this.categorie+'","usercomment":"'+this.usercomment+'","keywords":"'+this.keywords+'","yposition":'+this.yposition+',"xposition":'+this.xposition+'}'
			      console.log(submitedComJson)
			      Event.$emit('fireAddComment', JSON.parse(submitedComJson));
			      console.log('##__EMIT ->  fireAddComment__##');

			      this.closeCommentsPanel(); 
			      this.razCommentPanel();
			}
	    },
	    razCommentPanel(){
	    	this.$refs.form.reset()
	    }
	}
}

</script>

<style>
.full-width{
	width:100% !important;
}
</style>