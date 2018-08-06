<template lang="pug">
#descriptions
	v-navigation-drawer.sidebar(v-model='drawer' absolute permanent right hide-overlay clipped)
		v-tabs(v-model='connexiontab', color='indigo lighten-4', dark, slider-color='yellow' height="30")
			// login tab 
			v-tab(ripple) {{text.desciption.fr}}
			v-tab-item  
				v-card
					v-card-text.pa-3
						.title.font-weight-bold {{author}}
						v-text-field.text-xs-center(:value="keywords" :label="text.keywords.fr" flat readonly small)
						v-container.pa-2(grid-list-md)
							v-layout(wrap justify-end)
								v-flex(xs8 sm4)
									v-icon(:color="iconColorOpinion" small) {{iconOpinion}}
								v-flex(xs8 sm4)
									v-icon(small) {{iconcategorie}}
								v-flex(xs8 sm4) 
									.caption.font-weight-light.font-italic {{date}}
						v-card-media(v-shoW="showimage" :src='picture', height='200px')
						br
						v-textarea(outline name='input-7-4', :value='usercomment' readonly)
						v-container.pa-2(grid-list-md)
							v-layout(wrap justify-center row align-center)
								v-btn(:class="like ? 'red--text' : ''", icon, @click='like = !like; addlikes()')
									v-icon favorite
								.subtitle {{likenumber}}

									
			v-tab(ripple) {{text.discussion.fr}}
			v-tab-item  
				v-card
					v-card-title.pb-1
						span.title.font-weight-bold.text-md-center {{text.commentlabel.fr}}
					v-card-text.pa-0
						v-container.pa-2(grid-list-md)
							v-layout(wrap)
								v-flex(xs12 sm6 md4)
									
								v-flex(xs12 sm6 md4)
			v-tab(ripple @click='closepaneldescription()') x
			//v-btn(color='error' flat @click='closepaneldescription()') Fermer				
         
</template>

<script>
	// Config imports
	import opinionOptions from './../assets/opinion-options.json'
	import categoriesOptions from './../assets/categories-options.json'

	const moment = require('moment');
	
export default {

	props:['information'],
	data () {
	  return {
	  	text:{
	  		desciption:{
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
            requiredhint:{
            	fr:'* Indique que le champs est obligatoire'
          	},
        },
        author:"",	
        like: false,
        likenumber:12,
        opinion:"",
        categorie:"",
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
        picture:"https://cdn.vuetifyjs.com/images/cards/desert.jpg",
        showimage:true,
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
		}
	},
	mounted(){
		Event.$on('fireUpdateDescription', (data) => {  
            this.author = data.author;
            this.usercomment = data.content.usercomment;
            this.keywords = data.content.keywords;

            let datetime = moment(data.date);
            this.date = datetime.format('DD / MM');

            //Filtre sur les opinions
            let opinion = opinionOptions.filter(opin => opin.text === data.content.opinion)[0];
            this.iconOpinion= opinion.icon;
            this.iconColorOpinion= opinion.color;

            //Filtre sur les categories
            let categorie = categoriesOptions.filter(cat => cat.text === data.content.categorie)[0];
            this.iconcategorie= categorie.icon;

            if (data.cat !== "Commentaire utilisateur"){
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