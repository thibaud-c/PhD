<template lang="pug">
  <!-- description du composant cesium et attribution de l'id -->
  #informationCpt
    #quickviewInfo.quickview.sidebar-comment.is-level5(v-show='isDescriptionVisible')
      header.quickview-header
        p.title.add-padding {{ sidebarTitle }}
      .delete.close-panel(@click='isDescriptionVisible = false')
      .quickview-body
        .card
          .card-image(v-if='isInformationImage')
            figure.image.is-4by3
              img(:src='informationContent', alt='Placeholder image')
          .card-content(v-if='isInformationText')
            .control
              textarea.textarea(type='text', readonly) {{informationContent}}
          .card-content
            .media.is-mobile
              .media-content.is-left
                p.title.is-4 {{ informationtitle }}
                p.subtitle.is-6 @{{informationAuthor}}
              nav.level.is-right
                .level-left
                  a.level-item.add-padding
                    span.icon.is-small
                      i.fas.fa-reply
                  a.level-item.add-padding
                    span.icon.is-small
                      i.fas.fa-heart
              br
            .content
              time {{informationDate}}
    #previz.previz-position(v-if='isPrevizVisible', :style="{top:previzPositionY,left:previzPositionX}")
      .image.is-64x64.add-visible(v-if='isPrevizImage')
        img(:src="previzContent").shadow-box
      .textarea.add-visible.shadow-box(type='text', readonly, v-if='isPrevizText') {{previzContent}}
</template>

<script>
	export default {
      data (){
        return {
          isDescriptionVisible:false,
          isPrevizVisible:false,
          isPrevizText:false,
          isPrevizImage:false,
          previzPositionX:'',
          previzPositionY:'',
          previzContent:'',
          informationContent:'',
          informationtitle:'',
          informationAuthor:'',
          informationDate:'',
          sidebarTitle:'',
          isInformationImage:false,
          isInformationText:false,
        }
      },
      /** 

      Main Cesium, lancement une fois le composant monté

      */
      mounted() {
        // ** Display description ** //

        Event.$on('fireDisplayDescription',(data) => {
          this.sidebarTitle = data.cat;
          this.informationtitle = data.title;
          this.informationAuthor = data.author;
          this.informationDate = data.date.toDateString();
          this.informationContent = data.content;

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
	}
  console.warn('Chargement de informationSidebarCpt.vue')

</script>

<style>
  .sidebar-comment{
    border: 0.2px;
    border-style: solid;
    border-color: white;
    position: absolute;
    top:0;
    right:0;
    height: 100%;
    width:30%;
    z-index: 10 !important;
    overflow-y: auto;
  }
  .quickview-body{
    height:100%;
  }
  .add-padding{
    padding: 5%;
  }
  .previz-position{
    position: absolute;
  }
  .shadow-box{
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  }
  .is-level5{
    z-index: 5;
  }
</style>