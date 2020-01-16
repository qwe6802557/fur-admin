// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import memoryUntil from '@/untils/memoryUntil'
import storeUntil from '@/untils/storeUntil'
import VueLazyLoad from 'vue-lazyload'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
/*import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'*/  //样式三选一
import 'default-passive-events'
import GeminiScrollbar from 'vue-gemini-scrollbar'
import {Form,FormItem,Input,RadioGroup,Radio,
        Button,Icon,Menu,MenuItem,MenuItemGroup,
        Submenu,Avatar,Row,RadioButton,Card,Table,
        TableColumn,Popover,Tag,Select,Option,Divider,
        Pagination,Loading,Dialog,DatePicker,Col,TimePicker,
        InputNumber,Upload,Drawer,Scrollbar,checkboxGroup,checkbox, Badge}from "element-ui";
Vue.use(Form).use(FormItem).use(Input).use(RadioGroup).use(Radio).use(Button).use(Icon).use(Menu).use(MenuItem).use(MenuItemGroup).use(Submenu).use(RadioButton)
   .use(Avatar).use(Row).use(RadioButton).use(Card).use(Table).use(TableColumn).use(Popover).use(Tag).use(Select).use(Option).use(Divider)
   .use(Pagination).use(Loading).use(Dialog).use(DatePicker).use(Col).use(TimePicker).use(InputNumber).use(Upload).use(Drawer).use(VueLazyLoad)
   .use(VueQuillEditor).use(GeminiScrollbar).use(Scrollbar).use(checkboxGroup).use(checkbox).use(Badge);
Vue.config.productionTip = false
memoryUntil.token=storeUntil.getToken();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
