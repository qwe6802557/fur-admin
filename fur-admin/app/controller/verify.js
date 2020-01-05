'use strict';
/**验证码管理controller层
 * @param verifyController
 */
const Controller = require('egg').Controller;

class VerifyController extends Controller {
    //token过期验证
    async valiateToken(){
        const { ctx } = this;
        ctx.body={
            code:0,
            message:'验证成功！'
        }
    }
    //生成并返回验证码
    async getVerCode() {
        const { ctx } = this;
        let captcha=await this.service.verify.captcha();
        ctx.session.verify_code=captcha.text;
        ctx.response.type="image/svg+xml";
        ctx.body=captcha.data;
    }
    //获取短信验证码
    async getMesCode(){
        const { ctx } = this;
        const {mobile}=ctx.request.body;
        const apiKey='d0a50d6207bbc396ce5863c421873803';
        const randomNum=this.ctx.helper.rand(100000,999999);
        const text="【云片网】您的验证码是"+randomNum;
        try {
            let result=await ctx.curl('http://sms.yunpian.com/v2/sms/single_send.json',{
                method:'POST',
                contentType:'application/x-www-dialog-urlencoded;charset=utf-8',
                data:{
                    apikey:apiKey,
                    text,
                    mobile:mobile
                },
                dataType:'json'
            });
            if (result.data){
                const {code}=result.data;
                if (code===0){
                    ctx.session.mes_code={
                        time:Date.now(),
                        number:randomNum,
                        mobile
                    };
                    ctx.body={
                        code:0,
                        message:'获取验证码成功！'
                    }
                }else {
                    ctx.body={
                        code:1,
                        message:'获取验证码失败！'
                    }
                }
            }else {
                ctx.body={
                    code:1,
                    message:'获取验证码失败！'
                }
            }
        }catch (e) {
            ctx.body={
                code:5,
                message:e
            }
        }
    }
    //验证短信验证码
    async valiateMes(){
        const {ctx}=this;
        const {mes_code,mobile}=ctx.request.body;
        try {
            if (!ctx.session.mes_code){
                return ctx.body={
                    code:4,
                    message:'请点击发送验证码！'
                }
            }
            const {time,number}=ctx.session.mes_code;
            if(ctx.session.mes_code.mobile!=mobile){
                return ctx.body={
                    code:3,
                    message:'发送验证的手机号不一致！'
                }
            }
            if ((Date.now()-time)/1000>60){
                ctx.session.mes_code=null;
                return ctx.body={
                    code:2,
                    message:'验证码已过期，请重新发送！'
                }
            }
            if (number==mes_code){
                ctx.body={
                    code:0,
                    message:'验证成功！'
                }
            }else {
                ctx.body={
                    code:1,
                    message:'验证失败！'
                }
            }
        }catch (e) {
            ctx.body={
                code:5,
                message:e
            }
        }
    }
}

module.exports = VerifyController;