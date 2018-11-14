// ** Parameters **//

const axios = require('axios');

import scCameras from './../js/sceneCamerasHandlers.js'
import scControllers from './../js/sceneControllers.js'
// ** Vue Methods **//

export default {
	// Return a literal address from lat long
	getAdressFromPix(lat,long,url){

		let format = "?json=1"
		axios.get(url+lat+","+long+format).then((response) => {
			let city = response.data.city;
			let street = "";
			let number = "";
			console.log(typeof response.data.staddress)
		    if(typeof response.data.staddress !== "string"){
		    	for (let localisation in response.data.loc){
		    		if(typeof response.data.staddress === "string"){
		    			street = response.data.staddress;
		    			number = response.data.stnumber;
		    			break;
		    		}
		    	}
		    }else{
		    	street = response.data.staddress;
		    	number = response.data.stnumber;
		    }
		    let position=[lat,long]
		    
		    console.log(response)
		    console.log('##__EMIT ->  fireUpdateAddress - Success __##')
		    Event.$emit('fireUpdateAddress', street+" "+number+", "+city, position);

		  }).catch(function (error) {
		  	console.log(error)
		  	console.log('##__EMIT ->  fireUpdateAddress - Error __##')
		    Event.$emit('fireUpdateAddress', 'Aucune addresse trouvée...', position);
		  })
	},

	// Récupère lat long from address text
	getPositionfromAddress(address,url){
		let type = "&type=locations"
		let search = "?searchText="

		axios.get(url+search+address+type).then((response) => {
			if(response.data.results.length > 0){
				
		    	let position = scControllers.getSceneCoordinatesfromLonLatHeight(response.data.results[0].attrs.lon,response.data.results[0].attrs.lat,300);
		    	scCameras.setCamPositionFromAbove(position);
		    	
		    	console.log('##__EMIT ->  fireShowAdressSnack - Success __##')
		    	Event.$emit('fireShowAdressSnack', response.data.results[0].attrs.detail);
		    	
		    	}else{
			    	console.log('##__EMIT ->  fireShowAdressSnack - Error __##')
			    	Event.$emit('fireShowAdressSnack', 'Aucune addresse trouvée...');
		    }

		}).catch(function (error) {
		  	console.log(error)
		  	console.log('##__EMIT ->  fireShowAdressSnack - Error __##')
			Event.$emit('fireShowAdressSnack', 'Aucune addresse trouvée...');
		})

	}

}