'use strict';

const { Controller } = require('egg');

class MaterialController extends Controller {
  async getMaterialList() {
    const { ctx } = this;
    try {
      const result = await this.service.material.getMaterialList();
      ctx.body = {
        code: 0,
        message: '查询成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '服务器出错，查询失败！',
      };
      throw e;
    }
  }
  async getMaterialUse() {
    const { ctx } = this;
    try {
      const result = await this.service.material.getMaterialUse();
      ctx.body = {
        code: 0,
        message: '查询成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '发生错误，查询配件用途失败！',
      };
      console.log(e);
    }
  }
  async addMaterial() {
    const { ctx } = this;
    try {
      const result = await this.service.material.addMaterial();
      result ? ctx.body = {
        code: 0,
        message: '入库成功！',
      } : ctx.body = {
        code: 1,
        message: '此目录下已存在该配件！',
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '发生错误，入库失败！',
      };
    }
  }
  async editMaterialGet() {
    const { ctx } = this;
    try {
      const result = await this.service.material.editMaterialGet();
      ctx.body = {
        code: 0,
        message: '查询配件成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败!',
      };
    }
  }
  async editMaterialPost() {
    const { ctx } = this;
    try {
      await this.service.material.editMaterialPost();
      ctx.body = {
        code: 0,
        message: '更新配件成功',
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '更新配件失败！',
      };
      throw e;
    }
  }
}
module.exports = MaterialController;
