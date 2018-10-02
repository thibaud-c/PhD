<template lang="pug">
#float
	// Open Layers Div
	#ol(v-show='is2DMapsMode')
		#miniplan.maps.ol
		v-btn.mapsactivator(flat icon small color='primary' @click='is2DMapsMode=false;isStreetViewMode=true;isNoMapsMode=false')
			v-icon fas fa-street-view

	// Street view Div			
	#sv(v-show='isStreetViewMode')
		#streetview.maps.sv
		v-btn.mapsactivator(flat icon small color='primary' @click='isNoMapsMode=true;isStreetViewMode=false')
			v-icon fas fa-ban
	
	// Without Maps
	#nomaps(v-show='isNoMapsMode')
		v-btn.mapsactivator(flat icon small color='primary' @click='is2DMapsMode=true;isNoMapsMode=false')
			v-icon fas fa-map

	// 2D Maps
	a.map2dbtn(v-show='is3Dscene')
		v-avatar(size="60" tile @click='setAboveView()')
			img(src='/icons/2dmap.png')
</template>

<script>
	// Imports Openlayers
	require('ol/ol.css')
	import { Map, View, Feature }  from 'ol';
	import { Point }  from 'ol/geom';
	import {Control} from 'ol/control'
	import {defaults as defaultInteractions, Translate, Select} from 'ol/interaction.js';
	import {pointerMove} from 'ol/events/condition.js';
	import {Collection} from 'ol/Collection.js';
	import { Style, Icon }  from 'ol/style';
	let sourceVector = require('ol/source');
	let layerVector = require('ol/layer');
	let proj = require('ol/proj.js')
	import TileLayer from 'ol/layer/Tile';
	import XYZ from 'ol/source/XYZ';

	// Import config 
	import initScene from "./../assets/scene-initialisation.json" 



	export default {
		data () {
			return {
				isStreetViewMode:false,
				is2DMapsMode:true,
				isNoMapsMode:false,
				currentCameraPositionLat:initScene.POSITION_INIT.lat,
				currentCameraPositionLon:initScene.POSITION_INIT.lon,
				currentCameraPositionAz:0,
				is3Dscene:true,
			}		
		},
		mounted(){
			  // Map updates : get position & azimut from the camera (update marker position)
			  Event.$on('Update2Dmap',(camPosition, camDirection, azimut, zoom) => {

			  	this.currentCameraPositionLat = camPosition[1];
			  	this.currentCameraPositionLon = camPosition[0];
			  	this.currentCameraDirectionLat = camDirection[0];
			  	this.currentCameraDirectionLon = camDirection[1];
			  	this.currentCameraPositionAz = azimut;
			  	
			  	map.getView().setCenter(proj.fromLonLat([this.currentCameraDirectionLon,this.currentCameraDirectionLat]));
			  	map.getView().setZoom(zoom);
			  	iconFeature.setGeometry(new Point(new proj.transform([this.currentCameraDirectionLon,this.currentCameraDirectionLat], 'EPSG:4326', 'EPSG:3857')));
			  	iconFeature.getStyle().getImage().setRotation(this.currentCameraPositionAz+Math.PI/2);

			  	panorama.setPosition({
			  		lat: this.currentCameraDirectionLat, 
			  		lng: this.currentCameraDirectionLon})
			  	panorama.setPov({
			  		heading: this.currentCameraPositionAz,
	                pitch: 0 	
	            })
			  });

 			

			  //save position and set map center
			  var iconFeature = new Feature({
			    geometry: new Point(proj.transform([this.currentCameraPositionLon,this.currentCameraPositionLat], 'EPSG:4326', 'EPSG:3857'))
			  });
			  
			  // ADD marker position
			  var iconStyle = new Style({
			    image: new Icon(({
			      anchor: [0.5, 46],
		          anchorXUnits: 'fraction',
		          anchorYUnits: 'pixels',
		          scale: 0.15,
			      src: '/icons/gps.png'
			    }))
			  })
			  iconFeature.setStyle(iconStyle);

			  var vectorSource = new sourceVector.Vector({
				features: [iconFeature],
				style:iconStyle
			  });
			  var vectorLayer = new layerVector.Vector({
			    source: vectorSource
			    
			  });
			  //
			  var select = new Select({
		        condition: pointerMove
		      });//new Select();

		      var translate = new Translate({
		        features: select.getFeatures()
		      });

			  /* Add OSM layers */
		  	var map = new Map({
			    target: 'miniplan',
			    type: 'cartodb',
			    maxResolution: 1000,
			    layers: [
				    new TileLayer({ 
				        source: new XYZ({ 
				            url:'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
				            //http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
				        }),
				        opacity: 1
				    }),
				    vectorLayer
				],
				interactions: defaultInteractions().extend([select, translate]),
			    view: new View({
			        center: proj.fromLonLat([this.currentCameraPositionLon,this.currentCameraPositionLat]),
			        zoom: 15
			    })
		    });

		    translate.on('translateend', evt => {
			  evt.features.forEach(feat => {
			  	var coord = feat.getGeometry().getCoordinates();
			  	coord = proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
				var lon = coord[0];
				var lat = coord[1];

				console.log(lon,lat)
				Event.$emit('fireUpdate3DCam', lat, lon);
				console.log('##__EMIT ->  fireUpdate3DCam - '+ lat +','+ lon + '__##');
			    // process every feature
			  })
			})
			  // ADD marker drag controle

			  /*var drag=new Control.DragFeature(vectorLayer,{    
			     'onDrag':function(feature, pixel){
			           console.log(pixel.x);//this can be used to do something else, such as move another feature
			     }
			  });
			  map.addControl(drag);
			  drag.activate();*/
			  /*var translate = new ol.interaction.Translate({
				    features: iconFeature
				});
				map.addInteraction(translate);
				*/

			  /* Add Street View layers */
			  let panorama = new google.maps.StreetViewPanorama(
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
			setAboveView(){
		        Event.$emit('fireAboveViewMode');
				console.log('##__EMIT ->  fireAboveViewMode__##')
			}
		}
	}
</script>

<style>
 .maps{
 	position: fixed !important;
  	bottom:1%;
  	right:1%;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    z-index: 0;
 }
 .ol{
 	width:30%;
  	height:30%;
 }
 .sv{
 	width:40%;
  	height:50%;
 }
 .mapsactivator{
 	position: fixed !important;
  	bottom:2px;
  	right:2px;
 }

 .map2dbtn {
	position: absolute;
	margin-top: 80px;
	right:0;
	width: 0%;
	min-width: 60px;
	height: 60px;
	float: right;
}
</style>

