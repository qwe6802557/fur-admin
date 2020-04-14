'use strict';

const { Service } = require('egg');
const moment = require('moment');

class MachineService extends Service {

  async getMachineList() {
    const { currentPage, pageSize, id, machine_start_time, machine_end_time, machine_status, machine_type, machine_use, machine_name } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !machine_start_time && !!machine_end_time && this.ctx.helper.defineProperty(searchCondition, 'machine_time', {
      [this.app.Sequelize.Op.lt]: new Date(machine_end_time).getTime(),
    });

    !!machine_start_time && !machine_end_time && this.ctx.helper.defineProperty(searchCondition, 'machine_time', {
      [this.app.Sequelize.Op.gt]: new Date(machine_start_time).getTime(),
    });

    !!machine_start_time && !!machine_end_time && this.ctx.helper.defineProperty(searchCondition, 'machine_time', {
      [this.app.Sequelize.Op.gt]: new Date(machine_start_time).getTime(),
      [this.app.Sequelize.Op.lt]: new Date(machine_end_time).getTime(),
    });

    !!id && this.ctx.helper.defineProperty(searchCondition, 'id', {
      [this.app.Sequelize.Op.like]: `%${id}%`,
    });

    !!machine_type && this.ctx.helper.defineProperty(searchCondition, 'machine_type', machine_type);

    !!machine_use && this.ctx.helper.defineProperty(searchCondition, 'machine_use', machine_use);

    !!machine_status && this.ctx.helper.defineProperty(searchCondition, 'machine_status', machine_status);

    !!machine_name && this.ctx.helper.defineProperty(searchCondition, 'machine_name', {
      [this.app.Sequelize.Op.like]: `%${machine_name}%`,
    });

    const result = await this.ctx.model.Machine.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      include: this.ctx.model.MaterialUse,
      raw: true,
    });

    result.rows.map(item => {
      item.machine_time = moment(item.machine_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    return result;
  }

  async getAllMaterial() {
    return await this.ctx.model.Machine.findAll({
      where: {
        category_id: this.ctx.query.category_id,
      },
      raw: true,
    });
  }

  async addMachine() {

    await this.ctx.model.Machine.create({
      ...this.ctx.request.body,
    });

    return true;
  }

  async updateMachine() {
    const { id } = this.ctx.request.body;

    await this.ctx.model.Machine.update(this.ctx.request.body, {
      where: {
        id,
      },
    });
    return true;
  }

  async deleteMachine() {
    const { ids } = this.ctx.request.body;

    await this.ctx.model.Machine.destroy({
      where: {
        id: ids,
      },
    });

    return true;
  }

  async getPackageMachine() {
    let result = [];
    const { type } = this.ctx.query;
    if (type) {
      result = await this.ctx.model.Machine.findAll({
        where: {
          machine_use: type,
          machine_status: '0',
        },
        raw: true,
      });
    } else {
      result = await this.ctx.model.Machine.findAll({
        where: {
          machine_use: '0',
        },
        raw: true,
      });
    }

    return result;
  }

  async getGoodsMachine() {
    const { machine_use, machine_type, machine_status } = this.ctx.query;
    const searchCondition = {};

    !!machine_use && this.ctx.helper.defineProperty(searchCondition, 'machine_use', machine_use);
    !!machine_type && this.ctx.helper.defineProperty(searchCondition, 'machine_type', machine_type);
    !!machine_status && this.ctx.helper.defineProperty(searchCondition, 'machine_status', machine_status);

    const result = await this.ctx.model.Machine.findAll({
      where: searchCondition,
      raw: true,
    });

    return result;
  }
}
module.exports = MachineService;
