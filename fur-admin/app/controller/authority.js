'use strict';
/** 产品管理controller层
 * @param ordersManagerController
 */
const Controller = require('egg').Controller;

class AuthorityController extends Controller {
  // 获取权限信息
  async getAuthority() {
    const { ctx } = this;

    try {
      const result = await this.service.authority.getAuthority();
      ctx.body = {
        code: 0,
        message: '获取权限数据成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '获取权限数据失败！',
        data: null,
      };
      throw e;
    }
  }
  // 添加权限信息
  async addAuthority() {
    const { ctx } = this;
    const result = await this.service.authority.addAuthority();
    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '增加权限成功！',
        data: null,
      };
    } else if (result === 1) {
      ctx.body = {
        code: 1,
        message: '该权限已存在！',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '增加权限失败!',
        data: null,
      };
    }
  }
  // 编辑权限数据
  async updateAuthority() {
    const { ctx } = this;
    try {
      await this.service.authority.updateAuthority();

      ctx.body = {
        code: 0,
        message: '修改权限成功!',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '修改权限失败!',
        data: null,
      };
    }
  }
  // 删除商品操作
  async deleteAuthority() {
    const { ctx } = this;
    const result = await this.service.authority.deleteAuthority();
    if (result) {
      ctx.body = {
        code: 0,
        message: '删除权限成功!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除权限失败!',
        data: null,
      };
    }
  }
  async getAuthorityDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.authority.getAuthorityDetail();
      ctx.body = {
        code: 0,
        message: '查询权限详情成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询权限详情失败!',
        data: null,
      };
      throw e;
    }
  }
  // 获取所有权限
  async getAllAuthority() {
    const { ctx } = this;
    try {
      const result = await this.service.authority.getAllAuthority();

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
  // 查询某个员工当前权限
  async getStaffAuthority() {
    const { ctx } = this;

    try {
      const result = await this.service.authority.getStaffAuthority();

      ctx.body = {
        code: 0,
        message: '获取权限成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '获取权限失败!',
        data: null,
      };
      throw e;
    }
  }
  // 设置当前员工权限
  async setStaffAuthority() {
    const { ctx } = this;

    const result = await this.service.authority.setStaffAuthority();

    if (result) {
      ctx.body = {
        code: 0,
        message: '设置权限成功!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '设置权限失败!',
        data: null,
      };
    }
  }
}
module.exports = AuthorityController;
