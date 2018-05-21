<template lang="jade">
#float
	//Carte Open Layers
	#ol(v-show='is2DMapsMode')
		#miniplan.oplmaps.add-visible
		a.button.bottom-position(@click='is2DMapsMode=false;isStreetViewMode=true;initSvMap()')
			span.icon.is-small
				i.fas.fa-street-view

	// Street view 				
	#sv(v-show='isStreetViewMode')
		#streetview.add-visible.svpanel
		a.button.bottom-position(@click='is2DMapsMode=true;isStreetViewMode=false;initSvMap()')
			span.icon.is-small
				i.fas.fa-map
</template>

<script>

	export default {
		data () {
			return {
				isCloseButtonVisible:true,
				isDescriptionViz:false,
				isStreetViewMode:false,
				is2DMapsMode:true,
				current_entity:'',
				currentCameraPositionLat:46.51896931685272,
				currentCameraPositionLon:6.646054582617415,
				currentCameraPositionAz:0,
				olmap:'',
				svmap:'',
				icons:[
				{name:'add_a_photo', atooltip:'Screenshot', action:this.takeScreenShot},
				{name:'chat', atooltip:'Commenter'},
				{name:'content_paste', atooltip:'Sondage'}
					]
			}		
		},
		mounted(){
			  //Maj de la carte en fonction de la position et orientation de la caméra : maj du marker 
			  Event.$on('Update2Dmap',(camPosition, camDirection, azimut) => {
			  	this.currentCameraPositionLat = camPosition[1];
			  	this.currentCameraPositionLon = camPosition[0];
			  	this.currentCameraDirectionLat = camDirection[0];
			  	this.currentCameraDirectionLon = camDirection[1];
			  	this.currentCameraPositionAz = azimut;
			  	
			  	map.getView().setCenter(ol.proj.fromLonLat([this.currentCameraPositionLon,this.currentCameraPositionLat]));
			  	iconFeature.setGeometry(new ol.geom.Point(new ol.proj.transform([this.currentCameraPositionLon,this.currentCameraPositionLat], 'EPSG:4326', 'EPSG:3857')));
			  	iconFeature.getStyle().getImage().setRotation(this.currentCameraPositionAz+Math.PI/2);

			  	panorama.setPosition({
			  		lat: this.currentCameraDirectionLat, 
			  		lng: this.currentCameraDirectionLon})
			  	panorama.setPov({
			  		heading: this.currentCameraPositionAz,
	                pitch: 0 	
	            })
			  });

			  				/* Add OSM layers */
		  var map = new ol.Map({
		      target: 'miniplan',
		      type: 'cartodb',
		      maxResolution: 1000,
		      layers: [
		        new ol.layer.Tile({ 
		          source: new ol.source.XYZ({ 
		              url:'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
		              //http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
		          }),
		          opacity: 1
		        })

		      ],
		      view: new ol.View({
		        center: ol.proj.fromLonLat([this.currentCameraPositionLon,this.currentCameraPositionLat]),
		        zoom: 15
		      })
	       });

			  //save position and set map center
			  var iconFeature = new ol.Feature({
			    geometry: new ol.geom.Point(ol.proj.transform([this.currentCameraPositionLon,this.currentCameraPositionLat], 'EPSG:4326', 'EPSG:3857'))
			  });
			  
			  var iconStyle = new ol.style.Style({
			    image: new ol.style.Icon(({
			      anchor: [0.5, 46],
		          anchorXUnits: 'fraction',
		          anchorYUnits: 'pixels',
		          scale: 0.015,
			      src: 'public/icons/eye_camera.png'
			    }))
			  })
			  iconFeature.setStyle(iconStyle);

			  var vectorSource = new ol.source.Vector({
				features: [iconFeature],
				style:iconStyle
			  });
			  var vectorLayer = new ol.layer.Vector({
			    source: vectorSource
			    
			  });
			  map.addLayer(vectorLayer);

				var panorama = new google.maps.StreetViewPanorama(
	            	document.getElementById('streetview'), {
	              		position: {lat: this.currentCameraPositionLat, lng: this.currentCameraPositionLon},
	              		pov: {
	                		heading: 0,
	                		pitch: 0
	              		},
	              		visible: true
	        	});

		},
		methods:{
			fireCloseMenu(){
				Event.$emit('closebottomMenu');
				this.isCloseButtonVisible = false;
			},
			fireOpenMenu(){
				Event.$emit('openbottomMenu');
				this.isCloseButtonVisible = true;
			},
			takeScreenShot(){
				Event.$emit('fireTakeScreenShot');
				console.error('fireTakeScreenShot')
			},
		}
	}
</script>

<style>
 .oplmaps{
 	position: absolute;
  	bottom:1%;
  	right:1%;
  	width:20%;
  	height:30%;
  	transition: .5s;
    overflow: hidden;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
 }
 .screenshot{
  	color:#e1e1e1;
 }
 .contextmenu{
 	position: absolute;
  	top:66%;
  	left:84%;
  	height: 5%;
  	width: 10%;
  	background-color: rgba(1,1,1,0.3);
  	border-radius: 25px;
 }
 .shortcuts{
 	margin-top: 5%;
 }
 .adddesciptionbouton{
 	position: absolute;
 	top:60%;
  	left:84%;
  	z-index:3;
 }
 .nonedesciptionbouton{
 	position: absolute;
 	top:60%;
  	left:93%;
  	z-index:3;
 }
 .svpanel{
 	position: absolute;
  	bottom:1%;
  	right:1%;
  	width:50%;
  	height:40%;
    z-index: 3;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
 }
 .bottom-position{
 	position:absolute;
 	bottom:0.1%;
 	right:0.1%;
 	z-index: 4;
 }
 .add-visible{
	z-index: 3;
 }

</style>

