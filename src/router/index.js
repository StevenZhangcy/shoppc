import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login'
import Home from '@/components/home'
import Users from '@/components/user'
import Rights from '@/components/right'
import Roles from '@/components/roles'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: Users
    },
    {
      name: 'rights',
      path: '/rights',
      component: Rights
    },
    {
      name: 'roles',
      path: '/roles',
      component: Roles
    }]
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    // 如果去的不是登录 -->是否有token 
    // 如果有 --->next() 如果没有就去login
    if (!localStorage.getItem('token')) {
      Message.warning("请先登录");
      router.push({
        name: 'login'
      })
    } else {
      next()
    }
  }
})
export default router
