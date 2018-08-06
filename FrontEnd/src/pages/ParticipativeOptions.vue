<template lang="pug">
#participation.allVE(@contextmenu="$easycm($event,$root,1)")
	easy-cm.allVE(:list="data")
	// Menu Flotant
	//v-menu(v-model="showMenu" absolute offset-y :position-x="x" :position-y="y")
		.allVE
		v-list
			v-list-tile(v-for="(action,index) in getActions()" :key="index" @click="")
				//v-icon(light) {{ action.icon }}
				v-list-tile-title {{ action.toolname }}
				v-divider
				



	//span.is-centered.add-border-up.add-visible
		.tag.is-primary.is-small.thematic-Pa-headers.has-text-weight-bold.is-size-7 {{menuname}}
			button.delete.is-small(aria-label="delete", @click="participerMenuVisibility=false;closeMenu();stopdrawing()") 

	//.is-center.columns.put-at-bottom
		.is-fluid.column
			.dropdown.is-up.add-visible(:class="{ 'is-active': participerMenuVisibility }")
				.dropdown-trigger
					a.button.is-rounded.is-focused.thematic-Pa-bottom-menu(aria-haspopup='true', aria-controls='dropdown-menu', @click="participerMenuVisibility=!participerMenuVisibility")
						span.icon.is-small
							i.fas.fa-map-pin.fa-inverse.icon-small(aria-hidden='true') 
						span.has-text-white.has-text-weight-semibold Ajouter à la carte
						span.icon.is-small
							i.fas.fa-angle-up.fa-inverse.icon-small(aria-hidden='true') 

				#dropdown-menu.dropdown-menu(role='menu')
					.dropdown-content.thematic-Pa-sub-menu.add-padding
						.field(v-for='option in participationOptions')
							a.button.is-success.is-outlined.is-inverted(@click='option.action')
								span.icon.is-small
									i.icon-small(aria-hidden='true', :class="option.icon")
								span {{option.toolname}}
						.file
							label.file-label
								input.file-input(type='file', name='Image', id='file', @change='test')
								span.file-cta.button.is-success.is-outlined.is-inverted
									span.file-icon
										i.fas.fa-upload
									span.file-label Import image
	//#quickviewDefault.quickview.sidebar-comment.add-visible(v-if="addCommentaireVisibility")
		header.quickview-header
		
			p.title.add-padding Ajouter un Commentaire 
		.delete.close-panel(@click='addCommentaireVisibility = false')
		hr.dropdown-divider
		.quickview-body
			.quickview-block.add-padding
				.field
				label.label Prénom Nom
				.control
					input.input(type='text', placeholder='Entrez votre Nom et Prénom', value='nameContent', v-model='nameContent')
				.field
				label.label Email
				.control
					input.input(type='email', placeholder='Entrez votre Email (ce dernier ne sera pas visible)', value='emailContent', v-model='emailContent')
				.field
				label.label Commentaire
				.control
					textarea.textarea(placeholder='Entrez votre commentaire', value='commentContent', v-model='commentContent')
				.field.is-grouped.is-grouped-right.add-padding
					.control
						button.button.is-success(@click="addCommentaireVisibility = false; addComment()") Commenter
					.control
						button.button.is-text(@click="addCommentaireVisibility = false") Annuler
	//#optionsdessin.edition-mode.add-visible.thematic-Pa-sub-menu.is-multiline(v-if='drawingOptionsVisibility')
		a.button.is-small.is-primary.add-margin.column.tooltip(data-tooltip="dessiner à main levée", @click="startdrawing") Dessiner
		a.button.is-small.is-primary.add-margin.column.tooltip(data-tooltip="Suprimer la dernière forme dessinée",@click="undodrawing") Undo
		a.button.is-small.is-primary.add-margin.column.tooltip(data-tooltip="Arrêter le mode édition",@click="stopdrawing") Arrêt du dessin
		a.button.is-small.is-success.add-margin.column(@click='stopdrawing();takeScreenShot()') Copie d'écran
		a.button.is-small.is-danger.add-margin.column(@click='stopdrawing();drawingOptionsVisibility = false') Quitter le mode dessin	
	//#aim
		.image.is-64x64.add-visible.aim-position
			img(src="http://localhost:8080/public/icons/sv.png")

</template>

<script>
	// Config imports
	import actionsList from './../assets/participative-actions.json'

	export default {
		data () {
			return {
				data:[{
				      text: 'Play Now',
				      icon: 'iconfont icon-bofang',  //选填 字体图标 class
				      children: [] //选填
				}],
				showMenu: false,
		        x: 0,
		        y: 0,

				menuname:'Participer',
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
			getActions(){
				let actions=[];
				let activeActions = actionsList.filter(action => action.isActive);
				activeActions.forEach((action) => {
          			actions.push(action);
        		})

        		return actions;
			},
			show (e) {
				console.log("open")
		        e.preventDefault()
		        this.showMenu = false
		        this.x = e.clientX
		        this.y = e.clientY
		        this.$nextTick(() => {
		            this.showMenu = true
		        })
		    },
			closeMenu(){
		      	Event.$emit('firecloseMenu');
				console.error('firecloseMenu')
			},
			takeScreenShot(){
		      Event.$emit('fireTakeScreenShot');
		      console.error('fireTakeScreenShot')
		    },
		    showComentPanel(){
		    	this.addCommentaireVisibility = true;
		    	this.participerMenuVisibility=false;
		    },
		    showDrawingPanel(){
		    	this.drawingOptionsVisibility = true;
		    	this.participerMenuVisibility=false;
		    },
			addComment(){
		      Event.$emit('fireAddComment', this.nameContent, this.emailContent, this.commentContent);
		      console.error('fireAddComment')
		    },
		    startdrawing(){
		      Event.$emit('fireStartDrawing');
		      console.error('fireStartDrawing');
		    },
		    stopdrawing(){
		      Event.$emit('fireStopDrawing');
		      console.error('fireStopDrawing');
		    },
		    undodrawing(){
		      Event.$emit('fireUndoDrawing');
		      console.error('fireUndoDrawing');
		    },
		    test(e){
		    	var file = e.target.files[0];
		    	console.log(e)
		    	if(file.type === "image/png" || file.type === "image/jpeg"){

		    		var reader = new FileReader();
		    		reader.onload = (event) => {
		                Event.$emit('fireUploadPicture', event.target.result);
		                console.error('fireUploadPicture')
		                console.log(event.target.result)
		            }
            
            		var img =reader.readAsDataURL(file);
		    	}
		    }

		},
      	mounted() {
        	Event.$on('fireCloseAllMenu', () => {
        		this.stopdrawing();
        		this.participerMenuVisibility=false;
        		this.addCommentaireVisibility=false;
        		this.closeMenu();
			});
	  	}
	}


</script>

<style>
  .allVE{
  	height:100%;
  	width:100%;
  	z-index:2;
  }
  .put-at-bottom{
    bottom: 2%;
    position: absolute;
  }
  .thematic-Pa-headers{
    background-color: rgb(107, 142, 35, 0.6) !important;
  }
  .thematic-Pa-bottom-menu{
    background-color: rgb(107, 142, 35, 0.9) !important;
    border-color: rgb(107, 142, 35, 1) !important;
  }
  .thematic-Pa-sub-menu{
    background-color: rgb(107, 142, 35, 0.3) !important;
  }
  .thematic-Pa-select-camera{

  	background-color: rgb(255, 255, 255, 0) !important;
  	color:rgb(196, 196, 196, 1) !important;
  	text-align: left;
  }
  .thematic-Pa-label{
  	color:rgb(255, 255, 255, 1);
  }
  .add-border-up{
  	padding: 0;
  	position:absolute;
    top:0.5%;
    left: 45%;
    width: 10%;
  }
  .add-visible{
    z-index:3;
  }
  .icon-small{
  	font-size:18px;
  }
  .sidebar-comment{
  	height: 100%;
  	width:30%;
  	position: fixed;
  	right: 0;	
  	box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  	background-color: white;
  	z-index:4;
  }
  .add-padding{
  	padding: 5%;
  }
  .add-margin{
  	margin: 10%;
  	padding: 1%;
  }
  .reduce-margin{
  	margin:0px !important;
  }
  .close-panel{
  	position:absolute;
  	right: 0.5%;
  	top: 0.5%;
  }
  .quickview-header{
  	text-align: center;
	margin-top: 1%;
  }
  .edition-mode{
  	position:fixed;
  	bottom:35%;
  	right:1%;
  	width: 20%;
  }
  .aim-position{
	position: absolute; /* postulat de départ */
    top: 50%; left: 50%; /* à 50%/50% du parent référent */
    transform: translate(-50%, -50%); /* décalage de 50% de sa propre taille */
  }
</style>