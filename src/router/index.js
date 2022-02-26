import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login'
import home from '../views/home'
import Main from '../views/Main'
import users from '../views/user/user'
import rights from '../views/power/limites'
import roles from '../views/power/roles'
import categories from '../views/Category/categories'
import params from '../views/Category/params'
import goods from '../views/Category/goods'
import add from '../views/Category/add'
import orders from '../views/order/orders'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: '/Main',
      children: [
        {path: '/Main',
          name: 'Main',
          component: Main},
        {path: '/users',
          name: 'users',
          component: users},
        {path: '/rights',
          name: 'rights',
          component: rights},
        {path: '/roles',
          name: 'roles',
          component: roles},
        {path: '/categories',
          name: 'categories',
          component: categories},
        {path: '/params',
          name: 'params',
          component: params},
        {path: '/goods',
          name: 'goods',
          component: goods},
        {path: '/add',
          name: 'add',
          component: add},
        {path: '/orders',
          name: 'orders',
          component: orders}
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const strtoken = window.sessionStorage.getItem('token')
  if (!strtoken) next('/login')
  next()
})
export default router
