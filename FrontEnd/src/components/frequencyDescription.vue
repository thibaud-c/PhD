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
        v-layout.pl-0(row justify-center align-center)
              v-flex(xs9)
                .title.font-weight-bold {{text.freqTitle.fr}}
      
                //address   
                v-layout.pt-3(row align-center)     
                  small.font-italic.grey--text {{address}}

              v-flex(xs3)
                // category
                v-avatar(size="60" tile)
                  img(:src='category')
      
      //frequency
      v-card-title.pb-0.pt-3
        span.pl-2.grey--text.subheading {{text.frequentation.fr}}
        span.pl-2 {{text.duration.fr}}

        

      //duration
      v-card-title.pb-0.pt-3
        span.pl-2.grey--text.subheading {{text.duration.fr}}
        span.pl-2 {{text.duration.fr}}

  
      v-card-actions.pb-0.pt-3
        //comment        
        v-textarea.pl-2.full-width(color="indigo darken-3" name="com" :label="text.commentlabel.fr" v-model="usercomment" auto-grow readonly)

      v-card-title.pa-0.pl-2
        v-layout.pa-0(row justify-start align-center)
          .grey--text le 
          .grey--text.font-weight-bold.pl-1 {{date}}.

      v-card-actions(name="btnmenuCpt")
        v-spacer
        v-btn(color='blue darken-4', flat='flat', @click='close') {{text.close.fr}}
</template>

<script>

  const moment = require('moment');

  export default {
    components : {

    },
    data (){
    	return {
        text:{
          close:{
            fr:'Fermer'
          },
          freqTitle:{
            fr:"Vos pratiques de ce lieu"
          },
          frequentation:{
            fr:"Fréquentation :"
          },
          duration:{
            fr:"Durée :"
          },
          commentlabel:{
            fr:"Commentaire"
          }
        },
        address:"",
        category:"",
        frequency:"",
        duration:"",
        usercomment:"",
        date:""
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
        Event.$emit('fireCloseArtifactDescription');
        console.log('##__EMIT -> fireCloseArtifactDescription__##');
      },
    }, 
    mounted(){
      console.log('Hello There')
      Event.$on('fireShowFrequencyDescription', (data) => {
        console.log("on")
        console.log(data)
        this.address=data.location;
        this.category=data.category;
        this.frequency=data.frequencyLabel;
        this.duration=data.durationLabel;
        this.usercomment=data.comment;

        let datetime = moment(data.date);
        this.date = datetime.format('DD / MM');

      });
    }
  }
</script>

<style>
</style>