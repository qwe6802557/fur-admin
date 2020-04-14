'use strict';

const { Service } = require('egg');
const moment = require('moment');

class MaterialService extends Service {

  async getMaterialList() {
    const { currentPage, pageSize, id, detail_start_time, detail_end_time, category_id, detail_status, detail_use, detail_name } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !detail_start_time && !!detail_end_time && this.ctx.helper.defineProperty(searchCondition, 'detail_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(detail_end_time).getTime(),
    });

    !!detail_start_time && !detail_end_time && this.ctx.helper.defineProperty(searchCondition, 'detail_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(detail_start_time).getTime(),
    });

    !!detail_start_time && !!detail_end_time && this.ctx.helper.defineProperty(searchCondition, 'detail_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(detail_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(detail_end_time).getTime(),
    });

    !!id && this.ctx.helper.defineProperty(searchCondition, 'id', {
      [this.app.Sequelize.Op.like]: `%${id}%`,
    });

    !!detail_status && this.ctx.helper.defineProperty(searchCondition, 'detail_status', detail_status);

    !!detail_name && this.ctx.helper.defineProperty(searchCondition, 'detail_name', {
      [this.app.Sequelize.Op.like]: `%${detail_name}%`,
    });

    this.ctx.helper.defineProperty(searchCondition, 'category_id', category_id);

    const result = await this.ctx.model.Material.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
    });

    result.rows.map(item => {
      item.detail_time = moment(item.detail_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    return result;
  }

  async getAllMaterial() {
    return await this.ctx.model.Material.findAll({
      where: {
        category_id: this.ctx.query.category_id,
      },
      raw: true,
    });
  }

  async getMaterialUse() {
    const result = await this.ctx.model.MaterialUse.findAll({
      raw: true,
    });
    return result;
  }

  async addMaterial() {
    const { detail_name, category_id, detail_num } = this.ctx.request.body;
    // 开启sequlize事务
    const transaction = await this.ctx.model.transaction();
    try {
      const result = await this.ctx.model.Material.findOne({
        where: {
          detail_name,
          category_id,
        },
        raw: true,
      }
      );
      if (result) {
        return 1;
      }
      if (detail_num === 0) {
        this.ctx.request.body.detail_status = '0';
      } else {
        this.ctx.request.body.detail_status = '1';
      }

      await this.ctx.model.Material.create(this.ctx.request.body, {
        raw: true,
      }, transaction);

      const result_category = await this.ctx.model.Category.findOne({
        where: {
          id: category_id,
        },
        raw: true,
      }, transaction);

      result_category.category_children_num = result_category.category_children_num + 1;

      await this.ctx.model.Category.update(result_category, {
        where: {
          id: category_id,
        },
      }, transaction);

      await transaction.commit();

      return 0;
    } catch (e) {
      await transaction.rollback();
      return 5;
    }
  }

  async editMaterialGet() {
    const { category_id, id } = this.ctx.params;
    const result = await this.ctx.model.Material.findOne({
      where: {
        category_id,
        id,
      },
      include: this.ctx.model.MaterialUse,
      raw: true,
    });
    return result;
  }

  async editMaterialPost() {
    const { category_id, id, detail_num } = this.ctx.request.body;
    if (detail_num === 0) {
      this.ctx.request.body.detail_status = '0';
    } else {
      this.ctx.request.body.detail_status = '1';
    }
    await this.ctx.model.Material.update(this.ctx.request.body, {
      where: {
        category_id,
        id,
      },
    });
    return true;
  }

  async deleteMaterial() {
    const { ids, category_id } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();
    try {
      await this.ctx.model.Material.destroy({
        where: {
          id: ids,
        },
        raw: true,
      }, transaction);

      const result_category = await this.ctx.model.Category.findOne({
        where: {
          id: category_id,
        },
        raw: true,
      }, transaction);

      result_category.category_children_num = result_category.category_children_num - ids.length;

      await this.ctx.model.Category.update(result_category, {
        where: {
          id: category_id,
        },
      }, transaction);

      await transaction.commit();

      return true;
    } catch (e) {
      await transaction.rollback();
      console.log(e);
      return false;
    }
  }
}
module.exports = MaterialService;
