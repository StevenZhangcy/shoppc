import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        // 要渲染的视图区域,在登录页面完成之后的嵌套路由中写 不然就是重新刷新一个页面了
        {name: 'users', path: '/users', component: User}
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
