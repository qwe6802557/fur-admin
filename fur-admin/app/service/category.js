'use strict';

const { Service } = require('egg');

class CategoryService extends Service {

  async getCategory() {
    const { pageSize, currentPage } = this.ctx.query;
    const { id } = this.ctx.params;
    let result;
    if (!id) {
      const offset = (currentPage - 1) * pageSize;
      const limit = parseInt(pageSize);
      const total = await this.ctx.model.Category.count();
      result = await this.ctx.model.Category.findAll({
        offset,
        limit,
        distinct: true,
      });
      return { result, total };
    }
    result = await this.ctx.model.Category.findOne({
      where: {
        id,
      },
    });
    return result;
  }

  async getAllCategory() {
    return await this.ctx.model.Category.findAll({
      raw: true,
    });
  }

  async addCategory() {
    let { category_name, category_info } = this.ctx.request.body;
    category_name = category_name.trim();
    if (category_name) {
      const result = await this.ctx.model.Category.findAll({
        where: {
          category_name,
        },
      });
        // eslint-disable-next-line eqeqeq
      if (result.length != 0) {
        return 1;
      }
      await this.ctx.model.Category.create({ category_name, category_info });
      return 0;
    }
    return false;

  }

  async updateCategory() {
    let { id, category_name, category_info } = this.ctx.request.body;
    category_name = category_name.trim();
    category_info = category_info.trim();
    if (category_name) {
      const result = await this.ctx.model.Category.update({ category_name, category_info }, {
        where: {
          id,
        },
      });
      return result;
    }
    return false;

  }

  async deleteCategory() {
    const { ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {
      await this.ctx.model.Category.destroy({
        where: {
          id: ids,
        },
      }, transaction);

      await this.ctx.model.Material.destroy({
        where: {
          category_id: ids,
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

  async searchCategory() {
    const { pageSize, currentPage, id, category_name } = this.ctx.query;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !!id && Object.defineProperty(searchCondition, 'id', {
      value: {
        [this.app.Sequelize.Op.like]: `%${id}%`,
      },
      writable: true,
      enumerable: true,
    });

    !!category_name && Object.defineProperty(searchCondition, 'category_name', {
      value: {
        [this.app.Sequelize.Op.like]: `%${category_name}%`,
      },
      writable: true,
      enumerable: true,
    });

    const result = await this.ctx.model.Category.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
    });
    return result;
  }
}
module.exports = CategoryService;
