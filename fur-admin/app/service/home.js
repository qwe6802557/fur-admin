'use strict';
/** 产品管理service层
 * @param goodsManagerService
 */
const Service = require('egg').Service;
const moment = require('moment');
class HomeService extends Service {
  // 获取商家分布service操作
  async getMerchantMap() {
    const result = await this.ctx.model.Merchant.findAll({
      raw: true,
    });

    const merchant_map = [];

    result.map(item => {
      merchant_map.push({
        name: item.merchant_address,
        value: 1,
      });

      return item;
    });

    return merchant_map;
  }
  // 获取订单分析图service操作
  async getOrderMap() {

    const result = [];

    const result_no = await this.ctx.model.Order.findAll({
      where: {
        order_status: '0',
      },
      raw: true,
    });

    const result_ok = await this.ctx.model.Order.findAll({
      where: {
        order_status: '1',
      },
      raw: true,
    });

    result_no.map(item => {
      result.push({ name: '未交付', value: 1 });

      return item;
    });

    result_ok.map(item => {
      result.push({ name: '已交付', value: 1 });

      return item;
    });

    return result;

  }
  // 获取计划分析图service操作
  async getProduceMap() {

    const result = [];

    const result_goods = await this.ctx.model.Goods.findAll({
      raw: true,
    });

    for (const item of result_goods) {
      const count = await this.ctx.model.ProduceGoods.count({
        where: {
          goods_id: item.id,
        },
        raw: true,
      });
      result.push({ name: item.goods_name, value: count });
    }

    return result;

  }
}
module.exports = HomeService;
