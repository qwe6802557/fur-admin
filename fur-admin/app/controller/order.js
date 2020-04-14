'use strict';
/** 订单管理controller层
 * @param ordersManagerController
 */
const Controller = require('egg').Controller;

class OrderController extends Controller {
  // 获取订单信息
  async getOrder() {
    const { ctx } = this;

    try {
      const result = await this.service.order.getOrder();

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
  // 添加订单信息
  async addOrder() {
    const { ctx } = this;

    try {
      const result = await this.service.order.addOrder();

      ctx.body = {
        code: 0,
        message: '添加订单成功!',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '添加订单失败!',
        data: null,
      };
      throw e;
    }
  }
  // 更新订单状态--交付订单
  async updateOrder() {
    const { ctx } = this;
    const result = await this.service.order.updateOrder();

    if (result === 0) {
      ctx.body = {
        code: 0,
        message: '交付成功!',
        data: null,
      };
    } else if (result === 1) {
      ctx.body = {
        code: 1,
        message: '订单产品所需库存不足，交付失败!',
        data: null,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '交付失败!',
        data: null,
      };
    }
  }
  // 删除订单
  async deleteOrder() {
    const { ctx } = this;
    const result = await this.service.order.deleteOrder();

    if (result) {
      ctx.body = {
        code: 0,
        message: '删除订单成功!',
        data: result,
      };
    } else {
      ctx.body = {
        code: 5,
        message: '删除订单失败!',
        data: null,
      };
    }
  }
}
module.exports = OrderController;
