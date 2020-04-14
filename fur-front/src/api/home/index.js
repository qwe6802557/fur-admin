import ajax from "../ajax";
import Store from "@/vuex/store";

// 获取商家省份分布图
export const reqMerchant = () => ajax('/home/merchant', {}, 'GET', Store.state.token);
// 获取订单分析图
export const reqOrder = () => ajax('/home/order', {}, 'GET', Store.state.token);
// 获取计划分析图
export const reqProduce = () => ajax('/home/produce', {}, 'GET', Store.state.token);
