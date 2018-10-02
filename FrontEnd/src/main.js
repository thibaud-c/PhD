import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './Main.vue'
import Admin from './Admin.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import circleSlider from 'vue-circle-slider'

// Import external librairies
Vue.use(Vuetify,{
  iconfont: ['fa', 'md', 'mdi', 'mdi', 'fa4']
})
Vue.use(circleSlider)
Vue.use(VueRouter)

//Event & RestApi handlers 
window.RestAPI = new Vue();
window.Event = new Vue();

const routes = [
  { name: 'appmain', path: '', component: Main },
  { name: 'admin', path: '/administration', component: Admin },
  { path: '*', redirect: '' }
]

const router = new VueRouter({
    routes 
})

// Root instance
new Vue({
  router,
  render: h => h(Main)
}).$mount('#app')
