function createOptionsString(options){
	var optionsString = '?';
	var keys = Object.keys(options)
	//Concat des options à l'url
	for(var i=0;i<keys.length;i++){
		optionsString+=keys[i]+'='+ options[keys[i]]+'&'
	}
	return optionsString;
}

export default {
	/**
		Method rest API via axios

		@param methods: (string) méhodes CRUD - get
		@param url: (string) url du service à appeler
		@param options: (obj) liste des options à ajouter à l'url
		@return : (promise) réponse de l'appel
	*/
	restAPI(methods, url, options){
		

		var responsedata = [];

		//Choisi la méthode sélectionnée
		switch(methods){
			
			case 'get':
				//Appel Get
				//Création de la chaine de requete avec 1 résultat
				options.per_page = 1;
				var optionsString = createOptionsString(options);
				//Get
				var promise = axios.get(url+optionsString+'format=json&nojsoncallback=1').then((response) => {
					if(response.data.stat !== 'ok'){
						//ERR
						console.error(response.data.message);	
						return 0
					}
					// ** Traitement de la requète ** //
					//changement à 250 résultat par page
					options.per_page = 250;
					//Calcul du nombre de résultat et boucle sur le nombre de page théorique
					for (var i = 1; i<=(response.data.photos.total/options.per_page);i++){
						options.page = i;
						optionsString = createOptionsString(options);
						//Get sur une page (250photo)
						var prom = axios.get(url+optionsString+'format=json&nojsoncallback=1').then((res) => {
							if(res.data.stat !== 'ok'){
								//ERR
								console.error(res.data.message);	
								return 0
							}
							// ** Traitement de la requète ** //
							//Ajout des photo au tableau réponse
							responsedata = responsedata.concat(res.data.photos.photo);
							return responsedata;
						}).catch((err) =>{
							//ERR
							console.error(err);
							return 0;
						})
					}
					//retourn la promesse
					return prom;
				}).catch((err) =>{
					//ERR
					console.error(err);
					return 0;
				})
	    		break;
	    }		
	    //Return la réponse promise de l'appel
	    return promise;
    }
}