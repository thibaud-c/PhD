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
  v-textarea.full-width(color="indigo darken-3" name="com" :label="text.commentlabel.fr" v-model="usercomment" auto-grow @blur="UpdateComment")
</template>

<script>

export default {
  data (){
    return {
      text:{
        commentlabel:{
          fr:'Commentaire libre'
        }
      },
      usercomment:"",
      refreshColor:"grey--text",
      refreshIcon:"fas fa-sync-alt",
	  }  
  },
  methods: {
  	UpdateComment(){
      Event.$emit('fireUpdateComment', this.usercomment);
      console.log('##__EMIT ->  fireUpdateComment__##');
  	}
  }, 
  mounted(){
  }
}
</script>

<style>
</style>