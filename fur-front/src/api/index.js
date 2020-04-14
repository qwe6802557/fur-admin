import ajax from './ajax'
import Store from "@/vuex/store";
/*//设置本地服务器IP端口前缀
const LOCALURL='http://127.0.0.1:7001';*/
//获取产品及分页列表 需要token验证
export const reqProduct = page =>ajax('/goods/list',page,'GET',Store.state.token);
//添加产品请求 需要token验证
export const reqAddProduct = product => ajax('/goods/add',product,'POST',Store.state.token);
//编辑产品获取请求 需要token验证
export const reqGetProduct=id=>ajax('/goods/edit',id,'GET',Store.state.token);
//编辑产品提交请求 需要token验证
export const reqEditProduct=product=>ajax('/goods/edit',product,'POST',Store.state.token);
//删除产品提交请求 需要token验证
export const reqDelProduct=id=>ajax('/goods/delete',id,'POST',Store.state.token);
//批量删除产品提交请求，需要token验证
export const reqDelMany=arr=>ajax('/goods/deleteMany',arr,'POST',Store.state.token);
//模糊搜索产品提交请求，需要token验证
export const reqSearch=condition=>ajax('/goods/search',condition,'POST',Store.state.token);
//移除图片删除请求 需要token验证
export const reqDeletePic=picture=>ajax('/upload/delete',picture,'POST',Store.state.token);
/**
 *配件列表区域
 */
//获取配件一级列表 需要token验证
export const reqCategory = page => ajax('/category/list',page,'GET',Store.state.token);
//添加配件一级列表 需要token验证
export const reqAddCategory = category => ajax('/category/add',category,'POST',Store.state.token);
//编辑获取配件一级列表 需要token验证
export const reqGetCategory = id => ajax('/category/update/'+id,{},'GET',Store.state.token);
//编辑提交配件一级列表 需要token验证
export const reqEditCategory = category => ajax('/category/update',category,'POST',Store.state.token);
//删除配件列表 需要token验证
export const reqDeleteCategory = id => ajax('/category/delete',id,'POST',Store.state.token);
//模糊搜索配件 需要token验证
export const reqSearchCategory = condition => ajax('/category/search',condition,'GET',Store.state.token);
/**
 * 配件子列表区域
 */
//子列表分页与搜索 需要token验证
export const reqCategoryDetailQuery = pagination => ajax('/material/list', pagination, 'POST', Store.state.token);
//获取配件用途 需要token验证
export const reqCategoryDetailUse = () => ajax('/material/getDetailUse', {}, 'GET', Store.state.token);
//子列表配件入库 需要token验证
export const reqCategoryDetailAdd = formData => ajax('/material/add', formData, 'POST', Store.state.token);
//子列表单个删除 需要token验证
export const reqCategoryDetailDelete = id => ajax('/material/delete', id, 'POST', Store.state.token);
//子列表批量删除 需要token验证
export const reqCategoryDetailDeleteMany = (category_id , idArr) => ajax('/material/delete', {category_id, idArr}, 'POST', Store.state.token);
//子列表单个编辑获取信息 需要token验证
export const reqCategoryDetailEditGet = (category_id, id) => ajax('/material/edit/' + category_id + '/' + id, {}, 'GET', Store.state.token);
//子列表单个编辑完成 需要token验证
export const reqCategoryDetailEditPost = formData => ajax('/material/edit', formData, 'POST', Store.state.token);

