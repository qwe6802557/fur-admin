import ajax from './ajax'
import Memory from '@/untils/memoryUntil'
//设置本地服务器IP端口前缀
const LOCALURL='http://127.0.0.1:7001';
/**
 *登录及产品管理区域
 */
//token是否过期验证请求
export const reqValiateToken=()=>ajax(LOCALURL+'/verify/token',{},"POST",Memory.token);
//获取验证码请求 不用token验证
export const reqValiateImg=()=>ajax(LOCALURL+'/verify/verify_code');
//找回密码获取验证码请求 不用token验证
export const reqMesCode=mobile=>ajax(LOCALURL+"/verify/mes_code",mobile,"POST");
//找回密码发送验证请求  不用token验证
export const reqValiateMes=message=>ajax(LOCALURL+"/verify/valiate_code",message,"POST");
//找回密码确认重置请求  不用token验证
export const reqReset=message=>ajax(LOCALURL+"/user/reset",message,"POST");
//登录请求 不用token验证
export const reqLogin=user=>ajax(LOCALURL+'/user/login',user,'POST');
//注册请求 不用token验证
export const reqRegistor=user=>ajax(LOCALURL+'/user/registor',user,'POST');
//退出请求 需要token验证
export const reqLoginOut=()=>ajax(LOCALURL+'/user/login_out',{}, 'POST',Memory.token);
//获取未处理信息列表
export const reqMainMessage =()=>ajax(LOCALURL+'/user/main_message', {}, 'GET', Memory.token);
//根据token取登录信息请求 需要token验证
export const reqLoginMes=()=>ajax(LOCALURL+'/user/userInfo',{},'GET',Memory.token);
//获取产品及分页列表 需要token验证
export const reqProduct=page=>ajax(LOCALURL+'/goods/list',page,'GET',Memory.token);
//添加产品请求 需要token验证
export const reqAddProduct=product=>ajax(LOCALURL+'/goods/add',product,'POST',Memory.token);
//编辑产品获取请求 需要token验证
export const reqGetProduct=id=>ajax(LOCALURL+'/goods/edit',id,'GET',Memory.token);
//编辑产品提交请求 需要token验证
export const reqEditProduct=product=>ajax(LOCALURL+'/goods/edit',product,'POST',Memory.token);
//删除产品提交请求 需要token验证
export const reqDelProduct=id=>ajax(LOCALURL+'/goods/delete',id,'POST',Memory.token);
//批量删除产品提交请求，需要token验证
export const reqDelMany=arr=>ajax(LOCALURL+'/goods/deleteMany',arr,'POST',Memory.token);
//模糊搜索产品提交请求，需要token验证
export const reqSearch=condition=>ajax(LOCALURL+'/goods/search',condition,'POST',Memory.token);
//移除图片删除请求 需要token验证
export const reqDeletePic=picture=>ajax(LOCALURL+'/upload/delete',picture,'POST',Memory.token);
/**
 *配件管理区域
 */
//获取配件一级列表 需要token验证
export const reqCategory=page=>ajax(LOCALURL+'/category/list',page,'GET',Memory.token);
//添加配件一级列表 需要token验证
export const reqAddCategory=category=>ajax(LOCALURL+'/category/add',category,'POST',Memory.token);
//编辑获取配件一级列表 需要token验证
export const reqGetCategory=id=>ajax(LOCALURL+'/category/update/'+id,{},'GET',Memory.token);
//编辑提交配件一级列表 需要token验证
export const reqEditCategory=category=>ajax(LOCALURL+'/category/update',category,'POST',Memory.token);
//删除配件列表 需要token验证
export const reqDeleteCategory=id=>ajax(LOCALURL+'/category/delete/'+id,{},'POST',Memory.token);
//模糊搜索配件 需要token验证
export const reqSearchCategory=condition=>ajax(LOCALURL+'/category/search',condition,'GET',Memory.token);

