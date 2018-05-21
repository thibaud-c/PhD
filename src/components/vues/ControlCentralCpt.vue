<template lang="jade"> 
  div.controlPanelstyle
    #controlpanel.columns
      .panelcolumn
        .label Couches affichées
        .field(v-for='box in layers_checkboxes')
          input.is-checkradio.is-info.is-small(:id='box.label', type='checkbox', :name='box.label', :checked='box.check', v-model='box.check', @change='updateVisibleLayers(box.label,box.check)')
          label(:for='box.label') {{box.label}}
        p.control.has-icons-left
            span.select
              select(v-model='numberOfFlickR', @change='updateFlickrNumber')
                option(v-for="numphoto in numflickr", :value='numphoto.text') flickR pictures : {{ numphoto.text }}
            span.icon.is-left.iconselector
              v-icon.is-small photo
      .panelcolumn
        .label Caméra active 
        .field
          p.control.has-icons-left
            span.select
              select(v-model='cameraSelected', @change='updateCameraSelector')
                option(v-for="cam in cameras", :value='cam.text') {{ cam.text }}
            span.icon.is-left.iconselector
              v-icon.is-small remove_red_eye
        .columns
          .label.column.is-4.withoutmargin Vitesse de déplacement au sol : 
          input.slider.centeredslider.column.is-fullwidth.is-small.is-info(step='1', min='0', max='100', :value='speedStartingValue', type='range' @change='updateSpeedSlider')
      .panelcolumn
        .label Mockup visible 
        .field
          p.control.has-icons-left
            span.select
              select(v-model='mockupSelected' @change='updateMockupSelector')
                option(v-for="model in mockup", :value='model.text') {{ model.text }}
            span.icon.is-left.iconselector
              v-icon.is-small business
      //.column
        v-select(:items='cameras', v-model='cameras.text', label='Select your camera', item-value='text', auto, append-icon='remove_red_eye', hide-details=true, @input='changeCamera(cameras.text)')
        v-select(:items='mockup', v-model='mockup.text', label='Mockup visible', item-value='text', append-icon='business', hide-details=true)

  //div.panelstyle
    #controlpanel.columns.controlPanelstyle
      .column.is-1
      .column.is-3
        .label Couches affichées
        .field(v-for='box in layers_checkboxes')
          input.is-checkradio.is-info.is-small(:id='box.label', type='checkbox', :name='box.label', :checked='box.check', v-model='box.check', @change='addlayer(box.label,box.check)')
          label(:for='box.label') {{box.label}}
      .column.is-1
      .column
        v-select(:items='cameras', v-model='cameras.text', label='Select your camera', item-value='text', auto, append-icon='remove_red_eye', hide-details=true, @input='changeCamera(cameras.text)')
        v-select(:items='mockup', v-model='mockup.text', label='Mockup visible', item-value='text', append-icon='business', hide-details=true)
      .column.is-1
    .columns
      .column.is-1
      .label.column.is-4.withoutmargin Vitesse de déplacement au sol : 
      input.slider.column.is-fullwidth.is-small.is-info(step='1', min='0', max='100', value='30', type='range')
      .column.is-1
  //v-app.contolpanel
    v-container(fluid='')
      v-layout(row='', wrap='')
        v-flex.withoutmargin(xs12='', md6='')
          // TODO STYLE
          v-subheader Layers : 
          v-card(flat='')
            v-flex.contolpanel
              v-checkbox(v-for='box in layers_checkboxes', :label='box.label', v-model='box.model', color='primary', value='primary', hide-details='', @change='addlayer(box.label,box.model)')
        v-flex(xs12='', md6='')
          // TODO
          v-select(:items='cameras', v-model='cameras.text', label='Select your camera', item-value='text', append-icon='remove_red_eye', hide-details='', @input='changeCamera(cameras.text)')
          // TODO
          v-select(:items='mockup', v-model='mockup.text', label='Mockup visible', item-value='text', append-icon='business', hide-details='')
          //
            <v-select
            :items="lod"
            v-model="Niveau_de_Detail"
            label="Niveau de Détail"
            item-value="text"
            append-icon="zoom_in"
            hide-details
            ></v-select>
          // TODO
          v-subheader Vitesse de déplacement au sol : 
          v-slider(v-model='speed', step='0')
</template>
<script>
  export default {
    data () {
    return {
      cameraSelected:'',
      cameras: [
        { text:'FreeFly' },
        { text:'Première Personne' },
        //{ text:'Street View' },
        { text:'Point de vue 1' },
        { text:'Point de vue 2' },
        { text:'Point de vue 3' },
      ],
      numflickr: [
        { text:'0' },
        { text:'10' },
        { text:'50' },
        { text:'100' },
        { text:'500' },
        { text:'1000' },
        { text:'2000' },
        { text:'3000' },
        { text:'5000' },
        { text:'10000' },
        { text:'20000' },
        { text:'30000' },
      ],
      numberOfFlickR:'',
      mockupSelected:'',
      mockup: [
        { text: 'Aucun' },
        { text: 'Proposition 1' },
        { text: 'Proposition 2' }
      ],
      Niveau_de_Detail:'Niveau de Détail',
      lod: [
        { text: 'Peu détaillé' },
        { text: 'Très détaillé' }
      ],
      layers_checkboxes: [
        {label:'Batiments', id:'bati3d', check:'true'},
        {label:'Végétation', id:'vege3d', check:'true'},
        {label:'Commentaires', check:'true'}
      ],
      speedStartingValue:30,
    }
  },
  methods: {
    updateMockupSelector () {
      Event.$emit('fireUpdateMockup', this.mockupSelected);
      console.error('fireUpdateMockup : ' + this.mockupSelected)
    },
    updateCameraSelector(){
      Event.$emit('fireUpdateCamera', this.cameraSelected);
      //Event.$emit('fireChangeCamera', this.cameraSelected);
      console.error('fireUpdateCamera : ' + this.cameraSelected)
    },
    updateFlickrNumber(){
      Event.$emit('fireupdateFlickrNumber', this.numberOfFlickR);
      console.error('fireupdateFlickrNumber : ' + this.numberOfFlickR)
    },
    updateVisibleLayers(val,bool){
      //Event.$emit('fireUpdateLayer', val, bool);
      Event.$emit('fireUpdateLayer', this.layers_checkboxes);
      console.error('fireUpdateLayer :' + this.layers_checkboxes.filter( layer => layer.check ))
    },
    updateSpeedSlider(slider){
      Event.$emit('fireUpdateSpeed', slider.path[0].value);
      this.speedStartingValue = slider.path[0].value;
      console.error('fireUpdateSpeed :' + slider.path[0].value);
    }
  },
  created() {
    
    }
  }
</script>

<style>
.controlPanelstyle{
  padding:20px;
  height:100%;
  width:100%;
  position:absolute;
  background-color:#F4F0EE;
}
.panelcolumn{
  width:25%;
}
.iconselector{
  top:-30% !important;
  width:1.5em !important;
  height:1.5em !important;
}
.withoutmargin{
  margin:0px;
}
.centeredslider{
  height:auto;
}



</style>