'use strict';

const { Service } = require('egg');
const moment = require('moment');

class MerchantService extends Service {

  async getMerchant() {
    const { pageSize, currentPage, id, merchant_username, merchant_phone, merchant_start_time, merchant_end_time } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !merchant_start_time && !!merchant_end_time && this.ctx.helper.defineProperty(searchCondition, 'staff_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(merchant_end_time).getTime(),
    });

    !!merchant_start_time && !merchant_end_time && this.ctx.helper.defineProperty(searchCondition, 'staff_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(merchant_start_time).getTime(),
    });

    !!merchant_start_time && !!merchant_end_time && this.ctx.helper.defineProperty(searchCondition, 'staff_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(merchant_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(merchant_end_time).getTime(),
    });

    !!id && Object.defineProperty(searchCondition, 'id', {
      value: {
        [this.app.Sequelize.Op.like]: `%${id}%`,
      },
      writable: true,
      enumerable: true,
    });

    !!merchant_username && Object.defineProperty(searchCondition, 'merchant_username', {
      value: {
        [this.app.Sequelize.Op.like]: `%${merchant_username}%`,
      },
      writable: true,
      enumerable: true,
    });

    !!merchant_phone && Object.defineProperty(searchCondition, 'merchant_phone', {
      value: {
        [this.app.Sequelize.Op.like]: `%${merchant_phone}%`,
      },
      writable: true,
      enumerable: true,
    });

    const result = await this.ctx.model.Merchant.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
    });

    result.rows.map(item => {
      item.merchant_time = moment(item.merchant_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });

    return result;
  }

  async getAllMerchant() {
    return await this.ctx.model.Merchant.findAll({
      raw: true,
    });
  }

  async addMerchant() {
    let { merchant_username, merchant_password,
      merchant_phone, merchant_eMail, merchant_address } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    merchant_username = merchant_username.trim();

    try {

      const result_username = await this.ctx.model.User.findOne({
        where: {
          username: merchant_username,
        },
        raw: true,
      });

      if (result_username) {
        return 2;
      }

      const result_phone = await this.ctx.model.User.findOne({
        where: {
          mobile: merchant_phone,
        },
        raw: true,
      });

      if (result_phone) {
        return 3;
      }

      const result_email = await this.ctx.model.User.findOne({
        where: {
          e_mail: merchant_eMail,
        },
        raw: true,
      });

      if (result_email) {
        return 4;
      }

      merchant_password = await this.ctx.app.encryptPw(5, merchant_password);

      await this.ctx.model.User.create({
        username: merchant_username,
        password: merchant_password,
        identity: '2',
        e_mail: merchant_eMail,
        mobile: merchant_phone,
      }, {
        transaction,
      });

      await this.ctx.model.Merchant.create({
        merchant_username,
        merchant_password,
        merchant_eMail,
        merchant_phone,
        merchant_address,
      }, {
        raw: true,
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

  async deleteMerchant() {
    const { ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    const result_merchant = await this.ctx.model.Merchant.findAll(({
      where: {
        id: ids,
      },
      raw: true,
    }));

    const names = result_merchant.map(item => item.merchant_username);

    const merchant_ids = result_merchant.map(item => item.id);

    const result_orders = await this.ctx.model.Order.findAll({
      where: {
        merchant_id: merchant_ids,
      },
      raw: true,
    });

    const order_ids = result_orders.map(item => item.id);

    try {

      await this.ctx.model.ProduceGoods.destroy({
        where: {
          order_id: order_ids,
        },
        transaction,
      });

      await this.ctx.model.Order.destroy({
        where: {
          merchant_id: ids,
        },
        transaction,
      });

      await this.ctx.model.Merchant.destroy({
        where: {
          id: ids,
        },
        transaction,
      });

      await this.ctx.model.User.destroy({
        where: {
          username: names,
        },
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

  async updateMerchant() {
    const { merchant_address, id } = this.ctx.request.body;
    await this.ctx.model.Merchant.update({
      merchant_address,
    }, {
      where: {
        id,
      },
    });
  }

  // 获取商户详情
  async getMerchantDetail() {
    const { id } = this.ctx.params;

    const result = await this.ctx.model.Merchant.findOne({
      where: {
        id,
      },
      raw: true,
    });

    const merchant_count = await this.ctx.model.Order.count({
      where: {
        merchant_id: id,
      },
      raw: true,
    });

    const order_count = await this.ctx.model.Order.count({
      where: {
        merchant_id: id,
        order_status: '0',
      },
      raw: true,
    });

    result.merchant_count = merchant_count;

    result.order_count = order_count;

    result.merchant_time = moment(result.merchant_time).format('YYYY-MM-DD HH:mm:ss');

    return result;
  }
}
module.exports = MerchantService;
