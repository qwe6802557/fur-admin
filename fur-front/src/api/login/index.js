import ajax from "../ajax";
import Store from '@/vuex/store';
/**
 *登录及产品管理区域
 */
//token是否过期验证请求
export const reqValidateToken = () => ajax('/verify/token',{},"POST",Store.state.token);
//获取验证码请求 不用token验证
export const reqValidateImg = () => ajax('/verify/verify_code');
//找回密码获取验证码请求 不用token验证
export const reqMesCode = mobile => ajax("/verify/mes_code",mobile,"POST");
//找回密码发送验证请求  不用token验证
export const reqValidateMes = message => ajax("/verify/valiate_code",message,"POST");
//找回密码确认重置请求  不用token验证
export const reqReset = message => ajax("/user/reset",message,"POST");
//登录请求 不用token验证
export const reqLogin = user => ajax('/user/login',user,'POST');
//注册请求 不用token验证
export const reqRegistor = user => ajax('/user/registor',user,'POST');
//退出请求 需要token验证
export const reqLoginOut = () => ajax('/user/login_out',{}, 'POST',Store.state.token);
//获取未处理信息列表
export const reqMainMessage = () => ajax('/user/main_message', {}, 'GET', Store.state.token);
//根据token取登录信息请求 需要token验证
export const reqLoginMes = () => ajax('/user/userInfo',{},'GET',Store.state.token);
