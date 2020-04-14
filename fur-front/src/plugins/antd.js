import Vue from 'vue';
import { Menu, Icon, Card, Steps, Form, Input,
  Button, Tag, Table, Drawer, Row, Col, Select,
  message,notification, Spin, LocaleProvider, Modal,
  Checkbox, Upload, Badge, List, DatePicker, InputNumber,
  Descriptions, Radio, Rate } from 'ant-design-vue';
import moment from "moment";

const Item = Form.Item;
const Option = Select.Option;
Vue.prototype.$form = Form;
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$moment = moment;
Vue.use(Menu).use(Icon).use(Card).use(Steps)
  .use(Form).use(Item).use(Input).use(Button)
  .use(Tag).use(Table).use(Drawer).use(Row).use(Col)
  .use(Select).use(Option).use(Spin).use(LocaleProvider)
  .use(Modal).use(Checkbox).use(Upload).use(Badge).use(List)
  .use(DatePicker).use(InputNumber).use(Descriptions).use(Radio)
  .use(Rate);
