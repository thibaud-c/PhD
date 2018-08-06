<template lang="pug">

#Survey.sidebar(xs12)
  v-form(ref="form" v-model="valid" lazy-validation)
      v-stepper(v-model="stepNumber" vertical)

        // Step 1
        v-stepper-step(step="1" :complete="stepNumber>1" color="orange darken-3") {{ text.step1_title.fr }} 
        v-stepper-content(step="1")
            // User Info
            v-text-field(v-model="name" :rules="nameRules" :counter="30" :label="text.name.fr" required color="orange darken-3")
            v-text-field(v-model="email" :rules="emailRules" :label="text.email.fr" required color="orange darken-3")
            v-btn(color="orange darken-3" @click="stepNumber = 2" :disabled="!valid" small dark) {{text.continue.fr}}
            v-btn(flat small @click='closeSondage()') {{text.cancel.fr}}
        
        // Step 2
        v-stepper-step(step="2" :complete="stepNumber>2" color="orange darken-3") {{text.surveyParticipation.fr}}
        v-stepper-content(step="2")

          // Mood 1
          v-subheader.pa-0 {{text.contentmentquestion.fr}}
          v-layout(justify-space-around)
            circle-slider(v-model="moodValue" :side="50" progress-color="#FFCC80" :knob-radius="6" knob-color="#EF6C00" :max="5" :min="0" :step-size="1")
            v-icon(:color="moods[moodValue].color") {{moods[moodValue].icon}}
           
          v-btn(color="orange darken-3" @click="stepNumber = 3" :disabled="!valid" small dark) {{text.continue.fr}}
          v-btn(flat @click="stepNumber = 1" small) {{text.previous.fr}}
        
        
        // Step 3
        v-stepper-step(step="3" color="orange darken-3") {{text.validation.fr}}
        v-stepper-content(step="3")

          // Mood 2     
          vue-star(animate="animated jello" color="#E53935")
            i.far.fa-frown(slot="icon" @click="moodEmoji=1" small)
          vue-star.ml-5(animate="animated jello" color="#FDD835")  
            i.far.fa-meh(slot="icon" @click="moodEmoji=2" small)
          vue-star.ml-5.pl-5(animate="animated jello" color="#2E7D32")    
            i.far.fa-smile(slot="icon" @click="moodEmoji=3" small)
          v-subheader.pa-0 {{text.contentmentquestion.fr}}
          br
          // Slider +/-
          v-slider(v-model="feedbackSlider" append-icon="far fa-thumbs-up" prepend-icon="far fa-thumbs-down" step="10" tick-size="1" color="orange darken-3")

          v-btn(color="success" @click="submit()" :disabled="!valid" small dark) {{text.submit.fr}}
          v-btn(flat @click="stepNumber = 2" small) {{text.previous.fr}}


      //v-btn(:disabled="!valid" @click="submit")
        | submit
      //v-btn(@click="clear") clear
      
          v-select(v-model="select" :items="items" :rules="[v => !!v || 'Item is required']" label="Item" required="")
          v-checkbox(v-model="checkbox" :rules="[v => !!v || 'You must agree to continue!']" label="Do you agree?" required="")
</template>

<script>
  import VueStar from 'vue-star'
  import './../assets/CSS/animated.css'
  



  export default {
      components: {
        VueStar
      },
      data (){
        return {
          text:{
                step1_title:{
                  fr:'Informations Participant'
                },
                name:{
                  fr:'Prénom Nom'
                },
                email:{
                  fr:'Adresse Mail'
                },
                continue:{
                  fr:'Suivant'
                },
                cancel:{
                  fr:"Annuler"
                },
                previous:{
                  fr:"Précédent"
                },
                submit:{
                  fr:"Valider"
                },
                surveyParticipation:{
                  fr:"Enquête participative"
                },
                survey3D:{
                  fr:"Outil 3D"
                },
                validation:{
                  fr:"Enquête de contentement"
                },
                contentmentquestion:{
                  fr:"Que pensez vous de l'enquête ?"
                },
                moodLabels:{
                  fr:["sans avis", "pas du tout Satisfait", "pas  Satisfait", "moyen Satisfait", "Satisfait", "très Satisfait"],
                }
            },
            feedbackSlider:5,
            moodEmoji:'',
            tooltip: "always",
            moodValue: 0,
            moodIcon:"fas fa-question",
            moodColor:"grey darken-1",
            moods:[
              {
                icon:"fas fa-question",
                color:"grey darken-1"
              },
              {
                icon:"mdi-smiley-dead",
                color:"red darken-1"
              },
              {
                icon:"far fa-frown",
                color:"deep-orange darken-1"
              },
              {
                icon:"far fa-meh",
                color:"yellow darken-1"
              }
              ,
              {
                icon:"far fa-smile",
                color:"green darken-1"
              }
              ,
              {
                icon:"mdi-emoticon-excited",
                color:"teal darken-1"
              }
            ],


            

          sidebarTitle:'Sondage Participatif',
          stepNumber:1,
          isSondageVisible:true,
          drawer:true,
          valid: true,
          name: '',
          nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 30) || 'Name must be less than 10 characters'
          ],
          email: '',
          emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid'
          ],
          select: null,
          items: [
            'Item 1',
            'Item 2',
            'Item 3',
            'Item 4'
          ],
          checkbox: false
        }
      },
      /** 

      Main Cesium, lancement une fois le composant monté

      */
      mounted() {
        console.warn('Chargement de SurveyForm.vue')
        // ** Display description ** //

        Event.$on('fireDisplayDescription',(data) => {
          this.sidebarTitle = data.cat;
          this.informationtitle = data.title;
          this.informationAuthor = data.author;
          this.informationDate = data.date.toDateString();
          this.informationContent = data.content;
          console.log(data)
          if (data.type === 'UserComment'){

              this.isInformationImage=false;
              this.isInformationText=true;            
            }else{
              this.isInformationImage=true;
              this.isInformationText=false;
            }
          this.isDescriptionVisible=true;
          
        });

        Event.$on('showPreviz',(type,content,pos) => {

          this.previzPositionX=Math.floor(pos.x+5)+'px';
          this.previzPositionY=Math.floor(pos.y+5)+'px';
          this.previzContent=content;
          console.log(type)
          if (type==="UserComment"){
            this.isPrevizImage = false;
            this.isPrevizText = true;
          }else if(type==="Sketch"){
            this.isPrevizImage = false;
            this.isPrevizText = false;
          }else{
            this.isPrevizImage = true;
            this.isPrevizText = false;
          }
          this.isPrevizVisible = true;
 
        });
        Event.$on('hidePreviz',() => {
          this.isPrevizVisible = false;
        });
    },
    methods:{
        submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          axios.post('/api/submit', {
            name: this.name,
            email: this.email,
            select: this.select,
            checkbox: this.checkbox
          })
        }
      },
      clear () {
        this.$refs.form.reset()
      },
      closeSondage(){
        Event.$emit('fireCloseSondagePanel')
        console.error('fireCloseSondagePanel')
      },
      updateView(){
        Event.$emit('fireUpdateCamera', 'example')
        console.error('fireUpdateCamera')
      },
    }
  }
  console.warn('SurveyFrom.vue Loaded')

</script>

<style>
  .sidebar{
    height: calc(100% - 40px);
    position: absolute;
    top:40px;
    right: 0; 
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    background-color: white;
    overflow-y: auto;
    z-index:0;
  }
</style>