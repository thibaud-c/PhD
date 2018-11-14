<template lang="pug">
#ParticipationMenu
  v-card(v-if='infodialog' v-model='infodialog', max-width='350', hide-overlay)
      v-tabs(v-model='infotabs', color='deep-purple darken-4', dark, slider-color='white', height="25")
        v-tab(v-for='(tabs,index) in get_information_tabs()', :key='index', ripple) {{tabs.title}}
        v-tab-item(v-for='(tabs,index) in get_information_tabs()', :key='index')
          v-card(flat)
            v-card-text(v-html="tabs.description")
            v-card-text.no-border
              
              v-progress-linear.no-border(color='secondary', height='2', value='15')
            v-card-actions.no-border
              v-spacer
              v-btn(color='deep-purple darken-4', flat='flat', @click='infodialog = false') fermer
              v-btn(color='deep-purple darken-4', flat='flat', @click='infodialog = true') Oui
</template>

<script>
import tabsList from './../assets/information-tabs.json'

export default {
  data (){
  	return {
    	infodialog:true,
        infotabs:0,
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
    cancel() {
      this.formOpen = false;
      this.resetForm();
    }
  }
}
</script>

<style>
.no-border{
  padding:0 !important;
  margin:0 !important;
}

*{
  margin: 0;
  padding: 0;
}
body, html{
  height: 100%;
  background-color: #2FB0B5;
} 
.navTrigger {
  cursor: pointer;
  width: 30px; 
  height: 25px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  i {
    background-color: #fff;
    border-radius: 2px;
    content: '';
    display: block;
    width: 100%;
    height: 4px;
  }
  i:nth-child(1) {
    -webkit-animation:outT 0.8s backwards;
    animation:outT 0.8s backwards;
    -webkit-animation-direction:reverse;
    animation-direction:reverse;
  }
  i:nth-child(2) {
    margin: 5px 0;
    -webkit-animation:outM 0.8s backwards;
    animation:outM 0.8s backwards;
    -webkit-animation-direction:reverse;
    animation-direction:reverse;
  }
  i:nth-child(3) {
    -webkit-animation:outBtm 0.8s backwards;
    animation:outBtm 0.8s backwards;
    -webkit-animation-direction:reverse;
    animation-direction:reverse;
  }
  &.active {
    i:nth-child(1) {
      -webkit-animation:inT 0.8s forwards;
      animation:inT 0.8s forwards;
    }
    i:nth-child(2) {
      -webkit-animation:inM 0.8s forwards;
      animation:inM 0.8s forwards;
    }
    i:nth-child(3) {
      -webkit-animation:inBtm 0.8s forwards;
      animation:inBtm 0.8s forwards;
    }
  }
}
@-webkit-keyframes inM{
50%{-webkit-transform:rotate(0deg);}
100%{-webkit-transform:rotate(45deg);}
}
@keyframes inM{
50%{transform:rotate(0deg);}
100%{transform:rotate(45deg);}
}

@-webkit-keyframes outM{
50%{-webkit-transform:rotate(0deg);}
100%{-webkit-transform:rotate(45deg);}
}
@keyframes outM{
50%{transform:rotate(0deg);}
100%{transform:rotate(45deg);}
}

@-webkit-keyframes inT{
0%{-webkit-transform: translateY(0px) rotate(0deg);}
50%{-webkit-transform: translateY(9px) rotate(0deg);}
100%{-webkit-transform: translateY(9px) rotate(135deg);}
}
@keyframes inT{
0%{transform: translateY(0px) rotate(0deg);}
50%{transform: translateY(9px) rotate(0deg);}
100%{transform: translateY(9px) rotate(135deg);}
}

@-webkit-keyframes outT{
0%{-webkit-transform: translateY(0px) rotate(0deg);}
50%{-webkit-transform: translateY(9px) rotate(0deg);}
100%{-webkit-transform: translateY(9px) rotate(135deg);}
}
@keyframes outT{
0%{transform: translateY(0px) rotate(0deg);}
50%{transform: translateY(9px) rotate(0deg);}
100%{transform: translateY(9px) rotate(135deg);}
}

@-webkit-keyframes inBtm{
0%{-webkit-transform: translateY(0px) rotate(0deg);}
50%{-webkit-transform: translateY(-9px) rotate(0deg);}
100%{-webkit-transform: translateY(-9px) rotate(135deg);}
}
@keyframes inBtm{
0%{transform: translateY(0px) rotate(0deg);}
50%{transform: translateY(-9px) rotate(0deg);}
100%{transform: translateY(-9px) rotate(135deg);}
}

@-webkit-keyframes outBtm{
0%{-webkit-transform: translateY(0px) rotate(0deg);}
50%{-webkit-transform: translateY(-9px) rotate(0deg);}
100%{-webkit-transform: translateY(-9px) rotate(135deg);}
}
@keyframes outBtm{
0%{transform: translateY(0px) rotate(0deg);}
50%{transform: translateY(-9px) rotate(0deg);}
100%{transform: translateY(-9px) rotate(135deg);}
}

</style>