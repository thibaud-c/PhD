<!--
MIT License

Copyright (c) [2018] [Thibaud Chassin]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->
<template lang="pug">
#ArtifactsDescription(v-if="isDescriptionWizardOpen")
  //Wizard artifacts
  freqDescription.artifact-wizard(v-if="context==='FREQUENCY'")
  custDescription.artifact-wizard(v-if="context==='CUSTOM'")
</template>

<script>

import freqDescription from './frequencyDescription.vue'
import custDescription from './customDescription.vue'

export default {
  components : {
    freqDescription,
    custDescription
  },
  data (){
  	return {
      isDescriptionWizardOpen:false,
      context:""
	}
  },
  methods: {
  }, 
  mounted(){
  	Event.$on('fireShowFrequencyDescription', (data) => {
  		this.isDescriptionWizardOpen=true;
    });
    Event.$on('fireUpdateContextToCustom', () => {
      this.context='CUSTOM';
    });
    Event.$on('fireUpdateContextToFrequency', () => {
      this.context='FREQUENCY';
    });
  }

}
</script>

<style>
.artifact-wizard{
  position: absolute; 
  top: 50px; 
  right: 10px;
  z-index: 1;
  overflow:auto;
  height: 85%;
  width:350px;
}

</style>