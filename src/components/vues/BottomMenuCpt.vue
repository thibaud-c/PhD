<template lang="jade"> 
//rgba(0, 0, 0, 0.6);
//#rootMenu.columns.is-gapless.rootmenu(v-if='isBottomMenu')
  #Bmenu.column.is-2
      ul.panel-block.menulink.has-text-left(v-for='item in items', :class='item.class', @click='onChangeCentralCpt(item.title)')
          li.tabs.is-gapless
            v-icon(dark='') {{ item.icon }}
          {{item.title}}
  #panel.panelstyle.column.is-8(class=('item.class'))
    controltab(v-if='isControl')
    commenttab(v-if='isComment')
    createtab(v-if='isCreate')
    animatetab(v-if='isAnimate')
    settab(v-if='isSet')
  .column.panelstyle

#rootMenu
  #closebutton.delete.closemenu(@click='isBottomMenu = false; isCloseButtonVisible=false', v-show='isCloseButtonVisible')
  div.navbar.is-fixed-bottom
    a.bottomMenu.tooltip(v-for='item in items', :class='item.class', :data-tooltip='item.tooltip', @click='onChangeCentralCpt(item.title);isBottomMenu=true;isCloseButtonVisible=true')
      v-icon.column.is-1 {{ item.icon }}
      |      {{item.title}}
  div.bottomMenuSize(v-if='isBottomMenu')
    #panel.panelstyle.column(class=('item.class'))
      controltab(v-if='isControl', )
      commenttab(v-if='isComment')
      createtab(v-if='isCreate')
      animatetab(v-if='isAnimate')
      settab(v-if='isSet')
    .column.panelstyle
      

  //#panel.panelstyle.column.is-8(class=('item.class'))
    controltab(v-if='isControl')
    commenttab(v-if='isComment')
    createtab(v-if='isCreate')
    animatetab(v-if='isAnimate')
    settab(v-if='isSet')
  //.column.panelstyle
</template>


<script>
  import Controltab from './ControlCentralCpt.vue'
  import Animatetab from './AnimateCentralCpt.vue'
  import Settab from './SetCentralCpt.vue'
  import Commenttab from './CommentCentralCpt.vue'
  import Createtab from './CreateCentralCpt.vue'
  
  export default {
    components : { 
    	Controltab,
      Commenttab,
      Createtab,
      Animatetab,
      Settab
    },
    data () {
      return {
        items: [
          { title: 'Controler', icon: "layers", isVisible: "true", class:"controlstyle", tooltip:'Afficher, Se déplacer ..'},
          { title: 'Participer', icon: 'add_location', isVisible: "false", class:"commentstyle", tooltip:'Parler, Inspirer, Voter ..'},
          { title: 'Créer', icon: 'create', isVisible: "false", class:"createstyle", tooltip:"Dessiner, S'exprimer .."},
          { title: 'Animer', icon: 'play_circle_outline',  isVisible: "false", class:"animatestyle", tooltip:'Filmer, Analyser ..'},
          { title: 'Informations', icon: 'settings', isVisible: "false", class:"setstyle", tooltip:'Comprendre, Rapporter ..'}
        ],
        isControl:true,
        isComment:false,
        isCreate:false,
        isAnimate:false,
        isSet:false,
        isBottomMenu:false,
        isCloseButtonVisible:false,
      }
    },
    mounted() {
      Event.$on('closebottomMenu',() => {
          this.isBottomMenu = false;
        });
      Event.$on('openbottomMenu',() => {
          this.isBottomMenu = true;
        });

    },
    methods:{
      /**
      Méthode de gestion des composants centraux du menu : affiche ou désaffiche ces derniers

      @param activ_item_name : (string) Nom du composant
      */
      onChangeCentralCpt(activ_item_name){
        //desactive tous les composants
        this.isControl=false;
        this.isComment=false;
        this.isCreate=false;
        this.isAnimate=false;
        this.isSet=false;
        //affiche celui donné en paramètre (réception de l'event @Click)
        switch(activ_item_name){
          case "Controler":
             this.isControl=true;
             break;
          case "Participer":
             this.isComment=true;
             break;
          case "Créer":
             this.isCreate=true;
             break;
          case "Animer":
             this.isAnimate=true;
             break;
          case "Informations":
             this.isSet=true;
             break;
        }
      }
    }
  }
  console.warn('Chargement de BottomMenuCpt.vue')
</script>

<style>
  .bottomMenuSize{
    height:30%;
    width:100%;
    z-index: 3;
    position: fixed;
  }
  .panelstyle{
    padding:0px;
  }
  .closemenu{
    position: fixed;
    top:68%;
    left:75%;
    z-index: 4;
    background-color: #cc0000;
  }
  .closemenu:hover{
    background-color: #ff0000;
  }
  .navbar{
    min-height: 0px;
    background-color: rgba(1,1,1,0);
    z-index: 4 !important;
  }
  .bottomMenu{
    padding:2px;
    color:white;
    text-align: left;
    border-color: rgba(1,1,1,1);
    border-width: 1px;
  }
  .menulink{
    color: #fff;
    border:0px;
  }
  .animatestyle{
    background-color:#C6E2E9;
  }
  .animatestyle:hover{
    background-color:#F4F9FB;
  }
  .controlstyle{
    background-color:#C5AFA4;
  }
  .controlstyle:hover{
    background-color:#F4F0EE;
  }
  .setstyle{
    background-color:#FFCAAF;
  }
  .setstyle:hover{
    background-color:#FFF5F0;
  }
  .createstyle{
    background-color:#82968C;
  }
  .createstyle:hover{
    background-color:#E8EBEA;
  }
  .commentstyle{
    background-color:#CC7E85;
  }
  .commentstyle:hover{
    background-color:#F5E7E8;
  }
</style>