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
      }, this.app.config.jwt.secret, { expiresIn: '1h' });
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

    const result_staff = await this.ctx.model.Staff.findOne({
      where: {
        staff_username: ctx.payload.data.username,
      },
      raw: true,
    });

    if (result_staff) {
      const result_authority = await this.ctx.model.StaffAuthority.findAll({
        where: {
          staff_id: result_staff.id,
        },
        raw: true,
        include: this.ctx.model.Authority,
      });

      const authority = result_authority.map(item => item['authority.authority_name']);

      ctx.payload.data.authority = authority;
    }

    ctx.body = {
      code: 0,
      message: '获取用户信息成功!',
      data: ctx.payload,
    };
  }
  // 查询未处理消息
  async getMainMessage() {
    const { ctx } = this;
    try {
      const result = await this.service.user.getMainMessage();
      ctx.body = {
        code: 0,
        message: '查询成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: e,
      };
    }
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
  // 查询审批人
  async getApproveId() {
    const { ctx } = this;

    try {
      const result = await this.service.user.getApproveId();

      ctx.body = {
        code: 0,
        message: '查询成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败!',
        data: null,
      };
      throw e;
    }
  }
}
module.exports = UserController;
