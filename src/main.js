// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import '@/assets/base.css'
import Http from '@/plugins/http.js'
import Mybread from '@/components/Mybread'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Http)
// 面包屑组件
Vue.component(Mybread.name, Mybread)
// 时间过滤器
Vue.filter('forDate', function (v) {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
