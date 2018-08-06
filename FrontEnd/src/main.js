import Vue from 'vue'
import Main from './Main.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import circleSlider from 'vue-circle-slider'


// Import external librairies
Vue.use(Vuetify,{
  iconfont: ['fa', 'md', 'mdi', 'mdi', 'fa4']
})
Vue.use(circleSlider)

//Event & RestApi handlers 
window.RestAPI = new Vue();
window.Event = new Vue();

// Root instance
new Vue({
  // Point d'entrée du composant #App, import de App.vue
  el: '#app',
  render: h => h(Main),

})
