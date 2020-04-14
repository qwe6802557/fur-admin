import ajax from "../ajax";
import Store from "@/vuex/store";

/**
 * 机器管理
 * @param machine
 * @returns {Promise<unknown>}
 */
//请求机器列表
export const reqMachineList = machine => ajax('/machine/list', machine, 'POST', Store.state.token);
//添加机器
export const reqAddMachine = machine => ajax('/machine/add', machine, 'POST', Store.state.token);
//修改机器
export const reqUpdateMachine = machine => ajax('/machine/update', machine, 'POST', Store.state.token);
//删除机器
export const reqDeleteMachine = id => ajax('/machine/delete', id, 'POST', Store.state.token);
//请求所有用于生产配件的机器列表
export const reqPackageMachine = type => ajax('/machine/packageMachine', type, 'GET', Store.state.token);
//请求所有用于生产产品的机器列表
export const reqProduceMachine = () => ajax('/machine/produceMachine', {}, 'GET', Store.state.token);
//请求特定条件的生产机器列表
export const reqGoodsMachine = condition =>  ajax('/machine/packageGoods', condition, 'GET', Store.state.token);
