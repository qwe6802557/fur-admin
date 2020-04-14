'use strict';

const { Controller } = require('egg');

class ProducePackage extends Controller {
  async getProducePackage() {
    const { ctx } = this;
    try {
      const result = await this.service.producePackage.getProducePackage();
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

  async addProducePackage() {
    const { ctx } = this;
    const result = await this.service.producePackage.addProducePackage();

    if (result.code === 0) {
      ctx.body = {
        code: 0,
        message: '创建生产计划成功!',
        data: null,
      };
    } else if (result.code === 1) {
      ctx.body = {
        code: 1,
        message: '创建生产计划失败!该配件所需' + result.data.join(',') + '原料数量不足,请检查库存!',
        data: null,
      };
    } else if (result.code === 2) {
      ctx.body = {
        code: 2,
        message: '创建生产计划失败!该分组下不存在员工，请添加!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '创建生产计划失败',
        data: null,
      };
    }
  }


  async updateProducePackage() {
    const { ctx } = this;
    try {
      await this.service.producePackage.updateProducePackage();
      ctx.body = {
        code: 0,
        message: '更新计划成功',
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '更新计划失败！',
      };
      throw e;
    }
  }

  async getProducePackageDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.package.getProducePackageDetail();

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

  async deleteProducePackage() {
    const { ctx } = this;
    const result = await this.service.producePackage.deleteProducePackage();

    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '删除配件计划成功!',
        data: null,
      };
    } else if (result === 1) {
      ctx.body = {
        code: 1,
        message: '有正在运行的生产计划,无法删除!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除失败!',
        data: null,
      };
    }

  }
}

module.exports = ProducePackage;
