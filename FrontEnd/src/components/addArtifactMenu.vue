<template lang="pug">
v-form(ref="form" lazy-validation)  
  v-card.pt-2

    //First part of the menu : I want to 
    v-card-actions.pa-0
      v-container.pa-0(fluid)
        v-layout(row align-center)
          v-flex(xs4)
            span.pl-2 {{text.iWant.fr}}
          v-flex(xs4)
            v-select.pl-2(color="indigo darken-3" v-model="opinion" :label="text.choose.fr" dense :items="get_unlock_opinions()" required :rules="[rules.required]")
    
    //Second part of the menu : on what 
    v-card-actions.pa-0
      v-container.pa-0(fluid)
        v-layout(row align-center)
          v-flex(xs4)
            span.pl-2 {{text.object.fr}} 
          v-flex(xs4)
            v-select.pl-2(color="indigo darken-3" v-model="categorie" :label="text.choose.fr" dense :items="get_unlock_categories()" required :rules="[rules.required]")

    // Closing buttons 
    v-card-actions
      v-spacer
      v-btn(flat small @click='CloseaddArtifactMenu()') {{text.annuler.fr}} 
      v-btn(color='indigo darken-3', flat small @click='OpenaddArtifactPanel()') {{text.continue.fr}} 
</template>

<script>

// Config imports
import opinionOptions from './../assets/opinion-options.json'
import categoriesOptions from './../assets/categories-options.json'

export default {
  data (){
    return {
      text:{
        iWant:{
          fr:'Je souhaiterai'
          },
          object:{
            fr:'cet élément :'
          },
          annuler:{
            fr:'Annuler'
          },
          continue:{
            fr:'Suivant'
          },
          choose:{
            fr:'Choisir'
          },
          selectrequired:{
            fr:"Option obligatoire"
          }
      },
      opinionOptions:opinionOptions,
      categoriesOptions:categoriesOptions,
      opinion:"",
      categorie:"",
      rules: {
        required: value => !!value || this.text.selectrequired.fr,
      }
   }
 },
  methods:{

    //Get all active opinions from the config.json
    get_unlock_opinions(){
      let opinions = [];
      let active_opinion = this.opinionOptions.filter(opinion => opinion.isActive);
      active_opinion.forEach((opinion) => {
          opinions.push(opinion)
      })
      return opinions
    },

    //Get all active categories from the config.json
    get_unlock_categories(){
      let categories = [];
      let active_categories = this.categoriesOptions.filter(cat => cat.isActive);
      active_categories.forEach((cat) => {
          categories.push(cat)
      })
      return categories
    },

    //close floating menu
    CloseaddArtifactMenu(){
      Event.$emit('fireCloseaddArtifactMenu');
      console.log('##__EMIT ->  fireCloseaddArtifactMenu__##');
      this.$refs.form.reset()
    },

    //Open add artifact panel
    OpenaddArtifactPanel(){
      if(this.$refs.form.validate()){
        Event.$emit('fireOpenaddArtifact', this.categorie, this.opinion);
        console.log('##__EMIT ->  fireOpenaddArtifact '+ this.categorie +' - '+ this.opinion +' __##');
        this.CloseaddArtifactMenu();

      }
    }
  },
  mounted() {
    console.warn('addArtifactMenu.vue loaded')
  }
}
</script>