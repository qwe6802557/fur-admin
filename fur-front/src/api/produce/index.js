import ajax from "../ajax";
import Store from "@/vuex/store";

//查询生产配件列表
export const reqProducePackage = produce => ajax('/producePackage/list', produce, 'POST', Store.state.token);
//新增生产配件计划
export const reqAddProducePackage = produce => ajax('/producePackage/add', produce, 'POST', Store.state.token);
//更新生产配件计划
export const reqUpdateProducePackage = produce => ajax('/producePackage/update', produce, 'POST', Store.state.token);
//删除生产配件计划
export const reqDeleteProducePackage = produce => ajax('/producePackage/delete', produce, 'POST', Store.state.token);
//查询生产产品列表
export const reqProduceGoods = produce => ajax('/produceGoods/list', produce, 'POST', Store.state.token);
//新增生产配件计划
export const reqAddProduceGoods = produce => ajax('/produceGoods/add', produce, 'POST', Store.state.token);
//更新生产配件计划
export const reqUpdateProduceGoods = produce => ajax('/produceGoods/update', produce, 'POST', Store.state.token);
//删除生产配件计划
export const reqDeleteProduceGoods = produce => ajax('/produceGoods/delete', produce, 'POST', Store.state.token);
