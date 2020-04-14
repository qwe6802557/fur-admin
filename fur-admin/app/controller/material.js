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

  async getAllMaterial() {
    const { ctx } = this;

    try {
      const result = await this.service.material.getAllMaterial();
      ctx.body = {
        code: 0,
        message: '查询成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询失败!',
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
      throw e;
    }
  }
  async addMaterial() {
    const { ctx } = this;
    const result = await this.service.material.addMaterial();

    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '原料入库成功!',
        data: null,
      };
    } else if (result === 1) {
      ctx.body = {
        code: 1,
        message: '该原料已存在!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '入库失败!',
        data: null,
      };
    }
  }
  async editMaterialGet() {
    const { ctx } = this;
    try {
      const result = await this.service.material.editMaterialGet();
      ctx.body = {
        code: 0,
        message: '查询原料成功!',
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
        message: '更新原料成功',
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '更新原料失败！',
      };
      throw e;
    }
  }
  async deleteMaterial() {
    const { ctx } = this;
    const result = await this.service.material.deleteMaterial();

    if (result) {
      ctx.body = {
        code: 0,
        message: '删除原料成功!',
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除原料失败!',
      };
    }
  }
}
module.exports = MaterialController;
