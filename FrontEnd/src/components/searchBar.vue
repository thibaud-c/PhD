<template lang="pug">

	#sb-search.sb-search.levelOneIndex
		form
			input#search.sb-search-input(v-model="address" :placeholder='text.searchbar.fr', type='search', value='', name='search')
			input.sb-search-submit(@click="geocodeAddress()" value='')
			span.sb-icon-search

		v-snackbar(v-model='snackbar' left :timeout='timeout' top color='cyan darken-2') {{ camMovedto }}
			v-btn(color='white' flat @click='snackbar = false') {{text.close.fr}}
</template>

<script>
	
	require('./../assets/css/searchBar.css');
	require('./../js/searchBar/classie.js');
	require('./../js/searchBar/uisearch.js');

	export default {
	    
		data () {
			return {
				text:{
					searchbar:{
						fr:"Chercher une localité .."	
					},
					close:{
						fr:"Fermer"
					}
				},
				address:'',
				snackbar: false,
			    timeout: 6000,
			    camMovedto:''
			}
		}, 
		methods:{
			
			geocodeAddress(){
				if(this.address!==''){
					console.log(this.address);
					Event.$emit('fireSearchAddress', this.address);
					console.log('##__EMIT ->  fireSearchAddress__##');
				}
			}
		},
		mounted() {
			new UISearch( document.getElementById( 'sb-search' ) );

			Event.$on('fireShowAdressSnack', (message) => {

		          this.camMovedto= message;
		          this.snackbar=true;
	        });

		}
	}

</script>
	
<style>
  .levelOneIndex{
  	z-index:0;
  }
</style>