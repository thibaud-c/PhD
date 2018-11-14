<!--
MIT License

Copyright (c) [2018] [Thibaud Chassin]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->
<template lang="pug">
#Customs
  //Wizard artifacts
  v-card(v-if='iscreation' v-model='iscreation' hide-overlay)
    v-card(flat)
      // Tile Title
      v-card-title
        .title.font-weight-bold {{text.custTitle.fr}}
      
      //adress        
      adressSmallComponents

      //opinion
      v-card-title.pb-0.pt-3
        span.pl-2.grey--text.subheading {{text.opinion.fr}}
      v-card-action.pb-0.pt-0(name="opinionCpt")
        v-slider.pr-2.pl-2(v-model="opinion" prepend-icon="far fa-frown" append-icon="far fa-smile" color="indigo darken-3" :max="4" step="1" tick-size="2")

      //motives
      v-card-title.pb-0.pt-3
        span.pl-2.grey--text.subheading {{text.motives.fr}}
      v-card-action.pb-0.pt-0(name="motivesCpt")
        v-layout(row wrap)
          v-flex.pb-0.pt-0(xs6 row v-for="(motiv,index) in motivesLabels")
            //v-if -> Permet d'afficher les motifs + si le curseur est + et inversement 
            v-checkbox.pr-2.pl-3.pb-0.pt-0.mb-0(:label="motiv" v-model="motivesValues[index]" hide-details color="indigo darken-3" v-if="index<6 && (opinion<=2 && Boolean(index&1) || opinion>=2 && !Boolean(index&1)) || index==6")

      //comment        
      commentsSmallComponents

      v-card-actions(name="btnmenuCpt")
        v-spacer
        v-btn(color='blue darken-4', flat='flat', @click='close') {{text.close.fr}}
        v-btn(color='blue darken-4' dark @click='save') {{text.validate.fr}}
</template>

<script>

import adressSmallComponents from './parts/adress.vue'
import commentsSmallComponents from './parts/comments.vue'

export default {
  components : {
    adressSmallComponents,
    commentsSmallComponents
  },
  data (){
  	return {
      text:{
         close:{
           fr:'Annuler'
        },
        validate:{
           fr:'Valider'
        },
        custTitle:{
          fr:"Ajouter vos expériences"
        },
        opinion:{
          fr:"Que pensez-vous de ce lieu ?"
        },
        motives:{
          fr:"Pour quel(s) motif(s) ?"
        }
      },
    	iscreation:true,
      address:"",
      position:"",
      opinion:"2",
      motivesLabels:["Beau", "Laid", "Calme", "Bruyant", "Animée", "Enuyeux", "Souvenir"],
      motivesValues:[false, false, false, false, false, false, false],
      motivation:false,
      comment:"",
	}
  },
  methods: {
    close(){
      Event.$emit('fireCloseArtifactWizard');
      console.log('##__EMIT ->  fireCloseArtifactWizard__##');
      this.razArtifactPanel();
    },
    save(){
      let checkedmotives = []
      for (let mot in this.motivesValues){
        //get checked motives
        if (this.motivesValues[mot]){
          //get display motives
          if(mot<6 && (this.opinion<=2 && Boolean(mot&1) || this.opinion>=2 && !Boolean(mot&1)) || mot==6){
            checkedmotives.push(this.motivesLabels[mot])
          }
        }
      }

      let data = {
        location : this.address,
        opinion : this.opinion,
        motive: this.motivesValues,
        motiveLabels : checkedmotives,
        comment: this.comment
      }
      Event.$emit('CreateCustomArtifact', this.position, data);
      console.log('##__EMIT ->  CreateCustomArtifact__##');
      this.close();

    },
  }, 
  mounted(){
    Event.$on('fireUpdateAddressWizard', (updatedAddress,clickposition) => {
      this.address=updatedAddress;
      this.position=clickposition;
    });
    Event.$on('fireUpdateComment', (updatedcomment) => {
      this.comment=updatedcomment;
    });
  }
}
</script>

<style>

</style>