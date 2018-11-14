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
#ParticipationMenu
  //Icon position for the menu -> open menu
  v-avatar.closeParticipation-position.closemenu-icon(size="30" tile v-if="!infodialog"  @click='infodialog = true')
    img(src="/icons/menu.png")

  //Icon position for the menu -> close menu
  v-avatar.closeParticipation-position.closemenu-icon.crossRotate(size="30" tile v-if="infodialog")
    img(src="/icons/close.png" @click='infodialog = false')

  //Wizard participation
  v-card.wizard-position(v-if='infodialog' v-model='infodialog', width='350' hide-overlay)
      v-tabs(v-model='infotabs', color='white', lighten, slider-color='blue darken-4', height="25")
        v-tab(v-for='(tabs,index) in get_information_tabs()', :key='index', ripple @click="infotabs=index;updateOptionsCategories();updateSteper()") {{tabs.title}}
        v-tab-item(v-for='(tabs,index) in get_information_tabs()', :key='index')
          v-card.no-border(flat)
            v-card-text(v-html="tabs.description")
            v-card-text.no-border
              
              v-progress-linear.no-border(v-model='valuesteper' color='blue darken-4', height='2', :value='valuesteper')
            v-card-actions.no-border
              v-spacer
              v-btn(color='blue darken-4', flat='flat', @click='infodialog = false;desactivateButtonCategories()') {{text.close.fr}}
              v-btn(color='blue darken-4', flat='flat', @click='nextstep') {{text.next.fr}}

  //Icon de selection
  v-tooltip(right v-for="(cat,index) in buttons")
    v-btn.options-button.optionsfocus(slot="activator" v-if="infodialog" :color="cat.color" :style="getOptionsStyle(index)" ref="optionButtons" @click='toggleActiveClass(index);cat.action' :class="{active: cat.active}")
      v-avatar(size="40" tile)
        img(:src="cat.icon")
    span {{cat.tooltip}}
</template>

<script>
import tabsList from './../assets/information-tabs.json'


export default {
  data (){
  	return {
      text:{
         close:{
           fr:'Ne pas Participer'
        },
        next:{
           fr:'étape suivante'
        },
      },
      buttons:[],
    	infodialog:true,
      infotabs:0,
      menuopen:true,
      valuesteper:25
	}
  },
  methods: {
    get_information_tabs(){
      let tabs = [];
      let active_tabs = tabsList.filter(tab => tab.isActive);
      active_tabs.forEach((tab) => {
        tabs.push(tab)
      })
      return tabs
    },
    nextstep(){
      this.infotabs += 1;
      if(this.infotabs < tabsList.filter(tab => tab.isActive).length){
        this.updateSteper()
        this.updateOptionsCategories();
      }
    },
    getOptionsStyle(index){
      //top wizard position + (icon size +5) * number of option
      let top = 60+(30+7)*index;
      //left wizard position + wizard size
      let left = 25+350;
      return "top:"+top+"px;left:"+left+"px;";
    },
    updateSteper(){
      this.valuesteper = (this.infotabs + 1) * 100/tabsList.filter(tab => tab.isActive).length;
    },
    updateOptionsCategories(){
      let options = tabsList[this.infotabs].options;

      //desactiv context
      Event.$emit('fireCloseArtifactWizard');
      Event.$emit('fireStopListenToRClick');
      console.log('##__EMIT ->  fireDefaultContext__##');

      if (typeof options !== "undefined"){
        this.buttons = options
        this.desactivateButtonCategories()
        return
      }
      this.buttons = [];

    },
    toggleActiveClass(index){
      this.desactivateButtonCategories()
      this.buttons[index].active=true;
      this.buttons[index].color="indigo darken-3";

      //active category -> change context
      this.updateContext(this.infotabs,this.buttons[index].tooltip)
    },
    desactivateButtonCategories(){
      for(let i=0;i<this.buttons.length;i++){
        this.buttons[i].active = false;
        this.buttons[i].color="white"
      }
    },
    updateContext(tab,category){
      console.log('updateContext')
      console.log(category)
      switch(tab){
        //Frequency context
        case 1:
          Event.$emit('fireStartListenToRClick',category);
          Event.$emit('fireUpdateContextToFrequency');
          console.log('##__EMIT ->  fireFrequencyContext__##');
          break
        //opinion context
        case 2:
          Event.$emit('fireStartListenToRClick',category);
          Event.$emit('fireUpdateContextToCustom');
          console.log('##__EMIT ->  fireFrequencyContext__##');
          break
      }
    }
  }, 
  mounted(){
    this.updateOptionsCategories();
  }

}
</script>

<style>
.closeParticipation-position{
  position: fixed !important; /* postulat de départ */
  top: 65px; 
  left: 40px; /* à 50%/50% du parent référent */
  transform: translate(-50%, -50%); /* décalage de 50% de sa propre taille */
  z-index: 2;
}
.closemenu-icon{
  cursor: pointer;
}
.wizard-position{
  top: 25px; 
  left: 40px;
  z-index: 1;
}
.options-button{
  position: fixed !important;
  z-index: 0;
}
.active{
  background-color:blue !important;
}
</style>