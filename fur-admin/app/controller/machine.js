'use strict';

const { Controller } = require('egg');

class MaterialController extends Controller {
  async getMachineList() {
    const { ctx } = this;
    try {
      const result = await this.service.machine.getMachineList();
      ctx.body = {
        code: 0,
        message: '查询成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败！',
      };
      throw e;
    }
  }
  async addMachine() {
    const { ctx } = this;
    try {
      await this.service.machine.addMachine();

      ctx.body = {
        code: 0,
        message: '新增机器成功!',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '新增机器失败!',
        data: null,
      };
      throw e;
    }
  }
  async updateMachine() {
    const { ctx } = this;
    try {
      await this.service.machine.updateMachine();
      ctx.body = {
        code: 0,
        message: '更新机器成功',
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '更新机器失败！',
      };
      throw e;
    }
  }
  async deleteMachine() {
    const { ctx } = this;
    try {
      await this.service.machine.deleteMachine();

      ctx.body = {
        code: 0,
        message: '删除机器成功!',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '删除机器失败!',
        data: null,
      };
      throw e;
    }
  }
  async getPackageMachine() {
    const { ctx } = this;

    try {
      const result = await this.service.machine.getPackageMachine();

      ctx.body = {
        code: 0,
        message: '查询成功!',
        data: result,
      };

    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询机器失败!',
        data: null,
      };
      throw e;
    }
  }

  async getGoodsMachine() {
    const { ctx } = this;

    try {
      const result = await this.service.machine.getGoodsMachine();

      ctx.body = {
        code: 0,
        message: '查询成功!',
        data: result,
      };

    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询机器失败!',
        data: null,
      };
      throw e;
    }
  }
}
module.exports = MaterialController;
