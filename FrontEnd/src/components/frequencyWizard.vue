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
#Frequency
  //Wizard artifacts
  v-card(hide-overlay)
    v-card(flat)
      // Tile Title
      v-card-title
        .title.font-weight-bold {{text.freqTitle.fr}}
      
      //adress        
      adressSmallComponents

      //frequency
      v-card-title.pb-0.pt-3
        span.pl-2.grey--text.subheading {{text.frequentation.fr}}
      v-card-action.pb-0.pt-0(name="frequencyCpt")
        v-slider.pr-2.pl-2(v-model="frequency" append-icon="fas fa-users" prepend-icon="fas fa-user" color="indigo darken-3" :max="frequencyLabels.length - 1" step="1" tick-size="2" thumb-label thumb-size="64")
          template(slot='thumb-label', slot-scope='props')
            span {{getfrequency(props.value) }}

      //duration
      v-card-title.pb-0.pt-3
        span.pl-2.grey--text.subheading {{text.duration.fr}}
      v-card-action.pb-0.pt-0(name="durationCpt")
        v-slider.pr-2.pl-2(v-model="duration" prepend-icon="fas fa-walking" append-icon="fas fa-male" color="indigo darken-3" :max="durationLabels.length - 1" step="1" tick-size="2" thumb-label thumb-size="64")
          template(slot='thumb-label', slot-scope='props')
            span {{getduration(props.value)}}

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
        freqTitle:{
          fr:"Ajouter vos pratiques"
        },
        frequentation:{
          fr:"Fréquentez-vous souvent ce lieu ?"
        },
        duration:{
          fr:"Pendant combien de temps ?"
        }
      },
      address:"",
      position:"",
      frequency:"",
      frequencyLabels:["Sans avis", "jamais", "1/année", "1/mois", "1/semaine", "1/jour"],
      duration:"",
      durationLabels:["Sans avis", "< 10min", "< 30min", "< 1h", "< 3h", "> 3h"],
      comment:""
	}
  },
  methods: {
    getfrequency(val) {
      return this.frequencyLabels[val]
    },
    getduration(val) {
      return this.durationLabels[val]
    },
    close(){
      Event.$emit('fireCloseArtifactWizard');
      console.log('##__EMIT ->  fireCloseArtifactWizard__##');
    },
    save(){
      let data = {
        location : this.address,
        frequency : this.frequency,
        frequencyLabel : this.frequencyLabels[this.frequency],
        duration: this.duration,
        durationLabel : this.durationLabels[this.duration],
        comment: this.comment
      }
      Event.$emit('CreateFrequencyArtifact', this.position, data);
      console.log('##__EMIT ->  CreateFrequencyArtifact__##');
      this.close()
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