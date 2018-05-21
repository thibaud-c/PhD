<template lang="jade"> 
.createpanel 
  div.import3dObject
    .label Insérer un objet 3D dans la scène :
    .carousel.carrousselfull
      .carousel-container.carousel-animate.carousel-animate-slide
        .carousel-content(v-for ='(screen3d,index) in screenshots3D', v-if='index<3')
          .carousel-item
            img.screenshots3d_img(:src='getimageURL("3Dscreens",screen3d.title)', v-model="screen3d.title")
            .title.carousseltitle.is-badge-outlined(:data-badge="2") {{ screen3d.title }}
        a.carousel-nav-left(@click='carouselscreenleft')
          v-icon.is-small keyboard_arrow_left
        a.carousel-nav-right(@click='carouselscreenright')
          v-icon.is-small(aria-hidden='true') keyboard_arrow_right
  div.drawdiv
    .columns
      .label.column Start édition
      a.button.screenshot.is-info.tooltip.column(data-tooltip="Ajouter une forme à la scène",@click="startdrawing")
        v-icon.is-small border_color
    .columns
      .label.column Undo
      a.button.screenshot.is-info.tooltip.column(data-tooltip="Suprimer la dernière forme dessinée",@click="undodrawing")
        v-icon.is-small undo
    .columns
      .label.column Arrêt édition
      a.button.screenshot.is-info.tooltip.column(data-tooltip="Arrêter le mode édition",@click="stopdrawing")
        v-icon.is-small delete_forever



  //.createpanel
    v-container(fluid='')
      v-layout(row='', wrap='')
        v-flex(xs12='', md6='')
          v-flex(xs12='', sm6='', offset-sm3='')
            v-card
              v-card-actions
                v-select(label='Size', :items='items', v-model='size')
                v-spacer
              v-container(fluid='', v-bind='{ [`grid-list-${size}`]: true }')
                v-layout(row='', wrap='')
                  v-flex(xs4='', v-for='n in 9', :key='n')
                    v-card(flat='', tile='')
                      v-card-media(:src='`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`', height='150px')
        v-flex(xs12='', md6='')
          v-layout(row='')
            v-flex(xs12='', sm6='', offset-sm3='')
              v-card
                v-toolbar(color='cyan', dark='')
                  v-toolbar-side-icon
                  v-toolbar-title Inbox
                  v-spacer
                  v-btn(icon='')
                    v-icon search
                v-list(three-line='')
                  template(v-for='item in items')
                    v-subheader(v-if='item.header', v-text='item.header')
                    v-divider(v-else-if='item.divider', v-bind:inset='item.inset')
                    v-list-tile(avatar='', v-else='', v-bind:key='item.title', @click='')
                      v-list-tile-avatar
                        img(v-bind:src='item.avatar')
                      v-list-tile-content
                        v-list-tile-title(v-html='item.title')
                        v-list-tile-sub-title(v-html='item.subtitle')
</template>
<script>
  export default {
    data () {
      return {
        current_carousel_screen3d:'',
        screenshots3D: [
          { id: '0', title: 'Bench' },
          { id: '1', title: 'Bus' },
          { id: '2', title: 'Grass' },
          { id: '3', title: 'Lamp' },
          { id: '4', title: 'Tree' },
          { id: '5', title: 'Home' },
          ],
      }
    },
    methods: {
      getimageURL(type,id){
        return "public/"+type+"/"+id+".jpg";
      },
      carouselscreenleft(){
        var elem = this.screenshots3D.shift();
        this.screenshots3D.push(elem);
        return this.current_carousel_screen3d
      },
      carouselscreenright(){
        var elem = this.screenshots3D.pop();
        this.screenshots3D.unshift(elem);
        return this.current_carousel_screen3d
      },
      startdrawing(){
        Event.$emit('fireStartDrawing');
        console.error('fireStartDrawing');
      },
      stopdrawing(){
        Event.$emit('fireStopDrawing');
        console.error('fireStopDrawing');
      },
      undodrawing(){
        Event.$emit('fireUndoDrawing');
        console.error('fireUndoDrawing');
      }
    }
  }
</script>

<style>
.createpanel{
  height: 100%;
  background-color:#E8EBEA;
  width:100%;
  position:absolute;
}
.carrousselfull{
  position: absolute;
  height:60% !important;
  width:45% !important;
  top:22% !important;
  left:1% !important;
}
.carousseltitle{
  font-size: 12px !important;
  padding : 5px !important;
}
.screenshots3d_img{
    height:100%;
    width:85%;
    min-width:0% !important;
    padding:5px;
}
.screenshots3d_img:hover{
  opacity: 0.5;
}
.import3dObject{
  padding: 1%;
}
.drawdiv{
  position:absolute;
  padding:1%;
  left:50%;
  top:0%;
  width:30%;
}
.screenshot{
  vertical-align: middle;
  display : inline-flex;
  padding: 10px;
  text-align: center;
  width:75px;
  margin : 5%;
}
</style>