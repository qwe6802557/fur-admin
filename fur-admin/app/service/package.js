'use strict';

const { Service } = require('egg');
const moment = require('moment');

class Package extends Service {
  async getPackage() {
    const { currentPage, pageSize, id, package_start_time, package_end_time, package_status, package_use, package_name } = this.ctx.query;
    const offset = (currentPage - 1) * pageSize;
    const limit = parseInt(pageSize);
    const searchCondition = {};

    !package_start_time && !!package_end_time && this.ctx.helper.defineProperty(searchCondition, 'package_time', {
      [ this.app.Sequelize.Op.lt ]: new Date(package_end_time).getTime(),
    });

    !!package_start_time && !package_end_time && this.ctx.helper.defineProperty(searchCondition, 'package_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(package_start_time).getTime(),
    });

    !!package_start_time && !!package_end_time && this.ctx.helper.defineProperty(searchCondition, 'package_time', {
      [ this.app.Sequelize.Op.gt ]: new Date(package_start_time).getTime(),
      [ this.app.Sequelize.Op.lt ]: new Date(package_end_time).getTime(),
    });

    !!id && this.ctx.helper.defineProperty(searchCondition, 'id', {
      [this.app.Sequelize.Op.like]: `%${id}%`,
    });

    !!package_status && this.ctx.helper.defineProperty(searchCondition, 'package_status', package_status);

    !!package_name && this.ctx.helper.defineProperty(searchCondition, 'package_name', {
      [this.app.Sequelize.Op.like]: `%${package_name}%`,
    });

    !!package_use && this.ctx.helper.defineProperty(searchCondition, 'package_use', package_use);

    const result = await this.ctx.model.Package.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
      include: this.ctx.model.MaterialUse,
    });

    result.rows.map(item => {
      item.package_time = moment(item.package_time).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    return result;
  }

  async updatePackage() {

    const { id } = this.ctx.request.body;

    await this.ctx.model.Package.update(this.ctx.request.body, {
      where: {
        id,
      },
      raw: true,
    });
  }

  async addPackage() {
    const { package_material, package_name, ...other } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();
    const packageArr = [];
    const totalPrice = [];

    try {
      const result_package = await this.ctx.model.Package.findOne({
        where: {
          package_name,
        },
        raw: true,
      });
      if (result_package) {
        return 1;
      }
      const result_create = await this.ctx.model.Package.create({
        package_name,
        ...other,
      }, {
        raw: true,
        transaction,
      });

      for (const item of package_material) {
        for (const cItem of item.package_material) {
          const result_price = await this.ctx.model.Material.findOne({
            where: {
              id: cItem.material_id,
            },
            raw: true,
          });
          const spend_price = result_price.detail_price * cItem.spend_num;
          packageArr.push({
            category_id: item.category_id,
            package_id: result_create.dataValues.id,
            material_id: cItem.material_id,
            spend_num: cItem.spend_num,
            spend_price,
          });
          totalPrice.push(spend_price);
        }
      }
      await this.ctx.model.PackageMaterial.bulkCreate(packageArr, {
        raw: true,
        transaction,
      });

      await this.ctx.model.Package.update({
        package_single: totalPrice.reduce((total, item) => total + item),
      }, {
        where: {
          id: result_create.dataValues.id,
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

  async getAllPackage() {
    return this.ctx.model.Package.findAll({
      raw: true,
    });
  }

  async getPackageDetail() {
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

    result_package.package_time = moment(result_package.package_time).format('YYYY-MM-DD HH:mm:ss');

    return result_package;
  }


  async deletePackage() {
    const { ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {

      await this.ctx.model.PackageMaterial.destroy({
        where: {
          package_id: ids,
        },
        raw: true,
      }, transaction);

      await this.ctx.model.Package.destroy({
        where: {
          id: ids,
        },
        raw: true,
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

module.exports = Package;
