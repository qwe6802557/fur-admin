'use strict';

const { Service } = require('egg');
const moment = require('moment');

class ProduceGoods extends Service {
  async getProduceGoods() {
    const { currentPage, pageSize, id, produce_begin_start_time,
      produce_begin_end_time, produce_end_start_time, produce_end_end_time,
      produce_status, goods_name, machine_id } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};
    const goodsSearch = {};

    !produce_begin_start_time && !!produce_begin_end_time && this.ctx.helper.defineProperty(searchCondition, 'produce_start_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(produce_begin_end_time).getTime(),
    });

    !!produce_begin_start_time && !produce_begin_end_time && this.ctx.helper.defineProperty(searchCondition, 'produce_start_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(produce_begin_start_time).getTime(),
    });

    !!produce_begin_start_time && !!produce_begin_end_time && this.ctx.helper.defineProperty(searchCondition, 'produce_start_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(produce_begin_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(produce_begin_end_time).getTime(),
    });

    !produce_end_start_time && !!produce_end_end_time && this.ctx.helper.defineProperty(searchCondition, 'produce_end_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(produce_end_end_time).getTime(),
    });

    !!produce_end_start_time && !produce_end_end_time && this.ctx.helper.defineProperty(searchCondition, 'produce_end_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(produce_end_start_time).getTime(),
    });

    !!produce_end_start_time && !!produce_end_end_time && this.ctx.helper.defineProperty(searchCondition, 'produce_end_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(produce_end_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(produce_end_end_time).getTime(),
    });

    !!id && this.ctx.helper.defineProperty(searchCondition, 'id', {
      [this.app.Sequelize.Op.like]: `%${id}%`,
    });

    !!machine_id && this.ctx.helper.defineProperty(searchCondition, 'machine_id', {
      [this.app.Sequelize.Op.like]: `%${machine_id}%`,
    });

    !!produce_status && this.ctx.helper.defineProperty(searchCondition, 'produce_status', String(produce_status));

    !!goods_name && this.ctx.helper.defineProperty(goodsSearch, 'goods_name', {
      [this.app.Sequelize.Op.like]: `%${goods_name}%`,
    });

    const result = await this.ctx.model.ProduceGoods.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
      include: [{
        model: this.ctx.model.Goods,
        where: goodsSearch,
      }, {
        model: this.ctx.model.Machine,
      }, {
        model: this.ctx.model.GoodsStatus,
      }, {
        model: this.ctx.model.Group,
      }, {
        model: this.ctx.model.Order,
      }],
    });

    const result_staff = await this.ctx.model.Staff.findOne({
      where: {
        staff_username: this.ctx.payload.data.username,
      },
      raw: true,
    });

    result.rows.map(item => {
      item.produce_start_time = moment(item.produce_start_time).format('YYYY-MM-DD HH:mm:ss');
      item.produce_end_time = moment(item.produce_end_time).format('YYYY-MM-DD HH:mm:ss');
      item.is_leader = false;
      return item;
    });

    if (result_staff) {
      for (const item of result.rows) {

        const result_member = await this.ctx.model.GroupMember.findOne({
          where: {
            group_id: item['group.id'],
            staff_id: result_staff.id,
          },
          raw: true,
        });

        if (result_member && result_member.is_leader === '1') {
          item.is_leader = true;
        } else {
          item.is_leader = false;
        }
      }
    }

    return result;
  }

  async updateProduceGoods() {

    const { id } = this.ctx.request.body;
    this.ctx.request.body.produce_end_time = new Date(this.ctx.request.body.produce_end_time).getTime();
    await this.ctx.model.ProducePackage.update(this.ctx.request.body, {
      where: {
        id,
      },
      raw: true,
    });
  }

  async addProduceGoods() {
    const { goods_id, produce_num, produce_end_time, produce_info, machine_id, group_id } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();
    const spendPackage = [];

    try {
      const packageInfo = await this.ctx.model.GoodsPackage.findAll({
        where: {
          goods_id,
        },
        include: this.ctx.model.Package,
        raw: true,
      });

      for (const item of packageInfo) {
        const totalCount = produce_num * item.spend_num;
        if (totalCount > item['package.package_num']) {
          spendPackage.push(item['package.package_name']);
        }
      }
      if (spendPackage.length !== 0) {
        return {
          code: 1,
          data: spendPackage,
        };
      }

      const result_member = await this.ctx.model.GroupMember.findAll({
        where: {
          group_id,
        },
        raw: true,
      });

      if (result_member.length <= 0) {
        return {
          code: 2,
          data: null,
        };
      }
      
      const pricePackage = packageInfo.map(item => item.spend_price);
      let produce_price = 0;
      if (pricePackage.length > 0) {
        produce_price = packageInfo.map(item => item.spend_price).reduce((total, item) => total + item) * produce_num;
      }

      await this.ctx.model.ProduceGoods.create({
        goods_id,
        produce_num,
        produce_info,
        produce_price,
        machine_id,
        group_id,
        produce_status: 1,
        produce_end_time: new Date(produce_end_time).getTime(),
      }, {
        transaction,
      });

      for (const cItem of packageInfo) {
        const result_package = await this.ctx.model.Package.findOne({
          where: {
            id: cItem.package_id,
          },
          raw: true,
          transaction,
        });

        result_package.package_num = result_package.package_num - (cItem.spend_num * produce_num);

        if (result_package.package_num === 0) {
          result_package.package_status = '0';
        } else {
          result_package.package_status = '1';
        }

        await this.ctx.model.Material.update(result_package, {
          where: {
            id: cItem.package_id,
          },
          transaction,
        });
      }

      await this.ctx.model.Machine.update({
        machine_status: '1',
      }, {
        where: {
          id: machine_id,
        },
        transaction,
      });

      await this.ctx.model.Group.update({
        group_status: '1',
      }, {
        where: {
          id: group_id,
        },
        transaction,
      });

      await transaction.commit();

      return {
        code: 0,
        data: null,
      };

    } catch (e) {
      await transaction.rollback();
      console.log(e);
      return {
        code: 5,
        data: null,
      };
    }
  }

  async getProduceGoodsDetail() {
    const { id } = this.ctx.params;
    const result_goods = await this.ctx.model.Goods.findOne({
      where: {
        id,
      },
      include: this.ctx.model.MaterialUse,
      raw: true,
    });

    const goodsPackage = await this.ctx.model.GoodsPackage.findAll({
      where: {
        goods_id: id,
      },
      include: this.ctx.model.Package,
      raw: true,
    });

    result_goods.goods_package = goodsPackage;

    return result_goods;
  }


  async deleteProduceGoods() {
    const { ids } = this.ctx.request.body;
    const processProduce = [];

    try {
      const result_produce = await this.ctx.model.ProduceGoods.findAll({
        where: {
          id: ids,
        },
        raw: true,
      });

      for (const item of result_produce) {
        if (item.produce_status === '0') {
          processProduce.push(item);
        }
      }
      if (processProduce.length === 0) {

        await this.ctx.model.ProduceGoods.destroy({
          where: {
            id: ids,
          },
        });

        return 0;
      }

      return 1;

    } catch (e) {
      console.log(e);
      return 5;
    }
  }

}

module.exports = ProduceGoods;
