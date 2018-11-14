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
v-card-title.pb-0.pt-0
  v-layout(row align-center)
    small.font-italic.grey--text {{reverseAdress}}
    v-btn(flat icon small @click="refreshAdress")
      v-icon(small :class="refreshColor") {{refreshIcon}}
</template>

<script>

export default {
  data (){
  	return {
    	reverseAdress:"",
      refreshColor:"grey--text",
      refreshIcon:"fas fa-sync-alt",
	  }  
  },
  methods: {
    refreshAdress(){
      this.refreshColor = "blue--text";
      this.refreshIcon = "fas fa-sync-alt fa-spin"
      let yposition = window.innerHeight/2;
      let xposition = window.innerWidth/2;
      Event.$emit('fireGetAddressFromPixels', xposition, yposition);
      console.log('##__EMIT ->  fireGetAddressFromPixels__##');
    }
  }, 
  mounted(){
    Event.$on('fireUpdateAddress', (address, position) => {
      this.refreshColor = "grey--text";
      this.refreshIcon = "fas fa-sync-alt"
      this.reverseAdress = address;
      Event.$emit('fireUpdateAddressWizard', this.reverseAdress, position);
      console.log('##__EMIT ->  fireUpdateAddressWizard__##');
    });
  }
}
</script>

<style>
</style>