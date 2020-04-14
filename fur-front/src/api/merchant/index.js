import ajax from "../ajax";
import Store from "@/vuex/store";

//获取商家列表及分页查询
export const reqMerchantList = merchant => ajax('/merchant/list', merchant, 'POST', Store.state.token);
//添加商家
export const reqAddMerchant = merchant => ajax('/merchant/add', merchant, 'POST', Store.state.token);
//修改商家
export const reqUpdateMerchant = merchant => ajax('/merchant/update', merchant, 'POST', Store.state.token);
//删除商家
export const reqDeleteMerchant = id => ajax('/merchant/delete', id, 'POST', Store.state.token);
//查看商家详情
export const reqMerchantDetail = id => ajax('/merchant/detail/' + id, {},  'GET', Store.state.token);
//获取所有商家
export const reqAllMerchant = () => ajax('/merchant/allMerchant', {}, 'GET', Store.state.token);
//获取订单列表及分页查询
export const reqOrderList = order => ajax('/order/list', order, 'POST', Store.state.token);
//添加订单
export const reqAddOrder = order => ajax('/order/add', order, 'POST', Store.state.token);
//修改订单
export const reqUpdateOrder = order => ajax('/order/update', order, 'POST', Store.state.token);
//删除订单
export const reqDeleteOrder = ids => ajax('/order/delete', ids, 'POST', Store.state.token);
//交付订单
export const reqHandleOrder = id => ajax('/order/handle', id, 'POST', Store.state.token);
//获取所有订单
export const reqAllOrder = () => ajax('/order/allOrder', {}, 'GET', Store.state.token);
//查看订单详情
export const reqOrderDetail = id => ajax('/order/detail/' + id, {},  'GET', Store.state.token);
