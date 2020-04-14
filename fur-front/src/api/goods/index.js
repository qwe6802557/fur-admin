import ajax from "../ajax";
import Store from "@/vuex/store";

//请求产品列表及分页查询
export const reqGoodsList = goods => ajax('/goods/list', goods, 'POST', Store.state.token);
//添加产品
export const reqAddGoods = goods => ajax('/goods/add', goods, 'POST', Store.state.token);
//修改产品
export const reqUpdateGoods = goods => ajax('/goods/update', goods, 'POST', Store.state.token);
//查看产品详情
export const reqGoodsDetail = id => ajax('/goods/detail/' + id, {}, 'GET', Store.state.token);
//删除产品
export const reqDeleteGoods = ids => ajax('/goods/delete', ids, 'POST', Store.state.token);
//查询所有产品
export const reqAllGoods = () => ajax('/goods/allGoods', {}, 'GET', Store.state.token);
