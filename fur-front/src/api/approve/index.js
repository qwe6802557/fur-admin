import ajax from "../ajax";
import Store from "@/vuex/store";

//请求审批列表及分页查询
export const reqApproveList = goods => ajax('/approve/list', goods, 'POST', Store.state.token);
//查看审批详情
export const reqApproveDetail = id => ajax('/approve/detail/' + id, {}, 'GET', Store.state.token);
//删除审批
export const reqDeleteApprove = ids => ajax('/approve/delete', ids, 'POST', Store.state.token);
//获取审批人
export const reqApproveId = () => ajax('/user/getApproveId', {}, 'GET', Store.state.token);
//配件提交审批
export const reqApprovePackage = approve => ajax('/approve/package', approve, 'POST', Store.state.token);
//产品提交审批
export const reqApproveProduce = approve => ajax('/approve/goods', approve, 'POST', Store.state.token);
//配件审批通过/不通过
export const reqPassApprovePackage = approve => ajax('/approve/handlePackage', approve, 'POST', Store.state.token);
//产品审批通过/不通过
export const reqPassApproveProduce = approve => ajax('/approve/handleGoods', approve, 'POST', Store.state.token);
