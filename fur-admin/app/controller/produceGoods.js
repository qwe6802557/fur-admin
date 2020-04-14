'use strict';

const { Controller } = require('egg');

class ProduceGoods extends Controller {
  async getProduceGoods() {
    const { ctx } = this;
    try {
      const result = await this.service.produceGoods.getProduceGoods();
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

  async addProduceGoods() {
    const { ctx } = this;
    const result = await this.service.produceGoods.addProduceGoods();

    if (result.code === 0) {
      ctx.body = {
        code: 0,
        message: '创建生产计划成功!',
        data: null,
      };
    } else if (result.code === 1) {
      ctx.body = {
        code: 1,
        message: '创建生产计划失败!该产品所需' + result.data.join(',') + '配件数量不足,请检查库存!',
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


  async updateProduceGoods() {
    const { ctx } = this;
    try {
      await this.service.producePackage.updateProduceGoods();
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

  async getProduceGoodsDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.package.getProduceGoodsDetail();

      ctx.body = {
        code: 0,
        message: '查询产品成功',
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

  async deleteProduceGoods() {
    const { ctx } = this;
    const result = await this.service.produceGoods.deleteProduceGoods();

    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '删除产品计划成功!',
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
        message: '删除失败!请检查是否有订单关联该产品',
        data: null,
      };
    }

  }
}

module.exports = ProduceGoods;
