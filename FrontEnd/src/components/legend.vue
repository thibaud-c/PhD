<template lang="pug">
#Legend
  v-navigation-drawer.sidebar(absolute permanent right hide-overlay clipped)
    v-card(flat)
      v-card-title
        .title.font-weight-bold {{text.title.fr}}
			
      //Contributions
      span.pl-2.grey--text {{text.review.fr}}
      div(v-for="(opinion,key) in get_unlock_opinions()")
        v-card-actions.pa-0.pl-4
          v-checkbox(flat small :color='opinion.color' :label="opinion.text" v-model="opinion.showlayer" height="0")
          v-btn.mr-5(icon small flat :color='opinion.color' @click='opinion.showinfo = !opinion.showinfo')
            v-icon {{ opinion.showinfo ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
        v-slide-y-transition
          v-card-text.pa-0.pl-2(v-show='opinion.showinfo') {{opinion.description}}

      //Thématiques
      span.pl-2.mt-5.grey--text {{text.topic.fr}}
      div(v-for="categorie in get_unlock_categories()")
        v-card-actions.pa-0.pl-4
          v-checkbox(flat small :label="categorie.text" color="indigo darken-3" v-model="categorie.showlayer" height="0")
          v-btn.mr-5(icon small flat color="indigo darken-3" @click='categorie.showinfo = !categorie.showinfo')
            v-icon {{ categorie.showinfo ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
        v-avatar.pl-5.ml-4(size="30" tile)
          img(:src='categorie.icon')
        v-slide-y-transition
          v-card-text.pa-0.pl-2.pt-2(v-show='categorie.showinfo') {{categorie.description}}
      v-card-actions
        v-spacer
        v-btn(color='indigo darken-3' flat @click='closeLegend()') {{text.close.fr}}	
				
</template>

<script>
	// Config imports
	import opinionOptions from './../assets/opinion-options.json'
	import categoriesOptions from './../assets/categories-options.json'
  



  export default {
      data (){
        return {
          text:{
                title:{
                  fr:'Légende :'
                },
                review:{
                  fr:'Contributions :'
                },
                topic:{
                  fr:'Thématiques :'
                },
                close:{
                  fr:'Fermer'
                },
            },
          opinionOptions:opinionOptions,
          categoriesOptions:categoriesOptions,
        }
      },
    methods:{
    	get_unlock_opinions(){
        	let opinions = [];
        	let active_opinion = this.opinionOptions.filter(opinion => opinion.isActive);
        	active_opinion.forEach((opinion) => {
          		opinions.push(opinion)
        	})
        	console.log(opinions)
        	return opinions
      	},
      	get_unlock_categories(){
        	let categories = [];
        	let active_categories = this.categoriesOptions.filter(cat => cat.isActive);
        	active_categories.forEach((cat) => {
          		categories.push(cat)
        	})
        	return categories
      	},
        closeLegend(){
          Event.$emit('firecloseMenu');
          console.log('##__EMIT ->  firecloseMenu__##')
        }
    }
  }
  console.warn('Legend.vue Loaded')

</script>

<style>
  .sidebar{
    height: calc(100% - 40px) !important;
    top:40px !important;
  }
</style>