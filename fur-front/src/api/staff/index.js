import ajax from "../ajax";
import Store from "@/vuex/store";

//请求分组及分页查询
export const reqGroupList = staff => ajax('/group/list', staff, 'POST', Store.state.token);
//添加分组
export const reqAddGroup = staff => ajax('/group/add', staff, 'POST', Store.state.token);
//编辑分组
export const reqUpdateGroup = staff => ajax('/group/update', staff, 'POST', Store.state.token);
//删除分组
export const reqDeleteGroup = staff => ajax('/group/delete', staff, 'POST', Store.state.token);
//获取所有分组
export const reqAllGroup = staff => ajax('/group/allGroup', staff, 'POST', Store.state.token);
//某员工踢出分组
export const reqOutGroup = staff => ajax('/group/outStaff', staff, 'POST', Store.state.token);
//请求权限列表
export const reqAuthorityList = authority => ajax('/authority/list', authority, 'POST', Store.state.token);
//请求所有权限
export const reqAllAuthority = () => ajax('/authority/allAuthority', {}, 'GET', Store.state.token);
//请求单个权限
export const reqSingleAuthority = id => ajax('/authority/staff', id, 'GET', Store.state.token);
//设置单个权限
export const reqAuthoritySet = ids => ajax('/authority/set', ids, 'POST', Store.state.token);
//添加权限
export const reqAddAuthority = authority => ajax('/authority/add', authority, 'POST', Store.state.token);
//修改权限
export const reqUpdateAuthority = authority => ajax('/authority/update', authority, 'POST', Store.state.token);
//删除权限
export const reqDeleteAuthority = authority => ajax('/authority/delete', authority, 'POST', Store.state.token);
//请求员工及其下列表
export const reqStaffList = staff => ajax('/staff/list', staff, 'POST', Store.state.token);
//添加员工
export const reqAddStaff = staff => ajax('/staff/add', staff, 'POST', Store.state.token);
//编辑员工
export const reqUpdateStaff = staff => ajax('/staff/update', staff, 'POST', Store.state.token);
//删除员工
export const reqDeleteStaff = staff => ajax('/staff/delete', staff, 'POST', Store.state.token);

