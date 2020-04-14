// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from "@/vuex/store";
//引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
import 'default-passive-events';
import '@/plugins/element';
import '@/plugins/antd';
import '@/public/css/antd.less';
import '@/public/css/reset.css';
//引入eacharts
import echarts from 'echarts';
import animated from 'animate.css';

Vue.use(animated);
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;

/*NProgress.configure({
  easing: 'ease',  // 动画方式
  speed: 500,  // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
});*/
/*// 简单配置
NProgress.inc(0.2);
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })*/


router.beforeEach((to,from,next) => {
  NProgress.start();
  next()
});

router.afterEach(() => {
  NProgress.done()
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
