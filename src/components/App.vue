<template lang="jade">
<!-- Création de la div principale Cesium et lancement des composants : cesiumContainer -->
#AppRootcolumns.rootapp.has-navbar-fixed-bottom
  cesiumcontainer.cesium.is-widescreen.full  
  infoSidebar
  floatingoptions
  quickMenu.is-clickable.add-visible(:menu-count='count_unlock_menu()', :icon-class='get_unlock_icons()', :menu-url-list='get_unlock_actions()', :position='position', :backgroundColor='color')
  menuScene(v-show='is_menu_active(0)')
  menuProject(v-show='is_menu_active(1)')
  menuParticipation(v-show='is_menu_active(2)')
  menuSondage(v-show='is_menu_active(3)')


</template>

<script>
  import cesiumcontainer from './vues/cesiumCpt.vue'
  import floatingoptions from './vues/FloatingMenuCpt.vue'
  import quickMenu from './vues/QuickMenu.vue'
  import menuScene from './vues/MenuSceneCpt.vue'
  import menuProject from './vues/MenuProjectCpt.vue'
  import menuParticipation from './vues/MenuParticipationCpt.vue'
  import infoSidebar from './vues/informationSidebarCpt.vue'
  import menuSondage from './vues/MenuSondageCpt.vue'



  export default {
    components : { 
      // liste des composants utilisés dans la div principale
      floatingoptions,
      cesiumcontainer,
      quickMenu,
      menuScene,
      menuProject,
      menuParticipation,
      infoSidebar,
      menuSondage
    },
    data () {
      return {
        quickMenuOptions:[
          {'id':0,'name':'Scène 3D','icon':'fa fa-globe','container':'scene','isactive':false,'islock':false},
          {'id':1,'name':'Projet','icon':'fa fa-home','container':'projet','isactive':false,'islock':false},
          {'id':2,'name':'Participation','icon':'fa fa-map-marker-alt','container':'participation','isactive':false,'islock':false},
          {'id':3,'name':'Questionnaire','icon':'fa fa-edit','container':'sondage','isactive':false,'islock':false}
        ],
        menuname:'Scène 3D',
        backgroundColor:'#17c4c5',
        color:'#4682B4',
        position:'bottom-left',
      } 
    }, 
    methods:{
      count_unlock_menu(){
        return this.quickMenuOptions.filter(menu => !menu.islock).length
      },
      get_unlock_icons(){
        var icons = [];
        var active_menu = this.quickMenuOptions.filter(menu => !menu.islock);
        active_menu.forEach((menu) => {
          icons.push(menu.icon)
        })
        return icons
      },
      get_unlock_actions(){
        var actions = [];
        var active_menu = this.quickMenuOptions.filter(menu => !menu.islock);
        active_menu.forEach((menu) => {
          actions.push(menu.action)
        })
        return actions
      },
      is_menu_active(id){
        return this.quickMenuOptions.filter(menu => menu.id == id)[0].isactive;
      },
    },
    mounted() {
      Event.$on('fire_active_menu',(id) => {
        var activemenu = this.quickMenuOptions.filter(menu => menu.isactive == true)[0]
        if (typeof activemenu !== 'undefined'){
          if(activemenu.id != id){
            this.quickMenuOptions.filter(menu => menu.isactive == true)[0].isactive = false;
          }
        }
        this.quickMenuOptions.filter(menu => menu.id == id)[0].isactive = true;
      });
      Event.$on('firecloseMenu',() => {
        var openedMenu = this.quickMenuOptions.filter(menu => menu.isactive == true);
        if (openedMenu.length>0){
          openedMenu[0].isactive = false;
        }
      });
        Event.$on('fireCloseSondagePanel', () => {
          console.log(this.quickMenuOptions.filter(menu => menu.name == 'Questionnaire'))
          this.quickMenuOptions.filter(menu => menu.name == 'Questionnaire')[0].isactive = false;
        })
    }
  }

</script>

<style>
  .put-at-bottom{
    bottom: 0.5%;
    position: absolute;
    left:20%;
  }
  .thematic-headers{
    background-color: rgb(70, 130, 180, 0.6) !important;
  }
  .thematic-bottom-menu{
    background-color: rgb(70, 130, 180, 0.9) !important;
  }
  .thematic-sub-menu{
    background-color: rgb(70, 130, 180, 0.3) !important;
  }
  .add-border-up{
    padding-top:0.5%;
  }
  .add-visible{
    z-index:3;
  }
  .cesium{
    height:100%;
    width:100%;
    position:fixed;
    z-index:1;
  }
  .menupanel{
    height:30%;
    width:100%;
    position:absolute;
    top:70%;
  }
  .full{
    height:100%;
  }
</style>