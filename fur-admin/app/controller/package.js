'use strict';

const { Controller } = require('egg');

class Package extends Controller {
  async getPackage() {
    const { ctx } = this;
    try {
      const result = await this.service.package.getPackage();
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

  async getAllPackage() {
    const { ctx } = this;
    try {
      const result = await this.service.package.getAllPackage();

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

  async addPackage() {
    const { ctx } = this;
    const result = await this.service.package.addPackage();

    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '配件入库成功!',
        data: null,
      };
    } else if (result === 1) {
      ctx.body = {
        code: 1,
        message: '该配件已存在!',
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


  async updatePackage() {
    const { ctx } = this;
    try {
      await this.service.package.updatePackage();
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

  async getPackageDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.package.getPackageDetail();

      ctx.body = {
        code: 0,
        message: '查询配件成功',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询配件失败',
        data: null,
      };
    }

  }

  async deletePackage() {
    const { ctx } = this;
    const result = await this.service.package.deletePackage();

    if (result) {
      ctx.body = {
        code: 0,
        message: '删除配件成功!',
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除配件失败!请检查是否有产品配置需要该配件!',
      };
    }

  }
}

module.exports = Package;
