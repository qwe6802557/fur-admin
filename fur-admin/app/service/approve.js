'use strict';
/** 审批管理service层
 * @param goodsManagerService
 */
const Service = require('egg').Service;
const moment = require('moment');
class ApproveService extends Service {
  // 获取审批信息service操作
  async getApproveList() {
    const { currentPage, pageSize, id, approve_start_time, approve_end_time, approve_type, approve_status, approve_creator } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const user_id = this.ctx.payload.data.id;
    const searchCondition = {};

    !approve_start_time && !!approve_end_time && this.ctx.helper.defineProperty(searchCondition, 'goods_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(approve_end_time).getTime(),
    });

    !!approve_start_time && !approve_end_time && this.ctx.helper.defineProperty(searchCondition, 'goods_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(approve_start_time).getTime(),
    });

    !!approve_start_time && !!approve_end_time && this.ctx.helper.defineProperty(searchCondition, 'goods_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(approve_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(approve_end_time).getTime(),
    });

    !!id && this.ctx.helper.defineProperty(searchCondition, 'id', {
      [this.app.Sequelize.Op.like]: `%${id}%`,
    });

    !!approve_creator && this.ctx.helper.defineProperty(searchCondition, 'approve_creator', {
      [this.app.Sequelize.Op.like]: `%${approve_creator}%`,
    });

    !!approve_type && this.ctx.helper.defineProperty(searchCondition, 'approve_type', approve_type);

    !!approve_status && this.ctx.helper.defineProperty(searchCondition, 'approve_status', approve_status);

    const searchOrObj = {
      [ this.app.Sequelize.Op.or ]: [{
        approve_id: user_id,
      }, {
        creator_id: user_id,
      }],
    };

    const newSearch = Object.assign(searchCondition, searchOrObj);

    const result = await this.ctx.model.Approve.findAndCountAll({
      where: newSearch,
      offset,
      limit,
      raw: true,
    });

    result.rows.map(item => {
      item.approve_time = moment(item.approve_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    return result;
  }
  // 添加产品信息service操作
  async addApprove() {
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
  async updateApprove() {
    const { id, goods_name, goods_sell, goods_image, goods_info } = this.ctx.request.body;
    await this.ctx.model.Approve.update({
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
  // 删除审批service操作
  async deleteApprove() {
    const { ids } = this.ctx.request.body;

    await this.ctx.model.Approve.destroy({
      where: {
        id: ids,
      },
    });
  }
  // 获取审批详情service操作
  async getApproveDetail() {
    const { id } = this.ctx.params;
    const result_approve = await this.ctx.model.Approve.findOne({
      where: {
        id,
      },
      raw: true,
    });

    const result_user = await this.ctx.model.User.findOne({
      where: {
        id: result_approve.approve_id,
      },
      raw: true,
    });

    if (result_approve.approve_type === '1') {
      const result_produce_start = await this.ctx.model.ProduceGoods.findOne({
        where: {
          id: result_approve.produce_id,
        },
        include: this.ctx.model.GoodsStatus,
        raw: true,
      });

      const result_produce_end = await this.ctx.model.GoodsStatus.findOne({
        where: {
          id: result_approve.produce_id + 2,
        },
        raw: true,
      });

      result_approve.produce = {};

      console.log(result_produce_start);
      result_approve.produce.start_name = result_produce_start['goods_status.status_name'];
      result_approve.produce.end_name = result_produce_end.status_name;
    }

    result_approve.approve_name = result_user.username;

    result_approve.approve_time = moment(result_approve.approve_time).format('YYYY-MM-DD HH:mm:ss');

    return result_approve;
  }
  // 提交配件审批
  async handleApprovePackage() {
    const { produce, approve_id } = this.ctx.request.body;
    const { username, id } = this.ctx.payload.data;
    const transaction = await this.ctx.model.transaction();

    try {
      await this.ctx.model.Approve.create({
        produce_id: produce.id,
        approve_type: '0',
        approve_creator: username,
        creator_id: id,
        approve_id,
      }, {
        transaction,
      });

      await this.ctx.model.ProducePackage.update({
        is_approved: '1',
      }, {
        where: {
          id: produce.id,
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
  // 配件审批
  async passOrRejectPackageApprove() {
    const { id, approve_type, approve_advice } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {
      const result_approve = await this.ctx.model.Approve.findOne({
        where: {
          id,
        },
        raw: true,
        transaction,
      });
      if (approve_type === 1) {
        const result_produce_package = await this.ctx.model.ProducePackage.findOne({
          where: {
            id: result_approve.produce_id,
          },
          raw: true,
          transaction,
        });

        const result_package = await this.ctx.model.Package.findOne({
          where: {
            id: result_produce_package.package_id,
          },
          raw: true,
          transaction,
        });

        const result_machine = await this.ctx.model.Machine.findOne({
          where: {
            id: result_produce_package.machine_id,
          },
          raw: true,
          transaction,
        });

        result_machine.machine_status = '0';
        result_package.package_num = result_package.package_num + result_produce_package.produce_num;
        result_package.package_price = result_package.package_price + result_produce_package.produce_price;
        if (result_package.package_num > 0) {
          result_package.package_status = '1';
        }

        await this.ctx.model.Package.update(result_package, {
          where: {
            id: result_produce_package.package_id,
          },
          raw: true,
          transaction,
        });

        await this.ctx.model.Machine.update(result_machine, {
          where: {
            id: result_produce_package.machine_id,
          },
          raw: true,
          transaction,
        });

        await this.ctx.model.ProducePackage.update({
          produce_status: '1',
        }, {
          where: {
            id: result_produce_package.id,
          },
          raw: true,
          transaction,
        });

        await this.ctx.model.Approve.update({
          approve_status: '1',
          approve_advice,
        }, {
          where: {
            id,
          },
          raw: true,
          transaction,
        });

        await this.ctx.model.Group.update({
          group_status: '0',
        }, {
          where: {
            id: result_produce_package.group_id,
          },
          transaction,
        });
      } else {

        await this.ctx.model.ProducePackage.update({
          is_approved: '0',
        }, {
          where: {
            id: result_approve.produce_id,
          },
          raw: true,
          transaction,
        });

        await this.ctx.model.Approve.update({
          approve_status: '2',
        }, {
          where: {
            id,
          },
          raw: true,
          transaction,
        });
      }

      await transaction.commit();

      return 0;
    } catch (e) {
      await transaction.rollback();
      console.log(e);
      return 5;
    }
  }
  // 产品提交审批
  async handleApproveGoods() {
    const { produce, approve_id, machine_id } = this.ctx.request.body;
    const { username, id } = this.ctx.payload.data;
    const transaction = await this.ctx.model.transaction();

    try {
      await this.ctx.model.Approve.create({
        produce_id: produce.id,
        approve_type: '1',
        approve_creator: username,
        creator_id: id,
        approve_id,
        machine_id,
      }, {
        transaction,
      });

      await this.ctx.model.ProduceGoods.update({
        is_approved: '1',
      }, {
        where: {
          id: produce.id,
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
  // 产品通过/不通过审批
  async passOrRejectGoodsApprove() {
    const { id, approve_type, approve_advice } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {
      const result_approve = await this.ctx.model.Approve.findOne({
        where: {
          id,
        },
        raw: true,
        transaction,
      });
      if (approve_type === 1) {
        const result_produce_goods = await this.ctx.model.ProduceGoods.findOne({
          where: {
            id: result_approve.produce_id,
          },
          raw: true,
          transaction,
        });

        const result_goods = await this.ctx.model.Goods.findOne({
          where: {
            id: result_produce_goods.goods_id,
          },
          raw: true,
          transaction,
        });

        await this.ctx.model.Machine.update({
          machine_status: '0',
        }, {
          where: {
            id: result_produce_goods.machine_id,
          },
          raw: true,
          transaction,
        });

        const result_produce = await this.ctx.model.ProduceGoods.findOne({
          where: {
            id: result_produce_goods.id,
          },
          raw: true,
          transaction,
        });

        result_produce.produce_status = result_produce.produce_status + 1;
        result_produce.is_approved = '0';
        if (result_produce.produce_status === 9) {
          result_goods.goods_num = result_goods.goods_num + result_produce_goods.produce_num;
          result_goods.goods_price = result_goods.goods_price + result_produce_goods.produce_price;
          if (result_goods.goods_num > 0) {
            result_goods.goods_status = '1';
          }

          await this.ctx.model.Goods.update(result_goods, {
            where: {
              id: result_produce_goods.goods_id,
            },
            raw: true,
            transaction,
          });

          await this.ctx.model.Group.update({
            group_status: '0',
          }, {
            where: {
              id: result_produce_goods.group_id,
            },
            transaction,
          });
        }
        await this.ctx.model.ProduceGoods.update(result_produce, {
          where: {
            id: result_produce_goods.id,
          },
          raw: true,
          transaction,
        });

        await this.ctx.model.Approve.update({
          approve_status: '1',
          approve_advice,
        }, {
          where: {
            id,
          },
          raw: true,
          transaction,
        });
      } else {

        await this.ctx.model.ProduceGoods.update({
          is_approved: '0',
        }, {
          where: {
            id: result_approve.produce_id,
          },
          raw: true,
          transaction,
        });

        await this.ctx.model.Approve.update({
          approve_status: '2',
        }, {
          where: {
            id,
          },
          raw: true,
          transaction,
        });
      }

      await transaction.commit();

      return 0;
    } catch (e) {
      await transaction.rollback();
      console.log(e);
      return 5;
    }
  }
}
module.exports = ApproveService;
