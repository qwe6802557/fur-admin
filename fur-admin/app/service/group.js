'use strict';
/** 产品管理service层
 * @param goodsManagerService
 */
const Service = require('egg').Service;
const moment = require('moment');
class GroupService extends Service {
  // 获取分组信息service操作
  async getGroup() {
    const { currentPage, pageSize, id, group_start_time, group_end_time, group_name } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !group_start_time && !!group_end_time && this.ctx.helper.defineProperty(searchCondition, 'group_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(group_end_time).getTime(),
    });

    !!group_start_time && !group_end_time && this.ctx.helper.defineProperty(searchCondition, 'group_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(group_start_time).getTime(),
    });

    !!group_start_time && !!group_end_time && this.ctx.helper.defineProperty(searchCondition, 'group_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(group_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(group_end_time).getTime(),
    });

    !!id && this.ctx.helper.defineProperty(searchCondition, 'id', {
      [this.app.Sequelize.Op.like]: `%${id}%`,
    });

    !!group_name && this.ctx.helper.defineProperty(searchCondition, 'group_name', {
      [this.app.Sequelize.Op.like]: `%${group_name}%`,
    });

    const result = await this.ctx.model.Group.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
    });

    for (const item of result.rows) {
      const result_member = await this.ctx.model.GroupMember.findAll({
        where: {
          group_id: item.id,
        },
        raw: true,
        include: this.ctx.model.Staff,
      });

      item.groupMember = result_member;

      item.groupMember.map(cItem => {
        cItem.member_time = moment(cItem.member_time).format('YYYY-MM-DD HH:mm:ss');
        return item;
      });
    }

    result.rows.map(item => {
      item.group_time = moment(item.group_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    return result;
  }
  // 添加分组service操作
  async addGroup() {
    const { group_name, group_score } = this.ctx.request.body;

    try {
      const result = await this.ctx.model.Group.findOne({
        where: {
          group_name,
        },
      });

      if (result) {
        return 1;
      }
      await this.ctx.model.Group.create(
        {
          group_name,
          group_score,
        }
      );

      return 0;
    } catch (e) {
      console.log(e);
      return 5;
    }


  }
  // 编辑分组service操作
  async updateGroup() {
    const { id, group_name, group_score } = this.ctx.request.body;
    await this.ctx.model.Group.update({
      group_name,
      group_score,
    }, {
      where: {
        id,
      },
    });
  }
  // 删除分组service操作
  async deleteGroup() {
    const { ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {

      await this.ctx.model.GroupMember.destroy({
        where: {
          group_id: ids,
        },
        raw: true,
        transaction,
      });

      await this.ctx.model.Staff.update({
        group_id: null,
      }, {
        where: {
          group_id: ids,
        },
      });

      await this.ctx.model.Group.destroy({
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
  // 获取分组详情service操作
  async getGroupDetail() {
    const { id } = this.ctx.params;
    const result_goods = await this.ctx.model.Group.findOne({
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
  // 获取所有分组
  async getAllGroup() {
    const { type } = this.ctx.request.body;

    if (!type) {
      return this.ctx.model.Group.findAll({
        raw: true,
      });
    }
    return this.ctx.model.Group.findAll({
      where: {
        group_status: type,
      },
      raw: true,
    });
  }
  // 踢出分组
  async outGroup() {
    const { id } = this.ctx.request.body;

    try {
      await this.ctx.model.GroupMember.destroy({
        where: {
          staff_id: id,
        },
      });

      await this.ctx.model.Staff.update({
        group_id: null,
      }, {
        where: {
          id,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
module.exports = GroupService;
