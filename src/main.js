import Vue from 'vue'
import App from './components/App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'vue-loaders/dist/vue-loaders.css';
import * as VueLoaders from 'vue-loaders';


// Import external librairies
Vue.use(Vuetify, VueAxios, axios, VueLoaders)

//Event & RestApi handlers 
window.RestAPI = new Vue();
window.Event = new Vue();


// Root instance
new Vue({
  // Point d'entrée du composant #App, import de App.vue
  el: '#App',
  render: h => h(App),
})
