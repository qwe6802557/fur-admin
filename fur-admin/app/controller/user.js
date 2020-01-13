'use strict';
/** 用户管理controller层
 * @param userManagerController
 */
const Controller = require('egg').Controller;

class UserController extends Controller {
  // 用户登录
  async login() {
    const { ctx } = this;
    const result = await this.service.user.login();
    const { code, res } = result;
    if (code === 0) {
      const token = this.app.jwt.sign({
        data: result.data,
      }, this.app.config.jwt.secret, { expiresIn: '0.5h' });
      ctx.body = {
        code,
        message: res + '欢迎您！' + result.data.username,
        token,
      };
    } else {
      ctx.body = {
        code,
        message: res,
      };
    }
  }
  // 用户注册
  async registor() {
    const { ctx } = this;
    const result = await this.service.user.registor();
    const { code, res, data } = result;
    if (code === 0) {
      const token = this.app.jwt.sign({
        data,
      }, this.app.config.jwt.secret, { expiresIn: '1h' });
      ctx.body = {
        code,
        message: res,
        token,
      };
    } else {
      ctx.body = {
        code,
        message: res,
      };
    }
  }

  // 通过token获取用户信息
  async getUserInfo() {
    const { ctx } = this;
    ctx.body = {
      code: 0,
      message: '获取用户信息成功!',
      data: ctx.payload,
    };
  }
  // 重置密码
  async resetPass() {
    const { ctx } = this;
    const result = await this.service.user.resetPass();
    const { code, res } = result;
    ctx.body = {
      code,
      message: res,
    };
  }
  // 退出登录
  async loginOut() {
    const { ctx } = this;
    try {
      await this.service.user.loginOut();
      ctx.body = {
        code: 0,
        message: '退出成功！',
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '退出失败！',
      };
      console.log(e);
    }
  }
}
module.exports = UserController;
