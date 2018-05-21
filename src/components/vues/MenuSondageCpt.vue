<template lang="jade">

  #quickviewDefault.quickview.sidebar-sondage.add-visible
    header.quickview-header
      p.title.add-padding {{ sidebarTitle }}
    .delete.close-panel(@click='closeSondage')
    hr.dropdown-divider
    .quickview-body.reduce-margin
      .quickview-block.add-padding
        .field.is-horizontal
          .field-label.is-normal
            label.label From
          .field-body
            .field
              p.control.is-expanded.has-icons-left.reduce-margin
                input.input(type='text', placeholder='Name')
                span.icon.is-small.is-left.translate50
                  i.fas.fa-user
            .field
              p.control.is-expanded.has-icons-left.has-icons-right
                input.input.is-success(type='email', placeholder='Email', value='alex@smith.com')
                span.icon.is-small.is-left.reduce-margin.translate50
                  i.fas.fa-envelope
                span.icon.is-small.is-right.reduce-margin.translate20
                  i.fas.fa-check
        .field.is-horizontal
          .field-label
          .field-body
            .field.is-expanded
              .field.has-addons
                p.control
                  a.button.is-static +41
                p.control.is-expanded
                  input.input(type='tel', placeholder='Your phone number')
              p.help Do not enter the first zero
        .field.is-horizontal
          .field-label.is-normal
            label.label Department
          .field-body
            .field.is-narrow
              .control
                .select.is-fullwidth
                  select
                    option Business development
                    option Marketing
                    option Sales
        .field.is-horizontal
          .field-label
            label.label Already a member?
          .field-body
            .field.is-narrow
              .control
                label.radio
                  input(type='radio', name='member')
                  |           Yes
                label.radio
                  input(type='radio', name='member')
                  |           No
        .field.is-horizontal
          .field-label.is-normal
            label.label Subject
          .field-body
            .field
              .control
                input.input.is-danger(type='text', placeholder='e.g. Partnership opportunity')
              p.help.is-danger
                | This field is required
        .field.is-horizontal
          .field-label.is-normal
            label.label Question
          .field-body
            .field
              .control
                textarea.textarea(placeholder='Explain how we can help you')
        .field.is-horizontal
          .field-label
            // Left empty for spacing
          .field-body
            .field
              .control
                .field.is-grouped.is-grouped-right
                  p.control
                    a.button.is-primary(@click='closeSondage')
                      | Submit
                  p.control
                    a.button.is-text(@click='closeSondage')
                      | Cancel
  //#sondagePanel.quickview.sidebar-sondage.is-level5(v-show='isDescriptionVisible')
    header.quickview-header
      p.title.add-padding {{ sidebarTitle }}
    .delete.close-panel(@click='isDescriptionVisible = false')
    hr.dropdown-divider
    .quickview-body
      .field.is-horizontal
        .field-label.is-normal
          label.label From
        .field-body
          .field
            p.control.is-expanded.has-icons-left
              input.input(type='text', placeholder='Name')
              span.icon.is-small.is-left
                i.fas.fa-user
          .field
            p.control.is-expanded.has-icons-left.has-icons-right
              input.input.is-success(type='email', placeholder='Email', value='alex@smith.com')
              span.icon.is-small.is-left
                i.fas.fa-envelope
              span.icon.is-small.is-right
                i.fas.fa-check
      .field.is-horizontal
        .field-label
        .field-body
          .field.is-expanded
            .field.has-addons
              p.control
                a.button.is-static
                  | +44
              p.control.is-expanded
                input.input(type='tel', placeholder='Your phone number')
            p.help Do not enter the first zero
      .field.is-horizontal
        .field-label.is-normal
          label.label Department
        .field-body
          .field.is-narrow
            .control
              .select.is-fullwidth
                select
                  option Business development
                  option Marketing
                  option Sales
      .field.is-horizontal
        .field-label
          label.label Already a member?
        .field-body
          .field.is-narrow
            .control
              label.radio
                input(type='radio', name='member')
                |           Yes
              label.radio
                input(type='radio', name='member')
                |           No
      .field.is-horizontal
        .field-label.is-normal
          label.label Subject
        .field-body
          .field
            .control
              input.input.is-danger(type='text', placeholder='e.g. Partnership opportunity')
            p.help.is-danger
              | This field is required
      .field.is-horizontal
        .field-label.is-normal
          label.label Question
        .field-body
          .field
            .control
              textarea.textarea(placeholder='Explain how we can help you')
      .field.is-horizontal
        .field-label
          // Left empty for spacing
        .field-body
          .field
            .control
              .field.is-grouped.is-grouped-right
                p.control
                  a.button.is-primary
                    | Submit
                p.control
                  a.button.is-light
                    | Cancel
</template>

<script>
  export default {
      data (){
        return {
          sidebarTitle:'Sondage Participatif',
          isSondageVisible:true,
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
      closeSondage(){
        Event.$emit('fireCloseSondagePanel')
        console.error('fireCloseSondagePanel')
      }
    }
  }
  console.warn('Chargement de informationSidebarCpt.vue')

</script>

<style>
  .sidebar-sondage{
    height: 100%;
    width:30%;
    position: fixed;
    right: 0; 
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    background-color: white;
    overflow-y: auto;
    z-index: 5 !important;
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
  .add-visible{
    z-index: 4;
  }
  .reduce-margin{
    margin:0px !important;
    padding: 0px !important;
  }
  .translate50{
    transform: translate(-20%, -20%);
  }
  .translate20{
    transform: translate(+20%, -20%);
  }
</style>