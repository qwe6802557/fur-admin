'use strict';

const { Service } = require('egg');
const moment = require('moment');

class ProducePackage extends Service {
  async getProducePackage() {
    const { currentPage, pageSize, id, produce_begin_start_time,
      produce_begin_end_time, produce_end_start_time, produce_end_end_time,
      produce_status, package_use, package_name, machine_id } = this.ctx.request.body;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};
    const packageSearch = {};

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

    !!package_name && this.ctx.helper.defineProperty(packageSearch, 'package_name', {
      [this.app.Sequelize.Op.like]: `%${package_name}%`,
    });

    !!package_use && this.ctx.helper.defineProperty(packageSearch, 'package_use', package_use);

    const result = await this.ctx.model.ProducePackage.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
      include: [{
        model: this.ctx.model.Package,
        where: packageSearch,
      }, {
        model: this.ctx.model.Machine,
      }, {
        model: this.ctx.model.Group,
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

        if (result_member.is_leader === '1') {
          item.is_leader = true;
        } else {
          item.is_leader = false;
        }
      }
    }

    return result;
  }

  async updateProducePackage() {

    const { id } = this.ctx.request.body;
    this.ctx.request.body.produce_end_time = new Date(this.ctx.request.body.produce_end_time).getTime();
    await this.ctx.model.ProducePackage.update(this.ctx.request.body, {
      where: {
        id,
      },
      raw: true,
    });
  }

  async addProducePackage() {
    const { package_id, produce_num, produce_end_time, produce_info, machine_id, group_id } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();
    const spendMaterial = [];

    try {
      const packageInfo = await this.ctx.model.PackageMaterial.findAll({
        where: {
          package_id,
        },
        include: this.ctx.model.Material,
        raw: true,
      });

      for (const item of packageInfo) {
        const totalCount = produce_num * item.spend_num;
        if (totalCount > item['material.detail_num']) {
          spendMaterial.push(item['material.detail_name']);
        }
      }
      if (spendMaterial.length !== 0) {
        return {
          code: 1,
          data: spendMaterial,
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

      const produce_price = packageInfo.map(item => item.spend_price).reduce((total, item) => total + item) * produce_num;
      await this.ctx.model.ProducePackage.create({
        package_id,
        produce_num,
        produce_info,
        produce_price,
        machine_id,
        group_id,
        produce_end_time: new Date(produce_end_time).getTime(),
      }, {
        transaction,
      });

      for (const cItem of packageInfo) {
        const result_material = await this.ctx.model.Material.findOne({
          where: {
            id: cItem.material_id,
          },
          raw: true,
          transaction,
        });

        result_material.detail_num = result_material.detail_num - (cItem.spend_num * produce_num);

        if (result_material.detail_num === 0) {
          result_material.detail_status = '0';
        } else {
          result_material.detail_status = '1';
        }

        await this.ctx.model.Material.update(result_material, {
          where: {
            id: cItem.material_id,
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

  async getProducePackageDetail() {
    const { id } = this.ctx.params;
    const result_package = await this.ctx.model.Package.findOne({
      where: {
        id,
      },
      include: this.ctx.model.MaterialUse,
      raw: true,
    });

    const packageMaterial = await this.ctx.model.PackageMaterial.findAll({
      where: {
        package_id: id,
      },
      include: this.ctx.model.Material,
      raw: true,
    });

    result_package.package_material = packageMaterial;

    return result_package;
  }


  async deleteProducePackage() {
    const { ids } = this.ctx.request.body;
    const processProduce = [];

    try {
      const result_produce = await this.ctx.model.ProducePackage.findAll({
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
        await this.ctx.model.ProducePackage.destroy({
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

module.exports = ProducePackage;
