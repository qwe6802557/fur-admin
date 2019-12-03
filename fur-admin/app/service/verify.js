'use strict';
/**验证码管理service层
 * @param verifyService
 */
const Service=require('egg').Service;
const svgCaptcha=require('svg-captcha');
class VerifyService extends Service{
    //生成并返回验证码service
    async captcha(){
      const captcha=svgCaptcha.create({
          size:4,
          fontSize:50,
          width:100,
          height:40,
          background:'#cc9966'
      });
      return captcha;
    }
}
module.exports=VerifyService;