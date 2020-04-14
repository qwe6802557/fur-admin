'use strict';

const { Service } = require('egg');
const moment = require('moment');

class OrderService extends Service {

  async getOrder() {
    const { pageSize, currentPage, id, goods_id, order_status, merchant_id, order_start_time, order_end_time } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !order_start_time && !!order_end_time && this.ctx.helper.defineProperty(searchCondition, 'order_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(order_end_time).getTime(),
    });

    !!order_start_time && !order_end_time && this.ctx.helper.defineProperty(searchCondition, 'order_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(order_start_time).getTime(),
    });

    !!order_start_time && !!order_end_time && this.ctx.helper.defineProperty(searchCondition, 'order_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(order_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(order_end_time).getTime(),
    });

    !!id && Object.defineProperty(searchCondition, 'id', {
      value: {
        [this.app.Sequelize.Op.like]: `%${id}%`,
      },
      writable: true,
      enumerable: true,
    });

    !!goods_id && Object.defineProperty(searchCondition, 'goods_id', {
      value: goods_id,
      writable: true,
      enumerable: true,
    });

    !!merchant_id && Object.defineProperty(searchCondition, 'merchant_id', {
      value: merchant_id,
      writable: true,
      enumerable: true,
    });

    !!order_status && Object.defineProperty(searchCondition, 'order_status', {
      value: order_status,
      writable: true,
      enumerable: true,
    });

    const result = await this.ctx.model.Order.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      include: [{
        model: this.ctx.model.Goods,
      }, {
        model: this.ctx.model.Merchant,
      }],
      raw: true,
    });

    result.rows.map(item => {
      item.order_time = moment(item.order_time).format('YYYY-MM-DD HH:mm:ss');
      item.handle_time = moment(item.handle_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });

    return result;
  }

  async getAllOrder() {
    return await this.ctx.model.Merchant.findAll({
      raw: true,
    });
  }

  async addOrder() {
    const { goods_id, merchant_id, order_num, handle_time } = this.ctx.request.body;

    const result_goods = await this.ctx.model.Goods.findOne({
      where: {
        id: goods_id,
      },
      raw: true,
    });

    const order_price = order_num * result_goods.goods_single;

    await this.ctx.model.Order.create({
      goods_id,
      merchant_id,
      order_num,
      order_price,
      handle_time: new Date(handle_time).getTime(),
    });
  }

  async deleteOrder() {
    const { ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {

      await this.ctx.model.ProduceGoods.destroy({
        where: {
          order_id: ids,
        },
        raw: true,
        transaction,
      });

      await this.ctx.model.Order.destroy({
        where: {
          id: ids,
        },
        raw: true,
        transaction,
      });

      await transaction.commit();

      return true;
    } catch (e) {
      await transaction.rollback();
      console.log(e);
      return false;
    }
  }
  // 修改订单状态--交付
  async updateOrder() {
    const { id } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {
      const result_order = await this.ctx.model.Order.findOne({
        where: {
          id,
        },
        raw: true,
        transaction,
      });

      const result_goods = await this.ctx.model.Goods.findOne({
        where: {
          id: result_order.goods_id,
        },
        raw: true,
      });

      if (result_goods.goods_num < result_order.order_num) {
        return 1;
      }

      result_goods.goods_num = result_goods.goods_num - result_order.order_num;

      await this.ctx.model.Goods.update(result_goods, {
        where: {
          id: result_order.goods_id,
        },
        raw: true,
        transaction,
      });

      await this.ctx.model.Order.update({
        order_status: '1',
      }, {
        where: {
          id,
        },
        transaction,
      });

      await transaction.commit();

      return 0;
    } catch (e) {
      await transaction.rollback();
      console.log(e);
      return 5;
    }
  }
}
module.exports = OrderService;
