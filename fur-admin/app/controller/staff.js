'use strict';
/** 分组管理controller层
 * @param ordersManagerController
 */
const Controller = require('egg').Controller;

class StaffController extends Controller {
  // 获取员工信息
  async getStaff() {
    const { ctx } = this;

    try {
      const result = await this.service.staff.getStaff();
      ctx.body = {
        code: 0,
        message: '获取员工数据成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 0,
        message: '获取员工数据失败！',
        data: null,
      };
      throw e;
    }
  }
  // 添加员工信息
  async addStaff() {
    const { ctx } = this;
    const result = await this.service.staff.addStaff();
    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '增加员工成功！',
        data: null,
      };
    } else if (result === 1) {
      ctx.body = {
        code: 1,
        message: '该员工已存在！',
        data: null,
      };
    } else if (result === 2) {
      ctx.body = {
        code: 2,
        message: '该员工账号已存在！',
        data: null,
      };
    } else if (result === 3) {
      ctx.body = {
        code: 3,
        message: '该员工手机号已存在！',
        data: null,
      };
    } else if (result === 4) {
      ctx.body = {
        code: 4,
        message: '该员工邮箱已存在！',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '增加员工失败!',
        data: null,
      };
    }
  }
  // 编辑员工数据
  async updateStaff() {
    const { ctx } = this;
    try {
      await this.service.staff.updateStaff();

      ctx.body = {
        code: 0,
        message: '修改分组成功!',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '修改分组失败!',
        data: null,
      };
    }
  }
  // 删除员工操作
  async deleteStaff() {
    const { ctx } = this;
    const result = await this.service.staff.deleteStaff();
    if (result) {
      ctx.body = {
        code: 0,
        message: '删除员工成功!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除员工失败!',
        data: null,
      };
    }
  }
  async getGroupDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.staff.getGroupDetail();
      ctx.body = {
        code: 0,
        message: '查询分组详情成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询分组详情失败!',
        data: null,
      };
      throw e;
    }
  }
  // 获取所有分组
  async getAllStaff() {
    const { ctx } = this;
    try {
      const result = await this.service.staff.getAllStaff();

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
module.exports = StaffController;
