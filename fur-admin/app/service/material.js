'use strict';

const { Service } = require('egg');
const moment = require('moment');

class MaterialService extends Service {
  async getMaterialList() {
    const { currentPage, pageSize, data } = this.ctx.request.body;
    let { select, detail_name, values, detail_start_time, detail_end_time, category_id, detail_status, detail_use } = data;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    let searchCondition = {};
    let result = [];
    if (select === 'id') {
      if (values) {
        result = await this.ctx.model.Material.findAndCountAll({
          where: {
            id: values,
            category_id,
          },
          offset,
          limit,
          raw: true,
          include: this.ctx.model.MaterialUse,
        });
      } else {
        result = await this.ctx.model.Material.findAndCountAll({
          where: {
            category_id,
          },
          offset,
          limit,
          raw: true,
          include: this.ctx.model.MaterialUse,
        });
      }
    } else {
      if (detail_start_time && !detail_end_time) {
        detail_start_time = new Date(detail_start_time).getTime();
        searchCondition = {
          detail_time: {
            [ this.app.Sequelize.Op.gt ]: detail_start_time,
          },
        };
      } else if (!detail_start_time && detail_end_time) {
        detail_end_time = new Date(detail_end_time).getTime();
        searchCondition = {
          detail_time: {
            [ this.app.Sequelize.Op.lt ]: detail_end_time,
          },
        };
      } else if (detail_start_time && detail_end_time) {
        detail_start_time = new Date(detail_start_time).getTime();
        detail_end_time = new Date(detail_end_time).getTime();
        searchCondition = {
          detail_time: {
            [ this.app.Sequelize.Op.gt ]: detail_start_time,
            [ this.app.Sequelize.Op.lt ]: detail_end_time,
          },
        };
      } else {
        if (detail_name) {
          searchCondition.detail_name = { [this.app.Sequelize.Op.like]: `%${detail_name}%` };
        }
        if (detail_status) {
          searchCondition.detail_status = detail_status;
        }
        if (detail_use) {
          searchCondition.detail_use = detail_use;
        }
      }
      searchCondition.category_id = category_id;
      result = await this.ctx.model.Material.findAndCountAll({
        where: searchCondition,
        offset,
        limit,
        raw: true,
        include: this.ctx.model.MaterialUse,
      });
    }
    result.rows.map(item => {
      item.detail_time = moment(item.detail_time).format('YYYY-MM-DD HH:mm:ss');
      if (item.detail_num === 0) {
        item.detail_status = '0';
      } else {
        item.detail_status = '1';
      }
      return item;
    });
    return result;
  }
  async getMaterialUse() {
    const result = await this.ctx.model.MaterialUse.findAll({
      raw: true,
    });
    return result;
  }
  async addMaterial() {
    const { detail_name, category_id } = this.ctx.request.body;
    const result = await this.ctx.model.Material.findOne({
      where: {
        detail_name,
        category_id,
      },
      raw: true,
    }
    );
    if (result) {
      return false;
    }
    await this.ctx.model.Material.create(this.ctx.request.body, {
      raw: true,
    });
    return true;
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
    const { category_id, id, ...other } = this.ctx.request.body;
    await this.ctx.model.Material.update({
      ...other,
    }, {
      where: {
        category_id,
        id,
      },
    });
    return true;
  }
}
module.exports = MaterialService;