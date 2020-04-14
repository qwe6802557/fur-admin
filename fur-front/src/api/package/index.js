import ajax from "../ajax";
import Store from "@/vuex/store";

//请求配件列表及分页查询
export const reqPackageList = packageInfo => ajax('/package/list', packageInfo, 'GET', Store.state.token);
//添加配件
export const reqAddPackage = packageInfo => ajax('/package/add', packageInfo, 'POST', Store.state.token);
//修改配件
export const reqUpdatePackage = packageInfo => ajax('/package/update', packageInfo, 'POST', Store.state.token);
//查看配件详情
export const reqPackageDetail = id => ajax('/package/detail/' + id, {}, 'GET', Store.state.token);
//删除配件
export const reqDeletePackage = packageInfo => ajax('/package/delete', packageInfo, 'POST', Store.state.token);
//获取所有原料目录
export const reqAllCategory = () => ajax('/category/allList', {}, 'GET', Store.state.token);
//根据原料目录获取原料列表
export const reqAllMaterial = category_id => ajax('/material/allMaterial', category_id, 'GET', Store.state.token);
//查询所有配件列表
export const reqAllPackage = () => ajax('/package/allPackage', {}, 'GET', Store.state.token);
