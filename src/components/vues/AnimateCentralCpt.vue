<template lang="jade"> 
div.animatepanel
  #animatepanel.columns
    .panelcolumn
      .label Ombrage : 
        .field
          input.is-checkradio.is-info.is-small(:id='shadowbox', type='checkbox', :name='shadowbox', :checked='isActiveShadow', v-model='isActiveShadow', @change='activShadow(isActiveShadow)')
          label.has-text-weight-normal(:for='shadowbox') Ombres
      .column.has-text-weight-normal.withoutmargin.padding-5 Sélectioner une l'heure : 
      input.slider.centeredslider.column.is-fullwidth.is-small.is-info.withoutmargin.padding-5.has-output(:id='h_slider',step='1', min='00', max='23', :value='date.hour', type='range', @change='UpdateHour')
      output(:for='h_slider') {{date.hour}}h
      .column.has-text-weight-normal.withoutmargin.padding-5 Sélectioner un mois : 
      input.slider.centeredslider.column.is-fullwidth.is-small.is-info.withoutmargin.padding-5.has-output(:id='m_slider',step='0', min='1', max='11', :value='date.month', type='range', @change='UpdateMonth')
      output(:for='m_slider') {{months[date.month]}}
</template>

<script>
 export default {
    data () {
    	return {
    		isActiveShadow:'true',
        shadowbox:'shadowCheckBox',
        date:{hour:15,month:6},
        m_slider:'monthSlider',
        h_slider:'hourSlider',
        months:{0:'Jan',1:'Fév',2:'Mar',3:'Avr',4:'Mai',5:'Juin',6:'Juil',7:'Aou',8:'Sep',9:'Oct',10:'Nov',11:'Déc'}
    	}
    },
    methods: {
      UpdateHour(hour){
        this.date.hour = hour.target.value;
        Event.$emit('fireUpdateShadow', this.date);
        console.error('fireUpdateShadow : ' + this.date)
      },
      UpdateMonth(month){
        this.date.month = month.target.value;
        Event.$emit('fireUpdateShadow', this.date);
        console.error('fireUpdateShadow : ' + this.date)
      },
      activShadow(bool){
        Event.$emit('fireActivationShadow', bool);
        console.error('fireActivationShadow :' + bool)
    },
    }
}
</script>

<style>
.animatepanel{
  padding:20px;
  height:100%;
  width:100%;
  position:absolute;
  background-color:#F4F9FB;
}
.panelcolumn{
  width:25%;
}
.padding-5{
  padding:5px;
}
.withoutmargin{
  margin:0px !important;
}
.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 23px;
    height: 24px;
    border: 0;
    background: url('http://localhost:8080/public/icons/month.png');
    cursor: pointer;
}
.slider::-moz-range-thumb {
    width: 23px;
    height: 25px;
    border: 0;
    background: url('http://localhost:8080/public/icons/month.png');
    cursor: pointer;
}
</style>