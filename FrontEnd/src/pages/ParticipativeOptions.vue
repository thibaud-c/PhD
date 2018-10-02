<template lang="pug">
#participation
	v-flex.bottom-position(xs6 offset-xs2 fuild)
		//Menu participation

		v-btn(color="indigo darken-3" dark small @click='OpenaddArtifactPanel()') {{text.title.fr}}
	// Icon clicked here 
	v-avatar.aim-position(size="30" tile)
		img(src="/icons/click.png")
</template>

<script>
	// Config imports
	import addArtifactMenu from "./../components/addArtifactMenu.vue"

	export default {
		components : { 
        // liste des composants utilisés dans la div principale
        addArtifactMenu
      },
		data () {
			return {
			  	text:{
		          	title:{
		            	fr:'Participer'
		          	},
		      	},
				showRMenu: false,
		        x: 0,
		        y: 0,

				participerMenuVisibility:false,
				addCommentaireVisibility:false,
				drawingOptionsVisibility:false,
				emailContent:'',
				commentContent:'',
				nameContent:'',
				participationOptions: [
			        {'toolname':'Copie écran','icon':'fab fa-instagram','action':this.takeScreenShot},
          			{'toolname':'Commentaire','icon':'fas fa-comment-dots','action':this.showComentPanel},
          			{'toolname':'Mode dessin','icon':'fas fa-pencil-alt','action':this.showDrawingPanel},
			    ],
		    }		
		},
		methods:{
			closeMenu(){
		      	Event.$emit('firecloseMenu');
				console.error('firecloseMenu')
			},
			setXYposition(){
				Event.$emit('fireSetXY', window.innerHeight/2, window.innerWidth/2);
				console.log('##__EMIT -> fireSetXY '+ window.innerHeight/2 +' _ '+ window.innerWidth/2 +'__##');
			},
			OpenaddArtifactPanel(){
				this.initgeocode();
		        Event.$emit('fireOpenaddArtifact');
		        console.log('##__EMIT ->  fireOpenaddArtifact __##');
	    	},
	    	initgeocode(){
	        	let yposition = window.innerHeight/2;
				let xposition = window.innerWidth/2;
	        	Event.$emit('fireGetAddressFromPixels', xposition, yposition);
				console.log('##__EMIT ->  fireGetAddressFromPixels__##');
        	},
		},
      	mounted() {
      		Event.$on('fireCloseaddArtifactMenu', () => {
          		this.showRMenu=false;
        	});
        	Event.$on('fireCloseAllMenu', () => {
        		this.closeMenu();
			});
			    //Open add artifact panel
	
	  	}
	}

</script>

<style>
	.bottom-position{
		bottom:2%;
		left:0%;
		z-index: 0;
		position: fixed;
	} 
  	.aim-position{
		position: absolute !important; /* postulat de départ */
    	top: 50%; left: 50%; /* à 50%/50% du parent référent */
    	transform: translate(-50%, -50%); /* décalage de 50% de sa propre taille */
  	}
</style>