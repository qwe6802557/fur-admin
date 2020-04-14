'use strict';
/** 产品管理service层
 * @param goodsManagerService
 */
const Service = require('egg').Service;
const moment = require('moment');
class GoodsService extends Service {
  // 获取产品信息service操作
  async getGoods() {
    const { currentPage, pageSize, id, goods_start_time, goods_end_time, goods_name } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !goods_start_time && !!goods_end_time && this.ctx.helper.defineProperty(searchCondition, 'goods_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(goods_end_time).getTime(),
    });

    !!goods_start_time && !goods_end_time && this.ctx.helper.defineProperty(searchCondition, 'goods_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(goods_start_time).getTime(),
    });

    !!goods_start_time && !!goods_end_time && this.ctx.helper.defineProperty(searchCondition, 'goods_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(goods_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(goods_end_time).getTime(),
    });

    !!id && this.ctx.helper.defineProperty(searchCondition, 'id', {
      [this.app.Sequelize.Op.like]: `%${id}%`,
    });

    !!goods_name && this.ctx.helper.defineProperty(searchCondition, 'goods_name', {
      [this.app.Sequelize.Op.like]: `%${goods_name}%`,
    });

    const result = await this.ctx.model.Goods.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
    });

    result.rows.map(item => {
      item.goods_time = moment(item.goods_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    return result;
  }
  // 添加产品信息service操作
  async addGoods() {
    const transaction = await this.ctx.model.transaction();
    const { goods_name, goods_info, goods_sell, goods_image, goods_package } = this.ctx.request.body;
    const goods_package_model = [];
    const goods_singleArr = [];
    try {
      const result_validate = await this.ctx.model.Goods.findOne({
        where: {
          goods_name,
        },
        raw: true,
        transaction,
      });

      if (result_validate) {
        return 1;
      }

      const result_goods = await this.ctx.model.Goods.create({
        goods_name,
        goods_info,
        goods_sell,
        goods_image,
      }, {
        raw: true,
        transaction,
      });

      for (const item of goods_package) {
        const result_package = await this.ctx.model.Package.findOne({
          where: {
            id: item.package_id,
          },
          raw: true,
          transaction,
        });

        const spend_price = result_package.package_single * item.spend_num;

        goods_package_model.push({
          package_id: item.package_id,
          goods_id: result_goods.dataValues.id,
          spend_num: item.spend_num,
          spend_price,
        });

        goods_singleArr.push(spend_price);
      }

      await this.ctx.model.GoodsPackage.bulkCreate(goods_package_model, {
        raw: true,
        transaction,
      });

      await this.ctx.model.Goods.update({
        goods_single: goods_singleArr.reduce((total, item) => total + item),
      }, {
        where: {
          id: result_goods.dataValues.id,
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
  // 编辑产品service操作
  async editGoods() {
    const { id, goods_name, goods_sell, goods_image, goods_info } = this.ctx.request.body;
    await this.ctx.model.Goods.update({
      goods_name,
      goods_info,
      goods_sell,
      goods_image,
    }, {
      where: {
        id,
      },
    });

  }
  // 删除产品service操作
  async deleteGoods() {
    const { ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {

      await this.ctx.model.GoodsPackage.destroy({
        where: {
          goods_id: ids,
        },
        raw: true,
        transaction,
      });

      await this.ctx.model.Goods.destroy({
        where: {
          id: ids,
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
  // 获取商品详情service操作
  async getGoodsDetail() {
    const { id } = this.ctx.params;
    const result_goods = await this.ctx.model.Goods.findOne({
      where: {
        id,
      },
      raw: true,
    });

    const result_package = await this.ctx.model.GoodsPackage.findAll({
      where: {
        goods_id: id,
      },
      raw: true,
      include: this.ctx.model.Package,
    });

    result_goods.goods_package = result_package;

    result_goods.goods_time = moment(result_goods.goods_time).format('YYYY-MM-DD HH:mm:ss');

    return result_goods;
  }
  // 获取所有产品
  async getAllGoods() {
    return this.ctx.model.Goods.findAll({
      raw: true,
    });
  }
}
module.exports = GoodsService;
