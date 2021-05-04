import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/ant-design-vue.js'
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$qs = qs
axios.defaults.withCredentials = true
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
