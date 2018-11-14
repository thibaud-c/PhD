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
#ArtifactsCreation(v-if="isCreationWizardOpen")
  //Wizard artifacts
  freqWizard.artifact-wizard(v-if="context==='FREQUENCY'")
  custWizard.artifact-wizard(v-if="context==='CUSTOM'")
</template>

<script>

import freqWizard from './frequencyWizard.vue'
import custWizard from './customWizard.vue'

export default {
  components : {
    freqWizard,
    custWizard
  },
  data (){
  	return {
      isCreationWizardOpen:false,
      context:""
	}
  },
  methods: {
  }, 
  mounted(){
    
    Event.$on('fireCloseArtifactWizard', () => {
      this.isCreationWizardOpen=false;
    });
    Event.$on('fireOpenArtifactWizard', () => {
      this.isCreationWizardOpen=true;
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
  width:350px;
  height:85%;
}

</style>