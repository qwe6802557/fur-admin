'use strict';
/** 分组管理controller层
 * @param ordersManagerController
 */
const Controller = require('egg').Controller;

class GroupController extends Controller {
  // 获取分组信息
  async getGroup() {
    const { ctx } = this;

    try {
      const result = await this.service.group.getGroup();
      ctx.body = {
        code: 0,
        message: '获取分组数据成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 0,
        message: '获取分组数据失败！',
        data: null,
      };
      throw e;
    }
  }
  // 添加分组信息
  async addGroup() {
    const { ctx } = this;
    const result = await this.service.group.addGroup();
    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '增加分组成功！',
        data: null,
      };
    } else if (result === 1) {
      ctx.body = {
        code: 1,
        message: '该分组已存在！',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '增加分组失败!',
        data: null,
      };
    }
  }
  // 编辑分组数据
  async updateGroup() {
    const { ctx } = this;
    try {
      await this.service.group.updateGroup();

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
  // 删除分组操作
  async deleteGroup() {
    const { ctx } = this;
    const result = await this.service.group.deleteGroup();
    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '删除分组成功!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除分组失败!',
        data: null,
      };
    }
  }
  /* async getGroupDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.group.getGroupDetail();
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
  }*/
  // 获取所有分组
  async getAllGroup() {
    const { ctx } = this;
    try {
      const result = await this.service.group.getAllGroup();

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
  // 踢出分组
  async outGroup() {
    const { ctx } = this;
    const result = await this.service.group.outGroup();
    if (result) {
      ctx.body = {
        code: 0,
        message: '踢出分组成功!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '踢出分组失败!',
        data: null,
      };
    }
  }
}
module.exports = GroupController;
