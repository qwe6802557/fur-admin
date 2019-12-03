// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import memoryUntil from '@/untils/memoryUntil'
import storeUntil from '@/untils/storeUntil'
import VueLazyLoad from 'vue-lazyload'
import VueSocketIO from 'vue-socket.io'
import 'default-passive-events'
import {Form,FormItem,Input,RadioGroup,Radio,
        Button,Icon,Menu,MenuItem,MenuItemGroup,
        Submenu,Avatar,Row,RadioButton,Card,Table,
        TableColumn,Popover,Tag,Select,Option,Divider,
        Pagination,Loading,Dialog,DatePicker,Col,TimePicker,
        InputNumber,Upload,Drawer} from "element-ui";
Vue.use(Form).use(FormItem).use(Input).use(RadioGroup).use(Radio).use(Button).use(Icon).use(Menu).use(MenuItem).use(MenuItemGroup).use(Submenu).use(RadioButton)
   .use(Avatar).use(Row).use(RadioButton).use(Card).use(Table).use(TableColumn).use(Popover).use(Tag).use(Select).use(Option).use(Divider)
   .use(Pagination).use(Loading).use(Dialog).use(DatePicker).use(Col).use(TimePicker).use(InputNumber).use(Upload).use(Drawer).use(VueLazyLoad)
   .use(new VueSocketIO({
     debug: true,
     connection: 'http://127.0.0.1:7001'
   }));
Vue.config.productionTip = false
memoryUntil.token=storeUntil.getToken();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  sockets:{
    customEmit:function (val) {
    }
  }
})
