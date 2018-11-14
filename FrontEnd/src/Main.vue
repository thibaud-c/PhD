<template lang="pug">
// Init of main div

// Vuetify Initialisation (css styling)
v-app

  // Toolbar
  v-toolbar.put-on-top(dark color="white" height="40")
    v-avatar(size="40")
      img(src="/icons/Accueil.png")
    v-toolbar-title.indigo--text {{ text.title.fr }}
    v-spacer
    v-toolbar-items.sm-and-down
      v-btn(flat small color="indigo darken-3" @click.native='connexiondialog = true') {{ text.login.fr }}
      v-btn(flat icon small color="indigo darken-3" @click="infodialog = true")
        v-icon fas fa-info-circle
  
  // Infomation modal 
  //v-dialog(v-model='infodialog', max-width='300')
    v-tabs(v-model='infotabs', color='error', dark, slider-color='yellow' height="30")
      v-tab(v-for='(tabs,index) in get_information_tabs()', :key='index', ripple) {{tabs.title}}
      v-tab-item(v-for='(tabs,index) in get_information_tabs()', :key='index')
        v-card(flat)
          v-card-text(v-html="tabs.description")
          v-card-actions
            v-spacer
            v-btn(color='error', flat='flat', @click='infodialog = false') {{text.close.fr}}

  // connexion modal 
  v-dialog(v-model='connexiondialog', max-width='500' )
    v-tabs(v-model='connexiontab', color='error', dark, slider-color='yellow' height="30")

      // login tab 
      v-tab(ripple) {{text.login.fr}}
      v-tab-item  
        v-card
          v-card-title.pb-1
            span.title.font-weight-bold.text-md-center {{text.titleconnexion.fr}}
          v-card-text.pa-0
            v-container.pa-2(grid-list-md)
              v-layout(wrap)
                v-flex(xs12 sm6 md4)
                  v-text-field(v-model='email' :label='text.email.fr', required color="pink darken-1")
                v-flex(xs12 sm6 md4)
                  v-text-field(v-model='password' :append-icon="showpwd ? 'visibility_off' : 'visibility'" :type="showpwd ? 'text' : 'password'" name='input-10-1' :label='text.password.fr' @click:append='showpwd = !showpwd' color="pink darken-1")
          v-card-actions.pa-3
            v-spacer
            v-btn(color='error' flat @click.native='connexiondialog = false') Fermer
            v-btn(color='pink darken-1' dark @click.native='connexiondialog = false') Connexion
      
      // Sign in tab 
      v-tab(ripple) {{text.signin.fr}}
      v-tab-item  
        v-card
          v-card-title.pb-1
            span.title.font-weight-bold.text-md-center {{text.titlesignin.fr}}
          v-card-text.pa-0
            v-container.pa-2(grid-list-md)
              v-layout(wrap)
                v-flex(xs12 sm6)
                  v-text-field(v-model="name" :label='text.name.fr' required :rules='[rules.required]' color="pink darken-1")
                v-flex(xs12 sm6)
                  v-text-field(v-model="forname" :label='text.forname.fr' required :rules='[rules.required]' color="pink darken-1")
                v-flex(xs12 sm6)
                  v-text-field(v-model="email" :label='text.emailrequired.fr', required color="pink darken-1" :rules='[rules.required]')
                v-flex(xs12 sm6)
                  v-text-field(v-model='password' :append-icon="showpwd ? 'visibility_off' : 'visibility'" :rules='[rules.required, rules.min]' :type="showpwd ? 'text' : 'password'" name='input-10-1' :label='text.passwordrequired.fr' :hint='text.passwordhint.fr' counter @click:append='showpwd = !showpwd' color="pink darken-1")
                v-flex(xs12 sm6)
                  v-text-field(v-model="job" :label='text.job.fr' color="pink darken-1")
                v-flex(xs12 sm6)
                  v-select(v-model="sex" :items="text.sexList.fr" :label='text.sex.fr' color="pink darken-1")
                v-flex(xs12 sm6)
                  v-text-field(v-model="postcode" :label='text.postcode.fr' required :rules='[rules.required]' color="pink darken-1")
                v-flex(xs12 sm6)
                  v-text-field(v-model="age" :label='text.age.fr' color="pink darken-1" type="number")

            small.pl-2 {{text.requiredhint.fr}}
          v-card-actions.pa-3
            v-spacer
            v-btn(color='error' flat @click.native='connexiondialog = false') Fermer
            v-btn(color='pink darken-1' dark @click.native='connexiondialog = false') Connexion
  
  // Cesium container          
  cesiumVE
  
  // Corner menu
  //quickMenu.is-clickable.add-visible(:menu-count='count_unlock_menu()', :icon-class='get_unlock_icons()', :menu-url-list='get_unlock_actions()', :position='position', :backgroundColor='color')
  
  
  // Side bar description
  description(v-show='isDescriptionVisible' :information="desciptionData" )
  artCreation
  artDescription
  // right corner maps
  //floatingMaps



  // Menus
  SceneOptions(v-show='is_menu_active(0)')
  ParticipativeOptions(v-show='is_menu_active(1)')
  SurveyForm(v-show='is_menu_active(2)')
  Legend(v-show='is_menu_active(3)')
  
  

  //searchBar
  searchBar.rightposition

  //Target
  pov_CentralTarget

  //2D localization maps 
  maps_2DPosition

  //Participation wizard
  //ParticipationMenu.positionparticipation
  wizardParticipation
</template>

<script>
  // pages imports
  import cesiumVE from './pages/CesiumVirtualGlobe.vue'
  import floatingMaps from './components/FloatingMaps.vue'
  import SceneOptions from './pages/SceneOptions.vue'
  import ProjectOptions from './pages/ProjectOptions.vue'
  import ParticipativeOptions from './pages/ParticipativeOptions.vue'
  import SurveyForm from './pages/SurveyForm.vue'
  import description from './components/descriptions.vue'
  import Legend from './components/legend.vue'
  import searchBar from './components/searchBar.vue'
  import ParticipationMenu from './components/ParticipationMenu.vue'
  //new components
  import pov_CentralTarget from './components/pointofview.vue'
  import maps_2DPosition from './components/localizationmaps.vue'
  import wizardParticipation from './components/wizardparticipation.vue'
  import artCreation from './components/artifactsWizard.vue'
  import artDescription from './components/artifactsDescription.vue'


  // Components imports
  import infoSidebar from './components/informationSidebarCpt.vue'
  import quickMenu from './components/QuickMenu.vue'

  // Config imports
  import confmenuList from './assets/menu-options.json'
  import tabsList from './assets/information-tabs.json'

  export default {
    name: 'appmain',
    components : { 
      // liste des composants utilisés dans la div principale
      floatingMaps,
      cesiumVE,
      quickMenu,
      SceneOptions,
      ProjectOptions,
      ParticipativeOptions,
      infoSidebar,
      SurveyForm,
      description,
      Legend,
      searchBar,
      ParticipationMenu,
      pov_CentralTarget,
      maps_2DPosition,
      wizardParticipation,
      artCreation,
      artDescription
    },
    
    data () {
      return {
        text:{
          title:{
            fr:'Je participe à construire la ville de demain !'
          },
          login:{
            fr:'Se Connecter'
          },
          connexion:{
            fr:'Connection'
          },
          signin:{
            fr:"Créer un Compte"
          },
          info:{
            fr:'Informations'
          },
          close:{
            fr:'Fermer'
          },
          titleconnexion:{
            fr:'Se connecter à la plateforme participative'
          },
          titlesignin:{
            fr:'Créer un compte pour participer !'
          },
          password:{
            fr:'Mot de passe'
          },
          passwordrequired:{
            fr:'Mot de passe *'
          },
          passwordhint:{
            fr:'8 caractères au minimum'
          },
          require:{
            fr:'Requis'
          },
          sexList:{
            fr:['Femme','Homme','Je me définis autrement']
          },
          sex:{
            fr:'Sexe'
          },
          postcode:{
            fr:'Code Postal *'
          },
          age:{
            fr:'Age'
          },
          email:{
            fr:'Courriel'
          },
          emailrequired:{
            fr:'Courriel *'
          },
          job:{
            fr:'Profession'
          },
          name:{
            fr:'Nom *'
          },
          forname:{
            fr:'Prénom *'
          },
          requiredhint:{
            fr:'* Indique que le champs est obligatoire'
          }
        },
        data:[{
              text: 'Play Now',
              icon: 'iconfont icon-bofang',  //选填 字体图标 class
              children: [] //选填
        }],
        menuList: confmenuList,
        infodialog:true,
        infotabs:0,
        connexiondialog:false,
        connexiontab:0,
        password:"",
        showpwd:false,
        email:"",
        sex:"",
        postcode:"",
        name:"",
        forname:"",
        job:"",
        age:"",
        isDescriptionVisible:false,
        desciptionData:"",

        rules: {
          required: value => !!value || this.text.require.fr,
          min: v => v.length >= 8 || this.text.passwordhint.fr,
        },

        menuname:'Scène 3D',
        backgroundColor:'#17c4c5',
        color:'#4682B4',
        position:'bottom-left',
      } 
    }, 
    methods:{
      doSomething(){
        alert("ouch")
      },
      count_unlock_menu(){
        return this.menuList.filter(menu => !menu.islock).length
      },
      get_unlock_icons(){
        let icons = [];
        let active_menu = this.menuList.filter(menu => !menu.islock);
        active_menu.forEach((menu) => {
          icons.push(menu.icon)
        })
        return icons
      },
      get_unlock_actions(){
        let actions = [];
        let active_menu = this.menuList.filter(menu => !menu.islock);
        active_menu.forEach((menu) => {
          actions.push(menu.action)
        })
        return actions
      },
      get_information_tabs(){
        let tabs = [];
        let active_tabs = tabsList.filter(tab => tab.isActive);
        active_tabs.forEach((tab) => {
          tabs.push(tab)
        })
        return tabs
      },
      is_menu_active(id){
        return this.menuList.filter(menu => menu.id == id)[0].isactive;
      },

    },
    mounted() {

      Event.$on('fire_active_menu',(id) => {
        // Récupère le munu activé et le passe à desactivé
        let activemenu = this.menuList.filter(menu => menu.isactive == true)[0]
        if (typeof activemenu !== 'undefined'){
          if(activemenu.id != id){
            this.menuList.filter(menu => menu.isactive == true)[0].isactive = false;
          }
        }
        // Active le menu selectionné
        this.menuList.filter(menu => menu.id == id)[0].isactive = true;
      });
      Event.$on('firecloseMenu',() => {
        let openedMenu = this.menuList.filter(menu => menu.isactive == true);
        if (openedMenu.length>0){
          openedMenu[0].isactive = false;
        }
      });
        Event.$on('fireCloseSondagePanel', () => {
          console.log(this.menuList.filter(menu => menu.name == 'Questionnaire'))
          this.menuList.filter(menu => menu.name == 'Questionnaire')[0].isactive = false;
        });

        Event.$on('fireDisplayDescription',(data) => {  
            this.desciptionData = data;
            this.isDescriptionVisible = true;

            Event.$emit('fireUpdateDescription', data);
        });

        
        Event.$on('fireCloseLegend',() => {  
            this.isDescriptionVisible = false;
        });
        Event.$on('fireCloseDescription',() => {  
            this.isDescriptionVisible = false;
        });

        
    }
  }

</script>

<style>
  .absolute-position{
    position: absolute;
  }
  .small-height{
    height:10%;
  }
  .put-on-top{
    z-index: 5;
  }

  .positionparticipation{
    left:2%;
    top:5%;
    position:absolute;
  }

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