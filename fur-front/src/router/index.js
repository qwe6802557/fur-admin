import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
} //解决vue-router路由多次跳转报错
export default new Router({
  routes: [
    {
      path: '/admin',
      name: 'Admin',
      component: ()=>import('@/views/admin/index.vue'),
      redirect:'/admin/home',
      children:[
        {
          path:'home',
          name:'Home',
          component:()=>import('@/views/home/index.vue')
        },
        {
          path:'product',
          name:'Product',
          component:()=>import('@/views/product/index.vue')
        },
        {
          path:'material',
          name:'Material',
          component:()=>import('@/views/material/index.vue')
        },
        {
          path:'produce',
          name:'Produce',
          component:()=>import('@/views/produce/index.vue')
        }
      ]
    },
    {
      path:'/',
      name:'Main',
      component:()=>import('@/views/main/index.vue'),
      redirect:'/login',
      children:[
        {
          path:'login',
          name:'Login',
          component:()=>import('@/views/main/Login/index.vue'),
        },
        {
          path:'registor',
          name:'Registor',
          component:()=>import('@/views/main/Registor/index.vue'),
        },
        {
          path:'reset',
          name:'Reset',
          component:()=>import('@/views/main/Reset/index.vue')
        }
      ]
    }
  ]
})
