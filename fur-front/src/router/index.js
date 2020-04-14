import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
return originalPush.call(this, location).catch(err => err)
};//解决vue-router路由多次跳转报错
export default new Router({
  routes: [
    {
      path: '/auth',
      name: 'Admin',
      component: ()=>import('@/views/admin/index.vue'),
      redirect:'/auth/home',
      children:[
        {
          path:'home',
          name:'Home',
          component:() => import('@/views/home/index.vue')
        }, {
          path:'materialCategory',
          name:'Category',
          component:() => import('@/views/material/Category')
        }, {
          path:'material/:category_id',
          name:'Material',
          component:() => import('@/views/material/Material')
        }, {
          path:'materialDetail',
          name:'Detail',
          component:() => import('@/views/material/MaterialDetail')
        }, {
          path:'package',
          name:'Package',
          component:() => import('@/views/package/Package')
        }, {
          path:'package/detail/:id',
          name:'Package',
          component:() => import('@/views/package/PackageDetail')
        }, {
          path:'package/addOrEditPackage',
          name:'AddPackage',
          component:() => import('@/views/package/AddPackage')
        },{
          path:'produce/addOrEditPackage',
          name:'AddPackage',
          component:() => import('@/views/produce/AddPackage')
        }, {
          path:'produceGoods',
          name:'ProduceGoods',
          component:() => import('@/views/produce/ProduceGoods')
        }, {
          path:'produceGoods/detail',
          name:'ProduceGoodsDetail',
          component:() => import('@/views/produce/ProduceGoodsDetail')
        }, {
          path:'producePackage',
          name:'ProducePackage',
          component:() => import('@/views/produce/ProducePackage')
        }, {
          path:'producePackage/detail',
          name:'ProducePackageDetail',
          component:() => import('@/views/produce/ProducePackageDetail')
        }, {
          path:'machine',
          name:'Machine',
          component:() => import('@/views/machine/Machine')
        }, {
          path:'machine/detail',
          name:'MachineDetail',
          component:() => import('@/views/machine/MachineDetail')
        }, {
          path:'goods',
          name:'Goods',
          component:() => import('@/views/goods/Goods')
        }, {
          path:'goods/addOrEditGoods',
          name:'AddGoods',
          component:() => import('@/views/goods/AddGoods')
        }, {
          path:'goods/detail/:id',
          name:'GoodsDetail',
          component:() => import('@/views/goods/GoodsDetail')
        }, {
          path:'approve',
          name:'Approve',
          component:() => import('@/views/approve/Approve')
        }, {
          path:'approve/detail/:id',
          name:'ApproveDetail',
          component:() => import('@/views/approve/ApproveDetail')
        }, {
          path:'picCode',
          name:'PicCode',
          component:() => import('@/views/picCode/PicCode')
        }, {
          path:'staff/staffList',
          name:'StaffList',
          component:() => import('@/views/staff/StaffList')
        }, {
          path:'staff/authority',
          name:'Authority',
          component:() => import('@/views/staff/Authority')
        }, {
          path:'staff/group',
          name:'Group',
          component:() => import('@/views/staff/Group')
        }, {
          path:'merchant',
          name:'Merchant',
          component:() => import('@/views/merchant/Merchant')
        }, {
          path:'merchant/detail/:id',
          name:'MerchantDetail',
          component:() => import('@/views/merchant/MerchantDetail')
        }, {
          path:'order',
          name:'Order',
          component:() => import('@/views/merchant/Order')
        }
      ]
    },
    {
      path:'/',
      name:'Main',
      component:() => import('@/views/main/index.vue'),
      redirect:'/login',
      children:[
        {
          path:'login',
          name:'Login',
          component:() => import('@/views/main/login'),
        }, {
          path:'register',
          name:'Register',
          component:() => import('@/views/main/register'),
        },{
          path:'validate',
          name:'Validate',
          component:() => import('@/views/main/validate'),
        },{
          path:'reset',
          name:'Reset',
          component:() => import('@/views/main/reset')
        }
      ]
    }
  ]
})
