'use strict';

const { Service } = require('egg');
const moment = require('moment');

class AuthorityService extends Service {

  async getAuthority() {
    const { pageSize, currentPage, id, authority_name } = this.ctx.request.body;
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

    !!authority_name && Object.defineProperty(searchCondition, 'authority_name', {
      value: {
        [this.app.Sequelize.Op.like]: `%${authority_name}%`,
      },
      writable: true,
      enumerable: true,
    });

    const result = await this.ctx.model.Authority.findAndCountAll({
      where: searchCondition,
      offset,
      limit,
      raw: true,
    });

    for (const item of result.rows) {
      item.authority_time = moment(item.authority_time).format('YYYY-MM-DD HH:mm:ss');
      const result_staff = await this.ctx.model.StaffAuthority.count({
        where: {
          authority_id: item.id,
        },
        raw: true,
      });

      item.authority_count = result_staff;
    }

    return result;
  }

  async getAllAuthority() {
    return await this.ctx.model.Authority.findAll({
      raw: true,
    });
  }

  async setStaffAuthority() {
    const { staff_id, ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {
      let result_authority = await this.ctx.model.Authority.findAll({
        raw: true,
      });

      result_authority = result_authority.map(item => item.id);

      result_authority.map((item, index) => {
        for (const cItem of ids) {
          if (item === cItem) {
            result_authority.splice(index, 1);
          }
        }

        return item;
      });

      console.log(result_authority);

      for (const item of result_authority) {
        const result = await this.ctx.model.StaffAuthority.findOne({
          where: {
            staff_id,
            authority_id: item,
          },
          raw: true,
          transaction,
        });

        if (result) {
          await this.ctx.model.StaffAuthority.destroy({
            where: {
              staff_id,
              authority_id: item,
            },
            transaction,
          });
        }
      }

      for (const item of ids) {
        const result = await this.ctx.model.StaffAuthority.findOne({
          where: {
            staff_id,
            authority_id: item,
          },
          raw: true,
          transaction,
        });

        if (!result) {
          await this.ctx.model.StaffAuthority.create({
            staff_id,
            authority_id: item,
          }, {
            transaction,
          });
        }
      }

      await transaction.commit();

      return true;
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      return false;
    }

  }

  async addAuthority() {
    let { authority_name } = this.ctx.request.body;
    authority_name = authority_name.trim();
    if (authority_name) {
      const result = await this.ctx.model.Authority.findAll({
        where: {
          authority_name,
        },
      });
      // eslint-disable-next-line eqeqeq
      if (result.length != 0) {
        return 1;
      }
      await this.ctx.model.Authority.create({ authority_name });
      return 0;
    }
    return false;

  }

  async updateAuthority() {
    let { id, authority_name } = this.ctx.request.body;
    authority_name = authority_name.trim();
    if (authority_name) {
      const result = await this.ctx.model.Authority.update({ authority_name }, {
        where: {
          id,
        },
      });
      return result;
    }
    return false;
  }

  async deleteAuthority() {
    const { ids } = this.ctx.request.body;
    const transaction = await this.ctx.model.transaction();

    try {

      await this.ctx.model.StaffAuthority.destroy({
        where: {
          authority_id: ids,
        },
        transaction,
      });

      await this.ctx.model.Authority.destroy({
        where: {
          id: ids,
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
  // 查询某个员工权限
  async getStaffAuthority() {
    const { staff_id } = this.ctx.query;

    const result = await this.ctx.model.StaffAuthority.findAll({
      where: {
        staff_id,
      },
      raw: true,
      include: this.ctx.model.Authority,
    });

    return result;
  }
}
module.exports = AuthorityService;
