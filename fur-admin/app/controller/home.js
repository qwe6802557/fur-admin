'use strict';
/** 分组管理controller层
 * @param ordersManagerController
 */
const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 获取商家分布图
  async getMerchantMap() {
    const { ctx } = this;
    try {
      const result = await this.service.home.getMerchantMap();
      ctx.body = {
        code: 0,
        message: '获取商家分布数据成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '获取商家分布数据失败！',
        data: null,
      };
      throw e;
    }
  }
  // 获取订单分析图
  async getOrderMap() {
    const { ctx } = this;
    try {
      const result = await this.service.home.getOrderMap();
      ctx.body = {
        code: 0,
        message: '获取订单分析数据成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '获取订单分析数据失败！',
        data: null,
      };
      throw e;
    }
  }
  // 获取计划分析图
  async getProduceMap() {
    const { ctx } = this;
    try {
      const result = await this.service.home.getProduceMap();
      ctx.body = {
        code: 0,
        message: '获取计划分析数据成功！',
        data: result,
      };
    } catch (e) {
      ctx.body = {
        code: 5,
        message: '获取计划分析数据失败！',
        data: null,
      };
      throw e;
    }
  }
}
module.exports = HomeController;
