'use strict';
/** 产品管理controller层
 * @param ordersManagerController
 */
const Controller = require('egg').Controller;

class GoodsController extends Controller {
  // 获取产品信息
  async getGoods() {
    const { ctx } = this;

    try {
      const result = await this.service.goods.getGoods();
      ctx.body = {
        code: 0,
        message: '获取产品数据成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 0,
        message: '获取产品数据失败！',
        data: null,
      };
      throw e;
    }
  }
  // 添加产品信息
  async addGoods() {
    const { ctx } = this;
    const result = await this.service.goods.addGoods();
    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '增加产品成功！',
        data: null,
      };
    } else if (result === 1) {
      ctx.body = {
        code: 1,
        message: '该产品已存在！',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '增加产品失败!',
        data: null,
      };
    }
  }
  // 编辑页面商品数据
  async editGoods() {
    const { ctx } = this;
    try {
      await this.service.goods.editGoods();

      ctx.body = {
        code: 0,
        message: '修改产品成功!',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '修改产品失败!',
        data: null,
      };
    }
  }
  // 删除商品操作
  async deleteGoods() {
    const { ctx } = this;
    const result = await this.service.goods.deleteGoods();
    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '删除产品成功!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除产品失败!',
        data: null,
      };
    }
  }
  async getGoodsDetail() {
    const { ctx } = this;
    try {
      const result = await this.service.goods.getGoodsDetail();
      ctx.body = {
        code: 0,
        message: '查询商品详情成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '查询商品详情失败!',
        data: null,
      };
      throw e;
    }
  }
  // 获取所有产品
  async getAllGoods() {
    const { ctx } = this;
    try {
      const result = await this.service.goods.getAllGoods();

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
module.exports = GoodsController;
