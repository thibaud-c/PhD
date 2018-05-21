<template lang="jade"> 
  div.commentPanelstyle
    .columns.participatetempale
      .panelcommentcolumn.has-text-centered
        .label Copies d'écran
        a.button.screenshot.is-info.tooltip(data-tooltip="Prendre une copie d'écran" @click='takeScreenShot')
          v-icon.is-small add_a_photo
        a.button.screenshot.is-info.tooltip(@click="showScreenshotsCarousel = true", data-tooltip="Visualiser toutes les copies d'écran")
          v-icon.is-small view_carousel
        .carousel(v-if="showScreenshotsCarousel")
          a.delete.is-small.carouseldelete(@click='showScreenshotsCarousel=false')
          .carousel-container.carousel-animate.carousel-animate-slide
            .carousel-content(v-for ='(screen,index) in screenshots', v-if='index<3')
              .carousel-item(@click="showInfoImg=true")
                img.screenshots_img(:src='getimageURL("screen",screen.id)', v-model="screen.id")
                .title.carousseltitle.is-badge-outlined(:data-badge="2") {{ screen.title }}
            a.carousel-nav-left(@click='carouselscreenleft')
              v-icon.is-small keyboard_arrow_left
            a.carousel-nav-right(@click='carouselscreenright')
              v-icon.is-small(aria-hidden='true') keyboard_arrow_right
      .modal.is-active(v-if="showInfoImg")
            .modal-background
            .modal-content.box
              .title.is-link Ajouter un commentaire        
              p.image.is-3by2
                img(:src='getimageURL("insight",chooseninsightindex)')
              .field.is-grouped
                .control
                  button.button.is-link(@click="showInfoImg = false; urlimgcard = getimageURL('insight',chooseninsightindex)") Lancer le mode transparence
                .control
                  button.button.is-text(@click="showInfoImg = false") Annuler
      .panelcommentcolumn.has-text-centered
        .label Inspirations
        .file.is-primary.screenshot.uploadfile
          label.file-label.tooltip(data-tooltip="Ajouter une photo d'inspiration")
            input.file-input(type='file', name='resume')
            span.file-cta.screenshot
              span.file-icon
                v-icon.is-small.uploadicon file_upload
        a.button.screenshot.is-primary.tooltip(@click="showInsightCarousel = true", data-tooltip="Visualiser les inspirations")
          v-icon.is-small view_carousel
        div.carouselinsights.carousel(v-if="showInsightCarousel", v-model="chooseninsightindex")
          a.delete.is-small.carouseldelete(@click='showInsightCarousel=false')
          .carousel.insight1
            div.carousel-container.carousel-animate.carousel-animate-slide
                .carousel-content(v-for ='(ins,index) in filteredInsights("GLOB")', v-if='index<6')
                  .carousel-item(@click="showInfoImg=true; chooseninsightindex=ins.id")
                    img.screenshots_img(:src='getimageURL("insight",ins.id)', v-model="ins.id")
                    .title.carousseltitle {{ins.title}}
                a.carousel-nav-left(@click='carouselinsightleft("GLOB")')
                  v-icon.is-small keyboard_arrow_left
                a.carousel-nav-right(@click='carouselinsightright("GLOB")')
                  v-icon.is-small(aria-hidden='true') keyboard_arrow_right
          .carousel.insight2
            div.carousel-container.carousel-animate.carousel-animate-slide
                .carousel-content(v-for ='(ins,index) in filteredInsights("ELEM")', v-if='index<5 && ins.categorie==="ELEM"')
                  .carousel-item(@click="showInfoImg=true; chooseninsightindex=ins.id")
                    img.screenshots_img(:src='getimageURL("insight",ins.id)', v-model="ins.id")
                    .title.carousseltitle {{ins.title}}
                a.carousel-nav-left(@click='carouselinsightleft("ELEM")')
                  v-icon.is-small keyboard_arrow_left
                a.carousel-nav-right(@click='carouselinsightright("ELEM")')
                  v-icon.is-small(aria-hidden='true') keyboard_arrow_right
        .modal.is-active(v-if="showInfoImg")
            .modal-background
            .modal-content.box
              .title.is-link Ajouter un commentaire        
              p.image.is-3by2
                img(:src='getimageURL("insight",chooseninsightindex)')
              .field.is-grouped
                .control
                  button.button.is-link(@click="showInfoImg = false; showCardImg = true, urlimgcard = getimageURL('insight',chooseninsightindex)") Lancer le mode transparence
                .control
                  button.button.is-text(@click="showInfoImg = false") Annuler
        span.image.cardtransparance(v-if="showCardImg", v-model='showCardImg', :style='cardstyle')
          img(:src='urlimgcard', v-model='urlimgcard')
        span.transparantmenu(v-show="showCardImg")
          span.columns(v-for="menu in menueditcard")
            span.tooltip.is-tooltip-left(:data-tooltip="menu.tooltip")
              v-icon.is-small.column {{ menu.icon }}
            input.slider.column.is-small.is-info(:step='menu.step', :min='menu.minvalue', :max='menu.maxvalue', :value='menu.value', type='range', @change='updateSliderEdit(menu.id,$event)')
          a.button.is-small.is-danger(@click='razTransparenceOptions();showCardImg=false;showInfoImg=false') Quitter le mode transparence
    div
      article.media
        .media-content
          .content
            p.commentbox.has-text-justified(v-for='com in comments')
              small 
                .has-text-justified{{com.commessage}}
                strong {{com.comautor}} 
                | - {{ calculDate(com.comdate) }} 
              v-divider.separator
      a.button.addcom.is-link(@click="showAddcom = true") Ajout Discussion
      .modal(:class="{ 'is-active': showAddcom }")
        .modal-background
        .modal-content.box
          .title.is-link Ajouter un commentaire        
          .field
            label.label Prénom Nom
            .control
              input.input(type='text', placeholder='Entrez votre Nom et Prénom', value='nameComment', v-model='nameComment')
          .field
            label.label Email
            .control
              input.input(type='email', placeholder='Entrez votre Email (ce dernier ne sera pas visible)', value='emailComment', v-model='emailComment')
          .field
            label.label Commentaire
            .control
              textarea.textarea(placeholder='Entrez votre commentaire', value='messageComment', v-model='messageComment')
          .field.is-grouped
            .control
              button.button.is-link(@click="showAddcom = false; addComment()") Commenter
            .control
              button.button.is-text(@click="showAddcom = false") Annuler
    




</template>
<script>
export default {
  data () {
    return {
      comments: [
      { comdate: '2015-06-05T14:24:59.591Z', comemail: 'Summer BBQ', comautor: 'Ali Connors', commessage: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
      { comdate: '2017-06-05T14:24:59.591Z', comemail: 'Summer BBQ', comautor: 'me Scrott', commessage: "Wish I could come, but I'm out of town this weekend." },
      { comdate: '2018-01-05T00:24:59.591Z', comemail: 'Oui oui', comautor: 'Sandra Adams', commessage: "Do you have Paris recommendations? Have you ever been?" },
      { comdate: '2018-01-04T10:24:59.591Z', comemail: 'Birthday gift', comautor: 'Trevor Hansen', commessage: "Have any ideas about what we should get Heidi for her birthday?" },
      { comdate: '2018-01-05T14:20:59.591Z', comemail: 'Recipe to try', comautor: 'Britta Holt', commessage: "We should eat this: Grate, Squash, Corn, and tomatillo Tacos." },
      ],
      size: 'sm',
      user_comment: null,
      user_name:null,
      errorMessages:[],
      addcom_dialog: false,
      showAddcom:false,
      showScreenshotsCarousel:false,
      showInsightCarousel:false,
      nameComment:'',
      showInfoImg:false,
      emailComment:'',
      showCardImg:false,
      focused:true,
      urlimgcard:'',
      messageComment:'',
      idmenucard:'',
      chooseninsightindex:'',
      items: [
      { text: 'Extra small (1px)', value: 'xs' },
      { text: 'Small (4px)', value: 'sm' },
      { text: 'Medium (8px)', value: 'md' },
      { text: 'Large (16px)', value: 'lg' },
      { text: 'Extra large (24px)', value: 'xl' }
      ],     
    insights: [
      { id: '1', title: 'Place pavée avec fontaine', tags:['Place', "Urbain", "Fontaine" ], categorie:'GLOB' },
      { id: '2', title: 'Place pavée avec statue', tags:['Place', "Urbain", "Statue" ], categorie:'GLOB' },
      { id: '3', title: 'Place pavée avec végétation', tags:['Place', "Urbain", "Végétation" ], categorie:'GLOB' },
      { id: '4', title: 'Fontaine végétalisée', tags:['Place', "Urbain", "Fontaine" ], categorie:'ELEM' },
      { id: '5', title: 'Végétation avec fontaine', tags:['Urbain', "Végétation", "Fontaine" ], categorie:'ELEM' },
      { id: '6', title: 'Square vert et partage', tags:['Place', "Urbain", "Verte" ], categorie:'GLOB' },
      { id: '7', title: 'Place pavée végétation et tram', tags:['Place', "Urbain", "Espace Vert" ], categorie:'GLOB' },
      { id: '8', title: 'Place pavée architecture travaillée', tags:['Place', "Urbain", "Espace Vert", 'Architecture' ], categorie:'GLOB' },
      { id: '9', title: 'Fontaine Etoile', tags:['Espace Vert', "Eau", "Fontaine" ], categorie:'ELEM' },
      { id: '10', title: 'Statue Lion', tags:[ "Urbain", "Statue" ], categorie:'ELEM' },
      { id: '11', title: 'Place avec bancs', tags:['Place', "Urbain", "Banc" ], categorie:'GLOB' },
      { id: '12', title: 'Place pavée avec statue', tags:['Place', "Urbain", "Statue" ], categorie:'GLOB' },
      { id: '13', title: 'Place végétalisée', tags:['Place', "Espace Vert", "Urbain" ], categorie:'GLOB' },
      { id: '14', title: 'Banc rond', tags:["Urbain", "Banc" ], categorie:'ELEM' }
      ],
    screenshots: [
      { id: '1', title: 'vue globale', commentaire: "N'a rien a faire dans le quartier", user: "Gérard", tags:['Batiment', "J'aime pas", "Trop haut", "solution 1" ] },
      { id: '2', title: 'vue proche', commentaire: "Batiment sympa et pas trop haut", user: "Didier", tags:['Batiment', "J'aime", "solution 1" ] },
      { id: '3', title: 'vue globale', commentaire: "Vue de mon balcon !! Ne construisz pas cette tour", user: "Véronique", tags:['Batiment', "J'aime pas", "Trop haut","solution 2" ] },
      { id: '4', title: 'vue de devant', commentaire: "Trop d'étages !! Beaucoup trop haut", user: "Benoit", tags:['Batiment', "J'aime pas", "Trop haut","solution 2" ]},
      { id: '5', title: 'vue sans mock-up', commentaire: "Au moins il y a de la verdure", user: "Daisy", tags:['Batiment', "J'aime", "verdure" ]}
      ],
      menueditcard: [
        { tooltip: 'Position horizontale', icon:'swap_horiz', maxvalue: "100", minvalue: "0", value: "35", step:"0.5", id:'0'},
        { tooltip: 'Position vertical', icon:'swap_vert', maxvalue: "100", minvalue: "0", value: "35", step:"0.5", id:'1'},
        { tooltip: 'Angle de Rotation', icon:'rotate_right', maxvalue: "360", minvalue: "-360", value: "0", step:"1", id:'2'},
        { tooltip: 'Taille', icon:'photo_size_select_small', maxvalue: "100", minvalue: "0", value: "30", step:"0.5", id:'3'},
        { tooltip: 'Transparence', icon:'blur_linear', maxvalue: "1", minvalue: "0", value: "0.95", step:"0.1", id:'4'}
      ],
      cardstyle:{
        top:"35%", left:"35%", height:"35%", width:"35%", opacity:"1", transform: "rotate(0deg)"}
    }
  },
  methods: {
    addTransparenceCard(index){
      console.log('fire')
      Event.$emit('fireShowTransparenceCard', this.getimageURL('insight',index));

    },
    filteredInsights(cat) {
       return this.insights.filter( ins => ins.categorie === cat );
     },
    commentCheck () {
      this.errorMessages = this.user_comment
        ? ['Hey! I\'m required']
        : []

      return true
    },
    addComment () {
      var formatedcom = {
        "comemail":this.emailComment,
        "comautor":this.nameComment,
        "commessage":this.messageComment,
        "comdate":new Date()
      }
      this.comments.push(formatedcom);
      this.messageComment= '';
      this.nameComment= '';
      this.emailComment= '';
      this.showAddcom=false;
      console.log(this.showAddcom)
    },
    calculDate(date){
      //var formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ"); 
      var currentdate = new Date();
      var mydate = new Date(date);
      //comparaison des années
      var difyear = currentdate.getFullYear() - mydate.getFullYear();
      if (difyear>0)
        return difyear + "y";

      //comparaison des mois
      var difmonth = currentdate.getMonth() - mydate.getMonth(); 
      if (difmonth>0)
        return difmonth + "m";

      //comparaison des jours
      var difday = currentdate.getDay() - mydate.getDay();
      if (difday>0)
        return difday + "d";

      //comparaison des heures
      var difhour = currentdate.getHours() - mydate.getHours();
      if (difhour>0)
        return difhour + "h";

      //comparaison des jours
      var difminute = currentdate.getMinutes() - mydate.getMinutes();
      if (difminute>0)
        return difminute + "min";

      //comparaison des jours
      var difsecond = currentdate.getSeconds() - mydate.getSeconds();
      if (difsecond>0)
        return difsecond + "s";

      return difsecond+"s";
    },
    getimageURL(type,id){
      if (type==="screen")
        return "public/Screens/screenshot-"+id+".jpg";
      if (type==="insight")
        return "public/insights/insight-"+id+".jpg";
    },
    carouselscreenleft(){
      var elem = this.screenshots.shift();
      this.screenshots.push(elem);
      return this.current_carousel_screen
    },
    carouselscreenright(){
      var elem = this.screenshots.pop();
      this.screenshots.unshift(elem);
      return this.current_carousel_screen
    },
    carouselinsightright(cat){
      for (var i=0; i< this.insights.length; i++){
        if (this.insights[i].categorie === cat){
          var elem = this.insights.splice(i,1)[0];
          this.insights.push(elem);
          return this.current_carousel_screen
        }
      }
    },
    setstylepicture(attribute,value){
      switch(attribute){
        case 'swap_horiz':
          this.cardstyle.left = value + '%';
          break;
        case 'swap_vert':
          this.cardstyle.top = value + '%';
          break;
        case 'rotate_right':
          this.cardstyle.transform = "rotate("+value + 'deg)';
          break;
        case 'photo_size_select_small':
          this.cardstyle.height = value + '%';
          this.cardstyle.width = value + '%';
          break;
        case 'blur_linear':
          this.cardstyle.opacity = value;
          break;
      }
    },
    updateSliderEdit(index,val){
      this.setstylepicture(val.path[1].textContent,val.path[0].value);
      this.menueditcard[index].value = Number(val.path[0].value);
    },
    takeScreenShot(){
      Event.$emit('fireTakeScreenShot');
      console.error('fireTakeScreenShot')
    },
    razTransparenceOptions(){
      console.log('this.menueditcard')
      this.setstylepicture('swap_horiz',35);
      this.menueditcard[0].value = 35;
      this.setstylepicture('swap_vert',35);
      this.menueditcard[1].value = 35;
      this.setstylepicture('rotate_right',0);
      this.menueditcard[2].value = 0;
      this.setstylepicture('photo_size_select_small',30);
      this.menueditcard[3].value = 30;
      this.setstylepicture('blur_linear',0.95);
      this.menueditcard[4].value = 0.95;
    },
    carouselinsightleft(cat){
      for (var i = this.insights.length; i>0; i--){
        if (this.insights[i-1].categorie === cat){
          var elem = this.insights.splice(i-1,1)[0];
          this.insights.unshift(elem);
          return this.current_carousel_screen
        }
      }
    }
  }
}
</script>

<style>
.commentPanelstyle{
  background-color:#F5E7E8;
  height:100%;
  margin:0px;
  width:100%;
  position:absolute;
}
.separator{
  margin: 3px;
}
.commentbox{
  margin-bottom:0px !important;
}
.media{
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1px;
  height:85%;
  position: absolute;
  left:45%;
  width:35%;
}
.addcom{
  vertical-align: middle;
  display : inline-flex;
  height:20px;
  padding: 5px;
  left:45%;
  width:35%;
  top:85%;
  position: absolute;
  z-index:2;
}
.screenshot{
  vertical-align: middle;
  display : inline-flex;
  padding: 10px;
  text-align: center;
  width:75px;
  margin : 5%;
}
.carousel{
  position: absolute;
  top:0%;
  left:0;
  height:100%;
  z-index: 4;
}
.screenshots_img{
    height:100%;
    width:90%;
    min-width:0% !important;
    padding:5px;
}
.screenshots_img:hover{
  opacity: 0.5;
}
.insight1{
  position: absolute;
  top:0%;
  left:0;
  height:50%;
  z-index: 4;
}
.insight2{
  position: absolute;
  top:50%;
  left:0;
  height:50%;
  z-index: 4;
}
.carousseltitle{
  font-size: 12px !important;
  padding : 5px !important;
}
.cardtransparance{
    position:fixed;
    z-index: 2;
  }
.transparantmenu{
    position:fixed;
    bottom:35%;
    right:3%;
    z-index: 2;
    color:white;
    background-color: rgba(0,0,0,.5);
    border-radius: 5px;
    padding: 15px;
}
.tooltip{

}
.panelcommentcolumn{
  width:50%;
  margin-top: 5%;
  margin-left: 5%;
}
.participatetempale{
  width:45%;
  position: absolute;
}
.carouseldelete{
  position:absolute;
  right:0%;
  z-index: 5;
}
.carouselinsights{
  height:150%;
}
.uploadicon{
  padding-left:1.25em;
}
.uploadfile{
  padding: 0px;
}
</style>